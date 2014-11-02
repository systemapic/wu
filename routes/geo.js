var fs = require('fs-extra');
var async = require('async');
var util = require('util');
var uuid = require('node-uuid');
var dive = require('dive');
var fspath = require('path');
var _ = require('lodash-node');
var tj = require('togeojson');	// kml to geojson
var jsdom = require('jsdom').jsdom;
var mapnikOmnivore = require('mapnik-omnivore');
// var request = require('request');
var request = require('superagent');
var zlib = require('zlib');


// models
var File = require('../models/file');
var Layer = require('../models/layer');
var Project = require('../models/project');

// image cruncher
var pixels = require('../routes/pixels');


// global paths
var FILEFOLDER = '/var/www/data/files/';
var TILESERVER = '/var/www/DATA/geojson/';


module.exports = geo = { 



	handleGeoJSON : function (path, fileUuid, callback) {
		// send to tx vector tile job queue
		console.log('GEO: handleGeoJSON', path, fileUuid);


		geo.grinderImportGeojson(path, fileUuid, function (err, metadata){ 
			
			console.log('grinderImportGeojson done:', err);
	        	
	        	
	        	// console.log('meta???', metadata);
	        	mapnikOmnivore.digest(path, function (err, metadata) {
	        		console.log('fucking meta?!?!?');
	        		var db = {
		        		metadata : JSON.stringify(metadata)
		        	}

		        	// return
		        	callback(err, db);
	        	});

	        	

		});
		
	},


	handleTopoJSON : function (path, fileUuid, callback) {
		// convert to geojson
		// send to tx vector tile job queue

		console.log('GEO: handleTopoJSON', path, fileUuid);

		callback()


	},




	grinderImportGeojson : function (path, fileUuid, callback) {
		console.log('grinderImportGeojson', path, fileUuid);


		fs.readJson(path, function (err, data) {
			if (err) console.log('readJson err', err);

			if (err) return callback(err);

			// package
			var pack = {
				geojson : data,
				uuid : fileUuid,
				layerName : 'layer'
			};

			zlib.gzip(JSON.stringify(pack), function (err, buffer) {
				if (err) console.log('zlib err: ', err);

				// send to tx
				request
				 .post('https://systemapic.com/import/geojson')
				 .send(buffer)
				 .set('Accept-Encoding', 'gzip, deflate')
				 .end(function (err, result) {
				 	if (err) console.log('request err:', err);

				 	// console.log('result: ', result);

				 	callback(err, null);
				});

			});

		});

	},



	handleShapefile : function (folder, name, fileUuid, callback) {  // folder = folder with shapefiles inside
		console.log('GEO: handleShapefile');


		fs.readdir(folder, function (err, files) {

			var shapefiles = files.slice();

			var ops = [];
			ops.push(function (done) {
				// check if valid shapefile(s)
				geo.validateshp(files, done);
			});

			ops.push(function (done) {
				// convert shapefile to geo/topojson
				geo.convertshp(files, folder, done);
			});

			async.series(ops, function (err, results) {
				console.log('err', err);
				// 
				if (err) return callback(err);

				var key = results[1];
				var path = key.path;
				var name = key.name;

				// add geojson file to list
				shapefiles.push(name);

				geo.grinderImportGeojson(path, fileUuid, function (err) {

					var db = {
						files : shapefiles,
						data : {
							geojson : name
						},
						title : name
					}


							
			        	// console.log('meta???', metadata);
			        	mapnikOmnivore.digest(path, function (err, metadata) {
			        		console.log('fucking meta?!?!?');
			        		db.metadata = JSON.stringify(metadata);
				        	

				        	// return
				        	callback(err, db);
			        	});

				});	
			});
		});
	},



	validateshp : function (files, callback) {
		console.log('validateshp');

		// shape extensions
		var mandatory 	= ['.shp', '.shx', '.dbf'];

		files.forEach(function (f) {
			var ext = f.slice(-4);
			_.pull(mandatory, ext);
		})

		// if not all accounted for, return error
		if (mandatory.length > 0) return callback({error : 'Missing shapefile(s)', files : mandatory});
		
		// return
		callback(null);

	},


	convertshp : function (shapes, folder, callback) {
		console.log('convertshp');

		 
		// get .shp file
		for (s in shapes) {
			if (shapes[s].slice(-4) == '.shp') var shp = shapes[s];
		}
		
		// return err if no .shp found
		if (!shp) return callback('No shapefile?');


		var inFile  = folder + '/' + shp;
		var toFile  = shp + '.geojson';
		var outFile = folder + '/' + toFile;

		// ogr2ogr shapefile to geojson
		var cmd = 'ogr2ogr -f geoJSON "' + outFile + '" "' + inFile + '"';		
		var exec = require('child_process').exec;
		exec(cmd, function (err, stdout, stdin) {
			if (err) console.error('mapshaper err: ', err, stdout, stdin);

			callback(err, {path : outFile, name : toFile});

		});
	},





















































	// send file to tileserver,
	// only geojson files
	mirrorToTileserver : function (entry, currentPath) {

		console.log('mirrorToTileserver');
		console.log('entry: ', entry);
		console.log('currentPath', currentPath);


		var fileUuid = entry.uuid;

		var remotePath = TILESERVER + fileUuid + '.geojson';
		// var reprojectedPath = currentPath + '.EPSG3857';

		
		var ops = [];

	
		
		ops.push(function (callback) {



			fs.readJson(currentPath, function (err, data) {
				if (err) throw err;
				console.log('readJson: ', data);







				request({
					method : 'POST',
					uri : 'http://78.46.107.15:8080/import/geojson',
					json : {
						geojson : data,
						uuid : fileUuid,
						layerName : 'layer'
					}


				}, function (err, response, body) {
					console.log('request: ', err);
			        	if (!err && response.statusCode == 200) {
			        		console.log(body)
			        	}
				});


				// request.post(TILESERVERIP + 'import/vtile', { 
				// 		form: { 
				//     			uuid : fileUuid, 
				//     			geojson : data,
				//     			layerName : 'testing'
				//     		} 
				// 	},
				    
				// 	function (error, response, body) {
				// 		console.log('request: ', error, response);
				//         	if (!error && response.statusCode == 200) {
				//         		console.log(body)
				//         	}
				//     }
				// );




			});


			

			// // scp file to tileserver
			// // var cmd = scp -C ERI_adm.zip.geojson tx:/var/www/DATA/eri.geojson
			// var cmd = 'scp -C ' + reprojectedPath + ' tx:' + remotePath;

			// console.log('cmd: ', cmd);

			// var exec = require('child_process').exec;
			// exec(cmd, function (err, stdout, stdin) {

			// 	console.log('scp done!', err, stdout, stdin);
			// 	callback(err);

			// });

		});



		// ops.push(function (callback) {




		// 	// mapnikOmnivore.digest(currentPath, function(err, metadata){
		// 	// 	if(err) return callback(err);
				
		// 	// 	console.log('Metadata returned!');
		// 	// 	console.log(metadata);

		// 	// 	var metastring = JSON.stringify(metadata);




		// 	// });



		// })

		async.series(ops, function (err, results) {

			console.log('async done!!');

		});
		



	},

	
	processShapefile : function (entry, callback) {

		var ops = [];
		ops.push(function (cb) {
			// check if valid shapefile(s)
			geo._validateShapefile(entry, cb);
		});

		ops.push(function (cb) {
			// convert shapefile to geo/topojson
			geo._convertShapefile(entry, cb);
		});

		async.series(ops, function (err) {
			if (err) console.error('processShapefile err: ', err);

			callback(null, entry);	// dont pass err
		});

	},


	processJsonFile : function (entry, callback) {

		// create unique filename for geojson, save in same folder
		var geoFile = _.remove(entry.files, function (f) {
			return (f.slice(-5) == '.json')
		});

		// set paths
		var base = entry.folder + '/';
		var fileUuid = 'geojson-' + uuid.v4() + '.geojson';
		var fromFile = base + geoFile[0]; 
		var toFile   = base + fileUuid;

		// move file, add to entry, return
		fs.rename(fromFile, toFile, function (err) {
			if (err) console.log('json rename err: ', err);

			// update entry
			entry.data.geojson = fileUuid;
			entry.data.type = 'layer';
			entry.files.push(fileUuid);
			entry.type = 'layer';
			entry.title = entry.originalFilename;

			// mirror to tileserver
			if (!err) geo.mirrorToTileserver(entry, toFile);

			// add unique id to features
			geo.addUniqueGeojsonProperties(toFile, entry, function (err) {
				
				// return
				callback(null, entry);
			});

			

		});
	},


	processGeojsonFile : function (entry, callback) {
		
		// console.log('*************************')
		// console.log('* geo.processGeojsonFile:', entry);
		// console.log('*************************')

		// create unique filename for geojson, save in same folder
		var geoFile = _.remove(entry.files, function (f) {
			return (f.slice(-8) == '.geojson')
		});

		// console.log('geoFile: ', geoFile);

		// set paths
		var base = entry.folder + '/';
		var fromPath = base + geoFile[0]; 
		var toFile = 'geojson-' + uuid.v4() + '.geojson';
		var toPath = base + toFile;



		// move file, add to entry, return
		fs.rename(fromPath, toPath, function (err) {
			if (err) console.log('geojson rename err: ', err);

			// update entry
			entry.data.geojson = toFile;
			entry.files.push(toFile);
			entry.type = 'layer';
			entry.name = geoFile[0];
			entry.title = entry.originalFilename;

			// console.log('renamed: ', entry);

			// mirror to tileserver
			if (!err) geo.mirrorToTileserver(entry, toPath);

			// add unique id to features
			geo.addUniqueGeojsonProperties(toPath, entry, function (err) {
				
				// return
				callback(null, entry);
			});

			

		});	
	},


	createNewGeoJSONLayer : function () {

		// write geojson to file
		// create new Layer()
		// create new File()
		// add to Project
		// return Layer()



	},


	processKmlFile : function (entry, callback) {
		
		// create unique filename for geojson, save in same folder
		var kmlFile = _.remove(entry.files, function (f) {
			return (f.slice(-4) == '.kml')
		});

		// set paths
		var base = entry.folder + '/';
		var fileUuid = 'geojson-' + uuid.v4() + '.geojson';
		var fromFile = base + kmlFile[0]; 
		var toFile   = base + fileUuid;

		var ops = [];
		ops.push(function (cb) {
			geo._kml2geojson(fromFile, toFile, cb);
		});

		async.series(ops, function (err) {

			// update entry
			entry.data.geojson = fileUuid;
			entry.data.type = 'layer';
			entry.files.push(fileUuid);
			entry.type = 'layer';
			entry.title = entry.originalFilename;

			// mirror to tileserver
			if (!err) geo.mirrorToTileserver(entry, toFile);

			// add unique id to features
			geo.addUniqueGeojsonProperties(toFile, entry, function (err) {
				
				// return
				callback(null, entry);
			});

			

		});		

	},

	processTopojsonFile : function (entry, callback) {


	},

	processGpxFile : function (entry, callback) {

	},



	// converts fromFile (kml) to toFile (geojson)
	_kml2geojson : function (fromFile, toFile, callback) {
		fs.readFile(fromFile, 'utf8', function (err, data) {
			var kml = jsdom(data);
			var converted = tj.kml(kml);
			fs.outputFile(toFile, JSON.stringify(converted), callback);
		});
	},



	_validateShapefile : function (entry, callback) {
		console.log('validateShapefile');

		// shape extensions
		var mandatory 	= ['.shp', '.shx', '.dbf'];
		var files       = entry.files;

		files.forEach(function (f) {
			var ext = f.slice(-4);
			_.pull(mandatory, ext);
		})

		// if not all accounted for, return error
		if (mandatory.length > 0) return callback({error : 'Missing shapefile(s)', files : mandatory});
		
		// return
		callback(null);

	},

	_convertShapefile : function (entry, callback) {

		var shapes = entry.files,
		    folder = entry.folder + '/';

		// add relative path if any
		if (entry.relativePath) folder += entry.relativePath;

		// get .shp file
		for (s in shapes) {
			if (shapes[s].slice(-4) == '.shp') var shp = shapes[s];
		}
		

		var inFile = folder + shp,
		    toFile = 'geojson-' + uuid.v4() + '.geojson';
		    // outFile = folder + '/' + shp + '.geojson';
		    outFile = entry.folder + '/' + toFile;

		// execute cmd line conversion 
		// var cmd = 'ogr2ogr -t_srs EPSG:3857 -f geoJSON "' + outFile + '" "' + inFile + '"'; //Neighbourhoods.json Neighbourhoods.shp
		var cmd = 'ogr2ogr -f geoJSON "' + outFile + '" "' + inFile + '"';
		
		// convert to google projection
		// var cmd = 'ogr2ogr -s_srs EPSG:4269 -t_srs EPSG:3857 -f geoJSON "' + outFile + '" "' + inFile + '"';

		// console.log('================= o g r 2 o g r  ==========================');
		// var cmd = 'mapshaper -p 0.1 --encoding utf8 -f geojson -o "' + outFile + '" "' + inFile + '"';		// todo: mapshaper options
		// console.log('================= m a p s h a p e r ==========================');
		// console.log('cmd: ', cmd);
		var exec = require('child_process').exec;
		exec(cmd, function (err, stdout, stdin) {
			if (err) console.error('mapshaper err: ', err, stdout, stdin);

			// add to entry
			entry.layers.push(toFile);
			entry.files.push(toFile);
			entry.type = 'layer';
			entry.data.geojson = toFile;
			entry.title = shp;

			// console.log('************************************')
			// console.log('* geo._convertShapefile DONE:', entry);
			// console.log('************************************')

			
			// add unique id to features
			geo.addUniqueGeojsonProperties(outFile, entry, function (err) {
				
				// return
				callback(null);
			});


			// mirror to tileserver
			if (!err) geo.mirrorToTileserver(entry, outFile);	// wait for it? add callback?


		});
	},

	addUniqueGeojsonProperties : function (path, entry, callback) {
		// console.log('addUniqueGeojsonProperties', path);		// todo: remove _systemapic from exported shapes!




		console.log('omnivore path', path);

		mapnikOmnivore.digest(path, function(err, metadata){
			console.log('METADATA err', err);
			if(err) return callback(err);
			
			console.log('Metadata returned!');
			console.log(metadata);

			var metastring = JSON.stringify(metadata);

			entry.metadata = metastring;

			callback(null);


		});


		




		// var data;
		// var ops = [];

		// ops.push(function (callback) {
		// 	fs.readFile(path, function (err, geojson) {
		// 		if (err) console.log('err: ', err);
		// 		if (geojson) {
		// 			data = JSON.parse(geojson);
		// 			data = geo._addUniqueProperty(data);
		// 		}
		// 		// done
		// 		callback(err);
		// 	});
		// });

		// ops.push(function (callback) {
		// 	var json = JSON.stringify(data);
		// 	fs.writeFile(path, json, function (err) {
		// 		if (err) throw err;
				
		// 		// done
		// 		callback(err);
		// 	});
		// });

		// async.series(ops, function (err) {

		// 	// console.log('addUniqueGeojsonProperties DONE!');

		// 	// no callback, no point waiting for this
		// 	if (callback) callback(err);
		// });

	},

	// _addUniqueProperty : function (data) {
	// 	var features = data.features;
	// 	// console.log('_addUniqueProperty features: ', features);
	// 	// console.log('data: ', data);
		
	// 	// simple geojson (like drawn shapes)
	// 	if (features == undefined) {
	// 		if (data.hasOwnProperty('properties')) {
	// 			data.properties.__sid = uuid.v4();
	// 			console.log('__ data: ', data);
	// 		}
	// 		return data;
	// 	}
		

	// 	features.forEach(function (feature) {
	// 		feature.properties.__sid = uuid.v4();
	// 	});
	// 	return data;
	// },


}









