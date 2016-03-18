var fs = require('fs-extra');
var domain =  'https://' + process.env.SYSTEMAPIC_DOMAIN;
var Path = require('path');

//update or copy apidoc file from apidoc.template and add sampleUrl from domain
fs.exists('./apidoc.json', function (exist) {
	var config = {};

	if (exist) {
		config = fs.readJsonSync(Path.resolve('./apidoc.json'));
		config.sampleUrl = domain;

		fs.outputJsonSync('./apidoc.json', config);
	} else {
		fs.copy('./apidoc.json.template', './apidoc.json', { replace: false }, function (err) {
		    if (err) {
		    	console.log("Error with copy apidoc.json.template to apidoc.json:", err);
		    	return;
		    }

			config = fs.readJsonSync(Path.resolve('./apidoc.json'));
			//update the object
			config.sampleUrl = domain;

			fs.outputJsonSync('./apidoc.json', config);
		});
	}
});