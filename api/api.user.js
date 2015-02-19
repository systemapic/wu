// API: api.user.js

// database schemas
var Project 	= require('../models/project');
var Clientel 	= require('../models/client');	// weird name cause 'Client' is restricted name
var User  	= require('../models/user');
var File 	= require('../models/file');
var Layer 	= require('../models/layer');
var Hash 	= require('../models/hash');
var Role 	= require('../models/role');
var Group 	= require('../models/group');

// utils
var _ 		= require('lodash-node');
var fs 		= require('fs-extra');
var gm 		= require('gm');
var kue 	= require('kue');
var fss 	= require("q-io/fs");
var zlib 	= require('zlib');
var uuid 	= require('node-uuid');
var util 	= require('util');
var utf8 	= require("utf8");
var mime 	= require("mime");
var exec 	= require('child_process').exec;
var dive 	= require('dive');
var async 	= require('async');
var carto 	= require('carto');
var crypto      = require('crypto');
var fspath 	= require('path');
var mapnik 	= require('mapnik');
var request 	= require('request');
var nodepath    = require('path');
var formidable  = require('formidable');
var nodemailer  = require('nodemailer');
var uploadProgress = require('node-upload-progress');
var mapnikOmnivore = require('mapnik-omnivore');


// api
var api = module.parent.exports;
console.log('api.legend === api=>', api);

