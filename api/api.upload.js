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


	projectLogo : function (req, res) {
		console.log('api.upload.projectLogo');
		console.log('API ==> module.parent: ', module.parent);
		console.log('...api => ', api);

		// process from-encoded upload
		var form = new formidable.IncomingForm({
			hash : 'sha1',
			multiples : true,
			keepExtensions : true,
		});

		form.parse(req, function(err, fields, files) {	
			if (err || !files || !files.file) return api.error.general(req, res, err || 'No files1.');

			var from = files.file.path,
			    file = 'image-' + uuid.v4(),
			    to = api.config.path.image + file;
			
			// rename and move to image folder
			fs.rename(from, to, function (err) {
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
			if (err || !files || !files.file) return api.error.general(req, res, err || 'No files2.');
			
			var from = files.file.path,
			    file = 'image-' + uuid.v4(),
			    to = api.config.path.image + file;
			
			// rename and move to image folder
			fs.rename(from, to, function (err) {
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
			if (err || !files || !files.file) return api.error.general(req, res, err || 'No files3.');

			var from = files.file.path,
			    file = 'image-' + uuid.v4(),
			    to   = api.config.path.image + file;
			
			// rename and move to image folder
			fs.rename(from, to, function (err) {
				if (err) return api.error.general(req, res, err);
				res.end(file);	// file will be saved by client
			});		
	 	});

	},

	// entry point
	file : function (req, res) {

		console.log('API.upload.upload()');

		// console.log('upload.js.upload()'); // _______________ this _____________');
		// console.log('this: ', this);

		// types of possible uploaded files:
		//
		// - zipped shapefiles
		// - zipped geojson
		// - zipped image, docs, anything
		// - zipped zip-files with anything inside
		//
		// - geojson
		// - shapefiles (shp, dbf, prj, etc)
		// - 

		//
		// check files, unzip to own folder -> pick out files, if found a .shp file, check for other shapfile.*
		// image, geojson, docs, pdf -> straight done
		//

		// 
		//
		//

		// process from-encoded upload
		var form = new formidable.IncomingForm({
			hash : 'sha1',
			multiples : true,
			keepExtensions : true,
		});

		form.parse(req, function(err, fields, files) {	
			console.log(err, files, fields);
			if (err || !files || !fields) return api.error.general(req, res, err || 'No files4.');


			console.log('formidale: ', util.inspect({fields: fields, files: files}));
			console.log('files! => ', files);
 			
			// one file =>
			// 'file[]': { 
			// 	domain: null,
			// 	_events: {},
			// 	_maxListeners: 10,
			// 	size: 1936180,
			// 	path: '/tmp/3834f14d2b74a95a4896cae5be47873a.zip',
			// 	name: 'Africa_SHP.zip',
			// 	type: 'application/zip',
			// 	hash: null,
			// 	lastModifiedDate: Thu Oct 30 2014 00:49:16 GMT+0100 (CET),
			// 	_writeStream: 
			// 	{ _writableState: [Object],
			// 		writable: true,
			// 		domain: null,
			// 		_events: {},
			// 		_maxListeners: 10,
			// 		path: '/tmp/3834f14d2b74a95a4896cae5be47873a',
			// 		fd: null,
			// 		flags: 'w',
			// 		mode: 438,
			// 		start: undefined,
			// 		pos: undefined,
			// 		bytesWritten: 1936180,
			// 		closed: true 
			// 	} 
			// } 
			
			// ##################
			// here only single files enter: .zip, png, etc.. (no .shps etc)
			//
			//
			//



			var fileArray = files['file[]'];
			

			if (!fileArray) return api.error.general(req, res, 'No files5.');

			// if just one file, wrap in array
			if (!fileArray.length) fileArray = [fileArray];
			

			var ops = [];

			ops.push(function (callback) {

				// quick sort
				api.upload.sortFormFiles(fileArray, function (err, results) {	
					if (err || !results) return callback(err || 'Nothing to sort.');

					console.log('_________ results ______________');
					console.log('results: ', results);
					console.log('__________ results end _________');				
								
					callback(null, results);
				});
			});


			ops.push(function (dbs, callback) {
				if (!dbs) return callback('Nothing to do.');

				var dbss = _.flatten(dbs);
				var ops = [];

				dbss.forEach(function (db) {

					db.uuid = db.file; 
					db.createdBy = req.user.uuid;
					db.createdByName = req.user.firstName + ' ' + req.user.lastName;
					db.access = {
						users : req.user.uuid,
						projects : fields.project,
						clients : fields.client
					}

					// create db for file
					ops.push(function (cb) {
						api.file.createModel(db, function (err, doc) {
							cb(err, { file : doc });
						});
					});

					// create db for layer
					if (db.type == 'Layer') {
						ops.push(function (cb) {
							db.uuid = 'layer-' + uuid.v4();
							api.layer.createModel(db, function (err, doc) {
								cb(err, { layer : doc });
							});
						});
					};

				})

				// async
				async.series(ops, function (err, docs) {
					if (err || !docs) return callback(err || 'No docs.');

					// add _ids to project
					docs && docs.forEach(function (doc) {
						doc.layer && api.layer.addToProject(doc.layer._id, fields.project)
						doc.file && api.file.addToProject(doc.file._id, fields.project)
					});

					callback(null, docs);
				});
			});
			

			async.waterfall(ops, function (err, results) {
				if (err || !results) return api.error.general(req, res, err || 'No results.');

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


		// new Layer()
		// var options = {
		// 	title : title,
		// 	uuid : uuid,
		// 	data : {
		// 		geojson : geojson
		// 	},
		// 	fileUuid : fileUuid,
		// 	metadata : metadata,
		// 	legend : legend
		// }

		// new File()
		// var options = {
		// 	uuid : uuid,
		// 	createdBy : 
		// 	createdByName :
		// 	files : []
		// 	access : {
		// 		users : 
		// 	},
		// 	name :
		// 	description : 
		// 	type : 
		// 	format : 
		// 	dataSize : 
		// 	data : {

		// 	}
		// }

			
		});
	},


	sortFormFiles : function (fileArray, done) {

		if (!fileArray) return done('No files6.');

		// console.log('UPLOAD: Sorting form files');

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

			// add async ops
			ops = api.upload._sortOps(ops, options);
		
		});

		async.series(ops, function (err, dbs) {
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
			// console.log('isFolder!!!', folder);
			currentFolder += '/' + folder;
			// console.log('so currentFolder is: ', currentFolder);

			
		}

		var ops1 = [];

		// read files in folder
		fs.readdir(currentFolder, function (err, files) {
			if (err || !files) return callback(err || 'No files7.');


			files.forEach(function (name) { 	// 'Africa.shp'

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


				// handle zip (within zip)
				if (options.type == 'application/zip' || options.type == 'application/x-zip-compressed') {

					ops1.push(function (callback) {

						var rand = crypto.randomBytes(4).toString('hex');
						var newFileUuid = 'file-' + uuid.v4();

						var zipopt = {
							inn : options.path,
							fileUuid : newFileUuid,
							out : '/' + rand
						}

						// unzips files to folder
						api.file.handleZip(zipopt, function (err) {
							if (err) return callback(err);

							var opt = {
								fileUuid : newFileUuid,
								folder : rand
							}

							api.upload.sortZipFolder(opt, function (err, dbs) {	// gets [db]
								if (err) return callback(err);

								callback(err, dbs);
							});
						});
					});
				}
				
				
				// handle folder
				if (options.type == 'folder') {

					ops1.push(function (callback) {
						
						var opt = {
							fileUuid : options.fileUuid,
							folder : options.name,
							currentFolder : options.currentFolder
						}

						api.upload.sortZipFolder(opt, function (err, dbs) {	// gets [db]
							if (err) return callback(err);
							callback(null, dbs);
						});
					});
				}


				// handle shapefiles
				if (options.type == 'shapefile') {					// gotchas: already in file-uuid folder, cause unzip

					ops1.push(function (callback) {

						// process shapefile (convert, store, vectorize, etc.)
						api.file.handleShapefile(options.currentFolder, options.name, options.fileUuid, function (err, db) {
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
				if (options.type == 'image/png' || options.type == 'image/jpeg') {

					ops1.push(function (callback) {

						// puts file in folder
						api.file.handleImage(options.path, options.name, options.fileUuid, function (err, db) {
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


				// handle json
				if (options.type == 'application/octet-stream') {
					// seems to be geojson/json/topojson

					// only process geofiles
					if (options.extension != 'geojson' && options.extension != 'topojson' && options.extension != 'json') return ops;

					ops1.push(function (callback) {

						// processes geojson, puts file in folder
						api.file.handleJson(options.path, options.name, options.extension, options.fileUuid, function (err, db) {
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


				// handle docs/pdf
				if (	options.type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
					options.type == 'application/msword' ||
					options.type == 'application/pdf' ||
					options.type == 'text/plain' ) {

					ops1.push(function (callback) {

						// puts file in folder
						api.file.handleDocument(options.path, options.name, options.fileUuid, function (err, db) {
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
				done && done(err, dbs);
			});
		});
	},



	_sortOps : function (ops, options) {

		// handle folder
		if (options.type == 'folder') {

			ops.push(function (callback) {

				var opt = {
					fileUuid : options.fileUuid,
					folder : options.name,
					currentFolder : options.currentFolder
				}

				api.upload.sortZipFolder(opt, function (err, dbs) {	// gets [db]
					if (err) return callback(err);
					callback(null, dbs);
				});
			});
		}

		
		// handle zip
		if (options.type == 'application/zip' || options.type == 'application/x-zip-compressed') {

			ops.push(function (callback) {

				var opt = {
					inn : options.path,
					fileUuid : options.fileUuid,
					out : ''
				}

				// unzips files to folder
				api.file.handleZip(opt, function (err) {
					if (err) return callback(err);

					var opt = {
						fileUuid : options.fileUuid,
						folder : null
					}

					api.upload.sortZipFolder(opt, function (err, dbs) {	// gets [db]
						if (err) return callback(err);
						
						callback(err, dbs);
					});
				});
			});
		}


		// handle tar.gz
		if (options.type == 'application/x-gzip') {

			ops.push(function (callback) {

				// untars files to folder
				api.file.handleTar(options.path, options.fileUuid, function (err) {
					if (err) return callback(err);

					var opt = {
						fileUuid : options.fileUuid,
						folder : null
					}
					
					api.upload.sortZipFolder(opt, function (err, dbs) {
						if (err) return callback(err);
						callback(null, dbs);
					});
				});
			});
		}



		// handle shapefiles
		if (options.type == 'shapefile') {					// gotchas: already in file-uuid folder, cause unzip

			ops.push(function (callback) {

				// process shapefile (convert, store, vectorize, etc.)
				api.file.handleShapefile(options.currentFolder, options.name, options.fileUuid, function (err, db) {
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
		if (options.type == 'image/png' || options.type == 'image/jpeg') {

			ops.push(function (callback) {

				// puts file in folder
				api.file.handleImage(options.path, options.name, options.fileUuid, function (err, db) {
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


		// handle json
		if (options.type == 'application/octet-stream') {
			// seems to be geojson/json/topojson

			// only process geofiles
			if (options.extension != 'geojson' && options.extension != 'topojson' && options.extension != 'json') return ops;


			ops.push(function (callback) {

				// processes geojson, puts file in folder
				api.file.handleJson(options.path, options.name, options.extension, options.fileUuid, function (err, db) {
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


		// handle docs/pdf
		if (	options.type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
			options.type == 'application/msword' ||
			options.type == 'application/pdf' ||
			options.type == 'text/plain' ) {

			ops.push(function (callback) {

				// puts file in folder
				api.file.handleDocument(options.path, options.name, options.fileUuid, function (err, db) {
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
		// if (name.slice(-4) == '.gif') 	  return ['gif',  'image'];
		if (name.slice(-4) == '.png') 	  return ['png',  'image/png'];
		// if (name.slice(-5) == '.tiff') 	  return ['tiff', 'image'];
	
		// docs
		if (name.slice(-4) == '.pdf') 	  return ['pdf',  'application/pdf'];
		if (name.slice(-4) == '.doc') 	  return ['doc',  'application/msword']; 
		if (name.slice(-5) == '.docx') 	  return ['docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
		if (name.slice(-4) == '.txt') 	  return ['txt',  'text/plain'];

		// shapefile parts
		if (name.slice('-4') == '.shp')   return ['shp', 'shapefile'];
		var mandatory 	= ['.shp', '.shx', '.dbf'];
		var optional  	= ['.prj', '.sbn', '.sbx', '.fbn', '.fbx', '.ain', '.aih', '.ixs', '.mxs', '.atx', '.shp.xml', '.cpg'];
		if (mandatory.indexOf(name.slice(-4)) > -1) return ['shape', 'partialshape'];
		if (optional.indexOf(name.slice(-4)) > -1)  return ['shape', 'partialshape'];

		// unknown
		return ['unknown', 'unknown'];
	},

}