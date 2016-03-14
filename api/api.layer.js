// API: api.layer.js

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
var nodepath    = require('path');
var formidable  = require('formidable');
var nodemailer  = require('nodemailer');
var uploadProgress = require('node-upload-progress');
var mapnikOmnivore = require('mapnik-omnivore');
var errors = require('../shared/errors');
var httpStatus = require('http-status');

// api
var api = module.parent.exports;

// exports
module.exports = api.layer = {

	// default styler JSON
	defaultStyleJSON : {
		
		point : { 
			enabled : false, 
			color : { 
				column : false, 
				range : [-426.6, 105.9], 
				staticVal : "yellow",
				value : ["#ff0000", "#ffff00", "#00ff00", "#00ffff", "#0000ff"]
			},
			opacity : { 
				column : false,
				range : [-426.6, 105.9],
				value : 0.5
			}, 
			pointsize : { 
				column :false,
				range : [0, 10],
				value : 1
			}
		},

		polygon : { 
			enabled : false, 
			color : { 
				column : false, 
				range : [-426.6, 105.9], 
				staticVal : "red",
				value : ["#ff0000", "#ffff00", "#00ff00", "#00ffff", "#0000ff"]
			},
			opacity : { 
				column : false,
				range : [-426.6, 105.9],
				value : 0.5
			}, 
			line : {
				width : { 
					column :false,
					range : false,
					value : 1
				},
				opacity : {
					column : false,
					range : [-426.6, 105.9],
					value : 0.5
				},
				color : {
					column : false, 
					range : [-426.6, 105.9], 
					staticVal : "green",
					value : ["#ff0000", "#ffff00", "#00ff00", "#00ffff", "#0000ff"]
				}
			}
		},

		line : {
			enabled : false,
			width : { 
				column :false,
				range : false,
				value : 1
			},
			opacity : {
				column : false,
				value : 0.5
			},
			color : {
				column : false, 
				range : [-426.6, 105.9], 
				staticVal : "green",
				value : ["#ff0000", "#ffff00", "#00ff00", "#00ffff", "#0000ff"]
			}
		}
	},

	// create layer
	create : function (req, res, next) {
		var options = req.body || {};
		var ops = [];
		
		ops.push(function (callback) {
			api.layer.createModel(options, callback);
		});

		async.waterfall(ops, function (err, doc) {
			if (err) {
				return next(err);
			}
			res.send(doc);
		});
	},


	// create OSM layer
	createOSM : function (req, res, next) {
		var projectUuid = req.body.projectUuid;
		var title = req.body.title;
		var layer = new Layer();
		var missingRequiredFields = [];
		var ops = [];

		if (!projectUuid) {
			missingRequiredFields.push('projectUuid');
		}

		if (!title) {
			missingRequiredFields.push('title');
		}

		if (!_.isEmpty(missingRequiredFields)) {
			return next(api.error.code.missingRequiredRequestFields(errors.missing_information.errorMessage, missingRequiredFields));
		}

		layer.uuid 		= 'osm-layer-' + uuid.v4();
		layer.title 		= title;
		layer.description 	= 'Styleable vector tiles';
		layer.data.osm 	 	= true;
		layer.legend 		= '';
		layer.file 		= 'osm';

		ops.push(function (callback) {
			layer.save(function (err, doc) {
				if (err || !doc) {
					err.message = errors.checking_user_name.errorMessage;
					return callback(err);
				}

				callback(null, doc);
			});
		});

		ops.push(function (doc, callback) {
			api.layer.addToProject(doc._id, projectUuid, function (err, result) {
				if (err) return callback(err)
				callback(null, doc);
			});
		});

		async.waterfall(ops, function (err, result) { 
			if (err) return next(err);
			res.send(result);
		});
	},


	createPileLayer : function (options, callback) {
		var host = api.config.portalServer.uri;

		// send to tileserver storage
		request({
			method : 'POST',
			uri : host + 'api/db/createLayer',
			json : options
		
		// callback
		}, function (err, response, body) {
			callback(err, body);
		});

	},

	createDefaultLayers : function (req, res, next) {
		 var options = req.body;
		 api.layer._createDefaultLayers(options, function (err, layers) {
		 	if (err) return next(err);
		 	res.send(layers);
		 });
	},


	_createDefaultLayers : function (options, done) {

		console.log('_createDefault options: ', options);

		// - get default style json
		// - create carto from json
		// - create pile layer
		// - create wu layer
		// - return both

		var ops = [];


		ops.push(function (callback) {
			// default styling

			var defaultStyleJSON = api.layer.defaultStyleJSON;

			api.geo._json2carto(defaultStyleJSON, function (err, cartoCSS) {

				console.log('json2carto: ', err, cartoCSS);
				
				callback(err);
			})


		})


		async.waterfall(ops, function (err, results) {


			done(null, {
				pile : 'ok', 
				wu : 'ok'
			});

		})

		


	},



	// create layer from geojson
	createLayerFromGeoJSON : function (req, res) {
		var geojson = req.body.geojson,
		    projectUuid = req.body.project,
		    filename = uuid.v4() + '.geojson',
		    outfile = '/tmp/' + filename,
		    data = JSON.stringify(geojson),
		    size = data.length;

		fs.writeFile(outfile, data, function (err) {
			if (err) return api.error.general(req, res, err);

			var file = [{ 
				fieldName : 'file[]',
				originalFilename : filename,
				path : outfile,
				size : size || 0,
				name : 'Created Shape',
				type : 'application/octet-stream' 
			}];

			req.files = {
				file : file
			}

			// upload.upload(req, res);
			api.upload.file(req, res);
		});
	},


	// get layers and send to client
	get : function (req, res, next) {
		// var project = req.body.project;
		var project = req.query.project;
		var user = req.user.uuid;

		console.log('apilauyer.get proejcT:', project);

		// error if no project or user
		if (!project || !user) {
			return next({
				message: errors.missing_information.errorMessage,
				code: httpStatus.BAD_REQUEST,
				errors: {
					missingRequiredFields: ['project']
				}
			});
		}
		// get project
		Project.findOne({ 'access.read' : user, 'uuid' : project }).exec(function(err, result) {
			var layerIds = []
			if (err || !result){
				err = err || {
					message: errors.no_such_project.errorMessage,
					code: httpStatus.NOT_FOUND
				};
				return next(err);
			};
			// got project
			Layer.find({ '_id': { $in: result.layers }}, function(err, docs){
				if (err || !docs) {
					err = err || {
						message: errors.no_such_layers.errorMessage,
						code: httpStatus.NOT_FOUND
					};
					return next(err);
				}
				// return layers
				res.send(docs);
			});
		});
	},


	// update layer
	update : function (req, res, next) {
		var parameters = req.body || {};
		var layerUuid 	= parameters.layer;
		var user 	= req.user;

		// error if no project or user
		if (!layerUuid) {
			return next(api.error.code.missingRequiredRequestFields(errors.missing_information.errorMessage, ['layer']));
		}

		Layer.findOne({'uuid' : layerUuid}, function (err, layer) {
			if (err) return next(err);

			if (!layer) {
				return next({
					code: httpStatus.NOT_FOUND,
					message: errors.no_such_layers.errorMessage
				});
			}

			var valid = [
				'satellite_position', 
				'description', 
				'copyright', 
				'title',
				'tooltip',
				'style',
				'filter',
				'legends',
				'opacity',
				'zIndex',
				'data'
			];
			var ops = [];

			updates = _.pick(parameters, valid);

			ops.push(function (callback) {
				_.extend(layer, updates);
				layer.validate(function (err) {
					validationErrors = err;
					if (validationErrors && validationErrors.errors && !_.isEmpty(_.keys(validationErrors.errors))) {
						return callback({
							code: httpStatus.BAD_REQUEST,
							message: errors.invalid_fields.errorMessage,
							errors: validationErrors.errors
						});
					}
					callback(null);
				});
			});

			ops.push(function (callback) {
				layer.update({ $set: _.pick(parameters, valid) })
					.exec(function (err, result) {
						if (err) {
							callback(err);
						}

						callback(null, {
							updated: _.keys(updates)
						});
					});
			});

			ops.push(function (params, callback) {
				Layer.findOne({uuid: layerUuid})
					.exec(function (err, res) {
						if (err) {
							return callback(err);
						}
						params.layer = res;
						callback(null, params);
					});
			});

			async.waterfall(ops, function (err, result) {
				if (err) {
					return next(err);
				}

				res.send(JSON.stringify(result));
			});
		});

	},

	deleteLayer : function (req, res, next) {
		var options = req.body,
		    layerUuid = options.layer_id,
		    projectUuid = options.project_id,
		    missingRequiredFields = [],
		    ops = [];

		if (!layerUuid) {
			missingRequiredFields.push('layer_id');
		}

		if (!projectUuid) {
			missingRequiredFields.push('project_id');
		}

		if (!_.isEmpty(missingRequiredFields)) {
			return next({
				message: errors.missing_information.errorMessage,
				code: httpStatus.BAD_REQUEST,
				errors: {
					missingRequiredFields: missingRequiredFields
				}
			});
		}

		// delete layer model
		// delete from project

		ops.push(function (callback) {

			Layer
			.findOneAndRemove({uuid : layerUuid})
			.exec(function (err, layer) {
				console.log('removed layer: ', err, layer);
				if (!layer || !layer._id) {
					return callback({
						message: errors.no_such_layers.errorMessage,
						code: httpStatus.NOT_FOUND
					});
				}
				callback(err, layer._id);
			});

		});

		ops.push(function (layer_id, callback) {
			Project
			.findOne({uuid : projectUuid})
			.exec(function (err, project) {
				if (err) {
					return callback(err);
				}
				
				if (!project || !project._id) {
					return callback({
						message: errors.no_such_project.errorMessage,
						code: httpStatus.NOT_FOUND
					});
				}

				project.layers.pull(layer_id);
				project.markModified('layers');
				project.save(callback);
			});
		});

		async.waterfall(ops, function (err, results) {
			console.log('all done? ', err, results);

			if (err) {
				return next(err);
			}

			res.send({
				success : true,
				error : err
			});
		});


	},

	// deleteLayer : function (req, res) {

	// 	var projectUuid  = req.body.projectUuid,
	// 	    userid = req.user.uuid,
	// 	    layerUuids = req.body.layerUuids,
	// 	    ops = [],
	// 	    _lids = [];

	// 	// validate
	// 	if (!projectUuid || !userid) return api.error.missingInformation(req, res);

	// 	// find layer _ids for removing in project
	// 	ops.push(function (callback) {
	// 		Layer.find({uuid : {$in : layerUuids}}, function (err, layers) {
	// 			if (err || !layers) return callback(err || 'No layers.');

	// 			layers.forEach(function (layer) {
	// 				_lids.push(layer._id);
	// 			});

	// 			callback(err);
	// 		});
	// 	});



	// 	// delete layer from project
	// 	ops.push(function (callback) {
			
	// 		Project
	// 		.findOne({uuid : projectUuid})
	// 		.exec(function (err, project) {
	// 			if (err || !project) return callback(err || 'No project.');

	// 			// pull layers
	// 			_lids.forEach(function (l) {
	// 				project.layers.pull(l)
	// 			})
				
	// 			// project.markModified('files');
	// 			project.markModified('layers');
	// 			project.save(function (err) {
	// 				callback(err);
	// 			});
	// 		});
	// 	});

	
	// 	// run queries
	// 	async.series(ops, function(err) {
	// 		if (err) return api.error.general(req, res, err);		

	// 		res.end(JSON.stringify({
	// 			error : err
	// 		}));
	// 	});

	// },


	// reload layer meta
	reloadMeta : function (req, res, next) {
		var fileUuid = req.body.file_id;
		var layerUuid = req.body.layer_id;
		var missingRequiredFields = [];

		if (!fileUuid) {
			missingRequiredFields.push('file_id');
		}

		if (!layerUuid) {
			missingRequiredFields.push('layer_id');
		}

		if (!_.isEmpty(missingRequiredFields)) {
			return next({
				message: errors.missing_information.errorMessage,
				code: httpStatus.BAD_REQUEST,
				errors: {
					missingRequiredFields: missingRequiredFields
				}
			});
		}

		// // return on err
		// if (!fileUuid || !layerUuid) return api.error.missingInformation(req, res);

		// get meta
		api.layer.getMeta(fileUuid, function (err, meta) {

			// return on err
			if (err) {
				return next(err);
			}

			if (!meta) return api.error.general(req, res, err || 'No meta.');

			// save meta to fil
			api.layer.setMeta(meta, layerUuid, function (err, result) {

				// return meta
				res.send({
					error : err,
					meta : meta
				});
			});
		});
	},


	// get layer meta
	getMeta : function (fileUuid, callback) {

		File
		.findOne({uuid : fileUuid})
		.exec(function (err, file) {
			if (err) {
				return callback(err);
			}

			if (!file) {
				return callback({
					message: errors.no_such_file.errorMessage,
					code: httpStatus.NOT_FOUND,
				});
			}

			// only support for geojson now
			if (!file.data || !file.data.geojson) {
				return callback({
					message: errors.no_geojson_found.errorMessage,
					code: httpStatus.UNPROCESSABLE_ENTITY
				});
			}

			// set path
			var path = api.config.path.file + fileUuid + '/' + file.data.geojson;

			// var omnipath = METAPATH + uuid + '.meta.json';
			fs.readJson(path, function (err, metadata) { 			// expensive
				callback(err, metadata);
			});
		});
	},


	// set layer meta
	setMeta : function (meta, layerUuid, callback) {

		Layer
		.findOne({uuid : layerUuid})
		.exec(function (err, layer) {
			if (err || !layer) return callback(err || 'No layer.');

			layer.metadata = meta; 	// string?
			layer.save(function (err) {
				callback(err);
			});
		});
	},

	// get cartocss
	getCartoCSS : function (req, res) {
		var cartoId = req.query.cartoid;
		var path = api.config.path.cartocss + cartoId + '.mss';
		fs.readFile(path, {encoding : 'utf8'}, function (err, data) {
			if (err || !data) return api.error.general(req, res, err || 'No data.');

			res.send(data);
		});
	},

	// set carto css
	setCartoCSS : function (req, res) {

		// get params
		var params = req.body || {};
		var fileUuid 	= params.fileUuid;
		var css 	= params.css;
		var cartoid 	= params.cartoid;
		var layerUuid 	= params.layerUuid;
		var csspath = api.config.path.cartocss + cartoid + '.mss';
		var isOSM = (fileUuid == 'osm');
		var host = isOSM ? api.config.vileosm.uri : api.config.vile.uri;

		var host = api.config.vile.uri;

		// save css to file by cartoId 
		fs.writeFile(csspath, css, {encoding : 'utf8'}, function (err) {
			if (err) return api.error.general(req, res, err || 'No data.');

			// send to tileserver storage
			request({
				method : 'POST',
				uri : host + 'import/cartocss',
				json : {
					css : css,
					cartoid : cartoid,
					osm : (fileUuid == 'osm')
				}
			}, 

			// callback
			function (err, response, body) {

				// custom error handling
				if (err) {
					return res.send({
		        			ok : false,
		        			error : err
		        		});
				}
				// pass syntax errors to client
		        	if (!body.ok) {
		        		return res.send({
		        			ok : false,
		        			error : body.error
		        		});
		        	}

		        	if (!err && response.statusCode == 200) {
				
					Layer
					.findOne({uuid : layerUuid})
					.exec(function (err, layer) {
						if (err || !layer) return api.error.general(req, res, err || 'No layer.');

						layer.data.cartoid = cartoid;
						layer.markModified('data');
						
						layer.save(function (err, doc) {
							if (err || !doc) return api.error.general(req, res, err || 'No layer.');

							res.send({
				        			ok : true,
				        			cartoid : cartoid,
				        			error : null			// todo: save err
				        		});
						});
					});

		        	} else {
		        		return api.error.general(req, res, 'setCartoCss !200');
		        	}
			});
		});
	},


	


	

	_inheritDefinitions : function (definitions, env) {
		
		try {
			var inheritTime = +new Date();
			// definitions are ordered by specificity,
			// high (index 0) to low
			var byAttachment = {},
			byFilter = {};
			var result = [];
			var current, previous, attachment;

			// Evaluate the filters specified by each definition with the given
			// environment to correctly resolve variable references
			definitions.forEach(function(d) {
				d.filters.ev(env);
			});

			for (var i = 0; i < definitions.length; i++) {

				attachment = definitions[i].attachment;
				current = [definitions[i]];

				if (!byAttachment[attachment]) {
					byAttachment[attachment] = [];
					byAttachment[attachment].attachment = attachment;
					byFilter[attachment] = {};
					result.push(byAttachment[attachment]);
				}

				// Iterate over all subsequent rules.
				for (var j = i + 1; j < definitions.length; j++) {
					if (definitions[j].attachment === attachment) {
						// Only inherit rules from the same attachment.
						current = addRules(current, definitions[j], byFilter[attachment], env);
					}
				}

				for (var k = 0; k < current.length; k++) {
					byFilter[attachment][current[k].filters] = current[k];
					byAttachment[attachment].push(current[k]);
				}
			}

			return result;
		} catch (e) {
			return [];
		}

	},

	_checkExistingLayer : function (options, callback) {
		if (options.uuid) {
			Layer.findOne({uuid : options.uuid})
				.exec(function (err, layer) {
					if (err || !layer) {
						return callback(null, options);
					}

					return callback(new Error(errors.layer_already_exist.errorMessage));
				});
		} else {
			return callback(null, options);
		}
	},

	createModel : function (options, callback) {

		// metadata sometimes come as object... todo: check why!
		if (_.isObject(options.metadata)) {
			options.metadata = JSON.stringify(options.metadata);
		}

		var layer 		= new Layer();
		// layer.uuid 		= options.uuid || 'layer-' + uuid.v4(),
		layer.uuid 		= 'layer-' + uuid.v4(), 
		layer.title 		= options.title;
		layer.description 	= options.description || '';
		layer.legend 		= options.legend || '';
		layer.file 		= options.file;
		layer.metadata 		= options.metadata;
		layer.data 		= options.data;
		layer.style 		= options.style;

		layer.save(function (err, savedLayer) {
			if (err) return callback(err);

			if (options.projectUuid) {
				return api.layer.addToProject(layer._id, options.projectUuid, function (err) {
					callback && callback(err, savedLayer);
				});
			}
			
			callback && callback(err, savedLayer);
		});
	},

	// save file to project (file, layer, project id's)
	addToProject : function (layer_id, projectUuid, callback) {

		Project
		.findOne({'uuid' : projectUuid })
		.exec(function (err, project) {
			if (err || !project) {
				return callback(err || {
					message: errors.no_such_project.errorMessage,
					code: httpStatus.NOT_FOUND
				});
			}
			project.layers.push(layer_id);			
			project.markModified('layers');
			project.save(function (err) {
				callback && callback(err);
			});
		});
	},
}

// systemapic hack
carto.Renderer.prototype.getRules = function render(data) {
	var env = _(this.env).defaults({
		benchmark: true,
		validation_data: false,
		effects: []
	});

	carto.tree.Reference.setVersion(this.options.mapnik_version);

	var parser = (carto.Parser(env)).parse(data);

	return parser;
}
