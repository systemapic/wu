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

// api
var api = module.parent.exports;


// exports
module.exports = api.token = { 

	// middleware for routes
	authenticate : function (req, res, next) {
		var access_token = req.body.access_token || req.query.access_token;
		api.token.check(access_token, function (err, user) {
			if (err) return res.status(401).send({error : err.message});
			if (!user) return res.status(401).send({error : 'Invalid access token.'});

			User
			.findOne({_id : user._id})
			.exec(function (err, userModel) {
				
				// redact password
				if (userModel && userModel.local && userModel.local.password) {
					userModel.local.password = true;
				}

				// attach user to req, next
				req.user = userModel;
				next();
			});
		});
	},

	// route: get access token from password
	get_from_pass : function (req, res) {
		api.token._get_from_pass(req.body, function (err, access_token) {
			if (err) return res.status(401).send({error : err.message});
			res.send(access_token);
		});
	},

	// route: refresh access token
	refresh : function (req, res) {
		api.token.reset(req.user, function (err, access_token) {
			if (err) return res.status(401).send(err.message);
			res.send(access_token);
		});
	},

	// route: get user info
	userInfo : function (req, res) {

		// get public or user from session
		api.token.getSession(req, function (err, user_and_access_token) {
			if (err) return res.status(401).send(err.message);
			res.send(user_and_access_token);
		});
	},














	getSession : function (req, done) {
		// console.log('getSession', req.session)
		
		// check for session
		if (req.session) {
			var access_token = req.session.access_token;
			// console.log('GOT SESSION??!', req.session, access_token);
		} 

		done(null, {
			user : {},
			access_token : 'maybe'
		})
	},





	// get access token from password
	_get_from_pass : function (options, done) {

		// details
		var ops = [];
		var refresh = (options.refresh == 'true');
		var username = options.username;
		var password = options.password;

		// throw if no credentials
		if (_.isEmpty(username) || _.isEmpty(password)) return done(new Error('Invalid credentials.'));

		// find user from email or username
		ops.push(function (callback) {
			User.findOne({$or : [{'local.email' : username}, {username : username}]}).exec(callback);
		});

		// check password, get token
		ops.push(function (user, callback) {
			if (!user) return callback(new Error('Invalid credentials.'))

			// check password
			if (!user.validPassword(password)) return callback(new Error('Invalid credentials.'));

			// next
			callback(null, user);
		});

		ops.push(function (user, callback) {

			if (refresh) {

				// reset access token
				api.token.reset(user, callback);
			} else {

				// get access token for user
				api.token.get_create(user, callback);
			}
			
		});

		// run ops
		async.waterfall(ops, function (err, access_token) {
			if (err) return done(new Error('Invalid credentials.'));
			done(null, access_token);
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
			if (err) return done(err);
			if (!token) return done(new Error('Invalid access token.'));

			var stored_token = JSON.parse(token);

			User
			.findOne({_id : stored_token.user_id})
			.exec(done)
		});
	},

	// should always return an access_token (get or create)
	get_create : function (user, done) {
		api.token.get(user, function (err, access_token) {
			if (err) return done(err);

			// create if not exists
			if (!access_token) return api.token.create(user, done);
			
			// return token
			done(null, access_token);
		});
	},

	// create access token
	create : function (user, done) {
		console.log('crate:', user, done);
		var token = {
			access_token : 'pk.' + api.token.generateToken(40),
			expires : api.token.calculateExpirationDate(36000),
			token_type : 'multipass'
		};

		// save token
		api.token.set({
			user : user,
			token : token
		}, done);
	},

	// reset access token
	reset : function (user, done) {
		api.token.create(user, done);
	},

	

	getPublic : function (done) {
		var ops = [];
		ops.push(function (callback) {
			User
			.findOne({uuid : 'systemapic-public'})
			.exec(function (err, public_user) {
				console.log('pub user?', err, public_user);
				if (err) return callback(err);
				if (!public_user) return api.token.createPublicUser(callback);
				callback(null, public_user);
			});
		});

		ops.push(function (public_user, callback) {
			api.token.create(public_user, callback);
		});

		async.waterfall(ops, function (err, result) {
			console.log('getPublic err, res', err, result);
			done(err, result);
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
		public_user.save(done);
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
	},

}