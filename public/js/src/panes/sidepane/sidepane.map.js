Wu.SidePane.Map = Wu.SidePane.Item.extend({
	_ : 'sidepane.map', 

	type : 'map',

	title : 'Options',

	initContent : function () {

		// longhand 
		this.app = Wu.app;

		// content to template
		this._container.innerHTML = ich.editorMapBaseLayer();
		this._settingsContainer = Wu.DomUtil.get('mapsettings-container');

		// set panes
		this._panes = {};

		// this._panes.projectTitle = Wu.DomUtil.get('h4-map-configuration-project-name');

		// init each setting
		this.mapSettings = {};
		this.mapSettings.baselayer = new Wu.SidePane.Map.BaseLayers();
		this.mapSettings.layermenu = new Wu.SidePane.Map.LayerMenu();
		this.mapSettings.bounds    = new Wu.SidePane.Map.Bounds();
		this.mapSettings.position  = new Wu.SidePane.Map.Position();
		this.mapSettings.controls  = new Wu.SidePane.Map.Controls();
		this.mapSettings.connect   = new Wu.SidePane.Map.Connect(this._settingsContainer);  // refactor container, ich.template

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

	// setContentHeight : function () {
	// 	this.calculateHeight();
	// 	this._content.style.maxHeight = this.maxHeight + 'px';
	// 	console.log('this.scroll', this._scrollWrapper);
	// 	this._scrollWrapper.style.maxHeight = parseInt(this.maxHeight - 20) + 'px';
	// },

	// calculateHeight : function () {
	// 	var screenHeight = window.innerHeight,
	// 	    legendsControl = app.MapPane.legendsControl,
	// 	    height = -107;

	// 	if (legendsControl) {
	// 		height += parseInt(screenHeight) - parseInt(legendsControl._legendsHeight);
	// 	} else {
	// 		height += parseInt(screenHeight) - 6;
	// 	}

	// 	this.maxHeight = height;
	// },



});