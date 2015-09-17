// dependencies
var _ = require('lodash');
var fs = require('fs-extra');
var kue = require('kue');
var path = require('path');
var zlib = require('zlib');
var uuid = require('uuid');
var async = require('async');
var redis = require('redis');
var carto = require('carto');
var mapnik = require('mapnik');
var colors = require('colors');
var cluster = require('cluster');
var numCPUs = require('os').cpus().length;
var mongoose = require('mongoose');
var request = require('request');
var inquirer = require("inquirer");

// config
var config = require('../config/server-config');

// redis store for temp tokens and upload increments
var redisLayers = require('redis').createClient(config.serverConfig.redis.layers.port, config.serverConfig.redis.layers.host);
redisLayers.on('error', function (err) {console.log('Redis error: ', err);});
redisLayers.auth(config.serverConfig.redis.layers.auth);

// redis store for temp tokens and upload increments
var redisStats = require('redis').createClient(config.serverConfig.redis.stats.port, config.serverConfig.redis.stats.host);
redisStats.on('error', function (err) {console.log('Redis error: ', err);});
redisStats.auth(config.serverConfig.redis.stats.auth);
// redis store for temp tokens and upload increments
var redisTemp = require('redis').createClient(config.serverConfig.redis.temp.port, config.serverConfig.redis.temp.host);
redisTemp.on('error', function (err) {console.log('Redis error: ', err);});
redisTemp.auth(config.serverConfig.redis.temp.auth);


var whichRedis = process.argv[2];
var searchKeys = process.argv[3];

if (!whichRedis) {
	console.log('Please provide args: node delete_redis_keys.js [layers|stats|temp] [searchKeys]')
	process.exit(1);
}

var r;

if (whichRedis == 'layers') {
	r = redisLayers;
}
if (whichRedis == 'stats') {
	r = redisStats;
}
if (whichRedis == 'temp') {
	r = redisTemp;
}

// find keys
r.keys(searchKeys + '*', function (err, keys) {
	console.log('found keys: ', keys);

	// confirm delete
	inquirer.prompt({
		type : 'confirm',
		name : 'delete_confirm',
		message : 'Are you sure you want to delete ALL these keys?',
		choices : ['yes', 'no'],

	}, function( answers ) {

		// not confirmed
		if (!answers.delete_confirm) {
			console.log('Aborted!');
			process.exit(0);
			return;
		}

		// delete keys
		async.each(keys, function (k, callback) {
			r.del(k, function (err) {
				console.log('deleted', k);
				callback(err);
			});
		}, function (err) {
			console.log('deleted all');
			process.exit(0);
		});
	});	
});



