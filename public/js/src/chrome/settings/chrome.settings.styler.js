Wu.Chrome.SettingsContent.Styler = Wu.Chrome.SettingsContent.extend({

	_initialize : function () {

		// init container
		this._initContainer();

		// add events
		this._addEvents();

		// shortcut
		this._addShortcut();
	},

	cartoJSON : {},

	options : {
		dropdown : {
			staticText : 'Fixed value',
			staticDivider : '-'
		}
	},

	_addShortcut : function () {
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

		// mark as inited
		this._inited = true;
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
		if ( layerUuid ) this._selectedActiveLayer(false, layerUuid);		

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

		// get layer
		this.layerUuid = uuid ? uuid : e.target.value
		this._layer = this._project.getLayer(this.layerUuid);

		if (!this._layer) return;

		// Store uuid of layer we're working with
		this._storeActiveLayerUuid(this.layerUuid);		

		// get current style, returns default if none
		var style = this._layer.getStyling();

		console.log('cartJONS style', style);

		// define tab
		this.tabindex = 1;

		// set local cartoJSON
		this.cartoJSON = style || {};

		// init style json
		this._initStyle();

		// Add temp layer
		this._tempaddLayer();
	},

	_closeColorRangeSelector : function () {

		var key = 'colorrange';

		var rangeSelector = Wu.DomUtil.get('chrome-color-selector-wrapper-' + key);
		var clickCatcher  = Wu.DomUtil.get('click-catcher-' + key);

		if (rangeSelector) Wu.DomUtil.addClass(rangeSelector, 'displayNone');
		if (clickCatcher) Wu.DomUtil.addClass(clickCatcher, 'displayNone');		
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
		this.columns = layerMeta.columns;

		// get metafields
		this.metaFields = [this.options.dropdown.staticText, this.options.dropdown.staticDivider];

		// add non-date items
		for (var k in this.columns) {
			var isDate = this._validateDateFormat(k);
			if (!isDate) this.metaFields.push(k);
		}
	},

	_initStyle : function () {

		// set meta
		this.getLayerMeta();

		// init containers
		this._createPointContainer();
		this._createPolygonContainer();
		// this.initLine();

	},	


	// polygon container switch
	_createPolygonContainer : function () {

		// Create JSON obj if it's not already there
		this.cartoJSON.polygon = this.cartoJSON.polygon || {};

		// Get on/off state
		var isOn = this.cartoJSON.polygon.enabled ? true : false;

		// Create wrapper
		this._polygonSectionWrapper = Wu.DomUtil.create('div', 'chrome-content-section-wrapper', this._fieldsWrapper)

		// wrapper
		var line = new Wu.fieldLine({
			id           : 'polygon',
			appendTo     : this._polygonSectionWrapper,
			title        : '<b>Polygon</b>',
			input        : false,
		});	

		console.log('line: ', line);	

		// switch button
		var button = new Wu.button({
			id 	     : 'polygon',
			type 	     : 'switch',
			isOn 	     : isOn,
			right 	     : true,
			appendTo     : line.container,
			fn 	     : this._onPolygonSwitch.bind(this), // onSwitch
		});

		console.log('button: ', button);

		// toggle 
		this._togglePolygonContainer(isOn, 'polygon');

	},

	// point container switch
	_createPointContainer : function () {

		// Create JSON obj if it's not already there
		this.cartoJSON.point = this.cartoJSON.point || {};

		// Get on/off state
		var isOn = this.cartoJSON.point.enabled ? true : false;

		// Create wrapper
		this._pointSectionWrapper = Wu.DomUtil.create('div', 'chrome-content-section-wrapper', this._fieldsWrapper)

		// wrapper
		var line = new Wu.fieldLine({
			id           : 'point',
			appendTo     : this._pointSectionWrapper,
			title        : '<b>Point</b>',
			input        : false,
		});		

		// switch button
		var button = new Wu.button({
			id 	     : 'point',
			type 	     : 'switch',
			isOn 	     : isOn,
			right 	     : true,
			appendTo     : line.container,
			fn 	     : this._onPointSwitch.bind(this), // onSwitch
		});

		// toggle
		this._togglePointContainer(isOn, 'point');

	},

	_onPolygonSwitch : function (e, on) {

		// toggle
		this._togglePolygonContainer(on, 'polygon');

		// update
		this._updateStyle();
	},

	_onPointSwitch : function (e, on) {

		// toggle
		this._togglePointContainer(on, 'point');

		// update
		this._updateStyle();
	},

	// creates content of point container
	initPolygonOptions : function (sectionWrapper) {

		// color
		this.initPolygonOptionColor(sectionWrapper);

		// opacity
		this.initPolygonOptionOpacity(sectionWrapper);

		// lines
		// this.initPolygonOptionOpacity(sectionWrapper);

		// add (+) button
		this._createPolygonPlusButton(sectionWrapper);

	},

	_createPolygonPlusButton : function (sectionWrapper) {
		if (this._polygonPlusButton) Wu.DomUtil.remove(this._polygonPlusButton);

		var button = this._polygonPlusButton = Wu.DomUtil.create('div', 'styler-plus-button', sectionWrapper, '+');

		Wu.DomEvent.on(button, 'click', function () {
			console.log('plus button');
		}, this);

	},

	// INIT COLOR
	initPolygonOptionColor : function (sectionWrapper) {

		var key = 'color';

		// Create JSON obj if it's not already there
		if ( !this.cartoJSON.polygon[key] ) this.cartoJSON.polygon[key] = {};

		var defaultRange = ['#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff'];

		// Get stores states
		var isOn         = this.cartoJSON.polygon[key].range ? false : true;
		var staticVal    = this.cartoJSON.polygon[key].staticVal ? this.cartoJSON.polygon[key].staticVal : '#FF33FF';
		var val          = this.cartoJSON.polygon[key].value ? this.cartoJSON.polygon[key].value : defaultRange;
		var range        = this.cartoJSON.polygon[key].range ? this.cartoJSON.polygon[key].range : false;
		var minMax       = this.cartoJSON.polygon[key].minMax ? this.cartoJSON.polygon[key].minMax : false;
		var customMinMax = this.cartoJSON.polygon[key].customMinMax ? this.cartoJSON.polygon[key].customMinMax : false;

		// Container
		var colorLine = new Wu.fieldLine({
			id           : 'color',
			appendTo     : sectionWrapper,
			title        : '<b>Color</b>',
			input        : false,
			childWrapper : 'point-color-children'
		});	

		console.log('colorLine', colorLine);

		// Dropdown
		var colorDropDown = new Wu.button({
			id 	 : 'color',
			type 	 : 'dropdown',
			isOn 	 : isOn,
			right 	 : true,
			appendTo : colorLine.container,
			fn 	 : this._selectedMiniDropDown.bind(this),
			array 	 : this.metaFields, // columns in dropdown
			selected : range, // preselected item
		});

		// Color selector
		var colorBall = new Wu.button({
			id 	 : 'color',
			type 	 : 'colorball',
			right    : true,
			isOn 	 : isOn,
			appendTo : colorLine.container,
			fn       : this._updateColorBallPolygon.bind(this),
			value    : staticVal,
		})



		// SAVE JSON // remember preset locally
		this.cartoJSON.polygon[key] = {
			range 	     : range,
			minMax 	     : minMax,
			customMinMax : customMinMax,
			staticVal    : staticVal,
			value 	     : val
		};
	},

	// INIT OPACITY
	initPolygonOptionOpacity : function (sectionWrapper) {

		var key = 'opacity';

		// Create JSON obj if it's not already there
		if ( !this.cartoJSON.polygon[key] ) this.cartoJSON.polygon[key] = {};

		// Get stores states
		var isOn   = this.cartoJSON.polygon[key].range ? false : true;
		var val    = this.cartoJSON.polygon[key].value ? this.cartoJSON.polygon[key].value : 1;
		var range  = this.cartoJSON.polygon[key].range ? this.cartoJSON.polygon[key].range : false;	

		// Container
		var _opacityLine = new Wu.fieldLine({
			id       : 'opacity',
			appendTo : sectionWrapper,
			title    : '<b>Opacity</b>',
			input    : false,
		});	

		// Dropdown
		var _opacityDropDown = new Wu.button({
			id 	 : 'opacity',
			type 	 : 'dropdown',
			right 	 : true,
			appendTo : _opacityLine.container,
			fn 	 : this._selectedMiniDropDown.bind(this),
			array 	 : this.metaFields,
			selected : range,
			layers   : this._project.getPostGISLayers()
		});

		// Input
		var _opacityInput = new Wu.button({
			id 	    : 'opacity',
			type 	    : 'miniInput',
			right 	    : true,
			isOn        : isOn,
			appendTo    : _opacityLine.container,
			value       : val,
			placeholder : 'auto',
			tabindex    : this.tabindex++,
			fn 	    : this._savePolygonOpacityFromBlur.bind(this), // blur event, not click
		});

		// SAVE JSON
		this.cartoJSON.polygon[key] = {
			range 	    : range,
			value 	    : val
		};
	},


	// creates content of point container
	initPointOptions : function (sectionWrapper) {

		// COLOR
		this.initPointOptionColor(sectionWrapper);

		// OPACITY
		this.initPointOptionOpacity(sectionWrapper);

		// POINT SIZE
		this.initPointOptionPointSize(sectionWrapper);
	},

	// INIT COLOR
	initPointOptionColor : function (sectionWrapper) {


		var key = 'color';

		// Create JSON obj if it's not already there
		if ( !this.cartoJSON.point[key] ) this.cartoJSON.point[key] = {};

		var defaultRange = ['#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff'];

		// Get stores states
		var isOn         = this.cartoJSON.point[key].range ? false : true;
		var staticVal    = this.cartoJSON.point[key].staticVal ? this.cartoJSON.point[key].staticVal : '#FF33FF';
		var val          = this.cartoJSON.point[key].value ? this.cartoJSON.point[key].value : defaultRange;
		var range        = this.cartoJSON.point[key].range ? this.cartoJSON.point[key].range : false;
		var minMax       = this.cartoJSON.point[key].minMax ? this.cartoJSON.point[key].minMax : false;
		var customMinMax = this.cartoJSON.point[key].customMinMax ? this.cartoJSON.point[key].customMinMax : false;

		// Container
		var _colorLine = new Wu.fieldLine({
			id           : 'color',
			appendTo     : sectionWrapper,
			title        : '<b>Color</b>',
			input        : false,
			childWrapper : 'point-color-children'
		});	

		console.log('_colorLine', _colorLine);

		// Dropdown
		var _colorDropDown = new Wu.button({
			id 	 : 'color',
			type 	 : 'dropdown',
			isOn 	 : isOn,
			right 	 : true,
			appendTo : _colorLine.container,
			fn 	 : this._selectedMiniDropDown.bind(this),
			array 	 : this.metaFields, // columns in dropdown
			selected : range, // preselected item
		});

		// Color selector
		var _colorBall = new Wu.button({
			id 	 : 'color',
			type 	 : 'colorball',
			right    : true,
			isOn 	 : isOn,
			appendTo : _colorLine.container,
			fn       : this._updateColorBallPoint.bind(this),
			value    : staticVal,
		});

		// SAVE JSON // remember preset locally
		this.cartoJSON.point[key] = {
			range 	     : range,
			minMax 	     : minMax,
			customMinMax : customMinMax,
			staticVal    : staticVal,
			value 	     : val
		};
	},

	// INIT OPACITY
	initPointOptionOpacity : function (sectionWrapper) {

		var key = 'opacity';

		// Create JSON obj if it's not already there
		if ( !this.cartoJSON.point[key] ) this.cartoJSON.point[key] = {};

		// Get stores states
		var isOn   = this.cartoJSON.point[key].range ? false : true;
		var val    = this.cartoJSON.point[key].value ? this.cartoJSON.point[key].value : 1;
		var range  = this.cartoJSON.point[key].range ? this.cartoJSON.point[key].range : false;	

		// Container
		var _opacityLine = new Wu.fieldLine({
			id       : 'opacity',
			appendTo : sectionWrapper,
			title    : '<b>Opacity</b>',
			input    : false,
		});	

		// Dropdown
		var _opacityDropDown = new Wu.button({
			id 	 : 'opacity',
			type 	 : 'dropdown',
			right 	 : true,
			appendTo : _opacityLine.container,
			fn 	 : this._selectedMiniDropDown.bind(this),
			array 	 : this.metaFields,
			selected : range,
			layers   : this._project.getPostGISLayers()
		});


		// Input
		var _opacityInput = new Wu.button({
			id 	    : 'opacity',
			type 	    : 'miniInput',
			right 	    : true,
			isOn        : isOn,
			appendTo    : _opacityLine.container,
			value       : val,
			placeholder : 'auto',
			tabindex    : this.tabindex++,
			fn 	    : this._savePointOpacityFromBlur.bind(this), // blur event, not click
		});


		// SAVE JSON
		this.cartoJSON.point[key] = {
			range 	    : range,
			value 	    : val
		};
	},
	
	// INIT POINT SIZE
	initPointOptionPointSize : function (sectionWrapper) {

		// Create JSON obj if it's not already there
		if ( !this.cartoJSON.point.pointsize ) this.cartoJSON.point.pointsize = {};

		// Get stores states
		var isOn   = this.cartoJSON.point.pointsize.range ? false : true;
		var val    = this.cartoJSON.point.pointsize.value ? this.cartoJSON.point.pointsize.value : 1.2;
		var range  = this.cartoJSON.point.pointsize.range ? this.cartoJSON.point.pointsize.range : false;
		var minMax = this.cartoJSON.point.pointsize.minMax ? this.cartoJSON.point.pointsize.minMax : false;

		// Container
		var _pointSizeLine = new Wu.fieldLine({
			id           : 'pointsize',
			appendTo     : sectionWrapper,
			title        : '<b>Point size</b>',
			input        : false,
			childWrapper : 'point-size-children'
		});	

		// Dropdown
		var _opacityDropDown = new Wu.button({
			id 	 : 'pointsize',
			type 	 : 'dropdown',
			right 	 : true,
			appendTo : _pointSizeLine.container,
			fn 	 : this._selectedMiniDropDown.bind(this),
			array 	 : this.metaFields,
			selected : range,
			layers   : this._project.getPostGISLayers()
		});

		// Input
		var _opacityInput = new Wu.button({
			id 	    : 'pointsize',
			type 	    : 'miniInput',
			right 	    : true,
			isOn        : isOn,
			appendTo    : _pointSizeLine.container,
			value       : val,
			placeholder : 'auto',
			tabindex    : this.tabindex++,
			fn 	    : this._savePointSizeFromBlur.bind(this),
		});


		// SAVE JSON
		this.cartoJSON.point[key] = {
			range 	    : range,
			minMax 	    : minMax,			
			value 	    : val
		};
	},

	// CLEAR POINT OPTIONS  (on toggle close (point switch))
	clearPointOptions : function () {

		var colorWrapper      = Wu.DomUtil.get('field_wrapper_color');
		var colorChildren     = Wu.DomUtil.get('point-color-children')
		var opacityWrapper    = Wu.DomUtil.get('field_wrapper_opacity');
		var pointsizeWrapper  = Wu.DomUtil.get('field_wrapper_pointsize');
		var pointsizeChildren = Wu.DomUtil.get('point-size-children')
		
		if ( colorWrapper )      colorWrapper.remove();
		if ( colorChildren )     colorChildren.remove();
		if ( opacityWrapper )    opacityWrapper.remove();
		if ( pointsizeWrapper )  pointsizeWrapper.remove();
		if ( pointsizeChildren ) pointsizeChildren.remove();
	},

	clearPolygonOptions : function () {

		return console.log('clearPolygonOptions');

		var colorWrapper      = Wu.DomUtil.get('field_wrapper_color');
		var colorChildren     = Wu.DomUtil.get('point-color-children')
		var opacityWrapper    = Wu.DomUtil.get('field_wrapper_opacity');
		var pointsizeWrapper  = Wu.DomUtil.get('field_wrapper_pointsize');
		var pointsizeChildren = Wu.DomUtil.get('point-size-children')
		
		if ( colorWrapper )      colorWrapper.remove();
		if ( colorChildren )     colorChildren.remove();
		if ( opacityWrapper )    opacityWrapper.remove();
		if ( pointsizeWrapper )  pointsizeWrapper.remove();
		if ( pointsizeChildren ) pointsizeChildren.remove();
	},



	// INIT OPEN FIELDS
	// INIT OPEN FIELDS
	// INIT OPEN FIELDS

	// run when toggling point switch on
	initOpenFields : function (options, key) {

		if ( key == 'color' )     this._initColorFields(options, key);
		if ( key == 'pointsize' ) this._initPointSizeFields(options, key);
	},

	_initColorFields : function(options, key) {

		var colorRange = options.colorRange;

		if ( !colorRange ) return;
		if ( colorRange == this.options.dropdown.staticText )    return;
		if ( colorRange == this.options.dropdown.staticDivider ) return;
		
		var fieldName = colorRange;

		this.addExtraFields(key, fieldName);

	},

	_initPointSizeFields : function (options, key) {		

		var pointSizeRange = options.pointSizeRange;

		if ( !pointSizeRange ) 	return;
		if ( pointSizeRange == this.options.dropdown.staticText )    return;
		if ( pointSizeRange == this.options.dropdown.staticDivider ) return;
		
		var fieldName = pointSizeRange;

		this.addExtraFields(key, fieldName);	
	},

	// SAVERS
	// SAVERS
	// SAVERS		

	// On toggle switch button
	_saveToServer : function (key, title, on) {

		this._togglePointContainer(on, key);

		// UPDATE
		this._updateStyle();
	},


	_enablePoint : function (key) {
		this.cartoJSON[key].enabled = true;
		
		// create point continaer
		this.initPointOptions(this._pointSectionWrapper);

		// opitons for sub menus
		var colorRange = this.cartoJSON[key].color.range ? this.cartoJSON[key].color.range : false;
		var opacityRange = this.cartoJSON[key].opacity.range ? this.cartoJSON[key].color.opacity : false;
		var pointSizeRange = this.cartoJSON[key].pointsize.range ? this.cartoJSON[key].pointsize.range : false;

		var options = {
			colorRange : colorRange,
			opacityRange : opacityRange,
			pointSizeRange : pointSizeRange,
		}
		
		// init subemnus on relevant fields
		this.initOpenFields(options, 'color'); 		
		this.initOpenFields(options, 'pointsize');
	},

	_disablePoint : function (key) {
		this.cartoJSON[key].enabled = false;
		this.clearPointOptions();
	},

	_enablePolygon : function (key) {
		// key = polygon

		// mark enabled for styling
		this.cartoJSON[key].enabled = true;
		
		// create point continaer
		this.initPolygonOptions(this._polygonSectionWrapper);

		// options for sub menus
		var colorRange = this.cartoJSON[key].color.range ? this.cartoJSON[key].color.range : false;
		var opacityRange = this.cartoJSON[key].opacity.range ? this.cartoJSON[key].color.opacity : false;

		var options = {
			colorRange : colorRange,
			opacityRange : opacityRange,
		}
		
		// init subemnus on relevant fields
		this.initOpenFields(options, 'color'); 		
	},

	_disablePolygon : function (key) {
		this.cartoJSON[key].enabled = false;
		this.clearPolygonOptions();
	},

	_togglePointContainer : function (on, key) {
		on ? this._enablePoint(key) : this._disablePoint(key);
	},

	_togglePolygonContainer : function (on, key) {
		on ? this._enablePolygon(key) : this._disablePolygon(key);
	},


	_onUnselectedField : function (key, wrapper) {

		// Make static inputs available
		if (key == 'opacity' || key == 'pointsize') {	
			var miniInput = Wu.DomUtil.get('field_mini_input_' + key);	
			Wu.DomUtil.removeClass(miniInput, 'left-mini-kill');
			this.cleanUpExtraFields(key);
		}

		// Make static color available
		if (key == 'color') {
			var colorBall = Wu.DomUtil.get('color_ball_color');
			Wu.DomUtil.removeClass(colorBall, 'disable-color-ball');
			this.cleanUpExtraFields(key);
		}

		// save style
		this.cartoJSON.point[key].range = false;

		// refresh
		this._updateStyle();

		// adjust width
		Wu.DomUtil.removeClass(wrapper, 'full-width');

	},

	_onSelectedField : function (key, wrapper, field) {

		// add class
		Wu.DomUtil.addClass(wrapper, 'full-width');

		// DISABLE mini input fields
		if ( key == 'opacity' || key == 'pointsize' ) {
			var miniInput = Wu.DomUtil.get('field_mini_input_' + key);
			Wu.DomUtil.addClass(miniInput, 'left-mini-kill');
		}

		// DISABLE static color ball
		if ( key == 'color' ) {
			var colorBall = Wu.DomUtil.get('color_ball_color');
			Wu.DomUtil.addClass(colorBall, 'disable-color-ball');
		}

		// SAVE JSON
		this.cartoJSON.point[key].range = field; // range == column

		// Add fields
		this.addExtraFields(key, field); // sub meny

		// UPDATE
		this._updateStyle();

	},

	// ON SELECT MINI DROP DOWN
	_selectedMiniDropDown : function (e) {

		var key = e.target.getAttribute('key');
		var field = e.target.value;
		var wrapper = e.target.parentElement;

		// check if selected item is placeholders
		var isStatic = (field == this.options.dropdown.staticText);
		var isDivider = (field == this.options.dropdown.staticDivider);

		// check if field is selected
		if (isStatic || isDivider) {
			
			// unselect
			this._onUnselectedField(key, wrapper);

		} else {

			// select 
			this._onSelectedField(key, wrapper, field);
		}
	},

	_savePointOpacityFromBlur : function (e) {

		var value = parseFloat(e.target.value);
		var key   = e.target.id.slice(17, e.target.id.length);
		var pre = key.substring(0,4);


		if (pre == 'min_' || pre == 'max_') {
			key = key.slice(4, key.length);
		}

		// Get field 
		var inputField = Wu.DomUtil.get('field_mini_input_opacity');


		// If more than one, make it one
		if ( value > 1  && value < 10  ) value = 1;
		if ( value > 10 && value < 100 ) value = value/100;
		if ( value > 100 ) 	         value = 1;
		

		// Set value in input
		inputField.value = value;

		// Do not save if value is unchanged
		if ( this.cartoJSON.point[key].value == value ) return;

		// Store in json
		this.cartoJSON.point[key].value = value;


		this._updateStyle();
		
	},

	_savePolygonOpacityFromBlur : function (e) {

		var value = parseFloat(e.target.value);
		var key   = e.target.id.slice(17, e.target.id.length);
		
		var pre = key.substring(0,4);

		if ( pre == 'min_' || pre == 'max_' ) {
			key = key.slice(4, key.length);
		}

		// Get field 
		var inputField = Wu.DomUtil.get('field_mini_input_opacity');


		// If more than one, make it one
		if ( value > 1  && value < 10  ) value = 1;
		if ( value > 10 && value < 100 ) value = value/100;
		if ( value > 100 ) 	         value = 1;
		

		// Set value in input
		inputField.value = value;

		// Do not save if value is unchanged
		if (this.cartoJSON.polygon[key].value == value) return;

		// Store in json
		this.cartoJSON.polygon[key].value = value;

		this._updateStyle();
		
	},

	_savePointSizeFromBlur : function (e) {

		var value = parseFloat(e.target.value);
		var key   = e.target.id.slice(17, e.target.id.length);
		
		var pre = key.substring(0,4);

		if ( pre == 'min_' || pre == 'max_' ) {
			key = key.slice(4, key.length);
		}

		// Get field 
		var inputField = Wu.DomUtil.get('field_mini_input_pointsize');

		// If less than 0.5, make it 0.5
		if ( value < 0.5 ) value = 0.5;

		// Set value in input
		inputField.value = value;

		// Do not save if value is unchanged
		if ( this.cartoJSON.point[key].value == value ) return;

		// Stors in json
		this.cartoJSON.point[key].value = value;

		this._updateStyle();

	},

	// point only
	_updateColorBallPoint : function (hex, key, wrapper) {

		// Store
		this.cartoJSON.point[key].staticVal = hex;
		
		// Close
		this._closeColorRangeSelector();

		// UPDATE
		this._updateStyle();		
	},

	// point only
	_updateColorBallPolygon : function (hex, key, wrapper) {

		// Store
		this.cartoJSON.polygon[key].staticVal = hex;
		
		// Close
		this._closeColorRangeSelector();

		// UPDATE
		this._updateStyle();		
	},

	// on color preset color ball selection
	updateColorRange : function (hex, key, wrapper) {

		var colorBall_1 = Wu.DomUtil.get('color-range-ball-1-' + key);
		var colorBall_2 = Wu.DomUtil.get('color-range-ball-2-' + key);
		var colorBall_3 = Wu.DomUtil.get('color-range-ball-3-' + key);

		// Set HEX value on ball we've changed
		wrapper.setAttribute('hex', hex);

		// Get color values
		var color1 = colorBall_1.getAttribute('hex');
		var color2 = colorBall_2.getAttribute('hex');
		var color3 = colorBall_3.getAttribute('hex');

		// Build color array
		var colors = this.convertToFiveColors([color1, color2, color3]);

		// Color range bar
		var colorRangeBar = Wu.DomUtil.get('chrome-color-range_' + key);

		// Set styling
		var gradientStyle = this._gradientStyle(colors);

		colorRangeBar.setAttribute('style', gradientStyle);

		// Do not save if value is unchanged
		if ( this.cartoJSON.point.color.value == colors ) return;

		// Store in JSON
		this.cartoJSON.point.color.value = colors;

		this._closeColorRangeSelector(); // close popup

		// UPDATE
		this._updateStyle();

	},

	// on click on color range presets
	selectColorPreset : function (e) {

		var elem = e.target;
		var hex = elem.getAttribute('hex');
		var hexArray = hex.split(',');

		// Five colors
		var colorArray = this.convertToFiveColors(hexArray);

		// Color range bar
		var colorRangeBar = Wu.DomUtil.get('chrome-color-range_colorrange');

		// Set styling		
		var gradientStyle = this._gradientStyle(colorArray);

		// Set style on colorrange bar
		colorRangeBar.setAttribute('style', gradientStyle);


		// Update color balls
		var colorBall_1 = Wu.DomUtil.get('color-range-ball-1-colorrange');
		    colorBall_1.style.background = colorArray[0];
		    colorBall_1.setAttribute('hex', colorArray[0]);

		var colorBall_2 = Wu.DomUtil.get('color-range-ball-2-colorrange');
		    colorBall_2.style.background = colorArray[2];
		    colorBall_2.setAttribute('hex', colorArray[2]);

		var colorBall_3 = Wu.DomUtil.get('color-range-ball-3-colorrange');
		    colorBall_3.style.background = colorArray[4];
		    colorBall_3.setAttribute('hex', colorArray[4]);


		this._closeColorRangeSelector();

		// Do not save if value is unchanged
		if ( this.cartoJSON.point.color.value[0] == colorArray[0] &&
		     this.cartoJSON.point.color.value[1] == colorArray[1] && 
		     this.cartoJSON.point.color.value[2] == colorArray[2] &&
		     this.cartoJSON.point.color.value[3] == colorArray[3] &&
		     this.cartoJSON.point.color.value[4] == colorArray[4] ) {

			return;
		}

		// Store in JSON
		this.cartoJSON.point.color.value = colorArray;		

		// UPDATE
		this._updateStyle();		

	},


	convertToFiveColors : function (colorArray) {


		// Make five values from two
		if ( colorArray.length == 2 ) {
			var c1 = colorArray[0];
			var c5 = colorArray[1];

			var c3 = this.hexAverage([c1, c5]);

			var c2 = this.hexAverage([c1, c3]);
			var c4 = this.hexAverage([c3, c5]);

			colorArray = [c1, c2, c3, c4, c5];
		}


		// Make five from three
		if ( colorArray.length == 3 ) {

			var c1 = colorArray[0];
			var c3 = colorArray[1];
			var c5 = colorArray[2];

			var c2 = this.hexAverage([c1, c3]);
			var c4 = this.hexAverage([c3, c5]);

			colorArray = [c1, c2, c3, c4, c5];

		}

		if ( colorArray.length == 4 ) {
			colorArray = ['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff'];
		}

		return colorArray;

	},


	// ADD EXTRA FIELDS
	// ADD EXTRA FIELDS
	// ADD EXTRA FIELDS
 
	// INIT ADD EXTRA FIELDS, // add submenus to sub
	addExtraFields : function (key, fieldName) {

		// ADD COLOR FIELDS
		if ( key == 'color' ) this.addColorFields(key, fieldName);
		
		// ADD POINT SIZE FIELDS
		if ( key == 'pointsize') this.addPointSizeFields(key, fieldName);
	},

	// ADD COLOR FIELDS (color preset, color min/max)
	addColorFields : function (key, fieldName) {

		console.log('');
		console.log('addColorFields', key);

		var defaultRange = ['#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff'];
		var value  = this.cartoJSON.point[key].value ? this.cartoJSON.point[key].value : defaultRange;

		if (!_.isArray(value)) return; // if not array, it's 'fixed' selection

		// Get wrapper
		var childWrapper = Wu.DomUtil.get('point-color-children');

		// UPDATE MIN/MAX IF IT'S ALREADY OPEN
		// UPDATE MIN/MAX IF IT'S ALREADY OPEN	
		// UPDATE MIN/MAX IF IT'S ALREADY OPEN

		var fieldMaxRange = Math.floor(this.columns[fieldName].max * 10) / 10;
		var fieldMinRange = Math.floor(this.columns[fieldName].min * 10) / 10;

		// Do not add if we've already added it! // 
		var minMaxColorRange = Wu.DomUtil.get('field_wrapper_minmaxcolorrange');
		
		// update instead of create
		if ( minMaxColorRange ) {
		
			var max = Wu.DomUtil.get('field_mini_input_max_minmaxcolorrange');
			var min = Wu.DomUtil.get('field_mini_input_min_minmaxcolorrange');
			max.value = fieldMaxRange;
			min.value = fieldMinRange;

			this.cartoJSON.point[key].customMinMax = false;

			return;
		}



		if ( value.length < 5 ) value = this.convertToFiveColors(value);

		// Container
		var _colorRangeLine = new Wu.fieldLine({
			id        : 'colorrange',
			appendTo  : childWrapper,
			title     : 'Color range',
			input     : false,
			className : 'sub-line'
		});


		
		// Dropdown
		var _colorRangePicker = new Wu.button({
			id 	  : 'colorrange',
			type 	  : 'colorrange',
			right 	  : true,
			appendTo  : _colorRangeLine.container,
			presetFn  : this.selectColorPreset.bind(this), // preset selection
			customFn  : this.updateColorRange.bind(this),  // color ball selection
			value     : value
		});
	
		// SAVE JSON
		this.cartoJSON.point[key].range = fieldName;
		this.cartoJSON.point[key].value = value;

		// MIN/MAX
		// MIN/MAX
		// MIN/MAX

		var value  = this.cartoJSON.point[key].customMinMax ? this.cartoJSON.point[key].customMinMax : [fieldMinRange, fieldMaxRange];
		
		// Use placeholder value if empty
		if ( isNaN(value[0]) ) value[0] = fieldMinRange;
		if ( isNaN(value[1]) ) value[1] = fieldMaxRange;

		// Container
		var _minMaxLine = new Wu.fieldLine({
			id        : 'minmaxcolorrange',
			appendTo  : childWrapper,
			title     : 'Min/max range',
			input     : false,
			className : 'sub-line'
		});

		// Inputs
		var _minMaxInputs = new Wu.button({
			id 	  : 'minmaxcolorrange',
			type 	  : 'dualinput',
			right 	  : true,
			appendTo  : _minMaxLine.container,
			value     : value,
			fn        : this.saveColorRangeDualBlur.bind(this),
			minmax    : [fieldMinRange, fieldMaxRange],
			tabindex  : [this.tabindex++, this.tabindex++]
		});


		// SAVE JSON
		this.cartoJSON.point[key].customMinMax = value;
		this.cartoJSON.point[key].minMax       = [fieldMinRange, fieldMaxRange];
		

	},


	saveColorRangeDualBlur : function (max, min, absoluteMax, absoluteMin) {

		if ( !max ) max = absoluteMax;
		if ( !min ) min = absoluteMin;

		this.cartoJSON.point.color.customMinMax = [min, max];
		this._updateStyle();

	},

	savePointSizeDualBlur : function (max, min, absoluteMax, absoluteMin) {

		if ( !max ) max = absoluteMax;
		if ( !min ) min = absoluteMin;		

		this.cartoJSON.point.pointsize.minMax = [min, max];
		this._updateStyle();

	},

	validateNumber : function (originNo, compareTo, isLess) {
		

		// If number is higher than number it's supposed to 
		// be less than, replace with higher number
		if ( originNo > compareTo && isLess ) originNo = compareTo;

		// If number is lower than number it's supposed to 
		// be more than, replace with lower number
		if ( originNo < compareTo && !isLess ) originNo = compareTo;

		// value = this.validateNumber(value, minVal, false);

		return originNo;

	},

	// ADD POINT SIZE FIELDS // subfields for point size
	addPointSizeFields : function (key, fieldName) {

		// var fieldsWrapper = Wu.DomUtil.get('field_wrapper_pointsize');
		var childWrapper = Wu.DomUtil.get('point-size-children');

		// Do not add if we've already added it!
		var minMaxPointSize = Wu.DomUtil.get('field_wrapper_minmaxpointsize');
		if ( minMaxPointSize ) return;

		var minMax  = this.cartoJSON.point[key].minMax ? this.cartoJSON.point[key].minMax : [1,10];

		var _minMaxPointSize = new Wu.fieldLine({
			id        : 'minmaxpointsize',
			appendTo  : childWrapper,
			title     : 'Min/max point size',
			input     : false,
			className : 'sub-line'
		});


		// Inputs
		var _minMaxPointSizeInputs = new Wu.button({
			id 	  : 'minmaxpointsize',
			type 	  : 'dualinput',
			right 	  : true,
			appendTo  : _minMaxPointSize.container,
			value     : minMax,
			fn        : this.savePointSizeDualBlur.bind(this),
			minmax    : minMax,
			tabindex  : [this.tabindex++, this.tabindex++]
		});


		// SAVE JSON
		this.cartoJSON.point[key].range  = fieldName;
		this.cartoJSON.point[key].minMax = minMax;

	},

	// CLEAN UP EXTRA FIELDS
	cleanUpExtraFields : function (key) {

		if ( key == 'pointsize' ) {
			var minMaxPointSize = Wu.DomUtil.get('field_wrapper_minmaxpointsize');
			if ( minMaxPointSize ) minMaxPointSize.remove();
		}

		if ( key == 'color' ) {
			var minMaxColorRange = Wu.DomUtil.get('field_wrapper_minmaxcolorrange');
			if ( minMaxColorRange ) minMaxColorRange.remove();

			var colorRange = Wu.DomUtil.get('field_wrapper_colorrange');
			if ( colorRange ) colorRange.remove();
		}		
	},



	getCartoCSSFromJSON : function (json, callback) {

		var options = {
			style : json,
			columns : this.columns
		}

		console.error('getCartoCSSFromJSON', options);


		Wu.post('/api/geo/json2cartocss', JSON.stringify(options), callback.bind(this), this);

	},


	// CARTO CARTO CARTO CARTO
	// CARTO CARTO CARTO CARTO
	// CARTO CARTO CARTO CARTO

	_updateStyle : function () {

		console.log('updateStyle');

		this.getCartoCSSFromJSON(this.cartoJSON, function (ctx, finalCarto) {
			this.saveCartoJSON(finalCarto);
		});

	},


	saveCartoJSON : function (finalCarto) {

		this._layer.setStyling(this.cartoJSON);

		var sql = this._layer.getSQL();

		// request new layer
		var layerOptions = {
			css : finalCarto, 
			sql : sql,
			layer : this._layer
		}

		this._updateLayer(layerOptions);;		

	},


	_updateLayer : function (options, done) {

		var css = options.css,
		    layer = options.layer,
		    file_id = layer.getFileUuid(),
		    sql = options.sql,
		    project = this._project;


		var layerOptions = layer.store.data.postgis;

		layerOptions.sql = sql;
		layerOptions.css = css;
		layerOptions.file_id = file_id;		

		var layerJSON = {
			geom_column: 'the_geom_3857',
			geom_type: 'geometry',
			raster_band: '',
			srid: '',
			affected_tables: '',
			interactivity: '',
			attributes: '',
			access_token: app.tokens.access_token,
			cartocss_version: '2.0.1',
			cartocss : css,
			sql: sql,
			file_id: file_id,
			return_model : true,
			layerUuid : layer.getUuid()
		}

		var that = this;

		// create layer on server
		Wu.post('/api/db/createLayer', JSON.stringify(layerJSON), function (err, newLayerJSON) {

			// new layer
			var newLayerStyle = Wu.parse(newLayerJSON);

			// catch errors
			if (newLayerStyle.error) {
				done && done();
				return console.error(newLayerStyle.error);
			}


			// update layer
			layer.updateStyle(newLayerStyle);

			// return
			done && done();
		}.bind(this));

	},	


});
