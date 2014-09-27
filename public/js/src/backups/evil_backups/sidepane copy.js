                                                                                                                                                                                                                   

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
                var className = 'q-editor-container';
                this._container = Wu.DomUtil.create('div', className, Wu.app._appPane);
        },


        initContent : function () {
                
                // menu pane
                var className = 'q-editor-menu';
                Wu.app._editorMenuPane = Wu.DomUtil.create('menu', className, this._container); 

                // content pane
                var className = 'q-editor-content';
                Wu.app._editorContentPane = Wu.DomUtil.create('content', className, this._container); 
        },
        
        render : function () {

                // fill in options.editor if blank
                if (!Wu.Util.isObject(this.options.editor)) {
                        this.options.editor = { render : this.options.editor || true};
                }

                // render all editor elements
                if (this.options.editor.clients != false) {             // will go out
                        this.Clients = new Wu.SidePane.Clients();
                }

                // render projects everytime
                this.Projects = new Wu.SidePane.Projects(this);


                if (this.options.editor.map != false) {
                        this.Map = new Wu.SidePane.Map();
                }

                if (this.options.editor.sources != false) {
                        this.Layers = new Wu.SidePane.Layers();
                }

                if (this.options.editor.documentsPane != false) {
                        this.Documents = new Wu.SidePane.Documents();
                }

                if (this.options.editor.downloadsPane != false) {
                        this.DataLibrary = new Wu.SidePane.DataLibrary();
                }

                // if user has management access
                if (this.options.editor.users != false) {
                        this.Users = new Wu.SidePane.Users();
                }

        },


        setProject : function (project) {

                console.log('set project _______ SidePane');
                this.Map.updateContent(project);
                this.Layers.updateContent(project);
                this.Documents.updateContent(project);
                //this.Users.updateContent(project);
                this.DataLibrary.updateContent(project);
                //this.Header._updateContent(project);

        },

        // display the relevant panes
        refresh : function (menus) {

                // all panes
                var all = ['Clients', 'Projects', 'Map', 'Layers', 'Documents', 'Users', 'DataLibrary'];
                
                // panes to active
                menus.forEach(function (elem, i, arr) {
                        if (!Wu.app.SidePane[elem]) {
                                Wu.app.SidePane[elem] = new Wu.SidePane[elem];
                        }
                        Wu.app.SidePane[elem].enable();
                }, this);

                // panes to deactivate
                var off = all.diff(menus);
                off.forEach(function (elem, i, arr) {
                        Wu.app.SidePane[elem].disable(); // alt remove?
                }, this)

                // Wu.app.SidePane.Clients.enable();
                // Wu.app.SidePane.Projects.enable();
                // Wu.app.SidePane.Map.enable();
                // // Wu.app.SidePane.Sources.enable();
                // Wu.app.SidePane.Users.enable();
                // Wu.app.SidePane.Layers.enable();





        }



});










/*
 /$$$$$$ /$$                            
|_  $$_/| $$                            
  | $$ /$$$$$$    /$$$$$$  /$$$$$$/$$$$ 
  | $$|_  $$_/   /$$__  $$| $$_  $$_  $$
  | $$  | $$    | $$$$$$$$| $$ \ $$ \ $$
  | $$  | $$ /$$| $$_____/| $$ | $$ | $$
 /$$$$$$|  $$$$/|  $$$$$$$| $$ | $$ | $$
|______/ \___/   \_______/|__/ |__/ |__/

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
                Wu.DomEvent.on(this._menu, 'click', this._activate, this);          // click
                Wu.DomEvent.on(this._menu, 'mouseenter', this._mouseenter, this);   // mouseEnter
                Wu.DomEvent.on(this._menu, 'mouseleave', this._mouseleave, this);   // mouseLeave
        },

        _mouseenter : function (e) {
                Wu.DomUtil.addClass(this._menu, 'red');
        },

        _mouseleave : function (e) {
                Wu.DomUtil.removeClass(this._menu, 'red');
        },

        _activate : function (e) {
               
               
                // set active menu
                var prev = Wu.app._activeMenu || false;
                Wu.app._activeMenu = this;

                // Hide the Deactivated Pane
                if (Wu.app._active) {                	
                	Wu.DomUtil.removeClass(Wu.app._active, 'show') 
                	};
                	                	

                // Show the Activated Pane 	                	
                Wu.app._active = this._content;
                Wu.DomUtil.addClass(Wu.app._active, 'show');


                // add active to menu
                if (prev) { Wu.DomUtil.removeClass(prev._menu, 'active'); }
                Wu.DomUtil.addClass(this._menu, 'active');

                // call deactivate on previous for cleanup
                if (prev) { prev.deactivate(); };

                // update pane
                //this._update();   //todo: refactor: now it's _update, _updateContent, refresh all over tha place
        },



        deactivate : function () {
                console.log('blank deactiavte');

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
                this._container = Wu.DomUtil.create('div', 'editor-wrapper', this._content);
        },

        initContent : function () {

        },

        updateContent : function (project) {

                // console.log('updateing ' + this.type + ' content in Editor');
                // console.log(project);

        },

        _addHook : function (elem, event, fn, uuid) {
                Wu.DomEvent.on(elem, event, fn, uuid);

        },


        disable : function () {

                // disable click
                Wu.DomEvent.off(this._menu, 'click', this._activate, this); 

                // add disabled class
                Wu.DomUtil.addClass(this._title, 'disabled');

        },

        enable : function () {

                // enable click
                Wu.DomEvent.on(this._menu, 'click', this._activate, this); 

                // remove disabled class
                Wu.DomUtil.removeClass(this._title, 'disabled');

        },

        remove : function () {

                delete this._menu;
                delete this._content;
                delete this;

        }



});











/*
  /$$$$$$  /$$ /$$                       /$$             
 /$$__  $$| $$|__/                      | $$             
| $$  \__/| $$ /$$  /$$$$$$  /$$$$$$$  /$$$$$$   /$$$$$$$
| $$      | $$| $$ /$$__  $$| $$__  $$|_  $$_/  /$$_____/
| $$      | $$| $$| $$$$$$$$| $$  \ $$  | $$   |  $$$$$$ 
| $$    $$| $$| $$| $$_____/| $$  | $$  | $$ /$$\____  $$
|  $$$$$$/| $$| $$|  $$$$$$$| $$  | $$  |  $$$$//$$$$$$$/
 \______/ |__/|__/ \_______/|__/  |__/   \___/ |_______/ 
                                                         
*/
// Clients
Wu.SidePane.Clients = Wu.SidePane.Item.extend({

        type : 'clients',

        initialize : function () {
                Wu.SidePane.Item.prototype.initialize.call(this)

                // active by default
                Wu.app._active = this._content;
                this._activate();      
        },

        initContent : function () {

                // container
                this._container.innerHTML = ich.editorClients();
                var clientsContainer = this._clientsContainer = Wu.DomUtil.get('editor-clients');
              
                // new clients button
                var newClientButton = Wu.DomUtil.create('div', 'new-client', this._clientsContainer);
                newClientButton.innerHTML = 'Create New Client';
                this._addHook(newClientButton, 'click', this._createNew, this);

                // clients
                this.options.json.clients.forEach(function(client, i, arr) {     
                        this._create(client);
                }, this);


        },

        _create : function (client) {
                var clientData = {
                        clientName : client.name,
                        clientLogo : client.header.logo,
                        clientID   : client.uuid
                }
                
                // append client to container
                Wu.DomUtil.prependTemplate(this._clientsContainer, ich.editorClientsItem(clientData));

                // set hook for selecting client
                var target = Wu.DomUtil.get('editor-clients-container-' + client.uuid);
                this._addHook(target, 'click', this.select, Wu.app.Clients[client.uuid]);
                this._addHook(target, 'click', this._select, target);
                
                // set hook for edit toggle
                var toggle = Wu.DomUtil.get('editor-client-edit-toggle-' + client.uuid);
                this._addHook(toggle, 'click', this.toggleEdit, Wu.app.Clients[client.uuid]);

                // set hook for delete button           TODO if privs
                var del = Wu.DomUtil.get('editor-client-delete-' + client.uuid);
                this._addHook(del, 'click', this.remove, Wu.app.Clients[client.uuid]);

        },

        remove : function () {
                var client = this;
                if (window.confirm('Are you sure you want to DELETE the client ' + client.name + '?')) {
                        client._delete();  
                }
        },


        _createNew : function () {

                // add new client box
                var clientData = {
                        clientName : 'New client'
                }
                        
                // prepend client to container
                Wu.DomUtil.prependTemplate(this._clientsContainer, ich.editorClientsNew(clientData));

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
                if (json.unique) {
                        editor._enableConfirm();
                        return;
                } 

                // if error                             // TODO error handling
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
                var old = Wu.DomUtil.get('editor-clients-container-new');
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
                client.saveNew(); 
        },

        _created : function(client, json) {       // this is the http callback        
                var editor = Wu.app.SidePane.Clients;
                var options = JSON.parse(json);
               
                // update Client object
                Wu.extend(client, options);
                Wu.app.Clients[client.uuid] = client;

                // remove edit box
                var old = Wu.DomUtil.get('editor-clients-container-new');
                Wu.DomUtil.remove(old);
                
                // create client in DOM
                editor._create(client);
               
                // set active
                client.setActive();
        },

        toggleEdit : function (e) { // this = client

                // stop propagation
                if (e) { Wu.DomEvent.stop(e); }

                var client = this;
                var container = Wu.DomUtil.get('editor-client-edit-wrapper-' + client.uuid);

                if (client.options.editMode) {
                       
                        // hide dom
                        container.style.display = 'none';
                        client.options.editMode = false;
                } else {
                       
                        // show dom
                        container.style.display = 'block';
                        client.options.editMode = true;
                }
        },

        _addHook : function (elem, event, fn, uuid) {
                Wu.DomEvent.on(elem, event, fn, uuid);
        },

        select : function (e) {
                var client = this;

                // skip if already selected
                //if (Wu.app._activeClient == client) { return; }

                // set active
                client.setActive(); // this = Wu.Client

                // reset active project
                if (Wu.app._activeProject) {
                        Wu.app._activeProject.unload();
                }

                
                // refresh SidePane
                Wu.app.SidePane.Clients.refreshSidePane();
                
                // activate projects
                Wu.app.SidePane.Projects._activate();


        },

        refreshSidePane : function () {

                // refresh SidePane
                var menu = ['Clients', 'Projects'];
                
                // if user got manager privs, show USERS settings
                var priv = Wu.app.options.json.user.privileges.create;
                if (priv.users) menu.push('Users'); 
                Wu.app.SidePane.refresh(menu);

                // update SidePane.Users
                Wu.app.SidePane.Users.update();
        },

        _select : function () {
                var that = Wu.app.SidePane.Clients;   
                if (that._previousSelect) {
                        Wu.DomUtil.removeClass(that._previousSelect, 'active-client');
                }
                Wu.DomUtil.addClass(this, 'active-client');
                that._previousSelect = this;
        },

        selectProject : function (e) {
                var project = this;
                project.setActive();               // Wu.Project.setActive();
        },

        disable : function () {
                // noop
        }


});




