Wu.Chrome.SettingsContent.Extras = Wu.Chrome.SettingsContent.extend({

	_ : 'extras',

	options : {
		dropdown : {
			staticText : 'None',
			staticDivider : '-'
		},

	},

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

		this._layer = this._project.getLayer(this.layerUuid);

		if (!this._layer) return;

		// Store uuid of layer we're working with
		this._storeActiveLayerUuid(this.layerUuid);		

		// get current style, returns default if none
		var style = this._layer.getStyling();

		this.tabindex = 1;

		this.cartoJSON = style || {};

		


		this.getLayerMeta();

		// Add temp layer
		this._tempaddLayer();


		// Clear
		this._fieldsWrapper.innerHTML = '';

	
		// Globesar Extras
		this.initGlobesarExtras();




	},




	// Get all metafields
	// Get all metafields
	// Get all metafields	

	getLayerMeta : function () {

		// Get layer
		var layer = this._layer = this._project.getLayer(this.layerUuid);

		// Get styling json
		this.cartoJSON = layer.getStyling();

		// Get stored tooltip meta
		var tooltipMeta = layer.getTooltip();
		
		// Get layermeta
		var layerMeta = layer.getMeta();

		// Get columns
		this.columns = layerMeta.columns;

		this.metaFields = [this.options.dropdown.staticText, this.options.dropdown.staticDivider];

		for ( var k in this.columns ) {

			var isDate = this._validateDateFormat(k);

			if ( !isDate ) {
				this.metaFields.push(k);
			}
		}
	},



	// GLOBSAR EXTRAS
	// GLOBSAR EXTRAS
	// GLOBSAR EXTRAS

	initGlobesarExtras : function () {

		if ( !this.cartoJSON.extras || !this.cartoJSON.extras.referencepoint ) {

			this.cartoJSON.extras = {
				referencepoint : {
					column : false,
					value  : false
				}
			}

		}		


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
			right 	    : true,
			isOn        : true,
			appendTo    : angleLine.container,
			value       : angle,
			placeholder : 'none',
			className   : 'globesar-extras-input',
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
			right 	    : true,
			isOn        : true,
			appendTo    : pathLine.container,
			value       : path,
			placeholder : 'none',
			className   : 'globesar-extras-input',
			tabindex    : 2,
			fn 	    : this._saveMiniBlur.bind(this),		
		})


		// Reference point
		// Reference point
		// Reference point

		var referenceLine = new Wu.fieldLine({
			id       : 'referencepoint',
			appendTo : wrapper,
			title    : 'Reference point',
			input    : false,	
		})


		var range = this.cartoJSON.extras.referencepoint.column;
		var val   = this.cartoJSON.extras.referencepoint.value;
		var isOn  = range ? false : true;

		// Dropdown
		var referenceDropDown = new Wu.button({
			id 	  : 'referencepoint',
			type 	  : 'dropdown',
			right 	  : true,
			appendTo  : referenceLine.container,
			fn 	  : this._selectedMiniDropDown.bind(this),
			array 	  : this.metaFields,
			selected  : range,
			reversed  : true,
			className : 'globesar-extras-ref-point-dropdown'
		});


		// Input
		var _referencePointInput = new Wu.button({
			id 	    : 'referencepoint',
			type 	    : 'miniInput',
			right 	    : true,
			isOn        : !isOn,
			appendTo    : referenceLine.container,
			value       : val,
			placeholder : 'value',
			tabindex    : 3,
			className   : 'globesar-extras-input',
			allowText   : true,
			fn 	    : this._blurRefPointValue.bind(this),
		});		

	},



	// ON SELECT MINI DROP DOWN
	_selectedMiniDropDown : function (e) {

		var key = e.target.getAttribute('key');
		var fieldName = e.target.value;

		var wrapper = e.target.parentElement;

		var _miniInput = Wu.DomUtil.get('field_mini_input_referencepoint');		

		// UNSELECTING FIELD
		// UNSELECTING FIELD
		// UNSELECTING FIELD

		// Clean up if we UNSELECTED field
		if ( fieldName == this.options.dropdown.staticText || fieldName == this.options.dropdown.staticDivider) {

			this.selectedColumn = false;
			this.cartoJSON.extras = {
				referencepoint : false
			}


			Wu.DomUtil.addClass(_miniInput, 'left-mini-kill');
			Wu.DomUtil.addClass(wrapper, 'full-width');

			return;
		}


		this.selectedColumn = fieldName;
		this._saveRefPointValue();		

		// SELECTING FIELD
		// SELECTING FIELD
		// SELECTING FIELD

		Wu.DomUtil.removeClass(_miniInput, 'left-mini-kill');
		Wu.DomUtil.removeClass(wrapper, 'full-width');

	},



	_blurRefPointValue : function (e) {

		this.selectedValue = e.target.value;
		this._saveRefPointValue();

	},

	_saveRefPointValue : function () {

		var value  = this.selectedValue;
		var column = this.selectedColumn;

		// If no value
		if ( !value || value == '' || column == this.options.staticText || column == this.options.staticDivider ) {
			this.cartoJSON.extras = {
				referencepoint : false,
			}

		// Store value
		} else {
			this.cartoJSON.extras = {
				referencepoint : {
					column : column,
					value  : value
				}
			}
		}

		this._updateStyle();

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




	// CARTO CARTO CARTO CARTO
	// CARTO CARTO CARTO CARTO
	// CARTO CARTO CARTO CARTO

	_updateStyle : function () {
		
		this.getCartoCSSFromJSON(this.cartoJSON, function (ctx, finalCarto) {
			this.saveCartoJSON(finalCarto);
		});

	},


	getCartoCSSFromJSON : function (json, callback) {

		var options = {
			styleJSON : json,
			columns : this.columns
		}


		Wu.post('/api/geo/json2carto', JSON.stringify(options), callback.bind(this), this);

	},	


	saveCartoJSON : function (finalCarto) {

		this._layer.setStyling(this.cartoJSON);

		var sql = this._layer.getSQL();

		// request new layer
		var layerOptions = {
			css : finalCarto, 
			sql : sql,
			layer : this._layer
		}

		this._updateLayer(layerOptions);;		

	},


	_updateLayer : function (options, done) {

		var css = options.css,
		    layer = options.layer,
		    file_id = layer.getFileUuid(),
		    sql = options.sql,
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

		var that = this;

		console.log('layerJSON', layerJSON);

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
});








