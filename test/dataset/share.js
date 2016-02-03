var supertest = require('supertest');
var chai = require('chai');
var expect = chai.expect;
var api = supertest('https://' + process.env.SYSTEMAPIC_DOMAIN);
var helpers = require('./../helpers');
var _ = require('lodash');
var token = helpers.token;
var expected = require('../../shared/errors');
var Layer   = require('../../models/layer');
var Project = require('../../models/project');
var async = require('async');
var httpStatus = require('http-status');

module.exports = function () {
    // skipping for now, because we need to make HUGE changes on the layer specs.. @igor: interested?
    describe('/api/dataset/share', function () {
		var second_test_user = {
		    email : 'second_mocha_test_user@systemapic.com',
		    firstName : 'Igor',
		    lastName : 'Ziegler',
		    uuid : 'second_test-user-uuid',
		    password : 'second_test-user-password'  
		};
    	var fileInfo = {
		    uuid : 'fileInfoUuid',
		    files : [],
		    name : 'fileInfoName',
		    originalName : 'fileInfoOriginalName',
		    description : 'fileInfoDescription'
    	};
    	var createdUser = {};

    	before(function (done) {
    		var ops = [];

    		ops.push(function (callback) {
    			helpers.create_file_by_parameters(fileInfo, function (err, _file) {
    				if (err) {
    					callback(err);
    				}

    				fileInfo._id = _file._id.toString();
    				callback(null, _file);
    			});
    		});

    		ops.push(function (file, callback) {
            	second_test_user.files = [file];
                helpers.create_user_by_parameters(second_test_user, function (err, _createdUser) {
                    if (err) {
                        callback(err);
                    }

                    createdUser = _createdUser;
                    callback(null, createdUser);
                });
    		});

    		async.waterfall(ops, done);

    	});

    	after(function (done) {
    		var ops = [];

    		ops.push(function (callback) {
    			helpers.delete_file_by_id(fileInfo.uuid, callback);
    		});

    		ops.push(function (params, callback) {
    			helpers.delete_user_by_id(second_test_user.uuid, callback);
    		});

    		async.waterfall(ops, done);
    	});

        it('should respond with status code 401 when not authenticated', function (done) {
            api.post('/api/dataset/share')
                .send({})
                .expect(httpStatus.UNAUTHORIZED)
                .end(done);
        });

        it('should respond with status code 400 if users and dataset don\'t exist in request body', function (done) {
            token(function (err, access_token) {
                if (err) {
                    return done(err);
                }

                api.post('/api/dataset/share')
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
                        expect(result.error.errors.missingRequiredFields).to.include('dataset');
                        expect(result.error.errors.missingRequiredFields).to.include('users');
                        done();
                    });
            });
        });

		it('should respond with status 404 if file doesn\'t exist', function (done) {
			token(function (err, access_token) {
                if (err) {
                    return done(err);
                }

                api.post('/api/dataset/share')
                    .send({
                        access_token: access_token,
                        users: [],
                        dataset: 'some dataset'
                    })
                    .expect(httpStatus.NOT_FOUND)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }

                        var result = helpers.parse(res.text);

                        expect(result.error.code).to.be.equal(httpStatus.NOT_FOUND);
                        expect(result.error.message).to.be.equal(expected.no_such_file.errorMessage);
                        done();
                    });
            });
		});


		it('should respond with status 400 if file exist and user have not access', function (done) {
			token(function (err, access_token) {
                if (err) {
                    return done(err);
                }

                api.post('/api/dataset/share')
                    .send({
                        access_token: access_token,
                        users: [],
                        dataset: fileInfo.uuid
                    })
                    .expect(httpStatus.BAD_REQUEST)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }

                        var result = helpers.parse(res.text);

                        expect(result.error.code).to.be.equal(httpStatus.BAD_REQUEST);
                        expect(result.error.message).to.be.equal(expected.no_access.errorMessage);
                        done();
                    });
            });
		});

		it('should respond with status 200 if file exist and users array is empty', function (done) {
 			helpers.users_token(second_test_user, function (err, access_token) {
                if (err) {
                    return done(err);
                }

                api.post('/api/dataset/share')
                    .send({
                        access_token: access_token,
                        users: [],
                        dataset: fileInfo.uuid
                    })
                    .expect(httpStatus.OK)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }

                        var result = helpers.parse(res.text);

                        expect(result.err).to.be.null;
                        expect(result.success).to.be.true;
                        expect(result.file_shared.file_name).to.be.equal(fileInfo.name);
                        expect(result.file_shared.file_uuid).to.be.equal(fileInfo.uuid);                        
                        expect(result.users_shared_with).to.be.an.array;
                        expect(result.users_shared_with).to.empty;
                        done();
                    });
            });
		});

		it('should respond with status 200 if file exist and users array contain unregistered user', function (done) {
 			helpers.users_token(second_test_user, function (err, access_token) {
                if (err) {
                    return done(err);
                }

                api.post('/api/dataset/share')
                    .send({
                        access_token: access_token,
                        users: ['test'],
                        dataset: fileInfo.uuid
                    })
                    .expect(httpStatus.OK)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }

                        var result = helpers.parse(res.text);

                        expect(result.err).to.be.null;
                        expect(result.success).to.be.true;
                        expect(result.file_shared.file_name).to.be.equal(fileInfo.name);
                        expect(result.file_shared.file_uuid).to.be.equal(fileInfo.uuid);                        
                        expect(result.users_shared_with).to.be.an.array;
                        expect(result.users_shared_with).to.empty;
                        done();
                    });
            });
		});

		it('should respond with status 200 if file exist and user have access', function (done) {
 			helpers.users_token(second_test_user, function (err, access_token) {
                if (err) {
                    return done(err);
                }

                api.post('/api/dataset/share')
                    .send({
                        access_token: access_token,
                        users: [helpers.test_user.uuid],
                        dataset: fileInfo.uuid
                    })
                    .expect(httpStatus.OK)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }

                        var result = helpers.parse(res.text);

                        expect(result.err).to.be.null;
                        expect(result.success).to.be.true;
                        expect(result.file_shared.file_name).to.be.equal(fileInfo.name);
                        expect(result.file_shared.file_uuid).to.be.equal(fileInfo.uuid);                        
                        expect(result.users_shared_with).to.be.an.array;
                        expect(result.users_shared_with).to.include(helpers.test_user.uuid);
                        done();
                    });
            });
		});

    });

};