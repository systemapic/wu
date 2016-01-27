var helpers = require('../helpers');
var json2carto = require('./json2carto');

describe('Layer', function () {
    before(function(done) { helpers.create_user(done); });
    after(function(done) { helpers.delete_user(done); });

    json2carto();
});
