var supertest = require('supertest');
var chai = require('chai');
var expect = chai.expect;
var api = supertest('https://' + process.env.SYSTEMAPIC_DOMAIN);
var helpers = require('../helpers');
var token = helpers.token;
var httpStatus = require('http-status');
var expected = require('../../shared/errors');
var endpoints = require('../endpoints.js');
var testData = require('../shared/users/create.json');
var User = require('../../models/user');
var test_user_data = testData.testUserWithCamelCaseEmail;
var test_user = {};

module.exports = function () {

    describe.only(endpoints.users.create, function () {

        afterEach(function (done) {
            helpers.delete_user_by_id(test_user.uuid, done);
        });

        afterEach(function (done) {
            User.findOne({username : "testUser"})
                .remove()
                .exec(done);
        });

        afterEach(function (done) {
            User.findOne({username : "userWithCamelCaseUserName"})
                .remove()
                .exec(done);
        });

        afterEach(function (done) {
            User.findOne({username : "some_other_username"})
                .remove()
                .exec(done);
        });
        
        afterEach(function (done) {
            User.findOne({username : test_user.username.toLowerCase()})
                .remove()
                .exec(done);
        });

        it('should create user correctly with lowercase email', function (done) {
            test_user = test_user_data;
            api.post(endpoints.users.create)
                .send(test_user)
                .expect(httpStatus.OK)
                .end(function (err, result) {
                    if (err) {
                        return done(err);
                    }

                    result = helpers.parse(result.text);

                    test_user.uuid = result.uuid;
                    User.findOne({
                        uuid: test_user.uuid
                    }).exec(function (err, user) {
                        if (err) {
                            done(err);
                        }

                        expect(user.local.email).to.be.equal(test_user.email.toLowerCase());
                        done();
                    });
                });
        });

        it('should create user correctly with lowercase username', function (done) {
            test_user = test_user_data;
            test_user.username = "userWithCamelCaseUserName"
            api.post(endpoints.users.create)
                .send(test_user)
                .expect(httpStatus.OK)
                .end(function (err, result) {
                    if (err) {
                        return done(err);
                    }

                    result = helpers.parse(result.text);

                    test_user.uuid = result.uuid;
                    User.findOne({
                        uuid: test_user.uuid
                    }).exec(function (err, user) {
                        if (err) {
                            done(err);
                        }

                        expect(user.local.email).to.be.equal(test_user.email.toLowerCase());
                        expect(user.username).to.be.equal(test_user.username.toLowerCase());
                        done();
                    });
                });
        });

        it('should check if user with specific email already exist and don\'t dependent from register', function (done) {
            test_user = test_user_data;
            api.post(endpoints.users.create)
                .send(test_user)
                .expect(httpStatus.OK)
                .end(function (err, result) {
                    if (err) {
                        return done(err);
                    }

                    result = helpers.parse(result.text);
                    test_user.uuid = result.uuid;

                    test_user.email = test_user.email.toLowerCase();
                    test_user.username = 'other_username';
                    api.post(endpoints.users.create)
                        .send(test_user)
                        .expect(httpStatus.BAD_REQUEST)
                        .end(done);
                });
        });

        it('should check if user with specific username already exist and don\'t dependent from register', function (done) {
            test_user = test_user_data;
            api.post(endpoints.users.create)
                .send(test_user)
                .expect(httpStatus.OK)
                .end(function (err, result) {
                    if (err) {
                        return done(err);
                    }

                    result = helpers.parse(result.text);
                    test_user.uuid = result.uuid;

                    test_user.email = "other_user@email.com";
                    test_user.username = test_user.username.toLowerCase();
                    api.post(endpoints.users.create)
                        .send(test_user)
                        .expect(httpStatus.BAD_REQUEST)
                        .end(done);
                });
        });

        it('should return correctly access token when email has camelCase register', function (done) {
            test_user = test_user_data;
            api.post(endpoints.users.create)
                .send(test_user)
                .expect(httpStatus.OK)
                .end(function (err, result) {
                    if (err) {
                        return done(err);
                    }

                    result = helpers.parse(result.text);
                    test_user.uuid = result.uuid;
                
                    api.get(endpoints.users.token)
                        .send({
                            email: test_user.email,
                            password: test_user.password
                        })
                        .expect(httpStatus.OK)
                        .end(done);
                });
        });

        it('should return correctly access token when email has lowerCase register', function (done) {
            test_user = test_user_data;
            api.post(endpoints.users.create)
                .send(test_user)
                .expect(httpStatus.OK)
                .end(function (err, result) {
                    if (err) {
                        return done(err);
                    }

                    result = helpers.parse(result.text);
                    test_user.uuid = result.uuid;
                
                    api.get(endpoints.users.token)
                        .send({
                            email: test_user.email.toLowerCase(),
                            password: test_user.password
                        })
                        .expect(httpStatus.OK)
                        .end(done);
                });
        });

        it('should return correctly access token when username has camelCase register', function (done) {
            test_user = test_user_data;
            api.post(endpoints.users.create)
                .send(test_user)
                .expect(httpStatus.OK)
                .end(function (err, result) {
                    if (err) {
                        return done(err);
                    }

                    result = helpers.parse(result.text);
                    test_user.uuid = result.uuid;
                
                    api.get(endpoints.users.token)
                        .send({
                            username: test_user.username,
                            password: test_user.password
                        })
                        .expect(httpStatus.OK)
                        .end(done);
                });
        });

        it('should return correctly access token when username has lowerCase register', function (done) {
            test_user = test_user_data;
            api.post(endpoints.users.create)
                .send(test_user)
                .expect(httpStatus.OK)
                .end(function (err, result) {
                    if (err) {
                        return done(err);
                    }

                    result = helpers.parse(result.text);
                    test_user.uuid = result.uuid;
                
                    api.get(endpoints.users.token)
                        .send({
                            username: test_user.username.toLowerCase(),
                            password: test_user.password
                        })
                        .expect(httpStatus.OK)
                        .end(done);
                });
        });
        
    });

};