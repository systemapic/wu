// routes/api.js 
//
// deals with portal, database
//
//

// database schemas
var Project 	= require('../models/project');
var Clientel 	= require('../models/client');	// weird name cause 'Client' is restricted name
var User  	= require('../models/user');
var File 	= require('../models/file');
var Layer 	= require('../models/layer');
var Hash 	= require('../models/hash');

// utils
var fs 		= require('fs-extra');
var fss 	= require("q-io/fs");
var utf8 	= require("utf8");
var async 	= require('async');
var util 	= require('util');
var request 	= require('request');
var uuid 	= require('node-uuid');
var _ 		= require('lodash-node');
var zlib 	= require('zlib');
var uploadProgress = require('node-upload-progress');
var crypto      = require('crypto');
var nodemailer  = require('nodemailer');
var nodepath    = require('path');
var gm 		= require('gm');
var request 	= require('request');
var mime 	= require("mime");
var formidable  = require('formidable');


// mapnik
var mapnik = require('mapnik');
var carto = require('carto');
var mapnikOmnivore = require('mapnik-omnivore');





// superusers
var superusers = [
	'user-9fed4b5f-ad48-479a-88c3-50f9ab44b17b', 	// KO
	'user-e6e5d7d9-3b4c-403b-ad80-a854b0215831',  	// J
	'user-5a4b544c-46ff-48e6-885b-c38be91f31b8', 	// rod tester superadmin
	'user-f36e496e-e3e4-4fac-a37c-f1a98689afda',	// ana tester superadmin
	'user-b76a8d27-6db6-46e0-8fc3-d022e6ff084f'	// phantomJS
]



// global paths
var FILEFOLDER 		= '/var/www/data/files/';
var IMAGEFOLDER 	= '/var/www/data/images/';
var TEMPFOLDER 		= '/var/www/data/tmp/';
var CARTOCSSFOLDER 	= '/var/www/data/cartocss/';
var TOOLSPATH 		= '/var/www/systemapic.com/app/tools/';


// default mapbox account
var DEFAULTMAPBOX = {
	username : 'systemapic',
	accessToken : 'pk.eyJ1Ijoic3lzdGVtYXBpYyIsImEiOiJQMWFRWUZnIn0.yrBvMg13AZC9lyOAAf9rGg'
}





