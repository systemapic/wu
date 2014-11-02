Wu.version = '0.3-dev';
Wu.App = Wu.Class.extend({
	_ : 'app',

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
			mediaLibrary    : false
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
				accessToken : 'pk.eyJ1Ijoic3lzdGVtYXBpYyIsImEiOiJQMWFRWUZnIn0.yrBvMg13AZC9lyOAAf9rGg'
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

	},

	initServer : function () {
		var serverUrl = this.options.servers.portal;
		console.log('Connected to server: ', serverUrl);

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

	},

	_initContainer : function () {

		// find or create container
		var id = this.options.id
		this._appPane = Wu.DomUtil.get(id) || Wu.DomUtil.createId('div', id || 'app', document.body);

		// create map container
		this._mapContainer = Wu.DomUtil.createId('div', 'map-container', this._appPane);

	},

	_initDependencies : function () {

		// icanhaz templates
		ich.grabTemplates()

	},

	_initObjects : function () {

		// main user account
		this.Account = new Wu.User(this.options.json.account);
		
		// set access token
		this.setToken();

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

		// render style handler
		this.Style = new Wu.Style();

		// render status pane
		this.StatusPane = new Wu.StatusPane({
			addTo: this._appPane
		});

		// render progress bar
		this.ProgressBar = new Wu.ProgressBar({
			color : 'white',
			addTo : this._appPane
		});

		// render side pane 
		this.SidePane = new Wu.SidePane();	// todo: add settings more locally? Wu.SidePane({options})

		// render header pane
		this.HeaderPane = new Wu.HeaderPane();

		// render map pane
		this.MapPane = new Wu.MapPane();

		
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
			this.SidePane.refresh(['Clients', 'Users']);		
		}

		// render Start pane?
		this.StartPane = new Wu.StartPane({
			projects : this.Projects
		});

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

		console.log('params: ', params);
		console.log('client: ', client);
		console.log('project: ', project);
		console.log('hash: ', hash);

		

		if (!client || !project) return false;

		// get project
		var project = this._projectExists(project, client);
		
		// return if no such project
		if (!project) return false;

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

		// handle errors
		if (result.error) console.log('error?', result.error);

		// set vars
		var hash = result.hash;
		var projectUuid = hash.project || result.project;	// hacky.. clean up setHash, _renderHash, errything..

		// set position
		app.MapPane.setPosition(hash.position);

		// set layers
		hash.layers.forEach(function (layerUuid) {
			var layer = app.Projects[projectUuid].layers[layerUuid];

			if (app.MapPane.layerMenu) {
				layer.add(); 	// todo: add from layermenu...
			} else {
				layer.add();	// todo: what if activating layermenu afterwards? ... 
						// lots of different possible variatons here.. PLAN AHEAD!
			}

		}, this);

	},


	// save a hash
	setHash : function (callback) {

		// get active layers
		var active = app.MapPane.getActiveLayers();
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


	   	if (!projectUuid) return false;

		// get project
		var project = app.Projects[projectUuid];
		
		// return if no such project
		if (!project) return false;

		// set project
		this._setProject(project);

		// hide controls and make header minimum width		// todo: create and inject PRINT/SCREENSHOT stylesheet
		app._map._controlContainer.style.display = 'none'
		app.HeaderPane._container.style.width = 'auto';

		// check for hash
		if (hash) {

			console.log('we got a hash!: ', hash);	

			var json = JSON.stringify({
				hash: hash,
				project : projectUuid
			});

			// render hash
			this._renderHash(this, json);
		}

		// avoid Loading! etc in status
		app.setStatus('systemapic'); // too early


	},
	
	_phantomJSLoaded : function () {
		// check if ready for screenshot

	},


	// phantomjs: loaded layers
	_loaded : [],

	// phantomjs: load layermenu layers
	_loadLayers : function (layermenuItems) {

	},

	// phantomjs: check if all layers are loaded
	_allLoaded : function () {

	},







});