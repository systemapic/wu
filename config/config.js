// CONFIG FILE FOR SYSTEMAPIC PORTAL @ SX
module.exports = {

  	kueRedis : {
		port : 6380,
		host : '85.10.202.87',
		auth : 'yxOC02RYRSzVzCngC4wVomCJRzKTjV520uBDbRXmKB3cvwzfoDhvx7K6qiHnrIDB6gqZH7Jk6OWYpnp4OOWQPf9TDXC4ibRCkSNu'
	},

	tokenRedis : {
		// px
		port : 6379,
		host : '5.9.117.212',
		auth : '0eUPIrjZnm302Fxqkb75heJWU61PpY66YDLIyYI0mlgRi5fqU2U56bLBtcJjYWG9uYusWK17Mi7OTkAb46VWtgy7UD844YJBmFdC'
	},


	temptokenRedis : {
		// px
		port : 6379,
		host : '5.9.117.212',
		auth : '0eUPIrjZnm302Fxqkb75heJWU61PpY66YDLIyYI0mlgRi5fqU2U56bLBtcJjYWG9uYusWK17Mi7OTkAb46VWtgy7UD844YJBmFdC'
	},

	grind : {
		host : 'http://5.9.117.212:3069/', // px vile-grind.js
		ssh : 'sx' // callback to here
	},

	vile : {
		uri : 'http://localhost:3003/'
	},

	vileosm : {
		uri : 'https://m.systemapic.com/'
	},

	portalServer : {
		uri : 'https://projects.ruppellsgriffon.com/'
	},

	defaultMapboxAccount : {
		username : 'systemapic',
		accessToken : 'pk.eyJ1Ijoic3lzdGVtYXBpYyIsImEiOiJQMWFRWUZnIn0.yrBvMg13AZC9lyOAAf9rGg'
	},

	phantomJS : {
		// phantomJS login
		data : 'email=info@systemapic.com&password=7aaf4d2e168b7f02f936e2819fa39dfe'
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
			superAdmin : 'role-b29f95ba-4933-4fe1-92ea-a47810cd25a2',
			portalAdmin : 'role-b7b3ad6c-bc59-41ce-886b-5e544017f1a9'
		},
	},

	slack : {
		// domain : 'noerdbiz',
		webhook : 'https://hooks.slack.com/services/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',
		token 	: 'xoxb-3868763863-SGufYHEt7crFub8BoWpNNsHy',
		channel : '#systemapic-bot',
		errorChannel : '#error-log',
		botname : 'systemapic-bot',
		icon 	: 'https://maps.systemapic.com/css/images/systemapic-color-logo-circle.png',
		baseurl : 'https://projects.ruppellsgriffon.com/',
	}

	

}