
// libs
var async    = require('async');
var colors   = require('colors');
var uuid     = require('node-uuid');
var mongoose = require('mongoose');
var _        = require('lodash');
var fs       = require('fs');
var prompt   = require('prompt');


// database schemas
var Project  = require('../models/project');
var Clientel = require('../models/client'); // weird name cause 'Client' is restricted name
var User     = require('../models/user');
var File     = require('../models/file');
var Layer    = require('../models/layer');
var Hash     = require('../models/hash');
var Role     = require('../models/role');
var Group    = require('../models/group');

// config
var config  = require('../../config/wu-config.js').serverConfig;

// connect to our database
mongoose.connect(config.mongo.url); 

// abort fn
function abort() {
    console.log('Aborted:', arguments);
    process.exit(1);
}


// args
var userEmail = process.argv[2];

if (!userEmail) {
    console.log('Usage: node make_super.js EMAIL'.yellow);
    abort();
}


User
.findOne({'local.email' : userEmail})
.exec(function (err, user) {
    if (err || !user) return abort('No such user', err);

    console.log('User found, email: ', user.local.email, '|', user.firstName, user.lastName);
    console.log('Is super?', user.access.super);

    prompt.get({
        properties : {
            confirm : {
                description : 'Does this look right? Write [yes] to go ahead and make user super'.yellow
            }
        }
    }, function (err, answer) {
        if (err || answer.confirm != 'yes') return abort();

        // mark super
        user.access.super = true;
    
        // save
        user.save(function (err) {
            if (err) return abort(err);

            // success
            console.log('User', user.local.email, 'is now super!');
            process.exit(0);
        });
    });

});
