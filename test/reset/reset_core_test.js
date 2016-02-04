var resetPassword = require('./password');
var resetIndex = require('./index');
var helpers = require('../helpers');

describe('Reset', function () {
    before(function(done) { helpers.create_user(done); });
    after(function(done) { helpers.delete_user(done); });

    resetPassword();
    resetIndex();
});
