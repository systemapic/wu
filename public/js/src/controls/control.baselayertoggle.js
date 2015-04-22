// app.MapPane.baselayerToggle
L.Control.Baselayertoggle = Wu.Control.extend({

	type : 'baselayertoggle',

	options: {
		collapsed: true,
		position: 'topleft',
		autoZIndex: true
	},

	onAdd: function () {
		// create div
		var className = 'leaflet-control-baselayertoggle';
		var container = this._container = L.DomUtil.create('div', className);

		// add tooltip
		app.Tooltip.add(container, 'Toggle between baselayers', { extends : 'systyle', offset : [23, 0]});

		return container;
	},

	_addHooks : function () {
		// add events
		Wu.DomEvent.on(this._container, 'mousedown', this.toggle, this);
		Wu.DomEvent.on(this._container, 'dblclick', Wu.DomEvent.stop, this);
		Wu.DomEvent.on(this._container, 'mouseleave', this.mouseOut, this);

		// add stops
		Wu.DomEvent.on(this._container, 'mousedown dblclick mouseup click', Wu.DomEvent.stopPropagation, this);
	},

	addTo: function (map) {

		this._map = map;

		var container = this._container = this.onAdd(map),
		    pos = this.getPosition(),
		    corner = map._controlCorners[pos];

		L.DomUtil.addClass(container, 'leaflet-control');

		// add to dom
		corner.appendChild(container);

		return this;
	},

	_on : function () {
		this._show();
	},
	_off : function () {
		this._hide();
	},
	_show : function () {
		this._container.style.display = 'block';
	},
	_hide : function () {
		this._container.style.display = 'none';
	},

	_addTo : function () {
		this.addTo(app._map);
		this._addHooks();
		this._added = true;
	},

	_refresh : function () {
		if (!this._added) this._addTo();

		// get control active setting from project
		var active = this._project.getControls()[this.type];
		
		// if not active in project, hide
		if (!active) return this._hide();

		// remove old content
		this._flush();

		// init content
		this._initContent();

	},

	_flush : function () {
		// empty old
		if (this._list) {
			Wu.DomUtil.remove(this._list);
			this._list = null;
		}

		this._layers = null;
		this._layers = {};

	},

	_initContent : function () {
		
		// create wrapper
		this._list = L.DomUtil.create('div', 'baselayertoggle-list', this._container);
		Wu.DomEvent.on(this._list, 'dblclick', Wu.DomEvent.stop, this);

		// build menu
		var baseLayers = this._project.getBaselayers() || [];

		baseLayers.forEach(function (b) {
			var baseLayer = {
				layer : this._project.getLayer(b.uuid),
				baseLayer : b
			}
			this.addLayer(baseLayer);
		}, this);

	},
	
	mouseOut : function () {

		if ( this._isOpen ) { this.collapse() }
		else { return };

	},

	addLayer : function (baseLayer) {
		if (!baseLayer.layer) return console.error('BUG: fixme!');
		
		// create div
		var layerName = baseLayer.layer.getTitle();
		var item = Wu.DomUtil.create('div', 'baselayertoggle-item active', this._list, layerName);
		
		// set active by default
		baseLayer.active = true;

		// add to local store
		var id = L.stamp(baseLayer);
		this._layers[id] = baseLayer;

		// add click event
		Wu.DomEvent.on(item, 'mousedown', function (e) {
			Wu.DomEvent.stop(e);
			this.toggleLayer(baseLayer, item);
		}, this);
	},

	toggleLayer : function (baseLayer, item) {

		// get layer from local store
		var layer = this._layers[L.stamp(baseLayer)].layer;

		// toggle
		if (baseLayer.active) {

			// disable
			layer.disable();
			baseLayer.active = false;
			Wu.DomUtil.removeClass(item, 'active');
			
		} else {
			
			// enable
			layer.add('baselayer');
			baseLayer.active = true;
			Wu.DomUtil.addClass(item, 'active');
		}

		// Google Analytics event tracking
		app.Analytics.setGaEvent(['Controls', 'Baselayer toggle: ' + layer.getTitle()]);

	},

	toggle : function () {
		
		this._isOpen ? this.collapse() : this.expand();

		// Google Analytics event tracking
		app.Analytics.setGaEvent(['Controls', 'Baselayer toggle click']);
	},

	collapse : function () {
		this._isOpen = false;
		Wu.DomUtil.removeClass(this._container, 'open');
	},

	expand : function () {
		this._isOpen = true;
		Wu.DomUtil.addClass(this._container, 'open');
	},

});

L.control.baselayerToggle = function (options) {
	return new L.Control.Baselayertoggle(options);
};