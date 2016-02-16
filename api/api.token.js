// API: api.token.js

// database schemas
var Project 	= require('../models/project');
var Clientel 	= require('../models/client');	// weird name cause 'Client' is restricted name
var User  	= require('../models/user');
var File 	= require('../models/file');
var Layer 	= require('../models/layer');
var Hash 	= require('../models/hash');
var Role 	= require('../models/role');
var Group 	= require('../models/group');

// utils
var _ 		= require('lodash');
var fs 		= require('fs-extra');
var gm 		= require('gm');
var kue 	= require('kue');
var fss 	= require("q-io/fs");
var zlib 	= require('zlib');
var uuid 	= require('node-uuid');
var util 	= require('util');
var utf8 	= require("utf8");
var mime 	= require("mime");
var exec 	= require('child_process').exec;
var dive 	= require('dive');
var async 	= require('async');
var carto 	= require('carto');
var crypto      = require('crypto');
var fspath 	= require('path');
var mapnik 	= require('mapnik');
var request 	= require('request');
var nodepath    = require('path');
var formidable  = require('formidable');
var nodemailer  = require('nodemailer');
var uploadProgress = require('node-upload-progress');
var mapnikOmnivore = require('mapnik-omnivore');
var errors = require('../shared/errors');
var httpStatus = require('http-status');

// api
var api = module.parent.exports;


