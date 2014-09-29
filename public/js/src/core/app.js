Wu.version = '0.2-dev';
Wu.App = Wu.Class.extend({

	options : {},

	initialize : function (options) {

		// set global this
		Wu.app = this;

		// merge options
		Wu.setOptions(this, options);    

		// set options
		L.mapbox.config.FORCE_HTTPS = true;
		L.mapbox.accessToken = 'pk.eyJ1Ijoic3lzdGVtYXBpYyIsImEiOiJQMWFRWUZnIn0.yrBvMg13AZC9lyOAAf9rGg';

		// get objects from server
		this.initServer();

	},

	initServer : function () {
		var serverUrl = this.options.server;

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

		// check for /client/project url
		this._initHotlink();			// incl. if only one client (and only read access), then hide Clients tab

		// check if only one client and no read
		this._singleClient();

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

		// render side pane 
		this.SidePane = new Wu.SidePane();

		// render header pane
		this.HeaderPane = new Wu.HeaderPane();

		// render map pane
		this.MapPane = new Wu.MapPane();

	},

	// init default view on page-load
	_initView : function () {


		// if user is admin or manager, set Projects and Users as default panes
		var user = app.Account;
		if (user.isAdmin() || user.isSuperadmin() || user.isManager()) {
			// set panes 
			var panes = ['Clients', 'Users'];
			this.SidePane.refresh(panes);
		}

	},


	_singleClient : function () {
		return;
		var size = _.size(this.Clients);
		var can = Wu.can.createClient();

		if (size > 1) return;
		if (can) return;

		var clientUuid = this.User.options.access.clients.read[0];
		var client = this.Clients[clientUuid];

		// select client
		this.SidePane.Clients.select(client);

		// open pane
		this.SidePane.openPane();

		// hide Clients tab
		this.SidePane.Clients.permanentlyDisabled = true;
		
	},

	_initHotlink : function () {
		return;
		
		// only if hotlink
		if (!window.hotlink.hasOwnProperty('client')) return;
		
		// if user has access to client/project
		var client = this._hasClient();
		var project = this._hasProject();
		
		// reset address bar if no client
		if (!client) return Wu.Util.setAddressBar(url);
			 
		// select client
		this.SidePane.Clients.select(client);
		
		if (!project) {
			// open projects pane so user can select something
			this.SidePane.openPane();
		}

		// select project
		if (project) {
			this.SidePane.Projects.select(project);

			// if read only on project, closePane
			if (!_.contains(this.User.options.access.projects.write, project.uuid) && _.contains(this.User.options.access.projects.read, project.uuid) ) {
				this.SidePane.closePane();
			}
		}

		

		

	},


	_hasClient : function (clientSlug) {

		// find client slug in Wu.app.Clients
		clientSlug = clientSlug || window.hotlink.client;
		for (c in Wu.app.Clients) {
			var client = Wu.app.Clients[c];
			if (clientSlug == client.slug) return client; 
			
		}
		return false;
	},

	_hasProject : function (projectSlug) {

		// find project slug in Wu.app.Projects
		projectSlug = projectSlug || window.hotlink.project;
		for (p in Wu.app.Projects) {
			var project = Wu.app.Projects[p];
			if (projectSlug == project.slug) return project; 
		}
		return false;
	}

});