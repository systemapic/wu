// app/models/project.js

// load the things we need
var mongoose = require('mongoose');
var timestamps = require('mongoose-times');
var _ = require('lodash');


// define the schema for our project model
var projectSchema = mongoose.Schema({

	uuid 		: String,
	createdBy 	: String,
	createdByName   : String,
	createdByUsername   : String,
	name 		: { type: String, default: 'Project name' },
	slug 		: { type: String, default: 'projectslug' },
	description 	: { type: String, default: 'Description' },
	keywords 	: [{ type: String, default: '' }],
	categories 	: [String],

	// access_v2
	access 		: {
		read : [String],	 // hashed user_uuid's
		edit : [String],
		options : {
			share 	 : { type: Boolean, default: true },
			download : { type: Boolean, default: false },
			isPublic : { type: Boolean, default: false }
		}
	},

	roles 		: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }],

			// image
	logo		: String, 

	thumbCreated 	: Boolean,

			// css string for colorTheme of project
	colorTheme 	: String,

			// client that owns project
	// client 		: String, 

			// all files connected to project
	files 		: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }],

			// all available layers connected to project
	layers 		: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Layer' }],	

	collections : [{
		files : [String], // file ObjectId's or uuid's
		title : String,
		description : String,
	}],

	connectedAccounts : {
		mapbox  : [{
			username : String,
			accessToken : String
		}],
		cartodb : [String]
	},

	// active baselayers
	baseLayers : [{
		uuid 	: String, 	// layer uuid
		zIndex 	: { type: Number, default: '1' },
		opacity : { type : Number, default: '1'}
	}],

	bounds : {
		northEast : {
			lat : { type: String, default: '90' },
			lng : { type: String, default: '180' },
		},
		southWest : {
			lat : { type: String, default: '-90' },
			lng : { type: String, default: '-180' },
		},
		minZoom : { type: String, default: '1' },
		maxZoom : { type: String, default: '20' },
	},
	
	// map initial position
	position : {
		lat  : { type: String, default: '0' }, 	// JSON, { lat: 44, lng: 44, zoom: 4}
		lng  : { type: String, default: '0' },
		zoom : { type: String, default: '2' }
	},

	// layermenu for project
	layermenu : [{
		uuid 	: String, // layermenu item uuid
		layer   : String, // layer uuid or _id
		caption : String, // caption/title in layermenu
		pos     : String, // position in menu
		zIndex  : String,
		opacity : String,
		folder  : { type: Boolean, default: false },
		enabled	: { type: Boolean, default: false }, // on by default
	}],	

	// folders in documents pane, incl. content in html
	folders : [{
		uuid    : String,
		title   : String,
		content : String
	}],

	// header of project/map
	header : {
		logo 	 : { type: String, default: '' },
		title 	 : { type: String, default: 'New title' },
		subtitle : { type: String, default: 'New subtitle' },
		height	 : { type: String, default: '100' },
		css 	 : { type: String, default: '' }
	},

	// controls in map
	controls : {
		zoom 		: { type: Boolean, default: true  },
		measure 	: { type: Boolean, default: true  },
		description 	: { type: Boolean, default: true  },
		mouseposition 	: { type: Boolean, default: true  },
		layermenu 	: { type: Boolean, default: true  },
		draw 		: { type: Boolean, default: true  },
		legends 	: { type: Boolean, default: false },
		inspect 	: { type: Boolean, default: false },
		geolocation 	: { type: Boolean, default: false },
		vectorstyle 	: { type: Boolean, default: false },
		baselayertoggle : { type: Boolean, default: true },
		cartocss 	: { type: Boolean, default: false }
	},

	settings : {
		screenshot 	: { type: Boolean, default: true },
		socialSharing 	: { type: Boolean, default: true },
		documentsPane 	: { type: Boolean, default: true },
		dataLibrary 	: { type: Boolean, default: true },
		saveState	: { type: Boolean, default: false },
		autoHelp 	: { type: Boolean, default: false },
		autoAbout 	: { type: Boolean, default: false },
		darkTheme 	: { type: Boolean, default: false },
		tooltips 	: { type: Boolean, default: false },
		mediaLibrary 	: { type: Boolean, default: false },
		mapboxGL	: { type: Boolean, default: false },
		d3popup		: { type: Boolean, default: false },
	},

	state : String,

	pending : [String],
	
});

projectSchema.methods.isPublic = function () {
    return this.access.options.isPublic;
};
projectSchema.methods.isShareable = function () {
    return this.access.options.share;
};
projectSchema.methods.isDownloadable = function () {
    return this.access.options.download;
};
projectSchema.methods.isEditable = function (user_uuid) {
    return _.contains(this.access.edit, user_uuid) || this.createdBy == user_uuid;
};
projectSchema.methods.getUuid = function (user_uuid) {
    return this.uuid;
};


