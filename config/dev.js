// dev.js
module.exports = {

	'user' : {											// db query starts with user.
														// 			
														// scenarios users:
														// 
														// 		1. consumer user:
														//			- READ one or more projects
														// 			
														//
														//		2. admin user
														//			- one or more projects
														//			- one or more clients
														// 			- can CRUD projects
														//			- can CRUD consumer users
														//			- data sources
														//
														//		3. superadmin user
														//			- CRUD clients and delegate to users
														//
														//	projects
														//			- map
														//			- layer selector
														//			- doc pane
														//			- download pane
														//			- header
														//			- 

	},

	'clients' : {	// from store

	},

	'projects' : {	// from store based on user ownership

	},

	// menu for this particular projects -- menu not stored, created from logic, other stores
	// except basic structure - classes, names, etc. - simply in models
	'menu' : [

		{
			// projects 					// per user
			'className' : 'editProjects',
			'title' : 'Projects'
		},
		{
			// clients 						// per user
			'className' : 'editClients',
			'title' : 'Clients'
		},
		{
			// map pane 					// per project
			'className' : 'editMap',
			'title' : 'Map'
		},
		{
			// layer selector 				// per project
			'className' : 'editLayerSelector',
			'title' : 'Layer Selector'
		},
		{
			// layer sources 				// per user
			'className' : 'editLayerSources',
			'title' : 'Layer Sources'
		},
		{
			// documents pane 				// per project
			'className' : 'editDocumentsPane',
			'title' : 'Documents Pane'
		},
		{
			// downloads pane 				// per project
			'className' : 'editDownloadsPane',
			'title' : 'Downloads Pane'
		},
		{
			// header 						// per project (perhaps client logo, etc.)
			'className' : 'editHeader',
			'title' : 'Header'
		}


	]


}