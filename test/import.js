var assert = require('assert');
var mongoose = require('mongoose');
var async = require('async');
var fs = require('fs');
var crypto = require('crypto');
var request = require('supertest');
var User = require('../models/user');
var config = require('../config/server-config.js').serverConfig;
var helpers = require('./helpers');
var token = helpers.token;
var supertest = require('supertest');
var api = supertest('https://' + process.env.SYSTEMAPIC_DOMAIN);
var tmp = {};


// prepare
before(function(callback) {
    async.series([helpers.create_user, helpers.create_project], callback);
});
after(function(callback) {
    async.series([helpers.delete_project, helpers.delete_user], callback);
});

describe('Import', function () {
    describe('shapefile', function () {
        this.slow(500);

        context('zipped', function () {

            it('should upload', function (done) {
                    token(function (err, access_token) {
                    api.post('/api/import')
                    .type('form')
                    .field('access_token', access_token)
                    .field('data', fs.createReadStream(__dirname + '/data/shapefile.zip'))
                    .expect(200)
                    .end(function (err, res) {
                        console.log('res', res.text);
                        assert.ifError(err);
                        var result = helpers.parse(res.text);
                        assert.ok(result.file_id);
                        assert.ok(result.user_id);
                        assert.ok(result.upload_success);
                        assert.equal(result.filename, 'shapefile.zip');
                        assert.equal(result.status, 'Processing');
                        assert.ifError(result.error_code);
                        assert.ifError(result.error_text);

                        tmp.file_id = result.file_id;
                        done();
                    });
                });
            });

            it('should get upload status', function (done) {
                token(function (err, access_token) {
                    api.get('/api/import/status')
                    .query({file_id : tmp.file_id, access_token : access_token})
                    .expect(200)
                    .end(function (err, res) {
                        assert.ifError(err);
                        var result = helpers.parse(res.text);
                        assert.ok(result.file_id);
                        assert.ok(result.user_id);
                        assert.ok(result.upload_success);
                        assert.equal(result.filename, 'shapefile.zip');
                        assert.equal(result.status, 'Processing');
                        assert.ifError(result.error_code);
                        assert.ifError(result.error_text);
                        done();
                    });
                })
            });

        });

        context.skip('with missing .prj file', function () {

            it('should upload', function (done) {
                    token(function (err, access_token) {
                    api.post('/api/import')
                    .type('form')
                    .field('userUuid', util.test_user.uuid)
                    .field('access_token', access_token)
                    .field('data', fs.createReadStream(__dirname + '/data/shapefile.missing-prj.zip'))
                    .expect(200)
                    .end(function (err, res) {
                        assert.ifError(err);
                        var result = helpers.parse(res.text);
                        assert.ok(result.file_id);
                        assert.ok(result.user_id);
                        assert.ok(result.upload_success);
                        assert.equal(result.filename, 'shapefile.missing-prj.zip');
                        assert.equal(result.status, 'Processing');
                        assert.ifError(result.error_code);
                        assert.ifError(result.error_text);

                        tmp.file_id = result.file_id;
                        done();
                    });
                });
            });

            it('should get upload status', function (done) {
                token(function (err, access_token) {
                    api.get('/api/import/status')
                    .query({ file_id : tmp.file_id, access_token : access_token})
                    .expect(200)
                    .end(function (err, res) {
                        assert.ifError(err);
                        var result = helpers.parse(res.text);
                        assert.ok(result.file_id);
                        assert.ok(result.user_id);
                        assert.ok(result.upload_success);
                        assert.equal(result.filename, 'shapefile.missing-prj.zip');
                        assert.equal(result.status, 'Processing');
                        assert.ifError(result.error_code);
                        assert.ifError(result.error_text);
                        done();
                    });
                })
            });
        });
    });
});


describe('Process', function () {


    it('should be processed in < 10s', function (done) {
        // wait to finish processing (around ten seconds for shapefile.zip)
        this.timeout(11000);
        this.slow(20000);
        setTimeout(done, 10000)
    });

    it('should be processed without errors', function (done) {
        token(function (err, access_token) {
            api.get('/api/import/status')
            .query({file_id : tmp.file_id, access_token : access_token})
            .expect(200)
            .end(function (err, res) {
                assert.ifError(err);
                var status = helpers.parse(res.text);
                assert.ifError(err);
                assert.ok(status.upload_success);
                assert.ifError(status.error_code);
                assert.ifError(status.error_text);
                assert.equal(status.user_id, helpers.test_user.uuid);
                assert.equal(status.data_type, 'vector');
                assert.ok(status.processing_success);
                assert.equal(status.status, 'Done');
                assert.equal(status.rows_count, 13);
                done();
            });
        })
    });

    it('should be able to delete file', function (done) {
        token(function (err, access_token) {
            api.post('/api/file/delete')
            .send({file_id : tmp.file_id, access_token : access_token})
            .expect(200)
            .end(function (err, res) {
                assert.ifError(err);
                var status = helpers.parse(res.text);
                assert.ifError(status.error);
                assert.ok(status);
                done();
            });
        });
    });

});

       
