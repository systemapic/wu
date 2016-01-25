var supertest = require('supertest');
var chai = require('chai');
var expect = chai.expect;
var api = supertest('https://' + process.env.SYSTEMAPIC_DOMAIN);
var helpers = require('./helpers');
var _ = require('lodash');
var token = helpers.token;
var expected = require('../shared/errors');
var Layer   = require('../models/layer');
var Project = require('../models/project');
var async = require('async');
var httpStatus = require('http-status');

describe('Layer', function () {

    before(function(done) { helpers.create_user(done); });
    after(function(done) { helpers.delete_user(done); });

    describe('/api/layers/new', function () {
        
        var newLayer = {
            title: 'new mocha test layer title',
            description: 'new mocha test layer description',   // html
        };

        it('should respond with status code 401 when not authenticated', function (done) {
            api.post('/api/layers/new')
                .send({})
                .expect(401)
                .end(done);
        });

        it('should respond with status code 200 and create new layer', function (done) {
            token(function (err, access_token) {
                if (err) {
                    return done(err);
                }

                newLayer.access_token = access_token;
                api.post('/api/layers/new')
                    .send(newLayer)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }

                        var result = helpers.parse(res.text);
                        expect(_.size(result.uuid)).to.be.equal(42);
                        expect(result.title).to.be.equal(newLayer.title);
                        expect(result.description).to.be.equal(newLayer.description);

                        newLayer.uuid = result.uuid;
                        done();
                    });
            });
        });

        after(function (done) {
            Layer.findOne({uuid : newLayer.uuid})
                .remove()
                .exec(done);
        });

    });

    // skipping for now, because we need to make HUGE changes on the layer specs.. @igor: interested?
    describe.skip('/api/layer/update', function () {

        var newLayerParameters = {
            uuid: 'new mocha test layer uuid', // @igor: it should throw error if trying to update uuid. need a test for this.
            title: 'new mocha test layer title',
            description: 'new mocha test layer description'
        };
        var layerUpdates = {
            layer: 'new mocha test layer uuid',
            title: 'update mocha test layer title',
            description: 'update mocha test layer description',
            satellite_position: 'update mocha test layer satellite_position',
            copyright: 'update mocha test layer copyright',
            tooltip: 'update mocha test layer tooltip',
            style: 'update mocha test layer style',
            filter: 'update mocha test layer filter',
            legends: 'update mocha test layer legends',
            opacity: 'update mocha test layer opacity',
            zIndex: 4,
            data: {
                    geojson     : 'update mocha test layer geojson',       // file uuid, file saved on server - needs to be if over 4MB (mongodb limit)
                    topojson    : 'update mocha test layer topojson',       // file uuid ... // simply request, check auth, serve file.
                    
                    cartoid     : 'update mocha test layer cartoid',
                    raster      : 'update mocha test layer raster',

                    rastertile  : 'update mocha test layer rastertile',       // server raster path: raster/hubble2/hubble
                    vectortile  : 'update mocha test layer vectortile',       // server vector tile: vector/bigassvector/bigvector
                    mapbox      : 'update mocha test layer mapbox',       // mapbox id: rawger.geography-class
                    cartodb     : 'update mocha test layer cartodb',       // cartodb id: 
                    osm         : 'update mocha test layer osm',       // osm id?
                    norkart     : 'update mocha test layer norkart',
                    google      : 'update mocha test layer google',

                    postgis : {

                        sql : 'update mocha test layer sql',
                        cartocss : 'update mocha test layer cartocss',
                        cartocss_version : 'update mocha test layer cartocss_version',
                        geom_column : 'update mocha test layer geom_column',
                        file_id : 'update mocha test layer file_id',
                        database_name : 'update mocha test layer database_name',
                        table_name : 'update mocha test layer table_name',
                        data_type : 'update mocha test layer data_type',
                        geom_type : 'update mocha test layer geom_type',
                        raster_band : 4,
                        layer_id : 'update mocha test layer layer_id',
                        metadata : 'update mocha test layer metadata',
                    }
                }
        };
        var tmpLayer;

        before(function(done) {
            helpers.create_layer_by_parameters(newLayerParameters, function (err, result) {
                if (err) {
                    return done(err);
                }

                tmpLayer = result;
                done();
            });
        });

        after(function(done) {
            helpers.delete_layer_by_id(tmpLayer.uuid, function (err, result) {
                if (err) {
                    return done(err);
                }
                done();
            })
        })

        it('should respond with status code 401 when not authenticated', function (done) {
            api.post('/api/layer/update')
                .send({})
                .expect(401)
                .end(done);
        });

        it('should respond with status code 422 and error if layer doesn\'t exist in request body', function (done) {
            token(function (err, access_token) {
                if (err) {
                    return done(err);
                }

                api.post('/api/layer/update')
                    .send({access_token : access_token})
                    .expect(422, helpers.createExpectedError(expected.missing_information.errorMessage))
                    .end(done);                
            });
        });

        it('should respond with status code 422 and error if layer doesn\'t exist', function (done) {
            token(function (err, access_token) {
                if (err) {
                    return done(err);
                }

                api.post('/api/layer/update')
                    .send({
                        layer: 'bad layer',
                        access_token : access_token
                    })
                    .expect(422, helpers.createExpectedError(expected.missing_information.errorMessage))
                    .end(done);
            });
        });

      
        it('should respond with status code 200 and update layer correctly', function (done) {
            token(function (err, access_token) {
                if (err) {
                    return done(err);
                }

                var ops = [];

                layerUpdates.access_token = access_token;
                layerUpdates.layer = tmpLayer.layer;

                ops.push(function (callback) {
                    api.post('/api/layer/update')
                        .send(layerUpdates)
                        .expect(200)
                        .end(function (err, res) {
                            if (err) {
                                return callback(err);
                            }

                            callback(null, res);
                        });
                });

                ops.push(function (options, callback) {
                    Layer.findOne({uuid : layerUpdates.layer})
                        .exec(function (err, res) {
                            if (err) {
                                return callback(err);
                            }
                            expect(options.text).to.be.equal('save done');
                            expect(res.uuid).to.be.equal(layerUpdates.layer);
                            expect(res.title).to.be.equal(layerUpdates.title);
                            expect(res.description).to.be.equal(layerUpdates.description);
                            expect(res.satellite_position).to.be.equal(layerUpdates.satellite_position);
                            expect(res.copyright).to.be.equal(layerUpdates.copyright);
                            expect(res.tooltip).to.be.equal(layerUpdates.tooltip);
                            expect(res.style).to.be.equal(layerUpdates.style);
                            expect(res.filter).to.be.equal(layerUpdates.filter);
                            expect(res.legends).to.be.equal(layerUpdates.legends);
                            expect(res.opacity).to.be.equal(layerUpdates.opacity);
                            expect(res.zIndex).to.be.equal(layerUpdates.zIndex);
                            expect(res.data.geojson).to.be.equal(layerUpdates.data.geojson);
                            expect(res.data.topojson).to.be.equal(layerUpdates.data.topojson);
                            expect(res.data.cartoid).to.be.equal(layerUpdates.data.cartoid);
                            expect(res.data.raster).to.be.equal(layerUpdates.data.raster);
                            expect(res.data.rastertile).to.be.equal(layerUpdates.data.rastertile);
                            expect(res.data.vectortile).to.be.equal(layerUpdates.data.vectortile);
                            expect(res.data.mapbox).to.be.equal(layerUpdates.data.mapbox);
                            expect(res.data.cartodb).to.be.equal(layerUpdates.data.cartodb);
                            expect(res.data.osm).to.be.equal(layerUpdates.data.osm);
                            expect(res.data.norkart).to.be.equal(layerUpdates.data.norkart);
                            expect(res.data.google).to.be.equal(layerUpdates.data.google);
                            expect(res.data.postgis.sql).to.be.equal(layerUpdates.data.postgis.sql);
                            expect(res.data.postgis.cartocss).to.be.equal(layerUpdates.data.postgis.cartocss);
                            expect(res.data.postgis.cartocss_version).to.be.equal(layerUpdates.data.postgis.cartocss_version);
                            expect(res.data.postgis.geom_column).to.be.equal(layerUpdates.data.postgis.geom_column);
                            expect(res.data.postgis.file_id).to.be.equal(layerUpdates.data.postgis.file_id);
                            expect(res.data.postgis.database_name).to.be.equal(layerUpdates.data.postgis.database_name);
                            expect(res.data.postgis.table_name).to.be.equal(layerUpdates.data.postgis.table_name);
                            expect(res.data.postgis.data_type).to.be.equal(layerUpdates.data.postgis.data_type);
                            expect(res.data.postgis.geom_type).to.be.equal(layerUpdates.data.postgis.geom_type);
                            expect(res.data.postgis.raster_band).to.be.equal(layerUpdates.data.postgis.raster_band);
                            expect(res.data.postgis.layer_id).to.be.equal(layerUpdates.data.postgis.layer_id);
                            expect(res.data.postgis.metadata).to.be.equal(layerUpdates.data.postgis.metadata);
                            callback();
                        });
                });
                async.waterfall(ops, function (err, result) {
                    if (err) {
                        return done(err);
                    }

                    done();
                });
            });
        });

    });


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
                        access_token : access_token
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
                        access_token : access_token
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
                            access_token : access_token
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
                            access_token : access_token
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
                            access_token : access_token
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
});