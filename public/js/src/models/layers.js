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
		
		Wu.save('/api/layer/update', string);
	}

});





Wu.GeojsonLayer = Wu.Layer.extend({

	type : 'geojsonLayer',


	initLayer : function () {
		var that = this;
	       
		// create leaflet geoJson layer
		this.layer = L.geoJson(false, {

			// create popup
			onEachFeature : this.createPopup
		});
		
	},

	add : function (map) {
		this.addTo(map);
	},

	addTo : function (map) {
		var map   = map || Wu.app._map;
		var layer = this.layer;
		
		// load data if not loaded
		if (!this.loaded) this.loadData();
				
		// set hover popup
		this.bindHoverPopup();

		// add to drawControl
		var drawControl = app.MapPane.editableLayers;
		drawControl.addLayer(layer);

	},

	remove : function (map) {
		var map = map || Wu.app._map;
		var layer = this.layer;
		
		// remove from editableLayers 
		var editableLayers = app.MapPane.editableLayers;
		editableLayers.removeLayer(layer);

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
		that.setOpacity()

	},

	progress : function (p) {

		// show progress
		var bar = Wu.app.SidePane.DataLibrary.progress;
		var perc = p.loaded / p.total * 100;
		bar.style.opacity = 1;
		bar.style.width = perc + '%';
	},

	setZIndex : function (zIndex) {

		// set zIndex for now or later
		this.zIndex = zIndex || 1;

		// return if not yet loaded
		if (!this.loaded) return;

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


	// create tooltip
	createPopup : function (feature, layer) {
		
		// return if no features in geojson
		if (!feature.properties) return;

		// create popup
		var popup = L.popup({
			offset : [0, -5],
			closeButton : false,
			zoomAnimation : false
		});

		// create content
		var string = '';
		for (key in feature.properties) {
			var value = feature.properties[key];
			// if not empty value
			if (value != 'NULL' && value!= 'null' && value != null && value != '' && value != 'undefined') {
				// add features to string
				string += key + ': ' + value + '<br>';
			}
		}

		// set content
		popup.setContent(string);
		
		// bind popup to layer
		layer.bindPopup(popup);
		
	},


	setPopupPosition : function (e) {
		var popup = e.layer._popup;
		var latlng = app._map.mouseEventToLatLng(e.originalEvent);
		popup.setLatLng(latlng);
	},

	bindHoverPopup : function () {
		var that = this;



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