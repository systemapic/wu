// subelements in clients sidepane
Wu.SidePane.Client = Wu.Class.extend({


	initialize : function (client) {

		// set client object
		this.client = app.Clients[client.uuid];

		// set edit mode
		this.editable = app.Account.canCreateClient();

		// init layout
		this.initLayout(); 

		// fill in 
		this.update();		

		return this;		// only added to DOM after return
	},

	initLayout : function () {

		// create container
		this._container = Wu.DomUtil.create('div', 'editor-clients-container ct0');

		// create title
		this.title = Wu.DomUtil.create('div', 'client-title', this._container);

		// create description
		this.description = Wu.DomUtil.create('div', 'client-description', this._container);

		// create logo
		this.logo = Wu.DomUtil.create('img', 'client-logo', this._container);

		// create projects container
		this._projectsContainer = Wu.DomUtil.create('div', 'projects-container', this._container);

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
		this.title.innerHTML 	    = this.client.getName();
		this.description.innerHTML  = this.client.getDescription();
		this.logo.setAttribute('src', this.client.getLogo());
		
		// insert client's projects
		this.insertProjects();

	},

	insertProjects : function (projects) {
		var client = this.client;

		// get client's projects
		this.projects = _.filter(Wu.app.Projects, function (p) { return p.store.client == client.getUuid(); });

		// return if no projects, add + button 
		if (!this.projects) return this.editButtons();

		// sort by date created
		this.projects = _.sortBy(this.projects, function (l) { return l.store.lastUpdated; });  // todo: different sorts
		this.projects.reverse();								// sort descending

		// for each
		this.projects.forEach(function (p){

			// new project item view
			var options = {
				parent : this
			}
			var projectDiv = new Wu.SidePane.Project(p, options);

			// app to client
			projectDiv.addTo(this._projectsContainer);

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
		if (app.Account.canCreateProject()) {
			var className = 'smap-button-white new-project-button ct11 ct16 ct18';
			this._newProjectButton = Wu.DomUtil.create('div', className, this._projectsContainer, '+');
			Wu.DomEvent.on(this._newProjectButton, 'mousedown', this.createNewProject, this);
			Wu.DomEvent.on(this._newProjectButton, 'mousedown', Wu.DomEvent.stop, this);
			Wu.DomEvent.on(this._newProjectButton, 'click', Wu.DomEvent.stop, this);


			// add tooltip
			app.Tooltip.add(this._newProjectButton, 'Click to create new project.');

		}
		
		// remove client button
		if (app.Account.canDeleteClient(this.client.uuid)) {
			this._removeClientButton = Wu.DomUtil.create('div', 'client-kill', this._container, 'Delete client');
			Wu.DomEvent.on(this._removeClientButton, 'mousedown', this.removeClient, this);

		}

	},

	removeClient : function (e) {

		// client not empty
		var p = this.projects.length;
		if (p > 0) return alert('The client ' + this.client.getName() + ' has ' + p + ' projects. You must delete these individually first before deleting client.');
		
		// confirm
		var answer = confirm('Are you sure you want to delete client ' + this.client.getName() + '?');
		if (!answer) return;

		// confirm again
		var second = confirm('Are you REALLY sure you want to delete client ' + this.client.getName() + '? You cannot UNDO this action!');
		if (!second) return; 

		// twice confirmed, delete
		this.confirmDeleteClient();

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

		// create project object
		var store = {
			name 		: 'Project title',
			description 	: 'Project description',
			created 	: new Date().toJSON(),
			lastUpdated 	: new Date().toJSON(),
			createdByName 	: app.Account.getName(),
			keywords 	: '',
			client 		: this.client.uuid,
			position 	: {},
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
		var options = {
			store : store
		}


		// create new project with options, and save
		var project = new Wu.Project(store);
		project.editMode = true;
		var callback = {
			callback : this._projectCreated,
			context : this
		}
		project._saveNew(callback); 
		
	},

	_projectCreated : function (project, json) {

		var result = JSON.parse(json);
		var error  = result.error;
		var store  = result.project;

		// return error
		if (error) return console.log('there was an error creating new project!', error);			

		// add to global store
		app.Projects[store.uuid] = project;

		// update project store
		project.setNewStore(store);

		// add to access locally
		project.addAccess();

		// create project in sidepane
		this._createNewProject(project);

	},

	// add project in sidepane
	_createNewProject : function (project) {

		// add project to client array
		this.projects.push(project);

		// new project item view
		var sidepaneProject = new Wu.SidePane.Project(project, {
			parent : this
		});

		// add to client container
		sidepaneProject.addToBefore(this._projectsContainer);

		// refresh height
		this.open();

		// select
		sidepaneProject.project._menuItem.select();

		// set status and unlock + button
		app.setStatus('Done!');
		this._unlockNewProjectButton();

		// remove startpane if active
		app.StartPane.deactivate();

		// add defaults to map
		this._addDefaults();

	},


	_addDefaults : function () {
		// add default baselayer
		if (!app.SidePane) return;
		if (!app.SidePane.Map) return;
		if (!app.SidePane.Map.mapSettings) return;
		if (!app.SidePane.Map.mapSettings.baselayer) return;
		app.SidePane.Map.mapSettings.baselayer.setDefaultLayer();
	},

	addHooks : function () {
		Wu.DomEvent.on( this._container, 'mousedown', this.toggle, this);
	},

	removeHooks : function () {
		Wu.DomEvent.off( this._container, 'mousedown', this.toggle, this);
	},

	addEditHooks : function () {
		Wu.DomEvent.on( this.title, 	  'dblclick', this.editName, 	    this );
		Wu.DomEvent.on( this.description, 'dblclick', this.editDescription, this );
		this.addLogoDZ();
	},

	removeEditHooks : function () {
		Wu.DomEvent.off( this.title, 	   'dblclick', this.editName, 	     this );
		Wu.DomEvent.off( this.description, 'dblclick', this.editDescription, this );
		this.removeLogoDZ();
	},


	editName : function () {

		// return if already editing
		if (this.editing) return;
		this.editing = true;
		
		// inject <input>
		var div = this.title;
		var value = div.innerHTML;
		div.innerHTML = ich.injectClientEditInput({ value : value }); 

		// focus
		var target = div.firstChild;
		target.focus();
		target.selectionStart = target.selectionEnd;	// prevents text selection

		// save on blur or enter
		Wu.DomEvent.on( target,  'blur',    this.editedName, this );     	// save title
		Wu.DomEvent.on( target,  'keydown', this.editKeyed,  this );           // save title

	},

	editedName : function (e) {
	
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
		div.innerHTML = ich.injectClientEditInput({ value : value }); 

		// focus
		var target = div.firstChild;
		target.focus();
		target.selectionStart = target.selectionEnd;	// prevents text selection

		// save on blur or enter
		Wu.DomEvent.on( target,  'blur',    this.editedDescription, this );     // save title
		Wu.DomEvent.on( target,  'keydown', this.editKeyed,   	    this );     // save title

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
	addLogoDZ : function () {

		// create dz
		this.logodz = new Dropzone(this.logo, {
				url : '/api/client/uploadlogo',
				createImageThumbnails : false,
				autoDiscover : false
		});
		
		// set client uuid param for server
		this.logodz.options.params.client = this.client.getUuid();
		
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
		this.client.setLogo(fullpath);

		// update image in header
		this.logo.src = fullpath;

	},

	pendingOpen : function () {
		if (app._timerOpenClient) clearTimeout(app._timerOpenClient);
		if (this._isOpen) return;

		var that = this;
		app._timerOpenClient = setTimeout(function () {
			that.open();
			if (app._pendingCloseClient) app._pendingCloseClient.close();
			app._pendingCloseClient = that;
		}, 200);	
	},

	toggle : function () {				
		this._isOpen ? this.close() : this.open();
	},

	open : function () {

		this.calculateHeight();
		this._container.style.height = this.maxHeight + 'px';          
		this._isOpen = true;

		// Set overflow visible to not cut off info on hover on [i]
		// var that = this;
		// setTimeout(function() {
		// 	that._container.style.overflow = 'visible';
		// }, 500)

		// close others
		var clients = app.SidePane.Clients;
		if (clients._lastOpened && clients._lastOpened != this) clients._lastOpened.close();
		clients._lastOpened = this;
	},

	close : function () {   				
		this.calculateHeight();
		this._container.style.height = this.minHeight + 'px';    
		this._isOpen = false;

		// Remove overflow visible to not cut off info on hover on [i]
		// this._container.style.overflow = 'hidden';
		
	},

	removeProject : function (project) {
		_.remove(this.projects, function (p) { return p.store.uuid == project.store.uuid; });
		this.calculateHeight();
		this.open();
	},

	calculateHeight : function () {
		
		if ( !Wu.app.mobile ) {
	
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


