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
		var title = 'Projects <span style="font-weight:400; font-size: 16px; color: gainsboro">(' + _.size(app.Projects) + ')</span> '
		var projectsTitle = Wu.DomUtil.create('div', 'chrome-left-title projects-title', projectsContainer, title);

		// Create NEW button
		var newProjectButton = Wu.DomUtil.create('div', 'chrome-left-new-button', projectsContainer, '+');

		// new trigger
		Wu.DomEvent.on(newProjectButton, 'click', this._openNewProjectFullscreen, this);

		// save divs
		this._projects = {};

		// sort by name
		var projects = _.sortBy(_.toArray(app.Projects), function (p) {
			return p.getName().toLowerCase();
		});

		// project wrapper
		var projectWrapper = Wu.DomUtil.create('div', 'chrome-left-project-wrapper', projectsContainer);

		// iterate projects, create item
		_.each(projects, function (project) {

			// Create line with project
			var wrapper = Wu.DomUtil.create('div', 'chrome-left-itemcontainer chrome-project', projectWrapper);
			var title = Wu.DomUtil.create('div', 'chrome-left-item-name', wrapper);

			// add edit button if project is editable
			if (project.isEditable()) {

				// edit trigger, todo: only if can edit
				var trigger = Wu.DomUtil.create('div', 'chrome-left-popup-trigger', wrapper);
			
				// edit trigger event
				Wu.DomEvent.on(trigger, 'click', this._openEditProjectFullscreen.bind(this, project), this);
			}


			var projectTitle = '';

			// if project is not created by self -> shared with the user
			if (project.store.createdBy != app.Account.getUuid()) {
				
				// get user
				var createdBy = project.store.createdByName;
				var tooltipText = 'Shared with you by ' + createdBy;

				// set tooltip width
				var width = tooltipText.length * 7 + 'px';

				// set title + tooltip
				projectTitle += '<i class="project-icon fa fa-arrow-circle-right"><div class="absolute"><div class="project-tooltip" style="width:' + width + '">' + tooltipText + '</div></div></i>';
			}

			// add project name
			projectTitle += project.getName();

			// if public, add globe icon + tooltip
			if (project.isPublic()) {
				var tooltipText = 'Public';
				var tooltipWidth = '50px';
				projectTitle += '<i class="project-public-icon fa fa-globe"><div class="absolute"><div class="project-tooltip" style="width:' + tooltipWidth + '">' + tooltipText + '</div></div></i>'
			}

			// set title
			title.innerHTML = projectTitle;

			// select project trigger
			Wu.DomEvent.on(wrapper, 'click', project.selectProject, project);

			
			// remember
			this._projects[project.getUuid()] = {
				wrapper : wrapper,
				trigger : trigger
			}

		}, this);
	},

	_refreshContent : function () {

		// remove old, todo: check for mem leaks
		this._projectsContainer.innerHTML = '';
		Wu.DomUtil.remove(this._projectsContainer);

		// rebuild
		this._initContent();
	},


	_openNewProjectFullscreen : function (e) {

		// stop propagation
		Wu.DomEvent.stop(e);
		
		// create fullscreen
		this._fullscreen = new Wu.Fullscreen({
			title : '<span style="font-weight:200;">Create New Project</span>'
		});

		// clear invitations
		this._access = {
			read : [],
			edit : [],
			options : {
				share : true,
				download : true,
				isPublic : false
			}
		};

		// shortcut
		var content = this._fullscreen._content;

		// create private/public label
		var private_toggle_label = Wu.DomUtil.create('div', 'private-public-label smooth-fullscreen-sub-label');

		// add private/public toggle
		var ppswitch = new Wu.button({
			id 	     : 'public-switch',
			type 	     : 'switch',
			isOn 	     : false,
			right 	     : false,
			disabled     : false,
			appendTo     : content,
			fn 	     : this._togglePrivatePublic.bind(this, private_toggle_label),
			className    : 'public-private-project-switch'
		});

		// add label, default value
		content.appendChild(private_toggle_label);
		private_toggle_label.innerHTML = 'Only invited users can access project';


		// project name
		var name = Wu.DomUtil.create('div', 'smooth-fullscreen-name-label clearboth', content, 'Project name');
		var name_input = Wu.DomUtil.create('input', 'smooth-input', content);
		name_input.setAttribute('placeholder', 'Enter name here');
		var name_error = Wu.DomUtil.create('div', 'smooth-fullscreen-error-label', content);

		
		// create invite input
		this._createInviteUsersInput({
			type : 'read',
			label : 'Invite spectators to project <span class="optional-medium">(optional)</span>',
			content : content,
			container : this._fullscreen._inner,
			sublabel : 'Spectators have read-only access to the project'
		});

		// create invite input
		this._createInviteUsersInput({
			type : 'edit',
			label : 'Invite editors to project <span class="optional-medium">(optional)</span>',
			content : content,
			container : this._fullscreen._inner,
			sublabel : 'Editors can edit the project'
		});


		// save button
		var saveBtn = Wu.DomUtil.create('div', 'smooth-fullscreen-save', content, 'Create');

		// pass inputs to triggers
		var options = {
			name_input : name_input,
			name_error : name_error,
		};

		// save button trigger
		Wu.DomEvent.on(saveBtn, 'click', this._createProject.bind(this, options), this);

	},

	_openEditProjectFullscreen : function (project, e) {

		// stop propagation
		Wu.DomEvent.stop(e);
		
		// create fullscreen
		this._fullscreen = new Wu.Fullscreen({
			title : '<span style="font-weight:200;">Edit</span> ' + project.getName()
		});

		// clear invitations
		this._access = {
			read : [],
			edit : [],
			options : {
				share : true,
				download : true,
				isPublic : project.isPublic()
			}
		};

		// shortcut
		var content = this._fullscreen._content;

		// create private/public label
		var private_toggle_label = Wu.DomUtil.create('div', 'private-public-label smooth-fullscreen-sub-label');

		// add private/public toggle
		var ppswitch = new Wu.button({
			id 	     : 'public-switch',
			type 	     : 'switch',
			isOn 	     : project.isPublic(),
			right 	     : false,
			disabled     : false,
			appendTo     : content,
			fn 	     : this._togglePrivatePublic.bind(this, private_toggle_label),
			className    : 'public-private-project-switch'
		});

		// add label, default value
		content.appendChild(private_toggle_label);
		private_toggle_label.innerHTML = project.isPublic() ? 'Anyone with a link can access project' : 'Only invited users can access project';


		// create project name input
		var name = Wu.DomUtil.create('div', 'smooth-fullscreen-name-label clearboth', content, 'Project name');
		var name_input = Wu.DomUtil.create('input', 'smooth-input', content);
		name_input.setAttribute('placeholder', 'Enter name here');
		name_input.value = project.getName();
		var name_error = Wu.DomUtil.create('div', 'smooth-fullscreen-error-label', content);


		

		// create invite input
		this._createInviteUsersInput({
			type : 'read',
			label : 'Spectators of project',
			content : content,
			container : this._fullscreen._inner,
			sublabel : 'Spectators have read-only access to the project',
			project : project
		});

		// create invite input
		this._createInviteUsersInput({
			type : 'edit',
			label : 'Editors of project',
			content : content,
			container : this._fullscreen._inner,
			sublabel : 'Editors can edit the project',
			project : project
		});

		// buttons
		var buttonsWrapper = Wu.DomUtil.create('div', 'smooth-fullscreen-buttons-wrapper', content)
		var saveBtn = Wu.DomUtil.create('div', 'smooth-fullscreen-save', buttonsWrapper, 'Update');
		var delBtn = Wu.DomUtil.create('div', 'smooth-fullscreen-delete', buttonsWrapper, 'Delete');

		// trigger options
		var options = {
			name_input : name_input,
			name_error : name_error,
			project : project,
		};

		// save button trigger
		Wu.DomEvent.on(saveBtn, 'click', this._updateProject.bind(this, options), this);

		// save button trigger
		Wu.DomEvent.on(delBtn, 'click', this._deleteProject.bind(this, options), this);

	},

	_togglePrivatePublic : function (toggle, e, isPublic) {
		console.log('_togglePrivatePublic', arguments);
	
		toggle.innerHTML = isPublic ? 'Anyone with a link can access project' : 'Only invited users can access project';

		this._access.options.isPublic = isPublic;
	},

	_divs : {
		read : {},
		edit : {}
	},

	_createInviteUsersInput : function (options) {

		// invite users
		var content = this._fullscreen._content;
		var container = this._fullscreen._container;
		var project = options.project;

		// label
		var invite_label = options.label;
		var name = Wu.DomUtil.create('div', 'smooth-fullscreen-name-label', content, invite_label);
		
		// container
		var invite_container = Wu.DomUtil.create('div', 'invite-container', content);
		
		// sub-label
		var sublabel = Wu.DomUtil.create('div', 'smooth-fullscreen-sub-label', content, options.sublabel);

		var invite_inner = Wu.DomUtil.create('div', 'invite-inner', invite_container);
		var invite_input_container = Wu.DomUtil.create('div', 'invite-input-container', invite_inner);

		// input box
		var invite_input = Wu.DomUtil.create('input', 'invite-input-form', invite_input_container);

		// invite list
		var invite_list_container = Wu.DomUtil.create('div', 'invite-list-container', invite_container);
		var invite_list_inner = Wu.DomUtil.create('div', 'invite-list-inner', invite_list_container);

		// remember div
		this._divs[options.type].invite_list_container = invite_list_container;

		// for manual scrollbar (js)
		var monkey_scroll_bar = Wu.DomUtil.create('div', 'monkey-scroll-bar', invite_list_inner);
		
		// for holding list
		var monkey_scroll_hider = Wu.DomUtil.create('div', 'monkey-scroll-hider', invite_list_inner);
		var monkey_scroll_inner = Wu.DomUtil.create('div', 'monkey-scroll-inner', monkey_scroll_hider);
		var monkey_scroll_list = Wu.DomUtil.create('div', 'monkey-scroll-list', monkey_scroll_inner);


		// list of all users
		var allUsers = _.sortBy(_.toArray(app.Users), function (u) {
			return u.store.firstName;
		});
		_.each(allUsers, function (user) {

			// divs
			var list_item_container = Wu.DomUtil.create('div', 'monkey-scroll-list-item-container', monkey_scroll_list);
			var avatar_container = Wu.DomUtil.create('div', 'monkey-scroll-list-item-avatar-container', list_item_container);
			var avatar = Wu.DomUtil.create('div', 'monkey-scroll-list-item-avatar default-avatar', avatar_container);
			var name_container = Wu.DomUtil.create('div', 'monkey-scroll-list-item-name-container', list_item_container);
			var name_bold = Wu.DomUtil.create('div', 'monkey-scroll-list-item-name-bold', name_container);
			var name_subtle = Wu.DomUtil.create('div', 'monkey-scroll-list-item-name-subtle', name_container);

			// set name
			name_bold.innerHTML = user.getFullName();
			name_subtle.innerHTML = 'username';

			// click event
			Wu.DomEvent.on(list_item_container, 'click', function () {

				// add selected user item to input box
				this._addUserAccessItem({
					input : invite_input,
					user : user,
					type : options.type
				});
					
				
			}, this);

		}, this);


		// events

		// input focus, show dropdown
		Wu.DomEvent.on(invite_input, 'focus', function () {
			this._closeInviteInputs();
			invite_list_container.style.display = 'block';
		}, this);

		// focus input on any click
		Wu.DomEvent.on(invite_input_container, 'click', function () {
			invite_input.focus();
		}, this);

		// input keyup
		Wu.DomEvent.on(invite_input, 'keydown', function (e) {

			// get which key
			var key = event.which ? event.which : event.keyCode;

			// get string length
			var value = invite_input.value;
			var text_length = value.length;
			if (text_length <= 0) text_length = 1;

			// set width of input dynamically
			invite_input.style.width = 30 + (text_length * 20) + 'px';

			// backspace on empty field: delete added user
			if (key == 8 && value.length == 0 && this._access[options.type].length) {

				// remove last item
				var popped = this._access[options.type].pop();
				Wu.DomUtil.remove(popped.user_container);
			}

			// enter: blur input
			if (key == 13) {
				invite_input.blur();
				// invite_list_container.style.display = 'none';
				invite_input.value = '';
				this._closeInviteInputs();
			}

		}, this);


		// close dropdown on any click
		Wu.DomEvent.on(container, 'click', function (e) {

			// only if target == self
			if (e.target == container || e.target == this._fullscreen._inner) {
				// invite_list_container.style.display = 'none';
				this._closeInviteInputs();
			}
		},this);



		if (project) {
			// add current access vars
			var projectAccess = project.getAccess();


			// add selected user item to input box
			if (projectAccess && projectAccess[options.type]) {

				// add selected user item to input box
				projectAccess[options.type].forEach(function(userUuid) {

					var user = app.Users[userUuid];

					this._addUserAccessItem({
						input : invite_input,
						user : user,
						type : options.type
					});
				}, this);
					
			}
			
			// hide by default
			invite_list_container.style.display = 'none';
			invite_input.blur();	
		}
		
	},

	_closeInviteInputs : function () {

		var container = this._divs.edit.invite_list_container;
		if (container) container.style.display = 'none';

		var container = this._divs.read.invite_list_container;
		if (container) container.style.display = 'none';
	},

	_addUserAccessItem : function (options) {

		var invite_input = options.input;
		var user = options.user;

		// focus input
		invite_input.focus();

		// don't add twice
		var existing = _.find(this._access[options.type], function (i) {
			return i.user == user;
		});
		if (existing) return;

		// insert user box in input area
		var user_container = Wu.DomUtil.create('div', 'mini-user-container');
		var user_inner = Wu.DomUtil.create('div', 'mini-user-inner', user_container);
		var user_avatar = Wu.DomUtil.create('div', 'mini-user-avatar default-avatar', user_inner);
		var user_name = Wu.DomUtil.create('div', 'mini-user-name', user_inner, user.getFullName());
		var user_kill = Wu.DomUtil.create('div', 'mini-user-kill', user_inner, 'x');

		// insert before input
		var invite_input_container = invite_input.parentNode;
		invite_input_container.insertBefore(user_container, invite_input);

		// click event (kill)
		Wu.DomEvent.on(user_container, 'click', function () {
			
			// remove div
			Wu.DomUtil.remove(user_container);
			
			// remove from array
			_.remove(this._access[options.type], function (i) {
				return i.user == user;
			});

		}, this);

		// add to array
		this._access[options.type].push({
			user : user,
			user_container : user_container
		});


		// remove from other list if active there
		var otherType = (options.type == 'edit') ? 'read' : 'edit';
		var existing = _.find(this._access[otherType], function (i) {
			return i.user == user;
		});
		if (existing) {

			// remove div
			Wu.DomUtil.remove(existing.user_container);
			
			// remove from array
			_.remove(this._access[otherType], function (i) {
				return i == existing;
			});
		}

	},

	_deleteProject : function (options) {

		var project = options.project;

		// confirm
		var answer = confirm('Are you sure you want to delete project ' + project.getName() + '? This action cannot be undone!');
		if (!answer) return;

		// delete
		project._delete(); // fires projectDeleted
		project = null;
		this._activeProject = null;

		// close fullscreen
		this._fullscreen.close();
	},

	_updateProject : function (options) {

		// get name
		var projectName = options.name_input.value;
		var project = options.project;

		// clean invitations array
		var access = {
			edit : [],
			read : [],
			options : {
				share : true,
				download : true,
				isPublic : this._access.options.isPublic
			}
		};
		this._access.edit.forEach(function (i) {
			access.edit.push(i.user.getUuid());
		}, this);
		this._access.read.forEach(function (i) {
			access.read.push(i.user.getUuid());
		}, this);
		this._access = {
			read : [],
			edit : [],
			options : {
				share : true,
				download : true,
				isPublic : false
			}
		};

		// missing data
		if (!projectName) {

			// set error message
			options.name_error.innerHTML = 'Please enter a project name';
			
			// done here
			return;
		}

		// set project name
		project.setName(projectName);

		// set invitations
		project.setAccess(access)

		// add project to list
		this._refreshContent();

		// close fullscreen
		this._fullscreen.close();

		// select project
		project.selectProject();
	},

	
	_createProject : function (options) {

		// get name
		var projectName = options.name_input.value;

		// missing data
		if (!projectName) {

			// set error message
			options.name_error.innerHTML = 'Please enter a project name';
			
			// done here
			return;
		}

		// clean invitations array
		var access = {
			edit : [],
			read : [],
			options : {
				share : true,
				download : true,
				isPublic : this._access.options.isPublic
			}
		};
		this._access.edit.forEach(function (i) {
			access.edit.push(i.user.getUuid());
		}, this);
		this._access.read.forEach(function (i) {
			access.read.push(i.user.getUuid());
		}, this);

		// reset
		this._access = {
			read : [],
			edit : [],
			options : {
				share : true,
				download : true,
				isPublic : false
			}
		};

		console.log('crate project ACCESS::', access);

		// create project object
		var store = {
			name 		: projectName,
			description 	: 'Project description',
			createdByName 	: app.Account.getName(),
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
		project.create(options, function (project, json) {
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
			this._fullscreen.close();

			// select project
			project.selectProject();

			// set access
			project.setAccess(access);

		});



	},

	// fired on projectSelected
	_refresh : function () {
		if (!this._project) return;

		// remove old highligting
		if (this._activeProject) {
			var wrapper = this._projects[this._activeProject.getUuid()].wrapper;
			Wu.DomUtil.removeClass(wrapper, 'active-project');
		}

		// highlight project
		var wrapper = this._projects[this._project.getUuid()].wrapper;
		Wu.DomUtil.addClass(wrapper, 'active-project');

		// remember last
		this._activeProject = this._project;
	},

	_onProjectDeleted : function (e) {
		if (!e.detail.projectUuid) return;

		// add project to list
		this._refreshContent();

		// select random project 
		app.Controller.openFirstProject();
		
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

		// fire open event
		if (this._isOpen) app.Socket.sendUserEvent({
			user : app.Account.getFullName(),
			event : 'opened',
			description : 'the left pane',
			timestamp : Date.now()
		});
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