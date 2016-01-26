var helpers = require('../helpers');
var layersDelete = require('./delete');
var layerNew = require('./new');

describe('Layer', function () {
    before(function(done) { helpers.create_user(done); });
    after(function(done) { helpers.delete_user(done); });

    layersDelete();
    layerNew();
});
