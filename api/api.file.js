// API: api.file.js

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
console.log('FILER === api=>', api);

// exports
module.exports = api.file = {



	// zip a file and send to client
	zipAndSend : function (req, res) {

		var files 	= req.body.files;
		var puuids 	= req.body.puuid;
		var pslug 	= req.body.pslug;

		// return if nothing
		if (!files || !puuids || !pslug) return res.end('nothing!');

		// create main folder
		var uuidFolder 	= uuid.v4();
		// var basedir 	= TEMPFOLDER + uuidFolder;
		var basedir 	= api.config.path.temp + uuidFolder;
		var maindir 	= basedir + '/' + pslug;
		
		fs.mkdirs(maindir, function (err) {		// refactor
			
			// return on error
			if (err) return console.error(err);
			
			// for each file
			var dbl = [], i = 1;
			async.each(files, function (file, callback) {

				// check for no double folder names			
				var filename = file.name;
				if (dbl.indexOf(filename) > -1) filename += '_' + i++; // add index to filename if already exists
				dbl.push(filename);

				// set paths
				var dest = maindir + '/' + filename;
				// var src = FILEFOLDER + file.uuid ; // folder
				var src = api.config.path.file + file.uuid ; // folder

				// copy
				fs.copy(src, dest, function(err){ callback(err) });	

			}, 

			// final callback
			function (err) {	// todo: err handling
				
				// execute cmd line zipping 
				var zipfile = basedir + '/' + pslug + '_download.zip';
				var cmd = 'zip -r ' + zipfile + ' *'; 
				var exec = require('child_process').exec;				
				
				// run command
				exec(cmd, { cwd : maindir }, function (err, stdout, stdin) {
					if (err) return res.end(err); // if err

					// send zip uuid
					res.end(uuidFolder);
				});
			});
		});
	},


	// handle file downloads
	downloadFile : function (req, res) {
		
		var file = req.query.file;
		
		console.log('downloadFile: ', file);
								// todo: access
								// 	 download several files (zipped)

		// send the file, simply
		// get file
		File.findOne({ 'uuid' : file }, function(err, record) {

			console.log('found? , ', err, record);
			
			var name = record.name.replace(/\s+/g, '');

			// execute cmd line zipping 
			// var out = TEMPFOLDER + name + '_' + record.type + '.zip';
			var out = api.config.path.temp + name + '_' + record.type + '.zip';
			// var infile = FILEFOLDER + file + '/*';
			var infile = api.config.path.file + file + '/*';
			
			// var working_dir = FILEFOLDER + file; 
			var working_dir = api.config.path.file + file; 
			var cmd = 'zip -rj ' + out + ' *' + ' -x __MACOSX .DS_Store';// + infile;  		// TODO: only pdf.. 
			var exec = require('child_process').exec;				
			
			console.log('working_dir: ', working_dir);
			console.log('out: ', out);

			// run command
			exec(cmd, { cwd : working_dir }, function (err, stdout, stdin) {
				if (err)  {
					console.log('download exec err: ', err, stdout, stdin);
					return res.end(JSON.stringify({error : err})); // if err
				}

				// send zip file
				res.download(out);
			});



		});

	},


	// download zip
	downloadZip : function (req, res) {
		var file = req.query.file;
		var dive = require('dive');
		// var folder = TEMPFOLDER + file;
		var folder = api.config.path.temp + file;
		var found = false;
		
		// find zip file
		dive(folder, 

			// each file callback
			function(err, file) {
				// err
				if (err || !file) return res.end('File not found.');

				if (file.slice(-3) == 'zip') {
					found = true;
					return res.download(file);
								// todo: delete zip file
				}
			}, 

			// callback
			function () { 
				console.log('found: ', found);
				if (!found) return res.end('File not found.'); 
			}	
		);
	},


	// handle file download
	// getFileDownload : function (req, res) {
	download : function (req, res) {

		var file = req.query.file;
		var type = req.query.type || 'file';
	
		if (!file) console.log('NOT FILE!');

		console.log('file, type', file, type);
		
		// todo: access restrictions

		// zip file
		if (type == 'zip') return api.file.downloadZip(req, res);
			
		// normal file
		if (type == 'file') {
			return api.file.downloadFile(req, res);
			
		} else {
			return api.file.downloadFile(req, res);
		}
		// got nothing to do
		res.end('Please specify a file.'); return;

	},


		// delete a file
	deleteFiles : function (req, res) {

		var _fids  = req.body._fids,
		    puuid  = req.body.puuid,
		    userid = req.user.uuid,
		    uuids = req.body.uuids,
		    ops = [],
		    _lids = [];

		console.log('API: deleteFiles');
		console.log('_fids: ', _fids);
		console.log('puuid: ', puuid);
		console.log('userid: ', userid);
		console.log('uuids: ', uuids);



		// validate
		if (!_fids || !puuid || !userid) return res.end('missing!');

		var ops = [];

		// find layer _ids for removing in project
		ops.push(function (callback) {

			Layer.find({file : {$in : uuids}}, function (err, layers) {

				layers.forEach(function (layer) {
					_lids.push(layer._id);
				});

				
				// todo: delete?

				return callback(err);
		
			});

		});

		// delete file from project
		ops.push(function (callback) {
			
			Project
			.findOne({uuid : puuid})
			// .populate('layers')
			.exec(function (err, project) {
				if (err) console.log('find err: ', err);

				console.log('found project: ', project.name);

				// pull files
				_fids.forEach(function (f) {
					project.files.pull(f);
				});

				// pull layers
				_lids.forEach(function (l) {
					project.layers.pull(l)
				})
				
				project.markModified('files');
				project.markModified('layers');

				project.save(function (err) {
					if (err) console.error('save err: ', err);
					console.log('file removed from project');
					return callback(err);
				});
			});
		});

		


	
		// run queries
		async.series(ops, function(err) {

			if (err) {
				console.log('asyn err: ', err);
				return res.end('{ error : 0 }');
			}		

			console.log('delete done...?');
			res.end(JSON.stringify({
				error : err
			}));
		});

	},


	// update a file
	// updateFile : function (req, res) {
	update : function (req, res) {
		var fuuid = req.body.uuid;
		var userid = req.user.uuid;
		var queries = {};


		// update name
		if (req.body.hasOwnProperty('name')) {
			console.log('name!');
			queries.name = function(callback) {

				var key = 'name';
				var value = req.body.name;

				// update
				api.file._updateFile(req, fuuid, key, value, function (result) {
					return callback(result);
				});

			}
		}

		// update description
		if (req.body.hasOwnProperty('description')) {
			queries.description = function(callback) {

				var key = 'description';
				var value = req.body.description;

				// update
				api.file._updateFile(req, fuuid, key, value, function (result) {
					return callback(result);
				});
				

			}
		}

		// update status
		if (req.body.hasOwnProperty('status')) {
			queries.status = function(callback) {

				var key = 'status';
				var value = req.body.status;

				// update
				api.file._updateFile(req, fuuid, key, value, function (result) {
					return callback(result);
				});
				

			}
		}

		// update keywords
		if (req.body.hasOwnProperty('keywords')) {
			queries.keywords = function(callback) {

				var key = 'keywords';
				var value = req.body.keywords;

				// update
				api.file._updateFile(req, fuuid, key, value, function (result) {
					return callback(result);
				});
				

			}
		}

		// update category
		if (req.body.hasOwnProperty('category')) {
			queries.category = function(callback) {

				var key = 'category';
				var value = req.body.category;

				// update
				api.file._updateFile(req, fuuid, key, value, function (result) {
					return callback(result);
				});
				

			}
		}

		// update version
		if (req.body.hasOwnProperty('version')) {
			queries.version = function(callback) {

				var key = 'version';
				var value = req.body.version;

				// update
				api.file._updateFile(req, fuuid, key, value, function (result) {
					return callback(result);
				});
				

			}
		}



		async.parallel(queries, function(err, doc) {

			// return on error
			if (err) return res.end(JSON.stringify({
				error : err
			}));
					
			// return doc
			res.end(JSON.stringify(doc));

		});

	},

	_updateFile : function (req, fuuid, key, value, callback) {

		File
		.findOne({uuid : fuuid})
		.exec(function (err, file) {
			if (err) return callback(err);

			// return if not file
			if (!file) return callback('No such file.');

			// check access
			var access = api.permission.to.update.file(req.user, file);

			// return if no access
			if (!access) return callback('No access.');
			
			// update
			file[key] = value;
			file.save(function (err) {
				callback(err);
			});
		});


	},




	// #########################################
	// ###  FILER: unzip                     ###
	// #########################################
	// handleZip : function (inn, fileUuid, callback) {
	handleZip : function (options, callback) {
		console.log('FILER:  handleZip!!! ', options);

		var inn = options.inn;
		var fileUuid = options.fileUuid;
		// var out = FILEFOLDER + fileUuid + options.out;
		var out = api.config.path.file + fileUuid + options.out;

		fs.ensureDir(out, function (err) {

			// cmd
			var cmd = 'unzip -o -d "' + out + '" "' + inn + '" -x "*DS_Store*" "*__MACOSX*"'; 	// to folder .shp
			var exec = require('child_process').exec;

			// unzip
			exec(cmd, function (err, stdout, stdin) {
				// remove unnecessary files - important!
				fs.unlink(inn, function (err) {
					fs.remove(out + '/__MACOSX', function (err) {
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
	
		// var out = FILEFOLDER + fileUuid;
		var out = api.config.path.file + fileUuid;

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
		
		// set path
		var out = api.config.path.file + fileUuid + '/' + name;

		// move to folder
		fs.move(path, out, function (err) {

			// handle
			api.pixels.handleImage(out, function (err, db) {
				callback(err, db);
			});
		});

	},



	// #########################################
	// ###  FILER: documents                 ###
	// #########################################
	handleDocument : function (path, name, fileUuid, callback) {	
		console.log('FILER: Handling doc');

		// set path	
		var out = api.config.path.file + fileUuid + '/' + name;

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
	
		// set path
		var out = api.config.path.file + fileUuid + '/' + name;

		// move to folder
		fs.move(inn, out, function (err) {


			if (type == 'geojson') {
				// process geo
				return api.geo.handleGeoJSON(out, fileUuid, function (err, db) {

					// populate db 
					db.data = {
						geojson : name
					}
					db.title = name;


					callback(err, db);

				});	
			}


			// catch err
			callback(err);

		});

		



	},


	// #########################################
	// ###  FILER: shapefile                 ###
	// #########################################
	handleShapefile : function (folder, name, fileUuid, callback) {	// already moved to right place, by unzip
		api.geo.handleShapefile(folder, name, fileUuid, function (err, db) {
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


	// todo: possibly old, to be removed?
	// get geojson
	getGeojsonFile : function (req, res) {

		var uuid = req.body.uuid;	// file-1091209120-0129029
		var user = req.user.uuid;	// user-1290192-adasas-1212
		var projectUuid = req.body.projectUuid;

		// return if invalid
		if (!uuid || !user) return false;

		// get geojson file path from db
		File
		.where('data.geojson', uuid)							// must have this
		.or([{'access.users' : user}, {'access.projects' : projectUuid}])	// either of these
		.limit(1)	// safeguard
		.exec(function(err, record) {
			console.log('found: ', record);
			return api.file.sendGeoJsonFile(req, res, record[0]);
		});
	},




	// todo: possibly old, to be removed?
	// send geojson
	sendGeoJsonFile : function (req, res, record) {

		// return if nothing
		if (!record) return res.end(JSON.stringify({
			error: 'No such file.'
		}));

		// get geosjon
		var geojson = record.data.geojson;

		// return if nothing
		if (!geojson) return res.end(JSON.stringify({
			error : 'No such file.'
		}));

		// read file and ship it
		var uuid = record.uuid;
		var path = api.config.path.file + uuid + '/' + geojson;

		fs.readJson(path, function (err, data) {
			if (err) console.error('err: ', err);

			if (err) return res.end(JSON.stringify({
				error : 'Error reading file.'
			}));

			if (!data) return res.end(JSON.stringify({
				error : 'File not found.'
			}));

			// set header
			res.set({'Content-Type': 'text/json'});		// todo: encoding of arabic characters, tc.
			
			// return
			res.end(JSON.stringify(data));

		});

	},


	// todo: possibly old, to be removed?
	// send geojson helper 
	_sendGeoJsonFile : function (req, res, record) {

		var geofile = [];

		// for each file
		async.each(record.files, function (file, callback) {
			fs.readFile(file, function (err, data) {
				if (data) geofile.push(JSON.parse(data));	// added error handling
				callback(err);
			})		
		}, 

		// final callback
		function (err) {

			// set filesize
			var string = JSON.stringify(geofile);
			var length = string.length.toString();
			res.set({
				'Content-Type': 'text/json',
				'Content-Length': length
			});
			
			// return geojson string
			res.end(JSON.stringify(geofile));
		});
		
	},


	createModel : function (options, callback) {

		var file 		= new File();
		file.uuid 		= options.uuid;
		file.createdBy 		= options.createdBy;
		file.createdByName    	= options.createdByName;
		file.files 		= options.files;
		file.access 		= options.access;
		file.name 		= options.name;
		file.description 	= options.description;
		file.type 		= options.type;
		file.format 		= options.format;
		file.dataSize 		= options.dataSize;
		file.data 		= options.data;

		file.save(function (err, doc) {
			callback(err, doc);
		});
	},


	// save file to project (file, layer, project id's)
	addToProject : function (file_id, projectUuid, callback) {
		Project
		.findOne({'uuid' : projectUuid })
		.exec(function (err, project) {
			project.files.push(file_id);			
			project.markModified('files');
			project.save(function (err) {
				callback && callback(err, done);
			});
		});
	},




	sendImage : function (req, res) {

		var file = req.params[0];
		var path = api.config.path.image + file;
		
		res.sendFile(path, {maxAge : 10000000});	// cache age, 115 days.. cache not working?

	},







}