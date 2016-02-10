var userUpdate = require('./update');
var userUnique = require('./unique');
var userUniqueName = require('./uniqueUsername');
var userInvite = require('./invite');
var userRequestContact = require('./requestContact');
var userGetInviteLink = require('./getInviteLink');
var userInviteToProject = require('./inviteToProjects');
var helpers = require('../helpers');

describe('User', function () {
    before(function(done) { helpers.create_user(done); });
    after(function(done) { helpers.delete_user(done); });

    userUpdate();
    userUnique();
    userUniqueName();
    userInvite();
    userRequestContact();
    userGetInviteLink();
    userInviteToProject();
});
