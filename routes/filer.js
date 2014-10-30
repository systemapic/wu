var fs = require('fs-extra');
var async = require('async');
var util = require('util');
var uuid = require('node-uuid');
var dive = require('dive');
var fspath = require('path');
var _ = require('lodash-node');
var formidable = require('formidable');
var exec = require('child_process').exec;
var kue = require('kue');

// modules
var pixels = require('./pixels');
var geo = require('./geo');
var filer = require('./filer');

// config
var config = require('../config/config');

// global paths
var FILEFOLDER = '/var/www/data/files/';
var TEMPFOLDER  = '/var/www/data/tmp/';




module.exports = filer = {


	// #########################################
	// ###  FILER: unzip                     ###
	// #########################################
	handleZip : function (inn, fileUuid, callback) {
		console.log('FILER: Handling zip');

		var out = FILEFOLDER + fileUuid;

		fs.ensureDir(out, function (err) {

			var cmd = 'unzip -o -d "' + out + '" "' + inn + '"'; 	// to folder .shp
			var exec = require('child_process').exec;
			

			// unzip
			exec(cmd, function (err, stdout, stdin) {
				console.log('unzip done: ', err, stdout, stdin);

				// remove zipfile - important!
				fs.unlink(inn, function (err) {
					console.log('deleted zip file', err);
				
					// remove __MACOSX
					fs.remove(out + '/__MACOSX', function (err) {
						// return
						callback(err);

					});


				});

			});

		});

	},

	// #########################################
	// ###  FILER: untar                     ###
	// #########################################
	handleTar : function (inn, fileUuid, callback) {
		console.log('FILER: Handling tar');
	
		var out = FILEFOLDER + fileUuid;

		fs.ensureDir(out, function (err) {

			var cmd = 'tar xzf "' + inn + '" -C "' + out + '"';
			var exec = require('child_process').exec;
			
			// unzip
			exec(cmd, function (err, stdout, stdin) {
				console.log('unzip done: ', err, stdout, stdin);

				// remove zipfile - important!
				fs.unlink(inn, function (err) {
					console.log('deleted tar file', err);
				
					// remove __MACOSX
					fs.remove(out + '/__MACOSX', function (err) {
						// return
						callback(err);

					});

					
				});
			});


		});


		
	},

	// #########################################
	// ###  FILER: image                     ###
	// #########################################
	handleImage : function (path, name, fileUuid, callback) {	
		console.log('FILER: Handling image');
		
		var out = FILEFOLDER + fileUuid + '/' + name;

		// move to folder
		fs.move(path, out, function (err) {
			console.log('moved image, check ', out);

			pixels.handleImage(out, function (err, db) {

				callback(err, db);

			});


			
		});

	},



	// #########################################
	// ###  FILER: documents                 ###
	// #########################################
	handleDocument : function (path, name, fileUuid, callback) {	
		console.log('FILER: Handling doc');
	
		var out = FILEFOLDER + fileUuid + '/' + name;


		// move to folder
		fs.move(path, out, function (err) {
			callback(null);
		});

	},



	// #########################################
	// ###  FILER: geo/topo/json             ###
	// #########################################
	handleJson : function (inn, name, type, fileUuid, callback) {
		console.log('FILER: Handling json');
	
		var out = FILEFOLDER + fileUuid + '/' + name;


		// move to folder
		fs.move(inn, out, function (err) {


			if (type == 'geojson') {
				// process geo
				return geo.handleGeoJSON(out, fileUuid, function (err, db) {


					// populate db 
					db.data = {
						geojson : name
					}
					db.title = name;


					callback(err, db);

				});	
			}

			// if (type == 'topojson') {
			// 	// process geo
			// 	return geo.handleTopoJSON(out, fileUuid, function (err, db) {

			// 		callback(err, db);

			// 	});	
			// }

			// catch err
			callback(err);

		});

		



	},


	// #########################################
	// ###  FILER: shapefile                 ###
	// #########################################
	handleShapefile : function (folder, name, fileUuid, callback) {	// already moved to right place, by unzip
		console.log('FILER: Handling shape');
		console.log('handleJson');



		geo.handleShapefile(folder, name, fileUuid, function (err, db) {
			console.log('handleShapefile err???', err);

			if (err) {
				// delete shapefile
				var path = folder + '/' + name;
				fs.unlink(path, function (err) {
					console.log('unlinked?', err);
				});
			}
			callback(err, db);

		});

	},














}