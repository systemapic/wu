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
		this._menuButton = Wu.DomUtil.create('div', 'chrome-menu-button active', this._container);

		// css experiment
		this._menuButton.innerHTML = '<i class="top-button fa fa-bars"></i>';		

		// Project title container
		this._projectTitleContainer = Wu.DomUtil.create('div', 'chrome-project-title-container', this._container);


		// WRAPPER FOR BUTTONS			// todo: make pluggable
		this._buttonWrapper = Wu.DomUtil.create('div', 'chrome-buttons', this._container);

		// Project title
		// this._projectTitle = Wu.DomUtil.create('div', 'chrome-project-title', this._projectTitleContainer);
		this._projectTitle = Wu.DomUtil.create('div', 'chrome-button chrome-project-title', this._buttonWrapper);

		// Client Logo
		var clientLogo = app.options.logos.clientLogo.image;
		if (clientLogo) {
			this._clientLogo = Wu.DomUtil.create('div', 'chrome-button chrome-client-logo', this._buttonWrapper);
			// this._clientLogo.style.backgroundImage = 'url(' + app.options.servers.portal + clientLogo + ')';
			this._clientLogo.style.backgroundImage = clientLogo;
			this._clientLogo.style.backgroundSize = app.options.logos.clientLogo.size;
			this._clientLogo.style.backgroundPosition = app.options.logos.clientLogo.position;
			this._clientLogo.style.backgroundColor = app.options.logos.clientLogo.backgroundColor;

		}
		
		// set default
		this.initDefault();

	},

	// add button to top chrome
	_registerButton : function (button) {

		// button options
		var className = button.className,
		    trigger = button.trigger,
		    name = button.name,
		    ctx = button.context,
		    project_dependent = button.project_dependent;

		if (project_dependent) className += ' displayNone';

		// buttons holder
		this._buttons = this._buttons || {};

		// create button
		var buttonDiv = Wu.DomUtil.create('div', className);

		// css exp // hacky!
		var referenceNode = app.options.logos.clientLogo.image ? this._buttonWrapper.lastChild.previousSibling : this._buttonWrapper.lastChild;
		this._buttonWrapper.insertBefore(buttonDiv, referenceNode);

		// save
		this._buttons[name] = {
			div : buttonDiv,
			options : button
		}

		// register event
		Wu.DomEvent.on(buttonDiv, 'click', trigger, ctx);

		return buttonDiv;
	},


	_updateButtonVisibility : function () {

		if (app.activeProject) {

			var buttons = _.filter(this._buttons, function (b) {
				return b.options.project_dependent;
			});

			buttons.forEach(function (button) {
				Wu.DomUtil.removeClass(button.div, 'displayNone');
			});

		} else {

			var buttons = _.filter(this._buttons, function (b) {
				return b.options.project_dependent;
			});

			buttons.forEach(function (button) {
				Wu.DomUtil.addClass(button.div, 'displayNone');
			});
		}
	},


	initDefault : function () {

		// this._setUsername();
		this._setPortalLogo();

		// Init CPU clock
		this.initCPUclock(this._container);
	},


	initCPUclock : function (wrapper) {	

		this._CPUwrapper = Wu.DomUtil.create('div', 'cpu-wrapper', wrapper);

		this._CPUbars = [];

		for (var i = 0; i < 10; i++ ) {
			this._CPUbars[i] = Wu.DomUtil.create('div', 'cpu-bar', this._CPUwrapper);
		}

	},


	updateCPUclock : function (percent) {


		// hide if not editor
		var project = app.activeProject;
		if (!project || !project.isEditable()) {
			this._CPUwrapper.style.display = 'none';
		} else {
			this._CPUwrapper.style.display = 'block';
		}


		// Get value as numbers
		var pp = parseInt(percent);

		// Get clean value of number
		var p = Math.round(pp / 10);

		for (var i = 0; i < 10; i++ ) {
			
			// Get the right div
			var no = 9 - i;

			// Set the right classes
			(i >= p) ? Wu.DomUtil.removeClass(this._CPUbars[no], 'cpu-on') : Wu.DomUtil.addClass(this._CPUbars[no], 'cpu-on');
		}
	},

	_setHooks : function (onoff) {

		// Toggle layer menu
		// Wu.DomEvent[onoff](this._layersBtn, 'click', this._toggleLayermenu, this);

		// Toggle left pane
		Wu.DomEvent[onoff](this._menuButton, 'click', this._toggleLeftPane, this);

		// Log out button
		// Wu.DomEvent[onoff](this._userLogout, 'click', this._logOut, this);

	},

	addHooks : function () {
		this._setHooks('on');
	},

	removeHooks : function () {
		this._setHooks('off');
	},

	_projectSelected : function (e) {
		
		// show settings/share buttons
		this._updateButtonVisibility();

		// get project
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

		// // If there are no layers, hide button
		// if (!this._project.store.layermenu || this._project.store.layermenu.length == 0 ) {
		// 	Wu.DomUtil.addClass(this._layersBtn, 'displayNone');
		// } else {
		// 	Wu.DomUtil.removeClass(this._layersBtn, 'displayNone');
		// }

	},

	_setProjectTitle : function () {

		// get client & project names
		this._projectTitleName = this._project.getHeaderTitle();

		// set project title
		this._projectTitle.innerHTML = this._projectTitleName.camelize();
	},

	// _setUsername : function () {
	// 	var username = app.Account.getFullName();
	// 	this._userName.innerHTML = username.toLowerCase();
	// },

	_setPortalLogo : function () {

		// portal logo from config

		// this._clientLogoImg.src = app.options.servers.portal + app.options.logos.portalLogo;
	},

	// default open
	// _leftPaneisOpen : false,

	_toggleLeftPane : function (e) {
		Wu.DomEvent.stop(e);

		this._leftPaneisOpen ? this.closeLeftPane() : this.openLeftPane();
	},

	openLeftPane : function () {

		// close other tabs
		Wu.Mixin.Events.fire('closeMenuTabs');

		this._leftPaneisOpen = true;

		// Set active state of button
		Wu.DomUtil.addClass(this._menuButton, 'active');

		// open left chrome
		app.Chrome.Left.open();

	},

	closeLeftPane : function () {

		// app.Chrome.Left.isOpen = false;
		this._leftPaneisOpen = false;

		// Remove active state of button
		Wu.DomUtil.removeClass(this._menuButton, 'active');

		// close left chrome
		app.Chrome.Left.close();
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

		// Disable the ability to toggle off layer menu when in data library
		if ( app.Tools.DataLibrary._isOpen ) return;

		// Toggle
		this._layerMenuOpen ? this._closeLayerMenu() : this._openLayerMenu();
	},

	_openLayerMenu : function () {

		// use a variable to mark editor as open
		this._layerMenuOpen = true;

		// Add "active" class from button
		// Wu.DomUtil.addClass(this._layersBtn, 'active');

		// TODO: Open Layer Menu
		this.__layerMenu.openLayerPane();
	},

	_closeLayerMenu : function () {

		// mark not open
		this._layerMenuOpen = false;

		// Remove "active" class from button
		// Wu.DomUtil.removeClass(this._layersBtn, 'active');

		// TODO: Close Layer Menu
		this.__layerMenu.closeLayerPane();
	},	

	_onCloseMenuTabs : function () {
		
		// app.Chrome();
		this.closeLeftPane();
	},
	
});