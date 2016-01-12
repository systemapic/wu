var assert = require('assert');
var mongoose = require('mongoose');
var async = require('async');
var fs = require('fs');
var crypto = require('crypto');
var request = require('request');
var User = require('../models/user');
var config = require('../config/server-config.js').serverConfig;
mongoose.connect(config.mongo.url); 
var supertest = require('supertest');
var api = supertest('https://' + process.env.SYSTEMAPIC_DOMAIN);

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

	token : function (done) {
		util.get_access_token(function (err, tokens) {
			done(err, tokens.access_token);
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
		util.token(function (err, token) {
			api.post('/api/project/create')
			.set('Authorization', 'Bearer ' + token)
			.send({name : 'mocha-test-project'})
			.expect(200)
			.end(function (err, res) {
				assert.ifError(err);
				var project = util.parse(res.text).project;
				assert.ok(project);
				assert.ok(project.uuid);
				assert.equal(project.name, 'mocha-test-project');
				// tmp.project = project;
				util.test_user.pid = project.uuid;
				done();
			});
		});
	},

	delete_project : function (done) {
		util.token(function (err, token) {
			api.post('/api/project/delete')
			.set('Authorization', 'Bearer ' + token)
			.send({projectUuid : util.test_user.pid})
			.expect(200)
			.end(done);
		});
	},

}