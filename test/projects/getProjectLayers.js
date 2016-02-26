var supertest = require('supertest');
var chai = require('chai');
var expect = chai.expect;
var api = supertest('https://' + process.env.SYSTEMAPIC_DOMAIN);
var helpers = require('../helpers');
var token = helpers.token;
var httpStatus = require('http-status');
var async = require('async');
var expected = require('../../shared/errors');
var Project =  require('../../models/project');
var endpoints = require('../endpoints.js');

module.exports = function () {
    describe(endpoints.projects.get, function () {
        var projectWithoutLayers = {
            uuid: 'relatedProjectWithoutLayersUuid',
            createdBy: 'relatedProjectWithoutLayersCreatedBy',
            createdByName: 'relatedProjectWithoutLayersCreatedByName',
            createdByUsername: 'relatedProjectWithoutLayersCreatedByUsername',
            name: 'relatedProjectWithoutLayersName'
        };
        var projectWithLayers = {
            uuid: 'relatedProjectUuidWithLayers',
            createdBy: 'relatedProjectCreatedByWithLayers',
            createdByName: 'relatedProjectCreatedByNameWithLayers',
            createdByUsername: 'relatedProjectCreatedByUsernameWithLayers',
            name: 'relatedProjectNameWithLayers',
            access: {
                read: helpers.test_user.uuid
            }
        };
        var relatedLayer = {
            uuid: 'relatedLayerUuid', // @igor: it should throw error if trying to update uuid. need a test for this.
            title: 'relatedLayerTitle',
            description: 'relatedLayerDescription'
        };

        before(function (done) {
            var ops = [];

            ops.push(function (callback) {
                helpers.create_layer_by_parameters(relatedLayer, callback);
            });

            ops.push(function (params, moreParams, callback) {
                projectWithLayers.layers = [params._id];
                helpers.create_project_by_info(projectWithLayers, function (err, _projectWithLayers) {
                    if (err) {
                        return callback(err);
                    }

                    projectWithLayers = _projectWithLayers;
                    callback(null);
                });
            });

            ops.push(function (callback) {
                helpers.create_project_by_info(projectWithoutLayers, function (err, _projectWithoutLayers) {
                    if (err) {
                        return callback(err);
                    }

                    projectWithoutLayers = _projectWithoutLayers;
                    callback(null, projectWithoutLayers);
                });
            });

            async.waterfall(ops, done);
        });

        after(function (done) {
            var ops = [];

            ops.push(function (callback) {
                helpers.delete_project_by_id(projectWithoutLayers.uuid, callback);
            });

            ops.push(function (params, callback) {
                helpers.delete_layer_by_id(relatedLayer.uuid, callback);
            });

            ops.push(function (params, callback) {
                helpers.delete_project_by_id(projectWithLayers.uuid, callback);
            });

            async.waterfall(ops, done)
        });

        it('should respond with status code 401 when not authenticated', function (done) {
            api.get(endpoints.projects.getLayers)
                .send({})
                .expect(httpStatus.UNAUTHORIZED)
                .end(done);
        });

        it('should respond with status code 400 and error if project id doesn\'t exist in request body', function (done) {
            token(function (err, access_token) {
                if (err) {
                    return done(err);
                }

                api.get(endpoints.projects.getLayers)
                    .query({
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
                        expect(result.error.errors.missingRequiredFields).to.include('project');
                        done();
                    });
            });
        });

        it('should respond with status code 404 if project doesn\'t exist', function (done) {
            token(function (err, access_token) {
                if (err) {
                    return done(err);
                }

                api.get(endpoints.projects.getLayers)
                    .query({
                        project: 'Bad project uuid',
                        access_token: access_token
                    })
                    .expect(httpStatus.NOT_FOUND)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }

                        var result = helpers.parse(res.text);

                        expect(result.error.message).to.be.equal(expected.no_such_project.errorMessage);
                        expect(result.error.code).to.be.equal(httpStatus.NOT_FOUND);
                        done();
                    });
            });
        });

        context('when user have not access', function () {
            it('should respond with status code 404 if user have not access', function (done) {
                token(function (err, access_token) {
                    if (err) {
                        return done(err);
                    }

                    api.get(endpoints.projects.getLayers)
                        .query({
                            project: projectWithoutLayers.uuid,
                            access_token: access_token
                        })
                        .expect(httpStatus.NOT_FOUND)
                        .end(function (err, res) {
                            if (err) {
                                return done(err);
                            }

                            var result = helpers.parse(res.text);

                            expect(result.error.message).to.be.equal(expected.no_such_project.errorMessage);
                            expect(result.error.code).to.be.equal(httpStatus.NOT_FOUND);
                            done();
                        });
                });
            });
        });

        context('when user have access', function () {

            before(function (done) {
                Project.findOne({uuid: projectWithoutLayers.uuid})
                    .exec(function (err, result) {
                        if (err) {
                            return done(err);
                        }

                        result.access = {
                            read: helpers.test_user.uuid
                        };
                        result.markModified('access');
                        result.save(done);
                    });
            });

            it('should respond with status 200 and return empty layers array if project have\'t related layers', function (done) {
                token(function (err, access_token) {
                    if (err) {
                        return done(err);
                    }

                    api.get(endpoints.projects.getLayers)
                        .query({
                            project: projectWithoutLayers.uuid,
                            access_token: access_token
                        })
                        .expect(httpStatus.OK)
                        .end(function (err, res) {
                            if (err) {
                                return done(err);
                            }

                            var result = helpers.parse(res.text);

                            expect(result).to.be.an.array;
                            expect(result).to.be.empty;
                            done();
                        });
                });
            });

            it('should respond with status 200 and return related layers array if project have related layers', function (done) {
                token(function (err, access_token) {
                    if (err) {
                        return done(err);
                    }

                    api.get(endpoints.projects.getLayers)
                        .query({
                            project: projectWithLayers.uuid,
                            access_token: access_token
                        })
                        .expect(httpStatus.OK)
                        .end(function (err, res) {
                            if (err) {
                                return done(err);
                            }

                            var result = helpers.parse(res.text);
                            expect(result).to.be.an.array;
                            expect(result).to.be.not.empty;
                            done();
                        });
                });
            });
        });

    });
};