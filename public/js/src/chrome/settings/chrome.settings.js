Wu.Chrome.SettingsContent = Wu.Chrome.extend({

	_initialize : function () {
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

	_initLayout_activeLayers : function (title, subtitle, container, layers) {

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
		if ( !layers ) var layers = this._project.getPostGISLayers();

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
		return app.Chrome.Right.options.editingLayer
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
		if (this._layer && !this._layer._added) {

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



	_gradientStyle : function (colorArray) {

		var gradientStyle = 'background: -webkit-linear-gradient(left, ' + colorArray.join() + ');';
		gradientStyle    += 'background: -o-linear-gradient(right, '     + colorArray.join() + ');';
		gradientStyle    += 'background: -moz-linear-gradient(right, '   + colorArray.join() + ');';
		gradientStyle    += 'background: linear-gradient(to right, '     + colorArray.join() + ');';

		return gradientStyle;

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
