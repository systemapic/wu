
// libs
var async 	 = require('async');
var colors 	 = require('colors');
var crypto       = require('crypto');
var uuid 	 = require('node-uuid');
var mongoose 	 = require('mongoose');
var _ 		 = require('lodash');
var fs 		 = require('fs');
var Table	 = require('easy-table');

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
var config  = require('../../config/wu-config.js').serverConfig;

// connect to our database
mongoose.connect(config.mongo.url); 


Project
.find()
.exec(function (err, projects) {

	var t = new Table;

	// console.log(err, users)
	projects.forEach(function (p) {
		
		// columns
		t.cell('name', p.name);
		t.cell('uuid', p.uuid);
		t.cell('slug', p.slug);
		t.newRow();

	});

	t.sort('slug');
	console.log('\n');
	console.log(t.toString());
	process.exit(0);

});