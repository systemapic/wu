Wu.Styler.Point = Wu.Styler.extend({

	type : 'point',

	// creates content of point container
	_createOptions : function () {

		// COLOR
		this._createColor();

		// OPACITY
		this._createOpacity();

		// POINT SIZE
		this._createPointsize();
	},

	_preSelectOptions : function () {

		this._initSubfields(this.carto().color.column, 'color');
		this._initSubfields(this.carto().opacity.column, 'opacity');
		this._initSubfields(this.carto().pointsize.column, 'pointsize');

	},

	
	_updatePointsize : function (e) {

		var value = parseFloat(e.target.value);
		var key   = e.target.id.slice(17, e.target.id.length);
		var pre = key.substring(0,4);

		if ( pre == 'min_' || pre == 'max_' ) {
			key = key.slice(4, key.length);
		}

		// Get field 
		var inputField = this._content[this.type].pointsize.input.input;

		// If less than 0.5, make it 0.5
		if ( value < 0.5 ) value = 0.5;

		// Set value in input
		inputField.value = value;

		// don't save if no changes
		if (this.carto().pointsize.value == value) return;

		// save carto
		this.carto().pointsize.value = value;

		// update
		this._updateStyle();

	},

	

	// _selectField : function (field, wrapper, column) {

	// 	// add class
	// 	Wu.DomUtil.addClass(wrapper, 'full-width');

	// 	// remove static inputs
	// 	if (field == 'opacity') {
	// 		var miniInput = this._content[this.type].opacity.input.input;
	// 		Wu.DomUtil.addClass(miniInput, 'left-mini-kill');
	// 	}

	// 	// remove static inputs
	// 	if (field == 'pointsize') {
	// 		var miniInput = this._content[this.type].pointsize.input.input;
	// 		Wu.DomUtil.addClass(miniInput, 'left-mini-kill');
	// 	}

	// 	// remove static inputs
	// 	if (field == 'color') {
	// 		var colorBall = this._content[this.type].color.ball.color;
	// 		Wu.DomUtil.addClass(colorBall, 'disable-color-ball');
	// 	}

	// 	// save carto
	// 	this.options.carto[this.type][field].column = column; // range == column

	// 	// Add fields
	// 	this._initSubfields(column, field); // sub meny

	// 	// UPDATE
	// 	this._updateStyle();

	// },

	// // CLEAN UP EXTRA FIELDS
	// _removeExtras : function (key) {

	// 	if (key == 'pointsize') {

	// 		// pointsize
	// 		var pointsize = this._content[this.type].pointsize;
	// 		var minMaxPointSize = pointsize.minmax ? pointsize.minmax.line.container : false;
	// 		minMaxPointSize && Wu.DomUtil.remove(minMaxPointSize);
	// 	}

	// 	if (key == 'color') {

	// 		// min/max
	// 		var minmax = this._content[this.type].color.minmax;
	// 		var minMaxColorRange = minmax ? minmax.line.container : false;
	// 		minMaxColorRange && Wu.DomUtil.remove(minMaxColorRange);

	// 		// range
	// 		var range = this._content[this.type].color.range;
	// 		var colorRange = range ? range.line.container : false;
	// 		colorRange && Wu.DomUtil.remove(colorRange);
	// 	}		
	// },

	_clearOptions : function () {

		var content = this._content[this.type];

		// return if not content yet
		if (_.isEmpty(content)) return;

		// get divs
		var color_wrapper = content.color.line.container;
		var color_children = content.color.line.childWrapper;
		var opacity_wrapper = content.opacity.line.container;
		var pointsize_wrapper = content.pointsize.line.container;
		var pointsize_children = content.pointsize.line.childWrapper;

		// remove divs
		color_wrapper && Wu.DomUtil.remove(color_wrapper);
		color_children && Wu.DomUtil.remove(color_children);
		opacity_wrapper && Wu.DomUtil.remove(opacity_wrapper);
		pointsize_wrapper && Wu.DomUtil.remove(pointsize_wrapper);
		pointsize_children && Wu.DomUtil.remove(pointsize_children);
	},


	_addPointSizeFields : function (column) {

		// get wrapper
		var childWrapper = this._content[this.type].pointsize.line.childWrapper;

		// clear old
		childWrapper.innerHTML = '';

		// get min/max values
		var minMax  = this.carto().pointsize.range || [1,10];

		// line
		var line = new Wu.fieldLine({
			id        : 'minmaxpointsize',
			appendTo  : childWrapper,
			title     : 'Min/max point size',
			input     : false,
			className : 'sub-line'
		});

		// Inputs
		var input = new Wu.button({
			id 	  : 'minmaxpointsize',
			type 	  : 'dualinput',
			right 	  : true,
			appendTo  : line.container,
			value     : minMax,
			fn        : this.savePointSizeDualBlur.bind(this),
			minmax    : minMax,
			tabindex  : [this.tabindex++, this.tabindex++]
		});

		// rememeber 
		this._content[this.type].pointsize.minmax = {
			line : line,
			input : input
		}

		// save carto
		this.carto().pointsize.column  = column;
		this.carto().pointsize.range = minMax;

	},

	
	_addColorFields : function (column) {

		// get color value
		var value  = this.carto().color.value || this.options.defaults.range;

		// if not array, it's 'fixed' selection
		if (!_.isArray(value)) return; 

		// Get wrapper
		var childWrapper = this._content[this.type].color.line.childWrapper;

		// remove old
		childWrapper.innerHTML = '';

		// update min/max
		var fieldMaxRange = Math.floor(this.options.columns[column].max * 10) / 10;
		var fieldMinRange = Math.floor(this.options.columns[column].min * 10) / 10;

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
		this.carto().color.column = column;
		this.carto().color.value = value;

		// get min/max
		var value = this.carto().color.range || [fieldMinRange, fieldMaxRange];
		
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
		this.carto().color.range = value;
		
	},

	// on click on color range presets
	selectColorPreset : function (e) {

		var elem = e.target;
		var hex = elem.getAttribute('hex');
		var hexArray = hex.split(',');

		// Five colors
		var colorArray = this._convertToFiveColors(hexArray);

		// get divs
		var colorRangeBar = this._content[this.type].color.range.dropdown._color;
		var colorBall_1   = this._content[this.type].color.range.dropdown._colorball1;
		var colorBall_2   = this._content[this.type].color.range.dropdown._colorball2;
		var colorBall_3   = this._content[this.type].color.range.dropdown._colorball3;

		// Set styling		
		var gradientStyle = this._gradientStyle(colorArray);

		// Set style on colorrange bar
		colorRangeBar.setAttribute('style', gradientStyle);

		// update colors on balls
		colorBall_1.style.background = colorArray[0];
		colorBall_2.style.background = colorArray[2];
		colorBall_3.style.background = colorArray[4];
		colorBall_1.setAttribute('hex', colorArray[0]);
		colorBall_2.setAttribute('hex', colorArray[2]);
		colorBall_3.setAttribute('hex', colorArray[4]);

		// close
		this._closeColorRangeSelector();

		// dont' save if unchanged
		if (this.carto().color.value[0] == colorArray[0] &&
		    this.carto().color.value[1] == colorArray[1] && 
		    this.carto().color.value[2] == colorArray[2] &&
		    this.carto().color.value[3] == colorArray[3] &&
		    this.carto().color.value[4] == colorArray[4]) {

			return;
		}

		// save carto
		this.carto().color.value = colorArray;		

		// UPDATE
		this._updateStyle();		

	},

	// on color preset color ball selection
	_updateRange : function (hex, key, wrapper) {

		var colorBall_1 = this._content[this.type].color.range.dropdown._colorball1;
		var colorBall_2 = this._content[this.type].color.range.dropdown._colorball2;
		var colorBall_3 = this._content[this.type].color.range.dropdown._colorball3;

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
		if (this.carto().color.value == colors) return;

		// save carto
		this.carto().color.value = colors;

		// close popup
		this._closeColorRangeSelector(); 

		// UPDATE
		this._updateStyle();

	},


	_closeColorRangeSelector : function () {
		var rangeSelector = this._content[this.type].color.range.dropdown._colorSelectorWrapper;
		var clickCatcher = this._content[this.type].color.range.dropdown._clicker;
		if (rangeSelector) Wu.DomUtil.addClass(rangeSelector, 'displayNone');
		if (clickCatcher) Wu.DomUtil.addClass(clickCatcher, 'displayNone');		
	},	

	
	

	


})