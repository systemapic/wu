// app/routes/crunch.js rsub

// database schemas
var Project 	= require('../models/project');
var Clientel 	= require('../models/client');	// weird name cause 'Client' is restricted name
var User  	= require('../models/user');
var File 	= require('../models/file');
var Layers 	= require('../models/layer');

// file handling
var fs 		= require('fs-extra');
var fss 	= require("q-io/fs");
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
module.exports = crunch = {



	// process images straight after upload
	processImage : function (data) {


		var res 	= data.res;
		var req 	= data.req;
		var ogfilename 	= data.file; 			// original filename
		var file 	= data.path; 			// /tmp/temfiles.gz  <- actual path of file, tho tmp only
		var user 	= data.req.user;
		var projectUuid = data.req.body.project;
		var fileUuid 	= 'image-' + uuid.v4();
		var folder 	= IMAGEFOLDER + fileUuid;

		

		// _____p i x e l p o r n_______________________________________________________
		//
		//	aight, så da er mye i boks.
		//	
		//	det som skjer nå er følgende:
		//	
		//	1. Man uploader ei bildefil i Data Library
		//	2. Bildet går til routes.js (linje 263) -> upload.js (linje 122) -> crunch.js (linje 32)
		//	3. Fila kommer inn her og blir kjørt igjennom crunch.processImage() (linje 32)
		//	4. Her blir det kjørt fire resizes på bildet, se options array linje 124. Der kan vi legge inn hva vi vil av defaults, 
		// 	   og så mange versjoner vi gidder.
		//	5. Når det er ferdig, lages en File db object, med alle versjonene/størrelsene av bildet lagra under File.data.image
		// 	6. Denne Fila blir sendt tilbake til client og blir adda til project. Du kan plukke den ut med project.getFiles()
		//	7. For å finne de forskjellige versjonene, så ser du i File.data.image array - 
		//	   der ligger det image object { 
		// 					file   : image-bla1e12e2,    	// dette er filnavnet som kan gå inn i <img src>
		// 					width  : 500,			// du må bare legge til /images/ i path'en
		// 					height : 300 			// så full path blir f.eks. <img src="/images/image-adsdas2120-12">
		// 					} 				// uten .jpg til slutt! 
		//	8. råfila lagres i File-objectet under File.rawfile.
		//       
		// 	9. shitloads TODO, men dette er basic funksjon :)
		//
		// 	todo:
		//		— raw versjon av fila (trenger vi egentlig det client side? holder vel kanskje at den ligger server side?)
		//		— finne ut av hvordan vi skal gjøre det med crop vs ratio (height false, osv, se rett under...)
		//		— det jeg ikke har lagd her, er pixel perfect by request - som når man resizer header f.eks, og vil ha en helt ny størrelse, så 
		//			må det lages on-the-fly. kanskje sette det opp med url query, f.eks. man ber om et bilde fra serveren som heter f.eks.
		//			/images/image-12313-12fsdfs-12134234?width=300&height=500 så kan vi bare lage størrelsen hvis den ikke finnes.
		//
		//
		//		- OK! rakk å fikse det :) PIXEL PERFECTION!! nå crunches hvert bilde on-the-fly,
		// 			så hvis man ber om f.eks. /pixels/file-asdlkmd1elkm12?width=300&height=200 får man det i 300x200 :) 
		// 			GET requests til /pixels/ går til crunch.serverPixelPerfection()
		//			working example: http://85.10.202.87:8080/pixels/file-c6924bf0-ef1e-406f-8814-3183fe001a54?width=300&height=400
		// 			NB: det er da file-uuid'en som må passes, ikke image-uuid. 
		// 			Nye cruncha bilder lagres på fil-objectet under File.data.image, som nevnt over.
		//		- Det er sikkert en del som kan fikses på, go mental! :) er f.eks. ikke sikker på om høyde/bredde blir riktig, og jeg tok av
		// 			crop'en, så tror bare en side blir riktig. Hvis du vil legge inn flere options, kan du plukke dem opp i req.query.
		// 			




		// ======
		// HANDLE
		// ======

		var ops = {};
	
		ops.dimensions = function (callback) {

			// get image size
			crunch.getImageSize(file, callback);
		};

		ops.identity = function (callback) {

			// get exif size
			crunch.getIdentify(file, callback);
		};
		
		ops.dataSize = function (callback) {

			// get file size in bytes
			crunch.getFileSize(file, callback);
		};

		// move raw file into /images/ folder
		ops.rawFile = function (callback) {

			// move raw file
			crunch.moveRawFile(file, callback);
		};

		

		// run all ops async in series
		async.series(ops, function (err, results) {

			// get vars
			var dimensions 	= results.dimensions;
			var exif 	= results.identity;
			var dataSize 	= results.dataSize;
			var rawFile 	= results.rawFile;

			// create File object
			var imageFile 		 	 = new File();
			imageFile.uuid 		  	 = 'file-' + uuid.v4();
			imageFile.createdBy 	  	 = user.uuid;
			imageFile.createdByName   	 = user.firstName + ' ' + user.lastName;
			imageFile.type 		  	 = 'image';
			imageFile.format 	  	 = ['jpg'];		
			imageFile.access.users 	  	 = [user.uuid];	
			imageFile.access.projects 	 = [projectUuid];
			imageFile.name 	  	  	 = ogfilename;		// original filename
			imageFile.data.image.file 	 = rawFile;
			imageFile.data.image.dimensions  = dimensions;
			imageFile.dataSize        	 = dataSize;
			imageFile.data.image.created     = crunch.getExif.created(exif);
			imageFile.data.image.gps         = crunch.getExif.gps(exif);
			imageFile.data.image.cameraType  = crunch.getExif.cameraType(exif); 
			imageFile.data.image.orientation = crunch.getExif.orientation(exif);

			// save
			imageFile.save(function (err, file) {
				if (err) console.log('imageFile save error: ', err);

				// add to project
				crunch.addFileToProject(file, projectUuid);

				// return file to client
				res.end(JSON.stringify({
					error : err,
					files  : [file]	// must return as array
				}));
			});

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
			var altitude 	= crunch.getExif.getAltitude(profile);
			var direction 	= crunch.getExif.getDirection(profile);
			var coords 	= crunch.getExif.getCoords(profile);
			
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
		if (raw) return crunch.returnRawfile(req, res);

		// async waterfall (each fn passes results into next fn)
		var ops = [];

		// find file
		ops.push(function (callback) {

			File
			.findOne({uuid : fileUuid})
			.exec(function (err, file) {
				if (!file) return callback(err);
				
				// find image with right dimensions (exactly) // todo: % margins
				var image = _.find(file.data.image.crunched, function (i) {
					if (!i) return false;
					if (_.isObject(i.crop)) i.crop = {}; // prevent errors

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
				callback(err, image, rawfile);
			});
		});

		// create image if not found
		ops.push(function (image, rawfile, callback) {

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
			crunch.resizeImage(template, callback);

		});

		// image found or created
		ops.push(function (result, callback) {

			// add image to File object if it was created
			if (!result.existing) crunch.addImageToFile(result, fileUuid);

			// return result
			callback(null, result);
			
		});


		// run all async ops
		async.waterfall(ops, function (err, result) {

			// all done, serve file
			crunch.returnImage(req, res, result);

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
			return crunch.returnImage(req, res, imageFile);
		});
		return;

	},

	










	










































	// // batch resize multiple images
	// resizeImages : function (options, callback) {

	// 	// create async queue 
	// 	var ops = [];

	// 	// resize each image
	// 	options.forEach(function (option) {

	// 		// add job to queue
	// 		ops.push(function (callback) {

	// 			// crunch it!
	// 			crunch.resizeImage(option, callback);
	// 		});

	// 	});		

	// 	// run parallel async
	// 	async.parallel(ops, function (err, resizedFiles) {
	// 		callback(err, resizedFiles);
	// 	});

	// },



	// // not in use atm, for reference
	// createPixelPerfection : function (options, callback) {


	// 	// The orientation of the frame
	// 	var frameOrientation = req.body.orientation;

	// 	// File directory
	// 	var fileDir = 'app/public/images/';

	// 	// Filename from request
	// 	var orgFileName = req.body.file;

	// 	// Original file path...
	// 	var pathToFile = fileDir + orgFileName;
		
	// 	// Original file name (without the path)
	// 	var strippedFile = orgFileName.replace(/\.[^/.]+$/, "");
 
	// 	// Remove crunch file name addons... (everything after "-scx")
	// 	var myRegexp = /-scx(.*)/;
	// 	var match = myRegexp.exec(strippedFile);
	// 	if ( match ) strippedFile = strippedFile.substring(0, strippedFile.length - match[0].length);
		
		
	// 	// Look for an Original file (that hasn't been compressed!)
	// 	var potentialOriginal = fileDir + strippedFile + '.jpg';
	// 	fs.exists(potentialOriginal, function(exists) {
	// 		// Use the mother file for better result
	// 		if (exists) pathToFile = potentialOriginal;
	// 	});		


	// 	// Required Width (from request)
	// 	var _nw = req.body.width;

	// 	// Required Height (from request)
	// 	var _nh = req.body.height;

	// 	// Crop number (from request)
	// 	var _crop = req.body.crop;

	// 	// "Pure" file (without -scx and .fileExtesion), but with path
	// 	var pureFile = fileDir + strippedFile;

	// 	// Desired new suffix
	// 	var newSuffix = '-scx_' + _nw + 'x' + _nh + '.jpg';

	// 	// New file NAME (without path)
	// 	var newFile = strippedFile + newSuffix;
		
	// 	// New file with full path = directory + original file + desired suffix
	// 	var newFilePath = fileDir + newFile;
	

		
	// 	// Check if desired file exists
	// 	// Check if desired file exists
		
	// 	fs.exists(newFile, function(exists) { 		
			
	// 		if (exists) {
				
	// 			// The file already exists
	// 			res.json({ message: 'File exists!', filepath: newFile });
			
	// 		} else { 

	// 			// Nope, this file has to be generated...
				
	// 			// Stack a few vars
	// 			var imgOrientation;
	// 			var __nw;
	// 			var __nh;
	// 			var _cropX;
	// 			var _cropY;
	// 			var b4size;

	// 			// Run a couple of operations...
	// 			async.series([

	// 				function(callback){

	// 					// Figure out proportions, and what size we want the new image to be...
	// 					// Figure out proportions, and what size we want the new image to be...

	// 					gm(pathToFile)

	// 						.filesize(function (err, size) {		
	// 							b4size = size;
	// 							// console.log('Crunching image:', size);
	// 						})

	// 						.identify(function (err, value){
	// 							// EXIF info ++
	// 							// console.log('*************************************************');
	// 							// console.log('Identify:', value);
	// 							// console.log('*************************************************');							
	// 						})							

	// 						.size(function (err, size) {
	// 							if (!err) 

	// 								// Find the Orientation of the Image
	// 								var imgProp = size.width / size.height;
	// 								imgProp <= 1 ? imgOrientation = 'portrait' : imgOrientation = 'landscape';

	// 								// Find the Orientation of the Frame
	// 								var frameProp = _nw / _nh;
	// 								frameProp <= 1 ? frameOrientation = 'portrait' : frameOrientation = 'landscape';
									

	// 								// Frame and Image is Landscape
	// 								if ( frameOrientation == 'landscape' && frameOrientation == imgOrientation ) {
										
	// 									// If the frame is larger than the image : Image is larger than frame
	// 									frameProp >= imgProp ?  widthCalc() : heightCalc();
	// 								}

	// 								// Frame and Image is Portrait
	// 								if ( frameOrientation == 'portrait' && frameOrientation == imgOrientation ) {

	// 									// If the frame is larger than the image : Image is larger than frame
	// 									frameProp >= imgProp ? widthCalc() : heightCalc();
	// 								}
									
	// 								// Frame is Landscape, Image is Portrait
	// 								if ( frameOrientation == 'landscape' && frameOrientation != imgOrientation ) {
	// 									widthCalc();
	// 								}

	// 								// Frame is Portrait, Image is Landscape
	// 								if ( frameOrientation == 'portrait' && frameOrientation != imgOrientation ) {									
	// 									heightCalc();
	// 								}


	// 								// Make a calculation based on WIDTH
	// 								function widthCalc() {

	// 									// Cropping doesn't work properly... 
	// 									var maxCrop = Math.abs(size.height - (size.height / imgProp))
	// 									if ( _crop >= (maxCrop/2) ) _crop = maxCrop/2;

	// 									__nw = _nw;
	// 									__nh = null;
	// 									_cropX = null;
	// 									_cropY = _crop;

	// 								}	

	// 								// Make a calculation based on HEIGHT
	// 								function heightCalc() {

	// 									// Obscure calculation : I don't know how the cropX function works
	// 									// ... it seems like it crops from both ends?
	// 									var maxCrop = Math.abs(size.width - (size.width / imgProp));
	// 									if ( _crop >= (maxCrop/4 -20) ) _crop = maxCrop/4 -20;

	// 									__nw = null;
	// 									__nh = _nh;
	// 									_cropX = _crop;
	// 									_cropY = null;										
	// 								}

	// 						callback(null);
	// 					})
	// 				},


	// 				// WRITE NEW FILE
	// 				// WRITE NEW FILE

	// 				function(callback){
	// 					gm(pathToFile)
	// 						.resize(__nw, __nh)							
	// 						.crop(_nw, _nh, _cropX, _cropY)
	// 						.noProfile()
	// 						.setFormat('JPEG')
	// 						.quality(60)
	// 						.write(newFilePath, function (err) {
	// 							console.log('• Writing new file from: ' + pathToFile + ' (' + b4size + ') ', 'To: ' + newFile);
	// 						  if (!err) res.json({ message: 'New file created!', filename: newFile });;							
	// 						callback(null);
	// 						});
	// 				}
	// 			]); // End of Async
	// 		} // End of Else
	// 	}); // End of my Life
	// 	},


}



