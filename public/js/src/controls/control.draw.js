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
					color: 'blue',
				}, 
				smoothFactor : 0.5
			}
		},
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

		// draw events
		map.on('draw:created', this._drawCreated.bind(this));
		map.on('draw:edited', this._drawEdited.bind(this));
		map.on('draw:deleted', this._drawDeleted.bind(this));
		map.on('draw:editstart', this._drawEditstart.bind(this));
		map.on('draw:editstop', this._drawEditstop.bind(this));
		map.on('draw:drawstop', this._drawDrawstop.bind(this));
		map.on('draw:drawstart', this._drawDrawstart.bind(this));

		// // enable draw programatically
		keymaster('d', this._toggleDraw.bind(this));
		keymaster('e', this._toggleEdit.bind(this));
		keymaster('c', this._clearAll.bind(this));

		// button events
		var removeButton = this._toolbars.edit._modes.remove.button;
		Wu.DomEvent.on(removeButton, 'click', this._clearAll, this);
		
	},

	_clearAll : function () {

		var r = this._toolbars.edit._modes.remove.handler;
		var e = this._toolbars.edit._modes.edit.handler;
		var layers = r._deletableLayers.getLayers();

		layers.forEach(function (l) {
			r._deletableLayers.removeLayer(l);
			r.save();
			r.disable();
			e.disable();

			app.MapPane._clearPopup();
			
		}, this);

		if (!layers.length) app.MapPane._clearPopup();

	},

	_drawCreated : function (e) {
		var type = e.layerType,
		    layer = e.layer;

		// add layer to map
		this._layerContainer.addLayer(layer);

		// query for data
		this._queryData(layer);

		// add layer events
		this._addLayerEvents(layer);
	},

	_queryData : function (layer) {

		// get data etc.
		var geojson = layer.toGeoJSON();

		// fetch data
		this._fetchData({
			geojson : geojson,
			layer : layer
		}, function (err, results) {
			var resultObject = Wu.parse(results);

			// add center
			resultObject.center = layer.getBounds().getCenter();

			// add to popup
			app.MapPane._addPopupContentDraw(resultObject);

			// mark as not creating anymore
			app.MapPane._creatingPolygon = false;

			// memorize
			this._latestFetch = resultObject;

			var layer_name = this._getPostGISLayerName(resultObject.layer_id);

			// analytics/slack
			app.Analytics.onPolygonQuery({
				result : resultObject,
				layer_name : layer_name
			});

		}.bind(this));
		
	},

	_getPostGISLayerName : function (layer_id) {
		var layer = this._project.getPostGISLayer(layer_id);
		if (!layer) return 'unknown';
		return layer.getTitle();
	},

	_addLayerEvents : function (layer) {
		
		// on delete
		layer.on('deleted', function (e) {
			// shortcut that shizz
			var removeHandler = this._toolbars.edit._modes.remove.handler;
			removeHandler.save();
			removeHandler.disable();

		}.bind(this));
	},


	_drawEdited : function (e) {

		var layer = this._getEditedLayer(e);

		if (!layer) return;
		
		// query for data
		this._queryData(layer);

	},

	_getEditedLayer : function (e) {
		var layers = e.layers._layers;
		for (var l in layers) {
			return layers[l];
		}

	},

	// events
	_drawEditstart : function (e) {
		app.MapPane._drawing = true;
	},
	_drawEditstop : function (e) {
		app.MapPane._drawing = false;
	},
	_drawDrawstart : function (e) {
		app.MapPane._drawing = true;
	},
	_drawDrawstop : function (e) {
		app.MapPane._drawing = false;
	},
	_drawDeleted : function (e) {
	},

	// fetch data from postgis
	_fetchData : function (options, callback) {

		var layer_id = this._getActiveLayerID();

		if (!layer_id) {
			console.error('no active layer_id to fetch data from??');
			app.FeedbackPane.setMessage({
				title : 'No active layer to fetch data from.'
			});

			return;
		} 

		var options = {
			access_token : app.tokens.access_token,
			geojson : options.geojson,
			layer_id : layer_id
		}

		Wu.send('/api/db/fetchArea', options, callback, this);
	},
	
	_getActiveLayerID : function () {
		var layer = app.MapPane._layermenuZIndex._index[0];
		if (!layer || !layer.store || !layer.store.data || !layer.store.data.postgis) return false;
		var layer_id = layer.store.data.postgis.layer_id;
		return layer_id;
	},

	_getActiveLayer : function () {
		var layer_id = this._getActiveLayerID();
		var layers = app.activeProject.getLayers();
		var layer = _.find(layers, function (l) {
			console.log('l: ', l);
			if (!l.store || !l.store.data) return false;
			if (l.store.data.postgis) {
				return l.store.data.postgis == layer_id;
			}
			return false;
		})
		return layer;
	},

	_getActiveLayerName : function () {
		var layer = this._getActiveLayer();
		if (!layer) return 'No layer';
		return layer.getTitle();
	},

	_toggleDraw : function () {
		
		if (this._drawEnabled) {
			this._toolbars.draw._modes.polygon.handler.disable();
			this._drawEnabled = false;
		} else {
			this._toolbars.draw._modes.polygon.handler.enable();
			this._drawEnabled = true;
		}	
	},

	_toggleEdit : function () {
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
	},

	refresh : function () {
		this.addTo(app._map);
	},

	onRemove : function (map) {

	},

	_initialize: function (options) {

		// create layer container
		this._layerContainer = new L.FeatureGroup();
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
