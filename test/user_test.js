var assert = require('assert');
var mongoose = require('mongoose');
var async = require('async');
var fs = require('fs');
var crypto = require('crypto');
var request = require('request');
var User = require('../models/user');
var config = require('../config/wu-config.js').serverConfig;
var helpers = require('./helpers');
var token = helpers.token;
var supertest = require('supertest');
var api = supertest('https://' + process.env.SYSTEMAPIC_DOMAIN);
var endpoints = require('./endpoints.js');

describe('User', function () {
    this.slow(400);
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

    it('should get access token with username & password', function (done) {
        helpers.get_access_token(function (err, access_token) {
            assert.ifError(err);
            assert.ok(access_token);
            assert.ok(access_token.access_token);
            // todo: expires
            assert.equal(access_token.token_type, 'multipass');
            done();
        });
    });

    it('should get user info with access token', function (done) {
        token(function (err, access_token) {
            api.post(endpoints.users.token.check)
            .send({access_token : access_token})
            .expect(200)
            .end(function (err, res) {
                assert.ifError(err);
                var user = helpers.parse(res.text);
                assert.ok(user._id);
                assert.equal(user.local.email, helpers.test_user.email);
                assert.equal(user.firstName, helpers.test_user.firstName);
                done();
            });
        })
    });

    it('should get portal store with access token', function (done) {
        this.slow(700);
        token(function (err, access_token) {
            api.get(endpoints.portal)
            .send({access_token : access_token})
            .expect(200)
            .end(function (err, res) {
                assert.ifError(err);
                var store = helpers.parse(res.text);
                assert.ok(store);
                assert.ok(store.account);
                assert.ok(store.projects);
                assert.ok(store.users);
                assert.equal(store.account.local.email, helpers.test_user.email);
                assert.equal(store.account.firstName, helpers.test_user.firstName);
                done();
            });
        })
    });

    it('should delete user', function (done) {
        User
        .findOne({uuid : helpers.test_user.uuid})
        .remove()
        .exec(function (err, user) {
            assert.ifError(err);
            assert.ok(user.result.ok);
            done();
        });
    });

});
