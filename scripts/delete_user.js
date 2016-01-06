
// libs
var async 	 = require('async');
var colors 	 = require('colors');
var crypto       = require('crypto');
var uuid 	 = require('node-uuid');
var mongoose 	 = require('mongoose');
var _ 		 = require('lodash-node');
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
var config  = require('../config/server-config.js').serverConfig;

// connect to our database
mongoose.connect(config.mongo.url); 


var deleteUser = process.argv[2];

if (!deleteUser) {
	console.log('Usage: node delete_user.js email@domain.com');
	return process.exit(0);
}

User
.findOne({'local.email' : deleteUser})
.exec(function (err, u) {

	if (err) {
		console.log('error retreiving user');
		return process.exit(0);
	}

	if (!u) {
		console.log('No such user exists!');
		return process.exit(0);
	}


	console.log('User to delete:'.red, u.getName());

	prompt.get({
		properties : {
			confirm : {
				description : 'Does this look right? Write [yes] to go ahead and delete user'.yellow
			}
		}
	}, function (err, answer) {
		if (err || answer.confirm != 'yes') {
			console.log('Aborting!'.red);
			return process.exit(0);
		}

		User
		.remove({'local.email' : deleteUser})
		.exec(function (err, user) {
			console.log('User [' + deleteUser + '] deleted!'.red);
			process.exit(0);
		});

	});

})

