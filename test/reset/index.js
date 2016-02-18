var supertest = require('supertest');
var chai = require('chai');
var expect = chai.expect;
var api = supertest('https://' + process.env.SYSTEMAPIC_DOMAIN);
var helpers = require('../helpers');
var httpStatus = require('http-status');
var expected = require('../../shared/errors');
var endpoints = require('../endpoints.js');

module.exports = function () {

    describe(endpoints.users.password.reset, function () {

        it('should respond with status code 400 and error if emai doesn\'t exist in request body', function (done) {

            api.post(endpoints.users.password.reset)
                .send({})
                .expect(httpStatus.BAD_REQUEST)
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }

                    var result = helpers.parse(res.text);
                    expect(result.error.errors.missingRequiredFields).to.be.an.array;
                    expect(result.error.errors.missingRequiredFields).to.include('email');
                    done();
                });

        });

        it('should respond with status code 404 and error if user with specific email doesn\'t exist', function (done) {

            api.post(endpoints.users.password.reset)
                .send({
                    email: 'some.email.com'
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

        it('should respond with status code 200', function (done) {

            api.post(endpoints.users.password.reset)
                .send({
                	email: helpers.test_user.email
                })
                .expect(httpStatus.OK)
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }

                    expect(res.text).to.be.equal('Please check your email for password reset link.');
                    done();
                });
                
        });

    });

};