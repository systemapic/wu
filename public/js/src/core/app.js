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
			mediaLibrary    : false,
			users 		: true,
		},	
		
		// not plugged in
		chat : true,
		colorTheme : true,
		screenshot : true,

		providers : {
			// default accounts, added to all new (and old?) projects
			mapbox : [{	
				username : 'systemapic',
				accessToken : 'pk.eyJ1Ijoic3lzdGVtYXBpYyIsImEiOiJQMWFRWUZnIn0.yrBvMg13AZC9lyOAAf9rGg'
			}]
		},

		servers : {
			// not used, using window url atm..
			portal : 'http://85.10.202.87:8080/',
			raster : 'http://85.10.202.87:8003/',
			vector : '',	// tile servers
			socket : ''	// websocket server
		}
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

		console.log('Server: ', serverUrl);

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


	_initPanes : function () {

		// render status pane
		// add home button
		this.StatusPane = new Wu.StatusPane({
			addTo: this._appPane
		});

		// render side pane 
		this.SidePane = new Wu.SidePane();	// todo: add settings more locally? Wu.SidePane({options})

		// render header pane
		this.HeaderPane = new Wu.HeaderPane();

		// render map pane
		this.MapPane = new Wu.MapPane();

		// render status bar
		// if (this.options.statusPane) this.StatusPane = new Wu.StatusPane();

	},

	// init default view on page-load
	_initView : function () {

		// runs hotlink
		if (this._initHotlink()) return;

		// if user is admin or manager, set Projects and Users as default panes
		var user = app.Account;
		if (user.isAdmin() || user.isSuperadmin() || user.isManager()) {
			// set panes 
			var panes = ['Clients', 'Users'];
			this.SidePane.refresh(panes);
		}

	},


	// _singleClient : function () {
	// 	return;
	// 	var size = _.size(this.Clients);
	// 	var can = Wu.can.createClient();

	// 	if (size > 1) return;
	// 	if (can) return;

	// 	var clientUuid = this.User.options.access.clients.read[0];
	// 	var client = this.Clients[clientUuid];

	// 	// select client
	// 	this.SidePane.Clients.select(client);

	// 	// open pane
	// 	this.SidePane.openPane();

	// 	// hide Clients tab
	// 	this.SidePane.Clients.permanentlyDisabled = true;
		
	// },

	_initHotlink : function () {
		
		// parse error prone content of hotlink..
		try { this.hotlink = JSON.parse(window.hotlink); } 
		catch (e) { this.hotlink = false };

		console.log('this.hotlink: ', this.hotlink);

		// return if no hotlink
		if (!this.hotlink) return false;

		// check if project slug exists, and if belongs to client slug
		var project = this._projectExists(this.hotlink.project, this.hotlink.client);

		// return if not found
		if (!project) return false;

		// select project
		project.select();
		app.SidePane.refreshProject(project);

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

	// shorthand for setting status bar
	setStatus : function (status, timer) {
		app.StatusPane.setStatus(status, timer);
	}

});