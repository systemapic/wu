var supertest = require('supertest');
var chai = require('chai');
var expect = chai.expect;
var api = supertest('https://' + process.env.SYSTEMAPIC_DOMAIN);
var helpers = require('../helpers');
var httpStatus = require('http-status');
var expected = require('../../shared/errors');

module.exports = function () {

    describe('/api/token', function () {
        it('should respond with status code 400 and error if username and email don\'t exist in request body', function (done) {

            api.post('/api/token')
                .send({})
                .expect(httpStatus.BAD_REQUEST)
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }

                    var result = helpers.parse(res.text);
                    expect(result.error.errors.missingRequiredFields).to.be.an.array;
                    expect(result.error.errors.missingRequiredFields).to.include('username or email');

                    done();
                });

        });

        it('should respond with status code 400 and error if password doesn\'t exist in request body', function (done) {

            api.post('/api/token')
                .send({
                    username: 'some user'
                })
                .expect(httpStatus.BAD_REQUEST)
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }

                    var result = helpers.parse(res.text);
                    expect(result.error.errors.missingRequiredFields).to.be.an.array;
                    expect(result.error.errors.missingRequiredFields).to.include('password');

                    done();
                });

        });
    });

};