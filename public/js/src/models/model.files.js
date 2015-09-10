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

			console.log('_addToProject err, body', err, body);

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
		console.log('Wu.Files.setCategory: ', category);

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
		console.log('saving description1!!!!!');
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

		console.log('SAVING FILE!!');                         
		app.setSaveStatus();// set status
	},



	// todo: move all delete of files here
	_deleteFile : function () {
		console.log('file._deleteFile', this.getName(), this);



		// check if dataset has layers
		this._getLayers(function (err, layers) {
			console.log('_getLayers', err, layers);

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

			});
			



		}.bind(this));


		return;


		


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
		console.log('file._createLayer', this.getName(), project);

		this._createDefaultLayer(project);
	},

	_downloadFile : function () {
		console.log('file._downloadFile', this.getName());
	},



	_createDefaultLayer : function (project) {

		var file_id = this.getUuid();
		var file = this;

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
			"cartocss": "#layer {  \n polygon-fill: red; \n marker-fill: #001980; \n marker-allow-overlap: true; \n marker-clip: false; \n marker-comp-op: screen;}",
			"sql": "(SELECT * FROM " + file_id + ") as sub",
			"file_id": file_id,
			"return_model" : true,
			"projectUuid" : project.getUuid()
		}

		// create postgis layer
		Wu.post('/api/db/createLayer', JSON.stringify(layerJSON), function (err, layerJSON) {
			console.log('api/db/createLayer', err, layerJSON);
			var layer = Wu.parse(layerJSON);

			var options = {
				projectUuid : project.getUuid(), // pass to automatically attach to project
				data : {
					postgis : layer.options
				},
				metadata : layer.options.metadata,
				title : 'Layer from ' + file.getName(),
				description : 'Description: Layer created from ' + file.getName(),
				file : file.getUuid()
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








});