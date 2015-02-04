Wu.Layer = Wu.Class.extend({

	type : 'layer',

	options : {

		hoverTooltip : true,	// hover instead of click

	},

	initialize : function (layer) {

		// set source
		this.store = layer; // db object
		
		// data not loaded
		this.loaded = false;

		// create leaflet layers
		this.initLayer();

		// all visible tiles loaded event
		Wu.DomEvent.on(this.layer, 'load', function () {
			app._loaded.push(this.getUuid());
			app._loaded = _.uniq(app._loaded);
		}, this);

		// get zIndex control
		this._zx = app.getZIndexControls();
	},

	initLayer : function () {
		// create Leaflet layer, load data if necessary
	},

	add : function (type) {
		if (type == 'baselayer') this._isBase = true;
		this.addTo();
	},

	addTo : function () {
		
		// add to map
		this._addTo();
		
		// add to controls
		this.addToControls();

	},

	_addTo : function (type) {
		var map = app._map;

		// leaflet fn
		this.layer.addTo(map);

		// add to active layers
		app.MapPane.addActiveLayer(this);	// includes baselayers

		// add gridLayer if available
		if (this.gridLayer) map.addLayer(this.gridLayer);

		// update zindex
		this._addToZIndex(type);

	},

	addToControls : function () {
		if (this._isBase) return;

		this._addToLegends();
		this._addToInspect();
		this._addToDescription();
	},

	_addToLegends : function () {

		// add legends if active
		var legendsControl = app.MapPane.legendsControl;
		legendsControl && legendsControl.addLegend(this);
	},

	_addToInspect : function () {

		// add to inspectControl if available
		var inspectControl = app.MapPane.inspectControl;		
		if (inspectControl) inspectControl.addLayer(this);

	},

	_addToDescription : function () {

		// add to descriptionControl if available
		var descriptionControl = app.MapPane.descriptionControl;
		if (!descriptionControl) return;

		descriptionControl.setLayer(this);

		// hide if empty and not editor
		var isEditor = app.Account.isSuperadmin() || app.Account.canUpdateProject(app.activeProject.getUuid());
		if (this.store.description || isEditor) { // todo: what if only editor 
			descriptionControl.show();
		} else { 								// refactor to descriptionControl
			descriptionControl.hide();
		}
		
	},

	leafletEvent : function (event, fn) {
		this.layer.on(event, fn);
	},

	_addToZIndex : function (type) {
		if (type == 'baselayer') this._isBase = true;
		var zx = this._zx;
		this._isBase ? zx.b.add(this) : zx.l.add(this); // either base or layermenu
	},

	_removeFromZIndex : function () {
		var zx = this._zx;
		this._isBase ? zx.b.remove(this) : zx.l.remove(this);
	},

	remove : function (map) {
		var map = map || app._map;

		// leaflet fn
		map.removeLayer(this.layer);

		// remove from active layers
		app.MapPane.removeActiveLayer(this);	

		// remove gridLayer if available
		if (this.gridLayer) map.removeLayer(this.gridLayer); 

		// remove from zIndex
		this._removeFromZIndex();

		// remove from inspectControl if available
		var inspectControl = app.MapPane.inspectControl;			// refactor to events
		if (inspectControl) inspectControl.removeLayer(this);

		// remove from legendsControl if available
		var legendsControl = app.MapPane.legendsControl;
		if (legendsControl) legendsControl.removeLegend(this);

		// remove from descriptionControl if avaialbe
		var descriptionControl = app.MapPane.descriptionControl;
		if (descriptionControl) {
			descriptionControl.removeLayer(this);
			descriptionControl._container.style.display = 'none'; // (j)		// refactor to descriptionControl
		}
	},

	getActiveLayers : function () {
		return this._activeLayers;
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

	getOpacity : function () {
		return this.opacity || 1;
	},

	getContainer : function () {
		return this.layer.getContainer();
	},

	getTitle : function () {
		return this.store.title;
	},

	setTitle : function (title) {
		this.store.title = title;
		this.save('title');
	},

	getUuid : function () {
		return this.store.uuid;
	},

	getFileUuid : function () {
		return this.store.file;
	},

	getProjectUuid : function () {
		return app.activeProject.store.uuid;
	},

	setCartoid : function (cartoid) {
		this.store.data.cartoid = cartoid;
		this.save('data');
	},

	getCartoid : function () {
		if (this.store.data) return this.store.data.cartoid;
		return false;
	},

	setCartoCSS : function (json, callback) {

		// send to server
		Wu.post('/api/layers/cartocss/set', JSON.stringify(json), callback, this);
	
		// set locally on layer
		this.setCartoid(json.cartoid);
	},

	getCartoCSS : function (cartoid, callback) {

		console.log('getCartoCSS', cartoid);

		var json = {
			cartoid : cartoid
		}

		// get cartocss from server
		console.log('POST /api/layers/cartocss/get', json);
		Wu.post('/api/layers/cartocss/get', JSON.stringify(json), callback, this);
	},

	getMeta : function () {
		var metajson = this.store.metadata;
		if (metajson) return JSON.parse(metajson);
		return false;
	},

	getMetaFields : function () {
		var meta = this.getMeta();
		if (!meta) return false;
		if (!meta.json) return false;
		if (!meta.json.vector_layers) return false;
		if (!meta.json.vector_layers[0]) return false;
		if (!meta.json.vector_layers[0].fields) return false;
		return meta.json.vector_layers[0].fields;
	},

	reloadMeta : function (callback) {

		var json = JSON.stringify({
			fileUuid : this.getFileUuid(),
			layerUuid : this.getUuid()
		});

		Wu.post('/api/layer/reloadmeta', json, callback || function (ctx, json) {

		}, this);

	},

	getTooltip : function () {
		var json = this.store.tooltip;
		if (!json) return false;
		var meta = JSON.parse(json);
		return meta;
	},

	setTooltip : function (meta) {
		this.store.tooltip = JSON.stringify(meta);
		this.save('tooltip');
	},

	getLegends : function () {
		var meta = this.store.legends
		if (meta) return JSON.parse(meta);
		return false;
	},

	getActiveLegends : function () {
		var legends = this.getLegends();
		var active = _.filter(legends, function (l) {
			return l.on;
		});
		return active;
	},

	setLegends : function (legends) {
		if (!legends) return;
		this.store.legends = JSON.stringify(legends);
		this.save('legends');
	},

	createLegends : function (callback) {

		// get layer feature values for this layer
		var json = JSON.stringify({
			fileUuid : this.getFileUuid(),
			cartoid : this.getCartoid()
		});

		Wu.post('/api/layer/createlegends', json, callback, this)
	},


	getFeaturesValues : function (callback, ctx) {
		if (!callback || !ctx) return console.error('must provide callback() and context');

		// get layer feature values for this layer
		var json = JSON.stringify({
			fileUuid : this.getFileUuid(),
			cartoid : this.getCartoid()
		});

		Wu.post('/api/util/getfeaturesvalues', json, callback.bind(ctx), this)
	},


	hide : function () {
		var container = this.getContainer();
		container.style.visibility = 'hidden';
	},

	show : function () {
		var container = this.getContainer();
		container.style.visibility = 'visible';
	},

	// save updates to layer (like description, style)
	save : function (field) {
		var json = {};
		json[field] = this.store[field];
		json.layer  = this.store.uuid;
		json.uuid   = app.activeProject.getUuid(); // project uuid

		this._save(json);
	},

	_save : function (json) {
		var string  = JSON.stringify(json);
		Wu.save('/api/layer/update', string);
	},

	_setZIndex : function (z) {
		this.layer.setZIndex(z);
	},
	

	_addGridEvents : function () {
		var grid = this.gridLayer;
		if (!grid) return;

		
		// add click event
		grid.on('mousedown', function(e) {
			if (!e.data) return;

			// pass layer
			e.layer = this;

			// add to pending
			app.MapPane._addPopupContent(e);

			var event = e.e.originalEvent;
			this._event = {
				x : event.x,
				y : event.y
			}

		}, this);

		grid.on('mouseup', function (e) {
			if (!e.data) return;

			// pass layer
			e.layer = this;

			var event = e.e.originalEvent;

			if (this._event === undefined || this._event.x == event.x) {
				// open popup 
				app.MapPane.openPopup(e);
			} else {
				// clear old
				app.MapPane._clearPopup();
			}

		}, this);

		grid.on('click', function (e) {

			// clear old
			app.MapPane._clearPopup();

		}, this);
	},
});




Wu.RasterLayer = Wu.Layer.extend({

	type : 'rasterLayer',

});


// systemapic layers
Wu.CartoCSSLayer = Wu.Layer.extend({

	initLayer : function () {
		this.update();
	},

	update : function () {
		var map = app._map;

		// remove
		if (this.layer) this.remove();

		this._fileUuid = this.store.file;
		this._defaultCartoid = 'cartoid';

		// prepare raster
		this._prepareRaster();

		// prepare utfgrid
		this._prepareGrid();
		
	},

	_prepareRaster : function () {
		
		// set ids
		var fileUuid 	= this._fileUuid,	// file id of geojson
		    cartoid 	= this.store.data.cartoid || this._defaultCartoid,
		    tileServer 	= app.options.servers.tiles.uri,
		    subdomains  = app.options.servers.tiles.subdomains,
		    token 	= app.accessToken,
		    url 	= tileServer + '{fileUuid}/{cartoid}/{z}/{x}/{y}.png' + token;

		// add vector tile raster layer
		this.layer = L.tileLayer(url, {
			fileUuid: this._fileUuid,
			cartoid : cartoid,
			subdomains : subdomains,
			maxRequests : 0,
		});
	},

	_prepareGrid : function () {

		// set ids
		var fileUuid 	= this._fileUuid,	// file id of geojson
		    cartoid 	= this.store.data.cartoid || 'cartoid',
		    gridServer 	= app.options.servers.utfgrid.uri,
		    subdomains  = app.options.servers.utfgrid.subdomains,
		    token 	= app.accessToken,
		    url 	= gridServer + fileUuid + '/{z}/{x}/{y}.grid.json' + token;
		
		// create gridlayer
		// this.gridLayer = new L.UtfGrid(url, {
		// 	useJsonP: false,
		// 	subdomains: 'ijk',
		// 	subdomains: subdomains
		// 	// subdomains: 'ghi',
		// 	maxRequests : 10,
		// 	requestTimeout : 20000
		// });

		// debug
		this.gridLayer = false;

		// add grid events
		this._addGridEvents();

	},

	updateStyle : function () {
		var map = app._map;	
		
		// update
		this.update();

		// add to map
		this.addTo(map); // refactor

	},

	_typeLayer : function () {

	},

});




Wu.OSMLayer = Wu.CartoCSSLayer.extend({


	update : function () {
		var map = app._map;

		// remove
		if (this.layer) this.remove();

		// id of data 
		this._fileUuid = 'osm';
		this._defaultCartoid = 'cartoidosm';

		// prepare raster
		this._prepareRaster();

		// prepare utfgrid
		this._prepareGrid();
		
	},

	_prepareRaster : function () {
		
		// set ids
		var fileUuid 	= this._fileUuid,	// file id of geojson
		    cartoid 	= this.store.data.cartoid || this._defaultCartoid,
		    tileServer 	= app.options.servers.osm.uri,
		    subdomains  = app.options.servers.osm.subdomains,
		    token 	= app.accessToken,
		    url 	= tileServer + '{fileUuid}/{cartoid}/{z}/{x}/{y}.png' + token;

		// add vector tile raster layer
		this.layer = L.tileLayer(url, {
			fileUuid: this._fileUuid,
			cartoid : cartoid,
			subdomains : subdomains,
			maxRequests : 0,
		});
	},

	_prepareGrid : function () {

		// set ids
		var fileUuid 	= this._fileUuid,	// file id of geojson
		    cartoid 	= this.store.data.cartoid || 'cartoid',
		    gridServer 	= app.options.servers.osm.uri,
		    subdomains  = app.options.servers.osm.subdomains,
		    token 	= app.accessToken,
		    url 	= gridServer + fileUuid + '/{z}/{x}/{y}.grid.json' + token;
		
		// create gridlayer
		// this.gridLayer = new L.UtfGrid(url, {
		// 	useJsonP: false,
		// 	subdomains: subdomains,
		// 	// subdomains: 'ijk',
		// 	// subdomains: 'ghi',
		// 	maxRequests : 10,
		// 	requestTimeout : 20000
		// });

		// debug
		this.gridLayer = false;

		// add grid events
		this._addGridEvents();

	},

	getFileUuid : function () {
		return 'osm';
	},

});


Wu.MapboxLayer = Wu.Layer.extend({

	type : 'mapboxLayer',
	
	initLayer : function () {

		// create Leaflet.mapbox tileLayer
		this.layer = L.mapbox.tileLayer(this.store.data.mapbox, {
			accessToken : this.store.accessToken
		});

		// create gridLayer if available
		if ('grids' in this.store) this.gridLayer = L.mapbox.gridLayer(this.store.data.mapbox);

		// mark as loaded
		this.loaded = true;
	},
});


Wu.CartodbLayer = Wu.Layer.extend({

});


// shorthand for creating all kinds of layers
Wu.createLayer = function (layer) {

	// mapbox
	if (layer.data.mapbox) return new Wu.MapboxLayer(layer);

	// systemapic vector tiles todo: store not as geojson, but as vector tiles in project db model?
	if (layer.data.geojson) return new Wu.CartoCSSLayer(layer);
	
	// osm
	if (layer.data.osm) return new Wu.OSMLayer(layer);

	// topojson
	if (layer.data.topojson) return new Wu.TopojsonLayer(layer);
}



















































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

		// remove hooks
		this.removeLayerHooks();

	},

	addLayerHooks : function () {

		this.layer.eachLayer(function (layr) {
			
			var type = layr.feature.geometry.type;

			if (type == 'Polygon') {

				Wu.DomEvent.on(layr, 'styleeditor:changed', this.styleChanged, this);

			} 

			if (type == 'MultiPolygon') {

				layr.eachLayer(function (multi) {

					Wu.DomEvent.on(multi, 'styleeditor:changed', function (data) {
						this.multiStyleChanged(data, multi, layr);
					}, this);

				}, this);
			}

		}, this);	
	
	},	

	removeLayerHooks : function () {
		for (l in this.layer._layers) {
			var layer = this.layer._layers[l];

			// listen to changes
			Wu.DomEvent.off(layer, 'styleeditor:changed', this.styleChanged, this);
		}
	},

	getGeojsonUuid : function () {
		return this.store.data.geojson;
	},

	loadData : function () {
		var that = this;

		// do nothing if already loaded
		if (this.loaded) return; 

		// set status
		app.setStatus('Loading...');


		// get geojson from server
		var data = { 
			uuid : this.getGeojsonUuid(),
			projectUuid : app.activeProject.getUuid() 
		}
		var json = JSON.stringify(data);
	
		
		// post with callback:   path       data    callback   context of cb
		// Wu.Util.postcb('/api/geojson', json, this._loaded, this);
		var path = '/api/geojson';
		
		var http = new XMLHttpRequest();
		var url = window.location.origin; //"http://85.10.202.87:8080/";// + path;//api/project/update";
		url += path;

		// track progress
		var dataSize = this.getDataSize();
		if (dataSize) {
			var that = this;
			http.addEventListener("progress", function (oe) {
				var percent = Math.round( oe.loaded / dataSize * 100);
				that.setProgress(percent);

			}, false);
		}
		
		http.open("POST", url, true);

		//Send the proper header information along with the request
		http.setRequestHeader("Content-type", "application/json");

		http.onreadystatechange = function() {
			if (http.readyState == 4 && http.status == 200) {			// todo: refactor
				that.dataLoaded(that, http.responseText);
			}
		}
		http.send(json);

	},

	// callback after loading geojson from server
	dataLoaded : function (that, json) {

		// set progress done
		that.setProgress(100);

		// parse json into geojson object
		try { that.data = JSON.parse(json); }
		catch (e) { return console.log('parse error!', json)}
		
		// console.log('Got geojson: ', that.data);

		// return if errors
		if (!that.data) return console.error('no data');
		if (that.data.error) return console.error(that.data.error);

		// add data to layer
		that.layer.addData(that.data);

		// mark loaded
		that.loaded = true;

		// set opacity
		that.setOpacity()

		// render saved styles of geojson
		that.renderStyle();

		// set status
		app.setStatus('Loaded!');

		// hide progress bar
		this.hideProgress();

		// add layer hooks
		this.addLayerHooks();

		// phantomjs _loaded
		app._loaded.push(this.getUuid());
		// console.log('GEOJSON: ', this);

	},

	getDataSize : function () {

		var fileUuid = this.getFileUuid();
		if (!fileUuid) return false;

		var file = this.getFile(fileUuid);

		return parseInt(file.dataSize);

	},

	getFileUuid : function () {
		return this.store.file;
	},

	getFile : function (fileUuid) {

		var files = app.activeProject.getFiles();
		var file = _.find(files, function (f) {
			return f.uuid == fileUuid;
		});

		return file;

	},

	progress : function (p) {
		this.setProgress(p);
	},

	setProgress : function (percent) {
		// set progress bar
		app.ProgressBar.setProgress(percent);
	},

	hideProgress : function () {
		// hide progress bar
		app.ProgressBar.hideProgress();
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

	multiStyleChanged : function (data, multi, layr) {

		var layer = layr;
		var style = data.style;
		var __sid = layer.feature.properties.__sid;

		layer.setStyle(style);	// good! does the whole multipolgyon (of multipolygons)

		this.saveStyle(style, __sid);	// works

	},

	styleChanged : function (data) {

		var style = data.style;
		var target = data.target;
		var id = target._leaflet_id;
		var layer = this.getPathParentLayer(id);
		var __sid = target.feature.properties.__sid;

		// save style
		this.saveStyle(style, __sid);

	},

	getPathParentLayer : function (id) {
		return app.MapPane.getEditableLayerParent(id);
	},

	// save style to layer object
	saveStyle : function (style, __sid) {	
			
		var json = this.layer.toGeoJSON();

		var json = {};
		json.layer  = this.getUuid();
		json.uuid   = this.getProjectUuid(); // active project uuid

		json.style = {
			__sid : __sid,
			style : style 		// partial
		}

		// send to server
		this._save(json);

		// set staus msg
		app.setSaveStatus();

	},

	renderStyle : function () {

		var styles = this.store.style;
		var layers = this.layer._layers;

		for (l in layers) {
			var layer = layers[l];
			var __sid = layer.feature.properties.__sid;

			var style = _.find(styles, function (s) {
				return s.__sid == __sid;
			});

			if (style) {
				var parsed = JSON.parse(style.style);
				layer.setStyle(parsed);
			}
		}

	},
	
	setOpacity : function (opacity) {

		// set opacity for now or later
		this.opacity = opacity || this.opacity || 0.2;
		
		// return if data not loaded yet
		if (!this.loaded) return;

		// set style 
		this.layer.setStyle({
			opacity : this.opacity, 
			fillOpacity : this.opacity
		});

	},

	getOpacity : function () {
		return this.opacity || 0.2;
	},


	// create tooltip
	createPopup : function (feature, layer) {

		// return if no features in geojson
		if (!feature.properties) return;

		// create popup
		var popup = L.popup({
			offset : [0, -5],
			closeButton : false,
			zoomAnimation : false,
			maxWidth : 1000,
			minWidth : 200,
			maxHeight : 150
		});

		// create content
		var string = '';
		for (key in feature.properties) {
			var value = feature.properties[key];
			// if not empty value
			if (value != 'NULL' && value!= 'null' && value != null && value != '' && value != 'undefined' && key != '__sid') {
				// add features to string
				string += key + ': ' + value + '<br>';
			}
		}

		// if nothing, return
		if (string.length == 0) return;

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



// topojson layer
Wu.TopojsonLayer = Wu.Layer.extend({

	type : 'topojsonLayer',

	initLayer : function () {
		var that = this;
	       
		// create leaflet geoJson layer
		this.layer = L.topoJson(false, {
			// create popup
			onEachFeature : this.createPopup
		});

	}	
});

// extend leaflet geojson with topojson conversion (test) - works! but doesn't solve any problems
L.TopoJSON = L.GeoJSON.extend({
	addData: function(jsonData) {    
		if (jsonData.type === "Topology") {
			for (key in jsonData.objects) {
				geojson = topojson.feature(jsonData, jsonData.objects[key]);
				L.GeoJSON.prototype.addData.call(this, geojson);
			}
		} 
		else {
			L.GeoJSON.prototype.addData.call(this, jsonData);
		}
	}  
});

L.topoJson = function (json, options) {
	return new L.TopoJSON(json, options);
};


// // topojson layer with d3.js
// L.TopojsonLayer = L.Class.extend({

// 	initialize: function (data, options) {
		
// 		L.setOptions(this, options);
// 	},

// 	onAdd: function (map) {
// 		this._map = map;

// 		// create a DOM element and put it into one of the map panes
// 		this._el = L.DomUtil.create('div', 'topojson-layer leaflet-zoom-hide');
// 		map.getPanes().overlayPane.appendChild(this._el);

// 		// add a viewreset event listener for updating layer's position, do the latter
// 		map.on('viewreset', this._reset, this);
// 		this._reset();
// 	},

// 	onRemove: function (map) {
// 		// remove layer's DOM elements and listeners
// 		map.getPanes().overlayPane.removeChild(this._el);
// 		map.off('viewreset', this._reset, this);
// 	},

// 	_reset: function () {
// 		// update layer's position
// 		var pos = this._map.latLngToLayerPoint(this._latlng);
// 		L.DomUtil.setPosition(this._el, pos);
// 	}
// });

// L.topoJson = function (data, options) {
// 	return new L.TopojsonLayer(data, options);
// };


