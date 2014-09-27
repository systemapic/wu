//  █████╗ ██████╗ ██████╗ 
// ██╔══██╗██╔══██╗██╔══██╗
// ███████║██████╔╝██████╔╝
// ██╔══██║██╔═══╝ ██╔═══╝ 
// ██║  ██║██║     ██║     
// ╚═╝  ╚═╝╚═╝     ╚═╝     
			
// ***************************************************************************************
//      MAIN APP START
// ***************************************************************************************

// Main App Controller  - starts errything
Wu.App = Wu.Class.extend({

	options : {},

	initialize : function (options) {

		// set global this
		Wu.app = this;

		// merge options
		Wu.setOptions(this, options);    

		// set options
		L.mapbox.config.FORCE_HTTPS = true;

		// get objects from server
		this.initServer();

	},

	initServer : function () {
		var serverUrl = this.options.server;

		console.log('Server: ', serverUrl);

		var data = JSON.stringify(this.options);
		
		// post         path          json      callback    this
		Wu.post('/api/portal', data, this.initServerResponse, this);

	},

	initServerResponse : function (that, response) {
		var resp = JSON.parse(response);

		// revv it up
		that.initApp(resp);
	},

	initApp : function (o) {

		// set vars
		this.options.json = o;

		// create app container
		this._initContainer();

		// load dependencies
		this._initDependencies();

		// load json model
		this._initObjects();

		// create panes
		this._initPanes();

		// check for /client/project url
		this._initHotlink();			// incl. if only one client (and only read access), then hide Clients tab

		// check if only one client and no read
		this._singleClient();

		this._initView();

	},

	_initContainer : function () {

		// find or create container
		var id = this.options.id
		this._appPane = Wu.DomUtil.get(id) || Wu.DomUtil.createId('div', id || 'app', document.body);

		// create map container
		this._mapContainer = Wu.DomUtil.createId('div', 'map-container', this._appPane);

	},

	_initDependencies : function () {

		// icanhaz templates
		ich.grabTemplates()

	},

	_initObjects : function () {

		// main user account
		this.Account = new Wu.User(this.options.json.account);

		// create user objects
		this.Users = {};
		this.options.json.users.forEach(function(user, i, arr) {
		       this.Users[user.uuid] = new Wu.User(user);             
		}, this);
		
		// create client objects
		this.Clients = {};
		this.options.json.clients.forEach(function(elem, i, arr) {
		       this.Clients[elem.uuid] = new Wu.Client(elem, this);             
		}, this);

		// create project objects
		this.Projects = {}      ;
		this.options.json.projects.forEach(function(elem, i, arr) {
		       this.Projects[elem.uuid] = new Wu.Project(elem, this);
		}, this);


	},


	_initPanes : function () {

		// render side pane 
		this.SidePane = new Wu.SidePane();

		// render header pane
		this.HeaderPane = new Wu.HeaderPane();

		// render map pane
		this.MapPane = new Wu.MapPane();

	},

	// init default view on page-load
	_initView : function () {


		// if user is admin or manager, set Projects and Users as default panes
		var user = app.Account;
		if (user.isAdmin() || user.isSuperadmin() || user.isManager()) {
			// set panes 
			var panes = ['Clients', 'Users'];
			this.SidePane.refresh(panes);
		}

	},


	_singleClient : function () {
		return;
		var size = _.size(this.Clients);
		var can = Wu.can.createClient();

		if (size > 1) return;
		if (can) return;

		var clientUuid = this.User.options.access.clients.read[0];
		var client = this.Clients[clientUuid];

		// select client
		this.SidePane.Clients.select(client);

		// open pane
		this.SidePane.openPane();

		// hide Clients tab
		this.SidePane.Clients.permanentlyDisabled = true;
		
	},

	_initHotlink : function () {
		return;
		
		// only if hotlink
		if (!window.hotlink.hasOwnProperty('client')) return;
		
		// if user has access to client/project
		var client = this._hasClient();
		var project = this._hasProject();
		
		// reset address bar if no client
		if (!client) return Wu.Util.setAddressBar(url);
			 
		// select client
		this.SidePane.Clients.select(client);
		
		if (!project) {
			// open projects pane so user can select something
			this.SidePane.openPane();
		}

		// select project
		if (project) {
			this.SidePane.Projects.select(project);

			// if read only on project, closePane
			if (!_.contains(this.User.options.access.projects.write, project.uuid) && _.contains(this.User.options.access.projects.read, project.uuid) ) {
				this.SidePane.closePane();
			}
		}

		

		

	},


	_hasClient : function (clientSlug) {

		// find client slug in Wu.app.Clients
		clientSlug = clientSlug || window.hotlink.client;
		for (c in Wu.app.Clients) {
			var client = Wu.app.Clients[c];
			if (clientSlug == client.slug) return client; 
			
		}
		return false;
	},

	_hasProject : function (projectSlug) {

		// find project slug in Wu.app.Projects
		projectSlug = projectSlug || window.hotlink.project;
		for (p in Wu.app.Projects) {
			var project = Wu.app.Projects[p];
			if (projectSlug == project.slug) return project; 
		}
		return false;
	}

});











