Wu.Project = Wu.Class.extend({

	initialize : function (store) {
		
		// set dB object to store
		this.store = {};
		Wu.extend(this.store, store);

		// set editMode
		this.setEditMode();

		this.lastSaved = {};

		// ensure active project // todo: refactor, take this out
		// if (!app.activeProject) app.activeProject = this;

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
		this.store.layers.push(layer);
		// this._update('layers');
		this.layers[layer.uuid] = new Wu.createLayer(layer);
	},

	createLayerFromGeoJSON : function (geojson) {
		// console.log('createGeoJSONLayer', geojson);

		var options = {
			project 	: this.getUuid(),
			geojson 	: geojson,
			layerType 	: 'geojson'
		}

		var json = JSON.stringify(options);
		
		// console.log('POST createLayerFromGeoJSON');

 		Wu.Util.postcb('/api/layers/new', json, this._createdLayerFromGeoJSON, this);

	},

	_createdLayerFromGeoJSON : function (context, data) {

		// console.log('_createdLayerFromGeoJSON: data, context', data, context);
		var parsed = JSON.parse(data);
		// console.log('parsed: ', parsed);

		// data = {
		// 	error : false,
		// 	done : {
		// 		files : [{

		// 		}],
		// 		layers : [{

		// 		}]
		// 	}
		// }

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
 
		// if (app.activeProject == this) return;

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
		// console.log('field: ', field);
		// console.log(this.store);
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


		// console.log('saving project field: ', json);

		var string = JSON.stringify(json);
		this._save(string);
		
	},


	save : function (field) {

		// save all fields that has changed since last save (or if no last save...?)
		// todo

	},
	

	_save : function (string) {
		// console.log('saving...');                                       // TODO: pgp
		Wu.save('/api/project/update', string);                         // TODO: save only if actual changes! saving too much already
	
		// set status
		app.setStatus('Saved!');
	},

	_saveNew : function (callback) {
	     
		var options = {
			name 		: this.store.name,
			description 	: this.store.description,
			keywords 	: this.store.keywords, 
			client 		: this._client.uuid 			// parent client uuid 
		}
		var json = JSON.stringify(options);
		
		// console.log('POST: _saveNew');
 		Wu.Util.postcb('/api/project/new', json, callback.callback.bind(callback.context), this);

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

	},

	setColorTheme : function () {
		if (!this.colorTheme) return;

		// set global color
		savedCSS = this.colorTheme;

		// inject
		Wu.Util.setColorTheme();

	},

	removeMapboxAccount : function (account) {
		_.remove(this.store.connectedAccounts.mapbox, function (m) {	// todo: include access token
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

	getClientUuid : function () {
		return this.store.client;
	},

	getBaselayers : function () {
		return this.store.baseLayers;
	},

	getLayermenuLayers : function () {
		return _.filter(this.store.layermenu, function (l) {
			return !l.folder;
		})
		// return this.store.layermenu;		// todo: set layer uuid in layermenuItems
	},

	getLayers : function () {
		return _.toArray(this.layers);
	},

	getLayer : function (uuid) {
		return this.layers[uuid];
	},

	getLayerFromFile : function (fileUuid) {
		return _.find(this.layers, function (l) {
			return l.store.file == fileUuid;
		});
	},

	getFiles : function () {
		return this.store.files;
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
		var users = this.getUsers(),
		    html = '',
		    silent = app.options.silentUsers;

		users.forEach(function (user) {
			var partial = user.store.uuid.slice(0, 13);
			// remove silentUsers from user list
			if (silent.indexOf(partial) == -1) {
				// add user to list
				html += '<p>' + user.store.firstName + ' ' + user.store.lastName + '</p>';
			}
		}, this);

		return html;
	},

	getHeaderLogo : function () {
		var logo = this.store.header.logo;
		if (!logo) logo = this.store.logo;
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


	setFile : function (file) {

		// add to local store
		this.store.files.push(file);

		// save to server (if necessary)
		// this._update('files');

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
		slug = Wu.Util.stripAccents(slug);
		this.store.slug = slug;
		console.log('update slug: ', slug);
		this._update('slug');

		// set new url
		this._setUrl();
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
		this._update('position');
	},


	removeFiles : function (files) {

		// console.log('*********************')
		// console.log('removeFiles: files: ', files);
		// console.log('*********************')

		var list = app.SidePane.DataLibrary.list,
		    layerMenu = app.MapPane.layerMenu,
		    _fids = [],
		    uuids = [],
		    that = this;

		// iterate over files and delete
		files.forEach(function(file, i, arr) {

			// console.log('removeFiles: ', file);
			// console.log('this.store.files: ', this.store.files);
			// console.log('this.layers: ', this.layers);
			// console.log('this.store.layermenu: ', this.store.layermenu);

			// remove from list
			list.remove('uuid', file.uuid);
		
			// remove from local project
			_.remove(this.store.files, function (item) { return item.uuid == file.uuid; });

			// get layer if any
			var layer = _.find(this.layers, function (l) { return l.store.file == file.uuid; });

			// remove layers
			if (layer) {
				// remove from layermenu store
				var removed = _.remove(this.store.layermenu, function (item) { return item.layer == layer.store.uuid; });
				
				// remove from layermenu
				if (layerMenu) layerMenu.onDelete(layer);
					
				// remove from local store
				var a = _.remove(this.store.layers, function (item) { return item.uuid == layer.store.uuid; });	// dobbelt opp, lagt til to ganger! todo
				delete this.layers[layer.store.uuid];	
			}
			
			
			// prepare remove from server
			_fids.push(file._id);
			uuids.push(file.uuid);

		}, this);

		// save changes to layermenu
		this._update('layermenu'); 

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

				var thumbnail = '/pixels/' + file.uuid + '?width=75&height=50';
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