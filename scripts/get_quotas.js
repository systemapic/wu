
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



User
.find()
.populate('files')
.populate('contact_list')
.exec(function (err, users) {

	

	console.log('Storage quotas per user:');

	users.forEach(function (user) {

		var storage = 0;

		user.files.forEach(function (f) {

			// console.log('f: ',f);
			storage += parseFloat(f.dataSize);
		});

		console.log('User: ', user.getName());
		console.log('Storage: ', parseInt(storage/1000000) + 'MB');
		console.log('')

	})

	
	process.exit(0);

});