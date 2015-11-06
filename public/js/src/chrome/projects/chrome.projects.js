Wu.Chrome.Projects = Wu.Chrome.extend({

	_ : 'projects', 

	options : {
		defaultWidth : 220
	},

	_initialize : function () {

		// init container
		this._initContainer();

		// init content
		this._initContent();

	},

	_initContainer : function () {
		this._container = Wu.DomUtil.create('div', 'chrome-left-section chrome-projects', this.options.appendTo);
	},
	
	_initContent : function () {

		// Create Container
		var projectsContainer = this._projectsContainer = Wu.DomUtil.create('div', 'chrome-left-container', this._container);

		// Create Title
		var projectsTitle = Wu.DomUtil.create('div', 'chrome-left-title projects-title', projectsContainer, 'Projects');

		// Create NEW button
		var newProjectButton = Wu.DomUtil.create('div', 'chrome-left-new-button', projectsContainer, 'New');

		// new trigger
		Wu.DomEvent.on(newProjectButton, 'click', this._openNewProjectFullscreen, this);

		// save divs
		this._projects = {};

		// sort by name
		var projects = _.sortBy(_.toArray(app.Projects), function (p) {
			return p.getName().toLowerCase();
		});

		// iterate projects, create item
		_.each(projects, function (project) {

			var className = 'chrome-left-itemcontainer chrome-project';

			// Create line with project
			var wrapper = Wu.DomUtil.create('div', className, projectsContainer);
			var title = Wu.DomUtil.create('div', 'chrome-left-item-name', wrapper, project.getName());
			var trigger = Wu.DomUtil.create('div', 'chrome-left-popup-trigger', wrapper);

			this._projects[project.getUuid()] = {
				div : wrapper
			}

			// select project trigger
			Wu.DomEvent.on(wrapper, 'click', project.selectProject, project);

			// edit trigger
			Wu.DomEvent.on(trigger, 'click', this._openEditProjectFullscreen.bind(this, project), this);


		}, this);
	},

	_refreshContent : function () {

		// remove old, todo: check for mem leaks
		this._projectsContainer.innerHTML = '';
		Wu.DomUtil.remove(this._projectsContainer);

		// rebuild
		this._initContent();
	},


	_openEditProjectFullscreen : function (project, e) {
		Wu.DomEvent.stop(e);
		
		// create fullscreen
		this._fullscreen = Wu.DomUtil.create('div', 'smooth-fullscreen', app._appPane);

		// wrappers
		var inner = Wu.DomUtil.create('div', 'smooth-fullscreen-inner', this._fullscreen);
		var closer = Wu.DomUtil.create('div', 'close-smooth-fullscreen', this._fullscreen, 'x');
		var header = Wu.DomUtil.create('div', 'smooth-fullscreen-title', inner);

		// set title
		var title = '<span style="font-weight:200;">Edit</span> ' + project.getName();
		header.innerHTML = title;

		// close trigger		
		Wu.DomEvent.on(closer, 'click', this._closeFullscreen, this);
	},

	_openNewProjectFullscreen : function (e) {
		Wu.DomEvent.stop(e);
		
		// create fullscreen
		this._fullscreen = Wu.DomUtil.create('div', 'smooth-fullscreen', app._appPane);

		// wrappers
		var inner = Wu.DomUtil.create('div', 'smooth-fullscreen-inner', this._fullscreen);
		var closer = Wu.DomUtil.create('div', 'close-smooth-fullscreen', this._fullscreen, 'x');
		var title = Wu.DomUtil.create('div', 'smooth-fullscreen-title', inner);

		// set title
		var text = '<span style="font-weight:200;">Create New Project</span>';
		title.innerHTML = text;

		// add content
		var content = Wu.DomUtil.create('div', 'smooth-fullscreen-content', inner);


		// project name
		var name = Wu.DomUtil.create('div', 'smooth-fullscreen-name-label', content, 'Project name');
		var name_input = Wu.DomUtil.create('input', 'smooth-input', content);
		name_input.setAttribute('placeholder', 'Enter name here');
		var name_error = Wu.DomUtil.create('div', 'smooth-fullscreen-error-label', content);

		// save button
		var saveBtn = Wu.DomUtil.create('div', 'smooth-fullscreen-save', content, 'Create');

		// pass inputs to save
		var options = {};
		options.name_input = name_input;
		options.name_error = name_error;

		// save button trigger
		Wu.DomEvent.on(saveBtn, 'click', this._createProject.bind(this, options), this);

		// close trigger		
		Wu.DomEvent.on(closer, 'click', this._closeFullscreen, this);
	},

	_createProject : function (options) {

		// get name
		var projectName = options.name_input.value;

		// no data
		if (!projectName) {
			options.name_error.innerHTML = 'Please enter a project name';
			return;
		}

		// create project object
		var store = {
			name 		: projectName,
			description 	: 'Project description',
			createdByName 	: app.Account.getName(),
			keywords 	: '',
			position 	: app.options.defaults.project.position || {},
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

		// set create options
		var options = {
			store : store,
			callback : this._projectCreated,
			context : this
		}

		// create new project with options, and save
		var project = new Wu.Project(store);

		// create project on server
		project.create(options);

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

		// update project store
		project.setNewStore(store);

		// add project to list
		this._refreshContent();

		// close fullscreen
		this._closeFullscreen();

		// select project
		project.selectProject();
	},

	_closeFullscreen : function () {
		this._fullscreen.innerHTML = '';
		Wu.DomUtil.remove(this._fullscreen);
	},


	// fired on projectSelected
	_refresh : function () {
		if (!this._project) return;

		// remove old highligting
		if (this._activeProject) {
			var div = this._projects[this._activeProject.getUuid()].div;
			Wu.DomUtil.removeClass(div, 'active-project');
		}

		// highlight project
		var div = this._projects[this._project.getUuid()].div;
		Wu.DomUtil.addClass(div, 'active-project');

		// remember last
		this._activeProject = this._project;

	},

	createNewProject : function () {

		console.log('create new project')

	},
	

	_onLayerAdded : function (options) {
	},

	_onFileDeleted : function () {
	},

	_onLayerDeleted : function () {
	},

	_onLayerEdited : function () {
	},

	_registerButton : function () {

	},

	_togglePane : function () {

		// right chrome
		var chrome = this.options.chrome;

		// open/close
		this._isOpen ? chrome.close(this) : chrome.open(this); // pass this tab

		if (this._isOpen) {
			// fire event
			app.Socket.sendUserEvent({
				user : app.Account.getFullName(),
				event : 'opened',
				description : 'the left pane',
				timestamp : Date.now()
			})
		}
	},

	_show : function () {

		this._container.style.display = 'block';
		this._isOpen = true;

	},

	_hide : function () {

		this._container.style.display = 'none';
		this._isOpen = false;
	},

	onOpened : function () {
	},

	onClosed : function () {
	},

	_addEvents : function () {
	},

	_removeEvents : function () {
	},

	_onWindowResize : function () {
	},

	getDimensions : function () {
		var dims = {
			width : this.options.defaultWidth,
			height : this._container.offsetHeight
		}
		return dims;
	},


});