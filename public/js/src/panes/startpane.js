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

		this._container = Wu.DomUtil.createId('div', 'start-pane', Wu.app._mapContainer);

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
		// var _description	= 	project.getDescription()
		var _logo		= 	project.getLogo()
		// var _client		= 	project.getClient()
		var _uuid 		= 	project.getUuid();
		var _lastUpdated	= 	project.getLastUpdated();


		var container = Wu.DomUtil.create('div', 'start-pane-project', this._container);

		// Image wrapper
		var imageWrapper = Wu.DomUtil.create('div', 'start-project-image', container);

		// If there is a logo, render it
		if ( _logo ) {
			var logo = Wu.DomUtil.create('img', '', imageWrapper);
			logo.src = _logo;
		}
		
		// Project title div
		var name = Wu.DomUtil.create('div', 'start-project-name', container);

		// Adjust for short titles
		if ( _name.length < 22 ) Wu.DomUtil.addClass(name, 'start-project-short-name');
		name.innerHTML = _name;

		// Register hook
		Wu.DomEvent.on(container, 'mousedown', function() { this.activate(_uuid) }, this);

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