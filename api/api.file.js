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
		if (!files || !puuids || !pslug) return api.error.missingInformation(req, res);

		// create main folder
		var uuidFolder 	= uuid.v4();
		var basedir 	= api.config.path.temp + uuidFolder;
		var maindir 	= basedir + '/' + pslug;
		
		fs.mkdirs(maindir, function (err) {		// refactor
			if (err) console.log('ERR 9'.red, err);
			
			if (err) return api.error.general(req, res, err);
			
			// for each file
			var dbl = [], i = 1;
			async.each(files, function (file, callback) {
				if (!file || !file.name) return callback('No such file.');

				// check for no double folder names			
				var filename = file.name;
				if (dbl.indexOf(filename) > -1) filename += '_' + i++; // add index to filename if already exists
				dbl.push(filename);

				// set paths
				var dest = maindir + '/' + filename;
				var src = api.config.path.file + file.uuid ; // folder

				// copy
				fs.copy(src, dest, callback);	

			}, 

			// final callback
			function (err) {	// todo: err handling
				if (err) console.log('ERR 10'.red, err);
				if (err) return api.error.general(req, res, err);

				// execute cmd line zipping 
				var zipfile = basedir + '/' + pslug + '_download.zip';
				var cmd = 'zip -r ' + zipfile + ' *'; 
				var exec = require('child_process').exec;				
				
				// run command
				exec(cmd, { cwd : maindir }, function (err, stdout, stdin) {
					if (err) console.log('ERR 11'.red, err);

					if (err) return api.error.general(req, res, err); // if err

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
		
		// console.log('downloadFile'.green, fileUuid);

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
			
			exec(command, {cwd : cwd}, function (err, stdout, stdin) {
				callback(err, out);
			});
		});

		async.waterfall(ops, function (err, path) {
			if (err) console.log('ERR 12'.red, err);

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
				if (err) console.log('ERR 13'.red, err);

				if (err || !file) return api.error.general(req, res, 'File not found.');

				if (file.slice(-3) == 'zip') {
					found = true;
					return res.download(file);
					// todo: delete zip file
				}
			}, 

			// callback
			function (err) { 
				if (err) console.log('ERR 14'.red, err);

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

		// validate
		if (!_fids || !puuid || !userid) return api.error.missingInformation(req, res);

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
				if (err || !project) return callback(err);

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
					if (err) console.log('delete file save err 445', err);
					callback(null);
				});
			});
		});

		
		// run queries
		async.series(ops, function(err) {
			if (err) console.log('ERR 15'.red, err);
			if (err) return api.error.general(req, res, err);		

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

		if (!fileUuid) return api.error.missingInformation(req, res);

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
			if (err) console.log('file update err: '.red + err);
			if (err) console.log('ERR 16'.red, err);
			if (err || !file) return api.error.general(req, res, err);

			res.end(JSON.stringify(file));
		});


	},

	_update : function (job, callback) {
		var file = job.file,
		    options = job.options,
		    queries = {};

		// console.log('update file'.green, options);
		
		// valid fields
		var valid = [
			'name', 
			'description', 
			'keywords', 
			'status',
			'category',
			'version',
			'copyright',
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
		var inn = options.inn,
		    fileUuid = options.fileUuid,
		    out = api.config.path.file + fileUuid + options.out;

		fs.ensureDir(out, function (err) {
			if (err) console.log('handlezip 903 err: '.red + err);
			if (err) return callback(err);

			// cmd
			var cmd = 'unzip -o -d "' + out + '" "' + inn + '" -x "*DS_Store*" "*__MACOSX*"'; 	// to folder .shp
			var exec = require('child_process').exec;

			exec(cmd, callback);

			// // unzip
			// exec(cmd, function (err, stdout, stdin) {
			// 	if (err) console.log('handleziup 00 err: '.red + err);
			// 	if (err) return callback(err);

			// 	console.log('zippppppped!!'.green);
			// 	console.log('zippppppped!!'.green);
			// 	console.log('zippppppped!!'.green, err, stdout, stdin);

			// 	// consl.og('crahs!');
			// 	// remove unnecessary files - important!
			// 	console.log('unlkn king inn'.red, inn);
			// 	// fs.unlink(inn, function (err) {
			// 		// if (err) console.log('handle zip unlink  err: '.red + err);
			// 		// if (err) return callback(err);

			// 		console.log('removing out! __MAXOSX'.red, out);
			// 		callback(err);
			// 		// fs.remove(out + '/__MACOSX', function (err) {
			// 		// 	if (err) console.log('handle zip remove : '.red + err);
			// 		// 	callback(err);
			// 		// });
			// 	// });
			// });
		});
	},

	// #########################################
	// ###  FILER: untar                     ###
	// #########################################
	handleTar : function (inn, fileUuid, callback) {
		var out = api.config.path.file + fileUuid;

		fs.ensureDir(out, function (err) {
			if (err) return callback(err);

			var cmd = 'tar xzf "' + inn + '" -C "' + out + '"';
			var exec = require('child_process').exec;
			
			// unzip
			exec(cmd, function (err, stdout, stdin) {
				if (err) return callback(err);

				// remove zipfile - important!
				fs.unlink(inn, function (err) {
					if (err) return callback(err);

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
		if (!path || !name || !fileUuid) return callback('Missing information.9');

		// set path
		var out = api.config.path.file + fileUuid + '/' + name;
	
		// move to folder
		fs.move(path, out, function (err) {
			if (err) return callback(err);

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
		if (!path || !name || !fileUuid) return callback('Missing information.10');

		var out = api.config.path.file + fileUuid + '/' + name;

		// do nothing if already there
		if (path == out) return callback(null);

		// move to folder
		fs.move(path, out, callback);
	},


	// #########################################
	// ###  FILER: geo/topo/json             ###
	// #########################################
	handleJson : function (inn, name, type, fileUuid, done) {
		if (!inn || !name || !fileUuid) return done('Missing information.11');
	
		// set path
		var out = api.config.path.file + fileUuid + '/' + name;
		var ops = {};

		// move if not already in right place
		if (inn != out) {
			ops.move = function (callback) {
				fs.move(inn, out, callback);
			};
		}

		// process geo
		ops.geo = function (callback) {
			if (type != 'geojson') return callback('Not a valid .geojson file.');

			api.geo.handleGeoJSON(out, fileUuid, function (err, db) {
				if (err) console.log('ERR 51'.red, err);
				if (err || !db) return callback(err || 'No db.');

				// populate db 
				db.data = {
					geojson : name,
					cartoid : 'default'
				}
				db.title = name;

				callback(err, db);
			});	
		};

		async.series(ops, function (err, results) {
			if (err) console.log('ERR 60'.red, err);
			done(err, results.geo);
		});

	},


	// #########################################
	// ###  FILER: shapefile                 ###
	// #########################################
	handleShapefile : function (folder, name, fileUuid, callback) {	// already moved to right place, by unzip
		api.geo.handleShapefile(folder, name, fileUuid, function (err, db) {
			if (err) console.log('ahndle shape ERRR 909: '.red + err);
			if (err) {
				// delete shapefile
				var path = folder + '/' + name;
				fs.unlink(path, function (er) {
					if (er) console.log('handle shape unlink err: '.red + er);
					callback(err);
				});
			} else {
				callback(null, db);
			}
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
			if (err) console.log('get geo exec err: '.red + err);
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
			if (err) console.log('ERR 17'.red, err);
			if (err || !data) return api.error.general(req, res, err || 'No file.');

			// set header
			res.set({'Content-Type': 'text/json'});		// todo: encoding of arabic characters, tc.
			
			// return
			res.end(JSON.stringify(data));
		});
	},

	createModel : function (options, callback) {

		console.log('api.file.createModel'.red);

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
			// console.log('file model created:', err, doc);
			if (err) console.log(err);
			callback(null, doc);
		});
	},

	// save file to project (file, layer, project id's)
	addToProject : function (file_id, projectUuid, callback) {

		console.log('===> ADD FILE TO PROJECT', file_id);

		Project
		.findOne({'uuid' : projectUuid })
		.exec(function (err, project) {
			console.log('');
			console.log('');
			console.log('');
			console.log('err? -> found pro:', err, project);
			console.log('file_id: ', file_id);

			if (err) return callback && callback(err);
			if (!project) return callback && callback('No project');

			project.files.push(file_id);			
			project.markModified('files');
			project.save(function (err) {
				console.log('saved project', err);
				console.log('modified project: ', project);
				callback && callback(err);
			});
		});
	},

	sendImage : function (req, res) {
		var file = req.params[0],
		    path = api.config.path.image + file;
		
		// send
		res.sendfile(path, {maxAge : 10000000});	// cache age, 115 days.. cache not working?
	},

	
	tileCount : function (req, res) {
		var fileUuid = req.body.fileUuid,
		    path = '/data/raster_tiles/' + fileUuid,
		    cmd = 'find raster/ -type f | wc -l',
		    exec = require('child_process').exec;				
					
		// run command
		exec(cmd, { cwd : path }, function (err, stdout, stdin) {
			if (err) console.log('ERR 11'.red, err);

			var count = stdout;
			res.end(count);
		});
	},

	_sendToProcessing : function (options, done) {
		var pack = options.pack,
		    user = options.user,
		    layers = pack.layers,
		    size = options.size,
		    ops = [];

		// can be several layers in each upload
		layers.forEach(function (layer) {
			ops.push(function (callback) {
				if (options.isRaster)  api.file._sendToProcessingRaster(layer, options, callback);
				if (options.isGeojson) api.file._sendToProcessingGeojson(layer, options, callback);
				if (!options.isRaster && !options.isGeojson) callback();
			});
			
		});

		async.series(ops, function (err, results) {
			done && done(null, 'All DONE');
		});
	},

	_sendToProcessingRaster : function (layer, options, done) {
		var pack = options.pack,
		    user = options.user,
		    layers = pack.layers,
		    size = options.size,
		    ops = [],
		    fileUuid = layer.file,
		    localFile = layer.data.raster,
		    localFolder = api.config.path.file + fileUuid + '/',
		    remoteFolder = '/data/grind/raster/' + fileUuid + '/',
		    uniqueIdentifier = options.uniqueIdentifier,
		    remoteSSH = 'px_vile_grind',
		    remoteUrl = api.config.vile_grind.remote_url;
		
		var sendOptions = {
			fileUuid : fileUuid,
			filename : layer.data.raster,
			uniqueIdentifier : uniqueIdentifier,
			sender_ssh : api.config.vile_grind.sender_ssh,
			sender_url : api.config.vile_grind.sender_url,
			api_hook : 'grind/raster/done',
		}

		// create dir on remote
		ops.push(function (callback) {
			var cmd2 = 'ssh ' + remoteSSH + ' "mkdir ' + remoteFolder + '"';
			exec(cmd2, callback);
		});

		// send file over ssh
		ops.push(function (callback) {
			var cmd = 'tar -cf - -C "' + localFolder + '" "' + localFile + '" | pigz | ssh ' + remoteSSH + ' "pigz -d | tar xf - -C ' + remoteFolder + '/"';
			exec(cmd, callback);
		});

		// notify remote of file
		ops.push(function (callback) {
			request({
				method : 'POST',
				uri : remoteUrl + 'grind/raster/job',
				json : sendOptions
			}, callback); 
		});

		// run ops
		async.series(ops, function (err, results) {
			if (err) return done(err);

			// register socket
			api.socket.setProcessing({
				userId : user._id,
				fileUuid : fileUuid,
				uniqueIdentifier : uniqueIdentifier,
				pack : pack,
				size : size
			});

	
			// api.file._startProcessingProgress({
			// 	fileUuid : fileUuid
			// });			

			// callback
			done && done(null, 'All done!');
		})

	},

	_startProcessingProgress : function () {

		// send processing progress by socket
		api.socket.pushProcessingProgress({
			userId : user._id,
			fileUuid : fileUuid
		})

	},

	_sendToProcessingGeojson : function (layer, options, done) {
		var pack = options.pack,
		    user = options.user,
		    layers = pack.layers,
		    size = options.size,
		    ops = [],
		    fileUuid = layer.file,
		    localFile = fileUuid + '.geojson',
		    localFolder = api.config.path.geojson,
		    remoteFolder = '/data/grind/geojson/',
		    uniqueIdentifier = options.uniqueIdentifier,
		    remoteSSH = 'px_vile_grind',
		    remoteUrl = api.config.vile_grind.remote_url;

		var cmd = 'tar -cf - -C ' + localFolder + ' ' + localFile + ' | pigz | ssh ' + remoteSSH + ' "pigz -d | tar xf - -C ' + remoteFolder + '"';

		var sendOptions = {
			fileUuid : fileUuid,
			uniqueIdentifier : uniqueIdentifier,
			sender_ssh : api.config.vile_grind.sender_ssh,
			sender_url : api.config.vile_grind.sender_url,
			api_hook : 'grind/done'
		}

		// send file over ssh
		exec(cmd, function (err, stdout, stdin) {
			if (err) console.log('err'.red, err);

			// ping tileserver storage to notify of file transfer
			request({
				method : 'POST',
				uri : remoteUrl + 'grind/job',
				json : sendOptions
			}, 

			// callback
			function (err, response, body) {

				api.socket.setProcessing({
					userId : user._id,
					fileUuid : fileUuid,
					uniqueIdentifier : uniqueIdentifier,
					pack : pack,
					size : size
				});

				done(null, 'All done!');
			});
		});

	},


}