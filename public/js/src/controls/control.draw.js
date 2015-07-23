L.Control.Draw = Wu.Control.extend({

	options: {
		position: 'topleft'
	},

	type : 'draw',

	_flush : function () {
	},

	_addTo : function () {
		// return;

		// add to map
		this.addTo(app._map);
		
		// add hooks
		this._addHooks();
		
		// mark inited
		this._added = true;
	},

	

	_refresh : function () {


		// should be active
		if (!this._added) this._addTo(app._map);


		// debug: turn whole thing off! 
		this._flush();
		// return this._hide();

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

	// custom onAdd
	onAdd: function (map) {
		var container = L.DomUtil.create('div', 'leaflet-draw'),
			addedTopClass = false,
			topClassName = 'leaflet-draw-toolbar-top',
			toolbarContainer;

		// create buttons
		container.appendChild(this._createPolygonButtons());
		container.appendChild(this._createPolylineButtons());

		// create draw controls
		// this._polygonDraw = this._createPolygonDraw();//.addTo(map);
		this._polylineDraw = this._createPolylineDraw();//.addTo(map);
		
		// add tooltip
		app.Tooltip.add(this._polygonButton, 'Draw polygons on the map');
		app.Tooltip.add(this._polylineButton, 'Draw polylines on the map');

		return container;
	},

	_createPolygonButtons : function (container) {
		var wrapper = Wu.DomUtil.create('div',  'leaflet-draw-button-wrapper polygon');
		this._polygonButton = Wu.DomUtil.create('div',  'leaflet-draw-button polygon', wrapper, 'Draw Polygon');
		this._polygonSave = Wu.DomUtil.create('div',  'leaflet-draw-button-save polygon', wrapper, 'Save');
		this._polygonCancel = Wu.DomUtil.create('div',  'leaflet-draw-button-cancel polygon', wrapper, 'Cancel');
		this._polygonUndo = Wu.DomUtil.create('div',  'leaflet-draw-button-undo polygon', wrapper, 'Undo');
		return wrapper;
	},

	_createPolylineButtons : function () {
		var wrapper = Wu.DomUtil.create('div',  'leaflet-draw-button-wrapper polyline');
		this._polylineButton = Wu.DomUtil.create('div', 'leaflet-draw-button polyline', wrapper, 'Draw Line');
		this._polylineSave = Wu.DomUtil.create('div', 'leaflet-draw-button-save polyline', wrapper, 'Save');
		this._polylineCancel = Wu.DomUtil.create('div', 'leaflet-draw-button-cancel polyline', wrapper, 'Cancel');
		this._polylineUndo = Wu.DomUtil.create('div',  'leaflet-draw-button-undo polyline', wrapper, 'Undo');
		return wrapper;
	},

	_createPolylineDraw : function () {
		
		// create draw tools
		var polylineDraw = new L.FreeDraw({ // new feature group
			smoothFactor : 2,
			simplifyPolygons : false
		});

		polylineDraw.options.exitModeAfterCreate(false);

		polylineDraw.on('mode', function modeReceived(eventData) {
                   console.log('mode', eventData);

                });

		polylineDraw.on('markers', function getMarkers(eventData) {
		    var latLngs = eventData.latLngs;
		    console.log('markers', eventData);
		    // ...
		});

		app.__pl = polylineDraw;

		return polylineDraw;

	},

	_createPolygonDraw : function () {
		
		// // create draw tools
		// var polygonDraw = new L.FreeDraw({
		// 	smoothFactor : 0,
		// 	simplifyPolygons : false,
		// 	// attemptMerge : false,
		// 	hullAlgorithm : false,
		// 	// multiplePolygons : false
		// 	boundariesAfterEdit : true,
		// 	createExitMode : false

		// });

		// polygonDraw.options.exitModeAfterCreate(false);

		// polygonDraw.on('mode', function modeReceived(eventData) {
  //                  	// console.log('mode', eventData);

  //               });

		// polygonDraw.on('markers', function getMarkers(eventData) {
		//     	// var latLngs = eventData.latLngs;
		//     	// console.log('markers', eventData);
		//     	// ...
		// });

		// app.__pb = polygonDraw;

		// return polygonDraw;
	},

	_addHooks : function () {
		//return;

		// polyline buttons
		L.DomEvent.on(this._polylineButton, 'click', this._togglePolyline, this);

		// polygon buttons
		L.DomEvent.on(this._polygonButton,  'click', this._togglePolygon, this);
		L.DomEvent.on(this._polygonSave,    'click', this._savePolygon, this);
		L.DomEvent.on(this._polygonCancel,  'click', this._cancelPolygon, this);
		L.DomEvent.on(this._polygonUndo,    'click', this._undoPolygon, this);
		

		// stops
		L.DomEvent.on(this._polygonButton,  'dblclick', L.DomEvent.stop, this);
		L.DomEvent.on(this._polylineButton, 'dblclick', L.DomEvent.stop, this);
		// ...
	},

	_savePolygon : function () {
		// console.log('save');

		// set VIEW mode
		this._disablePolygon();
	
		// get geojson
		var geojson = this._polygonDraw.getGeoJSON();
		// console.log('GeoJSON:', geojson);

		// clear
		this._polygonDraw._clearPolygons();

		// create layer from geojson,
		// add to layermenu, project, data library, sidepanes
		// 
		var geojsonLayer = new Wu.GeoJSONLayer(geojson);
		// console.log('gg', geojsonLayer);

		// add to map
		geojsonLayer._addTo();

	},

	_cancelPolygon : function () {
		// console.log('cacnel');
	},
	_undoPolygon : function () {
		console.log('undo');
	},

	_togglePolygon : function () {
		this._pgEnabled ? this._disablePolygon() : this._enablePolygon();
	},

	_togglePolyline : function () {
		this._plEnabled ? this._disablePolyline() : this._enablePolyline();
	},

	_enablePolyline : function () {
		this._plEnabled = true;
		
		L.DomUtil.addClass(this._polylineButton, 'active');

		this._polylineDraw.setMode(L.FreeDraw.MODES.ALL);
	},

	_disablePolyline : function () {
		this._plEnabled = false;
		
		L.DomUtil.removeClass(this._polylineButton, 'active');
		
		this._polylineDraw.setMode(L.FreeDraw.MODES.VIEW);
	},

	_enablePolygon : function () {
		this._pgEnabled = true;
		
		L.DomUtil.addClass(this._polygonButton, 'active');
		
		this._polygonDraw.setMode(L.FreeDraw.MODES.ALL);
	},

	_disablePolygon : function () {
		this._pgEnabled = false;
		
		L.DomUtil.removeClass(this._polygonButton, 'active');
		
		this._polygonDraw.setMode(L.FreeDraw.MODES.VIEW);
	},

});

L.drawControl = function (options) {
	return new L.Control.Draw(options);
};