// function exports
module.exports = api = {



	dbCreateLayer : function (options, callback) {

		var layer 		= new Layer();
		layer.uuid 		= options.uuid;
		layer.title 		= options.title;
		layer.description 	= options.description || '';
		layer.data.geojson 	= options.data.geojson;
		layer.legend 		= options.legend || '';
		layer.file 		= options.file;
		layer.metadata 		= options.metadata;

		layer.save(function (err, doc) {
			callback(err, doc);
		});
	},

	dbCreateFile : function (options, callback) {

		var file 		= new File();
		file.uuid 		= options.uuid;
		file.createdBy 		= options.createdBy;
		file.createdByName    	= options.createdByName;
		file.files 		= options.files;
		file.access 		= options.access;
		file.name 		= options.name;
		file.description 	= options.description;
		file.type 		= options.type;
		file.format 		= options.format;
		file.dataSize 		= options.dataSize;
		file.data 		= options.data;

		file.save(function (err, doc) {
			callback(err, doc);
		});


	},


	// save file to project (file, layer, project id's)
	dbAddFileToProject : function (file_id, projectUuid, callback) {
		Project
		.findOne({'uuid' : projectUuid })
		.exec(function (err, project) {
			project.files.push(file_id);			
			project.markModified('files');
			project.save(function (err) {
				callback && callback(err, done);
			});
		});
	},

	// save file to project (file, layer, project id's)
	dbAddLayerToProject : function (layer_id, projectUuid, callback) {
		Project
		.findOne({'uuid' : projectUuid })
		.exec(function (err, project) {
			project.layers.push(layer_id);			
			project.markModified('layers');
			project.save(function (err) {
				callback && callback(err, done);
			});
		});
	},











	reloadMeta : function (req, res) {

		var fileUuid = req.body.fileUuid;
		var layerUuid = req.body.layerUuid;

		if (!fileUuid || !layerUuid) return res.end(JSON.stringify({
			error : 'No layer specified.'
		}));

		// get meta
		api.getMeta(fileUuid, function (err, meta) {

			if (err) return res.end(JSON.stringify({
				error : err
			}));

			// save meta to fil
			api.setMeta(meta, layerUuid, function (err, result) {


				// return meta
				res.end(JSON.stringify({
					error : err,
					meta : meta
				}));

			})


		})



	},


	getMeta : function (fileUuid, callback) {

		File
		.findOne({uuid : fileUuid})
		.exec(function (err, file) {
			if (err) return callback(err);

			// only support for geojson now
			if (!file.data.geojson) return callback({error : 'No geojson found.'});

			// set path
			var path = FILEFOLDER + fileUuid + '/' + file.data.geojson;

			// var omnipath = METAPATH + uuid + '.meta.json';
			fs.readJson(path, function (err, metadata) { 			// expensive
				callback(err, metadata);
			});			
		});

	},



	setMeta : function (meta, layerUuid, callback) {

		Layer
		.findOne({uuid : layerUuid})
		.exec(function (err, layer) {

			layer.metadata = meta; 	// string?
			layer.save(function (err) {

				callback(err);

			});


		})



	},


	createLegends : function (req, res) {

		api.generateLegends(req, res, function (err, legends) {

			// todo move res.end here
		});

	},


	generateLegends : function (req, res, finalcallback) {
		console.log('createLegends!');

		var fileUuid = req.body.fileUuid;
		var cartoid = req.body.cartoid;
		var layerUuid = req.body.layerUuid;



		var ops = [];

		// get layer features/values
		ops.push(function (callback) {

			api._getLayerFeaturesValues(fileUuid, cartoid, function (err, result) {
				if (err) console.error('_getLayerFeaturesValues err: ', err);

				console.log('_GOT SHIT: ', err, result);

				var jah = result.rules;
				var css = result.css;

				console.log('_getLayerFeaturesValues jah: ', jah);
				console.log('css: ', css);

				callback(null, result);

			});

		})


		// for each rule found
		ops.push(function (result, callback) {
			var jah = result.rules;
			var css = result.css;
			var legends = [];

			async.each(jah, function (rule, cb) {

				var options = {
					css : css,
					key : rule.key,
					value : rule.value,
					id : 'legend-' + uuid.v4()
				}

				api._createStylesheet(options, function (err, result) {
					if (err) console.log('create stylesheet err: ', err);

					
					api._createLegend(result, function (err, path) {


						// base64 encode png


						fs.readFile(path, function (err, data) {

							var base = data.toString('base64');
							var uri = util.format("data:%s;base64,%s", mime.lookup(path), base);

							console.log('CREATED LEGENDS?!?!?');
							console.log('base64: ', uri);

							var leg = {
								base64 	  : uri,
								key 	  : options.key,
								value 	  : options.value,
								id 	  : options.id,
								fileUuid  : fileUuid,
								layerUuid : layerUuid,
								cartoid   : cartoid,
								on 	  : true
							}

							legends.push(leg);

							cb(null);
						});	
					});
				}, this);


			}, function (err) {

				callback(null, legends);

			});



		});



		ops.push(function (legends, callback) {

			console.log('got all legends!', legends);

			res.end(JSON.stringify(legends));

			callback();
		});


		async.waterfall(ops, function (err, legends) {
			console.log('waterfall done');
			console.log('err, legends', err, legends);
			
		});


	},



	_createStylesheet : function (options, callback) {

		
		var featureKey = options.key;
		var featureValue = options.value;
		var css = options.css;
		var lid = options.id;


		var properties = {};
		properties[featureKey] = featureValue;

		var geojson = {
			"type" : "FeatureCollection",
			"features" : [
				{
				"type" : "Feature",
				"properties" : properties,
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
						[
					              -180,
					              0
					            ],
					            [
					              -180,
					              90
					            ],
					            [
					              0,
					              90
					            ],
					            [
					              0,
					              0
					             
					            ],
					            [
					              -180,
					              0
					            ]
						]
						]
					}
				}
			]
		}



		// write geojson template to disk
		var toFile = '/var/www/data/legends/template-' + lid + '.geojson'; 
		fs.outputFile(toFile, JSON.stringify(geojson), function (err) {
			// console.log('wrote goejson!!!');

			var options = {
				"srs": "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0.0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs +over",

				"Stylesheet": [{
					"id" : 'layer',
					"data" : css
				}],

				"Layer": [{
					"id" : "layer",	
					"name" : "layer",
					"Datasource" : {
						"file" : toFile,
						"type" : "geojson"
					}
				}]
			}

			

			var cr = new carto.Renderer({});
		
			// get xml
			var xml = cr.render(options);
			var stylepath = '/var/www/data/legends/stylesheet-' + lid + '.xml';
			fs.outputFile(stylepath, xml, function (err) {
				if (err) console.log('carto write err', err);

				var result = {
					stylepath : stylepath,
					lid : lid
				}

				callback(null, result);

			});
		});//fs.out

	},



	_createLegend : function (options, callback) {

		var mapnik = require('mapnik');
		var fs = require('fs');


		var stylepath = options.stylepath;
		var lid = options.lid;

		// register fonts and datasource plugins
		mapnik.register_default_fonts();
		mapnik.register_default_input_plugins();

		var map = new mapnik.Map(100, 50);
		// map.load('./test/stylesheet.xml', function(err,map) {

		try {
		map.load(stylepath, function(err,map) {
			if (err) throw err;
			map.zoomAll(); // todo: zoom?
			var im = new mapnik.Image(100, 50);
			map.render(im, function(err,im) {
				if (err) throw err;
				im.encode('png', function(err,buffer) {
					if (err) throw err;
					// fs.writeFile('map.png',buffer, function(err) {
					var outpath = '/var/www/data/legends/' + lid + '.png';
					fs.writeFile(outpath, buffer, function(err) {
						if (err) throw err;
						console.log('saved map image to map.png');
						

						callback(null, outpath);
					});
				});
			});
		});

		} catch (e) { console.log('FIX ERR!!!');}


	},





	// #########################################
	// ###  API: Get Layer Feature Values    ###
	// #########################################	
	// get features from geojson that are active in cartoid.mss (ie. only active/visible layers)
	_getLayerFeaturesValues : function (fileUuid, cartoid, callback) {


		File
		.findOne({uuid : fileUuid})
		.exec(function (err, file) {
			console.log('err?', err);
			console.log('found file: ', file);

			// read geojson file
			var path = FILEFOLDER + file.uuid + '/' + file.data.geojson;
			fs.readJson(path, function (err, data) {
				if (err) console.log('err: : ', err);

				// read css from file
				var cartopath = CARTOCSSFOLDER + cartoid + '.mss';
				fs.readFile(cartopath, 'utf8', function (err, buffer) {

					// css as string
					var css = buffer.toString();

					// get rules from carto (forked!)
					var renderer = new carto.Renderer();
					var info = renderer.getRules(css);

					var string = JSON.stringify(info);

					console.log('string: ', string);


					// add rules to jah
					var jah = [];
					var rules1 = info.rules;//[0].rules;

					rules1.forEach(function (rule1) {

						var rules2 = rule1.rules;


						if (!rules2) return;				// todo? forEach on rule1?
						rules2.forEach(function (rrules) {
							// console.log('rrules:', rrules);
							if (!rrules.selectors) return;

							rrules.selectors.forEach(function (s) {
								var rule = s.filters.filters;
								for (var r in rule) {
									var jahrule = rule[r];
									jah.push({
										key : jahrule.key.value,
										value : jahrule.val.value
									});
								}
							});
						});


					})

					// add #layer
					jah.push({
						key : 'layer',
						value : file.name
					});


					// // add rules to jah
					// var jah = [];
					// var rules = info.rules[0].rules;
					// rules.forEach(function (rrules) {
					// 	rrules.selectors.forEach(function (s) {
					// 		var rule = s.filters.filters;
					// 		for (var r in rule) {
					// 			var jahrule = rule[r];
					// 			jah.push({
					// 				key : jahrule.key.value,
					// 				value : jahrule.val.value
					// 			});
					// 		}
					// 	});
					// });


					


					

					var result = {
						rules : jah,
						css : css
					}


					console.log('JAH!', result);
					callback(null, result);

				});
			});
		});

		


	},




	// #########################################
	// ###  API: Parse CartoCSS              ###
	// #########################################	// aka create png for label
	parseCartoCSS : function (req, res) {
		console.log('parseCartoCSS', req.body);	

		var css = req.body.css;

		console.log('css: ', css);



		// apply stylesheet to geojson with 1 tiny #id like #eidsvoll
		// create png from geojson

		var featureKey = req.body.featureKey;
		var featureValue = req.body.featureValue;



		try  {
			// test create png
			//api._createStylesheet(css, featureKey, featureValue);
		} catch (e) {
			console.log('FIXME!!');
		}



		// return;



		// // ############ xml to json #########
		// // xml to json
		// var cr = new carto.Renderer({});
		// var options = {
		// 	"srs": "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0.0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs +over",

		// 	"Stylesheet": [{
		// 		"id" : 'lol',
		// 		"data" : css
		// 	}],
		// 	"Layer": [{
		// 		"id" : "layer",	
		// 		"name" : "layer"
		// 	}]
		// }

		// var xml = cr.render(options);


		// // console.log('renderer: ', renderer);

		// // var parsed = cr.render(css);

		// // console.log('parsed: ', parsed);


		// var parseString = require('xml2js').parseString;
		// // var xml = "<root>Hello xml2js!</root>"
		// parseString(xml, function (err, result) {
		// 	console.log('xml2json:::', result);
		// 	// console.dir(result);

		// 	console.log('layer->', result.Map.Layer);
		// 	console.log('style->', result.Map.Style);

		// 	if (result.Map.Style) {

		// 		console.log('rules->', result.Map.Style[0].Rule);
			
		// 		var rules = result.Map.Style[0].Rule;

		// 		rules.forEach(function (rule) {
		// 			console.log('jah rule->', rule);
		// 		}, this);

		// 	}
		// });

		// // ############ xml to json ######### end #####






		// carto renderer
		// var cr = new carto.Renderer({
		// 	filename: cartoid + '.mss',
		// 	local_data_dir: CARTOCSSPATH,
		// });

	
		// // get xml from 
		// var xml = cr.render(options);


		// var env = {};
		// var parser = (carto.Parser(env)).parse(css);

	
		// console.log('parser', parser);

		// var rule_list = parser.toList(env);

		// console.log('rule_list', rule_list);
		// console.log('elemetns: ', rule_list[0].elements);

		// var defs = this._inheritDefinitions(rule_list, env);

		// console.log('defs:', defs);


		// return 
		res.end(JSON.stringify({
			result : 'ok',
			css : 'css'
		}));



	},



	_inheritDefinitions : function (definitions, env) {
		var inheritTime = +new Date();
		// definitions are ordered by specificity,
		// high (index 0) to low
		var byAttachment = {},
		byFilter = {};
		var result = [];
		var current, previous, attachment;

		// Evaluate the filters specified by each definition with the given
		// environment to correctly resolve variable references
		definitions.forEach(function(d) {
			d.filters.ev(env);
		});

		for (var i = 0; i < definitions.length; i++) {

			attachment = definitions[i].attachment;
			current = [definitions[i]];

			if (!byAttachment[attachment]) {
				byAttachment[attachment] = [];
				byAttachment[attachment].attachment = attachment;
				byFilter[attachment] = {};
				result.push(byAttachment[attachment]);
			}

			// Iterate over all subsequent rules.
			for (var j = i + 1; j < definitions.length; j++) {
				if (definitions[j].attachment === attachment) {
					// Only inherit rules from the same attachment.
					current = addRules(current, definitions[j], byFilter[attachment], env);
				}
			}

			for (var k = 0; k < current.length; k++) {
				byFilter[attachment][current[k].filters] = current[k];
				byAttachment[attachment].push(current[k]);
			}
		}

		// if (env.benchmark) console.warn('Inheritance time: ' + ((new Date() - inheritTime)) + 'ms');

		return result;

	},




	// #########################################
	// ###  API: Create PDF Snapshot         ###
	// #########################################
	getCartoCSS : function (req, res) {
		var cartoId = req.body.cartoid;
		var path = CARTOCSSFOLDER + cartoId + '.mss';
		fs.readFile(path, {encoding : 'utf8'}, function (err, data) {
			res.end(data);
		});
	},



	// #########################################
	// ###  API: Create PDF Snapshot         ###
	// #########################################
	setCartoCSS : function (req, res) {
		console.log('setCartoCSS');
		console.log('body: ', req.body);

		// get params
		var fileUuid 	= req.body.fileUuid;
		var css 	= req.body.css;
		var cartoid 	= req.body.cartoid;

		// set path
		var csspath 	= CARTOCSSFOLDER + cartoid + '.mss';


		console.log('vars: ', fileUuid, cartoid, csspath, css);

		// save css to file by cartoId 
		fs.writeFile(csspath, css, {encoding : 'utf8'}, function (err) {
			console.log('err?', err);
		



			// send to tileserver storage
			request({
				method : 'POST',
				uri : 'https://systemapic.com/import/cartocss',
				json : {
					css : css,
					cartoid : cartoid
				}
			}, 

			// callback
			function (err, response, body) {
				console.log('err: ', err);
				// console.log('response: ', response);
				// console.log('resp bugfer: ', response.body.toString());
				console.log('body: ', body);
		        	
				// var result = JSON.parse(body);

				// console.log('result:', result);
				// var result = JSON.parse(body);
				if (err) {
					console.log('caught error....');
		        		return res.end(JSON.stringify({
		        			ok : false,
		        			error : err
		        		}));

				}


		        	if (!body.ok) {
		        		console.log('caught error....');
		        		return res.end(JSON.stringify({
		        			ok : false,
		        			error : body.error
		        		}));
		        	}


		        	if (!err && response.statusCode == 200) {
		        		console.log(body)


		        		// save ID to file object (as active css)
					Layer
					.findOne({file : fileUuid})
					.exec(function (err, layer) {

						layer.data.cartoid = cartoid;
						layer.markModified('data');
						layer.save(function (err, doc) {
							if (err) console.log('err: ', err);
							
							res.end(JSON.stringify({
				        			ok : true,
				        			cartoid : cartoid,
				        			error : null			// todo: save err
				        		}));

						});

					});

		        	}



			});

		});

	},





	// #########################################
	// ###  API: Create PDF Snapshot         ###
	// #########################################
	createPDFSnapshot : function (req, res) {
		// console.log('cretae PDF snapshot');
		// console.log('body: ', req.body);
		// console.log('hash: ', req.body.hash);


		// run phantomjs cmd	
		// crunch image

		// var hash = req.body.hash;
		var projectUuid = req.body.hash.project;
		
		// var filename = 'snap-' + projectUuid + '-' + req.body.hash.id + '.pdf';
		var filename = 'snap-' + projectUuid + '-' + req.body.hash.id + '.png';
		var fileUuid = 'file-' + uuid.v4();
		var folder = FILEFOLDER + fileUuid;
		var path = folder + '/' + filename;

		var pdfpath = folder + '/' + filename.slice(0, -3) + 'pdf';

		console.log('pdfpath: ', pdfpath);

		var hash = {
			position : req.body.hash.position,
			layers : req.body.hash.layers,
			id : req.body.hash.id
		}


		var args = {
			projectUuid : projectUuid,
			hash : hash,
			// filename : filename,
			// folder : FILEFOLDER
			path : path,
			pdf : true
		}

		console.log('-> PDF args: ', args);

		var snappath = TOOLSPATH + 'phantomJS-snapshot.js';
		var cmd = "phantomjs --ssl-protocol=tlsv1 " + snappath + " '" + JSON.stringify(args) + "'";
		console.log('cmd: ', cmd);


		var ops = [];
		var dataSize;


		// create file folder
		ops.push(function (callback) {

			fs.ensureDir(folder, function(err) {
				console.log(err); //null
				//dir has now been created, including the directory it is to be placed in
				callback(err);
			})


		});

		// phantomJS: create snapshot
		ops.push(function (callback) {

			var exec = require('child_process').exec;
			exec(cmd, function (err, stdout, stdin) {

				console.log('executed phantomJS');
				console.log('err: ', err);
				console.log('stdout: ', stdout);
				console.log('stdin: ', stdin);

				callback(err);
			});

		});

		// create pdf from snapshot image
		ops.push(function (callback) {


			console.log('CREATING PDF!!');

			PDFDocument = require('pdfkit');
			var doc = new PDFDocument({
				margin : 0,
				layout: 'landscape',
				size : 'A4'
			});
			doc.image(path, {fit : [890, 1140]});
			
			doc.pipe(fs.createWriteStream(pdfpath));

			doc.end();


			callback();

		});

		// get size
		ops.push(function (callback) {

			
			fs.stat(pdfpath, function (err, stats) {
				console.log('err: ', err);
				dataSize = stats.size;
	 			callback(err);
	 		});

		});


		// create File
		ops.push(function (callback) {

			var f 			= new File();
			f.uuid 			= fileUuid;
			f.createdBy 		= req.user.uuid;
			f.createdByName    	= req.user.firstName + ' ' + req.user.lastName;
			f.files 		= filename;
			f.access.users 		= [req.user.uuid];	
			f.name 			= filename;
			f.description 		= 'PDF Snapshot';
			f.type 			= 'document';
			f.format 		= 'pdf';
			f.dataSize 		= dataSize;
			f.data.image.file 	= filename; 

			f.save(function (err, doc) {
				if (err) console.log('File err: ', err);
				// console.log('File saved: ', doc);

				callback(err, doc);
			});


		});


		async.series(ops, function (err, results) {
			// console.log('all done: ', err);
			// console.log('results', results);

			res.end(JSON.stringify({
				pdf : fileUuid,
				error : null
			}));
		});

	},			

	// #########################################
	// ###  API: Create Snapshot             ###
	// #########################################
	createSnapshot : function (req, res) {

		console.log('cretae snapshot');
		console.log('body: ', req.body);
		console.log('hash: ', req.body.hash);


		// run phantomjs cmd	
		// crunch image

		// var hash = req.body.hash;
		var projectUuid = req.body.hash.project;
		
		var filename = 'snap-' + projectUuid + '-' + req.body.hash.id + '.png';
		var path = IMAGEFOLDER + filename;



		var hash = {
			position : req.body.hash.position,
			layers : req.body.hash.layers,
			id : req.body.hash.id
		}

		console.log('hash:::', hash);

		var args = {
			projectUuid : projectUuid,
			hash : hash,
			// filename : filename,
			// folder : IMAGEFOLDER
			path : path,
			pdf : false
		}

		// console.log('-> args: ', args);

		var snappath = TOOLSPATH + 'phantomJS-snapshot.js';
		var cmd = "phantomjs --ssl-protocol=tlsv1 " + snappath + " '" + JSON.stringify(args) + "'";
		// var cmd = "phantomjs --ssl-protocol=tlsv1 /var/www/tools/phantomJS/snapshot.js " + "'" + JSON.stringify(args) + "'";
		console.log('cmd: ', cmd);


		var ops = [];
		var dataSize;

		// phantomJS: create snapshot
		ops.push(function (callback) {

			console.log('cmd!! =-> phantomjss');

			var exec = require('child_process').exec;
			exec(cmd, function (err, stdout, stdin) {

				console.log('executed phantomJS');
				console.log('err: ', err);
				console.log('stdout: ', stdout);
				console.log('stdin: ', stdin);

				callback(err);
			});

		});

		// get size
		ops.push(function (callback) {

			console.log('fsstat');
			fs.stat(path, function (err, stats) {
				console.log('err: ', err);
				console.log('stats: ', stats);
				if (stats) dataSize = stats.size;
	 			callback(err);
	 		});

		});


		// create File
		ops.push(function (callback) {

			console.log('create file phsj')

			var f 			= new File();
			f.uuid 			= 'file-' + uuid.v4();
			f.createdBy 		= req.user.uuid;
			f.createdByName    	= req.user.firstName + ' ' + req.user.lastName;
			f.files 		= filename;
			f.access.users 		= [req.user.uuid];	
			f.name 			= filename;
			f.description 		= 'Snapshot';
			f.type 			= 'image';
			f.format 		= 'png';
			f.dataSize 		= dataSize;
			f.data.image.file 	= filename; 

			f.save(function (err, doc) {
				if (err) console.log('File err: ', err);
				// console.log('File saved: ', doc);

				callback(err, doc);
			});


		});

		console.log('running phantom ascyn');

		async.series(ops, function (err, results) {
			console.log('pahtnom !! all done: ', err);
			console.log('results', results);

			if (err) console.log('err', err);

			var file = results[2]

			console.log('file: ', file);

			res.end(JSON.stringify({
				image : file.uuid,
				error : null
			}));
		});
		
	},



	// #########################################
	// ###  API: Create Project              ###
	// #########################################
	createProject : function (req, res) {


		// console.log('________________');
		// console.log('API: createProject');
		// console.log('_________________');

		var json = req.body;
		var user = req.user;

		// return if not authorized
		if (!api.can.create.project( user )) return api._errorUnauthorized(req, res);

		// create new project
		var project = api._newProject(user, json);

		// add to superadmins: just add the uuid to User(s)
		api.addProjectToSuperadmins(project.uuid);
		
		// add default mapbox account		  		  // callback
		api._getMapboxAccount(req, res, project, DEFAULTMAPBOX.username, DEFAULTMAPBOX.accessToken, api._returnProject); // todo:::::
		

	},

	_newProject : function (user, json, callback) {
		
		// new mongo model
		var project 		= new Project();
		project.uuid 		= 'project-' + uuid.v4();
		project.createdBy 	= user.uuid;
		project.createdByName   = user.firstName + ' ' + user.lastName;
		project.slug 		= json.name.replace(/\s+/g, '').toLowerCase();
		project.name 		= json.name;
		project.description 	= json.description;
		project.keywords 	= json.keywords;
		project.client 		= json.client;

		// project.save(function (err) {
		// 	if (err) console.error('Error saving new project: ', err);
		// 	callback(err, project);
		// });
			
			return project;

	},

	


	forgotPassword : function (req, res) {

		// render page and pass in flash data if applicable
		res.render('../../views/login.ejs', { message: 'Please check ' + req.body.email + ' for new login details.' });

		var email = req.body.email;

		User
		.findOne({'local.email' : email})
		.exec(function (err, user) {

			var password = crypto.randomBytes(16).toString('hex');
			user.local.password = user.generateHash(password);
			user.markModified('local');
		
			// save the user
			user.save(function(err, doc) { 

				// send email with login details to user
				api.sendNewUserEmail(user, password);
			
			});
		});
	},


	_errorUnauthorized : function (req, res) {
		var message = 'Unauthorized access attempt. Your IP ' + req._remoteAddress + ' has been logged.';
		res.end(JSON.stringify({ error : message }));
	},


	_returnProject : function (req, res, project, error) {
		// console.log('return project', project, error);
		if (error) throw error;

		Project
		.findOne({uuid : project.uuid})
		.populate('files')
		.populate('layers')
		.exec(function (err, project) {
			if (err) console.error(err);
			// console.log('err?: ', err);
			// console.log('reutnring project to client: ', project);
			res.end(JSON.stringify({
				error : err,
				project: project}
			));
		});

	},


	// import mapbox account from username, create Layer Objects of all layers, return Layers to client.
	getMapboxAccount : function (req, res) {

		var username 	= req.body.username;
		var projectUuid = req.body.projectId;
		var accessToken = req.body.accessToken;
		var userUuid 	= req.user.uuid;

		// console.log('______________________')
		// console.log('API: getMapboxAccount ');
		// console.log('     username: ', username);
		// console.log('     project', projectUuid);
		// console.log('     token: ', accessToken);
		// console.log('______________________')



		Project
		.findOne({uuid : projectUuid})
		.populate('files')
		.populate('layers')
		.exec(function (err, project) {

			if (_.find(project.connectedAccounts.mapbox, function (m) { return m == username; })) {
				// console.log(username + ' already connected!');
				// already existing
				// return res.end(JSON.stringify({
				// 	error : 'Account already connected.'
				// }));
			}


			// get mapbox account
			api._getMapboxAccount(req, res, project, username, accessToken, api._returnProject);

		});


	},





	_getMapboxAccount : function (req, res, project, username, accessToken, callback) {

		// add ops to async queue
		var ops = [];

		ops.push(function (callback) {
			// add default mapbox account: systemapic
			api.requestMapboxAccount(project, username, accessToken, callback);
		});

		ops.push(function (project, mapboxLayers, accessToken, callback) {

			// create layers from mapbox data
			api.createLayersFromMapbox(project, mapboxLayers, accessToken, callback);
		});

		ops.push(function (project, layers, callback) {

			// add layers to project
			api.addLayersToProject(project, layers, username, accessToken, callback); 
		});

		ops.push(function(project, callback) {
			// save project
			project.markModified('layers');
			project.markModified('connectedAccounts');
			project.save(function (err, result) {
				callback(null, project);
			});
		});

		// do async and go to callback
		async.waterfall(ops, function (err, project) {

			if (err) {
				// console.log('ERROR: ', err);
				return callback(req, res, project, err);
			}

			callback(req, res, project);
		});
	},




	// send request to mapbox
	requestMapboxAccount : function (project, username, accessToken, callback) {
		
		// console.log('______________________')
		// console.log('API: requestMapboxAccount ');
		// console.log('     username: ', username);
		// console.log('     project', project.uuid);
		// console.log('     accessToken : ', accessToken);
		// console.log('______________________')

		// mapbox url
		var url = 'https://api.tiles.mapbox.com/v3/' + username + '/maps.json?secure=1&access_token=' + accessToken; 
		// console.log('url: ', url);

		// send request to mapbox
		request(url, function (error, response, body) {

			// err handling
			if (error || response.statusCode != 200) return callback(error || response.statusCode);

			// parse result
			var mapboxLayers = JSON.parse(body);

			// return error thus cancel async waterfall if no layers
			if (_.isEmpty(mapboxLayers)) return callback({error : 'No layers in account.'}, project);

			// return layers to async ops
			callback(null, project, mapboxLayers, accessToken);

		});

	},


	// mapbox helper fn
	createLayersFromMapbox : function (project, mapboxLayers, accessToken, callback) {
		
		var layers = [];

		// create Layer in dB and save to Project
		mapboxLayers.forEach(function (ml) {

			// create Layers object
			var layer 		= new Layer();
			layer.uuid 		= 'layer-' + uuid.v4(); // unique uuid
			layer.title 		= ml.name;
			layer.description 	= ml.description;
			layer.legend		= ml.legend;
			layer.maxZoom 		= ml.maxzoom;
			layer.minZoom 		= ml.minzoom;
			layer.bounds 		= ml.bounds;
			layer.tms		= false;
			layer.data.mapbox 	= ml.id; 		// eg. rawger.geography-class
			layer.attribution 	= ml.attribution; 	// html
			layer.accessToken 	= accessToken;

			// array of Layers objects
			layers.push(layer);

			// save
			layer.save(function (err) {
				if (err) throw err;
			});

			// remove old mapbox layer if existing
			_.remove(project.layers, function (old) {
				return old.data.mapbox == ml.id;	
			});
			
		});


		callback(null, project, layers);

	},
	

	// mapbox helper fn
	addLayersToProject : function (project, layers, username, accessToken, callback) {

		// add new layers
		layers.forEach(function (add) {
			project.layers.addToSet(add._id); // mongodB Layer object
		});

		// add account
		var account = {
			username : username,
			accessToken : accessToken
		}
		project.connectedAccounts.mapbox.push(account);

		// return to async ops
		callback(null, project);
	
	},






	addProjectToSuperadmins : function (projectUuid) {
		User.find({uuid : {$in : superusers}}, function (err, results) {
			results.forEach(function (user) {
				user.role.reader.projects.addToSet(projectUuid);
				user.role.editor.projects.addToSet(projectUuid);
				user.role.manager.projects.addToSet(projectUuid);
				user.markModified('role');
				user.save(function (err, res) {
					// console.log('addProjectToSuperadmins OK: ' + projectUuid);
				});
			});
		});
	},


	
	// #########################################
	// ###  API: Create Layer                ###
	// #########################################
	createLayer : function (req, res) {

		// console.log('API: createLayer:');
		// console.log('req.body: ', req.body);

		return res.end(JSON.stringify({error : 'Unsupported.'}))


		var layerType = req.body.layerType;

		if (layerType == 'geojson') return api.createLayerFromGeoJSON(req, res);

		// else
		res.end(JSON.stringify({
			layer : 'yo!'
		}));



	},

	createLayerFromGeoJSON : function (req, res) {
		// console.log('createLayerFromGeoJSON');

		var geojson = req.body.geojson;
		var projectUuid = req.body.project;

		var filename = uuid.v4() + '.geojson';
		var outfile = '/tmp/' + filename;
		var data = JSON.stringify(geojson);
		var size = data.length;

		// console.log('size: ', size);

		fs.writeFile(outfile, data, function (err) {
			if (err) console.log('write err: ', err);


			var file = [{ 
				
				fieldName : 'file[]',
				originalFilename : filename,
				path : outfile,
				size : size || 0,
				name : 'Created Shape',
				type : 'application/octet-stream' 

			}];

			req.files = {
				file : file
			}

			upload.upload(req, res);


		});



	},



	// #########################################
	// ###  API: Delete Project              ###
	// #########################################
	deleteProject : function (req, res) {

		var user        = req.user;
		var userUuid 	= req.user.uuid;
		var clientUuid 	= req.body.clientUuid;
		var projectUuid = req.body.projectUuid;

		// console.log('deleteProject: ', req.body);

		// find project (async)
		var model = Project.findOne({ uuid : projectUuid });
		model.exec(function (err, project) {
			
			// return if not authorized
			if (!api.can.remove.project( user, project )) {
				var message = 'Unauthorized access attempt. Your IP ' + req._remoteAddress + ' has been logged.';
				return res.end(JSON.stringify({ error : message }));
			};


			// remove project
			model.remove(function (err, result) {
				// console.log('Removed project ' + project.name);
				// console.log(err, result);
			
				// todo!!! remove from users 
				api.removeProjectFromEveryone(project.uuid);

				// return success
				return res.end(JSON.stringify({
					result : 'Project ' + project.name + ' deleted.'
				}));
			});
		});
	},


	removeProjectFromSuperadmin : function (projectUuid) {
		User.find({uuid : {$in : superusers}}, function (err, results) {
			results.forEach(function (user) {
				user.role.reader.projects.pull(projectUuid);
				user.role.editor.projects.pull(projectUuid);
				user.role.manager.projects.pull(projectUuid);
				user.markModified('role');
				user.save(function (err, res) {
					console.log('removeProjectFromSuperadmin OK: ' + projectUuid);		
				});
			});
		});
	},


	// remove project from all users
	removeProjectFromEveryone : function (projectUuid) {

		User
		.find({ $or : [ { 'role.reader.projects'  : projectUuid }, 
		 		{ 'role.editor.projects'  : projectUuid }, 
		 		{ 'role.manager.projects' : projectUuid } ]
		 })
		.exec(function (err, users) {
			users.forEach(function (user) {
				user.role.reader.projects.pull(projectUuid);
				user.role.editor.projects.pull(projectUuid);
				user.role.manager.projects.pull(projectUuid);
				user.markModified('role');
				user.save(function (err, res) {
					console.log('removeProjectFromEveryone OK: ' + projectUuid);		
				});
			});
		})

	},

	




	// #########################################
	// ###  API: Update Project              ###
	// #########################################
	updateProject : function (req, res) {
		console.log('Updating project.', req.body);

		var user        = req.user;
		var userid 	= req.user.uuid;
		var projectUuid = req.body.uuid;

		// find project
		var model = Project.findOne({ uuid : projectUuid });
		model.exec(function (err, project) {
			
			// return error
			if (err) return res.end(JSON.stringify({ error : 'Error retrieving project.' }));
			
			// return if not authorized
			if (!api.can.update.project(user, project)) {
				var message = 'Unauthorized access attempt. Your IP ' + req._remoteAddress + ' has been logged.';
				return res.end(JSON.stringify({ error : message }));
			};


					
			// valid fields
			var valid = [
				'name', 
				'logo', 
				'header', 
				'baseLayers',
				'position',
				'bounds',
				'layermenu', 
				'folders', 
				'controls', 
				'description', 
				'keywords', 
				'colorTheme',
				'title',
				'slug',
				'connectedAccounts',
				'settings',
				'categories'
			];
	
			var queries = {};

			// enqueue queries for valid fields
			valid.forEach(function (field) {
				if (req.body[field]) {
					console.log('Updating project field: ', field);

					// enqueue update
					queries = api._enqueueProjectUpdate(queries, field, req);
				}
			});

			// run queries to database
			async.parallel(queries, function(err, doc) {
				// handle err
				if (err) return res.end(JSON.stringify({ 
					error : "Error updating project." 
				}));
							
				// return doc
				res.end(JSON.stringify(doc));
			});
		});
	},


	// async mongo update queue
	_enqueueProjectUpdate : function (queries, field, req) {
		queries[field] = function(callback) {	
			return Project.findOne({ uuid : req.body.uuid }, function (err, project){
				project[field] = req.body[field];
				project.markModified(field);
				project.save(function(err) {
					if (err) console.error(err); // log error
				});
				return callback(err);
			});
		};
		return queries;
	},


	uploadProjectLogo : function (req, res) {

		// var from = req.files.file.path;
		// var file = 'image-' + uuid.v4();
		// var to = '/var/www/data/images/' + file;

		// // rename and move to image folder
		// fs.rename(from, to, function (err) {
			
		// 	if (err) res.end(JSON.stringify({error : err}));
			

		// 	res.end(file);	// file will be saved by client
		// });	

		// process from-encoded upload
		var form = new formidable.IncomingForm({
			hash : 'sha1',
			multiples : true,
			keepExtensions : true,
		});
		form.parse(req, function(err, fields, files) {	
			console.log('formidale: ', util.inspect({fields: fields, files: files}));
			console.log('files! => ', files);
 		


			var from = files.file.path;
			// var from = req.files.file.path;
			var file = 'image-' + uuid.v4();
			var to   = IMAGEFOLDER + file;
			
			// // rename and move to image folder
			fs.rename(from, to, function (err) {
				if (err) res.end(JSON.stringify({error : err}));
				res.end(file);	// file will be saved by client
			});		
	 	});
	},


	uploadClientLogo : function (req, res) {
		// var from = req.files.file.path;
		// var file = 'image-' + uuid.v4();
		// var to   = IMAGEFOLDER + file;

		// // rename and move to image folder
		// fs.rename(from, to, function (err) {
		// 	if (err) res.end(JSON.stringify({error : err}));
		// 	res.end(file);	// file will be saved by client
		// });	
		
		// process from-encoded upload
		var form = new formidable.IncomingForm({
			hash : 'sha1',
			multiples : true,
			keepExtensions : true,
		});
		form.parse(req, function(err, fields, files) {	
			console.log('formidale: ', util.inspect({fields: fields, files: files}));
			console.log('files! => ', files);
 		


			var from = files.file.path;
			// var from = req.files.file.path;
			var file = 'image-' + uuid.v4();
			var to   = IMAGEFOLDER + file;
			
			// // rename and move to image folder
			fs.rename(from, to, function (err) {
				if (err) res.end(JSON.stringify({error : err}));
				res.end(file);	// file will be saved by client
			});		
	 	});
	},


	uploadImage : function (req, res) {

		// process from-encoded upload
		var form = new formidable.IncomingForm({
			hash : 'sha1',
			multiples : true,
			keepExtensions : true,
		});
		form.parse(req, function(err, fields, files) {	
			console.log('formidale: ', util.inspect({fields: fields, files: files}));
			console.log('files! => ', files);
 		


			var from = files.file.path;
			// var from = req.files.file.path;
			var file = 'image-' + uuid.v4();
			var to   = IMAGEFOLDER + file;
			
			// // rename and move to image folder
			fs.rename(from, to, function (err) {
				if (err) res.end(JSON.stringify({error : err}));
				res.end(file);	// file will be saved by client
			});		
	 	});

	},












	// #########################################
	// ###  API: Create Client               ###
	// #########################################
	createClient : function (req, res) {

		// set vars
		var user = req.user;
		var json = req.body;

		// return if not authorized
		if (!api.can.create.client( user )) {
			var message = 'Unauthorized access attempt. Your IP ' + req._remoteAddress + ' has been logged.';
			return res.end(JSON.stringify({ error : message }));
		};

		// create new client
		var client 		= new Clientel();
		client.uuid 		= 'client-' + uuid.v4();
		client.createdBy 	= user.uuid;
		client.slug 		= json.name.replace(/\s+/g, '').toLowerCase();	// TODO: check if unique?
		client.name 		= json.name;
		client.description 	= json.description;
		client.keywords 	= json.keywords;

		// save new client
		client.save(function(err) {
			if (err) return res.end(JSON.stringify({
				error : 'Error creating client.'
			}));
			
			// add to superadmins
			api.addClientToSuperadmins(client.uuid);

			// saved ok
			res.end(JSON.stringify(client));
		});
	},


	addClientToSuperadmins : function (clientUuid) {
		User.find({uuid : {$in : superusers}}, function (err, results) {
			results.forEach(function (user) {
				user.role.reader.clients.addToSet(clientUuid);
				user.role.editor.clients.addToSet(clientUuid);
				user.role.manager.clients.addToSet(clientUuid);
				user.markModified('role');
				user.save(function (err, res) {
					console.log('addClientToSuperadmins OK: ' + clientUuid);		
				});
			});
		});
	},

	


	// #########################################
	// ###  API: Delete Client               ###
	// #########################################
	deleteClient : function (req, res) {
		var clientUuid = req.body.cid;
		var userUuid = req.user.uuid;
		var user = req.user;


		// find client
		var model = Clientel.findOne({ uuid : clientUuid });
		model.exec(function (err, client) {
			
			// return error
			if (err) return res.end(JSON.stringify({ error : 'Error retrieving client.' }));
			
			// return if not authorized
			if (!api.can.remove.client(user, client)) {
				var message = 'Unauthorized access attempt. Your IP ' + req._remoteAddress + ' has been logged.';
				return res.end(JSON.stringify({ error : message }));
			};

			// remove client		
			model.remove(function(err, result) { 
				if (err) return res.end(JSON.stringify({
					error : 'Error removing client.'
				}));

				console.log('Removed client ', client.name);

				// remove from superadmins
				api.removeClientFromEveryone(client.uuid);

				// return
				res.end(JSON.stringify(result)); 
			});
		});
	},


	removeClientFromSuperadmin : function (clientUuid) {
		User.find({uuid : {$in : superusers}}, function (err, results) {
			results.forEach(function (user) {
				user.role.reader.clients.pull(clientUuid);
				user.role.editor.clients.pull(clientUuid);
				user.role.manager.clients.pull(clientUuid);
				user.markModified('role');
				user.save(function (err, res) {
					console.log('removeClientFromSuperadmin OK: ' + clientUuid);		
				});
			});
		});
	},

	// remove project from all users
	removeClientFromEveryone : function (clientUuid) {

		User
		.find({ $or : [ { 'role.reader.clients'  : clientUuid }, 
		 		{ 'role.editor.clients'  : clientUuid }, 
		 		{ 'role.manager.clients' : clientUuid } ]
		 })
		.exec(function (err, users) {
			users.forEach(function (user) {
				user.role.reader.clients.pull(clientUuid);
				user.role.editor.clients.pull(clientUuid);
				user.role.manager.clients.pull(clientUuid);
				user.markModified('role');
				user.save(function (err, res) {
					console.log('removeclientsFromEveryone OK: ' + clientUuid);		
				});
			});
		})

	},
	




	// #########################################
	// ###  API: Update Client               ###
	// #########################################
	updateClient : function (req, res) {

		var clientUuid 	= req.body.uuid;
		var userid 	= req.user.uuid;
		var user        = req.user;
		var queries 	= {};
		
		console.log('saving client: ', req.body);
		

		// find client
		var model = Clientel.findOne({ uuid : clientUuid });
		model.exec(function (err, client) {
			
			// return error
			if (err) return res.end(JSON.stringify({ error : 'Error retrieving client.' }));
			
			// return if not authorized
			if (!api.can.update.client(user, client)) {
				var message = 'Unauthorized access attempt. Your IP ' + req._remoteAddress + ' has been logged.';
				return res.end(JSON.stringify({ error : message }));
			};


			// add projects to client
			if (isObject(req.body.projects)) {
				queries.projects = function(callback) {
					return Clientel.findOne({ uuid : clientUuid }, function (err, client){
						client.projects = req.body.projects;
						client.save(function(err) {
							if (err) return res.end(JSON.stringify({
								error : 'Error updating client.'
							}));
						});
						return callback(err);
					});
				}
			}

			// update name
			if (req.body.name) {
				queries.name = function(callback) {
					return Clientel.findOne({ uuid : clientUuid }, function (err, client){
						client.name = req.body.name;
						client.save(function(err) {
							if (err) return res.end(JSON.stringify({
								error : 'Error updating client.'
							}));
						});
						return callback(err);
					});
				}
			}

			// update description
			if (req.body.description) {
				queries.description = function(callback) {
					return Clientel.findOne({ uuid : clientUuid }, function (err, client){
						client.description = req.body.description;
						client.save(function(err) {
							if (err) return res.end(JSON.stringify({
								error : 'Error updating client.'
							}));
						});
						return callback(err);
					});
				}
			}

			// update description
			if (req.body.logo) {
				queries.logo = function(callback) {
					return Clientel.findOne({ uuid : clientUuid }, function (err, client){
						client.logo = req.body.logo;
						client.save(function(err) {
							if (err) return res.end(JSON.stringify({
								error : 'Error updating client.'
							}));
						});
						return callback(err);
					});
				}
			}

			async.series(queries, function(err, doc) {
				if (err) return res.end(JSON.stringify({
					error : 'Error updating client.'
				}));		

				// return
				res.end(JSON.stringify(doc));
			});
		});
	},



	// #########################################
	// ###  API: Check Unique Client         ###
	// #########################################
	checkClientUnique : function (req, res) {
		Clientel.find({ 'slug' : req.body.slug}, function(err, result) { 
			if (result.length == 0) return res.end('{"unique" : true }'); 	// unique
			return res.end('{"unique" : false }');				// not unique
		});
	},



































	// #########################################
	// ###  API: Create User                 ###
	// #########################################
	createUser : function (req, res) {

		var user      = req.user;
		var email     = req.body.email;
		var lastName  = req.body.lastName;
		var firstName = req.body.firstName;
		var company   = req.body.company;
		var position  = req.body.position;
		var phone     = req.body.phone;


		// return if not authorized
		if (!api.can.create.user( user )) {
			var message = 'Unauthorized access attempt. Your IP ' + req._remoteAddress + ' has been logged.';
			return res.end(JSON.stringify({ error : message }));
		};

		// return if no email, or if email already in use
		if (!email) {
			var message = 'Unauthorized access attempt. Your IP ' + req._remoteAddress + ' has been logged.';
			return res.end(JSON.stringify({ error : message }));
		};


		// create the user
		var newUser            	= new User();
		newUser.uuid 		= 'user-' + uuid.v4();
		newUser.local.email    	= email;	
		var password 		= crypto.randomBytes(16).toString('hex');
		newUser.local.password 	= newUser.generateHash(password);
		newUser.firstName 	= firstName;
		newUser.lastName 	= lastName;
		newUser.company 	= company;
		newUser.position 	= position;
		newUser.phone 		= phone;
		newUser.createdBy	= user.uuid;
		
		// save the user
		newUser.save(function(err, doc) { 
			if (err) return res.end(JSON.stringify({
				error : 'Error creating user.'
			}));

			// send email with login details to user
			api.sendNewUserEmail(newUser, password);
			
			// return success
			res.end(JSON.stringify(doc));

		});

		

	},




	sendNewUserEmail : function (newUser, password) {
		console.log('sending email!')
		
		// todo: SSL
		var name    = newUser.firstName + ' ' + newUser.lastName;
		var email   = newUser.local.email;

		var from    = 'Systemapic.com <knutole@noerd.biz>';
		var to      = email;
		var body    = '<h1>Welcome to Systemapic.com ' + name + '</h1><br><h3>Login to <a href="http://systemapic.com" target="_blank">Systemapic.com</a> with the following details:</h3><br>Username: ' + email + ' <br>Password: ' + password;
		var subject = 'Congratulations! Here are your access details for Systemapic.com';
		var bcc     = ['knutole@noerd.biz']; // todo: add admins, superadmins to bcc

		// hook up to gmail
		var transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: 'knutole@noerd.biz',
				pass: '***REMOVED***@noerdbiz'
			}
		});

		// send email
		transporter.sendMail({
			from    : from,
			to      : to,	
			bcc     : bcc, 
			subject : subject,
			html    : body
		});

	},



	// #########################################
	// ###  API: Update User                 ###
	// ######################################### 	// todo: send email notifications on changes?
	updateUser : function (req, res) {

		console.log('update user: ', req.body);

		var userUuid 	= req.body.uuid;
		var authUser 	= req.user.uuid;
		var user        = req.user;

		// find user
		var model = User.findOne({ uuid : userUuid });
		model.exec(function (err, subject) {
			
			// return error
			if (err) return res.end(JSON.stringify({ error : 'Error retrieving client.' }));
			
			// return if not authorized
			if (!api.can.update.user(user, subject)) {
				var message = 'Unauthorized access attempt. Your IP ' + req._remoteAddress + ' has been logged.';
				return res.end(JSON.stringify({ error : message }));
			};





			// create async queue
			var queries = {};

			// save company
			if (req.body.company) {
				queries.company = function(callback) {
					return User.findOne({ uuid : userUuid }, function (err, user) {
						// set and save
						user.company = req.body.company;
						user.save(function(err) {
							if (err) console.error(err); // log error
						});
						// async callback
						return callback(err, user);
					});
				}
			}

			// save position
			if (req.body.position) {
				queries.position = function(callback) {
					return User.findOne({ uuid : userUuid }, function (err, user) {
						// set and save
						user.position = req.body.position;
						user.save(function(err) {
							if (err) console.error(err); // log error
						});
						// async callback
						return callback(err, user);
					});
				}
			}

			// save phone
			if (req.body.phone) {
				queries.phone = function(callback) {
					return User.findOne({ uuid : userUuid }, function (err, user) {
						// set and save
						user.phone = req.body.phone;
						user.save(function(err) {
							if (err) console.error(err); // log error
						});
						// async callback
						return callback(err, user);
					});
				}
			}

			// // save email
			// if (req.body.email) {
			// 	queries.email = function(callback) {
			// 		return User.findOne({ uuid : userUuid }, function (err, user) {
			// 			// set and save
			// 			user.local.email = req.body.email;
			// 			user.save(function(err) {
			// 				if (err) console.error(err); // log error
			// 			});
			// 			// async callback
			// 			return callback(err, user);
			// 		});
			// 	}
			// }

			// save company
			if (req.body.firstName) {
				queries.firstName = function(callback) {
					return User.findOne({ uuid : userUuid }, function (err, user) {
						// set and save
						user.firstName = req.body.firstName;
						user.save(function(err) {
							if (err) console.error(err); // log error
						});
						// async callback
						return callback(err, user);
					});
				}
			}

			// save company
			if (req.body.lastName) {
				queries.lastName = function(callback) {
					return User.findOne({ uuid : userUuid }, function (err, user) {
						// set and save
						user.lastName = req.body.lastName;
						user.save(function(err) {
							if (err) console.error(err); // log error
						});
						// async callback
						return callback(err, user);
					});
				}
			}

			
		
			// run async queries
			async.parallel(queries, function(err, doc) {

				// return error
				if (err) return res.end(JSON.stringify({
					error : 'Error updating user.'
				}));	
				
				// return success
				res.end(JSON.stringify(doc));
			});
		});
	},






	// #########################################
	// ###  API: Remove User                 ###	//todo: send email notifications?
	// #########################################
	deleteUser : function (req, res) {

		var userUuid 	= req.body.uuid;
		var authUser 	= req.user.uuid;
		var user        = req.user;

		// find user
		var model = User.findOne({ uuid : userUuid });
		model.exec(function (err, subject) {
			
			// return error
			if (err) return res.end(JSON.stringify({ error : 'Error retrieving user.' }));
			
			// return if not authorized
			if (!api.can.remove.user(user, subject)) {
				var message = 'Unauthorized access attempt. Your IP ' + req._remoteAddress + ' has been logged.';
				return res.end(JSON.stringify({ error : message }));
			};

			model.remove().exec(function (err, result) {

				// return error
				if (err) return res.end(JSON.stringify({ error : 'Error retrieving user.' }));

				return res.end(JSON.stringify({ 
					message : 'User deleted.',
					result : result 
				}));

			})
		});
	},










	// #########################################
	// ###  API: Delegate User               ###
	// #########################################
	// add access to projects 
	delegateUser : function (req, res) {

		var user 	= req.user; 		      	// user that is giving access
		var userUuid 	= req.body.userUuid;      	// user that is getting access
		var role 	= req.body.role;  		// role that user is given
		var projectUuid = req.body.projectUuid;   	// project user is given role to
		var add         = req.body.add; 		// add or revoke, true/false
		// var clientUuid  = req.body.clientUuid;		// client that project belongs to

		console.log('delegateUser: ', req.body);

		// return if missing information
		if (!userUuid || !role || !projectUuid) return res.end(JSON.stringify({
			error : 'Error delegating accesss, missing information.'
		}));


		// get project
		Project
		.findOne({uuid : projectUuid})
		.exec(function (err, project) {
			// console.log('Project: ', project.name);

			if (err) return res.end(JSON.stringify({
				error : 'Error delegating accesss, missing information.'
			}));

			Clientel
			.findOne({uuid : project.client})
			.exec(function (err, client) {



				// get user
				User
				.findOne({uuid : userUuid})
				.exec(function (err, subject) {
					console.log('User: ', subject.firstName, subject.lastName);

					// add access
					if (add) {

						console.log('DELEGATING ' + role + ' access to project ' + project.name + ' for user ' + subject.firstName);
		
						// read access
						if (role == 'reader') {

							// check if user is allowed to delegate read access to project
							if (api.can.delegate.reader(user, project)) {

								subject.role.reader.projects.addToSet(project.uuid);
								subject.role.reader.clients.addToSet(project.client); // make sure can read client
								subject.markModified('role');
								subject.save(function (err, result) {
									if (err) return res.end(JSON.stringify({ error : err }));
									var message = 'Success! read'
									return res.end(JSON.stringify({ result : message }));
								});

							} else {
								console.log('access denied: role: reader, user: ' + subject.firstName + ', project: ' + project.name);
								var message = 'Unauthorized access delegation attempt. Your IP ' + req._remoteAddress + ' has been logged.';
								return res.end(JSON.stringify({ error : message }));
							}


						}


						// edit access
						if (role == 'editor') {

							// check if user is allowed to delegate read access to project
							if (api.can.delegate.editor(user, project)) {

								subject.role.editor.projects.addToSet(project.uuid);
								subject.role.reader.clients.addToSet(project.client); // make sure can read client
								subject.markModified('role');
								subject.save(function (err, result) {
									if (err) return res.end(JSON.stringify({ error : err }));
									var message = 'Success!'
									return res.end(JSON.stringify({ result : message }));
								});

							} else {
								console.log('access denied: role: editor, user: ' + subject.firstName + ', project: ' + project.name);
								var message = 'Unauthorized access delegation attempt. Your IP ' + req._remoteAddress + ' has been logged.';
								return res.end(JSON.stringify({ error : message }));
							}

						}

						// manager access
						if (role == 'manager') {

							// check if user is allowed to delegate read access to project
							if (api.can.delegate.manager(user, project)) {

								subject.role.manager.projects.addToSet(project.uuid);
								subject.role.reader.clients.addToSet(project.client); // make sure can read client
								subject.markModified('role');
								subject.save(function (err, result) {
									if (err) return res.end(JSON.stringify({ error : err }));
									var message = 'Success manager!'
									return res.end(JSON.stringify({ result : message }));
								});

							} else {
								console.log('access denied: role: manager, user: ' + subject.firstName + ', project: ' + project.name);
								var message = 'Unauthorized access delegation attempt. Your IP ' + req._remoteAddress + ' has been logged.';
								return res.end(JSON.stringify({ error : message }));
							}


						}




					// revoke access
					} else {

						console.log('REVOKING ' + role + ' access to project ' + project.name + ' for user ' + subject.firstName);
						
						// read access
						if (role == 'reader') {

							// check if user is allowed to delegate read access to project
							if (api.can.delegate.reader(user, project)) {


								return api._revokeClientIfEmpty(user, project, subject, res); //, function (err, subject) {

									// subject.role.reader.projects.pull(project.uuid);
									// // subject.role.reader.clients.pull(project.client); // revoke client also
									// // if no more projects in project.client, revoke client




									// subject.markModified('role');
									// subject.save(function (err, result) {
									// 	if (err) return res.end(JSON.stringify({ error : err }));
									// 	var message = 'Success!'
									// 	return res.end(JSON.stringify({ result : message }));
									// });

									
								// });
								



							} else {
								console.log('access denied: role: reader, user: ' + subject.firstName + ', project: ' + project.name);
								var message = 'Unauthorized access delegation attempt. Your IP ' + req._remoteAddress + ' has been logged.';
								return res.end(JSON.stringify({ error : message }));
							}


						}


						// edit access
						if (role == 'editor') {

							// check if user is allowed to delegate read access to project
							if (api.can.delegate.editor(user, project)) {

								subject.role.editor.projects.pull(project.uuid);
								subject.markModified('role');
								subject.save(function (err, result) {
									if (err) return res.end(JSON.stringify({ error : err }));
									var message = 'Success!'
									return res.end(JSON.stringify({ result : message }));
								});

							} else {
								console.log('access denied: role: editor, user: ' + subject.firstName + ', project: ' + project.name);
								var message = 'Unauthorized access delegation attempt. Your IP ' + req._remoteAddress + ' has been logged.';
								return res.end(JSON.stringify({ error : message }));
							}


						}

						// edit access
						if (role == 'manager') {

							// check if user is allowed to delegate read access to project
							if (api.can.delegate.manager(user, project)) {

								subject.role.manager.projects.pull(project.uuid);
								subject.markModified('role');
								subject.save(function (err, result) {
									if (err) return res.end(JSON.stringify({ error : err }));
									var message = 'Success!'
									return res.end(JSON.stringify({ result : message }));
								});

							} else {
								console.log('access denied: role: manager, user: ' + subject.firstName + ', project: ' + project.name);
								var message = 'Unauthorized access delegation attempt. Your IP ' + req._remoteAddress + ' has been logged.';
								return res.end(JSON.stringify({ error : message }));
							}
						}

					}	
				});

			});

		});
	},




	_revokeClientIfEmpty : function (user, project, subject, res) {


		var clientUuid = project.client;

		Project
		.find({client : clientUuid})
		.exec(function (err, projects) {
			console.log('projects: ', projects);

			// revoke project
			var current = subject.role.reader.projects.toObject();
			console.log('curent: ', current, typeof(current));

			subject.role.reader.projects.pull(project.uuid);
			// subject.role.reader.clients.pull(project.client); // revoke client also
			// if no more projects in project.client, revoke client

			var cur = [];
			current.forEach(function (c) {
				console.log('type: ', typeof(c));
				cur.push(c.toString());
			});

			console.log('cur: ', cur);

			// check if last project
			var clientProjects = [];
			projects.forEach(function(p) {
				clientProjects.push(p.uuid);
			});

			console.log('cP: ', clientProjects);

			var diff = _.difference(clientProjects, cur);

			console.log('diff: ', diff);

			if (diff.length == 0) {
				console.log('last pro!');
				subject.role.reader.clients.pull(project.client);
			}

			subject.markModified('role');
			subject.save(function (err, result) {
				if (err) return res.end(JSON.stringify({ error : err }));
				var message = 'Success!'
				return res.end(JSON.stringify({ result : message }));
			});



		});

		


	},


	// #########################################
	// ###  API: Check Unique Email          ###
	// #########################################
	checkUniqueEmail : function (req, res) {

		var user = req.user;
		var email = req.body.email;

		User.findOne({'local.email' : email}, function (err, result) {
			if (err) return res.end(JSON.stringify({
				error : 'Error checking email.'
			}));

			if (result) return res.end(JSON.stringify({
					unique : false
			}));
			

			return res.end(JSON.stringify({
				unique : true
			}));

		})

	},














	// #########################################
	// ###  API: Get Portal                  ###
	// #########################################
	// served at initalization of Portal
	getPortal : function (req, res) {
		
		var json 	= {};
		var clients 	= [{}];
		var sources 	= [{}];
		var app 	= {};
		var hotlink 	= req.session.hotlink;
		var user        = req.user;

		// var for passing in async series
		var model = {};

		// build async query
		var a = {};

		// get projects
		a.projects = function (callback) { 
			return api._getProjects(callback, user);
		}

		// get clients
		a.clients = function (callback) {
			return api._getClients(callback, user);
		}

		// get users
		a.users = function (callback) {
			api._getUsers(callback, user);
		}

		async.series(a, function (err, json) {
			
			// parse results
			var result 	= {};
			result.account 	= user;
			result.projects = json.projects;
			result.clients 	= json.clients;
			result.users 	= json.users;

			// return result gzipped
			res.writeHead(200, {'Content-Type': 'application/json', 'Content-Encoding': 'gzip'});
			zlib.gzip(JSON.stringify(result), function (err, zipped) {
				res.end(zipped);
			});
		})

	},



	_getUsers : function (callback, user) {

		var a = {};
		var createdByChildren = [];
		var createdByGrandchildren = [];

		// is superadmin, get all users
		if (superadmin(user)) {
			a.superadminUsers = function (cb) {
				User
				.find()
				.exec(function(err, result) { 
					cb(err, result); 
				});
			}
		}
		
		// get all users created by user
		a.createdBy = function (cb) {
			User
			.find({createdBy : user.uuid})
			.exec(function(err, result) { 
				result.forEach(function(r) {
					createdByChildren.push(r.uuid);
				})

				cb(err, result); 
			});
		}

		// get all users created by children, ie. created by a user that User created
		a.createdByChildren = function (cb) {
			User
			.find({createdBy : { $in : createdByChildren }})
			.exec(function(err, result) { 
				result.forEach(function(r) {
					createdByGrandchildren.push(r.uuid);
				})
				cb(err, result); 
			});
		}

		// get all users created by grandchildren
		a.createdByChildren = function (cb) {
			User
			.find({createdBy : { $in : createdByGrandchildren }})
			.exec(function(err, result) { 
				cb(err, result); 
			});
		}

		async.series(a, function (err, allUsers) {

			// return error
			if (err) return callback(err);

			// flatten into one array
			var array = [];
			for (r in allUsers) {
				array.push(allUsers[r]);
			}

			// flatten
			var flat = _.flatten(array)

			// remove duplicates
			var unique = _.unique(flat, 'uuid');

			callback(err, unique);

		});

	},


	_getProjects : function (callback, user) {
		
		// async queries
		var a = {};

		// is superadmin, get all projects
		if (superadmin(user)) {
			a.superadminProjects = function (cb) {
				Project
				.find()
				.populate('files')
				.populate('layers')
				.exec(function(err, result) { 
					cb(err, result); 
				});
			}
		}
		
		// get all projects created by user
		a.createdBy = function (cb) {
			Project
			.find({createdBy : user.uuid})
			.populate('files')
			.populate('layers')
			.exec(function(err, result) { 
				cb(err, result); 
			});
		}

		// get all projects that user is editor for
		a.editor = function (cb) {
			Project
			.find({ uuid : { $in : user.role.editor.projects } })
			.populate('files')
			.populate('layers')
			.exec(function(err, result) { 
				cb(err, result); 
			});
		}

		// get all projects user is reader for
		a.reader = function (cb) {
			Project
			.find({ uuid : { $in : user.role.reader.projects } })
			.populate('files')
			.populate('layers')
			.exec(function(err, result) { 
				cb(err, result); 
			});
		}


		// do async 
		async.parallel(a, function (err, result) {
			
			// return error
			if (err) return callback(err);

			// move into one array
			var array = [];
			for (r in result) {
				array.push(result[r]);
			}

			// flatten
			var flat = _.flatten(array)

			// remove duplicates
			var unique = _.unique(flat, 'uuid');

			callback(err, unique);
		});
		
		

	},


	_getClients : function (callback, user) {

		// async queries
		var a = {};



		// is superadmin, get all projects
		if (superadmin(user)) {
			a.superadminClients = function (cb) {
				Clientel
				.find()
				.exec(function(err, result) { 
					cb(err, result); 
				});
			}
		}
		
		// get all projects created by user
		a.createdBy = function (cb) {
			Clientel
			.find({createdBy : user.uuid})
			.exec(function(err, result) { 
				cb(err, result); 
			});
		}

		// get all projects that user is editor for
		a.editor = function (cb) {
			Clientel
			.find({ uuid : { $in : user.role.editor.clients } })
			.exec(function(err, result) { 
				cb(err, result); 
			});
		}

		// get all projects user is reader for
		a.reader = function (cb) {
			Clientel
			.find({ uuid : { $in : user.role.reader.clients } })
			.exec(function(err, result) { 
				cb(err, result); 
			});
		}


		// do async 
		async.parallel(a, function (err, result) {
			
			// return error
			if (err) return callback(err);

			// flatten into one array
			var array = [];
			for (r in result) {
				array.push(result[r]);
			}

			
			// flatten
			var flat = _.flatten(array)

			// remove duplicates
			var unique = _.unique(flat, 'uuid');

			callback(err, unique);
		});
		
		

	},























	

	getUserManagement : function (req, res) {
		// todo: access control


		var user = req.user;

		// example: 
		// when Ana creates a map, 
		// 	ADMINS:   Ana, Rob, (KO, J)		// can do everythign with project, READ, EDIT, MANAGE
		// 	MANAGERS: John and Jane			// can add READERS to project
		// 	READERS:  Dick, Jock			// can READ project
		// 	EDITORS:  Jill				// can EDIT project (but not manage)


		// what users do current User have access to?
		// 	SUPERS:   nørds only
		// 	ADMINS:   everybody connected to project
		// 	MANAGERS: everybody that have READ access to project + created by self
		// 	READERS:  only self
		// 	EDITORS:  only self
		//
		//	NB: all results are users that User can edit


		var usersList = [];
		var asyncOp = {};

		// ######################################################################
		// ##
		// ##  ADMIN projects
		// ##
		// ######################################################################
		// projects that User is ADMIN for 
		var adminProjects = user.access.projects.admin;

		// find users that have read/write/manage of  	
		asyncOp.admin = function (callback) {

			User.find()
			.where('access.projects.read').in(adminProjects)	// read
			.or().where('access.projects.write').in(adminProjects)	// write
			.or().where('access.projects.manage').in(adminProjects)	// manage
			.where('access.projects.admin').nin(adminProjects)	// not admin
			.exec(function (err, users) {
				callback(null, users);
			});
		};
		

		// ######################################################################
		// ##
		// ##  createdBy ME users
		// ##
		// ######################################################################
		// find createdBy me users
		asyncOp.createdByMe = function (callback) {
			User.find()
			.where({'createdBy' : user.uuid})
			.exec(function (err, users) {
				callback(null, users);
			});
		};


		// ######################################################################
		// ##
		// ##  MANAGER for users
		// ##
		// ######################################################################
		// projects that User is manager for
		var managerProjects = user.access.projects.manage;

		// find users that have READ access only in managerProjects
		asyncOp.manager = function (callback) {
			User.find()
			.where('access.projects.read').in(managerProjects)	// read only
			.where('access.projects.write').nin(managerProjects)
			.where('access.projects.manage').nin(managerProjects)
			.where('access.projects.admin').nin(managerProjects)
			.exec(function (err, users) {
				callback(null, users);

			});
		};

		// ######################################################################
		// ##
		// ##  me self
		// ##
		// ######################################################################
		asyncOp.self = function (callback) {
			usersList.push(user);
			callback(null, user);
		};

		// run async queries
		async.parallel(asyncOp, function (err, results) {
			console.log('async done: ', results);
			
			// return results
			res.end(JSON.stringify({
				users : results
			}));


		})

		



	},



		   

	// zip a file and send to client
	zipAndSend : function (req, res) {

		var files 	= req.body.files;
		var puuids 	= req.body.puuid;
		var pslug 	= req.body.pslug;

		// return if nothing
		if (!files || !puuids || !pslug) return res.end('nothing!');

		// create main folder
		var uuidFolder 	= uuid.v4();
		var basedir 	= TEMPFOLDER + uuidFolder;
		var maindir 	= basedir + '/' + pslug;
		
		fs.mkdirs(maindir, function (err) {		// refactor
			
			// return on error
			if (err) return console.error(err);
			
			// for each file
			var dbl = [], i = 1;
			async.each(files, function (file, callback) {

				// check for no double folder names			
				var filename = file.name;
				if (dbl.indexOf(filename) > -1) filename += '_' + i++; // add index to filename if already exists
				dbl.push(filename);

				// set paths
				var dest = maindir + '/' + filename;
				// var src = '/var/www/data/geo/' + file.uuid ; // folder
				var src = FILEFOLDER + file.uuid ; // folder

				// copy
				fs.copy(src, dest, function(err){ callback(err) });	

			}, 

			// final callback
			function (err) {	// todo: err handling
				
				// execute cmd line zipping 
				var zipfile = basedir + '/' + pslug + '_download.zip';
				var cmd = 'zip -r ' + zipfile + ' *'; 
				var exec = require('child_process').exec;				
				
				// run command
				exec(cmd, { cwd : maindir }, function (err, stdout, stdin) {
					if (err) return res.end(err); // if err

					// send zip uuid
					res.end(uuidFolder);
				});
			});
		});
	},


	// handle file downloads
	downloadFile : function (req, res) {
		
		var file = req.query.file;
		
		console.log('downloadFile: ', file);
								// todo: access
								// 	 download several files (zipped)

		// send the file, simply
		// get file
		File.findOne({ 'uuid' : file }, function(err, record) {
			console.log('GOT download FIEL FILE:');
			console.log(record);

			// if more than one file, zip it up
			// if (record.files.length > 1) {
				console.log('lots of files, gondna zip it up...');
				
				// todo: download several files (zipped)

				// '/var/www/data/files/'; //file-8b8df56b-860f-4583-979a-803676c1c35c'

				
				var name = record.name.replace(/\s+/g, '');

				// execute cmd line zipping 
				var out = '/var/www/data/tmp/' + name + '_' + record.type + '.zip';
				var infile = FILEFOLDER + file + '/*';
				var working_dir = FILEFOLDER + file;
				console.log('infile: ', infile);
				console.log('working_dir', working_dir);
				var cmd = 'zip -rj ' + out + ' *' + ' -x __MACOSX .DS_Store';// + infile; 
				var exec = require('child_process').exec;				
				
				console.log('cmd: ', cmd);

				// run command
				exec(cmd, { cwd : working_dir }, function (err, stdout, stdin) {
					if (err) {
						console.log('err: ', err);
						return res.end(err); // if err
					}

					console.log('err:', err);
					console.log('stdout: ', stdout);
					console.log('stdin: ', stdin);

					console.log('returning zip file: ', out);
					// send zip file
					res.download(out);
				});



			// } else {
			// 	var path = FILEFOLDER + file + '/' + record.files[0];
			// 	res.download(path);
			// 	return;
			// }

			// return res.end('alliscool');

		});

	},


	// download zip
	downloadZip : function (req, res) {
		var file = req.query.file;
		var dive = require('dive');
		var folder = TEMPFOLDER + file;
		var found = false;
		
		console.log('dowzip');

		// find zip file
		dive(folder, 

			// each file callback
			function(err, file) {
				// err
				if (err || !file) return res.end('File not found.');

				if (file.slice(-3) == 'zip') {
					found = true;
					return res.download(file);
								// todo: delete zip file
				}
			}, 

			// callback
			function () { 
				console.log('found: ', found);
				if (!found) return res.end('File not found.'); 
			}	
		);
	},


	// handle file download
	getFileDownload : function (req, res) {

		// console.log('req: ', req);
		console.log('req.query......', req.query);
	
		var file = req.query.file;
		var type = req.query.type || 'file';
	
		console.log('type: ', type);
		console.log('file: ', file);

		// if (!file) { res.end('Please specify a file.'); return; }
		if (!file) {
			console.log('NOT FILE!');
		}
		// todo: access restrictions

		// zip file
		if (type == 'zip') return api.downloadZip(req, res);
			
		// normal file
		if (type == 'file') {
			return api.downloadFile(req, res);
			
		} else {
			return api.downloadFile(req, res);
		}
		// got nothing to do
		res.end('Please specifys a file.'); return;

	},


	// update a file
	updateFile : function (req, res) {
		var fuuid = req.body.uuid;
		var userid = req.user.uuid;
		var queries = {};


		// update name
		if (req.body.hasOwnProperty('name')) {
			console.log('name!');
			queries.name = function(callback) {

				var key = 'name';
				var value = req.body.name;

				// update
				api._updateFile(req, fuuid, key, value, function (result) {
					return callback(result);
				});

			}
		}

		// update description
		if (req.body.hasOwnProperty('description')) {
			queries.description = function(callback) {

				var key = 'description';
				var value = req.body.description;

				// update
				api._updateFile(req, fuuid, key, value, function (result) {
					return callback(result);
				});
				

			}
		}

		// update status
		if (req.body.hasOwnProperty('status')) {
			queries.status = function(callback) {

				var key = 'status';
				var value = req.body.status;

				// update
				api._updateFile(req, fuuid, key, value, function (result) {
					return callback(result);
				});
				

			}
		}

		// update keywords
		if (req.body.hasOwnProperty('keywords')) {
			queries.keywords = function(callback) {

				var key = 'keywords';
				var value = req.body.keywords;

				// update
				api._updateFile(req, fuuid, key, value, function (result) {
					return callback(result);
				});
				

			}
		}

		// update category
		if (req.body.hasOwnProperty('category')) {
			queries.category = function(callback) {

				var key = 'category';
				var value = req.body.category;

				// update
				api._updateFile(req, fuuid, key, value, function (result) {
					return callback(result);
				});
				

			}
		}

		// update version
		if (req.body.hasOwnProperty('version')) {
			queries.version = function(callback) {

				var key = 'version';
				var value = req.body.version;

				// update
				api._updateFile(req, fuuid, key, value, function (result) {
					return callback(result);
				});
				

			}
		}



		async.parallel(queries, function(err, doc) {

			// return on error
			if (err) return res.end(JSON.stringify({
				error : err
			}));
					
			// return doc
			res.end(JSON.stringify(doc));

		});

	},

	_updateFile : function (req, fuuid, key, value, callback) {

		File
		.findOne({uuid : fuuid})
		.exec(function (err, file) {
			if (err) return callback(err);

			// return if not file
			if (!file) return callback('No such file.');

			// check access
			var access = api.can.update.file(req.user, file);

			// return if no access
			if (!access) return callback('No access.');
			
			// update
			file[key] = value;
			file.save(function (err) {
				callback(err);
			});
		});


	},

	// delete a file
	deleteFiles : function (req, res) {

		var _fids  = req.body._fids,
		    puuid  = req.body.puuid,
		    userid = req.user.uuid,
		    uuids = req.body.uuids,
		    ops = [],
		    _lids = [];

		console.log('API: deleteFiles');
		console.log('_fids: ', _fids);
		console.log('puuid: ', puuid);
		console.log('userid: ', userid);
		console.log('uuids: ', uuids);



		// validate
		if (!_fids || !puuid || !userid) return res.end('missing!');

		var ops = [];

			// find layer _ids for removing in project
			ops.push(function (callback) {

				Layer.find({file : {$in : uuids}}, function (err, layers) {

					layers.forEach(function (layer) {
						_lids.push(layer._id);
					});

					
					// todo: delete?

					return callback(err);
			
				});

			});

			// delete file from project
			ops.push(function (callback) {
				
				Project
				.findOne({uuid : puuid})
				// .populate('layers')
				.exec(function (err, project) {
					if (err) console.log('find err: ', err);

					console.log('found project: ', project.name);

					// pull files
					_fids.forEach(function (f) {
						project.files.pull(f);
					});

					// pull layers
					_lids.forEach(function (l) {
						project.layers.pull(l)
					})
					
					project.markModified('files');
					project.markModified('layers');

					project.save(function (err) {
						if (err) console.error('save err: ', err);
						console.log('file removed from project');
						return callback(err);
					});
				});
			});

			


	
		// run queries
		async.series(ops, function(err) {

			if (err) {
				console.log('asyn err: ', err);
				return res.end('{ error : 0 }');
			}		

			console.log('delete done...?');
			res.end(JSON.stringify({
				error : err
			}));
		});

	},


	// get layers and send to client
	getLayers : function (req, res) {

		var project 	= req.body.project 	|| false;
		var user 	= req.user.uuid 	|| false;

		// error if no project or user
		if (!project) return res.end("{ 'error' : 'no project id?'}"); 
		if (!user)    return res.end("{ 'error' : 'no user id?'}"); 


		// get project
		Project.find({ 'access.read' : user, 'uuid' : project }, function(err, result) { 
			if (err) { console.log('got error', err); }

			// got project
			Layer.find({ 'uuid': { $in: result.layers }}, function(err, docs){
				if (err) { console.log('got errorw', err); }
				
				// return layers
				res.end(JSON.stringify(docs));
			});
		});
	},






	// #########################################
	// ###  API: Update Layer                ###
	// #########################################
	updateLayer : function (req, res) {
		console.log('updateLayer');

		var layerUuid 	= req.body.layer || false;
		var user 	= req.user;
		
		console.log('req.body: ', req.body);

		// error if no project or user
		if (!layerUuid) return res.end(JSON.stringify({
			error : 'Missing layer uuid.'
		})); 



		Layer.findOne({'uuid' : layerUuid}, function (err, layer) {
			if (err) console.error('Layer.findOne: ', err);

			// error if no project or user
			if (!layer) return res.end(JSON.stringify({
				error : 'Missing layer uuid.'
			})); 

			console.log('found layer?', layer);
			
			// update description
			if (req.body.hasOwnProperty('description')) {

				var description = req.body.description;
				console.log('updating description: ', description);
				layer.description = description;
				layer.save(function(err) {
					if (err) throw err;
				});

			};


			// update title
			if (req.body.hasOwnProperty('title')) {

				var title = req.body.title;
				layer.title = title;
				layer.save(function(err) {
					if (err) throw err;
				});

			};

			// update tooltip
			if (req.body.hasOwnProperty('tooltip')) {

				var tooltip = req.body.tooltip;
				layer.tooltip = tooltip;
				layer.save(function (err) {
					if (err) throw err;
				});

			}

			// update legends
			if (req.body.hasOwnProperty('legends')) {

				var legends = req.body.legends;
				layer.legends = legends;
				layer.save(function (err) {
					if (err) throw err;
				});

				console.log('saved legends!!', legends);
			}

			// update zIndex
			if (req.body.hasOwnProperty('zIndex')) {

				var zIndex = req.body.zIndex;
				layer.zIndex = zIndex;
				layer.save(function (err) {
					if (err) throw err;
				});

				console.log('saved zIndex!!', zIndex);

			}

			// update style
			if (req.body.hasOwnProperty('style')) {

				var style = req.body.style;

				console.log('Setting style: ', style);

				// {
				// 	__sid : '232332',
				// 	style : {
				// 		color : "2323"
				// 	}
				// }

				var __sid = style.__sid;
				var newStyle = style.style;

				var existing = _.find(layer.style, function (s) {
					return s.__sid == __sid;
				});

				console.log('existing: ', existing);
				
				if (existing) {
					// get style
					var existingStyle = JSON.parse(existing.style);

					// set style
					for (t in newStyle) {
						existingStyle[t] = newStyle[t];
					}

					// referenced to layer.style, so should save
					existing.style = JSON.stringify(existingStyle);


				} else {

					layer.style.push({
						__sid : __sid,
						style : JSON.stringify(newStyle)
					});

				}

				layer.markModified('style');

				layer.save(function (err) {
					if (err) throw err;
				});





			};

			res.end('save done');
		});

	},

	// update geojson file
	updateGeojsonFile : function (req, res) {



	},

	// get geojson
	getGeojsonFile : function (req, res) {

		var uuid = req.body.uuid;	// file-1091209120-0129029
		var user = req.user.uuid;	// user-1290192-adasas-1212
		var projectUuid = req.body.projectUuid;

		console.log('uuid: ', uuid);
		console.log('user: ', user);
		console.log('project: ', projectUuid);

		// return if invalid
		if (!uuid || !user) return false;

		// get geojson file path from db
		File
		.where('data.geojson', uuid)							// must have this
		.or([{'access.users' : user}, {'access.projects' : projectUuid}])	// either of these
		.limit(1)	// safeguard
		.exec(function(err, record) {
			console.log('found: ', record);
			return api.sendGeoJsonFile(req, res, record[0]);
		});
	},





	// send geojson
	sendGeoJsonFile : function (req, res, record) {

		// return if nothing
		if (!record) return res.end(JSON.stringify({
			error: 'No such file.'
		}));

	
		var geojson = record.data.geojson;
		console.log('geojson file: ', geojson);

		// return if nothing
		if (!geojson) return res.end(JSON.stringify({
			error : 'No such file.'
		}));

		// read file and ship it
		var uuid = record.uuid;
		var path = FILEFOLDER + uuid + '/' + geojson;

		console.log('path: ', path);

		fs.readJson(path, function (err, data) {
			console.log('err: ', err);

			if (err) return res.end(JSON.stringify({
				error : 'Error reading file.'
			}));

			if (!data) return res.end(JSON.stringify({
				error : 'File not found.'
			}));

			console.log('readJson: ', data.length);

			// ready string
			var string = JSON.stringify(data);

			res.set({
				'Content-Type': 'text/json',		// todo: encoding of arabic characters, tc.
			});
			
			res.end(string);

		});

	},


	// send geojson helper 
	_sendGeoJsonFile : function (req, res, record) {

		var geo = [];

		// for each file
		async.each(record.files, function (file, callback) {
			fs.readFile(file, function (err, data) {
				if (data) geo.push(JSON.parse(data));	// added error handling
				callback(err);
			})		
		}, 

		// final callback
		function (err) {

			// set filesize
			var string = JSON.stringify(geo);
			var length = string.length.toString();
			res.set({
				'Content-Type': 'text/json',
				'Content-Length': length
			});
			
			// return geojson string
			res.end(JSON.stringify(geo));
		});
		
	},

	
	// save mapbox layers to db
	saveMapboxLayers : function (userId, projectId, maps) {
		
		Project.update(
		    
			// conditions
			{ 	'access.write' 	: userId, 
				'uuid' 		: projectId 
			}, 

			// update objects
			{ $pushAll : { 'mapboxLayers' : maps }},

			// callback
			function (err, numberAffected, raw) {
				console.log('save done, ', err, numberAffected, raw);
			}
		);

	},


	

	// setRedisToken : function (user) {



	// 	var key = 'authToken-' + user._id;
	// 	var tok = crypto.randomBytes(22).toString('hex');
	

	// 	console.log('user _id', user._id);
	// 	console.log('redis key: ', key);
	// 	console.log('redis authToken: ', tok);



	// 	redisClient.get(key, function (err, reply) {
	// 		console.log('getting old key err, replu', err, reply);

	// 		if (reply) {
	// 			console.log('reply: ', reply)
	// 			console.log('I live: ' + reply.toString());
	// 		} 
	// 	});



	// 	// set key with 2 min expire
	// 	console.log('setting new token');
	// 	redisClient.set(key, tok, redis.print);
	// 	redisClient.expire(key, 120);	// 2 minutes

	// 	redisClient.get(key, function (err, reply) {
	// 		console.log('getting new key err, replu', err, reply);

	// 		if(reply) {
	// 			console.log('reply: ', reply)
	// 			console.log('I live: ' + reply.toString());
	// 		} 
	// 	});

	// 	return tok;
		
	// },




	// process wildcard paths, including hotlinks
	processWildcardPath : function (req, res) {

		// get client/project
		var path 	= req.originalUrl.split('/');
		var client 	= path[1];
		var project 	= path[2];

		var hotlink = {
			client : client,
			project : project
		}
		if (req.isAuthenticated()) {
			req.session.hotlink = hotlink;
			res.render('../../views/app.ejs', {
				hotlink : hotlink || {},
			});
		} else {
			// redirect to login with hotlink embedded
			req.session.hotlink = hotlink;
			res.redirect('/login');
		}

	},



	getHash : function (req, res) {
		console.log('getHash: req.body: ', req.body);
	
		var id = req.body.id;
		var projectUuid = req.body.projectUuid;		// todo: access restrictions

		Hash
		.findOne({id : id, project : projectUuid})
		.exec(function (err, doc) {

			res.end(JSON.stringify({
				error: err,
				hash : doc
			}));

		});

	},

	setHash : function (req, res) {
		console.log('setHash: req.body: ', req.body);

		var projectUuid = req.body.projectUuid,
		    position 	= req.body.hash.position,
		    layers 	= req.body.hash.layers,
		    id 		= req.body.hash.id;

		// create new hash
		var hash 	= new Hash();
		hash.uuid 	= 'hash-' + uuid.v4();
		hash.position 	= position;
		hash.layers 	= layers;
		hash.id 	= id;
		hash.createdBy 	= req.user.uuid;
		hash.createdByName = req.user.firstName + ' ' + req.user.lastName;
		hash.project 	= projectUuid;

		hash.save(function (err, doc) {
			console.log('hash saved', err, doc);
			res.end(JSON.stringify({
				error: err,
				hash : doc
			}));
		});

		
	},












	

	

	




	// CRUD capabilities
	can : {

		create : {
			project : function (user) {
				if (superadmin(user)) return true;
				if (user.role.admin)  return true;
				return false;
			},
			client : function (user) {
				if (superadmin(user)) return true;
				if (user.role.admin)  return true;
				return false;
			},
			
			user : function (user) {

				// can create users without any CRUD privileges
				if (superadmin(user)) return true;
				if (user.role.admin) return true;

				// if user is manager anywhere
				if (user.role.manager.projects.length > 0) return true;
				return false;
			}
		},

		delegate : {
			superadmin : function (user) {
				if (superadmin(user)) return true;
				return false;
			},
			admin : function (user) {
				if (superadmin(user)) return true;
				return false;
			},
			manager : function (user, project) {
				if (superadmin(user)) return true;

				// can add managers for own projects
				if (user.role.admin && project.createdBy == user.uuid) return true; 

				// if admin and got --U- for someone else's project
				if (user.role.admin && api.can.update.project(user, project)) return true;

				return false;
			},
			editor : function (user, project) { // project or client
				if (superadmin(user)) return true;
				
				// can create editors for own projects
				if (user.role.admin && project.createdBy == user.uuid)  return true;

				// if admin and got --U- for someone else's project
				if (user.role.admin && api.can.update.project(user, project)) return true;

				return false;
			},
			reader : function (user, project) { // project or client
				if (superadmin(user)) return true;

				// can create readers for own projects
				if (user.role.admin && project.createdBy == user.uuid)  return true;

				// if admin and got --U- for someone else's project
				if (user.role.admin && api.can.update.project(user, project)) return true;

				// managers can create readers for own projects
				if (user.role.manager.projects.indexOf(project.uuid) >= 0) return true;

				return false;
			},


		},

		read : {
			project : function (user, project) {
				if (superadmin(user)) return true;

				// admin can -R-- own projects
				if (user.role.admin && project.createdBy == user.uuid)  return true;

				// if manager, editor or reder
				// if (user.role.manager.projects.indexOf(uuid) >= 0) return true;
				// if (user.role.editor.projects.indexOf(uuid)  >= 0) return true;
				if (user.role.reader.projects.indexOf(uuid)  >= 0) return true;

				return false;
			},
			client : function (user, client) {
				if (superadmin(user)) return true;

				// admin can -R-- own clients
				if (user.role.admin && client.createdBy == user.uuid)  return true;

				// if manager, editor, reader
				// if (user.role.manager.clients.indexOf(client.uuid) >= 0) return true; 
				// if (user.role.editor.clients.indexOf(client.uuid)  >= 0) return true; 
				if (user.role.reader.clients.indexOf(client.uuid)  >= 0) return true; 

				return false;
			}
		},

		update : {
			project : function (user, project) {
				if (superadmin(user)) return true;

				// if admin and has created project oneself
				if (user.role.admin && project.createdBy == user.uuid) return true;

				// if editor of project
				if (user.role.editor.projects.indexOf(project.uuid) >= 0) return true; 

				return false;

			},
			client : function (user, client) {
				if (superadmin(user)) return true;

				// hacky error checking
				if (!client) return false;
				if (!user) return false;

				// if admin and has created client oneself
				if (user.role.admin && client.createdBy == user.uuid)  return true;

				// if editor of client
				if (user.role.editor.clients.indexOf(client.uuid) >= 0) return true; // managers can create readers for own projects

				return false;
			},
			user   : function (user, subject, uuid) {  // update of user info, not adding roles
				if (superadmin(user)) return true;

				// if user is created by User (as admin, manager)
				if (subject.createdBy == user.uuid) return true; 
				
				// if is self
				if (subject.uuid == user.uuid) return true;

				return false;				
			},

			file   : function (user, file) {
				if (superadmin(user)) return true;

				// if user can update project which contains file, then user can edit file
				var access = false;
				file.access.projects.forEach(function (p) { // p = projectUuid
					if (api.can.update.project(user, p)) access = true;
				});
				return access;

			}
		},

		remove : {
			project : function (user, project) {
				if (superadmin(user)) return true;

				// can remove own project
				if (user.role.admin && project.createdBy == user.uuid) return true;

				// if admin and editor of project
				if (user.role.admin && user.role.editor.projects.indexOf(project.uuid) >= 0) return true;
				
				// editors can not remove projects

				return false;

			},
			client : function (user, client) {
				if (superadmin(user)) return true;

				// can remove own project
				if (user.role.admin && client.createdBy == user.uuid) return true;

				// if admin and editor of project
				if (user.role.admin && user.role.editor.clients.indexOf(client.uuid) >= 0) return true;
				
				// editors can not remove projects
				return false;				
			},


			user : function (user, subject) {

				// can remove users
				if (superadmin(user)) return true;

				// can remove user if admin and created by self
				if (user.role.admin && subject.createdBy == user.uuid) return true;

				// if user is manager anywhere and created by self
				if (user.role.manager.projects.length > 0 && subject.createdBy == user.uuid) return true;
				return false;
			}
		},
	},

				

}


// helper function 
function isObject(obj) {
	return (Object.prototype.toString.call(obj) === '[object Object]' || Object.prototype.toString.call(obj) === '[object Array]');
}
// convenience method for checking hardcoded super user
function superadmin(user) {
	if (superusers.indexOf(user.uuid) >= 0) return true;
	return false;
}