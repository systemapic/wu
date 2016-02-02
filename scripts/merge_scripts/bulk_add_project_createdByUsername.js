
// libs
var async 	 = require('async');
var colors 	 = require('colors');
var crypto       = require('crypto');
var uuid 	 = require('node-uuid');
var mongoose 	 = require('mongoose');
var _ 		 = require('lodash');
var fs 		 = require('fs');

// database schemas
var Project 	 = require('../../models/project');
var Clientel 	 = require('../../models/client');	// weird name cause 'Client' is restricted name
var User  	 = require('../../models/user');
var File 	 = require('../../models/file');
var Layer 	 = require('../../models/layer');
var Hash 	 = require('../../models/hash');
var Role 	 = require('../../models/role');
var Group 	 = require('../../models/group');

// config
var config  = require('../../config/wu-config.js').serverConfig;

// connect to our database
mongoose.connect(config.mongo.url); 



var ops = [];

ops.push(function (callback) {

	Project
	.find()
	.exec(function (err, projects) {

		async.each(projects, function (project, done) {
			User
			.findOne({uuid : project.createdBy})
			.exec(function (err, user) {
				if (err || !user) return done();
				var username = user.username;
				console.log('username:', username);
				project.createdByUsername = username;
				project.save(done);
			});

		}, callback);
	});

});


// do it
async.series(ops, function (err, result) {
	console.log('Done!');
	process.exit(0);
});
