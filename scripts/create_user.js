
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
var config  = require('../config/server-config.js').serverConfig;

// connect to our database
mongoose.connect(config.mongo.url); 

// args
var userEmail = process.argv[2];
var username = process.argv[3];
var userFirstname = process.argv[4];
var userLastname = process.argv[5];
var userUuid = 'user-' + uuid.v4();

if (!userEmail || !userFirstname || !userLastname || !username) {
	console.log('Usage: node create_betauser.js EMAIL USERNAME FIRST_NAME LAST_NAME'.yellow);
	process.exit(1);
}


var ops = [];

ops.push(function (callback) {
	ensureUniqueUsername(username, callback);
})

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
	user.username 		= username;

	user.save(callback);

	console.log('Log in with email '.yellow + user.local.email + ' and password: '.yellow + password);
});


async.series(ops, function (err, result) {
	if (err) console.log('ERROR:', err);
	process.exit(0);
});


var n = 0;
// helper fn
function ensureUniqueUsername(username, done) {

	User
	.find()
	.exec(function (err, users) {

		// check if exists already
		var unique = _.isEmpty(_.find(users, function (u) {
			return u.username == username;
		}));

		if (!unique) {
			n++;
			
			// must create another username
			var new_username = username + n;

			// check again
			ensureUniqueUsername(new_username, done);

			return;
		}

		// return 
		done(err, username);
	});
}
