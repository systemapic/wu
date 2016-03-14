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
var _ 		= require('lodash');
var fs 		= require('fs-extra');
var gm 		= require('gm');
var pg 		= require('pg');
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
var sanitize 	= require("sanitize-filename");
var nodepath    = require('path');
var formidable  = require('formidable');
var nodemailer  = require('nodemailer');
var geojsonArea = require('geojson-area');
var uploadProgress = require('node-upload-progress');
var mapnikOmnivore = require('mapnik-omnivore');
var httpStatus = require('http-status');
var errors = require('../shared/errors');

// resumable.js
var r = require('../tools/resumable-node')('/data/tmp/');

// api
var api = module.parent.exports;

// exports
module.exports = api.postgis = { 

	

	deleteTable : function (options, done) {
		var database_name = options.database_name,
		    table_name = options.table_name,
		    DROP_TABLE_SCRIPT = '../scripts/postgis/drop_table.sh';

		// missing information
		if (!database_name || !table_name) {
			return done({
				message: errors.database_name_or_table_name_does_not_exist.errorMessage,
				code: httpStatus.NOT_FOUND
			});
		}
		// validation, todo: improve
		if (!table_name.length == 25) {
			return done({
				message: util.format(errors.invalid_table_name.errorMessage, table_name),
				code: httpStatus.BAD_REQUEST
			});
		}

		// cmd
		var command = [
			DROP_TABLE_SCRIPT,
			database_name,
			table_name
		].join(' ');

		// run
		exec(command, {maxBuffer: 1024 * 50000}, function (err) {
			if (err) {
				return done({
					message: util.format(errors.dropTable_error.errorMessage, table_name),
					code: httpStatus.INTERNAL_SERVER_ERROR,
					errors: {
						error: err
					}
				});
			}
			done(null);
		});
	},


	_cleanSQLQuery : function (sql) {
		var sql = sql;
		var a = sql.replace('(', '');
		var b = a.replace(') as sub', '');
		var c = b.replace('\n', ' ');
		var c = c.replace('\n', ' ');
		var c = c.replace('\n', ' ');
		var c = c.replace('\n', ' ');
		var c = c.replace('\n', ' ');
		var c = c.replace('\n', ' ');
		var c = c.replace('\n', ' ');
		var c = c.replace('\n', ' ');
		var c = c.replace('\n', ' ');
		var c = c.replace('\n', ' ');
		var c = c.replace('\n', ' ');
		var c = c.replace('\n', ' ');
		var c = c.replace('\n', ' ');
		var cleanSQL = '"' + c + '"';
		return cleanSQL;
	},

	_setDownloadProgress : function (options, callback) {
		var id = 'download_status:' + options.download_status_id;
		api.redis.layers.set(id, JSON.stringify(options), callback);
	},

	_getDownloadProgress : function (options, callback) {
		var id = 'download_status:' + options.download_status_id;
		api.redis.layers.set(id, callback);
	},

	// query progress by GET
	getDownloadProgress : function (req, res) {
		var options = req.body,
		    download_status_id = options.download_status_id;
		
		// missing info
		if (!download_status_id) return api.error.missingInformation(req, res);

		// get status
		api.postgis._getDownloadProgress(options, function (err, status) {
			if (err) return api.error.general(req, res, err);

			// return status
			res.send(status);
		});
	},


	downloadDatasetFromLayer : function (req, res) {
		var options = req.body || {};
		var layer_id = options.layer_id;
		var user = req.user;
		var ops = [];
		var layername;
		var download_status_id = api.utils.getRandomChars(8);


		// mark and return
		ops.push(function (callback) {

			// set download status is
			var status = {
				download_status_id : download_status_id,
				finished : false,
				time_start : Date().now,
				file_id : layer_id
			}

			// set download status
			api.postgis._setDownloadProgress(status);

			// return result
			res.send(status);

			// next
			callback(null);
		});

		// get layer
		ops.push(function (callback) {
			Layer
			.findOne({uuid : layer_id})
			.exec(callback);
		});

		// download
		ops.push(function (layer, callback) {

			// prettify name
			layername = layer.title.replace(/ /g,'').replace('.zip', '');

			var opts = {
				database_name 	: layer.data.postgis.database_name,
				table_name 	: layer.data.postgis.table_name,
				data_type 	: layer.data.postgis.data_type,
				query 		: api.postgis._cleanSQLQuery(layer.data.postgis.sql),
				name 		: layername,
				user 		: req.user
			}

			// get dataset
			api.postgis.downloadDataset(opts, callback);
		});

		// run ops
		async.waterfall(ops, function (err, filepath) {

			var status = {
				download_status_id : download_status_id,
				finished : true,
				filepath : filepath,
				file_id : layer_id
			}

			// set download status
			api.postgis._setDownloadProgress(status);

			// send socket notification if subscribed
			if (options.socket_notification) api.socket.downloadReady({
				user : req.user,
				status : status
			});

			// send to slack-monitor
			api.analytics.downloadedDataset({
				user : user,
				filename : layername
			})
		});

	},



	downloadDatasetFromFile: function (req, res, next) {
		var options = req.body || {};
		var file_id = options.file_id;
		var user = req.user;
		var ops = [];
		var filename;
		var download_status_id = api.utils.getRandomChars(8);

		// mark, return json
		ops.push(function (callback) {

			// set download status id
			var status = {
				download_status_id : download_status_id,
				finished : false,
				time_start : Date().now,
				file_id : file_id
			}

			// set download status
			api.postgis._setDownloadProgress(status);

			// return result
			res.send(status);

			// next
			callback(null);
		});

		
		// get file
		ops.push(function (callback) {
			File
			.findOne({uuid : file_id})
			.exec(callback);
		});

		// download
		ops.push(function (file, callback) {

			// prettify name
			var table_name = file.data.postgis.table_name;
			filename = file.name.replace(/ /g,'').replace('.zip', '');

			var options = {
				database_name 	: file.data.postgis.database_name,
				table_name 	: file.data.postgis.table_name,
				data_type 	: file.data.postgis.data_type,
				query 		: '"SELECT * FROM ' + table_name + '"',
				name 		: filename,
				user 		: req.user
			}

			// get dataset
			api.postgis.downloadDataset(options, callback);
		});

		// run ops
		async.waterfall(ops, function (err, filepath) {

			var status = {
				download_status_id : download_status_id,
				finished : true,
				filepath : filepath,
				file_id : file_id
			}

			// set download status
			api.postgis._setDownloadProgress(status);

			// send socket notification (if subscribed)
			if (options.socket_notification) api.socket.downloadReady({
				user : req.user,
				status : status
			});

			// send to slack
			api.analytics.downloadedDataset({
				user : user,
				filename : filename
			})
		});
	},

	downloadDataset : function (options, done) {
		var database_name = options.database_name,
		    table_name = options.table_name,
		    data_type = options.data_type,
		    query = options.query,
		    name = options.name,
		    user = options.user,
		    ops = [];

		ops.push(function (callback) {

			// where to put file
			var filePath = database_name + '/' + table_name + '/' +  api.utils.getRandomChars(5) + '/',
			    folder = api.config.path.temp + filePath,
			    filename = sanitize(name),
			    output = folder + filename,
			    returnOutput = filePath + filename,
			    DOWNLOAD_TABLE_SCRIPT = '../scripts/postgis/download_table.sh';


			// create folder
			fs.ensureDir(folder, function (err) { 	// todo: refactor async

				var command = [
					DOWNLOAD_TABLE_SCRIPT,
					database_name,
					output,
					query
				].join(' ');

				console.log('dump to shp cmd: ', command);

				// create database in postgis
				exec(command, {maxBuffer: 1024 * 50000}, function (err, stdout) {
					console.log('err, stdout', err, stdout);

					if (err) return callback(err);

					var options = {
						zipfolder : folder,
						zipfile : folder + filename,
						returnOutput : returnOutput
					}
					
					callback(null, options);

				});
			});
		});


		ops.push(function (options, callback) {
			var zipfolder = options.zipfolder,
			    tarfile = options.zipfile + '.tar',
			    zipfile = tarfile + '.gz',
			    returnOutput = options.returnOutput + '.tar.gz';

			var cmd = [
				'tar',
				'cvf',
				tarfile,
				'-C',
				'"' + zipfolder + '"',
				'.',
				'&&',
				'pigz',
				tarfile
			].join(' ');

			console.log('tar cmd: ', cmd);

			exec(cmd, {maxBuffer: 1024 * 50000}, function (err, stdout) {
				console.log('err, stdout', err, stdout);

				if (err) return callback(err);
				callback(null, returnOutput);
			});
		});

		async.waterfall(ops, function (err, zipfile) {
			done(err, zipfile);
		});

	},

	
	createDatabase : function (options, done) {
		console.log('DCDBDB', options);

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

		console.log('comd', command);
		
		// create database in postgis
		exec(command, {maxBuffer: 1024 * 50000}, function (err) {
			if (err) return done(err);

			// save pg_db name to user
			User
			.findOne({uuid : userUuid})
			.exec(function (err, usr) {
				console.log('ERR???', err, usr);
				if (err || !usr) return done(err || 'no such user');
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
			console.log('esnure', err, user);
			if (err || !user) return done(err || 'No user.');

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

			// get which type of data
			var geotype = api.postgis._getGeotype(options);

			console.log('api.postgis.import(), geotype:', geotype);

			// send to appropriate api.postgis.import
			if (geotype == 'shapefile') 	return api.postgis.importShapefile(options, callback);
			if (geotype == 'geojson') 	return api.postgis.importGeojson(options, callback);
			if (geotype == 'raster') 	return api.postgis.importRaster(options, callback);

			// not type caught, err
			callback('Not a valid geotype. Must be Shapefile, GeoJSON or raster.');
		});

		async.waterfall(ops, done);

	},

	_getSrid : function (prj, done) {

		if (!prj) return done(null, false);

		fs.readFile(prj, function (err, prj4) {
			var srid = srs.parse(prj4);

			// if failed, ask boundlessgeo (fml)
			if (err || !srid.srid) return api.postgis._fetchSrid(prj4, done);

			done(err, srid.srid);
		});
	
	},

	_fetchSrid : function (prj, done) {

		var terms = encodeURIComponent(prj);
		// http://prj2epsg.org/apidocs.html
		var url = 'http://prj2epsg.org/search.json?mode=wkt&terms=' + terms;
		var options = {
			url: url,
			method: 'GET',
		}

		// Start the request
		request(options, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var srids = JSON.parse(body);
				var srid = srids.codes[0].code;
				done(null, srid);
			}
		});

	},


	importShapefile : function (options, done) {
		var files 	= options.files,
		    shape 	= api.geo.getTheShape(files)[0],
		    prjfile 	= api.geo.getTheProjection(files)[0],
		    file_id 	= options.file_id,
		    pg_db 	= options.user.postgis_database,
		    user_id 	= options.user_id,
		    uniqueIdentifier = options.uniqueIdentifier,
		    encoding 	= options.encoding || '',
		    ops 	= [];


		if (!prjfile) return done('Please provide a projection file.');

		// todo: put in config
		var IMPORT_SHAPEFILE_SCRIPT_PATH = '../scripts/postgis/import_shapefile.sh'; 
		
		// read projection
		ops.push(function (callback) {

			// get srid
			api.postgis._getSrid(prjfile, callback);
		});


		// import with bash script
		ops.push(function (srid, callback) {

			// set srid
			options.srid = srid;

			// import
			api.postgis._importShapefileToPostgis(options, function (err, result) {

				// next
				callback(err, result);
			});

		});

		// prime geometries in new table
		ops.push(function (success, callback) {

			// ping progress
			api.socket.processingProgress({
				user_id : user_id,
				progress : {
					text : 'Creating geometries...',
					error : null,
					percent : 40,
					uniqueIdentifier : uniqueIdentifier,
				}
			});

			// prime tables
			api.postgis._primeTableWithGeometries({
				file_id : file_id,
				postgis_db : pg_db,
			}, callback);
		});

		// get metadata
		ops.push(function (callback) {

			// ping progress
			api.socket.processingProgress({
				user_id : user_id,
				progress : {
					text : 'Getting metadata...',
					error : null,
					percent : 70,
					uniqueIdentifier : uniqueIdentifier,
				}
			});

			// get meta
			api.postgis._getMetadata({
				file_id : file_id,
				postgis_db : pg_db
			}, function (err, metadata) {
				if (err) return callback(err);

				var metadataJSON = JSON.stringify(metadata);

				// set upload status
				api.upload.updateStatus(file_id, {
					metadata : metadataJSON
				}, callback);
			})

		});

		
		// count rows for upload status
		ops.push(function (callback) {

			// ping progress
			api.socket.processingProgress({
				user_id : user_id,
				progress : {
					text : 'Almost done...',
					error : null,
					percent : 90,
					uniqueIdentifier : uniqueIdentifier,
				}
			});
			
			api.postgis.query({
				postgis_db : pg_db,
				query : 'SELECT count(*) from "' + file_id + '"'
			}, function (err, result) {
				if (err) return callback(err);
				
				// set upload status
				api.upload.updateStatus(file_id, {
					rows_count : result.rows[0].count
				}, callback);
			});
		});

		// run ops
		async.waterfall(ops, done);

	},


	_importShapefileToPostgis : function (options, done) {
		var files 	= options.files,
		    shape 	= api.geo.getTheShape(files)[0],
		    prjfile 	= api.geo.getTheProjection(files)[0],
		    file_id 	= options.file_id,
		    pg_db 	= options.user.postgis_database,
		    user_id 	= options.user_id,
		    uniqueIdentifier = options.uniqueIdentifier,
		    encoding 	= options.encoding || '',
		    ops 	= [],
		    attempts 	= 0,
		    srid 	= options.srid;

		var srid_converted = srid;
		var IMPORT_SHAPEFILE_SCRIPT_PATH = '../scripts/postgis/import_shapefile.sh'; 

		console.log('POSTGIS DATABASE:::::', pg_db);

		// create database script
		var cmd = [
			IMPORT_SHAPEFILE_SCRIPT_PATH, 	// script
			'"' + shape + '"',
			file_id,
			pg_db,
			srid_converted,
			encoding,
			// "> /dev/null 2>&1"
		].join(' ');


		console.log('import shaepfile cmd: ', cmd);

		// ping progress
		api.socket.processingProgress({
			user_id : user_id,
			progress : {
				text : 'Importing...',
				error : null,
				percent : 20,
				uniqueIdentifier : uniqueIdentifier,
			}
		});

		// import to postgis
		var startTime = new Date().getTime();

		exec(cmd, {maxBuffer: 1024 * 1024 * 50000}, function (err, stdout, stdin) {
			console.log('###############################');
			console.log('postgis shapefile import err', err);
			console.log('postgis shapefile import stdout', stdout);
			console.log('postgis shapefile import stdin', stdin);
			console.log('###############################');

			attempts++;

			// check of LATIN1 encoding errors
			if (stdin.indexOf('LATIN1') > -1 && attempts < 2) {

				console.log('LATIN!!');

				var endTime = new Date().getTime();

				// set error on status
				return api.upload.updateStatus(file_id, { 	// todo: set err if err
					data_type : 'vector',
					import_took_ms : endTime - startTime,
					table_name : file_id,
					database_name : pg_db,
					error : true,
					error_text : 'Encoding error. Try LATIN1.'
				}, function (err) {
					// callback(err, 'Shapefile imported successfully.');

					// safe guard, todo: catch more edge cases, make them work
					done('Encoding error, use utf8.');
				});


			}

			var endTime = new Date().getTime();

			// set import time to status
			api.upload.updateStatus(file_id, { 	// todo: set err if err
				data_type : 'vector',
				import_took_ms : endTime - startTime,
				table_name : file_id,
				database_name : pg_db
			}, function (err) {
				// callback(err, 'Shapefile imported successfully.');

				done(err, 'Shapefile imported successfully.');
			});
		});


	},


	importGeojson : function (options, done) {

		// need to convert to ESRI shapefile (ouch!) first..
		var geojsonPath = options.files[0],
		    geojsonBasename = api.postgis._getBasefile(geojsonPath),
		    shapefileFolder = '/data/tmp/' + api.utils.getRandom(5) + '/',
		    shapefileBasename = geojsonBasename + '.shp',
		    shapefilePath = shapefileFolder + shapefileBasename,
		    ops = [];

		console.log('importGeojson options: ', options);
		var file_id = options.file_id;

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
				api.upload.updateStatus(file_id, {
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

	

	// import raster into postgis
	importRaster : function (options, done) {
		var clientName 	= options.clientName;
		var raster 	= options.files[0];
		var user_id 	= options.user_id;
		var file_id 	= options.file_id;
		var pg_db 	= options.user.postgis_database;
		var uniqueIdentifier = options.uniqueIdentifier;
		var original_format = api.postgis._getRasterType(raster);
		var ops = {};

		// ping progress
		api.socket.processingProgress({
			user_id : user_id,
			progress : {
				text : 'Importing raster...',
				error : null,
				percent : 20,
				uniqueIdentifier : uniqueIdentifier,
			}
		});


		// import raster to postgis
		ops.import = function (callback) {

			// bash script
			var IMPORT_RASTER_SCRIPT_PATH = '../scripts/postgis/import_raster.sh'; // todo: put in config

			// create database script
			var cmd = [
				IMPORT_RASTER_SCRIPT_PATH,
				raster,
				file_id,
				pg_db
			].join(' ');

			// import to postgis
			var startTime = new Date().getTime();
			exec(cmd, {maxBuffer: 1024 * 50000}, function (err) {
				var endTime = new Date().getTime();

				// set err on upload status
				if (err) return api.upload.updateStatus(file_id, {
					error_code : 2,
					error_text : err
				}, function () {
					callback(err);
				});

				// update upload status
				api.upload.updateStatus(file_id, {
					data_type : 'raster',
					original_format : original_format,
					import_took_ms : endTime - startTime,
					table_name : file_id,
					database_name : pg_db
				}, function () {
					callback(null, 'Raster imported successfully.');
				});
			});
		} 


		// get metadata
		ops.metadata = function (callback) {

			// ping progress
			api.socket.processingProgress({
				user_id : user_id,
				progress : {
					text : 'Getting metadata...',
					error : null,
					percent : 50,
					uniqueIdentifier : uniqueIdentifier,
				}
			});

			// get meta
			api.postgis._getRasterMetadata({
				file_id : file_id,
				postgis_db : pg_db
			}, function (err, metadata) {
				if (err) return callback(err);

				var metadataJSON = api.utils.stringify(metadata);

				// set upload status
				api.upload.updateStatus(file_id, {
					metadata : metadataJSON
				}, callback);
			})
		};


		async.series(ops, done);

	},


	_getMetadata : function (options, done) {
		var file_id = options.file_id, 
		    postgis_db = options.postgis_db,
		    ops = [],
		    metadata = {};

		// get extent
		ops.push(function (callback) {

			var query = 'SELECT ST_Extent(the_geom_4326) FROM ' + file_id;

			api.postgis.query({
				postgis_db : postgis_db,
				query : query
			}, function (err, results) {
				if (err) return callback(err);
										// todo: get extent as geojson polygon
				// old skool
				var box = results.rows[0].st_extent;
				var m = box.split('(')[1];
				var m2 = m.split(')')[0];
				var c1 = m2.split(' ')[0];
				var c2 = m2.split(' ')[1].split(',')[0];
				var c3 = m2.split(',')[1].split(' ')[0];
				var c4 = m2.split(' ')[2];

				// set
				metadata.extent = [c1, c2, c3, c4];
				
				callback(null);
			});	
		});

		// get min/max of all fields
		ops.push(function (callback) {


			var query = 'SELECT * FROM ' + file_id + ' LIMIT 1';

			api.postgis.query({
				postgis_db : postgis_db,
				query : query
			}, function (err, results) {

				var rows = results.rows[0];
				var columns = [];
				var min_max_values = {};
				var jobs = [];

				for (var r in rows) {
					if (r != 'geom' && r != 'the_geom_3857' && r != 'the_geom_4326') {
						columns.push(r);
					}
				}

				columns.forEach(function (column) {

					min_max_values[column] = {
						min : 0,
						max : 0
					};

					jobs.push(function (done) {
						
						// get max values

						// do sql query on postgis
						var MAX_SCRIPT = '../scripts/postgis/get_max_of_column.sh'; 

						// st_extent script 
						var command = [
							MAX_SCRIPT, 	// script
							postgis_db, 	// database name
							file_id,	// table name
							column
						].join(' ');


						// create database in postgis
						exec(command, {maxBuffer: 1024 * 50000}, function (err, stdout, stdin) {
							if (err) return done(null);


							console.log('GETMETA -->', stdout);
							
							var json = stdout.split('\n')[2];
							var data = JSON.parse(json);
							
							min_max_values[column] = data;

							// callback
							done(null, data);
						});
					});	
				});


				async.parallel(jobs, function (err, values) {
					min_max_values._columns = columns;
					metadata.columns = min_max_values;

					callback(null);
				});
			});
		});

		// get total area
		ops.push(function (callback) {

			var GET_EXTENT_SCRIPT_PATH = '../scripts/postgis/get_st_extent_as_geojson.sh';

			// st_extent script 
			var command = [
				GET_EXTENT_SCRIPT_PATH, 	// script
				postgis_db, 	// database name
				file_id,	// table name
			].join(' ');


			// create database in postgis
			exec(command, {maxBuffer: 1024 * 50000}, function (err, stdout, stdin) {

				var json = stdout.split('\n')[2];
				var geojson = JSON.parse(json);
				var area = geojsonArea.geometry(geojson);

				metadata.extent_geojson = geojson;
				metadata.total_area = area; // square meters

				// callback
				callback(null);
			});

		});

		// get number of rows
		ops.push(function (callback) {

			var query = 'SELECT count(*) FROM ' + file_id;

			api.postgis.query({
				postgis_db : postgis_db,
				query : query
			}, function (err, results) {
				if (err) return callback();

				var json = results.rows[0];
				metadata.row_count = json.count;

				callback();
			});
		});


		// get size of table in bytes
		ops.push(function (callback) {

			var query = "SELECT pg_size_pretty(pg_table_size('" + file_id + "'));"
			
			api.postgis.query({
				postgis_db : postgis_db,
				query : query
			}, function (err, results) {
				if (err) return callback();

				var json = results.rows[0];
				metadata.size_bytes = json.pg_size_pretty;

				callback();
			});
		});

	
		// get geometry type
		ops.push(function (callback) {

			// do sql query on postgis
			var GET_GEOMETRY_TYPE_SCRIPT = '../scripts/postgis/get_geometry_type.sh';

			// st_extent script 
			var command = [
				GET_GEOMETRY_TYPE_SCRIPT, // script
				postgis_db, 	// database name
				file_id,	// table
			].join(' ');


			// do postgis script
			exec(command, {maxBuffer: 1024 * 50000}, function (err, stdout, stdin) {
				if (err) return callback(err);

				var arr = stdout.split('\n'),
				    result = [];

				arr.forEach(function (arrr) {
					try {
						var item = JSON.parse(arrr);
						result.push(item);
					} catch (e) {};
				});

				metadata.geometry_type = result[0].st_geometrytype;

				callback(null, result);

			});
		});

		async.series(ops, function (err, results) {
			done(err, metadata);
		});
	},


	_getRasterMetadata : function (options, done) {
		var file_id = options.file_id;
		var postgis_db = options.postgis_db;
		var ops = [];
		var metadata = {};

		// get total area
		ops.push(function (callback) {

			console.log('api.postgis._getRasterMetadata(), get_extent!');

			var GET_RASTER_EXTENT_SCRIPT_PATH = '../scripts/postgis/get_raster_st_extent_as_geojson.sh';

			// st_extent script 
			var command = [
				GET_RASTER_EXTENT_SCRIPT_PATH, 	// script
				postgis_db, 	// database name
				file_id,	// table name
			].join(' ');


			// create database in postgis
			exec(command, {maxBuffer: 1024 * 50000}, function (err, stdout, stdin) {

				var json = stdout.split('\n')[2];
				var geojson = JSON.parse(json);
				var area = geojsonArea.geometry(geojson);

				metadata.extent_geojson = geojson;
				metadata.total_area = area; // square meters
				
				// set geom type (only for vector, so raster is false)
				metadata.geometry_type = false;


				console.log('METADATA ', metadata);

				// callback
				callback(null);
			});

		});

		// get size of table in bytes
		ops.push(function (callback) {

			var query = "SELECT pg_size_pretty(pg_table_size('" + file_id + "'));"
			
			api.postgis.query({
				postgis_db : postgis_db,
				query : query
			}, function (err, results) {
				if (err) return callback();

				var json = results.rows[0];
				metadata.size_bytes = json.pg_size_pretty;

				callback();
			});
		});

	

		async.series(ops, function (err, results) {
			done(err, metadata);
		});
	},

	fetchHistogram : function (options, done) {

		var table_name = options.table_name,
		    database_name = options.database_name,
		    num_buckets = options.num_buckets || 50, // todo: move to config
		    column = options.column,
		    ops = [];


		ops.push(function (callback) {

			// do sql query on postgis
			var GET_HISTOGRAM_SCRIPT = '../scripts/postgis/get_histogram.sh';

			// st_extent script 
			var command = [
				GET_HISTOGRAM_SCRIPT, 	// script
				database_name, 	// database name
				table_name,
				column,
				num_buckets
			].join(' ');


			// do postgis script
			exec(command, {maxBuffer: 1024 * 50000}, function (err, stdout, stdin) {
				if (err) return callback(err);

				var arr = stdout.split('\n'),
				    result = [];

				arr.forEach(function (arrr) {
					try {
						var item = JSON.parse(arrr);
						result.push(item);
					} catch (e) {};
				});

				callback(null, result);

			});
		});

		async.waterfall(ops, done);

	},


	_primeTableWithGeometries : function (options, done) {

		var file_id = options.file_id,
		    postgis_db = options.postgis_db,
		    ops = [];

		// get geometry type
		ops.push(function (callback) {
			api.postgis.query({
				postgis_db : postgis_db,
				query : 'SELECT ST_GeometryType(geom) from "' + file_id + '" limit 1'
			}, function (err, results) {
				if (err) return callback(err);
				console.log('results', results);
				if (!results || !results.rows || !results.rows.length) return callback('The dataset contains no valid geodata.');
				var geometry_type = results.rows[0].st_geometrytype.split('ST_')[1];
				callback(null, geometry_type);
			})
		});

		// create geometry 3857
		ops.push(function (geometry_type, callback) {
			var column = ' the_geom_3857';
			var geometry = ' geometry(' + geometry_type + ', 3857)';
			var query = 'ALTER TABLE ' + file_id + ' ADD COLUMN' + column + geometry;

			api.postgis.query({
				postgis_db : postgis_db,
				query : query
			}, function (err, results) {
				if (err) return callback(err);
				callback(null, geometry_type);
			});
		});

		// create geometry 4326
		ops.push(function (geometry_type, callback) {
			var column = ' the_geom_4326';
			var geometry = ' geometry(' + geometry_type + ', 4326)';
			var query = 'ALTER TABLE ' + file_id + ' ADD COLUMN' + column + geometry;

			api.postgis.query({
				postgis_db : postgis_db,
				query : query
			}, function (err, results) {
				if (err) return callback(err);
				callback(err, geometry_type);
			});
		});


		// populate geometry
		ops.push(function (geometry_type, callback) {
			var query = 'ALTER TABLE ' + file_id + ' ALTER COLUMN the_geom_3857 TYPE Geometry(' + geometry_type + ', 3857) USING ST_Transform(geom, 3857)'

   			api.postgis.query({
				postgis_db : postgis_db,
				query : query
			}, function (err, results) {
				if (err) return callback(err);
				callback(err, geometry_type);
			});
		});

		// populate geometry
		ops.push(function (geometry_type, callback) {
			var query = 'ALTER TABLE ' + file_id + ' ALTER COLUMN the_geom_4326 TYPE Geometry(' + geometry_type + ', 4326) USING ST_Transform(geom, 4326)'

   			api.postgis.query({
				postgis_db : postgis_db,
				query : query
			}, function (err, results) {
				if (err) return callback(err);
				callback(err);
			});
		});


		// create index for 3857
		ops.push(function (callback) {
			var idx = file_id + '_the_geom_4326_idx';
			var query = 'CREATE INDEX ' + idx + ' ON ' + file_id + ' USING GIST(the_geom_4326)'

			api.postgis.query({
				postgis_db : postgis_db,
				query : query
			}, function (err, results) {
				if (err) return callback(err);
				callback(null);
			});
		});

		// create index for 4326
		ops.push(function (callback) {
			var idx = file_id + '_the_geom_3857_idx';
			var query = 'CREATE INDEX ' + idx + ' ON ' + file_id + ' USING GIST(the_geom_3857)'

			api.postgis.query({
				postgis_db : postgis_db,
				query : query
			}, function (err, results) {
				if (err) return callback(err);
				callback(null, 'ok');
			});
		});


		async.waterfall(ops, function (err, results) {
			console.log('priming waterfall', err, results);

			var errMsg = err && err.message ? err.message : null;

			console.log('errMs', errMsg);
			done(errMsg);
		});

	},


	query : function (options, callback) {
		var postgis_db = options.postgis_db,
		    variables = options.variables,
		    query = options.query;

		// count rows and add to uploadStatus
		var conString = 'postgres://systemapic:docker@postgis/' + postgis_db; // todo: put in config
		pg.connect(conString, function(err, client, pgcb) {
			if (err) return callback(err);
			
			// do query
			client.query(query, variables, function(err, result) {
				// clean up after pg
				pgcb();
				// client.end();

				if (err) return callback(err); 
				
				// return result
				callback(null, result);
			});
		});
	},


	_getGeotype : function (options) {
		var files = options.files,
		    type = false;

		    if (!files) return 'false';

		if (files.data) {
			var filename = files.data.originalFilename;
			var ext = filename.split('.').reverse()[0];
			if (ext == 'geojson') return 'geojson';
			if (ext == 'ecw') return 'raster';
			if (ext == 'jp2') return 'raster';
			if (ext == 'tif') return 'raster';
			if (ext == 'tiff') return 'raster';
			return false;
		}

		// only one file
		if (files.length == 1) {
			var ext = files[0].split('.').reverse()[0];
			if (ext == 'geojson') return 'geojson';
			if (ext == 'ecw') return 'raster';
			if (ext == 'jp2') return 'raster';
			if (ext == 'tif') return 'raster';
			if (ext == 'tiff') return 'raster';
		}

		console.log('files: ', files);

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