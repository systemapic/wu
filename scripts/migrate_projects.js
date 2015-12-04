
// libs
var async 	 = require('async');
var colors 	 = require('colors');
var crypto       = require('crypto');
var uuid 	 = require('node-uuid');
var mongoose 	 = require('mongoose');
var _ 		 = require('lodash-node');
var fs 		 = require('fs');

// database schemas
var Project 	 = require('../models/project');
var Clientel 	 = require('../models/client');	// weird name cause 'Client' is restricted name
var User  	 = require('../models/user');
var File 	 = require('../models/file');
var Layer 	 = require('../models/layer');
var Hash 	 = require('../models/hash');
var Role 	 = require('../models/role');
var Group 	 = require('../models/group');

// config
var config  = require('../config/server-config.js').serverConfig;

// connect to our database
mongoose.connect(config.mongo.url); 


Project
.find()
.populate('roles')
.exec(function (err, projects) {

	console.log('projects', projects.length);

	projects.forEach(function (project, n) {

		// console.log('project: ', n);

		var roles = project.roles;

		// console.log('project with roles:', roles);

		// console.log('PROJECT ACCESS: ', project.access.read);


		roles.forEach(function (role) {

			// console.log('role ', role);

			// console.log('role.slug', role.slug);


			// if (role.slug == 'projectOwner') {
			// 	console.log('projectOwners: ', role.members);

			// }

			// if (role.slug == 'projectEditor') {
			// 	console.log('projectEditor: ', role.members);
			// }

			if (role.slug == 'projectReader') {
				console.log('projectReader: ', role.members);

				// add read
				// add_read_to_project(project, role.members, function (err) {


					// done!


				// });

				if (!role.members) return;

				add_to_contact_list(role.members, function (err) {

					console.log('done!');
				})
			}

		});


	});

	// process.exit(0);

});


function add_to_contact_list (members, done) {

	var list = [];

	User
	.findOne({uuid : 'user-a65d8fc1-7016-4638-8468-6e7c0c455ab7'})
	.exec(function (err, main_user) {

		console.log('main_user contact list: BEFORE ', main_user.contact_list);


		async.each(members, function (m, callback) {
			console.log('m: ', m);


			User
			.findOne({uuid : m})
			.exec(function (err, user) {
				if (err || !user) return callback();
				
				console.log('user contact list: b4 ', user.contact_list);

				user.contact_list.push(main_user._id);
				user.save(function (err) {
					
					console.log('user contact list: after ', user.contact_list);

					list.push(user._id);

					callback(err);

				});
			})



		}, function (err) {

			list.forEach(function (l) {
				main_user.contact_list.addToSet(l);
			});

			main_user.save(function (err) {

				console.log('all done!');

				console.log('main_user contact list: AFTER', main_user.contact_list);

				done();
			});


		});

	});


}


function add_read_to_project (project, members, callback) {

	members.forEach(function (m) {
		project.access.read.addToSet(m);
	});

	project.save(function (err) {
		console.log('project saved!');

		callback(err);
	});
}












