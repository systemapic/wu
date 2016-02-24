
// libs
var async 	 = require('async');
var colors 	 = require('colors');
var crypto       = require('crypto');
var uuid 	 = require('node-uuid');
var mongoose 	 = require('mongoose');
var _ 		 = require('lodash');
var fs 		 = require('fs');
var prompt 	 = require('prompt');

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


prompt.get({
	properties : {
		confirm : {
			description : 'Are you sure you want to delete ALL - absolutely ALL - users? Write [yes] to go ahead and delete ALL users'.yellow
		}
	}
}, function (err, answer) {
	if (err || answer.confirm != 'yes') {
		console.log('\nAborting! No users deleted.'.red);
		return process.exit(0);
	}

	User
	.find()
	.remove(function (err, users) {
		console.log('removed users: ', err, users);
		process.exit(0);
	});
});