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

		// create resumable instance
		var r = this.r = new Resumable(this.options);

		// add events
		this._addResumableEvents();

	},

	destroy : function () {
		
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
	},
	_enableUploadButton : function () {
	},

	// success or aborted or failed
	_uploadDone : function () {
		this.options.onUploadDone();
	},

	_addResumableEvents : function () {
		var r = this.r;

		// file added
		r.on('fileAdded', function(file){

			// fire layer edited
			Wu.Mixin.Events.fire('fileProcessing', {detail : {
				file: file
			}});

			// set starttime
			r._startTime = new Date().getTime();
			
			// upload file
			r.upload();

			// give feedback
			this.feedbackUploadStarted(file);

		}.bind(this));

		// file success
		r.on('fileSuccess', function(file, message){

			// give feedback
			this.feedbackUploadSuccess(file, message);
			
			// hide progess bar
			app.ProgressBar.hideProgress();

			this._uploadDone();

		}.bind(this));

		// set progress bar
		r.on('fileProgress', function(file){
			var progress = file.progress() * 100;
			if (progress > 99) progress = 100;

			// set progress bar
			app.ProgressBar.setProgress(progress);

			// set processing progress
			Wu.Mixin.Events.fire('processingProgress', {
				detail : {
					text : 'Uploading...',
					error : null,
					percent : parseInt(progress),
					uniqueIdentifier : file.uniqueIdentifier,
				}
			});

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

	},

	_removeEvents : function () {
	},

	_enableDrop : function () {
	},

	_disableDrop : function () {
	},

	_dragLeave : function () {
		this.options.drop.style.display = 'none';
	},

	_dragEnter : function () {
		this.options.drop.style.display = 'block';
	},
	
	disable : function () {
	},

	enable : function () {
	},




	// feedback upload started
	feedbackUploadStarted : function (file) {

		// calc sizes for feedback message
		var size = Wu.Util.bytesToSize(file.size),
		    fileName = file.fileName,
		    message = 'File: ' + fileName + '<br>Size: ' + size;
		
		// set processing progress
		Wu.Mixin.Events.fire('processingProgress', {
			detail : {
				text : 'Uploading...',
				error : null,
				percent : 0,
				uniqueIdentifier : file.uniqueIdentifier,
			}
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
		    procTime 	= (size * 1).toFixed(0) + ' seconds',
		    ext 	= file.fileName.split('.').reverse()[0];

		// set message
		var message = 'Estimated time: ' + procTime;

		// set processing progress
		Wu.Mixin.Events.fire('processingProgress', {
			detail : {
				text : 'Uploaded!',
				error : null,
				percent : 100,
				uniqueIdentifier : file.uniqueIdentifier,
			}
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