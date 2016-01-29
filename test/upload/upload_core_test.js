var helpers = require('../helpers');
var uploadGet = require('./get');

describe('Upload', function () {

    before(function(done) { helpers.create_user(done); });
    after(function(done) { helpers.delete_user(done); });

    uploadGet();
});
