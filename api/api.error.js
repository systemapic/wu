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


// exports
module.exports = api.error = { 

	invalidAccessToken : function (req, res) {
		res.status(403).send({ 
			error : "Invalid access token.",
			description : "Check out https://docs.systemapic.com/ for details on the API."
		});
		api.error.log('Invalid access token.');
	},

	unauthorized : function (req, res) {
		res.status(403).send({ 
			error : "Your request was not authorized.",
			description : "Check out https://docs.systemapic.com/ for details on the API."
		});

		api.error.log('unauthorized');
	},

	missingInformation : function (req, res) {
		console.log('api.error.missingInformation'.red);
		
		var message = 'Missing information. Check out https://docs.systemapic.com/ for details on the API.';

		res.status(422).json({ 
			error : message 
		});
		
		api.error.log(message);
	},

	general : function (req, res, err) {
		console.log('api.error.genera2l:', err, api.error.pretty(err));

		res.status(422).json({
			error : api.error.pretty(err)
		});
		
		// send to socket
		api.socket.sendError(req.user._id, err.message || err);

		api.error.log(err);
	},

	generalSocket : function (user, err) {
		
		// send to socket
		api.socket.sendError(user._id, err.message || err);

		// log
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

		var text = '*Server error*: ';

		// slack formatting
		if (err.message) text += ' `' + api.error._trim(err.message) + '` ';
		if (err.stack) text += ' ``` ' + err.stack + ' ``` ';
		if (!err.message && !err.stack) text += ' ```' + err + '```';

		// print
		if (err.stack) console.log('stack:'.red, err.stack);
		if (err.message) console.log('message'.red, err.message);
		if (err) console.log('err: '.red, err);

		// send error to slack
		api.slack._send({
			text : text,
			channel : api.config.slack.errorChannel,
			icon : 'http://systemapic.com/wp-content/uploads/systemapic-color-logo-circle-error.png'
		});

		// todo: slack, ga.js, local log, etc.
	},

	_trim : function (str) {
   		return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
	},	
	
	clientLog : function (req, res) {
		var options 	= req.body,
		    message 	= options.message,
		    file 	= options.file,
		    line 	= options.line,
		    stack 	= options.stack,
		    username 	= options.username,
		    project 	= options.project,
		    domain 	= api.config.portalServer.uri.split('//').reverse()[0],
		    fileLine 	= options.file.split('/').reverse()[0] + ':' + options.line,
		    find 	= api.config.portalServer.uri,
		    re 		= new RegExp(find, 'g'),
		    cleanStack 	= stack ? stack.replace(re, '') : '',
		    text 	= '*Error*: ' + domain + ' `' + fileLine + '` ```' + cleanStack + '```';

		// send error to slack
		api.slack._send({
			text : text,
			channel : api.config.slack.errorChannel,
			icon : 'http://systemapic.com/wp-content/uploads/systemapic-color-logo-circle-error.png'
		});

		res && res.end(); // no feedback
	},

}
