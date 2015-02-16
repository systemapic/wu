// client side permission.js

Wu.config.permission = {

	to : {

		create : {
			project : function () {
				var user = app.User.store;
				if (user.role.superadmin) return true;
				if (user.role.admin)      return true;
				return false;
			},
			client : function () {
				var user = app.User.store;
				if (user.role.superadmin) return true;
				if (user.role.admin)      return true;
				return false;
			},
			superadmin : function () {
				var user = app.User.store;
				if (user.role.superadmin) return true;
				return false;
			},
			admin : function () {
				var user = app.User.store;
				if (user.role.superadmin) return true;
				if (user.role.admin)      return true; 	// admins can create other admins
				return false;
			},
			manager : function (uuid) { // project uuid
				var user = app.User.store;
				if (user.role.superadmin) return true;
				if (user.role.admin)      return true;
				return false;
			},
			editor : function () {
				var user = app.User.store;
				if (user.role.superadmin) return true;
				if (user.role.admin)      return true;
				return false;
			},
			reader : function () {
				var user = app.User.store;
				if (user.role.superadmin) return true;
				if (user.role.admin)      return true;
				if (user.role.manager.projects.indexOf(uuid) >= 0) return true; // managers can create readers for own projects
				return false;
			}
		},

		read : {
			project : function (uuid) {
				var user = app.User.store;
				if (user.role.superadmin) return true;
				if (user.role.admin)      return true;
				if (user.role.manager.projects.indexOf(uuid) >= 0) return true; // managers can create readers for own projects
				if (user.role.editor.projects.indexOf(uuid)  >= 0) return true; // managers can create readers for own projects
				if (user.role.reader.projects.indexOf(uuid)  >= 0) return true; // managers can create readers for own projects
				return false;
			},
			client : function (uuid) {
				var user = app.User.store;
				if (user.role.superadmin) return true;
				if (user.role.admin)      return true;
				if (user.role.manager.clients.indexOf(uuid) >= 0) return true; // managers can create readers for own projects
				if (user.role.editor.clients.indexOf(uuid)  >= 0) return true; // managers can create readers for own projects
				if (user.role.reader.clients.indexOf(uuid)  >= 0) return true; // managers can create readers for own projects
				return false;
			}
		},

		write : {
			project : function (uuid) {
				var user = app.User.store;
				if (user.role.superadmin) return true;
				if (user.role.admin)      return true;
				if (user.role.editor.projects.indexOf(uuid) >= 0) return true; // managers can create readers for own projects
				return false;

			},
			client : function (uuid) {
				var user = app.User.store;
				if (user.role.superadmin) return true;
				if (user.role.admin)      return true;
				if (user.role.editor.clients.indexOf(uuid) >= 0) return true; // managers can create readers for own projects
				return false;
			},
			user   : function (uuid) {
				var user = app.User.store;
				if (user.role.superadmin) return true;
				if (user.role.admin)      return true;

				// var subject = app.
				if (user.role.manager.indexOf(uuid) >= 0) return true; // managers can create readers for own projects
				return false;				
			}
		},

		remove : {
			project : function (uuid) {
				var user = app.User.store;
				if (user.role.superadmin) return true;
				if (user.role.admin)      return true;
				return false;

			},
			client : function (uuid) {
				var user = app.User.store;
				if (user.role.superadmin) return true;
				if (user.role.admin)      return true;
				return false;				
			}
		}, 


	}
}