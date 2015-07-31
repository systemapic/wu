Wu.Layer = Wu.Class.extend({

	type : 'layer',

	options : {
		hoverTooltip : true,	// hover instead of click  todo..
	},

	initialize : function (layer) {

		// set source
		this.store = layer; // db object
		
		// data not loaded
		this.loaded = false;

		console.error('create layer', layer);

	},

	addHooks : function () {
		this._setHooks('on');
	},

	removeHooks : function  () {
		this._setHooks('off');
		this._removeGridEvents();
	},

	_setHooks : function (on) {

		// all visible tiles loaded event (for phantomJS)
		Wu.DomEvent[on](this.layer, 'load', this._onLayerLoaded, this);
		Wu.DomEvent[on](this.layer, 'loading', this._onLayerLoading, this);
	},
	
	_unload : function (e) {
		// delete 
		this.removeHooks();
	},

	_onLayerLoaded : function () {
		app._loaded.push(this.getUuid());
		app._loaded = _.uniq(app._loaded);
	},

	_onLayerLoading : function () {
		app._loading.push(this.getUuid());
		app._loading = _.uniq(app._loading);
	},

	initLayer : function () {

		// create Leaflet layer, load data if necessary
		this._inited = true;
		
		// add hooks
		this.addHooks();
	},

	add : function (type) {

		// mark as base or layermenu layer
		this._isBase = (type == 'baselayer');
		
		// add
		this.addTo();
	},

	addTo : function () {
		if (!this._inited) this.initLayer();

		// add to map
		this._addTo();
		
		// add to controls
		this.addToControls();
	},

	_addTo : function (type) {
		if (!this._inited) this.initLayer();

		var map = app._map;

		// leaflet fn
		map.addLayer(this.layer);

		// add gridLayer if available
		if (this.gridLayer) map.addLayer(this.gridLayer);

		// add to active layers
		app.MapPane.addActiveLayer(this);	// includes baselayers

		// update zindex
		this._addToZIndex(type);

		this._added = true;

	},

	addToControls : function () {

		if (this._isBase) return;

		this._addToLegends();
		this._addToInspect();
		this._addToDescription();
		this._addToLayermenu();
	},

	_addToLayermenu : function () {

		// activate in layermenu
		var layerMenu = app.MapPane.getControls().layermenu;
		layerMenu && layerMenu._enableLayer(this.getUuid());
	},

	_addToLegends : function () {

		// add legends if active
		var legendsControl = app.MapPane.getControls().legends;
		legendsControl && legendsControl.addLegend(this);
	},

	_addToInspect : function () {

		// add to inspectControl if available
		var inspectControl = app.MapPane.getControls().inspect;		
		if (inspectControl) inspectControl.addLayer(this);

	},

	_addToDescription : function () {

		// add to descriptionControl if available
		var descriptionControl = app.MapPane.getControls().description;
		if (!descriptionControl) return;

		descriptionControl.setLayer(this);

		// hide if empty and not editor
		var isEditor = app.access.to.edit_project(app.activeProject);
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
		var zx = this._zx || this._getZX();
		this._isBase ? zx.b.add(this) : zx.l.add(this); // either base or layermenu
	},

	_removeFromZIndex : function () {
		var zx = this._zx || this._getZX();
		this._isBase ? zx.b.remove(this) : zx.l.remove(this);
	},

	_getZX : function () {
		return app.MapPane.getZIndexControls();
	},

	remove : function (map) {
		var map = map || app._map;

		// leaflet fn
		if (map.hasLayer(this.layer)) map.removeLayer(this.layer);

		// remove from active layers
		app.MapPane.removeActiveLayer(this);	

		// remove gridLayer if available
		if (this.gridLayer) {
			this.gridLayer._flush();
			if (map.hasLayer(this.gridLayer)) map.removeLayer(this.gridLayer); 
		}

		// remove from zIndex
		this._removeFromZIndex();

		// remove from inspectControl if available
		var inspectControl = app.MapPane.getControls().inspect;			// refactor to events
		if (inspectControl) inspectControl.removeLayer(this);

		// remove from legendsControl if available
		var legendsControl = app.MapPane.getControls().legends;
		if (legendsControl) legendsControl.removeLegend(this);

		// remove from descriptionControl if avaialbe
		var descriptionControl = app.MapPane.getControls().description;
		if (descriptionControl) {
			descriptionControl.removeLayer(this);
			descriptionControl._container.style.display = 'none'; // (j)		// refactor to descriptionControl
		}

		this._added = false;
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

		this.setLegendsTitle(title);
	},

	getDescription : function () {
		return this.store.description;
	},

	setDescription : function (description) {
		this.store.description = description;
		this.save('description');
	},

	getCopyright : function () {
		return this.store.copyright;
	},

	setCopyright : function (copyright) {
		this.store.copyright = copyright;
		this.save('copyright');
	},

	getUuid : function () {
		return this.store.uuid;
	},

	getFileUuid : function () {
		return this.store.file;
	},

	getAttribution : function () {
		return this.store.attribution;
	},

	getFile : function () {
		var fileUuid = this.getFileUuid();
		var file = _.find(app.Projects, function (p) {
			return p.files[fileUuid];
		});
		if (!file) return false;
		return file.files[fileUuid];
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
	},

	// set postgis styling 
	setLayerStyle : function (options, callback) {

		

	},

	setCartoCSS : function (json, callback) {

		// send to server
		Wu.post('/api/layers/cartocss/set', JSON.stringify(json), callback, this);
	
		// set locally on layer
		this.setCartoid(json.cartoid);
	},

	getCartoCSS : function (cartoid, callback) {

		var json = {
			cartoid : cartoid
		}

		// get cartocss from server
		Wu.post('/api/layers/cartocss/get', JSON.stringify(json), callback, this);
	},

	getMeta : function () {
		var metajson = this.store.metadata;
		if (!metajson) return false;

		var meta = Wu.parse(metajson);
		return meta;
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

	setLegendsTitle : function (title) {
		var legends = Wu.parse(this.store.legends);
		if (!legends[0]) return;
		legends[0].value = title;
		this.setLegends(legends);
	},

	setStyle : function (postgis) {
		this.store.data.postgis = postgis;
		this.save('data');
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
		this._setGridEvents('on');
	},

	_setGridEvents : function (on) {
		var grid = this.gridLayer;
		console.log('grid?', grid, on);
		if (!grid || !on) return;
		grid[on]('mousedown', this._gridOnMousedown, this);
		grid[on]('mouseup', this._gridOnMouseup, this);
		grid[on]('click', this._gridOnClick, this);
	},

	_removeGridEvents : function () {
		this._setGridEvents('off');
	},

	_gridOnMousedown : function(e) {
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

	},

	_gridOnMouseup : function (e) {
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

	},

	_gridOnClick : function (e) {
		// clear old
		app.MapPane._clearPopup();

	},

	_flush : function () {

		this.remove();
		app.MapPane._clearPopup();
		this._removeGridEvents();
		this.layer = null;
		this.gridLayer = null;
		this._inited = false;

	},

});



Wu.PostGISLayer = Wu.Layer.extend({

	initLayer : function () {
		this.update();
		this.addHooks();

		this._inited = true;
	},

	update : function (options) {
		var map = app._map;

		// remove
		if (this.layer) this._flush();

		// prepare raster
		this._prepareRaster();

		console.log('PostGIS layer update()');

		// prepare utfgrid
		this._prepareGrid();

		// enable
		if (options) console.log('OPTIONS ==> ', options);
		if (options && options.enable) {
			map.addLayer(this.layer);
		}
	},

	_getLayerUuid : function () {
		console.log('this', this);
		return this.store.data.postgis.layer_id;
	},

	getCartoCSS : function (cartoid, callback) {
		return this.store.data.postgis.cartocss;
	},


	_prepareRaster : function () {

		// set ids
		var fileUuid 	= this._fileUuid,	// file id of geojson
		    // cartoid 	= this.store.data.cartoid || this._defaultCartoid,
		    // tileServer 	= app.options.servers.tiles.uri,
		    subdomains  = app.options.servers.tiles.subdomains,
		    access_token = '?access_token=' + app.tokens.access_token;
		    // url 	= tileServer + '{fileUuid}/{cartoid}/{z}/{x}/{y}.png' + token;

		var layerUuid = this._getLayerUuid();
		var url = 'https://{s}.systemapic.com/tiles/{layerUuid}/{z}/{x}/{y}.png' + access_token;

		console.log('url', url);

		// add vector tile raster layer
		this.layer = L.tileLayer(url, {
			layerUuid: this._getLayerUuid(),
			subdomains : subdomains,
			maxRequests : 0,
		});

		console.log('loaded layer: ', this.layer);

		// load grid after all pngs.. (dont remember why..)
		// Wu.DomEvent.on(this.layer, 'load', this._updateGrid, this);

	},

	_invalidateTiles : function () {
		console.log('invalidateTIles');
		return;

		// var options = {
		// 	layerUuid : this._getLayerUuid(),
		// 	access_token : app.tokens.access_token, 
		// 	zoom : app._map.getZoom()
		// }

		// console.log('invalidate options', options);

		// Wu.send('/api/db/invalidate', options, function (a, b) {
		// 	console.log('invalidate sent', a, b);
		// }, this);
	},

	_updateGrid : function (l) {

		console.log('_updateGrid', l);

		// refresh of gridlayer is attached to layer. this because vector tiles are not made in vile.js, 
		// and it's much more stable if gridlayer requests tiles after raster layer... perhpas todo: improve this hack!
		// - also, removed listeners in L.UtfGrid (onAdd)
		// 
		if (this.gridLayer) {
			console.log('this.gridLayer._update()');
			this.gridLayer._update();
		}
	},

	_prepareGrid : function () {

		// set ids
		var subdomains  = app.options.servers.tiles.subdomains,
		    access_token = '?access_token=' + app.tokens.access_token;
		
		var layerUuid = this._getLayerUuid();
		var url = 'https://{s}.systemapic.com/tiles/{layerUuid}/{z}/{x}/{y}.grid' + access_token;

		// create gridlayer
		this.gridLayer = new L.UtfGrid(url, {
			useJsonP: false,
			subdomains: subdomains,
			maxRequests : 0,
			requestTimeout : 10000,
			layerUuid : layerUuid
		});

		// debug
		// this.gridLayer = false;

		// add grid events
		this._addGridEvents();

	},


	updateStyle : function () {
		return console.error('updateStyle, remove');
		// set new options and redraw
		if (this.layer) this.layer.setOptions({
			cartoid : this.getCartoid(),
		});
	},


});









// Wu.RasterLayer = Wu.Layer.extend({
// 	type : 'rasterLayer',
// });


// systemapic layers
Wu.CartoCSSLayer = Wu.Layer.extend({

	initLayer : function () {
		this.update();
		this.addHooks();

		this._inited = true;
	},

	update : function () {
		var map = app._map;

		// remove
		if (this.layer) this._flush();

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
		    token 	= '?token=' + app.Account.getToken(),
		    url 	= tileServer + '{fileUuid}/{cartoid}/{z}/{x}/{y}.png' + token;

		// add vector tile raster layer
		this.layer = L.tileLayer(url, {
			fileUuid: this._fileUuid,
			cartoid : cartoid,
			subdomains : subdomains,
			maxRequests : 0,
		});

		Wu.DomEvent.on(this.layer, 'load', this._updateGrid, this);
	},

	_updateGrid : function (l) {



		// refresh of gridlayer is attached to layer. this because vector tiles are not made in vile.js, 
		// and it's much more stable if gridlayer requests tiles after raster layer... perhpas todo: improve this hack!
		// - also, removed listeners in L.UtfGrid (onAdd)
		// 
		if (this.gridLayer) this.gridLayer._update();
	},

	_prepareGrid : function () {

		// set ids
		var fileUuid 	= this._fileUuid,	// file id of geojson
		    cartoid 	= this.store.data.cartoid || 'cartoid',
		    gridServer 	= app.options.servers.utfgrid.uri,
		    subdomains  = app.options.servers.utfgrid.subdomains,
		    // token 	= app.accessToken,
		    token 	= '?token=' + app.Account.getToken(),
		    url 	= gridServer + '{fileUuid}/{z}/{x}/{y}.grid.json' + token;
		
		// create gridlayer
		this.gridLayer = new L.UtfGrid(url, {
			useJsonP: false,
			subdomains: subdomains,
			maxRequests : 0,
			requestTimeout : 10000,
			fileUuid : fileUuid
		});

		// debug
		// this.gridLayer = false;

		// add grid events
		this._addGridEvents();

	},

	updateStyle : function () {
		// set new options and redraw
		if (this.layer) this.layer.setOptions({
			cartoid : this.getCartoid(),
		});
	},

	_typeLayer : function () {

	},

});




Wu.OSMLayer = Wu.CartoCSSLayer.extend({

	update : function () {
		var map = app._map;

		// remove
		if (this.layer) this._flush();

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
		    token 	= '?token=' + app.Account.getToken(),
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
		    token 	= '?token=' + app.Account.getToken(),
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

	setCartoCSS : function (json, callback) {

		// send to server
		Wu.post('/api/layers/cartocss/set', JSON.stringify(json), callback, this);
	
		// set locally on layer
		this.setCartoid(json.cartoid);
	},

	getCartoCSS : function (cartoid, callback) {

		var json = {
			cartoid : cartoid
		}

		// get cartocss from server
		Wu.post('/api/layers/cartocss/get', JSON.stringify(json), callback, this);
	},

	updateStyle : function () {

		// set new options and redraw
		if (this.layer) this.layer.setOptions({
			cartoid : this.getCartoid(),
		});

	},



});


Wu.MapboxLayer = Wu.Layer.extend({

	type : 'mapboxLayer',
	
	initLayer : function () {

		var url = 'https://{s}.tiles.mapbox.com/v4/{mapboxUri}/{z}/{x}/{y}.png?access_token={accessToken}';

		this.layer = L.tileLayer(url, {
			accessToken : this.store.accessToken,
			mapboxUri : this.store.data.mapbox,
		});

		// todo: add gridlayer to mapbox.. but why..?
		// add hooks
		this.addHooks();
		this.loaded = true;
		this._inited = true;
	},
});


Wu.CartodbLayer = Wu.Layer.extend({

});

// Wu.GeoJSONLayer = Wu.Layer.extend({

// 	type : 'geojsonlayer',

// 	initialize : function (geojson) {

// 		this.store = {}; // db model
// 		this.geojson = geojson;

// 		this.loaded = false;
// 	},
	
// 	initLayer : function () {

// 		// var url = 'https://{s}.tiles.mapbox.com/v4/{mapboxUri}/{z}/{x}/{y}.png?access_token={accessToken}';

// 		this.layer = L.geoJson(this.geojson);

// 		// todo: add gridlayer to mapbox.. but why..?
// 		// add hooks
// 		// this.addHooks();
// 		this.loaded = true;
// 		this._inited = true;
// 	},
// });



// systemapic layers
Wu.RasterLayer = Wu.Layer.extend({

	initialize : function (layer) {

		// set source
		this.store = layer; // db object
		
		// data not loaded
		this.loaded = false;

	},


	initLayer : function () {
		this.update();
	},

	update : function () {
		var map = app._map;

		// remove
		// if (this.layer) this.remove();

		this._fileUuid = this.store.file;
		this._defaultCartoid = 'raster';

		// prepare raster
		this._prepareRaster();

		// prepare utfgrid
		// this._prepareGrid();
		
	},


	_prepareRaster : function () {

		// set ids
		var fileUuid 	= this._fileUuid,	// file id of geojson
		    cartoid 	= this.store.data.cartoid || this._defaultCartoid,
		    tileServer 	= app.options.servers.tiles.uri,
		    subdomains  = app.options.servers.tiles.subdomains,
		    token 	= '?token=' + app.Account.getToken(),
		    url 	= tileServer + '{fileUuid}/{cartoid}/{z}/{x}/{y}.png' + token;

		// add vector tile raster layer
		this.layer = L.tileLayer(url, {
			fileUuid: fileUuid,
			cartoid : cartoid,
			subdomains : subdomains,
			maxRequests : 0,
			tms : true
		});

	},

});


// shorthand for creating all kinds of layers
Wu.createLayer = function (layer) {
	if (!layer.data) {
		console.error('no layer - weird:', layer);
		return false;
	}
	// postgis
	if (layer.data.postgis && layer.data.postgis.file_id) {
		return new Wu.PostGISLayer(layer);
	}
	// mapbox
	if (layer.data.mapbox) return new Wu.MapboxLayer(layer);

	// systemapic vector tiles todo: store not as geojson, but as vector tiles in project db model?
	if (layer.data.geojson) return new Wu.CartoCSSLayer(layer);
	
	// osm
	if (layer.data.osm) return new Wu.OSMLayer(layer);

	// topojson
	if (layer.data.topojson) return new Wu.TopojsonLayer(layer);

	// raster
	if (layer.data.raster) return new Wu.RasterLayer(layer);
}










// // topojson layer
// Wu.TopojsonLayer = Wu.Layer.extend({

// 	type : 'topojsonLayer',

// 	initLayer : function () {
// 		var that = this;
	       
// 		// create leaflet geoJson layer
// 		this.layer = L.topoJson(false, {
// 			// create popup
// 			onEachFeature : this.createPopup
// 		});

// 	}	
// });

// // extend leaflet geojson with topojson conversion (test) - works! but doesn't solve any problems
// L.TopoJSON = L.GeoJSON.extend({
// 	addData: function(jsonData) {    
// 		if (jsonData.type === "Topology") {
// 			for (key in jsonData.objects) {
// 				geojson = topojson.feature(jsonData, jsonData.objects[key]);
// 				L.GeoJSON.prototype.addData.call(this, geojson);
// 			}
// 		} 
// 		else {
// 			L.GeoJSON.prototype.addData.call(this, jsonData);
// 		}
// 	}  
// });

// L.topoJson = function (json, options) {
// 	return new L.TopoJSON(json, options);
// };













// update options and redraw
L.TileLayer.include({
	setOptions : function (options) {
		L.setOptions(this, options);
		this.redraw();
	}
});

L.UtfGrid.include({
	setOptions : function (options) {
		L.setOptions(this, options);
		this.redraw();
	}
});
