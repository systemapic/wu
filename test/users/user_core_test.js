var userUpdate = require('./update');
var userUniqueEmail = require('./uniqueEmail');
var userUniqueUsername = require('./uniqueUsername');
var userInvite = require('./invite');
var userRequestContact = require('./requestContact');
var userGetInviteLink = require('./getInviteLink');
var userInviteToProject = require('./inviteToProjects');
var userResetPassword = require('./resetPassword');
var userSetPassword = require('./setPassword');
var userToken = require('./token');
var userTokenCheck = require('./tokenCheck');
var userTokenRefresh = require('./tokenRefresh');
var helpers = require('../helpers');

describe('User', function () {
    before(helpers.create_user);
    after(helpers.delete_user);
    this.slow(500);

    userUpdate();
    userUniqueEmail();
    userUniqueUsername();
    userInvite();
    userRequestContact();
    userGetInviteLink();
    userInviteToProject();
    userResetPassword();
    userSetPassword();
    userToken();
    userTokenRefresh();
    userTokenCheck();
});
