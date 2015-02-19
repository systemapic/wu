/*
 * L.Control.Layers is a control to allow users to switch between different layers on the map.
 * https://raw.githubusercontent.com/Leaflet/Leaflet/master/src/control/Control.Layers.js
 */

L.Control.BaselayerToggle = L.Control.extend({
	options: {
		collapsed: true,
		position: 'topleft',
		autoZIndex: true
	},

	onAdd: function () {
		this._initLayout();
		this.update();
		return this._container;
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


	
	_initLayout: function () {

		// create div
		var className = 'leaflet-control-baselayertoggle';
		var container = this._container = L.DomUtil.create('div', className);

		// add tooltip
		app.Tooltip.add(container, 'Toggle between baselayers', { extends : 'systyle', offset : [23, 0]});

		// add events
		Wu.DomEvent.on(container, 'mousedown', this.toggle, this);
		Wu.DomEvent.on(container, 'dblclick', Wu.DomEvent.stop, this);

		// add stops
		Wu.DomEvent.on(container, 'mousedown dblclick mouseup click', Wu.DomEvent.stopPropagation, this);

	},

	
	update: function () {
		if (!this._container) return; 

		// set project
		this.project = this.project || app.activeProject;

		// empty old
		if (this._list) Wu.DomUtil.remove(this._list);

		this._layers = {};

		// create wrapper
		this._list = L.DomUtil.create('div', 'baselayertoggle-list collapsed', this._container);
		Wu.DomEvent.on(this._list, 'dblclick', Wu.DomEvent.stop, this);

		// build menu
		var baseLayers = this.project.getBaselayers();
		if (!baseLayers) return;

		baseLayers.forEach(function (b) {
			var baseLayer = {
				layer : this.project.getLayer(b.uuid),
				baseLayer : b
			}
			this.addLayer(baseLayer);
		}, this);

		return this;
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
		var _layerTitle = layer.getTitle();
		app.Analytics.ga(['Controls', 'Baselayer toggle: ' + _layerTitle]);


	},

	toggle : function () {
		
		this._isOpen ? this.collapse() : this.expand();

		// Google Analytics event tracking
		app.Analytics.ga(['Controls', 'Baselayer toggle click']);

	},

	collapse : function () {
		this._isOpen = false;
		Wu.DomUtil.addClass(this._list, 'collapsed');
	},

	expand : function () {
		this._isOpen = true;
		Wu.DomUtil.removeClass(this._list, 'collapsed');
	},


});

L.control.baselayerToggle = function (options) {
	return new L.Control.BaselayerToggle(options);
};