module.exports = {

	_ : 'Example config file for Systemapic Portal',


  	kueRedis : {
		port : 6380,
		host : '',
		auth : ''
	},

	tokenRedis : {
		// px
		port : 6379,
		host : '',
		auth : ''
	},


	temptokenRedis : {
		port : 6379,
		host : '',
		auth : ''
	},

	vile : {
		uri : 'http://localhost:3003/'
	},

	vileosm : {
		uri : 'https://m.systemapic.com/'
	},

	portalServer : {
		uri : 'https://maps.systemapic.com/'
	},

	defaultMapboxAccount : {
		username : '',
		accessToken : ''
	},

	phantomJS : {
		// phantomJS login
		data : 'email=user@org.com&password=1337'
	},

	
	nodemailer : {
		service: 'gmail',
		auth: {
			user: '',
			pass: ''
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
			superAdmin : 'role-uuid',
			portalAdmin : 'role-uuid'
		},
	}
}