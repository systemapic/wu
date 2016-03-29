var supertest = require('supertest');
var chai = require('chai');
var expect = chai.expect;
var api = supertest('https://' + process.env.SYSTEMAPIC_DOMAIN);
var helpers = require('../helpers');
var token = helpers.token;
var expected = require('../../shared/errors');
var httpStatus = require('http-status');
var endpoints = require('../endpoints.js');
var testFile = helpers.test_file;
var coreTestData = require('../shared/core.json');
var User = require('../../models/user');
var async = require('async');

module.exports = function () {
    describe(endpoints.data.create, function () {
        this.slow(500);
        var uuidOfCreatedDefaultFile = "";
        var uuidOfCreatedFile = "";

    	after(function (done) {
    		var ops = [];

    		ops.push(function (callback) {
    			helpers.delete_file_by_id(uuidOfCreatedDefaultFile, callback);	
    		});

    		ops.push(function (callback) {
    			helpers.delete_file_by_id(uuidOfCreatedFile, callback);	
    		});

    		async.parallel(ops, done);
			
    	});

        // test 1
        it('should respond with status code 401 when not authenticated', function (done) {
            api.post(endpoints.data.create)
                .send({})
                .expect(httpStatus.UNAUTHORIZED, {
                    error: {
                        code: httpStatus.UNAUTHORIZED, 
                        message: expected.invalid_token.errorMessage
                    }
                })
                .end(done);
        });

        // test 2
        it('should respond with status code 200 if user doesn\'t setup parameters', function (done) {
            token(function (err, access_token) {
                api.post(endpoints.data.create)
                    .send({
                    	access_token: access_token
                    })
                    .expect(httpStatus.OK)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }

                        var result = helpers.parse(res.text);

                        expect(result.createdBy).to.be.equal(helpers.test_user.uuid);
                        uuidOfCreatedDefaultFile = result.uuid;
                        User.findOne({
                        	uuid: helpers.test_user.uuid
                        }).exec(function (err, user) {
                        	if (err) {
                        		return done(err);
                        	}

                        	expect(user.files).to.be.an.array;
                        	expect(user.files).to.be.not.empty;
                        	expect(user.files).to.include(result._id);

                        	done();	
                        })
                    });
            });
        });

        // test 3
        it('should respond with status code 200 if user setup parameters', function (done) {
            token(function (err, access_token) {
                api.post(endpoints.data.create)
                    .send({
                    	access_token: access_token,
                    	createdByName: "Mocha_test_createdByName",
                    	files: ["test"],
                    	access: {
							users   : ["test_user"],
							projects: ["test_project"],
							clients : ["test_client"]
                    	},
                    	name: "Mocha_test_name",
                    	description: "Mocha_test_description",
                    	type: "Mocha_test_type",
                    	format: [".zip", '.jpg'],
                    	dataSize: "1024",
                	    data: {
					      postgis: {
					        database_name: "new database_name",
					        table_name: "newFileWithRasterTypeWithoutFileId",
					        data_type: "new data_type",
					        original_format: "new original_format",
					        metadata: "new metadata"
					      }
					    }
                    })
                    .expect(httpStatus.OK)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }

                        var result = helpers.parse(res.text);
                        expect(result.createdBy).to.be.equal(helpers.test_user.uuid);
                        expect(result.createdByName).to.be.equal("Mocha_test_createdByName");
                        expect(result.name).to.be.equal("Mocha_test_name");
                        expect(result.description).to.be.equal("Mocha_test_description");
                        expect(result.type).to.be.equal("Mocha_test_type");
                        expect(result.type).to.be.equal("Mocha_test_type");
                        expect(result.dataSize).to.be.equal("1024");
                        expect(result.data.postgis.database_name).to.be.equal("new database_name");
                        expect(result.data.postgis.table_name).to.be.equal("newFileWithRasterTypeWithoutFileId");
                        expect(result.data.postgis.data_type).to.be.equal("new data_type");
                        expect(result.data.postgis.original_format).to.be.equal("new original_format");
                        expect(result.data.postgis.metadata).to.be.equal("new metadata");
                        expect(result.access.users).to.be.an.array;
                        expect(result.access.users).to.be.not.empty;
                        expect(result.access.users).to.include("test_user");
                        expect(result.access.projects).to.be.an.array;
                        expect(result.access.projects).to.be.not.empty;
                        expect(result.access.projects).to.include("test_project");
                        expect(result.access.clients).to.be.an.array;
                        expect(result.access.clients).to.be.not.empty;
                        expect(result.access.clients).to.include("test_client");
                        expect(result.format).to.be.an.array;
                        expect(result.format).to.be.not.empty;
                        expect(result.format).to.include(".zip");
                        expect(result.format).to.include(".jpg");

                        uuidOfCreatedFile = result.uuid;

                        User.findOne({
                        	uuid: helpers.test_user.uuid
                        }).exec(function (err, user) {
                        	if (err) {
                        		return done(err);
                        	}

                        	expect(user.files).to.be.an.array;
                        	expect(user.files).to.be.not.empty;
                        	expect(user.files).to.include(result._id);

                        	done();	
                        })
                    });
            });
        });
    });
};