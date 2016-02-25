var supertest = require('supertest');
var chai = require('chai');
var expect = chai.expect;
var api = supertest('https://' + process.env.SYSTEMAPIC_DOMAIN);
var helpers = require('../helpers');
var token = helpers.token;
var httpStatus = require('http-status');
var async = require('async');
var expected = require('../../shared/errors');
var File = require('../../models/file');
var endpoints = require('../endpoints.js');


module.exports = function () {
    describe(endpoints.static.screen, function () {
    	
    	var tempFileuuid = '';
        var tmpProject = {};

        before(function (done) {
            helpers.create_project_by_info({
                name: 'mocha-test-project',
                uuid: 'uuid-mocha-test-project-for-static-screen',
                access: {
                    edit: [helpers.test_user.uuid]
                },
                createdBy: helpers.test_user.uuid,
                settings: {
                    saveState: true
                }
            }, function (err, project) {
                if (err) {
                    return done(err);
                }

                tmpProject = project;
                done();
            });
        });

    	after(function (done) {
	        var ops = [];

            ops.push(function (callback) {
                helpers.delete_file_by_id(tempFileuuid, callback);
            });

            ops.push(function (callback) {
                helpers.delete_project_by_id(tmpProject.uuid, callback);
            });

            async.parallel(ops, done);

    	});

        it('should respond with status code 401 when not authenticated', function (done) {
            api.post(endpoints.static.screen)
                .send({})
                .expect(httpStatus.UNAUTHORIZED)
                .end(done);
        });

        it('should respond with status code 200 and create specific file', function (done) {
            token(function (err, access_token) {
                api.post(endpoints.static.screen)
                    .send({
                        access_token: access_token,
                        project_id: tmpProject.uuid,
                        layers: [],
                        position: {
                            lat: 55.16243396806781,
                            lng: 8.767578125,
                            zoom: 4
                        }
                    })
                    .expect(httpStatus.OK)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }

                        var result = helpers.parse(res.text);
                        
                        tempFileuuid = result.image;
                        File.findOne({uuid: result.image})
                            .exec(function (err, _file) {
                                expect(_file.uuid).to.exist;
                                expect(_file.createdBy).to.be.equal(helpers.test_user.uuid);
                                expect(_file.createdByName).to.be.equal(helpers.test_user.firstName + ' ' + helpers.test_user.lastName);
                                expect(_file.files).to.exist;
                                expect(_file.access.users).to.be.an.array;
                                expect(_file.access.users).to.be.not.empty;
                                expect(_file.name).to.exist;
                                expect(_file.description).to.exist;
                                expect(_file.type).to.exist;
                                expect(_file.format).to.exist;
                                expect(_file.data.image.file).to.exist;
                                
                                done();
                            });
                    });
            });
        });

        it('should respond with status code 400 and error if no project_id doesn\'t exist in request body', function (done) {
            token(function (err, access_token) {
                api.post(endpoints.static.screen)
                    .send({
                        access_token: access_token
                    })
                    .expect(httpStatus.BAD_REQUEST)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }

                        var result = helpers.parse(res.text);
                        expect(result.error.message).to.be.equal('no project_id');
                        done();
                    });
            });
        });

        it('should respond with status code 400 and error if position doesn\'t exist in request body', function (done) {
            token(function (err, access_token) {
                api.post(endpoints.static.screen)
                    .send({
                        project_id: tmpProject.uuid,
                        access_token: access_token
                    })
                    .expect(httpStatus.BAD_REQUEST)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }

                        var result = helpers.parse(res.text);
                        expect(result.error.message).to.be.equal('no position');
                        done();
                    });
            });
        });

        it('should respond with status code 404 and error if project doesn\'t exist', function (done) {
            token(function (err, access_token) {
                api.post(endpoints.static.screen)
                    .send({
                        project_id: "test id",
                        access_token: access_token,
                        position: {
                            lat: 55.16243396806781,
                            lng: 8.767578125,
                            zoom: 4
                        }
                    })
                    .expect(httpStatus.NOT_FOUND)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }

                        var result = helpers.parse(res.text);
                        expect(result.error.message).to.be.equal('error: empty project');
                        done();
                    });
            });
        });

    });
};