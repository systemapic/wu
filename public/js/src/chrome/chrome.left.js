Wu.Chrome.Left = Wu.Chrome.extend({

	_ : 'leftchrome', 

	_initialize : function (options) {

		// init container
		this.initContainer();

		// add hooks
		this.addHooks();
	},

	initContainer : function () {
		this._container = Wu.DomUtil.create('div', 'chrome chrome-container chrome-left', app._appPane);
	},

	addHooks : function () {

	},



});