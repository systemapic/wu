Wu.version = '1.3.5';
Wu.App = Wu.Class.extend({
	_ : 'app',

	// debug : true,

	// default options
	options : systemapicConfigOptions, // global var from config.js... perhaps refactor.

	language : language,

	_ready : false,

	initialize : function (options) {

		// print version
		console.log('Systemapic v.' + Wu.version);

		// set global this
		Wu.app = window.app = this; // todo: remove Wu.app, use only window.app

		// init api
		app.api = new Wu.Api();

		// set access token
		this.setAccessTokens();

		// init socket
		app.Socket = new Wu.Socket();

		// error handling
		this._initErrorHandling();

		// merge options
		Wu.setOptions(this, options);

		// set page title
		document.title = this.options.portalTitle;

		// get objects from server
		this.initServer();

		// init sniffers
		this._initSniffers();
	},

	_initSniffers : function () {

		// Detect mobile devices
		this.detectMobile();

		// get user agent
		this.sniffer = Sniffer(navigator.userAgent);
	},
	
	setAccessTokens : function () {

		// get tokens
		app.tokens = window.tokens;

		// get access token
		var access_token = app.tokens.access_token;

		// verify token
		app.api.verifyAccessToken();
	},

	_initErrorHandling : function () {

		// log all errors
		window.onerror = this._onError;

		// forward console.error's to log also
		// console.error = function (message) {
		// 	try { throw Error(message); } 
		// 	catch (e) {}
		// }
	},

	_onError : function (message, file, line, char, ref) {

		var stack = ref.stack;
		var project = app.activeProject ? app.activeProject.getTitle() : 'No active project';
		var username = app.Account ? app.Account.getName() : 'No username';
		
		var options = JSON.stringify({
			message : message,
			file : file,
			line : line,
			user : username,
			stack : stack,
			project : project
		});

		Wu.save('/api/error/log', options);
	},

	_checkForInvite : function () {
		var pathname = window.location.pathname;
		if (pathname.indexOf('/invite/') == -1) return;
		var invite_token = pathname.split('/').reverse()[0];
		if (invite_token) this.options.invite_token = invite_token;
	},

	initServer : function () {
		console.log('Securely connected to server: \n', this.options.servers.portal);

		// check for invite link
		this._checkForInvite();

		// data for server
		var data = JSON.stringify(this.options);
		
		// post         path          json      callback    this
		Wu.post('api/portal', data, this.initServerResponse, this, this.options.servers.portal);
	},

	initServerResponse : function (that, responseString) {
		var responseObject = Wu.parse(responseString);

		// revv it up
		that.initApp(responseObject);
	},

	initApp : function (portalStore) {
		// set vars
		this.options.json = portalStore;

		// load json model
		this._initObjects();

		// create app container
		this._initContainer();

		// init chrome
		this._initChrome();

		// create panes
		this._initPanes();

		// init pane view
		this._initView();

		// ready
		this._ready = true;

		// debug
		this._debug();

		// log entry
		this._logEntry();

		// analytics
		this.Analytics = new Wu.Analytics();
	},

	_logEntry : function () {
		var b = this.sniffer.browser;
		var o = this.sniffer.os;
		var browser = b.fullName + ' ' + b.majorVersion + '.' + b.minorVersion;
		var os = o.fullName + ' ' + o.majorVersion + '.' + o.minorVersion;

		app.Socket.sendUserEvent({
		    	user : app.Account.getFullName(),
		    	event : 'entered',
		    	description : 'the wu: `' + browser + '` on `' + os + '`',
		    	timestamp : Date.now()
		});
	},

	_initObjects : function () {

		// data controller
		this.Data = new Wu.Data();

		// controller
		this.Controller = new Wu.Controller(); // todo: remove this?

		// main user account
		this.Account = new Wu.User(this.options.json.account);
		this.Account.setRoles(this.options.json.roles);

		// contact list
		this.Users = {};
		app.Account.getContactList().forEach(function(user) {
		       this.Users[user.uuid] = new Wu.User(user);    
		}, this);
		this.options.json.users.project_users.forEach(function(user) {
		       if (!this.Users[user.uuid]) this.Users[user.uuid] = new Wu.User(user);             
		}, this);

		// add self to users list
		this.Users[app.Account.getUuid()] = this.Account;

		// create project objects
		this.Projects = {};
		this.options.json.projects.forEach(function(elem, i, arr) {
		       this.Projects[elem.uuid] = new Wu.Project(elem, this);
		}, this);
	},

	_initChrome : function () {

		// chrome
		this.Chrome = {};

		// top chrome
		this.Chrome.Top = new Wu.Chrome.Top();

		// right chrome
		this.Chrome.Right = new Wu.Chrome.Right();

		// right chrome
		this.Chrome.Left = new Wu.Chrome.Left();
	},

	_initPanes : function () {

		// render tooltip
		this.Tooltip = new Wu.Tooltip();

		// render style handler
		this.Style = new Wu.Style();

		// render progress bar
		this.ProgressBar = new Wu.ProgressPane({
			color : 'white',
			addTo : this._appPane
		});

		// render map pane
		this.MapPane = new Wu.MapPane();

		// render eror pane
		this.FeedbackPane = new Wu.FeedbackPane();

		// settings pane
		this.MapSettingsPane = new Wu.MapSettingsPane();

		// share pane
		this.Share = new Wu.Share();

		// add account tab
		this.Account.addAccountTab();
	},

	// init default view on page-load
	_initView : function () {

		// check invite
		if (this._initInvite()) return;

		// check location
		if (this._initLocation()) return;
			
		// runs hotlink
		if (this._initHotlink()) return;

		// open first project (ordered by lastUpdated)
		app.Controller.openLastUpdatedProject();
	},

	_initInvite : function () {
		var project = this.options.json.invite;

		if (!project) return false;

		// select project
		Wu.Mixin.Events.fire('projectSelected', {detail : {
			projectUuid : project.id
		}});

		app.feedback.setMessage({
			title : 'Project access granted',
			description : 'You\'ve been given access to the project ' + project.name 
		});
	},

	_initLocation : function () {
		var path    = window.location.pathname,
		    username  = path.split('/')[1],
		    project = path.split('/')[2],
		    hash    = path.split('/')[3],
		    search  = window.location.search.split('?'),
		    params  = Wu.Util.parseUrl();


		// done if no location
		if (!username || !project) return false;

		// get project
		var project = this._projectExists(project, username);
		
		// return if no such project
		if (!project) {
			Wu.Util.setAddressBar(this.options.servers.portal);
			return false;
		}

		// set project
		this._setProject(project);

		// init hash
		if (hash) {
			console.log('got hash!', hash, project);
			this._initHash(hash, project);
		}
		return true;
	},

	_initHotlink : function () {
		
		// parse error prone content of hotlink..
		this.hotlink = Wu.parse(window.hotlink);

		// return if no hotlink
		if (!this.hotlink) return false;

		// check if project slug exists, and if belongs to client slug
		var project = this._projectExists(this.hotlink.project, this.hotlink.client);

		// return if not found
		if (!project) return false;

		// set project
		this._setProject(project);

		return true;
	},


	// check if project exists (for hotlink)
	_projectExists : function (project_slug, username) {

		// find project slug in Wu.app.Projects
		var project_slug = project_slug || window.hotlink.project;
		for (p in Wu.app.Projects) {
			var project = Wu.app.Projects[p];
			if (project_slug == project.store.slug) {
				if (project.store.createdByUsername == username) return project; 
			}
		}
		return false;
	},

	_initEvents : function () {
	},

	_getDimensions : function (e) {
		var w = window,
		    d = document,
		    e = d.documentElement,
		    g = d.getElementsByTagName('body')[0],
		    x = w.innerWidth || e.clientWidth || g.clientWidth,
		    y = w.innerHeight|| e.clientHeight|| g.clientHeight,
		    d = {
			height : y,
			width : x,
			e : e
		    }
		return d;
	},

	_initContainer : function () {

		// find or create container
		var id = this.options.id;
		this._appPane = Wu.DomUtil.get(id) || Wu.DomUtil.createId('div', id || 'app', document.body);

		// create map container
		this._mapContainer = Wu.DomUtil.createId('div', 'map-container', this._appPane);
	},

	_setProject : function (project) {

		// select project
		Wu.Mixin.Events.fire('projectSelected', {detail : {
			projectUuid : project.getUuid()
		}});

	},

	// get name provided for portal from options hash 
	getPortalName : function () {
		return this.options.portalName;
	},

	// shorthands for setting status bar
	setStatus : function (status, timer) {
		// app.StatusPane.setStatus(status, timer);
	},

	setSaveStatus : function (delay) {
		// app.StatusPane.setSaveStatus(delay);
	},

	_initHash : function (hash, project) {

		// get hash values from server,
		this.getHash(hash, project, this._renderHash);
		return true;
	},

	// get saved hash
	getHash : function (id, project, callback) {

		// get a saved setup - which layers are active, position, 
		Wu.post('/api/project/hash/get', JSON.stringify({
			projectUuid : project.getUuid(),
			id : id
		}), callback, this);
	},

	_renderHash : function (context, json) {

		// parse
		var result = JSON.parse(json); 

		// handle errors
		if (result.error) console.log('error?', result.error);

		// set vars
		var hash = result.hash;
		var projectUuid = hash.project || result.project;	// hacky.. clean up setHash, _renderHash, errything..
		var project = app.Projects[projectUuid];

		// select project
		project.selectProject();

		// set position
		app.MapPane.setPosition(hash.position);

	},

	// save a hash // todo: move to controller
	setHash : function (callback, project) {

		// get active layers
		var active = app.MapPane.getControls().layermenu._getActiveLayers();
		var layers = _.map(active, function (l) {
			return l.item.layer;
		})

		// get project;
		var project = project || app.activeProject;

		// save hash to server
		Wu.post('/api/project/hash/set', JSON.stringify({
			projectUuid : project.getUuid(),
			hash : {
				id 	 : Wu.Util.createRandom(6),
				position : app.MapPane.getPosition(),
				layers 	 : layers 			// layermenuItem uuids, todo: order as z-index
			}
		}), callback, this);

	},


	phantomJS : function (args) {
		var projectUuid = args.projectUuid,
	   	    hash    	= args.hash,
	   	    isThumb     = args.thumb;

	   	// return if no project
	   	if (!projectUuid) return false;

	   	// set hash for phantom
	   	this._phantomHash = hash;

		// get project
		var project = app.Projects[projectUuid];
		
		// return if no such project
		if (!project) return false;

		// check for hash
		if (hash) {

			// select project
			project.selectProject();

			// set position
			app.MapPane.setPosition(hash.position);

			setTimeout(function () {

				// deselect all default layers
				var map = app._map;
				var lm = app.MapPane.getControls().layermenu;
				var activeLayers = lm._getActiveLayers();
				activeLayers.forEach(function (al) {
					al.layer.remove(map);
				});

				// set layers
				hash.layers.forEach(function (layerUuid) { 	
										
					// add layer
					var layer = project.getLayer(layerUuid);

					// if in layermenu
					var bases = project.getBaselayers();
					var base = _.find(bases, function (b) {
						return b.uuid == layerUuid;
					});

					if (base) {
						// add as baselayer
						layer.add('baselayer'); 
					} else {
						layer.add();
					}
					
				}, this);

			}.bind(this), 2000);


		}

		// add phantomJS stylesheet		
		isThumb ? app.Style.phantomJSthumb() : app.Style.phantomJS();

		app._isPhantom = true;

	},
	
	_setPhantomArgs : function (args) {
		this._phantomArgs = args;
	},
	
	phantomReady : function () {
		if (!app.activeProject) return false;

		var hashLayers = _.size(this._phantomHash.layers),
		    baseLayers = _.size(app.activeProject.getBaselayers()),
		    numLayers = hashLayers + baseLayers;

		// check if ready for screenshot
		if (!this._loaded || !this._loading) return false;

		// if no layers, return
		if (numLayers == 0) return true;

		// if not loaded, return
		if (this._loaded.length == 0 ) return false; 

		// if all layers loaded
		if (this._loaded.length == numLayers) return true;

		// not yet
		return false;
	},

	// phantomjs: loaded layers
	_loaded : [],

	_loading : [],

	detectMobile : function() {
		
		// Detect if it's a mobile
		if (L.Browser.mobile) {

			// Set mobile state to true
			Wu.app.mobile = false;
			Wu.app.pad = false;
			
			// Get screen resolution
			var w = screen.height;
			var h = screen.width;

			// Store resolution
			Wu.app.nativeResolution = [w, h];

			if ( w >= h ) var smallest = h;
			else var smallest = w;

			// Mobile phone
			if ( smallest < 450 ) {

				Wu.app.mobile = true;
				var mobilestyle = 'mobilestyle.css'
			// Tablet
			} else {

				Wu.app.pad = true;
				var mobilestyle = 'padstyle.css'
			}

			// Get the styletag
			var styletag = document.getElementById('mobilestyle');
			// Set stylesheet for 
			var styleURL = '<link rel="stylesheet" href="' + app.options.servers.portal + 'css/' + mobilestyle + '">';
			styletag.innerHTML = styleURL;
			
		}
	},

	// debug mode
	_debug : function (debug) {
		if (!debug && !this.debug) return;
		this.debug = true;

		// set style
		app.Style.setStyle('img.leaflet-tile', {
			'border-top': '1px solid rgba(255, 0, 0, 0.65)',
			'border-left': '1px solid rgba(255, 0, 0, 0.65)'
		});

		// add map click event
		if (app._map) app._map.on('mousedown', function (e) {
			var lat = e.latlng.lat,
			    lng = e.latlng.lng,
			    zoom = app._map.getZoom(),
			    tile = this._getTileURL(lat, lng, zoom);

			console.log('tile:', tile);
			
		}, this);

		// extend 
		if (typeof(Number.prototype.toRad) === "undefined") {
			Number.prototype.toRad = function() {
				return this * Math.PI / 180;
			}
		}
	},

	// for debug
	_getTileURL : function (lat, lon, zoom) {
		var xtile = parseInt(Math.floor( (lon + 180) / 360 * (1<<zoom) ));
		var ytile = parseInt(Math.floor( (1 - Math.log(Math.tan(lat.toRad()) + 1 / Math.cos(lat.toRad())) / Math.PI) / 2 * (1<<zoom) ));
		return "" + zoom + "/" + xtile + "/" + ytile;
	},

});