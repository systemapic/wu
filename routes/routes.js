// app/routes/routes.js rsub

// database schemas
var Project = require('../models/project');
var Clientel = require('../models/client');	// weird name cause restricted name
var User  = require('../models/user');
var File = require('../models/file');
var Layers = require('../models/layer');

// file handling
var fs = require('fs-extra');
var fss = require("q-io/fs");
var utf8 = require("utf8");

// utils
var async = require('async');
var util = require('util');
var request = require('request');
var uuid = require('node-uuid');
var uploadProgress = require('node-upload-progress');
var _ = require('lodash-node');

// upload.js for handling uploading of shapefiles
var geo = require('../routes/upload');

// helper fn's
var api = require('../routes/helpers')

var crunch = require('../routes/crunch');


// function exports
module.exports = function(app, passport) {



	// ================================
	// HOME PAGE (with login links) ===
	// ================================
	app.get('/', function(req, res) {

		console.log('GET / ', req.session.hotlink);

		// return if not logged in 			redirect to login page
		if (!req.isAuthenticated()) return res.render('../../views/index.ejs'); // load the index.ejs file
		
		// render app html				// todo: hotlink
		res.render('../../views/app.ejs', {
			//json : json,
			hotlink : req.session.hotlink
		});

		// reset hotlink
		req.session.hotlink = {};
	});



	// =====================================
	// GET WHOLE SETUP FOR PORTAL ==========
	// =====================================
	// get data from store for user
	app.post('/api/portal', isLoggedIn, function (req, res) {
		console.log('/api/portal');

		// get user store for this user
		api.getPortal(req, res);

	});





	// =====================================
	// CREATE NEW PROJECT  =================
	// =====================================
	app.post('/api/project/new', isLoggedIn, function (req,res) {
		console.log('/api/project/new');

		// API: create new project
		api.createProject(req, res);

	});



	// =====================================
	// DELETE PROJECT   ====================
	// =====================================
	app.post('/api/project/delete', isLoggedIn, function (req, res) {
		console.log('/api/project/delete');

		// API: delete project
		api.deleteProject(req, res);

	});



	// =====================================
	// UPDATE PROJECT ======================
	// =====================================
	// update project
	app.post('/api/project/update', isLoggedIn, function (req,res) {
		console.log('/api/project/update');

		// API: update project
		api.updateProject(req, res);

	});



	// =====================================
	// UPLOAD PROJECT LOGO  ================
	// =====================================
	// upload new logo to project
	app.post('/api/project/uploadlogo', isLoggedIn, function (req,res) {
		console.log('/api/project/uploadlogo');

		
		// API: upload project logo
		api.uploadProjectLogo(req, res);

	});


	// =====================================
	// UPLOAD IMAGE ========================
	// =====================================
	// upload new logo to project
	app.post('/api/upload/image', isLoggedIn, function (req,res) {
		console.log('/api/upload/image');

		// API: upload project logo
		api.uploadImage(req, res);

	});


	
	


	// =====================================
	// SERVE STATIC FILES SECURELY  ========
	// =====================================
	// serve static files like images
	app.get('/images/*', isLoggedIn, function (req,res) {
		console.log('/images');

		
		// todo: more auth!

		var file = req.params[0];
		var path = '/var/www/data/images/' + file;
		
		res.sendfile(path, {maxAge : 10000000});	// cache age, 115 days.. cache not working?

	});


	// =====================================
	// SERVE STATIC FILES SECURELY  ========
	// =====================================
	// serve static files like images
	app.get('/pixels/*', isLoggedIn, function (req,res) {
		console.log('/pixels');

		crunch.servePixelPerfection(req, res);

	});




	// =====================================
	// NEW CLIENT   ========================
	// =====================================
	// set data to store
	app.post('/api/client/new', isLoggedIn, function (req,res) {
		console.log('/api/client/new');

		// create new client
		api.createClient(req, res);

	});



	// =====================================
	// CHECK IF UNIQUE CLIENT NAME   =======
	// =====================================
	app.post('/api/client/unique', isLoggedIn, function (req,res) {
		console.log('/api/client/unique');

		// find any client with this slug
		api.checkClientUnique(req, res);

	});



	// =====================================
	// DELETE CLIENT   =======
	// =====================================
	app.post('/api/client/delete', isLoggedIn, function (req,res) {
		console.log('/api/client/delete');

		// delete client
		api.deleteClient(req, res);
	});


	// =====================================
	// UPLOAD CLIENT LOGO  =================
	// =====================================
	// upload new logo to client
	app.post('/api/client/uploadlogo', isLoggedIn, function (req,res) {
		console.log('/api/client/uploadlogo');

		// API: upload client logo
		api.uploadClientLogo(req, res);

	});




	// =====================================
	// SET DATA API ========================
	// =====================================
	// save client
	app.post('/api/client/update', isLoggedIn, function (req,res) {
		console.log('/api/client/update');

		// update client
		api.updateClient(req, res);
	});




	// =====================================
	// UPLOAD DATA LIBRARY FILES ===========
	// =====================================
	// process uploads  					TODO: add isLoggedIn
	app.post('/api/upload', isLoggedIn, function (req, res) {
		console.log('/api/upload');

		// TODO : authentication
		

		// process upload
		geo.do(req, res);
		
	});


	
	// =====================================
	// GET MAPBOX ======================
	// =====================================
	// get mapboxdata from mapbox
	app.post('/api/util/getmapboxaccount', isLoggedIn, function (req, res) {
		console.log('/api/util/getmapboxaccount');

		// get mapbox account
		api.getMapboxAccount(req, res);

	});



	// =====================================
	// GET GEOJSON FILES ===================
	// =====================================
	// get data from store
	app.post('/api/geojson', isLoggedIn, function (req,res) {
		console.log('/api/geojson');

		// get and send geojson file
		api.getGeojsonFile(req, res);

	});


	
	// =====================================
	// GET FILE DOWNLOAD ===================
	// =====================================
	// download files on demand
	app.get('/api/file/download', isLoggedIn, function (req, res) {
		console.log('/api/file/download'); // req.query

		// get file for download
		api.getFileDownload(req, res);
		
	});



	// =====================================
	// REQUEST FILE DOWNLOAD ===============
	// =====================================
	// download files on demand
	app.post('/api/file/download', isLoggedIn, function (req,res) {
		console.log('/api/file/download');
		
		// zip all files
		api.zipAndSend(req, res);		// todo: access restrictions

	});


	
	// =====================================
	// UPDATE FILE ===================
	// =====================================
	// update data on file
	app.post('/api/file/update', isLoggedIn, function (req,res) {
		console.log('/api/file/update');

		// update file meta
		api.updateFile(req, res);

	});



	// =====================================
	// DELETE FILE(S) ===================
	// =====================================
	// delete array of files
	app.post('/api/file/delete', isLoggedIn, function (req,res) {
		console.log('/api/file/delete');

		// delete file(s)
		api.deleteFiles(req, res);
		
	});



	// =====================================
	// LAYERS ==============================
	// =====================================
	// get layers objects for project
	app.post('/api/layers', isLoggedIn, function (req, res) {
		console.log('/api/layers');

		// send layers to client
		api.getLayers(req, res);

	});


	// =====================================
	// UPDATE LAYERS =======================
	// =====================================
	// get layers objects for project
	app.post('/api/layer/update', isLoggedIn, function (req, res) {
		console.log('/api/layer/update');

		// update layer
		api.updateLayer(req, res);
	});



	// =====================================
	// UPDATE USER INFORMATION  ============
	// =====================================
	// download files on demand
	app.post('/api/user/update', isLoggedIn, function (req,res) {
		console.log('/api/user/update');
		
		// update user
		api.updateUser(req, res);

	});



	// =====================================
	// CREATE NEW USER =====================
	// =====================================
	// create a new user
	app.post('/api/user/new', isLoggedIn, function (req,res) {
		console.log('/api/user/new');
		
		// create new user
		api.createUser(req, res);
	
	});

	// =====================================
	// DELETE USER =========================
	// =====================================
	// create a new user
	app.post('/api/user/delete', isLoggedIn, function (req,res) {
		console.log('/api/user/delete');
		
		// create new user
		api.deleteUser(req, res);
	
	});

	// =====================================
	// DELETE USER =========================
	// =====================================
	// create a new user
	app.post('/api/user/delegate', isLoggedIn, function (req,res) {
		console.log('/api/user/delegate');
		
		// create new user
		api.delegateUser(req, res);
	
	});

	// =====================================
	// CHECK UNIQUE EMAIL ==================
	// =====================================
	// create a new user
	app.post('/api/user/unique', isLoggedIn, function (req,res) {
		console.log('/api/user/unique');
		
		// create new user
		api.checkUniqueEmail(req, res);
	
	});


	// =====================================
	// GET USERS FOR MANAGEMENT ============
	// =====================================
	// get all users that User can manage
	app.post('/api/user/management', isLoggedIn, function (req,res) {
		console.log('/api/user/management');
		
		// create new user
		api.getUserManagement(req, res);
	
	});



	app.post('/api/debug/test', isLoggedIn, function (req, res) {
		console.log('Debug Test Running...');

		// run debug test
		api.debugTest(req, res);

	});




	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', function(req, res) {
		console.log('/login');

		// render page and pass in flash data if applicable
		res.render('../../views/login.ejs', { message: req.flash('loginMessage') });
	});

	

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {
		console.log('/signup');

		// render the page and pass in any flash data if it exists
		res.render('../../views/signup.ejs', { message: req.flash('signupMessage') });

	});


	
	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		console.log('/logout');

		req.logout();
		res.redirect('/');
	});



	// =====================================
	// SIGNUP ==============================
	// =====================================
	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));



	// =====================================
	// LOGIN ===============================
	// =====================================
	// process the login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));



	app.post('/forgot', function (req, res) {

		// handle password reset
		api.forgotPassword(req, res);
	});



	// =====================================
	// WILDCARD PATHS ======================		// TODO, much problems here.. 
	// =====================================
	// process /client/project url structure
	app.get('*', function (req, res) {
		console.log('/*');

		// process wildcard path
		api.processWildcardPath(req, res);

	});



		


	// helper function : if is logged in
	function isLoggedIn(req, res, next) {
		if (req.isAuthenticated()) return next();
		res.redirect('/');
	}


}