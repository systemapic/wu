Wu.Chrome.Users = Wu.Chrome.extend({

	_ : 'users', 

	options : {
		defaultWidth : 400
	},

	_initialize : function () {

		console.log('_initialize', this._);

		// init container
		this._initContainer();

		// init content
		this._initContent();

	},

	_initContainer : function () {
		this._container = Wu.DomUtil.create('div', 'chrome-left-section chrome-users', this.options.appendTo);
	},
	
	_initContent : function () {

		var usersContainer = Wu.DomUtil.create('div', 'chrome-left-container', this._container);
		var usersTitle = Wu.DomUtil.create('div', 'chrome-left-title users-title', usersContainer, 'Users');
		var users = this.users = app.Users;

		// Define D3 container
		this.D3container = d3.select(usersContainer);
		
		this.openUserCard = false;

		this.initGhost();

		// Init user list etc.
		this._refresh();


		
	},


	// GHOST
	// GHOST
	// GHOST

	initGhost : function () {
		this.ghost = Wu.DomUtil.create('div', 'chrome-left-ghost displayNone', this.options.appendTo);
		Wu.DomEvent.on(this.ghost, 'click', this.removeGhost, this);		
	},

	removeGhost : function () {

		Wu.DomUtil.addClass(this.ghost, 'displayNone');
		this.openUserCard = false;
		this._refresh();
	},

	addGhost : function () {
		Wu.DomUtil.removeClass(this.ghost, 'displayNone');
	},


	// REFRESH USER LIST
	// REFRESH USER LIST
	// REFRESH USER LIST

	refreshUserList : function (data) {

		if ( this.openUserCard ) this.addGhost();

		// BIND
		var eachUser = 
			this.D3container
			.selectAll('.chrome-user')
			.data(data);

		// ENTER
		eachUser
			.enter()
			.append('div')
			.classed('chrome-user', true)
			.classed('chrome-left-itemcontainer', true)

		// UPDATE
		eachUser
			.classed('online', function (d) {
				var uuid = d.getUuid();
				var myId = app.Account.getUuid();
				if ( uuid == myId ) return true;
				return false;
			})		

		// EXIT
		eachUser
			.exit()
			.remove();


		// Add user name
		this.addUserName(eachUser);

		// Add action trigger (the [...] button)
		this.addUserActionTrigger(eachUser);

		// Add user card
		this.addUserCard(eachUser);				
	
	},


	// ADD USER NAME
	// ADD USER NAME
	// ADD USER NAME

	addUserName : function (parent) {


		// Bind
		var nameContent = 
			parent
			.selectAll('.chrome-left-item-name')
			.data(function(d) { return [d] })

		// Enter
		nameContent
			.enter()
			.append('div')
			.classed('chrome-left-item-name', true)

		// Update
		nameContent
			.html(function (d) { 
				return d.getFullName();
			});

		// Exit
		nameContent
			.exit()
			.remove();


	},


	// ADD USER ACTION TRIGGER
	// ADD USER ACTION TRIGGER
	// ADD USER ACTION TRIGGER

	addUserActionTrigger : function (parent) {


		// Bind
		var userActionTrigger = 
			parent
			.selectAll('.chrome-left-popup-trigger')
			.data(function(d) { return [d] })

		// Enter
		userActionTrigger
			.enter()
			.append('div')
			.classed('chrome-left-popup-trigger', true)

		// Update
		userActionTrigger
			.on('click', function (d) {
				var uuid = d.getUuid();
				this.openUserCard = uuid;
				this._refresh();
			}.bind(this));

		// Exit
		userActionTrigger
			.exit()
			.remove();


	},

	// ADD USER CARD
	// ADD USER CARD
	// ADD USER CARD

	addUserCard : function (parent) {

		// Bind
		var userCard = 
			parent
			.selectAll('.chrome-user-card')
			.data(function(d) { 
				var uuid = d.getUuid();

				// Only return data if we have a match
				if ( this.openUserCard == uuid ) return [d];

				// Return empty if not active (will not proceed);
				return []; 
			}.bind(this))

		// Enter
		userCard
			.enter()
			.append('div')
			.classed('chrome-user-card', true);			

		// Exit
		userCard
			.exit()
			.remove();



		// TOP CONTAINER
		// TOP CONTAINER
		// TOP CONTAINER

		// Top Container
		var topContainer = userCard
			.append('div')
			.classed('user-card-top-container', true);

		// Close button
		var closeButton = topContainer
			.append('div')
			.classed('user-card-close-button', true)
			.html('x')
			.on('click', function () {
				this.removeGhost();
			}.bind(this));

		// User name
		var userName = topContainer
			.append('div')
			.classed('card-user-name', true)
			.html(function (d) {
				return d.getFullName();
			});

		// Project count
		var projectCount = topContainer
			.append('div')
			.classed('card-user-project-count', true)
			.html(function (d) {
				var projects = d.getProjects();
				if ( projects.length == 1 ) return projects.length + ' project';
				return projects.length + ' projects';
			});


		// BOTTOM CONTAINER
		// BOTTOM CONTAINER
		// BOTTOM CONTAINER

		// Bottom Container
		var bottomContainer = userCard
			.append('div')
			.classed('user-card-bottom-container', true);

		var manageAccess = bottomContainer
			.append('div')
			.classed('manage-user-access', true)
			.html('Manage access')
			.on('click', function (d) {
				this.manageAccess(d);
			}.bind(this))

		var deleteUser = bottomContainer
			.append('div')
			.classed('delete-user', true)
			.html('Delete user')
			.on('click', function (d) {				
				this.deleteUser(d)
			}.bind(this))		

	},


	// DELETE USER
	// DELETE USER
	// DELETE USER

	deleteUser : function (user) {


		var name = user.getFirstName() + ' ' + user.getLastName();
		if (confirm('Are you sure you want to delete user ' + name + '?')) {
			if (confirm('Are you REALLY SURE you want to delete user ' + name + '?')) {
				this.confirmDelete(user);
			}			
		}		

	},

	confirmDelete : function (user) {

		// delete user         cb
		user.deleteUser(this, 'deletedUser');
		this._refresh();

	},



	// MANAGE ACCESS FOR USER
	// MANAGE ACCESS FOR USER
	// MANAGE ACCESS FOR USER

	manageAccess : function (user) {

		var accessFullScreen = this.accessFullScreen = Wu.DomUtil.create('div', 'manage-user-access-fullscreen', app._appPane);

		var manageAccessInner = Wu.DomUtil.create('div', 'manage-user-access-inner', accessFullScreen);
		var closeManageAccessButton = Wu.DomUtil.create('div', 'close-manage-user-access', accessFullScreen, 'x');

		var header = Wu.DomUtil.create('div', 'manage-access-title', manageAccessInner);
		header.innerHTML = '<span style="font-weight:200;">Manage access for</span> ' + user.getFullName();

		this.manageProjectsList(manageAccessInner);


		Wu.DomEvent.on(closeManageAccessButton, 'click', this.closeManageAccess, this);

	},

	closeManageAccess : function () {

		this.accessFullScreen.innerHTML = '';
		this.accessFullScreen.remove();
		this.removeGhost();

	},

	manageProjectsList : function(wrapper) {

		var projects = app.Projects;

		for ( var project in projects ) {

			var projectWrapper = Wu.DomUtil.create('div', 'manage-access-project-wrapper', wrapper);
			var projectTitle = Wu.DomUtil.create('div', 'manage-access-project-title', projectWrapper);
			projectTitle.innerHTML = projects[project].getName();

			var accessButtonsWrapper = Wu.DomUtil.create('div', 'manage-access-buttons-wrapper', projectWrapper);

			var viewButton = Wu.DomUtil.create('div', 'access-button view-project-button active', accessButtonsWrapper, 'View project');
			var downloadButton = Wu.DomUtil.create('div', 'access-button download-project-button', accessButtonsWrapper, 'Download data');
			var inviteButton = Wu.DomUtil.create('div', 'access-button invite-project-button active', accessButtonsWrapper, 'Invite others');
		}

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

		// Prepare data as array
		var data = _.toArray(this.users);

		// Init user list
		this.refreshUserList(data);			
	},

});