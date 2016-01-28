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

        it('should respond with status code 400 if projectUuid or title do not exist in reqest body', function (done) {
            token(function (err, access_token) {
                if (err) {
                    return done(err);
                }

                api.post('/api/layers/osm/new')
                    .send({
                        access_token: access_token
                    })
                    .expect(httpStatus.BAD_REQUEST)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }

                        var result = helpers.parse(res.text);

                        expect(result.error.errors.missingRequiredFields).to.be.an.array;
                        expect(result.error.errors.missingRequiredFields).to.include('projectUuid');
                        expect(result.error.errors.missingRequiredFields).to.include('title');
                        done();
                    });
            });
        });

    });
};