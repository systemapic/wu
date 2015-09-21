Wu.Chrome.SettingsContent.Mapsettings = Wu.Chrome.SettingsContent.extend({

	_initialize : function () {

		// init container
		this._initContainer();

		// add events
		this._addEvents();
	},

	_initContainer : function () {

		// create container
		this._container = Wu.DomUtil.create('div', 'chrome chrome-content chrome-pane mapsettings', this.options.appendTo);
	},

	_initLayout : function () {

		if (!this._project) return;

		// Scroller
		this._midSection = Wu.DomUtil.create('div', 'chrome-middle-section', this._container);
		this._midOuterScroller = Wu.DomUtil.create('div', 'chrome-middle-section-outer-scroller', this._midSection);		
		this._midInnerScroller = Wu.DomUtil.create('div', 'chrome-middle-section-inner-scroller', this._midOuterScroller);		

		this._fieldsWrapper = Wu.DomUtil.create('div', 'chrome-field-wrapper', this._midInnerScroller);
		this.initSettings('Controls');

		this.initBoundPos('Bounds & Position');

		// mark as inited
		this._inited = true;		
	},

	// UNIVERSALS
	// UNIVERSALS
	// UNIVERSALS		

	_refresh : function () {

		this._flush();
		this._initLayout();
	},

	_flush : function () {

		this._container.innerHTML = '';
	},
	
	show : function () {

		if (!this._inited) this._initLayout();

		// hide others
		this.hideAll();

		// show this
		this._container.style.display = 'block';

		// mark button
		Wu.DomUtil.addClass(this.options.trigger, 'active-tab');
	},

	open : function () {
		console.log('open!', this);
	},	


	// CREATE STUFF
	// CREATE STUFF
	// CREATE STUFF		

	// Creates section with meta field lines
	initSettings : function (title) {


		var sectionWrapper = Wu.DomUtil.create('div', 'chrome-content-section-wrapper', this._fieldsWrapper)
		var header = Wu.DomUtil.create('div', 'chrome-content title', sectionWrapper, title);

		var options = {

			zoom : {
				enable : true,
				name   : 'Zoom'
			},
			draw : {
				enable : true,
				name   : 'Draw'
			},
			description : {
				enable : true,
				name   : 'Description/legend'
			},
			measure : {
				enable : true,
				name   : 'Measure'		
			},
			mouseposition : {
				enable : true,
				name   : 'Mouse position'
			},
			geolocation : {
				enable : true,
				name   : 'Geo search'				
			},

			// Inactive
			layermenu : {
				enable : false,
				name   : 'Layer menu'
			},
			legends : {
				enable : false,
				name   : 'Legend'
			},
			baselayertoggle : {
				enable : false,
				name   : 'Base layer toggle'
			},
			cartocss : {
				enable : false,
				name   : 'CartoCSS'
			},

		}


		// Get control
		var project = app.activeProject;


		for ( var key in options ) {
			
			var enable  = options[key].enable;			

			if ( enable ) {

				var title = options[key].name;

				var lineOptions = {
					key 		: key, 
					wrapper 	: sectionWrapper,
					input 		: false,
					title 		: title,
					isOn 		: project.store.controls[key],
					rightPos	: false,
					type 		: 'switch'
					
				}

				this._createMetaFieldLine(lineOptions);
			}
		}
	},

	initBoundPos : function (title) {

		var sectionWrapper = Wu.DomUtil.create('div', 'chrome-content-section-wrapper', this._fieldsWrapper)
		var header = Wu.DomUtil.create('div', 'chrome-content title', sectionWrapper, title);

		var isBoundsSet = this.isBoundsSet();

		var lineOptions = {
			key 		: 'bounds', 
			wrapper 	: sectionWrapper,
			input 		: false,
			title 		: 'Bounds',			
			isOn 		: isBoundsSet,
			rightPos	: false,
			type 		: 'setClear',
		}

		this._createMetaFieldLine(lineOptions);

		var lineOptions = {
			key 		: 'position', 
			wrapper 	: sectionWrapper,
			input 		: false,
			title 		: 'Position',			
			isOn 		: false,
			rightPos	: false,
			type 		: 'set',
		}

		this._createMetaFieldLine(lineOptions);

	},


	isBoundsSet : function () {

		var bounds = app.activeProject.getBounds();

		// If no bounds
		if ( !bounds ) return false;

		var maxZoom      = bounds.maxZoom;
		var minZoom      = bounds.minZoom;
		var northEastLat = bounds.northEast.lat;
		var northEastLng = bounds.northEast.lng;
		var southWestLat = bounds.southWest.lat;
		var southWestLng = bounds.southWest.lng;

		// If bounds sat to view everything (clear)
		if ( maxZoom      == 20 &&
		     minZoom      == 1 &&
		     northEastLat == 90 &&
		     northEastLng == 180 &&
		     southWestLat == -90 &&
		     southWestLng == -180
		) return false;

		// Bounds are set
		return true;

	},

	// SAVERS 
	// SAVERS
	// SAVERS

	_saveToServer : function (item, title, on) {

		// Get control
		var control = app.MapPane.getControls()[item];

		if (!control) return console.error('no control!', item, title, on);

		// Save
		var project = app.activeProject;
		    project.store.controls[item] = on;
		    project._update('controls');

		// toggle on map
		on ? control._on() : control._off();

	},


	saveSetClear : function (key, on) {
		if ( key == 'bounds' ) on ? this.setBounds() : this.clearBounds();
	},

	saveSet : function (key) {
		if ( key == 'position' ) this.setPosition();
	},


	// SET POSITION
	// SET POSITION
	// SET POSITION		

	setPosition : function () {

		// get actual Project object
		var project = app.activeProject;

		// if no active project, do nothing
		if (!project) return; 

		// get center and zoom
		var center = Wu.app._map.getCenter();
		var zoom   = Wu.app._map.getZoom();

		// set position 
		var position = {
			lat  : center.lat,
			lng  : center.lng,
			zoom : zoom
		}

		// save to project
		project.setPosition(position);
	},		



	// SET/ CLEAR BOUNDS
	// SET/ CLEAR BOUNDS
	// SET/ CLEAR BOUNDS		

	setBounds : function (e) {
		
		// get actual Project object
		var project = app.activeProject;

		// if no active project, do nothing
		if (!project) return; 

		// get map bounds and zoom
		var bounds = Wu.app._map.getBounds();
		var zoom   = Wu.app._map.getZoom();

		// write directly to Project
		project.setBounds({
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
		
		// enforce new bounds
		this.enforceBounds();
	},

	clearBounds : function () {
		
		// get actual Project object
		var project = Wu.app.activeProject;
		var map = Wu.app._map;

		var nullBounds = {
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
		}

		// set bounds to project
		project.setBounds(nullBounds);

		// enforce
		this.enforceBounds();

		// no bounds
		map.setMaxBounds(false);
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
});
