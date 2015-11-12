// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var timestamps = require('mongoose-times');

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
        invitedBy   : String,

        // tile server auth token
        token       : String,

        access_token : String,

        postgis_database : String,

        username : String,
        email : String,
        avatar : String,

        access : {

            // for reference
            account_type : { type: String, default: 'free' },

            // storage limits
            storage_quota : { type: Number, default: '200000000' },
            remaining_quota : { type: Number, default: '200000000' },

            // private projects (not available for free)
            private_projects : { type: Boolean, default: false },

        },

        files : [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }],

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
    console.log('password: ', password);
    var hashed = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    return hashed;
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

userSchema.methods.getUuid = function () {
    return this.uuid;
};

userSchema.methods.getName = function () {
    return this.firstName + ' ' + this.lastName;
};

// timestamps plugin
userSchema.plugin(timestamps);    // adds created and lastUpdated fields automatically

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);