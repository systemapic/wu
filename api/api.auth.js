// API: api.auth.js

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

// exports
module.exports = api.auth = { 

	// // REMOVE!! TODO!! REMOVE!!
	// debugSetPassword : function (req, res) {
	// 	User
	// 	.findOne({'local.email' : 'info@systemapic.com'})
	// 	.exec(function (err, user) {

	// 		var password = 'mEJa2EchAbAbAkayaf';

	// 		api.auth.setPassword(user, password);

	// 		res.end('ok');
	// 	});
	// },

	forgotPassword : function (req, res) {
		res.render('../../views/forgot.ejs', {message : ''});
	},

	// servePasswordPage : function (req, res) {
	// 	// todo: check token

	// 	res.render('../../views/pass.ejs', {message : ''});
	// },

	createPassword : function (req, res) {

		console.log('createPassword', req.body);

		// check token
		var token = req.body.token;
		var password = req.body.password;

		api.redis.get(token, function (err, userUuid) {
			if (err || !userUuid) return res.end(JSON.stringify({
				err : err || 'Invalid token'
			}));

			User
			.findOne({uuid : userUuid})
			.exec(function (err, user) {
				api.auth.setPassword(user, password, function (err, doc) {
					res.end(JSON.stringify({
						err : null,
						email : user.local.email
					}));

					// delete temp token
					api.redis.del(token);
				});
			})
		});
	},


	requestPasswordReset : function (req, res) {
		// get email
		var email = req.body.email;

		User
		.findOne({'local.email' : email})
		.exec(function (err, user) {

			// send password reset email
			if (!err && user) {
				api.email.sendPasswordResetEmail(user);
				res.end('Please check your email for password reset link.');
			} else {
				res.end('Please check your email for password reset link..');
			}
		});
	},


	// confirmPasswordReset : function (req, res) {
	// 	var email = req.query.email,
	//  	    token = req.query.token;

	// 	User
	// 	.findOne({'local.email' : email})
	// 	.exec(function (err, user) {
	// 		if (err || !user) api.error.general(req, res, err || 'No such user. Maybe. ;)');

	// 		// check token
	// 		api.auth.checkPasswordResetToken(user, token, function (valid) {

	// 			// reset if valid token
	// 			if (valid) {
	// 				api.auth.resetPassword(user);
	// 				var message = 'Please check your email for new login details.';
	// 			} else {
	// 				var message = 'Password reset token is expired.';
	// 			}

	// 			// finish
	// 			// res.render('../../views/login.serve.ejs', { message : message });
	// 			res.render('../../views/pass.ejs', { message : message });
	// 		});
	// 	});
	// },

	setPassword : function (user, password, callback) {
		user.local.password = user.generateHash(password);
		user.markModified('local');
		user.save(callback);
	},




	// resetPassword : function (user) {
	// 	var password = crypto.randomBytes(16).toString('hex');
	// 	user.local.password = user.generateHash(password);
	// 	user.markModified('local');
	
	// 	// save the user
	// 	user.save(function(err, doc) { 
	// 		// send email with login details to user
	// 		api.email.sendWelcomeEmail(user, password);
	// 	});
	// },


	setPasswordResetToken : function (user) {
		var token = crypto.randomBytes(20).toString('hex'),
		    key = user.uuid;

		api.redis.set(token, key);  // set temp token
		api.redis.expire(token, 600); // expire in ten mins
		return token;
	},

	// checkPasswordToken : function (token, callback) {
	// 	api.redis.get(token, callback);
	// },
	
	// checkPasswordResetToken : function (user, token, callback) {
	// 	var key = 'resetToken-' + user.uuid;
	// 	api.redis.get(key, function (err, actualToken) {
	// 		callback(!err && actualToken && actualToken == token)
	// 	});
	// },



}