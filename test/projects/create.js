var supertest = require('supertest');
var chai = require('chai');
var expect = chai.expect;
var api = supertest('https://' + process.env.SYSTEMAPIC_DOMAIN);
var helpers = require('../helpers');
var token = helpers.token;
var httpStatus = require('http-status');
var expected = require('../../shared/errors');
var endpoints = require('../endpoints.js');
var Project = require('../../models/project');
var _ = require('lodash');

module.exports = function () {
    describe(endpoints.projects.create, function () {
        var tmpProject = '';

        after(function (done) {
            helpers.delete_project_by_id(tmpProject, done);
        });
        // test 1
        it('should be able to create empty project and get valid project in response', function (done) {
            token(function (err, access_token) {
                api.post(endpoints.projects.create)
                    .send({
                        access_token: access_token,
                        name: 'empty-mocha-test-project'             
                    })
                    .expect(httpStatus.OK)
                    .end(function (err, res) {
                        if (err) return done(err);
                        var project = helpers.parse(res.text).project;
                        expect(project).to.exist;
                        expect(project.uuid).to.exist;
                        expect(project.name).to.be.equal('empty-mocha-test-project');
                        tmpProject = project.uuid;
                        done();
                    });
            });
        });


        // test 2
        it("should respond with status code 401 when not authenticated", function (done) {
            api.post(endpoints.projects.create)
                .send({
                    name: 'mocha-test-project'
                })
                .expect(httpStatus.UNAUTHORIZED)
                .end(done);
        });


        // test 3
        it('should respond with status code 400 and specific error message if empty body', function (done) {
            token(function (err, access_token) {
                api.post(endpoints.projects.create)
                    .send({access_token: access_token})
                    .expect(httpStatus.BAD_REQUEST)
                    .end(function (err, res) {
                        if (err) return done(err);
                        var result = helpers.parse(res.text);
                        expect(result.error.message).to.be.equal(expected.missing_information.errorMessage);
                        expect(result.error.code).to.be.equal(httpStatus.BAD_REQUEST);
                        expect(result.error.errors.missingRequiredFields).to.be.an.array;
                        expect(result.error.errors.missingRequiredFields).to.include('name');
                        done();
                    });
            });
        });


        // test 4
        it('should respond with status code 400 and specific error message if no project name', function (done) {
            token(function (err, access_token) {
                api.post(endpoints.projects.create)
                    .send({
                        foo: 'mocha-test-updated-name',
                        access_token: access_token
                    })
                    .expect(httpStatus.BAD_REQUEST)
                    .end(function (err, res) {
                        if (err) return done(err);
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