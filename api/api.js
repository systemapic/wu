// api.js

// api
var api = {};
api.version = '1.4.0';

// config
var config = require('../../config/wu-config.js');
api.config = config.serverConfig;
api.clientConfig = config.clientConfig;

// exports
module.exports 		= api;
module.exports.log 	= require('./api.log');
module.exports.redis 	= require('./api.redis');
module.exports.geo 	= require('./api.geo');
module.exports.file 	= require('./api.file');
module.exports.auth 	= require('./api.auth');
module.exports.user 	= require('./api.user');
module.exports.oauth2   = require('./api.oauth2');
module.exports.layer 	= require('./api.layer');
module.exports.email 	= require('./api.email');
module.exports.error 	= require('./api.error');
module.exports.slack 	= require('./api.slack');
module.exports.debug 	= require('./api.debug');
module.exports.utils 	= require('./api.utils');
module.exports.token 	= require('./api.token');
module.exports.upload 	= require('./api.upload');
module.exports.import 	= require('./api.import');
module.exports.legend 	= require('./api.legend');
module.exports.pixels 	= require('./api.pixels');
module.exports.portal 	= require('./api.portal');
module.exports.access 	= require('./api.access');
module.exports.socket 	= require('./api.socket');
module.exports.postgis  = require('./api.postgis');
module.exports.project 	= require('./api.project');
module.exports.provider = require('./api.provider');
module.exports.analytics = require('./api.analytics');

// print version
console.log('Systemapic API version is ', api.version);