Wu.Client = Wu.Class.extend({

	initialize : function (options) {

		// set options
		Wu.extend(this, options);

		// set defaults
		this.options = {};
		this.options.editMode = false;

	},

	setEditMode : function () {
		// set editMode
		this.editMode = app.access.to.edit_client(this.getUuid())
	},

	setActive : function () {

		// set edit mode
		this.setEditMode();

		// update url
		this._setUrl();

		// do nothing if already active
		if (this._isActive()) return; 	// todo: remove? 

		// set active client
		Wu.app._activeClient = this;

	},

	_isActive : function () {
		if (Wu.Util.isObject(Wu.app._activeClient)) {
			if (Wu.app._activeClient.uuid == this.uuid) return true;   
		}
		return false;
	},

	_setUrl : function () {
		var url = '/'+ this.slug + '/';
		Wu.Util.setAddressBar(url);
	},

	_refreshUrl : function () {
		var project = app.activeProject ? app.activeProject.getSlug() : '';
		var url = '/' + this.slug + '/' + project;
		Wu.Util.setAddressBar(url);
	},

	update : function (field) {
		var json    = {};
		json[field] = this[field];
		json.uuid   = this.uuid;
		var string  = JSON.stringify(json);
		this._save(string);
	},

	_save : function (string) {
		Wu.send('/api/client/update', string, this._saved.bind(this));  // TODO: pgp & callback
	},

	_saved : function (err, json) {
		console.log('client saved', err, json);

		var result = Wu.parse(json);

		if (result.error) return app.feedback.setError({
			title : 'Client not updated', 
			description : result.error
		});

		if (result.name) {
			// name has been updated, add slug also
			var slug = result.name[0].name.replace(/\s+/g, '').toLowerCase();
			this.setSlug(slug);
		}

		if (result.slug) {
			this._refreshUrl();
		}
	},

	saveNew : function () {
		var options = {
			name 		: this.name,
			description 	: this.description,
			keywords 	: this.keywords
		}

		var json   = JSON.stringify(options);
		var editor = Wu.app.SidePane.Clients;

		Wu.Util.postcb('/api/client/new', json, editor._created, this);

	},

	destroy : function () {
		this._delete();
	},

	_delete : function () {
		var client = this;
		var json = { 'cid' : client.uuid };
		json = JSON.stringify(json);

		// post with callback:    path       data    callback   context of cb
		Wu.Util.postcb('/api/client/delete', json, client._deleted, client);
	},

	_deleted : function (client, json) {
		// delete object
		delete Wu.app.Clients[client.uuid];
	},


	getName : function () { 	// todo: move to this.store.name;
		return this.name;
	},

	getTitle : function () {
		return this.getName();
	},

	getDescription : function () {
		return this.description;
	},

	getLogo : function () {
		return this.logo;
	},

	getPixelLogo : function (options) {

	},

	getUuid : function () {
		return this.uuid;
	},

	getSlug : function () {
		return this.slug;
	},

	getProjects : function () {
		return _.filter(app.Projects, function (p) {
			return p.getClientUuid() == this.getUuid();
		}, this);
	},

	setName : function (name) {
		this.name = name;
		this.update('name');
	},

	setDescription : function (description) {
		this.description = description;
		this.update('description');
	},

	setLogo : function (logo) {
		this.logo = logo;
		this.update('logo');
	},

	setSlug : function (slug) {
		this.slug = slug;
		this.update('slug');
	},


});