// app/routes/pixels.js rsub

// database schemas
var Project 	= require('../models/project');
var Clientel 	= require('../models/client');	// weird name cause 'Client' is restricted name
var User  	= require('../models/user');
var File 	= require('../models/file');
var Layers 	= require('../models/layer');

// file handling
var fs 		= require('fs-extra');
var utf8 	= require("utf8");

// utils
var async 	= require('async');
var util 	= require('util');
var request 	= require('request');
var uuid 	= require('node-uuid');
var _ 		= require('lodash-node');
var zlib 	= require('zlib');
var uploadProgress = require('node-upload-progress');
var crypto      = require('crypto');
var nodemailer  = require('nodemailer');
var gm 		= require('gm');



// globals
var IMAGEFOLDER = '/var/www/data/images/';


// function exports
module.exports = pixels = {



	handleImage : function (path, callback) {

		var entry = {};
		var file = path;
		var ops = {};
	
		ops.dimensions = function (cb) {
			// get image size
			pixels.getImageSize(file, cb);
		};

		ops.identity = function (cb) {
			// get exif size
			pixels.getIdentify(file, cb);
		};
		
		ops.dataSize = function (cb) {
			// get file size in bytes
			pixels.getFileSize(file, cb);
		};

		// move raw file into /images/ folder
		ops.rawFile = function (cb) {

			// copy raw file
			pixels.copyRawFile(file, cb);
		};

		// run all ops async in series
		async.series(ops, function (err, results) {
			if (err) console.error('_processImage err: ', err);
			
			var exif 	= results.identity,
			    dimensions 	= results.dimensions,
			    dataSize 	= results.dataSize,
			    file 	= results.rawFile;

			entry.data 		     = entry.data || {};
			entry.data.image 	     = entry.data.image || {};
			entry.data.image.dimensions  = dimensions;
			entry.dataSize        	     = dataSize;
			entry.data.image.created     = pixels.getExif.created(exif);
			entry.data.image.gps         = pixels.getExif.gps(exif);
			entry.data.image.cameraType  = pixels.getExif.cameraType(exif); 
			entry.data.image.orientation = pixels.getExif.orientation(exif);
			entry.data.image.file        = file;

			console.log('**********************************')
			console.log('* fn: crunch._processImage: * DONE! entry: ', entry);
			console.log('* results: ', results);
			console.log('**********************************')

			// return results to whatever callback
			callback(err, entry);
		});

	},





















	// process images straight after upload
	_processImage : function (entry, callback) {
		console.log('**********************************')
		console.log('* fn: crunch._processImage * entry: ', entry);
		console.log('**********************************')


		var file = entry.permanentPath,
		    ops = {};
	
		ops.dimensions = function (cb) {
			// get image size
			pixels.getImageSize(file, cb);
		};

		ops.identity = function (cb) {
			// get exif size
			pixels.getIdentify(file, cb);
		};
		
		ops.dataSize = function (cb) {
			// get file size in bytes
			pixels.getFileSize(file, cb);
		};

		// move raw file into /images/ folder
		ops.rawFile = function (cb) {

			// move raw file
			pixels.moveRawFile(file, cb);
		};

		// run all ops async in series
		async.series(ops, function (err, results) {
			if (err) console.error('_processImage err: ', err);
			
			console.log('*** _processImage async DONE: reults: ', results);

			var exif 	= results.identity,
			    dimensions 	= results.dimensions,
			    dataSize 	= results.dataSize,
			    file 	= results.rawFile;


			entry.data.image 	     = entry.data.image || {};
			entry.data.image.dimensions  = dimensions;
			entry.dataSize        	     = dataSize;
			entry.data.image.created     = pixels.getExif.created(exif);
			entry.data.image.gps         = pixels.getExif.gps(exif);
			entry.data.image.cameraType  = pixels.getExif.cameraType(exif); 
			entry.data.image.orientation = pixels.getExif.orientation(exif);
			entry.data.image.file        = file;

			console.log('**********************************')
			console.log('* fn: crunch._processImage: * DONE! entry: ', entry);
			console.log('* results: ', results);
			console.log('**********************************')

			// return results to whatever callback
			callback(err, entry);
		});
	},





	// helper fn to parse exif
	getExif : {
		created : function (exif) {
			var time = '';
			var profile = exif['Profile-EXIF']
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
			var altitude 	= pixels.getExif.getAltitude(profile);
			var direction 	= pixels.getExif.getDirection(profile);
			var coords 	= pixels.getExif.getCoords(profile);
			
			var gps = {
				lat : coords.lat,
				lng : coords.lng,
				alt : altitude,
				dir : direction
			}
	                return gps;
		},

		cameraType : function (exif) {
			var cameraType = '';
			var profile = exif['Profile-EXIF']
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
			}

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
			console.log('Altitude!: ', altitude);
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
			console.log('Direction!: ', direction);
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
		},

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
		var newPath = IMAGEFOLDER + newFile;

		// move file
		fs.rename(oldPath, newPath, function (err) {
			if (err) console.log('fs.rename error: ', err);
			callback(err, newFile);
		});
	},

	// copy raw file to /images/ folder
	copyRawFile : function (oldPath, callback) {

		var newFile = 'image-raw-' + uuid.v4();
		var newPath = IMAGEFOLDER + newFile;

		// copy file
		fs.copy(oldPath, newPath, function (err) {
			if (err) console.log('copyRawFile err: ', err);
			callback(null, newFile);
		});
	},

	
	// add file to project
	addFileToProject : function (file, projectUuid) {
		Project
		.findOne({uuid : projectUuid})
		.exec(function (err, project) {
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


		// basic options
		var width   	= parseInt(option.width) || null;
		var height  	= parseInt(option.height) || null;
		var quality 	= parseInt(option.quality) || 60;			// default quality 60

		console.log('width/height: ', width, height);

		// crop options
		var cropX   	= option.crop.x || 0;					// default crop is no crop, same dimensions and topleft
		var cropY   	= option.crop.y || 0;
		var cropW	= option.crop.w || width;
		var cropH 	= option.crop.h || height;
		

		// file options
		var path    	= option.file; 						// original file
		var newFile 	= 'image-' + uuid.v4();					// unique filename
		var newPath 	= IMAGEFOLDER + newFile;				// modified file

		console.log('resizeImage OPTION: ', option);


		gm.prototype.checkSize = function (action) {
			action()
			return this;
		}

		// do crunch magic
		gm(path)
		.resize(width)						// todo: if h/w is false, calc ratio					
		// .then()
		.autoOrient()
		.crop(cropW, cropH, cropX, cropY)				// x, y is offset from top left corner
		.noProfile()							// todo: strip of all exif?
		.setFormat('JPEG')						// todo: watermark systemapic? or client?
		.quality(quality)
		.write(newPath, function (err) {
			if (err) console.log('resizeImage error: ', err);
			
			var result = {
				file   : newFile,
				height : height,
				width  : width
			}

			// return error and file
			callback(err, result);

		});
	},



	getIdentify : function (path, callback) {
		gm(path)
		.identify(function (err, exif){
			callback(err, exif);							
		});
	},

















	// serve images without wasting a pixel
	servePixelPerfection : function (req, res) {
		// todo: more auth!

		// url query ?width=300&height=400&etc...
		console.log('query: ', req.query);

		// todo: crop queries, etc.

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


		if (!req.query) {
			console.log('no query!')
			return res.end();
		}

		// if raw quality requested, return full image
		if (raw) return pixels.returnRawfile(req, res);

		// async waterfall (each fn passes results into next fn)
		var ops = [];

		// find file
		ops.push(function (callback) {

			File
			.findOne({uuid : fileUuid})
			.exec(function (err, file) {
				if (!file) return callback(err, { 
					image : false, 
					rawfile : false
				});
				
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
				}			

				callback(err, vars);
			});
		});

		// create image if not found
		ops.push(function (vars, callback) {

			var image = vars.image;
			var rawfile = vars.rawfile;

			// return image if found
			if (image) {
				image.existing = true;
				return callback(null, image);
			}

			// if not found, create image
			var template = {
				file   : IMAGEFOLDER + rawfile,
				width  : width,
				height : height,
				quality : quality,
				crop : {
					x : cropX,
					y : cropY,
					h : cropH,
					w : cropW
				}
			}

			// create image with dimensions
			pixels.resizeImage(template, callback);

		});

		// image found or created
		ops.push(function (result, callback) {

			// add image to File object if it was created
			if (!result.existing) pixels.addImageToFile(result, fileUuid);

			// return result
			callback(null, result);
			
		});


		// run all async ops
		async.waterfall(ops, function (err, result) {

			// all done, serve file
			pixels.returnImage(req, res, result);

		});
		
	},


	// add crunched image to File object
	addImageToFile : function (result, fileUuid, callback) {
		File
		.findOne({uuid : fileUuid})
		.exec(function (err, file) {
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
		var path = IMAGEFOLDER + imageFile.file;
		res.sendfile(path, {maxAge : 10000000});	// cache age, 115 days.. cache not working?
	},


	returnRawfile : function (req, res) {

		// get file uuid
		var fileUuid = req.params[0]; 

		// get raw file
		File
		.findOne({uuid : fileUuid})
		.exec(function (err, file) {
			if (!file) return callback(err);

			// return raw file
			var imageFile = file.data.image;
			return pixels.returnImage(req, res, imageFile);
		});
		return;
	},

	




}



