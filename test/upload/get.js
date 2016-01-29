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
            api.post('/api/upload/get')
                .send({})
                .expect(httpStatus.UNAUTHORIZED)
                .end(done);
        });

    });
};