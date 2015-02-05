Wu.StartPane = Wu.Class.extend({

	initialize : function (options) {
		
		// set options
		Wu.setOptions(this, options);

	},

	activate : function () {

		// create container
		this.initSpinner();

		// add events
		this.addHooks();

		// refresh latest projects
		this.refreshProjects();

	},	

	deactivate : function() {

		// remove hooks
		this.removeHooks();

		// kill spinner
		if (this._spinner) this._spinner.disable();

		// delete divs
		if (this._container) Wu.DomUtil.remove(this._container);

	},


	initSpinner : function () {

		// create container 
		this._container = Wu.DomUtil.create('div', 'startpane-canvas-container', app._appPane);

		// create content for black box
		var content = this._initSpinnerContent();
		this._wrapper = Wu.DomUtil.create('div', 'spinning-wrapper', this._container);

		this._wrapper.appendChild(content);

		this._spinner = false;
		return;

		// create spinner instance
		this._spinner = new L.SpinningMap({
			autoStart : true,
			accessToken : 'pk.eyJ1Ijoic3lzdGVtYXBpYyIsImEiOiJkV2JONUNVIn0.TJrzQrsehgz_NAfuF8Sr1Q',
			layer : 'systemapic.kcjonn12', 	// todo: several layers
			logo : 'images/griffon_logo_drop.png', // todo!
			content : content, 
			container : this._container,
			wrapper : this._wrapper,
			speed : 1000,
			tileFormat : 'png', // quality of mapbox tiles
			interactivity : false,
			gl : false,
			position : {
				lat : -33.83214,
				lng : 151.22299,
				zoom : [4, 17]
			},
			circle : false,
		});
	},

	_initSpinnerContent : function () {

		// create wrapper
		var wrapper = Wu.DomUtil.create('div', 'startpane-spinning-content');

		// black box in centre
		this._bannerContainer = Wu.DomUtil.create('div', 'startpane-banner-container', wrapper);
		this._banner = Wu.DomUtil.create('div', 'startpane-banner', this._bannerContainer);

		this._recentProjectsContainer = Wu.DomUtil.create('div', 'startpane-recent-projects-container', this._banner);

		// this._userName = Wu.DomUtil.create('div', 'startpane-user-name', this._recentProjectsContainer);
		// this._userName.innerHTML = app.Account.getName();

		this._recentProjectsHeader = Wu.DomUtil.create('h1', 'startpane-header-title', this._recentProjectsContainer, 'Recent projects:');
		this._projectList = Wu.DomUtil.create('div', 'startpane-project-list', this._recentProjectsContainer);

		// return 
		return wrapper;
		
	},


	refreshProjects : function () {

		// clear old
		this._projectList.innerHTML = '';

		// get latest projects
		var projects = this._getLatestProjects();
		if (!projects) return;

		// Pull out the latest three Projects	
		projects.forEach(function (project, i) {
			if (i > 5) return;

			// Create project container
			this.createStartProject(project);
		}, this);
	},

	_getLatestProjects : function () {

		// Get all projects
		var projectsUnsorted = app.Projects;	

		// Sort them by last updated
		var projects = _.sortBy(projectsUnsorted, function(p) {
			return p.getLastUpdated();
		});

		// Reverse so we get newest first
		projects.reverse();


		return projects;
	},

	createStartProject : function(project) {

		// Client info
		var clientID = project.store.client;
		var clientName = app.Clients[clientID].name;
		var clientLogo = app.Clients[clientID].logo;

		// create container
		var _projectContainer = Wu.DomUtil.create('div', 'start-panne-recent-projects', this._projectList);
		
		var _projectThumb = Wu.DomUtil.create('img', '', _projectContainer);
		_projectThumb.src = project.store.logo;

		var _projectTitle = Wu.DomUtil.create('div', 'start-project-name', _projectContainer);
		_projectTitle.innerHTML = project.getName();

		var _clientName = Wu.DomUtil.create('div', 'start-project-client-name', _projectContainer);
		_clientName.innerHTML = clientName;

		var _clientLogo = Wu.DomUtil.create('img', 'start-project-client-logo', _projectContainer);
		_clientLogo.src = clientLogo;


		// Adjust for short titles
		if (project.getName().length < 22) Wu.DomUtil.addClass(_projectTitle, 'short-name');
		

		var client




		// select project hook
		Wu.DomEvent.on(_projectContainer, 'mousedown', function() { this.selectProject(project); }, this);

	},

	addHooks : function () {
	},

	removeHooks : function () {
	},

	selectProject : function(project) {

		// select project
		project.select();

		// refresh sidepane
		app.SidePane.refreshProject(project);

		// Hide the Start Pane
		this.deactivate();

	},


	update : function() {

	},


	createImage : function () {

		var that = this;	// callback
		app.setHash(function (ctx, hash) {

			// get snapshot from server
			Wu.post('/api/util/snapshot', hash, that.createdImage, that);

		});
	},

	createdImage : function (context, file) {

		// parse results
		var result = JSON.parse(file);
		var image = result.image;

		// set path
		var path = app.options.servers.portal;
		path += 'pixels/';
		path += image;
		var raw = path;
		path += '?width=' + 250;
		path += '&height=' + 150;

		// set url
		var url = 'url("';
		url += path;
		url += '")';
	}
});

