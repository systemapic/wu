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
			console.log('initcontrol', control, this._controls);
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

	// disableZoom : function () {
	// 	this._map.touchZoom.disable();
	// 	this._map.doubleClickZoom.disable();
	// 	this._map.scrollWheelZoom.disable();
	// 	this._map.boxZoom.disable();
	// 	this._map.keyboard.disable();
	// 	document.getElementsByClassName('leaflet-control-zoom')[0].style.display = 'none';
	// }, 

	// enableZoom : function () {
	// 	this._map.touchZoom.enable();
	// 	this._map.doubleClickZoom.enable();
	// 	this._map.scrollWheelZoom.enable();
	// 	this._map.boxZoom.enable();
	// 	this._map.keyboard.enable();
	// 	document.getElementsByClassName('leaflet-control-zoom')[0].style.display = 'block';
	// },

	// enableLegends : function () {
	// 	if (this.legendsControl) return;

	// 	// create control
	// 	this.legendsControl = L.control.legends({
	// 		position : 'bottomleft'
	// 	});

	// 	// add to map
	// 	this.legendsControl.addTo(this._map);

	// 	// update control with project
	// 	this.legendsControl.update();
	// },

	// disableLegends : function () {
	// 	if (!this.legendsControl) return;
	       
	// 	// remove and delete control
	// 	this._map.removeControl(this.legendsControl);
	// 	this.legendsControl = null;
	// 	delete this.legendsControl;
	// },

	// enableDraw : function () {
	// 	if (this.drawControl) return;

	// 	console.error('ENABLE DRAW');

	// 	// Initialise the FeatureGroup to store editable layers
	// 	var drawnItems = new L.FeatureGroup();
	// 	map.addLayer(drawnItems);

	// 	// Initialise the draw control and pass it the FeatureGroup of editable layers
	// 	this.drawControl = new L.Control.Draw({
	// 		edit: {
	// 			featureGroup: drawnItems
	// 		},
	// 		draw : {
	// 			polyline : false,
	// 			rectangle : false,
	// 			circle : false,
	// 			marker : false
	// 		}
	// 	});
	// 	map.addControl(drawControl);

	// 	// update control with project
	// 	this.drawControl.update();
	// },

	// disableDraw : function () {
	// 	if (!this.drawControl) return;
	       
	// 	// remove and delete control
	// 	this._map.removeControl(this.drawControl);
	// 	this.drawControl = null;
	// 	delete this.drawControl;
	// },

	// enableMouseposition : function () {
	// 	console.error('enable mous');
	// 	if (this.mousepositionControl) return;

	// 	// create control
	// 	this.mousepositionControl = L.control.mouseposition({ position : 'topright' });

	// 	// add to map
	// 	this.mousepositionControl.addTo(this._map);
	// },

	// disableMouseposition : function () {
	// 	if (!this.mousepositionControl) return;
	       	
	// 	// remove and delete control
	// 	this._map.removeControl(this.mousepositionControl);
	// 	this.mousepositionControl = null;
	// 	delete this.mousepositionControl;
	// },

	// enableGeolocation : function () {
	// 	if (this.geolocationControl) return;

	// 	// create controls 
	// 	this.geolocationControl = new L.Control.Search({
	// 		url : 'https://nominatim.openstreetmap.org/search?format=json&q={s}',
	// 		jsonpParam : 'json_callback',
	// 		propertyName : 'display_name',
	// 		propertyLoc : ['lat','lon'],	
	// 		boundingBox : 'boundingbox',

	// 		// custom filter
	// 		filterJSON : function (json) {
	// 			var jsonret = [], i;
	// 			for (i in json) {
	// 				var item = json[i];
	// 				if (item.hasOwnProperty('type')) {
	// 					var adr = {
	// 						address : item.display_name,
	// 						boundingbox : item.boundingbox,
	// 						latlng : L.latLng(item.lat, item.lon),
	// 						type : item.type
	// 					}
	// 				}

	// 				// push
	// 				jsonret.push(adr);
	// 			}
				
	// 			var all = _.unique(jsonret, function (j) {
	// 				if (j) return j.address;
	// 			});

	// 			return all;
	// 		}
	// 	});

	// 	// add to map
	// 	this.geolocationControl.addTo(this._map);
	// },

	// disableGeolocation : function () {
	// 	if (!this.geolocationControl) return;
	       	
	// 	// remove and delete control
	// 	this._map.removeControl(this.geolocationControl);
	// 	this.geolocationControl = null;
	// 	delete this.geolocationControl;
	// },

	// enableMeasure : function () {
	// 	if (this._scale) return;

	// 	this._scale = L.control.measure({'position' : 'topright'});
	// 	this._scale.addTo(this._map);
	// },

	// disableMeasure : function () {
	// 	if (!this._scale) return;

	// 	this._map.removeControl(this._scale);
	// 	this._scale = null;
	// 	delete this._scale;
	// },

	// enableDescription : function () {
	// 	if (this.descriptionControl) return;

	// 	// create control
	// 	this.descriptionControl = L.control.description({
	// 		position : 'topleft'
	// 	});

	// 	// add to map
	// 	this.descriptionControl.addTo(this._map);

	// 	// update control with project
	// 	this.descriptionControl.update();
	// },

	// disableDescription : function () {
	// 	if (!this.descriptionControl) return;
	       
	// 	// remove and delete control
	// 	this._map.removeControl(this.descriptionControl);
	// 	this.descriptionControl = null;
	// 	delete this.descriptionControl;
	// },

	// enableInspect : function () {
	// 	if (this.inspectControl) return;

	// 	// create control
	// 	this.inspectControl = L.control.inspect({
	// 		position : 'bottomright'
	// 	});

	// 	// add to map
	// 	this.inspectControl.addTo(this._map);

	// 	// update control with project
	// 	this.inspectControl.update();
	// },

	// disableInspect : function () {
	// 	if (!this.inspectControl) return;
	       
	// 	// remove and delete control
	// 	this._map.removeControl(this.inspectControl);
	// 	this.inspectControl = null;
	// 	delete this.inspectControl;
	// },

	// enableCartocss : function () {
	// 	if (this.cartoCss) return;

	// 	// dont allow for non-editors
	// 	if (!app.access.to.edit_project(this._project)) return;

	// 	// create control
	// 	this.cartoCss = L.control.cartoCss({
	// 		position : 'topleft'
	// 	});

	// 	// add to map
	// 	this.cartoCss.addTo(this._map);

	// 	// update with latest
	// 	if (app.activeProject) this.cartoCss.update();

	// 	return this.cartoCss;
	// },

	// disableCartocss : function () {
	// 	if (!this.cartoCss) return;

	// 	this._map.removeControl(this.cartoCss);
	// 	this.cartoCss = null;
	// 	delete this.cartoCss;
	// },

	// enableLayermenu : function () {      
	// 	if (this.layerMenu) return;

	// 	// add control
	// 	this.layerMenu = L.control.layermenu({
	// 		position : 'bottomright'
	// 	});

	// 	// add to map
	// 	this.layerMenu.addTo(this._map);
		
	// 	// update control (to fill layermenu from project)
	// 	this.layerMenu.update();

	// 	return this.layerMenu;
	// },

	// disableLayermenu : function () {
	// 	if (!this.layerMenu) return;
	       
	// 	// remove and delete control
	// 	this._map.removeControl(this.layerMenu);
	// 	this.layerMenu = null;
	// 	delete this.layerMenu;
	// },

	// enableBaselayertoggle : function () {
	// 	if (this.baselayerToggle) return;

	// 	// create control
	// 	this.baselayerToggle = L.control.baselayerToggle();

	// 	// add to map
	// 	this.baselayerToggle.addTo(this._map);

	// 	// update
	// 	this.baselayerToggle.update();

	// 	return this.baselayerToggle;
	// },

	// disableBaselayertoggle : function () {
	// 	if (!this.baselayerToggle) return

	// 	this._map.removeControl(this.baselayerToggle);
	// 	this.baselayerToggle = null;
	// 	delete this.baselayerToggle;
	// },
	
	// enableVectorstyle : function (container) {
	// 	// if (this.vectorStyle) return;
		
	// 	// this.vectorStyle = L.control.styleEditor({ 
	// 	// 	position: "topleft", 
	// 	// 	container : container
	// 	// });
		
	// 	// this._map.addControl(this.vectorStyle);
	// },

	// disableVectorstyle : function () {
	// 	// if (!this.vectorStyle) return;

	// 	// // remove vectorstyle control
	// 	// this._map.removeControl(this.vectorStyle);             // todo: doesnt clean up after itself!
	// 	// delete this.vectorStyle;   
	// },

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



	// ***************************************************************
	// * C3 POP-UP C3 POP-UP C3 POP-UP C3 POP-UP C3 POP-UP C3 POP-UP *
	// * C3 POP-UP C3 POP-UP C3 POP-UP C3 POP-UP C3 POP-UP C3 POP-UP *
	// * C3 POP-UP C3 POP-UP C3 POP-UP C3 POP-UP C3 POP-UP C3 POP-UP *
	// ***************************************************************


	// Create pop-up from draw
	_addPopupContentDraw : function (data) {
		this._addPopupContent(false, data)		
	},

	// Create pop-up
	_addPopupContent : function (e, multiPopUp) {

		var options = {
			e 		: e,
			multiPopUp 	: multiPopUp,
		};

		this._chart = new Wu.Control.Chart(options);

	},

	_clearPopup : function () {
		if (this._chart) {
			this._chart._clearPopup();
		}
	},

	
});