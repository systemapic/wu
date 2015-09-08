Wu.Chrome.Data = Wu.Chrome.extend({

	_ : 'datachrome', 

	options : {
		defaultWidth : 350
	},

	_initialize : function () {

		// init container
		this.initContainer();

		// add hooks
		this._addEvents();
		
	},

	initContainer : function () {

		// create the container (just a div to hold errythign)
		this.outerContainer = Wu.DomUtil.create('div', 'chrome chrome-container chrome-right chrome-data', app._appPane);
		this.innerContainer = Wu.DomUtil.create('div', 'chrome-data-inner', this.outerContainer);

		this.topContainer = Wu.DomUtil.create('div', 'chrome-data-top', this.outerContainer);
		this.bottomContainer = Wu.DomUtil.create('div', 'chrome-data-bottom', this.outerContainer);

		this.fileListContainers = {};

		this.initContent();


	},

	_addEvents : function () {
		// todo
		Wu.DomEvent.on(window, 'resize', this._windowResize, this);
	},

	_removeEvents : function () {
		Wu.DomEvent.off(window, 'resize', this._windowResize, this);
	},

	_windowResize : function () {
	},

	getDimensions : function () {

		var dims = {
			width : this.options.defaultWidth,
			height : this.outerContainer.offsetHeight
		}

		return dims;
	},


	open : function (tab) {
		
		// set width of right pane
		this.outerContainer.style.width = this.options.defaultWidth + 'px';
		this.outerContainer.style.display = 'block';

		// move map
		this.moveMap('open');
	},

	close : function () {

		// set width of right pane
		this.outerContainer.style.width = '0';
		this.outerContainer.style.display = 'none';

		// move map
		// this.moveMap('close');
		if ( !app.Chrome.Right.isOpen ) this.moveMap('close');

	},

	// helper fn, todo: refactor
	moveMap : function (direction) {

		// div = map container
		var div = app.MapPane._container;

		// get current map width
		var currentWidth = div.offsetWidth;

		// default: full width
		var width = '100%';

		// if open, set width to current minus width of right chrome
		if (direction == 'open') width = currentWidth - this.options.defaultWidth + 'px';

		// set width
		div.style.width = width;
	},




	// D3 D3 D3 D3 D3 D3 D3 D3 D3 D3
	// D3 D3 D3 D3 D3 D3 D3 D3 D3 D3
	// D3 D3 D3 D3 D3 D3 D3 D3 D3 D3		
	// D3 D3 D3 D3 D3 D3 D3 D3 D3 D3


	// HERE IT BEGINS!!!

	initContent : function () {
		
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

		for ( var f in this.fileProviders ) {

			this.fileListContainers[f] = {};

			// Create wrapper
			this.fileListContainers[f].wrapper = Wu.DomUtil.create('div', 'file-list-container', this.innerContainer);
			
			// Title
			this.fileListContainers[f].title = Wu.DomUtil.create('div', 'chrome-content-header file-list-container-title', this.fileListContainers[f].wrapper);
			this.fileListContainers[f].title.innerHTML = this.fileProviders[f].name;

			// D3 Container
			this.fileListContainers[f].fileList = Wu.DomUtil.create('div', 'file-list-container-file-list', this.fileListContainers[f].wrapper);
			this.fileListContainers[f].D3container = d3.select(this.fileListContainers[f].fileList);
		}


		setTimeout(function() {
			var uuid = app.activeProject.getUuid()
			this.refresh(uuid);
		}.bind(this), 1000)

		

	},


	refresh : function (uuid) {

		this._project = app.Projects[uuid];

		this.fileProviders.projectFiles.data = this._project.getFiles();


		for ( var f in this.fileProviders ) {

			var D3container = this.fileListContainers[f].D3container;
			var data = this.fileProviders[f].data;


			this.initFileList(D3container, data);

		}


	},

	initFileList : function (D3container, data) {

		console.log('D3container', D3container);
		console.log('data', data);



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
			.html(function (d) { return d.name });

		// UPDATE
		dataListLine
			.html(function (d) { return d.name });

		// EXIT
		dataListLine
			.exit()
			.remove();

	}




});








