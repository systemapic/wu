Wu.Chrome.Projects = Wu.Chrome.extend({

	_ : 'projects', 

	options : {
		defaultWidth : 250
	},

	_initialize : function () {

		console.log('_initialize', this._);

		// init container
		this._initContainer();


		setTimeout(function() {
			// init content
			this._initContent();

		}.bind(this), 200)


	},

	_initContainer : function () {

		this._container = Wu.DomUtil.create('div', 'chrome-left-section chrome-projects', this.options.appendTo);

	},
	
	_initContent : function () {

		// Create Container
		var projectsContainer = Wu.DomUtil.create('div', 'chrome-left-container', this._container);

		// Create Title
		var projectsTitle = Wu.DomUtil.create('div', 'chrome-left-title projects-title', projectsContainer, 'Projects');

		// Create NEW button
		var newProjectButton = Wu.DomUtil.create('div', 'chrome-left-new-button', projectsContainer, 'New');

		Wu.DomEvent.on(newProjectButton, 'click', this.createNewProject, this);


		// Get projects
		var projects = this.projects = app.Projects;

		// Get active project ID
		var activeProjectUuid = app.activeProject.getUuid();


		for ( var projectID in projects ) {

			var project = projects[projectID];
			var projectName = project.getName();

			var _containerClassName = 'chrome-left-itemcontainer chrome-project';

			// Set active project
			if ( activeProjectUuid == projectID ) _containerClassName += ' activeProject';
			
			// Create line with project
			var _projectContainer = Wu.DomUtil.create('div', _containerClassName, projectsContainer);
			var _projectName = Wu.DomUtil.create('div', 'chrome-left-item-name', _projectContainer, projectName);
			var _actionTrigger = Wu.DomUtil.create('div', 'chrome-left-popup-trigger', _projectContainer);

		}


		
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

	_refresh : function () {

		if ( !this._project ) return;		
	},

});