var systemapicConfigOptions = {
		
	id : 'app',

	portalName : 'systemapic',	// plugged in
	portalLogo : false,		// not plugged in.. using sprites atm..
	portalTitle : 'Systemapic Secure Portal', // MX

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
		projectDefault : '/images/grinders/BG-grinder-small-grayDark-on-white.gif',
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

		// portal MX
		portal   : 'https://maps.systemapic.com/',	// api

		// tiles MX
		tiles : {
			uri : 'https://{s}.systemapic.com/r/',
			subdomains : 'ijkl' // mx
		},

		// utfgrid MX
		utfgrid : {
			uri : 'https://{s}.systemapic.com/u/',
			subdomains : 'ijkl' // mx
		},

		// osm PX
		osm : {
			base : 'https://m.systemapic.com/',
			uri : 'https://{s}.systemapic.com/r/',
			subdomains : 'mnop' // px
		}


	},

	ga : {
		id : 'UA-57572003-2'
	}
	
}
