var helpers = require('../helpers');
var projectUpdate = require('./update');
var projectCreate = require('./create');
var projectUnique = require('./unique');
var projectDelete = require('./delete');

describe('Project', function () {
    this.slow(500);

    before(function(done) { helpers.create_user(done); });
    after(function(done) { helpers.delete_user(done); });

    before(function (done) {
        helpers.create_user(done);
    });
    after(function (done) {
        helpers.delete_user(done);
    });

    projectUpdate();
    projectCreate();
    projectUnique();
    projectDelete();

});
