Wu.Chrome.Data = Wu.Chrome.extend({

	_ : 'datachrome', 

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

	_initContainer : function () {

		// create the container (just a div to hold errythign)
		this._container = Wu.DomUtil.create('div', 'chrome chrome-content data', this.options.appendTo);

		// Middle container
		this.innerContainer = Wu.DomUtil.create('div', 'chrome-data-inner', this._container);

		this.fileListsOuterScroller = Wu.DomUtil.create('div', 'chrome-data-outer-scroller', this.innerContainer);

		this.fileListsContainer = Wu.DomUtil.create('div', 'chrome-data-scroller', this.fileListsOuterScroller);

		// Bottom Container
		this.initBottomContainer();


		this.initContent();

	},


	initBottomContainer : function () {

		// Bottom container
		this.bottomContainer = Wu.DomUtil.create('div', 'chrome-data-bottom', this._container);

		// Upload button
		this.uploadButton = Wu.DomUtil.create('div', 'chrome-right-big-button upload', this.bottomContainer, 'Upload');


	},

	

	// HERE IT BEGINS!!!
	_initContent : function () {

		// add hooks
		this._addEvents();
	},

	_registerButton : function () {

		// register button in top chrome
		console.log('data _registerButton');

		// where
		var top = app.Chrome.Top;

		// add a button to top chrome
		top._registerButton({
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
		this._container.style.display = 'block';
		this._isOpen = true;
	},

	_hide : function () {
		this._container.style.display = 'none';
		this._isOpen = false;
	},

	onOpened : function () {
		console.log('i was opened!');
	},

	onClosed : function () {
		console.log('i was closed!'); // for cleanup etc., if closed from somewhere else
	},

	_addEvents : function () {
		// todo
		Wu.DomEvent.on(window, 'resize', this._onWindowResize, this);
	},

	_removeEvents : function () {
		Wu.DomEvent.off(window, 'resize', this._onWindowResize, this);
	},

	_onWindowResize : function () {
		console.log('_windowResize')
	},

	getDimensions : function () {
		var dims = {
			width : this.options.defaultWidth,
			height : this._container.offsetHeight
		}
		return dims;
	},




	_refresh : function () {


		this.fileProviders.projectFiles.data = this._project.getFiles();
		// this.fileProviders.myFiles.data = app.Account.getFiles();

		for ( var f in this.fileProviders ) {

			var D3container = this.fileListContainers[f].D3container;
			var data = this.fileProviders[f].data;


			this.initFileList(D3container, data, f);

		}


	},









	// D3 D3 D3 D3 D3 D3 D3 D3 D3 D3
	// D3 D3 D3 D3 D3 D3 D3 D3 D3 D3
	// D3 D3 D3 D3 D3 D3 D3 D3 D3 D3		
	// D3 D3 D3 D3 D3 D3 D3 D3 D3 D3


	// HERE IT BEGINS!!!

	initContent : function () {


		// Holds each section (project files, my files, etc)
		this.fileListContainers = {};

		// Holds files that we've selected
		this.selectedFiles = [];

		// Show file actions for this specific file
		this.showFileActionFor = false;
		
		// Dummy
		this.fileProviders = {

			projectFiles : {
				name : 'Project Files',
				data : []
			},
			myFiles      : {
				name : 'My Files',
				data : []
			},
		}


		// Create each section, with D3 container
		for ( var f in this.fileProviders ) {

			this.fileListContainers[f] = {};

			// Create wrapper
			this.fileListContainers[f].wrapper = Wu.DomUtil.create('div', 'file-list-container', this.fileListsContainer);
			
			// Title
			this.fileListContainers[f].title = Wu.DomUtil.create('div', 'chrome-content-header file-list-container-title', this.fileListContainers[f].wrapper);
			this.fileListContainers[f].title.innerHTML = this.fileProviders[f].name;

			// D3 Container
			this.fileListContainers[f].fileList = Wu.DomUtil.create('div', 'file-list-container-file-list', this.fileListContainers[f].wrapper);
			this.fileListContainers[f].D3container = d3.select(this.fileListContainers[f].fileList);
		}



	},




	initFileList : function (D3container, data, library) {


		// CREATE LINE WITH FILE!!!
		// CREATE LINE WITH FILE!!!
		// CREATE LINE WITH FILE!!!

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
			.on('click', function (d) { this.dataListClickEvents(d, library) }.bind(this))
			.html(function (d) { return d.name });

		// UPDATE
		dataListLine
			.classed('file-selected', function(d) {
				
				// If selected with CMD or SHIFT
				var index = this.selectedFiles.indexOf(d.uuid);
				if (index > -1) return true;

				// If selected by single click
				if ( d.uuid == this.showFileActionFor ) return true;

				return false;
			}.bind(this))
			.html(function (d) { return d.name });

		// EXIT
		dataListLine
			.exit()
			.remove();




		// CREATE POP-UP TRIGGER
		// CREATE POP-UP TRIGGER
		// CREATE POP-UP TRIGGER





						


		// CREATE FILE ACTION POP-UP
		// CREATE FILE ACTION POP-UP
		// CREATE FILE ACTION POP-UP				

		// Bind
		var dataListLineAction = 
			dataListLine
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
				if ( d.uuid == this.showFileActionFor ) return false;
				return true;
			}.bind(this))
			.html(function (d) {
				var HTML = this.cetFileActions(d.uuid);
				return HTML;
			}.bind(this))			

		// Exit
		dataListLineAction
			.exit()
			.remove();



	},


	cetFileActions : function (uuid) {


		// DUMMY 
		var s = '<div class="file-action">';
		var e = '</div>';

		var HTML  = s + 'Delte' + e;
		    HTML += s + 'Download' + e;
		    HTML += s + 'Share' + e;
		    HTML += s + 'Change name' + e;

		return HTML;

	},


	// CLICK EVENTS
	// CLICK EVENTS
	// CLICK EVENTS

	dataListClickEvents : function (d, library) {


		// If holding CMD down
		if ( window.event.metaKey ) { 

			this.click_toggleCMD(d.uuid);
			return
		}
		
		// If holding shift down
		if ( window.event.shiftKey ) { 
			this.click_toggleSHIFT(d.uuid, library); 
			return;
		}
		
		// Else just click
		this.click_showFileOptions(this, d.uuid); 

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
				if ( f.uuid == uuid ) tmpStart = i;
				if ( f.uuid == this.shift ) tmpEnd = i;
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
					this.selectedFiles.push(f.uuid);
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
	click_showFileOptions : function (elem, uuid) {

		// this.showFileActionFor = uuid;

		// this.selectedFiles = [];		
		// this._refresh();

	}

fdfdsf
});