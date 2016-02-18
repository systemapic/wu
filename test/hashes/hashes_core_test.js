var getHashes = require('./get');
var setHashes = require('./set');
var helpers = require('../helpers');

describe('Hashes', function () {
    before(helpers.create_user);
    after(helpers.delete_user);
    this.slow(500);

    getHashes();
    setHashes();
});