// exports
module.exports = api.token = { 

	// middleware for routes
	authenticate : function (req, res, next) {
		var access_token = req.body.access_token || req.query.access_token;
		api.token._authenticate(access_token, function (err, user) {
			if (err || !user) return res.status(401).send({error : err.message});
			req.user = user;
			next();
		});
	},

	// middleware for socket routes
	authenticate_socket : function (req, done) {
		console.log('#101 auth socket', req.data, done);
		var access_token = req.data.access_token;	
		api.token._authenticate(access_token, function (err, user) {
			console.log('#102 auth socket:', err, user);
			if (err) return done(err);
			if (!user) return done(new Error('Invalid access token.'));
			done(null, user);
		});
	},

	_authenticate : function (access_token, done) {

		// verify access_token
		api.token.check(access_token, function (err, user) {
			if (err) return done(err);
			if (!user) return done(new Error('Invalid access token.'));
			User
			.findOne({_id : user._id})
			.exec(done);
		});
	},

	// route: get access token from password
	getTokenFromPassword : function (req, res, next) {
		api.token._get_token_from_password(req.body || {}, function (err, tokens) {
			if (err) {
				return next(err);
			}

			// update cookie
			req.session.tokens = api.utils.parse(tokens);

			// return tokens
			res.send(tokens);
		});
	},

	// get access token from password
	_get_token_from_password : function (options, done) {
		// details
		var ops = [];
		var username = options.username || options.email;
		var password = options.password;
		var missingRequiredFields = [];

		if (!username) {
			missingRequiredFields.push('username or email');
		}

		if (!password) {
			missingRequiredFields.push('password');
		}

		// throw if no credentials
		if (!_.isEmpty(missingRequiredFields)) {
			return done(api.error.code.missingRequiredRequestFields(errors.missing_information.errorMessage, missingRequiredFields));
		}

		// find user from email or username
		ops.push(function (callback) {
			User.findOne({$or : [{'local.email' : username}, {username : username}]}).exec(callback);
		});

		// check password, get token
		ops.push(function (user, callback) {

			// no user
			if (!user) {
				return callback({
					code: httpStatus.NOT_FOUND,
					message: errors.no_such_user.errorMessage
				});
			}

			// check password
			if (!user.validPassword(password)) {
				return callback({
					code: httpStatus.BAD_REQUEST,
					message: errors.invalid_credentials.errorMessage
				});
			}
			// next
			callback(null, user);
		});

		// refresh or dont
		ops.push(function (user, callback) {

			// get access token for user
			api.token.get_create_token(user, callback);
		});

		// run ops
		async.waterfall(ops, function (err, access_token) {
			if (err) {
				return done(err);
			}
			// all good, return access_token
			done(null, access_token);
		});

	},

	// should always return an access_token (get or create)
	get_create_token : function (user, done) {
		api.token.get(user, function (err, access_token) {
			if (err) return done(err);

			// create if not exists
			if (!access_token) {

				// create token
				api.token.createToken(user, function (err, access_token) {
					done(err, JSON.stringify(access_token));
				});
			} else {
				// return token
				done(null, access_token);
			}
			
			
		});
	},

	// create access token
	createToken : function (user, done) {
		var token = {
			access_token : 'pk.' + api.token.generateToken(40),
			expires : api.token.calculateExpirationDate(36000),
			token_type : 'multipass'
		};

		// save token
		api.token.set({
			user : user,
			token : token
		}, function (err) {
			done(err, token);
		});
	},


	// route: refresh access token
	refresh : function (req, res, next) {
		api.token.reset(req.user, function (err, access_token) {
			if (err) {
				err.code = err.code || 401;
				next(err);
			}

			res.send(access_token);
		});
	},

	// route: check if existing session, returns tokens only
	checkSession : function (req, res) {

		var ops = [];

		// check for access_token in session
		var tokens = _.isObject(req.session) ? req.session.tokens : false;

		// no session, return public user
		if (!tokens) return api.token.getPublicToken(function (err, public_token) {
			res.send(public_token);
		});

		// got some session, either public or user
		api.token.check(tokens.access_token, function (err, user) {

			console.log('checked for token..', err, user);

			// no session, return public user
			if (err) return api.token.getPublicToken(function (err, public_token) {
				res.send(public_token);
			});

			// return user
			res.send(tokens);
		});
	},



	// retrieve access token
	get : function (user, done) {
		var key = 'access_token:' + user._id + user.uuid;
		api.redis.tokens.get(key, done);
	},

	// save access token
	set : function (options, done) {
		var ops = [];
		var user = options.user;
		var token = options.token;
		ops.push(function (callback) {
			// save user to access_token
			var key = 'access_token:' + user._id + user.uuid;
			api.redis.tokens.set(key, JSON.stringify(token), callback);
		});
		ops.push(function (callback) {
			// save access_token to user
			var key = token.access_token;
			api.redis.tokens.set(key, JSON.stringify({
				user_id : user._id,
				token : token
			}), callback);
		});
		async.parallel(ops, function (err, result) {
			done(err, token);
		});
	},

	// check if access token is valid
	check : function (access_token, done) {
		api.redis.tokens.get(access_token, function (err, token) {
			if (err) return done(new Error('Invalid access token.'));
			if (!token) return done(new Error('Invalid access token.'));

			var stored_token = api.utils.parse(token);

			User
			.findOne({_id : stored_token.user_id})
			.exec(done)
		});
	},


	// create public access token
	createPublicToken : function (user, done) {
		var token = {
			access_token : 'public',
			expires : api.token.calculateExpirationDate(3600000000),
			token_type : 'multipass',
			public : true
		};

		// save token
		api.token.set({
			user : user,
			token : token
		}, done);
	},

	// reset access token
	reset : function (user, done) {
		api.token.createToken(user, done);
	},


	getPublicToken : function (done) {
		var ops = [];
		ops.push(function (callback) {
			api.token.getPublicUser(callback);
		});

		ops.push(function (public_user, callback) {
			api.token.createPublicToken(public_user, callback);
		});

		async.waterfall(ops, function (err, public_token) {
			done(err, public_token);
		});
	},

	getPublicUser : function (done) {
		User
		.findOne({uuid : 'systemapic-public'})
		.exec(function (err, public_user) {
			if (err) return done(err);
			if (!public_user) return api.token.createPublicUser(done);
			done(null, public_user);
		});
	},

	// only runs once ever, but better to
	// have init here than in external scripts
	createPublicUser : function (done) {

		// create the user
		var public_user            	= new User();
		public_user.local.email    	= 'info@systemapic.com';
		public_user.local.password 	= 'systemapic-public';
		public_user.uuid 		= 'systemapic-public';
		public_user.username 		= 'public';
		public_user.company 		= 'Systemapic'
		public_user.position 		= 'Public'
		public_user.firstName 		= 'Systemapic'
		public_user.lastName 		= 'Public';
		public_user.invitedBy 		= 'self';

		// save the user
		public_user.save(function (err, user) {
			done(err, user);
		});
	},









	// utils
	calculateExpirationDate : function (duration) {
		var duration = duration || api.config.token.expiresIn;
		return new Date(new Date().getTime() + (duration * 1000));
	},
	generateToken : function (len) {
		var buf = [];
		var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var charlen = chars.length;
		for (var i = 0; i < len; ++i) { 
			buf.push(chars[api.token.getRandomInt(0, charlen - 1)]);
		}
		return buf.join('');
	},
	getRandomInt : function (min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

};