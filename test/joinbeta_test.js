var supertest = require('supertest');
var chai = require('chai');
var expect = chai.expect;
var api = supertest('https://' + process.env.SYSTEMAPIC_DOMAIN);
var helpers = require('./helpers');
var token = helpers.token;
var httpStatus = require('http-status');
var expected = require('../shared/errors');

describe('Joinbeta', function () {

    before(function (done) {
        helpers.create_user(done);
    });
    after(function (done) {
        helpers.delete_user(done);
    });

    describe('/api/joinbeta', function () {

        it('should respond with status code 200 and version object', function () {
            api.get('/api/joinbeta')
                .query({
                    email: helpers.test_user.email
                })
                .expect(httpStatus.OK)
                .end();
        });

    });

});