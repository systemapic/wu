Wu.SidePane.Options.Item = Wu.Class.extend({
	_ : 'sidepane.options.item',

	type : 'options.item',

	initialize : function (container) {

		this.panes = {};

		// get panes
		this.mapsettingsContainer = Wu.DomUtil.get('mapsettings-container');
		this.getPanes();

		// init layout
		this.initLayout(container);
		
		// add hooks
		this.addHooks();

	},

	buttonDown : function (e) {
		Wu.DomUtil.addClass(e.target, 'btn-info');
	},

	buttonUp : function (e) {
		Wu.DomUtil.removeClass(e.target, 'btn-info');
	},

	update : function () {
		// set active project
		this.project = app.activeProject;

	},

	addHooks : function () {
		Wu.DomEvent.on(this._container, 'mousedown', this.toggleOpen, this);
	},

	removeHooks : function () {
		// todo!!!
	},

	calculateHeight : function () {
		this.maxHeight = this._inner.offsetHeight + 15;
		this.minHeight = 0;
	},

	// fn for open on hover.. not in use atm
	pendingOpen : function () {
		if (app._timerOpen) clearTimeout(app._timerOpen);
		if (this._isOpen) return;

		var that = this;
		app._timerOpen = setTimeout(function () {
			that.open();
			if (app._pendingClose) app._pendingClose.close();
			app._pendingClose = that;
		}, 200);	
	},

	toggleOpen : function () {
		if (this._isOpen) {
			this.close();
		} else {
			this.open();
			app.Analytics.setGaEvent(['Side Pane', 'Options select: ' + this.type]);
		}
	},

	open : function () {
		this.calculateHeight();
		this._outer.style.height = this.maxHeight + 20 + 'px';       
		this._open(); // local fns   
		this._isOpen = true;

		if (app._pendingClose && app._pendingClose != this) {
			app._pendingClose.close();
		}
		app._pendingClose = this;
	},


	close : function () {   				// perhaps todo: now it's closing every pane, cause addHooks been run 6 times.
		// console.log('close ', this.type);		// set this to app._pendingclose here for just one close... 
		this.calculateHeight();
		this._outer.style.height = this.minHeight + 'px';        
		this._close();
		this._isOpen = false;
		app._pendingClose = false;
		if (app._timerOpen) clearTimeout(app._timerOpen);
	},

	_open : function () {
		// noop
		app.SidePane.Options.settings.layermenu.disableEdit();
	}, 

	_close : function () {
		// noop
		
	},

	initLayout : function () {
		// noop
	},

	getPanes : function () {
		// noop
	},

	// sort layers by provider
	sortLayers : function (layers) {
		// console.log('sortLayers, layers:', layers);
		// possible keys in layer.store.data. must add more here later if other sources
		// var keys = ['geojson', 'mapbox', 'osm', 'raster'];
		var keys = ['geojson', 'mapbox', 'raster', 'postgis', 'norkart', 'google'];
		var results = [];
		keys.forEach(function (key) {
			var sort = {
				key : key,
				layers : []
			}
			for (l in layers) {
				var layer = layers[l];

				if (layer) {

					if (layer.store && layer.store.data.hasOwnProperty(key)) {
						sort.layers.push(layer)
					}
				}
			}
			results.push(sort);
		}, this);

		// console.log('SROOTED', results);
		this.numberOfProviders = results.length;
		return results;
	},

	addProvider : function (provider) {
		var title = '';
		if (provider == 'postgis') title = 'Data Library';
		// if (provider == 'raster') title = 'Rasters';
		if (provider == 'mapbox') title = 'Mapbox';
		if (provider == 'norkart') title = 'Norkart';
		// if (provider == 'osm') title = 'Open Street Map';
		if (provider == 'osm') return;
		var header = Wu.DomUtil.create('div', 'item-list-header', this._outer, title)
	},

	fillLayers : function () {

		this._layers = {};

		// return if no layers
	       	if (_.isEmpty(this.project.layers)) return;

	       	var sortedLayers = this.sortLayers(this.project.layers);

	       	sortedLayers.forEach(function (provider) {

	       		this.addProvider(provider.key);

	       		provider.layers.forEach(function (layer) {
	       			this.addLayer(layer);
	       		}, this);

	       	}, this);

	       	// calculate height for wrapper
	       	this.calculateHeight();

	},

});