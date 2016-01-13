
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

// args
var userEmail = process.argv[2];
var userFirstname = process.argv[3];
var userLastname = process.argv[4];
var userUuid = 'user-' + uuid.v4();

console.log('userUuid', userUuid);

if (!userEmail || !userFirstname || !userLastname) {
	console.log('Usage: node create_betauser.js EMAIL FIRST_NAME LAST_NAME'.yellow);
	process.exit(1);
}


var ops = [];


ops.push(function (callback) {

	// create role

	var options = {
		permissions : [
			'create_project',
			'upload_file',
			'invite_user', 	// new
			'share_project',
		],
		members : [userUuid]
	}

	console.log('options: ', options);

	createRole(options, callback)



});

ops.push(function (role, callback) {

	console.log('role: ', role);

	// create user
	var password 		= crypto.randomBytes(16).toString('hex');
	var user            	= new User();
	user.uuid 		= userUuid;
	user.local.email    	= userEmail;	
	user.local.password 	= user.generateHash(password);
	user.firstName 		= userFirstname;
	user.lastName 		= userLastname;
	user.createdBy		= userUuid;
	
	// // add role
	// user.roles.push(role._id);
	// user.markModified('roles');

	user.save(function (err, doc) {
		console.log('saved user: ', err, doc);
		callback(err, doc);
	});

	console.log('Log in with email '.yellow + user.local.email + ' and password: '.yellow + password);

});




async.waterfall(ops, function (err, result) {
	// console.log('all done, ', err, result);
	process.exit(0);
});





function createRole (options, done) {
	var permissions = options.permissions,
	    members = options.members,
	    project_id = options.project_id,
	    ops = [];


	console.log('CREATEOLR: ', members);

	ops.push(function (callback) {
		// create the user
		var role = new Role();
		role.uuid = 'role-' + uuid.v4();

		permissions.forEach(function (p) {
			console.log('p: ', p);
			role.capabilities[p] = true;
		})

		// members
		members.forEach(function (m) {
			console.log('m: ', m);
			role.members.push(m);
		});

		role.markModified('members');

		// save the role
		role.save(function(err, doc) {

			console.log('saved role: ', err, doc);

			callback(err, doc);
		});

	});

	async.waterfall(ops, done);

};






