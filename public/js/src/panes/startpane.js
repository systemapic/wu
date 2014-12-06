Wu.StartPane = Wu.Class.extend({

	initialize : function (options) {
		
		// set options
		Wu.setOptions(this, options);

		// create container
		this.initContainer(options);

		// add events
		this.addHooks();

	},

	initContainer : function(options) {

		// create container (append to body)
		this._container = Wu.DomUtil.create('div', 'startpane-canvas-container', document.body);
		
		// init spinning map 	// todo!
		// this.initSpinner();

		// get latest proejcts
		// this.refreshProjects();

	},


	initSpinner : function () {

		// create content for black box
		var content = this._initSpinnerContent();

		// create map container
		var map = L.DomUtil.create('div', 'spinning-map', document.body);

		// create spinner instance
		this._spinner = new L.SpinningMap({
			autoStart : true,
			accessToken : 'pk.eyJ1Ijoic3lzdGVtYXBpYyIsImEiOiJkV2JONUNVIn0.TJrzQrsehgz_NAfuF8Sr1Q',
			layer : 'systemapic.kcjonn12',
			logo : 'images/griffon_logo_drop.png', // todo!
			content : content, 
			container : map,
			speed : 1000,
			position : {
				lat : -33.83214,
				lng : 151.22299,
				zoom : [4, 17]
			},
			circle : {
				radius : 120, 
				color : 'rgba(247, 175, 38, 0.3)',
				border : {
					px : 4,
					solid : 'solid',
					color : 'white'
				}
			},
		});

	},

	_initSpinnerContent : function () {

		// Circle
		this._circleContainer = Wu.DomUtil.create('div', 'startpane-circle-container', this._container);
		this._circle = Wu.DomUtil.create('div', 'startpane-circle', this._circleContainer);

		// Black banner
		this._bannerContainer = Wu.DomUtil.create('div', 'startpane-banner-container', this._container);
		this._banner = Wu.DomUtil.create('div', 'startpane-banner', this._bannerContainer);

		// Big client Logo (Rüppell's Griffon)
		this._logo = Wu.DomUtil.create('div', 'startpane-logo', this._banner);

		// Project list container + header
		this._recentProjectsContainer = Wu.DomUtil.create('div', 'startpane-recent-projects-container', this._banner);
		this._recentProjectsHeader = Wu.DomUtil.create('h1', 'startpane-header-title', this._recentProjectsContainer, 'Recent projects');

		// Project list
		this._projectList = Wu.DomUtil.create('div', 'startpane-project-list', this._recentProjectsContainer);

		// // Spinning canvas
		// this._spinningCanvasContainer = Wu.DomUtil.createId('div', 'start-panne-spinning-canvas-container', this._container);
		// this._spinningCanvas = Wu.DomUtil.createId('div', 'start-panne-spinning-canvas', this._spinningCanvasContainer);
		// this._bgMap = Wu.DomUtil.createId('div', 'start-panne-bg-map', this._spinningCanvas);


	},


	refreshProjects : function () {

		// clear old
		this._projectList.innerHTML = '';

		// get latest projects
		var projects = this._getLatestProjects();
		if (!projects) return;

		// Pull out the latest three Projects	
		projects.forEach(function (project, i) {
			if (i > 2) return;

			// Create project container
			this.createStartProject(project);
		}, this);

			

	},

	_getLatestProjects : function () {

		// Get all projects
		// var projectsUnsorted = this.options.projects;
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

		// select project hook
		Wu.DomEvent.on(projectContainer, 'mousedown', function() { this.selectProject(_uuid) }, this);

	},

	addHooks : function () {
	},

	removeHooks : function () {
	},

	selectProject : function(uuid) {

		var project = this.options.projects[uuid];
		
		// select project
		project.select();

		// refresh sidepane
		app.SidePane.refreshProject(project);

		// Hide the Start Pane
		this.deactivate();

	},

	// activate startpane
	activate : function () {

		// refresh latest projects
		this.refreshProjects();

		// show
		Wu.DomUtil.removeClass(this._container, 'displayNone');
	},

	// deactivate startpane
	deactivate : function() {

		// hide
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

});












