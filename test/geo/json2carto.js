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
    describe('/api/geo/json2carto', function () {

        it('should respond with status code 401 when not authenticated', function (done) {
            api.post('/api/geo/json2carto')
                .send({})
                .expect(httpStatus.UNAUTHORIZED)
                .end(done);
        });

        it('should respond with status code 400 if style doesn\'t exist in reqest body', function (done) {
            token(function (err, access_token) {
                if (err) {
                    return done(err);
                }

                api.post('/api/geo/json2carto')
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
                        expect(result.error.errors.missingRequiredFields).to.include('style');
                        done();
                    });
            });
        });

        it('should respond with specific css if style is a point', function (done) {
            token(function (err, access_token) {
                if (err) {
                    return done(err);
                }

                var standartPointCss =  "@point_opacity: 1;\n"+
										"@marker_size_factor: 5;\n"+
										"[zoom<10] { marker-width: 0.2 * @marker_size_factor; }\n"+
										"[zoom=10] { marker-width: 0.3 * @marker_size_factor; }\n"+
										"[zoom=11] { marker-width: 0.5 * @marker_size_factor; }\n"+
										"[zoom=12] { marker-width: 1   * @marker_size_factor; }\n"+
										"[zoom=13] { marker-width: 1   * @marker_size_factor; }\n"+
										"[zoom=14] { marker-width: 2   * @marker_size_factor; }\n"+
										"[zoom=15] { marker-width: 4   * @marker_size_factor; }\n"+
										"[zoom=16] { marker-width: 6   * @marker_size_factor; }\n"+
										"[zoom=17] { marker-width: 8   * @marker_size_factor; }\n"+
										"[zoom=18] { marker-width: 12  * @marker_size_factor; }\n"+
										"\n"+
										"#layer {\n"+
										"\n"+
										"	marker-allow-overlap: true;\n"+
										"	marker-clip: false;\n"+
										"	marker-comp-op: screen;\n"+
										"\n"+
										"	marker-opacity: @point_opacity;\n"+
										"\n"+
										"	marker-fill: red;\n"+
										"\n"+
										"}"

                api.post('/api/geo/json2carto')
                    .send({
                        access_token: access_token,
                        style: {
                        	point: {
                        		enabled: true
                        	}
                        }
                    })
                    .expect(httpStatus.OK)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }

                        expect(res.text).to.be.equal(standartPointCss);
                        done();
                    });
            });
        });

        it('should respond with specific css if style is a polygon', function (done) {
            token(function (err, access_token) {
                if (err) {
                    return done(err);
                }

                var standartPointCss =  "@polygon_opacity: 1;\n"+
										"#layer {\n"+
										"\n"+
										"	polygon-opacity: @polygon_opacity;\n"+
										"\n"+
										"	polygon-fill: red;\n"+
										"\n"+
										"}";

                api.post('/api/geo/json2carto')
                    .send({
                        access_token: access_token,
                        style: {
                        	polygon: {
                        		enabled: true
                        	}
                        }
                    })
                    .expect(httpStatus.OK)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }

                        // console.log(res.text);
                        expect(res.text).to.be.equal(standartPointCss);
                        done();
                    });
            });
        });

        it('should respond with specific css if style is a line', function (done) {
            token(function (err, access_token) {
                if (err) {
                    return done(err);
                }

                var standartPointCss =  "@line_opacity: 1;\n"+
										"@line_size_factor: 3;\n"+
										"[zoom<10] { line-width: 0.1 * @line_size_factor; }\n"+
										"[zoom=10] { line-width: 0.3 * @line_size_factor; }\n"+
										"[zoom=11] { line-width: 0.5 * @line_size_factor; }\n"+
										"[zoom=12] { line-width: 1   * @line_size_factor; }\n"+
										"[zoom=13] { line-width: 1   * @line_size_factor; }\n"+
										"[zoom=14] { line-width: 2   * @line_size_factor; }\n"+
										"[zoom=15] { line-width: 4   * @line_size_factor; }\n"+
										"[zoom=16] { line-width: 6   * @line_size_factor; }\n"+
										"[zoom=17] { line-width: 8   * @line_size_factor; }\n"+
										"[zoom=18] { line-width: 12  * @line_size_factor; }\n"+
										"\n"+
										"#layer {\n"+
										"\n"+
										"	line-opacity: @line_opacity;\n"+
										"\n"+
										"	line-color: red;\n"+
										"\n"+
										"\n"+
										"        line-join: round;\n"+
										"        line-cap: round;}";

                api.post('/api/geo/json2carto')
                    .send({
                        access_token: access_token,
                        style: {
                        	line: {
                        		enabled: true
                        	}
                        }
                    })
                    .expect(httpStatus.OK)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }

                        expect(res.text).to.be.equal(standartPointCss);
                        done();
                    });
            });
        });

    });
};
