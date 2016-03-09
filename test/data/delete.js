var async = require('async');
var supertest = require('supertest');
var chai = require('chai');
var expect = chai.expect;
var api = supertest('https://' + process.env.SYSTEMAPIC_DOMAIN);
var helpers = require('./../helpers');
var httpStatus = require('http-status');
var token = helpers.token;
var expected = require('../../shared/errors');
var User = require('../../models/user');
var Project = require('../../models/project');
var Layer = require('../../models/layer');
var format = require('util').format;
var endpoints = require('../endpoints.js');
var coreTestData = require('../shared/core.json');
var testData = require('../shared/data/delete.json');
var second_test_user = coreTestData.secondTestUser;
var newFileWithPostgisType = testData.newFileWithPostgisType;
var newFileWithPostgisTypeAndBadTableName = testData.newFileWithPostgisTypeAndBadTableName;
var newFileWithPostgisTypeWithoutDatabaseName = testData.newFileWithPostgisTypeWithoutDatabaseName;
var newFileWithPostgisTypeWithoutTableName = testData.newFileWithPostgisTypeWithoutTableName;
var newFileWithRasterTypeWithoutFileId = testData.newFileWithRasterTypeWithoutFileId;
var newFileWithRasterType = testData.newFileWithRasterType;
var newFileNotRasterAndPostgis = testData.newFileNotRasterAndPostgis;
var newRasterFileWithRealtedUser = testData.newRasterFileWithRealtedUser;

