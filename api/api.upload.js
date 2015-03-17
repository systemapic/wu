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
module.exports = api.upload = { 



	// entry point
	file : function (req, res) {
		// todo: check for upload access!;
		console.log('API.upload.upload()'.cyan);
		console.log('___________________'.cyan);

		// process from-encoded upload
		var form = new formidable.IncomingForm({
			hash : 'sha1',
			multiples : true,
			keepExtensions : true,
		});

		form.parse(req, function(err, fields, files) {	
			if (err) console.log('ERR 1'.red, err);
			if (err || !files || !fields || !files.file) return api.error.general(req, res, err || 'No files4.');


			console.log('files! => '.yellow, files);
 			
			

			var fileArray = [files.file];

			var ops = [];

			// sort files
			ops.push(function (callback) {

				// quick sort
				api.upload.sortFormFiles(fileArray, function (err, results) {
					if (err) console.log('ERR 18'.red, err);

					if (err || !results) return callback(err || 'There were no valid files in the upload.');

					console.log('_________ results ______________');
					console.log('results: ', results);
					console.log('__________ results end _________');				
								
					callback(null, results);
				});
			});

			// register files in mongo and to project
			ops.push(function (entriesArray, callback) {
				if (!entriesArray) return callback('Nothing to do.');

				var options = {
					entriesArray : entriesArray,
					userUuid : req.user.uuid,
					userFullName :  req.user.firstName + ' ' + req.user.lastName,
					projectUuid : fields.project
				}

				// register files in mongo and to project
				api.upload._registerFiles(options, function (err, results) {
					if (err) console.log('ERR 17'.red, err);
					callback(err, results);
				});
				
			});
			

			async.waterfall(ops, function (err, results) {
				if (err) console.log('ERR 2'.red, err);
				if (err || !results || !results.length) return api.error.general(req, res, err || 'There were no valid files in the upload.');

				// organize in sidepane.dataLibrary format
				var files = [],
				    layers = [];

				results && results.forEach(function (r) {
					r.file && files.push(r.file);
					r.layer && layers.push(r.layer);
				});

				var pack = {
					files  : files,
					layers :layers,
					error : err
				}

				// all done
				res.end(JSON.stringify(pack));
			});
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

			// add files/layers to project
			_.each(docs, function (doc) {
				if (doc.file) api.file.addToProject(doc.file._id, projectUuid);
				if (doc.layer) api.layer.addToProject(doc.layer._id, projectUuid);
			});

			done(null, docs);
		});

	},





	sortFormFiles : function (fileArray, done) {

		// if (!fileArray) return done('No files6.');

		console.log('UPLOAD: Sorting form files');

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
				currentFolder : null
			}

			console.log('##############'.cyan);
			console.log('options: ', options);

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

				// fuck doing zip within zip!!
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
				// if (options.type == 'shapefile') {					// gotchas: already in file-uuid folder, cause unzip

					ops1.push(function (callback) {

						// process shapefile (convert, store, vectorize, etc.)
						api.file.handleShapefile(options.currentFolder, options.name, options.fileUuid, function (err, db) {
							if (err) console.log('ERR 29'.red, err);
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
				if (extension == 'jpg' || extension == 'png' || extension == 'jpeg') {

					ops1.push(function (callback) {

						// puts file in folder
						api.file.handleImage(options.path, options.name, options.fileUuid, function (err, db) {
							if (err) console.log('ERR 30'.red, err);
							if (err) return callback(err);

							// populate db entry
							db = db || {};
							db.name = options.name;
							db.file = options.fileUuid;
							db.type = options.type;
							db.files = [options.name];

							// return db
							callback(null, db);
						});
					});
				}


				
				if (extension == 'geojson') {

					ops1.push(function (callback) {

						// processes geojson, puts file in folder
						api.file.handleJson(options.path, options.name, options.extension, options.fileUuid, function (err, db) {
							if (err) console.log('ERR 31'.red, err);
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



				if (extension == 'doc' || extension == 'pdf' || extension == 'docx' || extension == 'txt') {

					ops1.push(function (callback) {

						// puts file in folder
						api.file.handleDocument(options.path, options.name, options.fileUuid, function (err, db) {
							if (err) console.log('ERR 32'.red, err);
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

		// handle folder
		if (options.type == 'folder') {

			ops.push(function (callback) {

				var opt = {
					fileUuid : options.fileUuid,
					folder : options.name,
					currentFolder : options.currentFolder
				}

				api.upload.sortZipFolder(opt, function (err, dbs) {	// gets [db]
					if (err) console.log('ERR 34'.red, err);
					if (err) return callback(err);
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
				api.file.handleShapefile(options.currentFolder, options.name, options.fileUuid, function (err, db) {
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
					db.type = options.type;
					db.files = [options.name];

					// return db
					callback(null, db);
				});
			});
		}


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

		// process from-encoded upload
		var form = new formidable.IncomingForm({
			hash : 'sha1',
			multiples : true,
			keepExtensions : true,
		});

		form.parse(req, function(err, fields, files) {	
			if (err) console.log('ERR 3'.red, err);
			if (err || !files || !files.file) return api.error.general(req, res, err || 'No files1.');

			var from = files.file.path,
			    file = 'image-' + uuid.v4(),
			    to = api.config.path.image + file;
			
			// rename and move to image folder
			fs.rename(from, to, function (err) {
				if (err) console.log('ERR 4'.red, err);
				if (err) return api.error.general(req, res, err);
				res.end(file);	// file will be saved by client
			});		
	 	});
	},


	clientLogo : function (req, res) {
		
		// process from-encoded upload
		var form = new formidable.IncomingForm({
			hash : 'sha1',
			multiples : true,
			keepExtensions : true,
		});
		form.parse(req, function(err, fields, files) {	
			if (err) console.log('ERR 5'.red, err);
			if (err || !files || !files.file) return api.error.general(req, res, err || 'No files2.');
			
			var from = files.file.path,
			    file = 'image-' + uuid.v4(),
			    to = api.config.path.image + file;
			
			// rename and move to image folder
			fs.rename(from, to, function (err) {
				if (err) console.log('ERR 6'.red, err);
				if (err) return api.error.general(req, res, err);
				res.end(file);	// file will be saved by client
			});		
	 	});
	},


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