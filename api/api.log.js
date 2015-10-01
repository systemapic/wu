var winston = require('winston');
var _ = require('lodash-node');

// api
var api = module.parent.exports;

// logger
var winston_logger = new (winston.Logger)({
	
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
	try {
		var arr = _.toArray(arguments);
		console.info(arr);
		winston_logger.info(arguments);

	} catch (e) {
		console.info('CONSOLE ERROR 1', e);
	}
}
console.error = function () {
	try {
		var arr = _.toArray(arguments);
		console.info(arr.join(' '));
		winston_logger.error(arguments);
	} catch (e) {
		console.info('CONSOLE.ERROR', e);
	}
}

// exports
module.exports = api.log = { 
	winston : winston_logger
}