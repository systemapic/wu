Wu.SidePane.Options.Position = Wu.SidePane.Options.Item.extend({
	_ : 'sidepane.options.position', 

	type : 'position',

	getPanes : function () {
		this._container 		= Wu.DomUtil.get('editor-map-position-wrap');
		this._outer       	       	= Wu.DomUtil.get('editor-map-initpos-coordinates');
		this._inner 	  	       	= Wu.DomUtil.get('map-initpos-inner');
		this.panes.initPos             	= Wu.DomUtil.get('editor-map-initpos-button');
		this.panes.initPosLatValue     	= Wu.DomUtil.get('editor-map-initpos-lat-value');
		this.panes.initPosLngValue     	= Wu.DomUtil.get('editor-map-initpos-lng-value');
		this.panes.initPosZoomValue    	= Wu.DomUtil.get('editor-map-initpos-zoom-value');
		this.toggled 	               	= false;

		// add tooltip
		var h4 = this._container.getElementsByTagName('h4')[0];
		app.Tooltip.add(h4, 'Sets the starting position of the map.');

	},

	addHooks : function () {

		// call addHooks on prototype
		Wu.SidePane.Options.Item.prototype.addHooks.call(this)

		// add events
		Wu.DomEvent.on( this.panes.initPos,  'click', 		this.setPosition, this );
		Wu.DomEvent.on( this.panes.initPos,  'mousedown',      	this.buttonDown,  this );
		Wu.DomEvent.on( this.panes.initPos,  'mouseup',        	this.buttonUp,    this );
		Wu.DomEvent.on( this.panes.initPos,  'mouseleave',     	this.buttonUp,    this );

		Wu.DomEvent.on( this.panes.initPos         , 'mousedown', Wu.DomEvent.stopPropagation, this );
		Wu.DomEvent.on( this.panes.initPosLatValue , 'mousedown', Wu.DomEvent.stopPropagation, this );
		Wu.DomEvent.on( this.panes.initPosLngValue , 'mousedown', Wu.DomEvent.stopPropagation, this );
		Wu.DomEvent.on( this.panes.initPosZoomValue, 'mousedown', Wu.DomEvent.stopPropagation, this );

	},

	removeHooks : function () {
		// todo!!!
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

	setPosition : function (e) {

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

		// generate project thumb (if it hasn't been manually set before)
		var thumbCreated = project.getThumbCreated();
		if ( !thumbCreated ) project.createProjectThumb();

		// call update on view
		this.update();

		// Google Analytics event tracking
		app.Analytics.ga(['Side Pane', 'Options > Position: set position']);
	},


	update : function () {
		// call update on prototype
		Wu.SidePane.Options.Item.prototype.update.call(this)

		// update values
		var position = this.project.getLatLngZoom();
		
		this.panes.initPosLatValue.value  = position.lat;
		this.panes.initPosLngValue.value  = position.lng;
		this.panes.initPosZoomValue.value = position.zoom;
	},

	save : function () {
		var that = this;

		// clear timer
		if (this.saveTimer) clearTimeout(this.saveTimer);

		// save on timeout
		this.saveTimer = setTimeout(function () {
			that.project._update('position');
		}, 1000);       // don't save more than every goddamed second

	},

});
