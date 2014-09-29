Wu.Layer = Wu.Class.extend({

	type : 'layer',

	initialize : function (layer) {

		// set source
		this.store = layer; // db object
		
		// data not loaded
		this.loaded = false;

		// create leaflet layers
		this.initLayer();
	},

	initLayer : function () {
		// create Leaflet layer, load data if necessary
	},

	enable : function () {
		this.addTo();
	},

	disable : function () {
		this.remove();
	},

	setOpacity : function (opacity) {
		this.opacity = opacity || 1;
		this.layer.setOpacity(this.opacity);
	},

	setZIndex : function (zIndex) {
		this.zIndex = zIndex || 1;
		this.layer.setZIndex(this.zIndex);
	},

	getOpacity : function () {
		return this.opacity || 1;
	},

	getContainer : function () {
		return this.layer.getContainer();
	},

	getTitle : function () {
		return this.store.title;
	},

	hide : function () {
		var container = this.getContainer();
		container.style.visibility = 'hidden';
	},

	show : function () {
		var container = this.getContainer();
		container.style.visibility = 'visible';
	},

	// save updates to layer (like description)
	save : function (field) {
		console.log('Layer.save()', field);

		var json = {};
		json[field] = this.store[field];
		json.layer  = this.store.uuid;
		json.uuid   = app.activeProject.store.uuid; // project uuid
		var string  = JSON.stringify(json);
		
		console.log('svaestring: ', string);

		Wu.save('/api/layer/update', string);
	}

});





