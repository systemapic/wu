// app/models/groups.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var timestamps = require('mongoose-times');

// define the schema for our user model
var groupSchema = mongoose.Schema({
        uuid	: String,
        name 	: String,
        users   : [String],
});


// timestamps plugin
groupSchema.plugin(timestamps);    // adds created and lastUpdated fields automatically

// create the model for users and expose it to our app
module.exports = mongoose.model('Group', groupSchema);