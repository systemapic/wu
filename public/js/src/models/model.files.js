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
		console.log('fiel', fileUuid);
		var project = _.find(app.Projects, function (p) {
			return p.files[fileUuid];
		});
		console.log('PRO', project);
		var layer = _.find(project.layers, function (l) {
			return l.getFileUuid() == fileUuid;
		});
		console.log('layer: ', layer);
		return layer;
	},

	getCopyright : function () {
		return this.store.copyright;
	},

	setCopyright : function (copyright) {
		this.store.copyright = copyright;
		this.save('copyright');
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
	_delete : function () {

	},
















});