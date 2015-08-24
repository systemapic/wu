Wu.SidePane = Wu.Pane.extend({

	_ : 'sidepane', 

	_allPanes : [
		'Clients', 
		'Options', 
		'Documents', 
		'DataLibrary', 
		'Users', 
		'Share', 
		'Account'
	],

	_initialize : function (options) {
		this.options = options || app.options;

		// panes
		this._panes = [];

	},
	
	_initContainer: function () {

		// create container
		var className = 'q-editor-container';
		this._container = Wu.DomUtil.create('div', className, Wu.app._appPane);
		
		// toggle panes button
		this.paneOpen = false; // default
		this.whichPaneOpen = 'projects';

		// Mobile option ~ Back button when entering documents/datalibrary/users fullscreen
		if (app.mobile) this._initMobileContainer();

		// menu pane
		var className = 'q-editor-menu';
		Wu.app._editorMenuPane = Wu.DomUtil.create('menu', className, this._container); 

		// content pane
		var className = 'q-editor-content hide-menu displayNone';
		app._editorContentPane = Wu.DomUtil.create('content', className, this._container); 

		// menuslider
		app._menuSlider = Wu.DomUtil.createId('div', 'menuslider', Wu.app._editorMenuPane);
		app._menuSliderArrow = Wu.DomUtil.createId('div', 'menuslider-arrow', Wu.app._menuSlider);	// refactor app

		// init content
		this.render();    
	},

	_refresh : function () {
		this.refreshMenu();
	},

	_initMobileContainer : function () {
		this._mobileFullScreenCloser = Wu.DomUtil.create('div', 'q-editor-fullscreen-mobile-close displayNone', this._container);
		Wu.DomEvent.on(this._mobileFullScreenCloser, 'mousedown', this.closeMobileFullscreen, this);
	},

	closeMobileFullscreen : function () {
		if (app.SidePane.fullscreen) {
			Wu.app._editorMenuPane.style.opacity = 1; // .q-editor-content
			Wu.DomUtil.addClass(app.SidePane._mobileFullScreenCloser, 'displayNone'); // Hide back button
			Wu.DomUtil.removeClass(app._mapPane, "map-blur"); // remove map blurring
			Wu.DomUtil.removeClass(Wu.app._active, 'show'); // Hide current active fullpane
			app.SidePane.fullscreen = false;
		}
	},

	render : function () {
		var pane = this.options.panes;

		// render sidepanes
		if (pane.clients) 	this.Clients 	  = new Wu.SidePane.Clients();
		if (pane.options) 	this.Options 	  = new Wu.SidePane.Options();		// Options
		if (pane.documents) 	this.Documents 	  = new Wu.SidePane.Documents();
		if (pane.dataLibrary) 	this.DataLibrary  = new Wu.SidePane.DataLibrary();
		if (pane.mediaLibrary) 	this.MediaLibrary = new Wu.SidePane.MediaLibrary();
		if (pane.users) 	this.Users 	  = new Wu.SidePane.Users();
		if (pane.share) 	this.Share 	  = new Wu.SidePane.Share();
		if (pane.account) 	this.Account 	  = new Wu.SidePane.Account();

		this.refreshMenu();
	},

	calculateHeight : function () {

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

		// deactivte submenus
		this._deactivate();
	},


	// call _deactivate on all items
	_deactivate : function () {
		if (this.Clients) 	this.Clients._deactivate();
		if (this.Options) 	this.Options._deactivate();
		if (this.Documents) 	this.Documents._deactivate();
		if (this.DataLibrary) 	this.DataLibrary._deactivate();
		if (this.MediaLibrary) 	this.MediaLibrary._deactivate();
		if (this.Users) 	this.Users._deactivate();
		if (this.Share) 	this.Share._deactivate();
		if (this.Account) 	this.Account._deactivate();
	},


	expand : function () {

		// set height of menu
		this._setMenuHeight();

		// open
		this.openPane();
	},


	_setMenuHeight : function () {
		var bheight = app.mobile ? 50 : 70;
		var height = this.paneOpen ? this._panes.length * bheight : 0;
		app._editorMenuPane.style.height = parseInt(height) + 'px';
	},

	// setProject : function (project) {
	// 	console.error('setProject FIXME!');
	// 	// update content
	// 	if (this.Home) 		this.Home.updateContent(project);
	// 	if (this.Options)	this.Options.updateContent(project);
	// 	if (this.Documents) 	this.Documents.updateContent(project);
	// 	if (this.DataLibrary) 	this.DataLibrary.updateContent(project);
	// },

	refreshMenu : function () {
		
		// set correct state
		this._updatePanes();

		// render update
		this._renderPanes();
	},

	_renderPanes : function () {

		// get currently active panes
		var active = _.filter(this._allPanes, function (pane) {
			var p = this[pane];
			return p && p._enabled;
		}, this);

		// return if same 	
		if (_.isEqual(active, this._panes)) return this._setMenuHeight();

		// disable all
		_.each(this._allPanes, function (pane) {
			if (this[pane]) this[pane].disable();
		}, this);

		// enable panes
		_.each(this._panes, function (pane) {
			if (this[pane]) this[pane].enable();
		}, this);

		this._setMenuHeight();
	},

	_defaultPanes : function () {

		// if no active project,
		var panes = ['Clients'];

		// add users if admin
		if (app.access.to.edit_project(false, app.Account)) panes.push('Users');
		
		// add logout
		panes.push('Account');
		
		// set, return
		this._panes = panes;
		return this._panes;
	},


	// set this._panes to current state
	_updatePanes : function () {
		var project = app.activeProject;

		// if no project, return defaults only
		if (!project) return this._defaultPanes();

		var panes = [],
		    pane = this.options.panes,
		    settings = project.getSettings(),
		    user = app.Account,
		    canEdit = app.access.to.edit_project(project, user),
		    canManage = app.access.to.edit_user(project, user);

		if (pane.clients) 					panes.push('Clients');
		if (pane.options 	&& canEdit) 			panes.push('Options'); 
		if (pane.documents   	&& settings.documentsPane) 	panes.push('Documents');
		if (pane.dataLibrary 	&& settings.dataLibrary) 	panes.push('DataLibrary');
		if (pane.MediaLibrary 	&& settings.mediaLibrary) 	panes.push('MediaLibrary');
		if (pane.users 		&& canManage) 			panes.push('Users');
		if (pane.share 		&& settings.socialSharing) 	panes.push('Share');
		if (pane.account) 					panes.push('Account');

		// set, return
		this._panes = panes;
		return this._panes;
	},


	// _refresh : function () {
	// 	this.refreshMenu();
	// },
	

	// close sidepane
	closePane : function () {

		// return if already closed
		if (!this.paneOpen) return;

		this.paneOpen = false;

		// slide close
		this._setMenuHeight();

		// Close menu container
		Wu.DomUtil.addClass(app._editorContentPane, 'hide-menu');

		// Make map clickable behind...
		// setTimeout(function(){
		Wu.DomUtil.addClass(app._editorContentPane, 'displayNone');	
		// }, 50)

		// refresh leaflet
		this._refreshLeaflet();

		// todo: what if panes not there?
		Wu.DomUtil.removeClass(app.SidePane.Documents._content, 'show'); 	// refactorrr
		Wu.DomUtil.removeClass(app.SidePane.DataLibrary._content, 'show');
		Wu.DomUtil.removeClass(app.SidePane.Users._content, 'show');
	},


	// open sidepane
	openPane : function () {

		// return if already open
		if (this.paneOpen) return;

		this.paneOpen = true;

		// slide open
		this._setMenuHeight();

		// open
		Wu.DomUtil.addClass(app._active, 'show');
		Wu.DomUtil.removeClass(app._editorContentPane, 'displayNone');

		// Have to set a micro timeout, so that it doesn't mess with the displayNone class above
		// setTimeout(function() {
		Wu.DomUtil.removeClass(app._editorContentPane, 'hide-menu');
		// }, 50)

		// refresh leaflet
		this._refreshLeaflet();

		if (app.mobile) this.openOnMobile();
	},


	// By Jørgen ~ Do not open full screen panes
	openOnMobile : function () {
		if (app._activeMenuItem == 'documents' || app._activeMenuItem == 'dataLibrary' || app._activeMenuItem == 'users') {
			app.SidePane.Clients.activate();	
		}
	},
	
	widenContainer : function () {
		this._container.style.width = '100%';
	},

	_refreshLeaflet : function () {
		setTimeout(function() {
			var map = Wu.app._map;
			if (map) map.reframe();
		}, 300); // time with css
	},
});