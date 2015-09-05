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
		for ( var t in tabs ) {
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

	_initLayout_activeLayers : function () {

		// active layer wrapper
		var wrap = Wu.DomUtil.create('div', 'chrome chrome-content styler-content active-layer wrapper', this._container);

		// title
		var title = Wu.DomUtil.create('div', 'chrome chrome-content active-layer title', wrap, 'Layer');
		
		// create dropdown
		var selectWrap = Wu.DomUtil.create('div', 'chrome chrome-content active-layer select-wrap', wrap);
		var select = this._select = Wu.DomUtil.create('select', 'active-layer-select', selectWrap);

		// get layers
		var layers = this._project.getPostGISLayers();

		// placeholder
		var option = Wu.DomUtil.create('option', '', select);
		option.innerHTML = 'Select a layer to style...';
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

		// _key, wrapper, input, right
		var _key 	= options.key,
		    _wrapper 	= options.wrapper,
		    _input 	= options.input,
		    _right 	= options.rightPos,
		    _isOn 	= options.isOn,
		    _title 	= options.title,
		    _type 	= options.type,
		    _dropArray  = options.dropArray,
		    _color 	= options.color,
		    _val 	= options.value;
		    
		var fieldWrapper = Wu.DomUtil.create('div', 'chrome-metafield-line', _wrapper);
		    fieldWrapper.id = 'field_wrapper_' + _key;
		

		// Create switch
		if ( _type == 'switch' ) {
	
			// Create classname
			var 		    _class = 'chrome-switch-container';
			if ( _isOn ) 	    _class += ' switch-on';
			if ( _right ) 	    _class += ' right-switch';

			// Create button
			var fieldSwitch = Wu.DomUtil.create('div', _class, fieldWrapper);
			    fieldSwitch.setAttribute('key', _key);
			    fieldSwitch.id = 'field_switch_' + _key;

			// Set on/off state
			if ( _isOn ) fieldSwitch.setAttribute('state', 'true');
			else 	     fieldSwitch.setAttribute('state', 'false');

			// Add hooks
			Wu.DomEvent.on(fieldSwitch, 'click', this.toggleSwitch, this);		    

		}

		if ( _type == 'miniInput' ) {

			var miniInput = Wu.DomUtil.createId('input', 'field_mini_input_' + _key, fieldWrapper);
			    miniInput.className = 'chrome-field-mini-input';
			    miniInput.setAttribute('placeholder', 'auto');

			    if ( !_right ) Wu.DomUtil.addClass(miniInput, 'left-mini');
			    if ( !_isOn  ) Wu.DomUtil.addClass(miniInput, 'left-mini-kill');			    

			    if ( options.value ) miniInput.value = _val;

			Wu.DomEvent.on(miniInput, 'blur', this.saveMiniBlur, this);

		}


		if ( _type == 'dualMiniInput' ) {

			var miniInputMin = Wu.DomUtil.createId('input', 'field_mini_input_max_' + _key, fieldWrapper);
			    miniInputMin.className = 'chrome-field-mini-input mini-input-dual';
			    miniInputMin.setAttribute('placeholder', 'auto');

			    if ( options.value ) miniInputMin.value = _val[1];

			Wu.DomEvent.on(miniInputMin, 'blur', this.saveMiniBlur, this);


			var miniInputMin = Wu.DomUtil.createId('input', 'field_mini_input_min_' + _key, fieldWrapper);
			    miniInputMin.className = 'chrome-field-mini-input mini-input-dual';
			    miniInputMin.setAttribute('placeholder', 'auto');

			    if ( options.value ) miniInputMin.value = _val[0];

			Wu.DomEvent.on(miniInputMin, 'blur', this.saveMiniBlur, this);

		}


		if ( _type == 'setClear' ) {

			var setClear = Wu.DomUtil.create('div', 'setClear', fieldWrapper);
			    setClear.setAttribute('key', _key);
			    setClear.innerHTML = 'SET';

			if ( _isOn ) {
				Wu.DomUtil.addClass(setClear, 'setClear-on');
				setClear.setAttribute('state', 'true');
				setClear.innerHTML = 'CLEAR';
			} else {
				setClear.setAttribute('state', 'false');
			}

			Wu.DomEvent.on(setClear, 'click', this.toggleSetClear, this);

		}


		if ( _type == 'set' ) {

			var setClear = Wu.DomUtil.create('div', 'chrome-set', fieldWrapper);
			    setClear.setAttribute('key', _key);
			    setClear.innerHTML = 'SET';

			Wu.DomEvent.on(setClear, 'click', this.toggleSet, this);

		}

		if ( _type == 'color' ) {

			var color = Wu.DomUtil.create('div', 'chrome-color-ball', fieldWrapper);
			    color.id = 'color_ball_' + _key;
			    color.style.background = _val;

			if ( !_isOn ) Wu.DomUtil.addClass(color, 'disable-color-ball');

			if ( !_right ) Wu.DomUtil.addClass(color, 'left-ball');

		}
	
		if ( _type == 'colorrange' ) {

			// Set styling
			var gradientStyle = 'background: -webkit-linear-gradient(left, ' + _val.join() + ');';
			gradientStyle    += 'background: -o-linear-gradient(right, '     + _val.join() + ');';
			gradientStyle    += 'background: -moz-linear-gradient(right, '   + _val.join() + ');';
			gradientStyle    += 'background: linear-gradient(to right, '     + _val.join() + ');';

			var color = Wu.DomUtil.create('div', 'chrome-color-range', fieldWrapper);
			    color.id = 'chrome-color-range_' + _key;
			    color.setAttribute('style', gradientStyle);

		}


		if ( _dropArray ) {
			this._init_miniDropDown(_dropArray, fieldWrapper, _key, options.selectedField);
		}

		// Create input field
		if ( _input ) {

			var fieldName = Wu.DomUtil.createId('input', 'field_input_' + _key, fieldWrapper);
			    fieldName.className = 'chrome-field-input';
			    fieldName.setAttribute('name', 'field_input_' + _key);
			    fieldName.setAttribute('placeholder', _key);

			    if ( _title ) fieldName.value = _title;

			    Wu.DomEvent.on(fieldName, 'blur', this.saveFromBlur, this);
		
		// Create "normal" text line
		} else {

			var fieldName = Wu.DomUtil.create('div', 'chrome-field-line', fieldWrapper);
			    fieldName.innerHTML = _title ? _title : _key;
		}
	},

	// Toggle switch
	toggleSwitch : function (e) {

		var stateAttrib = e.target.getAttribute('state');
		
		if ( stateAttrib == 'true' ) var on = true;
		else 			     var on = false;

		var key = e.target.getAttribute('key');

		if ( on ) {
			
			e.target.setAttribute('state', 'false');
			Wu.DomUtil.removeClass(e.target, 'switch-on');

			var isOn = false;

		} else {

			e.target.setAttribute('state', 'true');
			Wu.DomUtil.addClass(e.target, 'switch-on');

			var isOn = true;
		}	

		this._saveToServer(key, '', isOn)
	},

	toggleSetClear : function (e) {

		var elem  = e.target;
		var id    = elem.id;
		var key   = elem.getAttribute('key')
		var state = elem.getAttribute('state')

		if ( state == "true" )  var on = true;
		else 			var on = false;

		if ( on ) {
		
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

	_validateDateFormat : function (_key) {

		// Default fields that for some reason gets read as time formats...
		if ( _key == 'the_geom_3857' || _key == 'the_geom_4326' ) return false;

		// If it's other time format
		var _m = moment(_key).format("YYYY-MM-DD");
		if ( _m != 'Invalid date' ) return _m;

		// If it's Frano's time series format
		var _m = moment(_key, ["YYYYMMDD", moment.ISO_8601]).format("YYYY-MM-DD");
		if ( _m != 'Invalid date' ) return _m;

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


// ┌─┐┌─┐┌┬┐┌┬┐┬┌┐┌┌─┐┌─┐
// └─┐├┤  │  │ │││││ ┬└─┐
// └─┘└─┘ ┴  ┴ ┴┘└┘└─┘└─┘

Wu.Chrome.Content.SettingsSelector = Wu.Chrome.Content.extend({

	options : {
		tabs : {
			styler : {
				enabled : true,
				text : 'Style Editor'
			},
			layers : {
				enabled : true,
				text : 'Layers'
			},
			tooltip : {
				enabled : true,
				text : 'Tooltip'
			},
			cartocss : {
				enabled : true,
				text : 'CartoCSS & SQL'
			},

			mapsettings : {
				enabled : true,
				text : 'Map Settings'
			},			
		}
	},

	_initialize : function () {

		this._initContainer();

		this.initLayout();
	},

	_initContainer : function () {

		// create container
		this._container = Wu.DomUtil.create('div', 'chrome chrome-content settingsSelector', this.options.appendTo);

		// tabs wrapper
		this._tabsWrapper = Wu.DomUtil.create('div', 'chrome chrome-content settings-tabs-wrapper', this.options.appendTo);

	},

	initLayout : function () {

		// title
		this._title = Wu.DomUtil.create('div', 'chrome chrome-content settings-title', this._container, 'Settings');

		// tabs
		this._initTabs();
	},



	getTabs : function () {
		return this._tabs;
	},

	_initTabs : function () {

		// tabs object
		this._tabs = {};

		// button wrapper
		this._buttonWrapper = Wu.DomUtil.create('div', 'chrome chrome-content settings-button-wrapper', this._container);
		
		// create tabs
		for ( var o in this.options.tabs) {
			if (this.options.tabs[o].enabled) {

				var text = this.options.tabs[o].text;

				var tab = o.camelize();

				// create tab contents
				if (Wu.Chrome.Content[tab]) {

					// create tab button
					var trigger = Wu.DomUtil.create('div', 'chrome chrome-content settings-button', this._buttonWrapper, text);

					// create content
					this._tabs[tab] = new Wu.Chrome.Content[tab]({
						options : this._options,
						trigger : trigger,
						appendTo : this._tabsWrapper,
						parent : this
					});
				}
			}
		}

	},

	show : function () {

	},

	hide : function () {
		console.log('hiding tab!');
	},

	opened : function () {
		console.log('i was opened!', this._tabs);
		this._tabs['Styler'].show();

	},

	closed : function () {
		console.log('i was closed!');

		for ( var t in this._tabs) {
			this._tabs[t].closed();
		}
	},

	_refreshAll : function () {

		for (var t in this._tabs) {
			console.log('refreshhhh', t);

			this._tabs[t]._refresh();
		}
	},
});


// ┌┬┐┌─┐┌─┐  ┌─┐┌─┐┌┬┐┌┬┐┬┌┐┌┌─┐┌─┐
// │││├─┤├─┘  └─┐├┤  │  │ │││││ ┬└─┐
// ┴ ┴┴ ┴┴    └─┘└─┘ ┴  ┴ ┴┘└┘└─┘└─┘

Wu.Chrome.Content.Mapsettings = Wu.Chrome.Content.extend({

	_initialize : function () {

		// init container
		this._initContainer();

		// add events
		this._addEvents();
	},

	_initContainer : function () {

		// create container
		this._container = Wu.DomUtil.create('div', 'chrome chrome-content chrome-pane mapsettings', this.options.appendTo);
	},

	_initLayout : function () {

		if (!this._project) return;

		this._fieldsWrapper = Wu.DomUtil.create('div', 'chrome-field-wrapper', this._container);
		this.initSettings('Controls');

		this.initBoundPos('Bounds & Position');

		// mark as inited
		this._inited = true;		
	},

	// UNIVERSALS
	// UNIVERSALS
	// UNIVERSALS		

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

	open : function () {
		console.log('open!', this);
	},	


	// CREATE STUFF
	// CREATE STUFF
	// CREATE STUFF		

	// Creates section with meta field lines
	initSettings : function (title) {


		var sectionWrapper = Wu.DomUtil.create('div', 'chrome-content-section-wrapper', this._fieldsWrapper)
		var header = Wu.DomUtil.create('div', 'chrome-content-header', sectionWrapper, title);

		var options = {

			zoom : {
				enable : true,
				name   : 'Zoom'
			},
			draw : {
				enable : true,
				name   : 'Draw'
			},
			description : {
				enable : true,
				name   : 'Description/legend'
			},
			measure : {
				enable : true,
				name   : 'Measure'		
			},
			mouseposition : {
				enable : true,
				name   : 'Mouse position'
			},
			geolocation : {
				enable : true,
				name   : 'Geo search'				
			},

			// Inactive
			layermenu : {
				enable : false,
				name   : 'Layer menu'
			},
			legends : {
				enable : false,
				name   : 'Legend'
			},
			baselayertoggle : {
				enable : false,
				name   : 'Base layer toggle'
			},
			cartocss : {
				enable : false,
				name   : 'CartoCSS'
			},

		}


		// Get control
		var project = app.activeProject;


		for ( var key in options ) {
			
			var enable  = options[key].enable;			

			if ( enable ) {

				var title = options[key].name;

				var lineOptions = {
					key 		: key, 
					wrapper 	: sectionWrapper,
					input 		: false,
					title 		: title,
					isOn 		: project.store.controls[key],
					rightPos	: false,
					type 		: 'switch'
					// switch 		: true,
					
					// dropdown	: false,
					
				}

				this._createMetaFieldLine(lineOptions);
			}
		}
	},

	initBoundPos : function (title) {

		var sectionWrapper = Wu.DomUtil.create('div', 'chrome-content-section-wrapper', this._fieldsWrapper)
		var header = Wu.DomUtil.create('div', 'chrome-content-header', sectionWrapper, title);

		var isBoundsSet = this.isBoundsSet();

		var lineOptions = {
			key 		: 'bounds', 
			wrapper 	: sectionWrapper,
			input 		: false,
			title 		: 'Bounds',			
			isOn 		: isBoundsSet,
			rightPos	: false,
			type 		: 'setClear',
			
		}

		this._createMetaFieldLine(lineOptions);


		var lineOptions = {
			key 		: 'position', 
			wrapper 	: sectionWrapper,
			input 		: false,
			title 		: 'Position',			
			isOn 		: false,
			rightPos	: false,
			type 		: 'set',
		}

		this._createMetaFieldLine(lineOptions);

	},


	isBoundsSet : function () {

		var bounds = app.activeProject.getBounds();

		// If no bounds
		if ( !bounds ) return false;

		var maxZoom      = bounds.maxZoom;
		var minZoom      = bounds.minZoom;
		var northEastLat = bounds.northEast.lat;
		var northEastLng = bounds.northEast.lng;
		var southWestLat = bounds.southWest.lat;
		var southWestLng = bounds.southWest.lng;

		// If bounds sat to view everything (clear)
		if ( maxZoom      == 20 &&
		     minZoom      == 1 &&
		     northEastLat == 90 &&
		     northEastLng == 180 &&
		     southWestLat == -90 &&
		     southWestLng == -180
		) return false;

		// Bounds are set
		return true;

	},

	// SAVERS 
	// SAVERS
	// SAVERS

	_saveToServer : function (_key, title, on) {

		var item = _key;

		// Get control
		var control = app.MapPane.getControls()[item];

		// Save
		var project = app.activeProject;
		    project.store.controls[item] = on;
		    project._update('controls');

		// toggle on map
		if (on) {
			control._on();
		} else {
			control._off();
		}

	},


	saveSetClear : function (key, on) {

		// Set/Clear bounds
		if ( key == 'bounds' ) on ? this.setBounds() : this.clearBounds();

	},

	saveSet : function (key) {

		if ( key == 'position' ) this.setPosition();

	},


	// SET POSITION
	// SET POSITION
	// SET POSITION		

	setPosition : function () {

		// get actual Project object
		var project = app.activeProject;

		// if no active project, do nothing
		if (!project) return; 

		// get center and zoom
		var center = Wu.app._map.getCenter();
		var zoom   = Wu.app._map.getZoom();

		// set position 
		var position = {
			lat  : center.lat,
			lng  : center.lng,
			zoom : zoom
		}

		// save to project
		project.setPosition(position);

	},		



	// SET/ CLEAR BOUNDS
	// SET/ CLEAR BOUNDS
	// SET/ CLEAR BOUNDS		

	setBounds : function (e) {
		
		// get actual Project object
		var project = app.activeProject;

		// if no active project, do nothing
		if (!project) return; 

		// get map bounds and zoom
		var bounds = Wu.app._map.getBounds();
		var zoom   = Wu.app._map.getZoom();

		// write directly to Project
		project.setBounds({
			northEast : {
				lat : bounds._northEast.lat,
				lng : bounds._northEast.lng
			},

			southWest : {
				lat : bounds._southWest.lat,
				lng : bounds._southWest.lng
			},
			minZoom : zoom,
			maxZoom : 18
		});
		

		// enforce new bounds
		this.enforceBounds();
	},

	clearBounds : function () {
		
		// get actual Project object
		var project = Wu.app.activeProject;
		var map = Wu.app._map;

		var _nullBounds = {
			northEast : {
				lat : '90',
				lng : '180'
			},

			southWest : {
				lat : '-90',
				lng : '-180'
			},
			minZoom : '1',
			maxZoom : '20'
		}

		// set bounds to project
		project.setBounds(_nullBounds);

		// enforce
		this.enforceBounds();

		// no bounds
		map.setMaxBounds(false);
	},		

	enforceBounds : function () {
		
		var project = app.activeProject;
		var map     = app._map;

		// get values
		var bounds = project.getBounds();

		if (bounds) {
			var southWest   = L.latLng(bounds.southWest.lat, bounds.southWest.lng);
	   		var northEast 	= L.latLng(bounds.northEast.lat, bounds.northEast.lng);
	    		var maxBounds 	= L.latLngBounds(southWest, northEast);
			var minZoom 	= bounds.minZoom;
			var maxZoom 	= bounds.maxZoom;

	    		if (bounds == this._nullBounds) {
	    			map.setMaxBounds(false);
	    		} else {
	    			map.setMaxBounds(maxBounds);
	    		}
			
			// set zoom
			map.options.minZoom = minZoom;
			map.options.maxZoom = maxZoom;	
		}
		

		map.invalidateSize();
	},
});


// ┌─┐┌┬┐┬ ┬┬  ┌─┐┬─┐
// └─┐ │ └┬┘│  ├┤ ├┬┘
// └─┘ ┴  ┴ ┴─┘└─┘┴└─

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

		var _key = 'color';

		// Create JSON obj if it's not already there
		if ( !this.cartoJSON.point[_key] ) this.cartoJSON.point[_key] = {};

		// Get stores states
		var isOn   = this.cartoJSON.point[_key].range ? false : true;
		var val    = this.cartoJSON.point[_key].staticVal ? this.cartoJSON.point[_key].staticVal : '#FF33FF';
		var range  = this.cartoJSON.point[_key].range ? this.cartoJSON.point[_key].range : false;
		var minMax = this.cartoJSON.point[_key].minMax ? this.cartoJSON.point[_key].minMax : false;
		var customMinMax = this.cartoJSON.point[_key].customMinMax ? this.cartoJSON.point[_key].customMinMax : false;

		var lineOptions = {
			key 		: _key, 
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
		this.cartoJSON.point[_key] = {
			range 	     : range,
			minMax 	     : minMax,
			customMinMax : customMinMax,
			// value 	    : lineOptions.value,
			staticVal    : val,
		};
	},

	// INIT OPACITY
	initPointOptionOpacity : function (sectionWrapper) {

		var _key = 'opacity';

		// Create JSON obj if it's not already there
		if ( !this.cartoJSON.point[_key] ) this.cartoJSON.point[_key] = {};

		// Get stores states
		var isOn   = this.cartoJSON.point[_key].range ? false : true;
		var val    = this.cartoJSON.point[_key].value ? this.cartoJSON.point[_key].value : 1;
		var range  = this.cartoJSON.point[_key].range ? this.cartoJSON.point[_key].range : false;	

		var lineOptions = {
			key 		: _key,
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
		this.cartoJSON.point[_key] = {
			range 	    : range,
			value 	    : val
		};
	},
	
	// INIT POINT SIZE
	initPointOptionPointSize : function (sectionWrapper) {

		var _key = 'pointsize';

		// Create JSON obj if it's not already there
		if ( !this.cartoJSON.point[_key] ) this.cartoJSON.point[_key] = {};

		// Get stores states
		var isOn   = this.cartoJSON.point[_key].range ? false : true;
		var val    = this.cartoJSON.point[_key].value ? this.cartoJSON.point[_key].value : 1.2;
		var range  = this.cartoJSON.point[_key].range ? this.cartoJSON.point[_key].range : false;
		var minMax = this.cartoJSON.point[_key].minMax ? this.cartoJSON.point[_key].minMax : false;				

		var lineOptions = {
			key 		: _key, 
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
		this.cartoJSON.point[_key] = {
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
		
		var _pre = key.substring(0,4);

		if ( _pre == 'min_' || _pre == 'max_' ) {
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
			if ( _pre == 'min_' ) {
				this.cartoJSON.point.pointsize.minMax[0] = value;
			}
			if ( _pre == 'max_' ) {
				this.cartoJSON.point.pointsize.minMax[1] = value;	
			}	
		}


		// COLOR RANGE
		// COLOR RANGE
		// COLOR RANGE

		if ( key == 'minmaxcolorrange' ) {
			if ( _pre == 'min_' ) {
				// SAVE MIN AND MAX VALUE
				var maxField = Wu.DomUtil.get('field_mini_input_max_minmaxcolorrange');
				var maxVal = maxField.value;
				this.cartoJSON.point.color.customMinMax = [value, maxVal];
			}

			if ( _pre == 'max_' ) {
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


// ┬  ┌─┐┬ ┬┌─┐┬─┐┌─┐
// │  ├─┤└┬┘├┤ ├┬┘└─┐
// ┴─┘┴ ┴ ┴ └─┘┴└─└─┘

Wu.Chrome.Content.Layers = Wu.Chrome.Content.extend({


	// INITS
	// INITS
	// INITS		

	_initialize : function () {

		// init container
		this._initContainer();

		// add events
		this._addEvents();
	},

	_initContainer : function () {

		// create container
		this._container = Wu.DomUtil.create('div', 'chrome chrome-content chrome-pane layers', this.options.appendTo);
	},

	_initLayout : function () {

		if (!this._project) return;

		// Inner wrapper
		this._fieldsWrapper = Wu.DomUtil.create('div', 'chrome-field-wrapper', this._container);

		// Init layer/baselayer toggle
		this.initLayerBaselayerToggle();

		// Init Layers
		this.initLayers();

		// mark as inited
		this._inited = true;

		// This fires too late...
		this._mode = 'layer';

	},


	// OTHER UNIVERSALS
	// OTHER UNIVERSALS
	// OTHER UNIVERSALS		

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

		// enable edit of layer menu...
		var layerMenu = app.MapPane.getControls().layermenu;
		if (app.access.to.edit_project(this._project)) layerMenu.enableEdit();

	},

	open : function () {
		console.log('open!', this);
	},


	// closed : function () {
	// 	console.log('i was closed!');
	// },

	// hide : function () {
	// 	console.log('i was hidden!');
	// },



	// TOP BUTTONS (BASE LAYERS / LAYERS)
	// TOP BUTTONS (BASE LAYERS / LAYERS)
	// TOP BUTTONS (BASE LAYERS / LAYERS)		


	initLayerBaselayerToggle : function () {

		var wrapper = Wu.DomUtil.create('div',   'chrome-layer-baselayer-toggle', this._fieldsWrapper);
		this.baselayerButton = Wu.DomUtil.create('div', 'chrome-layer-toggle-button chrome-baselayer', wrapper, 'BASE LAYERS');
		this.layerButton = Wu.DomUtil.create('div',     'chrome-layer-toggle-button chrome-layer layer-toggle-active', wrapper, 'LAYERS');

		Wu.DomEvent.on(this.layerButton,     'click', this.toggleToLayers, this);
		Wu.DomEvent.on(this.baselayerButton, 'click', this.toggleToBaseLayers, this);
	},

	toggleToBaseLayers : function () {
		Wu.DomUtil.addClass(this.baselayerButton, 'layer-toggle-active')
		Wu.DomUtil.removeClass(this.layerButton, 'layer-toggle-active')
		this._mode = 'baselayer';	
		this.update();		
	},

	toggleToLayers : function () {
		Wu.DomUtil.removeClass(this.baselayerButton, 'layer-toggle-active')
		Wu.DomUtil.addClass(this.layerButton, 'layer-toggle-active')
		this._mode = 'layer';
		this.update();
	},



	// ROLL OUT LAYERS
	// ROLL OUT LAYERS
	// ROLL OUT LAYERS	

	initLayers : function () {

		this._layers = {};

		// return if no layers
	       	if (_.isEmpty(this._project.layers)) return;

	       	this.sortedLayers = this.sortLayers(this._project.layers);

	       	this.sortedLayers.forEach(function (provider) {

	       		var providerTitle = this.providerTitle(provider.key);

	       		var sectionWrapper = Wu.DomUtil.create('div', 'chrome-content-section-wrapper', this._fieldsWrapper)
			var header = Wu.DomUtil.create('div', 'chrome-content-header', sectionWrapper, providerTitle);

	       		provider.layers.forEach(function (layer) {

	       			this.addLayer(layer, sectionWrapper);

	       		}, this);

	       	}, this);

	       	this.update();
	},

	addLayer : function (layer, wrapper) {

		// Get title 
		var layerTitle = layer.getTitle();
		var uuid       = layer.store.uuid;
		var on 	       = false;
		
		// set active or not
		this._project.store.baseLayers.forEach(function (b) {
			if ( uuid == b.uuid ) { on = true; return; } 
		}.bind(this));

		var lineOptions = {
			key 		: uuid,
			wrapper 	: wrapper,
			input 		: false,
			title 		: layerTitle,
			isOn 		: on,
			rightPos	: false,
			type 		: 'switch'
		}

		this._createMetaFieldLine(lineOptions);
	},


	providerTitle : function (provider) {

		if (provider == 'postgis') var title = 'Data Library';
		if (provider == 'mapbox')  var title = 'Mapbox';
		if (provider == 'norkart') var title = 'Norkart';
		if (provider == 'google')  var title = 'Google';
		if (provider == 'osm')     return false;

		// Return title
		return title;
	},

	// sort layers by provider
	sortLayers : function (layers) {

		var keys = [ 'postgis', 'google', 'norkart', 'geojson', 'mapbox', 'raster'];
		var results = [];
	
		keys.forEach(function (key) {
			var sort = {
				key : key,
				layers : []
			}
			for (l in layers) {
				var layer = layers[l];

				if (layer) {

					if (layer.store && layer.store.data.hasOwnProperty(key)) {
						sort.layers.push(layer)
					}
				}
			}
			results.push(sort);
		}, this);

		// console.log('SROOTED', results);
		this.numberOfProviders = results.length;
		return results;
	},






	// UPDATE
	// UPDATE
	// UPDATE		

	update : function () {

		if ( !this._mode ) this._mode = 'layer';

		if ( this._mode == 'baselayer' ) this.markBaseLayerOccupied();
		if ( this._mode == 'layer' )     this.markLayerOccupied();
		
		this.updateSwitches();
	},


	// MARK BASE LAYERS AS OCCUPIED

	markBaseLayerOccupied : function () {

		// get layers and active baselayers
		var layermenuLayers = this._project.getLayermenuLayers();
		var layers = this._project.getLayers();

		// activate layers
		layers.forEach(function (a) {
			if (a.store) this.activateLayer(a.store.uuid);
		}, this);

		layermenuLayers.forEach(function (bl) {
			var layer = _.find(layers, function (l) { 
				if (!l.store) return false;
				return l.store.uuid == bl.layer; 
			});
			if (layer) this.deactivateLayer(layer.store.uuid);
		}, this);
	},

	// MARK LAYERS AS OCCUPIED

	markLayerOccupied : function () {


		var project = this._project;

		// get active baselayers
		var baseLayers = project.getBaselayers();
		var all = project.getLayers();

		all.forEach(function (a) {
			this.activateLayer(a.store.uuid);
		}, this);

		baseLayers.forEach(function (bl) {
			this.deactivateLayer(bl.uuid);
		}, this);

	},

	// SET LAYER AS NOT OCCUPIED

	activateLayer : function (layerUuid) {

		var _id = 'field_wrapper_' + layerUuid;
		var elem = Wu.DomUtil.get(_id);

		Wu.DomUtil.removeClass(elem, 'deactivated-layer');

	},

	// SET LAYER AS OCCUPIED

	deactivateLayer : function (layerUuid) {

		var _id = 'field_wrapper_' + layerUuid;
		var elem = Wu.DomUtil.get(_id);

		Wu.DomUtil.addClass(elem, 'deactivated-layer');

	},


	// UPDATE SWITCHES
	// UPDATE SWITCHES
	// UPDATE SWITCHES

	updateSwitches : function () {

	       	this.sortedLayers.forEach(function (provider) {
	       		provider.layers.forEach(function (layer) {
	       			this.updateSwitch(layer);
	       		}, this);
	       	}, this);		
	},

	updateSwitch : function (layer) {

		// Get title 
		var layerTitle = layer.getTitle();
		var uuid       = layer.store.uuid;
		var on 	       = false;
		

		if ( this._mode == 'baselayer' ) {
			// Set active or not
			this._project.store.baseLayers.forEach(function (b) {
				if ( uuid == b.uuid ) { on = true; return; } 
			}.bind(this));
		}

		if ( this._mode == 'layer' ) {
			// set active or not
			this._project.store.layermenu.forEach(function (b) {
				if ( uuid == b.layer ) { on = true; return; }
			}, this);
		}

		// Get switch
		var _switch = Wu.DomUtil.get('field_switch_' + uuid);

		if ( on ) {
			Wu.DomUtil.addClass(_switch, 'switch-on');
			_switch.setAttribute('state', 'true');
		} else {
			Wu.DomUtil.removeClass(_switch, 'switch-on');
			_switch.setAttribute('state', 'false');			
		}
	},	

	

	// SAVE
	// SAVE
	// SAVE		

	_saveToServer : function (key, title, on) {

		if ( this._mode == 'baselayer' ) {
			on ? this.enableBaseLayer(key) : this.disableBaseLayer(key);
		} else {
			on ? this.enableLayer(key) : this.disableLayer(key);
		}
	},


	// ENABLE BASE LAYER (AND SAVE)

	enableBaseLayer : function (uuid) {

		var layer = this._project.layers[uuid];

		// Update map	
		if (layer) layer._addTo('baselayer');

		// Save to server
		this._project.addBaseLayer({
			uuid : uuid,
			zIndex : 1,
			opacity : layer.getOpacity()
		});

		this.update();
	},

	// DISABLE BASE LAYER (AND SAVE)

	disableBaseLayer : function (uuid) {		

		var layer = this._project.layers[uuid];

		// Update map
		if (layer) layer.disable(); 

		// Save to server
		this._project.removeBaseLayer(layer);

		this.update();	
	},



	// ENABLE LAYER (AND SAVE)
	enableLayer : function (uuid) {

		var layer = this._project.layers[uuid];

		var layerMenu = app.MapPane.getControls().layermenu;
		layerMenu.add(layer);

	},

	// DISABLE LAYER (AND SAVE)
	disableLayer : function (uuid) {

		console.log(uuid);

		var layer = this._project.layers[uuid];
		var _uuid = layer.store.uuid;

		var layerMenu = app.MapPane.getControls().layermenu;
		layerMenu._remove(_uuid);

	},	
});



// ┌─┐┌─┐┬─┐┌┬┐┌─┐┌─┐┌─┐┌─┐
// │  ├─┤├┬┘ │ │ ││  └─┐└─┐
// └─┘┴ ┴┴└─ ┴ └─┘└─┘└─┘└─┘

Wu.Chrome.Content.Cartocss = Wu.Chrome.Content.extend({

	_initialize : function () {


		// init container
		this._initContainer();

		// add events
		this._addEvents();
	},

	_initContainer : function () {

		// create container
		this._container = Wu.DomUtil.create('div', 'chrome chrome-content chrome-pane cartocss', this.options.appendTo);
	},

	_initLayout : function () {

		// active layer
		this._initLayout_activeLayers();

		// wrapper
		this._codewrap = Wu.DomUtil.create('input', 'chrome chrome-content cartocss code-wrapper', this._container);

		// sql editor
		this._createSqlEditor();
		
		// carto editor
		this._createCartoEditor();

		// add shortkeys
		this._setKeymap();

		// create refresh button
		this._createRefresh();

		// insert titles
		this._createTitles();

		// hide by default
		this._hideEditors();

		// set sizes
		this._updateDimensions();

		// mark as inited
		this._inited = true;

	},

	_refresh : function () {

		this._flush();
		this._initLayout();
	},

	_flush : function () {
		this._removeKeymaps();
		this._removeEvents();
		this._cartoEditor = null;
		this._SQLEditor = null;
		this._container.innerHTML = '';
	},


	_cleanup : function () {
		// select nothing from dropdown
		// clear carto, sql
		// hide
		// unbind keys
		if (this._select) this._select.selectedIndex = 0;
		this._cartoEditor && this._cartoEditor.setValue('');
		this._SQLEditor && this._SQLEditor.setValue('');
		this._hideEditors();
		this._removeKeymaps();
		this._removeEvents();
	},

	_removeEvents : function () {

		// Wu.DomEvent.off(window, 'resize', this._windowResize, this);

	},

	_createTitles : function () {
		
		// create
		this._cartotitle = Wu.DomUtil.create('div', 'chrome chrome-content cartocss title');
		this._cartotitle.innerHTML = 'CartoCSS';
		this._sqltitle = Wu.DomUtil.create('div', 'chrome chrome-content cartocss title');
		this._sqltitle.innerHTML = 'SQL';
		
		// insert
		var c = this._cartoEditor.getWrapperElement();
		c.parentElement.insertBefore(this._cartotitle, c);

		// insert
		var s = this._SQLEditor.getWrapperElement();
		s.parentElement.insertBefore(this._sqltitle, s);
	},

	_createCartoEditor : function () {

		// editor
		this._cartoEditor = CodeMirror.fromTextArea(this._codewrap, {
    			lineNumbers: true,    			
    			mode: {
    				name : 'carto',
    				reference : window.cartoRef
    			},
    			matchBrackets: true,
    			lineWrapping: false,
    			paletteHints : true,
    			gutters: ['CodeMirror-linenumbers', 'errors']
  		});

	},

	_createSqlEditor : function () {


		// editor
		this._SQLEditor = CodeMirror.fromTextArea(this._codewrap, {
    			lineNumbers: true,    			
    			mode: {
    				name : 'text/x-sql',
    			},
    			matchBrackets: true,
    			lineWrapping: false,
    			paletteHints : true,
    			gutters: ['CodeMirror-linenumbers', 'errors']
  		});

	},

	_setKeymap : function () {

		this._keymap = {
			"Cmd-S": function(cm){
				this._updateStyle();
			}.bind(this),
			"Ctrl-S": function(cm){
				this._updateStyle();
			}.bind(this),
			"Cmd-R": function(cm){
				this._refreshLayer();
			}.bind(this),
			"Ctrl-R": function(cm){
				this._refreshLayer();
			}.bind(this)
		}

		this._cartoEditor.addKeyMap(this._keymap);
		this._SQLEditor.addKeyMap(this._keymap);

		
		// keymaster('⌘+r, ctrl+r', function(){
		// 	this._refreshLayer();
		// 	return false;
		// }.bind(this));

		// keymaster('⌘+s, ctrl+s', function(){
		// 	this._updateStyle();
		// 	return false;
		// }.bind(this));

	},

	_removeKeymaps : function () {
		this._cartoEditor && this._cartoEditor.removeKeyMap(this._keymap);
		this._SQLEditor && this._SQLEditor.removeKeyMap(this._keymap);
		if (keymaster.unbind) keymaster.unbind('⌘+s, ctrl+s');
		if (keymaster.unbind) keymaster.unbind('⌘+r, ctrl+r');
	},

	

	_updateDimensions : function () {
		if (!this._cartoEditor) return;

		// get dimensions
		var dims = app.Chrome.Right.getDimensions();

		// set sizes
		var carto = this._cartoEditor.getWrapperElement();
		if (carto) {
			carto.style.width = dims.width + 'px';
			carto.style.height = (dims.height/3*2) - 150 + 'px';
		}

		// set sizes
		var sql = this._SQLEditor.getWrapperElement();
		if (sql) {
			sql.style.width = dims.width + 'px';
			sql.style.height = (dims.height/3*1) - 220 + 'px';
		}
	},

	_windowResize : function () {
		this._updateDimensions();
		app._map.invalidateSize();
	},

	_createRefresh : function () {

		var text = (navigator.platform == 'MacIntel') ? 'Save (⌘-S)' : 'Save (Ctrl-S)';
		this._refreshButton = Wu.DomUtil.create('div', 'chrome chrome-content cartocss refresh-button', this._container, text);

		Wu.DomEvent.on(this._refreshButton, 'click', this._updateStyle, this);
	},

	_updateStyle : function () {


	},

	_updateStyle : function () {

		// return if no active layer
		if (!this._layer) return console.error('no layer');

		// get css string
		var css = this._cartoEditor.getValue();

		// return if empty
		if (!css) return console.error('no css');

		// get sql
		var sql = this._SQLEditor.getValue();
	
		// request new layer
		var layerOptions = {
			css : css, 
			sql : sql,
			layer : this._layer
		}

		this._updateLayer(layerOptions);

	},

	_createSQL : function (file_id, sql) {

		if (sql) {
			// replace 'table' with file_id in sql
			sql.replace('table', file_id);

			// wrap
			sql = '(' + sql + ') as sub';

		} else {
			// default
			sql = '(SELECT * FROM  ' + file_id + ') as sub';
		}
		return sql;
	},

	_updateLayer : function (options, done) {

		var css = options.css,
		    layer = options.layer,
		    file_id = layer.getFileUuid(),
		    sql = options.sql,
		    sql = this._createSQL(file_id, sql),
		    project = this._project;


		var layerOptions = layer.store.data.postgis;

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

		Wu.post('/api/db/createLayer', JSON.stringify(layerJSON), function (err, newLayerJSON) {

			// new layer
			var newLayerStyle = Wu.parse(newLayerJSON);

			console.log('newLayerJSON', newLayerStyle);

			if (newLayerStyle.error) {
				done && done();
				return console.error(newLayerStyle.error);
			}

			layer.setStyle(newLayerStyle.options);

			layer.update({enable : true});

			done && done();
		});

	},

	_refreshLayer : function () {
		console.log('_refreshLayer');
	},

	open : function () {
		console.log('open!', this);
	},

	_selectedActiveLayer : function (e) {

		// get layer
		var layerUuid = e.target.value;
		this._layer = this._project.getLayer(layerUuid);

		// selecting layer in dropdown...
		// .. problems:
		// 1. what if layer is not in layer menu?
		// 2. if not, should it be added?
		// 3. what if user just clicks wrong layer?
		// 4. should actually layers not in layermenu be available in dropdown? (they are now)
		// 5. 
		// ----------
		// SOLUTION: temporarily add layers to map for editing, remove when done editing.


		// refresh
		this._refreshEditor();

		// add layer temporarily to map
		this._tempaddLayer();
	},

	_tempaddLayer : function () {

		// remember
		this._temps = this._temps || [];

		// remove other styling layers
		this._tempRemoveLayers();

		// add
		this._layer._addThin();

		// fly to
		// this._layer.flyTo();

		// remember
		this._temps.push(this._layer);

	},

	_tempRemoveLayers : function () {
		if (!this._temps) return;

		// remove other layers added tempy for styling
		this._temps.forEach(function (layer) {
			layer._removeThin();
		}, this);
	},

	opened : function () {

	},

	closed : function () {
		// clean up
		this._tempRemoveLayers();
		this._cleanup();
	},

	_refreshEditor : function () {
		
		// fill editors
		this._refreshCartoCSS();
		this._refreshSQL();

		// show
		this._showEditors();

		// refresh codemirror (cause buggy)
		this._SQLEditor.refresh();
		this._cartoEditor.refresh();
	},

	_refreshCartoCSS : function () {

		// get
		var css = this._layer.getCartoCSS();

		// set
		this._cartoEditor.setValue(css);
	},

	_refreshSQL : function () {

		// get
		var meta = this._layer.getPostGISData();
		var rawsql = meta.sql;
		var table = meta.table_name;
		var sql = rawsql.replace(table, 'table').replace('  ', ' ');

		// remove (etc) as sub
		var sql = this._cleanSQL(sql);

		// set
		this._SQLEditor.setValue(sql);
	
	},

	_cleanSQL : function (sql) {
		var first = sql.substring(0,1);
		var last = sql.slice(-8);

		// if sql is of format (SELECT * FROM table) as sub
		if (first == '(' && last == ') as sub') {
			var clean_sql = sql.substr(1, sql.length -9);
			return clean_sql;
		}

		return sql;
	},

	_showEditors : function () {
		this._SQLEditor.getWrapperElement().style.opacity = 1;
		this._cartoEditor.getWrapperElement().style.opacity = 1;
		this._sqltitle.style.opacity = 1;
		this._cartotitle.style.opacity = 1;
		this._refreshButton.style.opacity = 1;
	},

	_hideEditors : function () {
		this._SQLEditor.getWrapperElement().style.opacity = 0;
		this._cartoEditor.getWrapperElement().style.opacity = 0;
		this._sqltitle.style.opacity = 0;
		this._cartotitle.style.opacity = 0;
		this._refreshButton.style.opacity = 0;
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
});



// ┌┬┐┌─┐┌─┐┬ ┌┬┐┬┌─┐
//  │ │ ││ ││  │ │├─┘
//  ┴ └─┘└─┘┴─┘┴ ┴┴  

Wu.Chrome.Content.Tooltip = Wu.Chrome.Content.extend({


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

	// Runs on init
	show : function () {
		
		if (!this._inited) this._initLayout();

		// hide others
		this.hideAll();

		// show this
		this._container.style.display = 'block';

		// mark button
		Wu.DomUtil.addClass(this.options.trigger, 'active-tab');
	},

	// Event run when layer selected 
	_selectedActiveLayer : function (e) {

		var layerUuid = e.target.value;
		this._layer = this._project.getLayer(layerUuid);

		// Get stored tooltip meta
		this.tooltipMeta = this._layer.getTooltip();
		
		// Get layermeta
		var layerMeta = JSON.parse(this._layer.store.metadata)

		// If no tooltip meta stored, create from layer meta
		if ( !this.tooltipMeta ) this.tooltipMeta = this.createTooltipMeta(layerMeta);

		this._fieldsWrapper = Wu.DomUtil.create('div', 'chrome-field-wrapper', this._container);

		// Init title
		this.initTitle();

		// Init description
		this.initDescription();

		// Initialize fields
		this.initFields();
	},

	// Title
	initTitle : function () {

		var title = this.tooltipMeta.title;

		// Wrapper
		var sectionWrapper = Wu.DomUtil.create('div', 'chrome-content-section-wrapper', this._fieldsWrapper)		
		
		// Header
		var header = Wu.DomUtil.create('div', 'chrome-content-header', sectionWrapper, 'Title');

		var titleInput = Wu.DomUtil.create('input', 'chrome-content-tooltip-title-field', sectionWrapper)
		    titleInput.id   = 'tooltip-title-input';
		    titleInput.name = 'tooltip-title-input';
		    
		    titleInput.setAttribute('placeholder', this._layer.store.title);

		    if ( title ) titleInput.value = title;

		Wu.DomEvent.on(titleInput, 'blur', this.saveTitle, this);
	},

	// Description
	initDescription : function () {
	},

	// Tooltip meta
	createTooltipMeta : function (layerMeta) {

		// Get columns
		var columns = layerMeta.columns;

		// Returns object with timeseries separated from the other fields
		var splitMetaData = this.buildTimeSeries(columns);

		if ( splitMetaData[1] > 5 ) {
		
			return splitMetaData[0];
		
		} else {

			return this.cleanColumns(columns);
		}
	},

	// Create clean columns (without time series)
	cleanColumns : function (columns) {

		var metaData = {
			title : '',
			description : false,
			metaFields : {},
			timeSeries : false
		};

		for ( var f in columns ) {
			
			metaData.metaFields[f] = {
					title : false,
					on    : true
			}
		}

		return metaData;
	},

	// Splits metadata into "time series" and "meta fields"
	buildTimeSeries : function (columns) {

		var metaData = {
			title : '',
			description : false,			
			timeSeries : {},
			metaFields : {}
		}
		
		var timeSeriesCount = 0;

		for ( var f in columns ) {

			var _key = f;
			var isTime = this._validateDateFormat(_key);

			// Is time series
			if ( isTime ) {
				
				metaData.timeSeries[_key] = {
						title : false,
						on    : true
				}

				timeSeriesCount ++;

			// Is not time series
			} else {
				
				metaData.metaFields[_key] = {
						title : false,
						on    : true
				};

			}       
		}

		return [metaData, timeSeriesCount];
	},

	// Init meta fields and time series
	initFields : function () {

		this.fieldListFromObject('Fields')
		if ( this.tooltipMeta.timeSeries ) this.initTimeSeries();
	},

	// Creates section with meta field lines
	fieldListFromObject : function (title, timeSeries) {


		var fields = timeSeries ? this.tooltipMeta.timeSeries : this.tooltipMeta.metaFields;

		var sectionWrapper = Wu.DomUtil.create('div', 'chrome-content-section-wrapper', this._fieldsWrapper)
		var header = Wu.DomUtil.create('div', 'chrome-content-header', sectionWrapper, title);

		for ( var key in fields ) {
			
			var isOn = fields[key].on;
			var title = fields[key].title;

			// Block 
			if ( key == 'enable' || key == 'minmaxRange' || key == 'graphstyle' ) return;

			var options = {
				key 		: key, 
				wrapper 	: sectionWrapper,
				input 		: true,
				title 		: title,
				isOn 		: isOn,
				rightPos	: false,
				type 		: 'switch'
				
			}

			this._createMetaFieldLine(options);
		}
	},

	// Cretes section with time series
	initTimeSeries : function () {

		var timeSeries = this.tooltipMeta.timeSeries;

		// Wrapper
		var sectionWrapper = Wu.DomUtil.create('div', 'chrome-content-section-wrapper', this._fieldsWrapper)		
		
		// Header
		var header = Wu.DomUtil.create('div', 'chrome-content-header', sectionWrapper, 'Time series');
		var headerExtra = Wu.DomUtil.create('span', 'chrome-content-header-gray', header, ' (auto detected)');

		// Enable tims series switch
		var options = {
			key 		: 'enable', 
			wrapper 	: sectionWrapper,
			input 		: false,
			title 		: 'Enable time series',
			isOn 		: this.tooltipMeta.timeSeries.enable,
			rightPos	: true,
			type 		: 'switch'

		}
		var enableTimeSeries = this._createMetaFieldLine(options);
		
		// Use min/max from styling switch
		var options = {
			key 		: 'minmaxRange', 
			wrapper 	: sectionWrapper,
			input 		: false,
			title 		: 'Range',
			isOn 		: true,
			rightPos	: true,
			type 		: 'miniInput',
			value 		: this.tooltipMeta.timeSeries.minmaxRange,
			
		}
		var useMinMaxFromStyle = this._createMetaFieldLine(options)

		// Use min/max from styling switch
		var options = {
			key 		: 'graphstyle', 
			wrapper 	: sectionWrapper,
			input 		: false,
			title 		: 'Graph style',
			isOn 		: this.tooltipMeta.timeSeries.graphstyle,
			rightPos	: true,
			type 		: 'dropdown',
			dropdown	: ['scatter', 'line'],
			
			
		}

		var graphType = this._createMetaFieldLine(options)


		// Create list of time series fields
		this.fieldListFromObject('Time Series Fields', true);
	},	
	

	// Save title
	saveTitle : function (e) {

		this.tooltipMeta.title = e.target.value;
		this._layer.setTooltip(this.tooltipMeta);
	},

	// Save input fields in meta field lines
	saveFromBlur : function (e) {
		
		var key   = e.target.id.substring(12, e.target.id.length);
		var value = e.target.value;
		
		var thisSwitch = Wu.DomUtil.get('field_switch_' + key);
		var thisSwitchState = thisSwitch.getAttribute('state');

		var on = thisSwitchState ? true : false;

		this._saveToServer(key, value, on);
	},

	// Saves tiny input to right
	saveMiniBlur : function (e) {

		var key   = e.target.id.substring(17, e.target.id.length)
		var value = e.target.value;

		this._saveToServer(key, false, value);
	},

	// Saves switches, etc
	_saveToServer : function (_key, title, on) {

		var titleField = Wu.DomUtil.get('field_input_' + _key);
		var title      = titleField ? titleField.value : false;

		// If no title, set to false
		if ( !titleField ) var title = false 
		else 	           var title = titleField.value
			

		if ( _key == 'enable' || _key == 'minmaxRange' || _key == 'graphstyle' ) {
			
			// Update object
			this.tooltipMeta.timeSeries[_key] = on;

			// Save to server
			this._layer.setTooltip(this.tooltipMeta);

			return;
		}

		// Check if key is date	
		var keyIsDate = this._validateDateFormat(_key);
		
		// If key is date, try to update timeseries
		if ( keyIsDate ) var timeUpdated = this.updateTimeSeriesMeta(_key, title, on);
		
		// If key is not date, or could not be found in time series, go through metafields
		if ( !timeUpdated || !keyIsDate ) this.updateMeta(_key, title, on);
	
		// Save to server
		this._layer.setTooltip(this.tooltipMeta);
	},

	// Save helpers – goes through the JSON object to find a key match in the time series
	updateTimeSeriesMeta : function (_key, title, on) {

		var timeSeries = this.tooltipMeta.timeSeries;
		var hit = false;

		for ( var f in timeSeries ) {

			if ( f == _key ) {

				timeSeries[f].title = title;
				timeSeries[f].on = on;			

				hit = true
			}
		}

		return hit;
	},

	// Save helper – goes through the JSON object to find a key match in the meta fields
	updateMeta : function (_key, title, on) {

		var metaFields = this.tooltipMeta.metaFields;

		for ( var f in metaFields ) {

			if ( f == _key ) {

				metaFields[f].title = title;
				metaFields[f].on = on;
				return;
			}
		}
	},

	
	open : function () {
		console.log('open!', this);
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

});



