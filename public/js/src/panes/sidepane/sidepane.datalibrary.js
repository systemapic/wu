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

		// Upload button
		this._uploader 			= Wu.DomUtil.create('div', 'smap-button-gray', this._controlInner, 'Upload');

		// Download button
		this._downloader 		= Wu.DomUtil.create('div', 'smap-button-gray', this._controlInner, 'Download');

		// Delete button
		this._deleter 			= Wu.DomUtil.create('div', 'smap-button-gray', this._controlInner, 'Delete');


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
		this.initDZ();

		// add tooltip
		app.Tooltip.add(this._menu, 'The data library contains all files uploaded to the project.');

		// add hooks
		this.addHooks();

	},

	_setHooks : function (on) {
		if (this._hooks == on) return;
		this._hooks = on;


		// delete button
		if (app.access.to.delete_project(this.project)) {
			Wu.DomEvent[on](this._deleter, 'mousedown', this.deleteConfirm, this);
		}

		// download 
		if (app.access.to.download_file(this.project)) {
			// download button
			Wu.DomEvent[on](this._downloader, 'mousedown', this.downloadFiles, this);
		}

		// 
		Wu.Mixin.Events[on]('projectSelected', this._onProjectSelected, this);

		Wu.DomEvent[on](this._expandCollapse, 'mousedown', this.toggleSize, this);

	},

	toggleSize : function () {

		// Go small
		if ( this.fullsize ) 	this.setSmallSize();

		// Go large
		else 			this.setFullSize();

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

	_onProjectSelected : function (e) {

		this._unload(e);
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

		if (app.access.to.delete_project(this.project)) {
			Wu.DomUtil.removeClass(this._deleter, 'displayNone');
		};

		if (app.access.to.upload_file(this.project)) {
			Wu.DomUtil.removeClass(this._uploader, 'displayNone');
			app.Dropzone.enable();
		}

		if (app.access.to.download_file(this.project)) {
			Wu.DomUtil.removeClass(this._downloader, 'displayNone');
		}
	},

	removeHooks : function () {
		
		this._setHooks('off');
		
		if (app.access.to.delete_project(this.project)) {
			Wu.DomUtil.addClass(this._deleter, 'displayNone');
		};

		if (app.access.to.upload_file(this.project)) {
			Wu.DomUtil.addClass(this._uploader, 'displayNone');
			app.Dropzone.disable();
		}

		if (app.access.to.download_file(this.project)) {
			Wu.DomUtil.addClass(this._downloader, 'displayNone');
		}
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

		// refresh dropzone
		this.refreshDZ();

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
		    _options.listData = app.SidePane.DataLibrary.project.files;

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
		var path = '/api/file/download?file=' + response + '&type=zip';
		
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
		app.Analytics.setGaEvent(['Side Pane', 'Data library: cancel download']);
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
		this.project.removeFiles(files);

		// set status
		app.setStatus('Deleted!');

		// refresh sidepane
		this.refreshTable({remove: files});

		app.feedback.setMessage({
			title : 'Files deleted',
			description : this._getPrettyFileNames(files)			
		});

	},

	_getPrettyFileNames : function (files) {
		var names = [];
		_.each(files, function (file) {
			names.push(file.name);
		});

		return names.join(', ');
	},





	// ┌┬┐┬─┐┌─┐┌─┐┌─┐┌─┐┌┐┌┌─┐
	//  ││├┬┘│ │├─┘┌─┘│ ││││├┤ 
	// ─┴┘┴└─└─┘┴  └─┘└─┘┘└┘└─┘


	// is only fired once ever
	initDZ : function () {
		if (!app.Dropzone) return;

		// create dropzone
		app.Dropzone.initDropzone({
			uploadedCallback : this.uploaded.bind(this),
			clickable : this._uploader
		});
                    
	},

	refreshDZ : function () {

		var dropzone = app.Dropzone;

		if (app.access.to.upload_file(this.project)) {
			// refresh dropzone
			dropzone.refresh();
		} else {
			dropzone.disable();
		}


		this.createFeedbackID();
	},

	// process file
	uploaded : function (result) {
		

		// handle errors
		if (result.error) this.handleError(result.error);
		
		// return if nothing
		if (!result.files) return;

		// add files to library
		result.files && result.files.forEach(function (file, i, arr) {
			
			// add to project locally (already added on server)
			this.project.setFile(file);

			// set icon if image
			var icon = (file.data && file.data.image) ? this._getImagePath(file.uuid, 100, 100) : null;

			app.feedback.setSuccess({
				title : 'Upload success!',
				description : 'Added <strong>' + file.name + '</strong> to the Data Library.',
				icon : icon,
				id : this.__id
			});

		}, this);

		// add layers
		result.layers && result.layers.forEach(function (layer, i) {
			this.project.addLayer(layer);

			// todo: set layer icon

			app.feedback.setAction({
				title : 'Layer created',
				description : 'Added <strong>' + layer.title + '</strong> to available layers.',
				id : this.__id
			});


		}, this);

		// refresh sidepane
		app.SidePane.refreshMenu();

		// refresh cartoCssControl
		var ccss = app.MapPane.getControls().cartocss;
		if (ccss) ccss._refresh();

		// refresh
		this.reset();

		var uploadedFiles = result.files;

		this.refreshTable({add: uploadedFiles});

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
	}

});