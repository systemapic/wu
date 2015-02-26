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
module.exports = api.legend = { 


	create : function (req, res) {

		api.legend.generate(req, res, function (err, legends) {
			// todo move res.end here
		});

	},


	generate : function (req, res, finalcallback) {

		var fileUuid = req.body.fileUuid,
		    cartoid = req.body.cartoid,
		    layerUuid = req.body.layerUuid,
		    ops = [];

		// get layer features/values
		ops.push(function (callback) {

			api.layer._getLayerFeaturesValues(fileUuid, cartoid, function (err, result) {
				if (err) console.error('_getLayerFeaturesValues err: ', err);
				callback(err, result);
			});
		});


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

				api.layer._createStylesheet(options, function (err, result) {
					if (err) console.log('create stylesheet err: ', err);

					api.legend._create(result, function (err, path) {

						if (err) {
							console.log('catchin 33 err: ,', err);
							return cb(err);
						}

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
				callback(err, legends);
			});
		});



		ops.push(function (legends, callback) {
			res.end(JSON.stringify(legends));
			callback();
		});


		async.waterfall(ops, function (err, legends) {
			console.log('waterfall done');
			console.log('err, legends', err, legends);

			// catch err?
			if (err) res.end(JSON.stringify({
				err : err.toString()
			}));
			
		});


	},

	_create : function (options, callback) {

		var mapnik = require('mapnik');
		var fs = require('fs');


		var stylepath = options.stylepath;
		var lid = options.lid;

		// register fonts and datasource plugins
		mapnik.register_default_fonts();
		mapnik.register_default_input_plugins();

		var map = new mapnik.Map(100, 50);

		try {
			map.load(stylepath, function(err, map) {
				if (err) console.error('map.load err', err); // eg. if wrong path 

				if (err) return callback(err);

				map.zoomAll(); // todo: zoom?
				var im = new mapnik.Image(100, 50);
				map.render(im, function(err,im) {
					if (err) console.log('map.render err', err);

					im.encode('png', function(err, buffer) {
						if (err) console.log('im.encode err: ', err);
						var outpath = api.config.path.legends + lid + '.png';
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



}