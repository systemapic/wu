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
console.log('PROJECT === api=>', api);



// exports
module.exports = api.project = { 


	// #########################################
	// ###  API: Create Project              ###
	// #########################################
	// createProject : function (req, res) {
	create : function (req, res) {


		console.log('________________');
		console.log('API: createProject');
		console.log('_________________');

		var store = req.body,
		    user = req.user,
		    ops = [];

		// return if not authorized
		if (!api.permission.to.create.project(user)) return api.error.unauthorized(req, res);

		return api.error.unauthorized(req, res);


		// create role
		ops.push(function (callback) {

			// create role for projectOwner
			api.permission._createRole({
				template : 'projectOwner',
				members : [user.uuid],
				capabilities : [],
				name : 'Project Owner'
			}, callback);

		});

		// create access group
		ops.push(function (role, callback) {

			// create access group for project with role
			api.permission._createAccessGroup({
				roles : [role]
			}, callback);

		});

		// create project
		ops.push(function (group, callback) {

			// create project
			api.project._create({
				user : user,
				group : group,
				store : store
			}, callback);

		});


		ops.push(function (project, callback) {

			// set default mapbox account
			// api._setDefaultMapbox({
			api.provider.mapbox.setDefault({
				project : project
			}, callback);

		});


		async.waterfall(ops, function (err, project) {

			// return project to client
			api.project._returnProject(req, res, project);

		});


	},



	_create : function (options, callback) {

		console.log('DEV: _createProject', options);


		var user = options.user,
		    group = options.group,
		    store = options.store,
		    slug = crypto.randomBytes(3).toString('hex');
		
		// create mongo
		var project 		= new Project();
		project.uuid 		= 'project-' + uuid.v4();
		project.createdBy 	= user.uuid;
		project.createdByName   = user.firstName + ' ' + user.lastName;
		project.slug 		= slug;
		project.name 		= store.name;
		project.description 	= store.description;
		project.keywords 	= store.keywords;
		project.client 		= store.client;
		project.accessGroup 	= group._id;

		callback(null, project);

		console.log('craeted project', project);
	},

	// #########################################
	// ###  API: Delete Project              ###
	// #########################################
	deleteProject : function (req, res) {

		var user        = req.user,
		    userUuid 	= req.user.uuid,
		    clientUuid 	= req.body.clientUuid,
		    projectUuid = req.body.projectUuid;

		// find project (async)
		var model = Project.findOne({ uuid : projectUuid });
		model.exec(function (err, project) {
			
			// return if not authorized
			if (!api.permission.to.remove.project( user, project )) {
				var message = 'Unauthorized access attempt. Your IP ' + req._remoteAddress + ' has been logged.';
				return res.end(JSON.stringify({ error : message }));
			};


			// remove project
			model.remove(function (err, result) {
			
				// todo!!! remove from users 
				api.removeProjectFromEveryone(project.uuid);

				// return success
				return res.end(JSON.stringify({
					result : 'Project ' + project.name + ' deleted.'
				}));
			});
		});
	},

	// #########################################
	// ###  API: Update Project              ###
	// #########################################
	update : function (req, res) {
		console.log('Updating project.', req.body);

		var user        = req.user;
		var userid 	= req.user.uuid;
		var projectUuid = req.body.uuid;

		// find project
		var model = Project.findOne({ uuid : projectUuid });
		model.exec(function (err, project) {
			
			// return error
			if (err) return res.end(JSON.stringify({ error : 'Error retrieving project.' }));
			
			// return if not authorized
			if (!api.permission.to.update.project(user, project)) {
				var message = 'Unauthorized access attempt. Your IP ' + req._remoteAddress + ' has been logged.';
				return res.end(JSON.stringify({ error : message }));
			};


					
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
	
			var queries = {};

			// enqueue queries for valid fields
			valid.forEach(function (field) {
				if (req.body[field]) {
					console.log('Updating project field: ', field);

					// enqueue update
					queries = api.project._enqueueProjectUpdate(queries, field, req);
				}
			});

			// run queries to database
			async.parallel(queries, function(err, doc) {
				// handle err
				if (err) return res.end(JSON.stringify({ 
					error : "Error updating project." 
				}));
							
				// return doc
				res.end(JSON.stringify(doc));
			});
		});
	},


	// async mongo update queue
	_enqueueProjectUpdate : function (queries, field, req) {
		queries[field] = function(callback) {	
			return Project.findOne({ uuid : req.body.uuid }, function (err, project){
				project[field] = req.body[field];
				project.markModified(field);
				project.save(function(err) {
					if (err) console.error(err); // log error
				});
				return callback(err);
			});
		};
		return queries;
	},

	// #########################################
	// ###  API: Check Unique Slug           ###
	// #########################################
	checkUniqueSlug : function (req, res) {

		var value = req.body.value,
		    clientUuid = req.body.client,
		    projectUuid = req.body.project,
		    slugs = [];

		Project
		.find({client : clientUuid})
		.exec(function (err, projects) {

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

	_returnProject : function (req, res, project, error) {
		if (error) console.error(error);

		Project
		.findOne({uuid : project.uuid})
		.populate('files')
		.populate('layers')
		.populate('accessGroup')
		// .populate('accessGroup.roles')
		// .populate({path : 'accessGroup', select : 'roles'})
		.exec(function (err, project) {
			if (err) console.error(err);

			// project.populate('accessGroup.roles');
			
			res.end(JSON.stringify({
				error : err,
				project: project
			}));
		});

	},


	getHash : function (req, res) {
	
		var id = req.body.id;
		var projectUuid = req.body.projectUuid;		// todo: access restrictions

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
		console.log('setHash: req.body: ', req.body);

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
			console.log('hash saved', err, doc);
			res.end(JSON.stringify({
				error: err,
				hash : doc
			}));
		});
	},	



	getAll : function (callback, user) {
		
		// async queries
		var a = {};

		// is superadmin, get all projects
		if (api.permission.superadmin(user)) {
			a.superadminProjects = function (cb) {
				Project
				.find()
				.populate('files')
				.populate('layers')
				.exec(function(err, result) { 
					cb(err, result); 
				});
			}
		}
		
		// get all projects created by user
		a.createdBy = function (cb) {
			Project
			.find({createdBy : user.uuid})
			.populate('files')
			.populate('layers')
			.exec(function(err, result) { 
				cb(err, result); 
			});
		}

		// get all projects that user is editor for
		a.editor = function (cb) {
			Project
			.find({ uuid : { $in : user.role.editor.projects } })
			.populate('files')
			.populate('layers')
			.exec(function(err, result) { 
				cb(err, result); 
			});
		}

		// get all projects user is reader for
		a.reader = function (cb) {
			Project
			.find({ uuid : { $in : user.role.reader.projects } })
			.populate('files')
			.populate('layers')
			.exec(function(err, result) { 
				cb(err, result); 
			});
		}


		// do async 
		async.parallel(a, function (err, result) {
			
			// return error
			if (err) return callback(err);

			// move into one array
			var array = [];
			for (r in result) {
				array.push(result[r]);
			}

			// flatten
			var flat = _.flatten(array)

			// remove duplicates
			var unique = _.unique(flat, 'uuid');

			callback(err, unique);
		});
		
		

	},

	



}