// ROUTE: routes.js 

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

// api
var api = require('../api/api');

// function exports
module.exports = function(app, passport) {

	// link
	api.app = app;


	/**
	* @apiDefine token
	* @apiParam {String} access_token A valid access token
	* @apiError Unauthorized The <code>access_token</code> is invalid. (403)
	*/

	
	
	// =====================================
	// GET PORTAL  =========================
	// =====================================
	/**
	* @api {post} /api/portal Get portal store
	* @apiName getPortal
	* @apiGroup User
	* @apiUse token
	*
	* @apiSuccess {object} Projects Projects that user have access to
	* @apiSuccess {object} Datasets Datasets that user owns or have access to
	* @apiSuccess {object} Contacts Contacts that user has in contact list
	*/
	app.post('/api/portal', passport.authenticate('bearer', {session: false}), api.portal.getPortal);



	// =====================================
	// CREATE NEW PROJECT  =================
	// =====================================
	/**
	* @api {post} /api/project/create Create a project
	* @apiName create
	* @apiGroup Project
	* @apiUse token
	* @apiParam {String} name Name of project
	*
	* @apiSuccess {JSON} Project JSON object of the newly created project
	*/
	app.post('/api/project/create', passport.authenticate('bearer', {session: false}), api.project.create);



	// =====================================
	// DELETE PROJECT   ====================
	// =====================================
	/**
	* @api {post} /api/project/delete Delete a project
	* @apiName delete
	* @apiGroup Project
	* @apiUse token
	* @apiParam {String} projectUuid Uuid of project
	*
	* @apiSuccess {String} project ID of deleted project
	* @apiSuccess {Boolean} deleted True if successful
	* @apiSuccessExample {json} Success-Response:
	*     {
	*       "project": "project-o121l2m-12d12dlk-addasml",
	*       "deleted": true
	*     }
	*/
	app.post('/api/project/delete', passport.authenticate('bearer', {session: false}), api.project.deleteProject);



	// =====================================
	// GET STATUS   ====================
	// =====================================
	/**
	* @api {get} /api/status Get portal status
	* @apiName status
	* @apiGroup Admin
	* @apiUse token
	*
	* @apiSuccess {json} status Status of portal, versions etc.
	* @apiSuccessExample {json} Success-Response:
	* {
	*   "status": {
	*     "versions": {
	*       "systemapic_api": "1.3.5",
	*       "postgis": "POSTGIS=2.1.7 r13414 GEOS=3.4.2-CAPI-1.8.2 r3921 PROJ=Rel. 4.8.0, 6 March 2012 GDAL=GDAL 1.10.1, released 2013/08/26 LIBXML=2.9.1 LIBJSON=UNKNOWN TOPOLOGY RASTER",
	*       "postgres": "PostgreSQL 9.3.9 on x86_64-unknown-linux-gnu, compiled by gcc (Ubuntu 4.8.2-19ubuntu1) 4.8.2, 64-bit",
	*       "mongodb": "3.2.1",
	*       "redis": "3.0.6"
	*     }
	*   }
	* }
	*/
	app.get('/api/status', passport.authenticate('bearer', {session: false}), api.portal.status);

	


	// ================================
	// HOME PAGE (with login links) ===
	// ================================
	app.get('/', function(req, res) {
		api.portal.getBase(req, res);
	});

	// ================================
	// OAUTH2: Post Token ==============
	// ================================
	// =====================================
	// GET STATUS   ====================
	// =====================================
	/**
	* @api {post} /oauth/token Get access token
	* @apiName access_token
	* @apiGroup User
	* @apiHeader {String} Authorization="Basic YWJjMTIzOnNzaC1zZWNyZXQ="
	* @apiParam {String} username Email
	* @apiParam {String} password Password
	* @apiParam {String} grant_type=password
	*
	* @apiSuccess {json} status Access token JSON
	* @apiSuccessExample {json} Success-Response:
	* {
	*	"access_token":"AMduTdFBlXcBc1PKS5Ot4MZzwGjPhKw3y2LzJwJ0CGz0lpRGhK5xHGMcGLqvrOfY1aBR4M9Y4O126WRr5YSQGNZoLPbN0EXMwlRD0ajCqsd4MRr55UpfVYAfrLRL9i0tuglrtGYVs2iT8bl75ZVfYnbDl4Vjp4ElQoWqf6XdqMsIr25XxO5cZB9NRRl3mxA8gWRzCd5bvgZFZTWa6Htx5ugRqwWiudc8lbWNDCx85ms1up94HLKrQXoGMC8FVgf4",
	*	"expires_in":"36000",
	*	"token_type":"Bearer"
	* }
	*/
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
	// ERROR LOGGING =======================
	// =====================================
	app.post('/api/error/log', passport.authenticate('bearer', {session: false}), api.error.clientLog);

	// =====================================
	// ANALYTICS ===================
	// =====================================
	app.post('/api/analytics/set', passport.authenticate('bearer', {session: false}), api.analytics.set);

	// =====================================
	// ANALYTICS ===================
	// =====================================
	app.post('/api/analytics/get', passport.authenticate('bearer', {session: false}), api.analytics.get);

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

	// todo: this route is now DEAD; still alive in wu.js (?? still true?)
	// =====================================
	// UPLOAD DATA LIBRARY FILES =========== // renamed route to /chunked (still true??)
	// =====================================
	app.post('/api/data/upload/chunked', passport.authenticate('bearer', {session: false}), api.upload.chunkedUpload);


	// =====================================
	// SET ACCESS / deprecated =============
	// =====================================
	app.post('/api/project/setAccess', passport.authenticate('bearer', {session: false}), function (req,res) {
		api.project.setAccess(req, res);
	});

	// =====================================
	// CREATE NEW PROJECT  =================
	// =====================================
	// change route to /api/project/invite
	app.post('/api/project/addInvites', passport.authenticate('bearer', {session: false}), function (req,res) {
		api.project.addInvites(req, res);
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
	// change to /api/import/data
	app.post('/api/import', passport.authenticate('bearer', {session: false}), function (req, res) {
		api.upload.upload(req, res);
	});

	// =====================================
	// GET UPLOAD STATUS ===================
	// =====================================
	// change to /api/import/status
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
	// change to /api/project/setHash
	app.post('/api/project/hash/set', passport.authenticate('bearer', {session: false}), function (req,res) {
		api.project.setHash(req, res);
	});

	// =====================================
	// GET PROJECT HASH ====================
	// =====================================
	// change to /api/project/getHash
	app.post('/api/project/hash/get', passport.authenticate('bearer', {session: false}), function (req,res) {
		api.project.getHash(req, res);
	});

	// =====================================
	// UPLOAD PROJECT LOGO  ================
	// =====================================
	// change to /api/project/setLogo
	app.post('/api/project/uploadlogo', passport.authenticate('bearer', {session: false}), function (req,res) {
		api.upload.projectLogo(req, res);
	});

	// =====================================
	// UPLOAD IMAGE ========================
	// =====================================
	// change to /api/import/image
	app.post('/api/upload/image', passport.authenticate('bearer', {session: false}), function (req,res) {
		api.upload.image(req, res);
	});

	// =====================================
	// SERVE STATIC FILES SECURELY  ========
	// =====================================
	// special route, don't touch for now
	app.get('/images/*', passport.authenticate('bearer', {session: false}), function (req,res) {
		api.file.sendImage(req, res);
	});

	// =====================================
	// SERVE STATIC FILES SECURELY  ========
	// =====================================
	// change to /api/... 
	// special route, don't touch for now
	app.get('/pixels/fit/*',passport.authenticate('bearer', {session: false}), function (req,res) {
		api.pixels.serveFitPixelPerfection(req, res);
	});

	// =====================================
	// SERVE STATIC FILES SECURELY  ========
	// =====================================
	// change to /api/... 
	app.get('/pixels/image/*', passport.authenticate('bearer', {session: false}), function (req,res) {
		api.pixels.serveImagePixelPerfection(req, res);
	});

	// =====================================
	// SERVE STATIC FILES SECURELY  ========
	// =====================================
	// change to /api/... 
	app.get('/pixels/screenshot/*', function (req,res) {
		api.pixels.serveScreenshot(req, res);
	});

	// =====================================
	// SERVE STATIC FILES SECURELY  ========
	// =====================================
	// change to /api/... 
	app.get('/pixels/*', passport.authenticate('bearer', {session: false}), function (req,res) {
		api.pixels.servePixelPerfection(req, res);
	});

	// // =====================================
	// // UPLOAD CLIENT LOGO  =================
	// // =====================================
	// app.post('/api/client/uploadlogo', passport.authenticate('bearer', {session: false}), function (req,res) {
	// 	api.upload.clientLogo(req, res);
	// });

	// =====================================
	// GET MAPBOX ACCOUNT ==================
	// =====================================
	// change to /api/tools/mapbox/get
	app.post('/api/util/getmapboxaccount', passport.authenticate('bearer', {session: false}), function (req, res) {
		api.provider.mapbox.getAccount(req, res);
	});
	
	// =====================================
	// CREATE SNAPSHOT =====================
	// =====================================
	// create snapshot of current map
	// change to /api/tools/snap/create
	app.post('/api/util/snapshot', passport.authenticate('bearer', {session: false}), function (req, res) {
		api.pixels.createSnapshot(req, res);
	});

	// =====================================
	// CREATE THUMBNAIL ====================
	// =====================================
	// change to /api/tools/thumb/create
	app.post('/api/util/createThumb', passport.authenticate('bearer', {session: false}), function (req, res) {
		api.pixels.createThumb(req, res);
	});

	// =====================================
	// CREATE PDF SNAPSHOT =================
	// =====================================
	// change to /api/tools/pdf/create
	app.post('/api/util/pdfsnapshot', passport.authenticate('bearer', {session: false}), function (req, res) {
		api.pixels.createPDFSnapshot(req, res);
	});

	// =====================================
	// AUTO-CREATE LEGENDS =================
	// =====================================
	// change to /api/layer/legends/create
	app.post('/api/layer/createlegends', passport.authenticate('bearer', {session: false}), function (req, res) {
		api.legend.create(req, res);
	});

	// =====================================
	// GET GEOJSON FILES ===================
	// =====================================
	// change to /api/data/get ... todo: perhaps improve this, put all downloads together, with type/format in query/form.. todo later
	app.post('/api/geojson', passport.authenticate('bearer', {session: false}), function (req,res) {
		api.file.getGeojsonFile(req, res);
	});
	
	// =====================================
	// GET FILE DOWNLOAD ===================
	// =====================================
	// change to /api/data/download
	app.get('/api/file/download', passport.authenticate('bearer', {session: false}), function (req, res) {
		api.file.download(req, res);
	});

	// =====================================
	// GET FILE DOWNLOAD ===================
	// =====================================
	// change to /api/tools/tilecount
	app.get('/api/util/getTilecount', passport.authenticate('bearer', {session: false}), function (req, res) {
		api.geo.getTilecount(req, res);
	});

	// =====================================
	// GET GEOJSON FILES ===================
	// =====================================
	// change to /api/tools/json2carto
	app.post('/api/geo/json2carto', passport.authenticate('bearer', {session: false}), function (req,res) {
		api.geo.json2carto(req, res);
	});

	// =====================================
	// DOWNLOAD DATASET ====================
	// =====================================
	// change to /api/data/download (POST/GET routes with same name no problem)
	app.post('/api/file/downloadDataset', passport.authenticate('bearer', {session: false}), function (req,res) {
		api.postgis.downloadDatasetFromFile(req, res);
	});

	// =====================================
	// DOWNLOAD DATASET ====================
	// =====================================
	// change to /api/layer/download
	app.post('/api/layer/downloadDataset', passport.authenticate('bearer', {session: false}), function (req,res) {
		api.postgis.downloadDatasetFromLayer(req, res);
	});
	
	// =====================================
	// UPDATE FILE =========================
	// =====================================
	// change to /api/data/update
	app.post('/api/file/update', passport.authenticate('bearer', {session: false}), function (req,res) {
		api.file.update(req, res);
	});

	// =====================================
	// GET LAYERS OF FILE ==================
	// =====================================
	// change to /api/data/getLayers
	app.post('/api/file/getLayers', passport.authenticate('bearer', {session: false}), function (req,res) {
		api.file.getLayers(req, res);
	});

	// =====================================
	// SHARE DATASET =======================
	// =====================================
	// change to /api/data/share
	app.post('/api/dataset/share', passport.authenticate('bearer', {session: false}), function (req,res) {
		api.file.shareDataset(req, res);
	});
	

	// =====================================
	// DELETE FILE(S) ======================
	// =====================================
	// change to /api/data/delete
	app.post('/api/file/delete', passport.authenticate('bearer', {session: false}), function (req,res) {
		api.file.deleteFile(req, res);
	});

	// =====================================
	// ADD/LINK FILE TO NEW PROJECT ========
	// =====================================
	// change to /api/project/addData
	app.post('/api/file/addtoproject', passport.authenticate('bearer', {session: false}), function (req,res) {
		api.file.addFileToProject(req, res);
	});

	// =====================================
	// DELETE LAYER(S) =====================
	// =====================================
	// change to /api/layer/delete (layer, not layers)
	app.post('/api/layers/delete', passport.authenticate('bearer', {session: false}), function (req,res) {
		api.layer.deleteLayer(req, res);
	});

	// =====================================
	// LAYERS ==============================
	// =====================================
	// change to /api/layer/get 
	app.post('/api/layers', passport.authenticate('bearer', {session: false}), function (req, res) { 	// todo: layer/layers !! make all same...
		api.layer.get(req, res);
	});

	// =====================================
	// CREATE NEW LAYER ====================
	// =====================================
	// change to /api/layer/create 
	app.post('/api/layers/new', passport.authenticate('bearer', {session: false}), function (req, res) {
		api.layer.create(req, res);
	});

	// =====================================
	// NEW OSM LAYERS ======================
	// =====================================
	// change to /api/layer/osm/create 
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
	// change to /api/layer/reloadMeta (camelcase) 
	app.post('/api/layer/reloadmeta', passport.authenticate('bearer', {session: false}), function (req, res) {
		api.layer.reloadMeta(req, res);
	});

	// =====================================
	// SET CARTOCSS ========================
	// =====================================
	// change to /api/layer/carto/set 
	app.post('/api/layers/cartocss/set', passport.authenticate('bearer', {session: false}), function (req, res) {
		api.layer.setCartoCSS(req, res);
	});

	// =====================================
	// GET CARTOCSS ========================
	// =====================================
	// change to /api/layer/carto/get 
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
	// keep only this route, not /api/user/new
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
	// DELETGATE USER ======================
	// =====================================
	app.post('/api/user/delegate', passport.authenticate('bearer', {session: false}), function (req,res) {
		api.delegateUser(req, res);
	});

	// // =====================================
	// // INVITE USER =========================
	// // =====================================
	// app.post('/api/user/invite', passport.authenticate('bearer', {session: false}), function (req,res) {
	// 	api.user.invite(req, res);
	// });

	// =====================================
	// CHECK UNIQUE USER/EMAIL =============
	// =====================================
	app.post('/api/user/unique', passport.authenticate('bearer', {session: false}), function (req,res) {
		api.user.checkUniqueEmail(req, res);
	});

	// =====================================
	// CHECK UNIQUE USER/EMAIL =============
	// =====================================
	app.post('/api/user/uniqueUsername', function (req,res) {
		api.user.checkUniqueUsername(req, res);
	});

	// =====================================
	// CHECK UNIQUE USER/EMAIL =============
	// =====================================
	app.post('/api/user/uniqueEmail', function (req,res) {
		api.user.checkUniqueEmail(req, res);
	});

	// =====================================
	// CHECK UNIQUE USER/EMAIL =============
	// =====================================
	app.post('/api/user/invite', passport.authenticate('bearer', {session: false}), function (req,res) {
		api.user.invite(req, res);
	});

	// =====================================
	// REQUEST CONTACT =============
	// =====================================
	app.post('/api/user/requestContact', passport.authenticate('bearer', {session: false}), function (req,res) {
		api.user.requestContact(req, res);
	});

	// =====================================
	// REQUEST CONTACT =============
	// =====================================
	// change to /api/user/acceptContact/*
	app.get('/api/user/acceptContactRequest/*', function (req,res) {
		api.user.acceptContactRequest(req, res);
	});

	// =====================================
	// INVITE TO PROJECTS ==================
	// =====================================
	// todo: see if this can be removed (replaced by /api/user/invite?)
	app.post('/api/user/inviteToProjects', passport.authenticate('bearer', {session: false}), function (req,res) {
		api.user.inviteToProjects(req, res);
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
	// change to /api/... 
	app.post('/reset', function (req, res) {
		api.auth.requestPasswordReset(req, res);
	});

	// =====================================
	// RESET PASSWORD ======================
	// =====================================
	// change to /api/... 
	app.get('/reset', function (req, res) {
		api.auth.serveResetPage(req, res);
	});

	// =====================================
	// CREATE PASSWORD =====================
	// ===================================== 
	// change to /api/... 
	app.post('/reset/password', function (req, res) {
		api.auth.createPassword(req, res);
	});

	// =====================================
	// ZXCVBN DICTIONARY =================
	// ===================================== 
	// change to /api/... 
	app.get('/zxcvbn.js', function (req, res) {
		fs.readFile('../public/js/lib/zxcvbn/zxcvbn.js', function (err, data) {
			res.send(data);
		});
	});

	// ===================================== // todo: rename route to /api/clientConfig.js
	// SERVER CLIENT CONFIG ================
	// =====================================
	// change to /api/... 
	app.get('/clientConfig.js', isLoggedIn, function (req, res) {
		var configString = 'var systemapicConfigOptions = ' + JSON.stringify(api.clientConfig);
		res.setHeader("content-type", "application/javascript");
		res.end(configString);
	});

	// ===================================== // todo: rename route to /api/loginConfig.js
	// SERVER LOGIN CONFIG =================
	// ===================================== 
	// change to /api/... 
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
		console.log('get login');
		api.portal.login(req, res);
	});

	// =====================================
	// PRIVACY POLICY ======================
	// =====================================
	// change to /api/privacy-policy
	app.get('/privacy-policy', function(req, res) {
		// api.portal.login(req, res);
		res.render('../../views/privacy.ejs');
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
	// INVITE ==============================
	// =====================================
	app.get('/invite/*', function(req, res) {
		api.portal.invite(req, res);
	});

	// // =====================================
	// // INVITE ==============================
	// // =====================================
	// app.get('/api/invitation/*', function(req, res) {
	// 	api.portal.invitation(req, res);
	// });

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
	app.post('/api/forgot', function (req, res) {
		api.auth.forgotPassword(req, res);
	});

	// =====================================
	// FORGOT PASSWORD =====================
	// =====================================
	app.get('/forgot', function (req, res) {
		res.render('../../views/forgot.ejs', {
		});
	});

	// =====================================
	// REGISTER ACCOUNT ====================
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

	// function internalAccess(req, res, next) {
	// 	var token = req.query.token || req.body.token;
	// 	if (token == 'thisissecret') return next();
	// 	res.end(JSON.stringify({
	// 		error : 'No access.'
	// 	}))
	// }
	
}