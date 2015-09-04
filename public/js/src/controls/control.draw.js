L.Control.Draw = Wu.Control.extend({

	options: {
		position: 'topleft',
		draw: {
			polyline : false,
			rectangle : false,
			circle : false,
			marker : false,
			polygon : {
				showArea : true,
				allowIntersection: false, // Restricts shapes to simple polygons
				drawError: {
					color: 'red', // Color the shape will turn when intersects
					message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
				},
				shapeOptions: {
					color: 'yellow'
				}
			}
		},
		edit: false
	},

	type : 'draw',

	_flush : function () {
	},

	_addTo : function () {
		// return;
		if (!app._map) return;

		// add to map
		this.addTo(app._map);
		
		// add hooks
		this._addHooks();
		
		// mark inited
		this._added = true;
	},

	_addHooks : function () {

		var map = app._map;

		map.on('draw:created', this._drawCreated.bind(this));
		map.on('draw:edited', this._drawEdited.bind(this));
		// map.on('draw:editstart', this._drawEditstart.bind(this));
		// map.on('draw:editstop', this._drawEditstop.bind(this));

		// // enable draw programatically
		keymaster('d', this._toggleDraw.bind(this));
		keymaster('e', this._toggleEdit.bind(this));
		
	},

	_drawCreated : function (e) {
		console.log('drawcreated', e);
		var type = e.layerType,
		layer = e.layer;

		if (type === 'marker') {
			layer.bindPopup('A popup!');
		}

		console.log(this._layerContainer);
		this._layerContainer.addLayer(layer);

		// get data etc.
		var geojson = layer.toGeoJSON();

		console.log('geojson', geojson);

		// this._startWaitingFlash(layer.polygon);

		// fetch data
		this._fetchData({
			geojson : geojson,
			layer : layer
		}, function (err, results) {
			var resultObject = Wu.parse(results);

			console.log('fetched results: ', resultObject);

			// add center
			resultObject.center = layer.getBounds().getCenter();

			// add to popup
			app.MapPane._addPopupContentDraw(resultObject);

			app.MapPane._creatingPolygon = false;

			this._latestFetch = resultObject;

			// this._stopWaitingFlash(layer.polygon);

		}.bind(this));
	},
	_drawEdited : function (e) {
		console.log('edited', e);
	},
	_drawEditstart : function (e) {
		console.log('editstart', e);
	},
	_drawEditstop : function (e) {
		console.log('editstop', e);
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
	_getActiveLayerID : function () {
		var layer = app.MapPane._layermenuZIndex._index[0];

		if (!layer || !layer.store || !layer.store.data || !layer.store.data.postgis) return false;

		var layer_id = layer.store.data.postgis.layer_id;

		return layer_id;
	},

	_toggleDraw : function () {
		console.log('D!');

		console.log('this._toolbars', this._toolbars);
		
		if (this._drawEnabled) {
			this._toolbars.draw._modes.polygon.handler.disable();
			this._drawEnabled = false;

		} else {
			this._toolbars.draw._modes.polygon.handler.enable();
			this._drawEnabled = true;
		}	
	},

	_toggleEdit : function () {
		console.log('D!');
		
		if (this._editEnabled) {
			this._toolbars.edit._modes.edit.handler.save();
			this._toolbars.edit._modes.edit.handler.disable()
			this._editEnabled = false;

		} else {
			this._toolbars.edit._modes.edit.handler.enable();
			this._editEnabled = true;
		}	
	},

	
	_refresh : function () {

		// should be active
		if (!this._added) this._addTo(app._map);

		// get control active setting from project
		var active = this._project.getControls()[this.type];
		
		// if not active in project, hide
		if (!active) return this._hide();

		// remove old content
		this._flush();

		// show
		this._show();

	},

	_projectSelected : function (e) {
		var projectUuid = e.detail.projectUuid;

		if (!projectUuid) {
			this._project = null;
			return this._off();
		}
		// set project
		this._project = app.activeProject = app.Projects[projectUuid];

		// refresh pane
		this._refresh();
	},

	// turned on and off by sidepane/options/controls toggle
	_on : function () {

		console.log('DRAW _on');

		// refresh
		this._refresh();

		// add new content
		this._initContent();

	},
	_off : function () {
		this._hide();
	},

	_isActive : function () {
		if (!this._project) return false;
		return this._project.getControls()[this.type];
	},

	_show : function () {
		this._container.style.display = 'block';
	},

	_hide : function () {
		this._container.style.display = 'none';
	},

	show : function () {
		if (!this._container) return;
		this._isActive() ? this._show() : this._hide();
	},

	hide : function () {
		if (!this._container) return;

		this._hide();
	},

	_initContent : function () {
		this._layerContainer =  new L.FeatureGroup();
		app._map.addLayer(this._layerContainer);

		console.log('initContent!', this._layerContainer);

	},

	refresh : function () {
		this.addTo(app._map);
	},

	onRemove : function (map) {

	},


	

	_initialize: function (options) {

		// create layer container
		this._layerContainer = new L.FeatureGroup();
		console.log('this._layerContainer', this._layerContainer);
		app._map.addLayer(this._layerContainer);

		// add edit options
		this.options.edit = {
			featureGroup : this._layerContainer,
			// remove : false
		}
		
		var toolbar;

		this._toolbars = {};

		// Initialize toolbars
		if (L.DrawToolbar && this.options.draw) {
			toolbar = new L.DrawToolbar(this.options.draw);

			this._toolbars[L.DrawToolbar.TYPE] = toolbar;

			// Listen for when toolbar is enabled
			this._toolbars[L.DrawToolbar.TYPE].on('enable', this._toolbarEnabled, this);

			console.log('this._toolbars', this._toolbars);

			// // enable draw programatically
			// this._toolbars.draw._modes.polygon.handler.enable()
		}

		if (L.EditToolbar && this.options.edit) {
			toolbar = new L.EditToolbar(this.options.edit);

			this._toolbars[L.EditToolbar.TYPE] = toolbar;

			// Listen for when toolbar is enabled
			this._toolbars[L.EditToolbar.TYPE].on('enable', this._toolbarEnabled, this);
		}
	},

	

	onAdd: function (map) {
		var container = L.DomUtil.create('div', 'leaflet-draw'),
			addedTopClass = false,
			topClassName = 'leaflet-draw-toolbar-top',
			toolbarContainer;

		for (var toolbarId in this._toolbars) {
			if (this._toolbars.hasOwnProperty(toolbarId)) {
				toolbarContainer = this._toolbars[toolbarId].addToolbar(map);

				if (toolbarContainer) {
					// Add class to the first toolbar to remove the margin
					if (!addedTopClass) {
						if (!L.DomUtil.hasClass(toolbarContainer, topClassName)) {
							L.DomUtil.addClass(toolbarContainer.childNodes[0], topClassName);
						}
						addedTopClass = true;
					}

					container.appendChild(toolbarContainer);
				}
			}
		}

	
		return container;
	},

	onRemove: function () {
		for (var toolbarId in this._toolbars) {
			if (this._toolbars.hasOwnProperty(toolbarId)) {
				this._toolbars[toolbarId].removeToolbar();
			}
		}
	},

	setDrawingOptions: function (options) {
		for (var toolbarId in this._toolbars) {
			if (this._toolbars[toolbarId] instanceof L.DrawToolbar) {
				this._toolbars[toolbarId].setOptions(options);
			}
		}
	},

	_toolbarEnabled: function (e) {
		var enabledToolbar = e.target;

		for (var toolbarId in this._toolbars) {
			if (this._toolbars[toolbarId] !== enabledToolbar) {
				this._toolbars[toolbarId].disable();
			}
		}
	}



});

L.drawControl = function (options) {
	return new L.Control.Draw(options);
};