// exports
module.exports = api.user = { 


	// create user
	create : function (req, res) {

		var user      = req.user,
		    email     = req.body.email,
		    lastName  = req.body.lastName,
		    firstName = req.body.firstName,
		    company   = req.body.company,
		    position  = req.body.position,
		    phone     = req.body.phone;

		// return if not authorized
		if (!api.permission.to.create.user(user)) {
			var message = 'Unauthorized access attempt. Your IP ' + req._remoteAddress + ' has been logged.';
			return res.end(JSON.stringify({ 
				error : message 
			}));
		};

		// return if no email, or if email already in use
		if (!email) {
			var message = 'Unauthorized access attempt. Your IP ' + req._remoteAddress + ' has been logged.';
			return res.end(JSON.stringify({ 
				error : message 
			}));
		};

		// create the user
		var newUser            	= new User();
		var password 		= crypto.randomBytes(16).toString('hex');
		newUser.uuid 		= 'user-' + uuid.v4();
		newUser.local.email    	= email;	
		newUser.local.password 	= newUser.generateHash(password);
		newUser.firstName 	= firstName;
		newUser.lastName 	= lastName;
		newUser.company 	= company;
		newUser.position 	= position;
		newUser.phone 		= phone;
		newUser.createdBy	= user.uuid;
		
		// save the user
		newUser.save(function(err, doc) { 
			
			if (err) return res.end(JSON.stringify({
				error : 'Error creating user.'
			}));

			// send email with login details to user
			api.email.sendNewUserEmail(newUser, password);
			
			// return success
			res.end(JSON.stringify(doc));
		});

	},


	// update user 	// todo: send email notifications on changes?
	update : function (req, res) {

		var userUuid 	= req.body.uuid;
		var authUser 	= req.user.uuid;
		var user        = req.user;

		// find user
		var model = User.findOne({ uuid : userUuid });
		model.exec(function (err, subject) {
			
			// return error
			if (err) return res.end(JSON.stringify({ error : 'Error retrieving client.' }));
			
			// return if not authorized
			if (!api.permission.to.update.user(user, subject)) {
				var message = 'Unauthorized access attempt. Your IP ' + req._remoteAddress + ' has been logged.';
				return res.end(JSON.stringify({ error : message }));
			};


			// create async queue
			var queries = {};

			// save company
			if (req.body.company) {
				queries.company = function(callback) {
					return User.findOne({ uuid : userUuid }, function (err, user) {
						// set and save
						user.company = req.body.company;
						user.save(function(err) {
							if (err) console.error(err); // log error
						});
						// async callback
						return callback(err, user);
					});
				}
			}

			// save position
			if (req.body.position) {
				queries.position = function(callback) {
					return User.findOne({ uuid : userUuid }, function (err, user) {
						// set and save
						user.position = req.body.position;
						user.save(function(err) {
							if (err) console.error(err); // log error
						});
						// async callback
						return callback(err, user);
					});
				}
			}

			// save phone
			if (req.body.phone) {
				queries.phone = function(callback) {
					return User.findOne({ uuid : userUuid }, function (err, user) {
						// set and save
						user.phone = req.body.phone;
						user.save(function(err) {
							if (err) console.error(err); // log error
						});
						// async callback
						return callback(err, user);
					});
				}
			}

			// // save email
			// if (req.body.email) {
			// 	queries.email = function(callback) {
			// 		return User.findOne({ uuid : userUuid }, function (err, user) {
			// 			// set and save
			// 			user.local.email = req.body.email;
			// 			user.save(function(err) {
			// 				if (err) console.error(err); // log error
			// 			});
			// 			// async callback
			// 			return callback(err, user);
			// 		});
			// 	}
			// }

			// save company
			if (req.body.firstName) {
				queries.firstName = function(callback) {
					return User.findOne({ uuid : userUuid }, function (err, user) {
						// set and save
						user.firstName = req.body.firstName;
						user.save(function(err) {
							if (err) console.error(err); // log error
						});
						// async callback
						return callback(err, user);
					});
				}
			}

			// save company
			if (req.body.lastName) {
				queries.lastName = function(callback) {
					return User.findOne({ uuid : userUuid }, function (err, user) {
						// set and save
						user.lastName = req.body.lastName;
						user.save(function(err) {
							if (err) console.error(err); // log error
						});
						// async callback
						return callback(err, user);
					});
				}
			}

			// run async queries
			async.parallel(queries, function(err, doc) {

				// return error
				if (err) return res.end(JSON.stringify({
					error : 'Error updating user.'
				}));	
				
				// return success
				res.end(JSON.stringify(doc));
			});
		});
	},



		
	// delete user  	// todo: send email notifications?
	deleteUser : function (req, res) {

		var userUuid 	= req.body.uuid;
		var authUser 	= req.user.uuid;
		var user        = req.user;

		// find user
		var model = User.findOne({ uuid : userUuid });
		model.exec(function (err, subject) {
			
			// return error
			if (err) return res.end(JSON.stringify({ error : 'Error retrieving user.' }));
			
			// return if not authorized
			if (!api.permission.to.remove.user(user, subject)) {
				var message = 'Unauthorized access attempt. Your IP ' + req._remoteAddress + ' has been logged.';
				return res.end(JSON.stringify({ error : message }));
			};

			model.remove().exec(function (err, result) {

				// return error
				if (err) return res.end(JSON.stringify({ error : 'Error retrieving user.' }));

				return res.end(JSON.stringify({ 
					message : 'User deleted.',
					result : result 
				}));

			})
		});
	},


	// check unique email
	checkUniqueEmail : function (req, res) {

		var user = req.user,
		    email = req.body.email;

		User.findOne({'local.email' : email}, function (err, result) {
			if (err) return res.end(JSON.stringify({
				error : 'Error checking email.'
			}));

			if (result) return res.end(JSON.stringify({
					unique : false
			}));

			return res.end(JSON.stringify({
				unique : true
			}));

		});

	},

	// get app users for Account 	// todo: refactor anyway
	getAll : function (callback, user) {

		var a = {};
		var createdByChildren = [];
		var createdByGrandchildren = [];

		// is superadmin, get all users
		if (api.permission.superadmin(user)) {
			a.superadminUsers = function (cb) {
				User
				.find()
				.exec(function(err, result) { 
					cb(err, result); 
				});
			}
		}
		
		// get all users created by user
		a.createdBy = function (cb) {
			User
			.find({createdBy : user.uuid})
			.exec(function(err, result) { 
				result.forEach(function(rr) {
					createdByChildren.push(rr.uuid);
				})

				cb(err, result); 
			});
		}

		// get all users created by children, ie. created by a user that User created
		a.createdByChildren = function (cb) {
			User
			.find({createdBy : { $in : createdByChildren }})
			.exec(function(err, result) { 
				result.forEach(function(rr) {
					createdByGrandchildren.push(rr.uuid);
				})
				cb(err, result); 
			});
		}

		// get all users created by grandchildren
		a.createdByChildren = function (cb) {
			User
			.find({createdBy : { $in : createdByGrandchildren }})
			.exec(function(err, result) { 
				cb(err, result); 
			});
		}

		async.series(a, function (err, allUsers) {

			// return error
			if (err) return callback(err);

			// flatten into one array
			var array = [];
			for (r in allUsers) {
				array.push(allUsers[r]);
			}

			// flatten
			var flat = _.flatten(array);

			// remove duplicates
			var unique = _.unique(flat, 'uuid');

			// return callback
			callback(err, unique);

		});

	},


}

// convenience method for checking hardcoded super user
function superadmin(user) {
	if (superusers.indexOf(user.uuid) >= 0) return true;
	return false;
}