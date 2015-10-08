Wu.Styler.Polygon = Wu.Styler.extend({

	type : 'polygon',


	// creates content of point container
	_createOptions : function () {

		// color
		this._createColor();

		// opacity
		this._createOpacity();

		// create (+) button
		console.log('(+) button');
	},

	
	_updateOpacity : function (e) {

		// var value = parseFloat(e.target.value);
		// var key   = e.target.id.slice(17, e.target.id.length);
		// var pre = key.substring(0,4);

		// if (pre == 'min_' || pre == 'max_') {
		// 	key = key.slice(4, key.length);
		// }

		// // Get field 
		// var inputField = Wu.DomUtil.get('field_mini_input_opacity'); // todo: not pluggable!


		// // If more than one, make it one
		// if ( value > 1  && value < 10  ) value = 1;
		// if ( value > 10 && value < 100 ) value = value/100;
		// if ( value > 100 ) 	         value = 1;
		

		// // Set value in input
		// inputField.value = value;

		// // don't save if unchanged
		// if (this.options.carto.point.opacity.value == value) return;

		// // save carto
		// this.options.carto.point.opacity.value = value;

		// // update
		// this._updateStyle();
		
	},

	_selectOptions : function () {

		// opitons for sub menus
		var colorRange = this.options.carto.point.color.range;
		var opacityRange = this.options.carto.point.opacity.range;

		var options = {
			colorRange : colorRange,
			opacityRange : opacityRange,
		}
		
		// init subemnus on relevant fields
		this._initOpenFields(options, 'color'); 		
	},


	_unselectField : function (key, wrapper) {

		// // Make static inputs available
		// if (key == 'opacity' || key == 'pointsize') {	
		// 	var miniInput = Wu.DomUtil.get('field_mini_input_' + key);	
		// 	Wu.DomUtil.removeClass(miniInput, 'left-mini-kill');
		// 	this._removeExtras(key);
		// }

		// // Make static color available
		// if (key == 'color') {
		// 	var colorBall = Wu.DomUtil.get('color_ball_color'); 	// todo: not pluggable
		// 	Wu.DomUtil.removeClass(colorBall, 'disable-color-ball');
		// 	this._removeExtras(key);
		// }

		// // adjust width
		// Wu.DomUtil.removeClass(wrapper, 'full-width');

		// // save style
		// this.options.carto.point[key].range = false;

		// // refresh
		// this._updateStyle();
	},

	_selectField : function (key, wrapper, field) {

		// // add class
		// Wu.DomUtil.addClass(wrapper, 'full-width');

		// // DISABLE mini input fields
		// if ( key == 'opacity' || key == 'pointsize' ) {
		// 	var miniInput = Wu.DomUtil.get('field_mini_input_' + key);
		// 	Wu.DomUtil.addClass(miniInput, 'left-mini-kill');
		// }

		// // DISABLE static color ball
		// if ( key == 'color' ) {
		// 	var colorBall = Wu.DomUtil.get('color_ball_color');
		// 	Wu.DomUtil.addClass(colorBall, 'disable-color-ball');
		// }

		// // SAVE JSON
		// this.options.carto.point[key].range = field; // range == column

		// // Add fields
		// this._addExtras(key, field); // sub meny

		// // UPDATE
		// this._updateStyle();

	},

	// CLEAN UP EXTRA FIELDS
	_removeExtras : function (key) {

		// if ( key == 'pointsize' ) {
		// 	var minMaxPointSize = Wu.DomUtil.get('field_wrapper_minmaxpointsize');
		// 	if ( minMaxPointSize ) minMaxPointSize.remove();
		// }

		// if ( key == 'color' ) {
		// 	var minMaxColorRange = Wu.DomUtil.get('field_wrapper_minmaxcolorrange');
		// 	if ( minMaxColorRange ) minMaxColorRange.remove();

		// 	var colorRange = Wu.DomUtil.get('field_wrapper_colorrange');
		// 	if ( colorRange ) colorRange.remove();
		// }		
	},

	// ADD COLOR FIELDS (color preset, color min/max)
	_addColorFields : function (key, fieldName) {

		// get color value
		var value  = this.options.carto.point[key].value || this.options.defaultRange;

		// if not array, it's 'fixed' selection
		if (!_.isArray(value)) return; 

		// Get wrapper
		var childWrapper = Wu.DomUtil.get('point-color-children');

		// update min/max
		var fieldMaxRange = Math.floor(this.options.columns[fieldName].max * 10) / 10;
		var fieldMinRange = Math.floor(this.options.columns[fieldName].min * 10) / 10;

		// get div
		var minMaxColorRange = Wu.DomUtil.get('field_wrapper_minmaxcolorrange'); 	// todo: not pluggable!
		
		// update instead of create
		if (minMaxColorRange) {
		
			// set div values
			var max = Wu.DomUtil.get('field_mini_input_max_minmaxcolorrange');
			var min = Wu.DomUtil.get('field_mini_input_min_minmaxcolorrange'); 	// todo: not pluggable
			max.value = fieldMaxRange;
			min.value = fieldMinRange;

			// save carto
			this.options.carto.point[key].customMinMax = false;

			// end early
			return;
		}

		// convert to five colors
		if (value.length < 5) value = this._convertToFiveColors(value);

		// Container
		var line = new Wu.fieldLine({
			id        : 'colorrange',
			appendTo  : childWrapper,
			title     : 'Color range',
			input     : false,
			className : 'sub-line'
		});

		// dropdown
		var dropdown = new Wu.button({
			id 	  : 'colorrange',
			type 	  : 'colorrange',
			right 	  : true,
			appendTo  : line.container,
			presetFn  : this.selectColorPreset.bind(this), // preset selection
			customFn  : this._updateRange.bind(this),  // color ball selection
			value     : value
		});
	
		// save carto
		this.options.carto.point[key].range = fieldName;
		this.options.carto.point[key].value = value;

		// get min/max
		var value  = this.options.carto.point[key].customMinMax || [fieldMinRange, fieldMaxRange];
		
		// Use placeholder value if empty
		if (isNaN(value[0])) value[0] = fieldMinRange;
		if (isNaN(value[1])) value[1] = fieldMaxRange;

		// Container
		var minline = new Wu.fieldLine({
			id        : 'minmaxcolorrange',
			appendTo  : childWrapper,
			title     : 'Min/max range',
			input     : false,
			className : 'sub-line'
		});

		// Inputs
		var inputs = new Wu.button({
			id 	  : 'minmaxcolorrange',
			type 	  : 'dualinput',
			right 	  : true,
			appendTo  : minline.container,
			value     : value,
			fn        : this.saveColorRangeDualBlur.bind(this),
			minmax    : [fieldMinRange, fieldMaxRange],
			tabindex  : [this.tabindex++, this.tabindex++]
		});

		// save carto
		this.options.carto.point[key].customMinMax = value;
		this.options.carto.point[key].minMax = [fieldMinRange, fieldMaxRange];
		
	},

	// on click on color range presets
	selectColorPreset : function (e) {

		var elem = e.target;
		var hex = elem.getAttribute('hex');
		var hexArray = hex.split(',');

		// Five colors
		var colorArray = this._convertToFiveColors(hexArray);

		// Color range bar
		var colorRangeBar = Wu.DomUtil.get('chrome-color-range_colorrange'); 	// todo: not pluggable

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
		if ( this.options.carto[this.type].color.value[0] == colorArray[0] &&
		     this.options.carto[this.type].color.value[1] == colorArray[1] && 
		     this.options.carto[this.type].color.value[2] == colorArray[2] &&
		     this.options.carto[this.type].color.value[3] == colorArray[3] &&
		     this.options.carto[this.type].color.value[4] == colorArray[4] ) {

			return;
		}

		// Store in JSON
		this.options.carto[this.type].color.value = colorArray;		

		// UPDATE
		this._updateStyle();		

	},


})