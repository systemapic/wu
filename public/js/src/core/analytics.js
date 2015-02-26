// ******************* //
// * CUSTOM GA STUFF * //
// ******************* //

// General overview
// https://developers.google.com/analytics/devguides/collection/analyticsjs/

// Field references:
// https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference

// About custom dimensions
// https://developers.google.com/analytics/devguides/platform/customdimsmets

// Analytics API explorer:
// http://developers.google.com/apis-explorer/?hl=en_US#p/analytics/v3/analytics.data.ga.get 
// (unique ID for maps.systemapic.com => 98026334)




// Må ingorere IP adressen til phantom på i GA... 
// http://web-design-weekly.com/snippets/exclude-ip-address-from-google-analytics/


// ****************************** //
// * CUSTOM DIMENSIONS OVERVIEW * //
// ****************************** //

// dimension1 = Project ID (Hit)
// dimension2 = Username (Session)
// dimension3 = Software version (Session)
// dimension4 = Client ID (Hit)
// dimension5 = User ID (Session)
// dimension6 = Project Name (Hit)
// dimension7 = Client Name (Hit)
// dimension8 = New Project ID (Hit)
// dimension9 = Deleted Project (Name)
// dimension10 = New User (ID)
// dimension11 = New User (Name)
// dimension12 = Delted User (Name)
// dimension13 = User IP (Session)



Wu.Analytics = Wu.Class.extend({

	initialize : function () {

		this.initGoogle();
	},

	initGoogle : function () {

		var gaID = Wu.app.options.ga.id;

		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

		// Force SSL		
		ga('set', 'forceSSL', true);	

		// Create Object
		ga('create', gaID, 'auto');

		// Send pageview to google
		ga('send', 'pageview');

		// Software Version ~ Custion dimsension
		var dimension3Value = Wu.version;
		ga('set', 'dimension3', dimension3Value);
		
	},

	setGaUser : function () {

		if (!app.Account) return;

		// USER
		var userId = app.Account.getUuid();
		if (!userId) return;

		ga('set', 'userId', userId);		

		// Username ~ Custom dimension
		var dimension2Value = app.Account.getFullName();
		ga('set', 'dimension2', dimension2Value);

		// UserID ~ Custom dimension
		var dimension5Value = userId;
		ga('set', 'dimension5', dimension5Value);

		// TODO
		// UserIP ~ Custom dimension 
		// ga('set', 'dimension13', userIP);

		this._userSet = true;

	},


	setGaProject : function (uuid) {

		var projectSlug 	= app.Projects[uuid].getSlug();
		var projectClient 	= app.Projects[uuid].getClient();
		var clientSlug 		= projectClient.getSlug();
		var clientID 		= app.Projects[uuid].getClientUuid();
		var projectName 	= app.Projects[uuid].getName();
		var clientName		= projectClient.getName();

		var url = '/' + clientSlug + '/' + projectSlug

		// Send pageview to GA		
		ga('send', {
		  'hitType': 'pageview',
		  'page': url
		});

		// Project ID ~ Custom dimension
		ga('set', 'dimension1', uuid);

		// Client ID ~ Custom dimension
		ga('set', 'dimension4', clientID);

		// Project Name ~ Custom dimension
		ga('set', 'dimension6', projectName);

		// Client Name ~ Custom dimension
		ga('set', 'dimension7', clientName);

		// Send "select project" event to GA
		this.ga(['Select project', projectName])


	},


	ga : function (trackArray) {

		if ( !this._userSet) this.setGaUser();

		var gaSendObject = {
			'hitType' : 'event'
		};

		// CATEGORY ( STRING – REQUIRED )
		// Typically the object that was interacted with (e.g. button)
		if ( trackArray[0] ) gaSendObject.eventCategory = trackArray[0];

		// ACTION ( STRING – REQUIRED )
		// The type of interaction (e.g. click)
		if ( trackArray[1] ) gaSendObject.eventAction = trackArray[1];

		// LABEL ( STRING – OPTIONAL )
		// Useful for categorizing events (e.g. nav buttons)
		if ( trackArray[2] ) gaSendObject.eventLabel = trackArray[2];

		// VALUE ( NUMBER – OPTIONAL )
		// Values must be non-negative. Useful to pass counts (e.g. 4 times)
		if ( trackArray[3] ) gaSendObject.eventValue = trackArray[3];		

		// console.log('gaSendObject', gaSendObject);

		// Try send track object to google analytics
		ga('send', gaSendObject);
	},

	// Use to log errors
	logGaError : function (errorName, isFatal) {

		ga('send', 'exception', {
			'exDescription': errorName,
			'exFatal': isFatal
		});

	}

});