/*
 /$$$$$$$                                               /$$             
| $$__  $$                                             | $$             
| $$  \ $$ /$$$$$$   /$$$$$$  /$$  /$$$$$$   /$$$$$$$ /$$$$$$   /$$$$$$$
| $$$$$$$//$$__  $$ /$$__  $$|__/ /$$__  $$ /$$_____/|_  $$_/  /$$_____/
| $$____/| $$  \__/| $$  \ $$ /$$| $$$$$$$$| $$        | $$   |  $$$$$$ 
| $$     | $$      | $$  | $$| $$| $$_____/| $$        | $$ /$$\____  $$
| $$     | $$      |  $$$$$$/| $$|  $$$$$$$|  $$$$$$$  |  $$$$//$$$$$$$/
|__/     |__/       \______/ | $$ \_______/ \_______/   \___/ |_______/ 
                        /$$  | $$                                       
                       |  $$$$$$/                                       
                        \______/                                        
*/// Projects
Wu.SidePane.Projects = Wu.SidePane.Item.extend({

        type : 'projects',

        initContent : function () {
                
                // template        
                this._container.innerHTML = ich.editorProjectsContainer();

                // sort by buttons
                var sortleft = Wu.DomUtil.get('editor-projects-sort-by-left');
                var sortright = Wu.DomUtil.get('editor-projects-sort-by-right');
                Wu.DomEvent.on(sortleft, 'click', this.sortProjects, this);
                Wu.DomEvent.on(sortright, 'click', this.sortProjects, this);

                // new project button
                var newProjectButton = Wu.DomUtil.get('new-project-button');
                Wu.DomEvent.on(newProjectButton, 'click', this._createNew, this);

                // set panes
                this._projectsContainer = Wu.DomUtil.get('editor-projects-container');


                this._projects = {};
                this._editMode = false;
                

        },

        // _initClients : function () {

        //         console.log('_INITCLIENTS ___ IN PROJECTS??!?');

        //         // container
        //         this._container.innerHTML = ich.editorClients();
        //         var clientsContainer = this._clientsContainer = Wu.DomUtil.get('editor-clients');
              
        //         // new clients button
        //         var newClientButton = Wu.DomUtil.create('div', 'new-client', this._clientsContainer);
        //         newClientButton.innerHTML = 'Create New Client';
        //         this._addHook(newClientButton, 'click', this._createNew, this);

        //         // clients
        //         this.options.json.clients.forEach(function(client, i, arr) {     
        //                 this._create(client);
        //         }, this);


        // },

        // _create : function (client) {
        //         var clientData = {
        //                 clientName : client.name,
        //                 clientLogo : client.header.logo,
        //                 clientID   : client.uuid
        //         }
                
        //         // append client to container
        //         Wu.DomUtil.prependTemplate(this._clientsContainer, ich.editorClientsItem(clientData));

        //         // set hook for selecting client
        //         var target = Wu.DomUtil.get('editor-clients-container-' + client.uuid);
        //         this._addHook(target, 'click', this.select, Wu.app.Clients[client.uuid]);
        //         this._addHook(target, 'click', this._select, target);
                
        //         // set hook for edit toggle
        //         var toggle = Wu.DomUtil.get('editor-client-edit-toggle-' + client.uuid);
        //         this._addHook(toggle, 'click', this.toggleEdit, Wu.app.Clients[client.uuid]);

        //         // set hook for delete button           TODO if privs
        //         var del = Wu.DomUtil.get('editor-client-delete-' + client.uuid);
        //         this._addHook(del, 'click', this.removeClient, Wu.app.Clients[client.uuid]);

        // },

        // removeClient : function () {
        //         var client = this;

        //         client.remove();
        //         // if (window.confirm('Are you sure you want to DELETE the client ' + client.name + '?')) {

        //         //         client._delete();  
        //         // }
        // },

        

        refresh : function () {

                var client = Wu.app._activeClient;
                
                // reset container
                this._projectsContainer.innerHTML = '';

                // fill in with projects that belong to active client
                this._projects = {};
                for (item in Wu.app.Projects) { 
                        if (client.projects.indexOf(item) > -1) {
                                this._create(Wu.app.Projects[item]);
                        } 
                };

        },

        select : function () {
                var project = this;
                project.setActive();        // Wu.Project.setActive();

                var pro = Wu.app.SidePane.Projects._projects;
                for (p in pro) {
                        var el = pro[p];
                        Wu.DomUtil.removeClass(el, 'active');
                }
                var el = pro[project.uuid];
                 
                Wu.DomUtil.addClass(el, 'active');

                // enable project menu 
                // Wu.app.SidePane.Clients.enable();
                // Wu.app.SidePane.Projects.enable();
                // Wu.app.SidePane.Map.enable();
                // // Wu.app.SidePane.Sources.enable();
                // Wu.app.SidePane.Users.enable();
                // Wu.app.SidePane.Layers.enable();
        

                // refresh SidePane
                var menu = ['Clients', 'Projects', 'Documents', 'Layers', 'DataLibrary'];

                // if user got write access, show MAP settings
                if (project.access.write.indexOf(Wu.app.options.json.user.uuid) > -1) {
                        menu.push('Map');
                }
                // if user got manager privs, show USERS settings
                var priv = Wu.app.options.json.user.privileges.create;
                if (priv.users) {
                        menu.push('Users');
                }
                Wu.app.SidePane.refresh(menu);

        },

        sortProjects : function (e, bool) {

                console.log('sort!');
                console.log(this);
                console.log(e);
                console.log(bool);
        },


        _createNew : function () {

                console.log('creating neeeee!');
                // add new project box
                var projectData = {
                        projectName : 'New project'
                }
                        
                // prepend client to container
                Wu.DomUtil.prependTemplate(this._projectsContainer, ich.editorProjectsNew(projectData), true);

                // set hooks: confirm button
                var target = Wu.DomUtil.get('editor-project-confirm-button');
                this._addHook(target, 'click', this._confirm, this);

                // cancel button
                var target = Wu.DomUtil.get('editor-project-cancel-button');
                this._addHook(target, 'click', this._cancel, this);

                // set hooks: writing name                                      // TODO: unique names on projects?
                //var name = Wu.DomUtil.get('editor-project-name-new');
                //this._addHook(name, 'keyup', this._checkSlug, this);

        },

        _cancel : function () {

                // remove edit box
                var old = Wu.DomUtil.get('editor-projects-container-new');
                Wu.DomUtil.remove(old);

        },

        _confirm : function () {

                // get client vars
                var name = Wu.DomUtil.get('editor-project-name-new').value;
                var description = Wu.DomUtil.get('editor-project-description-new').value;
                var keywords = Wu.DomUtil.get('editor-project-keywords-new').value;
                
                var options = {
                        name : name,
                        description : description,
                        keywords : keywords
                }

                // create new project with options, and save
                var project = new Wu.Project(options);
                project._saveNew(); 
        },

        _create : function (item) {

                // create view
                var data = {
                        projectName : item.name || '',
                        projectLogo : item.header.logo || '',
                        uuid        : item.uuid 
                }
                var target = Wu.DomUtil.create('div', 'editor-projects-item');
                target.setAttribute('uuid', item.uuid);
                target.innerHTML = ich.editorProjectsItem(data);

                this._projects[item.uuid] = target;
                this._projectsContainer.appendChild(target);

                // add hook for edit button
                var editButton = Wu.DomUtil.get('project-edit-button-' + item.uuid);
                Wu.DomEvent.on(editButton, 'mousedown', this.toggleEdit, this);
                Wu.DomEvent.on(editButton, 'click', Wu.DomEvent.stop, this);
                
                // when clicking on project box               pass the Project as this
                Wu.DomEvent.on(target, 'click', this.select, Wu.app.Projects[item.uuid]);

        },

        toggleEdit : function (e) {

                // stop propagation
                if (e) { Wu.DomEvent.stop(e); }

                var uuid = e.target.getAttribute('uuid');
                var container = Wu.DomUtil.get('editor-project-edit-wrapper-' + uuid);
                var project = Wu.app.Projects[uuid];
                
                // close all other editors
                if (this._editorPane) Wu.DomUtil.remove(this._editorPane);

                // toggle edit mode
                this._editMode = !this._editMode;

                // close if second click
                if (!this._editMode) return;
                   
                // create editor div
                project._editorPane = this._editorPane = Wu.DomUtil.create('div', 'editor-project-edit-super-wrap');
                var html = ich.editorProjectEditWrapper({
                        'uuid' : uuid, 
                        'name' : project.name, 
                        'description' : project.description,
                        'keywords' : project.keywords
                });
                project._editorPane.innerHTML = html;

                // find out if project elem is odd or even in list
                var i = this._projects[uuid].parentNode.childNodes;
                for (var n = 0; n < i.length; n++) {
                        if (i[n].getAttribute('uuid') == uuid) {
                                var num = n;
                                var odd = num % 2;
                        }
                }

                // insert editor into list
                if (!odd) {
                        // get referencenode
                        var refnum = parseInt(num) + 1;
                        if (refnum > i.length-1) refnum = i.length-1;
                        var referenceNode = i[refnum];

                        // insert editor div
                        referenceNode.parentNode.insertBefore(project._editorPane, referenceNode.nextSibling);
                        Wu.DomUtil.addClass(project._editorPane, 'left');
                
                } else {
                        // get referencenode
                        var refnum = num;
                        var referenceNode = i[refnum];

                        // insert editor div
                        referenceNode.parentNode.insertBefore(project._editorPane, referenceNode.nextSibling);
                        Wu.DomUtil.addClass(project._editorPane, 'right');
                }


                // get elements
                this._editName = Wu.DomUtil.get('editor-project-name-' + uuid);
                this._editDescription = Wu.DomUtil.get('editor-project-description-' + uuid);
                this._editKeywords = Wu.DomUtil.get('editor-project-keywords-' + uuid);
                this._deleteButton = Wu.DomUtil.get('editor-project-delete-' + uuid);


                // add hooks
                Wu.DomEvent.on(this._editName, 'keydown blur', function (e) {
                        this.autosave(project, 'name');
                }, this);

                Wu.DomEvent.on(this._editDescription, 'keydown blur', function (e) {    // todo: will drop save sometimes if blur < 500ms
                        this.autosave(project, 'description');
                }, this);

                Wu.DomEvent.on(this._editKeywords, 'keydown blur', function (e) {
                        this.autosave(project, 'keywords');
                }, this);

                Wu.DomEvent.on(this._deleteButton, 'mousedown', function (e) {
                        this._delete(project);
                }, this);

        },

        _delete : function (project) {
                
                // confirm dialogue, todo: create stylish confirm
                if (confirm('Are you sure you want to delete project "' + project.name + '"?')) {    
                
                        // delete project object
                        project._delete();
                
                        // delete in DOM
                        var del = this._projects[project.uuid];
                        Wu.DomUtil.remove(del);
                        if (this._editorPane) Wu.DomUtil.remove(this._editorPane);
                }

        },

        autosave : function (project, key) {
                var that = this;
                clearTimeout(this._saving);

                // save after 500ms of inactivity
                this._saving = setTimeout(function () {
                        that.saveText(project, key);
                }, 500);

        },

        saveText : function (project, key) {
                project[key] = Wu.DomUtil.get('editor-project-' + key + '-' + project.uuid).value;
                project._update(key);
        },


        _created : function (project, json) {

                var editor = Wu.app.SidePane.Projects;
                var options = JSON.parse(json);
               
                // update Project object
                Wu.extend(project, options);
                Wu.app.Projects[project.uuid] = project;

                // remove edit box
                var old = Wu.DomUtil.get('editor-projects-container-new');
                Wu.DomUtil.remove(old);
                
                // create client in DOM
                editor._create(project);
               
                // set active
                project.setActive();

                // set parent client
                Wu.app._activeClient.projects.push(project.uuid);
                Wu.app._activeClient.update('projects');
                console.log('updated parent client::::', Wu.app._activeClient)
        }


});














         










