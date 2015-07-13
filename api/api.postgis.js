//API: api.upload.js
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

// resumable.js
var r = require('../tools/resumable-node')('/data/tmp/');

// postgres
var pg = require('pg');


// api
var api = module.parent.exports;

// exports
module.exports = api.postgis = { 


	initUser : function (options, done) {
		var user = options.account,
		    options = options.options;

		api.postgis.createDatabase({
			user : user
		}, function (err, result) {
			if (err) return done(err);

			done(null, user);
		});

	},

	
	createDatabase : function (options, done) {

		console.log('options: ', options);

		var user = options.user,
		    userUuid = options.user.uuid,
		    dbName = api.utils.getRandomChars(6);


		var connectionString = 'postgres://docker:docker@postgis/systemapic';

		console.log('dbNAME: ', dbName);

		pg.connect(connectionString, function (err, client, callback) {
			if (err) return done(err);

			// console.log('postgis client: ', client);

			var query = 'CREATE DATABASE ' + dbName;

			// var query = 'SELECT count(*) FROM africa';

			console.log('query: ', query);

			client.query(query, function (err, result) {
				if (err) {
					console.log('pg err: ', err);
					return done(err);
				}
				console.log('Created database', dbName, result);

				client.end();
				callback();

				var result = {
					status : 'Success',
					error : false,
					dbName : dbName,
					user : userUuid
				}
				done(null, result);
			});

		});

	},

	

	// new way: postgis!
	importShapefile : function (options, done) {  // folder = folder with shapefiles inside
		var folder = options.folder,
		    name = options.name,
		    fileUuid = options.fileUuid,
		    ops = [];

		if (!folder || !name || !fileUuid) return callback('Missing info.');


		// get file list
		ops.push(function(callback) {
			fs.readdir(folder, function (err, files) {
				if (err || !files) return callback('Some files were rejected. Please upload <br>only one shapefile per zip.')

				callback(null, files);
			});
		});

		// validate shapefile 
		ops.push(function (files, callback) {
			api.geo.validateshp(files, callback);
		});

		// import to postgis
		ops.push(function (callback) {
			var options = {
				files : files, 
				folder : folder,
				clientName : 'clientName'
			}

			// import
			api.postgis._importShapefile(options, callback);
		});


		// register etc
		ops.push(function (callback) {

		});


		fs.readdir(folder, function (err, files) {
			if (err || !files) return callback('Some files were rejected. Please upload <br>only one shapefile per zip.');

			// clone array
			var shapefiles = files.slice();

			// async ops
			var ops = [];

			// check if valid shapefile(s)
			ops.push(function (done) {
				api.geo.validateshp(files, done);
			});

			// import into postgis
			ops.push(function (done) {

				var options = {
					files : files, 
					folder : folder,
					clientName : 'clientName'
				}
				api.geo.import2postgis(options, done);
			});

			// // convert shapefile to geo/topojson
			// ops.push(function (done) {
			// 	api.geo.convertshp(files, folder, done);
			// });

			// run async jobs
			async.series(ops, function (err, results) {
				if (err) {
					console.log('MOFO!!'.red, err);
					return callback(err);
				}

				var key = results[1];
				if (!key) return callback('No key.');

				var path = key.path;
				var name = key.name;
				var fileUuid = key.fileUuid;

				// add geojson file to list
				shapefiles.push(name);

				// return as db entry
				var db = {
					files : shapefiles,
					data : {
						geojson : name
					},
					title : name,
					file : fileUuid
				}

				// todo: meta from postgis

				// return
				callback(null, db);

			});
		});
	},

	_importShapefile : function (options, done) {

		var files = options.files,
		    folder = options.folder,
		    clientName = options.clientName,
		    shps = api.geo.getTheShape(files);

		console.log('import2postgis(), files: ', files, folder);

		if (!shps) console.error('ERR: 401 -> No shapefile?????'); //todo

		// vars
		var shp = shps[0],
		    base = shp.slice(0,-4),
		    fileUuid = clientName + '_' + uuid.v4(),
		    shapefile_path = '"' + folder + '/' + shp + '"';

		console.log('shp: ', shp);
		console.log('base: ', base);
		console.log('fileUuid: ', fileUuid);


		var ops = [];

		// // check that user has database, if not create
		// ops.push(function (callback) {
		// 	User
		// 	.findOne({uuid : })

		// });
		
		// configs
		var pg_username = 'docker';
		var pg_password = 'docker';
		var pg_host = 'postgis';
		var pg_db = 'systemapic';

		// var cmd = 'shp2pgsql -I egypt/EGY-level_1.shp file-322323-232332 | PGPASSWORD=docker psql -h 172.17.8.151 --username=docker systemapic'
		var cmd = [
			'shp2pgsql',
			'-I',
			shapefile_path,
			fileUuid,
			'|',
			'PGPASSWORD=' + pg_password,
			'psql',
			'-h',
			pg_host,
			'--username=' + pg_username,
			pg_db
		]

		var command = cmd.join(' ');
		console.log('command: ', command);

		// import to postgis
		console.time('import took');
		exec(command, {maxBuffer: 1024 * 50000}, function (err, stdin, stdout) {
			// console.log('cmd done', stdout, stdin, err);
			console.timeEnd('import took');

			console.log('shp2psql err: ', err);

			var returnObject = {
				path : 'postgis_debug_path', 
				name : 'postgis_debug_name', 
				fileUuid : fileUuid
			}

			done(err, returnObject);
		});
	}

}