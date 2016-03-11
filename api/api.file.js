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
var _ 		= require('lodash');
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
var errors = require('../shared/errors');
var httpStatus = require('http-status');

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

	// called from api.upload.js:431
	addNewFileToUser : function (options, done) {
		var userUuid = options.user.uuid,
		    file_id = options.file._id;

		    console.log('add addNewFileToUser', options);

		User
		.findOne({uuid : userUuid})
		.exec(function (err, user) {
			if (err || !user) return done(err || 'ERR 838: No user.');

			// add file
			user.files.push(file_id);
			user.markModified('files');
			
			// save
			user.save(function (err, doc) {
				console.log('saved addNewFileToUser', err, doc);
				done(err);
			});
		});

	},

	addFileToProject : function (req, res, next) {
		var options = req.body,
		    fileUuid = options.file_id,
		    projectUuid = options.project_id,
		    ops = [],
		    theproject,
		    missingRequiredFields = [];

		if (!fileUuid) {
			missingRequiredFields.push('file_id');
		}

		if (!projectUuid) {
			missingRequiredFields.push('project_id');
		}

		if (!_.isEmpty(missingRequiredFields)) {
			return next({
				message: errors.missing_information.errorMessage,
				code: httpStatus.BAD_REQUEST,
				errors: {
					missingRequiredFields: missingRequiredFields
				}
			});
		}

		ops.push(function (callback) {

			File
			.findOne({uuid : fileUuid})
			.exec(function (err, file) {
				if (!file) {
					return callback({
						message: errors.no_such_file.errorMessage,
						code: httpStatus.NOT_FOUND
					});
				}

				callback(err, file);
			});

		});

		// get all layers connected to file
		ops.push(function (file, callback) {
			Layer
			.find({file : file.uuid})
			.exec(function (err, layers) {
				callback(err, {
					layers: layers || [],
					file: file
				});
			});
		});

		// get and save project
		ops.push(function (params, callback) {
			Project
			.findOne({uuid : projectUuid})
			.exec(function (err, project) {
				if (!project) {
					return callback({
						message: errors.no_such_project.errorMessage,
						code: httpStatus.NOT_FOUND
					});
				}
				params.project = project
				callback(err, params);
			});
		});

		ops.push(function (params, callback) {
			params.project.files.push(params.file._id);
			params.layers.forEach(function (layer) {
				params.project.layers.push(layer._id);
			});
			params.project.markModified('files');
			params.project.markModified('layers');
			params.project.save(function (err, project) {
				params.project = project;
				callback(err, params.project);
			});
		});

		async.waterfall(ops, function (err, results) {
			if (err) {
				return next(err);
			}

			res.send(results);
		});

	},


	// handle file downloads
	downloadPDF : function (req, res, next) {
		var fileUuid = req.query.file,
		    account = req.user,
		    ops = [];

		if (!fileUuid) {
			return next(api.error.code.missingRequiredRequestFields(errors.missing_information.errorMessage, ['file']));
		}

		ops.push(function (callback) {
			File
			.findOne({uuid : fileUuid})
			.exec(callback);
		});

		ops.push(function (file, callback) {

			if (!file) {
				return next({
					message: errors.file_not_found.errorMessage,
					code: httpStatus.NOT_FOUND
				});
			}

			api.file.access.toDownload({
				file : file,
				user : account
			}, callback);
		});

		ops.push(function (options, callback) {
			var record = options.file;
			var name = record.name.replace(/\s+/g, '');

			var folder = api.config.path.file + fileUuid;

			fs.readdir(folder, function (err, files) {

				var pdf = '';
				files.forEach(function (f) {
					var ext = f.slice(-3);
					if (ext == 'pdf') {
						pdf = f;
					}
				});

				var path = folder + '/' + pdf;


				callback(null, path);

			});

		});

		async.waterfall(ops, function (err, path) {
			if (err) console.log('ERR 12'.red, err);
			if (err) return api.error.general(req, res, err);

			res.setHeader('Content-type', 'application/pdf');

			var filestream = fs.createReadStream(path);
			filestream.pipe(res);

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
			api.file.access.toDownload({
				file : file,
				user : account
			}, callback);
		});


		ops.push(function (options, callback) {

			var file = options.file;

			if (file.type == 'postgis') {
				var name = file.name.replace(/\s+/g, '');
				var out = api.config.path.temp + name + '_' + file.type + '.zip';
				var cwd = api.config.path.file + fileUuid;
				var command = 'zip -rj ' + out + ' *' + ' -x __MACOSX .DS_Store';
				var exec = require('child_process').exec;

				var proc = exec(command, {cwd : cwd}, function (err, stdout, stdin) {
					callback(err, out);
				});

				return;
			}

			if (file.type == 'raster') {

				// make a copy first
				var path = api.config.path.file + fileUuid + '/' + fileUuid;
				var renamed = api.config.path.temp + fileUuid + '/' + file.originalName;
				fs.copy(path, renamed, function (err) {

					var zipfile_name = api.config.path.temp + fileUuid + '/' + file.originalName + '_' + file.type + '.zip';
					var cwd = api.config.path.temp;
					var command = 'zip -rj ' + zipfile_name + ' ' + renamed;
					var exec = require('child_process').exec;

					var proc = exec(command, {cwd : cwd}, function (err, stdout, stdin) {
						callback(err, zipfile_name);
					});

				});

			}

		});

		async.waterfall(ops, function (err, path) {
			if (err) console.log('ERR 12'.red, err);
			if (err) return api.error.general(req, res, err);

			// send file
			res.download(path);

		});
	},


	downloadShape : function (req, res) {

		// todo: permissions!

		var file = req.query.file;
		var filePath = api.config.path.temp + file;

		res.download(filePath);
	},



	// download zip
	downloadZip : function (req, res, next) {
		var folder = api.config.path.temp + req.query.file;
		var found;
		var ops = [];
	
		// todo: this is #$SD. not even dealing with a file object here, just paths.. 
		// 	not solid! FIX!
		
		// find zip file
		dive(folder,

			// each file callback
			function(err, file) {
				if (err) {
					console.log('ERR 13'.red, err);
				}

				if (err || !file) {
					return next({
						message: errors.file_not_found.errorMessage,
						code: httpStatus.NOT_FOUND
					});
				}

				if (file.slice(-3) == 'zip') {
					found = true;
					return res.download(file);
					// todo: delete zip file
				}
			},

			// callback
			function (err) { 
				if (err) {
				  console.log('ERR 14'.red, err);
				  next(err); 
				}

				if (!found) {
					return next({
						message: errors.file_not_found.errorMessage,
						code: httpStatus.NOT_FOUND
					});
				}
			}	
		);
	},


	// handle file download
	download : function (req, res, next) {
		var query = req.query || {};
		var file = query.file;
		var type = query.type || 'file';
	
		if (!file) {
			return next(api.error.code.missingRequiredRequestFields(errors.missing_information.errorMessage, ['file']));
		}
		
		// zip file
		if (type == 'zip') return api.file.downloadZip(req, res, next);
		
		// pdf
		if (type == 'pdf') return api.file.downloadPDF(req, res, next);

		// pdf
		if (type == 'shp') return api.file.downloadShape(req, res, next);

		// normal file
		return api.file.downloadFile(req, res, next);
	},


	deleteFile : function (req, res, next) {
		var file_id = req.body.file_id;
		var ops = [];
		var validateError;

		if (!file_id) {
			validateError = {
				message: errors.missing_information.errorMessage,
				code: httpStatus.BAD_REQUEST,
				errors: {
					missingRequiredFields: ['file_id']
				}
			};

			return next(validateError);
		}

		File
		.findOne({uuid : file_id})
		.exec(function (err, file) {
			if (err) {
				return next(err);
			}

			if (!file) {
				return next({
					message: errors.no_such_file.errorMessage,
					code: httpStatus.NOT_FOUND
				});
			}

			var type = file.type;

			if (type === 'postgis') {
				ops.push(function (callback) {
					api.file.deletePostGISFile({
						user : req.user,
						file : file
					}, callback);
				});
			}

			if (type === 'raster') {
				ops.push(function (callback) {
					api.file.deleteRasterFile({
						user : req.user,
						file : file
					}, callback);
				});
			}

			async.series(ops, function (error, result) {
				console.log('err, result', error, result);
				if (error) {
					return next(error);
				}

				res.json({
					err : error,
					success : !error
				});
			});
		});

	},


	deleteRasterFile : function (options, done) {
		
		var file = options.file;
		var user = options.user;
		var data = file.data.postgis;
		var file_id = data.file_id;
		var removedObjects = {};
		var ops = [];

		if (!file_id) {
			return done({
				message: errors.missing_information.errorMessage,
				code: httpStatus.NOT_FOUND
			});
		}

		// get file model
		ops.push(function (callback) {
			File
			.findOne({uuid : file_id})
			.exec(callback);
		});

		// check permissions
		ops.push(function (file, callback) {
			console.log('TODO! permission to delete file!');

			// api.access.to.delete_file({
			// 	file : file,
			// 	user : account
			// }, callback);

			callback(null, file);
		});

		// remove file from user
		ops.push(function (file, callback) {

			User
			.findOne({uuid : user.uuid})
			.exec(function (err, u) {
				u.files.pull(file._id);
				u.markModified('files');
				u.save(function (err) {

					removedObjects.user = {
						file_id : file._id
					};

					callback(null);
				});
			});
		});

		// remove file model
		ops.push(function (callback) {

			File
			.findOne({uuid : file_id})
			.remove(function (err, rmf) {
				removedObjects.file = {
					file_id : file_id
				};
				callback(null);
			});
		});

		// remove layers based on dataset
		ops.push(function (callback) {

			Layer
			.find({'file' : file_id})
			.exec(function (err, layers) {
				if (err) return callback(err);

				// todo: remove layers from projects
				api.file.deleteLayersFromProjects({
					layers : layers
				}, function (err) {

					// delete layer models
					async.each(layers, function (layer, done) {
						layer.remove(done)
					}, function (err) {
						removedObjects.layers = layers;
						callback(err);
					});
				});
			});
		});

		async.waterfall(ops, function (err, results) {
			// res.json({
			// 	success : true,
			// 	error : err,
			// 	removed : removedObjects
			// });
			done(err, {
				success : true,
				error : err,
				removed : removedObjects
			});
		});

	},

	deletePostGISFile : function (options, done) {

		var file = options.file;
		var user = options.user;
		var data = file.data.postgis;
		var database_name = data.database_name;
		var table_name = data.table_name;
		var fileUuid = table_name;
		var data_type = data.data_type;
		var ops = [];
		var removedObjects = {};

		if (!database_name || !table_name) {
			return done({
				message: errors.missing_information.errorMessage,
				code: httpStatus.NOT_FOUND
			});
		}

		// get file model
		ops.push(function (callback) {
			File
			.findOne({uuid : fileUuid})
			.exec(callback);
		});

		// check permissions
		ops.push(function (file, callback) {
			console.log('TODO! permission to delete file!')
			// api.access.to.delete_file({
			// 	file : file,
			// 	user : account
			// }, callback);

			callback(null, file);
		});

		// remove file from user
		ops.push(function (file, callback) {
			if (!file) {
				return callback({
					message: errors.no_such_file.errorMessage,
					code: httpStatus.NOT_FOUND
				});
			}
			
			User
			.findOne({uuid : user.uuid})
			.exec(function (err, u) {
				u.files.pull(file._id);
				u.markModified('files');
				u.save(function (err) {

					removedObjects.user = {
						file_id : file._id
					};

					callback(null);
				});
			});
		});

		// remove file model
		ops.push(function (callback) {

			File
			.findOne({uuid : fileUuid})
			.remove(function (err, rmf) {
				removedObjects.file = {
					file_id : fileUuid
				};
				callback(null);
			});
		});


		// remove postgis data
		ops.push(function (callback) {
			api.postgis.deleteTable({
				database_name : database_name,
				table_name : table_name
			}, callback);
		});


		// remove layers based on dataset
		ops.push(function (callback) {

			Layer
			.find({'data.postgis.table_name' : table_name})
			.exec(function (err, layers) {
				if (err) return callback(err);

				// todo: remove layers from projects
				api.file.deleteLayersFromProjects({
					layers : layers
				}, function (err) {

					// delete layer models
					async.each(layers, function (layer, done) {
						layer.remove(done)
					}, function (err) {
						removedObjects.layers = layers;
						callback(err);
					});
				});
			});
		});

		async.waterfall(ops, function (err, results) {
			// res.json({
			// 	success : true,
			// 	error : err,
			// 	removed : removedObjects
			// });

			done(err, {
				success : true,
				error : err,
				removed : removedObjects
			})
		});

	},

	deleteLayersFromProjects : function (options, done) {
		var layers = options.layers;


		async.each(layers, function (layer, callback) {

			var layer_id = layer._id;

			// find project
			Project
			.findOne({layers : layer_id})
			.exec(function (err, p) {

				if (!p) return callback();

				p.layers.pull(layer_id);
				p.markModified('layers');
				p.save(function (err) {
					callback(err);
				});

			})


		}, function (err) {

			done(err);

		});

	},


	// get postgis layers on dataset
	getLayers : function (req, res) {

		var options = req.body,
		    type = options.type;

		if (type === 'raster') {
			return api.file._getRasterLayers(req, res);
		}

		if (type === 'postgis') {
			return api.file._getPostGISLayers(req, res);
		}

		return api.error.missingInformation(req, res);
	},

	_getRasterLayers : function (req, res) {
		var options = req.body;
		var data = options.data || {};
		var file_id = data.file_id;
		
		if (!file_id) {
			return api.error.general(req, res, new Error(util.format(errors.missing_request_parameters.errorMessage, 'data.file_id')));
		}
		
		Layer
		.find({'file' : file_id})
		.exec(function (err, layers) {
			if (err) return api.error.general(req, res, err);
			res.json(layers);
		});
	},

	_getPostGISLayers : function (req, res) {

		var options = req.body,
		    data = options.data || {},
		    database_name = data.database_name,
		    table_name = data.table_name,
		    fileUuid = table_name,
		    data_type = data.data_type,
		    user = req.user,
		    ops = [];

		if (!database_name || !table_name) return api.error.missingInformation(req, res);

		// todo: permissons
		Layer
		.find({'data.postgis.table_name' : table_name})
		.exec(function (err, layers) {
			if (err) return api.error.general(req, res, err);
			res.json(layers);
		});
	},

	// delete a file
	deleteFiles : function (req, res) {
		var _fids  = req.body._fids;
		var puuid  = req.body.puuid;
		var userid = req.user.uuid;
		var uuids = req.body.uuids;
		var ops = [];
		var _lids = [];

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
	update : function (req, res, next) {
		var fileUuid = req.body.uuid;
		var account = req.user;
		var ops = [];

		console.log('req.body', req.body);

		if (!fileUuid) {
			return api.error.missingInformation(req, res);
		}

		ops.push(function (callback) {
			File
				.findOne({uuid : fileUuid})
				.exec(callback);
		});

		ops.push(function (file, callback) {
			if (!file) {
				callback({
					code: httpStatus.NOT_FOUND,
					message: errors.no_such_file.errorMessage
				});
			}

			api.file.access.toEdit({
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

		async.waterfall(ops, function (err, result) {
			if (err) console.log('file update err: '.red + err);
			if (err) console.log('ERR 16'.red, err);

			if (err || !result) {
				return next(err);
			}

			res.end(JSON.stringify(result));
		});

	},

	_update : function (job, done) {
		var file = job.file;
		var options = job.options;
		var updates = {};
		var ops = [];

		// todo: check for bullshit values!

		// valid fields
		var valid = [
			'name', 
			'description', 
			'keywords', 
			'status',
			'category',
			'version',
			'copyright',
			'data',
			'styleTemplates'
		];

		updates = _.pick(options, valid);


		ops.push(function (callback) {
			_.extend(file, updates);
			file.validate(function (err) {
				validationErrors = err;
				if (validationErrors && validationErrors.errors && !_.isEmpty(_.keys(validationErrors.errors))) {
					return callback({
						code: httpStatus.BAD_REQUEST,
						message: errors.invalid_fields.errorMessage,
						errors: validationErrors.errors
					});
				}
				callback(null);
			});
		});

		ops.push(function (callback) {
			file.update({ $set: _.pick(options, valid) })
				.exec(function (err, result) {
					if (err) {
						callback(err);
					}

					callback(null, {
						updated: _.keys(updates)
					});
				});
		});
		ops.push(function (params, callback) {
			File.findOne({uuid: options.uuid})
				.exec(function (err, res) {
					if (err) {
						return callback(err);
					}
					params.file = res;
					callback(null, params);
				});
		});

		async.waterfall(ops, done);
	},


	access : {

		toEdit : function (options, done) {
			if (!options || !options.file) {
				return done({
					message: errors.bad_file_uuid.errorMessage,
					code: httpStatus.BAD_REQUEST
				});
			}

			if (!options || !options.user) {
				return done({
					message: errors.bad_user_uuid.errorMessage,
					code: httpStatus.BAD_REQUEST
				});
			}

			File
			.findOne({uuid : options.file.uuid})
			.exec(function (err, f) {

				if (f.createdBy == options.user.uuid) {
					return done(null, options);
				}

				done({
					message: errors.no_access.errorMessage,
					code: httpStatus.BAD_REQUEST
				});
			});
		},

		toDownload : function (options, done) {
			console.log('TODO: access to download!');
			done(null, options);
		}

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


	create : function (req, res) {

		console.log('*********************************** create    r', req.body);

		var ops = {};
		var options = req.body;
		var user = req.user;
		var dataset;

		ops.create = function (callback) {
			// override important fields
			options.uuid = 'file_' + api.utils.getRandomChars(20);
			options.createdBy = user.uuid;

			api.file.createModel(options, function (err, fileModel) {
				if (err) return callback(err);
				console.log('created filemodel', fileModel);

				dataset = fileModel;
				callback(null);
			});
		};

		ops.add = function (callback) {
			api.file.addNewFileToUser({
				user : user,
				file : dataset
			}, callback);
		}

		async.series(ops, function (err, results) {
			if (err) return res.send(err);
			

			res.send(dataset);
		})
			// add to user
						
		// todo: check valid fields
		// todo: check if OK with missing .files etc.

		
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
			// console.log('file model created:', err, doc);
			if (err) console.log(err);
			callback(null, doc);
		});
	},

	// new: postgis file model
	_createModel : function (fileModel, callback) {
		var file = new File();
		for (var f in fileModel) {
			file[f] = fileModel[f];
			file.markModified(f);
		}
		file.save(callback);
	},


	_getFile : function (fileUuid, callback) {

	},

	// save file to project (file, layer, project id's)
	addToProject : function (file_id, projectUuid, callback) {

		Project
		.findOne({'uuid' : projectUuid })
		.exec(function (err, project) {
			if (err) return callback && callback(err);
			if (!project) return callback && callback('No project');

			project.files.push(file_id);			
			project.markModified('files');
			project.save(function (err) {
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

		var remoteUrl = 'http://grind:3004/';
		
		var sendOptions = {
			fileUuid : fileUuid,
			filename : layer.data.raster,
			uniqueIdentifier : uniqueIdentifier,
			sender_ssh : api.config.vile_grind.sender_ssh,
			sender_url : api.config.vile_grind.sender_url,
			api_hook : 'grind/raster/done',
		}


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

		// debug

		var cmd = 'tar -cf - -C ' + localFolder + ' ' + localFile + ' | pigz | ssh ' + remoteSSH + ' "pigz -d | tar xf - -C ' + remoteFolder + '"';

		var sendOptions = {
			fileUuid : fileUuid,
			uniqueIdentifier : uniqueIdentifier,
			sender_ssh : api.config.vile_grind.sender_ssh,
			sender_url : api.config.vile_grind.sender_url,
			api_hook : 'grind/done'
		}

		// send file over ssh
		// exec(cmd, function (err, stdout, stdin) {
			// if (err) console.log('err'.red, err);

			var remoteUrl = 'http://grind:3004/';

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
		// });

	},



	shareDataset : function (req, res, next) {
		var ops = [];
		var params = req.body || {};
		var user = req.user;
		var users = params.users;
		var file_id = params.dataset;
		var userModels = [];
		var foundFile;
		var file;
		var missingRequiredFields = [];

		if (!file_id) {
			missingRequiredFields.push('dataset');
		}

		if (!users) {
			missingRequiredFields.push('users');
		}

		if (!_.isEmpty(missingRequiredFields)) {
			return next(api.error.code.missingRequiredRequestFields(errors.missing_information.errorMessage, missingRequiredFields));
		}

		if (_.isEmpty(users)) {
			return next({
				message: errors.empty_users_array.errorMessage,
				code: httpStatus.BAD_REQUEST
			});
		}

		ops.push(function (callback) {
			File
			.findOne({uuid : file_id})
			.exec(function (err, f) {
				if (err) {
					return callback(err);
				}

				if (!f) {
					return callback({
						message: errors.no_such_file.errorMessage,
						code: httpStatus.NOT_FOUND
					});
				}

				file = f;
				callback(null);
			});
		});

		ops.push(function (callback) {
			User
			.findOne({uuid : user.uuid})
			.populate('files')
			.exec(callback);
		});


		ops.push(function (user, callback) {
				
			// check if file is on user
			foundFile = _.find(user.files, function (f) {
				return f.uuid == file_id;
			});

			// if no file, no access
			if (_.isEmpty(foundFile)) {
				return callback({
					message: errors.no_access.errorMessage,
					code: httpStatus.BAD_REQUEST
				});
			}

			// next
			callback(null);

		});

		ops.push(function (callback) {

			// get users
			async.each(users, function (user, done) {
				User
				.findOne({uuid : user})
				.exec(function (err, u) {
					if (err) {
						return done(err);
					}

					if (u) {
						userModels.push(u);
					}

					done(null);
				});
			}, callback);

		});

		ops.push(function (callback) {

			async.each(userModels, function (user, done) {

				// add dataset to user
				user.files.addToSet(file._id);
				user.markModified('files');
				user.save(function (err, u) {
					done(null);
				});
			
			}, callback);
		});


		async.waterfall(ops, function (err, results) {
			if (err) {
				return next(err);
			}

			// return success
			res.send({
				err : null,
				success : true,
				file_shared : {
					file_name : file.name,
					file_uuid : file.uuid
				},
				users_shared_with : users
			});
		});

	},
}