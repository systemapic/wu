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
		async.series([util.create_user, util.create_project], callback);
	});
	after(function(callback) {
		async.series([util.delete_project, util.delete_user], callback);
	});

	it('should be able to upload a zipped shapefile', function (done) {
		util.upload_file('data/shapefile.zip', function (err, status) {
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
		util.get_upload_status(test_user.upload_status.file_id, function (err, status) {
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

	it.skip('should be processed without errors', function (done) {
		util.get_upload_status(test_user.upload_status.file_id, function (err, status) {
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
		util.delete_file(test_user.upload_status.file_id, function (err, status) {
			assert.ifError(err);
			assert.ifError(status.error);
			assert.ok(status);
			done();
		});
	});
});

