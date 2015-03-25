Wu.SidePane.Options.LayerMenu = Wu.SidePane.Options.Item.extend({
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
		Wu.SidePane.Options.Item.prototype.update.call(this)	// call update on prototype

		// get layermenu object
		this.layerMenu = app.MapPane.getControls().layermenu; // todo: remove probably

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

	// enableLayermenu : function () {
	// 	var layerMenu = app.MapPane.enableLayermenu();
	// 	app.SidePane.Options.settings.controls.enableControl('layermenu');
		
	// 	// save changes to project
	// 	this.project.store.controls.layermenu = true;
	// 	this.project._update('controls');
		
	// 	return layerMenu;
	// },

	toggle : function (layer) {
		
		// console.log('toggle --> ', layer);

		// ensure layerMenu is active
		// this.layerMenu = Wu.app.MapPane.layerMenu;
		// this.layerMenu = this.layerMenu || Wu.app.MapPane.layerMenu;
		// if (!this.layerMenu) this.layerMenu = this.enableLayermenu();
		// this.layerMenu.enableEdit();


		
		var layerMenu = app.MapPane.getControls().layermenu;

		if (app.access.to.edit_project(this.project)) layerMenu.enableEdit();


		if (layer.active) {
			
			// remove from layermenu
			var uuid = layer.layer.store.uuid;
			layerMenu._remove(uuid);

			// set off
			this.off(layer);

		} else {

			// add to layermenu
			layerMenu.add(layer.layer);

			// set on
			this.on(layer);
		}

		// mark occupied layers in layermenu
		var baselayerSetting = app.SidePane.Options.settings.baselayer;
		baselayerSetting.markOccupied()

		// refresh cartoCssControl
		var cartoCss = app.MapPane.getControls().cartocss;
		if (cartoCss) cartoCss._refresh();
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
		var layerMenu = app.MapPane.getControls().layermenu;
		if (!layerMenu) return;

		if (!layerMenu._open) layerMenu.toggleLayerPane();		

		if (layerMenu) layerMenu.enableEdit();
	},

	disableEdit : function () {
		var layerMenu = app.MapPane.getControls().layermenu;
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
