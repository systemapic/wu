// app/models/role.js

var mongoose = require('mongoose');
var timestamps = require('mongoose-times');

// define the schema for our project model
var roleSchema = mongoose.Schema({

	uuid 	: String,
	name    : String, // projectOwner, projectEditor, projectManager, etc.

	capabilities : {
		
		create_client 		: { type : Boolean, default : false },	
		read_client 		: { type : Boolean, default : false }, 	
		edit_client 		: { type : Boolean, default : false }, 	
		edit_other_client 	: { type : Boolean, default : false }, 	
		delete_client 		: { type : Boolean, default : false }, 	
		delete_other_client 	: { type : Boolean, default : false },  
		
		create_project 		: { type : Boolean, default : false }, 	
		read_project 		: { type : Boolean, default : false }, 	
		edit_project 		: { type : Boolean, default : false }, 	
		edit_other_project 	: { type : Boolean, default : false }, 	
		delete_project 		: { type : Boolean, default : false }, 	
		delete_other_project 	: { type : Boolean, default : false },
		
		upload_file 		: { type : Boolean, default : false }, 	
		download_file 		: { type : Boolean, default : false }, 	
		edit_file 		: { type : Boolean, default : false }, 	
		edit_other_file 	: { type : Boolean, default : false }, 	
		
		create_version 		: { type : Boolean, default : false }, 	
		delete_version 		: { type : Boolean, default : false }, 	
		delete_other_version 	: { type : Boolean, default : false },
		delete_file 		: { type : Boolean, default : false }, 	
		delete_other_file 	: { type : Boolean, default : false }, 	
			
		create_user 		: { type : Boolean, default : false }, 	
		edit_user 		: { type : Boolean, default : false }, 	
		edit_other_user 	: { type : Boolean, default : false }, 	
		delete_user 		: { type : Boolean, default : false }, 	
		delete_other_user 	: { type : Boolean, default : false }, 	
		
		share_project 		: { type : Boolean, default : false }, 	
		read_analytics 		: { type : Boolean, default : false }, 	
		manage_analytics	: { type : Boolean, default : false }, 	

		delegate_to_user 	: { type : Boolean, default : false }, 

		have_superpowers 	: { type : Boolean, default : false }, 

	},

	members : [String],

});

// timestamps plugin
roleSchema.plugin(timestamps);	// adds created and lastUpdated fields automatically

roleSchema.methods.isMember = function (user) {
	return (this.members.indexOf(user.uuid) >= 0)
};

// create the model for groups and expose it to our app
module.exports = mongoose.model('Role', roleSchema);