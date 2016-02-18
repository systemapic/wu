var helpers = require('../helpers');
var layersDelete = require('./delete');
var layerCreate= require('./create');
var layerUpdate = require('./update');
var layerGet = require('./get');
var layerMeta = require('./reloadmeta');
var layerCarto = require('./carto');

describe('Layer', function () {
	this.slow(500);
	before(helpers.create_user);
	after(helpers.delete_user);

	layersDelete();
	layerCreate();
	layerUpdate();
	layerGet();
	layerMeta();
	layerCarto();
});
