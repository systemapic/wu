var assert = require('assert');
var supertest = require('supertest');
var chai = require('chai');
var expect = chai.expect;
var api = supertest('https://' + process.env.SYSTEMAPIC_DOMAIN);
var helpers = require('../helpers');
var token = helpers.token;
var httpStatus = require('http-status');
var expected = require('../../shared/errors');
var Project = require('../../models/project');

module.exports = function () {

    describe('/api/project/addInvites', function () {
    	var tmpProject = {};

	    before(function (done) {
	        helpers.create_project_by_info({
	            name: 'mocha-test-project-addInvites',
	            uuid: 'uuid-mocha-test-project-addInvites',
	            access: {
	                edit: [helpers.test_user.uuid]
	            },
	            createdBy: helpers.test_user.uuid
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
    
        it("should respond with status code 401 when not authenticated", function (done) {
            api.post('/api/project/addInvites')
                .send({})
                .expect(httpStatus.UNAUTHORIZED)
                .end(done);
        });
	
        it("should respond with status code 400 if access or project", function (done) {
            token(function (err, access_token) {
                if (err) {
                    return done(err);
                }

                api.post('/api/project/addInvites')
                    .send({
                        access_token: access_token
                    })
                    .expect(httpStatus.BAD_REQUEST)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }

                        var result = helpers.parse(res.text);
                        expect(result.error.errors.missingRequiredFields).to.be.an.array;
                        expect(result.error.errors.missingRequiredFields).to.include('access');
                        expect(result.error.errors.missingRequiredFields).to.include('project');
                        done();
                    });
            });
        });

        it("should respond with status code 404 if project doesn\'t exist", function (done) {
            token(function (err, access_token) {
                if (err) {
                    return done(err);
                }

                api.post('/api/project/addInvites')
                    .send({
                        access_token: access_token,
                        access: 'some access',
                        project: 'some project'
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

        it("should respond with status code 400 if access.read doesn\'t exist in request body", function (done) {
            token(function (err, access_token) {
                if (err) {
                    return done(err);
                }

                api.post('/api/project/addInvites')
                    .send({
                        access_token: access_token,
                        access: 'some access',
                        project: tmpProject.uuid
                    })
                    .expect(httpStatus.BAD_REQUEST)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }

                        var result = helpers.parse(res.text);

                        expect(result.error.errors.missingRequiredFields).to.be.an.array;
                        expect(result.error.errors.missingRequiredFields).to.include('access.read');

                        done();
                    });
            });
        });

        it("should respond with status code 200 and should not add access for read if user has edit access", function (done) {
            token(function (err, access_token) {
                if (err) {
                    return done(err);
                }

                api.post('/api/project/addInvites')
                    .send({
                        access_token: access_token,
                        access: {
                        	read: [helpers.test_user.uuid]
                        },
                        project: tmpProject.uuid
                    })
                    .expect(httpStatus.OK)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }

                        Project.findOne({uuid: tmpProject.uuid})
                        	.exec(function (err, result) {
                        		if (err) {
                        			return done(err);
                        		}

                        		expect(result.access.read).to.be.an.array;
								expect(result.access.read).to.not.include(helpers.test_user.uuid);
								done();
                        	});
                    });
            });
        });

        it("should respond with status code 200 and add access for user", function (done) {
            token(function (err, access_token) {
                if (err) {
                    return done(err);
                }

                api.post('/api/project/addInvites')
                    .send({
                        access_token: access_token,
                        access: {
                        	read: ['test']
                        },
                        project: tmpProject.uuid
                    })
                    .expect(httpStatus.OK)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }

                        Project.findOne({uuid: tmpProject.uuid})
                        	.exec(function (err, result) {
                        		if (err) {
                        			return done(err)
                        		}

                        		expect(result.access.read).to.be.an.array;
								expect(result.access.read).to.include('test');
								done();
                        	});
                    });
            });
        });

	});
}