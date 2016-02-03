var helpers = require('../helpers');
var dataSetShare = require('./share');

describe('Dataset', function () {
    before(function(done) { helpers.create_user(done); });
    after(function(done) { helpers.delete_user(done); });

    dataSetShare();
});
