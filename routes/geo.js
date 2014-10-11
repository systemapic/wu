var fs = require('fs-extra');
var async = require('async');
var util = require('util');
var uuid = require('node-uuid');
var dive = require('dive');
var fspath = require('path');
var _ = require('lodash-node');
var tj = require('togeojson');	// kml to geojson
var jsdom = require('jsdom').jsdom;

// models
var File = require('../models/file');
var Layer = require('../models/layer');
var Project = require('../models/project');

// image cruncher
var crunch = require('../routes/crunch');


// global paths
var FILEFOLDER = '/var/www/data/files/';


module.exports = geo = { 

	
	processShapefile : function (entry, callback) {

		var ops = [];
		ops.push(function (cb) {
			// check if valid shapefile(s)
			geo._validateShapefile(entry, cb);
		});

		ops.push(function (cb) {
			// convert shapefile to geo/topojson
			geo._convertShapefile(entry, cb);
		});

		async.series(ops, function (err) {
			if (err) console.error('processShapefile err: ', err);
			callback(null, entry);	// dont pass err
		});

	},


	processJsonFile : function (entry, callback) {

		// create unique filename for geojson, save in same folder
		var geoFile = _.remove(entry.files, function (f) {
			return (f.slice(-5) == '.json')
		});

		// set paths
		var base = entry.folder + '/';
		var fileUuid = 'geojson-' + uuid.v4() + '.geojson';
		var fromFile = base + geoFile[0]; 
		var toFile   = base + fileUuid;

		// move file, add to entry, return
		fs.rename(fromFile, toFile, function (err) {
			if (err) console.log('json rename err: ', err);

			// update entry
			entry.data.geojson = fileUuid;
			entry.data.type = 'layer';
			entry.files.push(fileUuid);
			entry.type = 'layer';
			entry.title = entry.originalFilename;

			// return
			callback(null, entry);

		});
	},


	processGeojsonFile : function (entry, callback) {
		
		console.log('*************************')
		console.log('* geo.processGeojsonFile:', entry);
		console.log('*************************')

		// create unique filename for geojson, save in same folder
		var geoFile = _.remove(entry.files, function (f) {
			return (f.slice(-8) == '.geojson')
		});

		console.log('geoFile: ', geoFile);

		// set paths
		var base = entry.folder + '/';
		var fromPath = base + geoFile[0]; 
		var toFile = 'geojson-' + uuid.v4() + '.geojson';
		var toPath = base + toFile;

		// move file, add to entry, return
		fs.rename(fromPath, toPath, function (err) {
			if (err) console.log('geojson rename err: ', err);

			// update entry
			entry.data.geojson = toFile;
			entry.files.push(toFile);
			entry.type = 'layer';
			entry.name = geoFile[0];
			entry.title = entry.originalFilename;

			console.log('renamed: ', entry);

			// return
			callback(null, entry);

		});	
	},


	processKmlFile : function (entry, callback) {
		
		// create unique filename for geojson, save in same folder
		var kmlFile = _.remove(entry.files, function (f) {
			return (f.slice(-4) == '.kml')
		});

		// set paths
		var base = entry.folder + '/';
		var fileUuid = 'geojson-' + uuid.v4() + '.geojson';
		var fromFile = base + kmlFile[0]; 
		var toFile   = base + fileUuid;

		var ops = [];
		ops.push(function (cb) {
			geo._kml2geojson(fromFile, toFile, cb);
		});

		async.series(ops, function (err) {

			// update entry
			entry.data.geojson = fileUuid;
			entry.data.type = 'layer';
			entry.files.push(fileUuid);
			entry.type = 'layer';
			entry.title = entry.originalFilename;

			// return
			callback(null, entry);

		});		

	},

	processTopojsonFile : function (entry, callback) {


	},

	processGpxFile : function (entry, callback) {

	},



	// converts fromFile (kml) to toFile (geojson)
	_kml2geojson : function (fromFile, toFile, callback) {
		fs.readFile(fromFile, 'utf8', function (err, data) {
			var kml = jsdom(data);
			var converted = tj.kml(kml);
			fs.outputFile(toFile, JSON.stringify(converted), callback);
		});
	},



	_validateShapefile : function (entry, callback) {
		console.log('validateShapefile');

		// shape extensions
		var mandatory 	= ['.shp', '.shx', '.dbf'];
		var files       = entry.files;

		files.forEach(function (f) {
			var ext = f.slice(-4);
			_.pull(mandatory, ext);
		})

		// if not all accounted for, return error
		if (mandatory.length > 0) return callback({error : 'Missing shapefile(s)', files : mandatory});
		
		// return
		callback(null);

	},

	_convertShapefile : function (entry, callback) {

		var shapes = entry.files,
		    folder = entry.folder + '/';

		// add relative path if any
		if (entry.relativePath) folder += entry.relativePath;

		// get .shp file
		for (s in shapes) {
			if (shapes[s].slice(-4) == '.shp') var shp = shapes[s];
		}
		

		var inFile = folder + shp,
		    toFile = 'geojson-' + uuid.v4() + '.geojson';
		    // outFile = folder + '/' + shp + '.geojson';
		    outFile = entry.folder + '/' + toFile;

		// execute cmd line conversion 
		var cmd = 'mapshaper -p 0.1 --encoding utf8 -f geojson -o ' + outFile + ' ' + inFile;		// todo: mapshaper options
		console.log('================= m a p s h a p e r ==========================');
		console.log('cmd: ', cmd);
		var exec = require('child_process').exec;
		exec(cmd, function (err, stdout, stdin) {
			if (err) console.error('mapshaper err: ', err);

			// add to entry
			entry.layers.push(toFile);
			entry.files.push(toFile);
			entry.type = 'layer';
			entry.data.geojson = toFile;
			entry.title = entry.originalFilename;

			console.log('*************************')
			console.log('* geo._convertShapefile DONE:', entry);
			console.log('*************************')

			// return
			callback(null);

		});
	},


}









