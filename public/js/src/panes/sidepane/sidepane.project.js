Wu.SidePane.Project = Wu.Class.extend({

	initialize : function (options) {

		// set options
		Wu.setOptions(this, options);

		// set project
		this._project = options.project;

		// set this as sidepane item
		this._project.setSidepane(this);

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
		this.description = Wu.DomUtil.create('div', 'project-description', this._container);
		this.description.type = 'description';
		this.logoContainer = Wu.DomUtil.create('div', 'project-logo-container', this._container)
		this.users = Wu.DomUtil.create('div', 'project-users-wrap', this._container);
		this.usersInnerWrapper = Wu.DomUtil.create('div', 'project-users-inner-wrapper', this._container);
		this._projectStatsHeader = Wu.DomUtil.create('div', 'project-stats', this.usersInnerWrapper);
		this._projectStatsHeader.innerHTML = 'Project status:'
		this.createdBy = Wu.DomUtil.create('div', 'project-createdby', this.usersInnerWrapper);
		this.createdDate = Wu.DomUtil.create('div', 'project-createddate', this.usersInnerWrapper);
		this.lastUpdated = Wu.DomUtil.create('div', 'project-lastupdated', this.usersInnerWrapper);
		this.usersInner = Wu.DomUtil.create('div', 'project-users', this.usersInnerWrapper);

		// create logo
		this._createLogo();

		// add thumbnail generator button
		if (app.access.to.edit_project(this._project)) {
			this.makeThumb = Wu.DomUtil.create('div', 'new-project-thumb', this.usersInnerWrapper, 'Generate thumbnail');
		}

		// add delete button
		if (app.access.to.delete_project(this._project)) {
			this.kill = Wu.DomUtil.create('div', 'project-delete', this.usersInnerWrapper, 'Delete project');			
		}

		// set logo??
		this.hookThumb();

		// add hooks
		this.addHooks();
	},

	_createLogo : function () {
		if (this.logo) {
			// remove old
			Wu.DomUtil.remove(this.logo);
			this.logo = null;
			delete this.logo;
		}
		this.logo = this._resumableBrowse = Wu.DomUtil.create('img', 'project-logo', this.logoContainer);
		this.logo.type = 'logo';

		Wu.DomEvent.on(this.logo, 'click', Wu.DomEvent.stopPropagation, this);

	},

	hookThumb : function () {
		// This project ID
		this._project._sidePaneLogoContainer = this.logo;
	},

	expandUsers : function () {
		// Wu.DomUtil.addClass(this.usersInner, 'expand');
	},

	collapseUsers : function () {
		// Wu.DomUtil.removeClass(this.usersInner, 'expand');
	},

	update : function (project) {

		this._project 			= project || this._project;
		this.name.innerHTML 		= this._project.store.name;
		this.description.innerHTML 	= this._project.store.description;

		// var logoPath = this._project.store.logo ? this._project.store.logo :  '/css/images/defaultProjectLogo.png';
		this.logo.src = this._getPixelLogo();

		this.createdBy.innerHTML 	= '<div class="project-info-left">Created by:</div><div class="project-info-right">' + this._project.store.createdByName + "</div>";
		this.lastUpdated.innerHTML 	= '<div class="project-info-left">Last updated:</div><div class="project-info-right">' + Wu.Util.prettyDate(this._project.store.lastUpdated) + "</div>";
		this.createdDate.innerHTML 	= '<div class="project-info-left">Created time:</div><div class="project-info-right">' + Wu.Util.prettyDate(this._project.store.created) + "</div>";
		this.usersInner.innerHTML       = '<div class="project-users-header">Project users:</div>' + this._project.getUsersHTML();
	},

	_getPixelLogo : function () {
		var logo = this._project.getLogo();
		if (!logo) return '/css/images/defaultProjectLogo.png';
		var base = logo.split('/')[2];
		var url = '/pixels/image/' + base + '?width=90&height=60&format=png'
		return url;
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
		if (app.access.to.edit_project(this._project)) {
			Wu.DomEvent[on](this.name, 	 'dblclick', this.edit, this);
			Wu.DomEvent[on](this.description, 'dblclick', this.editDescription, this);
			Wu.DomEvent[on](this.makeThumb, 'click', this.makeNewThumbnail, this);
			Wu.DomEvent[on](this.makeThumb, 'mousedown click', Wu.DomEvent.stopPropagation, this );
		}

		// add dz to logo
		if (app.access.to.upload_file(this._project)) this._setDZ(on);

		// add kill hook
		if (app.access.to.delete_project(this._project)) {
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
			this._refreshResumable();
		} else {
			this._removeResumable();
		}
	},

	// edit hook for client logo
	// addLogoDZ : function () {
	_addResumable : function () {

		var projectUuid = this._project.getUuid();

		// create resumable object
		var r = this.r = new Resumable({
			target : '/api/project/uploadlogo',
			chunkSize : 11*1024*1024, // 11MB
			simultaneousUploads : 1,
			testChunks : false, // turn off resume on small upload
			query : {
				imageUuid : Wu.Util.guid('image'),
				projectUuid : projectUuid
			},

			// max file size (less than one chunk means only one chunk)
			maxFileSize : 10*1024*1024, // 10MB
			maxFileSizeErrorCallback : function (file, errorCount) {
				
				// feedback message
				app.feedback.setError({
					title : 'Image file is too large.',
					description : 'Please use an image file smaller than 10MB.',
				});
			},

			// max files to be uploaded at once
			maxFiles : 1,

			// accepted filetypes
			fileType : ['png', 'jpg', 'jpeg', 'gif', 'PNG', 'JPG', 'JPEG', 'GIF'],
			fileTypeErrorCallback : function (file, errorCount) {

				// feedback message
				app.feedback.setError({
					title : 'Not an accepted image format',
					description : 'Please only use PNG, JPG or GIF image formats.',
				});

			},
		});

		// assign upload button to DOM
		r.assignBrowse(this._resumableBrowse);

		// start upload on add
		r.on('fileAdded', r.upload);

		// callback on success
		r.on('fileSuccess', this.editedLogo.bind(this));

		// editable cursor on image
		Wu.DomUtil.addClass(this.logo, 'editable');

	},

	_refreshResumable : function () {

		// remove old
		if (this.r) this._removeResumable();

		// add new
		if (app.access.to.edit_project(this._project)) this._addResumable();
	},

	_removeResumable : function () {

		var r = this.r;
		r.cancel();
		this.r = null;
		delete this.r;

		// refresh logo to kill listeners
		this._createLogo();

	},

	// removeLogoDZ : function () {
	// 	// disable edit on logo

	// 	if (this.logodz) this.logodz.disable();
	// 	this.logodz.off('success', this.editedLogo.bind(this), this);
	// 	this.logodz = null;
	// 	delete this.logodz;

	// 	// set image frame without editable clas
	// 	Wu.DomUtil.removeClass(this.logo, 'editable');
	// },

	// _GAtoggleProjectInfo : function () {

	// 	// Google Analytics event trackign
	// 	app.Analytics.setGaEvent(['Side Pane', 'Clients: toggle project info']);

	// 	// Fire function
	// 	this.toggleProjectInfo();

	// },


	toggleProjectInfo : function () {

		// Get some heights
		var parentHeight = this._parent._container.offsetHeight;
		var projectInfoHeight = this.usersInnerWrapper.offsetHeight;		

		if ( !this._project._menuItem._isOpen ) {

			// Add open state to button
			Wu.DomUtil.addClass(this.users, 'active-project-user-button');

			// Set Project Height
			this._container.style.height = projectInfoHeight + 110 + 'px';

			// Set Client container height
			this._parent._container.style.height = parentHeight + projectInfoHeight + 'px';

			// Set open state
			this._project._menuItem._isOpen = true;

		} else {

			// Remove open state to button
			Wu.DomUtil.removeClass(this.users, 'active-project-user-button');

			// Set Project Height
			this._container.style.height = 111 + 'px';

			// Set Client container height
			this._parent._container.style.height = parentHeight - projectInfoHeight + 'px';

			// Set open state			
			this._project._menuItem._isOpen = false;

		}

		app.Analytics.setGaEvent(['Side Pane', 'Clients: toggle project info']);

	},


	makeNewThumbnail : function () {
		this._project = this._project || app.activeProject;

		// Set state to manually updated to prevet overriding
		this._project.setThumbCreated(true);
		this._project.createProjectThumb();

		// Google Analytics event trackign
		app.Analytics.setGaEvent(['Side Pane', 'Clients: make new thumbnail']);

	},

	editedLogo : function (resumable, path) {
		this._project = this._project || app.activeProject;

		// refresh resumable
		this._refreshResumable();

		// Set state to manually updated to prevet overriding
		this._project.setThumbCreated(true);

		// set path
		var fullpath = '/images/' + path;
		
		// set new image and save
		this._project.setLogo(fullpath);

		// update image 
		this.logo.src = this._project.getLogo();

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
		if (this._project == app.activeProject) return;         // todo: activeProject is set at beginning, even tho not active.. fix!

		Wu.Mixin.Events.fire('projectSelected', { detail : {
			projectUuid : this._project.getUuid()
		}});    

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
		app.Analytics.setGaEvent(['Side Pane', 'Clients: edit project title']);
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
		this._project.setSlug(value);

		// save latest
		this._project.setName(value);

		// save header also
		this._project.setHeaderTitle(value);

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
		app.Analytics.setGaEvent(['Side Pane', 'Clients: edit project description']);
	},

	_editDescriptionBlur : function (e) {
		
		// get value
		var value = e.target.value;

		// revert to <div>
		var div = e.target.parentNode;
		div.innerHTML = value;

		// save project description
		this._project.setDescription(value);

		// save header subtitle also
		this._project.setHeaderSubtitle(value);

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
			project : this._project.getUuid(),
			client : this._project.getClient().getUuid()
		});

		// post
		Wu.post('/api/project/unique', json, callback, this);
	},

	deleteProject : function (e) {

		// prevent project select
		Wu.DomEvent.stop(e);

		var answer = confirm('Are you sure you want to delete project ' + this._project.store.name + '?');
		if (!answer) return;

		var second = confirm('Are you REALLY sure you want to delete project ' + this._project.store.name + '? You cannot UNDO this action!');
		if (!second) return; 

		// twice confirmed, delete
		this.confirmDelete();

		// Google Analytics event trackign
		app.Analytics.setGaEvent(['Side Pane', 'Clients: delete project']);

	},

	confirmDelete : function () {

		// remove hooks
		this.removeHooks();
	
		// remove from client 
		this._parent.removeProject(this._project);
		
		// remove from DOM
		Wu.DomUtil.remove(this._container);

		// // if project is active, unload
		// if (this._project.getUuid() == app.activeProject) {

		// 	// unload
		// 	this._project.unload();
		// }

		// delete
		this._project._delete();
		this._project = null;

	},


});