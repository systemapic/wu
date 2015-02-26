// API: api.layer.js

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
module.exports = api.layer = { 


	// create layer
	create : function (req, res) {

		// lol?
		return res.end(JSON.stringify({error : 'Unsupported.'}))


		var layerType = req.body.layerType;

		if (layerType == 'geojson') return api.layer.createLayerFromGeoJSON(req, res);

		res.end(JSON.stringify({
			layer : 'yo!'
		}));



	},

	// _create : function (options, callback) {

		

	// },

	// create OSM layer
	createOSM : function (req, res) {

		var projectUuid = req.body.projectUuid;
		var title = req.body.title;

		var layer 		= new Layer();
		layer.uuid 		= 'osm-layer-' + uuid.v4();
		layer.title 		= title;
		layer.description 	= 'Styleable vector tiles';
		layer.data.osm 	 	= true;
		layer.legend 		= '';
		layer.file 		= 'osm';

		layer.save(function (err, doc) {

			// return layer to client
			res.end(JSON.stringify(doc));

			// add to project
			api.dbAddLayerToProject(layer._id, projectUuid);
		});
	},

	// create layer from geojson
	createLayerFromGeoJSON : function (req, res) {

		var geojson = req.body.geojson;
		var projectUuid = req.body.project;

		var filename = uuid.v4() + '.geojson';
		var outfile = '/tmp/' + filename;
		var data = JSON.stringify(geojson);
		var size = data.length;

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

			// upload.upload(req, res);
			api.upload.file(req, res);

		});

	},

	// get layers and send to client
	get : function (req, res) {

		var project 	= req.body.project;
		var user 	= req.user.uuid;

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



	// update layer
	update : function (req, res) {
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


			res.end('save done');
		});

	},


	deleteLayer : function (req, res) {

		var projectUuid  = req.body.projectUuid,
		    userid = req.user.uuid,
		    layerUuids = req.body.layerUuids,
		    ops = [],
		    _lids = [];

		console.log('API: deleteLayers');
		console.log('puuid: ', projectUuid);
		console.log('userid: ', userid);
		console.log('uuids: ', layerUuids);


		// validate
		if (!projectUuid || !userid) return res.end('missing!');

		var ops = [];

		// find layer _ids for removing in project
		ops.push(function (callback) {
			Layer.find({uuid : {$in : layerUuids}}, function (err, layers) {
				layers.forEach(function (layer) {
					_lids.push(layer._id);
				});

				callback(err);
			});
		});



		// delete layer from project
		ops.push(function (callback) {
			
			Project
			.findOne({uuid : projectUuid})
			// .populate('layers')
			.exec(function (err, project) {
				if (err) console.log('find err: ', err);

				console.log('found project: ', project.name);

				// // pull files
				// _fids.forEach(function (f) {
				// 	project.files.pull(f);
				// });

				// pull layers
				_lids.forEach(function (l) {
					project.layers.pull(l)
				})
				
				// project.markModified('files');
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

	// reload layer meta
	reloadMeta : function (req, res) {

		var fileUuid = req.body.fileUuid;
		var layerUuid = req.body.layerUuid;

		// return on err
		if (!fileUuid || !layerUuid) return res.end(JSON.stringify({
			error : 'No layer specified.'
		}));

		// get meta
		api.layer.getMeta(fileUuid, function (err, meta) {

			// return on err
			if (err) return res.end(JSON.stringify({
				error : err
			}));

			// save meta to fil
			api.layer.setMeta(meta, layerUuid, function (err, result) {

				// return meta
				res.end(JSON.stringify({
					error : err,
					meta : meta
				}));
			});
		});
	},

	// get layer meta
	getMeta : function (fileUuid, callback) {

		File
		.findOne({uuid : fileUuid})
		.exec(function (err, file) {
			if (err) return callback(err);

			// only support for geojson now
			if (!file.data.geojson) return callback({error : 'No geojson found.'});

			// set path
			// var path = FILEFOLDER + fileUuid + '/' + file.data.geojson;
			var path = api.config.path.file + fileUuid + '/' + file.data.geojson;

			// var omnipath = METAPATH + uuid + '.meta.json';
			fs.readJson(path, function (err, metadata) { 			// expensive
				callback(err, metadata);
			});			
		});
	},

	// set layer meta
	setMeta : function (meta, layerUuid, callback) {

		Layer
		.findOne({uuid : layerUuid})
		.exec(function (err, layer) {
			layer.metadata = meta; 	// string?
			layer.save(function (err) {
				callback(err);
			});
		});
	},

	// get cartocss
	getCartoCSS : function (req, res) {
		var cartoId = req.body.cartoid;
		// var path = CARTOCSSFOLDER + cartoId + '.mss';
		var path = api.config.path.cartocss + cartoId + '.mss';
		fs.readFile(path, {encoding : 'utf8'}, function (err, data) {
			res.end(data);
		});
	},

	// set carto css
	setCartoCSS : function (req, res) {
		console.log('setCartoCSS');
		console.log('body: ', req.body);

		// get params
		var fileUuid 	= req.body.fileUuid;
		var css 	= req.body.css;
		var cartoid 	= req.body.cartoid;
		var layerUuid 	= req.body.layerUuid;

		// set path
		// var csspath = CARTOCSSFOLDER + cartoid + '.mss';
		var csspath = api.config.path.cartocss + cartoid + '.mss';

		var isOSM = (fileUuid == 'osm');

		// var host = isOSM ? VILEOSMHOST : VILEHOST;
		var host = isOSM ? api.config.vileosm.uri : api.config.vile.uri;


		console.log('setCartoCSS HOST: ', host);
		console.log('vars: ', layerUuid, fileUuid, cartoid, csspath, css);

		// save css to file by cartoId 
		fs.writeFile(csspath, css, {encoding : 'utf8'}, function (err) {
			console.log('err?', err);
		



			// send to tileserver storage
			request({
				method : 'POST',
				uri : host + 'import/cartocss',
				json : {
					css : css,
					cartoid : cartoid,
					osm : (fileUuid == 'osm')
				}
			}, 

			// callback
			function (err, response, body) {
				console.log('import carto response: err: ', err);
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
		        		console.log('save to layer: layerUuid, fileUuid', layerUuid, fileUuid);
					Layer
					.findOne({uuid : layerUuid})
					.exec(function (err, layer) {

						if (err) console.error(err);
						console.log('fingind?? ', err, layer);

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


	// createLegends : function (req, res) {

	// 	api.generateLegends(req, res, function (err, legends) {
	// 		// todo move res.end here
	// 	});

	// },


	// generateLegends : function (req, res, finalcallback) {

	// 	var fileUuid = req.body.fileUuid,
	// 	    cartoid = req.body.cartoid,
	// 	    layerUuid = req.body.layerUuid,
	// 	    ops = [];

	// 	// get layer features/values
	// 	ops.push(function (callback) {

	// 		api.layer._getLayerFeaturesValues(fileUuid, cartoid, function (err, result) {
	// 			if (err) console.error('_getLayerFeaturesValues err: ', err);
	// 			callback(err, result);
	// 		});
	// 	});


	// 	// for each rule found
	// 	ops.push(function (result, callback) {
	// 		var jah = result.rules;
	// 		var css = result.css;
	// 		var legends = [];

	// 		async.each(jah, function (rule, cb) {

	// 			var options = {
	// 				css : css,
	// 				key : rule.key,
	// 				value : rule.value,
	// 				id : 'legend-' + uuid.v4()
	// 			}

	// 			api._createStylesheet(options, function (err, result) {
	// 				if (err) console.log('create stylesheet err: ', err);

	// 				api._createLegend(result, function (err, path) {

	// 					if (err) {
	// 						console.log('catchin 33 err: ,', err);
	// 						return cb(err);
	// 					}

	// 					// base64 encode png
	// 					fs.readFile(path, function (err, data) {

	// 						var base = data.toString('base64');
	// 						var uri = util.format("data:%s;base64,%s", mime.lookup(path), base);

	// 						console.log('CREATED LEGENDS?!?!?');
	// 						console.log('base64: ', uri);

	// 						var leg = {
	// 							base64 	  : uri,
	// 							key 	  : options.key,
	// 							value 	  : options.value,
	// 							id 	  : options.id,
	// 							fileUuid  : fileUuid,
	// 							layerUuid : layerUuid,
	// 							cartoid   : cartoid,
	// 							on 	  : true
	// 						}

	// 						legends.push(leg);

	// 						cb(null);
	// 					});	
	// 				});

	// 			}, this);


	// 		}, function (err) {
	// 			callback(err, legends);
	// 		});
	// 	});



	// 	ops.push(function (legends, callback) {
	// 		res.end(JSON.stringify(legends));
	// 		callback();
	// 	});


	// 	async.waterfall(ops, function (err, legends) {
	// 		console.log('waterfall done');
	// 		console.log('err, legends', err, legends);
	// 		// console.log('err string: ', err.toString());

	// 		// catch err?
	// 		if (err) res.end(JSON.stringify({
	// 			err : err.toString()
	// 		}));
			
	// 	});


	// },



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
		// var toFile = LEGENDSPATH + 'template-' + lid + '.geojson'; 
		var toFile = api.config.path.legends + 'template-' + lid + '.geojson'; 
		fs.outputFile(toFile, JSON.stringify(geojson), function (err) {

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
			// var stylepath = LEGENDSPATH + 'stylesheet-' + lid + '.xml';
			var stylepath = api.config.path.legends + 'stylesheet-' + lid + '.xml';
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



	// _createLegend : function (options, callback) {

	// 	var mapnik = require('mapnik');
	// 	var fs = require('fs');


	// 	var stylepath = options.stylepath;
	// 	var lid = options.lid;

	// 	// register fonts and datasource plugins
	// 	mapnik.register_default_fonts();
	// 	mapnik.register_default_input_plugins();

	// 	var map = new mapnik.Map(100, 50);
	// 	// map.load('./test/stylesheet.xml', function(err,map) {

	// 	try {
	// 		map.load(stylepath, function(err, map) {
	// 			if (err) console.error('map.load err', err); // eg. if wrong path 


	// 			if (err) return callback(err);

	// 			map.zoomAll(); // todo: zoom?
	// 			var im = new mapnik.Image(100, 50);
	// 			map.render(im, function(err,im) {
	// 				// if (err) throw err;
	// 				if (err) console.log('map.render err', err);

	// 				im.encode('png', function(err, buffer) {
	// 					// if (err) throw err;
	// 					if (err) console.log('im.encode err: ', err);
	// 					// fs.writeFile('map.png',buffer, function(err) {
	// 					// var outpath = LEGENDSPATH + lid + '.png';
	// 					var outpath = api.config.path.legends + lid + '.png';
	// 					fs.writeFile(outpath, buffer, function(err) {
	// 						if (err) throw err;
	// 						console.log('saved map image to map.png');
							

	// 						callback(null, outpath);
	// 					});
	// 				});
	// 			});
	// 		});

	// 	} catch (e) { console.log('FIX ERR!!!');}


	// },





	// #########################################
	// ###  API: Get Layer Feature Values    ###
	// #########################################	
	// get features from geojson that are active in cartoid.mss (ie. only active/visible layers)
	_getLayerFeaturesValues : function (fileUuid, cartoid, callback) {

		if (fileUuid == 'osm') {
			api.layer._getLayerFeaturesValuesOSM(fileUuid, cartoid, callback);
		} else {
			api.layer._getLayerFeaturesValuesGeoJSON(fileUuid, cartoid, callback);
		}
	},

	_getLayerFeaturesValuesOSM : function (fileUuid, cartoid, callback) {

		console.log('_getLayerFeaturesValuesOSM');
		callback('debug');

	},

	_getLayerFeaturesValuesGeoJSON : function (fileUuid, cartoid, callback) {


		File
		.findOne({uuid : fileUuid})
		.exec(function (err, file) {
			console.log('err?', err);
			console.log('found file: ', file);

			// read geojson file
			// var path = FILEFOLDER + file.uuid + '/' + file.data.geojson;
			var path = api.config.path.file + file.uuid + '/' + file.data.geojson;
			fs.readJson(path, function (err, data) {
				if (err) console.log('err: : ', err);

				// read css from file
				// var cartopath = CARTOCSSFOLDER + cartoid + '.mss';
				var cartopath = api.config.path.cartocss + cartoid + '.mss';
				fs.readFile(cartopath, 'utf8', function (err, buffer) {
					if (err) console.error(err, cartopath);

					// css as string
					var css = buffer.toString();

					// get rules from carto (forked! see explain below...)
					var renderer = new carto.Renderer();
					var info = renderer.getRules(css);

					console.log('-====> info', info);

					var string = JSON.stringify(info);

					// add rules to jah
					var jah = [];
					var rules1 = info.rules;//[0].rules;

					rules1.forEach(function (rule1) {

						var rules2 = rule1.rules;


						if (!rules2) return;				// todo? forEach on rule1?
						rules2.forEach(function (rrules) {
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

					

					var result = {
						rules : jah,
						css : css
					}


					callback(null, result);

				});
			});
		});



	},

	// ================== DO NOT DELETE ===================================================================
	//
	// 	This is an added prototype fn to the node_module carto/lib/carto/renderer.js:12.
	//
	// 		-add it!  
	//
	// ======================================================================================================
	//
	// 	// systemapic hack
	// carto.Renderer.prototype.getRules = function render(data) {

	//     var env = _(this.env).defaults({
	//         benchmark: true,
	//         validation_data: false,
	//         effects: []
	//     });

	//     if (!carto.tree.Reference.setVersion(this.options.mapnik_version)) {
	//         throw new Error("Could not set mapnik version to " + this.options.mapnik_version);
	//     }
	//     var parser = (carto.Parser(env)).parse(data);
	//     return parser;
	// }
	// ======================================================================================================




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


	createModel : function (options, callback) {

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

	// save file to project (file, layer, project id's)
	addToProject : function (layer_id, projectUuid, callback) {
		Project
		.findOne({'uuid' : projectUuid })
		.exec(function (err, project) {
			project.layers.push(layer_id);			
			project.markModified('layers');
			project.save(function (err) {
				callback && callback(err);
			});
		});
	},


}

// systemapic hack
carto.Renderer.prototype.getRules = function render(data) {

    var env = _(this.env).defaults({
        benchmark: true,
        validation_data: false,
        effects: []
    });

    if (!carto.tree.Reference.setVersion(this.options.mapnik_version)) {
        throw new Error("Could not set mapnik version to " + this.options.mapnik_version);
    }
    var parser = (carto.Parser(env)).parse(data);
    return parser;
}

