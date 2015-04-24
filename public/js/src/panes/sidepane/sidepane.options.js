Wu.SidePane.Options = Wu.SidePane.Item.extend({

	_ : 'sidepane.options', 
	type : 'mapoptions',
	title : 'Options',

	_initContent : function () {

		// longhand 
		this.app = Wu.app;

		// content to template
		this.buildHTML();

		// this._container.innerHTML = ich.editorMapBaseLayer();
		this._settingsContainer = Wu.DomUtil.get('mapsettings-container');

		// set panes
		this._panes = {};

		// init each setting
		this.settings = {};
		this.settings.baselayer = new Wu.SidePane.Options.BaseLayers();
		this.settings.layermenu = new Wu.SidePane.Options.LayerMenu();
		this.settings.position  = new Wu.SidePane.Options.Position();
		this.settings.bounds    = new Wu.SidePane.Options.Bounds();
		this.settings.controls  = new Wu.SidePane.Options.Controls();
		this.settings.connect   = new Wu.SidePane.Options.Connect(this._settingsContainer);  // refactor container, ich.template
		this.settings.settings  = new Wu.SidePane.Options.Settings(this._settingsContainer);  // refactor container, ich.template

		// add tooltip
		app.Tooltip.add(this._menu, '(Editors only) In this section you will find all the options for setting up a map.');
	},


	buildHTML : function () { 	// todo: refactor into each option

		this._HTML = {};

		var HTML = this._HTML;

		// Outer wrapper
		HTML._mapOptionsContainer = Wu.DomUtil.makeit({type : 'div', id : 'mapsettings-container', appendto : this._container});

		// BASE LAYERS

		// Wrappers
		HTML.baseLayer = {};
		HTML.baseLayer._wrap = Wu.DomUtil.makeit({type: 'div', id : 'editor-map-baselayer-wrap', cname : 'editor-inner-wrapper editor-map-item-wrap', appendto : HTML._mapOptionsContainer});
		HTML.baseLayer._H4 = Wu.DomUtil.makeit({type: 'h4', inner : 'Base Layers', appendto : HTML.baseLayer._wrap});


		// LAYER MENU

		// Wrappers
		HTML.layerMenu = {}
		HTML.layerMenu._wrap = Wu.DomUtil.makeit({type: 'div', id : 'editor-map-layermenu-wrap', cname : 'editor-inner-wrapper editor-map-item-wrap', appendto : HTML._mapOptionsContainer});
		HTML.layerMenu._H4 = Wu.DomUtil.makeit({type: 'h4', inner : 'Layermenu', appendto : HTML.layerMenu._wrap});
		HTML.layerMenu._menu = Wu.DomUtil.makeit({type:'div', id : 'editor-map-layermenu', appendto : HTML.layerMenu._wrap});
		HTML.layerMenu._inner = Wu.DomUtil.makeit({type : 'div', id : 'map-layermenu-inner', cname : 'initheight', appendto : HTML.layerMenu._menu});


		// POSITION

		// Wrappers
		HTML.position = {};
		HTML.position._wrap = Wu.DomUtil.makeit({type : 'div', id : 'editor-map-position-wrap', cname : 'editor-inner-wrapper editor-map-item-wrap', appendto : HTML._mapOptionsContainer});
		HTML.position._H4 = Wu.DomUtil.makeit({type: 'h4', inner : 'Position', appendto : HTML.position._wrap});
		HTML.position._initPosCoord = Wu.DomUtil.makeit({type: 'div', id : "editor-map-initpos-coordinates", appendto : HTML.position._wrap});
		HTML.position._initPosInner = Wu.DomUtil.makeit({type: 'div', id : 'map-initpos-inner', cname : 'initheight', appendto: HTML.position._initPosCoord });

		// Set position button
		HTML.position._setCurrentPost = Wu.DomUtil.makeit({type: 'button', id: 'editor-map-initpos-button', cname : 'smap-button-white', inner : 'Set current position', appendto : HTML.position._initPosInner, attr : [['type', 'button']]});

		// Latitude
		HTML.position._latLabel = Wu.DomUtil.makeit({type : 'label', inner : 'Latitude:', appendto: HTML.position._initPosInner, attr : [['for', 'editor-map-initpos-lat-value']]});
		HTML.position._latInput = Wu.DomUtil.makeit({type : 'input', cname : 'form-control margined eightyWidth', id : 'editor-map-initpos-lat-value', appendto : HTML.position._initPosInner });

		// Longitude
		HTML.position._lngLabel = Wu.DomUtil.makeit({type : 'label', inner : 'Longitude:', appendto: HTML.position._initPosInner, attr : [['for', 'editor-map-initpos-lng-value']]});
		HTML.position._lngInput = Wu.DomUtil.makeit({type : 'input', cname : 'form-control margined eightyWidth', id : 'editor-map-initpos-lng-value', appendto : HTML.position._initPosInner });

		// Zoom
		HTML.position._zoomLabel = Wu.DomUtil.makeit({type : 'label', inner : 'Zoom-level:', appendto: HTML.position._initPosInner, attr : [['for', 'editor-map-initpos-zoom-value']]});
		HTML.position._zoomInput = Wu.DomUtil.makeit({type : 'input', cname : 'form-control margined eightyWidth', id : 'editor-map-initpos-zoom-value', appendto : HTML.position._initPosInner });


		// BOUNDS

		// Wrapper
		HTML.bounds = {};
		HTML.bounds._wrapper = Wu.DomUtil.makeit({type : 'div', id : 'editor-map-bounds-wrap', cname : 'editor-inner-wrapper editor-map-item-wrap', appendto : HTML._mapOptionsContainer});
		HTML.bounds._H4 = Wu.DomUtil.makeit({type: 'h4', inner : 'Bounds', appendto : HTML.bounds._wrapper});
		HTML.bounds._boundsCoords = Wu.DomUtil.makeit({type : 'div', id : 'editor-map-bounds-coordinates', appendto : HTML.bounds._wrapper});
		HTML.bounds._boundsInner = Wu.DomUtil.makeit({type: 'div', id : 'map-bounds-inner', cname : 'initheight', appendto : HTML.bounds._boundsCoords});
		
		// Set bounds button
		HTML.bounds._setBoundsButton = Wu.DomUtil.makeit({type: 'button', id : 'editor-map-bounds', cname : 'smap-button-white', inner : 'Set all bounds', appendto : HTML.bounds._boundsInner, attr : [['type', 'button']]});

		// Clear bounds button
		HTML.bounds._clearBoundsButton = Wu.DomUtil.makeit({type: 'button', id : 'editor-map-bounds-clear', cname : 'smap-button-white', inner : 'Clear', appendto : HTML.bounds._boundsInner, attr : [['type', 'button']]});

		// North East Bounds
		HTML.bounds._NEwrapper = Wu.DomUtil.makeit({type : 'div', cname : 'bounds-wrapper', appendto : HTML.bounds._boundsInner});
		HTML.bounds._NEbutton = Wu.DomUtil.makeit({type : 'button', id : 'editor-map-bounds-NE', cname : 'smap-button-white', inner : 'Set North-East bounds', appendto : HTML.bounds._NEwrapper, attr : [['type', 'button']]});
		HTML.bounds._NElatInput = Wu.DomUtil.makeit({type : 'input', cname : 'form-control margined eightyWidth', id : 'editor-map-bounds-NE-lat-value', appendto : HTML.bounds._NEwrapper});
		HTML.bounds._NElngInput = Wu.DomUtil.makeit({type : 'input', cname : 'form-control margined eightyWidth', id : 'editor-map-bounds-NE-lng-value', appendto : HTML.bounds._NEwrapper});

		// South West Bounds
		HTML.bounds._SWwrapper = Wu.DomUtil.makeit({type : 'div', cname : 'bounds-wrapper', appendto : HTML.bounds._boundsInner});
		HTML.bounds._SWbutton = Wu.DomUtil.makeit({type : 'button', id : 'editor-map-bounds-SW', cname : 'smap-button-white', inner : 'Set South-West bounds', appendto : HTML.bounds._SWwrapper, attr : [['type', 'button']]});
		HTML.bounds._SWlatInput = Wu.DomUtil.makeit({type : 'input', cname : 'form-control margined eightyWidth', id : 'editor-map-bounds-SW-lat-value', appendto : HTML.bounds._SWwrapper});
		HTML.bounds._SWlngInput = Wu.DomUtil.makeit({type : 'input', cname : 'form-control margined eightyWidth', id : 'editor-map-bounds-SW-lng-value', appendto : HTML.bounds._SWwrapper});
						
		// Zoom Bounds
		HTML.bounds._zoomBounds = Wu.DomUtil.makeit({type : 'div', cname : 'bounds-wrapper zoom', appendto : HTML.bounds._boundsInner});

		// Max Zoom
		HTML.bounds._zoomBoundsLeft = Wu.DomUtil.makeit({type : 'div', cname : 'bounds-zoom-half left', appendto : HTML.bounds._zoomBounds});
		HTML.bounds._zoomBoundsLeftHeader = Wu.DomUtil.makeit({type : 'div', cname : 'bounds-zoom-h2', inner : 'Max Zoom', appendto : HTML.bounds._zoomBoundsLeft});
		HTML.bounds._zoomBoundsLeftBtn = Wu.DomUtil.makeit({type : 'button', id : 'editor-map-bounds-set-maxZoom', cname : 'smap-button-white', inner : 'Set', appendto : HTML.bounds._zoomBoundsLeft, attr : [['type', 'button']]});
		HTML.bounds._zoomBoundsLeftInput = Wu.DomUtil.makeit({type : 'input', id : 'editor-map-bounds-max-zoom-value', cname : 'form-control margined eightyWidth', appendto : HTML.bounds._zoomBoundsLeft});

		// Min Zoom
		HTML.bounds._zoomBoundsRight = Wu.DomUtil.makeit({type : 'div', cname : 'bounds-zoom-half right', appendto : HTML.bounds._zoomBounds});
		HTML.bounds._zoomBoundsRightHeader = Wu.DomUtil.makeit({type : 'div', cname : 'bounds-zoom-h2', inner : 'Min Zoom', appendto : HTML.bounds._zoomBoundsRight});
		HTML.bounds._zoomBoundsRightInput = Wu.DomUtil.makeit({type : 'input', id : 'editor-map-bounds-min-zoom-value', cname : 'form-control margined eightyWidth', appendto : HTML.bounds._zoomBoundsRight});
		HTML.bounds._zoomBoundsRightBtn = Wu.DomUtil.makeit({type : 'button', id : 'editor-map-bounds-set-minZoom', cname : 'smap-button-white', inner : 'Set', appendto : HTML.bounds._zoomBoundsRight, attr : [['type', 'button']]});



		// CONTROLS 

		// Wrapper
		HTML.controls = {};
		HTML.controls._wrap = Wu.DomUtil.makeit({type: 'div', id : 'editor-map-controls-wrap', cname : 'editor-inner-wrapper editor-map-item-wrap', appendto : HTML._mapOptionsContainer});
		HTML.controls._H4 = Wu.DomUtil.makeit({type: 'h4', inner : 'Controls', appendto : HTML.controls._wrap });
		HTML.controls._inner = Wu.DomUtil.makeit({type : 'div', id : 'editor-map-controls-inner-wrap', appendto : HTML.controls._wrap });

		// ZOOM
		HTML.controls._zoomWrapper = Wu.DomUtil.makeit({type : 'div', cname : 'item-list controls-item', appendto : HTML.controls._inner });
		HTML.controls._zoomTitle = Wu.DomUtil.makeit({type : 'div', cname : 'controls-title', id : 'map-controls-title-zoom', inner : 'Zoom', appendto : HTML.controls._zoomWrapper, attr : [['which', 'zoom']]});
		HTML.controls._zoomSwitch = Wu.DomUtil.makeit({type : 'div', cname : 'switch controls-switch', appendto : HTML.controls._zoomWrapper});
		HTML.controls._zoomSwitchInput = Wu.DomUtil.makeit({type : 'input', cname : 'cmn-toggle cmn-toggle-round-flat', id : 'map-controls-zoom', appendto : HTML.controls._zoomSwitch, attr : [['type', 'checkbox'], ['checked', 'checked']]});
		HTML.controls._zoomSwitchLabel = Wu.DomUtil.makeit({type : 'label', appendto : HTML.controls._zoomSwitch, attr : [['for', 'map-controls-zoom']]});

		// DRAW
		HTML.controls._drawWrapper = Wu.DomUtil.makeit({type : 'div', cname : 'item-list controls-item', appendto : HTML.controls._inner });
		HTML.controls._drawTitle = Wu.DomUtil.makeit({type : 'div', cname : 'controls-title', id : 'map-controls-title-draw', inner : 'Draw', appendto : HTML.controls._drawWrapper, attr : [['which', 'draw']]});
		HTML.controls._drawSwitch = Wu.DomUtil.makeit({type : 'div', cname : 'switch controls-switch', appendto : HTML.controls._drawWrapper});
		HTML.controls._drawSwitchInput = Wu.DomUtil.makeit({type : 'input', cname : 'cmn-toggle cmn-toggle-round-flat', id : 'map-controls-draw', appendto : HTML.controls._drawSwitch, attr : [['type', 'checkbox'], ['checked', 'checked']]});
		HTML.controls._drawSwitchLabel = Wu.DomUtil.makeit({type : 'label', appendto : HTML.controls._drawSwitch, attr : [['for', 'map-controls-draw']]});

		// INSPECT
		HTML.controls._inspectWrapper = Wu.DomUtil.makeit({type : 'div', cname : 'item-list controls-item', appendto : HTML.controls._inner });
		HTML.controls._inspectTitle = Wu.DomUtil.makeit({type : 'div', cname : 'controls-title', id : 'map-controls-title-inspect', inner : 'Inspect layers', appendto : HTML.controls._inspectWrapper, attr : [['which', 'inspect']]});
		HTML.controls._inspectSwitch = Wu.DomUtil.makeit({type : 'div', cname : 'switch controls-switch', appendto : HTML.controls._inspectWrapper});
		HTML.controls._inspectSwitchInput = Wu.DomUtil.makeit({type : 'input', cname : 'cmn-toggle cmn-toggle-round-flat', id : 'map-controls-inspect', appendto : HTML.controls._inspectSwitch, attr : [['type', 'checkbox'], ['checked', 'checked']]});
		HTML.controls._inspectSwitchLabel = Wu.DomUtil.makeit({type : 'label', appendto : HTML.controls._inspectSwitch, attr : [['for', 'map-controls-inspect']]});

		// DESCRIPTION
		HTML.controls._descriptionWrapper = Wu.DomUtil.makeit({type : 'div', cname : 'item-list controls-item', appendto : HTML.controls._inner });
		HTML.controls._descriptionTitle = Wu.DomUtil.makeit({type : 'div', cname : 'controls-title', id : 'map-controls-title-description', inner : 'Description', appendto : HTML.controls._descriptionWrapper, attr : [['which', 'description']]});
		HTML.controls._descriptionSwitch = Wu.DomUtil.makeit({type : 'div', cname : 'switch controls-switch', appendto : HTML.controls._descriptionWrapper});
		HTML.controls._descriptionSwitchInput = Wu.DomUtil.makeit({type : 'input', cname : 'cmn-toggle cmn-toggle-round-flat', id : 'map-controls-description', appendto : HTML.controls._descriptionSwitch, attr : [['type', 'checkbox'], ['checked', 'checked']]});
		HTML.controls._descriptionSwitchLabel = Wu.DomUtil.makeit({type : 'label', appendto : HTML.controls._descriptionSwitch, attr : [['for', 'map-controls-description']]});

		// LAYER MENU
		HTML.controls._layermenuWrapper = Wu.DomUtil.makeit({type : 'div', cname : 'item-list controls-item', appendto : HTML.controls._inner });
		HTML.controls._layermenuTitle = Wu.DomUtil.makeit({type : 'div', cname : 'controls-title', id : 'map-controls-title-layermenu', inner : 'Layer menu', appendto : HTML.controls._layermenuWrapper, attr : [['which', 'layermenu']]});
		HTML.controls._layermenuSwitch = Wu.DomUtil.makeit({type : 'div', cname : 'switch controls-switch', appendto : HTML.controls._layermenuWrapper});
		HTML.controls._layermenuSwitchInput = Wu.DomUtil.makeit({type : 'input', cname : 'cmn-toggle cmn-toggle-round-flat', id : 'map-controls-layermenu', appendto : HTML.controls._layermenuSwitch, attr : [['type', 'checkbox'], ['checked', 'checked']]});
		HTML.controls._layermenuSwitchLabel = Wu.DomUtil.makeit({type : 'label', appendto : HTML.controls._layermenuSwitch, attr : [['for', 'map-controls-layermenu']]});

		// LEGENDS
		HTML.controls._legendsWrapper = Wu.DomUtil.makeit({type : 'div', cname : 'item-list controls-item', appendto : HTML.controls._inner });
		HTML.controls._legendsTitle = Wu.DomUtil.makeit({type : 'div', cname : 'controls-title', id : 'map-controls-title-legends', inner : 'Legends', appendto : HTML.controls._legendsWrapper, attr : [['which', 'legends']]});
		HTML.controls._legendsSwitch = Wu.DomUtil.makeit({type : 'div', cname : 'switch controls-switch', appendto : HTML.controls._legendsWrapper});
		HTML.controls._legendsSwitchInput = Wu.DomUtil.makeit({type : 'input', cname : 'cmn-toggle cmn-toggle-round-flat', id : 'map-controls-legends', appendto : HTML.controls._legendsSwitch, attr : [['type', 'checkbox'], ['checked', 'checked']]});
		HTML.controls._legendsSwitchLabel = Wu.DomUtil.makeit({type : 'label', appendto : HTML.controls._legendsSwitch, attr : [['for', 'map-controls-legends']]});

		// SCALE / MEASURE
		HTML.controls._measureWrapper = Wu.DomUtil.makeit({type : 'div', cname : 'item-list controls-item', appendto : HTML.controls._inner });
		HTML.controls._measureTitle = Wu.DomUtil.makeit({type : 'div', cname : 'controls-title', id : 'map-controls-title-measure', inner : 'Scale', appendto : HTML.controls._measureWrapper, attr : [['which', 'measure']]});
		HTML.controls._measureSwitch = Wu.DomUtil.makeit({type : 'div', cname : 'switch controls-switch', appendto : HTML.controls._measureWrapper});
		HTML.controls._measureSwitchInput = Wu.DomUtil.makeit({type : 'input', cname : 'cmn-toggle cmn-toggle-round-flat', id : 'map-controls-measure', appendto : HTML.controls._measureSwitch, attr : [['type', 'checkbox'], ['checked', 'checked']]});
		HTML.controls._measureSwitchLabel = Wu.DomUtil.makeit({type : 'label', appendto : HTML.controls._measureSwitch, attr : [['for', 'map-controls-measure']]});

		// GEO LOCATION
		HTML.controls._geoWrapper = Wu.DomUtil.makeit({type : 'div', cname : 'item-list controls-item', appendto : HTML.controls._inner });
		HTML.controls._geoTitle = Wu.DomUtil.makeit({type : 'div', cname : 'controls-title', id : 'map-controls-title-geolocation', inner : 'Geolocation', appendto : HTML.controls._geoWrapper, attr : [['which', 'geolocation']]});
		HTML.controls._geoSwitch = Wu.DomUtil.makeit({type : 'div', cname : 'switch controls-switch', appendto : HTML.controls._geoWrapper});
		HTML.controls._geoSwitchInput = Wu.DomUtil.makeit({type : 'input', cname : 'cmn-toggle cmn-toggle-round-flat', id : 'map-controls-geolocation', appendto : HTML.controls._geoSwitch, attr : [['type', 'checkbox'], ['checked', 'checked']]});
		HTML.controls._geoSwitchLabel = Wu.DomUtil.makeit({type : 'label', appendto : HTML.controls._geoSwitch, attr : [['for', 'map-controls-geolocation']]});

		// BASELAYER TOGGLE
		HTML.controls._baselayerToggleWrapper = Wu.DomUtil.makeit({type : 'div', cname : 'item-list controls-item', appendto : HTML.controls._inner });
		HTML.controls._baselayerToggleTitle = Wu.DomUtil.makeit({type : 'div', cname : 'controls-title', id : 'map-controls-title-baselayertoggle', inner : 'Baselayer toggle', appendto : HTML.controls._baselayerToggleWrapper, attr : [['which', 'baselayertoggle']]});
		HTML.controls._baselayerToggleSwitch = Wu.DomUtil.makeit({type : 'div', cname : 'switch controls-switch', appendto : HTML.controls._baselayerToggleWrapper});
		HTML.controls._baselayerToggleSwitchInput = Wu.DomUtil.makeit({type : 'input', cname : 'cmn-toggle cmn-toggle-round-flat', id : 'map-controls-baselayertoggle', appendto : HTML.controls._baselayerToggleSwitch, attr : [['type', 'checkbox'], ['checked', 'checked']]});
		HTML.controls._baselayerToggleSwitchLabel = Wu.DomUtil.makeit({type : 'label', appendto : HTML.controls._baselayerToggleSwitch, attr : [['for', 'map-controls-baselayertoggle']]});

		// CARTO CSS 
		HTML.controls._cartoCSSWrapper = Wu.DomUtil.makeit({type : 'div', cname : 'item-list controls-item', appendto : HTML.controls._inner });
		HTML.controls._cartoCSSTitle = Wu.DomUtil.makeit({type : 'div', cname : 'controls-title', id : 'map-controls-title-cartocss', inner : 'CartoCSS Editor', appendto : HTML.controls._cartoCSSWrapper, attr : [['which', 'cartocss']]});
		HTML.controls._cartoCSSSwitch = Wu.DomUtil.makeit({type : 'div', cname : 'switch controls-switch', appendto : HTML.controls._cartoCSSWrapper});
		HTML.controls._cartoCSSSwitchInput = Wu.DomUtil.makeit({type : 'input', cname : 'cmn-toggle cmn-toggle-round-flat', id : 'map-controls-cartocss', appendto : HTML.controls._cartoCSSSwitch, attr : [['type', 'checkbox'], ['checked', 'checked']]});
		HTML.controls._cartoCSSSwitchLabel = Wu.DomUtil.makeit({type : 'label', appendto : HTML.controls._cartoCSSSwitch, attr : [['for', 'map-controls-cartocss']]});

		// MOUSE POSITION
		HTML.controls._mousePosWrapper = Wu.DomUtil.makeit({type : 'div', cname : 'item-list controls-item', appendto : HTML.controls._inner });
		HTML.controls._mousePosTitle = Wu.DomUtil.makeit({type : 'div', cname : 'controls-title', id : 'map-controls-title-mouseposition', inner : 'Mouse position', appendto : HTML.controls._mousePosWrapper, attr : [['which', 'mouseposition']]});
		HTML.controls._mousePosSwitch = Wu.DomUtil.makeit({type : 'div', cname : 'switch controls-switch', appendto : HTML.controls._mousePosWrapper});
		HTML.controls._mousePosSwitchInput = Wu.DomUtil.makeit({type : 'input', cname : 'cmn-toggle cmn-toggle-round-flat', id : 'map-controls-mouseposition', appendto : HTML.controls._mousePosSwitch, attr : [['type', 'checkbox'], ['checked', 'checked']]});
		HTML.controls._mousePosSwitchLabel = Wu.DomUtil.makeit({type : 'label', appendto : HTML.controls._mousePosSwitch, attr : [['for', 'map-controls-mouseposition']]});

	},

	addHooks : function () {
		
	},

	// run when sidepane activated
	_activate : function () {
	},

	// run when sidepane deactivated
	_deactivate : function () {
		this.closeAll();
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
		for (s in this.settings) {
			var setting = this.settings[s];
			setting.update();
		}

		// set height of content
		this.setContentHeight();
	},

	closeAll : function () {

		// close all options folders
		var options = app.SidePane.Options.settings;
		for (o in options) {
			var option = options[o];
			if (option._isOpen) option.close();
		}

	},

});