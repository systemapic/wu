var supertest = require('supertest');
var chai = require('chai');
var expect = chai.expect;
var api = supertest('https://' + process.env.SYSTEMAPIC_DOMAIN);
var helpers = require('../helpers');
var token = helpers.token;
var httpStatus = require('http-status');
var expected = require('../../shared/errors');
var Project = require('../../models/project');
var second_test_user = {
    email : 'second_mocha_test_user@systemapic.com',
    firstName : 'Igor',
    lastName : 'Ziegler',
    uuid : 'second_test-user-uuid',
    password : 'second_test-user-password'
};

module.exports = function () {

    describe('/api/user/inviteToProjects', function () {
	    var tmpProject = {};

	    before(function (done) {
	        helpers.create_project_by_info({
	            name: 'mocha-test-project',
	            uuid: 'uuid-mocha-test-project',
                createdBy: helpers.test_user.uuid,
	            access: {
                    read: [],
                    edit: []
	            }
	        }, function (err, project) {
	            if (err) {
	                return done(err);
	            }

	            tmpProject = project;
	            done();
	        });
	    });

	    after(function (done) {
	        helpers.delete_project_by_id(tmpProject.uuid, done);
	    });

        before(function (done) {
            helpers.create_user_by_parameters(second_test_user, done);
        });

        after(function (done) {
            helpers.delete_user_by_id(second_test_user.uuid, done);
        });

	    it('should respond with status code 401 when not authenticated', function (done) {
	        api.post('/api/user/inviteToProjects')
	            .send({})
	            .expect(httpStatus.UNAUTHORIZED)
	            .end(done);
	    });

        it('should respond with status code 400 when user doesn\'t exist in request body', function (done) {
            token(function (err, access_token) {
                if (err) {
                    return done(err);
                }
                
				api.post('/api/user/inviteToProjects')
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
                        expect(result.error.errors.missingRequiredFields).to.include('user');
                        done();
	                });
            });
        });

        it('should respond with status code 400 when edits and reads array are empty', function (done) {
            token(function (err, access_token) {
                if (err) {
                    return done(err);
                }
                
				api.post('/api/user/inviteToProjects')
	                .send({
                        access_token: access_token,
                        user: 'some user'
                    })
	                .expect(httpStatus.BAD_REQUEST)
	                .end(function (err, res) {
	                	if (err) {
	                		return done(err);
	                	}

                        var result = helpers.parse(res.text);

                        expect(result.error.message).to.be.equal(expected.no_projects_provided.errorMessage);
                        expect(result.error.code).to.be.equal(httpStatus.BAD_REQUEST);
                        done();
	                });
            });
        });

        it('should respond with status code 200 and empty array of projects when user exists but read and edit projects do not exist', function (done) {
            token(function (err, access_token) {
                if (err) {
                    return done(err);
                }
                
				api.post('/api/user/inviteToProjects')
	                .send({
                        access_token: access_token,
                        user: helpers.test_user.uuid,
                        read: ['test'],
                        edit: ['test1']
                    })
	                .expect(httpStatus.OK)
	                .end(function (err, res) {
	                	if (err) {
	                		return done(err);
	                	}

                        var result = helpers.parse(res.text);

                        expect(result.error).to.be.null;
                        expect(result.projects).to.be.an.array;
                        expect(result.projects).to.be.empty;
                        done();
	                });
            });
        });

        it('should respond with status code 200 and add access', function (done) {
            token(function (err, access_token) {
                if (err) {
                    return done(err);
                }
                
				api.post('/api/user/inviteToProjects')
	                .send({
                        access_token: access_token,
                        user: second_test_user.uuid,
                        read: [tmpProject.uuid],
                        edit: ['test1']
                    })
	                .expect(httpStatus.OK)
	                .end(function (err, res) {
	                	if (err) {
	                		return done(err);
	                	}

                        var result = helpers.parse(res.text);
                        expect(result.error).to.be.null;
                        expect(result.projects).to.be.an.array;
                        expect(result.projects).to.be.not.empty;
                        expect(result.projects[0].project).to.be.equal(tmpProject.uuid);
                        expect(result.projects[0].access.read).to.be.an.array;
                        expect(result.projects[0].access.read).to.include(second_test_user.uuid);

                        Project.findOne({uuid: tmpProject.uuid})
                            .exec(function (err, _project) {
                                if (err) {
                                    return done(err);
                                }
                                
                                expect(_project.access.read).to.be.an.array;;
                                expect(_project.access.read).to.include(second_test_user.uuid);
                                done();
                            });
	                });
            });
        });

    });

}