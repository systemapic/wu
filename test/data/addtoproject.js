var supertest = require('supertest');
var chai = require('chai');
var expect = chai.expect;
var api = supertest('https://' + process.env.SYSTEMAPIC_DOMAIN);
var helpers = require('../helpers');
var token = helpers.token;
var expected = require('../../shared/errors');
var httpStatus = require('http-status');
var async = require('async');
var Project = require('../../models/project');
var endpoints = require('../endpoints.js');

// variables, todo: move to shared file
var fileInfo = {
    uuid : 'fileInfoUuid',
    files : [],
    name : 'fileInfoName',
    originalName : 'fileInfoOriginalName',
    description : 'fileInfoDescription'
};
var relatedProjectInfo = {
    uuid: 'relatedProjectInfo',
    createdBy: 'relatedProjectCreatedBy',
    createdByName: 'relatedProjectCreatedByName',
    createdByUsername: 'relatedProjectCreatedByUsername',
    name: 'relatedProjectName',
    access: {
        read: helpers.test_user.uuid
    }
};
var relatedLayerInfo = {
    uuid: 'relatedLayerUuid',
    title: 'relatedLayerTitle',
    description: 'relatedLayerDescription',
    file: 'fileInfoUuid'
};


module.exports = function () {
    describe(endpoints.projects.data, function () {
        this.slow(500);

    	before(function (done) {
    		var ops = [];
    		ops.push(function (callback) {
    			helpers.create_file_by_parameters(fileInfo, function (err, _file) {
    				if (err) return callback(err);
    				fileInfo._id = _file._id.toString();
    				callback(null, _file);
    			});
    		});
    		ops.push(function (newFile, callback) {
    			helpers.create_project_by_info(relatedProjectInfo, callback);
    		});
    		ops.push(function (newProject, cretedParams, callback) {
    			helpers.create_layer_by_parameters(relatedLayerInfo, function (err, _layer) {
    				if (err) return callback(err);
    				relatedLayerInfo._id = _layer._id.toString();
    				callback(null, _layer);
    			});
    		});
    		async.waterfall(ops, done);
    	});

    	after(function (done) {
    		var ops = [];
    		ops.push(function (callback) {
    			helpers.delete_file_by_id(fileInfo.uuid, callback);
    		});
    		ops.push(function (callback) {
    			helpers.delete_project_by_id(relatedProjectInfo.uuid, callback);
    		});
    		ops.push(function (callback) {
    			helpers.delete_layer_by_id(relatedLayerInfo.uuid, callback);
    		});
    		async.parallel(ops, done);
    	});




        // test 1
        it('should respond with status code 401 when not authenticated', function (done) {
            api.post(endpoints.projects.data)
                .send({})
                .expect(httpStatus.UNAUTHORIZED, {
                    error: {
                        code: httpStatus.UNAUTHORIZED, 
                        message: expected.invalid_token.errorMessage
                    }
                })
                .end(done);
        });



        // test 2
        it('should respond with status code 400 and error if file_id doesn\'t exist in request body', function (done) {
            token(function (err, access_token) {
                if (err) return done(err);
                api.post(endpoints.projects.data)
                    .send({
                        access_token: access_token,
                        project_id: 'some_id'
                    })
                    .expect(httpStatus.BAD_REQUEST)
                    .end(function (err, res) {
                        if (err) return done(err);
                        var result = helpers.parse(res.text);
                        expect(result.error.errors.missingRequiredFields).to.be.an.array;
                        expect(result.error.errors.missingRequiredFields).to.include('file_id');
                        done();
                    });
            });
        });



        // test 3
        it('should respond with status code 400 and error if project_id doesn\'t exist in request body', function (done) {
			token(function (err, access_token) {
                if (err) return done(err);
                api.post(endpoints.projects.data)
                    .send({
                        access_token: access_token,
                        file_id: 'some_id'
                    })
                    .expect(httpStatus.BAD_REQUEST)
                    .end(function (err, res) {
                        if (err) return done(err);
                        var result = helpers.parse(res.text);
                        expect(result.error.errors.missingRequiredFields).to.be.an.array;
                        expect(result.error.errors.missingRequiredFields).to.include('project_id');
                        done();
                    });
            });
        });



        // test 4
        it('should respond with status code 404 and error if file with specific id doesn\'t exist', function (done) {
			token(function (err, access_token) {
                if (err) return done(err);
                api.post(endpoints.projects.data)
                    .send({
                        access_token: access_token,
                        file_id: 'some_id',
                        project_id: 'some_id'
                    })
                    .expect(httpStatus.NOT_FOUND)
                    .end(function (err, res) {
                        if (err) return done(err);
                        var result = helpers.parse(res.text);
                        expect(result.error.message).to.be.equal(expected.no_such_file.errorMessage);
                        expect(result.error.code).to.be.equal(httpStatus.NOT_FOUND);
                        done();
                    });
            });
        });



        // test 5
        it('should respond with status code 404 and error if project with specific id doesn\'t exist', function (done) {
			token(function (err, access_token) {
                if (err) return done(err);
                api.post(endpoints.projects.data)
                    .send({
                        access_token: access_token,
                        file_id: fileInfo.uuid,
                        project_id: 'some_id'
                    })
                    .expect(httpStatus.NOT_FOUND)
                    .end(function (err, res) {
                        if (err) return done(err);
                        var result = helpers.parse(res.text);
                        expect(result.error.message).to.be.equal(expected.no_such_project.errorMessage);
                        expect(result.error.code).to.be.equal(httpStatus.NOT_FOUND);
                        done();
                    });
            });
        });



        // test 6
        it('should respond with status code 200 and add file and layers to the project', function (done) {
			token(function (err, access_token) {
                if (err) return done(err);
				api.post(endpoints.projects.data)
                .send({
                    access_token: access_token,
                    file_id: fileInfo.uuid,
                    project_id: relatedProjectInfo.uuid
                })
                .expect(httpStatus.OK)
                .end(function (err, res) {
                    if (err) return done(err);
                    var result = helpers.parse(res.text);
					expect(result.files).to.include(fileInfo._id);
					expect(result.layers).to.include(relatedLayerInfo._id);
                    done();
                });
            });
        });
    });
};