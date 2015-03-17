Wu.Pane = Wu.Class.extend({
	initialize : function (options) {

		// set options
		Wu.setOptions(this, options);

		// init container
		this._initContainer();
		
		// local initialize
		this._initialize();
		
		// listen up
		this.listen();
	},      

	_initialize : function () {
		// dummy
	},

	listen : function () {
		Wu.Mixin.Events.on('projectSelected', this._projectSelected, this);
		Wu.Mixin.Events.on('editEnabled',     this._editEnabled, this);
		Wu.Mixin.Events.on('editDisabled',    this._editDisabled, this);
		Wu.Mixin.Events.on('layerEnabled',    this._layerEnabled, this);
		Wu.Mixin.Events.on('layerDisabled',   this._layerDisabled, this);
	},

	_projectSelected : function (e) {
		var projectUuid = e.detail.projectUuid;
		this._project = app.Projects[projectUuid];
		this._updateView();
	},

	_editEnabled : function () {},
	_editDisabled : function () {},
	_layerEnabled : function () {},
	_layerDisabled : function () {},
	_updateView : function () {},
});