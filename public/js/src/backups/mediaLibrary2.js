Wu.SidePane.MediaLibrary = Wu.SidePane.Item.extend({

	type : 'mediaLibrary',
	title : 'Media',

	initContent : function () {

		// create new fullscreen page, and set as default content
		this._content = Wu.DomUtil.create('div', 'fullpage-mediaLibrary', Wu.app._appPane);
		
		// create container (overwrite default) and insert template			// innerHTML
		this._container = Wu.DomUtil.create('div', 'editor-wrapper', this._content, ich.mediaLibrary({ media : 'this is media!' }));

		// get pane
		this._innerContent = Wu.DomUtil.get('mediaLibrary-inner-content');

	},

	addHooks : function () {
		// Wu.DomEvent.on(this._button, 'mousedown', this.dosomething, this);
	},


	removeHooks : function () {

	},

	addEditHooks : function () {
				       
	},

	removeEditHooks : function () {
		
	},

	// fired when different sidepane selected, for clean-up
	deactivate : function () {
		console.log('clear!');
	},



	updateContent : function () {
		this.update();
	},

	update : function () {
		// set project
		this.project = app.activeProject;
		
		console.log('MEDIALIBRARY: ', this.project);

		// flush
		this.reset();

		// build shit
		this.refresh();

		// add edit hooks
		this.addEditHooks();
	
	},

	refresh : function () {
		// build divs and content for project (this.project)

		// get array of files
		var files = this.project.getFiles();
		console.log('files: ', files);

		// add hooks
		this.addHooks();

	},

	reset : function () {
		// remove all inside div
		this._innerContent.innerHTML = '';
	
		this.removeHooks();
	},

});


