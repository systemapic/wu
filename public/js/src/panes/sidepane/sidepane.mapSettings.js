Wu.SidePane.Map.MapSetting = Wu.SidePane.Map.extend({
	_ : 'sidepane.map.mapsetting',


	type : 'mapSetting',


	initialize : function (container) {

		this.panes = {};

		// get panes
		this.mapsettingsContainer = Wu.DomUtil.get('mapsettings-container');
		this.getPanes();

		// init layout
		this.initLayout(container);
		
		// add hooks
		this.addHooks();

	},


	buttonDown : function (e) {
		Wu.DomUtil.addClass(e.target, 'btn-info');
	},

	buttonUp : function (e) {
		Wu.DomUtil.removeClass(e.target, 'btn-info');
	},

	update : function () {
		// set active project
		this.project = Wu.app.activeProject;

	},

	addHooks : function () {
		// Wu.DomEvent.on( this.mapsettingsContainer, 'mouseleave', this.close, this);	
		// Wu.DomEvent.on( this._container, 'mousemove', this.pendingOpen, this);
		// Wu.DomEvent.on( this._container, 'mousedown', this.open, this);
		
		Wu.DomEvent.on( this._container, 'mousedown', this.toggleOpen, this);
		
	},

	removeHooks : function () {
		// todo!!!
	},

	calculateHeight : function () {

		this.maxHeight = this._inner.offsetHeight + 15;
		this.minHeight = 0;
	},

	// fn for open on hover.. not in use atm
	pendingOpen : function () {
		if (app._timerOpen) clearTimeout(app._timerOpen);
		if (this._isOpen) return;

		var that = this;
		app._timerOpen = setTimeout(function () {
			that.open();
			if (app._pendingClose) app._pendingClose.close();
			app._pendingClose = that;
		}, 200);	
	},

	toggleOpen : function () {
		this._isOpen ? this.close() : this.open();
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
	},


	close : function () {   				// perhaps todo: now it's closing every pane, cause addHooks been run 6 times.
		// console.log('close ', this.type);		// set this to app._pendingclose here for just one close... 
		this.calculateHeight();
		this._outer.style.height = this.minHeight + 'px';        
		this._close();
		this._isOpen = false;
		app._pendingClose = false;
		if (app._timerOpen) clearTimeout(app._timerOpen);
	},

	_open : function () {
		// noop
		app.SidePane.Map.mapSettings.layermenu.disableEdit();
	}, 

	_close : function () {
		// noop
		
	},

	initLayout : function () {
		// noop
	},

	getPanes : function () {
		// noop
	},

	// sort layers by provider
	sortLayers : function (layers) {
		// possible keys in layer.store.data. must add more here later if other sources
		var keys = ['geojson', 'mapbox'];
		var results = [];
		keys.forEach(function (key) {
			var sort = {
				key : key,
				layers : []
			}
			for (l in layers) {
				var layer = layers[l];
				if (layer.store.data.hasOwnProperty(key)) {
					sort.layers.push(layer)
				}
			}
			results.push(sort);
		}, this);

		this.numberOfProviders = results.length;
		return results;
	},

	addProvider : function (provider) {
		var title = '';
		if (provider == 'geojson') title = 'Data Library';
		if (provider == 'mapbox') title = 'Mapbox';
		var header = Wu.DomUtil.create('div', 'item-list-header', this._outer, title)
	},

	fillLayers : function () {

		this._layers = {};

		// return if no layers
	       	if (_.isEmpty(this.project.layers)) return;
	       	

	       	var sortedLayers = this.sortLayers(this.project.layers);

	       	sortedLayers.forEach(function (provider) {

	       		this.addProvider(provider.key);

	       		provider.layers.forEach(function (layer) {
	       			this.addLayer(layer);
	       		}, this);

	       	}, this);

	       	// calculate height for wrapper
	       	this.calculateHeight();

	},

});



                                    
Wu.SidePane.Map.BaseLayers = Wu.SidePane.Map.MapSetting.extend({
	_ : 'sidepane.map.baselayers', 

	type : 'baseLayers',


	getPanes : function () {
		// map baselayer
		this._container = Wu.DomUtil.get('editor-map-baselayer-wrap');
	},


	initLayout : function () {

		// create title and wrapper (and delete old content)
		this._container.innerHTML = '<h4>Base Layers</h4>';
		var div = Wu.DomUtil.createId('div', 'select-baselayer-wrap', this._container);
		this._outer = Wu.DomUtil.create('div', 'select-elems', div);
		Wu.DomUtil.addClass(div, 'select-wrap');
	},

	
	update : function () {
		Wu.SidePane.Map.MapSetting.prototype.update.call(this)	// call update on prototype

		// options
		this.editMode = false;

		// refresh layout
		this.initLayout();

		// fill in with layers
		this.fillLayers();

		// mark unavailable layers
		this.markOccupied();
		
	},

	removeHooks : function () {
		// todo!!!
	},


	addLayer : function (layer) {

		// create and append div
		var container = Wu.DomUtil.create('div', 'item-list select-elem ct0 baselayer', this._outer);
		var text = Wu.DomUtil.create('div', 'item-list-inner-text', container);
		
		// set title
		text.innerHTML = layer.store.title;

		// set height if short title - hacky..
		if (layer.store.title) { // err if no title
			if (layer.store.title.length < 32) text.style.maxHeight = '12px';
		}
		
		// append range selectors
		var rangeOpacity = Wu.DomUtil.create('input', 'baselayer-range-slider-opacity', container);
		var rangeZindex  = Wu.DomUtil.create('input', 'baselayer-range-slider-zindex', container);

		// todo: z-index, opacity
		var baseLayer = {
			layer : layer,
			container : container, 
			active : false,
			rangeOpacity : rangeOpacity, 
			rangeZindex : rangeZindex
		}

		// set active or not
		this.project.store.baseLayers.forEach(function (b) {
			if (layer.store.uuid == b.uuid) {
				this.on(baseLayer);
			}
		}, this);

		// add toggle hook
		Wu.DomEvent.on( container, 'mousedown', function (e) { 

			// prevent other click events
			Wu.DomEvent.stop(e);

			// toggle layer
			this.toggle(baseLayer);

		}, this );

		this._layers = this._layers || {};
		this._layers[baseLayer.layer.store.uuid] = baseLayer;

		// // // add edit hook
		// Wu.DomEvent.on (button, 'mousedown', function (e) {
		// 	console.log('butttt');
		// 	// prevent other click events
		// 	Wu.DomEvent.stop(e);
		// 	// Wu.DomEvent.stopPropagation(e);

		// 	// toggle editMode
		// 	this.toggleEdit(baseLayer);	// temporarily taken out, cause BETA.. this is opacity edit etc..

		// }, this);

		// add stops
		// Wu.DomEvent.on(button, 'mousedown', Wu.DomEvent.stop, this);

		

	},

	toggleEdit : function (baseLayer) {
		var uuid = baseLayer.layer.store.uuid;
		if (this.editMode[uuid]) {
			this.editOff(baseLayer);
		} else {
			this.editOn(baseLayer);
		}
	},

	setOpacity : function () {
		if (!this.context.rangeOpacity) return;

		// set opacity on layer
		var opacity = parseFloat(this.context.rangeOpacity.element.value / 100);
		this.layer.setOpacity(opacity);

		// save to baseLayer
		var uuid 	  = this.layer.store.uuid;
		var baseLayer 	  = _.find(this.context.project.store.baseLayers, function (base) { return base.uuid == uuid; });
		var project 	  = this.context.project;
		baseLayer.opacity = opacity;
		this.context.save(); // save

	},

	setZIndex : function () {
		if (!this.context.rangeZindex) return;

		var zIndex = parseFloat(this.context.rangeZindex.element.value);
		this.layer.setZIndex(zIndex);

		// save to baseLayer
		var uuid 	  = this.layer.store.uuid;
		var baseLayer 	  = _.find(this.context.project.store.baseLayers, function (base) { return base.uuid == uuid; });
		var project 	  = this.context.project;
		baseLayer.zIndex  = zIndex;
		this.context.save(); // save
	},

	save : function () {
		var that = this;

		// clear timer
		if (this.saveTimer) clearTimeout(this.saveTimer);

		// save on timeout
		this.saveTimer = setTimeout(function () {
			that.project._update('baseLayers');
		}, 1000);       // don't save more than every goddamed second

	},

	editOn : function (baseLayer) {

		// get opacity
		var uuid 	    = baseLayer.layer.store.uuid;
		var storeBaselayer  = _.find(this.project.store.baseLayers, function (b) { return b.uuid == uuid; });
		if (storeBaselayer) {
			var opacity = parseInt(storeBaselayer.opacity * 100);
		} else {
			var opacity = 1;
		}

		// create range slider
		this.rangeOpacity = new Powerange(baseLayer.rangeOpacity, {
			callback      : this.setOpacity,// callback
			decimal       : false,
			disable       : false,
			disableOpacity: 0.5,
			hideRange     : false,
			klass         : 'powerange-opacity',
			min           : 0,
			max           : 100,
			start         : opacity,	// opacity
			step          : null,
			vertical      : false,
			context       : this,		// need to pass context
			layer         : baseLayer.layer	// passing layer
		});

		this.rangeZindex = new Powerange(baseLayer.rangeZindex, {
			callback      : this.setZIndex, 
			decimal       : false,
			disable       : false,
			disableOpacity: 0.5,
			hideRange     : false,
			klass         : 'powerange-zindex',
			min           : 1,
			max           : 10,
			start         : null,
			step          : 1,
			vertical      : false,
			context       : this,
			layer         : baseLayer.layer
		});

		// show range selectah
		baseLayer.container.style.height = '132px';

		// prevent events
		var handle = this.rangeZindex.handle;
		var slider = this.rangeZindex.slider;
		Wu.DomEvent.on(handle, 'mousedown', Wu.DomEvent.stop, this);
		Wu.DomEvent.on(slider, 'mousedown', Wu.DomEvent.stop, this);

		var handle = this.rangeOpacity.handle;
		var slider = this.rangeOpacity.slider;
		Wu.DomEvent.on(handle, 'mousedown', Wu.DomEvent.stop, this);
		Wu.DomEvent.on(slider, 'mousedown', Wu.DomEvent.stop, this);

		// account for extra height with editor
		this.calculateHeight();
		this.open();


		// set editMode
		this.editMode = this.editMode || {};

		this._editsOff();

		var uuid = baseLayer.layer.store.uuid;
		this.editMode[uuid] = baseLayer;


	},

	_editsOff : function () {
		var baseLayers = this.editMode;
		for (b in baseLayers) {
			var baseLayer = baseLayers[b];
			this.editOff(baseLayer);
		}
	},

	editOff : function (baseLayer) {

		// set editMode
		var uuid = baseLayer.layer.store.uuid;
		// delete this.editMode[uui
		// this.editMode = false;

		// hide editor
		baseLayer.container.style.height = '32px';

		// reset events
		var handle = this.rangeZindex.handle;
		var slider = this.rangeZindex.slider;
		Wu.DomEvent.on(handle, 'mousedown', Wu.DomEvent.stop, this);
		Wu.DomEvent.on(slider, 'mousedown', Wu.DomEvent.stop, this);

		// remove range divs
		Wu.DomUtil.remove(this.rangeZindex.slider);
		Wu.DomUtil.remove(this.rangeOpacity.slider);
		Wu.DomUtil.remove(this.rangeZindex.handle);
		Wu.DomUtil.remove(this.rangeOpacity.handle);
		delete this.rangeZindex;
		delete this.rangeOpacity;

		// account for extra height of wrapper with editor
		this.calculateHeight();
		this.open();

	},

	toggle : function (baseLayer) {
		if (baseLayer.active) {
			this.off(baseLayer);
			this.disableLayer(baseLayer);
		} else {
			this.on(baseLayer);
			this.enableLayer(baseLayer);
		}
	},

	on : function (baseLayer) {
		// enable in baseLayer menu
		Wu.DomUtil.addClass(baseLayer.container, 'active');
		baseLayer.active = true;
	},

	off : function (baseLayer) {
		// disable in baseLayer menu
		Wu.DomUtil.removeClass(baseLayer.container, 'active');
		baseLayer.active = false;
	},

	enableLayer : function (baseLayer) {

		// get layer
		var layer = baseLayer.layer;

		// enable layer on map (without controls)
		layer._addTo();

		// add baselayer
		this.project.addBaseLayer({
			uuid : layer.getUuid(),
			zIndex : 1,			// zindex not determined by layer, but by which layers are currently on map
			opacity : layer.getOpacity()
		});
	
		// refresh controls
		this._refreshControls();
	},

	disableLayer : function (baseLayer) {
		if (!baseLayer) return

		// get layer
		var layer = baseLayer.layer;

		// disable layer in map
		if (layer) layer.disable(); 

		// remove from project
		this.project.removeBaseLayer(layer)

		// refresh controls
		this._refreshControls();

	},

	_refreshControls : function () {

		// refresh baselayerToggleControl
		var baselayerToggle = app.MapPane.baselayerToggle;
		if (baselayerToggle) baselayerToggle.update();

		// mark occupied layers in layermenu
		var layermenuSetting = app.SidePane.Map.mapSettings.layermenu;
		layermenuSetting.markOccupied();

		// refresh cartoCssControl
		var cartoCss = app.MapPane.cartoCss;
		if (cartoCss) cartoCss.update()

	},

	calculateHeight : function () {
				
		// Runs only for base layer menu?
		var min = _.size(this.project.getLayermenuLayers());
		var padding = this.numberOfProviders * 35;
		this.maxHeight = (_.size(this.project.layers) - min) * 33 + padding;
		this.minHeight = 0;

		// add 100 if in editMode
		if (this.editMode) this.maxHeight += 100;
	},

	markOccupied : function () {

		// get layers and active baselayers
		var layermenuLayers = this.project.getLayermenuLayers();
		var layers = this.project.getLayers();

		// activate layers
		layers.forEach(function (a) {
			this.activate(a.store.uuid);
		}, this);

		layermenuLayers.forEach(function (bl) {
			var layer = _.find(layers, function (l) { return l.store.uuid == bl.layer; });
			if (layer) this.deactivate(layer.store.uuid);
		}, this);

	},

	activate : function (layerUuid) {
		var layer = this._layers[layerUuid];
		Wu.DomUtil.removeClass(layer.container, 'deactivated');
	},

	deactivate : function (layerUuid) {
		var layer = this._layers[layerUuid];
		Wu.DomUtil.addClass(layer.container, 'deactivated');
	}
});



                             
Wu.SidePane.Map.LayerMenu = Wu.SidePane.Map.MapSetting.extend({
	_ : 'sidepane.map.layermenu', 

	type : 'layerMenu',

	getPanes : function () {
		this._container = Wu.DomUtil.get('editor-map-layermenu-wrap');
	},

	initLayout : function () {

		// create title and wrapper (and delete old content)
		this._container.innerHTML = '<h4>Layer Menu</h4>';		
		this._inner  = Wu.DomUtil.create('div', 'map-layermenu-inner', this._container);
		this._outer  = Wu.DomUtil.create('div', 'map-layermenu-outer', this._inner);
		// var status   = 'Enable layer menu in Controls below.';
		// this._status = Wu.DomUtil.create('div', 'layermenu-status', this._outer, status);

	},

	update : function () {
		Wu.SidePane.Map.MapSetting.prototype.update.call(this)	// call update on prototype

		// get layermenu object
		this.layerMenu = Wu.app.MapPane.layerMenu;

		// options
		this.editMode = false;

		// refresh layout
		this.initLayout();

		// fill in with layers
		this.fillLayers();

		// mark deactivated layers
		this.markOccupied();
		
	},

	// add layers to layermenu list in sidepane
	addLayer : function (layer) {

		// create and append div
		var container = Wu.DomUtil.create('div', 'item-list select-elem ct0', this._outer);

		// create and set title
		var text = Wu.DomUtil.create('div', 'item-list-inner-text', container);
		text.innerHTML = layer.store.title;

		// set height if short title - hacky..
		if (layer.store.title) { // err if no title
			if (layer.store.title.length < 32) text.style.maxHeight = '12px';
		}

		

		// container.innerHTML = layer.store.title;

		// append edit button
		var button = Wu.DomUtil.create('div', 'edit-layermenu-layer', container);

		// append range selectors
		var rangeOpacity = Wu.DomUtil.create('input', 'layermenu-range-slider-opacity', container);
		var rangeZindex  = Wu.DomUtil.create('input', 'layermenu-range-slider-zindex', container);


		// todo: z-index, opacity
		var layermenuLayer = {
			layer 		: layer,
			container 	: container, 
			active 		: false,
			rangeOpacity 	: rangeOpacity, 
			rangeZindex 	: rangeZindex
		}

		// store for reuse
		this._layers[layer.store.uuid] = layermenuLayer;

		// set active or not
		this.project.store.layermenu.forEach(function (b) {			
			if (layer.store.uuid == b.layer) {
				this.on(layermenuLayer);
			}
		}, this);

		// add toggle hook
		Wu.DomEvent.on( container, 'mousedown', function (e) { 

			// prevent other click events
			Wu.DomEvent.stop(e);

			// toggle layer
			this.toggle(layermenuLayer);

		}, this );

		// add edit hook
		Wu.DomEvent.on (button, 'mousedown', function (e) {
			
			// prevent other click events
			Wu.DomEvent.stop(e);

			return;// console.log('edit layer!');

			// toggle editMode
			this.toggleEdit(layermenuLayer);

		}, this);

		

	},

	getLayerByUuid : function (layerUuid) {
		var layer = _.find(this._layers, function (l) {
			// console.log('l: ', l);
			return l.layer.store.uuid == layerUuid;	
		});

		return layer;
	},

	enableLayerByUuid : function (layerUuid) {
		var layer = this.getLayerByUuid(layerUuid);
		if (layer) {
			this.toggle(layer);
			return layer;	
		}

		return false;
		
	},

	calculateHeight : function () {
		var min = _.size(this.project.getBaselayers());
		var padding = this.numberOfProviders * 35;
		this.maxHeight = (_.size(this.project.layers) - min) * 33 + padding;
		this.minHeight = 0;

		// add 100 if in editMode
		if (this.editMode) this.maxHeight += 100;
	},

	enableLayermenu : function () {
		var layerMenu = app.MapPane.enableLayermenu();
		app.SidePane.Map.mapSettings.controls.enableControl('layermenu');
		
		// save changes to project
		this.project.store.controls.layermenu = true;
		this.project._update('controls');
		
		return layerMenu;
	},

	toggle : function (layer) {
		
		// console.log('toggle --> ', layer);

		// ensure layerMenu is active
		this.layerMenu = Wu.app.MapPane.layerMenu;
		// this.layerMenu = this.layerMenu || Wu.app.MapPane.layerMenu;
		if (!this.layerMenu) this.layerMenu = this.enableLayermenu();
		this.layerMenu.enableEdit();
		
		if (layer.active) {
			
			// remove from layermenu
			var uuid = layer.layer.store.uuid;
			this.layerMenu._remove(uuid);

			// set off
			this.off(layer);

		} else {

			// add to layermenu
			this.layerMenu.add(layer.layer);

			// set on
			this.on(layer);
		}

		// mark occupied layers in layermenu
		var baselayerSetting = app.SidePane.Map.mapSettings.baselayer;
		baselayerSetting.markOccupied()

		// refresh cartoCssControl
		var cartoCss = app.MapPane.cartoCss;
		if (cartoCss) cartoCss.update()
	},

	toggleEdit : function (layer) {

	},

	on : function (layermenuLayer) {
		// enable in layermenuLayer menu
		Wu.DomUtil.addClass(layermenuLayer.container, 'active');
		layermenuLayer.active = true;
	},

	off : function (layermenuLayer) {
		// disable in layermenuLayer menu
		Wu.DomUtil.removeClass(layermenuLayer.container, 'active');
		layermenuLayer.active = false;
	},

	// turn off layer initiated on layermenu
	_off : function (layer) {
		var uuid = layer.store.uuid;
		var layermenuItem = this._layers[uuid];
		this.off(layermenuItem);
	},

	// post-open
	_open : function () {
		this.enableEdit();
		clearTimeout(this.closeEditTimer);
	},

	// post-close
	_close : function () {
		this.disableEdit();
		return;
		clearTimeout(this.closeEditTimer);
		var that = this;
		this.closeEditTimer = setTimeout(function() {
			that.disableEdit();
		}, 3000);
	},

	// enable edit mode on layermenu itself
	enableEdit : function () {
		var layerMenu = Wu.app.MapPane.layerMenu;
		if (layerMenu) layerMenu.enableEdit();
	},

	disableEdit : function () {
		var layerMenu = Wu.app.MapPane.layerMenu;
		if (layerMenu) layerMenu.disableEdit();
	},

	markOccupied : function () {

		// get active baselayers
		var baseLayers = this.project.getBaselayers();
		var all = this.project.getLayers();

		all.forEach(function (a) {
			this.activate(a.store.uuid);
		}, this);

		baseLayers.forEach(function (bl) {
			this.deactivate(bl.uuid);
		}, this);

	},

	activate : function (layerUuid) {
		var layer = this._layers[layerUuid];
		if (layer) Wu.DomUtil.removeClass(layer.container, 'deactivated');
	},

	deactivate : function (layerUuid) {
		var layer = this._layers[layerUuid];
		if (layer) Wu.DomUtil.addClass(layer.container, 'deactivated');
	}

});