Wu.GeojsonLayer = Wu.Layer.extend({

	type : 'geojsonLayer',


	initLayer : function () {
		var that = this;
	       
		// create leaflet geoJson layer
		this.layer = L.geoJson(false, {
			onEachFeature : this.hoverTooltip
		});

		// this.layer = L.geoJson();
		
	},

	add : function (map) {
		this.addTo(map);
	},

	addTo : function (map) {
		var map   = map || Wu.app._map;
		var layer = this.layer;
		
		// load data if not loaded
		if (!this.loaded) this.loadData();
				
		// leaflet fn, add to map		
		layer.addTo(map);  

		// set tooltip
		this.bindHoverTooltip();

		// var drawControl = Wu.app.MapPane._drawControlLayer;
		// // add to map or drawControl
		// if (drawControl) {
		// 	drawControl.addLayer(layer);
		// } else {
		// 	layer.addTo(map);  // leaflet fn
		// }
	},

	remove : function (map) {
		var map = map || Wu.app._map;
		var layer = this.layer;
		// var drawControl = Wu.app.MapPane._drawControlLayer;
		
		// remove from map
		map.removeLayer(layer);
		// this.loaded = false;


		// if (drawControl) {
		// 	drawControl.removeLayer(layer);
		// } else {
		// 	map.removeLayer(layer);  // leaflet fn
		// }

	},

	loadData : function () {
		var that = this;

		// do nothing if already loaded
		if (this.loaded) return; 

		// get geojson from server
		var data = { 'uuid' : this.store.data.geojson }
		var json = JSON.stringify(data);
	
		
		// post with callback:   path       data    callback   context of cb
		// Wu.Util.postcb('/api/geojson', json, this._loaded, this);
		var path = '/api/geojson';
		
		var http = new XMLHttpRequest();
		var url = window.location.origin; //"http://85.10.202.87:8080/";// + path;//api/project/update";
		url += path;

		// track progress
		http.addEventListener("progress", function (oe) {
			console.log('progress: ', oe);
		}, false);
		
		http.open("POST", url, true);

		//Send the proper header information along with the request
		http.setRequestHeader("Content-type", "application/json");

		http.onreadystatechange = function() {
			if (http.readyState == 4 && http.status == 200) {
				that.dataLoaded(that, http.responseText);
			}
		}
		http.send(json);

	},

	// callback after loading geojson from server
	dataLoaded : function (that, json) {
	
		// parse json into geojson object
		that.data = JSON.parse(json);
		
		// add data to layer
		that.layer.addData(that.data);

		// mark loaded
		that.loaded = true;

		// set opacity
		this.setOpacity()

	},

	progress : function (p) {

		// show progress
		var bar = Wu.app.SidePane.DataLibrary.progress;
		var perc = p.loaded / p.total * 100;
		bar.style.opacity = 1;
		bar.style.width = perc + '%';
	},

	setZIndex : function (zIndex) {

		console.log('L.geoJSON this: ', this);

		// set zIndex for now or later
		this.zIndex = zIndex || 1;

		// return if not yet loaded
		if (!this.loaded) return;

		// set style 
		// this.layer.setZIndex(zIndex);	// todo: doesn't really work. the overlay pane itself must be zIndex'd, but all geoJSON layers are in same pane.



		// if (zIndex > 3)  {
		// 	console.log('BRING TO FRONT!')
		// 	this.layer.bringToFront();	// layer.bringToFront() works relative to other geoJSON layers, but not tileLayers.
		// } else {
		// 	console.log('SEND TO BACK!');
		// 	this.layer.bringToBack();
		// 	this.layer.setStyle({
		// 		fillColor: "#ffffff"
		// 	})
		// }

	},

	getContainer : function () {

		// return

	},

	// set visibility : visible on layer
	show : function () {
		for (l in this.layer._layers) {
			var layer = this.layer._layers[l];
			layer._container.style.visibility = 'visible';
		}
	},

	// set visibility : hidden on layer
	hide : function () {
		for (l in this.layer._layers) {
			var layer = this.layer._layers[l];
			layer._container.style.visibility = 'hidden';
		}
	},
	
	setOpacity : function (opacity) {

		// set opacity for now or later
		this.opacity = opacity || this.opacity || 0.5;
		
		// return if data not loaded yet
		if (!this.loaded) return;

		// set style 
		this.layer.setStyle({
			opacity : this.opacity, 
			fillOpacity : this.opacity
		});

	},

	getOpacity : function () {
		return this.opacity || 0.5;
	},

	hoverTooltip : function (feature, layer) {
		
		if (feature.properties) {
			var popstr = '';
			for (key in feature.properties) {
				var value = feature.properties[key];
				
				// if not empty value
				if (value != 'NULL' && value!= 'null' && value != null && value != '' && value != 'undefined') {
					
					// add features to string
					popstr += key + ': ' + value + '<br>';
				
				}
			}

			// create popup
			var popup = L.popup({
				offset : [0, -5],
				closeButton : false,
				zoomAnimation : false
			})
			.setContent(popstr);

			// bind popup to layer
			layer.bindPopup(popup);

			
		}

	},

	setPopupPosition : function (e) {
		var popup = e.layer._popup;
		var latlng = app._map.mouseEventToLatLng(e.originalEvent);
		popup.setLatLng(latlng);
	},

	bindHoverTooltip : function () {
		var that = this;


		// mousemove on layer
		this.layer.on('mousemove', function (e) {
			var popup = e.layer._popup;
			var latlng = app._map.mouseEventToLatLng(e.originalEvent);

			Wu.DomEvent.stop(e);
	
			// first time open
			if (!popup._isOpen) {
									// todo: BUGGY!!!
				// open popup
				e.layer.openPopup(latlng);
				popup._isOpen = true;

				// add event to avoid bs when hovering over tooltip itself
				Wu.DomEvent.on(popup._container, 'mousemove', function (f) {
					that.setPopupPosition(e); 
				}, that);
			
			} else {
				// set position of popup
				// popup.setLatLng(e.latlng);
				that.setPopupPosition(e);
			}
			

		});

		// mouseout on layer
		this.layer.on('mouseout', function (e) {

			var target = e.originalEvent.toElement;//.className;

			if (!target) {
				if (e.layer) {
					e.layer.closePopup();	
					e.layer._popup._isOpen = false;
				}

				return;
			}

			// if touching tooltip itself, don't close
			if (target.className == 'leaflet-popup-tip-container') return;

			// close
			e.layer.closePopup();
			e.layer._popup._isOpen = false;
		});


	}

	



});

Wu.RasterLayer = Wu.Layer.extend({

	type : 'rasterLayer',

});

Wu.MapboxLayer = Wu.Layer.extend({

	type : 'mapboxLayer',
	
	initLayer : function () {
		
		// create Leaflet.mapbox tileLayer
		this.layer = L.mapbox.tileLayer(this.store.data.mapbox);

		// create gridLayer if available
		if ('grids' in this.store) this.gridLayer = L.mapbox.gridLayer(this.store.data.mapbox);

		this.loaded = true;
		
	},

	add : function (map) {
		this.addTo(map);
	},

	addTo : function (map) {
		var map = map || Wu.app._map;

		// leaflet fn
		this.layer.addTo(map);

		// add gridLayer if available
		if (this.gridLayer) this.gridLayer.addTo(map);

	},

	remove : function (map) {
		var map = map || Wu.app._map;

		// leaflet fn
		map.removeLayer(this.layer);

		// remove gridLayer if available
		if (this.gridLayer) map.removeLayer(this.gridLayer);   
	},


});


Wu.CartodbLayer = Wu.Layer.extend({

});

// shorthand for creating all kinds of layers
Wu.createLayer = function (layer) {

	// mapbox
	if (layer.data.mapbox) return new Wu.MapboxLayer(layer);

	// geojson
	if (layer.data.geojson) return new Wu.GeojsonLayer(layer);
	

	// raster
	if (layer.data.raster) {
		// todo
	}
}