// dependencies
// var _ = require('lodash');
var fs = require('fs-extra');
// var kue = require('kue');
var path = require('path');
// var zlib = require('zlib');
// var uuid = require('uuid');
// var async = require('async');
// var redis = require('redis');
// var carto = require('carto');
// var colors = require('colors');
// var cluster = require('cluster');
// var numCPUs = require('os').cpus().length;
// var mapnikOmnivore = require('mapnik-omnivore');
// var SphericalMercator = require('sphericalmercator');
// var mercator = new SphericalMercator();
// var GrainStore = require('grainstore');
var mercator = require('./sphericalmercator');
var mapnik = require('mapnik');
mapnik.register_default_fonts();
mapnik.register_default_input_plugins();

// trying to create a simple raster tile from postgis

console.time('CREATE RASTER');

// var database_name = 'zzjihbcpqm';

// cetin3, EPSG:32638
// var table_name = 'shape_qbbdijgmex';

// cadastral, srid: 4326
// var table_name = 'shape_dszhjnseex';

// 14/10124/6322
var params = {
	// z : 13, // cadastral
	// x : 7533,
	// y : 4915,
	z : 14,
	x : 10124,
	y : 6322,
	style : 'points'
	// z : 0,
	// x : 0,
	// y : 0,
	
}

var postgis_settings = {
	'dbname' 	: 'zzjihbcpqm',
	// 'table' 	: '(select * from shape_nsziadryou where area > 100000) as mysubquery', // works!!
	// 'table' 	: '(select * from shape_nsziadryou where area > 300000) as mysubquery',
	// 'table' 	: 'shape_ozpnkswisx',
	// 'table' 	: '(select * from shape_ozpnkswisx where area_m2 > 1000) as sub', // works!
	// 'table' 	: '(select * from shape_ozpnkswisx where area_m2 > 1000) as sub', // works!
	// 'table' 	: 'shape_ubpdiiswel',
	// 'table' 	: '(select * from shape_ubpdiiswel where vel < -50) as sub',
	'table' 	: '(select * from shape_ubpdiiswel where ST_Intersects(geom, !bbox!)) as sub',
	'user' 		: 'docker',
	'password' 	: 'docker',
	'host' 		: 'postgis',
	'type' 		: 'postgis',
	'geometry_field': 'geom',
	'srid' 		: '3857',
	// 'extent' 	: '16813700.23783365, -4011415.24440605, 16818592.2076439, -4006523.2745957985'  //change this if not merc
	// 'extent' 	: '-20005048.4188,-9039211.13765,19907487.2779,17096598.5401'
}


// everything in spherical mercator (3857)!
var map = new mapnik.Map(256, 256, mercator.proj4);
// var map = new mapnik.Map(256, 256);
var layer = new mapnik.Layer('tile', mercator.proj4);
// var layer = new mapnik.Layer('tile');
var postgis = new mapnik.Datasource(postgis_settings);
var bbox = mercator.xyz_to_envelope(parseInt(params.x), parseInt(params.y), parseInt(params.z), false);

console.log('bbox', bbox);

layer.datasource = postgis;
layer.styles = [params.style];

map.bufferSize = 64;
map.load(path.join(__dirname, params.style + '.xml'), {strict: true}, function(err,map) {
	if (err) throw err;
	map.add_layer(layer);

	console.log(map.toXML()); // Debug settings

	map.extent = bbox; // must have extent!
	var im = new mapnik.Image(map.width, map.height);

	// var im = new mapnik.VectorTile(0,0,0);

	map.render(im, function(err, im) {
		console.log('map.render err, im', err, im);
		fs.outputFile('./cetin3.png', im.encodeSync('png'))
		// fs.writeFileSync("./cetin3.pbf", im.getData());

		// console.log('vector_tile: ', im.names(), im.toJSON());
		// var json = im.toJSON();
		// console.log('json.features');
		// console.log(json[0].features);
	

		console.timeEnd('CREATE RASTER');

	});
});
















//==================================================================================================
//==================================================================================================
//==================================================================================================
//==================================================================================================
//==================================================================================================

// var map = new mapnik.Map(256, 256);
























//==================================================================================================
//==================================================================================================
//==================================================================================================
// var postgis_settings = {
// 	'dbname' : database_name,
// 	'extent' : '-20005048.4188,-9039211.13765,19907487.2779,17096598.5401',
// 	'geometry_field' : 'geom',
// 	'srid' : 4326,
// 	'user' : 'docker',
// 	'host' : 'postgis',
// 	'password' : 'docker',
// 	'dbuser' : 'docker',
// 	'max_size' : 1,
// 	'type' : 'postgis',
// 	'table' : table_name
// }


// var bbox = mercator.bbox(parseInt(query.x),
// 			 parseInt(query.y),
// 			 parseInt(query.z), false);

// var map = new mapnik.Map(256, 256, '4326');
// // map.bufferSize(64);
// var layer = new mapnik.Layer('tile', '4326');

// // settings.postgis.table = table_name

// var postgis = new mapnik.Datasource(postgis_settings);
// layer.datasource = postgis;
// styles = [query.style];
// map.load('./polygon.xml', {}, function (err, map) {


// 	console.log('err, map', err, map);

// 	// labels
// 	// styles.push('text');
// 	// map.load(path.join(settings.styles, 'text.xml'));

// 	layer.styles = styles;
// 	map.add_layer(layer);
// 	// show map in terminal with toString()
// 	console.log(map.toString());


// 	map.render(bbox, 'png', function(err, buffer) {
// 		if (err) console.log('ERR', err);
// 		console.log(map.scaleDenominator());

// 		var filename = './test/' + table_name + '.png';
// 		fs.writeFile(filename, buffer, function(err) {
// 			if (err) console.log(err);
// 			console.log('saved map image to', filename);
// 		});

// 	});



// });
















