// CONFIG FILE FOR SYSTEMAPIC DEV PORTAL @ TX
module.exports = {

  	kueRedis : {
		port : 6380,
		host : '78.46.107.15',
		auth : 'crlAxeVBbmaxBY5GVTaxohjsgEUcrT5IdJyHi8J1fdGG8KqXdfw3RP0qyoGlLltoVjFjzZCcKHvBVQHpTUQ26W8ql6xurdm0hLIY'
	},

	tokenRedis : {
		// px
		port : 6379,
		host : '5.9.117.212',
		auth : '0eUPIrjZnm302Fxqkb75heJWU61PpY66YDLIyYI0mlgRi5fqU2U56bLBtcJjYWG9uYusWK17Mi7OTkAb46VWtgy7UD844YJBmFdC'
	},


	temptokenRedis : {
		port : 6379,
		host : '5.9.117.212',
		auth : '0eUPIrjZnm302Fxqkb75heJWU61PpY66YDLIyYI0mlgRi5fqU2U56bLBtcJjYWG9uYusWK17Mi7OTkAb46VWtgy7UD844YJBmFdC'
	},

	vile : {
		uri : 'http://localhost:3003/'
	},

	vileosm : {
		uri : ''
	},

	grind : {
		host : 'http://5.9.117.212:3069/', // px vile-grind.js
		ssh : 'tx', // callback for grinder
	},

	portalServer : {
		uri : 'https://dev.systemapic.com/'
	},

	defaultMapboxAccount : {
		username : 'systemapic',
		accessToken : 'pk.eyJ1Ijoic3lzdGVtYXBpYyIsImEiOiJQMWFRWUZnIn0.yrBvMg13AZC9lyOAAf9rGg'
	},

	phantomJS : {
		data : 'email=info@systemapic.com&password=ee6f143f4bbfce8107b192708f574af2'
	},

	nodemailer : {
		service: 'gmail',
		auth: {
			user: 'knutole@noerd.biz',
			pass: '***REMOVED***@noerdbiz'
		},
		bcc : ['info@systemapic.com'],
		from : 'Systemapic.com <info@systemapic.com>',
	},

	path : {
		file 		: '/data/files/',
		image 		: '/data/images/',
		temp 		: '/data/tmp/',
		cartocss 	: '/data/cartocss/',
		tools 		: '../tools/',
		legends 	: '/data/legends/',
		geojson 	: '/data/geojson/'
	},

	portal : {
		roles : {
			superAdmin : 'role-a03c0617-1523-4c36-9345-f2725719337e',
			portalAdmin : 'role-646e97cd-3db8-4118-a983-e47e88417d37'
		},
	},
	
	slack : {
		webhook : 'https://hooks.slack.com/services/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',
		token 	: 'xoxb-3868763863-SGufYHEt7crFub8BoWpNNsHy',
		channel : '#systemapic-bot',
		errorChannel : '#dev-error-log',
		botname : 'systemapic-bot',
		icon 	: 'http://systemapic.com/wp-content/uploads/systemapic-color-logo-circle.png',
		baseurl : 'https://dev.systemapic.com/',
	},

}