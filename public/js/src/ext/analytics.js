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
		Wu.Mixin.Events.on('editEnabled',     this._editEnabled, this);
		Wu.Mixin.Events.on('editDisabled',    this._editDisabled, this);
		Wu.Mixin.Events.on('layerEnabled',    this._layerEnabled, this);
		Wu.Mixin.Events.on('layerDisabled',   this._layerDisabled, this);
		Wu.Mixin.Events.on('layerSelected',   this._layerSelected, this);
		Wu.Mixin.Events.on('layerAdded',      this._onLayerAdded, this);
		Wu.Mixin.Events.on('layerEdited',     this._onLayerEdited, this);
		Wu.Mixin.Events.on('layerStyleEdited',this._onLayerStyleEdited, this);
		Wu.Mixin.Events.on('layerDeleted',    this._onLayerDeleted, this);
		Wu.Mixin.Events.on('fileImported',    this._onFileImported, this);
		Wu.Mixin.Events.on('fileDeleted',     this._onFileDeleted, this);

		// map events
		if (app._map) {
			app._map.on('zoomstart', this._onZoomStart);
			app._map.on('zoomend', this._onZoomEnd);
		}

		// on browser close
		window.addEventListener("unload", this._onUnload);
	},

	// dummies
	_editEnabled 	 : function () {},
	_editDisabled 	 : function () {},
	_layerEnabled 	 : function () {},
	_layerDisabled 	 : function () {},
	_updateView 	 : function () {},
	_refresh 	 : function () {},
	_onFileImported  : function () {},
	_onFileDeleted   : function () {},
	_onLayerAdded    : function () {},
	_onLayerEdited   : function () {},
	_onLayerStyleEdited   : function () {},
	_onLayerDeleted  : function () {},
	
	_onUnload : function () {

		app.Socket.sendUserEvent({
		    	user : app.Account.getFullName(),
		    	event : 'exited.',
		    	description : '',
		    	timestamp : Date.now()
		})
	},

	_onZoomStart : function () {
		var map = app._map;
		app._eventZoom = map.getZoom();
	},

	_onZoomEnd : function () {
		var map = app._map;
		var zoom = map.getZoom();

		// slack
		app.Socket.sendUserEvent({
		    	user : app.Account.getFullName(),
		    	event : 'zoomed',
		    	description : 'from `' + app._eventZoom + ' to ' + zoom + '` ',
		    	timestamp : Date.now()
		})
	},

	_getPointKeys : function () {
		return ['gid', 'vel', 'mvel', 'coherence'];
	},


	onInvite : function (options) {

		var project_name = options.project_name,
		    permissions = options.permissions;

		// slack
		app.Socket.sendUserEvent({
		    	user : app.Account.getFullName(),
		    	event : 'invited to project',
		    	description : project_name + ' `(' + permissions.join(', ') + ')`',
		    	timestamp : Date.now()
		})
	},

	onScreenshot : function (options) {

		var project_name = options.project_name,
		    file_id = options.file_id;

		// slack
		app.Socket.sendUserEvent({
		    	user : app.Account.getFullName(),
		    	event : 'took a `screenshot` of project',
		    	description : project_name,
		    	timestamp : Date.now(),
		    	options : {
		    		screenshot : true,
		    		file_id : file_id
		    	}
		})
	},

	onAttributionClick : function () {
		// slack
		app.Socket.sendUserEvent({
		    	user : app.Account.getFullName(),
		    	event : 'clicked',
		    	description : 'Systemapic logo',
		    	timestamp : Date.now(),
		})
	},

	onPolygonQuery : function (options) {

		var data = options.result;

		var total_points = data.total_points;

		var area = data.area;
		if (area > 1000000) {
			area = 'approx. ' + parseInt(area / 1000000) + ' km2';
		} else {
			area = 'approx. ' + parseInt(area) + ' m2';
		}

		var description = 'on ' + options.layer_name; // + '`(total_points: ' + options.total_points + ')`',

		// total points
		description += '\n     `total points: ' + total_points + '` ';
		description += '\n     `area: ' + area + '` ';
		
		// add description for keys
		var keys = this._getPointKeys();
		keys.forEach(function (key) {
			if (data.average[key]) {
				description += '\n     `' + key + ': ' + data.average[key] + '` ';
			}
		});

		// slack
		app.Socket.sendUserEvent({
		    	user : app.Account.getFullName(),
		    	event : 'queried polygon',
		    	description : description,
		    	timestamp : Date.now()
		})
	},


	onEnabledRegression : function () {

		// slack
		app.Socket.sendUserEvent({
		    	user : app.Account.getFullName(),
		    	event : 'viewed regression',
		    	description : '',
		    	timestamp : Date.now()
		})

	},

	_eventLayerLoaded : function (options) {
		// slack
		app.Socket.sendUserEvent({
		    	user : app.Account.getFullName(),
		    	event : 'watched',
		    	description : 'layer load for `' + options.load_time + 'ms`',
		    	timestamp : Date.now()
		})
	},

	onPointQuery : function (data) {

		// get latlngs
		var prevLatlng = app._prevLatlng;
		var latlng = data.latlng.toString()
		
		// remember prev latlng
		app._prevLatlng = data.latlng;

		// get keys
		var keys = this._getPointKeys();

		// description
		var description = '`at ' + latlng + '` ';
		description +='\n     on ' + data.layer.getTitle() + '.' 
		
		// add description for keys
		keys.forEach(function (key) {
			if (data.data[key]) {
				description += '\n     `' + key + ': ' + data.data[key] + '` ';
			}
		});
		
		// add distance from previous query
		if (prevLatlng) description += '\n      Distance from last query: `' + parseInt(data.latlng.distanceTo(prevLatlng)) + 'meters`';

		// slack
		app.Socket.sendUserEvent({
		    	user : app.Account.getFullName(),
		    	event : 'queried point',
		    	description : description,
		    	timestamp : Date.now()
		})
	},

	_layerSelected 	 : function (e) {
		var layer = e.detail.layer;
		if (!layer) return;

		// slack
		app.Socket.sendUserEvent({
		    	user : app.Account.getFullName(),
		    	event : 'selected',
		    	description : '`layer` ' + layer.getTitle(),
		    	timestamp : Date.now()
		})

	},

	_projectSelected : function (e) {

		// set project
		this._project = app.Projects[e.detail.projectUuid];

		// stats
		this.setGaPageview(e.detail.projectUuid);

		var projectName = this._project ? '`project` ' + this._project.getName() : 'no project.'
		
		// slack
		app.Socket.sendUserEvent({
		    	user : app.Account.getFullName(),
		    	event : 'selected',
		    	description : projectName,
		    	timestamp : Date.now()
		})
	},	

	// send to server
	set : function (options) {
		
		// send to server. JSON.stringify not needed for options object.
		Wu.send('/api/analytics/set', options, function (err, result) {
			if (err) console.log('GA error:', err, result);			
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

		// return if no project (ie. after delete)
		if (!app.activeProject) return;

		// Set active project:
		// If we have a UUID, use it
		// if not, use current active project
		var activeProject = uuid ? app.Projects[uuid] : app.activeProject;

		// If uuid has been passed, used it
		// if not, find active project uuid
		var _uuid = uuid ? uuid : app.activeProject.getUuid();

		// Get parameters to pass to Google Analytics
		var projectSlug 	= activeProject.getSlug();
		// var projectClient 	= activeProject.getClient();
		// var clientSlug 		= projectClient.getSlug();
		// var clientID 		= activeProject.getClientUuid();
		var projectName 	= activeProject.getName();
		// var clientName		= projectClient.getName();
	    	var projectName 	= activeProject.getName();
		var hostname 		= app.options.servers.portal;
		var projectSlug 	= activeProject.getSlug();
		// var pageUrl 		= '/' + clientSlug + '/' + projectSlug;
		var pageUrl 		= '/' + projectSlug;

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
			// dimension4  : clientID,		// Client ID
			dimension6  : projectName,	// Project name
			// dimension7  : clientName,	// Client name
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
			// if (app.activeProject._client === undefined || app.activeProject === undefined ) return;
			// var clientSlug  = app.activeProject._client.getSlug();
			var projectSlug = app.activeProject.getSlug()
			// var pageUrl 	= '/' + clientSlug + '/' + projectSlug;
			var pageUrl = '/' + projectSlug;
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



