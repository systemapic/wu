var helpers = require('../helpers');
var importData = require('./import_data');
var importPolygonEgyptZip = require('./egypt_polygon_200_geojson');
var twoZippedShapesZipError = require('./two_zipped_geojson.error.zip');
var shapefileMissingPrjZip = require('./shapefile_missing_prj_zip');
var rasterEcwZip = require('./raster_ecw_200_zip');
var geom_zPointsShapeFileZip = require('./geom_z_points_shapefile_200_zip');
var geom_zPolygonShapefileZip = require('./geom_z_polygon_shapefile_200_zip');
var parklandPolygonGeojson = require('./parkland_polygon_200_geojson');
var snowRasterTif = require('./snow_raster_200_tif');

describe('Import', function () {

    before(function(done) { helpers.create_user(done); });
    after(function(done) { helpers.delete_user(done); });

    importData();
    importPolygonEgyptZip();
    twoZippedShapesZipError();
    shapefileMissingPrjZip();
    rasterEcwZip();
    geom_zPointsShapeFileZip();
    geom_zPolygonShapefileZip();
    parklandPolygonGeojson();
    snowRasterTif();
});
