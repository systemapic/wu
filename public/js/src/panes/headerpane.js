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
		this._container = Wu.app._headerPane = Wu.DomUtil.create('div', 'displayNone', Wu.app._mapContainer);
		this._container.id = 'header';

		// wrapper for header
		// this._contentWrap = Wu.DomUtil.create('div', 'header-content-wrap', this._container);
		this._logoContainer = Wu.DomUtil.create('div', 'header-logo-container', this._container);
		this._logo  = Wu.DomUtil.create('img', 'header-logo', this._logoContainer);

		this._titleWrap = Wu.DomUtil.create('div', 'header-title-wrap', this._container);
		this._title 	= Wu.DomUtil.create('div', 'header-title editable', this._titleWrap);
		this._subtitle 	= Wu.DomUtil.create('div', 'header-subtitle editable', this._titleWrap);

		// hack
		this._title.whichTitle = 'title';
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

		// this.addEditHooks();	// set edit hook hook in .Item, nice way to organize edit mode
	},

	addEditHooks : function () {

		// resizer
		// this.enableResize();

		// remove title hooks
		// Wu.DomEvent.on(this._title,    'dblclick', this._enableEdit, this);	// todo: add as optional
		// Wu.DomEvent.on(this._subtitle, 'dblclick', this._enableEdit, this);

		// enable edit on logo
		if (!this.logodz) {
			// create on first load
			this.addDropzone();
		} else {
			this.logodz.enable();
		}

		// set editable class to logo
		Wu.DomUtil.addClass(this._logo, 'editable');
	},

	removeEditHooks : function () {

		// resizer
		// this.disableResize();

		// remove title hooks
		// Wu.DomEvent.off(this._title,    'dblclick', this._enableEdit, this);
		// Wu.DomEvent.off(this._subtitle, 'dblclick', this._enableEdit, this);	

		// disable edit on logo
		if (this.logodz) this.logodz.disable();

		// remove editable class to logo
		Wu.DomUtil.removeClass(this._logo, 'editable');
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

		var project = this.project;
		
		// set new image and save
		project.setHeaderLogo(fullpath);

		// update image in header
		// this._logoWrap.style.backgroundImage = this.project.getHeaderLogoBg();

		// cxxx
		if ( project.getHeaderLogo() == '/css/images/defaultProjectLogo.png' ) { 
			headerLogoPath = '/css/images/defaultProjectLogo.png'
		} else {
			var headerLogoSliced = project.getHeaderLogo().slice(8); // remove "/images/" from string
			var headerLogoPath = '/pixels/fit/' + headerLogoSliced + '?fitW=90&fitH=71';
		}

		this._logo.src = headerLogoPath;

		Wu.DomUtil.thumbAdjust(this._logo, 90);


	},

	disableResize : function () {
		return;

		// // resizer
		// Wu.DomEvent.off(this._resizer, 'mousedown', this.resize, this);
		// Wu.DomEvent.off(this._resizer, 'mouseup', this._resized, this);

		// // set default cursor
		// Wu.DomUtil.addClass(this._resizer, 'headerResizerDisabled');
	},

	enableResize : function () {
		return;
		
		// if (!this.project.editMode) return;
		
		// // resizer
		// Wu.DomEvent.on(this._resizer, 'mousedown', this.resize, this);
		// Wu.DomEvent.on(this._resizer, 'mouseup', this._resized, this);

		// // set ns cursor
		// Wu.DomUtil.removeClass(this._resizer, 'headerResizerDisabled');
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

		
		// cxxx
		if ( project.getHeaderLogo() == '/css/images/defaultProjectLogo.png' ) { 
			headerLogoPath = '/css/images/defaultProjectLogo.png'
		} else {
			var headerLogoSliced = project.getHeaderLogo().slice(8); // remove "/images/" from string
			var headerLogoPath = '/pixels/fit/' + headerLogoSliced + '?fitW=90&fitH=71';
		}



		// update values
		this._logo.src = headerLogoPath;
		this._title.innerHTML 	 = project.getHeaderTitle();
		this._subtitle.innerHTML = project.getHeaderSubtitle();

		// Wu.DomUtil.thumbAdjust(this._logo, 90);
		
		// add edit hooks
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
		return;
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
		return;
		// header height
		this._headerHeight = newHeight;
		this._container.style.height = this._headerHeight  + 'px';
		this._container.style.maxHeight = this._headerHeight  + 'px';

		// map height
		var control = app._map._controlContainer;
		control.style.paddingTop = this._headerHeight + 'px';

		// home height
		// var home = app.SidePane.Home;
		// home.setHeight(newHeight);

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
		var img = this._logo.src.slice(4).slice(0,-1);
		this.project.store.header.logo 		= img;     	


		console.log('img', img);
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
