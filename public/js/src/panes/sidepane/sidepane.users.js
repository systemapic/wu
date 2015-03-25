// app.SidePane.Users
Wu.SidePane.Users = Wu.SidePane.Item.extend({
	_ : 'sidepane.users', 

	type : 'users',
	title : 'Users',

	// initContent : function () {
	_initContent : function () {
		// create new fullscreen page, and set as default content
		this._content = Wu.DomUtil.create('div', 'fullpage-users', Wu.app._appPane);
		
		// Users Control
		this._usersControls = Wu.DomUtil.create('div', 'users-controls', this._content);
		this._usersControlsInner = Wu.DomUtil.create('div', 'users-controls-inner', this._usersControls);

		// Add user button
		this._addUser = Wu.DomUtil.create('div', 'users-add-user smap-button-gray users', this._usersControlsInner, 'Create user');

		// Delete user button
		this._deleteUser = Wu.DomUtil.create('div', 'users-delete-user smap-button-gray users', this._usersControlsInner, 'Delete user');

		// Search users
		this._search = Wu.DomUtil.createId('input', 'users-search search', this._usersControlsInner);
		this._search.setAttribute("type", "text");
		this._search.setAttribute("placeholder", "Search users");

		// create container (overwrite default) and insert template
		this._container = Wu.DomUtil.create('div', 'editor-wrapper', this._content);

		// #userlist
		this._userList = Wu.DomUtil.create('div', 'userlist', this._container);

		// #user-management-client
		this._mainTitle = Wu.DomUtil.create('h4', 'user-management-client', this._userList);

		// #users-table-container
		this._tableContainer = Wu.DomUtil.create('div', 'users-table-container', this._userList);


		// #userslist
		this._uList = Wu.DomUtil.createId('div', 'userslist', this._tableContainer);

		// #users-table
		var table = Wu.DomUtil.create('table', 'users-table', this._uList)
		var thead = Wu.DomUtil.create('thead', '', table);
		var tr = Wu.DomUtil.create('tr', '', thead);
		
		var th1 = Wu.DomUtil.create('th', 'fivep', tr);
		th1.setAttribute('data-sort', 'checkbox');

		// #users-squaredThree-checkbox-all
		var th1_CBcontainer = Wu.DomUtil.create('div', 'squaredThree users-squaredThree-checkbox-all', th1);

		// #users-checkbox-all
		this._checkall = Wu.DomUtil.create('input', 'users-checkbox-all', th1_CBcontainer);
		this._checkall.setAttribute('type', 'checkbox');
		this._checkall.setAttribute('name', 'check');
		this._checkall.setAttribute('value', 'None');
		
		// #label-users-checkbox-all
		this._checkallLabel = Wu.DomUtil.create('label', 'label-users-checkbox-all', th1);
		this._checkallLabel.setAttribute('for', 'users-checkbox-all');

		var th2 = Wu.DomUtil.create('th', 'sort name thirtyp', tr, 'Name');
		th2.setAttribute('data-sort', 'name');
		th2.setAttribute('data-insensitive', 'true');

		var th3 = Wu.DomUtil.create('th', 'sort company', tr, 'Company');
		th3.setAttribute('data-sort', 'company');
		th3.setAttribute('data-insensitive', 'true');

		var th4 = Wu.DomUtil.create('th', 'sort position', tr, 'Position');
		th4.setAttribute('data-sort', 'position');
		th4.setAttribute('data-insensitive', 'true');

		var th5 = Wu.DomUtil.create('th', 'sort phone', tr, 'Phone');
		th5.setAttribute('data-sort', 'phone');
		th5.setAttribute('data-insensitive', 'true');

		var th6 = Wu.DomUtil.create('th', 'sort email', tr, 'Email');
		th6.setAttribute('data-sort', 'email');
		th6.setAttribute('data-insensitive', 'true');

		var th7 = Wu.DomUtil.create('th', 'sort projects', tr, 'Access');
		th7.setAttribute('data-sort', 'projects');
		th7.setAttribute('data-insensitive', 'true');	

		// #users-insertrows
		this._table = Wu.DomUtil.createId('tbody', 'users-insertrows', table)
		this._table.className = 'list';

		// init table
		this.initList();

		// add tooltip
		app.Tooltip.add(this._menu, '(Editors only) List of all users. Here you can create and delete users, as well as administer user access to projects.');

		// add hooks
		this.addHooks();

	},

	addHooks : function () {
		// search
		Wu.DomEvent.on(this._search, 'keyup', this.searchList, this);
	},

	addEditHooks : function () {
		
		// add button
		Wu.DomEvent.on(this._addUser, 'mousedown', this.inputUser, this);

		// delete button
		Wu.DomEvent.on(this._deleteUser, 'mousedown', this.deleteUser, this);

		// check all button
		Wu.DomEvent.on(this._checkallLabel, 'mousedown', this.checkAll, this);

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

		// check all button
		Wu.DomEvent.off(this._checkallLabel, 'mousedown', this.checkAll, this);

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
		app.Analytics.ga(['Side Pane', 'Users: Search users', value]);
	},

	// list.js plugin
	initList : function () { 

		// add dummy entry
		var _tr = Wu.DomUtil.createId('tr', 'dummy-table-entry');

		this._table.appendChild(_tr);

		var _td1 = Wu.DomUtil.create('td', 'checkbox', _tr);
		var _cBox = Wu.DomUtil.create('div', 'squaredThree', _td1);
		var _cBoxInput = Wu.DomUtil.create('input', '', _cBox);
		_cBoxInput.setAttribute('type', 'checkbox');
		_cBoxInput.setAttribute('value', 'None');
		_cBoxInput.setAttribute('name', 'check');
		var _cBoxLabel = Wu.DomUtil.create('label', '', _cBox);
		
		var _td2 = Wu.DomUtil.create('td', 'name', _tr);

		var _td3 = Wu.DomUtil.create('td', 'tdcont company', _tr);
		_td3.setAttribute('key', 'company');
		_td3.setAttribute('id', 'company-');
		_td3.setAttribute('uuid', '');

		var _td4 = Wu.DomUtil.create('td', 'tdcont position', _tr);
		_td4.setAttribute('key', 'position');	
		_td4.setAttribute('id', 'position-');
		_td4.setAttribute('uuid', '');		

		var _td5 = Wu.DomUtil.create('td', 'tdcont phone', _tr);
		_td5.setAttribute('key', 'phone');
		_td5.setAttribute('id', 'phone-');
		_td5.setAttribute('uuid', '');		

		var _td6 = Wu.DomUtil.create('td', 'tdcont email', _tr);
		_td6.setAttribute('key', 'email');		
		_td6.setAttribute('id', 'email-');
		_td6.setAttribute('uuid', '');		

		var _td7 = Wu.DomUtil.create('td', 'tdcont access', _tr);
		_td7.setAttribute('key', 'access');	
		_td7.setAttribute('id', 'access-');
		_td7.setAttribute('uuid', '');		

		var _td8 = Wu.DomUtil.create('td', 'tdcont uuid', _tr);
		_td8.style.display = 'none';		

		// init list.js
		var options = { valueNames : ['name', 'company', 'position', 'phone', 'email', 'access'] };
		this.list = new List('userslist', options);

		// remove dummy
		this.list.clear();
	},

	updateContent : function () {
		this.update();
	},

	update : function () {

		// flush
		this.reset();

		// refresh table entries
		this.refreshTable();

		// add edit hooks
		this.addEditHooks();

	},
	
	// input fullscreen for new user details
	inputUser : function () {

		// Google Analytics event tracking
		app.Analytics.ga(['Side Pane', 'Users: Create new user']);

		// Hide the Create user etc.
		Wu.DomUtil.addClass(this._content, 'hide-top', this);

		this._inputUser  = {};
		var titleText    = 'Create new user';
		var subtitleText = 'Enter details for the new user:';
		var messageText  = 'Password is auto-generated. The user will receive login details on email.';
		var container    = this._inputUser._container = Wu.DomUtil.create('div',   'backpane-container', this._content);
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
		
		// mark valid
		if (email.unique) {
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

		// mark valid
		if (email1.value == email2.value) {
			Wu.DomUtil.addClass(email2, 'valid');
			Wu.DomUtil.removeClass(email2, 'invalid');
			this._inputUser.validEmail2 = true;
		} else {
			Wu.DomUtil.addClass(email2, 'invalid');
			Wu.DomUtil.removeClass(email2, 'valid');
			this._inputUser.validEmail2 = false;
		}
	},

	cancelInput : function (e) {
		Wu.DomUtil.remove(this._inputUser._container);
		this._container.style.display = 'block';

		// Show the Create user etc.
		Wu.DomUtil.removeClass(this._content, 'hide-top', this);

		// Google Analytics event tracking
		app.Analytics.ga(['Side Pane', 'Users: Cancel create new user']);
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
			phone     : phoneNo
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
		app.Analytics.ga(['Side Pane', 'Users: Confirm new user', firstName + ' ' + lastName]);

	},

	// send new user request to server
	createUser : function (data) {
		if (!data) return;

		// managers only have create_user access on project, so include project
		if (app.activeProject) data.project = app.activeProject.getUuid();

		// get new user from server
		Wu.post('/api/user/new', JSON.stringify(data), this.createdUser, this);

	},

	// reply from server
	createdUser : function (context, json) {

		var store = JSON.parse(json);
		if (store.error) return console.error(store.error);

		var user = new Wu.User(store);
		user.attachToApp();

		// update table
		context.reset();
		context.refreshTable();

		// GA – New User ID
		ga('set', 'dimension10', store.uuid);

		// GA – New User Name
		var newUserName = user.getFullName();
		ga('set', 'dimension11', newUserName);

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
			// confirm delete
			var name = user.getFirstName() + ' ' + user.getLastName();
			if (confirm('Are you sure you want to delete user ' + name + '?')) {
				if (confirm('Are you REALLY SURE you want to delete user ' + name + '?')) {
					this.confirmDelete(user);
				}			
			}

			// Google Analytics event tracking
			app.Analytics.ga(['Side Pane', 'Users: Delete user', name]);

		}, this);
		
	},

	confirmDelete : function (user) {

		// delete user      cb
		user.deleteUser(this, 'deletedUser');

		// GA – Deleted Username
		var _delUsrName = user.getFullName();
		ga('set', 'dimension12', _delUsrName);	 	// todo	
		
	},

	deletedUser : function (context) {
		// refresh
		context.reset();
		context.refreshTable();
	},
	
	checkAll : function () {
		// console.log('checkAll');
	},

	getSelected : function () {

		console.log('getSelected:', this.users);

		// get selected files
		var checks = [];
		// for (u in this.users) {
		_.each(this.users, function (user) {
			console.log('user: ', user);
			var checkbox = Wu.DomUtil.get('users-checkbox-' + user.getUuid());
			if (checkbox) var checked = checkbox.checked; 
			if (checked) checks.push(user); 
		});

		console.log('cheks:', checks);
			
		return checks;
	},

	_filteredUsers : function () {
		// if superadmin, get all
		if (app.Access.is.superAdmin(app.Account)) return app.Users;

		// filter out superadmins
		return _.filter(app.Users, function (u) {
			return !app.Access.is.superAdmin(u);
		});
	},
	
	refreshTable : function () {
		this.users = this._filteredUsers();

		_.each(this.users, function (user) {
			this.addTableItem(user);
		}, this);			

		// sort list by name by default
		this.list.sort('name', {order : 'asc'});
	},
	
	reset : function () {
		// clear table
		this.list.clear();
	},

	// add user entry to table
	addTableItem : function (user) {

		// prepare template values
		var template = {};   

		var tmpData = {
			firstName     : user.getFirstName() || 'First name',
			lastName      : user.getLastName()  || 'Last name',
			lastNameUuid  : 'lastName-'  + user.getUuid(),
			firstNameUuid : 'firstName-' + user.getUuid()			
		}

		// These must for some obscure reason be as strings...
		var tmpLastNameString = '<input value="' + tmpData.lastName + '" id="' + tmpData.lastNameUuid + '" class="dln" readonly="readonly">';
		var tmpFirstNameString = '<input value="' + tmpData.firstName + '" id="' + tmpData.firstNameUuid + '" class="dln smallerText" readonly="readonly">';

		template.name 	  = tmpLastNameString + tmpFirstNameString;
		template.email    = user.getEmail();
		template.position = user.getPosition();
		template.company  = user.getCompany();
		template.mobile   = user.getMobile();
		template.phone    = user.getPhone();
		template.access   = this.getAccessTemplate(user);
			       
		// add users to list.js, and add to DOM
		var ret = this.list.add(template);

		// hack: manually add id's for event triggering                 TODO refactor, ich.
		// for whole table
		var nodes = ret[0].elm.children;
		for (var i = 0; i < nodes.length; i++) {
			var node = nodes[i];

			// main checkbox, label
			if (i == 0) {
				node.children[0].children[0].id = 'users-checkbox-' + user.getUuid();
				node.children[0].children[1].setAttribute('for', 'users-checkbox-' + user.getUuid());
			}

			// other divs
			if (!node.id == '') {
				node.id = node.id + user.getUuid();
				node.setAttribute('uuid', user.getUuid());
			}
		};
	
		// add edit hooks
		this.setEditHooks(user.getUuid());
	},


	// # of projects box in user entry
	getAccessTemplate : function (user) {

		var divProjectsOpen = '<div class="user-projects-button">';
		var divProjectsClose = '</div>';

		// get no of projets etc for user
		var projects = user.getProjects();
		var numProjects = projects ? projects.length : 0;
		var projectsText = numProjects == 1 ? ' project' : ' projects';

		return divProjectsOpen + numProjects + projectsText + divProjectsClose;
	},

	setEditHooks : function (uuid, onoff) {
		var onoff = onoff || 'on';

		// get <input>'s
		var lastName    = Wu.DomUtil.get('lastName-' + uuid);
		var firstName   = Wu.DomUtil.get('firstName-' + uuid);
		var company     = Wu.DomUtil.get('company-' + uuid);
		var position    = Wu.DomUtil.get('position-' + uuid);
		var phone       = Wu.DomUtil.get('phone-' + uuid);
		var email       = Wu.DomUtil.get('email-' + uuid);
		var access      = Wu.DomUtil.get('access-' + uuid);

		// set click hooks on title and description
		Wu.DomEvent
			[onoff]( lastName,       'mousedown mouseup click',     this.stop,      this ) 
			[onoff]( lastName,       'dblclick',                    this.rename,    this )     
			[onoff]( firstName,      'mousedown mouseup click',     this.stop,      this ) 
			[onoff]( firstName,      'dblclick',                    this.rename,    this )     
			[onoff]( company,        'mousedown mouseup click',     this.stop,      this ) 
			[onoff]( company,        'dblclick',                    this._rename,   this )     
			[onoff]( position,       'mousedown mouseup click',     this.stop,      this ) 
			[onoff]( position,       'dblclick',                    this._rename,   this )     
			[onoff]( phone,          'mousedown mouseup click',     this.stop,      this ) 
			[onoff]( phone,          'dblclick',                    this._rename,   this )     
			[onoff]( email,          'mousedown mouseup click',     this.stop,      this ) 
			// [onoff]( email,          'dblclick',                    this._rename,   this )     
			[onoff]( access,         'click',                    function () { this.editAccess(uuid); }, this )     
	},

	// on click on # of projects box
	editAccess : function (uuid) {
		var user = app.Users[uuid];

		// open backpane
		this._manage = new Wu.SidePane.Manage({
			user : user,
			caller : this
		});

		this._manage.addTo(this._content);

		// hide top bar
		Wu.DomUtil.addClass(this._content, 'hide-top', this);

		// Google Analytics event tracking
		app.Analytics.ga(['Side Pane', 'Users: Edit access', user.getName() + ' (' + user.getUuid() + ' )']);
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

	rename : function (e) {

		// enable editing on input box
		e.target.removeAttribute('readonly'); 
		e.target.focus();
		e.target.selectionStart = e.target.selectionEnd;

		// set key
		e.target.fieldKey = e.target.id.split('-')[0];

		// save on blur or enter
		Wu.DomEvent.on( e.target, 'blur',    this.editBlur, this );
		Wu.DomEvent.on( e.target, 'keydown', this.editKey,  this );


		// Google Analytics event tracking
		app.Analytics.ga(['Side Pane', 'Users: Edit ' + e.target.fieldKey]);
	},

	editKey : function (e) {
		// blur on enter
		if (event.which == 13 || event.keyCode == 13) e.target.blur();
	},

	editBlur : function (e) {

		// get key
		var key = e.target.fieldKey;

		// set back to readonly
		e.target.setAttribute('readonly', 'readonly');                                                                                                                                                                                         
		
		// get user uuid
		var userUuid = e.target.id.replace(key + '-', '');

		// get new title
		var value = e.target.value || e.target.innerHTML;

		// save to server
		this.save(key, value, userUuid);
	},

	// rename a div, ie. inject <input>
	_rename : function (e) {

		// To make sure that no other fields are being edited
		if ( this._isFocus )  this._forceStopBlur(this._previousTarget);

		var div   = e.target;
		var value = e.target.innerHTML;
		var key   = e.target.getAttribute('key');
		var uuid  = e.target.getAttribute('uuid');

		var inputData = { 
			value : value, 
			key   : key , 
			uuid  : uuid 
		};

		// clear namespace
		div.innerHTML = '';

		var input = Wu.DomUtil.create('input', 'inject-input', div);
		input.setAttribute('key', inputData.key);
		input.setAttribute('value', inputData.value);
		input.setAttribute('uuid', inputData.uuid);

		var target = div.firstChild;

		// Store previous target, in case it's still in focus when we enter edit mode.
		this._previousTarget = target;

		// enable editing on input box
		target.focus();

		target.selectionStart = target.selectionEnd;

		// We're in focus mode – in case it doesn't snap out of it.
		this._isFocus = true;

		// save on blur or enter
		Wu.DomEvent.on( target,  'blur', this._editBlur, this );       // save folder title
		Wu.DomEvent.on( target,  'keydown', this._editKey, this );     // save folder title


	},

	_editKey : function (e) {

		// blur on enter
		if (event.which == 13 || event.keyCode == 13) e.target.blur();
	},

	// Like _editBlur below, but if we go from editing one field to another one, the first one doesn't snap out of editing mode
	// this function will take care of that.
	_forceStopBlur : function (el) {

		// Snap out of focus mode
		this._isFocus = false;

		// get value
		var value = el.value;
		var key   = el.getAttribute('key');
		var user  = el.getAttribute('uuid');

		// revert to <div>
		var div = el.parentNode;

		//refresh list
		this.list.update();

		// save to server
		this.save(key, value, user);		
	},

	_editBlur : function (e) {

		// Snap out of focus mode
		this._isFocus = false;

		// get value
		var value = e.target.value;
		var key   = e.target.getAttribute('key');
		var user  = e.target.getAttribute('uuid');

		// revert to <div>
		var div = e.target.parentNode;
		div.innerHTML = value;

		//refresh list
		this.list.update();

		// save to server
		this.save(key, value, user);
	},

	save : function (key, value, userUuid) {
		var user = app.Users[userUuid];
		user.setKey(key, value);
	},

});