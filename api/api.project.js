// API: api.project.js

// database schemas
var Project 	= require('../models/project');
// var Clientel 	= require('../models/client');	// weird name cause 'Client' is restricted name
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
var error_messages = require('../shared/errors.json');
var errors = require('../shared/errors');
var httpStatus = require('http-status');

// api
var api = module.parent.exports;


// exports
module.exports = api.project = {

	setAccess : function (req, res) {

		var user = req.user;
		var options = req.body;
		var projectAccess = options.access;
		var projectUuid = options.project;

		if (!projectUuid || !projectAccess) return api.error.missingInformation(req, res);

		Project
			.findOne({uuid : projectUuid})
			.exec(function (err, project) {

				// check if access to edit
				var canEdit = _.contains(project.access.edit, user.getUuid()) || (project.createdBy == user.getUuid() || user.isSuper());

				if (!canEdit) return api.error.general(req, res, 'No access.');

				var currentAccess = project.access;

				// var access = {
				// 	read : [],
				// 	edit : [],
				// 	options : {
				// 		share : true,
				// 		download : true,
				// 		isPublic : true
				// 	}
				// }

				// todo: access restricitons!
				// 1. can not remove self from edit
				// 2. can not do shit if not editor (ok)
				// 3.

				// set access, save
				project.access = projectAccess;
				project.save(function (err, p) {

					// return if err
					if (err) return res.json({
						error : err
					});

					// return project
					res.json(p);
				})
			});

	},


	addInvites : function (req, res, next) {
		var options = req.body || {};
		var access = options.access;
		var projectUuid = options.project;
		var missingRequiredRequestFields = [];

		if (!access) {
			missingRequiredRequestFields.push('access');
		}

		if (!projectUuid) {
			missingRequiredRequestFields.push('project');
		}

		if (!_.isEmpty(missingRequiredRequestFields)) {
			return next(api.error.code.missingRequiredRequestFields(errors.missing_information.errorMessage, missingRequiredRequestFields));
		}

		Project
			.findOne({uuid : projectUuid})
			.exec(function (err, project) {
				if (err) {
					return next(err);
				}

				if (!project) {
					return next({
						message: errors.no_such_project.errorMessage,
						code: httpStatus.NOT_FOUND
					});
				}

				if (!access.read || !_.isArray(access.read)) {
					return next(api.error.code.missingRequiredRequestFields(errors.missing_information.errorMessage, ['access.read']));			
				}

				access.read.forEach(function (u) {
					// add read (if not in edit)
					if (!_.contains(project.access.edit, u)) {
						project.access.read.addToSet(u);
					}
				});

				project.save(function (err, updatedProject) {
					if (err) {
						return next(err);
					}

					// return updated access
					res.send(updatedProject.access);
				});

			});

	},

	getPublic : function (req, res) {

		console.log('api.project.getPublic', req.body);

		var username = req.body.username;
		var project_slug = req.body.project_slug;
		var project_id = req.body.project_id;

		// check if public
		api.project.checkPublic({
			username : username,
			project_slug : project_slug
		}, function (err, public_project) {
			console.log('checked for public', arguments);
			if (err) {
				// not public
				return res.status(400).send({
					error : 'Not public project'
				});
			}

			// public project
			res.send(public_project);
		});
	},

	getPrivate : function (req, res) {
		console.log('api.project.getPrivate', req.body);

		var project_id = req.body.project_id;
		var access_token = req.body.user_access_token;

		// TODO: check access token and access!!!
		res.end() // debug
		return;

		Project
		.findOne({uuid : project_id})
		.populate('files')
		.populate('layers')
		.exec(function (err, project) {

			res.send(project);
		})

	},

	checkPublic : function (options, done) {
		var username = options.username;
		var project_slug = options.project_slug;

		var errMsg = 'Not a public project.';
		
		User
		.findOne({username : username})
		.exec(function (err, user) {
			console.log('err, user', err, user);
			if (err || !user) return done(err || errMsg)

				console.log('project_slug', project_slug, user.uuid);

			// find project, check if public
			Project
			.findOne({
				createdBy : user.uuid,
				slug : project_slug
			})
			.populate('files')
			.populate('layers')
			.exec(function (err, project) {
				console.log('err, project', err, project);

				if (err || !project) return done(err || errMsg);

				// check if public
				if (project.access.options.isPublic) {
					return done(null, project);
				} else {
					return done(errMsg);
				}
			});
		});
	},


	defaultStoreAccess : function (access) {
		var access = access || {};

		access.edit = _.isArray(access.edit) ? access.edit : [];
		access.read = _.isArray(access.read) ? access.read : [];
		access.options = _.isObject(access.options) ? access.options : {};
		access.options.share = _.isBoolean(access.options.share) ? access.options.share : false;
		access.options.download = _.isBoolean(access.options.download) ? access.options.download : false;
		access.options.isPublic = _.isBoolean(access.options.isPublic) ? access.options.isPublic : false;

		return access;
	},

	// #########################################
	// ###  API: Create Project              ###
	// #########################################
	// createProject : function (req, res) {
	create : function (req, res, next) {
		var store = req.body || {};
		var user = req.user;
		var ops = [];

		// return if missing info
		if (!store.name) {
			return next(api.error.code.missingRequiredRequestFields(errors.missing_information.errorMessage, ['name']));
		}
		
		// get access
		var storeAccess = api.project.defaultStoreAccess(store.access);
		var isPublic = storeAccess.options.isPublic;

		// check access
		ops.push(function (callback) {

			// if public, allowed to create project
			if (isPublic) return callback(null);

			// check if user can create private project
			user.canCreatePrivateProject() ? callback(null) : callback({
				message: errors.no_access.errorMessage,
				code: httpStatus.BAD_REQUEST
			});
		});

		// create project
		ops.push(function (callback) {
			api.project._create({
				user : user,
				store : store
			}, callback);
		});

		// set default mapbox account
		ops.push(function (project, callback) {
			api.provider.mapbox.setDefault({
				project : project
			}, callback);
		});

		// add norkart layers
		ops.push(function (project, callback) {
			api.provider.norkart.setDefaults({
				project : project
			}, callback);
		});

		// add google layers
		ops.push(function (project, callback) {
			api.provider.google.setDefault({
				project : project
			}, callback);
		});

		// get updated project
		ops.push(function (project, callback) {
			Project
				.findOne({uuid : project.uuid})
				.populate('layers')
				.exec(callback);
		});

		// set some default settings
		ops.push(function (project, callback) {
			api.project.setDefaults(project, callback);
		});

		// run ops
		async.waterfall(ops, function (err, project) {
			if (err) {
				return next(err);
			}

			// slack
			api.slack.createdProject({
				project : project,
				user : user
			});

			// return
			api.project._returnProject(req, res, project);
		});
	},



	_create : function (options, done) {
		if (!options) return done('No options.');

		var user = options.user;
		var store = options.store;

		if (!user) return done('Missing information.8');

		var projectName = store.name;
		var projectSlug = api.utils.createNameSlug(projectName);

		// create model
		var project 		= new Project();
		project.uuid 		= 'project-' + uuid.v4();
		project.createdBy 	= user.uuid;
		project.createdByName   = user.firstName + ' ' + user.lastName;
		project.createdByUsername = user.username;
		project.slug 		= projectSlug;
		project.name 		= projectName;
		project.description 	= store.description || '';
		project.keywords 	= store.keywords || '';
		project.position 	= store.position || api.project._getDefaultPosition(); // defaults
		project.access 		= store.access;

		// save
		project.save(function (err, project, numAffected) { 	// major GOTCHA!!! product.save(function (err, product, numberAffected) 
			done(err, project);				// returns three args!!!
		});
	},


	setDefaults : function (project, callback) {

		// default layer 
		var layer = _.find(project.layers, function (l) {

			// mapbox, satellite, no labels
			return l.data.mapbox == 'systemapic.kcjonn12';
		});

		var baseLayer = {
			uuid : layer.uuid,
			zIndex : 1,
			opacity : 1
		};

		// set baselayer, save
		project.baseLayers.push(baseLayer);
		project.markModified('baseLayers');
		project.save(callback);

	},

	_getDefaultPosition : function () {

		var position = {
			lat: 54.213861000644926,
			lng: 6.767578125,
			zoom: 4
		};

		return position;
	},

	_getDefaultBounds : function () {
		var bounds = {
			northEast : {
				lat : 0,
				lng : 0
			},
			southWest : {
				lat : 0,
				lng : 0
			},
			minZoom : 1,
			maxZoom : 22
		};

		return bounds;
	},


	_getProjectByUuid : function (projectUuid, done) {
		Project
			.find({uuid : projectUuid})
			.populate('files')
			.populate('roles')
			.populate('layers')
			.exec(done);
	},


	// #########################################
	// ###  API: Delete Project              ###
	// #########################################
	deleteProject : function (req, res, next) {
		if (_.isEmpty(req.body)) {
			return next(api.error.code.missingRequiredRequestFields(errors.missing_information.errorMessage, ['body']));
		}

		var user = req.user;
		var projectUuid = req.body.projectUuid || req.body.project_id;
		var ops = [];

		if (!projectUuid) {
			return next(api.error.code.missingRequiredRequestFields(errors.missing_information.errorMessage, ['project_id']));
		}

		ops.push(function (callback) {
			Project
				.findOne({uuid : projectUuid})
				.populate('roles')
				.exec(callback);
		});

		ops.push(function (project, callback) {
			if (!project) {
				return callback({
					message: errors.no_such_project.errorMessage,
					code: httpStatus.NOT_FOUND
				});
			}

			// check access to delete
			var gotAccess = (project.createdBy == user.getUuid() || user.isSuper());
			gotAccess ? callback(null, project) : callback({
				message: errors.no_access.errorMessage,
				code: httpStatus.BAD_REQUEST
			});
		});

		ops.push(function (project, callback) {
			if (!project) {
				return callback({
					message: errors.no_such_project.errorMessage,
					code: httpStatus.NOT_FOUND
				});
			}

			// delete
			project.remove(callback);
		});

		async.waterfall(ops, function (err, project) {
			if (err) {
				return next(err);
			}

			// slack
			api.slack.deletedProject({
				project : project,
				user : user
			});

			// done
			res.send({
				project : project.uuid,
				deleted : true
			});
		})
	},

	// #########################################
	// ###  API: Update Project              ###
	// #########################################
	update : function (req, res, next) {
		if (_.isEmpty(req.body)) {
			return next(api.error.code.missingRequiredRequestFields(errors.missing_information.errorMessage, ['body']));
		}

		var user = req.user;
		var projectUuid = req.body.uuid || req.body.projectUuid || req.body.project_id;
		var ops = [];

		// return on missing;
		if (!projectUuid) {
			return next(api.error.code.missingRequiredRequestFields(errors.missing_information.errorMessage, ['project_id']));
		}

		// no fields except project_id and access_token
		if (_.size(req.body) < 3) {
			return next(api.error.code.missingRequiredRequestFields(errors.missing_information.errorMessage));
		}

		ops.push(function (callback) {
			Project
				.findOne({uuid : projectUuid})
				.exec(callback);
		});

		ops.push(function (project, callback) {

			var hashedUser = user.getUuid(); // todo: use actual hash

			if (!project) {
				return callback({
					message: errors.no_such_project,
					code: httpStatus.NOT_FOUND
				});
			}

			if (!project.access) {
				return callback({
					message: errors.no_access,
					code: httpStatus.NOT_FOUND
				});
			}

			// can edit if on edit list or created project
			var canEdit = _.contains(project.access.edit, hashedUser) || (project.createdBy == user.getUuid() || user.isSuper());

			// continue only if canEdit
			canEdit ? callback(null, project) : callback({
				message: errors.no_access.errorMessage,
				code: httpStatus.BAD_REQUEST
			});
		});
		ops.push(function (project, callback) {
			api.project._update({
				project : project,
				options : req.body
			}, callback);
		});

		async.waterfall(ops, function (err, result) {
			if (err) {
				return next(err);
			}
			// done
			res.send(result);
		});
	},


	_update : function (job, callback) {
		if (!job) return callback('Missing job.');

		var project = job.project;
		var options = job.options;
    	var updates = {};
		var queries = {};
		var ops = [];

		// valid fields
		var valid = [
			'name',
			'logo',
			'header',
			'baseLayers',
			'position',
			'bounds',
			'layermenu',
			'folders',
			'controls',
			'description',
			'keywords',
			'colorTheme',
			'title',
			'slug',
			'connectedAccounts',
			'settings',
			'categories',
			'thumbCreated',
			'state',
			'pending'
		];

		updates = _.pick(options, valid);
		// enqueue updates for valid fields
		ops.push(function (callback) {
			project.update({ $set: updates })
				.exec(function (err, result) {
					if (err) {
						callback(err);
					}

					callback(null, {
						updated: _.keys(updates)
					});
				});
		});

		ops.push(function (params, callback) {
			console.log(project)
			Project.findOne({uuid: options.project_id})
				.exec(function (err, res) {
					if (err) {
						return callback(err);
					}

					params.project = res;
					callback(null, params);
				});
		});

		// do updates
		async.waterfall(ops, callback);

		// // enqueue queries for valid fields
		// valid.forEach(function (field) {
		// 	if (options[field]) queries = api.project._enqueueUpdate({
		// 		queries : queries,
		// 		field : field,
		// 		project : project,
		// 		options : options
		// 	});
		// });

		// // run queries to database
		// async.parallel(queries, callback);
	},


	// async mongo update queue
	_enqueueUpdate : function (job) {
		if (!job) return;

		var queries = job.queries,
			field = job.field,
			project = job.project,
			options = job.options;

		// create update queue op
		queries[field] = function(callback) {
			project[field] = options[field];
			project.markModified(field);
			project.save(function (err, doc) {
				callback(null, doc);
			});
		};
		return queries;
	},



	// #########################################
	// ###  API: Check Unique Slug           ###
	// #########################################
	checkUniqueSlug : function (req, res, next) {
		if (!req.body) {
			return next(api.error.code.missingRequiredRequestFields(errors.missing_information.errorMessage, ['body']));
		}

		// debug: let's say all slugs are OK - and not actually use slugs for anything but cosmetics
		// return results
		return res.send({
			unique : true
		});

		// var value = req.body.value,
		//     clientUuid = req.body.client,
		//     projectUuid = req.body.project,
		//     slugs = [];

		// Project
		// .find({client : clientUuid})
		// .exec(function (err, projects) {
		// 	if (err) return api.error.general(req, res, err);

		// 	// get slugs
		// 	projects.forEach(function (p) {
		// 		// add but self
		// 		if (p.uuid != projectUuid) slugs.push(p.slug.toLowerCase());
		// 	});

		// 	// check if slug already exists
		// 	var unique = !(slugs.indexOf(value.toLowerCase()) > -1);

		// 	// return results
		// 	res.end(JSON.stringify({
		// 		unique : unique
		// 	}));
		// });
	},

	_returnProject : function (req, res, project, err) {
		if (!project) return api.error.general(req, res, err);

		Project
			.findOne({uuid : project.uuid})
			.populate('files')
			.populate('layers')
			.populate('roles')
			.exec(function (err, project) {
				res.end(JSON.stringify({
					error : err,
					project: project
				}));
			});
	},


	getHash : function (req, res) {
		if (!req.body) return api.error.general(req, res);

		var id = req.body.id,
			projectUuid = req.body.projectUuid;		// todo: access restrictions

		Hash
			.findOne({id : id, project : projectUuid})
			.exec(function (err, doc) {
				res.end(JSON.stringify({
					error: err,
					hash : doc
				}));
			});
	},

	setHash : function (req, res) {
		if (!req.body || !req.user) return api.error.general(req, res);

		var projectUuid = req.body.projectUuid,
			position 	= req.body.hash.position,
			layers 	= req.body.hash.layers,
			id 		= req.body.hash.id,
			saveState   = req.body.saveState;

		// create new hash
		var hash 	= new Hash();
		
		hash.uuid 	= 'hash-' + uuid.v4();
		hash.position 	= position;
		hash.layers 	= layers;
		hash.id 	= id;
		hash.createdBy 	= req.user.uuid;
		hash.createdByName = req.user.firstName + ' ' + req.user.lastName;
		hash.project 	= projectUuid;

		hash.save(function (err, doc) {
			res.end(JSON.stringify({
				error: err,
				hash : doc
			}));

			if (saveState) api.project._saveState({
				projectUuid : projectUuid,
				hashId : id
			});
		});
	},

	_saveState : function (options) {
		var projectUuid = options.projectUuid,
			hashId = options.hashId;

		Project
			.findOne({uuid : projectUuid})
			.exec(function (err, project) {
				project.state = hashId;
				project.save(function (err, doc) {
				});
			});

	},

	getAll : function (options, done) {
		if (!options) return done('No options.');

		var user = options.user;

		var hashedUser = crypto.createHash('sha256').update(user.getUuid()).digest("hex");

		var hashedUser = user.getUuid(); // todo: hash user ids

		// if phantomjs bot
		if (user.isBot() || user.isSuper()) {
			Project
				.find()
				.populate('files')
				.populate('roles')
				.populate('layers')
				.exec(done);

			return;
		}

		// get all projects where user is in access.edit or access.read
		Project
			.find()
			.or([	{'access.edit' : hashedUser },
				{'access.read' : hashedUser },
				{'createdBy' : hashedUser}
			])
			.populate('files')
			.populate('roles')
			.populate('layers')
			.exec(done);
	},


	_getAll : function (done) {
		Project
			.find()
			.populate('files')
			.populate('roles')
			.populate('layers')
			.exec(done);
	},


	_getProjectByUserUuidAndCapability : function (userUuid, capability, done) {
		// get all roles with user as read_project
		var cap_filter = 'capabilities.' + capability,
				roleIds = [];

		Role
			.find({ members : userUuid })
			.where(cap_filter, true)
			.exec(function (err, roles) {
				if (err) return done(err);

				// push role id's to array
				roles.forEach(function (role) { roleIds.push(role._id); });

				Project
						.findOne({roles : { $in : roleIds }})
						.populate('files')
						.populate('roles')
						.populate('layers')
						.exec(function (err, project) {
							if (err) return done(err);
							if (!project) return done('No project found.');

							// success
							done(null, project);
						});
			});
	},


	_getAllFiltered : function (options, done) {
		if (!options) return done('No options.');


		var user = options.user,
			filter = options.cap_filter || 'read_project',
			cap_filter = 'capabilities.' + filter,
			ops = [];

		ops.push(function (callback) {
			// get all roles with user as read_project
			Role
				.find({ members : user.uuid })
				.where(cap_filter, true)
				.exec(callback);
		});

		ops.push(function (roles, callback) {
			var roleIds = [];

			roles.forEach(function (role) {
				roleIds.push(role._id);
			});

			Project
				.find({roles : { $in : roleIds }}) // todo: doesnt work?
				.populate('files')
				.populate('roles')
				.populate('layers')
				.exec(callback);
		});

		async.waterfall(ops, done);
	}

};