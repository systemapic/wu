Wu.Project = Wu.Class.extend({

	initialize : function (store) {

		// set dB object to store
		this.store = {};
		Wu.extend(this.store, store);

		// ready save object
		this.lastSaved = {};

		// init roles, files, layers
		this._initObjects();

	},

	_initObjects : function () {
		this.initRoles();
		this.initFiles();
		this.initLayers();
	},

	initRoles : function () {

		// get roles
		var roles = this.store.roles;
		this._roles = {};
		if (!roles) return;

		// create
		_.each(roles, function (role) {
			this._roles[role.uuid] = new Wu.Role({
				role : role,
				project : this
			});
		}, this);
	},

	initFiles : function () {

		// get files
		var files = this.getFiles();
		this.files = {};
		if (!files) return;

		// create
		files.forEach(function (file) {
			this.files[file.uuid] = new Wu.Model.File(file);
		}, this);
	},

	initLayers : function () {

		// get layers
		var layers = this.store.layers;
		this.layers = {};
		if (!layers) return;

		// create
		layers.forEach(function (layer) {
			var wuLayer =  new Wu.createLayer(layer);
			if (wuLayer) this.layers[layer.uuid] = wuLayer;
		}, this);
	},

	addLayers : function (layers) { // array of layers
		layers.forEach(function (layer) {
			this.addLayer(layer);
		}, this);
	},

	addLayer : function (layer) {
		var l = new Wu.createLayer(layer);
		if (l) this.layers[layer.uuid] = l;
		return l || false;
	},

	addBaseLayer : function (layer) {
		this.store.baseLayers.push(layer);
		this._update('baseLayers');
	},
	
	removeBaseLayer : function (layer) {
		_.remove(this.store.baseLayers, function (b) { return b.uuid == layer.getUuid(); });
		this._update('baseLayers');
	},

	setBaseLayer : function (layer) {
		this.store.baseLayers = layer;
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

		console.error('TODO: created layer from GeoJSON, needs to be added to Data.');
	},

	createLayer : function () {
	},

	setActive : function () {
		this.select();
	},

	refresh : function () {

		// refresh project
		this._refresh();
	
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

	_reset : function () {
		// this.removeHooks();
	},

	_hardRefresh : function () {
		// flush
		this._reset();

		// init files
		this.initFiles();

  		// create layers 
		this.initLayers();

		// update url
		this._setUrl();

		// set settings
		this.refreshSettings();
		
		// update color theme
		this.setColorTheme();

		// update project in sidepane
		if (this._menuItem) this._menuItem.update();
	},

	_refresh : function () {

		// flush
		this._reset();

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
		url += this.getCreatedByUsername();
		url += '/';
		url += this.store.slug;
		Wu.Util.setAddressBar(url);
	},

	getCreatedByUsername : function () {
		return this.store.createdByUsername;
	},

	setNewStore : function (store) {
		this.store = store;
		this._initObjects();
		// this.select();
	},

	setStore : function (store) {
		this.store = store;
		this._hardRefresh();
	},

	setRolesStore : function (roles) {
		this.store.roles = roles;
		this.initRoles();
	},

	setAccess : function (projectAccess) {

		var options = {
			project : this.getUuid(),
			access : projectAccess
		}


		// send request to API		
 		Wu.Util.postcb('/api/project/setAccess', JSON.stringify(options), function (ctx, response) {
 		
 			// set locally
 			this.store.access = projectAccess;

 		}.bind(this), this);

	},

	addInvites : function (projectAccess) {

		var options = {
			project : this.getUuid(),
			access : projectAccess
		}


		// send request to API		
 		Wu.Util.postcb('/api/project/addInvites', JSON.stringify(options), function (ctx, response) {

 			console.log('response: ', response, ctx);

 			var updatedAccess = Wu.parse(response);

 			// set locally
 			this.store.access = updatedAccess;

 		}.bind(this), this);
	},

	getAccess : function () {
		return this.store.access;
	},

	setMapboxAccount : function (store) {
		// full project store
		this.store = store;

		// refresh project and sidepane
		this._refresh();
		// this.refreshSidepane();
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
		Wu.send('/api/project/update', string, this._saved.bind(this));  
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

		Wu.Mixin.Events.fire('projectChanged', { detail : {
			projectUuid : this.getUuid()
		}});
	},


	// create project on server
	create : function (opts, callback) {

		console.log('this: store', this.store);

		var options = {
			name 		: this.store.name,
			description 	: this.store.description,
			keywords 	: this.store.keywords, 
			position 	: this.store.position,
			access		: this.store.access
		}

		// send request to API		
 		Wu.post('/api/project/create', JSON.stringify(options), callback.bind(opts.context), this);
	},


	_unload : function () {

		// load random project
		app.MapPane._flush();
		app.HeaderPane._flush();
		this.selected = false;
	},


	_delete : function (callback) {
		// var project = this;
		var json = JSON.stringify({ 
			    'pid' : this.store.uuid,
			    'projectUuid' : this.store.uuid,
			    // 'clientUuid' : this._client.uuid
		});
		
		// post with callback:    path       data    callback   context of cb
		Wu.Util.postcb('/api/project/delete', json, callback || this._deleted, this);
	},

	_deleted : function (project, json) {

		// set address bar
		var url = app.options.servers.portal;
		var deletedProjectName = project.getName();

		// set url
		Wu.Util.setAddressBar(url);

		// delete object
		app.Projects[project.getUuid()] = null;
		delete app.Projects[project.getUuid()];

		// set no active project if was active
		if (app.activeProject && app.activeProject.getUuid() == project.getUuid()) {

			// null activeproject
			app.activeProject = null;

			// unload project
			project._unload();
			
			// fire no project
			Wu.Mixin.Events.fire('projectSelected', { detail : {
				projectUuid : false
			}});

			// fire no project
			Wu.Mixin.Events.fire('projectDeleted', { detail : {
				projectUuid : project.getUuid()
			}});

		}

		project = null;
		delete project;

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

	deleteLayer : function (layer) {

		var options = {
			layerUuid : layer.getUuid(),
			projectUuid : this.getUuid()
		}

		Wu.post('/api/layers/delete', JSON.stringify(options), function (err, response) {
			if (err) return console.error('layer delete err:', err);

			var result = Wu.parse(response);

			if (result.error) return console.error('layer delete result.error:', result.error);

			// remove locally, and from layermenu etc.
			this._removeLayer(layer);

			// fire event
			Wu.Mixin.Events.fire('layerDeleted', { detail : {
				layer : this
			}}); 

		}.bind(this));

	},

	removeLayer : function (layerStore) {
		var layer = this.getLayer(layerStore.uuid);
		this._removeLayer(layer);
	},

	_removeLayer : function (layer) {

		// remove from layermenu & baselayer store
		_.remove(this.store.layermenu, function (item) { return item.layer == layer.getUuid(); });
		_.remove(this.store.baseLayers, function (b) { return b.uuid == layer.getUuid(); });

		// remove from layermenu
		var layerMenu = app.MapPane.getControls().layermenu;
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
		console.log('TODO: remove this!');
		// return app.Clients[this.store.client];
	},

	getClientUuid : function () {
		console.log('TODO: remove this!');
		// return this.store.client;
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

	getPostGISLayers : function () {
		// return _.filter(this.layers, function (l) {
		// 	if (!l) return false;
		// 	if (!l.store.data) return false;
		// 	return l.store.data.postgis;
		// });

		var layers = [];

		for (var l in this.layers) {
			var layer = this.layers[l];
			if (layer.store && layer.store.data && layer.store.data.postgis) layers.push(layer);
		}

		return layers;

	},

	getRasterLayers : function () {
		var layers = [];

		for (var l in this.layers) {
			var layer = this.layers[l];

			if (layer.store && layer.store.data && layer.store.data.raster) layers.push(layer);
		}

		return layers;
	},

	getDataLayers : function () {

		var pg_layers = this.getPostGISLayers();
		var r_layers = this.getRasterLayers();

		var data_layers = pg_layers.concat(r_layers);

		return data_layers;

	},

	// debug
	getDeadLayers : function () {
		return _.filter(this.layers, function (l) {
			if (!l) return true;
			return l.store.data == null;
		});
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

	getPostGISLayer : function (layer_id) {
		return _.find(this.layers, function (layer) {
			if (!layer.store) return;
			if (!layer.store.data) return;
			if (!layer.store.data.postgis) return;
			return layer.store.data.postgis.layer_id == layer_id;
		});
	},

	getStylableLayers : function () {
		// get active baselayers and layermenulayers that are editable (geojson)
		var all = this.getActiveLayers();
		var cartoLayers = _.filter(all, function (l) {

			if (l) {
				if (!l.store) return false;
				if (l.store.data.hasOwnProperty('geojson')) return true;
				if (l.store.data.hasOwnProperty('osm')) return true;
				if (l.store.data.hasOwnProperty('postgis')) return true;

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

	getState : function () {
		return this.store.state;
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
			// client : this.getClient().getSlug()
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
		if(Wu.app.Style.getCurrentTheme() === 'darkTheme'){
			var defaultProjectLogo = '/css/images/defaultProjectLogoLight.png';
		}
		else if(Wu.app.Style.getCurrentTheme() === 'lightTheme'){
			var defaultProjectLogo = '/css/images/defaultProjectLogo.png';
		}
		var logo = this.store.header.logo;
		if (!logo) logo = defaultProjectLogo;
		return logo;
	},

	getHeaderLogoBg : function () {
		var logo = this.store.header.logo;
		if (!logo) logo = this.store.logo;
		var url = "url('" + logo  + "')";
		return url;
	},

	getHeaderTitle : function () {
		// return this.store.header.title;
		return this.getName();
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
		var controls = this.store.controls;
		delete controls.vectorstyle; // tmp hack, todo: remove from errywhere
		return controls;
	},

	getSettings : function () {
		return this.store.settings;
	},

	clearPendingFiles : function () {
		this.store.pending = [];
		this._update('pending');
	},

	setPendingFile : function (file_id) {
		this.store.pending.push(file_id);
		this._update('pending');
	},

	getPendingFiles : function () {
		return this.store.pending;
	},

	removePendingFile : function (file_id) {
		var remd = _.remove(this.store.pending, function (p) {
			return p == file_id;
		});
		this._update('pending');
	},


	setPopupPosition : function (pos) {
		this._popupPosition = pos;
	},

	getPopupPosition : function () {
		return this._popupPosition;
	},

	setSettings : function (settings) {
		this.store.settings = settings;
		this._update('settings');
	},

	setFile : function (file) {
		this.store.files.push(file);
		this.files[file.uuid] = new Wu.Model.File(file);
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

		// store on server
		this.store.name = name;
		this._update('name');

		// update slug name
		this.setSlug(name);
	},

	setDescription : function (description) {
		this.store.description = description;
		this._update('description');
	},

	setSlug : function (name) {
		var slug = name.replace(/\s+/g, '').toLowerCase();
		slug = slug.replace(/\W/g, '')
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
		return console.error('remove files, needs to be rewritten with new Wu.Data');
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
				var thumbnail 	= '/pixels/' + file.uuid + '?width=75&height=50' + '&access_token=' + app.tokens.access_token;
				var url 	= '/pixels/' + file.uuid + '?width=200&height=200' + '&access_token=' + app.tokens.access_token;
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

			var thumbnail = (file.type == 'image') ? '/pixels/' + file.uuid + '?width=50&height=50' + '&access_token=' + app.tokens.access_token : '';
			var prefix    = (file.type == 'image') ? '/images/' 					: '/api/file/download/?file=';
			var url = prefix + file.uuid + '&access_token=' + app.tokens.access_token;// + suffix

			//url += '?access_token=' + app.tokens.access_token;

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


	enableD3popup : function () {
		console.log('enable d3popup');
	},
	disableD3popup : function () {
		console.log('disable d3popup');
	},


	enableScreenshot : function () {
		// app.SidePane.Share.enableScreenshot();
	},
	disableScreenshot : function () {
		// app.SidePane.Share.disableScreenshot();
	},

	enableDocumentsPane : function () {
		// app.SidePane.refreshMenu();
	},
	disableDocumentsPane : function () {
		// app.SidePane.refreshMenu();
	},

	enableDataLibrary : function () {
		// app.SidePane.refreshMenu();
	},
	disableDataLibrary : function () {
		// app.SidePane.refreshMenu();
	},

	enableMediaLibrary : function () {
		// app.SidePane.refreshMenu();
	},
	disableMediaLibrary : function () {
		// app.SidePane.refreshMenu();
	},

	enableSocialSharing : function () {
		// app.SidePane.refreshMenu();
	},
	disableSocialSharing : function () {
		// app.SidePane.refreshMenu();
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

	enableSaveState : function () {

	},
	disableSaveState : function () {

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
		    image = result.cropped ,
		    fileUuid = result.fileUuid,
		    path = '/images/' + image;

		// Store new logo paths
		context.setLogo(path); 		// trigger server-save
		context.setHeaderLogo(path); 	// triggers server-save

		context._menuItem.logo.style.backgroundImage = 'url(' + context._getPixelLogo(path) + ')';
		context.setTempLogo(); 

		// Set logo in header pane
		if (context == app.activeProject) {
			app.HeaderPane.addedLogo(image); // triggers this.setHeaderLogo -- triggers save
		}
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
	},

	_getPixelLogo : function (logo) {
		var base = logo.split('/')[2];
		var url = '/pixels/image/' + base + '?width=90&height=60&format=png' + '&access_token=' + app.tokens.access_token;
		return url;
	},


	selectProject : function () {

		// select project
		Wu.Mixin.Events.fire('projectSelected', {detail : {
			projectUuid : this.getUuid()
		}});
	},





	/////
	//// ACCESS
	///
	//

	isPublic : function () {
		var access = this.getAccess();
		var isPublic = access.options.isPublic;
		return !!isPublic
	},

	isDownloadable : function () {
		var access = this.getAccess();
		var isPublic = access.options.download;
		return !!isPublic;
	},
	isShareable : function () {
		var access = this.getAccess();
		var isPublic = access.options.share;
		return !!isPublic;
	},


	createdBy : function () {
		return this.store.createdBy;
	},

	isEditor : function (user) {
		return this.isEditable(user);
	},

	isSpectator : function (user) {
		var user = user || app.Account;
		var access = this.getAccess();

		// true: if user is listed as editor
		if (_.contains(access.read, user.getUuid())) return true;

		// false: not createdBy and not editor
		return false;
	},

	isEditable : function (user) {
		var user = user || app.Account;

		var access = this.getAccess();

		// true: if user created project
		if (user.getUuid() == this.createdBy()) return true;

		// true: if user is listed as editor
		if (_.contains(access.edit, user.getUuid())) return true;

		// true: if user is super
		if (app.Account.isSuper()) return true; 

		// false: not createdBy and not editor
		return false;
	},

















})