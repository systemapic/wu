// API: api.js

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

// config
var config = require('../config/config.js');

// todo: remove
var superusers =  [
	'user-f151263a-8a2f-4bfd-86f0-53e71083fb39', 	// KO dev
	'user-5b51ff49-31f5-4a7a-b17c-d18268079d8f', 	//  J dev
	'user-9fed4b5f-ad48-479a-88c3-50f9ab44b17b', 	// KO rg
	'user-e6e5d7d9-3b4c-403b-ad80-a854b0215831',    //  J rg
	'user-5be55fcd-b8c2-4532-8932-c65e608a1f81', 	// ko m.s
	'user-d4d45439-72bc-4124-95a1-9104b482e50e', 	// j m.s
	'user-a15e2219-4ce2-4cf2-b741-eecfe5520f7d',  	// phantom @ maps.systemapic.com
	'user-f36e496e-e3e4-4fac-a37c-f1a98689afda'   	// dev1@noerd.biz
];

// add paths to config
config.path = {
	file 		: '/data/files/',
	image 		: '/data/images/',
	temp 		: '/data/tmp/',
	cartocss 	: '/data/cartocss/',
	tools 		: '../tools/',
	legends 	: '/data/legends/',
	geojson 	: '/data/geojson/'
}

// api
var api = {

	// global config
	config : config,

	// process wildcard paths, including hotlinks
	wildcard : function (req, res) {

		// get client/project
		var path = req.originalUrl.split('/'),
		    client = path[1],
		    project = path[2],
		    hotlink = {
			client : client,
			project : project
		};

		if (req.isAuthenticated()) {
			req.session.hotlink = hotlink;
			res.render('../../views/app.serve.ejs', {
				hotlink : hotlink || {},
			});
		} else {
			// redirect to login with hotlink embedded
			req.session.hotlink = hotlink;
			res.redirect('/login');
		}
	},

	logout : function (req, res) {
		req.logout();
		res.redirect('/');
	},

	login : function (req, res) {
		res.render('../../views/login.serve.ejs', { message: req.flash('loginMessage') });
	},

	signup : function (req, res) {
		return api.login(req, res); // debug
		res.render('../../views/signup.ejs', { message: req.flash('signupMessage') });
	},

	forgotPassword : function (req, res) {
		res.render('../../views/forgot.ejs', {message : ''});
	},

	getBase : function (req, res) {

		// return if not logged in 			
		if (!req.isAuthenticated()) return res.render('../../views/index.ejs'); 
		
		// render app html				
		res.render('../../views/app.serve.ejs', {
			hotlink : req.session.hotlink
		});

		// reset hotlink
		req.session.hotlink = {};
	},






























	// #########################################
	// ###  API: Get Portal                  ###
	// #########################################
	// served at initalization of Portal
	getPortal : function (req, res) {

		console.log('/api/portal');
		console.log('* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *'.yellow);
		console.log('* User: ' + req.user.firstName + ' ' + req.user.lastName);
		console.log('* User uuid: ' + req.user.uuid);
		console.log('* IP: ' + req._remoteAddress);
		console.log('* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *'.yellow);

		
		var json 	= {};
		var clients 	= [{}];
		var sources 	= [{}];
		var app 	= {};
		var hotlink 	= req.session.hotlink;
		var user        = req.user;

		// var for passing in async series
		var model = {};

		// build async query
		var a = {};

		// get projects
		a.projects = function (callback) { 
			api.project.getAll(callback, user);
		}

		// get clients
		a.clients = function (callback) {
			api.client.getAll(callback, user);
		}

		// get users
		a.users = function (callback) {
			api.user.getAll(callback, user);
		}

		async.series(a, function (err, result) {

			// add user
			result.account 	= user;

			// return result gzipped
			res.writeHead(200, {'Content-Type': 'application/json', 'Content-Encoding': 'gzip'});
			zlib.gzip(JSON.stringify(result), function (err, zipped) {
				res.end(zipped);
			});
		});


	},


	// _errorUnauthorized : function (req, res) {
	// 	var message = 'Unauthorized access attempt. Your IP ' + req._remoteAddress + ' has been logged.';
	// 	res.end(JSON.stringify({ error : message }));
	// },



	_debugCreateRole : function (req, res) {

		// create role
		api.permission._debugCreateRole(req, res);

	},





	addProjectToSuperadmins : function (projectUuid) {
		User.find({uuid : {$in : superusers}}, function (err, results) {
			results.forEach(function (user) {
				user.role.reader.projects.addToSet(projectUuid);
				user.role.editor.projects.addToSet(projectUuid);
				user.role.manager.projects.addToSet(projectUuid);
				user.markModified('role');
				user.save(function (err, res) {
					// console.log('addProjectToSuperadmins OK: ' + projectUuid);
				});
			});
		});
	},



	removeProjectFromSuperadmin : function (projectUuid) {
		User.find({uuid : {$in : superusers}}, function (err, results) {
			results.forEach(function (user) {
				user.role.reader.projects.pull(projectUuid);
				user.role.editor.projects.pull(projectUuid);
				user.role.manager.projects.pull(projectUuid);
				user.markModified('role');
				user.save(function (err, res) {
					console.log('removeProjectFromSuperadmin OK: ' + projectUuid);		
				});
			});
		});
	},


	// remove project from all users
	removeProjectFromEveryone : function (projectUuid) {

		User
		.find({ $or : [ { 'role.reader.projects'  : projectUuid }, 
		 		{ 'role.editor.projects'  : projectUuid }, 
		 		{ 'role.manager.projects' : projectUuid } ]
		 })
		.exec(function (err, users) {
			users.forEach(function (user) {
				user.role.reader.projects.pull(projectUuid);
				user.role.editor.projects.pull(projectUuid);
				user.role.manager.projects.pull(projectUuid);
				user.markModified('role');
				user.save(function (err, res) {
					console.log('removeProjectFromEveryone OK: ' + projectUuid);		
				});
			});
		})

	},

	


	removeClientFromSuperadmin : function (clientUuid) {
		User.find({uuid : {$in : superusers}}, function (err, results) {
			results.forEach(function (user) {
				user.role.reader.clients.pull(clientUuid);
				user.role.editor.clients.pull(clientUuid);
				user.role.manager.clients.pull(clientUuid);
				user.markModified('role');
				user.save(function (err, res) {
					console.log('removeClientFromSuperadmin OK: ' + clientUuid);		
				});
			});
		});
	},

	// remove project from all users
	removeClientFromEveryone : function (clientUuid) {

		User
		.find({ $or : [ { 'role.reader.clients'  : clientUuid }, 
		 		{ 'role.editor.clients'  : clientUuid }, 
		 		{ 'role.manager.clients' : clientUuid } ]
		 })
		.exec(function (err, users) {
			users.forEach(function (user) {
				user.role.reader.clients.pull(clientUuid);
				user.role.editor.clients.pull(clientUuid);
				user.role.manager.clients.pull(clientUuid);
				user.markModified('role');
				user.save(function (err, res) {
					console.log('removeclientsFromEveryone OK: ' + clientUuid);		
				});
			});
		})

	},
	

	
	addClientToSuperadmins : function (clientUuid) {
		User.find({uuid : {$in : superusers}}, function (err, results) {
			results.forEach(function (user) {
				user.role.reader.clients.addToSet(clientUuid);
				user.role.editor.clients.addToSet(clientUuid);
				user.role.manager.clients.addToSet(clientUuid);
				user.markModified('role');
				user.save(function (err, res) {
					console.log('addClientToSuperadmins OK: ' + clientUuid);		
				});
			});
		});
	},



	

	// #########################################
	// ###  API: Delegate User               ###
	// #########################################
	// add access to projects 
	delegateUser : function (req, res) {

		var user 	= req.user; 		      	// user that is giving access
		var userUuid 	= req.body.userUuid;      	// user that is getting access
		var role 	= req.body.role;  		// role that user is given
		var projectUuid = req.body.projectUuid;   	// project user is given role to
		var add         = req.body.add; 		// add or revoke, true/false
		// var clientUuid  = req.body.clientUuid;	// client that project belongs to

		console.log('delegateUser: ', req.body);

		// return if missing information
		if (!userUuid || !role || !projectUuid) return res.end(JSON.stringify({
			error : 'Error delegating accesss, missing information.'
		}));


		// get project
		Project
		.findOne({uuid : projectUuid})
		.exec(function (err, project) {
			// console.log('Project: ', project.name);

			if (err) return res.end(JSON.stringify({
				error : 'Error delegating accesss, missing information.'
			}));

			Clientel
			.findOne({uuid : project.client})
			.exec(function (err, client) {



				// get user
				User
				.findOne({uuid : userUuid})
				.exec(function (err, subject) {
					console.log('User: ', subject.firstName, subject.lastName);

					// add access
					if (add) {

						console.log('DELEGATING ' + role + ' access to project ' + project.name + ' for user ' + subject.firstName);
		
						// read access
						if (role == 'reader') {

							// check if user is allowed to delegate read access to project
							if (api.permission.to.delegate.reader(user, project)) {

								subject.role.reader.projects.addToSet(project.uuid);
								subject.role.reader.clients.addToSet(project.client); // make sure can read client
								subject.markModified('role');
								subject.save(function (err, result) {
									if (err) return res.end(JSON.stringify({ error : err }));
									var message = 'Success! read'
									return res.end(JSON.stringify({ result : message }));
								});

							} else {
								console.log('access denied: role: reader, user: ' + subject.firstName + ', project: ' + project.name);
								var message = 'Unauthorized access delegation attempt. Your IP ' + req._remoteAddress + ' has been logged.';
								return res.end(JSON.stringify({ error : message }));
							}


						}


						// edit access
						if (role == 'editor') {

							// check if user is allowed to delegate read access to project
							if (permission.to.delegate.editor(user, project)) {

								subject.role.editor.projects.addToSet(project.uuid);
								subject.role.reader.clients.addToSet(project.client); // make sure can read client
								subject.markModified('role');
								subject.save(function (err, result) {
									if (err) return res.end(JSON.stringify({ error : err }));
									var message = 'Success!'
									return res.end(JSON.stringify({ result : message }));
								});

							} else {
								console.log('access denied: role: editor, user: ' + subject.firstName + ', project: ' + project.name);
								var message = 'Unauthorized access delegation attempt. Your IP ' + req._remoteAddress + ' has been logged.';
								return res.end(JSON.stringify({ error : message }));
							}

						}

						// manager access
						if (role == 'manager') {

							// check if user is allowed to delegate read access to project
							if (api.permission.to.delegate.manager(user, project)) {

								subject.role.manager.projects.addToSet(project.uuid);
								subject.role.reader.clients.addToSet(project.client); // make sure can read client
								subject.markModified('role');
								subject.save(function (err, result) {
									if (err) return res.end(JSON.stringify({ error : err }));
									var message = 'Success manager!'
									return res.end(JSON.stringify({ result : message }));
								});

							} else {
								console.log('access denied: role: manager, user: ' + subject.firstName + ', project: ' + project.name);
								var message = 'Unauthorized access delegation attempt. Your IP ' + req._remoteAddress + ' has been logged.';
								return res.end(JSON.stringify({ error : message }));
							}


						}




					// revoke access
					} else {

						console.log('REVOKING ' + role + ' access to project ' + project.name + ' for user ' + subject.firstName);
						
						// revoke read access
						if (role == 'reader') {

							// check if user is allowed to delegate read access to project
							if (api.permission.to.delegate.reader(user, project)) {


								// revoke project
								subject.role.reader.projects.pull(project.uuid);

								// revoke client if emtpy
								api._revokeClientIfEmpty(user, project, subject, res);




							} else {
								console.log('access denied: role: reader, user: ' + subject.firstName + ', project: ' + project.name);
								var message = 'Unauthorized access delegation attempt. Your IP ' + req._remoteAddress + ' has been logged.';
								return res.end(JSON.stringify({ error : message }));
							}


						}


						// revoke edit access
						if (role == 'editor') {

							// check if user is allowed to delegate read access to project
							if (api.permission.to.delegate.editor(user, project)) {

								subject.role.editor.projects.pull(project.uuid);
								subject.markModified('role');
								subject.save(function (err, result) {
									if (err) return res.end(JSON.stringify({ error : err }));
									var message = 'Success!'
									return res.end(JSON.stringify({ result : message }));
								});

							} else {
								console.log('access denied: role: editor, user: ' + subject.firstName + ', project: ' + project.name);
								var message = 'Unauthorized access delegation attempt. Your IP ' + req._remoteAddress + ' has been logged.';
								return res.end(JSON.stringify({ error : message }));
							}


						}

						// revoke manager access
						if (role == 'manager') {

							// check if user is allowed to delegate read access to project
							if (api.permission.to.delegate.manager(user, project)) {

								subject.role.manager.projects.pull(project.uuid);
								subject.markModified('role');
								subject.save(function (err, result) {
									if (err) return res.end(JSON.stringify({ error : err }));
									var message = 'Success!';
									return res.end(JSON.stringify({ result : message }));
								});

							} else {
								console.log('access denied: role: manager, user: ' + subject.firstName + ', project: ' + project.name);
								var message = 'Unauthorized access delegation attempt. Your IP ' + req._remoteAddress + ' has been logged.';
								return res.end(JSON.stringify({ error : message }));
							}
						}
					}	
				});
			});
		});
	},




	_revokeClientIfEmpty : function (user, project, subject, res) {
		console.log('Checking if last active project for this client...');

		Project
		.find({client : project.client})
		.exec(function (err, projects) {
			
			// get list of projects left for user
			var userProjects = subject.role.reader.projects.toObject(),
			    clientProjects = [],
			    contains = false;

			// as array of uuids
			projects.forEach(function(p) {
				clientProjects.push(p.uuid);
			});

			// check if last 
			clientProjects.forEach(function (c) {
				if (userProjects.indexOf(c) > -1) contains = true;
			});

			// pull if last
			if (!contains) {
				console.log('last project, removing client');
				subject.role.reader.clients.pull(project.client);
			}

			// save
			subject.markModified('role');
			subject.save(function (err, result) {
				if (err) return res.end(JSON.stringify({ error : err }));
				var message = 'Success!'
				return res.end(JSON.stringify({ result : message }));
			});

		});

	},





		

}


// exports
module.exports = api;
module.exports.geo = require('./api.geo');
module.exports.file = require('./api.file');
module.exports.user = require('./api.user');
module.exports.layer = require('./api.layer');
module.exports.email = require('./api.email');
module.exports.error = require('./api.error');
module.exports.debug = require('./api.debug');
module.exports.upload = require('./api.upload');
module.exports.pixels = require('./api.pixels');
module.exports.client = require('./api.client');
module.exports.project = require('./api.project');
module.exports.provider = require('./api.provider');
module.exports.permission = require('./api.permission');
