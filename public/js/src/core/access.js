Wu.Access = Wu.Class.extend({

	initialize : function (options) {
		console.log('Wu.Access', options);

		// shortcut
		app.access = this;

		// set store
		this.store = options;

		// set templates
		this.roles.templates = options.templates;

		// init super roles
		this._superRole = new Wu.Role.Super({ 
			role : app.options.json.access.superRole
		});
		this._portalRole = new Wu.Role.Portal({
			role : app.options.json.access.portalRole
		});

	},


	get : {

		// get role of user in project
		role : function (options) {
			var project = options.project,
			    user = options.user;

			// supers/portaladmins are not in projects, so must check here too
			if (app.access.is.superAdmin(user))  return app.access._superRole; 	
			if (app.access.is.portalAdmin(user)) return app.access._portalRole;

			// return project role(s)
			var found = _.find(project.getRoles(), function (role) {
				return role.hasMember(user);
			});
			return found;
		},


		availableRoles : function (options) {

			// if you're SUPERADMIN 	=> you can delegate all
			// if you're PORTALADMIN 	=> you can delegate READER, EDITOR, MANAGER, COLLABORATOR
			// if you're EDITOR 		=> can delegate READER, MANAGER, COLLABORATOR
			// if you're MANAGER 		=> you can delegate READER, MANAGER
			// if you're COLLABORATOR 	=> can't delegate
			// if you're READER 		=> can't delegate

			// --------------------------------------------

			// delegate_to_user = can delegate own capabilites to others

			// you can therefore delegate_to_user the role in which you have delegate_to_user permission


			// TODO:
			// get roles already created in project first!
			// then fill in with templates........

			var account = app.Account,
			    user = options.user,
			    project = options.project,
			    availRoles = [],
			    noAdmins = options.noAdmins;

			// get role of account for this project
			var role = app.access.get.role({
				user : account,
				project : project
			});

			// if doesn't have delegate_to_user, can't delegate any roles
			if (!role.getCapabilities().delegate_to_user) return [];

			// tricky part: get which roles account can delegate, based on capabilities in role
			var roles = app.access.filter.roles({
				role : role,
				project : project,
				noAdmins : noAdmins
			});

			return roles;

		},

		portalRole : function () {
			return app.options.json.access.portalRole;
		},

		superRole : function () {
			return app.options.json.access.superRole;
		},

	},


	filter : {

		roles : function (options) {
			// get roles which options.role can delegate to
			console.log('filtering: ', options);

			var role = options.role,
			    noAdmins = options.noAdmins,
			    project = options.project,
			    available = [];


			// iterate each project role
			_.each(project.getRoles(), function (projectRole) {
				var lacking = false;

				_.each(projectRole.capabilities, function (cap, key) {
					if (cap) if (!role.capabilities[key]) lacking = true;
				});

				// if not lacking any cap, add to available
				if (!lacking) available.push(projectRole);
			});

			return available;
		},
	},

	can : {
		// convenience method
		delegate : function (account, project) {
			return  app.access.has.project_capability(account, project, 'delegate_to_user') ||
	                	app.access.is.portalAdmin(account) ||
	                	app.access.is.superAdmin(account);
		},

	},

	as : {
		// convenience method
		admin : function (user, capability) {

			if (app.access.is.superAdmin(user)) {
				var capabilities = app.access.get.superRole().capabilities;
				if (capabilities[capability]) return true;
			}

			// check if user is in portal/super roles
			if (app.access.is.portalAdmin(user)) {
				var capabilities = app.access.get.portalRole().capabilities;
				if (capabilities[capability]) return true;
			}

			return false;
		},
	},

	has : {

		project_capability : function (user, project, capability) {
			if (!user || !project) return;
			
			var user = user || app.Account,
			    roles = project.getRoles(),
			    permission = false;


			_.each(roles, function (role) {
				if (role.hasMember(user) && role.hasCapability(capability)) permission = true;
			});
			return permission;
		},

	},

	is : {

		contained : function (array, item) { 	// replace with _.contains(array, item)
			return array.indexOf(item) > 0;
		},

		admin : function (user) {
			var user = user || app.Account;
			var portaladmin = app.access.is.portalAdmin(user);
			var superadmin = app.access.is.superAdmin(user);
			return portaladmin || superadmin;
		},

		portalAdmin : function (user) {
			var user = user || app.Account;
			return app.access._portalRole.hasMember(user);
		},

		superAdmin : function (user) {
			var user = user || app.Account;
			return app.access._superRole.hasMember(user);
		},
	},

	// must be kept identical with api.access.js
	to : {

		create_client : function (user) { 
			if (app.access.as.admin(user, 'create_client')) return true;
			return false;
		},
		
		edit_client : function (client, user) { 
			if (app.access.as.admin(user, 'edit_client')) return true;
			return false;
		},
		
		edit_other_client : function (client, user) { 
			if (app.access.as.admin(user, 'edit_other_client')) return true;
			return false;
		},
		
		delete_client		: function (client, user) { 
			if (app.access.as.admin(user, 'delete_client')) return true;
			return false;
		},
		
		delete_other_client  	: function (client, user) { 
			if (app.access.as.admin(user, 'delete_other_client')) return true;
			return false;
		},
		
		read_client		: function (client, user) { 
			if (app.access.as.admin(user, 'read_client')) return true;
			return false;
		},
		
		// who else can create projects? students! 
		create_project 		: function (user) { 
			if (app.access.as.admin(user, 'create_project')) return true;
			return false;
		},
		
		edit_project 		: function (project, user) { 
			if (app.access.as.admin(user, 'edit_project')) return true;
			if (app.access.has.project_capability(user, project, 'edit_project')) return true;
			return false;
		},
		
		edit_other_project 	: function (project, user) { 
			if (app.access.as.admin(user, 'edit_other_project')) return true;
			return false;
		},
		
		delete_project		: function (project, user) { 
			if (app.access.as.admin(user, 'delete_project')) return true;
			if (app.access.has.project_capability(user, project, 'delete_project')) return true;
			return false;
		},
		
		delete_other_project	: function (project, user) { 
			if (app.access.as.admin(user, 'delete_other_project')) return true;
		},
		
		read_project		: function (project, user) { 
			if (app.access.has.project_capability(user, project, 'read_project')) return true;
			return false;
		},
		
		upload_file 		: function (project, user) { 
			if (app.access.as.admin(user, 'upload_file')) return true;
			if (app.access.has.project_capability(user, project, 'upload_file')) return true;
			return false;
		},
		
		download_file 		: function (project, user) { 
			if (app.access.as.admin(user, 'download_file')) return true;
			if (app.access.has.project_capability(user, project, 'download_file')) return true;
			return false;
		},

		// todo: edit_file, edit_other_file
		
		create_version 		: function (project, user) { 
			if (app.access.as.admin(user, 'create_version')) return true;
			if (app.access.has.project_capability(user, project, 'create_version')) return true;
			return false;
		},
		
		delete_version 		: function (project, user) { 
			if (app.access.as.admin(user, 'delete_version')) return true;
			if (app.access.has.project_capability(user, project, 'delete_version')) return true;
			return false;
		},

		delete_other_version    : function (project, user) {
			if (app.access.as.admin(user, 'delete_other_version')) return true;
			return false;
		},
		
		delete_file 		: function (project, user) { 
			if (app.access.as.admin(user, 'delete_file')) return true;
			if (app.access.has.project_capability(user, project, 'delete_file')) return true;
			return false;
		},
		
		delete_other_file 	: function (project, user) { 
			if (app.access.as.admin(user, 'delete_other_file')) return true;
			return false;
		},
		
		create_user		: function (project, user) { 
			if (app.access.as.admin(user, 'create_user')) return true;
			if (app.access.has.project_capability(user, project, 'create_user')) return true;
			return false;
		},
		
		edit_user 		: function (project, user) { 
			if (app.access.as.admin(user, 'edit_user')) return true;
			if (app.access.has.project_capability(user, project, 'edit_user')) return true;
			return false;
		},
		
		edit_other_user 	: function (user) { 
			if (app.access.as.admin(user, 'edit_other_user')) return true;
			return false;
		},
		
		delete_user		: function (user) { 
			if (app.access.as.admin(user, 'delete_user')) return true;
			return false;
		},
		
		delete_other_user 	: function (user) { 
			if (app.access.as.admin(user, 'delete_user')) return true;
			return false;
		},
		
		share_project		: function (user) { 
			if (app.access.as.admin(user, 'share_project')) return true;
			if (app.access.has.project_capability(user, project, 'share_project')) return true;
			return false;
		},
		
		read_analytics 		: function (user) { 
			if (app.access.as.admin(user, 'edit_user')) return true;
			return false;
		},
		
		manage_analytics 	: function (user) { 
			if (app.access.as.admin(user, 'edit_user')) return true;
			return false;
		},
		
		delegate_to_user 	: function (project, user) { 
			if (app.access.as.admin(user, 'delegate_to_user')) return true;
			if (app.access.has.project_capability(user, project, 'delegate_to_user')) return true;
			return false;
		},
	},

	roles : {

		templates : {} // get from server		
	}
});