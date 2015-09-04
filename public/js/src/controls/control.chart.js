Wu.Control.Chart = Wu.Class.extend({


	// INITIALIZE POP-UP
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


	// UNIVERSAL OPEN/CLOSE POP-UP FUNCTIONS
	// UNIVERSAL OPEN/CLOSE POP-UP FUNCTIONS
	// UNIVERSAL OPEN/CLOSE POP-UP FUNCTIONS

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
			fillColor: "#f03",
			color: "red",
			fillOpacity: 0.5
		}

		this.popUpMarkerCircle = L.circleMarker(latlng, styling).addTo(app._map);
	},

	_addPopupCloseEvent : function () {
		if (this._popInit) return;
		this._popInit = true;	// only run once

		var map = app._map;
		map.on('popupclose',  this._clearPopup, this);
	},

	_clearPopup : function () {
		this._popupContent = '';
		this._popup = null;
		this.popUpMarkerCircle && app._map.removeLayer(this.popUpMarkerCircle);
	},
	
	// Create leaflet pop-up
	_createPopup : function () {

		// Create smaller pop-up if there are no graphs to show
		if ( !this.popupSettings.timeSeries || this.popupSettings.timeSeries.enable == 'off' ) {
			var maxWidth = 150;
			var minWidth = 150;

		// Create large pop-up for graph
		} else {
			var maxWidth = 400;
			var minWidth = 200;			
		}

		// create popup
		var popup = Wu.popup({
			offset : [18, 0],
			closeButton : true,
			zoomAnimation : false,
			maxWidth : maxWidth,
			minWidth : minWidth,
			maxHeight : 350,
			appendTo : app._appPane // where to put popup
		});

		return popup;
	},



	// Create single point C3 pop-up content
	singlePopUp : function (e) {

		// check if timeseries
		var timeSeries = (this.popupSettings.timeSeries && this.popupSettings.timeSeries.enable == 'on');

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
		    		yName 	: 'field_y',
		    		x 	: [],
		    		y 	: [],
		    		ticks 	: [],
		    		tmpTicks : []
			},
			multiPopUp : false

		}

		var _c3Obj = this.createC3dataObj(c3Obj);

		var headerOptions = {
			headerMeta 	: _c3Obj.d3array.meta,
			layerName 	: e.layer.store.title,
			areaSQ 		: false,
			pointCount 	: false,
			multiPopUp 	: false
		}

		// Create HTML
		var _header = this.createHeader(headerOptions);

		var content = Wu.DomUtil.create('div', 'popup-inner-content');
		content.appendChild(_header);

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
		    		yName 	: 'field_y',
		    		x 	: [],
		    		y 	: [],
		    		ticks 	: [],
		    		tmpTicks : []
			},
		}

		var _c3Obj = this.createC3dataObj(c3Obj);

		var headerOptions = {
			headerMeta 	: _c3Obj.d3array.meta,
			layerName 	: e.layer.store.title,
			areaSQ 		: false,
			pointCount 	: false,
			multiPopUp 	: false
		}


		var content = Wu.DomUtil.create('div', 'popup-inner-content');

		// Create header HTML
		var _header = this.createHeader(headerOptions);
		content.appendChild(_header);

		// Create graph HTML
		if ( this.popupSettings && this.popupSettings.timeSeries.enable != 'off') {
			
			var _chart = this.C3Chart(_c3Obj);
			content.appendChild(_chart);
		
		}

		return content;			
	},

	// Create multi point C3 pop-up content
	multiPointPopUp : function (_data) {	

		console.log('%c multiPointPopUp', 'background: blue; color: white;');
		console.log('_data', _data);
		
		var _average = _data.average;
		var _center = _data.center;
		var _layer = this._getWuLayerFromPostGISLayer(_data.layer_id);
		var _layerName = _layer.store.title;
		var _totalPoints = _data.total_points;

		console.log('_totalPoints', _totalPoints);

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
				    		yName 	: 'field_y',
				    		x 	: [],
				    		y 	: [],
				    		ticks 	: [],
				    		tmpTicks : []
			},
			multiPopUp : {
					center 		: _center,
			}

		}

		var _c3Obj = this.createC3dataObj(c3Obj);


		var headerOptions = {
			headerMeta 	: _c3Obj.d3array.meta,
			layerName 	: _layerName,
			areaSQ 		: _areaSQ,
			pointCount 	: _totalPoints,
			multiPopUp 	: true
		}


		var content = Wu.DomUtil.create('div', 'popup-inner-content');

		// Create header
		var _header = this.createHeader(headerOptions);
		content.appendChild(_header);

		// Create chart
		var _chart = this.C3Chart(_c3Obj);
		content.appendChild(_chart);

		return content;
	},		



	// PRODUCE HTML
	// PRODUCE HTML
	// PRODUCE HTML		

	// Header
	createHeader : function (options) {

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
		if ( !this.popupSettings.timeSeries || this.popupSettings.timeSeries.enable == 'off' ) {
			container.className = 'small-pop-up';
		}

		// Header
		var headerWrapper = Wu.DomUtil.create('div', 'c3-header-wrapper', container);
		var headerName = Wu.DomUtil.create('div', 'c3-header-layer-name', headerWrapper, layerName)

		if ( multiPopUp ) {
			var plural = 'sampling ' + pointCount + ' points over ' + areaSQ;
			var _pointCount = Wu.DomUtil.create('div', 'c3-point-count', headerWrapper, plural);
		}


		var c = 0;
		headerMeta.forEach(function(meta, i) {

			var _key = meta[0];
			var _val = meta[1];

			if ( this.popupSettings ) var setting = this.popupSettings.metaFields[_key];
			else	  		  var setting = false;

			if ( _key == 'geom' || _key == 'the_geom_3857' || _key == 'the_geom_4326' ) { return }
			
			// Do not show field if there is no value
			if ( !_val ) return;

			// Do not show field if it's been set to "off" in settings!
			if ( setting.on == 'off' ) return;

			// Use title from settings, if there is one
			if (  setting.title && setting.title != '' ) {
				var title = setting.title
			} else {
				var title = _key;
			}

			c++;

			var roundedVal = 100;

			if ( roundedVal ) {
				var NewVal = Math.floor(parseFloat(_val) * roundedVal) / roundedVal;
				_val = NewVal;
			}

			var metaPair = Wu.DomUtil.create('div', 'c3-header-metapair metapair-' + c, container);
			var metaKey = Wu.DomUtil.create('div', 'c3-header-metakey', metaPair, title);
			var metaVal = Wu.DomUtil.create('div', 'c3-header-metaval', metaPair, _val);

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
				height: 200,
				width: 460
			},

			point : {
				r: 3,
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
		                                format: '%Y',
		                                values: t,
		                                multiline: false                                        
		                        }
		                },

		                y: {
		                	max : range,
		                	min : -range,
					tick: {
						format: function (d) { return Math.floor(d * 100)/100 }
					}
		                },
	                

		        },

			tooltip: {
				format: {
					title: function (d) { 

						// var isDate = this.validateDateFormat(_key);

						var nnDate = moment(d).format("DD.MM.YYYY");
						// xoxoxox
						return nnDate;
					},
			
				}
			},	        

			color: {
				pattern: ['#000000']
			}		        
		});

		return _C3Container;
	},


	clickChart : function () {

		console.log('%c clickChart', 'background: blue; color: white');

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
	// TODO: fix this sheeet
	C3dataObjBuilder : function (_key, _val, d3array) {

		var isDate = this._validateDateFormat(_key);

		// CREATE DATE SERIES
		// CREATE DATE SERIES
		if ( isDate ) {

			// var nnDate = new Date(_date);

			var nnDate = moment(_key, ["YYYYMMDD", moment.ISO_8601]).format("YY-MM-DD");			

			// DATE
			d3array.x.push(nnDate);

			// VALUE
			d3array.y.push(_val);


			// var momentChartTick = moment(_key, ["YYYYMMDD", moment.ISO_8601]).format("YYYY");
			var momentTmpTick = moment(_key, ["YYYYMMDD", moment.ISO_8601]).format('YYYY');
			
			var __momentTick = moment(_key, ["YYYYMMDD", moment.ISO_8601]).format("YYYY-MM-DD HH:mm");
			var momentTick = new Date(__momentTick);

			console.log('%c momentTmpTick', 'background: blue; color: white;');
			console.log(momentTmpTick);

			var newTick = true;


			// Calculate the ticks
			d3array.tmpTicks.forEach(function(ct) { 

				if ( ct == momentTmpTick ) newTick = false; 

			})

			if ( newTick ) {
				d3array.tmpTicks.push(momentTmpTick);
				d3array.ticks.push(momentTick);
			}

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

		// If it's Frano's time series format
		var _m = moment(_key, ["YYYYMMDD", moment.ISO_8601]).format("DD-MM-YYYY");
		if ( _m == 'Invalid date' ) return false;


		return true;

	},					





})