// API: api.geo.js

// database schemas
var Project 	= require('../models/project');
var Clientel 	= require('../models/client');	// weird name cause 'Client' is restricted name
var User  	= require('../models/user');
var File 	= require('../models/file');
var Layer 	= require('../models/layer');
var Hash 	= require('../models/hash');
var Role 	= require('../models/role');
var Group 	= require('../models/group');

// utils
var _ 		= require('lodash');
var fs 		= require('fs-extra');
var gm 		= require('gm');
var kue 	= require('kue');
var fss 	= require("q-io/fs");
var srs 	= require('srs');
var gdal 	= require('gdal');
var zlib 	= require('zlib');
var uuid 	= require('node-uuid');
var util 	= require('util');
var utf8 	= require("utf8");
var mime 	= require("mime");
var exec 	= require('child_process').exec;
var dive 	= require('dive');
var async 	= require('async');
var carto 	= require('carto');
var crypto      = require('crypto');
var fspath 	= require('path');
var mapnik 	= require('mapnik');
var request 	= require('request');
var ogr2ogr 	= require('ogr2ogr');
var nodepath    = require('path');
var formidable  = require('formidable');
var nodemailer  = require('nodemailer');
var uploadProgress = require('node-upload-progress');
var mapnikOmnivore = require('mapnik-omnivore');
var pg = require('pg');
var errors = require('../shared/errors');
var httpStatus = require('http-status');

// api
var api = module.parent.exports;

