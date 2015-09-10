Wu.Chrome.Right = Wu.Chrome.extend({

	_ : 'rightchrome', 

	options : {
		defaultWidth : 350,
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

			// create settings selector
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
		Wu.DomEvent.on(window, 'resize', this._onWindowResize, this);
	},

	_removeEvents : function () {
		Wu.DomEvent.off(window, 'resize', this._onWindowResize, this);
	},

	_onWindowResize : function () {

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

		console.log('chrome right open => tab: ', tab._);
		
		// hide all tabs
		this._forEachTab(function (tab) {
			tab._hide();
			tab.onClosed();
		});

		// show tab
		tab._show();
		tab.onOpened();

		// if chrome already open
		if (this._isOpen) return;

		this._isOpen = true;

		// set width of right pane
		this._container.style.width = this.options.defaultWidth + 'px';
		this._container.style.display = 'block';

		// move map
		var map = app.MapPane._container;
		var width = map.offsetWidth - this.options.defaultWidth;
		map.style.width = width + 'px';

	},

	close : function (tab) {
		console.log('chrome right close => tab: ', tab._);
		
		// hide tab
		if (tab._hide) tab._hide();
		if (tab.onClosed) tab.onClosed();

		if (!this._isOpen) return;

		console.log('2'); // on right chrome complete close (not switch)

		this._isOpen = false;

		// set width of right pane
		this._container.style.width = '0';
		this._container.style.display = 'none';

		// set map fullscreen
		var map = app.MapPane._container;
		map.style.width = '100%';

	},


	
});