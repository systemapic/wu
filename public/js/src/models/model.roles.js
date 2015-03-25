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

	noRole : function () {
		return this.store.slug == 'noRole';
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

	getSlug : function () {
		return this.store.slug;
	},

	hasMember : function (member) {
		var has = _.contains(this.getMembers(), member.getUuid());
		if (has) {
			return true;
		} else {
			return false;
		}
	},

	isMember : function (member) {
		return _.contains(this.getMembers(), member.getUuid());
	},

	hasCapability : function (cap) {
		var caps = this.getCapabilities();
		if (!caps) return false;
		return this.getCapabilities()[cap];
	},

});



Wu.Role.Super = Wu.Role.extend({

	addMember : function (user, callback) {
		
		var options = {
			userUuid : user.getUuid(),
			roleUuid : this.getUuid()
		}

		// send
		Wu.send('/api/access/super/setrolemember', options, function (err, json) {
			callback(err, json);
		});

	},

});


Wu.Role.Portal = Wu.Role.extend({

	addMember : function (user, callback) {

		var options = {
			userUuid : user.getUuid(),
			roleUuid : this.getUuid()
		}
		
		// send
		Wu.send('/api/access/portal/setrolemember', options, function (err, json) {
			callback(err, json);
		});

	},

});