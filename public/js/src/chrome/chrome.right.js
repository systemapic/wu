Wu.Chrome.Right = Wu.Chrome.extend({

	_ : 'rightchrome', 

	options : {
		// defaultWidth : 402,
		defaultWidth : 443,
		editingLayer : false,
		tabs : {
			settings : true,
			data : true
		}
	},

	_initialize : function () {

		// init container
		this.initContainer();

		// add hooks
		this._addEvents();
	},

	initContainer : function () {

		// create the container (just a div to hold errythign)
		this._container = Wu.DomUtil.create('div', 'chrome chrome-container chrome-right', app._appPane);

		// holder for all tabs
		this._tabs = {};

		// data tab
		if (this.options.tabs.data) {

			// create data selector
			this._tabs.data = new Wu.Chrome.Data({
				appendTo : this._container,
				chrome : this // ie. right chrome
			});
		}

		// settings tab
		if (this.options.tabs.settings) {

			// create settings selector
			this._tabs.settings = new Wu.Chrome.SettingsContent.SettingsSelector({
				appendTo : this._container,
				chrome : this
			});
		}
	},

	_addEvents : function () {
		// todo
		Wu.DomEvent.on(window, 'resize', _.throttle(this._onWindowResize, 1000), this);
	},

	_removeEvents : function () {
		Wu.DomEvent.off(window, 'resize', this._onWindowResize, this);
	},

	_onWindowResize : function () {
		if (app._map) app._map.invalidateSize();
	},

	getDimensions : function () {
		var dims = {
			width : this.options.defaultWidth,
			height : this._container.offsetHeight
		}
		return dims;
	},

	// helper fn
	_forEachTab : function (fn) {
		for (var t in this._tabs) {
			var tab = this._tabs[t];
			fn(tab);
		}
	},

	open : function (tab) {

		// close other tabs
		Wu.Mixin.Events.fire('closeMenuTabs');

		// hide all tabs
		this._forEachTab(function (tab) {
			tab._hide();
			tab.onClosed();
		});

		// css exp
		// app.Chrome.Left.close();

		// show tab
		tab._show();
		tab.onOpened();

		// if chrome already open
		if (this._isOpen) return;

		this._isOpen = true;
		this._currentTab = tab;

		// set width of right pane
		this._container.style.width = this.options.defaultWidth + 'px';
		this._container.style.display = 'block';

		// set height for styler pane
		// if (tab._ == 'settingsSelector') {
			// this._container.style.height = '75%';
		// } else {
			this._container.style.height = '100%'; // todo, css exp
		// }

		// update size
		this.updateMapSize(); // css exp

		// set buttons inverted
		// Wu.DomUtil.addClass(app.Chrome.Top._buttonWrapper, 'inverted');

	},

	close : function (tab) {

		var tab = tab || this._currentTab;
		
		// hide tab
		if (tab && tab._hide) tab._hide();
		if (tab && tab.onClosed) tab.onClosed();

		if (!this._isOpen) return;

		this._isOpen = false;

		// set width of right pane
		this._container.style.width = '0';
		this._container.style.display = 'none';

		// update size
		this.updateMapSize();

		// set buttons inverted
		// Wu.DomUtil.removeClass(app.Chrome.Top._buttonWrapper, 'inverted');
	},

	_onCloseMenuTabs : function () {

		this.close();
	},
});