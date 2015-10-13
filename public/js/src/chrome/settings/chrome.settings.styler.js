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

		console.log('createCarto options', options, this);

		// get carto from server
		Wu.post('/api/geo/json2carto', JSON.stringify(options), callback.bind(this), this);
	},

	

	// // polygon container switch
	// _createPolygonContainer : function () {

	// 	// Create JSON obj if it's not already there
	// 	this.cartoJSON.polygon = this.cartoJSON.polygon || {};

	// 	// Get on/off state
	// 	var isOn = this.cartoJSON.polygon.enabled ? true : false;

	// 	// Create wrapper
	// 	this._polygonSectionWrapper = Wu.DomUtil.create('div', 'chrome-content-section-wrapper', this._fieldsWrapper)

	// 	// wrapper
	// 	var line = new Wu.fieldLine({
	// 		id           : 'polygon',
	// 		appendTo     : this._polygonSectionWrapper,
	// 		title        : '<b>Polygon</b>',
	// 		input        : false,
	// 	});	

	// 	// switch button
	// 	var button = new Wu.button({
	// 		id 	     : 'polygon',
	// 		type 	     : 'switch',
	// 		isOn 	     : isOn,
	// 		right 	     : true,
	// 		appendTo     : line.container,
	// 		fn 	     : this._onPolygonSwitch.bind(this), // onSwitch
	// 	});

	// 	console.log('button: ', button);

	// 	// toggle 
	// 	this._togglePolygonContainer(isOn, 'polygon');

	// },

	// // creates content of point container
	// initPolygonOptions : function (sectionWrapper) {

	// 	// color
	// 	this.initPolygonOptionColor(sectionWrapper);

	// 	// opacity
	// 	this.initPolygonOptionOpacity(sectionWrapper);

	// 	// lines
	// 	// this.initPolygonOptionOpacity(sectionWrapper);

	// 	// add (+) button
	// 	this._createPolygonPlusButton(sectionWrapper);

	// },

	// _createPolygonPlusButton : function (sectionWrapper) {
	// 	if (this._polygonPlusButton) Wu.DomUtil.remove(this._polygonPlusButton);

	// 	var button = this._polygonPlusButton = Wu.DomUtil.create('div', 'styler-plus-button', sectionWrapper, '+');

	// 	Wu.DomEvent.on(button, 'click', function () {
	// 		console.log('plus button');
	// 	}, this);

	// },

	// // INIT COLOR
	// initPolygonOptionColor : function (sectionWrapper) {

	// 	var key = 'color';

	// 	// Create JSON obj if it's not already there
	// 	if ( !this.cartoJSON.polygon[key] ) this.cartoJSON.polygon[key] = {};

	// 	var defaultRange = ['#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff'];

	// 	// Get stores states
	// 	var isOn         = this.cartoJSON.polygon[key].range ? false : true;
	// 	var staticVal    = this.cartoJSON.polygon[key].staticVal ? this.cartoJSON.polygon[key].staticVal : '#FF33FF';
	// 	var val          = this.cartoJSON.polygon[key].value ? this.cartoJSON.polygon[key].value : defaultRange;
	// 	var range        = this.cartoJSON.polygon[key].range ? this.cartoJSON.polygon[key].range : false;
	// 	var minMax       = this.cartoJSON.polygon[key].minMax ? this.cartoJSON.polygon[key].minMax : false;
	// 	var customMinMax = this.cartoJSON.polygon[key].customMinMax ? this.cartoJSON.polygon[key].customMinMax : false;

	// 	// Container
	// 	var colorLine = new Wu.fieldLine({
	// 		id           : 'color',
	// 		appendTo     : sectionWrapper,
	// 		title        : '<b>Color</b>',
	// 		input        : false,
	// 		childWrapper : 'point-color-children'
	// 	});	

	// 	console.log('colorLine', colorLine);

	// 	// Dropdown
	// 	var colorDropDown = new Wu.button({
	// 		id 	 : 'color',
	// 		type 	 : 'dropdown',
	// 		isOn 	 : isOn,
	// 		right 	 : true,
	// 		appendTo : colorLine.container,
	// 		fn 	 : this._selectedMiniDropDown.bind(this),
	// 		array 	 : this.metaFields, // columns in dropdown
	// 		selected : range, // preselected item
	// 	});

	// 	// Color selector
	// 	var colorBall = new Wu.button({
	// 		id 	 : 'color',
	// 		type 	 : 'colorball',
	// 		right    : true,
	// 		isOn 	 : isOn,
	// 		appendTo : colorLine.container,
	// 		fn       : this._updateColorBallPolygon.bind(this),
	// 		value    : staticVal,
	// 	});

	// 	// SAVE JSON // remember preset locally
	// 	this.cartoJSON.polygon[key] = {
	// 		range 	     : range,
	// 		minMax 	     : minMax,
	// 		customMinMax : customMinMax,
	// 		staticVal    : staticVal,
	// 		value 	     : val
	// 	};
	// },

	// // INIT OPACITY
	// initPolygonOptionOpacity : function (sectionWrapper) {

	// 	var key = 'opacity';

	// 	// Create JSON obj if it's not already there
	// 	if ( !this.cartoJSON.polygon[key] ) this.cartoJSON.polygon[key] = {};

	// 	// Get stores states
	// 	var isOn   = this.cartoJSON.polygon[key].range ? false : true;
	// 	var val    = this.cartoJSON.polygon[key].value ? this.cartoJSON.polygon[key].value : 1;
	// 	var range  = this.cartoJSON.polygon[key].range ? this.cartoJSON.polygon[key].range : false;	

	// 	// Container
	// 	var _opacityLine = new Wu.fieldLine({
	// 		id       : 'opacity',
	// 		appendTo : sectionWrapper,
	// 		title    : '<b>Opacity</b>',
	// 		input    : false,
	// 	});	

	// 	// Dropdown
	// 	var _opacityDropDown = new Wu.button({
	// 		id 	 : 'opacity',
	// 		type 	 : 'dropdown',
	// 		right 	 : true,
	// 		appendTo : _opacityLine.container,
	// 		fn 	 : this._selectedMiniDropDown.bind(this),
	// 		array 	 : this.metaFields,
	// 		selected : range,
	// 		// layers   : this._project.getPostGISLayers()
	// 	});

	// 	// Input
	// 	var _opacityInput = new Wu.button({
	// 		id 	    : 'opacity',
	// 		type 	    : 'miniInput',
	// 		right 	    : true,
	// 		isOn        : isOn,
	// 		appendTo    : _opacityLine.container,
	// 		value       : val,
	// 		placeholder : 'auto',
	// 		tabindex    : this.tabindex++,
	// 		fn 	    : this._savePolygonOpacityFromBlur.bind(this), // blur event, not click
	// 	});

	// 	// SAVE JSON
	// 	this.cartoJSON.polygon[key] = {
	// 		range 	    : range,
	// 		value 	    : val
	// 	};
	// },


	// clearPolygonOptions : function () {

	// 	return console.log('clearPolygonOptions');

	// 	var colorWrapper      = Wu.DomUtil.get('field_wrapper_color');
	// 	var colorChildren     = Wu.DomUtil.get('point-color-children')
	// 	var opacityWrapper    = Wu.DomUtil.get('field_wrapper_opacity');
	// 	var pointsizeWrapper  = Wu.DomUtil.get('field_wrapper_pointsize');
	// 	var pointsizeChildren = Wu.DomUtil.get('point-size-children')
		
	// 	if ( colorWrapper )      colorWrapper.remove();
	// 	if ( colorChildren )     colorChildren.remove();
	// 	if ( opacityWrapper )    opacityWrapper.remove();
	// 	if ( pointsizeWrapper )  pointsizeWrapper.remove();
	// 	if ( pointsizeChildren ) pointsizeChildren.remove();
	// },



	// _enablePolygon : function (key) {
	// 	// key = polygon

	// 	// mark enabled for styling
	// 	this.cartoJSON[key].enabled = true;
		
	// 	// create point continaer
	// 	this.initPolygonOptions(this._polygonSectionWrapper);

	// 	// options for sub menus
	// 	var colorRange = this.cartoJSON[key].color.range ? this.cartoJSON[key].color.range : false;
	// 	var opacityRange = this.cartoJSON[key].opacity.range ? this.cartoJSON[key].color.opacity : false;

	// 	var options = {
	// 		colorRange : colorRange,
	// 		opacityRange : opacityRange,
	// 	}
		
	// 	// init subemnus on relevant fields
	// 	this.initOpenFields(options, 'color'); 		
	// },

	// _disablePolygon : function (key) {
	// 	this.cartoJSON[key].enabled = false;
	// 	this.clearPolygonOptions();
	// },

	// // _togglePointContainer : function (on, key) {
	// // 	on ? this._enablePoint(key) : this._disablePoint(key);
	// // },

	// _togglePolygonContainer : function (on, key) {
	// 	on ? this._enablePolygon(key) : this._disablePolygon(key);
	// },


	// _savePolygonOpacityFromBlur : function (e) {

	// 	var value = parseFloat(e.target.value);
	// 	var key   = e.target.id.slice(17, e.target.id.length);
		
	// 	var pre = key.substring(0,4);

	// 	if ( pre == 'min_' || pre == 'max_' ) {
	// 		key = key.slice(4, key.length);
	// 	}


	// 	// Get field 
	// 	var inputField = Wu.DomUtil.get('field_mini_input_opacity');


	// 	// If more than one, make it one
	// 	if ( value > 1  && value < 10  ) value = 1;
	// 	if ( value > 10 && value < 100 ) value = value/100;
	// 	if ( value > 100 ) 	         value = 1;
		

	// 	// Set value in input
	// 	inputField.value = value;

	// 	// Do not save if value is unchanged
	// 	if (this.cartoJSON.polygon[key].value == value) return;

	// 	// Store in json
	// 	this.cartoJSON.polygon[key].value = value;

	// 	this._updateStyle();
		
	// },


	// _updateColorBallPolygon : function (hex, key, wrapper) {

	// 	// Store
	// 	this.cartoJSON.polygon[key].staticVal = hex;
		
	// 	// Close
	// 	this._closeColorRangeSelector();

	// 	// UPDATE
	// 	this._updateStyle();		
	// },

	


});
