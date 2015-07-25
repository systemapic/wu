Wu.SidePane.Options.BaseLayers = Wu.SidePane.Options.Item.extend({
	_ : 'sidepane.map.baselayers', 

	type : 'baseLayers',

	getPanes : function () {
		// map baselayer
		this._container = Wu.DomUtil.get('editor-map-baselayer-wrap');
	},


	initLayout : function () {

		// create title and wrapper (and delete old content)
		this._container.innerHTML = '<h4 id="h4-base">Base Layers</h4>';
		var div = Wu.DomUtil.createId('div', 'select-baselayer-wrap select-wrap', this._container);
		this._outer = Wu.DomUtil.create('div', 'select-elems', div);

		// add tooltip
		var h4 = Wu.DomUtil.get('h4-base');
		app.Tooltip.add(h4, 'Sets the base layers of the map. These layers will not appear in the "Layers" menu to the right of the screen. Users may still toggle these layers if the "Base Layer Toggle" option has been set to active in the "Controls" section.' );
	},

	
	update : function () {
		Wu.SidePane.Options.Item.prototype.update.call(this)	// call update on prototype

		// options
		this.editMode = false;

		// refresh layout
		this.initLayout();

		// fill in with layers
		this.fillLayers();

		// mark unavailable layers
		this.markOccupied();

		// close
		this.close();
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
		if (layer.store.title) { 
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

	},

	toggleEdit : function (baseLayer) {
		var uuid = baseLayer.layer.store.uuid;
		this.editMode[uuid] ? this.editOff(baseLayer) : this.editOn(baseLayer);
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
		var baselayerToggle = app.MapPane.getControls().baselayertoggle;
		if (baselayerToggle) baselayerToggle._refresh();

		// mark occupied layers in layermenu
		var layermenuSetting = app.SidePane.Options.settings.layermenu;
		layermenuSetting.markOccupied();

		// refresh cartoCssControl
		var cartoCss = app.MapPane.getControls().cartocss;
		if (cartoCss) cartoCss._refresh();

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
			if (a.store) this.activate(a.store.uuid);
		}, this);

		layermenuLayers.forEach(function (bl) {
			var layer = _.find(layers, function (l) { 
				if (!l.store) return false;
				return l.store.uuid == bl.layer; 
			});
			if (layer) this.deactivate(layer.store.uuid);
		}, this);

	},

	activate : function (layerUuid) {
		var layer = this._layers[layerUuid];
		if (!layer) return;
		Wu.DomUtil.removeClass(layer.container, 'deactivated');
	},

	deactivate : function (layerUuid) {
		var layer = this._layers[layerUuid];
		if (!layer) return;
		Wu.DomUtil.addClass(layer.container, 'deactivated');
	}
});

