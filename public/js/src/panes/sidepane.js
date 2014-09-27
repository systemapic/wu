// ███████╗██╗██████╗ ███████╗██████╗  █████╗ ███╗   ██╗███████╗
// ██╔════╝██║██╔══██╗██╔════╝██╔══██╗██╔══██╗████╗  ██║██╔════╝
// ███████╗██║██║  ██║█████╗  ██████╔╝███████║██╔██╗ ██║█████╗  
// ╚════██║██║██║  ██║██╔══╝  ██╔═══╝ ██╔══██║██║╚██╗██║██╔══╝  
// ███████║██║██████╔╝███████╗██║     ██║  ██║██║ ╚████║███████╗
// ╚══════╝╚═╝╚═════╝ ╚══════╝╚═╝     ╚═╝  ╚═╝╚═╝  ╚═══╝╚══════╝
                                                             
// The SidePane menubar
Wu.SidePane = Wu.Class.extend({


	initialize : function (options) {
		
		this.options = options || Wu.app.options;

		this.initContainer();
		this.initContent();
		this.render();     
		
		return this;   
	},

	
	initContainer: function () {

		// create container
		var className = 'q-editor-container ct1';
		this._container = Wu.DomUtil.create('div', className, Wu.app._appPane);
		
		// toggle panes button
		this.paneOpen = false; // default
	},


	initContent : function () {
		
		// menu pane
		var className = 'q-editor-menu ct0';
		Wu.app._editorMenuPane = Wu.DomUtil.create('menu', className, this._container); 

		// content pane
		var className = 'q-editor-content ct1';
		Wu.app._editorContentPane = Wu.DomUtil.create('content', className, this._container); 

		// menuslider
		Wu.app._menuSlider = Wu.DomUtil.createId('div', 'menuslider', this._container);
		Wu.DomUtil.addClass(Wu.app._menuSlider, 'ct1');
		
	},
	
	render : function () {

		// render sidepanes
		this.Clients 	  = new Wu.SidePane.Clients();
		this.Map 	  = new Wu.SidePane.Map();
		this.Documents 	  = new Wu.SidePane.Documents();
		this.DataLibrary  = new Wu.SidePane.DataLibrary();
		this.MediaLibrary = new Wu.SidePane.MediaLibrary();
		this.Users 	  = new Wu.SidePane.Users();

	},


	setProject : function (project) {

		// update content
		this.Map.updateContent(project);
		this.Documents.updateContent(project);
		this.DataLibrary.updateContent(project);
	},

	refreshProject : function (project) {
		var editMode = project.editMode; // access determined at Wu.Project
		
		// default menus in SidePane
		var panes = ['Clients', 'Map', 'Documents', 'DataLibrary', 'MediaLibrary', 'Users'];	// case-sensitive -> eg. Wu.SidePane.DataLibrary
		
		// remove Map pane if not editor
		if (!editMode) _.pull(panes, 'Map');
		if (!app.Account.isManager()) _.pull(panes, 'Users');

		// refresh
		this.refresh(panes);
	},

	refreshClient : function () {
		
		// set panes 
		var panes = ['Clients'];
		if (app.Account.isManager()) panes.push('Users');

		// refresh
		this.refresh(panes);
	},

	// display the relevant panes
	refresh : function (panes) {
		
		this.panes = [];

		// all panes
		var all = ['Clients', 'Map', 'Documents', 'DataLibrary', 'MediaLibrary', 'Users'];
				
		// panes to active
		panes.forEach(function (elem, i, arr) {
			if (!Wu.app.SidePane[elem]) {
				Wu.app.SidePane[elem] = new Wu.SidePane[elem];
			}
			Wu.app.SidePane[elem].enable();
			this.panes.push(elem);	// stored for calculating the menu slider
		}, this);

		// panes to deactivate
		var off = all.diff(panes);
		off.forEach(function (elem, i, arr) {
			Wu.app.SidePane[elem].disable();
			_.pull(this.panes, elem);
		}, this)

	},

	// // toggle sidepane
	// togglePane : function () {
	// 	if (!Wu.app.activeProject) return;
		
	// 	// toggle
	// 	if (this.paneOpen) return this.closePane();
	// 	this.openPane();

	// 	// refresh map size
	// 	setTimeout(function() {
	// 		var map = Wu.app._map;
	// 		if (map) map.reframe();
	// 	}, 300); // time with css
	// },


	// close sidepane
	closePane : function () {
		
		// return if already closed
		if (!this.paneOpen) return;
		this.paneOpen = false;

		// close
		this._container.style.width = '100px';

		// refresh leaflet
		setTimeout(function() {
			var map = Wu.app._map;
			if (map) map.reframe();
		}, 300); // time with css

		this._closePane();
	},

	_closePane : function () {				// refactor: move to SidePane.Item ... 
		console.log('__closePane item, this', this);
		// noop
	},	

	// open sidepane
	openPane : function () {
		
		// return if already open
		if (this.paneOpen) return;
		this.paneOpen = true;

		// open
		this._container.style.width = '400px';

		// refresh leaflet
		setTimeout(function() {
			var map = Wu.app._map;
			if (map) map.reframe();
		}, 300); // time with css
	},

	// set subheaders with client/project
	setSubheaders : function () {
		return;
		var client = Wu.app._activeClient; 	// TODO: refactor! _activeClient no longer exists
		var project = Wu.app.activeProject;

		// if active client 
		if (!client) return;
		Wu.DomUtil.get('h4-projects-client-name').innerHTML = client.name; 		// set projects' subheader
		Wu.DomUtil.get('h4-map-configuration-client-name').innerHTML = client.name; 	// set map configuration subheader
		Wu.DomUtil.get('h4-layers-client-name').innerHTML = client.name; 		// set layers subheader
		
		// if active project
		if (!project) return;
		Wu.DomUtil.get('h4-map-configuration-project-name').innerHTML = project.name; 	// set map configuration subheader
		Wu.DomUtil.get('h4-layers-project-name').innerHTML = project.name; 		// set layers subheader
	}
});










/*
██╗████████╗███████╗███╗   ███╗
██║╚══██╔══╝██╔════╝████╗ ████║
██║   ██║   █████╗  ██╔████╔██║
██║   ██║   ██╔══╝  ██║╚██╔╝██║
██║   ██║   ███████╗██║ ╚═╝ ██║
╚═╝   ╚═╝   ╚══════╝╚═╝     ╚═╝
*/                                                                                                         
// general item template
Wu.SidePane.Item = Wu.Class.extend({
       
	type : 'item',

	initialize : function () {
		Wu.setOptions(this, Wu.app.options);
		this.render();
	},

	render : function () {
		this.initContainer();  // will be lower-most function first, if available (ie. 'this' is context from where fn was run)
		this.initContent();
		this.addHooks();
		this.disable();
	},

	addHooks : function () {
		// menu items bindings
		Wu.DomEvent.on(this._menu, 'click', this._clickActivate, this);          // click
		Wu.DomEvent.on(this._menu, 'mouseenter', this._mouseenter, this);   // mouseEnter
		Wu.DomEvent.on(this._menu, 'mouseleave', this._mouseleave, this);   // mouseLeave
	},

	_mouseenter : function (e) {
		Wu.DomUtil.addClass(this._menu, 'red');
	},

	_mouseleave : function (e) {
		Wu.DomUtil.removeClass(this._menu, 'red');
	},

	// if clicking on already active tab, toggle it
	_reclick : function () {
		// if open
		if (Wu.app.SidePane.paneOpen) {

			// hack to hide fullscreen tabs (documents, datalib, users);	
			Wu.DomUtil.removeClass(Wu.app._active, 'show');			
			
			// close pane
			Wu.app.SidePane.closePane();
		
		// if closed
		} else {
			
			// hack to hide fullscreen tabs (documents, datalib, users);
			Wu.DomUtil.addClass(Wu.app._active, 'show');	// hack
			
			// open pane
			Wu.app.SidePane.openPane();

		}
	},



	_clickActivate : function (e) {

		// if clicking on already active tab, toggle it
		if (Wu.app._activeMenu == this) return this._reclick();

		// open pane if not closed
		if (!Wu.app.SidePane.paneOpen) Wu.app.SidePane.openPane();

		// continue tab activation
		this.activate();

	},

	activate : function (e) {
		
		// set active menu
		var prev = Wu.app._activeMenu || false;
		Wu.app._activeMenu = this;
		    
		// active content                       
		Wu.app._active = this._content;  

		// check vertical swipe action    (j)
		this.checkSwipe(prev);

		// add active to menu 		  (j)
		if (prev) { Wu.DomUtil.removeClass(prev._menu, 'active'); }
		Wu.DomUtil.addClass(this._menu, 'active');

		// call deactivate on previous for cleanup  (j)
		if (prev) { prev._deactivate(); };

		// activate local context
		this._activate();

		// update pane
		this.update();   //todo: refactor: now it's _update, _updateContent, refresh all over tha place
	},

	_activate : function () {

	},

	_deactivate : function () {

	},

	// check swipe of sidepane on selecting menu item (j)
	checkSwipe : function (prev) {

		if (prev) return this.swiper(prev);

		// Hide the Deactivated Pane
		if (Wu.app._active) Wu.DomUtil.removeClass(Wu.app._active, 'show')                                             

		// Show the Activated Pane                              
		Wu.app._active = this._content;
		Wu.DomUtil.addClass(Wu.app._active, 'show');                                    
	
	},

	// do swipe of sidepane when selecting menu item, by jorgen
	swiper : function (prev) {
		
		// set vars
		var swypefrom = prev._content;
		var swypeto = Wu.app._active;               

		// if same, do nothing
		if (swypefrom == swypeto) return;

		// update the slider on the left    
		var h = 70;
		var menuslider = Wu.DomUtil.get('menuslider');
		   
		// get classy
		var classy = this._menu.classList;

		// set width depending on whether pane is open or not
		var open = Wu.app.SidePane.paneOpen;
		var w = '100px';
		if (open) w = '400px';
	
		// check which 
		if (_.contains(classy, 'clients')) {
			menuslider.style.top = '0px';
			Wu.app.SidePane._container.style.width = w;
		}

		if (_.contains(classy, 'map')) {
			var n = app.SidePane.panes.indexOf('Map');		// calculate position
			menuslider.style.top = h * n + 'px';
			Wu.app.SidePane._container.style.width = w;
		}
	    
		if (_.contains(classy, 'documents')) {
			var n = app.SidePane.panes.indexOf('Documents');
			menuslider.style.top = h * n + 'px';
			Wu.app.SidePane._container.style.width = '100%';
		}
	    
		if (_.contains(classy, 'dataLibrary')) {
			var n = app.SidePane.panes.indexOf('DataLibrary');
			menuslider.style.top = h * n + 'px';
			Wu.app.SidePane._container.style.width = '100%';
		}
	    

	    	if (_.contains(classy, 'mediaLibrary')) {
			var n = app.SidePane.panes.indexOf('MediaLibrary');
			menuslider.style.top = h * n + 'px';
			Wu.app.SidePane._container.style.width = '100%';
		}


		if (_.contains(classy, 'users')) {
			var n = app.SidePane.panes.indexOf('Users');
			menuslider.style.top = h * n + 'px';
			Wu.app.SidePane._container.style.width = '100%';
		}
				
		
		// Find out what to swipe from
		// The Sliders Container
		var _content_container = document.getElementsByTagName('menu')[0];		// refactor
	    
		// Create some vars
		var swipethis, swfrom, swto, swipeOut, swipeIn;
		
		// Find all the swipeable elements....
		var _under_dogs = _content_container.getElementsByTagName('div');		// refactor
				
		// Find what position the swipe from and to is in the array
		for ( var a = 0; a<_under_dogs.length;a++) {
			if ( _under_dogs[a] == prev._menu ) { swfrom = a; }                 
			if ( _under_dogs[a] == this._menu ) { swto = a; }
		}
		
		// Check if we're swiping up or down
		if ( swfrom > swto ) {
			swipeOut = 'swipe_out';
			swipeIn = 'swipe_in';						// maybe refactor, write as separate fn's - up/down vs. in/out ?
		} else {
			swipeOut = 'swipe_out_up';
			swipeIn = 'swipe_in_up';
		}               
		    
		// Hide the Deactivated Pane
		if (Wu.app._active) {
			    
			Wu.DomUtil.addClass(swypefrom, swipeOut);                   
					    
			// Remove classes from the swiped out element
			setTimeout(function(){
				Wu.DomUtil.removeClass(swypefrom, 'show');
				Wu.DomUtil.removeClass(swypefrom, swipeOut);
			}, 300);                                
		};
					
		// Swipe this IN
		Wu.DomUtil.addClass(swypeto, 'show');
		Wu.DomUtil.addClass(swypeto, swipeIn);              
		
		setTimeout(function(){
			Wu.DomUtil.removeClass(swypeto, swipeIn);   
		}, 300);
			
	},


	initContainer : function () {
		// menu
		var className = 'q-editor-menu-item ' + this.type;
		this._menu = Wu.DomUtil.create('div', className, Wu.app._editorMenuPane);
		this._title = Wu.DomUtil.create('a', this.type, this._menu);
		this._title.innerHTML = Wu.Util.capitalize(this.title || this.type);

		// content
		var className = 'q-editor-content-item ' + this.type;
		this._content = Wu.DomUtil.create('div', className, Wu.app._editorContentPane);

		// wrapper 
		this._container = Wu.DomUtil.create('div', 'editor-wrapper ct13', this._content);
	},

	initContent : function () {

	},

	updateContent : function (project) {

	},

	_addHook : function (elem, event, fn, uuid) {
		Wu.DomEvent.on(elem, event, fn, uuid);
	},


	disable : function () {

		// disable click
		Wu.DomEvent.off(this._menu, 'click', this._clickActivate, this); 

		// add disabled class
		Wu.DomUtil.addClass(this._menu, 'disabled');

	},

	enable : function () {

		// enable click
		Wu.DomEvent.on(this._menu, 'click', this._clickActivate, this); 

		// remove disabled class
		Wu.DomUtil.removeClass(this._menu, 'disabled');
	},

	remove : function () {
		delete this._menu;
		delete this._content;
		delete this;
	},

});





// Subelements under Clients/Client
Wu.SidePane.Project = Wu.Class.extend({

	initialize : function (project, parent) {
		this.project = project;
		this._parent = parent; // client div container

		this.project._menuItem = this;

		this.initLayout(); 	// create divs
		this.update();		// fill in divs

		return this;
	},

	initLayout : function () {

		// create container
		this._container = Wu.DomUtil.create('div', 'project-item');

		// create title
		this.name = Wu.DomUtil.create('div', 'project-title', this._container);
		this.name.type = 'name';

		// create description
		this.description = Wu.DomUtil.create('div', 'project-description', this._container);
		this.description.type = 'description';

		// create logo
		this.logo = Wu.DomUtil.create('div', 'project-logo', this._container);
		this.logo.type = 'logo';

		// create createdBy
		this.createdBy = Wu.DomUtil.create('div', 'project-createdby', this._container);

		// create lastModified
		this.lastUpdated = Wu.DomUtil.create('div', 'project-lastupdated', this._container);

		// create createdDate
		this.createdDate = Wu.DomUtil.create('div', 'project-createddate', this._container);

		// create users
		this.users = Wu.DomUtil.create('div', 'project-users-wrap', this._container);
		this.usersInner = Wu.DomUtil.create('div', 'project-users', this.users);
		Wu.DomEvent.on(this.users, 'mouseenter', this.expandUsers, this);
		Wu.DomEvent.on(this.users, 'mouseleave', this.collapseUsers, this);


		// kill button
		if (app.Account.canDeleteProject(this.project.store.uuid)) {
			this.kill = Wu.DomUtil.create('div', 'project-kill', this._container, 'X');
		}

		// add hooks
		this.addHooks();

	},

	expandUsers : function () {
		Wu.DomUtil.addClass(this.usersInner, 'expand');
	},

	collapseUsers : function () {
		Wu.DomUtil.removeClass(this.usersInner, 'expand');
	},

	update : function (project) {
		this.project 			= project || this.project;
		this.name.innerHTML 		= this.project.store.name;
		this.description.innerHTML 	= this.project.store.description;
		this.logo.style.backgroundImage = "url('" + this.project.store.logo + "')";
		this.createdBy.innerHTML 	= 'Created by:<br> ' + this.project.store.createdByName;
		this.lastUpdated.innerHTML 	= '<span class="update-header">Last updated: ' + Wu.Util.prettyDate(this.project.store.lastUpdated) + '</span>';
		this.createdDate.innerHTML 	= Wu.Util.prettyDate(this.project.store.created);
		this.usersInner.innerHTML       = this.project.getUsersHTML();
	},

	addHooks : function () {
		Wu.DomEvent.on(this._container, 'mouseenter', this.open, this);
		Wu.DomEvent.on(this._container, 'mouseleave', this.close, this);
		Wu.DomEvent.on(this._container, 'click',      this.select, this);
	
		// add edit hooks
		if (this.project.editMode) this.addEditHooks();
	},

	
	removeHooks : function () {
		Wu.DomEvent.off(this._container, 'mouseenter', this.open, this);
		Wu.DomEvent.off(this._container, 'mouseleave', this.close, this);
		Wu.DomEvent.off(this._container, 'click', this.select, this);

		// remove edit hooks
		if (this.project.editMode) this.removeEditHooks();
	},

	
	addEditHooks : function () {

		// editing hooks
		if (!this.project.editMode) return;
		Wu.DomEvent.on(this.name, 	 'dblclick', this.edit, this);
		Wu.DomEvent.on(this.description, 'dblclick', this.edit, this);
		Wu.DomEvent.on(this.logo, 	 'click', Wu.DomEvent.stop, this);
		this.addLogoDZ();

		// add kill hook
		if (app.Account.canDeleteProject(this.project.getUuid())) {
			Wu.DomEvent.on(this.kill, 'click', this.deleteProject, this);
		}
	},

	removeEditHooks : function () {
		if (!this.project.editMode) return;

		// editing hooks
		Wu.DomEvent.off(this.name, 	  'dblclick', this.edit, this);
		Wu.DomEvent.off(this.description, 'dblclick', this.edit, this);
		Wu.DomEvent.off(this.logo, 	  'click', Wu.DomEvent.stop, this);
		this.removeLogoDZ();

		// remove kill hook
		if (app.Account.canDeleteProject(this.project.getUuid())) {
			Wu.DomEvent.off(this.kill, 'click', this.deleteProject, this);
		}
	},


	// edit hook for client logo
	addLogoDZ : function () {

		// create dz
		this.logodz = new Dropzone(this.logo, {
				url : '/api/project/uploadlogo',
				createImageThumbnails : false,
				autoDiscover : false
		});
		
		// set client uuid param for server
		this.logodz.options.params.project = this.project.getUuid();
		
		// set callback on successful upload
		var that = this;
		this.logodz.on('success', function (err, path) {
			that.editedLogo(path);
		});

		// set image frame with editable clas
		Wu.DomUtil.addClass(this.logo, 'editable');

	},

	removeLogoDZ : function () {
		// disable edit on logo
		if (this.logodz) this.logodz.disable();
		delete this.logodz;

		// set image frame without editable clas
		Wu.DomUtil.removeClass(this.logo, 'editable');
	},


	editedLogo : function (path) {

		// set path
		var fullpath = '/images/' + path;
		
		// set new image and save
		this.project.setLogo(fullpath);

		// update image in header
		this.logo.style.backgroundImage = "url('" + this.project.getLogo() + "')";
	},

	addTo : function (container) {
		container.appendChild(this._container);
		return this;
	},

	addToBefore : function (container) {
		// insert second to last
		var last = container.lastChild;
		container.insertBefore(this._container, last);
	},

	remove : function (container) {
		Wu.DomUtil.remove(this._container);
		return this;
	},

	open : function () {
		// console.log('open sesame!');

	},

	close : function () {
		// console.log('close for ali babar!');

	},

	select : function () {

		// dont select if already active
		// if (this.project == app.activeProject) return;         // todo: activeProject is set at beginning, even tho no active.. fix!

		// select project
		this.project.select();

		// update sidepane
		Wu.app.SidePane.refreshProject(this.project);

		// set client name in sidepane subheaders
		Wu.app.SidePane.setSubheaders();	

	},

	edit : function (e) {
		console.log('edit!', e, this);
		
		// return if already editing
		if (this.editing) return;
		this.editing = true;

		var div = e.target;
		var type = div.type;
		var value = div.innerHTML;

		var input = ich.injectProjectEditInput({value:value});
		div.innerHTML = input;

		// focus
		var target = div.firstChild;
		target.focus();
		target.selectionStart = target.selectionEnd;	// prevents text selection

		// save on blur or enter
		Wu.DomEvent.on( target,  'blur',    this._editBlur, this );     // save folder title
		Wu.DomEvent.on( target,  'keydown', this._editKey,  this );     // save folder title

	},

	_editBlur : function (e) {
		
		// get value
		var value = e.target.value;

		// revert to <div>
		var div = e.target.parentNode;
		div.innerHTML = value;

		// if name, change slug also
		if (div.type == 'name') this.project.setSlug(value);

		// save latest
		this.project.store[div.type] = value;
		this.project._update(div.type);

		this.editing = false;

	},

	_editKey : function (e) {
		// blur on enter
		if (event.which == 13 || event.keyCode == 13) e.target.blur();
	},

	deleteProject : function (e) {

		// prevent project select
		Wu.DomEvent.stop(e);

		// todo: add extra access checks? no better security really... 

		var answer = confirm('Are you sure you want to delete project ' + this.project.store.name + '?');
		if (!answer) return;

		var second = confirm('Are you REALLY sure you want to delete project ' + this.project.store.name + '? You cannot UNDO this action!');
		if (!second) return; 

		// twice confirmed, delete
		this.confirmDelete();

	},

	confirmDelete : function () {

		// remove hooks
		this.removeHooks();
	
		// unload project // todo: doesn't work!
		if (this.project.selected) this.project.unload();
	
		// remove 
		this._parent.removeProject(this.project);
		Wu.DomUtil.remove(this._container);

		// delete
		this.project._delete();
		delete this;
	}



});


