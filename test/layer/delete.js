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

module.exports = function () {
    // skipping for now, because we need to make HUGE changes on the layer specs.. @igor: interested?
    describe('/api/layers', function () {
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
            api.post('/api/layers')
                .send({})
                .expect(401)
                .end(done);
        });

        it('should respond with status code 400 and error if project id doesn\'t exist in request body', function (done) {
            token(function (err, access_token) {
                if (err) {
                    return done(err);
                }

                api.post('/api/layers')
                    .send({
                        access_token: access_token
                    })
                    .expect(400)
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

                api.post('/api/layers')
                    .send({
                        project: 'Bad project uuid',
                        access_token: access_token
                    })
                    .expect(404)
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

                    api.post('/api/layers')
                        .send({
                            project: projectWithoutLayers.uuid,
                            access_token: access_token
                        })
                        .expect(404)
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

                    api.post('/api/layers')
                        .send({
                            project: projectWithoutLayers.uuid,
                            access_token: access_token
                        })
                        .expect(200)
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

                    api.post('/api/layers')
                        .send({
                            project: projectWithLayers.uuid,
                            access_token: access_token
                        })
                        .expect(200)
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

    describe('/api/layers/delete', function () {

        var layerInfoRelatedWithProjet = {
            uuid: 'new layer related with projet uuid',
            title: 'new layer related with projet title',
            description: 'new layer related with projet description'
        };
        var projectInfo = {
            uuid: 'projectInfoUuid',
            createdBy: 'projectInfoCreatedBy',
            createdByName: 'projectInfoCreatedByName',
            createdByUsername: 'projectInfoCreatedByUsername',
            name: 'projectInfoName',
            access: {
                read: helpers.test_user.uuid
            }
        };
        var layerInfo = {
            uuid: 'new layer uuid',
            title: 'new layer title',
            description: 'new layer description'
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

        it('should respond with status code 401 when not authenticated', function (done) {
            api.post('/api/layers/delete')
                .send({})
                .expect(401)
                .end(done);
        });

        it('should respond with status code 400 if layer_id and project_id doesn\'t exist in request body', function (done) {
            token(function (err, access_token) {
                if (err) {
                    return done(err);
                }

                api.post('/api/layers/delete')
                    .send({
                        access_token: access_token
                    })
                    .expect(400)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }

                        var result = helpers.parse(res.text);
                        expect(result.error.errors.missingRequiredFields).to.be.an.array;
                        expect(result.error.errors.missingRequiredFields).to.include('layer_id');
                        expect(result.error.errors.missingRequiredFields).to.include('project_id');
                        done();
                    });
            });
        });

        it('should respond with status code 400 if layer_id doesn\'t exist in request body', function (done) {
            token(function (err, access_token) {
                if (err) {
                    return done(err);
                }

                api.post('/api/layers/delete')
                    .send({
                        access_token: access_token,
                        project_id: 'some_id'
                    })
                    .expect(400)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }

                        var result = helpers.parse(res.text);
                        expect(result.error.errors.missingRequiredFields).to.be.an.array;
                        expect(result.error.errors.missingRequiredFields).to.include('layer_id');
                        done();
                    });
            });
        });

        it('should respond with status code 400 if project_id doesn\'t exist in request body', function (done) {
            token(function (err, access_token) {
                if (err) {
                    return done(err);
                }

                api.post('/api/layers/delete')
                    .send({
                        layer_id: 'some id',
                        access_token: access_token
                    })
                    .expect(400)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }

                        var result = helpers.parse(res.text);
                        expect(result.error.errors.missingRequiredFields).to.be.an.array;
                        expect(result.error.errors.missingRequiredFields).to.include('project_id');
                        done();
                    });
            });
        });

        it('should respond with status 404 if layer doesn\'t exist', function (done) {
            token(function (err, access_token) {
                if (err) {
                    return done(err);
                }

                api.post('/api/layers/delete')
                    .send({
                        layer_id: 'some id',
                        project_id: projectInfo.uuid,
                        access_token: access_token
                    })
                    .expect(404)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }

                        var result = helpers.parse(res.text);

                        expect(result.error.message).to.be.equal(expected.no_such_layers.errorMessage);
                        expect(result.error.code).to.be.equal(httpStatus.NOT_FOUND);
                        done();
                    });
            });
        });

        it('should respond with status 404 and remove layer if project doesn\'t exist', function (done) {
            token(function (err, access_token) {
                if (err) {
                    return done(err);
                }

                api.post('/api/layers/delete')
                    .send({
                        layer_id: layerInfo.uuid,
                        project_id: 'some id',
                        access_token: access_token
                    })
                    .expect(404)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }

                        var result = helpers.parse(res.text);

                        expect(result.error.message).to.be.equal(expected.no_such_project.errorMessage);
                        expect(result.error.code).to.be.equal(httpStatus.NOT_FOUND);

                        Layer.find({uuid: layerInfo.uuid})
                            .exec(function (err, _layers) {
                                if (err) {
                                    return done(err);
                                }
                                expect(_layers).to.be.an.array;
                                expect(_layers).to.be.empty;
                                done();
                            });
                    });
            });
        });

        it('should respond with status 200 and remove layers', function (done) {
            token(function (err, access_token) {
                if (err) {
                    return done(err);
                }

                api.post('/api/layers/delete')
                    .send({
                        layer_id: layerInfoRelatedWithProjet.uuid,
                        project_id: projectInfo.uuid,
                        access_token: access_token
                    })
                    .expect(200)
                    .end(function (err, res) {
                        var ops = [];

                        if (err) {
                            return done(err);
                        }

                        var result = helpers.parse(res.text);
                        expect(result.success).to.be.true;

                        ops.push(function (callback) {
                            Project.findOne({uuid: projectInfo.uuid})
                                .exec(function (err, _project) {
                                    if (err) {
                                        return callback(err);
                                    }

                                    expect(_project.layers).to.be.an.array;
                                    expect(_project.layers).to.be.empty;
                                    callback(null);
                                });
                        });

                        ops.push(function (callback) {
                            Layer.find({uuid: layerInfoRelatedWithProjet.uuid})
                                .exec(function (err, _layers) {
                                    if (err) {
                                        return callback(err);
                                    }

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