/*
 /$$      /$$                    
| $$$    /$$$                    
| $$$$  /$$$$  /$$$$$$   /$$$$$$ 
| $$ $$/$$ $$ |____  $$ /$$__  $$
| $$  $$$| $$  /$$$$$$$| $$  \ $$
| $$\  $ | $$ /$$__  $$| $$  | $$
| $$ \/  | $$|  $$$$$$$| $$$$$$$/
|__/     |__/ \_______/| $$____/ 
                       | $$      
                       | $$      
                       |__/      
*/// Map
Wu.SidePane.Map = Wu.SidePane.Item.extend({

        type : 'map',

        initContent : function () {

                // shorthand 
                this.app = Wu.app;

                // content to template
                this._container.innerHTML = ich.editorMapBaseLayer();
          
                // set panes
                this._panes = {};

                // map baselayer
                this._panes.baselayerWrap = Wu.DomUtil.get('editor-map-baselayer-wrap');

                // map bounds
                this._panes.bounds           = Wu.DomUtil.get('editor-map-bounds');
                this._panes.boundsNELatValue = Wu.DomUtil.get('editor-map-bounds-NE-lat-value');
                this._panes.boundsNELngValue = Wu.DomUtil.get('editor-map-bounds-NE-lng-value');
                this._panes.boundsSWLatValue = Wu.DomUtil.get('editor-map-bounds-SW-lat-value');
                this._panes.boundsSWLngValue = Wu.DomUtil.get('editor-map-bounds-SW-lng-value');

                // map position
                this._panes.initPos             = Wu.DomUtil.get('editor-map-initpos-button');
                this._panes.initPosLatValue     = Wu.DomUtil.get('editor-map-initpos-lat-value');
                this._panes.initPosLngValue     = Wu.DomUtil.get('editor-map-initpos-lng-value');
                this._panes.initPosZoomValue    = Wu.DomUtil.get('editor-map-initpos-zoom-value');

                // map controls
                this._panes.controlsWrap                =  Wu.DomUtil.get('editor-map-controls-wrap').parentNode.parentNode;
                this._panes.controlZoom                 =  Wu.DomUtil.get('map-controls-zoom').parentNode.parentNode;
                this._panes.controlDraw                 =  Wu.DomUtil.get('map-controls-draw').parentNode.parentNode;
                this._panes.controlInspect              =  Wu.DomUtil.get('map-controls-inspect').parentNode.parentNode;
                this._panes.controlDescription          =  Wu.DomUtil.get('map-controls-description').parentNode.parentNode;
                this._panes.controlLayermenu            =  Wu.DomUtil.get('map-controls-layermenu').parentNode.parentNode;
                this._panes.controlLegends              =  Wu.DomUtil.get('map-controls-legends').parentNode.parentNode;
                this._panes.controlMeasure              =  Wu.DomUtil.get('map-controls-measure').parentNode.parentNode;
                this._panes.controlGeolocation          =  Wu.DomUtil.get('map-controls-geolocation').parentNode.parentNode;
                this._panes.controlVectorstyle          =  Wu.DomUtil.get('map-controls-vectorstyle').parentNode.parentNode;
                this._panes.controlMouseposition        =  Wu.DomUtil.get('map-controls-mouseposition').parentNode.parentNode;
        },

        _activate : function () {
                Wu.SidePane.Item.prototype._activate.call(this);
                this._update();

        },

        addHooks : function () {
                Wu.SidePane.Item.prototype.addHooks.call(this)

                // click event on buttons
                Wu.DomEvent.on( this._panes.bounds,   'click', this._setBounds,    this );
                Wu.DomEvent.on( this._panes.initPos,  'click', this._setInitPos,   this );
               
                // css effects on buttons
                Wu.DomEvent.on( this._panes.initPos,  'mousedown',      this._buttonMouseDown,  this );
                Wu.DomEvent.on( this._panes.initPos,  'mouseup',        this._buttonMouseUp,    this );
                Wu.DomEvent.on( this._panes.initPos,  'mouseleave',     this._buttonMouseUp,    this );
                Wu.DomEvent.on( this._panes.bounds,   'mousedown',      this._buttonMouseDown,  this );
                Wu.DomEvent.on( this._panes.bounds,   'mouseup',        this._buttonMouseUp,    this );
                Wu.DomEvent.on( this._panes.bounds,   'mouseleave',     this._buttonMouseUp,    this );

                /// map controls
                Wu.DomEvent.on( this._panes.controlZoom,        'mousedown click', this.toggleControl, this);
                Wu.DomEvent.on( this._panes.controlDraw,        'mousedown click', this.toggleControl, this);
                Wu.DomEvent.on( this._panes.controlInspect,     'mousedown click', this.toggleControl, this);
                Wu.DomEvent.on( this._panes.controlDescription, 'mousedown click', this.toggleControl, this);
                Wu.DomEvent.on( this._panes.controlLayermenu,   'mousedown click', this.toggleControl, this);
                Wu.DomEvent.on( this._panes.controlLegends,     'mousedown click', this.toggleControl, this);
                Wu.DomEvent.on( this._panes.controlMeasure,     'mousedown click', this.toggleControl, this);
                Wu.DomEvent.on( this._panes.controlGeolocation, 'mousedown click', this.toggleControl, this);
                Wu.DomEvent.on( this._panes.controlVectorstyle, 'mousedown click', this.toggleControl, this);
                Wu.DomEvent.on( this._panes.controlMouseposition, 'mousedown click', this.toggleControl, this);

        },

        toggleControl : function (e) {
                
                // prevent default checkbox behaviour
                if (e.type == 'click') {
                        Wu.DomEvent.stop(e);
                        return;
                }
                
                // get type (zoom, draw, etc.)
                var item = e.target.getAttribute('which');

                // get checkbox
                var target = Wu.DomUtil.get('map-controls-' + item);

                // do action (eg. toggleControlDraw);
                var on = !target.checked;
                var enable = 'enable' + item.camelize();
                var disable = 'disable' + item.camelize();

                // toggle
                if (on) {
                        console.log('enable: ', enable);
                        // enable control on map
                        Wu.app.MapPane[enable]();

                        // enable control in menu
                        this.enableControl(item);
                } else {
                        
                        // disable control on map
                        Wu.app.MapPane[disable]();
                        
                        // disable control in menu
                        this.disableControl(item);
                }

                // save changes to project
                this.project.controls[item] = on;
                this.project._update('controls');

        },


        disableControl : function (type) {
                
                // get vars
                var target = Wu.DomUtil.get('map-controls-' + type); // checkbox
                var parent = Wu.DomUtil.get('map-controls-title-' + type).parentNode; // div that gets .active 
                var map = Wu.app._map;  // map

                // toggle check and active class
                Wu.DomUtil.removeClass(parent, 'active');
                target.checked = false;
        },

        enableControl : function (type) {
                
                // get vars
                var target = Wu.DomUtil.get('map-controls-' + type); // checkbox
                var parent = Wu.DomUtil.get('map-controls-title-' + type).parentNode; // div that gets .active 
                var map = this.app._map;  // map

                // toggle check and active class
                Wu.DomUtil.addClass(parent, 'active');
                target.checked = true;
        },

    


        _buttonMouseDown : function (e) {
                Wu.DomUtil.addClass(e.target, 'btn-info');
        },

        _buttonMouseUp : function (e) {
                Wu.DomUtil.removeClass(e.target, 'btn-info');
        },

        _setUrl : function (e) {

                // get actual Project object
                var project = Wu.app._activeProject;

                // if no active project, do nothing
                if (!project) { console.log('_activeProejct == undefined'); return; }

                var url = e.target.value;
                console.log('url: ', url);
                project.map.baseLayer.url = url;

                project._update('map');

        },

        _setProvider : function (e) {
                console.log('set provider');
                console.log(e);

                // get actual Project object
                var project = Wu.app._activeProject;

                // if no active project, do nothing
                if (!project) { console.log('_activeProejct == undefined'); return; }

                var prov = e.target.value;

                project.map.baseLayer.provider = prov;
                project._update('map');

        },

        _setTileType : function (e) {
                console.log('set tiletype');
                console.log(e);

                // get actual Project object
                var project = Wu.app._activeProject;

                // if no active project, do nothing
                if (!project) { console.log('_activeProejct == undefined'); return; }
                
                

                // get/set value for checkbox
                if (e.target.checked) {
                        var type = 'vector';
                } else {
                        
                        var type = 'raster';
                        
                        // set TMS for homemade raster
                        project.map.baseLayer.tms = true;
                }

                console.log('YTPE NOW::', type);

                project.map.baseLayer.type = type;
                project._update('map');

        },

       
        _setBounds : function (e) {
                
                // get actual Project object
                var project = Wu.app._activeProject;

                // if no active project, do nothing
                if (!project) { console.log('_activeProejct == undefined'); return; }

                var bounds = Wu.app._map.getBounds();
                var zoom = Wu.app._map.getZoom();

                // write directly to Project
                project.map.bounds = {
                        northEast : {
                                lat : bounds._northEast.lat,
                                lng: bounds._northEast.lng
                        },

                        southWest : {
                                lat : bounds._southWest.lat,
                                lng : bounds._southWest.lng
                        }
                }

                // call save on Project
                project._update('map');

                // call update on view
                this.updateContent();

        },

        _setInitPos : function (e) {

                // get actual Project object
                var project = Wu.app._activeProject;

                // if no active project, do nothing
                if (!project) { console.log('_activeProejct == undefined'); return; }

                // get center and zoom
                var center = Wu.app._map.getCenter();
                var zoom = Wu.app._map.getZoom();

                // write directly to Project
                project.map.initPos = {
                        lat : center.lat,
                        lng : center.lng,
                        zoom : zoom
                }
        
                // call update on Project
                project._update('map');

                // call update on view
                this.updateContent();

        },

        updateContent : function () {
                // update view
                this._update();
        },

        _resetView : function () {

                // reset buttons ?
                //Wu.DomUtil.removeClass(this._panes.bounds,'btn-info');
                //Wu.DomUtil.removeClass(this._panes.initPos,'btn-info');
        },


        _updateBaselayer : function () {

                // create custom select box
                var ret = this.insertSelect(this._panes.baselayerWrap);
                var tit = ret.tit;
                var w = ret.w;

                // set active baselayer
                var cur = this.project.map.baseLayer.url;
               
                // for each mapbox file
                // if (this.project.mapboxFiles) { // todo, remove this if
                //         for (file in this.project.mapboxFiles) {

                this.project.mapboxLayers.forEach(function (f) {

                        //var f =  this.project.mapboxFiles[file];
                        var elem = Wu.DomUtil.create('div', 'select-elem', w);
                        elem.innerHTML = f.name;
                        elem.setAttribute('uuid', f.id);
                        elem.setAttribute('type', 'mapbox');

                        Wu.DomEvent.on(elem, 'mousedown', function (e) {
                                tit.innerHTML = e.target.innerHTML;
                                tit.setAttribute('active', false);
                                w.style.display = 'none';

                                this.setBaseLayer('mapbox', e.target.getAttribute('uuid'));
                        }, this);

                        // set name of current baselayer in title
                        console.log('cur: ' + cur + ' | fid: ' + f.id);
                        if (cur == f.id) { tit.innerHTML = f.name;  }


                }, this);
                
                //         };
                // }       

                 // // for each datalib file
                // this.project.files.forEach(function (file, i, arr) {
                //         var elem = Wu.DomUtil.create('div', 'select-elem', w);
                //         elem.innerHTML = file.name;
                //         elem.setAttribute('uuid', file.uuid);
                //         elem.setAttribute('type', 'datalibrary');

                //         Wu.DomEvent.on(elem, 'mousedown', function (e) {
                //                 tit.innerHTML = elem.innerHTML;
                //                 tit.setAttribute('active', false);
                //                 w.style.display = 'none';

                //                 this.setBaseLayer('datalibrary', file.uuid);
                //         }, this);

                //         // set name of current baselayer in title
                //         console.log('cur: ' + cur + ' | fid: ' + file.uuid);
                //         if (cur == file.uuid) { tit.innerHTML = file.name;  }

                // }, this)
                


        },


        _update : function () {

                // use active project
                this.project = Wu.app._activeProject;

                // update view of this project
                var b = this.project.map.bounds;

                // debug, assure this.project.controls exists
                if (!Wu.Util.isObject(this.project.controls)) {    
                        this.project.controls = {};
                } 
                
                // update baselayer box
                this._updateBaselayer();
                
                // bounds
                this._panes.boundsNELatValue.value = b.northEast.lat;
                this._panes.boundsNELngValue.value = b.northEast.lng;
                this._panes.boundsSWLatValue.value = b.southWest.lat;
                this._panes.boundsSWLngValue.value = b.southWest.lng;

                // init position
                this._panes.initPosLatValue.value = this.project.map.initPos.lat;
                this._panes.initPosLngValue.value = this.project.map.initPos.lng;
                this._panes.initPosZoomValue.value = this.project.map.initPos.zoom;

                // controls
                this._updateControls();

        },

        _updateControls : function () {

                for (c in this.project.controls) {
                        var on = this.project.controls[c];
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


        setBaseLayer : function (type, uuid) {
                console.log('setting baselayer: ', type, uuid);

                // set values
                this.project.map.baseLayer.url = uuid;
                this.project.map.baseLayer.provider = type;
                this.project._update();

                // set it on the map
                Wu.app.MapPane.setBaseLayer(this.project);

                // save
                this.project._update('map');
        },



        insertSelect : function (wrapper) {
                wrapper.innerHTML = '<h4>Base Layer </h4>';
                var div = Wu.DomUtil.createId('div', 'select-baselayer-wrap', wrapper);
                Wu.DomUtil.addClass(div, 'select-wrap');
                var tit = Wu.DomUtil.create('div', 'select-title', div);
                tit.innerHTML = 'Select layer';
                var w = Wu.DomUtil.create('div', 'select-elems', div);

                // dropdown button
                var btn = Wu.DomUtil.create('div', 'select-baselayer dropdown-button', div);

                // on off click on title
                Wu.DomEvent.on(btn, 'mousedown', function (e) {
                        var ac = tit.getAttribute('active');
                        if (ac == 'true') {
                                tit.setAttribute('active', false);
                                w.style.display = 'none';
                        } else {
                                tit.setAttribute('active', true);
                                w.style.display = 'block';
                        }
                }, this);

                var ret = {};
                ret.tit = tit;
                ret.w = w;
                return ret;
                
        }
});





/*
 /$$$$$$$                                                                    /$$             
| $$__  $$                                                                  | $$             
| $$  \ $$  /$$$$$$   /$$$$$$$ /$$   /$$ /$$$$$$/$$$$   /$$$$$$  /$$$$$$$  /$$$$$$   /$$$$$$$
| $$  | $$ /$$__  $$ /$$_____/| $$  | $$| $$_  $$_  $$ /$$__  $$| $$__  $$|_  $$_/  /$$_____/
| $$  | $$| $$  \ $$| $$      | $$  | $$| $$ \ $$ \ $$| $$$$$$$$| $$  \ $$  | $$   |  $$$$$$ 
| $$  | $$| $$  | $$| $$      | $$  | $$| $$ | $$ | $$| $$_____/| $$  | $$  | $$ /$$\____  $$
| $$$$$$$/|  $$$$$$/|  $$$$$$$|  $$$$$$/| $$ | $$ | $$|  $$$$$$$| $$  | $$  |  $$$$//$$$$$$$/
|_______/  \______/  \_______/ \______/ |__/ |__/ |__/ \_______/|__/  |__/   \___/ |_______/ 
                                                                                                                                                                                       
*/

// DocumentsPane
Wu.SidePane.Documents = Wu.SidePane.Item.extend({
        
        type : 'documents',
        title : 'Documents',

       

        initContent : function () {

                // create new fullscreen page, and set as default content
                this._content = Wu.DomUtil.create('div', 'fullpage-documents', Wu.app._appPane);
                
                // create container (overwrite default)
                this._container = Wu.DomUtil.create('div', 'editor-wrapper', this._content);

                // insert template
                this._container.innerHTML = ich.documentsContainer();

                // get element handlers
                this._leftpane = Wu.DomUtil.get('documents-container-leftpane');
                this._folderpane = Wu.DomUtil.get('documents-folder-list');
                this._rightpane = Wu.DomUtil.get('documents-container-rightpane');
                this._textarea = Wu.DomUtil.get('documents-container-textarea');
                this._newfolder = Wu.DomUtil.get('documents-new-folder');

        },

        initFolders : function () {

                this.folders = {};
                var folders = this.project.folders;

                // init local folder object
                folders.forEach(function (folder, i, arr) {
                        this.folders[folder.uuid] = folder;
                }, this);

        },

        addHooks : function () {

                // new folder
                Wu.DomEvent.on( this._newfolder, 'mousedown', this.newFolder, this );

                // bind grande.js text editor
                grande.bind([this._textarea]);
                this.expandGrande();

        },

        expandGrande : function () {

                // add file attachment to grande
                var g = document.getElementsByClassName('g-body')[0];
                var list = g.children[0].children[0].children[0].children[0];
                var gwrap = g.children[0];

                var btn = Wu.DomUtil.create('button', 'file url');
                var selwrap = Wu.DomUtil.create('div', 'grande-project-files-wrap');
                var selbtn = Wu.DomUtil.create('div', 'grande-project-files-btn');
                var files = Wu.DomUtil.create('select', 'grande-project-files');
                selwrap.appendChild(files);
                selwrap.appendChild(selbtn);
                
                btn.innerHTML = 'F';
                list.appendChild(btn);
                list.appendChild(selwrap);


                // get elems
                this._grandeFiles = list;
                this._grandeFilesBtn = btn;
                this._grandeFilesSelect = files;
                this._grandeInsertBtn = selbtn;
                this._grandeFilesWrap = selwrap;
                this._grandeWrap = gwrap;

                // hook
                Wu.DomEvent.on(btn, 'mousedown', this.attachFile, this);

        },

        attachFile : function () {

                console.log('text selll:::::');
                console.log(window.getSelection());

                // get the text node and actual text
                this.textSelection = window.getSelection();
                range = this.textSelection.getRangeAt(0);
                this.textSelectionText = range.cloneContents().firstChild.data;
                console.log('actual text:: ', this.textSelectionText);

                // show file select n button
                this._grandeFilesWrap.style.display = 'block';

                // fill select with files
                var sel = this._grandeFilesSelect;
                sel.innerHTML = ''; // reset
                this.project.files.forEach(function (file, i, arr) {
                        sel.options[sel.options.length] = new Option(file.name, file.uuid);
                }, this)

                //Wu.DomEvent.on(sel, 'blur', this.selectedFile, this);
                Wu.DomEvent.on(this._grandeInsertBtn, 'mousedown', this.selectedFile, this);

        },

        replaceSelection : function (link, text) {

                var range;
                if (this.textSelection.getRangeAt) {
                        range = this.textSelection.getRangeAt(0);
                        range.deleteContents();
                        var a = document.createElement('a');
                        a.innerHTML = text;
                        a.href = link;
                        range.insertNode(a);
                } // https://stackoverflow.com/questions/6251937/how-to-get-selecteduser-highlighted-text-in-contenteditable-element-and-replac     
        },

        selectedFile : function (e) {

                // get selected option
                var sel = this._grandeFilesSelect;
                var fuuid = sel.options[sel.selectedIndex].value;
                var name = sel.options[sel.selectedIndex].text;

                console.log('remember?');
                console.log('fuuid: ', fuuid);
                console.log('name: ', name);
                console.log(window.getSelection());

                // hide file select n button
                this._grandeFilesWrap.style.display = 'none';
                Wu.DomUtil.removeClass(this._grandeWrap, 'active');
                Wu.DomUtil.addClass(this._grandeWrap, 'hide');


                // create link to file (direct download)
                var link = '/api/file/download?file=' + fuuid;

                // insert link
                this.replaceSelection(link, this.textSelectionText);

                // save
                this.saveText();

        },
         
        _activate : function (e) {                
                Wu.SidePane.Item.prototype._activate.call(this);

                // set top
                this.adjustTop();

                // set width
                this.adjustWidth();
               
                // turn off header resizing and icon
                Wu.app.HeaderPane.disableResize();

                // select first title (create fake e object)
                if (this.project.folders.length > 0) {
                        var e = { 'target' : { 'uuid' : this.project.folders[0].uuid }, preventDefault : Wu.Util.falseFn};
                        this.selectFolder(e);
                }
        },

        deactivate : function () {

                // turn off header resizing
                Wu.app.HeaderPane.enableResize();
        },

        adjustTop : function () {
                // debug, for innfelt header
                return;
                // make room for project header
                var project = Wu.app._activeProject;
                if (project) {
                        this._content.style.top = project.header.height + 'px';
                }

                // adjust top of left pane
                this._leftpane.style.top = '-' + project.header.height + 'px';
        },

        adjustWidth : function () {

//	Removed by Jørgen ~ Doing this with CSS, yo
//                this._rightpane.style.width = parseInt(window.innerWidth) - 400 + 'px';
//                this._textarea.style.width = parseInt(window.innerWidth) - 400 + 'px';
        },

        update : function () {

                // use active project
                this.project = Wu.app._activeProject;

                // flush
                this.reset();

                // set folders
                this.createFolders();

                // set top
                this.adjustTop();

                // set width
                this.adjustWidth();

        },

        updateContent : function () {  

                // reset text pane
                this._textarea.innerHTML = '';

                // update         
                this.update();
        },

        newFolder : function () {

                var folder = {
                        'title' : 'Title',
                        'uuid' : Wu.Util.guid('folder'),
                        'content' : 'Text content'
                }

                // update 
                this.project.folders.push(folder);

                // refresh
                this.update();

        },

        createFolders : function () {

                // set folders
                var folders = this.project.folders;

                // create each folder headline
                folders.forEach(function (elem, i, arr) {

                        var folder = elem;
                        folder.el = Wu.DomUtil.create('input', 'documents-folder-item', this._folderpane);
                        folder.el.value = folder.title;
                        folder.el.setAttribute('readonly', 'readonly');
                        folder.el.uuid = folder.uuid;
                       
                        // set hooks
                        Wu.DomEvent.on( folder.el,  'mousedown', this.selectFolder, this );     // select folder
                        Wu.DomEvent.on( folder.el,  'dblclick', this.renameFolder, this );     // select folder

                        // update object
                        this.folders[folder.uuid] = folder;

                }, this);
               



        },

        renameFolder : function (e) {

                // get folder
                var uuid = e.target.uuid;
                var folder = this.folders[uuid];

                // enable editing on input box
                e.target.removeAttribute('readonly'); 
                e.target.focus();

                // save on blur or enter
                Wu.DomEvent.on( e.target,  'blur', this.titleBlur, this );     // save folder title
                Wu.DomEvent.on( e.target,  'keydown', this.titleKey, this );     // save folder title

        },

        titleKey : function (e) {

                // blur on enter
                if (event.which == 13 || event.keyCode == 13) {
                        this.titleBlur();
                }
        },


        titleBlur : function () {

                for (f in this.folders) {
                        var folder = this.folders[f];
                        folder.el.setAttribute('readonly', 'readonly');
                        this.folders[folder.uuid].title = folder.el.value;
                }                                                                                                                                                                                              

                // save
                this._save();

        },

        selectFolder : function (e) {

                e.preventDefault();

                // get folder
                var uuid = e.target.uuid;
                var folder = this.folders[uuid];

                // clear rightpane
                this._textarea.innerHTML = '';
                this._textarea.innerHTML = folder.content;
                this._textarea.fuuid = uuid;
                
                // adjust width
                this.adjustWidth();

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
                if (f == text) { return; }
                
                // update folder object 
                this.folders[this._textarea.fuuid].content = text;
                
                // save
                this._save();
        },

        // save to server
        _save : function () {
                var folders = this.folders;
                
                // convert to array
                this.project.folders = [];
                for (f in folders) {
                        var fo = Wu.extend({}, folders[f]);     // clone 
                        delete fo.el;                           // delete .el on clone only
                        this.project.folders.push(fo);          // update project.folders
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
$$\   $$\                                         
$$ |  $$ |                                        
$$ |  $$ | $$$$$$$\  $$$$$$\   $$$$$$\   $$$$$$$\ 
$$ |  $$ |$$  _____|$$  __$$\ $$  __$$\ $$  _____|
$$ |  $$ |\$$$$$$\  $$$$$$$$ |$$ |  \__|\$$$$$$\  
$$ |  $$ | \____$$\ $$   ____|$$ |       \____$$\ 
\$$$$$$  |$$$$$$$  |\$$$$$$$\ $$ |      $$$$$$$  |
 \______/ \_______/  \_______|\__|      \_______/ 
                                                  
*/
Wu.SidePane.Users = Wu.SidePane.Item.extend({

        type : 'users',
        title : 'Users',

        initContent : function () {

                // create new fullscreen page, and set as default content
                this._content = Wu.DomUtil.create('div', 'fullpage-users', Wu.app._appPane);
                
                // create container (overwrite default)
                this._container = Wu.DomUtil.create('div', 'editor-wrapper', this._content);

                // insert template
                this._container.innerHTML = ich.usersPane();

                // get handles
                this._tableContainer = Wu.DomUtil.get('users-table-container');

                // render empty table
                this._tableContainer.innerHTML = ich.usersTableFrame();

                // get more handles
                this._table = Wu.DomUtil.get('users-insertrows');
                this._addUser = Wu.DomUtil.get('users-add-user');
                this._checkall = Wu.DomUtil.get('users-checkbox-all');
                this._checkallLabel = Wu.DomUtil.get('label-users-checkbox-all');

                // init table
                this.initList();


        },

        // hooks added automatically on page load
        addHooks : function () {
               
                // delete button
                Wu.DomEvent.on(this._addUser, 'mousedown', this.addUser, this);

                // check all button
                Wu.DomEvent.on(this._checkallLabel, 'mousedown', this.checkAll, this);
               
        },

        // fired when different sidepane selected, for clean-up
        deactivate : function () {
                console.log('deactive users');
                
        },

        addUser : function () {
                console.log('addUser');

        },

        checkAll : function () {
                console.log('checkAll');


        },

        // list.js plugin
        initList : function () { 
                
                // add dummy entry
                var tr = Wu.DomUtil.createId('tr', 'dummy-table-entry');
                tr.innerHTML = ich.datalibraryTablerow({'type' : 'dummy-table-entry'});
                this._table.appendChild(tr);

                // init list.js
                var options = { valueNames : ['name', 'company', 'position', 'phone', 'email', 'projects'] };
                this.list = new List('userslist', options);

                // remove dummy
                this.list.clear();
        },

        updateContent : function () {
                this.update();
        },

        update : function () {

                // use active client
                this.client = Wu.app._activeClient;

                // flush
                this.reset();

                // refresh table entries
                this.refreshTable();
        },


        // get data about users for this client from server
        // TODO: refactor into json / but safest like this for now
        getUsersData : function () {

                var data = JSON.stringify({
                        clientUuid : this.client.uuid
                });

                // post         path          json      callback    this
                Wu.post('/api/client/users', data, this.gotUsers, this);

        },

        gotUsers : function (that, users) {
                console.log('gotUsers: ', users);

                // update table
                that.client.users = users;
                that._refreshTable();


        },

        refreshTable : function () {
                console.log('refreshTable');
                
                // get the users for this client from server
                this.getUsersData();

               
        },

        _refreshTable : function () {

                // return if empty filelist
                if (!this.client.users) { 
                        console.log('refreshTable: no clients!');
                        return; 
                }

                // // enter files into table
                // this.client.users.forEach(function (user, i, arr) {
                //         console.log('forEach user: ', user);
                //         this.addTableItem(user);
                // }, this);

                // // sort list by name by default
                // this.list.sort('name', {order : 'asc'});

        },

        reset : function () {

                // clear table
                this.list.clear();

        },

        addTableItem : function (user) {

                // clone file object
                var tmp = Wu.extend({}, user);   
                
                // // add record (a bit hacky, but with a cpl of divs inside the Name column)
                // tmp.name = ich.usersTablerowName({
                //         name : tmp.name || 'Title',
                //         description : tmp.description || 'Description',
                //         nameUuid : 'name-' + tmp.uuid,
                //         descUuid : 'description-' + tmp.uuid,
                // });

                // // clean arrays
                // tmp.files = tmp.files.join(', ');
                // tmp.keywords = tmp.keywords.join(', ');
                // tmp.createdDate = new Date(tmp.createdDate).toDateString();

                // // add file to list.js
                // var ret = this.list.add(tmp);
                
                // // hack: manually add uuids
                // ret[0].elm.id = tmp.uuid;                              // <tr>
                // var c = ret[0].elm.children[0].children[0].children;    
                // c[0].id = 'checkbox-' + tmp.uuid;                      // checkbox
                // c[1].setAttribute('for', 'checkbox-' + tmp.uuid);      // label

                // add hooks for editing
                this.addEditHooks(tmp.uuid);
        },

        addEditHooks : function (uuid) {

                // // get <input>'s
                // var title = Wu.DomUtil.get('name-' + uuid);
                // var desc = Wu.DomUtil.get('description-' + uuid);

                // // set click hooks on title and description
                // Wu.DomEvent.on( title,  'mousedown mouseup click', this.stop, this ); 
                // Wu.DomEvent.on( title,  'dblclick', this.rename, this );     // select folder
                // Wu.DomEvent.on( desc,  'mousedown mouseup click', this.stop, this ); 
                // Wu.DomEvent.on( desc,  'dblclick', this.rename, this );     // select folder

        },




});


/*
 /$$$$$$$              /$$               /$$       /$$ /$$                                             
| $$__  $$            | $$              | $$      |__/| $$                                             
| $$  \ $$  /$$$$$$  /$$$$$$    /$$$$$$ | $$       /$$| $$$$$$$   /$$$$$$  /$$$$$$   /$$$$$$  /$$   /$$
| $$  | $$ |____  $$|_  $$_/   |____  $$| $$      | $$| $$__  $$ /$$__  $$|____  $$ /$$__  $$| $$  | $$
| $$  | $$  /$$$$$$$  | $$      /$$$$$$$| $$      | $$| $$  \ $$| $$  \__/ /$$$$$$$| $$  \__/| $$  | $$
| $$  | $$ /$$__  $$  | $$ /$$ /$$__  $$| $$      | $$| $$  | $$| $$      /$$__  $$| $$      | $$  | $$
| $$$$$$$/|  $$$$$$$  |  $$$$/|  $$$$$$$| $$$$$$$$| $$| $$$$$$$/| $$     |  $$$$$$$| $$      |  $$$$$$$
|_______/  \_______/   \___/   \_______/|________/|__/|_______/ |__/      \_______/|__/       \____  $$
                                                                                              /$$  | $$
                                                                                             |  $$$$$$/
                                                                                              \______/ 
*/

// DownloadsPane
Wu.SidePane.DataLibrary = Wu.SidePane.Item.extend({

        type : 'dataLibrary',
        title : 'Data Library',

        initContent : function () {

                // create new fullscreen page, and set as default content
                this._content = Wu.DomUtil.create('div', 'data-library', Wu.app._appPane);
                
                // create container (overwrite default)
                this._container = Wu.DomUtil.create('div', 'editor-wrapper', this._content);

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
                this._table = Wu.DomUtil.get('datalibrary-insertrows');
                this._errors = Wu.DomUtil.get('datalibrary-errors');
                this._uploader = Wu.DomUtil.get('upload-container');
                this._deleter = Wu.DomUtil.get('datalibrary-delete-file');
                this._downloader = Wu.DomUtil.get('datalibrary-download-files');
                this._downloadList = Wu.DomUtil.get('datalibrary-download-dialogue');
                this._checkall = Wu.DomUtil.get('checkbox-all');
                this._checkallLabel = Wu.DomUtil.get('label-checkbox-all');

                // init table
                this.initList();

                // init dropzone
                this.initDZ();

                // init download table
                this.initDownloadTable();

        },

        // hooks added automatically on page load
        addHooks : function () {
               
                // delete button
                Wu.DomEvent.on(this._deleter, 'mousedown', this.deleteConfirm, this);

                // download button
                Wu.DomEvent.on(this._downloader, 'mousedown', this.downloadConfirm, this);

                // check all button
                Wu.DomEvent.on(this._checkallLabel, 'mousedown', this.checkAll, this);
               
        },

        deactivate : function () {

                console.log('deactive datalib');
                console.log(this.dz);
               
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
                                if (ch.checked) { ch.checked = false; }
                        }, this);


                } else {
                        // check all visible
                        var visible = this.list.visibleItems;
                        visible.forEach(function (item, i, arr) {
                                var ch = item.elm.children[0].childNodes[1].children[0];

                                // check
                                if (!ch.checked) { ch.checked = true; }
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
                        'puuid' : this.project.uuid,
                        'pslug' : this.project.slug
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
                this.project.files.forEach(function(file, i, arr) {
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
                if (checks.length == 0) { return; }

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
                        for (i = this.project.files.length - 1; i >= 0; i -= 1) {
                        //this.project.files.forEach(function(f, i, a) {
                                if (this.project.files[i].uuid == file.uuid) {
                                        this.project.files.splice(i, 1);
                                }
                        };

                        // remove from layermenu                // todo: remove from actual menu div too
                        // DO use a reverse for-loop:
                        var i;
                        for (i = this.project.layermenu.length - 1; i >= 0; i -= 1) {
                                if (this.project.layermenu[i].fuuid == file.uuid) {
                                        this.project.layermenu.splice(i, 1);
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
                    'puuid' : this.project.uuid
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
                this.dz.options.params.project = this.project.uuid;

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
                if (t == this._fulldrop) {
                        this.fulldropOff(e);
                }
                
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
                console.log('uploaded:');
                console.log('file: ', record);

                // handle errors
                if (record.errors.length > 0) {
                        this.handleError(record.errors);
                }

                // return if nothing
                if (!record.files) { return; }

                // add
                record.files.forEach(function (file, i, arr) {
                        // add to table
                        this.addFile(file);
 
                        // add to project locally (already added on server)
                        this.project.files.push(file);
                }, this);

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
                
                // hack: manually add uuids
                ret[0].elm.id = tmp.uuid;                              // <tr>
                var c = ret[0].elm.children[0].children[0].children;    
                c[0].id = 'checkbox-' + tmp.uuid;                      // checkbox
                c[1].setAttribute('for', 'checkbox-' + tmp.uuid);      // label

                // add hooks for editing
                this.addEditHooks(tmp.uuid);
        },

        addEditHooks : function (uuid) {

                // get <input>'s
                var title = Wu.DomUtil.get('name-' + uuid);
                var desc = Wu.DomUtil.get('description-' + uuid);

                // set click hooks on title and description
                Wu.DomEvent.on( title,  'mousedown mouseup click', this.stop, this ); 
                Wu.DomEvent.on( title,  'dblclick', this.rename, this );     // select folder
                Wu.DomEvent.on( desc,  'mousedown mouseup click', this.stop, this ); 
                Wu.DomEvent.on( desc,  'dblclick', this.rename, this );     // select folder

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

                // set key
                e.target.fieldKey = e.target.id.split('-')[0];

                // save on blur or enter
                Wu.DomEvent.on( e.target,  'blur', this.editBlur, this );     // save folder title
                Wu.DomEvent.on( e.target,  'keydown', this.editKey, this );     // save folder title

        },


        editKey : function (e) {

                // blur on enter
                if (event.which == 13 || event.keyCode == 13) {
                        e.target.blur();
                }
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
                this.project.files.forEach(function(file, i, arr) {

                        // iterate and find hit
                        if (file.uuid == fuuid) {
                                file[key] = value;
                        }

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
                this.project.files.forEach(function(file, i, arr) {
                     
                        // iterate and find hit
                        if (file.uuid == fuuid) {

                                // create update object
                                var json = {};
                                json[key] = file[key];
                                json.uuid = file.uuid;

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
                this.project = Wu.app._activeProject;

                // flush
                this.reset();

                // refresh dropzone
                this.refreshDZ();

                // refresh table entries
                this.refreshTable();
        },

        refreshTable : function () {

                // return if empty filelist
                if (!this.project.files) { return; }

                // enter files into table
                this.project.files.forEach(function (file, i, arr) {
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






/*
 /$$   /$$                           /$$                    
| $$  | $$                          | $$                    
| $$  | $$  /$$$$$$   /$$$$$$   /$$$$$$$  /$$$$$$   /$$$$$$ 
| $$$$$$$$ /$$__  $$ |____  $$ /$$__  $$ /$$__  $$ /$$__  $$
| $$__  $$| $$$$$$$$  /$$$$$$$| $$  | $$| $$$$$$$$| $$  \__/
| $$  | $$| $$_____/ /$$__  $$| $$  | $$| $$_____/| $$      
| $$  | $$|  $$$$$$$|  $$$$$$$|  $$$$$$$|  $$$$$$$| $$      
|__/  |__/ \_______/ \_______/ \_______/ \_______/|__/      
*/
// Header
// Wu.SidePane.Header = Wu.SidePane.Item.extend({

//         type : 'header',

//         updateContent : function (project) {

//                 // reset view
//                 this._resetView();

//                 // update values
//                 this._updateModel(project);

//                 // update view
//                 this._updateView();

//         },

//         _updateModel : function (project) {

//                 this._header = project.header; 
//                 this._data = {
//                         headerTitle : this._header.title,
//                         headerSubtitle : this._header.subtitle,
//                         headerLogo : this._header.logo,
//                         headerCss : this._header.css      
//                 }

//         },

//         _updateView : function () {                 
//                 this._container.innerHTML = ich.editorHeader(this._data);
//         },

//         _resetView : function () {

//                 this._container.innerHTML = '';
//         }

// });










// Wu.SidePane.Layers = Wu.SidePane.Item.extend({


//         type : 'layers',
//         title : 'Layers',


//         _initContent : function () {
//                 console.log('init sources');
                
//                 //this._update();

//         },

       

//         updateContent : function (project) {

//                 this._reset();

//                 this._update()

//                 console.log('SidePane.Sources updated');

//         },




// })

// /*
//   /$$$$$$                                                             
//  /$$__  $$                                                            
// | $$  \__/  /$$$$$$  /$$   /$$  /$$$$$$   /$$$$$$$  /$$$$$$   /$$$$$$$
// |  $$$$$$  /$$__  $$| $$  | $$ /$$__  $$ /$$_____/ /$$__  $$ /$$_____/
//  \____  $$| $$  \ $$| $$  | $$| $$  \__/| $$      | $$$$$$$$|  $$$$$$ 
//  /$$  \ $$| $$  | $$| $$  | $$| $$      | $$      | $$_____/ \____  $$
// |  $$$$$$/|  $$$$$$/|  $$$$$$/| $$      |  $$$$$$$|  $$$$$$$ /$$$$$$$/
//  \______/  \______/  \______/ |__/       \_______/ \_______/|_______/ 
// */
// // Sources
// Wu.SidePane.Sources = Wu.SidePane.Item.extend({

//         type : 'sources',
//         title : 'Layers',


//         _initContent : function () {
//                 console.log('init sources');
                
//                 //this._update();

//         },

       

//         updateContent : function (project) {

//                 this._reset();

//                 this._update()

//                 console.log('SidePane.Sources updated');

//         },

      
//         _update : function () {
//                 console.log('Sources update()');
               
//                 // reset first
//                 this._reset();

//                 // make containers
//                 this._make();

//                 // fill in with sources
//                 this._fill();

               
//         },

//          _reset : function () {
//                 if (this._dzPane) { Wu.DomUtil.remove(this._dzPane);}
//                 if (this._containerPane) { Wu.DomUtil.remove(this._containerPane); }
                

//                 this._dzPane = '';
//                 this._dz = '';
//                 this._sources = Wu.app.Sources;
//         },

//         add : function (source) {
//                 console.log('adding source');

//                 // add to user list 
//                 var div = this._create(source);
//                 Wu.DomUtil.addClass(div, 'new');        // debug
//                 this._userPane.appendChild(div);

//                 // // add to project list
//                 // var pdiv = this._create(source);
//                 // Wu.DomUtil.addClass(pdiv, 'new');       // debug
//                 // this._projectPane.appendChild(pdiv);
              
               
//         },


//         _make : function () {

//                 // create panes
//                 // dropzone
//                 this._dzPane = Wu.DomUtil.create('div', 'dropzone-pane', this._container);
//                 this._dzPane.innerHTML = 'Upload';
//                 this._dz = this._newDropzone(this._dzPane);

//                 // error container
//                 this._errorPane = Wu.DomUtil.create('div', 'sources-error-pane', this._container);
                
//                 // sources container
//                 this._containerPane = Wu.DomUtil.create('div', 'sources-pane', this._container);
                
//                 // user sources container
//                 this._userPane = Wu.DomUtil.create('div', 'sources-pane-user', this._containerPane);
                
//                 // project sources container
//                 //this._projectPane = Wu.DomUtil.create('div', 'sources-pane-project', this._containerPane);

               

//         },

//         _fill : function () {

//                 // fill user sources
//                 this._fillUserSources();

//                 // fill project sources
//                // this._fillProjectSources();

//                 // fill client sources
//                 // this._fillClientSources();

//         },

//         _fillUserSources : function () {

//                 // create file list
//                 for (s in this._sources) {
//                        var source = this._sources[s];    // Wu.Source's loaded earlier

//                        // create div for source in list
//                        var div = this._create(source);
                       
//                        // push div
//                        this._userPane.appendChild(div);
//                 }
//         },

//         // _fillProjectSources : function () {

//         //         var project = Wu.app._activeProject;
//         //         if (!project) { console.log('no project to fill in soruces from'); return;}
                
//         //         // create file list
//         //         for (s in this._sources) {
//         //                 var source = this._sources[s];    // Wu.Source's loaded earlier

//         //                 for (p in source.access.projects) {
//         //                         var uuid = source.access.projects[p];
//         //                         if (project.uuid == uuid) {
                
//         //                                 // create div for source in list
//         //                                 var div = this._create(source);
                               
//         //                                 // push div
//         //                                 this._projectPane.appendChild(div);
                                        

//         //                         }
//         //                 }
                       

                       
//         //         }
//         // },

//         _create : function (source) {
                
//                 console.log('_create source :::::::::::');
//                 console.log(source);

//                 // create div for source item
//                 var div = Wu.DomUtil.create('div', 'sources-item');      
//                 div.innerHTML = ich.editorSourcesItem(source);
//                 var id = 'source-' + source.uuid;
                
//                 // add as layer button
//                 if (source.type == 'geojson') {
//                         // add as layer button
//                         var button = Wu.DomUtil.create('div', 'sources-add-to-layer');
//                         button.innerHTML = 'Add as layer...';
//                         div.appendChild(button);

//                         // add hook
//                         Wu.DomEvent.on( button, 'mousedown', this._addLayer, source );
//                 }       



//                 // add file list
//                 var ul = Wu.DomUtil.createId('ul', id);
//                 div.appendChild(ul);
//                 var lis = [];
//                 for (file in source.files) {
//                         var f = {'file' : source.files[file]};
//                         lis.push(ich.editorSourcesFile(f));
//                 }

//                 ul.innerHTML = lis.join(' ');

//                 return div;
//         },


//         _newDropzone : function (pane) {
//                 var that = this;

//                 if ('_activeProject' in Wu.app) {
//                         console.log('param1');
//                         var params = {
//                                 'project' : Wu.app._activeProject.uuid
//                         } 
//                 } else {
//                         console.log('param2');
//                         var params = { 'project' : 'dickwad'};
//                 }
                

//                 var dz = new Dropzone(pane, {
//                                 url : '/api/upload',
//                                 createImageThumbnails : false,
//                                 params : params
//                 });


//                 dz.on('drop', function () { console.log('drop'); })
//                 dz.on('complete', function (file) {
//                         console.log('complete');
//                         dz.removeFile(file);
//                 });

//                 dz.on('uploadprogress', function (err, progress) { console.log(progress); })

//                 dz.on('success', function (err, json) {
//                         console.log('dropzone upload success');
//                         var obj = Wu.parse(json);
//                         if (obj) { that._uploaded(obj); }
//                 });

//                 // return 
//                 return dz;

//         },

//         _addLayer : function (e) {

//                 console.log('_addLayer!', e);
//                 console.log(this);  // <- source


//                 // add source as layer to project
//                 var source = this;
//                 var project = Wu.app._activeProject;
//                 project.addLayer(source);

//         },

//         edit : function (source) {
//                 console.log('edit mode');

//         },

//         _uploaded : function (record) {
//                 console.log('_uploaded');
//                 console.log('file: ', record);

//                 // handle errors
//                 if (record.errors.length > 0) {
//                         console.log('Error uploading source.')
//                         console.log(record.errors);
                        
//                         // add error message to pane : TODO!
//                         record.errors.forEach(function (elem, i, arr) {
//                                 var msg = '<div class="sources-error-msg">Error: ' + elem.error + '</div>';
//                                 msg += '<div class="sources-error-file">' + elem.file + '</div>';
//                                 this._errorPane.innerHTML = msg;
//                         }, this);
                        
//                 }

//                 // no files, return
//                 if (record.files.length == 0) {
//                         console.log('nothing, sorry.');
//                         return;
//                 }


//                 // update with new source(s)
//                 for (f in record.files) {
//                         var rec = record.files[f];

//                         this._sources = Wu.app.Sources;

//                         // add new source
//                         this._sources[rec.uuid] = new Wu.Source(rec, this);
                        
//                         // add to dom
//                         this.add(rec);

//                         // set to edit mode
//                         this.edit(rec); 
                      
                        
//                         // load layer automatically 
//                         // (TODO: a settings option)
                        
//                         // get active project
//                         var p = Wu.app._activeProject.uuid;
                        
//                                 try {
                        
//                         var layer = Wu.app.Projects[p].layers[rec.uuid]._layer;
                        
//                                 } catch (e) {console.log('if layer error: ', e)};
                        
                        
//                         if (layer) {
//                                 console.log('this layer load()!');

//                                 layer.load();   // load data
//                                 layer.add();    // add to map
//                         }



                       

                        
//                 }

//         }

// });



/*
 /$$                                                        
| $$                                                        
| $$        /$$$$$$  /$$   /$$  /$$$$$$   /$$$$$$   /$$$$$$$
| $$       |____  $$| $$  | $$ /$$__  $$ /$$__  $$ /$$_____/
| $$        /$$$$$$$| $$  | $$| $$$$$$$$| $$  \__/|  $$$$$$ 
| $$       /$$__  $$| $$  | $$| $$_____/| $$       \____  $$
| $$$$$$$$|  $$$$$$$|  $$$$$$$|  $$$$$$$| $$       /$$$$$$$/
|________/ \_______/ \____  $$ \_______/|__/      |_______/ 
                     /$$  | $$                              
                    |  $$$$$$/                              
                     \______/                               */

// Layermenu in the Editor 
Wu.SidePane.Layers = Wu.SidePane.Item.extend({

        type : 'layers',                                // list of sources available to this user/project/client
        //title : 'Layermenu',

        initContent : function () {

                // create from template
                this._container.innerHTML = ich.layersWrapper();

                // get panes
                this._layersWrapper = Wu.DomUtil.get('layers-wrapper');
                this._libaryWrapper = Wu.DomUtil.get('layers-library-browser');
                this._layerList = Wu.DomUtil.get('layers-library-list');
                this._browserLibrary = Wu.DomUtil.get('layers-library-browser-datalayers');
                this._browserMapbox = Wu.DomUtil.get('layers-library-browser-mapbox');
                this._libraryPane = Wu.DomUtil.get('layers-library'); // list of local file
                this._mapboxPane = Wu.DomUtil.get('layers-mapbox');     // list of mapbox
                this._mapboxImportOk = Wu.DomUtil.get('import-mapbox-layers-ok'); // import mapbox account btn 
                this._mapboxImportInput = Wu.DomUtil.get('import-mapbox-layers');
                this._mapboxList = Wu.DomUtil.get('layers-mapbox-list-wrap');

                this._mapboxConnectDrop = Wu.DomUtil.get('editor-layers-connect-mapbox-more');
                this._mapboxConnectDropp = Wu.DomUtil.get('editor-layers-connect-mapbox');
                this._datalibUploadDrop = Wu.DomUtil.get('editor-layers-upload-more');
                this._datalibUploadDropp = Wu.DomUtil.get('editor-layers-upload');

                // add middle level menuitem -- hack
                this._middleItem = Wu.DomUtil.create('div', 'middle-item');
                this._middleItem.innerHTML = 'Menu Folder';
                this._layersWrapper.insertBefore(this._middleItem, this._libraryPane);

        },

        addHooks : function () {

                Wu.DomEvent.on(this._browserMapbox,     'mousedown',    this.selectBrowserMapbox, this);
                Wu.DomEvent.on(this._browserLibrary,    'mousedown',    this.selectBrowserLibrary, this);
                Wu.DomEvent.on(this._mapboxImportOk,    'mousedown',    this.importMapboxAccount, this);
                Wu.DomEvent.on(this._mapboxImportInput, 'keydown',      this.mapboxInputKeydown, this);

                Wu.DomEvent.on(this._mapboxConnectDrop, 'mousedown',    this.toggleDropdown, this);
                Wu.DomEvent.on(this._datalibUploadDrop, 'mousedown',    this.toggleDropdown, this);
                //Wu.DomEvent.on(this._mapboxConnectDrop, 'mousedown',    this.toggleDropdown, this);
                //Wu.DomEvent.on(this._datalibUploadDrop, 'mousedown',    this.toggleDropdown, this);

                // menu folder item
                Wu.DomEvent.on(this._middleItem, 'mousedown', this.addMenuFolder, this);

        },

        addMenuFolder : function () {
                console.log('adding menu folder!');
                var lm = {
                        fuuid : 'layermenuFolder-' + Wu.Util.guid(),
                        title : 'New folder',
                        layerType : 'menufolder',
                        pos : 2
                }

                Wu.app.MapPane.layerMenu.addMenuFolder(lm);

                // save
                // var lm = {
                //         fuuid : file.uuid,
                //         title : file.name,
                //         pos : 1,
                //         layerType : 'datalibrary'
                // }

                this.project.layermenu.push(lm);

                console.log('====mb=> pushing to layermenu', lm);
                console.log('this.project.layermenu', this.project.layermenu);
                
                // save to server
                this.project._update('layermenu');

        },

        toggleDropdown : function (e) {
                var wrap = e.target.nextElementSibling;
                    
                // toggle open/close
                if (Wu.DomUtil.hasClass(wrap, 'hide')) {
                        Wu.DomUtil.removeClass(wrap, 'hide');
                        Wu.DomUtil.addClass(e.target, 'rotate180');
                } else {
                        Wu.DomUtil.addClass(wrap, 'hide');
                        Wu.DomUtil.removeClass(e.target, 'rotate180');
                }

        },

        mapboxInputKeydown: function (e) {
                 // blur and go on enter
                if (event.which == 13 || event.keyCode == 13) {
                        e.target.blur();
                        this.getMapboxAccount()
                }
        },

        selectBrowserMapbox : function () {
                this._mapboxPane.style.display = 'block';
                this._libraryPane.style.display = 'none';
        },

        selectBrowserLibrary : function () {
                this._mapboxPane.style.display = 'none';
                this._libraryPane.style.display = 'block';
        },

        update : function (project) {   // todo: careful with passing projects, perhaps better to get from global SidePane source

                var project = this.project || project;
                // update layers after new additon
                this.updateContent(project);

        },

        updateContent : function (project) {

                // reset view
                this._reset();

                // set project
                this.project = project;

                // update view
                this._update();

        },

        _update : function () {

                // layermenu
                this.initLayers();

                // mapbox layers
                this.initMapboxLayers();

                // show active layers
                this.markActiveLayers();

        },

        _reset : function () {

                this._layerList.innerHTML = '';
                this._mapboxList.innerHTML = '';
                this.mapboxFiles = {};
                this.mapboxUsers = {};
                this.selectBrowserLibrary(); // set data library as default pane
        },


        markActiveLayers : function () {

                // mark active mapbox layers
                this.project.layermenu.forEach(function (layer) {

                        if (layer.layerType == 'datalibrary') {
                                
                                // tag item active
                                var check = 'layerItem-' + layer.fuuid;
                                var div = Wu.DomUtil.get(check).parentNode;
                                Wu.DomUtil.addClass(div, 'active-layer');

                        } else if (layer.layerType == 'mapbox') {
                                
                                // tag item active
                                var check = 'layerMapboxItem-' + layer.fuuid;
                                var div = Wu.DomUtil.get(check).parentNode;
                                Wu.DomUtil.addClass(div, 'active-layer');
                        }

                        

                }, this);
        },

        initMapboxLayers : function () {

                // ordem e progresso
                this.parseMapboxLayers();

                // update DOM
                this.updateMapboxDOM();

        },

        initLayers : function () {

                // get local layers
                var layers = [];
                this.project.files.forEach(function (file, i, arr) {
                        if (file.type == 'layer') {
                                layers.push(file);
                                this.addLayer(file);
                        }
                }, this);

                // refresh draggable
                this.initDraggable();

        },

        resetDraggable : function () {

                // remove hooks
                var bin = Wu.DomUtil.get('layer-menu-inner-content');
                if (bin) {
                        Wu.DomEvent.off(bin, 'dragover', this.drag.over, this);
                        Wu.DomEvent.off(bin, 'dragleave', this.drag.leave, this);
                        Wu.DomEvent.off(bin, 'drop', this.drag.drop, this);
                }
        },


        // dragging of layers to layermenu
        drag : {

                start : function (e) {
                        var el = e.target;
                        console.log('drag start: ', e);
                        e.dataTransfer.setData('uuid', el.id); // set *something* required otherwise doesn't work
                },

                drop : function (e) {
                        if (e.stopPropagation) e.stopPropagation(); // stops the browser from redirecting...why???

                        var el = document.getElementById(e.dataTransfer.getData('uuid'));

                        // get file uuid and add to layer menu 
                        var fuuid = el.getAttribute('fuuid');
                        var type = el.getAttribute('type');

                        // add
                        this.addLayerToMenu(fuuid, type);

                        // clear visual feedback
                        Wu.DomUtil.removeClass(Wu.DomUtil.get('layer-menu-inner-content'), 'over');

                        return false; // irrelevant probably
                },

                over : function (e) {
                        if (e.preventDefault) e.preventDefault(); // allows us to drop

                        // set visual
                        Wu.DomUtil.addClass(Wu.DomUtil.get('layer-menu-inner-content'), 'over');
                        
                        return false;
                },

                leave : function (e) {
                        // clear visual
                        Wu.DomUtil.removeClass(Wu.DomUtil.get('layer-menu-inner-content'), 'over');
                }
        },
       
        initDraggable : function () {

                this.resetDraggable();  // needed? seems not.

                // iterate over all layers
                var items = document.getElementsByClassName('layer-item');
                for (var i = 0; i < items.length; i++) {
                        var el = items[i];
                        
                        // set attrs
                        el.setAttribute('draggable', 'true');
                        el.id = Wu.Util.guid();
                        
                        // set dragstart event
                        Wu.DomEvent.on(el, 'dragstart', this.drag.start, this);
                };

                // set hooks
                var bin = Wu.DomUtil.get('layer-menu-inner-content');
                if (bin) {
                        Wu.DomEvent.on(bin, 'dragover', this.drag.over, this);
                        Wu.DomEvent.on(bin, 'dragleave', this.drag.leave, this);
                        Wu.DomEvent.on(bin, 'drop', this.drag.drop, this);
                } 


        },


        removeLayerFromMenu : function (fuuid, type) {

                console.log('__________removeLayerFromMenu_____________', fuuid, type);                
                console.log('this.project.layermenu', this.project.layermenu);

                var i = _.findIndex(this.project.layermenu, {'fuuid' : fuuid});
               
                if (!i < 0) {
                        var i = _.findIndex(this.project.layermenu, {'id' : fuuid});    // mapbox
                }

                // remove from layermenu object
                this.project.layermenu.splice(i, 1);
               
                // remove from layermenu DOM
                Wu.app.MapPane.layerMenu.remove(fuuid);

                // save
                this.project._update('layermenu');

                console.log('____end______removeLayerFromMenu______end_______');

        },

        // drag-n drop
        addLayerToMenu : function (fuuid, type) {

                // add from datalibrary
                if (type == 'datalibrary') {
                        // get file,  add to layermenu
                        var file = this.getFileFromUuid(fuuid);
                        console.log('dl file: ', file);
                        
                        // add to layermenu
                        Wu.app.MapPane.layerMenu.addFromFile(file);

                        // tag item active
                        var check = 'layerItem-' + fuuid;
                        var div = Wu.DomUtil.get(check).parentNode;
                        Wu.DomUtil.addClass(div, 'active-layer');

                        // save
                        var lm = {
                                fuuid : file.uuid,
                                title : file.name,
                                pos : 1,
                                layerType : 'datalibrary'
                        }

                        this.project.layermenu.push(lm);

                        console.log('====mb=> pushing to layermenu', lm);
                        console.log('this.project.layermenu', this.project.layermenu);
                        
                        // save to server
                        this.project._update('layermenu');

                        return;
                }

                // add from mapbox
                if (type == 'mapbox') {

                        // find layer in mapbox jungle
                        console.log('this.mapboxLayers: ', this.mapboxLayers);  // TODO: rewrite with _.find
                        var found = [];
                        for (l in this.mapboxLayers) {
                                var account = this.mapboxLayers[l];
                                account.forEach(function (layer) {
                                        if (layer.id == fuuid) { found = layer; }
                                })
                        }
                        if (!found) { 
                                console.log('that layer is not here????'); 
                                return;
                        }
                               
                        // add to layermenu
                        Wu.app.MapPane.layerMenu.addFromMapbox(found);
                        
                        // tag item active
                        var check = 'layerMapboxItem-' + fuuid;
                        var div = Wu.DomUtil.get(check).parentNode;
                        Wu.DomUtil.addClass(div, 'active-layer');

                        // save layermenu
                        var lm = {
                                fuuid : found.id,
                                title : found.name,
                                pos : 1,
                                layerType : 'mapbox'
                        }

                        this.project.layermenu.push(lm);

                        console.log('====mb=> pushing to layermenu', lm);

                        // save to server
                        this.project._update('layermenu');

                        return;
                }

        },

        getFileFromUuid : function (fuuid) {
                var file = {};
                this.project.files.forEach(function (f, i, arr) {
                        if (fuuid == f.uuid) {  file = f; }
                }, this);
                return file;
        },

        addLayer : function (file) {

                var div = Wu.DomUtil.create('div', 'layer-item');
                div.setAttribute('draggable', true);
                div.setAttribute('fuuid', file.uuid);
                div.setAttribute('type', 'datalibrary');
                div.innerHTML = ich.layersItem(file);
                this._layerList.appendChild(div);

                // add to layermenu on click
                Wu.DomEvent.on(div, 'click', this.toggleLayer, this);

        },


        _activate : function () {
                Wu.SidePane.Item.prototype._activate.call(this)

                this.update();
        },


        // on click when adding new mapbox account
        importMapboxAccount : function (e) {

                // get username
                var username = this._mapboxImportInput.value;

                // get mapbox account via server
                this.getMapboxAccount(username);

                // clear input box
                this._mapboxImportInput.value = '';

        },

        getMapboxAccount : function (username) {
                
                // get mapbox account from server
                // ie, send username to server, get mapbox parsed back
                var data = {
                        'username' : username,
                        'projectId' : this.project.uuid
                }
                // post         path                            json                                   callback      this
                Wu.post('/api/util/getmapboxaccount', JSON.stringify(data), this.gotMapboxAccount, this);

        },

        parseMapboxLayers : function (layers, fresh) {

                var layers = layers || this.project.mapboxLayers;

                // push into an orderly object
                this.mapboxLayers = this.mapboxLayers || {};
                layers.forEach(function (layer, i, arr) {
                        this.mapboxLayers[layer.username] = this.mapboxLayers[layer.username] || [];
                        this.mapboxLayers[layer.username].push(layer);
                        
                        // add to project 
                        if (fresh) this.project.mapboxLayers.push(layer);  //TODO could contain duplicates
                
                }, this);

                // remove possible duplicates
                this.removeMapboxDuplicates();

        },

        removeMapboxDuplicates : function () {
                
                // remove possible duplicates
                this.project.mapboxLayers = _.uniq(this.project.mapboxLayers);

                // remove dups in local 
                for (a in this.mapboxLayers) {
                        this.mapboxLayers[a] = _.uniq(this.mapboxLayers[a]);
                }

        },

        // returned from server getting a mapbox account
        gotMapboxAccount : function (that, response) {

                var layers = JSON.parse(response);

                // check if empty
                if (!layers) { console.log('seems empty'); return; }
               
                // ordem e progresso
                that.parseMapboxLayers(layers, true); // and add to project

                // update DOM
                that.updateMapboxDOM();

                // save to project
                that.project._update('mapboxLayers');

        },

        // just update DOM with existing mapbox accounts
        updateMapboxDOM : function () {

                console.log('updateMapboxDOM; this.mapboxLayers: ', this.mapboxLayers);

                // update DOM in project with all mapbox accounts and layers
                this._mapboxList.innerHTML = ''; // reset
                for (account in this.mapboxLayers) {

                        // create account header
                        var div = Wu.DomUtil.create('div', 'mapbox-list-item');
                        div.innerHTML = ich.mapboxListWrapper({'name' : account});    
                        this._mapboxList.appendChild(div);
                        var wrap = Wu.DomUtil.get('layers-mapbox-list-' + account);

                        // fill in with layers
                        var layers = this.mapboxLayers[account];
                        layers.forEach(function (layer) {

                                // create and append layer to DOM list
                                var div = Wu.DomUtil.create('div', 'layer-item');
                                div.setAttribute('draggable', true);
                                div.setAttribute('fuuid', layer.id);
                                div.setAttribute('type', 'mapbox');
                                div.innerHTML = ich.layersMapboxItem(layer);
                                wrap.appendChild(div);

                                // add to layermenu on click
                                Wu.DomEvent.on(div, 'click', this.toggleLayer, this);

                        }, this);

                }

                // refresh draggable
                this.initDraggable();

        },

        toggleLayer : function (e) {
               

                var div = e.target;
                var fuuid = div.getAttribute('fuuid');
                var type = div.getAttribute('type');

                if (!fuuid && !type) {
                        var div = e.target.parentNode;
                        var fuuid = div.getAttribute('fuuid');
                        var type = div.getAttribute('type');
                }

                
                var active = _.find(this.project.layermenu, {'fuuid' : fuuid});

                if (active) {
                        // toggle off
                        this.removeLayerFromMenu(fuuid);
                        
                        // tag item active
                        Wu.DomUtil.removeClass(div, 'active-layer');

                } else {

                        // toggle on
                        this.addLayerToMenu(fuuid, type);
                }


        },

        save : function (key) {



        },

        
});


