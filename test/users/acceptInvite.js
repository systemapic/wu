var supertest = require('supertest');
var chai = require('chai');
var expect = chai.expect;
var api = supertest('https://' + process.env.SYSTEMAPIC_DOMAIN);
var helpers = require('../helpers');
var token = helpers.token;
var httpStatus = require('http-status');
var expected = require('../../shared/errors');
var endpoints = require('../endpoints.js');
var User = require('../../models/user');
var Project = require('../../models/project');
var async = require('async');
var testProject = {
    name: 'mocha-test-project',
    uuid: 'uuid-mocha-test-project',
    access: {
        edit: [],
        read: []
    }
};

module.exports = function () {

    describe(endpoints.users.invite.accept, function () {
        var inviteToken;
        var tmpProject;
        var tmpInviteToken;
        var tmpInviteTokenWithBadProject;

        it('should respond with status code 401 when not authenticated', function (done) {
            api.post(endpoints.users.invite.accept)
                .send({})
                .expect(httpStatus.UNAUTHORIZED)
                .end(done);
        });

        it('should respond with status code 400 when invite_token doesn\'t exist in request body', function (done) {
            token(function (err, access_token) {
                if (err) {
                    return done(err);
                }

                api.post(endpoints.users.invite.accept)
                    .send({ access_token: access_token })
                    .expect(httpStatus.BAD_REQUEST)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }

                        var result = helpers.parse(res.text);
                        expect(result.error.message).to.be.equal(expected.missing_information.errorMessage);
                        expect(result.error.code).to.be.equal(httpStatus.BAD_REQUEST);
                        expect(result.error.errors.missingRequiredFields).to.include('invite_token');
                        done();
                    });
            });
        });

        context('when', function () {
            beforeEach(function (done) {
                helpers.create_project_by_info(testProject, function (err, project) {
                    if (err) {
                        return done(err);
                    }

                    tmpProject = project;
                    done();
                });
            });

            beforeEach(function (done) {

                helpers.createInviteToken({
                    email : 'mocha_test_user@systemapic.com',
                    access: {
                        edit: [tmpProject.uuid, 'some other user with edit access'],
                        read: ['some other user with read access']
                    },
                    token : inviteToken,
                    invited_by : helpers.test_user.uuid,
                    timestamp : new Date().getTime(),
                    type : 'email'
                }, function (err, inviteToken) {
                    if (err) {
                        return done(err);
                    }

                    tmpInviteTokenWithBadProject = inviteToken;
                    done();
                });

            });

            beforeEach(function (done) {

                helpers.createInviteToken({
                    email : 'mocha_test_user@systemapic.com',
                    access: {
                        edit: [tmpProject.uuid],
                        read: []
                    },
                    token : inviteToken,
                    invited_by : helpers.test_user.uuid,
                    timestamp : new Date().getTime(),
                    type : 'email'
                }, function (err, inviteToken) {
                    if (err) {
                        return done(err);
                    }

                    tmpInviteToken = inviteToken;
                    done();
                });

            });

            afterEach(function (done) {
                helpers.delete_project_by_id(tmpProject.uuid, done);
            });

            it('should respond with status code 200 and add user to project edit array when invite_token is correct', function (done) {
                var ops = [];

                ops.push(function (callback) {
                    token(callback);
                });

                ops.push(function (access_token, callback) {
                    api.post(endpoints.users.invite.accept)
                            .send({
                                access_token: access_token,
                                invite_token: tmpInviteToken
                            })
                            .expect(httpStatus.OK)
                            .end(function (err, res) {
                                if (err) {
                                    return callback(err);
                                }

                                var result = helpers.parse(res.text);
                                callback(null, result);
                            });
                });

                ops.push(function (result, callback) {
                    expect(result.email).to.be.equal('mocha_test_user@systemapic.com');
                    expect(result.access.edit).to.be.an.array;
                    expect(result.access.edit).to.be.not.empty;
                    expect(result.access.edit).to.include('uuid-mocha-test-project');
                    expect(result.access.read).to.be.an.array;
                    expect(result.access.read).to.be.empty;
                    expect(result.invited_by).to.be.equal('uuid-mocha-test-project');
                    expect(result.timestamp).to.exist;
                    expect(result.type).to.be.equal('email');

                    Project.findOne({
                        uuid: tmpProject.uuid
                    }).exec(function (err, _project) {
                        expect(_project.access.edit).to.be.an.array;
                        expect(_project.access.edit.length).to.be.equal(1);
                        expect(_project.access.read).to.be.an.array;
                        expect(_project.access.read).to.be.empty;
                    });
                    callback(null);
                });
                
                async.waterfall(ops, done);

            });

            it('should respond with status code 404 and error if some of project does not exist', function (done) {
                var ops = [];

                ops.push(function (callback) {
                    token(callback);    
                });

                ops.push(function (access_token, callback) {
                    api.post(endpoints.users.invite.accept)
                            .send({
                                access_token: access_token,
                                invite_token: tmpInviteTokenWithBadProject
                            })
                            .expect(httpStatus.NOT_FOUND)
                            .end(function (err, res) {
                                if (err) {
                                    return callback(err);
                                }

                                var result = helpers.parse(res.text);
                                expect(result.error.message).to.be.equal(expected.no_such_project.errorMessage);
                                expect(result.error.code).to.be.equal(httpStatus.NOT_FOUND);
                                callback(null, result);
                            });
                });
                
                async.waterfall(ops, done);

            });
        });
        
    });

};