Wu.Chrome.Data = Wu.Chrome.extend({

	_ : 'datachrome', 

	options : {
		defaultWidth : 350
	},

	_initialize : function () {

		// init container
		this.initContainer();

		// add hooks
		this._addEvents();
		
	},

	initContainer : function () {

		// create the container (just a div to hold errythign)
		this._outerContainer = Wu.DomUtil.create('div', 'chrome chrome-container chrome-right chrome-data', app._appPane);

		this.initContent();


	},

	_addEvents : function () {
		// todo
		Wu.DomEvent.on(window, 'resize', this._windowResize, this);
	},

	_removeEvents : function () {
		Wu.DomEvent.off(window, 'resize', this._windowResize, this);
	},

	_windowResize : function () {
	},

	getDimensions : function () {

		var dims = {
			width : this.options.defaultWidth,
			height : this._outerContainer.offsetHeight
		}

		return dims;
	},


	open : function (tab) {
		
		// set width of right pane
		this._outerContainer.style.width = this.options.defaultWidth + 'px';

		// move map
		this.moveMap('open');
	},

	close : function () {

		// set width of right pane
		this._outerContainer.style.width = '0';

		// move map
		// this.moveMap('close');
		if ( !app.Chrome.Right.isOpen ) this.moveMap('close');

	},

	// helper fn, todo: refactor
	moveMap : function (direction) {

		// div = map container
		var div = app.MapPane._container;

		// get current map width
		var currentWidth = div.offsetWidth;

		// default: full width
		var width = '100%';

		// if open, set width to current minus width of right chrome
		if (direction == 'open') width = currentWidth - this.options.defaultWidth + 'px';

		// set width
		div.style.width = width;
	},




	// HERE IT BEGINS!!!

	initContent : function () {



	},


});



