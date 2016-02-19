var supertest = require('supertest');
var chai = require('chai');
var expect = chai.expect;
var api = supertest('https://' + process.env.SYSTEMAPIC_DOMAIN);
var helpers = require('../helpers');
var httpStatus = require('http-status');
var expected = require('../../shared/errors');
var token = util.token;
var endpoints = require('../endpoints.js');


module.exports = function () {

    describe(endpoints.users.token.refresh, function () {

        it('should respond with status code 401 when not authenticated', function (done) {
            api.post(endpoints.users.token.refresh)
                .send({})
                .expect(httpStatus.UNAUTHORIZED)
                .end(done);
        });

        it('should get 401 with invalid access token', function (done) {
            token(function (err, access_token) {
                api.post(endpoints.users.token.refresh)
                .send({ access_token : 'invalid' })
                .expect(httpStatus.UNAUTHORIZED)
                .end(done);
            });
        });

        it('should get a refreshed access token with access token', function (done) {
            token(function (err, access_token) {
                api.post(endpoints.users.token.refresh)
                .send({ access_token : access_token })
                .expect(httpStatus.OK)
                .end(function (err, res) {
                    if (err) return done(err);
                    var tokens = helpers.parse(res.text);
                    expect(tokens).to.exist;
                    expect(tokens.access_token).to.exist;
                    expect(tokens.access_token != access_token).to.be.true;
                    done();
                });
            });
        });

    });

};