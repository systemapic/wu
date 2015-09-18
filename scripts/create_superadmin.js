
// libs
var async 	 = require('async');
var colors 	 = require('colors');
var crypto       = require('crypto');
var uuid 	 = require('node-uuid');
var mongoose 	 = require('mongoose');
var _ 		 = require('lodash-node');
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
var config  = require('../config/server-config.js').serverConfig;

// connect to our database
mongoose.connect(config.mongo.url); 

// args
var userEmail = process.argv[2];
var userFirstname = process.argv[3];
var userLastname = process.argv[4];
var userUuid = 'user-' + uuid.v4();

if (!userEmail || !userFirstname || !userLastname) {
	console.log('Usage: node create_superadmin.js EMAIL FIRST_NAME LAST_NAME'.yellow);
	process.exit(1);
}


var ops = [];

ops.push(function (callback) {

	// create user
	var password 		= crypto.randomBytes(16).toString('hex');
	var user            	= new User();
	user.uuid 		= userUuid;
	user.local.email    	= userEmail;	
	user.local.password 	= user.generateHash(password);
	user.firstName 		= userFirstname;
	user.lastName 		= userLastname;
	user.createdBy		= userUuid;
	user.save(callback);

	console.log('Log in with email '.yellow + user.local.email + ' and password: '.yellow + password);

});

ops.push(function (callback) {
	// find superadmin role
	var superadminRole = config.portal.roles.superAdmin;
	Role
	.findOne({uuid : superadminRole})
	.exec(function (err, role) {
		role.members.push(userUuid);
		role.save(callback);
	});
});

async.series(ops, function (err, result) {
	// console.log('all done, ', err, result);
	process.exit(0);
});












