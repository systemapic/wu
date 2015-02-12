Wu.StartPane = Wu.Class.extend({

	initialize : function (options) {
		
		// set options
		Wu.setOptions(this, options);


		this.dimensions = {
			screenW 	: 	0,
			screenH 	: 	0,
			boxW 		: 	350,
			boxH 		: 	233,
			sizeMode 	: 	'',
			projectNo 	: 	0
		}

		this.projectContainers	= [];
	},

	activate : function () {

		this.isOpen = true;

		// create container
		this.initSpinner();

		// add events
		this.addHooks();

		// refresh latest projects
		this.refreshProjects();

		// Show the header pane.
		Wu.DomUtil.removeClass(Wu.app.HeaderPane._container, 'displayNone');


		// screendimentions
		// app._getDimensions()
	


	},	

	deactivate : function() {

		this.isOpen = false;

		// remove hooks
		this.removeHooks();

		// kill spinner
		if (this._spinner) this._spinner.disable();

		// delete divs
		if (this._container) Wu.DomUtil.remove(this._container);

	},


	initSpinner : function () {

		console.log('initSpinner');

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

		this._recentProjectsHeader = Wu.DomUtil.create('h1', 'startpane-header-title', this._recentProjectsContainer, 'Recent projects:');
		this._projectList = Wu.DomUtil.create('div', 'startpane-project-list', this._recentProjectsContainer);

		// return 
		return wrapper;
		
	},


	refreshProjects : function () {

		// clear old
		this._projectList.innerHTML = '';

		// get latest projects
		this.projects = this._getLatestProjects();

		// set number of projects 
		this.dimensions.projectNo = this.projects.length;

		if (!this.projects) return;

		// Pull out the latest three Projects	
		this.projects.forEach(function (project, i) {
			if (i > 5) return;
			// Create project container
			this.createStartProject(project);
		}, this);


		// Get screen dimensions
		var dims = app._getDimensions();

		// Store width and height
		this.dimensions.screenW = dims.width;
		this.dimensions.screenH = dims.height;	

		// run sizer
		this.positionSpinner(dims);
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

		var newProject = {};
		// create container
		newProject._projectContainer = Wu.DomUtil.create('div', 'start-panne-recent-projects', this._projectList);
		
		newProject._projectThumb = Wu.DomUtil.create('img', '', newProject._projectContainer);
		newProject._projectThumb.src = project.store.logo;

		newProject._projectTitle = Wu.DomUtil.create('div', 'start-project-name', newProject._projectContainer);
		newProject._projectTitle.innerHTML = project.getName();

		newProject._clientName = Wu.DomUtil.create('div', 'start-project-client-name', newProject._projectContainer);
		newProject._clientName.innerHTML = clientName;

		newProject._clientLogo = Wu.DomUtil.create('img', 'start-project-client-logo', newProject._projectContainer);
		newProject._clientLogo.src = clientLogo;


		this.projectContainers.push(newProject);


		// Adjust for short titles
		if (project.getName().length < 22) Wu.DomUtil.addClass(newProject._projectTitle, 'short-name');
		

		// var client

		// select project hook
		Wu.DomEvent.on(newProject._projectContainer, 'mousedown', function() { this.selectProject(project); }, this);

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
	},


	resizeEvent : function (dimensions) {

		this.positionSpinner(dimensions);

	},

	positionSpinner : function (dimensions) {
		
		var w = dimensions.width;
		var h = dimensions.height;

		if ( h != this.dimensions.screenH ) {
			this.dimensions.screenH = h;
			this.changeHeight(dimensions);
		}


		// 3 blocks wide
		if ( w >= 1091 ) {
			if ( this.dimensions.sizeMode == 'full' ) return;
			this.dimensions.sizeMode = 'full';
			this.setYposition(dimensions);
		}

		// 2 blocks wide
		if ( w <= 1090 && w >= 761) {
			if ( this.dimensions.sizeMode == 'medium' ) return;
			this.dimensions.sizeMode = 'medium';
			this.setYposition(dimensions);
		} 

		// 1 block wide
		if ( w <= 760 ) {
			if ( this.dimensions.sizeMode == 'small' ) return;
			this.dimensions.sizeMode = 'small';
			this.setYposition(dimensions);
		}

	},

	changeHeight : function (dimensions) {

		console.log('change the height');
		this.setYposition(dimensions);


	},

	setYposition : function (dimensions) {

		var w = dimensions.width;
		var h = dimensions.height;

		// 3 projects wide
		if ( this.dimensions.sizeMode == 'full' ) {

			// Decide how many projects we want to show based on height
			if ( h >= 691 ) 		this.showBoxes(6);
			if ( h <= 690 ) 		this.showBoxes(3);

			// figure out padding
			if ( this.dimensions.projectNo >= 4 ) 	var fullH = this.dimensions.boxH * 2;
			else 					var fullH = this.dimensions.boxH;

			// calculate padding
			this.calcPadding(h, fullH);

		}

		// 2 projects wide
		if ( this.dimensions.sizeMode == 'medium' ) {
		
			// Decide how many projects we want to show based on height
			if ( h >= 921 ) 		this.showBoxes(6);		
			if ( h <= 920 && h >= 661 ) 	this.showBoxes(4);	
			if ( h <= 660 ) 		this.showBoxes(2);		
		
			// figure out padding
			if ( this.dimensions.projectNo >= 5 )						var fullH = this.dimensions.boxH * 3;	// 3 rows (5 or 6 projects)
			else if ( this.dimensions.projectNo >= 3 && this.dimensions.projectNo <=4 )	var fullH = this.dimensions.boxH * 2; 	// 2 rows (3 or 4 projects)
			else 										var fullH = this.dimensions.boxH;	// 1 row  (1 or 2 projects)	

			// calculate padding
			this.calcPadding(h, fullH);

		}

		// 1 project wide
		if ( this.dimensions.sizeMode == 'small' ) {
		
			// Decide how many projects we want to show based on height
			if ( h >= 921 ) 		this.showBoxes(3);	
			if ( h <= 920 && h >= 661 ) 	this.showBoxes(2);
			if ( h <= 660 ) 		this.showBoxes(1);
		
			// figure out padding
			if ( this.dimensions.projectNo >= 3 )						var fullH = this.dimensions.boxH * 3;
			else if ( this.dimensions.projectNo == 2 )					var fullH = this.dimensions.boxH * 2;
			else if ( this.dimensions.projectNo == 1 )					var fullH = this.dimensions.boxH;

			// calculate padding
			this.calcPadding(h, fullH);

		}


	},

	showBoxes : function (no) {

		// Store how many projects we want to show
		this.dimensions.projectNo = no;

		for ( var i = 0; i < this.projects.length; i++ ) {
			if ( i < no ) 	Wu.DomUtil.removeClass(this.projectContainers[i]._projectContainer, 'displayNone');
			else		Wu.DomUtil.addClass(this.projectContainers[i]._projectContainer, 'displayNone');
		}

	},

	// Calculates top padding of container
	calcPadding : function(screenHeight, boxesHeight) {

			// Calculate padding
			var padding = Math.floor((screenHeight - boxesHeight)/2);

			// Minimum padding is 100 pixels
			if ( padding <= 100 ) padding = 100;

			// Set padding
			this._wrapper.style.paddingTop = padding + 'px';

	}
});

