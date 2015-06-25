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

	_send : function (options) {

		console.log('_send email'.green, options);

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

		// transporter options = {
		// 	from    : from,
		// 	to      : to,	
		// 	bcc     : bcc, 
		// 	subject : subject,
		// 	html    : body
		// }

		console.log('Sent email!'.yellow, options);
	},


	sendPasswordResetEmail : function (user) {
		if (!user) return;

		// todo: SSL
		var name    = user.firstName + ' ' + user.lastName;
		var email   = user.local.email;
		var token   = api.auth.setPasswordResetToken(user);
		var link = api.config.portalServer.uri + 'login?token=' + token;
		var to      = email;
		var subject = 'Please confirm your request for a password reset';
		var body    = '<div style="background-color: #f8f8f8; padding: 0; margin: 0; font-family: helvetica neue, helvetica, \'Open Sans\'; position: relative; top: 0; left: 0;width: 100%; height: 100%; padding-top: 100px;"><div style="width: 500px; margin: auto; background-color: white; border-radius: 20px; padding: 20px; color: #3f4652; position: relative; margin-bottom: 25px;"><div style="text-align: center;background: white;width: 140px;min-height: 140px;border-radius: 100px;position: relative;top: 0;margin: auto;"><img style="position: relative; top: 10px;" src="http://systemapic.com/logo/Just_Circle/120x120/grayDark-systemapic-logo-circle-120x120.png"></div><h1 style="font-weight: 500;font-size: 36px;text-align: center;margin: 0;">Hello ' + name + '</h1><div style="border-top: 1px dashed #3f4652;margin-top: 40px;margin-bottom: 40px;opacity: 0.15;"></div><h4 style="font-size: 17px;padding: 0;margin: 5px;margin-bottom: 20px;line-height: 1.4;">You have requested a password reset.</h4><h5 style="font-size: 14px; padding: 0; margin: 5px;"><br><a href="' + link + '">Reset your password by clicking this link.</a></h5><div style="border-top: 1px dashed #3f4652;margin-top: 40px;margin-bottom: 30px;opacity: 0.15;"></div><div style="font-size: 13px;line-height: 1.3;font-style: italic;padding-bottom: 20px;opacity: 0.5;">The link is valid for ten minutes. If you think you have received this email in error, no further action is required.<br></div></div><div style="left: 0;font-size: 12px;font-style: italic;width: 100%;text-align: center; margin-bottom: 100px; padding-bottom: 100px;"><a style="text-decoration: none; color: #3f4652;" href="mailto:info@systemapic.com">info@systemapic.com</a> ~ <a style="text-decoration: none; color:#3f4652;" href="http:/systemapic.com">Systemapic.com</a> &copy;</div></div>';		

		// send email
		api.email._send({
			to : to,
			html : body,
			subject : subject
		});

	},


	sendWelcomeEmail : function (newUser, password) {
		if (!newUser || !newUser.local) return;

		// todo: SSL
		var name    = newUser.firstName + ' ' + newUser.lastName;
		var email   = newUser.local.email;
		var domain = api.config.portalServer.uri.split('/')[2];
		var token = api.auth.setNewLoginToken(newUser);
		var link = api.config.portalServer.uri + 'login?token=' + token;

		// email body
		var body = '<div style="background-color: #f8f8f8; padding: 0; margin: 0; font-family: helvetica neue, helvetica, \'Open Sans\'; position: relative; top: 0; left: 0;width: 100%; height: 100%; padding-top: 100px;">';
		body    += '<div style="width: 500px; margin: auto; background-color: white; border-radius: 20px; padding: 20px; color: #3f4652; position: relative; margin-bottom: 25px;">';
		body 	+= '<div style="text-align: center;background: white;width: 140px;min-height: 140px;border-radius: 100px;position: relative;top: 0;margin: auto;"><img style="position: relative; top: 10px;" src="http://systemapic.com/logo/Just_Circle/120x120/grayDark-systemapic-logo-circle-120x120.png"></div>';
		body 	+= '<h1 style="font-weight: 500;font-size: 36px;text-align: center;margin: 0;">Hi ' + name + '!</h1><div style="border-top: 1px dashed #3f4652;margin-top: 40px;margin-bottom: 40px;opacity: 0.15;"></div>';
		body 	+= '<h1 style="font-weight: 500;font-size: 23px;text-align: center;margin: 10px;">Welcome to Systemapic.com</h1>'; 
		body 	+= '<h4 style="font-size: 17px;padding: 0;margin: 5px;margin-bottom: 20px;line-height: 1.4;">';
		body	+= 'Log in and create your password here: <a style="text-decoration: none; color: #4a89f7" target="_blank" href="' + link + '">' + domain + '</a>.</h4>';

		// send email
		api.email._send({
			to      : email,	
			subject : 'Congratulations! Here are your access details for Systemapic.com',
			html    : body
		});
	},


}