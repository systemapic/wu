var fss = require("q-io/fs");
var fs = require('fs');
var Q = require('q');
var async = require('async');
var util = require('util');
var uuid = require('node-uuid');
var File = require('../models/file');
var Layer = require('../models/layer');
var Project = require('../models/project');
var dive = require('dive');
var fspath = require('path');

var crunch = require('../routes/crunch');


module.exports = geo = {


	do : function (req, res) {

		console.log('body: ', req.body);

		// set basic globals
		this.req 	= req;
		this.res 	= res;
		this.errors 	= [];

		//check if auth
		if (!req.isAuthenticated()) { 
			this.addError({'error' : 'Not authenticated.'})
			this.finish();
			return;
		}

		// set more globals
		this.useruuid 		= req.user.uuid;
		this.projectuuid 	= req.body.project || '';
		this.processing 	= 0;
		this.processed 		= 0;
		this.doneFiles 		= [];
		this.uploadId 		= 'upload-' + uuid.v4();
		
		// start by a checking file
		this.check();

	},

	check : function () {

		// check what it is, 
		// unzip if needed, 
		// get list of files, 
		// check if similar files, 
		// put into arrays of similar files
		console.log('----- first check: -----');
		console.log('file: ', this.req.files.file);
		console.log('body: ', this.req.body);
		console.log('_________ check _________')


		// check if zip and unzip
		this.file = this.req.files.file.originalFilename; // UNEP-EDE__girls_boys_prim_ed_rate__1398798722.tar.gz
		this.path = this.req.files.file.path;		  // /tmp/temfiles.gz  <- actual path of a file

		// untar
		if (this.file.slice(-7).toLowerCase() == '.tar.gz') return this.untar();

		// unzip
		if (this.file.slice(-4).toLowerCase() == '.zip') return this.unzip();

		// checkout the files
		this.checkout();
		
	},

	checkout : function () {

		console.log('checkout()');

		// layers
		if (this.file.slice(-8).toLowerCase() == '.geojson') 	return this.makedir('geojson', 'layer');
		if (this.file.slice(-5).toLowerCase() == '.json') 	return this.makedir('json',     'layer');
		if (this.file.slice(-4).toLowerCase() == '.svg') 	return this.makedir('svg',      'layer');
		if (this.file.slice(-4).toLowerCase() == '.kml') 	return this.makedir('kml',      'layer');

		// todo: shapefiles uploaded not as zip... (not v important)

		// images
		if (this.file.slice(-5).toLowerCase() == '.jpeg') 	return this.makedir('jpg',  'image');
		if (this.file.slice(-4).toLowerCase() == '.jpg') 	return this.makedir('jpg',  'image');
		if (this.file.slice(-4).toLowerCase() == '.gif') 	return this.makedir('gif',  'image');
		if (this.file.slice(-4).toLowerCase() == '.png') 	return this.makedir('png',  'image');
		if (this.file.slice(-5).toLowerCase() == '.tiff') 	return this.makedir('tiff', 'image');

		// docs
		if (this.file.slice(-4).toLowerCase() == '.pdf') 	return this.makedir('pdf',  'document');
		if (this.file.slice(-4).toLowerCase() == '.doc') 	return this.makedir('doc',  'document'); 
		if (this.file.slice(-5).toLowerCase() == '.docx') 	return this.makedir('docx', 'document');
		if (this.file.slice(-4).toLowerCase() == '.txt') 	return this.makedir('txt',  'document');


		// else, create a folder and dump file
		return this.makedir('unknown', 'file'); // unknown format
		
	},

	makedir : function (extension, type) {
		var that = this;
		
		console.log('makedir(' + extension + ',' + type + ')');

		var fid 	= 'file-' + uuid.v4();
		var folder 	= '/var/www/data/geo/' + fid;
		var path 	= this.path; // where file is now
		var file 	= this.file; // just filename





		// hijack stack, this ends here, do rest in crunch
		if (type == 'image') return crunch.processImage(this);







		// make dir
		fs.mkdir(folder, function () {

			var from = path; 
			var to   = folder + '/' + file;
			var name = file;

			// set default name for file (without extension)
			name = name.replace('.' + extension, '');
			

			fs.rename(from, to, function (err) {
			
				// add file to done list
				that.addDone( {
					'type' 	 : type,
					'format' : extension,
					'files'  : file,
					'uuid'   : fid,
					'name'   : name,
				});

				// we're done!
				that.process_done();

			})	
		})
	},


	dive : function () {
		
		this.divedFiles = [];

		// check all files in this.tmpfolder recursively, and just copy the files we can use (.shp, .geojson, .kml, etc)
		dive(this.tmpfolder, 

			// each file callback
			function(err, file) {
				this.geo.divedFiles.push(file);
			}, 

			// callback
			this.dived
		);
	
	},

	dived : function () {
		this.geo.process();
	},


	

	unzip : function () {
		console.log('is zip file, unzipping!');

		// set zip cmd
		this.tmpfolder	= '/var/www/data/tmp/tmp-' + uuid.v4();
		var cmd 	= 'unzip -o -d ' + this.tmpfolder + ' ' + this.path; 	// to folder .shp

		// unzip
		var exec = require('child_process').exec;
		var that = this;
		exec(cmd, function (err, stdout, stdin) {

			console.log('==========');
			console.log('=  exec  =')
			console.log('= unzip! =')
			console.log('----------')
			console.log('err: ', err);

			if (err) {
				console.log('ERROR: got unzip error.');
				var error = {
					'error' : 'Unzip error.',
					'err'	: err
				}

				that.addError(error)
				that.process_done();
			}

			// if not, check folder contents
			that.dive();

		});
	},


	untar : function () {
		console.log('untarring...');

		// set tar cmd
		this.tmpfolder	= '/var/www/data/tmp/tmp-' + uuid.v4();
		var cmd 	= 'tar xzf ' + this.path + ' -C ' + this.tmpfolder;
		var that 	= this;

		// have to create folder
		fs.mkdir(this.tmpfolder, function (err) {
			if (err) { console.log('error! ', err); return;}
			
			// untar
			var exec = require('child_process').exec;
			exec(cmd, function (err, stdout, stdin) {

				console.log('==========');
				console.log('=  exec  =')
				console.log('= un tar =')
				console.log('----------')
				console.log('err: ', err);

				if (err) {
					var error = {
						'error' : 'Untar error.',
						'err'	: err
					}

					// add error, we're done!
					that.addError(error)
					that.process_done();
					return;
				}

				// read folder
				that.dive();

			}); 
		});
	},


	process : function () {
		
		// count files for async finish
		this.processing += 10;	

		// iterate over all files and check for interesting things
		this.divedFiles.forEach(function(elem, i, arr) {

			// .shp
			if (elem.slice(-4) == '.shp') {
				this.processing += 1;
				this.process_shp(elem);
				return;
			}

			// .json
			if (elem.slice(-5) == '.json') {
				this.processing += 1;
				this.process_json(elem);
				return;
			}

			// .geojson
			if (elem.slice(-8) == '.geojson') {
				this.processing += 1;
				this.process_geojson(elem);
				return;
			}

			// kml
			if (elem.slice(-4) == '.kml') {
				this.processing += 1;
				this.process_kml(elem);
				return;
			}	



		}, this);
		
		// async count hack
		this.processed += 10;


	},

	process_shp : function (shp) {
		console.log('Processing shapefile ', shp);
		
		// shape extensions
		var mandatory 	= ['.shp', '.shx', '.dbf'];
		var optional  	= ['.prj', '.sbn', '.sbx', '.fbn', '.fbx', '.ain', '.aih', '.ixs', '.mxs', '.atx', '.shp.xml', '.cpg'];
		
		// path vars
		var base 	= shp.slice(0, -4);			// full path without extension
		var nopathbase 	= fspath.basename(shp, '.shp');
		var id 		= uuid.v4();
		var folder 	= '/var/www/data/geo/' + 'file-' + id;

		// create unique folder for file(s)
		fs.mkdir(folder, function (err) {

			// iterate over each mandatory shapefile
			var parallels = [];
			mandatory.forEach(function(elem, i, arr) {
				
				var to   = folder + '/' + nopathbase + elem;
				var from = base + elem;
			
				// push job to async queue
				parallels.push(function (callback) {
					// move to folder
					fs.rename(from, to, function (err) {
						if (err) {
							callback(null, 'MISSINGFILE=' + from + ', ext: ' + elem);
						} else {
							callback(null, to);
						}
					});
				});
			});

			// for each optional shapefile
			optional.forEach(function(elem, i, arr) {
				
				var to   = folder + '/' + nopathbase + elem;
				var from = base + elem;
				
				// queue job to async
				parallels.push(function (callback) {
					// move to folder
					fs.rename(from, to, function (err) {
						if (err) { 
							// write 'false' to the result
							callback(null, false); 
						} else { 
							// writes to-path as result
							callback(null, to); 
						}
					});
				});
			});
		


			// rename asyncly
			async.parallel(parallels, function (err, results) {
				
				// filter out falses
				var arr = results.filter(function(n){ return n != false });
				
				// check for mandatory files
				var invalid = false;
				var theshp  = '';
				arr.forEach(function (elem, j, arr) {
					var i = elem.indexOf('MISSINGFILE');
					if (i > -1) {
						// push error to stack
						invalid = {'error' : 'Missing shapefile.', 'file' : elem } ;
						this.geo.addError(invalid);
					}
					if (elem.indexOf('.shp') > -1) {
						theshp = elem;
					}
				});
				
				// check if valid
				if (!invalid) {
					// create geojson from shp
					this.geo.convert_shp(arr, id);
				
				} else {
					// invalid, this thread is done
					this.geo.process_done(false);
				}
			});
		})
		
	},

	convert_shp : function (shapes, id) {
		console.log('converting shp!:', shapes);
		var that = this;

		// id = shp file id

		// get .shp file
		for (s in shapes) {
			if (shapes[s].slice(-4) == '.shp') { var shp = shapes[s]; }
		}
		
		// set vars
		var gj 	  = shp + '.geojson';
		var file  = fspath.basename(gj);
		var fuuid = 'file-' + id;

		// clean up filenames
		var filenames = [];
		shapes.forEach(function (shape, i, arr) {
			filenames.push(fspath.basename(shape));
		});
		
		// execute cmd line conversion 
		// var cmd = 'ogr2ogr -f "GeoJSON" ' + gj + ' ' + shp; 
		var cmd = 'mapshaper -p 0.1 --encoding utf8 -f geojson -o ' + gj + ' ' + shp;
		console.log('================= m a p s h a p e r ==========================');
		var exec = require('child_process').exec;
		exec(cmd, function (err, stdout, stdin) {
			
			console.log('===========');
			console.log('=  exec   =')
			console.log('= ogr2ogr =')
			console.log('-----------')
			console.log('exec done:');
			console.log('err: ', err);
			console.log('stdout: ', stdout);
			console.log('stdin: ', stdin);
			console.log('cmd was: ', cmd);
			console.log('.geojson is ', gj);

			if (err) {
				that.addError(err);
				that.process_done();
				return;
			}


			// add new geosjson file
			filenames.push(file);

			// add file to done list
			that.addDone( {
				'type' 	  : 'layer',
				'format'  : ['geojson', 'shapefile'],
 				'files'   : filenames,
				'uuid'    : fuuid,
				'name'    : file,
				'version' : 1,	// cause it's new
				//'uploadid' : this.geo.uploadId		// same upload
			});

			// go do something else
			that.process_done();
		})

	},

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
					this.geo.addError(err);
					this.geo.process_done();

				} else { 

					console.log('JSON folder created: ', folder);
					console.log('for this json: ', json);

					
					this.geo.addDone( {
						'type' 	   : 'layer',
						'format'   : 'geojson',
						'file'     : file,
						'files'    : to,
						'uuid'     : 'file-' + id,
						'uploadid' : this.geo.uploadId

					});
					

					// writes to-path as result
					this.geo.process_done(json); 
				
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