// app.SidePane.Users
Wu.SidePane.Users = Wu.SidePane.Item.extend({
	_ : 'sidepane.users', 

	type : 'users',
	title : 'Users',

	// initContent : function () {
	_initContent : function () {
		// create new fullscreen page, and set as default content
		this._content = Wu.DomUtil.create('div', 'fullpage-users', Wu.app._appPane);
		this._innerContent = Wu.DomUtil.create('div', 'users-inner', this._content);
		
		this.fullsize = true;
		this._expandCollapse = Wu.DomUtil.create('div', 'users-expand-collapse', this._innerContent);

		// Users Control
		this._usersControls = Wu.DomUtil.create('div', 'users-controls', this._innerContent);
		this._usersControlsInner = Wu.DomUtil.create('div', 'users-controls-inner', this._usersControls);

		// Search users
		this._search = Wu.DomUtil.create('input', 'users-search search', this._usersControlsInner);
		this._search.setAttribute("type", "text");
		this._search.setAttribute("placeholder", "Search users");

		// Add user button
		this._addUser = Wu.DomUtil.create('div', 'users-add-user smap-button-gray users', this._usersControlsInner, 'Create user');

		// Delete user button
		this._deleteUser = Wu.DomUtil.create('div', 'users-delete-user smap-button-gray users', this._usersControlsInner, 'Delete user');

		// create container (overwrite default) and insert template
		this._container = Wu.DomUtil.create('div', 'editor-wrapper', this._innerContent);

		// #userlist
		this._userList = Wu.DomUtil.create('div', 'userlist', this._container);

		// #user-management-client
		this._mainTitle = Wu.DomUtil.create('h4', 'user-management-client', this._userList);

		// #users-table-container
		this._tableContainer = Wu.DomUtil.create('div', 'users-table-container', this._userList);

		// #userslist
		this._uList = Wu.DomUtil.createId('div', 'userslist', this._tableContainer);

		// init table
		var tableOptions      		= { container : this._uList, searchfield : this._search };
		this._userList 			= new Wu.UserList(tableOptions);		

		// add tooltip
		app.Tooltip.add(this._menu, '(Editors only) List of all users. Here you can create and delete users, as well as administer user access to projects.');

		// add hooks
		this.addHooks();
	},

	addHooks : function () {
		Wu.DomEvent.on(this._expandCollapse, 'mousedown', this.toggleSize, this);
	},

	toggleSize : function () {

		// go small or large
		this.fullsize ? this.setSmallSize() : this.setFullSize();
	},

	setFullSize : function () {
		Wu.DomUtil.removeClass(this._content, 'minimal');
		Wu.DomUtil.removeClass(this._expandCollapse, 'expand');
		Wu.DomUtil.addClass(app._map._container, 'map-blur');
		this.fullsize = true;	
		this.refreshTable({tableSize : 'full'});	
	},

	setSmallSize : function () {
		Wu.DomUtil.addClass(this._content, 'minimal');
		Wu.DomUtil.addClass(this._expandCollapse, 'expand');
		Wu.DomUtil.removeClass(app._map._container, 'map-blur');
		this.fullsize = false;
		this.refreshTable({tableSize : 'small'});
	},	

	addEditHooks : function () {
		
		// add button
		Wu.DomEvent.on(this._addUser, 'mousedown', this.inputUser, this);

		// delete button
		Wu.DomEvent.on(this._deleteUser, 'mousedown', this.deleteUser, this);

		// show edit buttons
		Wu.DomUtil.removeClass(this._addUser, 'displayNone');
		Wu.DomUtil.removeClass(this._deleteUser, 'displayNone');
		Wu.DomUtil.removeClass(this._addUser, 'displayNone');
	},

	removeEditHooks : function () {
		
		// add button
		Wu.DomEvent.off(this._addUser, 'mousedown', this.inputUser, this);

		// delete button
		Wu.DomEvent.off(this._deleteUser, 'mousedown', this.deleteUser, this);

		// hide edit buttons
		Wu.DomUtil.addClass(this._addUser, 'displayNone');
		Wu.DomUtil.addClass(this._deleteUser, 'displayNone');
		Wu.DomUtil.addClass(this._addUser, 'displayNone');
	},

	// fired when different sidepane selected, for clean-up
	_deactivate : function () {

		// show other controls
		this._showControls();
	},

	_activate : function () {

		// hide other controls
		this._hideControls();

		// hide manage if open
		if (this._manage) this._manage.close();
	},

	_hideControls : function () {
		app.Controller.hideControls();
	},

	_showControls : function () {
		app.Controller.showControls();
	},

	searchList : function (e) {
		if (e.keyCode == 27) { // esc
			this.list.search(); // show all
			this._search.value = '';
			return;
		}

		// get value and search
		var value = this._search.value;
		this.list.search(value);

		// Google Analytics event tracking
		app.Analytics.setGaEvent(['Side Pane', 'Users: Search users', value]);
	},

	updateContent : function () {
		this.update();
	},

	update : function () {

		// Remove map-blur if small size 
		if ( !this.fullsize ) Wu.DomUtil.removeClass(app._map._container, 'map-blur');		

		// flush
		this.reset();

		// refresh table entries
		this.refreshTable({reset: true});

		// add edit hooks
		this.addEditHooks();
	},
	
	// input fullscreen for new user details
	inputUser : function () {

		// Google Analytics event tracking
		app.Analytics.setGaEvent(['Side Pane', 'Users: Create new user']);

		// Hide the Create user etc.
		Wu.DomUtil.addClass(this._content, 'hide-top', this);

		// pølse
		this._inputUser  = {};
		var titleText    = 'Create new user';
		var subtitleText = 'Enter details for the new user:';
		var messageText  = 'Password is auto-generated. The user will receive login details on email.';
		var container    = this._inputUser._container = Wu.DomUtil.create('div',   'backpane-container', this._innerContent);
		var wrapper      = this._inputUser._wrapper   = Wu.DomUtil.create('div',   'backpane-wrapper',   container);
		var title        = this._inputUser._title     = Wu.DomUtil.create('div',   'backpane-title',     wrapper, titleText);
		var subtitle     = this._inputUser._subtitle  = Wu.DomUtil.create('div',   'backpane-subtitle',  wrapper, subtitleText);		
		var firstName    = this._inputUser._firstName = Wu.DomUtil.create('input', 'backpane-input',     wrapper, 'First Name');
		var lastName     = this._inputUser._lastName  = Wu.DomUtil.create('input', 'backpane-input',     wrapper, 'Last Name');
		var companyName	 = this._inputUser._companyName = Wu.DomUtil.create('input', 'backpane-input',     wrapper, 'Company Name');
		var position	 = this._inputUser._position  = Wu.DomUtil.create('input', 'backpane-input',     wrapper, 'Position');
		var phoneNo	 = this._inputUser._phoneNo   = Wu.DomUtil.create('input', 'backpane-input',     wrapper, 'Phone Number');
		var email        = this._inputUser._email     = Wu.DomUtil.create('input', 'backpane-input',     wrapper, 'Email');
		var email2       = this._inputUser._email2    = Wu.DomUtil.create('input', 'backpane-input',     wrapper, 'Confirm Email');
		var message      = this._inputUser._message   = Wu.DomUtil.create('div',   'backpane-message',   wrapper, messageText);
		var cancel       = this._inputUser._cancel    = Wu.DomUtil.create('div',   'backpane-cancel smap-button-gray',    wrapper, 'Cancel');
		var confirm      = this._inputUser._confirm   = Wu.DomUtil.create('div',   'backpane-confirm smap-button-gray',   wrapper, 'Confirm');

		Wu.DomEvent.on(email,   'keyup',     this.checkUniqueEmail, this);
		Wu.DomEvent.on(email2,  'keyup',     this.checkSameEmail,   this);
		Wu.DomEvent.on(cancel,  'mousedown', this.cancelInput,      this);
		Wu.DomEvent.on(confirm, 'mousedown', this.confirmInput,     this);

		// Toggle wrappers
		this._container.style.display = 'none';
	},

	checkUniqueEmail : function (e) {
		// clear
		clearTimeout(this._checkUniqeEmailTimer);
		
		// check
		this._checkUniqeEmailTimer = setTimeout(function() {
			var email = this._inputUser._email.value;
			var json = JSON.stringify({ 
				email : email
			});
			// post              path          data           callback        context of cb
			Wu.Util.postcb('/api/user/unique', json, this.checkedUniqueEmail, this);
		}.bind(this), 250);         
	},

	checkedUniqueEmail : function (context, data) {
		var email = JSON.parse(data);
		var div   = context._inputUser._email;
		
		var valid = context._validateEmail(div.value);
		// mark valid
		if (email.unique && valid) {
			Wu.DomUtil.addClass(div, 'valid');
			Wu.DomUtil.removeClass(div, 'invalid');
			context._inputUser.validEmail = true;
		} else {
			Wu.DomUtil.addClass(div, 'invalid');	
			Wu.DomUtil.removeClass(div, 'valid');		
			context._inputUser.validEmail = false;
		}
	},

	checkSameEmail : function (e) {
		var email1 = this._inputUser._email;
		var email2 = this._inputUser._email2;

		var valid = this._validateEmail(email1.value);

		// mark valid
		if (email1.value == email2.value && valid) {
			Wu.DomUtil.addClass(email2, 'valid');
			Wu.DomUtil.removeClass(email2, 'invalid');
			this._inputUser.validEmail2 = true;
		} else {
			Wu.DomUtil.addClass(email2, 'invalid');
			Wu.DomUtil.removeClass(email2, 'valid');
			this._inputUser.validEmail2 = false;
		}
	},

	_validateEmail : function (email) {
		 var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    		return re.test(email);
	},

	cancelInput : function (e) {
		Wu.DomUtil.remove(this._inputUser._container);
		this._container.style.display = 'block';

		// Show the Create user etc.
		Wu.DomUtil.removeClass(this._content, 'hide-top', this);

		// Google Analytics event tracking
		app.Analytics.setGaEvent(['Side Pane', 'Users: Cancel create new user']);
	},

	_setMissingField : function (field) {
		Wu.DomUtil.addClass(this._inputUser._message, 'error');
		this._inputUser._message.innerHTML = 'Missing field: ' +  field;
	},

	confirmInput : function () {

		var firstName = this._inputUser._firstName.value;
		var lastName  = this._inputUser._lastName.value;
		var email     = this._inputUser._email.value;
		var companyName	= this._inputUser._companyName.value;
		var position	= this._inputUser._position.value;
		var phoneNo	= this._inputUser._phoneNo.value;

		// return on missing info
		if (!firstName) return this._setMissingField('First name');
		if (!lastName) return this._setMissingField('Last name');;
		if (!email) return this._setMissingField('Email');;
		if (!(this._inputUser.validEmail2 && this._inputUser.validEmail)) return;

		var input = {
			lastName  : lastName,
			firstName : firstName,
			email     : email,
			company   : companyName,
			position  : position,
			phone     : phoneNo,
		}

		// create user
		this.createUser(input);
	
		// close backpane
		this.cancelInput();

		// Toggle pane
		this._container.style.display = 'block';

		// Show the Create user etc.
		Wu.DomUtil.removeClass(this._content, 'hide-top', this);

		// Google Analytics event tracking
		app.Analytics.setGaEvent(['Side Pane', 'Users: Confirm new user', firstName + ' ' + lastName]);


	},

	// send new user request to server
	createUser : function (data) {
		if (!data) return;

		// managers only have create_user access on project, so include project // todo: what if no project selected?
		if (app.activeProject) data.project = app.activeProject.getUuid();

		// get new user from server
		Wu.post('/api/user/new', JSON.stringify(data), this.createdUser, this);

	},

	// reply from server
	createdUser : function (context, json) {

		var store = JSON.parse(json);
		console.log(store);
		if (store.error) return console.error(store.error);

		var user = new Wu.User(store);
		user.attachToApp();

		// update table
		context.reset();

		context.refreshTable({add : store});

		// feedback
		app.FeedbackPane.setSuccess({
			title : 'User created',
			description : 'The user <strong>' + user.getFullName() + '</strong> has been created. The user will receive an email with login details.'
		});
	},

	deleteUser : function () {		

		var checked = this.getSelected();

		// prevent seppuku
		var authUser = app.Account.getUuid();
		var seppuku = false;
		checked.forEach(function (check) {
			if (check.uuid == authUser) seppuku = true;
		});
		if (seppuku) return console.error('Can\'t delete yourself.')
		

		// delete each selected user
		_.each(checked, function (user) {

			console.log('user', user);
			// confirm delete
			var name = user.getFirstName() + ' ' + user.getLastName();
			if (confirm('Are you sure you want to delete user ' + name + '?')) {
				if (confirm('Are you REALLY SURE you want to delete user ' + name + '?')) {
					this.confirmDelete(user);
				}			
			}

			// Google Analytics event tracking
			app.Analytics.setGaEvent(['Side Pane', 'Users: Delete user', name]);

		}, this);
		
	},

	confirmDelete : function (user) {

		// delete user         cb
		user.deleteUser(this, 'deletedUser');
		
	},

	deletedUser : function (context) {
		// refresh
		context.reset();
		context.refreshTable({remove : 'TODO: find user ID'});
	},
	
	checkAll : function () {
		// console.log('checkAll');
	},

	getSelected : function () {

		var selected = this._userList.getSelected();
		return selected;

	},

	_filteredUsers : function () {
		// if superadmin, get all
		if (app.Access.is.superAdmin(app.Account)) return app.Users;

		// filter out superadmins
		return _.filter(app.Users, function (u) {
			return !app.Access.is.superAdmin(u);
		});
	},
	

	refreshTable : function (options) {

		var opts = {};

		opts.context = this._userList;
		opts.listData = app.Users;

		if (options.reset) {
			opts.reset = true;
			opts.canEdit = this._canEdit();			
		}

		if (options.remove) {
			opts.remove = options.remove;
		}		

		if (options.add) {
			opts.add = options.add;
		}
		
		if (options.tableSize) {
			opts.tableSize = options.tableSize;
		}

		this._userList.updateTable(opts);

	},
	
	reset : function () {
	},

	_canEdit : function () {

		// TODO -- WTF??
		return true;
	},

	// on click on # of projects box
	editAccess : function (uuid) {
		var user = app.Users[uuid];

		// open backpane
		this._manage = new Wu.SidePane.Manage({
			user : user,
			caller : this
		});

		this._manage.addTo(this._innerContent);

		// hide top bar
		Wu.DomUtil.addClass(this._content, 'hide-top', this);

		// Google Analytics event tracking
		app.Analytics.setGaEvent(['Side Pane', 'Users: Edit access', user.getName() + ' (' + user.getUuid() + ' )']);
	},

	_hide : function () {
		Wu.DomUtil.addClass(this._container, 'displayNone');
		Wu.DomUtil.addClass(this._content, 'hide-top');	
	},

	_show : function () {
		Wu.DomUtil.removeClass(this._content, 'hide-top');	
		Wu.DomUtil.removeClass(this._container, 'displayNone');	
	},

	// to prevent selected text
	stop : function (e) {
		e.preventDefault();
		e.stopPropagation();
	},

	save : function (key, value, userUuid) {
		var user = app.Users[userUuid];
		user.setKey(key, value);
	},

});