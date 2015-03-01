var systemapicConfigOptions = {
		
	id : 'app',

	portalName : 'systemapic',	// plugged in
	portalLogo : false,		// not plugged in.. using sprites atm..
	portalTitle : '[dev] Systemapic Secure Portal',
	
	// sidepane
	panes : {
		// plugged in and working! :)
		clients 	: true,
		mapOptions 	: true,
		documents 	: true,               	
		dataLibrary 	: true,               	
		users 		: true,
		share 		: true,
		mediaLibrary    : false,
		account 	: true
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
			username : 'MAPBOX-USER-NAME',
			accessToken : 'MAPBOX-ACCESS-TOKEN'
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

	silentUsers : [
		// redacted
		'user-9fed4b5f', // only part of uuid
	],


	ga : {
		id : 'GOOGLE-ANALYTICS-ID'
	}
}
