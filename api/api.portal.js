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

	// access_v2
	invitation : function (req, res) {

		console.log('api.portal.invitation');

		// get client/project
		var path = req.originalUrl.split('/');
		var invite_token = path[3];

		// get token from redis
		var redis_key = 'invite:' + invite_token;
		api.redis.tokens.get(redis_key, function (err, token_store) {

			var stored_invite = api.utils.parse(token_store);

			if (err || !stored_invite) return api.error.missingInformation(req, res);

			var email = stored_invite.email;

			// make sure logged out
			req.logout();

			// render invitation
			res.render('../../views/invitation.ejs', {
				invite : token_store,
				access_token : req.session.access_token || {}
			});

		});
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

			console.log('REQ AUTH?', req.isAuthenticated);
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

	invite : function (req, res) {

		console.log('api.portal.invite');

		// get client/project
		var path = req.originalUrl.split('/');
		var invite_token = path[2];

		console.log('invite_token', invite_token);

		// get token from redis
		var redis_key = 'invite:token:' + invite_token;
		api.redis.tokens.get(redis_key, function (err, token_store) {
			console.log('err/token_store', err, token_store);

			var stored_invite = api.utils.parse(token_store);

			if (err || !stored_invite) return api.error.missingInformation(req, res);

			// make sure logged out
			req.logout();

			// render invitation
			res.render('../../views/invitation.ejs', {
				invite : token_store,
				access_token : req.session.access_token || {}
			});

		});

		// console.log('api.portal.invite');

		// // get client/project
		// var path = req.originalUrl.split('/');
		// var invite_token = path[2];

		// // get token from redis
		// var redis_key = 'invite:token:' + invite_token;
		// api.redis.tokens.get(redis_key, function (err, token_store) {

		// 	// if logged in
		// 	if (req.isAuthenticated()) {
		// 		res.render('../../views/app.serve.ejs', {
		// 			hotlink : {},
		// 			access_token : req.session.access_token || {}
		// 		});

		// 	// if not logged in
		// 	} else {
		// 		res.render('../../views/invite.ejs', {
		// 			invite : token_store,
		// 			access_token : req.session.access_token || {}
		// 		});
		// 	}
		// });
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