Wu.SidePane = Wu.Class.extend({


	initialize : function (options) {
		
		this.options = options || Wu.app.options;

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
	},


	initContent : function () {
		
		// menu pane
		var className = 'q-editor-menu ct0';
		Wu.app._editorMenuPane = Wu.DomUtil.create('menu', className, this._container); 

		// content pane
		var className = 'q-editor-content ct1';
		Wu.app._editorContentPane = Wu.DomUtil.create('content', className, this._container); 

		// menuslider
		Wu.app._menuSlider = Wu.DomUtil.createId('div', 'menuslider', this._container);
		Wu.DomUtil.addClass(Wu.app._menuSlider, 'ct1');
		
	},
	
	render : function () {

		// render sidepanes
		this.Clients 	  = new Wu.SidePane.Clients();
		this.Map 	  = new Wu.SidePane.Map();
		this.Documents 	  = new Wu.SidePane.Documents();
		this.DataLibrary  = new Wu.SidePane.DataLibrary();
		this.MediaLibrary = new Wu.SidePane.MediaLibrary();
		this.Users 	  = new Wu.SidePane.Users();

	},


	setProject : function (project) {

		// update content
		this.Map.updateContent(project);
		this.Documents.updateContent(project);
		this.DataLibrary.updateContent(project);
	},

	refreshProject : function (project) {
		var editMode = project.editMode; // access determined at Wu.Project
		
		// default menus in SidePane
		var panes = ['Clients', 'Map', 'Documents', 'DataLibrary', 'MediaLibrary', 'Users'];	// case-sensitive -> eg. Wu.SidePane.DataLibrary
		
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
			Wu.app.SidePane[elem].disable();
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
	},

	_closePane : function () {				// refactor: move to SidePane.Item ... 
		// noop
	},	

	// open sidepane
	openPane : function () {
		
		// return if already open
		if (this.paneOpen) return;
		this.paneOpen = true;

		// open
		this._container.style.width = '400px';

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