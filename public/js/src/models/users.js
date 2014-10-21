Wu.User = Wu.Class.extend({ 

	initialize : function (store) {
		this.store = store;
		this.lastSaved = _.cloneDeep(store);
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

	setAccess : function (project) {
		// console.log('setAccess to new proejct: ', project);
		// todo!
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
		Wu.save('/api/user/update', JSON.stringify(changes)); 
	},


	// convenience method
	isSuperuser : function () {
		return this.isSuperadmin();
	},
	isSuperadmin : function () {
		if (this.store.role.superadmin) return true;
		return false;
	},
	isAdmin : function () {
		if (this.store.role.admin) return true;
		return false;
	},
	isManager : function () {
		if (_.size(this.store.role.manager.projects) > 0 || this.isAdmin() || this.isSuperadmin()) return true;
		return false;
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


	// set project access
	delegateAccess : function (project, role, add) {

		// save to server, only specific access
		var access = {
			userUuid    : this.getUuid(),
			projectUuid : project.getUuid(),
			// clientUuid  : project.getClientUuid(),
			role        : role, // eg. 'reader'
			add         : add // true or false
		}

		// post              path 	             data               callback     context of cb
		Wu.Util.postcb('/api/user/delegate', JSON.stringify(access), this.delegatedAccess, this);

		// this._saveAccess(access)
		app.setSaveStatus();
	},

	delegatedAccess : function (context, result) {

	},

	// convenience methods
	addReadProject : function (project) {

		// save to server, only specific access
		this.delegateAccess(project, 'reader', true);

		// add access locally
		this.store.role.reader.projects.push(project.getUuid());

	},

	removeReadProject : function (project) {

		// save to server, only specific access
		this.delegateAccess(project, 'reader', false);

		// remove access locally
		_.remove(this.store.role.reader.projects, function (p) {
			return p == project.getUuid();
		});
	},


	addUpdateProject : function (project) {
		
		// save to server, only specific access
		this.delegateAccess(project, 'editor', true);

		// add access locally
		this.store.role.editor.projects.push(project.getUuid());
	},

	removeUpdateProject : function (project) {

		// save to server, only specific access
		this.delegateAccess(project, 'editor', false);

		// remove access
		_.remove(this.store.role.editor.projects, function (p) {
			return p == project.getUuid();
		});
	},


	addManageProject : function (project) {
		// save to server, only specific access
		this.delegateAccess(project, 'manager', true);

		// add access locally
		this.store.role.manager.projects.push(project.getUuid());
	},

	removeManageProject : function (project) {

		// save to server, only specific access
		this.delegateAccess(project, 'manager', false);

		// remove access
		_.remove(this.store.role.manager.projects, function (p) {
			return p == project.getUuid();
		});
	},


	addProjectAccess : function (project) {
		// add access locally
		var uuid = project.getUuid();
		this.store.role.editor.projects.push(uuid);
		this.store.role.reader.projects.push(uuid);
		this.store.role.manager.projects.push(uuid);
	},

	removeProjectAccess : function (project) {
		// remove access locally
		_.remove(this.store.role.manager.projects, function (p) {
			return p == project.getUuid();
		});
		_.remove(this.store.role.editor.projects, function (p) {
			return p == project.getUuid();
		});
		_.remove(this.store.role.reader.projects, function (p) {
			return p == project.getUuid();
		});
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

	getProjects : function () {
		var projects = [];
		projects.push(this.store.role.reader.projects);
		projects.push(this.store.role.editor.projects);
		projects.push(this.store.role.manager.projects);
		projects = _.flatten(projects);
		projects = _.unique(projects);
		return projects;
	},

	getProjectsByRole : function () {
		var projects    = {};
		projects.read   = this.store.role.reader.projects;
		projects.update = this.store.role.editor.projects;
		projects.manage = this.store.role.manager.projects;
		return projects;
	},

	getClients : function () {
		var clients = {};
		clients.read = this.store.role.reader.clients;
		clients.update = this.store.role.editor.clients;
		return clients;
	},

	getUuid : function () {
		return this.store.uuid;
	},














	// CRUD
	canCreateProject : function () {
		if (this.store.role.superadmin) return true;
		if (this.store.role.admin)      return true;
		return false;
	},

	canReadProject : function (projectUuid) {
		// var user = this.store;
		// if (user.role.superadmin) return true;
		// if (user.role.admin)      return true;
		// if (user.role.manager.projects.indexOf(projectUuid) >= 0) return true; // managers can create readers for own projects
		// if (user.role.editor.projects.indexOf(projectUuid)  >= 0) return true; // managers can create readers for own projects
		
		if (this.store.role.reader.projects.indexOf(projectUuid)  >= 0) return true;
		return false;
	},

	canUpdateProject : function (projectUuid) {
		// console.log('checking if user ' + this.store.lastName + ' can update project : ' + projectUuid);
		// var user = this.store;
		// if (user.role.superadmin) return true;
		// if (user.role.admin)      return true;


		if (this.store.role.editor.projects.indexOf(projectUuid) >= 0) return true; // managers can create readers for own projects
		return false;
	},

	canDeleteProject : function (projectUuid) {
		var editor = (this.store.role.editor.projects.indexOf(projectUuid) >= 0) ? true : false;
		if (this.store.role.superadmin && editor) return true;
		if (this.store.role.admin && editor)      return true;
		return false;
	},

	canManageProject : function (projectUuid) {
		// var user = this.store;
		// if (user.role.superadmin) return true;
		// if (user.role.admin)      return true;
		if (this.store.role.manager.projects.indexOf(projectUuid) >= 0) return true;
		return false;
	},

	canCreateClient : function () {
		var user = this.store;
		if (user.role.superadmin) return true;
		if (user.role.admin)      return true;
		return false;
	},
	
	canReadClient : function (uuid) {
		// var user = this.store;
		// if (user.role.superadmin) return true;
		// if (user.role.admin)      return true;
		// if (user.role.manager.clients.indexOf(uuid) >= 0) return true; // managers can create readers for own projects
		// if (user.role.editor.clients.indexOf(uuid)  >= 0) return true; // managers can create readers for own projects
		if (this.store.role.reader.clients.indexOf(uuid)  >= 0) return true; // managers can create readers for own projects
		return false;
	},

	canUpdateClient : function (uuid) {
		// var user = this.store;

		// if (user.role.superadmin) return true;
		// if (user.role.admin)      return true;
		if (this.store.role.editor.clients.indexOf(uuid) >= 0) return true; // managers can create readers for own projects
		return false;
	},

	canDeleteClient : function (clientUuid) {
		var editor = (this.store.role.editor.clients.indexOf(clientUuid) >= 0) ? true : false;
		if (this.store.role.superadmin && editor) return true;
		if (this.store.role.admin && editor)      return true;
		return false;	
	},

	canCreateSuperadmin : function () {
		// var user = this.store;
		if (this.store.role.superadmin) return true;
		return false;
	},

	canCreateAdmin : function () {
		// var user = this.store;
		if (user.role.superadmin) return true;
		if (user.role.admin)      return true; 	// admins can create other admins
		return false;
	},

	canCreateUser : function (uuid) {
		var user = this.store;
		if (user.role.superadmin) return true;
		if (user.role.admin)      return true;
		if (user.role.manager.projects.indexOf(uuid) >= 0) return true;
		return false;
	},

	canUpdateUser : function () {
		var user = this.store;
		if (user.role.superadmin) return true;
		if (user.role.admin)      return true;

		// todo
		return false;	
	},

	canDeleteUser : function () {

	},





	// find changes to user.store for saving to server. works for two levels deep // todo: refactor, move to class?
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

});