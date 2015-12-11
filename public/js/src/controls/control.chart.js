Wu.Control.Chart = Wu.Control.extend({

	initialize : function(options) {

		// OTHER OPTIONS
		var multiPopUp = options.multiPopUp;
		var e = options.e;

		if ( multiPopUp ) {

			// Get pop-up settings
			var _layer = this._getWuLayerFromPostGISLayer(multiPopUp.layer_id);
			this.popupSettings = _layer.getTooltip();

			// Create content
			var content = this.multiPointPopUp(multiPopUp);


		} else {

			if (!e) {
				console.error('no "e" provided?');
				return;
			}

			// Get pop-up settings
			this.popupSettings = e.layer.getTooltip();

			// Create content
			var content = this.singlePopUp(e);

		}

		// clear old popup
		this._popup = null;

		// return if no content
		if (!content) return;

		// Create empty		
		if (!this._popupContent) this._popupContent = '';
			
		// append content
		this._popupContent = content;

		// Open popup
		this.openPopup(e, multiPopUp);

	},


	// Open pop-up
	openPopup : function (e, multiPopUp) {

		if (this._popup) return;

		var popup   = this._createPopup(),
		    content = this._popupContent,
		    map     = app._map,
		    project = this._project || app.activeProject;

		// set latlng
		var latlng = multiPopUp ? multiPopUp.center : e.latlng;
		
		// return if no content
		if (!content) return this._clearPopup();
		
		// set popup close event
		this._addPopupCloseEvent();

		// keep popup while open
		this._popup = popup;

		// set content
		popup.setContent(content);

		// open popup
		popup.open();

		// show marker on popup, but not on multi cause polygon
		if (!multiPopUp) {

			// set latlng
			var latlng = this._getMarkerPosition(latlng, e);
			
			// Add marker circle
			this._addMarkerCircle(latlng);
		}
		
	},

	_getMarkerPosition : function (latlng, e) {

		// try to calculate true position of point, instead of mouse pos. need to look in data. 
		// this is kinda specific to globesar's data, but could be made pluggable.

		// var latlng = L.Projection.Mercator.unproject({x:e.data.north, y:e.data.east}); // wrong conversion, wrong epsg?

		return latlng;
	},

	// Add marker circle (not working)
	_addMarkerCircle : function (latlng) {

		var styling = { 
			radius: 10,
			fillColor: "white",
			color: "white",
			weight: 15,
			opacity : 1,
			fillOpacity: 0.4
		}

		this.popUpMarkerCircle = L.circleMarker(latlng, styling).addTo(app._map);
	},

	_addPopupCloseEvent : function () {
		if (this._popInit) return;
		this._popInit = true;	// only run once

		var map = app._map;
		map.on('popupclose',  this._clearPopup, this);
	},

	_removePopupCloseEvent : function () {
		var map = app._map;
		map.off('popupclose',  this._clearPopup, this);
	},

	_refresh : function () {

		if (this._popup) this._popup._remove();
		
		this._clearPopup(false);
	},

	_clearPopup : function (clearPolygons) {
		
		// clear polygon
		if (clearPolygons) app.MapPane.getControls().draw._clearAll();

		// nullify
		this._popupContent = '';
		this._popup = null;

		// remove marker
		this.popUpMarkerCircle && app._map.removeLayer(this.popUpMarkerCircle);

		// remove event
		this._removePopupCloseEvent();
	},
	
	// Create leaflet pop-up
	_createPopup : function () {

		// Create smaller pop-up if there are no graphs to show
		if ( !this.popupSettings.timeSeries || this.popupSettings.timeSeries.enable == false ) {
			var maxWidth = 200;
			var minWidth = 200;

		// Create large pop-up for graph
		} else {
			var maxWidth = 400;
			var minWidth = 200;			
		}

		// create popup
		var popup = this._popup = Wu.popup({
			offset : [18, 0],			
			closeButton : true,
			zoomAnimation : false,
			maxWidth : maxWidth,
			minWidth : minWidth,
			maxHeight : 350,
			appendTo : app._appPane // where to put popup
		});



		if ( !this.popupSettings.timeSeries || this.popupSettings.timeSeries.enable == false ) {
			Wu.DomUtil.addClass(popup._container, 'tiny-pop-up')
		}


		return popup;
	},



	// Create single point C3 pop-up content
	singlePopUp : function (e) {

		// check if timeseries
		var timeSeries = (this.popupSettings.timeSeries && this.popupSettings.timeSeries.enable == true );

		// create content, as timeseries or normal
		var content = timeSeries ? this.singleC3PopUp(e) : this._createPopupContent(e);

		return content;
	},

	// Create "normal" pop-up content without time series
	_createPopupContent : function (e) {


		var c3Obj = {
			data : e.data,
			layer : e.layer,
			layerName : e.layer.store.title,
			meta : false,
			popupSettings : this.popupSettings,
			d3array : {
		    		meta 	: [],
		    		xName 	: 'field_x', 
		    		yName 	: 'mm',
		    		x 	: [],
		    		y 	: [],
		    		ticks 	: [],
		    		tmpTicks : []
			},
			multiPopUp : false
		}

		this._c3Obj = this.createC3dataObj(c3Obj);

		var headerOptions = {
			headerMeta 	: this._c3Obj.d3array.meta,
			layerName 	: e.layer.store.title,
			areaSQ 		: false,
			pointCount 	: false,
			multiPopUp 	: false,
			layer 		: e.layer
		}

		// Create HTML
		var _header = this.createHeader(headerOptions);
		var _chartContainer = this.createChartContainer();
		var _footer = this.createFooter();

		var content = Wu.DomUtil.create('div', 'popup-inner-content');
		content.appendChild(_header);
		content.appendChild(_chartContainer);
		content.appendChild(_footer)


		return content;		
	},	


	singleC3PopUp : function (e) {

		var c3Obj = {
			data : e.data,
			layer : e.layer,
			meta : false,
			popupSettings : this.popupSettings,
			d3array : {
		    		meta 	: [],
		    		xName 	: 'field_x', 
		    		yName 	: 'mm',
		    		x 	: [],
		    		y 	: [],
		    		ticks 	: [],
		    		tmpTicks : []
			},
		}

		this._c3Obj = this.createC3dataObj(c3Obj);

		var headerOptions = {
			headerMeta 	: this._c3Obj.d3array.meta,
			layerName 	: e.layer.store.title,
			areaSQ 		: false,
			pointCount 	: false,
			multiPopUp 	: false,
			layer 		: e.layer
		}


		var content = Wu.DomUtil.create('div', 'popup-inner-content');

		// Create header HTML
		var _header = this.createHeader(headerOptions);
		var _chartContainer = this.createChartContainer();
		var _footer = this.createFooter();
		content.appendChild(_header);
		content.appendChild(_chartContainer);
		content.appendChild(_footer);

		// Create graph HTML
		if ( this.popupSettings && this.popupSettings.timeSeries.enable != false) {
			
			var _chart = this.C3Chart(this._c3Obj);
			var _chartTicks = this.chartTicks(this._c3Obj);
			_chartContainer.appendChild(_chart);
		
		}

		return content;			
	},


	_calculateRegression : function (c) {

		var c = this._c3object;
		var x = []; // dates
		var start_date;

		var y_ = _.clone(c.d3array.y);
		y_.splice(0,1);
		
		var y = [];
		y_.forEach(function (value) {
			y.push(parseFloat(value));
		});

		var dates = _.clone(c.d3array.x);
		dates.splice(0,1);

		dates.forEach(function (d, i) {
			if (i == 0) {
				// set start date
				start_date = moment(d);
				x.push(0);

			} else {
				// days since start_date
				var b = moment(d);
				var diff_in_days = b.diff(start_date, 'days');
				x.push(diff_in_days);
			}
		});

		var xx = [];
		var xy = [];

		x.forEach(function (x_, i) {
			xy.push(x[i] * y[i]);
			xx.push(x[i] * x[i]);
		});

		var x_sum = 0;
		var y_sum = 0;
		var xx_sum = 0;
		var xy_sum = 0;

		x.forEach(function (value, i) {
			x_sum += value;
		});

		y.forEach(function (value, i) {
			y_sum += value;
		});

		xx.forEach(function (value, i) {
			xx_sum += value;
		});

		xy.forEach(function (value, i) {
			xy_sum += value;
		});

		var n = y.length;
		var result_a = ((y_sum * xx_sum) - (x_sum * xy_sum)) / ((n * xx_sum) - (x_sum * x_sum));
		var result_b = ((n * xy_sum) - (x_sum * y_sum)) / ((n * xx_sum) - (x_sum * x_sum));
		var result_y_start = result_a + (result_b * x[0])
		var result_y_end = result_a + (result_b * x[x.length-1]);


		// var reg = ['regression', result_y_start, result_y_end];

		// need every step 
		var reg = ['regression'];
		y.forEach(function (y_, i) {
			if (i == 0) {
				reg.push(result_y_start);
			} else {
				var val = (result_y_end / n) * (i);
				reg.push(val);
			}
		});

		return reg;

	},

	// Create multi point C3 pop-up content
	multiPointPopUp : function (_data) {

		var _average = _data.average;
		var _center = _data.center;
		var _layer = this._getWuLayerFromPostGISLayer(_data.layer_id);
		var _layerName = _layer.store.title;
		var _totalPoints = _data.total_points;

		// Show square meters if less than 1000
		if ( _data.area < 1000 ) {

			var area = Math.round(_data.area);
			var _areaSQ = area + 'm' + '<sup>2</sup>';

		// Show square KM if more than 1000 (0.01 km2)
		} else {

			var area = _data.area / 1000000;
			var areaRounded = Math.floor(area * 1000) / 1000;
			var _areaSQ = areaRounded + 'km' + '<sup>2</sup>';
		}		

		
		var c3Obj = {

			data 		: _average,
			meta 		: false,
			popupSettings 	: this.popupSettings,
			d3array 	: {
				    		meta 	: [],
				    		xName 	: 'field_x', 
				    		yName 	: 'mm',
				    		x 	: [],
				    		y 	: [],
				    		ticks 	: [],
				    		tmpTicks : []
			},
			multiPopUp : {
					center 		: _center,
			}

		}

		this._c3Obj = this.createC3dataObj(c3Obj);


		var headerOptions = {
			headerMeta 	: this._c3Obj.d3array.meta,
			layerName 	: _layerName,
			areaSQ 		: _areaSQ,
			pointCount 	: _totalPoints,
			multiPopUp 	: true,
			layer 		: _layer
		}


		var content = Wu.DomUtil.create('div', 'popup-inner-content');

		// Create header
		var _header = this.createHeader(headerOptions);
		var _chartContainer = this.createChartContainer();
		var _footer = this.createFooter();
		content.appendChild(_header);
		content.appendChild(_chartContainer);
		content.appendChild(_footer);


		if ( this.popupSettings.timeSeries && this.popupSettings.timeSeries.enable == true ) {

			// Create chart
			var _chart = this.C3Chart(this._c3Obj);
			var _chartTicks = this.chartTicks(this._c3Obj);
			_chartContainer.appendChild(_chart);

		}

		

		return content;
	},		




	// xoxoxoxoxoxoxo
	chartTicks : function (c3Obj) {

		// Data
		var data = c3Obj.d3array;

		// Ticks
		var t = data.ticks;

		// var first_data_point = t[0]; // wrong, first tick is actually second data point
		var first_data_point = data.x[1];
		var last_data_point = data.x[data.x.length -1];

		// start/end date
		var start = moment(first_data_point).format("DD.MM.YYYY");
		var end = moment(last_data_point).format("DD.MM.YYYY");	

		this._footerDates.innerHTML = '<span class="start-date">' + start + '</span><span class="end-date">' + end + '</span>';
	},


	// PRODUCE HTML
	// PRODUCE HTML
	// PRODUCE HTML		

	createFooter : function () {
		var footerContainer = this._footerContainer = Wu.DomUtil.create('div', 'c3-footer');

		var dates = this._footerDates = Wu.DomUtil.create('div', 'c3-footer-dates', footerContainer);
		return footerContainer;
	},


	createChartContainer : function () {
		var chartContainer = this._chartContainer = Wu.DomUtil.create('div', 'c3-chart-container');
		return chartContainer;
	},


	// Header
	createHeader : function (options) {

		// get vars
		var headerMeta = options.headerMeta;
		var layerName  = options.layerName;
		var areaSQ     = options.areaSQ;
		var pointCount = options.pointCount;
		var multiPopUp = options.multiPopUp;


		// If custom title
		if ( this.popupSettings.title && this.popupSettings.title != '' ) {
			layerName = this.popupSettings.title
		}

		// Container
		var container = Wu.DomUtil.createId('div', 'c3-header-metacontainer');

		// If not time series, make small pop-up
		if ( !this.popupSettings.timeSeries || this.popupSettings.timeSeries.enable == false ) {
			container.className = 'small-pop-up';
		}

		// Header
		var headerWrapper = Wu.DomUtil.create('div', 'c3-header-wrapper', container);
		var headerName = Wu.DomUtil.create('div', 'c3-header-layer-name', headerWrapper, layerName)

		// add more text for multiquery
		if (multiPopUp) {
			
			// set geom text based on type
			var geom_type = options.layer.getMeta().geometry_type;
			var geom_text = 'items'
			if (geom_type == 'ST_Point') geom_text = 'points';
			if (geom_type == 'ST_MultiPolygon') geom_text = 'polygons';

			// set text
			var plural = 'Sampling ' + pointCount + ' ' + geom_text + ' over approx. ' + areaSQ;
			var _pointCount = Wu.DomUtil.create('div', 'c3-point-count', headerWrapper, plural);
		}


		var c = 0;
		headerMeta.forEach(function(meta, i) {

			var _key = meta[0];
			var _val = meta[1];

			var setting = this.popupSettings ? this.popupSettings.metaFields[_key] : false;

			if (!setting) return;

			if ( _key == 'geom' || _key == 'the_geom_3857' || _key == 'the_geom_4326' ) return;
			
			// Do not show field if there is no value
			if ( !_val ) return;

			// Do not show field if it's been set to "off" in settings!
			if ( setting.on == false ) return;

			// Use title from settings, if there is one
			if (  setting.title && setting.title != '' ) {
				var title = setting.title
			} else {
				var title = _key;
			}

			c++;

			var roundedVal = 100;

			if ( roundedVal ) {
				var newVal = Math.floor(parseFloat(_val) * roundedVal) / roundedVal;

				if (!isNaN(newVal)) {
					_val = newVal;
				}
				
			}



			if ( _val ) {
				var metaPair = Wu.DomUtil.create('div', 'c3-header-metapair metapair-' + c, container);
				var metaKey = Wu.DomUtil.create('div', 'c3-header-metakey', metaPair, title);
				var metaVal = Wu.DomUtil.create('div', 'c3-header-metaval', metaPair, _val);
			}

		}.bind(this));

		return container;

	},

	// Chart
	C3Chart : function (c3Obj) {
		
		var data = c3Obj.d3array;

		// Ticks
		var t = data.ticks;

		// X's and Why's
		var x = data.x;
		var y = data.y;

		// Get first TICK date and the first X date
		var firstTickDate = t[0];
		var firstXDate = x[0];

		// If the first X date is more recent than the first TICK date,
		// remove the first tick date.
		if ( firstXDate > firstTickDate ) t.splice(0,1);	
		
		// Get min and max Y
		var minY = Math.min.apply(null, y);
		var maxY = Math.max.apply(null, y);

		// Get range
		var range;

		var settingsRange = c3Obj.popupSettings.timeSeries.minmaxRange;
	
		// Use range from settings
		if ( settingsRange ) {
	
			range = parseInt(settingsRange);
	
		// Use dynamic range based on current point
		} else {
		
			if ( minY < 0 ) {
				var convertedMinY = Math.abs(minY);
				if ( convertedMinY > maxY ) 	range = convertedMinY;
				else 				range = maxY;
			} else {
				range = Math.floor(maxY * 100) / 100;
			}

		}

		this._range = range;

		// Column name
		var xName = data.xName;
		var yName = data.yName;

		// Add column name to X and Y (required by C3)
		x.unshift(xName);
		y.unshift(yName);

		_columns = [x, y];


		// Create container
		var _C3Container = Wu.DomUtil.createId('div', 'c3-container');	


		// CHART SETTINGS
		var chart = this._chart = c3.generate({
		        
		        interaction : true,

		        bindto: _C3Container,
		        
			size: {
				height: 200,
				width: 430
			},

			point : {
				show : false,
				r: 3,
			},

			grid: { y: { show: true },
				x: { show: true }
			},

			legend: {
				show: false
			},		

			zoom : {
				enabled : false,
				
			},
		        data: {

		                xs: {
		                        mm: 'field_x',
		                        regression : 'reg_x'
		                },

		                columns: _columns,

		                colors : {
		                	mm: '#0000FF',
		                	regression: '#C83333'
		                },
		                types: {
		                	mm : 'scatter',
		                	regression : 'line'
		                }
		        },



		        axis: {

		                x: {
		                        type: 'timeseries',
		                        localtime: false,
		                        tick: {
		                                format: '%Y',
		                                values: [],
		                                multiline: true
		                        }
		                },

		                y: {
		                	max : range,
		                	min : -range,
					tick: {
						format: function (d) { return Math.floor(d * 100)/100}
					}
		                },

		              

		        },

			tooltip: {
				grouped : true,
				format: {
					title: function (d) { 
						var nnDate = moment(d).format("DD.MM.YYYY");
						return nnDate;
					},
				},
				
			},	        

			color: {
				pattern: ['#000000']
			}		        
		});


		// add zoom events
		this._addChartEvents(_C3Container);

		// add regression button
		this._addRegressionButton();

		return _C3Container;
	},


	_addRegressionButton : function () {


		var w = Wu.DomUtil.create('div', 'regression-button-wrapper', this._footerContainer);

		this.regressionButton = new Wu.button({ 
			type 	  : 'switch',
			isOn 	  : false,
			right 	  : false,
			id 	  : 'regression-button',
			appendTo  : w,
			fn 	  : this._updateRegression.bind(this),
			className : 'relative-switch'
		})

		// label
		var label = Wu.DomUtil.create('label', 'invite-permissions-label', w);
		label.htmlFor = 'regression';
		label.appendChild(document.createTextNode('Regression'));


	},

	_updateRegression : function (e) {

		var elem = e.target;
		var on = elem.getAttribute('on');

		if ( on == 'false' || !on ) {

			Wu.DomUtil.addClass(elem, 'switch-on');
			elem.setAttribute('on', 'true');

			// get regression 
			var reg = this._calculateRegression();
			var x = this._c3Obj.d3array.x;

			var reg_y = [reg[0], reg[1], reg[reg.length-1]];
			var reg_x = ['reg_x', x[1], x[x.length-1]];

			// add to chart
			this._chart.load({
				columns: [reg_x, reg_y]
			});

			// analytics/slack
			app.Analytics.onEnabledRegression();
		
		} else {

			Wu.DomUtil.removeClass(elem, 'switch-on');
			elem.setAttribute('on', 'false');

			this._chart.unload({
				ids : 'regression'
			})

		}
		
	},


	_addChartEvents : function (div) {

		// mousewheel zoom on chart
		Wu.DomEvent.on(div, 'mousewheel', _.throttle(this._onChartMousemove, 50), this); // prob leaking
	},

	_onChartMousemove : function (e) {

		// cross-browser wheel delta
		var e = window.event || e; // old IE support
		var delta = Math.max(-1, Math.min(1, (e.wheelDeltaY || -e.detail)));

		// only Y scroll
		if (e.wheelDeltaY == 0) return; // not IE compatible

		// size of step
		var d = this._range / 8;

		// zoom Y axis
		if (delta > 0) { // moving up

			// set range
			this._range = this._range += d;

			// update axis
			this._chart.axis.max(this._range);
			this._chart.axis.min(-this._range);
		
		} else { // moving down
			
			// set range
			this._range = this._range -= d;

			// dont go under 1
			if (this._range < 1) this._range = 1;

			// update axis
			this._chart.axis.max(this._range);
			this._chart.axis.min(-this._range);
		}

	},



	// DATA BUILDERS
	// DATA BUILDERS
	// DATA BUILDERS		

	// Create data object
	createC3dataObj : function (c3Obj) {

		var data = c3Obj.data;
		var meta = c3Obj.meta;		
		var d3array = c3Obj.d3array;

		// already stored tooltip (edited, etc.)
		if (meta) {		

			// add meta to tooltip
			for (var m in meta.fields) {

				var field = meta.fields[m];

				// only add active tooltips
				if (field.on) {

					// get key/value
					var _val = parseFloat(data[field.key]).toString().substring(0,10);
					var _key = field.title || field.key;

					this.C3dataObjBuilder(_key, _val, d3array);
				}
			}

		// first time use of meta.. (or something)
		} else {

			for (var key in data) {

				var _val = parseFloat(data[key]).toString().substring(0,10);
				if (_val == 'NaN') _val = data[key];
				var _key = key;

				this.C3dataObjBuilder(_key, _val, d3array);
			}
		}


		this._c3object = c3Obj;

		return c3Obj;
	},


	// Split time series from other meta
	// TODO: fix this sheeet
	C3dataObjBuilder : function (_key, _val, d3array) {

		// Stop if disabled date in timeseries
		if ( this.popupSettings.timeSeries && this.popupSettings.timeSeries[_key] ) {
			if ( !this.popupSettings.timeSeries[_key].on ) return;
		}
		     

		var isDate = this._validateDateFormat(_key);

		// CREATE DATE SERIES
		// CREATE DATE SERIES
		if ( isDate ) {

			// Create Legible Date Value
			var nnDate = new Date(isDate);

			// DATE
			d3array.x.push(nnDate);

			// VALUE
			d3array.y.push(_val);


			// Get only year
			// var year = moment(isDate).format("YYYY");
			// var chartTick = new Date(year);

			var cleanDate = moment(isDate);
			var chartTick = new Date(cleanDate);



			var newTick = true;

			// Calculate the ticks
			d3array.ticks.forEach(function(ct) { 

				// Avoid duplicates... (must set toUTCString as _date is CEST time format, while chartTick is CET)
				if ( ct == chartTick ) newTick = false; 

			})

			if ( newTick ) d3array.ticks.push(chartTick);

		// CREATE META FIELDS
		// CREATE META FIELDS
		} else {

			d3array.meta.push([_key, _val])

		}
	},



	// OTHER HELPERS
	// OTHER HELPERS
	// OTHER HELPERS	

	_getWuLayerFromPostGISLayer : function (postgis_layer_id) {

		var layers = app.activeProject.getLayers();
		var layerUuid = _.find(layers, function(layer) {
			if (!layer || !layer.store || !layer.store.data || !layer.store.data.postgis) return false;
			return layer.store.data.postgis.layer_id == postgis_layer_id;
		});
		return layerUuid;		
	},	

	_validateDateFormat : function (_key) {

		// Default fields that for some reason gets read as time formats...
		if ( _key == 'the_geom_3857' || _key == 'the_geom_4326' ) return false;

		if (_key.length < 6) return false; // cant possibly be date

		// if only letters, not a date
		if (this._validate.onlyLetters(_key)) return;

		// if less than six and has letters
		if (this._validate.shortWithLetters(_key)) return;

		// If it's Frano's time series format
		var _m = moment(_key, ["YYYYMMDD", moment.ISO_8601]).format("YYYY-MM-DD");
		if ( _m != 'Invalid date' ) return _m;

		// If it's other time format
		var _m = moment(_key).format("YYYY-MM-DD"); // buggy
		if ( _m != 'Invalid date' ) return _m;

		// If it's not a valid date...
		return false;
	},	

	_validate : {

		onlyLetters : function (string) {
			var nums = [];
			_.each(string, function (s) {
				if (!isNaN(s)) nums.push(s);
			})
			if (nums.length) return false;
			return true;
		},

		shortWithLetters : function (string) {
			var letters = [];
			_.each(string, function (s) {
				if (isNaN(s)) letters.push(s);
			});

			if (letters.length && string.length < 7) return true;
			return false;
		},
	},

	

})