Wu.HeaderPane = Wu.Pane.extend({
	
	_ : 'headerpane', 

	_initContainer : function () {

		// create divs
		this._container     = app._headerPane = Wu.DomUtil.create('div', 'displayNone', app._mapContainer);
		this._container.id  = 'header';

		// wrapper for header
		this._logoContainer = Wu.DomUtil.create('div', 'header-logo-container', this._container);
		this._logo 	    = Wu.DomUtil.create('img', 'header-logo', this._logoContainer);
		this._titleWrap     = Wu.DomUtil.create('div', 'header-title-wrap', this._container);
		this._title 	    = Wu.DomUtil.create('div', 'header-title', this._titleWrap);
		this._subtitle 	    = Wu.DomUtil.create('div', 'header-subtitle', this._titleWrap);

		// hack
		// this._title.whichTitle    = 'title';
		// this._subtitle.whichTitle = 'subtitle';

		// tooltips
		this._addTooltips();

		// add hooks
		this.addHooks();
	},

	// run on projectSelected event (by Wu.Pane)
	// this._project is now updated
	_refresh : function () {

		// refresh fields
		this.setLogo();
		this.setTitle();
		this.setSubtitle();

		// show
		this._show();
	},

	_show : function () {
		this._container.style.display = 'block';
	},

	_hide : function () {
		this._container.style.display = 'none';
	},



	getContainer : function () {
		return this._container;
	},

	addHooks : function () {
		// stops
		Wu.DomEvent.on(this._logo, 'mouseover', Wu.DomEvent.stopPropagation, this);
		Wu.DomEvent.on(this._title, 'mouseover', Wu.DomEvent.stopPropagation, this);
	},

	_addTooltips : function () {
		app.Tooltip.add(this._logo, 'Click to upload a new logo');
	},

	addedLogo : function (path) {
		
		// set path
		var fullpath = '/images/' + path;

		// set new image and save
		this._project.setHeaderLogo(fullpath);

		// update image in header
		this.setLogo();
	},

	setLogo : function (logo) {
		this._logo.src = logo || this._project.getHeaderLogo() ? this._project.getHeaderLogo() :  '/css/images/defaultProjectLogo.png';
	},

	setTitle : function (title) {
		this._title.innerHTML = title || this._project.getHeaderTitle();
	},

	setSubtitle : function (subtitle) {
		this._subtitle.innerHTML = subtitle || this._project.getHeaderSubtitle();
	},








	// initialize : function () {
		
	// 	// set options
	// 	this.options = {};
	// 	this.options.editMode = false;
		
	// 	// init container
	// 	this._initContainer();
		
	// 	// return
	// 	return this; 
	// },      

	// getHeight : function () {
	// 	return this._headerHeight;
	// },

	
	// _setLeft : function (left) {
	// 	this._container.style.left = left + 'px';
	// },

	// _update : function (project) {
	// 	this.update(project);
	// },

	// update : function (project) {

	// 	this._project = project;
	       
	//         // show header
	// 	// this._container.style.display = 'block';

	// 	var headerLogoPath = project.getHeaderLogo() ? project.getHeaderLogo() :  '/css/images/defaultProjectLogo.png';
	// 	this._logo.src = headerLogoPath;

	// 	// update values
	// 	this._title.innerHTML 	 = project.getHeaderTitle();
	// 	this._subtitle.innerHTML = project.getHeaderSubtitle();
	// },

	
	// reset : function () {
		
	// 	// Keep header, but remove it's content from DOM
	// 	Wu.app.HeaderPane._title.innerHTML = '';
	// 	Wu.app.HeaderPane._subtitle.innerHTML = '';
	// 	Wu.app.HeaderPane._logo.src = '';
	// },


	// save : function () {

	// 	// set current values to project
	// 	this._project.store.header.height 	= this._headerHeight;
	// 	this._project.store.header.title 	= this._title.innerHTML;
	// 	this._project.store.header.subtitle 	= this._subtitle.innerHTML;
	// 	var img = this._logo.src.slice(4).slice(0,-1);
	// 	this._project.store.header.logo 		= img;     	

	// 	// save to db
	// 	this._save();
	// },

	// _save : function () {
	// 	// save project to db
	// 	this._project._update('header');
	// },

	// setProject : function (project) {
	// 	// update header with project
	// 	this._update(project);
	// }
});
