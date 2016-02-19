var supertest = require('supertest');
var chai = require('chai');
var expect = chai.expect;
var api = supertest('https://' + process.env.SYSTEMAPIC_DOMAIN);
var helpers = require('../helpers');
var token = helpers.token;
var httpStatus = require('http-status');
var User = require('../../models/user');
var expected = require('../../shared/errors');
var endpoints = require('../endpoints.js');


module.exports = function () {

    describe(endpoints.users.contacts.request, function () {

	    it('should respond with status code 401 when not authenticated', function (done) {
	        api.post(endpoints.users.contacts.request)
	            .send({})
	            .expect(httpStatus.UNAUTHORIZED)
	            .end(done);
	    });

        it('should respond with status code 400 when contact doesn\'t exist in request body', function (done) {
            token(function (err, access_token) {
                if (err) {
                    return done(err);
                }
                
				api.post(endpoints.users.contacts.request)
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
                        expect(result.error.errors.missingRequiredFields).to.include('contact');
                        done();
	                });
            });
        });

        it('should respond with status code 404 when user does not exist', function (done) {
            token(function (err, access_token) {
                if (err) {
                    return done(err);
                }
                
				api.post(endpoints.users.contacts.request)
	                .send({
                        access_token: access_token,
                        contact: 'some user'
                    })
	                .expect(httpStatus.NOT_FOUND)
	                .end(function (err, res) {
	                	if (err) {
	                		return done(err);
	                	}

                        var result = helpers.parse(res.text);

                        expect(result.error.message).to.be.equal(expected.no_such_user.errorMessage);
                        expect(result.error.code).to.be.equal(httpStatus.NOT_FOUND);
                        done();
	                });
            });
        });

        it('should respond with status code 200 and update user status', function (done) {
            token(function (err, access_token) {
                if (err) {
                    return done(err);
                }
                
				api.post(endpoints.users.contacts.request)
	                .send({
                        access_token: access_token,
                        contact: helpers.test_user.uuid
                    })
	                .expect(httpStatus.OK)
	                .end(function (err, res) {
	                	if (err) {
	                		return done(err);
	                	}

                        var result = helpers.parse(res.text);

                        expect(result.error).to.be.null;
                        User.findOne({uuid: helpers.test_user.uuid})
                        	.exec(function (err, _user) {
                        		expect(_user.status.contact_requests).to.be.an.array;
                        		expect(_user.status.contact_requests).to.be.not.Empty;
                        		done();
                        	});
	                });
            });
        });

	});

}