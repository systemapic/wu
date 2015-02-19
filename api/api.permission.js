// API: api.permission.js

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



var api = module.parent.exports;
console.log('PERMISSONS === api=>', api);

// redis store for temp passwords
var redis = require('redis');
var redisStore = redis.createClient(api.config.temptokenRedis.port, api.config.temptokenRedis.host)
redisStore.auth(api.config.temptokenRedis.auth);
redisStore.on('error', function (err) { console.error(err); });


module.exports = api.permission = {

	

	forgotPassword : function (req, res) {

		// render page and pass in flash data if applicable
		res.render('../../views/login.serve.ejs', { message: 'Please check ' + req.body.email + ' for new login details.' });

		var email = req.body.email;

		console.log('email: ', email);

		User
		.findOne({'local.email' : email})
		.exec(function (err, user) {

			console.log('err, user, ', err, user);

			if (err || !user) return res.end();

			var password = crypto.randomBytes(16).toString('hex');
			user.local.password = user.generateHash(password);
			user.markModified('local');
		
			// save the user
			user.save(function(err, doc) { 

				// send email with login details to user
				api.email.sendNewUserEmail(user, password);
			
			});
		});
	},



	requestPasswordReset : function (req, res) {

		// send email with link to confirm pass change.

		console.log('requestPasswordReset');
		// var user = req.user;
		console.log('req.useR: ', req.user);
		console.log('req.body: ', req.body);

		// get email
		var email = req.body.email;

		User
		.findOne({'local.email' : email})
		.exec(function (err, user) {

			console.log('22 err, user', err, user);

			// send password reset email
			if (!err && user) api.email.sendPasswordResetEmail(user);

			// finish
			res.render('../../views/login.serve.ejs', { message: 'Please check your email for further instructions.' });
			res.end();

		});
	},

	confirmPasswordReset : function (req, res) {

		console.log('confirm reset');

		var email = req.query.email;
		var token = req.query.token;

		console.log('email: ', email);
		console.log('token: ', token);

		User
		.findOne({'local.email' : email})
		.exec(function (err, user) {

			// err
			if (err || !user) console.error('no user ?', err, user);

			// check token
			api.permission.checkPasswordResetToken(user, token, function (valid) {

				// reset if valid token
				if (valid) {
					api.permission.resetPassword(user);
					var message = 'Please check your email for new login details.';
				} else {
					var message = 'Authorization failed. Please try again.';
				}

				// finish
				res.render('../../views/login.serve.ejs', { message : message });
			});
		});

	},

	resetPassword : function (user) {
		console.log('resetting passowrd');

		var password = crypto.randomBytes(16).toString('hex');
		user.local.password = user.generateHash(password);
		user.markModified('local');
	
		// save the user
		user.save(function(err, doc) { 

			// send email with login details to user
			api.email.sendNewUserEmail(user, password);
		
		});
	},


	setPasswordResetToken : function (user) {

		console.log('getPasswordResetToken');

		var token = crypto.randomBytes(16).toString('hex');
		var key = 'resetToken-' + user.uuid;



		redisStore.set(key, token);  // set temp token
		redisStore.expire(key, 600); // expire in ten mins


		return token;

	},

	checkPasswordResetToken : function (user, token, callback) {

		console.log('checkpass!');
		console.log(user, token);

		var key = 'resetToken-' + user.uuid;

		redisStore.get(key, function (err, actualToken) {

			console.log('err', err, actualToken);

			// return
			callback(!err && actualToken && actualToken == token)
		});

	},




	_createAccessGroup : function (options, callback) {

		// options
		var roles = options.roles;

		// create mongo
		var group  = new Group();
		group.uuid = 'group-' + uuid.v4();

		// add roles
		roles.forEach(function (role) {
			group.roles.addToSet(role._id);
		});

		// save
		group.save(function (err) {
			callback(null, group);
			console.log('saved group', group);
		});

		

		
	},



	_createRole : function (options, callback) {

		var role 	= new Role();
		role.uuid 	= 'role-' + uuid.v4();
		role.name 	= options.name;
		role.members 	= options.members;
		role.capabilities = api.permission._getRoleTemplate(options);

		// save
		role.save(function (err) {
			callback(null, role);
			console.log('created role', role);
		});


	},



	_getRoleTemplate : function (options) {

		console.log('_getRoleTemplate, ', options);

		var template = options.template,
		    additionalcapabilities = options.capabilities,
		    capabilities = [];

		if (template == 'superAdmin') {

			capabilities.push('create_client'); 	
			capabilities.push('edit_client'); 		
			capabilities.push('edit_other_client'); 	
			capabilities.push('delete_client'); 	
			capabilities.push('delete_other_client');  
			capabilities.push('read_client'); 		
			capabilities.push('create_project'); 	
			capabilities.push('edit_project'); 	
			capabilities.push('edit_other_project'); 	
			capabilities.push('delete_project'); 	
			capabilities.push('delete_other_project');
			capabilities.push('read_project'); 	
			capabilities.push('upload_file'); 	
			capabilities.push('download_file'); 	
			capabilities.push('create_version'); 	
			capabilities.push('delete_version'); 	
			capabilities.push('delete_file'); 	
			capabilities.push('delete_other_file'); 	
			capabilities.push('create_user'); 	
			capabilities.push('edit_user'); 		
			capabilities.push('edit_other_user'); 	
			capabilities.push('delete_user'); 	
			capabilities.push('delete_other_user'); 	
			capabilities.push('share_project'); 	
			capabilities.push('read_analytics'); 	
			capabilities.push('manage_analytics'); 	
			capabilities.push('delegate_to_user'); 

		}	

		if (template == 'portalAdmin') {

			capabilities.push('create_client'); 	
			capabilities.push('edit_client'); 		
			capabilities.push('edit_other_client'); 	
			capabilities.push('delete_client'); 	
			capabilities.push('delete_other_client');  
			capabilities.push('read_client'); 		
			capabilities.push('create_project'); 	
			capabilities.push('edit_project'); 	
			capabilities.push('edit_other_project'); 	
			capabilities.push('delete_project'); 	
			capabilities.push('delete_other_project');
			capabilities.push('read_project'); 	
			capabilities.push('upload_file'); 	
			capabilities.push('download_file'); 	
			capabilities.push('create_version'); 	
			capabilities.push('delete_version'); 	
			capabilities.push('delete_file'); 	
			capabilities.push('delete_other_file'); 	
			capabilities.push('create_user'); 	
			capabilities.push('edit_user'); 		
			capabilities.push('edit_other_user'); 	
			capabilities.push('delete_user'); 	
			capabilities.push('delete_other_user'); 	
			capabilities.push('share_project'); 	
			capabilities.push('read_analytics'); 	
			capabilities.push('manage_analytics'); 	
			capabilities.push('delegate_to_user'); 	

		}

		console.log('TEMPLATE:===> ', template);
		if (template == 'projectOwner') {

			console.log('PROOJECT OWWNWNWNWNWNWNWNNW!!!');

			// capabilities.push('create_client'); 	
			// capabilities.push('edit_client'); 		
			// capabilities.push('edit_other_client'); 	
			// capabilities.push('delete_client'); 	
			// capabilities.push('delete_other_client');  
			// capabilities.push('read_client'); 		
			// capabilities.push('create_project'); 	
			capabilities.push('edit_project'); 	
			// capabilities.push('edit_other_project'); 	
			capabilities.push('delete_project'); 	
			// capabilities.push('delete_other_project');
			capabilities.push('read_project'); 	
			capabilities.push('upload_file'); 	
			capabilities.push('download_file'); 	
			capabilities.push('create_version'); 	
			capabilities.push('delete_version'); 	
			capabilities.push('delete_file'); 	
			capabilities.push('delete_other_file'); 	
			// capabilities.push('create_user'); 	
			// capabilities.push('edit_user'); 		
			// capabilities.push('edit_other_user'); 	
			// capabilities.push('delete_user'); 	
			// capabilities.push('delete_other_user'); 	
			capabilities.push('share_project'); 	
			// capabilities.push('read_analytics'); 	
			// capabilities.push('manage_analytics'); 	
			// capabilities.push('delegate_to_user'); 

		}

		if (template == 'projectEditor') {

			// capabilities.push('create_client'); 	
			// capabilities.push('edit_client'); 		
			// capabilities.push('edit_other_client'); 	
			// capabilities.push('delete_client'); 	
			// capabilities.push('delete_other_client');  
			// capabilities.push('read_client'); 		
			// capabilities.push('create_project'); 	
			capabilities.push('edit_project'); 	
			// capabilities.push('edit_other_project'); 	
			// capabilities.push('delete_project'); 	
			// capabilities.push('delete_other_project');
			capabilities.push('read_project'); 	
			capabilities.push('upload_file'); 	
			capabilities.push('download_file'); 	
			capabilities.push('create_version'); 	
			capabilities.push('delete_version'); 	
			capabilities.push('delete_file'); 	
			// capabilities.push('delete_other_file'); 	
			// capabilities.push('create_user'); 	
			// capabilities.push('edit_user'); 		
			// capabilities.push('edit_other_user'); 	
			// capabilities.push('delete_user'); 	
			// capabilities.push('delete_other_user'); 	
			capabilities.push('share_project'); 	
			// capabilities.push('read_analytics'); 	
			// capabilities.push('manage_analytics'); 	
			// capabilities.push('delegate_to_user'); 

		}

		if (template == 'projectReader') {

			// capabilities.push('create_client'); 	
			// capabilities.push('edit_client'); 		
			// capabilities.push('edit_other_client'); 	
			// capabilities.push('delete_client'); 	
			// capabilities.push('delete_other_client');  
			// capabilities.push('read_client'); 		
			// capabilities.push('create_project'); 	
			// capabilities.push('edit_project'); 	
			// capabilities.push('edit_other_project'); 	
			// capabilities.push('delete_project'); 	
			// capabilities.push('delete_other_project');
			capabilities.push('read_project'); 	
			// capabilities.push('upload_file'); 	
			capabilities.push('download_file'); 	
			// capabilities.push('create_version'); 	
			// capabilities.push('delete_version'); 	
			// capabilities.push('delete_file'); 	
			// capabilities.push('delete_other_file'); 	
			// capabilities.push('create_user'); 	
			// capabilities.push('edit_user'); 		
			// capabilities.push('edit_other_user'); 	
			// capabilities.push('delete_user'); 	
			// capabilities.push('delete_other_user'); 	
			capabilities.push('share_project'); 	
			// capabilities.push('read_analytics'); 	
			// capabilities.push('manage_analytics'); 	
			// capabilities.push('delegate_to_user'); 

		}

		if (template == 'projectManager') {

			// capabilities.push('create_client'); 	
			// capabilities.push('edit_client'); 		
			// capabilities.push('edit_other_client'); 	
			// capabilities.push('delete_client'); 	
			// capabilities.push('delete_other_client');  
			// capabilities.push('read_client'); 		
			// capabilities.push('create_project'); 	
			// capabilities.push('edit_project'); 	
			// capabilities.push('edit_other_project'); 	
			// capabilities.push('delete_project'); 	
			// capabilities.push('delete_other_project');
			// capabilities.push('read_project'); 	
			// capabilities.push('upload_file'); 	
			// capabilities.push('download_file'); 	
			// capabilities.push('create_version'); 	
			// capabilities.push('delete_version'); 	
			// capabilities.push('delete_file'); 	
			// capabilities.push('delete_other_file'); 	
			capabilities.push('create_user'); 	
			capabilities.push('edit_user'); 		
			capabilities.push('edit_other_user'); 	
			capabilities.push('delete_user'); 	
			// capabilities.push('delete_other_user'); 	
			// capabilities.push('share_project'); 	
			// capabilities.push('read_analytics'); 	
			// capabilities.push('manage_analytics'); 	
			// capabilities.push('delegate_to_user'); 

		}

		// add extra capabilities
		// if (additionalcapabilities && additionalcapabilities.length) capabilities = capabilities.concat(additionalcapabilities);

		// return 
		return capabilities;

	},











	// superusers
	superusers : [
		'user-f151263a-8a2f-4bfd-86f0-53e71083fb39', 	// KO dev
		'user-5b51ff49-31f5-4a7a-b17c-d18268079d8f', 	//  J dev
		'user-9fed4b5f-ad48-479a-88c3-50f9ab44b17b', 	// KO rg
		'user-e6e5d7d9-3b4c-403b-ad80-a854b0215831',    //  J rg
		'user-5be55fcd-b8c2-4532-8932-c65e608a1f81', 	// ko m.s
		'user-d4d45439-72bc-4124-95a1-9104b482e50e', 	// j m.s
		'user-a15e2219-4ce2-4cf2-b741-eecfe5520f7d',  	// phantom @ maps.systemapic.com
		'user-f36e496e-e3e4-4fac-a37c-f1a98689afda'   	// dev1@noerd.biz
	],




	// CRUD capabilities
	to : {

		create_client		: function () { 

		},
		
		edit_client 		: function () { 

		},
		
		edit_other_client 	: function () { 

		},
		
		delete_client		: function () { 

		},
		
		delete_other_client  	: function () { 

		},
		
		read_client		: function () { 

		},
		
		create_project 		: function (user) { 
			// check if user has create_project capability
			
			// 1. check superadmins
			// 2. check portal_admins
			// 3. check..?



			// ideas: 
			// 	create a PORTAL db entry?
			// 		- can add custom accessGroups
			// 			- eg. to have others to create_project
			// 
			//	have group on client? a bit messy...? but perhaps very necessary... if so, check client group for create_project
		},
		
		edit_project 		: function () { 

		},
		
		edit_other_project 	: function () { 

		},
		
		delete_project		: function () { 

		},
		
		delete_other_project	: function () { 

		},
		
		read_project		: function () { 

		},
		
		upload_file 		: function () { 

		},
		
		download_file 		: function () { 

		},
		
		create_version 		: function () { 

		},
		
		delete_version 		: function () { 

		},
		
		delete_file 		: function () { 

		},
		
		delete_other_file 	: function () { 

		},
		
		create_user		: function () { 

		},
		
		edit_user 		: function () { 

		},
		
		edit_other_user 	: function () { 

		},
		
		delete_user		: function () { 

		},
		
		delete_other_user 	: function () { 

		},
		
		share_project		: function () { 

		},
		
		read_analytics 		: function () { 

		},
		
		manage_analytics 	: function () { 

		},
		
		delegate_to_user 	: function () { 

		},












		create : {
			project : function (user) {
				if (superadmin(user)) return true;
				if (user.role.admin)  return true;
				return false;
			},
			client : function (user) {
				if (superadmin(user)) return true;
				if (user.role.admin)  return true;
				return false;
			},
			
			user : function (user) {

				// can create users without any CRUD privileges
				if (superadmin(user)) return true;
				if (user.role.admin) return true;

				// if user is manager anywhere
				if (user.role.manager.projects.length > 0) return true;
				return false;
			}
		},

		delegate : {
			superadmin : function (user) {
				if (superadmin(user)) return true;
				return false;
			},
			admin : function (user) {
				if (superadmin(user)) return true;
				return false;
			},
			manager : function (user, project) {
				if (superadmin(user)) return true;

				// can add managers for own projects
				if (user.role.admin && project.createdBy == user.uuid) return true; 

				// if admin and got --U- for someone else's project
				if (user.role.admin && api.can.update.project(user, project)) return true;

				return false;
			},
			editor : function (user, project) { // project or client
				if (superadmin(user)) return true;
				
				// can create editors for own projects
				if (user.role.admin && project.createdBy == user.uuid)  return true;

				// if admin and got --U- for someone else's project
				if (user.role.admin && api.can.update.project(user, project)) return true;

				return false;
			},
			reader : function (user, project) { // project or client
				if (superadmin(user)) return true;

				// can create readers for own projects
				if (user.role.admin && project.createdBy == user.uuid)  return true;

				// if admin and got --U- for someone else's project
				if (user.role.admin && api.can.update.project(user, project)) return true;

				// managers can create readers for own projects
				if (user.role.manager.projects.indexOf(project.uuid) >= 0) return true;

				return false;
			},


		},

		read : {
			project : function (user, project) {
				if (superadmin(user)) return true;

				// admin can -R-- own projects
				if (user.role.admin && project.createdBy == user.uuid)  return true;

				// if manager, editor or reder
				// if (user.role.manager.projects.indexOf(uuid) >= 0) return true;
				// if (user.role.editor.projects.indexOf(uuid)  >= 0) return true;
				if (user.role.reader.projects.indexOf(uuid)  >= 0) return true;

				return false;
			},
			client : function (user, client) {
				if (superadmin(user)) return true;

				// admin can -R-- own clients
				if (user.role.admin && client.createdBy == user.uuid)  return true;

				// if manager, editor, reader
				// if (user.role.manager.clients.indexOf(client.uuid) >= 0) return true; 
				// if (user.role.editor.clients.indexOf(client.uuid)  >= 0) return true; 
				if (user.role.reader.clients.indexOf(client.uuid)  >= 0) return true; 

				return false;
			}
		},

		update : {
			project : function (user, project) {
				if (superadmin(user)) return true;

				// if admin and has created project oneself
				if (user.role.admin && project.createdBy == user.uuid) return true;

				// if editor of project
				if (user.role.editor.projects.indexOf(project.uuid) >= 0) return true; 

				return false;

			},
			client : function (user, client) {
				if (superadmin(user)) return true;

				// hacky error checking
				if (!client) return false;
				if (!user) return false;

				// if admin and has created client oneself
				if (user.role.admin && client.createdBy == user.uuid)  return true;

				// if editor of client
				if (user.role.editor.clients.indexOf(client.uuid) >= 0) return true; // managers can create readers for own projects

				return false;
			},
			user   : function (user, subject, uuid) {  // update of user info, not adding roles
				if (superadmin(user)) return true;

				// if user is created by User (as admin, manager)
				if (subject.createdBy == user.uuid) return true; 
				
				// if is self
				if (subject.uuid == user.uuid) return true;

				return false;				
			},

			file   : function (user, file) {
				if (superadmin(user)) return true;

				// if user can update project which contains file, then user can edit file
				var access = false;
				file.access.projects.forEach(function (p) { // p = projectUuid
					if (api.can.update.project(user, p)) access = true;
				});
				return access;

			}
		},

		remove : {
			project : function (user, project) {
				if (superadmin(user)) return true;

				// can remove own project
				if (user.role.admin && project.createdBy == user.uuid) return true;

				// if admin and editor of project
				if (user.role.admin && user.role.editor.projects.indexOf(project.uuid) >= 0) return true;
				
				// editors can not remove projects

				return false;

			},
			client : function (user, client) {
				if (superadmin(user)) return true;

				// can remove own project
				if (user.role.admin && client.createdBy == user.uuid) return true;

				// if admin and editor of project
				if (user.role.admin && user.role.editor.clients.indexOf(client.uuid) >= 0) return true;
				
				// editors can not remove projects
				return false;				
			},


			user : function (user, subject) {

				// can remove users
				if (superadmin(user)) return true;

				// can remove user if admin and created by self
				if (user.role.admin && subject.createdBy == user.uuid) return true;

				// if user is manager anywhere and created by self
				if (user.role.manager.projects.length > 0 && subject.createdBy == user.uuid) return true;
				return false;
			}
		},
	},

	superadmin : function (user) {
		return (api.permission.superusers.indexOf(user.uuid) >= 0)
	}

}



// convenience method for checking hardcoded super user
function superadmin(user) {
	if (api.permission.superusers.indexOf(user.uuid) >= 0) return true;
	return false;
}