var assert = require('assert');
var mongoose = require('mongoose');
var async = require('async');
var fs = require('fs');
var crypto = require('crypto');
var httpStatus = require('http-status');
var path = require('path');
var chai = require('chai');
var expect = chai.expect;
var expected = require('../../shared/errors');
var testData = require('../shared/upload/import_data.json');
var endpoints = require('../endpoints.js');
var helpers = require('../helpers');
var token = helpers.token;
var supertest = require('supertest');
var api = supertest('https://' + process.env.SYSTEMAPIC_DOMAIN);
var tmp = {};
var Project = require('../../models/project');
var Layer = require('../../models/layer');
var File = require('../../models/file');

module.exports = function () {

    describe('Import points.gz', function () {

        before(function(callback) {
            async.series([helpers.create_project], callback);
        });

        after(function(callback) {
            async.series([helpers.delete_project], callback);
        });

        describe(endpoints.import.post, function () {
	        this.slow(500);

	        context('shapefile.polygon.zip', function () {
	            this.timeout(21000);
	            
	            it('upload', function (done) {
	                token(function (err, access_token) {
	                    api.post(endpoints.import.post)
		                    .type('form')
		                    .field('access_token', access_token)
		                    .field('data', fs.createReadStream(path.resolve(__dirname, '../resources/points.gz')))
		                    .expect(httpStatus.OK)
		                    .end(function (err, res) {
		                    	if (err) {
		                    		return done(err);
		                    	}

		                        var result = helpers.parse(res.text);

		                        expect(result.file_id).to.exist;
		                        expect(result.user_id).to.exist;
		                        expect(result.upload_success).to.exist;
		                        expect(result.filename).to.be.equal('points.gz');
		                        expect(result.status).to.be.equal('Processing');

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
	                    	if (err) {
	                    		return done(err);
	                    	}

	                        var result = helpers.parse(res.text);
	                        
	                        expect(result.file_id).to.exist;
	                        expect(result.user_id).to.exist;
	                        expect(result.upload_success).to.exist;
	                        expect(result.filename).to.be.equal('points.gz');
	                        expect(result.status).to.be.equal('Processing');
	                        done();
	                    });
	                });
	            });

        	});
		});

    });

    describe('Process', function () {
        this.slow(500);

        it('should be processed', function (done) {
            this.timeout(11000);
            this.slow(5000);

            // check for processing status
            var processingInterval = setInterval(function () {
                process.stdout.write('.');
                token(function (err, access_token) {
                    api.get(endpoints.import.status)
                    .query({ file_id : tmp.file_id, access_token : access_token})
                    .end(function (err, res) {
                    	if (err) {
                    		return done(err);
                    	}

                        var status = helpers.parse(res.text);
                        
                        if (status.processing_success) {
                            clearInterval(processingInterval);
                            done();
                        }
                    });
                });
            }, 500);

        });

        it('should be processed without errors', function (done) {
            token(function (err, access_token) {
                api.get(endpoints.import.status)
                .query({file_id : tmp.file_id, access_token : access_token})
                .expect(httpStatus.OK)
                .end(function (err, res) {
                	if (err) {
                		return done(err);
                	}

                    var status = helpers.parse(res.text);

                    expect(status.upload_success).to.exist;
                    expect(status.status).to.be.equal('Done');
                    expect(status.rows_count).to.be.equal('14874');
                    expect(status.user_id).to.be.equal(helpers.test_user.uuid);
                    expect(status.data_type).to.be.equal('vector');
                    done();
                });
            })
        });

    });


    describe(endpoints.import.download, function () {
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
                        expect(result.file.originalName).to.be.equal('points.gz');
                        expect(result.file.name).to.be.equal('points');
                        done();
                    });
            });
        });

    });

    describe(endpoints.data.delete, function () {
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

};