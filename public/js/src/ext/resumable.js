Wu.Resumable = Wu.Class.extend({

	options : {
		target : '/api/data/upload/chunked',
		chunkSize : 2*1024*1024,
		simultaneousUploads : 5,
		testChunks : true, 
		maxFiles : 5,
		fileType : ['zip', 'gz', 'geojson', 'tif', 'tiff', 'jp2', 'ecw'],
		fileTypeErrorCallback : this._fileTypeErrorCallback,
	},


	initialize : function (options) {
		
		// set options
		Wu.setOptions(this, options);

		// options fn's
		this.options.generateUniqueIdentifier = this._generateUniqueIdentifier;
		this.options.query = this._generateQuery;
		this.options.maxFilesErrorCallback = this._maxFilesErrorCallback;

		// create resumable
		this._create();

		// generate unique id
		this._set_id();
	},

	_create : function () {

		console.error('CREATE RESUM');

		// create resumable instance
		var r = this.r = new Resumable(this.options);

		// assign drop, browse
		// this._assign();

		// add events
		this._addResumableEvents();

	},

	destroy : function () {
		// if (!this.r) return;

		// var r = this.r;
		// var r_id = this._get_id();
		// var ctx = this.options.context;

		// // don't destroy if in use
		// if (r.isUploading()) return;

		// // destroy
		// this._unassign();

		// // cancel (moot)
		// r.cancel();

		// // remove events
		// this._removeEvents();

		// // destroy
		// this.r = null;
		// delete this.r;

		// // delete
		// ctx._removeResumable(r_id);
	},

	_assign : function () {
		if (this.options.drop)   this.r.assignDrop(this.options.drop);
		if (this.options.browse) this.r.assignBrowse(this.options.browse);
	},

	assignDrop : function (div) {
		this.r.assignDrop(div);
	},

	assignBrowse : function (div) {
		this.r.assignBrowse(div);
	},

	_unassign : function () {
		this.r.unAssignDrop(this.options.drop);
	},

	_disableUploadButton : function () {
		// if (!this.options.browse) return;
		// Wu.DomEvent.on(this.options.browse, 'click', Wu.DomEvent.stop, this);
		// Wu.DomUtil.addClass(this.options.browse, 'blurred');
	},
	_enableUploadButton : function () {
		// if (!this.options.browse) return;
		// Wu.DomEvent.off(this.options.browse, 'click', Wu.DomEvent.stop, this);
		// Wu.DomUtil.removeClass(this.options.browse, 'blurred');
	},

	// success or aborted or failed
	_uploadDone : function () {
		// this._enableUploadButton();
		this.options.onUploadDone();
	},

	_addResumableEvents : function () {
		var r = this.r;

		// file added
		r.on('fileAdded', function(file){

			// set starttime
			r._startTime = new Date().getTime();
			
			// upload file
			r.upload();

			// give feedback
			this.feedbackUploadStarted(file);

			// remove fulldrop
			// this._dragLeave();

			// deny multiple uploads
			// this.options.context._refreshResumable();
			// this.disable();
			// this._disableUploadButton();

		}.bind(this));

		// file success
		r.on('fileSuccess', function(file, message){

			// give feedback
			this.feedbackUploadSuccess(file, message);
			
			// refresh resumable for next download 	// todo: destroy!
			// this.options.context._refreshResumable();

			// hide progess bar
			app.ProgressBar.hideProgress();

			this._uploadDone();

		}.bind(this));

		// set progress bar
		r.on('fileProgress', function(file){
			var progress = file.progress() * 100;
			if (progress > 99) progress = 0;
			app.ProgressBar.setProgress(progress);
		}.bind(this));

		r.on('cancel', function(){
			this._uploadDone();

		}.bind(this));
		
		r.on('uploadStart', function(){
		
		}.bind(this));
		
		r.on('complete', function(data){
			this._uploadDone();

		}.bind(this));
		
		r.on('pause', function(){
		
		}.bind(this));
		
		r.on('fileError', function(file, message){
		
		}.bind(this));

		// this._enableDrop();

	},

	_removeEvents : function () {
		// this._disableDrop();
	},

	_enableDrop : function () {
		// var drop = this.options.drop;
		// Wu.DomEvent.on(window.document, 'dragenter', this._dragEnter, this);
		// Wu.DomEvent.on(drop, 'dragleave', this._dragLeave, this);
		// Wu.DomEvent.on(drop, 'drop', this._dragLeave, this);
	},

	_disableDrop : function () {
		// var drop = this.options.drop;
		// Wu.DomEvent.off(window.document, 'dragenter', this._dragEnter, this);
		// Wu.DomEvent.off(drop, 'dragleave', this._dragLeave, this);
		// Wu.DomEvent.off(drop, 'drop', this._dragLeave, this);
	},

	_dragLeave : function () {
		this.options.drop.style.display = 'none';
	},

	_dragEnter : function () {
		this.options.drop.style.display = 'block';
	},
	
	disable : function () {
		// this._tempDisabled = true;
		// this._disableDrop();
	},

	enable : function () {
		// if (this._tempDisabled) {
		// 	this._enableDrop();
		// }
	},

	// feedback upload started
	feedbackUploadStarted : function (file) {

		// calc sizes for feedback message
		var size = Wu.Util.bytesToSize(file.size),
		    fileName = file.fileName,
		    message = 'File: ' + fileName + '<br>Size: ' + size;
		
		// set feedback
		app.feedback.setMessage({
			title : 'Uploading',
			description : message,
			// id : file.uniqueIdentifier
		});
	},

	// feedback upload success
	feedbackUploadSuccess : function (file, message) {

		// get file_id
		var m 		= Wu.parse(message),
		    r 		= this.r,
		    file_id 	= m.file_id,
		    endTime 	= new Date().getTime(),
		    startTime 	= r._startTime,
		    totalTime 	= (endTime - startTime) / 1000,
		    size 	= file.size / 1000 / 1000,
		    bytesps  	= size / totalTime,
		    procTime 	= (size * 0.5).toFixed(0) + ' seconds',
		    ext 	= file.fileName.split('.').reverse()[0];

		// set message
		var message = 'Estimated processing time: ' + procTime;

		// set feedback
		app.feedback.setMessage({
			title : 'Processing file',
			description : message,
		});

	},

	// get/set id
	_set_id : function () {
		this._id = Wu.Util.getRandomChars(5);
	},
	_get_id : function () {
		return this._id;
	},


	// options helper fn's
	_generateUniqueIdentifier : function (file) {
		var uid = file.size + '-' + file.lastModified + '-' + app.Account.getUuid() + '-'  + file.name;
		return uid;
	},
	_generateQuery : function () {
		var query = {
			fileUuid : Wu.Util.guid('r'),
			// projectUuid : app.activeProject.getUuid(),
			access_token : app.tokens.access_token,
		};
		return query;
	},
	_maxFilesErrorCallback : function () {
		app.feedback.setError({
			title : 'Please only upload one file at a time.',
		});	
	},
	_fileTypeErrorCallback : function (file, errorCount) {

		// set feedback
		var description = 'The file <strong>' + file.name + '</strong> is not a geodata file. We only allow geodata at this time.';
		var filetype = file.name.split('.').reverse()[0];
		
		// custom shapefile feedback
		if (filetype == 'shp') description = 'Please zip shapefiles before uploading. Mandatory files are .shp, .shx, .dbf, .prj.';

		// show feedback message
		app.feedback.setError({
			title : 'Sorry, you can\'t do that!',
			description : description
		});

	},


})