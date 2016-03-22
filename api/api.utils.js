// API: api.utils.js

// database schemas
var Project 	= require('../models/project');
var Clientel 	= require('../models/client');	// weird name cause 'Client' is restricted name
var User  	= require('../models/user');
var File 	= require('../models/file');
var Layer 	= require('../models/layer');
var Hash 	= require('../models/hash');
var Role 	= require('../models/role');
var Group 	= require('../models/group');

// utils
var _ 		= require('lodash');
var fs 		= require('fs-extra');
var gm 		= require('gm');
var kue 	= require('kue');
var fss 	= require("q-io/fs");
var zlib 	= require('zlib');
var uuid 	= require('node-uuid');
var util 	= require('util');
var utf8 	= require("utf8");
var mime 	= require("mime");
var exec 	= require('child_process').exec;
var dive 	= require('dive');
var async 	= require('async');
var carto 	= require('carto');
var crypto      = require('crypto');
var fspath 	= require('path');
var mapnik 	= require('mapnik');
var request 	= require('request');
var nodepath    = require('path');
var formidable  = require('formidable');
var nodemailer  = require('nodemailer');
var uploadProgress = require('node-upload-progress');
var mapnikOmnivore = require('mapnik-omnivore');
var path = require('path');
var _ = require('lodash');

// api
var api = module.parent.exports;


function constantLoopFunctions () {
	setInterval(function () {

		// get stats on server
		api.utils.updateStatistics();
	
	}, 1000);
};

constantLoopFunctions();


