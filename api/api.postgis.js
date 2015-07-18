// API: api.upload.js
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
var srs 	= require('srs');
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

// resumable.js
var r = require('../tools/resumable-node')('/data/tmp/');

// postgres
var pg = require('pg');

// api
var api = module.parent.exports;

// exports
module.exports = api.postgis = { 

	
	createDatabase : function (options, done) {
		var user = options.user,
		    userUuid = options.user.uuid,
		    userName = '"' + options.user.firstName + ' ' + options.user.lastName + '"',
		    pg_db = api.utils.getRandomChars(10),
		    CREATE_DB_SCRIPT_PATH = '../scripts/postgis/create_database.sh'; // todo: put in config
		
		// create database script
		var command = [
			CREATE_DB_SCRIPT_PATH, 	// script
			pg_db, 			// database name
			userName,		// username
			userUuid		// userUuid
		].join(' ');

		// create database in postgis
		exec(command, {maxBuffer: 1024 * 50000}, function (err) {
			if (err) return done(err);

			// save pg_db name to user
			User
			.findOne({uuid : userUuid})
			.exec(function (err, usr) {
				usr.postgis_database = pg_db;
				usr.save(function (err) {
					options.user = usr; // add updated user
					done(null, options);
				});
			});
		});
	},


	ensureDatabaseExists : function (options, done) {
		var userUuid = options.user.uuid;

		User
		.findOne({uuid : userUuid})
		.exec(function (err, user) {
			if (err) return done(err);

			// if already exists, return
			if (user.postgis_database) return done(null, options);

			// doesn't exist, must create
			api.postgis.createDatabase(options, function (err, opts) {
				if (err) return done(err);

				// all good
				done(null, opts);
			});
		});
	},


	import : function (options, done) {

		var ops = [];

		// ensure database exists
		ops.push(function (callback) {
			api.postgis.ensureDatabaseExists(options, callback);
		});

		// import according to type
		ops.push(function (options, callback) {

			console.log('import', options);

			// get which type of data
			var geotype = api.postgis._getGeotype(options);

			// if no geotype, something's wrong
			if (!geotype) return callback('api.upload.organizeImport err 4: invalid geotype!');

			// send to appropriate api.postgis.import
			if (geotype == 'shapefile') 	return api.postgis.importShapefile(options, callback);
			if (geotype == 'geojson') 	return api.postgis.importGeojson(options, callback);
			if (geotype == 'raster') 	return api.postgis.importRaster(options, callback);

			// not type caught, err
			callback('Not a valid geotype. Must be Shapefile, GeoJSON or Raster.');

		});

		async.waterfall(ops, function (err, results) {
			done && done(err, results);
		});

	},


	importGeojson : function (options, done) {
		console.log('importGeosjon', options);

		// need to convert to ESRI shapefile (ouch!) first..
		var geojsonPath = options.files[0],
		    geojsonBasename = api.postgis._getBasefile(geojsonPath),
		    shapefileFolder = '/data/tmp/' + api.utils.getRandom(5) + '/',
		    shapefileBasename = geojsonBasename + '.shp',
		    shapefilePath = shapefileFolder + shapefileBasename,
		    ops = [];

		// create dir
		ops.push(function (callback) {
			fs.ensureDir(shapefileFolder, callback);
		});

		// convert to shape
		ops.push(function (callback) {
			var cmd = [
				'ogr2ogr',
				'-f',
				'"ESRI Shapefile"',
				shapefilePath,
				geojsonPath
			].join(' ');

			exec(cmd, callback);
		});


		ops.push(function (callback) {

			// get content of dir
			fs.readdir(shapefileFolder, function (err, files) {
				if (err) return callback(err);

				// add path to files, and add to options
				options.files = [];
				files.forEach(function (file) {
					options.files.push(shapefileFolder + file);
				});

				callback(null);
			});
		});


		ops.push(function (callback) {

			// do shapefile import
			api.postgis.importShapefile(options, function (err, results) {

				// set upload status
				api.upload.updateStatus(options.upload_id, {
					original_format : 'GeoJSON',
				}, function () {
					// return
					callback(err, results);
				});
			});

		});

		// run ops
		async.series(ops, done);
	},

	
	importRaster : function (options, done) {
		var clientName 	= options.clientName,
		    raster 	= options.files[0],
		    fileUuid 	= 'raster_' + api.utils.getRandom(10),
		    pg_db 	= options.user.postgis_database,
		    original_format = api.postgis._getRasterType(raster);

		console.log('############ original_f', original_format);
		var IMPORT_RASTER_SCRIPT_PATH = '../scripts/postgis/import_raster.sh'; // todo: put in config
		
		// create database script
		var cmd = [
			IMPORT_RASTER_SCRIPT_PATH, 	// script
			raster,
			fileUuid,
			pg_db
		].join(' ');

		// import to postgis
		var startTime = new Date().getTime();
		exec(cmd, {maxBuffer: 1024 * 50000}, function (err) {
			var endTime = new Date().getTime();

			// set err on upload status
			if (err) return api.upload.updateStatus(options.upload_id, {
				error_code : 2,
				error_text : err
			}, function () {
				// return
				done(err);
			});


			// set upload status
			api.upload.updateStatus(options.upload_id, {
				data_type : 'raster',
				original_format : original_format,
				import_took_ms : endTime - startTime,
				table_name : fileUuid,
				database_name : pg_db
			}, function () {
				// return
				done(err, 'Raster imported successfully.');
			});
		});

	},

	importShapefile : function (options, done) {
		var files 	= options.files,
		    shape 	= api.geo.getTheShape(files)[0],
		    prjfile 	= api.geo.getTheProjection(files)[0],
		    fileUuid 	= 'shape_' + api.utils.getRandom(10),
		    pg_db 	= options.user.postgis_database,
		    ops 	= [];

		var IMPORT_SHAPEFILE_SCRIPT_PATH = '../scripts/postgis/import_shapefile.sh'; // todo: put in config
		

		console.log('prjfile: ', prjfile);


		ops.push(function (callback) {

			if (prjfile) {
				fs.readFile(prjfile, function (err, prj4) {
					console.time('srid');
					var srid = srs.parse(prj4);
					console.timeEnd('srid');
					console.log('srid: ', srid);
					callback(err, srid);
				});
			} else {
				// no prj file
				callback(null, false);
			}
		});



		ops.push(function (srid, callback) {

			var srid_converted = srid.srid + ':3857'; 

			// create database script
			var cmd = [
				IMPORT_SHAPEFILE_SCRIPT_PATH, 	// script
				shape,
				fileUuid,
				pg_db,
				srid_converted
			].join(' ');

			console.log('cmd: ', cmd);

			// import to postgis
			var startTime = new Date().getTime();
			exec(cmd, {maxBuffer: 1024 * 50000}, function (err, stdout, stdin) {
				console.log('stdout', err, stdout, stdin);
				if (err) console.log('import_shapefile_script err: ', err);

				var endTime = new Date().getTime();

				// set import time to status
				api.upload.updateStatus(options.upload_id, {
					data_type : 'vector',
					import_took_ms : endTime - startTime,
					table_name : fileUuid,
					database_name : pg_db
				}, function () {
					callback(err, 'Shapefile imported successfully.');
				});

				
			});
		});

		// count rows for upload status
		ops.push(function (success, callback) {
			
			api.postgis.query({
				postgis_db : pg_db,
				query : 'SELECT count(*) from ' + fileUuid
			}, function (err, result) {
				if (err) return callback(null);
				
				// set upload status
				api.upload.updateStatus(options.upload_id, {
					rows_count : result.rows[0].count
				}, function () {
					callback(null);
				});
			});
		});

		// run ops
		async.waterfall(ops, done);

	},


	query : function (options, callback) {
		var postgis_db = options.postgis_db,
		    variables = options.variables,
		    query = options.query;

		// count rows and add to uploadStatus
		var conString = 'postgres://docker:docker@postgis/' + postgis_db; // todo: put in config
		pg.connect(conString, function(err, client, pgcb) {
			if (err) {
				console.log('api.postgis.query err, pg.connect', err);
				return callback(null);
			}
			
			// do query
			client.query(query, variables, function(err, result) {
				// clean up after pg
				pgcb();
				client.end();

				if (err) {
					console.log('api.postgis.query err, client.query', err);
					return callback(err); 
				}
				
				// return result
				callback(null, result);
			});
		});
	},


	_getGeotype : function (options) {
		var files = options.files,
		    type = false;

		// only one file
		if (files.length == 1) {
			var ext = files[0].split('.').reverse()[0];
			if (ext == 'geojson') return 'geojson';
			if (ext == 'ecw') return 'raster';
			if (ext == 'jp2') return 'raster';
			if (ext == 'tif') return 'raster';
			if (ext == 'tiff') return 'raster';
		}

		// several files
		files.forEach(function (file) {
			var ext = file.split('.').reverse()[0];
			if (ext == 'shp') type = 'shapefile';
		});

		return type;
	},

	_getExtension : function (file) {
		var ext = file.split('.').reverse()[0];
		return ext;
	},


	_getShapefile : function (shapes) {
		var shapefile;
		for (s in shapes) {
			if (shapes[s] && shapes[s].slice(-4) == '.shp') {
				var shapefile = shapes[s];
			}
		}
		return shapefile;
	},


	_getBasefile : function (file) {
		var filename = file.split('/').reverse()[0];
		return filename;
	},

	_getRasterType : function (file) {
		var extension = api.postgis._getExtension(file);
		if (extension == 'ecw') 			return 'ERDAS Compressed Wavelets (ECW)';
		if (extension == 'tif' || extension == 'tiff') 	return 'GeoTIFF';
		if (extension == 'jp2') 			return 'JPEG-2000';

		return 'Unknown';
	},

}