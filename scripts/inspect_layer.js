
// libs
var async 	 = require('async');
var colors 	 = require('colors');
var crypto       = require('crypto');
var uuid 	 = require('node-uuid');
var mongoose 	 = require('mongoose');
var _ 		 = require('lodash');
var fs 		 = require('fs');
var Table 	 = require('easy-table');
var redis 	 = require('redis');

// database schemas
var Project 	 = require('../models/project');
var Clientel 	 = require('../models/client');	// weird name cause 'Client' is restricted name
var User  	 = require('../models/user');
var File 	 = require('../models/file');
var Layer 	 = require('../models/layer');
var Hash 	 = require('../models/hash');
var Role 	 = require('../models/role');
var Group 	 = require('../models/group');

// config
var config  = require('../../config/wu-config.js').serverConfig;

// global paths
var VECTORPATH   = '/data/vector_tiles/';
var RASTERPATH   = '/data/raster_tiles/';
var GRIDPATH     = '/data/grid_tiles/';

// redis
// redis store for layers
var redisLayers = require('redis').createClient(config.redis.layers.port, config.redis.layers.host);
redisLayers.on('error', function (err) {console.log('Redis error: ', err);});
redisLayers.auth(config.redis.layers.auth);

// connect to mongodb
mongoose.connect(config.mongo.url); 

console.log(process.argv);

// node inspect_layer.js lauer-adsds.sd.

var layer_id = process.argv[2];

// try to find redis layer

var ops = {};

ops.pileLayer = function (callback) {

	redisLayers.get(layer_id, function (err, layer) {
		console.log(err, layer);
		callback(null, layer);
	});

} 


ops.wuLayer = function (callback) {
	Layer
	.findOne({uuid : layer_id})
	.exec(function (err, layer) {
		console.log(err, layer);
		callback(null, layer);
	})
} 


async.parallel(ops, function (err, layers) {

	if (layers.pileLayer) {

		console.log('================');
		console.log('   PILE LAYER    ')
		console.log('================');
		console.log(layer.pileLayer);
	}

	if (layers.pileLayer) {

		console.log('================');
		console.log('   WU LAYER    ')
		console.log('================');
		console.log(layer.wuLayer);
	}

	process.exit(0);
});



























