// API: api.oauth2.js

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
var colors 	= require('colors');
var request 	= require('request');
var nodepath    = require('path');
var formidable  = require('formidable');
var nodemailer  = require('nodemailer');
var uploadProgress = require('node-upload-progress');
var mapnikOmnivore = require('mapnik-omnivore');

// api
var api = module.parent.exports;


var oauth2orize = require('oauth2orize');
var passport = require('passport');
var login = require('connect-ensure-login');


// memory store of access tokens
var accessTokens = {};
var refreshTokens = {};

// hardcoded clients
var clients = [
	{
		id: '1',
		name: 'Systemapic.js',
		clientId: 'abc123',
		clientSecret: 'ssh-secret'
	}
];

// oauth2 server
var oauth2orize = require('oauth2orize');
var oauth2server = oauth2orize.createServer();

// exports
module.exports = api.oauth2 = { 

	calculateExpirationDate : function () {
		console.log('caluculateExpirationDate');
		return new Date(new Date().getTime() + (this.expiresIn * 1000));
	},

	util : {
		uid : function (len) {
			var buf = [];
			var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
			var charlen = chars.length;

			for (var i = 0; i < len; ++i) {
				buf.push(chars[api.oauth2.util.getRandomInt(0, charlen - 1)]);
			}

			return buf.join('');
		},
		getRandomInt : function (min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		}
	},

	getToken : [
		passport.authenticate(['basic', 'oauth2-client-password'], {session: false}),
		oauth2server.token(),
		oauth2server.errorHandler()
	],

	getUserInfo : [
		passport.authenticate('bearer', {session: false}),
		function (req, res) {
			// req.authInfo is set using the `info` argument supplied by
			// `BearerStrategy`.  It is typically used to indicate scope of the token,
			// and used in access control checks.  For illustrative purposes, this
			// example simply returns the scope in the response.

			res.json({user_id: req.user.id, name: req.user.firstName, scope: req.authInfo.scope});
		}
	],

	store : {

		refreshTokens : {

			find  : function (key, done) {
				var token = refreshTokens[key];
				return done(null, token);
			},

			save : function (token, userID, clientID, scope, done) {
				refreshTokens[token] = {userID: userID, clientID: clientID, scope: scope};
				return done(null);
			},

			delete : function (key, done) {
				delete refreshTokens[key];
				return done(null);
			}

		},

		accessTokens : {
			
			find : function (key, done) {
				var token = accessTokens[key];
				return done(null, token);
			},

			save : function (token, expirationDate, userID, clientID, scope, done) {
				accessTokens[token] = {userID: userID, expirationDate: expirationDate, clientID: clientID, scope: scope};
				return done(null);
			},

			delete : function (key, done) {
				delete accessTokens[key];
				return done(null);
			},

			removeExpired : function (done) {
				var tokensToDelete = [];
				for (var key in accessTokens) {
					if (accessTokens.hasOwnProperty(key)) {
						var token = accessTokens[key];
						if (new Date() > token.expirationDate) {
							tokensToDelete.push(key);
						}
					}
				}
				for (var i = 0; i < tokensToDelete.length; ++i) {
					delete accessTokens[tokensToDelete[i]];
				}
				return done(null);
			},

			removeAll : function (done) {
				accessTokens = {};
				return done(null);
			}
		},

		clients : {

			findByClientId : function (clientId, done) {
				// using hardcoded list of possible clients. TODO: move into some type of db
				for (var i = 0, len = clients.length; i < len; i++) {
					var client = clients[i];
					if (client.clientId === clientId) {
						return done(null, client);
					}
				}
				return done(null, null);
			},

			find : function (id, done) {
				for (var i = 0, len = clients.length; i < len; i++) {
					var client = clients[i];
					if (client.id === id) {
						return done(null, client);
					}
				}
				return done(null, null);

			}
		},

		users : {

			find : function (id, done) {
				User
				.findById(id)
				.exec(done);
			},

			findByUsername : function (username, done) {
				User
				.findOne({'local.email' : username})
				.exec(done);
			},
		}
	},

	// get token info
	tokenInfo : function (req, res) {

		// debug
		console.log('tokenInfo');
		return res.end('debug tokenInfo');


		if (req.query.access_token) {
			api.oauth2.store.accessTokens.find(req.query.access_token, function (err, token) {
				if (err || !token) {
					res.status(400);
					res.json({error: "invalid_token"});
				} else if (new Date() > token.expirationDate) {
					res.status(400);
					res.json({error: "invalid_token"});
				}
				else {
					api.oauth2.store.clients.find(token.clientID, function (err, client) {
						if (err || !client) {
							res.status(400);
							res.json({error: "invalid_token"});
						} else {
							if (token.expirationDate) {
								var expirationLeft = Math.floor((token.expirationDate.getTime() - new Date().getTime()) / 1000);
								if (expirationLeft <= 0) {
									res.json({error: "invalid_token"});
								} else {
									res.json({audience: client.clientId, expires_in: expirationLeft});
								}
							} else {
								res.json({audience: client.clientId});
							}
						}
					});
				}
			});
		} else {
			res.status(400);
			res.json({error: "invalid_token"});
		}
	},

}


oauth2server.exchange(oauth2orize.exchange.password(function (client, username, password, scope, done) {
	//Validate the user

	api.oauth2.store.users.findByUsername(username, function (err, user) {
		if (err) return done(err);
		
		if (!user) return done(null, false);
		
		// check password against stored hash
		if (!user.validPassword(password)) {
			return done(null, false);
		}

		// create access_token
		var token = api.oauth2.util.uid(api.config.token.accessTokenLength);

		// save access_token
		api.oauth2.store.accessTokens.save(token, function () {
			return new Date(new Date().getTime() + (api.config.token.expiresIn * 1000));
		}, user.id, client.id, scope, function (err) {
			if (err) return done(err);
			
			var refreshToken = null;
			//I mimic openid connect's offline scope to determine if we send
			//a refresh token or not
			if (scope && scope.indexOf("offline_access") === 0) {
				refreshToken = api.oauth2.util.uid(api.config.token.refreshTokenLength);
				api.oauth2.store.refreshTokens.save(refreshToken, user.id, client.id, scope, function (err) {
					if (err) return done(err);
					
					return done(null, token, refreshToken, {expires_in: api.config.token.expiresIn});
				});
			} else {
				return done(null, token, refreshToken, {expires_in: api.config.token.expiresIn});
			}
		});
	});
}));