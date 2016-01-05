Wu.Chrome.Data = Wu.Chrome.extend({

	_ : 'data', 

	options : {
		defaultWidth : 400
	},

	// When a new layer is created, we make a background fade on it
	newLayer : false,

	_initialize : function () {

		// init container
		this._initContainer();

		// init content
		this._initContent();

		// register buttons
		this._registerButton();

		// hide by default
		this._hide();

		// shortcut
		app.Tools = app.Tools || {};
		app.Tools.DataLibrary = this;	
	},

	_onLayerAdded : function (options) {

		var uuid = options.detail.layerUuid;

		// remember
		this.newLayer = uuid;

		// Get layer object
		var layer = this._project.getLayer(uuid);

		// Get layer meta
		var layerMeta = JSON.parse(layer.store.metadata);

		// Build tooltip object
		var tooltipMeta = app.Tools.Tooltip._buildTooltipMeta(layerMeta); // TODO: use event?

		// Create tooltip meta...
		layer.setTooltip(tooltipMeta);

		// refresh
		this._refresh();
	},

	_onFileDeleted : function () {
		this._refresh();
	},

	_onLayerDeleted : function () {
		this._refresh();
	},

	_onLayerEdited : function () {
		this._refresh();
	},

	_initContainer : function () {

		// create the container (just a div to hold errythign)
		this._container = Wu.DomUtil.create('div', 'chrome chrome-content data', this.options.appendTo);

		// Middle container
		this._innerContainer = Wu.DomUtil.create('div', 'chrome-data-inner', this._container);

		// todo: create wrapper for layers - needs to be hidden if not editor

		// LAYER LIST OUTER SCROLLER
		this._listOuterScroller = Wu.DomUtil.create('div', 'chrome-data-outer-scroller', this._innerContainer);
		this._listOuterScroller.style.height = '100%';

		// List container
		this._listContainer = Wu.DomUtil.create('div', 'chrome-data-scroller', this._listOuterScroller);

		// LAYER LIST
		this._initLayerListContainer();
		
		// FILE LIST
		this._initFileListContainer();
		
		// Top container (with upload button)
		this.topContainer = Wu.DomUtil.create('div', 'chrome-data-top', this._container);
		// this.topTitle = Wu.DomUtil.create('div', 'chrome-data-top-title', this.topContainer, 'Data Library');

		// close event
		Wu.DomEvent.on(this._innerContainer, 'click', this._closeActionPopUps, this);

	},


	// Layer list container
	_initLayerListContainer : function () {

		this._layerListWrapper = Wu.DomUtil.create('div', 'chrome-layer-list-wrapper', this._listContainer)		

		this._layerListTitle = Wu.DomUtil.create('div', 'chrome-content-header layer-list-container-title', this._layerListWrapper, 'Layers');

		// Containers
		this._layersContainer = Wu.DomUtil.create('div', 'layers-container', this._layerListWrapper);
		
		// base layers
		this._baseLayers = Wu.DomUtil.create('div', 'chrome-content-header layer-list-container-title', this._layerListWrapper, 'Background layer');
		this._baseLayerDropdownContainer = Wu.DomUtil.create('div', 'base-layer-dropdown-container', this._layerListWrapper);

		// Lines
		this._fileListSeparator = Wu.DomUtil.create('div', 'file-list-separator', this._layerListWrapper);		

	},

	// File list container
	_initFileListContainer : function () {

		// HEADER
		this._fileListTitle = Wu.DomUtil.create('div', 'chrome-content-header layer-list-container-title layer-list', this._listContainer, '<i class="fa fa-database"></i> My Datasets');

		// Upload button container
		this._uploadButtonContainer = Wu.DomUtil.create('div', 'upload-button-container', this._listContainer);

		// Containers
		this._filesContainer = Wu.DomUtil.create('div', 'files-container', this._listContainer);
	},

	_initContent : function () {

		// add hooks
		this._addEvents();
	},

	_registerButton : function () {

		// register button in top chrome
		var top = app.Chrome.Top;

		// add a button to top chrome
		this._topButton = top._registerButton({
			name : 'data',
			className : 'chrome-button datalib',
			trigger : this._togglePane,
			context : this,
			project_dependent : true
		});

		// css experiement
		this._topButton.innerHTML = '<i class="top-button fa fa-cloud"></i>Data';

	},

	_togglePane : function () {

		// right chrome
		var chrome = this.options.chrome;

		// open/close
		this._isOpen ? chrome.close(this) : chrome.open(this); // pass this tab

		if (this._isOpen) {

			// fire event
			app.Socket.sendUserEvent({
				user : app.Account.getFullName(),
				event : 'opened',
				description : 'the data library',
				timestamp : Date.now()
			});
		}
	},

	_show : function () {

		// Open layer menu
		app.MapPane._controls.layermenu.open();

		// mark button active
		Wu.DomUtil.addClass(this._topButton, 'active');
		this._container.style.display = 'block';
		this._isOpen = true;

		// enable edit of layer menu...
		var layerMenu = app.MapPane.getControls().layermenu;
		if (this._project.isEditable()) layerMenu.enableEditSwitch();

		// open if closed
		if (!layerMenu._layerMenuOpen) app.Chrome.Top._openLayerMenu();
	},

	_hide : function () {

		// mark button inactive
		Wu.DomUtil.removeClass(this._topButton, 'active');
		this._container.style.display = 'none';
		
		if (this._isOpen) {
			var layerMenu = app.MapPane.getControls().layermenu;	 // move to settings selector
			if (layerMenu) layerMenu.disableEditSwitch();
		}

		this._isOpen = false;
	},

	onOpened : function () {
	},
	onClosed : function () {
	},
	_addEvents : function () {
	},
	_removeEvents : function () {
	},
	_onWindowResize : function () {
	},

	getDimensions : function () {
		var dims = {
			width : this.options.defaultWidth,
			height : this._container.offsetHeight
		}
		return dims;
	},

	_onFileImported : function (e) {
		
		// refresh DOM
		this._refresh();

		// get file
		var file = e.detail.file;

		// automatically create layer
		file._createLayer(this._project, function (err, layer) {

			// automatically add layer to layermenu
			this._addOnImport(layer);

		}.bind(this));


	},


	_addOnImport : function (layer) {

		// add
		this.addLayer(layer)

		// enable layer
		this.enableLayer(layer);

		// fly to
		layer.flyTo();

		// refresh
		this._refreshLayers();

		// open styler if postgis
		if (layer.isPostgis()) {
			app.Tools.SettingsSelector.open();
		}

	},


	_refresh : function () {

		if (!this._project) return;

		// remove temp files
		_.each(this._tempFiles, function (tempFile, etc) {
			Wu.DomUtil.remove(tempFile.datawrap);
		});
		this._tempFiles = {};

		// Empty containers
		if ( this._layersContainer ) this._layersContainer.innerHTML = '';
		if ( this._filesContainer )  this._filesContainer.innerHTML = '';

		// only update list if project is editable
		if (this._project.isEditable()) {

			// Layer list
			this._initLayerList();
			this._refreshLayers();

			// this._initBaseLayerList(); // why twice?
			this._refreshBaseLayerList();
		}

		this._refreshBaseLayerList();

		// File list
		this._initFileLists();
		this._refreshFiles();

		// Upload button
		this._initUploadButton();

		// layer title
		var projectName = this._project.getTitle();
		this._layerListTitle.innerHTML = 'Layers for ' + projectName;	

		// hide layers if not editor
		if (!this._project.isEditable()) {
			// todo: put layers in wrapper and hide
			Wu.DomUtil.addClass(this._layerListWrapper, 'displayNone');
		} else {
			Wu.DomUtil.removeClass(this._layerListWrapper, 'displayNone');
		}

	},

	_initUploadButton : function () {

		// Return if upload button already exists
		if (this.uploadButton) return;

		// get upload button
		this.uploadButton = app.Data.getUploadButton('chrome-upload-button', this._uploadButtonContainer);
		
		// set title
		this.uploadButton.innerHTML = '<i class="fa fa-cloud-upload"></i>Upload data';
	},


	// When clicking on container, close popups
	_closeActionPopUps : function (e) {

		var classes = e.target.classList;
		var stop = false;

		// Stop when clicking on these classes
		if (classes.forEach) classes.forEach(function(c) {
			if ( c == 'file-action') stop = true;
			if ( c == 'file-popup-trigger') stop = true;
			if ( c == 'file-popup') stop = true;
			if ( c == 'toggle-button') stop = true;
		})

		// Stop if we're editing name
		if (e.target.name == this.editingFileName) stop = true;
		if (e.target.name == this.editingLayerName) stop = true;

		if (stop) return;

		// Reset
		this.showFileActionFor = false;
		this.selectedFiles = [];

		this.showLayerActionFor = false;
		this.selectedLayers = [];
		
		this._refreshFiles();
		this._refreshLayers();
	},	



	_initFileLists : function () {

		// Holds each section (project files, my files, etc)
		// Currently only "my files"
		this.fileListContainers = {};

		// Holds files that we've selected
		this.selectedFiles = [];

		// Show file actions for this specific file (i.e. download, rename, etc)
		this.showFileActionFor = false;

		// Edit file name for this file
		this.editingFileName = false;

		// File list (global)
		this.fileProviders = {};

		this.fileProviders.postgis = {
			name : 'Data Library',
			data : [],
			getFiles : function () {
				return app.Account.getFiles()
			}
		}
		
		// Create FILE LIST section, with D3 container
		for (var f in this.fileProviders ) {

			this.fileListContainers[f] = {};

			// Create wrapper
			this.fileListContainers[f].wrapper = Wu.DomUtil.create('div', 'file-list-container', this._filesContainer);
			
			// D3 Container
			this.fileListContainers[f].fileList = Wu.DomUtil.create('div', 'file-list-container-file-list', this.fileListContainers[f].wrapper);
			this.fileListContainers[f].D3container = d3.select(this.fileListContainers[f].fileList);
		}

	},	

	
	_refreshFiles : function () {

		// FILES
		for (var p in this.fileProviders) {
			var provider = this.fileProviders[p];
			var files = provider.getFiles();

			// get file list, sorted by last updated
			provider.data = _.sortBy(_.toArray(files), function (f) {
				return f.store.lastUpdated;
			}).reverse();

			// containers
			var D3container = this.fileListContainers[p].D3container;
			var data = this.fileProviders[p].data;
			this.initFileList(D3container, data, p);
		}

	},

	// create temp file holder in file list while processing
	_onFileProcessing : function (e) {
		var file = e.detail.file;

		var unique_id = file.uniqueIdentifier;
		var filename = file.fileName;
		var size = parseInt(file.size / 1000 / 1000) + 'MB';

		// add temp file holder
		var datawrap = Wu.DomUtil.create('div', 'data-list-line processing');
		var title = Wu.DomUtil.create('div', 'file-name-content processing', datawrap, filename);
		var feedback = Wu.DomUtil.create('div', 'file-feedback processing', datawrap);
		var percent = Wu.DomUtil.create('div', 'file-feedback-percent processing', datawrap);

		// remember
		this._tempFiles = this._tempFiles || {}
		this._tempFiles[unique_id] = {
			feedback : feedback,
			percent : percent,
			file : file,
			datawrap : datawrap
		}

		// get file list
		var file_list = this.fileListContainers.postgis.wrapper;

		// prepend
		file_list.insertBefore(datawrap, file_list.firstChild);
	},

	_onProcessingProgress : function (e) {

		var data = e.detail;
		var percent = data.percent;
		var text = data.text;
		var uniqueIdentifier = data.uniqueIdentifier;

		// get temp file divs
		var tempfile = this._tempFiles[uniqueIdentifier];

		if (!tempfile) return;

		// set feedback
		tempfile.feedback.innerHTML = text;
		tempfile.percent.innerHTML = percent + '% done';

	},

	_onProcessingError : function (e) {

		var error = e.detail;
		var uniqueIdentifier = error.uniqueIdentifier;

		// get temp file divs
		var tempfile = this._tempFiles[uniqueIdentifier];

		// set feedback
		tempfile.feedback.innerHTML = error.description;
		tempfile.percent.innerHTML = 'Upload failed';
		tempfile.datawrap.style.background = '#F13151';
		
		// close on click
		Wu.DomEvent.on(tempfile.datawrap, 'click', this._refresh, this);

	},



	// ┌─┐┌─┐┌─┐┬ ┬  ┌─┐┬┬  ┌─┐  ┬ ┬┬─┐┌─┐┌─┐┌─┐┌─┐┬─┐
	// ├┤ ├─┤│  ├─┤  ├┤ ││  ├┤   │││├┬┘├─┤├─┘├─┘├┤ ├┬┘
	// └─┘┴ ┴└─┘┴ ┴  └  ┴┴─┘└─┘  └┴┘┴└─┴ ┴┴  ┴  └─┘┴└─	
	initFileList : function (D3container, data, library) {


		// BIND
		var dataListLine = 
			D3container
			.selectAll('.data-list-line')
			.data(data);

		// ENTER
		dataListLine
			.enter()
			.append('div')
			.classed('data-list-line', true);

		// UPDATE
		dataListLine
			.classed('file-selected', function (d) {
				
				var uuid = d.getUuid();

				// If selected by single click
				if ( uuid == this.showFileActionFor ) return true;

				// Else no selection
				return false;

			}.bind(this));


		dataListLine
			.classed('editingFileName', function (d) {
				var uuid = d.getUuid();
				if ( this.editingFileName == uuid ) return true;
				return false;
			}.bind(this))

		// EXIT
		dataListLine
			.exit()
			.remove();

		
		// CREATE NAME CONTENT (file name)
		this.createFileNameContent(dataListLine, library);

		// CREATE FILE META (date and size)
		this.createFileMetaContent(dataListLine, library);
		
		// FILE AUTHOR
		// this.createFileAuthor(dataListLine, library);	

		// CREATE POP-UP TRIGGER (the "..." button)
		this.createFilePopUpTrigger(dataListLine, library);

		// CREATE FILE ACTION POP-UP (download, delete, etc)
		this.createFileActionPopUp(dataListLine, library)


	},


	// ┌─┐┬┬  ┌─┐  ┌┬┐┌─┐┌┬┐┌─┐
	// ├┤ ││  ├┤   │││├┤  │ ├─┤
	// └  ┴┴─┘└─┘  ┴ ┴└─┘ ┴ ┴ ┴

	createFileMetaContent : function (parent, library) {

		var that = this;

		// Bind
		var nameContent = 
			parent
			.selectAll('.file-meta-content')
			.data(function(d) { return [d] })

		// Enter
		nameContent
			.enter()
			.append('div')
			.classed('file-meta-content', true)


		// Update
		nameContent
			.html(function (d) { 

				var _str = '';

				// User
				var userId = d.getCreatedBy();
				var userName = app.Users[userId].getFullName()

				_str += '<span class="file-meta-author">' + userName + '</span>';

				// Date
				// var date = moment(d.getCreated()).format('DD MMMM YYYY');
				var date = d.getCreatedPretty();
				_str += '- <span class="file-meta-date">' + date + '</span>';

				// Size
				var bytes = d.getStore().dataSize;				
				var size = Wu.Util.bytesToSize(bytes);
				_str += ' – <span class="file-meta-size">' + size + '</span>';
				
				return _str;

			}.bind(this))


		// Exit
		nameContent
			.exit()
			.remove();

	},




	// ┌─┐┬┬  ┌─┐  ┌┐┌┌─┐┌┬┐┌─┐
	// ├┤ ││  ├┤   │││├─┤│││├┤ 
	// └  ┴┴─┘└─┘  ┘└┘┴ ┴┴ ┴└─┘

	createFileNameContent : function (parent, library) {

		var that = this;

		// Bind
		var nameContent = 
			parent
			.selectAll('.file-name-content')
			.data(function(d) { return [d] })

		// Enter
		nameContent
			.enter()
			.append('div')
			.classed('file-name-content', true)


		// Update
		nameContent
			.html(function (d) { 
				return d.getTitle();
			}.bind(this))
			.on('dblclick', function (d) {
				this.activateFileInput(d, library);
			}.bind(this));			


		// Exit
		nameContent
			.exit()
			.remove();


		// Create input field (for editing file name)
		this.createFileInputField(nameContent, library);


	},

	
	// ┌─┐┬┬  ┌─┐  ┬┌┐┌┌─┐┬ ┬┌┬┐
	// ├┤ ││  ├┤   ││││├─┘│ │ │ 
	// └  ┴┴─┘└─┘  ┴┘└┘┴  └─┘ ┴ 

	// For editing file name

	createFileInputField : function (parent, library) {

		var that = this;

		// Bind
		var nameInput = 
			parent
			.selectAll('.file-name-input')
			.data(function (d) {
				var uuid = d.getUuid();
				if ( this.editingFileName == uuid ) return [d];
				return false;
			}.bind(this))

		// Enter
		nameInput
			.enter()
			.append('input')
			.attr('type', 'text')			
			.classed('file-name-input', true)


		// Update
		nameInput
			.attr('placeholder', function (d) {
				if ( library == 'layers' ) return d.getTitle();
				return d.getName();
			})
			.attr('name', function (d) {
				return d.getUuid()
			})
			.html(function (d) {
				if ( library == 'layers' ) return d.getTitle();
				return d.getName();
			})
			.classed('displayNone', function (d) {
				var uuid = d.getUuid();				
				if ( that.editingFileName == uuid ) return false;	
				return true;
			})
			.on('blur', function (d) {
				var newName = this.value;
				that.saveFileName(newName, d, library);
			})
			.on('keydown', function (d) {
				var keyPressed = window.event.keyCode;
				var newName = this.value;
				if ( keyPressed == 13 ) this.blur(); // Save on enter
			});

		// Exit
		nameInput
			.exit()
			.remove();


		// Hacky, but works...
		// Select text in input field...
		if ( nameInput ) {
			nameInput.forEach(function(ni) {
				if ( ni[0] ) {
					ni[0].select();
					return;
				}
			})
		}

	},




	// ┌─┐┌─┐┌─┐┬ ┬┌─┐  ┌┬┐┬─┐┬┌─┐┌─┐┌─┐┬─┐
	// ├─┘│ │├─┘│ │├─┘   │ ├┬┘││ ┬│ ┬├┤ ├┬┘
	// ┴  └─┘┴  └─┘┴     ┴ ┴└─┴└─┘└─┘└─┘┴└─	

	// The little "..." next to file name

	createFilePopUpTrigger : function (parent, library) {


		// open file options button

		// Bind
		var popupTrigger = 
			parent
			.selectAll('.file-popup-trigger')
			.data(function(d) { return [d] })

		// Enter
		popupTrigger
			.enter()
			.append('div')
			.classed('file-popup-trigger', true)
			.html('<i class="fa fa-bars file-trigger"></i>Options')


		// Update
		popupTrigger
			.classed('active', function (d) {
				var uuid = d.getUuid()
				if ( uuid == this.showFileActionFor ) return true;
				return false;
			}.bind(this))
			.on('click', function (d) {
				var uuid = d.getUuid();
				this.enableFilePopUp(uuid)
			}.bind(this))	


		// Exit
		popupTrigger
			.exit()
			.remove();



		// add layer button

		// Bind
		var addTrigger = 
			parent
			.selectAll('.file-popup-trigger.add-layer')
			.data(function(d) { return [d] })

		// Enter
		addTrigger
			.enter()
			.append('div')	
			.classed('file-popup-trigger add-layer', true)
			.html('<i class="fa fa-plus-square add-trigger"></i>Add layer')


		// Update
		addTrigger
			.classed('active', function (d) {
				var uuid = d.getUuid()
				if ( uuid == this.showFileActionFor ) return true;
				return false;
			}.bind(this))
			.on('click', function (file) {
				file._createLayer(app.activeProject);
			}.bind(this))	


		// Exit
		addTrigger
			.exit()
			.remove();


	},


	// ┌─┐┬┬  ┌─┐  ┌─┐┌─┐┌┬┐┬┌─┐┌┐┌  ┌─┐┌─┐┌─┐┬ ┬┌─┐
	// ├┤ ││  ├┤   ├─┤│   │ ││ ││││  ├─┘│ │├─┘│ │├─┘
	// └  ┴┴─┘└─┘  ┴ ┴└─┘ ┴ ┴└─┘┘└┘  ┴  └─┘┴  └─┘┴  

	// The "download, delete, etc" pop-up

	createFileActionPopUp : function (parent, library) {

		// Bind
		var dataListLineAction = 
			parent
			.selectAll('.file-popup')
			.data(function(d) { return [d] })

		// Enter
		dataListLineAction
			.enter()
			.append('div')
			.classed('file-popup', true)


		// Update
		dataListLineAction
			.classed('displayNone', function (d) {
				var uuid = d.getUuid()
				if ( uuid == this.showFileActionFor ) return false;
				return true;
			}.bind(this))	

		// Exit
		dataListLineAction
			.exit()
			.remove();


		this.initFileActions(dataListLineAction, library);

	},


	// ┌─┐┬┬  ┌─┐  ┌─┐┌─┐┌┬┐┬┌─┐┌┐┌┌─┐
	// ├┤ ││  ├┤   ├─┤│   │ ││ ││││└─┐
	// └  ┴┴─┘└─┘  ┴ ┴└─┘ ┴ ┴└─┘┘└┘└─┘

	// AKA pop-up content

	initFileActions : function (parent, library) {

		// Disable actions for Layers
		var isDisabled = (library == 'layers'),
		    canEdit = this._project.isEditor(),
		    canDownload = this._project.isDownloadable(),
		    that = this;

		var action = {

			createLayer : {
				name : 'Add To Project',
				disabled : !canEdit,
			},
			share : {
				name : 'Share with...', 	// todo: implement sharing of data
				disabled : true,
			},			
			changeName : {
				name : 'Change Name',
				disabled : true
			},			
			download : {
				name : 'Download',
				disabled : false,
			},
			delete : {
				name : 'Delete',
				disabled : false
			},
		}


		for (var f in action) {

			var name = action[f].name;
			var className = 'file-action-' + f;

			// Bind
			var fileAction = 
				parent
				.selectAll('.' + className)
				.data(function(d) { return [d] })

			// Enter
			fileAction
				.enter()
				.append('div')
				.classed(className, true)
				.classed('file-action', true)
				.classed('displayNone', action[f].disabled)
				.attr('trigger', f)
				.html(name)
				.on('click', function (d) {
					var trigger = this.getAttribute('trigger')
					that.fileActionTriggered(trigger, d, that, library)
				});

			// Exit
			fileAction
				.exit()
				.remove();
		}
	},



	// ╔═╗╦╦  ╔═╗  ╔═╗╦  ╦╔═╗╦╔═  ╔═╗╦  ╦╔═╗╔╗╔╔╦╗╔═╗
	// ╠╣ ║║  ║╣   ║  ║  ║║  ╠╩╗  ║╣ ╚╗╔╝║╣ ║║║ ║ ╚═╗
	// ╚  ╩╩═╝╚═╝  ╚═╝╩═╝╩╚═╝╩ ╩  ╚═╝ ╚╝ ╚═╝╝╚╝ ╩ ╚═╝

	fileActionTriggered : function (trigger, file, context, library) {

		return this._fileActionTriggered(trigger, file, context, library);		
	},

	_fileActionTriggered : function (trigger, file, context, library) {

		var fileUuid = file.getUuid();
		var project = context._project;

		// set name
		if (trigger == 'changeName') context.editingFileName = fileUuid;			

		// create layer
		if (trigger == 'createLayer') file._createLayer(project);

		// share
		if (trigger == 'share') file._shareFile();	

		// download
		if (trigger == 'download') file._downloadFile();	

		// delete
		if (trigger == 'delete') file._deleteFile();
		
		// Reset
		this.showFileActionFor = false;
		this.selectedFiles = [];
		this._refreshFiles();
	},

	// Enable input field for changing file name
	activateFileInput : function (d, library) {
		this.editingFileName = d.getUuid();
		this.showFileActionFor = false;
		this.selectedFiles = [];
		this._refreshFiles();
	},

	// Enable popup on file (when clicking on "..." button)
	enableFilePopUp : function (uuid) {

		// open fullscreen file options
		this._openFileOptionsFullscreen(uuid);
	},

	_openFileOptionsFullscreen : function (uuid) {

		// get file
		var file = app.Account.getFile(uuid);

		// create fullscreen
		var fullscreen = this._fullscreen = new Wu.Fullscreen({
			title : '<i class="fa fa-bars file-option"></i>Options for ' + file.getName(),
			titleClassName : 'slim-font'
		});

		// shortcuts
		this._fullscreen._file = file;
		this._currentFile = file;
		var content = this._fullscreen._content;

		// name box
		var nameContainer = this._createNameBox({
			container : content,
			file : file
		});

		

		// if vector 
		if (file.isPostgis()) {

			// vector meta
			this._createVectorMetaBox({
				container : nameContainer,
				file : file
			});
		}
		

		// if raster
		if (file.isRaster()) {

			// raster meta
			this._createRasterMetaBox({
				container : nameContainer,
				file : file
			});

			// tileset box
			this._createTilesetBox({
				container : content,
				file : file
			});

			// transparency box
			this._createTransparencyBox({
				container : content,
				file : file
			});

		}		

		// share button
		this._createShareBox({
			container : content,
			file : file,
			fullscreen : fullscreen
		});


		// download button
		this._createDownloadBox({
			container : content,
			file : file,
			fullscreen : fullscreen
		});

		// delete button
		this._createDeleteBox({
			container : content,
			file : file,
			fullscreen : fullscreen
		});
		

	},

	_createNameBox : function (options) {
		var container = options.container;
		var file = options.file;
		
		// create divs
		var toggles_wrapper = Wu.DomUtil.create('div', 'toggles-wrapper file-options', container);
		var name = Wu.DomUtil.create('div', 'smooth-fullscreen-name-label clearboth', toggles_wrapper, 'Dataset name');
		var name_input = Wu.DomUtil.create('input', 'smooth-input smaller-input', toggles_wrapper);
		name_input.setAttribute('placeholder', 'Enter name here');
		name_input.value = file.getName();
		var name_error = Wu.DomUtil.create('div', 'smooth-fullscreen-error-label', toggles_wrapper);

		// return wrapper
		return toggles_wrapper;
	},

	_createVectorMetaBox : function (options) {
		var container = options.container;
		var file = options.file;
		var meta = file.getMeta();
		var toggles_wrapper = container;

		// meta info
		var meta_title = Wu.DomUtil.create('div', 'file-option title', toggles_wrapper, 'Dataset meta')
		var type_div = Wu.DomUtil.create('div', 'file-option sub', toggles_wrapper, '<span class="bold-font">Type:</span> Vector');
		var filesize_div = Wu.DomUtil.create('div', 'file-option sub', toggles_wrapper, '<span class="bold-font">Size:</span> ' + file.getDatasizePretty());
		var createdby_div = Wu.DomUtil.create('div', 'file-option sub', toggles_wrapper, '<span class="bold-font">Created by:</span> ' + file.getCreatedByName());
		var createdby_div = Wu.DomUtil.create('div', 'file-option sub', toggles_wrapper, '<span class="bold-font">Created on:</span> ' + moment(file.getCreated()).format('MMMM Do YYYY, h:mm:ss a'));
		
	},

	_createRasterMetaBox : function (options) {
		var container = options.container;
		var file = options.file;
		var meta = file.getMeta();
		var toggles_wrapper = container;

		// if no meta
		if (!meta) return;

		// meta info
		var meta_title = Wu.DomUtil.create('div', 'file-option title', toggles_wrapper, 'Dataset meta')
		var type_div = Wu.DomUtil.create('div', 'file-option sub', toggles_wrapper, '<span class="bold-font">Type:</span> Raster');
		var filesize_div = Wu.DomUtil.create('div', 'file-option sub', toggles_wrapper, '<span class="bold-font">Size:</span> ' + file.getDatasizePretty());
		var bands_div = Wu.DomUtil.create('div', 'file-option sub', toggles_wrapper, '<span class="bold-font">Bands:</span> ' + meta.bands);
		var size_div = Wu.DomUtil.create('div', 'file-option sub', toggles_wrapper, '<span class="bold-font">Raster size:</span> ' + meta.size.x + 'x' + meta.size.y);
		var projection_div = Wu.DomUtil.create('div', 'file-option sub', toggles_wrapper, '<span class="bold-font">Projection:</span> ' + meta.projection);
		var createdby_div = Wu.DomUtil.create('div', 'file-option sub', toggles_wrapper, '<span class="bold-font">Created by:</span> ' + file.getCreatedByName());
		var createdby_div = Wu.DomUtil.create('div', 'file-option sub', toggles_wrapper, '<span class="bold-font">Created on:</span> ' + moment(file.getCreated()).format('MMMM Do YYYY, h:mm:ss a'));
	},

	_createTilesetBox : function (options) {
		var container = options.container;
		var file = options.file;
		var meta = file.getMeta();

		// nice border box
		var toggles_wrapper = Wu.DomUtil.create('div', 'toggles-wrapper file-options', container);
		var tiles_title = Wu.DomUtil.create('div', 'file-option title', toggles_wrapper, 'Tileset')
		var generated_tiles_title = Wu.DomUtil.create('div', 'file-option title generated-tiles', toggles_wrapper, 'Generated tile-range')
		
		// zoom levels
		var zoomlevels_wrapper = Wu.DomUtil.create('div', 'zoomlevels-wrapper', toggles_wrapper);
		var zoom_levels = _.sortBy(meta.zoom_levels);
		var zoom_min = _.first(zoom_levels);
		var zoom_max = _.last(zoom_levels);
		var zoom_levels_text = zoom_min	 + ' to ' + zoom_max;
		var zoomlevels_div = Wu.DomUtil.create('div', 'file-option sub padding-top-10', zoomlevels_wrapper, '<span class="bold-font">Zoom-levels:</span> ' + zoom_levels_text);

		// create slider
		var stepSlider = Wu.DomUtil.create('div', 'tiles-slider', zoomlevels_wrapper);
		noUiSlider.create(stepSlider, {
			start: [zoom_min, zoom_max],
			step: 1,
			range: {
				'min': [2],
				'max': [19]
			},
			pips: {
				mode: 'count',
				values: [18],
				density : 18,
				stepped : true
			}
		});

		// total tiles div
		var totaltiles_div = Wu.DomUtil.create('div', 'file-option sub', toggles_wrapper, '<span class="bold-font">Total tiles:</span> ' + meta.total_tiles);
		var tilesize_div = Wu.DomUtil.create('div', 'file-option sub', toggles_wrapper, '<span class="bold-font">Tileset size:</span> ');

		// error feedback
		var generated_tiles_error = this._generated_tiles_error = Wu.DomUtil.create('div', 'smooth-fullscreen-error-label tiles-error', toggles_wrapper);

		// generate button
		var generateBtnWrap = Wu.DomUtil.create('div', 'pos-rel height-22', toggles_wrapper);
		var generateBtn = Wu.DomUtil.create('div', 'smooth-fullscreen-save generate-tiles', generateBtnWrap, 'Generate tiles');

		// slider events
		stepSlider.noUiSlider.on('update', function (values, handle) {

			// set zoom levels
			var z_min = parseInt(values[0]);
			var z_max = parseInt(values[1]);
			var zoom_levels_text = z_min + ' to ' + z_max;
			zoomlevels_div.innerHTML = '<span class="bold-font">Zoom-levels:</span> ' + zoom_levels_text;

			// check tile count (local)
			this.calculateTileCount({
				zoom_min : z_min,
				zoom_max : z_max,
				file_id : file.getUuid()				
			}, function (err, tile_count) {
				
				// check tiles
				if (tile_count > 11000) { // todo: make account dependent

					// mark too high tile-count
					totaltiles_div.innerHTML = '<span class="bold-font red-font">Total tiles: ' + tile_count + '</span>';

					// set error feedback
					generated_tiles_error.innerHTML = '<span class="bold-font">The tile count is too high. Please select a lower zoom-level.</span>';

					// disable button
					Wu.DomUtil.addClass(generateBtn, 'disabled-btn');

				} else {
					
					// set tile count
					totaltiles_div.innerHTML = '<span class="bold-font">Total tiles:</span> ' + tile_count;

					// set error feedback
					generated_tiles_error.innerHTML = '';
				
					// enable button
					Wu.DomUtil.removeClass(generateBtn, 'disabled-btn');
				}
			});

		}.bind(this));

		// generate button event
		Wu.DomEvent.on(generateBtn, 'click', function () {

			// set zoom levels
			var values = stepSlider.noUiSlider.get();
			var z_min = parseInt(values[0]);
			var z_max = parseInt(values[1]);

			// double check tile count (local)
			this.calculateTileCount({
				zoom_min : z_min,
				zoom_max : z_max,
				file_id : file.getUuid()				
			}, function (err, tile_count) {
				
				// check tile count
				if (tile_count > 11000) return; // todo: account dependent

				// generate tiles
				app.Socket.send('generate_tiles', {
					zoom_min : z_min,
					zoom_max : z_max,
					file_id : file.getUuid()				
				});

				// set feedback
				generated_tiles_error.innerHTML = '<span class="bold-font dark-font">Generating tiles. This will take a few minutes...</span>';
			});
		}, this);

	},

	_createShareBox : function (options) {
		var container = options.container;

		// wrapper-5: share box
		var toggles_wrapper5 = Wu.DomUtil.create('div', 'toggles-wrapper file-options', container);

		// create user list input
		this._createInviteUsersInput({
			type : 'read',
			label : 'Share Dataset',
			content : toggles_wrapper5,
			container : this._fullscreen._inner,
			sublabel : 'Users get their own copy of your dataset.'
		});

		// share button
		var shareBtnWrap = Wu.DomUtil.create('div', 'pos-rel height-42', toggles_wrapper5);
		var shareBtn = Wu.DomUtil.create('div', 'smooth-fullscreen-save red-btn', shareBtnWrap, 'Share dataset');

		// feedback
		var share_feedback = Wu.DomUtil.create('div', 'smooth-fullscreen-sub-label label-share_feedback', toggles_wrapper5, '');

		// remember
		this._divs.share_feedback = share_feedback;

		// download button
		Wu.DomEvent.on(shareBtn, 'click', this._shareDataset, this);
	},

	_createDownloadBox : function (options) {
		var container = options.container;
		var file = options.file;

		// wrapper-3: download box
		var toggles_wrapper3 = Wu.DomUtil.create('div', 'toggles-wrapper file-options', container);
		var download_title = Wu.DomUtil.create('div', 'file-option title', toggles_wrapper3, 'Download dataset');

		// download button
		var downloadBtnWrap = Wu.DomUtil.create('div', 'pos-rel height-42', toggles_wrapper3);
		var downloadBtn = Wu.DomUtil.create('div', 'smooth-fullscreen-save', downloadBtnWrap, 'Download');
		
		// download button
		Wu.DomEvent.on(downloadBtn, 'click', file._downloadFile, file);
	},

	_createDeleteBox : function (options) {

		var container = options.container;
		var file = options.file;
		var fullscreen = options.fullscreen;

		// wrapper-4: delete box
		var toggles_wrapper4 = Wu.DomUtil.create('div', 'toggles-wrapper file-options', container);
		var delete_title = Wu.DomUtil.create('div', 'file-option title red-font', toggles_wrapper4, 'Delete');

		// download button
		var deleteBtnWrap = Wu.DomUtil.create('div', 'pos-rel height-42', toggles_wrapper4);
		var deleteBtn = Wu.DomUtil.create('div', 'smooth-fullscreen-save red-btn', deleteBtnWrap, 'Delete');

		// deleete button event
		Wu.DomEvent.on(deleteBtn, 'click', function (e) {
			
			// confirm dialog
			Wu.confirm('Are you sure you want to delete this dataset? This cannot be undone!', function (confirmed) {
				if (!confirmed) return; 

				// delete file
				file._deleteFile(function (err, removedFile) {

					// close fullscreen
					fullscreen.close();

					// delete successful
					if (!err && removedFile && removedFile.success) {
						app.feedback.setMessage({
							title : 'Dataset deleted!', 
							description : file.getName() + ' was deleted.'
						});
					} else {
						app.feedback.setError({
							title : 'Something went wrong.', 
							description : 'Dataset not deleted.'
						});
					}
				});

			}.bind(this))

		}, this);
	},
	

	_createTransparencyBox : function (options) {
		var container = options.container;
		var file = options.file;

		// create divs
		var toggles_wrapper9 = Wu.DomUtil.create('div', 'toggles-wrapper file-options', container);
		var ralpha_title = Wu.DomUtil.create('div', 'file-option title', toggles_wrapper9, 'Transparency');
		// var alpha_input = Wu.DomUtil.create('input', 'invite-input-form alpha-input', toggles_wrapper9);
		// alpha_input.setAttribute('placeholder', 'Enter color or #hex value');
		var feedbackText = 'A new layer will be created with the cut color.'
		var transparency_feedback = Wu.DomUtil.create('div', 'smooth-fullscreen-error-label tiles-transparency', toggles_wrapper9, feedbackText);
		var alphaBtnWrap = Wu.DomUtil.create('div', 'pos-rel height-42', toggles_wrapper9);
		var whiteBtn = Wu.DomUtil.create('div', 'smooth-fullscreen-save', alphaBtnWrap, 'Cut white');
		// var blackBtn = Wu.DomUtil.create('div', 'smooth-fullscreen-save left140', alphaBtnWrap, 'Cut black');
	
		// on click
		Wu.DomEvent.on(whiteBtn, 'click', function (e) {
			// var color = alpha_input.value;

			// cut raster
			this._cutRaster({
				file : file,
				color : 'white'
			}, function (err, layer) {

				// set feedback text
				transparency_feedback.innerHTML = 'New layer created and added to project!';
			});

		}, this);

		// // on click
		// Wu.DomEvent.on(blackBtn, 'click', function (e) {
		// 	// var color = alpha_input.value;

		// 	// cut raster
		// 	this._cutRaster({
		// 		file : file,
		// 		color : 'black'
		// 	});

		// }, this);

	},

	_cutRaster : function (options, done) {
		var file = options.file;
		var color = options.color;

		// cut raster
		file.cutRasterColor({
			color : color,
			project : this._project
		}, function (err, layer) {
			if (err) return console.error(err);

			// rename layer
			var layerName = layer.getTitle();
			layerName += ' (white areas cut)';
			layer.setTitle(layerName);

			// automatically add layer to layermenu
			this._addOnImport(layer);

			// done
			done && done(err, layer);

		}.bind(this));
	},

	_highlightFullscreenElement : function (elem) {

		// hide fullscreen
		jss.set('.smooth-fullscreen', {
			'visibility' : 'hidden',
			'overflow' : 'hidden',
		});

		// hide chrome
		jss.set('.chrome-right', {
			'visibility' : 'hidden',
		});

		// hide controls
		jss.set('.leaflet-control-container', {
			'visibility' : 'hidden',
		});

		// show only one element
		elem.style.visibility = 'visible';
		elem.style.background = '#FCFCFC';

		// disable map zoom
		app._map.scrollWheelZoom.disable()

	},

	_unhighlightFullscreenElement : function () {
		jss.remove('.smooth-fullscreen');
		jss.remove('.chrome-right');
		jss.remove('.leaflet-control-container');

		// enable map zoom
		app._map.scrollWheelZoom.enable()
	},

	_divs : {
		users : [],
	},

	_createInviteUsersInput : function (options) {

		// invite users
		var content = options.content || this._fullscreen._content;
		var container = this._fullscreen._container;
		var project = options.project;

		// label
		var invite_label = options.label;
		var name = Wu.DomUtil.create('div', 'smooth-fullscreen-name-label', content, invite_label);

		// container
		var invite_container = Wu.DomUtil.create('div', 'invite-container', content);
		
		// sub-label
		var sublabel = Wu.DomUtil.create('div', 'smooth-fullscreen-sub-label', content, options.sublabel);

		var invite_inner = Wu.DomUtil.create('div', 'invite-inner', invite_container);
		var invite_input_container = Wu.DomUtil.create('div', 'invite-input-container', invite_inner);

		// input box
		var invite_input = Wu.DomUtil.create('input', 'invite-input-form', invite_input_container);

		// invite list
		var invite_list_container = Wu.DomUtil.create('div', 'invite-list-container', invite_container);
		var invite_list_inner = Wu.DomUtil.create('div', 'invite-list-inner', invite_list_container);

		// remember div
		this._divs.invite_list_container = invite_list_container;

		// for manual scrollbar (js)
		var monkey_scroll_bar = Wu.DomUtil.create('div', 'monkey-scroll-bar', invite_list_inner);
		
		// for holding list
		var monkey_scroll_hider = Wu.DomUtil.create('div', 'monkey-scroll-hider', invite_list_inner);
		var monkey_scroll_inner = Wu.DomUtil.create('div', 'monkey-scroll-inner', monkey_scroll_hider);
		var monkey_scroll_list = Wu.DomUtil.create('div', 'monkey-scroll-list', monkey_scroll_inner);

		// list of all users
		var allUsers = _.sortBy(_.toArray(app.Users), function (u) {
			return u.store.firstName;
		});

		_.each(allUsers, function (user) {

			if (user.getUuid() == app.Account.getUuid()) return;

			// divs
			var list_item_container = Wu.DomUtil.create('div', 'monkey-scroll-list-item-container', monkey_scroll_list);
			var avatar_container = Wu.DomUtil.create('div', 'monkey-scroll-list-item-avatar-container', list_item_container);
			var avatar = Wu.DomUtil.create('div', 'monkey-scroll-list-item-avatar default-avatar', avatar_container);
			var name_container = Wu.DomUtil.create('div', 'monkey-scroll-list-item-name-container', list_item_container);
			var name_bold = Wu.DomUtil.create('div', 'monkey-scroll-list-item-name-bold', name_container);
			var name_subtle = Wu.DomUtil.create('div', 'monkey-scroll-list-item-name-subtle', name_container);

			// set name
			name_bold.innerHTML = user.getFullName();
			name_subtle.innerHTML = user.getEmail();

			// click event
			Wu.DomEvent.on(list_item_container, 'click', function () {

				// dont allow adding self 
				if (user.getUuid() == app.Account.getUuid()) return;

				// add selected user item to input box
				this._addUserAccessItem({
					input : invite_input,
					user : user,
					type : options.type
				});
					
			}, this);
		}, this);


		// events

		// input focus, show dropdown
		Wu.DomEvent.on(invite_input, 'focus', function () {
			this._closeInviteInputs();
			invite_list_container.style.display = 'block';
		}, this);

		// focus input on any click
		Wu.DomEvent.on(invite_input_container, 'click', function () {
			invite_input.focus();
		}, this);

		// input keyup
		Wu.DomEvent.on(invite_input, 'keydown', function (e) {

			// get which key
			var key = event.which ? event.which : event.keyCode;

			// get string length
			var value = invite_input.value;
			var text_length = value.length;
			if (text_length <= 0) text_length = 1;

			// set width of input dynamically
			invite_input.style.width = 30 + (text_length * 20) + 'px';

			// backspace on empty field: delete added user
			if (key == 8 && value.length == 0 && this._access[options.type].length) {

				// get last user_uuid item 
				var last = _.last(this._access[options.type]);

				// dont allow adding self (as editor) to read
				if (options.type == 'edit' && last && last.user && last.user.getUuid() == app.Account.getUuid()) return;

				// remove last item
				var popped = this._access[options.type].pop();
				Wu.DomUtil.remove(popped.user_container);
			}

			// enter: blur input
			if (key == 13 || key == 27) {
				invite_input.blur();
				invite_input.value = '';
				this._closeInviteInputs();
			}

		}, this);


		// close dropdown on any click
		Wu.DomEvent.on(container, 'click', function (e) {

			// only if target == self
			var relevantTarget = 	e.target == container || 
						e.target == this._fullscreen._inner || 
						e.target == name || 
						e.target == this._fullscreen._content;

			if (relevantTarget) this._closeInviteInputs();

		},this);

		
	},
	_closeInviteInputs : function () {
		console.log('closee');
	},

	_closeInviteInputs : function () {

		var container = this._divs.invite_list_container;
		if (container) container.style.display = 'none';

	},

	_currentFile : {},

	_shareDataset : function () {
		
		var users = this._divs.users;
		var dataset = this._fullscreen._file;


		if (!users.length) return;

		var userNames = [];
		users.forEach(function (user) {
			userNames.push(user.user.getFullName());
		})

		var names = userNames.join(', ');

		if (Wu.confirm('Are you sure you want to share the dataset with ' + names + '?')) {

			var userUuids = [];
			users.forEach(function (u) {
				userUuids.push(u.user.getUuid());
			});
			
			app.api.shareDataset({
				dataset : dataset.getUuid(),
				users : userUuids,
			}, function (err, result) {


				if (err) console.error('err', err);

				var result = Wu.parse(result);

				if (result.err || !result.success) {
					console.error('something went worng', result);
					
					// set feedback
					this._divs.share_feedback.innerHTML = 'Something went wrong.';
				} else {
					
					// set feedback
					this._divs.share_feedback.innerHTML = 'Dataset shared with ' + names + '!';
				}
				

			}.bind(this));
		}

	},
	_addUserAccessItem : function (options) {

		var invite_input = options.input;
		var user = options.user;

		// if user deleted. todo: clean up deleting
		if (!user) return;

		// focus input
		invite_input.focus();

		// don't add twice
		var existing = _.find(this._divs.users, function (i) {
			return i.user == user;
		});
		if (existing) return;

		// insert user box in input area
		var user_container = Wu.DomUtil.create('div', 'mini-user-container');
		var user_inner = Wu.DomUtil.create('div', 'mini-user-inner', user_container);
		var user_avatar = Wu.DomUtil.create('div', 'mini-user-avatar default-avatar', user_inner);
		var user_name = Wu.DomUtil.create('div', 'mini-user-name', user_inner, user.getFullName());
		var user_kill = Wu.DomUtil.create('div', 'mini-user-kill', user_inner, 'x');

		// insert before input
		var invite_input_container = invite_input.parentNode;
		invite_input_container.insertBefore(user_container, invite_input);


		// click event (kill)
		Wu.DomEvent.on(user_container, 'click', function () {
			
			// remove div
			Wu.DomUtil.remove(user_container);
			
			// remove from array
			_.remove(this._divs.users, function (i) {
				return i.user == user;
			});

		}, this);

		// add to array
		this._divs.users.push({
			user : user,
			user_container : user_container
		});


	},

	calculateTileCount : function (options, done) {

		var file_id = options.file_id;
		var zoom_min = options.zoom_min;
		var zoom_max = options.zoom_max;
		var all_levels_count = this._calcTileCount(file_id);
		var zoom_range = _.range(zoom_min, zoom_max + 1);

		// add zoom levels 
		var tile_count = 0;
		zoom_range.forEach(function (zr) {
			tile_count += all_levels_count[zr];
		});

		// done
		done(null, tile_count);


		app.Socket.send('tileset_meta', {
			file_id : file_id				
		});
		
	},

	_onTilesetMeta : function (e) {


		return;

		var tile_set = e.detail.data;

		var data = e.detail.data;
		var tile_count = parseInt(data.tiles) * (-1);

		
		// check tiles
		if (tile_count > 11000) {

			// mark too high tile-count
			this._totaltiles_div.innerHTML = '<span class="bold-font red-font">Total tiles: ' + tile_count + '</span>';

			// set error feedback
			this._generated_tiles_error.innerHTML = '<span class="bold-font">The tile count is too high. Please select a lower zoom-level.</span>';

		} else {
			
			// set tile count
			this._totaltiles_div.innerHTML = '<span class="bold-font">Total tiles:</span> ' + tile_count;

			// set error feedback
			this._generated_tiles_error.innerHTML = ''

		}

	},

	_calcTileCount : function (file_id) {

		// set options
		var zoom_min = 0;
		var zoom_max = 20;
		var zoom_levels = _.range(0, zoom_max + 1);
		var total_tiles = [];

		// get file extent
		var file = app.Account.getFile(file_id);
		var meta = file.getMeta();
		var extent = meta.extent;

		// return if no meta
		if (!meta) return;

		// get edges
		var north_edge = extent[3];
		var south_edge = extent[1];
		var west_edge = extent[0];
		var east_edge = extent[2];

		// calculate tiles per zoom-level
		zoom_levels.forEach(function (z) {
			var zoom = z;
			var top_tile = this._lat2tile(north_edge, zoom);
			var left_tile = this._lon2tile(west_edge, zoom);
			var bottom_tile = this._lat2tile(south_edge, zoom);
			var right_tile = this._lon2tile(east_edge, zoom);
			var width = Math.abs(left_tile - right_tile) + 1;
			var height = Math.abs(top_tile - bottom_tile) + 1;
			var total_tiles_at_zoom = width * height;

			total_tiles.push(total_tiles_at_zoom);

		}, this);

		return total_tiles;

	},

	_lon2tile : function (lon,zoom) { return (Math.floor((lon+180)/360*Math.pow(2,zoom))); },
 	_lat2tile : function (lat,zoom)  { return (Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom))); },

	_onGeneratedTiles : function (e) {

		var data = e.detail.data;
		var meta = data.metadata;
		var file_id = data.file_id;
		var file = app.Account.getFile(file_id);

		// set meta
		file.setMetadata(meta);

		// feedback
		this._generated_tiles_error.innerHTML = '<span class="bold-font dark-font">Done!</span>';

	},


	


	// Save file name
	saveFileName : function (newName, d, library) {

		if ( !newName || newName == '' ) newName = d.getName();
		d.setName(newName);	
		
		this.editingFileName = false;
		this._refreshFiles();
	},


	// ┬┌┐┌┬┌┬┐  ┬  ┌─┐┬ ┬┌─┐┬─┐┌─┐
	// │││││ │   │  ├─┤└┬┘├┤ ├┬┘└─┐
	// ┴┘└┘┴ ┴   ┴─┘┴ ┴ ┴ └─┘┴└─└─┘

	_initLayerList : function () {
	
		// Holds each section (mapbox, cartoDB, etc);
		this.layerListContainers = {};

		// Holds layers that we've selected
		this.selectedLayers = [];

		// Show layer actions for this specific layer
		this.showLayerActionFor = false;

		// Edit layer name
		this.editingLayerName = false;

		// Layer providers
		this.layerProviders = {};

		// Create PROJECT LAYERS section, with D3 container
	       	var sortedLayers = this.sortedLayers = this.sortLayers(this._project.layers);

	       	sortedLayers.forEach(function (layerBundle) {

	       		var provider = layerBundle.key;

	       		// only do our layers
	       		if (provider != 'postgis' && provider != 'raster') return;

	       		var layers = layerBundle.layers;

	       		if ( layers.length <= 0 ) return this.createNoLayers();

			this.layerProviders[provider] = {
				name : provider,
				layers : layers
			}			
	       			       		
			this.layerListContainers[provider] = {};

			// Create wrapper
			this.layerListContainers[provider].wrapper = Wu.DomUtil.create('div', 'layer-list-container', this._layersContainer);

			// D3 Container
			this.layerListContainers[provider].layerList = Wu.DomUtil.create('div', 'layer-list-container-layer-list', this.layerListContainers[provider].wrapper);
			this.layerListContainers[provider].D3container = d3.select(this.layerListContainers[provider].layerList);

	       	}.bind(this));

	},

	createNoLayers : function () {
		// var noLayersText = 'This project has no layers.<br>Upload files, and add them to project.';
		// var noLayers = Wu.DomUtil.create('div', 'no-layers', this._layersContainer, noLayersText);
	},

	
	// ┬─┐┌─┐┌─┐┬─┐┌─┐┌─┐┬ ┬  ┬  ┌─┐┬ ┬┌─┐┬─┐┌─┐
	// ├┬┘├┤ ├┤ ├┬┘├┤ └─┐├─┤  │  ├─┤└┬┘├┤ ├┬┘└─┐
	// ┴└─└─┘└  ┴└─└─┘└─┘┴ ┴  ┴─┘┴ ┴ ┴ └─┘┴└─└─┘

	_refreshLayers : function () {

		// FILES
		for (var p in this.layerProviders) {
			var provider = this.layerProviders[p];
			var layers = provider.layers;
			provider.data = _.toArray(layers);
			var D3container = this.layerListContainers[p].D3container;
			var data = this.layerProviders[p].data;
			this.initLayerList(D3container, data, p);
		}

	},


	// ┌─┐┌─┐┬─┐┌┬┐  ┬  ┌─┐┬ ┬┌─┐┬─┐┌─┐  ┌┐ ┬ ┬  ┌─┐┬─┐┌─┐┬  ┬┬┌┬┐┌─┐┬─┐
	// └─┐│ │├┬┘ │   │  ├─┤└┬┘├┤ ├┬┘└─┐  ├┴┐└┬┘  ├─┘├┬┘│ │└┐┌┘│ ││├┤ ├┬┘
	// └─┘└─┘┴└─ ┴   ┴─┘┴ ┴ ┴ └─┘┴└─└─┘  └─┘ ┴   ┴  ┴└─└─┘ └┘ ┴─┴┘└─┘┴└─

	sortLayers : function (layers) {

		var keys = ['postgis', 'raster', 'google', 'norkart', 'geojson', 'mapbox'];
		var results = [];
	
		keys.forEach(function (key) {
			var sort = {
				key : key,
				layers : []
			}
			for (var l in layers) {
				var layer = layers[l];
				if (layer) {
					if (layer.store && layer.store.data.hasOwnProperty(key)) {
						sort.layers.push(layer)
					}
				}
			}
			results.push(sort);
		}, this);

		this.numberOfProviders = results.length;
		return results;
	},	


	// ██████╗  █████╗ ███████╗███████╗    ██╗      █████╗ ██╗   ██╗███████╗██████╗ ███████╗
	// ██╔══██╗██╔══██╗██╔════╝██╔════╝    ██║     ██╔══██╗╚██╗ ██╔╝██╔════╝██╔══██╗██╔════╝
	// ██████╔╝███████║███████╗█████╗      ██║     ███████║ ╚████╔╝ █████╗  ██████╔╝███████╗
	// ██╔══██╗██╔══██║╚════██║██╔══╝      ██║     ██╔══██║  ╚██╔╝  ██╔══╝  ██╔══██╗╚════██║
	// ██████╔╝██║  ██║███████║███████╗    ███████╗██║  ██║   ██║   ███████╗██║  ██║███████║
	// ╚═════╝ ╚═╝  ╚═╝╚══════╝╚══════╝    ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚══════╝


	_initBaseLayerList : function () {
		this._initLayout_activeLayers(false, false, this._baseLayerDropdownContainer, false)
	},

	_refreshBaseLayerList : function () {

		// clear
		this._baseLayerDropdownContainer.innerHTML = '';

		// only create if editable
		if (this._project.isEditable()) {
			this._initLayout_activeLayers(false, false, this._baseLayerDropdownContainer, false)
		}
	},

	_initLayout_activeLayers : function (title, subtitle, container, layers) {

		// active layer wrapper
		var wrap = this._activeLayersWrap = Wu.DomUtil.create('div', 'baselayer-dropdown-wrapper', container);
		
		// create dropdown
		var selectWrap = Wu.DomUtil.create('div', 'chrome chrome-content active-layer select-wrap', wrap);
		var select = this._select = Wu.DomUtil.create('select', 'active-layer-select', selectWrap);

		// Create select options
		this.sortedLayers.forEach(function(provider) {

			// Do not allow postgis layers to be in the baselayer dropdown
			if ( provider.key == "postgis" ) return;
			if ( provider.key == "raster" ) return; // temporary disable rasters. todo: create nice dropdown with mulitple choice

			// Get each provider (mapbox, google, etc)
			provider.layers.forEach(function(layer) {
				
				// Create selct option
				var option = Wu.DomUtil.create('option', 'active-layer-option', select);
				
				// Get layer uuid
				var layerUuid = layer.getUuid();
				
				// Set option value
				option.value = layerUuid;

				// Set selected state
				var isSelected = this.isBaseLayerOn(layerUuid);
				if ( isSelected ) option.selected = true;

				// Print option text
				option.innerHTML = layer.getTitle() + ' (' + provider.key + ')';


			}.bind(this))
		}.bind(this));

		// select event
		Wu.DomEvent.on(select, 'change', this._selectedActiveLayer, this); // todo: mem leak?

		return select;

	},

	_selectedActiveLayer : function (e) {

		// Remove active baselayers
		var baselayers = this._project.getBaselayers();

		// Force array
		// Todo: this is always array anyways...
		var _baselayers = _.isArray(baselayers) ? baselayers : [baselayers];

		_baselayers.forEach(function (baselayer) {
			var uuid = baselayer.uuid;
			var layer = this._project.getLayer(uuid);
			layer.disable();
		}.bind(this))


		// Add to map
		var uuid = e.target.value;
		var layer = this._project.getLayer(uuid);
		layer._addTo('baselayer');
		


		// Save to server
		this._project.setBaseLayer([{
			uuid : uuid,
			zIndex : 1,
			opacity : 1
		}]);
	},


	// ┌─┐┌─┐┌─┐┬ ┬  ┬  ┌─┐┬ ┬┌─┐┬─┐  ┬ ┬┬─┐┌─┐┌─┐┌─┐┌─┐┬─┐
	// ├┤ ├─┤│  ├─┤  │  ├─┤└┬┘├┤ ├┬┘  │││├┬┘├─┤├─┘├─┘├┤ ├┬┘
	// └─┘┴ ┴└─┘┴ ┴  ┴─┘┴ ┴ ┴ └─┘┴└─  └┴┘┴└─┴ ┴┴  ┴  └─┘┴└─	

	initLayerList : function (D3container, data, library) {

		// BIND
		var dataListLine = 
			D3container
			.selectAll('.data-list-line')
			.data(data);

		// ENTER
		dataListLine
			.enter()
			.append('div')
			.classed('data-list-line', true);

		// UPDATE
		dataListLine
			.classed('file-selected', function(d) {
				
				var uuid = d.getUuid();

				// If selected with CMD or SHIFT
				var index = this.selectedLayers.indexOf(uuid);
				if (index > -1) return true;

				// If selected by single click
				if ( uuid == this.showLayerActionFor ) return true;

				// Else no selection
				return false;

			}.bind(this))

			// Add flash to new layer
			.classed('new-layer-list-item', function (d) {
				var uuid = d.getUuid();
				if ( this.newLayer == uuid ) {					
					return true;
					this.newLayer = false;
				}
				return false;
			}.bind(this))

			.classed('editingName', function (d) {
				var uuid = d.getUuid();
				if ( this.editingLayerName == uuid ) return true;
				return false;
			}.bind(this))


		// EXIT
		dataListLine
			.exit()
			.remove();

		// Create Toggle Button (layer/baselayer)
		// this.createLayerToggleButton(dataListLine, library);

		this.createLayerToggleSwitch(dataListLine, library);

		// Create Radio Button
		this.createRadioButton(dataListLine, library);						

		// Create Name content
		this.createLayerNameContent(dataListLine, library);	

		// CREATE POP-UP TRIGGER
		this.createLayerPopUpTrigger(dataListLine, library);

		// CREATE FILE ACTION POP-UP
		this.createLayerActionPopUp(dataListLine, library)


	},


	// ┬─┐┌─┐┌┬┐┬┌─┐  ┌┐ ┬ ┬┌┬┐┌┬┐┌─┐┌┐┌
	// ├┬┘├─┤ ││││ │  ├┴┐│ │ │  │ │ ││││
	// ┴└─┴ ┴─┴┘┴└─┘  └─┘└─┘ ┴  ┴ └─┘┘└┘

	// Sets layers to be on by default

	createRadioButton : function(parent, library) {

		// Bind
		var radioButton = 
			parent
			.selectAll('.layer-on-radio-button-container')
			.data(function(d) { return [d] });

		// Enter
		radioButton
			.enter()
			.append('div')
			.classed('layer-on-radio-button-container layer-radio', true)
			.on('click', function(d) {
				this._toggleRadio(d);
			}.bind(this))


		// Update
		radioButton
			// Display radio button
			.classed('displayNone', function(d) {
				var uuid = d.getUuid();
				var on = this.isLayerOn(uuid);
				return !on;
			}.bind(this))

			// Enabled by default
			.classed('radio-on', function(d) {
				var uuid = d.getUuid();
				// Check if layer is on by default				
				var layermenuItem = _.find(this._project.store.layermenu, function (l) {
					return l.layer == uuid;
				});
				var enabledByDefault = layermenuItem && layermenuItem.enabled;
				return enabledByDefault;
			}.bind(this))

		// Exit
		radioButton
			.exit()
			.remove();

	},

	// TOGGLE RADIO BUTTON
	_toggleRadio : function (layer) {
		var uuid = layer.getUuid();
		var item = _.find(this._project.store.layermenu, function (l) {
			return l.layer == uuid;
		});
		var on = item && item.enabled;
		on ? this.radioOff(uuid) : this.radioOn(uuid);
	},

	// RADIO ON
	radioOn : function (uuid) {
		var layerMenu = app.MapPane.getControls().layermenu;
		layerMenu._setEnabledOnInit(uuid, true);
	},

	// RADIO OFF
	radioOff : function (uuid) {
		var layerMenu = app.MapPane.getControls().layermenu;
		layerMenu._setEnabledOnInit(uuid, false);
	},


	
	// ┌┬┐┌─┐┌─┐┌─┐┬  ┌─┐  ┬  ┌─┐┬ ┬┌─┐┬─┐
	//  │ │ ││ ┬│ ┬│  ├┤   │  ├─┤└┬┘├┤ ├┬┘
	//  ┴ └─┘└─┘└─┘┴─┘└─┘  ┴─┘┴ ┴ ┴ └─┘┴└─

	createLayerToggleSwitch : function (parent, library) {

		// Bind container
		var toggleButton = 
			parent
			.selectAll('.chrome-switch-container')
			.data(function(d) { return [d] });

		// Enter container
		toggleButton
			.enter()
			.append('div')
			.classed('chrome-switch-container', true);

		toggleButton
			.classed('switch-on', function (d) {
				var uuid = d.getUuid();
				var on = this.isLayerOn(uuid);
				return on;
			}.bind(this))

		toggleButton
			.on('click', function(d) {
				this.toggleLayer(d);
			}.bind(this));		

		// Exit
		toggleButton
			.exit()
			.remove();

	},


	// TOGGLE LAYER BUTTONS

	// createLayerToggleButton : function (parent, library) {

	// 	// Bind container
	// 	var toggleButton = 
	// 		parent
	// 		.selectAll('.chrome-toggle-button-container')
	// 		.data(function(d) { return [d] });

	// 	// Enter container
	// 	toggleButton
	// 		.enter()
	// 		.append('div')
	// 		.classed('chrome-toggle-button-container', true);

	// 	// Exit
	// 	toggleButton
	// 		.exit()
	// 		.remove();


	// 	// LAYER BUTTON
	// 	// LAYER BUTTON
	// 	// LAYER BUTTON

	// 	// Bind layer button
	// 	var option1 = 
	// 		toggleButton
	// 		.selectAll('.toggle-button-option-one')
	// 		.data(function(d) { return [d] });

	// 	// Enter layer button
	// 	option1
	// 		.enter()
	// 		.append('div')
	// 		.classed('toggle-button', true)
	// 		.classed('toggle-button-option-one', true)
	// 		.html('layer')
	// 		.on('click', function(d) {
	// 			this.toggleLayer(d);
	// 		}.bind(this));


	// 	// Update layer button
	// 	option1
	// 		.classed('toggle-button-active', function (d) {
	// 			var uuid = d.getUuid();
	// 			var on = this.isLayerOn(uuid);
	// 			return on;
	// 		}.bind(this))


	// 	// Exit layer button
	// 	option1
	// 		.exit()
	// 		.remove()



	// 	// BASE LAYER BUTTON
	// 	// BASE LAYER BUTTON
	// 	// BASE LAYER BUTTON

	// 	// Bind base layer button
	// 	var option2 = 
	// 		toggleButton
	// 		.selectAll('.toggle-button-option-two')
	// 		.data(function(d) { return [d] });

	// 	// Enter base layer button
	// 	option2
	// 		.enter()
	// 		.append('div')
	// 		.classed('toggle-button', true)
	// 		.classed('toggle-button-option-two', true)
	// 		.html('base')	
	// 		.on('click', function(d) {
	// 			this.toggleBaseLayer(d);
	// 		}.bind(this));				

	// 	// Update base layer button
	// 	option2
	// 		.classed('toggle-button-active', function (d) {
	// 			var uuid = d.getUuid();
	// 			var on = this.isBaseLayerOn(uuid);
	// 			return on;
	// 		}.bind(this))

	// 	// Exit base layer button
	// 	option2
	// 		.exit()
	// 		.remove()
	// },


	// TOGGLE LAYERS
	// TOGGLE LAYERS
	// TOGGLE LAYERS
	
	toggleLayer : function (layer) {
		var uuid = layer.getUuid();
		var on = this.isLayerOn(uuid);
		on ? this.removeLayer(layer) : this.addLayer(layer);

		// Toggle base layer off
		// var baseOn = this.isBaseLayerOn(uuid);
		// if ( baseOn ) this.removeBaseLayer(layer);

		this._refreshLayers();		
	},	

	addAfterImport : function (layer) {

		// in layermenu
		var layerMenu = app.MapPane.getControls().layermenu;
		layerMenu._enableLayerByUuid(layer.getUuid());

		// in data meny


	},

	enableLayer : function (layer) {

		// 

		// in layermenu
		var layerMenu = app.MapPane.getControls().layermenu;
		layerMenu._enableLayerByUuid(layer.getUuid());
	},

	// Add layer
	addLayer : function (layer) {
		var layerMenu = app.MapPane.getControls().layermenu;
		return layerMenu.add(layer);
	},

	// Remove layer
	removeLayer : function (layer) {
		var uuid = layer.getUuid();
		var layerMenu = app.MapPane.getControls().layermenu;
		layerMenu._remove(uuid);
	},

	// Check if layer is on
	isLayerOn : function (uuid) {
		var on = false
		this._project.store.layermenu.forEach(function (b) {
			if ( uuid == b.layer ) { on = true; }
		}, this);
		return on;
	},


	// Check if base layer is on
	isBaseLayerOn : function (uuid) {
		var on = false
		this._project.store.baseLayers.forEach(function (b) {
			if ( uuid == b.uuid ) { on = true; } 
		}.bind(this));
		return on;
	},




	// ┬  ┌─┐┬ ┬┌─┐┬─┐  ┌┐┌┌─┐┌┬┐┌─┐
	// │  ├─┤└┬┘├┤ ├┬┘  │││├─┤│││├┤ 
	// ┴─┘┴ ┴ ┴ └─┘┴└─  ┘└┘┴ ┴┴ ┴└─┘

	createLayerNameContent : function (parent, library) {

		// Bind
		var nameContent = 
			parent
			.selectAll('.layer-name-content')
			.data(function(d) { return [d] })

		// Enter
		nameContent
			.enter()
			.append('div')
			.classed('layer-name-content', true)


		// Update
		nameContent
			.html(function (d) { 
				return d.getTitle();
			}.bind(this))
			.on('dblclick', function (d) {
				var editable = (library == 'postgis' || library == 'raster');
				editable && this.activateLayerInput(d, library);
			}.bind(this));			


		// Exit
		nameContent
			.exit()
			.remove();


		// Create input field
		this.createLayerInputField(nameContent, library);


	},

	
	// ┬  ┌─┐┬ ┬┌─┐┬─┐  ┬┌┐┌┌─┐┬ ┬┌┬┐
	// │  ├─┤└┬┘├┤ ├┬┘  ││││├─┘│ │ │ 
	// ┴─┘┴ ┴ ┴ └─┘┴└─  ┴┘└┘┴  └─┘ ┴ 	

	createLayerInputField : function (parent, library) {

		var that = this;

		// Bind
		var nameInput = 
			parent
			.selectAll('.layer-name-input')
			.data(function (d) {
				var uuid = d.getUuid();
				if ( this.editingLayerName == uuid ) return [d];
				return false;
			}.bind(this))

		// Enter
		nameInput
			.enter()
			// .append('textarea')
			.append('input')
			.attr('type', 'text')
			.classed('layer-name-input', true)


		// Update
		nameInput
			.attr('placeholder', function (d) {
				return d.getTitle();				
			})
			.attr('name', function (d) {
				return d.getUuid()
			})
			.html(function (d) {
				return d.getTitle();				
			})
			.classed('displayNone', function (d) {
				var uuid = d.getUuid();				
				if ( that.editingLayerName == uuid ) return false;	
				return true;
			})
			.on('blur', function (d) {
				var newName = this.value;
				that.saveLayerName(newName, d, library);
			})
			.on('keydown', function (d) {
				var keyPressed = window.event.keyCode;
				var newName = this.value;
				if ( keyPressed == 13 ) this.blur(); // Save on enter
			});


		nameInput
			.exit()
			.remove();


		// Hacky, but works...
		// Select text in input field...
		if ( nameInput ) {
			nameInput.forEach(function(ni) {
				if ( ni[0] ) {
					ni[0].select();
					return;
				}
			})
		}

	},


	// ┌─┐┌─┐┌─┐┬ ┬┌─┐  ┌┬┐┬─┐┬┌─┐┌─┐┌─┐┬─┐
	// ├─┘│ │├─┘│ │├─┘   │ ├┬┘││ ┬│ ┬├┤ ├┬┘
	// ┴  └─┘┴  └─┘┴     ┴ ┴└─┴└─┘└─┘└─┘┴└─	

	// Little "..." button next to layer name

	createLayerPopUpTrigger : function (parent, library) {

		if ( library != 'postgis' ) return;

		// Bind
		var popupTrigger = 
			parent
			.selectAll('.file-popup-trigger')
			.data(function(d) { return [d] })

		// Enter
		popupTrigger
			.enter()
			.append('div')
			.classed('file-popup-trigger', true)

		// Update
		popupTrigger
			.classed('active', function (d) {
				var uuid = d.getUuid()
				if ( uuid == this.showLayerActionFor ) return true;
				return false;
			}.bind(this))
			.on('click', function (d) {
				var uuid = d.getUuid();
				this.enableLayerPopup(uuid)
			}.bind(this))	


		// Exit
		popupTrigger
			.exit()
			.remove();


	},


	// ┬  ┌─┐┬ ┬┌─┐┬─┐  ┌─┐┌─┐┌┬┐┬┌─┐┌┐┌  ┌─┐┌─┐┌─┐┬ ┬┌─┐
	// │  ├─┤└┬┘├┤ ├┬┘  ├─┤│   │ ││ ││││  ├─┘│ │├─┘│ │├─┘
	// ┴─┘┴ ┴ ┴ └─┘┴└─  ┴ ┴└─┘ ┴ ┴└─┘┘└┘  ┴  └─┘┴  └─┘┴  

	// download, delete, etc

	createLayerActionPopUp : function (parent, library) {

		// Bind
		var dataListLineAction = 
			parent
			.selectAll('.file-popup')
			.data(function(d) { return [d] })

		// Enter
		dataListLineAction
			.enter()
			.append('div')
			.classed('file-popup', true)


		// Update
		dataListLineAction
			.classed('displayNone', function (d) {
				var uuid = d.getUuid();
				if ( uuid == this.showLayerActionFor ) return false;
				return true;
			}.bind(this))	

		// Exit
		dataListLineAction
			.exit()
			.remove();


		this.initLayerActions(dataListLineAction, library);

	},


	// ┬  ┌─┐┬ ┬┌─┐┬─┐  ┌─┐┌─┐┌┬┐┬┌─┐┌┐┌┌─┐
	// │  ├─┤└┬┘├┤ ├┬┘  ├─┤│   │ ││ ││││└─┐
	// ┴─┘┴ ┴ ┴ └─┘┴└─  ┴ ┴└─┘ ┴ ┴└─┘┘└┘└─┘

	// AKA pop-up content

	initLayerActions : function (parent, library) {

		// Disable actions for Layers
		var canEdit = this._project.isEditable(),
		    canDownload = this._project.isDownloadable(),
		    that = this;
	
		var action = {

			share : {
				name : 'Share with...',
				disabled : false,
			},
			style : {
				name : 'Style Layer',
				disabled : !canEdit
			},
			changeName : {
				name : 'Change Name',
				disabled : !canEdit
			},			
			download : {
				name : 'Download',
				disabled : !canDownload,
			},
			delete : {
				name : 'Delete',
				disabled : !canEdit
			},
		}


		for (var f in action) {

			var name = action[f].name;
			var className = 'file-action-' + f;

			// Bind
			var fileAction = 
				parent
				.selectAll('.' + className)
				.data(function(d) { return [d] })

			// Enter
			fileAction
				.enter()
				.append('div')
				.classed(className, true)
				.classed('file-action', true)
				.classed('displayNone', action[f].disabled)
				.attr('trigger', f)
				.html(name)
				.on('click', function (d) {
					var trigger = this.getAttribute('trigger')
					that.layerActionTriggered(trigger, d, that, library)
				});

			// Exit
			fileAction
				.exit()
				.remove();
		}
	},



	// ╦  ╔═╗╦ ╦╔═╗╦═╗  ╔═╗╦  ╦╔═╗╦╔═  ╔═╗╦  ╦╔═╗╔╗╔╔╦╗╔═╗
	// ║  ╠═╣╚╦╝║╣ ╠╦╝  ║  ║  ║║  ╠╩╗  ║╣ ╚╗╔╝║╣ ║║║ ║ ╚═╗
	// ╩═╝╩ ╩ ╩ ╚═╝╩╚═  ╚═╝╩═╝╩╚═╝╩ ╩  ╚═╝ ╚╝ ╚═╝╝╚╝ ╩ ╚═╝

	layerActionTriggered : function (trigger, file, context, library) {
		return this._layerActionTriggered(trigger, file, context, library);
	},

	_layerActionTriggered : function (trigger, layer, ctx, library) {

		// rename
		if (trigger == 'changeName') ctx.editingLayerName = layer.getUuid();
			
		// share
		if (trigger == 'share') layer.shareLayer();

		// download
		if (trigger == 'download') layer.downloadLayer();

		// delete
		if (trigger == 'delete') layer.deleteLayer();

		// delete
		if (trigger == 'style') this.styleLayer(layer);
		
		// refresh
		this.showLayerActionFor = false;
		this.selectedLayers = [];
		this._refreshLayers();
	},

	styleLayer : function (layer) {

		var uuid = layer.getUuid();

		// Close this pane (data library)
		this._togglePane();

		// Store layer id
		app.Tools.Styler._storeActiveLayerUuid(uuid);

		// Open styler pane
		app.Tools.SettingsSelector._togglePane();



	},

	// Sets which layer we are editing
	activateLayerInput : function (d, library) {
		this.editingLayerName = d.getUuid();
		this.showLayerActionFor = false;
		this.selectedLayers = [];
		this._refreshLayers();
	},

	// Enable layer popup (delete, download, etc) on click
	enableLayerPopup : function (uuid) {

		// Deselect
		if ( this.showLayerActionFor == uuid ) {
			this.showLayerActionFor = false;
			this.selectedLayers = [];
			this._refreshLayers();
			return;
		}

		// Select
		this.showLayerActionFor = uuid;
		this.selectedLayers = uuid;
		this._refreshLayers();
	},

	// Save layer name
	saveLayerName : function (newName, d, library) {

		if ( !newName || newName == '' ) newName = d.getTitle();
		d.setTitle(newName);

		this.editingLayerName = false;		

		// fire layer edited
		Wu.Mixin.Events.fire('layerEdited', {detail : {
			layer: d
		}});

	},




});