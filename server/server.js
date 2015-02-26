// server.js
var express  = require('express');
var app      = express();
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var path     = require('path');
var compress = require('compression')
var favicon  = require('serve-favicon');
var cors     = require('cors');
var bodyParser = require('body-parser');
var morgan   = require('morgan');
var cookieParser = require('cookie-parser'); 
var session  = require('express-session');
var configDB = require('../config/database.js');
var port     = 3001;
var prodMode = process.argv[2] == 'production';

// mute console in production mode
if (prodMode) {
	console.log = function (){};
	console.time = function () {};
	console.timeEnd = function () {};
}

// connect to our database
mongoose.connect(configDB.url); 

// pass passport for configuration
require('../config/passport')(passport); 

// set up our express application
app.use(morgan('dev')); 
app.use(cookieParser());
app.use(bodyParser.urlencoded({limit: '2000mb', extended : true}));
app.use(bodyParser.json({limit:'2000mb'}));
app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
	secret: 'dslfksmdfldskfnlxxsadknvvlovn908209309fmsfmdslkm', 
        saveUninitialized: true,
        resave: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(favicon(__dirname + '/../dist/css/favicon.ico'));

// enable compression
app.use(compress());
app.use(cors());

// static files
var staticPath = prodMode ? '../dist' : '../public';
app.use(express.static(path.join(__dirname, staticPath)));

// load our routes and pass in our app and fully configured passport
require('../routes/routes.js')(app, passport);

// launch 
app.listen(port, 'localhost');
console.log('The magic happens on port ' + port);
