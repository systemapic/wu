// ROUTE: socket.routes.js 

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

// api
var api = require('../api/api');

// function exports
module.exports = function(app, passport) {

	app.io.route('ready', function (req) {

		if (!isLoggedIn(req)) return;

		// req.session.name = req.data
		// req.session.save(function() {
		// 	req.io.emit('get-feelings')
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

	// helper function : if is logged in
	function isLoggedIn(req, res, next) {
		if (req.session.passport) return true;
		return false;
	}


};
