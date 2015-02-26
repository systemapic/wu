// app/models/project.js
// load the things we need
var mongoose = require('mongoose');
var timestamps = require('mongoose-times');

// define the schema for our project model
var clientSchema = mongoose.Schema({

	uuid 		: String,
	createdBy 	: String,
	createdByName   : String,
	logo		: String,
	name 		: {  type: String,  default: 'Client name' },
	slug 		: {  type: String,  default: 'clientslug'  },
	description 	: {  type: String,  default: 'Description' },
	public 		: {  type: Boolean, default: false},

	// roles     : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }],
	
});

// timestamps plugin
clientSchema.plugin(timestamps);	// adds created and lastUpdated fields automatically

// create the model for users and expose it to our app
module.exports = mongoose.model('Client', clientSchema);
