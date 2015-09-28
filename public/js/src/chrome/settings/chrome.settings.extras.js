Wu.Chrome.SettingsContent.Extras = Wu.Chrome.SettingsContent.extend({

	_ : 'extras',

	_initialize : function () {

		// init container
		this._initContainer();

		// add events
		this._addEvents();

	},

	_initContainer : function () {

		console.log('container -- ', this);

		// create container
		this._container = Wu.DomUtil.create('div', 'chrome chrome-content chrome-pane extras', this.options.appendTo);
	},

	_initLayout : function () {

	},

	_refresh : function () {
		this._flush();
		this._initLayout();
	},

	_flush : function () {
		this._container.innerHTML = '';
	},
});