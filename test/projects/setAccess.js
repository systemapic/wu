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
	describe(endpoints.projects.setAccess, function () {
		var tmpProjectCanEdit = {};
		var tmpProjectCanNotEdit = {};

		before(function (done) {
			helpers.create_project_by_info({
			    name: 'mocha-test-project_public',
			    uuid: 'uuid-mocha-test-project_public_can_not_edit',
			    createdBy: 'test',
			    slug: 'test_slug_public',
			    access: {
			    	options: {
			    		isPublic: true
			            }
			        }
			}, function (err, project) {
			    if (err) return done(err);
			    tmpProjectCanNotEdit = project;
			    done();
			});
		});

		before(function (done) {
			helpers.create_project_by_info({
			    name: 'mocha-test-project_public',
			    uuid: 'uuid-mocha-test-project_public_can_edit',
			    createdBy: helpers.test_user.uuid,
			    slug: 'test_slug_public',
			    access: {
			    	options: {
			    		isPublic: true
			            }
			        }
			}, function (err, project) {
			    if (err) return done(err);
			    tmpProjectCanEdit = project;
			    done();
			});
		});

		after(function (done) {
			helpers.delete_project_by_id(tmpProjectCanNotEdit.uuid, done);
		});

		after(function (done) {
			helpers.delete_project_by_id(tmpProjectCanEdit.uuid, done);
		});

		// test 1
		it("should respond with status code 401 when not authenticated", function (done) {
			api.post(endpoints.projects.setAccess)
				.send()
				.expect(httpStatus.UNAUTHORIZED)
				.end(done);
		});

		// test 2
		it('should respond with status code 400 and specific error message if project or access don\'t exist in request body', function (done) {
			token(function (err, access_token) {
				api.post(endpoints.projects.setAccess)
					.send({
						access_token: access_token
					})
					.expect(httpStatus.BAD_REQUEST)
					.end(function (err, res) {
						if (err) return done(err);
						var result = helpers.parse(res.text);
						expect(result.error.message).to.be.equal(expected.missing_information.errorMessage);
						expect(result.error.code).to.be.equal(httpStatus.BAD_REQUEST);
						expect(result.error.errors.missingRequiredFields).to.be.an.array;
						expect(result.error.errors.missingRequiredFields).to.include('project');
						expect(result.error.errors.missingRequiredFields).to.include('access');
						done();
					});
			});
		});

		// test 3
		it('should respond with status code 400 and specific error message if user can\'t edit project', function (done) {
			token(function (err, access_token) {
				api.post(endpoints.projects.setAccess)
					.send({
						access_token: access_token,
						project: tmpProjectCanNotEdit.uuid,
						access: {edit: {}}
					})
					.expect(httpStatus.BAD_REQUEST)
					.end(function (err, res) {
						if (err) return done(err);
						var result = helpers.parse(res.text);
						expect(result.error.message).to.be.equal(expected.no_access.errorMessage);
						expect(result.error.code).to.be.equal(httpStatus.BAD_REQUEST);;
						done();
					});
			});
		});

		// test 4
		it('should respond with status code 400 and specific error message if user can\'t edit project', function (done) {
			token(function (err, access_token) {
				api.post(endpoints.projects.setAccess)
					.send({
						access_token: access_token,
						project: tmpProjectCanEdit.uuid,
						access: {edit: ['test']}
					})
					.expect(httpStatus.OK)
					.end(function (err, res) {
						if (err) {
							return done(err);
						}

						var result = helpers.parse(res.text);

						expect(result.access.edit).to.include('test');
						done();
					});
			});
		});
	});
};