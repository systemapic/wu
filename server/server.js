// server.js
var express  = require('express.io');
var mongoose = require('mongoose');
var flash    = require('connect-flash');
var path     = require('path');
var compress = require('compression');
var favicon  = require('serve-favicon');
var cors     = require('cors');
var morgan   = require('morgan');
var session  = require('express-session');
var multipart = require('connect-multiparty');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser'); 
var clientSession = require('client-sessions');
var fs = require('fs');

// api
var api = require('../api/api');
var config = api.config;
var port = config.port;

// socket enabled server
var app = express().http().io();

// connect to our database
var sessionStore = mongoose.connect(config.mongo.url); 

// set up our express application
app.use(bodyParser.urlencoded({limit: '2000mb', extended : true}));
app.use(bodyParser.json({limit:'2000mb'}));
app.set('view engine', 'ejs'); // set up ejs for templating
app.use(multipart()); // for resumable.js uploads

// cookie session options
var sessionOptions = {
	cookieName: 'session',
	secret: 'eg[isfd-8yF9-7w233315df{}+Ijsli;;to8', 
	duration: 24 * 60 * 60 * 1000, // 24h
	activeDuration: 60 * 60 * 1000, // 1h
	cookie: {
		path: '/', 
		ephemeral: false, // when true, cookie expires when the browser closes
		httpOnly: true, // when true, cookie is not accessible from javascript
		secureProxy : true,
	}
};

// use cookie session
app.use(clientSession(sessionOptions));

// socket auth middleware
app.io.use(function(socket, next){
	if (!socket || !socket.headers || !socket.headers.cookie) return next(new Error('No socket, fatal.'));
	var a = socket.headers.cookie.split('=');
	var decoded_cookie = clientSession.util.decode(sessionOptions, a[a.length-1]);
	if (!decoded_cookie) return next(new Error('Invalid access token.'));
	var tokens = decoded_cookie.content ? decoded_cookie.content.tokens : false;
	if (!tokens || !tokens.access_token) return next(new Error('Invalid access token.')); // public will fail here, returns 500...
	api.token._authenticate(tokens.access_token, function (err, user) {
				console.log("TEST!!!")
		if (err) return next(err);
		socket.session = socket.session || {};
		socket.session.user_id = user._id;
		next();
	});
});

// app.use(flash());
app.use(favicon(__dirname + '/../public/images/favicon.ico'));

// enable compression
app.use(compress());
app.use(cors());

// static files
var staticPath = '../public';
app.use(express.static(path.join(__dirname, staticPath)));
app.use(express.static(process.cwd() + '../views/debug'));

// catch route errors
app.use(function(err, req, res, next){ 
	err.status === 400 ? res.render('../../views/index.ejs') : next(err);
});

// load our routes and pass in our app
require('../routes/routes.js')(app);

// load our socket api
require('../routes/socket.routes.js')(app);

// launch 
var server = app.listen(port);

// brag
console.log('The magic happens @ ', port);
