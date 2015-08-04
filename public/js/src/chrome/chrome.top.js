Wu.Chrome.Top = Wu.Chrome.extend({

	_ : 'topchrome', 

	_initialize : function (options) {
		console.log('top chrome init', this);

		// init container
		this.initContainer();

		// add hooks
		this.addHooks();
	},

	initContainer : function () {

		this._container = Wu.DomUtil.create('div', 'chrome chrome-container chrome-top', app._appPane);

	},

	addHooks : function () {

	},



});