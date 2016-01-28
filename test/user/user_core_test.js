var userUpdate = require('./update');
var userUnique = require('./unique');
var userUniqueName = require('./uniqueUsername');
var helpers = require('../helpers');

describe('User', function () {
    before(function(done) { helpers.create_user(done); });
    after(function(done) { helpers.delete_user(done); });

    userUpdate();
    userUnique();
    userUniqueName();
});
