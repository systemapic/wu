var supertest = require('supertest');
var chai = require('chai');
var expect = chai.expect;
var api = supertest('https://' + process.env.SYSTEMAPIC_DOMAIN);
var helpers = require('../helpers');
var token = helpers.token;
var httpStatus = require('http-status');
var expected = require('../../shared/errors');
var fs = require('fs');
var path = require('path')

module.exports = function () {
    describe('/api/upload/get', function () {
        var tmp = {};

        before(function (done) {   
            this.timeout(21000);     
            this.slow(20000);     
            token(function (err, access_token) {
                api.post('/api/import')
                .type('form')
                .field('access_token', access_token)
                .field('data', fs.createReadStream(path.resolve(__dirname, '../data/shapefile.polygon.zip')))
                .expect(httpStatus.OK)
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }

                    var result = helpers.parse(res.text);
                    expect(result.file_id).to.exist;
                    expect(result.user_id).to.exist;
                    expect(result.upload_success).to.exist;
                    expect(result.filename).to.be.equal('shapefile.polygon.zip');
                    expect(result.status).to.be.equal('Processing');
                    
                    tmp.file_id = result.file_id;
                    setTimeout(done, 20000)    
                });
            });
        });

        after(function (done) {
            token(function (err, access_token) {
                api.post('/api/file/delete')
                .send({file_id : tmp.file_id, access_token : access_token})
                .expect(httpStatus.OK)
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }

                    var result = helpers.parse(res.text);
                    expect(result.success).to.be.true;

                    done(null, result);
                });
            });
        });

        it("should respond with status code 401 when not authenticated", function (done) {
            api.get('/api/upload/get')
                .send({})
                .expect(httpStatus.UNAUTHORIZED)
                .end(done);
        });

        it("should respond with status code 400 when file_id doesn\'t exist in request query parameters", function (done) {
            token(function (err, access_token) {
                if (err) {
                    return done(err);
                }

                api.get('/api/upload/get')
                    .query({})
                    .send({
                        access_token: access_token
                    })
                    .expect(httpStatus.BAD_REQUEST)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }

                        var result = helpers.parse(res.text);
                        expect(result.error.errors.missingRequiredFields).to.be.an.array;
                        expect(result.error.errors.missingRequiredFields).to.include('file_id');
                        done();
                    });
            });
        });

        it("should respond with status code 404 if file doesn\'t upload", function (done) {
            token(function (err, access_token) {
                if (err) {
                    return done(err);
                }

                api.get('/api/upload/get')
                    .query({file_id: 'some id'})
                    .send({
                        access_token: access_token
                    })
                    .expect(httpStatus.NOT_FOUND)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }

                        var result = helpers.parse(res.text);
                        expect(result.error.message).to.be.equal(expected.no_such_upload_status_id.errorMessage);
                        done();
                    });
            });
        });

        it("should respond with status code 200 and contain uploaded file if file upload", function (done) {
            token(function (err, access_token) {
                if (err) {
                    return done(err);
                }

                api.get('/api/upload/get')
                    .query({file_id: tmp.file_id})
                    .send({
                        access_token: access_token
                    })
                    .expect(httpStatus.OK)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }

                        var result = helpers.parse(res.text);

                        expect(result.file.type).to.be.equal('postgis');
                        expect(result.file.originalName).to.be.equal('shapefile.polygon.zip');
                        expect(result.file.name).to.be.equal('shapefile.polygon');
                        done();
                    });
            });
        });

    });
};