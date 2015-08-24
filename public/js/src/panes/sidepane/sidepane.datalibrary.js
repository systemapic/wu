// Move all pop-ups to model.D3List.js
Wu.SidePane.DataLibrary = Wu.SidePane.Item.extend({
	_ : 'sidepane.datalibrary', 
	
	type : 'dataLibrary',
	title : 'Data <br> Library',
	sortDirection : {},


	//  ██████╗ ███████╗███╗   ██╗███████╗██████╗  █████╗ ██╗     
	// ██╔════╝ ██╔════╝████╗  ██║██╔════╝██╔══██╗██╔══██╗██║     
	// ██║  ███╗█████╗  ██╔██╗ ██║█████╗  ██████╔╝███████║██║     
	// ██║   ██║██╔══╝  ██║╚██╗██║██╔══╝  ██╔══██╗██╔══██║██║     
	// ╚██████╔╝███████╗██║ ╚████║███████╗██║  ██║██║  ██║███████╗
	//  ╚═════╝ ╚══════╝╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝
	                                                           

	_initContent : function () {

		// create new fullscreen page, and set as default content
		this._content 			= Wu.DomUtil.create('div', 'data-library', Wu.app._appPane);
		this._innerContent 		= Wu.DomUtil.create('div', 'data-library-inner', this._content);
		
		// Button controller
		this._controlContainer 		= Wu.DomUtil.create('div', 'datalibrary-controls', this._innerContent);	
		this._controlInner 		= Wu.DomUtil.create('div', 'datalibrary-controls-inner', this._controlContainer);

		this.fullsize = true;
		this._expandCollapse     	= Wu.DomUtil.create('div', 'datalibrary-expand-collapse', this._controlInner);

		// Search field
		this._search 			= Wu.DomUtil.create('input', 'search', this._controlInner);
		this._search.id 		= 'datalibrary-search';
		this._search.setAttribute('type', 'text');
		this._search.setAttribute('placeholder', 'Search files');

		// Download button
		this._downloader 		= Wu.DomUtil.create('div', 'smap-button-gray', this._controlInner, 'Download');

		// Delete button
		this._deleter 			= Wu.DomUtil.create('div', 'smap-button-gray', this._controlInner, 'Delete');

		// Upload button
		this._addUploaderButton();

		// error feedback
		this._errors 			= Wu.DomUtil.createId('div', 'datalibrary-errors', this._controlInner);

		// create container (overwrite default)
		this._container 		= Wu.DomUtil.create('div', 'editor-wrapper ct1', this._innerContent);

		// create dialogue 
		this._downloadList 		= Wu.DomUtil.createId('div', 'datalibrary-download-dialogue', this._innerContent);

		// create progress bar
		this.progress 			= Wu.DomUtil.create('div', 'progress-bar', this._innerContent);
		
		// #datalibrary-container
		this._dataLibraryContainer 	= Wu.DomUtil.create('div', 'datalibrary-container', this._container);
	
		// #datalibrary-table-container
		this._tableContainer 		= Wu.DomUtil.create('div', 'datalibrary-table-container', this._dataLibraryContainer);

		// create fullscreen dropzone
		this.fulldrop 			= Wu.DomUtil.create('div', 'fullscreen-drop', this._content);

		// filecount
		this.filecount = 0;

		// RENDER EMPTY TABLE
		this._fileList 			= Wu.DomUtil.createId('div', 'filelist', this._tableContainer);
		this._tableFrame 		= Wu.DomUtil.create('div', 'datalibrary-table', this._fileList);

		// #datalibrary-insertrows
		this._table 			= Wu.DomUtil.create('div', 'list datalibrary-insertrows', this._tableFrame);

		// init table
		var tableOptions      		= { container : this._table, searchfield : this._search };
		this._dataLibraryList 		= new Wu.DataLibraryList(tableOptions);

		// init dropzone
		// this.initDZ();

		// add tooltip
		app.Tooltip.add(this._menu, 'The data library contains all files uploaded to the project.');


		// add fullscreen drop 
		this._resumableDrop = Wu.DomUtil.create('div', 'resumable-drop', app._appPane);

		// add hooks
		this.addHooks();

	},

	_addUploaderButton : function () {
		if (this._uploader) {
			Wu.DomUtil.remove(this._uploader);
			this._uploader = null;
			delete this._uploader;
		}

		// if (this._uploaderSimple) {
		// 	Wu.DomUtil.remove(this._uploaderSimple);
		// 	this._uploaderSimple = null;
		// 	delete this._uploaderSimple;
		// }

		// Upload button
		// this._uploader = Wu.DomUtil.create('div', 'smap-button-gray', this._controlInner, 'Import data...');
		// this._uploaderSimple = Wu.DomUtil.create('div', 'smap-button-gray', this._controlInner, 'Upload image/document');

		this._uploader = Wu.DomUtil.create('input', 'smap-button-gray', this._controlInner, 'Import data...');
		this._uploader.setAttribute('type', 'file');
		this._uploader.id = 'fileinput';

		this._uploaderId = Wu.Util.createRandom(7);
		var that = this;
		var uploadFn = this.uploadFile;
		this._uploader.addEventListener('change', function () {
			console.log('THIS', this);
			var file = this.files[0];
			console.log('file::: ', file);
			uploadFn(file);

			var size = parseInt(file.size / 1000 / 1000) + 'MB';
			var name = file.name;
			var description = name + ', ' + size;
			console.log('uploadIRD uipload', that._uploaderId);
			app.feedback.setMessage({
				title : 'Uploading data',
				description : description,
				id : that._uploaderId
			});

		}, false);
	},

	_uploadProgress : function (a, b, c) {

		var loaded = a.loaded;
		var total = a.total;
		var progress = (loaded/total) * 100;
		console.log('uploadProgress', progress);
		app.ProgressBar.setProgress(progress);
	},

	_upload : {

		progress : function (data) {
			// console.log('progress: ', data);
			var loaded = data.loaded;
			var total = data.total;
			var progress = (loaded/total) * 100;
			app.ProgressBar.setProgress(progress);

			// estimate upload time for large files
			if (total > 10000000) {
				// console.log('big file!')
				// app.ProgressBar.timedProgress()
				
			}
		},

		load : function (data) {
			var uploadStatus = Wu.parse(data.target.response);
			console.log('uploadStatus:', uploadStatus);

			var size = uploadStatus.size;
			var estimatedTime = (size * 1.5)/1000; // ms		// 420 sec for 250MB => 2 sec/MB

			// console.log('estimatedTime', estimatedTime);

			// console.log('uploadIRDD proces', app.SidePane.DataLibrary._uploaderId);

			app.feedback.setMessage({
				title : 'Processing data!',
				description : 'File will be added to the Data Library as soon as it\'s finished. Estimated time approx. ' + parseInt(estimatedTime/1000) + ' seconds.',
				clearDelay : estimatedTime,
				id : app.SidePane.DataLibrary._uploaderId
			});

			// reset progress
			app.ProgressBar.hideProgress();

			// get file and add to client
			app.SidePane.DataLibrary._getFile(uploadStatus, app.SidePane.DataLibrary._gotFile);

		},

		error : function (data) {
			console.log('ERROR!', data);

		},

		abort : function (data) {
			console.log('ABORT!', data);

		},

	},

	_getFile : function (uploadStatus, callback) {
		var xhr = new XMLHttpRequest();
		var fd = new FormData();
		var url = app.options.servers.portal + 'api/file/get';
		url += '?fileUuid=' + uploadStatus.file_id;
		url += '&access_token=' + app.tokens.access_token;

		xhr.open("GET", url, true);
		xhr.onreadystatechange = function() {
			if(xhr.readyState == 4 && xhr.status == 200) {
				var file = Wu.parse(xhr.responseText);
				// console.log('FILE', file);

				// return file
				if (file) return callback(file);
				
				// loop until file is ready
				setTimeout(function () {
					app.SidePane.DataLibrary._getFile(uploadStatus, callback);
				}, 1000);
			}
		}
		xhr.send(null);
	},

	_gotFile : function (file) {
		// console.log('_addFile: ', file);

		// add file to lib
		var dlib = app.SidePane.DataLibrary;
		dlib._project.setFile(file);
		dlib.reset();
		dlib.refreshTable({
			add: [file]
		});

		// create default layer
		dlib._createDefaultLayer(file);

		// reset progress
		app.ProgressBar.hideProgress();
	},

	_createDefaultLayer : function (file) {

		var file_id = file.uuid,
		    project = this._project;

		var layerJSON = {
			"geom_column": "the_geom_3857",
			"geom_type": "geometry",
			"raster_band": "",
			"srid": "",
			"affected_tables": "",
			"interactivity": "",
			"attributes": "",
			"access_token": app.tokens.access_token,
			"cartocss_version": "2.0.1",
			"cartocss": "#layer {  \n polygon-fill: red; \n marker-fill: #001980; \n marker-allow-overlap: true; \n marker-clip: false; \n marker-comp-op: screen;}",
			"sql": "(SELECT * FROM " + file_id + ") as sub",
			"file_id": file_id,
			"return_model" : true,
			"projectUuid" : this._project.getUuid()
		}

		// create postgis layer
		Wu.post('/api/db/createLayer', JSON.stringify(layerJSON), function (err, layerJSON) {
			console.log('api/db/createLayer', err, layerJSON);
			var layer = Wu.parse(layerJSON);

			var options = {
				projectUuid : this._project.getUuid(), // pass to automatically attach to project
				data : {
					postgis : layer.options
				},
				metadata : layer.options.metadata,
				title : file.name,
				description : file.description,
				file : file.uuid
			}

			// create new layer model
			this._createLayerModel(options, function (err, layerModel) {

				// refresh Sidepane Options
				project.addLayer(layerModel);
				app.SidePane.Options.settings.layermenu.update();
				app.SidePane.Options.settings.baselayer.update();

				// refresh sidepane
				app.SidePane.refreshMenu();

				// refresh cartoCssControl
				var ccss = app.MapPane.getControls().cartocss;
				ccss && ccss._refresh();	
			})
			
		}.bind(this));

	},

	_createLayerModel : function (options, done) {

		Wu.Util.postcb('/api/layers/new', JSON.stringify(options), function (err, body) {

			var layerModel = Wu.parse(body);

			done(null, layerModel);

		}.bind(this));
	},

	uploadFile : function (file){
		var url = app.options.servers.portal + 'api/import';
		var xhr = new XMLHttpRequest();
		var fd = new FormData();
		xhr.open("POST", url, true);

		// event handlers
		var uploadProgress = app.SidePane.DataLibrary._upload.progress;
		var uploadComplete = app.SidePane.DataLibrary._upload.load;
		var uploadError = app.SidePane.DataLibrary._upload.error;
		var uploadAbort = app.SidePane.DataLibrary._upload.abort;
		
		// set access_token on header
		xhr.setRequestHeader("Authorization", "Bearer " + app.tokens.access_token);

		// events
		xhr.upload.addEventListener("progress", uploadProgress, false);
		xhr.addEventListener('load', uploadComplete, false);
		xhr.addEventListener('error', uploadError, false);
		xhr.addEventListener('abort', uploadAbort, false);
		
		// file
		fd.append("data", file);

		// project
		fd.append('projectUuid', app.activeProject.getUuid());

		// send
		xhr.send(fd);
	},


	// process file
	uploaded : function (result) {

		
		// handle errors
		if (result.error) {
			console.error('error', result.error);
			this.handleError(result.error);
		}
		// return if nothing
		if (!result.files) {
			console.error('no files?');
			return;
		}
		// add files to library
		result.files && result.files.forEach(function (file, i, arr) {
			
			// add to project locally (already added on server)
			this._project.setFile(file);
		}, this);

		// add layers
		result.layers && result.layers.forEach(function (layer, i) {
			this._project.addLayer(layer);

			// custom title for rasters
			var title = layer.data.raster ? 'Layer created' : 'Processing done!';
			var sev = layer.data.raster ? 2 : 1;

			// todo: set layer icon
			app.feedback.setMessage({
				title : title,
				description : 'Added <strong>' + layer.title + '</strong> to available layers.',
				id : result.uniqueIdentifier,
				severity : sev
			});

		}, this);

		// if not layer, no processing
		if (!result.layers) {
			var fileUuid = result.files[0].uuid;
			app.SidePane.DataLibrary.processFileDone(fileUuid, 100, 1);
		}

		// refresh Sidepane Options
		app.SidePane.Options.settings.layermenu.update();
		app.SidePane.Options.settings.baselayer.update();

		// refresh sidepane
		app.SidePane.refreshMenu();

		// refresh cartoCssControl
		var ccss = app.MapPane.getControls().cartocss;
		if (ccss) ccss._refresh();

		// refresh
		this.reset();

		// add files
		this.refreshTable({
			add: result.files
		});

	},
















































	_setHooks : function (on) {
		if (this._hooks == on) return;
		this._hooks = on;


		// delete button
		if (app.access.to.delete_project(this._project)) {
			Wu.DomEvent[on](this._deleter, 'mousedown', this.deleteConfirm, this);
		}

		// download 
		if (app.access.to.download_file(this._project)) {
			// download button
			Wu.DomEvent[on](this._downloader, 'mousedown', this.downloadFiles, this);
		}

		// 
		Wu.Mixin.Events[on]('projectSelected', this._onProjectSelected, this);

		Wu.DomEvent[on](this._expandCollapse, 'mousedown', this.toggleSize, this);

	},

	toggleSize : function () {
		this.fullsize ? this.setSmallSize() : this.setFullSize();
	},

	setFullSize : function () {
		Wu.DomUtil.removeClass(this._content, 'minimal');
		Wu.DomUtil.removeClass(this._expandCollapse, 'expand');
		Wu.DomUtil.addClass(app._map._container, 'map-blur');
		this.fullsize = true;	
		this.refreshTable({tableSize : 'full'});	
	},

	setSmallSize : function () {
		Wu.DomUtil.addClass(this._content, 'minimal');
		Wu.DomUtil.addClass(this._expandCollapse, 'expand');
		Wu.DomUtil.removeClass(app._map._container, 'map-blur');
		this.fullsize = false;
		this.refreshTable({tableSize : 'small'});
	},

	_projectSelected : function (e) {
		var projectUuid = e.detail.projectUuid;
		if (!projectUuid) return;

		// set project
		this._project = app.activeProject = app.Projects[projectUuid];

		this._onProjectSelected(e);
	},

	_onProjectSelected : function (e) {

		this._unload(e);

		// refresh uploader
		this._refreshResumable();
	},

	_unload : function (e) {
		var project = e.details;
		this.removeHooks();
		this._reset();
	},

	_reset : function () {
	},

	// hooks added automatically on page load
	addHooks : function () {
		this._setHooks('on');

		var project = this._project || app.activeProject;
		var canDelete = app.access.to.delete_project(project),
		    canUpload = app.access.to.upload_file(project),
		    canDownload = app.access.to.download_file(project);
		
		if (canDelete)   Wu.DomUtil.removeClass(this._deleter, 'displayNone');
		if (canUpload)   Wu.DomUtil.removeClass(this._uploader, 'displayNone');
		// if (canUpload)   Wu.DomUtil.removeClass(this._uploaderSimple, 'displayNone');
		if (canDownload) Wu.DomUtil.removeClass(this._downloader, 'displayNone');
		
	},

	_refreshResumable : function () {

		// remove old
		if (this.r) this._removeResumable();

		this._addUploaderButton();

		// add new
		var project = this._project || app.activeProject;
		if (app.access.to.upload_file(project)) this._addResumable();
	},

	_removeResumable : function () {

		var r = this.r;
		r.unAssignDrop(this._resumableDrop);
		r.cancel();
		this.r = null;
		delete this.r;

		// remove hooks
		this._disableResumable();
	},

	_disableResumable : function () {
		// remove drop events
		Wu.DomEvent.off(window.document, 'dragenter', this._dragEnter, this);
		Wu.DomEvent.off(this._resumableDrop, 'dragleave', this._dragLeave, this);
		Wu.DomEvent.off(this._resumableDrop, 'drop', this._dragLeave, this);
	},

	_enableResumable : function () {
		// add drag/drop events
		Wu.DomEvent.on(window.document, 'dragenter', this._dragEnter, this);
		Wu.DomEvent.on(this._resumableDrop, 'dragleave', this._dragLeave, this);
		Wu.DomEvent.on(this._resumableDrop, 'drop', this._dragLeave, this);
	},

	_addResumable : function () {
		if (!app.activeProject) return;
		return;

		var projectUuid = app.activeProject.getUuid();

		var r = this.r = new Resumable({
			target : '/api/data/upload/chunked',
			chunkSize : 1*1024*1024,
			simultaneousUploads : 5,
			generateUniqueIdentifier : function (file) {
				var idr = file.size + '-' + file.lastModified + '-' + file.name;
				return idr;
			},
			testChunks : false, // resumable chunks // todo: server side redis count not stable
			throttleProgressCallbacks : 1,
			query : {
				fileUuid : Wu.Util.guid('r'),
				projectUuid : projectUuid,
				access_token : app.tokens.access_token
			},

			// accepted filetypes
			// fileType : ['zip', 'gz', 'png', 'jpg', 'jpeg', 'geojson', 'doc', 'docx', 'pdf', 'txt', 'tif', 'tiff', 'jp2', 'ecw'],
			fileType : ['zip', 'gz', 'geojson', 'tif', 'tiff', 'jp2', 'ecw'],
			fileTypeErrorCallback : function (file, errorCount) {

				// set feedback
				var description = 'The file <strong>' + file.name + '</strong> is not a geodata file. To upload normal images or documents, use the "Upload image/document button".';
				var filetype = file.name.split('.').reverse()[0];
				
				// custom shapefile feedback
				if (filetype == 'shp') description = 'Please zip shapefiles before uploading. Mandatory files are .shp, .shx, .dbf.';

				// show feedback message
				app.feedback.setError({
					title : 'Sorry, you can\'t do that!',
					description : description
				});

				// hide drop
				app.SidePane.DataLibrary._hideDrop();
			},
		});

		// assign to DOM
		r.assignDrop(this._resumableDrop);
		r.assignBrowse(this._uploader);

		r.on('fileAdded', function(file){
			r._startTime = new Date().getTime();
			r.upload();

			var size = Wu.Util.bytesToSize(file.size),
			    fileName = file.fileName,
			    message = 'Uploading ' + fileName + ' (' + size + ')';
			
			// set feedback
			app.feedback.setMessage({
				title : 'Upload started',
				description : message,
				id : file.uniqueIdentifier
			});

			// remove fulldrop
			this._dragLeave();

		}.bind(this));

		r.on('complete', function(){
			// console.log('r.complete');
		});

		r.on('pause', function(){
			// console.log('r.pause');
		});
		
		r.on('fileSuccess', function(file, message){

			var endTime = new Date().getTime(),
			    startTime = r._startTime,
			    totalTime = (endTime - startTime) / 1000,
			    size = file.size / 1000 / 1000,
			    bytesPerSecond = size / totalTime,
			    message = 'Uploaded ' + size.toFixed(2) + ' MB in ' + totalTime.toFixed(2) + ' seconds, at ' + bytesPerSecond.toFixed(2) + ' MB/s.',
			    estimatedProcessingTime = (size * 0.5).toFixed(0) + ' seconds',
			    ext = file.fileName.split('.').reverse()[0];

			// var regularFile = (ext == 'pdf' || ext == 'txt' || ext == 'doc' || ext == 'docx' || ext == 'jpeg');
			
			message +=' <br><br>Pre-processing will take approx. ' + estimatedProcessingTime;

			// set feedback
			app.feedback.setMessage({
				title : 'Upload success!',
				description : message,
				id : file.uniqueIdentifier
			});
			// if (regularFile) {
			// 	app.feedback.setSuccess({
			// 		title : 'Upload done',
			// 		description : file.fileName + ' was uploaded successfully.',
			// 		id : file.uniqueIdentifier,
			// 	});
			// } else {
				
			// }

			// hide progess bar
			app.ProgressBar.hideProgress();

		}.bind(this));

		r.on('fileError', function(file, message){
			// console.log('r.fileError', file, message);
		});

		r.on('fileProgress', function(file){
			var progress = file.progress() * 100;
			app.ProgressBar.setProgress(progress);
		});

		r.on('cancel', function(){
			// console.log('r.cancel');
		});

		r.on('uploadStart', function(){
			// console.log('r.uploadStart');
		});

		// add drop events
		this._enableResumable();

	},

	_activate : function () {

		// add hooks
		this.addHooks();

		// hide other controls
		this._hideControls();
	},
	
	_deactivate : function () {
		
		// remove hooks
		this.removeHooks();

		// show controls
		this._showControls();
	},

	_hideControls : function () {
		app.Controller.hideControls();
	},

	_showControls : function () {
		app.Controller.showControls();
	},

	_dragEnter : function (e) {		
		console.log('_dragEnter');		
		if (!app.activeProject) return;		
		this._showDrop();		
	},		
		
	_dragLeave : function (e) {		
		console.log('_dragLeave');		
		this._hideDrop();		
	},		
		
	_hideDrop : function () {		
		this._resumableDrop.style.display = 'none';		
	},		
		
	_showDrop : function () {		
		this._resumableDrop.style.display = 'block';		
	},		
		
	removeHooks : function () {		
				
		this._setHooks('off');		
		
		var canDelete = app.access.to.delete_project(this._project),		
		    canUpload = app.access.to.upload_file(this._project),		
		    canDownload = app.access.to.download_file(this._project);		
				
		if (canDelete) Wu.DomUtil.addClass(this._deleter, 'displayNone');		
		if (canUpload) Wu.DomUtil.addClass(this._uploader, 'displayNone');		
		if (canDownload) Wu.DomUtil.addClass(this._downloader, 'displayNone');		
				
	},		
		
	searchList : function (e) {		
		if (e.keyCode == 27) { // esc		
			// reset search		
			return this.resetSearch();		
		}		
		
		// get value and search		
		var value = this._search.value;		
		this.list.search(value);		
	},		
		 
	resetSearch : function () {		
		this.list.search(); // show all		
		this._search.value = '';		
	},

	// ┬ ┬┌─┐┌┐┌┌┬┐┬  ┌─┐  ┌─┐┬─┐┬─┐┌─┐┬─┐┌─┐
	// ├─┤├─┤│││ │││  ├┤   ├┤ ├┬┘├┬┘│ │├┬┘└─┐
	// ┴ ┴┴ ┴┘└┘─┴┘┴─┘└─┘  └─┘┴└─┴└─└─┘┴└─└─┘	


	createFeedbackID : function () {
		this.__id = Wu.Util.createRandom(5);
	},
	
	handleError : function (err) {

		// set error
		app.feedback.setError({
			title : 'Upload error',
			description : err,
			id : this.__id			
		});
	},




	// ┬─┐┌─┐┌─┐┬─┐┌─┐┌─┐┬ ┬┬┌┐┌┌─┐
	// ├┬┘├┤ ├┤ ├┬┘├┤ └─┐├─┤│││││ ┬
	// ┴└─└─┘└  ┴└─└─┘└─┘┴ ┴┴┘└┘└─┘	


	update : function () {

		// Remove map-blur if small size 
		if ( !this.fullsize ) Wu.DomUtil.removeClass(app._map._container, 'map-blur');
		
		// use active project
		this.project = Wu.app.activeProject;

		// flush
		this.reset();

		// refresh table entries
		this.refreshTable({reset : true});

		// refresh 
		this.refreshHooks();

		// refresh cartoCssControl
		var cartoCss = app.MapPane.getControls().cartocss;
		if (cartoCss) cartoCss._refresh();

		// hide stuff for non-editors
		this._checkEditMode();
	},

	// TODO
	_checkEditMode : function () {
		var canUpload = app.access.to.upload_file(this.project),
		    canDelete = app.access.to.delete_file(this.project),
		    canDownload = app.access.to.download_file(this.project);

		this._uploader.style.display = canUpload ? 'inline-block' : 'none';
		this._deleter.style.display = canDelete ? 'inline-block' : 'none';
		this._downloader.style.display = canDownload ? 'inline-block' : 'none';
	},

	// TODO
	_canEdit : function () {

		var canEdit = app.access.to.edit_project(this.project);
		return canEdit;

		// var canUpload = app.access.to.upload_file(this.project),
		//     canDelete = app.access.to.delete_file(this.project),
		//     canDownload = app.access.to.download_file(this.project);

		//      if ( canUpload || canDelete || canDownload ) return true;
		//      else return false;

	},

	refreshHooks : function () {
		this.removeHooks()
		this.addHooks();
	},

	reset : function () {
	},

	// REFRESH LIST WITH DATA FILE LIST FROM DOM
	refreshTable : function (options) {

		var _options = {};

		    _options.context  = this._dataLibraryList;
		    _options.listData = this._project.files;

		if ( options.reset ) {
			_options.reset    = true;
			_options.canEdit  = this._canEdit();		
		}

		if ( options.remove ) {
			_options.remove      = options.remove;
		}		

		if ( options.add ) {
			_options.add = options.add;
		}
		
		if ( options.tableSize ) {
			_options.tableSize = options.tableSize;

		}

		this._dataLibraryList.updateTable(_options);

			
	},




	// ███████╗██╗██╗     ███████╗    ██╗  ██╗ █████╗ ███╗   ██╗██████╗ ██╗     ██╗███╗   ██╗ ██████╗ ███████╗
	// ██╔════╝██║██║     ██╔════╝    ██║  ██║██╔══██╗████╗  ██║██╔══██╗██║     ██║████╗  ██║██╔════╝ ██╔════╝
	// █████╗  ██║██║     █████╗      ███████║███████║██╔██╗ ██║██║  ██║██║     ██║██╔██╗ ██║██║  ███╗███████╗
	// ██╔══╝  ██║██║     ██╔══╝      ██╔══██║██╔══██║██║╚██╗██║██║  ██║██║     ██║██║╚██╗██║██║   ██║╚════██║
	// ██║     ██║███████╗███████╗    ██║  ██║██║  ██║██║ ╚████║██████╔╝███████╗██║██║ ╚████║╚██████╔╝███████║
	// ╚═╝     ╚═╝╚══════╝╚══════╝    ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═════╝ ╚══════╝╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚══════╝

	
	// ┌┬┐┌─┐┬ ┬┌┐┌┬  ┌─┐┌─┐┌┬┐  ┌─┐┬┬  ┌─┐┌─┐
	//  │││ ││││││││  │ │├─┤ ││  ├┤ ││  ├┤ └─┐
	// ─┴┘└─┘└┴┘┘└┘┴─┘└─┘┴ ┴─┴┘  └  ┴┴─┘└─┘└─┘


	downloadFiles : function () {


		// get selected
		this._downloadFileList = this._dataLibraryList.getSelected();

		// return if no files selected
		if (!this._downloadFileList.length) return;

		// create list of uuids only
		var fuuids = [];
		this._downloadFileList.forEach(function (file, i, arr) {
			fuuids.push(file.uuid);
		}, this);

		var json = {
			'files' : this._downloadFileList,
			'puuid' : this.project.store.uuid,
			'pslug' : this.project.store.slug

		}


		var json = JSON.stringify(json);

		// post         path          json      callback           this
		Wu.post('/api/file/download', json, this.receivedDownload, this);

		// create download dialog
		this.createDownloadDialog();

		// Google Analytics event tracking
		app.Analytics.setGaEvent(['Side Pane', 'Data library: download files']);

	},

	receivedDownload : function (that, response) {
		

		// set path for zip file
		var path = '/api/file/download?file=' + response + '&type=zip' + '&access_token=' + app.tokens.access_token;
		
		// create download dialog
		that.updateDownloadDialog(path);
	},

	createDownloadDialog : function () {

		// divs
		var wrapper = this._downloadDialog = Wu.DomUtil.create('div', 'download-dialog', this._content);
		var inner = Wu.DomUtil.create('div', 'download-dialog-inner', wrapper);
		var downloadBtn = this._downloadDialogBtn = Wu.DomUtil.create('div', 'download-dialog-button', inner, 'Processing...');
		var cancelBtn = Wu.DomUtil.create('div', 'download-dialog-cancel', inner, 'Cancel');

		// event
		Wu.DomEvent.on(cancelBtn, 'mousedown', this.removeDownloadDialog, this);
		Wu.DomEvent.on(downloadBtn, 'mousedown', this._removeDownloadDialog, this);
	},

	updateDownloadDialog : function (path) {
		this._downloadDialogBtn.innerHTML = '';
		var link = Wu.DomUtil.create('a', 'download-dialog-link', this._downloadDialogBtn, 'Download');
		link.setAttribute('href', path);
	},

	removeDownloadDialog : function () {
		Wu.DomUtil.remove(this._downloadDialog);
	},	

	_removeDownloadDialog : function () {
		this._downloadDialog.style.opacity = 0;
		setTimeout(this.removeDownloadDialog.bind(this), 500);
	},	

	downloadCancel : function () {
		
		// clear download just in case
		this._downloadFileList = [];

		// hide
		if (this._downloadList) this._downloadList.style.display = 'none';
		if (this._container) this._container.style.display = 'block';

		// Show toolbar (upload, download, delete, search);
		Wu.DomUtil.removeClass(this._content, 'hide-top', this);	

		// Google Analytics event tracking
		app.Analytics.setGaEvent(['Side Pane', 'Data library: Cancel download']);
	},



	// ┌┬┐┌─┐┬  ┌─┐┌┬┐┌─┐  ┌─┐┬┬  ┌─┐┌─┐
	//  ││├┤ │  ├┤  │ ├┤   ├┤ ││  ├┤ └─┐
	// ─┴┘└─┘┴─┘└─┘ ┴ └─┘  └  ┴┴─┘└─┘└─┘


	deleteConfirm : function (e) {

		// get selected files
		var checks = this._dataLibraryList.getSelected();
				
		// do nothing on 0 files
		if (checks.length == 0) return; 

		// confirm dialogue, todo: create stylish confirm
		if (confirm('Are you sure you want to delete these ' + checks.length + ' files?')) {    
			this.deleteFiles(checks);
		} 

		// Google Analytics event tracking
		app.Analytics.setGaEvent(['Side Pane', 'Data library: delete files', checks]);

	},

	// OBS! Kommer med en stygg tilbakemelding...	
	deleteFiles : function (files) {

		// set status
		app.setStatus('Deleting');
		
		// remove files n layers from project
		this._project.removeFiles(files);

		// set status
		app.setStatus('Deleted!');

		// refresh sidepane
		this.refreshTable({remove: files});

		// set feedback
		app.feedback.setMessage({
			title : 'Files deleted',
			description : this._getPrettyFileNames(files),
			clearDelay : 5000

		});

	},

	_getPrettyFileNames : function (files) {
		var names = [];
		_.each(files, function (file) {
			names.push(file.name);
		});

		return names.join('<br>');
	},


	// process file
	uploaded : function (result) {

		console.log('uploaded!', result);
		
		// handle errors
		if (result.error) {
			console.error('error', result.error);
			this.handleError(result.error);
		}
		// return if nothing
		if (!result.files) {
			console.error('no files?');
			return;
		}
		// add files to library
		result.files && result.files.forEach(function (file, i, arr) {
			
			// add to project locally (already added on server)
			this._project.setFile(file);
		}, this);

		// add layers
		result.layers && result.layers.forEach(function (layer, i) {
			this._project.addLayer(layer);

			// custom title for rasters
			var title = layer.data.raster ? 'Layer created' : 'Processing done!';
			var sev = layer.data.raster ? 2 : 1;

			// todo: set layer icon
			app.feedback.setMessage({
				title : title,
				description : 'Added <strong>' + layer.title + '</strong> to available layers.',
				id : result.uniqueIdentifier,
				severity : sev
			});

		}, this);

		// if not layer, no processing
		if (!result.layers) {
			var fileUuid = result.files[0].uuid;
			app.SidePane.DataLibrary.processFileDone(fileUuid, 100, 1);
		}

		// refresh Sidepane Options
		app.SidePane.Options.settings.layermenu.update();
		app.SidePane.Options.settings.baselayer.update();

		// refresh sidepane
		app.SidePane.refreshMenu();

		// refresh cartoCssControl
		var ccss = app.MapPane.getControls().cartocss;
		if (ccss) ccss._refresh();

		// refresh
		this.reset();

		// add files
		this.refreshTable({
			add: result.files
		});

	},

	_getImagePath : function (fileUuid, width, height, backgroundImage) {
		var path = app.options.servers.portal;
		path += 'pixels/';
		path += fileUuid;
		var raw = path;
		path += '?width=' + width || 100;
		path += '&height=' + height || 100;

		// set url
		if (backgroundImage) {
			var url = 'url("';
			url += path;
			url += '")';
		} else {
			var url = path;
		}

		return url;
	},

	// to prevent selected text
	stop : function (e) {
		e.preventDefault();
		e.stopPropagation();

	},

	processFile : function (fileID, percent, tiles) {

		var file = app.activeProject.files[fileID];
		file.isProcessing = {};
		file.isProcessing.tiles = tiles;
		file.isProcessing.percent = percent;
		this._dataLibraryList.refreshTable();

	},

	processFileDone : function (fileID) {
		var file = app.activeProject.files[fileID];
		file.isProcessing = null;
		this._dataLibraryList.refreshTable();
	}

});