Wu.StatusPane = Wu.Class.extend({
	_ : 'statuspane', 

	initialize : function (options) {
		
		// set options
		Wu.setOptions(this, options);

		// init container
		this.initContainer();

		// add hooks
		this.addHooks();

		// this.__gaEvents();

	},

	initContainer : function () {

		// create div
		var container 	= this._container 	= Wu.DomUtil.create('div', 'home-container');
		var logo 	= this._logo 		= Wu.DomUtil.create('div', 'home-logo', container);
		var statusWrap 	= this._statusWrap 	= Wu.DomUtil.create('div', 'home-status-wrap', container);
		var status 				= Wu.DomUtil.create('div', 'home-status', statusWrap);
		var statusInner 			= Wu.DomUtil.create('div', 'home-status-inner', status);

		// set default status
		this.clearStatus();

		// add to sidepane if assigned container in options
		if (this.options.addTo) this.addTo(this.options.addTo);

		// add tooltip
		app.Tooltip.add(this._container, 'This is the main menu. Here you can change projects, view documents, download files, etc.', { extends : 'systyle', tipJoint : 'bottom right' });

	},

	addHooks : function () {
		// open sidepane menu on mousedown
		Wu.DomEvent.on(this._container, 'mousedown', this.toggle, this);

		// global TAB key toggle
		// Wu.DomEvent.on(document, 'keydown', this.tab, this);	// todo: fix tabbing in inputs
	},


	tab : function (e) {
		if (e.keyCode == 9) this.toggle();
	},

	toggle : function () {
		this.isOpen ? this.close() : this.open();
	
		// div cleanups to do when hitting home
		this.cleaningJobs();
	},

	cleaningJobs: function () {

		// make sure layermenu edit is disabled
		var layerMenu = Wu.app.MapPane.layerMenu;
		if (layerMenu) layerMenu.disableEdit();

		// close all open options
		app.SidePane.Map.closeAll();
	},

	// open sidepane menu
	open : function (e) {

		this.isOpen = true;
		if (app.SidePane) app.SidePane.expand();
		this.refresh();

		this.checkMapBlur();
		this.setContentHeights();

		// remove help pseudo
		Wu.DomUtil.removeClass(app._mapPane, 'click-to-start');

		// trigger activation on active menu item
		app._activeMenu._activate();

		// Hide button section and Layer info when the Home dropdown menu opens (j)
		if (app._map) app._map._controlCorners.topleft.style.opacity = 0;


		app.MapPane.descriptionControl;

		// close layermenu edit if open  				// refactor all these events.. centralize
		var layermenu = app.MapPane.layerMenu;
		if (layermenu) layermenu.disableEdit();


		// Mobile option
		if (Wu.app.mobile) {

			// Check if there is a map pane there...
			if ( app.MapPane ) {
			
				// Close the Layer Menu control
				if ( app.MapPane.layerMenu ) {
					app.MapPane.layerMenu.closeLayerPane();
					app.MapPane.layerMenu._openLayers.style.opacity = 0;
				}

				// Close the Legends control
				if ( app.MapPane.legendsControl ) {
					if ( app.MapPane.legendsControl._isOpen ) app.MapPane.legendsControl.MobileCloseLegends();
					app.MapPane.legendsControl._legendsOpener.style.opacity = 0;
				}

				// Close the description control
				if ( app.MapPane.descriptionControl ) {
					if ( !app.MapPane.descriptionControl._isClosed ) app.MapPane.descriptionControl.mobileClosePane();
				}
			}
		}



	},

	// close sidepane menu
	close : function (e) {

		this.isOpen = false;

		// collapse sidepane
		if (app.SidePane) app.SidePane.collapse();
		this.refresh();

		// app.MapPane._container
		Wu.DomUtil.removeClass(app.MapPane._container, "map-blur") // (j) – removes the blur on map if it's set by one of the fullpanes

		// Show button section and Layer info when the Home dropdown menu opens (j)
		if (app._map) {
			app._map._controlCorners.topleft.style.opacity = 1;
			app._map._controlCorners.topleft.style.display = 'block';
		}



		// Mobile option : activate default sidepane on close to avoid opening in fullscreen
		if (Wu.app.mobile) {
			if ( app.MapPane ) {
				
				if ( app.MapPane.layerMenu ) app.MapPane.layerMenu._openLayers.style.opacity = 1;
				if ( app.MapPane.legendsControl ) app.MapPane.legendsControl._legendsOpener.style.opacity = 1;
				if ( app.MapPane.descriptionControl ) app.MapPane.descriptionControl._button.style.opacity = 1;
				
				// Make sure we reset if we're in fullscreen mode (media library, users, etc)
				if ( app.SidePane.fullscreen ) app.SidePane.Clients.activate();	
			}

			// Show the controllers (has been hidden when a new project is refreshed in projects.js > refresh() )
			app._map._controlContainer.style.opacity = 1;
		}


		// Only open the description box if there is anything inside of it
		if ( app.MapPane.descriptionControl.activeLayer ) {
			if ( app.MapPane.descriptionControl.activeLayer.store.description == '' || !app.MapPane.descriptionControl.activeLayer.store.description ) {
				app.MapPane.descriptionControl.hide();
			}
		} else {
			// If no layers has been activated
			app.MapPane.descriptionControl.hide();	
		}

	},

	setContentHeights : function () {

		var clientsPane = app.SidePane.Clients;
		var optionsPane = app.SidePane.Map;

		if (clientsPane) clientsPane.setContentHeight();
		if (optionsPane) optionsPane.setContentHeight();
	},

	checkMapBlur : function () {

		if ( 	app._activeMenuItem == 'documents' || 
			app._activeMenuItem == 'dataLibrary' || 
			app._activeMenuItem == 'users' ) 
		{
			Wu.DomUtil.addClass(app.MapPane._container, "map-blur");
		}

	},

	addTo : function (wrapper, before) {
		// insert first in wrapper
		if (before) {
			wrapper.insertBefore(this._container, wrapper.firstChild);
		} else {
			wrapper.appendChild(this._container);
		}
	},

	setHeight : function (height) {
		// set height
		this._container.style.height = parseInt(height) + 'px';
	},

	refresh : function () {

		if (!this.project) return;
		// set height to project headerHeight
		var headerHeight = this.project.getHeaderHeight();
		this.setHeight(headerHeight);
	},

	updateContent : function (project) {

		this.project = project;

		// refresh height
		this.refresh();

		// collapse errything to just logo
		this.close();
	},

	setStatus : function (message, timer) {
		var that = this;

		// clear last clearTimer
		if (this.clearTimer) clearTimeout(this.clearTimer);

		// create div
		var status 	= Wu.DomUtil.create('div', 'home-status');
		var statusInner = Wu.DomUtil.create('div', 'home-status-inner', status);

		
		// set message
		statusInner.innerHTML = message;
		
		// push onto dom
		this.pushStatus(status);

		// clearTimer
		this.clearTimer = setTimeout(function () {
			that.clearStatus();
		}, timer || 3000);
	
	},

	// set 3000ms save status
	setSaveStatus : function (delay) {
		this.setStatus('Saved!', delay);
	},

	pushStatus : function (div) {

		// get old status div, insertBefore
		var old = this._statusWrap.firstChild;
		this._statusWrap.insertBefore(div, old);
		
		// wait 50ms for div to enter DOM
		setTimeout(function () {

			// add in class
			Wu.DomUtil.addClass(div, 'status-in');

			// after css effects done (250ms);
			setTimeout(function () {
				// remove old
				Wu.DomUtil.remove(old);
			}, 250);
		}, 50);
	},

	clearStatus : function () {
		// set default string
		var portalName = app.getPortalName();
		
		// do nothing if same
		if (portalName == this.getStatus()) return;

		// set status
		this.setStatus(portalName);
	},

	getStatus : function () {
		return this._statusWrap.firstChild.firstChild.innerHTML;
	},


});
