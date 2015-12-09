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

        // temp status notifications
        status : {
            contact_requests : [String]
        },

        access : {

            // for reference
            account_type : { type: String, default: 'free' },

            // storage limits
            storage_quota : { type: Number, default: '200000000' }, // 200MB
            remaining_quota : { type: Number, default: '200000000' },

            // allowed private projects
            private_projects : { type: Boolean, default: true },

        },

        contact_list : [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

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

userSchema.methods.canCreatePrivateProject = function () {
    return this.access.private_projects;
};

userSchema.methods.getEmail = function () {
    return this.local.email;
};

userSchema.methods.isBot = function () {
    // return this.local.email == 'bot@systemapic.com' && this.access.account_type == 'bot';
    return this.local.email == 'bot@systemapic.com';
};
userSchema.methods.isSuper = function () {
    // return this.local.email == 'bot@systemapic.com' && this.access.account_type == 'bot';
    return this.access.account_type == 'super';
};

// timestamps plugin
userSchema.plugin(timestamps);    // adds created and lastUpdated fields automatically

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);