// timestamps plugin
projectSchema.plugin(timestamps);	// adds created and lastUpdated fields automatically

// create the model for users and expose it to our app
module.exports = mongoose.model('Project', projectSchema);
// // app/models/project.js

// // load the things we need
// var mongoose = require('mongoose');
// var timestamps = require('mongoose-times');

// // define the schema for our project model
// var projectSchema = mongoose.Schema({

// 	uuid 		: String,
// 	createdBy 	: String,
// 	createdByName   : String,
// 	name 		: { type: String, default: 'Project name' },
// 	slug 		: { type: String, default: 'projectslug' },
// 	description 	: { type: String, default: 'Description' },
// 	keywords 	: [{ type: String, default: '' }],
// 	categories 	: [String],

// 	roles 		: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }],

// 			// image
// 	logo		: String, 

// 	thumbCreated 	: Boolean,

// 			// css string for colorTheme of project
// 	colorTheme 	: String,

// 			// client that owns project
// 	client 		: String, 

// 			// all files connected to project
// 	files 		: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }],

// 			// all available layers connected to project
// 	layers 		: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Layer' }],	

// 	collections : [{
// 		files : [String], // file ObjectId's or uuid's
// 		title : String,
// 		description : String,
// 	}],

// 	connectedAccounts : {
// 		mapbox  : [{
// 			username : String,
// 			accessToken : String
// 		}],
// 		cartodb : [String]
// 	},

// 	// active baselayers
// 	baseLayers : [{
// 		uuid 	: String, 	// layer uuid
// 		zIndex 	: { type: Number, default: '1' },
// 		opacity : { type : Number, default: '1'}
// 	}],

// 	bounds : {
// 		northEast : {
// 			lat : String,
// 			lng : String
// 		},
// 		southWest : {
// 			lat : String,
// 			lng : String
// 		},
// 		minZoom : String,
// 		maxZoom : String
// 	},
	
// 	// map initial position
// 	position : {
// 		lat  : { type: String, default: '0' }, 	// JSON, { lat: 44, lng: 44, zoom: 4}
// 		lng  : { type: String, default: '0' },
// 		zoom : { type: String, default: '2' }
// 	},

// 	// layermenu for project
// 	layermenu : [{
// 		uuid 	: String, // layermenu item uuid
// 		layer   : String, // layer uuid or _id
// 		caption : String, // caption/title in layermenu
// 		pos     : String, // position in menu
// 		zIndex  : String,
// 		opacity : String,
// 		folder  : { type: Boolean, default: false },
// 		enabled	: { type: Boolean, default: false }, // on by default
// 	}],	

// 	// folders in documents pane, incl. content in html
// 	folders : [
// 		{
// 			uuid    : String,
// 			title   : String,
// 			content : String
// 		}
// 	],

// 	// header of project/map
// 	header : {
// 		logo 	 : { type: String, default: '' },
// 		title 	 : { type: String, default: 'New title' },
// 		subtitle : { type: String, default: 'New subtitle' },
// 		height	 : { type: String, default: '100' },
// 		css 	 : { type: String, default: '' }
// 	},

// 	// controls in map
// 	controls : {
// 		zoom 		: { type: Boolean, default: true  },
// 		measure 	: { type: Boolean, default: true  },
// 		description 	: { type: Boolean, default: true  },
// 		mouseposition 	: { type: Boolean, default: true  },
// 		layermenu 	: { type: Boolean, default: true  },
// 		draw 		: { type: Boolean, default: true  },
// 		legends 	: { type: Boolean, default: false },
// 		inspect 	: { type: Boolean, default: false },
// 		geolocation 	: { type: Boolean, default: false },
// 		vectorstyle 	: { type: Boolean, default: false },
// 		baselayertoggle : { type: Boolean, default: false },
// 		cartocss 	: { type: Boolean, default: false }
// 	},

// 	settings : {
// 		screenshot 	: { type: Boolean, default: true },
// 		socialSharing 	: { type: Boolean, default: true },
// 		documentsPane 	: { type: Boolean, default: true },
// 		dataLibrary 	: { type: Boolean, default: true },
// 		saveState	: { type: Boolean, default: false },
// 		autoHelp 	: { type: Boolean, default: false },
// 		autoAbout 	: { type: Boolean, default: false },
// 		darkTheme 	: { type: Boolean, default: false },
// 		tooltips 	: { type: Boolean, default: false },
// 		mediaLibrary 	: { type: Boolean, default: false },
// 		mapboxGL	: { type: Boolean, default: false },
// 		d3popup		: { type: Boolean, default: false },
// 	},

// 	// 
// 	state : String,

// 	pending : [String],
	
// });

// // timestamps plugin
// projectSchema.plugin(timestamps);	// adds created and lastUpdated fields automatically

// // create the model for users and expose it to our app
// module.exports = mongoose.model('Project', projectSchema);
