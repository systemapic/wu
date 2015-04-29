// app/models/portal.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var timestamps = require('mongoose-times');

// define the schema for our user model
var portalSchema = mongoose.Schema({

	uuid : String,

	roles : {
		portalAdmins : String,
		superAdmins : String
	},


      


});


// timestamps plugin
portalSchema.plugin(timestamps);    // adds created and lastUpdated fields automatically

// create the model for users and expose it to our app
module.exports = mongoose.model('Portal', portalSchema);