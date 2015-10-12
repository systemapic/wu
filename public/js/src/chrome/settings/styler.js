Wu.Styler = Wu.Class.extend({

	options :  {
		defaultRange : ['#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff'],
		defaultStaticValue : '#FF33FF',
		dropdown : {
			staticText : 'Fixed value',
			staticDivider : '-'
		},
	},

	_content : {},

	initialize : function (options) {

		// set options
		Wu.setOptions(this, options);

		// init container
		this._initContainer();
	},

	_initContainer : function () {

		// create 
		this.options.carto[this.type] = this.options.carto[this.type] || {};

		this._content[this.type] = {};

		// Get on/off state
		var isOn = this.options.carto[this.type].enabled;

		// Create wrapper
		this._wrapper = Wu.DomUtil.create('div', 'chrome-content-section-wrapper', this.options.container);

		// wrapper
		var line = new Wu.fieldLine({
			id           : this.type,
			appendTo     : this._wrapper,
			title        : '<b>' + this.type.camelize() + 's</b>',
			input        : false,
		});		

		// switch button
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
		this._updateStyle();
	},

	_toggle : function (on) {
		on ? this._enable() : this._disable();
	},

	_enable : function () {

		// set enabled
		this.options.carto[this.type].enabled = true;
		
		// create options
		this._createOptions();

		// select options
		this._selectOptions();
	},

	_disable : function () {
		this.options.carto[this.type].enabled = false;
		this._clearOptions();
	},

	_updateStyle : function () {

		console.log('updateStyle', this.options.carto);

		// create carto css
		this._createCarto(this.options.carto, this._saveCarto.bind(this));
	},

	// create color part
	_createColor : function () {

		// create color field
		this.options.carto[this.type].color = this.options.carto[this.type].color || {};

		// get states
		var isOn         = this.options.carto[this.type].color.range;
		var staticVal    = this.options.carto[this.type].color.staticVal || this.options.defaultStaticValue;
		var val          = this.options.carto[this.type].color.value || this.options.defaultRange;
		var range        = this.options.carto[this.type].color.range;
		var minMax       = this.options.carto[this.type].color.minMax;
		var customMinMax = this.options.carto[this.type].color.customMinMax;

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
			selected : range, // preselected item
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
		});

		// remember items
		this._content[this.type].color = {
			line : line,
			dropdown : dropdown,
			ball : ball
		}

		// save carto
		this.options.carto[this.type].color = {
			range 	     : range,
			minMax 	     : minMax,
			customMinMax : customMinMax,
			staticVal    : staticVal,
			value 	     : val
		};
	},

	// create opacity 
	_createOpacity : function () {

		// create opacity field
		this.options.carto[this.type].opacity = this.options.carto[this.type].opacity || {};

		// get states
		var isOn   = this.options.carto[this.type].opacity.range;
		var val    = this.options.carto[this.type].opacity.value || 1;
		var range  = this.options.carto[this.type].opacity.range;

		// Container
		var line = new Wu.fieldLine({
			id       : 'opacity',
			appendTo : this._wrapper,
			title    : '<b>Opacity</b>',
			input    : false,
		});	

		// Dropdown
		var dropdown = new Wu.button({
			id 	 : 'opacity',
			type 	 : 'dropdown',
			right 	 : true,
			appendTo : line.container,
			fn 	 : this._dropdownSelected.bind(this),
			array 	 : this.options.meta,
			selected : range,
		});

		// Input
		var input = new Wu.button({
			id 	    : 'opacity',
			type 	    : 'miniInput',
			right 	    : true,
			isOn        : isOn,
			appendTo    : line.container,
			value       : val,
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
		this.options.carto[this.type].opacity = {
			range 	    : range,
			value 	    : val
		};
	},

	// point size
	_createPointsize : function () {

		// Create JSON obj if it's not already there
		this.options.carto[this.type].pointsize = this.options.carto[this.type].pointsize || {};

		// Get stores states
		var isOn   = this.options.carto[this.type].pointsize.range;
		var val    = this.options.carto[this.type].pointsize.value || 1.2;
		var range  = this.options.carto[this.type].pointsize.range;
		var minMax = this.options.carto[this.type].pointsize.minMax;

		// Container
		var line = new Wu.fieldLine({
			id           : 'pointsize',
			appendTo     : this._wrapper,
			title        : '<b>Point size</b>',
			input        : false,
			childWrapper : 'point-size-children'
		});	

		// Dropdown
		var dropdown = new Wu.button({
			id 	 : 'pointsize',
			type 	 : 'dropdown',
			right 	 : true,
			appendTo : line.container,
			fn 	 : this._dropdownSelected.bind(this),
			array 	 : this.options.meta,
			selected : range,
		});

		// Input
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
		this.options.carto[this.type].pointsize = {
			range 	    : range,
			minMax 	    : minMax,			
			value 	    : val
		};
	},

	_updateColor : function (hex, key, wrapper) {

		console.log('_updateColor', hex);

		// save carto
		this.options.carto[this.type].color.staticVal = hex;

		// Close
		this._closeColorRangeSelector(); // changed from _closeColorRange..

		// update
		this._updateStyle();		
	},

	_updateOpacity : function (e) {

		var value = parseFloat(e.target.value);
		var key   = e.target.id.slice(17, e.target.id.length); 	// todo: remove these also. 
		var pre = key.substring(0,4);				// whole object is now available in this._content[this.type].opacity.input
									// eg. id = this._content[this.type].opacity.input.id, etc..
		if (pre == 'min_' || pre == 'max_') {
			key = key.slice(4, key.length);
		}

		// Get field 
		var inputField = this._content[this.type].opacity.input.input;

		// If more than one, make it one
		if ( value > 1  && value < 10  ) value = 1;
		if ( value > 10 && value < 100 ) value = value/100;
		if ( value > 100 ) 	         value = 1;
		
		// Set value in input
		inputField.value = value;

		// don't save if unchanged
		if (this.options.carto[this.type].opacity.value == value) return;

		// save carto
		this.options.carto[this.type].opacity.value = value;

		// update
		this._updateStyle();
		
	},

	saveColorRangeDualBlur : function (max, min, absoluteMax, absoluteMin) {

		// get values
		max = max || absoluteMax;
		min = min || absoluteMin;

		// save carto
		this.options.carto[this.type].color.customMinMax = [min, max];
		
		// update		
		this._updateStyle();
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


	_initOpenFields : function (options, key) {
		console.log('_initOpenFields', options, key);
		
		if (key == 'color')     this._initColorFields(options, key);
		if (key == 'pointsize') this._initPointSizeFields(options, key);
	},

	_initColorFields : function(options, key) {

		var colorRange = options.colorRange;

		if (!colorRange) return;
		if (colorRange == this.options.dropdown.staticText)    return;
		if (colorRange == this.options.dropdown.staticDivider) return;
		
		this._addExtras(key, colorRange);
	},

	_initPointSizeFields : function (options, key) {		

		var pointSizeRange = options.pointSizeRange;

		if (!pointSizeRange) 	return;
		if (pointSizeRange == this.options.dropdown.staticText)    return;
		if (pointSizeRange == this.options.dropdown.staticDivider) return;
		
		this._addExtras(key, pointSizeRange);	
	},

	_addExtras : function (key, fieldName) {

		// ADD COLOR FIELDS
		if ( key == 'color' ) this._addColorFields(key, fieldName);
		
		// ADD POINT SIZE FIELDS
		if ( key == 'pointsize') this._addPointSizeFields(key, fieldName);
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

		// hack: bug if four colors, override
		if (colorArray.length == 4) {
			colorArray = ['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff'];
		}

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

});