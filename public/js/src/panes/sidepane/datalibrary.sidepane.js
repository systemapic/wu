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
		this._uploader = Wu.DomUtil.create('div', 'smap-button-gray diplayNone', this._controlInner, 'Upload');

		// Search field
		this._search = Wu.DomUtil.create('input', 'search', this._controlInner);
		this._search.id = 'datalibrary-search';
		this._search.setAttribute('type', 'text');
		this._search.setAttribute('placeholder', 'Search files');

		// Delete button
		this._deleter = Wu.DomUtil.create('div', 'smap-button-gray diplayNone', this._controlInner, 'Delete');

		// Download button
		this._downloader = Wu.DomUtil.create('div', 'smap-button-gray diplayNone', this._controlInner, 'Download');

		// error feedback
		this._errors = Wu.DomUtil.createId('div', 'datalibrary-errors', this._controlInner);

		// create container (overwrite default)
		this._container = Wu.DomUtil.create('div', 'editor-wrapper ct1', this._content);

		// create dialogue 
		this._downloadList = Wu.DomUtil.createId('div', 'datalibrary-download-dialogue', this._content);

		// create progress bar
		this.progress = Wu.DomUtil.create('div', 'progress-bar', this._content);
		
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
		this._tableFrame = Wu.DomUtil.create('table', 'datalibrary-table', this._fileList);
		this._tableHead = Wu.DomUtil.create('thead', '', this._tableFrame);
		this._tableHeadRow = Wu.DomUtil.create('tr', '', this._tableHead);

		this._th1 = Wu.DomUtil.create('th', 'fivep', this._tableHeadRow);
		this._th1.setAttribute('data-sort', 'checkbox');

		this._th1checkBox = Wu.DomUtil.createId('div', 'squaredThree-checkbox-all');
		this._th1checkBox.className = 'squaredThree';

		this._checkall = Wu.DomUtil.createId('input', 'checkbox-all', this._th1checkBox);
		this._checkall.setAttribute('type', 'checkbox');
		this._checkall.setAttribute('name', 'check');
		this._checkall.setAttribute('value', 'None');

		this._checkallLabel = Wu.DomUtil.createId('label', 'label-checkbox-all', this._th1checkBox);
		this._checkallLabel.setAttribute('for', 'checkbox-all');

		this._th2 = Wu.DomUtil.create('th', 'sort thirtyp', this._tableHeadRow, 'Name');
		this._th2.setAttribute('data-sort', 'name');
		this._th2.setAttribute('data-insensitive', 'true');

		this._th3 = Wu.DomUtil.create('th', 'sort type', this._tableHeadRow, 'Type');
		this._th3.setAttribute('data-sort', 'type');
		this._th3.setAttribute('data-insensitive', 'true');

		this._th4 = Wu.DomUtil.create('th', 'sort files', this._tableHeadRow, 'Files');
		this._th4.setAttribute('data-sort', 'files');
		this._th4.setAttribute('data-insensitive', 'true');

		this._th5 = Wu.DomUtil.create('th', 'sort category', this._tableHeadRow, 'Category');
		this._th5.setAttribute('data-sort', 'category');
		this._th5.setAttribute('data-insensitive', 'true');

		this._th6 = Wu.DomUtil.create('th', 'sort keywords', this._tableHeadRow, 'Keywords');
		this._th6.setAttribute('data-sort', 'keywords');
		this._th6.setAttribute('data-insensitive', 'true');

		this._th7 = Wu.DomUtil.create('th', 'sort createdDate', this._tableHeadRow, 'Date');
		this._th7.setAttribute('data-sort', 'createdDate');
		this._th7.setAttribute('data-insensitive', 'true');

		this._th8 = Wu.DomUtil.create('th', 'sort status', this._tableHeadRow, 'Status');
		this._th8.setAttribute('data-sort', 'status');
		this._th8.setAttribute('data-insensitive', 'true');										

		// #datalibrary-insertrows
		this._table = Wu.DomUtil.create('tbody', 'list datalibrary-insertrows', this._tableFrame);

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
	       
		// delete button
		if (app.access.to.delete_project(this.project)) {
			Wu.DomEvent.on(this._deleter, 'mousedown', this.deleteConfirm, this);
			Wu.DomUtil.removeClass(this._deleter, 'displayNone');
		}

		// upload button 
		if (app.access.to.upload_file(this.project)) {
			Wu.DomUtil.removeClass(this._uploader, 'displayNone');
			app.Dropzone.enable();
		}

		// download 
		if (app.access.to.download_file(this.project)) {
			// download button
			Wu.DomEvent.on(this._downloader, 'mousedown', this.downloadFiles, this);
			Wu.DomUtil.removeClass(this._downloader, 'displayNone');
		}

		// check all button
		Wu.DomEvent.on(this._checkallLabel, 'mousedown', this.checkAll, this);

		// search button
		Wu.DomEvent.on(this._search, 'keyup', this.searchList, this);
	},


	// hooks added automatically on page load
	removeHooks : function () {
	       
		// delete button
		Wu.DomEvent.off(this._deleter, 'mousedown', this.deleteConfirm, this);
		Wu.DomUtil.addClass(this._deleter, 'displayNone');

		// upload button 
		Wu.DomUtil.addClass(this._uploader, 'displayNone');
		app.Dropzone.disable();

		// download 
		Wu.DomEvent.off(this._downloader, 'mousedown', this.downloadFiles, this);
		Wu.DomUtil.addClass(this._downloader, 'displayNone');

		// check all button
		Wu.DomEvent.off(this._checkallLabel, 'mousedown', this.checkAll, this);

		// search button
		Wu.DomEvent.off(this._search, 'keyup', this.searchList, this);
	       
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

	initDownloadTable : function () {

		// #datalibrary-download-table
		var table = Wu.DomUtil.create('table', 'datalibrary-download-table', this._downloadList);
		var tableHead = Wu.DomUtil.create('thead', '', table);
		var tr = Wu.DomUtil.create('tr', '', tableHead);
		var th1 = Wu.DomUtil.create('div', 'download-name', tr, 'Name');
		var th2 = Wu.DomUtil.create('div', 'download-category', tr, 'Category');
		var th3 = Wu.DomUtil.create('div', 'download-version', tr, 'Version');
		var th4 = Wu.DomUtil.create('div', 'download-status', tr, 'Status');
		var th5 = Wu.DomUtil.create('div', 'download-format', tr, 'Format');
		var th6 = Wu.DomUtil.create('div', 'download-size', tr, 'Size');
		var th7 = Wu.DomUtil.create('div', 'download-remove', tr, 'Remove');

		// #datalibrary-download-insertrows
		this.tBody = Wu.DomUtil.create('tbody', 'datalibrary-download-insertrows', table);

		// #download-cancel-button
		this._downloadCancel = Wu.DomUtil.create('div', 'smap-button-gray download-cancel-button', this._downloadList, 'Cancel');

		// #download-ok-button
		this._downloadOK = Wu.DomUtil.create('div', 'smap-button-gray download-ok-button', this._downloadList, 'Download');
	
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

		// Google Analytics event tracking
		app.Analytics.ga(['Side Pane', 'Data library: download files']);

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

		// Google Analytics event tracking
		app.Analytics.ga(['Side Pane', 'Data library: cancel download']);
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
		var table = this.tBody;
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

		// Google Analytics event tracking
		app.Analytics.ga(['Side Pane', 'Data library: delete files']);

	},

	deleteFiles : function (files) {

		console.log('delete files: ', files);

		// set status
		app.setStatus('Deleting');
		
		// remove files n layers from project
		this.project.removeFiles(files);

		// set status
		app.setStatus('Deleted!');

		// refresh sidepane
		this.project.refreshSidepane();


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

	// list.js plugin
	initList : function () { 
		
		// add dummy entry
		var _tr = Wu.DomUtil.createId('tr', 'dummy-table-entry', this._table);

		_tr.innerHTML = '';

		var _td1 = Wu.DomUtil.create('td', 'checkbox', _tr);
		var _td1Button = Wu.DomUtil.create('div', 'squaredThree', _td1);

		var _td1Input = Wu.DomUtil.createId('input', '', _td1Button);
		_td1Input.setAttribute('type', 'checkbox');
		_td1Input.setAttribute('value', 'None');
		_td1Input.setAttribute('name', 'check');

		var _td1Label = Wu.DomUtil.create('label', '', _td1Button);
		var _td2 = Wu.DomUtil.create('td', 'name', _tr);
		var _td3 = Wu.DomUtil.create('td', 'tdcont type', _tr);
		var _td4 = Wu.DomUtil.create('td', 'tdcont files', _tr);
		var _td5 = Wu.DomUtil.create('td', 'tdcont category', _tr);
		var _td6 = Wu.DomUtil.create('td', 'tdcont keywords', _tr);
		var _td7 = Wu.DomUtil.create('td', 'tdcont createdDate', _tr);
		var _td8 = Wu.DomUtil.create('td', 'tdcont status', _tr);
		var _td9 = Wu.DomUtil.create('td', 'tdcont uuid', _tr);
		Wu.DomUtil.addClass(_td9, 'displayNone');
		

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
	},

	
	handleError : function (err) {
		console.log('handleError: ', err);

		// set error
		app.feedback.setError({
			title : 'Upload error',
			description : err,
		});

	},

	// process file
	uploaded : function (result) {
		console.log('uploaded!!!', result);
		
		// handle errors
		if (result.error) this.handleError(result.error);
		
		// return if nothing
		if (!result.files) return;

		// add files to library
		result.files && result.files.forEach(function (file, i, arr) {
			
			// add to project locally (already added on server)
			this.project.setFile(file);

			app.feedback.setSuccess({
				title : 'Upload success',
				description : 'Added ' + file.name + ' to the Data Library.'
			});

		}, this);

		// add layers
		result.layers && result.layers.forEach(function (layer, i) {
			this.project.addLayer(layer);

			app.feedback.setMessage({
				title : 'Layer recognized',
				description : layer.title + ' was added to the Data Library.'
			});


		}, this);

		// refresh sidepane
		this.project.refreshSidepane();

		// refresh cartoCssControl
		var ccss = app.MapPane.cartoCss;
		if (ccss) ccss.update();

		// refresh
		this.reset();
		this.refreshTable();

	},

	addFile : function (file) {

		// clone file object
		var tmp = Wu.extend({}, file.getStore()); 

		var tmpData = {
			name 		: tmp.name || 'Title',
			description 	: tmp.description || 'Description',
			nameUuid 	: 'name-' + tmp.uuid,
			descUuid 	: 'description-' + tmp.uuid,			
		}

		// DOM elements must be string...
		var tmpNameString = '<input value="' + tmpData.name + '" id="' + tmpData.nameUuid + '" class="dln" readonly="readonly">';
		tmpNameString += '<textarea  id="' + tmpData.descUuid + '" class="dld" readonly="readonly">' + tmpData.description + '</textarea>';

		// add record (a bit hacky, but with a cpl of divs inside the Name column)
		tmp.name = tmpNameString;

		// clean some fields
		tmp.type = tmp.type.camelize();
		tmp.files = this._createFilePopup(tmp.files);
		tmp.keywords = tmp.keywords.join(', ');
		tmp.createdDate = new Date(tmp.created).toDateString();

		// add file to list.js
		var ret = this.list.add(tmp);
		
		// ugly hack: manually add uuids			// TODO: FIX
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

		// Google Analytics event tracking
		app.Analytics.ga(['Side Pane', 'Data library: inject category']);

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

		// Google Analytics event tracking
		app.Analytics.ga(['Side Pane', 'Data library: inject keywords']);
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

		// Google Analytics event tracking
		app.Analytics.ga(['Side Pane', 'Data library: rename ' + e.target.fieldKey]);
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
			if (file.uuid == fuuid) {	// refactor to file object?

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

		// refresh 
		this.refreshHooks();

		// refresh cartoCssControl
		var cartoCss = app.MapPane.cartoCss;
		if (cartoCss) cartoCss.update();
	},

	refreshHooks : function () {
		this.removeHooks()
		this.addHooks();
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
	}
});