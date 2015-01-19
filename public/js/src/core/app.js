Wu.version = '0.3-dev';
Wu.App = Wu.Class.extend({
	_ : 'app',

	// debug : true,

	// default options
	options : {
		
		id : 'app',

		portalName : 'systemapic',	// plugged in
		portalLogo : false,		// not plugged in.. using sprites atm..

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

			portal   : 'https://projects.ruppellsgriffon.com/',	// api
			tiles    : 'https://{s}.systemapic.com/tiles/', 	// tiles
			utfgrid  : 'https://{s}.systemapic.com/utfgrid/' 	// utfgrids

		},

		silentUsers : [
			// redacted
			'user-9fed4b5f', // k
			'user-e6e5d7d9'  // j  // todo: add phantomJS user
		]
	},


	_ready : false,

	initialize : function (options) {

		// set global this
		Wu.app = this;

		// merge options
		Wu.setOptions(this, options);   

		// set options
		L.mapbox.config.FORCE_HTTPS = true;
		L.mapbox.accessToken = this.options.providers.mapbox[0].accessToken; // todo: move to relevant place

		// get objects from server
		this.initServer();

		// Detect mobile devices
		this.detectMobile();

	},


	detectMobile : function() {
		
		// Detect if it's a mobile
		if ( L.Browser.mobile ) {

			
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
			var styleURL = '<link rel="stylesheet" href="https://projects.ruppellsgriffon.com/css/' + mobilestyle + '">';
			styletag.innerHTML = styleURL;
			
		}
	},

	initServer : function () {
		var serverUrl = this.options.servers.portal;
		console.log('Securely connected to server: \n', serverUrl);

		var data = JSON.stringify(this.options);
		
		// post         path          json      callback    this
		Wu.post('/api/portal', data, this.initServerResponse, this);

	},

	initServerResponse : function (that, response) {
		var resp = JSON.parse(response);

		// revv it up
		that.initApp(resp);
	},


	initApp : function (o) {
		// set vars
		this.options.json = o;

		// create app container
		this._initContainer();

		// load dependencies
		this._initDependencies();

		// load json model
		this._initObjects();

		// create panes
		this._initPanes();

		// init pane view
		this._initView();

		// init global events
		this._initEvents();

		// ready
		this._ready = true;

		// debug
		this._debug();

	},

	_initEvents : function () {
		Wu.DomEvent.on(window, 'resize', this._resizeEvents, this);
	},

	_resizeEvents : function (e) {

		// get window dimensions
		var dimensions = this._getDimensions(e);

		// mappane resize event
		if (app.MapPane) app.MapPane.resizeEvent(dimensions);

		// legends control resize
		var legendsControl = app.MapPane.legendsControl;
		if (legendsControl) legendsControl.resizeEvent(dimensions);

		// layermenu control resize
		var layermenuControl = app.MapPane.layerMenu;
		if (layermenuControl) layermenuControl.resizeEvent(dimensions);

	},

	_getDimensions : function (e) {
		var w = window,
		    d = document,
		    e = d.documentElement,
		    g = d.getElementsByTagName('body')[0],
		    x = w.innerWidth || e.clientWidth || g.clientWidth,
		    y = w.innerHeight|| e.clientHeight|| g.clientHeight;

		var d = {
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

	_initDependencies : function () {

		// icanhaz templates
		ich.grabTemplates()

	},

	
	_isDev : function (user) {
		if (user.uuid.slice(0,-13) == 'user-b76a8d27-6db6-46e0-8fc3') return true; // phantomJS user
		if (user.uuid.slice(0,-13) == 'user-9fed4b5f-ad48-479a-88c3') return true; // phantomJS user
		if (user.uuid.slice(0,-13) == 'user-e6e5d7d9-3b4c-403b-ad80') return true; // phantomJS user
		return false;
	},

	_initObjects : function () {

		// main user account
		this.Account = new Wu.User(this.options.json.account);
		
		// set access token
		this.setToken();

		// create user objects
		this.Users = {};
		this.options.json.users.forEach(function(user, i, arr) {
		       if (!this._isDev(user)) this.Users[user.uuid] = new Wu.User(user);             
		}, this);
		
		// create client objects
		this.Clients = {};
		this.options.json.clients.forEach(function(elem, i, arr) {
		       this.Clients[elem.uuid] = new Wu.Client(elem, this);             
		}, this);

		// create project objects
		this.Projects = {}      ;
		this.options.json.projects.forEach(function(elem, i, arr) {
		       this.Projects[elem.uuid] = new Wu.Project(elem, this);
		}, this);

	},

	setToken : function () {
		this.accessToken = '?token=';
		this.accessToken += Wu.app.Account.store.token;
		this.accessToken += '.';
		this.accessToken += Wu.app.Account.store._id;
	},



	_initPanes : function () {

		// render tooltip
		this.Tooltip = new Wu.Tooltip();

		// render style handler
		this.Style = new Wu.Style();

		// render status pane
		this.StatusPane = new Wu.StatusPane({
			addTo: this._appPane
		});

		// render progress bar
		this.ProgressBar = new Wu.ProgressPane({
			color : 'white',
			addTo : this._appPane
		});

		// render startpane
		this.StartPane = new Wu.StartPane({
			projects : this.Projects
		});

		// render dropzone pane
		this.Dropzone = new Wu.Dropzone();

		// render side pane 
		this.SidePane = new Wu.SidePane();	// todo: add settings more locally? Wu.SidePane({options})

		// render header pane
		this.HeaderPane = new Wu.HeaderPane();

		// render map pane
		this.MapPane = new Wu.MapPane();

		// render eror pane
		this.ErrorPane = new Wu.ErrorPane();

	},

	// init default view on page-load
	_initView : function () {

		// check location
		if (this._initLocation()) return;
			
		// runs hotlink
		if (this._initHotlink()) return;

		// set project if only one
		if (this._lonelyProject()) return;

		// if user is admin or manager, set Projects and Users as default panes
		var user = app.Account;
		if (user.isAdmin() || user.isSuperadmin() || user.isManager()) {
			// set panes 
			this.SidePane.refresh(['Clients', 'Users', 'Account']);		
		}

		// activate startpane
		this.StartPane.activate();

	},


	_lonelyProject : function () {
		// check if only one project, 
		// if so, open it
		if (_.size(app.Projects) == 1) {
			for (p in app.Projects) {
				var project = app.Projects[p];
				this._setProject(project);
				return true;
			}
		}
		return false;
	},

	_initLocation : function () {

		var path    = window.location.pathname,
		    client  = path.split('/')[1],
		    project = path.split('/')[2],
		    hash    = path.split('/')[3],
		    search  = window.location.search.split('?'),
		    params  = Wu.Util.parseUrl();

		// done if no location
		if (!client || !project) return false;

		// get project
		var project = this._projectExists(project, client);
		
		// return if no such project
		if (!project) {
			Wu.Util.setAddressBar(this.options.servers.portal);
			return false;
		}

		// set project
		this._setProject(project);

		// check for hash
		if (hash && hash.length == 6) {
			console.log('we got a hash!: ', hash);	
			return this._initHash(project, hash);
		}

		return true;
		
	},

	_setProject : function (project) {
		
		// select project
		project.select();

		// refresh sidepane
		app.SidePane.refreshProject(project);

		// remove help pseudo
		Wu.DomUtil.removeClass(app._mapPane, 'click-to-start');
	},

	_initHotlink : function () {
		
		// parse error prone content of hotlink..
		try { this.hotlink = JSON.parse(window.hotlink); } 
		catch (e) { this.hotlink = false; };

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
	_projectExists : function (projectSlug, clientSlug) {

		// find project slug in Wu.app.Projects
		var projectSlug = projectSlug || window.hotlink.project;
		for (p in Wu.app.Projects) {
			var project = Wu.app.Projects[p];
			if (projectSlug == project.store.slug) {
				if (project._client.slug == clientSlug) return project; 
			}
		}
		return false;
	},

	// get name provided for portal from options hash 
	getPortalName : function () {
		return this.options.portalName;
	},

	// shorthands for setting status bar
	setStatus : function (status, timer) {
		app.StatusPane.setStatus(status, timer);
	},

	setSaveStatus : function (delay) {
		app.StatusPane.setSaveStatus(delay);
	},

	_initHash : function (project, hash) {

		// get hash values from server,
		this.getHash(hash, project, this._renderHash);

		return true;
	},

	// get saved hash
	getHash : function (id, project, callback) {

		var json = {
			projectUuid : project.getUuid(),
			id : id
		}

		// get a saved setup - which layers are active, position, 
		Wu.post('/api/project/hash/get', JSON.stringify(json), callback, this);
	},


	_renderHash : function (context, json) {

		// parse
		var result = JSON.parse(json); 

		console.log('_renderHash', result);

		// handle errors
		if (result.error) console.log('error?', result.error);

		// set vars
		var hash = result.hash;
		var projectUuid = hash.project || result.project;	// hacky.. clean up setHash, _renderHash, errything..
		var project = app.Projects[projectUuid];

		// set position
		app.MapPane.setPosition(hash.position);

		// set layers
		hash.layers.forEach(function (layerUuid) { 	// todo: differentiate between baselayers and layermenu
								// todo: layermenu items are not selected in layermenu itself, altho on map
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
				// ass as layermenu
				var lm = app.MapPane.layerMenu;
				if (lm) {
					var lmi = lm._getLayermenuItem(layerUuid);
					lm.enableLayer(lmi);
				}
			}
			
		}, this);

	},


	// save a hash
	setHash : function (callback) {

		// get active layers
		var active = app.MapPane.getActiveLayermenuLayers();
		var layers = _.map(active, function (l) {
			return l.item.layer;	// layer uuid
		});

		// get project;
		var projectUuid = this.activeProject.getUuid();

		// hash object
		var json = {
			projectUuid : projectUuid,
			hash : {
				id 	 : Wu.Util.createRandom(6),
				position : app.MapPane.getPosition(),
				layers 	 : layers 			// layermenuItem uuids, todo: order as z-index
			}
		}

		// save hash to server
		Wu.post('/api/project/hash/set', JSON.stringify(json), callback, this);

		// return
		return json.hash;

	},

	phantomJS : function (args) {

		var projectUuid = args.projectUuid,
	   	    hash    	= args.hash;

	   	// return if no project
	   	if (!projectUuid) return false;

		// get project
		var project = app.Projects[projectUuid];
		
		// return if no such project
		if (!project) return false;

		// number of layers to be loaded
	   	this._loading = hash.layers.slice();

	   	// add baselayers
	   	project.getBaselayers().forEach(function (b) {
	   		this._loading.push(b);
	   	}, this);

		// set project
		this._setProject(project);

		// remove startpane
		if (this.StartPane) this.StartPane.deactivate();

		// add phantomJS stylesheet
		app.Style.phantomJS();

		// check for hash
		if (hash) {

			var json = JSON.stringify({
				hash: hash,
				project : projectUuid
			});

			// render hash
			this._renderHash(this, json);
		}


		// acticate legends for baselayers
		app.MapPane.legendsControl.refreshAllLegends()

		// avoid Loading! etc in status
		app.setStatus('systemapic'); // too early


	},
	
	phantomReady : function () {

		// check if ready for screenshot
		if (!this._loaded || !this._loading) return false;

		// if all layers loaded
		if (this._loaded.length == this._loading.length) return true;
		
		// not yet
		return false;

	},


	// phantomjs: loaded layers
	_loaded : [],

	_loading : [],

	// // phantomjs: load layermenu layers
	// _loadLayers : function (layermenuItems) {

	// },

	// // phantomjs: check if all layers are loaded
	// _allLoaded : function () {

	// },

	getZIndexControls : function () {
		var z = {
			b : app.MapPane._bzIndexControl,
			l : app.MapPane._lzIndexControl
		}
		return z;
	},


	// debug mode
	_debug : function () {
		if (!this.debug) return;
		




		// set style
		Wu.setStyle('img', {
			'border-top': '1px solid rgba(255, 0, 0, 0.65)',
			'border-left': '1px solid rgba(255, 0, 0, 0.65)'
		});

		// add map click event
		if (app._map) app._map.on('mousedown', function (e) {

			var lat = e.latlng.lat,
			    lng = e.latlng.lng,
			    zoom = app._map.getZoom();

			var tile = this._getTileURL(lat, lng, zoom);
			console.log('tile:', tile);

		}, this);

		// extend 
		if (typeof(Number.prototype.toRad) === "undefined") {
			Number.prototype.toRad = function() {
				return this * Math.PI / 180;
			}
		}



	},


	_getTileURL : function (lat, lon, zoom) {
		var xtile = parseInt(Math.floor( (lon + 180) / 360 * (1<<zoom) ));
		var ytile = parseInt(Math.floor( (1 - Math.log(Math.tan(lat.toRad()) + 1 / Math.cos(lat.toRad())) / Math.PI) / 2 * (1<<zoom) ));
		return "" + zoom + "/" + xtile + "/" + ytile;
	}




});