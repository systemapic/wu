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
var nodeSlack 	= require('node-slack');
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

			// send to slack
			slack.send({
				text: text,
				channel: api.config.slack.channel,
				username: api.config.slack.botname,
				icon_url : api.config.slack.icon,
				unfurl_links: true,
				link_names: 1
				// attachments: attachment_array,
				// icon_emoji: 'taco',
			});
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
			slack.send({
				text: text,
				channel: api.config.slack.channel,
				username: api.config.slack.botname,
				icon_url : api.config.slack.icon,
				unfurl_links: true,
				link_names: 1
				// attachments: attachment_array,
				// icon_emoji: 'taco',
			});
		});
	},

	_getClient : function (project, callback) {
		Clientel
		.findOne({uuid : project.client})
		.exec(callback)
	},








};









