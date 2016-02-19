var helpers = require('../helpers');
var importData = require('./import_data');

describe('Upload data', function () {

    before(function(done) { helpers.create_user(done); });
    after(function(done) { helpers.delete_user(done); });

    importData();
});
