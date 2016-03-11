var supertest = require('supertest');
var chai = require('chai');
var expect = chai.expect;
var api = supertest.agent('https://' + process.env.SYSTEMAPIC_DOMAIN);
var helpers = require('./helpers');
var token = helpers.token;
var expected = require('../shared/errors');
var httpStatus = require('http-status');
var endpoints = require('./endpoints.js');
var _ = require('lodash');
var cookieParser = require('cookie-parser');

describe.only(endpoints.logout, function () {
    var access_token = '';
    var session = '';

    before(helpers.create_user);    
    after(helpers.delete_file);
    before(function (done) {
        api.get(endpoints.users.token.token)
        .query({
            username : util.test_user.email,
            password : util.test_user.password
        })
        .send()
        .expect(httpStatus.OK)
        .end(function (err, res) {
            if (err) {
                return done(err);
            }
            
            var tokens = util.parse(res.text);
            expect(tokens.token_type).to.be.equal('multipass');
            expect(_.size(tokens.access_token)).to.be.equal(43);
            access_token = tokens.access_token;
            done();
        });

    });

    it('should respond with status code 200', function (done) {
        api.post(endpoints.users.token.check)
            .send()
            .expect(httpStatus.OK)
            .end(done);
    });

    it('should respond with status code 401', function (done) {
        api.get(endpoints.logout)
            .send()
            .expect(httpStatus.FOUND)
            .end(function (err, response) {
                if (err) {
                    return done(err);
                }
                done();
            });
    });

    it('should respond with status code 401', function (done) {
        api.post(endpoints.users.token.check)
            .send()
            .expect(httpStatus.UNAUTHORIZED)
            .end(done);
    });
});