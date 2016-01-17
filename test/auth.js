var assert = require('assert');
var mongoose = require('mongoose');
var async = require('async');
var fs = require('fs');
var crypto = require('crypto');
var request = require('request');
var User = require('../models/user');
var config = require('../config/server-config.js').serverConfig;
var util = require('./util');
var token = util.token;
var supertest = require('supertest');
var api = supertest('https://' + process.env.SYSTEMAPIC_DOMAIN);

describe('Authentication', function () {
   
    it('should be created', function (done) {
        util.create_user(done);
    });

    it('should be found', function (done) {
        User.findOne({uuid : util.test_user.uuid}).exec(done);
    });

    it('should have correct details', function (done) {
        User.findOne({uuid : util.test_user.uuid})
        .exec(function (err, userModel) {
            assert.ifError(err);
            assert.equal(userModel.local.email, util.test_user.email);
            assert.equal(userModel.firstName, util.test_user.firstName);
            assert.equal(userModel.lastName, util.test_user.lastName);
            assert.ok(userModel._id);
            done();
        });
    });

});