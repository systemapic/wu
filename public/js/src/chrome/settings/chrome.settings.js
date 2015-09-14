Wu.Chrome.SettingsContent = Wu.Chrome.extend({

	_initialize : function () {

		console.log('chrome.content');

	},

	initLayout : function () {

	},

	_addEvents : function () {

		var trigger = this.options.trigger;
		if (trigger) {
			Wu.DomEvent.on(trigger, 'click', this.show, this);
		}

		Wu.DomEvent.on(window, 'resize', this._windowResize, this);
	},

	_removeEvents : function () {
		Wu.DomEvent.off(window, 'resize', this._windowResize, this);
	},

	_windowResize : function () {

	},

	_onLayerAdded : function () {
		this._refresh();
	},

	_onLayerEdited : function () {
		this._refresh();
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

	hide : function () {
		this._container.style.display = 'none';
		Wu.DomUtil.removeClass(this.options.trigger, 'active-tab');
	},

	hideAll : function () {
		if (!this.options || !this.options.parent) return console.log('hideAll not possible');

		var tabs = this.options.parent.getTabs();
		for (var t in tabs) {
			var tab = tabs[t];
			tab.hide();
		}

		// Hides the "add folder" in layer menu
		this._hideLayerEditor();

	},
	
	// Hides the "add folder" in layer menu
	_hideLayerEditor : function () {
		var layerMenu = app.MapPane.getControls().layermenu;
		if (layerMenu) layerMenu.disableEdit();
	},

	_projectSelected : function (e) {
		var p = e.detail.projectUuid;
		if (!p) return;

		// set project
		this._project = app.activeProject = app.Projects[p];

		// refresh pane
		this._refresh();
	},


	_refresh : function () {
	},

	_initLayout_activeLayers : function (title, subtitle, container) {

		var title = title || 'Layer';
		var subtitle = subtitle || 'Select a layer to style...';

		// active layer wrapper
		var wrap = this._activeLayersWrap = Wu.DomUtil.create('div', 'chrome chrome-content styler-content active-layer wrapper', container);

		// title
		var title = Wu.DomUtil.create('div', 'chrome chrome-content active-layer title', wrap, title);
		
		// create dropdown
		var selectWrap = Wu.DomUtil.create('div', 'chrome chrome-content active-layer select-wrap', wrap);
		var select = this._select = Wu.DomUtil.create('select', 'active-layer-select', selectWrap);

		// get layers
		var layers = this._project.getPostGISLayers();

		// placeholder
		var option = Wu.DomUtil.create('option', '', select);
		option.innerHTML = subtitle;
		option.setAttribute('disabled', '');
		option.setAttribute('selected', '');

		// fill select options
		layers.forEach(function (layer) {
			var option = Wu.DomUtil.create('option', 'active-layer-option', select);
			option.value = layer.getUuid();
			option.innerHTML = layer.getTitle();
		});	

		// select event
		Wu.DomEvent.on(select, 'change', this._selectedActiveLayer, this); // todo: mem leak?


		return select;

	},


	_storeActiveLayerUuid : function (uuid) {
		app.Chrome.Right.options.editingLayer = uuid;
	},

	_getActiveLayerUuid : function () {
		var uuid;
		app.Chrome.Right.options.editingLayer ? uuid = app.Chrome.Right.options.editingLayer : uuid = false;
		return uuid;
	},

	opened : function () {
	},

	closed : function () {
		
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

			// move into view
			this._layer.flyTo();
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



	// Creates one meta field line, with input, switch, etc
	_createMetaFieldLine : function (options) {

		var key 	= options.key,
		    wrapper 	= options.wrapper,
		    input 	= options.input,
		    right 	= options.rightPos,
		    isOn 	= options.isOn,
		    title 	= options.title,
		    type 	= options.type,
		    dropArray   = options.dropArray,
		    color 	= options.color,
		    val 	= options.value;

		var fieldWrapper = Wu.DomUtil.create('div', 'chrome-metafield-line', wrapper);
		fieldWrapper.id = 'field_wrapper_' + key;

		// Create switch
		if (type == 'switch') {
	
			// Create classname
			var divclass = 'chrome-switch-container';
			if (isOn) divclass += ' switch-on';
			if (right) divclass += ' right-switch';

			// Create button
			var fieldSwitch = Wu.DomUtil.create('div', divclass, fieldWrapper);
			fieldSwitch.setAttribute('key', key);
			fieldSwitch.id = 'field_switch_' + key;

			// Set on/off state
			if (isOn) {
				fieldSwitch.setAttribute('state', 'true');
			} else {
				fieldSwitch.setAttribute('state', 'false');
			}

			// Add hooks
			Wu.DomEvent.on(fieldSwitch, 'click', this.toggleSwitch, this);		    

		}

		if (type == 'miniInput') {

			// create
			var miniInput = Wu.DomUtil.createId('input', 'field_mini_input_' + key, fieldWrapper);
			miniInput.className = 'chrome-field-mini-input';
			miniInput.setAttribute('placeholder', 'auto');

			miniInput.setAttribute('tabindex', options.tabindex);
			

			// set value
			if (options.value) miniInput.value = val;

			// other options
			if ( !right ) Wu.DomUtil.addClass(miniInput, 'left-mini');
			if ( !isOn  ) Wu.DomUtil.addClass(miniInput, 'left-mini-kill');			    

			// set event
			Wu.DomEvent.on(miniInput, 'blur', this.saveMiniBlur, this);

			// Force numeric
			// TODO: Write this into class.js
			miniInput.onkeypress = this.forceNumeric;
		}


		if ( type == 'dualMiniInput' ) {

			var miniInputMax = Wu.DomUtil.createId('input', 'field_mini_input_max_' + key, fieldWrapper);
			miniInputMax.className = 'chrome-field-mini-input mini-input-dual';
			miniInputMax.setAttribute('placeholder', 'auto');

			miniInputMax.setAttribute('tabindex', options.tabindex[1]);

			if ( options.minMax ) miniInputMax.setAttribute('placeholder', options.minMax[1]);
			if ( options.value  ) miniInputMax.value = val[1];

			Wu.DomEvent.on(miniInputMax, 'blur', this.saveMiniBlur, this);

			// Force numeric
			// TODO: Write this into class.js
			miniInputMax.onkeypress = this.forceNumeric;


			var miniInputMin = Wu.DomUtil.createId('input', 'field_mini_input_min_' + key, fieldWrapper);
			miniInputMin.className = 'chrome-field-mini-input mini-input-dual';
			miniInputMin.setAttribute('placeholder', 'auto');

			miniInputMin.setAttribute('tabindex', options.tabindex[0]);

			if ( options.minMax ) miniInputMin.setAttribute('placeholder', options.minMax[0]);
			if ( options.value  ) miniInputMin.value = val[0];

			Wu.DomEvent.on(miniInputMin, 'blur', this.saveMiniBlur, this);

			// Force numeric
			// TODO: Write this into class.js
			miniInputMin.onkeypress = this.forceNumeric;		

		}


		if (type == 'setClear') {

			// create
			var setClear = Wu.DomUtil.create('div', 'setClear', fieldWrapper);
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

			// set event
			Wu.DomEvent.on(setClear, 'click', this.toggleSetClear, this);

		}


		if (type == 'set') {

			// create
			var setClear = Wu.DomUtil.create('div', 'chrome-set', fieldWrapper);
			setClear.setAttribute('key', key);
			setClear.innerHTML = 'SET';

			// set event
			Wu.DomEvent.on(setClear, 'click', this.toggleSet, this);
		}

		if ( type == 'color' ) {

			var color = Wu.DomUtil.create('div', 'chrome-color-ball', fieldWrapper);
			color.id = 'color_ball_' + key;
			color.style.background = val;

			if ( !isOn ) Wu.DomUtil.addClass(color, 'disable-color-ball');
			if ( !right ) Wu.DomUtil.addClass(color, 'left-ball');

			
			// var that = this;
			this.initSpectrum(this, val, color, key)
			
		}
	
		if ( type == 'colorrange' ) {

			// Set styling
			var gradientStyle = this._gradientStyle(val);

			var colorRangeWrapper = Wu.DomUtil.create('div', 'chrome-color-range-wrapper', fieldWrapper)
			    colorRangeWrapper.setAttribute('key', key);

			var color = Wu.DomUtil.create('div', 'chrome-color-range', colorRangeWrapper);
			color.id = 'chrome-color-range_' + key;
			color.setAttribute('key', key);
			color.setAttribute('style', gradientStyle);

			var clickCatcher = Wu.DomUtil.create('div', 'click-catcher displayNone', fieldWrapper);
			    clickCatcher.id = 'click-catcher-' + key;
			    clickCatcher.setAttribute('key', key);

			var colorSelectorWrapper = Wu.DomUtil.create('div', 'chrome-color-selector-wrapper displayNone', colorRangeWrapper);
			    colorSelectorWrapper.id = 'chrome-color-selector-wrapper-' + key;


			var colorBallWrapper = Wu.DomUtil.create('div', 'chrome-color-ball-wrapper', colorSelectorWrapper)

			var colorBall_3 = Wu.DomUtil.create('div', 'chrome-color-ball color-range-ball rangeball-3', colorBallWrapper);
			    colorBall_3.id = 'color-range-ball-3-' + key;
			    colorBall_3.style.background = val[2];
			    colorBall_3.setAttribute('hex', val[2]);
			    
			var colorBall_2 = Wu.DomUtil.create('div', 'chrome-color-ball color-range-ball rangeball-2', colorBallWrapper);
			    colorBall_2.id = 'color-range-ball-2-' + key;
			    colorBall_2.style.background = val[1];
			    colorBall_2.setAttribute('hex', val[1]);

			var colorBall_1 = Wu.DomUtil.create('div', 'chrome-color-ball color-range-ball rangeball-1', colorBallWrapper);
			    colorBall_1.id = 'color-range-ball-1-' + key;
			    colorBall_1.style.background = val[0];
			    colorBall_1.setAttribute('hex', val[0]);			        			    			    

			    this.initSpectrum(this, val[0], colorBall_1, key);
			    this.initSpectrum(this, val[1], colorBall_2, key);
			    this.initSpectrum(this, val[2], colorBall_3, key);


			// Color range presets
			// Color range presets
			// Color range presets

			var colorRangePresetWrapper = Wu.DomUtil.create('div', 'color-range-preset-wrapper', colorSelectorWrapper);

			var colorRangesPresets = [
				['#ff0000', '#00ff00', '#0000ff'],
				['#ff007d', '#ffff00', '#007dff'],
				['#ff7d00', '#ffff00', '#00ff7d'],
				['#ff00ff', '#ffff00', '#00ffff'],
				['#ffff00', '#ff00ff', '#00ffff'],
				['#ff0000', '#00ff00'],
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

				    Wu.DomEvent.on(colorRangePreset, 'click', this.selectColorPreset, this);

			}.bind(this))

			Wu.DomEvent.on(color, 'click', this.toggleColorRange, this);
			Wu.DomEvent.on(clickCatcher, 'click', this.stopEditingColorRange, this);
		}

		if ( options.radio ) {

			var radio = Wu.DomUtil.create('div', 'layer-radio', fieldWrapper);
			radio.id = 'radio_' + key;

			if ( options.radioOn ) {
				Wu.DomUtil.addClass(radio, 'radio-on');
				radio.setAttribute('state', 'true');
			} else {
				radio.setAttribute('state', 'false');
			}

			Wu.DomEvent.on(radio, 'click', this.toggleRadio, this);
		}


		if ( dropArray ) {
			this._init_miniDropDown(dropArray, fieldWrapper, key, options.selectedField);
		}

		// Create input field
		if ( input ) {

			// create
			var fieldName = Wu.DomUtil.createId('input', 'field_input_' + key, fieldWrapper);
			fieldName.className = 'chrome-field-input';
			fieldName.setAttribute('name', 'field_input_' + key);
			fieldName.setAttribute('placeholder', key);

			// set title 
			if (title) fieldName.value = title;

			// set event
			Wu.DomEvent.on(fieldName, 'blur', this.saveFromBlur, this);
		
		
		} else {

			// Create "normal" text line
			var fieldName = Wu.DomUtil.create('div', 'chrome-field-line', fieldWrapper);
			fieldName.innerHTML = title ? title : key;
		}
	},


	_gradientStyle : function (colorArray) {

		var gradientStyle = 'background: -webkit-linear-gradient(left, ' + colorArray.join() + ');';
		gradientStyle    += 'background: -o-linear-gradient(right, '     + colorArray.join() + ');';
		gradientStyle    += 'background: -moz-linear-gradient(right, '   + colorArray.join() + ');';
		gradientStyle    += 'background: linear-gradient(to right, '     + colorArray.join() + ');';

		return gradientStyle;

	},

	initSpectrum : function (context, hex, wrapper, key) {


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

				context.updateColor(hex, key, wrapper);
			}
		});


	},


	selectColorPreset : function (e) {

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


	// Make sure hex decimals have two digits
	padToTwo : function (numberString) {

		if (numberString.length < 2) numberString = '0' + numberString;
		return numberString;
	},

	// OMG code... haven't written it myself...
	// But it interpolates values between hex values
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


	forceNumeric : function (e) {

		// only allow '0-9' + '.' and '-'
		return e.charCode >= 45 && e.charCode <= 57 && e.charCode != 47;

	},


	// Toggle radio
	toggleRadio : function (e) {

	},

	// Toggle switch
	toggleSwitch : function (e) {

		// get state
		var stateAttrib = e.target.getAttribute('state');
		var on = (stateAttrib == 'true');
		var key = e.target.getAttribute('key');

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
		this._saveToServer(key, '', isOn)
	},

	toggleSetClear : function (e) {

		var elem  = e.target;
		var id    = elem.id;
		var key   = elem.getAttribute('key');
		var state = elem.getAttribute('state');
		var on 	  = (state == 'true');

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

		this.saveSetClear(key, isOn);
	},

	toggleSet : function (e) {
		var elem  = e.target;
		var id    = elem.id;
		var key   = elem.getAttribute('key')
		this.saveSet(key);
	},

	_init_miniDropDown : function (array, wrap, _key, selected) {

		// create dropdown
		var selectWrap = Wu.DomUtil.create('div', 'chrome chrome-mini-dropdown active-field select-field-wrap', wrap);
		var select = this._select = Wu.DomUtil.create('select', 'active-field-select', selectWrap);
		select.setAttribute('key', _key);

		if ( selected ) Wu.DomUtil.addClass(selectWrap, 'full-width');

		// get layers
		var layers = this._project.getPostGISLayers();

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
		Wu.DomEvent.on(select, 'change', this._selectedMiniDropDown, this); // todo: mem leak?

	},	

	// Saver dummy
	_selectedMiniDropDown : function () {
		console.log('%c Function "_selectedMiniDropDown" fired from parent function => nothing happens', 'background: red; color: white');
	},

	// Saver dummy
	saveMiniBlur : function () {
		console.log('%c Function "saveMiniBlur" fired from parent function => nothing happens', 'background: red; color: white');
	},

	// Saver dummy
	saveFromBlur : function () {
		console.log('%c Function "saveFromBlur" fired from parent function => nothing happens', 'background: red; color: white');
	},

	// Saver dummy
	_saveToServer : function () {
		console.log('%c Function "_saveToServer" fired from parent function => nothing happens', 'background: red; color: white');
	},


	saveSetClear : function () {
		console.log('%c Function "saveSetClear" fired from parent function => nothing happens', 'background: red; color: white');
	},

	saveSet : function () {
		console.log('%c Function "saveSet" fired from parent function => nothing happens', 'background: red; color: white');
	},

	_validateDateFormat : function (key) {

		// Default fields that for some reason gets read as time formats...
		if ( key == 'the_geom_3857' || key == 'the_geom_4326' ) return false;

		// If it's Frano's time series format
		var m = moment(key, ["YYYYMMDD", moment.ISO_8601]).format("YYYY-MM-DD");
		if ( m != 'Invalid date' ) return m;

		// If it's other time format
		var m = moment(key).format("YYYY-MM-DD");
		if ( m != 'Invalid date' ) return m;

		// If it's not a valid date...
		return false;
	},

	// Returns a number between 0 and 1 from a range
	_normalize : function (value, min, max) {
		normalized = (value - min) / (max - min);
		return normalized;
	},

	// Sets min value to zero, and returns value from range, up to 1.
	_normalizeOffset : function (value, min, max) {
		if ( min > 0 ) min = 0;
		normalized = (value - min) / (max - min);
		return normalized;
	},
});
