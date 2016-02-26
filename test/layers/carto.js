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
var endpoints = require('../endpoints.js');


module.exports = function () {
    describe(endpoints.layers.carto, function () {


    	// test 1
        it('should respond with status code 401 when not authenticated', function (done) {
            api.post(endpoints.layers.carto)
                .send({})
                .expect(httpStatus.UNAUTHORIZED)
                .end(done);
        });



        // test 2
        it('should respond with status code 400 if style doesn\'t exist in reqest body', function (done) {
            token(function (err, access_token) {
                if (err) return done(err);
                api.post(endpoints.layers.carto)
                    .send({ access_token: access_token })
                    .expect(httpStatus.BAD_REQUEST)
                    .end(function (err, res) {
                        if (err) return done(err);
                        var result = helpers.parse(res.text);
                        expect(result.error.errors.missingRequiredFields).to.be.an.array;
                        expect(result.error.errors.missingRequiredFields).to.include('style');
                        done();
                    });
            });
        });

        context('point', function () {

        	var style = {
            	point: {
            		enabled: true
            	}
            };


            // test 3
	        it('should respond with specific css if style has not parameters', function (done) {
	            token(function (err, access_token) {
	                if (err) return done(err);

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
						"[zoom>=18] { marker-width: 12  * @marker_size_factor; }\n"+
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
						"}";

	                api.post(endpoints.layers.carto)
	                    .send({
	                        access_token: access_token,
	                        style: style
	                    })
	                    .expect(httpStatus.OK)
	                    .end(function (err, res) {
	                        if (err) return done(err);
	                        expect(res.text).to.be.equal(standartPointCss);
	                        done();
	                    });
	            });
	        });


	        // test 4
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
	                if (err) return done(err);

	                var standartPointCss =  "@point_opacity: [10] / 50 - 2;\n"+
						"\n"+
						"@testColor: [testColor];\n"+
						"@testColor_max: 150;\n"+
						"@testColor_min: 100;\n"+
						"\n"+
						"@testColor_color_1: #ff0000;\n"+
						"@testColor_color_2: #bf3f00;\n"+
						"@testColor_color_3: #7f7f00;\n"+
						"@testColor_color_4: #3fbf00;\n"+
						"@testColor_color_5: #00ff00;\n"+
						"@testColor_color_6: #00bf3f;\n"+
						"@testColor_color_7: #007f7f;\n"+
						"@testColor_color_8: #003fbf;\n"+
						"@testColor_color_9: #0000ff;\n"+
						"@testColor_color_10: #3f3fff;\n"+
						"@testColor_color_11: #7f7fff;\n"+
						"@testColor_color_12: #bfbfff;\n"+
						"@testColor_color_13: #ffffff;\n"+
						"@testColor_color_14: #bfbfbf;\n"+
						"@testColor_color_15: #7f7f7f;\n"+
						"@testColor_color_16: #3f3f3f;\n"+
						"@testColor_color_17: #000000;\n"+
						"\n"+
						"@testColor_delta: (@testColor_max - @testColor_min)/17;\n"+
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
						"@testColor_step_14: (@testColor_min + @testColor_delta * 13);\n"+
						"@testColor_step_15: (@testColor_min + @testColor_delta * 14);\n"+
						"@testColor_step_16: (@testColor_min + @testColor_delta * 15);\n"+
						"@testColor_step_17: (@testColor_min + @testColor_delta * 16);\n"+
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
						"[zoom>=18] { marker-width: 12  * @marker_size_factor; }\n"+
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
						"	[@testColor >= @testColor_step_2][@testColor <= @testColor_step_3]{ marker-fill: @testColor_color_2; }\n"+
						"	[@testColor >= @testColor_step_3][@testColor <= @testColor_step_4]{ marker-fill: @testColor_color_3; }\n"+
						"	[@testColor >= @testColor_step_4][@testColor <= @testColor_step_5]{ marker-fill: @testColor_color_4; }\n"+
						"	[@testColor >= @testColor_step_5][@testColor <= @testColor_step_6]{ marker-fill: @testColor_color_5; }\n"+
						"	[@testColor >= @testColor_step_6][@testColor <= @testColor_step_7]{ marker-fill: @testColor_color_6; }\n"+
						"	[@testColor >= @testColor_step_7][@testColor <= @testColor_step_8]{ marker-fill: @testColor_color_7; }\n"+
						"	[@testColor >= @testColor_step_8][@testColor <= @testColor_step_9]{ marker-fill: @testColor_color_8; }\n"+
						"	[@testColor >= @testColor_step_9][@testColor <= @testColor_step_10]{ marker-fill: @testColor_color_9; }\n"+
						"	[@testColor >= @testColor_step_10][@testColor <= @testColor_step_11]{ marker-fill: @testColor_color_10; }\n"+
						"	[@testColor >= @testColor_step_11][@testColor <= @testColor_step_12]{ marker-fill: @testColor_color_11; }\n"+
						"	[@testColor >= @testColor_step_12][@testColor <= @testColor_step_13]{ marker-fill: @testColor_color_12; }\n"+
						"	[@testColor >= @testColor_step_13][@testColor <= @testColor_step_14]{ marker-fill: @testColor_color_13; }\n"+
						"	[@testColor >= @testColor_step_14][@testColor <= @testColor_step_15]{ marker-fill: @testColor_color_14; }\n"+
						"	[@testColor >= @testColor_step_15][@testColor <= @testColor_step_16]{ marker-fill: @testColor_color_15; }\n"+
						"	[@testColor >= @testColor_step_16][@testColor <= @testColor_step_17]{ marker-fill: @testColor_color_16; }\n"+
						"	[@testColor >= @testColor_step_17] { marker-fill: @testColor_color_17; }\n"+
						"\n"+
						"\n"+
						"    [10 != 100] {\n"+
						"        marker-fill: #000000;\n"+
						"        marker-opacity: 2;\n"+
						"        [zoom<10] { marker-width: 0.2 * 150; }\n"+
						"        [zoom=10] { marker-width: 0.3 * 150; }\n"+
						"        [zoom=11] { marker-width: 0.5 * 150; }\n"+
						"        [zoom=12] { marker-width: 1   * 150; }\n"+
						"        [zoom=13] { marker-width: 1   * 150; }\n"+
						"        [zoom=14] { marker-width: 2   * 150; }\n"+
						"        [zoom=15] { marker-width: 4   * 150; }\n"+
						"        [zoom=16] { marker-width: 6   * 150; }\n"+
						"        [zoom=17] { marker-width: 8   * 150; }\n"+
						"        [zoom>=18] { marker-width: 12  * 150; }\n"+						
						// "        marker-width: 150;\n"+
						"    }\n"+
						"}";

	                api.post(endpoints.layers.carto)
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
	                        if (err) return done(err);
	                        expect(res.text).to.be.equal(standartPointCss);
	                        done();
	                    });
	            });
	        });

		});

        context('polygon', function () {

        	var style = {
	            	polygon: {
	            		enabled: true
	            	}
	            };



	        // test 5
	        it('should respond with specific css if style has not parameters', function (done) {
	            token(function (err, access_token) {
	                if (err) return done(err);

	                var standartPolygonCss = "@polygon_opacity: 1;\n"+
						"#layer {\n"+
						"\n"+
						"	polygon-opacity: @polygon_opacity;\n"+
						"\n"+
						"	polygon-fill: red;\n"+
						"\n"+
						"}";

	                api.post(endpoints.layers.carto)
	                    .send({
	                        access_token: access_token,
	                        style: style
	                    })
	                    .expect(httpStatus.OK)
	                    .end(function (err, res) {
	                        if (err) return done(err);
	                        expect(res.text).to.be.equal(standartPolygonCss);
	                        done();
	                    });
	            });
	        });




	        // test 6
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
	                if (err) return done(err);

	                var standartPolygonCss =  "@polygon_opacity: [10] / 50 - 2;\n"+
						"\n"+
						"@polygon_column: [testColor];\n"+
						"@polygon_column_max: 150;\n"+
						"@polygon_column_min: 100;\n"+
						"\n"+
						"@polygon_column_color_1: #ff0000;\n"+
						"@polygon_column_color_2: #bf3f00;\n"+
						"@polygon_column_color_3: #7f7f00;\n"+
						"@polygon_column_color_4: #3fbf00;\n"+
						"@polygon_column_color_5: #00ff00;\n"+
						"@polygon_column_color_6: #00bf3f;\n"+
						"@polygon_column_color_7: #007f7f;\n"+
						"@polygon_column_color_8: #003fbf;\n"+
						"@polygon_column_color_9: #0000ff;\n"+
						"@polygon_column_color_10: #3f3fff;\n"+
						"@polygon_column_color_11: #7f7fff;\n"+
						"@polygon_column_color_12: #bfbfff;\n"+
						"@polygon_column_color_13: #ffffff;\n"+
						"@polygon_column_color_14: #bfbfbf;\n"+
						"@polygon_column_color_15: #7f7f7f;\n"+
						"@polygon_column_color_16: #3f3f3f;\n"+
						"@polygon_column_color_17: #000000;\n"+
						"\n"+
						"@polygon_column_delta: (@polygon_column_max - @polygon_column_min)/17;\n"+
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
						"	[@polygon_column > @polygon_column_step_17] { polygon-fill: @polygon_column_color_17; }\n"+
						"\n"+
						"\n"+
						"    [10 != 100] {\n"+
						"        polygon-fill: #000000;\n"+
						"        polygon-opacity: 2;\n"+
						"    }\n"+
						"}";

	                api.post(endpoints.layers.carto)
	                    .send({
	                        access_token: access_token,
	                        style: style
	                    })
	                    .expect(httpStatus.OK)
	                    .end(function (err, res) {
	                        if (err) return done(err);
	                        expect(res.text).to.be.equal(standartPolygonCss);
	                        done();
	                    });
	            });
	        });

		});

        context('line', function () {

        	var style = {
                	line: {
                		enabled: true
                	}
	            };




	        // test 7
	        it('should respond with specific css if style has not parameters', function (done) {
	            token(function (err, access_token) {
	                if (err) return done(err);

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
						"[zoom>=18] { line-width: 12  * @line_size_factor; }\n"+
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

	                api.post(endpoints.layers.carto)
	                    .send({
	                        access_token: access_token,
	                        style: style
	                    })
	                    .expect(httpStatus.OK)
	                    .end(function (err, res) {
	                        if (err) return done(err);
	                        expect(res.text).to.be.equal(standartLineCss);
	                        done();
	                    });
	            });
	        });



	        // test 8
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
	                if (err) return done(err);

	                var standartLineCss =  "@line_opacity: [10] / 50 - 2;\n"+
						"\n"+
						"@line_column: [testColor];\n"+
						"@line_column_max: 150;\n"+
						"@line_column_min: 100;\n"+
						"\n"+
						"@line_column_color_1: #ff0000;\n"+
						"@line_column_color_2: #bf3f00;\n"+
						"@line_column_color_3: #7f7f00;\n"+
						"@line_column_color_4: #3fbf00;\n"+
						"@line_column_color_5: #00ff00;\n"+
						"@line_column_color_6: #00bf3f;\n"+
						"@line_column_color_7: #007f7f;\n"+
						"@line_column_color_8: #003fbf;\n"+
						"@line_column_color_9: #0000ff;\n"+
						"@line_column_color_10: #3f3fff;\n"+
						"@line_column_color_11: #7f7fff;\n"+
						"@line_column_color_12: #bfbfff;\n"+
						"@line_column_color_13: #ffffff;\n"+
						"@line_column_color_14: #bfbfbf;\n"+
						"@line_column_color_15: #7f7f7f;\n"+
						"@line_column_color_16: #3f3f3f;\n"+
						"@line_column_color_17: #000000;\n"+						
						"\n"+
						"@line_column_delta: (@line_column_max - @line_column_min)/17;\n"+
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
						// "@line_column_step_18: (@line_column_min + @line_column_delta * 17);\n"+
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
						"[zoom>=18] { line-width: 12  * @line_size_factor; }\n"+
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
						"	[@line_column > @line_column_step_17] { line-color: @line_column_color_17; }\n"+
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

	                api.post(endpoints.layers.carto)
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
	                        if (err) return done(err);
	                        expect(res.text).to.be.equal(standartLineCss);
	                        done();
	                    });
	            });
	        });

		});
    });
};
