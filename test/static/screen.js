var supertest = require('supertest');
var chai = require('chai');
var expect = chai.expect;
var api = supertest('https://' + process.env.SYSTEMAPIC_DOMAIN);
var helpers = require('../helpers');
var token = helpers.token;
var httpStatus = require('http-status');
var async = require('async');
var expected = require('../../shared/errors');
var File = require('../../models/file');
var endpoints = require('../endpoints.js');


module.exports = function () {
    describe.only(endpoints.static.screen, function () {
    	
    	var tempFileuuid = '';
    	
    	after(function (done) {
	        File.findOne({uuid : tempFileuuid})
		        .remove()
		        .exec(done);
    	});

        it('should respond with status code 401 when not authenticated', function (done) {
            api.post(endpoints.static.screen)
                .send({})
                .expect(httpStatus.UNAUTHORIZED)
                .end(done);
        });

        it('should respond with status code 200', function (done) {
            token(function (err, access_token) {
                api.post(endpoints.static.screen)
                    .send({
                        access_token: access_token
                    })
                    .expect(httpStatus.OK)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }

                        var result = helpers.parse(res.text);

                        tempFileuuid = result.image;
                        done();
                    });
            });
        });

    });
};