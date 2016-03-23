var supertest = require('supertest');
var chai = require('chai');
var expect = chai.expect;
var api = supertest('https://' + process.env.SYSTEMAPIC_DOMAIN);
var helpers = require('../helpers');
var token = helpers.token;
var httpStatus = require('http-status');
var expected = require('../../shared/errors');
var endpoints = require('../endpoints.js');
var testData = require('../shared/users/create.json');
var User = require('../../models/user');
var second_test_user = testData;

module.exports = function () {

    describe(endpoints.users.create, function () {

        after(function (done) {
            helpers.delete_user_by_id(second_test_user.uuid, done);
        });

        it('should create user correctly', function (done) {
            api.post(endpoints.users.create)
                .send(testData.second_test_user)
                .expect(httpStatus.OK)
                .end(function (err, result) {
                    if (err) {
                        return done(err);
                    }

                    User.findOne({
                        uuid: second_test_user.uuid
                    }).exec(function (err, user) {
                        if (err) {
                            done(err);
                        }

                        expect(user.email).to.be.equal(second_test_user.toLowerCase());
                        done();
                    });
                });
        });

    });

};