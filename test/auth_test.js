var assert = require('assert');
var mongoose = require('mongoose');
var async = require('async');
var fs = require('fs');
var crypto = require('crypto');
var request = require('request');
var User = require('../models/user');
var config = require(
  process.env.WU_CONFIG_PATH ||
  '../../config/wu-config.js'
).serverConfig;
var helpers = require('./helpers');
var token = helpers.token;
var supertest = require('supertest');
var api = supertest('https://' + process.env.SYSTEMAPIC_DOMAIN);

describe('Authentication', function () {
   
    it('should be created', function (done) {
        helpers.create_user(done);
    });

    it('should be found', function (done) {
        User.findOne({uuid : helpers.test_user.uuid}).exec(done);
    });

    it('should have correct details', function (done) {
        User.findOne({uuid : helpers.test_user.uuid})
        .exec(function (err, userModel) {
            assert.ifError(err);
            assert.equal(userModel.local.email, helpers.test_user.email);
            assert.equal(userModel.firstName, helpers.test_user.firstName);
            assert.equal(userModel.lastName, helpers.test_user.lastName);
            assert.ok(userModel._id);
            done();
        });
    });

    after(function (done) {
        helpers.delete_user(done);
    });

});
