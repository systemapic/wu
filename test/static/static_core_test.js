var helpers = require('../helpers');
var staticScreen = require('./screen');

describe('Layer', function () {
    this.slow(500);
    before(helpers.create_user);
    after(helpers.delete_user);

    staticScreen();
});
