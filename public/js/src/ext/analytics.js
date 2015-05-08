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

// dimension1  = Project ID (Hit)
// dimension2  = Username (Session)
// dimension3  = Software version (Session)
// dimension4  = Client ID (Hit)
// dimension5  = User ID (Session)
// dimension6  = Project Name (Hit)
// dimension7  = Client Name (Hit)
// dimension8  = New Project ID (Hit)
// dimension9  = Deleted Project (Name)
// dimension10 = New User (ID)
// dimension11 = New User (Name)
// dimension12 = Delted User (Name)
// dimension13 = User IP (Session)



Wu.Analytics = Wu.Class.extend({

	initialize : function () {

		// this.initGoogle();
		this._listen();
	},


	_listen : function () {

		Wu.Mixin.Events.on('projectSelected', this._projectSelected, this);

	},

	_projectSelected : function (e) {
		var uuid = e.detail.projectUuid;

		this.setGaPageview(uuid);
	},	

	// send to server
	set : function (options) {
		
		// send to server. JSON.stringify not needed for options object.
		Wu.send('/api/analytics/set', options, function (err, result) {
			if ( err ) console.log('GA error:', err, Wu.parse(result));			
		});

	},

	get : function (options) {

		// send to server. JSON.stringify not needed for options object.
		Wu.send('/api/analytics/get', options, function (err, result) {
		});
	},



	// pageview
	setGaPageview : function (uuid) {
		if (app._isPhantom) return;

		// Set active project:
		// If we have a UUID, use it
		// if not, use current active project
		var activeProject = uuid ? app.Projects[uuid] : app.activeProject;

		// If uuid has been passed, used it
		// if not, find active project uuid
		var _uuid = uuid ? uuid : app.activeProject.getUuid();

		// Get parameters to pass to Google Analytics
		var projectSlug 	= activeProject.getSlug();
		var projectClient 	= activeProject.getClient();
		var clientSlug 		= projectClient.getSlug();
		var clientID 		= activeProject.getClientUuid();
		var projectName 	= activeProject.getName();
		var clientName		= projectClient.getName();
	    	var projectName 	= activeProject.getName();
		var hostname 		= app.options.servers.portal;
		var projectSlug 	= activeProject.getSlug();
		var pageUrl 		= '/' + clientSlug + '/' + projectSlug;

		// USER
		var userID		= app.Account.getUuid();

		// Get user full name	
		var dimension2Value	= app.Account.getFullName();

		// Get Systemapic version
		var version 		= Wu.version;

		// Pageview OPTIONS for Google Analytics
		var gaPageview = {

			hostname    : hostname,
			page 	    : pageUrl,
			title 	    : projectName,
			dimension1  : _uuid, 		// Project ID
			dimension4  : clientID,		// Client ID
			dimension6  : projectName,	// Project name
			dimension7  : clientName,	// Client name
			dimension2  : dimension2Value,	// User full name
			version     : version		// Systemapic version

		}

		// Contains tracking id and client id (for user)
		var userHeader = this.gaHeader()		

		var trackThis = {
			
			userHeader  : userHeader,
			gaEvent     : false,
			gaPageview  : gaPageview

		}

		// SEND TO SERVER
		// SEND TO SERVER
		// SEND TO SERVER

		this.set(JSON.stringify(trackThis));


		// Clean up
		trackThis = null;
		gaPageview = null;
		userHeader = null;


	},

	// event
	setGaEvent : function (trackArray) {


		var gaEvent = {}		

		// GET EVENT PARAMETERS
		// GET EVENT PARAMETERS
		// GET EVENT PARAMETERS

		// CATEGORY ( STRING – REQUIRED )
		if ( trackArray[0] ) gaEvent.eventCategory = trackArray[0];

		// ACTION ( STRING – REQUIRED )
		if ( trackArray[1] ) gaEvent.eventAction = trackArray[1];

		// LABEL ( STRING – OPTIONAL )
		if ( trackArray[2] ) gaEvent.eventLabel = trackArray[2];

		// VALUE ( NUMBER – OPTIONAL )
		if ( trackArray[3] ) gaEvent.eventValue = trackArray[3];		

		// CURRENT PROJECT PATH
		if ( app.activeProject ) {
			var clientSlug  = app.activeProject._client.getSlug();
			var projectSlug = app.activeProject.getSlug()
			var pageUrl 	= '/' + clientSlug + '/' + projectSlug;
			gaEvent.path = pageUrl;
		} else {
			gaEvent.path = '/';
		}

		// GET UNIVERSAL HEADER FOR USER
		var userHeader = this.gaHeader()		

		var trackThis = {
			
			userHeader  : userHeader,
			gaEvent     : gaEvent,
			gaPageview  : false

		}

		// SEND TO SERVER
		// SEND TO SERVER
		// SEND TO SERVER

		this.set(JSON.stringify(trackThis));
		
		// mem leak?
		gaSendObject = null;
		trackArray = null;
		userHeader = null;
		trackThis = null;
	},


	// UNIVERSAL FOR ALL GA PUT REQUESTS
	gaHeader : function() {

		if (!app.Account) return;

		// USER
		var userID = app.Account.getUuid();
		if (!userID) return;		

		// Header for GA
		var userHeader = {

			trackingID : Wu.app.options.ga.id,
			clientID   : userID,			// This might have to be session specific

		};


		return userHeader;

	}

});



