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
		var logo = this._logo = Wu.DomUtil.create('div', 'home-logo', container);
		var statusWrap = this._statusWrap = Wu.DomUtil.create('div', 'home-status-wrap', container);
		var status1 = Wu.DomUtil.create('div', 'home-status', statusWrap);

		// set default status
		this.clearStatus();

		// add to sidepane if assigned container in options
		if (this.options.addTo) this.addTo(this.options.addTo);

	},

	addHooks : function () {
		// open sidepane menu on mousedown
		Wu.DomEvent.on(this._container, 'mousedown', this.toggle, this);
	},

	toggle : function () {
		
		this.isOpen ? this.close() : this.open();
	},

	// open sidepane menu
	open : function (e) {
				
		this.isOpen = true;
		var sidepane = app.SidePane;
		sidepane.expand();
		this.refresh();
	},

	// close sidepane menu
	close : function (e) {
		this.isOpen = false;
		var sidepane = app.SidePane;
		sidepane.collapse();
		sidepane.closePane();
		this.refresh();

		var __map = Wu.DomUtil.get("map"); // (j)
		Wu.DomUtil.removeClass(__map, "map-blur") // (j) – removes the blur on map if it's set by one of the fullpanes

		// Close menuslider arrow (j)
		// var _menusliderArrow = Wu.DomUtil.get("menuslider-arrow"); // (j)
		// _menusliderArrow.style.width = '0px'; // (j)

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
		if (!this.project) return;
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

	setStatus : function (message, timer) {
		var that = this;

		// clear last clearTimer
		if (this.clearTimer) clearTimeout(this.clearTimer);

		// create div
		var status = Wu.DomUtil.create('div', 'home-status');
		
		// set message
		status.innerHTML = message;
		
		// push onto dom
		this.pushStatus(status);

		// clearTimer
		this.clearTimer = setTimeout(function () {
			that.clearStatus();
		}, timer || 3000);
	
	},

	getStatus : function () {
		return this._statusWrap.firstChild.innerHTML;
	},

	pushStatus : function (div) {

		// get old status div, insertBefore
		var old = this._statusWrap.firstChild;
		this._statusWrap.insertBefore(div, old);
		
		// set height
		div.style.height = '27px';

		// remove old
		Wu.DomUtil.remove(old);
		
	},

	clearStatus : function () {
		// set default string
		var portalName = app.getPortalName();
		
		// do nothing if same
		if (portalName == this.getStatus()) return;

		// set status
		this.setStatus(portalName);
	},

});