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
		var fileUuid = req.query.file,
		    account = req.user,
		    ops = [];



		if (!fileUuid) return api.error.missingInformation(req, res);
		
		ops.push(function (callback) {
			File
			.findOne({uuid : fileUuid})
			.exec(callback);
		});

		ops.push(function (file, callback) {
			api.access.to.download_file({
				file : file,
				user : account
			}, callback);
		});

		ops.push(function (options, callback) {
			var record = options.file,
			    name = record.name.replace(/\s+/g, ''),
			    out = api.config.path.temp + name + '_' + record.type + '.zip',
			    cwd = api.config.path.file + fileUuid,
			    command = 'zip -rj ' + out + ' *' + ' -x __MACOSX .DS_Store',
			    exec = require('child_process').exec;				
			
			// run command
			exec(command, {cwd : cwd}, function (err, stdout, stdin) {
				callback(err, out);
			});
		});

		async.waterfall(ops, function (err, path) {
			if (err) return api.error.general(req, res, err);
			res.download(path);
		});

	},


	// download zip
	downloadZip : function (req, res) {
		var file = req.query.file,
		    dive = require('dive'),
		    folder = api.config.path.temp + file,
		    found,
		    ops = [];


	
		// todo: this is fucked. not even dealing with a file object here, just paths.. 
		// 	not solid! FIX!

		
		// find zip file
		dive(folder, 

			// each file callback
			function(err, file) {
				if (err || !file) return api.error.general(req, res, 'File not found.');

				if (file.slice(-3) == 'zip') {
					found = true;
					return res.download(file);
					// todo: delete zip file
				}
			}, 

			// callback
			function () { 
				if (!found) return api.error.general(req, res, 'File not found.');
			}	
		);
	},


	// handle file download
	download : function (req, res) {

		var file = req.query.file,
		    type = req.query.type || 'file';
	
		if (!file) return api.error.missingInformation(req, res);
		
		// zip file
		if (type == 'zip') return api.file.downloadZip(req, res);
			
		// normal file
		return api.file.downloadFile(req, res);
		
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
	update : function (req, res) {
		var fileUuid = req.body.uuid,
		    account = req.user,
		    ops = [];
		

		ops.push(function (callback) {
			File
			.findOne({uuid : fileUuid})
			.exec(callback);
		});


		ops.push(function (file, callback) {
			api.access.to.edit_file({
				file : file,
				user : account
			}, callback);
		});

		ops.push(function (options, callback) {
			api.file._update({
				file : options.file,
				options : req.body
			}, callback);
		});

		async.waterfall(ops, function (err, file) {
			if (err) return api.error.general(req, res, err);
			res.end(JSON.stringify(file));
		});


	},

	_update : function (job, callback) {
		var file = job.file,
		    options = job.options,
		    queries = {};

		// valid fields
		var valid = [
			'name', 
			'description', 
			'keywords', 
			'status',
			'category',
			'version',
		];

 		// enqueue queries for valid fields
		valid.forEach(function (field) {
			if (options[field]) queries = api.file._enqueueUpdate({
				queries : queries,
				field : field,
				file : file,
				options : options
			});
		});

		// run queries to database
		async.parallel(queries, callback);

	},


	// async mongo update queue
	_enqueueUpdate : function (job) {
		var queries = job.queries,
		    field = job.field,
		    file = job.file,
		    options = job.options;

		// create update queue op
		queries[field] = function(callback) {	
			file[field] = options[field];
			file.markModified(field);
			file.save(callback);
		};
		return queries;
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
		var uuid = req.body.uuid,	// file-1091209120-0129029
		    user = req.user.uuid,	// user-1290192-adasas-1212
		    projectUuid = req.body.projectUuid;

		// return if invalid
		if (!uuid || !user) return api.error.missingInformation(req, res);

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
		if (!record) return api.error.missingInformation(req, res);

		// get geosjon
		var geojson = record.data.geojson,
		    uuid = record.uuid,
		    path = api.config.path.file + uuid + '/' + geojson;

		// return if nothing
		if (!geojson) return api.error.missingInformation(req, res);

		// read file and ship it
		fs.readJson(path, function (err, data) {
			if (err || !data) return api.error.general(req, res, err || 'No file.');

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
		var file = req.params[0],
		    path = api.config.path.image + file;
		
		// send
		res.sendFile(path, {maxAge : 10000000});	// cache age, 115 days.. cache not working?
	},



}