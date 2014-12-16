Wu.SidePane.DataLibrary = Wu.SidePane.Item.extend({
	_ : 'sidepane.datalibrary', 
	
	type : 'dataLibrary',
	title : 'Data <br> Library',


	initContent : function () {

		// create new fullscreen page, and set as default content
		this._content = Wu.DomUtil.create('div', 'data-library ct1', Wu.app._appPane);
		
		// Button controller
		this._controlContainer = Wu.DomUtil.create('div', 'datalibrary-controls', this._content);	
		this._controlInner = Wu.DomUtil.create('div', 'datalibrary-controls-inner', this._controlContainer);

		// Upload button
		this._uploadContainer = Wu.DomUtil.create('div', 'smap-button-gray', this._controlInner, 'Upload');
		this._uploadContainer.id = 'upload-container';

		// Search field
		this._search = Wu.DomUtil.create('input', 'search', this._controlInner);
		this._search.id = 'datalibrary-search';
		this._search.setAttribute('type', 'text');
		this._search.setAttribute('placeholder', 'Search files');

		// Delete button
		this._delete = Wu.DomUtil.create('div', 'smap-button-gray', this._controlInner, 'Delete');
		this._delete.id = 'datalibrary-delete-file';

		// Download button
		this._download = Wu.DomUtil.create('div', 'smap-button-gray', this._controlInner, 'Download');
		this._download.id = 'datalibrary-download-files';

		// error feedback
		this._errors = Wu.DomUtil.createId('div', 'datalibrary-errors', this._controlInner);

		// create container (overwrite default)
		this._container = Wu.DomUtil.create('div', 'editor-wrapper ct1', this._content);

		// create dialogue 
		this._downloadList = Wu.DomUtil.createId('div', 'datalibrary-download-dialogue', this._content);

		// create progress bar
		this.progress = Wu.DomUtil.create('div', 'progress-bar', this._content);
		
		// insert template
		this._container.innerHTML = ich.datalibraryContainer();

		// get element handlers
		this._tableContainer = Wu.DomUtil.get('datalibrary-table-container');
	      
		// create fullscreen dropzone
		this.fulldrop = Wu.DomUtil.create('div', 'fullscreen-drop', this._content);

		// filecount
		this.filecount = 0;

		// render empty table
		this._tableContainer.innerHTML = ich.datalibraryTableframe();

		// get elements
		this._table 		= Wu.DomUtil.get('datalibrary-insertrows');
		this._errors 		= Wu.DomUtil.get('datalibrary-errors');
		this._uploader 		= Wu.DomUtil.get('upload-container');
		this._deleter 		= Wu.DomUtil.get('datalibrary-delete-file');
		this._downloader 	= Wu.DomUtil.get('datalibrary-download-files');
		this._checkall 		= Wu.DomUtil.get('checkbox-all');
		this._checkallLabel 	= Wu.DomUtil.get('label-checkbox-all');

		// init table
		this.initList();

		// init dropzone
		this.initDZ();

		// init download table
		this.initDownloadTable();

		// add tooltip
		app.Tooltip.add(this._menu, 'The data library contains all files uploaded to the project.');

	},

	// hooks added automatically on page load
	addHooks : function () {
	       
		// download button
		Wu.DomEvent.on(this._download, 'mousedown', this.downloadFiles, this);

		// check all button
		Wu.DomEvent.on(this._checkallLabel, 'mousedown', this.checkAll, this);

		// search button
		Wu.DomEvent.on(this._search, 'keyup', this.searchList, this);
	       
	},


	addEditHooks : function () {

		// delete button
		Wu.DomEvent.on(this._deleter, 'mousedown', this.deleteConfirm, this);
		Wu.DomUtil.removeClass(this._deleter, 'displayNone');
	},

	removeEditHooks : function () {

		// delete button
		Wu.DomEvent.off(this._deleter, 'mousedown', this.deleteConfirm, this);
		Wu.DomUtil.addClass(this._deleter, 'displayNone');
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


	_activate : function () {
		if (this.dz) this.dz.enable();
	
		// hide other controls
		this._hideControls();

	},

	_hideControls : function () {

		// layermenu
		var lm = app.MapPane.layerMenu;
		if (lm) lm.hide();

		// inspect
		var ic = app.MapPane.inspectControl;
		if (ic) ic.hide();

		// legends
		var lc = app.MapPane.legendsControl;
		if (lc) lc.hide();

		// description
		var dc = app.MapPane.descriptionControl;
		if (dc) dc.hide();
	},

	_showControls : function () {
		// layermenu
		var lm = app.MapPane.layerMenu;
		if (lm) lm.show();

		// inspect
		var ic = app.MapPane.inspectControl;
		if (ic) ic.show();

		// legends
		var lc = app.MapPane.legendsControl;
		if (lc) lc.show();

		// description
		var dc = app.MapPane.descriptionControl;
		if (dc) dc.show();
	},

	_deactivate : function () {
		if (this.dz) this.dz.disable();

		// show controls
		this._showControls();
	},

	initDownloadTable : function () {

		var table = ich.datalibraryTableDownload();
		this._downloadList.innerHTML = table;

		// get elems 
		this._downloadOK = Wu.DomUtil.get('download-ok-button');
		this._downloadCancel = Wu.DomUtil.get('download-cancel-button');
	
		// set hooks
		Wu.DomEvent.on(this._downloadOK, 'mousedown', this.downloadFiles, this);
		Wu.DomEvent.on(this._downloadCancel, 'mousedown', this.downloadCancel, this);

	},

	checkAll : function () {

		if (this._checkall.checked) {
			// uncheck all visible
			var visible = this.list.visibleItems;
			visible.forEach(function (item, i, arr) {
				var ch = item.elm.children[0].childNodes[1].children[0];
				// uncheck
				if (ch.checked) ch.checked = false;
			}, this);


		} else {
			// check all visible
			var visible = this.list.visibleItems;
			visible.forEach(function (item, i, arr) {
				var ch = item.elm.children[0].childNodes[1].children[0];
				// check
				if (!ch.checked) ch.checked = true; 
			}, this);
		}
	},

	downloadFiles : function () {

		// get selected
		this._downloadFileList = this.getSelected();

		// return if no files selected
		if (!this._downloadFileList.length) return;

		// create list of uuids only
		var fuuids = [];
		this._downloadFileList.forEach(function (file, i, arr) {
			fuuids.push(file.uuid);
		}, this);

		var json = {
			'files' : this._downloadFileList, // [fuuids],
			'puuid' : this.project.store.uuid,
			'pslug' : this.project.store.slug
		}
		var json = JSON.stringify(json);

		// post         path          json      callback           this
		Wu.post('/api/file/download', json, this.receivedDownload, this);

		// create download dialog
		this.createDownloadDialog();

	},

	receivedDownload : function (that, response) {
		// this = window

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
		setTimeout(this.removeDownloadDialog.bind(this), 3000);
	},	

	downloadCancel : function () {
		
		// clear download just in case
		this._downloadFileList = [];

		// hide
		if (this._downloadList) this._downloadList.style.display = 'none';
		if (this._container) this._container.style.display = 'block';

		// Show toolbar (upload, download, delete, search);
		Wu.DomUtil.removeClass(this._content, 'hide-top', this);		
	},

	downloadDone : function () {

		// close and re-init
		var that = this;
		setTimeout(function () {
			that.downloadCancel();
			that.initDownloadTable();
		}, 1000);
		
	},

	downloadConfirm : function (e) {

		// get selected files
		var checks = this.getSelected();
		this._downloadFileList = checks;
		
		// do nothing on 0 files
		if (checks.length == 0) { return; }

		// populate download window
		var tr = '';
		checks.forEach(function (file, i, arr) {
			var tmp = Wu.extend({}, file);
			tr += ich.datalibraryDownloadRow(tmp);
		}, this);

		// get table and insert
		var table = Wu.DomUtil.get('datalibrary-download-insertrows');
		table.innerHTML = tr;

		// show
		this._downloadList.style.display = 'block';
		this._container.style.display = 'none';

		// Hide toolbar (upload, download, delete, search);
		Wu.DomUtil.addClass(this._content, 'hide-top', this);
	
	},

	getSelected : function () {

		// get selected files
		var checks = [];
		this.project.store.files.forEach(function(file, i, arr) {
			var checkbox = Wu.DomUtil.get('checkbox-' + file.uuid);
			if (checkbox) { var checked = checkbox.checked; }
			if (checked) { checks.push(file); }
		}, this);

		return checks;
	},

	deleteConfirm : function (e) {

		// get selected files
		var checks = this.getSelected();
				
		// do nothing on 0 files
		if (checks.length == 0) return; 

		// confirm dialogue, todo: create stylish confirm
		if (confirm('Are you sure you want to delete these ' + checks.length + ' files?')) {    
			this.deleteFiles(checks);
		} 
	},

	deleteFiles : function (files) {

		// set status
		app.setStatus('Deleting');
		
		// remove files n layers from project
		this.project.removeFiles(files);

		// set status
		app.setStatus('Deleted!');

		// refresh sidepane
		this.project.refreshSidepane();

	},


	// list.js plugin
	initList : function () { 
		
		// add dummy entry
		var tr = Wu.DomUtil.createId('tr', 'dummy-table-entry');
		tr.innerHTML = ich.datalibraryTablerow({'type' : 'dummy-table-entry'});
		this._table.appendChild(tr);

		// init list.js
		var options = { valueNames : ['name', 'file', 'category', 'keywords', 'date', 'status', 'type'] };
		this.list = new List('filelist', options);

		// remove dummy
		this.list.clear();
	},

	// is only fired once ever
	initDZ : function () {
		if (!app.Dropzone) return;

		// create dropzone
		app.Dropzone.initDropzone({
			uploaded : this.uploaded.bind(this),
			clickable : this._uploader

		});


		// // create dz
		// this.dz = new Dropzone(this._uploader, {
		// 		url : '/api/upload',
		// 		createImageThumbnails : false,
		// 		autoDiscover : false,
		// 		uploadMultiple : true,
		// 		acceptedFiles : '.zip,.gz,.png,.jpg,.jpeg,.geojson,.docx,.pdf,.doc,.txt',
		// 		// acceptedFiles : '.zip,.gz,.png,.jpg,.jpeg,.geojson,.json,.topojson,.kml,.docx,.pdf,.doc,.txt',
		// 		maxFiles : 10,
		// 		parallelUploads : 10
		// 		// autoProcessQueue : true
		// });

		// // add fullscreen dropzone
		// this.enableFullscreenDZ();                                                                                                                                                                   
		
	},

	// enableFullscreenDZ : function () {

	// 	// add fullscreen bridge to dropzone
	// 	Wu.DomEvent.on(document, 'dragenter', this.dropping, this);
	// 	Wu.DomEvent.on(document, 'dragleave', this.undropping, this);
	// 	Wu.DomEvent.on(document, 'dragover', this.dragover, this);
	// 	Wu.DomEvent.on(document, 'drop', this.dropped, this);


	// },

	// disableFullscreenDZ : function () {

	// 	// remove fullscreen bridge to dropzone
	// 	Wu.DomEvent.off(document, 'dragenter', this.dropping, this);
	// 	Wu.DomEvent.off(document, 'dragleave', this.undropping, this);
	// 	Wu.DomEvent.off(document, 'dragover', this.dragover, this);
	// 	Wu.DomEvent.off(document, 'drop', this.dropped, this);

	// },

	refreshDZ : function () {

		// refresh dropzone
		var dropzone = app.Dropzone;
		dropzone.refresh();



		// // clean up last dz
		// this.dz.removeAllListeners();

		// // set project uuid for dropzone
		// this.dz.options.params.project = this.project.getUuid();	// goes to req.body.project

		// // set dz events
		// this.dz.on('drop', function (e) { 
		// });

		// this.dz.on('dragenter', function (e) { 
		// });

		// this.dz.on('addedfile', function (file) { 

		// 	console.log('addedfile: dataLibrary');

		// 	// show progressbar
		// 	that.progress.style.opacity = 1;

		// 	// show fullscreen file info
		// 	if (!that._fulldrop) {
		// 		that.fullOn(file);
		// 		that.fullUpOn(file);
		// 	}

		// 	// set status
		// 	app.setStatus('Uploading');
		// });


		// this.dz.on('complete', function (file) {
			
		// 	// clean up
		// 	that.dz.removeFile(file);

		// });

		// this.dz.on('uploadprogress', function (file, progress) {
		// 	// set progress
		// 	that.progress.style.width = progress + '%';
		// });                                                                                                                                                                                                               

		// this.dz.on('successmultiple', function (err, json) {
		// 	// parse and process
		// 	var obj = Wu.parse(json);

		// 	// set status
		// 	app.setStatus('Done!', 2000);

		// 	if (obj) { that.uploaded(obj); }

		// 	// clear fullpane
		// 	that.resetProgressbar();
		// });

		

	},

	// resetProgressbar : function () {
	// 	// reset progressbar
	// 	this.progress.style.opacity = 0;
	// 	this.progress.style.width = '0%';

	// 	// reset .fullscreen-drop
	// 	this.fulldropOff();
	// 	this.fullUpOff();
	// 	this._fulldrop = false;

	// },


	// _createFileMetaContent : function (file) {
	// 	if (!file) return; 			// todo: file undefined on drag'n drop

	// 	console.log('_createFileMetaContent file:', file);

	// 	var wrapper 	= Wu.DomUtil.create('div', 'drop-meta-wrapper');
	// 	var name 	= Wu.DomUtil.create('div', 'drop-meta-name', wrapper);
	// 	var size 	= Wu.DomUtil.create('div', 'drop-meta-size', wrapper);
	// 	var type 	= Wu.DomUtil.create('div', 'drop-meta-type', wrapper);
	// 	var ext 	= Wu.DomUtil.create('div', 'drop-meta-type', wrapper);

	// 	name.innerHTML = 'Name: ' + file.name;
	// 	size.innerHTML = 'Size: ' + Wu.Util.bytesToSize(file.size);
	// 	type.innerHTML = 'Type: ' + file.type.split('/')[0].camelize();
	// 	ext.innerHTML  = 'Filetype: ' + file.type.split('/')[1];

	// 	return wrapper;
	// },
	
	// // cxxxx
	// // fullscreen when started uploading                                            // TODO: refactor fullUpOn etc..
	// fullUpOn : function (file) {                                                    //       add support for multiple files
	// 	// transform .fullscreen-drop                                           //       bugtest more thourougly
	
	// 	// add file info
	// 	var meta = this._createFileMetaContent(file);
	// 	if (meta) this.fulldrop.appendChild(meta);	// append meta

	// 	// show
	// 	Wu.DomUtil.addClass(this.fulldrop, 'fullscreen-dropped');
	// },

	// fullUpOff : function () {

	// 	Wu.DomUtil.removeClass(this.fulldrop, 'fullscreen-dropped');
	// 	this.fulldrop.innerHTML = '';
	// },

	// // fullscreen for dropping on
	// fulldropOn : function (e) {

	// 	// turn on fullscreen-drop
	// 	this.fullOn();
		
	// 	// remember drop elem
	// 	this._fulldrop = e.target.className;

	// },
	// fulldropOff : function () {
	// 	// turn off .fullscreen-drop
	// 	this.fullOff();
	// },

	// // fullscreen for dropping on
	// fullOn : function () {

	// 	// turn on fullscreen-drop
	// 	this.fulldrop.style.opacity = 1;				// wow! full up down on dumb! RE.FACTOR!
	// 	this.fulldrop.style.zIndex = 1000;

	// 	// Hide the background container (j)
	// 	this._container.style.display = 'none';

	// 	// Hide toolbar (upload, download, delete, search); (j)
	// 	Wu.DomUtil.addClass(this._content, 'hide-top', this);

	// },

	// fullOff : function () {

	// 	var that = this;
	// 	this.fulldrop.style.opacity = 0;

	// 	// Hide the background container (j)
	// 	this._container.style.display = 'block';

	// 	// Hide toolbar (upload, download, delete, search); (j)
	// 	Wu.DomUtil.removeClass(this._content, 'hide-top', this);


	// 	setTimeout(function () {        // hack for transitions
	// 		 that.fulldrop.style.zIndex = -10;
	// 	}, 200);
	// },

	// dropping : function (e) {
	// 	e.preventDefault();
	    
	// 	// show .fullscreen-drop
	// 	this.fulldropOn(e);
	// },

	// undropping : function (e) {
	// 	e.preventDefault();
	// 	var t = e.target.className;

	// 	// if leaving elem that started drop
	// 	if (t == this._fulldrop) this.fulldropOff(e);
	// },

	// dropped : function (e) {
	// 	e.preventDefault();
		
	// 	// transform .fullscreen-drop
	// 	this.fullUpOn();

	// 	// fire dropzone
	// 	this.dz.drop(e);
	// },

	// dragover : function (e) {
	// 	// needed for drop fn
	// 	e.preventDefault();
	// },

	handleError : function (error) {

		// set error
		app.ErrorPane.setError('Upload error:', error.error, 3);

	},

	// process file
	uploaded : function (record, options) {
		
		var options = options || {};
		
		// handle errors
		if (record.errors) this.handleError(record.errors);
		
		// return if nothing
		if (!record.files) return;

		// add files to library
		record.files && record.files.forEach(function (file, i, arr) {
			
			// add to project locally (already added on server)
			this.project.setFile(file);

		}, this);


		// add layers
		record.layers && record.layers.forEach(function (layer, i) {
			this.project.addLayer(layer);
		}, this);
		
		// refresh sidepane
		this.project.refreshSidepane();

		// refresh cartoCssControl
		var cartoCss = app.MapPane.cartoCss;
		if (cartoCss) cartoCss.update();

		// refresh
		this.reset();
		this.refreshTable();

	},

	addFile : function (file) {

		// clone file object
		var tmp = Wu.extend({}, file.getStore());   

		// add record (a bit hacky, but with a cpl of divs inside the Name column)
		tmp.name = ich.datalibraryTablerowName({
			name 		: tmp.name || 'Title',
			description 	: tmp.description || 'Description',
			nameUuid 	: 'name-' + tmp.uuid,
			descUuid 	: 'description-' + tmp.uuid,
		});

		// clean some fields
		tmp.type = tmp.type.camelize();
		tmp.files = this._createFilePopup(tmp.files);
		tmp.keywords = tmp.keywords.join(', ');
		tmp.createdDate = new Date(tmp.created).toDateString();

		// add file to list.js
		var ret = this.list.add(tmp);
		
		// ugly hack: manually add uuids
		ret[0].elm.id = tmp.uuid;                              // <tr>
		var c = ret[0].elm.children[0].children[0].children;    
		c[0].id = 'checkbox-' + tmp.uuid;                      // checkbox
		c[1].setAttribute('for', 'checkbox-' + tmp.uuid);      // label

		// add hooks for editing file, if edit access
		if (this.project.editMode) this._addFileEditHooks(tmp.uuid);
	
	},


	_createFilePopup : function (files) {
		var length = files.length;
		var html = '<div class="dataLibrary-file-popup-wrap">';
		html += '<div class="dataLibrary-file-popup-trigger">' + length + '</div>';
		html += '<div class="dataLibrary-file-popup-list">Files:<br>';
		files.forEach(function (f) {
			html += '<div class="dataLibrary-file-popup-item">'
			html += '• ' + f;
			html += '</div>';
		}, this);
		html += '</div></div>';
		return html; // as html, not nodes
	},

	_addFileEditHooks : function (uuid) {

		// get <input>'s
		var title = Wu.DomUtil.get('name-' + uuid);
		var desc = Wu.DomUtil.get('description-' + uuid);

		// get main
		var tr = Wu.DomUtil.get(uuid);
		var cat  = tr.children[4];
		var keyw = tr.children[5];

		// set click hooks on title and description
		Wu.DomEvent.on( title,  'mousedown mouseup click', 	this.stop, 		this ); 
		Wu.DomEvent.on( title,  'dblclick', 			this.rename, 		this );     // select folder
		Wu.DomEvent.on( desc,   'mousedown mouseup click', 	this.stop, 		this ); 	
		Wu.DomEvent.on( desc,   'dblclick', 			this.rename, 		this );     // select folder
		Wu.DomEvent.on( cat,    'mousedown mouseup click', 	this.stop, 		this ); 	
		Wu.DomEvent.on( cat,    'dblclick', 			this.injectCategory, 	this );     // select folder
		Wu.DomEvent.on( keyw,   'mousedown mouseup click', 	this.stop, 		this ); 	
		Wu.DomEvent.on( keyw,   'dblclick', 			this.injectKeywords, 	this );     // select folder

	},


	// to prevent selected text
	stop : function (e) {
		e.preventDefault();
		e.stopPropagation();

		// hacky to close categories on any click
		this.closeCategories();
	},


	injectCategory : function (e) {

		// close others
		this.closeCategories();

		// hacky: reset search so no errors 		// TODO!
		this.resetSearch();

		// get file uuid
		var fileUuid = this._injectedUuid = e.target.parentNode.id;

		// get file object
		var file = this.project.getFile(fileUuid);

		// create wrapper
		var wrapper = this._injected = Wu.DomUtil.create('div', 'datalibrary-category-wrapper');

		// add line per category
		var categories = this.project.getCategories();

		// for each category
		categories.forEach(function (c) {

			// create category line
			this.createCategoryLine(wrapper, c, file);

		}, this);

		// add new category line
		var newlinewrap = Wu.DomUtil.create('div', 'datalibrary-category-new-wrap', wrapper);
		var newline = this._injectedNewline = Wu.DomUtil.create('input', 'datalibrary-category-new', newlinewrap);
		newline.setAttribute('placeholder', 'Add category...');

		// set event on new category
		Wu.DomEvent.on(newline, 'keydown', this.categoryKeydown, this);
		Wu.DomEvent.on(newline, 'mousedown', Wu.DomEvent.stopPropagation, this);

		// set position 
		wrapper.style.position = 'absolute';
		wrapper.style.left = e.x - 50 + 'px';
		wrapper.style.top = e.y + 'px';

		// add to body
		document.body.appendChild(wrapper);

		// add outside click event
		Wu.DomEvent.on(window, 'mousedown', this._closeCategories, this);

	},

	createCategoryLine : function (wrapper, c, file) {

		// create line item
		var wrap = Wu.DomUtil.create('div', 'datalibrary-category-line-wrap', wrapper);
		var div  = Wu.DomUtil.create('div', 'datalibrary-category-line', wrap, c.camelize());
		var del  = Wu.DomUtil.create('div', 'datalibrary-category-line-del', wrap, 'X');

		// select category
		Wu.DomEvent.on(div, 'mousedown', function (e) {
			
			// stop
			Wu.DomEvent.stopPropagation(e);

			// set vars
			var value = c;
			var key = 'category';

			// save to model
			file.setCategory(value);

			// close
			this.closeCategories();
		
			// refresh 		// todo: a reset/refresh of table will annul sort
			this.reset();
			this.refreshTable();

		}, this);

		// delete category
		Wu.DomEvent.on(del, 'mousedown', function (e) {

			// stop
			Wu.DomEvent.stopPropagation(e);

			// remove category
			var msg = 'Are you sure you want to delete category ' + c.camelize() + '? This will remove the category from all files.';
			if (confirm(msg)) {

				// remove category
				this.removeCategory(c);
			} 


		}, this);

	},

	removeCategory : function (category) {

		// remove from project
		this.project.removeCategory(category);
	
		// remove from all files
		var files = this.project.getFileObjects();
		for (f in files) {
			var file = files[f];
			if (file.getCategory().toLowerCase() == category.toLowerCase()) {
				file.setCategory(''); // set blank
			}
		}

		// close
		this.closeCategories();
	
		// refresh 		// todo: a reset/refresh of table will annul sort
		this.reset();
		this.refreshTable();
	},

	closeCategories : function () {
		if (this._injected) Wu.DomUtil.remove(this._injected);

		Wu.DomEvent.off(window, 'mousedown', this._closeCategories, this);
	},

	_closeCategories : function () {
		this.closeCategories();
	},

	injectCategoryBlur : function () {

		// update file in project
		this.project.store.files.forEach(function(file, i, arr) {
			// iterate and find hit
			// if (file.uuid == fuuid) file[key] = value;
		}, this);

	},

	categoryKeydown : function (e) {
		console.log('categoryKeydown!', e.keyCode);

		// on enter
		if (e.keyCode == 13) {

			// get value
			var value = this._injectedNewline.value;

			// create new category
			this.project.addCategory(value);

			// get file
			var fileUuid = this._injectedUuid;
			var file = this.project.getFile(fileUuid);

			// set category
			file.setCategory(value);

			// close
			this.closeCategories();
		
			// refresh 		// todo: a reset/refresh of table will annul sort
			this.reset();
			this.refreshTable();


		}

		// on esc
		if (e.keyCode == 27) {
			console.log('esc!');
			
			// close, do nothing
			this.closeCategories();
		}
	},

	injectKeywords : function (e) {

		var fuuid = e.target.parentNode.id;
		this._injectedUuid = fuuid;

		// inject <input>
		var input = Wu.DomUtil.create('input', 'datalibrary-edit-field');
		input.value = e.target.innerHTML;
		input.setAttribute('placeholder', 'Enter value');
		input.removeAttribute('readonly');
		e.target.innerHTML = '';
		e.target.appendChild(input);
		input.focus();

		// save on blur or enter
		Wu.DomEvent.on(input,  'blur', this.injectKeywordsBlur, this);   // save folder title
		Wu.DomEvent.on(input,  'keydown', this.editKey, this);    	 // fire blur on key press

	},

	injectKeywordsBlur : function (e) {

		// get value
		var value = e.target.value;

		// set text 
		var parent = e.target.parentNode;
		parent.innerHTML = value;

		// split into array and trim
		var split = value.split(',');
		split.forEach(function (s, i, arr) {
			arr[i] = s.trim();
		}, this);

		// update file in project
		var file = this.project.getFile(this._injectedUuid);
		file.setKeywords(split);

	},


	rename : function (e) {

		// enable editing on input box
		e.target.removeAttribute('readonly'); 
		e.target.focus();
		e.target.selectionStart = e.target.selectionEnd;

		// set key
		e.target.fieldKey = e.target.id.split('-')[0];

		// save on blur or enter
		Wu.DomEvent.on( e.target,  'blur', this.editBlur, this );     // save folder title
		Wu.DomEvent.on( e.target,  'keydown', this.editKey, this );     // save folder title

	},


	editKey : function (e) {
		// blur on enter
		if (event.which == 13 || event.keyCode == 13) e.target.blur();
	},

	editBlur : function (e) {

		// get key
		var key = e.target.fieldKey;

		// set back to readonly
		e.target.setAttribute('readonly', 'readonly');                                                                                                                                                                                         
		
		// get file uuid
		var fuuid = e.target.id.replace(key + '-', '');

		// get new title
		var value = e.target.value || e.target.innerHTML;

		// update file in project
		this.project.store.files.forEach(function(file, i, arr) {
			// iterate and find hit
			if (file.uuid == fuuid) file[key] = value;
		}, this);

		// refresh list
		this.list.update();     // todo: funky behavior when changing name, doesn't reflect (ie. sort works on old value)

		// save to server
		this._save(fuuid, key);

		// save new name to Layer also
		if (key == 'name') this.updateLayerName(fuuid, value);

	},

	updateLayerName : function (fileUuid, value) {
		// find and update layer
		var layer = this.project.getLayerFromFile(fileUuid);
		if (layer) layer.setTitle(value);
	},

	_save : function (fuuid, key) {

		// save the file
		this.project.store.files.forEach(function(file, i, arr) {
		     
			// iterate and find hit
			if (file.uuid == fuuid) {

				// create update object
				var json = {};
				json[key] = file[key];
				json.uuid = file.uuid;

				// update, no callback
				var string = JSON.stringify(json);
				Wu.save('/api/file/update', string); 
			}
		});

		app.setSaveStatus();
	},

	updateContent : function () {
		this.update();
	},

	update : function () {

		// use active project
		this.project = Wu.app.activeProject;

		// flush
		this.reset();

		// refresh dropzone
		this.refreshDZ();

		// refresh table entries
		this.refreshTable();

		if (this.project.editMode) {
			this.addEditHooks();
		} else {
			this.removeEditHooks();
		}

		// refresh cartoCssControl
		var cartoCss = app.MapPane.cartoCss;
		if (cartoCss) cartoCss.update();

	},

	refreshTable : function () {

		// return if empty filelist
		if (!this.project.files) { return; }

		// enter files into table
		for (f in this.project.files) {
			var file = this.project.files[f];
			this.addFile(file);
		};

		// sort list by name by default
		this.list.sort('name', {order : 'asc'});
	},

	reset : function () {

		// clear table
		this.list.clear();

		// remove uploading, in case bug
		// this.fullOff();
		// this.fulldropOff();

	}

});
