var supertest = require('supertest');
var chai = require('chai');
var expect = chai.expect;
var api = supertest('https://' + process.env.SYSTEMAPIC_DOMAIN);
var helpers = require('../helpers');
var token = helpers.token;
var httpStatus = require('http-status');
var expected = require('../../shared/errors');
var fs = require('fs');
var path = require('path');

module.exports = function () {
    describe.only('/api/project/uploadlogo', function () {

        it("should respond with status code 401 when not authenticated", function (done) {
            api.post('/api/project/uploadlogo')
                .send({})
                .expect(httpStatus.UNAUTHORIZED)
                .end(done);
        });


        it('should respond with status code 400 and specific error message if image_id or resumableIdentifier don\'t exist in request body', function (done) {
            token(function (err, access_token) {
                api.post('/api/project/uploadlogo')
                    .send({
                        access_token: access_token
                    })
                    .expect(httpStatus.BAD_REQUEST)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }

                        var result = helpers.parse(res.text);
                        expect(result.error.message).to.be.equal(expected.missing_information.errorMessage);
                        expect(result.error.code).to.be.equal(httpStatus.BAD_REQUEST);
                        expect(result.error.errors.missingRequiredFields).to.be.an.array;
                        expect(result.error.errors.missingRequiredFields).to.include('resumableIdentifier');
                        expect(result.error.errors.missingRequiredFields).to.include('image_id');
                        done();
                    });
            });
        });


    });
};