
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


var cloneUser = process.argv[2];

if (!cloneUser) {
	console.log('Usage: node add_all_contacts.js to_this_user@email.com');
	return process.exit(0);
}

// return;
User
.find()
.exec(function (err, users) {
	
	User
	.findOne({'local.email' : cloneUser})
	.exec(function (err, user) {

		async.each(users, function (u, callback) {
			user.contact_list.addToSet(u._id);
			user.save(function (err) {
				u.contact_list.addToSet(user._id);
				u.save(callback);
			});

		}, function (err) {
			console.log('added contacts!');
			process.exit(0);
		});

	});

});