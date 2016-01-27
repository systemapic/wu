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

        	var style = {
	            	polygon: {
	            		enabled: true
	            	}
	            };

	        it('should respond with specific css if style has not parameters', function (done) {
	            token(function (err, access_token) {
	                if (err) {
	                    return done(err);
	                }

	                var standartPolygonCss =  "@polygon_opacity: 1;\n"+
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
	                        style: style
	                    })
	                    .expect(httpStatus.OK)
	                    .end(function (err, res) {
	                        if (err) {
	                            return done(err);
	                        }

	                        expect(res.text).to.be.equal(standartPolygonCss);
	                        done();
	                    });
	            });
	        });

			it('should respond with specific css if style has parameters', function (done) {
	        	style.polygon = {
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
					targets: [{
						opacity: 2,
						column: 10,
						operator: "!=",
						value: 100,
						color: "#000000"
					}]
		        };

				token(function (err, access_token) {
	                if (err) {
	                    return done(err);
	                }

	                var standartPolygonCss =  "@polygon_opacity: [10] / 50 - 2;\n"+
											"\n"+
											"@polygon_column: [testColor];\n"+
											"@polygon_column_max: 150;\n"+
											"@polygon_column_min: 100;\n"+
											"\n"+
											"@polygon_column_color_1: #ff0000;\n"+
											"@polygon_column_color_2: #df1f00;\n"+
											"@polygon_column_color_3: #bf3f00;\n"+
											"@polygon_column_color_4: #9f5f00;\n"+
											"@polygon_column_color_5: #7f7f00;\n"+
											"@polygon_column_color_6: #5f9f00;\n"+
											"@polygon_column_color_7: #3fbf00;\n"+
											"@polygon_column_color_8: #1fdf00;\n"+
											"@polygon_column_color_9: #00ff00;\n"+
											"@polygon_column_color_10: #00df1f;\n"+
											"@polygon_column_color_11: #00bf3f;\n"+
											"@polygon_column_color_12: #009f5f;\n"+
											"@polygon_column_color_13: #007f7f;\n"+
											"@polygon_column_color_14: #005f9f;\n"+
											"@polygon_column_color_15: #003fbf;\n"+
											"@polygon_column_color_16: #001fdf;\n"+
											"@polygon_column_color_17: #0000ff;\n"+
											"@polygon_column_color_18: #1f1fff;\n"+
											"@polygon_column_color_19: #3f3fff;\n"+
											"@polygon_column_color_20: #5f5fff;\n"+
											"@polygon_column_color_21: #7f7fff;\n"+
											"@polygon_column_color_22: #9f9fff;\n"+
											"@polygon_column_color_23: #bfbfff;\n"+
											"@polygon_column_color_24: #dfdfff;\n"+
											"@polygon_column_color_25: #ffffff;\n"+
											"@polygon_column_color_26: #dfdfdf;\n"+
											"@polygon_column_color_27: #bfbfbf;\n"+
											"@polygon_column_color_28: #9f9f9f;\n"+
											"@polygon_column_color_29: #7f7f7f;\n"+
											"@polygon_column_color_30: #5f5f5f;\n"+
											"@polygon_column_color_31: #3f3f3f;\n"+
											"@polygon_column_color_32: #1f1f1f;\n"+
											"@polygon_column_color_33: #000000;\n"+
											"\n"+
											"@polygon_column_delta: (@polygon_column_max - @polygon_column_min)/33;\n"+
											"@polygon_column_step_1: (@polygon_column_min + @polygon_column_delta * 0);\n"+
											"@polygon_column_step_2: (@polygon_column_min + @polygon_column_delta * 1);\n"+
											"@polygon_column_step_3: (@polygon_column_min + @polygon_column_delta * 2);\n"+
											"@polygon_column_step_4: (@polygon_column_min + @polygon_column_delta * 3);\n"+
											"@polygon_column_step_5: (@polygon_column_min + @polygon_column_delta * 4);\n"+
											"@polygon_column_step_6: (@polygon_column_min + @polygon_column_delta * 5);\n"+
											"@polygon_column_step_7: (@polygon_column_min + @polygon_column_delta * 6);\n"+
											"@polygon_column_step_8: (@polygon_column_min + @polygon_column_delta * 7);\n"+
											"@polygon_column_step_9: (@polygon_column_min + @polygon_column_delta * 8);\n"+
											"@polygon_column_step_10: (@polygon_column_min + @polygon_column_delta * 9);\n"+
											"@polygon_column_step_11: (@polygon_column_min + @polygon_column_delta * 10);\n"+
											"@polygon_column_step_12: (@polygon_column_min + @polygon_column_delta * 11);\n"+
											"@polygon_column_step_13: (@polygon_column_min + @polygon_column_delta * 12);\n"+
											"@polygon_column_step_14: (@polygon_column_min + @polygon_column_delta * 13);\n"+
											"@polygon_column_step_15: (@polygon_column_min + @polygon_column_delta * 14);\n"+
											"@polygon_column_step_16: (@polygon_column_min + @polygon_column_delta * 15);\n"+
											"@polygon_column_step_17: (@polygon_column_min + @polygon_column_delta * 16);\n"+
											"@polygon_column_step_18: (@polygon_column_min + @polygon_column_delta * 17);\n"+
											"@polygon_column_step_19: (@polygon_column_min + @polygon_column_delta * 18);\n"+
											"@polygon_column_step_20: (@polygon_column_min + @polygon_column_delta * 19);\n"+
											"@polygon_column_step_21: (@polygon_column_min + @polygon_column_delta * 20);\n"+
											"@polygon_column_step_22: (@polygon_column_min + @polygon_column_delta * 21);\n"+
											"@polygon_column_step_23: (@polygon_column_min + @polygon_column_delta * 22);\n"+
											"@polygon_column_step_24: (@polygon_column_min + @polygon_column_delta * 23);\n"+
											"@polygon_column_step_25: (@polygon_column_min + @polygon_column_delta * 24);\n"+
											"@polygon_column_step_26: (@polygon_column_min + @polygon_column_delta * 25);\n"+
											"@polygon_column_step_27: (@polygon_column_min + @polygon_column_delta * 26);\n"+
											"@polygon_column_step_28: (@polygon_column_min + @polygon_column_delta * 27);\n"+
											"@polygon_column_step_29: (@polygon_column_min + @polygon_column_delta * 28);\n"+
											"@polygon_column_step_30: (@polygon_column_min + @polygon_column_delta * 29);\n"+
											"@polygon_column_step_31: (@polygon_column_min + @polygon_column_delta * 30);\n"+
											"@polygon_column_step_32: (@polygon_column_min + @polygon_column_delta * 31);\n"+
											"@polygon_column_step_33: (@polygon_column_min + @polygon_column_delta * 32);\n"+
											"\n"+
											"#layer {\n"+
											"\n"+
											"	polygon-comp-op: test;\n"+
											"\n"+
											"	polygon-opacity: @polygon_opacity;\n"+
											"\n"+
											"	[@polygon_column < @polygon_column_step_2] { polygon-fill: @polygon_column_color_1; }\n"+
											"	[@polygon_column > @polygon_column_step_2][@polygon_column < @polygon_column_step_3]{ polygon-fill: @polygon_column_color_2; }\n"+
											"	[@polygon_column > @polygon_column_step_3][@polygon_column < @polygon_column_step_4]{ polygon-fill: @polygon_column_color_3; }\n"+
											"	[@polygon_column > @polygon_column_step_4][@polygon_column < @polygon_column_step_5]{ polygon-fill: @polygon_column_color_4; }\n"+
											"	[@polygon_column > @polygon_column_step_5][@polygon_column < @polygon_column_step_6]{ polygon-fill: @polygon_column_color_5; }\n"+
											"	[@polygon_column > @polygon_column_step_6][@polygon_column < @polygon_column_step_7]{ polygon-fill: @polygon_column_color_6; }\n"+
											"	[@polygon_column > @polygon_column_step_7][@polygon_column < @polygon_column_step_8]{ polygon-fill: @polygon_column_color_7; }\n"+
											"	[@polygon_column > @polygon_column_step_8][@polygon_column < @polygon_column_step_9]{ polygon-fill: @polygon_column_color_8; }\n"+
											"	[@polygon_column > @polygon_column_step_9][@polygon_column < @polygon_column_step_10]{ polygon-fill: @polygon_column_color_9; }\n"+
											"	[@polygon_column > @polygon_column_step_10][@polygon_column < @polygon_column_step_11]{ polygon-fill: @polygon_column_color_10; }\n"+
											"	[@polygon_column > @polygon_column_step_11][@polygon_column < @polygon_column_step_12]{ polygon-fill: @polygon_column_color_11; }\n"+
											"	[@polygon_column > @polygon_column_step_12][@polygon_column < @polygon_column_step_13]{ polygon-fill: @polygon_column_color_12; }\n"+
											"	[@polygon_column > @polygon_column_step_13][@polygon_column < @polygon_column_step_14]{ polygon-fill: @polygon_column_color_13; }\n"+
											"	[@polygon_column > @polygon_column_step_14][@polygon_column < @polygon_column_step_15]{ polygon-fill: @polygon_column_color_14; }\n"+
											"	[@polygon_column > @polygon_column_step_15][@polygon_column < @polygon_column_step_16]{ polygon-fill: @polygon_column_color_15; }\n"+
											"	[@polygon_column > @polygon_column_step_16][@polygon_column < @polygon_column_step_17]{ polygon-fill: @polygon_column_color_16; }\n"+
											"	[@polygon_column > @polygon_column_step_17][@polygon_column < @polygon_column_step_18]{ polygon-fill: @polygon_column_color_17; }\n"+
											"	[@polygon_column > @polygon_column_step_18][@polygon_column < @polygon_column_step_19]{ polygon-fill: @polygon_column_color_18; }\n"+
											"	[@polygon_column > @polygon_column_step_19][@polygon_column < @polygon_column_step_20]{ polygon-fill: @polygon_column_color_19; }\n"+
											"	[@polygon_column > @polygon_column_step_20][@polygon_column < @polygon_column_step_21]{ polygon-fill: @polygon_column_color_20; }\n"+
											"	[@polygon_column > @polygon_column_step_21][@polygon_column < @polygon_column_step_22]{ polygon-fill: @polygon_column_color_21; }\n"+
											"	[@polygon_column > @polygon_column_step_22][@polygon_column < @polygon_column_step_23]{ polygon-fill: @polygon_column_color_22; }\n"+
											"	[@polygon_column > @polygon_column_step_23][@polygon_column < @polygon_column_step_24]{ polygon-fill: @polygon_column_color_23; }\n"+
											"	[@polygon_column > @polygon_column_step_24][@polygon_column < @polygon_column_step_25]{ polygon-fill: @polygon_column_color_24; }\n"+
											"	[@polygon_column > @polygon_column_step_25][@polygon_column < @polygon_column_step_26]{ polygon-fill: @polygon_column_color_25; }\n"+
											"	[@polygon_column > @polygon_column_step_26][@polygon_column < @polygon_column_step_27]{ polygon-fill: @polygon_column_color_26; }\n"+
											"	[@polygon_column > @polygon_column_step_27][@polygon_column < @polygon_column_step_28]{ polygon-fill: @polygon_column_color_27; }\n"+
											"	[@polygon_column > @polygon_column_step_28][@polygon_column < @polygon_column_step_29]{ polygon-fill: @polygon_column_color_28; }\n"+
											"	[@polygon_column > @polygon_column_step_29][@polygon_column < @polygon_column_step_30]{ polygon-fill: @polygon_column_color_29; }\n"+
											"	[@polygon_column > @polygon_column_step_30][@polygon_column < @polygon_column_step_31]{ polygon-fill: @polygon_column_color_30; }\n"+
											"	[@polygon_column > @polygon_column_step_31][@polygon_column < @polygon_column_step_32]{ polygon-fill: @polygon_column_color_31; }\n"+
											"	[@polygon_column > @polygon_column_step_32][@polygon_column < @polygon_column_step_33]{ polygon-fill: @polygon_column_color_32; }\n"+
											"	[@polygon_column > @polygon_column_step_33] { polygon-fill: @polygon_column_color_33; }\n"+
											"\n"+
											"\n"+
											"    [10 != 100] {\n"+
											"        polygon-fill: #000000;\n"+
											"        polygon-opacity: 2;\n"+
											"    }\n"+
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
	                        expect(res.text).to.be.equal(standartPolygonCss);
	                        done();
	                    });
	            });
	        });

		});

        context('when type is line', function () {

        	var style = {
                	line: {
                		enabled: true
                	}
	            };

	        it('should respond with specific css if style has not parameters', function (done) {
	            token(function (err, access_token) {
	                if (err) {
	                    return done(err);
	                }

	                var standartLineCss =  "@line_opacity: 1;\n"+
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
	                        style: style
	                    })
	                    .expect(httpStatus.OK)
	                    .end(function (err, res) {
	                        if (err) {
	                            return done(err);
	                        }

	                        expect(res.text).to.be.equal(standartLineCss);
	                        done();
	                    });
	            });
	        });

	        it('should respond with specific css if style has parameters', function (done) {

	        	style.line = {
            		enabled: true,
					opacity: {
						column: '10',
						range: ['100', '150']
					},
					color: {
						column: 'testColor',
						range: ['100', '150'],
						value: ['#ff0000', '#00ff00', '#0000ff', '#ffffff', '#000000']
					},
					width: {
						column: "testColumn",
						range: ['100', '150']
					},
					targets: [{
						opacity: 2,
						column: 10,
						operator: "!=",
						value: 100,
						color: "#000000",
						with: 100
					}]
		        };

	            token(function (err, access_token) {
	                if (err) {
	                    return done(err);
	                }

	                var standartLineCss =  "@line_opacity: [10] / 50 - 2;\n"+
											"\n"+
											"@line_column: [testColor];\n"+
											"@line_column_max: 150;\n"+
											"@line_column_min: 100;\n"+
											"\n"+
											"@line_column_color_1: #ff0000;\n"+
											"@line_column_color_2: #df1f00;\n"+
											"@line_column_color_3: #bf3f00;\n"+
											"@line_column_color_4: #9f5f00;\n"+
											"@line_column_color_5: #7f7f00;\n"+
											"@line_column_color_6: #5f9f00;\n"+
											"@line_column_color_7: #3fbf00;\n"+
											"@line_column_color_8: #1fdf00;\n"+
											"@line_column_color_9: #00ff00;\n"+
											"@line_column_color_10: #00df1f;\n"+
											"@line_column_color_11: #00bf3f;\n"+
											"@line_column_color_12: #009f5f;\n"+
											"@line_column_color_13: #007f7f;\n"+
											"@line_column_color_14: #005f9f;\n"+
											"@line_column_color_15: #003fbf;\n"+
											"@line_column_color_16: #001fdf;\n"+
											"@line_column_color_17: #0000ff;\n"+
											"@line_column_color_18: #1f1fff;\n"+
											"@line_column_color_19: #3f3fff;\n"+
											"@line_column_color_20: #5f5fff;\n"+
											"@line_column_color_21: #7f7fff;\n"+
											"@line_column_color_22: #9f9fff;\n"+
											"@line_column_color_23: #bfbfff;\n"+
											"@line_column_color_24: #dfdfff;\n"+
											"@line_column_color_25: #ffffff;\n"+
											"@line_column_color_26: #dfdfdf;\n"+
											"@line_column_color_27: #bfbfbf;\n"+
											"@line_column_color_28: #9f9f9f;\n"+
											"@line_column_color_29: #7f7f7f;\n"+
											"@line_column_color_30: #5f5f5f;\n"+
											"@line_column_color_31: #3f3f3f;\n"+
											"@line_column_color_32: #1f1f1f;\n"+
											"@line_column_color_33: #000000;\n"+
											"\n"+
											"@line_column_delta: (@line_column_max - @line_column_min)/33;\n"+
											"@line_column_step_1: (@line_column_min + @line_column_delta * 0);\n"+
											"@line_column_step_2: (@line_column_min + @line_column_delta * 1);\n"+
											"@line_column_step_3: (@line_column_min + @line_column_delta * 2);\n"+
											"@line_column_step_4: (@line_column_min + @line_column_delta * 3);\n"+
											"@line_column_step_5: (@line_column_min + @line_column_delta * 4);\n"+
											"@line_column_step_6: (@line_column_min + @line_column_delta * 5);\n"+
											"@line_column_step_7: (@line_column_min + @line_column_delta * 6);\n"+
											"@line_column_step_8: (@line_column_min + @line_column_delta * 7);\n"+
											"@line_column_step_9: (@line_column_min + @line_column_delta * 8);\n"+
											"@line_column_step_10: (@line_column_min + @line_column_delta * 9);\n"+
											"@line_column_step_11: (@line_column_min + @line_column_delta * 10);\n"+
											"@line_column_step_12: (@line_column_min + @line_column_delta * 11);\n"+
											"@line_column_step_13: (@line_column_min + @line_column_delta * 12);\n"+
											"@line_column_step_14: (@line_column_min + @line_column_delta * 13);\n"+
											"@line_column_step_15: (@line_column_min + @line_column_delta * 14);\n"+
											"@line_column_step_16: (@line_column_min + @line_column_delta * 15);\n"+
											"@line_column_step_17: (@line_column_min + @line_column_delta * 16);\n"+
											"@line_column_step_18: (@line_column_min + @line_column_delta * 17);\n"+
											"@line_column_step_19: (@line_column_min + @line_column_delta * 18);\n"+
											"@line_column_step_20: (@line_column_min + @line_column_delta * 19);\n"+
											"@line_column_step_21: (@line_column_min + @line_column_delta * 20);\n"+
											"@line_column_step_22: (@line_column_min + @line_column_delta * 21);\n"+
											"@line_column_step_23: (@line_column_min + @line_column_delta * 22);\n"+
											"@line_column_step_24: (@line_column_min + @line_column_delta * 23);\n"+
											"@line_column_step_25: (@line_column_min + @line_column_delta * 24);\n"+
											"@line_column_step_26: (@line_column_min + @line_column_delta * 25);\n"+
											"@line_column_step_27: (@line_column_min + @line_column_delta * 26);\n"+
											"@line_column_step_28: (@line_column_min + @line_column_delta * 27);\n"+
											"@line_column_step_29: (@line_column_min + @line_column_delta * 28);\n"+
											"@line_column_step_30: (@line_column_min + @line_column_delta * 29);\n"+
											"@line_column_step_31: (@line_column_min + @line_column_delta * 30);\n"+
											"@line_column_step_32: (@line_column_min + @line_column_delta * 31);\n"+
											"@line_column_step_33: (@line_column_min + @line_column_delta * 32);\n"+
											"\n"+
											"@line_size_min: 100;\n"+
											"@line_size_range: 50;\n"+
											"@line_size_field: [testColumn];\n"+
											"@line_size_field_maxVal: 100;\n"+
											"@line_size_field_minVal: 10;\n"+
											"\n"+
											"//TODO: Fix this!\n"+
											"@line_size_factor: (@line_size_field / (@line_size_field_maxVal - @line_size_field_minVal)) * (@line_size_range + @line_size_min);\n"+
											"\n"+
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
											"	[@line_column < @line_column_step_2] { line-color: @line_column_color_1; }\n"+
											"	[@line_column > @line_column_step_2][@line_column < @line_column_step_3]{ line-color: @line_column_color_2; }\n"+
											"	[@line_column > @line_column_step_3][@line_column < @line_column_step_4]{ line-color: @line_column_color_3; }\n"+
											"	[@line_column > @line_column_step_4][@line_column < @line_column_step_5]{ line-color: @line_column_color_4; }\n"+
											"	[@line_column > @line_column_step_5][@line_column < @line_column_step_6]{ line-color: @line_column_color_5; }\n"+
											"	[@line_column > @line_column_step_6][@line_column < @line_column_step_7]{ line-color: @line_column_color_6; }\n"+
											"	[@line_column > @line_column_step_7][@line_column < @line_column_step_8]{ line-color: @line_column_color_7; }\n"+
											"	[@line_column > @line_column_step_8][@line_column < @line_column_step_9]{ line-color: @line_column_color_8; }\n"+
											"	[@line_column > @line_column_step_9][@line_column < @line_column_step_10]{ line-color: @line_column_color_9; }\n"+
											"	[@line_column > @line_column_step_10][@line_column < @line_column_step_11]{ line-color: @line_column_color_10; }\n"+
											"	[@line_column > @line_column_step_11][@line_column < @line_column_step_12]{ line-color: @line_column_color_11; }\n"+
											"	[@line_column > @line_column_step_12][@line_column < @line_column_step_13]{ line-color: @line_column_color_12; }\n"+
											"	[@line_column > @line_column_step_13][@line_column < @line_column_step_14]{ line-color: @line_column_color_13; }\n"+
											"	[@line_column > @line_column_step_14][@line_column < @line_column_step_15]{ line-color: @line_column_color_14; }\n"+
											"	[@line_column > @line_column_step_15][@line_column < @line_column_step_16]{ line-color: @line_column_color_15; }\n"+
											"	[@line_column > @line_column_step_16][@line_column < @line_column_step_17]{ line-color: @line_column_color_16; }\n"+
											"	[@line_column > @line_column_step_17][@line_column < @line_column_step_18]{ line-color: @line_column_color_17; }\n"+
											"	[@line_column > @line_column_step_18][@line_column < @line_column_step_19]{ line-color: @line_column_color_18; }\n"+
											"	[@line_column > @line_column_step_19][@line_column < @line_column_step_20]{ line-color: @line_column_color_19; }\n"+
											"	[@line_column > @line_column_step_20][@line_column < @line_column_step_21]{ line-color: @line_column_color_20; }\n"+
											"	[@line_column > @line_column_step_21][@line_column < @line_column_step_22]{ line-color: @line_column_color_21; }\n"+
											"	[@line_column > @line_column_step_22][@line_column < @line_column_step_23]{ line-color: @line_column_color_22; }\n"+
											"	[@line_column > @line_column_step_23][@line_column < @line_column_step_24]{ line-color: @line_column_color_23; }\n"+
											"	[@line_column > @line_column_step_24][@line_column < @line_column_step_25]{ line-color: @line_column_color_24; }\n"+
											"	[@line_column > @line_column_step_25][@line_column < @line_column_step_26]{ line-color: @line_column_color_25; }\n"+
											"	[@line_column > @line_column_step_26][@line_column < @line_column_step_27]{ line-color: @line_column_color_26; }\n"+
											"	[@line_column > @line_column_step_27][@line_column < @line_column_step_28]{ line-color: @line_column_color_27; }\n"+
											"	[@line_column > @line_column_step_28][@line_column < @line_column_step_29]{ line-color: @line_column_color_28; }\n"+
											"	[@line_column > @line_column_step_29][@line_column < @line_column_step_30]{ line-color: @line_column_color_29; }\n"+
											"	[@line_column > @line_column_step_30][@line_column < @line_column_step_31]{ line-color: @line_column_color_30; }\n"+
											"	[@line_column > @line_column_step_31][@line_column < @line_column_step_32]{ line-color: @line_column_color_31; }\n"+
											"	[@line_column > @line_column_step_32][@line_column < @line_column_step_33]{ line-color: @line_column_color_32; }\n"+
											"	[@line_column > @line_column_step_33] { line-color: @line_column_color_33; }\n"+
											"\n"+
											"\n"+
											"        line-join: round;\n"+
											"        line-cap: round;\n"+
											"    [10 != 100] {\n"+
											"        line-color: #000000;\n"+
											"        line-opacity: 2;\n"+
											"        line-width: 10;\n"+
											"    }\n"+
											"}";

	                api.post('/api/geo/json2carto')
	                    .send({
	                        access_token: access_token,
	                        style: style,
	                        columns: {
								testColumn: {
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
	                        expect(res.text).to.be.equal(standartLineCss);
	                        done();
	                    });
	            });
	        });

		});
    });
};
