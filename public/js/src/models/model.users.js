Wu.User = Wu.Class.extend({ 

	initialize : function (store) {

		// set vars
		this.store = store;

		this.lastSaved = _.cloneDeep(store);

		// init file objects
		this.initFiles();

		this._listen();
	},

	_listen : function () {
		Wu.Mixin.Events.on('closeMenuTabs',   this._onCloseMenuTabs, this);
	},

	initFiles : function () {

		// get files
		var files = this.store.files;
		this._files = {};
		if (!files) return;

		// create
		files.forEach(function (file) {
			this._files[file.uuid] = new Wu.Model.File(file);
		}, this);
	},

	isContact : function () {
		if (!app.Account) return console.error('too early!');
		if (this.getUuid() == app.Account.getUuid()) return;

		var isContact = _.contains(app.Account.getContactListUuids(), this.getUuid());

		return isContact;
	},

	getContactListUuids : function () {
		var uuids = [];
		this.getContactList().forEach(function (c) {
			uuids.push(c.uuid);
		});
		return uuids;
	},

	getContactList : function ()  {
		return this.store.contact_list;
	},

	sendContactRequest : function (user) {

		var options = {
			contact : user.getUuid()
		}

		Wu.send('/api/user/requestContact', options, function (a, b) {

			console.log('request sent!', a, b);


			// set feedback 
			app.feedback.setMessage({
				title : 'Friend request sent',
				// description : description
			});


		}, this);

	},

	inviteToProjects : function (options) {

		var userUuid = this.getUuid();
		var userName = this.getFullName();
		var num = options.edit.length + options.read.length;

		var invites = {
			edit : options.edit,
			read : options.read,
			user : userUuid
		}

		// send to server
		Wu.send('/api/user/inviteToProjects', invites, function (a, response) {

			var result = Wu.parse(response);

			// set feedback 
			app.feedback.setMessage({
				title : 'Project invites sent!',
				description : userName + ' has been invited to ' + num + ' projects'
			});
			
			// update locally
			result.projects.forEach(function (projectAccess) {
				var project = app.Projects[projectAccess.project];
				project.store.access = projectAccess.access;
			});

		}.bind(this), this);

	},

	getFiles : function () {
		return this._files;
	},

	getFileStore : function (fileUuid) {
		var file = _.find(this.store.files, function (f) {
			return f.uuid == fileUuid;
		});
		return file;
	},

	getFile : function (fileUuid) {
		return this._files[fileUuid]; // return object
	},

	getUsername : function () {
		return this.store.username;
	},


	setFile : function (file) {
		this.store.files.push(file);
		this._files[file.uuid] = new Wu.Model.File(file);
		return this._files[file.uuid];
	},

	removeFile : function (file) {
		var fileUuid = file.file_id;
		var r = _.remove(this.store.files, function (f) {
			return f.uuid ==fileUuid;
		});

		this._files[fileUuid] = null;
		delete this._files[fileUuid];

	},

	// set functions
	setLastName : function (value) {
		this.store.lastName = value;
		this.save();
	},

	setFirstName : function (value) {
		this.store.firstName = value;
		this.save();
	},

	setCompany : function (value) {
		this.store.company = value;
		this.save();
	},

	setPosition : function (value) {
		this.store.position = value;
		this.save();
	},

	setPhone : function (value) {
		this.store.phone = value;
		this.save();
	},

	setMobile : function (value) {
		this.store.mobile = value;
		this.save();
	},

	setEmail : function (value) {
		this.store.local.email = value;
		this.save();
	},


	setKey : function (key, value) {
		if (key == 'lastName' ) return this.setLastName(value);
		if (key == 'firstName') return this.setFirstName(value);
		if (key == 'company'  ) return this.setCompany(value);
		if (key == 'position' ) return this.setPosition(value);
		if (key == 'mobile'   ) return this.setMobile(value);
		if (key == 'phone'    ) return this.setPhone(value);
		if (key == 'email'    ) return this.setEmail(value);
	},


	// save 
	save : function (key) {
		
		// clear timer
		if (this._saveTimer) clearTimeout(this._saveTimer);

		// save changes on timeout
		var that = this;
		this._saveTimer = setTimeout(function () {
		
			// find changes
			var changes = that._findChanges();
			
			// return if no changes
			if (!changes) return;

			that._save(changes);
		
		}, 1000);       // don't save more than every goddamed second

	},

	_save : function (changes) {
		if (app.activeProject) changes.project = app.activeProject.getUuid(); // for edit_user access, may need project...
		Wu.save('/api/user/update', JSON.stringify(changes)); 
	},


	attachToApp : function () {
		app.Users[this.getUuid()] = this;
	},


	deleteUser : function (context, callback) {

		// delete in local store
		delete app.Users[this.store.uuid];

		// delete on server
		var uuid = this.store.uuid;
		var json = JSON.stringify({ 
			uuid : uuid
		});

		// post              path          data           callback        context of cb
		Wu.Util.postcb('/api/user/delete', json, context[callback], context);

	},

	// get functions
	getKey : function (key) {
		return this.store[key];
	},

	getFirstName : function () {
		return this.store.firstName;
	},

	getLastName : function () {
		return this.store.lastName;
	},

	getFullName : function () {
		return this.store.firstName + ' ' + this.store.lastName;
	},

	getName : function () {
		return this.getFullName();
	},

	getCompany : function () {
		return this.store.company;
	},

	getPosition : function () {
		return this.store.position;
	},

	getPhone : function () {
		return this.store.phone;
	},

	getMobile : function () {
		return this.store.mobile;
	},

	getEmail : function () {
		return this.store.local.email;
	},

	getToken : function () {
		return this.store.token;
	},

	getProjects : function () {
		// get projects which user has a role in
		var allProjects = app.Projects,
		    projects = [];

		// return all if admin
		if (app.access.is.admin(this)) return _.values(allProjects);

		_.each(allProjects, function (p) {
			_.each(p.getRoles(), function (r) {
				if (r.hasMember(this) && !r.noRole()) {
					projects.push(p);
				}
			}, this)
		}, this);
		return projects;
	},

	getReadProjects : function () {
		var allProjects = app.Projects;

		var readProjects = _.filter(app.Projects, function (p) {
			return _.contains(p.getAccess().read, this.getUuid());
		}, this);

		return readProjects;
	},

	getEditProjects : function () {
		var allProjects = app.Projects;

		var editProjects = _.filter(app.Projects, function (p) {
			return _.contains(p.getAccess().edit, this.getUuid());
		}, this);

		return editProjects;
	},

	getUuid : function () {
		return this.store.uuid;
	},


	setRoles : function (roles) {
		// this._roles = [];
		// roles.forEach(function (r) {
		// 	var role = new Wu.Role({role : r});
		// 	this._roles.push(role);
		// }, this);
	},

	getRoles : function () {
		return this._roles;
	},


	// find changes to user.store for saving to server. works for two levels deep // todo: refactor, move to class?
	// hacky for realz! no good!!
	_findChanges : function () {
		var clone   = _.cloneDeep(this.store);
		var last    = _.cloneDeep(this.lastSaved);
		var changes = [];
		for (c in clone) {
			if (_.isObject(clone[c])) {
				var a = clone[c];
				for (b in a) {
					var d = a[b];
					equal = _.isEqual(clone[c][b], last[c][b]);
					if (!equal) {
						var change = {}
						change[c] = {};
						change[c][b] = clone[c][b];
						changes.push(change);
					}
				}
			} else {
				var equal = _.isEqual(clone[c], last[c]);
				if (!equal) {
					var change = {}
					change[c] = clone[c];
					changes.push(change);
				}
			}
		}
		if (changes.length == 0) return false; // return false if no changes
		var json = {};
		changes.forEach(function (change) {
			for (c in change) { json[c] = change[c]; }
		}, this);
		json.uuid = this.getUuid();
		this.lastSaved = _.cloneDeep(this.store);  // update lastSaved
		return json;
	},

	logout : function () {

		// confirm
		if (!confirm('Are you sure you want to log out?')) return;

		this._logout();
	},

	_logout : function () {
		
		// slack monitor
		app.Socket.sendUserEvent({
		    	user : app.Account.getFullName(),
		    	event : 'logged out.',
		    	description : '',
		    	timestamp : Date.now()
		});

		// redirect to logout
		window.location.href = app.options.servers.portal + 'logout';
	},


	addAccountTab : function () {

		// return; // todo later

		// register button in top chrome
		var top = app.Chrome.Top;

		// add a button to top chrome
		this._accountTab = top._registerButton({
			name : 'account',
			className : 'chrome-button share',
			trigger : this._toggleAccountTab,
			context : this,
			project_dependent : false
			
		});

		// user icon
		this._accountTab.innerHTML = '<i class="fa fa-user"></i>';

	},


	_toggleAccountTab : function () {


		this._accountTabOpen ? this._closeAccountTab() : this._openAccountTab();

	},

	_openAccountTab : function () {

		// close other tabs
		Wu.Mixin.Events.fire('closeMenuTabs');
		
		// create dropdown
		this._accountDropdown = Wu.DomUtil.create('div', 'share-dropdown account-dropdown', app._appPane);

		var account_name = app.Account.getUsername();

		// items
		this._accountName = Wu.DomUtil.create('div', 'share-item no-hover', this._accountDropdown, '<i class="fa fa-user logout-icon"></i>' + account_name);
		this._logoutDiv = Wu.DomUtil.create('div', 'share-item', this._accountDropdown, '<i class="fa fa-sign-out logout-icon"></i>Log out');

		// events
		Wu.DomEvent.on(this._logoutDiv,  'click', this.logout, this);

		this._accountTabOpen = true;
	},

	_closeAccountTab : function () {

		if (!this._accountTabOpen) return;

		Wu.DomEvent.off(this._logoutDiv,  'click', this.logout, this);

		Wu.DomUtil.remove(this._accountDropdown);

		this._accountTabOpen = false;
	},

	logout : function () {
		window.location.href = '/logout';
	},

	_onCloseMenuTabs : function () {
		
		// app.Chrome();
		this._closeAccountTab();
	},

	isSuper : function () {
		return this.store.access.account_type == 'super';
	},

	// _open : function () {

	// 	// close other tabs
	// 	Wu.Mixin.Events.fire('closeMenuTabs');

	// 	Wu.DomUtil.removeClass(this._shareDropdown, 'displayNone');
	// 	this._isOpen = true;

	// 	// add fullscreen click-ghost
	// 	// this._addGhost();

	// 	// mark button active
	// 	Wu.DomUtil.addClass(this._shareButton, 'active');

	// 	// fill titles
	// 	this._fillTitles();
	// },

	// _close : function () {
	// 	Wu.DomUtil.addClass(this._shareDropdown, 'displayNone');
	// 	this._isOpen = false;

	// 	// remove links if open
	// 	if (this._shareLinkWrapper) Wu.DomUtil.remove(this._shareLinkWrapper);
	// 	if (this._sharePDFInput) Wu.DomUtil.remove(this._sharePDFInput);
	// 	if (this._inviteWrapper) Wu.DomUtil.remove(this._inviteWrapper);
		
	// 	this._shareInviteButton.innerHTML = 'Invite users...';
	// 	Wu.DomUtil.removeClass(this._shareDropdown, 'wide-share');

	// 	// remove ghost
	// 	// this._removeGhost();

	// 	// mark button inactive
	// 	Wu.DomUtil.removeClass(this._shareButton, 'active');
	// },












});