Wu.Chrome.Center = Wu.Chrome.extend({

	_ : 'centerchrome', 

	_initialize : function (options) {
		console.log('rightchrome init', this);

		// init container
		this.initContainer();

		// add hooks
		this.addHooks();
	},

	initContainer : function () {

		this._container = Wu.DomUtil.create('div', 'chrome chrome-container chrome-center', app._appPane);

	},

	addHooks : function () {

	},


	open : function () {
		
	},

	close : function () {

	},



});