var helpers = require('../helpers');
var dataShare = require('./share');
var dataDelete = require('./delete');
var dataUpdate = require('./update');
var dataAddToProject = require('./addtoproject');
var dataGetLayers = require('./layers');
var dataDownload = require('./download');
var dataCreate = require('./create');

describe('Dataset', function () {
    before(helpers.create_user);
    before(helpers.create_file);
    after(helpers.delete_user);
    after(helpers.delete_file);
  
    dataShare();
    dataUpdate();
    dataAddToProject(); 	// todo: belong on project test, since endpoint has been renamed to /v2/projects/data
    dataGetLayers();
    dataDownload();
    dataDelete();
    dataCreate();
});