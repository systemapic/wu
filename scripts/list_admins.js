
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



function listRole (options, done) {
	var roleUuid = options.roleUuid,
	    prettyRole = options.pretty;


	// get portal role
	Role
	.findOne({uuid : roleUuid})
	.exec(function (err, portalRole) {

		var members = portalRole.members;
		var ops = [];

		members.forEach(function (userUuid) {
			ops.push(function (callback) {
				User
				.findOne({uuid : userUuid})
				.exec(function (err, user) {
					if (err || !user) return callback(null);
					callback(err, user.local.email);
				});
			});
		});


		async.parallel(ops, function (err, result) {
			console.log('');
			console.log(prettyRole.yellow + 'Admins'.yellow);
			console.log('-------------'.yellow);
			result.forEach(function (r) {
				console.log(r);
			});

			console.log('');
			done();
		});

	});

}

var ops = [];

ops.push(function (callback) {
	listRole({
		roleUuid : config.portal.roles.superAdmin,
		pretty : 'Super'
	}, callback)
});

ops.push(function (callback) {

	listRole({
		roleUuid : config.portal.roles.portalAdmin,
		pretty : 'Portal'
	}, callback)
});

async.series(ops, function (err, results) {
	process.exit(0);
})
















