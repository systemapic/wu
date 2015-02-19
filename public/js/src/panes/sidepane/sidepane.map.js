Wu.SidePane.Map = Wu.SidePane.Item.extend({
	_ : 'sidepane.map', 

	type : 'map',

	title : 'Options',

	initContent : function () {

		// longhand 
		this.app = Wu.app;

		// content to template
		this.buildHTML();

		// this._container.innerHTML = ich.editorMapBaseLayer();
		this._settingsContainer = Wu.DomUtil.get('mapsettings-container');

		// set panes
		this._panes = {};

		// init each setting
		this.mapSettings = {};
		this.mapSettings.baselayer = new Wu.SidePane.Map.BaseLayers();
		this.mapSettings.layermenu = new Wu.SidePane.Map.LayerMenu();
		this.mapSettings.position  = new Wu.SidePane.Map.Position();
		this.mapSettings.bounds    = new Wu.SidePane.Map.Bounds();
		this.mapSettings.controls  = new Wu.SidePane.Map.Controls();
		this.mapSettings.connect   = new Wu.SidePane.Map.Connect(this._settingsContainer);  // refactor container, ich.template
		this.mapSettings.settings  = new Wu.SidePane.Map.Settings(this._settingsContainer);  // refactor container, ich.template


		// add tooltip
		app.Tooltip.add(this._menu, '(Editors only) In this section you will find all the options for setting up a map.');


	},


	buildHTML : function () {

		this._HTML = {};

		var HTML = this._HTML;

		// Outer wrapper
		HTML._mapSettingsContainer = Wu.DomUtil.makeit({type : 'div', id : 'mapsettings-container', appendto : this._container});


		// BASE LAYERS

		// Wrappers
		HTML._baseLayerWrap = Wu.DomUtil.makeit({type: 'div', id : 'editor-map-baselayer-wrap', cname : 'editor-inner-wrapper editor-map-item-wrap', appendto : HTML._mapSettingsContainer});
		HTML._baseLayerH4 = Wu.DomUtil.makeit({type: 'h4', inner : 'Base Layers', appendto : HTML._baseLayerWrap});


		// LAYER MENU

		// Wrappers
		HTML._layerMenuWrap = Wu.DomUtil.makeit({type: 'div', id : 'editor-map-layermenu-wrap', cname : 'editor-inner-wrapper editor-map-item-wrap', appendto : HTML._mapSettingsContainer});
		HTML._layerMenuH4 = Wu.DomUtil.makeit({type: 'h4', inner : 'Layermenu', appendto : HTML._layerMenuWrap});
		HTML._layerMenu = Wu.DomUtil.makeit({type:'div', id : 'editor-map-layermenu', appendto : HTML._layerMenuWrap});
		HTML._layerMenuInner = Wu.DomUtil.makeit({type : 'div', id : 'map-layermenu-inner', cname : 'initheight', appendto : HTML._layerMenu});


		// POSITION

		// Wrappers
		HTML._mapPositionWrap = Wu.DomUtil.makeit({type : 'div', id : 'editor-map-position-wrap', cname : 'editor-inner-wrapper editor-map-item-wrap', appendto : HTML._mapSettingsContainer});
		HTML._mapPositionH4 = Wu.DomUtil.makeit({type: 'h4', inner : 'Position', appendto : HTML._mapPositionWrap});
		HTML._initPosCoord = Wu.DomUtil.makeit({type: 'div', id : "editor-map-initpos-coordinates", appendto : HTML._mapPositionWrap});
		HTML._initPosInner = Wu.DomUtil.makeit({type: 'div', id : 'map-initpos-inner', cname : 'initheight', appendto: HTML._initPosCoord });

		// Set position button
		HTML._setCurrentPost = Wu.DomUtil.makeit({type: 'button', id: 'editor-map-initpos-button', cname : 'smap-button-white', inner : 'Set current position', appendto : HTML._initPosInner, attr : [['type', 'button']]});

		// Latitude
		HTML._latLabel = Wu.DomUtil.makeit({type : 'label', inner : 'Latitude:', appendto: HTML._initPosInner, attr : [['for', 'editor-map-initpos-lat-value']]});
		HTML._latInput = Wu.DomUtil.makeit({type : 'input', cname : 'form-control margined eightyWidth', id : 'editor-map-initpos-lat-value', appendto : HTML._initPosInner });

		// Longitude
		HTML._lngLabel = Wu.DomUtil.makeit({type : 'label', inner : 'Longitude:', appendto: HTML._initPosInner, attr : [['for', 'editor-map-initpos-lng-value']]});
		HTML._lngInput = Wu.DomUtil.makeit({type : 'input', cname : 'form-control margined eightyWidth', id : 'editor-map-initpos-lng-value', appendto : HTML._initPosInner });

		// Zoom
		HTML._zoomLabel = Wu.DomUtil.makeit({type : 'label', inner : 'Zoom-level:', appendto: HTML._initPosInner, attr : [['for', 'editor-map-initpos-zoom-value']]});
		HTML._zoomInput = Wu.DomUtil.makeit({type : 'input', cname : 'form-control margined eightyWidth', id : 'editor-map-initpos-zoom-value', appendto : HTML._initPosInner });


		// BOUNDS

		// Wrapper
		HTML._boundsWrapper = Wu.DomUtil.makeit({type : 'div', id : 'editor-map-bounds-wrap', cname : 'editor-inner-wrapper editor-map-item-wrap', appendto : HTML._mapSettingsContainer});
		HTML._boundsH4 = Wu.DomUtil.makeit({type: 'h4', inner : 'Bounds', appendto : HTML._boundsWrapper});
		HTML._boundsCoords = Wu.DomUtil.makeit({type : 'div', id : 'editor-map-bounds-coordinates', appendto : HTML._boundsWrapper});
		HTML._boundsInner = Wu.DomUtil.makeit({type: 'div', id : 'map-bounds-inner', cname : 'initheight', appendto : HTML._boundsCoords});
		
		// Set bounds button
		HTML._setBoundsButton = Wu.DomUtil.makeit({type: 'button', id : 'editor-map-bounds', cname : 'smap-button-white', inner : 'Set all bounds', appendto : HTML._boundsInner, attr : [['type', 'button']]});

		// Clear bounds button
		HTML._clearBoundsButton = Wu.DomUtil.makeit({type: 'button', id : 'editor-map-bounds-clear', cname : 'smap-button-white', inner : 'Clear', appendto : HTML._boundsInner, attr : [['type', 'button']]});

		// North East Bounds
		HTML._NEwrapper = Wu.DomUtil.makeit({type : 'div', cname : 'bounds-wrapper', appendto : HTML._boundsInner});
		HTML._NEbutton = Wu.DomUtil.makeit({type : 'button', id : 'editor-map-bounds-NE', cname : 'smap-button-white', inner : 'Set North-East bounds', appendto : HTML._NEwrapper, attr : [['type', 'button']]});
		HTML._NElatInput = Wu.DomUtil.makeit({type : 'input', cname : 'form-control margined eightyWidth', id : 'editor-map-bounds-NE-lat-value', appendto : HTML._NEwrapper});
		HTML._NElngInput = Wu.DomUtil.makeit({type : 'input', cname : 'form-control margined eightyWidth', id : 'editor-map-bounds-NE-lng-value', appendto : HTML._NEwrapper});

		// South West Bounds
		HTML._SWwrapper = Wu.DomUtil.makeit({type : 'div', cname : 'bounds-wrapper', appendto : HTML._boundsInner});
		HTML._SWbutton = Wu.DomUtil.makeit({type : 'button', id : 'editor-map-bounds-SW', cname : 'smap-button-white', inner : 'Set South-West bounds', appendto : HTML._SWwrapper, attr : [['type', 'button']]});
		HTML._SWlatInput = Wu.DomUtil.makeit({type : 'input', cname : 'form-control margined eightyWidth', id : 'editor-map-bounds-SW-lat-value', appendto : HTML._SWwrapper});
		HTML._SWlngInput = Wu.DomUtil.makeit({type : 'input', cname : 'form-control margined eightyWidth', id : 'editor-map-bounds-SW-lng-value', appendto : HTML._SWwrapper});
						
		// Zoom Bounds
		HTML._zoomBounds = Wu.DomUtil.makeit({type : 'div', cname : 'bounds-wrapper zoom', appendto : HTML._boundsInner});

		// Max Zoom
		HTML._zoomBoundsLeft = Wu.DomUtil.makeit({type : 'div', cname : 'bounds-zoom-half left', appendto : HTML._zoomBounds});
		HTML._zoomBoundsLeftHeader = Wu.DomUtil.makeit({type : 'div', cname : 'bounds-zoom-h2', inner : 'Max Zoom', appendto : HTML._zoomBoundsLeft});
		HTML._zoomBoundsLeftBtn = Wu.DomUtil.makeit({type : 'button', id : 'editor-map-bounds-set-maxZoom', cname : 'smap-button-white', inner : 'Set', appendto : HTML._zoomBoundsLeft, attr : [['type', 'button']]});
		HTML._zoomBoundsLeftInput = Wu.DomUtil.makeit({type : 'input', id : 'editor-map-bounds-max-zoom-value', cname : 'form-control margined eightyWidth', appendto : HTML._zoomBoundsLeft});

		// Min Zoom
		HTML._zoomBoundsRight = Wu.DomUtil.makeit({type : 'div', cname : 'bounds-zoom-half right', appendto : HTML._zoomBounds});
		HTML._zoomBoundsRightHeader = Wu.DomUtil.makeit({type : 'div', cname : 'bounds-zoom-h2', inner : 'Min Zoom', appendto : HTML._zoomBoundsRight});
		HTML._zoomBoundsRightInput = Wu.DomUtil.makeit({type : 'input', id : 'editor-map-bounds-min-zoom-value', cname : 'form-control margined eightyWidth', appendto : HTML._zoomBoundsRight});
		HTML._zoomBoundsRightBtn = Wu.DomUtil.makeit({type : 'button', id : 'editor-map-bounds-set-minZoom', cname : 'smap-button-white', inner : 'Set', appendto : HTML._zoomBoundsRight, attr : [['type', 'button']]});



		// CONTROLS 

		// Wrapper
		HTML._mapControlsWrap = Wu.DomUtil.makeit({type: 'div', id : 'editor-map-controls-wrap', cname : 'editor-inner-wrapper editor-map-item-wrap', appendto : HTML._mapSettingsContainer});
		HTML._controlsH4 = Wu.DomUtil.makeit({type: 'h4', inner : 'Controls', appendto : HTML._mapControlsWrap});
		HTML._controlsInner = Wu.DomUtil.makeit({type : 'div', id : 'editor-map-controls-inner-wrap', appendto : HTML._mapControlsWrap});

		// ZOOM
		HTML._controlZoomWrapper = Wu.DomUtil.makeit({type : 'div', cname : 'item-list controls-item', appendto : HTML._controlsInner});
		HTML._controlZoomTitle = Wu.DomUtil.makeit({type : 'div', cname : 'controls-title', id : 'map-controls-title-zoom', inner : 'Zoom', appendto : HTML._controlZoomWrapper, attr : [['which', 'zoom']]});
		HTML._controlZoomSwitch = Wu.DomUtil.makeit({type : 'div', cname : 'switch controls-switch', appendto : HTML._controlZoomWrapper});
		HTML._controlZoomSwitchInput = Wu.DomUtil.makeit({type : 'input', cname : 'cmn-toggle cmn-toggle-round-flat', id : 'map-controls-zoom', appendto : HTML._controlZoomSwitch, attr : [['type', 'checkbox'], ['checked', 'checked']]});
		HTML._controlZoomSwitchLabel = Wu.DomUtil.makeit({type : 'label', appendto : HTML._controlZoomSwitch, attr : [['for', 'map-controls-zoom']]});

		// DRAW
		HTML._controlDrawWrapper = Wu.DomUtil.makeit({type : 'div', cname : 'item-list controls-item', appendto : HTML._controlsInner});
		HTML._controlDrawTitle = Wu.DomUtil.makeit({type : 'div', cname : 'controls-title', id : 'map-controls-title-draw', inner : 'Draw', appendto : HTML._controlDrawWrapper, attr : [['which', 'draw']]});
		HTML._controlDrawSwitch = Wu.DomUtil.makeit({type : 'div', cname : 'switch controls-switch', appendto : HTML._controlDrawWrapper});
		HTML._controlDrawSwitchInput = Wu.DomUtil.makeit({type : 'input', cname : 'cmn-toggle cmn-toggle-round-flat', id : 'map-controls-draw', appendto : HTML._controlDrawSwitch, attr : [['type', 'checkbox'], ['checked', 'checked']]});
		HTML._controlDrawSwitchLabel = Wu.DomUtil.makeit({type : 'label', appendto : HTML._controlDrawSwitch, attr : [['for', 'map-controls-draw']]});

		// INSPECT
		HTML._controlInspectWrapper = Wu.DomUtil.makeit({type : 'div', cname : 'item-list controls-item', appendto : HTML._controlsInner});
		HTML._controlInspectTitle = Wu.DomUtil.makeit({type : 'div', cname : 'controls-title', id : 'map-controls-title-inspect', inner : 'Inspect layers', appendto : HTML._controlInspectWrapper, attr : [['which', 'inspect']]});
		HTML._controlInspectSwitch = Wu.DomUtil.makeit({type : 'div', cname : 'switch controls-switch', appendto : HTML._controlInspectWrapper});
		HTML._controlInspectSwitchInput = Wu.DomUtil.makeit({type : 'input', cname : 'cmn-toggle cmn-toggle-round-flat', id : 'map-controls-inspect', appendto : HTML._controlInspectSwitch, attr : [['type', 'checkbox'], ['checked', 'checked']]});
		HTML._controlInspectSwitchLabel = Wu.DomUtil.makeit({type : 'label', appendto : HTML._controlInspectSwitch, attr : [['for', 'map-controls-inspect']]});

		// DESCRIPTION
		HTML._controlDescriptionWrapper = Wu.DomUtil.makeit({type : 'div', cname : 'item-list controls-item', appendto : HTML._controlsInner});
		HTML._controlDescriptionTitle = Wu.DomUtil.makeit({type : 'div', cname : 'controls-title', id : 'map-controls-title-description', inner : 'Description', appendto : HTML._controlDescriptionWrapper, attr : [['which', 'description']]});
		HTML._controlDescriptionSwitch = Wu.DomUtil.makeit({type : 'div', cname : 'switch controls-switch', appendto : HTML._controlDescriptionWrapper});
		HTML._controlDescriptionSwitchInput = Wu.DomUtil.makeit({type : 'input', cname : 'cmn-toggle cmn-toggle-round-flat', id : 'map-controls-description', appendto : HTML._controlDescriptionSwitch, attr : [['type', 'checkbox'], ['checked', 'checked']]});
		HTML._controlDescriptionSwitchLabel = Wu.DomUtil.makeit({type : 'label', appendto : HTML._controlDescriptionSwitch, attr : [['for', 'map-controls-description']]});

		// LAYER MENU
		HTML._controlLayermenuWrapper = Wu.DomUtil.makeit({type : 'div', cname : 'item-list controls-item', appendto : HTML._controlsInner});
		HTML._controlLayermenuTitle = Wu.DomUtil.makeit({type : 'div', cname : 'controls-title', id : 'map-controls-title-layermenu', inner : 'Layer menu', appendto : HTML._controlLayermenuWrapper, attr : [['which', 'layermenu']]});
		HTML._controlLayermenuSwitch = Wu.DomUtil.makeit({type : 'div', cname : 'switch controls-switch', appendto : HTML._controlLayermenuWrapper});
		HTML._controlLayermenuSwitchInput = Wu.DomUtil.makeit({type : 'input', cname : 'cmn-toggle cmn-toggle-round-flat', id : 'map-controls-layermenu', appendto : HTML._controlLayermenuSwitch, attr : [['type', 'checkbox'], ['checked', 'checked']]});
		HTML._controlLayermenuSwitchLabel = Wu.DomUtil.makeit({type : 'label', appendto : HTML._controlLayermenuSwitch, attr : [['for', 'map-controls-layermenu']]});

		// LEGENDS
		HTML._controlLegendsWrapper = Wu.DomUtil.makeit({type : 'div', cname : 'item-list controls-item', appendto : HTML._controlsInner});
		HTML._controlLegendsTitle = Wu.DomUtil.makeit({type : 'div', cname : 'controls-title', id : 'map-controls-title-legends', inner : 'Legends', appendto : HTML._controlLegendsWrapper, attr : [['which', 'legends']]});
		HTML._controlLegendsSwitch = Wu.DomUtil.makeit({type : 'div', cname : 'switch controls-switch', appendto : HTML._controlLegendsWrapper});
		HTML._controlLegendsSwitchInput = Wu.DomUtil.makeit({type : 'input', cname : 'cmn-toggle cmn-toggle-round-flat', id : 'map-controls-legends', appendto : HTML._controlLegendsSwitch, attr : [['type', 'checkbox'], ['checked', 'checked']]});
		HTML._controlLegendsSwitchLabel = Wu.DomUtil.makeit({type : 'label', appendto : HTML._controlLegendsSwitch, attr : [['for', 'map-controls-legends']]});

		// SCALE / MEASURE
		HTML._controlMeasureWrapper = Wu.DomUtil.makeit({type : 'div', cname : 'item-list controls-item', appendto : HTML._controlsInner});
		HTML._controlMeasureTitle = Wu.DomUtil.makeit({type : 'div', cname : 'controls-title', id : 'map-controls-title-measure', inner : 'Scale', appendto : HTML._controlMeasureWrapper, attr : [['which', 'measure']]});
		HTML._controlMeasureSwitch = Wu.DomUtil.makeit({type : 'div', cname : 'switch controls-switch', appendto : HTML._controlMeasureWrapper});
		HTML._controlMeasureSwitchInput = Wu.DomUtil.makeit({type : 'input', cname : 'cmn-toggle cmn-toggle-round-flat', id : 'map-controls-measure', appendto : HTML._controlMeasureSwitch, attr : [['type', 'checkbox'], ['checked', 'checked']]});
		HTML._controlMeasureSwitchLabel = Wu.DomUtil.makeit({type : 'label', appendto : HTML._controlMeasureSwitch, attr : [['for', 'map-controls-measure']]});

		// GEO LOCATION
		HTML._controlGeoWrapper = Wu.DomUtil.makeit({type : 'div', cname : 'item-list controls-item', appendto : HTML._controlsInner});
		HTML._controlGeoTitle = Wu.DomUtil.makeit({type : 'div', cname : 'controls-title', id : 'map-controls-title-geolocation', inner : 'Geolocation', appendto : HTML._controlGeoWrapper, attr : [['which', 'geolocation']]});
		HTML._controlGeoSwitch = Wu.DomUtil.makeit({type : 'div', cname : 'switch controls-switch', appendto : HTML._controlGeoWrapper});
		HTML._controlGeoSwitchInput = Wu.DomUtil.makeit({type : 'input', cname : 'cmn-toggle cmn-toggle-round-flat', id : 'map-controls-geolocation', appendto : HTML._controlGeoSwitch, attr : [['type', 'checkbox'], ['checked', 'checked']]});
		HTML._controlGeoSwitchLabel = Wu.DomUtil.makeit({type : 'label', appendto : HTML._controlGeoSwitch, attr : [['for', 'map-controls-geolocation']]});

		// BASELAYER TOGGLE
		HTML._controlBaselayerToggleWrapper = Wu.DomUtil.makeit({type : 'div', cname : 'item-list controls-item', appendto : HTML._controlsInner});
		HTML._controlBaselayerToggleTitle = Wu.DomUtil.makeit({type : 'div', cname : 'controls-title', id : 'map-controls-title-baselayertoggle', inner : 'Baselayer toggle', appendto : HTML._controlBaselayerToggleWrapper, attr : [['which', 'baselayertoggle']]});
		HTML._controlBaselayerToggleSwitch = Wu.DomUtil.makeit({type : 'div', cname : 'switch controls-switch', appendto : HTML._controlBaselayerToggleWrapper});
		HTML._controlBaselayerToggleSwitchInput = Wu.DomUtil.makeit({type : 'input', cname : 'cmn-toggle cmn-toggle-round-flat', id : 'map-controls-baselayertoggle', appendto : HTML._controlBaselayerToggleSwitch, attr : [['type', 'checkbox'], ['checked', 'checked']]});
		HTML._controlBaselayerToggleSwitchLabel = Wu.DomUtil.makeit({type : 'label', appendto : HTML._controlBaselayerToggleSwitch, attr : [['for', 'map-controls-baselayertoggle']]});

		// CARTO CSS 
		HTML._controlCartoCSSWrapper = Wu.DomUtil.makeit({type : 'div', cname : 'item-list controls-item', appendto : HTML._controlsInner});
		HTML._controlCartoCSSTitle = Wu.DomUtil.makeit({type : 'div', cname : 'controls-title', id : 'map-controls-title-cartocss', inner : 'CartoCSS Editor', appendto : HTML._controlCartoCSSWrapper, attr : [['which', 'cartocss']]});
		HTML._controlCartoCSSSwitch = Wu.DomUtil.makeit({type : 'div', cname : 'switch controls-switch', appendto : HTML._controlCartoCSSWrapper});
		HTML._controlCartoCSSSwitchInput = Wu.DomUtil.makeit({type : 'input', cname : 'cmn-toggle cmn-toggle-round-flat', id : 'map-controls-cartocss', appendto : HTML._controlCartoCSSSwitch, attr : [['type', 'checkbox'], ['checked', 'checked']]});
		HTML._controlCartoCSSSwitchLabel = Wu.DomUtil.makeit({type : 'label', appendto : HTML._controlCartoCSSSwitch, attr : [['for', 'map-controls-cartocss']]});

		// MOUSE POSITION
		HTML._controlMousePosWrapper = Wu.DomUtil.makeit({type : 'div', cname : 'item-list controls-item', appendto : HTML._controlsInner});
		HTML._controlMousePosTitle = Wu.DomUtil.makeit({type : 'div', cname : 'controls-title', id : 'map-controls-title-mouseposition', inner : 'Mouse position', appendto : HTML._controlMousePosWrapper, attr : [['which', 'mouseposition']]});
		HTML._controlMousePosSwitch = Wu.DomUtil.makeit({type : 'div', cname : 'switch controls-switch', appendto : HTML._controlMousePosWrapper});
		HTML._controlMousePosSwitchInput = Wu.DomUtil.makeit({type : 'input', cname : 'cmn-toggle cmn-toggle-round-flat', id : 'map-controls-mouseposition', appendto : HTML._controlMousePosSwitch, attr : [['type', 'checkbox'], ['checked', 'checked']]});
		HTML._controlMousePosSwitchLabel = Wu.DomUtil.makeit({type : 'label', appendto : HTML._controlMousePosSwitch, attr : [['for', 'map-controls-mouseposition']]});

		

	},

	
	addHooks : function () {
		
	},

	// run when sidepane activated
	_activate : function () {
	},

	// run when sidepane deactivated
	_deactivate : function () {

	},

	updateContent : function () {
		this._update();
	},

	_resetView : function () {

	},

	update : function () {
		this._update();
	},

	// if run on select project
	_update : function () {

		// use active project
		this.project = app.activeProject;

		// update map settings
		for (s in this.mapSettings) {
			var setting = this.mapSettings[s];
			setting.update();
		}

		// set height of content
		this.setContentHeight();
	},

	closeAll : function () {
		// console.log('closeAll');

		// close all options folders
		var options = app.SidePane.Map.mapSettings;
		for (o in options) {
			var option = options[o];
			// console.log('option: ', option);
			if (option._isOpen) option.close();
		}

	},

});