// subelements in clients sidepane
Wu.SidePane.Client = Wu.Class.extend({


	initialize : function (client) {

		// set client object
		this.client = app.Clients[client.uuid];

		// set edit mode
		this.editable = app.Account.canCreateClient();

		// init layout
		this.initLayout(); 

		// fill in 
		this.update();		

		return this;		// only added to DOM after return
	},

	initLayout : function () {

		// create container
		this._container = Wu.DomUtil.create('div', 'editor-clients-container ct0');

		// create title
		this.title = Wu.DomUtil.create('div', 'client-title', this._container);

		// create description
		this.description = Wu.DomUtil.create('div', 'client-description', this._container);

		// create logo
		this.logo = Wu.DomUtil.create('img', 'client-logo', this._container);

		// create projects container
		this._projectsContainer = Wu.DomUtil.create('div', 'projects-container', this._container);

	},


	addTo : function (container) {
		
		// append
		container.appendChild(this._container);
		
		// add hooks
		this.addHooks();

		// add edit hooks
		if (this.editable) this.addEditHooks();
		
		return this;
	},

	remove : function (container) {
		Wu.DomUtil.remove(this._container);
		return this;
	},
	

	update : function () {

		// update client meta
		this.title.innerHTML 	    = this.client.getName();
		this.description.innerHTML  = this.client.getDescription();
		this.logo.setAttribute('src', this.client.getLogo());
		
		// insert client's projects
		this.insertProjects();

	},


	insertProjects : function (projects) {
		var client = this.client;

		// get client's projects
		this.projects = _.filter(Wu.app.Projects, function (p) { return p.store.client == client.getUuid(); });

		// return if no projects, add + button 
		if (!this.projects) return this.editButtons();

		// sort by date created
		this.projects = _.sortBy(this.projects, function (l) { return l.store.lastUpdated; });  // todo: different sorts
		this.projects.reverse();								// sort descending

		// for each
		this.projects.forEach(function (p){

			// new project item view
			var projectDiv = new Wu.SidePane.Project(p, this);

			// app to client
			projectDiv.addTo(this._projectsContainer);

		}, this);

		// add + project button
		this.editButtons();

		// calculate heights
		this.calculateHeight();

	},

	editButtons : function () {

		// remove old
		if (this._newProjectButton) Wu.DomUtil.remove(this._newProjectButton);
		if (this._removeClientButton) Wu.DomUtil.remove(this._removeClientButton);

		// create project button
		if (app.Account.canCreateProject()) {
			var className = 'smap-button-white new-project-button ct11 ct16 ct18';
			this._newProjectButton = Wu.DomUtil.create('div', className, this._projectsContainer, '+');
			Wu.DomEvent.on(this._newProjectButton, 'mousedown', this.createNewProject, this);
		}
		
		// remove client button
		if (app.Account.canDeleteClient(this.client.uuid)) {
			this._removeClientButton = Wu.DomUtil.create('div', 'client-kill', this._container, 'X');
			Wu.DomEvent.on(this._removeClientButton, 'mousedown', this.removeClient, this);
		}

	},

	removeClient : function (e) {

		// client not empty
		var p = this.projects.length;
		if (p > 0) return alert('The client ' + this.client.getName() + ' has ' + p + ' projects. You must delete these individually first before deleting client.');
		
		// confirm
		var answer = confirm('Are you sure you want to delete client ' + this.client.getName() + '?');
		if (!answer) return;

		// confirm again
		var second = confirm('Are you REALLY sure you want to delete client ' + this.client.getName() + '? You cannot UNDO this action!');
		if (!second) return; 

		// twice confirmed, delete
		this.confirmDeleteClient();

	},

	confirmDeleteClient : function () {

		// remove from DOM
		Wu.DomUtil.remove(this._container);

		// delete client
		this.client.destroy();

	},

	createNewProject : function () {

		// create project object
		
		var store = {
			name 		: 'Project title',
			description 	: 'Project description',
			created 	: new Date().toJSON(),
			lastUpdated 	: new Date().toJSON(),
			createdByName 	: app.Account.getName(),
			keywords 	: '',
			client 		: this.client.uuid,
			position 	: {},
			bounds : {
				northEast : {
					lat : 0,
					lng : 0
				},
				southWest : {
					lat : 0,
					lng : 0
				},
				minZoom : 1,
				maxZoom : 22
			},
			header : {
				height : 50
			},
			folders : []

		}
		var options = {
			store : store
		}


		// create new project with options, and save
		var project = new Wu.Project(store);
		project.editMode = true;
		project._saveNew(this); 
		
		// add project to client array
		this.projects.push(project);

		// new project item view
		var projectDiv = new Wu.SidePane.Project(project);

		// add to client container
		projectDiv.addToBefore(this._projectsContainer);

		// refresh height
		this.open();

	},

	_projectCreated : function (project, json) {

		var result = JSON.parse(json);

		var error = result.error;
		var store = result.project;

		console.log('error: ', error);
		console.log('Project created ====>>> ', store);

		if (error) {
			console.log('there was an error creating new project!', error);
			return;
		}

		// update project store
		project.setStore(store);

		// add to access locally
		app.Account.addProjectAccess(project); // todo!

		// select project
		project._menuItem.select();

	},

	

	addHooks : function () {
		Wu.DomEvent.on( this._container.parentNode, 'mouseleave', this.close, this);	// todo: add click for opening also...
		Wu.DomEvent.on( this._container, 'mousemove', this.pendingOpen, this);
		Wu.DomEvent.on( this._container, 'mousedown', this.open, this);
	},

	removeHooks : function () {
		Wu.DomEvent.off( this._container.parentNode, 'mouseleave', this.close, this);
		Wu.DomEvent.off( this._container, 'mousemove', this.pendingOpen, this);
		Wu.DomEvent.off( this._container, 'mousedown', this.open, this);
	},

	addEditHooks : function () {
		Wu.DomEvent.on( this.title, 	  'dblclick', this.editName, 	    this );
		Wu.DomEvent.on( this.description, 'dblclick', this.editDescription, this );
		this.addLogoDZ();
	},

	removeEditHooks : function () {
		Wu.DomEvent.off( this.title, 	   'dblclick', this.editName, 	     this );
		Wu.DomEvent.off( this.description, 'dblclick', this.editDescription, this );
		this.removeLogoDZ();
	},


	editName : function () {

		// return if already editing
		if (this.editing) return;
		this.editing = true;
		
		// inject <input>
		var div = this.title;
		var value = div.innerHTML;
		div.innerHTML = ich.injectClientEditInput({ value : value }); 

		// focus
		var target = div.firstChild;
		target.focus();
		target.selectionStart = target.selectionEnd;	// prevents text selection

		// save on blur or enter
		Wu.DomEvent.on( target,  'blur',    this.editedName, this );     	// save title
		Wu.DomEvent.on( target,  'keydown', this.editKeyed,  this );           // save title

	},

	editedName : function (e) {
	
		// revert to <div>
		var target = e.target;
		var value = target.value;
		var div = this.title;
		div.innerHTML = value;

		// save latest
		this.client.setName(value);
		
		// remove listeners
		Wu.DomEvent.off( target,  'blur',    this.editedName, this );     	// save title
		Wu.DomEvent.off( target,  'keydown', this.editKeyed,  this );          // save title

		// mark not editing
		this.editing = false;

	},

	editKeyed : function (e) {
		// blur on enter
		if (event.which == 13 || event.keyCode == 13) e.target.blur();
	},

	editDescription : function () {
		// return if already editing
		if (this.editing) return;
		this.editing = true;
		
		// inject <input>
		var div = this.description;
		var value = div.innerHTML;
		div.innerHTML = ich.injectClientEditInput({ value : value }); 

		// focus
		var target = div.firstChild;
		target.focus();
		target.selectionStart = target.selectionEnd;	// prevents text selection

		// save on blur or enter
		Wu.DomEvent.on( target,  'blur',    this.editedDescription, this );     // save title
		Wu.DomEvent.on( target,  'keydown', this.editKeyed,   	    this );     // save title

	},

	editedDescription : function (e) {

		// revert to <div>
		var target = e.target;
		var value = target.value;
		var div = this.description;
		div.innerHTML = value;

		// save 
		this.client.setDescription(value);
		
		// remove listeners
		Wu.DomEvent.off( target,  'blur',    this.editedDescription, this );    // save title
		Wu.DomEvent.off( target,  'keydown', this.editKeyed,   	     this );    // save title

		// mark not editing
		this.editing = false;

	},

	
	// edit hook for client logo
	addLogoDZ : function () {

		// create dz
		this.logodz = new Dropzone(this.logo, {
				url : '/api/client/uploadlogo',
				createImageThumbnails : false,
				autoDiscover : false
		});
		
		// set client uuid param for server
		this.logodz.options.params.client = this.client.getUuid();
		
		// set callback on successful upload
		var that = this;
		this.logodz.on('success', function (err, path) {
			that.editedLogo(path);
		});

		// set image frame with editable clas
		Wu.DomUtil.addClass(this.logo, 'editable');

	},

	removeLogoDZ : function () {
		// disable edit on logo
		if (this.logodz) this.logodz.disable();
		delete this.logodz;

		// set image frame without editable clas
		Wu.DomUtil.removeClass(this.logo, 'editable');
	},


	editedLogo : function (path) {
		
		// set path
		var fullpath = '/images/' + path;
		
		// set new image and save
		this.client.setLogo(fullpath);

		// update image in header
		this.logo.src = fullpath;

	},


	


	pendingOpen : function () {
		if (app._timerOpenClient) clearTimeout(app._timerOpenClient);
		if (this._isOpen) return;

		var that = this;
		app._timerOpenClient = setTimeout(function () {
			that.open();
			if (app._pendingCloseClient) app._pendingCloseClient.close();
			app._pendingCloseClient = that;
		}, 200);	
	},

	open : function () {
		this.calculateHeight();
		this._container.style.height = this.maxHeight + 'px';          
		this._isOpen = true;
	},


	close : function () {   				
		this.calculateHeight();
		this._container.style.height = this.minHeight + 'px';    
		this._isOpen = false;
		app._pendingCloseClient = false;
		if (app._timerOpenClient) clearTimeout(app._timerOpenClient);
	},

	

	removeProject : function (project) {
		_.remove(this.projects, function (p) { return p.store.uuid == project.store.uuid; });
		this.calculateHeight();
		this.open();
	},

	calculateHeight : function () {
		var min = 150;
		this.maxHeight = min + _.size(this.projects) * 116;
		this.minHeight = 80;
	},


	
});





