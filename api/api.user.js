// API: api.user.js

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
module.exports = api.user = { 


	// invite users
	invite : function (req, res) {
		var options = req.body;

		// invite users
		api.user._invite(options, function (err, results) {
			res.json(results);
		});


	},

	_invite : function (options, callback) {

		var access_type = options.access_type,
		    invite_emails = options.emails,
		    project_id = options.project_id;


		console.log('INVITE ?USERS', options);


		// 1. if exisitng user, add access and notify
		// 2. if not existing, send create user link and store access in redis or whatever


		// if not existing
		// ---------------
		// 
		// - need to send link to user with token. 
		// - token must be stored in redis and contain: email, project, type access, who invited, when invited 
		// - possible to sign up with that email address only
		// - when following link, taken to sign-up site: 
		// 	1) enter details (name, organization, type profession?, etc.)
		//	2) will create account on that email, give view/edit access to project.
		// 	3) log user in immediately, activate project
		// 	
		// - should take invited user < 1 min to sign up.
		//
		// - new user has access to:
		// 	1) view/edit project invited for
		// 	2) NOT create new project ...
		// 	3) NOT upload data 
		// 	4) invite others for VIEW
		// 	
		// 	- should set certain limitations on others' servers. ie, if GLOBESAR has a server, others should perhaps not
		//		be able to invite to it. perhaps invite to SYSTEMAPIC server instead?
		// 	- actually, only GLOBESAR should be able to invite uploaders to his own portal.
		// 	- need to syncronize servers soon! 



		// PILOT FLOW:
		// 1. frano can only invite VIEWERS
		// 2. if he wants more admins, we'll add them for him.
		// 3. anybody can invite VIEWERS to own projects ?
		//
		// 4. ALSO would be really cool: just send anyone a link, and they can login/register and get access to project.


		var results = {

		}

		callback(null, options);

	},



	_inviteNewUser : function (options, callback) {



	},

	_inviteExistingUser : function (options, callback) {



	},




	// create user
	create : function (req, res) {
		if (!req.body) return api.error.missingInformation(req, res);

		// user not added to any roles on creation
		// blank user with no access - must be given project access, etc.

		var account = req.user,
		    projectUuid = req.body.project,
		    userUuid = req.user.uuid,
		    options = req.body;
		    ops = [];

		// return on missing info
		if (!options.email) return api.error.missingInformation(req, res);

		console.log('create user', account, projectUuid, options);

		// permissions hack, need project to get a capability... todo: refactor whole permissions thing
		ops.push(function (callback) {
			if (projectUuid) {
				api.project._getProjectByUuid(projectUuid, callback);
			} else {
				api.project._getProjectByUserUuidAndCapability(userUuid, 'create_user', callback);

			}
		});

		// check access
		ops.push(function (project, callback) {
			api.access.to.create_user({
				user : account,
				project : project
			}, callback);
		});

		// create user
		ops.push(function (options, callback) {
			api.user._create({
				options : req.body,
				account : account
			}, callback);
		});

		// send email
		ops.push(function (user, password, callback) {
			console.log('got password: '.yellow, password);
			api.email.sendWelcomeEmail(user, password, account);  // refactor plain pass
			callback(null, user);
		});


		// run ops
		async.waterfall(ops, function (err, user) {
			if (err) return api.error.general(req, res, err);

			// done
			res.end(JSON.stringify(user));
		});
	},


	_create : function (job, callback) {
		var options = job.options,
		    account = job.account;

		if (!options || !account) return callback('Missing information.5');

		// create the user
		var user            	= new User();
		var password 		= crypto.randomBytes(16).toString('hex');
		user.uuid 		= 'user-' + uuid.v4();
		user.local.email    	= options.email;	
		user.local.password 	= user.generateHash(password);
		user.firstName 		= options.firstName;
		user.lastName 		= options.lastName;
		user.company 		= options.company;
		user.position 		= options.position;
		user.phone 		= options.phone;
		user.createdBy		= account.getUuid();
		
		// save the user
		user.save(function(err, user) { 
			callback(err, user, password); // todo: password plaintext
		});
	},


	// update user 	// todo: send email notifications on changes?
	update : function (req, res) {
		if (!req.body) return api.error.missingInformation(req, res);

		var userUuid = req.body.uuid,
		    account = req.user,
		    projectUuid = req.body.project,
		    ops = [];

		if (!userUuid || !account || !projectUuid) return api.error.missingInformation(req, res);

		ops.push(function (callback) {
			User
			.findOne({uuid : userUuid})
			.exec(callback);
		});

		ops.push(function (user, callback) {
			Project
			.findOne({uuid : projectUuid})
			.exec(function (err, project) {
				if (err) return callback(err);
				callback(null, user, project);
			});
		});

		ops.push(function (user, project, callback)  {
			api.access.to.edit_user({
				user : account,
				subject : user,
				project : project
			}, callback);
		});

		ops.push(function (options, callback) {
			api.user._update({
				options : req.body,
				user : options.subject
			}, callback);
		});

		async.waterfall(ops, function (err, user) {
			if (err || !user) api.error.general(req, res, err || 'No user.');

			res.end(JSON.stringify(user));
		});
	},


	_update : function (options, callback) {
		if (!options) return callback('Missing information.6');

		var user = options.user,
		    options = options.options,
		    queries = {};

		// valid fields
		var valid = [
			'company', 
			'position', 
			'phone', 
			'firstName',
			'lastName', 
		];

		// enqueue updates for valid fields
		valid.forEach(function (field) {
			if (options[field]) {
				queries = api.user._enqueueUpdate({
					queries : queries,
					field : field,
					options : options,
					user : user
				});
			}
		});

		// do updates
		async.parallel(queries, callback);

	},

	_enqueueUpdate : function (job) {
		if (!job) return;

		var queries = job.queries,
		    options = job.options,
		    field = job.field,
		    user = job.user;

		// create update op
		queries[field] = function(callback) {	
			user[field] = options[field];
			user.markModified(field);
			user.save(callback);
		};
		return queries;
	},

		
	// delete user  	
	deleteUser : function (req, res) {
		if (!req.body) return api.error.missingInformation(req, res);
	
		var userUuid = req.body.uuid,
		    account = req.user,
		    ops = [];

		ops.push(function (callback) {
			User
			.findOne({uuid : userUuid})
			.exec(callback);
		});

		ops.push(function (user, callback) {
			api.access.to.delete_user({
				user : account,
				subject : user
			}, callback);
		});

		ops.push(function (options, callback) {
			if (!options || !options.subject) return callback('Missing information.7');

			//deleting token 
			var deletedUser = options.subject;
			var token = deletedUser.token; 
			if (token) api.redis.temp.del(token); 

			//removing the whole user
			options.subject.remove(callback);

		});

		async.waterfall(ops, function (err, user) {
			if (err || !user) api.error.general(req, res, err);

			// done
			res.end(JSON.stringify(user));

			// todo: send email notifications?
		});
	},


	// check unique email
	checkUniqueEmail : function (req, res) {
		if (!req.body) return api.error.missingInformation(req, res);

		var user = req.user,
		    email = req.body.email,
		    unique = false;

		User.findOne({'local.email' : email}, function (err, result) {
			if (err) return api.error.general(req, res, 'Error checking email.');
			if (!result) unique = true; 
			return res.end(JSON.stringify({
				unique : unique
			}));
		});
	},


	getAll : function (options, done) {
		if (!options) return done('No options.');

		var user = options.user;

		// check if admin
		api.access.is.admin({
			user : user
		}, function (err, isAdmin) {
			// not admin, get all users manually
			if (err || !isAdmin) return api.user._getAllFiltered(options, done);
			
			// is admin, get all
			api.user._getAll(options, done);
		});
	},


	_getUserByUuid : function (userUuid, done) {
		User
		.find({uuid : userUuid})
		.exec(done);
	},

	_getUserProjects : function (userUuid, done) {

		// get user
		api.user._getUserByUuid(userUuid, function (err, user) {
			if (err) return done(err);

			var userProjects = [];

			// get all projects
			api.project._getAll(function (err, projects) {	
				if (err) return done(err);

				// filter projects that has roles with user as member
				projects.forEach(function (project) {
					project.roles.forEach(function (role) {
						if (role.members.indexOf(userUuid) >= 0) userProjects.push(project);
					});			
				});

				done(null, userProjects);
			});
		});
	},

	_getSingle : function (options, done) {
		var userUuid = options.user.uuid;

		User
		.findOne({uuid : userUuid})
		.populate('files')
		.exec(done);
	},

	_getAll : function (options, done) {
		User
		.find()
		.populate('files')
		.exec(done);
	},

	_getAllFiltered : function (options, done) {
		if (!options) return done('No options.');

		// get all role members in all projects that account has edit_user access to
		var user = options.user,
		    ops = [];

		ops.push(function (callback) {
			// get account's projects
			api.project.getAll({
				user: user,
				cap_filter : 'edit_user'
			}, callback);
		});

		ops.push(function (projects, callback) {
			// get all roles of all projects
			var allRoles = [];
			_.each(projects, function (project) {
				_.each(project.roles, function (role) {
					allRoles.push(role);
				});
			});
			callback(null, allRoles)
		});

		ops.push(function (roles, callback) {
			var allUsers = [];
			_.each(roles, function (role) {
				_.each(role.members, function (member) {
					allUsers.push(member);
				});
			});
			callback(null, allUsers);
		});
		
		// get user models
		ops.push(function (users, callback) {
			User
			.find()
			.populate('files')
			.or([
				{ uuid : { $in : users }}, 		// roles
				{ createdBy : user.getUuid()}, 	// createdBy self
				{ uuid : user.getUuid()} 		// self
			])
			.exec(callback);
		});

		async.waterfall(ops, function (err, users) {
			done(err, users);
		});
	},
}
