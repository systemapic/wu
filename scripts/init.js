// API: api.js

// database schemas
var Project 	 = require('../models/project');
var Clientel 	 = require('../models/client');	// weird name cause 'Client' is restricted name
var User  	 = require('../models/user');
var File 	 = require('../models/file');
var Layer 	 = require('../models/layer');
var Hash 	 = require('../models/hash');
var Role 	 = require('../models/role');
var Group 	 = require('../models/group');

// utils
var _ 		 = require('lodash');
var fs 		 = require('fs-extra');
var gm 		 = require('gm');
var kue 	 = require('kue');
var fss 	 = require("q-io/fs");
var zlib 	 = require('zlib');
var uuid 	 = require('node-uuid');
var util 	 = require('util');
var utf8 	 = require("utf8");
var mime 	 = require("mime");
var exec 	 = require('child_process').exec;
var dive 	 = require('dive');
var async 	 = require('async');
var carto 	 = require('carto');
var crypto       = require('crypto');
var colors 	 = require('colors');
var fspath 	 = require('path');
var mapnik 	 = require('mapnik');
var request 	 = require('request');
var nodepath     = require('path');
var formidable   = require('formidable');
var nodemailer   = require('nodemailer');
var uploadProgress  = require('node-upload-progress');
var mapnikOmnivore  = require('mapnik-omnivore');

// mongo
var mongoose = require('mongoose');



var prompt = require('prompt');

// config
var config  = require('../config/wu-config.js').serverConfig;

var global;



// connect to our database
mongoose.connect(config.mongo.url); 




logo_screen();
init_screen();
create_user();






function create_models() {
	if (!global) return err_exit();
	if (!global.email) return err_exit('Missing email!');

	var ops = [];

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
			print_info(msg);

			callback(null, user);
		});

		
	});

	// create super admin role
	ops.push(function (user, callback) {

		console.log('crataeing superadmin', user);

		var role = new Role();
		role.uuid = 'role-' + uuid.v4();
		role.name = 'Super Admin';
		role.members.push(user.uuid);
		role.slug = 'superAdmin';
		role.save(function (err, role) {
			

			for (var o in role.capabilities.toObject()) {
				role.capabilities[o] = true;
			}

			role.markModified('capabilities');
			console.log('saving?')
			role.save(function (err, role) {
				console.log('saved?', err, role);

				var msg = 'Add this Super Admin Role uuid to config.js: '.yellow + role.uuid;
				print_info(msg);

				callback(err);
			});
		});

		
	});

	// create portal admin role
	ops.push(function (callback) {

		var role = new Role();
		role.uuid = 'role-' + uuid.v4();
		role.name = 'Portal Admin';
		role.slug = 'portalAdmin';
		role.save(function (err, role) {
			// set all capabilities to true
			for (var o in role.capabilities.toObject()) {
				role.capabilities[o] = true;
			}

			// set super cow to false
			role.capabilities.have_superpowers = false;
			role.markModified('capabilities');
			role.save(function (err, role) {

				print_info('Add this Portal Admin Role uuid to config.js: '.yellow + role.uuid);

				callback(err);
			});
		});

	});


	async.waterfall(ops, function (err, result) {
		done('Big success');
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

function init_screen() {
	console.log('                           Systemapic Portal Init Script                          '.yellow);
	console.log('                     _________________________________________                    ');
	console.log('                                                                                  ');
	console.log('                                                                                  ');
	console.log('                                                                                  ');
	console.log('                          This script will do the following: '.yellow);
	console.log('');                     
	console.log('                             - create a User');
	console.log('                             - create a Super Admin Role');
	console.log('                               ↳  and add the User to it');
	console.log('                             - create a Portal Admin Role');
	console.log('');
	// console.log('                               That\'s all for now.'.yellow);
	console.log('');
	console.log('');
	console.log('');
	console.log('');
	console.log('');
	console.log('');

}

function create_user() {
	console.log('                      Create User'.green);
	console.log('                      ___________________');
	// console.log('');
	// console.log('');
	// console.log('        Need some details: '.cyan);

	console.log('');


	prompt.start();
	prompt.message = '';
	prompt.delimiter = '';
	prompt.get({
		properties: {
			firstName: {
				description: "                      Please enter first name:".yellow
			},
			lastName: {
				description: "                      Please enter last name:".yellow
			},
			email: {
				description: "                      Please enter email:".yellow
			},

		}
	}, confirm_input);

}

function confirm_input(err, result) {
	if (err) return err_exit();

	console.log('');
	console.log('');
	console.log('                      You entered: '.cyan, result);
	console.log('');
	console.log('');
	
	global = result;


	prompt.get({
		properties : {
			confirm : {
				description : '                      Does this look right? Write [yes] to go ahead and do errything'.yellow
			}
		}
	}, reconfirm_input)
}


function reconfirm_input(err, result) {
	if (err) return err_exit();
	if (result.confirm == 'yes') return init_portal();
	return err_exit();
}


function init_portal() {
	console.log('');
	console.log('');
	console.log('');
	console.log('');
	console.log('                     Initializing Systemapic Portal                          '.green);
	console.log('                     _________________________________________                    ');
	console.log('');
	console.log('');

	create_models();
}


function err_exit(err) {
	console.log('');
	console.log('');
	if (err) console.log('Error: '.red, err);
	console.log('');
	console.log('Cancelled!'.red, ' Nothing accomplished.'.white);
	console.log('');
	console.log('');
	process.exit();
}

function done(msg) {
	console.log('');
	console.log('                     All done!                         '.green);
	console.log('                     _________________________________________                    ');
	console.log('                    ',msg);
	console.log('');
	console.log('');
	process.exit();
}


function print_info(msg) {
	console.log(msg);
}