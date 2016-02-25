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
var errorHandler = require('../middleware/error-handler')();

// api
var api = require('../api/api');

// function exports
module.exports = function(app) {


	// define apiDocs tokens
	/**
	* @apiDefine token
	* @apiParam {String} access_token A valid access token
	* @apiError Unauthorized The <code>access_token</code> is invalid. (403)
	* @apiErrorExample {json} Error-Response:
	* Error 401: Unauthorized
	* {
	*    "error": "Invalid access token."
	* }
	*/
	

	// link app
	api.app = app;

	// authenticate shorthand
	var checkAccess = api.token.authenticate;


	// ================================
	// HOME PAGE (with login links) ===
	// ================================
	app.get('/', api.portal.getBase, errorHandler);
	
	/**
	* @api {get} /v2/portal Get portal store
	* @apiName getPortal
	* @apiGroup User
	* @apiUse token
	*
	* @apiSuccess {object} Projects Projects that user have access to
	* @apiSuccess {object} Datasets Datasets that user owns or have access to
	* @apiSuccess {object} Contacts Contacts that user has in contact list
	*/
	// =====================================
	// GET PORTAL  =========================
	// =====================================
	app.get('/v2/portal', checkAccess, api.portal.getPortal, errorHandler);
	
	/**
	* @api {post} /v2/projects/create Create a project
	* @apiName create
	* @apiGroup Project
	* @apiUse token
	* @apiParam {String} name Name of project
	* @apiSuccess {JSON} Project JSON object of the newly created project
	* @apiError Bad_request name doesn't exist in request body (400)
	* @apiErrorExample {json} Error-Response:
	* Error 400: Bad request
	* {
	*    "error": {
	*		"message": "Missing information. Check out https://docs.systemapic.com/ for details on the API.",
	*		"code": "400",
	*		"errors": {
	*			"missingRequiredFields": ['name']
	*		}
	*	}
	* }
	*/
	// =====================================
	// CREATE NEW PROJECT  =================
	// =====================================
	app.post('/v2/projects/create', checkAccess, api.project.create, errorHandler);

	/**
	* @api {post} /v2/projects/delete Delete a project
	* @apiName delete
	* @apiGroup Project
	* @apiUse token
	* @apiParam {String} project_id Uuid of project
	* @apiSuccess {String} project ID of deleted project
	* @apiSuccess {Boolean} deleted True if successful
	* @apiSuccessExample {json} Success-Response:
	*  {
	*    "project": "project-o121l2m-12d12dlk-addasml",
	*    "deleted": true
	*  }
	* @apiError Bad_request project_id doesn't exist in request body (400)
	* @apiErrorExample {json} Error-Response:
	* Error 400: Bad request
	* {
	*    "error": {
	*		"message": "Missing information. Check out https://docs.systemapic.com/ for details on the API.",
	*		"code": "400",
	*		"errors": {
	*			"missingRequiredFields": ['project_id']
	*		}
	*	}
	* }
	* @apiError Not_found If project doesn't exist(404)
	* @apiErrorExample {json} Error-Response:
	* Error 404: Not found
	* {
	*    "error": {
	*		"message": "No such project.",
	*		"code": "404"
	*	}
	* }
	*/
	// =====================================
	// DELETE PROJECT   ====================
	// =====================================
	app.post('/v2/projects/delete', checkAccess, api.project.deleteProject, errorHandler);

	/**
	* @api {get} /v2/projects/public Get a public project
	* @apiName get public project
	* @apiGroup Project
	* @apiUse token
	* @apiParam {String} username Username
	* @apiParam {String} project_slug Project slug
	* @apiSuccess {JSON} Project JSON object of the newly created project
	* @apiSuccessExample {json} Success-Response:
	* {
	*  _id: '56af8403c608bbce6616d291',
	*  lastUpdated: '2016-02-01T16:12:51.390Z',
	*  created: '2016-02-01T16:12:51.390Z',
	*  createdBy: 'uuid-mocha-test-project',
	*  uuid: 'uuid-mocha-test-project_public',
	*  etc..
	* }
	* @apiError Bad_request username or project_slug don't exist in request body (400)
	* @apiErrorExample {json} Error-Response:
	* Error 400: Bad request
	* {
	*    "error": {
	*		"message": "Missing information. Check out https://docs.systemapic.com/ for details on the API.",
	*		"code": "400",
	*		"errors": {
	*			"missingRequiredFields": ['username', 'project_slug']
	*		}
	*	}
	* }
	* @apiError Not_found If user with specific username doesn't exist(404)
	* @apiErrorExample {json} Error-Response:
	* Error 404: Not found
	* {
	*    "error": {
	*		"message": "No such user.",
	*		"code": "404"
	*	}
	* }
	* @apiError Not_found If project with specific slug doesn't exist(404)
	* @apiErrorExample {json} Error-Response:
	* Error 404: Not found
	* {
	*    "error": {
	*		"message": "No such project.",
	*		"code": "404"
	*	}
	* }
	* @apiError Bad_request If project isn't public(404)
	* @apiErrorExample {json} Error-Response:
	* Error 400: Bad request
	* {
	*    "error": {
	*		"message": "Not a public project.",
	*		"code": "400"
	*	}
	* }
	*/
	// =====================================
	// CHECK THAT PROJECT IS PUBLIC ========
	// =====================================
	app.get('/v2/projects/public', checkAccess, api.project.getPublic, errorHandler);

	/**
	* @api {get} /v2/projects/private Get private project
	* @apiName get private project
	* @apiGroup Project
	* @apiUse token
	* @apiParam {String} project_id Project id
	* @apiParam {String} user_access_token User access token
	* @apiSuccess {JSON} emptyObject Just now it is return empty object
	* @apiSuccessExample {json} Success-Response:
	* {
	* }
	* @apiError Bad_request project_id or user_access_token don't exist in request body (400)
	* @apiErrorExample {json} Error-Response:
	* Error 400: Bad request
	* {
	*    "error": {
	*		"message": "Missing information. Check out https://docs.systemapic.com/ for details on the API.",
	*		"code": "400",
	*		"errors": {
	*			"missingRequiredFields": ['project_id', 'user_access_token']
	*		}
	*	}
	* }
	*/
	// =====================================
	// CHECK THAT PROJECT IS PRIVATE =======
	// =====================================
	app.get('/v2/projects/private', checkAccess, api.project.getPrivate, errorHandler);

	/**
	* @api {get} /v2/status Get portal status
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
	// =====================================
	// GET STATUS   ====================
	// =====================================
	app.get('/v2/status', checkAccess, api.portal.status, errorHandler);

		
	/**
	* @api {get} /v2/users/token Get access token
	* @apiName access_token
	* @apiGroup User
	* @apiParam {String} username Email or username
	* @apiParam {String} password Password
	* @apiParam {Boolean} [refresh=false] Refresh access token
	*
	* @apiSuccess {json} status Access token JSON
	* @apiSuccessExample {json} Success-Response:
	* {
	*	"access_token":"AMduTdFBlXcBc1PKS5Ot4MZzwGjPhKw3y2LzJwJ0CGz0lpRGhK5xHGMcGLqvrOfY1aBR4M9Y4O126WRr5YSQGNZoLPbN0EXMwlRD0ajCqsd4MRr55UpfVYAfrLRL9i0tuglrtGYVs2iT8bl75ZVfYnbDl4Vjp4ElQoWqf6XdqMsIr25XxO5cZB9NRRl3mxA8gWRzCd5bvgZFZTWa6Htx5ugRqwWiudc8lbWNDCx85ms1up94HLKrQXoGMC8FVgf4",
	*	"expires_in":"36000",
	*	"token_type":"Bearer"
	* }
	* @apiError {json} Bad_request username and email or password don't exist in request body (400)
	* @apiErrorExample {json} Error-Response:
	* Error 400: Bad request
	* {
	*    "error": {
	*		"message": "Missing information. Check out https://docs.systemapic.com/ for details on the API.",
	*		"code": "400",
	*		"errors": {
	*			"missingRequiredFields": ['username and email', 'password']
	*		}
	*	 }
	* }
	* @apiError Not_found If user doesn't exist(404)
	* @apiErrorExample {json} Error-Response:
	* Error 404: Not found
	* {
	*    "error": {
	*		"message": "No such user.",
	*		"code": "404"
	*	 }
	* }
	* @apiError {json} Bad_request Wrong password (400)
	* @apiErrorExample {json} Error-Response:
	* Error 400: Bad request
	* {
	*    "error": {
	*		"message": "Invalid credentials.",
	*		"code": "400"
	*	 }
	* }
	*/
	// ================================
	// GET TOKEN FROM PASSWORD ========
	// ================================
	app.get('/v2/users/token', api.token.getTokenFromPassword, errorHandler);

	/**
	* @api {post} /v2/users/token/refresh Refresh access token
	* @apiName refresh_access_token
	* @apiGroup User
	* @apiUse token
	*
	* @apiSuccess {json} status Access token JSON
	* @apiSuccessExample {json} Success-Response:
	* {
	*	"access_token":"AMduTdFBlXcBc1PKS5Ot4MZzwGjPhKw3y2LzJwJ0CGz0lpRGhK5xHGMcGLqvrOfY1aBR4M9Y4O126WRr5YSQGNZoLPbN0EXMwlRD0ajCqsd4MRr55UpfVYAfrLRL9i0tuglrtGYVs2iT8bl75ZVfYnbDl4Vjp4ElQoWqf6XdqMsIr25XxO5cZB9NRRl3mxA8gWRzCd5bvgZFZTWa6Htx5ugRqwWiudc8lbWNDCx85ms1up94HLKrQXoGMC8FVgf4",
	*	"expires_in":"36000",
	*	"token_type":"Bearer"
	* }
	*/
	// ================================
	// REFRESH TOKEN ==================
	// ================================
	app.post('/v2/users/token/refresh', checkAccess, api.token.refresh, errorHandler);
	
	/**
	* @api {post} /v2/users/token/check Check access token
	* @apiName check_access_token
	* @apiGroup User
	* @apiUse token
	*
	* @apiSuccess {json} status Access token JSON
	*/
	// ================================
	// CHECK TOKEN ====================
	// ================================
	app.post('/v2/users/token/check', checkAccess, function (req, res) {
		res.send(req.user); 	// todo: create endpoint in api.users.js for this
	}, errorHandler);

	/**
	* @api {get} /v2/users/token/check Check access token
	* @apiName check_access_token
	* @apiGroup User
	* @apiUse token
	*
	* @apiSuccess {json} status Valid status
	* @apiSuccessExample {json} Success-Response:
	* {
	*	"valid" : true
	* }
	*/
	// ================================
	// CHECK TOKEN ====================
	// ================================
	app.get('/v2/users/token/check', checkAccess, function (req, res) {
		res.send({valid : true}); // todo: create endpoint in api.users.js for this
	}, errorHandler);
	
	/**
	* @api {get} /v2/users/session Check if already logged in (browser-only)
	* @apiName user_session
	* @apiGroup User
	*
	* @apiSuccess {json} access_token Valid access token (either user or public)
	*/
	// ================================
	// CHECK SESSION ==================
	// ================================
	app.get('/v2/users/session', api.token.checkSession, errorHandler);

	// todo: document these routes
	// =====================================
	// ERROR LOGGING =======================
	// =====================================
	app.post('/v2/log/error', checkAccess, api.error.clientLog, errorHandler);

	// =====================================
	// ANALYTICS ===================
	// =====================================
	app.post('/v2/log', checkAccess, api.analytics.set, errorHandler);

	// =====================================
	// ANALYTICS ===================
	// =====================================
	app.get('/v2/log', checkAccess, api.analytics.get, errorHandler);

	// =====================================
	// RESUMABLE.js UPLOADS ================
	// =====================================
	// app.get('/api/data/upload/chunked', checkAccess, function (req, res) {
	app.get('/v2/data/import/chunked', checkAccess, api.upload.chunkedCheck, errorHandler);

	// =====================================
	// UPLOAD DATA IN CHUNKS (RESUMABLE) === 
	// =====================================
	// app.post('/api/data/upload/chunked', checkAccess, api.upload.chunkedUpload);
	app.post('/v2/data/import/chunked', checkAccess, api.upload.chunkedUpload, errorHandler);


	// // =====================================
	// // RESUMABLE.js UPLOADS ================
	// // =====================================
	// app.get('/download/:identifier', checkAccess, function (req, res) {
	// 	api.upload.chunkedIdent(req, res);
	// });

	

	/**
	* @api {get} /v2/data/import Get upload 
	* @apiName get upload
	* @apiGroup Upload
	* @apiUse token
	* @apiParam {String} file_id
	* @apiSuccess {Object} file Upload file
	* @apiSuccess {Object} layer Related layer
	* @apiSuccess {Object} project Related project
	* @apiSuccessExample {json} Success-Response:
	* {
	*  file: {
	*    _id: '56af0e566f8ca08221ee2ca7',
	*    lastUpdated: '2016-02-01T07:50:46.730Z',
	*    created: '2016-02-01T07:50:46.726Z',
	*    dataSize: '109770',
	*    type: 'postgis',
	*    originalName: 'shapefile.zip',
	*    name: 'shapefile',
	*    createdBy: 'uuid-mocha-test-project',
	*    uuid: 'file_tzcqhdaecyhmqraulgby',
	*    __v: 0,
	*    access: {
	*      clients: [],
	*      projects: [],
	*      users: []
	*    },
	*    data: {
	*      image: [Object],
	*      postgis: [Object]
	*    },
	*    format: [],
	*    keywords: [],
	*    files: []
	*  },
	*  layer: null
	* }
	* @apiError Bad_request file_id do not exist in request body (400)
	* @apiErrorExample {json} Error-Response:
	* Error 400: Bad request
	* {
	*    "error": {
	*		"message": "Missing information. Check out https://docs.systemapic.com/ for details on the API.",
	*		"code": "400",
	*		"errors": {
	*			"missingRequiredFields": ['file_id']
	*		}
	*	}
	* }
	* @apiError Not_found If file doesn't upload(404)
	* @apiErrorExample {json} Error-Response:
	* Error 404: Not found
	* {
	*    "error": {
	*		"message": "no such upload status id",
	*		"code": "404"
	*	}
	* }
	*/
	// =====================================
	// GET UPLOAD ==========================
	// =====================================
	// app.get('/api/upload/get', checkAccess, api.upload.getUpload, errorHandler);
	app.get('/v2/data/import', checkAccess, api.upload.getUpload, errorHandler);

	/**
	* @api {post} /v2/data/import Import data
	* @apiName import
	* @apiGroup Data
	* @apiUse token
	* @apiParam {Buffer} data File buffer
	*
	* @apiSuccess {json} status Upload Status JSON
	* @apiSuccessExample {json} Success-Response:
	* {
	*	"file_id":"file_fxqzngykgzjxtsunulti",
	*	"user_id":"test-user-uuid",
	*	"filename":"shapefile.zip",
	*	"timestamp":1453063189097,
	*	"status":"Processing",
	*	"size":109770,
	*	"upload_success":true,
	*	"error_code":null,
	*	"error_text":null
	* }
	*/
	// =====================================
	// IMPORT DATA to POSTGIS ==============
	// =====================================
	// change to /api/data/import
	// app.post('/api/import', checkAccess, function (req, res) {
	app.post('/v2/data/import', checkAccess, api.upload.upload, errorHandler);


	// todo: document
	// =====================================
	// GET UPLOAD STATUS ===================
	// =====================================
	// change to /api/import/status
	// app.get('/api/import/status', checkAccess, api.upload.getUploadStatus);
	app.get('/v2/data/import/status', checkAccess, api.upload.getUploadStatus, errorHandler);

	/**
	 * @apiIgnore
	 * @api {get} /api/joinbeta Joinbeta
	 * @apiName Joinbeta
	 * @apiGroup Admin
	 * @apiUse token
	 * @apiParam {Buffer} email User email
	 *
	 * @apiSuccess {json} status Upload Status JSON
	 * @apiSuccessExample {json} Success-Response:
	 * {
	 * }
	 */
	// =====================================
	// JOIN BETA MAIL ======================
	// =====================================
	app.get('/api/joinbeta', api.portal.joinBeta, errorHandler, errorHandler);

	/**
	* @api {post} /v2/projects/update Update project
	* @apiName update
	* @apiGroup Project
	* @apiUse token
	* @apiParam {String} project_id Uuid of project which should be update
	* @apiParam {String} logo New logo of project
	* @apiParam {String} header New header of project
	* @apiParam {Array} baseLayers New baseLayers of project
	* @apiParam {Object} position New position of project
	* @apiParam {Object} bounds New bounds of project
	* @apiParam {Array} layermenu New layermenu of project
	* @apiParam {Array} folders New folders of project
	* @apiParam {Object} controls New controls of project
	* @apiParam {String} description New description of project
	* @apiParam {Array} keywords New keywords of project
	* @apiParam {String} colorTheme New colorTheme of project
	* @apiParam {String} title New title of project
	* @apiParam {String} slug New slug of project
	* @apiParam {Object} connectedAccounts New connectedAccounts of project
	* @apiParam {Object} settings New settings of project
	* @apiParam {Array} categories New categories of project
	* @apiParam {Boolean} thumbCreated New thumbCreated of project
	* @apiParam {String} state New state of project
	* @apiParam {Array} pending New pending of project
	* @apiSuccess {json} access Project access object
	* @apiSuccessExample {json} Success-Response:
	* {
  	*   updated: ['logo', 'header', etc...],
  	*   project: {
	*    _id: '56af0e566f8ca08221ee2ca7',
	*    lastUpdated: '2016-02-01T07:50:46.730Z',
	*    created: '2016-02-01T07:50:46.726Z',
	*	 etc...
  	*   }
	* }
	* @apiError Bad_request project_id doesn't not exist in request body (400)
	* @apiErrorExample {json} Error-Response:
	* Error 400: Bad request
	* {
	*    "error": {
	*		"message": "Missing information. Check out https://docs.systemapic.com/ for details on the API.",
	*		"code": "400",
	*		"errors": {
	*			"missingRequiredFields": ['project_id']
	*		}
	*	}
	* }
	* @apiError Not_found If project doesn't exist(404)
	* @apiErrorExample {json} Error-Response:
	* Error 404: Not found
	* {
	*    "error": {
	*		"message": "No such project.",
	*		"code": "404"
	*	}
	* }
	* @apiError Bad_request User haven't access to the project (400)
	* @apiErrorExample {json} Error-Response:
	* Error 400: Bad request
	* {
	*    "error": {
	*		"message": "No access.",
	*		"code": "400"
	*	}
	* }
	*/
	// =====================================
	// UPDATE PROJECT ======================
	// =====================================
	app.post('/v2/projects/update', checkAccess, api.project.update, errorHandler);

	/**
	* @api {post} /api/project/unique Unique project
	* @apiName unique
	* @apiGroup Project
	* @apiUse token
	* @apiSuccess {Boolean} unique Project access object
	* @apiSuccessExample {json} Success-Response:
	* {
  	*   updated: ['logo', 'header', etc...],
  	*   project: {
	*    _id: '56af0e566f8ca08221ee2ca7',
	*    lastUpdated: '2016-02-01T07:50:46.730Z',
	*    created: '2016-02-01T07:50:46.726Z',
	*	 etc...
  	*   }
	* }
	*/
	// =====================================
	// CHECK UNIQUE SLUG ===================
	// =====================================
	app.post('/api/project/unique', checkAccess, api.project.checkUniqueSlug, errorHandler);


	// =====================================
	// SET ACCESS ==========================
	// =====================================
	// app.post('/api/project/setAccess', checkAccess, function (req,res) {
	app.post('/v2/projects/access', checkAccess, api.project.setAccess, errorHandler);

	/**
	* @api {post} /v2/users/invite/project Add invites
	* @apiName add invites
	* @apiGroup Project
	* @apiUse token
	* @apiParam {String} project Uuid of project
	* @apiParam {Object} access Access object
	* @apiSuccess {json} access Project access object
	* @apiSuccessExample {json} Success-Response:
	* {
  	*  read: ['test'],
  	*  edit: ['uuid-mocha-test-project'],
	*  options: {
	*    share: true,
	*    download: false,
	*    isPublic: false
	*  }
	*}
	* @apiError Bad_request access or project do not exist in request body (400)
	* @apiErrorExample {json} Error-Response:
	* Error 400: Bad request
	* {
	*    "error": {
	*		"message": "Missing information. Check out https://docs.systemapic.com/ for details on the API.",
	*		"code": "400",
	*		"errors": {
	*			"missingRequiredFields": ['access', 'project']
	*		}
	*	}
	* }
	* @apiError Not_found If project doesn't exist(404)
	* @apiErrorExample {json} Error-Response:
	* Error 404: Not found
	* {
	*    "error": {
	*		"message": "No such project.",
	*		"code": "404"
	*	}
	* }
	*/
	// =====================================
	// CREATE NEW PROJECT  =================
	// =====================================
	// change route to /api/project/invite
	app.post('/v2/users/invite/project', checkAccess, api.project.addInvites, errorHandler);


	/**
	* @api {post} /v2/hashes Set project hash
	* @apiName Set hash
	* @apiGroup Project
	* @apiUse token
	* @apiParam {String} project_id Uuid of project
	* @apiParam {Bollean}  saveState Save prject state flag
	* @apiParam {Object} hash Hash object
	* @apiSuccess {Object} error Error object
	* @apiSuccess {Object} hash Created hash
	* @apiSuccessExample {json} Success-Response:
	* {
	*   error: null,
	*   hash: {
	*     __v: 0,
	*     lastUpdated: '2016-02-12T10:22:20.535Z',
	*     created: '2016-02-12T10:22:20.535Z',
	*     project: 'uuid-mocha-test-project-for-hash-set',
	*     createdByName: 'mocha test',
	*     createdBy: 'uuid-mocha-test-project',
	*     id: 'some id',
	*     uuid: 'hash-1225da89-7d03-4df9-981c-804cd119a1f8',
	*     _id: '56bdb25c78c5e3cd164f1f1d',
	*     layers: ['some layer'],
	*     position: {
	*       lat: '1',
	*       lng: '1',
	*       zoom: '1'
	*     }
	*   }
	* }
	* @apiError Bad_request project_id or saveState or hash or hash.position or hash.layers or hash.id don't not exist in request body (400)
	* @apiErrorExample {json} Error-Response:
	* Error 400: Bad request
	* {
	*    "error": {
	*		"message": "Missing information. Check out https://docs.systemapic.com/ for details on the API.",
	*		"code": "400",
	*		"errors": {
	*			"missingRequiredFields": ['project_id', 'saveState', 'hash', 'hash.position', 'hash.layers', 'hash.id']
	*		}
	*	}
	* }
	*/
	// =====================================
	// SET PROJECT HASH ====================
	// =====================================
	// change to /api/project/setHash
	// app.post('/api/project/hash/set', checkAccess, api.project.setHash, errorHandler);
	app.post('/v2/hashes', checkAccess, api.project.setHash, errorHandler);

	/**
	* @api {get} /v2/hashes Get project hash
	* @apiName Get hash
	* @apiGroup Project
	* @apiUse token
	* @apiParam {String} project_id Uuid of project
	* @apiParam {String}  id Hash id
	* @apiSuccess {Object} error Error object
	* @apiSuccess {Object} hash Hash object
	* @apiSuccessExample {json} Success-Response:
	* {
 	*   error: null,
 	*   hash: {
 	*     _id: '56bdc6fbc7ec6af66dfc92f0',
	*     lastUpdated: '2016-02-12T11:50:19.231Z',
	*     created: '2016-02-12T11:50:19.231Z',
	*     id: 'some hash id',
	*     project: 'some project id',
	*     uuid: 'test_mocha_hash',
	*     __v: 0,
	*     layers: []
	*   }
	* }
	* @apiError Bad_request project_id or project_id or id don't not exist in request body (400)
	* @apiErrorExample {json} Error-Response:
	* Error 400: Bad request
	* {
	*    "error": {
	*		"message": "Missing information. Check out https://docs.systemapic.com/ for details on the API.",
	*		"code": "400",
	*		"errors": {
	*			"missingRequiredFields": ['project_id', 'id']
	*		}
	*	}
	* }
	* @apiError Not_found If hash doesn't exist(404)
	* @apiErrorExample {json} Error-Response:
	* Error 404: Not found
	* {
	*    "error": {
	*		"message": "No such hash.",
	*		"code": "404"
	*	}
	* }
	*/
	// =====================================
	// GET PROJECT HASH ====================
	// =====================================
	// change to /api/project/getHash
	// app.post('/api/project/hash/get', checkAccess, api.project.getHash, errorHandler);
	app.get('/v2/hashes', checkAccess, api.project.getHash, errorHandler);



	/**
	* // this route is deprecated
	* @apiIgnore 
	* @api {post} /api/project/uploadlogo Upload project logo
	* @apiName Upload project logo
	* @apiGroup Project
	* @apiUse token
	* @apiParam {String} image_id Image id
	* @apiParam {String} resumableIdentifier Resumable identifier
	* @apiSuccess {Object} error Error object
	* @apiSuccess {String} image Image uuid 
	* @apiSuccessExample {json} Success-Response:
	* '56bdc6fbc7ec6af66dfc92f0'
	* @apiError Bad_request image_id or resumableIdentifier or id don't not exist in request body (400)
	* @apiErrorExample {json} Error-Response:
	* Error 400: Bad request
	* {
	*    "error": {
	*		"message": "Missing information. Check out https://docs.systemapic.com/ for details on the API.",
	*		"code": "400",
	*		"errors": {
	*			"missingRequiredFields": ['image_id', 'resumableIdentifier']
	*		}
	*	}
	* }
	*/
	// =====================================
	// UPLOAD PROJECT LOGO  ================
	// =====================================
	// change to /api/project/setLogo
	// app.post('/api/project/uploadlogo', checkAccess, api.upload.projectLogo, errorHandler);

	// todo: remove, deprecated
	// =====================================
	// UPLOAD IMAGE ========================
	// =====================================
	// change to /api/import/image
	app.post('/api/upload/image', checkAccess, api.upload.image, errorHandler);


	// =====================================
	// SERVE STATIC FILES SECURELY  ========
	// =====================================
	// special route, don't touch for now
	app.get('/images/*', checkAccess, api.file.sendImage, errorHandler);

	// =====================================
	// SERVE STATIC FILES SECURELY  ========
	// =====================================
	// change to /api/... 
	// special route, don't touch for now
	app.get('/pixels/fit/*', checkAccess, api.pixels.serveFitPixelPerfection, errorHandler);

	// =====================================
	// SERVE STATIC FILES SECURELY  ========
	// =====================================
	// change to /api/... 
	app.get('/pixels/image/*', checkAccess, api.pixels.serveImagePixelPerfection, errorHandler);

	// =====================================
	// SERVE STATIC FILES SECURELY  ========
	// =====================================
	// change to /api/... 
	app.get('/pixels/screenshot/*', api.pixels.serveScreenshot, errorHandler);

	// =====================================
	// SERVE STATIC FILES SECURELY  ========
	// =====================================
	// change to /api/... 
	app.get('/pixels/*', checkAccess, api.pixels.servePixelPerfection, errorHandler);

	// =====================================
	// GET MAPBOX ACCOUNT ==================
	// =====================================
	// change to /api/tools/mapbox/get
	app.post('/api/util/getmapboxaccount', checkAccess, api.provider.mapbox.getAccount, errorHandler);
	
	// =====================================
	// CREATE SNAPSHOT =====================
	// =====================================
	// create snapshot of current map
	// app.post('/api/util/snapshot', checkAccess, function (req, res) {
	// app.post('/v2/static/screen', checkAccess, api.pixels.createSnapshot);
	app.post('/v2/static/screen', checkAccess, api.pixels.snap, errorHandler);

	// =====================================
	// AUTO-CREATE LEGENDS =================
	// =====================================
	// change to /api/layer/legends/create
	// app.post('/api/layer/createlegends', checkAccess, function (req, res) {
	app.post('/v2/legends/create', checkAccess, api.legend.create, errorHandler);

	// todo: remove, deprecated
	// =====================================
	// GET GEOJSON FILES ===================
	// =====================================
	// change to /api/data/get ... 
	// todo: perhaps improve this, put all downloads together, with type/format in query/form.. todo later
	// app.post('/api/geojson', checkAccess, function (req,res) {
	// 	api.file.getGeojsonFile(req, res);
	// });
	
	// todo: remove, deprecated
	// =====================================
	// GET FILE DOWNLOAD ===================
	// =====================================
	// change to /api/data/download
	app.get('/api/file/download', checkAccess, api.file.download, errorHandler);


	// todo: remove, deprecated (will be removed with new raster import (branch: postgis_raster))
	// =====================================
	// GET FILE DOWNLOAD ===================
	// =====================================
	// change to /api/tools/tilecount
	// app.get('/api/util/getTilecount', checkAccess, api.geo.getTilecount);

	/**
	* @api {post} /v2/layers/carto/json Return carto css
	* @apiName json2carto
	* @apiGroup Geo
	* @apiUse token
	* @apiParam {Object} style Style object parameter
	* @apiSuccess {String} cartoCss Carto css
	* @apiSuccessExample {String} Success-Response:
	* "@polygon_opacity: 1;
	*#layer {
	*
	*	polygon-opacity: @polygon_opacity;
	*
	*	polygon-fill: red;
	*
	*}"
	* @apiError Bad_request uuid does not exist in request body (400)
	* @apiErrorExample {json} Error-Response:
	* Error 400: Bad request
	* {
	*    "error": {
	*		"message": "Missing style!",
	*		"code": "400",
	*		"errors": {
	*			"missingRequiredFields": ['style']
	*		}
	*	}
	* }
	*/
	// =====================================
	// GET GEOJSON FILES ===================
	// =====================================
	// change to /api/tools/json2carto
	// app.post('/api/geo/json2carto', checkAccess, api.geo.json2carto, errorHandler);
	app.post('/v2/layers/carto/json', checkAccess, api.geo.json2carto, errorHandler);


	// todo: document
	// =====================================
	// DOWNLOAD DATASET ====================
	// =====================================
	// change to /api/data/download (POST/GET routes with same name no problem)
	// app.post('/api/file/downloadDataset', checkAccess, function (req,res) {
	app.post('/v2/data/download', checkAccess, api.postgis.downloadDatasetFromFile, errorHandler);

	// todo: document
	// =====================================
	// DOWNLOAD DATASET ====================
	// =====================================
	// change to /api/layer/download
	// app.post('/api/layer/downloadDataset', checkAccess, function (req,res) {
	app.post('/v2/layers/download', checkAccess, api.postgis.downloadDatasetFromLayer, errorHandler);
	
	/**
	* @api {post} /v2/data/update Update a file
	* @apiName update
	* @apiGroup File
	* @apiUse token
	* @apiParam {String} uuid Uuid of file
	*
	* @apiSuccess {Array} updated Array of updated fields
	* @apiSuccess {Object} file Updated file
	* @apiSuccessExample {json} Success-Response:
	* {
	*   "updated": ['name', 'description'],
	*   "file": {
	*       lastUpdated: '2016-01-19T12:49:49.076Z',
    	*       created: '2016-01-19T12:49:48.943Z',
    	*       ... etc
	*   }
	* }
	* @apiError File with uuid <code>uuid</code> doesn't exist. (422)
	* @apiErrorExample {json} Error-Response:
	* Error 422: File doesn't exist
	* {
	*    "error": "bad file uuid"
	* }
	*/
	// =====================================
	// UPDATE FILE =========================
	// =====================================
	// change to /api/data/update
	app.post('/v2/data/update', checkAccess, api.file.update, errorHandler);

	/**
	* @api {post} /v2/data/layers Get layers
	* @apiName getLayers
	* @apiGroup File
	* @apiUse token
	* @apiParam {String} type Type of file(raster or postgis)
	* @apiParam {Object} data Object with file_id field for raster files or database_name and table_name for postgis files
	* @apiSuccess {Array} array of layers
	* @apiSuccessExample {json} Success-Response:
	* [
	*   {
	*	  uuid: 'layer uuid',
	*	  title: 'layer title',
	*	  description: 'layer description',
	*	  ... etc
	*   }
	* ]
	* @apiError Missing required fields. (422)
	* @apiErrorExample {json} Error-Response:
	* Error 422: Missing type parameter or database_name and table_name for postgis type
	* {
	*    "error": "Missing information. Check out https://docs.systemapic.com/ for details on the API."
	* }
	* @apiError Missing required fields. (422)
	* @apiErrorExample {json} Error-Response:
	* Error 422: Missing file_id for rater type
	* {
	*    "error": "request body should contains data.file_id"
	* }
	*/
	// =====================================
	// GET LAYERS OF FILE ==================
	// =====================================
	// change to /api/data/getLayers
	app.post('/v2/data/layers', checkAccess, api.file.getLayers, errorHandler);

	/**
	* @api {post} /v2/data/share Share dataset
	* @apiName shareDataset
	* @apiGroup File
	* @apiUse token
	* @apiParam {String} dataset File id
	* @apiParam {Array} users Array of user's ids
	* @apiSuccess {Object} err Error object
	* @apiSuccess {Boolean} success
	* @apiSuccess {Object} file_shared File shared object
	* @apiSuccess {Array} users_shared_with Shared users
	* @apiSuccessExample {json} Success-Response:
	* {
	*  err: null
	*  success: true,
	*  file_shared: {
	*	file_name: 'fileName',
	*	file_uuid: 'fileUuid',
	*  }
	*  users_shared_with : ['userId']
	* }
	* @apiError Bad_request dataset or users do not exist in request body (400)
	* @apiErrorExample {json} Error-Response:
	* Error 400: Bad request
	* {
	*    "error": {
	*		"message": "Missing information. Check out https://docs.systemapic.com/ for details on the API.",
	*		"code": "400",
	*		"errors": {
	*			"missingRequiredFields": ['users', 'dataset']
	*		}
	*	}
	* }
	* @apiError Not_found file does not exist (404)
	* @apiErrorExample {json} Error-Response:
	* Error 404: Not found
	* {
	*    "error": {
	*		"message": "No such file.",
	*		"code": "404"
	*	}
	* }
	*/
	// =====================================
	// SHARE DATASET =======================
	// =====================================
	// change to /api/data/share
	// app.post('/api/dataset/share', checkAccess, api.file.shareDataset, errorHandler);
	app.post('/v2/data/share', checkAccess, api.file.shareDataset, errorHandler);
	
	/**
	* @api {post} /v2/data/delete Delete data
	* @apiName delete
	* @apiGroup File
	* @apiUse token
	* @apiParam {String} file_id File id
	* @apiSuccess {json} status Upload Status JSON
	* @apiSuccessExample {json} Success-Response:
	* {
	*   "success": true,
	*   "err": {}
	* }
	* @apiError Bad_request file_id does not exist in request body (400)
	* @apiErrorExample {json} Error-Response:
	* Error 400: Bad request
	* {
	*    "error": {
	*		"message": "Missing information. Check out https://docs.systemapic.com/ for details on the API.",
	*		"code": "400",
	*		"errors": {
	*			"missingRequiredFields": ['file_id']
	*		}
	*	}
	* }
	* @apiError Not_found database_name or table_name does not exist in file.data.postgis or file_id doesn't exist in file.data.raster (404)
	* @apiErrorExample {json} Error-Response:
	* Error 404: Not found
	* {
	*    "error": {
	*		"message": "Missing information. Check out https://docs.systemapic.com/ for details on the API.",
	*		"code": "404"
	*	}
	* }
	* @apiError Internal_server_error Problems with drop table (500)
	* @apiErrorExample {json} Error-Response:
	* Error 500: Internal server error
	* {
	*    "error": {
	*		"message": "Can't drop table tableName",
	*		"code": "500"
	*	}
	* }
	* @apiError Not_found If file type is postgis and file with file.data.posgis.table_name id doesn't exist(404)
	* @apiErrorExample {json} Error-Response:
	* Error 404: Not found
	* {
	*    "error": {
	*		"message": "No such file.",
	*		"code": "404"
	*	}
	* }
	*/
	// =====================================
	// DELETE DATA =========================
	// =====================================
	// change to /api/data/delete
	app.post('/v2/data/delete', checkAccess, api.file.deleteFile, errorHandler);

	/**
	* @api {post} /v2/projects/data Add file to the project
	* @apiName addToTheProject
	* @apiGroup File
	* @apiUse token
	* @apiParam {String} file_id File id
	* @apiParam {String} project_id Project id
	* @apiSuccess {json} status Upload Status JSON
	* @apiSuccessExample {json} Success-Response:
	*{
	*  _id: '56a76e07b6aa58e535c88d22',
	*  lastUpdated: '2016-01-26T13:00:55.159Z',
	*  created: '2016-01-26T13:00:55.018Z',
	*  createdByUsername: 'relatedProjectCreatedByUsername',
	*  createdByName: 'relatedProjectCreatedByName',
	*  createdBy: 'relatedProjectCreatedBy',
	*  uuid: 'relatedProjectInfo',
	*  layers: ['56a76e07b6aa58e535c88d23'],
	*  files: ['56a76e07b6aa58e535c88d21'],
	*  roles: [],
	*  access: {
	*    options: {
	*      isPublic: false,
	*      download: false,
	*      share: true
	*    },
	*    edit: [],
	*    read: ['test-user-uuid']
	*  },
	*  categories: [],
	*  keywords: [],
	*  description: 'Description',
	*  slug: 'projectslug',
	*  name: 'relatedProjectName'
	* etc...
	*}
	* @apiError Bad_request file_id or project_id does not exist in request body (400)
	* @apiErrorExample {json} Error-Response:
	* Error 400: Bad request
	* {
	*    "error": {
	*		"message": "Missing information. Check out https://docs.systemapic.com/ for details on the API.",
	*		"code": "400",
	*		"errors": {
	*			"missingRequiredFields": ['file_id', 'project_id']
	*		}
	*	}
	* }
	* @apiError Not_found File with specific id not found(404)
	* @apiErrorExample {json} Error-Response:
	* Error 404: Not found
	* {
	*    "error": {
	*		"message": "No such file",
	*		"code": "404"
	*	}
	* }
	* @apiError Not_found Project with specific id not found(404)
	* @apiErrorExample {json} Error-Response:
	* Error 404: Not found
	* {
	*    "error": {
	*		"message": "No such project",
	*		"code": "404"
	*	}
	* }
	*/
	// =====================================
	// ADD/LINK FILE TO NEW PROJECT ========
	// =====================================
	// change to /api/project/addData
	app.post('/v2/projects/data', checkAccess, api.file.addFileToProject, errorHandler);

	/**
	* @api {post} /v2/layers/delete Delete data
	* @apiName delete
	* @apiGroup Layer
	* @apiUse token
	* @apiParam {String} layer_id Layer id
	* @apiParam {String}  project__id Project id 
	* @apiSuccess {json} status Upload Status JSON
	* @apiSuccessExample {json} Success-Response:
	* {
	*   "success": true,
	*   "err": {}
	* }
	* @apiError Bad_request layer_id or project_id does not exist in request body (400)
	* @apiErrorExample {json} Error-Response:
	* Error 400: Bad request
	* {
	*    "error": {
	*		"message": "Missing information. Check out https://docs.systemapic.com/ for details on the API.",
	*		"code": "400",
	*		"errors": {
	*			"missingRequiredFields": ['layer_id', 'project_id']
	*		}
	*	}
	* }
	* @apiError Not_found Layer with specific id not found(404)
	* @apiErrorExample {json} Error-Response:
	* Error 404: Not found
	* {
	*    "error": {
	*		"message": "No such layers",
	*		"code": "404"
	*	}
	* }
	* @apiError Not_found Project with specific id not found(404)
	* @apiErrorExample {json} Error-Response:
	* Error 404: Not found
	* {
	*    "error": {
	*		"message": "No such project.",
	*		"code": "404"
	*	}
	* }
	*/
	// =====================================
	// DELETE LAYER(S) =====================
	// =====================================
	// change to /api/layer/delete (layer, not layers)
	app.post('/v2/layers/delete', checkAccess, api.layer.deleteLayer, errorHandler);

	/**
	* @api {get} /v2/projects/layers Get layers related with project
	* @apiName get layers by project id
	* @apiGroup Layer
	* @apiUse token
	* @apiParam {String} project Project uuid
	* @apiSuccess {Array} layers Array of layers related with project
	* @apiSuccessExample {json} Success-Response:
	*[{
	*    data: [Object],
	*    __v: 0,
	*    uuid: 'relatedLayerUuid',
	*    title: 'relatedLayerTitle',
	*    description: 'relatedLayerDescription',
	*    created: Mon Jan 25 2016 11: 37: 44 GMT + 0000(UTC),
	*    lastUpdated: Mon Jan 25 2016 11: 37: 44 GMT + 0000(UTC),
	*    _id: 56 a60908fdce40a15eca6773
	*}, and etc]
	* @apiError Bad_request project does not exist in request body (400)
	* @apiErrorExample {json} Error-Response:
	* Error 400: Bad request
	* {
	*    "error": {
	*		"message": "Missing information. Check out https://docs.systemapic.com/ for details on the API.",
	*		"code": "400",
	*		"errors": {
	*			"missingRequiredFields": ['project']
	*		}
	*	}
	* }
	*/
	// =====================================
	// LAYERS ==============================
	// =====================================
	// change to /api/layer/get 
	// app.post('/api/layers', checkAccess, api.layer.get, errorHandler); // todo: layer/layers !! make all same...
	app.get('/v2/projects/layers', checkAccess, api.layer.get, errorHandler); // todo: layer/layers !! make all same...

	// todo: /v2/projects/layers GET request

	/**
	* @api {post} /v2/layers/create Create layer
	* @apiName create
	* @apiGroup Layer
	* @apiUse token
	* @apiParam {String} title Title of new layer
	* @apiParam {String} description Description of new layer
	* @apiParam {String} legend Legend of new legend
	* @apiParam {String} file File of new layer
	* @apiParam {String} metadata Metadata of new layer
	* @apiParam {String} data Data of new layer
	* @apiParam {String} style Style of new layer
	* @apiSuccess {JSON} Layer New Layer object
	* @apiSuccessExample {json} Success-Response:
	* {
	*    __v: 0,
	*    lastUpdated: '2016-01-20T10:55:30.983Z',
	*    created: '2016-01-20T10:55:30.983Z',
	*    legend: '',
	*    description: 'new layer description',
	*    title: 'new layer title',
	*    uuid: 'layer-ae4fc38c-58f0-4468-81e7-7330d226dc24',
	*    _id: '569f67a2ebb7233b667d8a02'
	* }
	*/
	// =====================================
	// CREATE NEW LAYER ====================
	// =====================================
	// change to /api/layer/create 
	app.post('/v2/layers/create', checkAccess, api.layer.create, errorHandler);

	// todo: refactor to /v2/layers/create with default flag
	// =====================================
	// CREATE NEW DEFAULT LAYER ============
	// =====================================
	// app.post('/api/layers/default', checkAccess, api.layer.createDefaultLayers, errorHandler);
	app.post('/v2/layers/create/default', checkAccess, api.layer.createDefaultLayers, errorHandler);

	/**
	* @api {post} /v2/layers/update Update layer
	* @apiName update
	* @apiGroup Layer
	* @apiUse token
	* @apiParam {String} layer uuid of updated layer
	* @apiParam {String} title New title of updated layer
	* @apiParam {String} description New description of updated layer
	* @apiParam {String} satellite_position New satellite_position of updated layer
	* @apiParam {String} copyright New copyright of updated layer
	* @apiParam {String} tooltip New tooltip of updated layer
	* @apiParam {String} style New style of updated layer
	* @apiParam {String} filter New filter of updated layer
	* @apiParam {String} legends New legends of updated layer
	* @apiParam {String} opacity New opacity of updated layer
	* @apiParam {Number} zIndex New zIndex of updated layer
	* @apiParam {Object} data New data of updated layer
	* @apiSuccess {String} response Update info 
	* @apiSuccessExample {String} Success-Response:
	* {
	*   updated: ['satellite_position',
	*     'description',
	*     'copyright',
	*     'title',
	*     'tooltip',
	*     'style',
	*     'filter',
	*     'legends',
	*     'opacity',
	*     'zIndex',
	*     'data'
	*   ],
	*   layer: {
	*     _id: '56c5b2570bfe2137063a6c44',
	*     lastUpdated: '2016-02-18T12:00:23.471Z',
	*     created: '2016-02-18T12:00:23.471Z',
	*     description: 'update mocha test layer description',
	*     title: 'update mocha test layer title',
	*     uuid: 'new mocha test layer uuid',
	*     __v: 0,
	*     satellite_position: 'update mocha test layer satellite_position',
	*     copyright: 'update mocha test layer copyright',
	*     tooltip: 'update mocha test layer tooltip',
	*     style: 'update mocha test layer style',
	*     filter: 'update mocha test layer filter',
	*     legends: 'update mocha test layer legends',
	*     opacity: 'update mocha test layer opacity',
	*     zIndex: 4,
	*     data: {
	*       geojson: 'update mocha test layer geojson',
	*       topojson: 'update mocha test layer topojson',
	*       cartoid: 'update mocha test layer cartoid',
	*       raster: 'update mocha test layer raster',
	*       rastertile: 'update mocha test layer rastertile',
	*       vectortile: 'update mocha test layer vectortile',
	*       mapbox: 'update mocha test layer mapbox',
	*       cartodb: 'update mocha test layer cartodb',
	*       osm: 'update mocha test layer osm',
	*       norkart: 'update mocha test layer norkart',
	*       google: 'update mocha test layer google',
	*       postgis: [Object]
	*     }
	*   }
	* }
	* @apiError Bad_request layer does not exist in request body (400)
	* @apiErrorExample {json} Error-Response:
	* Error 400: Bad request
	* {
	*    "error": {
	*		"message": "Missing information. Check out https://docs.systemapic.com/ for details on the API.",
	*		"code": "400",
	*		"errors": {
	*			"missingRequiredFields": ['layer']
	*		}
	*	}
	* }
	* @apiError Not_found If layer doesn't exist(404)
	* @apiErrorExample {json} Error-Response:
	* Error 404: Not found
	* {
	*    "error": {
	*		"message": "No such layer.",
	*		"code": "404"
	*	}
	* }
	*/
	// =====================================
	// UPDATE LAYERS =======================
	// =====================================
	app.post('/v2/layers/update', checkAccess, api.layer.update, errorHandler);

	// =====================================
	// RELOAD LAYER METADATA ===============
	// =====================================
	// change to /api/layer/reloadMeta (camelcase) 
	app.post('/v2/layers/meta', checkAccess, api.layer.reloadMeta, errorHandler);

	// =====================================
	// SET CARTOCSS ========================
	// =====================================
	// change to /api/layer/carto/set 
	app.post('/v2/layers/carto', checkAccess, api.layer.setCartoCSS, errorHandler);

	// =====================================
	// GET CARTOCSS ========================
	// =====================================
	// change to /api/layer/carto/get 
	app.get('/v2/layers/carto', checkAccess, api.layer.getCartoCSS, errorHandler);

	/**
	* @api {post} /v2/users/update Update user
	* @apiName update
	* @apiGroup User
	* @apiUse token
	* @apiParam {String} uuid Uuid of user
	* @apiSuccess {Array} updated Array of updated fields
	* @apiSuccess {Object} user Updated user
	* @apiSuccessExample {json} Success-Response:
	* {
	*   "updated": ['phone', 'company'],
	*   "user": {
	*       lastUpdated: '2016-01-19T12:49:49.076Z',
	*       created: '2016-01-19T12:49:48.943Z',
	*       ... etc
	*   }
	* }
	* @apiError Bad_request uuid does not exist in request body (400)
	* @apiErrorExample {json} Error-Response:
	* Error 400: Bad request
	* {
	*    "error": {
	*		"message": "Missing information. Check out https://docs.systemapic.com/ for details on the API.",
	*		"code": "400",
	*		"errors": {
	*			"missingRequiredFields": ['uuid']
	*		}
	*	}
	* }
	* @apiError Bad_request uuid does not exist in request body (400)
	* @apiErrorExample {json} Error-Response:
	* Error 400: Bad request
	* {
	*    "error": {
	*		"message": "No access.",
	*		"code": "400"
	*	}
	* }
	* @apiError Not_found If user doesn't exist(404)
	* @apiErrorExample {json} Error-Response:
	* Error 404: Not found
	* {
	*    "error": {
	*		"message": "No such user.",
	*		"code": "404"
	*	}
	* }
	*/
	// =====================================
	// UPDATE USER INFORMATION  ============
	// =====================================
	app.post('/v2/users/update', checkAccess, api.user.update, errorHandler);


	/**
	* @api {get} /v2/users/info Get info on authenticated user
	* @apiName info
	* @apiGroup User
	* @apiUse token
	* @apiSuccess {Object} user User
	* @apiSuccessExample {json} Success-Response:
	* {
	*   "user": {
	*       lastUpdated: '2016-01-19T12:49:49.076Z',
	*       created: '2016-01-19T12:49:48.943Z',
	*       ... etc
	*   }
	* }
	*/
	// =====================================
	// UPDATE USER INFORMATION  ============
	// =====================================
	app.get('/v2/users/info', checkAccess, api.user.info, errorHandler);

	// old route, keeping for backwards compatibility
	app.post('/api/user/info', checkAccess, api.user.info, errorHandler);


	// =====================================
	// CREATE NEW USER =====================
	// =====================================
	/**
	* @api {post} /v2/users/create Create new user
	* @apiName info
	* @apiGroup User
	* @apiParam {String} username Unique username
	* @apiParam {String} firstname First name
	* @apiParam {String} lastname Last name
	* @apiParam {String} [company] Company
	* @apiParam {String} [position] Position in company
	* @apiParam {String} email Email
	* @apiParam {String} password Password
	* @apiSuccess {Object} user User
	* @apiSuccessExample {json} Success-Response:
	* {
	*   "user": {
	*       lastUpdated: '2016-01-19T12:49:49.076Z',
	*       created: '2016-01-19T12:49:48.943Z',
	*       ... etc
	*   }
	* }
	*/
	app.post('/v2/users/create', api.user.create, errorHandler);

	// TODO this endpoint does not exist
	// =====================================
	// DELETE USER =========================
	// =====================================
	// app.post('/v2/users/delete', checkAccess, api.user.deleteUser);

	
	/**
	* @apiIgnore
	* @api {post} /v2/users/email/unique Is unique email
	* @apiName unique email
	* @apiGroup User
	* @apiUse token
	* @apiParam {String} email Email which should be check
	* @apiSuccess {Boolean} unique True if email is unique
	* @apiSuccessExample {json} Success-Response:
	* {
	*   "unique": true
	* }
	* @apiError Bad_request Email does not exist in request body (400)
	* @apiErrorExample {json} Error-Response:
	* Error 400: Bad request
	* {
	*    "error": {
	*		"message": "Missing information. Check out https://docs.systemapic.com/ for details on the API.",
	*		"code": "400",
	*		"errors": {
	*			"missingRequiredFields": ['email']
	*		}
	*	}
	* }
	*/
	// =====================================
	// CHECK UNIQUE USER/EMAIL =============
	// =====================================
	app.post('/v2/users/email/unique', api.user.checkUniqueEmail, errorHandler);

	/**
	* @apiIgnore
	* @api {post} /v2/users/username/unique Is unique email
	* @apiName unique username
	* @apiGroup User
	* @apiUse token
	* @apiParam {String} username Username which should be check
	* @apiSuccess {Boolean} unique True if username is unique
	* @apiSuccessExample {json} Success-Response:
	* {
	*   "unique": true
	* }
	* @apiError Bad_request Username does not exist in request body (400)
	* @apiErrorExample {json} Error-Response:
	* Error 400: Bad request
	* {
	*    "error": {
	*		"message": "Missing information. Check out https://docs.systemapic.com/ for details on the API.",
	*		"code": "400",
	*		"errors": {
	*			"missingRequiredFields": ['username']
	*		}
	*	}
	* }
	*/
	// =====================================
	// CHECK UNIQUE USER/EMAIL =============
	// =====================================
	app.post('/v2/users/username/unique', api.user.checkUniqueUsername, errorHandler);

	/**
	* @api {post} /v2/users/invite Send invite mail
	* @apiName Send invite mail
	* @apiGroup User
	* @apiUse token
	* @apiParam {Array} emails Array of emails
	* @apiParam {String} customMessage Custom message
	* @apiParam {Object} access Access object	
	* @apiSuccess {Object} error error object
	* @apiSuccessExample {json} Success-Response:
	* {
	*   "error": null
	* }
	* @apiError Bad_request Emails or customMessage or access do not exist in request body (400)
	* @apiErrorExample {json} Error-Response:
	* Error 400: Bad request
	* {
	*    "error": {
	*		"message": "Missing information. Check out https://docs.systemapic.com/ for details on the API.",
	*		"code": "400",
	*		"errors": {
	*			"missingRequiredFields": ['emails', 'customMessage', 'access']
	*		}
	*	}
	* }
	*/
	// =====================================
	// SEND INVITE MAIL ====================
	// =====================================
	// rename to /api/user/invite/email
	// app.post('/api/user/invite', checkAccess, api.user.invite, errorHandler);
	app.post('/v2/users/invite', checkAccess, api.user.invite, errorHandler);

	/**
	* @api {post} /v2/users/invite/accept Accept invite
	* @apiName Accept invite
	* @apiGroup User
	* @apiUse token
	* @apiParam {String} invite_token Invite token (for example 55mRbPA)
	* @apiSuccess {Object} invite Accepted invite
	* @apiSuccessExample {json} Success-Response:
	* {
	*     "email": false,
	*     "access": {
	*         "edit": [
	*             "project-ef990c38-f16c-478e-9ed1-65ed2808b070"
	*         ],
	*         "read": [
	*             "project-65f99b5c-a645-4f3a-8905-9fad85c59c40",
	*             "project-f7a9dd0b-4113-44a0-8e2d-e0d752f1cc04",
	*             "project-c72c3d83-ff96-4483-8f39-f942c0187108"
	*         ]
	*     },
	*     "token": "L9Jfxks",
	*     "invited_by": "user-805dc4a1-2535-41f3-9a1b-af32ad134692",
	*     "timestamp": 1455569798000,
	*     "type": "link"
	* }
	* @apiError Bad_request Invite_token does not exist in request body (400)
	* @apiErrorExample {json} Error-Response:
	* Error 400: Bad request
	* {
	*    "error": {
	*		"message": "Missing information. Check out https://docs.systemapic.com/ for details on the API.",
	*		"code": "400",
	*		"errors": {
	*			"missingRequiredFields": ['invite_token']
	*		}
	*	}
	* }
	* @apiError Not_found Some of project does not exist (404)
	* @apiErrorExample {json} Error-Response:
	* Error 404: Not found
	* {
	*    "error": {
	*		"message": "No such project.",
	*		"code": "404"
	*	}
	* }
	*/
	// =====================================
	// PROCESS INVITE FOR USER =============
	// =====================================
	// rename to /api/user/invite/email
	// app.post('/api/user/invite/accept', checkAccess, api.user.acceptInvite, errorHandler);
	app.post('/v2/users/invite/accept', checkAccess, api.user.acceptInvite, errorHandler);

	/**
	* @api {post} /v2/users/contacts/request Request contact
	* @apiName Request contact
	* @apiGroup User
	* @apiUse token
	* @apiParam {String} contact User id
	* @apiSuccess {Object} error error object
	* @apiSuccessExample {json} Success-Response:
	* {
	*   "error": null
	* }
	* @apiError Bad_request Contact does not exist in request body (400)
	* @apiErrorExample {json} Error-Response:
	* Error 400: Bad request
	* {
	*    "error": {
	*		"message": "Missing information. Check out https://docs.systemapic.com/ for details on the API.",
	*		"code": "400",
	*		"errors": {
	*			"missingRequiredFields": ['contact']
	*		}
	*	}
	* }
	* @apiError Bad_request user does not exist in request body (404)
	* @apiErrorExample {json} Error-Response:
	* Error 404: Not found
	* {
	*    "error": {
	*		"message": "No such user.",
	*		"code": "404"
	*	}
	* }
	*/
	// =====================================
	// REQUEST CONTACT =====================
	// =====================================
	app.post('/v2/users/contacts/request', checkAccess, api.user.requestContact, errorHandler);

	// =====================================
	// REQUEST CONTACT =====================
	// =====================================
	// change to /api/user/acceptContact/*
	app.get('/api/user/acceptContactRequest/*', api.user.acceptContactRequest, errorHandler); // todo: POST?

	/**
	* @api {post} /v2/users/invite/projects Invite user to projects
	* @apiName Invite user to projects
	* @apiGroup User
	* @apiUse token
	* @apiParam {String} user User id
	* @apiParam {Array} edit Array of project ids which user will be able to edit 
	* @apiParam {String} read Array of project ids which user will be able to read
	* @apiSuccess {Object} error error object
	* @apiSuccess {array} projects error object
	* @apiSuccessExample {json} Success-Response:
	* {
	*  error: null,
	*  projects: [{
	*    project: 'uuid-mocha-test-project',
	*    access: {
	*      read: ['second_test-user-uuid'],
	*      edit: [],
	*      options: {
	*        share: true,
	*        download: false,
	*        isPublic: false
	*      }
	*    }
	*  }]
	* }
	* @apiError Bad_request User, edits and reads do not exist in request body (400)
	* @apiErrorExample {json} Error-Response:
	* Error 400: Bad request
	* {
	*    "error": {
	*		"message": "Missing information. Check out https://docs.systemapic.com/ for details on the API.",
	*		"code": "400",
	*		"errors": {
	*			"missingRequiredFields": ['user']
	*		}
	*	}
	* }
	*/
	// =====================================
	// INVITE TO PROJECTS ==================
	// =====================================
	// todo: see if this can be removed (replaced by /api/user/invite?)
	app.post('/v2/users/invite/projects', checkAccess, api.user.inviteToProjects, errorHandler);

	/**
	* @api {get} /v2/users/invite/link Invite user to projects
	* @apiName Invite user to projects
	* @apiGroup User
	* @apiUse token
	* @apiParam {String} access Access parameter
	* @apiSuccess {Stringy} link Invite link
	* @apiSuccessExample {json} Success-Response:
	* https://dev3.systemapic.com/invite/7Tf7Bc8
	* @apiError Bad_request access does not exist in request body (400)
	* @apiErrorExample {json} Error-Response:
	* Error 400: Bad request
	* {
	*    "error": {
	*		"message": "Missing information. Check out https://docs.systemapic.com/ for details on the API.",
	*		"code": "400",
	*		"errors": {
	*			"missingRequiredFields": ['access']
	*		}
	*	}
	* }
	*/
	// =====================================
	// GENERATE ACCESS LINK ================
	// =====================================
	app.get('/v2/users/invite/link', checkAccess, api.user.getInviteLink, errorHandler);

	// =====================================
	// CHECK RESET PASSWORD TOKEN ==========
	// =====================================
	app.post('/reset/checktoken', api.auth.checkResetToken, errorHandler);

	/**
	* @api {post} /v2/users/password/reset Send reset password mail
	* @apiName send reset password mail
	* @apiGroup User
	* @apiParam {String} email User's email
	* @apiSuccess {String} text Please check your email for password reset link.
	* @apiError Bad_request Email does not exist in request body (400)
	* @apiErrorExample {json} Error-Response:
	* Error 400: Bad request
	* {
	*    "error": {
	*		"message": "Missing information. Check out https://docs.systemapic.com/ for details on the API.",
	*		"code": "400",
	*		"errors": {
	*			"missingRequiredFields": ['email']
	*		}
	*	}
	* }
	* @apiError Not_found If user with specific email doesn't exist(404)
	* @apiErrorExample {json} Error-Response:
	* Error 404: User not found
	* {
	*    "error": {
	*		"message": "No such user.",
	*		"code": "404"
	*	}
	* }
	*/
	// =====================================
	// RESET PASSWORD ======================
	// =====================================
	app.post('/v2/users/password/reset', api.auth.requestPasswordReset, errorHandler);

	// =====================================
	// RESET PASSWORD ======================
	// =====================================
	// change to /api/... 
	app.get('/reset', api.auth.serveResetPage, errorHandler);

	/**
	* @api {post} /v2/users/password Reset password
	* @apiName reset password
	* @apiGroup User
	* @apiParam {String} password New password
	* @apiParam {String} token Access token
	* @apiSuccess {String} text Moved Temporarily. Redirecting to /
	* @apiError Bad_request password or token do not exist in request body (400)
	* @apiErrorExample {json} Error-Response:
	* Error 400: Bad request
	* {
	*    "error": {
	*		"message": "Missing information. Check out https://docs.systemapic.com/ for details on the API.",
	*		"code": "400",
	*		"errors": {
	*			"missingRequiredFields": ['token', 'password']
	*		}
	*	}
	* }
	* @apiError Not_found If file doesn't upload(404)
	* @apiErrorExample {json} Error-Response:
	* Error 401: Invalid token
	* {
	*    "error": {
	*		"message": "Invalid access token.",
	*		"code": "401"
	*	}
	* }
	*/
	// =====================================
	// CREATE PASSWORD =====================
	// ===================================== 
	app.post('/v2/users/password', api.auth.resetPassword, errorHandler);


	// todo: remove
	// =====================================
	// ZXCVBN DICTIONARY =================
	// ===================================== 
	// change to /api/... 
	app.get('/zxcvbn.js', function (req, res) {
		fs.readFile('../public/js/lib/zxcvbn/zxcvbn.js', function (err, data) {
			res.send(data);
		});
	}, errorHandler);

	// ===================================== // todo: rename route to /api/config/client.js
	// SERVER CLIENT CONFIG ================
	// =====================================
	// change to /api/... 
	app.get('/clientConfig.js', function (req, res) {
		var configString = 'var systemapicConfigOptions = ' + JSON.stringify(api.clientConfig);
		res.setHeader("content-type", "application/javascript");
		res.end(configString);
	}, errorHandler);

	// =====================================
	// DEBUG: PHANTOMJS FEEDBACK ===========
	// ===================================== 
	// app.post('/api/debug/phantom', checkAccess, function (req, res) {
	// 	res.end();
	// });

	// =====================================
	// PRIVACY POLICY ======================
	// =====================================
	// change to /v2/docs/privacy-policy
	app.get('/privacy-policy', function(req, res) {
		// api.portal.login(req, res);
		res.render('../../views/privacy.ejs');
	}, errorHandler);

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', api.portal.logout, errorHandler);

	// =====================================
	// INVITE ==============================
	// =====================================
	app.get('/invite/*', api.portal.invite, errorHandler);

	// =====================================
	// FORGOT PASSWORD =====================
	// =====================================
	app.post('/api/forgot', api.auth.forgotPassword, errorHandler);

	// =====================================
	// FORGOT PASSWORD =====================
	// =====================================
	app.get('/forgot', function (req, res) {
		res.render('../../views/forgot.ejs', {});
	}, errorHandler);

	// =====================================
	// WILDCARD PATHS ======================		
	// =====================================
	app.get('*', function (req, res) {
		api.portal.wildcard(req, res);
	}, errorHandler);

	// // helper function : if is logged in
	// function isLoggedIn(req, res, next) {
	// 	if (req.isAuthenticated()) return next();
	// 	res.redirect('/');
	// }
	
};