// exports
module.exports = api.geo = { 

	json2carto : function (req, res, next) {
		var options = req.body;

		// convert json to cartocss
		api.geo._json2carto(options, function (err, css) {
			if (err) return next(err);
			res.send(css);
		});
	},

	_json2carto : function (options, callback) {
		if (!options.style) {
			return callback(api.error.code.missingRequiredRequestFields(errors.missing_style.errorMessage, ['style']));	
		};
		
		// find vector types
		var isPoint 	= (options.style.point && options.style.point.enabled);
		var isPolygon 	= (options.style.polygon && options.style.polygon.enabled);
		var isLine 	= (options.style.line && options.style.line.enabled);

		// style
		var style = {
			headers : '',
			layer : ''
		}

		// start #layer
		style.layer = '#layer {\n\n';
		
		// extra styling (eg. reference point)
		if (options.style.extras) style.layer += api.geo.buildExtras(options);

		// point styling
		if (isPoint) style = api.geo._createPointCarto(options, style);

		// polygon styling
		if (isLine) style = api.geo._createLineCarto(options, style);

		// polygon styling
		if (isPolygon) style = api.geo._createPolygonCarto(options, style);
			
		// close #layer
		style.layer += '}';
		
		// debug
		// console.log('created style: ', style);

		// concat
		var finalCarto = style.headers + style.layer;

		// return cartocss
		callback(null, finalCarto);

	},

	_createPointCarto : function (options, style) {
		var allowOverlap = 'true';
		var markerClip = 'false';
		var compOp = options.style.point.blend ? options.style.point.blend.mode || 'screen' : 'screen';

		// global style
		style.layer += '\tmarker-allow-overlap: ' + allowOverlap + ';\n';
		style.layer += '\tmarker-clip: ' + markerClip + ';\n';
		style.layer += '\tmarker-comp-op: ' + compOp + ';\n\n';

		// OPACITY
		var pointOpacityCarto = api.geo.buildCarto_pointOpacity(options);
		style.headers += pointOpacityCarto.headers;
		style.layer += pointOpacityCarto.style;

		// COLOR
		var pointColorCarto = api.geo.buildCarto_pointColor(options);
		style.headers += pointColorCarto.headers;
		style.layer += pointColorCarto.style;

		// SIZE
		var pointSizeCarto = api.geo.buildCarto_pointSize(options);
		style.headers += pointSizeCarto.headers;
		style.layer += pointSizeCarto.style;	

		// targets
		var targetCarto = api.geo.buildCarto_pointTarget(options);
		style.headers += targetCarto.headers;
		style.layer += targetCarto.style;

		return style;

	},

	_createPolygonCarto : function (options, style) {

		// check if comp-op active
		var compOp = false;
		if (options.style.polygon.blend && options.style.polygon.blend.mode) {
			compOp = options.style.polygon.blend.mode;
		}

		// global styling
		if (compOp) style.layer += '\tpolygon-comp-op: ' + compOp + ';\n\n';


		// opacity
		var polygonOpacityCarto = api.geo.buildCarto_polygonOpacity(options);
		style.headers += polygonOpacityCarto.headers;
		style.layer += polygonOpacityCarto.style;

		// color
		var polygonColorCarto = api.geo.buildCarto_polygonColor(options);
		style.headers += polygonColorCarto.headers;
		style.layer += polygonColorCarto.style;

		// targets
		var targetCarto = api.geo.buildCarto_polygonTarget(options);
		style.headers += targetCarto.headers;
		style.layer += targetCarto.style;

		return style;

	},

	_createLineCarto : function (options, style) {

		// opacity
		var lineOpacityCarto = api.geo.buildCarto_lineOpacity(options);
		style.headers += lineOpacityCarto.headers;
		style.layer += lineOpacityCarto.style;

		// color
		var lineColorCarto = api.geo.buildCarto_lineColor(options);
		style.headers += lineColorCarto.headers;
		style.layer += lineColorCarto.style;

		// width
		var lineWidthCarto = api.geo.buildCarto_lineWidth(options);
		style.headers += lineWidthCarto.headers;
		style.layer += lineWidthCarto.style;

		// targets
		var targetCarto = api.geo.buildCarto_lineTarget(options);
		style.headers += targetCarto.headers;
		style.layer += targetCarto.style;


		return style;
	},

	buildExtras : function (options) {

		var style = options.style;
		var extras = style.extras;

		// extra: reference point
		if (extras.referencepoint && extras.referencepoint.column && extras.referencepoint.value) {
			
			// create reference point
			return api.geo.buildReferencePoint(extras.referencepoint);
		}

		return '';
	},


	buildReferencePoint : function(referencepoint) {
		var cartoStr = '\n';
		cartoStr += '\t[' + referencepoint.column + '=' + referencepoint.value + '] {\n';
		cartoStr += '\t\tmarker-comp-op: src-over;\n';
		cartoStr += '\t\tmarker-opacity: 1;\n';
		cartoStr += "\t\tmarker-file: url('public/star-marker.png');\n";
		cartoStr += '\t\tmarker-width: 30;\n';
		cartoStr += '\t}\n\n';
		return cartoStr;
	},



	// OPACITY
	// OPACITY
	// OPACITY


	buildCarto_polygonTarget : function (options) {

		var css = {
			headers : '',
			style : ''
		};

		var targets = options.style.polygon.targets;
		if (!targets || !targets.length) return css;

		// create target
		targets.forEach(function (t) {

			var column = t.column;
			var value = parseFloat(t.value) || '"' + t.value + '"'; // todo; int/float/string type must match postgis 
			var color = t.color;
			var opacity = parseFloat(t.opacity);
			var operator = t.operator || '=';

			if (column) {
				var string = '\n    [' + column + ' ' + operator + ' ' + value + '] {';
				string += '\n        polygon-fill: ' + color + ';';
				string += '\n        polygon-opacity: ' + opacity + ';';
				string += '\n    }\n';
				css.style += string;
			}

		});

		return css;
	},

	buildCarto_pointTarget : function (options) {

		var css = {
			headers : '',
			style : ''
		};

		var targets = options.style.point.targets;
		if (!targets || !targets.length) return css;

		// create target
		targets.forEach(function (t) {

			// default value
			if (t.opacity == undefined) t.opacity = 1;

			var column = t.column;
			var value = parseFloat(t.value) || '"' + t.value + '"'; // todo; int/float/string type must match postgis 
			var color = t.color;
			var opacity = parseFloat(t.opacity);
			var width = parseFloat(t.width) || 10;
			var operator = t.operator || '=';

			if (column) {
				var string = '\n    [' + column + ' ' + operator + ' ' + value + '] {';
				string += '\n        marker-fill: ' + color + ';';
				string += '\n        marker-opacity: ' + opacity + ';';
				// string += '\n        marker-width: ' + width + ';';

				string += '\n        [zoom<10] { marker-width: 0.2 * ' + width + '; }';
				string += '\n        [zoom=10] { marker-width: 0.3 * ' + width + '; }';
				string += '\n        [zoom=11] { marker-width: 0.5 * ' + width + '; }';
				string += '\n        [zoom=12] { marker-width: 1   * ' + width + '; }';
				string += '\n        [zoom=13] { marker-width: 1   * ' + width + '; }';
				string += '\n        [zoom=14] { marker-width: 2   * ' + width + '; }';
				string += '\n        [zoom=15] { marker-width: 4   * ' + width + '; }';
				string += '\n        [zoom=16] { marker-width: 6   * ' + width + '; }';
				string += '\n        [zoom=17] { marker-width: 8   * ' + width + '; }';
				string += '\n        [zoom>=18] { marker-width: 12  * ' + width + '; }';


				string += '\n    }\n';

				css.style += string;
			}

		});


		return css;

	},

	buildCarto_lineTarget : function (options) {

		var css = {
			headers : '',
			style : ''
		};

		var targets = options.style.line.targets;

		if (!targets || !targets.length) return css;

		// create target
		targets.forEach(function (t) {

			// default value
			if (t.opacity == undefined) t.opacity = 1;

			var column = t.column;
			var value = parseFloat(t.value) || '"' + t.value + '"'; // todo; int/float/string type must match postgis 
			var color = t.color;
			var opacity = parseFloat(t.opacity);
			var width = parseFloat(t.width) || 10;
			var operator = t.operator || '=';


			if (column) {
				var string = '\n    [' + column + ' ' + operator + ' ' + value + '] {';
				string += '\n        line-color: ' + color + ';';
				string += '\n        line-opacity: ' + opacity + ';';
				string += '\n        line-width: ' + width + ';';
				
				string += '\n    }\n';

				css.style += string;
			}

		});


		return css;

	},


	buildCarto_pointOpacity : function (options) {

		var style = options.style.point;
		var opacity = style.opacity || {};

		var css = {
			headers : '',
			style   : ''
		};

		// create @variables
		if (opacity.column) {

			// calc ranges
			var range = opacity.range;
			var field_floor = parseFloat(range[1]) - parseFloat(range[0]);
			var field_calc = parseFloat(range[0]) / field_floor;
			// normalized = (x-min(x))/(max(x)-min(x))
			css.headers += '@point_opacity: [' + opacity.column + '] / ' + field_floor + ' - ' + field_calc + ';\n\n';
		
		} else {

			// static opacity
			var staticOpacity = (opacity.staticVal == undefined) ? 1 : opacity.staticVal;
			css.headers += '@point_opacity: ' + staticOpacity + ';\n';
		}

		// add rule
		css.style += '\tmarker-opacity: @point_opacity;\n\n';

		return css;
	},

	buildCarto_polygonOpacity : function (options) {

		var style = options.style.polygon;
		var opacity = style.opacity || {};


		var css = {
			headers : '',
			style   : ''
		};


		if ( opacity.column ) {

			// calc vars
			var range = opacity.range;			
			var field_floor = parseFloat(range[1]) - parseFloat(range[0]);
			var field_calc = parseFloat(range[0]) / field_floor;
			
			// normalized = (x-min(x))/(max(x)-min(x))
			css.headers += '@polygon_opacity: [' + opacity.column + '] / ' + field_floor + ' - ' + field_calc + ';\n\n';
		
		} else {

			// static opacity
			var staticOpacity = (opacity.staticVal == undefined) ? 1 : opacity.staticVal;
			css.headers += '@polygon_opacity: ' + staticOpacity + ';\n';
		}

		// add rule
		css.style += '\tpolygon-opacity: @polygon_opacity;\n\n';

		return css;
	},

	buildCarto_lineOpacity : function (options) {

		var style = options.style.line;
		var opacity = style.opacity || {};


		var css = {
			headers : '',
			style   : ''
		};


		// calc vars
		if ( opacity.column ) {

			var range = opacity.range;			
			var field_floor = parseFloat(range[1]) - parseFloat(range[0]);
			var field_calc = parseFloat(range[0]) / field_floor;
			
			// normalized = (x-min(x))/(max(x)-min(x))
			css.headers += '@line_opacity: [' + opacity.column + '] / ' + field_floor + ' - ' + field_calc + ';\n\n';
		
		} else {

			// static opacity
			var staticOpacity = (opacity.staticVal == undefined) ? 1 : opacity.staticVal;
			css.headers += '@line_opacity: ' + staticOpacity + ';\n';
		}

		// add rule
		css.style += '\tline-opacity: @line_opacity;\n\n';

		return css;
	},



	// COLOR RANGE
	// COLOR RANGE
	// COLOR RANGE

	buildCarto_pointColor : function (options) {


		var style = options.style.point;
		var color = style.color || {};

		var cartObj = {
			headers : '',
			style   : ''
		};



		if ( color.column ) {

			var minMax = color.range;// ? color.customMinMax : color.minMax;


			// colorLerp :: Does NOT work properly... sometimes it generates random colors...
			// see 


			// // color range experiment
			// var color_range = [];
			// var colorLerp = require('color-lerp');

			// // Get color values
			// var color1 = color.value[0];
			// var color2 = color.value[1];
			// var color3 = color.value[2];
			// var color4 = color.value[3];
			// var color5 = color.value[4];
			

			// // get three, four colors in between each 5-color => 12
			// var triad12 = colorLerp(color1, color2, 4, 'rgb');
			// var triad23 = colorLerp(color2, color3, 4, 'rgb');
			// var triad34 = colorLerp(color3, color4, 4, 'rgb');
			// var triad45 = colorLerp(color4, color5, 4, 'rgb');

			// // flatten
			// color_range = _.flatten(color_range);

			// // remove duplicates
			// color_range = _.unique(color_range);


			// // override with new color_range
			// var colorArray = color_range;


			// // Get color values
			// var c1 = color.value[0];
			// var c9 = color.value[1];
			// var c17 = color.value[2];
			// var c25 = color.value[3];
			// var c33 = color.value[4];

			// // Interpolate
			// var c5 = api.geo.hexAverage([c1, c9]);
			// var c13 = api.geo.hexAverage([c9, c17]);
			// var c21 = api.geo.hexAverage([c17, c25]);
			// var c29 = api.geo.hexAverage([c25, c33]);

			// // Interpolate
			// var c3 = api.geo.hexAverage([c1, c5]);
			// var c7 = api.geo.hexAverage([c5, c9]);
			// var c11 = api.geo.hexAverage([c9, c13]);
			// var c15 = api.geo.hexAverage([c13, c17]);
			// var c19 = api.geo.hexAverage([c17, c21]);
			// var c23 = api.geo.hexAverage([c21, c25]);
			// var c27 = api.geo.hexAverage([c25, c29]);
			// var c31 = api.geo.hexAverage([c29, c33]);

			// // 17 colors
			// var colorArray = [c1, c3, c5, c7, c9, c11, c13, c15, c17, c19, c21, c23, c25, c27, c29, c31, c33];



			var colorArray = this.createColorArray(color.value)





			// CREATE VARS
			var fieldName = '@' + color.column;
			var maxField  = fieldName + '_max';
			var minField  = fieldName + '_min';
			var deltaName = fieldName + '_delta';
			

			// DEFINE FIELD NAME + MIN/MAX
			cartObj.headers += fieldName + ': [' + color.column + '];\n';
			cartObj.headers += maxField  + ': '  + minMax[1] + ';\n'; 
			cartObj.headers += minField  + ': '  + minMax[0] + ';\n\n';
			

			// COLORS VALUES
			colorArray.forEach(function(c, i) {	
				cartObj.headers += fieldName + '_color_' + (i+1) + ': ' + c + ';\n';
			});

			cartObj.headers += '\n';
			
			// COLOR STEPS (DELTA)
			cartObj.headers += fieldName + '_delta: (' + maxField + ' - ' + minField + ')/' + colorArray.length + ';\n'
			
			colorArray.forEach(function(c, i) {	
				cartObj.headers += fieldName + '_step_' + (i+1) + ': (' + minField + ' + ' + fieldName + '_delta * ' + i + ');\n';
			});


			cartObj.headers += '\n';



			// STYLE STYLE STYLE
			// STYLE STYLE STYLE
			// STYLE STYLE STYLE


			colorArray.forEach(function(c,i) {

				var no = i+1;

				if ( no == 1 ) {

					cartObj.style += '\t[' + fieldName + ' < ' + fieldName + '_step_' + (no+1) + '] ';
					cartObj.style += '{ marker-fill: ' + fieldName + '_color_' + no + '; }\n';

				}

				if ( no > 1 && no < colorArray.length ) {

					cartObj.style += '\t[' + fieldName + ' >= ' + fieldName + '_step_' + no + ']';
					cartObj.style += '[' + fieldName + ' <= ' + fieldName + '_step_' + (no+1) + ']';
					cartObj.style += '{ marker-fill: ' + fieldName + '_color_' + no + '; }\n';

				}

				if ( no == colorArray.length ) {

					cartObj.style +=  '\t[' + fieldName + ' >= ' + fieldName + '_step_' + no + '] ';
					cartObj.style += '{ marker-fill: ' + fieldName + '_color_' + no + '; }\n\n';
				}
			})
			
		
		} else {
		
			// static color
			var staticColor = (color.staticVal == undefined) ? 'red' : color.staticVal;
			cartObj.style += '\tmarker-fill: ' + staticColor + ';\n\n';
		}

		return cartObj;
	},


	createColorArray : function (fiveColors) {

		// Get color values
		var c1 = fiveColors[0];
		var c9 = fiveColors[1];
		var c17 = fiveColors[2];
		var c25 = fiveColors[3];
		var c33 = fiveColors[4];

		// Interpolate
		var c5 = api.geo.hexAverage([c1, c9]);
		var c13 = api.geo.hexAverage([c9, c17]);
		var c21 = api.geo.hexAverage([c17, c25]);
		var c29 = api.geo.hexAverage([c25, c33]);

		// Interpolate
		var c3 = api.geo.hexAverage([c1, c5]);
		var c7 = api.geo.hexAverage([c5, c9]);
		var c11 = api.geo.hexAverage([c9, c13]);
		var c15 = api.geo.hexAverage([c13, c17]);
		var c19 = api.geo.hexAverage([c17, c21]);
		var c23 = api.geo.hexAverage([c21, c25]);
		var c27 = api.geo.hexAverage([c25, c29]);
		var c31 = api.geo.hexAverage([c29, c33]);

		// 17 colors
		var colorArray = [c1, c3, c5, c7, c9, c11, c13, c15, c17, c19, c21, c23, c25, c27, c29, c31, c33];		

		return colorArray;
	},

	buildCarto_polygonColor : function (options) {

		var style = options.style.polygon;
		var color = style.color || {};

		var cartObj = {
			headers : '',
			style   : ''
		};

		if ( color.column ) {

			var minMax = color.range;// ? color.customMinMax : color.minMax;

			// // Get color values
			// var c1 = color.value[0];
			// var c9 = color.value[1];
			// var c17 = color.value[2];
			// var c25 = color.value[3];
			// var c33 = color.value[4];

			// // Interpolate
			// var c5 = api.geo.hexAverage([c1, c9]);
			// var c13 = api.geo.hexAverage([c9, c17]);
			// var c21 = api.geo.hexAverage([c17, c25]);
			// var c29 = api.geo.hexAverage([c25, c33]);

			// // Interpolate
			// var c3 = api.geo.hexAverage([c1, c5]);
			// var c7 = api.geo.hexAverage([c5, c9]);
			// var c11 = api.geo.hexAverage([c9, c13]);
			// var c15 = api.geo.hexAverage([c13, c17]);
			// var c19 = api.geo.hexAverage([c17, c21]);
			// var c23 = api.geo.hexAverage([c21, c25]);
			// var c27 = api.geo.hexAverage([c25, c29]);
			// var c31 = api.geo.hexAverage([c29, c33]);

			// var colorArray = [c1, c3, c5, c7, c9, c11, c13, c15, c17, c19, c21, c23, c25, c27, c29, c31, c33];




			var colorArray = this.createColorArray(color.value);




			// // Interpolate
			// var c2 = api.geo.hexAverage([c1, c3]);
			// var c4 = api.geo.hexAverage([c3, c5]);
			// var c6 = api.geo.hexAverage([c5, c7]);
			// var c8 = api.geo.hexAverage([c7, c9]);
			// var c10 = api.geo.hexAverage([c9, c11]);
			// var c12 = api.geo.hexAverage([c11, c13]);
			// var c14 = api.geo.hexAverage([c13, c15]);
			// var c16 = api.geo.hexAverage([c15, c17]);
			// var c18 = api.geo.hexAverage([c17, c19]);
			// var c20 = api.geo.hexAverage([c19, c21]);
			// var c22 = api.geo.hexAverage([c21, c23]);
			// var c24 = api.geo.hexAverage([c23, c25]);
			// var c26 = api.geo.hexAverage([c25, c27]);
			// var c28 = api.geo.hexAverage([c27, c29]);
			// var c30 = api.geo.hexAverage([c29, c31]);
			// var c32 = api.geo.hexAverage([c31, c33]);

			// var colorArray = [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11, c12, c13, c14, c15, c16, c17, c18, c19, c20, c21, c22, c23, c24, c25, c26, c27, c28, c29, c30, c31, c32, c33];



			// CREATE VARS
			// var fieldName = '@' + color.column;
			var fieldName = '@polygon_column';// + color.column;
			var maxField  = fieldName + '_max';
			var minField  = fieldName + '_min';
			var deltaName = fieldName + '_delta';
			

			// DEFINE FIELD NAME + MIN/MAX
			cartObj.headers += fieldName + ': [' + color.column + '];\n';
			cartObj.headers += maxField  + ': '  + minMax[1] + ';\n'; 
			cartObj.headers += minField  + ': '  + minMax[0] + ';\n\n';
			

			// COLORS VALUES
			colorArray.forEach(function(c, i) {	
				cartObj.headers += fieldName + '_color_' + (i+1) + ': ' + c + ';\n';
			});

			cartObj.headers += '\n';
			
			// COLOR STEPS (DELTA)
			cartObj.headers += fieldName + '_delta: (' + maxField + ' - ' + minField + ')/' + colorArray.length + ';\n'
			
			colorArray.forEach(function(c, i) {	
				cartObj.headers += fieldName + '_step_' + (i+1) + ': (' + minField + ' + ' + fieldName + '_delta * ' + i + ');\n';
			});


			cartObj.headers += '\n';



			// STYLE STYLE STYLE
			// STYLE STYLE STYLE
			// STYLE STYLE STYLE


			colorArray.forEach(function(c,i) {

				var no = i+1;

				if ( no == 1 ) {

					cartObj.style += '\t[' + fieldName + ' < ' + fieldName + '_step_' + (no+1) + '] ';
					cartObj.style += '{ polygon-fill: ' + fieldName + '_color_' + no + '; }\n';

				}

				if ( no > 1 && no < colorArray.length ) {

					cartObj.style += '\t[' + fieldName + ' > ' + fieldName + '_step_' + no + ']';
					cartObj.style += '[' + fieldName + ' < ' + fieldName + '_step_' + (no+1) + ']';
					cartObj.style += '{ polygon-fill: ' + fieldName + '_color_' + no + '; }\n';

				}

				if ( no == colorArray.length ) {

					cartObj.style +=  '\t[' + fieldName + ' > ' + fieldName + '_step_' + no + '] ';
					cartObj.style += '{ polygon-fill: ' + fieldName + '_color_' + no + '; }\n\n';
				}
			})
			
		
		} else {
		
			// static color
			var staticColor = (color.staticVal === undefined) ? 'red' : color.staticVal;
			cartObj.style += '\tpolygon-fill: ' + staticColor + ';\n\n';
		}

		return cartObj;
	},


	buildCarto_lineColor : function (options) {

		var style = options.style.line;
		var color = style.color || {};

		var cartObj = {
			headers : '',
			style   : ''
		};

		if ( color.column ) {

			var minMax = color.range;// ? color.customMinMax : color.minMax;

			// // Get color values
			// var c1 = color.value[0];
			// var c9 = color.value[1];
			// var c17 = color.value[2];
			// var c25 = color.value[3];
			// var c33 = color.value[4];

			// // Interpolate
			// var c5 = api.geo.hexAverage([c1, c9]);
			// var c13 = api.geo.hexAverage([c9, c17]);
			// var c21 = api.geo.hexAverage([c17, c25]);
			// var c29 = api.geo.hexAverage([c25, c33]);

			// // Interpolate
			// var c3 = api.geo.hexAverage([c1, c5]);
			// var c7 = api.geo.hexAverage([c5, c9]);
			// var c11 = api.geo.hexAverage([c9, c13]);
			// var c15 = api.geo.hexAverage([c13, c17]);
			// var c19 = api.geo.hexAverage([c17, c21]);
			// var c23 = api.geo.hexAverage([c21, c25]);
			// var c27 = api.geo.hexAverage([c25, c29]);
			// var c31 = api.geo.hexAverage([c29, c33]);

			// var colorArray = [c1, c3, c5, c7, c9, c11, c13, c15, c17, c19, c21, c23, c25, c27, c29, c31, c33];



			var colorArray = this.createColorArray(color.value);





			// // Interpolate
			// var c2 = api.geo.hexAverage([c1, c3]);
			// var c4 = api.geo.hexAverage([c3, c5]);
			// var c6 = api.geo.hexAverage([c5, c7]);
			// var c8 = api.geo.hexAverage([c7, c9]);
			// var c10 = api.geo.hexAverage([c9, c11]);
			// var c12 = api.geo.hexAverage([c11, c13]);
			// var c14 = api.geo.hexAverage([c13, c15]);
			// var c16 = api.geo.hexAverage([c15, c17]);
			// var c18 = api.geo.hexAverage([c17, c19]);
			// var c20 = api.geo.hexAverage([c19, c21]);
			// var c22 = api.geo.hexAverage([c21, c23]);
			// var c24 = api.geo.hexAverage([c23, c25]);
			// var c26 = api.geo.hexAverage([c25, c27]);
			// var c28 = api.geo.hexAverage([c27, c29]);
			// var c30 = api.geo.hexAverage([c29, c31]);
			// var c32 = api.geo.hexAverage([c31, c33]);

			// var colorArray = [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11, c12, c13, c14, c15, c16, c17, c18, c19, c20, c21, c22, c23, c24, c25, c26, c27, c28, c29, c30, c31, c32, c33];



			// CREATE VARS
			// var fieldName = '@' + color.column;
			var fieldName = '@line_column';// + color.column;
			var maxField  = fieldName + '_max';
			var minField  = fieldName + '_min';
			var deltaName = fieldName + '_delta';
			

			// DEFINE FIELD NAME + MIN/MAX
			cartObj.headers += fieldName + ': [' + color.column + '];\n';
			cartObj.headers += maxField  + ': '  + minMax[1] + ';\n'; 
			cartObj.headers += minField  + ': '  + minMax[0] + ';\n\n';
			

			// COLORS VALUES
			colorArray.forEach(function(c, i) {	
				cartObj.headers += fieldName + '_color_' + (i+1) + ': ' + c + ';\n';
			})

			cartObj.headers += '\n';
			
			// COLOR STEPS (DELTA)
			cartObj.headers += fieldName + '_delta: (' + maxField + ' - ' + minField + ')/' + colorArray.length + ';\n'
			
			colorArray.forEach(function(c, i) {	
				cartObj.headers += fieldName + '_step_' + (i+1) + ': (' + minField + ' + ' + fieldName + '_delta * ' + i + ');\n';
			});


			cartObj.headers += '\n';



			// STYLE STYLE STYLE
			// STYLE STYLE STYLE
			// STYLE STYLE STYLE


			colorArray.forEach(function(c,i) {

				var no = i+1;

				if ( no == 1 ) {

					cartObj.style += '\t[' + fieldName + ' < ' + fieldName + '_step_' + (no+1) + '] ';
					cartObj.style += '{ line-color: ' + fieldName + '_color_' + no + '; }\n';

				}

				if ( no > 1 && no < colorArray.length ) {

					cartObj.style += '\t[' + fieldName + ' > ' + fieldName + '_step_' + no + ']';
					cartObj.style += '[' + fieldName + ' < ' + fieldName + '_step_' + (no+1) + ']';
					cartObj.style += '{ line-color: ' + fieldName + '_color_' + no + '; }\n';

				}

				if ( no == colorArray.length ) {

					cartObj.style +=  '\t[' + fieldName + ' > ' + fieldName + '_step_' + no + '] ';
					cartObj.style += '{ line-color: ' + fieldName + '_color_' + no + '; }\n\n';
				}
			})
			
		
		} else {
		
			// static color
			var staticColor = (color.staticVal === undefined) ? 'red' : color.staticVal;
			cartObj.style += '\tline-color: ' + staticColor + ';\n\n';
		}

		return cartObj;
	},

	
	// POINT SIZE
	// POINT SIZE
	// POINT SIZE

	buildCarto_pointSize : function (options) {

		var style = options.style.point;
		var pointSize = style.pointsize || {};

		var cartObj = {
			headers : '',
			style   : ''
		};

		if ( pointSize.column ) {

			var max = Math.floor(options.columns[pointSize.column].max * 10) / 10;
			var min = Math.floor(options.columns[pointSize.column].min * 10) / 10;
		
			// cartObj.headers += '@marker_size_max: ' + pointSize.minMax[1] + ';\n';
			cartObj.headers += '@marker_size_min: ' + pointSize.range[0] + ';\n';
			cartObj.headers += '@marker_size_range: ' + (pointSize.range[1] - pointSize.range[0]) + ';\n';
			cartObj.headers += '@marker_size_field: [' + pointSize.column + '];\n';
			cartObj.headers += '@marker_size_field_maxVal: ' + max + ';\n';
			cartObj.headers += '@marker_size_field_minVal: ' + min + ';\n';
			cartObj.headers += '\n//TODO: Fix this!\n';
			cartObj.headers += '@marker_size_factor: (@marker_size_field / (@marker_size_field_maxVal - @marker_size_field_minVal)) * (@marker_size_range + @marker_size_min);\n\n';
			
		} else {

			var staticSize = (pointSize.staticVal === undefined) ? 5 : pointSize.staticVal;
			cartObj.headers += '@marker_size_factor: ' + staticSize + ';\n';

		}


		cartObj.headers += '[zoom<10] { marker-width: 0.2 * @marker_size_factor; }\n';
		cartObj.headers += '[zoom=10] { marker-width: 0.3 * @marker_size_factor; }\n';
		cartObj.headers += '[zoom=11] { marker-width: 0.5 * @marker_size_factor; }\n';
		cartObj.headers += '[zoom=12] { marker-width: 1   * @marker_size_factor; }\n';
		cartObj.headers += '[zoom=13] { marker-width: 1   * @marker_size_factor; }\n';
		cartObj.headers += '[zoom=14] { marker-width: 2   * @marker_size_factor; }\n';
		cartObj.headers += '[zoom=15] { marker-width: 4   * @marker_size_factor; }\n';
		cartObj.headers += '[zoom=16] { marker-width: 6   * @marker_size_factor; }\n';
		cartObj.headers += '[zoom=17] { marker-width: 8   * @marker_size_factor; }\n';
		cartObj.headers += '[zoom>=18] { marker-width: 12  * @marker_size_factor; }\n\n';


		return cartObj;
	},

	buildCarto_lineWidth : function (options) {

		var style = options.style.line;
		var lineWidth = style.width || {};

		var cartObj = {
			headers : '',
			style   : ''
		};

		if ( lineWidth.column ) {

			var max = Math.floor(options.columns[lineWidth.column].max * 10) / 10;
			var min = Math.floor(options.columns[lineWidth.column].min * 10) / 10;
		
			cartObj.headers += '@line_size_min: ' + lineWidth.range[0] + ';\n';
			cartObj.headers += '@line_size_range: ' + (lineWidth.range[1] - lineWidth.range[0]) + ';\n';
			cartObj.headers += '@line_size_field: [' + lineWidth.column + '];\n';
			cartObj.headers += '@line_size_field_maxVal: ' + max + ';\n';
			cartObj.headers += '@line_size_field_minVal: ' + min + ';\n';
			cartObj.headers += '\n//TODO: Fix this!\n';
			cartObj.headers += '@line_size_factor: (@line_size_field / (@line_size_field_maxVal - @line_size_field_minVal)) * (@line_size_range + @line_size_min);\n\n';
			
		} else {

			var staticWidth = (lineWidth.staticVal === undefined) ? 3 : lineWidth.staticVal;
			cartObj.headers += '@line_size_factor: ' + staticWidth + ';\n';

		}


		cartObj.headers += '[zoom<10] { line-width: 0.1 * @line_size_factor; }\n';
		cartObj.headers += '[zoom=10] { line-width: 0.3 * @line_size_factor; }\n';
		cartObj.headers += '[zoom=11] { line-width: 0.5 * @line_size_factor; }\n';
		cartObj.headers += '[zoom=12] { line-width: 1   * @line_size_factor; }\n';
		cartObj.headers += '[zoom=13] { line-width: 1   * @line_size_factor; }\n';
		cartObj.headers += '[zoom=14] { line-width: 2   * @line_size_factor; }\n';
		cartObj.headers += '[zoom=15] { line-width: 4   * @line_size_factor; }\n';
		cartObj.headers += '[zoom=16] { line-width: 6   * @line_size_factor; }\n';
		cartObj.headers += '[zoom=17] { line-width: 8   * @line_size_factor; }\n';
		cartObj.headers += '[zoom>=18] { line-width: 12  * @line_size_factor; }\n\n';

		// add line joins
		cartObj.style += '\n        line-join: round;';
		cartObj.style += '\n        line-cap: round;';

		return cartObj;
	},


	// Make sure hex decimals have two digits
	padToTwo : function (numberString) {

		if (numberString.length < 2) numberString = '0' + numberString;
		return numberString;
	},

	// OMG code... haven't written it myself...
	// But it interpolates values between hex values
	hexAverage : function (twoHexes) {
		if (!twoHexes[1]) return twoHexes[0];
		return twoHexes.reduce(function (previousValue, currentValue) {
			return currentValue
			.replace(/^#/, '')
			.match(/.{2}/g)
			.map(function (value, index) {
				return previousValue[index] + parseInt(value, 16);
			});
		}, [0, 0, 0])
		.reduce(function (previousValue, currentValue) {
			var newValue = api.geo.padToTwo(Math.floor(currentValue / twoHexes.length).toString(16));
			return previousValue + newValue;
		}.bind(this), '#');
	},



	// *********************************************************************************
	// *********************************************************************************
	// *********************************************************************************



























































	copyToVileFolder : function (path, fileUuid, callback) {
		if (!path || !fileUuid) return callback('Missing information.14');

		var dest = api.config.path.geojson + fileUuid + '.geojson';
		fs.copy(path, dest, function(err) {
			if (err) console.log('copy err!'.red + err);
			callback(err);
		});
	},

	copyToVileRasterFolder : function (path, fileUuid, callback) {
		if (!path || !fileUuid) return callback('Missing information.14');

		var dest = api.config.path.file + fileUuid;
		// console.log('copyToVileRasterFolder!!! 1, from , to', path, dest);

		// do nothing if already there
		if (path == dest) return callback(null);

		// console.log('copyToVileRasterFolder!!! 2');
		fs.copy(path, dest, function(err) {
			if (err) console.log('copy err!'.red, err);
			callback(null);
		});
	},

	handleGeoJSON : function (path, fileUuid, callback) {
		if (!path || !fileUuid) return callback('Missing information.15');

		api.geo.copyToVileFolder(path, fileUuid, function (err) {
			if (err) return callback('copyvile hg err: ' + err);

			try {

				fs.readFile(path, function (err, data) {

					// mapnikOmnivore.digest(path, function (err, metadata) {
					api.geo._readMetaData(path, function (err, metadata) {
						if (err) return callback(err);
		        			if (!metadata) return callback('No metadata!');
		        			
			        		var db = { metadata : metadata }

				        	// return
				        	callback(null, db);
					})
		        	});
			
			} catch (e) { callback('omni crash gj: ' + e); }
		});
	},

	_readMetaData : function (path, callback) {
		return api.geo._readMetaDataNode(path, callback);
	},

	_readMetaDataNode : function (path, callback) {

		try {

		mapnikOmnivore.digest(path, function(err, metadata) {
			if (err) {
				console.log('digest.err!'.red, err, path);
				return callback(err);
			}
			return callback(null, JSON.stringify(metadata, null, 2));
		});

		} catch (e) {
			console.log('omni crash'.red, e, path);
			return callback(e);
		}
	},

	handleTopoJSON : function (path, fileUuid, callback) { 			// TODO!
		callback('Topojson unsupported.');
	},


	import2postgis : function (options, callback) {

		return api.postgis.importData(options, callback);
		
		
		
	},

	validateshp : function (files, callback) {

		// shape extensions
		var mandatory 	= ['.shp', '.shx', '.dbf'];

		files.forEach(function (f) {
			var ext = f.slice(-4);
			_.pull(mandatory, ext);
		});

		// if not all accounted for, return error
		if (mandatory.length > 0) {
			var message = 'Missing shapefile(s): ' + mandatory.join(' ');
			return callback({message : message});
		}
		// return
		callback(null);

	},

	getTheShape : function (shapes) {
		// get .shp file
		var shps = [];
		for (s in shapes) {
			var shape_part = shapes[s];
			if (shape_part && shape_part.slice(-4) == '.shp') {

				var basename = nodepath.basename(shape_part);

				if (basename.slice(0,1) != '.') {
					shps.push(shape_part);
				}
			}
		}
		return shps;
	},

	getTheProjection : function (shapes) {
		// get .prj file
		var shps = [];
		for (s in shapes) {

			var shape_part = shapes[s];
			if (shape_part && shape_part.slice(-4) == '.prj') {

				var basename = nodepath.basename(shape_part);

				if (basename.slice(0,1) != '.') {
					shps.push(shape_part);
				}
			}
		}
		return shps;
	},

	moveShapefiles : function (options, done) {
		var ops = [];
		var possible = ['.shp', '.shx', '.dbf', '.prj', '.sbn', '.sbx', '.fbn', '.fbx', '.ain', '.aih', '.ixs', '.mxs', '.atx', '.shp.xml', '.cpg'];
		possible.forEach(function (ex) {
			var p = options.folder + '/' + options.base + ex;
			var f = options.outfolder + '/' + options.base + ex;
			
			ops.push(function (callback) {
				fs.existsSync(p) ? fs.move(p, f, callback) : callback();
			});
		});

		async.parallel(ops, function (err) {
			if (err) console.log('moveShapefiles err: '.red + err)
			done(err);
		});

	},

	convertshp : function (shapes, folder, callback) {

		// get the .shp file
		var shps = api.geo.getTheShape(shapes);
		
		// return err if no .shp found
		if (!shps) return callback('No shapefile?');

		// vars
		var shp = shps[0];
		var base = shp.slice(0,-4);
		var fileUuid = 'file-' + uuid.v4();
		var toFile = shp + '.geojson';
		var outfolder = api.config.path.file + fileUuid;
		var outFile = outfolder + '/' + toFile;
		var inFile = outfolder + '/' + shp;
		var zipFile = outfolder + '/' + base + '.zip';
		var proj = outfolder + '/' + base + '.prj';

		// options		
		var options = {
			folder : folder,
			outfolder : outfolder,
			base : base
		}
						// callback
		api.geo.moveShapefiles(options, function (err) {
			if (err) {
				console.log('geomove err: '.red + err);
				return callback(err);
			}

			// make sure folder exists
			fs.ensureDirSync(outfolder);					// todo: async!

			// read projection file if exists
			var projection = fs.existsSync(proj) ? fs.readFileSync(proj) : false; 	// todo: async!

			// set projection if any
			try { var proj4 = projection ? srs.parse(projection).proj4 : false; } 
			catch (e) { var proj4 = false; }

			// use ogr2ogr
			api.geo._ogr2ogrFallback(folder, outfolder, toFile, outFile, inFile, fileUuid, proj4, callback);
		});
	},



	_ogr2ogrFallback : function (folder, outfolder, toFile, outFile, inFile, fileUuid, proj4, callback) {

		// make sure dir exists
		fs.ensureDirSync(outfolder); // todo: async!

		// ogr2ogr shapefile to geojson
		var cmd = '/usr/local/bin/ogr2ogr -f geoJSON "' + outFile + '" "' + inFile + '"';

		if (proj4) cmd += ' -s_srs "' + proj4 + '" -t_srs "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs"';

		var exec = require('child_process').exec;
		exec(cmd, function (err, stdout, stdin) {
			// console.log('did cmn'.yellow);
			
			if (err) console.log('ogre fb err: '.red + err);
			if (err) return callback(err);

			// move folder with shapefile to new fileUuid folder
			fs.move(folder, outfolder + '/Shapefiles', function (err) {
				if (err) console.log('ogre mvoe err: '.red + err);
				if (err) return callback(err);

				// callback
				callback(null, {path : outFile, name : toFile, fileUuid : fileUuid});
			});
		});
	},


	pingProgress : function (options, message, percent) {

		// ping progress
		api.socket.processingProgress({
			user_id : options.user_id,
			progress : {
				text : message,
				error : null,
				percent : percent,
				uniqueIdentifier : options.uniqueIdentifier,
			}
		});

	},


	handleRaster : function (options, done) {

		var fileUuid = options.fileUuid || options.file_id,
		    inFile = options.path || options.files[0],
		    name = fileUuid,
		    user_id = options.user_id,
		    uniqueIdentifier = options.uniqueIdentifier,
		    outFolder = '/data/raster_tiles/' + fileUuid + '/raster/',
		    processingTimer, // global timer 
		    ops = [];

		    console.log('infile, outfolder', inFile, outFolder);

		ops.push(function (callback) {
			var out = api.config.path.file + fileUuid + '/' + fileUuid;
			var inn = inFile;

			// dont copy if already there
			if (inn == out) return callback(null);

			// copy
			fs.copy(inn, out, function (err) {
				callback(err);
			});
		})

		// validation
		ops.push(function (callback) {

			// ping progress
			api.geo.pingProgress(options, 'Opening file...', 10);
			

			var dataset = gdal.open(inFile);

			if (!dataset) return callback('Invalid dataset.');
			if (!dataset.srs) return callback('Invalid projection.');
			if (!dataset.srs.validate) return callback('Invalid projection.');

			// check if valid projection
			var invalid = dataset.srs.validate();

			// valid
			if (!invalid) return callback(null, dataset);
			
			// invalid
			var msg = 'Invalid projection: ' + dataset.srs.toWKT();
			callback(msg); // err
		});


		// get file size
		ops.push(function (dataset, callback) {

			// ping progress
			api.geo.pingProgress(options, 'Getting metadata...', 15);

			// get stats
			fs.stat(inFile, function (err, stats) {
				options.fileSize = stats.size;
				callback(null, dataset);
			});
		});


		// get meta 
		ops.push(function (dataset, callback) {

			// get projection
			var s_srs = dataset.srs ? dataset.srs.toProj4() : 'null';

			// ping progress
			api.geo.pingProgress(options, 'Projection:' + s_srs, 16);

			// get extent
			var extent = api.geo._getRasterExtent(dataset);

			// set meta
			var meta = {
				projection : s_srs,
				geotransform : dataset.geoTransform,
				bands : dataset.bands.count(),
				extent : extent.extent,
				center : extent.center,
				minzoom : 0,
				maxzoom : 18,
				filetype : options.extension,
				filesize : options.fileSize, // bytes
				filename : options.name,
				size : {
					x : dataset.rasterSize.x,
					y : dataset.rasterSize.y
				},
			}

			// return meta
			callback(null, meta);

			// "{
			//   "filesize": 184509,
			//   "projection": "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs",
			//   "filename": "sydney",
			//   "center": [
			//     150.441711504,
			//     -33.52856723049999
			//   ],
			//   "extent": [
			//     149.39475100800001, 	// left
			//     -34.30833595899998, 	// bottom
			//     151.488672, 		// right 
			//     -32.748798502		// top
			//   ],
			//   "json": {
			//     "vector_layers": [
			//       {
			//         "id": "subunitsExMS",
			//         "description": "",
			//         "minzoom": 0,
			//         "maxzoom": 22,
			//         "fields": {
			//           "id": "String",
			//           "name": "String"
			//         }
			//       }
			//     ]
			//   },
			//   "minzoom": 0,
			//   "maxzoom": 12,
			//   "layers": [
			//     "subunitsExMS"
			//   ],
			//   "dstype": "ogr",
			//   "filetype": ".geojson"
			// }"
		});


		// reproject if necessary
		ops.push(function (meta, callback) {

			var proj4 = meta.projection;
			var ourProj4 = '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs ';
			var source = gdal.SpatialReference.fromProj4(proj4);
			var target = gdal.SpatialReference.fromProj4(ourProj4);
			var isSame = source.isSame(target);

			// console.log('priojection: ', proj4);
			// console.log('spurce:', source);
			// console.log('target: ', target);

			// debug
			return callback(null, meta);

			// // same, no reprojection necessary
			// if (isSame) return callback(null, meta);

			// var outFile = inFile + '.reprojected';
			// var cmd = 'gdalwarp -srcnodata 0 -dstnodata 0 -t_srs "' + ourProj4 + '" "' + inFile + '" "' + outFile + '"';

			// var exec = require('child_process').exec;
			// var proc = exec(cmd, function (err, stdout, stdin) {
			// 	if (err) return callback(err);

			// 	options.path = outFile;
			// 	callback(null, meta);
			// });

			// proc.stdout.on('data', function(data) {
			// 	console.log('warping stdout: ', data); 
			// });

		});

		ops.push(function (meta, callback) {
			
			// set upload status
			api.upload.updateStatus(fileUuid, {
				metadata : meta,
				tmpfile : inFile,
			}, function (err) {
				callback(null, meta);
			});
		});

		ops.push(function (meta, callback) {

			// ping progress
			api.geo.pingProgress(options, 'Generating tiles...', 20);

			// zoom levels to render
			var zoomLevels = [14, 15].join('-');
			console.log('zoomLevels', zoomLevels);
			var percentDone = 20;
			// -z ' + zoomLevels + '

			var cmd = [
				api.config.path.tools + 'gdal2tiles_parallel.py',
				'--processes=6',
				'--webviewer none',
				'--srcnodata 0,0,0',
				'--profile mercator',
				'--no-kml',
				'"' + inFile + '"',
				'"' + outFolder + '"',
			].join(' ');

			// todo! move this fn to tileserver (pile)!!


			// script command
			// var cmd = api.config.path.tools + 'gdal2tiles_parallel.py --processes=6 -w none -a 200,200,0  -p mercator --no-kml "' + inFile + '" "' + outFolder + '"';
			console.log('cmd: ', cmd);

			// child process script
			var exec = require('child_process').exec;
			var proc = exec(cmd, { maxBuffer: 2000 * 1024 }, function (err, stdout, stdin) {
				
				// handle errors
				if (err) {
					api.error.log(err);
					var errMsg = 'There was an error generating tiles for this raster image. Please check #error-log for more information.'
					return callback(errMsg);
				}

				// clear interval
				clearInterval(processingTimer);

				// ping progress
				api.geo.pingProgress(options, 'Almost done...', 95);

				// REFACTOR!!

				// get tile info
				var nodeDir = require('node-dir');
				nodeDir.files(outFolder, function (err, files) {

					// set meta
					meta.total_tiles = files.length;

					// get tile zoom levels
					nodeDir.subdirs(outFolder, function(err, subdirs) {

						var zooms = [];

						subdirs.forEach(function (sd) {
							var part1 = sd.split(outFolder)[1];
							var part2 = part1.split('/')[0];
							zooms.push(parseInt(part2));
						});

						var total_zooms = _.unique(zooms);

						// set meta
						meta.zoom_levels = _.sortBy(total_zooms);

						// save meta
						api.upload.updateStatus(fileUuid, {
							metadata : meta
						}, callback);

					});
				});
			});

			// processing feedback
			proc.stdout.on('data', function(data, b, c) {
				console.log('tiling stdout: ', data, b, c); 

				// incr progress
				percentDone++;

				if (percentDone > 95) percentDone = 95;

				var text = (percentDone == 95) ? 'Almost done...' : 'Generating tiles...';


				// ping progress
				api.geo.pingProgress(options, text, percentDone);
				
			});

			// ping by interval to give impression of progress
			processingTimer = setInterval(function () {

				percentDone++;

				if (percentDone > 95) percentDone = 95;

				var text = (percentDone == 95) ? 'Almost done...' : 'Generating tiles...';

				// ping progress
				api.geo.pingProgress(options, text, percentDone);

			}, 5000);



		});

		async.waterfall(ops, done);
	},


	_getRasterExtent : function (dataset) {
		
		var size = dataset.rasterSize;
		var geotransform = dataset.geoTransform;

		var corners = {
			'top' 		: {x: 0, y: 0},
			'right' 	: {x: size.x, y: 0},
			'bottom'	: {x: size.x, y: size.y},
			'left' 		: {x: 0, y: size.y},
			'center' 	: {x: size.x/2, y: size.y/2}
		};

		var extent = {};
		var wgs84 = gdal.SpatialReference.fromEPSG(4326);
		var coord_transform = new gdal.CoordinateTransformation(dataset.srs, wgs84);
		var corner_names = Object.keys(corners);
		
		corner_names.forEach(function(corner_name) {
			var corner = corners[corner_name];
			var pt_orig = {
				x: geotransform[0] + corner.x * geotransform[1] + corner.y * geotransform[2],
				y: geotransform[3] + corner.x * geotransform[4] + corner.y * geotransform[5]
			}
			var pt_wgs84 = coord_transform.transformPoint(pt_orig);
			extent[corner_name] = pt_wgs84;
		});
		
		var realExtent = {
			top 	: extent.top.y,
			left 	: extent.left.x,
			bottom 	: extent.bottom.y,
			right 	: extent.right.x
		};

		// return object
		var metadataExtent = {
			extent : [
				realExtent.left,
				realExtent.bottom,
				realExtent.right,
				realExtent.top,
			],
			center : [
				extent.center.x,
				extent.center.y
			]
		}
		
		console.log('setting metadataExtent', metadataExtent);

		return metadataExtent;
	},



	getTilesetMeta : function (req, done) {

		console.log('getTilesetMeta', req.user);

		var file_id = req.data.file_id;
		var user_id = req.user._id;
		var folder = api.config.path.raster_tiles + file_id + '/raster/';

		var ops = {};

		ops.tile_count = function (callback) {

			// get number of files in tilset folder
			var cmd = 'find ' + folder + ' -type f | wc -l'
			var exec = require('child_process').exec;
			var proc = exec(cmd, { maxBuffer: 2000 * 1024 * 1024}, function (err, stdout, stdin) {
				console.log('tile_count exec:', err, stdout, stdin);
				var tile_count = parseInt(stdout);
				callback(err, tile_count);
			});
		}

		ops.tile_size = function (callback) {

			// get size of tileset folder
			var cmd = 'du -s ' + folder;
			var exec = require('child_process').exec;
			var proc = exec(cmd, { maxBuffer: 2000 * 1024 * 1024}, function (err, stdout, stdin) {
				console.log('tile_size exec:', err, stdout, stdin);
				var tile_size = parseInt(stdout.split('  ')[0]); // KB
				callback(err, tile_size);
			});
		}

		async.parallel(ops, function (err, result) {

			// return callback if any
			if (done) return done(err, result)

			// or ping socket
			api.socket.send('tileset_meta', user_id, result);
		})
		
		


	},

	tileCount : function (req, done) {

		var file_id = req.data.file_id;
		var zoom_min = req.data.zoom_min;
		var zoom_max = req.data.zoom_max;
		var ops = [];

		console.log('reaq.data', req.data);
		console.log('########### req', req);
		console.log('cookie', req.session.cookie);

		ops.push(function (callback) {
			File
			.findOne({uuid : file_id})
			.exec(callback);
		})
		
		ops.push(function (file, callback) {
			
			if (!file.data.raster) return callback('Not raster.');
			
			// get extent
			var metadata = api.utils.parse(file.data.raster.metadata);

			var extent = metadata.extent;

			console.log('metadata extent:', extent, metadata);

			// http://tools.geofabrik.de/tiledb?map=geofabrik_standard&
			// l=5.538061999999896
			// r=13.613258562499794
			// t=51.852097592066265
			// b=47.23631199999996
			// z=6

			// [ -49, -7.0000000000008, -47.9999999999992, -6 ]

			var extent_left 	= (-1) * extent[3];
			var extent_right 	= (-1) * extent[1];
			var extent_top 		= (-1) * extent[2];
			var extent_bottom 	= (-1) * extent[0];

			var url = 'http://tools.geofabrik.de/tiledb?map=geofabrik_standard&l=5.538061999999896&r=13.613258562499794&t=51.852097592066265&b=47.23631199999996&z=6'
			
			var url = [
				'http://tools.geofabrik.de/tiledb?map=geofabrik_standard',
				'&l=' + extent_left,
				'&r=' + extent_right,
				'&t=' + extent_top,
				'&b=' + extent_bottom,
				'&z=' + zoom_min
			].join('');

			
			request(url, function (err, response, body) {
				// err handling
				// console.log('err, response, body)', err, response, body)

				// parse result
				var tile_count = JSON.parse(body);

				var tiles = tile_count.tiles;

				console.log('tiles: ', tiles);

				// calc tiles
				var lower = tiles[zoom_max];

				

				var data = {
					zoom_max : zoom_max,
					tiles : tile_count.tiles[zoom_max],
					extent : {
						extent_left : extent_left,
						extent_right : extent_right,
						extent_top : extent_top,
						extent_bottom : extent_bottom,
					}
				}

				// return layers to async ops
				callback(null, data);
			});


		});

		ops.push(function (data, callback) {

			// var user_id = req.session.passport.user;
			console.log('TODO: user_id');
				
			if (done) {

				// return callback
				done(null, data);
			} else {

				// send socket
				api.socket.send('tile_count', user_id, data);
			}
			

			// '{"memory":[0,0,0,0,0,0,1449.5,1021.921875,763.8984375,422383,1077127.9223632812,3342917.5869140625,11203657.877197266,568200005.8731743,1078945199.609375,5169977867.444824,8563502655.513611,79728201110.9375,0,0],"tiles":[1,1,1,1,1,2,2,2,2,1536,5115,18396,73548,285950,1143800,4509564,18037980,71889950,287558700,1149709767]}' },

		});


		async.waterfall(ops, function (err, result) {

			if (err) done(err);
		});


	},




	generateTiles : function (req) {

		var file_id = req.data.file_id;
		var zoom_min = req.data.zoom_min;
		var zoom_max = req.data.zoom_max;
		// var user_id = req.session.passport.user;
		var user_id;

		if (req && req.session && req.session.passport && req.session.passport.user) {
			var user_id = req.session.passport.user;
		} else {
			// send socket err
			return api.socket.send('generate_tiles', user_id, {
				err : 'no user'
			});
		}

		var ops = [];

		ops.push(function (callback) {
			api.geo.tileCount(req, callback);
		});

		ops.push(function (data, callback) {

			var tile_count = data.tiles;

			// err
			if (!tile_count) return callback('Tile count error: ' + tile_count);

			// limit
			if (tile_count > 11001) callback('Too many tiles: ' + tile_count);

			// generate
			api.geo._generateTiles({
				zoom_min : zoom_min,
				zoom_max : zoom_max,
				file_id : file_id
			}, callback);

		});

		ops.push(function (meta, callback) {

			// send reply
			api.socket.send('generate_tiles', user_id, {
				metadata : meta,
				file_id : file_id
			});

		});

		async.waterfall(ops, function (err, results) {

			// send socket err
			if (err) return api.socket.send('generate_tiles', user_id, {
				err : err
			});

		});

	},

	_generateTiles : function (options, done) {

		console.log('_generateTiles', options);

		var file_id = options.file_id;
		var zoom_min = options.zoom_min;
		var zoom_max = options.zoom_max;
		var outFolder = api.config.path.raster_tiles + file_id + '/raster/'; // todo: put in config

		var ops = [];
		var status;
		var meta;


		ops.push(function (callback) {
			var key = 'uploadStatus:' + file_id;
			api.redis.layers.get(key, function (err, stat) {
				status = api.utils.parse(stat);

				console.log('stauts', status);
				callback(err);
			});
		});

		ops.push(function (callback) {

			// zoom levels to render
			var zoomLevels = [zoom_min, zoom_max].join('-');

			// file name
			var inFile = status.tmpfile;

			// script command
			var cmd = [
				api.config.path.tools + 'gdal2tiles_parallel.py',
				'--processes=6',
				'--webviewer none',
				'--srcnodata 0,0,0',
				'--profile mercator',
				'--zoom ' + zoomLevels,	
				'--resume',
				'--no-kml',
				'"' + inFile + '"',
				'"' + outFolder + '"',
			].join(' ');

			console.log('zoomLevels', zoomLevels);
			console.log('cmd: ', cmd);
			console.log('infile', inFile);

			console.log('metadata pre parse', status.metadata);


			meta = status.metadata;

			// script command
			// var cmd = api.config.path.tools + 'gdal2tiles_parallel.py --processes=6 -w none -a 200,200,0  -p mercator --no-kml "' + inFile + '" "' + outFolder + '"';

			// child process script
			var exec = require('child_process').exec;
			var proc = exec(cmd, { maxBuffer: 2000 * 1024 * 1024}, function (err, stdout, stdin) {

				console.log('exec err', err, stdout, stdin);
		
				// get tile info
				var nodeDir = require('node-dir');
				nodeDir.files(outFolder, function (err, files) {

					// set meta
					meta.total_tiles = files.length;

					// get tile zoom levels
					nodeDir.subdirs(outFolder, function(err, subdirs) {

						var zooms = [];

						subdirs.forEach(function (sd) {
							var part1 = sd.split(outFolder)[1];
							var part2 = part1.split('/')[0];
							zooms.push(parseInt(part2));
						});

						var total_zooms = _.unique(zooms);

						// set meta
						meta.zoom_levels = _.sortBy(total_zooms);

						// save meta
						api.upload.updateStatus(file_id, {
							metadata : meta
						}, callback);

					});
				});
			});
		});

		ops.push(function (callback) {
			callback();
		});


		async.series(ops, function (err, result) {
			done(err, meta);
		})
	},



















}