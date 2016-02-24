var tokenIndex = require('./index');
var tokenRefresh = require('./refresh');
var tokenCheck = require('./check');
var helpers = require('../helpers');


// todo: move to /test/users/ folder, because endpoint is now /v2/users/token etc.

describe('Token', function () {
    beforeEach(function(done) { helpers.create_user(done); });
    afterEach(function(done) { helpers.delete_user(done); });
    this.slow(500);

    tokenIndex();
    tokenRefresh();
    tokenCheck();
});
