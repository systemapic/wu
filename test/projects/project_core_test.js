var helpers = require('../helpers');
var projectUpdate = require('./update');
var projectCreate = require('./create');
var projectUnique = require('./unique');
var projectDelete = require('./delete');
var getPublic = require('./getPublic');
var getPrivate = require('./getPrivate');
var getProjectLayers = require('./getProjectLayers');
var setAccess = require('./setAccess');

describe('Project', function () {
    this.slow(500);
    before(function(done) { helpers.create_user(done); });
    after(function(done) { helpers.delete_user(done); });

    projectUpdate();
    projectCreate();
    projectDelete();
    projectUnique();
    getProjectLayers();
	getPublic();
	getPrivate();
    getProjectLayers();
    setAccess();
});
