Wu.Controller = Wu.Class.extend({

	initialize : function () {

		this._listen();
	},

	_listen : function () {
		Wu.Mixin.Events.on('projectSelected', this._projectSelected, this);
		
		// Wu.Mixin.Events.on('editEnabled',     this._editEnabled, this);
		// Wu.Mixin.Events.on('editDisabled',    this._editDisabled, this);
		// Wu.Mixin.Events.on('layerEnabled',    this._layerEnabled, this);
		// Wu.Mixin.Events.on('layerDisabled',   this._layerDisabled, this);
	},

	// _initialize 	: function () {},
	// _editEnabled 	: function () {},
	// _editDisabled 	: function () {},
	// _layerEnabled 	: function () {},
	// _layerDisabled 	: function () {},
	// _updateView 	: function () {},

	_projectSelected : function (e) {
		var projectUuid = e.detail.projectUuid;

		// set project
		this._project = app.activeProject = app.Projects[projectUuid];

		// refresh pane
		this._refresh();
	},

	_refresh : function () {
		
		// refresh map controls
		this.refreshControls(); // perhaps refactor later, events in each control..

		// set url
		this._setUrl();
	},

	_setUrl : function () {
		var client = this._project.getClient();

		var url = '/';
		url += client.slug;
		url += '/';
		url += this._project.getSlug();
		Wu.Util.setAddressBar(url);
	},

	refreshControls : function () {
		var controlsPane = app.SidePane.Options.settings.controls,
		    project = this._project,
		    controls = project.getControls(),
		    pane = app.MapPane;

		// toggle each control
		for (c in controls) {
			var on = controls[c],
			    enable = 'enable' + c.camelize(),
			    disable = 'disable' + c.camelize();
			
			// toggle
			if (on) {	
				// enable control on map
				pane[enable]();

				// enable control in controls options menu
				if (controlsPane) controlsPane.enableControl(c);
			} else {	
				// disable control on map
				pane[disable]();
				
				// disable control in controls options menu
				if (controlsPane) controlsPane.disableControl(c);
			}
		}
	},

});