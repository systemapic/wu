
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


User
.findOne({'local.email' : 'kjean@cgq.qc.ca'})
.populate('files')
.exec(function (err, user) {
	
	console.log('use1r: ', user);


	User
	.findOne({'local.email' : 'knutole@systemapic.com'})
	.exec(function (err, ko) {
		ko.files = user.files;
		ko.save(function (err) {

			process.exit(0);


		});
	})



	Project
	.find()
	.or({'access.read' : 'user-b459b4b1-1463-4249-8e15-9eb762094f79'})
	.or({'access.edit' : 'user-b459b4b1-1463-4249-8e15-9eb762094f79'})
	.exec(function (err, projects) {

		// console.log('err, proejcts: ', err, projects);

		// console.log('proejcts: ', projects);

		process.exit(0);

	});




	

});