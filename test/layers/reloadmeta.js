var supertest = require('supertest');
var chai = require('chai');
var expect = chai.expect;
var api = supertest('https://' + process.env.SYSTEMAPIC_DOMAIN);
var helpers = require('./../helpers');
var _ = require('lodash');
var token = helpers.token;
var expected = require('../../shared/errors');
var Layer   = require('../../models/layer');
var File = require('../../models/file');
var Project = require('../../models/project');
var async = require('async');
var httpStatus = require('http-status');
var endpoints = require('../endpoints.js');
var testData = require('../shared/layers/reloadmeta.json');

module.exports = function () {
    describe(endpoints.layers.meta, function () {

        // variables, todo: move to share file
        var newFileInfo = testData.newFileInfo;
        before(function (done) {
            helpers.create_file_by_parameters(newFileInfo, done);
        });
        after(function (done) {
            helpers.delete_file_by_id(newFileInfo.uuid, done)
        });

      
        // test 1
        it('should respond with status code 400 and error if file_id doesn\'t exist in request body', function (done) {
            token(function (err, access_token) {
                if (err) return done(err);
                api.post(endpoints.layers.meta)
                    .send({
                        access_token: access_token,
                        layer_id: 'some_id'
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



        // test 2
        it('should respond with status code 400 and error if layer_id doesn\'t exist in request body', function (done) {
            token(function (err, access_token) {
                if (err) return done(err);
                api.post(endpoints.layers.meta)
                    .send({
                        access_token: access_token,
                        file_id: 'some_id'
                    })
                    .expect(httpStatus.BAD_REQUEST)
                    .end(function (err, res) {
                        if (err) return done(err);
                        var result = helpers.parse(res.text);
                        expect(result.error.errors.missingRequiredFields).to.be.an.array;
                        expect(result.error.errors.missingRequiredFields).to.include('layer_id');
                        done();
                    });
            });
        });



        // test 3
        it('should respond with status code 404 and error if file with specific uuid doesn\'t found', function (done) {
           token(function (err, access_token) {
                if (err) return done(err);
                api.post(endpoints.layers.meta)
                    .send({
                        access_token: access_token,
                        file_id: 'some_id',
                        layer_id: 'some_id'
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


        // test 4
        it('should respond with status code 422 and error if file have not geojson info', function (done) {
           token(function (err, access_token) {
                if (err) return done(err);
                api.post(endpoints.layers.meta)
                    .send({
                        access_token: access_token,
                        file_id: newFileInfo.uuid,
                        layer_id: 'some_id'
                    })
                    .expect(httpStatus.UNPROCESSABLE_ENTITY)
                    .end(function (err, res) {
                        if (err) return done(err);
                        var result = helpers.parse(res.text);
                        expect(result.error.message).to.be.equal(expected.no_geojson_found.errorMessage);
                        expect(result.error.code).to.be.equal(httpStatus.UNPROCESSABLE_ENTITY);
                        done();
                    });
            });
        });


        // @igor: not sure what this is testing, so commenting out for now..
        //
        // context('when file have geojson info', function () {
        //     // TODO more tests when file model will be have geojson
        //     before(function (done) {
        //         File.findOne({uuid: newFileInfo.uuid})
        //         .exec(function (err, _file) {
        //             if (err) {
        //                 return done(err);
        //             }

        //             _file.data = {
        //                 geojson: '/test'
        //             };
        //             _file.markModified('data');
        //             _file.save(done)
        //         });
        //     });

        //     it('should work', function (done) {                
        //         File.findOne({uuid: newFileInfo.uuid})
        //         .exec(function (err, _file) {
        //             done();
        //         });
        //     })
        // });

    });
};
