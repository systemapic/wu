Wu.Chrome.SettingsContent.Styler = Wu.Chrome.SettingsContent.extend({

	// UNIVERSALS
	// UNIVERSALS	
	// UNIVERSALS

	cartoJSON : {

	},

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
	},

	_initContainer : function () {

		// create container
		this._container = Wu.DomUtil.create('div', 'chrome chrome-content chrome-pane styler', this.options.appendTo);


	},

	_initLayout : function () {
		if (!this._project) return;

		// Scroller
		this._midSection = Wu.DomUtil.create('div', 'chrome-middle-section', this._container);
		this._midOuterScroller = Wu.DomUtil.create('div', 'chrome-middle-section-outer-scroller', this._midSection);		
		this._midInnerScroller = Wu.DomUtil.create('div', 'chrome-middle-section-inner-scroller', this._midOuterScroller);


		// active layer
		this.layerSelector = this._initLayout_activeLayers(false, false, this._midInnerScroller); // appending to this._midSection

		// Create field wrapper
		this._fieldsWrapper = Wu.DomUtil.create('div', 'chrome-field-wrapper', this._midInnerScroller);

		// Create refresh button at bottom
		this._createRefresh();

		// mark as inited
		this._inited = true;


	},

	_createRefresh : function () {

		// create fixed bottom container
		this._bottomContainer = Wu.DomUtil.create('div', 'chrome-content-bottom-container displayNone', this._container);


		var text = (navigator.platform == 'MacIntel') ? 'Save (⌘-S)' : 'Save (Ctrl-S)';
		this._refreshButton = Wu.DomUtil.create('div', 'chrome-right-big-button', this._bottomContainer, text);

		Wu.DomEvent.on(this._refreshButton, 'click', this._updateStyle, this);
		Wu.DomEvent.on(this._refreshButton, 'mouseover', this._closeColorRangeSelector, this);
	},	

	
	_refresh : function () {

		console.log('%c _refresh styler', 'background: green; color: white;')

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
		var layerUuid = this._getActiveLayerUiid();
		if ( layerUuid ) this._selectedActiveLayer(false, layerUuid);		

		// Select layer we're working on
		var options = this.layerSelector.childNodes;
		for ( var k in options ) {
			if ( options[k].value == layerUuid ) options[k].selected = true;
		}



	},


	closed : function () {
		// clean up
		this._tempRemoveLayers();
		// this._cleanup();
	},	
	
	// event run when layer selected 
	_selectedActiveLayer : function (e, uuid) {

		this._fieldsWrapper.innerHTML = '';

		this.layerUuid = uuid ? uuid : e.target.value

		this._layer = this._project.getLayer(this.layerUuid);

		// Store uuid of layer we're working with
		this._storeActiveLayerUiid(this.layerUuid);		

		// get current style, returns default if none
		var style = this._layer.getStyling();

		this.tabindex = 1;

		// if ( style ) { 
		// 	this.cartoJSON = style;	
		// } else {
		// 	this.cartoJSON = {};
		// }

		this.cartoJSON = style || {};

		// init style json
		this._initStyle();

		// Add temp layer
		this._tempaddLayer();

		// Display bottom container
		Wu.DomUtil.removeClass(this._bottomContainer, 'displayNone');

		// Pad up scroller
		Wu.DomUtil.addClass(this._midSection, 'middle-section-padding-bottom');
		
	},




	_closeColorRangeSelector : function () {

		var key = 'colorrange';

		var rangeSelector = Wu.DomUtil.get('chrome-color-selector-wrapper-' + key);
		var clickCatcher = Wu.DomUtil.get('click-catcher-' + key);

		if ( rangeSelector ) Wu.DomUtil.addClass(rangeSelector, 'displayNone');
		if ( clickCatcher  ) Wu.DomUtil.addClass(clickCatcher, 'displayNone');		

	},	


	// Get all metafields
	// Get all metafields
	// Get all metafields	

	getLayerMeta : function () {

		// Get layer
		var layer = this._project.getLayer(this.layerUuid);

		// Get stored tooltip meta
		var tooltipMeta = layer.getTooltip();
		
		// Get layermeta
		var layerMeta = JSON.parse(layer.store.metadata)		

		// Get columns
		this.columns = layerMeta.columns;

		this.metaFields = [this.options.dropdown.staticText, this.options.dropdown.staticDivider];

		for ( var k in this.columns ) {

			var isDate = this._validateDateFormat(k);

			if ( !isDate ) {
				this.metaFields.push(k);
			}
		}
	},

	// INIT CONTENT
	// INIT CONTENT
	// INIT CONTENT

	_initStyle : function () {

		this.getLayerMeta();

		this.initPoint();
		// this.initPolygon();
		// this.initLine();
	},	


	// INIT POINT
	// INIT POINT
	// INIT POINT		

	initPoint : function () {


		// Create JSON obj if it's not already there
		if ( !this.cartoJSON.point ) this.cartoJSON.point = {};

		// Get on/off state
		var isOn = this.cartoJSON.point.enabled ? true : false;

		// Create wrapper
		this._pointSectionWrapper = Wu.DomUtil.create('div', 'chrome-content-section-wrapper', this._fieldsWrapper)

		// Create line
		var lineOptions = {
			key 		: 'point',
			wrapper 	: this._pointSectionWrapper,
			input 		: false,
			title 		: '<b>Point</b>',
			isOn 		: isOn,
			rightPos	: false,
			type 		: 'switch'
		}
		this._createMetaFieldLine(lineOptions);


		this._saveToServer('point', '', isOn);

	},



	// INIT POINT OPTIONS
	// INIT POINT OPTIONS
	// INIT POINT OPTIONS

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

		// xoxoxox 

		var defaultRange = ['#ff0000', '#a5ff00', '#003dff'];

		// Get stores states
		var isOn   = this.cartoJSON.point[key].range ? false : true;
		var staticVal = this.cartoJSON.point[key].staticVal ? this.cartoJSON.point[key].staticVal : '#FF33FF';
		var val    = this.cartoJSON.point[key].value ? this.cartoJSON.point[key].value : defaultRange;
		var range  = this.cartoJSON.point[key].range ? this.cartoJSON.point[key].range : false;
		var minMax = this.cartoJSON.point[key].minMax ? this.cartoJSON.point[key].minMax : false;
		var customMinMax = this.cartoJSON.point[key].customMinMax ? this.cartoJSON.point[key].customMinMax : false;

		var lineOptions = {
			key 		: key, 
			wrapper 	: sectionWrapper,
			input 		: false,
			title 		: '<b>Color</b>',
			isOn 		: isOn,
			rightPos	: false,
			type 		: 'color',
			value 		: staticVal,
			dropArray 	: this.metaFields,
			selectedField   : range
		}
		this._createMetaFieldLine(lineOptions);

		// SAVE JSON
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

		var lineOptions = {
			key 		: key,
			wrapper 	: sectionWrapper,
			input 		: false,
			title 		: '<b>Opacity</b>',
			isOn 		: isOn,
			rightPos	: false,
			type 		: 'miniInput',
			value 		: val,
			dropArray 	: this.metaFields,
			selectedField   : range,
			tabindex 	: this.tabindex++
		}
		this._createMetaFieldLine(lineOptions);

		// SAVE JSON
		this.cartoJSON.point[key] = {
			range 	    : range,
			value 	    : val
		};
	},
	
	// INIT POINT SIZE
	initPointOptionPointSize : function (sectionWrapper) {

		var key = 'pointsize';

		// Create JSON obj if it's not already there
		if ( !this.cartoJSON.point[key] ) this.cartoJSON.point[key] = {};

		// Get stores states
		var isOn   = this.cartoJSON.point[key].range ? false : true;
		var val    = this.cartoJSON.point[key].value ? this.cartoJSON.point[key].value : 1.2;
		var range  = this.cartoJSON.point[key].range ? this.cartoJSON.point[key].range : false;
		var minMax = this.cartoJSON.point[key].minMax ? this.cartoJSON.point[key].minMax : false;				

		var lineOptions = {
			key 		: key, 
			wrapper 	: sectionWrapper,
			input 		: false,
			title 		: '<b>Point size</b>',
			isOn 		: isOn,
			rightPos	: false,
			type 		: 'miniInput',
			value 		: val,
			dropArray 	: this.metaFields,
			selectedField   : range,
			tabindex 	: this.tabindex++
		}
		this._createMetaFieldLine(lineOptions);	

		// SAVE JSON
		this.cartoJSON.point[key] = {
			range 	    : range,
			minMax 	    : minMax,			
			value 	    : lineOptions.value
		};
	},

	// CLEAR POINT OPTIONS
	clearPointOptions : function () {

		var colorWrapper     = Wu.DomUtil.get('field_wrapper_color');
		var opacityWrapper   = Wu.DomUtil.get('field_wrapper_opacity');
		var pointsizeWrapper = Wu.DomUtil.get('field_wrapper_pointsize');
		
		if ( colorWrapper ) colorWrapper.remove();
		if ( opacityWrapper ) opacityWrapper.remove();
		if ( pointsizeWrapper ) pointsizeWrapper.remove();
	},



	// INIT OPEN FIELDS
	// INIT OPEN FIELDS
	// INIT OPEN FIELDS

	initOpenFields : function (options, key) {


		// ON LOAD: SHOULD FIELDS BE OPEN OR NOT
		// ON LOAD: SHOULD FIELDS BE OPEN OR NOT
		// ON LOAD: SHOULD FIELDS BE OPEN OR NOT						

		if ( key == 'color' ) {

			var colorRange = options.colorRange;

			if ( !colorRange ) return;
			if ( colorRange == this.options.dropdown.staticText ) return;
			if ( colorRange == this.options.dropdown.staticDivider ) return;
			
			var fieldName = colorRange;

			this.addExtraFields(key, fieldName);

		}

		if ( key == 'pointsize' ) {

			var pointSizeRange = options.pointSizeRange;

			if ( !pointSizeRange ) 	return;
			if ( pointSizeRange == this.options.dropdown.staticText ) return;
			if ( pointSizeRange == this.options.dropdown.staticDivider ) return;
			
			var fieldName = pointSizeRange;

			this.addExtraFields(key, fieldName);			
		}
	},



	// SAVERS
	// SAVERS
	// SAVERS		

	// On toggle switch button
	_saveToServer : function (key, title, on) {

		if ( key == 'point' ) {

			if ( on ) {
				this.cartoJSON[key].enabled = true;
				this.initPointOptions(this._pointSectionWrapper);

				var colorRange = this.cartoJSON[key].color.range ? this.cartoJSON[key].color.range : false;
				var opacityRange = this.cartoJSON[key].opacity.range ? this.cartoJSON[key].color.opacity : false;
				var pointSizeRange = this.cartoJSON[key].pointsize.range ? this.cartoJSON[key].pointsize.range : false;

				var options = {
					colorRange : colorRange,
					opacityRange : opacityRange,
					pointSizeRange : pointSizeRange,
				}
				
				this.initOpenFields(options, 'color');
				this.initOpenFields(options, 'pointsize');

			} else {
				this.cartoJSON[key].enabled = false;
				this.clearPointOptions();				
			}			
		}
	},

	// ON SELECT MINI DROP DOWN
	_selectedMiniDropDown : function (e) {

		var key = e.target.getAttribute('key');
		var fieldName = e.target.value;

		// UNSELECTING FIELD
		// UNSELECTING FIELD
		// UNSELECTING FIELD

		// Clean up if we UNSELECTED field
		if ( fieldName == this.options.dropdown.staticText || fieldName == this.options.dropdown.staticDivider) {
			
			// Make static inputs available
			if ( key == 'opacity' || key == 'pointsize' ) {	
				var miniInput = Wu.DomUtil.get('field_mini_input_' + key);	
				Wu.DomUtil.removeClass(miniInput, 'left-mini-kill');
				this.cleanUpExtraFields(key);
			}

			// Make static color available
			if ( key == 'color' ) {
				var colorBall = Wu.DomUtil.get('color_ball_color');
				Wu.DomUtil.removeClass(colorBall, 'disable-color-ball');
				this.cleanUpExtraFields(key);
			}

			this.cartoJSON.point[key].range = false;

			return;		
		} 			


		// SELECTING FIELD
		// SELECTING FIELD
		// SELECTING FIELD				

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
		this.cartoJSON.point[key].range = fieldName;

		// Add fields
		this.addExtraFields(key, fieldName);
	},

	// ON BLUR IN MINI FIELDS
	saveMiniBlur : function (e) {

		var value = parseFloat(e.target.value);
		var key   = e.target.id.slice(17, e.target.id.length);
		
		var pre = key.substring(0,4);

		if ( pre == 'min_' || pre == 'max_' ) {
			key = key.slice(4, key.length);
		}


		// OPACITY
		// OPACITY
		// OPACITY

		// Save static OPACITY value
		if ( key == 'opacity' ) {

			// Get field 
			var inputField = Wu.DomUtil.get('field_mini_input_opacity');


			// If more than one, make it one
			if ( value > 1  && value < 10  ) value = 1;
			if ( value > 10 && value < 100 ) value = value/100;
			if ( value > 100 ) 	         value = 1;
			

			// Set value in input
			inputField.value = value;

			// Store in json
			this.cartoJSON.point[key].value = value;

		}


		// POINT SIZE
		// POINT SIZE
		// POINT SIZE

		// Save static POINT SIZE value
		if ( key == 'pointsize' ) {

			// Get field 
			var inputField = Wu.DomUtil.get('field_mini_input_pointsize');

			// If less than 0.5, make it 0.5
			if ( value < 0.5 ) value = 0.5;

			// Set value in input
			inputField.value = value;

			// Stors in json
			this.cartoJSON.point[key].value = value;

		}	

		// Save dynamic POINT SIZE values
		if ( key == 'minmaxpointsize' ) {

			var minField = Wu.DomUtil.get('field_mini_input_min_minmaxpointsize');
			var maxField = Wu.DomUtil.get('field_mini_input_max_minmaxpointsize');

			var defaultMin = 1;
			var defaultMax = 10;

			if ( pre == 'min_' ) {

				// If not set, use default min
				if ( isNaN(value) ) value = defaultMin;

				// If less than zero, make it zero
				if ( value < 0 ) value = 0;

				// Get max value
				var maxVal = parseFloat(maxField.value);

				// Make sure min value is not higher than max value
				value = this.validateNumber(value, maxVal, true);

				// Set value in input
				minField.value = value;

				// Stor in json
				this.cartoJSON.point.pointsize.minMax[0] = value;
			
			}

			if ( pre == 'max_' ) {

				// If not set, use default max
				if ( isNaN(value) ) value = defaultMax;

				// If less than 0.5, make it 0.5
				if ( value < 0.5 ) value = 0.5;

				// Get min value
				var minVal = parseFloat(minField.value);

				// Make sure max value is not less than min value
				value = this.validateNumber(value, minVal, false);

				// Set value in input
				maxField.value = value;

				// Store in json
				this.cartoJSON.point.pointsize.minMax[1] = value;	
			}	
		}


		// COLOR RANGE
		// COLOR RANGE
		// COLOR RANGE

		if ( key == 'minmaxcolorrange' ) {

			var maxField = Wu.DomUtil.get('field_mini_input_max_minmaxcolorrange');
			var minField = Wu.DomUtil.get('field_mini_input_min_minmaxcolorrange');			
			
			if ( pre == 'min_' ) {

				// SAVE MIN AND MAX VALUE
				var maxVal = parseFloat(maxField.value);

				if ( isNaN(value)  ) value  = this.cartoJSON.point.color.minMax[0];
				if ( isNaN(maxVal) ) maxVal = this.cartoJSON.point.color.minMax[1];

				value = this.validateNumber(value, maxVal, true);

				minField.value = value;

				this.cartoJSON.point.color.customMinMax = [value, maxVal];
			}

			if ( pre == 'max_' ) {

				// SAVE MIN AND MAX VALUE
				
				var minVal = parseFloat(minField.value);
				
				if ( isNaN(value) )  value = this.cartoJSON.point.color.minMax[1];
				if ( isNaN(minVal) ) minVal = this.cartoJSON.point.color.minMax[0];

				value = this.validateNumber(value, minVal, false);

				maxField.value = value;

				this.cartoJSON.point.color.customMinMax = [minVal, value];
			}			
		}
	},	

	updateColor : function (hex, key, wrapper) {

		// fittepølse
		if ( key == 'color' ) {
			this.cartoJSON.point[key].staticVal = hex;
		}

		if ( key == 'colorrange' ) {
			
			var colorBall_1 = Wu.DomUtil.get('color-range-ball-1-' + key);
			var colorBall_2 = Wu.DomUtil.get('color-range-ball-2-' + key);
			var colorBall_3 = Wu.DomUtil.get('color-range-ball-3-' + key);

			// Litt klønete koding her... 
			// men bakgrunnsfarge blir alltid lest som RGB, 
			// selv om man skriver den som HEX. Burde kanskje
			// hatt en RGB2HEX istedet, men jeg gjorde det nå
			// sånn her i første omgang. Det funker.

			// Set HEX value on ball we've changed
			wrapper.setAttribute('hex', hex);

			// Get color values
			var color1 = colorBall_1.getAttribute('hex');
			var color2 = colorBall_2.getAttribute('hex');
			var color3 = colorBall_3.getAttribute('hex');

			// Build color array
			var colors = [color1, color2, color3];

			// Color range bar
			var colorRangeBar = Wu.DomUtil.get('chrome-color-range_' + key);

			// Set styling
			var gradientStyle = 'background: -webkit-linear-gradient(left, ' + colors.join() + ');';
			gradientStyle    += 'background: -o-linear-gradient(right, '     + colors.join() + ');';
			gradientStyle    += 'background: -moz-linear-gradient(right, '   + colors.join() + ');';
			gradientStyle    += 'background: linear-gradient(to right, '     + colors.join() + ');';			

			colorRangeBar.setAttribute('style', gradientStyle);

			// Store in JSON
			this.cartoJSON.point.color.value = colors;

		}

		this._closeColorRangeSelector();
	},


	// ADD EXTRA FIELDS
	// ADD EXTRA FIELDS
	// ADD EXTRA FIELDS

	// INIT ADD EXTRA FIELDS
	addExtraFields : function (key, fieldName) {

		// ADD COLOR FIELDS
		this.addColorFields(key, fieldName);
		
		// ADD POINT SIZE FIELDS
		this.addPointSizeFields(key, fieldName);
	},

	// ADD COLOR FIELDS
	addColorFields : function (key, fieldName) {


		if ( key == 'color' ) {

			// Get wrapper
			var fieldsWrapper = Wu.DomUtil.get('field_wrapper_color');

			// UPDATE MIN/MAX IF IT'S ALREADY OPEN
			// UPDATE MIN/MAX IF IT'S ALREADY OPEN	
			// UPDATE MIN/MAX IF IT'S ALREADY OPEN

			var fieldMaxRange = Math.floor(this.columns[fieldName].max * 10) / 10;
			var fieldMinRange = Math.floor(this.columns[fieldName].min * 10) / 10;

			// Do not add if we've already added it!
			var minMaxColorRange = Wu.DomUtil.get('field_wrapper_minmaxcolorrange');
			
			if ( minMaxColorRange ) {
			
				var max = Wu.DomUtil.get('field_mini_input_max_minmaxcolorrange');
				var min = Wu.DomUtil.get('field_mini_input_min_minmaxcolorrange');
				max.value = fieldMaxRange;
				min.value = fieldMinRange;

				this.cartoJSON.point[key].customMinMax = false;

				return;
			}

			// COLOR RANGE
			// COLOR RANGE
			// COLOR RANGE

			var defaultRange = ['#ff0000', '#a5ff00', '#003dff'];

			// Get stores states
			var value  = this.cartoJSON.point[key].value ? this.cartoJSON.point[key].value : defaultRange;

			var lineOptions = {
				key 		: 'colorrange', 
				wrapper 	: fieldsWrapper,
				input 		: false,
				title 		: 'Color range',
				isOn 		: false,
				rightPos	: true,
				type 		: 'colorrange',
				value 		: value
			}
			this._createMetaFieldLine(lineOptions);	
		
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


			var lineOptions = {
				key 		: 'minmaxcolorrange', 
				wrapper 	: fieldsWrapper,
				input 		: false,
				title 		: 'Min/max range',
				isOn 		: false,
				rightPos	: true,
				type 		: 'dualMiniInput',
				value 		: value,
				minMax 		: [fieldMinRange, fieldMaxRange],
				tabindex 	: [this.tabindex++, this.tabindex++]
			}
			this._createMetaFieldLine(lineOptions);

			// SAVE JSON
			this.cartoJSON.point[key].customMinMax = value;
			this.cartoJSON.point[key].minMax       = [fieldMinRange, fieldMaxRange];
			

		}
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

	// ADD POINT SIZE FIELDS
	addPointSizeFields : function (key, fieldName) {

		if ( key == 'pointsize' ) {

			var fieldsWrapper = Wu.DomUtil.get('field_wrapper_pointsize');

			// Do not add if we've already added it!
			var minMaxPointSize = Wu.DomUtil.get('field_wrapper_minmaxpointsize');
			if ( minMaxPointSize ) return;

			var minMax  = this.cartoJSON.point[key].minMax ? this.cartoJSON.point[key].minMax : [1,10];

			var lineOptions = {
				key 		: 'minmaxpointsize', 
				wrapper 	: fieldsWrapper,
				input 		: false,
				title 		: 'Min/max point size',
				isOn 		: false,
				rightPos	: true,
				type 		: 'dualMiniInput',
				value 		: minMax,
				tabindex 	: [this.tabindex++, this.tabindex++]
			}
			this._createMetaFieldLine(lineOptions);	
					
			// SAVE JSON
			this.cartoJSON.point[key].range  = fieldName;
			this.cartoJSON.point[key].minMax = minMax;

		}
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


	// add layer temporarily for editing
	_tempaddLayer : function () {

		// remember
		this._temps = this._temps || [];

		// remove others
		this._tempRemoveLayers();

		// if not already added to map
		if (!this._layer._added) {

			// add
			this._layer._addThin();

			// remember
			this._temps.push(this._layer);
		}

	},

	// remove temp added layers
	_tempRemoveLayers : function () {
		if (!this._temps) return;

		// remove other layers added tempy for styling
		this._temps.forEach(function (layer) {
			layer._removeThin();
		}, this);

		this._temps = [];
	},







	// initPolygon : function () {

	// 	var sectionWrapper = Wu.DomUtil.create('div', 'chrome-content-section-wrapper', this._fieldsWrapper)

	// 	var lineOptions = {
	// 		key 		: 'polygon', 
	// 		wrapper 	: sectionWrapper,
	// 		input 		: false,
	// 		title 		: 'Polygon',
	// 		isOn 		: false,
	// 		rightPos	: false,
	// 		type 		: 'switch'
	// 	}

	// 	this._createMetaFieldLine(lineOptions);


	// },

	// initLine : function () {

	// 	var sectionWrapper = Wu.DomUtil.create('div', 'chrome-content-section-wrapper', this._fieldsWrapper)

	// 	var lineOptions = {
	// 		key 		: 'line', 
	// 		wrapper 	: sectionWrapper,
	// 		input 		: false,
	// 		title 		: 'Line',
	// 		isOn 		: false,
	// 		rightPos	: false,
	// 		type 		: 'switch'
	// 	}

	// 	this._createMetaFieldLine(lineOptions);

	// },



	// _createField : function (json) {



	// },






	// CARTO CARTO CARTO CARTO
	// CARTO CARTO CARTO CARTO
	// CARTO CARTO CARTO CARTO		

	_updateStyle : function () {

		var cartoJSON = this.cartoJSON;

		var headers = '';
		var style   = '#layer {\n\n';

		var allowOverlap = 'true';
		var markerClip  = 'false';
		var compOp      = 'screen'

		// CREATE DEFAULT STYLING
		style += '\tmarker-allow-overlap: ' + allowOverlap + ';\n';
		style += '\tmarker-clip: ' + markerClip + ';\n';
		style += '\tmarker-comp-op: ' + compOp + ';\n\n';


		// STYLE POINT
		// STYLE POINT
		// STYLE POINT

		if ( cartoJSON.point && cartoJSON.point.enabled == true ) {

			// OPACITY
			var pointOpacityCarto = this.buildCarto_pointOpacity(headers, style);
			headers += pointOpacityCarto.headers;
			style += pointOpacityCarto.style;

			// COLOR
			var pointColorCarto = this.buildCarto_pointColor(headers, style);
			headers += pointColorCarto.headers;
			style += pointColorCarto.style;

			// SIZE
			var pointSizeCarto = this.buildCarto_pointSize(headers, style);
			headers += pointSizeCarto.headers;
			style += pointSizeCarto.style;			

		}
			
		style += '}'

		var finalCarto = headers + style;

		this.saveCartoJSON(finalCarto);
	},

	buildCarto_pointOpacity : function () {

		// OPACITY
		// OPACITY
		// OPACITY

		var opacity = this.cartoJSON.point.opacity;

		var cartObj = {
			headers : '',
			style   : ''
		}


		if ( opacity.range ) {

			var max = Math.floor(this.columns[opacity.range].max * 10) / 10;
			var min = Math.floor(this.columns[opacity.range].min * 10) / 10;				

			var normalizedOffset = true;

			// NORMALIZED OFFSET 
			// i.e. if the lowest number is 30, and 
		 	// highest is 100, 30 will return 0.3 and not 0
			if ( normalizedOffset ) {
				if ( min > 0 ) min = 0;
			}

			cartObj.headers += '@opacity_field_max: ' + max + ';\n';
			cartObj.headers += '@opacity_field_min: ' + min + ';\n';
			cartObj.headers += '@opacity_field_range: [' + opacity.range + '];\n\n';

			cartObj.headers += '@opacity_field: @opacity_field_range / (@opacity_field_max - @opacity_field_min);\n\n';

		
		} else {

			// static opacity
			cartObj.headers += '@opacity_field: ' + opacity.value + ';\n';
		}

		cartObj.style += '\tmarker-opacity: @opacity_field;\n\n';

		return cartObj;
	},

	buildCarto_pointColor : function (headers, style) {

		// COLOR RANGE
		// COLOR RANGE
		// COLOR RANGE

		var color = this.cartoJSON.point.color;

		var cartObj = {
			headers : '',
			style   : ''
		}		

		if ( color.range ) {

			var minMax = color.customMinMax ? color.customMinMax : color.minMax;

			// Get color values
			var c1 = color.value[0];
			var c5 = color.value[1];
			var c9 = color.value[2];

			// Interpolate
			var c3 = this.hexAverage([c1, c5]);
			var c7 = this.hexAverage([c5, c9]);

			// Interpolate
			var c2 = this.hexAverage([c1, c3]);
			var c4 = this.hexAverage([c3, c5]);
			var c6 = this.hexAverage([c5, c7]);
			var c8 = this.hexAverage([c7, c9]);


			colorArray = [c1, c2, c3, c4, c5, c6, c7, c8, c9];


			// CREATE VARS
			var fieldName = '@' + color.range;
			var maxField  = fieldName + '_max';
			var minField  = fieldName + '_min';
			var deltaName = fieldName + '_delta';
			

			// DEFINE FIELD NAME + MIN/MAX
			cartObj.headers += fieldName + ': [' + color.range + '];\n';
			cartObj.headers += maxField  + ': '  + minMax[1] + ';\n'; 
			cartObj.headers += minField  + ': '  + minMax[0] + ';\n\n';
			

			// COLORS VALUES
			colorArray.forEach(function(c, i) {	
				cartObj.headers += fieldName + '_color_' + (i+1) + ': ' + c + ';\n';
			})

			cartObj.headers += '\n';
			
			// COLOR STEPS (DELTA)
			cartObj.headers += fieldName + '_delta: (' + maxField + ' - ' + minField + ')/' + colorArray.length + ';\n'
			
			colorArray.forEach(function(c, i) {	
				cartObj.headers += fieldName + '_step_' + (i+1) + ': (' + minField + ' + ' + fieldName + '_delta * ' + i + ');\n';
			})


			cartObj.headers += '\n';



			// STYLE STYLE STYLE
			// STYLE STYLE STYLE
			// STYLE STYLE STYLE


			colorArray.forEach(function(c,i) {

				var no = i+1;

				if ( no == 1 ) {

					cartObj.style += '\t[' + fieldName + ' < ' + fieldName + '_step_' + (no+1) + '] ';
					cartObj.style += '{ marker-fill: ' + fieldName + '_color_' + no + '; }\n';

				}

				if ( no > 1 && no < colorArray.length ) {

					cartObj.style += '\t[' + fieldName + ' > ' + fieldName + '_step_' + no + ']';
					cartObj.style += '[' + fieldName + ' < ' + fieldName + '_step_' + (no+1) + ']';
					cartObj.style += '{ marker-fill: ' + fieldName + '_color_' + no + '; }\n';

				}

				if ( no == colorArray.length ) {

					cartObj.style +=  '\t[' + fieldName + ' > ' + fieldName + '_step_' + no + '] ';
					cartObj.style += '{ marker-fill: ' + fieldName + '_color_' + no + '; }\n\n';
				}
			})
			
		
		} else {
		
			// static color
			cartObj.style += '\tmarker-fill: ' + color.staticVal + ';\n\n';
		}

		return cartObj;
	},

	buildCarto_pointSize : function (headers, style) {

		// POINT SIZE
		// POINT SIZE
		// POINT SIZE

		var pointsize = this.cartoJSON.point.pointsize;

		var cartObj = {
			headers : '',
			style   : ''
		}		

		if ( pointsize.range ) {

			var max = Math.floor(this.columns[pointsize.range].max * 10) / 10;
			var min = Math.floor(this.columns[pointsize.range].min * 10) / 10;
		
			// cartObj.headers += '@marker_size_max: ' + pointsize.minMax[1] + ';\n';
			cartObj.headers += '@marker_size_min: ' + pointsize.minMax[0] + ';\n';
			cartObj.headers += '@marker_size_range: ' + (pointsize.minMax[1] - pointsize.minMax[0]) + ';\n';
			cartObj.headers += '@marker_size_field: [' + pointsize.range + '];\n';
			cartObj.headers += '@marker_size_field_maxVal: ' + max + ';\n';
			cartObj.headers += '@marker_size_field_minVal: ' + min + ';\n';
			cartObj.headers += '\n//TODO: Fix this!\n';
			cartObj.headers += '@marker_size_factor: (@marker_size_field / (@marker_size_field_maxVal - @marker_size_field_minVal)) * (@marker_size_range + @marker_size_min);\n\n';
			
		} else {

			cartObj.headers += '@marker_size_factor: ' + pointsize.value + ';\n';

		}


		cartObj.headers += '[zoom=10] { marker-width: 0.3 * @marker_size_factor; }\n';
		cartObj.headers += '[zoom=11] { marker-width: 0.5 * @marker_size_factor; }\n';
		cartObj.headers += '[zoom=12] { marker-width: 1   * @marker_size_factor; }\n';
		cartObj.headers += '[zoom=13] { marker-width: 1   * @marker_size_factor; }\n';
		cartObj.headers += '[zoom=14] { marker-width: 2   * @marker_size_factor; }\n';
		cartObj.headers += '[zoom=15] { marker-width: 4   * @marker_size_factor; }\n';
		cartObj.headers += '[zoom=16] { marker-width: 6   * @marker_size_factor; }\n';
		cartObj.headers += '[zoom=17] { marker-width: 8   * @marker_size_factor; }\n';
		cartObj.headers += '[zoom=18] { marker-width: 12  * @marker_size_factor; }\n\n';


		return cartObj;
	},

	saveCartoJSON : function (finalCarto) {

		this._layer.setStyling(this.cartoJSON);

		console.log('saveCartoJSON this._layuer', this._layer);

		var sql = this._layer.getSQL();

		console.log('sql:', sql);

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
		    // sql = this._createSQL(file_id, sql),
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


			console.log('got new layer -> set newLayerStyle', newLayerStyle);

			// update layer
			layer.updateStyle(newLayerStyle);

			// return
			done && done();
		}.bind(this));

	},	


});
