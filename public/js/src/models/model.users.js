Wu.User = Wu.Class.extend({ 

	initialize : function (store) {
		this.store = store;
		this.lastSaved = _.cloneDeep(store);

		// init file objects
		this.initFiles();
	},

	initFiles : function () {

		// get files
		var files = this.store.files;
		this._files = {};
		if (!files) return;

		// create
		files.forEach(function (file) {
			this._files[file.uuid] = new Wu.Files(file);
		}, this);
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


	setFile : function (file) {
		this.store.files.push(file);
		this._files[file.uuid] = new Wu.Files(file);
		return this._files[file.uuid];
	},

	removeFile : function (file) {
		var fileUuid = file.file_id;
		var r = _.remove(this.store.files, function (f) {
			return f.uuid ==fileUuid;
		});

		this._files[fileUuid] = null;
		delete this._files[fileUuid];

		console.log('REMMM r', r);
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

	getUuid : function () {
		return this.store.uuid;
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

});