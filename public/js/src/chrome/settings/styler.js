Wu.Styler = Wu.Class.extend({

	options :  {
		defaults : {
			range : ['#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff'],
			color : '#FF33FF',
			opacity : 0.5
		},
		dropdown : {
			staticText : 'Fixed value',
			staticDivider : '-'
		},
		palettes : [ 
			['#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff'],
			['#0000ff', '#00ffff', '#00ff00', '#ffff00', '#ff0000'],
			
			['#f0f9e8', '#bae4bc', '#7bccc4', '#43a2ca', '#0868ac'],
			["#0868ac", "#43a2ca", "#7bccc4", "#bae4bc", "#f0f9e8"],

			['#ffffb2', '#fecc5c', '#fd8d3c', '#f03b20', '#bd0026'],
			["#bd0026", "#f03b20", "#fd8d3c", "#fecc5c", "#ffffb2"],

			['#feebe2', '#fbb4b9', '#f768a1', '#c51b8a', '#7a0177'],
			["#7a0177", "#c51b8a", "#f768a1", "#fbb4b9", "#feebe2"],

			['#d7191c', '#fdae61', '#ffffbf', '#abdda4', '#2b83ba'],
			["#2b83ba", "#abdda4", "#ffffbf", "#fdae61", "#d7191c"],

			['#d01c8b', '#f1b6da', '#f7f7f7', '#b8e186', '#4dac26'],
			["#4dac26", "#b8e186", "#f7f7f7", "#f1b6da", "#d01c8b"],

			['#e66101', '#fdb863', '#f7f7f7', '#b2abd2', '#5e3c99'],
			["#5e3c99", "#b2abd2", "#f7f7f7", "#fdb863", "#e66101"],

			['#ca0020', '#f4a582', '#f7f7f7', '#92c5de', '#0571b0'],
			["#0571b0", "#92c5de", "#f7f7f7", "#f4a582", "#ca0020"],

			['#ff00ff', '#ffff00', '#00ffff'],
			['#00ffff', '#ffff00', '#ff00ff'],

			['#ff0000', '#ffff00', '#00ff00'], // todo: throws error if 4 colors..	
			['#00ff00', '#ffff00', '#ff0000'],
		],

		blendModes : ["color", "color-burn", "color-dodge", "contrast", "darken", "difference", "dst", "dst-atop", "dst-in", "dst-out", "dst-over", "exclusion", "grain-extract", "grain-merge", "hard-light", "hue", "invert", "invert-rgb", "lighten", "minus", "multiply", "overlay", "plus", "saturation", "screen", "soft-light", "src", "src-atop", "src-in", "src-out", "src-over", "value", "xor"],


	},

	_content : {},

	carto : function () {
		return this.options.carto[this.type];
	},

	initialize : function (options) {

		// set options
		Wu.setOptions(this, options);

		// init container
		this._initContainer();
	},

	_initContainer : function () {

		// create 
		this.options.carto[this.type] = this.carto() || {};

		this._content[this.type] = {};

		// Get on/off state
		var isOn = this.carto().enabled;

		// Create wrapper
		this._wrapper = Wu.DomUtil.create('div', 'chrome-content-section-wrapper toggles-wrapper', this.options.container);

		// wrapper
		var line = new Wu.fieldLine({
			id           : this.type,
			appendTo     : this._wrapper,
			title        : '<b>' + this.type.camelize() + 's</b>',
			input        : false,
		});		

		// switch Update Style
		var button = new Wu.button({
			id 	     : this.type,
			type 	     : 'switch',
			isOn 	     : isOn,
			right 	     : true,
			appendTo     : line.container,
			fn 	     : this._switch.bind(this), // onSwitch
		});

		// toggle
		this._toggle(isOn);
	},

	_switch : function (e, on) {

		// toggle
		this._toggle(on);

		// update
		this.markChanged();
	},

	_toggle : function (on) {
		on ? this._enable() : this._disable();
	},

	_enable : function () {

		// set enabled
		this.carto().enabled = true;
		
		// create options
		this._createOptions();

		// select options
		this._preSelectOptions();

	},

	_disable : function () {
		this.carto().enabled = false;
		this._clearOptions();
	},

	markChanged : function () {
		this._changed = true;
		this.options.styler.markChanged();
	},

	updateStyle : function () {
		if (!this._changed) return;

		// create carto css
		this._createCarto(this.options.carto, this._saveCarto.bind(this));

		// marked not changed
		this._changed = false;
	},


	// create color box
	_createColor : function () {

		// create color field
		this.carto().color = this.carto().color || {};

		// get states
		var isOn         = (this.carto().color.column === false);
		var staticVal    = this.carto().color.staticVal || this.options.defaults.color;
		var val          = this.carto().color.value 	|| this.options.defaults.range;
		var column       = this.carto().color.column;
		var minMax       = this.carto().color.range;

		// container
		var line = new Wu.fieldLine({
			id           : 'color',
			appendTo     : this._wrapper,
			title        : '<b>Color</b>',
			input        : false,
			childWrapper : 'point-color-children' // todo: make class for polyugon?
		});	

		// dropdown
		var dropdown = new Wu.button({
			id 	 : 'color',
			type 	 : 'dropdown',
			isOn 	 : isOn,
			right 	 : true,
			appendTo : line.container,
			fn 	 : this._dropdownSelected.bind(this),
			array 	 : this.options.meta, // columns in dropdown
			selected : column, // preselected item
		});

		// color ball
		var ball = new Wu.button({
			id 	 : 'color',
			type 	 : 'colorball',
			right    : true,
			isOn 	 : isOn,
			appendTo : line.container,
			fn       : this._updateColor.bind(this),
			value    : staticVal,
			colors   : this.options.palettes,
			className: 'target-color-box'
		});

		// remember items
		this._content[this.type].color = {
			line : line,
			dropdown : dropdown,
			ball : ball
		}

		// save carto
		this.carto().color = {
			column 	     : column,
			range 	     : minMax,
			staticVal    : staticVal,
			value 	     : val
		};
	},

	// create opacity box
	_createOpacity : function () {

		// create opacity field
		this.carto().opacity = this.carto().opacity || {};

		// get states
		var isOn   = (this.carto().opacity.column === false);
		var value  = this.carto().opacity.staticVal;
		var column = this.carto().opacity.column;
		var minMax = this.carto().opacity.range;

		// Container
		var line = new Wu.fieldLine({
			id       : 'opacity',
			appendTo : this._wrapper,
			title    : '<b>Opacity</b>',
			input    : false,
			childWrapper : 'point-color-children' // todo: make class for polyugon?
		});	

		// Dropdown
		var dropdown = new Wu.button({
			id 	 : 'opacity',
			type 	 : 'dropdown',
			right 	 : true,
			appendTo : line.container,
			fn 	 : this._dropdownSelected.bind(this),
			array 	 : this.options.meta,
			selected : column,
		});

		// Input
		var input = new Wu.button({
			id 	    : 'opacity',
			type 	    : 'miniInput',
			right 	    : true,
			isOn        : isOn,
			appendTo    : line.container,
			value       : value,
			placeholder : 'auto',
			tabindex    : this.tabindex++,
			fn 	    : this._updateOpacity.bind(this), // blur event, not click
		});

		// remember items
		this._content[this.type].opacity = {
			line : line,
			dropdown : dropdown,
			input : input
		}

		// save carto
		this.carto().opacity = {
			column : column,
			range : minMax,
			staticVal : value
		};
	},

	_createBlendMode : function () {

		// Create JSON obj if it's not already there
		this.carto().blend = this.carto().blend || {};

		var blendmode = this.carto().blend.mode || 'screen';

		// container
		var line = new Wu.fieldLine({
			id           : 'blendmode',
			appendTo     : this._wrapper,
			title        : '<b>Blend mode</b>',
			input        : false,
			childWrapper : 'point-size-children'
		});

		// blend modes dropdown
		var dropdown = new Wu.button({
			id 	 : 'blendmode',
			type 	 : 'dropdown',
			right 	 : true,
			appendTo : line.container,
			fn 	 : this._blendmodeSelected.bind(this),
			array 	 : this.options.blendModes,
			selected : blendmode,
		});

		// remember items
		this._content[this.type].blendmode = {
			line : line,
			dropdown : dropdown,
		}

		// save carto
		this.carto().blend = {
			mode : blendmode
		};


	},

	_blendmodeSelected : function (e) {
		var dropdown = e.target;
		var blendmode = dropdown.options[dropdown.selectedIndex].value;

		// save
		this.carto().blend.mode = blendmode;

		// mark changed
		this.markChanged();
	},

	// point size box
	_createPointsize : function () {

		// Create JSON obj if it's not already there
		this.carto().pointsize = this.carto().pointsize || {};

		// Get stores states
		var isOn   = (this.carto().pointsize.column === false)
		var val    = this.carto().pointsize.staticVal || 1.2;
		var column = this.carto().pointsize.column;
		var minMax = this.carto().pointsize.range;

		// container
		var line = new Wu.fieldLine({
			id           : 'pointsize',
			appendTo     : this._wrapper,
			title        : '<b>Point size</b>',
			input        : false,
			childWrapper : 'point-size-children'
		});	

		// column dropdown
		var dropdown = new Wu.button({
			id 	 : 'pointsize',
			type 	 : 'dropdown',
			right 	 : true,
			appendTo : line.container,
			fn 	 : this._dropdownSelected.bind(this),
			array 	 : this.options.meta,
			selected : column,
		});

		// fixed value input
		var input = new Wu.button({
			id 	    : 'pointsize',
			type 	    : 'miniInput',
			right 	    : true,
			isOn        : isOn,
			appendTo    : line.container,
			value       : val,
			placeholder : 'auto',
			tabindex    : this.tabindex++,
			fn 	    : this._updatePointsize.bind(this),
		});

		// remember items
		this._content[this.type].pointsize = {
			line : line,
			dropdown : dropdown,
			input : input
		}

		// save carto
		this.carto().pointsize = {
			column 	    : column,
			range 	    : minMax,			
			staticVal : val
		};
	},

	// width box
	_createWidth : function () {

		// Create JSON obj if it's not already there
		this.carto().width = this.carto().width || {};

		// Get stores states
		var isOn   = (this.carto().width.column === false)
		var val    = this.carto().width.staticVal || 1.2;
		var column = this.carto().width.column;
		var minMax = this.carto().width.range;

		// container
		var line = new Wu.fieldLine({
			id           : 'width',
			appendTo     : this._wrapper,
			title        : '<b>Line width</b>',
			input        : false,
			childWrapper : 'line-width-children'
		});	

		// column dropdown
		var dropdown = new Wu.button({
			id 	 : 'width',
			type 	 : 'dropdown',
			right 	 : true,
			appendTo : line.container,
			fn 	 : this._dropdownSelected.bind(this),
			array 	 : this.options.meta,
			selected : column,
		});

		// fixed value input
		var input = new Wu.button({
			id 	    : 'width',
			type 	    : 'miniInput',
			right 	    : true,
			isOn        : isOn,
			appendTo    : line.container,
			value       : val,
			placeholder : 'auto',
			tabindex    : this.tabindex++,
			fn 	    : this._updateWidth.bind(this),
		});

		// remember items
		this._content[this.type].width = {
			line : line,
			dropdown : dropdown,
			input : input
		}

		// save carto
		this.carto().width = {
			column 	    : column,
			range 	    : minMax,			
			staticVal : val
		};
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
		if (value.length < 5) values = this._convertToFiveColors(value);

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
			value     : value,
			colors   : this.options.palettes

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
			title     : 'Range',
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

		// mark changed
		this.markChanged();
		
	},


	_addOpacityFields : function (column) {

		// get wrapper
		var childWrapper = this._content[this.type].opacity.line.childWrapper;

		// clear old
		childWrapper.innerHTML = '';

		// get default min/max
		var column_max = Math.floor(this.options.columns[column].max * 10) / 10;
		var column_min = Math.floor(this.options.columns[column].min * 10) / 10;

		// get stored min/max
		var value = this.carto().opacity.range || [column_min, column_max];

		// line
		var line = new Wu.fieldLine({
			id        : 'minmaxopacity',
			appendTo  : childWrapper,
			title     : 'Range',
			input     : false,
			className : 'sub-line'
		});

		// Inputs
		var input = new Wu.button({
			id 	  : 'minmaxopacity',
			type 	  : 'dualinput',
			right 	  : true,
			appendTo  : line.container,
			value     : value,
			fn        : this.saveOpacityDualBlur.bind(this),
			minmax    : value,
			tabindex  : [this.tabindex++, this.tabindex++]
		});

		// rememeber 
		this._content[this.type].opacity.minmax = {
			line : line,
			input : input
		}

		// save carto
		this.carto().opacity.column  = column;
		this.carto().opacity.range = value;

		// mark changed
		this.markChanged();
	},

	_addWidthFields : function (column) {

		// get wrapper
		var childWrapper = this._content[this.type].width.line.childWrapper;

		// clear old
		childWrapper.innerHTML = '';

		// get default min/max
		var column_max = Math.floor(this.options.columns[column].max * 10) / 10;
		var column_min = Math.floor(this.options.columns[column].min * 10) / 10;

		// get stored min/max
		var value = this.carto().width.range || [column_min, column_max];

		// line
		var line = new Wu.fieldLine({
			id        : 'minmaxwidth',
			appendTo  : childWrapper,
			title     : 'Range',
			input     : false,
			className : 'sub-line'
		});

		// Inputs
		var input = new Wu.button({
			id 	  : 'minmaxwidth',
			type 	  : 'dualinput',
			right 	  : true,
			appendTo  : line.container,
			value     : value,
			fn        : this.saveWidthDualBlur.bind(this),
			minmax    : value,
			tabindex  : [this.tabindex++, this.tabindex++]
		});

		// rememeber 
		this._content[this.type].width.minmax = {
			line : line,
			input : input
		}

		// save carto
		this.carto().width.column  = column;
		this.carto().width.range = value;

		// mark changed
		this.markChanged();
	},

	_updateColor : function (hex, key, wrapper) {

		// save carto
		this.carto().color.staticVal = hex;

		// Close
		this._closeColorRangeSelector(); 

		// mark changed
		this.markChanged();

		// send user event
		app.Socket.sendUserEvent({
		    	event : '`styled the ' + this.type + '-color` on',
		    	description : this.options.layer.getTitle() + ' (in project ' + this.options.project.getName() + ')',
		});
	},

	_updateWidth : function () {

		// Get field 
		var inputField = this._content[this.type].width.input.input;

		// save carto
		this.carto().width.staticVal = inputField.value;

		// mark changed
		this.markChanged();

		// send user event
		app.Socket.sendUserEvent({
		    	event : '`styled the ' + this.type + '-width` on',
		    	description : this.options.layer.getTitle() + ' (in project ' + this.options.project.getName() + ')',
		});	
	},

	_updateOpacity : function (e) {

		var value = parseFloat(e.target.value);
		
		// Get field 
		var inputField = this._content[this.type].opacity.input.input;

		// If more than one, make it one
		if ( value > 1  && value < 10  ) value = 1;
		if ( value > 10 && value < 100 ) value = value/100;
		if ( value > 100 ) 	         value = 1;
		
		// Set value in input
		inputField.value = value;

		// don't save if unchanged
		if (this.carto().opacity.staticVal == value) return;

		// save carto
		this.carto().opacity.staticVal = value;

		// mark changed
		this.markChanged();

		// send user event
		app.Socket.sendUserEvent({
		    	event : '`styled the ' + this.type + '-opacity` on',
		    	description : this.options.layer.getTitle() + ' (in project ' + this.options.project.getName() + ')',
		});
		
	},

	_updatePointsize : function (e) {

		var value = parseFloat(e.target.value);

		// Get field 
		var inputField = this._content[this.type].pointsize.input.input;

		// If less than 0.5, make it 0.5
		// if ( value < 0 ) value = 0;

		// Set value in input
		inputField.value = value;

		// don't save if no changes
		if (this.carto().pointsize.staticVal == value) return;

		// save carto
		this.carto().pointsize.staticVal = value;

		// mark changed
		this.markChanged();

		// send user event
		app.Socket.sendUserEvent({
		    	event : '`styled the ' + this.type + '-size` on',
		    	description : this.options.layer.getTitle() + ' (in project ' + this.options.project.getName() + ')',
		});

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

		// mark changed
		this.markChanged();

		// send user event
		app.Socket.sendUserEvent({
		    	event : '`styled the ' + this.type + '-color range` on',
		    	description : this.options.layer.getTitle() + ' (in project ' + this.options.project.getName() + ')',
		});

	},

	saveColorRangeDualBlur : function (max, min, absoluteMax, absoluteMin) {

		// get values
		var minMax = [parseFloat(min || absoluteMin), parseFloat(max || absoluteMax)];

		// don't save if no changes
		if (_.isEqual(this.carto().color.range, minMax)) return;

		// save carto
		this.carto().color.range = minMax;

		// mark changed
		this.markChanged();
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

		// mark changed
		this.markChanged();

		// user event
		app.Socket.sendUserEvent({
		    	event : '`styled the ' + this.type + '-color range` on',
		    	description : this.options.layer.getTitle() + ' (in project ' + this.options.project.getName() + ')',
		});

	},

	_dropdownSelected : function (e) {


		var key = e.target.getAttribute('key'); // todo: remove DOM interaction
		var field = e.target.value;
		var wrapper = e.target.parentElement;

		// check if selected item is placeholders
		var isStatic = (field == this.options.dropdown.staticText);
		var isDivider = (field == this.options.dropdown.staticDivider);
		var unselect = (isStatic || isDivider);

		// check if field is selected
		unselect ? this._unselectField(key, wrapper) : this._selectField(key, wrapper, field);
	},

	_selectField : function (field, wrapper, column) {

		// add class
		Wu.DomUtil.addClass(wrapper, 'full-width');

		// if not same, clear old values
		if (this.carto()[field].column != column) {
			var staticVal = this.carto()[field].staticVal;
			this.carto()[field] = {};
			this.carto()[field].staticVal = staticVal;
		}

		// remove static inputs
		if (field == 'opacity') {
			var miniInput = this._content[this.type].opacity.input.input;
			Wu.DomUtil.addClass(miniInput, 'left-mini-kill');
		}

		// remove static inputs
		if (field == 'pointsize') {
			var miniInput = this._content[this.type].pointsize.input.input;
			Wu.DomUtil.addClass(miniInput, 'left-mini-kill');
		}

		// remove static inputs
		if (field == 'color') {
			var colorBall = this._content[this.type].color.ball.color;
			Wu.DomUtil.addClass(colorBall, 'disable-color-ball');
		}

		// save carto
		this.carto()[field].column = column; 

		// Add fields
		this._initSubfields(column, field); // sub meny

		// mark changed
		this.markChanged();

		// user event
		app.Socket.sendUserEvent({
		    	event : '`styled the ' + this.type + '-' + field + '` by column `' + column + '` on layer',
		    	description : this.options.layer.getTitle() + ' in project ' + this.options.project.getName(),
		});


	},

	_unselectField : function (key, wrapper) {

		// show static inputs
		if (key == 'opacity') {	
			var miniInput = this._content[this.type].opacity.input.input;
			Wu.DomUtil.removeClass(miniInput, 'left-mini-kill');
		}

		// show static inputs
		if (key == 'pointsize') {	
			var miniInput = this._content[this.type].pointsize.input.input;
			Wu.DomUtil.removeClass(miniInput, 'left-mini-kill');
		}

		// show static inputs
		if (key == 'color') {
			var colorBall = this._content[this.type].color.ball.color;
			Wu.DomUtil.removeClass(colorBall, 'disable-color-ball');
		}

		// show static inputs
		if (key == 'width') {
			var colorBall = this._content[this.type].width.input.input;
			Wu.DomUtil.removeClass(colorBall, 'left-mini-kill');
		}

		// remove extras
		this._removeSubfields(key);

		// adjust width
		Wu.DomUtil.removeClass(wrapper, 'full-width');

		// save style
		this.carto()[key].column = false;

		// mark changed
		this.markChanged();

	},

	_removeSubfields : function (key) {

		// remove div
		var field = this._content[this.type][key].minmax;
		var div = field ? field.line.container : false;
		div && Wu.DomUtil.remove(div);

		// extra
		if (key == 'color') {

			// range
			var range = this._content[this.type].color.range;
			var div = range ? range.line.container : false;
			div && Wu.DomUtil.remove(div);
		}		
	},

	_initSubfields : function(options, field) {

		// get column
		var column = this.options.carto[this.type][field].column;

		// get defaults
		var d = this.options.dropdown;

		// return if no column selected
		if (!column || column == d.staticText || column == d.staticDivider) return;
	
		// add fields
		this._addSubfields(column, field);
	},

	_addSubfields : function (column, field) {

		// add relevant fields
		if (field == 'color') this._addColorFields(column);
		if (field == 'pointsize') this._addPointSizeFields(column);
		if (field == 'opacity') this._addOpacityFields(column);
		if (field == 'width') this._addWidthFields(column);
	},


	_getDefaultRange : function (column, field) {

		// get default min/max
		var column_max = Math.floor(this.options.columns[column].max * 10) / 10;
		var column_min = Math.floor(this.options.columns[column].min * 10) / 10;

		// get stored min/max
		var value = this.carto()[field].range || [column_min, column_max];
		
		// Use placeholder value if empty
		if (isNaN(value[0])) value[0] = column_min;
		if (isNaN(value[1])) value[1] = column_max;

		return value;
	},


	savePointSizeDualBlur : function (max, min, absoluteMax, absoluteMin) {

		// set min/max
		var max = max || absoluteMax;
		var min = min || absoluteMin;	

		// don't save if no changes
		if (this.carto().pointsize.range == [min, max]) return;

		// save carto
		this.carto().pointsize.range = [min, max];

		// mark changed
		this.markChanged();

		// user event
		app.Socket.sendUserEvent({
		    	event : '`styled the ' + this.type + '-size` on',
		    	description : this.options.layer.getTitle() + ' (in project ' + this.options.project.getName() + ')',
		});
	},

	saveOpacityDualBlur : function (max, min, absoluteMax, absoluteMin) {

		// set min/max
		var min = parseFloat(min || absoluteMin);	
		var max = parseFloat(max || absoluteMax);

		// don't save if no changes
		if (this.carto().opacity.range == [min, max]) return;

		// save carto
		this.carto().opacity.range = [min, max];

		// mark changed
		this.markChanged();

		// user event
		app.Socket.sendUserEvent({
		    	event : '`styled the ' + this.type + '-opacity` on',
		    	description : this.options.layer.getTitle() + ' (in project ' + this.options.project.getName() + ')',
		});
	},

	saveWidthDualBlur : function (max, min, absoluteMax, absoluteMin) {

		// set min/max
		var min = parseFloat(min || absoluteMin);	
		var max = parseFloat(max || absoluteMax);

		// don't save if no changes
		if (this.carto().width.range == [min, max]) return;

		// save carto
		this.carto().width.range = [min, max];

		// mark changed
		this.markChanged();

		// user event
		app.Socket.sendUserEvent({
		    	event : '`styled the ' + this.type + '-width` on',
		    	description : this.options.layer.getTitle() + ' (in project ' + this.options.project.getName() + ')',
		});
	},

	_closeColorRangeSelector : function () {
		var range = this._content[this.type].color.range;
		if (!range) return;

		var rangeSelector = range.dropdown._colorSelectorWrapper;
		var clickCatcher = range.dropdown._clicker;
		if (rangeSelector) Wu.DomUtil.addClass(rangeSelector, 'displayNone');
		if (clickCatcher) Wu.DomUtil.addClass(clickCatcher, 'displayNone');		
	},	

	_createCarto : function (json, callback) {

		// fn lives on styler
		this.options.styler.createCarto(json, callback);
	},

	_saveCarto : function (ctx, carto) {

		var layer = this.options.layer;

		// set style on layer
		layer.setStyling(this.options.carto);

		// get sql
		var sql = layer.getSQL();

		// request new layer
		var layerOptions = {
			css : carto, 
			sql : sql,
			layer : layer
		}

		// update
		this._updateLayer(layerOptions);		
	},

	_updateLayer : function (options, done) {
		var css = options.css,
		    layer = options.layer,
		    file_id = layer.getFileUuid(),
		    sql = options.sql,
		    project = this.options.project,
		    layerOptions = layer.store.data.postgis;

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

	_convertToFiveColors : function (colorArray) {

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

		// hack: bug if four colors, make three
		if (colorArray.length == 4) colorArray.pop();

		return colorArray;
	},

	hexAverage : function (twoHexes) {
		return twoHexes.reduce(function (previousValue, currentValue) {
			return currentValue
			.replace(/^#/, '')
			.match(/.{2}/g)
			.map(function (value, index) {
				return previousValue[index] + parseInt(value, 16);
			});
		}, [0, 0, 0])
		.reduce(function (previousValue, currentValue) {
			var newValue = this.padToTwo(Math.floor(currentValue / twoHexes.length).toString(16));
			return previousValue + newValue;
		}.bind(this), '#');
	},

	padToTwo : function (n) {
		if (n.length < 2) n = '0' + n;
		return n;
	},

	_validateDateFormat : function (key) {

		// Default fields that for some reason gets read as time formats...
		if ( key == 'the_geom_3857' || key == 'the_geom_4326' || key == '_columns' ) return false;

		// If it's Frano's time series format
		var m = moment(key, ["YYYYMMDD", moment.ISO_8601]).format("YYYY-MM-DD");
		if ( m != 'Invalid date' ) return m;

		// If it's other time format
		var m = moment(key).format("YYYY-MM-DD");
		if ( m != 'Invalid date' ) return m;

		// If it's not a valid date...
		return false;
	},

	_gradientStyle : function (colorArray) {
		var gradientStyle = 'background: -webkit-linear-gradient(left, ' + colorArray.join() + ');';
		gradientStyle    += 'background: -o-linear-gradient(right, '     + colorArray.join() + ');';
		gradientStyle    += 'background: -moz-linear-gradient(right, '   + colorArray.join() + ');';
		gradientStyle    += 'background: linear-gradient(to right, '     + colorArray.join() + ');';
		return gradientStyle;
	},

	_targetColumnSelected : function (e) {

		// get target index
		var target = e.target;
		var targets = this._content[this.type].targets.selectors;
		var i = _.findIndex(targets, function (t) {
			return t.column._select == target;
		});

		// get value
		var column = target.value;

		// set carto
		this.carto().targets[i].column = column;

		// mark changed
		this.markChanged();
	},

	_targetColorSelected : function (color, id, e) {

		// get target index
		var target = e.target;
		var targets = this._content[this.type].targets.selectors;
		var i = _.findIndex(targets, function (t) {
			return t.color.color == e;
		});

		// set carto
		this.carto().targets[i].color = color;

		// mark changed
		this.markChanged();
	},

	_targetValueSelected : function (e) {

		// get target index
		var target = e.target;
		var targets = this._content[this.type].targets.selectors;
		var i = _.findIndex(targets, function (t) {
			return t.value == e.target;
		});

		// get opacity value
		var value = e.target.value;

		// set carto
		this.carto().targets[i].value = value;

		// mark changed
		this.markChanged();
	},

	_targetOpacitySelected : function (e) {

		// get target index
		var target = e.target;
		var targets = this._content[this.type].targets.selectors;
		var i = _.findIndex(targets, function (t) {
			return t.opacity == e.target;
		});

		// get opacity value
		var opacity_value = parseFloat(e.target.value);

		// set carto
		this.carto().targets[i].opacity = opacity_value;

		// mark changed
		this.markChanged();
	},

	_targetWidthSelected : function (e) {

		// get target index
		var target = e.target;
		var targets = this._content[this.type].targets.selectors;
		var i = _.findIndex(targets, function (t) {
			return t.width == e.target;
		});

		// get width value
		var width_value = parseFloat(e.target.value);

		// set carto
		this.carto().targets[i].width = width_value;

		// mark changed
		this.markChanged();
	},


	_removeTarget : function (e) {

		// get target index
		var target = e.target;
		var targets = this._content[this.type].targets.selectors;
		var i = _.findIndex(targets, function (t) {
			return t.wrapper == target.parentNode.parentNode || t.wrapper == target.parentNode;
		});

		// remove div
		var trg = targets[i];
		var wrapper = trg.wrapper;
		Wu.DomUtil.remove(wrapper);

		// remove from carto
		_.pullAt(this.carto().targets, i);

		// remove from div list
		_.pullAt(targets, i);

		// mark changed
		this.markChanged();

	},

	_changeAddButtonText : function () {
		// change title of button (hacky)
		var button = Wu.DomUtil.get('target-text-' + this.type);
		button.innerHTML = 'Add column';
	},

	_addTargetColumn : function (e) {

		var defaultColumn = this.options.meta[2]; // first column

		// set default options
		var options = {
			column : defaultColumn, // default column
			value : '', 		// targeted column value
			color : 'red', 		// default color
			opacity : 1, 		// default opacity
			width : 5,
			operator : '='
		}

		// set values
		this.carto().targets.push({
			column : options.column,
			value : options.value,
			color : options.color,
			opacity : options.opacity,
			width : options.width,
			operator : options.operator
		});

		// create column
		this._createTargetColumn(null, options);

		// mark change
		this.markChanged();

		// change button text
		this._changeAddButtonText();
	},


	// create column targets
	_createTargets : function () {

		// create target field
		this.carto().targets = this.carto().targets || [];

		// create wrapper
		var wrapper = Wu.DomUtil.create('div', 'add-target-wrapper', this._wrapper);

		// create (+) box
		var addTarget = Wu.DomUtil.create('div', 'add-target', wrapper);
		addTarget.innerHTML = '<i class="fa fa-plus-circle add-target-icon"></i>';
		addTarget.innerHTML += '<div id="target-text-' + this.type + '" class="add-target-text">Target specific columns</div>';

		// event
		Wu.DomEvent.on(addTarget, 'click', this._addTargetColumn, this);

		// remember items
		this._content[this.type].targets = {
			wrapper : wrapper,
			addTarget : addTarget,
		}

		// fill already existing targets
		var targets = this.carto().targets;
		if (targets.length) {

			// add existing targets
			targets.forEach(function (t) {
				this._createTargetColumn(null, t);
			}, this);

			// change button text
			this._changeAddButtonText();
		}

	},


	_createTargetColumn : function (e, options) {

		// get columns
		var columnObjects = this.options.columns;
		var columns = [];

		// get column names only
		for (var c in columnObjects) {
			columns.push(c);
		}

		// head wrapper
		var wrapper = this._content[this.type].targets.wrapper;

		// create target wrapper
		var target_wrapper = Wu.DomUtil.create('div', 'target-wrapper', wrapper);


		// (-) button
		var rembtn_wrapper = Wu.DomUtil.create('div', 'target-remove', target_wrapper);
		rembtn_wrapper.innerHTML = '<i class="fa fa-minus-circle"></i>';
		
		// event
		Wu.DomEvent.on(rembtn_wrapper, 'click', this._removeTarget, this);	

		
		// column dropdown
		var column_wrapper = Wu.DomUtil.create('div', 'target-column-wrapper', target_wrapper);
		var column_title = Wu.DomUtil.create('div', 'target-column-title', column_wrapper, 'Column');
		var column_dropdown = new Wu.button({
			id 	 : 'target',
			type 	 : 'dropdown',
			isOn 	 : true,
			right 	 : true,
			appendTo : column_wrapper,
			fn 	 : this._targetColumnSelected.bind(this),
			array 	 : columns, // columns in dropdown
			selected : options.column, // preselected item
			className : 'target-column-dropdown tiny'
		});


		// < = > input
		var operator_wrapper = Wu.DomUtil.create('div', 'target-column-wrapper', target_wrapper);
		var operator_dropdown = new Wu.button({
			id 	 : 'equals_selection',
			type 	 : 'clicker',
			appendTo : operator_wrapper,
			fn 	 : this._operatorSelected.bind(this),
			array 	 : ['<', '=', '>'], // columns in dropdown
			selected : options.operator, // preselected item
			className : 'target-equals-clicker'
		});



		
		// value input
		var input_wrapper = Wu.DomUtil.create('div', 'target-input-wrapper', target_wrapper);
		var input_title = Wu.DomUtil.create('div', 'target-input-title', input_wrapper, 'Value');
		var column_input = Wu.DomUtil.create('input', 'target-input', input_wrapper);
		column_input.value = options.value;

		// blur event
		Wu.DomEvent.on(column_input, 'blur', this._targetValueSelected, this);



		// color ball
		var color_wrapper = Wu.DomUtil.create('div', 'target-color-wrapper', target_wrapper);
		var input_title = Wu.DomUtil.create('div', 'target-input-title', color_wrapper, 'Color');
		var ball = new Wu.button({
			id 	 : 'target-color',
			type 	 : 'colorball',
			right    : true,
			isOn 	 : true,
			appendTo : color_wrapper,
			fn       : this._targetColorSelected.bind(this),
			value    : options.color,
			colors   : this.options.palettes,
			className : 'target-color-box'
		});



		// opacity input
		var opacity_wrapper = Wu.DomUtil.create('div', 'target-opacity-wrapper', target_wrapper);
		var opacity_title = Wu.DomUtil.create('div', 'target-input-title-opacity', opacity_wrapper, 'Opacity');
		var opacity_input = Wu.DomUtil.create('input', 'target-input opacity', opacity_wrapper);
		opacity_input.value = options.opacity;

		// blur event
		Wu.DomEvent.on(opacity_input, 'blur', this._targetOpacitySelected, this);


		// width input
		var width_wrapper = Wu.DomUtil.create('div', 'target-width-wrapper', target_wrapper);
		var width_title = Wu.DomUtil.create('div', 'target-input-title-width', width_wrapper, 'Width');
		var width_input = Wu.DomUtil.create('input', 'target-input width', width_wrapper);
		width_input.value = options.width;

		// blur event
		Wu.DomEvent.on(width_input, 'blur', this._targetWidthSelected, this);


		// remember
		this._content[this.type].targets.selectors = this._content[this.type].targets.selectors || [];
		this._content[this.type].targets.selectors.push({
			column : column_dropdown,
			value : column_input,
			color : ball,
			opacity : opacity_input,
			width : width_input,
			wrapper : target_wrapper,
			operator : operator_dropdown
		});


		// move (+) btn to bottom
		var button = this._content[this.type].targets.addTarget;
		var bwrapper = this._content[this.type].targets.wrapper;
		wrapper.appendChild(button);

	},


	_operatorSelected : function (e, value) {

		// get target index
		var target = e.target;
		var targets = this._content[this.type].targets.selectors;
		var i = _.findIndex(targets, function (t) {
			return t.operator._button == e.target;
		});

		// set carto
		this.carto().targets[i].operator = value;

		// mark changed
		this.markChanged();
	},


});