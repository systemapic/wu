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

// 
var crunch = require('../routes/crunch');
var geo = require('../routes/geo');

// global paths
// var GEOFOLDER = '/var/www/data/geo/';
var FILEFOLDER = '/var/www/data/files/';

var n = 1;

module.exports = upload = { 


	newUpload : function (req, res) {

		
		// console.log('******************')
		// console.log('* API fn: newUpload ');
		// console.log('******************')
		// console.log('* files: ');
		// console.dir(req.files.file);
		// console.log('******************')

		// * files:
		// [ [ { fieldName: 'file[]',
		//       originalFilename: 'EGYPT_SS1.jpg',
		//       path: '/tmp/20070-dh6j33.jpg',
		//       headers: [Object],
		//       ws: [Object],
		//       size: 25930,
		//       name: 'EGYPT_SS1.jpg',
		//       type: 'image/jpeg' },
		//     { fieldName: 'file[]',
		//       originalFilename: 'kangoo.jpeg',
		//       path: '/tmp/20070-30k6hm.jpeg',
		//       headers: [Object],
		//       ws: [Object],
		//       size: 5107,
		//       name: 'kangoo.jpeg',
		//       type: 'image/jpeg' } ] ]


		// return res.end();

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
			processed : [],
			organized : [],
			partials : {},
			cleaned : {
				files : [],
				layers : []
			},
			done : []
		}

		this.hash = hash;

		
		// files to be processed
		var files = upload._parseReqFiles(req);
		hash.queue = files;


		// console.log('**********************************')
		// console.log('* newUpload > ');
		// console.log('* hash.queue.length: ',     hash.queue.length);
		// console.log('* hash.organized.length: ', hash.organized.length);
		// console.log('* hash.processed.length: ', hash.processed.length);
		// console.log('* hash.cleaned.files.length: ',   hash.cleaned.files.length);
		// console.log('* hash.cleaned.layers.length: ',   hash.cleaned.layers.length);
		// console.log('**********************************')		




		// run queue function	// callback
		upload.queue(hash, function (err, hash) {

			// all queues done
			// console.log(' * D * O * N * E *');
			res.end(JSON.stringify({
				error : 0,
				done : hash.done
			}));
		});
	},

	
	// the main queue of processing
	queue : function (hash, callback) {

		// async waterfall
		var ops = [],
		    that = this;


		// organize files, return hash with TYPE, FILES, FOLDER, SIZES, ALL META
		ops.push(function (cb) {
			upload.organize(hash, cb);
		});

		// process files based on TYPE, return hash with added geojson or image data etc.
		ops.push(function (hash, cb) {
			upload.process(hash, cb);
		});

		// clean up files
		ops.push(function (cb) {
			upload.cleanFiles(hash, cb);
		});

		// save files to PROJECT/USER etc., return hash with success bool
		ops.push(function (hash, cb) {
			upload.register(hash, cb);
		});


		// async waterfall
		async.waterfall(ops, function (err) {

			// console.log('**********************************')
			// console.log('* fn: queue.waterfall * callback()!');
			// console.log('* hash.queue.length: ',     hash.queue.length);
			// console.log('* hash.organized.length: ', hash.organized.length);
			// console.log('* hash.processed.length: ', hash.processed.length);
			// console.log('* hash.cleaned.files.length: ',   hash.cleaned.files.length);
			// console.log('* hash.cleaned.layers.length: ',   hash.cleaned.layers.length);
			// console.log('**********************************')

			// if queue is finished
			if (that.hash.queue.length == 0 || that.hash.queue == undefined) {
				// console.log('queue.waterfall queue=0');

				// console.log('**********************************')
				// console.log('* ALL DONE ALL DONE ALL DONE ALL *');
				// console.log('* hash.queue.length: ',     hash.queue.length);
				// console.log('* hash.organized.length: ', hash.organized.length);
				// console.log('* hash.processed.length: ', hash.processed.length);
				// console.log('* hash.cleaned.files.length: ',   hash.cleaned.files.length);
				// console.log('* hash.cleaned.layers.length: ',   hash.cleaned.layers.length);
				// console.log('* hash.cleaned: ');
				// console.dir(hash.cleaned);
				// console.log('**********************************')


				// end queue
				callback(err, hash);

			// if file still left in queue (eg. added from zips)
			} else {

				// console.log('***********************************');
				// console.log('* REQUEUE REQUEUE REQUEUE REQUEUE *');
				// console.log('* _______________________________ *');
				// console.log('* hash.queue.length: ',     hash.queue.length);
				// console.log('* hash.organized.length: ', hash.organized.length);
				// console.log('* hash.processed.length: ', hash.processed.length);
				// console.log('* hash.cleaned.files.length: ',   hash.cleaned.files.length);
				// console.log('* hash.cleaned.layers.length: ',   hash.cleaned.layers.length);
				// console.log('* hash.cleaned: ');
				// console.dir(hash.cleaned);
				// console.log('**********************************')


				// do more files
				upload.queue(hash, callback);
			}	
		});
	},





	


	// array of files from DZ upload
	organize : function (hash, callback) {

		// console.log('**********************************')
		// console.log('* organize > start ');
		// console.log('* hash.queue.length: ',     hash.queue.length);
		// console.log('* hash.organized.length: ', hash.organized.length);
		// console.log('* hash.processed.length: ', hash.processed.length);
		// console.log('**********************************')


		var ops = [];
		hash.queue.forEach(function (file) {
			ops.push(function (cb) {
				upload.organizeFile(file, hash, cb);
			});

		}, this);


		async.series(ops, function (err) {

			if (err) console.log('organize > callback() > async done err: ', err);
			
			// console.log('**********************************')
			// console.log('* organize > DONE!  ');
			// console.log('* hash.queue.length: ',     hash.queue.length);
			// console.log('* hash.organized.length: ', hash.organized.length);
			// console.log('* hash.processed.length: ', hash.processed.length);
			// console.log('* hash.partials.length: ', hash.partials.length);
			// console.log('* hash.partials: ', hash.partials);
			// console.log('**********************************')
			

			// if partials
			if (hash.partials.length > 0) {
				return upload.movePartials(hash, callback);
			}

			// callback to newUpload, next is process
			callback(err, hash);

		});
	}, 
	
	movePartials : function (hash, callback) {

		// console.log('need to move partials into one folder');
		callback(null);

	},
	

	// only one file at a time goes thru here
	organizeFile : function (file, hash, callback) {

		// console.log('**********************************')
		// console.log('* organizeFile > start ');
		// console.log('* hash.queue.length: ',     hash.queue.length);
		// console.log('* hash.organized.length: ', hash.organized.length);
		// console.log('* hash.processed.length: ', hash.processed.length);
		// console.log('* file: ', file);
		// console.log('**********************************')


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
			files 		 : [],
			layers 		 : [],
			data 		 : {}
		}

		// console.log('******************************')
		// console.log('organizeFile > ENTRY: ', entry);
		// console.log('******************************')





		var ops = [];


		// run async ops to move/unarchive files
		if (type == 'archive') {

			// unzip/untar
			ops.push(function (cb) {
				upload.unarchive(entry, hash, cb)
			});
		
		}  else if (type == 'partialshape') {
			// console.log('******************************')
			// console.log('* partialshape > ENTRY: ', entry);
			// console.log('******************************')

			// concat partialshapes into one folder

			// get prefix
			var prefix = originalFilename.split('.')[0];
			// console.log('hash.partials: ', hash.partials, prefix);
			if (!hash.partials[prefix]) hash.partials[prefix] = [];
			// hash.partials[prefix] = hash.partials[prefix] || [];
			// console.log('hash.partials: ', hash.partials, prefix);
			// console.log(';;hash.partials[prefix]', hash.partials[prefix]);

			hash.partials[prefix].push(entry);

			callback(null, entry);

		} else if (type == 'document') {

			// move
			ops.push(function (cb) {
				upload.move(entry, cb)
				hash.processed.push(entry);
			});
		
		} else {
			// move
			ops.push(function (cb) {
				upload.move(entry, cb)
				// hash.processed.push(entry);
			});
		}

		ops.push(function (cb) {

			// get size
			var path = entry.temporaryPath;
			fs.stat(path, function (err, stat) {
				entry.size = stat.size;
				cb(err);
			});
			
		});


		async.parallel(ops, function (err, results) {
			var entry = results[0];

			// console.log('__________ results: ', results);
			
			// add file to hash
			hash.organized.push(entry);

			// remove from queue
			_.remove(hash.queue, function (rf) {
				return rf.uuid == entry.ruuid;
			});

			// console.log('**********************************')
			// console.log('* organizeFile * callback()!');
			// console.log('* hash.queue.length: ',     hash.queue.length);
			// console.log('* hash.organized.length: ', hash.organized.length);
			// console.log('* hash.processed.length: ', hash.processed.length);
			// console.log('* err: ', err);
			// console.log('**********************************')


			// callback
			callback(err);
		});

	},



	process : function (hash, callback) {

		var entries = hash.organized,
		    ops = [];

		// console.log('**********************************')
		// console.log('* process > start > entries : ', entries);
		// console.log('* hash.queue.length: ',     hash.queue.length);
		// console.log('* hash.organized.length: ', hash.organized.length);
		// console.log('* hash.processed.length: ', hash.processed.length);
		// console.log('**********************************')


		// iterate over all files and check for interesting things
		entries.forEach(function (entry) {

			var files = entry.files;

			// console.log('* entries forEach() entry:', entry);


			// check for geo files
			files.forEach(function (file) {

				// console.log('* files.forEach() file: ', file);

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
				if (file.slice(-8) == '.topojson') {		// do more serious test? ie. if has Topology etc..
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
			});	


			// process image files
			if (entry.type == 'image') {
				// console.log('* adding image crunch, entry: ', entry);
				ops.push(function (cb) {

					// add to image cruncher     // callback
					crunch._processImage(entry, function (err, results) {
						cb(err, results);
					});
				});
			}

			// // process docs
			// if (entry.type == 'document') {
			// 	console.log('adding docs..., entry: ', entry);
			// 	ops.push(function (cb) {



			// 	});
			// }


		}, this);

		// process files
		async.parallel(ops, function (err, results) {
			if (err) console.error('process async err: ', err);
			

			results.forEach(function (entry) {
				// add file to hash
				hash.processed.push(entry);

				// console.log('===>> after process: entry: ', entry);

				// remove from queue
				_.remove(hash.organized, function (rf) {
					// console.log('___remove: rf.uuid == entry.ruuid => ' + rf.uuid + ' == ' + entry.ruuid);
					// console.log(rf);
					return rf.ruuid == entry.ruuid;
				});

			})

			// console.log('**********************************')
			// console.log('* fn: upload.process * DONE: RESULTS: ', results);	// []
			// console.log('* hash.queue.length: ',     hash.queue.length);
			// console.log('* hash.organized.length: ', hash.organized.length);
			// console.log('* hash.processed.length: ', hash.processed.length);
			// console.log('**********************************')


			callback(err);
		});


	},


	cleanFiles : function (hash, callback) {

		var files = hash.processed.slice();

		// console.log('**********************************')
		// console.log('* cleanFiles > start ');
		// console.log('* hash.queue.length: ',     hash.queue.length);
		// console.log('* hash.organized.length: ', hash.organized.length);
		// console.log('* hash.processed.length: ', hash.processed.length);
		// console.log('* files length: ', files.length);
		// console.log('**********************************')

		files.forEach(function (file) {
			
			// console.log('**********************************')
			// console.log('*** cleaning files: ', file);
			// console.log('**********************************')

			delete file.temporaryPath;
			delete file.permanentPath;
			delete file.ruuid;
			// delete file.originalFilename;

			// console.log('* cleaned file:', file.uuid);
			
			// add to cleaned
			hash.cleaned.files.push(file);

			// if layer, also add to layers (for creating Layer())
			if (file.type == 'layer') hash.cleaned.layers.push(file);

			// remove from queue
			_.remove(hash.processed, function (p) { return p.uuid == file.uuid; });

		});


		callback(null, hash);
	},

	// save files to appropriate db entries
	// if just file (image, doc, etc), then just register file
	// if layer - then register file and layer
	// 
	// 
	// 
	register : function (hash, callback) {
	
		// console.log('**********************************');
		// console.log('****** REGISTER FILES ************');
		// console.log('**********************************');
		// console.log('* hash.queue.length: ',     hash.queue.length);
		// console.log('* hash.organized.length: ', hash.organized.length);
		// console.log('* hash.processed.length: ', hash.processed.length);
		// console.log('* hash.cleaned.files.length: ',   hash.cleaned.files.length);
		// console.log('* hash.cleaned.layers.length: ',   hash.cleaned.layers.length);
		// console.log('**********************************')

		if (hash.queue.length > 0)     console.log('Leftovers from queue: ',     hash.queue);
		if (hash.organized.length > 0) console.log('Leftovers from organized: ', hash.organized);
		if (hash.processed.length > 0) console.log('Leftovers from processed: ', hash.processed);


		var files = hash.cleaned.files,
		    layers = hash.cleaned.layers,
		    ops = [];

		var done = {
			files : [],
			layers : []
		}

		files.forEach(function (file) {

			// console.log('file...');
			// console.log('*********************');
			// console.log('* File: ');
			// console.log(file);
			// console.log('*********************');

			var f;
			var name;
			var user = hash.req.user;
			if (file.files[0]) name = file.files[0].split('.')[0];

			// console.log('req.user: ', user);

			// create file
			ops.push(function (cb) {

				// create new File
				f 			= new File();
				f.uuid 			= file.uuid;
				f.createdBy 		= user.uuid;
				f.createdByName    	= user.firstName + ' ' + user.lastName;
				f.files 		= file.files;
				f.access.users 		= [user.uuid];	
				f.access.projects 	= [hash.req.body.project];
				f.name 			= file.name || file.originalFilename;
				f.description 		= file.description;
				f.type 			= file.type;
				f.format 		= file.format;
				f.dataSize 		= file.size;
				f.data 			= file.data;


				File.create(f, function (err, doc) {
					// console.log('Saved file!', doc);
					done.files.push(doc);
					cb(err, doc);
				});

			});

		}, this);


		layers.forEach(function (l) {

			// create file
			ops.push(function (cb) {

				var layer 		= new Layer();
				layer.uuid 		= 'layer-' + uuid.v4();
				layer.title 		= l.name || l.originalFilename;
				layer.description 	= 'Layer description';
				layer.legend 		= 'Layer legend';
				layer.data.geojson 	= l.data.geojson;		// geojson-adlskmdsl-adsdsd.geojson
				layer.file 		= l.uuid;

				console.log('====> l: ', l);
				if (l.metadata) layer.metadata = l.metadata;

				Layer.create(layer, function (err, doc) {
					// console.log('Saved layer!', doc);
					done.layers.push(doc);
					cb(err, doc);
				});

			});
			
		}, this);


		async.parallel(ops, function (err, results) {
			if (err) console.error('Register error: ', err, hash.req);
		
			// console.log('**********************************');
			// console.log('****** REGISTER FILES DONE: ', results);
			// console.log('**********************************');

			var projectUuid = hash.req.body.project;

			// save and return
			upload.saveToProject(done, projectUuid, function (err, done) {
				hash.done = done;
				callback(err);
			});

		});


		
	},

	// save file to project (file, layer, project id's)
	saveToProject : function (done, pid, callback) {

		Project
		.findOne({'uuid' : pid })
		.exec(function (err, project) {

			done.files.forEach(function (f) {
				project.files.push(f._id);
			})

			done.layers.forEach(function (l) {
				project.layers.push(l._id);
			})
			
			project.markModified('files');
			project.markModified('layers');

			project.save(function (err) {
				// console.log('saved!: err:', err);
				callback(err, done);
			});
		});

	},



	// parse req files into array with uuid
	_parseReqFiles : function (req) {
		var r = req.files.file,
		    files = _.isArray(r[0]) ? r[0] : r,
		    list = [];
		for (f in files) {
			var file = files[f];
			file.uuid = 'req-file-' + uuid.v4();
			list.push(file);
		}
		return list;
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

	_getRelativePath : function (folder, file) {

		var originalFilename = fspath.basename(file);
		var rel = file.split(folder);

		// console.log('rel: ', rel);

		if (rel[1] == '/' + originalFilename) {
			// console.log('NO RELATIVE PATH!');			// hacky
			return false;
		} else {
			var rel3 = rel[1].split(originalFilename);
			var rel4 = rel3[0].substring(1)

			// console.log('RELATIVE PATH::: => ', rel4); // ok
			return rel4;
		}

	},


	unzip : function (entry, hash, callback) {

		// set folder
		entry.folder = FILEFOLDER + entry.uuid;



		// unzip
		var ops = [];

		ops.push(function (cb) {
			var cmd = 'unzip -o -d "' + entry.folder + '" "' + entry.temporaryPath + '"'; 	// to folder .shp
			// console.log('** Unzipping: cmd: ', cmd);
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
					// console.log('** Diving: file: ', file);

					var originalFilename = fspath.basename(file);

					// get relative path if there's a folder inside the zip
					var relativePath = upload._getRelativePath(entry.folder, file);


					var queueFile = {
						originalFilename : originalFilename,
						relativePath : relativePath,
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


					// check if files should be reorganized
					if (upload._reorganizable(queueFile)) {
						// console.log('####################')
						// console.log('_reorganizable!')
						// console.log(originalFilename);
						// console.log('####################')
						hash.queue.push(queueFile);

					// else just push to entry filelist
					} else {
						entry.files.push(originalFilename);
						if (relativePath) entry.relativePath = relativePath;
						// console.log('** DONE ZIP => ', entry);
					}

				

					
				}, 

				
				cb // final callback

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
			var cmd = 'tar xzf "' + entry.temporaryPath + '" -C "' + entry.folder + '"';
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
					// var name = fspath.basename(file);
					// entry.files.push(name);

					var originalFilename = fspath.basename(file);

					var queueFile = {
						originalFilename : originalFilename,
						path : file, 
						uuid : uuid.v4()
					}

					// check if files should be reorganized
					if (upload._reorganizable(queueFile)) {
						// console.log('########## tar ##########')
						// console.log('_reorganizable!')
						// console.log(originalFilename);
						// console.log('####################')
						hash.queue.push(queueFile);

					// else just push to entry filelist
					} else {
						entry.files.push(originalFilename);
					}
				}, 
				
				cb // callback
			);
		});

		async.series(ops, function (err) {
			if (err) console.error('untar async err: ', err);
			callback(err, entry);
		});

	},


	move : function (entry, callback) {

		entry.folder 	    = FILEFOLDER + entry.uuid;
		entry.permanentPath = entry.folder + '/' + entry.originalFilename;
	
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
			entry.files.push(entry.originalFilename);
			// hash.processed.push(entry);			// added to fix .docx etc problem
			callback(err, entry);
		});

	},

	

	_getType : function (file) {
		// console.log('file: ', file);
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

		// shapefile parts
		var mandatory 	= ['.shp', '.shx', '.dbf'];
		var optional  	= ['.prj', '.sbn', '.sbx', '.fbn', '.fbx', '.ain', '.aih', '.ixs', '.mxs', '.atx', '.shp.xml', '.cpg'];
		if (mandatory.indexOf(name.slice(-4)) > -1) return ['shape', 'partialshape'];
		if (optional.indexOf(name.slice(-4)) > -1)  return ['shape', 'partialshape'];

		// unknown
		return ['unknown', 'unknown'];
	},

	// helper to determine if file should be run thru queue again
	_reorganizable : function (file) {

		// get type and extension
		var stat = upload._getType(file);
		var ext = stat[0];
		var type = stat[1];

		if (type == 'archive') return true;
		if (type == 'image') return true;
		if (type == 'document') return true;
		if (type == 'partialshape') return false;

		return false;
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





}