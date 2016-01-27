var supertest = require('supertest');
var chai = require('chai');
var expect = chai.expect;
var api = supertest('https://' + process.env.SYSTEMAPIC_DOMAIN);
var helpers = require('../helpers');
var token = helpers.token;
var httpStatus = require('http-status');
var Layer = require('../../models/layer');

module.exports = function () {

    describe('/api/user/update', function () {
        it('should respond with status code 401 when not authenticated', function (done) {
            api.post('/api/user/update')
                .send({})
                .expect(401)
                .end(done);
        });
    });

};