Wu.StatusPane = Wu.Class.extend({


	// just one time for portal
	initialize : function (options) {

		// set options
		Wu.setOptions(this, options);

		// init container
		this.initLayout();
	},


	initLayout : function () {

		// create divs
		var container = this._container = Wu.DomUtil.create('div', 'status-container', app._appPane);
		var icon = this._icon = Wu.DomUtil.create('div', 'status-icon', container);
		var img = this._iconImg = Wu.DomUtil.create('img', 'status-icon-img', icon);
		var status = this._status = Wu.DomUtil.create('div', 'status-message', container, 'Ready');

	},

	setStatus : function (message) {
		this._status.innerHTML = message;
	},

	clearStatus : function () {
		this._status.innerHTML = '';

	},

	getStatus : function () {
		return this._status.innerHTML;
	},



})