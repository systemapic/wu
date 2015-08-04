Wu.Chrome.Right = Wu.Chrome.extend({

	_ : 'rightchrome', 

	_initialize : function (options) {
		console.log('rightchrome init', this);

		// init container
		this.initContainer();

		// add hooks
		this.addHooks();
	},

	initContainer : function () {

		this._container = Wu.DomUtil.create('div', 'chrome chrome-container chrome-right', app._appPane);

	},

	addHooks : function () {

	},



});