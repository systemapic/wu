var fs = require('fs-extra');
var domain =  'https://' + process.env.SYSTEMAPIC_DOMAIN;
var config = fs.readJsonSync('../apidoc.json');

//update the object
config.sampleUrl = domain;

//update the file with new object
fs.outputJsonSync('../apidoc.json', config);