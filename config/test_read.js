var fs = require('fs');


// write to config file
// var configFile = fs.readFileSync('./server-config.js');
// var configObject = JSON.parse(configFile);

// console.log('configObject', configObject);

var configFile = require('./server-config.js');

console.log('foncif', configFile, typeof(configFile));

var text = JSON.stringify(configFile, null, '\t');

console.log('text', text);

var output = 'module.exports = ' + text;

console.log('output', output);