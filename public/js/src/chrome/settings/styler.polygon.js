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

	
	// _updateOpacity : function (e) {

	// 	var value = parseFloat(e.target.value);
	// 	var key   = e.target.id.slice(17, e.target.id.length); 	// todo: remove these also. 
	// 	var pre = key.substring(0,4);				// whole object is now available in this._content[this.type].opacity.input
	// 								// eg. id = this._content[this.type].opacity.input.id, etc..
	// 	if (pre == 'min_' || pre == 'max_') {
	// 		key = key.slice(4, key.length);
	// 	}

	// 	// Get field 
	// 	var inputField = this._content[this.type].opacity.input.input;

	// 	// If more than one, make it one
	// 	if ( value > 1  && value < 10  ) value = 1;
	// 	if ( value > 10 && value < 100 ) value = value/100;
	// 	if ( value > 100 ) 	         value = 1;
		
	// 	// Set value in input
	// 	inputField.value = value;

	// 	// don't save if unchanged
	// 	if (this.options.carto[this.type].opacity.value == value) return;

	// 	// save carto
	// 	this.options.carto[this.type].opacity.value = value;

	// 	// update
	// 	this._updateStyle();
		
	// },

	_selectOptions : function () {

		// options for sub menus
		var colorRange = this.options.carto.polygon.color.range;
		var opacityRange = this.options.carto.polygon.opacity.range;

		var options = {
			colorRange : colorRange,
			opacityRange : opacityRange,
		}
		
		// init subemnus on relevant fields
		this._initOpenFields(options, 'color'); 		
	},


	_unselectField : function (key, wrapper) {

		// Make static inputs available
		if (key == 'opacity' || key == 'pointsize') {	
			var miniInput = Wu.DomUtil.get('field_mini_input_' + key);	
			Wu.DomUtil.removeClass(miniInput, 'left-mini-kill');
			this._removeExtras(key);
		}

		// Make static color available
		if (key == 'color') {
			var colorBall = Wu.DomUtil.get('color_ball_color'); 	// todo: not pluggable
			Wu.DomUtil.removeClass(colorBall, 'disable-color-ball');
			this._removeExtras(key);
		}

		// adjust width
		Wu.DomUtil.removeClass(wrapper, 'full-width');

		// save style
		this.options.carto[this.type][key].range = false;

		// refresh
		this._updateStyle();
	},

	_selectField : function (key, wrapper, field) {

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
		this.options.carto[this.type][key].range = field; // range == column

		// Add fields
		this._addExtras(key, field); // sub meny

		// UPDATE
		this._updateStyle();

	},

	// // CLEAN UP EXTRA FIELDS
	// _removeExtras : function (key) {

	// 	if (key == 'pointsize') {
	// 		var minMaxPointSize = Wu.DomUtil.get('field_wrapper_minmaxpointsize');
	// 		if ( minMaxPointSize ) minMaxPointSize.remove();
	// 	}

	// 	if (key == 'color') {
	// 		var minMaxColorRange = Wu.DomUtil.get('field_wrapper_minmaxcolorrange');
	// 		if ( minMaxColorRange ) minMaxColorRange.remove();

	// 		var colorRange = Wu.DomUtil.get('field_wrapper_colorrange');
	// 		if ( colorRange ) colorRange.remove();
	// 	}		
	// },

	_removeExtras : function (key) {

		if (key == 'pointsize') {

			// pointsize
			var pointsize = this._content[this.type].pointsize;
			var minMaxPointSize = pointsize.minmax ? pointsize.minmax.line.container : false;
			minMaxPointSize && Wu.DomUtil.remove(minMaxPointSize);
		}

		if (key == 'color') {

			// min/max
			var minmax = this._content[this.type].color.minmax;
			var minMaxColorRange = minmax ? minmax.line.container : false;
			minMaxColorRange && Wu.DomUtil.remove(minMaxColorRange);

			// range
			var range = this._content[this.type].color.range;
			var colorRange = range ? range.line.container : false;
			colorRange && Wu.DomUtil.remove(colorRange);
		}		
	},


	_clearOptions : function () {

		var content = this._content[this.type];

		// return if not content yet
		if (_.isEmpty(content)) return;

		// get divs
		var color_wrapper = content.color.line.container;
		var color_children = content.color.line.childWrapper;
		var opacity_wrapper = content.opacity.line.container;

		// remove divs
		color_wrapper && Wu.DomUtil.remove(color_wrapper);
		color_children && Wu.DomUtil.remove(color_children);
		opacity_wrapper && Wu.DomUtil.remove(opacity_wrapper);
	},


	_addColorFields : function (key, fieldName) {

		// get color value
		var value  = this.options.carto[this.type][key].value || this.options.defaultRange;

		// if not array, it's 'fixed' selection
		if (!_.isArray(value)) return; 

		// Get wrapper
		var childWrapper = this._content[this.type].color.line.childWrapper;

		// remove old
		childWrapper.innerHTML = '';

		// update min/max
		var fieldMaxRange = Math.floor(this.options.columns[fieldName].max * 10) / 10;
		var fieldMinRange = Math.floor(this.options.columns[fieldName].min * 10) / 10;

		// get div
		var range = this._content[this.type].color.range;
		var color_range = range ? range.line.container : false;

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

		// rememeber 
		this._content[this.type].color.range = {
			line : line,
			dropdown : dropdown
		}
	
		// save carto
		this.options.carto[this.type][key].range = fieldName;
		this.options.carto[this.type][key].value = value;

		// get min/max
		var value = this.options.carto[this.type][key].customMinMax || [fieldMinRange, fieldMaxRange];
		
		// Use placeholder value if empty
		if (isNaN(value[0])) value[0] = fieldMinRange;
		if (isNaN(value[1])) value[1] = fieldMaxRange;

		// Container
		var line = new Wu.fieldLine({
			id        : 'minmaxcolorrange',
			appendTo  : childWrapper,
			title     : 'Min/max range',
			input     : false,
			className : 'sub-line'
		});

		// Inputs
		var input = new Wu.button({
			id 	  : 'minmaxcolorrange',
			type 	  : 'dualinput',
			right 	  : true,
			appendTo  : line.container,
			value     : value,
			fn        : this.saveColorRangeDualBlur.bind(this),
			minmax    : [fieldMinRange, fieldMaxRange],
			tabindex  : [this.tabindex++, this.tabindex++]
		});

		// rememeber 
		this._content[this.type].color.minmax = {
			line : line,
			input : input
		}

		// save carto
		this.options.carto[this.type][key].customMinMax = value;
		this.options.carto[this.type][key].minMax = [fieldMinRange, fieldMaxRange];
		
	},

	// on color preset color ball selection
	_updateRange : function (hex, key, wrapper) {

		var colorBall_1 = this._content[this.type].color.dropdown._colorball1;
		var colorBall_2 = this._content[this.type].color.dropdown._colorball2;
		var colorBall_3 = this._content[this.type].color.dropdown._colorball3;

		// Set HEX value on ball we've changed
		wrapper.setAttribute('hex', hex);

		// Get color values
		var color1 = colorBall_1.getAttribute('hex');
		var color2 = colorBall_2.getAttribute('hex');
		var color3 = colorBall_3.getAttribute('hex');

		// Build color array
		var colors = this._convertToFiveColors([color1, color2, color3]);

		// Color range bar
		var colorRangeBar = this._content[this.type].color.range.dropdown._color;

		// Set styling
		var gradientStyle = this._gradientStyle(colors);
		colorRangeBar.setAttribute('style', gradientStyle);

		// Do not save if value is unchanged
		if (this.options.carto[this.type].color.value == colors) return;

		// save carto
		this.options.carto[this.type].color.value = colors;

		// close popup
		this._closeColorRangeSelector(); 

		// UPDATE
		this._updateStyle();

	},

	_closeColorRangeSelector : function () {
		
		console.log('_closeColorRangeSelector', this._content[this.type].color);
		
		var rangeSelector = this._content[this.type].color.dropdown._colorSelectorWrapper;
		var clickCatcher = this._content[this.type].color.dropdown._clicker;
		if (rangeSelector) Wu.DomUtil.addClass(rangeSelector, 'displayNone');
		if (clickCatcher) Wu.DomUtil.addClass(clickCatcher, 'displayNone');		
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

});