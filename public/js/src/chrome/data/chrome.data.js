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

		// LAYER LIST OUTER SCROLLER
		this._layerListOuterScroller = Wu.DomUtil.create('div', 'chrome-data-outer-scroller', this._innerContainer);
		this._layerListOuterScroller.style.height = '100%';

		// List container
		this._layerListContainer = Wu.DomUtil.create('div', 'chrome-data-scroller', this._layerListOuterScroller);
		this._layerListTitle = Wu.DomUtil.create('div', 'chrome-content-header layer-list-container-title', this._layerListContainer, 'Layers');

		// Containers
		this._layersContainer = Wu.DomUtil.create('div', 'layers-container', this._layerListContainer);
		
		// base layers
		this._baseLayers = Wu.DomUtil.create('div', 'chrome-content-header layer-list-container-title', this._layerListContainer, 'Base layer');
		this._baseLayerDropdownContainer = Wu.DomUtil.create('div', 'base-layer-dropdown-container', this._layerListContainer);

	},

	// File list container
	_initFileListContainer : function () {

		// Lines
		this._fileListSeparator = Wu.DomUtil.create('div', 'file-list-separator', this._layerListContainer);

		// HEADER
		this._fileListTitle = Wu.DomUtil.create('div', 'chrome-content-header layer-list-container-title', this._layerListContainer, 'My Data');

		// Upload button container
		this._uploadButtonContainer = Wu.DomUtil.create('div', 'upload-button-container', this._layerListContainer);

		// Containers
		this._filesContainer = Wu.DomUtil.create('div', 'files-container', this._layerListContainer);

	
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
			})
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

	_onFileImported : function () {
		this._refresh();
	},


	_refresh : function () {

		if (!this._project) return;

		// Empty containers
		if ( this._layersContainer ) this._layersContainer.innerHTML = '';
		if ( this._filesContainer )  this._filesContainer.innerHTML = '';

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
				var date = moment(d.getCreated()).format('DD MMMM YYYY');
				_str += '<span class="file-meta-date">' + date + '</span>';

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
			// .append('textarea')
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



	// // ┌─┐┬┬  ┌─┐  ┌─┐┬ ┬┌┬┐┬ ┬┌─┐┬─┐
	// // ├┤ ││  ├┤   ├─┤│ │ │ ├─┤│ │├┬┘
	// // └  ┴┴─┘└─┘  ┴ ┴└─┘ ┴ ┴ ┴└─┘┴└─

	// createFileAuthor : function (parent, library) {

	// 	var that = this;

	// 	// Bind
	// 	var nameContent = 
	// 		parent
	// 		.selectAll('.file-meta-author')
	// 		.data(function(d) { return [d] })

	// 	// Enter
	// 	nameContent
	// 		.enter()
	// 		.append('div')
	// 		.classed('file-meta-author', true)


	// 	// Update
	// 	nameContent
	// 		.html(function (d) { 

	// 			// User
	// 			var userId = d.getCreatedBy();
	// 			var userName = app.Users[userId].getFullName();
				
	// 			return userName;

	// 		}.bind(this))


	// 	// Exit
	// 	nameContent
	// 		.exit()
	// 		.remove();

	// },	


	// ┌─┐┌─┐┌─┐┬ ┬┌─┐  ┌┬┐┬─┐┬┌─┐┌─┐┌─┐┬─┐
	// ├─┘│ │├─┘│ │├─┘   │ ├┬┘││ ┬│ ┬├┤ ├┬┘
	// ┴  └─┘┴  └─┘┴     ┴ ┴└─┴└─┘└─┘└─┘┴└─	

	// The little "..." next to file name

	createFilePopUpTrigger : function (parent, library) {

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

		// Deselect
		if ( this.showFileActionFor == uuid ) {
			this.showFileActionFor = false;
			this.selectedFiles = [];
			this._refreshFiles();
			return;
		}

		// Select
		this.showFileActionFor = uuid;
		this.selectedFiles = uuid;
		this._refreshFiles();
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
	       		if (provider != 'postgis') return;

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
		var noLayersText = 'This project has no layers.<br>Upload files, and add them to project.';
		var noLayers = Wu.DomUtil.create('div', 'no-layers', this._layersContainer, noLayersText);
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

	// Add layer
	addLayer : function (layer) {
		var layerMenu = app.MapPane.getControls().layermenu;
		layerMenu.add(layer);
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


	// TOGGLE BASE LAYERS
	// TOGGLE BASE LAYERS
	// TOGGLE BASE LAYERS

	// toggleBaseLayer : function (layer) {

	// 	var uuid = layer.getUuid();

	// 	// Toggle layer off
	// 	var layerOn = this.isLayerOn(uuid);
	// 	if ( layerOn ) this.removeLayer(layer);	

	// 	var on = this.§(uuid);
	// 	on ? this.removeBaseLayer(layer) : this.addBaseLayer(layer);

	// 	this._refreshLayers();		
	// },

	// // Add base layer
	// addBaseLayer : function (layer) {

	// 	var uuid = layer.getUuid()

	// 	// Update map	
	// 	layer._addTo('baselayer');


	// 	// Save to server
	// 	this._project.addBaseLayer({
	// 		uuid : uuid,
	// 		zIndex : 1,
	// 		opacity : layer.getOpacity()
	// 	});

	// },

	// // Remove base layer
	// removeBaseLayer : function (layer) {

	// 	console.log('%c removeBaseLayer ', 'background: blue; color: white;');
	// 	console.log(layer);

	// 	// Update map
	// 	layer.disable(); 

	// 	// Save to server
	// 	this._project.removeBaseLayer(layer);

	// },

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
				if ( library == 'postgis' ) this.activateLayerInput(d, library);
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