// API: api.legend.js

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
var crypto      = require('crypto');
var fspath 	= require('path');
var request 	= require('request');
var nodepath    = require('path');
var formidable  = require('formidable');
var nodemailer  = require('nodemailer');
var uploadProgress = require('node-upload-progress');
var mapnikOmnivore = require('mapnik-omnivore');


// api
var api = module.parent.exports;

// exports
module.exports = api.legend = { 


	create : function (req, res) {
		console.log('api.legend.create'.yellow);

		var options = {
			fileUuid : req.body.fileUuid,
	    	cartoid : req.body.cartoid
		};

		api.legend.generate(options, function (err, legends) {
			if (err) console.log('api.legend.generate err'.red, err);

			if (err) return api.error.general(req, res, err);

			// return legends
			res.send(legends);
		});

	},


	generate : function (options, done) {
		var fileUuid = options.fileUuid;
		var cartoid = options.cartoid;
		var ops = [];

		if (!fileUuid || !cartoid) return done('Missing information.4');

		// get layer features/values
		ops.push(function (callback) {
			api.legend._getLayerFeaturesValues(fileUuid, cartoid, function (err, result) {
				if (err) console.log('_getLayerFeaturesValues err'.red, err);
				if (err) return callback(err);

				callback(null, result);
			});
		});

		// for each rule found
		ops.push(function (result, callback) {
			var jah = result.rules;
			var css = result.css;
			var legends = [];

			async.each(jah, function (rule, cb) {
				if (!rule) console.log('no role'.red);
				if (!rule) return cb('No rule.');

				var options = {
					css : css,
					key : rule.key,
					value : rule.value,
					id : 'legend-' + uuid.v4()
				};

				
				api.legend._createStylesheet(options, function (err, result) {
					if (err || !result) console.log('_createStylesheet err'.red, err, result);
					if (err || !result) return cb(err || 'No stylesheet.');


					api.legend._create(result, function (err, path) {
						if (err || !path) console.log('api.legend._create err'.red, err, path);
						
						if (err || !path) return cb(err || 'No path.');


						// base64 encode png
						fs.readFile(path, function (err, data) {
							if (err || !data) console.log('legend readFile err'.red, err, data);

							if (err || !data) return cb(err || 'No data.');

							var base = data.toString('base64');
							var uri = util.format("data:%s;base64,%s", mime.lookup(path), base);

							var leg = {
								base64 	  : uri,
								key 	  : options.key,
								value 	  : options.value,
								id 	  : options.id,
								fileUuid  : fileUuid,
								cartoid   : cartoid,
								on 	  : true
							};

							legends.push(leg);

							cb(null);
						});	
					});

				}, this);

			}, function (err) {
				callback(err, legends);
			});
		});


		async.waterfall(ops, function (err, legends) {
			if (err) console.log('legend.generate err: '.red, err);

			if (err) return done(err);

			done(null, legends);
		});

	},

	
	_createStylesheet : function (options, callback) {
		var featureKey = options.key;
		var featureValue = options.value;
		var css = options.css;
		var lid = options.id;
		var properties = {};

		// set key/value
		properties[featureKey] = featureValue;

		var geojson = {
			"type" : "FeatureCollection",
			"features" : [
				{
				"type" : "Feature",
         			 "properties" : properties,
         			// "properties" : {"layer" : "layer"},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
						[
					              -45,
					              0
					            ],
					            [
					              -45,
					              45
					            ],
					            [
					              0,
					              45
					            ],
					            [
					              0,
					              0
					             
					            ],
					            [
					              -45,
					              0
					            ]
						]
						]
					}
				}
			]
		};


		// write geojson template to disk
		var toFile = api.config.path.legends + 'template-' + lid + '.geojson'; 

		fs.outputFile(toFile, JSON.stringify(geojson), function (err) {
			if (err) return callback(err);

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
			};

			try {
				var cr = new carto.Renderer({});
				var xml = cr.render(options);
				var stylepath = api.config.path.legends + 'stylesheet-' + lid + '.xml';

				fs.outputFile(stylepath, xml, function (err) {
					if (err) return callback(err);

					var result = {
						stylepath : stylepath,
						lid : lid
					};

					callback(null, result);
				});

			} catch (e) { callback(e); }

		});

	},



	_create : function (options, callback) {

		var stylepath = options.stylepath;
		var lid = options.lid;
		var outpath = api.config.path.legends + lid + '.png';

		var inxml = stylepath;
		var outpng = outpath;

		// ridicilous hack
		var exec = require('child_process').exec;
		var cmd = 'node ../tools/create_png.js ' + inxml + ' ' + outpng;
		exec(cmd, function (err, stdin, stdout) {
			callback(null, outpng);
		});


	},


	// #########################################
	// ###  API: Get Layer Feature Values    ###
	// #########################################	
	// get features from geojson that are active in cartoid.mss (ie. only active/visible layers)
	_getLayerFeaturesValues : function (fileUuid, cartoid, callback) {
		if (!fileUuid || !cartoid) return callback('Missing information.1');

		api.legend._getLayerFeaturesValuesGeoJSON(fileUuid, cartoid, callback);

	
	},

	_getLayerFeaturesValuesOSM : function (fileUuid, cartoid, callback) {
		callback('debug');
	},

	_getLayerFeaturesValuesGeoJSON : function (fileUuid, cartoid, callback) {       // todo: optimize!
		if (!fileUuid || !cartoid) return callback('Missing information.2');


		File
		.findOne({uuid : fileUuid})
		.exec(function (err, file) {


			if (err || !file) return callback(err || 'No file.');

			// read css from file
			var cartopath = api.config.path.cartocss + cartoid + '.mss';
			

			fs.readFile(cartopath, 'utf8', function (err, buffer) {
				if (err || !buffer) return callback(err || 'No data.');




				try {
					var output = new carto.Renderer({
						filename: cartopath,
						local_data_dir: fspath.dirname(cartopath)
					}).renderMSS(buffer);
				} catch(err) {
					console.log('err11'.red, err);
					if (Array.isArray(err)) {
						err.forEach(function(e) {
							carto.writeError(e, options);
						});
					} else { console.error('err22'.red, err); }
				}
				console.log('op: ', output);

				// fs.writeFileSync('/home/cartocss.output', output);


				try {

					// get rules from carto (forked! see explain below...)
					var css = buffer.toString();
					var renderer = new carto.Renderer();
					var info = renderer.getRules(css);
					var string = JSON.stringify(info);
					var jah = [];
					var rules1 = info.rules;//[0].rules;

					// console.log('## css:'.green, css);
					// console.log('## info:'.green, info);
					// console.log('## rules1:'.green, rules1);

					// iterate
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
					});

					// add #layer
					jah.push({
						key : 'layer',
						value : file.name
					});

					var result = {
						rules : jah,
						css : css
					};

					return callback(null, result);

				// catch errros
				} catch (e) { callback(e); }
			});
		});
	}


};