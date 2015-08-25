Wu.Chrome.Right = Wu.Chrome.extend({

	_ : 'rightchrome', 

	options : {
		defaultWidth : 350,
		
	},

	_initialize : function () {
		console.log('rightchrome init', this);

		// init container
		this.initContainer();

		// add hooks
		this._addEvents();
	},

	initContainer : function () {

		// create the container (just a div to hold errythign)
		this._container = Wu.DomUtil.create('div', 'chrome chrome-container chrome-right', app._appPane);

		// create settings selector
		this._settingsSelector = new Wu.Chrome.Content.SettingsSelector({
			appendTo : this._container
		});

	},

	_addEvents : function () {
		// todo
		Wu.DomEvent.on(window, 'resize', this._windowResize, this);
	},

	_removeEvents : function () {
		Wu.DomEvent.off(window, 'resize', this._windowResize, this);
	},

	_windowResize : function () {
		console.log('window resize!');
	},

	getDimensions : function () {

		var dims = {
			width : this.options.defaultWidth,
			height : this._container.offsetHeight
		}

		return dims;

	},


	open : function () {
		console.log('open right chrome');
		
		// set width of right pane
		this._container.style.width = this.options.defaultWidth + 'px';

		// move map
		this.moveMap('open');

		// fire event?
		this._settingsSelector.opened();
	},

	close : function () {
		console.log('close right chrome');

		// set width of right pane
		this._container.style.width = '0';

		// move map
		this.moveMap('close');

		// fire event?
		this._settingsSelector.closed();

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