var userUpdate = require('./update');
var helpers = require('../helpers');

describe('User', function () {
    before(function(done) { helpers.create_user(done); });
    after(function(done) { helpers.delete_user(done); });

    userUpdate();
});
