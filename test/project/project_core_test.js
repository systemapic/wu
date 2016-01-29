var helpers = require('../helpers');
var projectUpdate = require('./update');
var projectCreate = require('./create');
var projectUnique = require('./unique');
var projectDelete = require('./delete');
var projectAddInvites = require('./addInvites');

describe('Project', function () {

    before(function(done) { helpers.create_user(done); });
    after(function(done) { helpers.delete_user(done); });

    projectUpdate();
    projectCreate();
    projectDelete();
    projectUnique();
	projectAddInvites();
});
