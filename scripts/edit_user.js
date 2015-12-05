
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


User
// .find()
// .findOne({'local.email' : 'frano@globesar.com'})
.findOne({'local.email' : 'knutole@systemapic.com'})
.exec(function (err, user) {
	console.log(err, user);

	user.access.account_type = 'super';
	user.markModified('access');

	user.save(function () {
		
	})

	// users.forEach(function (u) {
		// console.log(u.local.email);

		// if (u.local.email == 'oyvind.lier@sweco,no') {
		// 	console.log('SWECO!', u);
		// 	// u.local.email = 'oyvind.lier@sweco.no';
		// 	// u.save(function (err) {
		// 	// 	console.log('saved!');
		// 	// 	process.exit(0);
		// 	// })
		// }


	// });
	

});