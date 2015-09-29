var winston = require('winston');

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

		// console
		new winston.transports.Console({
			colorize : true
		}),
	],
});

// globally pipe console to winston
console.log = logger.info;
console.error = logger.error;

// exports
module.exports = api.log = { 
	winston : logger
}