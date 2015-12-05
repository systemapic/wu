Wu.Evented = Wu.Class.extend({

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
		Wu.Mixin.Events.on('projectDeleted',  this._onProjectDeleted, this);
		Wu.Mixin.Events.on('editEnabled',     this._editEnabled, this);
		Wu.Mixin.Events.on('editDisabled',    this._editDisabled, this);
		Wu.Mixin.Events.on('layerEnabled',    this._layerEnabled, this);
		Wu.Mixin.Events.on('layerDisabled',   this._layerDisabled, this);
		Wu.Mixin.Events.on('fileImported',    this._onFileImported, this);
		Wu.Mixin.Events.on('fileDeleted',     this._onFileDeleted, this);
		Wu.Mixin.Events.on('layerAdded',      this._onLayerAdded, this);
		Wu.Mixin.Events.on('layerEdited',     this._onLayerEdited, this);
		Wu.Mixin.Events.on('layerDeleted',    this._onLayerDeleted, this);
	},

	// dummies
	_projectSelected : function () {},
	_initialize 	 : function () {},
	_initContainer   : function () {},
	_editEnabled 	 : function () {},
	_editDisabled 	 : function () {},
	_layerEnabled 	 : function () {},
	_layerDisabled 	 : function () {},
	_updateView 	 : function () {},
	_refresh 	 : function () {},
	_onFileImported  : function () {},
	_onFileDeleted   : function () {},
	_onLayerAdded    : function () {},
	_onLayerEdited   : function () {},
	_onLayerDeleted  : function () {},
	_onProjectDeleted : function () {},

});