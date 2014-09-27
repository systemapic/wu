/*
 ██████╗██╗     ██╗███████╗███╗   ██╗████████╗
██╔════╝██║     ██║██╔════╝████╗  ██║╚══██╔══╝
██║     ██║     ██║█████╗  ██╔██╗ ██║   ██║   
██║     ██║     ██║██╔══╝  ██║╚██╗██║   ██║   
╚██████╗███████╗██║███████╗██║ ╚████║   ██║   
 ╚═════╝╚══════╝╚═╝╚══════╝╚═╝  ╚═══╝   ╚═╝   
*/
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
		this.editMode = false;
		if (app.Account.canUpdateClient(this.uuid)) this.editMode = true;
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

	update : function (field) {
		var json    = {};
		json[field] = this[field];
		json.uuid   = this.uuid;
		var string  = JSON.stringify(json);
		this._save(string);
	},

	_save : function (string) {
		Wu.save('/api/client/update', string);  // TODO: pgp & callback
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

	getDescription : function () {
		return this.description;
	},

	getLogo : function () {
		return this.logo;
	},

	getUuid : function () {
		return this.uuid;
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


});






/*
██████╗ ██████╗  ██████╗      ██╗███████╗ ██████╗████████╗
██╔══██╗██╔══██╗██╔═══██╗     ██║██╔════╝██╔════╝╚══██╔══╝
██████╔╝██████╔╝██║   ██║     ██║█████╗  ██║        ██║   
██╔═══╝ ██╔══██╗██║   ██║██   ██║██╔══╝  ██║        ██║   
██║     ██║  ██║╚██████╔╝╚█████╔╝███████╗╚██████╗   ██║   
╚═╝     ╚═╝  ╚═╝ ╚═════╝  ╚════╝ ╚══════╝ ╚═════╝   ╚═╝   
*/
// abstract class for each project - holds that project
Wu.Project = Wu.Class.extend({

	initialize : function (store) {
		
		// set dB object to store
		this.store = {};
		Wu.extend(this.store, store);

		// set editMode
		this.setEditMode();

		this.lastSaved = {};

		// ensure active project // todo: refactor, take this out
		if (!app.activeProject) app.activeProject = this;

		// attach client
		this._client = Wu.app.Clients[this.store.client];

		
	},

	initLayers : function () {

		// return if no layers
		if (!this.store.layers) return;

		this.layers = {};

		// add layers to project
		this.addLayers(this.store.layers);
	},

	addLayers : function (layers) { // array of layers
		layers.forEach(function (layer) {
			this.addLayer(layer);
		}, this);
	},

	addLayer : function (layer) {
		// creates a Wu.Layer object (could be Wu.MapboxLayer, Wu.RasterLayer, etc.)
		this.layers[layer.uuid] = new Wu.createLayer(layer);
	},

	setActive : function () {
		this.select();
	},

	setEditMode : function () {
		// set editMode
		this.editMode = false;
		if (app.Account.canUpdateProject(this.store.uuid)) this.editMode = true;
	},

	refresh : function () {

		// refresh project
		this._refresh();
	
		// refresh mappane
		this.refreshMappane();

		// refresh headerpane
		this.refreshHeaderpane();
	
		// refresh sidepane
		this.refreshSidepane();
	
	},

	refreshSidepane : function () {
		// update sidepane
		if (Wu.Util.isObject(Wu.app.SidePane)) Wu.app.SidePane.setProject(this);
	},

	refreshHeaderpane : function () {
		// update headerpane
		if (Wu.Util.isObject(Wu.app.HeaderPane)) Wu.app.HeaderPane.setProject(this);
	},

	refreshMappane : function () {
		// update mappane                
		if (Wu.Util.isObject(Wu.app.MapPane)) Wu.app.MapPane.setProject(this);
	},

	_refresh : function () {

		// set editMode
		this.setEditMode();

  		// create layers 
		this.initLayers();

		// update url
		this._setUrl();

		// update color theme
		this.setColorTheme();

	},

	select : function () {	// refactor, move to view?
 
		// set as active
		app.activeProject = this;

		// mark selected
		this.selected = true;

		// refresh project
		this.refresh();
		
	},

	_setUrl : function () {
		var url = '/';
		url += this._client.slug;
		url += '/';
		url += this.store.slug;
		Wu.Util.setAddressBar(url);
	},


	setStore : function (store) {
		this.store = store;
		this.refresh();
	},

	setMapboxAccount : function (store) {
		// full project store
		this.store = store;

		// refresh project and sidepane
		this._refresh();
		this.refreshSidepane();

	},


	_update : function (field) {
		console.log('field: ', field);
		console.log(this.store);
		var json = {};
		json[field] = this.store[field];
		json.uuid = this.store.uuid;



		// // dont save if no changes
		// var fieldclone = _.clone(this[field]);
		// console.log('fieldclone: ', fieldclone, this[field]);
		// if (this.lastSaved[field]) {
		//         if (_.isEqual(json[field], this.lastSaved[field])) {
		//                 console.log('shits equal, not saving!!', json[field], this.lastSaved[field]);
		//                 return;
		//         }
		// }
		// this.lastSaved[field] = fieldclone;
		// console.log('this.lastSaved= ', this.lastSaved);


		console.log('saving project field: ', json);

		var string = JSON.stringify(json);
		this._save(string);
		
	},


	save : function (field) {

		// save all fields that has changed since last save (or if no last save...?)
		// todo

	},
	

	_save : function (string) {
		console.log('saving...');                                       // TODO: pgp
		Wu.save('/api/project/update', string);                         // TODO: save only if actual changes! saving too much already
	},

	_saveNew : function (context) {
	     
		var options = {
			name 		: this.store.name,
			description 	: this.store.description,
			keywords 	: this.store.keywords, 
			client 		: this._client.uuid 			// parent client uuid 
		}
		var json = JSON.stringify(options);
		
		console.log('POST: _saveNew');
 		Wu.Util.postcb('/api/project/new', json, context._projectCreated, this);

	},

	unload : function () {
		Wu.app.MapPane.reset();
		Wu.app.HeaderPane.reset();
		this.selected = false;
	},


	_delete : function () {
		// var project = this;
		var json = JSON.stringify({ 
			    'pid' : this.store.uuid,
			    'projectUuid' : this.store.uuid,
			    'clientUuid' : this._client.uuid
		});
		
		// post with callback:    path       data    callback   context of cb
		Wu.Util.postcb('/api/project/delete', json, this._deleted, this);
	},

	_deleted : function (project, json) {
		// delete object
		delete Wu.app.Projects[project.uuid];
	},

	saveColorTheme : function () {
		
		// save color theme to project 
		this.colorTheme = savedCSS;
		this._update('colorTheme');

		console.log('saved color theme,', this.colorTheme.length);

	},

	setColorTheme : function () {
		if (!this.colorTheme) return;

		// set global color
		savedCSS = this.colorTheme;

		// inject
		Wu.Util.setColorTheme();

	},

	removeMapboxAccount : function (account) {
		_.remove(this.store.connectedAccounts.mapbox, function (m) {
			return m == account;
		});
		this._update('connectedAccounts');
	},

	getName : function () {
		return this.store.name;
	},

	getDescription : function () {
		return this.store.description;
	},

	getLogo : function () {
		return this.store.logo;
	},

	getUuid : function () {
		return this.store.uuid;
	},

	getClient : function () {
		return app.Clients[this.store.client];
	},

	getBaselayers : function () {
		return this.store.baseLayers;
	},

	getBounds : function () {
		var bounds = this.store.bounds;
		if (_.isEmpty(bounds)) return false;
		return bounds;
	},

	getLatLngZoom : function () {
		var position = {
			lat  : this.store.position.lat,
			lng  : this.store.position.lng,
			zoom : this.store.position.zoom
		};
		return position;
	},

	getPosition : function () {
		return this.getLatLngZoom();
	},

	getLayer : function (uuid) {
		return this.layers[uuid];
	},

	getFiles : function () {
		return this.store.files;
	},

	getCollections : function () {
		

	},

	setCollection : function () {


	},


	getUsers : function () {
		var uuid = this.store.uuid; // project uuid
		var users = _.filter(app.Users, function (user) {
			return user.store.role.reader.projects.indexOf(uuid) > -1;
		});
		return users;
	},

	getUsersHTML : function () {
		var users = this.getUsers();
		var html = '';

		users.forEach(function (user) {
			html += '<p>' + user.store.firstName + ' ' + user.store.lastName + '</p>';
		}, this);

		return html;
	},

	getHeaderLogo : function () {
		var logo = this.store.header.logo;
		if (!logo) logo = this.store.logo;
		return logo;
	},

	getHeaderTitle : function () {
		return this.store.header.title;
	},

	getHeaderSubtitle : function () {
		return this.store.header.subtitle;
	},

	getHeaderHeight : function () {
		return parseInt(this.store.header.height);
	},

	getMapboxAccounts : function () {
		return this.store.connectedAccounts.mapbox;
	},

	getControls : function () {
		return this.store.controls;
	},


	setLogo : function (path) {
		this.store.logo = path;
		this._update('logo');
	},

	setHeaderLogo : function (path) {
		this.store.header.logo = path;
		this._update('header');
	},

	setSlug : function (name) {
		var slug = name.replace(/\s+/g, '').toLowerCase();
		this.store.slug = slug;
		this._update('slug');
	},

	setBounds : function (bounds) {
		this.store.bounds = bounds;
		this._update('bounds');
	},

	setBoundsSW : function (bounds) {
		this.store.bounds.southWest = bounds;
		this._update('bounds');		
	},

	setBoundsNE : function (bounds) {
		this.store.bounds.northEast = bounds;
		this._update('bounds');
	},

	setBoundsZoomMin : function (zoomMin) {
		this.store.bounds.zoomMin = zoomMin;
		this._update('bounds');
	},

	setPosition : function (position) {
		this.store.position = position;
		console.log('this.store.posiiton: ', this.store.position);
		this._update('position');
	},


	getGrandeFiles : function () {
		var files = this.getFiles();
		var sources = this._formatGrandeFiles(files);
		return sources;
	},

	getGrandeImages : function () {
		var files = this.getFiles();
		var images = this._formatGrandeImages(files);
		return images;
	},

	// format images for Grande plugin
	_formatGrandeImages : function (files) {
		var sources = [];
		files.forEach(function (file) {
			if (file.type == 'image') {

				var thumbnail = '/pixels/' + file.uuid + '?width=50&height=50';
				var url = '/pixels/' + file.uuid + '?width=200&height=200';

				var source = {
				    	title : file.name, 	// title
				    	thumbnail : thumbnail,  // optional. url to image
				    	uuid : file.uuid,       // optional
					type : file.type,
					url : url
				}

				sources.push(source)
			}
		}, this);
		return sources;
	},

	// format files for Grande plugin
	_formatGrandeFiles : function (files) {
		var sources = [];
		files.forEach(function (file) {
			var thumbnail = (file.type == 'image') ? '/pixels/' + file.uuid + '?width=50&height=50' : '';
			var prefix = (file.type == 'image') ? '/images/' : '/api/file/download/?file=';
			var suffix = (file.type == 'image') ? '' : '&type=' + file.type;
			var url = '/pixels/' + file.uuid + '?width=200&height=200';
			
			var source = {
			    	title : file.name, 	// title
			    	thumbnail : thumbnail,  // optional. url to image
			    	uuid : file.uuid,       // optional
				type : file.type,
				url : url
			}

			sources.push(source)
		}, this);

		return sources;
	},
});












/*
██╗   ██╗███████╗███████╗██████╗ 
██║   ██║██╔════╝██╔════╝██╔══██╗
██║   ██║███████╗█████╗  ██████╔╝
██║   ██║╚════██║██╔══╝  ██╔══██╗
╚██████╔╝███████║███████╗██║  ██║
 ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝
*/

// each user 
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
		console.log('setAccess to new proejct: ', project);
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
			role        : role, // eg. 'reader'
			add         : add // true or false
		}

		// post              path 	             data               callback     context of cb
		Wu.Util.postcb('/api/user/delegate', JSON.stringify(access), this.delegatedAccess, this);

		// this._saveAccess(access)
	},

	delegatedAccess : function (context, result) {
		console.log('saved access!', context, result);
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
		this.store.role.editor.projects.push(project.getUuid());
		this.store.role.reader.projects.push(project.getUuid());
		this.store.role.manager.projects.push(project.getUuid());
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













