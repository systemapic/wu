Wu.Chrome.Bottom = Wu.Chrome.extend({

	_ : 'bottomchrome', 

	_initialize : function (options) {

		// init container
		this.initContainer();

		// add hooks
		this.addHooks();
	},

	initContainer : function () {
		this._container = Wu.DomUtil.create('div', 'chrome chrome-container chrome-bottom', app._appPane);
	},

	addHooks : function () {

	},
});