// exports
module.exports = api.utils = { 

	parse : function (string) {
		try {
			var object = JSON.parse(string);	
		} catch (e) {
			var object = false;
		}
		return object;
	},

	stringify : function (obj) {
		try {
			var str = JSON.stringify(obj);	
		} catch (e) {
			var str = false;
		}
		return str;
	},

	updateStatistics : function () {

		// get stats
		STATS_SCRIPT_PATH = '../scripts/get_cpu_stats.sh'; // todo: put in config
		
		// create database in postgis
		exec(STATS_SCRIPT_PATH, {maxBuffer: 1024 * 50000}, function (err, stdin, stdout) {
			if (err) return;
			var cpu_usage = -1;
			try {
				var stdin_split = stdin.split('\n');
				var cpu_usage = parseFloat(stdin_split[1].split('   ')[2]);

			} catch (e) {}
			
			// save stats to redis
			api.redis.stats.lpush('server_stats', JSON.stringify({
				time : _.now(),
				cpu_usage : cpu_usage
			}));
		});
	},

	getRandomChars : function (len, charSet) {
		charSet = charSet || 'abcdefghijklmnopqrstuvwxyz';
		var randomString = '';
		for (var i = 0; i < len; i++) {
			var randomPoz = Math.floor(Math.random() * charSet.length);
			randomString += charSet.substring(randomPoz,randomPoz+1);
		}
		return randomString;
	},

	getRandom : function (len, charSet) {
		return api.utils.getRandomChars(len, charSet);
	},

	createNameSlug : function (name) {
		// strip everything but letters, numbers, !, ? and remove accents
		var slug = api.utils.stripAccents(name.replace(/[^\w\s!?]/g,'').toLowerCase());
		slug = slug.replace(/\s/g, '');
		console.log('slug: ', slug);
		return slug;
	},

	getRandomName : function () {
		return _.sample(api.utils.randomNames);
	},

	randomNames : [
		'Icesilver',
		'Merrowbarrow',
		'Hollowcastle',
		'Redwolf',
		'Lochbell',
		'Esterbridge',
		'Fayness',
		'Crystalshore',
		'Starryash',
		'Highley',
		'Shadowhill',
		'Magemarsh',
		'Lightbeach',
		'Butterwick',
		'Silverwynne',
		'Westgate',
		'Bellhall',
		'Orwall',
		'Starrycliff',
		'Greenmead',
		'Belden',
		'Goldflower',
		'Fairhill',
		'Raykeep',
		'Valport',
		'Wilderose',
		'Dorhill',
		'Beechhurst',
		'Corhollow',
		'Landcliff',
		'Seafield',
		'Woodspring',
		'Eastcrest',
		'Strongmist',
		'Oldshore',
		'Hollowfield',
		'Norview',
		'Summerbank',
		'Wayshore',
		'Ironwyn',
		'Northfay',
		'Coldcoast',
		'Brookhedge',
		'Westerbridge',
		'Violetwitch',
		'Northmage',
		'Linlake',
		'Woodham',
		'Violetport',
		'Westflower',
		'Deeplight',
		'Goldhollow',
		'Redfay',
		'Shadowcrest',
		'Swynland',
		'Mallowlyn',
		'Shadowshore',
		'Crystalwilde',
		'Mallowrose',
		'Eastspring',
		'Rosenesse',
		'Iceness',
		'Northbeach',
		'Dracwynne',
		'Merrimead',
		'Southhollow',
		'Esterway',
		'Greymist',
		'Roselea',
		'Wildemead',
		'Erifort',
		'Highmount',
		'Glassmarsh',
		'Glasslight',
		'Ashshore',
		'Glassholt',
		'Summerwater',
		'Buttercoast',
		'Brookden',
		'Belwald',
		'Janlea',
		'Grasslake',
		'Bykeep',
		'Springbarrow',
		'Glassmist',
		'Dellland',
		'Fairfalcon',
		'Greyhurst',
		'Westfay',
		'Byglass',
		'Valhollow',
		'Hedgecliff',
		'Redash',
		'Coldfog',
		'Highholt',
		'Edgeburn',
		'Woodmaple',
		'Marblewolf',
		'Snowwyn',
		'Cliffhall',
		'Highshore',
		'Brightholt',
		'Estercrystal',
		'Summerham',
		'Ashview',
		'Springwyn',
		'Maplehedge',
		'Maplehill',
		'Strongwood',
		'Lightglass',
		'Lightbay',
		'Elfland',
		'Buttervale',
		'Winterport',
		'Butterbridge',
		'Marblehollow',
		'Hedgelea',
		'Lormount',
		'Freybank',
		'Fairriver',
		'Meadowshore',
		'Belldell',
		'Cliffmeadow',
		'Meadowhedge',
		'Belmoor',
		'Oldland',
		'Maplecoast',
		'Blackshadow',
		'Aldham',
		'Blackwall',
		'Westerelf',
		'Lincastle',
		'Blackkeep',
		'Edgemoor',
		'Hollowbridge',
		'Westton',
		'Byport',
		'Merrowmeadow',
		'Faybarrow',
		'Esterflower',
		'Esterbell',
		'Deepkeep',
		'Corcastle',
		'Coldpine',
		'Highbeach',
		'Shadowsage',
		'Windbush',
		'Clearwater',
		'Lightby',
		'Swynwick',
		'Witchden',
		'Fallspring',
		'Edgebush',
		'Roseflower',
		'Brightmoor',
		'Brightbank',
		'Beachshore',
		'Faycastle',
		'Crystalwater',
		'Goldfog',
		'Bluehurst',
		'Wellcliff',
		'Lochwater',
		'Lightbridge',
		'Raypond',
		'Iceby',
		'Lightwald',
		'Silverhollow',
		'Bluemount',
		'Coastbourne',
		'Snowfort',
		'Redmerrow',
		'Violetham',
		'Snowshore',
		'Southwheat',
		'Iceley',
		'Greygrass',
		'Roseacre',
		'Fogmarsh',
		'Morwald',
		'Orfort',
		'Courtedge',
		'Westmill',
		'Woodice',
		'Bluedale',
		'Springburn',
		'Corbank',
		'Rosemill',
		'Butterbush',
		'Rosebridge',
		'Icenesse',
		'Shorebarrow',
		'Marblehaven',
		'Redby',
		'Aldbay',
		'Corhill',
		'Summerloch',
		'Hollowvale',
		'Northmarsh',
		'Greenfield',
		'Clearbridge',
		'Marblehedge',
		'Ironoak',
		'Whiteland',
		'Flowerhollow',
		'Landpond',
		'Violetpond',
		'Icegrass',
		'Highmage',
		'Lochmoor',
		'Westloch',
		'Summerwheat',
		'Moorlake',
		'Ostbush',
		'Lakemill',
		'Swynfort',
		'Wellbeach',
		'Northhaven',
		'Icegriffin',
		'Brighthaven',
		'Whitegrass',
		'Mallowwick',
		'Bellake',
		'Millmeadow',
		'Westerbarrow',
		'Strongspring',
		'Summerhaven',
		'Swynham',
		'Springwolf',
		'Aldwynne',
		'Summerriver',
		'Deepcastle',
		'Woodwinter',
		'Fieldnesse',
		'Clearden',
		'Marblesilver',
		'Aldfair',
		'Bluewall',
		'Verttown',
		'Aldbourne',
		'Winterway',
		'Merricliff',
		'Faybay',
		'Redcrest',
		'Coldcastle',
		'Wayshore',
		'Ironwyn',
		'Northfay',
		'Coldcoast',
		'Brookhedge',
		'Westerbridge'
	],

	stripAccents : function (str) {
		/**
		* Normalise a string replacing foreign characters
		*
		* @param {String} str
		* @return {String}
		* @private
		*/

		var map = {
			"À": "A",
			"Á": "A",
			"Â": "A",
			"Ã": "A",
			"Ä": "A",
			"Å": "A",
			"Æ": "AE",
			"Ç": "C",
			"È": "E",
			"É": "E",
			"Ê": "E",
			"Ë": "E",
			"Ì": "I",
			"Í": "I",
			"Î": "I",
			"Ï": "I",
			"Ð": "D",
			"Ñ": "N",
			"Ò": "O",
			"Ó": "O",
			"Ô": "O",
			"Õ": "O",
			"Ö": "O",
			"Ø": "O",
			"Ù": "U",
			"Ú": "U",
			"Û": "U",
			"Ü": "U",
			"Ý": "Y",
			"ß": "s",
			"à": "a",
			"á": "a",
			"â": "a",
			"ã": "a",
			"ä": "a",
			"å": "a",
			"æ": "ae",
			"ç": "c",
			"è": "e",
			"é": "e",
			"ê": "e",
			"ë": "e",
			"ì": "i",
			"í": "i",
			"î": "i",
			"ï": "i",
			"ñ": "n",
			"ò": "o",
			"ó": "o",
			"ô": "o",
			"õ": "o",
			"ö": "o",
			"ø": "o",
			"ù": "u",
			"ú": "u",
			"û": "u",
			"ü": "u",
			"ý": "y",
			"ÿ": "y",
			"Ā": "A",
			"ā": "a",
			"Ă": "A",
			"ă": "a",
			"Ą": "A",
			"ą": "a",
			"Ć": "C",
			"ć": "c",
			"Ĉ": "C",
			"ĉ": "c",
			"Ċ": "C",
			"ċ": "c",
			"Č": "C",
			"č": "c",
			"Ď": "D",
			"ď": "d",
			"Đ": "D",
			"đ": "d",
			"Ē": "E",
			"ē": "e",
			"Ĕ": "E",
			"ĕ": "e",
			"Ė": "E",
			"ė": "e",
			"Ę": "E",
			"ę": "e",
			"Ě": "E",
			"ě": "e",
			"Ĝ": "G",
			"ĝ": "g",
			"Ğ": "G",
			"ğ": "g",
			"Ġ": "G",
			"ġ": "g",
			"Ģ": "G",
			"ģ": "g",
			"Ĥ": "H",
			"ĥ": "h",
			"Ħ": "H",
			"ħ": "h",
			"Ĩ": "I",
			"ĩ": "i",
			"Ī": "I",
			"ī": "i",
			"Ĭ": "I",
			"ĭ": "i",
			"Į": "I",
			"į": "i",
			"İ": "I",
			"ı": "i",
			"Ĳ": "IJ",
			"ĳ": "ij",
			"Ĵ": "J",
			"ĵ": "j",
			"Ķ": "K",
			"ķ": "k",
			"Ĺ": "L",
			"ĺ": "l",
			"Ļ": "L",
			"ļ": "l",
			"Ľ": "L",
			"ľ": "l",
			"Ŀ": "L",
			"ŀ": "l",
			"Ł": "l",
			"ł": "l",
			"Ń": "N",
			"ń": "n",
			"Ņ": "N",
			"ņ": "n",
			"Ň": "N",
			"ň": "n",
			"ŉ": "n",
			"Ō": "O",
			"ō": "o",
			"Ŏ": "O",
			"ŏ": "o",
			"Ő": "O",
			"ő": "o",
			"Œ": "OE",
			"œ": "oe",
			"Ŕ": "R",
			"ŕ": "r",
			"Ŗ": "R",
			"ŗ": "r",
			"Ř": "R",
			"ř": "r",
			"Ś": "S",
			"ś": "s",
			"Ŝ": "S",
			"ŝ": "s",
			"Ş": "S",
			"ş": "s",
			"Š": "S",
			"š": "s",
			"Ţ": "T",
			"ţ": "t",
			"Ť": "T",
			"ť": "t",
			"Ŧ": "T",
			"ŧ": "t",
			"Ũ": "U",
			"ũ": "u",
			"Ū": "U",
			"ū": "u",
			"Ŭ": "U",
			"ŭ": "u",
			"Ů": "U",
			"ů": "u",
			"Ű": "U",
			"ű": "u",
			"Ų": "U",
			"ų": "u",
			"Ŵ": "W",
			"ŵ": "w",
			"Ŷ": "Y",
			"ŷ": "y",
			"Ÿ": "Y",
			"Ź": "Z",
			"ź": "z",
			"Ż": "Z",
			"ż": "z",
			"Ž": "Z",
			"ž": "z",
			"ſ": "s",
			"ƒ": "f",
			"Ơ": "O",
			"ơ": "o",
			"Ư": "U",
			"ư": "u",
			"Ǎ": "A",
			"ǎ": "a",
			"Ǐ": "I",
			"ǐ": "i",
			"Ǒ": "O",
			"ǒ": "o",
			"Ǔ": "U",
			"ǔ": "u",
			"Ǖ": "U",
			"ǖ": "u",
			"Ǘ": "U",
			"ǘ": "u",
			"Ǚ": "U",
			"ǚ": "u",
			"Ǜ": "U",
			"ǜ": "u",
			"Ǻ": "A",
			"ǻ": "a",
			"Ǽ": "AE",
			"ǽ": "ae",
			"Ǿ": "O",
			"ǿ": "o"
		};

		var nonWord = /\W/g;

		var mapping = function (c) {
			return map[c] || c; 
		};
		
		return str.replace(nonWord, mapping);
	},

	prettyDate : function(date, compareTo){
		/*
		 * Javascript Humane Dates
		 * Copyright (c) 2008 Dean Landolt (deanlandolt.com)
		 * Re-write by Zach Leatherman (zachleat.com)
		 * Refactor by Chris Pearce (github.com/Chrisui)
		 *
		 * Adopted from the John Resig's pretty.js
		 * at http://ejohn.org/blog/javascript-pretty-date
		 * and henrah's proposed modification
		 * at http://ejohn.org/blog/javascript-pretty-date/#comment-297458
		 *
		 * Licensed under the MIT license.
		 * @private
		*/

		function normalize(val, single)
		{
			var margin = 0.1;
			if(val >= single && val <= single * (1+margin)) {
				return single;
			}
			return val;
		}

		if(!date) {
			return;
		}

		var lang = {
			ago: 'Ago',
			from: '',
			now: 'Just Now',
			minute: 'Minute',
			minutes: 'Minutes',
			hour: 'Hour',
			hours: 'Hours',
			day: 'Day',
			days: 'Days',
			week: 'Week',
			weeks: 'Weeks',
			month: 'Month',
			months: 'Months',
			year: 'Year',
			years: 'Years'
		},
		formats = [
			[60, lang.now],
			[3600, lang.minute, lang.minutes, 60], // 60 minutes, 1 minute
			[86400, lang.hour, lang.hours, 3600], // 24 hours, 1 hour
			[604800, lang.day, lang.days, 86400], // 7 days, 1 day
			[2628000, lang.week, lang.weeks, 604800], // ~1 month, 1 week
			[31536000, lang.month, lang.months, 2628000], // 1 year, ~1 month
			[Infinity, lang.year, lang.years, 31536000] // Infinity, 1 year
		];

		var isString = typeof date == 'string',
			date = isString ?
						new Date(('' + date).replace(/-/g,"/").replace(/T|(?:\.\d+)?Z/g," ")) :
						date,
			compareTo = compareTo || new Date,
			seconds = (compareTo - date +
							(compareTo.getTimezoneOffset() -
								// if we received a GMT time from a string, doesn't include time zone bias
								// if we got a date object, the time zone is built in, we need to remove it.
								(isString ? 0 : date.getTimezoneOffset())
							) * 60000
						) / 1000,
			token;

		if(seconds < 0) {
			seconds = Math.abs(seconds);
			token = lang.from ? ' ' + lang.from : '';
		} else {
			token = lang.ago ? ' ' + lang.ago : '';
		}

		for(var i = 0, format = formats[0]; formats[i]; format = formats[++i]) {
			if(seconds < format[0]) {
				if(i === 0) {
					// Now
					return format[1];
				}

				var val = Math.ceil(normalize(seconds, format[3]) / (format[3]));
				return val +
						' ' +
						(val != 1 ? format[2] : format[1]) +
						(i > 0 ? token : '');
			}
		}
	},

	preRenderLogos : function () {

		// logo
		if (api && api.clientConfig && api.clientConfig.logos && api.clientConfig.logos.clientLogo && api.clientConfig.logos.clientLogo.backgroundImage && _.isString(api.clientConfig.logos.clientLogo.backgroundImage)) {
			var base64Data = api.clientConfig.logos.clientLogo.backgroundImage.replace(/^url\(\'data:image\/png;base64,/, "").replace(/\'\)/, "");
			fs.writeFile(path.resolve(__dirname, '../public/images/portal-logo.png'), base64Data, 'base64', function (err) {
				if (err) {
					console.log("Error creating portal-logo.png!");
				}

			});
		}

		// favicon
		if (api && api.clientConfig && api.clientConfig.logos && api.clientConfig.logos.favicon && _.isString(api.clientConfig.logos.favicon)) {
			var base64Data = api.clientConfig.logos.favicon.replace(/^url\(\'data:image\/png;base64,/, "").replace(/\'\)/, "");
			fs.writeFile(path.resolve(__dirname, '../public/images/favicon.ico'), base64Data, 'base64', function (err) {
				if (err) {
					console.log("Error creating favicon.ico!");
				}

			});
		}
	}
};

