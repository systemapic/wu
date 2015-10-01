Wu.Chrome.SettingsContent.Extras = Wu.Chrome.SettingsContent.extend({

	_ : 'extras',

	_initialize : function () {

		// init container
		this._initContainer();

		// add events
		this._addEvents();

	},

	_initContainer : function () {

		// Create Container
		this._container = Wu.DomUtil.create('div', 'chrome chrome-content chrome-pane extras', this.options.appendTo);

	},

	_initLayout : function () {

		this._layers = this._project.getDataLayers();

		this._midSection = Wu.DomUtil.create('div', 'chrome-middle-section', this._container);
		this._midOuterScroller = Wu.DomUtil.create('div', 'chrome-middle-section-outer-scroller', this._midSection);	
		this._midInnerScroller = Wu.DomUtil.create('div', 'chrome-middle-section-inner-scroller', this._midOuterScroller);	

		this._initLayout_activeLayers('Layer', 'Select layer', this._midInnerScroller, this._layers);		

		// Create Field Wrapper
		this._fieldsWrapper = Wu.DomUtil.create('div', 'chrome-field-wrapper', this._midInnerScroller);

	},

	_selectedActiveLayer : function (e, uuid) {

		this.layerUuid = uuid ? uuid : e.target.value

		// Globesar Extras
		this.initGlobesarExtras();

	},


	// GLOBSAR EXTRAS
	// GLOBSAR EXTRAS
	// GLOBSAR EXTRAS

	initGlobesarExtras : function () {

		this._fieldsWrapper.innerHTML = '';

		var wrapper = Wu.DomUtil.create('div', 'chrome-content-section-wrapper', this._fieldsWrapper);
		var header = Wu.DomUtil.create('div', 'chrome-content-header globesar-extras', wrapper, 'Globesar Extras');

		this.layer = this._project.getLayer(this.layerUuid);

		var satpos = Wu.parse(this.layer.getSatellitePosition());

		var path = satpos.path ? satpos.path : false;
		var angle = satpos.angle ? satpos.angle : false;


		// ANGLE
		// ANGLE
		// ANGLE

		var angleLine = new Wu.fieldLine({
			id       : 'satelliteAngle',
			appendTo : wrapper,
			title    : 'Satellite angle',
			input    : false,		
		})

		var angleMiniInput = new Wu.button({
			id 	    : 'satelliteAngle',
			type 	    : 'miniInput',
			right 	    : false,
			isOn        : true,
			appendTo    : angleLine.container,
			value       : angle,
			placeholder : 'none',
			tabindex    : 1,
			fn 	    : this._saveMiniBlur.bind(this),
		})


		// PATH
		// PATH
		// PATH

		var pathLine = new Wu.fieldLine({
			id       : 'satellitePath',
			appendTo : wrapper,
			title    : 'Satellite path',
			input    : false,	
		})

		var pathMiniInput = new Wu.button({
			id 	    : 'satellitePath',
			type 	    : 'miniInput',
			right 	    : false,
			isOn        : true,
			appendTo    : pathLine.container,
			value       : path,
			placeholder : 'none',
			tabindex    : 2,
			fn 	    : this._saveMiniBlur.bind(this),		
		})


	},



	// ON BLUR IN MINI FIELDS
	_saveMiniBlur : function (e) {

		var angle = Wu.DomUtil.get('field_mini_input_satelliteAngle').value;
		var path  = Wu.DomUtil.get('field_mini_input_satellitePath').value;
		this.layer = this._project.getLayer(this.layerUuid);

		// Save object
		this.satpos = {}
		if ( path ) this.satpos.path = path;
		if ( angle ) this.satpos.angle = angle;

		var satpos = this.satpos;

		this.layer.setSatellitePosition(JSON.stringify(satpos));

		// Update description...
		app.MapPane._controls.description.setHTMLfromStore(this.layerUuid);



	},	


	_refresh : function () {
		this._flush();
		this._initLayout();
	},

	_flush : function () {
		this._container.innerHTML = '';
	},
});








