Wu.button = Wu.Class.extend({

	initialize : function (options) {

		this.options = options;

		if ( options.type == 'switch' )     this.initSwitch();
		if ( options.type == 'set' ) 	    this.initSet();
		if ( options.type == 'setclear' )   this.initSetClear();
		if ( options.type == 'radio' )	    this.initRadio();
		if ( options.type == 'miniInput' )  this.initMiniInput();
		if ( options.type == 'dropdown')    this.initMiniDropDown();
		if ( options.type == 'colorball')   this.initColorBall();
		if ( options.type == 'colorrange')  this.initColorRange();
		if ( options.type == 'dualinput')   this.initDualInput();

	},

	
	// DUAL INPUT
	// DUAL INPUT
	// DUAL INPUT

	initDualInput : function () {

		var appendTo    = this.options.appendTo,
		    key         = this.options.id,
		    right       = this.options.right,
		    value       = this.options.value,
		    minmax 	= this.options.minmax,
		    tabindex    = this.options.tabindex
		    className   = this.options.className,
		    fn          = this.options.fn;


		var _class = 'chrome-field-mini-input mini-input-dual ';
		if ( className ) _class += className;

		var miniInputMax = Wu.DomUtil.createId('input', 'field_mini_input_max_' + key, appendTo);
		miniInputMax.className = _class;
		miniInputMax.setAttribute('placeholder', 'auto');

		miniInputMax.setAttribute('tabindex', tabindex[1]);

		if ( minmax ) miniInputMax.setAttribute('placeholder', minmax[1]);
		if ( value  ) miniInputMax.value = value[1];

		Wu.DomEvent.on(miniInputMax, 'blur', function () { this.saveDualBlur(miniInputMax, miniInputMin, minmax[1], minmax[0], this.options) }.bind(this), this);

		// Force numeric
		miniInputMax.onkeypress = this.forceNumeric;

		var miniInputMin = Wu.DomUtil.createId('input', 'field_mini_input_min_' + key, appendTo);
		miniInputMin.className = 'chrome-field-mini-input mini-input-dual';
		miniInputMin.setAttribute('placeholder', 'auto');

		miniInputMin.setAttribute('tabindex', tabindex[0]);

		if ( minmax ) miniInputMin.setAttribute('placeholder', minmax[0]);
		if ( value  ) miniInputMin.value = value[0];

		Wu.DomEvent.on(miniInputMin, 'blur', function () { this.saveDualBlur(miniInputMax, miniInputMin, minmax[1], minmax[0], this.options) }.bind(this), this);

		// Force numeric
		miniInputMin.onkeypress = this.forceNumeric;


	},

	saveDualBlur : function (maxElem, minElem, absoluteMax, absoluteMin, options) {

		var fn      = options.fn,
		    key     = options.key;

		fn(maxElem.value, minElem.value, absoluteMax, absoluteMin)

	},


	// COLOR RANGE
	// COLOR RANGE
	// COLOR RANGE

	initColorRange : function () {

		var appendTo    = this.options.appendTo,
		    key         = this.options.id,
		    right       = this.options.right,
		    value       = this.options.value,
		    presetFn    = this.options.presetFn,
		    className   = this.options.className,
		    customFn    = this.options.customFn;

		// Set styling
		var gradientStyle = this._gradientStyle(value);

		var _class = 'chrome-color-range-wrapper ';
		if ( className ) _class += className;

		var colorRangeWrapper = Wu.DomUtil.create('div', _class, appendTo)
		    colorRangeWrapper.setAttribute('key', key);

		var color = Wu.DomUtil.create('div', 'chrome-color-range', colorRangeWrapper);
		color.id = 'chrome-color-range_' + key;
		color.setAttribute('key', key);
		color.setAttribute('style', gradientStyle);

		var clickCatcher = Wu.DomUtil.create('div', 'click-catcher displayNone', appendTo);
		    clickCatcher.id = 'click-catcher-' + key;
		    clickCatcher.setAttribute('key', key);

		var colorSelectorWrapper = Wu.DomUtil.create('div', 'chrome-color-selector-wrapper displayNone', colorRangeWrapper);
		    colorSelectorWrapper.id = 'chrome-color-selector-wrapper-' + key;


		var colorBallWrapper = Wu.DomUtil.create('div', 'chrome-color-ball-wrapper', colorSelectorWrapper)

		var colorBall_3 = Wu.DomUtil.create('div', 'chrome-color-ball color-range-ball rangeball-3', colorBallWrapper);
		    colorBall_3.id = 'color-range-ball-3-' + key;
		    colorBall_3.style.background = value[4];
		    colorBall_3.setAttribute('hex', value[4]);
		    
		var colorBall_2 = Wu.DomUtil.create('div', 'chrome-color-ball color-range-ball rangeball-2', colorBallWrapper);
		    colorBall_2.id = 'color-range-ball-2-' + key;
		    colorBall_2.style.background = value[2];
		    colorBall_2.setAttribute('hex', value[2]);

		var colorBall_1 = Wu.DomUtil.create('div', 'chrome-color-ball color-range-ball rangeball-1', colorBallWrapper);
		    colorBall_1.id = 'color-range-ball-1-' + key;
		    colorBall_1.style.background = value[0];
		    colorBall_1.setAttribute('hex', value[0]);

		    
		this.initSpectrum(this, value[0], colorBall_1, key, customFn);
		this.initSpectrum(this, value[2], colorBall_2, key, customFn);
		this.initSpectrum(this, value[4], colorBall_3, key, customFn);


		// Color range presets
		// Color range presets
		// Color range presets

		var colorRangePresetWrapper = Wu.DomUtil.create('div', 'color-range-preset-wrapper', colorSelectorWrapper);

		var colorRangesPresets = [
			['#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff'],
			['#0000ff', '#00ffff', '#00ff00', '#ffff00', '#ff0000'],

			['#ff0000', '#a5ff00', '#003dff'],

			['#ff0000', '#ffff00', '#00ff00'], 		// todo: throws error if 4 colors..	
			['#00ff00', '#ffff00', '#ff0000'],

			['#ff007d', '#ffff00', '#007dff'],
			['#ff7d00', '#ffff00', '#00ff7d'],
			['#ff00ff', '#ffff00', '#00ffff'],
			['#ffff00', '#ff00ff', '#00ffff'],
			['#ff007d', '#ffff00'],
			['#0000ff', '#ffff00'],
			['#ff7d00', '#00ff00']
		]


		colorRangesPresets.forEach(function(preset, i) {

			var gradientStyle = this._gradientStyle(preset);
			var colorRangePreset = Wu.DomUtil.create('div', 'color-range-preset', colorRangePresetWrapper);
			    colorRangePreset.id = 'color-range-preset-' + i;
			    colorRangePreset.setAttribute('style', gradientStyle);
			    colorRangePreset.setAttribute('hex', preset.join(','));

			    Wu.DomEvent.on(colorRangePreset, 'click', presetFn);

		}.bind(this))


		Wu.DomEvent.on(color, 'click', this.toggleColorRange, this);
		Wu.DomEvent.on(clickCatcher, 'click', this.stopEditingColorRange, this);

	},

	toggleColorRange : function (e) {
	        
		var key = e.target.getAttribute('key');

		var rangeSelector = Wu.DomUtil.get('chrome-color-selector-wrapper-' + key);
		var clickCatcher = Wu.DomUtil.get('click-catcher-' + key);

		Wu.DomUtil.removeClass(rangeSelector, 'displayNone');
		Wu.DomUtil.removeClass(clickCatcher, 'displayNone');

	},

	stopEditingColorRange : function (e) {

		var key = e.target.getAttribute('key');

		var rangeSelector = Wu.DomUtil.get('chrome-color-selector-wrapper-' + key);
		var clickCatcher = Wu.DomUtil.get('click-catcher-' + key);

		Wu.DomUtil.addClass(rangeSelector, 'displayNone');
		Wu.DomUtil.addClass(clickCatcher, 'displayNone');

	},

	_gradientStyle : function (colorArray) {

		var gradientStyle = 'background: -webkit-linear-gradient(left, ' + colorArray.join() + ');';
		gradientStyle    += 'background: -o-linear-gradient(right, '     + colorArray.join() + ');';
		gradientStyle    += 'background: -moz-linear-gradient(right, '   + colorArray.join() + ');';
		gradientStyle    += 'background: linear-gradient(to right, '     + colorArray.join() + ');';

		return gradientStyle;

	},		


	// COLOR BALL
	// COLOR BALL
	// COLOR BALL

	initColorBall : function () {

		var appendTo    = this.options.appendTo,
		    key         = this.options.id,
		    fn          = this.options.fn,
		    right       = this.options.right,
		    on          = this.options.isOn,
		    className   = this.options.className,
		    value       = this.options.value;

		var _class = 'chrome-color-ball ';
		if ( className ) _class += className;

		var color = Wu.DomUtil.create('div', _class, appendTo);
		color.id = 'color_ball_' + key;
		color.style.background = value;

		if ( !on ) Wu.DomUtil.addClass(color, 'disable-color-ball');
		if ( !right ) Wu.DomUtil.addClass(color, 'left-ball');

		
		// var that = this;
		this.initSpectrum(value, color, key, fn)

	},


	initSpectrum : function (hex, wrapper, key, fn) {


		$(wrapper).spectrum({
			color: hex,
			preferredFormat: 'hex',
			showInitial: true,
			showAlpha: false,
			chooseText: 'Choose',
			cancelText: 'Cancel',
			containerClassName: 'dark clip',
			change: function(hex) {

				var r = Math.round(hex._r).toString(16);
				var g = Math.round(hex._g).toString(16);
				var b = Math.round(hex._b).toString(16);

				if ( r.length == 1 ) r += '0';
				if ( g.length == 1 ) g += '0';
				if ( b.length == 1 ) b += '0';

				var hex = '#' + r + g + b;

				wrapper.style.background = hex;

				fn(hex, key, wrapper);
			}
		});

	},	


	// MINI DROP DOWN
	// MINI DROP DOWN
	// MINI DROP DOWN

	initMiniDropDown : function () {

		var appendTo    = this.options.appendTo,
		    key         = this.options.id,
		    fn          = this.options.fn,
		    right       = this.options.right,
		    array 	= this.options.array,
		    selected    = this.options.selected,
		    reversed    = this.options.reversed,
		    className   = this.options.className;

		var _class = 'chrome chrome-mini-dropdown active-field select-field-wrap ';
		if ( className ) _class += className;

		// create dropdown
		var selectWrap = this.container = Wu.DomUtil.create('div', _class, appendTo);
		var select = this._select = Wu.DomUtil.create('select', 'active-field-select', selectWrap);
		select.setAttribute('key', key);

		// if ( selected ) 
		if ( reversed ) {
			if ( !selected ) Wu.DomUtil.addClass(selectWrap, 'full-width');
		} else {
			if ( selected )  Wu.DomUtil.addClass(selectWrap, 'full-width');
		}


		// placeholder
		var option = Wu.DomUtil.create('option', '', select);
		option.innerHTML = 'Select column...';
		option.setAttribute('disabled', '');
		option.setAttribute('selected', '');


		// fill select options
		array.forEach(function (field) {
			var option = Wu.DomUtil.create('option', 'active-layer-option', select);
			option.value = field;
			option.innerHTML = field;

			if ( field == selected ) option.selected = true;
		});	

		// select event
		Wu.DomEvent.on(select, 'change', fn); // todo: mem leak?


	},

	// MINI INPUT
	// MINI INPUT
	// MINI INPUT

	initMiniInput : function () {

		var appendTo    = this.options.appendTo,
		    key         = this.options.id,
		    fn          = this.options.fn,
		    value       = this.options.value,
		    placeholder = this.options.placeholder,
		    tabindex    = this.options.tabindex,
		    right       = this.options.right,
		    className   = this.options.className,
		    isOn        = this.options.isOn,
		    allowText   = this.options.allowText;


		var _class = 'chrome-field-mini-input ';
		if ( className ) _class += className;

		// create
		var miniInput = Wu.DomUtil.createId('input', 'field_mini_input_' + key, appendTo);
		miniInput.className = _class;
		miniInput.setAttribute('placeholder', placeholder);
		miniInput.setAttribute('tabindex', tabindex);
		
		// set value
		if (value) miniInput.value = value;

		// other options
		if ( !right ) Wu.DomUtil.addClass(miniInput, 'left-mini');
		if ( !isOn  ) Wu.DomUtil.addClass(miniInput, 'left-mini-kill');

		// set event
		Wu.DomEvent.on(miniInput, 'blur', fn);

		// Force numeric
		if ( !allowText ) miniInput.onkeypress = this.forceNumeric;		    

	},


	forceNumeric : function (e) {

		// only allow '0-9' + '.' and '-'
		return e.charCode >= 45 && e.charCode <= 57 && e.charCode != 47;

	},	

	// RADIO RADIO RADIO
	// RADIO RADIO RADIO
	// RADIO RADIO RADIO		

	initRadio : function () {

		var appendTo  = this.options.appendTo,
		    key       = this.options.id,
		    fn        = this.options.fn,
		    className = this.options.className,
		    on        = this.options.isOn;

		var _class = 'layer-radio ';
		if ( className ) _class += className;

		var radio = Wu.DomUtil.create('div', _class, appendTo);
		radio.id = 'radio_' + key;

		if ( on ) {
			Wu.DomUtil.addClass(radio, 'radio-on');
			radio.setAttribute('state', 'true');
		} else {
			radio.setAttribute('state', 'false');
		}

		Wu.DomEvent.on(radio, 'click', this.toggleRadio, this);

		return radio;

	},

	toggleRadio : function (e) {

		var elem = e.target,
		    key = elem.getAttribute('key'),
		    on = elem.getAttribute('state');

		if ( on == 'false' ) {
			Wu.DomUtil.addClass(elem, 'radio-on');
			elem.setAttribute('state', 'true');
		} else {
			Wu.DomUtil.removeClass(elem, 'radio-on');
			elem.setAttribute('state', 'false');
		}

		this.options.fn(e);

	},


	// SET SET SET
	// SET SET SET
	// SET SET SET		

	initSet : function () {

		var appendTo  = this.options.appendTo,
		    key       = this.options.id,
		    className = this.options.className,
		    fn        = this.options.fn;

		var _class = 'chrome-set ';
		if ( className ) _class += className;

		// create
		var set = Wu.DomUtil.create('div', _class, appendTo);
		set.setAttribute('key', key);
		set.innerHTML = 'SET';

		Wu.DomEvent.on(set, 'click', this.toggleSet, this);

		return set;

	},


	toggleSet : function (e) {

		var elem = e.target,
		    key = elem.getAttribute('key');

		this.options.fn(key);

	},


	// SET/CLEAR SET/CLEAR SET/CLEAR
	// SET/CLEAR SET/CLEAR SET/CLEAR
	// SET/CLEAR SET/CLEAR SET/CLEAR

	initSetClear : function () {

		var appendTo  = this.options.appendTo,
		    key       = this.options.id,
		    fn        = this.options.fn,
		    className = this.options.className, 
		    isOn      = this.options.isOn;	

		var _class = 'setClear ';
		if ( className ) _class += className;

		// create
		var setClear = Wu.DomUtil.create('div', _class, appendTo);
		setClear.setAttribute('key', key);
		setClear.innerHTML = 'SET';

		// if on, mark
		if (isOn) {
			Wu.DomUtil.addClass(setClear, 'setClear-on');
			setClear.setAttribute('state', 'true');
			setClear.innerHTML = 'CLEAR';
		} else {
			setClear.setAttribute('state', 'false');
		}

		Wu.DomEvent.on(setClear, 'click', this.toggleSetClear, this);

		return setClear;

	},


	toggleSetClear : function (e) {

		var elem  = e.target,
		    id    = elem.id,
		    key   = elem.getAttribute('key'),
		    state = elem.getAttribute('state'),
		    on 	  = (state == 'true');

		if (on) {
			Wu.DomUtil.removeClass(elem, 'setClear-on');
			elem.setAttribute('state', 'false');
			elem.innerHTML = 'SET';
			var isOn = false;
		} else {
			Wu.DomUtil.addClass(elem, 'setClear-on');
			elem.setAttribute('state', 'true');
			elem.innerHTML = 'CLEAR';
			var isOn = true;
		}

		this.options.fn(key, isOn);
	},	


	// SWITCH SWITCH SWITCH
	// SWITCH SWITCH SWITCH
	// SWITCH SWITCH SWITCH

	initSwitch : function () {

		var isOn      = this.options.isOn,
		    right     = this.options.right,
		    id        = this.options.id,
		    appendTo  = this.options.appendTo,
		    fn        = this.options.fn,
		    className = this.options.className,
		    disabled  = this.options.disabled;

		this.value = id;

		// Create classname
		var divclass = 'chrome-switch-container';
		if (isOn) divclass += ' switch-on';
		if (right) divclass += ' right-switch'
		if (disabled) divclass += ' disabled-switch';
		if (className) divclass += ' ' + className;

		// Create button
		var _switch = this._switch= Wu.DomUtil.create('div', divclass, appendTo);
		_switch.setAttribute('key', id);
		_switch.id = 'switch_' + id;

		// Set on/off state
		if (isOn) {
			_switch.setAttribute('state', 'true');
		} else {
			_switch.setAttribute('state', 'false');
		}

		// Add hooks
		if ( !disabled ) Wu.DomEvent.on(_switch, 'click', this.toggleSwitch, this);		    

		return _switch;

	},


	// Toggle switch
	toggleSwitch : function (e) {

		var stateAttrib = e.target.getAttribute('state'),
		    on          = (stateAttrib == 'true'),
		    key         = e.target.getAttribute('key');

		if (on) {
			e.target.setAttribute('state', 'false');
			Wu.DomUtil.removeClass(e.target, 'switch-on');
			var isOn = false;

		} else {
			e.target.setAttribute('state', 'true');
			Wu.DomUtil.addClass(e.target, 'switch-on');
			var isOn = true;
		}	

		// save
		this.options.fn(e, isOn)
	},	

});


