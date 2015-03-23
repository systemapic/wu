Wu.SidePane.Options.Controls = Wu.SidePane.Options.Item.extend({
	_ : 'sidepane.options.controls', 

	type : 'controls',


	getPanes : function () {
		this._container 			= Wu.DomUtil.get('editor-map-controls-wrap');
		this._outer 				= Wu.DomUtil.get('editor-map-controls-inner-wrap');

		this.panes.controlZoom                 	= Wu.DomUtil.get('map-controls-zoom').parentNode.parentNode;
		this.panes.controlDraw                 	= Wu.DomUtil.get('map-controls-draw').parentNode.parentNode;
		this.panes.controlInspect              	= Wu.DomUtil.get('map-controls-inspect').parentNode.parentNode;
		this.panes.controlDescription          	= Wu.DomUtil.get('map-controls-description').parentNode.parentNode;
		this.panes.controlLayermenu            	= Wu.DomUtil.get('map-controls-layermenu').parentNode.parentNode;
		this.panes.controlLegends              	= Wu.DomUtil.get('map-controls-legends').parentNode.parentNode;
		this.panes.controlMeasure              	= Wu.DomUtil.get('map-controls-measure').parentNode.parentNode;
		this.panes.controlGeolocation          	= Wu.DomUtil.get('map-controls-geolocation').parentNode.parentNode;
		this.panes.controlMouseposition        	= Wu.DomUtil.get('map-controls-mouseposition').parentNode.parentNode;
		this.panes.controlBaselayertoggle      	= Wu.DomUtil.get('map-controls-baselayertoggle').parentNode.parentNode;
		this.panes.controlCartocss 		= Wu.DomUtil.get('map-controls-cartocss').parentNode.parentNode;

		// add tooltips
		this._addTooltips();
	},


	_addTooltips : function () {

		// add tooltip
		var h4 = this._container.getElementsByTagName('h4')[0]; // refactor 
		app.Tooltip.add(h4, 'Enables the control options that goes on top of the map.');

		// Add tooltip for each option
		app.Tooltip.add(this.panes.controlZoom, 'Enables zooming on the map. Puts [+] and [-] buttons on the map.');
		app.Tooltip.add(this.panes.controlDraw, 'Enables drawing on the map.');
		app.Tooltip.add(this.panes.controlInspect, 'The layer inspector enables users to change the order or selected layers, to isolate layers, and to zoom to layer bounds.');
		app.Tooltip.add(this.panes.controlDescription, 'Enables layer description boxes.');
		app.Tooltip.add(this.panes.controlLayermenu, 'Enables the layer menu.');
		app.Tooltip.add(this.panes.controlLegends, 'Enable layer legends.');
		app.Tooltip.add(this.panes.controlMeasure, 'Enables scaling tool on the map.');
		app.Tooltip.add(this.panes.controlGeolocation, 'Enables users to search for address or locations in the world.');
		app.Tooltip.add(this.panes.controlMouseposition, 'Shows the geolocation of mouse pointer.');
		app.Tooltip.add(this.panes.controlBaselayertoggle, 'Enables toggelig base layers on and off.');
		app.Tooltip.add(this.panes.controlCartocss, 'Enables the CartoCSS editor, the tooltip styler, and auto generated layer legends.');
	},

	addHooks : function () {

		// call addHooks on prototype
		Wu.SidePane.Options.Item.prototype.addHooks.call(this)

		// add events
		Wu.DomEvent.on( this.panes.controlZoom,            'mousedown click', this.toggleControl, this);
		Wu.DomEvent.on( this.panes.controlDraw,            'mousedown click', this.toggleControl, this);
		Wu.DomEvent.on( this.panes.controlInspect,         'mousedown click', this.toggleControl, this);
		Wu.DomEvent.on( this.panes.controlDescription,     'mousedown click', this.toggleControl, this);
		Wu.DomEvent.on( this.panes.controlLayermenu,       'mousedown click', this.toggleControl, this);
		Wu.DomEvent.on( this.panes.controlLegends,         'mousedown click', this.toggleControl, this);
		Wu.DomEvent.on( this.panes.controlMeasure,         'mousedown click', this.toggleControl, this);
		Wu.DomEvent.on( this.panes.controlGeolocation,     'mousedown click', this.toggleControl, this);
		Wu.DomEvent.on( this.panes.controlMouseposition,   'mousedown click', this.toggleControl, this);
		Wu.DomEvent.on( this.panes.controlBaselayertoggle, 'mousedown click', this.toggleControl, this);
		Wu.DomEvent.on( this.panes.controlCartocss, 	   'mousedown click', this.toggleControl, this);

	},

	removeHooks : function () {
		// todo!!!
	},

	calculateHeight : function () {
		var project = app.activeProject,
		    controls = project.getControls(),
		    x = _.size(controls);

		this.maxHeight = x * 30 + 30;
		this.minHeight = 0;
	},

	toggleControl : function (e) {
		
		// prevent default checkbox behaviour
		if (e.type == 'click') return Wu.DomEvent.stop(e);
	
		// stop anyway
		Wu.DomEvent.stop(e);

		// get type (zoom, draw, etc.)
		var item = e.target.getAttribute('which');

		// get checkbox
		var target = Wu.DomUtil.get('map-controls-' + item);

		// do action (eg. toggleControlDraw);
		var on      = !target.checked;
		var enable  = 'enable' + item.camelize();
		var disable = 'disable' + item.camelize();
		var mapPane = app.MapPane;

		var control = app.MapPane.getControls()[item];


		this.project.store.controls[item] = on;	// todo
		this.project._update('controls');

		// toggle
		if (on) {
		
			control._on();

			// enable control on map
			// mapPane[enable]();

			// enable control in menu
			this.enableControl(item);
		} else {

			control._off(); // todo: remove if
			
			// disable control on map
			// mapPane[disable]();
			
			// disable control in menu
			this.disableControl(item);
		}

		// save changes to project
		

		// update controls css
		mapPane.updateControlCss();

		// Google Analytics event tracking
		app.Analytics.ga(['Side Pane', 'Options > Controls toggle: ' + item]);
	},


	disableControl : function (type) {

		// get vars
		var target = Wu.DomUtil.get('map-controls-' + type); // checkbox
		var parent = Wu.DomUtil.get('map-controls-title-' + type).parentNode; // div that gets .active 
		var map    = Wu.app._map;  // map

		// toggle check and active class
		Wu.DomUtil.removeClass(parent, 'active');
		target.checked = false;
	},

	enableControl : function (type) {
		
		// get vars
		var target = Wu.DomUtil.get('map-controls-' + type); // checkbox
		var parent = Wu.DomUtil.get('map-controls-title-' + type).parentNode; // div that gets .active 
		var map    = Wu.app._map;  // map

		// toggle check and active class
		Wu.DomUtil.addClass(parent, 'active');
		target.checked = true;
	},

	// mark switched on or off
	_refreshControls : function () {
		var project = app.activeProject,
		    controls = project.getControls();

		_.each(controls, function (value, key) {
			value ? this.enableControl(key) : this.disableControl(key);
		}, this);
	},

	update : function () {
		// call update on prototype
		Wu.SidePane.Options.Item.prototype.update.call(this)

		// mark active controls
		this._refreshControls();
	},

});