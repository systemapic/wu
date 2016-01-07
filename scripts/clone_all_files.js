
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


var cloneUser = process.argv[2];

if (!cloneUser) {
	console.log('Usage: node clone_all_files.js to_this_user@email.com');
	return process.exit(0);
}


// File
// .findOne({_id : '560e7e3403597fad36263382'})
// .exec(function (err, file) {
// 	console.log('err,f ile', err, file);
// });


// return;
User
.find()
.exec(function (err, users) {
	
	console.log('found users?', err, users.length);

	User
	.findOne({'local.email' : cloneUser})
	.exec(function (err, user) {

		console.log('user.files 1: ', user.files);

		users.forEach(function (u) {


			u.files.forEach(function (f) {
				user.files.addToSet(f);
			});

		});


		user.save(function (err) {
			console.log('all saved!');

			console.log('user.files 2: ', user.files.length);


			// process.exit(0);

			User
			.findOne({'local.email' : cloneUser})
			.populate('files')
			.exec(function (err, us) {
				console.log('got this many populated files: ', us.files.length);
			})


		})


	})

	

});