Wu.Chrome.Content.Styler = Wu.Chrome.Content.extend({

	// UNIVERSALS
	// UNIVERSALS	
	// UNIVERSALS

	cartoJSON : {

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
  		
		// active layer
		this._initLayout_activeLayers();

		this._fieldsWrapper = Wu.DomUtil.create('div', 'chrome-field-wrapper', this._container);

		this._createRefresh();

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
	},
	
	// event run when layer selected 
	_selectedActiveLayer : function (e) {

		this.layerUuid = e.target.value;

		var layer = this._project.getLayer(this.layerUuid);

		// get current style, returns default if none
		var style = layer.getEditorStyle();

		// init style json
		this._initStyle(style);
	},


	_createRefresh : function () {

		var text = (navigator.platform == 'MacIntel') ? 'Save (⌘-S)' : 'Save (Ctrl-S)';
		this._refreshButton = Wu.DomUtil.create('div', 'chrome chrome-content cartocss refresh-button', this._container, text);

		Wu.DomEvent.on(this._refreshButton, 'click', this._updateStyle, this);
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

		this.metaFields = ['NONE', '---------------'];

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

	_initStyle : function (style) {
		
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

		// Get stores states
		var isOn   = this.cartoJSON.point[key].range ? false : true;
		var val    = this.cartoJSON.point[key].staticVal ? this.cartoJSON.point[key].staticVal : '#FF33FF';
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
			value 		: val,
			dropArray 	: this.metaFields,
			selectedField   : range
		}
		this._createMetaFieldLine(lineOptions);

		// SAVE JSON
		this.cartoJSON.point[key] = {
			range 	     : range,
			minMax 	     : minMax,
			customMinMax : customMinMax,
			staticVal    : val,
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
			selectedField   : range
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
			selectedField   : range
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

		var colorWrapper = Wu.DomUtil.get('field_wrapper_color');
		var opacityWrapper = Wu.DomUtil.get('field_wrapper_opacity');
		var pointsizeWrapper = Wu.DomUtil.get('field_wrapper_pointsize');
		
		colorWrapper.remove();
		opacityWrapper.remove();
		pointsizeWrapper.remove();
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

			if ( !colorRange ) 			return;
			if ( colorRange == 'NONE' ) 		return;
			if ( colorRange == '---------------' ) 	return;
			
			var fieldName = colorRange;

			this.addExtraFields(key, fieldName);

		}

		if ( key == 'pointsize' ) {

			var pointSizeRange = options.pointSizeRange;

			if ( !pointSizeRange ) 			return;
			if ( pointSizeRange == 'NONE' ) 		return;
			if ( pointSizeRange == '---------------' ) 	return;
			
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
		if ( fieldName == 'NONE' || fieldName == '---------------') {
			
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
			this.cartoJSON.point[key].value = value;	
		}


		// POINT SIZE
		// POINT SIZE
		// POINT SIZE

		// Save static POINT SIZE value
		if ( key == 'pointsize' ) {
			this.cartoJSON.point[key].value = value;	
		}	

		// Save dynamic POINT SIZE values
		if ( key == 'minmaxpointsize' ) {
			if ( pre == 'min_' ) {
				this.cartoJSON.point.pointsize.minMax[0] = value;
			}
			if ( pre == 'max_' ) {
				this.cartoJSON.point.pointsize.minMax[1] = value;	
			}	
		}


		// COLOR RANGE
		// COLOR RANGE
		// COLOR RANGE

		if ( key == 'minmaxcolorrange' ) {
			if ( pre == 'min_' ) {
				// SAVE MIN AND MAX VALUE
				var maxField = Wu.DomUtil.get('field_mini_input_max_minmaxcolorrange');
				var maxVal = maxField.value;
				this.cartoJSON.point.color.customMinMax = [value, maxVal];
			}

			if ( pre == 'max_' ) {
				// SAVE MIN AND MAX VALUE
				var minField = Wu.DomUtil.get('field_mini_input_max_minmaxcolorrange');
				var minVal = minField.value;
				this.cartoJSON.point.color.customMinMax[0] = minVal;
			}			
		}
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


			var defaultRange = ['#ff0000', '#ff3600', '#ff8100', '#ffd700', '#a5ff00', '#00ffa9', '#00ffdf', '#009eff', '#003dff', '#2f00ff'];

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
			// var value  = [fieldMinRange, fieldMaxRange];

			var lineOptions = {
				key 		: 'minmaxcolorrange', 
				wrapper 	: fieldsWrapper,
				input 		: false,
				title 		: 'Min/max range',
				isOn 		: false,
				rightPos	: true,
				type 		: 'dualMiniInput',
				value 		: value,
			}
			this._createMetaFieldLine(lineOptions);

			// SAVE JSON
			this.cartoJSON.point[key].minMax = value;

		}
	},

	// ADD POINT SIZE FIELDS
	addPointSizeFields : function (key, fieldName) {

		if ( key == 'pointsize' ) {

			var fieldsWrapper = Wu.DomUtil.get('field_wrapper_pointsize');

			// Do not add if we've already added it!
			var minMaxPointSize = Wu.DomUtil.get('field_wrapper_minmaxpointsize');
			if ( minMaxPointSize ) return;

			var minMax  = this.cartoJSON.point[key].minMax ? this.cartoJSON.point[key].minMax : [0,30];

			var lineOptions = {
				key 		: 'minmaxpointsize', 
				wrapper 	: fieldsWrapper,
				input 		: false,
				title 		: 'Min/max point size',
				isOn 		: false,
				rightPos	: true,
				type 		: 'dualMiniInput',
				value 		: minMax,
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
			minMaxPointSize.remove();
		}

		if ( key == 'color' ) {
			var minMaxColorRange = Wu.DomUtil.get('field_wrapper_minmaxcolorrange');
			minMaxColorRange.remove();

			var colorRange = Wu.DomUtil.get('field_wrapper_colorrange');
			colorRange.remove();
		}		
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

		console.log('cartoJSON', this.cartoJSON);

		var cartoJSON = this.cartoJSON;

		var headers = '';
		var style   = '';

		if ( cartoJSON.point && cartoJSON.point.enabled == true ) {

			// COLOR
			// COLOR
			// COLOR

			var color = cartoJSON.point.color;

			if ( color.range ) {

				// color range
				color.customMinMax
				color.minMax
				color.range
				color.value

				var minMax = color.customMinMax ? color.customMinMax : color.minMax;

				headers += '@' + color.range + '_min: ' + minMax[0] + ';\n'; 
				headers += '@' + color.range + '_max: ' + minMax[1] + ';\n';
				headers += '@' + color.range + ': [' + color.range + '];\n\n';

				// COLORS
				color.value.forEach(function(c, i) {	
					headers += '@color_' + (color.value.length - i) + ': ' + c + ';\n';
				})

				headers += '\n';

				// COLOR STEPS
				headers += '@' + color.range + '_delta: (@' + color.range + '_max - @' + color.range + '_min)/' + color.value.length + ';\n'
				color.value.forEach(function(c, i) {	
					headers += '@step_' + (i+1) + ' + (@' + color.range + '_delta * ' + i + ');\n';
				})				


				// @delta   : (@field_max - @field_min)/10;
				// @step_1  : @field_min;
				// @step_2  : @field_min + @delta;
				// @step_3  : @field_min + (@delta * 2);
				// @step_4  : @field_min + (@delta * 3);
				// @step_5  : @field_min + (@delta * 4);
				// @step_6  : @field_min + (@delta * 5);
				// @step_7  : @field_min + (@delta * 6);
				// @step_8  : @field_min + (@delta * 7);
				// @step_9  : @field_min + (@delta * 8);
				// @step_10 : @field_min + (@delta * 9);				


			
			} else {
			
				// static color
				color.staticVal
			}

			// OPACITY
			// OPACITY
			// OPACITY

			var opacity = cartoJSON.point.opacity;

			if ( opacity.range ) {

				// opaciyt range
				opacity.range


			
			} else {

				// static opacity
				opacity.value	
			}

			
			// POINT SIZE
			// POINT SIZE
			// POINT SIZE

			var pointsize = cartoJSON.point.pointsize;

			if ( pointsize.range ) {

				// point size range
				pointsize.minMax
				pointsize.range

			} else {

				// static point size
				pointsize.value

			}
		}

		console.log('');
		console.log('%c******* cartCSS headers *******', 'background: red; color: white;');
		console.log('');
		console.log(headers);
		console.log('');

		console.log('%c******* cartCSS style *******', 'background: red; color: white;');
		console.log('');
		console.log(style);
		console.log('');

	}


	// createCartoJSON : function (fieldName) {

	// 	var field = this.columns[fieldName];

	// 	var max = field.max;
	// 	var min = field.min;
		
	// 	if ( min > 0 ) min = 0;

	// 	var color = {
	// 		max : max,
	// 		min : min,
	// 		field : fieldName,
	// 		dimension : key
	// 	}

	// 	this.toCarto(color);

	// },


	// toCarto : function (JSON) {

	// 	var max = JSON.max;
	// 	var min = JSON.min;
	// 	var field = JSON.field;
	// 	var dimension = JSON.dimension;

	// 	var maxName   = '@' + field + '_max'
	// 	var minName   = '@' + field + '_min';
	// 	var fieldName = '@' + field;

	// 	var univeralCarto  =  maxName + ': ' + max + ';';
	// 	    univeralCarto +=  minName + ': ' + min + ';';
	// 	    univeralCarto +=  fieldName + ': [' + field + '];';

	// 	var cartoStr = dimension + ': ' + '((' + fieldName + ' - ' + minName + ') / (' + maxName + ' - ' + minName + '));';

	// 	console.log('univeralCarto', univeralCarto);
	// 	console.log('cartoStr', cartoStr);

	// },



});



