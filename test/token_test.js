var assert = require('assert');
var mongoose = require('mongoose');
var async = require('async');
var fs = require('fs');
var crypto = require('crypto');
var request = require('request');
var User = require('../models/user');
var config = require('../config/wu-config.js').serverConfig;
var helpers = require('./helpers');
var token = util.token;
var supertest = require('supertest');
var api = supertest('https://' + process.env.SYSTEMAPIC_DOMAIN);
var httpStatus = require('http-status');

describe('Access', function () {
    this.slow(200);

    before(function (done) {
        helpers.create_user(done);
    });
    after(function (done) {
        helpers.delete_user(done);
    });

    context('/api/token/refresh', function () {
        it('should get a refreshed access token with access token', function (done) {
            token(function (err, access_token) {
                api.post('/api/token/refresh')
                .send({ 
                    access_token : access_token
                })
                .expect(200)
                .end(function (err, res) {
                    assert.ifError(err);
                    var tokens = helpers.parse(res.text);
                    assert.ok(tokens);
                    assert.ok(tokens.access_token);
                    assert.ok(tokens.access_token != access_token);
                    done();
                });
            });
        });

        it('should get 401 with invalid access token', function (done) {
            token(function (err, access_token) {
                api.post('/api/token/refresh')
                .send({ 
                    access_token : 'invalid'
                })
                .expect(httpStatus.UNAUTHORIZED)
                .end(function (err, res) {
                    assert.ifError(err);
                    var response = helpers.parse(res.text);
                    assert.ok(response);
                    assert.ok(response.error);
                    assert.equal(response.error, 'Invalid access token.');
                    done();
                });
            });
        });

        it('should get 401 if missing information', function (done) {
            api.post('/api/token/refresh')
            .send()
            .expect(httpStatus.UNAUTHORIZED)
            .end(function (err, res) {
                assert.ifError(err);
                var response = helpers.parse(res.text);
                assert.ok(response);
                assert.ok(response.error);
                assert.equal(response.error, 'Invalid access token.');
                done();
            });
        });
    });

    context('/api/token/check', function () {
        it('should get user with access_token', function (done) {
            token(function (err, access_token) {
                api.post('/api/token/check')
                .send({ 
                    access_token : access_token
                })
                .expect(200)
                .end(function (err, res) {
                    assert.ifError(err);
                    var user = helpers.parse(res.text);
                    assert.ok(user);
                    assert.equal(user.uuid, helpers.test_user.uuid);
                    done();
                });
            });
        });

        it('should get 401 with invalid access token', function (done) {
            token(function (err, access_token) {
                api.post('/api/token/check')
                .send({ 
                    access_token : 'invalid'
                })
                .expect(httpStatus.UNAUTHORIZED)
                .end(function (err, res) {
                    assert.ifError(err);
                    var response = helpers.parse(res.text);
                    assert.ok(response);
                    assert.ok(response.error);
                    assert.equal(response.error, 'Invalid access token.');
                    done();
                });
            });
        });

        it('should get 401 with missing information', function (done) {
            token(function (err, access_token) {
                api.post('/api/token/check')
                .send()
                .expect(httpStatus.UNAUTHORIZED)
                .end(function (err, res) {
                    assert.ifError(err);
                    var response = helpers.parse(res.text);
                    assert.ok(response);
                    assert.ok(response.error);
                    assert.equal(response.error, 'Invalid access token.');
                    done();
                });
            });
        });
    });

});
