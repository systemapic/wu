var fs = require('fs-extra');
var async = require('async');
var util = require('util');
var uuid = require('node-uuid');
var File = require('../models/file');
var Layer = require('../models/layer');
var Project = require('../models/project');
var dive = require('dive');
var fspath = require('path');
var _ = require('lodash-node');
var formidable = require('formidable');
var exec = require('child_process').exec;
var kue = require('kue');
var crypto = require('crypto');


// modules
var pixels = require('./pixels');
var geo = require('./geo');
var filer = require('./filer');
// var api = require('./api');

// config
var config = require('../config/config');


// global paths
var FILEFOLDER = '/var/www/data/files/';
var TEMPFOLDER  = '/var/www/data/tmp/';









var store = 0;






module.exports = upload = { 

	// entry point
	upload : function (req, res) {

		console.log('upload.js.upload()'); // _______________ this _____________');
		console.log('this: ', this);

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
			
			// var fileArray = [files.file];

			if (!fileArray) return res.end(JSON.stringify({error : 'Error: No files.'}))

			// if just one file, wrap in array
			if (!fileArray.length) fileArray = [fileArray];
			


			console.log('fileArray: ', fileArray);


			var ops = [];

			ops.push(function (callback) {

				// quick sort
				upload.sortFormFiles(fileArray, function (err, results) {	

					console.log('___________@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@__');				
					console.log('___________@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@__');				
					console.log('___________@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@__');				
					console.log('___________@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@__');				
					console.log('___________@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@__');				
					console.log('___________@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@__');
					console.log('results: ', results);				
					console.log('___________@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@__');				
					console.log('___________@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@__');				
					console.log('___________@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@__');				
					console.log('___________@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@__');				
					console.log('___________@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@__');				
					console.log('___________@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@_@__');				
					callback(err, results);
				});
			});


			ops.push(function (dbs, callback) {

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
						api.dbCreateFile(db, function (err, doc) {
							cb(err, { file : doc });
						});
					});

					// create db for layer
					if (db.type == 'Layer') {
						ops.push(function (cb) {
							db.uuid = 'layer-' + uuid.v4();
							api.dbCreateLayer(db, function (err, doc) {
								cb(err, { layer : doc });
							});
						});
					};

				})

				// async
				async.series(ops, function (err, docs) {
					// add _ids to project
					docs && docs.forEach(function (doc) {
						doc.layer && api.dbAddLayerToProject(doc.layer._id, fields.project)
						doc.file  && api.dbAddFileToProject(doc.file._id, fields.project)
					});
					callback(err, docs);
				});
				
			});
			

			async.waterfall(ops, function (err, results) {
				console.log('async waterfall done, err, results', err, results);
				console.log('fields: ', fields);
				console.log('f cl', fields.client);

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
					errors : err
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


		console.log('UPLOAD: Sorting form files');

		// quick sort
		var ops = [];
		fileArray.forEach(function (file) {

			console.log('-> file: ', 	file);
			console.log('mime type: ', 	file.type);
			console.log('path: ', 		file.path);
			console.log('name: ', 		file.name);
			console.log('typeof file: ', 	typeof(file));
			console.log('length rfile: ', 	file.length);


			// each file uuid
			var fileUuid = 'file-' + uuid.v4();

			// current tmp path
			// var filepath = file.path;

			// var path = file.path + '/' + file.name;
			// console.log('______________ _ _ _ _ _ _ path: ', path);

			// type and extension
			var filetype 	= upload.getFileType(file.path);
			// var filetype 	= upload.getFileType(file.name);
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
			ops = upload._sortOps(ops, options);

		
		});

		

		async.series(ops, function (err, dbs) {
			console.log('store:', store);
			console.log('sortFormFiles 1 done, ', dbs);


			done && done(err, dbs);

		});
				

	},


	sortZipFolder : function (options, done) {

		// could be images, docs, etc
		// could be shapefiles/geojson
		// could be several

		var fileUuid 	= options.fileUuid;
		var folder 	= options.folder;
		// var currentPath = options.currentPath;


		console.log('____________________________________UPLOAD: Sorting zip folder');
		console.log('options.currentFolder', options.currentFolder);

		var currentFolder = options.currentFolder || FILEFOLDER + fileUuid;

		if (folder) {
			console.log('isFolder!!!', folder);
			currentFolder += '/' + folder;
			console.log('so currentFolder is: ', currentFolder);

			
		}

		var ops1 = [];

		// read files in folder
		fs.readdir(currentFolder, function (err, files) {

			console.log('sortZipFolder files: ', files); // ['Africa.shp', 'Africa.prj'] OR 'Zoning' (as folder)

			

			files.forEach(function (name) { 	// 'Africa.shp'

				var path = currentFolder + '/' + name; // path 



				// var filetype 	= upload.getFileType(name);
				var filetype 	= upload.getFileType(path);
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


				console.log('_sortOps: ', ops1, options);



				// handle zip (within zip)
				if (options.type == 'application/zip') {

					ops1.push(function (callback) {

						console.log('__handling ZIP FILE 222!');

						var rand = crypto.randomBytes(4).toString('hex');
						console.log('RANDOMMM!M!!M!M!M', rand);

						// new file uuid !!!
						var newFileUuid = 'file-' + uuid.v4();


						var zipopt = {
							inn : options.path,
							// fileUuid : options.fileUuid,
							fileUuid : newFileUuid,
							out : '/' + rand
							// out : 
						}

						// unzips files to folder
						filer.handleZip(zipopt, function (err) {

							console.log('filer.handleZip done');
							console.log('options.path: ', options.path);
							console.log('options.fioleUuid: ', options.fileUuid);

							var opt = {
								// fileUuid : options.fileUuid,
								fileUuid : newFileUuid,
								folder : rand
							}

							upload.sortZipFolder(opt, function (err, dbs) {	// gets [db]
								
								console.log('upload.sortZipFolder done', dbs);

								callback(err, dbs);

							});
						});
					});
				}
				
				// // handle zip
				// if (options.type == 'application/zip') {

				// 	ops1.push(function (callback) {

				// 		// unzips files to folder
				// 		filer.handleZip(options.path, options.fileUuid, function (err) {

				// 			upload.sortZipFolder(options.fileUuid, function (err, dbs) {	// gets [db]
								
				// 				callback(err, dbs);

				// 			});
				// 		});
				// 	});
				// }


				// // handle tar.gz
				// if (options.type == 'application/x-gzip') {

				// 	ops1.push(function (callback) {

				// 		// untars files to folder
				// 		filer.handleTar(options.path, options.fileUuid, function (err) {
							
				// 			upload.sortZipFolder(options.fileUuid, function (err, dbs) {

				// 				callback(err, dbs);

				// 			});
				// 		});
				// 	});
				// }



				// skip partials, catch on shapefile
				// if (options.type == 'partialshape') return ops; 


				// handle folder
				if (options.type == 'folder') {

					ops1.push(function (callback) {

						console.log('__handling FOLDER 77: options.currentFolder', options.currentFolder);
						console.log('opitons.name: ', options.name);

						
						var opt = {
							fileUuid : options.fileUuid,
							folder : options.name,
							currentFolder : options.currentFolder
						}

						console.log('opt!!-=-=---->', opt);

						upload.sortZipFolder(opt, function (err, dbs) {	// gets [db]
							
							console.log('upload.sortZipFolder 99 done', dbs);

							callback(err, dbs);

						});
					});
				}



				// handle shapefiles
				if (options.type == 'shapefile') {					// gotchas: already in file-uuid folder, cause unzip
					console.log('got shapefile!', options.name);			// 

					ops1.push(function (callback) {

						// process shapefile (convert, store, vectorize, etc.)
						filer.handleShapefile(options.currentFolder, options.name, options.fileUuid, function (err, db) {
							console.log('handled shapefile!', err, db);

							// populate db entry
							db = db || {};
							db.name = options.name;
							// db.file = options.fileUuid;
							db.type = 'Layer';

							// return db
							callback(err, db);

						});
					});
				}



				// handle images
				if (options.type == 'image/png' || options.type == 'image/jpeg') {

					ops1.push(function (callback) {

						// puts file in folder
						filer.handleImage(options.path, options.name, options.fileUuid, function (err, db) {

							// populate db entry
							db = db || {};
							db.name = options.name;
							db.file = options.fileUuid;
							db.type = options.type;
							db.files = [options.name];

							// return db
							callback(err, db);
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
						filer.handleJson(options.path, options.name, options.extension, options.fileUuid, function (err, db) {
							
							// populate db entry
							db = db || {};
							db.name = options.name;
							db.file = options.fileUuid;
							db.type = 'Layer';
							db.files = [options.name];

							// return db
							callback(err, db);
						
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
						filer.handleDocument(options.path, options.name, options.fileUuid, function (err, db) {

							// populate db entry
							db = db || {};
							db.name = options.name;
							db.file = options.fileUuid;
							db.type = 'document';
							db.files = [options.name];

							// return db
							callback(err, db);

						});
					});
				}









				// add async ops
				// ops1 = upload._sortOps(ops1, options);

		
			});
		


			// run ops
			async.series(ops1, function (err, dbs) {
				console.log('parallel don1 ', err, dbs);
				done && done(err, dbs);
			});



		});

	},



	_sortOps : function (ops, options) {


		console.log('_sortOps: ', ops, options);




		// handle folder
		if (options.type == 'folder') {

			ops.push(function (callback) {

				console.log('__handling FOLDER!');

				// unzips files to folder
				// filer.handleZip(options.path, options.fileUuid, function (err) {

				// 	console.log('filer.handleZip done');

					var opt = {
						fileUuid : options.fileUuid,
						folder : options.name,
						currentFolder : options.currentFolder
					}

					upload.sortZipFolder(opt, function (err, dbs) {	// gets [db]
						
						console.log('upload.sortZipFolder 99 done', dbs);

						callback(err, dbs);

					});
				// });
			});
		}

		
		// handle zip
		if (options.type == 'application/zip') {

			ops.push(function (callback) {

				console.log('__handling ZIP FILE!');

				var opt = {
					inn : options.path,
					fileUuid : options.fileUuid,
					out : ''
				}

				// unzips files to folder
				filer.handleZip(opt, function (err) {

					console.log('filer.handleZip done');

					var opt = {
						fileUuid : options.fileUuid,
						folder : null
					}

					upload.sortZipFolder(opt, function (err, dbs) {	// gets [db]
						
						console.log('upload.sortZipFolder done', dbs);

						callback(err, dbs);

					});
				});
			});
		}


		// handle tar.gz
		if (options.type == 'application/x-gzip') {

			ops.push(function (callback) {

				// untars files to folder
				filer.handleTar(options.path, options.fileUuid, function (err) {

					var opt = {
						fileUuid : fileUuid,
						folder : null
					}
					
					upload.sortZipFolder(opt, function (err, dbs) {

						callback(err, dbs);

					});
				});
			});
		}



		// skip partials, catch on shapefile
		// if (options.type == 'partialshape') return ops; 


		// handle shapefiles
		if (options.type == 'shapefile') {					// gotchas: already in file-uuid folder, cause unzip
			console.log('got shapefile!', options.name);			// 

			ops.push(function (callback) {

				// process shapefile (convert, store, vectorize, etc.)
				filer.handleShapefile(options.currentFolder, options.name, options.fileUuid, function (err, db) {
					console.log('handled shapefile!', err, db);

					// populate db entry
					db = db || {};
					db.name = options.name;
					// db.file = options.fileUuid;
					db.type = 'Layer';

					// return db
					callback(err, db);


				});
			});
		}



		// handle images
		if (options.type == 'image/png' || options.type == 'image/jpeg') {

			ops.push(function (callback) {

				// puts file in folder
				filer.handleImage(options.path, options.name, options.fileUuid, function (err, db) {

					// populate db entry
					db = db || {};
					db.name = options.name;
					db.file = options.fileUuid;
					db.type = options.type;
					db.files = [options.name];

					// return db
					callback(err, db);
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
				filer.handleJson(options.path, options.name, options.extension, options.fileUuid, function (err, db) {
					
					// populate db entry
					db = db || {};
					db.name = options.name;
					db.file = options.fileUuid;
					db.type = 'Layer';
					db.files = [options.name];

					// return db
					callback(err, db);
				
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
				filer.handleDocument(options.path, options.name, options.fileUuid, function (err, db) {

					// populate db entry
					db = db || {};
					db.name = options.name;
					db.file = options.fileUuid;
					db.type = 'document';
					db.files = [options.name];

					// return db
					callback(err, db);

				});
			});
		}


		return ops;


	},




	getFileType : function (name) {

		console.log('getFileType name:', name);

		// check if folder
		console.time('isFolder');
		var isFolder = fs.statSync(name).isDirectory();
		console.log('isFoldeR???', isFolder);
		console.timeEnd('isFolder');
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






