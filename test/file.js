var supertest = require('supertest');
var chai = require('chai');
var expect = chai.expect;
var api = supertest('https://' + process.env.SYSTEMAPIC_DOMAIN);
var config = require('../config/server-config.js').serverConfig;
var util = require('./util');
var token = util.token;
var expected = require('../shared/errors');
var second_test_user = {
    email : 'second_mocha_test_user@systemapic.com',
    firstName : 'Igor',
    lastName : 'Ziegler',
    uuid : 'second_test-user-uuid',
    password : 'second_test-user-password'  
};
var testFile;

describe('File', function () {
    before(function(done) { util.create_user(done); });
    after(function(done) { util.delete_user(done); });
    this.slow(300);

	describe('/api/file/update', function () {
        
		before(function(done) {
			util.create_file(function (err, result) {
                	if (err) return done(err);

                	testFile = result;
                	done();
                });
		});

		after(function(done) {
			util.delete_file(done);
		});

        it('should respond with status code 401 when not authenticated', function (done) {
            api.post('/api/file/update')
                .send({})
                .expect(401)
                .end(done);
        });

        it('should respond with status code 422 if fileUuid doesn\'t exist in request body', function (done) {
            token(function (err, token) {
                api.post('/api/file/update')
                    .set('Authorization', 'Bearer ' + token)
                    .send({})
                    .expect(422, expected.missing_information)
                    .end(done);
            });
        });

        it('should respond with status code 422 and error if file doesn\'t exist', function (done) {
            token(function (err, token) {
                api.post('/api/file/update')
                    .set('Authorization', 'Bearer ' + token)
                    .send({
                    	fileUuid: "invalid file id"
                    })
                    .expect(422, expected.missing_information)
                    .end(done);
            });
        });

        before(function (done) {
            util.create_user_by_parameters(second_test_user, done);
        });

        after(function (done) {
            util.delete_user_by_id(second_test_user.uuid, done);
        });

        it('should respond with status code 422 and error if not authenticated', function (done) {
            util.users_token(second_test_user, function (err, token) {
                api.post('/api/file/update')
                    .set('Authorization', 'Bearer ' + token)
                    .send({
                        fileUuid: testFile.uuid
                    })
                    .expect(422, expected.missing_information)
                    .end(done);
            });
        });


	});
});