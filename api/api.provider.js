// API: api.provider.js

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
module.exports = api.provider = { 

	cartodb : {


	},


	mapbox : {


		setDefault : function (options, done) {	

			console.log('config: ', api.config);
		
			var project = options.project,
			    username = api.config.defaultMapboxAccount.username,
			    accessToken = api.config.defaultMapboxAccount.accessToken,
			    ops = [];

			ops.push(function (callback) {
				// add default mapbox account: systemapic
				api.provider.mapbox.requestAccount(project, username, accessToken, callback);
			});

			ops.push(function (project, mapboxLayers, accessToken, callback) {
				// create layers from mapbox data
				api.provider.mapbox.createLayers(project, mapboxLayers, accessToken, callback);
			});

			ops.push(function (project, layers, callback) {
				// add layers to project
				api.provider.mapbox.addLayersToProject(project, layers, username, accessToken, callback); 
			});

			ops.push(function(project, callback) {
				// save project
				project.markModified('layers');
				project.markModified('connectedAccounts');
				project.save(function (err, result) {
					callback(null, project);
				});
			});

			// do async and go to callback
			async.waterfall(ops, function (err, project) {
				done(null, project);
			});

		},


		// import mapbox account from username, create Layer Objects of all layers, return Layers to client.
		getAccount : function (req, res) {

			var username 	= req.body.username;
			var projectUuid = req.body.projectId;
			var accessToken = req.body.accessToken;
			var userUuid 	= req.user.uuid;

			Project
			.findOne({uuid : projectUuid})
			.populate('files')
			.populate('layers')
			.exec(function (err, project) {

				// get mapbox account
				api.provider.mapbox._getAccount(req, res, project, username, accessToken, api.project._returnProject);

			});
		},


		_getAccount : function (req, res, project, username, accessToken, callback) {

			// add ops to async queue
			var ops = [];

			ops.push(function (callback) {
				// add default mapbox account: systemapic
				api.provider.mapbox.requestAccount(project, username, accessToken, callback);
			});

			ops.push(function (project, mapboxLayers, accessToken, callback) {

				// create layers from mapbox data
				api.provider.mapbox.createLayers(project, mapboxLayers, accessToken, callback);
			});

			ops.push(function (project, layers, callback) {

				// add layers to project
				api.provider.mapbox.addLayersToProject(project, layers, username, accessToken, callback); 
			});

			ops.push(function(project, callback) {
				// save project
				project.markModified('layers');
				project.markModified('connectedAccounts');
				project.save(function (err, result) {
					callback(null, project);
				});
			});

			// do async and go to callback
			async.waterfall(ops, function (err, project) {

				// return err
				if (err) return callback(req, res, project, err);
				
				// return project
				callback(req, res, project);
			});
		},




		// send request to mapbox
		requestAccount : function (project, username, accessToken, callback) {
			
			// mapbox url
			var url = 'https://api.tiles.mapbox.com/v3/' + username + '/maps.json?secure=1&access_token=' + accessToken; 

			// send request to mapbox
			request(url, function (error, response, body) {

				// err handling
				if (error || response.statusCode != 200) return callback(error || response.statusCode);

				// parse result
				var mapboxLayers = JSON.parse(body);

				// return error thus cancel async waterfall if no layers
				if (_.isEmpty(mapboxLayers)) return callback({error : 'No layers in account.'}, project);

				// return layers to async ops
				callback(null, project, mapboxLayers, accessToken);

			});

		},


		// mapbox helper fn
		createLayers : function (project, mapboxLayers, accessToken, callback) {
			
			var layers = [];

			// create Layer in dB and save to Project
			mapboxLayers.forEach(function (ml) {

				// create Layers object
				var layer 		= new Layer();
				layer.uuid 		= 'layer-' + uuid.v4(); // unique uuid
				layer.title 		= ml.name;
				layer.description 	= ml.description;
				layer.legend		= ml.legend;
				layer.maxZoom 		= ml.maxzoom;
				layer.minZoom 		= ml.minzoom;
				layer.bounds 		= ml.bounds;
				layer.tms		= false;
				layer.data.mapbox 	= ml.id; 		// eg. rawger.geography-class
				layer.attribution 	= ml.attribution; 	// html
				layer.accessToken 	= accessToken;

				// array of Layers objects
				layers.push(layer);

				// save
				layer.save(function (err) {
					if (err) throw err;
				});

				// remove old mapbox layer if existing
				_.remove(project.layers, function (old) {
					return old.data.mapbox == ml.id;	
				});
				
			});


			callback(null, project, layers);

		},


		// mapbox helper fn
		addLayersToProject : function (project, layers, username, accessToken, callback) {

			// add new layers
			layers.forEach(function (add) {
				project.layers.addToSet(add._id); // mongodB Layer object
			});

			// add account
			var account = {
				username : username,
				accessToken : accessToken
			}
			project.connectedAccounts.mapbox.push(account);

			// return to async ops
			callback(null, project);
		
		},






	}




}