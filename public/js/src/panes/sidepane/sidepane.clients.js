// Projects and Clients
Wu.SidePane.Clients = Wu.SidePane.Item.extend({
	_ : 'sidepane.clients', 



	type : 'clients',
	title : 'Projects',

	initialize : function () {
		Wu.SidePane.Item.prototype.initialize.call(this)

		// active by default
		// Wu.app._active = this._content; // remove already
		this.activate();      
	},

	initContent : function () {

		// h3 title
		// var title = Wu.DomUtil.create('h3', '', this._container);
		// title.innerHTML = 'Clients';

		// clients container
		this._clientsContainer = Wu.DomUtil.create('div', 'editor-clients', this._container);

		// insert clients
		this.options.json.clients.forEach(function(client, i, arr) {    
			var clientDiv = new Wu.SidePane.Client(client);
			clientDiv.addTo(this._clientsContainer);
		}, this);

      		// insert create client button
		if (app.Account.canCreateClient()) this._insertNewClientButton();		
			
	},

	_insertNewClientButton : function () {
		// create New Client button
		var classname = 'smap-button-white new-client ct11 ct16 ct18';
		var newClientButton = Wu.DomUtil.create('div', classname, this._clientsContainer, '+');
		newClientButton.id = 'new-client-button';

		// add trigger
		this._addHook(newClientButton, 'click', this.newClient, this);
	},

	addHooks : function () {
		Wu.SidePane.Item.prototype.addHooks.call(this);
	},

	_activate : function () {

	},

	_deactivate : function () {

	},


	_create : function (client) {
		var clientDiv = new Wu.SidePane.Client(client);
		clientDiv.addTo(this._clientsContainer);
	},

	
	openClient : function (client) {
		this._container.style.height = '';
	},

	closeClient : function (client) {
		console.log('close client: ', client.name);
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
		Wu.DomUtil.appendTemplate(this._clientsContainer, ich.editorClientsNew(clientData));

		// set hooks: confirm button
		var target = Wu.DomUtil.get('editor-client-confirm-button');
		this._addHook(target, 'click', this._confirm, this);

		// cancel button
		var target = Wu.DomUtil.get('editor-client-cancel-button');
		this._addHook(target, 'click', this._cancel, this);

		// set hooks: writing name
		var name = Wu.DomUtil.get('editor-client-name-new');
		this._addHook(name, 'keyup', this._checkSlug, this);


	},

	_checkSlug : function () {

		// clear
		clearTimeout(this._timer);
		
		// check
		var that = this;
		this._timer = setTimeout(function() {
			var name = Wu.DomUtil.get('editor-client-name-new'),
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
		var target = Wu.DomUtil.get('editor-client-confirm-button');           // TODO: real block of button
		target.style.backgroundColor = 'red';
		console.log('Client name is not unique.')
	},

	_enableConfirm : function () {
		var target = Wu.DomUtil.get('editor-client-confirm-button');
		target.style.backgroundColor = '';
		console.log('Client name OK.');
	},

	_cancel : function () {
		// remove edit box
		var old = Wu.DomUtil.get('editor-clients-container-new').parentNode;
		Wu.DomUtil.remove(old);
	},

	_confirm : function () {

		// get client vars
		var clientName = Wu.DomUtil.get('editor-client-name-new').value;
		var clientDescription = Wu.DomUtil.get('editor-client-description-new').value;
		var clientKeywords = Wu.DomUtil.get('editor-client-keywords-new').value;
		
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
		var old = Wu.DomUtil.get('editor-clients-container-new').parentNode;
		Wu.DomUtil.remove(old);
		
		// create client in DOM
		editor._create(client);
	       
		// set active
		client.setActive();
	},

	toggleEdit : function (e) { // this = client
		console.log('toggle.edit');

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
	}



});
