// server.js
var express  = require('express.io');
// var app      = require('express.io')();
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var path     = require('path');
var compress = require('compression')
var favicon  = require('serve-favicon');
var cors     = require('cors');
var morgan   = require('morgan');
var session  = require('express-session');
var configDB = require('../config/database.js');
var port     = 3001;
var host     = 'nginx';
var prodMode = process.argv[2] == 'production';
var multipart = require('connect-multiparty');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser'); 


// app.http().io()


app = express().http().io()

// mute console in production mode
if (prodMode) {
	var nullFn = function () {};
	console.log = nullFn;
	console.time = nullFn;
	console.timeEnd = nullFn;
}

// connect to our database
var sessionStore = mongoose.connect(configDB.url); 

// pass passport for configuration
require('../config/passport')(passport); 

// set up our express application
app.use(morgan('dev')); 
app.use(cookieParser());
app.use(bodyParser.urlencoded({limit: '2000mb', extended : true}));
app.use(bodyParser.json({limit:'2000mb'}));
app.set('view engine', 'ejs'); // set up ejs for templating
app.use(multipart()); // for resumable.js uploads

// required for passport
app.use(express.session({
	secret: 'dslfksmdfldskfnlxxsadknvvlovn908209309fmsfmdslkm', 
        saveUninitialized: true,
        resave: true,
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

// load our socket api
require('../routes/socket.routes.js')(app, passport);


// launch 
var server = app.listen(port, host);


console.log('The magic happens @ ', port, host);
