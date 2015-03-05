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

		// all visible tiles loaded event (for phantomJS)
		Wu.DomEvent.on(this.layer, 'load', function () {
			app._loaded.push(this.getUuid());
			app._loaded = _.uniq(app._loaded);
		}, this);
		Wu.DomEvent.on(this.layer, 'loading', function () {
			app._loading.push(this.getUuid());
			app._loading = _.uniq(app._loading);
		}, this);

		// get zIndex control
		this._zx = app.MapPane.getZIndexControls();
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
		this._addToLayermenu();
	},

	_addToLayermenu : function () {

		// activate in layermenu
		var layerMenu = app.MapPane.layerMenu;
		layerMenu && layerMenu._enableLayer(this.getUuid());
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
		// var isEditor = app.Account.isSuperadmin() || app.Account.canUpdateProject(app.activeProject.getUuid());
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
		    // token 	= app.accessToken,
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
		    gridServer 	= app.options.servers.utfgrid.uri,
		    subdomains  = app.options.servers.utfgrid.subdomains,
		    // token 	= app.accessToken,
		    token 	= '?token=' + app.Account.getToken(),
		    url 	= gridServer + '{fileUuid}/{z}/{x}/{y}.grid.json' + token;
		
		// create gridlayer
		this.gridLayer = new L.UtfGrid(url, {
			useJsonP: false,
			subdomains: subdomains,
			maxRequests : 20,
			requestTimeout : 20000,
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
		    // token 	= app.accessToken,
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
		    // token 	= app.accessToken,
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
