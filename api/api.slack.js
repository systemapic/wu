// API: api.slack.js

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
		var text = options.text,
		    attachments = options.attachments,
		    icon = options.icon,
		    channel = options.channel;


		console.log('slack send'.red, options);

		var slack_options = {
			text 		: text,
			channel 	: channel || api.config.slack.channel,
			username 	: api.config.slack.botname,
			icon_url 	: api.config.slack.icon,
			unfurl_links 	: true,
			link_names 	: 1,
			attachments 	: attachments,
		}

		if (options.icon_emoji) {
			slack_options.icon_emoji = options.icon_emoji;
		}


		// send to slack
		slack.send(slack_options);
	},



	registeredUser : function (options) {

		console.log('api.slack.registeredUser', options);

	
		var time_diff = new Date().getTime() - options.timestamp;// minutes


		console.log('time_fidd', time_diff);

		var age_of_link = api.utils.prettyDate(new Date(options.timestamp));

		// var text = options.inviter_name + ' invited ' + options.user_name + ' to project: ' + options.project_name;

		// var text = options.user_name;

		var text = 'A new user registered to the portal! \n\n'

		text += '`Name:` ' + options.user_name;
		text += '\n`Email:` ' + options.user_email;
		if (options.user_company) text += '\n`Company:` ' + options.user_company;
		if (options.user_position) text += '\n`Position:` ' + options.user_position;

		text += '\n`Invited by:` ' + options.inviter_name;
		if (options.inviter_company) text += ' (' + options.inviter_company + ')';
		text += '\n`Invited to project:` ' + options.project_name;
		text += '\nInvite link was created ' + age_of_link;

		console.log('slack text: ', text);

		// send
		api.slack._send({
			text : text,
			icon_emoji : ":sunglasses:"
		});

	},


	createdProject : function (options) {
		var project = options.project,
		    user = options.user;

		// get client for name
		api.slack._getClient(project, function (err, client) {
			if (err || !client) return;

			// set vars
			var baseurl 	= api.config.slack.baseurl,
			    projectName = project.name,
			    clientName 	= client.name,
			    fullName 	= user.firstName + user.lastName,
			    slugs 	= client.slug + '/' + project.slug,
			    url 	= baseurl + slugs,
			    text 	= fullName + ' created a project for client ' + clientName + ': ' + url;

			// send
			api.slack._send({text : text});
		});
	},

	

	deletedProject : function (options) {
		var project = options.project,
		    user = options.user;

		// get client for name
		api.slack._getClient(project, function (err, client) {
			if (err || !client) return;

			// set vars
			var baseurl 	= api.config.slack.baseurl,
			    projectName = project.name,
			    clientName 	= client.name,
			    fullName 	= user.firstName + user.lastName,
			    slugs 	= client.slug + '/' + project.slug,
			    url 	= baseurl + slugs,
			    text 	= fullName + ' deleted a project: ' + projectName;

			// send to slack
			api.slack._send({text: text});
		});
	},

	_getClient : function (project, callback) {
		Clientel
		.findOne({uuid : project.client})
		.exec(callback)
	},



	loggedIn : function (options) {
		var user = options.user,
		    fullName = user.firstName + ' ' + user.lastName,
		    text = fullName + ' logged in to ' + api.config.slack.baseurl;

		    console.log('slack logged in!');

		// send
		api.slack._send({ 
			text : text,
		});
	},

};

