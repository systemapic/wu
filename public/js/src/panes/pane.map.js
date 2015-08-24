Wu.MapPane = Wu.Pane.extend({

	_ : 'mappane',

	options : {
		controls : [
			'description',
			'inspect',
			'layermenu',
			'zoom',
			'legends',
			'measure',
			'geolocation',
			'mouseposition',
			'baselayertoggle',
			'cartocss',
			'draw',
		]
	},
	
	_initialize : function () {
		// connect zindex control
		this._baselayerZIndex = new Wu.ZIndexControl.Baselayers();
		this._layermenuZIndex = new Wu.ZIndexControl.Layermenu();

		// active layers
		this._activeLayers = [];
	},

	_initContainer : function () {
		
		// init container
		this._container = app._mapPane = Wu.DomUtil.createId('div', 'map', app._mapContainer);
	
		// add help pseudo
		Wu.DomUtil.addClass(this._container, 'click-to-start');

		// init map
		this._initLeaflet();

		// init controls
		this._initControls();

		// events
		this._registerEvents();

		// adjust padding, etc.
		this._adjustLayout();
	},

	// refresh view
	_refresh : function () {

		// remove old
		this._flush();

		// set base layers
		this.setBaseLayers();

		// set bounds
		this.setMaxBounds();

		// set position
		this.setPosition();
	},

	_flush : function () {

		// remove layers
		this._flushLayers();

		this._activeLayers = null;
		this._activeLayers = [];
	},

	_flushLayers : function () {
		var map = app._map;
		
		var activeLayers = _.clone(this._activeLayers);

		activeLayers.forEach(function (layer) {
			map.removeLayer(layer.layer);
			layer._flush();
		}, this);
	},

	_initLeaflet : function () {

		// create new map
		var map = this._map = app._map = L.map('map', {
			worldCopyJump : true,
			attributionControl : false,
			//maxZoom : 18,
			// zoomAnimation : false
			zoomControl : false,
			inertia : false,
			// loadingControl : true,
			// zoomAnimationThreshold : 2
		});


		// global map events
		map.on('zoomstart', function (e) {
			console.log('zoomztart', e);

			map.eachLayer(function (layer) {
				if (!layer.options) return;

				var layerUuid = layer.options.layerUuid;

				if (!layerUuid) return;

				// get wu layer
				var l = app.activeProject.getPostGISLayer(layerUuid);
			
				console.log('Laighto-san', l);

				if (!l) return  
				

				console.log('got layer1--1-1');
				l._invalidateTiles();
				
				
			});

			// send invalidate to pile
			this._invalidateTiles();
		}, this)






		// add editable layer
		// this.addEditableLayer(this._map);
	},

	_invalidateTiles : function () {

		var options = {
			access_token : app.tokens.access_token, // unique identifier

		}
	},

	_initControls : function () {
		var controls = this.options.controls;
		this._controls = {};
		_.each(controls, function (control) {
			this._controls[control] = new L.Control[control.camelize()];
		}, this);
	},

	getControls : function () {

		return this._controls;
	},

	_adjustLayout : function () {
		// this.setHeaderPadding();
	},

	_registerEvents : function () {
		app._map.on('moveend', this._onMove, this);
		app._map.on('zoomend', this._onZoom, this);
	},

	_onMove : function () {
		var project = this._project || app.activeProject;
		Wu.Mixin.Events.fire('projectChanged', {detail : {
			projectUuid : project.getUuid()
		}});
	},

	_onZoom : function () {

		var project = this._project || app.activeProject;
		Wu.Mixin.Events.fire('projectChanged', {detail : {
			projectUuid : project.getUuid()
		}});
	},

	// fired on window resize
	resizeEvent : function (d) {

		this._updateWidth(d);
	},
    
	_updateWidth : function (d) {
		var map = this._map;
		if (!map || !d) return;
		
		// set width
		map._container.style.width = d.width - parseInt(map._container.offsetLeft) + 'px';
		
		// refresh map size
		setTimeout(function() {
			if (map) map.reframe();
		}, 300); // time with css
	},
	
	getZIndexControls : function () {
		var z = {
			b : this._baselayerZIndex, // base
			l : this._layermenuZIndex  // layermenu
		}
		return z;
	},

	clearBaseLayers : function () {
		if (!this.baseLayers) return;
		
		this.baseLayers.forEach(function (base) {
			app._map.removeLayer(base.layer);
		});

		this.baseLayers = {};
	},

	setBaseLayers : function () { 

		// get baseLayers stored in project
		var baseLayers = this._project.getBaselayers();

		// return if empty
		if (!baseLayers) return;

		// add
		baseLayers.forEach(function (layer) {
			this.addBaseLayer(layer);
		}, this);
	},

	addBaseLayer : function (baseLayer) {
		// Wu.Layer
		var layer = this._project.layers[baseLayer.uuid];
		if (layer) layer.add('baselayer');
	},

	removeBaseLayer : function (layer) {

		map.removeLayer(base.layer);
	},

	_setLeft : function (width) {  
		this._container.style.left = width + 'px';
		this._container.style.width = parseInt(window.innerWidth) - width + 'px';
	},

	setHeaderPadding : function () {
		// set padding
		var map = this._map;
		var control = map._controlContainer;
		control.style.paddingTop = this._project.getHeaderHeight() + 'px';
	},

	setPosition : function (position) {
		var map = this._map;
		
		// get position
		var pos = position || this._project.getLatLngZoom();
		var lat = pos.lat;
		var lng = pos.lng;
		var zoom = pos.zoom;

		// set map options
		if (lat != undefined && lng != undefined && zoom != undefined) {
			map.setView([lat, lng], zoom);
		}
	},

	getPosition : function () {
		// get current lat/lng/zoom
		var center = this._map.getCenter();
		var position = {
			lat : center.lat,
			lng : center.lng,
			zoom : this._map.getZoom()
		}
		return position;
	},

	getActiveLayermenuLayers : function () {
		if (!this.layerMenu) return;

		var zIndexControl = app.zIndex;

		var layers = this.layerMenu.getLayers();
		var active = _.filter(layers, function (l) {
			return l.on;
		});

		var sorted = _.sortBy(active, function (l) {
			return zIndexControl.get(l.layer);
		});

		return sorted;
	},

	getActiveLayers : function () {

		return this._activeLayers;
	},

	addActiveLayer : function (layer) {

		this._activeLayers.push(layer);
	},

	clearActiveLayers : function () {

		this._activeLayers = [];
	},

	removeActiveLayer : function (layer) {
		_.remove(this._activeLayers, function (l) {
			return l.getUuid() == layer.getUuid();
		}, this);
	},

	setMaxBounds : function () {
		var map = app._map;
		var bounds = this._project.getBounds();

		if (!bounds) return;

		var southWest = L.latLng(bounds.southWest.lat, bounds.southWest.lng);
   		var northEast = L.latLng(bounds.northEast.lat, bounds.northEast.lng);
    		var maxBounds = L.latLngBounds(southWest, northEast);

    		// set maxBoudns
		map.setMaxBounds(maxBounds);
		map.options.minZoom = bounds.minZoom;
		map.options.maxZoom = bounds.maxZoom;
	},
	
	addEditableLayer : function (map) {
		// create layer
		this.editableLayers = new L.FeatureGroup();
		map.addLayer(this.editableLayers);
	},

	updateControlCss : function () {

		// get controls
		var controls = this._project.getControls(),
		    legendsControl = controls.legends,
		    corners = app._map._controlCorners,
		    topleft = corners.topleft,
		    bottomright = corners.bottomright,
		    topright = corners.topright;


		// layermenu control
		if (controls.layermenu) {
			
			// Check for Layer Inspector
			if (controls.inspect) {
				Wu.DomUtil.removeClass(bottomright, 'no-inspector');
			} else {
				Wu.DomUtil.addClass(bottomright, 'no-inspector');
			}
		}

		// legend control
		if (controls.legends) {
			
			// get container
			var legendsContainer = controls.legends._legendsContainer;

			// Check for Layer Menu Control
			if (controls.layermenu) {
				if (legendsContainer) Wu.DomUtil.removeClass(legendsContainer, 'legends-padding-right');
			} else {
				if (legendsContainer) Wu.DomUtil.addClass(legendsContainer, 'legends-padding-right');
			}

			// Check for Description Control
			if (controls.description) {} 

		}

		// scale control
		if (controls.measure) {
			if (controls.layermenu) {
				topright.style.right = '295px';
			} else {
				topright.style.right = '6px';
			}
		}


		// todo?
		if (controls.mouseposition) {}
		if (controls.vectorstyle) {}
		if (controls.zoom) {}
		if (controls.baselayertoggle) {}
		if (controls.description) {} 
		if (controls.draw) {}
		if (controls.geolocation) {}
		if (controls.inspect) {}
	},

	resetControls : function () {

		// remove carto
		if (this.cartoCss) this.cartoCss.destroy();

		this.cartoCss 			= null;
		this._drawControl 		= null;
		this._drawControlLayer 		= null;
		this._scale 			= null;
		this.vectorStyle 		= null;
		this.layerMenu 			= null;
		this.legendsControl 		= null;
		this.descriptionControl 	= null;
		this.inspectControl 		= null;
		this.mousepositionControl 	= null;
		this.baselayerToggle 		= null;
		this.geolocationControl 	= null;

		// remove old controls
		delete this._drawControl;
		delete this._drawControlLayer;
		delete this._scale;
		delete this.vectorStyle;                // TODO, refactor
		delete this.layerMenu;
		delete this.legendsControl;
		delete this.descriptionControl;
		delete this.inspectControl;
		delete this.mousepositionControl;
		delete this.baselayerToggle;
		delete this.geolocationControl;
		delete this.cartoCss;
	},

	refreshControls : function () {
	},

	hideControls : function () {

		Wu.DomUtil.addClass(app._map._controlContainer, 'displayNone');
	},

	showControls : function () {

		Wu.DomUtil.removeClass(app._map._controlContainer, 'displayNone');
	},

	addLayer : function (layerID) {
		var layer = L.mapbox.tileLayer(layerID);
		layer.addTo(this._map);
	},

	_addLayer : function (layer) {

		layer.addto(this._map);
	},

	disableInteraction : function (noDrag) {
		var map = this._map || app._map;
		if (noDrag) map.dragging.disable();
		map.touchZoom.disable();
		map.doubleClickZoom.disable();
		map.scrollWheelZoom.disable();
		map.boxZoom.disable();
		map.keyboard.disable();
	},

	enableInteraction : function (noDrag) {
		var map = this._map || app._map;
		if (noDrag) map.dragging.enable();
		map.touchZoom.enable();
		map.doubleClickZoom.enable();
		map.scrollWheelZoom.enable();
		map.boxZoom.enable();
		map.keyboard.enable();
	},

	disableZoom : function () {
		this._map.touchZoom.disable();
		this._map.doubleClickZoom.disable();
		this._map.scrollWheelZoom.disable();
		this._map.boxZoom.disable();
		this._map.keyboard.disable();
		document.getElementsByClassName('leaflet-control-zoom')[0].style.display = 'none';
	}, 

	enableZoom : function () {
		this._map.touchZoom.enable();
		this._map.doubleClickZoom.enable();
		this._map.scrollWheelZoom.enable();
		this._map.boxZoom.enable();
		this._map.keyboard.enable();
		document.getElementsByClassName('leaflet-control-zoom')[0].style.display = 'block';
	},

	enableLegends : function () {
		if (this.legendsControl) return;

		// create control
		this.legendsControl = L.control.legends({
			position : 'bottomleft'
		});

		// add to map
		this.legendsControl.addTo(this._map);

		// update control with project
		this.legendsControl.update();
	},

	disableLegends : function () {
		if (!this.legendsControl) return;
	       
		// remove and delete control
		this._map.removeControl(this.legendsControl);
		this.legendsControl = null;
		delete this.legendsControl;
	},

	enableMouseposition : function () {
		if (this.mousepositionControl) return;

		// create control
		this.mousepositionControl = L.control.mouseposition({ position : 'topright' });

		// add to map
		this.mousepositionControl.addTo(this._map);
	},

	disableMouseposition : function () {
		if (!this.mousepositionControl) return;
	       	
		// remove and delete control
		this._map.removeControl(this.mousepositionControl);
		this.mousepositionControl = null;
		delete this.mousepositionControl;
	},

	enableGeolocation : function () {
		if (this.geolocationControl) return;

		// create controls 
		this.geolocationControl = new L.Control.Search({
			url : 'https://nominatim.openstreetmap.org/search?format=json&q={s}',
			jsonpParam : 'json_callback',
			propertyName : 'display_name',
			propertyLoc : ['lat','lon'],	
			boundingBox : 'boundingbox',

			// custom filter
			filterJSON : function (json) {
				var jsonret = [], i;
				for (i in json) {
					var item = json[i];
					if (item.hasOwnProperty('type')) {
						var adr = {
							address : item.display_name,
							boundingbox : item.boundingbox,
							latlng : L.latLng(item.lat, item.lon),
							type : item.type
						}
					}

					// push
					jsonret.push(adr);
				}
				
				var all = _.unique(jsonret, function (j) {
					if (j) return j.address;
				});

				return all;
			}
		});

		// add to map
		this.geolocationControl.addTo(this._map);
	},

	disableGeolocation : function () {
		if (!this.geolocationControl) return;
	       	
		// remove and delete control
		this._map.removeControl(this.geolocationControl);
		this.geolocationControl = null;
		delete this.geolocationControl;
	},

	enableMeasure : function () {
		if (this._scale) return;

		this._scale = L.control.measure({'position' : 'topright'});
		this._scale.addTo(this._map);
	},

	disableMeasure : function () {
		if (!this._scale) return;

		this._map.removeControl(this._scale);
		this._scale = null;
		delete this._scale;
	},

	enableDescription : function () {
		if (this.descriptionControl) return;

		// create control
		this.descriptionControl = L.control.description({
			position : 'topleft'
		});

		// add to map
		this.descriptionControl.addTo(this._map);

		// update control with project
		this.descriptionControl.update();
	},

	disableDescription : function () {
		if (!this.descriptionControl) return;
	       
		// remove and delete control
		this._map.removeControl(this.descriptionControl);
		this.descriptionControl = null;
		delete this.descriptionControl;
	},

	enableInspect : function () {
		if (this.inspectControl) return;

		// create control
		this.inspectControl = L.control.inspect({
			position : 'bottomright'
		});

		// add to map
		this.inspectControl.addTo(this._map);

		// update control with project
		this.inspectControl.update();
	},

	disableInspect : function () {
		if (!this.inspectControl) return;
	       
		// remove and delete control
		this._map.removeControl(this.inspectControl);
		this.inspectControl = null;
		delete this.inspectControl;
	},

	enableCartocss : function () {
		if (this.cartoCss) return;

		// dont allow for non-editors
		if (!app.access.to.edit_project(this._project)) return;

		// create control
		this.cartoCss = L.control.cartoCss({
			position : 'topleft'
		});

		// add to map
		this.cartoCss.addTo(this._map);

		// update with latest
		if (app.activeProject) this.cartoCss.update();

		return this.cartoCss;
	},

	disableCartocss : function () {
		if (!this.cartoCss) return;

		this._map.removeControl(this.cartoCss);
		this.cartoCss = null;
		delete this.cartoCss;
	},

	enableLayermenu : function () {      
		if (this.layerMenu) return;

		// add control
		this.layerMenu = L.control.layermenu({
			position : 'bottomright'
		});

		// add to map
		this.layerMenu.addTo(this._map);
		
		// update control (to fill layermenu from project)
		this.layerMenu.update();

		return this.layerMenu;
	},

	disableLayermenu : function () {
		if (!this.layerMenu) return;
	       
		// remove and delete control
		this._map.removeControl(this.layerMenu);
		this.layerMenu = null;
		delete this.layerMenu;
	},

	enableBaselayertoggle : function () {
		if (this.baselayerToggle) return;

		// create control
		this.baselayerToggle = L.control.baselayerToggle();

		// add to map
		this.baselayerToggle.addTo(this._map);

		// update
		this.baselayerToggle.update();

		return this.baselayerToggle;
	},

	disableBaselayertoggle : function () {
		if (!this.baselayerToggle) return

		this._map.removeControl(this.baselayerToggle);
		this.baselayerToggle = null;
		delete this.baselayerToggle;
	},
	
	enableVectorstyle : function (container) {
		// if (this.vectorStyle) return;
		
		// this.vectorStyle = L.control.styleEditor({ 
		// 	position: "topleft", 
		// 	container : container
		// });
		
		// this._map.addControl(this.vectorStyle);
	},

	disableVectorstyle : function () {
		// if (!this.vectorStyle) return;

		// // remove vectorstyle control
		// this._map.removeControl(this.vectorStyle);             // todo: doesnt clean up after itself!
		// delete this.vectorStyle;   
	},

	getEditableLayerParent : function (id) {
		// return id from _leaflet_id
		var layers = this.editableLayers._layers;
		for (l in layers) {
			for (m in layers[l]._layers) {
				if (m == id) return layers[l];
				var deep = layers[l]._layers[m];
				for (n in deep) {
					var shit = deep[n];
					if (n == id) return deep;
					for (o in shit) {
						if (o == id) return shit;
					}
				}
			}
		}
		return false;
	},

	_addPopupContent : function (e) {

		
		var d3popup = this._project.getSettings()['d3popup'];
		var d3popup = true;

		// var content = d3popup ? this._createPopupContentD3(e) : this._createPopupContent(e);
		var content = d3popup ? this._createPopupContentC3(e) : this._createPopupContent(e);

		// var buffer = '<hr>';
		var buffer = '';

		// clear old popup
		this._popup = null;

		// return if no content
		if (!content) return;
		
		if (!this._popupContent) {
			// create empty
			this._popupContent = '';
		} else {
			// append buffer
			this._popupContent += buffer;
		}

		// append content
		this._popupContent += content;

		this.openPopup(e);

	},

	_clearPopup : function () {
		this._popupContent = '';
		this._popup = null;
	},
	
	openPopup : function (e) {
		if (this._popup) return;

		var popup = this._createPopup(),
		    content = this._popupContent,
		    map = app._map,
		    latlng = e.latlng;

		// return if no content
		if (!content) return this._clearPopup();
		
		// set popup close event
		this._addPopupCloseEvent();

		// keep popup while open
		this._popup = popup;

		// set content
		popup.setContent(content);
		popup.setLatLng(latlng);
		
		setTimeout(function () {
			popup.openOn(map);		// todo: still some minor bugs,
		}, 100); // hack			// this hack perhaps due to double opening
	},

	_createPopup : function () {

		// create popup
		var popup = L.popup({
			offset : [18, 0],
			closeButton : true,
			zoomAnimation : false,
			maxWidth : 400,
			minWidth : 200,
			maxHeight : 350,
			// closeOnClick : false
		});
		return popup;
	},

	_addPopupCloseEvent : function () {
		if (this._popInit) return;
		this._popInit = true;	// only run once

		var map = app._map;
		map.on('popupclose',  this._clearPopup, this);
	},



	// *********************************************
	// * POP-UP POP-UP POP-UP POP-UP POP-UP POP-UP *
	// * POP-UP POP-UP POP-UP POP-UP POP-UP POP-UP *
	// * POP-UP POP-UP POP-UP POP-UP POP-UP POP-UP *
	// *********************************************	

	_createPopupContentC3 : function (e) {

		// var _retHTML = this.multiPopUp();
		var _retHTML = this.singlePopUp(e);

		return _retHTML;

	},


	// CHART HELPER – BUILD ARRAY (Only for single now, but should make universal)
	// CHART HELPER – BUILD ARRAY (Only for single now, but should make universal)
	// CHART HELPER – BUILD ARRAY (Only for single now, but should make universal)

	c3StackArray : function (_key, _val, d3array) {

		// Not the best date validation, but...
		if ( _key.length == 8 ) {

			// Create Legible Date Value        
			var yy = _key.substring(0, 4);
			var mm = _key.substring(4, 6);
			var dd = _key.substring(6, 10);
			var _date = yy + '-' + mm + '-' + dd;

			// DATE
			d3array.x.push(_date);

			// VALUE
			d3array.y.push(_val);

			// TICKS					
			var chartTick   = yy + '-' + mm + '-00';
			var newTick     = true;
			d3array.ticks.forEach(function(ct) { if ( ct == chartTick ) newTick = false; })
			if ( newTick ) d3array.ticks.push(chartTick);

		} else {

			d3array.meta.push([_key, _val])

		}
		
	},






	// ************************************
	// * MULTI DATA MULTI DATA MULTI DATA *
	// * MULTI DATA MULTI DATA MULTI DATA *
	// * MULTI DATA MULTI DATA MULTI DATA *
	// ************************************

	// INIT Multi Data Pop-UP 
	// INIT Multi Data Pop-UP 
	// INIT Multi Data Pop-UP 

	multiPopUp : function () {

		var data      = this.megadata;

		var drawData  = this.cleanupMultiData(data);
		var drawChart = this.initC3multiChart(drawData);

		return drawChart;		

	},



	// Clean up multi pop-up data
	// Clean up multi pop-up data
	// Clean up multi pop-up data

	cleanupMultiData : function (data) {

		var average = data.average;
		var all     = data.all;

		var c3obj   = {
			
			// All the X'es
			x 	: [],

			// Average Y
			avgY 	: ['avgY'],

			// These are static... 
			ticks 	: []

		}
		
		// ****************************
		// Store AVERAGE data object...
		// ****************************

		var avgX = ['avgX'];

		for (var key in average) {
			if ( key.length == 8 ) { // NOT very good, but use this to pick up time series ...
				c3obj.avgY.push(key);
				avgX.push(average[key]);
			}
		}

		c3obj.x.push(avgX);


		// ************************
		// Store ALL data object...
		// ************************

		// Each in ALL
		all.forEach(function(dt, i) {

			// Define column name
			var column_name = 'data' + i;
			// Start each column with a name
			var column      = [column_name];

			// Each FIELD in each ITEM in ALL
			for (var key in dt) {

				// Go through the AVERAGE (master) KEYS
				c3obj.avgY.forEach(function(avY) {

					// Only proceed if it's a match
					// – I use this to only get the numbers in the time series
					if ( avY == key ) {
			
						var _key = key;
						var _val = dt[key];

						column.push(_val);
					}
				})
			}

			c3obj.x.push(column);

		})

		return c3obj;
	},




	// Create MULTI CHART
	// Create MULTI CHART
	// Create MULTI CHART

	initC3multiChart : function (data) {

		var _C3Container = Wu.DomUtil.createId('div', 'c3-container');
		var revArr = data.x.reverse();

		var chart = c3.generate({
		        
		        bindto: _C3Container,
		        
			size: {
				height: 300,
				width: 540
			},

			point : {
				r: 2.5
			},

			grid: { y: { show: true },
				x: { show: true }
			},

			legend: {
				show: false
			},		

		        data: {

		                columns: revArr,

		                type: 'scatter',
		                types: {
		                	avgX : 'spline'
		                },

			        color: function (color, d) {
			        	if ( d.id == 'avgX' ) return '#FFFFFF';
			        	return '#6666FF' 
			        },

		        },


		        // axis: {
		        //         x: {
		        //                 type: 'timeseries',
		        //                 localtime: false,
		        //                 tick: {
		        //                         format: '%Y-%m',
		        //                         values: t,
		        //                         rotate: 75,
		        //                         multiline: false                                        
		        //                 }
		        //         }
		        // },

		});

		var _chartObject2HTML = new XMLSerializer().serializeToString(_C3Container);
		return _chartObject2HTML;

	},







	// ***************************************
	// * SINGLE DATA SINGLE DATA SINGLE DATA *
	// * SINGLE DATA SINGLE DATA SINGLE DATA *
	// * SINGLE DATA SINGLE DATA SINGLE DATA *
	// ***************************************


	singlePopUp : function (e) {

		// check for stored tooltip
		var data = e.data,
		    layer = e.layer,
		    meta = layer.getTooltip(),
		    string = '',		    
		    d3array = {	
		    		
		    		meta 	: [],
		    		x 	: ['field_x'], 
		    		y 	: ['field_y'],
		    		ticks 	: []
		    	};

		// already stored tooltip (edited, etc.)
		if (meta) {


			// add meta to tooltip
			for (var m in meta.fields) {

				var field = meta.fields[m];

				// only add active tooltips
				if (field.on) {

					// get key/value
					var _val = parseFloat(data[field.key]);
					var _key = field.title || field.key;

					this.c3StackArray(_key, _val, d3array);	

					
				}
			}

		// first time use of meta.. (or something)
		} else {

			for (var key in data) {

				var _val   = parseFloat(data[key]);				
				var _key = key;

				this.c3StackArray(_key, _val, d3array);



			}

		}

		// Create frickin chart...
		var _HTML = this.initC3Chart(d3array);
		var _header = this.initC3Header(d3array.meta);
		return _header + _HTML;		

	},




	// CREATE SINGLE DATA CHART
	// CREATE SINGLE DATA CHART
	// CREATE SINGLE DATA CHART

	// HEADER
	initC3Header : function (headerMeta) {

		var metaStr = '<div id="c3-header-metacontainer">';

		headerMeta.forEach(function(meta) {

			if ( !meta[1] ) return;
			
			metaStr += '<div class="c3-header-metapair">';
			metaStr += '<div class="c3-header-metakey">' + meta[0] + '</div>';
			metaStr += '<div class="c3-header-metaval">' + meta[1] + '</div>';
			metaStr += '</div>';

		});

		metaStr += '</div>';

		return metaStr;

	},


	// CHART
	initC3Chart : function (data) {

		var x = data.x;
		var y = data.y;
		var t = data.ticks;
		_columns = [x, y];

		var _C3Container = Wu.DomUtil.createId('div', 'c3-container');	

		var chart = c3.generate({
		        
		        bindto: _C3Container,
		        

			size: {
				height: 300,
				width: 540
			},

			point : {
				r: 3.5
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
		                type: 'spline'


		        },

		        axis: {
		                x: {
		                        type: 'timeseries',
		                        localtime: false,
		                        tick: {
		                                format: '%Y-%m',
		                                values: t,
		                                rotate: 75,
		                                multiline: false                                        
		                        }
		                }
		        },

			color: {
				pattern: ['#FFFFFF']
			}		        
		});



		var _chartObject2HTML = new XMLSerializer().serializeToString(_C3Container);
		return _chartObject2HTML;

	},





	// ****************************************************************************************************************
	// ****************************************************************************************************************
	// ****************************************************************************************************************		



	// "Normal" pop-up
	// "Normal" pop-up
	// "Normal" pop-up		

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

					// // add to d3 array
					// var d3obj = {};
					// d3obj[caption] = value;
					// d3array.push(d3obj);
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


	megadata : {"all":[{"20140408":0,"20140419":-7.833923,"20140430":22.108961,"20140511":-13.905063,"20140522":-8.140926,"20140602":-18.182229,"20140613":-18.136716,"20140624":-18.194441,"20140705":-15.531931,"20140716":-15.096017,"20140727":-18.679049,"20140818":-21.46545,"20140829":-21.27677,"20140909":-22.579486,"20140920":-21.523323,"20141001":-18.397619,"20141012":-17.357042,"20141103":-19.968198,"20141114":-15.423186,"gid":281326,"code":"281325","east":283298.722443,"north":4202077.861803,"range":"1467","azimuth":"378","vel":0.895522,"coherence":0.450287,"height":1550.417803,"demerr":12.451946},{"20140408":0,"20140419":-5.878865,"20140430":-13.678151,"20140511":-10.057959,"20140522":-8.487,"20140602":-15.071472,"20140613":3.308295,"20140624":-16.069964,"20140705":-14.581042,"20140716":-14.950254,"20140727":-16.441957,"20140818":-17.017288,"20140829":-17.281938,"20140909":-14.195936,"20140920":-14.039976,"20141001":-11.270546,"20141012":-11.490811,"20141103":-11.503211,"20141114":-10.760667,"gid":282403,"code":"282402","east":283267.499737,"north":4202084.316376,"range":"1463","azimuth":"379","vel":13.623048,"coherence":0.484319,"height":1564.742165,"demerr":0.434937},{"20140408":0,"20140419":-3.844656,"20140430":25.97951,"20140511":-5.637225,"20140522":-9.092555,"20140602":-10.399552,"20140613":6.737975,"20140624":-12.402404,"20140705":-12.579,"20140716":-14.055458,"20140727":-12.541233,"20140818":-10.350936,"20140829":-11.372301,"20140909":-9.147731,"20140920":-10.978945,"20141001":-8.572776,"20141012":-10.063906,"20141103":-7.140516,"20141114":-11.034447,"gid":282404,"code":"282403","east":283276.120775,"north":4202085.344717,"range":"1464","azimuth":"379","vel":4.047968,"coherence":0.465908,"height":1562.641956,"demerr":-15.485804},{"20140408":0,"20140419":-4.275843,"20140430":25.391624,"20140511":-6.584308,"20140522":-8.870765,"20140602":-11.124692,"20140613":-13.193013,"20140624":-12.794744,"20140705":-12.664435,"20140716":-13.927646,"20140727":-12.984596,"20140818":-11.458157,"20140829":-12.338603,"20140909":-10.146849,"20140920":-11.72927,"20141001":-9.313467,"20141012":-10.447551,"20141103":-8.183495,"20141114":-11.092023,"gid":282405,"code":"282404","east":283284.385404,"north":4202086.331499,"range":"1465","azimuth":"379","vel":9.859781,"coherence":0.426117,"height":1560.06934,"demerr":-12.397917},{"20140408":0,"20140419":-4.272329,"20140430":25.216566,"20140511":-6.411998,"20140522":-8.724974,"20140602":-10.71925,"20140613":-12.717602,"20140624":-12.307938,"20140705":-12.319041,"20140716":-13.526937,"20140727":-12.518993,"20140818":-11.035904,"20140829":-12.037295,"20140909":-9.844435,"20140920":-11.477677,"20141001":-9.027249,"20141012":-10.208023,"20141103":-7.74717,"20141114":-10.726095,"gid":282406,"code":"282405","east":283292.467277,"north":4202087.296969,"range":"1466","azimuth":"379","vel":10.294362,"coherence":0.438426,"height":1557.254488,"demerr":-12.844948},{"20140408":0,"20140419":-6.520504,"20140430":-14.637453,"20140511":-11.219539,"20140522":-8.395901,"20140602":-12.424539,"20140613":-13.094146,"20140624":-12.982456,"20140705":-20.266061,"20140716":-20.438914,"20140727":-22.306232,"20140818":-23.547408,"20140829":-23.808347,"20140909":-25.541335,"20140920":-25.253724,"20141001":-22.39579,"20141012":-22.144007,"20141103":-22.640206,"20141114":-20.900486,"gid":282407,"code":"282406","east":283300.463304,"north":4202088.25243,"range":"1467","azimuth":"379","vel":-15.758092,"coherence":0.471913,"height":1554.325859,"demerr":2.884373},{"20140408":0,"20140419":32.17952,"20140430":23.873907,"20140511":28.980148,"20140522":29.171611,"20140602":27.390684,"20140613":26.140037,"20140624":26.497443,"20140705":18.367263,"20140716":17.678494,"20140727":17.373896,"20140818":17.518271,"20140829":16.882375,"20140909":14.832947,"20140920":14.20113,"20141001":16.905305,"20141012":16.519042,"20141103":17.525222,"20141114":16.877735,"gid":282408,"code":"282407","east":283308.359116,"north":4202089.196204,"range":"1468","azimuth":"379","vel":-16.415364,"coherence":0.504509,"height":1551.264399,"demerr":-5.159159},{"20140408":0,"20140419":-6.802488,"20140430":-14.731778,"20140511":-10.978087,"20140522":-8.26215,"20140602":-12.763751,"20140613":-13.388894,"20140624":-13.121976,"20140705":-20.310714,"20140716":-20.475467,"20140727":-22.263679,"20140818":-23.519892,"20140829":-23.68769,"20140909":-25.410664,"20140920":-25.070007,"20141001":-22.243702,"20141012":-21.911259,"20141103":-22.420111,"20141114":-20.793648,"gid":282409,"code":"282408","east":283316.120661,"north":4202090.124321,"range":"1469","azimuth":"379","vel":-14.532101,"coherence":0.508374,"height":1548.024967,"demerr":2.718687},{"20140408":0,"20140419":-6.252832,"20140430":-14.188781,"20140511":-9.287203,"20140522":-8.287412,"20140602":-11.094363,"20140613":-12.025201,"20140624":-11.585208,"20140705":-19.190888,"20140716":-19.650399,"20140727":-20.604823,"20140818":-20.898017,"20140829":-21.275211,"20140909":-18.431693,"20140920":-18.747362,"20141001":-16.0403,"20141012":-16.197791,"20141103":-15.739397,"20141114":-15.733838,"gid":282410,"code":"282409","east":283323.828498,"north":4202091.046176,"range":"1470","azimuth":"379","vel":-11.247085,"coherence":0.496746,"height":1544.714349,"demerr":-2.289878},{"20140408":0,"20140419":-5.606571,"20140430":-14.241836,"20140511":-10.946824,"20140522":-9.257009,"20140602":-16.192889,"20140613":-21.750427,"20140624":-21.788157,"20140705":-20.129514,"20140716":-20.597849,"20140727":-22.139332,"20140818":-22.254546,"20140829":-22.682694,"20140909":-19.574152,"20140920":-19.369519,"20141001":-16.51751,"20141012":-16.989189,"20141103":-17.884114,"20141114":-17.502173,"gid":283485,"code":"283484","east":283239.605877,"north":4202091.182179,"range":"1460","azimuth":"380","vel":1.588132,"coherence":0.475069,"height":1569.951589,"demerr":0.965646},{"20140408":0,"20140419":-5.894389,"20140430":-14.401037,"20140511":-11.569972,"20140522":-8.941005,"20140602":-16.653413,"20140613":-17.592994,"20140624":-17.620409,"20140705":-15.814482,"20140716":-16.063046,"20140727":-18.040439,"20140818":-18.854391,"20140829":-19.071147,"20140909":-15.887714,"20140920":-15.15878,"20141001":-12.393586,"20141012":-12.533544,"20141103":-13.52757,"20141114":-12.196316,"gid":283486,"code":"283485","east":283250.772182,"north":4202092.507316,"range":"1461","azimuth":"380","vel":12.735177,"coherence":0.442578,"height":1571.225011,"demerr":3.052429},{"20140408":0,"20140419":-6.082185,"20140430":-14.559517,"20140511":-12.084364,"20140522":-9.079752,"20140602":-13.271662,"20140613":-13.852894,"20140624":-13.848682,"20140705":-12.047583,"20140716":-12.067804,"20140727":-14.375137,"20140818":-15.595183,"20140829":-15.732297,"20140909":-12.481563,"20140920":-11.560216,"20141001":-8.968217,"20141012":-8.813607,"20141103":-9.523711,"20141114":-7.689178,"gid":283487,"code":"283486","east":283260.085556,"north":4202093.616386,"range":"1462","azimuth":"380","vel":23.111374,"coherence":0.462357,"height":1570.042471,"demerr":4.123026},{"20140408":0,"20140419":-5.744182,"20140430":-14.524913,"20140511":-11.463787,"20140522":-9.580285,"20140602":-12.572792,"20140613":5.968583,"20140624":-13.450348,"20140705":-11.957273,"20140716":-12.167159,"20140727":-13.901856,"20140818":-14.693803,"20140829":-14.916054,"20140909":-11.885188,"20140920":-11.402377,"20141001":-8.883352,"20141012":-8.918882,"20141103":-8.763245,"20141114":-7.80585,"gid":283488,"code":"283487","east":283268.753699,"north":4202094.650218,"range":"1463","azimuth":"380","vel":17.294813,"coherence":0.460169,"height":1568.004708,"demerr":0.804831},{"20140408":0,"20140419":-5.822236,"20140430":-14.49971,"20140511":-11.236967,"20140522":-9.343567,"20140602":-16.061859,"20140613":2.514649,"20140624":-17.207215,"20140705":-15.601067,"20140716":-15.976333,"20140727":-17.592857,"20140818":-18.424973,"20140829":-18.573047,"20140909":-15.695667,"20140920":-15.273615,"20141001":-12.761238,"20141012":-12.744105,"20141103":-12.468055,"20141114":-11.539401,"gid":283489,"code":"283488","east":283277.403346,"north":4202095.681893,"range":"1464","azimuth":"380","vel":12.58215,"coherence":0.400371,"height":1565.94246,"demerr":0.480719},{"20140408":0,"20140419":-5.925046,"20140430":24.090819,"20140511":-14.18554,"20140522":-11.954701,"20140602":-18.856306,"20140613":-20.185452,"20140624":-20.070177,"20140705":-18.374428,"20140716":-18.773563,"20140727":-20.499831,"20140818":-21.58338,"20140829":-21.692702,"20140909":-18.940395,"20140920":-18.470766,"20141001":-15.937363,"20141012":-15.864517,"20141103":-15.653381,"20141114":-14.468967,"gid":283490,"code":"283489","east":283285.755936,"north":4202096.678928,"range":"1465","azimuth":"380","vel":2.710178,"coherence":0.374945,"height":1563.486475,"demerr":1.063969},{"20140408":0,"20140419":-3.265986,"20140430":26.002032,"20140511":-4.682375,"20140522":-8.96295,"20140602":-9.149128,"20140613":-11.87018,"20140624":-11.417452,"20140705":-21.067976,"20140716":-22.773559,"20140727":-20.675608,"20140818":-18.238408,"20140829":-19.454358,"20140909":-17.618798,"20140920":-19.591924,"20141001":-17.382416,"20141012":-19.124209,"20141103":-15.085114,"20141114":-19.810973,"gid":283491,"code":"283490","east":283293.938084,"north":4202097.656089,"range":"1466","azimuth":"380","vel":-16.719591,"coherence":0.4478,"height":1560.804577,"demerr":-19.269382},{"20140408":0,"20140419":-3.736523,"20140430":25.467712,"20140511":32.772654,"20140522":29.224298,"20140602":31.550609,"20140613":29.150778,"20140624":29.633262,"20140705":20.346206,"20140716":18.761562,"20140727":20.575524,"20140818":22.729833,"20140829":21.557316,"20140909":23.652296,"20140920":21.919959,"20141001":24.300636,"20141012":22.768164,"20141103":26.255683,"20141114":22.170263,"gid":283492,"code":"283491","east":283302.083833,"north":4202098.629005,"range":"1467","azimuth":"380","vel":8.491738,"coherence":0.529742,"height":1558.074449,"demerr":-17.077537},{"20140408":0,"20140419":-4.79842,"20140430":24.499548,"20140511":-7.190608,"20140522":-8.655735,"20140602":-8.635492,"20140613":-10.485961,"20140624":-9.967876,"20140705":-18.457904,"20140716":-19.611217,"20140727":-18.927113,"20140818":-17.880705,"20140829":-18.73551,"20140909":-21.033097,"20140920":-22.041814,"20141001":-19.495072,"20141012":-20.424619,"20141103":-18.307988,"20141114":-20.544154,"gid":283493,"code":"283492","east":283310.116615,"north":4202099.588749,"range":"1468","azimuth":"380","vel":-23.449068,"coherence":0.566203,"height":1555.194589,"demerr":-10.570512},{"20140408":0,"20140419":-5.049589,"20140430":24.225304,"20140511":-7.270561,"20140522":-8.554372,"20140602":-8.860987,"20140613":-10.666964,"20140624":-10.013748,"20140705":-18.37997,"20140716":-19.446429,"20140727":-18.926576,"20140818":-17.972897,"20140829":-18.736086,"20140909":-21.027055,"20140920":-22.015197,"20141001":-19.512531,"20141012":-20.358363,"20141103":-18.505296,"20141114":-20.627384,"gid":283494,"code":"283493","east":283317.99905,"north":4202100.53096,"range":"1469","azimuth":"380","vel":-22.969238,"coherence":0.550022,"height":1552.11544,"demerr":-9.878128},{"20140408":0,"20140419":-6.198427,"20140430":-14.406644,"20140511":-9.410751,"20140522":-8.319584,"20140602":-11.067907,"20140613":-12.158395,"20140624":-11.576804,"20140705":-19.060013,"20140716":-19.583712,"20140727":-20.617882,"20140818":-20.922855,"20140829":-21.254923,"20140909":-18.36852,"20140920":-18.579357,"20141001":-15.935874,"20141012":-16.149272,"20141103":-15.821697,"20141114":-15.887111,"gid":283495,"code":"283494","east":283325.7633,"north":4202101.459391,"range":"1470","azimuth":"380","vel":-10.686266,"coherence":0.527712,"height":1548.879635,"demerr":-2.326737},{"20140408":0,"20140419":-6.445099,"20140430":-14.651872,"20140511":-9.712579,"20140522":-8.328501,"20140602":-11.343351,"20140613":-12.130889,"20140624":-11.519749,"20140705":-18.821456,"20140716":-19.336646,"20140727":-20.615105,"20140818":-20.966518,"20140829":-21.259251,"20140909":-18.357627,"20140920":-18.579303,"20141001":-15.867182,"20141012":-16.091327,"20141103":-15.926672,"20141114":-16.071147,"gid":283496,"code":"283495","east":283333.317642,"north":4202102.363344,"range":"1471","azimuth":"380","vel":-9.84719,"coherence":0.541615,"height":1545.365575,"demerr":-1.465934},{"20140408":0,"20140419":-6.01332,"20140430":-14.252008,"20140511":-8.649345,"20140522":-8.357774,"20140602":-13.562961,"20140613":-14.504124,"20140624":-13.698505,"20140705":-21.395434,"20140716":-22.216788,"20140727":-22.735782,"20140818":-22.318432,"20140829":-22.828313,"20140909":-20.167453,"20140920":-20.916932,"20141001":-18.188928,"20141012":-18.877229,"20141103":-17.84496,"20141114":-18.988259,"gid":283497,"code":"283496","east":283340.978301,"north":4202103.279695,"range":"1472","azimuth":"380","vel":-10.251773,"coherence":0.544058,"height":1541.99246,"demerr":-5.200902},{"20140408":0,"20140419":-5.732721,"20140430":23.564127,"20140511":-7.738035,"20140522":-8.377948,"20140602":-9.237647,"20140613":-10.371981,"20140624":-9.473414,"20140705":-17.445054,"20140716":-18.529613,"20140727":-18.401177,"20140818":-17.458782,"20140829":-18.157124,"20140909":-20.531157,"20140920":-21.688929,"20141001":-18.958829,"20141012":-20.033236,"20141103":-18.263318,"20141114":-20.333167,"gid":283498,"code":"283497","east":283349.029187,"north":4202104.241549,"range":"1473","azimuth":"380","vel":-15.786031,"coherence":0.546606,"height":1539.13666,"demerr":-7.95903},{"20140408":0,"20140419":-4.438332,"20140430":26.347073,"20140511":-8.644918,"20140522":-9.888642,"20140602":-12.946186,"20140613":-15.056935,"20140624":-14.985119,"20140705":-23.284828,"20140716":-24.253091,"20140727":-24.489453,"20140818":-22.650327,"20140829":-23.630488,"20140909":-20.810535,"20140920":-21.704603,"20141001":-19.992571,"20141012":-20.052691,"20141103":-23.461273,"20141114":-26.089673,"gid":284569,"code":"284568","east":283214.172138,"north":4202098.357925,"range":"1458","azimuth":"381","vel":-21.11739,"coherence":0.374615,"height":1564.895184,"demerr":-7.290023},{"20140408":0,"20140419":-4.573238,"20140430":-13.489239,"20140511":-9.105113,"20140522":-9.766821,"20140602":-13.152611,"20140613":-15.553327,"20140624":-15.514319,"20140705":-23.67969,"20140716":-24.583174,"20140727":-25.081995,"20140818":-23.523449,"20140829":-24.405987,"20140909":-21.638148,"20140920":-22.081898,"20141001":-19.591692,"20141012":-20.287676,"20141103":-21.40949,"20141114":-23.412055,"gid":284570,"code":"284569","east":283225.922292,"north":4202099.751141,"range":"1459","azimuth":"381","vel":-12.684114,"coherence":0.441313,"height":1566.942088,"demerr":-6.23798},{"20140408":0,"20140419":-2.849782,"20140430":26.970235,"20140511":33.752585,"20140522":29.207194,"20140602":29.305953,"20140613":25.830129,"20140624":26.203493,"20140705":16.673197,"20140716":14.893456,"20140727":16.875671,"20140818":20.308362,"20140829":18.875845,"20140909":21.024573,"20140920":19.28206,"20141001":21.587029,"20141012":19.586337,"20141103":22.235164,"20141114":16.853118,"gid":284571,"code":"284570","east":283239.025912,"north":4202101.30218,"range":"1460","azimuth":"381","vel":-1.741503,"coherence":0.464102,"height":1570.783164,"demerr":-19.132767},{"20140408":0,"20140419":-5.633385,"20140430":-14.243436,"20140511":-11.668151,"20140522":-9.229407,"20140602":-16.359777,"20140613":-17.700967,"20140624":-17.690754,"20140705":-15.894135,"20140716":-16.23192,"20140727":-18.125865,"20140818":-18.841643,"20140829":-19.139722,"20140909":-15.992553,"20140920":-15.111328,"20141001":-12.53882,"20141012":-12.572774,"20141103":-13.309428,"20141114":-12.151477,"gid":284572,"code":"284571","east":283250.398747,"north":4202102.651396,"range":"1461","azimuth":"381","vel":12.492219,"coherence":0.455112,"height":1572.330363,"demerr":1.873533},{"20140408":0,"20140419":-5.803541,"20140430":-14.576725,"20140511":-12.306992,"20140522":-9.528364,"20140602":-13.660126,"20140613":-14.449278,"20140624":-14.489706,"20140705":-12.698098,"20140716":-12.844931,"20140727":-15.005355,"20140818":-16.184638,"20140829":-16.416793,"20140909":-13.212371,"20140920":-12.128086,"20141001":-9.710499,"20141012":-9.522775,"20141103":-9.862974,"20141114":-8.178078,"gid":284573,"code":"284572","east":283260.039216,"north":4202103.798605,"range":"1462","azimuth":"381","vel":21.946025,"coherence":0.447468,"height":1571.581415,"demerr":3.021475},{"20140408":0,"20140419":-5.814017,"20140430":-14.946797,"20140511":-12.546828,"20140522":-9.931387,"20140602":-13.8167,"20140613":-17.548913,"20140624":-17.622541,"20140705":-15.935659,"20140716":-16.130149,"20140727":-18.184397,"20140818":-19.507238,"20140829":-19.697157,"20140909":-16.630864,"20140920":-15.563663,"20141001":-13.183549,"20141012":-12.99959,"20141103":-12.954322,"20141114":-11.262278,"gid":284574,"code":"284573","east":283269.087273,"north":4202104.876735,"range":"1463","azimuth":"381","vel":13.063585,"coherence":0.409266,"height":1570.047263,"demerr":2.533648},{"20140408":0,"20140419":-6.163676,"20140430":-15.027835,"20140511":-12.802564,"20140522":-9.451402,"20140602":-13.732847,"20140613":-14.678229,"20140624":-14.667655,"20140705":-12.656637,"20140716":-12.850053,"20140727":-15.182669,"20140818":-16.933264,"20140829":-16.964918,"20140909":-13.969987,"20140920":-12.718234,"20141001":-10.289387,"20141012":-9.97869,"20141103":-10.188486,"20141114":-7.915131,"gid":284575,"code":"284574","east":283278.041849,"north":4202105.943963,"range":"1464","azimuth":"381","vel":22.753746,"coherence":0.382968,"height":1568.389243,"demerr":4.255822},{"20140408":0,"20140419":-6.859955,"20140430":-15.356799,"20140511":-13.791015,"20140522":-8.692456,"20140602":-18.378629,"20140613":-19.085108,"20140624":-19.146454,"20140705":-16.453955,"20140716":-16.435652,"20140727":-19.696784,"20140818":-22.345608,"20140829":-22.100495,"20140909":-23.784851,"20140920":-21.997114,"20141001":-19.400234,"20141012":-18.679643,"20141103":-19.950545,"20141114":-16.141386,"gid":284576,"code":"284575","east":283286.67637,"north":4202106.973871,"range":"1465","azimuth":"381","vel":2.354897,"coherence":0.427638,"height":1566.307006,"demerr":9.260458},{"20140408":0,"20140419":-4.119893,"20140430":25.256091,"20140511":-7.111559,"20140522":-8.78487,"20140602":-11.664339,"20140613":-13.799159,"20140624":-13.51262,"20140705":-22.03506,"20140716":-23.406292,"20140727":-22.733528,"20140818":-21.658226,"20140829":-22.479471,"20140909":-25.108796,"20140920":-25.816536,"20141001":-23.576839,"20141012":-24.631728,"20141103":-22.207126,"20141114":-24.481354,"gid":284577,"code":"284576","east":283295.125297,"north":4202107.982138,"range":"1466","azimuth":"381","vel":-36.00623,"coherence":0.562034,"height":1563.978777,"demerr":-11.55214},{"20140408":0,"20140419":-3.242748,"20140430":25.805111,"20140511":-4.602088,"20140522":-8.863819,"20140602":-9.195153,"20140613":-11.854878,"20140624":-11.315123,"20140705":-20.612461,"20140716":-22.479901,"20140727":-20.268372,"20140818":-17.701299,"20140829":-18.938314,"20140909":-16.933367,"20140920":-18.651937,"20141001":-16.480086,"20141012":-18.202859,"20141103":-14.420914,"20141114":-19.069797,"gid":284578,"code":"284577","east":283303.554085,"north":4202108.988055,"range":"1467","azimuth":"381","vel":-13.994298,"coherence":0.627653,"height":1561.623877,"demerr":-19.405642},{"20140408":0,"20140419":-3.619407,"20140430":25.46494,"20140511":-4.933034,"20140522":-8.902527,"20140602":-6.184168,"20140613":-8.794233,"20140624":-8.057444,"20140705":-17.214309,"20140716":-18.985707,"20140727":-16.908515,"20140818":-14.447308,"20140829":-15.66257,"20140909":-13.52247,"20140920":-15.303821,"20141001":-13.061034,"20141012":-14.733865,"20141103":-11.144157,"20141114":-15.641546,"gid":284579,"code":"284578","east":283311.814326,"north":4202109.974319,"range":"1468","azimuth":"381","vel":-10.886648,"coherence":0.598639,"height":1559.045572,"demerr":-18.509034},{"20140408":0,"20140419":-4.936991,"20140430":24.393868,"20140511":-7.521999,"20140522":-8.738934,"20140602":-12.139255,"20140613":-14.097726,"20140624":-13.35446,"20140705":-21.576295,"20140716":-22.755093,"20140727":-22.319339,"20140818":-21.285182,"20140829":-22.036488,"20140909":-24.413079,"20140920":-25.321686,"20141001":-22.985029,"20141012":-23.883417,"20141103":-21.985577,"20141114":-24.099709,"gid":284580,"code":"284579","east":283319.854187,"north":4202110.934885,"range":"1469","azimuth":"381","vel":-32.936078,"coherence":0.560082,"height":1556.175145,"demerr":-10.088904},{"20140408":0,"20140419":-5.145572,"20140430":24.073988,"20140511":-7.803318,"20140522":-8.887352,"20140602":-12.598923,"20140613":-16.313684,"20140624":-15.492059,"20140705":-23.621451,"20140716":-24.720682,"20140727":-24.570814,"20140818":-23.593703,"20140829":-24.25991,"20140909":-26.726321,"20140920":-27.611786,"20141001":-25.308193,"20141012":-26.183401,"20141103":-24.519962,"20141114":-26.606342,"gid":284581,"code":"284580","east":283327.615183,"north":4202111.862934,"range":"1470","azimuth":"381","vel":-38.569863,"coherence":0.519847,"height":1552.935056,"demerr":-9.41892},{"20140408":0,"20140419":-5.269201,"20140430":23.654873,"20140511":-11.723471,"20140522":-12.644853,"20140602":-16.587372,"20140613":-21.112325,"20140624":-20.240637,"20140705":-28.230662,"20140716":-29.366721,"20140727":-29.368462,"20140818":-28.345896,"20140829":-29.00916,"20140909":-31.466471,"20140920":-32.29041,"20141001":-29.960364,"20141012":-30.920343,"20141103":-29.32405,"20141114":-31.6441,"gid":284582,"code":"284581","east":283335.078431,"north":4202112.756263,"range":"1471","azimuth":"381","vel":-42.595532,"coherence":0.496949,"height":1549.300264,"demerr":-8.979263},{"20140408":0,"20140419":-4.389996,"20140430":24.316054,"20140511":-9.714721,"20140522":-12.74078,"20140602":-10.966813,"20140613":-13.635287,"20140624":-12.510362,"20140705":-21.268423,"20140716":-22.896134,"20140727":-21.558721,"20140818":-19.152673,"20140829":-20.198246,"20140909":-18.030201,"20140920":-19.743288,"20141001":-17.526872,"20141012":-19.246132,"20141103":-16.18047,"20141114":-20.541566,"gid":284583,"code":"284582","east":283342.72222,"north":4202113.670644,"range":"1472","azimuth":"381","vel":-10.908184,"coherence":0.514194,"height":1545.904814,"demerr":-15.918112},{"20140408":0,"20140419":-5.680099,"20140430":23.519166,"20140511":-7.972125,"20140522":-8.326897,"20140602":-9.170379,"20140613":-10.279464,"20140624":-9.313616,"20140705":-17.120062,"20140716":-18.279557,"20140727":-18.396928,"20140818":-17.4431,"20140829":-18.069597,"20140909":-20.404117,"20140920":-21.272826,"20141001":-18.833523,"20141012":-19.923416,"20141103":-18.3236,"20141114":-20.257493,"gid":284584,"code":"284583","east":283350.937127,"north":4202114.651621,"range":"1473","azimuth":"381","vel":-15.561116,"coherence":0.551107,"height":1543.266487,"demerr":-7.434982},{"20140408":0,"20140419":-7.049904,"20140430":-15.427382,"20140511":-10.666352,"20140522":-8.131414,"20140602":-15.038952,"20140613":-15.415116,"20140624":-14.644339,"20140705":-21.416962,"20140716":-22.046166,"20140727":-23.732801,"20140818":-24.413371,"20140829":-24.61477,"20140909":-26.603505,"20140920":-26.494831,"20141001":-23.775369,"20141012":-24.137124,"20141103":-24.240106,"20141114":-23.603604,"gid":284585,"code":"284584","east":283359.53729,"north":4202115.677522,"range":"1474","azimuth":"381","vel":-26.775383,"coherence":0.530674,"height":1541.138911,"demerr":2.001017},{"20140408":0,"20140419":-5.616883,"20140430":-13.103546,"20140511":-10.281668,"20140522":-8.72709,"20140602":-14.689251,"20140613":-15.879139,"20140624":-16.400314,"20140705":-22.744492,"20140716":-22.621573,"20140727":-25.339209,"20140818":-22.849682,"20140829":-19.310084,"20140909":-14.123084,"20140920":-16.834668,"20141001":-20.13126,"20141012":-14.470661,"20141103":-20.462669,"20141114":-20.811347,"gid":285652,"code":"285651","east":283175.65747,"north":4202103.962239,"range":"1454","azimuth":"382","vel":0.248661,"coherence":0.226349,"height":1569.555847,"demerr":2.096151},{"20140408":0,"20140419":-5.046044,"20140430":-12.756513,"20140511":-9.215994,"20140522":-8.803127,"20140602":-13.67796,"20140613":-15.159876,"20140624":-15.499777,"20140705":-22.956976,"20140716":-23.011941,"20140727":-24.70512,"20140818":-22.396855,"20140829":-10.747493,"20140909":-14.557161,"20140920":-17.260153,"20141001":-22.126299,"20141012":-14.743246,"20141103":-16.719485,"20141114":-19.425591,"gid":285653,"code":"285652","east":283184.378683,"north":4202105.002254,"range":"1455","azimuth":"382","vel":1.91839,"coherence":0.278692,"height":1567.587951,"demerr":-1.8389},{"20140408":0,"20140419":-4.057383,"20140430":-12.015435,"20140511":-7.293656,"20140522":-9.110231,"20140602":-11.877009,"20140613":-13.893502,"20140624":-13.95376,"20140705":-12.742265,"20140716":-13.482931,"20140727":-13.493943,"20140818":-11.226805,"20140829":-12.63999,"20140909":-4.080697,"20140920":-7.41962,"20141001":-2.534086,"20141012":-5.488138,"20141103":-1.714153,"20141114":-7.415225,"gid":285654,"code":"285653","east":283193.439549,"north":4202106.081875,"range":"1456","azimuth":"382","vel":23.069057,"coherence":0.282986,"height":1566.070249,"demerr":-9.042914},{"20140408":0,"20140419":-6.967102,"20140430":-14.250135,"20140511":-13.954491,"20140522":-50.835971,"20140602":-60.842722,"20140613":-61.034777,"20140624":-61.510773,"20140705":-58.096113,"20140716":-57.818471,"20140727":-61.719146,"20140818":-63.807033,"20140829":-63.910207,"20140909":-60.775387,"20140920":-60.922191,"20141001":-57.081555,"20141012":-57.460549,"20141103":-70.391673,"20141114":-68.563865,"gid":285655,"code":"285654","east":283203.282515,"north":4202107.252695,"range":"1457","azimuth":"382","vel":-28.800894,"coherence":0.291259,"height":1565.589163,"demerr":12.787584},{"20140408":0,"20140419":-5.125194,"20140430":25.858846,"20140511":-10.419104,"20140522":-12.422929,"20140602":-17.70599,"20140613":-19.083874,"20140624":-19.290993,"20140705":-26.520398,"20140716":-27.199406,"20140727":-28.739434,"20140818":-28.039154,"20140829":-28.770031,"20140909":-26.026657,"20140920":-26.599354,"20141001":-23.934418,"20141012":-24.2352,"20141103":-31.712037,"20141114":-32.815908,"gid":285656,"code":"285655","east":283213.729333,"north":4202108.493928,"range":"1458","azimuth":"382","vel":-28.143017,"coherence":0.333759,"height":1565.908502,"demerr":-1.098766},{"20140408":0,"20140419":-4.161523,"20140430":-12.90355,"20140511":-8.64936,"20140522":-9.558443,"20140602":-12.321535,"20140613":-14.462387,"20140624":-14.532163,"20140705":-22.71262,"20140716":-23.710966,"20140727":-24.278052,"20140818":-22.281737,"20140829":-23.280806,"20140909":-20.734366,"20140920":-21.148702,"20141001":-18.231084,"20141012":-19.247811,"20141103":-20.418096,"20141114":-23.13648,"gid":285657,"code":"285656","east":283224.849496,"north":4202109.813678,"range":"1459","azimuth":"382","vel":-12.86797,"coherence":0.354984,"height":1567.12042,"demerr":-8.133547},{"20140408":0,"20140419":-6.787277,"20140430":-15.219654,"20140511":-14.983785,"20140522":-9.172224,"20140602":-18.763369,"20140613":-19.373166,"20140624":-19.783406,"20140705":-16.776122,"20140716":-16.529913,"20140727":-20.648878,"20140818":-22.791737,"20140829":-22.714969,"20140909":-24.466663,"20140920":-22.265493,"20141001":-19.059008,"20141012":-18.335197,"20141103":-21.350472,"20141114":-17.590526,"gid":285658,"code":"285657","east":283237.558115,"north":4202111.318653,"range":"1460","azimuth":"382","vel":1.480525,"coherence":0.378338,"height":1570.437938,"demerr":11.849561},{"20140408":0,"20140419":-7.23075,"20140430":-15.549201,"20140511":-16.112605,"20140522":-9.188485,"20140602":-17.192013,"20140613":-17.356082,"20140624":-17.740971,"20140705":-14.381757,"20140716":-13.868802,"20140727":-18.344142,"20140818":-21.550857,"20140829":-21.300159,"20140909":-22.843053,"20140920":-20.219312,"20141001":-17.294344,"20141012":-16.172359,"20141103":-18.944675,"20141114":-13.774548,"gid":285659,"code":"285658","east":283249.188339,"north":4202112.697878,"range":"1461","azimuth":"382","vel":8.064414,"coherence":0.416208,"height":1572.326298,"demerr":15.315475},{"20140408":0,"20140419":-5.57234,"20140430":-14.397066,"20140511":-12.388227,"20140522":-9.607888,"20140602":-13.654296,"20140613":-14.557636,"20140624":-14.674055,"20140705":-12.668354,"20140716":-12.978878,"20140727":-15.044242,"20140818":-16.345175,"20140829":-16.703166,"20140909":-13.395636,"20140920":-12.244675,"20141001":-9.818614,"20141012":-9.710713,"20141103":-9.544458,"20141114":-7.859587,"gid":285660,"code":"285659","east":283259.261107,"north":4202113.895494,"range":"1462","azimuth":"382","vel":22.165489,"coherence":0.436039,"height":1572.150375,"demerr":2.779369},{"20140408":0,"20140419":-6.639847,"20140430":-15.475399,"20140511":-14.753099,"20140522":-9.362033,"20140602":-15.998566,"20140613":-19.107934,"20140624":-19.37621,"20140705":-16.599911,"20140716":-16.498673,"20140727":-19.97432,"20140818":-22.865147,"20140829":-22.761375,"20140909":-24.299504,"20140920":-22.219114,"20141001":-19.689841,"20141012":-18.84194,"20141103":-20.099937,"20141114":-15.954612,"gid":285661,"code":"285660","east":283268.775899,"north":4202115.028045,"range":"1463","azimuth":"382","vel":2.111723,"coherence":0.428007,"height":1571.234914,"demerr":10.384928},{"20140408":0,"20140419":-6.753582,"20140430":-15.382018,"20140511":-14.469121,"20140522":-8.947719,"20140602":-15.449756,"20140613":-18.496257,"20140624":-18.625337,"20140705":-15.844702,"20140716":-15.747087,"20140727":-19.22957,"20140818":-22.110294,"20140829":-21.943945,"20140909":-23.504759,"20140920":-21.486395,"20141001":-18.918421,"20141012":-18.092233,"20141103":-19.51812,"20141114":-15.313825,"gid":285662,"code":"285661","east":283278.026701,"north":4202116.129812,"range":"1464","azimuth":"382","vel":3.297195,"coherence":0.435073,"height":1569.969577,"demerr":10.289963},{"20140408":0,"20140419":-5.79227,"20140430":-14.488856,"20140511":-11.823311,"20140522":-8.812116,"20140602":-12.797022,"20140613":-13.734232,"20140624":-13.625329,"20140705":-20.604842,"20140716":-21.061005,"20140727":-23.109816,"20140818":-24.507195,"20140829":-24.665865,"20140909":-26.630997,"20140920":-25.516531,"20141001":-23.094992,"20141012":-22.963747,"20141103":-23.155809,"20141114":-21.286916,"gid":285663,"code":"285662","east":283286.945164,"north":4202117.192827,"range":"1465","azimuth":"382","vel":-16.462199,"coherence":0.498974,"height":1568.263749,"demerr":2.447929},{"20140408":0,"20140419":-5.237547,"20140430":-13.995336,"20140511":-10.059549,"20140522":-8.586937,"20140602":-14.646078,"20140613":-15.981885,"20140624":-15.809357,"20140705":-23.14136,"20140716":-23.945165,"20140727":-25.110061,"20140818":-25.626833,"20140829":-25.991325,"20140909":-28.191638,"20140920":-27.566097,"20141001":-25.278259,"20141012":-25.427019,"20141103":-25.0346,"20141114":-24.467124,"gid":285664,"code":"285663","east":283295.636789,"north":4202118.229391,"range":"1466","azimuth":"382","vel":-28.322214,"coherence":0.612109,"height":1566.257264,"demerr":-2.062212},{"20140408":0,"20140419":-5.467641,"20140430":-14.180677,"20140511":-9.993378,"20140522":-8.445358,"20140602":-14.658046,"20140613":-15.83905,"20140624":-15.599574,"20140705":-22.82468,"20140716":-23.58058,"20140727":-24.75626,"20140818":-25.272861,"20140829":-25.606327,"20140909":-27.729363,"20140920":-27.148563,"20141001":-24.828871,"20141012":-24.91493,"20141103":-24.743199,"20141114":-24.075372,"gid":285665,"code":"285664","east":283304.26606,"north":4202119.258683,"range":"1467","azimuth":"382","vel":-27.204383,"coherence":0.640104,"height":1564.168153,"demerr":-1.646415},{"20140408":0,"20140419":-6.663225,"20140430":-15.185233,"20140511":-12.217987,"20140522":-8.354219,"20140602":-13.468898,"20140613":-14.103921,"20140624":-13.838672,"20140705":-20.337975,"20140716":-20.542954,"20140727":-23.020224,"20140818":-24.736734,"20140829":-19.759168,"20140909":-21.50185,"20140920":-20.308804,"20141001":-17.811599,"20141012":-17.326643,"20141103":-18.470289,"20141114":-15.818964,"gid":285666,"code":"285665","east":283312.677677,"north":4202120.262596,"range":"1468","azimuth":"382","vel":-6.314335,"coherence":0.576789,"height":1561.790544,"demerr":5.373708},{"20140408":0,"20140419":-6.906734,"20140430":-15.491412,"20140511":-12.523216,"20140522":-8.467789,"20140602":-13.673171,"20140613":-14.297234,"20140624":-13.915266,"20140705":-20.431519,"20140716":-20.566004,"20140727":-23.203599,"20140818":-24.909648,"20140829":-19.882203,"20140909":-21.657553,"20140920":-20.584825,"20141001":-18.197887,"20141012":-17.678993,"20141103":-18.848473,"20141114":-16.234488,"gid":285667,"code":"285666","east":283320.751923,"north":4202121.227169,"range":"1469","azimuth":"382","vel":-5.07809,"coherence":0.526067,"height":1558.965724,"demerr":5.717148},{"20140408":0,"20140419":-4.982465,"20140430":-14.097304,"20140511":-7.992055,"20140522":-9.057023,"20140602":-12.746621,"20140613":-17.663287,"20140624":-16.866018,"20140705":-25.022506,"20140716":-26.176009,"20140727":-26.093999,"20140818":-25.031714,"20140829":-25.689971,"20140909":-23.359364,"20140920":-24.118614,"20141001":-22.170563,"20141012":-23.039049,"20141103":-21.343805,"20141114":-23.401463,"gid":285668,"code":"285667","east":283328.432243,"north":4202122.145807,"range":"1470","azimuth":"382","vel":-15.753624,"coherence":0.474412,"height":1555.618706,"demerr":-9.612479},{"20140408":0,"20140419":33.712398,"20140430":24.289795,"20140511":31.58451,"20140522":28.752453,"20140602":26.778247,"20140613":21.595516,"20140624":22.620937,"20140705":13.993821,"20140716":12.414295,"20140727":13.443646,"20140818":15.560662,"20140829":14.610955,"20140909":16.682413,"20140920":15.366671,"20141001":17.175435,"20141012":15.714852,"20141103":18.43062,"20141114":14.555773,"gid":285669,"code":"285668","east":283335.798934,"north":4202123.027874,"range":"1471","azimuth":"382","vel":-4.671496,"coherence":0.449352,"height":1551.855928,"demerr":-14.928997},{"20140408":0,"20140419":-4.113054,"20140430":24.192273,"20140511":-9.769583,"20140522":-12.944355,"20140602":-14.278207,"20140613":-19.213075,"20140624":-18.068719,"20140705":-26.895476,"20140716":-28.614147,"20140727":-27.251311,"20140818":-24.638138,"20140829":-25.705608,"20140909":-23.60977,"20140920":-25.165833,"20141001":-23.380389,"20141012":-25.094406,"20141103":-22.010464,"20141114":-26.473012,"gid":285670,"code":"285669","east":283343.407708,"north":4202123.93817,"range":"1472","azimuth":"382","vel":-21.170627,"coherence":0.489832,"height":1548.414076,"demerr":-16.427773},{"20140408":0,"20140419":-5.592822,"20140430":23.122667,"20140511":-8.260585,"20140522":-8.400464,"20140602":-12.601012,"20140613":-13.676156,"20140624":-12.728123,"20140705":-20.466584,"20140716":-21.658279,"20140727":-21.980537,"20140818":-20.984662,"20140829":-21.561528,"20140909":-23.900906,"20140920":-24.512273,"20141001":-22.500107,"20141012":-23.446797,"20141103":-22.109499,"20141114":-23.884923,"gid":285671,"code":"285670","east":283351.570233,"north":4202124.913037,"range":"1473","azimuth":"382","vel":-29.981497,"coherence":0.516429,"height":1545.706332,"demerr":-6.865161},{"20140408":0,"20140419":-8.385589,"20140430":-16.561446,"20140511":-14.013313,"20140522":-7.884365,"20140602":-18.545536,"20140613":-18.078473,"20140624":-17.483214,"20140705":-14.236463,"20140716":-14.211237,"20140727":-18.116967,"20140818":-20.648308,"20140829":-20.235023,"20140909":-21.749011,"20140920":-20.157262,"20141001":-17.630021,"20141012":-16.873633,"20141103":-19.270981,"20141114":-15.332201,"gid":285672,"code":"285671","east":283360.056863,"north":4202125.925696,"range":"1474","azimuth":"382","vel":3.236296,"coherence":0.448246,"height":1543.428273,"demerr":13.10977},{"20140408":0,"20140419":-8.51416,"20140430":-17.120045,"20140511":-14.409275,"20140522":-8.232645,"20140602":-19.116708,"20140613":-18.749172,"20140624":-18.012289,"20140705":-14.821234,"20140716":-14.723524,"20140727":-18.611867,"20140818":-21.294805,"20140829":-20.949068,"20140909":-22.581353,"20140920":-20.992596,"20141001":-18.413332,"20141012":-17.579694,"20141103":-20.033677,"20141114":-16.116651,"gid":285673,"code":"285672","east":283368.333469,"north":4202126.913865,"range":"1475","azimuth":"382","vel":2.413615,"coherence":0.370393,"height":1540.871807,"demerr":13.853781},{"20140408":0,"20140419":-6.08217,"20140430":-13.050527,"20140511":-10.771737,"20140522":-9.055576,"20140602":-12.005313,"20140613":-13.43162,"20140624":-14.153603,"20140705":-20.303528,"20140716":-20.804646,"20140727":-19.535615,"20140818":-9.779965,"20140829":-10.234308,"20140909":-0.698341,"20140920":0.605351,"20141001":-4.389591,"20141012":-3.085839,"20141103":-4.653025,"20141114":-7.616222,"gid":286744,"code":"286743","east":283148.509425,"north":4202110.912836,"range":"1451","azimuth":"383","vel":26.382274,"coherence":0.190832,"height":1575.754844,"demerr":4.74967},{"20140408":0,"20140419":-5.938849,"20140430":-13.13201,"20140511":-10.882305,"20140522":-9.146334,"20140602":-12.419806,"20140613":-13.872899,"20140624":-14.739134,"20140705":-20.442597,"20140716":-21.123551,"20140727":-21.370795,"20140818":-20.917824,"20140829":-20.131452,"20140909":-10.410301,"20140920":-9.207722,"20141001":-13.997291,"20141012":-14.173662,"20141103":-18.522861,"20141114":-9.197789,"gid":286745,"code":"286744","east":283157.571726,"north":4202111.992622,"range":"1452","azimuth":"383","vel":9.914443,"coherence":0.184539,"height":1574.238886,"demerr":4.145876},{"20140408":0,"20140419":-6.034656,"20140430":-13.66846,"20140511":-11.590192,"20140522":-9.119071,"20140602":-13.237597,"20140613":-18.663516,"20140624":-19.490977,"20140705":-24.059448,"20140716":-24.07022,"20140727":-26.907056,"20140818":-25.530251,"20140829":-7.657939,"20140909":-14.575146,"20140920":-15.262702,"20141001":-16.984782,"20141012":-17.480578,"20141103":-24.239475,"20141114":-16.893602,"gid":286746,"code":"286745","east":283166.481079,"north":4202113.054573,"range":"1453","azimuth":"383","vel":2.969673,"coherence":0.17839,"height":1572.520272,"demerr":6.020807},{"20140408":0,"20140419":-5.207495,"20140430":-13.053543,"20140511":-10.180132,"20140522":-9.061925,"20140602":-11.562429,"20140613":-12.710651,"20140624":-13.285212,"20140705":-18.489434,"20140716":-18.357637,"20140727":-20.95807,"20140818":-18.065969,"20140829":-17.383442,"20140909":-7.244377,"20140920":-8.93056,"20141001":-10.917903,"20141012":-12.1708,"20141103":-17.995378,"20141114":-18.953821,"gid":286747,"code":"286746","east":283175.465605,"north":4202114.125289,"range":"1454","azimuth":"383","vel":-0.549357,"coherence":0.187932,"height":1570.901327,"demerr":1.56918},{"20140408":0,"20140419":-4.523939,"20140430":-12.407103,"20140511":-8.887063,"20140522":-8.937306,"20140602":-9.83262,"20140613":-11.358679,"20140624":-11.745686,"20140705":-9.359568,"20140716":-9.118556,"20140727":-10.352745,"20140818":-6.855775,"20140829":-11.610783,"20140909":2.267786,"20140920":-0.764034,"20141001":-2.281081,"20141012":-4.184741,"20141103":-7.763466,"20141114":-10.632512,"gid":286748,"code":"286747","east":283184.456121,"north":4202115.196704,"range":"1455","azimuth":"383","vel":19.169184,"coherence":0.237319,"height":1569.290364,"demerr":-3.017549},{"20140408":0,"20140419":-4.949817,"20140430":-19.936496,"20140511":-17.294634,"20140522":-15.917875,"20140602":-21.897682,"20140613":-23.12671,"20140624":-23.531228,"20140705":-21.014015,"20140716":-20.681602,"20140727":-22.227201,"20140818":-20.93129,"20140829":-24.605317,"20140909":-9.426469,"20140920":-14.060466,"20141001":-14.981232,"20141012":-11.898757,"20141103":-22.763274,"20141114":-25.136474,"gid":286749,"code":"286748","east":283193.676943,"north":4202116.294974,"range":"1456","azimuth":"383","vel":7.722165,"coherence":0.251771,"height":1567.984683,"demerr":0.2865},{"20140408":0,"20140419":-6.677432,"20140430":-13.828547,"20140511":-13.795427,"20140522":-50.332388,"20140602":-60.457038,"20140613":-60.558333,"20140624":-61.244792,"20140705":-66.181902,"20140716":-66.167088,"20140727":-69.752729,"20140818":-73.468218,"20140829":-74.49054,"20140909":-71.269175,"20140920":-74.491161,"20141001":-70.609236,"20141012":-71.098354,"20141103":-83.989781,"20141114":-83.396446,"gid":286750,"code":"286749","east":283203.318826,"north":4202117.442343,"range":"1457","azimuth":"383","vel":-59.849659,"coherence":0.268272,"height":1567.23712,"demerr":13.11131},{"20140408":0,"20140419":-5.641746,"20140430":25.588167,"20140511":-11.773005,"20140522":-11.709396,"20140602":-18.949807,"20140613":-19.66868,"20140624":-20.188874,"20140705":-17.477241,"20140716":-18.55179,"20140727":-20.798755,"20140818":-21.106837,"20140829":-21.834372,"20140909":-18.856954,"20140920":-21.135005,"20141001":-17.060045,"20141012":-17.610012,"20141103":-25.149817,"20141114":-25.23508,"gid":286751,"code":"286750","east":283213.251516,"north":4202118.623622,"range":"1458","azimuth":"383","vel":-13.058331,"coherence":0.263107,"height":1566.875063,"demerr":5.120777},{"20140408":0,"20140419":-6.762412,"20140430":-21.848663,"20140511":-22.031713,"20140522":-15.623514,"20140602":-25.457277,"20140613":-29.17396,"20140624":-29.854896,"20140705":-26.488143,"20140716":-26.038743,"20140727":-31.051805,"20140818":-33.459658,"20140829":-33.506135,"20140909":-35.314196,"20140920":-34.732143,"20141001":-31.812358,"20141012":-31.325044,"20141103":-35.148999,"20141114":-31.545781,"gid":286752,"code":"286751","east":283223.925106,"north":4202119.891294,"range":"1459","azimuth":"383","vel":-11.522178,"coherence":0.256425,"height":1567.495102,"demerr":13.544544},{"20140408":0,"20140419":-6.4573,"20140430":-14.920096,"20140511":-14.913578,"20140522":-9.094131,"20140602":-18.520448,"20140613":-18.916749,"20140624":-19.482989,"20140705":-16.4959,"20140716":-16.215636,"20140727":-20.488735,"20140818":-22.99238,"20140829":-23.123436,"20140909":-24.897105,"20140920":-22.840296,"20141001":-19.811475,"20141012":-19.316271,"20141103":-21.837583,"20141114":-18.231415,"gid":286753,"code":"286752","east":283236.288294,"north":4202121.355985,"range":"1460","azimuth":"383","vel":0.313604,"coherence":0.288728,"height":1570.354771,"demerr":11.363422},{"20140408":0,"20140419":-6.904533,"20140430":-15.189589,"20140511":-15.834017,"20140522":-8.996637,"20140602":-19.949156,"20140613":-20.02233,"20140624":-20.541301,"20140705":-17.140241,"20140716":-16.740352,"20140727":-21.052325,"20140818":-24.260958,"20140829":-24.225453,"20140909":-25.909023,"20140920":-23.301246,"20141001":-27.576917,"20141012":-26.579595,"20141103":-29.1907,"20141114":-24.298519,"gid":286754,"code":"286753","east":283248.061725,"north":4202122.751906,"range":"1461","azimuth":"383","vel":-12.995303,"coherence":0.384069,"height":1572.43295,"demerr":14.759519},{"20140408":0,"20140419":-5.354773,"20140430":-13.875226,"20140511":-11.872826,"20140522":-8.930893,"20140602":-12.894904,"20140613":-13.738821,"20140624":-13.940211,"20140705":-11.742016,"20140716":-12.217148,"20140727":-14.202475,"20140818":-15.50002,"20140829":-15.9268,"20140909":-12.640192,"20140920":-11.470013,"20141001":-9.174096,"20141012":-9.084263,"20141103":-9.041335,"20141114":-7.483411,"gid":286755,"code":"286754","east":283258.332584,"north":4202123.972617,"range":"1462","azimuth":"383","vel":21.993819,"coherence":0.472656,"height":1572.519604,"demerr":2.877572},{"20140408":0,"20140419":-5.272356,"20140430":-13.967185,"20140511":-11.530252,"20140522":-8.778594,"20140602":-12.609483,"20140613":-16.585719,"20140624":-16.725569,"20140705":-14.600022,"20140716":-15.225239,"20140727":-17.067811,"20140818":-18.399497,"20140829":-18.769661,"20140909":-15.58106,"20140920":-14.529613,"20141001":-12.30384,"20141012":-12.18837,"20141103":-11.93146,"20141114":-10.409626,"gid":286756,"code":"286755","east":283267.97514,"north":4202125.120063,"range":"1463","azimuth":"383","vel":13.266725,"coherence":0.502806,"height":1571.773506,"demerr":1.848722},{"20140408":0,"20140419":-4.208286,"20140430":-13.198766,"20140511":-8.959266,"20140522":-9.029247,"20140602":-9.997522,"20140613":-14.626058,"20140624":-14.502718,"20140705":-22.352209,"20140716":-23.496824,"20140727":-23.77303,"20140818":-23.515928,"20140829":-24.252186,"20140909":-21.565531,"20140920":-21.548612,"20141001":-19.45819,"20141012":-20.083711,"20141103":-18.392054,"20141114":-19.33414,"gid":286757,"code":"286756","east":283277.330401,"north":4202126.234008,"range":"1464","azimuth":"383","vel":-14.55699,"coherence":0.491944,"height":1570.646646,"demerr":-7.092032},{"20140408":0,"20140419":-5.637102,"20140430":-14.294322,"20140511":-11.840709,"20140522":-8.704996,"20140602":-12.973663,"20140613":-13.548342,"20140624":-13.533866,"20140705":-20.34788,"20140716":-20.797858,"20140727":-22.967203,"20140818":-24.310487,"20140829":-24.46732,"20140909":-26.395563,"20140920":-25.144923,"20141001":-22.843291,"20141012":-22.564165,"20141103":-22.997497,"20141114":-21.018236,"gid":286758,"code":"286757","east":283286.411952,"north":4202127.316037,"range":"1465","azimuth":"383","vel":-15.153113,"coherence":0.526551,"height":1569.157014,"demerr":2.754311},{"20140408":0,"20140419":-6.754208,"20140430":-15.1655,"20140511":-13.899157,"20140522":-8.271619,"20140602":-18.456213,"20140613":-18.462797,"20140624":-18.531677,"20140705":-15.15144,"20140716":-15.156846,"20140727":-18.738391,"20140818":-21.326354,"20140829":-21.052256,"20140909":-22.69447,"20140920":-20.510921,"20141001":-18.130398,"20141012":-17.098783,"20141103":-19.207836,"20141114":-14.939303,"gid":286759,"code":"286758","east":283295.251199,"north":4202128.369811,"range":"1466","azimuth":"383","vel":3.573374,"coherence":0.572009,"height":1567.346229,"demerr":10.42104},{"20140408":0,"20140419":-6.941831,"20140430":-15.332134,"20140511":-13.701823,"20140522":-8.091212,"20140602":-18.348766,"20140613":-18.435864,"20140624":-18.394628,"20140705":-15.004872,"20140716":-14.994967,"20140727":-18.504588,"20140818":-21.067542,"20140829":-20.784638,"20140909":-22.40856,"20140920":-20.306043,"20141001":-18.005073,"20141012":-16.946159,"20141103":-19.265401,"20141114":-14.993777,"gid":286760,"code":"286759","east":283304.006205,"north":4202129.413763,"range":"1467","azimuth":"383","vel":3.01656,"coherence":0.557673,"height":1565.423809,"demerr":10.404812},{"20140408":0,"20140419":-6.001021,"20140430":-14.669004,"20140511":-11.124872,"20140522":-8.383559,"20140602":-15.721385,"20140613":-16.490017,"20140624":-16.1369,"20140705":-23.045471,"20140716":-23.491461,"20140727":-25.334111,"20140818":-26.359109,"20140829":-21.526242,"20140909":-23.536783,"20140920":-22.650397,"20141001":-20.600482,"20141012":-20.348484,"20141103":-21.028846,"20141114":-19.467801,"gid":286761,"code":"286760","east":283312.599044,"north":4202130.438804,"range":"1468","azimuth":"383","vel":-8.472576,"coherence":0.516989,"height":1563.286449,"demerr":1.598199},{"20140408":0,"20140419":-5.671607,"20140430":-14.520097,"20140511":-10.116677,"20140522":-8.683385,"20140602":-14.748899,"20140613":-19.153073,"20140624":-18.651322,"20140705":-26.11592,"20140716":-26.766427,"20140727":-27.932255,"20140818":-28.216714,"20140829":-23.491444,"20140909":-25.771882,"20140920":-25.526872,"20141001":-23.616241,"20141012":-23.767123,"20141103":-23.584343,"20141114":-23.37235,"gid":286762,"code":"286761","east":283320.765032,"north":4202131.414072,"range":"1469","azimuth":"383","vel":-12.603115,"coherence":0.476498,"height":1560.58326,"demerr":-2.380101},{"20140408":0,"20140419":-5.920691,"20140430":-14.860577,"20140511":-10.314603,"20140522":-8.900568,"20140602":-15.276471,"20140613":-19.712942,"20140624":-19.139546,"20140705":-26.529554,"20140716":-27.146751,"20140727":-28.534537,"20140818":-28.826658,"20140829":-24.085985,"20140909":-26.475164,"20140920":-26.225722,"20141001":-24.39567,"20141012":-24.515913,"20141103":-24.442738,"20141114":-24.167453,"gid":286763,"code":"286762","east":283328.460829,"north":4202132.334513,"range":"1470","azimuth":"383","vel":-13.399603,"coherence":0.429948,"height":1557.256771,"demerr":-1.789884},{"20140408":0,"20140419":-5.625925,"20140430":-14.786291,"20140511":-9.376199,"20140522":-8.941887,"20140602":-10.920149,"20140613":-15.487441,"20140624":-14.71534,"20140705":-22.315061,"20140716":-23.178458,"20140727":-24.085241,"20140818":-23.761032,"20140829":-24.203097,"20140909":-21.717809,"20140920":-21.740828,"20141001":-20.107822,"20141012":-20.52592,"20141103":-19.895279,"20141114":-20.459689,"gid":286764,"code":"286763","east":283335.81301,"north":4202133.214885,"range":"1471","azimuth":"383","vel":-14.825321,"coherence":0.415898,"height":1553.474766,"demerr":-4.57273},{"20140408":0,"20140419":-5.153888,"20140430":23.260525,"20140511":-8.167497,"20140522":-8.817774,"20140602":-9.790251,"20140613":-14.399517,"20140624":-13.492468,"20140705":-21.54995,"20140716":-22.732068,"20140727":-22.841769,"20140818":-21.579022,"20140829":-22.270514,"20140909":-24.781836,"20140920":-25.234719,"20141001":-23.706213,"20141012":-24.561688,"20141103":-23.145352,"20141114":-24.835535,"gid":286765,"code":"286764","east":283343.319548,"north":4202134.113257,"range":"1472","azimuth":"383","vel":-32.519623,"coherence":0.444817,"height":1549.897392,"demerr":-8.355928},{"20140408":0,"20140419":-5.505064,"20140430":22.84067,"20140511":-8.441132,"20140522":-8.572853,"20140602":-12.776807,"20140613":-13.872494,"20140624":-13.004489,"20140705":-20.818451,"20140716":-22.047099,"20140727":-22.354466,"20140818":-21.238,"20140829":-21.858608,"20140909":-24.241521,"20140920":-24.641894,"20141001":-23.063646,"20141012":-23.854001,"20141103":-22.677817,"20141114":-24.258,"gid":286766,"code":"286765","east":283351.358444,"north":4202135.073705,"range":"1473","azimuth":"383","vel":-30.392123,"coherence":0.441011,"height":1547.025767,"demerr":-6.884477},{"20140408":0,"20140419":-8.374022,"20140430":-16.953597,"20140511":-14.574609,"20140522":-8.144587,"20140602":-19.082216,"20140613":-18.597942,"20140624":-18.032954,"20140705":-14.651607,"20140716":-14.61333,"20140727":-18.754129,"20140818":-21.319672,"20140829":-20.892393,"20140909":-22.459404,"20140920":-20.620001,"20141001":-18.506264,"20141012":-17.532718,"20141103":-20.234827,"20141114":-15.938351,"gid":286767,"code":"286766","east":283359.684052,"north":4202136.067585,"range":"1474","azimuth":"383","vel":2.402568,"coherence":0.368148,"height":1544.534253,"demerr":13.834287},{"20140408":0,"20140419":-8.789049,"20140430":-24.094838,"20140511":-22.007251,"20140522":-15.149074,"20140602":-26.780459,"20140613":-28.918673,"20140624":-28.160346,"20140705":-24.714098,"20140716":-23.739369,"20140727":-28.222037,"20140818":-31.202204,"20140829":-30.771677,"20140909":-32.455685,"20140920":-30.471965,"20141001":-28.211016,"20141012":-27.059773,"20141103":-30.063305,"20141114":-25.34208,"gid":286768,"code":"286767","east":283367.834446,"north":4202137.041035,"range":"1475","azimuth":"383","vel":-2.073492,"coherence":0.329124,"height":1541.810476,"demerr":15.898158},{"20140408":0,"20140419":-9.249687,"20140430":-19.338472,"20140511":-17.207178,"20140522":-9.891618,"20140602":-21.635144,"20140613":-21.149816,"20140624":-20.313275,"20140705":-16.788642,"20140716":-16.46629,"20140727":-21.22638,"20140818":-24.396086,"20140829":-23.981414,"20140909":-25.647693,"20140920":-23.518613,"20141001":-27.796966,"20141012":-26.546983,"20141103":-29.870717,"20141114":-24.819085,"gid":286769,"code":"286768","east":283375.605406,"north":4202137.97024,"range":"1476","azimuth":"383","vel":-9.949112,"coherence":0.35163,"height":1538.58369,"demerr":17.749238},{"20140408":0,"20140419":-6.254635,"20140430":21.752707,"20140511":28.707401,"20140522":28.300749,"20140602":24.458551,"20140613":22.773025,"20140624":24.164439,"20140705":16.355017,"20140716":15.024989,"20140727":14.699557,"20140818":15.860558,"20140829":15.077307,"20140909":12.42206,"20140920":5.019194,"20141001":7.004871,"20141012":6.070685,"20141103":7.157158,"20141114":5.164219,"gid":286770,"code":"286769","east":283383.147122,"north":4202138.872713,"range":"1477","azimuth":"383","vel":-17.654131,"coherence":0.385387,"height":1535.052993,"demerr":-5.420538},{"20140408":0,"20140419":-4.803359,"20140430":-12.040604,"20140511":-7.942901,"20140522":-9.319275,"20140602":-12.90527,"20140613":-15.620197,"20140624":-17.096355,"20140705":-21.930194,"20140716":-25.242791,"20140727":-25.860568,"20140818":-16.928551,"20140829":-16.199249,"20140909":-7.146374,"20140920":-5.714147,"20141001":-7.265861,"20141012":-9.377416,"20141103":-4.691292,"20141114":-8.442074,"gid":287861,"code":"287860","east":283139.099367,"north":4202119.980159,"range":"1450","azimuth":"384","vel":21.432434,"coherence":0.16176,"height":1578.410013,"demerr":-3.558681},{"20140408":0,"20140419":-5.347548,"20140430":-12.474391,"20140511":-9.451351,"20140522":-9.466838,"20140602":-14.91968,"20140613":-18.230864,"20140624":-18.023831,"20140705":-22.252883,"20140716":-26.197056,"20140727":-22.235486,"20140818":-12.916552,"20140829":-13.609179,"20140909":-1.363085,"20140920":-2.423512,"20141001":-4.999534,"20141012":-7.0684,"20141103":-6.804545,"20141114":-10.404827,"gid":287862,"code":"287861","east":283148.412496,"north":4202121.089191,"range":"1451","azimuth":"384","vel":18.63461,"coherence":0.15111,"height":1577.226439,"demerr":0.768749},{"20140408":0,"20140419":-7.10601,"20140430":-14.112788,"20140511":-13.958593,"20140522":-9.274384,"20140602":-19.678642,"20140613":-20.711235,"20140624":-21.600649,"20140705":-26.033994,"20140716":-28.395311,"20140727":-28.432534,"20140818":-26.843451,"20140829":-28.685874,"20140909":-28.550181,"20140920":-28.738824,"20141001":-27.375795,"20141012":-28.268456,"20141103":-33.590444,"20141114":-34.068702,"gid":287863,"code":"287862","east":283157.406785,"north":4202122.161043,"range":"1452","azimuth":"384","vel":-23.266191,"coherence":0.154363,"height":1575.620365,"demerr":14.391633},{"20140408":0,"20140419":-6.445644,"20140430":-14.032921,"20140511":-13.261538,"20140522":-9.462937,"20140602":-19.144889,"20140613":-23.965653,"20140624":-24.929423,"20140705":-22.426302,"20140716":-24.711034,"20140727":-24.391529,"20140818":-22.022604,"20140829":-26.552471,"20140909":-23.852848,"20140920":-24.561413,"20141001":-25.389104,"20141012":-19.28439,"20141103":-26.98494,"20141114":-31.18478,"gid":287864,"code":"287863","east":283166.283082,"north":4202123.219136,"range":"1453","azimuth":"384","vel":-12.459758,"coherence":0.148467,"height":1573.857959,"demerr":10.995374},{"20140408":0,"20140419":-6.594689,"20140430":-14.274241,"20140511":-14.128111,"20140522":-9.098537,"20140602":-14.869707,"20140613":-18.600046,"20140624":-19.615025,"20140705":-18.765125,"20140716":-20.183374,"20140727":-20.503907,"20140818":-18.240916,"20140829":-25.55946,"20140909":-18.934431,"20140920":-19.40434,"20141001":-20.115472,"20141012":-20.826738,"20141103":-29.236256,"20141114":-32.559883,"gid":287865,"code":"287864","east":283175.281277,"north":4202124.291444,"range":"1454","azimuth":"384","vel":-17.52709,"coherence":0.155293,"height":1572.257148,"demerr":14.503019},{"20140408":0,"20140419":-3.720387,"20140430":-15.596297,"20140511":-11.59998,"20140522":-12.675441,"20140602":-16.496337,"20140613":-18.015291,"20140624":-18.586994,"20140705":-16.485577,"20140716":-16.308163,"20140727":-16.443374,"20140818":-10.488589,"20140829":-19.034625,"20140909":-11.079139,"20140920":-10.350085,"20141001":-10.889095,"20141012":-14.004386,"20141103":-17.507888,"20141114":-20.1527,"gid":287866,"code":"287865","east":283184.389629,"north":4202125.376596,"range":"1455","azimuth":"384","vel":10.730795,"coherence":0.219329,"height":1570.802376,"demerr":-6.40504},{"20140408":0,"20140419":-2.989175,"20140430":-11.350584,"20140511":-6.628458,"20140522":-8.93475,"20140602":-10.908817,"20140613":-12.925283,"20140624":-13.287921,"20140705":-11.346506,"20140716":-12.035395,"20140727":-11.020077,"20140818":-1.63702,"20140829":-9.325784,"20140909":-6.37427,"20140920":-0.716556,"20141001":-0.915765,"20141012":2.22463,"20141103":-2.482598,"20141114":-6.977496,"gid":287867,"code":"287866","east":283193.709874,"north":4202126.486457,"range":"1456","azimuth":"384","vel":28.410619,"coherence":0.230609,"height":1569.628489,"demerr":-11.654789},{"20140408":0,"20140419":-2.723165,"20140430":-11.276582,"20140511":-6.323487,"20140522":-9.115012,"20140602":-10.354326,"20140613":-12.495636,"20140624":-12.786961,"20140705":-19.117351,"20140716":-21.190695,"20140727":-19.36706,"20140818":-22.360298,"20140829":-27.428919,"20140909":-23.603876,"20140920":-20.464582,"20141001":-19.901269,"20141012":-19.369348,"20141103":-26.317609,"20141114":-33.353798,"gid":287868,"code":"287867","east":283203.277977,"north":4202127.625219,"range":"1457","azimuth":"384","vel":-34.267118,"coherence":0.233069,"height":1568.783165,"demerr":-13.469163},{"20140408":0,"20140419":-5.020922,"20140430":25.872165,"20140511":-12.041594,"20140522":-9.130581,"20140602":-15.819429,"20140613":-16.502009,"20140624":-17.113409,"20140705":-14.531362,"20140716":-16.36023,"20140727":-17.378832,"20140818":-22.582736,"20140829":-24.361232,"20140909":-20.383309,"20140920":-24.681999,"20141001":-22.135533,"20141012":-19.462036,"20141103":-29.337339,"20141114":-30.9546,"gid":287869,"code":"287868","east":283213.030392,"north":4202128.785473,"range":"1458","azimuth":"384","vel":-30.494403,"coherence":0.218285,"height":1568.182198,"demerr":3.720761},{"20140408":0,"20140419":-4.663967,"20140430":-13.553468,"20140511":-11.388001,"20140522":-9.339368,"20140602":-12.455272,"20140613":-13.577961,"20140624":-14.000733,"20140705":-12.214474,"20140716":-13.369985,"20140727":-13.978947,"20140818":-16.638992,"20140829":-17.605479,"20140909":-14.3367,"20140920":-14.017187,"20141001":-11.596734,"20141012":-12.379341,"20141103":-14.246457,"20141114":-14.116362,"gid":287870,"code":"287869","east":283223.439081,"north":4202130.022253,"range":"1459","azimuth":"384","vel":10.135072,"coherence":0.237725,"height":1568.451154,"demerr":0.613128},{"20140408":0,"20140419":-5.06161,"20140430":-13.730404,"20140511":-12.162082,"20140522":-9.190953,"20140602":-13.244834,"20140613":-14.532709,"20140624":-14.83932,"20140705":-12.810488,"20140716":-12.525901,"20140727":-14.624512,"20140818":-16.52854,"20140829":-17.152844,"20140909":-13.898098,"20140920":-12.241696,"20141001":-11.008258,"20141012":-11.285708,"20141103":-12.849194,"20141114":-11.539395,"gid":287871,"code":"287870","east":283235.325288,"north":4202131.431321,"range":"1460","azimuth":"384","vel":14.547797,"coherence":0.287977,"height":1570.678623,"demerr":3.167826}],"average":{"20140408":0,"20140419":-2.8750655559006186,"20140430":-5.313211793478251,"20140511":-8.635135878881988,"20140522":-8.293220736024843,"20140602":-12.54336641770186,"20140613":-14.445795009316775,"20140624":-15.856914086956529,"20140705":-18.640955647515522,"20140716":-20.292430670807438,"20140727":-21.703367725155278,"20140818":-21.48565793788821,"20140829":-22.12585510559007,"20140909":-22.45095904347826,"20140920":-21.475955493788838,"20141001":-20.480480259316753,"20141012":-20.518268248447196,"20141103":-20.84583800465839,"20141114":-21.485010124223603,"gid":294933.3897515528,"code":294932.3897515528,"east":283272.4572504303,"north":4202200.887722888,"range":1464.1832298136646,"azimuth":390.3835403726708,"vel":-13.624119916149064,"coherence":0.34564507919254667,"height":1573.5265064254645,"demerr":-0.6222815403726725}}


	
});


