var helpers = require('../helpers');
var importData = require('./import_data');
var importPoints = require('./import_points_gz');
var importPolygonEgyptZip = require('./polygon_egypt_zip');
var twoZippedShapesZip = require('./two_zipped_shapes_zip');
var shapefileMissingPrjZip = require('./shapefile_missing_prj_zip');
var rasterEcwZip = require('./raster_ecw_zip');

describe.only('Upload data', function () {

    before(function(done) { helpers.create_user(done); });
    after(function(done) { helpers.delete_user(done); });

    importData();
    importPoints();
    importPolygonEgyptZip();
    twoZippedShapesZip();
    shapefileMissingPrjZip();
    rasterEcwZip();

});
