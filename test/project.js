var assert = require('assert');
var mongoose = require('mongoose');
var async = require('async');
var fs = require('fs');
var crypto = require('crypto');
var request = require('request');
var supertest = require('supertest');
var api = supertest('https://' + process.env.SYSTEMAPIC_DOMAIN);
var User = require('../models/user');
var config = require('../config/server-config.js').serverConfig;
var util = require('./util');
var token = util.token;

// for easy changing of error messages
var expected = {
    missing_information : {
        error: 'Missing information. Check out https://docs.systemapic.com/ for details on the API.'
    },
    no_such_project : {
        error : 'No such project.'
    }
}

describe('Project', function () {

    // prepare
    var tmp = {};
    this.slow(500);
    before(function(done) { util.create_user(done); });
    after(function(done) { util.delete_user(done); });


    describe('Create /api/project/create', function () {

        it('should be able to create empty project and get valid project in response', function (done) {
            this.slow(1500);
            token(function (err, token) {
                api.post('/api/project/create')
                .set('Authorization', 'Bearer ' + token)
                .send({name : 'mocha-test-project'})
                .expect(200)
                .end(function (err, res) {
                    assert.ifError(err);
                    var project = util.parse(res.text).project;
                    assert.ok(project);
                    assert.ok(project.uuid);
                    assert.equal(project.name, 'mocha-test-project');
                    tmp.project = project;
                    done();
                });
            });
        });

        it("should respond with status code 401 when not authenticated", function (done) {
            api.post('/api/project/create')
                .send({
                    name : 'mocha-test-project',
                })
                .expect(401)
                .end(done);
        });

        it('should respond with status code 422 and specific error message if empty body', function (done) {
            token(function (err, token) {
                api.post('/api/project/create')
                    .set('Authorization', 'Bearer ' + token)
                    .send()
                    .expect(422, expected.missing_information)
                    .end(done);
            });
        });

        it('should respond with status code 422 and specific error message if no project name', function (done) {
            token(function (err, token) {
                api.post('/api/project/create')
                    .set('Authorization', 'Bearer ' + token)
                    .send({foo : 'mocha-test-updated-name'})
                    .expect(422, expected.missing_information)
                    .end(done);
            });
        });


    });

    describe('Update /api/project/update', function () {
 
        it('should be able to update name of project', function (done) {
            token(function (err, token) {
                api.post('/api/project/update')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    name : 'mocha-test-updated-name',
                    project_id : tmp.project.uuid
                })
                .expect(200)
                .end(function (err, res) {
                    assert.ifError(err);
                    var result = util.parse(res.text);
                    assert.equal(result.name.name, 'mocha-test-updated-name')
                    done();
                });
            });
        });

        it("should respond with status code 401 when not authenticated", function (done) {
            api.post('/api/project/update')
                .send({
                    name : 'mocha-test-updated-name',
                    project_id : 'some project id'
                })
                .expect(401)
                .end(done);
        });

        it('should respond with status code 422 and specific error message if empty body', function (done) {
            token(function (err, token) {
                api.post('/api/project/update')
                    .set('Authorization', 'Bearer ' + token)
                    .send()
                    .expect(422, expected.missing_information)
                    .end(done);
            });
        });

        it('should respond with status code 422 and specific error message if no project_id', function (done) {
            token(function (err, token) {
                api.post('/api/project/update')
                    .set('Authorization', 'Bearer ' + token)
                    .send({name : 'mocha-test-updated-name'})
                    .expect(422, expected.missing_information)
                    .end(done);
            });
        });

        it('should respond with status code 422 and specific error message if no field to update', function (done) {
            token(function (err, token) {
                api.post('/api/project/update')
                    .set('Authorization', 'Bearer ' + token)
                    .send({project_id : tmp.project.uuid})
                    .expect(422, expected.missing_information)
                    .end(done);
            });
        });

        it('should respond with status code *** and specific error message if project does not exist', function (done) {
            token(function (err, token) {
                api.post('/api/project/update')
                    .set('Authorization', 'Bearer ' + token)
                    .send({
                        name: 'mocha-test-updated-name',
                        project_id: 'incorrect project id'
                    })
                    .expect(422, expected.no_such_project)
                    .end(done);
            });
        });

    });


    describe('Delete /api/project/delete', function () {

        it('should be able to delete project', function (done) {
            token(function (err, token) {
                api.post('/api/project/delete')
                .set('Authorization', 'Bearer ' + token)
                .send({project_id : tmp.project.uuid})
                .expect(200)
                .end(function (err, res) {
                    assert.ifError(err);
                    var result = util.parse(res.text);
                    assert.ok(result.deleted);
                    assert.equal(result.project, tmp.project.uuid);
                    done();
                });
            });
        });

        it("should respond with status code 401 when not authenticated", function (done) {
            api.post('/api/project/delete')
                .send({project_id : tmp.project.uuid})
                .expect(401)
                .end(done);
        });

        it('should respond with status code 422 and specific error message if empty body', function (done) {
            token(function (err, token) {
                api.post('/api/project/delete')
                    .set('Authorization', 'Bearer ' + token)
                    .send()
                    .expect(422, expected.missing_information)
                    .end(done);
            });
        });

        it('should respond with status code 422 and specific error message if no project_id', function (done) {
            token(function (err, token) {
                api.post('/api/project/delete')
                    .set('Authorization', 'Bearer ' + token)
                    .send({foo : 'mocha-test-updated-name'})
                    .expect(422, expected.no_such_project)
                    .end(done);
            });
        });

    });

});
