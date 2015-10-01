var winston = require('winston');
var _ = require('lodash-node');

// api
var api = module.parent.exports;

// logger
var logger = new (winston.Logger)({
	
	transports: [

		// all console.log's
		new winston.transports.File({ 
			filename: api.config.path.log + 'wu.log',
			name : 'info',
			level : 'info',
			prettyPrint : true,
			json : true,
			maxsize : 10000000 // 10MB
		}),
		
		// console.errors
		new winston.transports.File({
			filename: api.config.path.log + 'wu.error.log',
			name : 'error',
			level : 'error',
			eol : '\n\n',
			prettyPrint : true,
			json : true,
			maxsize : 10000000 // 10MB
		}),

	],
});


// globally pipe console to winston
console.log = function () {
	var arr = _.toArray(arguments);
	console.info(arr);
	// console.info(arr.join(' '));
	logger.info(arguments);
}
console.error = function () {
	var arr = _.toArray(arguments);
	console.info(arr.join(' '));
	logger.error(arguments);
}

// exports
module.exports = api.log = { 
	winston : logger
}