Wu.SidePane.Map.Position = Wu.SidePane.Map.MapSetting.extend({
	_ : 'sidepane.map.position', 

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
	},

	addHooks : function () {

		// call addHooks on prototype
		Wu.SidePane.Map.MapSetting.prototype.addHooks.call(this)

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
	
		// call update on view
		this.update();

	},


	update : function () {

		// call update on prototype
		Wu.SidePane.Map.MapSetting.prototype.update.call(this)

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



Wu.SidePane.Map.Bounds = Wu.SidePane.Map.MapSetting.extend({
	_ : 'sidepane.map.bounds', 

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
	},

	addHooks : function () {

		// call addHooks on prototype
		Wu.SidePane.Map.MapSetting.prototype.addHooks.call(this)

		// add events
		Wu.DomEvent.on( this.panes.bounds,   'click', this.setBounds,   this );
		Wu.DomEvent.on( this.panes.clear,    'click', this.clearBounds, this );
		Wu.DomEvent.on( this.panes.boundsNE, 'click', this.setBoundsNE, this );
		Wu.DomEvent.on( this.panes.boundsSW, 'click', this.setBoundsSW, this );

		Wu.DomEvent.on( this.panes.setMinZoom, 'click', this.setMinZoom, this );
		Wu.DomEvent.on( this.panes.setMaxZoom, 'click', this.setMaxZoom, this );

		Wu.DomEvent.on( this.panes.bounds,   'mousedown',  this.buttonDown,  this );
		Wu.DomEvent.on( this.panes.bounds,   'mouseup',    this.buttonUp,    this );
		Wu.DomEvent.on( this.panes.bounds,   'mouseleave', this.buttonUp,    this );


		Wu.DomEvent.on(this.panes.clear 	      , 'mousedown', Wu.DomEvent.stopPropagation, this );
		Wu.DomEvent.on(this.panes.bounds           , 'mousedown', Wu.DomEvent.stopPropagation, this );
		Wu.DomEvent.on(this.panes.boundsNELatValue , 'mousedown', Wu.DomEvent.stopPropagation, this );
		Wu.DomEvent.on(this.panes.boundsNELngValue , 'mousedown', Wu.DomEvent.stopPropagation, this );
		Wu.DomEvent.on(this.panes.boundsSWLatValue , 'mousedown', Wu.DomEvent.stopPropagation, this );
		Wu.DomEvent.on(this.panes.boundsSWLngValue , 'mousedown', Wu.DomEvent.stopPropagation, this );
		Wu.DomEvent.on(this.panes.boundsNE	      , 'mousedown', Wu.DomEvent.stopPropagation, this );
		Wu.DomEvent.on(this.panes.boundsSW	      , 'mousedown', Wu.DomEvent.stopPropagation, this );
		Wu.DomEvent.on(this.panes.minZoom 	      , 'mousedown', Wu.DomEvent.stopPropagation, this );
		Wu.DomEvent.on(this.panes.maxZoom 	      , 'mousedown', Wu.DomEvent.stopPropagation, this );
		Wu.DomEvent.on(this.panes.setMinZoom       , 'mousedown', Wu.DomEvent.stopPropagation, this );
		Wu.DomEvent.on(this.panes.setMaxZoom       , 'mousedown', Wu.DomEvent.stopPropagation, this );
		
	},

	removeHooks : function () {
		// todo!!!
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
		Wu.SidePane.Map.MapSetting.prototype.update.call(this)

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





                       
Wu.SidePane.Map.Controls = Wu.SidePane.Map.MapSetting.extend({
	_ : 'sidepane.map.controls', 

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
		// this.panes.controlVectorstyle          	= Wu.DomUtil.get('map-controls-vectorstyle').parentNode.parentNode;
		this.panes.controlMouseposition        	= Wu.DomUtil.get('map-controls-mouseposition').parentNode.parentNode;
		this.panes.controlBaselayertoggle      	= Wu.DomUtil.get('map-controls-baselayertoggle').parentNode.parentNode;
		this.panes.controlCartocss 		= Wu.DomUtil.get('map-controls-cartocss').parentNode.parentNode;
	},

	addHooks : function () {

		// call addHooks on prototype
		Wu.SidePane.Map.MapSetting.prototype.addHooks.call(this)

		// add events
		Wu.DomEvent.on( this.panes.controlZoom,            'mousedown click', this.toggleControl, this);
		Wu.DomEvent.on( this.panes.controlDraw,            'mousedown click', this.toggleControl, this);
		Wu.DomEvent.on( this.panes.controlInspect,         'mousedown click', this.toggleControl, this);
		Wu.DomEvent.on( this.panes.controlDescription,     'mousedown click', this.toggleControl, this);
		Wu.DomEvent.on( this.panes.controlLayermenu,       'mousedown click', this.toggleControl, this);
		Wu.DomEvent.on( this.panes.controlLegends,         'mousedown click', this.toggleControl, this);
		Wu.DomEvent.on( this.panes.controlMeasure,         'mousedown click', this.toggleControl, this);
		Wu.DomEvent.on( this.panes.controlGeolocation,     'mousedown click', this.toggleControl, this);
		// Wu.DomEvent.on( this.panes.controlVectorstyle,     'mousedown click', this.toggleControl, this);
		Wu.DomEvent.on( this.panes.controlMouseposition,   'mousedown click', this.toggleControl, this);
		Wu.DomEvent.on( this.panes.controlBaselayertoggle, 'mousedown click', this.toggleControl, this);
		Wu.DomEvent.on( this.panes.controlCartocss, 	   'mousedown click', this.toggleControl, this);

	},

	removeHooks : function () {
		// todo!!!
	},

	calculateHeight : function () {

		var x = _.size(this.controls);
		this.maxHeight = x * 30 + 30;
		this.minHeight = 0;
	},


	toggleControl : function (e) {
		
		// console.log('toggleControl');
		console.log('e: ', e);
		// prevent default checkbox behaviour
		if (e.type == 'click') return Wu.DomEvent.stop(e);
		
		// stop anyway
		Wu.DomEvent.stop(e);

		// get type (zoom, draw, etc.)
		var item = e.target.getAttribute('which');

		// get checkbox
		console.log('item: ', item);
		var target = Wu.DomUtil.get('map-controls-' + item);

		// do action (eg. toggleControlDraw);
		var on      = !target.checked;
		var enable  = 'enable' + item.camelize();
		var disable = 'disable' + item.camelize();

		var mapPane = app.MapPane;

		// toggle
		if (on) {
			// enable control on map
			mapPane[enable]();

			// enable control in menu
			this.enableControl(item);
		} else {
			// disable control on map
			mapPane[disable]();
			
			// disable control in menu
			this.disableControl(item);
		}

		// save changes to project
		this.project.store.controls[item] = on;	// todo
		this.project._update('controls');

		console.log('upadte controls!!');		

		// update controls css
		mapPane.updateControlCss();

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

	update : function () {

		// call update on prototype
		Wu.SidePane.Map.MapSetting.prototype.update.call(this)

		this.controls = this.project.getControls();

		// tmp hack to remove vectrostyle
		delete this.controls.vectorstyle;		// todo: remove

		// toggle each control
		for (c in this.controls) {
			var on = this.controls[c];
			var enable = 'enable' + c.camelize();
			var disable = 'disable' + c.camelize();
			
			// toggle
			if (on) {	
				// enable control on map
				Wu.app.MapPane[enable]();

				// enable control in menu
				this.enableControl(c);
			} else {	
				// disable control on map
				Wu.app.MapPane[disable]();
				
				// disable control in menu
				this.disableControl(c);
			}
		}
	},

});








Wu.SidePane.Map.Connect = Wu.SidePane.Map.MapSetting.extend({
	_ : 'sidepane.map.connect', 

	type : 'connect',			

	initLayout : function (container) {
		
		// container, header, outer
		this._container	 	= Wu.DomUtil.create('div', 'editor-inner-wrapper editor-map-item-wrap ct12 ct17 ct23', container);
		var h4 			= Wu.DomUtil.create('h4', '', this._container, 'Connected Accounts');
		this._outer 		= Wu.DomUtil.create('div', 'connect-outer', this._container);

		// mapbox connect
		var wrap 	  	= Wu.DomUtil.create('div', 'connect-mapbox', this._outer);
		var h4 		  	= Wu.DomUtil.create('div', 'connect-mapbox-title', wrap, 'Mapbox');
		this._mapboxWrap  	= Wu.DomUtil.create('div', 'mapbox-connect-wrap ct11', this._outer);
		this._mapboxInput 	= Wu.DomUtil.create('input', 'input-box search import-mapbox-layers', this._mapboxWrap);
		this._mapboxConnect 	= Wu.DomUtil.create('div', 'smap-button-gray ct0 ct11 import-mapbox-layers-button', this._mapboxWrap, 'Add');
		this._mapboxAccounts 	= Wu.DomUtil.create('div', 'mapbox-accounts', this._mapboxWrap);
		
		// clear vars n fields
		this.resetInput();

	},

	addHooks : function () {
		Wu.SidePane.Map.MapSetting.prototype.addHooks.call(this)

		// connect mapbox button
		Wu.DomEvent.on( this._mapboxConnect, 'click', this.importMapbox, this );

		// stops
		Wu.DomEvent.on( this._mapboxConnect, 'mousedown', Wu.DomEvent.stop, this );
		Wu.DomEvent.on( this._mapboxInput, 'mousedown', Wu.DomEvent.stopPropagation, this );

	},

	removeHooks : function () {
		// todo!!!
	},	

	calculateHeight : function () {
		var num = this.project.getMapboxAccounts().length;
		this.maxHeight = 100 + num * 30;
		this.minHeight = 0;
	},

	// get mapbox access token
	tokenMode : function () {
		this._username = this._mapboxInput.value;
		this._mapboxInput.value = '';
		this._askedToken = true;
		this._mapboxConnect.innerHTML = 'OK';
		this._mapboxInput.setAttribute('placeholder', 'Enter access token');
	},

	// reset temp vars
	resetInput : function () {
		this._username = null;
		delete this._username;
		this._askedToken = false;
		this._mapboxConnect.innerHTML = 'Add';
		this._mapboxInput.setAttribute('placeholder', 'Mapbox username');
		this._mapboxInput.value = '';
	},

	// on click when adding new mapbox account
	importMapbox : function () {

		if (!this._askedToken) return this.tokenMode();

		// get username
		var username = this._username;
		var accessToken = this._mapboxInput.value;

		// clear
		this.resetInput();

		// get mapbox account via server
		this._importMapbox(username, accessToken);

	},

	_importMapbox : function (username, accessToken) {

		// get mapbox account via server
		var data = {
			'username' : username,
			'accessToken' : accessToken,
			'projectId' : this.project.store.uuid
		}
		// post         path                            json          callback      this
		Wu.post('/api/util/getmapboxaccount', JSON.stringify(data), this.importedMapbox, this);
	},

	importedMapbox : function (that, json) {
		
		// project store
		var result = JSON.parse(json);
		var error = result.error;
		var store = result.project;

		if (error) {
			console.log('There was an error importing mapbox: ', error);
			return;
		}

		that.project.setStore(store);

	},

	fillMapbox : function () {

		// get accounts
		var accounts = this.project.getMapboxAccounts();

		// return if no accounts
		if (!accounts) return;

		// reset
		this._mapboxAccounts.innerHTML = '';
		
		// fill with accounts
		accounts.forEach(function (account) {
			var wrap  = Wu.DomUtil.create('div', 'mapbox-listed-account', this._mapboxAccounts);
			var title = Wu.DomUtil.create('div', 'mapbox-listed-account-title', wrap, account.username.camelize());

			// add kill button for editMode... // todo: what about layers in deleted accounts, etc etc??
			// if (this.project.editMode) {
			// 	var kill = Wu.DomUtil.create('div', 'mapbox-listed-account-kill', wrap, 'X');
				
			// 	// add hook
			// 	Wu.DomEvent.on(kill, 'click', function () {
			// 		this.removeAccount(wrap, account);
			// 	}, this);
			// }

		}, this);
		

	},

	removeAccount : function (div, account) {
		Wu.DomUtil.remove(div);
		this.project.removeMapboxAccount(account);
	},

	update : function () {
		Wu.SidePane.Map.MapSetting.prototype.update.call(this)	// call update on prototype

		// fill in mapbox accounts
		this.fillMapbox();
	},



});


                       
Wu.SidePane.Map.Settings = Wu.SidePane.Map.MapSetting.extend({
	_ : 'sidepane.map.settings', 

	type : 'settings',

	options : {

		// include settings
		screenshot 	: true,
		socialSharing 	: true,
		documentsPane 	: true,
		dataLibrary 	: true,
		mediaLibrary 	: false,
		autoHelp 	: true,
		autoAbout 	: true,
		darkTheme 	: true,
		tooltips 	: true,
		mapboxGL	: false // maybe not as setting ~ I like it.

	},

	initLayout : function (container) {

		// container, header, outer
		this._container	= Wu.DomUtil.create('div', 'editor-inner-wrapper editor-map-item-wrap ct12 ct17 ct23', container);
		var h4 		= Wu.DomUtil.create('h4', '', this._container, 'Settings');
		this._outer 	= Wu.DomUtil.create('div', 'settings-outer', this._container);

	},

	addHooks : function () {
		Wu.SidePane.Map.MapSetting.prototype.addHooks.call(this)

		Wu.DomEvent.on(this._outer, 'mousedown', Wu.DomEvent.stopPropagation, this);

	},

	removeHooks : function () {
		// todo!!!

		Wu.DomEvent.off(this._outer, 'mousedown', Wu.DomEvent.stopPropagation, this);
	},	

	calculateHeight : function () {
		var num = _.filter(this.options, function (o) { return o; }).length;
		this.maxHeight = num * 30;
		this.minHeight = 0;


		// var x = _.size(this.controls);
		// this.maxHeight = x * 30 + 30;
		// this.minHeight = 0;		
	},

	contentLayout : function () {

		// screenshot
		// social media sharing
		// documents pane
		// data library pane
		// add help/about auto-folders to documents
		// dark/light theme

		var wrapper = Wu.DomUtil.create('div', 'settings-wrapper');

		if (this.options.screenshot) {
			var screenshot = this._contentItem('screenshot', 'Screenshots');
			wrapper.appendChild(screenshot);
		}
		if (this.options.socialSharing) {
			var socialSharing = this._contentItem('socialSharing', 'Social Sharing');
			wrapper.appendChild(socialSharing);
		}
		if (this.options.documentsPane) {
			var documentsPane = this._contentItem('documentsPane', 'Documents Pane');
			wrapper.appendChild(documentsPane);
		}
		if (this.options.dataLibrary) {
			var dataLibrary = this._contentItem('dataLibrary', 'Data Library');
			wrapper.appendChild(dataLibrary);
		}
		if (this.options.mediaLibrary) {
			var mediaLibrary = this._contentItem('mediaLibrary', 'Media Library');
			wrapper.appendChild(mediaLibrary);
		}
		if (this.options.autoHelp) {
			var autoHelp = this._contentItem('autoHelp', 'Add Help');
			wrapper.appendChild(autoHelp);
		}
		if (this.options.autoAbout) {
			var autoAbout = this._contentItem('autoAbout', 'Add About');
			wrapper.appendChild(autoAbout);
		}
		if (this.options.darkTheme) {
			var darkTheme = this._contentItem('darkTheme', 'Dark Theme');
			wrapper.appendChild(darkTheme);
		}
		if (this.options.tooltips) {
			var tooltips = this._contentItem('tooltips', 'Tooltips');
			wrapper.appendChild(tooltips);
		}
		if (this.options.mapboxGL) {
			var mapboxGL = this._contentItem('mapboxGL', 'MapboxGL');
			wrapper.appendChild(mapboxGL);
		}

		return wrapper;
	},

	_contentItem : function (setting, title) {

		// create item
		var className 	= 'settings-item settings-item-' + setting,
		    div 	= Wu.DomUtil.create('div', className),
		    titlediv 	= Wu.DomUtil.create('div', 'settings-item-title', div),
		    switchWrap  = Wu.DomUtil.create('div', 'switch', div),
		    input 	= Wu.DomUtil.create('input', 'cmn-toggle cmn-toggle-round-flat', switchWrap),
		    label 	= Wu.DomUtil.create('label', '', switchWrap),
		    id 		= Wu.Util.guid();
		
		// set title etc.
		titlediv.innerHTML = title;
		input.setAttribute('type', 'checkbox');
		if (this._settings[setting]) input.setAttribute('checked', 'checked');
		input.id = id;
		label.setAttribute('for', id);

		// set events
		Wu.DomEvent.on(input, 'click', function (e) {
			Wu.DomEvent.stopPropagation(e);

			// toggle setting
			this.project.toggleSetting(setting);

			// refresh settings
			this._settings = this.project.getSettings();
			
		}, this);
		 
		Wu.DomEvent.on(switchWrap, 'mousedown', Wu.DomEvent.stopPropagation);

		// return div
		return div;

	},

	save : function () {
		this.project.setSettings(this._settings);
	},

	update : function () {
		Wu.SidePane.Map.MapSetting.prototype.update.call(this)
		
		// get project settings
		this._settings = this.project.getSettings();

		// create content
		var content = this.contentLayout();
		this._outer.innerHTML = '';
		this._outer.appendChild(content);

	},




});

