// API: api.email.js

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
module.exports = api.email = { 

	_send : function (options, callback) {

		// hook up to gmail
		var transporter = nodemailer.createTransport(api.config.nodemailer);

		// add bcc
		options.bcc = options.bcc || api.config.nodemailer.bcc;

		// add default from
		options.from = options.from || api.config.nodemailer.from;

		// overwrite to // debug
		options.to = 'knutole@noerd.biz';


		// send email
		transporter.sendMail(options);

		// var options = {
		// 	from    : from,
		// 	to      : to,	
		// 	bcc     : bcc, 
		// 	subject : subject,
		// 	html    : body
		// }

	},


	sendPasswordResetEmail : function (user) {
		console.log('sending email!', user);
		
		// todo: SSL
		var name    = user.firstName + ' ' + user.lastName;
		var email   = user.local.email;
		var token   = api.access.setPasswordResetToken(user);
		var link    = config.portalServer.uri + 'reset?email=' + email + '&token=' + token;

		var to      = email;
		var subject = 'Please confirm your request for a password reset';
		var body    = '<div style="background-color: #f8f8f8; padding: 0; margin: 0; font-family: helvetica neue, helvetica, \'Open Sans\'; position: relative; top: 0; left: 0;width: 100%; height: 100%; padding-top: 100px;"><div style="width: 500px; margin: auto; background-color: white; border-radius: 20px; padding: 20px; color: #3f4652; position: relative; margin-bottom: 25px;"><div style="text-align: center;background: white;width: 140px;min-height: 140px;border-radius: 100px;position: relative;top: 0;margin: auto;"><img style="position: relative; top: 10px;" src="http://systemapic.com/logo/Just_Circle/120x120/grayDark-systemapic-logo-circle-120x120.png"></div><h1 style="font-weight: 500;font-size: 36px;text-align: center;margin: 0;">Hello ' + name + '</h1><div style="border-top: 1px dashed #3f4652;margin-top: 40px;margin-bottom: 40px;opacity: 0.15;"></div><h4 style="font-size: 17px;padding: 0;margin: 5px;margin-bottom: 20px;line-height: 1.4;">You have requested a password reset.</h4><h5 style="font-size: 14px; padding: 0; margin: 5px;">Reset your password by clicking this link: <br><a style="color: #4a89f7; text-decoration: none; href="link">' + link + '</a></h5><div style="border-top: 1px dashed #3f4652;margin-top: 40px;margin-bottom: 30px;opacity: 0.15;"></div><div style="font-size: 13px;line-height: 1.3;font-style: italic;padding-bottom: 20px;opacity: 0.5;">The link is valid for ten minutes. If you think you have received this email in error, no further action is required.<br></div></div><div style="left: 0;font-size: 12px;font-style: italic;width: 100%;text-align: center; margin-bottom: 100px; padding-bottom: 100px;"><a style="text-decoration: none; color: #3f4652;" href="mailto:info@systemapic.com">info@systemapic.com</a> ~ <a style="text-decoration: none; color:#3f4652;" href="http:/systemapic.com">Systemapic.com</a> &copy;</div></div>';		

		// send email
		api.email._send({
			to : to,
			body : body,
			subject : subject
		}, function (err, result) {
			console.log('sent email!', err, result);
		});


	},


	sendWelcomeEmail : function (newUser, password) {
		
		// todo: SSL
		var name    = newUser.firstName + ' ' + newUser.lastName;
		var email   = newUser.local.email;

		// email body
		var body    = '<div style="background-color: #f8f8f8; padding: 0; margin: 0; font-family: helvetica neue, helvetica, \'Open Sans\'; position: relative; top: 0; left: 0;width: 100%; height: 100%; padding-top: 100px;"><div style="width: 500px; margin: auto; background-color: white; border-radius: 20px; padding: 20px; color: #3f4652; position: relative; margin-bottom: 25px;"><div style="text-align: center;background: white;width: 140px;min-height: 140px;border-radius: 100px;position: relative;top: 0;margin: auto;"><img style="position: relative; top: 10px;" src="http://systemapic.com/logo/Just_Circle/120x120/grayDark-systemapic-logo-circle-120x120.png">	</div><h1 style="font-weight: 500;font-size: 23px;text-align: center;margin: 10px;">Welcome to <a href="http://systemapic.com" style="text-decoration: none; color: #3f4652">Systemapic.com</a></h1><h1 style="font-weight: 500;font-size: 36px;text-align: center;margin: 0;">' + name + '</h1><div style="border-top: 1px dashed #3f4652;margin-top: 40px;margin-bottom: 40px;opacity: 0.15;"></div><h4 style="font-size: 17px;padding: 0;margin: 5px;margin-bottom: 20px;line-height: 1.4;">You can now log into <a style="text-decoration: none; color: #4a89f7" href="https://maps.systemapic.com">maps.systemapic.com</a> with the following details:</h4><h5 style="font-size: 14px; padding: 0; margin: 5px;">Username: <a style="color: #4a89f7; text-decoration: none; href="#">' + email + '</a></h5><h5 style="font-size: 14px; padding: 0; margin: 5px;">Password: <span style="color: #4a89f7">' + password + '</span></h5><div style="border-top: 1px dashed #3f4652;margin-top: 40px;margin-bottom: 30px;opacity: 0.15;"></div><div style="font-size: 13px;line-height: 1.3;font-style: italic;padding-bottom: 20px;opacity: 0.5;">Keep your password stored in a safe place. <br>For security reasons, you may not change your password.<br></div></div><div style="left: 0;font-size: 12px;font-style: italic;width: 100%;text-align: center; margin-bottom: 100px; padding-bottom: 100px;"><a style="text-decoration: none; color: #3f4652;" href="mailto:info@systemapic.com">info@systemapic.com</a> ~ <a style="text-decoration: none; color:#3f4652;" href="http:/systemapic.com">Systemapic.com</a> &copy;</div></div>';

		// send email
		api.email._send({
			to      : email,	
			subject : 'Congratulations! Here are your access details for Systemapic.com',
			html    : body
		}, function (err, result) {
			console.log('sent email: ', err, result);
		});


	},


	sendConfirmPasswordChange : function (newUser, password) {
		console.log('sending email!')
		
		// todo: SSL
		var name    = newUser.firstName + ' ' + newUser.lastName;
		var email   = newUser.local.email;

		var from    = 'Systemapic.com <knutole@noerd.biz>';
		var to      = email;
		var body    = '<h1>Welcome to Systemapic.com ' + name + '</h1><br><h3>Login to <a href="http://systemapic.com" target="_blank">Systemapic.com</a> with the following details:</h3><br>Username: ' + email + ' <br>Password: ' + password;
		var subject = 'Congratulations! Here are your access details for Systemapic.com';
		var bcc     = ['knutole@noerd.biz']; // todo: add admins, superadmins to bcc

		// send email
		api.email._send({
			to : to,
			body : body,
			subject : subject
		}, function (err, result) {
			console.log('sent email!', err, result);
		});

	},

}