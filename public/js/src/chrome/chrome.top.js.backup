Wu.Chrome.Top = Wu.Chrome.extend({

	_ : 'topchrome', 

	_initialize : function (options) {
		console.log('top chrome init', this);

		// init container
		this.initContainer();

		// add hooks
		this.addHooks();
	},

	initContainer : function () {

		// container to hold errything
		this._container = Wu.DomUtil.create('div', 'chrome chrome-container chrome-top', app._appPane);

		// wrapper for buttons 					// todo: make pluggable
		this._buttons = Wu.DomUtil.create('div', 'chrome-buttons', this._container);

		// create button for carto editor
		// this._cartoeditorBtn = Wu.DomUtil.create('div', 'chrome-button cartoeditor', this._buttons, 'style');
		this._cartoeditorBtn = Wu.DomUtil.create('div', 'chrome-button cartoeditor', this._buttons);

		// add more buttons here at will
		// ...
	},

	// fired when a project is selected
	_projectSelected : function (e) {
		var projectUuid = e.detail.projectUuid;

		if (!projectUuid) return;

		// set project
		this._project = app.activeProject = app.Projects[projectUuid];

		// refresh pane
		// this._refresh();
	},

	
	_setHooks : function (onoff) {

		// click event on carto editor button
		Wu.DomEvent[onoff](this._cartoeditorBtn, 'click', this._toggleCartoEditor, this);

		// add more click events here if adding more buttons
		// ...
	},
	addHooks : function () {
		this._setHooks('on');
	},
	removeHooks : function () {
		this._setHooks('off');
	},






	_toggleCartoEditor : function () {
		// if this is true ?         then do this        :        if not, this
		this._cartoEditorOpen ? this._closeCartoEditor() : this._openCartoEditor();
	},
	_openCartoEditor : function () {
		console.log('open click');

		// use a variable to mark editor as open
		this._cartoEditorOpen = true;

		// trigger fn in right chrome to open it
		app.Chrome.Right.open();
	},
	_closeCartoEditor : function () {
		console.log('close click');

		// mark not open
		this._cartoEditorOpen = false;

		// close right chrome
		app.Chrome.Right.close();
	},






});