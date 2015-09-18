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

// api
var api = module.parent.exports;

// exports
module.exports = api.socket = { 

	_processing : {},


	getServerStats : function (req) {

		// get stats from redis
		api.redis.stats.lrange('server_stats', 0, 0, function (err, range) {
			var stats = api.utils.parse(range);
			req.io.socket.emit('server_stats', {
				server_stats : stats
			});
		});

	},

	sendError : function (userId, err) {
		var sock = api.socket._getSocket(userId);

		// send to user
		sock && sock.emit('errorMessage', {
			error : err
		});
	},

	uploadDone : function (options) {

		// get socket
		var socket = api.socket.getSocket(options);

		// send to user
		socket && socket.emit('uploadDone', options.result);
	},

	processingProgress : function (options) {

		// get socket
		var socket = api.socket.getSocket(options);



		// send to user
		socket && socket.emit('processingProgress', options.result);
	},

	processingDone : function (options) {

		var file_id = options.file_id,
		    user_id = options.user_id;

		var sock = api.socket._getSocket(user_id);

		console.log('processing done!', sock);
		console.log('socket processing done...');

		// send to user
		sock && sock.emit('processingDone', {
			file_id : file_id,
			import_took_ms : options.import_took_ms
		});
	},

	grindRasterDone : function (req, res) {

		var fileUuid = req.body.fileUuid,
		    process = api.socket._getProcessing(fileUuid),
		    timeDiff = new Date().getTime() - process._timestamp,
		    userId = process.userId,
		    sock = api.socket._getSocket(userId),
		    error = req.body.error,
		    uniqueIdentifier = req.body.uniqueIdentifier;

		// send to user
		sock && sock.emit('processingDone', {
			processingDone : fileUuid,
			elapsed : timeDiff,
			error : error,
			size : process.size,
			uniqueIdentifier : uniqueIdentifier
		});

		// end connection
		res.end();
	},


	grindDone : function (req, res) {
		var fileUuid = req.body.fileUuid,
		    process = api.socket._getProcessing(fileUuid),
		    timeDiff = new Date().getTime() - process._timestamp,
		    userId = process.userId,
		    sock = api.socket._getSocket(userId),
		    error = req.body.error,
		    uniqueIdentifier = req.body.uniqueIdentifier;

		// send to user
		sock && sock.emit('processingDone', {
			processingDone : fileUuid,
			elapsed : timeDiff,
			error : error,
			size : process.size,
			uniqueIdentifier : uniqueIdentifier
		});

		// end connection
		res.end();
	},


	getSocket : function (options) {
		var userId = api.socket._getUserId(options);
		var sock = api.socket._getSocket(userId);
		return sock;
	},

	_getUserId : function (options) {
		if (!options || !options.user) return false;
		return options.user._id;
	},

	_getSocket : function (userId) {
		var session = api.socket._getSession(userId);
		if (!session) return console.log('ERR 125: no session'.red);;
		var sock = api.app.io.sockets.sockets[session];
		if (!sock) return console.log('ERR 120: no sock'.red);
		return sock;
	},

	_getSession : function (userId) {
		var session = _.findKey(api.app.io.handshaken, function (s) {
			if (!s || !s.session || !s.session.passport) return false;
			return s.session.passport.user == userId;
		});
		return session;
	},

	setProcessing : function (process) {
		this._processing[process.fileUuid] = process;
		this._processing[process.fileUuid]._timestamp = new Date().getTime();
	},

	_getProcessing : function (id) {
		return this._processing[id];
	},

	
}
