// one JSON from one USER
// ----------------------
// contains all that is in App, based on that USER's access
// 

module.exports = {

	user : {
		// read-only
		email 	: 'test@jest.com',
		name 	: 'loka'

	},

	projects : [{	// array of projects

		header : {

		},

		map : {

		},

		selectors : {

		},

		documents : {

		},

		downloads : {

		},

		// only if editor of project, not consumers
		settings : {

			privacy : {

				open_to_public : false,		// if public map, or subject to access restrictions
				access_list : [		// names of users with access to project

					{ name : 'loka', avatar : 'png', email : 'loka@joka.com' },
					{ name : 'moka', avatar : 'jpg', email : 'jooka@rooka.com' }

				]
			}
		}

	}],	// array of one or several projects

	clients : { 	// clients that belong to this user



	}
	
}



