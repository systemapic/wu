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

        context('when type is point', function () {

        	var style = {
	            	point: {
	            		enabled: true
	            	}
	            };

	        it('should respond with specific css if style has not parameters', function (done) {
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
	                        style: style
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

	        it('should respond with specific css if style has parameters', function (done) {
	        	style.point = {
            		enabled: true,
	        		blend : {
						mode: "test"
		        	},
					opacity: {
						column: '10',
						range: ['100', '150']
					},
					color: {
						column: 'testColor',
						range: ['100', '150'],
						value: ['#ff0000', '#00ff00', '#0000ff', '#ffffff', '#000000']
					},
					pointsize: {
						column: "testPointsize",
						range: ['100', '150']
					},
					targets: [{
						opacity: 2,
						column: 10,
						operator: "!=",
						value: 100,
						width: 150,
						color: "#000000"
					}]
		        };

				token(function (err, access_token) {
	                if (err) {
	                    return done(err);
	                }

	                var standartPointCss =  "@point_opacity: [10] / 50 - 2;\n"+
											"\n"+
											"@testColor: [testColor];\n"+
											"@testColor_max: 150;\n"+
											"@testColor_min: 100;\n"+
											"\n"+
											"@testColor_color_1: rgb(255, 0, 0);\n"+
											"@testColor_color_2: rgb(255, 170, 0);\n"+
											"@testColor_color_3: rgb(170, 255, 0);\n"+
											"@testColor_color_4: rgb(0, 255, 0);\n"+
											"@testColor_color_5: rgb(0, 255, 170);\n"+
											"@testColor_color_6: rgb(0, 170, 255);\n"+
											"@testColor_color_7: rgb(0, 0, 255);\n"+
											"@testColor_color_8: rgb(114, 227, 190);\n"+
											"@testColor_color_9: rgb(216, 226, 197);\n"+
											"@testColor_color_10: rgb(255, 255, 255);\n"+
											"@testColor_color_11: rgb(171, 171, 171);\n"+
											"@testColor_color_12: rgb(84, 84, 84);\n"+
											"@testColor_color_13: rgb(0, 0, 0);\n"+
											"\n"+
											"@testColor_delta: (@testColor_max - @testColor_min)/13;\n"+
											"@testColor_step_1: (@testColor_min + @testColor_delta * 0);\n"+
											"@testColor_step_2: (@testColor_min + @testColor_delta * 1);\n"+
											"@testColor_step_3: (@testColor_min + @testColor_delta * 2);\n"+
											"@testColor_step_4: (@testColor_min + @testColor_delta * 3);\n"+
											"@testColor_step_5: (@testColor_min + @testColor_delta * 4);\n"+
											"@testColor_step_6: (@testColor_min + @testColor_delta * 5);\n"+
											"@testColor_step_7: (@testColor_min + @testColor_delta * 6);\n"+
											"@testColor_step_8: (@testColor_min + @testColor_delta * 7);\n"+
											"@testColor_step_9: (@testColor_min + @testColor_delta * 8);\n"+
											"@testColor_step_10: (@testColor_min + @testColor_delta * 9);\n"+
											"@testColor_step_11: (@testColor_min + @testColor_delta * 10);\n"+
											"@testColor_step_12: (@testColor_min + @testColor_delta * 11);\n"+
											"@testColor_step_13: (@testColor_min + @testColor_delta * 12);\n"+
											"\n"+
											"@marker_size_min: 100;\n"+
											"@marker_size_range: 50;\n"+
											"@marker_size_field: [testPointsize];\n"+
											"@marker_size_field_maxVal: 100;\n"+
											"@marker_size_field_minVal: 10;\n"+
											"\n"+
											"//TODO: Fix this!\n"+
											"@marker_size_factor: (@marker_size_field / (@marker_size_field_maxVal - @marker_size_field_minVal)) * (@marker_size_range + @marker_size_min);\n"+
											"\n"+
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
											"	marker-comp-op: test;\n"+
											"\n"+
											"	marker-opacity: @point_opacity;\n"+
											"\n"+
											"	[@testColor < @testColor_step_2] { marker-fill: @testColor_color_1; }\n"+
											"	[@testColor >= @testColor_step_2][@testColor < @testColor_step_3]{ marker-fill: @testColor_color_2; }\n"+
											"	[@testColor >= @testColor_step_3][@testColor < @testColor_step_4]{ marker-fill: @testColor_color_3; }\n"+
											"	[@testColor >= @testColor_step_4][@testColor < @testColor_step_5]{ marker-fill: @testColor_color_4; }\n"+
											"	[@testColor >= @testColor_step_5][@testColor < @testColor_step_6]{ marker-fill: @testColor_color_5; }\n"+
											"	[@testColor >= @testColor_step_6][@testColor < @testColor_step_7]{ marker-fill: @testColor_color_6; }\n"+
											"	[@testColor >= @testColor_step_7][@testColor < @testColor_step_8]{ marker-fill: @testColor_color_7; }\n"+
											"	[@testColor >= @testColor_step_8][@testColor < @testColor_step_9]{ marker-fill: @testColor_color_8; }\n"+
											"	[@testColor >= @testColor_step_9][@testColor < @testColor_step_10]{ marker-fill: @testColor_color_9; }\n"+
											"	[@testColor >= @testColor_step_10][@testColor < @testColor_step_11]{ marker-fill: @testColor_color_10; }\n"+
											"	[@testColor >= @testColor_step_11][@testColor < @testColor_step_12]{ marker-fill: @testColor_color_11; }\n"+
											"	[@testColor >= @testColor_step_12][@testColor < @testColor_step_13]{ marker-fill: @testColor_color_12; }\n"+
											"	[@testColor >= @testColor_step_13] { marker-fill: @testColor_color_13; }\n"+
											"\n"+
											"\n"+
											"    [10 != 100] {\n"+
											"        marker-fill: #000000;\n"+
											"        marker-opacity: 2;\n"+
											"        marker-width: 150;\n"+
											"    }\n"+

											"}"

	                api.post('/api/geo/json2carto')
	                    .send({
	                        access_token: access_token,
	                        style: style,
	                        columns: {
								testPointsize: {
									min: 10,
									max: 100
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

        context('when type is polygon', function () {

	        it('should respond with specific css if style has not parameters', function (done) {
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

		});

        context('when type is line', function () {

	        it('should respond with specific css if style has not parameters', function (done) {
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
    });
};
