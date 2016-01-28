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


var usernameA = process.argv[2];
var usernameB = process.argv[3];

if (!usernameA || !usernameB) {
	console.log('Usage: node add_contact.js usernameA usernameB');
	console.log('Note: Users will be added to each other\'s contact list.')
	return process.exit(0);
}

// return;
var users = {};
var ops = [];

ops.push(function (callback) {
	User
	.findOne({username : usernameA})
	.exec(function (err, user_a) {
		users.a = user_a;
		callback(err);
	});
});

ops.push(function (callback) {
	User
	.findOne({username : usernameB})
	.exec(function (err, user_b) {
		users.b = user_b;
		callback(err);
	});
});

ops.push(function (callback) {
	
	users.a.contact_list.addToSet(users.b._id);
	users.b.contact_list.addToSet(users.a._id);

	users.a.save(function (err) {
		if (err) return callback(err);

		users.b.save(function (err) {
			if (err) return callback(err);
			callback(null);
		})
	});
});


async.series(ops, function (err, results) {
	if (err) {
		console.log('Something went wrong!');
		process.exit(0);
		return;
	}

	// done
	console.log('Contacts added! ' + users.a.username + ' and ' + users.b.username + ' are now contacts!');
	process.exit(0);
});
