var supertest = require('supertest');
var chai = require('chai');
var expect = chai.expect;
var api = supertest('https://' + process.env.SYSTEMAPIC_DOMAIN);
var helpers = require('../helpers');
var token = helpers.token;
var expected = require('../../shared/errors');
var httpStatus = require('http-status');
var format = require('util').format;

module.exports = function () {
    describe('/api/file/getLayers', function () {

        before(function (done) {
            helpers.createLayer(done);
        });

        after(function (done) {
            helpers.deleteLayer(done);
        });

        it('should respond with status code 401 when not authenticated', function (done) {
            api.post('/api/file/getLayers')
                .send({})
                .expect(httpStatus.UNAUTHORIZED)
                .end(done);
        });

        it('should respond with status code 400 and error if type is not postgis or raster', function (done) {
            token(function (err, access_token) {
                api.post('/api/file/getLayers')
                    .send({
                        type: 'not postgis or raster',
                        access_token: access_token
                    })
                    .expect(httpStatus.BAD_REQUEST, helpers.createExpectedError(expected.missing_information.errorMessage))
                    .end(done);
            });
        });

        context('when type is raster', function () {
            it('should respond with status code 400 and error if data.file_id doesn\'t exist in request body', function (done) {
                token(function (err, access_token) {
                    api.post('/api/file/getLayers')
                        .send({
                            type: 'raster',
                            access_token: access_token
                        })
                        .expect(httpStatus.BAD_REQUEST, {"error": format(expected.missing_request_parameters.errorMessage, 'data.file_id')})
                        .end(done);
                });
            });

            it('should respond with status code 200 and empty array of layers if layers with specific file doesn\'t exist', function (done) {
                token(function (err, access_token) {
                    api.post('/api/file/getLayers')
                        .send({
                            type: 'raster',
                            data: {file_id: 'some file id'},
                            access_token: access_token
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
                token(function (err, access_token) {
                    api.post('/api/file/getLayers')
                        .send({
                            type: 'raster',
                            data: {file_id: helpers.test_layer.file},
                            access_token: access_token
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

            it('should respond with status code 400 and error if table_name doesn\'t exist in request parameters', function (done) {
                token(function (err, access_token) {
                    api.post('/api/file/getLayers')
                        .send({
                            type: 'postgis',
                            data: {database_name: 'some database_name'},
                            access_token: access_token
                        })
                        .expect(httpStatus.BAD_REQUEST, helpers.createExpectedError(expected.missing_information.errorMessage))
                        .end(done);
                });
            });

            it('should respond with status code 400 and error if database_name doesn\'t exist in request parameters', function (done) {
                token(function (err, access_token) {
                    api.post('/api/file/getLayers')
                        .send({
                            type: 'postgis',
                            data: {table_name: 'some table_name'},
                            access_token: access_token
                        })
                        .expect(httpStatus.BAD_REQUEST, helpers.createExpectedError(expected.missing_information.errorMessage))
                        .end(done);
                });
            });


            it('should respond with status code 200 and empty array of layers if layers with specific table_name doesn\'t exist', function (done) {
                token(function (err, access_token) {
                    api.post('/api/file/getLayers')
                        .send({
                            type: 'postgis',
                            data: {table_name: 'some table_name', database_name: 'some database_name'},
                            access_token: access_token
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
                token(function (err, access_token) {
                    api.post('/api/file/getLayers')
                        .send({
                            type: 'postgis',
                            data: {
                                table_name: helpers.test_layer.data.postgis.table_name,
                                database_name: 'some database_name'
                            },
                            access_token: access_token
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
};