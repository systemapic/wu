// Move all pop-ups to model.D3List.js
Wu.SidePane.DataLibrary = Wu.SidePane.Item.extend({
	
	_ : 'sidepane.datalibrary', 
	type : 'dataLibrary',
	title : 'Data <br> Library',
	
	sortDirection : {},

	_initContent : function () {

		// create new fullscreen page, and set as default content
		this._content = Wu.DomUtil.create('div', 'data-library', Wu.app._appPane);
		this._innerContent = Wu.DomUtil.create('div', 'data-library-inner', this._content);
		
		// Button controller
		this._controlContainer = Wu.DomUtil.create('div', 'datalibrary-controls', this._innerContent);	
		this._controlInner = Wu.DomUtil.create('div', 'datalibrary-controls-inner', this._controlContainer);

		this.fullsize = true;
		this._expandCollapse = Wu.DomUtil.create('div', 'datalibrary-expand-collapse', this._controlInner);

		// Search field
		this._search = Wu.DomUtil.create('input', 'search', this._controlInner);
		this._search.id = 'datalibrary-search';
		this._search.setAttribute('type', 'text');
		this._search.setAttribute('placeholder', 'Search files');

		// Download button
		this._downloader = Wu.DomUtil.create('div', 'smap-button-gray', this._controlInner, 'Download');

		// Delete button
		this._deleter = Wu.DomUtil.create('div', 'smap-button-gray', this._controlInner, 'Delete');

		// Upload button
		this._addUploaderButton();

		// error feedback
		this._errors = Wu.DomUtil.createId('div', 'datalibrary-errors', this._controlInner);

		// create container (overwrite default)
		this._container = Wu.DomUtil.create('div', 'editor-wrapper ct1', this._innerContent);

		// create dialogue 
		this._downloadList = Wu.DomUtil.createId('div', 'datalibrary-download-dialogue', this._innerContent);

		// create progress bar
		this.progress = Wu.DomUtil.create('div', 'progress-bar', this._innerContent);
		
		// #datalibrary-container
		this._dataLibraryContainer = Wu.DomUtil.create('div', 'datalibrary-container', this._container);
	
		// #datalibrary-table-container
		this._tableContainer = Wu.DomUtil.create('div', 'datalibrary-table-container', this._dataLibraryContainer);

		// create fullscreen dropzone
		this.fulldrop = Wu.DomUtil.create('div', 'fullscreen-drop', this._content);

		// filecount
		this.filecount = 0;

		// RENDER EMPTY TABLE
		this._fileList = Wu.DomUtil.createId('div', 'filelist', this._tableContainer);
		this._tableFrame = Wu.DomUtil.create('div', 'datalibrary-table', this._fileList);

		// #datalibrary-insertrows
		this._table = Wu.DomUtil.create('div', 'list datalibrary-insertrows', this._tableFrame);

		// init table
		var tableOptions = { container : this._table, searchfield : this._search };
		this._dataLibraryList = new Wu.DataLibraryList(tableOptions);

		// add fullscreen drop 
		this._resumableDrop = Wu.DomUtil.create('div', 'resumable-drop', app._appPane);

		// add hooks
		this.addHooks();

	},

	_addUploaderButton : function () {
		if (this._uploader) {

			// only way to remove listeners on resumable upload button is to destroy completely
			Wu.DomUtil.remove(this._uploader);
			this._uploader = null;
			delete this._uploader;
		}

		// create upload button
		this._uploader = Wu.DomUtil.create('div', 'smap-button-gray', this._controlInner, 'Upload');
	},


	_socketNotificationOfDoneFile : function (file_id, import_time_ms) {
		var that = app.SidePane.DataLibrary;

		this._importTimes = this._importTimes || {};
		this._importTimes[file_id] = import_time_ms;

		// get file objects
		that._getFile(file_id, that._gotFile.bind(that));
	},

	// get file/layer objects from server
	_getFile : function (file_id, callback) {
		var xhr = new XMLHttpRequest();
		var fd = new FormData();
		var url = app.options.servers.portal + 'api/upload/get';
		url += '?fileUuid=' + file_id;
		url += '&access_token=' + app.tokens.access_token;

		xhr.open("GET", url, true);
		xhr.onreadystatechange = function() {
			if(xhr.readyState == 4 && xhr.status == 200) {
				var fileObject = Wu.parse(xhr.responseText);

				// return file
				if (fileObject && fileObject.file && fileObject.layer) return callback(fileObject);
			}
		}
		xhr.send(null);
	},

	_gotFile : function (fileObject) {

		var file = fileObject.file;
		var layer = fileObject.layer;
		var projectUuid = fileObject.project;
		var project = app.Projects[projectUuid];

		// return if no project to add to
		if (!project) return console.error('no project to add file to');

		// remove pending
		project.removePendingFile(file.uuid);

		// add file/layer to project locally
		project.setFile(file);
		project.addLayer(layer);

		// feedback message
		var import_took_pretty = (parseInt(this._importTimes[file.uuid] / 1000)) + ' seconds';
		var description = 'Import took ' + import_took_pretty;
		app.feedback.setMessage({
			title : 'Import successful',
			description : description
		});	

		// reset progress
		app.ProgressBar.hideProgress();

		// if project is active
		if (!app.activeProject) return;
		
		if (project.getUuid() == app.activeProject.getUuid()) {
			// active project
			this._addFile();
			this._addLayer();
		} 
	},

	// add file to project locally
	_addFile : function (file) {
		this.reset();
		this.refreshTable({
			add: [file]
		});
	},

	// add layer to project locally
	_addLayer : function () {

		// refresh sidepane layers
		app.SidePane.Options.settings.layermenu.update();
		app.SidePane.Options.settings.baselayer.update();

		// refresh sidepane
		app.SidePane.refreshMenu();

		// refresh cartoCssControl
		var ccss = app.MapPane.getControls().cartocss;
		ccss && ccss._refresh();

		// refresh chrome content
		app.Chrome.Right._settingsSelector._refreshAll();
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
			// Wu.DomEvent[on](this._downloader, 'mousedown', this.downloadFiles, this);
		}

		// project selected event
		Wu.Mixin.Events[on]('projectSelected', this._onProjectSelected, this);

		// toggle size of data lib pane
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

		// fire
		this._onProjectSelected(e);
	},

	_onProjectSelected : function (e) {

		// unload
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
		if (canDownload) Wu.DomUtil.removeClass(this._downloader, 'displayNone');
	},

	_refreshResumable : function () {

		// remove old
		this._removeResumables();

		// add button
		this._addUploaderButton();

		// check upload access
		var project = this._project || app.activeProject;
		if (!app.access.to.upload_file(project)) return;
			
		// add new
		this._addResumable();
	},

	_removeResumables : function () {
		for (var rs in this._resumables) {
			var r = this._resumables[rs];

			// destroy errything (unless active)
			r.destroy(); 
		}
	},

	_removeResumable : function (r_id) {
		this._resumables[r_id] = null;
		delete this._resumables[r_id];
	},

	// helper fn
	_eachResumable : function (fn) {
		for (var rs in this._resumables) {
			fn(this._resumables[rs]);
		}
	},

	_disableResumable : function () {
		// disable dragging

		// for each resumable
		this._eachResumable(function (r) {
			r.disable();
		});
	},

	_enableResumable : function () {
		// enable dragging
		// for each resumable
		this._eachResumable(function (r) {
			r.enable();
		});
	},
	
	_resumables : {},

	// todo: move into own class (with refresh, etc)
	_addResumable : function () {
		if (!app.activeProject) return;

		// create resumable
		var r = new Wu.Resumable({
			drop : this._resumableDrop,
			browse : this._uploader,
			context : this
		});

		// add to memory
		this._resumables[r.get_id()] = r;

	},

	_activate : function () {

		// add hooks
		this.addHooks();
	},
	
	_deactivate : function () {
		
		// remove hooks
		this.removeHooks();
	},

	_hideControls : function () {
		app.Controller.hideControls();
	},

	_showControls : function () {
		app.Controller.showControls();
	},

	_dragEnter : function (e) {		
		if (!app.activeProject) return;		
		this._showDrop();		
	},		
		
	_dragLeave : function (e) {		
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

		if (options.reset) {
			_options.reset = true;
			_options.canEdit = this._canEdit();		
		}

		if (options.remove) {
			_options.remove = options.remove;
		}		

		if (options.add) {
			_options.add = options.add;
		}
		
		if (options.tableSize) {
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