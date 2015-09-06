Wu.Chrome.Content = Wu.Chrome.extend({

	_initialize : function () {

		console.log('chrome.content');

	},

	// Hides the "add folder" in layer menu
	_hideLayerEditor : function () {

		var layerMenu = app.MapPane.getControls().layermenu;
		if (layerMenu) layerMenu.disableEdit();

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

	_initLayout_activeLayers : function (title, subtitle) {

		var title = title || 'Layer';
		var subtitle = subtitle || 'Select a layer to style...';

		// active layer wrapper
		var wrap = Wu.DomUtil.create('div', 'chrome chrome-content styler-content active-layer wrapper', this._container);

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

	},

	opened : function () {
	},

	closed : function () {
		console.log('i was also closed!', this);
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
		    dropArray  = options.dropArray,
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

			// set value
			if (options.value) miniInput.value = val;
			if ( !right ) Wu.DomUtil.addClass(miniInput, 'left-mini');
			if ( !isOn  ) Wu.DomUtil.addClass(miniInput, 'left-mini-kill');			    


			// set event
			Wu.DomEvent.on(miniInput, 'blur', this.saveMiniBlur, this);
		}


		if ( type == 'dualMiniInput' ) {

			var miniInputMin = Wu.DomUtil.createId('input', 'field_mini_input_max_' + key, fieldWrapper);
			miniInputMin.className = 'chrome-field-mini-input mini-input-dual';
			miniInputMin.setAttribute('placeholder', 'auto');

			if ( options.value ) miniInputMin.value = val[1];

			Wu.DomEvent.on(miniInputMin, 'blur', this.saveMiniBlur, this);


			var miniInputMin = Wu.DomUtil.createId('input', 'field_mini_input_min_' + key, fieldWrapper);
			miniInputMin.className = 'chrome-field-mini-input mini-input-dual';
			miniInputMin.setAttribute('placeholder', 'auto');

			if ( options.value ) miniInputMin.value = val[0];

			Wu.DomEvent.on(miniInputMin, 'blur', this.saveMiniBlur, this);

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

		}
	
		if ( type == 'colorrange' ) {

			// Set styling
			var gradientStyle = 'background: -webkit-linear-gradient(left, ' + val.join() + ');';
			gradientStyle    += 'background: -o-linear-gradient(right, '     + val.join() + ');';
			gradientStyle    += 'background: -moz-linear-gradient(right, '   + val.join() + ');';
			gradientStyle    += 'background: linear-gradient(to right, '     + val.join() + ');';

			var color = Wu.DomUtil.create('div', 'chrome-color-range', fieldWrapper);
			color.id = 'chrome-color-range_' + key;
			color.setAttribute('style', gradientStyle);

		}


		if ( dropArray ) {
			this._init_miniDropDown(dropArray, fieldWrapper, key, options.selectedField);
		}

		// Create input field
		if (input) {

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

		// get layers
		var layers = this._project.getPostGISLayers();

		// placeholder
		var option = Wu.DomUtil.create('option', '', select);
		option.innerHTML = 'select field';
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

		console.log('%c ***************************** ', 'background: red; color: white');
		console.log('%c Did you foget something?', 'color: blue');
		console.log('%c Function "_selectedMiniDropDown" fired from parent function...', 'color: blue');
		console.log('%c It should be fired from the setting you\'re working in', 'color: blue');
		console.log('%c ***************************** ', 'background: red; color: white');
	},

	// Saver dummy
	saveMiniBlur : function () {

		console.log('%c ***************************** ', 'background: red; color: white');
		console.log('%c Did you foget something?', 'color: blue');
		console.log('%c Function "saveMiniBlur" fired from parent function...', 'color: blue');
		console.log('%c It should be fired from the setting you\'re working in', 'color: blue');
		console.log('%c ***************************** ', 'background: red; color: white');
	},

	// Saver dummy
	saveFromBlur : function () {

		console.log('%c *****************************', 'background: red; color: white');
		console.log('%c Did you foget something?', 'color: blue');
		console.log('%c Function "saveFromBlur" fired from parent function...', 'color: blue');
		console.log('%c It should be fired from the setting you\'re working in', 'color: blue');
		console.log('%c ***************************** ', 'background: red; color: white');
	},

	// Saver dummy
	_saveToServer : function () {

		console.log('%c ***************************** ', 'background: red; color: white');
		console.log('%c Did you foget something?', 'color: blue');
		console.log('%c Function "_saveToServer" fired from parent function...', 'color: blue');
		console.log('%c It should be fired from the setting you\'re working in', 'color: blue');
		console.log('%c ***************************** ', 'background: red; color: white');
	},


	saveSetClear : function () {

		console.log('%c ***************************** ', 'background: red; color: white');
		console.log('%c Did you foget something?', 'color: blue');
		console.log('%c Function "saveSetClear" fired from parent function...', 'color: blue');
		console.log('%c It should be fired from the setting you\'re working in', 'color: blue');
		console.log('%c ***************************** ', 'background: red; color: white');

	},

	saveSet : function () {

		console.log('%c ***************************** ', 'background: red; color: white');
		console.log('%c Did you foget something?', 'color: blue');
		console.log('%c Function "saveSet" fired from parent function...', 'color: blue');
		console.log('%c It should be fired from the setting you\'re working in', 'color: blue');
		console.log('%c ***************************** ', 'background: red; color: white');

	},

	_validateDateFormat : function (key) {

		// Default fields that for some reason gets read as time formats...
		if ( key == 'the_geom_3857' || key == 'the_geom_4326' ) return false;

		// If it's other time format
		var m = moment(key).format("YYYY-MM-DD");
		if ( m != 'Invalid date' ) return m;

		// If it's Frano's time series format
		var m = moment(key, ["YYYYMMDD", moment.ISO_8601]).format("YYYY-MM-DD");
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
