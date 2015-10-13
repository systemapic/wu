Wu.Model.File = Wu.Model.extend({

// Wu.Files = Wu.Class.extend({

	_ : 'file',

	_initialize : function (store) {

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
			if (err) console.log('err', err);
			
			var num_layers = layers.length;
			var pretty_layers = [];

			if (num_layers) layers.forEach(function (l, n, m) {
				pretty_layers.push('- ' + l.title);
			});

			var has_layers_msg = 'There exists ' + num_layers + ' layers based on this dataset: \n' + pretty_layers.join('\n') + '\n\nDeleting dataset will delete all layers. Are you sure?';
			var just_confirm = 'Do you really want to delete dataset ' + this.getName() + '?';
			var message = num_layers ? has_layers_msg : just_confirm;
			var confirmed = confirm(message);

			if (!confirmed) return console.log('Nothing deleted.');
			
			// delete file
			var postgisOptions = this._getLayerData();
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
		var options = this._getLayerData();
		Wu.post('/api/file/getLayers', JSON.stringify(options), function (err, response) {
			var layers = Wu.parse(response);
			console.log('got layers', layers);
			callback(err, layers);
		});
	},

	getPostGISData : function () {
		if (!this.store.data) return false;
		return this.store.data.postgis;
	},

	_getLayerData : function () {
		if (!this.store.data) return false;
		if (this.store.data.postgis) {
			var options = {
				data : this.store.data.postgis, 
				type : 'postgis'
			}
			return options;
		}
		if (this.store.data.raster) {
			var options = {
				data : this.store.data.raster, 
				type : 'raster'
			}
			return options;
		}
		return false;
	},

	_shareFile : function () {
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
			socket_notification : true
		}

		// set download id for feedback
		this._downloadingID = Wu.Util.createRandom(5);

		// post download request to server
		Wu.post('/api/file/downloadDataset', JSON.stringify(options), function (err, response) {

			// give feedback
			app.feedback.setMessage({
				title : 'Preparing download',
				description : 'Hold tight! Your download will be ready in a minute.',
				id : this._downloadingID
			});	

		}.bind(this));

	},

	_onDownloadReady : function (e) {
		var options = e.detail,
		    file_id = options.file_id,
		    finished = options.finished,
		    filepath = options.filepath;

		// parse results
		var path = app.options.servers.portal;
		path += 'api/file/download/';
		path += '?file=' + filepath;
		path += '&type=shp';
		path += '&access_token=' + app.tokens.access_token;

		// open (note: some browsers will block pop-ups. todo: test browsers!)
		window.open(path, 'mywindow')

		// remove feedback
		app.feedback.remove(this._downloadingID);
	},

	_getGeometryType : function () {
		var meta = this.getMeta();
		console.log('meta: ', meta);
		return meta.geometry_type;
	},

	_getDefaultStyling : function () {

		// get geom type
		var geometry_type = this._getGeometryType();

		// get style
		var style = this._defaultStyling;

		// enable style by geom type
		if (geometry_type == 'ST_Point') { 
			style.point.enabled = true;
		}
		if (geometry_type == 'ST_MultiPolygon') { 
			style.polygon.enabled = true;
		}
		if (geometry_type == 'ST_LineString') { 
			style.line.enabled = true;
		}

		return style;
	},

	_createDefaultCartocss : function (json, callback) {
		var styler = app.Tools.Styler;
		styler.createCarto(json, callback);
	},


	// default cartocss styling
	_defaultStyling : {
		
		// default styling
		point : { 
			enabled : false, 
			color : { 
				column : false, 
				range : [-426.6, 105.9], 
				// customMinMax : [-426.6, 105.9], 
				staticVal : "yellow",
				value : ["#ff0000", "#ffff00", "#00ff00", "#00ffff", "#0000ff"]
			},
			opacity : { 
				column : false,
				range : [-426.6, 105.9],
				value : 0.5
			}, 
			pointsize : { 
				column :false,
				range : [0, 10],
				value : 1
			}
		},

		polygon : { 
			enabled : false, 
			color : { 
				column : false, 
				range : [-426.6, 105.9], 
				staticVal : "red",
				value : ["#ff0000", "#ffff00", "#00ff00", "#00ffff", "#0000ff"]
			},
			opacity : { 
				column : false,
				range : [-426.6, 105.9],
				value : 0.5
			}, 
			line : {
				width : { 
					column :false,
					range : false,
					value : 1
				},
				opacity : {
					column : false,
					range : [-426.6, 105.9],
					value : 0.5
				},
				color : {
					column : false, 
					range : [-426.6, 105.9], 
					staticVal : "green",
					value : ["#ff0000", "#ffff00", "#00ff00", "#00ffff", "#0000ff"]
				}
			}
		},

		line : {
			enabled : false,
			width : { 
				column :false,
				range : false,
				value : 1
			},
			opacity : {
				column : false,
				value : 0.5
			},
			color : {
				column : false, 
				range : [-426.6, 105.9], 
				staticVal : "green",
				value : ["#ff0000", "#ffff00", "#00ff00", "#00ffff", "#0000ff"]
			}
		}
	},

	_getType : function () {
		if (this.store.data && this.store.data.postgis) return 'vector';
		if (this.store.data && this.store.data.raster) return 'raster';
		return false;
	},

	_createDefaultLayer : function (project) {

		var type = this._getType();

		if (type == 'vector') {
			this._createDefaultVectorLayer(project);
		}

		if (type == 'raster') {
			this._createDefaultRasterLayer(project);
		}
	},

	_createDefaultRasterLayer : function (project) {
		
		var options = {
			file : this,
			project : project,
		}

		// create layer on server
		this._requestDefaultRasterLayer(options)

	},

	_requestDefaultRasterLayer : function (options) {

		console.log('_requestDefaultLayer', options);

		var file = options.file,
		    file_id = file.getUuid(),
		    project = options.project;


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
			// "cartocss": defaultCartocss, 	// save default cartocss style (will be active on first render)
			// "sql": "(SELECT * FROM " + file_id + ") as sub",
			"file_id": file_id,
			"return_model" : true,
			"projectUuid" : project.getUuid()
		}

		// create postgis layer
		Wu.post('/api/db/createLayer', JSON.stringify(layerJSON), function (err, layerJSON) {
			var layer = Wu.parse(layerJSON);


			console.log('layer::::', layer);

			// return;

			var options = {
				projectUuid : project.getUuid(), // pass to automatically attach to project
				data : {
					raster : layer.layerUuid
				},
				metadata : layer.options.metadata, 	// TODO
				title : file.getName(),
				description : 'Description: Layer created from ' + file.getName(),
				file : file.getUuid(),
				// style : JSON.stringify(defaultStyle) // save default json style
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
				Wu.Mixin.Events.fire('layerAdded', { detail : {
					projectUuid : project.getUuid(),
					layerUuid : layerModel.uuid
				}});
			});
			
		}.bind(this));
	},

	_createDefaultVectorLayer : function (project) {
		
		var file_id = this.getUuid();
		var file = this;

		// get default style
		var defaultStyle = this._getDefaultStyling();
		
		// create css from json (server side)
		this._createDefaultCartocss(defaultStyle, function (ctx, defaultCartocss) {

			var options = {
				file : file,
				defaultCartocss : defaultCartocss,
				project : project,
				defaultStyle : defaultStyle
			}

			// create layer on server
			this._requestDefaultVectorLayer(options)


		}.bind(this));
	},

	_requestDefaultVectorLayer : function (options) {

		console.log('_requestDefaultLayer', options);

		var file = options.file,
		    file_id = file.getUuid(),
		    project = options.project,
		    defaultCartocss = options.defaultCartocss,
		    defaultStyle = options.defaultStyle;


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
			"cartocss": defaultCartocss, 	// save default cartocss style (will be active on first render)
			"sql": "(SELECT * FROM " + file_id + ") as sub",
			"file_id": file_id,
			"return_model" : true,
			"projectUuid" : project.getUuid()
		}

		// create postgis layer
		Wu.post('/api/db/createLayer', JSON.stringify(layerJSON), function (err, layerJSON) {
			var layer = Wu.parse(layerJSON);

			console.log('db create layer', layer);

			var options = {
				projectUuid : project.getUuid(), // pass to automatically attach to project
				data : {
					postgis : layer.options
				},
				metadata : layer.options.metadata,
				title : file.getName(),
				description : 'Description: Layer created from ' + file.getName(),
				file : file.getUuid(),
				style : JSON.stringify(defaultStyle) // save default json style
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
					projectUuid : project.getUuid(),
					layerUuid : layerModel.uuid
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

	getRasterMeta : function () {
		if (!this.store.data.raster) return false;
		if (!this.store.data.raster.metadata) return false;
		var meta = Wu.parse(this.store.data.raster.metadata);
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