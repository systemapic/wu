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

describe('User', function () {
	it('should be created', function (done) {
		util.create_user(done);
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
