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
console.log('api.legend === api=>', api);

// exports
module.exports = api.email = { 


	sendPasswordResetEmail : function (user) {
		console.log('sending email!', user);
		
		// todo: SSL
		var name    = user.firstName + ' ' + user.lastName;
		var email   = user.local.email;
		var token   = api.permission.setPasswordResetToken(user);
		var link    = config.portalServer.uri + 'reset?email=' + email + '&token=' + token;

		var from    = 'Systemapic.com <knutole@noerd.biz>'; // todo: change!
		var to      = email;
		var subject = 'Please confirm your request for a password reset';
		var body    = '<h4>You have requested a password reset.</h4>Reset your password by clicking this link: ' + link;
		body       += '<br><br>The link is valid for ten minutes.<br>If you think you have received this email in error, no further action is required.'
		var bcc     = ['knutole@noerd.biz']; // todo: add admins, superadmins to bcc

		// hook up to gmail
		var transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: 'knutole@noerd.biz',
				pass: '***REMOVED***@noerdbiz'
			}
		});

		// send email
		transporter.sendMail({
			from    : from,
			to      : to,	
			bcc     : bcc, 
			subject : subject,
			html    : body
		});

	},


	sendNewUserEmail : function (newUser, password) {
		console.log('sending email!')
		
		// todo: SSL
		var name    = newUser.firstName + ' ' + newUser.lastName;
		var email   = newUser.local.email;

		var from    = 'Systemapic.com <knutole@noerd.biz>';
		var to      = email;
		var body    = '<h1>Welcome to Systemapic.com ' + name + '</h1><br><h3>Login to <a href="http://systemapic.com" target="_blank">Systemapic.com</a> with the following details:</h3><br>Username: ' + email + ' <br>Password: ' + password;
		var subject = 'Congratulations! Here are your access details for Systemapic.com';
		var bcc     = ['knutole@noerd.biz']; // todo: add admins, superadmins to bcc

		// hook up to gmail
		var transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: 'knutole@noerd.biz',
				pass: '***REMOVED***@noerdbiz'
			}
		});

		// send email
		transporter.sendMail({
			from    : from,
			to      : to,	
			bcc     : bcc, 
			subject : subject,
			html    : body
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

		// hook up to gmail
		var transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: 'knutole@noerd.biz',
				pass: '***REMOVED***@noerdbiz'
			}
		});

		// send email
		transporter.sendMail({
			from    : from,
			to      : to,	
			bcc     : bcc, 
			subject : subject,
			html    : body
		});

	},




}