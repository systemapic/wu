Wu.StatusPane = Wu.Class.extend({

	_ : 'statuspane', 

	initialize : function (options) {
		
		// set options
		Wu.setOptions(this, options);

		// init container
		this.initContainer();

		// add hooks
		this.addHooks();

	},

	initContainer : function () {
	},

	addHooks : function () {
	},


	tab : function (e) {
		if (e.keyCode == 9) this.toggle();
	},


	toggle : function () {
		this.isOpen ? this.close() : this.open();
	},

	// open sidepane menu
	open : function (e) {

		this.isOpen = true;
		
		// expand sidepane
		if (app.SidePane) app.SidePane.expand();

		// open left chrome
		app.Chrome.Left.open();

		// events for auto-closing of sidepane. clicking on map/header pane collapses the sidepane
		this._addAutoCloseEvents();
	},

	// close sidepane menu
	close : function (e) {
		
		// trying to stop event from propagating
		if (e) Wu.DomEvent.stop(e);

		this.isOpen = false;

		// collapse sidepane
		if (app.SidePane) app.SidePane.collapse();

		// close left chrome
		app.Chrome.Left.close();


		// removes the blur on map if it's set by one of the fullpanes
		Wu.DomUtil.removeClass(app.MapPane._container, "map-blur");

		// unregister auto-close events
		this._removeAutoCloseEvents();
	},

	_addAutoCloseEvents : function () {

		Wu.DomEvent.on(app.MapPane._container, 'click', this.close, this);

		if (app.StartPane._container) {
			
			Wu.DomEvent.on(app.StartPane._container, 'click', this.close, this);

			// disable "select project" event in startpane
			app.StartPane.disableHooks();
		}
	},

	_removeAutoCloseEvents : function () {

		Wu.DomEvent.off(app.MapPane._container, 'click', this.close, this);

	    	if (app.StartPane._container) {
	    		
	    		//necessary check for the state that follows after having chosen a project
			Wu.DomEvent.off(app.StartPane._container, 'click', this.close, this);

			// enable "select project" event in startpane
			app.StartPane.enableHooks();
		}
	},

	setHeight : function (height) {
		// set height
		this._container.style.height = parseInt(height) + 'px';
	},

	updateContent : function (project) {
		this.project = project;
		this.close();
	},

});
