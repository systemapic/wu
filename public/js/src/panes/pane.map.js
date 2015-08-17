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


	// enableDraw : function () {
	// 	console.log('enableBraw', this._drawControl);
	// 	if (this._drawControl) return;
		
	// 	// add draw control
	// 	this.addDrawControl();
	// },

	// disableDraw : function () {
	// 	console.log('disableBraw', this._drawControl);
	// 	if (!this._drawControl || this._drawControl === 'undefined') return;

	// 	// disable draw control
	// 	this.removeDrawControl();
	// },

	// removeDrawControl : function () {
	// 	if (!this._drawControl || this._drawControl === 'undefined') return;

	// 	// remove draw control
	// 	this._map.removeControl(this._drawControl);

	// 	// this._map.removeLayer(this.editableLayers);	//todo
	// 	this._drawControl = false;

	// 	// remove vector styling
	// 	this.disableVectorstyle();
	// },

	// addDrawControl : function () {
	// 	var that = this,
	// 	    map = this._map,
	// 	    editableLayers = this.editableLayers;

	// 	var options = {
	// 		draw : {

	// 		},

	// 		edit : {

	// 		}
	// 	}

	// 	console.log('add draw control!');

	// 	// add drawControl
	// 	var drawControl = this._drawControl = new L.Control.Draw(options);

	// 	console.log('drawControl--->', drawControl)

	// 	// add to map
	// 	map.addControl(drawControl);

	// 	// close popups on hover, stop clickthrough
	// 	Wu.DomEvent.on(drawControl, 'mousemove', L.DomEvent.stop, this);
	// 	Wu.DomEvent.on(drawControl, 'mouseover', map.closePopup, this);
	// 	Wu.DomEvent.on(container,   'mousedown mouseup click', L.DomEvent.stopPropagation, this);



	// 	// // Leaflet.Draw options
	// 	// options = {
	// 	// 	position: 'topleft',
	// 	// 	// edit: {
	// 	// 	// 	// editable layers
	// 	// 	// 	featureGroup: editableLayers
	// 	// 	// },
	// 	// 	draw: {
	// 	// 		circle: {
	// 	// 			shapeOptions: {
	// 	// 				fill: true,
	// 	// 				color: '#FFF',
	// 	// 				fillOpacity: 0.3,
	// 	// 				// fillColor: '#FFF'
	// 	// 			}
	// 	// 		},
	// 	// 		rectangle: { 
	// 	// 			shapeOptions: {
	// 	// 				fill: true,
	// 	// 				color: '#FFF',
	// 	// 				fillOpacity: 0.3,
	// 	// 				fillColor: '#FFF'
	// 	// 			}
	// 	// 		},
	// 	// 		polygon: { 
	// 	// 			shapeOptions: {
	// 	// 				fill: true,
	// 	// 				color: '#FFF',
	// 	// 				fillOpacity: 0.3,
	// 	// 				fillColor: '#FFF'
	// 	// 			},
	// 	// 			showArea : true
					
	// 	// 		},
	// 	// 		polyline: { 
	// 	// 			shapeOptions: {
	// 	// 				fill: false,
	// 	// 				color: '#FFF'

	// 	// 			},
	// 	// 			showArea : true
	// 	// 		}       
	// 	// 	}
	// 	// };

	// 	// // add drawControl
	// 	// var drawControl = this._drawControl = new L.Control.Draw(options);

	// 	// // add to map
	// 	// map.addControl(drawControl);

	// 	// // add class
	// 	// var container = drawControl._container;
	// 	// L.DomUtil.addClass(container, 'elizaveta');	// todo: className

	// 	// // close popups on hover, stop clickthrough
	// 	// Wu.DomEvent.on(drawControl, 'mousemove', L.DomEvent.stop, this);
	// 	// Wu.DomEvent.on(drawControl, 'mouseover', map.closePopup, this);
	// 	// Wu.DomEvent.on(container,   'mousedown mouseup click', L.DomEvent.stopPropagation, this);


	// 	// // add circle support
	// 	// map.on('draw:created', function(e) {

	// 	// 	// add circle support
	// 	// 	e.layer.layerType = e.layerType;            

	// 	// 	// add to map
	// 	// 	app._map.addLayer(e.layer);

	// 	// });

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


	_addPopupContent : function (e) {

		// if d3tooltip setting on, get d3 instead of normal text
		// var d3tooltip = true; // this is the toggle, TODO: connect setting!
		
		var d3popup = this._project.getSettings()['d3popup'];
		var d3popup = false;
		console.log('current d3 setting', d3popup);

		var content = d3popup ? this._createPopupContentD3(e) : this._createPopupContent(e);

		var buffer = '<hr>';

		// clear old popup
		this._popup = null;

		console.log('pop 2');

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


	_createPopupContentD3 : function (e) {

		console.log('opipupcontent', e);

		// check for stored tooltip
		var data = e.data,
		    layer = e.layer,
		    meta = layer.getTooltip(),
		    string = '',
		    d3array = [];

		// already stored tooltip (edited, etc.)
		if (meta) {

			// add meta to tooltip
			for (var m in meta.fields) {
				var field = meta.fields[m];

				// only add active tooltips
				if (field.on) {

					// get key/value
					var caption = field.title || field.key;
					var value = data[field.key];

					var d3obj = [];
					d3obj[0] = field.key;
					d3obj[1] = parseFloat(value);

					d3array.push(d3obj);
				}
			}

		// first time use of meta.. (or something)
		} else {

			for (var key in data) {
				var value = data[key];

				var d3obj = [];
				d3obj[0] = key
				d3obj[1] = parseFloat(value);

				d3array.push(d3obj);
			}

		}


		// must return finsihed html, so make somthing of d3array here..
		// ... 
		var html = this._createD3chart(d3array);
		return html;

	},

	_createD3chart : function (d3array) {

		var that = this;

		// Standards
		var boxX = 5;
		var boxY = 15;
		var boxWidth = 345;
		var boxHeight = 150;
		var bpadding = 0;
		var xInterval = (boxWidth - 8) / d3array.length+1;


		// Function to draw line
		var lineFunction = d3.svg.line()
			.x(function(d) { return d.x })
			.y(function(d) { return d.y })
			.interpolate('linear');

		// Get max and min values from array
		var mmax = d3array.sort(function(a,b){return b[1]-a[1];})[0][1];
		var mmin = d3array.sort(function(a,b){return a[1]-b[1];})[0][1];		

		// Set range/scale
		var graphScale = d3.scale.linear()
			.domain([mmin, mmax])
			.range([(boxHeight),0]);


		


		// Holds all the points
		var lineData = []; 

		// Make x/y coordinates
		d3array.forEach(function(d3arr, i) { 
			var _x = boxX + (xInterval*i) + bpadding/2;
			var _y = boxY + graphScale(d3arr[1]);
			var point = { "x": _x,   "y": _y }; 
			lineData.push(point);   
		});



		// CONTAINERS
		var d3Container  = Wu.DomUtil.create('div');

 		var svgContainer = d3.select(d3Container).append("svg")
                                     .attr("width", boxWidth + 50)
                                     .attr("height", boxHeight + 85);




		// Vertical helper lines
		// Vertical helper lines
		// Vertical helper lines			

		// Vertical helper lines
		var verticalHelpersGrop = svgContainer.append('g');
		var verticalHelpers = verticalHelpersGrop.selectAll('line')
			.data(lineData)
			.enter()
				.append('line')
				.attr('x1', function(d) { return d.x })
				.attr('y1', boxY)
				.attr('x2', function(d) { return d.x })
				.attr('y2', boxHeight + boxY)
				.attr('stroke', 'rgba(255,255,255,0.2)')
				.attr('stroke-width', 0.5);




		
		// LINE LINE LINE
		// LINE LINE LINE
		// LINE LINE LINE



		// Graph Box
		var GraphBox = svgContainer
			.append("rect")
			.attr("x", boxX)
			.attr("y", boxY)
			.attr('rx', 0)
			.attr("width", boxWidth)
			.attr("height", boxHeight)
			.attr('stroke', 'rgba(255,255,255,0.7)')
			.attr('stroke-width', 1)	
			.attr("fill", "transparent");

		// Line Container
		var GraphBoxG = svgContainer.append('g');

		// Create Line
		var graphLine = GraphBoxG
			.append('path')
			.attr('d', lineFunction(lineData))			
			.attr('stroke', 'white')
			.attr('stroke-width', 1)
			.attr('fill', 'none');



		// TEXT TEXT TEXT
		// TEXT TEXT TEXT
		// TEXT TEXT TEXT				

		// Texts
		var graphCircles = svgContainer.append('g');
		var eachCircle = graphCircles.selectAll('text')
			.data(lineData)
			.enter()
				.append('text')
				.attr('font-family', 'helvetica')
				.attr('font-size', 11)				
				.attr('x', function(d) { return d.x })
				.attr('y', function(d) { 
					return boxHeight + boxY + 6;
				})
				.attr('transform', function (d, i) {
					var xx = d.x - 5;
					var yy = boxHeight + boxY + 5;
					var trans = 'rotate(75 ' + xx + ' ' + yy + ')';
					return trans;
				})			
				.attr('fill', 'white')
				.text(function(d, i) {

					var ddate = d3array[i][0].substring(0,4);
					    ddate += '.';
					    ddate += d3array[i][0].substring(4,6);
					    ddate += '.';
					    ddate += d3array[i][0].substring(6,8);					    
					return ddate;
				});



		// TEXT ON TOP WHEN HOVERING
		// TEXT ON TOP WHEN HOVERING
		// TEXT ON TOP WHEN HOVERING			

		// Texts
		var topText = svgContainer
				.append('text')
				.attr('font-family', 'helvetica')
				.attr('font-size', 11)
				.attr('fill', 'white')
				.attr('x', boxX)
				.attr('y', boxY - 5)
				.text(function(d) { return 'YEAR.MONTH.DAY = VALUE'; });


		// RIGHT AXIS 
		// RIGHT AXIS 
		// RIGHT AXIS 				

		// Axis -- RIGHT
		var graphAxisScale = d3.svg.axis()
			.scale(graphScale)
			.orient("right")
			.ticks(10)
			.tickSize(-boxWidth, -boxWidth, -boxWidth);

		var graphAxis = GraphBoxG
			.append('g')
			.attr('transform', function() { return 'translate(' + (boxWidth+boxX) + ',' + boxY + ')'; })
			.attr("class", "axis")
			.call(graphAxisScale);




		// DOTS DOTS DOTS
		// DOTS DOTS DOTS
		// DOTS DOTS DOTS				

		// Circles
		var dottRadius = 3;

		var graphCircles = svgContainer.append('g');
		var eachCircle = graphCircles.selectAll('circle')
			.data(lineData)
			.enter()
				.append('circle')
				.attr('cx', function(d) { return d.x })
				.attr('cy', function(d) { return d.y })
				.attr('r', dottRadius)
				.attr('fill', 'white')
				.attr('style', 'cursor: pointer;')
				.on('mouseover', function(d) {
					console.log('hovering!', d);
				});




		var returnThis = new XMLSerializer().serializeToString(d3Container);
		return returnThis;


	},





	// _createPopupContentChart : function (e) {

	// 	// create canvas
	// 	var canvas = document.createElement('canvas');
	// 	canvas.id     = "chart-canvas";
	// 	canvas.width  = 1224;
	// 	canvas.height = 768;
	// 	canvas.style.zIndex   = 8;
	// 	canvas.style.position = "absolute";
	// 	canvas.style.border   = "1px solid";


	// 	var ctx = canvas.getContext('2d');

	// 	var data = e.data;
		

	// 	var options = {

	// 	    ///Boolean - Whether grid lines are shown across the chart
	// 	    scaleShowGridLines : true,

	// 	    //String - Colour of the grid lines
	// 	    scaleGridLineColor : "rgba(0,0,0,.05)",

	// 	    //Number - Width of the grid lines
	// 	    scaleGridLineWidth : 1,

	// 	    //Boolean - Whether to show horizontal lines (except X axis)
	// 	    scaleShowHorizontalLines: true,

	// 	    //Boolean - Whether to show vertical lines (except Y axis)
	// 	    scaleShowVerticalLines: true,

	// 	    //Boolean - Whether the line is curved between points
	// 	    bezierCurve : true,

	// 	    //Number - Tension of the bezier curve between points
	// 	    bezierCurveTension : 0.4,

	// 	    //Boolean - Whether to show a dot for each point
	// 	    pointDot : true,

	// 	    //Number - Radius of each point dot in pixels
	// 	    pointDotRadius : 4,

	// 	    //Number - Pixel width of point dot stroke
	// 	    pointDotStrokeWidth : 1,

	// 	    //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
	// 	    pointHitDetectionRadius : 20,

	// 	    //Boolean - Whether to show a stroke for datasets
	// 	    datasetStroke : true,

	// 	    //Number - Pixel width of dataset stroke
	// 	    datasetStrokeWidth : 2,

	// 	    //Boolean - Whether to fill the dataset with a colour
	// 	    datasetFill : true,

	// 	    //String - A legend template
	// 	    legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"

	// 	};


	// 	var labels = [],
	// 	    dataArray = [];

	// 	for (var d in data) {
	// 		labels.push(d);
	// 		dataArray.push(data[d])
	// 	}


	// 	var chartData = {
	// 	    labels:labels,
	// 	    datasets: [
	// 	        {
	// 	            label: "My First dataset",
	// 	            fillColor: "rgba(220,220,220,0.2)",
	// 	            strokeColor: "rgba(220,220,220,1)",
	// 	            pointColor: "rgba(220,220,220,1)",
	// 	            pointStrokeColor: "#fff",
	// 	            pointHighlightFill: "#fff",
	// 	            pointHighlightStroke: "rgba(220,220,220,1)",
	// 	            data: dataArray
	// 	        },
	// 	        {
	// 	            label: "My Second dataset",
	// 	            fillColor: "rgba(151,187,205,0.2)",
	// 	            strokeColor: "rgba(151,187,205,1)",
	// 	            pointColor: "rgba(151,187,205,1)",
	// 	            pointStrokeColor: "#fff",
	// 	            pointHighlightFill: "#fff",
	// 	            pointHighlightStroke: "rgba(151,187,205,1)",
	// 	            data: [28, 48, 40, 19, 86, 27, 90]
	// 	        }
	// 	    ]
	// 	};

	// 	var content = new Chart(ctx).Line(data, options);

	// 	console.log('content: ', content);

	// 	// // if d3tooltip setting on, get d3 instead of normal text
	// 	// var d3tooltip = false; // this is the toggle, TODO: connect setting!
		
	// 	// var d3popup = this._project.getSettings()['d3popup'];
	// 	// console.log('current d3 setting', d3popup);

	// 	// var content = d3popup ? this._createPopupContentD3(e) : this._createPopupContent(e);
	// 	// var buffer = '<hr>';

	// 	// clear old popup
	// 	this._popup = null;

	// 	// return if no content
	// 	if (!content) return;
		
	// 	if (!this._popupContent) {
	// 		// create empty
	// 		this._popupContent = '';
	// 	} else {
	// 		// append buffer
	// 		this._popupContent += buffer;
	// 	}

	// 	// append content
	// 	this._popupContent += content;

	// },


	

	_createPopupContent : function (e) {

		console.log('opipupcontent', e);

		// check for stored tooltip
		var data = e.data,
		    layer = e.layer,
		    meta = layer.getTooltip(),
		    string = '';

		var d3array = [];

		if (meta) {
			console.log('got meta 1');
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
			console.log('no meta 2');
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






	
});


