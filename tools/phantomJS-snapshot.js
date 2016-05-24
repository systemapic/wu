var WebPage = require('webpage');
var system = require('system');
var args = JSON.parse(system.args[1]);
var outPath = args.outPath || '/tmp/screenshot.png';
var url = args.url;// || 'https://dev.systemapic.com/';

page = WebPage.create();
page.viewportSize = { width : 1620, height: 1080 };	// set size...
page.open(url, 'get', function (status, why) {

	// timeout after 30 secs
	setTimeout(phantom.exit, 30000);
	
	// pings from client
	page.onCallback = function(data){
		var dataTextObj = {};

		try {
			dataTextObj = JSON.parse(data.text);	
		} catch (e) {
			dataTextObj = {}
		}

		// feedback

		if (dataTextObj.error) {
			console.log(data.text);
			phantom.exit(1);
		}

		console.log("ping: " + data.text);

		// all done, capture!
		if (data.text == 'ready') {
			console.log('Capturing...', outPath);
			page.render(outPath);
			phantom.exit();
		}
	};

	// check for app, and develop view when ready
	setInterval(function () {
		page.evaluate(function (view) {
			if (!window.app || !window.app.phantomjs) return;
			if (window.app._phantomInited) return;

			// inject project
			window.app._phantomInited = true;
			window.app.tokens.access_token = view.access_token;
			window.app.phantomjs.develop(view);
			
		}, args.view);
	}, 500);

});






