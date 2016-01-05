// API: api.portal.js

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
var _ 		= require('lodash-node');
var fs 		= require('fs-extra');
var gm 		= require('gm');
var kue 	= require('kue');
var fss 	= require("q-io/fs");
var zlib 	= require('zlib');
var uuid 	= require('node-uuid');
var util 	= require('util');
var utf8 	= require("utf8");
var mime 	= require("mime");
var path 	= require('path');
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
module.exports = api.portal = { 


	invite : function (req, res) {

		// get client/project
		var path = req.originalUrl.split('/');
		var invite_token = path[2];

		// get token from redis
		var redis_key = 'invite:token:' + invite_token;
		api.redis.tokens.get(redis_key, function (err, token_store) {

			var stored_invite = api.utils.parse(token_store);

			if (err || !stored_invite) return api.error.missingInformation(req, res);

			// handle already logged in users
			if (req.isAuthenticated()) {
				
				// link invite, and logged in - just add access to user, log in
				if (stored_invite.type == 'link') {

					// include access and log in
					return api.portal.includeAccess({
						res : res,
						req : req,
						invite : stored_invite
					});
					
				}

				// logged in + same email as invite -> include access and log in
				if (stored_invite.type == 'email' && stored_invite.email == req.user.getEmail()) {

					// include access and log in
					return api.portal.includeAccess({
						res : res,
						req : req,
						invite : stored_invite
					});
				} 

			}

			// make sure logged out
			req.logout();

			// render invitation
			res.render('../../views/invitation.ejs', {
				invite : token_store,
				access_token : req.session.access_token || {}
			});

		});

	},


	includeAccess : function (options) {
		var req = options.req;
		var res = options.res;
		var user = req.user;
		var invite = options.invite;
		var access = invite.access;
		var ops = [];


		// { 
		// 	email: false,
		// 	access: { 
		// 		edit: [], 
		// 		read: [Object] 
		// 	},
		// 	token: 'e0Ju2hb',
		// 	invited_by: 'user-b19142c6-a86e-4b8b-9735-d2b7dbf4710b',
		// 	timestamp: 1448381150099 
		// }

		ops.push(function (callback) {

			// add invited to contact list

			User
			.findOne({uuid : invite.invited_by})
			.exec(function (err, user_that_invited) {
				if (err) return callback(err);

				// add new user to inviter's contact list
				user_that_invited.contact_list.push(user._id);

				// and vice versa
				user.contact_list.push(user_that_invited._id);
			
				// save both
				user_that_invited.save(function (err) {

					user.save(function (err) {
						callback(null);
					});
				});
			});

		});

		ops.push(function (callback) {

			// add user to edit projects
			var edits = invite.access.edit;

			if (!edits.length) return callback(null);

			async.each(edits, function (e, cb) {

				Project
				.findOne({uuid : e})
				.exec(function (err, project) {
					project.access.edit.addToSet(user.getUuid());
					project.markModified('access');
					project.save(cb)
				});

			}, function (err) {
				if (err) console.log('each edit err: ', err);
				callback(null);
			})

		});

		ops.push(function (callback) {

			// add user to read projects
			var reads = invite.access.read;

			if (!reads.length) return callback(null);

			async.each(reads, function (e, cb) {

				Project
				.findOne({uuid : e})
				.exec(function (err, project) {
					project.access.read.addToSet(user.getUuid());
					project.markModified('access');
					project.save(cb)
				});

			}, function (err) {
				if (err) console.log('each read err: ', err);
				callback(null);
			})

		});


		async.series(ops, function (err, results) {
			if (err) console.log('includeAccess err: ', err);

			res.render('../../views/app.serve.ejs', {
				hotlink : {},
				access_token : req.session.access_token || {}
			});
		})

		

	},

	// process wildcard paths, including hotlinks
	wildcard : function (req, res) {

		// get client/project
		var path = req.originalUrl.split('/'),
		    client = path[1],
		    project = path[2],
		    hotlink = {
			client : client,
			project : project
		    };

		if (req.isAuthenticated()) {

			req.session.hotlink = hotlink;
			res.render('../../views/app.serve.ejs', {
				hotlink : hotlink || {},
				access_token : req.session.access_token || {}
			});
		} else {
			// redirect to login with hotlink embedded
			req.session.hotlink = hotlink;
			res.redirect('/login');
		}
	},

	logout : function (req, res) {
		req.logout();
		res.redirect('/');
	},

	login : function (req, res) {
		res.render(path.join(__dirname, '../views/login.serve.ejs'), { message: req.flash('loginMessage') });
	},

	


	getBase : function (req, res) {

		// return if not logged in 			
		if (!req.isAuthenticated()) return res.render('../../views/index.ejs'); 
		
		// create access token TODO: hacky, rewrite errything
		var authCode = {
			scope : '*',
			userID : req.user._id,
			clientID : 1,
			expires_in : api.oauth2.calculateExpirationDate()
		}
		var token = api.oauth2.util.uid(api.config.token.accessTokenLength);
		api.oauth2.store.accessTokens.save(token, authCode.expires_in, authCode.userID, authCode.clientID, authCode.scope, console.log);

		var refresh_token = api.oauth2.util.uid(api.config.token.accessTokenLength);
		api.oauth2.store.accessTokens.save(refresh_token, authCode.expires_in, authCode.userID, authCode.clientID, authCode.scope, console.log);

		var access_token = {
			access_token : token,
			expires_in : authCode.expires_in,
			scope : authCode.scope,
			refresh_token : refresh_token
		}

		req.session.access_token = access_token;

		// render app html				
		res.render('../../views/app.serve.ejs', {
			hotlink : req.session.hotlink,
			access_token : access_token
		});

		// reset hotlink
		req.session.hotlink = {};
	},


	joinBeta : function (req, res) {
		if (!req.query) return res.end();

		var email = req.query.email;

		// add to redis
		api.redis.stats.lpush('beta_access', email);

		// send email
		api.email.sendJoinBetaMail(email);

		// debug print
		api.portal.getBetaMembers();

		// return
		res.end();
	},

	getBetaMembers : function () {
		api.redis.stats.lrange('beta_access', 0, -1, function (err, members) {
			if (err) console.log('err:', err);
			console.log('beta access members: ', members);
		});
	},

	_checkInvite : function (options) {
		var invite_token = options.invite_token;
		if (!invite_token) return false;
		if (invite_token.length == 20) return true;
		return false;
	},

	
	// served at initalization of Portal
	getPortal : function (req, res) {

		// print debug
		api.portal.printDebug(req);

		// options
		var options = req.body,
		    account = req.user,
		    a = {}, 
		    invite = this._checkInvite(options);	 // check for invite token


		// api.debug.hardCrash();


		// include invite access
		if (invite) a.invite = function (callback) {

			// process token
			api.user._processInviteToken({
				user : req.user,
				invite_token : options.invite_token
			}, function (err, project_json) {
				callback(null, project_json);
			});
		}	

		// a.roles = function (callback) {
		// 	api.user._getRoles({
		// 		user : account
		// 	}, callback);
		// }	

		// get account
		a.account = function (callback) {
			api.user.getAccount({
				user : account
			}, callback);
		}

		// get projects
		a.projects = function (callback) { 
			api.project.getAll({
				user : account
			}, callback);
		}

		// get users
		a.users = function (callback) {
			api.user.getAll({
				user : account
			}, callback);
		}

		// portal access
		a.access = function (callback) {
			api.access.getAll({
				user : account
			}, callback);
		}

		// series
		async.series(a, function (err, result) {
			if (err || !result) return api.error.general(req, res, err || 'No result.');

			var gzip = true;
			if (req.body.gzip === 'false') gzip = false;

			if (!gzip) return res.json(result);
			
			// return result gzipped
			res.writeHead(200, {'Content-Type': 'application/json', 'Content-Encoding': 'gzip'});
			zlib.gzip(JSON.stringify(result), function (err, zipped) {
				res.end(zipped);
			});
		});
	},

	printDebug : function (req) {
		console.log('_______________________________________________________________________'.yellow);
		console.log('Logged in user:'.yellow);
		console.log('  Name:  ' + req.user.firstName + ' ' + req.user.lastName);
		console.log('  Uuid:  ' + req.user.uuid);
		console.log('  Email: ' + req.user.local.email);
		console.log('  IP:    ' + req.headers['x-forwarded-for']);
		console.log('_______________________________________________________________________'.yellow);
		console.log('_______________________________________________________________________'.yellow);
		console.log('');
	},

}