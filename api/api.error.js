// API: api.error.js

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
module.exports = api.error = { 

	unauthorized : function (req, res) {
		console.log('api.error.unauthorized'.red);
		
		var message = "Don't be cheeky! All your IP are belong to us.";
		res.end(JSON.stringify({ 
			error : message 
		}));

		api.error.log('unauthorized');
	},

	missingInformation : function (req, res) {
		console.log('api.error.missingInformation'.red);
		
		var message = 'Missing information. Stay with the program!';
		res.end(JSON.stringify({ 
			error : message 
		}));
		
		api.error.log('missingInformation');
	},

	general : function (req, res, err) {
		console.log('api.error.general'.red, err);

		res.end(JSON.stringify({
			error : api.error.pretty(err)
		}));
		
		api.error.log(err);
	},

	pretty : function (err) {
		if (!err) return err;

		// return message if available		
		if (err.message) return err.message;

		// return ugly
		return err;
	},

	log : function (err) {
		if (!err) return;

		// print
		if (err.stack) console.log('stack:'.red, err.stack);
		if (err.message) console.log('message'.red, err.message);
		

		if (_.isObject(err)) {
			for (item in err) {
				console.log('err items: ', err[item]);
			}
		}

		// todo: slack, ga.js, log, etc.
	},
	
	clientLog : function (req, res) {
		var options = req.body,
		    message = options.message,
		    file = options.file,
		    line = options.line,
		    stack = options.stack,
		    username = options.username,
		    project = options.project,
		    domain = api.config.portalServer.uri.split('//').reverse()[0],
		    fileLine = options.file.split('/').reverse()[0] + ':' + options.line;

		var find = api.config.portalServer.uri;
		var re = new RegExp(find, 'g');
		var cleanStack = stack.replace(re, '');

		var text = '*Error*: ' + domain + ' `' + fileLine + '` ```' + cleanStack + '```';

		// api.slack._send({
		// 	text : text,
		// 	channel : '#error-log',
		// 	icon : 'http://systemapic.com/wp-content/uploads/systemapic-color-logo-circle-error.png'
		// });

		res.end(); // no feedback
	},





}


