var assert = require('assert');
var mongoose = require('mongoose');
var async = require('async');
var fs = require('fs');
var crypto = require('crypto');
var User = require('../../models/user');
var Project = require('../../models/project');
var Layer = require('../../models/layer');
var File = require('../../models/file');
var config = require(
  process.env.WU_CONFIG_PATH ||
  '../../../config/wu-config.js'
).serverConfig;
var helpers = require('../helpers');
var token = helpers.token;
var supertest = require('supertest');
var api = supertest('https://' + process.env.SYSTEMAPIC_DOMAIN);
var httpStatus = require('http-status');
var path = require('path');
var chai = require('chai');
var expect = chai.expect;
var expected = require('../../shared/errors');
var httpStatus = require('http-status');
var endpoints = require('../endpoints.js');
var tmp = {};
var testData = require('../shared/upload/import_data.json');

module.exports = function () {

    describe('Shapefile', function () {
       
        // prepare test
        before(function(callback) {
            // create tmp user, project
            async.series([helpers.create_project], callback);
        });
        after(function(callback) {
            // delete tmp user, project
            async.series([helpers.delete_project], callback);
        });
        
        describe('POST ' + endpoints.import.post, function () {
            this.slow(500);

            // context('shapefile.polygon.zip', function () {
                this.timeout(21000);
                
                it('upload shapefile.polygon.zip', function (done) {
                    token(function (err, access_token) {
                        api.post(endpoints.import.post)
                        .type('form')
                        .field('access_token', access_token)
                        .field('data', fs.createReadStream(path.resolve(__dirname, '../open-data/shapefile.polygon.zip')))
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

                it('get status', function (done) {
                    token(function (err, access_token) {
                        api.get(endpoints.import.status)
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

            // });

        //     context.skip('shapefile.missing-prj.zip', function () {

        //         it('upload shapefile.missing-prj.zip', function (done) {
        //             token(function (err, access_token) {
        //                 api.post(endpoints.import.post)
        //                 .type('form')
        //                 .field('userUuid', util.test_user.uuid)
        //                 .field('access_token', access_token)
        //                 .field('data', fs.createReadStream(path.resolve(__dirname, '../open-data/shapefile.missing-prj.zip')))
        //                 .expect(httpStatus.OK)
        //                 .end(function (err, res) {
        //                     assert.ifError(err);
        //                     var result = helpers.parse(res.text);
        //                     assert.ok(result.file_id);
        //                     assert.ok(result.user_id);
        //                     assert.ok(result.upload_success);
        //                     assert.equal(result.filename, 'shapefile.missing-prj.zip');
        //                     assert.equal(result.status, 'Processing');
        //                     assert.ifError(result.error_code);
        //                     assert.ifError(result.error_text);

        //                     tmp.file_id = result.file_id;
        //                     done();
        //                 });
        //             });
        //         });

        //         it('get status', function (done) {
        //             token(function (err, access_token) {
        //                 api.get(endpoints.import.status)
        //                 .query({ file_id : tmp.file_id, access_token : access_token})
        //                 .expect(httpStatus.OK)
        //                 .end(function (err, res) {
        //                     assert.ifError(err);
        //                     var result = helpers.parse(res.text);
        //                     assert.ok(result.file_id);
        //                     assert.ok(result.user_id);
        //                     assert.ok(result.upload_success);
        //                     assert.equal(result.filename, 'shapefile.missing-prj.zip');
        //                     assert.equal(result.status, 'Processing');
        //                     assert.ifError(result.error_code);
        //                     assert.ifError(result.error_text);
        //                     done();
        //                 });
        //             })
        //         });
        //     });

        // // });






        // describe('Process', function () {
            this.slow(500);

            it('should be processed', function (done) {       
                this.timeout(11000);     
                this.slow(5000);

                token(function (err, access_token) {
                // check for processing status
                    var processingInterval = setInterval(function () {
                    process.stdout.write('.');
                        api.get(endpoints.import.status)
                        .query({ file_id : tmp.file_id, access_token : access_token})
                        .end(function (err, res) {
                            assert.ifError(err);
                            var status = helpers.parse(res.text);
                          
                            // return when import done
                            if (status.processing_success) {
                                clearInterval(processingInterval);
                                done();
                            }
                        });
                    }, 500);
                });

            });

            it('should be processed without errors', function (done) {
                token(function (err, access_token) {
                    api.get(endpoints.import.status)
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

        // });

        });


        describe('GET ' + endpoints.import.download, function () {
            this.slow(500);
            
            it("200 & download as file", function (done) {
                token(function (err, access_token) {
                    if (err) {
                        return done(err);
                    }

                    api.get(endpoints.import.download)
                        .query({file_id: tmp.file_id, access_token: access_token})
                        .expect(httpStatus.OK)
                        .end(function (err, res) {
                            if (err) {
                                return done(err);
                            }

                            var result = helpers.parse(res.text);

                            expect(result.file.type).to.be.equal('postgis');
                            expect(result.file.originalName).to.be.equal('shapefile.polygon.zip');
                            expect(result.file.name).to.be.equal('shapefile.polygon');
                            done();
                        });
                });
            });

        });

        describe('POST ' + endpoints.data.delete, function () {
            this.slow(500);
            
            var relatedLayer = testData.relatedLayer;
            var relatedProject = testData.relatedProject;

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
                        api.post(endpoints.data.delete)
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

};
