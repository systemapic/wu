// API: api.import.js

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
var dir 	= require('node-dir');
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

var ZipInfo = require('infozip');

// resumable.js
var r = require('../tools/resumable-node')('/data/tmp/');

// api
var api = module.parent.exports;

// exports
module.exports = api.import = { 

	import : function (options, done) {

		var files = options.files;
		var user = options.user;
		var uploadStatus = options.uploadStatus;
		var body = options.body;
		var access_token = options.access_token;
		var file_id = uploadStatus.file_id;
		var import_start_time = new Date().getTime();
		var use_sockets = options.use_sockets;
		var addToProject = options.addToProject;
		var ops = [];

		// import data
		ops.push(function (callback) {

			// import options
			var options = {
				file_id : file_id,
				files : files,
				options : body,
				user : user,
				timestamp : uploadStatus.timestamp
			}

			// ping progress
			use_sockets && api.socket.processingProgress({
				user_id : user._id,
				progress : {
					text : 'Preparing import...',
					error : null,
					percent : 10,
					uniqueIdentifier : uploadStatus.uniqueIdentifier,
				}
			});

			// process upload
			api.import.prepareImport(options, function (err, opts) {
				if (err) return callback(err);

				opts.user_id = user._id;
				opts.uniqueIdentifier = uploadStatus.uniqueIdentifier;

				// ping progress
				use_sockets && api.socket.processingProgress({
					user_id : user._id,
					progress : {
						text : 'Importing...',
						error : null,
						percent : 20,
						uniqueIdentifier : uploadStatus.uniqueIdentifier,
					}
				});

				// get uploadStatus, get meta, set to file
				api.upload._getUploadStatus(file_id, function (err, uploadStatus) {

					if (0 && uploadStatus.data_type == 'raster') {
						api.geo.handleRaster(opts, callback);

					} else {
						// postgis import
						api.postgis.import(opts, callback);
					}

				});

			});
		});

		// create file model
		ops.push(function (callback) {
			api.upload._createFileModel(file_id, function (err, file) {
				if (err) return callback(err);
				
				// get uploadStatus, get meta, set to file
				api.upload._getUploadStatus(file_id, function (err, uploadStatus) {

					var meta = uploadStatus.metadata;

					// save meta to file
					if (uploadStatus.data_type == 'vector') {
						file.data.postgis.metadata = meta;
					} else {
						file.data.raster.metadata = JSON.stringify(meta);
					}
					
					// save file
					file.save(function (err, doc) {

						// add to user
						api.file.addNewFileToUser({
							user : user,
							file : doc
						}, callback);

					});
				});
			});
		});

		// set upload status
		ops.push(function (callback) {

			// set upload status, expire in one day
			api.upload.updateStatus(file_id, {
				processing_success : true,
				status : 'Done', 
			}, callback);
		});



		// run ops
		async.series(ops, function (err, results) {
			
			// if err, set upload status, return
			if (err) {

				// update upload status
				api.upload.updateStatus(file_id, { // todo: more specific error reporting
					error_code : 1, 
					error_text : err,
					processing_success : false,
					status : 'Failed',
					error : true,
					error_debug : 'api.import.import',
				}, function (err2) {

					// send error message on socket
					use_sockets && api.socket.sendError(user._id, {
						title : 'Upload failed.',
						description : err,
						uniqueIdentifier : uploadStatus.uniqueIdentifier,
					});
				});

				// return err
				return done(err);
			}


			// calc import time
			var import_stop_time = new Date().getTime();
			var import_took_ms = import_stop_time - import_start_time;

			// ping client
			use_sockets && api.upload._notifyProcessingDone({
				file_id : file_id,
				user_id : user._id,
				import_took_ms : import_took_ms
			});

			// ping progress
			use_sockets && api.socket.processingProgress({
				user_id : user._id,
				progress : {
					text : 'Processing done!',
					error : null,
					percent : 100,
					uniqueIdentifier : uploadStatus.uniqueIdentifier,
				}
			});


			// add to project
			if (addToProject) {

				console.log('adding to project!!!');


			}


			// all done
			done(err);
		});	
	},

	/**
	 * Prepare upload before organizing (unzip, etc.)
	 *
	 * @private
	 *
	 * @function api.upload.organizeImport
	 * @param {object} options - Options object containing uploadID, user, req.body, req.files
	 * @returns null
	 */
	prepareImport : function (options, done) {

		var files = options.files, // get files object
		    temporaryPath = files.data.path, // get path
		    ext = temporaryPath.split('.').reverse()[0].trim(), // get file extension
		    ops = [];

		// set original filename + size
		options.size = files.data.size;
		options.ext = ext;
		options.originalFilename = files.data.originalFilename;

		// organize files so output is equal no matter what :)
		if (ext == 'zip') ops.push(function (callback) {
			api.upload.unzip(options, function (err, files) {
				options.files = files;
				callback(err);

				// todo: mark if vector/raster?
			});
		});

		if (ext == 'gz') ops.push(function (callback) {
			api.upload.untar(options, function (err, files) {
				options.files = files;
				callback(err);
			});
		});

		if (ext == 'geojson') ops.push(function (callback) {
			options.files = [temporaryPath];
			callback(null);
		});

		if (ext == 'tif') ops.push(function (callback) {
			options.files = [temporaryPath];
			api.upload.updateStatus(options.file_id, {data_type : 'raster'}, callback)
		});

		if (ext == 'tiff') ops.push(function (callback) {
			options.files = [temporaryPath];
			api.upload.updateStatus(options.file_id, {data_type : 'raster'}, callback)
		});

		if (ext == 'ecw') ops.push(function (callback) {
			options.files = [temporaryPath];
			api.upload.updateStatus(options.file_id, {data_type : 'raster'}, callback)
		});

		if (ext == 'jp2') ops.push(function (callback) {
			options.files = [temporaryPath];
			api.upload.updateStatus(options.file_id, {data_type : 'raster'}, callback)
		});

		// run ops
		async.series(ops, function (err) {
			if (err) console.log('api.upload.prepareImport err 3', err);
			done(err, options);
		});

	},


	organizeImport : function (options, done) { 	// todo: remove perhaps

		// import to postgis
		api.postgis.import(options, done);
	},













}

