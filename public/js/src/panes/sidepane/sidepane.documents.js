// DocumentsPane
Wu.SidePane.Documents = Wu.SidePane.Item.extend({
	
	type : 'documents',
	title : 'Docs',


	initContent : function () {

		// create new fullscreen page, and set as default content
		this._content = Wu.DomUtil.create('div', 'fullpage-documents ct1', Wu.app._appPane);
		
		// create container (overwrite default)
		this._container = Wu.DomUtil.create('div', 'editor-wrapper ct11', this._content);

		// insert template
		this._container.innerHTML = ich.documentsContainer();

		// get element handlers
		this._leftpane 	 = Wu.DomUtil.get('documents-container-leftpane');
		this._folderpane = Wu.DomUtil.get('documents-folder-list');
		this._rightpane  = Wu.DomUtil.get('documents-container-rightpane');
		this._textarea   = Wu.DomUtil.get('documents-container-textarea');
		this._newfolder  = Wu.DomUtil.get('documents-new-folder');

		// add tooltip
		app.Tooltip.add(this._menu, 'This is the projects document section.');
		
	},

	initFolders : function () {

		this.folders = {};
		var folders = this.project.store.folders;

		// init local folder object
		folders.forEach(function (folder, i, arr) {
			this.folders[folder.uuid] = folder;
		}, this);

	},

	addHooks : function () {

	},

	addEditHooks : function () {

		// new folder
		Wu.DomEvent.on(this._newfolder, 'mousedown', this.newFolder, this);

		// add grande.js
		this.addGrande();
		
		// show (+)
		Wu.DomUtil.removeClass(this._newfolder, 'displayNone');

	},

	addGrande : function () {
		// get textarea nodes for grande
		var nodes = this._textarea;

		// get sources
		var files   = this.project.getFiles();
		var sources = this.project.getGrandeFiles(files);
		var images  = this.project.getGrandeImages(files);

		// set grande options
		var options = {
			plugins : {

		        	// file attachments
			        attachments : new G.Attachments(sources, {
			        	icon : [app.options.servers.portal + 'images/image-c9471cb2-7e0e-417d-a048-2ac501e7e96f',
			        		app.options.servers.portal + 'images/image-7b7cc7e4-404f-4e29-9d7d-11f0f24faf42'],
			        	className : 'attachment'
			        }),

			        // image attachments
			        images :  new G.Attachments(images, {
			        	icon : [app.options.servers.portal + 'images/image-0359b349-6312-4fe5-b5d7-346a7a0d3c38',
			        		app.options.servers.portal + 'images/image-087ef5f5-b838-48bb-901f-7e896de7c59e'],
			        	embedImage : true,			// embed image in text! 
			        	className : 'image-attachment'
			        }),

			},
			events : {

				// add change event listener
				change : this.textChange
			}
		}

		// create Grande with attachment and image plugin
		this.grande = G.rande(nodes, options);

	},

	removeGrande : function () {
		if (!this.grande) return;
		this.grande.destroy();
		delete this.grande;
	},
	

	textChange : function () {
		// console.log('textChange');
	},

	removeEditHooks : function () {
		
		// new folder
		Wu.DomEvent.off(this._newfolder, 'mousedown', this.newFolder, this);

		// unbind grande.js text editor
		this.removeGrande();

		// hide (+)
		Wu.DomUtil.addClass(this._newfolder, 'displayNone');

	},

	_activate : function (e) {                

		// set top
		this.adjustTop();

		// turn off header resizing and icon
		Wu.app.HeaderPane.disableResize();

		// select first title (create fake e object)
		var folders = this.project.store.folders;
		if (folders.length > 0) {
			var uuid = folders[0].uuid;
			this.selectFolder(uuid);
		};
	
		// if editMode
		if (this.project.editMode) {

			// add shift key hook
			this.enableShift();

			//  hide/show (+) button
			this.addEditHooks();
		}

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

		// turn off header resizing
		Wu.app.HeaderPane.enableResize();

		// remove shift key edit hook
		this.disableShift();

		// remove edit hooks 
		this.removeEditHooks();

		// show controls
		this._showControls();
	},


	enableShift : function () {
		// add shift key edit hook
		Wu.DomEvent.on(window, 'keydown', this.shiftMode, this);
		Wu.DomEvent.on(window, 'keyup', this.unshiftMode, this);
	},

	disableShift : function () {
		// remove shift key edit hook
		Wu.DomEvent.off(window, 'keydown', this.shiftMode, this);
		Wu.DomEvent.off(window, 'keyup', this.unshiftMode, this);
	},

	shiftMode : function (e) {
		var evt = e || window.event;
		if (evt.which != 16) return;    // shift key
	       
		// show delete buttons
		for (b in this._deleteButtons) {
			var btn = this._deleteButtons[b];
			btn.style.visibility = 'visible';
		}
	},

	unshiftMode : function (e) {
		var evt = e || window.event;
		if (evt.which != 16) return;    // shift key
		
		// hide delete buttons
		for (b in this._deleteButtons) {
			var btn = this._deleteButtons[b];
			btn.style.visibility = 'hidden';
		}
	},

	
	adjustTop : function () {
		// debug, for innfelt header
		return;
		// make room for project header
		var project = Wu.app.activeProject;
		if (project) {
			this._content.style.top = project.store.header.height + 'px';
		}

		// adjust top of left pane
		this._leftpane.style.top = '-' + project.store.header.height + 'px';
	},

       

	update : function () {

		// use active project
		this.project = app.activeProject;

		// flush
		this.reset();

		// set folders
		this.createFolders();

		// editMode: hide/show (+) button
		if (this.project.editMode) {
			Wu.DomUtil.removeClass(this._newfolder, 'displayNone');
		} else {
			Wu.DomUtil.addClass(this._newfolder, 'displayNone');
		}

	},

	updateContent : function () {  

		// reset text pane
		this._textarea.innerHTML = '';

		// update         
		this.update();
	},

	newFolder : function () {

		var folder = {
			'title'   : 'Title',
			'uuid'    : Wu.Util.guid('folder'),
			'content' : 'Text content'
		}

		// update 
		this.project.store.folders.push(folder);

		// refresh
		this.update();

	},

	createFolders : function () {

		// set folders
		var folders = this.project.store.folders;

		// return if no folders
		if (!folders) return;

		// delete buttons object
		this._deleteButtons = {};

		// create each folder headline
		folders.forEach(function (elem, i, arr) {

			this._createFolder(elem);

		}, this);
	       
	},

	_createFolder : function (elem) {
		// if editMode
		if (this.project.editMode) {
			// delete button
			var btn = Wu.DomUtil.create('div', 'documents-folder-delete', this._folderpane, 'x');
			// btn.innerHTML = 'x';
			Wu.DomEvent.on(btn, 'click', function (e) { this.deleteFolder(elem.uuid); }, this);
			this._deleteButtons[elem.uuid] = btn;
		}

		// folder item
		var folder = elem;
		folder.el = Wu.DomUtil.create('div', 'documents-folder-item ct23 ct28', this._folderpane);
		folder.el.innerHTML = folder.title;
	       
		// set hooks
		Wu.DomEvent.on( folder.el,  'mousedown', function (e) {
			this.selectFolder(folder.uuid);
		}, this );     // select folder
		
		// if editMode
		if (this.project.editMode) {
			Wu.DomEvent.on( folder.el,  'dblclick', function (e) {
				this._renameFolder(e, folder.uuid);
			}, this );      // rename folder
		}

		// update object
		this.folders[folder.uuid] = folder;
	},

	deleteFolder : function (uuid) {
		if (confirm('Are you sure you want to delete folder ' + this.folders[uuid].title + '?')) {
			delete this.folders[uuid];
			this.save();
		}
	},

	_renameFolder : function (e, uuid) {

		this._editing = true;

		// remove shift key edit hook
		this.disableShift();

		// set values 
		var div   = e.target;
		var value = e.target.innerHTML;
		var input = ich.injectFolderTitleInput({ value : value });
		
		// inject <input>
		div.innerHTML = input;

		// focus
		var target = div.firstChild;
		target.focus();
		target.selectionStart = target.selectionEnd;	// prevents text selection

		// save on blur or enter
		Wu.DomEvent.on( target,  'blur', function (e) { 
			this._titleBlur(e, uuid); 
		}, this );     // save folder title
		Wu.DomEvent.on( target,  'keydown', function (e) { 
			this._titleKey(e, uuid); 
		}, this );     // save folder title

	},

	_titleKey : function (e, uuid) {
		// blur on enter
		if (event.which == 13 || event.keyCode == 13) this._titleBlur(e, uuid);
	},

	_titleBlur : function (e, uuid) {
		if (!this._editing) return;
		this._editing = false;

		// get value
		var value = e.target.value;

		// revert to <div>
		var div = e.target.parentNode;
		div.innerHTML = value;

		// update value
		this.folders[uuid].title = value;                                                                                                                                                                                    

		// save
		this.save();

		// add shift key edit hook
		this.enableShift();

	},


	selectFolder : function (uuid) {

		// get folder
		var folder = this.folders[uuid];

		// clear rightpane hooks
		Wu.DomEvent.off(this._textarea, 'keydown mousedown', this.autosave, this ); // auto-save

		// clear rightpane content
		this._textarea.innerHTML = '';
		this._textarea.innerHTML = folder.content;
		this._textarea.fuuid 	 = uuid;
		
		// blur textarea
		this._textarea.blur();

		// underline title
		this.underline(uuid);

		// set hooks
		Wu.DomEvent.on(this._textarea, 'keydown mousedown', this.autosave, this ); // auto-save

	},

	underline : function (uuid) {
		for (f in this.folders) {
			var el = this.folders[f].el;
			var id = this.folders[f].uuid;

			// underline selected title
			if (uuid == id) { Wu.DomUtil.addClass(el, 'underline'); } 
			else { Wu.DomUtil.removeClass(el, 'underline'); }	
		}
	},
	
	autosave : function () {
		var that = this;
		clearTimeout(this._saving);

		// save after 500ms of inactivity
		this._saving = setTimeout(function () {
			that.saveText();
		}, 500);

	},

	saveText : function () {
		var f = this.folders[this._textarea.fuuid].content;
		var text = this._textarea.innerHTML;

		// return if no changes
		if (f == text) return; 
		
		// update folder object 
		this.folders[this._textarea.fuuid].content = text;
		
		// save
		this.save();
	},

	// save to server
	save : function () {
		var folders = this.folders;
		
		// convert to array
		this.project.store.folders = [];
		for (f in folders) {
			var fo = Wu.extend({}, folders[f]);     // clone 
			delete fo.el;                           // delete .el on clone only
			this.project.store.folders.push(fo);    // push to storage
		}

		// save project to server
		this.project._update('folders');

		// set status
		app.setSaveStatus();

		// refresh
		this.update();
	},

      

	reset : function () {

		// reset left pane
		this._folderpane.innerHTML = '';

		// reset object
		this.folders = {};
	}

});