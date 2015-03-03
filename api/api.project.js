// API: api.project.js

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
module.exports = api.project = { 


	// #########################################
	// ###  API: Create Project              ###
	// #########################################
	// createProject : function (req, res) {
	create : function (req, res) {
		var store = req.body,
		    account = req.user,
		    ops = [];


		// return if missing info
		if (!store) return api.error.missingInformation(req, res);

		// check access
		ops.push(function (callback) {
			api.access.to.create_project({
				user : account
			}, callback);
		});

		// create role
		ops.push(function (options, callback) {
			api.access._createDefaultRoles({
				user : account,
			}, callback);
		});

		// create project
		ops.push(function (roles, callback) {
			api.project._create({
				user : account,
				roles : roles,
				store : store
			}, callback);
		});

		// set default mapbox account
		ops.push(function (project, callback) {
			api.provider.mapbox.setDefault({
				project : project
			}, callback);
		});

		// run ops
		async.waterfall(ops, function (err, project) {
			if (err) return api.error.general(req, res, err);

			// slack
			api.slack.createdProject({
				project : project, 
				user : account
			});

			// return
			api.project._returnProject(req, res, project);
		});
	},


	_create : function (options, done) {
		if (!options) return done('No options.');

		var user = options.user,
		    roles = options.roles,
		    store = options.store,
		    slug = crypto.randomBytes(3).toString('hex');
		
		if (!store || !user) return done('Missing information.8');

		// create model
		var project 		= new Project();
		project.uuid 		= 'project-' + uuid.v4();
		project.createdBy 	= user.uuid;
		project.createdByName   = user.firstName + ' ' + user.lastName;
		project.slug 		= slug;
		project.name 		= store.name;
		project.description 	= store.description;
		project.keywords 	= store.keywords;
		project.client 		= store.client;
		project.position 	= store.position;

		// add roles
		roles.forEach(function (role) {
			project.roles.addToSet(role._id);
		});

		// save
		project.save(function (err, project, numAffected) { 	// major GOTCHA!!! product.save(function (err, product, numberAffected) 
			done(err, project);				// returns three args!!!
		});
	},


	// #########################################
	// ###  API: Delete Project              ###
	// #########################################
	deleteProject : function (req, res) {
		if (!req.body) return api.error.missingInformation(req, res);

		var account     = req.user,
		    clientUuid 	= req.body.clientUuid,
		    projectUuid = req.body.projectUuid;

		var ops = [];

		ops.push(function (callback) {
			Project
			.findOne({uuid : projectUuid})
			.populate('roles')
			.exec(callback);
		});

		ops.push(function (project, callback) {
			api.access.to.delete_project({
				user : account, 
				project : project
			}, callback);
		});

		ops.push(function (options, callback) {
			if (!options || !options.project) return callback('No project.');

			options.project.remove(callback);
		});

		async.waterfall(ops, function (err, project) {
			if (err || !project) return api.error.general(req, res, err);

			// slack
			api.slack.deletedProject({
				project : project,
				user : account
			});

			// done
			res.end(JSON.stringify({
				project : project.uuid,
				deleted : true
			}));
		})
	},

	// #########################################
	// ###  API: Update Project              ###
	// #########################################
	update : function (req, res) {
		if (!req.body) return api.error.missingInformation(req, res);
		
		var account = req.user,
		    projectUuid = req.body.uuid,
		    ops = [];

		console.log('Updating project.'.yellow);
		console.log('body: ', req.body);

		// return on missing
		if (!projectUuid) return api.error.missingInformation(req, res);

		ops.push(function (callback) {
			Project
			.findOne({uuid : projectUuid})
			.populate('roles')
			.exec(callback);
		});

		ops.push(function (project, callback) {
			api.access.to.edit_project({
				user : account,
				project : project
			}, callback);
		});

		ops.push(function (options, callback) {
			api.project._update({
				project : options.project,
				options : req.body
			}, callback);
		});

		async.waterfall(ops, function (err, project) {
			if (err) return api.error.general(req, res, err);

			// done
			res.end(JSON.stringify(project));
		});
	},


	_update : function (job, callback) {
		if (!job) return callback('Missing job.');

		var project = job.project,
		    options = job.options,
		    queries = {};

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
			'thumbCreated'
		];

 		// enqueue queries for valid fields
		valid.forEach(function (field) {
			if (options[field]) queries = api.project._enqueueUpdate({
				queries : queries,
				field : field,
				project : project,
				options : options
			});
		});

		// run queries to database
		async.parallel(queries, callback);
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
			project.save(callback);
		};
		return queries;
	},


	// #########################################
	// ###  API: Check Unique Slug           ###
	// #########################################
	checkUniqueSlug : function (req, res) {
		if (!req.body) return api.error.general(req, res);

		var value = req.body.value,
		    clientUuid = req.body.client,
		    projectUuid = req.body.project,
		    slugs = [];

		Project
		.find({client : clientUuid})
		.exec(function (err, projects) {
			if (err) return api.error.general(req, res, err);

			// get slugs
			projects.forEach(function (p) {
				// add but self
				if (p.uuid != projectUuid) slugs.push(p.slug.toLowerCase());
			});

			// check if slug already exists
			var unique = !(slugs.indexOf(value.toLowerCase()) > -1);

			// return results
			res.end(JSON.stringify({
				unique : unique
			}));
		});
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
		    id 		= req.body.hash.id;

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
			if (err || !isAdmin) return api.project._getAllFiltered(options, done);
			
			// is admin, get all
			api.project._getAll(options, done);
		});
	},

	_getAll : function (options, done) {
		Project
		.find()
		.populate('files')
		.populate('roles')
		.populate('layers')
		.exec(done);
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
	},

}