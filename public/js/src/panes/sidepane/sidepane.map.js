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