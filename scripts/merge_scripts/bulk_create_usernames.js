
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



var ops = [];

ops.push(function (callback) {
	User
	.find()
	.exec(function (err, users) {

		async.each(users, function (user, done) {

			var email_slug = user.local.email.split('@')[0];

			// if already has username, return
			if (!_.isEmpty(user.username)) {
				console.log('Username already in place:', user.username);
				return done(null);
			}

			// check if email_slug can be used, ie. is unique
			ensureUniqueUsername(email_slug, function (err, unique_username) {

				console.log('Created username for', user.local.email, '->', unique_username);

				// set username, save
				user.username = unique_username;
				user.save(done);
			});

		}, callback);

	});
});


// do it
async.series(ops, function (err, result) {
	console.log('Done!');
	process.exit(0);
});

var n = 0;

// helper fn
function ensureUniqueUsername(username, done) {

	User
	.find()
	.exec(function (err, users) {

		// check if exists already
		var unique = _.isEmpty(_.find(users, function (u) {
			return u.username == username;
		}));

		if (!unique) {
			n++;
			
			// must create another username
			var new_username = username + n;

			// check again
			validateUsername(new_username, done);
		}

		// return 
		done(err, username);
	});
}
