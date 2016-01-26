var helpers = require('../helpers');
var layersDelete = require('./layer_delete');

describe('Layer', function () {
    before(function(done) { helpers.create_user(done); });
    after(function(done) { helpers.delete_user(done); });

    layersDelete();
});
