var assert = require('assert');
var mongoose = require('mongoose');
var async = require('async');
var fs = require('fs');
var crypto = require('crypto');
var request = require('request');
var User = require('../models/user');
var config = require('../config/server-config.js').serverConfig;
var utils = require('./util');
var test_user = util.test_user;


describe('Upload', function () {
	before(function(callback) {
		async.series([create_user, create_project], callback);
	});
	after(function(callback) {
		async.series([delete_project, delete_user], callback);
	});

	it('should be able to upload a zipped shapefile', function (done) {
		upload_file('data/shapefile.zip', function (err, status) {
			assert.ifError(err);
			assert.ok(status.upload_success);
			assert.ifError(status.error_code);
			assert.ifError(status.error_text);
			assert.equal(status.user_id, test_user.uuid);
			assert.equal(status.size, 109770);

			test_user.upload_status = status;
			done();
		});
	});

	it('should be able to get upload status', function (done) {
		get_upload_status(test_user.upload_status.file_id, function (err, status) {
			assert.ifError(err);
			assert.ok(status.upload_success);
			assert.ifError(status.error_code);
			assert.ifError(status.error_text);
			assert.equal(status.user_id, test_user.uuid);
			done();
		})
	});

	// wait for processing
	it.skip('should be processed in < 10s', function (done) {
		this.timeout(11000);
		this.slow(20000);
		setTimeout(done, 10000)
	});

	it('should be processed without errors', function (done) {
		get_upload_status(test_user.upload_status.file_id, function (err, status) {
			// console.log('err, sttat', err, status);
			assert.ifError(err);
			assert.ok(status.upload_success);
			assert.ifError(status.error_code);
			assert.ifError(status.error_text);
			assert.equal(status.user_id, test_user.uuid);
			assert.equal(status.data_type, 'vector');
			assert.ok(status.processing_success);
			assert.equal(status.status, 'Done');
			assert.equal(status.rows_count, 13);
			done();
		})
	});

	// todo: file object is not available yet, cause still processing file. 
	it.skip('should be able to delete file', function (done) {
		delete_file(test_user.upload_status.file_id, function (err, status) {
			assert.ifError(err);
			assert.ifError(status.error);
			assert.ok(status);
			done();
		});
	});
});


function delete_file(file_id, done) {
	util.post_to_api({
			endpoint : '/api/file/delete',
			form : {
				file_id : file_id,
			}
		}, done);
};


function get_upload_status(file_id, done) {
	util.get_access_token(function (err, tokens) {
		util.get_to_api({
			endpoint : '/api/import/status',
			query : '?file_id=' + file_id
		}, done);
	});	
}

function upload_file(path, done) {
		util.post_to_api({
			endpoint : '/api/import',
			formData : {
				userUuid : test_user.uuid,
		  	data : fs.createReadStream(__dirname + '/data/shapefile.zip'),
			}
		}, done);
};

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
