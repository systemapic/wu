var supertest = require('supertest');
var chai = require('chai');
var expect = chai.expect;
var api = supertest('https://' + process.env.SYSTEMAPIC_DOMAIN);
var helpers = require('../helpers');
var token = helpers.token;
var httpStatus = require('http-status');

module.exports = function () {
    describe('/api/upload/get', function () {

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
                    .end(done);
            });
        });

    });
};