Wu.fieldLine = Wu.Class.extend({

	initialize : function (options) {

		this._initContent(options);

		// return this;

	},

	_initContent : function (options) {

		var key          = options.id,
		    appendTo     = options.appendTo,
		    title        = options.title,
		    fn           = options.fn,
		    input        = options.input,
		    className    = options.className ? options.className : '',
		    childWrapper = options.childWrapper;


		var cName = 'chrome-metafield-line ' + className;
		this.container = Wu.DomUtil.create('div', cName, appendTo);
		this.container.id = 'field_wrapper_' + key;

		// Children container
		if ( childWrapper ) {
			this.childWrapper = Wu.DomUtil.create('div', 'chrome-metafield-line-children', appendTo);
			this.childWrapper.id = childWrapper;
		}

		// Create input field
		if ( input ) {
			
			// create
			var fieldName = Wu.DomUtil.createId('input', 'field_input_' + key, this.container);
			fieldName.className = 'chrome-field-input';
			fieldName.setAttribute('name', 'field_input_' + key);
			fieldName.setAttribute('placeholder', key);

			// set title 
			if (title) fieldName.value = title;

			// set event
			Wu.DomEvent.on(fieldName, 'blur', fn);
		
		
		} else {

			// Create "normal" text line
			var fieldName = Wu.DomUtil.create('div', 'chrome-field-line', this.container);
			fieldName.innerHTML = title ? title : key;
		}

		return this.container;
	},

})








