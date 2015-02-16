// Projects and Clients
Wu.SidePane.Clients = Wu.SidePane.Item.extend({
	_ : 'sidepane.clients', 
	type : 'clients',
	title : 'Projects',

	initialize : function () {
		Wu.SidePane.Item.prototype.initialize.call(this)

		// active by default
		this.activate();      
	},

	initContent : function () {

		this.clients = [];

		// clients container
		this._clientsContainer = Wu.DomUtil.create('div', 'editor-clients', this._container);

		// insert clients
		this.options.json.clients.forEach(function(c, i, arr) {    
			var client = new Wu.SidePane.Client(c);
			client.addTo(this._clientsContainer);
			this.clients.push(client);
		}, this);

      		// insert create client button
		if (app.Account.canCreateClient()) this._insertNewClientButton();	

		// add tooltip
		app.Tooltip.add(this._menu, 'Here is a list of clients and projects you have access to.');


	},

	_insertNewClientButton : function () {
		
		// create New Client button
		var classname = 'smap-button-white new-client';
		var newClientButton = this._newClientButton = Wu.DomUtil.create('div', classname, this._clientsContainer, '+');
		newClientButton.id = 'new-client-button';

		// add trigger
		this._addHook(newClientButton, 'click', this.newClient, this);

		// add tooltip
		app.Tooltip.add(newClientButton, 'Click to create new client');

	},

	addHooks : function () {
		Wu.SidePane.Item.prototype.addHooks.call(this);
	},

	_activate : function () {

	},

	_deactivate : function () {
		this.clients.forEach(function (client) {
			client.close();
		}, this);
	},

	_create : function (c) {
		var client = new Wu.SidePane.Client(c);
		client.addTo(this._clientsContainer);
		this.clients.push(client);
	},
	
	openClient : function (client) {
		this._container.style.height = '';
	},

	closeClient : function (client) {
		// console.log('close client: ', client.name);
	},

	remove : function () {
		var client = this;
		var text = 'Are you sure you want to DELETE the client ' + client.name + '?';
		var text2 = 'Are you REALLY sure you want to DELETE the client ' + client.name + '? This CANNOT be undone!';
		if (confirm(text)) {
			if (confirm(text2)) {
				client._delete();  
			}
		}
	},

	_createNew : function () {
		this.newClient();
	},

	newClient : function () {

		// add new client box
		var clientData = {
			clientName : 'New client'
		}
			
		// prepend client to container
		// Wu.DomUtil.appendTemplate(this._clientsContainer, ich.editorClientsNew(clientData));


		this._newClient = {};

		this._newClient._wrapper 		= 	Wu.DomUtil.create('div', 'editor-clients-new-wrapper', this._clientsContainer);

		// #editor-clients-container-new OK
		this._newClient._innerWrapper		= 	Wu.DomUtil.create('div', 'editor-inner-wrapper editor-projects-container', this._newClient._wrapper);

		// #editor-client-item-new
		this._newClient._clientTitleWrapper	= 	Wu.DomUtil.create('div', 'editor-client-title', this._newClient._innerWrapper);
		this._newClient._title 			= 	Wu.DomUtil.create('h5', '', this._newClient._clientTitleWrapper, clientData.clientName);
		this._newClient._logo 			= 	Wu.DomUtil.create('img', '', this._newClient._clientTitleWrapper);

		this._newClient._container 		= 	Wu.DomUtil.create('div', 'new-client-container', this._newClient._innerWrapper);

		this._newClient._NameLabel		= 	Wu.DomUtil.create('label', '', this._newClient._container, 'Name:');
		this._newClient._NameLabel.setAttribute('for', 'editor-client-name-new');

		// #editor-client-name-new
		this._newClient._NameInput		= 	Wu.DomUtil.create('input', 'form-control margined eightyWidth', this._newClient._container);
		this._newClient._NameInput.value 	= 	clientData.clientName;

		this._newClient._DescriptionLabel	= 	Wu.DomUtil.create('label', '', this._newClient._container, 'Description:');
		this._newClient._DescriptionLabel.setAttribute('for', 'editor-client-description-new');

		// #editor-client-description-new
		this._newClient._DescriptionInput	= 	Wu.DomUtil.create('input', 'form-control margined eightyWidth', this._newClient._container);

		this._newClient._keywordsLabel		= 	Wu.DomUtil.create('label', '', this._newClient._container, 'Keywords:');
		this._newClient._keywordsLabel.setAttribute('for', 'editor-client-keywords-new');
		
		// #editor-client-keywords-new
		this._newClient._keywordsInput		= 	Wu.DomUtil.create('input', 'form-control margined eightyWidth', this._newClient._container);

		// #editor-client-confirm-button
		this._newClient._confirmButton		= 	Wu.DomUtil.create('div', 'smap-button-white small', this._newClient._innerWrapper, 'Confirm');

		// #editor-client-cancel-button
		this._newClient._cancelButton		= 	Wu.DomUtil.create('div', 'smap-button-white small', this._newClient._innerWrapper, 'Cancel');



		// move new button to last
		Wu.DomUtil.remove(this._newClientButton);
		this._clientsContainer.appendChild(this._newClientButton);

		// set hooks: confirm button
		// var target = Wu.DomUtil.get('editor-client-confirm-button');
		var target = this._newClient._confirmButton;
		this._addHook(target, 'click', this._confirm, this);

		// cancel button
		// var target = Wu.DomUtil.get('editor-client-cancel-button');
		var target = this._newClient._cancelButton;
		this._addHook(target, 'click', this._cancel, this);

		// set hooks: writing name
		// var name = Wu.DomUtil.get('editor-client-name-new');
		var name = this._newClient._NameInput;
		this._addHook(name, 'keyup', this._checkSlug, this);


	},

	_checkSlug : function () {

		// clear
		clearTimeout(this._timer);
		
		// check
		var that = this;
		this._timer = setTimeout(function() {
			// var name = Wu.DomUtil.get('editor-client-name-new'),
			var name = this._newClient._NameInput,
			    slug = Wu.Util.trimAll(name.value).toLowerCase(),
			    json = JSON.stringify({ 'slug' : slug}),
			    path = '/api/client/unique';

			// post       path   data    callback   context of cb
			Wu.Util.postcb(path, json, that._checkedSlug, that);

		}, 500);               
	},

	_checkedSlug : function (editor, raw) {
		var json = JSON.parse(raw);  

		// return enabled if unique
		if (json.unique) return editor._enableConfirm();

		// if error                             	// TODO error handling
		if (json.error) { console.log(json); return; }

		// not unique, change needed
		editor._disableConfirm();
		
	},

	_disableConfirm : function () {
		// var target = Wu.DomUtil.get('editor-client-confirm-button');           // TODO: real block of button
		var target = this._newClient._confirmButton;
		target.style.backgroundColor = 'red';
		console.log('Client name is not unique.')
	},

	_enableConfirm : function () {
		// var target = Wu.DomUtil.get('editor-client-confirm-button');
		var target = this._newClient._confirmButton;
		target.style.backgroundColor = '';
		// console.log('Client name OK.');
	},

	_cancel : function () {
		// remove edit box
		// var old = Wu.DomUtil.get('editor-clients-container-new').parentNode;
		var old = this._newClient._wrapper;

		Wu.DomUtil.remove(old);
	},

	_confirm : function () {

		// get client vars
		// var clientName = Wu.DomUtil.get('editor-client-name-new').value;
		var clientName = this._newClient._NameInput.value;
		// var clientDescription = Wu.DomUtil.get('editor-client-description-new').value;
		var clientDescription = this._newClient._DescriptionInput.value;
		// var clientKeywords = Wu.DomUtil.get('editor-client-keywords-new').value;
		var clientKeywords = this._newClient._keywordsInput;
		
		var options = {
			name : clientName,
			description : clientDescription,
			keywords : clientKeywords
		}

		var client = new Wu.Client(options);
		client.saveNew(); // callback = this._created below
	},

	_created : function(client, json) {       // this is the http callback        
		var editor = Wu.app.SidePane.Clients;
		var options = JSON.parse(json);
	       
		// update Client object
		Wu.extend(client, options);
		Wu.app.Clients[client.uuid] = client;

		// remove edit box
		// var old = Wu.DomUtil.get('editor-clients-container-new').parentNode;
		var old = this._newClient._wrapper;
		Wu.DomUtil.remove(old);

		// add permissions
		var user = app.Account;
		console.log('adding perm: ', client.getUuid());
		user.addUpdateClient(client);
	       		
		// create client in DOM
		editor._create(client);

		// set active
		client.setActive();

		// move new button to last
		Wu.DomUtil.remove(editor._newClientButton);
		editor._clientsContainer.appendChild(editor._newClientButton);
	},

	toggleEdit : function (e) { // this = client
		// console.log('toggle.edit');

		// stop propagation
		if (e) Wu.DomEvent.stop(e); 

		var client = this;
		var wrapper = Wu.DomUtil.get('editor-client-edit-wrapper-' + client.uuid);
		var container = Wu.DomUtil.get('editor-clients-container-' + client.uuid);
		if (client.options.editMode) {
			// hide dom
			Wu.DomUtil.removeClass(container, 'client-editor-open');
			Wu.DomUtil.removeClass(wrapper, 'client-editor-open');
			client.options.editMode = false;
		} else {
			// show dom
			Wu.DomUtil.addClass(container, 'client-editor-open');
			Wu.DomUtil.addClass(wrapper, 'client-editor-open');
			client.options.editMode = true;
		}
	},

	_addHook : function (elem, event, fn, uuid) {
		Wu.DomEvent.on(elem, event, fn, uuid);
	},

	select : function (client) {
		// skip if already selected
		if (Wu.app._activeClient == client) return; 

		// set active
		client.setActive(); // this = Wu.Client

		// reset active project
		if (Wu.app.activeProject) Wu.app.activeProject.unload();
		
		// refresh SidePane
		Wu.app.SidePane.Clients.refreshSidePane();
		
		// set client name in subheaders
		Wu.app.SidePane.setSubheaders();

	},

	refreshSidePane : function () {

		// refresh
		Wu.app.SidePane.refreshClient();

		// update SidePane.Users
		Wu.app.SidePane.Users.update();

	},

	_select : function () {
		var that = Wu.app.SidePane.Clients;   
		if (that._previousSelect) Wu.DomUtil.removeClass(that._previousSelect, 'active-client');
		Wu.DomUtil.addClass(this, 'active-client');
		that._previousSelect = this;
	},

	selectProject : function () {
		var project = this;
		project.setActive();         
	},

	disable : function () {
		// noop
	},

	update : function () {
		// noop
		// this.setContentHeight();
	},


});
