var supertest = require('supertest');
var chai = require('chai');
var expect = chai.expect;
var api = supertest('https://' + process.env.SYSTEMAPIC_DOMAIN);
var helpers = require('../helpers');
var token = helpers.token;
var expected = require('../../shared/errors');
var httpStatus = require('http-status');
var async = require('async');
var apiModule = {
	auth: require('../../api/api.auth'),
	redis: require('../../api/api.redis')
}
module.exports = function () {

    describe('/reset/password', function () {

		var token = apiModule.auth.setPasswordResetToken({uuid: helpers.test_user.uuid});

        it('should respond with status code 400 and error if token or password don\'t exist in request body', function (done) {

            api.post('/reset/password')
                .send({})
                .expect(httpStatus.BAD_REQUEST)
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }

                    var result = helpers.parse(res.text);
                    expect(result.error.errors.missingRequiredFields).to.be.an.array;
                    expect(result.error.errors.missingRequiredFields).to.include('token');
                    expect(result.error.errors.missingRequiredFields).to.include('password');
                    done();
                });

        });

        it('should respond with status code 400 and error if token is invalid', function (done) {

            api.post('/reset/password')
                .send({
                	token: 'Bad token',
                	password: 'some password'
                })
                .expect(httpStatus.UNAUTHORIZED)
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }

                    var result = helpers.parse(res.text);
                    expect(result.error.message).to.be.equal(expected.invalid_token.errorMessage);
                    done();
                });
                
        });

        it('should respond with status code 200 and error if token is valid', function (done) {

            api.post('/reset/password')
                .send({
                	token: token,
                	password: 'some password'
                })
                .expect('Location', '/')
                .end(done);
			                
        });

    });

};