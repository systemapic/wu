Wu.Chrome.Top = Wu.Chrome.extend({

	_ : 'topchrome', 

	_initialize : function (options) {

		// init container
		this.initContainer();

		// add hooks
		this.addHooks();
	},

	initContainer : function () {


		// container to hold errything
		this._container = Wu.DomUtil.create('div', 'chrome chrome-container chrome-top', app._appPane);

		// Menu Button
		this._menuButton = Wu.DomUtil.create('div', 'chrome-menu-button', this._container);		

		// Portal Logo
		this._portalLogo = Wu.DomUtil.create('div', 'chrome-portal-logo', this._container);
		this._portalLogoImg = Wu.DomUtil.create('img', '', this._portalLogo);

		// Project title
		this._projectTitleContainer = Wu.DomUtil.create('div', 'chrome-project-title', this._container);

		// WRAPPER FOR BUTTONS			// todo: make pluggable
		this._buttonWrapper = Wu.DomUtil.create('div', 'chrome-buttons', this._container);

		// User name button container
		this._userNameContainer = Wu.DomUtil.create('div', 'username-container', this._buttonWrapper);

		// Username
		this._userName = Wu.DomUtil.create('div', 'top-username', this._userNameContainer);

		// Divider
		this._userDivider = Wu.DomUtil.create('div', 'top-divider', this._userNameContainer, '&nbsp;|&nbsp;');




		// Logout
		this._userLogout = Wu.DomUtil.create('div', 'top-logout', this._userNameContainer, 'log out');

		// Layers button
		this._layersBtn = Wu.DomUtil.create('div', 'chrome-button layerbutton displayNone', this._buttonWrapper);
	

		// set default
		this.initDefault();

	},

	// add button to top chrome
	_registerButton : function (button) {

		// button options
		var className = button.className,
		    trigger = button.trigger,
		    name = button.name,
		    ctx = button.context;

		// buttons holder
		this._buttons = this._buttons || {};

		// create button
		var buttonDiv = this._buttons[name] = Wu.DomUtil.create('div', className, this._buttonWrapper);

		// register event
		Wu.DomEvent.on(buttonDiv, 'click', trigger, ctx);

		return buttonDiv;
	},


	initDefault : function () {

		this._setUsername();
		this._setPortalLogo();

		// Init CPU clock
		this.initCPUclock(this._buttonWrapper);
	},


	initCPUclock : function (wrapper) {	

		// Check if superadmin
		var isSuperAdmin = app.Access.is.superAdmin();
		if ( !isSuperAdmin ) return;

		var CPUwrapper = Wu.DomUtil.create('div', 'cpu-wrapper', wrapper);

		this._CPUbars = [];

		for ( i = 0; i<10; i++ ) {
			this._CPUbars[i] = Wu.DomUtil.create('div', 'cpu-bar', CPUwrapper);
		}

	},


	updateCPUclock : function (percent) {

		// Return if not super admin...
		var isSuperAdmin = app.Access.is.superAdmin();
		if ( !isSuperAdmin ) return;		

		// Get value as numbers
		var pp = parseInt(percent);

		// Get clean value of number
		var p = Math.round(pp / 10);

		for ( i = 0; i<10; i++ ) {
			
			// Get the right div
			var no = 9 - i;

			// Set the right classes
			if ( i >= p ) 	Wu.DomUtil.removeClass(this._CPUbars[no], 'cpu-on');
			else		Wu.DomUtil.addClass(this._CPUbars[no], 'cpu-on');
		}


	},



	// HOOKS
	// HOOKS
	// HOOKS

	_setHooks : function (onoff) {

		// click event on carto editor button
		// Wu.DomEvent[onoff](this._settingsButton, 'click', this._toggleSettingsPane, this);

		// Wu.DomEvent[onoff](this._dataButton, 'click', this._toggleDataLibPane, this);

		// Toggle layer menu
		Wu.DomEvent[onoff](this._layersBtn, 'click', this._toggleLayermenu, this);

		// Toggle left pane
		Wu.DomEvent[onoff](this._menuButton, 'click', this._toggleLeftPane, this);

		// Log out button
		Wu.DomEvent[onoff](this._userLogout, 'click', this._logOut, this);

	},

	addHooks : function () {
		this._setHooks('on');
	},

	removeHooks : function () {
		this._setHooks('off');
	},

	_projectSelected : function (e) {

		var projectUuid = e.detail.projectUuid;

		if (!projectUuid) return;

		// set project
		this._project = app.activeProject = app.Projects[projectUuid];
		
		// refresh pane
		this._refresh();
	},

	_refresh : function () {

		this._setProjectTitle();
		this._showHideLayerButton();

		// The layer menu
		this.__layerMenu = app.MapPane.getControls().layermenu;
		

		// TODO: fikse dette...
		setTimeout(function() {

			// Set active state to Layer menu button if it's open
			if ( this.__layerMenu._open ) this._openLayerMenu();

		}.bind(this), 50);

	},

	
	_showHideLayerButton : function () {

		// If there are no layers, hide button
		if (!this._project.store.layermenu || this._project.store.layermenu.length == 0 ) {
			Wu.DomUtil.addClass(this._layersBtn, 'displayNone');
		} else {
			Wu.DomUtil.removeClass(this._layersBtn, 'displayNone');
		}

	},

	_setProjectTitle : function () {

		// get client & project names
		this._clientName = this._project.getClient().getName();
		this._projectTitle = this._project.getHeaderTitle();

		// set project title
		this._projectTitleContainer.innerHTML = this._clientName.toLowerCase() + '&nbsp;:&nbsp;' + this._projectTitle.toLowerCase();
	},

	_setUsername : function () {
		var username = app.Account.getFullName();
		this._userName.innerHTML = username.toLowerCase();
	},

	_setPortalLogo : function () {

		// portal logo from config
		this._portalLogoImg.src = app.options.servers.portal + app.options.logos.portalLogo;
	},


	_toggleLeftPane : function (e) {
		Wu.DomEvent.stop(e);

		this._leftPaneisOpen ? this.closeLeftPane() : this.openLeftPane();
	},

	openLeftPane : function () {

		// app.Chrome.Left.isOpen = true;
		this._leftPaneisOpen = true;

		// Set active state of button
		Wu.DomUtil.addClass(this._menuButton, 'active');

		// expand sidepane
		if (app.SidePane) app.SidePane.expand();

		// check 	TODO: remove... (Var tilpasset legend på bunn. Ikke aktuelt lenger.)		
		this.setContentHeights();

		// trigger activation on active menu item
		app._activeMenu._activate();

		// auto-close triggers
		this._addAutoCloseTriggers();

	},


	closeLeftPane : function () {

		// app.Chrome.Left.isOpen = false;
		this._leftPaneisOpen = false;

		// Remove active state of button
		Wu.DomUtil.removeClass(this._menuButton, 'active');

		// collapse sidepane
		if (app.SidePane) app.SidePane.collapse();

		// auto-close triggers
		this._removeAutoCloseTriggers();

	},

	// close menu when clicking on map, header, etc.
	_addAutoCloseTriggers : function () {

		// map pane
		Wu.DomEvent.on(app.MapPane._container, 'click', this.closeLeftPane, this);
		
		// chrome top
		Wu.DomEvent.on(this._container, 'click', this.closeLeftPane, this);
	},

	_removeAutoCloseTriggers : function () {

		// map pane
		Wu.DomEvent.off(app.MapPane._container, 'click', this.closeLeftPane, this);
		
		// chrome top
		Wu.DomEvent.on(this._container, 'click', this.closeLeftPane, this);
	},

	setContentHeights : function () {

		var clientsPane = app.SidePane.Clients;
		var optionsPane = app.SidePane.Options;

		if (clientsPane) clientsPane.setContentHeight();
		if (optionsPane) optionsPane.setContentHeight();
	},


	_toggleLayermenu : function () {

		this._layerMenuOpen ? this._closeLayerMenu() : this._openLayerMenu();
	},

	_openLayerMenu : function () {

		// use a variable to mark editor as open
		this._layerMenuOpen = true;

		// Add "active" class from button
		Wu.DomUtil.addClass(this._layersBtn, 'active');

		
		// TODO: Open Layer Menu
		this.__layerMenu.openLayerPane();
	},

	_closeLayerMenu : function () {

		// mark not open
		this._layerMenuOpen = false;

		// Remove "active" class from button
		Wu.DomUtil.removeClass(this._layersBtn, 'active');

		// TODO: Close Layer Menu
		this.__layerMenu.closeLayerPane();


	},	

	_logOut : function () {
		if (confirm('Are you sure you want to log out?')) {
			window.location.href = app.options.servers.portal + 'logout';
		}
	},


});