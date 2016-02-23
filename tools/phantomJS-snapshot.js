var WebPage = require('webpage');
var system = require('system');
var url = 'https://dev.systemapic.com';
// parse args

console.log('PHANTOM $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$')
console.log('');
console.log('');
console.log('');
console.log('');
console.log('');
console.log('');
console.log('');
console.log('');
console.log('');
console.log('');
console.log('');

console.log('systyem', system.args)

var args = JSON.parse(system.args[1]);

console.log('args: ', args);

var outPath = args.outPath || '/tmp/screenshot.png';
console.log('outPath', outPath);

var url = args.url;// || 'https://dev.systemapic.com/';
var view_string = JSON.stringify(args.view);// || {"project_id":"project-67c0fa3b-723d-43d6-9a09-56ce12cec6c7","position":{"lat":0,"lng":73.564453125,"zoom":3},"layers":["layer-b554dc0d-a61d-4684-aed8-fb22c016e89e","layer-5b6b209a-76c0-4313-af6b-762ffc9681e0","layer-061984fb-367c-4ee9-ac6c-84696276fe6b"]};

var passed_var = JSON.stringify({
	test : 'ok'
});

console.log('url:', url);
console.log('view: ', view_string);

page = WebPage.create();
page.viewportSize = { width : 1620, height: 1080 };	// set size...
page.open(url, 'get', function (status, why) {
	
	console.log('status: ', status);

	// pings from client
	page.onCallback = function(data){

		// feedback
		console.log("ping: " + data.text);

		// all done, capture!
		if (data.text == 'ready') {
			console.log('Capturing...');
			console.log('writing to ', outPath);
			page.render(outPath);
			phantom.exit();
		}
	};

	// check for app, and develop view when ready
	setInterval(function () {
		page.evaluate(function (view) {
			if (!window.app || !window.app.phantomjs) return;
			if (window.app._phantomInited) return;
			window.app._phantomInited = true;

			window.app.tokens.access_token = view.access_token;
			window.app.phantomjs.develop(view);
		}, args.view);
	}, 500);

});


























// // create page
// var page = require('webpage').create(),
// 	system = require('system'),
// 	address, output, size;

// // parse args
// var args = JSON.parse(system.args[1]);

// // get vars
// var projectUuid = args.projectUuid;
// var hash        = args.hash;
// var path        = args.path;
// var isPdf 	= args.pdf;
// var isThumb     = args.thumb;
// var serverUrl   = args.serverUrl;
// var serverData  = args.serverData;
// var outfile 	= path;

// // console.log('a2rgs: ', args);

// // console.log('SERVER URL :', serverUrl);
// // console.log('DATA: ', serverData);

// // console.log('isPdf', isPdf);
// // console.log('outfile', outfile);

// // connect
// var page = require('webpage').create(),
// 	server = serverUrl,
// 	data = serverData;    // phantomJS account


// page.onCallback = function(data){
// 	console.log("finished: " + data.text);
// 	page.viewportSize = { width : 1620, height: 1080 };
// 	page.render(outfile);
// 	phantom.exit();
//     // phantom.exit();
// };

// 									// todo: create phantomjs user with changing password..
// // revv phantomjs
// page.viewportSize = { width : 1620, height: 1080 };	// set size...
// page.open(server, 'get', function (status, why) {
	
// 	// console.log('phtantomJS open!', status)
	
// 	// if not success, exit
// 	if (status !== 'success') return phantom.exit();
	
// 	// console.log('PHTANTOM SUCCESS!!');


// 	// // // interact with page
// 	// page.evaluate(function(args) {
		
// 	// 	// init for phantomJS
// 	// 	if (app) app._setPhantomArgs(args);

// 	// }, args);



// 	// console.log('phantom after evaluate...');

// 	waitFor(function () {
// 		// console.log('checking... STRINGIFIED =>', JSON.stringify(args));

// 		console.log('    SUNGLASSES ---->>>     ')
// 		console.log('args.access_token', args.access_token);
// 		console.log('args.projectUuid', args.projectUuid);

// 		// Check in the page if a specific element is now visible
// 		var result = page.evaluate(function(args) {

// 			console.log('evaluating!');

// 			if (!app) return 'no app';
// 			// if (!app.Projects) return 'no projects';

			


// 			var p = new Wu.PhantomJS();

// 			p.get({
// 				project_id : args.projectUuid,
// 				user_access_token : args.access_token
// 			});

// 			// if (!app._isPhantom) {
// 			// 	setTimeout(function () {

// 			// 		app.phantomJS(args);
// 			// 	}, 1000);
// 			// }
// 			// return app.phantomReady();
// 			return false; // debug, will timeout
// 		}, args);

// 		console.log('result: ', result);

// 		return result === true;
// 	}, 

// 	// callback
// 	function () {
		
// 		console.log('loaded!!1');

// 		setTimeout(function () {
// 			page.viewportSize = { width : 1620, height: 1080 };
// 			page.render(outfile);
// 			phantom.exit();
// 		}, 5000);

		

// 	});
	
// 	// waitFor(function () {
// 	// 	console.log('checking...', JSON.stringify(args));

// 	// 	// Check in the page if a specific element is now visible
// 	// 	var result = page.evaluate(function(args) {

// 	// 		console.log('evaluating!');

// 	// 		if (!app) return 'no app';
// 	// 		if (!app.Projects) return 'no projects';

// 	// 		if (!app._isPhantom) {
// 	// 			setTimeout(function () {

// 	// 				app.phantomJS(args);
// 	// 			}, 1000);
// 	// 		}
// 	// 		return app.phantomReady();
// 	// 	}, args);

// 	// 	console.log('result: ', result);

// 	// 	return result === true;
// 	// }, 

// 	// // callback
// 	// function () {
		
// 	// 	console.log('loaded!!1');

// 	// 	setTimeout(function () {
// 	// 		page.viewportSize = { width : 1620, height: 1080 };
// 	// 		page.render(outfile);
// 	// 		phantom.exit();
// 	// 	}, 5000);

		

// 	// });
// });


// // waitFor helper fn
// function waitFor(testFx, onReady, timeOutMillis) {
// 	var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 10000, //< Default Max Timout is 3s
// 		start = new Date().getTime(),
// 		condition = false,
// 		interval = setInterval(function() {
// 			if ( (new Date().getTime() - start < maxtimeOutMillis) && !condition ) {
// 				// If not time-out yet and condition not yet fulfilled
// 				condition = (typeof(testFx) === "string" ? eval(testFx) : testFx()); //< defensive code
// 			} else {
// 				if(!condition) {
// 					// If condition still not fulfilled (timeout but condition is 'false')
// 					console.log("'waitFor()' timeout");
// 					page.viewportSize = { width : 1620, height: 1080 };
// 					page.render(outfile);
// 					phantom.exit();
// 					// phantom.exit(1);
// 				} else {
// 					// Condition fulfilled (timeout and/or condition is 'true')
// 					console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
// 					typeof(onReady) === "string" ? eval(onReady) : onReady(); //< Do what it's supposed to do once the condition is fulfilled
// 					clearInterval(interval); //< Stop this interval
// 				}
// 			}
// 		}, 250); //< repeat check every 250ms
// };



