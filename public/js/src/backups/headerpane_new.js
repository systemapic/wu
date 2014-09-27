/*
██╗  ██╗███████╗ █████╗ ██████╗ ███████╗██████╗ 
██║  ██║██╔════╝██╔══██╗██╔══██╗██╔════╝██╔══██╗
███████║█████╗  ███████║██║  ██║█████╗  ██████╔╝
██╔══██║██╔══╝  ██╔══██║██║  ██║██╔══╝  ██╔══██╗
██║  ██║███████╗██║  ██║██████╔╝███████╗██║  ██║
╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═════╝ ╚══════╝╚═╝  ╚═╝
*/                                                
/* The header of the map - a "view" */
Wu.HeaderPane = Wu.Class.extend({

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
		this._title 	= Wu.DomUtil.create('div', 'header-title editable', this._container);
		this._subtitle 	= Wu.DomUtil.create('div', 'header-subtitle editable', this._container);
		this._resizer 	= Wu.DomUtil.createId('div', 'headerResizer', this._container);

		// settings
		this._title.setAttribute('readonly', 'readonly');
		this._subtitle.setAttribute('readonly', 'readonly');

		// set hooks
		this.addHooks();
		
	},

	addHooks : function () {

		this.addEditHooks();	// set edit hook hook in .Item, nice way to organize edit mode
	},

	addEditHooks : function () {

		// resizer
		this.enableResize();

		// enable edit on header sub/title
		Wu.DomEvent.on(this._title, 'dblclick', function (e) { 
			this._enableEdit(e, 'title'); 
		}, this); 
		Wu.DomEvent.on(this._subtitle, 'dblclick', function (e) { 
			this._enableEdit(e, 'subtitle'); 
		}, this); 

		// enable edit on image
		this.addDropzone();
	},

	addDropzone : function () {
		
		// create dz
		this.logodz = new Dropzone(this._logo, {
				url : '/api/project/uploadLogo',
				createImageThumbnails : false,
				autoDiscover : false
				// uploadMultiple : true
		});

		//this.refreshDropzone();

	},

	refreshDropzone : function () {
		var that = this;
		this.logodz.options.params.project = this._project.uuid;
		this.logodz.on('success', function (err, path) {
			that.addedLogo(path);
		});
	},

	addedLogo : function (path) {
		var fullpath = '/images/' + path;
		
		// set new image and save
		this._project.logo = fullpath;
		this._project._update('logo');

		// update image in header
		this._logo.src = fullpath;

		// update image in project list
		Wu.app.SidePane.Projects.refresh();
	},

	disableResize : function () {
		// resizer
		Wu.DomEvent.off(this._resizer, 'mousedown', this.resize, this);
		Wu.DomEvent.off(this._resizer, 'mouseup', this._resized, this);

		// set default cursor
		Wu.DomUtil.addClass(this._resizer, 'headerResizerDisabled');
	},

	enableResize : function () {
		// resizer
		Wu.DomEvent.on(this._resizer, 'mousedown', this.resize, this);
		Wu.DomEvent.on(this._resizer, 'mouseup', this._resized, this);

		// set ns cursor
		Wu.DomUtil.removeClass(this._resizer, 'headerResizerDisabled');
	},

	
	_enableEdit : function (e, which) {

		// rename div 
		var div   = e.target;
		var value = e.target.innerHTML;

		if (!which) return;
		if (which == 'title') 	 var input = ich.injectHeaderTitleInput({ value : value });
		if (which == 'subtitle') var input = ich.injectHeaderSubtitleInput({ value : value });
		
		// inject <input>
		div.innerHTML = input;

		// focus
		var target = div.firstChild;
		target.focus();
		target.selectionStart = target.selectionEnd;	// prevents text selection

		// save on blur or enter
		Wu.DomEvent.on( target,  'blur', this._editBlur, this );     // save folder title
		Wu.DomEvent.on( target,  'keydown', this._editKey, this );     // save folder title

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

		this._project = project;
		var header = project.header;
	       
		this._container.style.display = 'block';

		// update values
		this._logo.src = project.logo;
		this._title.innerHTML = header.title;
		this._subtitle.innerHTML = header.subtitle;

		// set height
		this._headerHeight = parseInt(header.height);
		this._container.style.height = this._headerHeight  + 'px';
		this._container.style.maxHeight = this._headerHeight  + 'px';    

		this.refreshDropzone();
	},

	reset : function () {
		this._container.style.display = 'none';
	},

	_resetView : function () {
	       // this._container.innerHTML = '';
	},

	resize : function () {
		// this._resizer.style.backgroundColor = 'rgba(103, 120, 163, 0.57)';
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

		this._headerHeight = newHeight;
		
		// header height
		this._container.style.height = this._headerHeight  + 'px';
		this._container.style.maxHeight = this._headerHeight  + 'px';

		// map height
		var control = Wu.app._map._controlContainer;
		control.style.paddingTop = this._headerHeight + 'px';

	},

	_resized : function () {

		// reset
		this._resizer.style.backgroundColor = '';
		window.onmousemove = null;

		// save to db
		this.save();   

		// refresh map
		Wu.app._map.invalidateSize();
	},

	save : function () {

		// set current values to project
		this._project.header.height 	= this._headerHeight;
		this._project.header.title 	= this._title.innerHTML;
		this._project.header.subtitle 	= this._subtitle.innerHTML;
		this._project.header.logo 	= this._logo.src;     // todo?
								// + todo: css 
		// save to db
		this._save();
	},

	_save : function () {
		// save project to db
		this._project._update('header');
	},

	setProject : function (project) {
		// update header with project
		this._update(project);
	}
});