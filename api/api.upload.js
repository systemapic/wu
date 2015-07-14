//API: api.upload.js

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

var ZipInfo = require('infozip');

// resumable.js
var r = require('../tools/resumable-node')('/data/tmp/');

// api
var api = module.parent.exports;

// exports
module.exports = api.upload = { 

	/**
	 * Import data to PostGIS
	 *
	 * @function api.upload.import
	 * @param {object} req - Express Request object
	 * @param {object} res - Express Request object
	 * @returns {object} Success, errors and ID of upload
	 *
	 * @example
	 * // example curl usage for this endpoint ('/api/data/import')
	 * curl --form "userUuid=loka" \
	 *      --form "meta=feta" \
	 *      --form "data=@/home/_testing/veryold/africa/africa.zip" \
	 *      --header "Authorization: Bearer [insert_access_token]" \
	 *      https://dev.systemapic.com/api/data/import
	 */
	import : function (req, res) {

		// set upload status
		var uploadStatus = {
			upload_id : api.utils.getRandomChars(16), // create upload id
			user_id : req.user.uuid,
			filename : req.files.data.originalFilename,
			timestamp : Date.now(),
			status : 'Processing',
			size : req.files.data.size,
			upload_success : true,
			processing_success : null,
			error_code : null,
			error_text : null,
			rows_count : null,
			import_took_ms : null,
			data_type : null,
			original_format : null,
			table_name : null, 
			database_name : null
		}

		// return id of upload to client
		res.end(JSON.stringify(uploadStatus));
		
		var ops = [];

		// save upload status
		ops.push(function (callback) {

			// save upload id to redis
			var key = 'uploadStatus:' + uploadStatus.upload_id;
			api.redis.set(key, JSON.stringify(uploadStatus), callback);
		});

		// import data
		ops.push(function (callback) {

			// import options
			var options = {
				upload_id : uploadStatus.upload_id,
				files : req.files,
				options : req.body,
				user : req.user,
				timestamp : uploadStatus.timestamp
			}

			// process upload
			api.upload.prepareImport(options, function (err, opts) {
				if (err) return callback(err);

				// postgis import
				api.postgis.import(opts, callback);
			});
		});

		// run ops
		async.series(ops, function (err, results) {
			// if err, set upload status, return
			if (err) return api.upload.updateStatus(uploadStatus.upload_id, { // todo: more specific error reporting
				error_code : 1, 
				error_text : err,
				status : 'Failed'
			});

			// set upload status, expire in one day
			api.upload.updateStatus(uploadStatus.upload_id, {
				processing_success : true,
				status : 'Done', 
				expire : 3600 * 24
			}, function (err) {

				console.log('api.upload.import DONE!', results);

				// create a file object 
				api.upload._createFileModel(uploadStatus.upload_id, function (err, fileModel) {
					console.log('api.upload.import > created filemode', err, fileModel);

				});
			
			});

			
		});	
		
	},

	_createFileModel : function (upload_id, done) {
		console.log('############################ createFileModel (api.upload) ###################');
		console.log('############################ createFileModel (api.upload) ###################');
		console.log('############################ createFileModel (api.upload) ###################');

		var upload_id_key = 'uploadStatus:' + upload_id;
		api.redis.get(upload_id_key, function (err, uploadStatus) {
			var u = JSON.parse(uploadStatus);
			console.log('REDISREDISREID _______________________ err, u', err, u);

			var fileModel = {
				uuid : 'file-' + uuid.v4(),
				createdBy : u.user_id,
				name : u.filename,
				type : 'postgis',
				dataSize : u.size,
				data : {
					postgis : {
						database_name : u.database_name,
						table_name : u.table_name,
						data_type : u.data_type,
						original_format : u.original_format
					}
				}
			}

			api.file._createModel(fileModel, function (err, file) {
				done(err, file);
			});	

		});
	},

	updateStatus : function (upload_id, status, callback, expire) {
		
		var upload_id_key = 'uploadStatus:' + upload_id;

		// update upload status, one key at a time if necessary
		api.redis.get(upload_id_key, function (err, uploadStatusJSON) {
			if (err) return callback && callback(err);

			// add keys
			var uploadStatus = JSON.parse(uploadStatusJSON);
			for (s in status) {
				if (s != 'expire') uploadStatus[s] = status[s]; // set status (except ttl)
			};

			// save upload status
			api.redis.set(upload_id_key, JSON.stringify(uploadStatus), function (err) {

				// expire if set
				if (status.expire) api.redis.expire(upload_id_key, status.expire);
				
				// return
				callback && callback(err);
			});
		});
	},


	getUploadStatus : function (req, res) {
		var upload_id = req.query.upload_id,
		    upload_id_key = 'uploadStatus:' + upload_id;

		api.redis.get(upload_id_key, function (err, uploadStatus) {
			if (err) return api.error.general(req, res, err);

			// return upload status
			res.end(uploadStatus || JSON.stringify({ error : 'Upload ID not found or expired.'}));
		});
	},


	/**
	 * Prepare upload before organizing (unzip, etc.)
	 *
	 * @private
	 *
	 * @function api.upload.organizeImport
	 * @param {object} options - Options object containing uploadID, user, req.body, req.files
	 * @returns null
	 */
	prepareImport : function (options, done) {

		var files = options.files, // get files object
		    temporaryPath = files.data.path, // get path
		    ext = temporaryPath.split('.').reverse()[0].trim(), // get file extension
		    ops = [];

		// set original filename + size
		options.size = files.data.size;
		options.originalFilename = files.data.originalFilename;

		// organize files so output is equal no matter what :)
		if (ext == 'zip') ops.push(function (callback) {
			api.upload.unzip(options, function (err, files) {
				options.files = files;
				callback(err);
			});
		});

		if (ext == 'gz') ops.push(function (callback) {
			api.upload.untar(options, function (err, files) {
				options.files = files;
				callback(err);
			});
		});

		if (ext == 'geojson') ops.push(function (callback) {
			options.files = [temporaryPath];
			callback(null);
		});

		if (ext == 'tif') ops.push(function (callback) {
			options.files = [temporaryPath];
			callback(null);
		});

		if (ext == 'tiff') ops.push(function (callback) {
			options.files = [temporaryPath];
			callback(null);
		});

		if (ext == 'ecw') ops.push(function (callback) {
			options.files = [temporaryPath];
			callback(null);
		});

		if (ext == 'jp2') ops.push(function (callback) {
			options.files = [temporaryPath];
			callback(null);
		});

		// run ops
		async.series(ops, function (err) {
			if (err) console.log('api.upload.prepareImport err 3', err);
			done(err, options);
		});

	},


	organizeImport : function (options, done) { 	// todo: remove perhaps

		// import to postgis
		api.postgis.import(options, done);
	},


	untar : function (options, done) {
		var tarfile = options.files.data.path,
		    extractPath = '/data/tmp/' + options.upload_id,
		    exec = require('child_process').exec,
		    cmd = 'tar xzf "' + tarfile + '" -C "' + extractPath + '"';
			
		// create upload_id temp dir
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
		    extractPath = '/data/tmp/' + options.upload_id;
		
		// unzip
		zip.extractTo(extractPath, ['*'], {junkPaths : true}, function (err) {
			if (err) return done(err);

			// get list of filepaths
			dir.files(extractPath, done);
		});
	},




























	chunkedUpload : function (req, res) {
	    	var options = req.body,
		    fileUuid = options.fileUuid,
		    projectUuid = options.projectUuid,
		    fileName = fileUuid + '-' + options.resumableFilename,
		    outputPath = '/data/tmp/' + fileName,
		    stream = fs.createWriteStream(outputPath),
		    resumableChunkNumber = options.resumableChunkNumber,
		    resumableIdentifier = options.resumableIdentifier,
	    	    resumableTotalChunks = options.resumableTotalChunks;

		console.log('Uploading', resumableChunkNumber, 'of', resumableTotalChunks, 'chunks to ', outputPath);
		// console.log('## RESUMABLE ##'.green, options);

		// resumable		
		r.post(req, function(status, filename, original_filename, identifier){

			// return status
			res.status(status).send({});

			// register chunk done in redis
			if (status == 'done' || status == 'partly_done') api.redis.incr('done-chunks-' + resumableIdentifier);

			// check if all done
			api.redis.get('done-chunks-' + resumableIdentifier, function (err, count) {
				// console.log('Chunk #'.yellow, count, err);

				// return if not all done				
				if (count != options.resumableTotalChunks) {
					console.log('COUNT != CHUNKS');
					return;
				} 
				// import uploaded file
				api.upload._chunkedUploadDone({
					user : req.user,
					uniqueIdentifier : options.resumableIdentifier,
					outputPath : outputPath,
					fileName : options.resumableFilename,
					projectUuid : projectUuid,
					fileUuid : fileUuid,
					resumableTotalChunks : options.resumableTotalChunks,
					resumableIdentifier : options.resumableIdentifier
				});
			});
		});
	},

	_chunkedUploadDone : function (options) {
		var resumableTotalChunks = options.resumableTotalChunks,
		    uniqueIdentifier = options.uniqueIdentifier,
		    outputPath = options.outputPath,
		    resumableIdentifier = options.resumableIdentifier,
		    user = options.user,
		    tmpFolder = '/data/tmp/',
		    ops = [];

		// merge chunks
		ops.push(function (callback) {

			var cmd = 'cat ';

			_.times(resumableTotalChunks, function (i) {
				var num = i + 1;
				cmd += '"' + tmpFolder + 'resumable-' + resumableIdentifier + '.' + num + '" ';
			});

			cmd += ' > "' + outputPath + '"';

			var exec = require('child_process').exec;
			exec(cmd, function (err, stdout, stdin) {
				if (err) console.log('err'.red, err);

				// console.log('catted file: '.green, outputPath);
				fs.stat(outputPath, callback);
			});

		});

		// import file
		ops.push(function (stats, callback) {
			
			var fileOptions = {
				path : options.outputPath,
				size : stats.size,
				name : options.fileName,
				uniqueIdentifier : uniqueIdentifier
			}

			// import file
			api.upload.importFile(fileOptions, options, callback);
		});


		async.waterfall(ops, function (err, result) {

			// ping client
			api.socket.uploadDone({
				result : result,
				user : options.user,
				loka : 'loka'
			});

			// clean up, remove chunks
			var removePath = '/data/tmp/resumable-' + uniqueIdentifier + '.*';
			fs.remove(removePath, console.log);

			// clean up redis count
			api.redis.del('done-chunks-' + uniqueIdentifier);

		});
		
	},

	// debug: delete all done-chunks
	_deleteDoneChunks : function () {
		api.redis.keys('done-chunk*', function(err, rows) {
			rows.forEach(function (row) {
				if (row) api.redis.del(row);
				// console.log('deleted row'.red, row);
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

	// entry point
	importFile : function (incomingFile, options, done) {
		var user = options.user,
		    projectUuid = options.projectUuid,
		    fileArray = [incomingFile],
		    ops = [];

		// console.log('implortFile'.green, incomingFile, options);

		// sort files
		ops.push(function (callback) {

			// quick sort
			api.upload.sortFormFiles(fileArray, options, function (err, results) {
				if (err) console.log('ERR 18'.red, err);
				if (err || !results) return callback(err || 'There were no valid files in the upload.');

				callback(null, results);
			});
		});

		// register files in mongo and to project
		ops.push(function (entriesArray, callback) {
			if (!entriesArray) return callback('Nothing to do.');

			var options = {
				entriesArray : entriesArray,
				userUuid : user.uuid,
				userFullName :  user.firstName + ' ' + user.lastName,
				projectUuid : projectUuid
			}

			// register files in mongo and to project
			api.upload._registerFiles(options, function (err, results) {
				if (err) console.log('ERR 17'.red, err);
				callback(err, results);
			});
		});
		

		async.waterfall(ops, function (err, results) {
			if (err) console.log('ERR 2'.red, err);
			if (err || !results || !results.length) return api.error.generalSocket(user, err || 'There were no valid files in the upload.');

			// organize in sidepane.dataLibrary format
			var files = [],
			    layers = [];

			results && results.forEach(function (r) {
				r.file && files.push(r.file);
				r.layer && layers.push(r.layer);
			});

			var pack = {
				files : files,
				layers : layers,
				error : err,
				uniqueIdentifier : options.uniqueIdentifier
			}

			var opts = {
				pack : pack,
				user : user,
				size : incomingFile.size,
				uniqueIdentifier : options.uniqueIdentifier
			}

			// only process geojson
			opts.isGeojson = _.find(layers, function (l) {
				return l.data.geojson;
			});

			// only process geojson
			opts.isRaster = _.find(layers, function (l) {
				return l.data.raster;
			});


			// if (opts.isGeojson || opts.isRaster) api.file._sendToProcessing(opts, function (err, result) { // todo: do per file

			// 	// done processing
			// });

			done(null, pack);

		});
	},

	
	_registerFiles : function (options, done) {
		var entriesArray = options.entriesArray,
		    userFullName = options.userFullName,
		    userUuid = options.userUuid,
		    entries = _.flatten(entriesArray),
		    projectUuid = options.projectUuid,
		    ops = [];


		entries.forEach(function (entry) {

			console.log('>>> entries for each >>>'.red, entry.file);

			// set meta
			entry.uuid = entry.file; 
			entry.createdBy = userUuid;
			entry.createdByName = userFullName;

			// create entry for file
			ops.push(function (callback) {
				api.file.createModel(entry, function (err, doc) {
					if (err) console.log('ERR 21'.red, err);
					callback(err, { file : doc });
				});
			});

			if (entry.type != 'Layer') return;

			// create entry for layer
			ops.push(function (callback) {
				entry.uuid = 'layer-' + uuid.v4();
				api.layer.createModel(entry, function (err, doc) {
					if (err) console.log('ERR 20'.red, err);
					callback(err, { layer : doc });
				});
			});
		});


		// async
		async.series(ops, function (err, docs) {
			if (err) console.log('_registerFiles err: '.red + err);
			if (err) console.log('ERR 19'.red, err);
			if (err || !docs || !_.isArray(docs)) return done(err || 'No docs.');

			// console.log('DOCDOCDOC', docs);

			// add files/layers to project
			_.each(docs, function (doc) {

				if (doc.file) api.file.addToProject(doc.file._id, projectUuid);
				if (doc.layer) api.layer.addToProject(doc.layer._id, projectUuid);
			});

			done(null, docs);
		});

	},


	sortFormFiles : function (fileArray, opts, done) {

		// quick sort
		var ops = [];
		fileArray.forEach(function (file) {

			// each file uuid
			var fileUuid = 'file-' + uuid.v4();

			// type and extension
			var filetype 	= api.upload.getFileType(file.path);
			var extension 	= filetype[0];
			var type 	= filetype[1];

			var options = {
				path : file.path,
				fileUuid : fileUuid,
				name : file.name,
				type : file.type,
				extension : extension,
				currentFolder : null,
				user : opts.user
			}

			// add async ops
			ops = api.upload._sortOps(ops, options);
		});

		async.series(ops, function (err, dbs) {
			if (err) console.log('ERR 22'.red, err);
			done && done(err, dbs);
		});
	},


	sortZipFolder : function (options, done) {

		// could be images, docs, etc
		// could be shapefiles/geojson
		// could be several

		var fileUuid 	= options.fileUuid;
		var folder 	= options.folder;

		// var currentFolder = options.currentFolder || FILEFOLDER + fileUuid;
		var currentFolder = options.currentFolder || api.config.path.file + fileUuid;

		if (folder) {
			currentFolder += '/' + folder;
		}

		var ops1 = [];

		// console.log('SORTZIPFOLDER!!'.green, options);
		// console.log('currentfolder: '.green, currentFolder);

		// read files in folder
		fs.readdir(currentFolder, function (err, files) {
			if (err) console.log('ERR 23'.red, err);
			if (err || !files) return callback(err || 'No files7.');

			_.each(files, function (name) { 	// 'Africa.shp'

				var path 	= currentFolder + '/' + name; // path 
				var filetype 	= api.upload.getFileType(path);
				var extension 	= filetype[0];
				var type 	= filetype[1];

				var options = {
					path : path,
					fileUuid : fileUuid,
					name : name,
					type : type,
					extension : extension,
					currentFolder : currentFolder
				}

				// dont do zip within zip!!
				if (extension == 'zip') {
					var message = 'The file ' + options.name + ' was rejected. Please upload only one set of files within a zipped archive.';
					done(message);
					return false;
				}
				
				// handle folder
				if (options.type == 'folder') {
					done("Upload rejected. Please don't include folders inside zipped archives.");
					return false;
				}
				
				// handle shapefiles
				if (extension == 'shp') {
							// gotchas: already in file-uuid folder, cause unzip

					ops1.push(function (callback) {

						// process shapefile (convert, store, vectorize, etc.)
						api.file.handleShapefile(options.currentFolder, options.name, options.fileUuid, function (err, db) {
							if (err) {
								console.log('ERR 29'.red, err);
								api.error.log(err);
								return callback('Unable to handle shapefile format properly. Please see #error-log for details.')
							}

							// populate db entry
							db = db || {};
							db.name = options.name;
							db.type = 'Layer';

							// return db
							callback(null, db);
						});
					});
				}

				if (extension == 'geojson') {

					ops1.push(function (callback) {

						// processes geojson, puts file in folder
						api.file.handleJson(options.path, options.name, options.extension, options.fileUuid, function (err, db) {
							if (err) {
								console.log('ERR 301'.red, err);
								api.error.log(err);
								return callback('Unable to handle geojson format properly. Please see #error-log for details.')
							}
							
							// populate db entry
							db = db || {};
							db.name = options.name;
							db.file = options.fileUuid;
							db.type = 'Layer';
							db.files = [options.name];

							// return db
							callback(null, db);
						});
					});
				}




				// handle images
				if (extension == 'jpg' || extension == 'tiff' || extension == 'png' || extension == 'jpeg') {

					ops1.push(function (callback) {

						// puts file in folder
						api.file.handleImage(options.path, options.name, options.fileUuid, function (err, db) {
							if (err) {
								console.log('ERR 30'.red, err);
								api.error.log(err);
								return callback('Unable to handle image format properly. Please see #error-log for details.')
							}

							// populate db entry
							db = db || {};
							db.name = options.name;
							db.file = options.fileUuid;
							db.type = 'image';
							db.files = [options.name];

							// return db
							callback(null, db);
						});
					});
				}

			
				if (extension == 'tif' || extension == 'ecw' || extension == 'jp2') {

					ops1.push(function (callback) {

						api.geo.handleRaster(options, function (err, db) {
							if (err) {
								console.log('ERR 944'.red, err);
								api.error.log(err);
								return callback('Unable to handle raster format properly. Please see #error-log for details.')
							}

							// populate db entry
							db = db || {};
							db.name = options.name;
							db.file = options.fileUuid;
							db.type = 'Layer';
							db.files = [options.name];
							db.data = {};
							db.data.raster = options.name;

							callback(null, db);
						});


					});

				}
				
				
				if (extension == 'doc' || extension == 'pdf' || extension == 'docx' || extension == 'txt') {

					ops1.push(function (callback) {

						// puts file in folder
						api.file.handleDocument(options.path, options.name, options.fileUuid, function (err, db) {
							if (err) {
								console.log('ERR 32'.red, err);
								api.error.log(err);
								return callback('Unable to handle document format properly. Please see #error-log for details.')
							}

							// populate db entry
							db = db || {};
							db.name = options.name;
							db.file = options.fileUuid;
							db.type = 'document';
							db.files = [options.name];

							// return db
							callback(null, db);

						});
					});
				}
			});

			// run ops
			async.series(ops1, function (err, dbs) {
				if (err) console.log('ERR 33'.red, err);
				done && done(err, dbs);
			});
		});
	},



	_sortOps : function (ops, options) {

		var ext = options.extension;

		// console.log('_soprOp'.green, ops, options);

		// handle folder
		if (options.type == 'folder') {

			ops.push(function (callback) {

				var opt = {
					fileUuid : options.fileUuid,
					folder : options.name,
					currentFolder : options.currentFolder
				}

				api.upload.sortZipFolder(opt, function (err, dbs) {	// gets [db]
					if (err) {
						console.log('ERR 30'.red, err);
						api.error.log(err);
						return callback('Unable to handle zip format properly. Please see #error-log for details.')
					}
					callback(null, dbs);
				});
			});
		}

		
		
		// handle zip
		if (ext == 'zip') {

			ops.push(function (callback) {

				var opt = {
					inn : options.path,
					fileUuid : options.fileUuid,
					out : ''
				}

				// console.log('zip!'.green);

				// unzips files to folder
				api.file.handleZip(opt, function (err) {
					if (err) console.log('ERR 34'.red, err);
					if (err) return callback(err);

					var opt = {
						fileUuid : options.fileUuid,
						folder : null
					}

					api.upload.sortZipFolder(opt, function (err, dbs) {	// gets [db]
						if (err) console.log('ERR 35'.red, err);
						if (err) return callback(err);
						
						callback(err, dbs);
					});
				});
			});
		}


		// handle tar.gz
		if (ext == 'gz' || ext == 'tar.gz') {
			ops.push(function (callback) {

				// untars files to folder
				api.file.handleTar(options.path, options.fileUuid, function (err) {
					if (err) console.log('ERR 38'.red, err);
					if (err) return callback(err);

					var opt = {
						fileUuid : options.fileUuid,
						folder : null
					}
					
					api.upload.sortZipFolder(opt, function (err, dbs) {
						if (err) console.log('ERR 39'.red, err);
						if (err) return callback(err);
						callback(null, dbs);
					});
				});
			});
		}



		// handle shapefiles
		if (ext == 'shp') {
			ops.push(function (callback) {

				// process shapefile (convert, store, vectorize, etc.)
				// api.file.handleShapefile(options.currentFolder, options.name, options.fileUuid, function (err, db) {
				api.postgis.importShapefile(options, function (err, db) {

				// })
				// api.file.handleShapefile(options, function (err, db) {
					if (err) console.log('ERR 40'.red, err);
					if (err) console.log('### SORTOPS HANDLESHAPEFILE ERR'.red, err);
					if (err) return callback(err);

					// populate db entry
					db = db || {};
					db.name = options.name;
					db.type = 'Layer';

					// return db
					callback(null, db);
				});
			});
		}


		// handle images
		if (ext == 'jpg' || ext == 'png' || ext == 'jpeg') {
			ops.push(function (callback) {

				// puts file in folder
				api.file.handleImage(options.path, options.name, options.fileUuid, function (err, db) {
					if (err) console.log('ERR 41'.red, err);
					if (err) return callback(err);

					// populate db entry
					db = db || {};
					db.name = options.name;
					db.file = options.fileUuid;
					db.type = 'image';
					db.files = [options.name];

					// return db
					callback(null, db);
				});
			});
		}

		if (ext == 'tif' || ext == 'ecw' || ext == 'jp2') {

			ops.push(function (callback) {

				api.geo.handleRaster(options, function (err, db) {
					if (err) {
						console.log('ERR 98:'.red, err);
						return callback(err);
					}

					// populate db entry
					db = db || {};
					db.name = options.name;
					db.file = options.fileUuid;
					db.type = 'Layer';
					db.files = [options.name];
					db.data = {};
					db.data.raster = options.name;

					callback(null, db);
				});


			});

		}

		// if (ext == 'ecw') {

		// 	ops.push(function (callback) {

		// 		api.geo.handleRaster(options, function (err, db) {
		// 			if (err) {
		// 				console.log('ERR 98:'.red, err);
		// 				return callback(err);
		// 			}

		// 			// populate db entry
		// 			db = db || {};
		// 			db.name = options.name;
		// 			db.file = options.fileUuid;
		// 			db.type = 'Layer';
		// 			db.files = [options.name];
		// 			db.data = {};
		// 			db.data.raster = options.name;

		// 			callback(null, db);
		// 		});


		// 	});

		// }

		// if (ext == 'jp2') {

		// 	ops.push(function (callback) {

		// 		api.geo.handleRaster(options, function (err, db) {
		// 			if (err) {
		// 				console.log('ERR 98:'.red, err);
		// 				return callback(err);
		// 			}

		// 			// populate db entry
		// 			db = db || {};
		// 			db.name = options.name;
		// 			db.file = options.fileUuid;
		// 			db.type = 'Layer';
		// 			db.files = [options.name];
		// 			db.data = {};
		// 			db.data.raster = options.name;

		// 			callback(null, db);
		// 		});

		// 	});

		// }


		if (ext == 'geojson') {
			ops.push(function (callback) {

				// processes geojson, puts file in folder
				api.file.handleJson(options.path, options.name, options.extension, options.fileUuid, function (err, db) {
					if (err) console.log('ERR 42'.red, err);
					if (err) console.log('### SORTOPS HANDLEjson ERR'.red, err);
					if (err) return callback(err);
					
					// populate db entry
					db = db || {};
					db.name = options.name;
					db.file = options.fileUuid;
					db.type = 'Layer';
					db.files = [options.name];

					// return db
					callback(null, db);
				
				});
			});
		}


		if (ext == 'doc' || ext == 'pdf' || ext == 'docx' || ext == 'txt') {
			ops.push(function (callback) {

				// puts file in folder
				api.file.handleDocument(options.path, options.name, options.fileUuid, function (err, db) {
					if (err) console.log('ERR 43'.red, err);
					if (err) return callback(err);

					// populate db entry
					db = db || {};
					db.name = options.name;
					db.file = options.fileUuid;
					db.type = 'document';
					db.files = [options.name];

					// return db
					callback(null, db);
				});
			});
		}

		return ops;
	},


	projectLogo : function (req, res) {
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
	// clientLogo : function (req, res) {
		
	// 	// process from-encoded upload
	// 	var form = new formidable.IncomingForm({
	// 		hash : 'sha1',
	// 		multiples : true,
	// 		keepExtensions : true,
	// 	});
	// 	form.parse(req, function(err, fields, files) {	
	// 		if (err) console.log('ERR 5'.red, err);
	// 		if (err || !files || !files.file) return api.error.general(req, res, err || 'No files2.');
			
	// 		var from = files.file.path,
	// 		    file = 'image-' + uuid.v4(),
	// 		    to = api.config.path.image + file;
			
	// 		// rename and move to image folder
	// 		fs.rename(from, to, function (err) {
	// 			if (err) console.log('ERR 6'.red, err);
	// 			if (err) return api.error.general(req, res, err);
	// 			res.end(file);	// file will be saved by client
	// 		});		
	//  	});
	// },


	image : function (req, res) {

		// process from-encoded upload
		var form = new formidable.IncomingForm({
			hash : 'sha1',
			multiples : true,
			keepExtensions : true,
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
		var mandatory = ['.shp', '.shx', '.dbf'];
		var optional = ['.prj', '.sbn', '.sbx', '.fbn', '.fbx', '.ain', '.aih', '.ixs', '.mxs', '.atx', '.shp.xml', '.cpg'];
		if (mandatory.indexOf(name.slice(-4)) > -1) return ['shape', 'partialshape'];
		if (optional.indexOf(name.slice(-4)) > -1)  return ['shape', 'partialshape'];

		// unknown
		return ['unknown', 'unknown'];
	},

}