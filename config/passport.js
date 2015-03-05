// config/passport.js

// node-uuid
var uuid = require('node-uuid');
var colors = require('colors');

// load all the things we need
var LocalStrategy = require('passport-local').Strategy;

// load up the user model
var User = require('../models/user');


// redis, crypto
var crypto = require('crypto');
var redis = require('redis');
var config = require('../config/config');


var r = redis.createClient(config.tokenRedis.port, config.tokenRedis.host)
r.auth(config.tokenRedis.auth);
r.on('error', function (err) {
	console.error(err);
});


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

				// if there is no user with that email,
				// create the user
				var newUser            = new User();

				// set the user's local credentials
				newUser.local.email    = email;
				newUser.local.password = newUser.generateHash(password);
				newUser.uuid = 'user-' + uuid.v4();

				// save the user
				newUser.save(function(err) {
					if (err) console.error(err);
					return done(null, newUser);
				});


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
	  

		// console.log('LOGIN ATTEMPT!', email, password);

		// find a user whose email is the same as the forms email
		// we are checking to see if the user trying to login already exists
		User.findOne({ 'local.email' :  email }, function(err, user) {
			// if there are any errors, return the error before anything else
			if (err) return done(err);

			// if no user is found, return the message
			if (!user) return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

			// if the user is found but the password is wrong
			if (!user.validPassword(password)) return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

			// set token, save to user
			user.token = setRedisToken(user);
			user.save(function (err) {

				if (err) console.error(err);

				// all is well, return successful user
				return done(null, user);
			});
		});
	}));


	

	

	// tiles access token

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
		r.set(key, token);
		
		// return token
		return token;
	}


};