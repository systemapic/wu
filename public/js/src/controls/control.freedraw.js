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
			mode : L.FreeDraw.MODES.CREATE,
		});

		// set options
		this._freeDraw.options.setHullAlgorithm(false);
		// this._freeDraw.options.setSmoothFactor(1);

		// set shortcut key
		this._shortkeys();

		return this;
	},

	_shortkeys : function () {

		// set keyboard shortcut
		key('d', this.toggle.bind(this));

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

		console.log('ADDEVENTS!@!!!');

		this._freeDraw.on('polygon', function (layer) { 			// todo: refactor! 
			console.log('added layer', layer);

			var geojson = layer.polygon.toGeoJSON();

			console.log('geo: ', geojson);


			// fetch data
			this._fetchData({
				geojson : geojson
			}, function (err, results) {

				var resultObject = Wu.parse(results);

				console.log('fetched results: ', resultObject);
				console.log('all points: ', resultObject.all);
				console.log('average: ', resultObject.average);

			});

		}.bind(this));


	},

	_removeEvents : function () {


		this._freeDraw.off('polygon', function (layer) {
			console.log('added layer', layer);
		})

	},

	_fetchData : function (options, callback) {
		console.log('fetchData', options);

		// var keys = Object.keys(e.data);
		// var column = keys[0];
		// var row = e.data[column];
		// var layer_id = e.layer.store.data.postgis.layer_id;

		var options = {
			access_token : app.tokens.access_token,
			geojson : options.geojson,
			layer_id : this._layer.store.data.postgis.layer_id

		}

		console.log('options!', options);

		Wu.send('/api/db/fetchArea', options, callback, this);
	},



		// todo monday: create route, do query, etc.



});













