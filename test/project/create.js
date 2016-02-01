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
                        expect(project).to.be.define;
                        expect(project.uuid).to.be.define;
                        expect(project.name).to.be.equal('mocha-test-project');
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
                    .expect(httpStatus.BAD_REQUEST)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }

                        var result = helpers.parse(res.text);
                        
                        expect(result.error.message).to.be.equal(expected.missing_information.errorMessage);
                        expect(result.error.code).to.be.equal(httpStatus.BAD_REQUEST);
                        expect(result.error.errors.missingRequiredFields).to.be.an.array;
                        expect(result.error.errors.missingRequiredFields).to.include('name');
                        done();
                    });
            });
        });

        it('should respond with status code 400 and specific error message if no project name', function (done) {
            token(function (err, access_token) {
                api.post('/api/project/create')
                    .send({
                        foo: 'mocha-test-updated-name',
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
                        expect(result.error.errors.missingRequiredFields).to.include('name');
                        done();
                    });
            });
        });

    });
};