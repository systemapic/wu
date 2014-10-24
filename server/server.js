// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var path     = require('path');
var compress = require('compression')
var favicon  = require('serve-favicon');

var configDB = require('../config/database.js');
var cors = require('cors');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('../config/passport')(passport); // pass passport for configuration

app.configure(function() {

	// set up our express application
	app.use(express.logger('dev')); // log every request to the console
	app.use(express.cookieParser()); // read cookies (needed for auth)
	app.use(express.bodyParser({limit: '50mb'})); // get information from html forms
	
	app.set('view engine', 'ejs'); // set up ejs for templating

	// required for passport
	app.use(express.session({ secret: '54cd7845-0341-4d07-92ef-11e4120fca31' })); // session secret
	app.use(passport.initialize());
	app.use(passport.session()); // persistent login sessions
	app.use(flash()); // use connect-flash for flash messages stored in session
	app.use(favicon(__dirname + '/../public/dist/favicon.ico'));

	// enable compression
	app.use(compress());

	app.use(cors());
	

	// static files
	app.use(express.static(path.join(__dirname, '../public')));

});

// routes ======================================================================
require('../routes/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport


// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);


