var supertest = require('supertest');
var chai = require('chai');
var expect = chai.expect;
var _ = require('lodash');
var api = supertest('https://' + process.env.SYSTEMAPIC_DOMAIN);
var helpers = require('../helpers');
var token = helpers.token;
var httpStatus = require('http-status');
var Layer = require('../../models/layer');
var endpoints = require('../endpoints.js');

module.exports = function () {
    describe(endpoints.layers.create, function () {


        // variables: todo: move to shared fiel
        var newLayer = {
            title: 'new mocha test layer title',
            description: 'new mocha test layer description'   // html
        };


        // test 1
        it('should respond with status code 401 when not authenticated', function (done) {
            api.post(endpoints.layers.create)
                .send({})
                .expect(httpStatus.UNAUTHORIZED)
                .end(done);
        });


        // test 2
        it('should respond with status code 200 and create new layer', function (done) {
            token(function (err, access_token) {
                if (err) return done(err);
                newLayer.access_token = access_token;
                api.post(endpoints.layers.create)
                    .send(newLayer)
                    .expect(httpStatus.OK)
                    .end(function (err, res) {
                        if (err) return done(err);
                        var result = helpers.parse(res.text);
                        expect(_.size(result.uuid)).to.be.equal(42);
                        expect(result.title).to.be.equal(newLayer.title);
                        expect(result.description).to.be.equal(newLayer.description);
                        newLayer.uuid = result.uuid;
                        done();
                    });
            });
        });

        after(function (done) {
            Layer
            .findOne({uuid: newLayer.uuid})
            .remove()
            .exec(done);
        });
    });
};