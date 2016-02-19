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
var config = require('../../config/wu-config.js').serverConfig;
var fs = require('fs');
var endpoints = require('../endpoints.js');


module.exports = function () {

    // skipping for now
    describe.skip(endpoints.data.download, function () {


        // test 1
        it('should respond with status code 401 when not authenticated', function (done) {
            api.get(endpoints.data.download)
            .send({})
            .expect(httpStatus.UNAUTHORIZED, helpers.createExpectedError(expected.invalid_token.errorMessage))
            .end(done);
        });


        // test 2
        it('should respond with status code 400 and error if file doesn\'t exist in query parameters', function (done) {
            token(function (err, access_token) {
                if (err) return done(err);
                api.get(endpoints.data.download)
                .send({
                    access_token: access_token
                })
                .expect(httpStatus.BAD_REQUEST)
                .end(function (err, res) {
                    if (err) return done(err);
                    var result = helpers.parse(res.text);
                    expect(result.error.errors.missingRequiredFields).to.be.an.array;
                    expect(result.error.errors.missingRequiredFields).to.include('file');
                    done();
                });
            });
        });



        // zip files
        context(".zip", function () {
            before(function (done) {
                fs.open(config.path.temp + 'testZip.zip', 'w', function (err, fd) {
                    if (err) return done(err);
                    fs.close(fd, done);
                });
            });
            after(function (done) {
                fs.unlink(config.path.temp + 'testZip.zip', function (err, fd) {
                    if (err) return done(err);
                    done();
                });
            });



            // test 3
            it('should respond with status code 404 if zip file doesn\'t exist', function (done) {
                token(function (err, access_token) {
                    if (err) return done(err);
                    api.get(endpoints.data.download)
                    .send({ access_token: access_token})
                    .query({
                        file: 'someFile',
                        type: 'zip'
                    })
                    .expect(httpStatus.NOT_FOUND)
                    .end(function (err, res) {
                        if (err) return done(err);
                        var result = helpers.parse(res.text);
                        expect(result.error.message).to.be.equal(expected.file_not_found.errorMessage);
                        expect(result.error.code).to.be.equal(httpStatus.NOT_FOUND);
                        done();
                    });
                });
            });


            // test 4
            it('should respond with status code 404 if zip file exists', function (done) {
                token(function (err, access_token) {
                    if (err) return done(err);
                    api.get(endpoints.data.download)
                    .send({
                        access_token: access_token
                    })
                    .query({
                        file: 'testZip',
                        type: 'zip'
                    })
                    .expect(httpStatus.NOT_FOUND)
                    .end(function (err, res) {
                        if (err) return done(err);
                        var result = helpers.parse(res.text);
                        done();
                    });
                });
            });
        });

        context(".pdf", function () {
            before(function (done) { done(); }); // @igor: do we need these? do they override something?
            after(function (done) { done(); });


            // test 5
            it('should respond with status code 404 if pdf file doesn\'t exist', function (done) {
                token(function (err, access_token) {
                    if (err) return done(err);
                    api.get(endpoints.data.download)
                    .send({
                        access_token: access_token
                    })
                    .query({
                        file: 'someFile',
                        type: 'pdf'
                    })
                    .expect(httpStatus.NOT_FOUND)
                    .end(function (err, res) {
                        if (err) return done(err);
                        var result = helpers.parse(res.text);
                        expect(result.error.message).to.be.equal(expected.file_not_found.errorMessage);
                        expect(result.error.code).to.be.equal(httpStatus.NOT_FOUND);
                        done();
                    });
                });
            });
        });

        context(".shp", function () {
            before(function (done) { done();});
            after(function (done) { done(); });


            // test 6
            it('should respond with status code 404 if shp file doesn\'t exist', function (done) {
                token(function (err, access_token) {
                    if (err) return done(err);
                    api.get(endpoints.data.download)
                    .send({
                        access_token: access_token
                    })
                    .query({
                        file: 'someFile',
                        type: 'shp'
                    })
                    .expect(httpStatus.NOT_FOUND)
                    .end(done);
                });
            });
        });
    });
}