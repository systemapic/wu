Wu.version = '1.0-beta';
Wu.App = Wu.Class.extend({
	_ : 'app',

	// debug : true,

	// default options
	options : systemapicConfigOptions, // global var from config.js... perhaps refactor.

	language : language,

	_ready : false,

	initialize : function (options) {

		console.log('Systemapic v.' + Wu.version);

		// set global this
		Wu.app = window.app = this;

		app.Socket = new Wu.Socket();

		// error handling
		this._initErrorHandling();

		// merge options
		Wu.setOptions(this, options);

		// Init analytics
		this._initAnalytics();

		// set page title
		document.title = this.options.portalTitle;

		// get objects from server
		this.initServer();

		// Detect mobile devices
		this.detectMobile();
	},

	_initErrorHandling : function () {
		window.onerror = function (message, file, line, char, ref) {
			
			var stack = ref.stack;
			var project = app.activeProject ? app.activeProject.getTitle() : 'None';
			var username = app.Account ? app.Account.getName() : 'No name';
			
			var options = JSON.stringify({
				message : message,
				file : file,
				line : line,
				user : username,
				stack : stack,
				project : project
			});

			Wu.save('/api/error/log', options);
		}
	},

	initServer : function () {
		console.log('Securely connected to server: \n', this.options.servers.portal);

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

		// accesss
		this._initAccess();

		// init global events
		// this._initEvents();

		// load json model
		this._initObjects();

		// create app container
		this._initContainer();

		// create panes
		this._initPanes();

		// init pane view
		this._initView();

		// ready
		this._ready = true;

		// debug
		this._debug();
	},

	_initAnalytics : function () {
		this.Analytics = new Wu.Analytics();
	},

	_initObjects : function () {

		// controller
		this.Controller = new Wu.Controller();

		// main user account
		this.Account = new Wu.User(this.options.json.account);

		// create user objects
		this.Users = {};
		this.options.json.users.forEach(function(user, i, arr) {
		       this.Users[user.uuid] = new Wu.User(user);             
		}, this);
		
		// create client objects
		this.Clients = {};
		this.options.json.clients.forEach(function(elem, i, arr) {
		       this.Clients[elem.uuid] = new Wu.Client(elem, this);             
		}, this);

		// create project objects
		this.Projects = {};
		this.options.json.projects.forEach(function(elem, i, arr) {
		       this.Projects[elem.uuid] = new Wu.Project(elem, this);
		}, this);
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
		// this.Dropzone = new Wu.Dropzone();

		// render side pane 
		this.SidePane = new Wu.SidePane();	// todo: add settings more locally? Wu.SidePane({options})

		// render header pane
		this.HeaderPane = new Wu.HeaderPane();

		// render map pane
		this.MapPane = new Wu.MapPane();

		// render eror pane
		this.FeedbackPane = new Wu.FeedbackPane();

	},

	// init default view on page-load
	_initView : function () {

		// check location
		if (this._initLocation()) return;
			
		// runs hotlink
		if (this._initHotlink()) return;

		// set project if only one
		if (this._lonelyProject()) return;

		// // if user is admin or manager, set Projects and Users as default panes
		// var user = app.Account;
		// if (app.access.is.superAdmin() || app.access.is.portalAdmin()) {
		// 	// set panes 
		// 	this.SidePane.refresh(['Clients', 'Users', 'Account']);		
		// }

		// activate startpane
		this.StartPane.activate();
	},

	_initEvents : function () {

		// set event fire
		// this.fire = new Wu.Events();

		Wu.DomEvent.on(window, 'resize', this._resizeEvents, this);
	},

	_resizeEvents : function (e) {

		return;
		// todo: rewrite to emit resize event!

		// get window dimensions
		var dimensions = this._getDimensions(e);

		// startpane resize event
		if (app.StartPane.isOpen) app.StartPane.resizeEvent(dimensions);

		// mappane resize event
		if (app.MapPane) app.MapPane.resizeEvent(dimensions);

		// legends control resize
		var legendsControl = app.MapPane.getControls().legends;
		if (legendsControl) legendsControl.resizeEvent(dimensions);

		// layermenu control resize
		var layermenuControl = app.MapPane.getControls().layermenu;
		if (layermenuControl) layermenuControl.resizeEvent(dimensions);
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

	_initAccess : function () {
		this.Access = new Wu.Access(this.options.json.access);
	},

	// _isDev : function (user) {
	// 	if (user.uuid.slice(0,-13) == 'user-b76a8d27-6db6-46e0-8fc3') return true; // phantomJS user
	// 	if (user.uuid.slice(0,-13) == 'user-9fed4b5f-ad48-479a-88c3') return true; // phantomJS user
	// 	if (user.uuid.slice(0,-13) == 'user-e6e5d7d9-3b4c-403b-ad80') return true; // phantomJS user
	// 	return false;
	// },

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

		// init hash
		if (hash) {
			console.log('got hash!', hash, project);
			this._initHash(hash, project);
		}
		return true;
	},

	_setProject : function (project) {
		
		// select project
		Wu.Mixin.Events.fire('projectSelected', {detail : {
			projectUuid : project.getUuid()
		}});

	},

	_initHotlink : function () {
		
		// parse error prone content of hotlink..
		Wu.parse(window.hotlink);

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
				var lm = app.MapPane.getControls().layermenu;
				if (lm) {
					var lmi = lm._getLayermenuItem(layerUuid);
					lm.enableLayer(lmi);
				}
			}
			
		}, this);
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

		// // return
		// return json.hash;

	},


	phantomJS : function (args) {
		var projectUuid = args.projectUuid,
	   	    hash    	= args.hash,
	   	    isThumb     = args.thumb;

	   	// return if no project
	   	if (!projectUuid) return false;

	   	// set hash for phantom
	   	this._phantomHash = hash;

	   	// if (!app.Projects) return;

		// get project
		var project = app.Projects[projectUuid];
		
		// return if n§o such project
		if (!project) return false;

		// set project
		Wu.Mixin.Events.fire('projectSelected', { detail : {
			projectUuid : projectUuid
		}});

		// app.activeProject = project;

		
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
		// app.MapPane.legendsControl.refreshAllLegends();
		app.MapPane._controls.legends.refreshAllLegends();

		// remove startpane
		if (this.StartPane) this.StartPane.deactivate();

		// add phantomJS stylesheet		
		isThumb ? app.Style.phantomJSthumb() : app.Style.phantomJS();


		// avoid Loading! etc in status
		app.setStatus('systemapic'); // too early

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

		// Wu.send('/api/debug/phantom', {
		// 	loaded : this._loaded.length,
		// 	loading : this._loading.length,
		// 	num : numLayers
		// });

		if (numLayers == 0) return true;

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