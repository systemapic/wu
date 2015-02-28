Wu.Role = Wu.Class.extend({

	initialize : function (options) {
		// set
		this.store = options.role;
		this._project = options.project;
	},

	addMember : function (user, callback) {

		var options = {
			user : user,
			project : this._project,
			role : this
		}

		app.access.addRoleMember(options, callback);

	},


	getName : function () {
		return this.store.name;
	},

	getMembers : function () {
		return this.store.members;
	},

	getCapabilities : function () {
		return this.store.capabilities;
	},

	getUuid : function () {
		return this.store.uuid;
	},

	hasMember : function (member) {
		return _.contains(this.getMembers(), member.getUuid());
	},

	isMember : function (member) {
		return _.contains(this.getMembers(), member.getUuid());
	},

	hasCapability : function (cap) {
		return this.getCapabilities()[cap];
	},

	_save : function () {

		// save to server


	},
});



Wu.Role.Super = Wu.Role.extend({

	addMember : function (user, callback) {
		console.log('adding ', user.getName(), ' to role ', this.getName());

		
		var options = {
			userUuid : user.getUuid(),
			roleUuid : this.getUuid()
		}

		console.log('addMember', options);
		
		// send
		Wu.send('/api/access/super/setrolemember', options, function (err, json) {
			console.log('/api/access/super/setrolemember', err, json);
			if (err) console.error(err);
			callback(err, json);
		});

	},

});


Wu.Role.Portal = Wu.Role.extend({

	addMember : function (user, callback) {
		console.log('adding ', user.getName(), ' to role ', this.getName());

		var options = {
			userUuid : user.getUuid(),
			roleUuid : this.getUuid()
		}

		console.log('addMember', options);
		
		// send
		Wu.send('/api/access/portal/setrolemember', options, function (err, json) {
			console.log('/api/access/portal/setrolemember', err, json);
			if (err) console.error(err);
			callback(err, json);
		});

	},

});