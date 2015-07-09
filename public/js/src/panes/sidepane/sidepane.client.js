// subelements in clients sidepane
Wu.SidePane.Client = Wu.Class.extend({


	initialize : function (client) {

		// set client object
		this.client = app.Clients[client.uuid];

		// set edit mode
		// this.editable = app.Account.canCreateClient();
		this.editable = app.access.to.create_client();

		// init layout
		this.initLayout(); 

		// fill in 
		this.update();		

		return this;		// only added to DOM after return
	},

	initLayout : function () {

		// create container
		this._container = Wu.DomUtil.create('div', 'editor-clients-container');

		// create title
		this.title = Wu.DomUtil.create('div', 'client-title', this._container);

		// create description
		this.description = Wu.DomUtil.create('div', 'client-description', this._container);

		// create logo
		this.logoContainer = Wu.DomUtil.create('div', 'client-logo-container', this._container);
		this._createLogo();

		// create projects container
		this._projectsContainer = Wu.DomUtil.create('div', 'projects-container', this._container);
	},

	_createLogo : function () {
		if (this.logo) {
			Wu.DomUtil.remove(this.logo);
			this.logo = null;
			delete this.logo;
		}

		this.logo = this._resumableBrowse = Wu.DomUtil.create('div', 'project-logo', this.logoContainer);

		Wu.DomEvent.on(this.logo, 'mousedown', Wu.DomEvent.stopPropagation, this);
	},


	addTo : function (container) {
		
		// append
		container.appendChild(this._container);
		
		// add hooks
		this.addHooks();

		// add edit hooks
		if (this.editable) this.addEditHooks();
		
		return this;
	},

	remove : function (container) {
		Wu.DomUtil.remove(this._container);
		return this;
	},
	

	update : function () {

		// update client meta
		this.title.innerHTML = this.client.getName();
		this.description.innerHTML = this.client.getDescription();
		
		if (this._getPixelLogo()) this.logo.style.backgroundImage = 'url(' + this._getPixelLogo()+ ')';

		Wu.DomUtil.thumbAdjust(this.logo, 70);
		
		// insert client's projects
		this.insertProjects();
	},

	_getPixelLogo : function () {

		var logo = this.client.getLogo();
		if (!logo) return false;
		var base = logo.split('/')[2];
		var url = '/pixels/image/' + base + '?width=75&height=75&format=png'
		return url;
	},

	insertProjects : function (projects) {
		var client = this.client;

		this._sidepaneProjects = {};

		// get client's projects
		this.projects = _.filter(Wu.app.Projects, function (p) { return p.store.client == client.getUuid(); });

		// return if no projects, add + button 
		if (!this.projects) return this.editButtons();

		// sort by date created
		this.projects = _.sortBy(this.projects, function (l) { return l.store.lastUpdated; });  // todo: different sorts
		this.projects.reverse();								// sort descending

		// for each
		this.projects.forEach(function (project){

			// new project item view
			var sidepaneProject = new Wu.SidePane.Project({
				project : project,
				caller : this
			});
			
			// save for later
			this._sidepaneProjects[project.getUuid()] = sidepaneProject;

			// app to client
			sidepaneProject.addTo(this._projectsContainer);

		}, this);

		// add + project button
		this.editButtons();

		// calculate heights
		this.calculateHeight();

	},

	editButtons : function () {

		// remove old
		if (this._newProjectButton) Wu.DomUtil.remove(this._newProjectButton);
		if (this._removeClientButton) Wu.DomUtil.remove(this._removeClientButton);

		// create project button
		if (app.access.to.create_project()) {
			
			// create divs
			var className = 'smap-button-white new-project-button';
			this._newProjectButton = Wu.DomUtil.create('div', className, this._projectsContainer, '+');

			// events
			Wu.DomEvent.on(this._newProjectButton, 'mousedown', 	this.createNewProject, this);
			Wu.DomEvent.on(this._newProjectButton, 'mousedown', 	Wu.DomEvent.stop, this);
			Wu.DomEvent.on(this._newProjectButton, 'click', 	Wu.DomEvent.stop, this);

			// add tooltip
			app.Tooltip.add(this._newProjectButton, 'Click to create new project.');

		}
		
		// remove client button
		if (app.access.to.delete_client()) {
			this._removeClientButton = Wu.DomUtil.create('div', 'client-kill displayNone', this._container, 'Delete client');
			Wu.DomEvent.on(this._removeClientButton, 'mousedown', this.removeClient, this);
		}
	},

	removeClient : function (e) {

		// client not empty
		var p = this.projects.length;
		if (p > 0) {
			var message = 'The client ' + this.client.getName() + ' has ' + p + ' projects. ';
			if (!app.access.is.superAdmin()) {
				message += 'You must delete these individually first before deleting client.'
				return alert(message);
			}
			
			message += 'Superadmin access: Do you want to delete all projects and client?'
			var makesure = confirm(message);
			if (!makesure) return;

			// confirm
			var answer = confirm('Are you sure you want to delete all projects in client ' + this.client.getName() + '?');
			if (!answer) return;

			_.each(this._sidepaneProjects, function (sidepaneProject) {
				sidepaneProject.confirmDelete();
			}, this);

		}

		// confirm
		var answer = confirm('Are you sure you want to delete client ' + this.client.getName() + '?');
		if (!answer) return;

		// confirm again
		var second = confirm('Are you REALLY sure you want to delete client ' + this.client.getName() + '? You cannot UNDO this action!');
		if (!second) return; 

		// twice confirmed, delete
		this.confirmDeleteClient();

		// Google Analytics event trackign
		app.Analytics.setGaEvent(['Side Pane', 'Clients: delete client']);

	},

	confirmDeleteClient : function () {

		// remove from DOM
		Wu.DomUtil.remove(this._container);

		// delete client
		this.client.destroy();
	},

	_lockNewProjectButton : function () {
		Wu.DomEvent.off(this._newProjectButton, 'mousedown', this.createNewProject, this);
		Wu.DomUtil.addClass(this._newProjectButton, 'inactive');

	},

	_unlockNewProjectButton : function () {
		Wu.DomEvent.on(this._newProjectButton, 'mousedown', this.createNewProject, this);
		Wu.DomUtil.removeClass(this._newProjectButton, 'inactive');
	},

	createNewProject : function () {

		// set status and lock + button
		app.setStatus('Loading...');
		this._lockNewProjectButton();

		var position = app.options.defaults.project.position;

		// create project object
		var store = {
			name 		: 'Project title',
			description 	: 'Project description',
			// created 	: new Date().toJSON(),
			// lastUpdated 	: new Date().toJSON(),
			createdByName 	: app.Account.getName(),
			keywords 	: '',
			client 		: this.client.uuid,
			position 	: position || {},
			bounds : {
				northEast : {
					lat : 0,
					lng : 0
				},
				southWest : {
					lat : 0,
					lng : 0
				},
				minZoom : 1,
				maxZoom : 22
			},
			header : {
				height : 50
			},
			folders : []

		}

		// create new project with options, and save
		var project = new Wu.Project(store);
		project.editMode = true;
		var options = {
			store : store,
			callback : this._projectCreated,
			context : this
		}

		project._saveNew(options);

		// Google Analytics event trackign
		app.Analytics.setGaEvent(['Side Pane', 'Clients: new project']);
	},

	_markActive : function (newProject) {
		var projects = app.Projects;
		_.each(projects, function (project) {
			if (project._menuItem) project._menuItem._unmarkActive();
		});
	
		Wu.DomUtil.addClass(newProject._menuItem._container, 'active-project');
	},
	
	_unmarkActive : function () {
		Wu.DomUtil.removeClass(this._container, 'active-project');
	},	

	_projectCreated : function (project, json) {


		var result = Wu.parse(json),
		    error  = result.error,
		    store  = result.project;


		// return error
		if (error) return app.feedback.setError({
			title : 'There was an error creating new project!', 
			description : error
		});
			
		// add to global store
		app.Projects[store.uuid] = project;

		console.log('store', store);
		// update project store
		project.setNewStore(store);

		// create project in sidepane
		this._createNewProject(project);

	},

	// add project in sidepane
	_createNewProject : function (project) {


		// add project to client array
		this.projects.push(project);

		// new project item view
		var sidepaneProject = new Wu.SidePane.Project({
			project : project,
			caller : this
		});

		// add to client container
		sidepaneProject.addToBefore(this._projectsContainer);

		// refresh height
		this.open();

		// select
		sidepaneProject.select();
		sidepaneProject.update();

		// set status and unlock + button
		app.setStatus('Done!');
		this._unlockNewProjectButton();

		// remove startpane if active
		app.StartPane.deactivate();

		// add defaults to map
		this._addDefaults();

		// mark project div in sidepane as active
		this._markActive(project);

		// select
		Wu.Mixin.Events.fire('projectSelected', { detail : {
			projectUuid : project.getUuid()
		}});

	},


	_addDefaults : function () {
		if (!app.SidePane.Options) return;
		
		app.SidePane.Options.update();
		app.SidePane.Options.settings.baselayer.setDefaultLayer();
	},

	addHooks : function () {
		Wu.DomEvent.on(this._container, 'mousedown', this.toggle, this);
	},

	removeHooks : function () {
		Wu.DomEvent.off(this._container, 'mousedown', this.toggle, this);
	},

	addEditHooks : function () {
		if (!app.access.to.edit_client()) return;

		Wu.DomEvent.on(this.title, 'dblclick', this.editName, this);
		Wu.DomEvent.on(this.description, 'dblclick', this.editDescription, this);
		this._addResumable();
	},

	removeEditHooks : function () {
		if (!app.access.to.edit_client()) return;

		Wu.DomEvent.off(this.title, 'dblclick', this.editName, this);
		Wu.DomEvent.off(this.description, 'dblclick', this.editDescription, this);
		this._removeResumable();
	},


	editName : function () {

		// return if already editing
		if (this.editing) return;
		this.editing = true;
		this._validName = true;
		
		// inject <input>
		var div = this.title;
		var value = div.innerHTML;

		var input = Wu.DomUtil.create('input', 'client-edit editable');
		input.value = value;

		this._clientNameInput = input;

		div.innerHTML = ''; 
		div.appendChild(input);

		// focus
		var target = input;
		target.focus();
		target.selectionStart = target.selectionEnd;	// prevents text selection

		// save on blur or enter
		Wu.DomEvent.on( target,  'blur',    this.editedName, this );     	// save title
		Wu.DomEvent.on( target,  'keydown', this.editKeyed,  this );           // save title
		Wu.DomEvent.on( target,  'keyup', this._checkUnique,  this );           // save title

		// Google Analytics event trackign
		app.Analytics.setGaEvent(['Side Pane', 'Clients: edit client name']);


	},

	_markNotUnique : function () {
		Wu.DomUtil.addClass(this._clientNameInput, 'notunique');
		this._validName = false;
	},

	_markUnique : function () {
		Wu.DomUtil.removeClass(this._clientNameInput, 'notunique');
		this._validName = true;
	},

	_checkUnique : function (e) {
		var name = this._clientNameInput.value;

		// return ok if same name
		if (name == this.client.getName()) return this._markUnique();

		var json = JSON.stringify({
			slug : name,
			client : this.client.getUuid()
		});

		// post
		Wu.post('/api/client/unique', json, function (ctx, response) {
			var resp = Wu.parse(response);
			resp.unique ? this._markUnique() : this._markNotUnique();
		}.bind(this), this);
	},

	editedName : function (e) {

		if (!this._validName) return console.log('invalid name');
	
		// revert to <div>
		var target = e.target;
		var value = target.value;
		var div = this.title;
		div.innerHTML = value;

		// save latest
		this.client.setName(value);
		
		// remove listeners
		Wu.DomEvent.off( target,  'blur',    this.editedName, this );     	// save title
		Wu.DomEvent.off( target,  'keydown', this.editKeyed,  this );          // save title

		// mark not editing
		this.editing = false;

	},

	editKeyed : function (e) {
		if (!this._validName) return;
		
		// blur on enter
		if (event.which == 13 || event.keyCode == 13) e.target.blur();
	},

	editDescription : function () {
		// return if already editing
		if (this.editing) return;
		this.editing = true;
		
		// inject <input>
		var div = this.description;
		var value = div.innerHTML;
		div.innerHTML = '<input value="'+ value +'" class="client-edit editable ct15 ct16">';

		// focus
		var target = div.firstChild;
		target.focus();
		target.selectionStart = target.selectionEnd;	// prevents text selection

		// save on blur or enter
		Wu.DomEvent.on( target,  'blur',    this.editedDescription, this );     // save title
		Wu.DomEvent.on( target,  'keydown', this.editKeyed,   	    this );     // save title

		// Google Analytics event trackign
		app.Analytics.setGaEvent(['Side Pane', 'Clients: edit client description']);

	},

	editedDescription : function (e) {

		// revert to <div>
		var target = e.target;
		var value = target.value;
		var div = this.description;
		div.innerHTML = value;

		// save 
		this.client.setDescription(value);
		
		// remove listeners
		Wu.DomEvent.off( target,  'blur',    this.editedDescription, this );    // save title
		Wu.DomEvent.off( target,  'keydown', this.editKeyed,   	     this );    // save title

		// mark not editing
		this.editing = false;

	},

	// edit hook for client logo
	_addResumable : function () {

		var clientUuid = this.client.getUuid();

		// create resumable object
		var r = this.r = new Resumable({
			target : '/api/client/uploadlogo',
			chunkSize : 11*1024*1024, // 11MB
			simultaneousUploads : 1,
			testChunks : false, // turn off resume on small upload
			query : {
				imageUuid : Wu.Util.guid('image'),
				clientUuid : clientUuid,
				access_token : app.tokens.access_token
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
			// fileType : ['png', 'jpg', 'jpeg', 'gif'],
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
	
	// // edit hook for client logo
	// addLogoDZ : function () {

	// 	// create dz
	// 	this.logodz = new Dropzone(this.logo, {
	// 			url : '/api/client/uploadlogo',
	// 			createImageThumbnails : false,
	// 			autoDiscover : false
	// 	});
		
	// 	// set client uuid param for server
	// 	this.logodz.options.params.clientUuid = this.client.getUuid();
	// 	this.logodz.options.params.client = this.client.getUuid();
		
	// 	// set callback on successful upload
	// 	this.logodz.on('success', function (err, path) {
	// 		this.editedLogo(path);
	// 	}.bind(this));

	// 	// set image frame with editable clas
	// 	Wu.DomUtil.addClass(this.logo, 'editable');
	// },

	// removeLogoDZ : function () {
	// 	// disable edit on logo
	// 	if (this.logodz) this.logodz.disable();
	// 	delete this.logodz;

	// 	// set image frame without editable clas
	// 	Wu.DomUtil.removeClass(this.logo, 'editable');
	// },


	editedLogo : function (resubmable, path) {


		this._refreshResumable();
		
		// set path
		var fullpath = '/images/' + path;
		
		// set new image and save
		this.client.setLogo(fullpath);

		// update image in header
		// this.logo.src = fullpath;
		// this._getPixelLogo();
		this.logo.style.backgroundImage = 'url(' + this._getPixelLogo()+ ')';
	},

	pendingOpen : function () {
		if (app._timerOpenClient) clearTimeout(app._timerOpenClient);
		if (this._isOpen) return;

		app._timerOpenClient = setTimeout(function () {
			this.open();
			if (app._pendingCloseClient) app._pendingCloseClient.close();
			app._pendingCloseClient = this;
		}.bind(this), 200);	
	},

	toggle : function () {				
		this._isOpen ? this.close() : this.open();
	},

	open : function () {

		// Close open project info to prevent overflow
		this.resetOpenProjectInfo();

		this.calculateHeight();
		this._container.style.height = this.maxHeight + 'px';          
		this._isOpen = true;

		if (this._removeClientButton) Wu.DomUtil.removeClass(this._removeClientButton, 'displayNone');

		// close others
		var clients = app.SidePane.Clients;
		if (clients._lastOpened && clients._lastOpened != this) clients._lastOpened.close();
		clients._lastOpened = this;
	},

	close : function () {   				

		this.calculateHeight();
		this._container.style.height = this.minHeight + 'px';    
		this._isOpen = false;

		if (this._removeClientButton) Wu.DomUtil.addClass(this._removeClientButton, 'displayNone');

		this.resetOpenProjectInfo();
	},

	resetOpenProjectInfo : function () {

		// Set open project info state to false
		this.projects.forEach(function(project) {

			// Remove active state from button
			Wu.DomUtil.removeClass(project._menuItem.users, 'active-project-user-button');

			// Remove height from project info container
			project._menuItem._container.removeAttribute('style');

			// Set open state to false
			if (project._menuItem._isOpen) project._menuItem._isOpen = false;
		});

	},

	removeProject : function (project) {
		_.remove(this.projects, function (p) { return p.store.uuid == project.store.uuid; });
		this.calculateHeight();
		this.open();
	},

	calculateHeight : function () {
		if (!app.mobile) {
			var min = 150;
			this.maxHeight = min + _.size(this.projects) * 116;
			this.minHeight = 80;
		} else {
			var min = 78;
			this.maxHeight = min + _.size(this.projects) * 100;
			this.minHeight = 68; 
		}
	},


	
});


