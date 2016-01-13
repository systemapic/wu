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


// todo:    - all updates on project (see api.project.js:440), check that update is correct.
//      - document what key/value fields are needed as options for the different updates
//      - create tests for error handling: missing fields, wrong data, too large data, impossible values, etc. should return 403/422 etc. with good error description.


describe('Project', function () {

    // prepare
    var tmp = {};
    this.slow(500);
    before(function(done) { util.create_user(done); });
    after(function(done) { util.delete_user(done); });


    it('should be able to create empty project and get valid project in response', function (done) {
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

    it('should be able to delete project', function (done) {
        token(function (err, token) {
            api.post('/api/project/delete')
            .set('Authorization', 'Bearer ' + token)
            .send({projectUuid : tmp.project.uuid})
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

});
