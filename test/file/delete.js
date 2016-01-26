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
var second_test_user = {
    email : 'second_mocha_test_user@systemapic.com',
    firstName : 'Igor',
    lastName : 'Ziegler',
    uuid : 'second_test-user-uuid',
    password : 'second_test-user-password'  
};
var format = require('util').format;
var newFileWithPostgisType = {
    uuid : 'newFileWithPostgisType',
    family : 'newFile_family',
    createdBy : 'newFile_test-user-uuid',
    createdByName : 'newFile_createdByName',
    files : ['newFile_files'],
    folder : 'newFile_folder',
    absfolder : 'newFile_absfolder',
    name : 'newFile_name',
    originalName : 'newFile_originalName',
    description : 'newFile_description',
    copyright : 'newFile_copyright',
    keywords : 'newFile_keywords',
    category : 'newFile_category',
    version : 1,
    status : 'newFile_status',
    type : 'postgis',
    format : ['newFile_format'],
    data: {
        postgis : {                 // postgis data
            database_name : 'newFileWithPostgisType',
            table_name : 'newFileWithPostgisType',
            data_type : 'new data_type',         // raster or vector
            original_format : 'new original_format',   // GeoTIFF, etc.
            metadata : 'new metadata'
        },
        raster : {
            file_id : 'new file_id',
            metadata : 'new metadata'
        }
    }
};
var newFileWithPostgisTypeAndBadTableName = {
    uuid : 'newFileWithPostgisTypeAndBadTableName',
    family : 'newFile_family',
    createdBy : 'newFile_test-user-uuid',
    createdByName : 'newFile_createdByName',
    files : ['newFile_files'],
    folder : 'newFile_folder',
    absfolder : 'newFile_absfolder',
    name : 'newFile_name',
    originalName : 'newFile_originalName',
    description : 'newFile_description',
    copyright : 'newFile_copyright',
    keywords : 'newFile_keywords',
    category : 'newFile_category',
    version : 1,
    status : 'newFile_status',
    type : 'postgis',
    format : ['newFile_format'],
    data: {
        postgis : {                 // postgis data
            database_name : 'newFileWithPostgisTypeAndBadTableName',
            table_name : 'Bad_name',
            data_type : 'new data_type',         // raster or vector
            original_format : 'new original_format',   // GeoTIFF, etc.
            metadata : 'new metadata'
        },
        raster : {
            file_id : 'new file_id',
            metadata : 'new metadata'
        }
    }
};
var newFileWithPostgisTypeWithoutDatabaseName = {
    uuid : 'newFileWithPostgisTypeWithoutDatabaseName',
    family : 'newFile_family',
    createdBy : 'newFile_test-user-uuid',
    createdByName : 'newFile_createdByName',
    files : ['newFile_files'],
    folder : 'newFile_folder',
    absfolder : 'newFile_absfolder',
    name : 'newFile_name',
    originalName : 'newFile_originalName',
    description : 'newFile_description',
    copyright : 'newFile_copyright',
    keywords : 'newFile_keywords',
    category : 'newFile_category',
    version : 1,
    status : 'newFile_status',
    type : 'postgis',
    format : ['newFile_format'],
    data: {
        postgis : {                 // postgis data
            table_name : 'newFileWithPostgisTypeWithoutDatabaseName',
            data_type : 'new data_type',         // raster or vector
            original_format : 'new original_format',   // GeoTIFF, etc.
            metadata : 'new metadata'
        },
        raster : {
            file_id : 'newFileWithPostgisTypeWithoutDatabaseName',
            metadata : 'new metadata'
        }
    }
};
var newFileWithPostgisTypeWithoutTableName = {
    uuid : 'newFileWithPostgisTypeWithoutTableName',
    family : 'newFile_family',
    createdBy : 'newFile_test-user-uuid',
    createdByName : 'newFile_createdByName',
    files : ['newFile_files'],
    folder : 'newFile_folder',
    absfolder : 'newFile_absfolder',
    name : 'newFile_name',
    originalName : 'newFile_originalName',
    description : 'newFile_description',
    copyright : 'newFile_copyright',
    category : 'newFile_category',
    version : 1,
    status : 'newFile_status',
    keywords : 'newFile_keywords',
    type : 'postgis',
    format : ['newFile_format'],
    data: {
        postgis : {                 // postgis data
            database_name : 'newFileWithPostgisTypeWithoutTableName',
            data_type : 'new data_type',         // raster or vector
            original_format : 'new original_format',   // GeoTIFF, etc.
            metadata : 'new metadata'
        },
        raster : {
            file_id : 'newFileWithPostgisTypeWithoutTableName',
            metadata : 'new metadata'
        }
    }
};
var newFileWithRasterTypeWithoutFileId = {
    uuid : 'newFileWithRasterTypeWithoutFileId',
    family : 'newFile_family',
    createdBy : 'newFile_test-user-uuid',
    createdByName : 'newFile_createdByName',
    files : ['newFile_files'],
    folder : 'newFile_folder',
    name : 'newFile_name',
    absfolder : 'newFile_absfolder',
    originalName : 'newFile_originalName',
    description : 'newFile_description',
    copyright : 'newFile_copyright',
    category : 'newFile_category',
    version : 1,
    status : 'newFile_status',
    keywords : 'newFile_keywords',
    type : 'raster',
    format : ['newFile_format'],
    data: {
        postgis : {                 // postgis data
            database_name : 'new database_name',
            table_name : 'newFileWithRasterTypeWithoutFileId',
            data_type : 'new data_type',         // raster or vector
            original_format : 'new original_format',   // GeoTIFF, etc.
            metadata : 'new metadata'
        },
        raster : {
            metadata : 'new metadata'
        }
    }
};
var newFileWithRasterType = {
    uuid : 'newFileWithRasterType',
    family : 'newFile_family',
    createdBy : 'newFile_test-user-uuid',
    createdByName : 'newFile_createdByName',
    files : ['newFile_files'],
    folder : 'newFile_folder',
    name : 'newFile_name',
    absfolder : 'newFile_absfolder',
    originalName : 'newFile_originalName',
    description : 'newFile_description',
    copyright : 'newFile_copyright',
    category : 'newFile_category',
    version : 1,
    status : 'newFile_status',
    keywords : 'newFile_keywords',
    type : 'raster',
    format : ['newFile_format'],
    data: {
        postgis : {                 // postgis data
            database_name : 'new database_name',
            table_name : 'newFileWithRasterType',
            data_type : 'new data_type',         // raster or vector
            original_format : 'new original_format',   // GeoTIFF, etc.
            metadata : 'new metadata'
        },
        raster : {
            file_id : 'newFileWithRasterType',
            metadata : 'new metadata'
        }
    }
};
var newFileNotRasterAndPostgis = {
    uuid : 'newFileNotRasterAndPostgis',
    family : 'newFile_family',
    createdBy : 'newFile_test-user-uuid',
    createdByName : 'newFile_createdByName',
    files : ['newFile_files'],
    folder : 'newFile_folder',
    name : 'newFile_name',
    absfolder : 'newFile_absfolder',
    originalName : 'newFile_originalName',
    description : 'newFile_description',
    copyright : 'newFile_copyright',
    category : 'newFile_category',
    version : 1,
    status : 'newFile_status',
    keywords : 'newFile_keywords',
    type : 'test',
    format : ['newFile_format'],
    data: {
        postgis : {                 // postgis data
            database_name : 'new database_name',
            table_name : 'newFileNotRasterAndPostgis',
            data_type : 'new data_type',         // raster or vector
            original_format : 'new original_format',   // GeoTIFF, etc.
            metadata : 'new metadata'
        },
        raster : {
            file_id : 'newFileNotRasterAndPostgis',
            metadata : 'new metadata'
        }
    }
};
var newRasterFileWithRealtedUser = {
    uuid : 'newRasterFileWithRealtedUser',
    family : 'newFile_family',
    createdBy : 'second_test-user-uuid',
    createdByName : 'newFile_createdByName',
    files : ['newFile_files'],
    folder : 'newFile_folder',
    name : 'newFile_name',
    absfolder : 'newFile_absfolder',
    originalName : 'newFile_originalName',
    description : 'newFile_description',
    copyright : 'newFile_copyright',
    category : 'newFile_category',
    version : 1,
    status : 'newFile_status',
    keywords : 'newFile_keywords',
    type : 'raster',
    format : ['newFile_format'],
    data: {
        postgis : {                 // postgis data
            database_name : 'new database_name',
            table_name : 'newRasterFileWithRealtedUser',
            data_type : 'new data_type',         // raster or vector
            original_format : 'new original_format',   // GeoTIFF, etc.
            metadata : 'new metadata'
        },
        raster : {
            file_id : 'newRasterFileWithRealtedUser',
            metadata : 'new metadata'
        }
    }
};
module.exports.fileTests = function () {

    describe('/api/file/delete', function () {
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
                if (err) {
                    return done(err);
                }

                createdFileWithPostgisType = res;
                done();
            });
        });

        before(function (done) {
            helpers.create_file_by_parameters(newFileWithRasterType, function (err, res) {
                if (err) {
                    return done(err);
                }

                createdFileWithRasterType = res;
                done();
            });
        });

        before(function (done) {
            helpers.create_file_by_parameters(newFileNotRasterAndPostgis, function (err, res) {
                if (err) {
                    return done(err);
                }

                createdFileNotRasterAndPostgis = res;
                done();
            });
        });

        before(function (done) {
            helpers.create_file_by_parameters(newFileWithPostgisTypeWithoutDatabaseName, function (err, res) {
                if (err) {
                    return done(err);
                }

                createdFileWithPostgisTypeWithoutDatabaseName = res;
                done();
            });
        });

        before(function (done) {
            helpers.create_file_by_parameters(newFileWithPostgisTypeWithoutTableName, function (err, res) {
                if (err) {
                    return done(err);
                }

                createdFileWithPostgisTypeWithoutTableName = res;
                done();
            });
        });

        before(function (done) {
            helpers.create_file_by_parameters(newFileWithRasterTypeWithoutFileId, function (err, res) {
                if (err) {
                    return done(err);
                }

                createdFileWithRasterTypeWithoutFileId = res;
                done();
            });
        });

        before(function (done) {
            var ops = [];

            ops.push(function (callback) {
                helpers.create_file_by_parameters(newRasterFileWithRealtedUser, function (err, res) {
                    if (err) {
                        callback(err);
                    }
                    createdRasterFileWithRealtedUser = res;
                    callback(null, createdRasterFileWithRealtedUser);
                });
            });

            ops.push(function (options, callback) {
                second_test_user.files = [options];
                helpers.create_user_by_parameters(second_test_user, function (err, createdUser) {
                    if (err) {
                        callback(err);
                    }

                    userWithRasterFile = createdUser;
                    callback(null, userWithRasterFile);
                });
            });

            async.waterfall(ops, done);
        });

        before(function (done) {
            helpers.create_file_by_parameters(newFileWithPostgisTypeAndBadTableName, function (err, res) {
                if (err) {
                    return done(err);
                }

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

        it('should respond with status code 401 when not authenticated', function (done) {
            api.post('/api/file/delete')
                .send({})
                .expect(401)
                .end(done);
        });

        it('should respond with status code 400 when file_id doesn\'t exist in request body', function (done) {
            token(function (err, access_token) {
                api.post('/api/file/delete')
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

        it('should respond with status code 200 if file type isn\'t postgis and raster', function (done) {
            token(function (err, access_token) {
                api.post('/api/file/delete')
                    .send({
                        file_id: createdFileNotRasterAndPostgis.uuid,
                        access_token: access_token
                    })
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var status = helpers.parse(res.text);

                        expect(status.err).to.be.undefined;
                        expect(status.success).to.be.true;
                        done();
                    });
            });
        });

        context('when file type is postgis', function () {

            it('should respond with status code 404 and error if database_name doesn\'t exist', function (done) {
                token(function (err, access_token) {
                    api.post('/api/file/delete')
                        .send({
                            file_id: createdFileWithPostgisTypeWithoutDatabaseName.uuid,
                            access_token: access_token
                        })
                        .expect(httpStatus.NOT_FOUND)
                        .end(function (err, res) {
                            if (err) {
                                return done(err);
                            }

                            var result = helpers.parse(res.text);

                            expect(result.error.message).to.be.equal(expected.missing_information.errorMessage);
                            expect(result.error.code).to.be.equal(httpStatus.NOT_FOUND);

                            done();
                        });

                });
            });

            it('should respond with status code 404 and error if table_name doesn\'t exist', function (done) {
                token(function (err, access_token) {
                    api.post('/api/file/delete')
                        .send({
                            file_id: createdFileWithPostgisTypeWithoutTableName.uuid,
                            access_token: access_token
                        })
                        .expect(404)
                        .end(function (err, res) {
                            if (err) {
                                return done(err);
                            }

                            var result = helpers.parse(res.text);

                            expect(result.error.message).to.be.equal(expected.missing_information.errorMessage);
                            expect(result.error.code).to.be.equal(httpStatus.NOT_FOUND);

                            done();
                        });
                });
            });

            it('should respond with status code 500 if can\'t drop related table', function (done) {
                token(function (err, access_token) {
                    api.post('/api/file/delete')
                        .send({
                            file_id: createdFileWithPostgisType.uuid,
                            access_token: access_token
                        })
                        .expect(httpStatus.INTERNAL_SERVER_ERROR)
                        .end(function (err, res) {
                            if (err) {
                                return done(err);
                            }

                            var result = helpers.parse(res.text);

                            expect(result.error.message).to.be.equal(format(expected.dropTable_error.errorMessage, createdFileWithPostgisType.data.postgis.table_name));
                            expect(result.error.code).to.be.equal(httpStatus.INTERNAL_SERVER_ERROR);
                            done();
                        });
                });
            });

            it('should respond with status code 404 if file with table_name id doesn\'t exist', function (done) {
                token(function (err, access_token) {
                    api.post('/api/file/delete')
                        .send({
                            file_id: createdFileWithPostgisTypeAndBadTableName.uuid,
                            access_token: access_token
                        })
                        .expect(httpStatus.NOT_FOUND)
                        .end(function (err, res) {
                            if (err) {
                                return done(err);
                            }

                            var result = helpers.parse(res.text);

                            expect(result.error.message).to.be.equal(expected.no_such_file.errorMessage);
                            expect(result.error.code).to.be.equal(httpStatus.NOT_FOUND);
                            done();
                        });
                });
            });

        });

        context('when file type is raster', function () {

            it('should respond with status code 404 and error if file_id doesn\'t exist in data', function (done) {
                token(function (err, access_token) {
                    api.post('/api/file/delete')
                        .send({
                            file_id: createdFileWithRasterTypeWithoutFileId.uuid,
                            access_token: access_token
                        })
                        .expect(404)
                        .end(function (err, res) {
                            if (err) {
                                return done(err);
                            }

                            var result = helpers.parse(res.text);

                            expect(result.error.message).to.be.equal(expected.missing_information.errorMessage);
                            expect(result.error.code).to.be.equal(httpStatus.NOT_FOUND);

                            done();
                        });
                });
            });

            it('should respond with status code 200', function (done) {
                token(function (err, access_token) {
                    api.post('/api/file/delete')
                        .send({
                            file_id: createdFileWithRasterType.uuid,
                            access_token: access_token
                        })
                        .expect(200)
                        .end(done);
                });
            });

            it('should respond with status code 200 and update related user\'s files', function (done) {
                var ops = [];

                ops.push(function (callback) {
                    helpers.users_token(second_test_user, function (err, access_token) {
                        api.post('/api/file/delete')
                            .send({
                                file_id: createdRasterFileWithRealtedUser.uuid,
                                access_token: access_token
                            })
                            .expect(200)
                            .end(callback);
                    });
                });

                ops.push(function (options, callback) {
                    User.findOne({uuid: userWithRasterFile.uuid})
                        .exec(callback);
                });

                async.waterfall(ops, function (err, res) {
                    if (err) {
                        return done(err)
                    }

                    expect(res.files).to.be.empty;
                    done();
                });
            });

        });

    });
};