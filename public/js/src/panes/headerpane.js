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
		this._container = Wu.app._headerPane = Wu.DomUtil.createId('div', 'header', Wu.app._mapContainer);
		this._logoWrap  = Wu.DomUtil.create('div', 'header-logo', this._container);
		this._logo 	= Wu.DomUtil.create('img', 'header-logo-img', this._logoWrap);
		this._titleWrap = Wu.DomUtil.create('div', 'header-title-wrap', this._container);
		this._title 	= Wu.DomUtil.create('div', 'header-title editable', this._titleWrap);
		this._subtitle 	= Wu.DomUtil.create('div', 'header-subtitle editable', this._titleWrap);
		this._resizer 	= Wu.DomUtil.createId('div', 'headerResizer', this._container);

		// set
		this._title.whichTitle = 'title';
		this._subtitle.whichTitle = 'subtitle';

	},

	addHooks : function () {

		// this.addEditHooks();	// set edit hook hook in .Item, nice way to organize edit mode
	},

	addEditHooks : function () {

		// resizer
		this.enableResize();

		// remove title hooks
		Wu.DomEvent.on(this._title,    'dblclick', this._enableEdit, this);
		Wu.DomEvent.on(this._subtitle, 'dblclick', this._enableEdit, this);

		// enable edit on logo
		if (!this.logodz) {
			// create on first load
			this.addDropzone();
		} else {
			this.logodz.enable();
		}

		// set editable class to logo
		Wu.DomUtil.addClass(this._logoWrap, 'editable');
	},

	removeEditHooks : function () {

		// resizer
		this.disableResize();

		// remove title hooks
		Wu.DomEvent.off(this._title,    'dblclick', this._enableEdit, this);
		Wu.DomEvent.off(this._subtitle, 'dblclick', this._enableEdit, this);

		// disable edit on logo
		if (this.logodz) this.logodz.disable();

		// remove editable class to logo
		Wu.DomUtil.removeClass(this._logoWrap, 'editable');
	},

	addDropzone : function () {

		// create dz
		this.logodz = new Dropzone(this._logo, {
				url : '/api/upload/image',
				createImageThumbnails : false,
				autoDiscover : false
		});
	},

	refreshDropzone : function () {
		var that = this;
		this.logodz.options.params.project = this.project.store.uuid;
		this.logodz.on('success', function (err, path) {
			that.addedLogo(path);
		});
	},

	addedLogo : function (path) {
		
		// set path
		var fullpath = '/images/' + path;
		
		// set new image and save
		this.project.setHeaderLogo(fullpath);

		// update image in header
		this._logo.src = this.project.getHeaderLogo();

	},

	disableResize : function () {
		// resizer
		Wu.DomEvent.off(this._resizer, 'mousedown', this.resize, this);
		Wu.DomEvent.off(this._resizer, 'mouseup', this._resized, this);

		// set default cursor
		Wu.DomUtil.addClass(this._resizer, 'headerResizerDisabled');
	},

	enableResize : function () {

		if (!this.project.editMode) return;
		
		// resizer
		Wu.DomEvent.on(this._resizer, 'mousedown', this.resize, this);
		Wu.DomEvent.on(this._resizer, 'mouseup', this._resized, this);

		// set ns cursor
		Wu.DomUtil.removeClass(this._resizer, 'headerResizerDisabled');
	},

	
	_enableEdit : function (e, whichTitle) {
	
		// rename div 
		var div   	= e.target;
		var value 	= e.target.innerHTML;
		var whichTitle 	= e.target.whichTitle;

		if (!whichTitle) return;
		if (whichTitle == 'title')	var input = ich.injectHeaderTitleInput({ value : value });
		if (whichTitle == 'subtitle')   var input = ich.injectHeaderSubtitleInput({ value : value });

		// inject <input>
		div.innerHTML = input;

		// focus
		var target = div.firstChild;
		target.focus();
		target.selectionStart = target.selectionEnd;	// prevents text selection

		// save on blur or enter
		Wu.DomEvent.on( target,  'blur',    this._editBlur, this );     // save folder title
		Wu.DomEvent.on( target,  'keydown', this._editKey,  this );     // save folder title

	},

	_editBlur : function (e) {

		// get value
		var value = e.target.value;

		// revert to <div>
		var div = e.target.parentNode;
		div.innerHTML = value;

		// save latest
		this.save();
	},

	_editKey : function (e) {
		// blur on enter
		if (event.which == 13 || event.keyCode == 13) e.target.blur();
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

		// update values
		this._logo.src 		 = project.getHeaderLogo();
		this._title.innerHTML 	 = project.getHeaderTitle();
		this._subtitle.innerHTML = project.getHeaderSubtitle();

		// set height
		this._headerHeight = project.getHeaderHeight(); // parseInt(header.height);
		this._container.style.height = this._headerHeight  + 'px';
		this._container.style.maxHeight = this._headerHeight  + 'px';    

		// add edit hooks
		console.log('this editmode!???', project.editMode);
		if (project.editMode) {
			this.addEditHooks();
			this.refreshDropzone();
		} else {
			this.removeEditHooks();
		}
	},

	getHeight : function () {
		return this._headerHeight;
	},

	reset : function () {
		// hide header
		this._container.style.display = 'none';
	},

	_resetView : function () {

	},

	resize : function () {
		var that = this;

		window.onmouseup = function (e) {
			that._resized();
			window.onmouseup = null;
		}

		window.onmousemove = function (e) {
			// resize header and map pane
			that._resize(e.y);
		}
	},

	_resize : function (newHeight) {
	
		// header height
		this._headerHeight = newHeight;
		this._container.style.height = this._headerHeight  + 'px';
		this._container.style.maxHeight = this._headerHeight  + 'px';

		// map height
		var control = app._map._controlContainer;
		control.style.paddingTop = this._headerHeight + 'px';

		// home height
		var home = app.SidePane.Home;
		home.setHeight(newHeight);

		// set height sidepane
		var sidepane = app.SidePane;
		sidepane.setHeight(newHeight);

	},

	_resized : function () {

		// reset
		this._resizer.style.backgroundColor = '';
		window.onmousemove = null;

		// save to db
		this.save();   

		// refresh map
		setTimeout(function() {
			var map = Wu.app._map;
			if (map) map.reframe();
		}, 300); // time with css
	},

	save : function () {

		// set current values to project
		this.project.store.header.height 	= this._headerHeight;
		this.project.store.header.title 	= this._title.innerHTML;
		this.project.store.header.subtitle 	= this._subtitle.innerHTML;
		this.project.store.header.logo 		= this._logo.src;     	

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
