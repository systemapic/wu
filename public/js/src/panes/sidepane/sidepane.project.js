// Subelements under Clients/Client
Wu.SidePane.Project = Wu.Class.extend({

	initialize : function (project, options) {

		// set options
		Wu.setOptions(this, options);

		// set project
		this.project = project;

		// set edit mode
		this.project.setEditMode();

		// set this as sidepane item
		this.project.setSidepane(this);

		// set parent
		this._parent = this.options.parent; // client div container

		// init layout
		this.initLayout(); 
		
		// update content
		this.update();

		return this;
	},

	initLayout : function () {

		// create container
		this._container = Wu.DomUtil.create('div', 'project-item');

		// create title
		this.name = Wu.DomUtil.create('div', 'project-title', this._container);
		this.name.type = 'name';

		// create description
		this.description = Wu.DomUtil.create('div', 'project-description', this._container);
		this.description.type = 'description';

		// create logo
		this.logo = Wu.DomUtil.create('div', 'project-logo', this._container);
		this.logo.type = 'logo';

		// create users
		this.users = Wu.DomUtil.create('div', 'project-users-wrap', this._container);
		this.usersInnerWrapper = Wu.DomUtil.create('div', 'project-users-inner-wrapper', this.users);

		// Project stats header
		this.projectStatsHeader = Wu.DomUtil.create('div', 'project-stats', this.usersInnerWrapper);
		this.projectStatsHeader.innerHTML = 'Project status:'

		// create createdBy
		this.createdBy = Wu.DomUtil.create('div', 'project-createdby', this.usersInnerWrapper);

		// create createdDate
		this.createdDate = Wu.DomUtil.create('div', 'project-createddate', this.usersInnerWrapper);

		// create lastModified
		this.lastUpdated = Wu.DomUtil.create('div', 'project-lastupdated', this.usersInnerWrapper);

		this.usersInner = Wu.DomUtil.create('div', 'project-users', this.usersInnerWrapper);

		// add delete button
		if (app.Account.canDeleteProject(this.project.store.uuid) || this.options.editMode) {
			this.kill = Wu.DomUtil.create('div', 'project-delete', this.usersInnerWrapper, 'Delete project');
		}

		// add hooks
		this.addHooks();

	},

	expandUsers : function () {
		// Wu.DomUtil.addClass(this.usersInner, 'expand');
	},

	collapseUsers : function () {
		// Wu.DomUtil.removeClass(this.usersInner, 'expand');
	},

	update : function (project) {
		this.project 			= project || this.project;
		this.name.innerHTML 		= this.project.store.name;
		this.description.innerHTML 	= this.project.store.description;
		this.logo.style.backgroundImage = "url('" + this.project.store.logo + "')";
		this.createdBy.innerHTML 	= '<div class="project-info-left">Created by:</div><div class="project-info-right">' + this.project.store.createdByName + "</div>";
		this.lastUpdated.innerHTML 	= '<div class="project-info-left">Last updated:</div><div class="project-info-right">' + Wu.Util.prettyDate(this.project.store.lastUpdated) + "</div>";
		this.createdDate.innerHTML 	= '<div class="project-info-left">Created time:</div><div class="project-info-right">' + Wu.Util.prettyDate(this.project.store.created) + "</div>";
		this.usersInner.innerHTML       = '<div class="project-users-header">Project users:</div>' + this.project.getUsersHTML();
	},

	addHooks : function () {
		// Wu.DomEvent.on(this._container, 'mouseenter', this.open, this);
		// Wu.DomEvent.on(this._container, 'mouseleave', this.close, this);
		// Wu.DomEvent.on(this.users, 'mousedown', this.toggleInfo, this);
		Wu.DomEvent.on(this._container, 'click',      this.select, this);
		Wu.DomEvent.on(this._container, 'mousedown',  Wu.DomEvent.stopPropagation, this);	// to prevent closing of project pane
	
		// add edit hooks
		if (this.project.editMode) this.addEditHooks();
	},

	removeHooks : function () {
		// Wu.DomEvent.off(this._container, 'mouseenter', this.open, this);
		// Wu.DomEvent.off(this._container, 'mouseleave', this.close, this);
		Wu.DomEvent.off(this._container, 'click', this.select, this);
		Wu.DomEvent.off( this._container, 'mousedown', Wu.DomEvent.stopPropagation, this);

		// remove edit hooks
		if (this.project.editMode) this.removeEditHooks();
	},

	addEditHooks : function () {

		if (!this.project.editMode) return;

		// editing hooks
		Wu.DomEvent.on(this.name, 	 'dblclick', this.edit, this);
		Wu.DomEvent.on(this.description, 'dblclick', this.editDescription, this);

		// add dz to logo
		this.addLogoDZ();

		// add kill hook
		if (app.Account.canDeleteProject(this.project.getUuid())) {
			Wu.DomEvent.on(this.kill, 'click', this.deleteProject, this);
		}
	},

	removeEditHooks : function () {

		// editing hooks
		Wu.DomEvent.off(this.name, 	  'dblclick', this.edit, this);
		Wu.DomEvent.off(this.description, 'dblclick', this.editDescription, this);

		// remove dz
		this.removeLogoDZ();

		// remove kill hook
		if (app.Account.canDeleteProject(this.project.getUuid())) {
			Wu.DomEvent.off(this.kill, 'click', this.deleteProject, this);
		}
	},

	// edit hook for client logo
	addLogoDZ : function () {

		// create dz
		this.logodz = new Dropzone(this.logo, {
				url : '/api/project/uploadlogo',
				createImageThumbnails : false,
				autoDiscover : false
		});
		
		// set client uuid param for server
		this.logodz.options.params.project = this.project.getUuid();
		
		// set callback on successful upload
		var that = this;
		this.logodz.on('success', function (err, path) {
			that.editedLogo(path);
		});

		// set image frame with editable clas
		Wu.DomUtil.addClass(this.logo, 'editable');

	},

	removeLogoDZ : function () {
		// disable edit on logo
		if (this.logodz) this.logodz.disable();
		delete this.logodz;

		// set image frame without editable clas
		Wu.DomUtil.removeClass(this.logo, 'editable');
	},


	editedLogo : function (path) {

		// set path
		var fullpath = '/images/' + path;
		
		// set new image and save
		this.project.setLogo(fullpath);

		// update image 
		this.logo.style.backgroundImage = "url('" + this.project.getLogo() + "')";

		// update header
		app.HeaderPane.addedLogo(path);
	},

	addTo : function (container) {
		container.appendChild(this._container);
		return this;
	},

	addToBefore : function (container) {
		// insert second to last
		var last = container.lastChild;
		container.insertBefore(this._container, last);
	},

	remove : function (container) {
		Wu.DomUtil.remove(this._container);
		return this;
	},

	open : function () {
		// if (this._parent) this._parent._container.style.overflow = 'visible';
	},

	close : function () {
		// if (this._parent) this._parent._container.style.overflow = 'hidden';
	},

	openInfo : function () {
		console.log('openInfo');
		this.users.style.opacity = 1;
	},

	closeInfo : function () {
		this.users.style.opacity = 0;
	},

	select : function (e) {

		// dont select if already active
		if (this.project == app.activeProject) return;         // todo: activeProject is set at beginning, even tho not active.. fix!

		// select project
		this.project.select();

		// update sidepane
		Wu.app.SidePane.refreshProject(this.project);

	},

	// add class to mark project active in sidepane
	_markActive : function () {
		var projects = app.Projects;
		for (p in projects) {
			var project = projects[p];
			project._menuItem._unmarkActive();
		}
		Wu.DomUtil.addClass(this._container, 'active-project');
	},
	
	_unmarkActive : function () {
		Wu.DomUtil.removeClass(this._container, 'active-project');
	},

	// edit title
	edit : function (e) {
		
		// return if already editing
		if (this.editing) return;
		this.editing = true;

		var div = e.target;
		var type = div.type;
		var value = div.innerHTML;

		var input = ich.injectProjectEditInput({value:value});
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

		// if name, change slug also
		this.project.setSlug(value);

		// save latest
		this.project.setName(value);

		// save header also
		this.project.setHeaderTitle(value);

		// update header view
		app.HeaderPane.setTitle(value);

		this.editing = false;

	},

	editDescription : function (e) {
		
		// return if already editing
		if (this.editing) return;
		this.editing = true;

		var div = e.target;
		var type = div.type;
		var value = div.innerHTML;

		div.innerHTML = '';
		var input = Wu.DomUtil.create('textarea', 'project-edit-textarea', div);
		input.innerHTML = value;

		// focus
		var target = input;
		target.focus();
		target.selectionStart = target.selectionEnd;	// prevents text selection

		// save on blur or enter
		Wu.DomEvent.on( target,  'blur',    this._editDescriptionBlur, this );     // save folder title
		Wu.DomEvent.on( target,  'keydown', this._editKey,  this );     // save folder title

	},

	_editDescriptionBlur : function (e) {
		
		// get value
		var value = e.target.value;

		// revert to <div>
		var div = e.target.parentNode;
		div.innerHTML = value;

		// save project description
		this.project.setDescription(value);

		// save header subtitle also
		this.project.setHeaderSubtitle(value);

		// update header view
		app.HeaderPane.setSubtitle(value);

		// mark done
		this.editing = false;

	},

	_editKey : function (e) {
		// blur on enter
		if (event.which == 13 || event.keyCode == 13) e.target.blur();
	},

	deleteProject : function (e) {

		// prevent project select
		Wu.DomEvent.stop(e);

		// todo: add extra access checks? no better security really... 

		var answer = confirm('Are you sure you want to delete project ' + this.project.store.name + '?');
		if (!answer) return;

		var second = confirm('Are you REALLY sure you want to delete project ' + this.project.store.name + '? You cannot UNDO this action!');
		if (!second) return; 

		// twice confirmed, delete
		this.confirmDelete();

	},

	confirmDelete : function () {

		// remove hooks
		this.removeHooks();
	
		// unload project // todo: doesn't work!
		if (this.project.selected) this.project.unload();
	
		// remove from client 
		this._parent.removeProject(this.project);
		
		// remove from DOM
		Wu.DomUtil.remove(this._container);

		// activate startpane
		app.StartPane.activate();

		// close statuspane
		app.StatusPane.close()

		// delete
		this.project._delete();
		delete this;
	}



});