module.exports = function () {

    describe(endpoints.data.delete, function () {
        this.slow(500);
        
        var createdFileWithPostgisType = {};
        var createdFileWithRasterType = {};
        var createdFileNotRasterAndPostgis = {};
        var createdFileWithPostgisTypeWithoutDatabaseName = {};
        var createdFileWithPostgisTypeWithoutTableName = {};
        var createdFileWithRasterTypeWithoutFileId = {};
        var createdRasterFileWithRealtedUser = {};
        var createdFileWithPostgisTypeAndBadTableName = {};
        var userWithRasterFile = {};

        before(function (done) {
            helpers.create_file_by_parameters(newFileWithPostgisType, function (err, res) {
                if (err) return done(err);
                createdFileWithPostgisType = res;
                done();
            });
        });
        before(function (done) {
            helpers.create_file_by_parameters(newFileWithRasterType, function (err, res) {
                if (err) return done(err);
                createdFileWithRasterType = res;
                done();
            });
        });
        before(function (done) {
            helpers.create_file_by_parameters(newFileNotRasterAndPostgis, function (err, res) {
                if (err) return done(err);
                createdFileNotRasterAndPostgis = res;
                done();
            });
        });
        before(function (done) {
            helpers.create_file_by_parameters(newFileWithPostgisTypeWithoutDatabaseName, function (err, res) {
                if (err) return done(err);
                createdFileWithPostgisTypeWithoutDatabaseName = res;
                done();
            });
        });
        before(function (done) {
            helpers.create_file_by_parameters(newFileWithPostgisTypeWithoutTableName, function (err, res) {
                if (err) return done(err);
                createdFileWithPostgisTypeWithoutTableName = res;
                done();
            });
        });
        before(function (done) {
            helpers.create_file_by_parameters(newFileWithRasterTypeWithoutFileId, function (err, res) {
                if (err) return done(err);
                createdFileWithRasterTypeWithoutFileId = res;
                done();
            });
        });
        before(function (done) {
            var ops = [];
            ops.push(function (callback) {
                helpers.create_file_by_parameters(newRasterFileWithRealtedUser, function (err, res) {
                    if (err) return callback(err);
                    createdRasterFileWithRealtedUser = res;
                    callback(null, createdRasterFileWithRealtedUser);
                });
            });
            ops.push(function (options, callback) {
                second_test_user.files = [options];
                helpers.create_user_by_parameters(second_test_user, function (err, createdUser) {
                    if (err) return callback(err);
                    userWithRasterFile = createdUser;
                    callback(null, userWithRasterFile);
                });
            });
            async.waterfall(ops, done);
        });
        before(function (done) {
            helpers.create_file_by_parameters(newFileWithPostgisTypeAndBadTableName, function (err, res) {
                if (err) return done(err);
                createdFileWithPostgisTypeAndBadTableName = res;
                done();
            });
        });
        after(function (done) {
            helpers.delete_file_by_id(createdFileWithPostgisType.uuid, done);
        });
        after(function (done) {
            helpers.delete_file_by_id(createdFileWithRasterType.uuid, done);
        });
        after(function (done) {
            helpers.delete_file_by_id(createdFileNotRasterAndPostgis.uuid, done);
        });
        after(function (done) {
            helpers.delete_file_by_id(createdFileWithPostgisTypeWithoutDatabaseName.uuid, done);
        });
        after(function (done) {
            helpers.delete_file_by_id(createdFileWithPostgisTypeWithoutTableName.uuid, done);
        });
        after(function (done) {
            helpers.delete_file_by_id(createdFileWithRasterTypeWithoutFileId.uuid, done);
        });
        after(function (done) {
            var ops = [];
            ops.push(function (callback) {
                helpers.delete_file_by_id(createdRasterFileWithRealtedUser.uuid, callback);
            });
            ops.push(function (options, callback) {
                helpers.delete_user_by_id(userWithRasterFile.uuid, callback);
            });
            async.waterfall(ops, done);
        });
        after(function (done) {
            helpers.delete_file_by_id(createdFileWithPostgisTypeAndBadTableName.uuid, done);
        });

        // test 1
        it('should respond with status code 401 when not authenticated', function (done) {
            api.post(endpoints.data.delete)
                .send({})
                .expect(httpStatus.UNAUTHORIZED)
                .end(done);
        });

        // test 2
        it('should respond with status code 400 when file_id doesn\'t exist in request body', function (done) {
            token(function (err, access_token) {
                api.post(endpoints.data.delete)
                    .send({
                        access_token: access_token
                    })
                    .expect(httpStatus.BAD_REQUEST)
                    .end(function (err, res) {
                        var result = helpers.parse(res.text);
                        expect(result.error.message).to.be.equal(expected.missing_information.errorMessage);
                        expect(result.error.code).to.be.equal(httpStatus.BAD_REQUEST);
                        expect(result.error.errors.missingRequiredFields).to.include('file_id');
                        done();
                    });
            });
        });

        // test 3
        it('should respond with status code 200 if file type isn\'t postgis and raster', function (done) {
            token(function (err, access_token) {
                api.post(endpoints.data.delete)
                    .send({
                        file_id: createdFileNotRasterAndPostgis.uuid,
                        access_token: access_token
                    })
                    .expect(200)
                    .end(function (err, res) {
                        if (err) return done(err);
                        var status = helpers.parse(res.text);
                        expect(status.err).to.be.undefined;
                        expect(status.success).to.be.true;
                        done();
                    });
            });
        });

        // vector
        context('vector', function () {
            // test 4
            it('should respond with status code 404 and error if database_name doesn\'t exist', function (done) {
                token(function (err, access_token) {
                    api.post(endpoints.data.delete)
                        .send({
                            file_id: createdFileWithPostgisTypeWithoutDatabaseName.uuid,
                            access_token: access_token
                        })
                        .expect(httpStatus.NOT_FOUND)
                        .end(function (err, res) {
                            if (err) return done(err);
                            var result = helpers.parse(res.text);
                            expect(result.error.message).to.be.equal(expected.missing_information.errorMessage);
                            expect(result.error.code).to.be.equal(httpStatus.NOT_FOUND);
                            done();
                        });
                });
            });

            // test 5
            it('should respond with status code 404 and error if table_name doesn\'t exist', function (done) {
                token(function (err, access_token) {
                    api.post(endpoints.data.delete)
                        .send({
                            file_id: createdFileWithPostgisTypeWithoutTableName.uuid,
                            access_token: access_token
                        })
                        .expect(httpStatus.NOT_FOUND)
                        .end(function (err, res) {
                            if (err) return done(err);
                            var result = helpers.parse(res.text);
                            expect(result.error.message).to.be.equal(expected.missing_information.errorMessage);
                            expect(result.error.code).to.be.equal(httpStatus.NOT_FOUND);
                            done();
                        });
                });
            });

            // test 6
            it('should respond with status code 500 if can\'t drop related table', function (done) {
                token(function (err, access_token) {
                    api.post(endpoints.data.delete)
                        .send({
                            file_id: createdFileWithPostgisType.uuid,
                            access_token: access_token
                        })
                        .expect(httpStatus.INTERNAL_SERVER_ERROR)
                        .end(function (err, res) {
                            if (err) return done(err);
                            var result = helpers.parse(res.text);
                            expect(result.error.message).to.be.equal(format(expected.dropTable_error.errorMessage, createdFileWithPostgisType.data.postgis.table_name));
                            expect(result.error.code).to.be.equal(httpStatus.INTERNAL_SERVER_ERROR);
                            done();
                        });
                });
            });

            // test 7
            it('should respond with status code 404 if file with table_name id doesn\'t exist', function (done) {
                token(function (err, access_token) {
                    api.post(endpoints.data.delete)
                        .send({
                            file_id: createdFileWithPostgisTypeAndBadTableName.uuid,
                            access_token: access_token
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
        });

        // raster
        context('raster', function () {

            // test 8
            it('should respond with status code 404 and error if file_id doesn\'t exist in data', function (done) {
                token(function (err, access_token) {
                    api.post(endpoints.data.delete)
                        .send({
                            file_id: createdFileWithRasterTypeWithoutFileId.uuid,
                            access_token: access_token
                        })
                        .expect(httpStatus.NOT_FOUND)
                        .end(function (err, res) {
                            if (err) return done(err);
                            var result = helpers.parse(res.text);
                            expect(result.error.message).to.be.equal(expected.missing_information.errorMessage);
                            expect(result.error.code).to.be.equal(httpStatus.NOT_FOUND);
                            done();
                        });
                });
            });

            // test 9
            it('should respond with status code 200', function (done) {
                token(function (err, access_token) {
                    api.post(endpoints.data.delete)
                        .send({
                            file_id: createdFileWithRasterType.uuid,
                            access_token: access_token
                        })
                        .expect(httpStatus.OK)
                        .end(done);
                });
            });

            // test 10
            it('should respond with status code 200 and update related user\'s files', function (done) {
                var ops = [];
                ops.push(function (callback) {
                    helpers.users_token(second_test_user, function (err, access_token) {
                        api.post(endpoints.data.delete)
                            .send({
                                file_id: createdRasterFileWithRealtedUser.uuid,
                                access_token: access_token
                            })
                            .expect(httpStatus.OK)
                            .end(callback);
                    });
                });
                ops.push(function (options, callback) {
                    User
                    .findOne({uuid: userWithRasterFile.uuid})
                    .exec(callback);
                });
                async.waterfall(ops, function (err, res) {
                    if (err) return done(err)
                    expect(res.files).to.be.empty;
                    done();
                });
            });

        });

    });
};