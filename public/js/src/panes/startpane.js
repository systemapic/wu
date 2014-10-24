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
		this._inner_container = [];

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


		// Container for each project
		var _inner_container_each = {

			container : Wu.DomUtil.create('div', 'start-pane-project', this._container),
			uuid : _uuid

		}

		// Put the proects in an array, to register hooks on
		this._inner_container.push(_inner_container_each);

		// Image wrapper
		var imageWrapper = Wu.DomUtil.create('div', 'start-project-image', _inner_container_each.container);

		// If there is a logo, render it
		if ( _logo ) {
			var logo = Wu.DomUtil.create('img', '', imageWrapper);
			logo.src = _logo;
		}
		
		// Project title div
		var name = Wu.DomUtil.create('div', 'start-project-name', _inner_container_each.container);

		// Adjust for short titles
		if ( _name.length < 22 ) Wu.DomUtil.addClass(name, 'start-project-short-name');
		name.innerHTML = _name;	

	},

	addHooks : function () {

		Wu.DomEvent.on(this._inner_container[0].container, 'mousedown', function() { this.activate(this._inner_container[0].uuid) }, this);
		Wu.DomEvent.on(this._inner_container[1].container, 'mousedown', function() { this.activate(this._inner_container[1].uuid) }, this);
		Wu.DomEvent.on(this._inner_container[2].container, 'mousedown', function() { this.activate(this._inner_container[2].uuid) }, this);

	},

	removeHooks : function () {

		Wu.DomEvent.off(this._inner_container[0].container, 'mousedown', function() { this.activate(this._inner_container[0].uuid) }, this);
		Wu.DomEvent.off(this._inner_container[1].container, 'mousedown', function() { this.activate(this._inner_container[1].uuid) }, this);
		Wu.DomEvent.off(this._inner_container[2].container, 'mousedown', function() { this.activate(this._inner_container[2].uuid) }, this);

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