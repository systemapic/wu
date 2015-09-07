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

		// disable input boxes
		this.panes.initPosLatValue.setAttribute('disabled', 'disabled');
		this.panes.initPosLngValue.setAttribute('disabled', 'disabled');
		this.panes.initPosZoomValue.setAttribute('disabled', 'disabled');

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

		Wu.DomEvent.on( this.panes.initPos         , 'mousedown click', Wu.DomEvent.stop, this );
		Wu.DomEvent.on( this.panes.initPosLatValue , 'mousedown click', Wu.DomEvent.stop, this );
		Wu.DomEvent.on( this.panes.initPosLngValue , 'mousedown click', Wu.DomEvent.stop, this );
		Wu.DomEvent.on( this.panes.initPosZoomValue, 'mousedown click', Wu.DomEvent.stop, this );

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

	// this fn is run when pane is opened
	open : function () {
		this.calculateHeight();
		this._outer.style.height = this.maxHeight + 20 + 'px';       
		this._open(); // local fns   
		this._isOpen = true;

		if (app._pendingClose && app._pendingClose != this) {
			app._pendingClose.close();
		}
		app._pendingClose = this;
		//when position is open the sidepane should not collapse by clicking on map/headerpane
		app.StatusPane._removeAutoCloseEvents();

	},

	// this fn is run when pane is closed
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
		// var thumbCreated = project.getThumbCreated();
		// if (!thumbCreated) project.createProjectThumb();

		// call update on view
		this.update();

		// Google Analytics event tracking
		app.Analytics.setGaEvent(['Side Pane', 'Options > Position: set position']);
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
