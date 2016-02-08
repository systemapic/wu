var supertest = require('supertest');
var chai = require('chai');
var expect = chai.expect;
var api = supertest('https://' + process.env.SYSTEMAPIC_DOMAIN);
var helpers = require('../helpers');
var token = helpers.token;
var httpStatus = require('http-status');
var expected = require('../../shared/errors');

module.exports = function () {

    describe('/api/user/invite', function () {

	    it('should respond with status code 401 when not authenticated', function (done) {
	        api.post('/api/user/invite')
	            .send({})
	            .expect(httpStatus.UNAUTHORIZED)
	            .end(done);
	    });
	
        it('should respond with status code 400 when emails or customMessage or access don\'t exist in request body', function (done) {
            token(function (err, access_token) {
                if (err) {
                    return done(err);
                }
                
				api.post('/api/user/invite')
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
                        expect(result.error.errors.missingRequiredFields).to.include('emails');
                        expect(result.error.errors.missingRequiredFields).to.include('customMessage');
                        expect(result.error.errors.missingRequiredFields).to.include('access');
                        expect(result.error.errors.missingRequiredFields).to.include('access.edit');
                        expect(result.error.errors.missingRequiredFields).to.include('access.read');
                        done();
	                });
            });
        });

        it('should respond with status code 400 when emails array is empty', function (done) {
            token(function (err, access_token) {
                if (err) {
                    return done(err);
                }
                
                api.post('/api/user/invite')
                    .send({
                        emails: [],
                        customMessage: 'test customMessage',
                        access: {
                            read: [],
                            edit: []
                        },
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
                        expect(result.error.errors.missingRequiredFields).to.include('emails');
                        done();
                    });
            });
        });

        it('should respond with status code 400 when access object does not contain read and edit arrays', function (done) {
            token(function (err, access_token) {
                if (err) {
                    return done(err);
                }
                
                api.post('/api/user/invite')
                    .send({
                        emails: ['test@mocha.com'],
                        customMessage: 'test customMessage',
                        access: {},
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
                        expect(result.error.errors.missingRequiredFields).to.include('access.edit');
                        expect(result.error.errors.missingRequiredFields).to.include('access.read');
                        done();
                    });
            });
        });

        it('should respond with status code 200', function (done) {
            token(function (err, access_token) {
                if (err) {
                    return done(err);
                }
                
                api.post('/api/user/invite')
                    .send({
                        emails: ['test@mocha.com'],
                        customMessage: 'test customMessage',
                        access: {
                            read: [],
                            edit: []
                        },
                        access_token: access_token
                    })
                    .expect(httpStatus.OK)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }

                        var result = helpers.parse(res.text);

                        expect(result.error).to.be.null;
                        done();
                    });
            });
        });

	});

};