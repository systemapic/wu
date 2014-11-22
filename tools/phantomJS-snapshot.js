var page = require('webpage').create(),
	system = require('system'),
	address, output, size;

var page = require('webpage').create(),
	server = 'https://projects.ruppellsgriffon.com/login',
	// server = 'https://127.0.0.1:3001/login',
	// data = 'email=knutole@noerd.biz&password=***REMOVED***@noerdbiz';    // unhashed passwords, rly? pgp?
	data = 'email=foudroyant@gmail.com&password=75d5ba93298d733b25159eab2a49876c';    // phantomJS account
									// todo: create phantomjs user with changing password..


console.log('server: ', server);
console.log('data: ', data);

console.log('args:::::!: ', args);
// parse args
var args = JSON.parse(system.args[1]);

// get vars
var projectUuid = args.projectUuid;
var hash        = args.hash;
var path        = args.path;
var isPdf 	= args.pdf;

// set file path
var outfile = path;

// revv phantomjs
page.viewportSize = { width : 1620, height: 1080 };	// set size...
page.open(server, 'post', data, function (status, why) {
	
	console.log('phtantomJS open!', status)
	
	// if not success, exit
	if (status !== 'success') return phantom.exit();
	
	console.log('PHTANTOM SUCCESS!!');


	// interact with page
	page.evaluate(function(args) {
		
		console.log('doing app.phantomJS(args)');
		console.log('args: ', args);

		// init for phantomJS
		if (app) app.phantomJS(args);

	}, args);



	console.log('phantom after evaluate...');


	
	waitFor(function () {

		// wait for all ready

		// Check in the page if a specific element is now visible
		return page.evaluate(function() {
			if (!app) return false;
			return app.phantomReady();
		});
	}, 

	// callback
	function () {
		// interact with page
		// page.evaluate(function(args) {
			
		// 	// init for phantomJS
		// 	if (app) app.phantomJS(args);

		// }, args);

		console.log('loaded!!');

		page.viewportSize = { width : 1620, height: 1080 };
		page.render(outfile);
		phantom.exit();



	});

	// capture
	// window.setTimeout(function () {
	// 	page.viewportSize = { width : 1620, height: 1080 };
	// 	page.render(outfile);
	// 	phantom.exit();
	// }, 7000);
	

});


// waitFor helper fn
function waitFor(testFx, onReady, timeOutMillis) {
	var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 5000, //< Default Max Timout is 3s
		start = new Date().getTime(),
		condition = false,
		interval = setInterval(function() {
			if ( (new Date().getTime() - start < maxtimeOutMillis) && !condition ) {
				// If not time-out yet and condition not yet fulfilled
				condition = (typeof(testFx) === "string" ? eval(testFx) : testFx()); //< defensive code
			} else {
				if(!condition) {
					// If condition still not fulfilled (timeout but condition is 'false')
					console.log("'waitFor()' timeout");
					phantom.exit(1);
				} else {
					// Condition fulfilled (timeout and/or condition is 'true')
					console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
					typeof(onReady) === "string" ? eval(onReady) : onReady(); //< Do what it's supposed to do once the condition is fulfilled
					clearInterval(interval); //< Stop this interval
				}
			}
		}, 250); //< repeat check every 250ms
};



