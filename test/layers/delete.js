var supertest = require('supertest');
var chai = require('chai');
var expect = chai.expect;
var api = supertest('https://' + process.env.SYSTEMAPIC_DOMAIN);
var helpers = require('./../helpers');
var _ = require('lodash');
var token = helpers.token;
var expected = require('../../shared/errors');
var Layer   = require('../../models/layer');
var Project = require('../../models/project');
var async = require('async');
var httpStatus = require('http-status');
var endpoints = require('../endpoints.js');
var testData = require('../shared/layers/delete.json');

module.exports = function () {

    describe(endpoints.layers.delete, function () {

        var layerInfoRelatedWithProjet = testData.layerInfoRelatedWithProjet;
        var projectInfo = testData.projectInfo;
        var layerInfo = testData.layerInfo;

        projectInfo.access = {
            read: helpers.test_user.uuid
        };

        before(function (done) {
            var ops = [];
            ops.push(function (callback) {
                helpers.create_layer_by_parameters(layerInfoRelatedWithProjet, callback);
            });
            ops.push(function (params, moreParams, callback) {
                projectInfo.layers = [params._id];
                helpers.create_project_by_info(projectInfo, callback);
            });
            ops.push(function (params, moreParams, callback) {
                helpers.create_layer_by_parameters(layerInfo, callback);
            });
            async.waterfall(ops, done);
        });

        after(function (done) {
            var ops = [];
            ops.push(function (callback) {
                helpers.delete_layer_by_id(layerInfoRelatedWithProjet.uuid, callback);
            });
            ops.push(function (params, callback) {
                helpers.delete_project_by_id(projectInfo.uuid, callback);
            });
            ops.push(function (params, callback) {
                helpers.delete_layer_by_id(layerInfo.uuid, callback);
            });
            async.waterfall(ops, done)
        });




        // test 1
        it('should respond with status code 401 when not authenticated', function (done) {
            api.post(endpoints.layers.delete)
                .send({})
                .expect(httpStatus.UNAUTHORIZED)
                .end(done);
        });



        // test 2
        it('should respond with status code 400 if layer_id and project_id doesn\'t exist in request body', function (done) {
            token(function (err, access_token) {
                if (err) return done(err);
                api.post(endpoints.layers.delete)
                    .send({
                        access_token: access_token
                    })
                    .expect(400)
                    .end(function (err, res) {
                        if (err) return done(err);
                        var result = helpers.parse(res.text);
                        expect(result.error.errors.missingRequiredFields).to.be.an.array;
                        expect(result.error.errors.missingRequiredFields).to.include('layer_id');
                        expect(result.error.errors.missingRequiredFields).to.include('project_id');
                        done();
                    });
            });
        });



        // test 3
        it('should respond with status code 400 if layer_id doesn\'t exist in request body', function (done) {
            token(function (err, access_token) {
                if (err) return done(err);
                api.post(endpoints.layers.delete)
                    .send({
                        access_token: access_token,
                        project_id: 'some_id'
                    })
                    .expect(400)
                    .end(function (err, res) {
                        if (err) return done(err);
                        var result = helpers.parse(res.text);
                        expect(result.error.errors.missingRequiredFields).to.be.an.array;
                        expect(result.error.errors.missingRequiredFields).to.include('layer_id');
                        done();
                    });
            });
        });



        // test 4
        it('should respond with status code 400 if project_id doesn\'t exist in request body', function (done) {
            token(function (err, access_token) {
                if (err) return done(err);
                api.post(endpoints.layers.delete)
                    .send({
                        layer_id: 'some id',
                        access_token: access_token
                    })
                    .expect(400)
                    .end(function (err, res) {
                        if (err) return done(err);
                        var result = helpers.parse(res.text);
                        expect(result.error.errors.missingRequiredFields).to.be.an.array;
                        expect(result.error.errors.missingRequiredFields).to.include('project_id');
                        done();
                    });
            });
        });



        // test 5
        it('should respond with status 404 if layer doesn\'t exist', function (done) {
            token(function (err, access_token) {
                if (err) return done(err);
                api.post(endpoints.layers.delete)
                    .send({
                        layer_id: 'some id',
                        project_id: projectInfo.uuid,
                        access_token: access_token
                    })
                    .expect(404)
                    .end(function (err, res) {
                        if (err) return done(err);
                        var result = helpers.parse(res.text);
                        expect(result.error.message).to.be.equal(expected.no_such_layers.errorMessage);
                        expect(result.error.code).to.be.equal(httpStatus.NOT_FOUND);
                        done();
                    });
            });
        });



        // test 6
        it('should respond with status 404 and remove layer if project doesn\'t exist', function (done) {
            token(function (err, access_token) {
                if (err) return done(err);
                api.post(endpoints.layers.delete)
                    .send({
                        layer_id: layerInfo.uuid,
                        project_id: 'some id',
                        access_token: access_token
                    })
                    .expect(404)
                    .end(function (err, res) {
                        if (err) return done(err);
                        var result = helpers.parse(res.text);
                        expect(result.error.message).to.be.equal(expected.no_such_project.errorMessage);
                        expect(result.error.code).to.be.equal(httpStatus.NOT_FOUND);
                        Layer
                        .find({uuid: layerInfo.uuid})
                        .exec(function (err, _layers) {
                            if (err) return done(err);
                            expect(_layers).to.be.an.array;
                            expect(_layers).to.be.empty;
                            done();
                        });
                    });
            });
        });



        // test 7
        it('should respond with status 200 and remove layers', function (done) {
            token(function (err, access_token) {
                if (err) return done(err);
                api.post(endpoints.layers.delete)
                    .send({
                        layer_id: layerInfoRelatedWithProjet.uuid,
                        project_id: projectInfo.uuid,
                        access_token: access_token
                    })
                    .expect(200)
                    .end(function (err, res) {
                        if (err) return done(err);
                        var ops = [];
                        var result = helpers.parse(res.text);
                        expect(result.success).to.be.true;
                        ops.push(function (callback) {
                            Project
                            .findOne({uuid: projectInfo.uuid})
                            .exec(function (err, _project) {
                                if (err) return callback(err);
                                expect(_project.layers).to.be.an.array;
                                expect(_project.layers).to.be.empty;
                                callback(null);
                            });
                        });
                        ops.push(function (callback) {
                            Layer
                            .find({uuid: layerInfoRelatedWithProjet.uuid})
                            .exec(function (err, _layers) {
                                if (err) return callback(err);
                                expect(_layers).to.be.an.array;
                                expect(_layers).to.be.empty;
                                callback(null);
                            });
                        });
                        async.parallel(ops, done);
                    });
            });
        });

    });
};