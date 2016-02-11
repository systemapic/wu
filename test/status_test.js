var supertest = require('supertest');
var chai = require('chai');
var expect = chai.expect;
var api = supertest('https://' + process.env.SYSTEMAPIC_DOMAIN);
var helpers = require('../helpers');
var token = helpers.token;
var httpStatus = require('http-status');
var expected = require('../../shared/errors');

describe('Status', function () {

    before(function (done) {
        helpers.create_user(done);
    });
    after(function (done) {
        helpers.delete_user(done);
    });

    describe('/api/status', function () {

        it('should respond with status code 401 when not authenticated', function (done) {
            api.post('/api/status')
                .send({})
                .expect(httpStatus.UNAUTHORIZED)
                .end(done);
        });

    });

});