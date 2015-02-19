// API: api.client.js

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
console.log('CLIENT === api=>', api);

// exports
module.exports = api.client = { 


	// #########################################
	// ###  API: Create Client               ###
	// #########################################
	create : function (req, res) {

		// set vars
		var user = req.user;
		var json = req.body;

		// return if not authorized
		if (!api.permission.to.create.client( user )) {
			var message = 'Unauthorized access attempt. Your IP ' + req._remoteAddress + ' has been logged.';
			return res.end(JSON.stringify({ error : message }));
		};

		// create new client
		var client 		= new Clientel();
		client.uuid 		= 'client-' + uuid.v4();
		client.createdBy 	= user.uuid;
		client.slug 		= json.name.replace(/\s+/g, '').toLowerCase();	// TODO: check if unique?
		client.name 		= json.name;
		client.description 	= json.description;
		client.keywords 	= json.keywords;

		// save new client
		client.save(function(err) {
			if (err) return res.end(JSON.stringify({
				error : 'Error creating client.'
			}));
			
			// add to superadmins
			api.addClientToSuperadmins(client.uuid);

			// saved ok
			res.end(JSON.stringify(client));
		});
	},

	// #########################################
	// ###  API: Delete Client               ###
	// #########################################
	deleteClient : function (req, res) {
		var clientUuid = req.body.cid;
		var userUuid = req.user.uuid;
		var user = req.user;


		// find client
		var model = Clientel.findOne({ uuid : clientUuid });
		model.exec(function (err, client) {
			
			// return error
			if (err) return res.end(JSON.stringify({ error : 'Error retrieving client.' }));
			
			// return if not authorized
			if (!api.permission.to.remove.client(user, client)) {
				var message = 'Unauthorized access attempt. Your IP ' + req._remoteAddress + ' has been logged.';
				return res.end(JSON.stringify({ error : message }));
			};

			// remove client		
			model.remove(function(err, result) { 
				if (err) return res.end(JSON.stringify({
					error : 'Error removing client.'
				}));

				console.log('Removed client ', client.name);

				// remove from superadmins
				api.removeClientFromEveryone(client.uuid);

				// return
				res.end(JSON.stringify(result)); 
			});
		});
	},

	// #########################################
	// ###  API: Update Client               ###
	// #########################################
	update : function (req, res) {

		var clientUuid 	= req.body.uuid;
		var userid 	= req.user.uuid;
		var user        = req.user;
		var queries 	= {};
		
		// find client
		var model = Clientel.findOne({ uuid : clientUuid });
		model.exec(function (err, client) {
			
			// return error
			if (err) return res.end(JSON.stringify({ error : 'Error retrieving client.' }));
			
			// return if not authorized
			if (!api.permission.to.update.client(user, client)) {
				var message = 'Unauthorized access attempt. Your IP ' + req._remoteAddress + ' has been logged.';
				return res.end(JSON.stringify({ error : message }));
			};


			// add projects to client
			if (isObject(req.body.projects)) {
				queries.projects = function(callback) {
					return Clientel.findOne({ uuid : clientUuid }, function (err, client){
						client.projects = req.body.projects;
						client.save(function(err) {
							if (err) return res.end(JSON.stringify({
								error : 'Error updating client.'
							}));
						});
						return callback(err);
					});
				}
			}

			// update name
			if (req.body.name) {
				queries.name = function(callback) {
					return Clientel.findOne({ uuid : clientUuid }, function (err, client){
						client.name = req.body.name;
						client.save(function(err) {
							if (err) return res.end(JSON.stringify({
								error : 'Error updating client.'
							}));
						});
						return callback(err);
					});
				}
			}

			// update description
			if (req.body.description) {
				queries.description = function(callback) {
					return Clientel.findOne({ uuid : clientUuid }, function (err, client){
						client.description = req.body.description;
						client.save(function(err) {
							if (err) return res.end(JSON.stringify({
								error : 'Error updating client.'
							}));
						});
						return callback(err);
					});
				}
			}

			// update description
			if (req.body.logo) {
				queries.logo = function(callback) {
					return Clientel.findOne({ uuid : clientUuid }, function (err, client){
						client.logo = req.body.logo;
						client.save(function(err) {
							if (err) return res.end(JSON.stringify({
								error : 'Error updating client.'
							}));
						});
						return callback(err);
					});
				}
			}

			async.series(queries, function(err, doc) {
				if (err) return res.end(JSON.stringify({
					error : 'Error updating client.'
				}));		

				// return
				res.end(JSON.stringify(doc));
			});
		});
	},



	// check if slug is unique
	checkUniqueSlug : function (req, res) {
		Clientel.find({ 'slug' : req.body.slug}, function(err, result) { 
			if (result.length == 0) return res.end('{"unique" : true }'); 	// unique
			return res.end('{"unique" : false }');				// not unique
		});
	},



	getAll : function (callback, user) {

		// async queries
		var a = {};



		// is superadmin, get all projects
		if (api.permission.superadmin(user)) {
			a.superadminClients = function (cb) {
				Clientel
				.find()
				.exec(function(err, result) { 
					cb(err, result); 
				});
			}
		}
		
		// get all projects created by user
		a.createdBy = function (cb) {
			Clientel
			.find({createdBy : user.uuid})
			.exec(function(err, result) { 
				cb(err, result); 
			});
		}

		// get all projects that user is editor for
		a.editor = function (cb) {
			Clientel
			.find({ uuid : { $in : user.role.editor.clients } })
			.exec(function(err, result) { 
				cb(err, result); 
			});
		}

		// get all projects user is reader for
		a.reader = function (cb) {
			Clientel
			.find({ uuid : { $in : user.role.reader.clients } })
			.exec(function(err, result) { 
				cb(err, result); 
			});
		}


		// do async 
		async.parallel(a, function (err, result) {
			
			// return error
			if (err) return callback(err);

			// flatten into one array
			var array = [];
			for (r in result) {
				array.push(result[r]);
			}

			
			// flatten
			var flat = _.flatten(array)

			// remove duplicates
			var unique = _.unique(flat, 'uuid');

			callback(err, unique);
		});
		
		

	},



}

// helper function 
function isObject(obj) {
	return (Object.prototype.toString.call(obj) === '[object Object]' || Object.prototype.toString.call(obj) === '[object Array]');
}