Wu.Chrome.SettingsContent.SettingsSelector = Wu.Chrome.SettingsContent.extend({

	_ : 'settingsSelector',

	options : {

		tabs : {
			styler : {
				enabled : true,
				text : 'Style'
			},
			tooltip : {
				enabled : true,
				text : 'Popup'
			},
			filters : {
				enabled : true,
				text : 'Filters'
			},
			cartocss : {
				enabled : true,
				text : 'CartoCSS'
			},
			extras : {
				enabled : true,
				text : 'Extras'
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


		app.Tools = app.Tools || {};
		app.Tools.SettingsSelector = this;

	},

	_refresh : function () {

		// access_v2
		// this._settingsButton.style.display = )app.activeProject.isEditable( ? '' : 'none';

		if (app.activeProject.isEditable()) {
			Wu.DomUtil.removeClass(this._settingsButton, 'disabledBtn');
		} else {
			Wu.DomUtil.addClass(this._settingsButton, 'disabledBtn');
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
		// this._title = Wu.DomUtil.create('div', 'chrome chrome-content settings-title', this._header, 'Settings');

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
			context : this,
			project_dependent : true
		});

		// css experiement
		this._settingsButton.innerHTML = '<i class="top-button fa fa-paint-brush"></i>Style';
	},

	_initTabs : function () {

		// tabs object
		this._tabs = {};

		// button wrapper
		this._buttonWrapper = Wu.DomUtil.create('div', 'chrome chrome-content settings-button-wrapper', this._header);
		
		// create tabs
		for (var o in this.options.tabs) {
			if (this.options.tabs[o].enabled) {

				var text = this.options.tabs[o].text;
				var tab = o.camelize();

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

		if (!app.activeProject.isEditable()) return; // safeguard

		// right chrome
		var chrome = this.options.chrome;

		// open/close
		this._isOpen ? this.close() : this.open(); // pass this tab

		if (this._isOpen) {
			
			// fire event
			app.Socket.sendUserEvent({
			    	user : app.Account.getFullName(),
			    	event : 'opened',
			    	description : 'the settings',
			    	timestamp : Date.now()
			})
		}
	},

	open : function () {
		if (!app.activeProject.isEditable()) return;
		this._open();
	},
	_open : function () {
		var chrome = this.options.chrome;
		chrome.open(this);
	},
	close : function () {
		var chrome = this.options.chrome;
		chrome.close(this);
	},

	_show : function () {

		Wu.DomUtil.addClass(this._settingsButton, 'active');

		this._container.style.display = 'block';
		this._isOpen = true;

		Wu.DomUtil.addClass(this._settingsButton, 'active');
	},

	_hide : function () {

		Wu.DomUtil.removeClass(this._settingsButton, 'active');

		this._container.style.display = 'none';
		this._isOpen = false;

		Wu.DomUtil.removeClass(this._settingsButton, 'active');
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
