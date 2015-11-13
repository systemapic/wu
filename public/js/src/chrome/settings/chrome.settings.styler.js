Wu.Chrome.SettingsContent.Styler = Wu.Chrome.SettingsContent.extend({

	_carto : {},

	options : {
		dropdown : {
			staticText : 'Fixed value',
			staticDivider : '-'
		}
	},

	_initialize : function () {

		// init container
		this._initContainer();

		// add events
		this._addEvents();

		// shortcut
		this._shortcut();
	},
	
	_shortcut : function () {
		app.Tools = app.Tools || {};
		app.Tools.Styler = this;
	},

	_initContainer : function () {

		// create container
		this._container = Wu.DomUtil.create('div', 'chrome chrome-content chrome-pane styler', this.options.appendTo);
	},

	_initLayout : function () {

		if (!this._project) return;

		// Scroller
		this._midSection 	= Wu.DomUtil.create('div', 'chrome-middle-section', this._container);
		this._midOuterScroller 	= Wu.DomUtil.create('div', 'chrome-middle-section-outer-scroller', this._midSection);		
		this._midInnerScroller 	= Wu.DomUtil.create('div', 'chrome-middle-section-inner-scroller', this._midOuterScroller);

		// active layer
		this.layerSelector = this._initLayout_activeLayers(false, false, this._midInnerScroller); // appending to this._midSection

		// Create field wrapper
		this._fieldsWrapper = Wu.DomUtil.create('div', 'chrome-field-wrapper', this._midInnerScroller);

		// mark inited
		this._inited = true;
	},

	_initStyle : function () {

		this.getLayerMeta();

		var options = {
			carto 	: this._carto,
			layer 	: this._layer,
			project : this._project,
			styler 	: this,
			meta 	: this._meta,
			columns : this._columns,
			container : this._fieldsWrapper,
		}

		// create point styler
		var pointStyler = new Wu.Styler.Point(options);

		// create polygon styler
		var polygonStyler = new Wu.Styler.Polygon(options);

		// create line styler
		var lineStyler = new Wu.Styler.Line(options);

	},	
	
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
		
		// Enable settings from layer we're working with
		var layerUuid = this._getActiveLayerUuid();
		if (layerUuid) this._selectedActiveLayer(false, layerUuid);		

		// Select layer we're working on
		var options = this.layerSelector.childNodes;
		for (var k in options) {
			if (options[k].value == layerUuid) options[k].selected = true;
		}
	},

	closed : function () {

		// clean up
		this._tempRemoveLayers();
	},	


	// event run when layer selected 
	_selectedActiveLayer : function (e, uuid) {

		// clear wrapper content
		this._fieldsWrapper.innerHTML = '';

		// get layer_id
		this.layerUuid = uuid ? uuid : e.target.value

		// get layer
		this._layer = this._project.getLayer(this.layerUuid);

		// return if no layer
		if (!this._layer) return;

		// remember layer for other tabs
		this._storeActiveLayerUuid(this.layerUuid);		

		// get current style, returns default if none
		var style = this._layer.getStyling();

		// define tab
		this.tabindex = 1;

		// set local cartoJSON
		this._carto = style || {};

		// init style json
		this._initStyle();

		// Add temp layer
		this._tempaddLayer();
	},

	
	// Get all metafields	
	getLayerMeta : function () {

		// Get layer
		var layer = this._project.getLayer(this.layerUuid);

		// Get stored tooltip meta
		var tooltipMeta = layer.getTooltip();
		
		// Get layermeta
		var layerMeta = layer.getMeta();

		// Get columns
		this._columns = layerMeta.columns;

		// remove _columns key
		this._columns._columns = null;
		delete this._columns._columns;

		// get metafields
		this._meta = [this.options.dropdown.staticText, this.options.dropdown.staticDivider];

		// add non-date items
		for (var k in this._columns) {
			var isDate = this._validateDateFormat(k);
			if (!isDate) this._meta.push(k);
		}
	},

	createCarto : function (json, callback) {

		var options = {
			style : json,
			columns : this._columns
		}

		// get carto from server
		Wu.post('/api/geo/json2carto', JSON.stringify(options), callback.bind(this), this);
	},

});
