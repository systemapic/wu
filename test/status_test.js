var supertest = require('supertest');
var chai = require('chai');
var expect = chai.expect;
var api = supertest('https://' + process.env.SYSTEMAPIC_DOMAIN);
var helpers = require('./helpers');
var token = helpers.token;
var httpStatus = require('http-status');
var expected = require('../shared/errors');
var endpoints = require('./endpoints.js');

describe('Status', function () {

    before(function (done) {
        helpers.create_user(done);
    });
    after(function (done) {
        helpers.delete_user(done);
    });

    describe('/api/status', function () {

        it('should respond with status code 401 when not authenticated', function (done) {
            api.get(endpoints.status)
                .send({})
                .expect(httpStatus.UNAUTHORIZED)
                .end(done);
        });

        it('should respond with status code 200 and version object', function (done) {
            token(function (err, access_token) {
                api.get(endpoints.status)
                    .query({
                        access_token: access_token
                    })
                    .send()
                    .expect(httpStatus.OK)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }

                        var result = helpers.parse(res.text);
                        expect(result.status).to.exist;
                        expect(result.status.versions).to.exist;
                        expect(result.status.versions.systemapic_api).to.exist;
                        expect(result.status.versions.postgis).to.exist;
                        expect(result.status.versions.postgres).to.exist;
                        expect(result.status.versions.mongodb).to.exist;
                        expect(result.status.versions.redis).to.exist;
                        done();
                    });
            });
        });

    });

});