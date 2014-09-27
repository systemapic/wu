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

        // access  : {                             // access only for projects/clients. files are attached to project OR to user through createdBy
        //                                         // users are attached to client. if adding to second client, manager will get prompt to invite.


        //         projects : {
        //                 read    : [String], // can read
        //                 write   : [String], // can write
        //                 manage  : [String], // can add read permission to users for project
        //                 admin   : [String], // can add read/write/manage permission to users for project, can remove project
                       
        //                 create  : Boolean,  // can create new project
        //                 remove  : Boolean   // can remove projects (todo: move to admin list)
        //         },

        //         clients : {
        //                 read    : [String],
        //                 write   : [String],                             // those who can write a client are Admins of that client
        //                 manage  : [String],  // todo: remove            // those who can manage a client are Managers of that client.. 
        //                 admin   : [String],  
                       
        //                 create  : Boolean,                              // users can only be edited by self or manager that created the user.
        //                 remove  : Boolean
        //         },

        // },


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
        }
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

// timestamps plugin
userSchema.plugin(timestamps);    // adds created and lastUpdated fields automatically

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);