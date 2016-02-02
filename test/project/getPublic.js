var assert = require('assert');
var supertest = require('supertest');
var chai = require('chai');
var expect = chai.expect;
var api = supertest('https://' + process.env.SYSTEMAPIC_DOMAIN);
var helpers = require('../helpers');
var token = helpers.token;
var httpStatus = require('http-status');
var expected = require('../../shared/errors');

module.exports = function () {
	describe('/api/project/get/public', function () {

	        it("should respond with status code 401 when not authenticated", function (done) {
	            api.post('/api/project/get/public')
	                .send()
	                .expect(httpStatus.UNAUTHORIZED)
	                .end(done);
	        });

	        it('should respond with status code 400 and specific error message if username or project_slug don\'t exist in request body', function (done) {
	            token(function (err, access_token) {
	                api.post('/api/project/get/public')
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
	                        expect(result.error.errors.missingRequiredFields).to.be.an.array;
	                        expect(result.error.errors.missingRequiredFields).to.include('username');
	                        expect(result.error.errors.missingRequiredFields).to.include('project_slug');
	                        done();
	                    });
	            });
	        });
	        
	        it('should respond with status code 404 and specific error message if user doesn\'t exist', function (done) {
	            token(function (err, access_token) {
	                api.post('/api/project/get/public')
	                    .send({
	                        access_token: access_token,
	                        username: 'some username',
	                        project_slug: 'some project_slug'
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

	        context('when user have no specific project', function () {
				
				it('should respond with status code 404 and specific error message', function (done) {
					token(function (err, access_token) {
		                api.post('/api/project/get/public')
		                    .send({
		                        access_token: access_token,
		                        username: helpers.test_user.username,
		                        project_slug: 'some project_slug'
		                    })
		                    .expect(httpStatus.NOT_FOUND)
		                    .end(function (err, res) {
		                        if (err) {
		                            return done(err);
		                        }

		                        var result = helpers.parse(res.text);

		                        expect(result.error.message).to.be.equal(expected.no_such_project.errorMessage);
		                        expect(result.error.code).to.be.equal(httpStatus.NOT_FOUND);
		                        done();
		                    });
		            });
		        });

	        });

			context('when user have specific project', function () {

			    var tmpNotPublicProject = {};
			    var tmpPublicProject = {};

			    before(function (done) {
			        helpers.create_project_by_info({
			            name: 'mocha-test-project_not_public',
			            uuid: 'uuid-mocha-test-project_not_public',
			            createdBy: helpers.test_user.uuid,
			            slug: 'test_slug_not_public'
			        }, function (err, project) {
			            if (err) {
			                return done(err);
			            }

			            tmpNotPublicProject = project;
			            done();
			        });
			    });

			    before(function (done) {
			        helpers.create_project_by_info({
			            name: 'mocha-test-project_public',
			            uuid: 'uuid-mocha-test-project_public',
			            createdBy: helpers.test_user.uuid,
			            slug: 'test_slug_public',
			            access: {
			            	options: {
			            		isPublic: true
				            }
				        }
			        }, function (err, project) {
			            if (err) {
			                return done(err);
			            }

			            tmpPublicProject = project;
			            done();
			        });
			    });

			    after(function (done) {
			        helpers.delete_project_by_id(tmpNotPublicProject.uuid, done);
			    });

			    after(function (done) {
			        helpers.delete_project_by_id(tmpPublicProject.uuid, done);
			    });

				it('should respond with status code 400 and specific error message if project is not public', function (done) {
					token(function (err, access_token) {
		                api.post('/api/project/get/public')
		                    .send({
		                        access_token: access_token,
		                        username: helpers.test_user.username,
		                        project_slug: tmpNotPublicProject.slug
		                    })
		                    .expect(httpStatus.BAD_REQUEST)
		                    .end(function (err, res) {
		                        if (err) {
		                            return done(err);
		                        }

		                        var result = helpers.parse(res.text);
		                        expect(result.error.message).to.be.equal(expected.not_a_public_project.errorMessage);
		                        expect(result.error.code).to.be.equal(httpStatus.BAD_REQUEST);
		                        done();
		                    });
		            });
		        });

				it('should respond with status code 200 and specific project', function (done) {
					token(function (err, access_token) {
		                api.post('/api/project/get/public')
		                    .send({
		                        access_token: access_token,
		                        username: helpers.test_user.username,
		                        project_slug: tmpPublicProject.slug
		                    })
		                    .expect(httpStatus.OK)
		                    .end(function (err, res) {
		                        if (err) {
		                            return done(err);
		                        }

		                        var result = helpers.parse(res.text);
		                        
		                        expect(result.uuid).to.be.equal(tmpPublicProject.uuid)
		                        done();
		                    });
		            });
		        });

	        });
			
	});
};
