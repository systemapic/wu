Wu.Chrome.SettingsContent.Tooltip = Wu.Chrome.SettingsContent.extend({


	_initialize : function () {


		// init container
		this._initContainer();

		// add events
		this._addEvents();

		// shortcut
		app.Tools = app.Tools || {};
		app.Tools.Tooltip = this;
		
	},

	_initContainer : function () {

		// create container
		this._container = Wu.DomUtil.create('div', 'chrome chrome-content chrome-pane chrome-tooltip', this.options.appendTo);
	},

	_initLayout : function () {


		if (!this._project) return;
  

  		// Scroller
		this._midSection = Wu.DomUtil.create('div', 'chrome-middle-section', this._container);
		this._midOuterScroller = Wu.DomUtil.create('div', 'chrome-middle-section-outer-scroller', this._midSection);
		this._midInnerScroller = Wu.DomUtil.create('div', 'chrome-middle-section-inner-scroller', this._midOuterScroller);

		// active layer
		this.layerSelector = this._initLayout_activeLayers(false, false, this._midInnerScroller);

		// Fields wrapper
		this._fieldsWrapper = Wu.DomUtil.create('div', 'chrome-field-wrapper', this._midInnerScroller);

		// mark as inited
		this._inited = true;
	},

	_refresh : function () {

		if ( this._inited ) this._flush();
		this._initLayout();
	},

	_flush : function () {

		this._midSection.innerHTML = '';
	},

	// Runs on init
	show : function () {

		if (!this._inited) this._initLayout();

		this._fieldsWrapper.innerHTML = '';

		// hide others
		this.hideAll();

		// show this
		this._container.style.display = 'block';

		// mark button
		Wu.DomUtil.addClass(this.options.trigger, 'active-tab');

		// Enable settings from layer we're working with
		var layerUuid = this._getActiveLayerUuid();
		if ( layerUuid ) this._selectedActiveLayer(false, layerUuid);

		// Select layer we're working on
		var options = this.layerSelector.childNodes;
		for ( var k in options ) {
			if ( options[k].value == layerUuid ) options[k].selected = true;
		}		
	},

	// Event run when layer selected 
	_selectedActiveLayer : function (e, uuid) {

		var layerUuid = uuid ? uuid : e.target.value;

		this._layer = this._project.getLayer(layerUuid);

		if (!this._layer) return; // hack
		
		// Store uuid of layer we're working with
		this._storeActiveLayerUuid(layerUuid);

		// Get stored tooltip meta
		this.tooltipMeta = this._layer.getTooltip();
		
		// Get layermeta
		var layerMeta = JSON.parse(this._layer.store.metadata)

		// If no tooltip meta stored, create from layer meta
		if ( !this.tooltipMeta ) this.tooltipMeta = this.createTooltipMeta(layerMeta);

		this._fieldsWrapper.innerHTML = '';

		// Init title
		this.initTitle();

		// Init description
		this.initDescription();

		// Initialize fields
		this.initFields();

	},

	// Title
	initTitle : function () {

		// get title
		var title = this.tooltipMeta.title;

		// Wrapper
		var sectionWrapper = Wu.DomUtil.create('div', 'chrome-content-section-wrapper', this._fieldsWrapper)		
		
		// Header
		var header = Wu.DomUtil.create('div', 'chrome-content-header', sectionWrapper, 'Title');

		var titleInput = Wu.DomUtil.create('input', 'chrome-content-tooltip-title-field', sectionWrapper);
		titleInput.id = 'tooltip-title-input';
		titleInput.name = 'tooltip-title-input';
		titleInput.setAttribute('placeholder', this._layer.store.title);

		if (title) titleInput.value = title;

		// set save event
		Wu.DomEvent.on(titleInput, 'blur', this.saveTitle, this);
	},

	// Description
	initDescription : function () {
	},


	// Init meta fields and time series
	initFields : function () {

		this.fieldListFromObject('Fields');
		if ( this.tooltipMeta.timeSeries ) this.initTimeSeries();
	},

	// Creates section with meta field lines
	fieldListFromObject : function (title, timeSeries) {

		var fields = timeSeries ? this.tooltipMeta.timeSeries : this.tooltipMeta.metaFields;

		var sectionWrapper = Wu.DomUtil.create('div', 'chrome-content-section-wrapper', this._fieldsWrapper)
		var header = Wu.DomUtil.create('div', 'chrome-content-header', sectionWrapper, title);

		// Function that saves on blur/click
		var saveFunction = timeSeries ? this._saveSwitchTimeSeries : this._saveSwitch;

		var hasInput = timeSeries ? false : true;

		for ( var key in fields ) {
			
			var isOn = fields[key].on;
			var title = fields[key].title;

			// Block 
			if ( key == 'enable' || key == 'minmaxRange' || key == 'graphstyle' ) return;

			var line = new Wu.fieldLine({
				id       : key,
				appendTo : sectionWrapper,
				title    : title,
				input    : hasInput,
				fn 	 : this._saveFromBlur.bind(this),
			});		

			var _switch = new Wu.button({
				id 	 : key,
				type 	 : 'switch',
				isOn 	 : isOn,
				right 	 : false,
				appendTo : line.container,
				fn       : saveFunction.bind(this)
			});



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


		// Time series switch
		// Time series switch
		// Time series switch

		var timeSeriesLine = new Wu.fieldLine({
			id       : 'enable',
			appendTo : sectionWrapper,
			title    : 'Enable time series',
			input    : false,
		});		

		var timeSeriesSwitch = new Wu.button({
			id 	 : 'enable',
			type 	 : 'switch',
			isOn 	 : this.tooltipMeta.timeSeries.enable,
			right 	 : false,
			appendTo : timeSeriesLine.container,
			fn 	 : this._saveSwitch.bind(this),
		});



		// RANGE
		// RANGE
		// RANGE

		var rangeLine = new Wu.fieldLine({
			id       : 'minmaxRange',
			appendTo : sectionWrapper,
			title    : 'Range',
			input    : false,
		})

		var rangeMiniInput = new Wu.button({
			id 	    : 'minmaxRange',
			type 	    : 'miniInput',
			right 	    : false,
			isOn        : true,
			appendTo    : rangeLine.container,
			value       : this.tooltipMeta.timeSeries.minmaxRange,
			placeholder : 'auto',
			tabindex    : 1,
			fn 	    : this._saveMiniBlur.bind(this),
		})



		// Create list of time series fields
		this.fieldListFromObject('Time Series Fields', true);
	},	
	

	// Save title
	saveTitle : function (e) {

		this.tooltipMeta.title = e.target.value;
		this._layer.setTooltip(this.tooltipMeta);
	},

	// Saves tiny input to right
	_saveMiniBlur : function (e) {

		var key   = e.target.id.substring(17, e.target.id.length)
		var value = e.target.value;

		this._saveToServer(key, value);
	},

	// Save input fields in meta field lines
	_saveFromBlur : function (e) {
	
		var key   = e.target.id.substring(12, e.target.id.length);
		var title = e.target.value;
		
		var thisSwitch = Wu.DomUtil.get('switch_' + key);
		var thisSwitchState = thisSwitch.getAttribute('state');

		// var on = thisSwitchState ? true : false;
		if ( thisSwitchState == 'true' ) {
			var on = true;
		} else {
			var on = false;
		}

		this._saveToServer(key, on, title);
	},

	// Saves switches, etc
	_saveSwitch : function (e, on) {

		var elem = e.target;
		var key  = elem.getAttribute('key');

		var titleField = Wu.DomUtil.get('field_input_' + key);
		var title      = titleField ? titleField.value : false;


		// If no title, set to false
		var title = titleField ? titleField.value : false;

		// Save to server
		this._saveToServer(key, on, title);
	},

	_saveSwitchTimeSeries : function (e, on) {

		var elem = e.target;
		var key  = elem.getAttribute('key');

		var titleField = Wu.DomUtil.get('field_input_' + key);
		var title      = titleField ? titleField.value : false;

		// If no title, set to false
		var title = titleField ? titleField.value : false;

		// Save to server
		this._saveToServer(key, on, title);
	},




	_saveToServer : function (key, value, title) {

		if ( key == 'enable' || key == 'minmaxRange' || key == 'graphstyle' ) {
			
			// Update object
			this.tooltipMeta.timeSeries[key] = value;

			// Save to server
			this._layer.setTooltip(this.tooltipMeta);

		} else {

			// Check if key is date	
			var keyIsDate = this._validateDateFormat(key);
			
			// If key is date, try to update timeseries
			if ( keyIsDate ) var timeUpdated = this.updateTimeSeriesMeta(key, title, value);
			
			// If key is not date, or could not be found in time series, go through metafields
			if ( !timeUpdated || !keyIsDate ) this.updateMeta(key, title, value);
		
		}

		this._layer.setTooltip(this.tooltipMeta);
	},



	// Save helpers – goes through the JSON object to find a key match in the time series
	updateTimeSeriesMeta : function (key, title, on) {	

		var timeSeries = this.tooltipMeta.timeSeries;
		var hit = false;

		for ( var f in timeSeries ) {

			if ( f == key ) {

				timeSeries[f].title = false;
				timeSeries[f].on = on;

				hit = true
			}
		}

		return hit;
	},

	// Save helper – goes through the JSON object to find a key match in the meta fields
	updateMeta : function (key, title, on) {	

		var metaFields = this.tooltipMeta.metaFields;

		for ( var f in metaFields ) {

			if ( f == key ) {
				metaFields[f].title = title;
				metaFields[f].on = on;
				return;
			}
		}
	},

	
	open : function () {
		console.log('open!', this);
	},



	// DATA BUILDERS
	// DATA BUILDERS
	// DATA BUILDERS
	// DATA BUILDERS

	// Gets called from Chrome Data _onLayerAdded()
	// TODO: Events?

	_buildTooltipMeta : function (layerMeta) {
		return this.createTooltipMeta(layerMeta);
	},


	// Tooltip meta
	createTooltipMeta : function (layerMeta) {

		// Get columns
		var columns = layerMeta.columns;

		// Returns object with timeseries separated from the other fields
		var splitMetaData = this.buildTimeSeries(columns);

		if (splitMetaData[1] > 5) {
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

		for (var f in columns) {
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

			// validate time
			var isTime = this._validateDateFormat(f);

			// Is time series
			if ( isTime ) {
				
				metaData.timeSeries[f] = {
						title : false,
						on    : true
				}

				timeSeriesCount ++;

			// Is not time series
			} else {
				
				metaData.metaFields[f] = {
						title : false,
						on    : true
				};

			}       
		}

		// Set time series to true by default
		metaData.timeSeries.enable = true;

		return [metaData, timeSeriesCount];
	},	

});
