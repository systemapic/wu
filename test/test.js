var assert = require('assert');
var mongoose = require('mongoose');
var async = require('async');
var fs = require('fs');
var crypto = require('crypto');
var request = require('request');
var User = require('../models/user');
var config = require('../config/server-config.js').serverConfig;
var utils = require('./util');

// vars
var test_user = utils.test_user; 

describe('User', function () {
	it('should be created', function (done) {
		create_user(done);
	});

	it('should be found', function (done) {
		User.findOne({uuid : test_user.uuid}).exec(done);
	});

	it('should have correct details', function (done) {
		User.findOne({uuid : test_user.uuid})
		.exec(function (err, userModel) {
			assert.ok(userModel.local.email == test_user.email);
			assert.ok(userModel.firstName == test_user.firstName);
			assert.ok(userModel.lastName == test_user.lastName);
			assert.ok(userModel._id);
			done(err);
		});
	});

	it('should get access token with username & password', function (done) {
		util.get_access_token(function (err, token) {
			assert.ok(token);
			assert.ok(token.access_token);
			assert.equal(token.expires_in, 36000);
			assert.equal(token.token_type, 'Bearer');
			done(err);
		});
	});

	it('should get portal store with access token', function (done) {
		util.post_to_api({
			endpoint : '/api/userinfo'
		}, function (err, store) {
			assert.ifError(err);
			assert.ok(store.user._id);
			assert.equal(store.user.local.email, test_user.email);
			assert.equal(store.user.firstName, test_user.firstName);
			done();
		});
	});

	it('should delete user', function (done) {
		User
		.findOne({uuid : test_user.uuid})
		.remove()
		.exec(function (err, user) {
			assert.ifError(err);
			assert.ok(user.result.ok);
			done();
		});
	});

});




describe('Project', function () {
	before(function(done) {
		create_user(done);
	});
	after(function(done) {
		delete_user(done);
	});

	it('should be able to create project', function (done) {
		create_project(function (err, store) {
			assert.ifError(err);
			assert.ok(store.project);
			assert.ok(store.project._id);
			assert.equal(store.project.createdBy, test_user.uuid);
			done();
		});
	});

	it('should be able to delete project', function (done) {
		delete_project(function (err, res) {
			assert.ifError(err);
			assert.ok(res.deleted);
			done();
		});
	});

});




// function delete_file(file_id, done) {
// 	post_to_api({
// 			endpoint : '/api/file/delete',
// 			form : {
// 				file_id : file_id,
// 			}
// 		}, done);
// };


// function get_upload_status(file_id, done) {
// 	get_access_token(function (err, tokens) {
// 		get_to_api({
// 			endpoint : '/api/import/status',
// 			query : '?file_id=' + file_id
// 		}, done);
// 	});	
// }

// function upload_file(path, done) {
// 		post_to_api({
// 			endpoint : '/api/import',
// 			formData : {
// 				userUuid : test_user.uuid,
// 		  	data : fs.createReadStream(__dirname + '/data/shapefile.zip'),
// 			}
// 		}, done);
// };


// function get_to_api(options, done) {
// 	get_access_token(function (err, tokens) {
// 		var url = 'https://' + process.env.SYSTEMAPIC_DOMAIN + options.endpoint + options.query + '&access_token=' + tokens.access_token;
// 		request(url, function (err, response, body) {
// 			var parsed = parse(body);
// 			done(err, parsed);
// 		});
// 	});
// };

// helper fn's
// -----------
// POST: /oauth/token
// function get_access_token(done) {
// 	var options = {
// 		url : 'https://' + process.env.SYSTEMAPIC_DOMAIN + '/oauth/token',
// 		headers : {'Authorization': 'Basic YWJjMTIzOnNzaC1zZWNyZXQ='},
// 		form : { 
// 			grant_type : 'password',
// 			username : test_user.email,
// 			password : test_user.password
// 		}
// 	};
// 	request.post(options, function (err, res, body) {
// 		done && done(err, JSON.parse(body));
// 	});
// };

// function post_to_api(options, done) {
// 	get_access_token(function (err, tokens) {
// 		options.headers = {'Authorization': 'Bearer ' + tokens.access_token};
// 		options.url = 'https://' + process.env.SYSTEMAPIC_DOMAIN + options.endpoint;
// 		request.post(options, function (err, res, body) {
// 			done && done(err, parse(body));
// 		});
// 	});
// };

// function parse(body) {
// 	try {
// 		var parsed = JSON.parse(body)
// 	} catch (e) {
// 		console.log('failed to parse:', body);
// 		throw e;
// 		return;
// 	}
// 	return parsed;
// }

function create_user(done) {
	var user = new User();
	user.local.email = test_user.email;	
	user.local.password = user.generateHash(test_user.password);
	user.uuid = test_user.uuid;
	user.firstName = test_user.firstName;
	user.lastName = test_user.lastName;
	user.save(done);
}

function delete_user(done) {
	User
	.findOne({uuid : test_user.uuid})
	.remove()
	.exec(done);
}

function create_project(done) {
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
		test_user.pid = store.project.uuid;
		done(err, store);
	});
}

function delete_project(done) {
	util.post_to_api({
		endpoint : '/api/project/delete',
		form : {
			projectUuid : test_user.pid
		}
	}, done)
}