////
// init script for fresh mongo db 
//

// libs
var async 	 = require('async');
var colors 	 = require('colors');
var crypto       = require('crypto');
var uuid 	 = require('node-uuid');
var mongoose 	 = require('mongoose');
var _ 		 = require('lodash-node');
var fs 		 = require('fs');

// database schemas
var Project 	 = require('../models/project');
var Clientel 	 = require('../models/client');	// weird name cause 'Client' is restricted name
var User  	 = require('../models/user');
var File 	 = require('../models/file');
var Layer 	 = require('../models/layer');
var Hash 	 = require('../models/hash');
var Role 	 = require('../models/role');
var Group 	 = require('../models/group');

// config
var config  = require('../config/server-config.js');

// connect to our database
mongoose.connect(config.mongo.url); 

var global = {
	email : 'info@systemapic.com',
	firstName : 'Systemapic',
	lastName : 'Superadmin',
}

logo_screen();
create_models();


function flush_models(done) {
	var ops = [];

	// delete all users
	ops.push(function (callback) {
		User.remove({}, function (err) {
			console.log('flushed all users!!!');
			callback();
		})
	})
	ops.push(function (callback) {
		Project.remove({}, function (err) {
			console.log('flushed all users!!!');
			callback();
		})
	})
	ops.push(function (callback) {
		Clientel.remove({}, function (err) {
			console.log('flushed all users!!!');
			callback();
		})

	})
	ops.push(function (callback) {
		File.remove({}, function (err) {
			console.log('flushed all users!!!');
			callback();
		})

	})
	ops.push(function (callback) {
		Layer.remove({}, function (err) {
			console.log('flushed all users!!!');
			callback();
		})

	})
	ops.push(function (callback) {
		Role.remove({}, function (err) {
			console.log('flushed all users!!!');
			callback();
		})

	})
	ops.push(function (callback) {
		Hash.remove({}, function (err) {
			console.log('flushed all users!!!');
			callback();
		})

	})
	ops.push(function (callback) {
		Group.remove({}, function (err) {
			console.log('flushed all users!!!');
			callback();
		})

	})

	async.series(ops, function (err, res){
		console.log('all flushed!');
		done();
	});
}

function create_models() {

	var ops = [];

	// flush mongo
	ops.push(flush_models);

	// create user
	ops.push(function (callback) {
		var userUuid = 'user-' + uuid.v4();

		var user            	= new User();
		var password 		= crypto.randomBytes(16).toString('hex');
		user.uuid 		= userUuid;
		user.local.email    	= global.email;	
		user.local.password 	= user.generateHash(password);
		user.firstName 		= global.firstName;
		user.lastName 		= global.lastName;
		user.createdBy		= userUuid;

		user.save(function (err, user) {

			var msg = 'Log in with email '.yellow + user.local.email + ' and password: '.yellow + password;
			console.log(msg);

			console.log(user);

			callback(null, user);
		});

		
	});

	// create super admin role
	ops.push(function (user, callback) {

		var role = new Role();
		role.uuid = 'role-' + uuid.v4();
		role.name = 'Super Admin';
		role.members.push(user.uuid);
		role.slug = 'superAdmin';
		role.save(function (err, role) {
			// set all capabilities to true
			_.each(role.capabilities, function (cap, key) {
				role.capabilities[key] = true;
			})
			role.markModified('capabilities');
			role.save(function (err, role) {

				var msg = 'Add this Super Admin Role uuid to config.js: '.yellow + role.uuid;
				console.log(msg);

				callback(err, role.uuid);
			});
		});

		
	});

	// create portal admin role
	ops.push(function (superAdminRole, callback) {

		var role = new Role();
		role.uuid = 'role-' + uuid.v4();
		role.name = 'Portal Admin';
		role.slug = 'portalAdmin';
		role.save(function (err, role) {
			// set all capabilities to true
			_.each(role.capabilities, function (cap, key) {
				role.capabilities[key] = true;
			});

			// set super cow to false
			role.capabilities.have_superpowers = false;
			role.markModified('capabilities');
			role.save(function (err, role) {

				console.log('Add this Portal Admin Role uuid to config.js: '.yellow + role.uuid);

				var admins = {
					duper : superAdminRole,
					portal : role.uuid
				}

				callback(err, admins);
			});
		});

	});


	async.waterfall(ops, function (err, admins) {
		console.log('all done!');


		var configFile = require('./server-config.js');

		// console.log('foncif', configFile, typeof(configFile));

		configFile.portal.roles.superAdmin = admins.duper;
		configFile.portal.roles.portalAdmin = admins.portal;

		var text = JSON.stringify(configFile, null, '\t');
		var output = 'module.exports = ' + text;

		console.log('output', output);

		fs.writeFile('./server-config.js', output, function (err) {
			console.log('wrote config', err);

		});

	});


}







function logo_screen() {


	console.log('\033[2J');
	console.log('                                                                                  '.white);
	console.log('                                  .d7ONMMMMMNOM7b.                                 '.white);
	console.log('                            $MMMMMMMMMMMMMMMNMMMMMMMMM$,                          '.white);
	console.log('                        ZMN8OMMMMMMMMMMMMMMMMMMMNMMMN8,DMM8                       '.white);
	console.log('                     DMM~   MMNMMMNNMMMMMMMMMMMNMMMMMM    :MMD                    '.white);
	console.log('                   MM?   ~MMMMMMMMMMMMMMMMMMMMMMMMMMMMMM8    ?MM.                 '.white);
	console.log('                 MM?   MMMMMMMMNMMMMMMMMMMMNMNMMMMMMMMMMMMM?   +MM                '.white);
	console.log('               7MM     MMMMMNMMMNMMDMMMMMMMDNMMMMMMMMMMMMMMN     NMN              '.white);
	console.log('              DMZ        ~MMMMMM       MMMM?      MMMMMMM          MD             '.white);
	console.log('             7N8            NMM        MMMM        MMMM            ?M?            '.white);
	console.log('             NN                    $DMMMMMMMM~                      MM            '.white);
	console.log('             M8                   MNMMMMMMMMMMMM7                   ZM            '.white);
	console.log('             M7                     MMMMMMMMMM8                     ?N            '.white);
	console.log('             MD                        MMMMM                        ZN            '.white);
	console.log('             MM                          Z                          ND            '.white);
	console.log('              MN         OMMD7        ~NMMMD        ?MMMMZ         Z8             '.white);
	console.log('              IMN      IDNMMMD8     NMMMMMMMMMO....NMMMNNNN       ZD?             '.white);
	console.log('                MM      DDMNMN8NN8NDMMMMMMMMMMMNMNMMMMNDND       D8?              '.white);
	console.log('                 MMO        IMNNNNNNNNNMNNMNMNMMMMMNDD         $8D                '.white);
	console.log('                   NNO      $DNNNDNNNNNNDNNMMMMMMMMMNN:      $8D                  '.white);
	console.log('                     $MM7.NNDNNNDN8ONNDNDDNMMMMMMMMMND8DD.+NN$                    '.white);
	console.log('                        ~NDDNNDNDDDDDNDNN8DMMMMMMMMMMNMNDD+                       '.white);
	console.log('                            :8MNNMNMNDNN8DNMMMMNNNMDMO:                           '.white);
	console.log('                                   ...BYNØRDBIZ...                                '.white);
	console.log('                                                                                  ');
	console.log('                                                                                  ');
	console.log('                                                                                  ');
}

