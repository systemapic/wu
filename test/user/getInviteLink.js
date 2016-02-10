var supertest = require('supertest');
var chai = require('chai');
var expect = chai.expect;
var api = supertest('https://' + process.env.SYSTEMAPIC_DOMAIN);
var helpers = require('../helpers');
var token = helpers.token;
var httpStatus = require('http-status');
var expected = require('../../shared/errors');
var second_test_user = {
    email : 'second_mocha_test_user@systemapic.com',
    firstName : 'Igor',
    lastName : 'Ziegler',
    uuid : 'second_test-user-uuid',
    password : 'second_test-user-password'
};

module.exports = function () {

    describe.only('/api/invite/link', function () {
    	
        it('should respond with status code 401 when not authenticated', function (done) {
            api.post('/api/invite/link')
                .send({})
                .expect(httpStatus.UNAUTHORIZED)
                .end(done);
        });

    });

}