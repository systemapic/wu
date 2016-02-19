var supertest = require('supertest');
var chai = require('chai');
var expect = chai.expect;
var api = supertest('https://' + process.env.SYSTEMAPIC_DOMAIN);
var helpers = require('../helpers');
var token = helpers.token;
var httpStatus = require('http-status');
var expected = require('../../shared/errors');
var Hash 	= require('../../models/hash');
var Project 	= require('../../models/project');
var endpoints = require('../endpoints.js');

module.exports = function () {
	describe(endpoints.hashes.set, function () {
		var hash = {};
		var tmpProject = {};

	    before(function (done) {
	        helpers.create_project_by_info({
	            name: 'mocha-test-project',
	            uuid: 'uuid-mocha-test-project-for-hash-set',
	            access: {
	                edit: [helpers.test_user.uuid]
	            },
	            createdBy: helpers.test_user.uuid,
	            settings: {
	            	saveState: true
	            },
	            state: 'current'
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
            api.post(endpoints.hashes.set)
                .send()
                .expect(httpStatus.UNAUTHORIZED)
                .end(done);
        });

        it('should respond with status code 400 and specific error message if project_id and hash don\'t exist in request body', function (done) {
            token(function (err, access_token) {
                api.post(endpoints.hashes.set)
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
                        expect(result.error.errors.missingRequiredFields).to.include('project_id');
                        expect(result.error.errors.missingRequiredFields).to.include('hash');
                        done();
                    });
            });
        });

        it('should respond with status code 400 and specific error message if hash exist but it is empty object', function (done) {
            token(function (err, access_token) {
                api.post(endpoints.hashes.set)
                    .send({
                        access_token: access_token,
                        hash: {}
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
                        expect(result.error.errors.missingRequiredFields).to.include('project_id');
                        expect(result.error.errors.missingRequiredFields).to.include('hash.position');
                        expect(result.error.errors.missingRequiredFields).to.include('hash.layers');
                        expect(result.error.errors.missingRequiredFields).to.include('hash.id');
                        done();
                    });
            });
        });

		context('saveState is undefined', function () {

			after(function (done) {
				Hash
				.findOne({uuid: hash.uuid})
		            	.remove()
				.exec(done);
			});

		    it('should respond with status code 200 and create hash', function (done) {
		        token(function (err, access_token) {
		            api.post(endpoints.hashes.set)
		                .send({
		                    access_token: access_token,
		                    project_id: 'some project id',
		                    hash: {
		                    	position: {
						lat : '1',
						lng : '1',
						zoom : '1'
		                    	},
		                    	layers: ['some layer'],
		                    	id: 'some id'
		                    }
		                })
		                .expect(httpStatus.OK)
		                .end(function (err, res) {
		                    if (err) {
		                        return done(err);
		                    }

		                    var result = helpers.parse(res.text);
		                    expect(result.error).to.be.null;
		                    expect(result.hash.uuid).to.exist;
		                    expect(result.hash.position).to.exist;
		                    expect(result.hash.position.lat).to.be.equal('1');
		                    expect(result.hash.position.lng).to.be.equal('1');
		                    expect(result.hash.position.zoom).to.be.equal('1');
		                    expect(result.hash.layers).to.be.an.array;
		                    expect(result.hash.layers).to.include('some layer');
		                    expect(result.hash.id).to.be.equal('some id');
		                    hash.uuid = result.hash.uuid;
		                    done();
		                });
		        });
		    });

		});
		
		context('saveState is false', function () {

			after(function (done) {
				Hash.findOne({uuid: hash.uuid})
		            .remove()
					.exec(done);
			});

	        it('should respond with status code 200 and not change project state', function (done) {
	            token(function (err, access_token) {
	                api.post(endpoints.hashes.set)
	                    .send({
	                        access_token: access_token,
	                        project_id: tmpProject.uuid,
	                        saveState: false,
	                        hash: {
	                        	position: {
						lat : '1',
						lng : '1',
						zoom : '1'
	                        	},
	                        	layers: ['some layer'],
	                        	id: 'some id'
	                        }
	                    })
	                    .expect(httpStatus.OK)
	                    .end(function (err, res) {
	                        if (err) {
	                            return done(err);
	                        }

	                        var result = helpers.parse(res.text);
	                        expect(result.error).to.be.null;
	                        expect(result.hash.uuid).to.exist;
	                        expect(result.hash.position).to.exist;
	                        expect(result.hash.position.lat).to.be.equal('1');
	                        expect(result.hash.position.lng).to.be.equal('1');
	                        expect(result.hash.position.zoom).to.be.equal('1');
	                        expect(result.hash.layers).to.be.an.array;
	                        expect(result.hash.layers).to.include('some layer');
	                        expect(result.hash.id).to.be.equal('some id');
	                        hash.uuid = result.hash.uuid;

				Project
				.findOne({uuid : tmpProject.uuid})
				.exec(function (err, _project) {
					if (err) {
						return done(err);
					}

					expect(_project.state).to.be.equal(tmpProject.state);

					done();
				});

	                    });
	            });
	        });
		});


		context('saveState is true, but project does not exist', function () {

			after(function (done) {
				Hash
				.findOne({uuid: hash.uuid})
		            	.remove()
				.exec(done);
			});

	        it('should respond with status code 200 and add error that project does not exist', function (done) {
	            token(function (err, access_token) {
	                api.post(endpoints.hashes.set)
	                    .send({
	                        access_token: access_token,
	                        project_id: 'some id',
	                        saveState: true,
	                        hash: {
	                        	position: {
						lat : '1',
						lng : '1',
						zoom : '1'
	                        	},
	                        	layers: ['some layer'],
	                        	id: 'some id'
	                        }
	                    })
	                    .expect(httpStatus.OK)
	                    .end(function (err, res) {
	                        if (err) {
	                            return done(err);
	                        }

	                        var result = helpers.parse(res.text);
	                        expect(result.error).to.exist;
	                        expect(result.error.code).to.be.equal(httpStatus.NOT_FOUND);
	                        expect(result.error.message).to.be.equal(expected.no_such_project.errorMessage);
	                        expect(result.hash.uuid).to.exist;
	                        expect(result.hash.position).to.exist;
	                        expect(result.hash.position.lat).to.be.equal('1');
	                        expect(result.hash.position.lng).to.be.equal('1');
	                        expect(result.hash.position.zoom).to.be.equal('1');
	                        expect(result.hash.layers).to.be.an.array;
	                        expect(result.hash.layers).to.include('some layer');
	                        expect(result.hash.id).to.be.equal('some id');
	                        hash.uuid = result.hash.uuid;
	                        done();
	                    });
	            });
	        });

		});

		context('saveState is true', function () {

			after(function (done) {
				Hash
				.findOne({uuid: hash.uuid})
				.remove()
				.exec(done);
			});

		        it('should respond with status code 200 and should change project state', function (done) {
		            token(function (err, access_token) {
		                api.post(endpoints.hashes.set)
		                    .send({
		                        access_token: access_token,
		                        project_id: tmpProject.uuid,
		                        saveState: true,
		                        hash: {
		                        	position: {
							lat : '1',
							lng : '1',
							zoom : '1'
		                        	},
		                        	layers: ['some layer'],
		                        	id: 'some id'
		                        }
		                    })
		                    .expect(httpStatus.OK)
		                    .end(function (err, res) {
		                        if (err) {
		                            return done(err);
		                        }

		                        var result = helpers.parse(res.text);
		                        expect(result.error).to.be.null;
		                        expect(result.hash.uuid).to.exist;
		                        expect(result.hash.position).to.exist;
		                        expect(result.hash.position.lat).to.be.equal('1');
		                        expect(result.hash.position.lng).to.be.equal('1');
		                        expect(result.hash.position.zoom).to.be.equal('1');
		                        expect(result.hash.layers).to.be.an.array;
		                        expect(result.hash.layers).to.include('some layer');
		                        expect(result.hash.id).to.be.equal('some id');
		                        hash.uuid = result.hash.uuid;
					Project
					.findOne({uuid : tmpProject.uuid})
					.exec(function (err, _project) {
						if (err) {
							return done(err);
						}

						expect(_project.state).to.be.equal(result.hash.id);

						done();
					});

		                    });
		            	});
		        });
		});

	});
};