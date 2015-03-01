// API: api.debug.js

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
module.exports = api.debug = { 


	// #########################################
	// ###  TODO! REMOVE REMOVE REMOVE!!!    ###
	// #########################################
	// #########################################
	// ###  TODO! REMOVE REMOVE REMOVE!!!    ###
	// #########################################
	// #########################################
	// ###  TODO! REMOVE REMOVE REMOVE!!!    ###
	// #########################################
	createRole : function (req, res) {

		// STOP!
		return res.end(JSON.stringify({error : 'Debug mode off!'}));



		// create a superadmin
		console.log('_debugCreateRole', req.body);

		var options = req.body,
		    template = options.template,
		    userUuid = options.userUuid || req.user.uuid,
		    ops = [];

		// create role
		api.access._createRole({
			template : template,
			members : [userUuid],
			capabilities : [],
			name : 'Superadmin'
		}, function (err, role) {

			console.log('created role: ', role);

			// return 
			res.end(JSON.stringify({
				role : role
			}));
		});
	},

}