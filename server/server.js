// server.js
var express  = require('express.io');
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var path     = require('path');
var compress = require('compression');
var favicon  = require('serve-favicon');
var cors     = require('cors');
var morgan   = require('morgan');
var session  = require('express-session');
var prodMode = (process.argv[2] == 'prod');
var multipart = require('connect-multiparty');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser'); 
var clientSession = require('client-sessions');

// api
var api = require('../api/api');
var config = api.config;
var port = config.port;

// socket enabled server
app = express().http().io();

// connect to our database
var sessionStore = mongoose.connect(config.mongo.url); 

// pass passport for configuration
// require('./passport')(passport); 

// set up our express application
// app.use(cookieParser());
app.use(bodyParser.urlencoded({limit: '2000mb', extended : true}));
app.use(bodyParser.json({limit:'2000mb'}));
app.set('view engine', 'ejs'); // set up ejs for templating
app.use(multipart()); // for resumable.js uploads
// app.use(morgan('dev')); 

// required for passport
// var secret = api.utils.getRandom(40);
// console.log('secret:', secret);
// app.use(express.session({
// 	secret: secret,  // random
//         saveUninitialized: true,
//         resave: true,
// }));


// cookie session options
var sessionOptions = {
	cookieName: 'session',
	secret: 'eg[isfd-8yF9-7w233315df{}+Ijsli;;to8',
	duration: 30 * 60 * 1000,
	activeDuration: 5 * 60 * 1000,
	cookie: {
		path: '/', // cookie will only be sent to requests under '/api'
		ephemeral: false, // when true, cookie expires when the browser closes
		httpOnly: true, // when true, cookie is not accessible from javascript
		secureProxy : true,
	}
};

// use cookie session
app.use(clientSession(sessionOptions));

// socket auth middleware
app.io.use(function(socket, next){
	if (!socket || !socket.headers || !socket.headers.cookie) return next('invalid');
	var a = socket.headers.cookie.split('=');
	var decoded_cookie = clientSession.util.decode(sessionOptions, a[a.length-1]);
	if (!decoded_cookie) return next(new Error('Invalid access token.'));
	var tokens = decoded_cookie.content ? decoded_cookie.content.tokens : false;
	if (!tokens || !tokens.access_token) return next(new Error('Invalid access token.'));
	api.token.authenticate_socket(tokens.access_token, function (err, user) {
		if (err) return next(err);
		socket.session = socket.session || {};
		socket.session.user_id = user._id;
		next();
	});
});


// app.use(function(req, res, next) {

	// ok 	- so user goes to / (for first time). 
	// 	- is then logged in as public user, and access_token is stored in session
	// 	- will never be "logged out", as being logged out means you're a public user
	// 	 
	//	- user wants to log in to own account. sends user/pass, gets access_token in return. 
	//		- here session must be updated with new access_token
	//	- user closes browser.
	// 	- hour later (session still alive), goes to /
	// 		- here must check session for access_token. 
	// 		- if exists, user is logged in - and must receive creds
	//
	//	- this is for several routes, eg. /, /public/project, etc. 
	//	- problem is, the user needs to "init" with a token request, 
	// 		- so if no access_token on user, then ask for token with session, get user back..?
	// 		- then use access_token (or need to enter user/pass)
	// 		-  


	// example: GET /public/projectname
	// 		- not logged in
	//		- will be given `public` user + access_token
	// 		- will be asked if wants to log in, or can click login
	// 		- got access as `public`

	// example: GET /public/projectname
	// 		- is logged in as public
	// 		- logs in as user, ie. sends user/pass for access_token (session updated with new access_token)
	//		- updates local app.Account with new user/token
	//		- session is updated server-side with new access_token
	//		-
	//		- * closes browser
	// 		-
	//		- again GET /public/projectname
	//		- session now holds user's access_token, will be authenticated without user/pass
	
	// example: POST /api/user/info
	//		- checks to see if logged in, ie. if got valid access_token in session
	//		- returns user or public - always
	//		- if public, choice to login
	//		- if user, all good, already authenticated

	// 	- app.js must always make a POST request to /api/user/info at start, to check access_token.
	//	- that's where everything starts. 


	// console.log('middleware: req.session: ', req.session, req.connection)
	// next();
	// if (req.session && req.session.user) {
	// 	User.findOne({ email: req.session.user.email }, function(err, user) {
	// 		if (user) {
	// 			req.user = user;
	// 			delete req.user.password; // delete the password from the session
	// 			req.session.user = user;  //refresh the session value
	// 			res.locals.user = user;
	// 		}
	// 		// finishing processing the middleware and run the route
	// 		next();
	// 	});
	// } else {
	// 	req.
	// 	next();
	// }
// });

// enable passport
// app.use(passport.initialize());
// app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(favicon(__dirname + '/../public/images/favicon.ico'));

// enable compression
app.use(compress());
app.use(cors());

// static files
var staticPath = '../public';
app.use(express.static(path.join(__dirname, staticPath)));

// load our routes and pass in our app and fully configured passport
// require('../routes/routes.js')(app, passport);
require('../routes/routes.js')(app);

// load our socket api
// require('../routes/socket.routes.js')(app, passport);
require('../routes/socket.routes.js')(app);

// catch route errors
app.use(function(err, req, res, next){ 
	err.status === 400 ? res.render('../../views/index.ejs') : next(err);
});

// launch 
var server = app.listen(port);

// brag
console.log('The magic happens @ ', port);

// debug cleanup
api.upload._deleteDoneChunks();
