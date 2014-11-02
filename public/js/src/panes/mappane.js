Wu.MapPane = Wu.Class.extend({

	initialize : function () {
		this._initContainer();
		this._initPanes();
		return this; 
	},      

	_initContainer : function () {
		
		// init container
		this._container = Wu.app._mapPane = Wu.DomUtil.createId('div', 'map', Wu.app._mapContainer);
	
		// events
		Wu.DomEvent.on(window, 'resize', this._updateWidth, this); 
	
		// add help pseudo
		Wu.DomUtil.addClass(this._container, 'click-to-start');
	},

	_initPanes : function () {

	},

    
	_updateWidth : function () {

		var map = this._map;
		if (!map) return;
		
		// set width
		map._container.style.width = parseInt(window.innerWidth) - parseInt(map._container.offsetLeft) + 'px';
		
		// refresh map size
		setTimeout(function() {
			if (map) map.reframe();
		}, 300); // time with css
	},
	
	setProject : function (project) {
		this.project = project;
		this.reset();
		this.update(project);
	},


	clearBaseLayers : function () {
		var map = this._map;

		if (!this.baseLayers) return;
		
		this.baseLayers.forEach(function (base) {
			map.removeLayer(base.layer);
		});

		this.baseLayers = {};
	},

	setBaseLayers : function () { 
		var map = this._map;

		// clear
		this.clearBaseLayers();

		// set baseLayers stored in project
		var baseLayers = this.project.getBaselayers();

		// return if empty
		if (!baseLayers) return;

		// add
		baseLayers.forEach(function (layer) {
			this.addBaseLayer(layer);
		}, this);
	},


	addBaseLayer : function (baseLayer) {
		
		// Wu.Layer
		var layer = this.project.layers[baseLayer.uuid];
		if (layer) {
			layer.add();
			layer.setOpacity(baseLayer.opacity);
		}

	},

	removeBaseLayer : function (layer) {
		map.removeLayer(base.layer);
	},

	_setLeft : function (width) {  
		this._container.style.left = width + 'px';
		this._container.style.width = parseInt(window.innerWidth) - width + 'px';
	},

	_update : function (project) {
		this.update(project);
	},

	update : function (project) {
		
		this.project = project;

		// set base layers
		this.setBaseLayers();

		// set bounds
		this.setMaxBounds();

		// set position
		this.setPosition();

		// set header padding
		this.setHeaderPadding();

		// update controls
		// this.updateControls();

		// set controls css logic
		this.updateControlCss();
		
	},

	setHeaderPadding : function () {
		// set padding
		var map = this._map;
		var control = map._controlContainer;
		control.style.paddingTop = this.project.getHeaderHeight() + 'px';
	},


	setPosition : function (position) {
		var map = this._map;
		
		// get position
		var pos = position || this.project.getLatLngZoom();
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

	getActiveLayers : function () {
		if (!this.layerMenu) return false;

		var layers = this.layerMenu.getLayers();
		var active = _.filter(layers, function (l) {
			return l.on;
		});

		return active;

	},


	setMaxBounds : function () {
		var map = app._map;
		var bounds = this.project.getBounds();

		if (!bounds) return;

		var southWest = L.latLng(bounds.southWest.lat, bounds.southWest.lng);
   		var northEast = L.latLng(bounds.northEast.lat, bounds.northEast.lng);
    		var maxBounds = L.latLngBounds(southWest, northEast);

    		// set maxBoudns
		map.setMaxBounds(maxBounds);
		map.options.minZoom = bounds.minZoom;
		map.options.maxZoom = bounds.maxZoom;
	},
	

	_reset : function () {
		this.reset();
	},

	createNewMap : function () {

		var options = {
			worldCopyJump : true
		}

		// create new map
		this._map = Wu.app._map = L.map('map', options).setView([0, 0], 5);

		// add editable layer
		this.addEditableLayer(this._map);

		// add attribution
		// if (this._attributionControl) this._map.removeControl(this._attributionControl);
		this._attributionControl = L.control.attribution({
				position : 'bottomleft',
				prefix : 'Powered by <a href="https://systemapic.com/" target="_blank">Systemapic</a>'
		});


		this._map.addControl(this._attributionControl);

	},


	addEditableLayer : function (map) {
		// create layer
		this.editableLayers = new L.FeatureGroup();
		map.addLayer(this.editableLayers);
	},

	reset : function () {

		// flush current map
		var map = this._map;
		if (map) {
			

			// remove each layer
			map.eachLayer(function(layer) {
				map.removeLayer(layer);
			});

			// remove map
			map.remove();

		}

		// create new map
		this.createNewMap();

		// width hack
		this._updateWidth();

		// remove controls
		this.resetControls();

		// remove hanging zoom
		this.disableZoom();             // weird ta

	},

	updateControlCss : function () {


		var thus = this;

		setTimeout(function(){

			// console.log('_____________ updateControlCss ___________________________________');
		
			var controls = thus.project.getControls();

			// console.log("Active conttrollers:")
			// console.log(controls);
			// console.log("====================")


			if ( controls.baselayertoggle ) {
				// console.log('Baselayer Toggle Control');
			}

			// DESCRIPTION CONTROL
			// DESCRIPTION CONTROL
			// DESCRIPTION CONTROL

			var _leafletTopLeft = app.MapPane._map._controlContainer.childNodes[0];

			if ( controls.description ) {
				// console.log('Description Control');
			} else {				
			}

			if ( controls.draw ) {
				// console.log('Draw Control');
			}

			if ( controls.geolocation ) {
				// console.log('Geolocation Control');
			}

			if ( controls.inspect ) {
				// console.log('Inspect Layers Control');
			}


			// LAYER MENU CONTROL
			// LAYER MENU CONTROL
			// LAYER MENU CONTROL

			if ( controls.layermenu ) {
				// console.log('Layer Menu Control');
				
				var _leafletBottomRight = app.MapPane._map._controlContainer.childNodes[3];				

				// Check for Layer Inspector
				if ( controls.inspect ) {
					Wu.DomUtil.removeClass(_leafletBottomRight, 'no-inspector');
				} else {
					Wu.DomUtil.addClass(_leafletBottomRight, 'no-inspector');
				}

			}

			
			// LEGENDS CONTROL
			// LEGENDS CONTROL
			// LEGENDS CONTROL

			if ( controls.legends ) {
				// console.log('Legends Control');
				
				console.log('thus', thus);
				console.log('controls.legends', controls.legends);

				var __legendsContainer = thus.legendsControl._legendsContainer;

				// Check for Layer Manu Control
				if ( controls.layermenu ) {
					Wu.DomUtil.removeClass(__legendsContainer, 'legends-padding-right');
				} else {
					Wu.DomUtil.addClass(__legendsContainer, 'legends-padding-right');
				}

				// Check for Description Control
				if ( controls.description ) {
				} else {
				}

			}


			// SCALE CONTROL
			// SCALE CONTROL
			// SCALE CONTROL

			if ( controls.measure ) {
				// console.log('Scale Control', thus._scale._container);
				var _leafletTopRight = app.MapPane._map._controlContainer.childNodes[1];

				if ( controls.layermenu ) {
					// right: 332px;
					_leafletTopRight.style.right = '295px';
				} else {
					_leafletTopRight.style.right = '6px';
					// right: 6px;
				}

				if ( controls.legends ) {
					// _leafletTopRight.style.bottom = '133px';
					// bottom: 113px;
				} else {
					// _leafletTopRight.style.bottom = '6px';
					// bottom: 6px;
				}


			}

			if ( controls.mouseposition ) {
				// console.log('Mouse Position');
			}

			if ( controls.vectorstyle ) {
				// console.log('Vector Styling Control');
			}

			if ( controls.zoom ) {
				// console.log('Zoom Control');
			}

			
			// console.log('_____________ updateControlCss ___________________________________');

		}, 50)
	},


	resetControls : function () {

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

		// remove carto
		if (this.cartoCss) this.cartoCss.destroy();
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
		var map = this._map;
		if (noDrag) map.dragging.disable();
		map.touchZoom.disable();
		map.doubleClickZoom.disable();
		map.scrollWheelZoom.disable();
		map.boxZoom.disable();
		map.keyboard.disable();
	},

	enableInteraction : function (noDrag) {
		var map = this._map;
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
		delete this.mousepositionControl;
	},

	enableGeolocation : function () {
		if (this.geolocationControl) return;

		// create controls // todo: no info on type of place (city, neighbourhood, street), so not possible to set good zoom level
		this.geolocationControl = new L.Control.Search({
			url : 'https://nominatim.openstreetmap.org/search?format=json&q={s}',
			jsonpParam : 'json_callback',
			propertyName : 'display_name',
			propertyLoc : ['lat','lon'],	
			boundingBox : 'boundingbox',

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
	       	
	       	console.log('disableGeolocation', this.geolocationControl);

		// remove and delete control
		this._map.removeControl(this.geolocationControl);
		delete this.geolocationControl;
		
	},

	enableMeasure : function () {
		if (this._scale) return;

		this._scale = L.control.scale({'position' : 'topright'});
		this._scale.addTo(this._map);
	},

	disableMeasure : function () {
		if (!this._scale) return;

		this._map.removeControl(this._scale);
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

	enableCartocss : function () {

		if (this.cartoCss) return;
	
		// create control
		this.cartoCss = L.control.cartoCss({
			position : 'topleft'
		});

		// add to map
		this.cartoCss.addTo(this._map);

		// update with latest
		this.cartoCss.update();

		return this.cartoCss;
	},

	disableCartocss : function () {

		if (!this.cartoCss) return;

		this._map.removeControl(this.cartoCss);
		delete this.cartoCss;
	},

	disableInspect : function () {
		if (!this.inspectControl) return;
	       
		// remove and delete control
		this._map.removeControl(this.inspectControl);
		delete this.inspectControl;
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


	enableDraw : function () {
		if (this._drawControl) return;
		
		// add draw control
		this.addDrawControl();
	},

	disableDraw : function () {
		if (!this._drawControl || this._drawControl === 'undefined') return;

		// disable draw control
		this.removeDrawControl();
	},

	removeDrawControl : function () {
		if (!this._drawControl || this._drawControl === 'undefined') return;

		// remove draw control
		this._map.removeControl(this._drawControl);
		// this._map.removeLayer(this.editableLayers);	//todo
		this._drawControl = false;

		// remove vector styling
		this.disableVectorstyle();
	},

	addDrawControl : function () {
		var that = this,
		    map = this._map,
		    editableLayers = this.editableLayers;

		// Leaflet.Draw options
		options = {
			position: 'topleft',
			edit: {
				// editable layers
				featureGroup: editableLayers
			},
			draw: {
				circle: {
					shapeOptions: {
						fill: true,
						color: '#FFF',
						fillOpacity: 0.3,
						// fillColor: '#FFF'
					}
				},
				rectangle: { 
					shapeOptions: {
						fill: true,
						color: '#FFF',
						fillOpacity: 0.3,
						fillColor: '#FFF'
					}
				},
				polygon: { 
					shapeOptions: {
						fill: true,
						color: '#FFF',
						fillOpacity: 0.3,
						fillColor: '#FFF'
					}
				},
				polyline: { 
					shapeOptions: {
						fill: false,
						color: '#FFF'

					}
				}       
			}
		};

		// add drawControl
		var drawControl = this._drawControl = new L.Control.Draw(options);

		console.log('Add Draw Control');
		console.log('OBS! Make sure that this ALWAYS loads at the bottom of the toolbar list! #askKnut')

		map.addControl(drawControl);

		
		// add class
		var container = drawControl._container;
		L.DomUtil.addClass(container, 'elizaveta');	// todo: className

		// close popups on hover
		Wu.DomEvent.on(drawControl, 'mousemove', L.DomEvent.stop, this);
		Wu.DomEvent.on(drawControl, 'mouseover', map.closePopup, this);


		var that = this;

		// add circle support
		map.on('draw:created', function(e) {

			// add circle support
			e.layer.layerType = e.layerType;            

			// if editMode
			if (that.project.editMode) {

				// create layer and add to project
				var geojson = e.layer.toGeoJSON();
				that.project.createLayerFromGeoJSON(geojson);
				
			} else {

				// add drawn layer to map
				editableLayers.addLayer(e.layer);

			}
		});

		// created note
		map.on('draw:note:created', function(e) {

			// add layers
			editableLayers.addLayer(e.noteLayer);
			editableLayers.addLayer(e.rectangleLayer);

			// enable edit toolbar and focus Note
			L.Draw._editshortcut.enable();		// todo, refactor
			e.noteLayer._el.focus();
			map.LeafletDrawEditEnabled = true;
		});

		// add vector styling control
		this.enableVectorstyle(drawControl._wrapper);

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
						var cunt = shit[o];
						if (o == id) return shit;
					}
				}
			}
		}
		return false;
	},
	
});


