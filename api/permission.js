// database schemas
var Project 	= require('../models/project');
var Clientel 	= require('../models/client');	// weird name cause 'Client' is restricted name
var User  	= require('../models/user');
var File 	= require('../models/file');
var Layer 	= require('../models/layer');
var Hash 	= require('../models/hash');

// utils
var fs 		= require('fs-extra');
var fss 	= require("q-io/fs");
var utf8 	= require("utf8");
var async 	= require('async');
var util 	= require('util');
var request 	= require('request');
var uuid 	= require('node-uuid');
var _ 		= require('lodash-node');
var zlib 	= require('zlib');
var uploadProgress = require('node-upload-progress');
var crypto      = require('crypto');
var nodemailer  = require('nodemailer');
var nodepath    = require('path');
var gm 		= require('gm');
var request 	= require('request');
var mime 	= require("mime");
var formidable  = require('formidable');


module.exports = permission = {

	// superusers
	superusers : [
		'user-f151263a-8a2f-4bfd-86f0-53e71083fb39', 	// KO dev
		'user-5b51ff49-31f5-4a7a-b17c-d18268079d8f', 	//  J dev
		
		'user-9fed4b5f-ad48-479a-88c3-50f9ab44b17b', 	// KO rg
		'user-e6e5d7d9-3b4c-403b-ad80-a854b0215831',    //  J rg

		'user-f36e496e-e3e4-4fac-a37c-f1a98689afda'   	// dev1@noerd.biz
		
	],




	// CRUD capabilities
	to : {

		create : {
			project : function (user) {
				if (superadmin(user)) return true;
				if (user.role.admin)  return true;
				return false;
			},
			client : function (user) {
				if (superadmin(user)) return true;
				if (user.role.admin)  return true;
				return false;
			},
			
			user : function (user) {

				// can create users without any CRUD privileges
				if (superadmin(user)) return true;
				if (user.role.admin) return true;

				// if user is manager anywhere
				if (user.role.manager.projects.length > 0) return true;
				return false;
			}
		},

		delegate : {
			superadmin : function (user) {
				if (superadmin(user)) return true;
				return false;
			},
			admin : function (user) {
				if (superadmin(user)) return true;
				return false;
			},
			manager : function (user, project) {
				if (superadmin(user)) return true;

				// can add managers for own projects
				if (user.role.admin && project.createdBy == user.uuid) return true; 

				// if admin and got --U- for someone else's project
				if (user.role.admin && api.can.update.project(user, project)) return true;

				return false;
			},
			editor : function (user, project) { // project or client
				if (superadmin(user)) return true;
				
				// can create editors for own projects
				if (user.role.admin && project.createdBy == user.uuid)  return true;

				// if admin and got --U- for someone else's project
				if (user.role.admin && api.can.update.project(user, project)) return true;

				return false;
			},
			reader : function (user, project) { // project or client
				if (superadmin(user)) return true;

				// can create readers for own projects
				if (user.role.admin && project.createdBy == user.uuid)  return true;

				// if admin and got --U- for someone else's project
				if (user.role.admin && api.can.update.project(user, project)) return true;

				// managers can create readers for own projects
				if (user.role.manager.projects.indexOf(project.uuid) >= 0) return true;

				return false;
			},


		},

		read : {
			project : function (user, project) {
				if (superadmin(user)) return true;

				// admin can -R-- own projects
				if (user.role.admin && project.createdBy == user.uuid)  return true;

				// if manager, editor or reder
				// if (user.role.manager.projects.indexOf(uuid) >= 0) return true;
				// if (user.role.editor.projects.indexOf(uuid)  >= 0) return true;
				if (user.role.reader.projects.indexOf(uuid)  >= 0) return true;

				return false;
			},
			client : function (user, client) {
				if (superadmin(user)) return true;

				// admin can -R-- own clients
				if (user.role.admin && client.createdBy == user.uuid)  return true;

				// if manager, editor, reader
				// if (user.role.manager.clients.indexOf(client.uuid) >= 0) return true; 
				// if (user.role.editor.clients.indexOf(client.uuid)  >= 0) return true; 
				if (user.role.reader.clients.indexOf(client.uuid)  >= 0) return true; 

				return false;
			}
		},

		update : {
			project : function (user, project) {
				if (superadmin(user)) return true;

				// if admin and has created project oneself
				if (user.role.admin && project.createdBy == user.uuid) return true;

				// if editor of project
				if (user.role.editor.projects.indexOf(project.uuid) >= 0) return true; 

				return false;

			},
			client : function (user, client) {
				if (superadmin(user)) return true;

				// hacky error checking
				if (!client) return false;
				if (!user) return false;

				// if admin and has created client oneself
				if (user.role.admin && client.createdBy == user.uuid)  return true;

				// if editor of client
				if (user.role.editor.clients.indexOf(client.uuid) >= 0) return true; // managers can create readers for own projects

				return false;
			},
			user   : function (user, subject, uuid) {  // update of user info, not adding roles
				if (superadmin(user)) return true;

				// if user is created by User (as admin, manager)
				if (subject.createdBy == user.uuid) return true; 
				
				// if is self
				if (subject.uuid == user.uuid) return true;

				return false;				
			},

			file   : function (user, file) {
				if (superadmin(user)) return true;

				// if user can update project which contains file, then user can edit file
				var access = false;
				file.access.projects.forEach(function (p) { // p = projectUuid
					if (api.can.update.project(user, p)) access = true;
				});
				return access;

			}
		},

		remove : {
			project : function (user, project) {
				if (superadmin(user)) return true;

				// can remove own project
				if (user.role.admin && project.createdBy == user.uuid) return true;

				// if admin and editor of project
				if (user.role.admin && user.role.editor.projects.indexOf(project.uuid) >= 0) return true;
				
				// editors can not remove projects

				return false;

			},
			client : function (user, client) {
				if (superadmin(user)) return true;

				// can remove own project
				if (user.role.admin && client.createdBy == user.uuid) return true;

				// if admin and editor of project
				if (user.role.admin && user.role.editor.clients.indexOf(client.uuid) >= 0) return true;
				
				// editors can not remove projects
				return false;				
			},


			user : function (user, subject) {

				// can remove users
				if (superadmin(user)) return true;

				// can remove user if admin and created by self
				if (user.role.admin && subject.createdBy == user.uuid) return true;

				// if user is manager anywhere and created by self
				if (user.role.manager.projects.length > 0 && subject.createdBy == user.uuid) return true;
				return false;
			}
		},
	},

}


// helper function 
function isObject(obj) {
	return (Object.prototype.toString.call(obj) === '[object Object]' || Object.prototype.toString.call(obj) === '[object Array]');
}
// convenience method for checking hardcoded super user
function superadmin(user) {
	if (permission.superusers.indexOf(user.uuid) >= 0) return true;
	return false;
}