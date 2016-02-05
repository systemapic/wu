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
var api = supertest('http://localhost:3001');
var httpStatus = require('http-status');

describe('Access', function () {
    this.slow(200);

    before(function (done) {
        helpers.create_user(done);
    });
    after(function (done) {
        helpers.delete_user(done);
    });

    context('/api/token', function () {
        it('should get access token with email and password', function (done) {
            api.post('/api/token')
            .send({ 
                username : helpers.test_user.email,
                password : helpers.test_user.password
            })
            .expect(200)
            .end(function (err, res) {
                assert.ifError(err);
                var tokens = helpers.parse(res.text);
                assert.ok(tokens);
                assert.ok(tokens.access_token);
                assert.equal(tokens.access_token.length, 43);
                assert.equal(tokens.token_type, 'multipass');
                // todo: expires
                done();
            });
        });

        it('should get access token with username and password', function (done) {
            api.post('/api/token')
            .send({ 
                username : helpers.test_user.username,
                password : helpers.test_user.password
            })
            .expect(200)
            .end(function (err, res) {
                assert.ifError(err);
                var tokens = helpers.parse(res.text);
                assert.ok(tokens);
                assert.ok(tokens.access_token);
                assert.equal(tokens.access_token.length, 43);
                assert.equal(tokens.token_type, 'multipass');
                // todo: expires
                done();
            });
        });

        it('should get access token with token() shorthand', function (done) {
            token(function (err, access_token) {
                assert.ifError(err);
                assert.ok(access_token);
                assert.equal(access_token.length, 43);
                done();
            });
        });

        it('should get 401 if wrong password', function (done) {
            api.post('/api/token')
            .send({ 
                username : helpers.test_user.email,
                password : 'wrong-password'
            })
            .expect(httpStatus.UNAUTHORIZED)
            .end(function (err, res) {
                assert.ifError(err);
                var response = helpers.parse(res.text);
                assert.ok(response);
                assert.ok(response.error);
                assert.equal(response.error, 'Invalid credentials.');
                done();
            });
        });

        it('should get 401 if wrong email', function (done) {
            api.post('/api/token')
            .send({ 
                username : 'wrong-email',
                password : 'wrong-password'
            })
            .expect(httpStatus.UNAUTHORIZED)
            .end(function (err, res) {
                assert.ifError(err);
                var response = helpers.parse(res.text);
                assert.ok(response);
                assert.ok(response.error);
                assert.equal(response.error, 'Invalid credentials.');
                done();
            });
        });

        it('should get 401 if missing information', function (done) {
            api.post('/api/token')
            .send()
            .expect(httpStatus.UNAUTHORIZED)
            .end(function (err, res) {
                assert.ifError(err);
                var response = helpers.parse(res.text);
                assert.ok(response);
                assert.ok(response.error);
                assert.equal(response.error, 'Invalid credentials.');
                done();
            });
        });

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
