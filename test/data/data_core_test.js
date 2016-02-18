var fileDelete = require('./delete');
var fileUpdate = require('./update');
var fileAddToProject = require('./addtoproject');
var fileGetLayers = require('./layers');
var fileDownload = require('./download');
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

    fileDelete();
    fileUpdate();
    fileAddToProject();
    fileGetLayers();
    fileDownload();
});
