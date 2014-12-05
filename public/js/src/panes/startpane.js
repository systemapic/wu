Wu.StartPane = Wu.Class.extend({

	initialize : function (options) {
		
		Wu.setOptions(this, options);

		this.initContainer(options);

		this.addHooks();

	},

	initContainer : function(options) {

		// Get all projects
		var projectsUnsorted = this.options.projects;

		// Sort them by last updated
		var projects = _.sortBy(projectsUnsorted, function(p) {
			return p.getLastUpdated();
		});

		// Reverse so we get newest first
		projects.reverse();

		// this._container = Wu.DomUtil.createId('div', 'start-pane', Wu.app._mapContainer);

		// Main container
		this._container = Wu.DomUtil.createId('div', 'start-panne-canvas-container', Wu.app._mapContainer);
		
		// Circle
		this._circleContainer = Wu.DomUtil.createId('div', 'start-panne-circle-container', this._container);
		this._circle = Wu.DomUtil.createId('div', 'start-panne-circle', this._circleContainer);

		// Black banner
		this._bannerContainer = Wu.DomUtil.createId('div', 'start-panne-banner-container', this._container);
		this._banner = Wu.DomUtil.createId('div', 'start-panne-banner', this._bannerContainer);

		// Big client Logo (Rüppell's Griffon)
		this._logo = Wu.DomUtil.createId('div', 'start-panne-logo', this._banner);

		// Project list container + header
		this._recentProjectsContainer = Wu.DomUtil.createId('div', 'start-panne-recent-projects-container', this._banner);
		this._recentProjectsHeader = Wu.DomUtil.create('h1', '', this._recentProjectsContainer);
		this._recentProjectsHeader.innerHTML = 'Recent projects';

		// Project list
		this._projectList = Wu.DomUtil.createId('div', 'start-panne-project-list', this._recentProjectsContainer);

		// Spinning canvas
		this._spinningCanvasContainer = Wu.DomUtil.createId('div', 'start-panne-spinning-canvas-container', this._container);
		this._spinningCanvas = Wu.DomUtil.createId('div', 'start-panne-spinning-canvas', this._spinningCanvasContainer);
		this._bgMap = Wu.DomUtil.createId('div', 'start-panne-bg-map', this._spinningCanvas);




		// Pull out the latest three Projects	
		for ( var i = 0; i<projects.length-1; i++ ) {

			// Create project container
			this.createStartProject(projects[i]);

			// Stop after three projects
			if ( i == 2 ) break;
		}

	},

	createStartProject : function(project) {

		var _name 		= 	project.getName()
		// var _logo		= 	project.getLogo()
		var _uuid 		= 	project.getUuid();
		var _lastUpdated	= 	project.getLastUpdated();


		// var container = Wu.DomUtil.create('div', 'start-pane-project', this._container);
		var projectContainer = Wu.DomUtil.create('div', 'start-panne-recent-projects', this._projectList);


		// // Image wrapper
		// var imageWrapper = Wu.DomUtil.create('div', 'start-project-image', container);

		// // If there is a logo, render it
		// if ( _logo ) {
		// 	var logo = Wu.DomUtil.create('img', '', imageWrapper);
		// 	logo.src = _logo;
		// }
		
		// Project title div
		// var name = Wu.DomUtil.create('div', 'start-project-name', container);

		// Adjust for short titles
		if ( _name.length < 22 ) Wu.DomUtil.addClass(projectContainer, 'start-project-short-name');
		projectContainer.innerHTML = _name;

		// Register hook
		Wu.DomEvent.on(projectContainer, 'mousedown', function() { this.activate(_uuid) }, this);

	},

	addHooks : function () {
	},

	removeHooks : function () {
	},

	activate : function(uuid) {

		var project = this.options.projects[uuid];
		
		// select project
		project.select();

		// refresh sidepane
		app.SidePane.refreshProject(project);

		// Hide the Start Pane
		this.deactivate();

	},

	deactivate : function() {

		Wu.DomUtil.addClass(this._container, 'displayNone');
		this.removeHooks();

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

		// get dimensions of container
		// var height = context._imageContainer.offsetHeight;
		// var width = context._imageContainer.offsetWidth;

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

		console.log('url');

	}

})	