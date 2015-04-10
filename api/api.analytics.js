// API: api.analytics.js

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
var ua 		= require('universal-analytics');
var uploadProgress = require('node-upload-progress');
var mapnikOmnivore = require('mapnik-omnivore');


// api
var api = module.parent.exports;

// exports
module.exports = api.analytics = { 

	set : function (req, res) {
		var options = req.body;
		// called from routes.js:64, /api/analytics/set

		if (!options) return api.error.missingInformation(req, res);

		// node module: https://www.npmjs.com/package/universal-analytics

		// return to client
		res.end(JSON.stringify({
			result : 'lol',
			error : false
		}));

	},


	get : function (req, res) {
		var options = req.body;
		// called from routes.js:64, /api/analytics/get

		if (!options) return api.error.missingInformation(req, res);

		// return to client
		res.end(JSON.stringify({
			result : 'lol',
			error : false
		}));
	},

}

