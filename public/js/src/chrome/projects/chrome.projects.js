Wu.Chrome.Projects = Wu.Chrome.extend({

	_ : 'projects', 

	options : {
		defaultWidth : 220
	},

	_initialize : function () {

		console.log('_initialize', this._);

		// init container
		this._initContainer();


		this._initContent();

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

		// save divs
		this._projects = {};

		// iterate projects, create item
		_.each(app.Projects, function (project) {

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
			Wu.DomEvent.on(trigger, 'click', this._editProject.bind(this, project), this);


		}, this);
	},

	_editProject : function (project, e) {
		Wu.DomEvent.stop(e);

		console.log('edit: ', project.getName());



		this._fullscreen = Wu.DomUtil.create('div', 'smooth-fullscreen', app._appPane);

		var manageAccessInner = Wu.DomUtil.create('div', 'smooth-fullscreen-inner', this._fullscreen);
		var closeManageAccessButton = Wu.DomUtil.create('div', 'close-smooth-fullscreen', this._fullscreen, 'x');

		var header = Wu.DomUtil.create('div', 'smooth-fullscreen-title', manageAccessInner);
		header.innerHTML = '<span style="font-weight:200;">Edit</span> ' + project.getName();

		

		// this.manageProjectsList(manageAccessInner);


		Wu.DomEvent.on(closeManageAccessButton, 'click', this.closeManageAccess, this);


	},

	closeManageAccess : function () {

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