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
			maxZoom : 19,
			minZoom : 0,
			// zoomAnimation : false
			zoomControl : false,
			inertia : false,
			// loadingControl : true,
			// zoomAnimationThreshold : 2
		});

		this._attributionControl = L.control.attribution({position : 'bottomleft', prefix : false});
		map.addControl(this._attributionControl);

		this._attributionControl.addAttribution('<a href="http://systemapic.com">Powered by Systemapic.com</a>');
		this._attributionControl.removeAttribution('Leaflet');



		// global map events
		map.on('zoomstart', function (e) {

			map.eachLayer(function (layer) {
				if (!layer.options) return;

				var layerUuid = layer.options.layerUuid;

				if (!layerUuid) return;

				// get wu layer
				var l = app.activeProject.getPostGISLayer(layerUuid);
		

				if (!l) return  
				
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
		map.options.maxZoom = bounds.maxZoom > 19 ? 19 : bounds.maxZoom;
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

		// // scale control
		// if (controls.measure) {
		// 	if (controls.layermenu) {
		// 		topright.style.right = '295px';
		// 	} else {
		// 		topright.style.right = '6px';
		// 	}
		// }


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



	_addPopupContent : function (e, multiPopUp) {


		console.log('%c****************', 'backgroun: blue; color: white;');
		console.log('%c_addPopupContent', 'backgroun: red; color: white;');
		console.log('%c****************', 'backgroun: blue; color: white;');

		
		var options = {};
		this._chart = new Wu.Control.Chart(options);
		
		var d3popup = this._project.getSettings()['d3popup'];
		var d3popup = true;

		if ( multiPopUp ) var content = this.multiPopUp(multiPopUp);
		else 		  var content = d3popup ? this._createPopupContentC3(e) : this._createPopupContent(e);


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
		this._popupContent = content;

		this.openPopup(e, multiPopUp);


	},

	_clearPopup : function () {
		this._popupContent = '';
		this._popup = null;

		this.popUpMarkerCircle && app._map.removeLayer(this.popUpMarkerCircle);
		
	},
	
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

		// different latlng data formats
		// 1. lat/lng in column (akervatn) 	// todo: make pluggable, or create lat/lng in table on import
		// 2. north/east as 3857 (turkey)

		// If single sampling, create a little circle...
		
		// 1. lat/lng ing column
		var latlng = L.latLng(e.data.lat, e.data.lon);	 // todo: remove this??

		// 2 north/east as 3857
		if (!latlng) {
			var latlng = L.Projection.Mercator.unproject({x:e.data.north, y:e.data.east}); // wrong conversion, wrong epsg?
		}

		var styling = { 
			radius: 10,
			fillColor: "#f03",
			color: "red",
			fillOpacity: 0.5
		}

		this.popUpMarkerCircle = L.circleMarker(latlng, styling).addTo(map);

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





	// ***************************************************************
	// * C3 POP-UP C3 POP-UP C3 POP-UP C3 POP-UP C3 POP-UP C3 POP-UP *
	// * C3 POP-UP C3 POP-UP C3 POP-UP C3 POP-UP C3 POP-UP C3 POP-UP *
	// * C3 POP-UP C3 POP-UP C3 POP-UP C3 POP-UP C3 POP-UP C3 POP-UP *
	// ***************************************************************


	_createPopupContentC3 : function (e) {

		var _retHTML = this.singlePopUp(e);
		return _retHTML;
	},


	
	_addPopupContentDraw : function (data) {
		this._addPopupContent(false, data)		
	},



	// SINGLE POP-UP
	// SINGLE POP-UP
	// SINGLE POP-UP		

	singlePopUp : function (e) {

		var _meta = e.layer.getTooltip();

		var c3Obj = {


			data : e.data,
			layer : e.layer,
			layerName : e.layer.store.title,
			meta : _meta,
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


		var _c3Obj = this.stackC3meta(c3Obj);

		// Create HTML
		var _header = this.initC3Header(_c3Obj);
		var _HTML   = this.initC3Chart(_c3Obj);

		return _header + _HTML;			

	},


	// MULTI POP-UP
	// MULTI POP-UP
	// MULTI POP-UP		

	multiPopUp : function (_data) {	

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


		// var _data = this.stackC3meta(c3Obj);
		var _c3Obj = this.stackC3meta(c3Obj);

		// Create HTML
		var _header = this.initC3Header(_c3Obj);
		var _HTML   = this.initC3Chart(_c3Obj);		

		return _header + _HTML;

	},	


	// HEADER
	// HEADER
	// HEADER

	// RETURNS HTML WITH HEADER – RUNS NO FUNCTION
	initC3Header : function (c3Obj) {

		var headerMeta = c3Obj.d3array.meta;
		var layerName = c3Obj.layerName;

		var areaSQ = c3Obj.multiPopUp.areaSQ;
		var pointCount = c3Obj.multiPopUp.totalPoints;



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

			// ************************************************************
			//      	     HARDCODE : TODO => REMOVE
			// ************************************************************
			// This is just temporary... but select these fields for viewing

			// if (       meta[0] != 'lat' 
			// 	&& meta[0] != 'lon' 
			// 	&& meta[0] != 'height' 
			// 	&& meta[0] != 'coherence' 
			// 	&& meta[0] != 'mvel'
			// 	&& meta[0] != 'dtotal' 
			// 	&& meta[0] != 'd12mnd' 
			// 	&& meta[0] != 'd3mnd' 
			// 	&& meta[0] != 'd1mnd' 
			// 	) { return }

			// ************************************************************



			if ( meta[0] == 'geom' || meta[0] == 'the_geom_3857' || meta[0] == 'the_geom_4326' ) { return }


			if ( !meta[1] ) return;

			c++;

			metaStr += '<div class="' + 'c3-header-metapair metapair-' + c + '">';
			metaStr += '<div class="c3-header-metakey">' + meta[0] + ':</div>';
			metaStr += '<div class="c3-header-metaval">' + meta[1] + '</div>';
			metaStr += '</div>';

		});

		metaStr += '</div>';

		return metaStr;

	},


	// CHART
	// CHART
	// CHART

	// RETURNS HTML WITH CHART – RUNS NO FUNCTION
	// Pretty much OK => just need to fix "moment" time
	initC3Chart : function (c3Obj) {



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
		if ( minY < 0 ) {
			var convertedMinY = Math.abs(minY);
			if ( convertedMinY > maxY ) 	range = convertedMinY;
			else 				range = maxY;
		} else {
			range = Math.floor(maxY * 100) / 100;
		}

		console.log('%cRANGE', 'background: green; color: white;');
		console.log('RANGE', range)

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
				// height: 300,
				// width: 540
				// height: 270,
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

		                // onmouseover : function () {
		                // 	console.log('onmouseover');
		                // },

		                // onclick : function () {
		                // 	console.log('data click');
		                // }


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
		                	// max : range,
		                	// min : -range,
		                	max : 50,
		                	min : -50,
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


	// CHART HELPER – BUILD ARRAY (Only for single now, but should make universal)
	// CHART HELPER – BUILD ARRAY (Only for single now, but should make universal)
	// CHART HELPER – BUILD ARRAY (Only for single now, but should make universal)

	c3StackArray : function (_key, _val, d3array) {

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
			// d3array.x.push(_date);
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
		metaStr += '</div>';

		headerMeta.forEach(function(meta, i) {

			if ( meta[0] == 'geom' || meta[0] == 'the_geom_3857' || meta[0] == 'geom4326' ) return;

			console.log('meta[0]', meta[0]);

			if ( !meta[1] ) return;
			metaStr += '<div class="' + 'c3-header-metapair metapair-' + i + '">';
			metaStr += '<div class="c3-header-metakey">' + meta[0] + ':</div>';
			metaStr += '<div class="c3-header-metaval">' + meta[1] + '</div>';
			metaStr += '</div>';

		});

		metaStr += '</div>';

		return metaStr;

	},


	stackC3meta : function (c3Obj) {


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
					// var _val = parseFloat(data[field.key]);
					var _val = parseFloat(data[field.key]).toString().substring(0,10);
					var _key = field.title || field.key;

					this.c3StackArray(_key, _val, d3array);	

					
				}
			}

		// first time use of meta.. (or something)
		} else {

			for (var key in data) {

				// var _val = parseFloat(data[key]);
				var _val = parseFloat(data[key]).toString().substring(0,10);
				var _key = key;

				this.c3StackArray(_key, _val, d3array);

			}
		}


		return c3Obj;
	
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

	
});