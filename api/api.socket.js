//API: api.socket.js
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

var r = require('resumable-js/node-resumable')('/data/tmp/');

// api
var api = module.parent.exports;

// exports
module.exports = api.socket = { 

	_processing : {},


	send : function (options) {

		

	},


	uploadDone : function (options) {

		var userId = options.user._id;

		var session = _.findKey(api.app.io.handshaken, function (s) {
			return s.session.passport.user == userId;
		});


		console.log('found session?'.yellow, session);

		var sock = api.app.io.sockets.sockets[session];
		
		console.log('sock: '.magenta, sock);
		
		// send to user
		sock.emit('uploadDone', options.result);

	},


	setProcessing : function (process) {
		this._processing[process.fileUuid] = process;
		this._processing[process.fileUuid]._timestamp = new Date().getTime();
	},

	getProcessing : function (id) {
		return this._processing[id];
	},


	processingDone : function (options) {

		var userId = options.user._id;

		var session = _.findKey(api.app.io.handshaken, function (s) {
			return s.session.passport.user == userId;
		});


		console.log('found session?'.yellow, session);

		var sock = api.app.io.sockets.sockets[session];
		
		console.log('sock: '.magenta, sock);
		
		// send to user
		sock.emit('processingDone', options.result);

	},


	grindDone : function (req, res) {
		console.log('gridDone'.cyan);
		console.log('gridDone'.cyan);
		console.log('gridDone'.cyan);
		console.log('gridDone'.cyan);

		console.log('req: ', req);
		console.log('gridDone'.cyan);
		console.log('gridDone'.cyan);
		console.log('gridDone'.cyan);
		console.log('gridDone'.cyan);

		res.end();


		var fileUuid = req.body.fileUuid;

		var process = api.socket.getProcessing(fileUuid);

		var timeDiff = new Date().getTime() - process._timestamp;

		var userId = process.userId;

		var session = _.findKey(api.app.io.handshaken, function (s) {
			return s.session.passport.user == userId;
		});

		var sock = api.app.io.sockets.sockets[session];
		
		console.log('sock: '.magenta, sock);
		
		// send to user
		sock.emit('processingDone', {
			processingDone : fileUuid,
			elapsed : timeDiff,
			size : process.size
		});

	},


}











