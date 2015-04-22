module.exports = {

	serverConfig : {

		"port": 3001,
		"mongo": {
			"url": "mongodb://mongo/systemapic"
		},
		"kueRedis": {
			"port": 6379,
			"host": "rkue",
			"auth": "crlAxeVBbmaxBY5GVTaxohjsgEUcrT5IdJyHi8J1fdGG8KqXdfw3RP0qyoGlLltoVjFjzZCcKHvBVQHpTUQ26W8ql6xurdm0hLIY"
		},
		"tokenRedis": {
			"port": 6379,
			"host": "rtoken",
			"auth": "9p7bRrd7Zo9oFbxVJIhI09pBq6KiOBvU4C76SmzCkqKlEPLHVR02TN2I40lmT9WjxFiFuBOpC2BGwTnzKyYTkMAQ21toWguG7SZE"
		},
		"temptokenRedis": {
			"port": 6379,
			"host": "rtoken",
			"auth": "9p7bRrd7Zo9oFbxVJIhI09pBq6KiOBvU4C76SmzCkqKlEPLHVR02TN2I40lmT9WjxFiFuBOpC2BGwTnzKyYTkMAQ21toWguG7SZE"
		},
		"slack": {
			"webhook": "https://hooks.slack.com/services/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",
			"token": "xoxb-3868763863-SGufYHEt7crFub8BoWpNNsHy",
			"channel": "#systemapic-bot",
			"errorChannel": "#dev-error-log",
			"botname": "systemapic-bot",
			"icon": "http://systemapic.com/wp-content/uploads/systemapic-color-logo-circle.png",
			"baseurl": "https://dev.systemapic.com/"
		},
		"vile": {
			"uri": "http://vile:3003/",
			"link": "vile",
			"port": "3003"
		},
		"vile_grind" : {
			"remote_ssh" : "px_vile_grind",
			"remote_url" : "http://5.9.117.212:3004/",
			"sender_ssh" : "tx_data_store", // from PX back to TX
			"sender_url" : "https://dev.systemapic.com/"
		},
		// "vileGrind": {
		// 	"uri": "http://5.9.117.212:3069/",
		// 	"link": "vileGrind",
		// 	"port": "3069"
		// },
		"vileosm": {
			"uri": ""
		},
		"grind": {
			"host": "http://5.9.117.212:3004/",
			"ssh": "tx"
		},
		"portalServer": {
			"uri": "https://dev.systemapic.com/"
		},
		"defaultMapboxAccount": {
			"username": "systemapic",
			"accessToken": "pk.eyJ1Ijoic3lzdGVtYXBpYyIsImEiOiJQMWFRWUZnIn0.yrBvMg13AZC9lyOAAf9rGg"
		},
		"phantomJS": {
			"data": "email=info@systemapic.com&password=ee6f143f4bbfce8107b192708f574af2"
		},
		"nodemailer": {
			"service": "gmail",
			"auth": {
				"user": "knutole@noerd.biz",
				"pass": "***REMOVED***@noerdbiz"
			},
			"bcc": [
				"info@systemapic.com"
			],
			"from": "Systemapic.com <info@systemapic.com>"
		},
		"path": {
			"file": "/data/files/",
			"image": "/data/images/",
			"temp": "/data/tmp/",
			"cartocss": "/data/cartocss/",
			"tools": "../tools/",
			"legends": "/data/legends/",
			"geojson": "/data/geojson/"
		},
		"portal": {
			"roles": {
				"superAdmin": "role-94e0a932-6395-482a-8a74-f8319fa6eac2",
				"portalAdmin": "role-d00898ce-4efb-40a5-b6f7-8aa9a8a18eb1"
			}
		},
	},


	loginConfig : {

		// gl : true,
		autoStart : true,
		accessToken : 'pk.eyJ1Ijoic3lzdGVtYXBpYyIsImEiOiJkV2JONUNVIn0.TJrzQrsehgz_NAfuF8Sr1Q',
		layer : 'systemapic.kcjonn12',
		logo : 'css/images/systemapic-login-logo.png',
		// logo : 'css/images/ruppellsgriffon_logo.png',
		wrapper : false,
		speed : 1000,
		position : {
			// lat : -33.83214, // sydney
			// lng : 151.22299,
			// zoom : [4, 18],
			lat : 59.942, // oslo
			lng : 10.716,
			zoom : [4, 14]
		},
		circle : {
			radius : 120, 
			color : 'rgba(247, 175, 38, 0.3)',
			border : {
				px : 4,
				solid : 'solid',
				color : 'white'
			}
		},

		ga : {
			id : 'UA-57572003-2'
		}
	},

	clientConfig : {

		id : 'app',

		portalName : 'systemapic',	// plugged in
		portalLogo : false,		// not plugged in.. using sprites atm..
		portalTitle : '[dev] Systemapic Secure Portal',
		
		// sidepane
		panes : {
			// plugged in and working! :)
			clients 	: true,
			options 	: true,
			documents 	: true,               	
			dataLibrary 	: true,               	
			users 		: true,
			share 		: true,
			mediaLibrary    : false,
			account 	: true
		},	

		logos : {
			projectDefault : '/css/images/grinders/BG-grinder-small-grayDark-on-white.gif',
		},
		
		// default settings (overridden by project settings)
		settings : {		// not plugged in yet
			chat : true,
			colorTheme : true,
			screenshot : true,
			socialSharing : true,
			print : true
		},

		defaults : {
			project : {
				position : {
					lat : -27.449790329784214,
					lng : 133.96728515625,
					zoom : 5
				}
			}
		},

		providers : {
			// default accounts, added to all new (and old?) projects
			mapbox : [{	
				username : 'systemapic',
				accessToken : 'pk.eyJ1Ijoic3lzdGVtYXBpYyIsImEiOiJkV2JONUNVIn0.TJrzQrsehgz_NAfuF8Sr1Q'
			}]
		},

		servers : {

			// portal SX
			portal   : 'https://dev.systemapic.com/',	// api

			// tiles SX
			tiles : {
				uri : 'https://{s}.systemapic.com/r/',
				subdomains : 'efgh' // sx
			},

			// utfgrid SX
			utfgrid : {
				uri : 'https://{s}.systemapic.com/u/',
				subdomains : 'efgh' // sx
			},

			// osm PX
			osm : {
				base : 'https://m.systemapic.com/',
				uri : 'https://{s}.systemapic.com/r/',
				subdomains : 'mnop' // px
			}
		},

		ga : {
			id : 'UA-57572003-4'
		}


	},


}