var supertest = require('supertest');
var chai = require('chai');
var expect = chai.expect;
var api = supertest('https://' + process.env.SYSTEMAPIC_DOMAIN);
var helpers = require('./../helpers');
var _ = require('lodash');
var token = helpers.token;
var expected = require('../../shared/errors');
var Layer   = require('../../models/layer');
var Project = require('../../models/project');
var async = require('async');
var httpStatus = require('http-status');

module.exports = function () {
    describe('/api/layer/createlegends', function () {

        it('should respond with status code 401 when not authenticated', function (done) {
            api.post('/api/layer/createlegends')
                .send({})
                .expect(httpStatus.UNAUTHORIZED)
                .end(done);
        });

    });
};