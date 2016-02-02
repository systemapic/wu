var assert = require('assert');
var mongoose = require('mongoose');
var async = require('async');
var fs = require('fs');
var crypto = require('crypto');
var request = require('supertest');
var User = require('../models/user');
var Project = require('../models/project');
var Layer = require('../models/layer');
var File = require('../models/file');
var config = require('../config/wu-config.js').serverConfig;
var helpers = require('./helpers');
var token = helpers.token;
var supertest = require('supertest');
var api = supertest('https://' + process.env.SYSTEMAPIC_DOMAIN);
var httpStatus = require('http-status');
var tmp = {};
var chai = require('chai');
var expect = chai.expect;
var expected = require('../shared/errors');
var httpStatus = require('http-status');

describe('Import shapefile', function () {
   
    // prepare test
    before(function(callback) {
        // create tmp user, project
        async.series([helpers.create_user, helpers.create_project], callback);
    });
    after(function(callback) {
        // delete tmp user, project
        async.series([helpers.delete_project, helpers.delete_user], callback);
    });


    
    describe('shapefile with POLYGON geom', function () {
        this.slow(500);

        context('zipped', function () {
            this.timeout(21000);
            it('should upload', function (done) {
                token(function (err, access_token) {
                    api.post('/api/import')
                    .type('form')
                    .field('access_token', access_token)
                    .field('data', fs.createReadStream(__dirname + '/data/shapefile.polygon.zip'))
                    .expect(httpStatus.OK)
                    .end(function (err, res) {
                        assert.ifError(err);
                        var result = helpers.parse(res.text);
                        assert.ok(result.file_id);
                        assert.ok(result.user_id);
                        assert.ok(result.upload_success);
                        assert.equal(result.filename, 'shapefile.polygon.zip');
                        assert.equal(result.status, 'Processing');
                        assert.ifError(result.error_code);
                        assert.ifError(result.error_text);

                        tmp.file_id = result.file_id;
                        done();
                    });
                });
            });

            it('should get upload status', function (done) {
                token(function (err, access_token) {
                    api.get('/api/import/status')
                    .query({file_id : tmp.file_id, access_token : access_token})
                    .expect(httpStatus.OK)
                    .end(function (err, res) {
                        assert.ifError(err);
                        var result = helpers.parse(res.text);
                        assert.ok(result.file_id);
                        assert.ok(result.user_id);
                        assert.ok(result.upload_success);
                        assert.equal(result.filename, 'shapefile.polygon.zip');
                        assert.equal(result.status, 'Processing');
                        assert.ifError(result.error_code);
                        assert.ifError(result.error_text);
                        done();
                    });
                })
            });

        });

        context.skip('with missing .prj file', function () {

            it('should upload', function (done) {
                token(function (err, access_token) {
                    api.post('/api/import')
                    .type('form')
                    .field('userUuid', util.test_user.uuid)
                    .field('access_token', access_token)
                    .field('data', fs.createReadStream(__dirname + '/data/shapefile.missing-prj.zip'))
                    .expect(httpStatus.OK)
                    .end(function (err, res) {
                        assert.ifError(err);
                        var result = helpers.parse(res.text);
                        assert.ok(result.file_id);
                        assert.ok(result.user_id);
                        assert.ok(result.upload_success);
                        assert.equal(result.filename, 'shapefile.missing-prj.zip');
                        assert.equal(result.status, 'Processing');
                        assert.ifError(result.error_code);
                        assert.ifError(result.error_text);

                        tmp.file_id = result.file_id;
                        done();
                    });
                });
            });

            it('should get upload status', function (done) {
                token(function (err, access_token) {
                    api.get('/api/import/status')
                    .query({ file_id : tmp.file_id, access_token : access_token})
                    .expect(httpStatus.OK)
                    .end(function (err, res) {
                        assert.ifError(err);
                        var result = helpers.parse(res.text);
                        assert.ok(result.file_id);
                        assert.ok(result.user_id);
                        assert.ok(result.upload_success);
                        assert.equal(result.filename, 'shapefile.missing-prj.zip');
                        assert.equal(result.status, 'Processing');
                        assert.ifError(result.error_code);
                        assert.ifError(result.error_text);
                        done();
                    });
                })
            });
        });

        context('Processing', function () {

            it('should be processed in < 20s', function (done) {       
                // wait to finish processing (around ten seconds for shapefile.zip)       
                this.timeout(21000); // must be higher than setTimeout        
                this.slow(20000);     
                setTimeout(done, 20000)       
            });

            it('should be processed without errors', function (done) {
                token(function (err, access_token) {
                    api.get('/api/import/status')
                    .query({file_id : tmp.file_id, access_token : access_token})
                    .expect(httpStatus.OK)
                    .end(function (err, res) {
                        assert.ifError(err);
                        var status = helpers.parse(res.text);
                        assert.ifError(err);
                        assert.ok(status.upload_success);
                        assert.ifError(status.error_code);
                        assert.ifError(status.error_text);
                        assert.equal(status.user_id, helpers.test_user.uuid);
                        assert.equal(status.data_type, 'vector');
                        assert.ok(status.processing_success);
                        assert.equal(status.status, 'Done');
                        assert.equal(status.rows_count, 13);
                        done();
                    });
                })
            });

            context('when delete file after upload', function () {
                var relatedLayer = {
                    uuid: 'relatedLayerUuid',
                    title: 'relatedLayerTitle',
                    description: 'relatedLayerDescription',
                    file: 'relatedLayerFile',
                };
                var relatedProject = {
                    uuid: 'relatedProjectUuid',
                    createdBy: 'relatedProjectCreatedBy',
                    createdByName: 'relatedProjectCreatedByName',
                    createdByUsername: 'relatedProjectCreatedByUsername',
                    name: 'relatedProjectName'
                };

                before(function (done) {
                    var ops = [];

                    ops.push(function (callback) {
                
                        relatedLayer.data = {
                            postgis: {
                                table_name: tmp.file_id
                            }
                        };

                        helpers.create_layer_by_parameters(relatedLayer, function (err, res) {
                            if (err) {
                                callback(err);
                            }
                            relatedLayer = res;
                            callback(null, relatedLayer);
                        });
                    });

                    ops.push(function (options, callback) {
                        relatedProject.layers = [options];

                        helpers.create_project_by_info(relatedProject, function (err, res) {
                            if (err) {
                                callback(err);
                            }

                            relatedProject = res;
                            callback(null, relatedProject);
                        });
                    });

                    async.waterfall(ops, done);
                });

                after(function (done) {
                    var ops = [];

                    ops.push(function (callback) {
                        helpers.delete_project_by_id(relatedProject.uuid, callback);
                    });

                    ops.push(function (options, callback) {
                        helpers.delete_layer_by_id(relatedLayer.uuid, callback);
                    });

                    async.waterfall(ops, done);     
                });

                it('should be able to delete file correctly', function (done) {
                    var ops = [];

                    ops.push(function (callback) {
                        token(function (err, access_token) {
                            api.post('/api/file/delete')
                            .send({file_id : tmp.file_id, access_token : access_token})
                            .expect(httpStatus.OK)
                            .end(function (err, res) {
                                if (err) {
                                    return callback(err);
                                }

                                var result = helpers.parse(res.text);
                                expect(result.success).to.be.true;

                                callback(null, result);
                            });
                        });
                    });

                    ops.push(function (options, callback) {
                        Project.findOne({uuid: relatedProject.uuid})
                            .exec(function (err, updatedProject) {
                                if (err) {
                                    return callback(err);
                                }
                                expect(updatedProject.layers).to.be.empty;
                                callback(null, updatedProject);
                            });
                    });

                    ops.push(function (options, callback) {
                        Layer.find({uuid: relatedLayer.uuid})
                            .exec(function (err, updatedLayer) {
                                if (err) {
                                    return callback(err);
                                }
                                expect(updatedLayer).to.be.empty;
                                callback(null, updatedLayer);
                            });
                    });

                    ops.push(function (options, callback) {
                        File.find({uuid: tmp.file_id})
                            .exec(function (err, result) {
                                if (err) {
                                    return callback(err);
                                }
                                expect(result).to.be.empty;
                                callback(null, result);
                            });
                    });

                    async.waterfall(ops, done); 
                });

            });

        });

    });

});

       
