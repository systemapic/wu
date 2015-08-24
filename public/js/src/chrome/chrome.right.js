Wu.Chrome.Right = Wu.Chrome.extend({

	_ : 'rightchrome', 

	options : {
		defaultWidth : 400,
		
	},

	_initialize : function () {
		console.log('rightchrome init', this);

		// init container
		this.initContainer();

		// add hooks
		this.addHooks();
	},

	initContainer : function () {

		// create the container (just a div to hold errythign)
		this._container = Wu.DomUtil.create('div', 'chrome chrome-container chrome-right', app._appPane);

		// create the style editor
		this._styleEditor = new Wu.Chrome.Content.StyleEditor({
			appendTo : this._container
		});

		// create other containers for other type content
		// ...

	},

	addHooks : function () {
		// todo
	},


	open : function () {
		console.log('open right chrome');
		
		// set width of right pane
		this._container.style.width = this.options.defaultWidth + 'px';

		// move map
		this.moveMap('open');
	},

	close : function () {
		console.log('close right chrome');

		// set width of right pane
		this._container.style.width = '0';

		// move map
		this.moveMap('close');
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



});