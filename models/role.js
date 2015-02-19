// app/models/role.js
// load the things we need
var mongoose = require('mongoose');
var timestamps = require('mongoose-times');

// define the schema for our project model
var roleSchema = mongoose.Schema({

	uuid 	: String,
	name    : String, // projectOwner, projectEditor, projectManager, etc.

	capabilities : [String],

	members : [String],

});

// timestamps plugin
roleSchema.plugin(timestamps);	// adds created and lastUpdated fields automatically

// create the model for groups and expose it to our app
module.exports = mongoose.model('Role', roleSchema);