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
		console.log('api.legend.create'.yellow);

		var options = {
			fileUuid : req.body.fileUuid,
		    	cartoid : req.body.cartoid,
		    	layerUuid : req.body.layerUuid
		}

		api.legend.generate(options, function (err, legends) {
			if (err) console.log('api.legend.generate err'.red, err);

			if (err) return api.error.general(req, res, err);

			// return legends
			res.end(JSON.stringify(legends));
		});

	},


	generate : function (options, done) {
		var fileUuid = options.fileUuid,
		    cartoid = options.cartoid,
		    layerUuid = options.layerUuid,
		    ops = [];

		// if (!fileUuid || !cartoid || !layerUuid) return done('Missing information.4');
		if (!fileUuid || !cartoid) return done('Missing information.4');

		console.log('ap.legend.generate'.cyan);
		console.log('fiuleUuid: ', fileUuid);
		console.log('cartoid: ', cartoid);
		// console.log('layerUuid:', layerUuid);

		// get layer features/values
		ops.push(function (callback) {
			api.layer._getLayerFeaturesValues(fileUuid, cartoid, function (err, result) {
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
				}

				api.layer._createStylesheet(options, function (err, result) {
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


		async.waterfall(ops, function (err, legends) {
			if (err) console.log('legend.generate err: '.red, err);

			if (err) return done(err);

			done(null, legends);
		});

	},


	_create : function (options, callback) {

		var stylepath = options.stylepath;
		var lid = options.lid;

		// register fonts and datasource plugins
		mapnik.register_default_fonts();
		mapnik.register_default_input_plugins();

		var map = new mapnik.Map(20, 20);

		try {
			map.load(stylepath, function (err, map) {
				if (err) return callback(err);

				map.zoomAll(); // todo: zoom?
				var im = new mapnik.Image(20, 20);

				map.render(im, function (err, im) {
					if (err) {
						console.log('map.render err'.red, err);
						return callback(err);
					}

					im.encode('png', function(err, buffer) {
						if (err) {
							console.log('im.encode err'.red, err);
							return callback(err);
						}

						var outpath = api.config.path.legends + lid + '.png';
						console.log('output: '.yellow, outpath);
						
						fs.writeFile(outpath, buffer, function (err) {
							if (err) console.log('legend._create writefile err:'.red, err);

							if (err) return callback(err);
							
							callback(null, outpath);
						});
					});
				});
			});

		} catch (e) { 
			console.log('legend._create try catch'.red, e);
			callback(e);
		}
	},

}