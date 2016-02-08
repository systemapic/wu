// dependencies
var _ = require('lodash');
var fs = require('fs-extra');
var kue = require('kue');
var path = require('path');
var zlib = require('zlib');
var async = require('async');
var redis = require('redis');
var carto = require('carto');
var mapnik = require('mapnik');
var colors = require('colors');
var cluster = require('cluster');
var numCPUs = require('os').cpus().length;
var mongoose = require('mongoose');
var request = require('request');

// global paths
var VECTORPATH   = '/data/vector_tiles/';
var RASTERPATH   = '/data/raster_tiles/';
var GRIDPATH     = '/data/grid_tiles/';

// config
var config = require('/systemapic/config/wu-config').serverConfig;

console.log('cinfig', config);

var redis = require('redis');
var redisStore = redis.createClient(6379, 'redis', {detect_buffers : true});
redisStore.auth(config.redis.layers.auth);
redisStore.on('error', function (err) { console.error('redisStore err: ', err); });


redisStore.keys('layer-*', function (err, layers) {
	console.log('err, layer', err, layers);


	layers.reverse();
	
	var n = 0;

	layers.forEach(function (layer_key) {


		redisStore.get(layer_key, function (err, layerJSON) {

			var layer = JSON.parse(layerJSON);

			var cartocss = layer.options.cartocss;

			// find snowcaps

			if (cartocss.indexOf('snow') > 0) {
				console.log('found 1', n);
				n += 1;

				

				if (n == 4) {
					console.log('cartocss: ', cartocss);
					process.exit(0);
				}
			}

		});

	})


})
