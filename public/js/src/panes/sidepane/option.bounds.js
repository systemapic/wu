Wu.SidePane.Options.Bounds = Wu.SidePane.Options.Item.extend({
	_ : 'sidepane.options.bounds', 

	type : 'bounds',


	getPanes : function () {
		this._container 		= Wu.DomUtil.get('editor-map-bounds-wrap');
		this._outer 	        	= Wu.DomUtil.get('editor-map-bounds-coordinates');
		this._inner 	        	= Wu.DomUtil.get('map-bounds-inner');
		this.panes.clear 		= Wu.DomUtil.get('editor-map-bounds-clear');
		this.panes.bounds             	= Wu.DomUtil.get('editor-map-bounds');
		this.panes.boundsNELatValue   	= Wu.DomUtil.get('editor-map-bounds-NE-lat-value');
		this.panes.boundsNELngValue   	= Wu.DomUtil.get('editor-map-bounds-NE-lng-value');
		this.panes.boundsSWLatValue   	= Wu.DomUtil.get('editor-map-bounds-SW-lat-value');
		this.panes.boundsSWLngValue   	= Wu.DomUtil.get('editor-map-bounds-SW-lng-value');
		this.panes.boundsNE		= Wu.DomUtil.get('editor-map-bounds-NE');
		this.panes.boundsSW		= Wu.DomUtil.get('editor-map-bounds-SW');
		this.panes.minZoom 		= Wu.DomUtil.get('editor-map-bounds-min-zoom-value');
		this.panes.maxZoom 		= Wu.DomUtil.get('editor-map-bounds-max-zoom-value'); 
		this.panes.setMinZoom           = Wu.DomUtil.get('editor-map-bounds-set-minZoom'); 
		this.panes.setMaxZoom           = Wu.DomUtil.get('editor-map-bounds-set-maxZoom'); 
		this.toggled            	= false;

		// add tooltip
		var h4 = this._container.getElementsByTagName('h4')[0];
		// app.Tooltip.add(this._container, 'Decides the bounding area and the min/max zoom of the map. If a user moves outside of the bounding area, the map will "bounce" back to fit within the given bounding coordinates.');
		app.Tooltip.add(h4, 'Decides the bounding area and the min/max zoom of the map. If a user moves outside of the bounding area, the map will "bounce" back to fit within the given bounding coordinates.');

	},

	addHooks : function () {

		// call addHooks on prototype
		Wu.SidePane.Options.Item.prototype.addHooks.call(this)

		// cxxxxxxxx

		// add events
		Wu.DomEvent.on( this.panes.bounds,   'click', this.setBounds,   this ); // GA
		Wu.DomEvent.on( this.panes.clear,    'click', this.clearBounds, this ); // GA
		Wu.DomEvent.on( this.panes.boundsNE, 'click', this.setBoundsNE, this ); // GA
		Wu.DomEvent.on( this.panes.boundsSW, 'click', this.setBoundsSW, this ); // GA

		Wu.DomEvent.on( this.panes.setMinZoom, 'click', this.setMinZoom, this ); // GA
		Wu.DomEvent.on( this.panes.setMaxZoom, 'click', this.setMaxZoom, this ); // GA

		Wu.DomEvent.on( this.panes.bounds,   'mousedown',  this.buttonDown,  this );
		Wu.DomEvent.on( this.panes.bounds,   'mouseup',    this.buttonUp,    this );
		Wu.DomEvent.on( this.panes.bounds,   'mouseleave', this.buttonUp,    this );


		Wu.DomEvent.on(this.panes.clear 	   , 'mousedown', Wu.DomEvent.stopPropagation, this );
		Wu.DomEvent.on(this.panes.bounds           , 'mousedown', Wu.DomEvent.stopPropagation, this );
		Wu.DomEvent.on(this.panes.boundsNELatValue , 'mousedown', Wu.DomEvent.stopPropagation, this );
		Wu.DomEvent.on(this.panes.boundsNELngValue , 'mousedown', Wu.DomEvent.stopPropagation, this );
		Wu.DomEvent.on(this.panes.boundsSWLatValue , 'mousedown', Wu.DomEvent.stopPropagation, this );
		Wu.DomEvent.on(this.panes.boundsSWLngValue , 'mousedown', Wu.DomEvent.stopPropagation, this );
		Wu.DomEvent.on(this.panes.boundsNE	   , 'mousedown', Wu.DomEvent.stopPropagation, this );
		Wu.DomEvent.on(this.panes.boundsSW	   , 'mousedown', Wu.DomEvent.stopPropagation, this );
		Wu.DomEvent.on(this.panes.minZoom 	   , 'mousedown', Wu.DomEvent.stopPropagation, this );
		Wu.DomEvent.on(this.panes.maxZoom 	   , 'mousedown', Wu.DomEvent.stopPropagation, this );
		Wu.DomEvent.on(this.panes.setMinZoom       , 'mousedown', Wu.DomEvent.stopPropagation, this );
		Wu.DomEvent.on(this.panes.setMaxZoom       , 'mousedown', Wu.DomEvent.stopPropagation, this );
		
	},

	removeHooks : function () {
		// todo!!!
	},


	open : function () {
		this.calculateHeight();
		this._outer.style.height = this.maxHeight + 20 + 'px';       
		this._open(); // local fns   
		this._isOpen = true;

		if (app._pendingClose && app._pendingClose != this) {
			app._pendingClose.close();
		}
		app._pendingClose = this;
		//when bounds is open the sidepane should not collapse by clicking on map/headerpane
		app.StatusPane._removeAutoCloseEvents();
	},


	close : function () {   				// perhaps todo: now it's closing every pane, cause addHooks been run 6 times.
		// console.log('close ', this.type);		// set this to app._pendingclose here for just one close... 
		this.calculateHeight();
		this._outer.style.height = this.minHeight + 'px';        
		this._close();
		this._isOpen = false;
		app._pendingClose = false;
		if (app._timerOpen) clearTimeout(app._timerOpen);
		app.StatusPane._addAutoCloseEvents();
	},

	
	setBounds : function (e) {
		
		// get actual Project object
		var project = app.activeProject;

		// if no active project, do nothing
		if (!project) return; 

		// get map bounds and zoom
		var bounds = Wu.app._map.getBounds();
		var zoom   = Wu.app._map.getZoom();

		// write directly to Project
		project.setBounds({				// refactor:  project.setBounds()
			northEast : {
				lat : bounds._northEast.lat,
				lng : bounds._northEast.lng
			},

			southWest : {
				lat : bounds._southWest.lat,
				lng : bounds._southWest.lng
			},
			minZoom : zoom,
			maxZoom : 18
		});
		
		// call update on view
		this.update();

		// enforce new bounds
		this.enforceBounds();


		// Google Analytics event tracking
		app.Analytics.setGaEvent(['Side Pane', 'Options > Bounds: set bounds']);

	},

	setMinZoom : function () {
		var map = app._map;
		var minZoom = map.getZoom();
		var bounds = this.project.getBounds();
		bounds.minZoom = minZoom;

		// set bounds to project
		this.project.setBounds(bounds);
		
		// update view
		this.update();

		// Google Analytics event tracking
		app.Analytics.setGaEvent(['Side Pane', 'Options > Bounds: set min zoom']);

	},

	setMaxZoom : function () {
		var map = app._map;
		var maxZoom = map.getZoom();
		var bounds = this.project.getBounds();
		bounds.maxZoom = parseInt(maxZoom);

		// set bounds to project
		this.project.setBounds(bounds);
		
		// update view
		this.update();

		// Google Analytics event tracking
		app.Analytics.setGaEvent(['Side Pane', 'Options > Bounds: set max zoom']);

	},

	enforceBounds : function () {
		
		var project = app.activeProject;
		var map     = app._map;

		// get values
		var bounds = project.getBounds();

		if (bounds) {
			var southWest   = L.latLng(bounds.southWest.lat, bounds.southWest.lng);
	   		var northEast 	= L.latLng(bounds.northEast.lat, bounds.northEast.lng);
	    		var maxBounds 	= L.latLngBounds(southWest, northEast);
			var minZoom 	= bounds.minZoom;
			var maxZoom 	= bounds.maxZoom;

	    		if (bounds == this._nullBounds) {
	    			map.setMaxBounds(false);
	    		} else {
	    			map.setMaxBounds(maxBounds);
	    		}
			

			// set zoom
			map.options.minZoom = minZoom;
			map.options.maxZoom = maxZoom;	
		}
		

		map.invalidateSize();

	},


	_nullBounds : {				
		northEast : {
			lat : '90',
			lng : '180'
		},

		southWest : {
			lat : '-90',
			lng : '-180'
		},
		minZoom : '1',
		maxZoom : '20'
	},

	clearBounds : function () {
		
		// get actual Project object
		var project = Wu.app.activeProject;
		var map = Wu.app._map;

		// set bounds to project
		project.setBounds(this._nullBounds);

		// call update on view
		this.update();

		// enforce
		this.enforceBounds();

		// no bounds
		map.setMaxBounds(false);

		// Google Analytics event tracking
		app.Analytics.setGaEvent(['Side Pane', 'Options > Bounds: clear bounds']);

	},

	setBoundsSW : function (e) {

		// get actual Project object
		var project = Wu.app.activeProject;
		var map = Wu.app._map;

		// if no active project, do nothing
		if (!project) return; 

		var bounds = map.getBounds();
		var zoom = map.getZoom();

		// set bounds to project
		project.setBoundsSW({
			lat : bounds._southWest.lat,
			lng : bounds._southWest.lng
		});

		// set zoom to project
		project.setBoundsZoomMin(zoom);

		// call update on view
		this.update();

		// update map
		map.setMaxBounds(bounds);

		// Google Analytics event tracking
		app.Analytics.setGaEvent(['Side Pane', 'Options > Bounds: set SW bounds']);


	},

	setBoundsNE : function (e) {

		// get actual Project object
		var project = app.activeProject;

		// if no active project, do nothing
		if (!project) return; 

		var bounds = app._map.getBounds();

		// set bounds to project
		project.setBoundsNE({ 			
			lat : bounds._northEast.lat,
			lng : bounds._northEast.lng
		});

		// update view
		this.update();

		// Google Analytics event tracking
		app.Analytics.setGaEvent(['Side Pane', 'Options > Bounds: set NE bounds']);

	},

	toggleDropdown : function (e) {
		if ( !this.toggled ) {
			this.toggled = true;
			this.open();                           
		} else {
			this.toggled = false;
			this.close();                                         
		}
	},


	update : function () {

		// call update on prototype
		Wu.SidePane.Options.Item.prototype.update.call(this)

		// bounds
		var bounds = this.project.getBounds();
		if (bounds) {
			this.panes.boundsNELatValue.value = bounds.northEast.lat;
			this.panes.boundsNELngValue.value = bounds.northEast.lng;
			this.panes.boundsSWLatValue.value = bounds.southWest.lat;
			this.panes.boundsSWLngValue.value = bounds.southWest.lng;
			this.panes.maxZoom.value 	  = bounds.maxZoom;
			this.panes.minZoom.value 	  = bounds.minZoom;
		};

		this.enforceBounds();
	},

	save : function () {
		var that = this;

		// clear timer
		if (this.saveTimer) clearTimeout(this.saveTimer);

		// save on timeout
		this.saveTimer = setTimeout(function () {
			that.project._update('bounds');
		}, 1000);       // don't save more than every goddamed second

	},


});

