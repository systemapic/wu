var supertest = require('supertest');
var chai = require('chai');
var expect = chai.expect;
var api = supertest('https://' + process.env.SYSTEMAPIC_DOMAIN);
var util = require('./util');
var token = util.token;
var expected = require('../shared/errors');
var Layer   = require('../models/layer');

describe('Layer', function () {

    before(function(done) { util.create_user(done); });
    after(function(done) { util.delete_user(done); });

	describe('/api/layers/new', function () {
        
        var newLayer = {
            uuid: 'new mocha test layer uuid',   // layer uuid
            title: 'new mocha test layer title',
            description: 'new mocha test layer description',   // html
        };

        it('should respond with status code 401 when not authenticated', function (done) {
            api.post('/api/layers/new')
                .send({})
                .expect(401)
                .end(done);
        });

        it('should respond with status code 200 and create new layer', function (done) {
            token(function (err, token) {
                if (err) {
                    return done(err);
                }

                api.post('/api/layers/new')
                    .set('Authorization', 'Bearer ' + token)
                    .send(newLayer)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }

                        var result = util.parse(res.text);
                        expect(result.uuid).to.be.equal(newLayer.uuid);
                        expect(result.title).to.be.equal(newLayer.title);
                        expect(result.description).to.be.equal(newLayer.description);
                        done();
                    });
            });
        });

        it('should respond with status code 422 and error if layer with such uuid already exist', function (done) {
	        token(function (err, token) {
	        	if (err) {
	        		return done(err);
	        	}

	            api.post('/api/layers/new')
                    .set('Authorization', 'Bearer ' + token)
	                .send(newLayer)
	                .expect(422, expected.layer_already_exist)
	                .end(done);
        	});
	    });

        after(function (done) {
            Layer.findOne({uuid : newLayer.uuid})
                .remove()
                .exec(done);
        });

	});
});