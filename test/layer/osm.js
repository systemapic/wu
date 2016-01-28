var supertest = require('supertest');
var chai = require('chai');
var expect = chai.expect;
var api = supertest('https://' + process.env.SYSTEMAPIC_DOMAIN);
var helpers = require('../helpers');
var token = helpers.token;
var httpStatus = require('http-status');
var _ = require('lodash');
var Layer = require('../../models/layer');

module.exports = function () {
    describe('/api/layers/osm/new', function () {

        it('should respond with status code 401 when not authenticated', function (done) {
            api.post('/api/layers/osm/new')
                .send({})
                .expect(httpStatus.UNAUTHORIZED)
                .end(done);
        });

    });
};