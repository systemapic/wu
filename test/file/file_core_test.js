var fileTests = require('./file_old').fileTests;
var fileUpdate = require('./update');
var fileAddToProject = require('./addtoproject');
var helpers = require('../helpers');

describe('File', function () {
    before(function(done) { helpers.create_user(done); });
    after(function(done) { helpers.delete_user(done); });

    before(function(done) {
        helpers.create_file(function (err) {
            return done(err);
        });
    });

    after(function(done) {
        helpers.delete_file(done);
    });

    fileTests();
    fileUpdate();
    fileAddToProject()
});
