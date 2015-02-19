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

		// Google Analytics event trackign
		var _name = this._container.childNodes[0].innerHTML;
		app.Analytics.ga(['Side Pane', 'Options select: ' + _name]);

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
		var keys = ['geojson', 'mapbox', 'osm'];
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
		if (provider == 'osm') title = 'Open Street Map';
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
		this._container.innerHTML = '<h4 id="h4-base">Base Layers</h4>';
		var div = Wu.DomUtil.createId('div', 'select-baselayer-wrap', this._container);
		this._outer = Wu.DomUtil.create('div', 'select-elems', div);
		Wu.DomUtil.addClass(div, 'select-wrap');

		// add tooltip
		var h4 = Wu.DomUtil.get('h4-base');
		app.Tooltip.add(h4, 'Sets the base layers of the map. These layers will not appear in the "Layers" menu to the right of the screen. Users may still toggle these layers if the "Base Layer Toggle" option has been set to active in the "Controls" section.' );
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
		Wu.DomEvent.on(container, 'mousedown', function (e) { 

			// prevent other click events
			Wu.DomEvent.stop(e);

			// toggle layer
			this.toggle(baseLayer);

		}, this);

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

		var project = app.activeProject;
		var thumbCreated = project.getThumbCreated(); 			// refactor
		if (!thumbCreated) project.createProjectThumb();		

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

	setDefaultLayer : function () {
		var baseLayer = _.sample(this._layers, 1)[0];
		console.log('setDefaultLayer', this._layers);
		console.log('baseLayer', baseLayer);
		if (!baseLayer) return;
		this.on(baseLayer);
		this.enableLayer(baseLayer);
	},

	enableLayer : function (baseLayer) {

		// get layer
		var layer = baseLayer.layer;

		// enable layer on map (without controls)
		layer._addTo('baselayer');

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
		var min = _.size(this.project.getLayermenuLayers()),
		    padding = this.numberOfProviders * 35;
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
		this._container.innerHTML = '<h4 id="h4-layer">Layer Menu</h4>';


		this._inner  = Wu.DomUtil.create('div', 'map-layermenu-inner', this._container);
		this._outer  = Wu.DomUtil.create('div', 'map-layermenu-outer', this._inner);
		// var status   = 'Enable layer menu in Controls below.';
		// this._status = Wu.DomUtil.create('div', 'layermenu-status', this._outer, status);

		// add tooltip
		var h4 = Wu.DomUtil.get('h4-layer');
		// app.Tooltip.add(this._container, 'Sets layers that will appear in the layer menu. Selected base layers will be excluded from the Layer Menu list, and vice versa, to avoid duplicates.' );
		app.Tooltip.add(h4, 'Sets layers that will appear in the layer menu. Selected base layers will be excluded from the Layer Menu list, and vice versa, to avoid duplicates.' );

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
		// clearTimeout(this.closeEditTimer);
		// var that = this;
		// this.closeEditTimer = setTimeout(function() {
		// 	that.disableEdit();
		// }, 3000);
	},

	// enable edit mode on layermenu itself
	enableEdit : function () {

		if ( !app.MapPane.layerMenu._open ) app.MapPane.layerMenu.toggleLayerPane();		

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

		// add tooltip
		var h4 = this._container.getElementsByTagName('h4')[0];
		app.Tooltip.add(h4, 'Sets the starting position of the map.');
		// app.Tooltip.add(this._container, 'Sets the starting position of the map.');

	},

	addHooks : function () {

		// call addHooks on prototype
		Wu.SidePane.Map.MapSetting.prototype.addHooks.call(this)

		// cxxxxxxxxxxxxxxxxxx

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

		// add tooltip
		var h4 = this._container.getElementsByTagName('h4')[0];
		// app.Tooltip.add(this._container, 'Decides the bounding area and the min/max zoom of the map. If a user moves outside of the bounding area, the map will "bounce" back to fit within the given bounding coordinates.');
		app.Tooltip.add(h4, 'Decides the bounding area and the min/max zoom of the map. If a user moves outside of the bounding area, the map will "bounce" back to fit within the given bounding coordinates.');

	},

	addHooks : function () {

		// call addHooks on prototype
		Wu.SidePane.Map.MapSetting.prototype.addHooks.call(this)

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
		app.Analytics.ga(['Side Pane', 'Options > Bounds: set bounds']);

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
		app.Analytics.ga(['Side Pane', 'Options > Bounds: set min zoom']);

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
		app.Analytics.ga(['Side Pane', 'Options > Bounds: set max zoom']);

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
		app.Analytics.ga(['Side Pane', 'Options > Bounds: clear bounds']);

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
		app.Analytics.ga(['Side Pane', 'Options > Bounds: set SW bounds']);


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
		app.Analytics.ga(['Side Pane', 'Options > Bounds: set NE bounds']);

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
		this.panes.controlMouseposition        	= Wu.DomUtil.get('map-controls-mouseposition').parentNode.parentNode;
		this.panes.controlBaselayertoggle      	= Wu.DomUtil.get('map-controls-baselayertoggle').parentNode.parentNode;
		this.panes.controlCartocss 		= Wu.DomUtil.get('map-controls-cartocss').parentNode.parentNode;

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

	update : function () {

		// call update on prototype
		Wu.SidePane.Map.MapSetting.prototype.update.call(this)

		this.controls = this.project.getControls();

		// tmp hack to remove vectorstyle
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
		var h4 			= Wu.DomUtil.create('h4', '', this._container, 'Connected Sources');
		this._outer 		= Wu.DomUtil.create('div', 'connect-outer', this._container);

		// import OSM
		var box 		= Wu.DomUtil.create('div', 'connect-osm', this._outer);
		var h4_3		= Wu.DomUtil.create('div', 'connect-title', box, 'Open Street Map');
		this._osmwrap 		= Wu.DomUtil.create('div', 'osm-connect-wrap', this._outer);
		this._osmbox 		= Wu.DomUtil.create('div', 'osm-add-box smap-button-white', this._osmwrap, 'Add OSM layer');

		// mapbox connect
		var wrap 	  	= Wu.DomUtil.create('div', 'connect-mapbox', this._outer);
		var h4_2 		= Wu.DomUtil.create('div', 'connect-title', wrap, 'Mapbox');
		this._mapboxWrap  	= Wu.DomUtil.create('div', 'mapbox-connect-wrap', this._outer);
		this._mapboxInput 	= Wu.DomUtil.create('input', 'input-box search import-mapbox-layers', this._mapboxWrap);
		this._mapboxConnect 	= Wu.DomUtil.create('div', 'smap-button-white import-mapbox-layers-button', this._mapboxWrap, 'Add');
		this._mapboxAccounts 	= Wu.DomUtil.create('div', 'mapbox-accounts', this._mapboxWrap);
		
		// clear vars n fields
		this.resetInput();


		// add tooltip
		app.Tooltip.add(h4, 'Imports layers from MapBox accounts.');


	},

	addHooks : function () {

		Wu.SidePane.Map.MapSetting.prototype.addHooks.call(this)


		// cxxxx

		// connect mapbox button
		Wu.DomEvent.on( this._mapboxConnect, 'click', this.importMapbox, this );

		// add osm button
		Wu.DomEvent.on( this._osmbox, 'click', this.addOSMLayer, this );


		// stops
		Wu.DomEvent.on( this._mapboxConnect, 'mousedown', Wu.DomEvent.stop, this );
		Wu.DomEvent.on( this._mapboxInput, 'mousedown', Wu.DomEvent.stopPropagation, this );
		Wu.DomEvent.on( this._osmwrap, 'mousedown', Wu.DomEvent.stopPropagation, this );
		Wu.DomEvent.on( this._osmbox, 'mousedown', Wu.DomEvent.stopPropagation, this );


	},

	removeHooks : function () {
		// todo!!!
	},	

	calculateHeight : function () {
		var num = this.project.getMapboxAccounts().length;
		this.maxHeight = 150 + num * 30;
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

	addOSMLayer : function () {

		// create layer
		this.project.createOSMLayer(function (err, layer) {

			// add to baselayer, layermenu
			this._updateLayerOptions();

		}.bind(this));

		// Google Analytics event tracking
		app.Analytics.ga(['Side Pane', 'Options > Connected Src: add osm layer']);

	},

	_updateLayerOptions : function () {

		// update contents in Options/Baselayers + Layermenu
		app.SidePane.Map.mapSettings.baselayer.update();
		app.SidePane.Map.mapSettings.layermenu.update();
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
		this._importMapbox(username, accessToken, this.importedMapbox);

		// Google Analytics event tracking
		app.Analytics.ga(['Side Pane', 'Options > Connected Src: import mapbox']);


	},

	_importMapbox : function (username, accessToken, callback) {

		// get mapbox account via server
		var data = {
			'username' : username,
			'accessToken' : accessToken,
			'projectId' : this.project.store.uuid
		}
		// post         path                            json          callback      this
		Wu.post('/api/util/getmapboxaccount', JSON.stringify(data), callback, this);
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

		// update project
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
			this._insertMapboxAccount(account);
		}, this);
		
	},

	_insertMapboxAccount : function (account) {

		// wrap
		var wrap  = Wu.DomUtil.create('div', 'mapbox-listed-account', this._mapboxAccounts);
		
		// title
		var title = Wu.DomUtil.create('div', 'mapbox-listed-account-title', wrap, account.username.camelize());

		// return if not edit mode
		if (!this.project.editMode) return;

		// refresh button 
		var refresh = Wu.DomUtil.create('div', 'mapbox-listed-account-refresh smap-button-white', wrap);

		// delete button
		var del = Wu.DomUtil.create('div', 'mapbox-listed-account-delete smap-button-white', wrap);


		// refresh event
		Wu.DomEvent.on(refresh, 'mousedown', function (e) {
			Wu.DomEvent.stop(e);
			var msg = 'Are you sure you want to refresh the account? This will DELETE old layers and re-import them.';
			if (confirm(msg)) this._refreshMapboxAccount(wrap, account);
		}, this);

		// delete event
		Wu.DomEvent.on(del, 'mousedown', function (e) {
			Wu.DomEvent.stop(e);
			console.log('delete account');
			
			// remove account
			var msg = 'Are you sure you want to delete the account? This will DELETE all layers from account in this project.';
			if (confirm(msg)) this._removeMapboxAccount(wrap, account);
			
		}, this);

	},

	_removeMapboxAccount : function (div, account) {
		Wu.DomUtil.remove(div);
		this.project.removeMapboxAccount(account);
	},

	_refreshMapboxAccount : function (div, account) {
		console.log('_refreshMapboxAccount', account);

		// delete and re-import
		this._removeMapboxAccount(div, account);

		// get mapbox account via server
		var that = this;
		setTimeout(function () {
			that._importMapbox(account.username, account.accessToken, that.importedMapbox);
		}, 1000); // hack! todo!

	},


	fillOSM : function () {
	},

	
	update : function () {
		Wu.SidePane.Map.MapSetting.prototype.update.call(this)	// call update on prototype

		// add OSM options
		this.fillOSM();

		// fill in mapbox accounts
		this.fillMapbox();
	},



});


                       
Wu.SidePane.Map.Settings = Wu.SidePane.Map.MapSetting.extend({
	_ : 'sidepane.map.settings', 

	type : 'settings',

	options : {

		// include settings
		// screenshot 	: true,
		socialSharing 	: true,
		documentsPane 	: true,
		dataLibrary 	: true,
		mediaLibrary 	: false,
		// autoHelp 	: true,
		// autoAbout 	: true,
		darkTheme 	: true,
		tooltips 	: true,
		mapboxGL	: false,

	},

	initLayout : function (container) {

		// container, header, outer
		this._container	= Wu.DomUtil.create('div', 'editor-inner-wrapper editor-map-item-wrap ct12 ct17 ct23', container);
		var h4 		= Wu.DomUtil.create('h4', '', this._container, 'Settings');
		this._outer 	= Wu.DomUtil.create('div', 'settings-outer', this._container);

		// add tooltip
		app.Tooltip.add(h4, 'Enable additional map settings.');


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

			// add tooltip
			app.Tooltip.add(screenshot, 'Enable users to make screenshots of map');

		}
		if (this.options.socialSharing) {

			var socialSharing = this._contentItem('socialSharing', 'Sharing');
			wrapper.appendChild(socialSharing);

			// add tooltip
			app.Tooltip.add(socialSharing, 'Enable social sharing for this map');

		}
		if (this.options.documentsPane) {

			var documentsPane = this._contentItem('documentsPane', 'Documents Pane');
			wrapper.appendChild(documentsPane);

			// add tooltip
			app.Tooltip.add(documentsPane, 'Enable documents pane for this map');

		}
		if (this.options.dataLibrary) {

			var dataLibrary = this._contentItem('dataLibrary', 'Data Library');
			wrapper.appendChild(dataLibrary);

			// add tooltip
			app.Tooltip.add(dataLibrary, 'Enable public data library for this map');

		}
		if (this.options.mediaLibrary) {

			var mediaLibrary = this._contentItem('mediaLibrary', 'Media Library');
			wrapper.appendChild(mediaLibrary);

			// add tooltip
			app.Tooltip.add(mediaLibrary, 'Enable media library for this map');			

		}
		if (this.options.autoHelp) {

			var autoHelp = this._contentItem('autoHelp', 'Add Help');
			wrapper.appendChild(autoHelp);

			// add tooltip
			app.Tooltip.add(autoHelp, 'Add help section to documents');			

		}
		if (this.options.autoAbout) {

			var autoAbout = this._contentItem('autoAbout', 'Add About');
			wrapper.appendChild(autoAbout);

			// add tooltip
			app.Tooltip.add(autoAbout, 'Add about section to documents');			

		}
		if (this.options.darkTheme) {

			var darkTheme = this._contentItem('darkTheme', 'Dark Theme');
			wrapper.appendChild(darkTheme);

			// add tooltip
			app.Tooltip.add(darkTheme, 'Toggle between dark- and light theme');

		}
		if (this.options.tooltips) {

			var tooltips = this._contentItem('tooltips', 'Tooltips');
			wrapper.appendChild(tooltips);

			// add tooltip
			app.Tooltip.add(tooltips, 'Enable this tooltip for the portal');

		}
		if (this.options.mapboxGL) {
			
			var mapboxGL = this._contentItem('mapboxGL', 'MapboxGL');
			wrapper.appendChild(mapboxGL);

			// add tooltip
			app.Tooltip.add(mapboxGL, 'Render map with GL');

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
		Wu.DomEvent.on(div, 'click', function (e) {	

			console.log('click, settings', setting);
			
			Wu.DomEvent.stop(e);

			// toggle setting
			this.project.toggleSetting(setting);

			// refresh settings
			this._settings = this.project.getSettings();

			// toggle button
			this._settings[setting] ? input.setAttribute('checked', 'checked') : input.removeAttribute('checked');

			// Google Analytics event tracking
			app.Analytics.ga(['Side Pane', 'Options > Settings: ' + setting]);
			
		}, this);
		 
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

