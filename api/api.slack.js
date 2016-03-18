// API: api.slack.js

// database schemas
var Project 	= require('../models/project');
// var Clientel 	= require('../models/client');	// weird name cause 'Client' is restricted name
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
var srs 	= require('srs');
var zlib 	= require('zlib');
var uuid 	= require('node-uuid');
var util 	= require('util');
var utf8 	= require("utf8");
var mime 	= require("mime");
var exec 	= require('child_process').exec;
var dive 	= require('dive');
var async 	= require('async');
var carto 	= require('carto');
var nodeSlack 	= require('../tools/slack');
var crypto      = require('crypto');
var fspath 	= require('path');
var mapnik 	= require('mapnik');
var request 	= require('request');
var ogr2ogr 	= require('ogr2ogr');
var nodepath    = require('path');
var formidable  = require('formidable');
var nodemailer  = require('nodemailer');
var uploadProgress = require('node-upload-progress');
var mapnikOmnivore = require('mapnik-omnivore');

// api
var api = module.parent.exports;

// slack
var slack = new nodeSlack(api.config.slack.webhook);

// exports
module.exports = api.slack = { 

	_send : function (options) {
		var text = options.text;
		var attachments = options.attachments;
		var channel = options.channel;
		var slack_options = {
			text 		: text,
			channel 	: channel || api.config.slack.channel,
			username 	: api.config.slack.botname,
			icon_url 	: api.config.slack.icon,
			unfurl_links 	: true,
			link_names 	: 1,
			attachments 	: attachments
		};

		if (options.icon_emoji) {
			slack_options.icon_emoji = options.icon_emoji;
		}

		// send to slack
		slack.send(slack_options);
	},

	registeredUser : function (options) {

		// get time since invite
		var age_of_link = api.utils.prettyDate(new Date(options.timestamp));

		// text
		var text = 'A new user registered to ' + api.config.slack.baseurl +' \n\n';
		text += '`Name:` ' + options.user_name;
		text += '\n`Email:` ' + options.user_email;
		if (options.user_company) text 	+= '\n`Company:` ' + options.user_company;
		if (options.user_position) text += '\n`Position:` ' + options.user_position;
		text += '\n`Invited by:` ' + options.inviter_name;
		if (options.inviter_company) text += ' (' + options.inviter_company + ')';
		text += '\n`Invited to project:` ' + options.project_name;
		text += '\n`Invite link was created:` ' + age_of_link;

		// send
		api.slack._send({
			text : text
		});
	},

	userEvent : function (options) {

		console.log('userEvent', options);

		var user = options.user;
		var event = options.event;
		var description = options.description;
		var custom_options = options.options;
		var ops = [];


		// custom options (screenshot)
		if (custom_options && custom_options.screenshot) ops.push(function (callback) {

			var file_id = custom_options.file_id;

			// get raw file
			File
			.findOne({uuid : file_id})
			.exec(function (err, file) {
				if (err || !file) return callback('no screenshot');

				// return raw file
				var imageFile = file.data.image;
				var path = '/data/images/' + imageFile.file;

				// create smaller version of screenshot
				api.pixels._resizeScreenshot({
					image : path,	
				}, function (err, resized_image) {
					if (err) return callback(err);
					var resized_path = api.config.portalServer.uri + 'pixels/screenshot/' + resized_image;
					options.embed_image = resized_path;
					
					callback(null);
				});
			});
		});

		ops.push(function (callback) {
			var text = user + ' ' + event + ' ' + description;

			// create attachments
			var attachments = api.slack._createAttachments(options);

			api.slack._send({
				text : text,
				channel : api.config.slack.monitor,
				attachments : attachments
			});
		});

		async.series(ops, function (err) {
		
			if (err) console.log('ERR 83838: ', err);
		});
	

	},

	_createAttachments : function (options) {
		if (!options.embed_image) return false;

		var attachments = [{
			image_url : options.embed_image
		}];

		return attachments;
	},

	createdProject : function (options) {
		var project = options.project;
		var user = options.user;

		// set vars
		var baseurl 	= api.config.slack.baseurl;
		var projectName = project.name;
		var fullName 	= user.firstName + user.lastName;
		var url 	= baseurl + project.slug;
		var text 	= fullName + ' created a project: ' + url;

		// send
		api.slack._send({text : text});
	},

	deletedProject : function (options) {
		var project = options.project;
		var user = options.user;
		// set vars
		var baseurl 	= api.config.slack.baseurl;
		var projectName = project.name;
		var fullName 	= user.firstName + user.lastName;
		var url 	= baseurl + project.slug;
		var text 	= fullName + ' deleted a project: ' + projectName;

		// send to slack
		api.slack._send({text: text});
	},



	loggedIn : function (options) {
		var user = options.user;
		var fullName = user.firstName + ' ' + user.lastName;
		var text = fullName + ' logged in to ' + api.config.slack.baseurl;

		// send
		api.slack._send({ 
			text : text
		});
	}
};