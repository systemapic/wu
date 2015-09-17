// API: api.access.js

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

module.exports = api.access = {
	
	roleTemplates : {

		// can do anything
		superAdmin : {
			name : 'Super Admin',
			capabilities : {
				create_client 		: true,	
				read_client 		: true, 		
				edit_client 		: true, 		
				edit_other_client 	: true, 	
				delete_client 		: true, 	
				delete_other_client 	: true,  
				
				create_project 		: true, 	
				read_project 		: true, 	
				edit_project 		: true, 	
				edit_other_project 	: true, 	
				delete_project 		: true, 	
				delete_other_project 	: true,
				
				upload_file 		: true, 	
				download_file 		: true, 	
				edit_file 		: true, 	
				edit_other_file 	: true, 	
				create_version 		: true, 	
				delete_version 		: true, 	
				delete_other_version 	: true,
				delete_file 		: true, 	
				delete_other_file 	: true, 	
				
				create_user 		: true, 
				read_user 		: true,
				read_other_user		: true,	
				edit_user 		: true, 		
				edit_other_user 	: true, 	
				delete_user 		: true, 	
				delete_other_user 	: true, 	
				
				share_project 		: true, 	
				read_analytics 		: true, 	
				manage_analytics	: true, 	
				delegate_to_user 	: true,
				have_superpowers	: true, 
			},
		},

		// can do anything except create superAdmins
		portalAdmin : {
			name : 'Portal Admin',
			capabilities : {
				create_client 		: true,	
				read_client 		: true, 		
				edit_client 		: true, 		
				edit_other_client 	: true, 	
				delete_client 		: true, 	
				delete_other_client 	: true,  
				create_project 		: true, 	
				read_project 		: true, 	
				edit_project 		: true, 	
				edit_other_project 	: true, 	
				delete_project 		: true, 	
				delete_other_project 	: true,
				upload_file 		: true, 	
				download_file 		: true, 	
				edit_file 		: true, 	
				edit_other_file 	: true, 	
				create_version 		: true, 	
				delete_version 		: true, 	
				delete_other_version 	: true,
				delete_file 		: true, 	
				delete_other_file 	: true, 	
				create_user 		: true, 	
				read_user 		: true,
				read_other_user		: true,
				edit_user 		: true, 		
				edit_other_user 	: true, 	
				delete_user 		: true, 	
				delete_other_user 	: true, 	
				share_project 		: true, 	
				read_analytics 		: true, 	
				manage_analytics	: true, 	
				delegate_to_user 	: true,
				
				have_superpowers 	: false,  // needed to diff from superadmin
			},
		},

		// can read, edit, manage any content
		projectOwner : {
			name : 'Project Owner',
			capabilities : {
				read_project 		: true, 	
				edit_project 		: true, 	
				delete_project 		: true, 	
				upload_file 		: true, 	
				download_file 		: true, 	
				edit_file 		: true, 	
				edit_other_file 	: true, 	
				create_version 		: true, 	
				delete_version 		: true, 	
				delete_other_version 	: true,
				delete_file 		: true, 	
				delete_other_file 	: true, 	
				create_user 		: true, 	
				read_user 		: true,
				read_other_user		: true,
				edit_user 		: true, 
				delete_user 		: true, 	
				share_project 		: true, 	
				delegate_to_user 	: true,

				create_project 		: false, 	
				create_client 		: false,	
				read_client 		: false, 		
				edit_client 		: false, 		
				edit_other_client 	: false, 	
				delete_client 		: false, 	
				delete_other_client 	: false,  
				edit_other_project 	: false, 	
				delete_other_project 	: false,
				edit_other_user 	: false, 	
				delete_other_user 	: false, 	
				read_analytics 		: false, 	
				manage_analytics	: false, 	
				have_superpowers 	: false, 
			},
		},

		// can read, edit, manage own content
		projectEditor : {
			name : 'Editor',
			capabilities : {
				read_project 		: true, 	
				edit_project 		: true, 
				upload_file 		: true, 	
				download_file 		: true, 	
				edit_file 		: true, 
				create_version 		: true, 	
				delete_version 		: true, 	
				delete_file 		: true, 	
				create_user 		: true, 	
				read_user 		: true,
				read_other_user		: true,
				edit_user 		: true, 
				delete_user 		: true, 	
				share_project 		: true, 	
				delegate_to_user 	: true,

				create_project 		: false, 	
				delete_project 		: false, 	
				create_client 		: false,	
				read_client 		: false, 		
				edit_client 		: false, 		
				edit_other_client 	: false, 	
				delete_client 		: false, 	
				delete_other_client 	: false,  
				edit_other_project 	: false, 	
				delete_other_project 	: false,
				edit_other_file 	: false, 	
				delete_other_version 	: false,
				delete_other_file 	: false, 	
				edit_other_user 	: false, 	
				delete_other_user 	: false, 	
				read_analytics 		: false, 	
				manage_analytics	: false, 	
				have_superpowers 	: false, 
			},
		},

		// can read and manage, not edit
		projectManager : {
			name : 'Manager',
			capabilities : {
				read_project 		: true, 	
				download_file 		: true, 	
				create_user 		: true, 	
				read_user 		: true,
				read_other_user		: true,
				edit_user 		: true, 
				delete_user 		: true, 	
				share_project 		: true, 	
				delegate_to_user 	: true,

				create_client 		: false,	
				read_client 		: false, 		
				edit_client 		: false, 		
				edit_other_client 	: false, 	
				delete_client 		: false, 	
				delete_other_client 	: false,  
				create_project 		: false, 	
				edit_project 		: false, 	
				edit_other_project 	: false, 	
				delete_project 		: false, 	
				delete_other_project 	: false,
				upload_file 		: false, 	
				edit_file 		: false, 	
				edit_other_file 	: false, 	
				create_version 		: false, 	
				delete_version 		: false, 	
				delete_other_version 	: false,
				delete_file 		: false, 	
				delete_other_file 	: false, 	
				edit_other_user 	: false, 	
				delete_other_user 	: false, 	
				read_analytics 		: false, 	
				manage_analytics	: false, 	
				have_superpowers 	: false, 
			},
		},

		// can read and edit, not manage
		projectCollaborator : {
			name : 'Collaborator',
			capabilities : {
				read_project 		: true, 	
				edit_project 		: true, 
				upload_file 		: true, 	
				download_file 		: true, 	
				edit_file 		: true, 
				create_version 		: true, 	
				delete_version 		: true, 
				delete_file 		: true, 	
				share_project 		: true, 	

				create_client 		: false,	
				read_client 		: false, 		
				edit_client 		: false, 		
				edit_other_client 	: false, 	
				delete_client 		: false, 	
				delete_other_client 	: false,  
				create_project 		: false, 	
				edit_other_project 	: false, 	
				delete_project 		: false, 	
				delete_other_project 	: false,
				edit_other_file 	: false, 	
				delete_other_version 	: false,
				delete_other_file 	: false, 	
				create_user 		: false, 	
				read_user 		: false,
				read_other_user		: false,
				edit_user 		: false, 	
				edit_other_user 	: false, 	
				delete_user 		: false, 
				delete_other_user 	: false, 	
				read_analytics 		: false, 	
				manage_analytics	: false, 	
				delegate_to_user 	: false,
				have_superpowers 	: false, 

			},
		},

		// can read
		projectReader : {
			name : 'Reader',
			capabilities : {
				read_project 		: true, 	
				download_file 		: true, 	
				share_project 		: true, 	

				create_client 		: false,	
				read_client 		: false, 		
				edit_client 		: false, 		
				edit_other_client 	: false, 	
				delete_client 		: false, 	
				delete_other_client 	: false,  
				create_project 		: false, 	
				edit_project 		: false, 	
				edit_other_project 	: false, 	
				delete_project 		: false, 	
				delete_other_project 	: false,
				upload_file 		: false, 	
				edit_file 		: false, 	
				edit_other_file 	: false, 	
				create_version 		: false, 	
				delete_version 		: false, 	
				delete_other_version 	: false,
				delete_file 		: false, 	
				delete_other_file 	: false, 	
				create_user 		: false, 	
				read_user 		: false,
				read_other_user		: false,
				edit_user 		: false, 		
				edit_other_user 	: false, 	
				delete_user 		: false, 	
				delete_other_user 	: false, 	
				read_analytics 		: false, 	
				manage_analytics	: false, 	
				delegate_to_user 	: false,
				have_superpowers 	: false, 
			},
		},

		// can read
		noRole : {
			name : 'No Role',
			capabilities : {
				read_project 		: false, 	
				download_file 		: false, 	
				share_project 		: false, 	
				create_client 		: false,	
				read_client 		: false, 		
				edit_client 		: false, 		
				edit_other_client 	: false, 	
				delete_client 		: false, 	
				delete_other_client 	: false,  
				create_project 		: false, 	
				edit_project 		: false, 	
				edit_other_project 	: false, 	
				delete_project 		: false, 	
				delete_other_project 	: false,
				upload_file 		: false, 	
				edit_file 		: false, 	
				edit_other_file 	: false, 	
				create_version 		: false, 	
				delete_version 		: false, 	
				delete_other_version 	: false,
				delete_file 		: false, 	
				delete_other_file 	: false, 	
				create_user 		: false, 	
				read_user 		: false,
				read_other_user		: false,
				edit_user 		: false, 		
				edit_other_user 	: false, 	
				delete_user 		: false, 	
				delete_other_user 	: false, 	
				read_analytics 		: false, 	
				manage_analytics	: false, 	
				delegate_to_user 	: false,
				have_superpowers 	: false, 
			},
		}
	},


	getRole : function (options, callback) {
		Role
		.findOne({uuid : options.roleUuid})
		.exec(callback);
	},


	getProject : function (options, callback) {
		Project
		.findOne({uuid : options.projectUuid})
		.populate('roles')
		.exec(callback);
	},


	getUserRole : function (options, done) {
		var project = options.project,
		    account = options.account,
		    roles = project.roles,
		    ops = {};

		// error catching
		if (!project || !account || !roles) return callback(null, false);

		ops.super = function (callback) {
			var superRoleUuid = api.config.portal.roles.superAdmin;

			Role
			.findOne({uuid : superRoleUuid})
			.exec(function (err, superRole) {
				if (err || !superRole) return callback(err, false);

				var isMember = superRole.isMember(account);
				isMember ? callback(err, superRole) : callback(err, false);
			});
		}

		ops.portal = function (callback) {
			var portalRoleUuid = api.config.portal.roles.portalAdmin;

			Role
			.findOne({uuid : portalRoleUuid})
			.exec(function (err, portalRole) {
				if (err || !portalRole) return callback(err, false);

				var isMember = portalRole.isMember(account);
				isMember ? callback(err, portalRole) : callback(err, false);
			});
		}


		ops.project = function (callback) {
			// find role that account is member of
			var role = _.find(roles, function (role) {
				return _.contains(role.members, account.getUuid());
			});
			callback(null, role);
		}
		
		async.series(ops, function (err, roles) {
			if (roles.super) return done(null, roles.super);
			if (roles.portal) return done(null, roles.portal);
			if (roles.project) return done(null, roles.project);
			done(null, false);
		});
	},


	getAll : function (options, done) {	
		var ops = {};

		ops.portalRole = function (callback) {
			Role
			.findOne({uuid : api.config.portal.roles.portalAdmin})
			.exec(callback);

		};

		ops.superRole = function (callback) {
			Role
			.findOne({uuid : api.config.portal.roles.superAdmin})
			.exec(callback);
		};

		async.series(ops, done);
	},


	permissionToAddRole : function (options, done) {
		var project = options.project,
		    account = options.account,
		    role = options.role,
		    currentRole = options.currentRole,
		    ops = [];

		if (!project || !account || !role) return callback('No access.');

		// get account's role in project
		ops.push(function (callback) {
			api.access.getUserRole({
				project : project,
				account : account
			}, callback);
		});

		// check if accounts's role has all capabilities necessary (ie. all in delegating role + in currentRole)
		ops.push(function (accountRole, callback) {
			if (!accountRole) return callback('No access.');

			var lacking1,
			    lacking2,
			    p1,
			    p2;

			// check new role
			_.each(role.capabilities, function (cap, key) {
				if (cap == true) if (!accountRole.capabilities[key]) lacking1 = true;
			});
			p1 = !lacking1 && accountRole.capabilities && accountRole.capabilities.delegate_to_user;

			// check old role
			if (currentRole) {
				_.each(currentRole.capabilities, function (cap, key) {
					if (cap == true) if (!accountRole.capabilities[key]) lacking2 = true;
				});
				p2 = !lacking2 && accountRole.capabilities && accountRole.capabilities.delegate_to_user;

			} else {
				p2 = true;
			}

			// return
			p1 && p2 ? callback(null, accountRole) : callback('No access.');
			
		});

		async.waterfall(ops, function (err) {
			done(err, options);
		});
	},


	setRoleMember : function (req, res) {
		var projectUuid = req.body.projectUuid,
		    userUuid = req.body.userUuid,
		    roleUuid = req.body.roleUuid,
		    currentRoleUuid = req.body.currentRoleUuid,
		    account = req.user,
		    ops = [];

		// return on missing info
		if (!projectUuid || !userUuid || !roleUuid) return api.error.missingInformation(req, res);

		console.log('projreoroor', projectUuid);

		// get role 
		ops.push(function (callback) {
			api.access.getRole({
				roleUuid : roleUuid
			}, callback);
		});

		// get currentRole 
		ops.push(function (role, callback) {
			api.access.getRole({
				roleUuid : currentRoleUuid
			}, function (err, currentRole) {
				callback(err, {
					role : role, 
					currentRole : currentRole
				});
			});
		});

		// get project
		ops.push(function (roles, callback) {
			Project
			.findOne({uuid : projectUuid})
			.populate('roles')
			.exec(function (err, project) {
				var options = {
					project : project,
					role : roles.role,
					currentRole : roles.currentRole
				}
				callback(err, options);
			});
		});

		// check if permission to add member to role
		ops.push(function (options, callback) {
			var project = options.project,
			    role = options.role,
			    currentRole = options.currentRole;

			api.access.permissionToAddRole({
				role : role,
				project : project,
				account : account,
				currentRole : currentRole
			}, callback);
		});

		// remove user from all project roles
		ops.push(function (options, callback) {	
			var role = options.role,
			    project = options.project;

			api.access.removeFromProjectRoles({
				project : project,
				userUuid : userUuid,
				role : role
			}, callback);
		});

		// add user to role
		ops.push(function (options, callback) { 
			var role = options.role,
			    project = options.project;

			api.access.addToRole({
				role : role,
				userUuid : userUuid,
				project : project
			}, callback);
		});

		// get updated project
		ops.push(function (options, callback) {
			Project
			.findOne({uuid : projectUuid})
			.populate('roles')
			.exec(callback);
		});

		// return updated project
		async.waterfall(ops, function (err, project) {
			if (err) return api.error.general(req, res, err);
			res.end(JSON.stringify(project));
		});
	},

	addToRole : function (options, callback) {
		var role = options.role,
		    userUuid = options.userUuid;

		role.members.addToSet(userUuid);
		role.save(function (err) {
			callback(err, options);
		});
	},

	removeFromProjectRoles : function (options, done) {
		var project = options.project,
		    userUuid = options.userUuid,
		    roles = project.roles,
		    ops = [];

		async.each(roles, function (role, callback) {
			role.members.pull(userUuid);
			role.save(callback);
		}, function (err) {
			done(err, options);
		});
	},


	setNoRole : function (req, res) {
		var opts = req.body,
		    projectUuid = opts.projectUuid,
		    userUuid = opts.userUuid;

		// get project
		ops.push(function (role, callback) {
			Project
			.findOne({uuid : projectUuid})
			.populate('roles')
			.exec(callback);
		});

		// check if permission to add member to role
		ops.push(function (project, callback) {
			api.access.permissionToAddRole({
				project : project,
				account : account
			}, callback);
		});

		// remove user from all project roles
		ops.push(function (options, callback) {	
			var role = options.role,
			    project = options.project;

			api.access.removeFromProjectRoles({
				project : project,
				userUuid : userUuid,
				role : role
			}, callback);
		});
	},

	
	_createRole : function (options, callback) {

		// create model
		var role 	= new Role();
		role.uuid 	= 'role-' + uuid.v4();
		role.name 	= options.name;
		role.slug 	= options.template;
		role.capabilities = api.access.get.capabilities(options);
		
		if (options.members) {
			role.members = options.members;
		}

		// save
		role.save(function (err) {
			callback(err, role);
		});
	},


	// create default roles for new project
	_createDefaultRoles : function (options, done) {
		var user = options.user,
		    ops = [];


		ops.push(function (callback) {
			api.access._createRole({
				name : 'Project Owner',
				template : 'projectOwner',
				members : [user.uuid], 	// add creator 
			}, callback);
		});

		ops.push(function (callback) {
			api.access._createRole({
				name : 'Project Editor',
				template : 'projectEditor',
			}, callback);
		});

		ops.push(function (callback) {
			api.access._createRole({
				name : 'Project Manager',
				template : 'projectManager',
			}, callback);
		});

		ops.push(function (callback) {
			api.access._createRole({
				name : 'Project Collaborator',
				template : 'projectCollaborator',
			}, callback);
		});

		ops.push(function (callback) {
			api.access._createRole({
				name : 'Project Reader',
				template : 'projectReader',
			}, callback);
		});

		ops.push(function (callback) {
			api.access._createRole({
				name : 'No role',
				template : 'noRole',
			}, callback);
		});

		async.parallel(ops, function (err, roles) {
			done(err, roles);
		});
	},


	get : {

		portalAdmins : function () {
			return {
				// todo: actual Role model
				members : api.config.portal.portalAdmins,
				capabilities : api.access.get.capabilities({template : 'portalAdmin'}),
				name : 'Portal Admin'
			};
		},

		superAdmins : function () {
			return {
				// todo: actual Role model
				members : api.config.portal.superAdmins,
				capabilities : api.access.get.capabilities({template : 'superAdmin'}),
				name : 'Super Admin'
			}
		},

		capabilities : function (options) {

			var template = options.template,
			    capabilities = {},
			    additionalCapabilities = options.capabilities;

			// get capabilities from template
			var role = api.access.roleTemplates[template];
			if (role) capabilities = role.capabilities;
				
			// add extra capabilities
			if (additionalCapabilities) _.each(additionalCapabilities, function (value, key) {
				capabilities[key] = value;	
			});

			// return capabilities as {}
			return capabilities;
		},
	},


	is : {

		admin : function (options, done) {
			var ops = {};

			ops.portal = function (callback) {
				api.access.is.portalAdmin(options, callback)
			};

			ops.super = function (callback) {
				api.access.is.superAdmin(options, callback)
			};

			async.parallel(ops, function (err, is) {
				done(err, is.portal || is.super);
			});

		},

		portalAdmin : function (options, callback) {
			var user = options.user,
			    roleUuid = api.config.portal.roles.portalAdmin;

			Role
			.findOne({ uuid : roleUuid})
			.exec(function (err, role) {
				if (err || !role) return callback(err, false);
				
				var isAdmin = role.isMember(user);
				callback(err, isAdmin);
			});
		},

		superAdmin : function (options, callback) {
			var user = options.user,
			    roleUuid = api.config.portal.roles.superAdmin;

			Role
			.findOne({ uuid : roleUuid})
			.exec(function (err, role) {
				if (err || !role) return callback(err, false);
				
				var isAdmin = role.isMember(user);
				callback(err, isAdmin);
			});
		},

		createdBy : function (user, account) {
			return user.createdBy == account.getUuid();
		},
	},

	as : {
		admin : function (user, cap) {
			if (api.access.as.superAdmin(user, cap)) return true;
			if (api.access.as.portalAdmin(user, cap)) return true;
			return false;
		},

		portalAdmin : function (user, cap) {
			if (api.access.is.portalAdmin(user)) {
				var c = api.access.get.portalAdmins().capabilities;
				if (c[cap]) return true;
			}
			return false;
		},

		superAdmin : function (user, cap) {
			if (api.access.is.superAdmin(user)) {
				var c = api.access.get.superAdmins().capabilities;
				if (c[cap]) return true;
			}
			return false;
		},
	},

	has : {

		project_capability : function (options, capability) {
			var user = options.user,
			    project = options.project,
			    roles = project.roles,
			    access = false;
			
			// console.log('..............has', options, capability);
			if (roles) roles.forEach(function (role) {
				// if user in role
				if (_.contains(role.members, user.getUuid())) {
					// if capability in role
					if (role.capabilities[capability]) access = true;
				}
			});
			return access;
		},

		capability : function (options, done) {
			var user = options.user,
			    capability = options.capability,
			    project = options.project,
			    ops = [];

			// return on missing
			if (!project || !user || !project.roles || !capability) return done(null, false);

			// get role of user in project
			var role = _.find(project.roles, function (r) {
				return _.contains(r.members, user.getUuid());
			});

			// console.log('ROLEROLEROLE:', role);

			// return if no role
			if (!role || !role.capabilities) return done(null, false);

			var hasCapability = role.capabilities[capability];

			done(null, hasCapability);
		}
	},

	// CRUD capabilities
	// must be kept identical with access.js
	to : {


		// potential capabilities:
		// layer access: create, edit, delete, etc.. cartocss, etc..
		// file access...? 
		// settings access - dataLib, mediaLib, etc.
		// more?

		// TODO!! : pass to _other_ if !createdBy self


		// still to go thru 1st round:
		// 	download_file -> move to POST
		// 	upload_file
		// 	versions...
		//	share
		// 	analytics
		// 	delegation...........


		_check : function (options, capability, done) {
			var user = options.user,
			    project = options.project,
			    ops = {};


			ops.admin = function (callback) {
				// if is admin
				api.access.is.admin(options, callback);
			};

			ops.capable = function (callback) {
				// if has capability
				api.access.has.capability({
					user : user,
					capability : capability,
					project : project
				}, callback);
			};

			async.series(ops, function (err, is) {
				if (!err && is.admin || is.capable) return done(null, options);
				
				// no access
				done(api.access.textTemplates.no_access);
			});
		},

		create_client : function (options, callback) {  			// todo: client roles
			api.access.is.admin(options, function (err, isAdmin) {
				if (err || !isAdmin) return callback('No access.');
				callback(null, options);
			});
		},
		
		edit_client : function (options, callback) { 
			api.access.is.admin(options, function (err, isAdmin) {
				if (err || !isAdmin) return callback('No access.');
				callback(null, options);
			});
		},
		
		edit_other_client : function (options, callback) { 
			api.access.is.admin(options, function (err, isAdmin) {
				if (err || !isAdmin) return callback('No access.');
				callback(null, options);
			});
		},
		
		delete_client : function (options, callback) { 
			api.access.is.admin(options, function (err, isAdmin) {
				if (err || !isAdmin) return callback('No access.');
				callback(null, options);
			});
		},
		
		delete_other_client : function (options, callback) { 
			api.access.is.admin(options, function (err, isAdmin) {
				if (err || !isAdmin) return callback('No access.');
				callback(null, options);
			});
		},
		
		read_client : function (options, callback) { 
			api.access.is.admin(options, function (err, isAdmin) {
				if (err || !isAdmin) return callback('No access.');
				callback(null, options);
			});
		},
		
		create_project : function (options, callback) { 
			api.access.is.admin(options, function (err, isAdmin) {
				if (err || !isAdmin) return callback('No access.');
				callback(null, options);
			});
		},
		
		edit_project : function (options, done) { 
			api.access.to._check(options, 'edit_project', done);
		},
		
		edit_other_project : function (options, done) { 
			api.access.to._check(options, 'edit_other_project', done);
		},
		
		delete_project : function (options, done) { 
			api.access.to._check(options, 'delete_project', done);
		},
		
		delete_other_project : function (options, done) { 
			api.access.to._check(options, 'delete_other_project', done);
		},
		
		read_project : function (options, done) { 
			api.access.to._check(options, 'read_project', done);
		},

		read_file : function (options, done) {
			// access to read file if ... // todo! not added to list of caps either. 
		},
		
		upload_file : function (options, done) { 
			api.access.to._check(options, 'upload_file', done);
		},
		
		download_file : function (options, done) { 
			// some files not attached to projects, like temp-files (pdfs, etc)
			// so, if created by self, it's ok..
			if (api.access.is.createdBy(options.file, options.user)) return done(null, options);

			// need to find project, and check project_capability
			var ops = [];

			ops.push(function (callback) {
				Project
				.findOne({files : options.file._id})
				.exec(callback);
			});

			ops.push(function (project, callback) {
				if (!project) return callback('No access.');
				options.project = project;
				api.access.to._check(options, 'download_file', callback);
			});

			async.waterfall(ops, done);
		},
		
		create_version : function (options, done) { 
			api.access.to._check(options, 'create_version', done);
		},
		
		delete_version : function (options, done) { 
			api.access.to._check(options, 'delete_version', done);
		},

		delete_other_version : function (options, done) {
			api.access.to._check(options, 'delete_other_version', done);
		},

		edit_file : function (options, done) {

			console.log('access edit_file: ', options);

			User
			.findOne({files : options.file._id})
			.populate('roles')
			.exec(function (err, project) {
				if (err || !project) return done('No access.');
				options.project = project;
				api.access.to._check(options, 'edit_file', done); 			// todo: if not createdBy self, pass to _other_
			});
		},

		edit_other_file : function (options, done) {
			api.access.to._check(options, 'edit_other_file', done);
		},
		
		delete_file : function (options, done) { 
			api.access.to._check(options, 'delete_file', done);
		},
		
		delete_other_file : function (options, done) { 
			api.access.to._check(options, 'delete_other_file', done);
		},
		
		create_user : function (options, done) { 
			api.access.to._check(options, 'create_user', done);
		},
		
		edit_user : function (options, done) { 
			var account = options.user, 
			    user = options.subject;


			// console.log('edit_user ::::', options);
			// ok if self
			if (account.uuid == user.uuid) return done(null, options);

			// if not createdBy self, pass to edit_other_user
			if (!api.access.is.createdBy(user, account)) return api.access.to.edit_other_user(options, done);

			// if created user, then ok // todo: more requirements?
			done(null, options);
		},
		
		edit_other_user : function (options, done) { 
			var account = options.user,
			    subject = options.subject,
			    project = options.project,
			    ops = {};

			ops.super = function (callback) {
				api.access.is.superAdmin(options, callback);
			}

			ops.portal = function (callback) {
				api.access.is.portalAdmin(options, function (err, isPortal) {
					if (err || !isPortal) return callback(null, false);
					
					// if subject is not superadmin!
					api.access.is.superAdmin({
						user : subject
					}, function (err, subjectIsSuper) {
						if (err || subjectIsSuper) return callback(null, false);
						callback(null, options)
					});
				});
			}

			ops.able = function (callback) {
				api.access.to._check(options, 'edit_other_user', callback)
			}

			async.series(ops, function (err, is) {

				// access
				if (is.super || is.portal || is.able) return done(null, options);
				
				// no access
				done('No access.');
			});

		},
		
		delete_user : function (options, done) { 
			var account = options.user,
			    subject = options.subject;

			// if not createdBy self, pass to edit_other_user
			if (!api.access.is.createdBy(subject, account)) return api.access.to.delete_other_user(options, done);

			// if createdBy self, why the fuck not.. todo..
			done(null, options);
		},
		
		delete_other_user : function (options, done) { 
			var account = options.user,
			    subject = options.subject,
			    project = options.project,
			    ops = {};

			ops.super = function (callback) {
				api.access.is.superAdmin(options, callback);
			}

			ops.portal = function (callback) {
				api.access.is.portalAdmin(options, function (err, isPortal) {
					if (err || !isPortal) return callback(null, false);
					
					// if subject is not superadmin!
					api.access.is.superAdmin({
						user : subject
					}, function (err, subjectIsSuper) {
						if (err || subjectIsSuper) return callback(null, false);
						callback(null, options)
					});
				});
			}

			ops.able = function (callback) {
				api.access.to._check(options, 'delete_other_user', callback); // doenst really make sense.. todo!
			}

			async.series(ops, function (err, is) {

				// access
				if (is.super || is.portal || is.able) return done(null, options);
				
				// no access
				done('No access.');
			});

		},
		
		share_project : function (options, done) { 
			api.access.to._check(options, 'share_project', done);
		},
		
		read_analytics : function (options, done) { 
			api.access.to._check(options, 'read_analytics', done);
		},
		
		manage_analytics : function (options, done) { 
			api.access.to._check(options, 'manage_analytics', done);
		},
		
		delegate_to_user : function (options, done) { 
			api.access.to._check(options, 'delegate_to_user', done);
		},
	},

	textTemplates : {
		no_access : "You don't have permission to do that.",
	}
}
