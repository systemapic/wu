Wu.SidePane.Manage = Wu.Class.extend({
	_ : 'sidepane.manage', 

	initialize : function (options) {
		console.log('manage', this);

		// set options
		this._user = options.user;
		this._sidepane = options.caller;

		// init container
		this.initContainer();
	
		// init content
		this.initContent();

		// add hooks
		this.addHooks();
	},

	initContainer : function () {
		var titleText = 'Manage access for ' + this._user.getName(),
		    subText = 'Add, remove or create roles.';

		// container for whole pane
		this._container  = Wu.DomUtil.create('div', 'manage-access-container');

		// titles
		var t = Wu.DomUtil.create('div', 'manage-access-title-wrapper', this._container);
		var m = Wu.DomUtil.create('div', 'manage-access-title', t, titleText);
		var s = Wu.DomUtil.create('div', 'manange-access-subtitle', t, subText);

		// clients/projects wrapper
		this._content = Wu.DomUtil.create('div', 'manage-access-content-wrapper', this._container);

		// buttons
		this._doneButton = Wu.DomUtil.create('div', 'manage-access-button-done', this._container);

		// hide sidepane
		this._sidepane._hide();
	},


	initContent : function () {
		this.insertClients();
	},

	insertClients : function () {

		_.each(app.Clients, function (client) {

			// wrapper
			var clientWrapper = Wu.DomUtil.create('div', 'manage-access-client-wrapper', this._content);

			// client meta
			var clientMeta = Wu.DomUtil.create('div', 'manage-access-client-meta-wrap', clientWrapper);
			var logo = client.getLogo() || '/css/images/defaultProjectLogo.png';
			var clientLogo = Wu.DomUtil.create('img', 'manage-access-client-logo', clientMeta, logo);
			var clientTitle = Wu.DomUtil.create('div', 'manage-access-client-title', clientMeta, client.getTitle());
			var clientDescription = Wu.DomUtil.create('div', 'manage-access-client-description', clientMeta, client.getDescription());

			// insert projects
			this._insertClientProjects({
				wrapper : clientWrapper,
				client : client
			});

		}, this);
	},


	_insertClientProjects : function (options) {
		var clientWrapper = options.wrapper,
		    client = options.client,
		    projects = client.getProjects(); 	// todo: only projects account has delegate_to_user access to!!

		// wrapper for projects within client
		var projectsWrapper = Wu.DomUtil.create('div', 'manage-access-client-projects-wrap', clientWrapper);

		// insert projects
		_.each(projects, function (project) {
			if (project) this._insertProject({
				project : project, 
				projectsWrapper : projectsWrapper
			});
		}, this);
	},


	_insertProject : function (options) {
		var project = options.project,
		    projectsWrapper = options.projectsWrapper,
		    logo = project.getLogo() || '/css/images/defaultProjectLogo.png';
		   
		// wrapper
		var projectWrapper = Wu.DomUtil.create('div', 'manage-access-project-item', projectsWrapper);

		// meta
		var projectMeta = Wu.DomUtil.create('div', 'manage-access-project-item-meta', projectWrapper);
		var projectLogo = Wu.DomUtil.create('img', 'manage-access-project-item-logo', projectMeta, logo);
		var projectTitle = Wu.DomUtil.create('div', 'manage-access-project-item-title', projectMeta, project.getTitle());
		var projectDesc = Wu.DomUtil.create('div', 'manage-access-project-item-description', projectMeta, project.getDescription());

		// roles
		this._insertRoles({
			wrapper : projectWrapper,
			project : project
		});
	},

	_insertRoles : function (options) {
		var wrapper = options.wrapper,
		    project = options.project;

		// get current role
		var currentRole = app.access.get.role({
			user : this._user, 
			project : project
		});

		// role name
		var roleName = currentRole ? currentRole.getName() : 'No role';
		
		// wrapper for all roles
		var rolesWrapper = Wu.DomUtil.create('div', 'manage-access-roles-wrapper', wrapper);

		// create div for current role
		var div_currentRole = Wu.DomUtil.create('div', 'manage-access-current-role', rolesWrapper, roleName);

		
		// role explanation
		var infoDiv = Wu.DomUtil.create('div', 'manage-access-info', wrapper);
		var role = currentRole ? currentRole.getSlug() : 'noRole';
		var infoText = app.language.tooltips.roles[role];
		infoDiv.innerHTML = infoText;

		// dont allow changes to admins or self
		if (!app.access.is.admin(this._user) && this._user.getUuid() != app.Account.getUuid()) {

			// add event for current role click
			Wu.DomEvent.on(div_currentRole, 'click', function () {

				// show hide
				Wu.DomUtil.addClass(div_currentRole, 'displayNone');

				// Put current project wrapper on top (z-index: 999999);
				Wu.DomUtil.addClass(wrapper, 'z999999');

				// insert dropdown
				this._insertAvailableRoles({
					project : project,
					user : this._user,
					addTo : rolesWrapper,
					currentRoleDiv : div_currentRole,
					wrapper : wrapper,
					infoDiv : infoDiv
				});

			}, this);
		}

		// tooltip
		var tooltip = app.language.tooltips.roles.dropdown;
		app.Tooltip.add(div_currentRole, tooltip);

	},

	

	_insertAvailableRoles : function (options) {
		var project = options.project,
		    wrapper = options.wrapper,
		    user = options.user,
		    addTo = options.addTo,
		    currentRoleDiv = options.currentRoleDiv,
		    infoDiv = options.infoDiv;


		var availableRoles = app.access.get.availableRoles({
			user : user,
			project : project,
			noAdmins : true
		});

		// create dropdown for available roles
		var dropdown = Wu.DomUtil.create('div', 'manage-access-dropdown', addTo);

		// click outside dropdown ghost
		var ghost = Wu.DomUtil.create('div', 'manage-access-ghost', addTo);
		Wu.DomEvent.on(ghost, 'click', function (e) {
			Wu.DomUtil.remove(dropdown);
			Wu.DomUtil.remove(ghost);
			Wu.DomUtil.removeClass(currentRoleDiv, 'displayNone');
			Wu.DomUtil.removeClass(wrapper, 'z999999');
		}, this);

		// create dropdown entries
		_.each(availableRoles, function (avrole) {
			// role div
			var div = Wu.DomUtil.create('div', 'manage-access-available-role', dropdown, avrole.getName());

			// add tooltip
			var tooltip = app.language.tooltips.roles[avrole.getSlug()] || 'Custom role.';
			app.Tooltip.add(div, tooltip);

			// add event for available role click
			Wu.DomEvent.on(div, 'click', function (e) {
				
				// select role
				this._selectRole({
					e : e,
					project : project,
					user : this._user,
					role : avrole,
					wrapper : wrapper,
					ghost : ghost,
					dropdown : dropdown,
					currentRoleDiv : currentRoleDiv,
					infoDiv : infoDiv
				});

			}, this);

		}, this);
	},


	_selectRole : function (options) {

		Wu.DomEvent.stop(options.e);

		// remove divs
		Wu.DomUtil.remove(options.dropdown);
		Wu.DomUtil.remove(options.ghost);

		// show current role
		Wu.DomUtil.removeClass(options.currentRoleDiv, 'displayNone');
		
		// Remove project wrapper z-index
		Wu.DomUtil.removeClass(options.wrapper, 'z999999');

		// set name
		options.currentRoleDiv.innerHTML = options.role ? options.role.getName() : 'No role';

		// set info
		var infoText = options.role ? app.language.tooltips.roles[options.role.getSlug()] : 'Custom role.';
		options.infoDiv.innerHTML = infoText;

		// select role
		this._setRole({
			project : options.project,
			user : options.user,
			role : options.role,
		});

	},


	_setRole : function (options) {
		var project = options.project,
		    user = options.user,
		    role = options.role;

		// add member 
		if (role) role.addMember(user, function (err, projectStore) {
			console.log('added role', err, projectStore);
		});

		// add 'No role'
		if (!role) app.access.addNoRole(options, function (err, result) {
			console.log('addNoRole callback: ', err, result);
		});
	},


	addHooks : function () {
		// done button
		Wu.DomEvent.on(this._doneButton, 'click', this._done, this);
	},


	removeHooks : function () {
		// done button
		Wu.DomEvent.off(this._doneButton, 'click', this._done, this);
	},

	remove : function () {		
		Wu.DomUtil.remove(this._container);
	},

	_done : function () {

		// remove hooks
		this.removeHooks();

		// remove container
		this.remove();

		// update sidepane.users
		this._sidepane.update();

		// show sidepne
		this._sidepane._show();
		
		// Google Analytics event tracking
		app.Analytics.ga(['Side Pane', 'Users: Close manage access']);

		// delete this?
		delete this;
	},

	close : function () {
		this._done();
	},

	addTo : function (parent) {
		parent.appendChild(this._container);
	},

});