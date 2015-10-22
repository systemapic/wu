// config/passport.js

// node-uuid
var uuid = require('node-uuid');
var colors = require('colors');
var LocalStrategy = require('passport-local').Strategy; // load all the things we need
var BearerStrategy = require('passport-http-bearer').Strategy;
var BasicStrategy = require('passport-http').BasicStrategy;

var User = require('../models/user'); // load up the user model
var crypto = require('crypto'); // crypto
var api = require('../api/api'); // api
var redis = require('redis'); 
var config = api.config;

// token redis
// var r = redis.createClient(config.tokenRedis.port, config.tokenRedis.host);
// r.auth(config.tokenRedis.auth);
// r.on('error', console.error);

// expose this function to our app using module.exports
module.exports = function(passport) {

	// =========================================================================
	// passport session setup ==================================================
	// =========================================================================
	// required for persistent login sessions
	// passport needs ability to serialize and unserialize users out of session

	// used to serialize the user for the session
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	// used to deserialize the user
	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});

	// =========================================================================
	// LOCAL SIGNUP ============================================================
	// =========================================================================
	// we are using named strategies since we have one for login and one for signup
	// by default, if there was no name, it would just be called 'local'

	passport.use('local-signup', new LocalStrategy({
		// by default, local strategy uses username and password, we will override with email
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true // allows us to pass back the entire request to the callback
	},
	function(req, email, password, done) {

		// asynchronous
		// User.findOne wont fire unless data is sent back
		process.nextTick(function() {

			// find a user whose email is the same as the forms email
			// we are checking to see if the user trying to login already exists
			User.findOne({ 'local.email' :  email }, function(err, user) {
				// if there are any errors, return the error
				if (err) return done(err);

				// check to see if there's already a user with that email
				if (user) return done(null, false, req.flash('signupMessage', 'That email is already taken.'));

				// register user
				api.user.register(req.body, done);
			});    
		});
	}));

	// =========================================================================
	// LOCAL LOGIN =============================================================
	// =========================================================================
	// we are using named strategies since we have one for login and one for signup
	// by default, if there was no name, it would just be called 'local'

	passport.use('local-login', new LocalStrategy({
		// by default, local strategy uses username and password, we will override with email
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true // allows us to pass back the entire request to the callback
	},
	function(req, email, password, done) { // callback with email and password from our form
	  
		var invite_token = req.body.invite_token;
		console.log('invite_token', invite_token);

		// find a user whose email is the same as the forms email
		// we are checking to see if the user trying to login already exists
		User.findOne({ 'local.email' :  email }, function(err, user) {

			// if there are any errors, return the error before anything else
			if (err) return done(err);

			// if no user is found, return the message
			if (!user) return done(null, false, req.flash('loginMessage', 'Oops! Bad credentials.')); // req.flash is the way to set flashdata using connect-flash

			// if the user is found but the password is wrong
			if (!user.validPassword(password)) return done(null, false, req.flash('loginMessage', 'Oops! Bad credentials.')); // create the loginMessage and save it to session as flashdata

			// process invite token
			api.user._processInviteToken({
				invite_token : invite_token,
				user : user
			}, function (err, project_id){

				// set token, save to user
				user.token = setRedisToken(user);
				user.save(function (err) {
					if (err) console.error(err);

					// slack
					if (user.local.email != config.phantomJS.user) {
						api.slack.loggedIn({user : user});
					}

					// all is well, return successful user
					return done(null, user);
				});
			});
		});
	}));

	

	// =========================================================================
	// BEARER ACCESS TOKEN =====================================================
	// =========================================================================
	// calls made to API endpoints with an access_token
	passport.use(new BearerStrategy(
		function (accessToken, done) {

			// console.log('passport.js:193 BearerStrategy > accessToken'.yellow, accessToken); // is used when calling API endpoint with access_token

			api.oauth2.store.accessTokens.find(accessToken, function (err, token) {
				if (err) return done(err);
				
				if (!token) return done(null, false);
				
				if (new Date() > token.expirationDate) {
					api.oauth2.store.accessTokens.delete(accessToken, function (err) {
						return done(err);
					});
			
				} else {
					if (token.userID !== null) {
						api.oauth2.store.users.find(token.userID, function (err, user) {
							if (err) return done(err);
							
							if (!user) return done(null, false);
							
				
							// to keep this example simple, restricted scopes are not implemented,
							// and this is just for illustrative purposes
							var info = {scope: '*'};
							return done(null, user, info);
						});
					} else {
						//The request came from a client only since userID is null
						//therefore the client is passed back instead of a user
						api.oauth2.store.clients.find(token.clientID, function (err, client) {
							if (err) return done(err);
							
							if (!client) return done(null, false);
							
						
							// to keep this example simple, restricted scopes are not implemented,
							// and this is just for illustrative purposes
							var info = {scope: '*'};
							return done(null, client, info);
						});
					}
				}
			});
		}
	));


	passport.use(new BasicStrategy(
		function (username, password, done) {

			api.oauth2.store.clients.findByClientId(username, function (err, client) {
				if (err) return done(err);
				
				if (!client) return done(null, false);
				
				if (client.clientSecret != password) {
					return done(null, false);
				}

				return done(null, client);
			});
		}
	));
	

	// tiles access token
	// ------------------
	// - set an access token for each time user logs in
	// - access token stored in redis
	// - redis replicated securely on tx
	// - checks if access token exists - lives forever
	// - new access token created each time user logs in, then the access token is dead

	// helper fn
	function setRedisToken(user) {

		// user id
		var uid = user.uuid.split('-').reverse()[0]; // last block of user-uuid

		// key
		var key = 'token-' + uid;	// token-asdd333dd // from user-uuid

		// token
		var token = key + '.' + crypto.randomBytes(12).toString('hex');  // ASFSAlkdmflsdkfmdslk2lk  // random string

		// async set
		api.redis.temp.set(key, token);
		
		// return token
		return token;
	}


};