Wu.SidePane.Users = Wu.SidePane.Item.extend({
	_ : 'sidepane.users', 


	type : 'users',
	title : 'User <br> Mngmt',

	initContent : function () {

		// create new fullscreen page, and set as default content
		this._content = Wu.DomUtil.create('div', 'fullpage-users', Wu.app._appPane);
		
		// create container (overwrite default) and insert template
		this._container = Wu.DomUtil.create('div', 'editor-wrapper', this._content, ich.usersPane());

		// get handles
		this._tableContainer = Wu.DomUtil.get('users-table-container');

		// render empty table
		this._tableContainer.innerHTML = ich.usersTableFrame();

		// get more handles
		this._table 	    = Wu.DomUtil.get('users-insertrows');
		this._addUser       = Wu.DomUtil.get('users-add-user');
		this._mainTitle     = Wu.DomUtil.get('user-management-client');
		this._deleteUser    = Wu.DomUtil.get('users-delete-user');
		this._checkall      = Wu.DomUtil.get('users-checkbox-all');
		this._checkallLabel = Wu.DomUtil.get('label-users-checkbox-all');

		// init table
		this.initList();

	},

	addHook : function () {
		this.addEditHooks();
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

	},

	// list.js plugin
	initList : function () { 
		
		// add dummy entry
		var tr = Wu.DomUtil.createId('tr', 'dummy-table-entry');
		tr.innerHTML = ich.usersTablerow({'type' : 'dummy-table-entry'});
		this._table.appendChild(tr);

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

		this._inputUser  = {};
		var titleText    = 'Create new user';
		var subtitleText = 'Enter details for the new user:';
		var messageText  = 'Password is auto-generated. The user will receive login details on email.';
		var container  = this._inputUser._container = Wu.DomUtil.create('div',   'backpane-container', this._content);
		var wrapper    = this._inputUser._wrapper   = Wu.DomUtil.create('div',   'backpane-wrapper',   container);
		var title      = this._inputUser._title     = Wu.DomUtil.create('div',   'backpane-title',     wrapper, titleText);
		var subtitle   = this._inputUser._subtitle  = Wu.DomUtil.create('div',   'backpane-subtitle',  wrapper, subtitleText);		
		var firstName  = this._inputUser._firstName = Wu.DomUtil.create('input', 'backpane-input',     wrapper, 'First Name');
		var lastName   = this._inputUser._lastName  = Wu.DomUtil.create('input', 'backpane-input',     wrapper, 'Last name');
		var email      = this._inputUser._email     = Wu.DomUtil.create('input', 'backpane-input',     wrapper, 'Email');
		var email2     = this._inputUser._email2    = Wu.DomUtil.create('input', 'backpane-input',     wrapper, 'Confirm Email');
		var message    = this._inputUser._message   = Wu.DomUtil.create('div',   'backpane-message',   wrapper, messageText);
		var cancel     = this._inputUser._cancel    = Wu.DomUtil.create('div',   'backpane-cancel smap-button-gray',    wrapper, 'Cancel');
		var confirm    = this._inputUser._confirm   = Wu.DomUtil.create('div',   'backpane-confirm smap-button-gray',   wrapper, 'Confirm');

		Wu.DomEvent.on(email,   'keyup',     this.checkUniqueEmail, this);
		Wu.DomEvent.on(email2,  'keyup',     this.checkSameEmail,   this);
		Wu.DomEvent.on(cancel,  'mousedown', this.cancelInput,      this);
		Wu.DomEvent.on(confirm, 'mousedown', this.confirmInput,     this);

		// cxxxx
		// Toggle wrappers
		this._container.style.display = 'none';

	},

	checkUniqueEmail : function (e) {
		// clear
		clearTimeout(this._checkUniqeEmailTimer);
		
		// check
		var context = this;
		this._checkUniqeEmailTimer = setTimeout(function() {
			var email = context._inputUser._email.value;
			var json = JSON.stringify({ 
				email : email
			});
			// post              path          data           callback        context of cb
			Wu.Util.postcb('/api/user/unique', json, context.checkedUniqueEmail, context);
		}, 250);         
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
	},

	confirmInput : function () {

		var firstName = this._inputUser._firstName.value;
		var lastName  = this._inputUser._lastName.value;
		var email     = this._inputUser._email.value;

		if (!firstName) return;
		if (!lastName) return;
		if (!email) return;
		if (!(this._inputUser.validEmail2 && this._inputUser.validEmail)) return;

		var input = {
			lastName  : lastName,
			firstName : firstName,
			email     : email
		}

		// create user
		this.createUser(input);
	
		// close backpane
		this.cancelInput();

		// Toggle pane
		this._container.style.display = 'block';
	},


	// send new user request to server
	createUser : function (input) {
		var data = JSON.stringify(input);
		if (!data) return;

		// get new user from server
		Wu.post('/api/user/new', data, this.createdUser, this);

	},

	// reply from server
	createdUser : function (context, json) {
		// console.log('createdUser: ', context, json);

		var store = JSON.parse(json);
		var user = new Wu.User(store);
		user.attachToApp();
		context.addTableItem(user); 	// todo: add user to top
	},



	deleteUser : function () {

		var checked = this.getSelected();

		// prevent seppuku
		var authUser = Wu.app.Account.store.uuid;
		var seppuku = false;
		checked.forEach(function (check) {
			if (check.uuid == authUser) seppuku = true;
		});
		if (seppuku) return console.error('Can\'t delete yourself.')
		

		// delete each selected user
		checked.forEach(function (user){
			// confirm delete
			var name = user.store.firstName + ' ' + user.store.lastName;
			if (confirm('Are you sure you want to delete user ' + name + '?')) {
				if (confirm('Are you REALLY SURE you want to delete user ' + name + '?')) {
					this.confirmDelete(user);
				}			
			}	
		}, this);
		
	},

	confirmDelete : function (user) {
		// delete user      cb
		user.deleteUser(this, 'deletedUser');
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

		// get selected files
		var checks = [];
		for (u in this.users) {
			var user = this.users[u];
			var checkbox = Wu.DomUtil.get('users-checkbox-' + user.store.uuid);
			if (checkbox) var checked = checkbox.checked; 
			if (checked) checks.push(user); 
		};
		return checks;
	},

	
	

	refreshTable : function () {
		
		this.users = app.Users;

		for (u in this.users) {
			var user = this.users[u];
			this.addTableItem(user);
		}
		
		// sort list by name by default
		this.list.sort('name', {order : 'asc'});

	},

	

	reset : function () {
		// clear table
		this.list.clear();
	},

	addTableItem : function (user) {

		// prepare template values
		var template = {};   
		template.name = ich.usersTablerowName({
			firstName     : user.getFirstName() || 'First name',
			lastName      : user.getLastName()  || 'Last name',
			lastNameUuid  : 'lastName-'  + user.getUuid(),
			firstNameUuid : 'firstName-' + user.getUuid(),
		});     
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

	getAccessTemplate : function (user) {
		// get no of projets etc for user
		var projects = user.getProjects();
		if (projects.length > 1) return projects.length + ' projects';
		return projects.length + ' project';
	},

	getProjectsTemplate : function (user) {
		var template = '';

		// all projects	for superusers
		if (user.isSuperuser()) {	
			for (p in app.Projects) {
				var project = app.Projects[p];
				if (!project) return;
				content = {
					name 		: project.store.name,
					description 	: project.store.description,
					uuid 		: project.store.uuid
				}
				template += ich.usersTableProjectItem(content);
			}
			return template;
		}
		
		// otherwise projects that user read/update/manage
		var projects = user.getProjects();
		if (!projects || projects.length == 0) return template;
		projects.forEach(function (uuid) {
			var project = app.Projects[uuid];
			if (!project) return;
			content = {
				name 		: project.store.name,
				description 	: project.store.description,
				uuid 		: project.store.uuid
			}
			template += ich.usersTableProjectItem(content);
		}, this);
		return template;
	},



	checkEscape : function (e) {
		if (e.keyCode == 27) this._popupCancel(); // esc key
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

	editAccess : function (uuid) {
		var user = app.Users[uuid];

		// open backpane
		this.manageAccess(user);
	},


	// fullscreen input for new user details
	manageAccess : function (user) {

		var titleText    = 'Manage access for ' + user.getName();
		var subtitleText = 'Manage read, write and manage access for this user.';
		var messageText  = '<h4>Guide:</h4>Managers can add READ access to projects they are managers for.';
		messageText     += '<br>Admins can add READ, WRITE and MANAGE access to projects they have created themselves.'
		var saClass      = user.isSuperadmin() ? 'green' : 'red';
		var aClass       = user.isAdmin() ? 'green' : 'red';

		var projects     = '';

		this._inputAccess = {};
		var container  = this._inputAccess._container     = Wu.DomUtil.create('div', 'backpane-access-container', this._content);
		var wrapper    = this._inputAccess._wrapper       = Wu.DomUtil.create('div', 'backpane-access-wrapper',   container);
		var title      = this._inputAccess._title         = Wu.DomUtil.create('div', 'backpane-title',     	  wrapper, titleText);
		var subtitle   = this._inputAccess._subtitle  	  = Wu.DomUtil.create('div', 'backpane-subtitle',  	  wrapper, subtitleText);		
		
		// admin boxes to display super/admin status
		var superadmin = this._inputAccess._superadmin    = Wu.DomUtil.create('div', 'backpane-superadmin-box ' + saClass, wrapper, 'Superadmin');
		var admin      = this._inputAccess._admin         = Wu.DomUtil.create('div', 'backpane-admin-box ' + aClass, wrapper, 'Admin');

		var subtitle2  = this._inputAccess._projectTitle  = Wu.DomUtil.create('div', 'backpane-projectTitle', 	  wrapper, 'Projects:');	
		var projectsWrap = this._inputAccess._projectsWrap = this.insertProjectWrap(user);	
		var confirm    = this._inputAccess._confirm   = Wu.DomUtil.create('div', 'backpane-confirm smap-button-gray',   wrapper, 'Done');
		var message    = this._inputAccess._message   = Wu.DomUtil.create('div', 'backpane-message',   wrapper, messageText);

		Wu.DomEvent.on(confirm, 'mousedown', this.closeManageAccess,     this);

		// Toggle wrappers
		this._container.style.display = 'none';
	},

	closeManageAccess : function () {
		
		Wu.DomUtil.remove(this._inputAccess._container);

		// Toggle wrappers
		this._container.style.display = 'block';

		// update errythign
		this.update();


	},

	insertProjectWrap : function (user) {

		// create wrapper
		var wrapper = Wu.DomUtil.create('div', 'backpane-projects-wrap', this._inputAccess._wrapper);

		// array of projects
		var projects = this._getProjectAccessSchema();
		if (projects.length == 0) return;

		// edit/manage delegation only for admins
		var managerPriv = app.Account.isAdmin() || app.Account.isSuperadmin(); // only super/admins allowed to delegate MANAGER
		var editorPriv = app.Account.isSuperadmin(); // only superadmins allowed to delegate EDITOR

		// add projects
		projects.forEach(function (project) {
			if (!project) return;

			var readClass   = (user.canReadProject(project.getUuid()))   ? 'gotAccess' : '';
			var editClass   = (user.canUpdateProject(project.getUuid())) ? 'gotAccess' : '';
			var manageClass = (user.canManageProject(project.getUuid())) ? 'gotAccess' : '';
			var titleText = project.getName() + ' (' + project.getClient().getName() + ')';

			var wrap    = Wu.DomUtil.create('div', 'access-projects-wrap', 			wrapper);
			var details = Wu.DomUtil.create('div', 'access-projects-details-wrap', 		wrap);
			var title   = Wu.DomUtil.create('div', 'access-projects-title', 		details, 	titleText);
			var desc    = Wu.DomUtil.create('div', 'access-projects-description', 		details, 	project.getDescription());
			var read    = Wu.DomUtil.create('div', 'access-projects-read ' + readClass, 	wrap, 		'Read');
			var edit, manage;

			if (editorPriv)    edit = Wu.DomUtil.create('div', 'access-projects-write ' + editClass, 	wrap, 		'Edit');
			if (managerPriv) manage = Wu.DomUtil.create('div', 'access-projects-manage ' + manageClass, wrap, 	'Manage');
			

			var item = {
				user    : user,
				project : project,
				read    : read,
				edit    : edit,
				manage  : manage
			}

			Wu.DomEvent.on(read, 'mousedown', function () { this.toggleReadAccess(item)}, this);
			if (editorPriv) Wu.DomEvent.on(edit,    'mousedown', function () { this.toggleUpdateAccess(item)}, this);
			if (managerPriv) Wu.DomEvent.on(manage, 'mousedown', function () { this.toggleManageAccess(item)}, this);

		}, this)


		return wrapper;
	},

	toggleReadAccess : function (item) {
		// console.log('toggle READ: ', item);
		var user = item.user;

		// get current state
		var state = (user.store.role.reader.projects.indexOf(item.project.getUuid())  >= 0) ? true : false;

		if (state) {
			// remove read access
			user.removeReadProject(item.project);
			Wu.DomUtil.removeClass(item.read, 'gotAccess');

		} else {
			// add read access
			user.addReadProject(item.project);
			Wu.DomUtil.addClass(item.read, 'gotAccess');
		}

	},


	toggleUpdateAccess : function (item) {
		// console.log('toggle: ', item);
		var user = item.user;

		// get current state
		var state = (user.store.role.editor.projects.indexOf(item.project.getUuid())  >= 0) ? true : false;

		if (state) {
			// remove read access
			user.removeUpdateProject(item.project);
			Wu.DomUtil.removeClass(item.edit, 'gotAccess');

		} else {
			// add read access
			user.addUpdateProject(item.project);
			Wu.DomUtil.addClass(item.edit, 'gotAccess');

			// add read access too
			if (!user.canReadProject(item.project.getUuid())) {
				Wu.DomUtil.addClass(item.read, 'gotAccess');
				setTimeout(function () { user.addReadProject(item.project); }, 300);
			}

		}

	},

	toggleManageAccess : function (item) {
		// console.log('toggle: ', item);
		var user = item.user;

		// get current state
		var state = (user.store.role.manager.projects.indexOf(item.project.getUuid())  >= 0) ? true : false;

		if (state) {
			// remove read access
			user.removeManageProject(item.project);
			Wu.DomUtil.removeClass(item.manage, 'gotAccess');

		} else {
			// add manage access
			user.addManageProject(item.project);
			Wu.DomUtil.addClass(item.manage, 'gotAccess');

			// add read access too
			if (!user.canReadProject(item.project.getUuid())) {
				Wu.DomUtil.addClass(item.read, 'gotAccess');
				setTimeout(function () { user.addReadProject(item.project); }, 300);
			}

		}

	},

	_getProjectAccessSchema : function () {

		// get all projects for superusers
		// if (app.Account.isSuperadmin()) {
		// 	return _.toArray(app.Projects);
		// }

		// // manager: get projects user is manager for
		// var readerProjects = [];
		// app.Account.store.role.reader.projects.forEach(function (project) {
		// 	readerProjects.push(app.Projects[project]);
		// }, this);
		// return _.toArray(readerProjects);

		// todo: other users

		// manager: get projects user is manager for
		var managerProjects = [];
		app.Account.store.role.manager.projects.forEach(function (project) {
			managerProjects.push(app.Projects[project]);
		}, this);
		return _.toArray(managerProjects);


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
		
		var div   = e.target;
		var value = e.target.innerHTML;
		var key   = e.target.getAttribute('key');
		var uuid  = e.target.getAttribute('uuid');

		var input = ich.injectInput({ 
			value : value, 
			key   : key , 
			uuid  : uuid 
		});
		
		// inject <input>
		div.innerHTML = input;

		var target = div.firstChild;

		// enable editing on input box
		//e.target.removeAttribute('readonly'); 
		target.focus();
		target.selectionStart = target.selectionEnd;

		// save on blur or enter
		Wu.DomEvent.on( target,  'blur', this._editBlur, this );     // save folder title
		Wu.DomEvent.on( target,  'keydown', this._editKey, this );     // save folder title

	},

	_editKey : function (e) {
		// blur on enter
		if (event.which == 13 || event.keyCode == 13) e.target.blur();
	},

	_editBlur : function (e) {

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