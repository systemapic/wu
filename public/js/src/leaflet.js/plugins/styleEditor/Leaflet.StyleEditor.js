L.Control.StyleEditor = L.Control.extend({

	options: {
		position: 'topleft',
		enabled : false,
		// colorRamp : ['#334d5c','#45b29d','#8eddb8','#5fffaf','#0ea32b','#47384d','#a84158','#f224ff','#d85fff','#f21b7f','#f40028','#f15e01','#e27a3f','#ffc557','#dbef91','#df4949','#cfc206','#fff417','#4b84e8','#ffffff'],
		colorRamp : ['#334d5c','#45b29d','#5fffaf','#0ea32b','#a84158','#d85fff','#f21b7f','#f40028','#f15e01','#ffc557','#dbef91','#df4949','#fff417','#4b84e8','#ffffff'],
		patternRamp : ['SVGpattern1', 'SVGpattern2', 'SVGpattern3', 'SVGpattern4', 'SVGpattern5', 'SVGpattern6', 'SVGpattern7', 'SVGpattern8'],
		markerApi : 'http://api.tiles.mapbox.com/v3/marker/',
		markers : ['circle-stroked', 'circle', 'square-stroked', 'square', 'triangle-stroked', 'triangle', 'star-stroked', 'star', 'cross', 'marker-stroked', 'marker', 'religious-jewish', 'religious-christian', 'religious-muslim', 'cemetery', 'rocket', 'airport', 'heliport', 'rail', 'rail-metro', 'rail-light', 'bus', 'fuel', 'parking', 'parking-garage', 'airfield', 'roadblock', 'ferry', 'harbor', 'bicycle', 'park', 'park2', 'museum', 'lodging', 'monument', 'zoo', 'garden', 'campsite', 'theatre', 'art-gallery', 'pitch', 'soccer', 'america-football', 'tennis', 'basketball', 'baseball', 'golf', 'swimming', 'cricket', 'skiing', 'school', 'college', 'library', 'post', 'fire-station', 'town-hall', 'police', 'prison', 'embassy', 'beer', 'restaurant', 'cafe', 'shop', 'fast-food', 'bar', 'bank', 'grocery', 'cinema', 'pharmacy', 'hospital', 'danger', 'industrial', 'warehouse', 'commercial', 'building', 'place-of-worship', 'alcohol-shop', 'logging', 'oil-well', 'slaughterhouse', 'dam', 'water', 'wetland', 'disability', 'telephone', 'emergency-telephone', 'toilets', 'waste-basket', 'music', 'land-use', 'city', 'town', 'village', 'farm', 'bakery', 'dog-park', 'lighthouse', 'clothing-store', 'polling-place', 'playground', 'entrance', 'heart', 'london-underground', 'minefield', 'rail-underground', 'rail-above', 'camera', 'laundry', 'car', 'suitcase', 'hairdresser', 'chemist', 'mobilephone', 'scooter'],
		editlayers : [],
		dashArrays : [],
		openOnLeafletDraw : false,
		showTooltip : true,
		tooltipOffset : {
			x : 15,
			y : -23
		}
	},

	onAdd: function(map) {
		// console.log('ADD STYLE.EDITOR');
		this.options.map = map;
		return this.createUi();
	},

	// added by wu   
	onRemove : function (map) {		
		L.DomEvent.off(this.options.controlDiv, 'click', this.clickHandler, this);
		L.DomEvent.off(this.options.styleEditorDiv, 'mouseenter', this.disableLeafletActions, this);
		L.DomEvent.off(this.options.styleEditorDiv, 'mouseleave', this.enableLeafletActions, this);        
		
		this.disable();

		if (L.Control.Draw && this.options.openOnLeafletDraw) {
				this.options.map.off('draw:created', function(layer) {
					this.initChangeStyle({
						"target": layer.layer
					});
				}, this);
		}
	},

	createUi: function() {
		// console.log('createUi');
		var controlDiv = this.options.controlDiv = L.DomUtil.create('div', 'leaflet-control-styleeditor');
		var controlUI = this.options.controlUI = L.DomUtil.create('div', 'leaflet-control-styleeditor-interior', controlDiv);
		controlUI.title = 'Style Editor';

		var styleEditorDiv = this.options.styleEditorDiv = L.DomUtil.create('div', 'leaflet-styleeditor', this.options.map._container);

		var wrapper = L.DomUtil.create('div', 'leaflet-styleeditor-inner', styleEditorDiv);

		var header = this.options.styleEditorHeader = L.DomUtil.create('div', 'leaflet-styleeditor-header', wrapper);
		this.options.styleEditorUi = L.DomUtil.create('div', 'leaflet-styleeditor-interior', wrapper);

		// add another close button
		var doneButton = this.options.doneButton = L.DomUtil.create('div', 'leaflet-styleeditor-done', wrapper);
		doneButton.innerHTML = 'Done editing';

		var closeButton = this.options.closeButton = L.DomUtil.create('div', 'leaflet-styleeditor-close displayNone', controlDiv);
		closeButton.innerHTML = 'Cancel';

		this.addDomEvents();
		this.addLeafletDrawEvents();
		this.addButtons();

		return controlDiv;
	},

	addDomEvents: function() {
		L.DomEvent.on(this.options.controlDiv, 'mousedown', this.clickHandler, this);
		L.DomEvent.on(this.options.styleEditorDiv, 'mouseenter', this.disableLeafletActions, this);
		L.DomEvent.on(this.options.styleEditorDiv, 'mouseleave', this.enableLeafletActions, this);
		L.DomEvent.on(this.options.controlUI, 'dblclick', L.DomEvent.stop, this);
		L.DomEvent.on(this.options.closeButton, 'click', this.disable, this);
		L.DomEvent.on(this.options.doneButton, 'click', this.disable, this);
	},

	addLeafletDrawEvents: function() {
		if (L.Control.Draw) {
			if (this.options.openOnLeafletDraw) {
				this.options.map.on('draw:created', function(layer) {
					this.initChangeStyle({
						"target": layer.layer
					});
				}, this);
			}
		}
	},

	addButtons: function() {
		var closeBtn = L.DomUtil.create('button', 'leaflet-styleeditor-button styleeditor-closeBtn', this.options.styleEditorHeader);
		var sizeToggleBtn = this.options.sizeToggleBtn = L.DomUtil.create('button', 'leaflet-styleeditor-button styleeditor-inBtn', this.options.styleEditorHeader);

		// L.DomEvent.addListener(closeBtn, 'click', this.hideEditor, this);
		L.DomEvent.addListener(closeBtn, 'click', this.disable, this);
		L.DomEvent.addListener(sizeToggleBtn, 'click', this.toggleEditorSize, this);
	},


	clickHandler: function(e) {
		// console.log('clickHandler, enabled? ', this.options.enabled);
		this.options.enabled ? this.disable() : this.enable();
	},

	disableLeafletActions: function() {
		this.options.map.dragging.disable();
		this.options.map.touchZoom.disable();
		this.options.map.doubleClickZoom.disable();
		this.options.map.scrollWheelZoom.disable();
		this.options.map.boxZoom.disable();
		this.options.map.keyboard.disable();
	},

	enableLeafletActions: function() {
		this.options.map.dragging.enable();
		this.options.map.touchZoom.enable();
		this.options.map.doubleClickZoom.enable();
		this.options.map.scrollWheelZoom.enable();
		this.options.map.boxZoom.enable();
		this.options.map.keyboard.enable();
	},

	enable: function() {
		this.options.map.eachLayer(this.addEditClickEvents, this);
		this.createMouseTooltip();
		this._enable();
	},

	_enable : function () {
		// show as enabled and closeButton
		L.DomUtil.addClass(this.options.controlUI, "enabled");
		L.DomUtil.removeClass(this.options.closeButton, 'displayNone');
		this.options.enabled = true;
		// console.log('_enabled? ', this.options.enabled);
	},

	disable: function() {
		// console.log('disable');
		this.options.editlayers.forEach(this.removeEditClickEvents, this);
		this.options.editlayers = [];
		this.hideEditor();
		this.removeMouseTooltip();

		// hide button
		this._disable();
	},

	_disable : function () {
		// disable and hide closeButton
		L.DomUtil.removeClass(this.options.controlUI, 'enabled');
		L.DomUtil.addClass(this.options.closeButton, 'displayNone');
		this.options.enabled = false;
	},

	addEditClickEvents: function(layer) {
		if (layer._latlng || layer._latlngs) {
			var evt = layer.on('click', this.initChangeStyle, this);
			this.options.editlayers.push(evt);
		}
	},

	removeEditClickEvents: function(layer) {
		layer.off('click', this.initChangeStyle, this);
	},


	toggleEditorSize: function() {
		if (L.DomUtil.hasClass(this.options.styleEditorDiv, 'leaflet-styleeditor-full')) {
			L.DomUtil.removeClass(this.options.styleEditorDiv, 'leaflet-styleeditor-full');
			L.DomUtil.removeClass(this.options.styleEditorUi, 'leaflet-styleeditor-full');
			L.DomUtil.removeClass(this.options.sizeToggleBtn, 'styleeditor-outBtn');
			L.DomUtil.addClass(this.options.sizeToggleBtn, 'styleeditor-inBtn');

		} else {
			L.DomUtil.addClass(this.options.styleEditorDiv, 'leaflet-styleeditor-full');
			L.DomUtil.addClass(this.options.styleEditorUi, 'leaflet-styleeditor-full');
			L.DomUtil.removeClass(this.options.sizeToggleBtn, 'styleeditor-inBtn');
			L.DomUtil.addClass(this.options.sizeToggleBtn, 'styleeditor-outBtn');
		}
	},

	showEditor: function() {
		var editorDiv = this.options.styleEditorDiv;
		if (!L.DomUtil.hasClass(editorDiv, 'editor-enabled')) {
			L.DomUtil.addClass(editorDiv, 'editor-enabled');
		}

		// hide other controls (wu)
		app.MapPane.hideControls();

		// esc/enter click to close
		Wu.DomEvent.on(window, 'keydown', this.closeKey, this);
	},


	hideEditor: function() {
		L.DomUtil.removeClass(this.options.styleEditorDiv, 'editor-enabled');

		// show other controls (wu)
		app.MapPane.showControls();

		// esc/enter click to close
		Wu.DomEvent.off(window, 'keydown', this.closeKey, this);
	},

	closeKey : function (e) {
		if (e.keyCode == 13 || e.keyCode == 27 ) {
			this.disable();
		}
	},

	initChangeStyle: function(e) {
		// console.log('initChangeStyle');

		Wu.DomEvent.stop(e);

		// show as enabled
		this._enable();

		this.options.currentElement = e;

		// show editor
		this.showEditor();
	
		// hide tooltip
		this.removeMouseTooltip();

		var layer = e.target;

		if (layer instanceof L.Marker) {
			//marker
			this.createMarkerForm(layer);
		} else {
			//geometry with normal styles
			this.createGeometryForm(layer);
		}

	},

	createGeometryForm: function(layer) {
		// console.log('createGeometryForm');
		var styleForms = new L.StyleForms({
			colorRamp: this.options.colorRamp,
			styleEditorUi: this.options.styleEditorUi,
			currentElement: this.options.currentElement,
			patternRamp : this.options.patternRamp
		});

		styleForms.createGeometryForm();
	},

	createMarkerForm: function(layer) {
		// console.log('createMarkerForm');
		var styleForms = new L.StyleForms({
			colorRamp: this.options.colorRamp,
			styleEditorUi: this.options.styleEditorUi,
			currentElement: this.options.currentElement,
			markerApi: this.options.markerApi,
			markers: this.options.markers
		});

		styleForms.createMarkerForm();
	},

	createMouseTooltip: function() {
		if (!this.options.showTooltip) return;
		
		var mouseTooltip = this.options.mouseTooltip = L.DomUtil.create('div', 'leaflet-styleeditor-mouseTooltip', document.body);
		mouseTooltip.innerHTML = 'Click on the element you want to style';
		L.DomEvent.addListener(window, 'mousemove', this.moveMouseTooltip, this);

		// hide by default
		this.options.mouseTooltip.style.top = -9999 + 'px';

		// set cursor
		this.setCursor();
		
	},

	removeMouseTooltip: function() {
		L.DomEvent.removeListener(window, 'mousemove', this.moveMouseTooltip);
		if (this.options.mouseTooltip && this.options.mouseTooltip.parentNode) {
			this.options.mouseTooltip.parentNode.removeChild(this.options.mouseTooltip);
		}

		// revert cursor
		this.revertCursor();
	},

	setCursor : function () {
		var leafletContainer = this.options.map.getContainer();
		// var overlayPane = this.options.map.getPanes().overlayPane;
		L.DomUtil.addClass(leafletContainer, 'defaultCursor');//.style.cursor = 'default';
		// L.DomUtil.addClass(overlayPane, 'defaultCursor');//.style.cursor = 'default';
		// overlayPane.style.cursor = 'default';	// doens't work
	},

	revertCursor : function () {
		var leafletContainer = this.options.map.getContainer();
		// var overlayPane = this.options.map.getPanes().overlayPane;
		L.DomUtil.removeClass(leafletContainer, 'defaultCursor');
		// L.DomUtil.removeClass(overlayPane, 'defaultCursor');
	},

	moveMouseTooltip: function(e) {
		var x = e.clientX,
			y = e.clientY;
		this.options.mouseTooltip.style.top = (y + this.options.tooltipOffset.y) + 'px';
		this.options.mouseTooltip.style.left = (x + this.options.tooltipOffset.x) + 'px';
	}


});

L.control.styleEditor = function(options) {
	return new L.Control.StyleEditor(options);
};
