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
		});

	},

	// process wildcard paths, including hotlinks
	wildcard : function (req, res) {

		console.log('wildcard: ', req.originalUrl);

		// get client/project
		var path = req.originalUrl.split('/');
		var username = path[1];
		var project_slug = path[2];
		var hotlink = {
			username : username,
			project : project_slug
		};

		req.session.hotlink = hotlink;
		res.render('../../views/app.serve.ejs', {
			hotlink : hotlink || {}
		});
	
		return;
		
	},

	logout : function (req, res) {
		req.session.reset();
		req.logout();
		res.redirect('/');
	},

	login : function (req, res) {
		res.render(path.join(__dirname, '../views/login.serve.ejs'), { message: req.flash('loginMessage') });
	},

	
	getBase : function (req, res) {


		var options = {
			hotlink : {},
			access_token : req.session.tokens || {}
		};

		res.render('../../views/app.serve.ejs', options);

	},


	joinBeta : function (req, res, next) {
		if (!req.query) {
			return res.end();
		}

		var email = req.query.email;

		if (_.isEmpty(email)) return res.end();

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
		    invite = api.portal._checkInvite(options);	 // check for invite token


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
		};

		// get account
		a.account = function (callback) {
			api.user.getAccount({
				user : account
			}, callback);
		};

		// get projects
		a.projects = function (callback) { 
			api.project.getAll({
				user : account
			}, callback);
		};

		// get users
		a.users = function (callback) {
			api.user.getAll({
				user : account
			}, callback);
		};

		// // portal access
		// a.access = function (callback) {
		// 	api.access.getAll({
		// 		user : account
		// 	}, callback);
		// };

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

	status : function (req, res, next) {

		// if .. req.isAuthenticated()

		console.log('req.user: ', req.user);

		var ops = {};

		// get versions
		ops.versions = function (callback) {
			api.portal.getVersions(function (err, versions) {
				if (err) {
					return callback(err);
				}

				var versions = versions || {};
				callback(null, {
					systemapic_api : api.version, 
					postgis : versions.postgis,
					postgres : versions.postgres, 
					mongodb : versions.mongo,
					redis : versions.redis
				});
			});
		};

		async.series(ops, function (err, status) {
			if (err) {
				return next(err);
			}

			res.send({
				status : status
			});
		});

	},


	_queryVersions : function (done) {

		var ops = {};

		ops.postgis = function (callback) {

			// create database in postgis
			exec('../scripts/postgis/get_postgis_version.sh', {maxBuffer: 1024 * 50000}, function (err, stdout, stdin) {
				if (err) return done(null);

				var json = stdout.split('\n')[2];
				var data = api.utils.parse(json);
				var replaced = '';
				
				if (!data) {
					return callback('no data');
				}
				
				if (data.default_version && _.isFunction(data.default_version.replace)) {
					replaced = data.default_version.replace(/"/g, "");
				}

				if (data.postgis_full_version && _.isFunction(data.postgis_full_version.replace)) {
					replaced = replaced.replace(/"/g, "");
				}
				
				// callback
				callback(null, replaced);
			});
		};

		ops.postgres = function (callback) {

			// create database in postgis
			exec('../scripts/postgis/get_postgres_version.sh', {maxBuffer: 1024 * 50000}, function (err, stdout, stdin) {
				if (err) return done(null);

				var json = stdout.split('\n')[2];
				var data = api.utils.parse(json);

				if (!data) return callback('no data');
				
				// callback
				callback(null, data.version);
			});
		};

		ops.mongo = function (callback) {

			var mongoose = require('mongoose');

			mongoose.connect('mongodb://localhost/test', function(err){
				var admin = new mongoose.mongo.Admin(mongoose.connection.db);
					admin.buildInfo(function (err, info) {
					console.log(info.version);
					callback(null, info.version);
				});
			});
		};

		ops.redis = function (callback) {


			api.redis.stats.info(function (err, stats) {
				console.log('err, stats', err, stats);

				var redis_info = require('redis-info');
				var info = redis_info.parse(stats);

				// var info = api.utils.parse(info);
				console.log('info:', info.redis_version);
				callback(err, info.redis_version);
			});

		};

		async.parallel(ops, function (err, versions) {
			if (err) return done(err);

			versions.timestamp = Date.now();

			// write to redis
			api.redis.stats.set('status_version', JSON.stringify(versions));

			// return
			done(err, versions);
		});
	},

	_readVersions : function (done) {

		// write to redis
		api.redis.stats.get('status_version', function (err, status) {
			var versions = api.utils.parse(status);

			if (!versions) return done('too old');

			// query new version if older than ten seconds
			if (Date.now() - versions.timestamp > 10000) {
				return done('too old');
			}  else {
				done(null, versions);
			}

		});

	},

	getVersions : function (done) {
		api.portal._readVersions(function (err, versions) {
			if (err) return api.portal._queryVersions(done);

			done(null, versions);
		});
	},

	clearTemporaryFolder : function () {
		var path = api.config.path.temp;
		fs.emptyDir(path, function () {});
	},

};

// convert logo image from base64
api.utils.preRenderLogos();

// delete tmp folder on resta
api.portal.clearTemporaryFolder();
