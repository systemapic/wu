var fs = require('fs');
var async = require('async');
var util = require('util');
var uuid = require('node-uuid');
var File = require('../models/file');
var Layer = require('../models/layer');
var Project = require('../models/project');
var dive = require('dive');
var fspath = require('path');
var _ = require('lodash-node');

var crunch = require('../routes/crunch');
var geo = require('../routes/geo');

// global paths
var GEOFOLDER = '/var/www/data/geo/';
var FILEFOLDER = '/var/www/data/files/';



module.exports = upload = { 


	newUpload : function (req, res) {

		

		console.log('NNNNNNEEEQQQQUUUPLOAD');

		// { 	
		//  	fieldName: 'file[]',
		// 	originalFilename: 'sysa.png',
		// 	path: '/tmp/30919-7w140q.png',
		// 	headers: [Object],
		// 	ws: [Object],
		// 	size: 63253,
		// 	name: 'sysa.png',
		// 	type: 'image/png' 
		// }


		

		// var to be passed around
		var hash = {
			req : req,
			res : res,
			queue : [],
			processed : []
		}

		
		// files to be processed
		hash.queue = upload._parseReqFiles(req);


		console.log('hash.queue: ', hash.queue);

		// run queue function
		upload.queue(hash, function (err, hash) {

			// all queues done
			console.log('all queues done!');
			console.log('hash:hash:hash:', hash);

		});


	},

	_parseReqFiles : function (req) {

		var f = req.files.file,	
		    reqFiles = (_.isArray(f[0])) ? f[0] : f; // comes as [[]] if multiple, cause dz.js

		for (r in reqFiles) {
			var rf = reqFiles[r];
			rf.uuid = 'reqFile-' + uuid.v4();
		}

		return reqFiles;
	},


	queue : function (hash, callback) {


		console.log('queue:: ', hash)

		// async waterfall
		var ops = [];

		// organize files, return hash with TYPE, FILES, FOLDER, SIZES, ALL META
		ops.push(function (cb) {
			upload.organize(hash, cb);
		});

		// process files based on TYPE, return hash with added geojson or image data etc.
		ops.push(function (hash, cb) {
			upload.process(hash, cb);
		});

		// // save files to PROJECT/USER etc., return hash with success bool
		// ops.push(function (hash, cb) {
		// 	upload.register(hash, cb);
		// });

		// async waterfall
		async.waterfall(ops, function (err, results) {
			console.log('newUpload async wf done => results: ', results);


			if (this.queue.length == 0) {
				// callback from queue
				callback(err, hash);
			} else {
				upload.queue(hash, callback);
			}

			
		});


	},




	checkFolders : function () {

	},

	processFiles : function () {
		// to zip
		// to geo 
		// to crunch
	},

	unzipFiles : function () {
		// to own folder unarchived-dlaskmd2-2das-2d3dsa
		// pass folder to checkFolders()

	},

	packageFiles : function () {

		// 

	},




	// // starting point for all uploads
	// newUpload : function (req, res) {

	// 	// auth
	// 	if (!req.isAuthenticated()) return upload.returnError(JSON.stringify({	// todo: more auth
	// 		error : 'Not authenticated'
	// 	}));


	// 	// 1. check contents of folders ()
	// 	// 2. 



	// 	// 1: get all files into own folder; unzip, untar, just move, whatever - but create one folder for each uploaded file, 
	// 	//    and put all files in respective folders. create hash with TYPE, FILENAMES, FOLDERNAME, SIZES, ALL META.
	// 	//
	// 	// 2: process files according to TYPE: layers are geo.js processed, images are crunch.js processed, etc.
	// 	//
	// 	// 3: add successful files to PROJECT and USER etc.
	// 	//
	// 	// 4: return files hash to client, locally update PROJECT/USER objects there.


	// 	// var to be passed around
	// 	var hash = {
	// 		req : req,
	// 		res : res,
	// 		files : {}
	// 	}

	// 	// async waterfall
	// 	var ops = [];

	// 	// organize files, return hash with TYPE, FILES, FOLDER, SIZES, ALL META
	// 	ops.push(function (callback) {
	// 		upload.organize(hash, callback);
	// 	});

	// 	// process files based on TYPE, return hash with added geojson or image data etc.
	// 	ops.push(function (hash, callback) {
	// 		upload.process(hash, callback);
	// 	});

	// 	// // save files to PROJECT/USER etc., return hash with success bool
	// 	// ops.push(function (hash, callback) {
	// 	// 	upload.register(hash, callback);
	// 	// });

	// 	// async waterfall
	// 	async.waterfall(ops, function (err, results) {
	// 		console.log('newUpload async wf done => results: ', results);
	// 	});



	// },

	// array of files from DZ upload
	organize : function (hash, callback) {

		// async each
		async.each(hash.queue, function (file, cb) {

			// organize each file
			upload.organizeFile(file, hash, cb);
		
		}, function (err) {
			if (err) console.log('orgnze async done err: ', err);
			
			// callback to newUpload, next is process
			callback(err, hash);
		});

	}, 


	process : function (hash, callback) {

		var entries = hash.reqFilesQueue,
		    ops = [];


		console.log('======= process entries: ', entries);


		// iterate over all files and check for interesting things
		for (e in entries) {

			console.log('e: ', e);

			var entry = entries[e],
			    files = entry.files;

			console.log('SHSHSHSHSH==========> process -=====> tpe: ', entry.type);


			// check for geo files
			files.forEach(function (file) {

				console.log('FILE: ', file);

				// .shp
				if (file.slice(-4) == '.shp') {
					ops.push(function (cb) {
						geo.processShapefile(entry, cb);
					});
				}

				// .json
				if (file.slice(-5) == '.json') {
					ops.push(function (cb) {
						geo.processJsonFile(entry, cb);
					});
				}

				// .geojson
				if (file.slice(-8) == '.geojson') {
					ops.push(function (cb) {
						geo.processGeojsonFile(entry, cb);
					});
				}


				// .topojson
				if (file.slice(-8) == '.topojson') {
					ops.push(function (cb) {
						geo.processTopojsonFile(entry, cb);
					});
				}

				// kml
				if (file.slice(-4) == '.kml') {
					ops.push(function (cb) {
						geo.processKmlFile(entry, cb);
					});
				}
			})	


			// process image files
			if (entry.type == 'image') {
				console.log('ADD OPS=> _processImage: entry:', entries[e]);
				ops.push(function (cb) {
					crunch._processImage(function () {
						return entries[e]; }, function (err, results) {
						cb(err);
					});
				});
			}

		};

		// process files
		async.parallel(ops, function (err, results) {
			if (err) console.error('process async err: ', err);
			callback(err, hash);
		});


	},

	// save files to appropriate db entries
	register : function (hash, callback) {
		console.log('register...');
		console.log('HASH: ', hash.files);

		for (f in hash.files) {
			var entry = hash.files[f];

			console.log('layers: ', entry.layers);
			console.log('image: ', entry.data.image);
		
			// add file to users 		// todo: check if shit'z real, ie. where goes what user access wise
			// add layers to user
			// add file/layers to project




		}
	},




	// only one file at a time goes thru here
	organizeFile : function (file, hash, callback) {

		// check if zip and unzip
		var originalFilename = file.originalFilename; 	// UNEP-EDE__girls_boys_prim_ed_rate__1398798722.tar.gz
		var temporaryPath = file.path;		  	// /tmp/temfiles.gz  <- actual path of a file

		// get type and extension
		var stat = upload._getType(file);
		var ext = stat[0];
		var type = stat[1];

		// create entry for hash
		var entry = {
			uuid 		 : 'file-' + uuid.v4(),
			ruuid            : file.uuid,
			originalFilename : originalFilename,
			temporaryPath 	 : temporaryPath,
			type 		 : type,
			ext 		 : ext,
			size 		 : file.size,
			files 		 : [originalFilename],
			layers 		 : [],
			data 		 : {}
		}

		// run async ops to move/unarchive files
		var ops = [];
		if (type == 'archive') {
			ops.push(function (cb) {
				upload.unarchive(entry, hash, cb)
			});
		} else {
			ops.push(function (cb) {
				upload.move(entry, cb)
			});
		}
		async.parallel(ops, function (err, results) {
			var entry = results[0];

			// add file to hash
			hash.processed.push(entry);

			// remove from queue
			_.remove(hash.queue, function (rf) {
				return rf.uuid == entry.ruuid;
			});

			// callback
			callback(err, hash);
		});

	},


	unarchive : function (entry, hash, callback) {
		var ops = [];
		if (entry.ext == 'zip') ops.push(function (cb) {
			upload.unzip(entry, hash, cb);
		});
		if (entry.ext == 'tar') ops.push(function (cb) {
			upload.untar(entry, hash, cb);
		});		
		async.parallel(ops, function (err, results) {
			var entry = results[0];
			callback(err, entry);
		});
	},


	unzip : function (entry, hash, callback) {

		// set folder
		entry.folder = FILEFOLDER + entry.uuid;

		// unzip
		var ops = [];

		ops.push(function (cb) {
			var cmd = 'unzip -o -d ' + entry.folder + ' ' + entry.temporaryPath; 	// to folder .shp
			var exec = require('child_process').exec;
			exec(cmd, function (err, stdout, stdin) {
				cb(err);
			});
		});
		// get contents
		ops.push(function (cb) {
			dive(entry.folder, 
				// for each file
				function(err, file) {

					var originalFilename = fspath.basename(file);

					var queueFile = {
						originalFilename : originalFilename,
						path : file, 
						uuid : uuid.v4()
					}

					// { 	
					//  	fieldName: 'file[]',
					// 	originalFilename: 'sysa.png',
					// 	path: '/tmp/30919-7w140q.png',
					// 	headers: [Object],
					// 	ws: [Object],
					// 	size: 63253,
					// 	name: 'sysa.png',
					// 	type: 'image/png' 
					// }

					// add unzipped files to queue
					hash.queue.push(queueFile);

					// var name = fspath.basename(file);
					// entry.files.push(name);
				}, 
				// final callback
				cb
			);
		});
		async.series(ops, function (err) {
			if (err) console.log('unzip async err: ', err);
			callback(err, entry);
		});
	},

	untar : function (entry, hash, callback) {

		// set folder
		entry.folder = FILEFOLDER + entry.uuid;

		// create folder
		var ops = [];
		ops.push(function (cb) {
			fs.mkdir(entry.folder, function (err) {
				cb(err);
			});
		});
		// tar cmd
		ops.push(function (cb) {
			var cmd = 'tar xzf ' + entry.temporaryPath + ' -C ' + entry.folder;
			var exec = require('child_process').exec;
			exec(cmd, function (err, stdout, stdin) {
				cb(err);
			});

		});
		// get folder contents
		ops.push(function (cb) {
			dive(entry.folder, 
				// each file callback
				function(err, file) {
					var name = fspath.basename(file);
					entry.files.push(name);
				}, 
				// callback
				cb
			);
		});
		async.series(ops, function (err) {
			if (err) console.error('untar async err: ', err);
			callback(err, entry);
		});

	},


	move : function (entry, callback) {

		entry.folder 		= FILEFOLDER + entry.uuid;
		entry.permanentPath 	= entry.folder + '/' + entry.originalFilename;
	
		// async - mkdir and move
		var ops = [];
		ops.push(function (cb) {
			// create directory
			fs.mkdir(entry.folder, function (err) {
				cb(err);
			});
		});
		ops.push(function (cb) {
			// move to designated folder
			fs.rename(entry.temporaryPath, entry.permanentPath, function (err) {
				cb(err);
			});

		});
		async.series(ops, function (err) {

			callback(err, entry);
		});

	},

	

	_getType : function (file) {

		var name = file.originalFilename.toLowerCase();

		// archives
		if (name.slice(-7) == '.tar.gz')  return ['tar', 'archive'];
		if (name.slice(-4) == '.zip') 	  return ['zip', 'archive'];

		// layers
		if (name.slice(-8) == '.geojson') return ['geojson', 'layer'];
		if (name.slice(-5) == '.json') 	  return ['json',    'layer'];
		if (name.slice(-4) == '.svg') 	  return ['svg',     'layer'];
		if (name.slice(-4) == '.kml') 	  return ['kml',     'layer'];

		// images
		if (name.slice(-5) == '.jpeg') 	  return ['jpg',  'image'];
		if (name.slice(-4) == '.jpg') 	  return ['jpg',  'image'];
		if (name.slice(-4) == '.gif') 	  return ['gif',  'image'];
		if (name.slice(-4) == '.png') 	  return ['png',  'image'];
		if (name.slice(-5) == '.tiff') 	  return ['tiff', 'image'];
	
		// docs
		if (name.slice(-4) == '.pdf') 	  return ['pdf',  'document'];
		if (name.slice(-4) == '.doc') 	  return ['doc',  'document']; 
		if (name.slice(-5) == '.docx') 	  return ['docx', 'document'];
		if (name.slice(-4) == '.txt') 	  return ['txt',  'document'];

		// unknown
		return ['unknown', 'unknown'];
	},



	
































	processUpload : function (req, res) {



	},


	setGlobals : function () {



	},


	checkFiles : function () {



	},


	returnError : function (error) {
		var res = this.res;
		res.end(error);
	},



	// do : function (req, res) {

	// 	// set basic globals
	// 	this.req 	= req;
	// 	this.res 	= res;
	// 	this.errors 	= [];

	// 	//check if auth
	// 	if (!req.isAuthenticated()) { 
	// 		this.addError({'error' : 'Not authenticated.'})
	// 		this.finish();
	// 		return;
	// 	}

	// 	// set more globals
	// 	this.useruuid 		= req.user.uuid;
	// 	this.projectuuid 	= req.body.project || '';
	// 	this.processing 	= 0;
	// 	this.processed 		= 0;
	// 	this.doneFiles 		= [];
	// 	this.uploadId 		= 'upload-' + uuid.v4();
		
	// 	// start by a checking file
	// 	this.check();

	// },

	// check : function () {

	// 	// check what it is, 
	// 	// unzip if needed, 
	// 	// get list of files, 
	// 	// check if similar files, 
	// 	// put into arrays of similar files
	// 	console.log('----- first check: -----');
	// 	console.log('file: ', this.req.files.file);
	// 	console.log('body: ', this.req.body);
	// 	console.log('_________ check _________')


	// 	// check if zip and unzip
	// 	this.file = this.req.files.file.originalFilename; // UNEP-EDE__girls_boys_prim_ed_rate__1398798722.tar.gz
	// 	this.path = this.req.files.file.path;		  // /tmp/temfiles.gz  <- actual path of a file

	// 	// untar
	// 	if (this.file.slice(-7).toLowerCase() == '.tar.gz') return this.untar();

	// 	// unzip
	// 	if (this.file.slice(-4).toLowerCase() == '.zip') return this.unzip();

	// 	// checkout the files
	// 	this.checkout();
		
	// },

	// checkout : function () {

	// 	console.log('checkout()');

	// 	// layers
	// 	if (this.file.slice(-8).toLowerCase() == '.geojson') 	return this.makedir('geojson', 'layer');
	// 	if (this.file.slice(-5).toLowerCase() == '.json') 	return this.makedir('json',     'layer');
	// 	if (this.file.slice(-4).toLowerCase() == '.svg') 	return this.makedir('svg',      'layer');
	// 	if (this.file.slice(-4).toLowerCase() == '.kml') 	return this.makedir('kml',      'layer');

	// 	// todo: shapefiles uploaded not as zip... (not v important)

	// 	// images
	// 	if (this.file.slice(-5).toLowerCase() == '.jpeg') 	return this.makedir('jpg',  'image');
	// 	if (this.file.slice(-4).toLowerCase() == '.jpg') 	return this.makedir('jpg',  'image');
	// 	if (this.file.slice(-4).toLowerCase() == '.gif') 	return this.makedir('gif',  'image');
	// 	if (this.file.slice(-4).toLowerCase() == '.png') 	return this.makedir('png',  'image');
	// 	if (this.file.slice(-5).toLowerCase() == '.tiff') 	return this.makedir('tiff', 'image');

	// 	// docs
	// 	if (this.file.slice(-4).toLowerCase() == '.pdf') 	return this.makedir('pdf',  'document');
	// 	if (this.file.slice(-4).toLowerCase() == '.doc') 	return this.makedir('doc',  'document'); 
	// 	if (this.file.slice(-5).toLowerCase() == '.docx') 	return this.makedir('docx', 'document');
	// 	if (this.file.slice(-4).toLowerCase() == '.txt') 	return this.makedir('txt',  'document');


	// 	// else, create a folder and dump file
	// 	return this.makedir('unknown', 'file'); // unknown format
		
	// },

	// makedir : function (extension, type) {
	// 	var that = this;
		
	// 	console.log('makedir(' + extension + ',' + type + ')');

	// 	var fid 	= 'file-' + uuid.v4();
	// 	var folder 	= '/var/www/data/geo/' + fid;
	// 	var path 	= this.path; // where file is now
	// 	var file 	= this.file; // just filename





	// 	// hijack stack, this ends here, do rest in crunch
	// 	if (type == 'image') return crunch.processImage(this);







	// 	// make dir
	// 	fs.mkdir(folder, function () {

	// 		var from = path; 
	// 		var to   = folder + '/' + file;
	// 		var name = file;

	// 		// set default name for file (without extension)
	// 		name = name.replace('.' + extension, '');
			

	// 		fs.rename(from, to, function (err) {
			
	// 			// add file to done list
	// 			that.addDone( {
	// 				'type' 	 : type,
	// 				'format' : extension,
	// 				'files'  : file,
	// 				'uuid'   : fid,
	// 				'name'   : name,
	// 			});

	// 			// we're done!
	// 			that.process_done();

	// 		})	
	// 	})
	// },


	// dive : function () {
		
	// 	this.divedFiles = [];

	// 	// check all files in this.tmpfolder recursively, and just copy the files we can use (.shp, .geojson, .kml, etc)
	// 	dive(this.tmpfolder, 

	// 		// each file callback
	// 		function(err, file) {
	// 			this.upload.divedFiles.push(file);
	// 		}, 

	// 		// callback
	// 		this.dived
	// 	);
	
	// },

	// dived : function () {
	// 	this.upload.process();
	// },


	




	// process_shp : function (shp) {
	// 	console.log('Processing shapefile ', shp);
		
	// 	// shape extensions
	// 	var mandatory 	= ['.shp', '.shx', '.dbf'];
	// 	var optional  	= ['.prj', '.sbn', '.sbx', '.fbn', '.fbx', '.ain', '.aih', '.ixs', '.mxs', '.atx', '.shp.xml', '.cpg'];
		
	// 	// path vars
	// 	var base 	= shp.slice(0, -4);			// full path without extension
	// 	var nopathbase 	= fspath.basename(shp, '.shp');
	// 	var id 		= uuid.v4();
	// 	var folder 	= '/var/www/data/geo/' + 'file-' + id;

	// 	// create unique folder for file(s)
	// 	fs.mkdir(folder, function (err) {

	// 		// iterate over each mandatory shapefile
	// 		var parallels = [];
	// 		mandatory.forEach(function(elem, i, arr) {
				
	// 			var to   = folder + '/' + nopathbase + elem;
	// 			var from = base + elem;
			
	// 			// push job to async queue
	// 			parallels.push(function (callback) {
	// 				// move to folder
	// 				fs.rename(from, to, function (err) {
	// 					if (err) {
	// 						callback(null, 'MISSINGFILE=' + from + ', ext: ' + elem);
	// 					} else {
	// 						callback(null, to);
	// 					}
	// 				});
	// 			});
	// 		});

	// 		// for each optional shapefile
	// 		optional.forEach(function(elem, i, arr) {
				
	// 			var to   = folder + '/' + nopathbase + elem;
	// 			var from = base + elem;
				
	// 			// queue job to async
	// 			parallels.push(function (callback) {
	// 				// move to folder
	// 				fs.rename(from, to, function (err) {
	// 					if (err) { 
	// 						// write 'false' to the result
	// 						callback(null, false); 
	// 					} else { 
	// 						// writes to-path as result
	// 						callback(null, to); 
	// 					}
	// 				});
	// 			});
	// 		});
		


	// 		// rename asyncly
	// 		async.parallel(parallels, function (err, results) {
				
	// 			// filter out falses
	// 			var arr = results.filter(function(n){ return n != false });
				
	// 			// check for mandatory files
	// 			var invalid = false;
	// 			var theshp  = '';
	// 			arr.forEach(function (elem, j, arr) {
	// 				var i = elem.indexOf('MISSINGFILE');
	// 				if (i > -1) {
	// 					// push error to stack
	// 					invalid = {'error' : 'Missing shapefile.', 'file' : elem } ;
	// 					this.upload.addError(invalid);
	// 				}
	// 				if (elem.indexOf('.shp') > -1) {
	// 					theshp = elem;
	// 				}
	// 			});
				
	// 			// check if valid
	// 			if (!invalid) {
	// 				// create geojson from shp
	// 				this.upload.convert_shp(arr, id);
				
	// 			} else {
	// 				// invalid, this thread is done
	// 				this.upload.process_done(false);
	// 			}
	// 		});
	// 	})
		
	// },

	// convert_shp : function (shapes, id) {
	// 	console.log('converting shp!:', shapes);
	// 	var that = this;

	// 	// id = shp file id

	// 	// get .shp file
	// 	for (s in shapes) {
	// 		if (shapes[s].slice(-4) == '.shp') { var shp = shapes[s]; }
	// 	}
		
	// 	// set vars
	// 	var gj 	  = shp + '.geojson';
	// 	var file  = fspath.basename(gj);
	// 	var fuuid = 'file-' + id;

	// 	// clean up filenames
	// 	var filenames = [];
	// 	shapes.forEach(function (shape, i, arr) {
	// 		filenames.push(fspath.basename(shape));
	// 	});
		
	// 	// execute cmd line conversion 
	// 	// var cmd = 'ogr2ogr -f "GeoJSON" ' + gj + ' ' + shp; 
	// 	var cmd = 'mapshaper -p 0.1 --encoding utf8 -f geojson -o ' + gj + ' ' + shp;
	// 	console.log('================= m a p s h a p e r ==========================');
	// 	var exec = require('child_process').exec;
	// 	exec(cmd, function (err, stdout, stdin) {
			
	// 		console.log('===========');
	// 		console.log('=  exec   =')
	// 		console.log('= ogr2ogr =')
	// 		console.log('-----------')
	// 		console.log('exec done:');
	// 		console.log('err: ', err);
	// 		console.log('stdout: ', stdout);
	// 		console.log('stdin: ', stdin);
	// 		console.log('cmd was: ', cmd);
	// 		console.log('.geojson is ', gj);

	// 		if (err) {
	// 			that.addError(err);
	// 			that.process_done();
	// 			return;
	// 		}


	// 		// add new geosjson file
	// 		filenames.push(file);

	// 		// add file to done list
	// 		that.addDone( {
	// 			'type' 	  : 'layer',
	// 			'format'  : ['geojson', 'shapefile'],
 // 				'files'   : filenames,
	// 			'uuid'    : fuuid,
	// 			'name'    : file,
	// 			'version' : 1,	// cause it's new
	// 			//'uploadid' : this.geo.uploadId		// same upload
	// 		});

	// 		// go do something else
	// 		that.process_done();
	// 	})

	// },

	addDone : function (json) {
		// push file to stack
		this.doneFiles.push(json);
	},


	addError : function (err) {
		// push error to stack
		this.errors.push(err);
	},

	// simply moves file to new unique file- folder
	process_geojson : function (json) {

		console.log('procesisng json file');
		console.log('json : ', json);


		// if .json
		//var base = json.slice(0, -5);	// full path without extension
		var nopathbase 	= fspath.basename(json, '.geojson');
		var id 		= uuid.v4();
		
		// create unique folder for file(s)
		var folder 	= '/var/www/data/geo/' + 'file-' + id;
		var file 	= nopathbase + '.geojson';
		var to 		= folder + '/' + file;

		fs.mkdir(folder, function (err) {

			// check for quality?
			fs.rename(json, to, function (err) {
			
				if (err) { 
				
					// write 'false' to the result
					// callback(null, false); 
					this.upload.addError(err);
					this.upload.process_done();

				} else { 

					console.log('JSON folder created: ', folder);
					console.log('for this json: ', json);

					
					this.upload.addDone( {
						'type' 	   : 'layer',
						'format'   : 'geojson',
						'file'     : file,
						'files'    : to,
						'uuid'     : 'file-' + id,
						'uploadid' : this.geo.uploadId

					});
					

					// writes to-path as result
					this.upload.process_done(json); 
				
				}
			});
		})
	},

	process_json : function (json) {


	},

	process_kml : function (kml) {

		this.process_done('kml');
	},

	// per specific whatever
	process_done : function () {

		this.all_done();
	},

	all_done : function (item) {

		this.processed += 1;

		// if all processed
		if (this.processing <= this.processed) {
			this.save();
		} else { // still got some files to go
			console.log('almost done.. ');
		}
	},

	

	// write to database
	save : function () {
		var that = this;

		console.log('________SAVE________');
		console.log('this.donefiles:');
		console.log(this.doneFiles);

		// layers store
		this.doneLayers = [];

		// for each file, queue for async save
		var queue = [];
		for (r in this.doneFiles) {
			var rec = this.doneFiles[r];

			// save file
			queue.push(this.saveFile(rec, r));

			// create layer object if layer
			console.log('_____________________ rec.type::', rec.type);
			
			if (rec.type == 'layer') {
				queue.push(this.createLayer(rec));
			}
		}

		// async save to db
		async.parallel(queue, function (err, results) {

			console.log('parallel saved to db...');
			console.log('err: ', err);
			console.log('resutls: ', results);
			

			that.saveToProject();	// save file to project
			that.finish();		// return to client

		});
	},

	// create Layer of those files which are layers (geojson)
	createLayer : function (rec) {

		console.log('CCCRRREEATE LAYER =========>>>>>>>>>>');
		console.log('rec._id:', rec._id);

		var layer 		= new Layer();
		layer.uuid 		= 'layer-' + uuid.v4();
		layer.title 		= rec.name;
		layer.description 	= 'Layer description';
		layer.legend 		= 'Layer legend';

		// geojson, todo: other formats
		layer.data.geojson 	= rec.uuid;

		var that = this;
		return function(callback) {

			Layer.create(layer, function(err, doc) {
				console.log('Layer.create:');
				console.log(err);
				console.log(doc);
				
				that.doneLayers.push(doc);
				//that.doneFiles[r] = doc;
				// that.doneFiles[r].record = doc;

				callback(err, doc);
			
			});
		};
	},

	saveToProject : function () {

		// get all file uuid's
		var uuids = [];
		this.doneFiles.forEach(function(file, i, arr) {
			uuids.push(file._id);	// mongoose object id
		}, this);

		var layers = [];
		this.doneLayers.forEach(function (layer) {
			layers.push(layer._id);
		})

		console.log('saveToProject...., this.projectuuid: ', this.projectuuid);
		return Project.findOne({'uuid' : this.projectuuid }, function (err, project) {

			uuids.forEach(function (u) {
				project.files.push(u);
			})
			
			layers.forEach(function (l) {
				project.layers.push(l);
			});

			// project.files.push(uuids);
			project.markModified('files');
			project.markModified('layers');



			project.save(function (err) {
				console.log('saved!: err:', err);
				return;
			})

		});
	},


	saveFile : function (rec, r) {
		var that 		= this;

		// create new File
		var record 		= new File();
		record.uuid 		= rec.uuid;
		record.createdBy 	= this.useruuid;
		record.createdByName    = this.req.user.firstName + ' ' + this.req.user.lastName;
		record.files 		= rec.files;
		record.access.users 	= [this.useruuid];	
		record.access.projects 	= [this.projectuuid];
		record.name 		= rec.name;
		record.description 	= rec.description;
		record.type 		= rec.type;
		record.format 		= rec.format;



		return function(callback) {

			File.create(record, function(err, doc) {
				console.log('File.create');
				console.log(err);
				console.log(doc);
								
				that.doneFiles[r] = doc;
				// that.doneFiles[r].record = doc;

				callback(err, doc);
			
			});
		};
	},


	finish : function () {

		var response = { 
			'files' : this.doneFiles,
			'layers' : this.doneLayers,
			'errors' : this.errors,

			//'records' : this.records
		}

		console.log('___________________ done with the upload ________________');
		console.log(response);
		console.log('________________ officially done! ___________________');

		// send response to client
		this.res.end(JSON.stringify(response));
	},



}