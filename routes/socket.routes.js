// ROUTE: socket.routes.js 

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
var colors 	= require('colors');
var crypto      = require('crypto');
var fspath 	= require('path');
var mapnik 	= require('mapnik');
var request 	= require('request');
var nodepath    = require('path');
var formidable  = require('formidable');
var nodemailer  = require('nodemailer');
var uploadProgress = require('node-upload-progress');
var mapnikOmnivore = require('mapnik-omnivore');
var clientSession = require('client-sessions');

// api
var api = require('../api/api');

// function exports
module.exports = function(app) {




	app.io.route('ready', function (req) {
		console.log('socket -> ready');
		// checkAccess(req, function (err) {
		// 	if (err) return;
		// 	// console.log('ready: ', req);
		// });


		// req.session.name = req.data
		// req.session.save(function() {
		// 	req.io.emit('hola')
		// });

	});

	// Send back the session data.
	app.io.route('send-feelings', function(req) {
		// console.log('socket feels something'.red);
		// req.session.feelings = req.data
		// req.session.save(function() {
		// 	req.io.emit('session', req.session)
		// });
	});

	// get stats
	app.io.route('get_server_stats', function (req) {
		
		api.socket.getServerStats(req);
	});

	// get stats
	app.io.route('user_event', function (req) {
		
		api.socket.userEvent(req);
	});

	// get stats
	app.io.route('tileset_meta', function (req) {
		
		api.geo.getTilesetMeta(req);
	});

	// get stats
	app.io.route('generate_tiles', function (req) {
		
		api.geo.generateTiles(req);
	});

	// helper function : if is logged in
	function checkAccess(req, next) {
		console.log('#103 checkAccess');
		console.log('netx:', next);
		api.token.authenticate_socket(req, next);
	}



};
