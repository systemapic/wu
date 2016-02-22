var supertest = require('supertest');
var chai = require('chai');
var expect = chai.expect;
var api = supertest('https://' + process.env.SYSTEMAPIC_DOMAIN);
var helpers = require('../helpers');
var httpStatus = require('http-status');
var expected = require('../../shared/errors');
var token = util.token;
var endpoints = require('../endpoints.js');

module.exports = function () {

    describe(endpoints.users.token.token, function () {

        it('should respond with status code 400 and error if username and email don\'t exist in request body', function (done) {

            api.get(endpoints.users.token.token)
                .send({})
                .expect(httpStatus.BAD_REQUEST)
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }

                    var result = helpers.parse(res.text);
                    expect(result.error.errors.missingRequiredFields).to.be.an.array;
                    expect(result.error.errors.missingRequiredFields).to.include('username or email');

                    done();
                });

        });

        it('should respond with status code 400 and error if password doesn\'t exist in request body', function (done) {

            api.get(endpoints.users.token.token)
                .send({
                    username: 'some user'
                })
                .expect(httpStatus.BAD_REQUEST)
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }

                    var result = helpers.parse(res.text);
                    expect(result.error.errors.missingRequiredFields).to.be.an.array;
                    expect(result.error.errors.missingRequiredFields).to.include('password');

                    done();
                });

        });

        it('should respond with status code 404 and error if user with specific username doesn\'t exist', function (done) {

            api.get(endpoints.users.token.token)
                .send({
                    username: 'some user',
                    password: 'some password'
                })
                .expect(httpStatus.NOT_FOUND)
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }

                    var result = helpers.parse(res.text);
                    expect(result.error.message).to.be.equal(expected.no_such_user.errorMessage);
                    done();
                });

        });

        it('should respond with status code 404 and error if user with specific email doesn\'t exist', function (done) {

            api.get(endpoints.users.token.token)
                .send({
                    email: 'some user',
                    password: 'some password'
                })
                .expect(httpStatus.NOT_FOUND)
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }

                    var result = helpers.parse(res.text);
                    expect(result.error.message).to.be.equal(expected.no_such_user.errorMessage);
                    done();
                });

        });

        it('should get access token with token() shorthand', function (done) {
            token(function (err, access_token) {
                if (err) {
                    return done(err);
                }

                expect(access_token).to.exist;
                expect(access_token.length).to.be.equal(43);
                done();
            });
        });

        it('should respond with status code 400 and error if user with specific username exists but password is wrong', function (done) {

            api.get(endpoints.users.token.token)
                .send({
                    username: helpers.test_user.username,
                    password: 'some wrong password'
                })
                .expect(httpStatus.BAD_REQUEST)
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }

                    var result = helpers.parse(res.text);
                    expect(result.error.message).to.be.equal(expected.invalid_credentials.errorMessage);
                    done();
                });

        });

        it('should get access token with email and password', function (done) {
            api.get(endpoints.users.token.token)
            .send({ 
                username : helpers.test_user.email,
                password : helpers.test_user.password
            })
            .expect(httpStatus.OK)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }

                var tokens = helpers.parse(res.text);
                expect(tokens).to.exist;
                expect(tokens.access_token).to.exist;
                expect(tokens.access_token.length).to.be.equal(43);
                expect(tokens.token_type).to.be.equal('multipass');
                done();
            });
        });

        it('should get access token with username and password', function (done) {
            api.get(endpoints.users.token.token)
            .send({ 
                username : helpers.test_user.username,
                password : helpers.test_user.password
            })
            .expect(httpStatus.OK)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }

                var tokens = helpers.parse(res.text);
                expect(tokens).to.exist;
                expect(tokens.access_token).to.exist;
                expect(tokens.access_token.length).to.be.equal(43);
                expect(tokens.token_type).to.be.equal('multipass');
                done();
            });
        });
    });

};