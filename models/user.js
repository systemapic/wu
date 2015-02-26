// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var timestamps = require('mongoose-times');

// property => group => role => capabilities + members

// define the schema for our user model
var userSchema = mongoose.Schema({

        uuid        : String,

        firstName   : String,
        lastName    : String,
        company     : String,
        position    : String,
        phone       : String,
        mobile      : String,
        createdBy   : String,

        // tile server auth token
        token       : String,

        role : {

                superadmin : { type: Boolean, default: false },

                admin      : { type: Boolean, default: false },

                manager : {
                        projects : [],
                        clients : []
                },

                editor : {
                        projects : [],
                        clients : []
                },

                reader : {
                        projects : [],
                        clients : []
                },

        },

        local : {
                email        : String,      // login name
                password     : String,
        },
        facebook : {
                id           : String,
                token        : String,
                email        : String,
                name         : String
        },
        twitter : {
                id           : String,
                token        : String,
                displayName  : String,
                username     : String
        },
        google : {
                id           : String,
                token        : String,
                email        : String,
                name         : String
        },
        // slack : {}
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

userSchema.methods.getUuid = function () {
    return this.uuid;
};

// timestamps plugin
userSchema.plugin(timestamps);    // adds created and lastUpdated fields automatically

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);