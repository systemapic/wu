var supertest = require('supertest');
var chai = require('chai');
var expect = chai.expect;
var api = supertest('https://' + process.env.SYSTEMAPIC_DOMAIN);
var helpers = require('../helpers');
var token = helpers.token;
var httpStatus = require('http-status');
var expected = require('../../shared/errors');
var endpoints = require('../endpoints.js');

module.exports = function () {

    describe(endpoints.users.invite.link, function () {

        it('should respond with status code 401 when not authenticated', function (done) {
            api.get(endpoints.users.invite.link)
                .send({})
                .expect(httpStatus.UNAUTHORIZED)
                .end(done);
        });

        it('should respond with status code 400 when access doesn\'t exist in request body', function (done) {
            token(function (err, access_token) {
                if (err) {
                    return done(err);
                }
                
                api.get(endpoints.users.invite.link)
                    .query({
                        access_token: access_token
                    })
                    .send()
                    .expect(httpStatus.BAD_REQUEST)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }

                        var result = helpers.parse(res.text);

                        expect(result.error.message).to.be.equal(expected.missing_information.errorMessage);
                        expect(result.error.code).to.be.equal(httpStatus.BAD_REQUEST);
                        expect(result.error.errors.missingRequiredFields).to.include('access');
                        done();
                    });
            });
        });


        it('should respond with status code 400 when access doesn\'t exist in request body', function (done) {
            token(function (err, access_token) {
                if (err) {
                    return done(err);
                }
                
                api.get(endpoints.users.invite.link)
                    .query({
                        access_token: access_token,
                        access: "test_access"
                    })
                    .send()
                    .expect(httpStatus.OK)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }

                        expect(res.text).to.be.not.null;
                        expect(res.text).to.have.string('https://' + process.env.SYSTEMAPIC_DOMAIN + '/invite/');

                        done();
                    });
            });
        });

    });

};