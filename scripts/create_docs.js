var fs = require('fs-extra');
var domain =  'https://' + process.env.SYSTEMAPIC_DOMAIN;
var Path = require('path');
var config = fs.readJsonSync(Path.resolve('./apidoc.json'));

//update the object
config.sampleUrl = domain;

//update the file with new object
fs.outputJsonSync('../apidoc.json', config);