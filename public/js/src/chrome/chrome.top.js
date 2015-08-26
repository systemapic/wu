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

		// USERNAME
		// USERNAME

		// Username
		this._usrName = Wu.DomUtil.create('div', 'top-username', this._usrNameContainer);

		// Divider
		this._usrDivider = Wu.DomUtil.create('div', 'top-divider', this._usrNameContainer, '&nbsp;|&nbsp;');

		// Logout
		this._usrLogout = Wu.DomUtil.create('div', 'top-logout', this._usrNameContainer, 'log out');

		// BUTTONS
		// BUTTONS

		// Layers button
		this._layersBtn = Wu.DomUtil.create('div', 'chrome-button layerbutton', this._buttons);
		
		// Settings button
		this._cartoeditorBtn = Wu.DomUtil.create('div', 'chrome-button cartoeditor', this._buttons);

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
		Wu.DomEvent[onoff](this._cartoeditorBtn, 'click', this._toggleCartoEditor, this);

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


	// SELECT PROJECT
	// SELECT PROJECT
	// SELECT PROJECT

	_projectSelected : function (e) {

		console.log('%c_projectSelected', 'background: red; color: white');

		var projectUuid = e.detail.projectUuid;

		if (!projectUuid) return;

		// set project
		this._project = app.activeProject = app.Projects[projectUuid];
		
		// refresh pane
		this._refresh();
	},

	// REFRESH
	// REFRESH
	// REFRESH

	_refresh : function () {

		this._setProjectTitle();
		// this._setUsername();
		// this._setPortalLogo();
		this._showHideLayerButton();

		// The layer menu
		this.__layerMenu = app.MapPane.getControls().layermenu;
		
		
		// TODO: fikse dette...
		setTimeout(function() {

			// Set active state to Layer menu button if it's open
			if ( this.__layerMenu._open ) this._openLayerMenu();

		}.bind(this), 10);

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
		this._clientName = app.Chrome.Top._project.getClient().name;
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


	// TOGGLE LEFT PANE
	// TOGGLE LEFT PANE
	// TOGGLE LEFT PANE

	_toggleLeftPane : function () {

		this._leftPaneisOpen ? this.closeLeftPane() : this.openLeftPane();

	},

	openLeftPane : function () {

		// xoxoxox

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

	



	// TOGGLE LAYER MENU
	// TOGGLE LAYER MENU
	// TOGGLE LAYER MENU

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

	// CARTO EDITOR
	// CARTO EDITOR
	// CARTO EDITOR

	_toggleCartoEditor : function () {
		// if this is true ?         then do this        :        if not, this
		this._cartoEditorOpen ? this._closeCartoEditor() : this._openCartoEditor();
	},

	_openCartoEditor : function () {

		// use a variable to mark editor as open
		this._cartoEditorOpen = true;

		// Add "active" class from button
		Wu.DomUtil.addClass(this._cartoeditorBtn, 'active');

		// trigger fn in right chrome to open it
		app.Chrome.Right.open();
	},

	_closeCartoEditor : function () {		

		// mark not open
		this._cartoEditorOpen = false;

		// Remove "active" class from button
		Wu.DomUtil.removeClass(this._cartoeditorBtn, 'active');

		// close right chrome
		app.Chrome.Right.close();
	},






});