/*
 ██████╗██╗     ██╗███████╗███╗   ██╗████████╗
██╔════╝██║     ██║██╔════╝████╗  ██║╚══██╔══╝
██║     ██║     ██║█████╗  ██╔██╗ ██║   ██║   
██║     ██║     ██║██╔══╝  ██║╚██╗██║   ██║   
╚██████╗███████╗██║███████╗██║ ╚████║   ██║   
 ╚═════╝╚══════╝╚═╝╚══════╝╚═╝  ╚═══╝   ╚═╝                                         							 
*/
// Clients
Wu.SidePane.Clients = Wu.SidePane.Item.extend({

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
		var title = Wu.DomUtil.create('h3', '', this._container);
		title.innerHTML = 'Clients';

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




// /*
// ██████╗ ██████╗  ██████╗      ██╗███████╗ ██████╗████████╗███████╗
// ██╔══██╗██╔══██╗██╔═══██╗     ██║██╔════╝██╔════╝╚══██╔══╝██╔════╝
// ██████╔╝██████╔╝██║   ██║     ██║█████╗  ██║        ██║   ███████╗
// ██╔═══╝ ██╔══██╗██║   ██║██   ██║██╔══╝  ██║        ██║   ╚════██║
// ██║     ██║  ██║╚██████╔╝╚█████╔╝███████╗╚██████╗   ██║   ███████║
// ╚═╝     ╚═╝  ╚═╝ ╚═════╝  ╚════╝ ╚══════╝ ╚═════╝   ╚═╝   ╚══════╝
// */
// Wu.SidePane.Projects = Wu.SidePane.Item.extend({

// 	type : 'projects',

// 	initContent : function () {
		
// 		// template        
// 		this._container.innerHTML = ich.editorProjectsContainer();

// 		// sort by buttons
// 		// this._sortleft = Wu.DomUtil.get('editor-projects-sort-by-left');
// 		// this._sortright = Wu.DomUtil.get('editor-projects-sort-by-right');
// 		// this._sortIsList = false;

// 		// set panes
// 		this._projectsContainer = Wu.DomUtil.get('editor-projects-container');
		

// 		// ACCESS
// 		if (Wu.can.createProject()) {

// 			// new project button
// 			this._newProjectsButton = Wu.DomUtil.createId('div', 'new-project-button');
// 			this._newProjectsButton.innerHTML = 'Create New Project';
// 			Wu.DomUtil.addClass(this._newProjectsButton, 'smap-button-white ct11 ct18');

// 			// insert before 
// 			this._projectsContainer.parentNode.insertBefore(this._newProjectsButton, this._projectsContainer);
			
// 			// add trigger
// 			Wu.DomEvent.on(this._newProjectsButton, 'click', this._createNew, this);
// 		}

// 		// set vars
// 		this._projects = {};
// 		this._editMode = false;
		
// 		// additional hooks
// 		this._addHooks();

// 		// default 
// 		this._doSortRight();	// TODO, buggy.. just set it in css. sort is going out anyway.
	       
// 	},

// 	_addHooks : function () {
// 		// list or box view for projects
// 		// Wu.DomEvent.on(this._sortleft, 'click', this._doSortLeft, this);
// 		// Wu.DomEvent.on(this._sortright, 'click', this._doSortRight, this);
// 	},

// 	_activate : function () {

// 	},

// 	deactivate : function () {

// 	},

// 	_doSortRight : function () {
// 		// return if already sorted as list               
// 		if (this._sortIsList) return;

// 		// swipe elements left
// 		for (p in this._projects) {
// 			var div = this._projects[p];
// 			Wu.DomUtil.addClass(div, 'swipe_left');
// 		}

// 		// fasten elements after swipe
// 		var that = this;
// 		setTimeout(function(){
// 			for (p in that._projects) {
// 				var div = that._projects[p];
// 				Wu.DomUtil.removeClass(div, 'swipe_left');
// 				Wu.DomUtil.addClass(div, 'list');
// 				Wu.DomUtil.removeClass (div, 'box');
// 			}
// 			Wu.DomUtil.addClass(that._projectsContainer, 'list_view');
// 		}, 150);        

// 		// set direction
// 		this._sortIsList = true;
// 	},

// 	_doSortLeft : function () {
// 		// return if already sorted as box
// 		if (!this._sortIsList) return;

// 		// swipe elements left
// 		for (p in this._projects) {
// 			var div = this._projects[p];
// 			Wu.DomUtil.addClass(div, 'swipe_left');
// 		}

// 		// fasten elements after swipe
// 		var that = this;
// 		setTimeout(function(){
// 			for (p in that._projects) {
// 				var div = that._projects[p];
// 				Wu.DomUtil.removeClass(div, 'swipe_left');
// 				Wu.DomUtil.removeClass(div, 'list');
// 				Wu.DomUtil.addClass (div, 'box');
// 			}
// 			Wu.DomUtil.removeClass(that._projectsContainer, 'list_view');
// 		}, 150);   

// 		// set current direction
// 		this._sortIsList = false;
// 	},

// 	refresh : function () {
// 		this.update();	// refactor out
// 	},
	
// 	update : function () {

// 		var client = Wu.app._activeClient;
		
// 		// reset container
// 		this._projectsContainer.innerHTML = '';

// 		// fill in with projects that belong to active client
// 		for (item in Wu.app.Projects) { 
// 			var project = Wu.app.Projects[item];
// 			if (project.client == client.uuid) this._create(project);
// 		};

// 	},


// 	// entry point when selecting new project
// 	select : function (project) {

// 		// skip if already selected
// 		if (Wu.app.activeProject == project) return; 

// 		// set project active
// 		project.setActive();        // Wu.Project.setActive();

// 		// set active in pane
// 		var pro = Wu.app.SidePane.Projects._projects;
// 		for (p in pro) Wu.DomUtil.removeClass(pro[p], 'active');
// 		Wu.DomUtil.addClass(pro[project.uuid], 'active');
		
// 		// update sidepane
// 		Wu.app.SidePane.refreshProject(project);

// 		// set client name in sidepane subheaders
// 		Wu.app.SidePane.setSubheaders();		

// 	},

       

// 	// sortProjects : function (e, bool) {

// 	// 	console.log('sort!');
// 	// 	console.log(this);
// 	// 	console.log(e);
// 	// 	console.log(bool);
// 	// },


// 	_createNew : function () {

// 		// add new project box
// 		var projectData = {
// 			projectName : 'New project'
// 		}
			
// 		// prepend client to container
// 		Wu.DomUtil.prependTemplate(this._projectsContainer, ich.editorProjectsNew(projectData), true);

// 		// set hooks: confirm button
// 		var target = Wu.DomUtil.get('editor-project-confirm-button');
// 		this._addHook(target, 'click', this._confirm, this);

// 		// cancel button
// 		var target = Wu.DomUtil.get('editor-project-cancel-button');
// 		this._addHook(target, 'click', this._cancel, this);

// 		// set hooks: writing name                                      // TODO: unique names on projects?
// 		//var name = Wu.DomUtil.get('editor-project-name-new');
// 		//this._addHook(name, 'keyup', this._checkSlug, this);

// 	},

// 	_cancel : function () {
// 		// remove edit box
// 		var old = Wu.DomUtil.get('editor-projects-container-new');
// 		Wu.DomUtil.remove(old);
// 	},

// 	_confirm : function () {

// 		// get client vars
// 		var name = Wu.DomUtil.get('editor-project-name-new').value;
// 		var description = Wu.DomUtil.get('editor-project-description-new').value;
// 		var keywords = Wu.DomUtil.get('editor-project-keywords-new').value;
		
// 		var options = {
// 			name : name,
// 			description : description,
// 			keywords : keywords,
// 			client : Wu.app._activeClient.uuid
// 		}

// 		// create new project with options, and save
// 		var project = new Wu.Project(options);
// 		project._saveNew(); 
// 	},

// 	_create : function (project) {
		
// 		// create view
// 		var data = {
// 			projectName : project.name || '',
// 			projectLogo : project.logo || '',
// 			uuid        : project.uuid 
// 		}
// 		var target = Wu.DomUtil.create('div', 'editor-projects-item ct0');
// 		target.setAttribute('uuid', project.uuid);
// 		target.innerHTML = ich.editorProjectsItem(data);
// 		this._projectsContainer.appendChild(target);

// 		// save locally
// 		this._projects[project.uuid] = target;
		
// 		// when clicking on project box               
// 		Wu.DomEvent.on(target, 'click', function () {
// 			this.select(Wu.app.Projects[project.uuid]);
// 		}, this);

// 		// if user can edit project, add edit dropdown
// 		var editMode = Wu.can.editProject(project.uuid);
// 		if (editMode) {
// 			// add hook for edit button
// 			var editButton = Wu.DomUtil.get('project-edit-button-' + project.uuid);
// 			Wu.DomEvent.on(editButton, 'mousedown', this.toggleEdit, this);
// 			Wu.DomEvent.on(editButton, 'click', Wu.DomEvent.stop, this);
// 			Wu.DomUtil.removeClass(editButton, 'displayNone'); // show
// 		} else {
// 			var editButton = Wu.DomUtil.get('project-edit-button-' + project.uuid);
// 			Wu.DomUtil.addClass(editButton, 'displayNone'); // hide 
// 		}

// 	},

// 	toggleEdit : function (e) {

// 		// stop propagation
// 		if (e) Wu.DomEvent.stop(e); 

// 		var uuid = e.target.getAttribute('uuid');
// 		var container = Wu.DomUtil.get('editor-project-edit-wrapper-' + uuid);
// 		var project = Wu.app.Projects[uuid];
		
// 		// close all other editors
// 		if (this._editorPane) Wu.DomUtil.remove(this._editorPane);

// 		// toggle edit mode
// 		this._editMode = !this._editMode;

// 		// close if second click
// 		if (!this._editMode) return;
		   
// 		// create editor div
// 		project._editorPane = this._editorPane = Wu.DomUtil.create('div', 'editor-project-edit-super-wrap ct11 ct17');
// 		var html = ich.editorProjectEditWrapper({
// 			'uuid' : uuid, 
// 			'name' : project.name, 
// 			'description' : project.description,
// 			'keywords' : project.keywords
// 		});
// 		project._editorPane.innerHTML = html;

// 		// find out if project elem is odd or even in list
// 		var i = this._projects[uuid].parentNode.childNodes;
// 		for (var n = 0; n < i.length; n++) {
// 			if (i[n].getAttribute('uuid') == uuid) {
// 				var num = n;
// 				var odd = num % 2;
// 			}
// 		}

// 		// insert editor into list
// 		if (!odd) {
// 			// get referencenode
// 			var refnum = parseInt(num) + 1;
// 			if (refnum > i.length-1) refnum = i.length-1;
// 			var referenceNode = i[refnum];

// 			// insert editor div
// 			referenceNode.parentNode.insertBefore(project._editorPane, referenceNode.nextSibling);
// 			Wu.DomUtil.addClass(project._editorPane, 'left');
		
// 		} else {
// 			// get referencenode
// 			var refnum = num;
// 			var referenceNode = i[refnum];

// 			// insert editor div
// 			referenceNode.parentNode.insertBefore(project._editorPane, referenceNode.nextSibling);
// 			Wu.DomUtil.addClass(project._editorPane, 'right');
// 		}


// 		// get elements
// 		this._editName = Wu.DomUtil.get('editor-project-name-' + uuid);
// 		this._editDescription = Wu.DomUtil.get('editor-project-description-' + uuid);
// 		this._editKeywords = Wu.DomUtil.get('editor-project-keywords-' + uuid);
// 		this._deleteButton = Wu.DomUtil.get('editor-project-delete-' + uuid);


// 		// add hooks
// 		Wu.DomEvent.on(this._editName, 'keydown blur', function (e) {
// 			this.autosave(project, 'name');
// 		}, this);

// 		Wu.DomEvent.on(this._editDescription, 'keydown blur', function (e) {    // todo: will drop save sometimes if blur < 500ms
// 			this.autosave(project, 'description');
// 		}, this);

// 		Wu.DomEvent.on(this._editKeywords, 'keydown blur', function (e) {
// 			this.autosave(project, 'keywords');
// 		}, this);

// 		Wu.DomEvent.on(this._deleteButton, 'mousedown', function (e) {
// 			this._delete(project);
// 		}, this);

// 	},

// 	_delete : function (project) {
		
// 		// confirm dialogue, todo: create stylish confirm
// 		if (confirm('Are you sure you want to delete project "' + project.name + '"?')) {    
		
// 			// delete project object
// 			project._delete();

// 			// delete locally from user
// 			console.log('this...', this);
		
// 			// delete in DOM
// 			var del = this._projects[project.uuid];
// 			Wu.DomUtil.remove(del);
// 			if (this._editorPane) Wu.DomUtil.remove(this._editorPane);
// 		}
// 	},

// 	autosave : function (project, key) {
// 		var that = this;
// 		clearTimeout(this._saving);

// 		// save after 500ms of inactivity
// 		this._saving = setTimeout(function () {
// 			that.saveText(project, key);
// 		}, 500);

// 	},

// 	saveText : function (project, key) {
// 		project[key] = Wu.DomUtil.get('editor-project-' + key + '-' + project.uuid).value;
// 		project._update(key);
// 	},


// 	_created : function (project, json) {

// 		var editor = Wu.app.SidePane.Projects;
// 		var options = JSON.parse(json);
	       
// 		// update Project object
// 		Wu.extend(project, options);
// 		Wu.app.Projects[project.uuid] = project;

// 		// remove edit box
// 		var old = Wu.DomUtil.get('editor-projects-container-new');
// 		Wu.DomUtil.remove(old);
		
// 		// create client in DOM
// 		editor._create(project);
	       
// 		// set active
// 		project.setActive();

// 		// add access to User (locally)
// 		Wu.app.User.options.access.projects.write.push(project.uuid);
// 		Wu.app.User.options.access.projects.read.push(project.uuid);
// 		Wu.app.User.options.access.projects.manage.push(project.uuid);

// 		// set parent client
// 		Wu.app._activeClient.projects.push(project.uuid);
// 		Wu.app._activeClient.update('projects');
// 	}
// });









































/*
███╗   ███╗ █████╗ ██████╗ 
████╗ ████║██╔══██╗██╔══██╗
██╔████╔██║███████║██████╔╝
██║╚██╔╝██║██╔══██║██╔═══╝ 
██║ ╚═╝ ██║██║  ██║██║     
╚═╝     ╚═╝╚═╝  ╚═╝╚═╝     
*/
Wu.SidePane.Map = Wu.SidePane.Item.extend({

	type : 'map',

	title : 'Options',

	initContent : function () {

		// longhand 
		this.app = Wu.app;

		// content to template
		this._container.innerHTML = ich.editorMapBaseLayer();

		// set panes
		this._panes = {};

		this._panes.projectTitle = Wu.DomUtil.get('h4-map-configuration-project-name');

		// init each setting
		this.mapSettings = {};
		this.mapSettings.baselayer = new Wu.SidePane.Map.BaseLayers();
		this.mapSettings.layermenu = new Wu.SidePane.Map.LayerMenu();
		this.mapSettings.bounds    = new Wu.SidePane.Map.Bounds();
		this.mapSettings.position  = new Wu.SidePane.Map.Position();
		this.mapSettings.controls  = new Wu.SidePane.Map.Controls();
		this.mapSettings.connect   = new Wu.SidePane.Map.Connect(this._container);  // refactor container, ich.template

	},

	
	addHooks : function () {
		
	},

	// run when sidepane activated
	_activate : function () {
	},

	// run when sidepane deactivated
	_deactivate : function () {

	},

	updateContent : function () {
		this._update();
	},

	_resetView : function () {

	},

	update : function () {
		this._update();
	},

	_update : function () {

		// use active project
		this.project = app.activeProject;

		// update map settings
		for (s in this.mapSettings) {
			var setting = this.mapSettings[s];
			setting.update();
		}

		// update project name
		this._panes.projectTitle.innerHTML = this.project.getName();

	},



});




 //  __  __            ____       _   _   _                 
 // |  \/  | __ _ _ __/ ___|  ___| |_| |_(_)_ __   __ _ ___ 
 // | |\/| |/ _` | '_ \___ \ / _ \ __| __| | '_ \ / _` / __|
 // | |  | | (_| | |_) |__) |  __/ |_| |_| | | | | (_| \__ \
 // |_|  |_|\__,_| .__/____/ \___|\__|\__|_|_| |_|\__, |___/
 //              |_|                              |___/     

Wu.SidePane.Map.MapSetting = Wu.SidePane.Map.extend({

	type : 'mapSetting',


	initialize : function (container) {

		this.panes = {};

		// get panes
		this.mapsettingsContainer = Wu.DomUtil.get('mapsettings-container');
		this.getPanes();

		// init layout
		this.initLayout(container);
		
		// add hooks
		this.addHooks();

	},


	buttonDown : function (e) {
		Wu.DomUtil.addClass(e.target, 'btn-info');
	},

	buttonUp : function (e) {
		Wu.DomUtil.removeClass(e.target, 'btn-info');
	},

	update : function () {
		// set active project
		this.project = Wu.app.activeProject;

	},

	addHooks : function () {
		Wu.DomEvent.on( this.mapsettingsContainer, 'mouseleave', this.close, this);	
		Wu.DomEvent.on( this._container, 'mousemove', this.pendingOpen, this);
		Wu.DomEvent.on( this._container, 'mousedown', this.open, this);
	},

	calculateHeight : function () {
		this.maxHeight = this._inner.offsetHeight + 15;
		this.minHeight = 0;
	},

	pendingOpen : function () {
		if (app._timerOpen) clearTimeout(app._timerOpen);
		if (this._isOpen) return;

		var that = this;
		app._timerOpen = setTimeout(function () {
			that.open();
			if (app._pendingClose) app._pendingClose.close();
			app._pendingClose = that;
		}, 200);	
	},

	open : function () {
		this.calculateHeight();
		this._outer.style.height = this.maxHeight + 'px';       
		this._open(); // local fns   
		this._isOpen = true;
	},


	close : function () {   				// perhaps todo: now it's closing every pane, cause addHooks been run 6 times.
		console.log('close ', this.type);		// set this to app._pendingclose here for just one close... 
		this.calculateHeight();
		this._outer.style.height = this.minHeight + 'px';        
		this._close();
		this._isOpen = false;
		app._pendingClose = false;
		if (app._timerOpen) clearTimeout(app._timerOpen);
	},

	_open : function () {
		// noop
		app.SidePane.Map.mapSettings.layermenu.disableEdit();
	}, 

	_close : function () {
		// noop
		
	},

	initLayout : function () {
		// noop
	},

	getPanes : function () {
		// noop
	},
	

});



 //   ____                            _   
 //  / ___|___  _ __  _ __   ___  ___| |_ 
 // | |   / _ \| '_ \| '_ \ / _ \/ __| __|
 // | |__| (_) | | | | | | |  __/ (__| |_ 
 //  \____\___/|_| |_|_| |_|\___|\___|\__|
                                       

Wu.SidePane.Map.Connect = Wu.SidePane.Map.MapSetting.extend({

	type : 'connect',			

	initLayout : function (container) {
		
		// container, header, outer
		this._container	 	= Wu.DomUtil.create('div', 'editor-inner-wrapper editor-map-item-wrap ct12 ct17 ct23', container);
		var h4 			= Wu.DomUtil.create('h4', '', this._container, 'Connected Accounts');
		this._outer 		= Wu.DomUtil.create('div', 'connect-outer', this._container);

		// mapbox connect
		var wrap 	  	= Wu.DomUtil.create('div', 'connect-mapbox', this._outer);
		var h4 		  	= Wu.DomUtil.create('div', 'connect-mapbox-title', wrap, 'Mapbox');
		this._mapboxWrap  	= Wu.DomUtil.create('div', 'mapbox-connect-wrap ct11', this._outer);
		this._mapboxInput 	= Wu.DomUtil.create('input', 'input-box search import-mapbox-layers', this._mapboxWrap);
		this._mapboxConnect 	= Wu.DomUtil.create('div', 'smap-button-gray ct0 ct11 import-mapbox-layers-button', this._mapboxWrap, 'Connect');
		this._mapboxAccounts 	= Wu.DomUtil.create('div', 'mapbox-accounts', this._mapboxWrap);
		this._mapboxInput.setAttribute('placeholder', 'Mapbox username');

	},

	addHooks : function () {
		Wu.SidePane.Map.MapSetting.prototype.addHooks.call(this)

		// connect mapbox button
		Wu.DomEvent.on( this._mapboxConnect, 'click', this.importMapbox, this );
	},

	calculateHeight : function () {
		var num = this.project.getMapboxAccounts().length;

		this.maxHeight = 100 + num * 30;
		this.minHeight = 0;
	},

	// on click when adding new mapbox account
	importMapbox : function () {

		// get username
		var username = this._mapboxInput.value;

		// clear
		this._mapboxInput.value = '';

		// get mapbox account via server
		this._importMapbox(username);

	},

	_importMapbox : function (username) {

		// get mapbox account via server
		var data = {
			'username' : username,
			'projectId' : this.project.store.uuid
		}
		// post         path                            json          callback      this
		Wu.post('/api/util/getmapboxaccount', JSON.stringify(data), this.importedMapbox, this);
	},

	importedMapbox : function (that, json) {
		
		// project store
		var result = JSON.parse(json);
		var error = result.error;
		var store = result.project;

		if (error) {
			console.log('There was an error importing mapbox: ', error);
			return;
		}

		that.project.setStore(store);

	},

	fillMapbox : function () {

		// get accounts
		var accounts = this.project.getMapboxAccounts();

		// return if no accounts
		if (!accounts) return;

		// reset
		this._mapboxAccounts.innerHTML = '';
		
		// fill with accounts
		accounts.forEach(function (account) {
			var wrap  = Wu.DomUtil.create('div', 'mapbox-listed-account', this._mapboxAccounts);
			var title = Wu.DomUtil.create('div', 'mapbox-listed-account-title', wrap, account.camelize());

			// add kill button for editMode... // todo: what about layers in deleted accounts, etc etc??
			// if (this.project.editMode) {
			// 	var kill = Wu.DomUtil.create('div', 'mapbox-listed-account-kill', wrap, 'X');
				
			// 	// add hook
			// 	Wu.DomEvent.on(kill, 'click', function () {
			// 		this.removeAccount(wrap, account);
			// 	}, this);
			// }

		}, this);
		

	},

	removeAccount : function (div, account) {
		Wu.DomUtil.remove(div);
		this.project.removeMapboxAccount(account);
	},

	update : function () {
		Wu.SidePane.Map.MapSetting.prototype.update.call(this)	// call update on prototype

		// fill in mapbox accounts
		this.fillMapbox();
	},



})




 //  ____                 _                              
 // | __ )  __ _ ___  ___| |    __ _ _   _  ___ _ __ ___ 
 // |  _ \ / _` / __|/ _ \ |   / _` | | | |/ _ \ '__/ __|
 // | |_) | (_| \__ \  __/ |__| (_| | |_| |  __/ |  \__ \
 // |____/ \__,_|___/\___|_____\__,_|\__, |\___|_|  |___/
 //                                  |___/               

Wu.SidePane.Map.BaseLayers = Wu.SidePane.Map.MapSetting.extend({

	type : 'baseLayers',


	getPanes : function () {
		// map baselayer
		this._container = Wu.DomUtil.get('editor-map-baselayer-wrap');
	},


	initLayout : function () {

		// create title and wrapper (and delete old content)
		this._container.innerHTML = '<h4>Base Layers</h4>';
		var div 		  = Wu.DomUtil.createId('div', 'select-baselayer-wrap', this._container);
		this._outer 		  = Wu.DomUtil.create('div', 'select-elems', div);
		Wu.DomUtil.addClass(div, 'select-wrap');
	},

	
	update : function () {
		Wu.SidePane.Map.MapSetting.prototype.update.call(this)	// call update on prototype

		// options
		this.editMode = false;

		// refresh layout
		this.initLayout();

		// fill in with layers
		this.fillLayers();
		
	},

	fillLayers : function () {

		// return if no layers
	       	if (_.isEmpty(this.project.layers)) return;
	       	
	       	// fill in with layers in DOM
	       	_.each(this.project.layers, function (layer) {
	       		this.addLayer(layer);
	       	}, this);

	       	// calculate height for wrapper
	       	this.calculateHeight();

	},


	addLayer : function (layer) {

		// create and append div
		var container = Wu.DomUtil.create('div', 'item-list select-elem ct0', this._outer);
		container.innerHTML = layer.store.title;

		// append edit button
		var button = Wu.DomUtil.create('div', 'edit-baselayer', container);

		// append range selectors
		var rangeOpacity = Wu.DomUtil.create('input', 'baselayer-range-slider-opacity', container);
		var rangeZindex  = Wu.DomUtil.create('input', 'baselayer-range-slider-zindex', container);


		// todo: z-index, opacity
		var baseLayer = {
			layer : layer,
			container : container, 
			active : false,
			rangeOpacity : rangeOpacity, 
			rangeZindex : rangeZindex
		}

		// // set active or not
		this.project.store.baseLayers.forEach(function (b) {
			if (layer.store.uuid == b.uuid) {
				this.on(baseLayer);
			}
		}, this);

		// add toggle hook
		Wu.DomEvent.on( container, 'mousedown', function (e) { 

			// prevent other click events
			Wu.DomEvent.stop(e);

			// toggle layer
			this.toggle(baseLayer);

		}, this );

		// add edit hook
		Wu.DomEvent.on (button, 'mousedown', function (e) {
			
			// prevent other click events
			Wu.DomEvent.stop(e);

			// toggle editMode
			this.toggleEdit(baseLayer);

		}, this);

		

	},

	toggleEdit : function (baseLayer) {
		if (this.editMode) {
			this.editOff(baseLayer);
		} else {
			this.editOn(baseLayer);
		}
	},

	setOpacity : function () {
		if (!this.context.rangeOpacity) return;

		// set opacity on layer
		var opacity = parseFloat(this.context.rangeOpacity.element.value / 100);
		this.layer.setOpacity(opacity);

		// save to baseLayer
		var uuid 	  = this.layer.store.uuid;
		var baseLayer 	  = _.find(this.context.project.store.baseLayers, function (base) { return base.uuid == uuid; });
		var project 	  = this.context.project;
		baseLayer.opacity = opacity;
		this.context.save(); // save

	},

	setZIndex : function () {
		if (!this.context.rangeZindex) return;

		var zIndex = parseFloat(this.context.rangeZindex.element.value);
		this.layer.setZIndex(zIndex);

		// save to baseLayer
		var uuid 	  = this.layer.store.uuid;
		var baseLayer 	  = _.find(this.context.project.store.baseLayers, function (base) { return base.uuid == uuid; });
		var project 	  = this.context.project;
		baseLayer.zIndex  = zIndex;
		this.context.save(); // save
	},

	save : function () {
		var that = this;

		// clear timer
		if (this.saveTimer) clearTimeout(this.saveTimer);

		// save on timeout
		this.saveTimer = setTimeout(function () {
			that.project._update('baseLayers');
		}, 1000);       // don't save more than every goddamed second

	},

	editOn : function (baseLayer) {

		// get opacity
		var uuid 	    = baseLayer.layer.store.uuid;
		var storeBaselayer  = _.find(this.project.store.baseLayers, function (b) { return b.uuid == uuid; });
		if (storeBaselayer) {
			var opacity = parseInt(storeBaselayer.opacity * 100);
		} else {
			var opacity = 1;
		}

		// create range slider
		this.rangeOpacity = new Powerange(baseLayer.rangeOpacity, {
			callback      : this.setOpacity,// callback
			decimal       : false,
			disable       : false,
			disableOpacity: 0.5,
			hideRange     : false,
			klass         : 'powerange-opacity',
			min           : 0,
			max           : 100,
			start         : opacity,	// opacity
			step          : null,
			vertical      : false,
			context       : this,		// need to pass context
			layer         : baseLayer.layer	// passing layer
		});

		this.rangeZindex = new Powerange(baseLayer.rangeZindex, {
			callback      : this.setZIndex, 
			decimal       : false,
			disable       : false,
			disableOpacity: 0.5,
			hideRange     : false,
			klass         : 'powerange-zindex',
			min           : 1,
			max           : 10,
			start         : null,
			step          : 1,
			vertical      : false,
			context       : this,
			layer         : baseLayer.layer
		});

		// set editMode
		this.editMode = true;

		// show range selectah
		baseLayer.container.style.height = '132px';

		// prevent events
		var handle = this.rangeZindex.handle;
		var slider = this.rangeZindex.slider;
		Wu.DomEvent.on(handle, 'mousedown', Wu.DomEvent.stop, this);
		Wu.DomEvent.on(slider, 'mousedown', Wu.DomEvent.stop, this);

		var handle = this.rangeOpacity.handle;
		var slider = this.rangeOpacity.slider;
		Wu.DomEvent.on(handle, 'mousedown', Wu.DomEvent.stop, this);
		Wu.DomEvent.on(slider, 'mousedown', Wu.DomEvent.stop, this);

		// account for extra height with editor
		this.calculateHeight();
		this.open();
	},

	editOff : function (baseLayer) {

		// set editMode
		this.editMode = false;

		// hide editor
		baseLayer.container.style.height = '32px';

		// reset events
		var handle = this.rangeZindex.handle;
		var slider = this.rangeZindex.slider;
		Wu.DomEvent.on(handle, 'mousedown', Wu.DomEvent.stop, this);
		Wu.DomEvent.on(slider, 'mousedown', Wu.DomEvent.stop, this);

		// remove range divs
		Wu.DomUtil.remove(this.rangeZindex.slider);
		Wu.DomUtil.remove(this.rangeOpacity.slider);
		Wu.DomUtil.remove(this.rangeZindex.handle);
		Wu.DomUtil.remove(this.rangeOpacity.handle);
		delete this.rangeZindex;
		delete this.rangeOpacity;

		// account for extra height of wrapper with editor
		this.calculateHeight();
		this.open();

	},

	toggle : function (baseLayer) {
		if (baseLayer.active) {
			this.off(baseLayer);
			this.disableLayer(baseLayer);
		} else {
			this.on(baseLayer);
			this.enableLayer(baseLayer);
		}
	},

	on : function (baseLayer) {
		// enable in baseLayer menu
		Wu.DomUtil.addClass(baseLayer.container, 'active');
		baseLayer.active = true;
	},

	off : function (baseLayer) {
		// disable in baseLayer menu
		Wu.DomUtil.removeClass(baseLayer.container, 'active');
		baseLayer.active = false;
	},

	enableLayer : function (baseLayer) {

		// enable layer on map
		baseLayer.layer.enable();

		// get default opacity
		var opacity = baseLayer.layer.getOpacity();

		// save
		this.project.store.baseLayers.push({
			uuid : baseLayer.layer.store.uuid,
			zIndex : 1,
			opacity : opacity
		});
		this.save();
	
		// refresh baselayerToggleControl
		var baselayerToggle = app.MapPane.baselayerToggle;
		if (baselayerToggle) baselayerToggle.update();
	},

	disableLayer : function (baseLayer) {

		// disable layer in map
		baseLayer.layer.disable(); 

		// save
		_.remove(this.project.store.baseLayers, function (b) { return b.uuid == baseLayer.layer.store.uuid; });
		this.save();

		// refresh baselayerToggleControl
		var baselayerToggle = app.MapPane.baselayerToggle;
		if (baselayerToggle) baselayerToggle.update();

	},

	calculateHeight : function () {
		this.maxHeight = _.size(this.project.layers) * 33;
		this.minHeight = 0;

		// add 100 if in editMode
		if (this.editMode) this.maxHeight += 100;
	},
});



 //  _                          __  __                  
 // | |    __ _ _   _  ___ _ __|  \/  | ___ _ __  _   _ 
 // | |   / _` | | | |/ _ \ '__| |\/| |/ _ \ '_ \| | | |
 // | |__| (_| | |_| |  __/ |  | |  | |  __/ | | | |_| |
 // |_____\__,_|\__, |\___|_|  |_|  |_|\___|_| |_|\__,_|
 //             |___/                                   
Wu.SidePane.Map.LayerMenu = Wu.SidePane.Map.MapSetting.extend({

	type : 'layerMenu',



	getPanes : function () {
		this._container = Wu.DomUtil.get('editor-map-layermenu-wrap');
	},

	initLayout : function () {

		// create title and wrapper (and delete old content)
		this._container.innerHTML = '<h4>Layer Menu</h4><br>';		
		this._inner  = Wu.DomUtil.create('div', 'map-layermenu-inner', this._container);
		this._outer  = Wu.DomUtil.create('div', 'map-layermenu-outer', this._inner);
		var status   = 'Enable layer menu in Controls below.';
		this._status = Wu.DomUtil.create('div', 'layermenu-status', this._outer, status);

	},


	update : function () {
		Wu.SidePane.Map.MapSetting.prototype.update.call(this)	// call update on prototype

		// get layermenu object
		this.layerMenu = Wu.app.MapPane.layerMenu;

		// options
		this.editMode = false;

		// refresh layout
		this.initLayout();

		// fill in with layers
		this.fillLayers();
		
	},

	fillLayers : function () {

		this._layers = {};

		// return if no layers
	       	if (_.isEmpty(this.project.layers)) return;
	       	
	       	// fill in with layers in DOM
	       	_.each(this.project.layers, function (layer) {
	       		this.addLayer(layer);
	       	}, this);

	       	// calculate height for wrapper
	       	this.calculateHeight();

	},

	// add layers to layermenu list in sidepane
	addLayer : function (layer) {

		// create and append div
		var container = Wu.DomUtil.create('div', 'item-list select-elem ct0', this._outer);
		container.innerHTML = layer.store.title;

		// append edit button
		var button = Wu.DomUtil.create('div', 'edit-layermenu-layer', container);

		// append range selectors
		var rangeOpacity = Wu.DomUtil.create('input', 'layermenu-range-slider-opacity', container);
		var rangeZindex  = Wu.DomUtil.create('input', 'layermenu-range-slider-zindex', container);


		// todo: z-index, opacity
		var layermenuLayer = {
			layer 		: layer,
			container 	: container, 
			active 		: false,

			rangeOpacity 	: rangeOpacity, 
			rangeZindex 	: rangeZindex
		}

		// store for reuse
		this._layers[layer.store.uuid] = layermenuLayer;

		// set active or not
		this.project.store.layermenu.forEach(function (b) {			
			if (layer.store.uuid == b.layer) {
				this.on(layermenuLayer);
			}
		}, this);

		// add toggle hook
		Wu.DomEvent.on( container, 'mousedown', function (e) { 

			// prevent other click events
			Wu.DomEvent.stop(e);

			// toggle layer
			this.toggle(layermenuLayer);

		}, this );

		// add edit hook
		Wu.DomEvent.on (button, 'mousedown', function (e) {
			
			// prevent other click events
			Wu.DomEvent.stop(e);

			return console.log('edit layer!');

			// toggle editMode
			this.toggleEdit(layermenuLayer);

		}, this);

		

	},

	calculateHeight : function () {
		this.maxHeight = _.size(this.project.layers) * 33 + 20; // add 20 for status msg
		this.minHeight = 0;

		// add 100 if in editMode
		if (this.editMode) this.maxHeight += 100;
	},

	enableLayermenu : function () {
		var layerMenu = app.MapPane.enableLayermenu();
		app.SidePane.Map.mapSettings.controls.enableControl('layermenu');
		
		// save changes to project
		this.project.store.controls.layermenu = true;
		this.project._update('controls');
		
		return layerMenu;
	},

	toggle : function (layer) {
		
		// ensure layerMenu is active
		this.layerMenu = this.layerMenu || Wu.app.MapPane.layerMenu;
		if (!this.layerMenu) this.layerMenu = this.enableLayermenu();
		

		if (layer.active) {
			
			// remove from layermenu
			var uuid = layer.layer.store.uuid;
			this.layerMenu._remove(uuid);

			// set off
			this.off(layer);

		} else {

			// add to layermenu
			this.layerMenu.add(layer.layer);

			// set on
			this.on(layer);
		}
	},

	toggleEdit : function (layer) {

	},

	on : function (layermenuLayer) {
		// enable in layermenuLayer menu
		Wu.DomUtil.addClass(layermenuLayer.container, 'active');
		layermenuLayer.active = true;
	},

	off : function (layermenuLayer) {
		// disable in layermenuLayer menu
		Wu.DomUtil.removeClass(layermenuLayer.container, 'active');
		layermenuLayer.active = false;
	},

	// turn off layer initiated on layermenu
	_off : function (layer) {
		var uuid = layer.store.uuid;
		var layermenuItem = this._layers[uuid];
		this.off(layermenuItem);
	},

	// post-open
	_open : function () {
		this.enableEdit();
		clearTimeout(this.closeEditTimer);
	},

	// post-close
	_close : function () {
		clearTimeout(this.closeEditTimer);
		var that = this;
		this.closeEditTimer = setTimeout(function() {
			that.disableEdit();
		}, 3000);
	},

	// enable edit mode on layermenu itself
	enableEdit : function () {
		var layerMenu = Wu.app.MapPane.layerMenu;
		if (layerMenu) layerMenu.enableEdit();
	},

	disableEdit : function () {
		var layerMenu = Wu.app.MapPane.layerMenu;
		if (layerMenu) layerMenu.disableEdit();
	},


});



 //  ____           _ _   _             
 // |  _ \ ___  ___(_) |_(_) ___  _ __  
 // | |_) / _ \/ __| | __| |/ _ \| '_ \ 
 // |  __/ (_) \__ \ | |_| | (_) | | | |
 // |_|   \___/|___/_|\__|_|\___/|_| |_|

Wu.SidePane.Map.Position = Wu.SidePane.Map.MapSetting.extend({

	type : 'position',



	getPanes : function () {
		this._container 		= Wu.DomUtil.get('editor-map-position-wrap');
		this._outer       	       	= Wu.DomUtil.get('editor-map-initpos-coordinates');
		this._inner 	  	       	= Wu.DomUtil.get('map-initpos-inner');
		this.panes.initPos             	= Wu.DomUtil.get('editor-map-initpos-button');
		this.panes.initPosLatValue     	= Wu.DomUtil.get('editor-map-initpos-lat-value');
		this.panes.initPosLngValue     	= Wu.DomUtil.get('editor-map-initpos-lng-value');
		this.panes.initPosZoomValue    	= Wu.DomUtil.get('editor-map-initpos-zoom-value');
		this.toggled 	               	= false;
	},

	addHooks : function () {

		// call addHooks on prototype
		Wu.SidePane.Map.MapSetting.prototype.addHooks.call(this)

		// add events
		Wu.DomEvent.on( this.panes.initPos,  'click', 		this.setPosition, this );
		Wu.DomEvent.on( this.panes.initPos,  'mousedown',      	this.buttonDown,  this );
		Wu.DomEvent.on( this.panes.initPos,  'mouseup',        	this.buttonUp,    this );
		Wu.DomEvent.on( this.panes.initPos,  'mouseleave',     	this.buttonUp,    this );

	},

	toggleDropdown : function (e) {
		if ( !this.toggled ) {
			this.toggled = true;
			this.open();                           
		} else {
			this.toggled = false;
			this.close();                                        
		}
	},

	setPosition : function (e) {

		console.log('setPosition!');

		// get actual Project object
		var project = app.activeProject;

		console.log('project:::::::: ', project);

		// if no active project, do nothing
		if (!project) return; 

		// get center and zoom
		var center = Wu.app._map.getCenter();
		var zoom   = Wu.app._map.getZoom();

		console.log('cent:ER', center);

		// write directly to Project
		var position = {
			lat  : center.lat,
			lng  : center.lng,
			zoom : zoom
		}
		console.log('position: ', position);
		project.setPosition(position);
	
		// call update on Project
		// this.save();

		// call update on view
		this.update();

	},


	update : function () {

		// call update on prototype
		Wu.SidePane.Map.MapSetting.prototype.update.call(this)

		// update values
		var position = this.project.getLatLngZoom();
		

		this.panes.initPosLatValue.value  = position.lat;
		this.panes.initPosLngValue.value  = position.lng;
		this.panes.initPosZoomValue.value = position.zoom;
	},

	save : function () {
		var that = this;

		// clear timer
		if (this.saveTimer) clearTimeout(this.saveTimer);

		// save on timeout
		this.saveTimer = setTimeout(function () {
			that.project._update('position');
		}, 1000);       // don't save more than every goddamed second

	},


});

 //  ____                        _     
 // | __ )  ___  _   _ _ __   __| |___ 
 // |  _ \ / _ \| | | | '_ \ / _` / __|
 // | |_) | (_) | |_| | | | | (_| \__ \
 // |____/ \___/ \__,_|_| |_|\__,_|___/
                                    

Wu.SidePane.Map.Bounds = Wu.SidePane.Map.MapSetting.extend({

	type : 'bounds',


	getPanes : function () {
		this._container 		= Wu.DomUtil.get('editor-map-bounds-wrap');
		this._outer 	        	= Wu.DomUtil.get('editor-map-bounds-coordinates');
		this._inner 	        	= Wu.DomUtil.get('map-bounds-inner');
		this.panes.clear 		= Wu.DomUtil.get('editor-map-bounds-clear');
		this.panes.bounds             	= Wu.DomUtil.get('editor-map-bounds');
		this.panes.boundsNELatValue   	= Wu.DomUtil.get('editor-map-bounds-NE-lat-value');
		this.panes.boundsNELngValue   	= Wu.DomUtil.get('editor-map-bounds-NE-lng-value');
		this.panes.boundsSWLatValue   	= Wu.DomUtil.get('editor-map-bounds-SW-lat-value');
		this.panes.boundsSWLngValue   	= Wu.DomUtil.get('editor-map-bounds-SW-lng-value');
		this.panes.boundsNE		= Wu.DomUtil.get('editor-map-bounds-NE');
		this.panes.boundsSW		= Wu.DomUtil.get('editor-map-bounds-SW');
		this.panes.minZoom 		= Wu.DomUtil.get('editor-map-bounds-min-zoom-value');
		this.panes.maxZoom 		= Wu.DomUtil.get('editor-map-bounds-max-zoom-value'); 
		this.panes.setMinZoom           = Wu.DomUtil.get('editor-map-bounds-set-minZoom'); 
		this.panes.setMaxZoom           = Wu.DomUtil.get('editor-map-bounds-set-maxZoom'); 
		this.toggled            	= false;
	},

	addHooks : function () {

		// call addHooks on prototype
		Wu.SidePane.Map.MapSetting.prototype.addHooks.call(this)

		// add events
		Wu.DomEvent.on( this.panes.bounds,   'click', this.setBounds,   this );
		Wu.DomEvent.on( this.panes.clear,    'click', this.clearBounds, this );
		Wu.DomEvent.on( this.panes.boundsNE, 'click', this.setBoundsNE, this );
		Wu.DomEvent.on( this.panes.boundsSW, 'click', this.setBoundsSW, this );

		Wu.DomEvent.on( this.panes.setMinZoom, 'click', this.setMinZoom, this );
		Wu.DomEvent.on( this.panes.setMaxZoom, 'click', this.setMaxZoom, this );

		Wu.DomEvent.on( this.panes.bounds,   'mousedown',  this.buttonDown,  this );
		Wu.DomEvent.on( this.panes.bounds,   'mouseup',    this.buttonUp,    this );
		Wu.DomEvent.on( this.panes.bounds,   'mouseleave', this.buttonUp,    this );

	},

	setBounds : function (e) {
		
		// get actual Project object
		var project = app.activeProject;

		// if no active project, do nothing
		if (!project) return; 

		// get map bounds and zoom
		var bounds = Wu.app._map.getBounds();
		var zoom   = Wu.app._map.getZoom();

		// write directly to Project
		project.setBounds({				// refactor:  project.setBounds()
			northEast : {
				lat : bounds._northEast.lat,
				lng : bounds._northEast.lng
			},

			southWest : {
				lat : bounds._southWest.lat,
				lng : bounds._southWest.lng
			},
			minZoom : zoom,
			maxZoom : 18
		});
		
		// call update on view
		this.update();

		// enforce new bounds
		this.enforceBounds();

	},

	setMinZoom : function () {
		var map = app._map;
		var minZoom = map.getZoom();
		var bounds = this.project.getBounds();
		bounds.minZoom = minZoom;

		// set bounds to project
		this.project.setBounds(bounds);
		
		// update view
		this.update();
	},

	setMaxZoom : function () {
		var map = app._map;
		var maxZoom = map.getZoom();
		var bounds = this.project.getBounds();
		bounds.maxZoom = parseInt(maxZoom);

		// set bounds to project
		this.project.setBounds(bounds);
		
		// update view
		this.update();
	},

	enforceBounds : function () {
		
		var project = app.activeProject;
		var map     = app._map;

		// get values
		var bounds = project.getBounds();

		if (bounds) {
			var southWest   = L.latLng(bounds.southWest.lat, bounds.southWest.lng);
	   		var northEast 	= L.latLng(bounds.northEast.lat, bounds.northEast.lng);
	    		var maxBounds 	= L.latLngBounds(southWest, northEast);
			var minZoom 	= bounds.minZoom;
			var maxZoom 	= bounds.maxZoom;

	    		// set bounds
			map.setMaxBounds(maxBounds);

			// set zoom
			map.options.minZoom = minZoom;
			map.options.maxZoom = maxZoom;	
		}
		

		map.invalidateSize();

	},

	clearBounds : function () {
		
		// get actual Project object
		var project = Wu.app.activeProject;
		var map = Wu.app._map;

		// set bounds to project
		project.setBounds({				
			northEast : {
				lat : 90,
				lng : 180
			},

			southWest : {
				lat : -90,
				lng : -180
			},
			minZoom : 1,
			maxZoom : 20
		});

		// call update on view
		this.update();

		// enforce
		this.enforceBounds();

	},

	setBoundsSW : function (e) {

		// get actual Project object
		var project = Wu.app.activeProject;
		var map = Wu.app._map;

		// if no active project, do nothing
		if (!project) return; 

		var bounds = map.getBounds();
		var zoom = map.getZoom();

		// set bounds to project
		project.setBoundsSW({
			lat : bounds._southWest.lat,
			lng : bounds._southWest.lng
		});

		// set zoom to project
		project.setBoundsZoomMin(zoom);

		// call update on view
		this.update();

		// update map
		map.setMaxBounds(bounds);


	},

	setBoundsNE : function (e) {

		// get actual Project object
		var project = app.activeProject;

		// if no active project, do nothing
		if (!project) return; 

		var bounds = app._map.getBounds();

		// set bounds to project
		project.setBoundsNE({ 			
			lat : bounds._northEast.lat,
			lng : bounds._northEast.lng
		});

		// update view
		this.update();

	},

	toggleDropdown : function (e) {
		if ( !this.toggled ) {
			this.toggled = true;
			this.open();                           
		} else {
			this.toggled = false;
			this.close();                                         
		}
	},


	update : function () {

		// call update on prototype
		Wu.SidePane.Map.MapSetting.prototype.update.call(this)

		// bounds
		var bounds = this.project.getBounds();
		if (bounds) {
			this.panes.boundsNELatValue.value = bounds.northEast.lat;
			this.panes.boundsNELngValue.value = bounds.northEast.lng;
			this.panes.boundsSWLatValue.value = bounds.southWest.lat;
			this.panes.boundsSWLngValue.value = bounds.southWest.lng;
			this.panes.maxZoom.value 	  = bounds.maxZoom;
			this.panes.minZoom.value 	  = bounds.minZoom;
		};

		this.enforceBounds();
	},

	save : function () {
		var that = this;

		// clear timer
		if (this.saveTimer) clearTimeout(this.saveTimer);

		// save on timeout
		this.saveTimer = setTimeout(function () {
			that.project._update('bounds');
		}, 1000);       // don't save more than every goddamed second

	},


});






 //   ____            _             _     
 //  / ___|___  _ __ | |_ _ __ ___ | |___ 
 // | |   / _ \| '_ \| __| '__/ _ \| / __|
 // | |__| (_) | | | | |_| | | (_) | \__ \
 //  \____\___/|_| |_|\__|_|  \___/|_|___/
                                       
Wu.SidePane.Map.Controls = Wu.SidePane.Map.MapSetting.extend({

	type : 'controls',


	getPanes : function () {
		this._container 			= Wu.DomUtil.get('editor-map-controls-wrap');
		this._outer 				= Wu.DomUtil.get('editor-map-controls-inner-wrap');
		this.panes.controlZoom                 	= Wu.DomUtil.get('map-controls-zoom').parentNode.parentNode;
		this.panes.controlDraw                 	= Wu.DomUtil.get('map-controls-draw').parentNode.parentNode;
		this.panes.controlInspect              	= Wu.DomUtil.get('map-controls-inspect').parentNode.parentNode;
		this.panes.controlDescription          	= Wu.DomUtil.get('map-controls-description').parentNode.parentNode;
		this.panes.controlLayermenu            	= Wu.DomUtil.get('map-controls-layermenu').parentNode.parentNode;
		this.panes.controlLegends              	= Wu.DomUtil.get('map-controls-legends').parentNode.parentNode;
		this.panes.controlMeasure              	= Wu.DomUtil.get('map-controls-measure').parentNode.parentNode;
		this.panes.controlGeolocation          	= Wu.DomUtil.get('map-controls-geolocation').parentNode.parentNode;
		this.panes.controlVectorstyle          	= Wu.DomUtil.get('map-controls-vectorstyle').parentNode.parentNode;
		this.panes.controlMouseposition        	= Wu.DomUtil.get('map-controls-mouseposition').parentNode.parentNode;
		this.panes.controlBaselayertoggle      	= Wu.DomUtil.get('map-controls-baselayertoggle').parentNode.parentNode;
	},

	addHooks : function () {

		// call addHooks on prototype
		Wu.SidePane.Map.MapSetting.prototype.addHooks.call(this)

		// add events
		Wu.DomEvent.on( this.panes.controlZoom,            'mousedown click', this.toggleControl, this);
		Wu.DomEvent.on( this.panes.controlDraw,            'mousedown click', this.toggleControl, this);
		Wu.DomEvent.on( this.panes.controlInspect,         'mousedown click', this.toggleControl, this);
		Wu.DomEvent.on( this.panes.controlDescription,     'mousedown click', this.toggleControl, this);
		Wu.DomEvent.on( this.panes.controlLayermenu,       'mousedown click', this.toggleControl, this);
		Wu.DomEvent.on( this.panes.controlLegends,         'mousedown click', this.toggleControl, this);
		Wu.DomEvent.on( this.panes.controlMeasure,         'mousedown click', this.toggleControl, this);
		Wu.DomEvent.on( this.panes.controlGeolocation,     'mousedown click', this.toggleControl, this);
		Wu.DomEvent.on( this.panes.controlVectorstyle,     'mousedown click', this.toggleControl, this);
		Wu.DomEvent.on( this.panes.controlMouseposition,   'mousedown click', this.toggleControl, this);
		Wu.DomEvent.on( this.panes.controlBaselayertoggle, 'mousedown click', this.toggleControl, this);

	},

	calculateHeight : function () {
		this.maxHeight = 330;
		this.minHeight = 0;
	},


	toggleControl : function (e) {
		
		// prevent default checkbox behaviour
		if (e.type == 'click') return Wu.DomEvent.stop(e);
		
		// get type (zoom, draw, etc.)
		var item = e.target.getAttribute('which');

		// get checkbox
		var target = Wu.DomUtil.get('map-controls-' + item);

		// do action (eg. toggleControlDraw);
		var on      = !target.checked;
		var enable  = 'enable' + item.camelize();
		var disable = 'disable' + item.camelize();

		var mapPane = app.MapPane;

		// toggle
		if (on) {
			// enable control on map
			mapPane[enable]();

			// enable control in menu
			this.enableControl(item);
		} else {
			// disable control on map
			mapPane[disable]();
			
			// disable control in menu
			this.disableControl(item);
		}

		// save changes to project
		this.project.store.controls[item] = on;	// todo
		this.project._update('controls');		

		// update controls css
		mapPane.updateControlCss();

	},


	disableControl : function (type) {
		
		// get vars
		var target = Wu.DomUtil.get('map-controls-' + type); // checkbox
		var parent = Wu.DomUtil.get('map-controls-title-' + type).parentNode; // div that gets .active 
		var map    = Wu.app._map;  // map

		// toggle check and active class
		Wu.DomUtil.removeClass(parent, 'active');
		target.checked = false;
	},

	enableControl : function (type) {
		
		// get vars
		var target = Wu.DomUtil.get('map-controls-' + type); // checkbox
		var parent = Wu.DomUtil.get('map-controls-title-' + type).parentNode; // div that gets .active 
		var map    = Wu.app._map;  // map

		// toggle check and active class
		Wu.DomUtil.addClass(parent, 'active');
		target.checked = true;
	},

	update : function () {

		// call update on prototype
		Wu.SidePane.Map.MapSetting.prototype.update.call(this)

		// toggle each control
		for (c in this.project.store.controls) {
			var on = this.project.store.controls[c];
			var enable = 'enable' + c.camelize();
			var disable = 'disable' + c.camelize();
			
			// toggle
			if (on) {	
				// enable control on map
				Wu.app.MapPane[enable]();

				// enable control in menu
				this.enableControl(c);
			} else {	
				// disable control on map
				Wu.app.MapPane[disable]();
				
				// disable control in menu
				this.disableControl(c);
			}
		}
	},

});






































































































/*
██████╗  ██████╗  ██████╗██╗   ██╗███╗   ███╗███████╗███╗   ██╗████████╗███████╗
██╔══██╗██╔═══██╗██╔════╝██║   ██║████╗ ████║██╔════╝████╗  ██║╚══██╔══╝██╔════╝
██║  ██║██║   ██║██║     ██║   ██║██╔████╔██║█████╗  ██╔██╗ ██║   ██║   ███████╗
██║  ██║██║   ██║██║     ██║   ██║██║╚██╔╝██║██╔══╝  ██║╚██╗██║   ██║   ╚════██║
██████╔╝╚██████╔╝╚██████╗╚██████╔╝██║ ╚═╝ ██║███████╗██║ ╚████║   ██║   ███████║
╚═════╝  ╚═════╝  ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝
*/
// DocumentsPane
Wu.SidePane.Documents = Wu.SidePane.Item.extend({
	
	type : 'documents',
	title : 'Docs',


	initContent : function () {

		// create new fullscreen page, and set as default content
		this._content = Wu.DomUtil.create('div', 'fullpage-documents ct1', Wu.app._appPane);
		
		// create container (overwrite default)
		this._container = Wu.DomUtil.create('div', 'editor-wrapper ct11', this._content);

		// insert template
		this._container.innerHTML = ich.documentsContainer();

		// get element handlers
		this._leftpane 	 = Wu.DomUtil.get('documents-container-leftpane');
		this._folderpane = Wu.DomUtil.get('documents-folder-list');
		this._rightpane  = Wu.DomUtil.get('documents-container-rightpane');
		this._textarea   = Wu.DomUtil.get('documents-container-textarea');
		this._newfolder  = Wu.DomUtil.get('documents-new-folder');



	},

	initFolders : function () {

		this.folders = {};
		var folders = this.project.store.folders;

		// init local folder object
		folders.forEach(function (folder, i, arr) {
			this.folders[folder.uuid] = folder;
		}, this);

	},

	addHooks : function () {

	},

	addEditHooks : function () {
		console.log('adding addEditHooks for DOCS');

		// new folder
		Wu.DomEvent.on(this._newfolder, 'mousedown', this.newFolder, this);

		// add grande.js
		this.addGrande();
		
		// show (+)
		Wu.DomUtil.removeClass(this._newfolder, 'displayNone');


	},

	addGrande : function () {
		// get textarea nodes for grande
		var nodes = this._textarea;

		// get sources
		var files = this.project.getFiles();
		var sources = this.project.getGrandeFiles(files);
		var images = this.project.getGrandeImages(files)

		// set grande options
		var options = {
			plugins : {

		        	// file attachments
			        attachments : new G.Attachments(sources, {
			        	icon : 'fileAttachment.png',
			        }),

			        // image attachments
			        images :  new G.Attachments(sources, {
			        	icon : 'imageAttachment.png',
			        	embedImage : true 			// embed image in text! 
			        }),

			},
			events : {

				// add change event listener
				change : this.textChange
			}
		}

		// create Grande with attachment and image plugin
		this.grande = G.rande(nodes, options);

	},

	removeGrande : function () {


	},
	

	textChange : function () {
		console.log('textChange');
	},

	removeEditHooks : function () {
		console.log('removeEditHooks doc');
		
		// new folder
		Wu.DomEvent.off(this._newfolder, 'mousedown', this.newFolder, this);

		// bind grande.js text editor
		// Grande.unbind([this._textarea]);

		// hide (+)
		Wu.DomUtil.addClass(this._newfolder, 'displayNone');

	},


	
	 
	_activate : function (e) {                

		// set top
		this.adjustTop();

		// turn off header resizing and icon
		Wu.app.HeaderPane.disableResize();

		// select first title (create fake e object)
		var folders = this.project.store.folders;
		if (folders.length > 0) {
			var uuid = folders[0].uuid;
			this.selectFolder(uuid);
		};
	
		// if editMode
		if (this.project.editMode) {

			// add shift key hook
			this.enableShift();

			//  hide/show (+) button
			this.addEditHooks();
		}

	},

	_deactivate : function () {

		// turn off header resizing
		Wu.app.HeaderPane.enableResize();

		// remove shift key edit hook
		this.disableShift();

		// remove edit hooks 
		this.removeEditHooks();
	},


	enableShift : function () {
		// add shift key edit hook
		Wu.DomEvent.on(window, 'keydown', this.shiftMode, this);
		Wu.DomEvent.on(window, 'keyup', this.unshiftMode, this);
	},

	disableShift : function () {
		// remove shift key edit hook
		Wu.DomEvent.off(window, 'keydown', this.shiftMode, this);
		Wu.DomEvent.off(window, 'keyup', this.unshiftMode, this);
	},

	shiftMode : function (e) {
		var evt = e || window.event;
		if (evt.which != 16) return;    // shift key
	       
		// show delete buttons
		for (b in this._deleteButtons) {
			var btn = this._deleteButtons[b];
			btn.style.visibility = 'visible';
		}
	},

	unshiftMode : function (e) {
		var evt = e || window.event;
		if (evt.which != 16) return;    // shift key
		
		// hide delete buttons
		for (b in this._deleteButtons) {
			var btn = this._deleteButtons[b];
			btn.style.visibility = 'hidden';
		}
	},

	
	adjustTop : function () {
		// debug, for innfelt header
		return;
		// make room for project header
		var project = Wu.app.activeProject;
		if (project) {
			this._content.style.top = project.store.header.height + 'px';
		}

		// adjust top of left pane
		this._leftpane.style.top = '-' + project.store.header.height + 'px';
	},

       

	update : function () {

		// use active project
		this.project = app.activeProject;

		// flush
		this.reset();

		// set folders
		this.createFolders();

		// editMode: hide/show (+) button
		if (this.project.editMode) {
			Wu.DomUtil.removeClass(this._newfolder, 'displayNone');
			console.log('ADDDDDD____');
			// this.addEditHooks();
		} else {
			Wu.DomUtil.addClass(this._newfolder, 'displayNone');
			// this.removeEditHooks();
			console.log("REMMMM___");
		}

	},

	updateContent : function () {  

		// reset text pane
		this._textarea.innerHTML = '';

		// update         
		this.update();
	},

	newFolder : function () {

		var folder = {
			'title'   : 'Title',
			'uuid'    : Wu.Util.guid('folder'),
			'content' : 'Text content'
		}

		// update 
		this.project.store.folders.push(folder);

		// refresh
		this.update();

	},

	createFolders : function () {

		// set folders
		var folders = this.project.store.folders;


		if (!folders) return;

		// delete buttons object
		this._deleteButtons = {};

		// create each folder headline
		folders.forEach(function (elem, i, arr) {

			// if editMode
			if (this.project.editMode) {
				// delete button
				var btn = Wu.DomUtil.create('div', 'documents-folder-delete', this._folderpane, 'x');
				// btn.innerHTML = 'x';
				Wu.DomEvent.on(btn, 'click', function (e) { this.deleteFolder(elem.uuid); }, this);
				this._deleteButtons[elem.uuid] = btn;
			}

			// folder item
			var folder = elem;
			folder.el = Wu.DomUtil.create('div', 'documents-folder-item ct23 ct28', this._folderpane);
			folder.el.innerHTML = folder.title;
		       
			// set hooks
			Wu.DomEvent.on( folder.el,  'mousedown', function (e) {
				this.selectFolder(folder.uuid);
			}, this );     // select folder
			
			// if editMode
			if (this.project.editMode) {
				Wu.DomEvent.on( folder.el,  'dblclick', function (e) {
					this._renameFolder(e, folder.uuid);
				}, this );      // rename folder
			}

			// update object
			this.folders[folder.uuid] = folder;

		}, this);
	       
	},

	deleteFolder : function (uuid) {
		if (confirm('Are you sure you want to delete folder ' + this.folders[uuid].title + '?')) {
			console.log('delete folder: ', uuid);
			delete this.folders[uuid];
			this.save();
		}
	},

	_renameFolder : function (e, uuid) {

		this._editing = true;

		// remove shift key edit hook
		this.disableShift();

		// set values 
		var div   = e.target;
		var value = e.target.innerHTML;
		var input = ich.injectFolderTitleInput({ value : value });
		
		// inject <input>
		div.innerHTML = input;

		// focus
		var target = div.firstChild;
		target.focus();
		target.selectionStart = target.selectionEnd;	// prevents text selection

		// save on blur or enter
		Wu.DomEvent.on( target,  'blur', function (e) { 
			this._titleBlur(e, uuid); 
		}, this );     // save folder title
		Wu.DomEvent.on( target,  'keydown', function (e) { 
			this._titleKey(e, uuid); 
		}, this );     // save folder title

	},

	_titleKey : function (e, uuid) {
		// blur on enter
		if (event.which == 13 || event.keyCode == 13) this._titleBlur(e, uuid);
	},

	_titleBlur : function (e, uuid) {
		if (!this._editing) return;
		this._editing = false;

		// get value
		var value = e.target.value;

		// revert to <div>
		var div = e.target.parentNode;
		div.innerHTML = value;

		// update value
		this.folders[uuid].title = value;                                                                                                                                                                                    

		// save
		this.save();

		// add shift key edit hook
		this.enableShift();

	},


	selectFolder : function (uuid) {

		// get folder
		var folder = this.folders[uuid];

		// clear rightpane
		this._textarea.innerHTML = '';
		this._textarea.innerHTML = folder.content;
		this._textarea.fuuid 	 = uuid;
		
		// blur textarea
		this._textarea.blur();

		// underline title
		this.underline(uuid);

		// set hooks
		Wu.DomEvent.on(this._textarea, 'keydown mousedown', this.autosave, this ); // auto-save

	},

	underline : function (uuid) {
		for (f in this.folders) {
			var el = this.folders[f].el;
			var id = this.folders[f].uuid;

			// underline selected title
			if (uuid == id) { Wu.DomUtil.addClass(el, 'underline'); } 
			else { Wu.DomUtil.removeClass(el, 'underline'); }	
		}
	},
	
	autosave : function () {
		var that = this;
		clearTimeout(this._saving);

		// save after 500ms of inactivity
		this._saving = setTimeout(function () {
			that.saveText();
		}, 500);

	},

	saveText : function () {
		var f = this.folders[this._textarea.fuuid].content;
		var text = this._textarea.innerHTML;

		// return if no changes
		if (f == text) return; 
		
		// update folder object 
		this.folders[this._textarea.fuuid].content = text;
		
		// save
		this.save();
	},

	// save to server
	save : function () {
		var folders = this.folders;
		
		// convert to array
		this.project.store.folders = [];
		for (f in folders) {
			var fo = Wu.extend({}, folders[f]);     // clone 
			delete fo.el;                           // delete .el on clone only
			this.project.store.folders.push(fo);    // push to storage
		}

		// save project to server
		this.project._update('folders');

		// refresh
		this.update();
	},

      

	reset : function () {

		// reset left pane
		this._folderpane.innerHTML = '';

		// reset object
		this.folders = {};
	}

});




















































































































/*
██╗   ██╗███████╗███████╗██████╗ ███████╗
██║   ██║██╔════╝██╔════╝██╔══██╗██╔════╝
██║   ██║███████╗█████╗  ██████╔╝███████╗
██║   ██║╚════██║██╔══╝  ██╔══██╗╚════██║	// todo: not update every time pane is activated. no longer necessary.
╚██████╔╝███████║███████╗██║  ██║███████║
 ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝╚══════╝
*/
Wu.SidePane.Users = Wu.SidePane.Item.extend({

	type : 'users',
	title : 'Users',

	initContent : function () {

		// create new fullscreen page, and set as default content
		this._content = Wu.DomUtil.create('div', 'fullpage-users', Wu.app._appPane);
		
		// create container (overwrite default) and insert template
		this._container = Wu.DomUtil.create('div', 'editor-wrapper', this._content, ich.usersPane());

		// get handles
		this._tableContainer = Wu.DomUtil.get('users-table-container');

		// render empty table
		this._tableContainer.innerHTML = ich.usersTableFrame();

		// get more handles
		this._table 	    = Wu.DomUtil.get('users-insertrows');
		this._addUser       = Wu.DomUtil.get('users-add-user');
		this._mainTitle     = Wu.DomUtil.get('user-management-client');
		this._deleteUser    = Wu.DomUtil.get('users-delete-user');
		this._checkall      = Wu.DomUtil.get('users-checkbox-all');
		this._checkallLabel = Wu.DomUtil.get('label-users-checkbox-all');

		// init table
		this.initList();

	},

	addHook : function () {
		this.addEditHooks();
	},

	addEditHooks : function () {
		
		// add button
		Wu.DomEvent.on(this._addUser, 'mousedown', this.inputUser, this);

		// delete button
		Wu.DomEvent.on(this._deleteUser, 'mousedown', this.deleteUser, this);

		// check all button
		Wu.DomEvent.on(this._checkallLabel, 'mousedown', this.checkAll, this);

		// show edit buttons
		Wu.DomUtil.removeClass(this._addUser, 'displayNone');
		Wu.DomUtil.removeClass(this._deleteUser, 'displayNone');
		Wu.DomUtil.removeClass(this._addUser, 'displayNone');
	       
	},

	removeEditHooks : function () {
		
		// add button
		Wu.DomEvent.off(this._addUser, 'mousedown', this.inputUser, this);

		// delete button
		Wu.DomEvent.off(this._deleteUser, 'mousedown', this.deleteUser, this);

		// check all button
		Wu.DomEvent.off(this._checkallLabel, 'mousedown', this.checkAll, this);

		// hide edit buttons
		Wu.DomUtil.addClass(this._addUser, 'displayNone');
		Wu.DomUtil.addClass(this._deleteUser, 'displayNone');
		Wu.DomUtil.addClass(this._addUser, 'displayNone');
	      
	},

	// fired when different sidepane selected, for clean-up
	_deactivate : function () {

	},

	// list.js plugin
	initList : function () { 
		
		// add dummy entry
		var tr = Wu.DomUtil.createId('tr', 'dummy-table-entry');
		tr.innerHTML = ich.usersTablerow({'type' : 'dummy-table-entry'});
		this._table.appendChild(tr);

		// init list.js
		var options = { valueNames : ['name', 'company', 'position', 'phone', 'email', 'access'] };
		this.list = new List('userslist', options);

		// remove dummy
		this.list.clear();
	},


	updateContent : function () {
		this.update();
	},

	update : function () {

		// flush
		this.reset();

		// refresh table entries
		this.refreshTable();

		// add edit hooks
		this.addEditHooks();
	
	},


	
	// input fullscreen for new user details
	inputUser : function () {

		this._inputUser  = {};
		var titleText    = 'Create new user';
		var subtitleText = 'Enter details for the new user:';
		var messageText  = 'Password is auto-generated. The user will receive login details on email.';
		var container  = this._inputUser._container = Wu.DomUtil.create('div',   'backpane-container', this._content);
		var wrapper    = this._inputUser._wrapper   = Wu.DomUtil.create('div',   'backpane-wrapper',   container);
		var title      = this._inputUser._title     = Wu.DomUtil.create('div',   'backpane-title',     wrapper, titleText);
		var subtitle   = this._inputUser._subtitle  = Wu.DomUtil.create('div',   'backpane-subtitle',  wrapper, subtitleText);		
		var firstName  = this._inputUser._firstName = Wu.DomUtil.create('input', 'backpane-input',     wrapper, 'First Name');
		var lastName   = this._inputUser._lastName  = Wu.DomUtil.create('input', 'backpane-input',     wrapper, 'Last name');
		var email      = this._inputUser._email     = Wu.DomUtil.create('input', 'backpane-input',     wrapper, 'Email');
		var email2     = this._inputUser._email2    = Wu.DomUtil.create('input', 'backpane-input',     wrapper, 'Confirm Email');
		var message    = this._inputUser._message   = Wu.DomUtil.create('div',   'backpane-message',   wrapper, messageText);
		var cancel     = this._inputUser._cancel    = Wu.DomUtil.create('div',   'backpane-cancel smap-button-gray',    wrapper, 'Cancel');
		var confirm    = this._inputUser._confirm   = Wu.DomUtil.create('div',   'backpane-confirm smap-button-gray',   wrapper, 'Confirm');

		Wu.DomEvent.on(email,   'keyup',     this.checkUniqueEmail, this);
		Wu.DomEvent.on(email2,  'keyup',     this.checkSameEmail,   this);
		Wu.DomEvent.on(cancel,  'mousedown', this.cancelInput,      this);
		Wu.DomEvent.on(confirm, 'mousedown', this.confirmInput,     this);
	},

	checkUniqueEmail : function (e) {
		// clear
		clearTimeout(this._checkUniqeEmailTimer);
		
		// check
		var context = this;
		this._checkUniqeEmailTimer = setTimeout(function() {
			var email = context._inputUser._email.value;
			var json = JSON.stringify({ 
				email : email
			});
			// post              path          data           callback        context of cb
			Wu.Util.postcb('/api/user/unique', json, context.checkedUniqueEmail, context);
		}, 250);         
	},

	checkedUniqueEmail : function (context, data) {
		var email = JSON.parse(data);
		var div   = context._inputUser._email;
		
		// mark valid
		if (email.unique) {
			Wu.DomUtil.addClass(div, 'valid');
			Wu.DomUtil.removeClass(div, 'invalid');
			context._inputUser.validEmail = true;
		} else {
			Wu.DomUtil.addClass(div, 'invalid');	
			Wu.DomUtil.removeClass(div, 'valid');		
			context._inputUser.validEmail = false;
		}
	},


	checkSameEmail : function (e) {
		var email1 = this._inputUser._email;
		var email2 = this._inputUser._email2;

		// mark valid
		if (email1.value == email2.value) {
			Wu.DomUtil.addClass(email2, 'valid');
			Wu.DomUtil.removeClass(email2, 'invalid');
			this._inputUser.validEmail2 = true;
		} else {
			Wu.DomUtil.addClass(email2, 'invalid');
			Wu.DomUtil.removeClass(email2, 'valid');
			this._inputUser.validEmail2 = false;
		}
	},

	cancelInput : function (e) {
		Wu.DomUtil.remove(this._inputUser._container);
	},

	confirmInput : function () {

		var firstName = this._inputUser._firstName.value;
		var lastName  = this._inputUser._lastName.value;
		var email     = this._inputUser._email.value;

		if (!firstName) return;
		if (!lastName) return;
		if (!email) return;
		if (!(this._inputUser.validEmail2 && this._inputUser.validEmail)) return;

		var input = {
			lastName  : lastName,
			firstName : firstName,
			email     : email
		}

		// create user
		this.createUser(input);
	
		// close backpane
		this.cancelInput();
	},


	// send new user request to server
	createUser : function (input) {
		var data = JSON.stringify(input);
		if (!data) return;

		// get new user from server
		Wu.post('/api/user/new', data, this.createdUser, this);

	},

	// reply from server
	createdUser : function (context, json) {
		console.log('createdUser: ', context, json);

		var store = JSON.parse(json);
		var user = new Wu.User(store);
		user.attachToApp();
		context.addTableItem(user); 	// todo: add user to top
	},



	deleteUser : function () {

		var checked = this.getSelected();

		// prevent seppuku
		var authUser = Wu.app.Account.store.uuid;
		var seppuku = false;
		checked.forEach(function (check) {
			if (check.uuid == authUser) seppuku = true;
		});
		if (seppuku) return console.error('Can\'t delete yourself.')
		

		// delete each selected user
		checked.forEach(function (user){
			// confirm delete
			var name = user.store.firstName + ' ' + user.store.lastName;
			if (confirm('Are you sure you want to delete user ' + name + '?')) {
				if (confirm('Are you REALLY SURE you want to delete user ' + name + '?')) {
					this.confirmDelete(user);
				}			
			}	
		}, this);
		
	},

	confirmDelete : function (user) {
		// delete user      cb
		user.deleteUser(this, 'deletedUser');
	},

	deletedUser : function (context) {
		// refresh
		context.reset();
		context.refreshTable();
	},

	
	checkAll : function () {
		console.log('checkAll');
	},

	getSelected : function () {

		// get selected files
		var checks = [];
		for (u in this.users) {
			var user = this.users[u];
			var checkbox = Wu.DomUtil.get('users-checkbox-' + user.store.uuid);
			if (checkbox) var checked = checkbox.checked; 
			if (checked) checks.push(user); 
		};
		return checks;
	},

	
	

	refreshTable : function () {
		
		this.users = app.Users;

		for (u in this.users) {
			var user = this.users[u];
			this.addTableItem(user);
		}
		
		// sort list by name by default
		this.list.sort('name', {order : 'asc'});

	},

	

	reset : function () {
		// clear table
		this.list.clear();
	},

	addTableItem : function (user) {

		// prepare template values
		var template = {};   
		template.name = ich.usersTablerowName({
			firstName     : user.getFirstName() || 'First name',
			lastName      : user.getLastName()  || 'Last name',
			lastNameUuid  : 'lastName-'  + user.getUuid(),
			firstNameUuid : 'firstName-' + user.getUuid(),
		});     
		template.email    = user.getEmail();
		template.position = user.getPosition();
		template.company  = user.getCompany();
		template.mobile   = user.getMobile();
		template.phone    = user.getPhone();
		template.access   = this.getAccessTemplate(user);
			       
		// add users to list.js, and add to DOM
		var ret = this.list.add(template);

		// hack: manually add id's for event triggering                 TODO refactor, ich.
		// for whole table
		var nodes = ret[0].elm.children;
		for (var i = 0; i < nodes.length; i++) {
			var node = nodes[i];

			// main checkbox, label
			if (i == 0) {
				node.children[0].children[0].id = 'users-checkbox-' + user.getUuid();
				node.children[0].children[1].setAttribute('for', 'users-checkbox-' + user.getUuid());
			}

			// other divs
			if (!node.id == '') {
				node.id = node.id + user.getUuid();
				node.setAttribute('uuid', user.getUuid());
			}
		};
	
		// add edit hooks
		this.setEditHooks(user.getUuid());

	},

	getAccessTemplate : function (user) {
		// get no of projets etc for user
		var projects = user.getProjects();
		return projects.length + ' project(s)';
	},

	getProjectsTemplate : function (user) {
		var template = '';

		// all projects	for superusers
		if (user.isSuperuser()) {	
			for (p in app.Projects) {
				var project = app.Projects[p];
				if (!project) return;
				content = {
					name 		: project.store.name,
					description 	: project.store.description,
					uuid 		: project.store.uuid
				}
				template += ich.usersTableProjectItem(content);
			}
			return template;
		}
		
		// otherwise projects that user read/update/manage
		var projects = user.getProjects();
		if (!projects || projects.length == 0) return template;
		projects.forEach(function (uuid) {
			var project = app.Projects[uuid];
			if (!project) return;
			content = {
				name 		: project.store.name,
				description 	: project.store.description,
				uuid 		: project.store.uuid
			}
			template += ich.usersTableProjectItem(content);
		}, this);
		return template;
	},



	checkEscape : function (e) {
		if (e.keyCode == 27) this._popupCancel(); // esc key
	},



	setEditHooks : function (uuid, onoff) {

		var onoff = onoff || 'on';

		// get <input>'s
		var lastName    = Wu.DomUtil.get('lastName-' + uuid);
		var firstName   = Wu.DomUtil.get('firstName-' + uuid);
		var company     = Wu.DomUtil.get('company-' + uuid);
		var position    = Wu.DomUtil.get('position-' + uuid);
		var phone       = Wu.DomUtil.get('phone-' + uuid);
		var email       = Wu.DomUtil.get('email-' + uuid);
		var access      = Wu.DomUtil.get('access-' + uuid);

		// set click hooks on title and description
		Wu.DomEvent
			[onoff]( lastName,       'mousedown mouseup click',     this.stop,      this ) 
			[onoff]( lastName,       'dblclick',                    this.rename,    this )     
			[onoff]( firstName,      'mousedown mouseup click',     this.stop,      this ) 
			[onoff]( firstName,      'dblclick',                    this.rename,    this )     
			[onoff]( company,        'mousedown mouseup click',     this.stop,      this ) 
			[onoff]( company,        'dblclick',                    this._rename,   this )     
			[onoff]( position,       'mousedown mouseup click',     this.stop,      this ) 
			[onoff]( position,       'dblclick',                    this._rename,   this )     
			[onoff]( phone,          'mousedown mouseup click',     this.stop,      this ) 
			[onoff]( phone,          'dblclick',                    this._rename,   this )     
			[onoff]( email,          'mousedown mouseup click',     this.stop,      this ) 
			// [onoff]( email,          'dblclick',                    this._rename,   this )     
			[onoff]( access,         'click',                    function () { this.editAccess(uuid); }, this )     

	},

	editAccess : function (uuid) {
		var user = app.Users[uuid];

		// open backpane
		this.manageAccess(user);
	},


	// fullscreen input for new user details
	manageAccess : function (user) {

		var titleText    = 'Manage access for ' + user.getName();
		var subtitleText = 'Manage read, write and manage access for this user.';
		var messageText  = '<h4>Guide:</h4>Managers can add READ access to projects they are managers for.';
		messageText     += '<br>Admins can add READ, WRITE and MANAGE access to projects they have created themselves.'
		var saClass      = user.isSuperadmin() ? 'green' : 'red';
		var aClass       = user.isAdmin() ? 'green' : 'red';

		var projects     = '';

		this._inputAccess = {};
		var container  = this._inputAccess._container     = Wu.DomUtil.create('div', 'backpane-access-container', this._content);
		var wrapper    = this._inputAccess._wrapper       = Wu.DomUtil.create('div', 'backpane-access-wrapper',   container);
		var title      = this._inputAccess._title         = Wu.DomUtil.create('div', 'backpane-title',     	  wrapper, titleText);
		var subtitle   = this._inputAccess._subtitle  	  = Wu.DomUtil.create('div', 'backpane-subtitle',  	  wrapper, subtitleText);		
		
		// admin boxes to display super/admin status
		var superadmin = this._inputAccess._superadmin    = Wu.DomUtil.create('div', 'backpane-superadmin-box ' + saClass, wrapper, 'Superadmin');
		var admin      = this._inputAccess._admin         = Wu.DomUtil.create('div', 'backpane-admin-box ' + aClass, wrapper, 'Admin');

		var subtitle2  = this._inputAccess._projectTitle  = Wu.DomUtil.create('div', 'backpane-projectTitle', 	  wrapper, 'Projects:');	
		var projectsWrap = this._inputAccess._projectsWrap = this.insertProjectWrap(user);	
		var confirm    = this._inputAccess._confirm   = Wu.DomUtil.create('div', 'backpane-confirm smap-button-gray',   wrapper, 'Done');
		var message    = this._inputAccess._message   = Wu.DomUtil.create('div', 'backpane-message',   wrapper, messageText);

		Wu.DomEvent.on(confirm, 'mousedown', this.closeManageAccess,     this);
	},

	closeManageAccess : function () {
		Wu.DomUtil.remove(this._inputAccess._container);

		// update table

	},

	insertProjectWrap : function (user) {

		// create wrapper
		var wrapper = Wu.DomUtil.create('div', 'backpane-projects-wrap', this._inputAccess._wrapper);

		// array of projects
		var projects = this._getProjectAccessSchema();
		if (projects.length == 0) return;

		// edit/manage delegation only for admins
		var managerPriv = app.Account.isAdmin() || app.Account.isSuperadmin(); // only super/admins allowed to delegate MANAGER
		var editorPriv = app.Account.isSuperadmin(); // only superadmins allowed to delegate EDITOR

		// add projects
		projects.forEach(function (project) {
			if (!project) return;

			var readClass   = (user.canReadProject(project.getUuid()))   ? 'gotAccess' : '';
			var editClass   = (user.canUpdateProject(project.getUuid())) ? 'gotAccess' : '';
			var manageClass = (user.canManageProject(project.getUuid())) ? 'gotAccess' : '';
			var titleText = project.getName() + ' (' + project.getClient().getName() + ')';

			var wrap    = Wu.DomUtil.create('div', 'access-projects-wrap', 			wrapper);
			var details = Wu.DomUtil.create('div', 'access-projects-details-wrap', 		wrap);
			var title   = Wu.DomUtil.create('div', 'access-projects-title', 		details, 	titleText);
			var desc    = Wu.DomUtil.create('div', 'access-projects-description', 		details, 	project.getDescription());
			var read    = Wu.DomUtil.create('div', 'access-projects-read ' + readClass, 	wrap, 		'Read');
			var edit, manage;

			if (editorPriv)    edit = Wu.DomUtil.create('div', 'access-projects-write ' + editClass, 	wrap, 		'Edit');
			if (managerPriv) manage = Wu.DomUtil.create('div', 'access-projects-manage ' + manageClass, wrap, 	'Manage');
			

			var item = {
				user    : user,
				project : project,
				read    : read,
				edit    : edit,
				manage  : manage
			}

			Wu.DomEvent.on(read, 'mousedown', function () { this.toggleReadAccess(item)}, this);
			if (editorPriv) Wu.DomEvent.on(edit,    'mousedown', function () { this.toggleUpdateAccess(item)}, this);
			if (managerPriv) Wu.DomEvent.on(manage, 'mousedown', function () { this.toggleManageAccess(item)}, this);

		}, this)

		return wrapper;
	},

	toggleReadAccess : function (item) {
		console.log('toggle READ: ', item);
		var user = item.user;

		// get current state
		var state = (user.store.role.reader.projects.indexOf(item.project.getUuid())  >= 0) ? true : false;

		if (state) {
			// remove read access
			user.removeReadProject(item.project);
			Wu.DomUtil.removeClass(item.read, 'gotAccess');

		} else {
			// add read access
			user.addReadProject(item.project);
			Wu.DomUtil.addClass(item.read, 'gotAccess');
		}

	},


	toggleUpdateAccess : function (item) {
		console.log('toggle: ', item);
		var user = item.user;

		// get current state
		var state = (user.store.role.editor.projects.indexOf(item.project.getUuid())  >= 0) ? true : false;

		if (state) {
			// remove read access
			user.removeUpdateProject(item.project);
			Wu.DomUtil.removeClass(item.edit, 'gotAccess');

		} else {
			// add read access
			user.addUpdateProject(item.project);
			Wu.DomUtil.addClass(item.edit, 'gotAccess');

			// add read access too
			if (!user.canReadProject(item.project.getUuid())) {
				Wu.DomUtil.addClass(item.read, 'gotAccess');
				setTimeout(function () { user.addReadProject(item.project); }, 300);
			}

		}

	},

	toggleManageAccess : function (item) {
		console.log('toggle: ', item);
		var user = item.user;

		// get current state
		var state = (user.store.role.manager.projects.indexOf(item.project.getUuid())  >= 0) ? true : false;

		if (state) {
			// remove read access
			user.removeManageProject(item.project);
			Wu.DomUtil.removeClass(item.manage, 'gotAccess');

		} else {
			// add manage access
			user.addManageProject(item.project);
			Wu.DomUtil.addClass(item.manage, 'gotAccess');

			// add read access too
			if (!user.canReadProject(item.project.getUuid())) {
				Wu.DomUtil.addClass(item.read, 'gotAccess');
				setTimeout(function () { user.addReadProject(item.project); }, 300);
			}

		}

	},

	_getProjectAccessSchema : function () {

		// get all projects for superusers
		// if (app.Account.isSuperadmin()) {
		// 	return _.toArray(app.Projects);
		// }

		// // manager: get projects user is manager for
		// var readerProjects = [];
		// app.Account.store.role.reader.projects.forEach(function (project) {
		// 	readerProjects.push(app.Projects[project]);
		// }, this);
		// return _.toArray(readerProjects);

		// todo: other users

		// manager: get projects user is manager for
		var managerProjects = [];
		app.Account.store.role.manager.projects.forEach(function (project) {
			managerProjects.push(app.Projects[project]);
		}, this);
		return _.toArray(managerProjects);


	},


	// to prevent selected text
	stop : function (e) {
		e.preventDefault();
		e.stopPropagation();
	},

	

	rename : function (e) {

		// enable editing on input box
		e.target.removeAttribute('readonly'); 
		e.target.focus();
		e.target.selectionStart = e.target.selectionEnd;

		// set key
		e.target.fieldKey = e.target.id.split('-')[0];

		// save on blur or enter
		Wu.DomEvent.on( e.target, 'blur',    this.editBlur, this );
		Wu.DomEvent.on( e.target, 'keydown', this.editKey,  this );

	},

	editKey : function (e) {
		// blur on enter
		if (event.which == 13 || event.keyCode == 13) e.target.blur();
	},

	editBlur : function (e) {

		// get key
		var key = e.target.fieldKey;

		// set back to readonly
		e.target.setAttribute('readonly', 'readonly');                                                                                                                                                                                         
		
		// get user uuid
		var userUuid = e.target.id.replace(key + '-', '');

		// get new title
		var value = e.target.value || e.target.innerHTML;

		// save to server
		this.save(key, value, userUuid);

	},



	// rename a div, ie. inject <input>
	_rename : function (e) {
		
		var div   = e.target;
		var value = e.target.innerHTML;
		var key   = e.target.getAttribute('key');
		var uuid  = e.target.getAttribute('uuid');

		var input = ich.injectInput({ 
			value : value, 
			key   : key , 
			uuid  : uuid 
		});
		
		// inject <input>
		div.innerHTML = input;

		var target = div.firstChild;

		// enable editing on input box
		//e.target.removeAttribute('readonly'); 
		target.focus();
		target.selectionStart = target.selectionEnd;

		// save on blur or enter
		Wu.DomEvent.on( target,  'blur', this._editBlur, this );     // save folder title
		Wu.DomEvent.on( target,  'keydown', this._editKey, this );     // save folder title

	},

	_editKey : function (e) {
		// blur on enter
		if (event.which == 13 || event.keyCode == 13) e.target.blur();
	},

	_editBlur : function (e) {

		// get value
		var value = e.target.value;
		var key   = e.target.getAttribute('key');
		var user  = e.target.getAttribute('uuid');

		// revert to <div>
		var div = e.target.parentNode;
		div.innerHTML = value;

		//refresh list
		this.list.update();

		// save to server
		this.save(key, value, user);

	},

	save : function (key, value, userUuid) {
		var user = app.Users[userUuid];
		user.setKey(key, value);
	},

	// _closePane : function () {
	// 	console.log('_closePane Users: ');		// refactor, create local _closePane for clean-up on SidePane.item
	// 	this.closeManageAccess();
	// }

});


















































































































/*
██████╗  █████╗ ████████╗ █████╗     ██╗     ██╗██████╗ ██████╗  █████╗ ██████╗ ██╗   ██╗
██╔══██╗██╔══██╗╚══██╔══╝██╔══██╗    ██║     ██║██╔══██╗██╔══██╗██╔══██╗██╔══██╗╚██╗ ██╔╝
██║  ██║███████║   ██║   ███████║    ██║     ██║██████╔╝██████╔╝███████║██████╔╝ ╚████╔╝ 
██║  ██║██╔══██║   ██║   ██╔══██║    ██║     ██║██╔══██╗██╔══██╗██╔══██║██╔══██╗  ╚██╔╝  
██████╔╝██║  ██║   ██║   ██║  ██║    ███████╗██║██████╔╝██║  ██║██║  ██║██║  ██║   ██║   
╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝    ╚══════╝╚═╝╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   
*/
Wu.SidePane.DataLibrary = Wu.SidePane.Item.extend({

	type : 'dataLibrary',
	title : 'Data',

	initContent : function () {

		// create new fullscreen page, and set as default content
		this._content = Wu.DomUtil.create('div', 'data-library ct1', Wu.app._appPane);
		
		// create container (overwrite default)
		this._container = Wu.DomUtil.create('div', 'editor-wrapper ct1', this._content);

		// create progress bar
		this.progress = Wu.DomUtil.create('div', 'progress-bar', this._content);
		
		// insert template
		this._container.innerHTML = ich.datalibraryContainer();

		// get element handlers
		this._tableContainer = Wu.DomUtil.get('datalibrary-table-container');
	      
		// create fullscreen dropzone
		this.fulldrop = Wu.DomUtil.create('div', 'fullscreen-drop', this._content);

		// filecount
		this.filecount = 0;



		// render empty table
		this._tableContainer.innerHTML = ich.datalibraryTableframe();

		// get elements
		this._table 		= Wu.DomUtil.get('datalibrary-insertrows');
		this._errors 		= Wu.DomUtil.get('datalibrary-errors');
		this._uploader 		= Wu.DomUtil.get('upload-container');
		this._deleter 		= Wu.DomUtil.get('datalibrary-delete-file');
		this._downloader 	= Wu.DomUtil.get('datalibrary-download-files');
		this._downloadList 	= Wu.DomUtil.get('datalibrary-download-dialogue');
		this._checkall 		= Wu.DomUtil.get('checkbox-all');
		this._checkallLabel 	= Wu.DomUtil.get('label-checkbox-all');

		// init table
		this.initList();

		// init dropzone
		this.initDZ();

		// init download table
		this.initDownloadTable();

	},

	// hooks added automatically on page load
	addHooks : function () {
	       
		// download button
		Wu.DomEvent.on(this._downloader, 'mousedown', this.downloadConfirm, this);

		// check all button
		Wu.DomEvent.on(this._checkallLabel, 'mousedown', this.checkAll, this);
	       
	},


	addEditHooks : function () {

		// delete button
		Wu.DomEvent.on(this._deleter, 'mousedown', this.deleteConfirm, this);
		Wu.DomUtil.removeClass(this._deleter, 'displayNone');

	},

	removeEditHooks : function () {

		// delete button
		Wu.DomEvent.off(this._deleter, 'mousedown', this.deleteConfirm, this);
		Wu.DomUtil.addClass(this._deleter, 'displayNone');


	},

	_activate : function () {

		if (this.dz) this.dz.enable();

	},

	_deactivate : function () {
		console.log('deactive sidepane datalib');
		this.dz.disable();
		this.disableFullscreenDZ();
	},

	initDownloadTable : function () {

		var table = ich.datalibraryTableDownload();
		this._downloadList.innerHTML = table;

		// get elems 
		this._downloadOK = Wu.DomUtil.get('download-ok-button');
		this._downloadCancel = Wu.DomUtil.get('download-cancel-button');
	
		// set hooks
		Wu.DomEvent.on(this._downloadOK, 'mousedown', this.downloadFiles, this);
		Wu.DomEvent.on(this._downloadCancel, 'mousedown', this.downloadCancel, this);

	},

	checkAll : function () {

		if (this._checkall.checked) {
			// uncheck all visible
			var visible = this.list.visibleItems;
			visible.forEach(function (item, i, arr) {
				var ch = item.elm.children[0].childNodes[1].children[0];
				// uncheck
				if (ch.checked) ch.checked = false;
			}, this);


		} else {
			// check all visible
			var visible = this.list.visibleItems;
			visible.forEach(function (item, i, arr) {
				var ch = item.elm.children[0].childNodes[1].children[0];
				// check
				if (!ch.checked) ch.checked = true; 
			}, this);
		}
	},

	downloadFiles : function () {

		// create list of uuids only
		var fuuids = [];
		this._downloadFileList.forEach(function (file, i, arr) {
			fuuids.push(file.uuid);
		}, this);

		var json = {
			'files' : this._downloadFileList, //fuuids,
			'puuid' : this.project.store.uuid,
			'pslug' : this.project.store.slug
		}
		var json = JSON.stringify(json);

		// post         path          json      callback           this
		Wu.post('/api/file/download', json, this.receivedDownload, this);

	},

	receivedDownload : function (that, response) {
		// this = window

		// set path for zip file
		var path = '/api/file/download?file=' + response + '&type=zip';
		
		// add <a> for zip file
		that._downloadList.innerHTML = ich.datalibraryDownloadReady({'url' : path});
		var btn = Wu.DomUtil.get('download-ready-button');
		Wu.DomEvent.on(btn, 'click', that.downloadDone, that);

	},

	downloadCancel : function () {

		console.log('downloadCancel!');
		
		// clear download just in case
		this._downloadFileList = [];

		// hide
		this._downloadList.style.display = 'none';
	},

	downloadDone : function () {

		// close and re-init
		this.downloadCancel();
		this.initDownloadTable();
	},

	downloadConfirm : function (e) {

		// get selected files
		var checks = this.getSelected();
		this._downloadFileList = checks;
		
		// do nothing on 0 files
		if (checks.length == 0) { return; }

		// populate download window
		var tr = '';
		checks.forEach(function (file, i, arr) {
			var tmp = Wu.extend({}, file);
			tmp.format = tmp.format.join(', ');     // fix format format
			tr += ich.datalibraryDownloadRow(tmp);
		}, this);

		// get table and insert
		var table = Wu.DomUtil.get('datalibrary-download-insertrows');
		table.innerHTML = tr;

		// show
		this._downloadList.style.display = 'block';
	},

	getSelected : function () {

		// get selected files
		var checks = [];
		this.project.store.files.forEach(function(file, i, arr) {
			var checkbox = Wu.DomUtil.get('checkbox-' + file.uuid);
			if (checkbox) { var checked = checkbox.checked; }
			if (checked) { checks.push(file); }
		}, this);

		return checks;
	},

	deleteConfirm : function (e) {

		// get selected files
		var checks = this.getSelected();
				
		// do nothing on 0 files
		if (checks.length == 0) return; 

		// confirm dialogue, todo: create stylish confirm
		if (confirm('Are you sure you want to delete these ' + checks.length + ' files?')) {    
			this.deleteFiles(checks);
		} 
	},

	deleteFiles : function (files) {
		console.log('deleting ', files);
		
		// iterate over files and delete
		var _fids = [];
		files.forEach(function(file, i, arr) {

			// remove from list
			this.list.remove('uuid', file.uuid);
		
			// remove from local project
			var i;
			for (i = this.project.store.files.length - 1; i >= 0; i -= 1) {
			//this.project.files.forEach(function(f, i, a) {
				if (this.project.store.files[i].uuid == file.uuid) {
					this.project.store.files.splice(i, 1);
				}
			};

			// remove from layermenu                // todo: remove from actual menu div too
			// DO use a reverse for-loop:
			var i;
			for (i = this.project.store.layermenu.length - 1; i >= 0; i -= 1) {
				if (this.project.store.layermenu[i].fuuid == file.uuid) {
					this.project.store.layermenu.splice(i, 1);
				}
			}
			
			// prepare remove from server
			_fids.push(file._id);

		}, this);

		// save changes to layermenu
		this.project._update('layermenu');                                                                                                                                                                                                   
	       
		// remove from server
		var json = {
		    '_fids' : _fids,
		    'puuid' : this.project.store.uuid
		}
		var string = JSON.stringify(json);
		Wu.save('/api/file/delete', string); 

	},


	// list.js plugin
	initList : function () { 
		
		// add dummy entry
		var tr = Wu.DomUtil.createId('tr', 'dummy-table-entry');
		tr.innerHTML = ich.datalibraryTablerow({'type' : 'dummy-table-entry'});
		this._table.appendChild(tr);

		// init list.js
		var options = { valueNames : ['name', 'file', 'category', 'keywords', 'date', 'status', 'type'] };
		this.list = new List('filelist', options);

		// remove dummy
		this.list.clear();
	},

	// is only fired once ever
	initDZ : function () {
		var that = this;

		// create dz
		this.dz = new Dropzone(this._uploader, {
				url : '/api/upload',
				createImageThumbnails : false,
				autoDiscover : false
				// uploadMultiple : true
		});

		// add fullscreen dropzone
		this.enableFullscreenDZ();                                                                                                                                                                   
		
	},

	enableFullscreenDZ : function () {

		// add fullscreen bridge to dropzone
		Wu.DomEvent.on(document, 'dragenter', this.dropping, this);
		Wu.DomEvent.on(document, 'dragleave', this.undropping, this);
		Wu.DomEvent.on(document, 'dragover', this.dragover, this);
		Wu.DomEvent.on(document, 'drop', this.dropped, this);
	},

	disableFullscreenDZ : function () {

		// remove fullscreen bridge to dropzone
		Wu.DomEvent.off(document, 'dragenter', this.dropping, this);
		Wu.DomEvent.off(document, 'dragleave', this.undropping, this);
		Wu.DomEvent.off(document, 'dragover', this.dragover, this);
		Wu.DomEvent.off(document, 'drop', this.dropped, this);

	},

	refreshDZ : function () {
		var that = this;

		// clean up last dz
		this.dz.removeAllListeners();

		// set project uuid for dropzone
		this.dz.options.params.project = this.project.store.uuid;

		// set dz events
		this.dz.on('drop', function () { 
			console.log('drop'); 
		});

		this.dz.on('dragenter', function () { 
			console.log('dragenter'); 
		});

		this.dz.on('addedfile', function (file) { 

			// count multiple files
			that.filecount += 1;

			// show progressbar
			that.progress.style.opacity = 1;

			// show fullscreen file info
			if (!that._fulldrop) {
				that.fullOn();
				that.fullUpOn();
			}
		});


		this.dz.on('complete', function (file) {
			console.log('complete');

			// count multiple files
			that.filecount -= 1;

			// clean up
			that.dz.removeFile(file);
		      
		});

		// this.dz.on('totaluploadprogress', function (progress, totalBytes, totalSent) { 
		//         // set progress
		//         console.log('progress: ', progress);
		//         that.progress.style.width = progress + '%';
		// });

		this.dz.on('uploadprogress', function (file, progress) {
			// set progress
			that.progress.style.width = progress + '%';
		})                                                                                                                                                                                                               

		this.dz.on('success', function (err, json) {
			// parse and process
			var obj = Wu.parse(json);
			if (obj) { that.uploaded(obj); }
		});

		this.dz.on('complete', function (file) {
			console.log('complete!', file);
			console.log('filecount: ', that.filecount);

			if (!that.filecount) {
				// reset progressbar
				that.progress.style.opacity = 0;
				that.progress.style.width = '0%';

				// reset .fullscreen-drop
				that.fullUpOff();
				that.fulldropOff();
				that._fulldrop = false;
			}
		});

		// this.dz.on('successmultiple', function (err, json) {
		//         console.log('successmultiple!')
		//         console.log('err: ', err);
		//         console.log('json: ', json);
		// })

			   

	},

	
	// fullscreen when started uploading                                            // TODO: refactor fullUpOn etc..
	fullUpOn : function () {                                                        //       add support for multiple files
		// transform .fullscreen-drop                                           //       bugtest more thourougly
		Wu.DomUtil.addClass(this.fulldrop, 'fullscreen-dropped');
	},
	fullUpOff : function () {
		Wu.DomUtil.removeClass(this.fulldrop, 'fullscreen-dropped');
	},

	// fullscreen for dropping on
	fulldropOn : function (e) {

		// turn on fullscreen-drop
		this.fullOn();
		
		// remember drop elem
		this._fulldrop = e.target.className;
	},
	fulldropOff : function () {
		// turn off .fullscreen-drop
		this.fullOff();
	},

	// fullscreen for dropping on
	fullOn : function () {
		// turn on fullscreen-drop
		this.fulldrop.style.opacity = 0.9;
		this.fulldrop.style.zIndex = 1000;
	},

	fullOff : function () {
		var that = this;
		this.fulldrop.style.opacity = 0;
		setTimeout(function () {        // hack for transitions
			 that.fulldrop.style.zIndex = -10;      
		}, 200);
	},

	dropping : function (e) {
		e.preventDefault();
	    
		// show .fullscreen-drop
		this.fulldropOn(e);
	},

	undropping : function (e) {
		e.preventDefault();
		var t = e.target.className;

		// if leaving elem that started drop
		if (t == this._fulldrop) this.fulldropOff(e);
	},

	dropped : function (e) {
		e.preventDefault();
		
		// transform .fullscreen-drop
		this.fullUpOn();

		// fire dropzone
		this.dz.drop(e);
	},

	dragover : function (e) {
		// needed for drop fn
		e.preventDefault();
	},

	handleError : function (error) {
		console.log('handling error');
		var html = '';
		error.forEach(function (err, i, arr) {
			html += err.error;
			html += '<br>';
		})
		this._errors.innerHTML = html;
		this._errors.style.display = 'block';
	},

	// process file
	uploaded : function (record) {
		console.log('upload done:');
		console.log('file: ', record);

		// handle errors
		if (record.errors) {
			if (record.errors.length > 0) this.handleError(record.errors);
		}
		
		// return if nothing
		if (!record.files) return;

		// add files to library
		record.files.forEach(function (file, i, arr) {
			// add to table
			this.addFile(file);
 
			// add to project locally (already added on server)
			this.project.store.files.push(file);
		}, this);

		
		// add as layer, if file is a layer
		// this.layers

	},

	addFile : function (file) {

		// clone file object
		var tmp = Wu.extend({}, file);   
		
		// add record (a bit hacky, but with a cpl of divs inside the Name column)
		tmp.name = ich.datalibraryTablerowName({
			name : tmp.name || 'Title',
			description : tmp.description || 'Description',
			nameUuid : 'name-' + tmp.uuid,
			descUuid : 'description-' + tmp.uuid,
		});

		// clean arrays
		tmp.files = tmp.files.join(', ');
		tmp.keywords = tmp.keywords.join(', ');
		tmp.createdDate = new Date(tmp.createdDate).toDateString();

		// add file to list.js
		var ret = this.list.add(tmp);
		
		// ugly hack: manually add uuids
		ret[0].elm.id = tmp.uuid;                              // <tr>
		var c = ret[0].elm.children[0].children[0].children;    
		c[0].id = 'checkbox-' + tmp.uuid;                      // checkbox
		c[1].setAttribute('for', 'checkbox-' + tmp.uuid);      // label

		// add hooks for editing file, if edit access
		if (this.project.editMode) {
			this._addFileEditHooks(tmp.uuid);
		} else {
			console.log('____________CANNNTTTTT EDIT DATALIBRARY!!');
		}
	},

	_addFileEditHooks : function (uuid) {

		// get <input>'s
		var title = Wu.DomUtil.get('name-' + uuid);
		var desc = Wu.DomUtil.get('description-' + uuid);

		// set click hooks on title and description
		Wu.DomEvent.on( title,  'mousedown mouseup click', 	this.stop, 	this ); 
		Wu.DomEvent.on( title,  'dblclick', 			this.rename, 	this );     // select folder
		Wu.DomEvent.on( desc,   'mousedown mouseup click', 	this.stop, 	this ); 
		Wu.DomEvent.on( desc,   'dblclick', 			this.rename, 	this );     // select folder

	},

	// to prevent selected text
	stop : function (e) {
		console.log('stop!');   // not working!
		e.preventDefault();
		e.stopPropagation();
	},

	rename : function (e) {

		// enable editing on input box
		e.target.removeAttribute('readonly'); 
		e.target.focus();
		e.target.selectionStart = e.target.selectionEnd;

		// set key
		e.target.fieldKey = e.target.id.split('-')[0];

		// save on blur or enter
		Wu.DomEvent.on( e.target,  'blur', this.editBlur, this );     // save folder title
		Wu.DomEvent.on( e.target,  'keydown', this.editKey, this );     // save folder title

	},


	editKey : function (e) {
		// blur on enter
		if (event.which == 13 || event.keyCode == 13) e.target.blur();
	},

	editBlur : function (e) {

		// get key
		var key = e.target.fieldKey;

		// set back to readonly
		e.target.setAttribute('readonly', 'readonly');                                                                                                                                                                                         
		
		// get file uuid
		var fuuid = e.target.id.replace(key + '-', '');

		// get new title
		var value = e.target.value || e.target.innerHTML;

		// update file in project
		this.project.store.files.forEach(function(file, i, arr) {
			// iterate and find hit
			if (file.uuid == fuuid) file[key] = value;
		}, this);

		// hack: update list item manually (for instant sorting)                // TODO!
		// this.list.items.forEach(function (item, i, arr) {                    // prob. values in element not updated in html

		//         if (item.elm.id == fuuid) {
		//                 var html = item.elm.
		//                 item.
		//         }

		// }, this);

		// refresh list
		this.list.update();     // todo: funky behavior when changing name, doesn't reflect (ie. sort works on old value)

		// save to server
		this._save(fuuid, key);

	},

	_save : function (fuuid, key) {

		// save the file
		this.project.store.files.forEach(function(file, i, arr) {
		     
			// iterate and find hit
			if (file.uuid == fuuid) {

				// create update object
				var json = {};
				json[key] = file[key];
				json.uuid = file.uuid;

				console.log('##$$$ save ::', key, json);

				// update, no callback
				var string = JSON.stringify(json);
				Wu.save('/api/file/update', string); 
			}
		});
	},

	

	updateContent : function () {
		this.update();
	},

	update : function () {

		// use active project
		this.project = Wu.app.activeProject;

		// flush
		this.reset();

		// refresh dropzone
		this.refreshDZ();

		// refresh table entries
		this.refreshTable();

		if (this.project.editMode) {
			this.addEditHooks();
		} else {
			this.removeEditHooks();
		}

	},

	refreshTable : function () {

		// return if empty filelist
		if (!this.project.store.files) { return; }

		// enter files into table
		this.project.store.files.forEach(function (file, i, arr) {
		       this.addFile(file);
		}, this);

		// sort list by name by default
		this.list.sort('name', {order : 'asc'});
	},

	reset : function () {

		// clear table
		this.list.clear();

		// remove uploading, in case bug
		this.fullOff();
		this.fulldropOff();

	}

});






// /*
// ██╗      █████╗ ██╗   ██╗███████╗██████╗ ███████╗
// ██║     ██╔══██╗╚██╗ ██╔╝██╔════╝██╔══██╗██╔════╝
// ██║     ███████║ ╚████╔╝ █████╗  ██████╔╝███████╗
// ██║     ██╔══██║  ╚██╔╝  ██╔══╝  ██╔══██╗╚════██║
// ███████╗██║  ██║   ██║   ███████╗██║  ██║███████║
// ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚══════╝
// */
// // Layermenu in the Editor 
// Wu.SidePane.Layers = Wu.SidePane.Item.extend({

// 	type : 'layers',                                // list of sources available to this user/project/client
// 	//title : 'Layermenu',

// 	initContent : function () {

// 		// create from template
// 		this._container.innerHTML = ich.layersWrapper();

// 		// get panes
// 		this._layersWrapper = Wu.DomUtil.get('layers-wrapper');
// 		this._libaryWrapper = Wu.DomUtil.get('layers-library-browser');
// 		this._layerList = Wu.DomUtil.get('layers-library-list');
// 		this._browserLibrary = Wu.DomUtil.get('layers-library-browser-datalayers');
// 		this._browserMapbox = Wu.DomUtil.get('layers-library-browser-mapbox');
// 		this._libraryPane = Wu.DomUtil.get('layers-library'); // list of local file
// 		this._mapboxPane = Wu.DomUtil.get('layers-mapbox');     // list of mapbox
// 		this._mapboxImportOk = Wu.DomUtil.get('import-mapbox-layers-ok'); // import mapbox account btn 
// 		this._mapboxImportInput = Wu.DomUtil.get('import-mapbox-layers');
// 		this._mapboxList = Wu.DomUtil.get('layers-mapbox-list-wrap');
// 		this._mapboxConnectDropp = Wu.DomUtil.get('editor-layers-connect-mapbox');
// 		this._datalibUploadDropp = Wu.DomUtil.get('editor-layers-upload');

// 		// add menu folder item -- hack
// 		this._middleItem = Wu.DomUtil.create('div', 'smap-button-white middle-item ct12 ct18');
// 		this._middleItem.innerHTML = 'Menu Folder';
// 		this._layersWrapper.appendChild(this._middleItem);

// 	},

// 	addHooks : function () {

// 		Wu.DomEvent.on(this._browserMapbox,     'mousedown',    this.selectBrowserMapbox, this);
// 		Wu.DomEvent.on(this._browserLibrary,    'mousedown',    this.selectBrowserLibrary, this);
// 		Wu.DomEvent.on(this._mapboxImportOk,    'mousedown',    this.importMapboxAccount, this);
// 		Wu.DomEvent.on(this._mapboxImportInput, 'keydown',      this.mapboxInputKeydown, this);

// 		// menu folder item
// 		Wu.DomEvent.on(this._middleItem, 'mousedown', this.addMenuFolder, this);

// 	},

// 	_activate : function () {
// 		var layerMenu = Wu.app.MapPane.layerMenu;
// 		if (layerMenu) {
// 			layerMenu.enableEdit();
// 		}

// 	},

// 	deactivate : function () {
// 		var layerMenu = Wu.app.MapPane.layerMenu;
// 		if (layerMenu) {
// 			layerMenu.disableEdit();
// 		}

// 	},

// 	addMenuFolder : function () {
// 		console.log('adding menu folder!');
// 		var lm = {
// 			fuuid : 'layermenuFolder-' + Wu.Util.guid(),
// 			title : 'New folder',
// 			layerType : 'menufolder',
// 			pos : 2
// 		}

// 		Wu.app.MapPane.layerMenu.addMenuFolder(lm);

// 		// save
// 		// var lm = {
// 		//         fuuid : file.uuid,
// 		//         title : file.name,
// 		//         pos : 1,
// 		//         layerType : 'datalibrary'
// 		// }

// 		this.project.layermenu.push(lm);
		
// 		// save to server
// 		this.project._update('layermenu');

// 	},

// 	toggleDropdown : function (e) {
// 		var wrap = e.target.nextElementSibling;
		    
// 		// toggle open/close
// 		if (Wu.DomUtil.hasClass(wrap, 'hide')) {
// 			Wu.DomUtil.removeClass(wrap, 'hide');
// 			Wu.DomUtil.addClass(e.target, 'rotate180');
// 		} else {
// 			Wu.DomUtil.addClass(wrap, 'hide');
// 			Wu.DomUtil.removeClass(e.target, 'rotate180');
// 		}

// 	},

// 	mapboxInputKeydown: function (e) {
// 		// blur and go on enter
// 		if (event.which == 13 || event.keyCode == 13) {
// 			e.target.blur();
// 			this.getMapboxAccount()
// 		}
// 	},

// 	selectBrowserMapbox : function () {
// 		this._mapboxPane.style.display = 'block';
// 		this._libraryPane.style.display = 'none';
// 	},

// 	selectBrowserLibrary : function () {
// 		this._mapboxPane.style.display = 'none';
// 		this._libraryPane.style.display = 'block';
// 	},

// 	update : function (project) {   // todo: careful with passing projects, perhaps better to get from global SidePane source
// 		var project = this.project || project;
		
// 		// update layers after new additon
// 		this.updateContent(project);
// 	},

// 	updateContent : function (project) {

// 		// reset view
// 		this._reset();

// 		// set project
// 		this.project = project;

// 		// update view
// 		this._update();
// 	},

// 	_update : function () {

// 		// layermenu
// 		this.initLayers();

// 		// mapbox layers
// 		this.initMapboxLayers();

// 		// show active layers
// 		this.markActiveLayers();
// 	},

// 	_reset : function () {

// 		this._layerList.innerHTML = '';
// 		this._mapboxList.innerHTML = '';
// 		this.mapboxFiles = {};
// 		this.mapboxUsers = {};
// 		this.mapboxLayers = {};
// 		this.selectBrowserLibrary(); // set data library as default pane
// 	},


// 	markActiveLayers : function () {

// 		// mark active mapbox layers
// 		this.project.layermenu.forEach(function (layer) {

// 			if (layer.layerType == 'datalibrary') {
				
// 				// tag item active
// 				var check = 'layerItem-' + layer.fuuid;
// 				var div = Wu.DomUtil.get(check).parentNode;
// 				Wu.DomUtil.addClass(div, 'active');

// 			} else if (layer.layerType == 'mapbox') {
				
// 				// tag item active
// 				var check = 'layerMapboxItem-' + layer.fuuid;
// 				var div = Wu.DomUtil.get(check).parentNode;
// 				Wu.DomUtil.addClass(div, 'active');
// 			}

// 		}, this);
// 	},

// 	initMapboxLayers : function () {

// 		// ordem e progresso
// 		// this.parseMapboxLayers();

// 		// update DOM
// 		this.updateMapboxDOM();

// 	},

// 	initLayers : function () {

// 		// get local layers
// 		var layers = [];
// 		this.project.files.forEach(function (file, i, arr) {	// iterates file list, and finds layers.... TODO: list of layers, separate
// 			if (file.type == 'layer') {
// 				layers.push(file);
// 				this.addLayer(file);
// 			}
// 		}, this);

// 		// refresh draggable
// 		this.initDraggable();

// 	},

// 	resetDraggable : function () {

// 		// remove hooks
// 		var bin = Wu.DomUtil.get('layer-menu-inner-content');
// 		if (!bin) return;
		
// 		Wu.DomEvent.off(bin, 'dragover', this.drag.over, this);
// 		Wu.DomEvent.off(bin, 'dragleave', this.drag.leave, this);
// 		Wu.DomEvent.off(bin, 'drop', this.drag.drop, this);
	
// 	},


// 	// dragging of layers to layermenu
// 	drag : {

// 		start : function (e) {
// 			var el = e.target;
// 			console.log('drag start: ', e);

// 			// set fuuid
// 			var fuuid = e.target.getAttribute('fuuid');
// 			var type = e.target.getAttribute('type');
// 			e.dataTransfer.setData('fuuid', fuuid); // set *something* required otherwise doesn't work
// 			e.dataTransfer.setData('type', type);

// 		},

// 		drop : function (e) {
// 			if (e.stopPropagation) e.stopPropagation(); // stops the browser from redirecting...why???

// 			console.log('drooooop! ', e);
// 			console.log('nini: ', e.nini);
// 			console.log('sambaL', e.target.nini);

// 			console.log('getData: ', e.dataTransfer.getData('fuuid'));

			
// 			var fuuid = e.dataTransfer.getData('fuuid');
// 			var type = e.dataTransfer.getData('type');
// 			// var type = el.getAttribute('type');

// 			console.log('fuuid/type: ', fuuid, type);

// 			// add
// 			this.addLayerToMenu(fuuid, type);

// 			// clear visual feedback
// 			Wu.DomUtil.removeClass(Wu.DomUtil.get('layer-menu-inner-content'), 'over');

// 			return false; // irrelevant probably
// 		},

// 		over : function (e) {
// 			if (e.preventDefault) e.preventDefault(); // allows us to drop

// 			// set visual
// 			Wu.DomUtil.addClass(Wu.DomUtil.get('layer-menu-inner-content'), 'over');
			
// 			return false;
// 		},

// 		leave : function (e) {
// 			// clear visual
// 			Wu.DomUtil.removeClass(Wu.DomUtil.get('layer-menu-inner-content'), 'over');
// 		}
// 	},
       
// 	initDraggable : function () {

// 		this.resetDraggable();  // needed? seems not.

// 		console.log('INITDRAGGGG');

// 		// iterate over all layers
// 		var items = document.getElementsByClassName('layer-item');
// 		for (var i = 0; i < items.length; i++) {
// 			var el = items[i];
			
// 			// set attrs
// 			el.setAttribute('draggable', 'true');
			
// 			// set dragstart event
// 			Wu.DomEvent.on(el, 'dragstart', this.drag.start, this);
// 		};

// 		// set hooks
// 		var bin = Wu.DomUtil.get('layer-menu-inner-content');
// 		if (bin) {
// 			Wu.DomEvent.on(bin, 'dragover', this.drag.over, this);
// 			Wu.DomEvent.on(bin, 'dragleave', this.drag.leave, this);
// 			Wu.DomEvent.on(bin, 'drop', this.drag.drop, this);
// 		} 


// 	},


// 	removeLayerFromMenu : function (fuuid, type) {

// 		console.log('__________removeLayerFromMenu_____________', fuuid, type);                
// 		console.log('this.project.layermenu', this.project.layermenu);

// 		var i = _.findIndex(this.project.layermenu, {'fuuid' : fuuid});
	       
// 		if (!i < 0) {
// 			var i = _.findIndex(this.project.layermenu, {'id' : fuuid});    // mapbox
// 		}

// 		// remove from layermenu object
// 		this.project.layermenu.splice(i, 1);
	       
// 		// remove from layermenu DOM
// 		Wu.app.MapPane.layerMenu.remove(fuuid);

// 		// save
// 		this.project._update('layermenu');

// 	},

// 	// drag-n drop
// 	addLayerToMenu : function (fuuid, type) {

// 		// add from datalibrary
// 		if (type == 'datalibrary') {
// 			// get file,  add to layermenu
// 			var file = this.getFileFromUuid(fuuid);
// 			console.log('dl file: ', file);
			
// 			// add to layermenu
// 			Wu.app.MapPane.layerMenu.addFromFile(file);

// 			// tag item active
// 			var check = 'layerItem-' + fuuid;
// 			var div = Wu.DomUtil.get(check).parentNode;
// 			Wu.DomUtil.addClass(div, 'active');

// 			return;
// 		}

// 		// add from mapbox
// 		if (type == 'mapbox') {

// 			// find layer in mapbox jungle
// 			console.log('this.mapboxLayers: ', this.mapboxLayers);  // TODO: rewrite with _.find
			
// 			var mfile;
// 			for (l in this.mapboxLayers) {
// 				var account = this.mapboxLayers[l];
// 				account.forEach(function (layer) {
// 					if (layer.id == fuuid) mfile = layer; 
// 				});
// 			}
			
// 			if (!mfile) { 
// 				console.log('that layer is not here????'); 
// 				return;
// 			}
			       
// 			// add to layermenu
// 			Wu.app.MapPane.layerMenu.addFromMapbox(mfile);
			
// 			// tag item active
// 			var check = 'layerMapboxItem-' + fuuid;
// 			var div = Wu.DomUtil.get(check).parentNode;
// 			Wu.DomUtil.addClass(div, 'active');

			
// 			return;
// 		}

// 	},

// 	getFileFromUuid : function (fuuid) {
// 		var file = {};
// 		this.project.files.forEach(function (f, i, arr) {
// 			if (fuuid == f.uuid) file = f; 
// 		}, this);
// 		return file;
// 	},

// 	addLayer : function (file) {

// 		var div = Wu.DomUtil.create('div', 'item-list layer-item');
// 		div.setAttribute('draggable', true);
// 		div.setAttribute('fuuid', file.uuid);
// 		div.setAttribute('type', 'datalibrary');
// 		div.innerHTML = ich.layersItem(file);
// 		this._layerList.appendChild(div);

// 		// add to layermenu on click
// 		Wu.DomEvent.on(div, 'click', this.toggleLayer, this);

// 	},


	

// 	// on click when adding new mapbox account
// 	importMapboxAccount : function (e) {

// 		// get username
// 		var username = this._mapboxImportInput.value;

// 		// get mapbox account via server
// 		this.getMapboxAccount(username);

// 		// clear input box
// 		this._mapboxImportInput.value = '';

// 	},

// 	getMapboxAccount : function (username) {
		
// 		// get mapbox account from server
// 		// ie, send username to server, get mapbox parsed back
// 		var data = {
// 			'username' : username,
// 			'projectId' : this.project.uuid
// 		}
// 		// post         path                            json                                   callback      this
// 		Wu.post('/api/util/getmapboxaccount', JSON.stringify(data), this.gotMapboxAccount, this);

// 	},

// 	parseMapboxLayers : function (layers, fresh) {
// 		return;
// 		var layers = layers || this.project.mapboxLayers;

// 		// push into an orderly object
// 		this.mapboxLayers = this.mapboxLayers || {};
// 		layers.forEach(function (layer, i, arr) {
// 			this.mapboxLayers[layer.username] = this.mapboxLayers[layer.username] || [];
// 			this.mapboxLayers[layer.username].push(layer);
			
// 			// add to project 
// 			if (fresh) this.project.mapboxLayers.push(layer);  //TODO could contain duplicates
		
// 		}, this);

// 		// remove possible duplicates
// 		this.removeMapboxDuplicates();

// 	},

// 	removeMapboxDuplicates : function () {

// 		// remove possible duplicates
// 		this.project.mapboxLayers = _.uniq(this.project.mapboxLayers, 'id');

// 		// remove dups in local 
// 		for (a in this.mapboxLayers) {
// 			this.mapboxLayers[a] = _.uniq(this.mapboxLayers[a], 'id');
// 		}

// 	},

// 	// returned from server getting a mapbox account
// 	gotMapboxAccount : function (that, response) {

// 		var layers = JSON.parse(response);

// 		// check if empty
// 		if (!layers) { console.log('seems empty'); return; }
	       
// 		// ordem e progresso
// 		that.parseMapboxLayers(layers, true); // and add to project

// 		// update DOM
// 		that.updateMapboxDOM();

// 		// save to project
// 		that.project._update('mapboxLayers');

// 	},

// 	// just update DOM with existing mapbox accounts
// 	updateMapboxDOM : function () {

// 		console.log('updateMapboxDOM; this.mapboxLayers: ', this.mapboxLayers);

// 		// update DOM in project with all mapbox accounts and layers
// 		this._mapboxList.innerHTML = ''; // reset
// 		for (account in this.mapboxLayers) {

// 			// create account header
// 			var div = Wu.DomUtil.create('div', 'mapbox-list-item');
// 			div.innerHTML = ich.mapboxListWrapper({'name' : account});    
// 			this._mapboxList.appendChild(div);
// 			var wrap = Wu.DomUtil.get('layers-mapbox-list-' + account);

// 			// fill in with layers
// 			var layers = this.mapboxLayers[account];
// 			layers.forEach(function (layer) {

// 				// create and append layer to DOM list
// 				var div = Wu.DomUtil.create('div', 'layer-item');
// 				div.setAttribute('draggable', true);
// 				div.setAttribute('fuuid', layer.id);
// 				div.setAttribute('type', 'mapbox');
// 				div.innerHTML = ich.layersMapboxItem(layer);
// 				wrap.appendChild(div);

// 				// add to layermenu on click
// 				Wu.DomEvent.on(div, 'click', this.toggleLayer, this);

// 			}, this);

// 		}

// 		// refresh draggable
// 		this.initDraggable();

// 	},

// 	toggleLayer : function (e) {
	       
// 		var div = e.target;
// 		var fuuid = div.getAttribute('fuuid');
// 		var type = div.getAttribute('type');

// 		if (!fuuid && !type) {
// 			var div = e.target.parentNode;
// 			var fuuid = div.getAttribute('fuuid');
// 			var type = div.getAttribute('type');
// 		}

// 		// see if layer is in layermenu
// 		var active = _.find(this.project.layermenu, {'fuuid' : fuuid});

// 		if (active != undefined) {

// 			// toggle off
// 			this.removeLayerFromMenu(fuuid);
			
// 			// tag item active
// 			Wu.DomUtil.removeClass(div, 'active');

// 		} else {

// 			// toggle on
// 			this.addLayerToMenu(fuuid, type);
// 		}


// 	},

// 	save : function (key) {



// 	},

	
// });


// 