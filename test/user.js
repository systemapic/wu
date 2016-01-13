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

describe('User', function () {
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

    it('should get access token with username & password', function (done) {
        util.get_access_token(function (err, token) {
            assert.ifError(err);
            assert.ok(token);
            assert.ok(token.access_token);
            assert.equal(token.expires_in, 36000);
            assert.equal(token.token_type, 'Bearer');
            done(err);
        });
    });

    it('should get user info with access token', function (done) {
        token(function (err, token) {
            api.post('/api/userinfo')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end(function (err, res) {
                assert.ifError(err);
                var store = util.parse(res.text);
                assert.ok(store.user._id);
                assert.equal(store.user.local.email, util.test_user.email);
                assert.equal(store.user.firstName, util.test_user.firstName);
                done();
            });
        })
    });

    it('should get portal store with access token', function (done) {
        this.slow(700);
        token(function (err, token) {
            api.post('/api/portal')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end(function (err, res) {
                assert.ifError(err);
                var store = util.parse(res.text);
                assert.ok(store);
                assert.ok(store.account);
                assert.ok(store.projects);
                assert.ok(store.users);
                assert.equal(store.account.local.email, util.test_user.email);
                assert.equal(store.account.firstName, util.test_user.firstName);
                done();
            });
        })
    });

    it('should delete user', function (done) {
        User
        .findOne({uuid : util.test_user.uuid})
        .remove()
        .exec(function (err, user) {
            assert.ifError(err);
            assert.ok(user.result.ok);
            done();
        });
    });

});
