// api
var api = module.parent.exports;

// config
var config = require(
  process.env.WU_CONFIG_PATH ||
  '../../config/wu-config.js'
).serverConfig;
// todo: config must be defined like this, because of redis is used in test/helpers.js
// this is kinda fubar. fix!

// redis store for layers
var redisLayers = require('redis').createClient(config.redis.layers.port, config.redis.layers.host);
redisLayers.on('error', function (err) {console.log('Redis error: ', err);});
redisLayers.auth(config.redis.layers.auth);

// redis store for stats
var redisStats = require('redis').createClient(config.redis.stats.port, config.redis.stats.host);
redisStats.on('error', function (err) {console.log('Redis error: ', err);});
redisStats.auth(config.redis.stats.auth);

// redis store for temp tokens and upload increments
var redisTemp = require('redis').createClient(config.redis.temp.port, config.redis.temp.host);
redisTemp.on('error', function (err) {console.log('Redis error: ', err);});
redisTemp.auth(config.redis.temp.auth);

// exports
module.exports = api.redis = { 
	layers : redisLayers,
	tokens : redisLayers, // todo: create own instance for this?
	stats : redisStats,
	temp : redisTemp
};
