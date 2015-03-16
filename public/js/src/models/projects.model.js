Wu.Project = Wu.Class.extend({

	initialize : function (store) {

		// set dB object to store
		this.store = {};
		Wu.extend(this.store, store);

		// set editMode
		this.setEditMode();

		// ready save object
		this.lastSaved = {};

		// attach client
		this._client = Wu.app.Clients[this.store.client];

		// init roles
		this.initRoles();

	},

	initRoles : function () {
		var roles = this.store.roles;
		this._roles = {};
		_.each(roles, function (role) {
			this._roles[role.uuid] = new Wu.Role({
				role : role,
				project : this
			});
		}, this);
	},

	initFiles : function () {

		var files = this.getFiles();

		// files object
		this.files = {};

		files.forEach(function (file) {
			this.files[file.uuid] = new Wu.Files(file);
		}, this);

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
		// this.store.layers.push(layer); /// TODO: WEIRD to add to array here, it's run in line 41?????
		this.layers[layer.uuid] = new Wu.createLayer(layer);

		return this.layers[layer.uuid];
	},

	addBaseLayer : function (layer) {
		this.store.baseLayers.push(layer);
		this._update('baseLayers');
	},

	removeBaseLayer : function (layer) {
		_.remove(this.store.baseLayers, function (b) { return b.uuid == layer.getUuid(); });
		this._update('baseLayers');
	},

	createOSMLayer : function (callback) {

		var title = this._getOSMLayerTitle();

		var options = JSON.stringify({
			projectUuid : this.getUuid(),
			title : title
		});

		// get new layer from server
 		Wu.Util.postcb('/api/layers/osm/new', options, function (ctx, json) {

 			var layer = ctx.addLayer(JSON.parse(json));

 			// callback to wherever intiated
 			callback(null, layer);

 		}, this);

	},

	_getOSMLayerTitle : function () {
		var already = _.filter(this.getLayers(), function (l) {
			return l.store.data.osm;
		});

		var title = 'Open Street Map';
		var num = already.length;
		if (num) title += ' #' + num;

		return title;
	},

	

	createLayerFromGeoJSON : function (geojson) {

		// set options
		var options = JSON.stringify({
			project 	: this.getUuid(),
			geojson 	: geojson,
			layerType 	: 'geojson'
		});
		
		// get new layer from server
 		Wu.Util.postcb('/api/layers/new', options, this._createdLayerFromGeoJSON, this);
	},

	_createdLayerFromGeoJSON : function (context, data) {

		// parse layer data
		var parsed = JSON.parse(data);
		
		// callback
		app.SidePane.DataLibrary.uploaded(parsed, {
			autoAdd : true
		});
	},

	createLayer : function () {

	},

	setActive : function () {
		this.select();
	},

	setEditMode : function () {
		// set editMode
		this.editMode = false;
		this.editMode = app.access.to.edit_project(this);
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

		// set active project in sidepane
		if (this._menuItem) this._menuItem._markActive();

		if (app.StatusPane.isOpen) {
			app._map._controlCorners.topleft.style.opacity = 0;
			app._map._controlCorners.topleft.style.display = 'none';
		}
	},

	addNewLayer : function (layer) {
		this.addLayer(layer);
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


	_reset : function () {
		// this.removeHooks();



	},


	_refresh : function () {

		// flush
		this._reset();

		// set editMode
		this.setEditMode();

		// init files
		this.initFiles();

  		// create layers 
		this.initLayers();

		// init roles
		this.initRoles();

		// update url
		this._setUrl();

		// set settings
		this.refreshSettings();
		
		// update color theme
		this.setColorTheme();

		// update project in sidepane
		if (this._menuItem) this._menuItem.update();
	},

	select : function () {

		console.log('tooltip size', _.size(this.tips));

		Wu.Mixin.Events.fire('projectSelected', {detail : this});

		// hide headerpane
 		if (app._headerPane) Wu.DomUtil.removeClass(app._headerPane, 'displayNone');

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

	setNewStore : function (store) {
		this.store = store;
		this.select();
	},

	setStore : function (store) {
		this.store = store;
		this.refresh();
	},

	setRolesStore : function (roles) {
		this.store.roles = roles;
		this._refresh();
	},

	setMapboxAccount : function (store) {
		// full project store
		this.store = store;

		// refresh project and sidepane
		this._refresh();
		this.refreshSidepane();
	},


	_update : function (field) {

		// set fields
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


		// save to server
		var string = JSON.stringify(json);
		this._save(string);
	},


	save : function (field) {

		// save all fields that has changed since last save (or if no last save...?)
		// todo
	},
	

	_save : function (string) {
		// save to server                                       	// TODO: pgp
		Wu.send('/api/project/update', string, this._saved.bind(this));                         // TODO: save only if actual changes! saving too much already
	
		
	},

	// callback for save
	_saved : function (ctx, json) {

		var result = Wu.parse(json);
		if (result.error) return app.feedback.setError({
			title : "Could not update project", 
			description : result.error
		});

		// set status
		app.setSaveStatus();
	},

	_saveNew : function (opts) {
	     	var callback = opts.callback;

		var options = {
			name 		: this.store.name,
			description 	: this.store.description,
			keywords 	: this.store.keywords, 
			position 	: this.store.position,
			client 		: this._client.uuid 			// parent client uuid 
		}
		var json = JSON.stringify(options);
		
 		Wu.Util.postcb('/api/project/new', json, callback.bind(opts.context), this);
	},

	unload : function () {
		app.MapPane.reset();
		app.HeaderPane.reset();
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
		
		// set address bar
		var client = project.getClient().getSlug();
		var url = app.options.servers.portal + client + '/';
		var deletedProjectName = project.getName();

		// set url
		Wu.Util.setAddressBar(url)

		// delete object
		app.Projects[project.getUuid()] = null;
		delete app.Projects[project.getUuid()];

		// set no active project if was active
		if (app.activeProject == this) {
			app.SidePane.refresh(['Projects', 'Users', 'Account']);
			app.activeProject = null;
			delete app.activeProject;
		}

		project = null;
		delete project;

		// set status
		app.setStatus('Deleted!');

		// Save new project name to GA
		ga('set', 'dimension9', deletedProjectName);

	},

	saveColorTheme : function () {
		
		// save color theme to project 
		this.colorTheme = savedCSS;
		this._update('colorTheme');
	},

	setColorTheme : function () {
		if (!this.colorTheme) return;

		// set global color
		savedCSS = this.colorTheme;

		// inject
		Wu.Util.setColorTheme();

	},

	removeMapboxAccount : function (account) {
		var removed = _.remove(this.store.connectedAccounts.mapbox, function (m) {	// todo: include access token
			return m == account;
		});
		this._update('connectedAccounts');

		// todo: remove active layers, etc.
		var layers = this.getLayers();

		var lids = [];

		layers.forEach(function (layer) {
			if (!layer.store.data) return;
			if (!layer.store.data.mapbox) return;

			var mid = layer.store.data.mapbox;
			var m = mid.split('.')[0];
			if (m == account.username) {
				this._removeLayer(layer);
				lids.push(layer.getUuid());
			}
		}, this);

		// todo: remove on server, ie. remove layers from project...
		// remove from server
		var json = {
		    projectUuid : this.getUuid(),
		    layerUuids : lids
		}
		var string = JSON.stringify(json);
		Wu.save('/api/layers/delete', string); 

	},

	_removeLayer : function (layer) {

		// remove from layermenu & baselayer store
		_.remove(this.store.layermenu, function (item) { return item.layer == layer.getUuid(); });
		_.remove(this.store.baseLayers, function (b) { return b.uuid == layer.getUuid(); });

		// remove from layermenu
		var layerMenu = app.MapPane.layerMenu;
		if (layerMenu) layerMenu.onDelete(layer);

		// remove from map
		layer.remove();
			
		// remove from local store
		var a = _.remove(this.store.layers, function (item) { return item.uuid == layer.getUuid(); });	// dobbelt opp, lagt til to ganger! todo
		delete this.layers[layer.getUuid()];

		// save changes
		this._update('layermenu'); 
		this._update('baseLayers');

	},	

	getName : function () {
		return this.store.name;
	},

	getTitle : function () {
		return this.getName();
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

	getLastUpdated : function () {
		return this.store.lastUpdated;
	},

	getClient : function () {
		return app.Clients[this.store.client];
	},

	getClientUuid : function () {
		return this.store.client;
	},

	getBaselayers : function () {
		return this.store.baseLayers;
	},

	getLayermenuLayers : function () {
		return _.filter(this.store.layermenu, function (l) {
			return !l.folder;
		});
	},

	getLayers : function () {
		return _.toArray(this.layers);
	},

	getActiveLayers : function () {

		// get all layers in project
		var base = this.getBaselayers();
		var lm = this.getLayermenuLayers();
		var all = base.concat(lm);
		var layers = [];
		all.forEach(function (a) {
			if (!a.folder) {
				var id = a.layer || a.uuid;
				var layer = this.layers[id];
				layers.push(layer);
			}
		}, this);
		return layers;
	},

	getLayer : function (uuid) {
		return this.layers[uuid];
	},

	getStylableLayers : function () {
		// get active baselayers and layermenulayers that are editable (geojson)
		var all = this.getActiveLayers();
		var cartoLayers = _.filter(all, function (l) {

			if (l) {
				if (l.store.data.hasOwnProperty('geojson')) return true;
				if (l.store.data.hasOwnProperty('osm')) return true;

			} else {
				return false;
			}
		});
		return cartoLayers;
	},

	getLayerFromFile : function (fileUuid) {
		return _.find(this.layers, function (l) {
			return l.store.file == fileUuid;
		});
	},

	getFiles : function () {
		return this.store.files;
	},

	getFileObjects : function () {
		return this.files;
	},

	getFileStore : function (fileUuid) {
		var file = _.find(this.store.files, function (f) {
			return f.uuid == fileUuid;
		});
		return file;
	},

	getFile : function (fileUuid) {
		return this.files[fileUuid]; // return object
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

	getCollections : function () {
		
	},

	getRoles : function () {
		return this._roles;
	},

	// get available categories stored in project
	getCategories : function () {
		return this.store.categories;
	},

	// add category to project list of cats
	addCategory : function (category) {

		// push to list
		this.store.categories.push(category);

		// save to server
		this._update('categories');
	},

	removeCategory : function (category) {

		// remove from array
		_.remove(this.store.categories, function (c) {
			return c.toLowerCase() == category.toLowerCase();
		});

		// save to server
		this._update('categories');
	},

	getUsers : function () {
		var users = [],
		    roles = this._roles;

		_.each(roles, function (role) {
			if (role.hasCapability('read_project')) {
				_.each(role.getMembers(), function (uuid) {
					var user = app.Users[uuid];
					if (user) users.push(user);
				});
			}
		});
		return users;
	},

	_filteredUsers : function () {
		var allProjectUsers = this.getUsers();

		// filter out superadmins
		return _.filter(allProjectUsers, function (u) {
			return !app.Access.is.superAdmin(u);
		});
	},

	getSlug : function () {
		return this.store.slug;
	},

	getSlugs : function () {
		var slugs = {
			project : this.store.slug,
			client : this.getClient().getSlug()
		}
		return slugs;
	},

	getUsersHTML : function () {
		var users = this._filteredUsers(),
		    html = '';

		_.each(users, function (user) {
			html += '<p>' + user.getFullName() + '</p>';
		});
		return html;
	},


	getHeaderLogo : function () {
		var logo = this.store.header.logo;
		if (!logo) logo = '/css/images/defaultProjectLogo.png';
		return logo;
	},

	getHeaderLogoBg : function () {
		var logo = this.store.header.logo;
		if (!logo) logo = this.store.logo;
		var url = "url('" + logo + "')";
		return url;
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

	getSettings : function () {
		return this.store.settings;
	},

	setSettings : function (settings) {
		this.store.settings = settings;
		this._update('settings');
	},

	setFile : function (file) {
		this.store.files.push(file);
		this.files[file.uuid] = new Wu.Files(file);
	},

	setLogo : function (path) {
		this.store.logo = path;
		this._update('logo');
	},

	setHeaderLogo : function (path) {
		this.store.header.logo = path;
		this._update('header');
	},

	setHeaderTitle : function (title) {
		this.store.header.title = title;
		this._update('header');
	},

	setHeaderSubtitle : function (subtitle) {
		this.store.header.subtitle = subtitle;
		this._update('header');
	},

	setName : function (name) {
		this.store.name = name;
		this._update('name');
	},

	setDescription : function (description) {
		this.store.description = description;
		this._update('description');
	},

	setSlug : function (name) {
		var slug = name.replace(/\s+/g, '').toLowerCase();
		slug = Wu.Util.stripAccents(slug);
		this.store.slug = slug;
		
		// save slug to server
		this._update('slug');

		// set new url
		this._setUrl();
	},

	setBounds : function (bounds) {
		this.store.bounds = bounds;
		this._update('bounds');
	},

	setBoundsSW : function (bounds) {
		this.store.bounds = this.store.bounds || {}
		this.store.bounds.southWest = bounds;
		this._update('bounds');		
	},

	setBoundsNE : function (bounds) {
		this.store.bounds = this.store.bounds || {}
		this.store.bounds.northEast = bounds;
		this._update('bounds');
	},

	setBoundsZoomMin : function (zoomMin) {
		this.store.bounds = this.store.bounds || {}
		this.store.bounds.zoomMin = zoomMin;
		this._update('bounds');
	},

	setPosition : function (position) {
		this.store.position = position;
		this._update('position');
	},

	setSidepane : function (sidepane) {
		this._menuItem = sidepane;
	},

	getSidepane : function () {
		return this._menuItem;
	},

	removeFiles : function (files) {

		var list = app.SidePane.DataLibrary.list,
		    layerMenu = app.MapPane.layerMenu,
		    _fids = [],
		    uuids = [],
		    that = this;

		// iterate over files and delete
		files.forEach(function(file, i, arr) {

			// remove from list
			list.remove('uuid', file.uuid);
		
			// remove from local project
			_.remove(this.store.files, function (item) { return item.uuid == file.uuid; });

			// remove from this.files
			delete this.files[file.uuid];

			// get layer if any
			var layer = _.find(this.layers, function (l) { return l.store.file == file.uuid; });

			// remove layers
			if (layer) {
				// remove from layermenu & baselayer store
				_.remove(this.store.layermenu, function (item) { return item.layer == layer.store.uuid; });
				_.remove(this.store.baseLayers, function (b) { return b.uuid == layer.store.uuid; });

				// remove from layermenu
				if (layerMenu) layerMenu.onDelete(layer);

				// remove from map
				layer.remove();
					
				// remove from local store
				var a = _.remove(this.store.layers, function (item) { return item.uuid == layer.store.uuid; });	// dobbelt opp, lagt til to ganger! todo
				delete this.layers[layer.store.uuid];	
			}
			
			// prepare remove from server
			_fids.push(file._id);
			uuids.push(file.uuid);

		}, this);

		// save changes
		this._update('layermenu'); 
		this._update('baseLayers');

		setTimeout(function () {	// ugly hack, cause two records can't be saved at same time, server side.. FUBAR!
			// remove from server
			var json = {
			    '_fids' : _fids,
			    'puuid' : that.store.uuid,
			    'uuids' : uuids
			}
			var string = JSON.stringify(json);
			Wu.save('/api/file/delete', string); 
				
		}, 1000);

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
				var thumbnail 	= '/pixels/' + file.uuid + '?width=75&height=50';
				var url 	= '/pixels/' + file.uuid + '?width=200&height=200';
				var source = {
				    	title 	: file.name, 	// title
				    	thumbnail : thumbnail,  // optional. url to image
				    	uuid 	: file.uuid,       // optional
					type 	: file.type,
					url 	: url
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
			var prefix    = (file.type == 'image') ? '/images/' 					: '/api/file/download/?file=';
			var url = prefix + file.uuid;// + suffix

			var source = {
			    	title 	: file.name, 	// title
			    	thumbnail : thumbnail,  // optional. url to image
			    	uuid 	: file.uuid,    // optional
				type 	: file.type,
				url 	: url
			}

			sources.push(source)
		
		}, this);
		return sources;
	},

	refreshSettings : function () {
		for (setting in this.getSettings()) {
			this.getSettings()[setting] ? this['enable' + setting.camelize()]() : this['disable' + setting.camelize()]();
		}

		// refresh added/removed sidepanes
		app.SidePane._refresh();
	},

	// settings
	toggleSetting : function (setting) {
		
		// switch setting in store
		this._switchSetting(setting);

		// enable/disable
		this.getSettings()[setting] ?  this['enable' + setting.camelize()]() : this['disable' + setting.camelize()]();
	},

	_switchSetting : function (setting) {
		this.store.settings[setting] = !this.store.settings[setting];
		this._update('settings');
	},

	enableDarkTheme : function () {
		app.Style.setDarkTheme();
	},
	disableDarkTheme : function () {
		app.Style.setLightTheme();
	},

	enableTooltips : function () {
		app.Tooltip.activate();
	},
	disableTooltips : function () {
		app.Tooltip.deactivate();
	},

	enableScreenshot : function () {
		app.SidePane.Share.enableScreenshot();
	},
	disableScreenshot : function () {
		app.SidePane.Share.disableScreenshot();
	},

	enableDocumentsPane : function () {
		app.SidePane.refreshMenu();
	},
	disableDocumentsPane : function () {
		app.SidePane.refreshMenu();
	},

	enableDataLibrary : function () {
		app.SidePane.refreshMenu();
	},
	disableDataLibrary : function () {
		app.SidePane.refreshMenu();
	},

	enableMediaLibrary : function () {
		app.SidePane.refreshMenu();
	},
	disableMediaLibrary : function () {
		app.SidePane.refreshMenu();
	},

	enableSocialSharing : function () {
		app.SidePane.refreshMenu();
	},
	disableSocialSharing : function () {
		app.SidePane.refreshMenu();
	},

	enableAutoHelp : function () {		// auto-add folder in Docs

	},
	disableAutoHelp : function () {

	},

	enableAutoAbout : function () {

	},
	disableAutoAbout : function () {

	},

	enableMapboxGL : function () {

	},
	disableMapboxGL : function () {

	},

	// CXX – Now this is all over the place... see sidepane.project.js > makeNewThumbnail() etc...
	createProjectThumb : function () {

		// Set the grinding wheel until logo is updated
		this.setTempLogo();

		app.setHash(function (ctx, hash) {
			var obj = JSON.parse(hash);

			obj.dimensions = {
				height : 233,
				width : 350
			}

			// get snapshot from server
			Wu.post('/api/util/createThumb', JSON.stringify(obj), this.createdProjectThumb, this);

		}.bind(this), this);
	},


	createdProjectThumb : function(context, json) {

		// parse results
		var result = JSON.parse(json),
		    image = result.cropped,
		    fileUuid = result.fileUuid,
		    path = '/images/' + image;

		// Store new logo paths
		context.setLogo(path); 		// trigger server-save
		context.setHeaderLogo(path); 	// triggers server-save

		context._menuItem.logo.src = path;

		// Set logo in header pane
		if (context == app.activeProject) app.HeaderPane.addedLogo(image); // triggers this.setHeaderLogo -- triggers save

	},

	setThumbCreated : function (bool) {
		this.store.thumbCreated = bool;
		this._update('thumbCreated');
	},

	getThumbCreated : function () {
		return this.store.thumbCreated;
	},	

	setTempLogo : function () {
		this._sidePaneLogoContainer.src = app.options.logos.projectDefault;
	}	

});