// API: api.geo.js

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
var ogr2ogr 	= require('ogr2ogr');
var nodepath    = require('path');
var formidable  = require('formidable');
var nodemailer  = require('nodemailer');
var uploadProgress = require('node-upload-progress');
var mapnikOmnivore = require('mapnik-omnivore');

// api
var api = module.parent.exports;

// exports
module.exports = api.geo = { 


	copyToVileFolder : function (path, fileUuid, callback) {
		if (!path || !fileUuid) return callback('Missing information.14');

		var dest = api.config.path.geojson + fileUuid + '.geojson';
		fs.copy(path, dest, function(err) {
			if (err) console.log('copy err!'.red + err);
			callback(err);
		});
	},

	handleGeoJSON : function (path, fileUuid, callback) {
		if (!path || !fileUuid) return callback('Missing information.15');


		api.geo.copyToVileFolder(path, fileUuid, function (err) {
			if (err) return callback('copyvile hg err: ' + err);

			try {

				// console.log('omni path: '.yellow, path);

				fs.readFile(path, function (err, data) {
					// console.log('data length: '.yellow, data.length);

					console.time('omnivore');
					// mapnikOmnivore.digest(path, function (err, metadata) {
					api.geo._readMetaData(path, function (err, metadata) {

					console.timeEnd('omnivore');

					// console.log('typeof metadata', typeof(metadata));

		        			if (err || !metadata) return callback('No metadata. gj' + err);
		        			
			        		var db = {
				        		// metadata : JSON.stringify(metadata)
				        		metadata : metadata
				        	}

				        	// return
				        	callback(null, db);
					})
			        	// });

		        	});
			
			} catch (e) {
				callback('omni crash gj: ' + e);
			}

		});

        	
	},

	_readMetaData : function (path, callback) {

		// console.log('_readMetaData'.yellow, path);

		var cmd = 'digest ' + path;

		console.log('cmd: ', cmd);

		var exec = require('child_process').exec;

		exec(cmd, function (err, stdout, stdin) {
			console.log('err, stdout, stdin', err, stdout, stdin);
			var metadata = stdout.replace(/(\r\n|\n|\r)/gm,"");
			callback(err, metadata);
		});

	},


	handleTopoJSON : function (path, fileUuid, callback) { 			// TODO!
		// convert to geojson
		// console.log('TODO:::: handleTopoJSON', path, fileUuid);

		callback('Topojson unsupported.');
	},




	handleShapefile : function (folder, name, fileUuid, callback) {  // folder = folder with shapefiles inside
		// console.log('handleShapefile...');

		if (!folder || !name || !fileUuid) return callback('Missing info.');

		fs.readdir(folder, function (err, files) {
			if (err || !files) return callback('Some files were rejected. Please upload <br>only one shapefile per zip.');

			// clone array
			var shapefiles = files.slice();

			// async ops
			var ops = [];

			// console.log('_______#_#_#_#_#__'.cyan, 'READISHIT!!');

			// check if valid shapefile(s)
			ops.push(function (done) {
				api.geo.validateshp(files, done);
			});

			// convert shapefile to geo/topojson
			ops.push(function (done) {
				api.geo.convertshp(files, folder, done);
			});

			// run async jobs
			async.series(ops, function (err, results) {
				if (err) console.log('MOFO!!'.red, err);
				if (err) return callback(err);

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

				api.geo.copyToVileFolder(path, fileUuid, function (err) {
					if (err) console.log('ADSDALSKMDSALDSAMDSAL'.red);

					if (err) return callback('copytToVile err: ' + err);

					try {
						// read meta from file
				        	mapnikOmnivore.digest(path, function (err, metadata) {
				        		if (err || !metadata) return callback('No metadata: ' + err);

				        		console.log('got meta?', err, metadata);
				        		db.metadata = JSON.stringify(metadata);
					        	
					        	// return
					        	callback(null, db);
				        	});

				        } catch (e) {
				        	callback('meta fail: ' + e);
				        }
		        	});
			});
		});
	},



	validateshp : function (files, callback) {

		// shape extensions
		var mandatory 	= ['.shp', '.shx', '.dbf'];

		files.forEach(function (f) {
			var ext = f.slice(-4);
			_.pull(mandatory, ext);
		})

		// if not all accounted for, return error
		if (mandatory.length > 0) {
			var message = 'Missing shapefile(s): ' + mandatory.join(' ');
			return callback({message : message});
		}
		// return
		callback(null);

	},

	getTheShape : function (shapes) {
		// get .shp file
		var shps = [];
		for (s in shapes) {
			if (shapes[s] && shapes[s].slice(-4) == '.shp') {
				shps.push(shapes[s]);
			}
		}
		return shps;
	},

	moveShapefiles : function (options, done) {
		var ops = [];

		// move relevant shapefiles to a fresh folder
		// ie. all files with same name as part of possible shapefile extension types
		var possible = ['.shp', '.shx', '.dbf', '.prj', '.sbn', '.sbx', '.fbn', '.fbx', '.ain', '.aih', '.ixs', '.mxs', '.atx', '.shp.xml', '.cpg'];

		possible.forEach(function (ex) {

			// console.log('foreach possigle'.magenta, ex);

			var p = options.folder + '/' + options.base + ex;
			var f = options.outfolder + '/' + options.base + ex;
			
			ops.push(function (callback) {

				if (fs.existsSync(p)) {
					fs.move(p, f, callback);
				} else {
					callback();
				}
			});
			

		});

		async.parallel(ops, function (err) {
			if (err) console.log('moveShapefiles err: '.red + err)
			done(err);
		});


	},

	convertshp : function (shapes, folder, callback) {
		
		// console.log('########### CONVERT SHAPE'.cyan);

		// get the .shp file
		var shps = api.geo.getTheShape(shapes);
		
		// return err if no .shp found
		if (!shps) return callback('No shapefile?');

		// vars
		var shp = shps[0];
		var base = shp.slice(0,-4);
		var fileUuid = 'file-' + uuid.v4();
		var toFile = shp + '.geojson';
		var outfolder = api.config.path.file + fileUuid;
		var outFile = outfolder + '/' + toFile;
		var inFile = outfolder + '/' + shp;
		var zipFile = outfolder + '/' + base + '.zip';
		var proj = outfolder + '/' + base + '.prj';

		// options		
		var options = {
			folder : folder,
			outfolder : outfolder,
			base : base
		}
						// callback
		api.geo.moveShapefiles(options, function (err) {
			// console.log('made it here!!'.cyan)
			if (err) console.log('geomove err: '.red + err);

			if (err) return callback(err);

			// console.log('made it here 22!!'.cyan)

			// make sure folder exists
			fs.ensureDirSync(outfolder);					// todo: async!

			// make sure projection file exists
			var exists = fs.existsSync(proj); 				// todo: async!

			// read projection file if exists
			var projection = exists ? fs.readFileSync(proj) : false; 	// todo: async!
			
			// set projection if any
			var proj4 = projection ? srs.parse(projection).proj4 : false;

			// create ogr object
			var myfile = ogr2ogr(inFile);

			// set output format
			myfile.format('geojson');

			// reproject
			if (proj4)  myfile.project('+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs ', proj4);
			if (!proj4) myfile.project('+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs ');
			
			// exec ogr2ogr
			myfile.exec(function (err, data) {
				// do fallback on error
				if (err) console.log('ogr2ogr11 err: '.red + err);
				if (err) return api.geo._ogr2ogrFallback(folder, outfolder, toFile, outFile, inFile, fileUuid, callback);

				// write file 
				fs.outputFile(outFile, JSON.stringify(data), function (err) {
					if (err) console.log('geo write err: '.red + err);
					if (err) return callback(err);

					// move folder with shapefile to new fileUuid folder
					fs.move(folder, outfolder + '/Shapefiles', function (err) {
						if (err) console.log('geomove2 err: '.red + err);
						if (err) return callback(err);
						
						// callback
						callback(null, {path : outFile, name : toFile, fileUuid : fileUuid});
					});
				});
			});
		});
	},



	_ogr2ogrFallback : function (folder, outfolder, toFile, outFile, inFile, fileUuid, callback) {

		// make sure dir exists
		fs.ensureDirSync(outfolder); // todo: async!

		// ogr2ogr shapefile to geojson
		var cmd = 'ogr2ogr -f geoJSON "' + outFile + '" "' + inFile + '"';

		// console.log('ogr2ogr cmd: '.red, cmd);

		var exec = require('child_process').exec;

		exec(cmd, function (err, stdout, stdin) {
			if (err) console.log('ogre fb err: '.red + err);
			if (err) return callback(err);

			// move folder with shapefile to new fileUuid folder
			fs.move(folder, outfolder + '/Shapefiles', function (err) {
				if (err) console.log('ogre mvoe err: '.red + err);
				if (err) return callback(err);

				// callback
				callback(null, {path : outFile, name : toFile, fileUuid : fileUuid});
			});
		});
	},
}