// ROUTE: routes.js 

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

	api.app = app;

	// ================================
	// HOME PAGE (with login links) ===
	// ================================
	app.get('/', function(req, res) {
		api.portal.getBase(req, res);
	});


	// =====================================
	// GET WHOLE SETUP FOR PORTAL ==========
	// =====================================
	app.post('/api/portal', isLoggedIn, function (req, res) {
		api.portal.getPortal(req, res);
	});

	
	// =====================================
	// ERROR LOGGING =======================
	// =====================================
	app.post('/api/error/log', isLoggedIn, function (req, res) {
		api.error.clientLog(req, res);
	});


	// =====================================
	// ANALYTICS ===================
	// =====================================
	app.post('/api/analytics/set', isLoggedIn, function (req,res) {
		api.analytics.set(req, res);
	});

	// =====================================
	// ANALYTICS ===================
	// =====================================
	app.post('/api/analytics/get', isLoggedIn, function (req,res) {
		api.analytics.get(req, res);
	});

	// =====================================
	// GET NOTIFIED OF DONE GRINDS =========
	// =====================================
	app.post('/grind/done', function (req, res) {
		api.socket.grindDone(req, res);
	});



	// =====================================
	// RESUMABLE.js UPLOADS ================
	// =====================================
	// app.post('/api/chunked/upload', isLoggedIn, function (req, res) {
	// 	console.log('XXX POST /api/chunked/upload'.yellow, req.body);
	// 	// api.upload.chunkedUpload(req, res);
	// });

	// =====================================
	// RESUMABLE.js UPLOADS ================
	// =====================================
	app.get('/api/upload', isLoggedIn, function (req, res) {
		api.upload.chunkedCheck(req, res);
	});

	// =====================================
	// RESUMABLE.js UPLOADS ================
	// =====================================
	app.get('/download/:identifier', isLoggedIn, function (req, res) {
		api.upload.chunkedIdent(req, res);
	});

	// =====================================
	// UPLOAD DATA LIBRARY FILES ===========
	// =====================================
	app.post('/api/upload', isLoggedIn, function (req, res) {
		api.upload.chunkedUpload(req, res);
	});




	


	// =====================================
	// CREATE NEW PROJECT  =================
	// =====================================
	app.post('/api/project/new', isLoggedIn, function (req,res) {
		api.project.create(req, res);
	});


	// =====================================
	// DELETE PROJECT   ====================
	// =====================================
	app.post('/api/project/delete', isLoggedIn, function (req, res) {
		api.project.deleteProject(req, res);
	});


	// =====================================
	// UPDATE PROJECT ======================
	// =====================================
	app.post('/api/project/update', isLoggedIn, function (req,res) {
		api.project.update(req, res);
	});


	// =====================================
	// CHECK UNIQUE SLUG ===================
	// =====================================
	app.post('/api/project/unique', isLoggedIn, function (req,res) {
		api.project.checkUniqueSlug(req, res);
	});


	// =====================================
	// SET PROJECT HASH ====================
	// =====================================
	app.post('/api/project/hash/set', isLoggedIn, function (req,res) {
		api.project.setHash(req, res);
	});


	// =====================================
	// GET PROJECT HASH ====================
	// =====================================
	app.post('/api/project/hash/get', isLoggedIn, function (req,res) {
		api.project.getHash(req, res);
	});


	// =====================================
	// UPLOAD PROJECT LOGO  ================
	// =====================================
	app.post('/api/project/uploadlogo', isLoggedIn, function (req,res) {
		api.upload.projectLogo(req, res);
	});


	// =====================================
	// UPLOAD IMAGE ========================
	// =====================================
	app.post('/api/upload/image', isLoggedIn, function (req,res) {
		api.upload.image(req, res);
	});


	// =====================================
	// SERVE STATIC FILES SECURELY  ========
	// =====================================
	app.get('/images/*', isLoggedIn, function (req,res) {
		api.file.sendImage(req, res);
	});


	// =====================================
	// SERVE STATIC FILES SECURELY  ========
	// =====================================
	app.get('/pixels/fit/*', isLoggedIn, function (req,res) {
		api.pixels.serveFitPixelPerfection(req, res);
	});


	// =====================================
	// SERVE STATIC FILES SECURELY  ========
	// =====================================
	app.get('/pixels/image/*', isLoggedIn, function (req,res) {
		api.pixels.serveImagePixelPerfection(req, res);
	});


	// =====================================
	// SERVE STATIC FILES SECURELY  ========
	// =====================================
	app.get('/pixels/*', isLoggedIn, function (req,res) {
		api.pixels.servePixelPerfection(req, res);
	});


	// =====================================
	// CREATE NEW CLIENT ===================
	// =====================================
	app.post('/api/client/new', isLoggedIn, function (req,res) {
		api.client.create(req, res);
	});


	// =====================================
	// CHECK IF UNIQUE CLIENT NAME   =======
	// =====================================
	app.post('/api/client/unique', isLoggedIn, function (req,res) {
		api.client.checkUniqueSlug(req, res);
	});


	// =====================================
	// DELETE CLIENT =======================
	// =====================================
	app.post('/api/client/delete', isLoggedIn, function (req,res) {
		api.client.deleteClient(req, res);
	});


	// =====================================
	// UPLOAD CLIENT LOGO  =================
	// =====================================
	app.post('/api/client/uploadlogo', isLoggedIn, function (req,res) {
		api.upload.clientLogo(req, res);
	});


	// =====================================
	// UPDATE CLIENT =======================
	// =====================================
	app.post('/api/client/update', isLoggedIn, function (req,res) {
		api.client.update(req, res);
	});


	// // =====================================
	// // UPLOAD DATA LIBRARY FILES ===========
	// // =====================================
	// app.post('/api/upload', isLoggedIn, function (req, res) {
	// 	api.upload.file(req, res);
	// });

	
	// =====================================
	// GET MAPBOX ACCOUNT ==================
	// =====================================
	app.post('/api/util/getmapboxaccount', isLoggedIn, function (req, res) {
		api.provider.mapbox.getAccount(req, res);
	});

	
	// =====================================
	// CREATE SNAPSHOT =====================
	// =====================================
	// create snapshot of current map
	app.post('/api/util/snapshot', isLoggedIn, function (req, res) {
		api.pixels.createSnapshot(req, res);
	});


	// =====================================
	// CREATE THUMBNAIL ====================
	// =====================================
	app.post('/api/util/createThumb', isLoggedIn, function (req, res) {
		api.pixels.createThumb(req, res);
	});


	// =====================================
	// CREATE PDF SNAPSHOT =================
	// =====================================
	app.post('/api/util/pdfsnapshot', isLoggedIn, function (req, res) {
		api.pixels.createPDFSnapshot(req, res);
	});


	// =====================================
	// AUTO-CREATE LEGENDS =================
	// =====================================
	app.post('/api/layer/createlegends', isLoggedIn, function (req, res) {
		api.legend.create(req, res);
	});


	// =====================================
	// GET GEOJSON FILES ===================
	// =====================================
	app.post('/api/geojson', isLoggedIn, function (req,res) {
		api.file.getGeojsonFile(req, res);
	});

	
	// =====================================
	// GET FILE DOWNLOAD ===================
	// =====================================
	app.get('/api/file/download', isLoggedIn, function (req, res) {
		api.file.download(req, res);
	});


	// =====================================
	// REQUEST FILE DOWNLOAD (zip'n send) ==
	// =====================================
	app.post('/api/file/download', isLoggedIn, function (req,res) {
		api.file.zipAndSend(req, res);
	});

	
	// =====================================
	// UPDATE FILE ===================
	// =====================================
	app.post('/api/file/update', isLoggedIn, function (req,res) {
		api.file.update(req, res);
	});


	// =====================================
	// DELETE FILE(S) ===================
	// =====================================
	app.post('/api/file/delete', isLoggedIn, function (req,res) {
		api.file.deleteFiles(req, res);
	});


	// =====================================
	// DELETE LAYER(S) =====================
	// =====================================
	app.post('/api/layers/delete', isLoggedIn, function (req,res) {
		api.layer.deleteLayer(req, res);
	});


	// =====================================
	// LAYERS ==============================
	// =====================================
	app.post('/api/layers', isLoggedIn, function (req, res) { 	// todo: layer/layers !! make all same...
		api.layer.get(req, res);
	});


	// =====================================
	// CREATE NEW LAYER ====================
	// =====================================
	app.post('/api/layers/new', isLoggedIn, function (req, res) {
		api.layer.create(req, res);
	});


	// =====================================
	// NEW OSM LAYERS ======================
	// =====================================
	app.post('/api/layers/osm/new', isLoggedIn, function (req, res) {
		api.layer.createOSM(req, res);  	// todo: api.layer.osm.create()
	});


	// =====================================
	// UPDATE LAYERS =======================
	// =====================================
	app.post('/api/layer/update', isLoggedIn, function (req, res) {
		api.layer.update(req, res);
	});


	// =====================================
	// RELOAD LAYER METADATA ===============
	// =====================================
	app.post('/api/layer/reloadmeta', isLoggedIn, function (req, res) {
		api.layer.reloadMeta(req, res);
	});


	// =====================================
	// SET CARTOCSS ========================
	// =====================================
	app.post('/api/layers/cartocss/set', isLoggedIn, function (req, res) {
		api.layer.setCartoCSS(req, res);
	});


	// =====================================
	// GET CARTOCSS ========================
	// =====================================
	app.post('/api/layers/cartocss/get', isLoggedIn, function (req, res) {
		api.layer.getCartoCSS(req, res);
	});


	// =====================================
	// UPDATE USER INFORMATION  ============
	// =====================================
	app.post('/api/user/update', isLoggedIn, function (req,res) {
		api.user.update(req, res);
	});


	// =====================================
	// CREATE NEW USER =====================
	// =====================================
	app.post('/api/user/new', isLoggedIn, function (req,res) {
		api.user.create(req, res);
	});


	// =====================================
	// DELETE USER =========================
	// =====================================
	app.post('/api/user/delete', isLoggedIn, function (req,res) {
		api.user.deleteUser(req, res);
	});


	// =====================================
	// DELETE USER =========================
	// =====================================
	app.post('/api/user/delegate', isLoggedIn, function (req,res) {
		api.delegateUser(req, res);
	});


	// =====================================
	// CHECK UNIQUE USER/EMAIL =============
	// =====================================
	app.post('/api/user/unique', isLoggedIn, function (req,res) {
		api.user.checkUniqueEmail(req, res);
	});


	// =====================================
	// access: GET ROLE  ===============
	// =====================================
	app.post('/api/access/getrole', isLoggedIn, function (req,res) {
		api.access.getRole(req, res);
	});

	// =====================================
	// access: SET ROLE  ===============
	// =====================================
	app.post('/api/access/setrolemember', isLoggedIn, function (req,res) {
		api.access.setRoleMember(req, res);
	});

	// =====================================
	// access: SET ROLE SUPERADMIN =========
	// =====================================
	app.post('/api/access/super/setrolemember', isLoggedIn, function (req,res) {
		api.access.setSuperRoleMember(req, res);
	});

	// =====================================
	// access: SET ROLE  ===============
	// =====================================
	app.post('/api/access/portal/setrolemember', isLoggedIn, function (req,res) {
		api.access.setPortalRoleMember(req, res);
	});

	// =====================================
	// access: SET NO ROLE  ================
	// =====================================
	app.post('/api/access/setnorole', isLoggedIn, function (req,res) {
		api.access.setNoRole(req, res);
	});


	// =====================================
	// RESET PASSWORD ======================
	// =====================================
	app.post('/reset', function (req, res) {
		api.auth.requestPasswordReset(req, res);
	});


	// =====================================
	// RESET PASSWORD ======================
	// ===================================== 
	app.get('/reset', function (req, res) {
		api.auth.confirmPasswordReset(req, res);
	});


	// =====================================
	// SERVER CLIENT CONFIG ================
	// ===================================== 
	app.get('/clientConfig.js', isLoggedIn, function (req, res) {
		var configString = 'var systemapicConfigOptions = ' + JSON.stringify(api.clientConfig);
		res.setHeader("content-type", "application/javascript");
		res.end(configString);
	});

	// =====================================
	// SERVER LOGIN CONFIG =================
	// ===================================== 
	app.get('/loginConfig.js', function (req, res) {
		var configString = 'var loginConfig = ' + JSON.stringify(api.loginConfig);
		res.setHeader("content-type", "application/javascript");
		res.end(configString);
	});



	// // =====================================
	// // DEBUG: CREATE ROLE ==================
	// // ===================================== 
	// app.post('/api/debug/createRole', isLoggedIn, function (req, res) {
	// 	api.debug.createRole(req, res);
	// });

	// =====================================
	// DEBUG: PHANTOMJS FEEDBACK ===========
	// ===================================== 
	app.post('/api/debug/phantom', isLoggedIn, function (req, res) {
		res.end();
	});


	// =====================================
	// LOGIN ===============================
	// =====================================
	app.get('/login', function(req, res) {
		api.portal.login(req, res);
	});


	// =====================================
	// SIGNUP ==============================
	// =====================================
	app.get('/signup', function(req, res) {
		api.portal.signup(req, res);
	});


	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		api.portal.logout(req, res);
	});


	// =====================================
	// SIGNUP ==============================
	// =====================================
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));


	// =====================================
	// LOGIN ===============================
	// =====================================
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/', // redirect to the portal
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	
	// =====================================
	// FORGOT PASSWORD =====================
	// =====================================
	app.post('/forgot', function (req, res) {
		api.auth.forgotPassword(req, res);
	});


	// =====================================
	// WILDCARD PATHS ======================		
	// =====================================
	app.get('*', function (req, res) {
		api.portal.wildcard(req, res);
	});


	// helper function : if is logged in
	function isLoggedIn(req, res, next) {
		if (req.isAuthenticated()) return next();
		res.redirect('/');
	}

	
}