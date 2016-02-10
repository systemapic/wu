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
var _ 		= require('lodash');
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

api.config.skipMail = api.config.skipMail || {};

// exports
module.exports = api.email = { 

	_send : function (options) {

		// console.log('_send email'.green, options);

		// hook up to gmail
		var transporter = nodemailer.createTransport(api.config.nodemailer);

		// add bcc
		options.bcc = options.bcc || api.config.nodemailer.bcc;

		// add default from
		options.from = options.from || api.config.nodemailer.from;

		// overwrite to // debug
		// options.to = 'knutole@systemapic.com';

		// send email
		transporter.sendMail(options);

		// transporter options = {
		// 	from    : from,
		// 	to      : to,	
		// 	bcc     : bcc, 
		// 	subject : subject,
		// 	html    : body
		// }

		console.log('Sent email!'.yellow);
	},


	sendPasswordResetEmail : function (user) {
		if (!user) return;
		
		//api.user.js
		// var inviter = req.user.firstName + req.user.lastName;
		// todo: SSL

		var name           = user.firstName + ' ' + user.lastName;
		var email          = user.getEmail();
		var token          = api.auth.setPasswordResetToken(user);
		var link           = api.config.portalServer.uri + 'reset?token=' + token + '&email=' + email;
		var to             = !api.config.skipMail.resetPassword ? email : api.config.skipMail.resetPassword;
		var subject        = 'Please confirm your request for a password reset';

		var logo = api.config.portalServer.uri + api.config.mail.portal.logo;
		var bgcolor = api.config.mail.portal.color;

		var body 	= '<script type="application/ld+json">';
			body 	+= '{';
			body 	+= '"@context":       "http://schema.org",';
			body	+= '"@type":          "EmailMessage",';
			body 	+= '"description":    "You have requested a password reset for Systemapic.com. Reset your password now!",';
			body 	+= '"potentialAction": {';
			body 	+= '"@type": "ViewAction",';
			body 	+= '"target":   "https://dev.systemapic.com/login",';
			body	+= '"name": "Reset Password"';
			body 	+= '},';
			body 	+= '"publisher": ';
			body 	+= '{';
			body 	+= '"@type": "Organization",';
			body 	+= '"name": "Systemapic",';
			body 	+= '"url": "https://systemapic.com"';
			body 	+= '}';
			body 	+= '}';
			body	+= '</script>';
			body    +=  '<table border="0" cellpadding="0" cellspacing="0" width="100%" align="center">';
		    body    +=  '<tr>';
		    body    +=  '<td bgcolor="' + bgcolor + '" >';
		    body    +=  '<div align="center" style="padding: 0px 10px 0px 10px;">';
		    body    +=  '<table border="0" cellpadding="0" cellspacing="0" width="500" class="wrapper">';
		    body    +=  '<tr>';
		    body    +=  '<td style="padding: 10px 0px 10px 0px;" class="logo">';
		    body    +=  '<table border="0" cellpadding="0" cellspacing="0" width="100%">';
		    body    +=  '<tr>';
		    body    +=  '<td width="100" align="center"><a href="http://systemapic.com/" target="_blank"><img alt="Logo" src="' + api.config.portalServer.uri + 'images/portal-logo.png' + '" style="display: block; font-family: helvetica neue, helvetica, \'Open Sans\'; color: #BFC2C8; font-size: 16px;" border="0"></a></td>';
		    body    +=  '</tr>';
			body    +=  '</table>';
			body    +=  '</td>';
		    body    +=  '</tr>';
			body    +=  '</table>';
			body    +=  '</div>';
			body    +=  '</td>';
		    body    +=  '</tr>';
			body    +=  '</table>';
			body    +=  '<table border="0" cellpadding="0" cellspacing="0" width="100%">';
		    body    +=  '<tr bgcolor="#EBEAE8">';
			body    +=  '<td align="center" style="padding: 30px 15px 30px 15px;" class="section-padding">';
		    body    +=  '<table border="0" cellpadding="0" cellspacing="0" width="500">';
			body    +=  '<tr>';
			body    +=  '<td bgcolor="#FFFFFF" style="border-radius: 10px; -webkit-border-radius: 10px; -moz-border-radius: 10px;">';
			body    +=  '<table width="100%" border="0" cellspacing="0" cellpadding="0">';
			body    +=  '<tr>';
			body    +=  '<td>';
			body    +=  '<table width="100%" border="0" cellspacing="0" cellpadding="10" align = "center">';
			body    +=  '<tr>';
			body    +=  '<td align="center" style="font-family: Helvetica Neue, helvetica, \'Open Sans\'; color: #333333; padding: 15px 0px 0px 0px; text-align:center"><span style="font-size: 24px;">Dear ' + name + '</span></td>';
			body    +=  '</tr>';
			body    +=  '<tr>';
			body    +=  '<td align="center" style="font-size: 16px; padding: 25px 0px 0px 0px;  line-height: 25px; font-family: Helvetica Neue, helvetica, \'Open Sans\'; color: #333333; text-align: center;">You have requested a password reset. <br/> Click the button below to create your new password.</td>';
			body    +=  '</tr>';
			body    +=  '</table>';
			body    +=  '</td>';
			body    +=  '</tr>';
			body    +=  '<tr>';
			body    +=  '<td align="center">';
			body    +=  '<table width="100%" border="0" cellspacing="0" cellpadding="0" class="mobile-button-container">';
			body    +=  '<tr>';
			body    +=  '<td align="center" style="padding: 15px 0 0 0;" class="padding-copy">';
			body    +=  '<table border="0" cellspacing="0" cellpadding="10" class="responsive-table">';
			body    +=  '<tr>';
			body    +=  '<td align="center" style="padding-bottom:25px;">';
			body    +=  '<a href="' + link + '" target="_blank" style="font-size: 16px; font-family: Helvetica Neue, Arial, sans-serif; color: #ffffff; text-decoration: none; border-radius: 10px; -webkit-border-radius: 10px; -moz-border-radius: 10px; background-color: #3f4652; border-top: 15px solid #3f4652; border-bottom: 15px solid #3f4652; border-right: 25px solid #3f4652; border-left: 25px solid #3f4652;display: inline-block;" class="on-the-fly-behavior"> Reset Password &rarr;</a>';
			body    +=  '</td>';
			body    +=  '</tr>';
			body    +=  '<tr>';
			body    +=  '<td align="center" style="padding: 0px 0px 25px 0px; font-size: 14px; line-height: 20px; font-family: helvetica neue, helvetica, \'Open Sans\'; color: #313640;"><span style="font-style: italic;">';
			body    +=  'The link is valid for ten minutes. <br/> If you think you have received this email in error, <br/>no further action is required.';
			body    +=  '</span>';
		    body    +=  '</td>';
			body    +=  '</tr>';
			body    +=  '</table>';
			body    +=  '</td>';
			body    +=  '</tr>';
			body    +=  '</table>';
		    body    +=  '</td>';
		    body    +=  '</tr>';
			body    +=  '</table>';
			body    +=  '</td>';
			body    +=  '</tr>';
		    body    +=  '</table>';
		   	body    +=  '</td>';
		    body    +=  '</tr>';
			body    +=  '</table>';
			body    +=  '<table border="0" cellpadding="0" cellspacing="0" width="100%" align="center">';
		    body    +=  '<tr bgcolor="#EBEAE8">';
		    body    +=  '<td align="center">';
			body    +=  '<table width="500" border="0" cellspacing="0" cellpadding="10" align="center" class="responsive-table">';
			body    +=  '<tr>';
		    body    +=  '<td align="center" valign="middle" style="font-size: 12px; line-height: 18px; font-family: helvetica neue, helvetica, \'Open Sans\'; color:#313640; padding: 0px 0px 15px 0px;">';
			body    +=  '<a class="appleFooter" style="color:#313640;" href="mailto:info@systemapic.com">info@systemapic.com</a><br>';
			body    +=  '<a class="original-only" style="color: #313640; text-decoration: none; " href="http:/systemapic.com">Powered by Systemapic.com</a>';
			body    +=  '</td>';
			body    +=  '</tr>';
			body    +=  '</table>';
			body    +=  '</td>';
		    body    +=  '</tr>';
			body    +=  '</table>';


		// send email
		api.email._send({
			to : to,
			html : body,
			subject : subject
		});

	},


	sendWelcomeEmail : function (newUser, password, account) {		
		if (!newUser || !newUser.local) return;

		// todo: SSL
		var name = newUser.firstName + ' ' + newUser.lastName;
		var email = newUser.local.email;
		var domain = api.config.portalServer.uri.split('/')[2];
		var token = api.auth.setNewLoginToken(newUser);
		var link = api.config.portalServer.uri + 'login?token=' + token;
		var fullname = account.firstName  + ' ' + account.lastName;
		
		var logo = api.config.portalServer.uri + api.config.mail.portal.logo;
		var bgcolor = api.config.mail.portal.color;


		// email body
		var body  = '<script type="application/ld+json">';
			body  += '{';
			body  += '"@context":       "http://schema.org",';
			body  += '"@type":          "EmailMessage",';
			body  += '"description":    "Welcome to Systemapic, view your account now!",';
			body  += '"potentialAction": {';
			body  += '"@type": "ViewAction",';
			body  += '"target":   "https://dev.systemapic.com/login",';
			body  += '"name": "View your account"';
			body  += '},';
			body  += '"publisher": ';
			body  += '{';
			body  += '"@type": "Organization",';
			body  += '"name": "Systemapic",';
			body  += '"url": "https://systemapic.com"';
			body  += '}';
			body  += '}';
			body  += '</script>';
			body += '<table border="0" cellpadding="0" cellspacing="0" width="100%" align="center">';
		    body += '<tr>';
	        body += '<td bgcolor="' + bgcolor + '" >';
			body += '<div align="center" style="padding: 0px 10px 0px 10px;">';
			body += '<table border="0" cellpadding="0" cellspacing="0" width="500" class="wrapper">';
			body += '<tr>';
			body += '<td style="padding: 10px 0px 10px 0px;" class="logo">';
			body += '<table border="0" cellpadding="0" cellspacing="0" width="100%">';
			body += '<tr>';
			body += '<td width="100" align="center"><a href="http://systemapic.com/" target="_blank"><img alt="Logo" src="' + api.config.portalServer.uri + 'images/portal-logo.png' + '" style="display: block; font-family: helvetica neue, helvetica, \'Open Sans\'; color: #BFC2C8; font-size: 16px;" border="0"></a></td>';
			body += '</tr>';
			body += '</table>';
			body += '</td>';
			body += '</tr>';
			body += '</table>';
			body += '</div>';
			body += '</td>';
		    body += '</tr>';
			body += '</table>';
			body += '<table border="0" cellpadding="0" cellspacing="0" width="100%">';
		    body += '<tr bgcolor="#EBEAE8">';
			body += '<td align="center" style="padding: 30px 15px 30px 15px;" class="section-padding">';
			body += '<table border="0" cellpadding="0" cellspacing="0" width="500">';
			body += '<tr>';
			body += '<td bgcolor="#FFFFFF" style="border-radius: 10px; -webkit-border-radius: 10px; -moz-border-radius: 10px;">';
			body += '<table width="100%" border="0" cellspacing="0" cellpadding="0">';
			body += '<tr>';
			body += '<td>';
			body += '<table width="100%" border="0" cellspacing="0" cellpadding="10">';
			body += '<tr>';
			body += '<td align="center" style="font-family: Helvetica Neue, helvetica, \'Open Sans\'; color: #333333; padding: 15px 0px 0px 0px; text-align:center"><span style="font-size: 24px;">Dear ' + name + '</span></td>';
			body += '</tr>';
			body += '<tr>';
			body += '<td align="center" style="font-size: 16px; padding: 25px 0px 0px 0px;  line-height: 25px; font-family: Helvetica Neue, helvetica, \'Open Sans\'; color: #333333; text-align: center;">Welcome to Systemapic.com<br/>You have been invited by ' + fullname + '.<br/> Click the button below to log in and create your own password.</td>';
			body += '</tr>';
			body += '</table>';
			body += '</td>';
			body += '</tr>';
	        body += '<tr>';
			body += '<td align="center">';
			body += '<table width="100%" border="0" cellspacing="0" cellpadding="0" class="mobile-button-container">';
			body += '<tr>';
			body += '<td align="center" style="padding: 15px 0 0 0;" class="padding-copy">';
			body += '<table border="0" cellspacing="0" cellpadding="10" class="responsive-table">';
			body += '<tr>';
			body += '<td align="center" style="padding-bottom:25px;">';
			body += '<a href="' + link + '" target="_blank" style="font-size: 16px; font-family: Helvetica Neue, Arial, sans-serif; color: #ffffff; text-decoration: none; border-radius: 10px; -webkit-border-radius: 10px; -moz-border-radius: 10px; background-color: #3f4652; border-top: 15px solid #3f4652; border-bottom: 15px solid #3f4652; border-right: 25px solid #3f4652; border-left: 25px solid #3f4652; display: inline-block;"> Login &rarr;</a>';
			body += '</td>';
			body += '</tr>';
			body += '<tr>';
			body += '<td align="center" style="padding: 0px 0px 25px 0px; font-size: 14px; line-height: 20px; font-family: helvetica neue, helvetica, \'Open Sans\'; color: #313640;"><span style="font-style: italic;">';
			body += 'If you think you have received this email in error, <br>no further action is required.';
			body += '</span>';
			body += '</td>';
			body += '</tr>';
			body += '</table>';
			body += '</td>';
			body += '</tr>';
			body += '</table>';
			body += '</td>';
			body += '</tr>';
			body += '</table>';
			body += '</td>';
			body += '</tr>';
			body += '</table>';
			body += '</td>';
		    body += '</tr>';
			body += '</table>';
			body += '<table border="0" cellpadding="0" cellspacing="0" width="100%" align="center">';
		    body += '<tr bgcolor="#EBEAE8">';
			body += '<td align="center">';
			body += '<table width="500" border="0" cellspacing="0" cellpadding="10" align="center" class="responsive-table">';
			body += '<tr>';
			body += '<td align="center" valign="middle" style="font-size: 12px; line-height: 18px; font-family: helvetica neue, helvetica, \'Open Sans\'; color:#313640; padding: 0px 0px 15px 0px;">';
			body += '<a class="appleFooter" style="color:#313640;" href="mailto:info@systemapic.com">info@systemapic.com</a><br>';
			body += '<a class="original-only" style="color: #313640; text-decoration: none; " href="http:/systemapic.com">Powered by Systemapic.com</a>';
			body += '</td>';
			body += '</tr>';
			body += '</table>';
			body += '</td>';
		    body += '</tr>';
			body += '</table>';


		// send email
		api.email._send({
			to      : !api.config.skipMail.welcome ? email : api.config.skipMail.welcome,	
			subject : 'Congratulations! Here are your access details for Systemapic.com',
			html    : body
		});
	},


	sendInvitedEmail : function (options) {

		var email = options.email,
		    name = options.name,
		    project_name = options.project_name, 
		    customMessage = options.customMessage;

		if (!email) return;


		
		// get template
		var template = api.config.mail.templates.invited;
		var title = template.title;
		var subject = template.subject;
		var messageBody = template.body;
		var button_text = template.button_text;

		// vars
		var portal = api.config.portalServer.uri;
		var button_link = portal + 'login';
	
		// replace
		messageBody = messageBody.replace('[name]', name);
		messageBody = messageBody.replace('[project_name]', project_name);

		var logo = api.config.portalServer.uri + api.config.mail.portal.logo;
		var bgcolor = api.config.mail.portal.color;

		var bg_logo = api.config.mail.portal.backgroundLogo;

		// email body
		var body  = '<script type="application/ld+json">';
			body  += '{';
			body  += '"@context":       "http://schema.org",';
			body  += '"@type":          "EmailMessage",';
			body  += '"description":    "Welcome to Systemapic",';
			body  += '"potentialAction": {';
			body  += '"@type": "ViewAction",';
			body  += '"target":   "https://systemapic.com/",';
			body  += '"name": "Your access details for Systemapic"';
			body  += '},';
			body  += '"publisher": ';
			body  += '{';
			body  += '"@type": "Organization",';
			body  += '"name": "Systemapic",';
			body  += '"url": "http://systemapic.com"';
			body  += '}';
			body  += '}';
			body  += '</script>';
			body += '<table border="0" cellpadding="0" cellspacing="0" width="100%" align="center">';
		    body += '<tr>';
	        body += '<td bgcolor="' + bgcolor + '" >';
			body += '<div align="center" style="padding: 0px 10px 0px 10px;">';
			body += '<table border="0" cellpadding="0" cellspacing="0" width="500" class="wrapper">';
			body += '<tr>';
			body += '<td style="padding: 10px 0px 10px 0px;" class="logo">';
			body += '<table border="0" cellpadding="0" cellspacing="0" width="100%">';
			body += '<tr>';
			// body += '<td width="100" align="center"><a href="https://systemapic.com/" target="_blank"><img alt="Logo" src="' + logo + '" style="display: block; font-family: helvetica neue, helvetica, \'Open Sans\'; color: #BFC2C8; font-size: 16px;" border="0"></a></td>';
			body += '<td width="100" align="center"><a href="https://systemapic.com/" target="_blank"><div alt="Logo" style="background-image:' + api.config.portalServer.uri + 'images/portal-logo.png' + ';display: block; font-family: helvetica neue, helvetica, \'Open Sans\'; color: #BFC2C8; font-size: 16px;" border="0"></a></td>';
			body += '</tr>';
			body += '</table>';
			body += '</td>';
			body += '</tr>';
			body += '</table>';
			body += '</div>';
			body += '</td>';
		    body += '</tr>';
			body += '</table>';
			body += '<table border="0" cellpadding="0" cellspacing="0" width="100%">';
		    body += '<tr bgcolor="#EBEAE8">';
			body += '<td align="center" style="padding: 30px 15px 30px 15px;" class="section-padding">';
			body += '<table border="0" cellpadding="0" cellspacing="0" width="500">';
			body += '<tr>';
			body += '<td bgcolor="#FFFFFF" style="border-radius: 10px; -webkit-border-radius: 10px; -moz-border-radius: 10px;">';
			body += '<table width="100%" border="0" cellspacing="0" cellpadding="0">';
			body += '<tr>';
			body += '<td>';
			body += '<table width="100%" border="0" cellspacing="0" cellpadding="10">';
			body += '<tr>';
			body += '<td align="center" style="font-family: Helvetica Neue, helvetica, \'Open Sans\'; color: #333333; padding: 15px; text-align:center"><span style="font-size: 24px;">' + title + '</span></td>';
			body += '</tr>';
			body += '<tr>';
			body += '<td align="center" style="font-size: 16px; padding: 25px 25px 0px 25px;  line-height: 25px; font-family: Helvetica Neue, helvetica, \'Open Sans\'; color: #333333; text-align: center;">' + messageBody + '</td>';
			body += '</tr>';
			body += '</table>';
			body += '</td>';
			body += '</tr>';
	        body += '<tr>';
			body += '<td align="center">';
			body += '<table width="100%" border="0" cellspacing="0" cellpadding="0" class="mobile-button-container">';
			body += '<tr>';
			body += '<td align="center" style="padding: 15px 0 0 0;" class="padding-copy">';
			body += '<table border="0" cellspacing="0" cellpadding="10" class="responsive-table">';
			body += '<tr>';
			body += '<td align="center" style="padding-bottom:25px;">';
			body += '<a href="' + button_link + '" target="_blank" style="font-size: 16px; font-family: Helvetica Neue, Arial, sans-serif; color: #ffffff; text-decoration: none; border-radius: 10px; -webkit-border-radius: 10px; -moz-border-radius: 10px; background-color: #3f4652; border-top: 15px solid #3f4652; border-bottom: 15px solid #3f4652; border-right: 25px solid #3f4652; border-left: 25px solid #3f4652; display: inline-block;"> ' + button_text + '</a>';
			body += '</td>';
			body += '</tr>';
		body += '<tr>';
			body += '<td align="center" style="padding: 0px 0px 25px 0px; font-size: 12px; line-height: 20px; font-family: helvetica neue, helvetica, \'Open Sans\'; color: #313640;"><span style="font-style: italic;">';
			body += 'If you think you have received this email in error, <br>no further action is required.';
			body += '</span>';
			body += '</td>';
			body += '</tr>';
			body += '</table>';
			body += '</td>';
			body += '</tr>';
			body += '</table>';
			body += '</td>';
			body += '</tr>';
			body += '</table>';
			body += '</td>';
			body += '</tr>';
			body += '</table>';
			body += '</td>';
		    body += '</tr>';
			body += '</table>';
			body += '<table border="0" cellpadding="0" cellspacing="0" width="100%" align="center">';
		    body += '<tr bgcolor="#EBEAE8">';
			body += '<td align="center">';
			body += '<table width="500" border="0" cellspacing="0" cellpadding="10" align="center" class="responsive-table">';
			body += '<tr>';
			body += '<td align="center" valign="middle" style="font-size: 12px; line-height: 18px; font-family: helvetica neue, helvetica, \'Open Sans\'; color:#313640; padding: 0px 0px 15px 0px;">';
			body += '<a class="original-only" style="color: #313640; text-decoration: none; " href="https://systemapic.com">Powered by Systemapic.com</a><br>';
			body += '<a class="appleFooter" style="color:#313640;" href="mailto:info@systemapic.com">info@systemapic.com</a>';
			body += '</td>';
			body += '</tr>';
			body += '</table>';
			body += '</td>';
		    body += '</tr>';
			body += '</table>';


		// send email
		api.email._send({
			to      : !api.config.skipMail.invited ? email : api.config.skipMail.invited,
			subject : subject,
			html    : body
		});
	},


	// from access_v2
	sendInviteEmail : function (options) {

		var email = options.email,
		    customMessage = options.customMessage,
		    numProjects = options.numProjects,
		    invite_link = options.invite_link,
		    invited_by = options.invited_by;

		if (!email) return;


		
		// get template
		var template = api.config.mail.templates.invited;
		var title = template.title;
		var subject = template.subject;
		var messageBody = template.body;
		var button_text = template.button_text;

		// vars
		var button_link = invite_link;
	
		// replace
		messageBody = messageBody.replace('[inviter_name]', invited_by);

		if (customMessage.length) {
			messageBody += '<br><br><div style="border: 2px solid #ebeae8; padding: 10px; padding-left: 30px;border-radius: 10px; text-align: left; font-size: 15px; font-style: italic;">Message:<br>';
			messageBody += customMessage + '</div>'
		}

		var logo = api.config.portalServer.uri + api.config.mail.portal.logo;
		var bgcolor = api.config.mail.portal.color;
		var bg_logo = api.config.mail.portal.backgroundLogo;
		
		// email body
		var body  = '<script type="application/ld+json">';
			body  += '{';
			body  += '"@context":       "http://schema.org",';
			body  += '"@type":          "EmailMessage",';
			body  += '"description":    "Welcome to Systemapic",';
			body  += '"potentialAction": {';
			body  += '"@type": "ViewAction",';
			body  += '"target":   "https://systemapic.com/",';
			body  += '"name": "Your access details for Systemapic"';
			body  += '},';
			body  += '"publisher": ';
			body  += '{';
			body  += '"@type": "Organization",';
			body  += '"name": "Systemapic",';
			body  += '"url": "https://systemapic.com"';
			body  += '}';
			body  += '}';
			body  += '</script>';
			body += '<table border="0" cellpadding="0" cellspacing="0" width="100%" align="center">';
		    body += '<tr>';
	        body += '<td bgcolor="' + bgcolor + '" >';
			body += '<div align="center" style="padding: 0px 10px 0px 10px;">';
			body += '<table border="0" cellpadding="0" cellspacing="0" width="500" class="wrapper">';
			body += '<tr>';
			body += '<td style="padding: 10px 0px 10px 0px;" class="logo">';
			body += '<table border="0" cellpadding="0" cellspacing="0" width="100%">';
			body += '<tr>';
			// body += '<td width="100" align="center"><a href="https://systemapic.com/" target="_blank"><div alt="Logo" style="background-image:' + bg_logo + ';display: block; font-family: helvetica neue, helvetica, \'Open Sans\'; color: #BFC2C8; font-size: 16px;" border="0"></a></td>';
			body += '<td width="100" align="center"><a href="https://systemapic.com/" target="_blank"><img alt="Logo" src="' + api.config.portalServer.uri + 'images/portal-logo.png' + '" style="display: block; font-family: helvetica neue, helvetica, \'Open Sans\'; color: #BFC2C8; font-size: 16px;" border="0"></a></td>';
			body += '</tr>';
			body += '</table>';
			body += '</td>';
			body += '</tr>';
			body += '</table>';
			body += '</div>';
			body += '</td>';
		    body += '</tr>';
			body += '</table>';
			body += '<table border="0" cellpadding="0" cellspacing="0" width="100%">';
		    body += '<tr bgcolor="#EBEAE8">';
			body += '<td align="center" style="padding: 30px 15px 30px 15px;" class="section-padding">';
			body += '<table border="0" cellpadding="0" cellspacing="0" width="500">';
			body += '<tr>';
			body += '<td bgcolor="#FFFFFF" style="border-radius: 10px; -webkit-border-radius: 10px; -moz-border-radius: 10px;">';
			body += '<table width="100%" border="0" cellspacing="0" cellpadding="0">';
			body += '<tr>';
			body += '<td>';
			body += '<table width="100%" border="0" cellspacing="0" cellpadding="10">';
			body += '<tr>';
			body += '<td align="center" style="font-family: Helvetica Neue, helvetica, \'Open Sans\'; color: #333333; padding: 15px; text-align:center"><span style="font-size: 24px;">' + title + '</span></td>';
			body += '</tr>';
			body += '<tr>';
			body += '<td align="center" style="font-size: 16px; padding: 25px 25px 0px 25px;  line-height: 25px; font-family:  \'Open Sans\', Helvetica Neue, helvetica; color: #333333; text-align: center;">' + messageBody + '</td>';
			body += '</tr>';
			body += '</table>';
			body += '</td>';
			body += '</tr>';
	        body += '<tr>';
			body += '<td align="center">';
			body += '<table width="100%" border="0" cellspacing="0" cellpadding="0" class="mobile-button-container">';
			body += '<tr>';
			body += '<td align="center" style="padding: 15px 0 0 0;" class="padding-copy">';
			body += '<table border="0" cellspacing="0" cellpadding="10" class="responsive-table">';
			body += '<tr>';
			body += '<td align="center" style="padding-bottom:25px;">';
			body += '<a href="' + button_link + '" target="_blank" style="font-size: 16px; font-family: \'Open Sans\', Helvetica Neue, Arial, sans-serif; color: #ffffff; text-decoration: none; border-radius: 10px; -webkit-border-radius: 10px; -moz-border-radius: 10px; background-color: #3f4652; border-top: 15px solid #3f4652; border-bottom: 15px solid #3f4652; border-right: 25px solid #3f4652; border-left: 25px solid #3f4652; display: inline-block;"> ' + button_text + '</a>';
			body += '</td>';
			body += '</tr>';
		body += '<tr>';
			body += '<td align="center" style="padding: 0px 0px 25px 0px; font-size: 12px; line-height: 20px; font-family: \'Open Sans\', helvetica neue, helvetica; color: #313640;"><span style="font-style: italic;">';
			body += 'If you think you have received this email in error, <br>no further action is required.';
			body += '</span>';
			body += '</td>';
			body += '</tr>';
			body += '</table>';
			body += '</td>';
			body += '</tr>';
			body += '</table>';
			body += '</td>';
			body += '</tr>';
			body += '</table>';
			body += '</td>';
			body += '</tr>';
			body += '</table>';
			body += '</td>';
		    body += '</tr>';
			body += '</table>';
			body += '<table border="0" cellpadding="0" cellspacing="0" width="100%" align="center">';
		    body += '<tr bgcolor="#EBEAE8">';
			body += '<td align="center">';
			body += '<table width="500" border="0" cellspacing="0" cellpadding="10" align="center" class="responsive-table">';
			body += '<tr>';
			body += '<td align="center" valign="middle" style="font-size: 12px; line-height: 18px; font-family: helvetica neue, helvetica, \'Open Sans\'; color:#313640; padding: 0px 0px 15px 0px;">';
			body += '<a class="original-only" style="color: #313640; text-decoration: none; " href="https://systemapic.com">Powered by Systemapic.com</a><br>';
			body += '<a class="appleFooter" style="color:#313640;" href="mailto:info@systemapic.com">info@systemapic.com</a>';
			body += '</td>';
			body += '</tr>';
			body += '</table>';
			body += '</td>';
		    body += '</tr>';
			body += '</table>';


		// send email
		api.email._send({
			to      : !api.config.skipMail.invite ? email : api.config.skipMail.invite,
			subject : subject,
			html    : body
		});
	},



	sendJoinBetaMail : function (email) {
		
		if (!email) return;


		var title          = 'Thank you!';
		var subject        = 'Systemapic Beta: Early Access Mailing List';
		var subtitle       = 'You have been signed up for the Systemapic Beta: Early Access mailing list. We will contact you as soon as we have available slots!<br><br>In the meantime, feel free to read our blog and follow our progress:';
		var link           = 'https://systemapic.com/blog';
		var link_text      = 'Systemapic Blog';

		var logo = api.config.portalServer.uri + api.config.mail.systemapic.logo;
		var bgcolor = api.config.mail.systemapic.color;

		// email body
		var body  = '<script type="application/ld+json">';
			body  += '{';
			body  += '"@context":       "http://schema.org",';
			body  += '"@type":          "EmailMessage",';
			body  += '"description":    "Welcome to Systemapic Beta Mailing List",';
			body  += '"potentialAction": {';
			body  += '"@type": "ViewAction",';
			body  += '"target":   "https://systemapic.com/",';
			body  += '"name": "Join Beta Mailing List"';
			body  += '},';
			body  += '"publisher": ';
			body  += '{';
			body  += '"@type": "Organization",';
			body  += '"name": "Systemapic",';
			body  += '"url": "https://systemapic.com"';
			body  += '}';
			body  += '}';
			body  += '</script>';
			body += '<table border="0" cellpadding="0" cellspacing="0" width="100%" align="center">';
		    body += '<tr>';
	        body += '<td bgcolor="' + bgcolor + '" >';
			body += '<div align="center" style="padding: 0px 10px 0px 10px;">';
			body += '<table border="0" cellpadding="0" cellspacing="0" width="500" class="wrapper">';
			body += '<tr>';
			body += '<td style="padding: 10px 0px 10px 0px;" class="logo">';
			body += '<table border="0" cellpadding="0" cellspacing="0" width="100%">';
			body += '<tr>';
			body += '<td width="100" align="center"><a href="https://systemapic.com/" target="_blank"><img alt="Logo" src="' + api.config.portalServer.uri + 'images/portal-logo.png' + '" style="display: block; font-family: helvetica neue, helvetica, \'Open Sans\'; color: #BFC2C8; font-size: 16px;" border="0"></a></td>';
			body += '</tr>';
			body += '</table>';
			body += '</td>';
			body += '</tr>';
			body += '</table>';
			body += '</div>';
			body += '</td>';
		    body += '</tr>';
			body += '</table>';
			body += '<table border="0" cellpadding="0" cellspacing="0" width="100%">';
		    body += '<tr bgcolor="#EBEAE8">';
			body += '<td align="center" style="padding: 30px 15px 30px 15px;" class="section-padding">';
			body += '<table border="0" cellpadding="0" cellspacing="0" width="500">';
			body += '<tr>';
			body += '<td bgcolor="#FFFFFF" style="border-radius: 10px; -webkit-border-radius: 10px; -moz-border-radius: 10px;">';
			body += '<table width="100%" border="0" cellspacing="0" cellpadding="0">';
			body += '<tr>';
			body += '<td>';
			body += '<table width="100%" border="0" cellspacing="0" cellpadding="10">';
			body += '<tr>';
			body += '<td align="center" style="font-family: Helvetica Neue, helvetica, \'Open Sans\'; color: #333333; padding: 15px; text-align:center"><span style="font-size: 24px;">' + title + '</span></td>';
			body += '</tr>';
			body += '<tr>';
			body += '<td align="center" style="font-size: 16px; padding: 25px 25px 0px 25px;  line-height: 25px; font-family: Helvetica Neue, helvetica, \'Open Sans\'; color: #333333; text-align: center;">' + subtitle + '</td>';
			body += '</tr>';
			body += '</table>';
			body += '</td>';
			body += '</tr>';
	        body += '<tr>';
			body += '<td align="center">';
			body += '<table width="100%" border="0" cellspacing="0" cellpadding="0" class="mobile-button-container">';
			body += '<tr>';
			body += '<td align="center" style="padding: 15px 0 0 0;" class="padding-copy">';
			body += '<table border="0" cellspacing="0" cellpadding="10" class="responsive-table">';
			body += '<tr>';
			body += '<td align="center" style="padding-bottom:25px;">';
			body += '<a href="' + link + '" target="_blank" style="font-size: 16px; font-family: Helvetica Neue, Arial, sans-serif; color: #ffffff; text-decoration: none; border-radius: 10px; -webkit-border-radius: 10px; -moz-border-radius: 10px; background-color: #3f4652; border-top: 15px solid #3f4652; border-bottom: 15px solid #3f4652; border-right: 25px solid #3f4652; border-left: 25px solid #3f4652; display: inline-block;"> ' + link_text + '</a>';
			body += '</td>';
			body += '</tr>';
			body += '<tr>';
			body += '<td align="center" style="padding: 0px 0px 25px 0px; font-size: 14px; line-height: 20px; font-family: helvetica neue, helvetica, \'Open Sans\'; color: #313640;"><span style="font-style: italic;">';
			body += 'If you think you have received this email in error, <br>no further action is required.';
			body += '</span>';
			body += '</td>';
			body += '</tr>';
			body += '</table>';
			body += '</td>';
			body += '</tr>';
			body += '</table>';
			body += '</td>';
			body += '</tr>';
			body += '</table>';
			body += '</td>';
			body += '</tr>';
			body += '</table>';
			body += '</td>';
		    body += '</tr>';
			body += '</table>';
			body += '<table border="0" cellpadding="0" cellspacing="0" width="100%" align="center">';
		    body += '<tr bgcolor="#EBEAE8">';
			body += '<td align="center">';
			body += '<table width="500" border="0" cellspacing="0" cellpadding="10" align="center" class="responsive-table">';
			body += '<tr>';
			body += '<td align="center" valign="middle" style="font-size: 12px; line-height: 18px; font-family: helvetica neue, helvetica, \'Open Sans\'; color:#313640; padding: 0px 0px 15px 0px;">';
			body += '<a class="appleFooter" style="color:#313640;" href="mailto:info@systemapic.com">info@systemapic.com</a><br>';
			body += '<a class="original-only" style="color: #313640; text-decoration: none; " href="https://systemapic.com">Powered by Systemapic.com</a>';
			body += '</td>';
			body += '</tr>';
			body += '</table>';
			body += '</td>';
		    body += '</tr>';
			body += '</table>';


		// send email
		api.email._send({
			to      : !api.config.skipMail.joinBeta ? email : api.config.skipMail.joinBeta,	
			subject : subject,
			html    : body
		});
	},

	sendContactRequestEmail : function (options) {

		var email = options.email;
		var requested_by = options.requested_by;
		var link = options.link;

		    // customMessage = options.customMessage,
		    // numProjects = options.numProjects,
		    // invite_link = options.invite_link,
		    // invited_by = options.invited_by;

		if (!email) return;

		// get template
		var template = api.config.mail.templates.contactRequest;
		var title = template.title;
		var subject = template.subject;
		var messageBody = template.body;
		var button_text = template.button_text;

		// vars
		var button_link = link;
	
		// replace
		title = title.replace('[inviter_name]', requested_by);
		messageBody = messageBody.replace('[inviter_name]', requested_by);

		// if (customMessage.length) {
		// 	messageBody += '<br><br><div style="border: 2px solid #ebeae8; padding: 10px; padding-left: 30px;border-radius: 10px; text-align: left; font-size: 15px; font-style: italic;">Message:<br>';
		// 	messageBody += customMessage + '</div>'
		// }

		var logo = api.config.portalServer.uri + api.config.mail.portal.logo;
		var bgcolor = api.config.mail.portal.color;

		// email body
		var body  = '<script type="application/ld+json">';
			body  += '{';
			body  += '"@context":       "http://schema.org",';
			body  += '"@type":          "EmailMessage",';
			body  += '"description":    "Welcome to Systemapic",';
			body  += '"potentialAction": {';
			body  += '"@type": "ViewAction",';
			body  += '"target":   "https://systemapic.com/",';
			body  += '"name": "Your access details for Systemapic"';
			body  += '},';
			body  += '"publisher": ';
			body  += '{';
			body  += '"@type": "Organization",';
			body  += '"name": "Systemapic",';
			body  += '"url": "https://systemapic.com"';
			body  += '}';
			body  += '}';
			body  += '</script>';
			body += '<table border="0" cellpadding="0" cellspacing="0" width="100%" align="center">';
		    body += '<tr>';
	        body += '<td bgcolor="' + bgcolor + '" >';
			body += '<div align="center" style="padding: 0px 10px 0px 10px;">';
			body += '<table border="0" cellpadding="0" cellspacing="0" width="500" class="wrapper">';
			body += '<tr>';
			body += '<td style="padding: 10px 0px 10px 0px;" class="logo">';
			body += '<table border="0" cellpadding="0" cellspacing="0" width="100%">';
			body += '<tr>';
			body += '<td width="100" align="center"><a href="https://systemapic.com/" target="_blank"><img alt="Logo" src="' + api.config.portalServer.uri + 'images/portal-logo.png' + '" style="display: block; font-family: helvetica neue, helvetica, \'Open Sans\'; color: #BFC2C8; font-size: 16px;" border="0"></a></td>';
			body += '</tr>';
			body += '</table>';
			body += '</td>';
			body += '</tr>';
			body += '</table>';
			body += '</div>';
			body += '</td>';
		    body += '</tr>';
			body += '</table>';
			body += '<table border="0" cellpadding="0" cellspacing="0" width="100%">';
		    body += '<tr bgcolor="#EBEAE8">';
			body += '<td align="center" style="padding: 30px 15px 30px 15px;" class="section-padding">';
			body += '<table border="0" cellpadding="0" cellspacing="0" width="500">';
			body += '<tr>';
			body += '<td bgcolor="#FFFFFF" style="border-radius: 10px; -webkit-border-radius: 10px; -moz-border-radius: 10px;">';
			body += '<table width="100%" border="0" cellspacing="0" cellpadding="0">';
			body += '<tr>';
			body += '<td>';
			body += '<table width="100%" border="0" cellspacing="0" cellpadding="10">';
			body += '<tr>';
			body += '<td align="center" style="font-family: Helvetica Neue, helvetica, \'Open Sans\'; color: #333333; padding: 15px; text-align:center"><span style="font-size: 24px;">' + title + '</span></td>';
			body += '</tr>';
			body += '<tr>';
			body += '<td align="center" style="font-size: 16px; padding: 25px 25px 0px 25px;  line-height: 25px; font-family:  \'Open Sans\', Helvetica Neue, helvetica; color: #333333; text-align: center;">' + messageBody + '</td>';
			body += '</tr>';
			body += '</table>';
			body += '</td>';
			body += '</tr>';
	        body += '<tr>';
			body += '<td align="center">';
			body += '<table width="100%" border="0" cellspacing="0" cellpadding="0" class="mobile-button-container">';
			body += '<tr>';
			body += '<td align="center" style="padding: 15px 0 0 0;" class="padding-copy">';
			body += '<table border="0" cellspacing="0" cellpadding="10" class="responsive-table">';
			body += '<tr>';
			body += '<td align="center" style="padding-bottom:25px;">';
			body += '<a href="' + button_link + '" target="_blank" style="font-size: 16px; font-family: \'Open Sans\', Helvetica Neue, Arial, sans-serif; color: #ffffff; text-decoration: none; border-radius: 10px; -webkit-border-radius: 10px; -moz-border-radius: 10px; background-color: #3f4652; border-top: 15px solid #3f4652; border-bottom: 15px solid #3f4652; border-right: 25px solid #3f4652; border-left: 25px solid #3f4652; display: inline-block;"> ' + button_text + '</a>';
			body += '</td>';
			body += '</tr>';
		body += '<tr>';
			body += '<td align="center" style="padding: 0px 0px 25px 0px; font-size: 12px; line-height: 20px; font-family: \'Open Sans\', helvetica neue, helvetica; color: #313640;"><span style="font-style: italic;">';
			// body += 'If you think you have received this email in error, <br>no further action is required.';
			body += '</span>';
			body += '</td>';
			body += '</tr>';
			body += '</table>';
			body += '</td>';
			body += '</tr>';
			body += '</table>';
			body += '</td>';
			body += '</tr>';
			body += '</table>';
			body += '</td>';
			body += '</tr>';
			body += '</table>';
			body += '</td>';
		    body += '</tr>';
			body += '</table>';
			body += '<table border="0" cellpadding="0" cellspacing="0" width="100%" align="center">';
		    body += '<tr bgcolor="#EBEAE8">';
			body += '<td align="center">';
			body += '<table width="500" border="0" cellspacing="0" cellpadding="10" align="center" class="responsive-table">';
			body += '<tr>';
			body += '<td align="center" valign="middle" style="font-size: 12px; line-height: 18px; font-family: helvetica neue, helvetica, \'Open Sans\'; color:#313640; padding: 0px 0px 15px 0px;">';
			// body += 'If you think you have received this email in error, no further action is required.<br>';
			body += '<a class="original-only" style="color: #313640; text-decoration: none; " href="https://systemapic.com">Powered by Systemapic.com</a><br>';
			body += '<a class="appleFooter" style="color:#313640;" href="mailto:info@systemapic.com">info@systemapic.com</a>';
			body += '</td>';
			body += '</tr>';
			body += '</table>';
			body += '</td>';
		    body += '</tr>';
			body += '</table>';


		// send email
		api.email._send({
			to      : !api.config.skipMail.contactRequest ? email : api.config.skipMail.contactRequest,	
			subject : subject,
			html    : body
		});

	},


}