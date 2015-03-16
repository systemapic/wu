// Subelements under Clients/Client
// app.SidePane.Clients.clients[x].projects
Wu.SidePane.Project = Wu.Class.extend({

	initialize : function (options) {

		// set options
		Wu.setOptions(this, options);

		// set project
		this.project = options.project;

		// set edit mode
		this.project.setEditMode();

		// set this as sidepane item
		this.project.setSidepane(this);

		// set parent
		this._parent = this.options.caller; // client div container

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
		this.logoContainer = Wu.DomUtil.create('div', 'project-logo-container', this._container)
		this.logo = Wu.DomUtil.create('img', 'project-logo', this.logoContainer);
		this.logo.type = 'logo';

		// Project info box (with little "i")
		this.users = Wu.DomUtil.create('div', 'project-users-wrap', this._container);

		// this.usersInnerWrapper = Wu.DomUtil.create('div', 'project-users-inner-wrapper', this.users);
		this.usersInnerWrapper = Wu.DomUtil.create('div', 'project-users-inner-wrapper', this._container);

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
		// var canDelete = app.Account.canDeleteProject(this.project.store.uuid);
		var canDelete = app.access.to.delete_project(this.project);

		if (canDelete || this.options.editMode) {
			this.makeThumb = Wu.DomUtil.create('div', 'new-project-thumb', this.usersInnerWrapper, 'Generate thumbnail');
			this.kill = Wu.DomUtil.create('div', 'project-delete', this.usersInnerWrapper, 'Delete project');			
		}

		// set logo??
		this.hookThumb();

		// add hooks
		this.addHooks();

	},

	hookThumb : function () {
		// This project ID
		this.project._sidePaneLogoContainer = this.logo;
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

		var logoPath = this.project.store.logo ? this.project.store.logo :  '/css/images/defaultProjectLogo.png';
		this.logo.src = logoPath;

		this.createdBy.innerHTML 	= '<div class="project-info-left">Created by:</div><div class="project-info-right">' + this.project.store.createdByName + "</div>";
		this.lastUpdated.innerHTML 	= '<div class="project-info-left">Last updated:</div><div class="project-info-right">' + Wu.Util.prettyDate(this.project.store.lastUpdated) + "</div>";
		this.createdDate.innerHTML 	= '<div class="project-info-left">Created time:</div><div class="project-info-right">' + Wu.Util.prettyDate(this.project.store.created) + "</div>";
		this.usersInner.innerHTML       = '<div class="project-users-header">Project users:</div>' + this.project.getUsersHTML();
	},

	_setHooks : function (on) {

		// select, stop
		Wu.DomEvent[on](this._container, 'click',      this.select, this);
		Wu.DomEvent[on](this._container, 'mousedown',  Wu.DomEvent.stopPropagation, this);	// to prevent closing of project pane
	
		// Toggle project info box
		Wu.DomEvent[on](this.users, 'mousedown', this.toggleProjectInfo, this);
		Wu.DomEvent[on](this.users, 'click mousedown', Wu.DomEvent.stopPropagation, this);

		// edit hooks
		// editing hooks
		if (app.access.to.edit_project(this.project)) {
			Wu.DomEvent[on](this.name, 	 'dblclick', this.edit, this);
			Wu.DomEvent[on](this.description, 'dblclick', this.editDescription, this);
			Wu.DomEvent[on](this.makeThumb, 'click', this.makeNewThumbnail, this );
			Wu.DomEvent[on](this.makeThumb, 'mousedown click', Wu.DomEvent.stopPropagation, this );
		}

		// add dz to logo
		if (app.access.to.upload_file(this.project)) this._setDZ(on);

		// add kill hook
		if (app.access.to.delete_project(this.project)) {
			Wu.DomEvent[on](this.kill, 'click', this.deleteProject, this);
			
		}

	},


	addHooks : function () {
		this._setHooks('on');
	},

	removeHooks : function () {
		this._setHooks('off');
	},


	_setDZ : function (on) {
		if (on == 'on') {
			this.addLogoDZ();
		} else {
			this.removeLogoDZ();
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
		this.logodz.options.params.projectUuid = this.project.getUuid();
		this.logodz.options.params.project = this.project.getUuid();

		// set callback on successful upload
		this.logodz.on('success', this.editedLogo.bind(this), this);

		// set image frame with editable clas
		Wu.DomUtil.addClass(this.logo, 'editable');

	},

	removeLogoDZ : function () {
		// disable edit on logo
		console.log('remLog DXZ');

		if (this.logodz) this.logodz.disable();
		this.logodz.off('success', this.editedLogo.bind(this), this);
		this.logodz = null;
		delete this.logodz;

		// set image frame without editable clas
		Wu.DomUtil.removeClass(this.logo, 'editable');
	},



	toggleProjectInfo : function () {

		// Get some heights
		var parentHeight = this._parent._container.offsetHeight;
		var projectInfoHeight = this.usersInnerWrapper.offsetHeight;		

		if ( !this.project._menuItem._isOpen ) {

			// Add open state to button
			Wu.DomUtil.addClass(this.users, 'active-project-user-button');

			// Set Project Height
			this._container.style.height = projectInfoHeight + 110 + 'px';

			// Set Client container height
			this._parent._container.style.height = parentHeight + projectInfoHeight + 'px';

			// Set open state
			this.project._menuItem._isOpen = true;

		} else {

			// Remove open state to button
			Wu.DomUtil.removeClass(this.users, 'active-project-user-button');

			// Set Project Height
			this._container.style.height = 111 + 'px';

			// Set Client container height
			this._parent._container.style.height = parentHeight - projectInfoHeight + 'px';

			// Set open state			
			this.project._menuItem._isOpen = false;

		}

		// Google Analytics event trackign
		app.Analytics.ga(['Side Pane', 'Clients: toggle project info']);



	},

	makeNewThumbnail : function () {
		this.project = this.project || app.activeProject;

		// Set state to manually updated to prevet overriding
		this.project.setThumbCreated(true);
		this.project.createProjectThumb();

		// Google Analytics event trackign
		app.Analytics.ga(['Side Pane', 'Clients: make new thumbnail']);

	},

	editedLogo : function (err, path) {
		this.project = this.project || app.activeProject;

		// Set state to manually updated to prevet overriding
		this.project.setThumbCreated(true);

		// set path
		var fullpath = '/images/' + path;
		
		// set new image and save
		this.project.setLogo(fullpath);

		// update image 
		this.logo.src = this.project.getLogo();

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
		this.users.style.opacity = 1;
	},

	closeInfo : function () {
		this.users.style.opacity = 0;
	},

	select : function (e) {

		// dont select if already active
		if (this.project == app.activeProject) return;         // todo: activeProject is set at beginning, even tho not active.. fix!

		// Google Analytics
		var _prodID = this.project.getUuid();
		app.Analytics.setGaProject(_prodID);	

		// select project
		this.project.select();		

		// remove startpane if active
		app.StartPane.deactivate();
	},

	// add class to mark project active in sidepane
	_markActive : function () {
		var projects = app.Projects;
		for (p in projects) {
			var project = projects[p];
			if (project._menuItem) project._menuItem._unmarkActive();
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

		// var input = ich.injectProjectEditInput({value:value});
		var input = Wu.DomUtil.create('input', 'project-edit editable');
		input.value = value;
		input.setAttribute('maxLength', '30');

		div.innerHTML = '';
		div.appendChild(input);

		// focus
		var target = input;
		target.focus();
		target.selectionStart = target.selectionEnd;	// prevents text selection

		// save on blur or enter
		Wu.DomEvent.on( target,  'blur',    this._editNameBlur, this );     // save folder title
		Wu.DomEvent.on( target,  'keyup', this._editKeyName,  this );       // save folder title


		// Google Analytics event trackign
		app.Analytics.ga(['Side Pane', 'Clients: edit project title']);
	},

	_editNameBlur : function (e) {

		// get value
		var value = e.target.value;

		// if not valid slug, add salt
		if (!this._valid) value += '_2';

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


		// Google Analytics event trackign
		app.Analytics.ga(['Side Pane', 'Clients: edit project description']);
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

	_editKeyName : function (e) {
		// blur on enter
		if (event.which == 13 || event.keyCode == 13) e.target.blur();

		var value = e.target.value,
		    that = this;

		// sanitize value: remove white space
		value = value.replace(/\s+/g, '');

		// check unique slug         // callback	
		this._checkUniqueSlug(value, function (ctx, json) {
			var result = JSON.parse(json);
			!result.unique ? that._notUnique(e.target) : that._unique(e.target);
		});
	},

	_unique : function (div) {
		this._valid = true;
		Wu.DomUtil.removeClass(div, 'invalid');
	},

	_notUnique : function (div) {
		this._valid = false;

		Wu.DomUtil.addClass(div, 'invalid');
	},

	_checkUniqueSlug : function (value, callback) {

		var json = JSON.stringify({
			value : value,
			project : this.project.getUuid(),
			client : this.project.getClient().getUuid()
		});

		// post
		Wu.post('/api/project/unique', json, callback, this);
	},

	deleteProject : function (e) {

		// prevent project select
		Wu.DomEvent.stop(e);

		var answer = confirm('Are you sure you want to delete project ' + this.project.store.name + '?');
		if (!answer) return;

		var second = confirm('Are you REALLY sure you want to delete project ' + this.project.store.name + '? You cannot UNDO this action!');
		if (!second) return; 

		// twice confirmed, delete
		this.confirmDelete();

		// Google Analytics event trackign
		app.Analytics.ga(['Side Pane', 'Clients: delete project']);

	},

	confirmDelete : function () {

		// remove hooks
		this.removeHooks();
	
		// remove from client 
		this._parent.removeProject(this.project);
		
		// remove from DOM
		Wu.DomUtil.remove(this._container);

		// if project is active, unload
		if (this.project == app.activeProject) {

			// unload
			this.project.unload();
		
		}

		// delete
		this.project._delete();
		delete this;
	}


});