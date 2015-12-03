// create page
var page = require('webpage').create(),
	system = require('system'),
	address, output, size;

// parse args
var args = JSON.parse(system.args[1]);

// get vars
var projectUuid = args.projectUuid;
var hash        = args.hash;
var path        = args.path;
var isPdf 	= args.pdf;
var isThumb     = args.thumb;
var serverUrl   = args.serverUrl;
var serverData  = args.serverData;
var outfile 	= path;

console.log('a2rgs: ', args);

console.log('SERVER URL :', serverUrl);
console.log('DATA: ', serverData);

console.log('isPdf', isPdf);
console.log('outfile', outfile);

// connect
var page = require('webpage').create(),
	server = serverUrl,
	data = serverData;    // phantomJS account
									// todo: create phantomjs user with changing password..
// revv phantomjs
page.viewportSize = { width : 1620, height: 1080 };	// set size...
page.open(server, 'post', data, function (status, why) {
	
	console.log('phtantomJS open!', status)
	
	// if not success, exit
	if (status !== 'success') return phantom.exit();
	
	console.log('PHTANTOM SUCCESS!!');


	// // // interact with page
	// page.evaluate(function(args) {
		
	// 	// init for phantomJS
	// 	if (app) app._setPhantomArgs(args);

	// }, args);



	console.log('phantom after evaluate...');


	
	waitFor(function () {
		console.log('checking...', JSON.stringify(args));

		// Check in the page if a specific element is now visible
		return page.evaluate(function(args) {

			if (!app) return false;
			if (!app.Projects) return false;

			if (!app._isPhantom) app.phantomJS(args);

			return app.phantomReady();
		}, args);
	}, 

	// callback
	function () {
		
		console.log('loaded!!1');

		setTimeout(function () {
			page.viewportSize = { width : 1620, height: 1080 };
			page.render(outfile);
			phantom.exit();
		}, 1000);

		

	});
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
					page.viewportSize = { width : 1620, height: 1080 };
					page.render(outfile);
					phantom.exit();
					// phantom.exit(1);
				} else {
					// Condition fulfilled (timeout and/or condition is 'true')
					console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
					typeof(onReady) === "string" ? eval(onReady) : onReady(); //< Do what it's supposed to do once the condition is fulfilled
					clearInterval(interval); //< Stop this interval
				}
			}
		}, 250); //< repeat check every 250ms
};



