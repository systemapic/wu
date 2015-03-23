Wu.Control = L.Control.extend({

	initialize : function (options) {

		// set options
		Wu.setOptions(this, options);

		// listen up
		this._listen();

		// local initialize
		this._initialize();

	},      

	_listen : function () {
		Wu.Mixin.Events.on('projectSelected', this._projectSelected, this);

		// Wu.Mixin.Events.on('editEnabled',     this._editEnabled, this);
		// Wu.Mixin.Events.on('editDisabled',    this._editDisabled, this);
		// Wu.Mixin.Events.on('layerEnabled',    this._layerEnabled, this);
		// Wu.Mixin.Events.on('layerDisabled',   this._layerDisabled, this);
	},

	_projectSelected : function (e) {
		var projectUuid = e.detail.projectUuid;

		// set project
		this._project = app.activeProject = app.Projects[projectUuid];

		// refresh pane
		this._refresh();
	},

	// dummies
	_initialize 	: function () {},
	// _editEnabled 	: function () {},
	// _editDisabled 	: function () {},
	// _layerEnabled 	: function () {},
	// _layerDisabled 	: function () {},
	// _updateView 	: function () {},
	// _refresh 	: function () {},

});