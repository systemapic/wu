var supertest = require('supertest');
var chai = require('chai');
var expect = chai.expect;
var api = supertest('https://' + process.env.SYSTEMAPIC_DOMAIN);
var helpers = require('./helpers');
var token = helpers.token;
var expected = require('../shared/errors');
var second_test_user = {
    email : 'second_mocha_test_user@systemapic.com',
    firstName : 'Igor',
    lastName : 'Ziegler',
    uuid : 'second_test-user-uuid',
    password : 'second_test-user-password'  
};
var testFile;
var format = require('util').format;

describe('File', function () {
    before(function(done) { helpers.create_user(done); });
    after(function(done) { helpers.delete_user(done); });
    this.slow(300);

    before(function(done) {
        helpers.create_file(function (err, result) {
                if (err) return done(err);

                testFile = result;
                done();
            });
    });

    after(function(done) {
        helpers.delete_file(done);
    });

	describe('/api/file/update', function () {

        it('should respond with status code 401 when not authenticated', function (done) {
            api.post('/api/file/update')
                .send({})
                .expect(401)
                .end(done);
        });

        it('should respond with status code 422 if fileUuid doesn\'t exist in request body', function (done) {
            token(function (err, token) {
                api.post('/api/file/update')
                    .set('Authorization', 'Bearer ' + token)
                    .send({})
                    .expect(422, expected.missing_information)
                    .end(done);
            });
        });

        it('should respond with status code 422 and error if file doesn\'t exist', function (done) {
            token(function (err, token) {
                api.post('/api/file/update')
                    .set('Authorization', 'Bearer ' + token)
                    .send({
                    	fileUuid: "invalid file id"
                    })
                    .expect(422, expected.missing_information)
                    .end(done);
            });
        });

        before(function (done) {
            helpers.create_user_by_parameters(second_test_user, done);
        });

        after(function (done) {
            helpers.delete_user_by_id(second_test_user.uuid, done);
        });

        it('should respond with status code 422 and error if not authenticated', function (done) {
            helpers.users_token(second_test_user, function (err, token) {
                api.post('/api/file/update')
                    .set('Authorization', 'Bearer ' + token)
                    .send({
                        fileUuid: testFile.uuid
                    })
                    .expect(422, expected.missing_information)
                    .end(done);
            });
        });

        it('should respond with status code 200 and update file correctly', function (done) {
            var fileUpdates = {
                    fileUuid: testFile.uuid,
                    name: 'new name', 
                    description: 'new description', 
                    keywords: ['new keywords'], 
                    status: 'new status',
                    category: 'new category',
                    version: 1,
                    copyright: 'new copyright',
                    data: {
                        postgis : {                 // postgis data
                            database_name : 'new database_name',
                            table_name : 'new table_name',
                            data_type : 'new data_type',         // raster or vector
                            original_format : 'new original_format',   // GeoTIFF, etc.
                            metadata : 'new metadata',
                        },
                        raster : {
                            file_id : 'new file_id',
                            metadata : 'new metadata'
                        }
                    }
                };
            helpers.users_token(second_test_user, function (err, token) {
                api.post('/api/file/update')
                    .set('Authorization', 'Bearer ' + token)
                    .send(fileUpdates)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }

                        var result = helpers.parse(res.text);

                        expect(result.name).to.be.equal(fileUpdates.name);
                        expect(result.description).to.be.equal(fileUpdates.description);
                        expect(result.keywords).to.be.equal(fileUpdates.keywords);
                        expect(result.status).to.be.equal(fileUpdates.status);
                        expect(result.category).to.be.equal(fileUpdates.category);
                        expect(result.version).to.be.equal(fileUpdates.version);
                        expect(result.copyright).to.be.equal(fileUpdates.copyright);
                        expect(result.data).to.be.equal(fileUpdates.data);
                    });
            });
        });
	});

    describe('/api/file/getLayers`', function () {

        before(function (done) {
            helpers.createLayer(done);
        });

        after(function (done) {
            helpers.deleteLayer(done);
        });

        it('should respond with status code 401 when not authenticated', function (done) {
            api.post('/api/file/getLayers')
                .send({})
                .expect(401)
                .end(done);
        });
        
        it('should respond with status code 422 and error if type is not postgis or raster', function (done) {
            token(function (err, token) {
                api.post('/api/file/getLayers')
                    .set('Authorization', 'Bearer ' + token)
                    .send({type: 'not postgis or raster'})
                    .expect(422, expected.missing_information)
                    .end(done);
            });
        });

        context('when type is raster', function () {
            it('should respond with status code 422 and error if data.file_id doesn\'t exist in request body', function (done) {
                token(function (err, token) {
                    api.post('/api/file/getLayers')
                        .set('Authorization', 'Bearer ' + token)
                        .send({
                            type: 'raster'
                        })
                        .expect(422, {"error": format(expected.missing_request_parameters, 'data.file_id')})
                        .end(done);
                });
            });

            it('should respond with status code 200 and empty array of layers if layers with specific file doesn\'t exist', function (done) {
               token(function (err, token) {
                    api.post('/api/file/getLayers')
                        .set('Authorization', 'Bearer ' + token)
                        .send({
                            type: 'raster',
                            data: {file_id: 'some file id'}
                        })
                        .expect(200)
                        .end(function (err, res) {
                            if (err) {
                                return done(err);
                            }

                            var result = helpers.parse(res.text);

                            expect(result).is.an('array');
                            expect(result).to.be.empty;
                            done();
                        });
                }); 
            });

            it('should respond with status code 200 and array of layers if type is raster and all parameters are correct', function (done) {
               token(function (err, token) {
                    api.post('/api/file/getLayers')
                        .set('Authorization', 'Bearer ' + token)
                        .send({
                            type: 'raster',
                            data: {file_id: helpers.test_layer.file}
                        })
                        .expect(200)
                        .end(function (err, res) {
                            if (err) {
                                return done(err);
                            }

                            var result = helpers.parse(res.text);

                            expect(result).is.an('array');
                            expect(result).to.be.not.empty;
                            done();
                        });
                });
            });
        });

        context('when type is postgis', function () {

            it('should respond with status code 422 and error if table_name doesn\'t exist in request parameters', function (done) {
                token(function (err, token) {
                    api.post('/api/file/getLayers')
                        .set('Authorization', 'Bearer ' + token)
                        .send({
                            type: 'postgis',
                            data: {database_name: 'some database_name'}
                        })
                        .expect(422, expected.missing_information)
                        .end(done);
                });
            });

            it('should respond with status code 422 and error if database_name doesn\'t exist in request parameters', function (done) {
                token(function (err, token) {
                    api.post('/api/file/getLayers')
                        .set('Authorization', 'Bearer ' + token)
                        .send({
                            type: 'postgis',
                            data: {table_name: 'some table_name'}
                        })
                        .expect(422, expected.missing_information)
                        .end(done);
                });
            });


            it('should respond with status code 200 and empty array of layers if layers with specific table_name doesn\'t exist', function (done) {
                token(function (err, token) {
                    api.post('/api/file/getLayers')
                        .set('Authorization', 'Bearer ' + token)
                        .send({
                            type: 'postgis',
                            data: {table_name: 'some table_name', database_name: 'some database_name'}
                        })
                        .expect(200)
                        .end(function (err, res) {
                            if (err) {
                                return done(err);
                            }

                            var result = helpers.parse(res.text);

                            expect(result).is.an('array');
                            expect(result).to.be.empty;

                            done();
                        });
                });
            });

            it('should respond with status code 200 and array of specific layers if and all parameters are correctly', function (done) {
               token(function (err, token) {
                    api.post('/api/file/getLayers')
                        .set('Authorization', 'Bearer ' + token)
                        .send({
                            type: 'postgis',
                            data: {table_name: helpers.test_layer.data.postgis.table_name, database_name: 'some database_name'}
                        })
                        .expect(200)
                        .end(function (err, res) {
                            if (err) {
                                return done(err);
                            }

                            var result = helpers.parse(res.text);

                            expect(result).is.an('array');
                            expect(result).to.be.not.empty;
                            done();
                        });
                });
            });
        });
    });
});