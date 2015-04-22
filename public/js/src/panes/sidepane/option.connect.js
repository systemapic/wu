Wu.SidePane.Options.Connect = Wu.SidePane.Options.Item.extend({
	_ : 'sidepane.map.connect', 

	type : 'connect',			

	initLayout : function (container) {
		
		// container, header, outer
		this._container	 	= Wu.DomUtil.create('div', 'editor-inner-wrapper editor-map-item-wrap ct12 ct17 ct23', container);
		var h4 			= Wu.DomUtil.create('h4', '', this._container, 'Connected Sources');
		this._outer 		= Wu.DomUtil.create('div', 'connect-outer', this._container);

		// import OSM
		var box 		= Wu.DomUtil.create('div', 'connect-osm', this._outer);
		var h4_3		= Wu.DomUtil.create('div', 'connect-title', box, 'Open Street Map');
		this._osmwrap 		= Wu.DomUtil.create('div', 'osm-connect-wrap', this._outer);
		this._osmbox 		= Wu.DomUtil.create('div', 'osm-add-box smap-button-white', this._osmwrap, 'Add OSM layer');

		// mapbox connect
		var wrap 	  	= Wu.DomUtil.create('div', 'connect-mapbox', this._outer);
		var h4_2 		= Wu.DomUtil.create('div', 'connect-title', wrap, 'Mapbox');
		this._mapboxWrap  	= Wu.DomUtil.create('div', 'mapbox-connect-wrap', this._outer);
		this._mapboxInput 	= Wu.DomUtil.create('input', 'input-box search import-mapbox-layers', this._mapboxWrap);
		this._mapboxConnect 	= Wu.DomUtil.create('div', 'smap-button-white import-mapbox-layers-button', this._mapboxWrap, 'Add');
		this._mapboxAccounts 	= Wu.DomUtil.create('div', 'mapbox-accounts', this._mapboxWrap);
		
		// clear vars n fields
		this.resetInput();

		// add tooltip
		app.Tooltip.add(h4, 'Imports layers from MapBox accounts.');

	},

	addHooks : function () {

		Wu.SidePane.Options.Item.prototype.addHooks.call(this)

		// connect mapbox button
		Wu.DomEvent.on( this._mapboxConnect, 'click', this.importMapbox, this );

		// add osm button
		Wu.DomEvent.on( this._osmbox, 'click', this.addOSMLayer, this );

		// stops
		Wu.DomEvent.on( this._mapboxConnect, 'mousedown', Wu.DomEvent.stop, this );
		Wu.DomEvent.on( this._mapboxInput, 'mousedown', Wu.DomEvent.stopPropagation, this );
		Wu.DomEvent.on( this._osmwrap, 'mousedown', Wu.DomEvent.stopPropagation, this );
		Wu.DomEvent.on( this._osmbox, 'mousedown', Wu.DomEvent.stopPropagation, this );

	},

	removeHooks : function () {
		// todo!!!
	},	

	calculateHeight : function () {
		var num = this.project.getMapboxAccounts().length;
		this.maxHeight = 150 + num * 30;
		this.minHeight = 0;
	},

	// get mapbox access token
	tokenMode : function () {
		this._username = this._mapboxInput.value;
		this._mapboxInput.value = '';
		this._askedToken = true;
		this._mapboxConnect.innerHTML = 'OK';
		this._mapboxInput.setAttribute('placeholder', 'Enter access token');
	},

	// reset temp vars
	resetInput : function () {
		this._username = null;
		delete this._username;
		this._askedToken = false;
		this._mapboxConnect.innerHTML = 'Add';
		this._mapboxInput.setAttribute('placeholder', 'Mapbox username');
		this._mapboxInput.value = '';
	},

	addOSMLayer : function () {

		// create layer
		this.project.createOSMLayer(function (err, layer) {

			// add to baselayer, layermenu
			this._updateLayerOptions();

		}.bind(this));

		// Google Analytics event tracking
		app.Analytics.setGaEvent(['Side Pane', 'Options > Connected Src: add osm layer']);

	},

	_updateLayerOptions : function () {

		// update contents in Options/Baselayers + Layermenu
		app.SidePane.Options.settings.baselayer.update();
		app.SidePane.Options.settings.layermenu.update();
	},

	// on click when adding new mapbox account
	importMapbox : function () {

		if (!this._askedToken) return this.tokenMode();

		// get username
		var username = this._username;
		var accessToken = this._mapboxInput.value;

		// clear
		this.resetInput();

		// get mapbox account via server
		this._importMapbox(username, accessToken, this.importedMapbox);

		// Google Analytics event tracking
		app.Analytics.setGaEvent(['Side Pane', 'Options > Connected Src: import mapbox']);


	},

	_importMapbox : function (username, accessToken, callback) {

		// get mapbox account via server
		var data = {
			'username' : username,
			'accessToken' : accessToken,
			'projectId' : this.project.store.uuid
		}
		// post         path                            json          callback      this
		Wu.post('/api/util/getmapboxaccount', JSON.stringify(data), callback, this);
	},

	importedMapbox : function (that, json) {
		
		// project store
		var result = JSON.parse(json);
		var error = result.error;
		var store = result.project;

		if (error) return app.feedback.setError({
			title : 'Error importing Mapbox',
			description:  error
		});


		// update project
		that.project.setStore(store);

	},

	fillMapbox : function () {

		// get accounts
		var accounts = this.project.getMapboxAccounts();

		// return if no accounts
		if (!accounts) return;

		// reset
		this._mapboxAccounts.innerHTML = '';
		
		// fill with accounts
		accounts.forEach(function (account) {
			this._insertMapboxAccount(account);
		}, this);
		
	},

	_insertMapboxAccount : function (account) {

		// wrap
		var wrap  = Wu.DomUtil.create('div', 'mapbox-listed-account', this._mapboxAccounts);
		
		// title
		var title = Wu.DomUtil.create('div', 'mapbox-listed-account-title', wrap, account.username.camelize());

		// return if not edit mode
		if (!this.project.editMode) return;

		// refresh button 
		var refresh = Wu.DomUtil.create('div', 'mapbox-listed-account-refresh smap-button-white', wrap);

		// delete button
		var del = Wu.DomUtil.create('div', 'mapbox-listed-account-delete smap-button-white', wrap);


		// refresh event
		Wu.DomEvent.on(refresh, 'mousedown', function (e) {
			Wu.DomEvent.stop(e);
			var msg = 'Are you sure you want to refresh the account? This will DELETE old layers and re-import them.';
			if (confirm(msg)) this._refreshMapboxAccount(wrap, account);
		}, this);

		// delete event
		Wu.DomEvent.on(del, 'mousedown', function (e) {
			Wu.DomEvent.stop(e);
			console.log('delete account');
			
			// remove account
			var msg = 'Are you sure you want to delete the account? This will DELETE all layers from account in this project.';
			if (confirm(msg)) this._removeMapboxAccount(wrap, account);
			
		}, this);

	},

	_removeMapboxAccount : function (div, account) {
		Wu.DomUtil.remove(div);
		this.project.removeMapboxAccount(account);
	},

	_refreshMapboxAccount : function (div, account) {
		console.log('_refreshMapboxAccount', account);

		// delete and re-import
		this._removeMapboxAccount(div, account);

		// get mapbox account via server
		var that = this;
		setTimeout(function () {
			that._importMapbox(account.username, account.accessToken, that.importedMapbox);
		}, 1000); // hack! todo!

	},


	fillOSM : function () {
	},

	
	update : function () {
		Wu.SidePane.Options.Item.prototype.update.call(this)	// call update on prototype

		// add OSM options
		this.fillOSM();

		// fill in mapbox accounts
		this.fillMapbox();
	},



});

