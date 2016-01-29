var supertest = require('supertest');
var chai = require('chai');
var expect = chai.expect;
var api = supertest('https://' + process.env.SYSTEMAPIC_DOMAIN);
var helpers = require('../helpers');
var token = helpers.token;
var httpStatus = require('http-status');

module.exports = function () {
    describe('/api/project/unique', function () {
        it("should respond with status code 401 when not authenticated", function (done) {
            api.post('/api/project/unique')
                .send({})
                .expect(httpStatus.UNAUTHORIZED)
                .end(done);
        });

        it('should respond with status code 200', function (done) {
            token(function (err, access_token) {
                api.post('/api/project/unique')
                    .send({access_token: access_token})
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }

                        var result = helpers.parse(res.text);

                        expect(result.unique).to.be.true;
                        done();
                    });
            });
        });

    });
};