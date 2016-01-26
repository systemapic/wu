var supertest = require('supertest');
var chai = require('chai');
var expect = chai.expect;
var api = supertest('https://' + process.env.SYSTEMAPIC_DOMAIN);
var helpers = require('../helpers');
var token = helpers.token;
var httpStatus = require('http-status');

module.exports = function () {
    describe('/api/layers/new', function () {

        var newLayer = {
            title: 'new mocha test layer title',
            description: 'new mocha test layer description'   // html
        };

        it('should respond with status code 401 when not authenticated', function (done) {
            api.post('/api/layers/new')
                .send({})
                .expect(httpStatus.UNAUTHORIZED)
                .end(done);
        });

        it('should respond with status code 200 and create new layer', function (done) {
            token(function (err, access_token) {
                if (err) {
                    return done(err);
                }

                newLayer.access_token = access_token;
                api.post('/api/layers/new')
                    .send(newLayer)
                    .expect(httpStatus.OK)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }

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
            Layer.findOne({uuid: newLayer.uuid})
                .remove()
                .exec(done);
        });

    });
};