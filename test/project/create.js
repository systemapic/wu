var assert = require('assert');
var supertest = require('supertest');
var chai = require('chai');
var expect = chai.expect;
var api = supertest('https://' + process.env.SYSTEMAPIC_DOMAIN);
var helpers = require('../helpers');
var token = helpers.token;
var httpStatus = require('http-status');
var expected = require('../../shared/errors');

module.exports = function () {
    describe('/api/project/create', function () {

        it('should be able to create empty project and get valid project in response', function (done) {
            token(function (err, access_token) {
                api.post('/api/project/create')
                    .send({
                        access_token: access_token,
                        name: 'mocha-test-project'             
                    })
                    .expect(httpStatus.OK)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }

                        var project = helpers.parse(res.text).project;
                        assert.ok(project);
                        assert.ok(project.uuid);
                        assert.equal(project.name, 'mocha-test-project');
                        done();
                    });
            });
        });

        it("should respond with status code 401 when not authenticated", function (done) {
            api.post('/api/project/create')
                .send({
                    name: 'mocha-test-project'
                })
                .expect(httpStatus.UNAUTHORIZED)
                .end(done);
        });

        it('should respond with status code 400 and specific error message if empty body', function (done) {
            token(function (err, access_token) {
                api.post('/api/project/create')
                    .send({access_token: access_token})
                    .expect(httpStatus.BAD_REQUEST, helpers.createExpectedError(expected.missing_information.errorMessage))
                    .end(done);
            });
        });

        it('should respond with status code 400 and specific error message if no project name', function (done) {
            token(function (err, access_token) {
                api.post('/api/project/create')
                    .send({
                        foo: 'mocha-test-updated-name',
                        access_token: access_token
                    })
                    .expect(httpStatus.BAD_REQUEST, helpers.createExpectedError(expected.missing_information.errorMessage))
                    .end(done);
            });
        });

    });
};