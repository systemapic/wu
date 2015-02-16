var systemapicConfigOptions = {
		
	id : 'app',

	portalName : 'systemapic',	// plugged in
	portalLogo : false,		// not plugged in.. using sprites atm..
	portalTitle : 'Systemapic Secure Portal: Rüppells Griffon',
	
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

	providers : {
		// default accounts, added to all new (and old?) projects
		mapbox : [{	
			username : 'systemapic',
			accessToken : 'pk.eyJ1Ijoic3lzdGVtYXBpYyIsImEiOiJkV2JONUNVIn0.TJrzQrsehgz_NAfuF8Sr1Q'
		}]
	},

	servers : {

		// portal SX
		portal   : 'https://projects.ruppellsgriffon.com/',	// api

		// tiles SX
		tiles : {
			uri : 'https://{s}.systemapic.com/r/',
			subdomains : 'abcd' // sx
		},

		// utfgrid SX
		utfgrid : {
			uri : 'https://{s}.systemapic.com/u/',
			subdomains : 'abcd' // sx
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
		'user-9fed4b5f', // k
		'user-e6e5d7d9'  // j  // todo: add phantomJS user
	]
}
