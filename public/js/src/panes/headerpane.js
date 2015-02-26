// app.HeaderPane

Wu.HeaderPane = Wu.Class.extend({
	_ : 'headerpane', 

	initialize : function () {
		
		// set options
		this.options = {};
		this.options.editMode = false;
		
		// init container
		this._initContainer();
		
		// return
		return this; 
	},      

	_initContainer : function () {

		// create divs
		this._container     = Wu.app._headerPane = Wu.DomUtil.create('div', 'displayNone', Wu.app._mapContainer);
		this._container.id  = 'header';

		// wrapper for header
		this._logoContainer = Wu.DomUtil.create('div', 'header-logo-container', this._container);
		this._logo 	    = Wu.DomUtil.create('img', 'header-logo', this._logoContainer);
		this._titleWrap     = Wu.DomUtil.create('div', 'header-title-wrap', this._container);
		this._title 	    = Wu.DomUtil.create('div', 'header-title', this._titleWrap);
		this._subtitle 	    = Wu.DomUtil.create('div', 'header-subtitle', this._titleWrap);

		// hack
		this._title.whichTitle    = 'title';
		this._subtitle.whichTitle = 'subtitle';

		// tooltips
		app.Tooltip.add(this._logo, 'Click to upload a new logo');

		// stops
		Wu.DomEvent.on(this._logo, 'mouseover', Wu.DomEvent.stopPropagation, this);
		Wu.DomEvent.on(this._title, 'mouseover', Wu.DomEvent.stopPropagation, this);

	},

	getContainer : function () {
		return this._container;
	},

	addHooks : function () {
	},


	addedLogo : function (path) {
		
		// set path
		var fullpath = '/images/' + path;

		var project = this.project;
		
		// set new image and save
		project.setHeaderLogo(fullpath);

		// update image in header
		var headerLogoPath = project.getHeaderLogo() ? project.getHeaderLogo() :  '/css/images/defaultProjectLogo.png';
		this._logo.src = headerLogoPath;

	},

	setTitle : function (title) {
		this._title.innerHTML = title;
	},

	setSubtitle : function (subtitle) {
		this._subtitle.innerHTML = subtitle;
	},
	
	_setLeft : function (left) {
		this._container.style.left = left + 'px';
	},

	_update : function (project) {
		this.update(project);
	},

	update : function (project) {

		this.project = project;
	       
	        // show header
		this._container.style.display = 'block';

		var headerLogoPath = project.getHeaderLogo() ? project.getHeaderLogo() :  '/css/images/defaultProjectLogo.png';
		this._logo.src = headerLogoPath;

		// update values
		this._title.innerHTML 	 = project.getHeaderTitle();
		this._subtitle.innerHTML = project.getHeaderSubtitle();
		

	},

	getHeight : function () {
		return this._headerHeight;
	},

	reset : function () {
		
		// Keep header, but remove it's content from DOM
		Wu.app.HeaderPane._title.innerHTML = '';
		Wu.app.HeaderPane._subtitle.innerHTML = '';
		Wu.app.HeaderPane._logo.src = '';
	},


	save : function () {

		// set current values to project
		this.project.store.header.height 	= this._headerHeight;
		this.project.store.header.title 	= this._title.innerHTML;
		this.project.store.header.subtitle 	= this._subtitle.innerHTML;
		var img = this._logo.src.slice(4).slice(0,-1);
		this.project.store.header.logo 		= img;     	

		// save to db
		this._save();
	},

	_save : function () {
		// save project to db
		this.project._update('header');
	},

	setProject : function (project) {
		// update header with project
		this._update(project);
	}
});
