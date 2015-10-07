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
var _ 		= require('lodash-node');
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

// api
var api = module.parent.exports;

// exports
module.exports = api.geo = { 

	json2cartocss : function (req, res) {
		var options = req.body;

		// convert json to cartocss
		api.geo._json2cartocss(options, function (err, css) {
			res.end(css);
		});
	},

	_json2cartocss : function (options, callback) {
		if (!options.style) return callback('Missing style!');
		
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
		if (options.style.extras) style.layer += this.buildExtras(options);


		// point styling
		if (isPoint) style = api.geo._createPointCarto(options, style);

		// polygon styling
		if (isPolygon) style = api.geo._createPolygonCarto(options, style);
			
		// polygon styling
		if (isLine) style = api.geo._createLineCarto(options, style);


		// close #layer
		style.layer += '}'
		
		// debug
		console.log('created style: ', style);

		// concat
		var finalCarto = style.headers + style.layer;

		// return cartocss
		callback(null, finalCarto);

	},

	_createPointCarto : function (options, style) {

		var allowOverlap = 'true';
		var markerClip  = 'false';
		var compOp      = 'screen'

		// CREATE DEFAULT STYLING
		style.layer += '\tmarker-allow-overlap: ' + allowOverlap + ';\n';
		style.layer += '\tmarker-clip: ' + markerClip + ';\n';
		style.layer += '\tmarker-comp-op: ' + compOp + ';\n\n';

		// OPACITY
		var pointOpacityCarto = this.buildCarto_pointOpacity(options);
		style.headers += pointOpacityCarto.headers;
		style.layer += pointOpacityCarto.style;

		// COLOR
		var pointColorCarto = this.buildCarto_pointColor(options);
		style.headers += pointColorCarto.headers;
		style.layer += pointColorCarto.style;

		// SIZE
		var pointSizeCarto = this.buildCarto_pointSize(options);
		style.headers += pointSizeCarto.headers;
		style.layer += pointSizeCarto.style;	

		return style;

	},

	_createPolygonCarto : function (options, style) {

		// opacity
		var polygonOpacityCarto = this.buildCarto_polygonOpacity(options);
		style.headers += polygonOpacityCarto.headers;
		style.layer += polygonOpacityCarto.style;

		// color
		var polygonColorCarto = this.buildCarto_polygonColor(options);
		style.headers += polygonColorCarto.headers;
		style.layer += polygonColorCarto.style;

		// add line styling todo!

		return style;

	},

	_createLineCarto : function (options, style) {
		return style;
	},


	buildExtras : function (options) {

		var style = options.style;
		var extras = style.extras;

		// extra: reference point
		if (extras.referencepoint && extras.referencepoint.column && extras.referencepoint.value) {
			
			// create reference point
			return this.buildReferencePoint(extras.referencepoint);
		};

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

	buildCarto_pointOpacity : function (options) {

		var style = options.style.point;
		var opacity = style.opacity;

		var cartObj = {
			headers : '',
			style   : ''
		}


		if ( opacity.range ) {

			var max = Math.floor(options.columns[opacity.range].max * 10) / 10;
			var min = Math.floor(options.columns[opacity.range].min * 10) / 10;				

			var normalizedOffset = true;

			// NORMALIZED OFFSET 
			// i.e. if the lowest number is 30, and 
		 	// highest is 100, 30 will return 0.3 and not 0
			if ( normalizedOffset ) {
				if ( min > 0 ) min = 0;
			}

			cartObj.headers += '@opacity_field_max: ' + max + ';\n';
			cartObj.headers += '@opacity_field_min: ' + min + ';\n';
			cartObj.headers += '@opacity_field_range: [' + opacity.range + '];\n\n';
			cartObj.headers += '@opacity_field: @opacity_field_range / (@opacity_field_max - @opacity_field_min);\n\n';

		
		} else {

			// static opacity
			cartObj.headers += '@opacity_field: ' + opacity.value + ';\n';
		}

		cartObj.style += '\tmarker-opacity: @opacity_field;\n\n';

		return cartObj;
	},

	buildCarto_polygonOpacity : function (options) {

		var style = options.style.polygon;
		var opacity = style.opacity;


		var cartObj = {
			headers : '',
			style   : ''
		}


		if ( opacity.range ) {

			var max = Math.floor(options.columns[opacity.range].max * 10) / 10;
			var min = Math.floor(options.columns[opacity.range].min * 10) / 10;				

			var normalizedOffset = true;

			// NORMALIZED OFFSET 
			// i.e. if the lowest number is 30, and 
		 	// highest is 100, 30 will return 0.3 and not 0
			if ( normalizedOffset ) {
				if ( min > 0 ) min = 0;
			}

			cartObj.headers += '@opacity_field_max: ' + max + ';\n';
			cartObj.headers += '@opacity_field_min: ' + min + ';\n';
			cartObj.headers += '@opacity_field_range: [' + opacity.range + '];\n\n';
			cartObj.headers += '@opacity_field: @opacity_field_range / (@opacity_field_max - @opacity_field_min);\n\n';

		
		} else {

			// static opacity
			cartObj.headers += '@opacity_field: ' + opacity.value + ';\n';
		}

		cartObj.style += '\tpolygon-opacity: @opacity_field;\n\n';

		return cartObj;
	},

	buildCarto_lineOpacity : function (options) {

		var style = options.style.line;
		var opacity = style.opacity;


		var cartObj = {
			headers : '',
			style   : ''
		}


		if ( opacity.range ) {

			var max = Math.floor(options.columns[opacity.range].max * 10) / 10;
			var min = Math.floor(options.columns[opacity.range].min * 10) / 10;				

			var normalizedOffset = true;

			// NORMALIZED OFFSET 
			// i.e. if the lowest number is 30, and 
		 	// highest is 100, 30 will return 0.3 and not 0
			if ( normalizedOffset ) {
				if ( min > 0 ) min = 0;
			}

			cartObj.headers += '@opacity_field_max: ' + max + ';\n';
			cartObj.headers += '@opacity_field_min: ' + min + ';\n';
			cartObj.headers += '@opacity_field_range: [' + opacity.range + '];\n\n';
			cartObj.headers += '@opacity_field: @opacity_field_range / (@opacity_field_max - @opacity_field_min);\n\n';

		
		} else {

			// static opacity
			cartObj.headers += '@opacity_field: ' + opacity.value + ';\n';
		}

		cartObj.style += '\tpolygon-opacity: @opacity_field;\n\n';

		return cartObj;
	},



	// COLOR RANGE
	// COLOR RANGE
	// COLOR RANGE

	buildCarto_pointColor : function (options) {

		var style = options.style.point;
		var color = style.color;

		var cartObj = {
			headers : '',
			style   : ''
		}		

		if ( color.range ) {

			var minMax = color.customMinMax ? color.customMinMax : color.minMax;

			// Get color values
			var c1 = color.value[0];
			var c9 = color.value[1];
			var c17 = color.value[2];
			var c25 = color.value[3];
			var c33 = color.value[4];

			// Interpolate
			var c5 = this.hexAverage([c1, c9]);
			var c13 = this.hexAverage([c9, c17]);
			var c21 = this.hexAverage([c17, c25]);
			var c29 = this.hexAverage([c25, c33]);

			// Interpolate
			var c3 = this.hexAverage([c1, c5]);
			var c7 = this.hexAverage([c5, c9]);
			var c11 = this.hexAverage([c9, c13]);
			var c15 = this.hexAverage([c13, c17]);
			var c19 = this.hexAverage([c17, c21]);
			var c23 = this.hexAverage([c21, c25]);
			var c27 = this.hexAverage([c25, c29]);
			var c31 = this.hexAverage([c29, c33]);

			// Interpolate
			var c2 = this.hexAverage([c1, c3]);
			var c4 = this.hexAverage([c3, c5]);
			var c6 = this.hexAverage([c5, c7]);
			var c8 = this.hexAverage([c7, c9]);
			var c10 = this.hexAverage([c9, c11]);
			var c12 = this.hexAverage([c11, c13]);
			var c14 = this.hexAverage([c13, c15]);
			var c16 = this.hexAverage([c15, c17]);
			var c18 = this.hexAverage([c17, c19]);
			var c20 = this.hexAverage([c19, c21]);
			var c22 = this.hexAverage([c21, c23]);
			var c24 = this.hexAverage([c23, c25]);
			var c26 = this.hexAverage([c25, c27]);
			var c28 = this.hexAverage([c27, c29]);
			var c30 = this.hexAverage([c29, c31]);
			var c32 = this.hexAverage([c31, c33]);

			var colorArray = [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11, c12, c13, c14, c15, c16, c17, c18, c19, c20, c21, c22, c23, c24, c25, c26, c27, c28, c29, c30, c31, c32, c33];



			// CREATE VARS
			var fieldName = '@' + color.range;
			var maxField  = fieldName + '_max';
			var minField  = fieldName + '_min';
			var deltaName = fieldName + '_delta';
			

			// DEFINE FIELD NAME + MIN/MAX
			cartObj.headers += fieldName + ': [' + color.range + '];\n';
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
			})


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

					cartObj.style += '\t[' + fieldName + ' > ' + fieldName + '_step_' + no + ']';
					cartObj.style += '[' + fieldName + ' < ' + fieldName + '_step_' + (no+1) + ']';
					cartObj.style += '{ marker-fill: ' + fieldName + '_color_' + no + '; }\n';

				}

				if ( no == colorArray.length ) {

					cartObj.style +=  '\t[' + fieldName + ' > ' + fieldName + '_step_' + no + '] ';
					cartObj.style += '{ marker-fill: ' + fieldName + '_color_' + no + '; }\n\n';
				}
			})
			
		
		} else {
		
			// static color
			cartObj.style += '\tmarker-fill: ' + color.staticVal + ';\n\n';
		}

		return cartObj;
	},


	buildCarto_polygonColor : function (options) {

		var style = options.style.polygon;
		var color = style.color;

		var cartObj = {
			headers : '',
			style   : ''
		}		

		if ( color.range ) {

			var minMax = color.customMinMax ? color.customMinMax : color.minMax;

			// Get color values
			var c1 = color.value[0];
			var c9 = color.value[1];
			var c17 = color.value[2];
			var c25 = color.value[3];
			var c33 = color.value[4];

			// Interpolate
			var c5 = this.hexAverage([c1, c9]);
			var c13 = this.hexAverage([c9, c17]);
			var c21 = this.hexAverage([c17, c25]);
			var c29 = this.hexAverage([c25, c33]);

			// Interpolate
			var c3 = this.hexAverage([c1, c5]);
			var c7 = this.hexAverage([c5, c9]);
			var c11 = this.hexAverage([c9, c13]);
			var c15 = this.hexAverage([c13, c17]);
			var c19 = this.hexAverage([c17, c21]);
			var c23 = this.hexAverage([c21, c25]);
			var c27 = this.hexAverage([c25, c29]);
			var c31 = this.hexAverage([c29, c33]);

			// Interpolate
			var c2 = this.hexAverage([c1, c3]);
			var c4 = this.hexAverage([c3, c5]);
			var c6 = this.hexAverage([c5, c7]);
			var c8 = this.hexAverage([c7, c9]);
			var c10 = this.hexAverage([c9, c11]);
			var c12 = this.hexAverage([c11, c13]);
			var c14 = this.hexAverage([c13, c15]);
			var c16 = this.hexAverage([c15, c17]);
			var c18 = this.hexAverage([c17, c19]);
			var c20 = this.hexAverage([c19, c21]);
			var c22 = this.hexAverage([c21, c23]);
			var c24 = this.hexAverage([c23, c25]);
			var c26 = this.hexAverage([c25, c27]);
			var c28 = this.hexAverage([c27, c29]);
			var c30 = this.hexAverage([c29, c31]);
			var c32 = this.hexAverage([c31, c33]);

			var colorArray = [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11, c12, c13, c14, c15, c16, c17, c18, c19, c20, c21, c22, c23, c24, c25, c26, c27, c28, c29, c30, c31, c32, c33];



			// CREATE VARS
			var fieldName = '@' + color.range;
			var maxField  = fieldName + '_max';
			var minField  = fieldName + '_min';
			var deltaName = fieldName + '_delta';
			

			// DEFINE FIELD NAME + MIN/MAX
			cartObj.headers += fieldName + ': [' + color.range + '];\n';
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
			})


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
			cartObj.style += '\tpolygon-fill: ' + color.staticVal + ';\n\n';
		}

		return cartObj;
	},


	buildCarto_lineColor : function (options) {

		var style = options.style.line;
		var color = style.color;

		var cartObj = {
			headers : '',
			style   : ''
		}		

		if ( color.range ) {

			var minMax = color.customMinMax ? color.customMinMax : color.minMax;

			// Get color values
			var c1 = color.value[0];
			var c9 = color.value[1];
			var c17 = color.value[2];
			var c25 = color.value[3];
			var c33 = color.value[4];

			// Interpolate
			var c5 = this.hexAverage([c1, c9]);
			var c13 = this.hexAverage([c9, c17]);
			var c21 = this.hexAverage([c17, c25]);
			var c29 = this.hexAverage([c25, c33]);

			// Interpolate
			var c3 = this.hexAverage([c1, c5]);
			var c7 = this.hexAverage([c5, c9]);
			var c11 = this.hexAverage([c9, c13]);
			var c15 = this.hexAverage([c13, c17]);
			var c19 = this.hexAverage([c17, c21]);
			var c23 = this.hexAverage([c21, c25]);
			var c27 = this.hexAverage([c25, c29]);
			var c31 = this.hexAverage([c29, c33]);

			// Interpolate
			var c2 = this.hexAverage([c1, c3]);
			var c4 = this.hexAverage([c3, c5]);
			var c6 = this.hexAverage([c5, c7]);
			var c8 = this.hexAverage([c7, c9]);
			var c10 = this.hexAverage([c9, c11]);
			var c12 = this.hexAverage([c11, c13]);
			var c14 = this.hexAverage([c13, c15]);
			var c16 = this.hexAverage([c15, c17]);
			var c18 = this.hexAverage([c17, c19]);
			var c20 = this.hexAverage([c19, c21]);
			var c22 = this.hexAverage([c21, c23]);
			var c24 = this.hexAverage([c23, c25]);
			var c26 = this.hexAverage([c25, c27]);
			var c28 = this.hexAverage([c27, c29]);
			var c30 = this.hexAverage([c29, c31]);
			var c32 = this.hexAverage([c31, c33]);

			var colorArray = [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11, c12, c13, c14, c15, c16, c17, c18, c19, c20, c21, c22, c23, c24, c25, c26, c27, c28, c29, c30, c31, c32, c33];



			// CREATE VARS
			var fieldName = '@' + color.range;
			var maxField  = fieldName + '_max';
			var minField  = fieldName + '_min';
			var deltaName = fieldName + '_delta';
			

			// DEFINE FIELD NAME + MIN/MAX
			cartObj.headers += fieldName + ': [' + color.range + '];\n';
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
			})


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

					cartObj.style += '\t[' + fieldName + ' > ' + fieldName + '_step_' + no + ']';
					cartObj.style += '[' + fieldName + ' < ' + fieldName + '_step_' + (no+1) + ']';
					cartObj.style += '{ marker-fill: ' + fieldName + '_color_' + no + '; }\n';

				}

				if ( no == colorArray.length ) {

					cartObj.style +=  '\t[' + fieldName + ' > ' + fieldName + '_step_' + no + '] ';
					cartObj.style += '{ marker-fill: ' + fieldName + '_color_' + no + '; }\n\n';
				}
			})
			
		
		} else {
		
			// static color
			cartObj.style += '\tmarker-fill: ' + color.staticVal + ';\n\n';
		}

		return cartObj;
	},

	
	// POINT SIZE
	// POINT SIZE
	// POINT SIZE

	buildCarto_pointSize : function (options) {

		var style = options.style.point;
		var pointSize = style.pointSize;

		var cartObj = {
			headers : '',
			style   : ''
		}		

		if ( pointSize.range ) {

			var max = Math.floor(options.columns[pointSize.range].max * 10) / 10;
			var min = Math.floor(options.columns[pointSize.range].min * 10) / 10;
		
			// cartObj.headers += '@marker_size_max: ' + pointSize.minMax[1] + ';\n';
			cartObj.headers += '@marker_size_min: ' + pointSize.minMax[0] + ';\n';
			cartObj.headers += '@marker_size_range: ' + (pointSize.minMax[1] - pointSize.minMax[0]) + ';\n';
			cartObj.headers += '@marker_size_field: [' + pointSize.range + '];\n';
			cartObj.headers += '@marker_size_field_maxVal: ' + max + ';\n';
			cartObj.headers += '@marker_size_field_minVal: ' + min + ';\n';
			cartObj.headers += '\n//TODO: Fix this!\n';
			cartObj.headers += '@marker_size_factor: (@marker_size_field / (@marker_size_field_maxVal - @marker_size_field_minVal)) * (@marker_size_range + @marker_size_min);\n\n';
			
		} else {

			cartObj.headers += '@marker_size_factor: ' + pointSize.value + ';\n';

		}


		cartObj.headers += '[zoom=10] { marker-width: 0.3 * @marker_size_factor; }\n';
		cartObj.headers += '[zoom=11] { marker-width: 0.5 * @marker_size_factor; }\n';
		cartObj.headers += '[zoom=12] { marker-width: 1   * @marker_size_factor; }\n';
		cartObj.headers += '[zoom=13] { marker-width: 1   * @marker_size_factor; }\n';
		cartObj.headers += '[zoom=14] { marker-width: 2   * @marker_size_factor; }\n';
		cartObj.headers += '[zoom=15] { marker-width: 4   * @marker_size_factor; }\n';
		cartObj.headers += '[zoom=16] { marker-width: 6   * @marker_size_factor; }\n';
		cartObj.headers += '[zoom=17] { marker-width: 8   * @marker_size_factor; }\n';
		cartObj.headers += '[zoom=18] { marker-width: 12  * @marker_size_factor; }\n\n';


		return cartObj;
	},

	buildCarto_lineWidth : function (options) {

		var style = options.style.line;
		var lineWidth = style.lineWidth;

		var cartObj = {
			headers : '',
			style   : ''
		}		

		if ( lineWidth.range ) {

			var max = Math.floor(options.columns[lineWidth.range].max * 10) / 10;
			var min = Math.floor(options.columns[lineWidth.range].min * 10) / 10;
		
			cartObj.headers += '@line_size_min: ' + lineWidth.minMax[0] + ';\n';
			cartObj.headers += '@line_size_range: ' + (lineWidth.minMax[1] - lineWidth.minMax[0]) + ';\n';
			cartObj.headers += '@line_size_field: [' + lineWidth.range + '];\n';
			cartObj.headers += '@line_size_field_maxVal: ' + max + ';\n';
			cartObj.headers += '@line_size_field_minVal: ' + min + ';\n';
			cartObj.headers += '\n//TODO: Fix this!\n';
			cartObj.headers += '@line_size_factor: (@line_size_field / (@line_size_field_maxVal - @line_size_field_minVal)) * (@line_size_range + @line_size_min);\n\n';
			
		} else {

			cartObj.headers += '@line_size_factor: ' + lineWidth.value + ';\n';

		}


		cartObj.headers += '[zoom=10] { line-width: 0.3 * @line_size_factor; }\n';
		cartObj.headers += '[zoom=11] { line-width: 0.5 * @line_size_factor; }\n';
		cartObj.headers += '[zoom=12] { line-width: 1   * @line_size_factor; }\n';
		cartObj.headers += '[zoom=13] { line-width: 1   * @line_size_factor; }\n';
		cartObj.headers += '[zoom=14] { line-width: 2   * @line_size_factor; }\n';
		cartObj.headers += '[zoom=15] { line-width: 4   * @line_size_factor; }\n';
		cartObj.headers += '[zoom=16] { line-width: 6   * @line_size_factor; }\n';
		cartObj.headers += '[zoom=17] { line-width: 8   * @line_size_factor; }\n';
		cartObj.headers += '[zoom=18] { line-width: 12  * @line_size_factor; }\n\n';


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
			var newValue = this.padToTwo(Math.floor(currentValue / twoHexes.length).toString(16));
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

				console.log('shape_part: ', shape_part);

				var basename = nodepath.basename(shape_part);

				console.log('basnemae: ', basename);

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

				console.log('shape_part: ', shape_part);

				var basename = nodepath.basename(shape_part);

				console.log('basnemae: ', basename);

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


	handleRaster : function (options, done) {

		var fileUuid = options.fileUuid || options.file_id,
		    inFile = options.path || options.files[0],
		    name = fileUuid,
		    outFolder = '/data/raster_tiles/' + fileUuid + '/raster/',
		    ops = [];


		ops.push(function (callback) {
			var out = api.config.path.file + fileUuid + '/' + fileUuid;
			var inn = inFile;
			// console.log('COPYYY inn, out', inn, out);

			// dont copy if already there
			if (inn == out) return callback(null);

			fs.copy(inn, out, function (err) {
				callback(err);
			});
		})

		// validation
		ops.push(function (callback) {

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
			// console.log('msg: ', msg);
			callback(msg); // err
		});


		// get file size
		ops.push(function (dataset, callback) {
			fs.stat(inFile, function (err, stats) {
				options.fileSize = stats.size;
				callback(null, dataset);
			});
		});


		// get meta 
		ops.push(function (dataset, callback) {
			
			// get projection
			var s_srs = dataset.srs ? dataset.srs.toProj4() : 'null';

			// get extent
			var extent = api.geo._getRasterExtent(dataset);

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
			
			callback(null, meta);
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

			// same, no reprojection necessary
			if (isSame) return callback(null, meta);

			var outFile = inFile + '.reprojected';
			var cmd = 'gdalwarp -srcnodata 0 -dstnodata 0 -t_srs "' + ourProj4 + '" "' + inFile + '" "' + outFile + '"';
			// console.log('gdalwarp cmd: ', cmd);

			var exec = require('child_process').exec;
			exec(cmd, function (err, stdout, stdin) {
				if (err) return callback(err);

				options.path = outFile;
				callback(null, meta);
			});

		});

		ops.push(function (meta, callback) {
			// set upload status
				api.upload.updateStatus(fileUuid, {
					metadata : meta
				}, function (err) {
					callback(null, meta);
				});
		})

		ops.push(function (meta, callback) {
			
			var cmd = api.config.path.tools + 'gdal2tiles_parallel.py --processes=6 -w none -a 0,0,0 -p mercator --no-kml "' + inFile + '" "' + outFolder + '"';
			// var cmd = api.config.path.tools + 'pp2gdal2tiles.py --processes=1 -w none -p mercator --no-kml "' + options.path + '" "' + outFolder + '"';
			console.log('cmd: ', cmd);

			var exec = require('child_process').exec;
			exec(cmd, { maxBuffer: 2000 * 1024 }, function (err, stdout, stdin) {
				console.log('ppgdal2tiles:'.green, stdout);
				if (err) {
					console.log('gdal2tiles err: '.red + err);
					
					api.error.log(err);
					var errMsg = 'There was an error generating tiles for this raster image. Please check #error-log for more information.'
					return callback(errMsg);
				}

				// return as db entry
				var db = {
					data : {
						raster : fileUuid
					},
					title : fileUuid,
					file : fileUuid,
					metadata : JSON.stringify(meta)
				}

				console.log('db created'.yellow, db);
				callback(null, db);
			});

				// var key = results[1];
				// if (!key) return callback('No key.');

				// var path = key.path;
				// var name = key.name;
				// var fileUuid = key.fileUuid;

				// // add geojson file to list
				// shapefiles.push(name);

				// return as db entry
				// var db = {
				// 	files : shapefiles,
				// 	data : {
				// 		geojson : name
				// 	},
				// 	title : name,
				// 	file : fileUuid
				// }

				// return as db entry
				// var db = {
				// 	data : {
				// 		raster : options.name
				// 	},
				// 	title : options.name,
				// 	file : fileUuid,
				// 	metadata : JSON.stringify(meta)
				// }
				// api.geo.copyToVileRasterFolder(options.path, fileUuid, function (err) {
				// 	if (err) return callback('copytToVile err: ' + err);

				// 	callback(null, db);
				// });
		});

		async.waterfall(ops, done);
	},


	// handleJPEG2000 : function (options, done) {
	// 	return api.geo.handleRaster(options, done);


	// },

	// handleRaster : function (options, done) {

	// 	var fileUuid = options.fileUuid,
	// 	    inFile = options.path,
	// 	    outFolder = '/data/raster_tiles/' + fileUuid + '/raster/',
	// 	    ops = [];


	// 	// console.log('GDAL VERSION'.red, gdal.version);
	// 	// console.log('GDAL DRIVERS'.red, gdal.drivers.getNames());
	// 	console.log('options.'.green, options);

	// 	// async.parallel([function (callback) {
	// 	// 	var out = api.config.path.file + fileUuid + '/' + options.name;
	// 	// 	var inn = inFile;
	// 	// 	console.log('inn, out', inn, out);

	// 	// 	fs.copy(inn, out, callback)
	// 	// }], console.log)

	// 	ops.push(function (callback) {
	// 		var out = api.config.path.file + fileUuid + '/' + options.name;
	// 		var inn = inFile;
	// 		console.log('COPYYY inn, out', inn, out);

	// 		if (inn == out) return callback(null);

	// 		fs.copy(inn, out, function (err) {
	// 			callback(err);
	// 		});
	// 	})

	// 	// validation
	// 	ops.push(function (callback) {

	// 		var dataset = gdal.open(inFile);

	// 		if (!dataset) return callback('Invalid dataset.');
	// 		if (!dataset.srs) return callback('Invalid projection.');
	// 		if (!dataset.srs.validate) return callback('Invalid projection.');

	// 		// check if valid projection
	// 		var invalid = dataset.srs.validate();

	// 		// valid
	// 		if (!invalid) return callback(null, dataset);
			
	// 		// invalid
	// 		var msg = 'Invalid projection: ' + dataset.srs.toWKT();
	// 		console.log('msg: ', msg);
	// 		callback(msg); // err
	// 	});


	// 	// get file size
	// 	ops.push(function (dataset, callback) {
	// 		fs.stat(options.path, function (err, stats) {
	// 			options.fileSize = stats.size;
	// 			callback(null, dataset);
	// 		});
	// 	});


	// 	// get meta 
	// 	ops.push(function (dataset, callback) {
			
	// 		// get projection
	// 		var s_srs = dataset.srs ? dataset.srs.toProj4() : 'null';

	// 		// get extent
	// 		var extent = api.geo._getRasterExtent(dataset);

	// 		var meta = {
	// 			projection : s_srs,
	// 			geotransform : dataset.geoTransform,
	// 			bands : dataset.bands.count(),
	// 			extent : extent.extent,
	// 			center : extent.center,
	// 			minzoom : 0,
	// 			maxzoom : 18,
	// 			filetype : options.extension,
	// 			filesize : options.fileSize, // bytes
	// 			filename : options.name,
	// 			size : {
	// 				x : dataset.rasterSize.x,
	// 				y : dataset.rasterSize.y
	// 			},
	// 		}

	// 		// "{
	// 		//   "filesize": 184509,
	// 		//   "projection": "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs",
	// 		//   "filename": "sydney",
	// 		//   "center": [
	// 		//     150.441711504,
	// 		//     -33.52856723049999
	// 		//   ],
	// 		//   "extent": [
	// 		//     149.39475100800001, 	// left
	// 		//     -34.30833595899998, 	// bottom
	// 		//     151.488672, 		// right 
	// 		//     -32.748798502		// top
	// 		//   ],
	// 		//   "json": {
	// 		//     "vector_layers": [
	// 		//       {
	// 		//         "id": "subunitsExMS",
	// 		//         "description": "",
	// 		//         "minzoom": 0,
	// 		//         "maxzoom": 22,
	// 		//         "fields": {
	// 		//           "id": "String",
	// 		//           "name": "String"
	// 		//         }
	// 		//       }
	// 		//     ]
	// 		//   },
	// 		//   "minzoom": 0,
	// 		//   "maxzoom": 12,
	// 		//   "layers": [
	// 		//     "subunitsExMS"
	// 		//   ],
	// 		//   "dstype": "ogr",
	// 		//   "filetype": ".geojson"
	// 		// }"
			
	// 		callback(null, meta);
	// 	});


	// 	// reproject if necessary
	// 	ops.push(function (meta, callback) {

	// 		var proj4 = meta.projection;
	// 		var ourProj4 = '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs ';
	// 		var source = gdal.SpatialReference.fromProj4(proj4);
	// 		var target = gdal.SpatialReference.fromProj4(ourProj4);
	// 		var isSame = source.isSame(target);

	// 		// same, no reprojection necessary
	// 		if (isSame) return callback(null, meta);

	// 		var outFile = inFile + '.reprojected';
	// 		var cmd = 'gdalwarp -srcnodata 0 -dstnodata 0 -t_srs "' + ourProj4 + '" "' + inFile + '" "' + outFile + '"';
	// 		console.log('gdalwarp cmd: ', cmd);

	// 		var exec = require('child_process').exec;
	// 		exec(cmd, function (err, stdout, stdin) {
	// 			if (err) return callback(err);

	// 			options.path = outFile;
	// 			callback(null, meta);
	// 		});

	// 	});

	// 	ops.push(function (meta, callback) {
			
	// 		var cmd = api.config.path.tools + 'gdal2tiles_parallel.py --processes=6 -w none -p mercator --no-kml "' + options.path + '" "' + outFolder + '"';
	// 		// var cmd = api.config.path.tools + 'pp2gdal2tiles.py --processes=1 -w none -p mercator --no-kml "' + options.path + '" "' + outFolder + '"';
	// 		console.log('cmd: ', cmd);

	// 		var exec = require('child_process').exec;
	// 		exec(cmd, { maxBuffer: 2000 * 1024 }, function (err, stdout, stdin) {
	// 			console.log('ppgdal2tiles:'.green, stdout);
	// 			if (err) {
	// 				console.log('gdal2tiles err: '.red + err);
					
	// 				api.error.log(err);
	// 				var errMsg = 'There was an error generating tiles for this raster image. Please check #error-log for more information.'
	// 				return callback(errMsg);
	// 			}

	// 			// return as db entry
	// 			var db = {
	// 				data : {
	// 					raster : options.name
	// 				},
	// 				title : options.name,
	// 				file : fileUuid,
	// 				metadata : JSON.stringify(meta)
	// 			}

	// 			console.log('db created'.yellow, db);
	// 			callback(null, db);
	// 		});
	// 	});

	// 	async.waterfall(ops, done);
	// },


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
			top : extent.top.y,
			left : extent.left.x,
			bottom : extent.bottom.y,
			right : extent.right.x
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
		
		// console.log('metadataExtent', metadataExtent);

		return metadataExtent;
	},









}