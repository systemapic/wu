// API: api.pixels.js

// database schemas
var Project 	= require('../models/project');
var Clientel 	= require('../models/client');	// weird name cause 'Client' is restricted name
var User  		= require('../models/user');
var File 		= require('../models/file');
var Layers 		= require('../models/layer');

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
var crypto  = require('crypto');
var fspath 	= require('path');
var mapnik 	= require('mapnik');
var request 	= require('request');
var nodepath    = require('path');
var formidable  = require('formidable');
var nodemailer  = require('nodemailer');
var uploadProgress = require('node-upload-progress');
var mapnikOmnivore = require('mapnik-omnivore');
var httpStatus = require('http-status');

// api
var api = module.parent.exports;

// function exports
module.exports = api.pixels = {

	// #########################################
	// ###  API: Create Snapshot             ###
	// #########################################
	snap : function (req, res, next) {
		var ops = [];
		var view = req.body || {};
		console.log("VIEW", req.body);
		var user = req.user;
		var script_path = api.config.path.tools + 'phantomJS-snapshot.js';
		var filename = 'snap-' + api.utils.getRandom(10) + '.png';
		var outPath = api.config.path.image + filename;
		var options = {
			url : api.config.portalServer.uri,
			outPath : outPath,
			view : view
		};
		var snapCommand = [
			"--ssl-protocol=tlsv1",
			script_path,
			JSON.stringify(options)
		];
		var errorMessage = {};

		// phantomJS: create snapshot
		ops.push(function (callback) {
			var util  = require('util');
			var spawn = require('child_process').spawn;
			var ls    = spawn('phantomjs', snapCommand);

			console.log('spawning!');

			ls.stdout.on('data', function (data) {
				console.log('data:', data);

				var dataTextObj = api.utils.parse(data) || {};

				if (dataTextObj.error) {
					errorMessage = dataTextObj.error;
				}

				console.log('stdout: ' + data);
			});

			ls.stderr.on('data', function (data) {
				console.log('stderr: ' + data);
			});

			ls.on('exit', function (code) {
				console.log('child process exited with code ' + code);
				callback(code, code);
			});
		});

		// create File
		ops.push(function (callback) {
			var f = new File();

			f.uuid = 'file-' + uuid.v4();
			f.createdBy = user.uuid;
			f.createdByName = user.firstName + ' ' + user.lastName;
			f.files = filename;
			f.access.users = [user.uuid];
			f.name = filename;
			f.description = 'Snapshot';
			f.type = 'image';
			f.format = 'png';
			f.data.image.file = filename; 

			f.save(function (err, doc) {
				callback(err, doc);
			});
		});

		async.series(ops, function (err, result) {

			// get file
			var created_snap = result[1];
			
			if (result[0] == 1) {
				next(errorMessage);
			}

			console.log(result);
			// return to client
			res.send({
				image : created_snap && created_snap.uuid || null,
				error : err || null
			});
		});

	},


	handleImage : function (path, callback) {

		var entry = {};
		var file = path;
		var ops = {};
	
		ops.dimensions = function (cb) {
			// get image size
			api.pixels.getImageSize(file, cb);
		};

		ops.identity = function (cb) {
			// get exif size
			api.pixels.getIdentify(file, cb);
		};
		
		ops.dataSize = function (cb) {
			// get file size in bytes
			api.pixels.getFileSize(file, cb);
		};

		// move raw file into /images/ folder
		ops.rawFile = function (cb) {
			// copy raw file
			api.pixels.copyRawFile(file, cb);
		};

		// run all ops async in series
		async.series(ops, function (err, results) {
			if (err || !results) return callback(err || 'No results.');

			var exif 	= results.identity,
			    dimensions 	= results.dimensions,
			    dataSize 	= results.dataSize,
			    file 	= results.rawFile;

			entry.data 		     = entry.data || {};
			entry.data.image 	     = entry.data.image || {};
			entry.data.image.dimensions  = dimensions;
			entry.dataSize        	     = dataSize;
			entry.data.image.file        = file;
			entry.type 		     = 'image';
			
			if (exif) {
				entry.data.image.created     = api.pixels.getExif.created(exif);
				entry.data.image.gps         = api.pixels.getExif.gps(exif);
				entry.data.image.cameraType  = api.pixels.getExif.cameraType(exif); 
				entry.data.image.orientation = api.pixels.getExif.orientation(exif);
			}

			// return results to whatever callback
			callback(null, entry);
		});
	},

	// process images straight after upload
	_processImage : function (entry, callback) {
		console.log('**********************************');
		console.log('* fn: crunch._processImage * entry: ', entry);
		console.log('**********************************');


		var file = entry.permanentPath,
		    ops = {};
	
		ops.dimensions = function (cb) {
			// get image size
			api.pixels.getImageSize(file, cb);
		};

		ops.identity = function (cb) {
			// get exif size
			api.pixels.getIdentify(file, cb);
		};
		
		ops.dataSize = function (cb) {
			// get file size in bytes
			api.pixels.getFileSize(file, cb);
		};

		// move raw file into /images/ folder
		ops.rawFile = function (cb) {

			// move raw file
			api.pixels.moveRawFile(file, cb);
		};

		// run all ops async in series
		async.series(ops, function (err, results) {
			if (err || !results) return callback(err || 'No results.');

			var exif 	= results.identity,
			    dimensions 	= results.dimensions,
			    dataSize 	= results.dataSize,
			    file 	= results.rawFile;

			entry.data.image 	     = entry.data.image || {};
			entry.data.image.dimensions  = dimensions;
			entry.dataSize        	     = dataSize;
			entry.data.image.created     = api.pixels.getExif.created(exif);
			entry.data.image.gps         = api.pixels.getExif.gps(exif);
			entry.data.image.cameraType  = api.pixels.getExif.cameraType(exif); 
			entry.data.image.orientation = api.pixels.getExif.orientation(exif);
			entry.data.image.file        = file;

			// return results to whatever callback
			callback(null, entry);
		});
	},

	// helper fn to parse exif
	getExif : {
		created : function (exif) {
			if (!exif) return;
			var time = '';
			var profile = exif['Profile-EXIF'];
			if (profile) time = profile['Date Time'];			// todo: other date formats
			if (!time) return;
			var s = time.split(/[-: ]/);
 			var date = new Date(s[0], s[1]-1, s[2], s[3], s[4], s[5]);
			time = date.toJSON();
			return time;
		},

		gps : function (exif) {
			var profile = exif['Profile-EXIF'];
			if (!profile) return;

			// get numbers
			var altitude 	= api.pixels.getExif.getAltitude(profile);
			var direction 	= api.pixels.getExif.getDirection(profile);
			var coords 	= api.pixels.getExif.getCoords(profile);
			
			if (!coords) return;

			var gps = {
				lat : coords.lat,
				lng : coords.lng,
				alt : altitude,
				dir : direction
			};
	                return gps;
		},

		cameraType : function (exif) {
			var cameraType = '';
			var profile = exif['Profile-EXIF'];
			if (profile) cameraType = profile['Model'];
			return cameraType;
		},

		orientation : function (exif) {
			var orientation = -1;
			var orientations = {
				'topleft' 	: 1,
				'bottomright'	: 3,		// todo: BottomImageRight 
				'righttop'	: 6, 
				'leftbottom'	: 8 
			};

			// from exif in int format
			var profile = exif['Profile-EXIF'];
			if (profile) {
				orientation = profile.orientation;
				if (orientation) return orientation;
			}

			// try from root orientation
			var o = exif['Orientation'];
			if (o) {
				var text = o.toLowerCase();
				orientation = orientations[text];
				if (orientation) return orientation;
			}

			return -1;
		},

		getAltitude : function (profile) {
			var gpsalt = profile['GPS Altitude'];
			if (!gpsalt) return -1;
			var alt = gpsalt.split('/');
			if (!alt) return -1;
			var x = alt[0];
			var y = alt[1];
			var altitude = parseInt(x) / parseInt(y);
			return altitude;
		},

		getDirection : function (profile) {
			var gpsdir = profile['GPS Img Direction'];
			if (!gpsdir) return -1;
			var dir = gpsdir.split('/');
			if (!dir) return -1;
			var x = dir[0];
			var y = dir[1];
			var direction = parseInt(x) / parseInt(y);
			return direction;
		},

		getCoords : function(exif) {
			// https://github.com/Turistforeningen/dms2dec.js/blob/master/lib/dms2dec.js

			var lat = exif.GPSLatitude || exif['GPS Latitude'];
	                var lon = exif.GPSLongitude || exif['GPS Longitude'];
	 		var latRef = exif.GPSLatitudeRef || exif['GPS Latitude Ref'] || "N";  
	                var lonRef = exif.GPSLongitudeRef || exif['GPS Longitude Ref'] || "W";  

	                if (!lat || !lon) return false;

			var ref = {'N': 1, 'E': 1, 'S': -1, 'W': -1};
			var i;

			if (typeof lat === 'string') {
				lat = lat.split(',');
			}

			if (typeof lon === 'string') {
				lon = lon.split(',');
			}

			for (i = 0; i < lat.length; i++) {
				if (typeof lat[i] === 'string') {
					lat[i] = lat[i].replace(/^\s+|\s+$/g,'').split('/');
					lat[i] = parseInt(lat[i][0], 10) / parseInt(lat[i][1], 10);
				}
			}

			for (i = 0; i < lon.length; i++) {
				if (typeof lon[i] === 'string') {
					lon[i] = lon[i].replace(/^\s+|\s+$/g,'').split('/');
					lon[i] = parseInt(lon[i][0], 10) / parseInt(lon[i][1], 10);
				}
			}

			lat = (lat[0] + (lat[1] / 60) + (lat[2] / 3600)) * ref[latRef];
			lon = (lon[0] + (lon[1] / 60) + (lon[2] / 3600)) * ref[lonRef];

			return {lat : lat, lng : lon}
		}

	},


	getImageSize : function (path, callback) {
		gm(path)
		.size(function (err, size) {
			callback(err, size); 
		});
	},


	getFileSize : function (path, callback) {
 		fs.stat(path, function (err, stats) {
 			callback(err, stats.size);
 		});
	},


	// move raw file to /images/ folder
	moveRawFile : function (oldPath, callback) {

		var newFile = 'image-raw-' + uuid.v4();
		var newPath = api.config.path.image + newFile;

		// move file
		fs.rename(oldPath, newPath, function (err) {
			callback(err, newFile);
		});
	},

	// copy raw file to /images/ folder
	copyRawFile : function (oldPath, callback) {
		var newFile = 'image-raw-' + uuid.v4();
		var newPath = api.config.path.image + newFile;

		// copy file
		fs.copy(oldPath, newPath, function (err) {
			callback(err, newFile);
		});
	},

	
	// add file to project
	addFileToProject : function (file, projectUuid) {
		Project
		.findOne({uuid : projectUuid})
		.exec(function (err, project) {
			if (err || !project) return;

			project.files.push(file._id);
			project.markModified('files');
			project.save(function (err, doc) {
				if (err) console.log('File save error: ', err);
				console.log('File saved to project.');
			});
		});
	},




	// resize single image
	resizeImage : function (option, callback) {
		if (!option) return callback('No options provided.');

		console.log('resizing!');

		// basic options
		var width   	= parseInt(option.width) || null;
		var height  	= parseInt(option.height) || null;
		var quality 	= parseInt(option.quality) || 90;			// default quality 60

		// crop options
		option.crop = option.crop || {};
		var cropX   	= option.crop.x || 0;					// default crop is no crop, same dimensions and topleft
		var cropY   	= option.crop.y || 0;
		var cropW	= option.crop.w || width;
		var cropH 	= option.crop.h || height;
		

		// file options
		var path    	= option.file; 						// original file
		var newFile 	= 'image-' + uuid.v4();					// unique filename
		var newPath 	= api.config.path.image + newFile;				// modified file
		var format 	= option.format || 'jpeg';


		// wtf
		gm.prototype.checkSize = function (action) {
			action();
			return this;
		};

		try {
			// do crunch magic
			gm(path)
			.resize(width)						// todo: if h/w is false, calc ratio					
			.autoOrient()
			.crop(cropW, cropH, cropX, cropY)				// x, y is offset from top left corner
			.noProfile()							// todo: strip of all exif?
			.setFormat(format.toUpperCase())						// todo: watermark systemapic? or client?
			.quality(quality)
			.write(newPath, function (err) {
				if (err) return callback(err);
				
				var result = {
					file   : newFile,
					height : height,
					width  : width,
					path : newPath
				};

				// return error and file
				callback(null, result);

			});

		} catch (e) {
			callback(e);
		}
	},



	getIdentify : function (path, callback) {
		gm(path)
		.identify(function (err, exif){
			callback(err, exif);							
		});
	},





	// cxxxxx 

	serveFitPixelPerfection : function (req, res) {
		if (!req.query) return api.error.missingInformation(req, res);

		// set vars
		var quality     = req.query.quality;
		var imageId     = req.params[0]; 		// 'file-ccac0f45-ae95-41b9-8d57-0e64767ea9df'		
		var fitW        = req.query.fitW;
		var fitH        = req.query.fitH;				
		var newFile 	= 'image-' + uuid.v4();					// unique filename
		var newPath 	= api.config.path.image + newFile;				// modified file
		var imagePath 	= '/data/images/' + imageId;

		api.pixels.getImageSize(imagePath, function (err, size) {
			if (err || !size) return api.error.general(req, res, err || 'No size.');

			var imgWidth = size.width;
			var imgHeight = size.height;
			var imgLandscape;
			var fitLandscape;

			if (imgWidth >= imgHeight) 	imgLandscape = true;
			if (fitW >= fitH) 		fitLandscape = true;

			if ( !fitLandscape && imgLandscape ) {

				// regn ut større bredde enn fitW...
				cropW = fitW * fitH/fitW;

				// Offset the X axis
				cropX = (cropW - fitW) / 2;
				cropY = 0;

			} else {

				cropW = fitW;

				// Find the image proportion
				var prop = imgWidth / cropW;

				// Find the image size with overflow
				cropH = imgHeight / prop;

				cropX = 0;

				// Offset the Y axis
				cropY = (cropH - fitH) / 2;
			}


			quality = 100;

			// do crunch magic
			gm(imagePath)
			.resize(cropW)							// the width of the image BEFORE cropping!
			.autoOrient()
			.crop(
				fitW,	// The actual width of the image 
				fitH, 	// The actual height of the image
				cropX, 	// x, y is offset from top left corner
				cropY
			)
			.noProfile()							// todo: strip of all exif?
			.setFormat('JPEG')						// todo: watermark systemapic? or client?
			.quality(quality)
			.write(newPath, function (err) {
				if (err) return api.error.general(req, res, err);
				res.sendfile(newPath, {maxAge : 10000000});
			});
		});
	},


	serveImagePixelPerfection : function (req, res) {
		if (!req.query) return api.error.missingInformation(req, res);


		// set vars
		var width      = req.query.width;
		var height     = req.query.height;
		var quality    = req.query.quality;
		var imageId    = req.params[0]; 		// 'file-ccac0f45-ae95-41b9-8d57-0e64767ea9df'		
		var cropX      = req.query.cropx;	
		var cropY      = req.query.cropy;
		var cropW      = req.query.cropw;
		var cropH      = req.query.croph;
		var format     = req.query.format;
	
		var imagePath = '/data/images/' + imageId;

		console.log('imageId: ', imageId);

		if (imageId == 'images') return res.send();

		var options = {
			height: height,
			width : width,
			file : imagePath,
			format : format,
			crop : {
				x : cropX,
				y : cropY,
				h : cropH,
				w : cropW
			},
			quality : quality
		};

		// create image with dimensions
		api.pixels.resizeImage(options, function (err, result) {
			if (err || !result) return api.error.general(req, res, err || 'No result.');
			var path = result.path;
			res.sendfile(path, {maxAge : 10000000});
		});
	},			

	serveScreenshot : function (req, res) {
		if (!req.query) return api.error.missingInformation(req, res);

		// set vars
		var image_id = req.params[0]; 		// 'file-ccac0f45-ae95-41b9-8d57-0e64767ea9df'		
		var path = '/data/images/' + image_id;

		// only allow screenshot to go thru
		if (path.indexOf('resized_screenshot.jpg') == -1) return res.send();

		// return screenshot
		res.sendfile(path, {maxAge : 10000000});
	},

	_resizeScreenshot : function (options, callback) {

		var image = options.image; // /data/images/snap-project-8a29019a-e325-46c4-8a51-4691f92632ac-KTKE29.png

		var outPath = image + '.resized_screenshot.jpg';
		var width = 1200;

		// do crunch magic
		gm(image)
		.resize(width)						// todo: if h/w is false, calc ratio					
		.autoOrient()
		.noProfile()							// todo: strip of all exif?
		.quality(90)
		.write(outPath, function (err) {
			if (err) return callback(err);
			var base = outPath.split('/').reverse()[0];

			// return error and file
			callback(null, base);
		});

	},



	// serve images without wasting a pixel
	servePixelPerfection : function (req, res) {
		if (!req.query) return api.error.missingInformation(req, res);


		// set vars
		var width      = req.query.width;
		var height     = req.query.height;
		var quality    = req.query.quality;
		var raw        = req.query.raw;
		var fileUuid   = req.params[0]; 		// 'file-ccac0f45-ae95-41b9-8d57-0e64767ea9df'		
		var cropX      = req.query.cropx;	
		var cropY      = req.query.cropy;
		var cropW      = req.query.cropw;
		var cropH      = req.query.croph;


		// if raw quality requested, return full image
		if (raw) return api.pixels.returnRawfile(req, res);

		// async waterfall (each fn passes results into next fn)
		var ops = [];

		// find file
		ops.push(function (callback) {

			File
			.findOne({uuid : fileUuid})
			.exec(function (err, file) {
				if (err || !file) return callback(err || 'No file.');

				// find image with right dimensions (exactly) // todo: % margins
				var image = _.find(file.data.image.crunched, function (i) {
					if (!i) return false;
					if (_.isObject(i.crop)) i.crop = {}; // prevent errors

					// check if crunched is same dimensions
					return 	parseInt(i.width)   == parseInt(width)    &&  	// width
						parseInt(i.height)  == parseInt(height)   &&  	// height
						parseInt(i.quality) == parseInt(quality)  && 	// quality
						parseInt(i.crop.x)  == parseInt(cropX)    && 	// crop
						parseInt(i.crop.y)  == parseInt(cropY)    && 	// crop
						parseInt(i.crop.h)  == parseInt(cropH)    && 	// crop
						parseInt(i.crop.w)  == parseInt(cropW); 	// crop
						
				});
				
				// return found image (if any)
				var rawfile = file.data.image.file;
				var vars = {
					rawfile : file.data.image.file,
					image : image
				};

				callback(null, vars);
			});
		});

		// create image if not found
		ops.push(function (vars, callback) {
			if (!vars) return callback('Missing vars.');

			var image = vars.image;
			var rawfile = vars.rawfile;

			// return image if found
			if (image) {
				image.existing = true;
				return callback(null, image);
			}

			// if not found, create image
			var template = {
				file   : api.config.path.image + rawfile,
				width  : width,
				height : height,
				quality : quality,
				crop : {
					x : cropX,
					y : cropY,
					h : cropH,
					w : cropW
				}
			};

			console.log('gonna resize: ', template);

			// create image with dimensions
			api.pixels.resizeImage(template, callback);

		});

		// image found or created
		ops.push(function (result, callback) {

			// add image to File object if it was created
			if (!result.existing) api.pixels.addImageToFile(result, fileUuid);

			// return result
			callback(null, result);
			
		});


		// run all async ops
		async.waterfall(ops, function (err, result) {
			if (err || !result) return api.error.general(req, res, err || 'No result.');

			console.log('all done!');

			api.pixels.returnImage(req, res, result);
		});
	},


	// add crunched image to File object
	addImageToFile : function (result, fileUuid, callback) {
		File
		.findOne({uuid : fileUuid})
		.exec(function (err, file) {
			if (err || !file) {
				callback && callback(err || 'No file.');
				return;
			}
			file.data.image.crunched.addToSet(result);	
			file.markModified('data');
			file.save(function (err) {
				if (callback) callback(err, result);
			});
		});
	},


	// send image to client
	returnImage : function (req, res, imageFile) {
		// send file back to client, just need file path
		var path = api.config.path.image + imageFile.file;

		console.log('returnImage', path);
		res.sendfile(path, {maxAge : 10000000});	// cache age, 115 days.. cache not working?
	},


	returnRawfile : function (req, res) {
		var fileUuid = req.params[0]; 

		// get raw file
		File
		.findOne({uuid : fileUuid})
		.exec(function (err, file) {
			if (err || !file) return api.error.general(req, res, err || 'No file.');

			// return raw file
			var imageFile = file.data.image;
			return api.pixels.returnImage(req, res, imageFile);
		});
	}


};