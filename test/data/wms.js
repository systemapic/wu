var supertest = require('supertest');
var chai = require('chai');
var expect = chai.expect;
var api = supertest('https://' + process.env.SYSTEMAPIC_DOMAIN);
var helpers = require('../helpers');
var token = helpers.token;
var expected = require('../../shared/errors');
var httpStatus = require('http-status');
var format = require('util').format;
var endpoints = require('../endpoints.js');

module.exports = function () {
    describe(endpoints.data.layers, function () {
        this.slow(500);

        // prepare & cleanup
        before(helpers.createProject);
        after(helpers.deleteProject);

        

        // test 1
        it('should add WMS layer to project (?)', function (done) {
            // api.post(endpoints.data.layers)
            // .send({})
            // .expect(httpStatus.UNAUTHORIZED)
            // .end(done);
        });


    });

};