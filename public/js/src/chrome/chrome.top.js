Wu.Chrome.Top = Wu.Chrome.extend({

	_ : 'topchrome', 

	_initialize : function (options) {

		console.log('top chrome init', this);

		// init container
		this.initContainer();

		// add hooks
		this.addHooks();
	},

	initContainer : function () {

		// container to hold errything
		this._container = Wu.DomUtil.create('div', 'chrome chrome-container chrome-top', app._appPane);

		// Menu Button
		this._menuBtn = Wu.DomUtil.create('div', 'chrome-menu-button', this._container);		

		// Portal Logo
		this._portalLogo = Wu.DomUtil.create('div', 'chrome-portal-logo', this._container);
		this._portalLogoImg = Wu.DomUtil.create('img', '', this._portalLogo);

		// Project title
		this._projectTitleContainer = Wu.DomUtil.create('div', 'chrome-project-title', this._container);

		// WRAPPER FOR BUTTONS			// todo: make pluggable
		this._buttons = Wu.DomUtil.create('div', 'chrome-buttons', this._container);

		// User name button container
		this._usrNameContainer = Wu.DomUtil.create('div', 'username-container', this._buttons);

		// Username
		this._usrName = Wu.DomUtil.create('div', 'top-username', this._usrNameContainer);

		// Divider
		this._usrDivider = Wu.DomUtil.create('div', 'top-divider', this._usrNameContainer, '&nbsp;|&nbsp;');

		// Logout
		this._usrLogout = Wu.DomUtil.create('div', 'top-logout', this._usrNameContainer, 'log out');

		// Layers button
		this._layersBtn = Wu.DomUtil.create('div', 'chrome-button layerbutton displayNone', this._buttons);
		
		// Settings button
		this._settingsButton = Wu.DomUtil.create('div', 'chrome-button cartoeditor displayNone', this._buttons);

		this.initDefault();

	},


	initDefault : function () {

		this._setUsername();
		this._setPortalLogo();

	},



	// HOOKS
	// HOOKS
	// HOOKS

	_setHooks : function (onoff) {

		// click event on carto editor button
		Wu.DomEvent[onoff](this._settingsButton, 'click', this._toggleSettingsPane, this);

		// Toggle layer menu
		Wu.DomEvent[onoff](this._layersBtn, 'click', this._toggleLayermenu, this);

		// Toggle left pane
		Wu.DomEvent[onoff](this._menuBtn, 'click', this._toggleLeftPane, this);

		// Log out button
		Wu.DomEvent[onoff](this._usrLogout, 'click', this._logOut, this);

	},

	addHooks : function () {
		this._setHooks('on');
	},

	removeHooks : function () {
		this._setHooks('off');
	},

	_projectSelected : function (e) {

		console.log('%c_projectSelected', 'background: red; color: white');

		var projectUuid = e.detail.projectUuid;

		if (!projectUuid) return;

		// set project
		this._project = app.activeProject = app.Projects[projectUuid];
		
		// refresh pane
		this._refresh();
	},

	_refresh : function () {

		console.log('%cREFRESH!', 'background: green; color: white;');

		this._setProjectTitle();
		// this._setUsername();
		// this._setPortalLogo();
		this._showHideLayerButton();

		// The layer menu
		this.__layerMenu = app.MapPane.getControls().layermenu;
		
		// Show settings button if user has access to it...
		if ( this.hasSettingsAccess() ) Wu.DomUtil.removeClass(this._settingsButton, 'displayNone');

		// TODO: fikse dette...
		setTimeout(function() {

			// Set active state to Layer menu button if it's open
			if ( this.__layerMenu._open ) this._openLayerMenu();

		}.bind(this), 50);

	},

	// TODO: Knut har sikkert en fiffig funksjon for dett, men...
	hasSettingsAccess : function () {

		var uuid = app.Account.store.uuid;
		var portalRoleMembers = app.Access.store.portalRole.members;
		var superRoleMembers = app.Access.store.superRole.members;

		var hasSettingsAccess = false;

		for ( var i = 0; i < portalRoleMembers.length; i++ ) {
			if ( portalRoleMembers[i] == uuid ) hasSettingsAccess = true;
		}

		for ( var i = 0; i < superRoleMembers.length; i++ ) {
			if ( superRoleMembers[i] == uuid ) hasSettingsAccess = true;
		}

		return hasSettingsAccess;

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

		// TODO: Bedre måte å finne client name på?
		this._clientName = this._project.getClient().getName();
		this._projectTitle = this._project.getHeaderTitle();

		this._projectTitleContainer.innerHTML = this._clientName.toLowerCase() + '&nbsp;:&nbsp;' + this._projectTitle.toLowerCase();
	},

	_setUsername : function () {

		var username = app.Account.getFullName();
		this._usrName.innerHTML = username.toLowerCase();

	},

	_setPortalLogo : function () {

		this._portalLogoImg.src = 'https://dev2.systemapic.com/css/images/globesar-web-logo.png';
		// this._portalLogoImg = Wu.DomUtil.create('img', '', this._portalLogo);
		// this._portalLogoImg.src = 'https://dev2.systemapic.com/css/images/globesar-web-logo.png';
		
	},


	_toggleLeftPane : function () {

		this._leftPaneisOpen ? this.closeLeftPane() : this.openLeftPane();

	},

	openLeftPane : function () {

		// app.Chrome.Left.isOpen = true;
		this._leftPaneisOpen = true;

		// Set active state of button
		Wu.DomUtil.addClass(this._menuBtn, 'active');

		// expand sidepane
		if (app.SidePane) app.SidePane.expand();

		// check 	TODO: remove... (Var tilpasset legend på bunn. Ikke aktuelt lenger.)		
		this.setContentHeights();

		// trigger activation on active menu item
		app._activeMenu._activate();

	},


	closeLeftPane : function () {

		// app.Chrome.Left.isOpen = false;
		this._leftPaneisOpen = false;

		// Remove active state of button
		Wu.DomUtil.removeClass(this._menuBtn, 'active');


		// collapse sidepane
		if (app.SidePane) app.SidePane.collapse();

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

	_toggleSettingsPane : function () {
		// if this is true ?         then do this        :        if not, this
		this._settingsPaneOpen ? this._closeRightChrome() : this._openRightChrome();
	},

	_openRightChrome : function () {

		// use a variable to mark editor as open
		this._settingsPaneOpen = true;

		// Add "active" class from button
		Wu.DomUtil.addClass(this._settingsButton, 'active');

		// trigger fn in right chrome to open it
		app.Chrome.Right.open();
	},

	_closeRightChrome : function () {		

		// mark not open
		this._settingsPaneOpen = false;

		// Remove "active" class from button
		Wu.DomUtil.removeClass(this._settingsButton, 'active');

		// close right chrome
		app.Chrome.Right.close();
	},


});