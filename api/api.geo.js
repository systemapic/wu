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
var gdal 	= require('gdal');
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
var pg = require('pg');
var exec = require('child_process').exec;

// api
var api = module.parent.exports;

// exports
module.exports = api.geo = { 



	json2cartocss : function (req, res) {
		var options = req.body;

		console.log('options', options);

		// convert json to cartocss
		api.geo._json2cartocss(options, function (err, css) {

			console.log('json2css done! ', err, css);

			res.end(css);
		});
	},


	_json2cartocss : function (options, callback) {

		var styleJSON = options.styleJSON;

		console.log('api.geo._json2cartocss -> styleJSON : ', styleJSON);


		// json in, cartocss out


		// this is where the magic happens








		// return cartocss
		callback(null, cartocss);

	},







































































	copyToVileFolder : function (path, fileUuid, callback) {
		if (!path || !fileUuid) return callback('Missing information.14');

		var dest = api.config.path.geojson + fileUuid + '.geojson';
		fs.copy(path, dest, function(err) {
			if (err) console.log('copy err!'.red + err);
			callback(err);
		});
	},

	copyToVileRasterFolder : function (path, fileUuid, callback) {
		if (!path || !fileUuid) return callback('Missing information.14');

		var dest = api.config.path.file + fileUuid;
		// console.log('copyToVileRasterFolder!!! 1, from , to', path, dest);

		// do nothing if already there
		if (path == dest) return callback(null);

		// console.log('copyToVileRasterFolder!!! 2');
		fs.copy(path, dest, function(err) {
			if (err) console.log('copy err!'.red, err);
			callback(null);
		});
	},

	handleGeoJSON : function (path, fileUuid, callback) {
		if (!path || !fileUuid) return callback('Missing information.15');

		api.geo.copyToVileFolder(path, fileUuid, function (err) {
			if (err) return callback('copyvile hg err: ' + err);

			try {

				fs.readFile(path, function (err, data) {

					// mapnikOmnivore.digest(path, function (err, metadata) {
					api.geo._readMetaData(path, function (err, metadata) {
						if (err) return callback(err);
		        			if (!metadata) return callback('No metadata!');
		        			
			        		var db = { metadata : metadata }

				        	// return
				        	callback(null, db);
					})
		        	});
			
			} catch (e) { callback('omni crash gj: ' + e); }
		});
	},

	_readMetaData : function (path, callback) {
		return api.geo._readMetaDataNode(path, callback);
	},

	_readMetaDataNode : function (path, callback) {

		try {

		mapnikOmnivore.digest(path, function(err, metadata) {
			if (err) {
				console.log('digest.err!'.red, err, path);
				return callback(err);
			}
			return callback(null, JSON.stringify(metadata, null, 2));
		});

		} catch (e) {
			console.log('omni crash'.red, e, path);
			return callback(e);
		}
	},

	handleTopoJSON : function (path, fileUuid, callback) { 			// TODO!
		callback('Topojson unsupported.');
	},


	import2postgis : function (options, callback) {

		return api.postgis.importData(options, callback);
		
		
		
	},

	validateshp : function (files, callback) {

		// shape extensions
		var mandatory 	= ['.shp', '.shx', '.dbf'];

		files.forEach(function (f) {
			var ext = f.slice(-4);
			_.pull(mandatory, ext);
		});

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
			var shape_part = shapes[s];
			if (shape_part && shape_part.slice(-4) == '.shp') {

				console.log('shape_part: ', shape_part);

				var basename = nodepath.basename(shape_part);

				console.log('basnemae: ', basename);

				if (basename.slice(0,1) != '.') {
					shps.push(shape_part);
				}
			}
		}
		return shps;
	},

	getTheProjection : function (shapes) {
		// get .prj file
		var shps = [];
		for (s in shapes) {

			var shape_part = shapes[s];
			if (shape_part && shape_part.slice(-4) == '.prj') {

				console.log('shape_part: ', shape_part);

				var basename = nodepath.basename(shape_part);

				console.log('basnemae: ', basename);

				if (basename.slice(0,1) != '.') {
					shps.push(shape_part);
				}
			}
		}
		return shps;
	},

	moveShapefiles : function (options, done) {
		var ops = [];
		var possible = ['.shp', '.shx', '.dbf', '.prj', '.sbn', '.sbx', '.fbn', '.fbx', '.ain', '.aih', '.ixs', '.mxs', '.atx', '.shp.xml', '.cpg'];
		possible.forEach(function (ex) {
			var p = options.folder + '/' + options.base + ex;
			var f = options.outfolder + '/' + options.base + ex;
			
			ops.push(function (callback) {
				fs.existsSync(p) ? fs.move(p, f, callback) : callback();
			});
		});

		async.parallel(ops, function (err) {
			if (err) console.log('moveShapefiles err: '.red + err)
			done(err);
		});

	},

	convertshp : function (shapes, folder, callback) {

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
			if (err) {
				console.log('geomove err: '.red + err);
				return callback(err);
			}

			// make sure folder exists
			fs.ensureDirSync(outfolder);					// todo: async!

			// read projection file if exists
			var projection = fs.existsSync(proj) ? fs.readFileSync(proj) : false; 	// todo: async!

			// set projection if any
			try { var proj4 = projection ? srs.parse(projection).proj4 : false; } 
			catch (e) { var proj4 = false; }

			// use ogr2ogr
			api.geo._ogr2ogrFallback(folder, outfolder, toFile, outFile, inFile, fileUuid, proj4, callback);
		});
	},



	_ogr2ogrFallback : function (folder, outfolder, toFile, outFile, inFile, fileUuid, proj4, callback) {

		// make sure dir exists
		fs.ensureDirSync(outfolder); // todo: async!

		// ogr2ogr shapefile to geojson
		var cmd = '/usr/local/bin/ogr2ogr -f geoJSON "' + outFile + '" "' + inFile + '"';

		if (proj4) cmd += ' -s_srs "' + proj4 + '" -t_srs "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs"';

		var exec = require('child_process').exec;
		exec(cmd, function (err, stdout, stdin) {
			// console.log('did cmn'.yellow);
			
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


	handleRaster : function (options, done) {

		var fileUuid = options.fileUuid,
		    inFile = options.path,
		    outFolder = '/data/raster_tiles/' + fileUuid + '/raster/',
		    ops = [];


		ops.push(function (callback) {
			var out = api.config.path.file + fileUuid + '/' + options.name;
			var inn = inFile;
			// console.log('COPYYY inn, out', inn, out);

			// dont copy if already there
			if (inn == out) return callback(null);

			fs.copy(inn, out, function (err) {
				callback(err);
			});
		})

		// validation
		ops.push(function (callback) {

			var dataset = gdal.open(inFile);

			if (!dataset) return callback('Invalid dataset.');
			if (!dataset.srs) return callback('Invalid projection.');
			if (!dataset.srs.validate) return callback('Invalid projection.');

			// check if valid projection
			var invalid = dataset.srs.validate();

			// valid
			if (!invalid) return callback(null, dataset);
			
			// invalid
			var msg = 'Invalid projection: ' + dataset.srs.toWKT();
			// console.log('msg: ', msg);
			callback(msg); // err
		});


		// get file size
		ops.push(function (dataset, callback) {
			fs.stat(options.path, function (err, stats) {
				options.fileSize = stats.size;
				callback(null, dataset);
			});
		});


		// get meta 
		ops.push(function (dataset, callback) {
			
			// get projection
			var s_srs = dataset.srs ? dataset.srs.toProj4() : 'null';

			// get extent
			var extent = api.geo._getRasterExtent(dataset);

			var meta = {
				projection : s_srs,
				geotransform : dataset.geoTransform,
				bands : dataset.bands.count(),
				extent : extent.extent,
				center : extent.center,
				minzoom : 0,
				maxzoom : 18,
				filetype : options.extension,
				filesize : options.fileSize, // bytes
				filename : options.name,
				size : {
					x : dataset.rasterSize.x,
					y : dataset.rasterSize.y
				},
			}

			// "{
			//   "filesize": 184509,
			//   "projection": "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs",
			//   "filename": "sydney",
			//   "center": [
			//     150.441711504,
			//     -33.52856723049999
			//   ],
			//   "extent": [
			//     149.39475100800001, 	// left
			//     -34.30833595899998, 	// bottom
			//     151.488672, 		// right 
			//     -32.748798502		// top
			//   ],
			//   "json": {
			//     "vector_layers": [
			//       {
			//         "id": "subunitsExMS",
			//         "description": "",
			//         "minzoom": 0,
			//         "maxzoom": 22,
			//         "fields": {
			//           "id": "String",
			//           "name": "String"
			//         }
			//       }
			//     ]
			//   },
			//   "minzoom": 0,
			//   "maxzoom": 12,
			//   "layers": [
			//     "subunitsExMS"
			//   ],
			//   "dstype": "ogr",
			//   "filetype": ".geojson"
			// }"
			
			callback(null, meta);
		});


		// reproject if necessary
		ops.push(function (meta, callback) {

			var proj4 = meta.projection;
			var ourProj4 = '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs ';
			var source = gdal.SpatialReference.fromProj4(proj4);
			var target = gdal.SpatialReference.fromProj4(ourProj4);
			var isSame = source.isSame(target);

			// console.log('priojection: ', proj4);
			// console.log('spurce:', source);
			// console.log('target: ', target);

			// debug
			return callback(null, meta);

			// same, no reprojection necessary
			if (isSame) return callback(null, meta);

			var outFile = inFile + '.reprojected';
			var cmd = 'gdalwarp -srcnodata 0 -dstnodata 0 -t_srs "' + ourProj4 + '" "' + inFile + '" "' + outFile + '"';
			// console.log('gdalwarp cmd: ', cmd);

			var exec = require('child_process').exec;
			exec(cmd, function (err, stdout, stdin) {
				if (err) return callback(err);

				options.path = outFile;
				callback(null, meta);
			});

		});

		ops.push(function (meta, callback) {
			
			// var cmd = api.config.path.tools + 'gdal2tiles_parallel.py --processes=6 -w none -p mercator --no-kml "' + options.path + '" "' + outFolder + '"';
			// // var cmd = api.config.path.tools + 'pp2gdal2tiles.py --processes=1 -w none -p mercator --no-kml "' + options.path + '" "' + outFolder + '"';
			// console.log('cmd: ', cmd);

			// var exec = require('child_process').exec;
			// exec(cmd, { maxBuffer: 2000 * 1024 }, function (err, stdout, stdin) {
			// 	console.log('ppgdal2tiles:'.green, stdout);
			// 	if (err) {
			// 		console.log('gdal2tiles err: '.red + err);
					
			// 		api.error.log(err);
			// 		var errMsg = 'There was an error generating tiles for this raster image. Please check #error-log for more information.'
			// 		return callback(errMsg);
			// 	}

			// 	// return as db entry
			// 	var db = {
			// 		data : {
			// 			raster : options.name
			// 		},
			// 		title : options.name,
			// 		file : fileUuid,
			// 		metadata : JSON.stringify(meta)
			// 	}

			// 	console.log('db created'.yellow, db);
			// 	callback(null, db);
			// });

				// var key = results[1];
				// if (!key) return callback('No key.');

				// var path = key.path;
				// var name = key.name;
				// var fileUuid = key.fileUuid;

				// // add geojson file to list
				// shapefiles.push(name);

				// return as db entry
				// var db = {
				// 	files : shapefiles,
				// 	data : {
				// 		geojson : name
				// 	},
				// 	title : name,
				// 	file : fileUuid
				// }

				// return as db entry
				var db = {
					data : {
						raster : options.name
					},
					title : options.name,
					file : fileUuid,
					metadata : JSON.stringify(meta)
				}
				api.geo.copyToVileRasterFolder(options.path, fileUuid, function (err) {
					if (err) return callback('copytToVile err: ' + err);

					callback(null, db);
				});
		});

		async.waterfall(ops, done);
	},


	// handleJPEG2000 : function (options, done) {
	// 	return api.geo.handleRaster(options, done);


	// },

	// handleRaster : function (options, done) {

	// 	var fileUuid = options.fileUuid,
	// 	    inFile = options.path,
	// 	    outFolder = '/data/raster_tiles/' + fileUuid + '/raster/',
	// 	    ops = [];


	// 	// console.log('GDAL VERSION'.red, gdal.version);
	// 	// console.log('GDAL DRIVERS'.red, gdal.drivers.getNames());
	// 	console.log('options.'.green, options);

	// 	// async.parallel([function (callback) {
	// 	// 	var out = api.config.path.file + fileUuid + '/' + options.name;
	// 	// 	var inn = inFile;
	// 	// 	console.log('inn, out', inn, out);

	// 	// 	fs.copy(inn, out, callback)
	// 	// }], console.log)

	// 	ops.push(function (callback) {
	// 		var out = api.config.path.file + fileUuid + '/' + options.name;
	// 		var inn = inFile;
	// 		console.log('COPYYY inn, out', inn, out);

	// 		if (inn == out) return callback(null);

	// 		fs.copy(inn, out, function (err) {
	// 			callback(err);
	// 		});
	// 	})

	// 	// validation
	// 	ops.push(function (callback) {

	// 		var dataset = gdal.open(inFile);

	// 		if (!dataset) return callback('Invalid dataset.');
	// 		if (!dataset.srs) return callback('Invalid projection.');
	// 		if (!dataset.srs.validate) return callback('Invalid projection.');

	// 		// check if valid projection
	// 		var invalid = dataset.srs.validate();

	// 		// valid
	// 		if (!invalid) return callback(null, dataset);
			
	// 		// invalid
	// 		var msg = 'Invalid projection: ' + dataset.srs.toWKT();
	// 		console.log('msg: ', msg);
	// 		callback(msg); // err
	// 	});


	// 	// get file size
	// 	ops.push(function (dataset, callback) {
	// 		fs.stat(options.path, function (err, stats) {
	// 			options.fileSize = stats.size;
	// 			callback(null, dataset);
	// 		});
	// 	});


	// 	// get meta 
	// 	ops.push(function (dataset, callback) {
			
	// 		// get projection
	// 		var s_srs = dataset.srs ? dataset.srs.toProj4() : 'null';

	// 		// get extent
	// 		var extent = api.geo._getRasterExtent(dataset);

	// 		var meta = {
	// 			projection : s_srs,
	// 			geotransform : dataset.geoTransform,
	// 			bands : dataset.bands.count(),
	// 			extent : extent.extent,
	// 			center : extent.center,
	// 			minzoom : 0,
	// 			maxzoom : 18,
	// 			filetype : options.extension,
	// 			filesize : options.fileSize, // bytes
	// 			filename : options.name,
	// 			size : {
	// 				x : dataset.rasterSize.x,
	// 				y : dataset.rasterSize.y
	// 			},
	// 		}

	// 		// "{
	// 		//   "filesize": 184509,
	// 		//   "projection": "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs",
	// 		//   "filename": "sydney",
	// 		//   "center": [
	// 		//     150.441711504,
	// 		//     -33.52856723049999
	// 		//   ],
	// 		//   "extent": [
	// 		//     149.39475100800001, 	// left
	// 		//     -34.30833595899998, 	// bottom
	// 		//     151.488672, 		// right 
	// 		//     -32.748798502		// top
	// 		//   ],
	// 		//   "json": {
	// 		//     "vector_layers": [
	// 		//       {
	// 		//         "id": "subunitsExMS",
	// 		//         "description": "",
	// 		//         "minzoom": 0,
	// 		//         "maxzoom": 22,
	// 		//         "fields": {
	// 		//           "id": "String",
	// 		//           "name": "String"
	// 		//         }
	// 		//       }
	// 		//     ]
	// 		//   },
	// 		//   "minzoom": 0,
	// 		//   "maxzoom": 12,
	// 		//   "layers": [
	// 		//     "subunitsExMS"
	// 		//   ],
	// 		//   "dstype": "ogr",
	// 		//   "filetype": ".geojson"
	// 		// }"
			
	// 		callback(null, meta);
	// 	});


	// 	// reproject if necessary
	// 	ops.push(function (meta, callback) {

	// 		var proj4 = meta.projection;
	// 		var ourProj4 = '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs ';
	// 		var source = gdal.SpatialReference.fromProj4(proj4);
	// 		var target = gdal.SpatialReference.fromProj4(ourProj4);
	// 		var isSame = source.isSame(target);

	// 		// same, no reprojection necessary
	// 		if (isSame) return callback(null, meta);

	// 		var outFile = inFile + '.reprojected';
	// 		var cmd = 'gdalwarp -srcnodata 0 -dstnodata 0 -t_srs "' + ourProj4 + '" "' + inFile + '" "' + outFile + '"';
	// 		console.log('gdalwarp cmd: ', cmd);

	// 		var exec = require('child_process').exec;
	// 		exec(cmd, function (err, stdout, stdin) {
	// 			if (err) return callback(err);

	// 			options.path = outFile;
	// 			callback(null, meta);
	// 		});

	// 	});

	// 	ops.push(function (meta, callback) {
			
	// 		var cmd = api.config.path.tools + 'gdal2tiles_parallel.py --processes=6 -w none -p mercator --no-kml "' + options.path + '" "' + outFolder + '"';
	// 		// var cmd = api.config.path.tools + 'pp2gdal2tiles.py --processes=1 -w none -p mercator --no-kml "' + options.path + '" "' + outFolder + '"';
	// 		console.log('cmd: ', cmd);

	// 		var exec = require('child_process').exec;
	// 		exec(cmd, { maxBuffer: 2000 * 1024 }, function (err, stdout, stdin) {
	// 			console.log('ppgdal2tiles:'.green, stdout);
	// 			if (err) {
	// 				console.log('gdal2tiles err: '.red + err);
					
	// 				api.error.log(err);
	// 				var errMsg = 'There was an error generating tiles for this raster image. Please check #error-log for more information.'
	// 				return callback(errMsg);
	// 			}

	// 			// return as db entry
	// 			var db = {
	// 				data : {
	// 					raster : options.name
	// 				},
	// 				title : options.name,
	// 				file : fileUuid,
	// 				metadata : JSON.stringify(meta)
	// 			}

	// 			console.log('db created'.yellow, db);
	// 			callback(null, db);
	// 		});
	// 	});

	// 	async.waterfall(ops, done);
	// },


	_getRasterExtent : function (dataset) {
		
		var size = dataset.rasterSize;
		var geotransform = dataset.geoTransform;

		var corners = {
			'top' 		: {x: 0, y: 0},
			'right' 	: {x: size.x, y: 0},
			'bottom'	: {x: size.x, y: size.y},
			'left' 		: {x: 0, y: size.y},
			'center' 	: {x: size.x/2, y: size.y/2}
		};

		var extent = {};
		var wgs84 = gdal.SpatialReference.fromEPSG(4326);
		var coord_transform = new gdal.CoordinateTransformation(dataset.srs, wgs84);
		var corner_names = Object.keys(corners);
		
		corner_names.forEach(function(corner_name) {
			var corner = corners[corner_name];
			var pt_orig = {
				x: geotransform[0] + corner.x * geotransform[1] + corner.y * geotransform[2],
				y: geotransform[3] + corner.x * geotransform[4] + corner.y * geotransform[5]
			}
			var pt_wgs84 = coord_transform.transformPoint(pt_orig);
			extent[corner_name] = pt_wgs84;
		});
		
		var realExtent = {
			top : extent.top.y,
			left : extent.left.x,
			bottom : extent.bottom.y,
			right : extent.right.x
		};

		// return object
		var metadataExtent = {
			extent : [
				realExtent.left,
				realExtent.bottom,
				realExtent.right,
				realExtent.top,
			],
			center : [
				extent.center.x,
				extent.center.y
			]
		}
		
		// console.log('metadataExtent', metadataExtent);

		return metadataExtent;
	},









}