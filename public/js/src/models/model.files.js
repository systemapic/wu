Wu.Files = Wu.Class.extend({

	_ : 'file',

	initialize : function (store) {

		// set store
		this.store = store;

	},

	getStore : function () {
		return this.store;
	},

	// getters
	getName : function () {
		return this.store.name;
	},
	getTitle : function () {
		return this.getName();
	},

	getType : function () {
		return this.store.type;
	},

	getUuid : function () {
		return this.store.uuid;
	},

	getLastUpdated : function () {
		return this.store.lastUpdated;
	},

	getKeywords : function () {
		return this.store.keywords;
	},

	getFormat : function () {
		return this.store.format;
	},

	getFileList : function () {
		return this.store.files;
	},

	getDatasize : function () {
		return this.store.dataSize;
	},

	getCreatedByName : function () {
		return this.store.createdByName;
	},

	getCreatedBy : function () {
		return this.store.createdBy;
	},

	getCreated : function () {
		return this.store.created;
	},

	getCategory : function () {
		return this.store.category;
	},

	getStatus : function () {
		return this.store.status;
	},

	getVersion : function () {
		return this.store.version;
	},

	getDescription : function () {
		return this.store.description;
	},

	getLayer : function () {
		var fileUuid = this.getUuid();
		var project = _.find(app.Projects, function (p) {
			return p.files[fileUuid];
		});
		var layer = _.find(project.layers, function (l) {
			return l.getFileUuid() == fileUuid;
		});
		return layer;
	},

	getCopyright : function () {
		return this.store.copyright;
	},

	setCopyright : function (copyright) {
		this.store.copyright = copyright;
		this.save('copyright');
	},

	_addToProject : function (projectUuid) {

		var options = {
			projectUuid : projectUuid, 
			fileUuid : this.getUuid()
		}

		Wu.Util.postcb('/api/file/addtoproject', JSON.stringify(options), function (err, body) {

		});
	},


	// setters
	setName : function (name) {
		this.store.name = name;
		this.save('name');
	},

	setKeywords : function (keywords) {
		this.store.keywords = keywords; // todo: must be array
		this.save('keywords');
	},

	setTag : function () {
		// this.store.keywords.push(newTag); 
		this.save('keywords');
	},

	setFormat : function (format) {
		this.store.format = format;
		this.save('format');
	},

	setCategory : function (category) {
		this.store.category = category; // should be string
		this.save('category');
	},

	setStatus : function (status) {
		this.store.status = status;
		this.save('status');
	},

	setVersion : function (version) {
		this.store.version = version;
		this.save('version');
	},

	setDescription : function (description) {
		this.store.description = description;
		this.save('description');
	},




	// save field to server
	save : function (field) {

		// set fields
		var json = {};
		json[field] = this.store[field];
		json.uuid = this.store.uuid;

		// save to server
		var string = JSON.stringify(json);
		this._save(string);

	},

	// save json to server
	_save : function (string) {
		// TODO: save only if actual changes! saving too much already
		Wu.save('/api/file/update', string); // save to server   

		app.setSaveStatus();// set status
	},



	// todo: move all delete of files here
	_deleteFile : function () {

		// check if dataset has layers
		this._getLayers(function (err, layers) {

			var num_layers = layers.length;
			var pretty_layers = [];

			layers.forEach(function (l, n, m) {
				pretty_layers.push('- ' + l.title);
			});

			var has_layers_msg = 'There exists ' + num_layers + ' layers based on this dataset: \n' + pretty_layers.join('\n') + '\n\nDeleting dataset will delete all layers. Are you sure?';
			var just_confirm = 'Do you really want to delete dataset ' + this.getName() + '?';
			var message = num_layers ? has_layers_msg : just_confirm;
			var confirmed = confirm(message);

			if (!confirmed) return console.log('Nothing deleted.');
			
			// delete file
			var postgisOptions = this.getPostGISData();
			Wu.post('/api/file/delete', JSON.stringify(postgisOptions), function (err, response) {
				console.log('deleted?', err, response);

				var removedObjects = Wu.parse(response);

				// clean up locally
				this._fileDeleted(removedObjects);


			}.bind(this));

		}.bind(this));


	},

	_fileDeleted : function (result) {

		// catch error
		if (result.error || !result.success) return console.error(result.error || 'No success deleting!');

		// update user locally
		app.Account.removeFile(result.removed.file);

		// update projects locally
		this._removeLayersLocally(result.removed.layers);

		// fire event
		Wu.Mixin.Events.fire('fileDeleted', {detail : {
			fileUuid : 'lol'
		}});
	},


	_removeLayersLocally : function (layers) {

		layers.forEach(function (layer) {

			// find project 
			var project = _.find(app.Projects, function (p) {
				return p.getLayer(layer.uuid);
			});


			// remove layer
			project.removeLayer(layer);

		});

		// fire event
		Wu.Mixin.Events.fire('layerDeleted', {detail : {
			fileUuid : 'lol'
		}});

	},

	
	_getLayers : function (callback) {

		// get layers connected to dataset
		var postgisOptions = this.getPostGISData();
		Wu.post('/api/file/getLayers', JSON.stringify(postgisOptions), function (err, response) {
			var layers = Wu.parse(response);
			callback(err, layers);
		});
	},

	getPostGISData : function () {
		if (!this.store.data) return false;
		return this.store.data.postgis;
	},

	_shareFile : function () {
		console.log('file._shareFile', this.getName());
	},

	_createLayer : function (project) {
		this._createDefaultLayer(project);
	},

	_downloadFile : function () {
		this._downloadDataset();
	}, 

	_downloadDataset : function () {

		var options = {
			file_id : this.getUuid(),
		}

		Wu.post('/api/file/downloadDataset', JSON.stringify(options), this._downloadedDataset.bind(this));

	},

	_downloadedDataset : function (err, response) {

		// parse results
		var filePath = response;
		var path = app.options.servers.portal;
		path += 'api/file/download/';
		path += '?file=' + filePath;
		// path += '?raw=true'; // add raw to path
		path += '&type=shp';
		path += '&access_token=' + app.tokens.access_token;

		// open (note: some browsers will block pop-ups. todo: test browsers!)
		window.open(path, 'mywindow')

	},

	getGeometryType : function () {
		var meta = this.getMeta();
		console.log('meta', meta);
		return meta.geometry_type;
	},

	getDefaultStyling : function () {

		// returns geom type from file meta
		var geometry_type = this.getGeometryType();

		var style = {
			json : {}
		};

		if (geometry_type == 'ST_Point') { 
			style.css = this._defaultStyling.css.point; // todo: remove
			style.json.point = this._defaultStyling.json.point;
		}
		if (geometry_type == 'ST_Polygon') { 
			style.css = this._defaultStyling.css.polygon;
			style.json.polygon = this._defaultStyling.json.polygon;
		}
		if (geometry_type == 'ST_LineString') { 
			style.css = this._defaultStyling.css.line;
			style.json.line = this._defaultStyling.json.line;
		}

		return style;
	},

	// default cartocss styling
	_defaultStyling : {
		css : {
			// todo: remove this css, create css from style json instead!
			point : "@opacity_field: 0.5; @marker_size_factor: 1; [zoom=10] { marker-width: 0.3 * @marker_size_factor; } [zoom=11] { marker-width: 0.5 * @marker_size_factor; } [zoom=12] { marker-width: 1 * @marker_size_factor; } [zoom=13] { marker-width: 1 * @marker_size_factor; } [zoom=14] { marker-width: 2 * @marker_size_factor; } [zoom=15] { marker-width: 4 * @marker_size_factor; } [zoom=16] { marker-width: 6 * @marker_size_factor; } [zoom=17] { marker-width: 8 * @marker_size_factor; } [zoom=18] { marker-width: 12 * @marker_size_factor; } #layer { marker-allow-overlap: true; marker-clip: false; marker-comp-op: screen; marker-opacity: @opacity_field; marker-fill: #fcff33; }",
			polygon : "#layer {  \n polygon-fill: red; \n marker-fill: blue; \n marker-allow-overlap: true; \n marker-clip: false; \n marker-comp-op: screen;}",
			line : "#layer {  \n polygon-fill: red; \n marker-fill: yellow; \n marker-allow-overlap: true; \n marker-clip: false; \n marker-comp-op: screen;}",
		}, 

		// default styling
		json : {
			point : { 
				enabled : true, 
				color : { 
					range : false, 
					minMax : [-426.6,105.9], 
					customMinMax : [-426.6,105.9], 
					staticVal : "#fcff33",
					value : [
						"#ff0000",
						"#a5ff00",
						"#003dff"
					]
				},
				opacity : { 
					range : false,
					value : 0.5
				}, 
				pointsize : { 
					range :false,
					minMax : false,
					value : 1.
				}
			},
			polygon : {},
			line : {}
		}
	},

	_createDefaultLayer : function (project) {

		var file_id = this.getUuid();
		var file = this;

		var cartocss = file.getDefaultStyling().css; // bytt ut denne med cartocss laget fra json style over

		var layerJSON = {
			"geom_column": "the_geom_3857",
			"geom_type": "geometry",
			"raster_band": "",
			"srid": "",
			"affected_tables": "",
			"interactivity": "",
			"attributes": "",
			"access_token": app.tokens.access_token,
			"cartocss_version": "2.0.1",
			"cartocss": cartocss, 	// save default cartocss style (will be active on first render)
			"sql": "(SELECT * FROM " + file_id + ") as sub",
			"file_id": file_id,
			"return_model" : true,
			"projectUuid" : project.getUuid()
		}

		// create postgis layer
		Wu.post('/api/db/createLayer', JSON.stringify(layerJSON), function (err, layerJSON) {
			var layer = Wu.parse(layerJSON);

			var options = {
				projectUuid : project.getUuid(), // pass to automatically attach to project
				data : {
					postgis : layer.options
				},
				metadata : layer.options.metadata,
				title : 'Layer from ' + file.getName(),
				description : 'Description: Layer created from ' + file.getName(),
				file : file.getUuid(),
				style : JSON.stringify(file.getDefaultStyling().json) // save default json style
			}

			// create new layer model
			this._createLayerModel(options, function (err, layerModel) {

				// refresh Sidepane Options
				project.addLayer(layerModel);

				// todo: set layer icon
				app.feedback.setMessage({
					title : 'Created layer from dataset',
					description : 'Added <strong>' + layerModel.title + '</strong> to project.',
				});	

				// select project
				Wu.Mixin.Events.fire('layerAdded', {detail : {
					projectUuid : project.getUuid()
				}});
			});
			
		}.bind(this));

	},

	_createLayerModel : function (options, done) {
		Wu.Util.postcb('/api/layers/new', JSON.stringify(options), function (err, body) {
			var layerModel = Wu.parse(body);
			done(null, layerModel);
		}.bind(this));
	},

	getMeta : function () {
		if (!this.store.data.postgis) return false;
		if (!this.store.data.postgis.metadata) return false;
		var meta = Wu.parse(this.store.data.postgis.metadata);
		return meta;
	},

	getHistograms : function () {
		var meta = this.getMeta();
		if (!meta) return false;
		var histogram = meta.histogram;
		return histogram;
	},

	getHistogram : function (column) {
		var h = this.getHistograms();
		if (!h) return false;
		return h[column];
	},






});