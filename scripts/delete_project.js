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



var projectUuid = process.argv[2];

if (!projectUuid) {
	console.log('Usage: node delete_project.js projectUuid');
	return process.exit(0);
}


Project
.findOne({uuid : projectUuid})
.exec(function (err, project) {
	if (err || !project) {
		console.log("Seems project doesn't exist.");
		process.exit(0);
		return;
	}


	console.log('Project to delete:'.red, project.name);

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
		
		Project
		.findOne({uuid : projectUuid})
		.remove(function (err, project) {

			if (err || !project) {
				console.log('Something went wrong. Exiting.');
				process.exit(0);
				return;
			}

			var result = project.result;

			if (result.ok) {
				console.log('Deleted!');
			}

			process.exit(0);
		})
	});
	
});
