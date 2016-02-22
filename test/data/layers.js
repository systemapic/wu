var supertest = require('supertest');
var chai = require('chai');
var expect = chai.expect;
var api = supertest('https://' + process.env.SYSTEMAPIC_DOMAIN);
var helpers = require('../helpers');
var token = helpers.token;
var expected = require('../../shared/errors');
var httpStatus = require('http-status');
var format = require('util').format;
var endpoints = require('../endpoints.js');

module.exports = function () {
    describe(endpoints.data.layers, function () {
        this.slow(500);

        // prepare & cleanup
        before(helpers.createLayer);
        after(helpers.deleteLayer);



        // test 1
        it('should respond with status code 401 when not authenticated', function (done) {
            api.get(endpoints.data.layers)
                .send({})
                .expect(httpStatus.UNAUTHORIZED)
                .end(done);
        });



        // test 2
        it('should respond with status code 400 and error if type is not postgis or raster', function (done) {
            token(function (err, access_token) {
                api.get(endpoints.data.layers)
                    .query({
                        type: 'not postgis or raster',
                        access_token: access_token
                    })
                    .send()
                    .expect(httpStatus.BAD_REQUEST, helpers.createExpectedError(expected.missing_information.errorMessage))
                    .end(done);
            });
        });



        // raster 
        context('raster', function () {



            // test 3
            it('should respond with status code 400 and error if data.file_id doesn\'t exist in request body', function (done) {
                token(function (err, access_token) {
                    api.get(endpoints.data.layers)
                        .query({
                            type: 'raster',
                            access_token: access_token
                        })
                        .send()
                        .expect(httpStatus.BAD_REQUEST, {"error": format(expected.missing_request_parameters.errorMessage, 'data.file_id')})
                        .end(done);
                });
            });



            // test 4
            it('should respond with status code 200 and empty array of layers if layers with specific file doesn\'t exist', function (done) {
                token(function (err, access_token) {
                    api.get(endpoints.data.layers)
                        .query({
                            type: 'raster',
                            data: {file_id: 'some file id'},
                            access_token: access_token
                        })
                        .send()
                        .expect(200)
                        .end(function (err, res) {
                            if (err) return done(err);
                            var result = helpers.parse(res.text);
                            expect(result).is.an('array');
                            expect(result).to.be.empty;
                            done();
                        });
                });
            });



            // test 5
            it('should respond with status code 200 and array of layers if type is raster and all parameters are correct', function (done) {
                token(function (err, access_token) {
                    api.get(endpoints.data.layers)
                        .query({
                            type: 'raster',
                            data: {file_id: helpers.test_layer.file},
                            access_token: access_token
                        })
                        .send()
                        .expect(200)
                        .end(function (err, res) {
                            if (err) return done(err);
                            var result = helpers.parse(res.text);
                            expect(result).is.an('array');
                            expect(result).to.be.not.empty;
                            done();
                        });
                });
            });
        });



        // vector
        context('vector', function () {


            // test 6
            it('should respond with status code 400 and error if table_name doesn\'t exist in request parameters', function (done) {
                token(function (err, access_token) {
                    api.get(endpoints.data.layers)
                        .query({
                            type: 'postgis',
                            data: {database_name: 'some database_name'},
                            access_token: access_token
                        })
                        .send()
                        .expect(httpStatus.BAD_REQUEST, helpers.createExpectedError(expected.missing_information.errorMessage))
                        .end(done);
                });
            });



            // test 7
            it('should respond with status code 400 and error if database_name doesn\'t exist in request parameters', function (done) {
                token(function (err, access_token) {
                    api.get(endpoints.data.layers)
                        .query({
                            type: 'postgis',
                            data: {table_name: 'some table_name'},
                            access_token: access_token
                        })
                        .send()
                        .expect(httpStatus.BAD_REQUEST, helpers.createExpectedError(expected.missing_information.errorMessage))
                        .end(done);
                });
            });



            // test 8
            it('should respond with status code 200 and empty array of layers if layers with specific table_name doesn\'t exist', function (done) {
                token(function (err, access_token) {
                    api.get(endpoints.data.layers)
                        .query({
                            type: 'postgis',
                            data: {table_name: 'some table_name', database_name: 'some database_name'},
                            access_token: access_token
                        })
                        .send()
                        .expect(httpStatus.OK)
                        .end(function (err, res) {
                            if (err) return done(err);
                            var result = helpers.parse(res.text);
                            expect(result).is.an('array');
                            expect(result).to.be.empty;
                            done();
                        });
                });
            });



            // test 9
            it('should respond with status code 200 and array of specific layers if and all parameters are correctly', function (done) {
                token(function (err, access_token) {
                    api.get(endpoints.data.layers)
                        .query({
                            type: 'postgis',
                            data: {
                                table_name: helpers.test_layer.data.postgis.table_name,
                                database_name: 'some database_name'
                            },
                            access_token: access_token
                        })
                        .send()
                        .expect(httpStatus.OK)
                        .end(function (err, res) {
                            if (err) return done(err);
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