
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


Project
.find()
.populate('roles')
.exec(function (err, projects) {

	projects.forEach(function (project) {

		console.log('project: ', project);


		var roles = project.roles;

		// console.log('project with roles:', roles);


		roles.forEach(function (role) {

			console.log('role ', role);

			console.log('role.slug', role.slug);
		});

			process.exit(0);

	});



})