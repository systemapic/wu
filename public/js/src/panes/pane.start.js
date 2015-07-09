Wu.StartPane = Wu.Pane.extend({

	dimensions : {
		screenW 	: 	0,
		screenH 	: 	0,
		boxW 		: 	350,
		boxH 		: 	233,
		sizeMode 	: 	'',
		projectNo 	: 	0
	},

	projectContainers : [],

	_projectSelected : function (e) {
		this.deactivate();
	},

	activate : function () {

		this.isOpen = true;

		// create container
		this.initContainer();

		// add events
		this.addHooks();

		// refresh latest projects
		this.refreshProjects();

		// Show the header pane.
		Wu.DomUtil.removeClass(Wu.app.HeaderPane._container, 'displayNone');

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


	initContainer : function () {

		// create container 
		this._container = Wu.DomUtil.create('div', 'startpane-canvas-container', app._appPane);

		// create content for black box
		var content = this._initContent();
		this._wrapper = Wu.DomUtil.create('div', 'spinning-wrapper', this._container);

		this._wrapper.appendChild(content);

	},

	initSpinner : function () {

		
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

	_initContent : function () {

		// create wrapper
		var wrapper 			= Wu.DomUtil.create('div', 'startpane-spinning-content');

		// black box in centre
		this._bannerContainer    	= Wu.DomUtil.create('div', 'startpane-banner-container', wrapper);
		this._banner 			= Wu.DomUtil.create('div', 'startpane-banner', this._bannerContainer);

		this._recentProjectsContainer 	= Wu.DomUtil.create('div', 'startpane-recent-projects-container', this._banner);
		
		if ( this._getLatestProjects().length > 1 ){
			//1 and not 0 since hidden/default project is counted in

			//there are some projects for this user
			//console.log("has: " + this._getLatestProjects().length + " projects");
			this._recentProjectsHeader = Wu.DomUtil.create('h1', 'startpane-header-title', this._recentProjectsContainer, 'Recent projects:');

		} else {

			//there are no projects for this user
			
			if (app.access.to.create_project()) {
				//the user has access to create projects
				this._recentProjectsHeader = Wu.DomUtil.create('h1', 'startpane-header-title', this._recentProjectsContainer, 'Get started:');
				this._hasAccessMessage = Wu.DomUtil.create('p', 'startpane-has-access',this._recentProjectsContainer,'Hello ' +app.Account.getFirstName()+'.<br/>You have no projects yet. Choose one of your clients and click the respective button below to start a project.');
				
				for (c in app.Clients) {
					var client = app.Clients[c];
					
					var logo = client.getLogo();
					var name = client.getName();
					
					// same as app.SidePane.Clients.clients[i].client.name 
					this._clientDiv = Wu.DomUtil.create('p', 'startpane-has-client', this._recentProjectsContainer,name + '<br/>');
					//this._clientDiv = Wu.DomUtil.create(...etc)
				}

			} else {
				//the user has no access to create projects
				this._recentProjectsHeader = Wu.DomUtil.create('h1', 'startpane-header-title', this._recentProjectsContainer, 'No current projects.');
				this._hasNoAccessMessage = Wu.DomUtil.create('p', 'startpane-has-no-access',this._recentProjectsContainer,'Hello ' +app.Account.getFirstName()+',<br/>You are currently not participating in any projects, and you are not allowed to create a project. <br/>Please wait for an invitation.');
				
			}
		}	

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

		this.addHooks();
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

	createStartProject : function (project) {

		if (!project) return;

		var client = project.getClient();

		if (!client) return;


		var newProject = {};

		// create container
		newProject._projectContainer = Wu.DomUtil.create('div', 'start-panne-recent-projects', this._projectList);
		newProject._projectThumb = Wu.DomUtil.create('img', '', newProject._projectContainer);

		// Load image in memory before we paste it (to see image orientation)
		var img = new Image();

		// Serve project logo or a random predefined thumb image
		var ssrc = project.getLogo() || app.options.servers.portal + 'css/images/default-thumbs/default-thumb-' + Math.floor(Math.random() * 10) + '.jpg';
		img.src = ssrc;



		var boxW    = this.dimensions.boxW;
		var boxH    = this.dimensions.boxH;

		img.onload = function() {


			var wProp = img.width / boxW;
			var hProp = img.height / boxH;

			if ( hProp <= wProp ) {

				// landscape
				newProject._projectThumb.style.height = '100%';
				newProject._projectThumb.style.width = 'auto';

			} else {
				
				// portrait
				newProject._projectThumb.style.height = 'auto';
				newProject._projectThumb.style.width = '100%';
			
			}

			newProject._projectThumb.src = ssrc;
		}

		newProject._projectTitle = Wu.DomUtil.create('div', 'start-project-name', newProject._projectContainer);
		newProject._projectTitle.innerHTML = project.getName();

		newProject._clientName = Wu.DomUtil.create('div', 'start-project-client-name', newProject._projectContainer);
		newProject._clientName.innerHTML = client.getName();

		if (client.getLogo()) {
			newProject._clientLogo = Wu.DomUtil.create('img', 'start-project-client-logo', newProject._projectContainer);
			newProject._clientLogo.src = client.getLogo();
		}

		this.projectContainers.push(newProject);

		// Adjust for short titles
		if (project.getName().length < 22) Wu.DomUtil.addClass(newProject._projectTitle, 'short-name');
		
		// select project hook
		Wu.DomEvent.on(newProject._projectContainer, 'click', function() { this.selectProject(project); }, this);

	},

	addHooks : function () {

	},
	removeHooks : function () {

	},

	enableHooks : function () {
		console.log('addhooks')
		this._hooksDisabled = false;
	},

	disableHooks : function () {
		console.log('remohooks');
		this._hooksDisabled = true;
	},

	selectProject : function(project) {

		console.log('select!');

		// a hack to disable hook temporarily
		if (this._hooksDisabled) return;

		console.log('..selecting');

		// select project
		// project.select();

		// refresh sidepane
		app.SidePane.refreshMenu();

		Wu.Mixin.Events.fire('projectSelected', { detail : {
			projectUuid : project.getUuid()
		}});  

		// Hide the Start Pane
		this.deactivate();

		// Google Analytics event trackign
		app.Analytics.setGaPageview(project.getUuid());

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

		for (var i = 0; i < this.projects.length; i++) {
			if (i < no) {
				var project = this.projectContainers[i];
				if (project) Wu.DomUtil.removeClass(project._projectContainer, 'displayNone');
			} else {
				var project = this.projectContainers[i];
				if (project) Wu.DomUtil.addClass(project._projectContainer, 'displayNone');
			}	    
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

