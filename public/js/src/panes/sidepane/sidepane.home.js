Wu.SidePane.Home = Wu.Class.extend({

	initialize : function (options) {
		
		// set options
		Wu.setOptions(this, options);

		// init container
		this.initContainer();

		// add hooks
		this.addHooks();
	},

	initContainer : function () {

		// create div
		var container = this._container = Wu.DomUtil.create('div', 'home-container');

		// add to sidepane
		if (this.options.addTo) this.addTo(this.options.addTo);

	},

	addHooks : function () {
		// open pane on mouseover
		Wu.DomEvent.on(this._container, 'mousedown', this.toggle, this);
	},

	toggle : function () {
		this.isOpen ? this.close() : this.open();
	},

	open : function (e) {
		this.isOpen = true;
		var sidepane = app.SidePane;
		sidepane.expand();
		this.refresh();
	},

	close : function (e) {
		this.isOpen = false;
		var sidepane = app.SidePane;
		sidepane.collapse();
		sidepane.closePane();
		this.refresh();
	},

	addTo : function (wrapper) {
		// insert first in wrapper
		wrapper.insertBefore(this._container, wrapper.firstChild);
	},

	setHeight : function (height) {
		// set height
		this._container.style.height = parseInt(height) + 'px';
	},

	refresh : function () {
		// set height to project headerHeight
		var headerHeight = this.project.getHeaderHeight();
		this.setHeight(headerHeight);
	},

	updateContent : function (project) {
		this.project = project;

		// refresh height
		this.refresh();

		// collapse errything to just logo
		this.close();

	},






});