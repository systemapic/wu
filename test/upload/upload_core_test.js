var helpers = require('../helpers');
var importData = require('./import_data');
var importPoints = require('./import_points_gz');
var importPolygonEgyptZip = require('./egypt_polygon_200_geojson');
var twoZippedShapesZipError = require('./two_zipped_geojson.error.zip');
var shapefileMissingPrjZip = require('./shapefile_missing_prj_zip');
var rasterEcwZip = require('./raster_ecw_200_zip');
var geom_zPointsShapeFileZip = require('./raster_ecw_200_zip');

describe.only('Upload data', function () {

    before(function(done) { helpers.create_user(done); });
    after(function(done) { helpers.delete_user(done); });

    importData();
    importPoints();
    importPolygonEgyptZip();
    twoZippedShapesZipError();
    shapefileMissingPrjZip();
    rasterEcwZip();
    geom_zPointsShapeFileZip();
});
