var assert = require('assert');
var mongoose = require('mongoose');
var async = require('async');
var fs = require('fs');
var crypto = require('crypto');
var request = require('request');
var User = require('../models/user');
var config = require('../config/server-config.js').serverConfig;
var utils = require('./util');
var test_user = utils.test_user; 

describe('Project', function () {
	before(function(done) {
		util.create_user(done);
	});
	after(function(done) {
		util.delete_user(done);
	});

	it('should be able to create project', function (done) {
		util.create_project(function (err, store) {
			assert.ifError(err);
			assert.ok(store.project);
			assert.ok(store.project._id);
			assert.equal(store.project.createdBy, test_user.uuid);
			done();
		});
	});

	it('should be able to delete project', function (done) {
		util.delete_project(function (err, res) {
			assert.ifError(err);
			assert.ok(res.deleted);
			done();
		});
	});

});
