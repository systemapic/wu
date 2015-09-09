Wu.Chrome.SettingsContent.SettingsSelector = Wu.Chrome.SettingsContent.extend({

	options : {

		tabs : {
			styler : {
				enabled : true,
				text : 'Style Editor'
			},
			layers : {
				enabled : true,
				text : 'Layers'
			},
			tooltip : {
				enabled : true,
				text : 'Tooltip'
			},
			
			filters : {
				enabled : true,
				text : 'Data Filters'
			},
			
			mapsettings : {
				enabled : true,
				text : 'Map Settings'
			},	

			cartocss : {
				enabled : true,
				text : 'CartoCSS'
			},
		}
		
	},

	_initialize : function (options) {

		// set options
		Wu.setOptions(this, options);

		// init container
		this._initContainer();

		// init content
		this._initContent();

		// register a button in top chrome
		this._registerButton();

		// hide by default
		this._hide();
	},

	_refresh : function () {

		// remove settings button if no access to edit project
		if (app.Access.to.edit_project(app.activeProject.getUuid())) { 			// todo: check if working
			Wu.DomUtil.removeClass(this._settingsButton, 'displayNone');
		} else {
			Wu.DomUtil.addClass(this._settingsButton, 'displayNone');
		}
	},


	_initContainer : function () {

		// create container
		this._container = Wu.DomUtil.create('div', 'chrome chrome-content settingsSelector', this.options.appendTo);

		// header wrapper
		this._header = Wu.DomUtil.create('div', 'settingsSelector-header', this._container)

		// tabs wrapper
		this._tabsWrapper = Wu.DomUtil.create('div', 'chrome chrome-content settings-tabs-wrapper', this._container);



	},

	_initContent : function () {

		// title
		this._title = Wu.DomUtil.create('div', 'chrome chrome-content settings-title', this._header, 'Settings');

		// tabs
		this._initTabs();
	},

	_registerButton : function () {

		// top
		var top = app.Chrome.Top;

		// add a button to top chrome
		this._settingsButton = top._registerButton({
			name : 'settingsSelector',
			className : 'chrome-button settingsSelector',
			trigger : this._togglePane,
			context : this
		});
	},



	_initTabs : function () {

		// tabs object
		this._tabs = {};

		// button wrapper
		this._buttonWrapper = Wu.DomUtil.create('div', 'chrome chrome-content settings-button-wrapper', this._header);
		
		// create tabs
		for ( var o in this.options.tabs) {
			if (this.options.tabs[o].enabled) {

				var text = this.options.tabs[o].text;

				var tab = o.camelize();

				console.log('tab: ', tab);

				// create tab contents
				if (Wu.Chrome.SettingsContent[tab]) {

					// create tab button
					var trigger = Wu.DomUtil.create('div', 'chrome chrome-content settings-button', this._buttonWrapper, text);

					// create content
					this._tabs[tab] = new Wu.Chrome.SettingsContent[tab]({
						options : this._options,
						trigger : trigger,
						appendTo : this._tabsWrapper,
						parent : this
					});
				}
			}
		}

	},


	getTabs : function () {
		return this._tabs;
	},


	_togglePane : function () {

		// right chrome
		var chrome = this.options.chrome;

		// open/close
		this._isOpen ? chrome.close(this) : chrome.open(this); // pass this tab
	},

	_show : function () {
		this._container.style.display = 'block';
		this._isOpen = true;
	},

	_hide : function () {
		this._container.style.display = 'none';
		this._isOpen = false;
	},

	onOpened : function () {

		// default styler
		this._tabs['Styler'].show();
	},

	// clean up on close
	onClosed : function () {
		for (var t in this._tabs) {
			this._tabs[t].closed();
		}

		// Make sure the "add folder"/editing of layer menu is closed
		var layerMenu = app.MapPane.getControls().layermenu;	 // move to settings selector
		if (layerMenu) layerMenu.disableEdit();
	},

	_refreshAll : function () {
		for (var t in this._tabs) {
			this._tabs[t]._refresh();
		}
	},
});