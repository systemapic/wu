var supertest = require('supertest');
var chai = require('chai');
var expect = chai.expect;
var api = supertest('https://' + process.env.SYSTEMAPIC_DOMAIN);
var helpers = require('../helpers');
var token = helpers.token;
var httpStatus = require('http-status');
var async = require('async');
var expected = require('../../shared/errors');
var endpoints = require('../endpoints.js');


module.exports = function () {
    describe(endpoints.static.screen, function () {

        it('should respond with status code 401 when not authenticated', function (done) {
            api.post(endpoints.layers.create)
                .send({})
                .expect(httpStatus.UNAUTHORIZED)
                .end(done);
        });

    });
};