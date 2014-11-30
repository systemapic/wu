Wu.Dropzone = Wu.Class.extend({
	// dropzone for files to data library
	// drop anywhere, anytime

	initialize : function () {
		this.initLayout();
	},

	initLayout : function () {

		// create divs
		this._container = Wu.DomUtil.create('div', 'dropzone-pane', app._appPane);
		this._content = Wu.DomUtil.create('div', 'dropzone-content', this._container);
		this._hidden = Wu.DomUtil.create('div', 'dropzone-hidden', this._container);

		// create progress bar
		this.progress = new Wu.ProgressPane();

		console.log('drozpone progress::: ', this.progress);

		// hide by default
		this.hide();
	},

	show : function () {
		Wu.DomUtil.removeClass(this._container, 'displayNone');
	},

	hide : function () {
		Wu.DomUtil.addClass(this._container, 'displayNone');
	},


	initDropzone : function (options) {
		
		// get callback
		this._uploadedCallback = options.uploaded;

		// get clickable divs
		this._clickable = options.clickable;

		// create dz
		this.dz = new Dropzone(this._container, {
				url : '/api/upload',
				createImageThumbnails : false,
				autoDiscover : false,
				uploadMultiple : true,
				acceptedFiles : '.zip,.gz,.png,.jpg,.jpeg,.geojson,.docx,.pdf,.doc,.txt',
				// acceptedFiles : '.zip,.gz,.png,.jpg,.jpeg,.geojson,.json,.topojson,.kml,.docx,.pdf,.doc,.txt',
				maxFiles : 10,
				parallelUploads : 10,
				clickable : this._clickable || false,
				// autoProcessQueue : true
		});

		// add fullscreen dropzone
		this.addDropzoneEvents();     
		
	},

	addDropzoneEvents : function () {

		// add fullscreen bridge to dropzone
		Wu.DomEvent.on(document.body, 'dragenter', this.dropping, this);
		Wu.DomEvent.on(document.body, 'dragleave', this.undropping, this);
		Wu.DomEvent.on(document.body, 'dragover', this.dragover, this);
		Wu.DomEvent.on(document.body, 'drop', this.dropped, this);


	},


	removeDropzoneEvents : function () {

		// remove fullscreen bridge to dropzone
		Wu.DomEvent.off(document.body, 'dragenter', this.dropping, this);
		Wu.DomEvent.off(document.body, 'dragleave', this.undropping, this);
		Wu.DomEvent.off(document.body, 'dragover', this.dragover, this);
		Wu.DomEvent.off(document.body, 'drop', this.dropped, this);

	},

	refresh : function () {
		var that = this;

		// refresh project
		this.project = app.activeProject;
		// if (!this.project) return;

		// clean up last dz
		this.dz.removeAllListeners();

		// set project uuid for dropzone
		this.dz.options.params.project = this.project.getUuid();	// goes to req.body.project

		// set dz events
		this.dz.on('drop', function (e) { 
			console.log('dz.drop');
			that.hide();
		});

		this.dz.on('dragenter', function (e) { 
		
			console.log('drageneter dropzonePane');

		});

		this.dz.on('addedfile', function (file) { 

			// show progressbar
			// that.progress.style.opacity = 1;
			that.progress.setProgress(0);

			// show fullscreen file info
			// if (!that._fulldrop) {
			// 	that.fullOn(file);
			// 	that.fullUpOn(file);
			// }

			// set status
			app.setStatus('Uploading');
		});


		this.dz.on('complete', function (file) {
			
			// clean up
			that.dz.removeFile(file);

		});

		this.dz.on('uploadprogress', function (file, progress) {
			// set progress
			// that.progress.style.width = progress + '%';
			that.progress.setProgress(progress);
		});                                                                                                                                                                                                               

		this.dz.on('successmultiple', function (err, json) {
			// parse and process
			var obj = Wu.parse(json);

			// set status
			app.setStatus('Done!', 2000);

			if (obj) that._uploadedCallback(obj);

			// clear fullpane
			that.progress.hideProgress();
		});

		
		console.log('dz events doen');


	},


	showProgress : function () {

		

	},


	setProgress : function (p) {
		


	},

	resetProgress : function () {
		

	},

	// show : function () {
	// 	console.log('show!');
	// },

	// hide : function () {
	// 	console.log('hide!');
	// },


	dropping : function (e) {
		e.preventDefault();
		console.log('dropping');
	    
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

		console.log('dropped');
		
		// fire dropzone
		this.dz.drop(e);
	},

	dragover : function (e) {
		// needed for drop fn
		e.preventDefault();

		// console.log('dragover', e.target);
	},












})