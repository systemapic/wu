var helpers = require('../helpers');
var projectUpdate = require('./update');
var projectCreate = require('./create');
var projectUnique = require('./unique');
var projectDelete = require('./delete');
var getPublic = require('./getPublic');
var projectAddInvites = require('./addInvites');
var getPrivate = require('./getPrivate');
var projectHashSet = require('./hash/set');

describe('Project', function () {

    before(function(done) { helpers.create_user(done); });
    after(function(done) { helpers.delete_user(done); });

    projectUpdate();
    projectCreate();
    projectDelete();
    projectUnique();
	projectAddInvites();
	getPublic();
	getPrivate();
	projectHashSet();
});
