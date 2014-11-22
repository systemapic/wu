// config/passport.js

// node-uuid
var uuid = require('node-uuid');

// load all the things we need
var LocalStrategy = require('passport-local').Strategy;

// load up the user model
var User = require('../models/user');



// redis, crypto
var crypto = require('crypto');
var redis = require('redis');
var config = require('../config/config');

// console.log('redis passport');
// console.log('config.tokenRedis.port', config.tokenRedis.port);
// console.log('config.tokenRedis.ip', config.tokenRedis.host);
// console.log('config.tokenRedis.auth', config.tokenRedis.auth);

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

		// console.log('LOGIN ATTEMPT!', email, password);

		// asynchronous
		// User.findOne wont fire unless data is sent back
		process.nextTick(function() {

			// find a user whose email is the same as the forms email
			// we are checking to see if the user trying to login already exists
			User.findOne({ 'local.email' :  email }, function(err, user) {
				// if there are any errors, return the error
				if (err)
					return done(err);

				// check to see if there's already a user with that email
				if (user) {
					return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
				} else {

					// if there is no user with that email
					// create the user
					var newUser            = new User();

					// set the user's local credentials
					newUser.local.email    = email;
					newUser.local.password = newUser.generateHash(password);
					newUser.uuid = 'user-' + uuid.v4();

					// save the user
					newUser.save(function(err) {
						if (err)
							throw err;
						return done(null, newUser);
					});
				}

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
	  

		// console.log('LOGIN ATTEMwPT!', email, password);

		// find a user whose email is the same as the forms email
		// we are checking to see if the user trying to login already exists
		User.findOne({ 'local.email' :  email }, function(err, user) {
			// if there are any errors, return the error before anything else
			console.log('err, user, ', err, user);

			if (err)
				return done(err);

			// if no user is found, return the message
			if (!user)
				return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

			// if the user is found but the password is wrong
			if (!user.validPassword(password))
				return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

			// console.log('redis');

			// set token, save to user
			user.token = setRedisToken(user);
			user.save(function (err) {
				// console.log('redis save, err', err);
				if (err) console.error(err);

				// all is well, return successful user
				return done(null, user);
			});
			
		});

	}));


	

	

	// tiles access token
	//
	// - set an access token for each time user logs in
	// - access token stored in redis
	// - redis replicated securely on tx
	// - checks if access token exists - lives forever
	// - new access token created each time user logs in, then the access token is dead
	//
	function setRedisToken(user) {

		// console.log('settoken', user);

		// keys
		var key = 'authToken-' + user._id;
		var tok = crypto.randomBytes(22).toString('hex');

		// async set
		r.set(key, tok);
		
		// return token
		return tok;
	}








};