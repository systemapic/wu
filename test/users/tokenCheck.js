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

    describe(endpoints.users.token.check, function () {

        it('should respond with status code 401 when not authenticated', function (done) {
            api.post(endpoints.users.token.check)
                .send({})
                .expect(httpStatus.UNAUTHORIZED)
                .end(done);
        });

        it('should get user with access_token', function (done) {
            token(function (err, access_token) {
                api.post(endpoints.users.token.check)
                .send({ 
                    access_token : access_token
                })
                .expect(httpStatus.OK)
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }

                    var user = helpers.parse(res.text);
                    expect(user).to.exist;
                    expect(user.uuid).to.be.equal(helpers.test_user.uuid);
                    done();
                });
            });
        });

        it('should get 401 with invalid access token', function (done) {
            token(function (err, access_token) {
                api.post(endpoints.users.token.check)
                .send({ 
                    access_token : 'invalid'
                })
                .expect(httpStatus.UNAUTHORIZED)
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }

                    var response = helpers.parse(res.text);
                    expect(response).to.exist;
                    expect(response.error).to.exist;
                    expect(response.error.message).to.be.equal(expected.invalid_token.errorMessage);
                    done();
                });
            });
        });

        it('should get 401 with missing information', function (done) {
            token(function (err, access_token) {
                api.post(endpoints.users.token.check)
                .send()
                .expect(httpStatus.UNAUTHORIZED)
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }

                    var response = helpers.parse(res.text);
                    expect(response).to.exist;
                    expect(response.error).to.exist;
                    expect(response.error.message).to.be.equal(expected.invalid_token.errorMessage);
                    done();
                });
            });
        });


    });

};