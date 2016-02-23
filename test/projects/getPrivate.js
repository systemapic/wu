var assert = require('assert');
var supertest = require('supertest');
var chai = require('chai');
var expect = chai.expect;
var api = supertest('https://' + process.env.SYSTEMAPIC_DOMAIN);
var helpers = require('../helpers');
var token = helpers.token;
var httpStatus = require('http-status');
var expected = require('../../shared/errors');
var endpoints = require('../endpoints.js');


module.exports = function () {
	describe(endpoints.projects.private, function () {

		// test 1
	        it("should respond with status code 401 when not authenticated", function (done) {
	            api.get(endpoints.projects.private)
	                .send()
	                .expect(httpStatus.UNAUTHORIZED)
	                .end(done);
	        });

	        // test 2
	        it('should respond with status code 400 and specific error message if project_id doesn\'t exist in request body', function (done) {
	            token(function (err, access_token) {
	                api.get(endpoints.projects.private)
			.query({
				access_token: access_token
			})
                        .send()
                        .expect(httpStatus.BAD_REQUEST)
                        .end(function (err, res) {
                        if (err) return done(err);
                        var result = helpers.parse(res.text);
                        expect(result.error.message).to.be.equal(expected.missing_information.errorMessage);
                        expect(result.error.code).to.be.equal(httpStatus.BAD_REQUEST);
                        expect(result.error.errors.missingRequiredFields).to.be.an.array;
                        expect(result.error.errors.missingRequiredFields).to.include('project_id');
                        done();
                        });
	            });
	        });
	        

	        // test 3
	        it('should respond with status code 200', function (done) {
	            token(function (err, access_token) {
	                api.get(endpoints.projects.private)
						.query({
							access_token: access_token,
							project_id: 'some project_id',
							user_access_token: 'some user_access_token'
						})
	                    .send()
	                    .expect(httpStatus.OK)
	                    .end(done);
	            });
	        });
			
	});
};
