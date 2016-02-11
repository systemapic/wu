var tokenIndex = require('./index');
var tokenRefresh = require('./refresh');
var helpers = require('../helpers');

describe('Token', function () {
    before(function(done) { helpers.create_user(done); });
    after(function(done) { helpers.delete_user(done); });

    tokenIndex();
    tokenRefresh();
});
