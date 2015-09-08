Wu.Chrome.Right = Wu.Chrome.extend({

	_ : 'rightchrome', 

	options : {
		defaultWidth : 350,
		editingLayer : false
		
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
	},

	getDimensions : function () {

		var dims = {
			width : this.options.defaultWidth,
			height : this._container.offsetHeight
		}

		return dims;
	},


	open : function () {
		
		// set width of right pane
		this._container.style.width = this.options.defaultWidth + 'px';
		this._container.style.display = 'block';

		// move map
		this.moveMap('open');

		// fire event?
		this._settingsSelector.opened();
	},

	close : function () {

		// set width of right pane
		this._container.style.width = '0';
		this._container.style.display = 'none';

		// move map
		if ( !app.Chrome.Data.isOpen ) this.moveMap('close');

		// fire event?
		this._settingsSelector.closed();

		// Make sure the "add folder"/editing of layer menu is closed
		var layerMenu = app.MapPane.getControls().layermenu;
		if (layerMenu) layerMenu.disableEdit();



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