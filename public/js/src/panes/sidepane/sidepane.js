Wu.SidePane = Wu.Class.extend({
	_ : 'sidepane', 


	initialize : function (options) {
		
		this.options = options || app.options;

		this.initContainer();
		this.initContent();
		this.render();     
		
		return this;   
	},

	
	initContainer: function () {

		// create container
		var className = 'q-editor-container ct1';
		this._container = Wu.DomUtil.create('div', className, Wu.app._appPane);
		
		// toggle panes button
		this.paneOpen = false; // default
		this.whichPaneOpen = 'projects';
	},


	initContent : function () {
		
		// menu pane
		var className = 'q-editor-menu ct0';
		Wu.app._editorMenuPane = Wu.DomUtil.create('menu', className, this._container); 

		// content pane
		var className = 'q-editor-content ct1';
		app._editorContentPane = Wu.DomUtil.create('content', className, this._container); 

		// menuslider
		app._menuSlider = Wu.DomUtil.createId('div', 'menuslider', Wu.app._editorMenuPane);
		app._menuSliderArrow = Wu.DomUtil.createId('div', 'menuslider-arrow', Wu.app._menuSlider);	// refactor app

		Wu.DomUtil.addClass(Wu.app._menuSlider, 'ct1');
		
	},
	
	render : function () {
		var pane = this.options.panes;

		// render sidepanes
		if (pane.clients) 	this.Clients 	  = new Wu.SidePane.Clients();
		if (pane.mapOptions) 	this.Map 	  = new Wu.SidePane.Map();
		if (pane.documents) 	this.Documents 	  = new Wu.SidePane.Documents();
		if (pane.dataLibrary) 	this.DataLibrary  = new Wu.SidePane.DataLibrary();
		if (pane.mediaLibrary) 	this.MediaLibrary = new Wu.SidePane.MediaLibrary();
		if (pane.users) 	this.Users 	  = new Wu.SidePane.Users();

	},

	calculateHeight : function () {
		var header = app.HeaderPane;
		var height = header.getHeight();

		// set minimum width
		if (!height) height = 80;

		// set height
		this._minHeight = 0;
	},

	setHeight : function (height) {
		this._container.style.height = height + 'px';
	},

	collapse : function () {
		
		// calculate
		this.calculateHeight();
		
		// set height
		this.setHeight(this._minHeight);

		// close menu panes if open
		this.closePane();

	},

	expand : function () {
		// console.log('expand');
		this._container.style.height = '100%';
		this.openPane();
	},

	_getPaneArray : function () {
		var panes = [];
		var pane = this.options.panes;
		if (pane.clients) 	panes.push('Clients');
		if (pane.mapOptions) 	panes.push('Map');
		if (pane.documents) 	panes.push('Documents');
		if (pane.dataLibrary) 	panes.push('DataLibrary');
		if (pane.mediaLibrary) 	panes.push('MediaLibrary');
		if (pane.users) 	panes.push('Users');
		return panes;
	},

	setProject : function (project) {
		// update content
		if (this.Home) this.Home.updateContent(project);
		if (this.Map) this.Map.updateContent(project);
		if (this.Documents) this.Documents.updateContent(project);
		if (this.DataLibrary) this.DataLibrary.updateContent(project);
	},

	refreshProject : function (project) {

		var editMode = project.editMode; // access determined at Wu.Project
		
		// default menus in sidepane
		var panes = this._getPaneArray();
		
		// remove Map pane if not editor
		if (!editMode) _.pull(panes, 'Map');
		if (!app.Account.isManager()) _.pull(panes, 'Users');

		// refresh
		this.refresh(panes);
	},

	refreshClient : function () {
		
		// set panes 
		var panes = ['Clients'];
		if (app.Account.isManager()) panes.push('Users');

		// refresh
		this.refresh(panes);
	},

	// display the relevant panes
	refresh : function (panes) {

		this.panes = [];

		// all panes
		var all = ['Clients', 'Map', 'Documents', 'DataLibrary', 'MediaLibrary', 'Users'];
				
				
		// panes to active
		panes.forEach(function (elem, i, arr) {
			if (!Wu.app.SidePane[elem]) {
				Wu.app.SidePane[elem] = new Wu.SidePane[elem];
			}
			Wu.app.SidePane[elem].enable();
			this.panes.push(elem);	// stored for calculating the menu slider
		}, this);

		// panes to deactivate
		var off = all.diff(panes);
		off.forEach(function (elem, i, arr) {
			var dis = Wu.app.SidePane[elem];
			if (dis)  Wu.app.SidePane[elem].disable();
			_.pull(this.panes, elem);
		}, this)

	},

	
	// close sidepane
	closePane : function () {

		// return if already closed
		if (!this.paneOpen) return;
		this.paneOpen = false;

		// close
		this._container.style.width = '100px';

		// refresh leaflet
		setTimeout(function() {
			var map = Wu.app._map;
			if (map) map.reframe();
		}, 300); // time with css

		this._closePane();
		// console.log('app._active', app._active, this);

		Wu.DomUtil.removeClass(app.SidePane.Documents._content, 'show');
		Wu.DomUtil.removeClass(app.SidePane.DataLibrary._content, 'show');
		Wu.DomUtil.removeClass(app.SidePane.Users._content, 'show');

		

		// Wu.DomUtil.removeClass(app._active, 'show');

	},

	_closePane : function () {				// refactor: move to SidePane.Item ... 
		// noop
	},	

	// open sidepane
	openPane : function () {

		// return if already open
		if (this.paneOpen) return;
		this.paneOpen = true;

		// console.log('openPane: this.container: ', this._container);
		// console.log('openPane: this: ', this);

		// open
		this._container.style.width = '350px';
		Wu.DomUtil.addClass(app._active, 'show');	

		// refresh leaflet
		setTimeout(function() {
			var map = Wu.app._map;
			if (map) map.reframe();
		}, 300); // time with css
	},

	// set subheaders with client/project
	setSubheaders : function () {
		return;
		var client = Wu.app._activeClient; 	// TODO: refactor! _activeClient no longer exists
		var project = Wu.app.activeProject;

		// if active client 
		if (!client) return;
		Wu.DomUtil.get('h4-projects-client-name').innerHTML = client.name; 		// set projects' subheader
		Wu.DomUtil.get('h4-map-configuration-client-name').innerHTML = client.name; 	// set map configuration subheader
		Wu.DomUtil.get('h4-layers-client-name').innerHTML = client.name; 		// set layers subheader
		
		// if active project
		if (!project) return;
		Wu.DomUtil.get('h4-map-configuration-project-name').innerHTML = project.name; 	// set map configuration subheader
		Wu.DomUtil.get('h4-layers-project-name').innerHTML = project.name; 		// set layers subheader
	}
});