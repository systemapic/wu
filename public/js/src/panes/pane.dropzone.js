Wu.Dropzone = Wu.Pane.extend({
	// dropzone for files to data library
	// drop anywhere, anytime

	options : {
		metaDelay : 3000 // ms
	},

	_initContainer : function () {

		// create divs
		this._container = Wu.DomUtil.create('div', 'dropzone-pane', app._appPane);
		this._content = Wu.DomUtil.create('div', 'dropzone-content', this._container);
		this._hidden = Wu.DomUtil.create('div', 'dropzone-hidden', this._container);
		this._meta = Wu.DomUtil.create('div', 'dropzone-meta', app._appPane);
		this._metaTitle = Wu.DomUtil.create('div', 'drop-meta-title', this._meta, 'Uploading');
		this._metaWrapper = Wu.DomUtil.create('div', 'dropzone-meta-outer', this._meta);

		// create progress bar
		this.progress = new Wu.ProgressPane();

		// hide by default
		this.hide();
		this.hideMeta();
	},

	_editEnabled : function () {
		this.disable();
	},

	_editDisabled : function () {
		this.enable();
	},

	show : function () {
		this._container.style.display = 'block';
	},

	hide : function () {
		this._container.style.display = 'none';
	},

	showMeta : function () {
		if (this._showingMeta) return;

		// mark as showing
		this._showingMeta = true;

		// show
		Wu.DomUtil.removeClass(this._meta, 'fadeOut');
		Wu.DomUtil.removeClass(this._meta, 'displayNone');

		// fade out after n seconds
		this._fadeTimer = setTimeout(this.fadeMeta.bind(this), this.options.metaDelay);
	},

	fadeMeta : function () {

		// clear timer if already queued
		if (this._fadeTimer) clearTimeout(this._fadeTimer);

		// fade out
		Wu.DomUtil.addClass(this._meta, 'fadeOut');

		// hide completely 500ms after fade
		setTimeout(this.hideMeta.bind(this), 500);
	},

	hideMeta : function () {

		// hide and clear
		Wu.DomUtil.addClass(this._meta, 'displayNone');
		this._clearMeta();

		// mark as not showing
		this._showingMeta = false;
	},

	_clearMeta : function () {
		this._metaWrapper.innerHTML = '';
	},

	addMeta : function (meta) {
		var div = this._addMeta(meta);
		this._metaWrapper.appendChild(div);
	},

	_addMeta : function (file) {
		if (!file) return; 			// todo: file undefined on drag'n drop

		var wrapper 	= Wu.DomUtil.create('div', 'drop-meta-wrapper');
		var name 	= Wu.DomUtil.create('div', 'drop-meta-name', wrapper);
		var size 	= Wu.DomUtil.create('div', 'drop-meta-size', wrapper);
		var type 	= Wu.DomUtil.create('div', 'drop-meta-type', wrapper);
		var ext 	= Wu.DomUtil.create('div', 'drop-meta-type', wrapper);

		name.innerHTML = 'Name: ' + file.name;
		size.innerHTML = 'Size: ' + Wu.Util.bytesToSize(file.size);
		type.innerHTML = 'Type: ' + file.type.split('/')[0].camelize();
		ext.innerHTML  = 'Filetype: ' + file.type.split('/')[1];

		return wrapper;
	},


	initDropzone : function (options) {

		// get callback
		this._uploadedCallback = options.uploadedCallback;

		// get clickable divs
		this._clickable = options.clickable;

		// create dz
		this.dz = new Dropzone(this._container, {
				url : '/api/upload',
				createImageThumbnails : false,
				autoDiscover : false,
				uploadMultiple : false,
				// acceptedFiles : '.zip,.gz,.png,.jpg,.jpeg,.geojson,.docx,.pdf,.doc,.txt',
				// acceptedFiles : '.zip,.gz,.png,.jpg,.jpeg,.geojson,.json,.topojson,.kml,.docx,.pdf,.doc,.txt',
				// maxFiles : 10,
				// parallelUploads : 10,
				maxFilesize : 2000,
				parallelUploads : 1,
				clickable : this._clickable || false,
				accept : function (file, done) {

					var ext = file.name.split('.').reverse()[0],
					    acceptedFiles = ['zip', 'gz', 'png', 'jpg', 'jpeg', 'geojson', 'doc', 'docx', 'pdf', 'txt'],
					    accepted = _.contains(acceptedFiles, ext),
					    errorTitle = 'Upload not allowed',
					    errorMessage ='The file <strong>' + file.name + '</strong> is not an accepted filetype.';

					// feedback
					if (!accepted) app.feedback.setError({ 
						title : errorTitle, 
						description : errorMessage
					});

					done(!accepted);
				} 
		});

		// add fullscreen dropzone
		this.addDropzoneEvents();     
		
	},

	addDropzoneEvents : function () {
		// add fullscreen bridge to dropzone
		Wu.DomEvent.on(document.body, 'dragenter', this.dropping, this);
		Wu.DomEvent.on(document.body, 'dragleave', this.undropping, this);
		Wu.DomEvent.on(document.body, 'dragover', this.dragover, this);
		Wu.DomEvent.on(this._container, 'drop', this.dropped, this);
	},


	removeDropzoneEvents : function () {
		// remove fullscreen bridge to dropzone
		Wu.DomEvent.off(document.body, 'dragenter', this.dropping, this);
		Wu.DomEvent.off(document.body, 'dragleave', this.undropping, this);
		Wu.DomEvent.off(document.body, 'dragover', this.dragover, this);
		Wu.DomEvent.off(this._container, 'drop', this.dropped, this);
	},

	disable : function () {
		this.removeDropzoneEvents();
	},

	enable : function () {
		this.addDropzoneEvents();	
	},

	_showMetaFeedback : function (file) {

		var name = 'Name: <strong>' + file.name + '</strong>';
		var size = 'Size: <strong>' + Wu.Util.bytesToSize(file.size) + '</strong>';
		var ext = 'Filetype: <strong>' + file.type.split('/')[1] + '</strong>';
		var icon = null;
		var string = name + '<br>' + size + ' | ' + ext;

		app.feedback.setMessage({
			title : 'Uploading file',
			description : string,
			icon : icon
		});

	},

	refresh : function () {
		this._refresh();
	},

	_refresh : function () {
		if (!this.dz) return console.error('TODO: remove', this);

		if (!app.access.to.upload_file(this._project)) {
			return this.disable();
		}

		// refresh project
		this.project = app.activeProject;

		// clean up last dz
		this.dz.removeAllListeners();

		// set project uuid for dropzone
		this.dz.options.params.projectUuid = this.project.getUuid();	// goes to req.body.project
		this.dz.options.params.project = this.project.getUuid();	// goes to req.body.project

		// set dz events
		this.dz.on('drop', function (e) { 

			this.hide();

		}.bind(this));

		this.dz.on('dragenter', function (e) { 
		});

		this.dz.on('addedfile', function (file) { 

			// show progressbar
			this.progress.setProgress(0);

			// set status
			app.setStatus('Uploading');

		}.bind(this));


		this.dz.on('complete', function (file) {
		
			// clean up
			this.dz.removeFile(file);

			// hide meta
			this.fadeMeta();

		}.bind(this));

		this.dz.on('uploadprogress', function (file, progress) {
			// set progress
			this.progress.setProgress(progress);
			console.log('progress:', progress);
		}.bind(this));                                                                                                                                                                                                               

		// this.dz.on('successmultiple', function (dz, json, xml) {
		this.dz.on('success', function (dz, json, xml) {

			// clear fullpane
			this.progress.hideProgress();

			// set status
			app.setStatus('Done!', 2000);

			// parse and process
			var resp = Wu.parse(json);

			// callback
			if (resp) this._uploadedCallback(resp);
			
		}.bind(this));
	
	},

	dropping : function (e) {
		e.preventDefault();

		// show .fullscreen-drop
		this.show(e);
	},

	undropping : function (e) {
		e.preventDefault();
		var t = e.target;

		// hide
		if (t == this._container) this.hide();
	},

	dropped : function (e) {
		e.preventDefault();

		// fire dropzone
		this.dz.drop(e);
	},

	dragover : function (e) {
		// needed for drop fn
		e.preventDefault();
	},




})