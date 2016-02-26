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
var testData = require('../shared/hashes/set.json');

module.exports = function () {
	describe(endpoints.hashes.set, function () {
		var hash = {};
		var tmpProject = {};

	    before(function (done) {
	        helpers.create_project_by_info(testData.projectInfo, function (err, project) {
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
				Hash.findOne({uuid: hash.uuid})
	            	.remove()
					.exec(done);
			});

		    it('should respond with status code 200 and create hash', function (done) {
		        token(function (err, access_token) {
					var setHashInfo = testData.setHashInfo;

					setHashInfo.access_token = access_token;
		            api.post(endpoints.hashes.set)
		                .send(setHashInfo)
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
					var setHashInfo = testData.setHashInfoSaveStateFalse;

					setHashInfo.access_token = access_token;
					setHashInfo.project_id = tmpProject.uuid;
	                api.post(endpoints.hashes.set)
	                    .send(setHashInfo)
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
					var setHashInfo = testData.setHashInfoSaveStateTrue;

					setHashInfo.access_token = access_token;
	                api.post(endpoints.hashes.set)
	                    .send(setHashInfo)
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
					var setHashInfo = testData.setHashInfoSaveStateTrue;

					setHashInfo.access_token = access_token;

	                api.post(endpoints.hashes.set)
	                    .send(setHashInfo)
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

	        it('should should respond with status code 400 if some fields have bad type', function (done) {
            	var shouldBeAStringButItIsObject = 'should be string, but now it is an object';
            	var shouldBeArrayOfStringButItIsObject = 'should be array of strings, but now it is an object';

	            token(function (err, access_token) {
	                api.post(endpoints.hashes.set)
	                    .send({
	                        access_token: access_token,
	                        project_id: tmpProject.uuid,
	                        saveState: true,
	                        hash: {
	                        	position: {
									lat : {lat: shouldBeAStringButItIsObject},
									lng : {lng: shouldBeAStringButItIsObject},
									zoom : {zoom: shouldBeAStringButItIsObject}
	                        	},
	                        	layers: {layers: shouldBeArrayOfStringButItIsObject},
	                        	id: 'some id'
	                        }
	                    })
	                    .expect(httpStatus.BAD_REQUEST)
	                    .end(function (err, res) {
	                        if (err) {
	                            return done(err);
	                        }

	                        var result = helpers.parse(res.text);

	                        expect(result.error.message).to.be.equal(expected.invalid_fields.errorMessage);
	                        expect(result.error.errors).to.be.an.array;
	                        expect(result.error.errors).to.be.not.empty;
	                        expect(result.error.errors['position.lat'].value.lat).to.be.equal(shouldBeAStringButItIsObject);
	                        expect(result.error.errors['position.lat'].message).to.be.equal('Cast to String failed for value "[object Object]" at path "position.lat"');
	                        expect(result.error.errors['position.lng'].value.lng).to.be.equal(shouldBeAStringButItIsObject);
	                        expect(result.error.errors['position.lng'].message).to.be.equal('Cast to String failed for value "[object Object]" at path "position.lng"');
	                        expect(result.error.errors['position.zoom'].value.zoom).to.be.equal(shouldBeAStringButItIsObject);
	                        expect(result.error.errors['position.zoom'].message).to.be.equal('Cast to String failed for value "[object Object]" at path "position.zoom"');
	                        expect(result.error.errors['layers'].value.layers).to.be.equal(shouldBeArrayOfStringButItIsObject);
	                        expect(result.error.errors['layers'].message).to.be.equal('Cast to Array failed for value "[object Object]" at path "layers"');
	                        done();
	                    });
	            });
	        });
		});

	});
};