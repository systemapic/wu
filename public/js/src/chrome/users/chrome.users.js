Wu.Chrome.Users = Wu.Chrome.extend({

	_ : 'users', 

	options : {
		defaultWidth : 400
	},

	_initialize : function () {

		console.log('_initialize', this._);

		// init container
		this._initContainer();

		// init content
		this._initContent();

	},

	_initContainer : function () {
		this._container = Wu.DomUtil.create('div', 'chrome-users', this.options.appendTo);
	},
	
	_initContent : function () {

		var dummy = Wu.DomUtil.create('div', 'dummy', this._container);
		dummy.innerHTML = 'users, etc';
	},
	

	_onLayerAdded : function (options) {
	},

	_onFileDeleted : function () {
	},

	_onLayerDeleted : function () {
	},

	_onLayerEdited : function () {
	},

	_registerButton : function () {

	},

	_togglePane : function () {

		// right chrome
		var chrome = this.options.chrome;

		// open/close
		this._isOpen ? chrome.close(this) : chrome.open(this); // pass this tab

		if (this._isOpen) {
			// fire event
			app.Socket.sendUserEvent({
				user : app.Account.getFullName(),
				event : 'opened',
				description : 'the left pane',
				timestamp : Date.now()
			})
		}
	},

	_show : function () {

		this._container.style.display = 'block';
		this._isOpen = true;

	},

	_hide : function () {

		this._container.style.display = 'none';
		this._isOpen = false;
	},

	onOpened : function () {
	},

	onClosed : function () {
	},

	_addEvents : function () {
	},

	_removeEvents : function () {
	},

	_onWindowResize : function () {
	},

	getDimensions : function () {
		var dims = {
			width : this.options.defaultWidth,
			height : this._container.offsetHeight
		}
		return dims;
	},

	_refresh : function () {
		if ( !this._project ) return;
	},

});