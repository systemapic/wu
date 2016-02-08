
// libs
var async 	 = require('async');
var colors 	 = require('colors');
var crypto       = require('crypto');
var uuid 	 = require('node-uuid');
var mongoose 	 = require('mongoose');
var _ 		 = require('lodash');
var fs 		 = require('fs');

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
var config  = require('../config/wu-config.js').serverConfig;

// connect to our database
mongoose.connect(config.mongo.url); 


Layer
.findOne({uuid : "layer-6ceab98c-ee81-4990-b87e-ee34a5c47b72"})
.exec(function (err, layer) {
	console.log('err', err);
	console.log(typeof layer);
	console.log(JSON.stringify(layer));
	process.exit(0);

});

