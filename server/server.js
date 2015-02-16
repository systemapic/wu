// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
// var port     = process.env.PORT || 80;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var path     = require('path');
var compress = require('compression')
var favicon  = require('serve-favicon');

// express 4
var bodyParser  = require('body-parser');
var morgan 	= require('morgan');
var cookieParser = require('cookie-parser'); 
var session  = require('express-session');
	

var configDB = require('../config/database.js');
var cors = require('cors');
var port = 3001;

var prodMode;

// mute console in production mode
if (process.argv[2] == 'production') {
	console.log = function (){};
	console.time = function () {};
	console.timeEnd = function () {};
	prodMode = true;
}



// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('../config/passport')(passport); // pass passport for configuration

// app.configure(function() {

	// set up our express application
	// app.use(express.logger('dev')); // log every request to the console
	// app.use(express.cookieParser()); // read cookies (needed for auth)
	app.use(morgan('dev')); 
	app.use(cookieParser());


	// app.use(bodyParser({limit: '5000mb'})); // get information from html forms
	// app.use(bodyParser.raw({limit: '500mb'}));
	// app.use(bodyParser.text({limit: '500mb'}));
	app.use(bodyParser.urlencoded({limit: '500mb', extended : true}));
	app.use(bodyParser.json({limit:'500mb'}));
	
	app.set('view engine', 'ejs'); // set up ejs for templating

	// required for passport
	app.use(session({secret: 'dslfksmdfldskfnlxxsadknvvlovn908209309fmsfmdslkm', 
                 saveUninitialized: true,
                 resave: true}));
	app.use(passport.initialize());
	app.use(passport.session()); // persistent login sessions
	app.use(flash()); // use connect-flash for flash messages stored in session
	app.use(favicon(__dirname + '/../dist/css/favicon.ico'));

	// enable compression
	app.use(compress());

	app.use(cors());
	

	// static files
	if (prodMode) {
		app.use(express.static(path.join(__dirname, '../dist')));
	} else {
		app.use(express.static(path.join(__dirname, '../public')));
	}

// });

// routes ======================================================================
require('../routes/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport


// launch ======================================================================
app.listen(port, 'localhost');
console.log('The magic happens on port ' + port);


