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

	
	_preSelectOptions : function () {

		// open relevant subfields
		this._initSubfields(this.carto().color.column, 'color');
		this._initSubfields(this.carto().opacity.column, 'opacity');
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
		if (this.carto().color.value == colors) return;

		// save carto
		this.carto().color.value = colors;

		// close popup
		this._closeColorRangeSelector(); 

		// UPDATE
		this._updateStyle();

	},

	_closeColorRangeSelector : function () {
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
		if ( this.carto().color.value[0] == colorArray[0] &&
		     this.carto().color.value[1] == colorArray[1] && 
		     this.carto().color.value[2] == colorArray[2] &&
		     this.carto().color.value[3] == colorArray[3] &&
		     this.carto().color.value[4] == colorArray[4] ) {

			return;
		}

		// Store in JSON
		this.carto().color.value = colorArray;		

		// UPDATE
		this._updateStyle();		

	},

});