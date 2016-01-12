var assert = require('assert');
var mongoose = require('mongoose');
var async = require('async');
var fs = require('fs');
var crypto = require('crypto');
var request = require('request');
var User = require('../models/user');
var config = require('../config/server-config.js').serverConfig;
mongoose.connect(config.mongo.url); 

module.exports = util = { 

	test_user : { 
		email : 'mocha_test_user@systemapic.com',
		firstName : 'John',
		lastName : 'Doe',
		uuid : 'test-user-uuid',
		password : 'test-user-password'
	},

	get_access_token : function (done) {
		var options = {
			url : 'https://' + process.env.SYSTEMAPIC_DOMAIN + '/oauth/token',
			headers : {'Authorization': 'Basic YWJjMTIzOnNzaC1zZWNyZXQ='},
			form : { 
				grant_type : 'password',
				username : util.test_user.email,
				password : util.test_user.password
			}
		};
		request.post(options, function (err, res, body) {
			done && done(err, util.parse(body));
		});
	},

	post_to_api : function (options, done) {
		util.get_access_token(function (err, tokens) {
			options.headers = {'Authorization': 'Bearer ' + tokens.access_token};
			options.url = 'https://' + process.env.SYSTEMAPIC_DOMAIN + options.endpoint;
			request.post(options, function (err, res, body) {
				done && done(err, util.parse(body));
			});
		});
	},

	get_to_api : function (options, done) {
		util.get_access_token(function (err, tokens) {
			var url = 'https://' + process.env.SYSTEMAPIC_DOMAIN + options.endpoint + options.query + '&access_token=' + tokens.access_token;
			request(url, function (err, response, body) {
				var parsed = util.parse(body);
				done(err, parsed);
			});
		});
	},

	parse : function (body) {
		try {
			var parsed = JSON.parse(body)
		} catch (e) {
			console.log('failed to parse:', body);
			throw e;
			return;
		}
		return parsed;
	},

	create_user : function (done) {
		var user = new User();
		user.local.email = util.test_user.email;	
		user.local.password = user.generateHash(util.test_user.password);
		user.uuid = util.test_user.uuid;
		user.firstName = util.test_user.firstName;
		user.lastName = util.test_user.lastName;
		user.save(done);
	},

	delete_user : function (done) {
		User
		.findOne({uuid : util.test_user.uuid})
		.remove()
		.exec(done);
	},

	create_project : function (done) {
		var projectOptions = {
			name : 'mocha test project',
			access : {
				edit : [],
				read : [],
				options : {
					download : true,
					isPublic : true,
					share : true
				}
			}
		}
		util.post_to_api({
			endpoint : '/api/project/create',
			form : projectOptions
		}, function (err, store) {
			util.test_user.pid = store.project.uuid;
			done(err, store);
		});
	},

	delete_project : function (done) {
		util.post_to_api({
			endpoint : '/api/project/delete',
			form : {
				projectUuid : util.test_user.pid
			}
		}, done)
	},


	delete_file : function (file_id, done) {
		util.post_to_api({
			endpoint : '/api/file/delete',
			form : {
				file_id : file_id,
			}
		}, done);
	},


	get_upload_status : function (file_id, done) {
		util.get_access_token(function (err, tokens) {
			util.get_to_api({
				endpoint : '/api/import/status',
				query : '?file_id=' + file_id
			}, done);
		});	
	},

	upload_file : function (path, done) {
		util.post_to_api({
			endpoint : '/api/import',
			formData : {
				userUuid : util.test_user.uuid,
		  	data : fs.createReadStream(__dirname + '/data/shapefile.zip'),
			}
		}, done);
	}


}