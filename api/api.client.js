// API: api.client.js

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
module.exports = api.client = { 


	// #########################################
	// ###  API: Create Client               ###
	// #########################################
	create : function (req, res) {
		// set vars
		var account = req.user,
		    store = req.body,
		    ops = [];

		ops.push(function (callback) {
			// check access
			api.access.to.create_client({
				user : account
			}, callback);
		});

		ops.push(function (options, callback) {
			// create client
			api.client._create({
				user : options.user,
				store : store
			}, callback);
		});

		async.waterfall(ops, function (err, client) {
			if (err) return api.error.general(req, res, err);

			// saved ok
			res.end(JSON.stringify(client));
		});

	},


	_create : function (options, callback) {
		var user = options.user,
		    store = options.store;

		if (!user || !store) return callback('Missing information.13');

		// create new client
		var client 		= new Clientel();
		client.uuid 		= 'client-' + uuid.v4();
		client.createdBy 	= user.uuid;
		client.createdByName    = user.firstName + ' ' + user.lastName;
		client.slug 		= store.name.replace(/\s+/g, '').toLowerCase();	// TODO: check if unique?
		client.name 		= store.name;
		client.description 	= store.description;
		client.keywords 	= store.keywords;

		// save 
		client.save(callback);

	},


	// #########################################
	// ###  API: Delete Client               ###
	// #########################################
	deleteClient : function (req, res) {
		var clientUuid = req.body.cid,
		    account = req.user,
		    ops = [];

		// find client
		ops.push(function (callback) {
			Clientel
			.findOne({uuid : clientUuid})
			.exec(callback);
		});

		// check access
		ops.push(function (client, callback) {
			api.access.to.delete_client({
				user : account,
				client : client
			}, callback);
		});

		// delete client
		ops.push(function (options, callback) {
			if (!options.client) return callback('No client.');

			// delete
			options.client.remove(callback);
		});

		// run ops
		async.waterfall(ops, function (err, result) {
			if (err) return api.error.general(req, res, err);
			res.end(JSON.stringify(result));
		});
	},


	// #########################################
	// ###  API: Update Client               ###
	// #########################################
	update : function (req, res) {
		var clientUuid	= req.body.uuid,
		    account = req.user,
		    queries = {},
		    ops = [];

		    console.log('update client: '.yellow, req.body);

		// return if missing info
		if (!clientUuid) return api.error.missingInformation(req, res);

		// find client
		ops.push(function (callback) {
			Clientel
			.findOne({uuid : clientUuid})
			.exec(callback);
		});

		// check access
		ops.push(function (client, callback) {
			api.access.to.edit_client({
				user : account, 
				client : client 
			}, callback);
		});

		// update client
		ops.push(function (options, callback) {
			api.client._update({
				client : options.client, 
				options : req.body
			}, callback);
		});

		// run ops
		async.waterfall(ops, function (err, client) {
			if (err) return api.error.general(req, res, err);

			// return
			res.end(JSON.stringify(client));
		});
	},


	_update : function (options, callback) {
		var client = options.client,
		    options = options.options,
		    queries = {};

		// valid fields
		var valid = [
			'name', 
			'logo', 
			'description', 
			'projects', 
			'slug',
		];

		// enqueue updates for valid fields
		valid.forEach(function (field) {
			if (options[field]) {
				queries = api.client._enqueueUpdate({
					queries : queries,
					field : field,
					options : options,
					client : client
				});
			}
		});

		// do updates
		async.parallel(queries, callback);
	},


	_enqueueUpdate : function (job) {
		var queries = job.queries,
		    options = job.options,
		    field = job.field,
		    client = job.client;

		// create update op
		queries[field] = function(callback) {	
			client[field] = options[field];
			client.markModified(field);
			client.save(callback);
		};
		return queries;
	},


	// check if slug is unique
	checkUniqueSlug : function (req, res) {
		Clientel.find({ 'slug' : req.body.slug}, function(err, result) { 
			if (result.length == 0) return res.end('{"unique" : true }'); 	// unique
			return res.end('{"unique" : false }');				// not unique
		});
	},


	getAll : function (options, done) {
		var user = options.user;

		// check if admin
		api.access.is.admin({
			user : user
		}, function (err, isAdmin) {

			// not admin, get all users manually
			if (err || !isAdmin) return api.client._getAllFiltered(options, done);
			
			// is admin, get all
			api.client._getAll(options, done);
		});
	},
	

	_getAll : function (options, done) {
		Clientel
		.find()
		.exec(done);
	},


	_getAllFiltered : function (options, done) {
		var user = options.user,
		    ops = [];

		// if not admin
		ops.push(function (callback) {
			// get account's projects (read_project)
			api.project.getAll({
				user: user,
			}, function (err, projects) {
				var clientUuids = [];
				_.each(projects, function (project) {
					clientUuids.push(project.client);
				});
				callback(err, clientUuids);
			});
		});

		ops.push(function (clientUuids, callback) {
			Clientel
			.find()
			.where('uuid').in(clientUuids)
			.exec(callback);
		});

		async.waterfall(ops, done);
	},
}
