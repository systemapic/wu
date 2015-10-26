Wu.Chrome.Projects = Wu.Chrome.extend({

	_ : 'projects', 

	options : {
		defaultWidth : 250
	},

	_initialize : function () {

		// init container
		this._initContainer();
	
		// init content
		this._initContent();
	},

	_initContainer : function () {
		this._container = Wu.DomUtil.create('div', 'chrome-projects chrome-projects-container', this.options.appendTo);
	},

	_initContent : function () {

		// todo: remove dummy
		var dummy = Wu.DomUtil.create('div', 'dummy', this._container);
		dummy.innerHTML = 'projects, etc';
		dummy.style.marginTop = '35px';
	
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
		this._container.style.width = this.options.defaultWidth + 'px';
		this._isOpen = true;
	},

	_hide : function () {
		this._container.style.display = 'none';
		this._container.style.width = 0;
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