//                                    _
//                                  ,d8b,
//                          _,,aadd8888888bbaa,,_
//                     _,ad88P"""8,  I8I  ,8"""Y88ba,_
//                  ,ad88P" `Ya  `8, `8' ,8'  aP' "Y88ba,
//                ,d8"' "Yb   "b, `b  8  d' ,d"   dP" `"8b,
//               dP"Yb,  `Yb,  `8, 8  8  8 ,8'  ,dP'  ,dP"Yb 
//            ,ad8b, `Yb,  "Ya  `b Y, 8 ,P d'  aP"  ,dP' ,d8ba,
//           dP" `Y8b, `Yb, `Yb, Y,`8 8 8',P ,dP' ,dP' ,d8P' "Yb
//          ,88888888Yb, `Yb,`Yb,`8 8 8 8 8',dP',dP' ,dY88888888,
//          dP     `Yb`Yb, Yb,`8b 8 8 8 8 8 d8',dP ,dP'dP'     Yb
//         ,8888888888b "8, Yba888888888888888adP ,8" d8888888888,
//         dP        `Yb,`Y8P""'             `""Y8P',dP'        Yb
//        ,88888888888P"Y8P'_.---.._     _..---._`Y8P"Y88888888888,
//        dP         d'  8 '  ____  `. .'  ____  ` 8  `b         Yb
//       ,888888888888   8   <(@@)>  | |  <(@@)>   8   888888888888,
//       dP          8   8    `"""         """'    8   8          Yb
//      ,8888888888888,  8          ,   ,          8  ,8888888888888,
//      dP           `b  8,        (.-_-.)        ,8  d'           Yb
//     ,88888888888888Yaa8b      ,'       `,      d8aaP88888888888888,
//     dP               ""8b     _,gd888bg,_     d8""               Yb
//    ,888888888888888888888b,    ""Y888P""    ,d888888888888888888888,
//    dP                   "8"b,             ,d"8"                   Yb
//   ,888888888888888888888888,"Ya,_,ggg,_,aP",888888888888888888888888,
//   dP                      "8,  "8"\x/"8"  ,8"                      Yb
//  ,88888888888888888888888888b   8\\x//8   d88888888888888888888888888,
//  8888bgg,_                  8   8\\x//8   8                  _,ggd8888
//   `"Yb, ""8888888888888888888   Y\\x//P   8888888888888888888"" ,dP"'
//     _d8bg,_"8,              8   `b\x/d'   8              ,8"_,gd8b_
//   ,iP"   "Yb,8888888888888888    8\x/8    8888888888888888,dP"  `"Yi,
//  ,P"    __,888              8    8\x/8    8              888,__    "Y,
// ,8baaad8P"":Y8888888888888888 aaa8\x/8aaa 8888888888888888P:""Y8baaad8,
// dP"':::::::::8              8 8::8\x/8::8 8              8:::::::::`"Yb
// 8::::::::::::8888888888888888 8::88888::8 8888888888888888::::::::::::8
// 8::::::::::::8,             8 8:::::::::8 8             ,8::::::::::::8
// 8::::::::::::8888888888888888 8:::::::::8 8888888888888888::::::::::::8
// 8::::::::::::Ya             8 8:::::::::8 8             aP::::::::::::8
// 8:::::::::::::888888888888888 8:::::::::8 888888888888888:::::::::::::8
// 8:::::::::::::Ya            8 8:::::::::8 8            aP:::::::::::::8
// Ya:::::::::::::88888888888888 8:::::::::8 88888888888888:::::::::::::aP
// `8;:::::::::::::Ya,         8 8:::::::::8 8         ,aP:::::::::::::;8'
//  Ya:::::::::::::::"Y888888888 8:::::::::8 888888888P":::::::::::::::aP
//  `8;::::::::::::::::::::""""Y8888888888888P""""::::::::::::::::::::;8'
//   Ya:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::aP
//    "b;::::::::::::::::::::::::::::::::::::::::::: Normand  ::::::;d"
//     `Ya;::::::::::::::::::::::::::::::::::::::::: Veilleux ::::;aP'
//       `Ya;:::::::::::::::::::::::::::::::::::::::::::::::::::;aP'
//          "Ya;:::::::::::::::::::::::::::::::::::::::::::::;aP"
//             "Yba;;;:::::::::::::::::::::::::::::::::;;;adP"
//                 `"""""""Y888888888888888888888P"""""""'





// // start whole app
// var app = new Wu.App({
// 		json : window.json,
// 		id : 'app',
// 		// editor : { 
// 		//                 projects : true,    // default true
// 		//                 clients : true,     // default true
// 		//         },                  
// 		//editor : false,
// 		documentsPane : true,               // default true
// 		downloadsPane : true,               // default true
// 		header : true,
// 		chat : true,                         // default false
// 		mapbox : true,
// 		cartodb : true,
// 		serverdb : true,
// 		tileserver : 'http://85.10.202.87:8003/',
// 		server : 'http://85.10.202.87:8080/'
// });
