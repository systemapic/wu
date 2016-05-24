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
module.exports = api.socket = { 

	_processing : {},


	send : function (channel, user_id, data) {

		var sock = api.socket._getSocket(user_id);

		// send to user
		sock && sock.emit(channel, {
			data : data
		});
	},

	getServerStats : function (req) {

		// get stats from redis
		api.redis.stats.lrange('server_stats', 0, 0, function (err, range) {
			var stats = api.utils.parse(range);
			req.io.socket.emit('server_stats', {
				server_stats : stats
			});
		});
	},

	userEvent :function (req) {
		var options = req.data;

		// send to slack
		api.slack.userEvent(options);
	},

	sendError : function (userId, err) {
		var sock = api.socket._getSocket(userId);

		// send to user
		sock && sock.emit('errorMessage', {
			error : err
		});
	},

	downloadReady : function (options) {

		// get socket
		var socket = api.socket.getSocket(options);

		// send to user
		socket && socket.emit('downloadReady', options.status);
	},

	uploadDone : function (options) {

		// get socket
		var socket = api.socket.getSocket(options);

		// send to user
		socket && socket.emit('uploadDone', options.result);
	},

	processingProgress : function (options) {

		var user_id = options.user_id;
		var progress = options.progress;

		// get socket
		var socket = api.socket._getSocket(user_id);

		// send to user
		socket && socket.emit('processingProgress', progress);
	},

	processingDone : function (options) {

		var file_id = options.file_id;
		var user_id = options.user_id;
		var sock = api.socket._getSocket(user_id);

		// send to user
		sock && sock.emit('processingDone', {
			file_id : file_id,
			import_took_ms : options.import_took_ms
		});
	},

	grindRasterDone : function (req, res) {

		var fileUuid = req.body.fileUuid;
		var process = api.socket._getProcessing(fileUuid);
		var timeDiff = new Date().getTime() - process._timestamp;
		var userId = process.userId;
		var sock = api.socket._getSocket(userId);
		var error = req.body.error;
		var uniqueIdentifier = req.body.uniqueIdentifier;

		// send to user
		sock && sock.emit('processingDone', {
			processingDone : fileUuid,
			elapsed : timeDiff,
			error : error,
			size : process.size,
			uniqueIdentifier : uniqueIdentifier
		});

		// end connection
		res.send();
	},

	grindDone : function (req, res) {
		var fileUuid = req.body.fileUuid;
		var process = api.socket._getProcessing(fileUuid);
		var timeDiff = new Date().getTime() - process._timestamp;
		var userId = process.userId;
		var sock = api.socket._getSocket(userId);
		var error = req.body.error;
		var uniqueIdentifier = req.body.uniqueIdentifier;

		// send to user
		sock && sock.emit('processingDone', {
			processingDone : fileUuid,
			elapsed : timeDiff,
			error : error,
			size : process.size,
			uniqueIdentifier : uniqueIdentifier
		});

		// end connection
		res.send();
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
		if (!session) return;
		var sock = api.app.io.sockets.sockets[session];
		if (!sock) return;
		return sock;
	},

	_getSession : function (userId) {
		var session = _.findKey(api.app.io.handshaken, function (s) {
			if (!s || !s.session || !s.session.user_id || !userId) return false;

			return (s.session.user_id.toString() === userId.toString());
		});
		return session;
	},

	setProcessing : function (process) {
		api.socket._processing[process.fileUuid] = process;
		api.socket._processing[process.fileUuid]._timestamp = new Date().getTime();
	},

	_getProcessing : function (id) {
		return api.socket._processing[id];
	}
	
};