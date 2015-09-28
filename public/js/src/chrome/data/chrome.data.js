Wu.Chrome.Data = Wu.Chrome.extend({

	_ : 'data', 

	options : {
		defaultWidth : 350
	},

	_initialize : function () {

		// init container
		this._initContainer();

		// init content
		this._initContent();

		// register buttons
		this._registerButton();

		// hide by default
		this._hide();

	},

	_onLayerAdded : function () {
		this._refresh();
	},

	_onFileDeleted : function () {
		this._refresh();
	},

	_onLayerDeleted : function () {
		this._refresh();
	},

	_initContainer : function () {

		// create the container (just a div to hold errythign)
		this._container = Wu.DomUtil.create('div', 'chrome chrome-content data', this.options.appendTo);

		// Middle container
		this._innerContainer = Wu.DomUtil.create('div', 'chrome-data-inner', this._container);
		this._fileListsOuterScroller = Wu.DomUtil.create('div', 'chrome-data-outer-scroller', this._innerContainer);
		this._fileListsContainer = Wu.DomUtil.create('div', 'chrome-data-scroller', this._fileListsOuterScroller);

		// create top container
		this._initTopContainer();

		// create file list
		this._initFileLists();

		// close event
		Wu.DomEvent.on(this._innerContainer, 'click', this.closeFileOption, this);

	},


	_initTopContainer : function () {

		// Top container
		this.topContainer = Wu.DomUtil.create('div', 'chrome-data-top', this._container);

		this.topTitle = Wu.DomUtil.create('div', 'chrome-header-title', this.topContainer, 'Data Library')

		// Upload button
		if (app.access.to.upload_file(this._project)) {
			this.uploadButton = app.Data.getUploadButton('chrome-upload-button', this.topContainer);
			this.uploadButton.innerHTML = 'Upload files...';
		}
	},



	// HERE IT BEGINS!!!
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
			context : this
		});

	},

	_togglePane : function () {

		// right chrome
		var chrome = this.options.chrome;

		// open/close
		this._isOpen ? chrome.close(this) : chrome.open(this); // pass this tab
	},

	_show : function () {

		// mark button active
		Wu.DomUtil.addClass(this._topButton, 'active');

		this._container.style.display = 'block';
		this._isOpen = true;

	},

	_hide : function () {

		// mark button inactive
		Wu.DomUtil.removeClass(this._topButton, 'active');

		this._container.style.display = 'none';
		this._isOpen = false;

	},

	onOpened : function () {
	},

	onClosed : function () {
		// console.log('i was closed!'); // for cleanup etc., if closed from somewhere else
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









	// ██████╗ ██████╗     ███████╗██╗██╗     ███████╗    ██╗     ██╗███████╗████████╗
	// ██╔══██╗╚════██╗    ██╔════╝██║██║     ██╔════╝    ██║     ██║██╔════╝╚══██╔══╝
	// ██║  ██║ █████╔╝    █████╗  ██║██║     █████╗      ██║     ██║███████╗   ██║   
	// ██║  ██║ ╚═══██╗    ██╔══╝  ██║██║     ██╔══╝      ██║     ██║╚════██║   ██║   
	// ██████╔╝██████╔╝    ██║     ██║███████╗███████╗    ███████╗██║███████║   ██║   
	// ╚═════╝ ╚═════╝     ╚═╝     ╚═╝╚══════╝╚══════╝    ╚══════╝╚═╝╚══════╝   ╚═╝   


	// ┬┌┐┌┬┌┬┐  ┌─┐┌─┐┌┐┌┌┬┐┌─┐┬┌┐┌┌─┐┬─┐┌─┐
	// │││││ │   │  │ ││││ │ ├─┤││││├┤ ├┬┘└─┐
	// ┴┘└┘┴ ┴   └─┘└─┘┘└┘ ┴ ┴ ┴┴┘└┘└─┘┴└─└─┘

	// initContent : function () {
	_initFileLists : function () {


		// Holds each section (project files, my files, etc)
		this.fileListContainers = {};

		// Holds files that we've selected
		this.selectedFiles = [];

		// Show file actions for this specific file
		this.showFileActionFor = false;

		// Edit file name
		this.editingName = false;


		// Layer list (for this project)
		this.projectLayers = {
			name : 'Project Layers',
			data : []	
		}

		// File list (global)
		this.fileProviders = {};

		// add postgis files
		if (app.access.to.edit_project(this._project)) {
			
			this.fileProviders.postgis = {
				name : 'My Files',
				data : [],
				getFiles : function () {
					return app.Account.getFiles()
				}
			}
		}


		// Create PROJECT LAYERS section, with D3 container
		// Create PROJECT LAYERS section, with D3 container
		// Create PROJECT LAYERS section, with D3 container				

		this.projectLayersContainers = {};

		// Create wrapper
		this.projectLayersContainers.wrapper = Wu.DomUtil.create('div', 'file-list-container', this._fileListsContainer);
		
		// Title
		this.projectLayersContainers.title = Wu.DomUtil.create('div', 'chrome-content-header file-list-container-title', this.projectLayersContainers.wrapper);
		this.projectLayersContainers.title.innerHTML = this.projectLayers.name;

		// D3 Container
		this.projectLayersContainers.fileList = Wu.DomUtil.create('div', 'file-list-container-file-list', this.projectLayersContainers.wrapper);
		this.projectLayersContainers.D3container = d3.select(this.projectLayersContainers.fileList);



		// Create FILE LIST section, with D3 container
		// Create FILE LIST section, with D3 container
		// Create FILE LIST section, with D3 container

		for ( var f in this.fileProviders ) {

			this.fileListContainers[f] = {};

			// Create wrapper
			this.fileListContainers[f].wrapper = Wu.DomUtil.create('div', 'file-list-container', this._fileListsContainer);
			
			// Title
			this.fileListContainers[f].title = Wu.DomUtil.create('div', 'chrome-content-header file-list-container-title', this.fileListContainers[f].wrapper);
			this.fileListContainers[f].title.innerHTML = this.fileProviders[f].name;

			// D3 Container
			this.fileListContainers[f].fileList = Wu.DomUtil.create('div', 'file-list-container-file-list', this.fileListContainers[f].wrapper);
			this.fileListContainers[f].D3container = d3.select(this.fileListContainers[f].fileList);
		}

	},


	// ┬─┐┌─┐┌─┐┬─┐┌─┐┌─┐┬ ┬  ┬  ┬┌─┐┌┬┐┌─┐
	// ├┬┘├┤ ├┤ ├┬┘├┤ └─┐├─┤  │  │└─┐ │ └─┐
	// ┴└─└─┘└  ┴└─└─┘└─┘┴ ┴  ┴─┘┴└─┘ ┴ └─┘	

	_refresh : function () {

		// LAYERS
		// LAYERS
		// LAYERS

		var D3container = this.projectLayersContainers.D3container;

		// If project has no layers...
		// var layers = this._project.getPostGISLayers
		var layers = this._project.getDataLayers();
		
		console.log('pg layerS: ', layers);

		this.projectLayers.data = layers;

		// Remove text for no layers...
		this.createNoLayer(D3container, []);
		this.initFileList(D3container, layers, 'layers');		


		// If no layers, make a dummy
		if ( layers.length == 0 ) {
			var noDataText = ['<span style="font-style: italic; color: #ccc;">Click on files from the list below to add layers.</span>'];
			this.createNoLayer(D3container, noDataText);

		} 


		// FILES
		for (var p in this.fileProviders) {
			var provider = this.fileProviders[p];
			var files = provider.getFiles();
			provider.data = _.toArray(files);
			var D3container = this.fileListContainers[p].D3container;
			var data = this.fileProviders[p].data;
			this.initFileList(D3container, data, p);
		}

	},


	createNoLayer : function (D3container, data) {


		// BIND
		var dataListLine = 
			D3container
			.selectAll('.data-list-line')
			.data(data);

		// ENTER
		dataListLine
			.enter()
			.append('div')
			.classed('data-list-line', true)
			.classed('chrome-metafield-line', true)
			.html(function (d) { return d });


		// EXIT
		dataListLine
			.exit()
			.remove();

	},


	// ████████╗██╗  ██╗███████╗    ██╗      ██████╗  ██████╗ ██████╗ 
	// ╚══██╔══╝██║  ██║██╔════╝    ██║     ██╔═══██╗██╔═══██╗██╔══██╗
	//    ██║   ███████║█████╗      ██║     ██║   ██║██║   ██║██████╔╝
	//    ██║   ██╔══██║██╔══╝      ██║     ██║   ██║██║   ██║██╔═══╝ 
	//    ██║   ██║  ██║███████╗    ███████╗╚██████╔╝╚██████╔╝██║     
	//    ╚═╝   ╚═╝  ╚═╝╚══════╝    ╚══════╝ ╚═════╝  ╚═════╝ ╚═╝     



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
			.classed('data-list-line', true)
			.classed('chrome-metafield-line', true);


		// UPDATE
		dataListLine
			.classed('file-selected', function(d) {
				
				var uuid = d.getUuid();

				// If selected with CMD or SHIFT
				var index = this.selectedFiles.indexOf(uuid);
				if (index > -1) return true;

				// If selected by single click
				if ( uuid == this.showFileActionFor ) return true;

				// Else no selection
				return false;

			}.bind(this));


		// EXIT
		dataListLine
			.exit()
			.remove();



		// Create Name content
		this.createNameContent(dataListLine, library);	

		// CREATE POP-UP TRIGGER
		this.createPopUpTrigger(dataListLine, library);

		// CREATE FILE ACTION POP-UP
		this.createFileActionPopUp(dataListLine, library)


	},


	// ┌─┐┬┬  ┌─┐  ┌┐┌┌─┐┌┬┐┌─┐
	// ├┤ ││  ├┤   │││├─┤│││├┤ 
	// └  ┴┴─┘└─┘  ┘└┘┴ ┴┴ ┴└─┘

	createNameContent : function (parent, library) {

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
				this.activateInput(d, library);
			}.bind(this));			


		// Exit
		nameContent
			.exit()
			.remove();


		// Create input field
		this.createInputField(nameContent, library);


	},

	
	// ┌─┐┬┬  ┌─┐  ┬┌┐┌┌─┐┬ ┬┌┬┐
	// ├┤ ││  ├┤   ││││├─┘│ │ │ 
	// └  ┴┴─┘└─┘  ┴┘└┘┴  └─┘ ┴ 	

	createInputField : function (parent, library) {

		var that = this;

		// Bind
		var nameInput = 
			parent
			.selectAll('.file-name-input')
			.data(function (d) {
				var uuid = d.getUuid();
				if ( this.editingName == uuid ) return [d];
				return false;
			}.bind(this))

		// Enter
		nameInput
			.enter()
			.append('textarea')
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
				if ( that.editingName == uuid ) return false;	
				return true;
			})
			.on('blur', function (d) {
				var newName = this.value;
				that.saveName(newName, d, library);
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

	createPopUpTrigger : function (parent, library) {

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
				this.click_showFileOptions(uuid)
			}.bind(this))	


		// Exit
		popupTrigger
			.exit()
			.remove();


	},


	// ┌─┐┬┬  ┌─┐  ┌─┐┌─┐┌┬┐┬┌─┐┌┐┌  ┌─┐┌─┐┌─┐┬ ┬┌─┐
	// ├┤ ││  ├┤   ├─┤│   │ ││ ││││  ├─┘│ │├─┘│ │├─┘
	// └  ┴┴─┘└─┘  ┴ ┴└─┘ ┴ ┴└─┘┘└┘  ┴  └─┘┴  └─┘┴  


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
		    canEdit = app.access.to.edit_project(this._project),
		    canDownload = app.access.to.download_file(this._project),
		    that = this;
	
		var action = {

			createLayer : {
				name : 'Add To Project',
				disabled : isDisabled,
			},
			share : {
				name : 'Share with...',
				disabled : false,
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
					that.itemActionTriggered(trigger, d, that, library)
				});

			// Exit
			fileAction
				.exit()
				.remove();
		}
	},



	//  ██████╗██╗     ██╗ ██████╗██╗  ██╗    ███████╗██╗   ██╗███████╗███╗   ██╗████████╗███████╗
	// ██╔════╝██║     ██║██╔════╝██║ ██╔╝    ██╔════╝██║   ██║██╔════╝████╗  ██║╚══██╔══╝██╔════╝
	// ██║     ██║     ██║██║     █████╔╝     █████╗  ██║   ██║█████╗  ██╔██╗ ██║   ██║   ███████╗
	// ██║     ██║     ██║██║     ██╔═██╗     ██╔══╝  ╚██╗ ██╔╝██╔══╝  ██║╚██╗██║   ██║   ╚════██║
	// ╚██████╗███████╗██║╚██████╗██║  ██╗    ███████╗ ╚████╔╝ ███████╗██║ ╚████║   ██║   ███████║
	//  ╚═════╝╚══════╝╚═╝ ╚═════╝╚═╝  ╚═╝    ╚══════╝  ╚═══╝  ╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝



	_fileActionTriggered : function (trigger, file, context, library) {
		var fileUuid = file.getUuid();
		var project = context._project;

		// set name
		if (trigger == 'changeName') context.editingName = fileUuid;			

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
		this._refresh();
	},

	_layerActionTriggered : function (trigger, layer, ctx, library) {

		// rename
		if (trigger == 'changeName') ctx.editingName = layer.getUuid();
			
		// share
		if (trigger == 'share') layer.shareLayer();

		// download
		if (trigger == 'download') layer.downloadLayer();

		// delete
		if (trigger == 'delete') layer.deleteLayer();
		
		// refresh
		this.showFileActionFor = false;
		this.selectedFiles = [];
		this._refresh();			

	},

	


	// xoxoxo
	itemActionTriggered : function (trigger, file, context, library) {

		// pass to fn
		if (library == 'layers') return this._layerActionTriggered(trigger, file, context, library);
		if (library == 'postgis') return this._fileActionTriggered(trigger, file, context, library);
 
		return console.error('neither file nor layer??');
	},

	activateInput : function (d, library) {
		this.editingName = d.getUuid();
		this.showFileActionFor = false;
		this.selectedFiles = [];
		this._refresh();
	},

	dataListClickEvents : function (d, library, e) {

		var uuid = d.getUuid();

		if (uuid == 'nolayers') return;

		// If holding CMD down
		if (e.metaKey) return this.click_toggleCMD(uuid);
		
		// If holding shift down
		if (e.shiftKey) return this.click_toggleSHIFT(uuid, library); 
		
		// Else just click
		// this.click_showFileOptions(this, uuid); 

	},


	// Click while holding shift down
	click_toggleSHIFT : function (uuid, library) {


		var files = this.fileProviders[library].data;


		if ( this.shift ) {

			// Select all between first and current click
			var tmpStart = false;
			var tmpEnd = false;
			var end = false;
			var start = false;


			// Find index of first and last point clicked
			files.forEach(function(f,i) {
				if ( f.store.uuid == uuid ) tmpStart = i;
				if ( f.store.uuid == this.shift ) tmpEnd = i;
			}.bind(this));


			// Check if we've selected upwards or downwards
			if ( tmpEnd > tmpStart ) {
				end = tmpStart;
				start = tmpEnd;
			} else {
				end = tmpEnd;
				start = tmpStart;
			}

			// Set selected files
			files.forEach(function(f, i) {
				if ( i <= start && i >= end ) {
					this.selectedFiles.push(f.store.uuid);
				}
			}.bind(this));

			this.shift = false;

			this._refresh();
			

		} else {

			// Clear all selected but current click
			this.selectedFiles.push(uuid);

			// Store current selection
			this.shift = uuid;
			
		}


		// Close file action pop-up
		this.showFileActionFor = false;	

		this._refresh();

	},


	// Click while holding command down
	click_toggleCMD : function (uuid) {


		var isSelected = false;

		this.selectedFiles.forEach(function(s, i) {

			if ( s == uuid ) {
				isSelected = true;
				return;
			}
		})

		if ( isSelected ) {
			// Remove from array
			var index = this.selectedFiles.indexOf(uuid);
			if (index > -1) this.selectedFiles.splice(index, 1);

		} else {

			// Add to array
			this.selectedFiles.push(uuid);
		}

		// Close file action pop-up
		this.showFileActionFor = false;	

		this._refresh();
	},


	// Just click

	click_showFileOptions : function (uuid) {

		// Deselect
		if ( this.showFileActionFor == uuid ) {
			this.showFileActionFor = false;
			this.selectedFiles = [];
			this._refresh();
			return;
		}

		// Select
		this.showFileActionFor = uuid;
		this.selectedFiles = uuid;		
		this._refresh();

	},


	closeFileOption : function (e) {

		var classes = e.target.classList;
		var stop = false;

		// Stop when clicking on these classes
		classes.forEach(function(c) {
			if ( c == 'file-action') stop = true;
			if ( c == 'file-popup-trigger') stop = true;
			if ( c == 'file-popup') stop = true;
		})

		// Stop if we're editing name
		if (e.target.name == this.editingName) stop = true;

		if (stop) return;

		// Reset
		this.showFileActionFor = false;
		this.selectedFiles = [];
		this._refresh();
	},


	saveName : function (newName, d, library) {

		// rename layer
		if (library == 'layers') {

			if ( !newName || newName == '' ) newName = d.getTitle();
			d.setTitle(newName);

			// fire layer edited
			Wu.Mixin.Events.fire('layerEdited', {detail : {
				layer: d
			}});

		// rename file
		} else {

			if ( !newName || newName == '' ) newName = d.getName();
			d.setName(newName);	
		}
		
		this.editingName = false;
		this._refresh();
	},


});