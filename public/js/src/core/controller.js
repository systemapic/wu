Wu.Controller = Wu.Class.extend({

	initialize : function () {

		this._listen();
	},

	_listen : function () {

		Wu.Mixin.Events.on('projectSelected', this._projectSelected, this);
		
		// Wu.Mixin.Events.on('projectChanged', _.throttle(this._projectChanged, 1000), this);

		// Wu.Mixin.Events.on('editEnabled',     this._editEnabled, this);
		// Wu.Mixin.Events.on('editDisabled',    this._editDisabled, this);
		// Wu.Mixin.Events.on('layerEnabled',    this._layerEnabled, this);
		// Wu.Mixin.Events.on('layerDisabled',   this._layerDisabled, this);
	},

	// _initialize 		: function () {},
	// _editEnabled 	: function () {},
	// _editDisabled 	: function () {},
	// _layerEnabled 	: function () {},
	// _layerDisabled 	: function () {},
	// _updateView 		: function () {},


	_projectSelected : function (e) {
		var projectUuid = e.detail.projectUuid;

		// set project
		this._project = app.activeProject = app.Projects[projectUuid];

		// refresh map controls
		// this.refreshControls(); // perhaps refactor later, events in each control..

		// set url
		this._setUrl();

		// set state if any
		// this._loadState();
	},

	_projectChanged : function (e) {
		var projectUuid = e.detail.projectUuid;
		var project = app.Projects[projectUuid];
		var saveState = project.getSettings().saveState;
		console.log('project changed!', project.getName());

		// // save map state
		// if (saveState) this._saveState({
		// 	project : project
		// });
	},

	_loadState : function () {
		var project = this._project,
		    state = project.getState(),
		    saveState = project.getSettings().saveState;
		
		if (!saveState || !state) return;

		console.log('got state!', state);

		var json = {
			projectUuid : this._project.getUuid(),
			id : state
		}

		// get a saved setup - which layers are active, position, 
		Wu.post('/api/project/hash/get', JSON.stringify(json), function (ctx, reply) {

			var result = Wu.parse(reply);
			console.log('=> ', result);

			var hash = result.hash;

			// set position
			app.MapPane.setPosition(hash.position);

			// set layermenu layers
			var layers = hash.layers;
			_.each(layers, function (layerUuid) {
				app.MapPane.layerMenu._enableLayerByUuid(layerUuid);
			});


		}.bind(this), this);

	},


	_saveState : function (options) {
		console.log('_saveState');

		var project = options.project || app.activeProject;

		// get active layers
		// var active = app.MapPane.layerMenu._getActiveLayers();
		// var layers = _.map(active, function (l) {
		// 	return l.item.layer;	// layer uuid
		// });

		var layers = app.MapPane.getZIndexControls().l._index;

		console.log('LOOOLL', layers);

		var layerUuids = [];
		_.each(layers, function (l) {
			console.log('LLLL ', l);
			layerUuids.push(l.store.uuid);
		});

		console.log('saveState hash layers:', layerUuids);

		// hash object
		var json = {
			projectUuid : project.getUuid(),
			hash : {
				id 	 : Wu.Util.createRandom(6),
				position : app.MapPane.getPosition(),
				layers 	 : layerUuids 			// layermenuItem uuids, todo: order as z-index
			},
			saveState : true
		}

		// save hash to server
		Wu.post('/api/project/hash/set', JSON.stringify(json), function (a, b) {
			console.log('saved state!', json);
		}, this);

	},

	_setUrl : function () {
		var client = this._project.getClient();
		var url = '/';
		url += client.slug;
		url += '/';
		url += this._project.getSlug();
		Wu.Util.setAddressBar(url);
	},


	hideControls : function () {
		
		// layermenu
		var lm = app.MapPane.getControls().layermenu;
		if (lm) lm.hide();

		// inspect
		var ic = app.MapPane.getControls().inspect;
		if (ic) ic.hide();

		// legends
		var lc = app.MapPane.getControls().legends;
		if (lc) lc.hide();

		// description
		var dc = app.MapPane.getControls().description;
		if (dc) dc.hide();
	},

	showControls : function () {
		// layermenu
		var lm = app.MapPane.getControls().layermenu;
		if (lm) lm.show();

		// inspect
		var ic = app.MapPane.getControls().inspect;
		if (ic) ic.show();

		// legends
		var lc = app.MapPane.getControls().legends;
		if (lc) lc.show();

		// description
		var dc = app.MapPane.getControls().description;
		if (dc) dc.show();
	},
	

	// refreshControls : function () {
	// 	var controlsPane = app.SidePane.Options.settings.controls,
	// 	    project = this._project,
	// 	    controls = project.getControls(),
	// 	    pane = app.MapPane;

	// 	    // console.error('refreshControls!!! :)');

	// 	// toggle each control
	// 	for (c in controls) {
	// 		var on = controls[c],
	// 		    enable = 'enable' + c.camelize(),
	// 		    disable = 'disable' + c.camelize();
			
	// 		pane[disable](); 	// todo: wtf !! is !! going on!?

	// 		// toggle
	// 		if (on) {	
	// 			// enable control on map
	// 			pane[enable]();

	// 			// enable control in controls options menu
	// 			if (controlsPane) controlsPane.enableControl(c);
	// 		} else {	
	// 			// disable control on map
	// 			pane[disable]();
				
	// 			// disable control in controls options menu
	// 			if (controlsPane) controlsPane.disableControl(c);
	// 		}
	// 	}
	// },

});