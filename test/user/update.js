var supertest = require('supertest');
var chai = require('chai');
var expect = chai.expect;
var api = supertest('https://' + process.env.SYSTEMAPIC_DOMAIN);
var helpers = require('../helpers');
var token = helpers.token;
var httpStatus = require('http-status');
var Layer = require('../../models/layer');
var expected = require('../../shared/errors');
var second_test_user = {
    email : 'second_mocha_test_user@systemapic.com',
    firstName : 'Igor',
    lastName : 'Ziegler',
    uuid : 'second_test-user-uuid',
    password : 'second_test-user-password'
};

module.exports = function () {

    describe('/api/user/update', function () {

        before(function (done) {
            helpers.create_user_by_parameters(second_test_user, done);
        });

        after(function (done) {
            helpers.delete_user_by_id(second_test_user.uuid, done);
        });

        it('should respond with status code 401 when not authenticated', function (done) {
            api.post('/api/user/update')
                .send({})
                .expect(httpStatus.UNAUTHORIZED)
                .end(done);
        });

        it('should respond with status code 400 when uuid and project don\'t exist in request body', function (done) {
            token(function (err, access_token) {
                if (err) {
                    return done(err);
                }
                
				api.post('/api/user/update')
	                .send({
                        access_token: access_token
                    })
	                .expect(httpStatus.BAD_REQUEST)
	                .end(function (err, res) {
	                	if (err) {
	                		return done(err);
	                	}

                        var result = helpers.parse(res.text);

                        expect(result.error.message).to.be.equal(expected.missing_information.errorMessage);
                        expect(result.error.code).to.be.equal(httpStatus.BAD_REQUEST);
                        expect(result.error.errors.missingRequiredFields).to.include('uuid');
                        done();
	                });
            });
        });

        it('should respond with status code 400 if user hasn\'t access', function (done) {
            helpers.users_token(second_test_user, function (err, access_token) {
                if (err) {
                    return done(err);
                }
                
                api.post('/api/user/update')
                    .send({
                        access_token: access_token,
                        uuid: 'some id'
                    })
                    .expect(httpStatus.BAD_REQUEST)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }

                        var result = helpers.parse(res.text);

                        expect(result.error.message).to.be.equal(expected.no_access.errorMessage);
                        expect(result.error.code).to.be.equal(httpStatus.BAD_REQUEST);

                        done();
                    });
            });
        });

        it('should respond with status code 200 and update user correctly', function (done) {
           token(function (err, access_token) {
                if (err) {
                    return done(err);
                }

                api.post('/api/user/update')
                    .send({
                        access_token: access_token,
                        uuid: helpers.test_user.uuid,
                        company: "update", 
                        position: "update", 
                        phone: "update", 
                        firstName: "update",
                        lastName: "update" 
                    })
                    .expect(httpStatus.OK)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }

                        var result = helpers.parse(res.text);

                        expect(result.user.company).to.be.equal("update");
                        expect(result.user.position).to.be.equal("update");
                        expect(result.user.phone).to.be.equal("update");
                        expect(result.user.firstName).to.be.equal("update");
                        expect(result.user.lastName).to.be.equal("update");
                        expect(result.updated).to.include("company");
                        expect(result.updated).to.include("position");
                        expect(result.updated).to.include("phone");
                        expect(result.updated).to.include("firstName");
                        expect(result.updated).to.include("lastName");

                        done();
                    });
            }); 
        });

    });

};
