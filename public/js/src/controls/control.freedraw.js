Wu.Tool = Wu.Class.extend({});
Wu.Tool.FreeDraw = Wu.Tool.extend({

	options : {

		// map : [map object],

	},

	initialize : function (options) {

		this.options = options;

		// create freedraw instance

		this._map = options.map;

		this._freeDraw = L.freeDraw({
			mode : L.FreeDraw.MODES.CREATE  | L.FreeDraw.MODES.EDIT | L.FreeDraw.MODES.APPEND

		});

		// set options
		this._freeDraw.options.setHullAlgorithm(false);
		this._freeDraw.options.setSmoothFactor(0);
		// this._freeDraw.options.disableStopPropagation();
		this._freeDraw.handlePolygonClick = this._polygonClick.bind(this);

		// set shortcut key
		this._shortkeys();

		return this;
	},

	_shortkeys : function () {

		// set keyboard shortcut
		keymaster('d', this.toggle.bind(this));

	},

	toggle : function () {
		console.log('you pressed d!', this);

		this._on ? this.deactivate() : this.activate();
	},

	activate : function () {

		this._on = true;

		// add to map
		this._map.addLayer(this._freeDraw);

		// add events
		this._addEvents();

		// set create mode
		this._freeDraw.setMode(L.FreeDraw.MODES.CREATE);

		// set connected layer
		this._layer = app.MapPane._layermenuZIndex._index[0];

	},

	deactivate : function () {

		this._on = false;

		// remove from map
		this._map.removeLayer(this._freeDraw);

		// add events
		this._removeEvents();

		// set view mode
		this._freeDraw.setMode(L.FreeDraw.MODES.VIEW);

		// set connected layer
		this._layer = null;

	},


	_addEvents : function () {
		this._freeDraw.on('polygon', this._createdPolygon, this);

		this._freeDraw.on('markers', function getMarkers(eventData) {
			var latLngs = eventData.latLngs;
			// ...
			console.log('freedraw markers', latLngs);
		});
	},
	_removeEvents : function () {
		this._freeDraw.off('polygon', this._createdPolygon, this);
	},

	_createdPolygon : function (layer) {
		console.log('added layer 2442', layer);

		app.MapPane._creatingPolygon = true;

		var geojson = layer.polygon.toGeoJSON();

		// this._startWaitingFlash(layer.polygon);

		// fetch data
		this._fetchData({
			geojson : geojson,
			layer : layer
		}, function (err, results) {
			var resultObject = Wu.parse(results);

			console.log('fetched results: ', resultObject);

			// add center
			resultObject.center = layer.polygon.getBounds().getCenter();

			// add to popup
			app.MapPane._addPopupContentDraw(resultObject);

			app.MapPane._creatingPolygon = false;

			this._latestFetch = resultObject;

			// this._stopWaitingFlash(layer.polygon);

		}.bind(this));

	},

	

	_polygonClick : function (polygon, event) {
		console.log('_polygonClick', polygon, event, this);

		var e = event.originalEvent;
		Wu.DomEvent.stop(e);

		// add to popup
		app.MapPane._addPopupContentDraw(this._latestFetch);
	},

	_fetchData : function (options, callback) {
		console.log('fetchData', options);

		var layer_id = this._getActiveLayerID();

		if (!layer_id) return console.error('no active layer_id to fetch data from??');

		var options = {
			access_token : app.tokens.access_token,
			geojson : options.geojson,
			layer_id : layer_id
		}

		console.log('options!', options);

		Wu.send('/api/db/fetchArea', options, callback, this);
	},
	
	// _startWaitingFlash : function (polygon) {

	// 	this._flashCounter = 0;

	// 	this._flashTimer = setInterval(function () {
	// 		console.log('FLASHFLASH!!', polygon);
			
	// 		if (this._flashCounter == 0) {
	// 			console.log('0');
	// 			// polygon._container.style.opacity = 0;
	// 			polygon.setStyle({
	// 				fillColor : 'blue'
	// 			})
	// 			polygon.redraw();
	// 			this._flashCounter = 1;
	// 		} else {
	// 			console.log('1');
	// 			polygon.setStyle({
	// 				fillColor : 'yellow'
	// 			})
	// 			this._flashCounter = 0;
	// 		}

	// 	}.bind(this), 300);

	// },

	// _stopWaitingFlash : function (polygon) {
	// 	console.log('STOPO FLASHFLASH!!', polygon);
	// 	clearInterval(this._flashTimer);
	// },

	_getActiveLayerID : function () {
		var layer = app.MapPane._layermenuZIndex._index[0];

		if (!layer || !layer.store || !layer.store.data || !layer.store.data.postgis) return false;

		var layer_id = layer.store.data.postgis.layer_id;

		return layer_id;
	},

});













