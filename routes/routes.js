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


	// ================================
	// OAUTH2: Post Token ==============
	// ================================
	app.post('/oauth/token', api.oauth2.getToken);
	

	// ================================
	// OAUTH2: Get Token ==============
	// ================================
	app.get('/api/token/check', passport.authenticate('bearer', {session: false}), function (req, res) {
		res.end('OK');
	});


	// ================================
	// OAUTH2: Debug token ============
	// ================================
	// this works!
	app.get('/api/userinfo', passport.authenticate('bearer', {session: false}), function(req, res) {
		res.json({user : req.user, user_id: req.user.id, name: req.user.firstName, scope: req.authInfo.scope});
	});
	app.post('/api/userinfo', passport.authenticate('bearer', {session: false}), function(req, res) {
		res.json({user : req.user, user_id: req.user.id, name: req.user.firstName, scope: req.authInfo.scope});
	});

	
	// =====================================
	// GET WHOLE SETUP FOR PORTAL ==========
	// =====================================
	app.post('/api/portal',  passport.authenticate('bearer', {session: false}), function (req, res) {
		api.portal.getPortal(req, res);
	});

	
	// =====================================
	// ERROR LOGGING =======================
	// =====================================
	app.post('/api/error/log', passport.authenticate('bearer', {session: false}), function (req, res) {
		api.error.clientLog(req, res);
	});


	// =====================================
	// ANALYTICS ===================
	// =====================================
	app.post('/api/analytics/set', passport.authenticate('bearer', {session: false}), function (req,res) {
		api.analytics.set(req, res);
	});

	// =====================================
	// ANALYTICS ===================
	// =====================================
	app.post('/api/analytics/get', passport.authenticate('bearer', {session: false}), function (req,res) {
		api.analytics.get(req, res);
	});

	// // =====================================
	// // GET NOTIFIED OF DONE GRINDS =========
	// // =====================================
	// app.post('/grind/done', function (req, res) {
	// 	api.socket.grindDone(req, res);
	// });

	// // =====================================
	// // GET NOTIFIED OF DONE GRINDS =========
	// // =====================================
	// app.post('/grind/raster/done', function (req, res) {
	// 	api.socket.grindRasterDone(req, res);
	// });


	// =====================================
	// RESUMABLE.js UPLOADS ================
	// =====================================
	app.get('/api/data/upload/chunked', passport.authenticate('bearer', {session: false}), function (req, res) {
		api.upload.chunkedCheck(req, res);
	});

	// =====================================
	// RESUMABLE.js UPLOADS ================
	// =====================================
	app.get('/download/:identifier', passport.authenticate('bearer', {session: false}), function (req, res) {
		api.upload.chunkedIdent(req, res);
	});

	// todo: this route is now DEAD; still alive in wu.js
	// =====================================
	// UPLOAD DATA LIBRARY FILES =========== // renamed route to /chunked
	// =====================================
	app.post('/api/data/upload/chunked', passport.authenticate('bearer', {session: false}), function (req, res) {
		api.upload.chunkedUpload(req, res);
	});
	

	// =====================================
	// CREATE NEW PROJECT  =================
	// =====================================
	app.post('/api/project/create', passport.authenticate('bearer', {session: false}), function (req,res) {
		api.project.create(req, res);
	});


	// =====================================
	// GET UPLOAD ==========================
	// =====================================
	app.get('/api/upload/get', passport.authenticate('bearer', {session: false}), function (req, res) {
		api.upload.getUpload(req, res);
	});


	// =====================================
	// IMPORT DATA to POSTGIS ==============
	// =====================================
	app.post('/api/import', passport.authenticate('bearer', {session: false}), function (req, res) {
		api.upload.import(req, res);
	});

	// =====================================
	// GET UPLOAD STATUS ===================
	// =====================================
	app.get('/api/import/status', passport.authenticate('bearer', {session: false}), function (req, res) {
		api.upload.getUploadStatus(req, res);
	});

	// =====================================
	// JOIN BETA MAIL ======================
	// =====================================
	app.get('/api/joinbeta', function (req, res) {
		api.portal.joinBeta(req, res);
	});


	// =====================================
	// DELETE PROJECT   ====================
	// =====================================
	app.post('/api/project/delete', passport.authenticate('bearer', {session: false}), function (req, res) {
		api.project.deleteProject(req, res);
	});


	// =====================================
	// UPDATE PROJECT ======================
	// =====================================
	app.post('/api/project/update', passport.authenticate('bearer', {session: false}), function (req,res) {
		api.project.update(req, res);
	});


	// =====================================
	// CHECK UNIQUE SLUG ===================
	// =====================================
	app.post('/api/project/unique', passport.authenticate('bearer', {session: false}), function (req,res) {
		api.project.checkUniqueSlug(req, res);
	});


	// =====================================
	// SET PROJECT HASH ====================
	// =====================================
	app.post('/api/project/hash/set', passport.authenticate('bearer', {session: false}), function (req,res) {
		api.project.setHash(req, res);
	});


	// =====================================
	// GET PROJECT HASH ====================
	// =====================================
	app.post('/api/project/hash/get', passport.authenticate('bearer', {session: false}), function (req,res) {
		api.project.getHash(req, res);
	});


	// =====================================
	// UPLOAD PROJECT LOGO  ================
	// =====================================
	app.post('/api/project/uploadlogo', passport.authenticate('bearer', {session: false}), function (req,res) {
		api.upload.projectLogo(req, res);
	});


	// =====================================
	// UPLOAD IMAGE ========================
	// =====================================
	app.post('/api/upload/image', passport.authenticate('bearer', {session: false}), function (req,res) {
		api.upload.image(req, res);
	});

	// todo: access_tokens for all images.. lots of code to update client side tho..

	// =====================================
	// SERVE STATIC FILES SECURELY  ========
	// =====================================
	app.get('/images/*', passport.authenticate('bearer', {session: false}), function (req,res) {
		api.file.sendImage(req, res);
	});


	// =====================================
	// SERVE STATIC FILES SECURELY  ========
	// =====================================
	app.get('/pixels/fit/*',passport.authenticate('bearer', {session: false}), function (req,res) {
		api.pixels.serveFitPixelPerfection(req, res);
	});


	// =====================================
	// SERVE STATIC FILES SECURELY  ========
	// =====================================
	app.get('/pixels/image/*', passport.authenticate('bearer', {session: false}), function (req,res) {
		api.pixels.serveImagePixelPerfection(req, res);
	});

	// =====================================
	// SERVE STATIC FILES SECURELY  ========
	// =====================================
	app.get('/pixels/screenshot/*', function (req,res) {
		api.pixels.serveScreenshot(req, res);
	});


	// =====================================
	// SERVE STATIC FILES SECURELY  ========
	// =====================================
	app.get('/pixels/*', passport.authenticate('bearer', {session: false}), function (req,res) {
		console.log('pixels!');
		api.pixels.servePixelPerfection(req, res);
	});


	// // =====================================
	// // CREATE NEW CLIENT ===================
	// // =====================================
	// app.post('/api/client/new', passport.authenticate('bearer', {session: false}), function (req,res) {
	// 	api.client.create(req, res);
	// });


	// // =====================================
	// // CHECK IF UNIQUE CLIENT NAME   =======
	// // =====================================
	// app.post('/api/client/unique', passport.authenticate('bearer', {session: false}), function (req,res) {
	// 	api.client.checkUniqueSlug(req, res);
	// });


	// // =====================================
	// // DELETE CLIENT =======================
	// // =====================================
	// app.post('/api/client/delete', passport.authenticate('bearer', {session: false}), function (req,res) {
	// 	api.client.deleteClient(req, res);
	// });


	// =====================================
	// UPLOAD CLIENT LOGO  =================
	// =====================================
	app.post('/api/client/uploadlogo', passport.authenticate('bearer', {session: false}), function (req,res) {
		api.upload.clientLogo(req, res);
	});


	// // =====================================
	// // UPDATE CLIENT =======================
	// // =====================================
	// app.post('/api/client/update', passport.authenticate('bearer', {session: false}), function (req,res) {
	// 	api.client.update(req, res);
	// });


	// =====================================
	// GET MAPBOX ACCOUNT ==================
	// =====================================
	app.post('/api/util/getmapboxaccount', passport.authenticate('bearer', {session: false}), function (req, res) {
		api.provider.mapbox.getAccount(req, res);
	});

	
	// =====================================
	// CREATE SNAPSHOT =====================
	// =====================================
	// create snapshot of current map
	app.post('/api/util/snapshot', passport.authenticate('bearer', {session: false}), function (req, res) {
		api.pixels.createSnapshot(req, res);
	});


	// =====================================
	// CREATE THUMBNAIL ====================
	// =====================================
	app.post('/api/util/createThumb', passport.authenticate('bearer', {session: false}), function (req, res) {
		api.pixels.createThumb(req, res);
	});


	// =====================================
	// CREATE PDF SNAPSHOT =================
	// =====================================
	app.post('/api/util/pdfsnapshot', passport.authenticate('bearer', {session: false}), function (req, res) {
		api.pixels.createPDFSnapshot(req, res);
	});



	// =====================================
	// AUTO-CREATE LEGENDS =================
	// =====================================
	app.post('/api/layer/createlegends', passport.authenticate('bearer', {session: false}), function (req, res) {
		api.legend.create(req, res);
	});


	// =====================================
	// GET GEOJSON FILES ===================
	// =====================================
	app.post('/api/geojson', passport.authenticate('bearer', {session: false}), function (req,res) {
		api.file.getGeojsonFile(req, res);
	});

	
	// =====================================
	// GET FILE DOWNLOAD ===================
	// =====================================
	app.get('/api/file/download', passport.authenticate('bearer', {session: false}), function (req, res) {
		api.file.download(req, res);
	});


	// =====================================
	// GET GEOJSON FILES ===================
	// =====================================
	app.post('/api/geo/json2carto', passport.authenticate('bearer', {session: false}), function (req,res) {
		api.geo.json2carto(req, res);
	});

	// =====================================
	// DOWNLOAD DATASET ====================
	// =====================================
	app.post('/api/file/downloadDataset', passport.authenticate('bearer', {session: false}), function (req,res) {
		api.postgis.downloadDatasetFromFile(req, res);
	});

	// =====================================
	// DOWNLOAD DATASET ====================
	// =====================================
	app.post('/api/layer/downloadDataset', passport.authenticate('bearer', {session: false}), function (req,res) {
		api.postgis.downloadDatasetFromLayer(req, res);
	});

	
	// =====================================
	// UPDATE FILE ===================
	// =====================================
	app.post('/api/file/update', passport.authenticate('bearer', {session: false}), function (req,res) {
		api.file.update(req, res);
	});

	// =====================================
	// GET LAYERS OF FILE ==================
	// =====================================
	app.post('/api/file/getLayers', passport.authenticate('bearer', {session: false}), function (req,res) {
		api.file.getLayers(req, res);
	});


	// =====================================
	// DELETE FILE(S) ===================
	// =====================================
	app.post('/api/file/delete', passport.authenticate('bearer', {session: false}), function (req,res) {
		api.file.deleteFile(req, res);
	});


	// =====================================
	// ADD/LINK FILE TO NEW PROJECT ========
	// =====================================
	app.post('/api/file/addtoproject', passport.authenticate('bearer', {session: false}), function (req,res) {
		api.file.addFileToProject(req, res);
	});


	// =====================================
	// DELETE LAYER(S) =====================
	// =====================================
	app.post('/api/layers/delete', passport.authenticate('bearer', {session: false}), function (req,res) {
		api.layer.deleteLayer(req, res);
	});


	// =====================================
	// LAYERS ==============================
	// =====================================
	app.post('/api/layers', passport.authenticate('bearer', {session: false}), function (req, res) { 	// todo: layer/layers !! make all same...
		api.layer.get(req, res);
	});


	// =====================================
	// CREATE NEW LAYER ====================
	// =====================================
	app.post('/api/layers/new', passport.authenticate('bearer', {session: false}), function (req, res) {
		console.log('/api/layers/new');
		api.layer.create(req, res);
	});


	// =====================================
	// NEW OSM LAYERS ======================
	// =====================================
	app.post('/api/layers/osm/new', passport.authenticate('bearer', {session: false}), function (req, res) {
		api.layer.createOSM(req, res);  	// todo: api.layer.osm.create()
	});


	// =====================================
	// UPDATE LAYERS =======================
	// =====================================
	app.post('/api/layer/update', passport.authenticate('bearer', {session: false}), function (req, res) {
		api.layer.update(req, res);
	});


	// =====================================
	// RELOAD LAYER METADATA ===============
	// =====================================
	app.post('/api/layer/reloadmeta', passport.authenticate('bearer', {session: false}), function (req, res) {
		api.layer.reloadMeta(req, res);
	});


	// =====================================
	// SET CARTOCSS ========================
	// =====================================
	app.post('/api/layers/cartocss/set', passport.authenticate('bearer', {session: false}), function (req, res) {
		api.layer.setCartoCSS(req, res);
	});


	// =====================================
	// GET CARTOCSS ========================
	// =====================================
	app.post('/api/layers/cartocss/get', passport.authenticate('bearer', {session: false}), function (req, res) {
		api.layer.getCartoCSS(req, res);
	});


	// =====================================
	// UPDATE USER INFORMATION  ============
	// =====================================
	app.post('/api/user/update', passport.authenticate('bearer', {session: false}), function (req,res) {
		api.user.update(req, res);
	});


	// =====================================
	// CREATE NEW USER =====================
	// =====================================
	app.post('/api/user/new', passport.authenticate('bearer', {session: false}), function (req,res) { // todo: remove /new route
		api.user.create(req, res);
	});
	app.post('/api/user/create', passport.authenticate('bearer', {session: false}), function (req,res) {
		api.user.create(req, res);
	});


	// =====================================
	// DELETE USER =========================
	// =====================================
	app.post('/api/user/delete', passport.authenticate('bearer', {session: false}), function (req,res) {
		api.user.deleteUser(req, res);
	});


	// =====================================
	// DELETE USER =========================
	// =====================================
	app.post('/api/user/delegate', passport.authenticate('bearer', {session: false}), function (req,res) {
		api.delegateUser(req, res);
	});


	// =====================================
	// CHECK UNIQUE USER/EMAIL =============
	// =====================================
	app.post('/api/user/unique', passport.authenticate('bearer', {session: false}), function (req,res) {
		api.user.checkUniqueEmail(req, res);
	});

	// =====================================
	// CHECK UNIQUE USER/EMAIL =============
	// =====================================
	app.post('/api/user/invite', passport.authenticate('bearer', {session: false}), function (req,res) {
		api.user.invite(req, res);
	});


	// =====================================
	// CHECK UNIQUE USER/EMAIL =============
	// =====================================
	app.post('/api/invite/link', passport.authenticate('bearer', {session: false}), function (req,res) {
		api.user.getInviteLink(req, res);
	});


	// =====================================
	// access: SET PROJECT ACCESS  =========
	// =====================================
	app.post('/api/access/set/project', passport.authenticate('bearer', {session: false}), function (req,res) {
		api.access.setProject(req, res);
	});

	// =====================================
	// access: GET ROLE  ===============
	// =====================================
	app.post('/api/access/getrole', passport.authenticate('bearer', {session: false}), function (req,res) {
		api.access.getRole(req, res);
	});

	// =====================================
	// access: SET ROLE  ===============
	// =====================================
	app.post('/api/access/setrolemember', passport.authenticate('bearer', {session: false}), function (req,res) {
		api.access.setRoleMember(req, res);
	});

	// =====================================
	// access: SET ROLE SUPERADMIN =========
	// =====================================
	app.post('/api/access/super/setrolemember', passport.authenticate('bearer', {session: false}), function (req,res) {
		api.access.setSuperRoleMember(req, res);
	});

	// =====================================
	// access: SET ROLE  ===============
	// =====================================
	app.post('/api/access/portal/setrolemember', passport.authenticate('bearer', {session: false}), function (req,res) {
		api.access.setPortalRoleMember(req, res);
	});

	// =====================================
	// access: SET NO ROLE  ================
	// =====================================
	app.post('/api/access/setnorole', passport.authenticate('bearer', {session: false}), function (req,res) {
		api.access.setNoRole(req, res);
	});

	// =====================================
	// CHECK RESET PASSWORD TOKEN ==========
	// =====================================
	app.post('/reset/checktoken', function (req, res) {
		api.auth.checkResetToken(req, res);
	});

	// =====================================
	// RESET PASSWORD ======================
	// =====================================
	app.post('/reset', function (req, res) {
		api.auth.requestPasswordReset(req, res);
	});


	// =====================================
	// CREATE PASSWORD =====================
	// ===================================== 
	app.post('/reset/password', function (req, res) {
		console.log('reset pas!');
		api.auth.createPassword(req, res);
	});

	// =====================================
	// ZXCVBN DICTIONARY =================
	// ===================================== 
	app.get('/zxcvbn.js', function (req, res) {
		fs.readFile('../public/js/lib/zxcvbn/zxcvbn.js', function (err, data) {
			res.send(data);
		});
	});

	// ===================================== // todo: rename route to /api/clientConfig.js
	// SERVER CLIENT CONFIG ================
	// ===================================== 
	app.get('/clientConfig.js', isLoggedIn, function (req, res) {
		var configString = 'var systemapicConfigOptions = ' + JSON.stringify(api.clientConfig);
		res.setHeader("content-type", "application/javascript");
		res.end(configString);
	});

	// ===================================== // todo: rename route to /api/loginConfig.js
	// SERVER LOGIN CONFIG =================
	// ===================================== 
	app.get('/loginConfig.js', function (req, res) {
		var configString = 'var loginConfig = ' + JSON.stringify(api.loginConfig);
		res.setHeader("content-type", "application/javascript");
		res.end(configString);
	});


	// =====================================
	// DEBUG: PHANTOMJS FEEDBACK ===========
	// ===================================== 
	app.post('/api/debug/phantom', passport.authenticate('bearer', {session: false}), function (req, res) {
		res.end();
	});


	// =====================================
	// LOGIN ===============================
	// =====================================
	app.get('/login', function(req, res) {
		api.portal.login(req, res);
	});


	// // =====================================
	// // SIGNUP ==============================
	// // =====================================
	// app.get('/signup', function(req, res) {
	// 	api.portal.signup(req, res);
	// });


	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		api.portal.logout(req, res);
	});


	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/invite/*', function(req, res) {
		console.log('/invite/*');
		api.portal.invite(req, res);
	});


	// // =====================================
	// // SIGNUP ==============================
	// // =====================================
	// app.post('/signup', passport.authenticate('local-signup', {
	// 	successRedirect : '/', // redirect to the secure profile section
	// 	failureRedirect : '/signup', // redirect back to the signup page if there is an error
	// 	failureFlash : true // allow flash messages
	// }));


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
	// FORGOT PASSWORD =====================
	// =====================================
	app.post('/register', passport.authenticate('local-signup', {
		successRedirect : '/', // redirect to the secure profile section
		failureRedirect : '/invite', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));


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

	function internalAccess(req, res, next) {
		var token = req.query.token || req.body.token;
		if (token == 'thisissecret') return next();
		res.end(JSON.stringify({
			error : 'No access.'
		}))
	}

	
}