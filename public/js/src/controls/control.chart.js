Wu.Control.Chart = Wu.Class.extend({


	// INITIALIZE POP-UP

	initialize : function(options) {
		

		// OTHER OPTIONS
		// chartSize = [x, y];
		// chartType = 'scatterplot'
		// chartRange = [x, y]

		var multiPopUp = options.multiPopUp;
		var d3popup    = options.d3popup;
		var e 	       = options.e;

		if ( multiPopUp ) var content = this.multiC3PopUp(multiPopUp);
		else 		  var content = d3popup ? this.singlecC3PopUp(e) : this._createPopupContent(e);

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


	// UNIVERSAL OPEN/CLOSE POP-UP FUNCTIONS
	// UNIVERSAL OPEN/CLOSE POP-UP FUNCTIONS
	// UNIVERSAL OPEN/CLOSE POP-UP FUNCTIONS

	// Open pop-up
	openPopup : function (e, multiPopUp) {

		if (this._popup) return;

		var popup   = this._createPopup(),
		    content = this._popupContent,
		    map     = app._map;


		var latlng = multiPopUp ? multiPopUp.center : e.latlng;
		
		// return if no content
		if (!content) return this._clearPopup();
		
		// set popup close event
		this._addPopupCloseEvent();

		// keep popup while open
		this._popup = popup;

		// set content
		popup.setContent(content);
		popup.setLatLng(latlng);

		popup.openOn(map);		// todo: still some minor bugs,

		if ( multiPopUp ) return;

		// 1. lat/lng ing column
		var latlng = L.latLng(e.data.lat, e.data.lon);	 // todo: remove this??

		// 2 north/east as 3857
		if (!latlng) {
			var latlng = L.Projection.Mercator.unproject({x:e.data.north, y:e.data.east}); // wrong conversion, wrong epsg?
		}

		// Add marker circle
		// this._addMarkerCircle(latlng);
	},

	// Add marker circle (not working)
	_addMarkerCircle : function (latlng) {

		var styling = { 
			radius: 10,
			fillColor: "#f03",
			color: "red",
			fillOpacity: 0.5
		}

		this.popUpMarkerCircle = L.circleMarker(latlng, styling).addTo(map);
	},

	// Close pop-up
	_addPopupCloseEvent : function () {
		if (this._popInit) return;
		this._popInit = true;	// only run once

		var map = app._map;
		map.on('popupclose',  this._clearPopup, this);
	},

	// Clear pop-up
	_clearPopup : function () {
		this._popupContent = '';
		this._popup = null;
		this.popUpMarkerCircle && app._map.removeLayer(this.popUpMarkerCircle);
	},
	
	// Create leaflet pop-up
	_createPopup : function () {

		// create popup
		var popup = L.popup({
			offset : [18, 0],
			closeButton : true,
			zoomAnimation : false,
			maxWidth : 400,
			minWidth : 200,
			maxHeight : 350,
		});

		return popup;
	},



	// CREATE POP-UP CONTENT
	// CREATE POP-UP CONTENT
	// CREATE POP-UP CONTENT		

	// Create "normal" pop-up content
	_createPopupContent : function (e) {

		// check for stored tooltip
		var data = e.data,
		    layer = e.layer,
		    meta = layer.getTooltip(),
		    string = '';

		var d3array = [];

		if (meta) {
			if (meta.title) string += '<div class="tooltip-title-small">' + meta.title + '</div>';

			// add meta to tooltip
			for (var m in meta.fields) {
				var field = meta.fields[m];

				// only add active tooltips
				if (field.on) {
					var caption = field.title || field.key;
					var value = data[field.key];

					// add to string
					string += caption + ': ' + value + '<br>';

				}
			}
			return string;

		} else {
			// create content
			var string = '';
			for (var key in data) {
				var value = data[key];
				if (value != 'NULL' && value!= 'null' && value != null && value != '' && value != 'undefined' && key != '__sid') {
					string += key + ': ' + value + '<br>';
				}
			}
			return string;
		}
	},

	// Create single point C3 pop-up content
	singlecC3PopUp : function (e) {

		var popupSettings = e.layer.getTooltip();
		// var _meta = false;

		var c3Obj = {


			data : e.data,
			layer : e.layer,
			layerName : e.layer.store.title,
			meta : false,
			popupSettings : popupSettings,
			d3array : {
		    		meta 	: [],
		    		xName 	: 'field_x', 
		    		yName 	: 'field_y',
		    		x 	: [],
		    		y 	: [],
		    		ticks 	: []
			},
			multiPopUp : false

		}

		var _c3Obj = this.createC3dataObj(c3Obj);

		// Create HTML
		var _HTML = this.C3HeaderHTML(_c3Obj);

		if ( popupSettings.timeSeries.enable ) _HTML += this.C3ChartHTML(_c3Obj);

		return _HTML;			
	},

	// Create multi point C3 pop-up content
	multiC3PopUp : function (_data) {	

		var _average = _data.average;
		var _center = _data.center;
		var _layer = this._getWuLayerFromPostGISLayer(_data.layer_id);
		var _layerName = _layer.store.title;
		var _meta = _layer.getTooltip();
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
			layer 		: _layer,
			layerName 	: _layerName,
			meta 		: _meta,
			d3array 	: {
				    		meta 	: [],
				    		xName 	: 'field_x', 
				    		yName 	: 'field_y',
				    		x 	: [],
				    		y 	: [],
				    		ticks 	: []
			},
			multiPopUp : {
					center 		: _center,
					totalPoints 	: _totalPoints,
					areaSQ 		: _areaSQ
			}

		}

		var _c3Obj = this.createC3dataObj(c3Obj);

		// Create HTML
		var _header = this.C3HeaderHTML(_c3Obj);
		var _HTML   = this.C3ChartHTML(_c3Obj);		

		return _header + _HTML;
	},		



	// PRODUCE HTML
	// PRODUCE HTML
	// PRODUCE HTML		

	// Header
	C3HeaderHTML : function (c3Obj) {

		var headerMeta = c3Obj.d3array.meta;
		var layerName  = c3Obj.layerName;

		var areaSQ     = c3Obj.multiPopUp.areaSQ;
		var pointCount = c3Obj.multiPopUp.totalPoints;


		if ( c3Obj.popupSettings.title && c3Obj.popupSettings.title != '' ) {
			layerName = c3Obj.popupSettings.title
		}

		var metaStr = '<div id="c3-header-metacontainer">';

		metaStr += '<div class="c3-header-wrapper">';
		metaStr += '<div class="c3-header-layer-name">' + layerName + '</div>';
		
		// If we're sampling more than one point
		if ( c3Obj.multiPopUp ) {
		
			var plural = pointCount + ' points over ' + areaSQ;
			metaStr += '<div class="c3-point-count">sampling&nbsp;' + plural + '</div>';
		
		}

		metaStr += '</div>';

		var c = 0;
		headerMeta.forEach(function(meta, i) {

			var _key = meta[0];
			var _val = meta[1];

			var setting = c3Obj.popupSettings.metaFields[_key];

			if ( _key == 'geom' || _key == 'the_geom_3857' || _key == 'the_geom_4326' ) { return }
			
			// Do not show field if there is no value
			if ( !_val ) return;

			// Do not show field if it's been set to "off" in settings!
			if ( setting.on == 'off' ) return;

			// Use title from settings, if there is one
			if (  setting.title && setting.title != '' ) {
				var title = setting.title
			} else {
				var title = _val;
			}

			c++;

			metaStr += '<div class="' + 'c3-header-metapair metapair-' + c + '">';
			metaStr += '<div class="c3-header-metakey">' + title + ':</div>';
			metaStr += '<div class="c3-header-metaval">' + _val + '</div>';
			metaStr += '</div>';

		});

		metaStr += '</div>';

		return metaStr;
	},

	// Chart
	C3ChartHTML : function (c3Obj) {
		
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

		// Column name
		var xName = data.xName;
		var yName = data.yName;

		// Add column name to X and Y (required by C3)
		x.unshift(xName);
		y.unshift(yName);

		// Colums
		_columns = [x, y];

		// Create container
		var _C3Container = Wu.DomUtil.createId('div', 'c3-container');	

		

		// CHART SETTINGS
		var chart = c3.generate({
		        
		        bindto: _C3Container,
		        
			size: {
				height: 250,
				width: 460
			},

			point : {
				r: 3.5,
			},

			grid: { y: { show: true },
				x: { show: true }
			},

			legend: {
				show: false
			},		

		        data: {

		                xs: {
		                        'field_y': 'field_x'
		                },

		                columns: _columns,

		                colors : {
		                	field_y: '#0000FF'
		                },

		                type: 'scatter',


		        },

		        axis: {
		                x: {
		                        type: 'timeseries',
		                        localtime: false,
		                        tick: {
		                        	format: function (x) { 
		                        		
							var year = x.getFullYear().toString().substr(2,2);
							var month = x.getMonth();

							// moment(x)

		                        		return month + '.' + year;

		                        	},
		                                // format: '%Y - %m',
		                                values: t,
		                                // rotate: 90,
		                                rotate: 75,
		                                multiline: false                                        
		                        }
		                },

		                y: {
		                	max : range,
		                	min : -range,
		                	// max : 50,
		                	// min : -50,
					tick: {
						format: function (d) { return Math.floor(d * 100)/100 }
					}
		                },

		        },

			color: {
				pattern: ['#000000']
			}		        
		});

		// NAAAASTY... 
		var _chartObject2HTML = new XMLSerializer().serializeToString(_C3Container);
		return _chartObject2HTML;
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
				var _key = key;

				this.C3dataObjBuilder(_key, _val, d3array);

			}
		}


		return c3Obj;
	},

	// Split time series from other meta
	C3dataObjBuilder : function (_key, _val, d3array) {

		var isDate = this.validateDateFormat(_key);

		// CREATE DATE SERIES
		// CREATE DATE SERIES
		if ( isDate ) {

			// // Create Legible Date Value        
			var yy = _key.substring(0, 4);
			var mm = _key.substring(4, 6);
			var dd = _key.substring(6, 10);
			var _date = yy + '-' + mm + '-' + dd;

			var nnDate = new Date(_date);

			// var nnDate = moment(_key, "YYYYMMDD").format("YYYY MM DD");

			// DATE
			d3array.x.push(nnDate);

			// VALUE
			d3array.y.push(_val);

			// TICKS				
			// var chartTick   = yy + '-' + mm + '-00';
			var chartTick = new Date(yy + '-' + mm);;
			// var chartTick = moment(_key, "YYYYMMDD");
			var newTick = true;

			// Calculate the ticks
			d3array.ticks.forEach(function(ct) { 

				// Avoid duplicates... (must set toUTCString as _date is CEST time format, while chartTick is CET)
				// if ( ct.toUTCString() == chartTick.toUTCString() ) newTick = false; 
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

	validateDateFormat : function (_key) {

		if ( _key.length != 8 ) return false;		
		var _m = moment(_key, ["YYYYMMDD", moment.ISO_8601]).format("MMM Do YY");		
		if ( _m == 'Invalid date' ) return false;
		return true;

	},					





})