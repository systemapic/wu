// 
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
var kue 	= require('kue');
var dir 	= require('node-dir');
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

var ZipInfo = require('infozip');

// resumable.js
var r = require('../tools/resumable-node')('/data/tmp/');

// api
var api = module.parent.exports;

// exports
module.exports = api.upload = {
	/**
	 * Upload data to PostGIS with cUrl (API)
	 *
	 * @function api.upload.upload
	 * @param {object} req - Express Request object
	 * @param {object} res - Express Request object
	 * @returns {object} Success, errors and ID of upload
	 * @private
	 *
	 * @example
	 * // example curl usage for this endpoint ('/api/import') // todo: change to /api/upload
	 * curl --form "userUuid=loka" \
	 *      --form "meta=feta" \
	 *      --form "data=@/home/_testing/veryold/africa/africa.zip" \
	 *      --header "Authorization: Bearer [insert_access_token]" \
	 *      https://dev.systemapic.com/api/data/import
	 */
	upload : function (req, res) {
		if (!req.files || !req.files.data) return api.error.missingInformation(res, 'Missing file.');

		var files = req.files;
		var user = req.user;
		var response = {};

		// set upload status
		var uploadStatus = {
			file_id : 'file_' + api.utils.getRandomChars(20),
			user_id : user.uuid,
			filename : files.data.originalFilename,
			timestamp : Date.now(),
			status : 'Processing',
			size : files.data.size,
			upload_success : true,
			error_code : null,
			error_text : null
			// processing_success : null,
			// rows_count : null,
			// import_took_ms : null,
			// data_type : null,
			// original_format : null,
			// table_name : null,
			// database_name : null,
		};

		// set upload status
		var key = 'uploadStatus:' + uploadStatus.file_id;
		api.redis.layers.set(key, JSON.stringify(uploadStatus), function (err) {
			if (err) console.log('api.upload.upload done: ', err);
			res.send(uploadStatus);
		});
		
		var options = {
			files : req.files,
			user : req.user,
			uploadStatus : uploadStatus,
			body : req.body
		};

		api.import.import(options, function (err, results) {
			console.log('api.import.import done: ', err, results);
		});

	},

	/**
	 * Upload data to PostGIS with resumable.js  (client)
	 *
	 * @function api.upload.import
	 * @param {object} req - Express Request object
	 * @param {object} res - Express Request object
	 * @returns {object} Success, errors and ID of upload
	 * @private
	 *
	 */
	chunkedUpload : function (req, res) {
		var options 		 = req.body;
		var fileUuid 		 = options.fileUuid;
		var fileName 		 = fileUuid + '-' + options.resumableFilename;
		var outputPath 		 = '/data/tmp/' + fileName;
		var stream 		 = fs.createWriteStream(outputPath);
		var resumableChunkNumber = options.resumableChunkNumber;
		var resumableIdentifier  = options.resumableIdentifier;
		var resumableTotalChunks = options.resumableTotalChunks;
		var file_id 		 = null;
		var access_token 	 = options.access_token;
	    	var ops 		 = [];


	    	// get or create file_id
		ops.push(function (callback) {

			// check if upload_status exists
			var upload_file_id_key = 'upload_id:' + resumableIdentifier;
			api.redis.layers.get(upload_file_id_key, function (err, stored_file_id) {

				// got file_id
				if (stored_file_id) {
					file_id = stored_file_id;
					return callback(null);
				} 

				// create file_id and set upload_status
				var stored_file_id = 'file_' + api.utils.getRandomChars(20);
				return api.redis.layers.set(upload_file_id_key, stored_file_id, function (err) {
					file_id = stored_file_id;
					callback(null);
				});
			});
		});

	  
		ops.push(function (callback) {

			// resumable
			r.post(req, function(status, filename, original_filename, identifier){

				// set redis count id
				var redis_id = resumableIdentifier + file_id;

				// return status
				var returnStatus = (status == 'done' || status == 'partly_done') ? 200 : 308;
				res.status(returnStatus).send({file_id : file_id});

				// check chunk count
				api.upload._countChunks(options.resumableIdentifier, function (err, chunk_count) {

					// check if all done
					if (chunk_count != options.resumableTotalChunks) {
						return;
					}

					// import uploaded file
					api.upload._chunkedUploadDone({
						user 			: req.user,
						uniqueIdentifier 	: options.resumableIdentifier,
						outputPath 		: outputPath,
						body 			: req.body,
						fileName 		: options.resumableFilename,
						original_filename 	: filename,
						resumableTotalChunks 	: options.resumableTotalChunks,
						resumableIdentifier 	: options.resumableIdentifier,
						file_id 		: file_id,
						redis_id 		: redis_id,
						access_token 		: access_token
					});

					// release
					callback();
				});
			});
		});

		
		async.series(ops, function (err) {
			var upload_file_id_key = 'upload_id:' + resumableIdentifier;
		    	api.redis.layers.del(upload_file_id_key, function (err) {
		    		if (err) console.log(err);
		    	});
		});

	},

	_chunkedUploadDone : function (options, done) {
		var resumableTotalChunks = options.resumableTotalChunks;
		var uniqueIdentifier 	= options.uniqueIdentifier;
		var outputPath 		= options.outputPath;
		var original_filename 	= options.original_filename;
		var resumableIdentifier = options.resumableIdentifier;
		var user 		= options.user;
		var file_id 		= options.file_id;
		var tmpFolder 		= '/data/tmp/';
		var body 		= options.body;
		var ops 		= [];
		var redis_id 		= redis_id;
		var access_token 	= options.access_token;
		var globalUploadStatus;

		// merge chunks
		ops.push(function (callback) {
			var cmd = 'cat ';
			_.times(resumableTotalChunks, function (i) {
				var num = i + 1;
				cmd += '"' + tmpFolder + 'resumable-' + resumableIdentifier + '.' + num + '" ';
			});
			cmd += ' > "' + outputPath + '"';
			var exec = require('child_process').exec;
			exec(cmd, function (err) {
				if (err) return callback(err);
				fs.stat(outputPath, callback);
			});
		});

		// set uploadStatus
		ops.push(function (stats, callback) {

			// set upload status
			globalUploadStatus = {
				file_id : file_id,
				user_id : user.uuid,
				filename : original_filename,
				timestamp : Date.now(),
				status : 'Processing',
				size : stats.size,
				upload_success : true,
				error_code : null,
				error_text : null,
				processing_success : null,
				rows_count : null,
				import_took_ms : null,
				data_type : 'vector',
				original_format : null,
				table_name : null, 
				database_name : null,
				uniqueIdentifier : uniqueIdentifier,
				default_layer : null,
				default_layer_model : null
			};

			console.log('uploadStatus', globalUploadStatus);

			// save upload id to redis
			var key = 'uploadStatus:' + globalUploadStatus.file_id;
			api.redis.layers.set(key, JSON.stringify(globalUploadStatus), function (err) {
				if (err) return callback(err);
				callback(null, globalUploadStatus);
			});
		});
		
		ops.push(function (uploadStatus, callback) {

			var options = {
				files : {
					data : {
						path : outputPath,
						size : uploadStatus.size,
						originalFilename : original_filename
					}
				},
				user : user,
				uploadStatus : uploadStatus,
				body : body,
				access_token : access_token
			};

			// import file
			api.import.import(options, function (err, results) {

				// done
				callback(err);
			});

		});


		async.waterfall(ops, function (err, result) {
			
			// update status with error if any
			if (err) api.upload._setStatusError(globalUploadStatus, err);

			console.log('====================');
			console.log('Chunked upload done');
			console.log('err? ', err);
			console.log('result: ', result);
			console.log('====================');

			// clean up, remove chunks
			var removePath = '/data/tmp/resumable-' + uniqueIdentifier + '.*';
			fs.remove(removePath, console.log);
		});
		
	},

	_countChunks : function (uniqueIdentifier, done) {
		var chunk_path =  '/data/tmp/resumable-' + uniqueIdentifier + '.*';
		var glob = require("glob");

		// options is optional
		glob(chunk_path, {}, function (err, files) {
			done(null, files.length);
		});
	},

	_setStatusError : function (status, err) {
	
		// set error to upload status
		status.upload_success = false;
		status.status = 'Failed';
		status.error = true;
		status.error_text = err.message;
		status.error_code = err.code;
		status.processing_success = false;
		status.error_debug = 'api.upload._chunkedUploadDone';

		// save upload status
		var key = 'uploadStatus:' + status.file_id;
		api.redis.layers.set(key, JSON.stringify(status), function (err) {
			console.log('error saved to uploadstatus');
		});
	},

	_notifyProcessingDone : function (options) {
		api.socket.processingDone(options);
	},


	// after upload, calling this to get results
	getUpload : function (req, res, next) {
		var query = req.query || {};
		var file_id = query.fileUuid || query.file_id;
		var ops = [];

		// check for missing info
		if (!file_id) {
			return next(api.error.code.missingRequiredRequestFields(errors.missing_information.errorMessage, ['file_id']));
		}

		var key = 'uploadStatus:' + file_id;
		api.redis.layers.get(key, function (err, uploadStatus) {
			if (err) {
				return next(err);
			}

			var status = JSON.parse(uploadStatus);

			if (!status) {
				return next({
					message: errors.no_such_upload_status_id.errorMessage,
					code: httpStatus.NOT_FOUND
				});
			}

			var layer_id = status.default_layer_model;
			
			var ops = {};

			ops.file = function (callback) {
				// get file
				File
				.findOne({uuid : file_id})
				.exec(function (err, file) {
					if (err) {
						err.message = 'find file error';
						return callback(err);
					}
					
					callback(null, file);
				});

			};

			ops.layer = function (callback) {
				Layer
				.findOne({uuid : layer_id})
				.exec(function (err, layer) {
					if (err) {
						err.message = 'find layer error';
						return callback(err);
					}

					callback(null, layer);
				});
			};

			ops.project = function (callback) {
				callback(null, status.added_to_project);
			};

			async.parallel(ops, function (err, result) {
				if (err) {
					next(err);
				}

				res.send(result);
			});

		});
		
	},


	_createFileModel : function (file_id, done) {

		// get info from uploadStatus // todo: too much of a shortcut?
		var file_id_key = 'uploadStatus:' + file_id;
		api.redis.layers.get(file_id_key, function (err, uploadStatus) {
			var u = JSON.parse(uploadStatus);

			var cleanName = fspath.basename(u.filename, fspath.extname(u.filename));
			var fileModel = {
				uuid : file_id,
				createdBy : u.user_id,
				name : cleanName,
				originalName : u.filename,
				dataSize : u.size
			};

			if (u.data_type == 'vector') {
				fileModel.type = 'postgis';
				fileModel.data = {
					postgis : {
						database_name 	: u.database_name,
						table_name 	: u.table_name,
						data_type 	: u.data_type,
						original_format : u.original_format
					}
				};
			} else {
				fileModel.type = 'raster';
				fileModel.data = {
					raster : {
						file_id : file_id
					}
				};
			}

			// create file model
			api.file._createModel(fileModel, done);	
		});
	},

	_getUploadStatus : function (file_id, callback) {
		var file_id_key = 'uploadStatus:' + file_id;
		api.redis.layers.get(file_id_key, function (err, uploadStatusJSON) {
			if (err) return callback && callback(err);

			// add keys
			var uploadStatus = JSON.parse(uploadStatusJSON);

			callback(null, uploadStatus);
		});
	},

	updateStatus : function (file_id, status, callback) {
		
		var file_id_key = 'uploadStatus:' + file_id;
		api.redis.layers.get(file_id_key, function (err, uploadStatusJSON) {
			if (err) return callback && callback(err);

			// add keys
			var uploadStatus = JSON.parse(uploadStatusJSON);
			for (var s in status) {
				if (s != 'expire') uploadStatus[s] = status[s]; // set status (except ttl)
			}

			// save upload status
			api.redis.layers.set(file_id_key, JSON.stringify(uploadStatus), function (err) {

				// return
				callback && callback(err);
			});
		});
	},

	// gets queried from pile.js
	getUploadStatus : function (req, res) {
		console.log('getupload', file_id);
		var file_id = req.query.file_id,
		    file_id_key = 'uploadStatus:' + file_id;

		api.redis.layers.get(file_id_key, function (err, uploadStatus) {
			if (err) return api.error.general(req, res, err);
			console.log('upst', uploadStatus);
			// return upload status
			res.end(uploadStatus || JSON.stringify({ error : 'Upload ID not found or expired.'}));
		});
	},

	untar : function (options, done) {
		var tarfile = options.files.data.path,
		    extractPath = '/data/tmp/' + options.file_id,
		    exec = require('child_process').exec,
		    cmd = 'tar xzf "' + tarfile + '" -C "' + extractPath + '"';
			
		// create file_id temp dir
		fs.ensureDir(extractPath, function (err) {
			if (err) return done(err);

			// untar
			exec(cmd, function (err, stdout, stdin) {
				if (err) return done(err);
				
				// get list of filepaths
				dir.files(extractPath, done);
			});
		});
	},

	// returns array of filepaths
	unzip : function (options, done) {
		var temporaryPath = options.files.data.path,
		    zip = new ZipInfo(temporaryPath),
		    extractPath = '/data/tmp/' + options.file_id;
		
		// unzip
		zip.extractTo(extractPath, ['*'], {junkPaths : true}, function (err) {
			if (err) return done(err);

			// get list of filepaths
			dir.files(extractPath, done);
		});
	},

	// debug: delete all done-chunks
	_deleteDoneChunks : function () {
		api.redis.temp.keys('done-chunk*', function(err, rows) {
			rows.forEach(function (row) {
				if (row) api.redis.temp.del(row);
			});
		});
	},

	chunkedCheck : function (req, res) {
		r.get(req, function(status, filename, original_filename, identifier){
			res.send((status == 'found' ? 200 : 201), status);
		});
	},

	chunkedIdent : function (req, res) {
		r.write(req.params.identifier, res);
	},


	projectLogo : function (req, res, next) {
		var options = req.body || {};
		var imageUuid = options.image_id;
		var tmpFolder = '/data/tmp/';
		var resumableIdentifier = options.resumableIdentifier;
		var missingRequiredRequestFields = [];

		if (!imageUuid) {
			missingRequiredRequestFields.push('image_id');
		}

		if (!resumableIdentifier) {
			missingRequiredRequestFields.push('resumableIdentifier');
		}

		if (!_.isEmpty(missingRequiredRequestFields)) {
			return next(api.error.code.missingRequiredRequestFields(errors.missing_information.errorMessage, missingRequiredRequestFields));
		}

		// resumable
		r.post(req, function(status, filename, original_filename, identifier){

			// register chunk done in redis
			if (status == 'done') {

				var from = tmpFolder + 'resumable-' + resumableIdentifier + '.' + 1,
				    file = imageUuid,
				    to = api.config.path.image + file;

				// rename and move to image folder
				fs.copy(from, to, function (err) {
					if (err) return api.error.general(req, res, err);
					res.end(file);	// file will be saved by client
				});
			}
		});
	},


	clientLogo : function (req, res) {
	    	var options = req.body,
		    imageUuid = options.imageUuid,
		    tmpFolder = '/data/tmp/',
		    resumableIdentifier = options.resumableIdentifier;

		// resumable		
		r.post(req, function(status, filename, original_filename, identifier){

			// register chunk done in redis
			if (status == 'done') {

				var from = tmpFolder + 'resumable-' + resumableIdentifier + '.' + 1,
				    file = imageUuid,
				    to = api.config.path.image + file;

				// rename and move to image folder
				fs.copy(from, to, function (err) {
					if (err) return api.error.general(req, res, err);
					res.end(file);	// file will be saved by client
				});
			}
		});
	},
	

	image : function (req, res) {

		// process from-encoded upload
		var form = new formidable.IncomingForm({
			hash : 'sha1',
			multiples : true,
			keepExtensions : true
		});

		form.parse(req, function(err, fields, files) {	
			if (err) console.log('ERR 7'.red, err);
			if (err || !files || !files.file) return api.error.general(req, res, err || 'No files3.');

			var from = files.file.path,
			    file = 'image-' + uuid.v4(),
			    to   = api.config.path.image + file;
			
			// rename and move to image folder
			fs.rename(from, to, function (err) {
				if (err) console.log('ERR 8'.red, err);

				if (err) return api.error.general(req, res, err);
				res.end(file);	// file will be saved by client
			});		
	 	});

	},


	getExtension : function (name) {
		try {
			var arr = name.split('.').reverse();
			var ext = arr[0];
			return ext;
		} catch (e) {
			return false
		}
	},

	getOriginalName : function (name) {
		try {
			var arr = name.split('.').reverse();
			var ext = arr[0];
			arr.splice(0,1);
			var originalName = arr.reverse().join('');
			return originalName;
		} catch (e) {
			return false
		}
	},

	getFileType : function (name) {
		// console.log('name'.yellow, name);
		if (!name) return ['unknown', 'unknown'];

		// check if folder
		var isFolder = fs.statSync(name).isDirectory();
		if (isFolder) return ['folder', 'folder'];

		// archives
		if (name.slice(-7) == '.tar.gz')  return ['tar', 'application/x-gzip'];
		if (name.slice(-4) == '.zip') 	  return ['zip', 'application/zip'];

		// layers
		if (name.slice(-8) == '.geojson') return ['geojson', 'application/octet-stream'];
		if (name.slice(-5) == '.json') 	  return ['json',    'application/octet-stream'];
		if (name.slice(-9) == '.topojson')return ['topojson','application/octet-stream'];
		// if (name.slice(-4) == '.svg') 	  return ['svg',     'layer'];
		// if (name.slice(-4) == '.kml') 	  return ['kml',     'layer'];

		// images
		if (name.slice(-5) == '.jpeg') 	  return ['jpg',  'image/jpeg'];
		if (name.slice(-4) == '.jpg') 	  return ['jpg',  'image/jpeg'];
		if (name.slice(-4) == '.png') 	  return ['png',  'image/png'];
		
		// raster
		if (name.slice(-4) == '.tif') 	  return ['tif',  'raster/tif'];
		if (name.slice(-5) == '.tiff') 	  return ['tif',  'raster/tif'];
		if (name.slice(-4) == '.jp2') 	  return ['jp2',  'raster/jp2'];
		if (name.slice(-4) == '.ecw') 	  return ['ecw',  'raster/ecw'];
		if (name.slice(-7) == '.sqlite')  return ['sqlite',  'raster/sqlite'];
	
		// docs
		if (name.slice(-4) == '.pdf') 	  return ['pdf',  'application/pdf'];
		if (name.slice(-4) == '.doc') 	  return ['doc',  'application/msword']; 
		if (name.slice(-5) == '.docx') 	  return ['docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
		if (name.slice(-4) == '.txt') 	  return ['txt',  'text/plain'];

		// shapefile parts
		if (name.slice('-4') == '.shp')   return ['shp', 'shapefile'];
		var mandatory = ['.shp', '.shx', '.dbf', '.prj'];
		var optional = ['.sbn', '.sbx', '.fbn', '.fbx', '.ain', '.aih', '.ixs', '.mxs', '.atx', '.shp.xml', '.cpg'];
		if (mandatory.indexOf(name.slice(-4)) > -1) return ['shape', 'partialshape'];
		if (optional.indexOf(name.slice(-4)) > -1)  return ['shape', 'partialshape'];

		// unknown
		return ['unknown', 'unknown'];
	}

};