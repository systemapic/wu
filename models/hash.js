// app/models/hash.js
// load the things we need
var mongoose = require('mongoose');
var timestamps = require('mongoose-times');

// define the schema for our project model
var hashSchema = mongoose.Schema({

	uuid 	: String,
	id 	: String,
	project : String, // project uuid
	createdBy : String,
	createdByName : String,

	position : {
		lat : String,
		lng : String,
		zoom : String
	},

	layers : [String]

});

// timestamps plugin
hashSchema.plugin(timestamps);	// adds created and lastUpdated fields automatically

// create the model for users and expose it to our app
module.exports = mongoose.model('Hash', hashSchema);