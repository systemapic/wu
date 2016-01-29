var supertest = require('supertest');
var chai = require('chai');
var expect = chai.expect;
var api = supertest('https://' + process.env.SYSTEMAPIC_DOMAIN);
var helpers = require('../helpers');
var token = helpers.token;
var httpStatus = require('http-status');
var expected = require('../../shared/errors');

module.exports = function () {
    var tmpProject ={};

    before(function (done) {
        helpers.create_project_by_info({name: 'mocha-test-project'}, function (err, project) {
            if (err) {
                return done(err);
            }

            tmpProject = project;
            done();
        });
    });

    after(function (done) {
        helpers.delete_project_by_id((tmpProject.uuid, done));
    });

    describe('/api/project/delete', function () {

        it('should be able to delete project', function (done) {
            token(function (err, access_token) {
                api.post('/api/project/delete')
                    .send({
                        project_id: tmpProject.uuid,
                        access_token: access_token
                    })
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }

                        var result = helpers.parse(res.text);
                        assert.ok(result.deleted);
                        assert.equal(result, tmpProject.uuid);
                        done();
                    });
            });
        });

        it("should respond with status code 401 when not authenticated", function (done) {
            api.post('/api/project/delete')
                .send({project_id: tmpProject.uuid})
                .expect(httpStatus.UNAUTHORIZED)
                .end(done);
        });

        it('should respond with status code 400 and specific error message if empty body', function (done) {
            token(function (err, access_token) {
                api.post('/api/project/delete')
                    .send({access_token: access_token})
                    .expect(httpStatus.BAD_REQUEST, helpers.createExpectedError(expected.missing_information.errorMessage))
                    .end(done);
            });
        });

        it('should respond with status code 400 and specific error message if no project_id', function (done) {
            token(function (err, access_token) {
                api.post('/api/project/delete')
                    .send({
                        foo: 'mocha-test-updated-name',
                        access_token: access_token
                    })
                    .expect(httpStatus.BAD_REQUEST, helpers.createExpectedError(expected.missing_information.errorMessage))
                    .end(done);
            });
        });

    });
};