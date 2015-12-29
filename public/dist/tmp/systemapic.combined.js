// The MIT License (MIT)

// Copyright (c) 2014 Vladimir Agafonkin. Original: https://github.com/Leaflet/Leaflet/tree/master/src/core
// Copyright (c) 2014 @kosjoli           

// access is hereby granted, free of charge, to any person obtaining a copy of
// this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to
// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
// the Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:

// The above copyright notice and this access notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
// IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


// _____class.js___________________________________________________________________ 
// Taken from Class.js in Leaflet.js by Vladimir Agafonkin, @LeafletJS

Wu = {};
Wu.Class = function () {};
Wu.Class.extend = function (props) {

	// extended class with the new prototype
	var NewClass = function () {

		// call the constructor
		if (this.initialize) {
			this.initialize.apply(this, arguments);
		}

		// call all constructor hooks
		if (this._initHooks.length) {
			this.callInitHooks();
		}
	};

	// jshint camelcase: false
	var parentProto = NewClass.__super__ = this.prototype;

	var proto = Wu.Util.create(parentProto);
	proto.constructor = NewClass;

	NewClass.prototype = proto;

	//inherit parent's statics
	for (var i in this) {
		if (this.hasOwnProperty(i) && i !== 'prototype') {
			NewClass[i] = this[i];
		}
	}

	// mix static properties into the class
	if (props.statics) {
		Wu.extend(NewClass, props.statics);
		delete props.statics;
	}

	// mix includes into the prototype
	if (props.includes) {
		Wu.Util.extend.apply(null, [proto].concat(props.includes));
		delete props.includes;
	}

	// merge options
	if (proto.options) {
		props.options = Wu.Util.extend(Wu.Util.create(proto.options), props.options);
	}

	// mix given properties into the prototype
	Wu.extend(proto, props);

	proto._initHooks = [];

	// add method for calling all hooks
	proto.callInitHooks = function () {

		if (this._initHooksCalled) { return; }

		if (parentProto.callInitHooks) {
			parentProto.callInitHooks.call(this);
		}

		this._initHooksCalled = true;

		for (var i = 0, len = proto._initHooks.length; i < len; i++) {
			proto._initHooks[i].call(this);
		}
	};

	return NewClass;
};

// method for adding properties to prototype
Wu.Class.include = function (props) {
	Wu.extend(this.prototype, props);
};

// merge new default options to the Class
Wu.Class.mergeOptions = function (options) {
	Wu.extend(this.prototype.options, options);
};

// add a constructor hook
Wu.Class.addInitHook = function (fn) { // (Function) || (String, args...)
	var args = Array.prototype.slice.call(arguments, 1);

	var init = typeof fn === 'function' ? fn : function () {
		this[fn].apply(this, args);
	};

	this.prototype._initHooks = this.prototype._initHooks || [];
	this.prototype._initHooks.push(init);
};





/*
 * L.Util contains various utility functions used throughout Leaflet code.
 * https://github.com/Leaflet/Leaflet/blob/master/src/core/Util.js
██╗   ██╗████████╗██╗██╗     
██║   ██║╚══██╔══╝██║██║     
██║   ██║   ██║   ██║██║     
██║   ██║   ██║   ██║██║     
╚██████╔╝   ██║   ██║███████╗
 ╚═════╝    ╚═╝   ╚═╝╚══════╝
*/
Wu.Util = {
	// extend an object with properties of one or more other objects
	extend: function (dest) {
		var sources = Array.prototype.slice.call(arguments, 1),
		    i, j, len, src;

		for (j = 0, len = sources.length; j < len; j++) {
			src = sources[j];
			for (i in src) {
				dest[i] = src[i];
			}
		}
		return dest;
	},

	// create an object from a given prototype
	create: Object.create || (function () {
		function F() {}
		return function (proto) {
			F.prototype = proto;
			return new F();
		};
	})(),

	// bind a function to be called with a given context
	bind: function (fn, obj) {
		var slice = Array.prototype.slice;

		if (fn.bind) {
			return fn.bind.apply(fn, slice.call(arguments, 1));
		}

		var args = slice.call(arguments, 2);

		return function () {
			return fn.apply(obj, args.length ? args.concat(slice.call(arguments)) : arguments);
		};
	},

	// return unique ID of an object
	stamp: function (obj) {
		// jshint camelcase: false
		obj._leaflet_id = obj._leaflet_id || ++Wu.Util.lastId;
		return obj._leaflet_id;
	},

	lastId: 0,

	// return a function that won't be called more often than the given interval
	throttle: function (fn, time, context) {
		var lock, args, wrapperFn, later;

		later = function () {
			// reset lock and call if queued
			lock = false;
			if (args) {
				wrapperFn.apply(context, args);
				args = false;
			}
		};

		wrapperFn = function () {
			if (lock) {
				// called too soon, queue to call later
				args = arguments;

			} else {
				// call and lock until later
				fn.apply(context, arguments);
				setTimeout(later, time);
				lock = true;
			}
		};

		return wrapperFn;
	},

	// wrap the given number to lie within a certain range (used for wrapping longitude)
	wrapNum: function (x, range, includeMax) {
		var max = range[1],
		    min = range[0],
		    d = max - min;
		return x === max && includeMax ? x : ((x - min) % d + d) % d + min;
	},

	// do nothing (used as a noop throughout the code)
	falseFn: function () { return false; },

	// round a given number to a given precision
	formatNum: function (num, digits) {
		var pow = Math.pow(10, digits || 5);
		return Math.round(num * pow) / pow;
	},

	// trim whitespace from both sides of a string
	trim: function (str) {
		return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
	},

	trimAll : function (str) {
		return str.replace(/\s+/g, '');
	},

	// split a string into words
	splitWords: function (str) {
		return Wu.Util.trim(str).split(/\s+/);
	},

	// set options to an object, inheriting parent's options as well
	setOptions: function (obj, options) {
		if (!obj.hasOwnProperty('options')) {
			obj.options = obj.options ? Wu.Util.create(obj.options) : {};
		}
		for (var i in options) {
			obj.options[i] = options[i];
		}
		return obj.options;
	},

	// make an URL with GET parameters out of a set of properties/values
	getParamString: function (obj, existingUrl, uppercase) {
		var params = [];
		for (var i in obj) {
			params.push(encodeURIComponent(uppercase ? i.toUpperCase() : i) + '=' + encodeURIComponent(obj[i]));
		}
		return ((!existingUrl || existingUrl.indexOf('?') === -1) ? '?' : '&') + params.join('&');
	},

	// super-simple templating facility, used for TileLayer URLs
	template: function (str, data) {
		return str.replace(Wu.Util.templateRe, function (str, key) {
			var value = data[key];

			if (value === undefined) {
				throw new Error('No value provided for variable ' + str);

			} else if (typeof value === 'function') {
				value = value(data);
			}
			return value;
		});
	},

	templateRe: /\{ *([\w_]+) *\}/g,

	// minimal image URI, set to an image when disposing to flush memory
	emptyImageUrl: 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=',

	isArray: Array.isArray || function (obj) {
		return (Object.prototype.toString.call(obj) === '[object Array]');
	},

	isObject: function (obj) {
		return (Object.prototype.toString.call(obj) === '[object Object]');
	},

	capitalize : function (string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	},

	setAddressBar : function (string) {
		window.history.pushState( {} , '', string );
	},

	checkDisconnect : function (response) {
		var string = response.substring(0,15);
		if (string == '<!doctype html>')  {
			// we got a disconnect!!!
			app.feedback.setError({
				title : 'You have been logged out.', 
				description : 'Please reload the page to log back in.',
				clearTimer : false
			});

			return false;
		}

		return true;
	},

	debugXML : function (json) {
		console.log('==== debugXML ====');

		var obj = Wu.parse(json);
		obj ? console.log(obj) : console.log(json);

		console.log('==================');
	},

	verifyResponse : function (response) {
		
		// print response if debug
		if (app.debug) Wu.Util.debugXML(response);

		// check for disconnect (<html> response)
		return Wu.Util.checkDisconnect(response);
		
	},

	// post without callback
	post : function (path, json) {
		var that = this,
		    http = new XMLHttpRequest(),
		    url = Wu.Util._getServerUrl(); 
		url += path;
		
		http.open("POST", url, true);

		//Send the proper header information along with the request
		http.setRequestHeader("Content-type", "application/json");

		// set access_token on header
		http.setRequestHeader("Authorization", "Bearer " + app.tokens.access_token);

		http.onreadystatechange = function() {
			if(http.readyState == 4 && http.status == 200) {
				var valid = Wu.verify(http.responseText);
			}
		}
		http.send(json);
	},

	// post with callback
	postcb : function (path, json, cb, context, baseurl) {
		var that = context,
		    http = new XMLHttpRequest(),
		    url = baseurl || Wu.Util._getServerUrl();
		
		url += path;


		http.open("POST", url, true);

		//Send the proper header information along with the request
		http.setRequestHeader('Content-type', 'application/json');

		// set access_token on header
		http.setRequestHeader("Authorization", "Bearer " + app.tokens.access_token);

		http.onreadystatechange = function() {
			if(http.readyState == 4 && http.status == 200) {

				// verify response
				var valid = Wu.verify(http.responseText);

				// callback
				if (cb && valid) cb(context, http.responseText); 
			}
		}

		// stringify objects
		if (Wu.Util.isObject(json)) json = JSON.stringify(json);

		http.send(json);
	},


	
	// post with callback and error handling (do callback.bind(this) for context)
	send : function (path, json, callback) {
		var that = this;
		var http = new XMLHttpRequest();
		var url = Wu.Util._getServerUrl();
		url += path;

		http.open("POST", url, true);
		http.setRequestHeader('Content-type', 'application/json');

		// set access_token on header
		http.setRequestHeader("Authorization", "Bearer " + app.tokens.access_token);

		http.onreadystatechange = function() {
			if (http.readyState == 4) {
		    		
				var valid = Wu.verify(http.responseText);

				if (http.status == 200 && valid) { // ok
					if (callback) callback(null, http.responseText); 
				} else { 
					if (callback) callback(http.status);
				}
			}
		}
		
		// stringify objects
		if (Wu.Util.isObject(json)) json = JSON.stringify(json);
		
		// send string
		http.send(json);
	},


	

	_getServerUrl : function () {
		return app.options.servers.portal.slice(0,-1);
	},

	// get with callback
	_getJSON : function (url, callback) {
		var http = new XMLHttpRequest();
		http.open("GET", url, true);

		//Send the proper header information along with the request
		http.setRequestHeader("Content-type", "application/json");

		http.onreadystatechange = function() {
		    if(http.readyState == 4 && http.status == 200) {
			var valid = Wu.verify(http.responseText);
			
			if (valid) callback(http.responseText); 
		    }
		}
		http.send(null);
	},
	

	// parse with error handling
	_parse : function (json) {
		try { 
			var obj = JSON.parse(json); 
			return obj;
		} catch (e) { 
			return false; 
		}

	},


	_getParentClientID : function (pid) {
		var cid = '';
		for (c in Wu.app.Clients) {
			var client = Wu.app.Clients[c];
			client.projects.forEach(function(elem, i, arr) {
				if (elem == pid) { cid = client.uuid; }
			});
		}
		if (!cid) { cid = Wu.app._activeClient.uuid; }
		return cid;
	},

	// create uuid.v4() with optional prefix
	guid : function (prefix) {
		var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
			return v.toString(16);
		});
		if (prefix) { return prefix + '-' + uuid };
		return uuid;
	},

	createRandom : function (digits) {
		return Math.random().toString(36).slice((digits) * -1).toUpperCase()
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

	deselectText : function () {
		var selection = ('getSelection' in window)
		? window.getSelection()
		: ('selection' in document)
		? document.selection
		: null;
		if ('removeAllRanges' in selection) selection.removeAllRanges();
		else if ('empty' in selection) selection.empty();
	},

	// experimental zip fn's
	generateZip : function (data) {
		// console.log('# generateZip #')

		if (!typeof data == 'string') {
			// console.log('stringify')
			data = JSON.stringify(data);
		}

		// console.log('string length: ', data.length);
		var compressed = LZString.compress(data);
		// console.log('compressd length: ', compressed.length);
		

		return compressed;

	},

	zipSave : function (path, json) {

		if (!typeof json == 'string') {
			// console.log('stringify')
			var string = JSON.stringify(json);
		} else {
			var string = json;
		}

		var my_lzma = new LZMA('//85.10.202.87:8080/js/lib/lzma/lzma_worker.js');
		my_lzma.compress(string, 1, function (result) {
		       
			// console.log('my_lzma finished!');
			// console.log(result);
			// console.log(typeof result);
			var string = JSON.stringify(result);
			// console.log('string: ', string);

			var http = new XMLHttpRequest();
			var url = window.location.origin; //"http://85.10.202.87:8080/";// + path;//api/project/update";
			url += path;
			http.open("POST", url, true);

			//Send the proper header information along with the request
			//http.setRequestHeader("Content-type", "application/json");

			http.onreadystatechange = function() {
				if(http.readyState == 4 && http.status == 200) {
					// console.log(http.responseText);
				}
			}
			http.send(string);



		}, 

		function (percent) {
			// console.log('lzma progress: ', percent);
		});

		

	},

	zippedSave : function () {



	},

	setColorTheme : function () {

		injectCSS();

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


	stripAccents : function (str) {
		/**
		* Normalise a string replacing foreign characters
		*
		* @param {String} str
		* @return {String}
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

	bytesToSize : function (bytes) {
		var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
		if (bytes == 0) return '0 Byte';
		var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
		return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
	},

	parseUrl : function () {
		var query = window.location.search.substr(1);
		var result = {};
		query.split("&").forEach(function(part) {
			var item = part.split("=");
			if (item[0] != '') {
				result[item[0]] = decodeURIComponent(item[1]);
			}
		});
		if (_.size(result)) return result;
		return false;
	},


	getWindowSize : function () {

		var size = {
			width : window.innerWidth,
			height : window.innerHeight
		}

		return size;
	},


	setStyle : function (tag, rules) {

		// set rules 
		jss.set(tag, rules);

		// eg: 
		// jss.set('img', {
		// 	'border-top': '1px solid red',
		// 	'border-left': '1px solid red'
		// });
		// https://github.com/Box9/jss
	},

	getStyle : function (tag) {
		return jss.getAll(tag);
	},

	

	
};

(function () {
	// inspired by http://paulirish.com/2011/requestanimationframe-for-smart-animating/

	function getPrefixed(name) {
		return window['webkit' + name] || window['moz' + name] || window['ms' + name];
	}

	var lastTime = 0;

	// fallback for IE 7-8
	function timeoutDefer(fn) {
		var time = +new Date(),
		    timeToCall = Math.max(0, 16 - (time - lastTime));

		lastTime = time + timeToCall;
		return window.setTimeout(fn, timeToCall);
	}

	var requestFn = window.requestAnimationFrame || getPrefixed('RequestAnimationFrame') || timeoutDefer,
	    cancelFn = window.cancelAnimationFrame || getPrefixed('CancelAnimationFrame') ||
		       getPrefixed('CancelRequestAnimationFrame') || function (id) { window.clearTimeout(id); };


	Wu.Util.requestAnimFrame = function (fn, context, immediate, element) {
		if (immediate && requestFn === timeoutDefer) {
			fn.call(context);
		} else {
			return requestFn.call(window, Wu.bind(fn, context), element);
		}
	};

	Wu.Util.cancelAnimFrame = function (id) {
		if (id) {
			cancelFn.call(window, id);
		}
	};
})();

// shortcuts for most used utility functions
Wu.extend = Wu.Util.extend;
Wu.bind = Wu.Util.bind;
Wu.stamp = Wu.Util.stamp;
Wu.setOptions = Wu.Util.setOptions;
Wu.save = Wu.Util.post;
Wu.post = Wu.Util.postcb;
Wu.send = Wu.Util.send;
Wu.parse = Wu.Util._parse;
Wu.zip = Wu.Util.generateZip;
Wu.zave = Wu.Util.zipSave;
Wu.can = Wu.Util.can;
Wu.setStyle = Wu.Util.setStyle;
Wu.getStyle = Wu.Util.getStyle;
Wu.verify = Wu.Util.verifyResponse;


// Wu.CustomEvents = {

// 	on : function (obj, type, fn, ctx) {
// 		// var event = new CustomEvent('build', { 'detail': elem.dataset.time });
// 		// document.addEventListener(type, fn, false);
// 		Wu.DomEvent.on(obj, type, fn, ctx)
// 	},

// 	off : function (obj, type, fn, ctx) {
// 		Wu.DomEvent.off(obj, type, fn, ctx)
// 	},

// 	fire : function (type, data) {
// 		var event = new CustomEvent(type, data);
// 		document.dispatchEvent(event);
// 	},

// };


Wu.Evented = Wu.Class.extend({

	on: function (types, fn, context) {

		// types can be a map of types/handlers
		if (typeof types === 'object') {
			for (var type in types) {
				// we don't process space-separated events here for performance;
				// it's a hot path since Layer uses the on(obj) syntax
				this._on(type, types[type], fn);
			}

		} else {
			// types can be a string of space-separated words
			types = Wu.Util.splitWords(types);

			for (var i = 0, len = types.length; i < len; i++) {
				this._on(types[i], fn, context);
			}
		}

		return this;
	},

	off: function (types, fn, context) {

		if (!types) {
			// clear all listeners if called without arguments
			delete this._events;

		} else if (typeof types === 'object') {
			for (var type in types) {
				this._off(type, types[type], fn);
			}

		} else {
			types = Wu.Util.splitWords(types);

			for (var i = 0, len = types.length; i < len; i++) {
				this._off(types[i], fn, context);
			}
		}

		return this;
	},

	// attach listener (without syntactic sugar now)
	_on: function (type, fn, context) {

		var events = this._events = this._events || {},
		    contextId = context && context !== this && Wu.stamp(context);

		if (contextId) {
			// store listeners with custom context in a separate hash (if it has an id);
			// gives a major performance boost when firing and removing events (e.g. on map object)

			var indexKey = type + '_idx',
			    indexLenKey = type + '_len',
			    typeIndex = events[indexKey] = events[indexKey] || {},
			    id = Wu.stamp(fn) + '_' + contextId;

			if (!typeIndex[id]) {
				typeIndex[id] = {fn: fn, ctx: context};

				// keep track of the number of keys in the index to quickly check if it's empty
				events[indexLenKey] = (events[indexLenKey] || 0) + 1;
			}

		} else {
			// individual layers mostly use "this" for context and don't fire listeners too often
			// so simple array makes the memory footprint better while not degrading performance

			events[type] = events[type] || [];
			events[type].push({fn: fn});
		}
	},

	_off: function (type, fn, context) {
		var events = this._events,
		    indexKey = type + '_idx',
		    indexLenKey = type + '_len';

		if (!events) { return; }

		if (!fn) {
			// clear all listeners for a type if function isn't specified
			delete events[type];
			delete events[indexKey];
			delete events[indexLenKey];
			return;
		}

		var contextId = context && context !== this && Wu.stamp(context),
		    listeners, i, len, listener, id;

		if (contextId) {
			id = Wu.stamp(fn) + '_' + contextId;
			listeners = events[indexKey];

			if (listeners && listeners[id]) {
				listener = listeners[id];
				delete listeners[id];
				events[indexLenKey]--;
			}

		} else {
			listeners = events[type];

			if (listeners) {
				for (i = 0, len = listeners.length; i < len; i++) {
					if (listeners[i].fn === fn) {
						listener = listeners[i];
						listeners.splice(i, 1);
						break;
					}
				}
			}
		}

		// set the removed listener to noop so that's not called if remove happens in fire
		if (listener) {
			listener.fn = Wu.Util.falseFn;
		}
	},

	fire: function (type, data, propagate) {
		if (!this.listens(type, propagate)) { return this; }

		var event = Wu.Util.extend({}, data, {type: type, target: this}),
		    events = this._events;

		if (events) {
		    var typeIndex = events[type + '_idx'],
			i, len, listeners, id;

			if (events[type]) {
				// make sure adding/removing listeners inside other listeners won't cause infinite loop
				listeners = events[type].slice();

				for (i = 0, len = listeners.length; i < len; i++) {
					listeners[i].fn.call(this, event);
				}
			}

			// fire event for the context-indexed listeners as well
			for (id in typeIndex) {
				typeIndex[id].fn.call(typeIndex[id].ctx, event);
			}
		}

		if (propagate) {
			// propagate the event to parents (set with addEventParent)
			this._propagateEvent(event);
		}

		return this;
	},

	listens: function (type, propagate) {
		var events = this._events;

		if (events && (events[type] || events[type + '_len'])) { return true; }

		if (propagate) {
			// also check parents for listeners if event propagates
			for (var id in this._eventParents) {
				if (this._eventParents[id].listens(type, propagate)) { return true; }
			}
		}
		return false;
	},

	once: function (types, fn, context) {

		if (typeof types === 'object') {
			for (var type in types) {
				this.once(type, types[type], fn);
			}
			return this;
		}

		var handler = Wu.bind(function () {
			this
			    .off(types, fn, context)
			    .off(types, handler, context);
		}, this);

		// add a listener that's executed once and removed after that
		return this
		    .on(types, fn, context)
		    .on(types, handler, context);
	},

	// adds a parent to propagate events to (when you fire with true as a 3rd argument)
	addEventParent: function (obj) {
		this._eventParents = this._eventParents || {};
		this._eventParents[Wu.stamp(obj)] = obj;
		return this;
	},

	removeEventParent: function (obj) {
		if (this._eventParents) {
			delete this._eventParents[Wu.stamp(obj)];
		}
		return this;
	},

	_propagateEvent: function (e) {
		for (var id in this._eventParents) {
			this._eventParents[id].fire(e.type, Wu.extend({layer: e.target}, e), true);
		}
	},


	bytesToSize : function (bytes) {
		   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
		   if (bytes == 0) return '0 Byte';
		   var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
		   return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
	}


});

var proto = Wu.Evented.prototype;

// aliases; we should ditch those eventually
proto.addEventListener = proto.on;
proto.removeEventListener = proto.clearAllEventListeners = proto.off;
proto.addOneTimeEventListener = proto.once;
proto.fireEvent = proto.fire;
proto.hasEventListeners = proto.listens;


Wu.Mixin = {Events: proto};

Wu._on = proto.on;
Wu._off = proto.off;
Wu._fire = proto.fire;


// DOM Utilities
Wu.DomUtil = {

	get: function (id) {
	       return typeof id === 'string' ? document.getElementById(id) : id;
	},

	getStyle: function (el, style) {

		var value = el.style[style] || (el.currentStyle && el.currentStyle[style]);

		if ((!value || value === 'auto') && document.defaultView) {
		    var css = document.defaultView.getComputedStyle(el, null);
		    value = css ? css[style] : null;
		}

		return value === 'auto' ? null : value;
	},

	create: function (tagName, className, container, content) {

		var el = document.createElement(tagName);
		el.className = className;

		if (container) {
			container.appendChild(el);
		}

		if (content) {
			if (tagName == 'input') {
				el.setAttribute('placeholder', content);
			} else if (tagName == 'image') {
				el.src = content;
			} else if (tagName == 'img') {
				el.src = content;
			} else {
				el.innerHTML = content;
			}
		}

		return el;
	},

	makeit : function (m) {

		var hook = document.createElement(m.type);
		if ( m.id ) { hook.id = m.id; }
		if ( m.cname ) { hook.className = m.cname; }
		if ( m.style ) { hook.setAttribute("style", m.style) }	
		if ( m.hlink ) { hook.setAttribute("href", m.hlink); }
		if ( m.source ) { hook.src = m.source }
		if ( m.inner ) { hook.innerHTML = m.inner; }
		if ( m.appendto ) { m.appendto.appendChild(hook); }
		if ( m.attr ) { m.attr.forEach(function(att) { hook.setAttribute(att[0], att[1]) }) }
		return hook;

	},
	
	createId : function(tagName, id, container) {
		// https://github.com/Leaflet/Leaflet/blob/master/src/dom/DomUtil.js
		
		var el = document.createElement(tagName);
		el.id = id;

		if (container) {
			container.appendChild(el);
		}

		return el;

	},

	remove: function (el) {
		var parent = el.parentNode;
		if (parent) {
		    parent.removeChild(el);
		}
	},

	toFront: function (el) {
		el.parentNode.appendChild(el);
	},

	toBack: function (el) {
		var parent = el.parentNode;
		parent.insertBefore(el, parent.firstChild);
	},

	hasClass: function (el, name) {
		if (el.classList !== undefined) {
		    return el.classList.contains(name);
		}
		var className = Wu.DomUtil.getClass(el);
		return className.length > 0 && new RegExp('(^|\\s)' + name + '(\\s|$)').test(className);
	},

	addClass: function (el, name) {
		if (!el) return console.error('addClass: div undefined. fix!');
		if (el.classList !== undefined) {
		    var classes = Wu.Util.splitWords(name);
		    for (var i = 0, len = classes.length; i < len; i++) {
			el.classList.add(classes[i]);
		    }
		} else if (!Wu.DomUtil.hasClass(el, name)) {
		    var className = Wu.DomUtil.getClass(el);
		    Wu.DomUtil.setClass(el, (className ? className + ' ' : '') + name);
		}
	},

	removeClass: function (el, name) {
		if (!el) return console.error('removeClass: div undefined. fix!');
		if (el.classList !== undefined) {
		    el.classList.remove(name);
		} else {
		    Wu.DomUtil.setClass(el, Wu.Util.trim((' ' + Wu.DomUtil.getClass(el) + ' ').replace(' ' + name + ' ', ' ')));
		}
	},


	classed: function(el, name, bol) {
		if ( !bol ) {
			this.removeClass(el,name);
		} else {
			this.addClass(el,name);
		}
	},	

	clearChildClasses : function (parent, divclass) {
		for (var i=0; i < parent.children.length; i++) {
			var child = parent.children[i];
			Wu.DomUtil.removeClass(child, divclass);
		}
	},

	setClass: function (el, name) {
		if (el.className.baseVal === undefined) {
		    el.className = name;
		} else {
		    // in case of SVG element
		    el.className.baseVal = name;
		}
	},

	getClass: function (el) {
		return el.className.baseVal === undefined ? el.className : el.className.baseVal;
	},

	appendTemplate : function (container, template) {
		if (typeof template === 'string') {
			var holder = Wu.DomUtil.create('div');
			holder.innerHTML = template;
			for (i=0; i < holder.childNodes.length; i++) {
				container.appendChild(holder.childNodes[i]);
			}
		}
		return container;
	},

	prependTemplate : function (container, template, firstsibling) {
		if (typeof template === 'string') {
			var holder = Wu.DomUtil.create('div');
			holder.innerHTML = template;
			if (firstsibling) {
			    var firstChild = container.firstChild;
			} else {
			    var firstChild = container.firstChild.nextSibling;
			}
			for (i=0; i < holder.childNodes.length; i++) {
				container.insertBefore(holder.childNodes[i], firstChild);
			}
		}
		return container;
	},

	thumbAdjust : function (imgContainer, dimentions) {

		// Plasserer thumbs sentrert i container
		// avhengig av kvadratisk ramme!

		var img = new Image();
		img.src = imgContainer.src;
		
		img.onload = function() {
			
			var w = this.width;
			var h = this.height;
			var wProp = w/dimentions;
			var hProp = h/dimentions;

			var portrait = true;
			if ( w>=h ) portrait = false;

			// Plassere bildet i boksen
			if ( !portrait ) {
				imgContainer.style.height = '100%';
				imgContainer.style.left = - Math.floor(wProp)/2 + 'px';
			} else {
				imgContainer.style.width = '100%';
				imgContainer.style.top = - Math.floor(hProp)/2 + 'px';				
			}
		}
	},	



};



var eventsKey = '_leaflet_events';

Wu.DomEvent = {

    on: function (obj, types, fn, context) {

	if (typeof types === 'object') {
	    for (var type in types) {
		this._on(obj, type, types[type], fn);
	    }
	} else {
	    types = Wu.Util.splitWords(types);

	    for (var i = 0, len = types.length; i < len; i++) {
		this._on(obj, types[i], fn, context);
	    }
	}

	return this;
    },

    off: function (obj, types, fn, context) {

	if (typeof types === 'object') {
	    for (var type in types) {
		this._off(obj, type, types[type], fn);
	    }
	} else {
	    types = Wu.Util.splitWords(types);

	    for (var i = 0, len = types.length; i < len; i++) {
		this._off(obj, types[i], fn, context);
	    }
	}

	return this;
    },

    _on: function (obj, type, fn, context) {

	var id = type + Wu.stamp(fn) + (context ? '_' + Wu.stamp(context) : '');

	if (obj[eventsKey] && obj[eventsKey][id]) { return this; }

	var handler = function (e) {
	    return fn.call(context || obj, e || window.event);
	};

	var originalHandler = handler;

	if (Wu.Browser.pointer && type.indexOf('touch') === 0) {
	    return this.addPointerListener(obj, type, handler, id);
	}
	if (Wu.Browser.touch && (type === 'dblclick') && this.addDoubleTapListener) {
	    this.addDoubleTapListener(obj, handler, id);
	}

	if ('addEventListener' in obj) {

	    if (type === 'mousewheel') {
		obj.addEventListener('DOMMouseScroll', handler, false);
		obj.addEventListener(type, handler, false);

	    } else if ((type === 'mouseenter') || (type === 'mouseleave')) {
		handler = function (e) {
		    e = e || window.event;
		    if (!Wu.DomEvent._checkMouse(obj, e)) { return; }
		    return originalHandler(e);
		};
		obj.addEventListener(type === 'mouseenter' ? 'mouseover' : 'mouseout', handler, false);

	    } else {
		if (type === 'click' && Wu.Browser.android) {
		    handler = function (e) {
			return Wu.DomEvent._filterClick(e, originalHandler);
		    };
		}
		obj.addEventListener(type, handler, false);
	    }

	} else if ('attachEvent' in obj) {
	    obj.attachEvent('on' + type, handler);
	}

	obj[eventsKey] = obj[eventsKey] || {};
	obj[eventsKey][id] = handler;

	return this;
    },

    _off: function (obj, type, fn, context) {

	var id = type + Wu.stamp(fn) + (context ? '_' + Wu.stamp(context) : ''),
	    handler = obj[eventsKey] && obj[eventsKey][id];

	if (!handler) { return this; }

	if (Wu.Browser.pointer && type.indexOf('touch') === 0) {
	    this.removePointerListener(obj, type, id);

	} else if (Wu.Browser.touch && (type === 'dblclick') && this.removeDoubleTapListener) {
	    this.removeDoubleTapListener(obj, id);

	} else if ('removeEventListener' in obj) {

	    if (type === 'mousewheel') {
		obj.removeEventListener('DOMMouseScroll', handler, false);
		obj.removeEventListener(type, handler, false);

	    } else {
		obj.removeEventListener(
		    type === 'mouseenter' ? 'mouseover' :
		    type === 'mouseleave' ? 'mouseout' : type, handler, false);
	    }

	} else if ('detachEvent' in obj) {
	    obj.detachEvent('on' + type, handler);
	}

	obj[eventsKey][id] = null;

	return this;
    },

    stopPropagation: function (e) {

	if (e.stopPropagation) {
	    e.stopPropagation();
	} else {
	    e.cancelBubble = true;
	}
	Wu.DomEvent._skipped(e);

	return this;
    },

    disableScrollPropagation: function (el) {
	return Wu.DomEvent.on(el, 'mousewheel MozMousePixelScroll', Wu.DomEvent.stopPropagation);
    },

    preventDefault: function (e) {

	if (e.preventDefault) {
	    e.preventDefault();
	} else {
	    e.returnValue = false;
	}
	return this;
    },

    stop: function (e) {
	return Wu.DomEvent
	    .preventDefault(e)
	    .stopPropagation(e);
    },

    getWheelDelta: function (e) {

	var delta = 0;

	if (e.wheelDelta) {
	    delta = e.wheelDelta / 120;
	}
	if (e.detail) {
	    delta = -e.detail / 3;
	}
	return delta;
    },

    _skipEvents: {},

    _fakeStop: function (e) {
	// fakes stopPropagation by setting a special event flag, checked/reset with L.DomEvent._skipped(e)
	Wu.DomEvent._skipEvents[e.type] = true;
    },

    _skipped: function (e) {
	var skipped = this._skipEvents[e.type];
	// reset when checking, as it's only used in map container and propagates outside of the map
	this._skipEvents[e.type] = false;
	return skipped;
    },

    // check if element really left/entered the event target (for mouseenter/mouseleave)
    _checkMouse: function (el, e) {

	var related = e.relatedTarget;

	if (!related) { return true; }

	try {
	    while (related && (related !== el)) {
		related = related.parentNode;
	    }
	} catch (err) {
	    return false;
	}
	return (related !== el);
    },

    // this is a horrible workaround for a bug in Android where a single touch triggers two click events
    _filterClick: function (e, handler) {
	var timeStamp = (e.timeStamp || e.originalEvent.timeStamp),
	    elapsed = Wu.DomEvent._lastClick && (timeStamp - Wu.DomEvent._lastClick);

	// are they closer together than 500ms yet more than 100ms?
	// Android typically triggers them ~300ms apart while multiple listeners
	// on the same event should be triggered far faster;
	// or check if click is simulated on the element, and if it is, reject any non-simulated events

	if ((elapsed && elapsed > 100 && elapsed < 500) || (e.target._simulatedClick && !e._simulated)) {
	    Wu.DomEvent.stop(e);
	    return;
	}
	Wu.DomEvent._lastClick = timeStamp;

	return handler(e);
    }
};


// Wu.Browser
(function () {

    var ua = navigator.userAgent.toLowerCase(),
	doc = document.documentElement,

	ie = 'ActiveXObject' in window,

	webkit    = ua.indexOf('webkit') !== -1,
	phantomjs = ua.indexOf('phantom') !== -1,
	android23 = ua.search('android [23]') !== -1,
	chrome    = ua.indexOf('chrome') !== -1,

	mobile = typeof orientation !== 'undefined',
	msPointer = navigator.msPointerEnabled && navigator.msMaxTouchPoints && !window.PointerEvent,
	pointer = (window.PointerEvent && navigator.pointerEnabled && navigator.maxTouchPoints) || msPointer,

	ie3d = ie && ('transition' in doc.style),
	webkit3d = ('WebKitCSSMatrix' in window) && ('m11' in new window.WebKitCSSMatrix()) && !android23,
	gecko3d = 'MozPerspective' in doc.style,
	opera3d = 'OTransition' in doc.style;


    var retina = 'devicePixelRatio' in window && window.devicePixelRatio > 1;

    if (!retina && 'matchMedia' in window) {
	var matches = window.matchMedia('(min-resolution:1.5dppx)');
	retina = matches && matches.matches;
    }

    var touch = !window.L_NO_TOUCH && !phantomjs && (pointer || 'ontouchstart' in window ||
	    (window.DocumentTouch && document instanceof window.DocumentTouch));

    Wu.Browser = {
	ie: ie,
	ielt9: ie && !document.addEventListener,
	webkit: webkit,
	gecko: (ua.indexOf('gecko') !== -1) && !webkit && !window.opera && !ie,
	android: ua.indexOf('android') !== -1,
	android23: android23,
	chrome: chrome,
	safari: !chrome && ua.indexOf('safari') !== -1,

	ie3d: ie3d,
	webkit3d: webkit3d,
	gecko3d: gecko3d,
	opera3d: opera3d,
	any3d: !window.L_DISABLE_3D && (ie3d || webkit3d || gecko3d || opera3d) && !phantomjs,

	mobile: mobile,
	mobileWebkit: mobile && webkit,
	mobileWebkit3d: mobile && webkit3d,
	mobileOpera: mobile && window.opera,

	touch: !!touch,
	msPointer: !!msPointer,
	pointer: !!pointer,

	retina: !!retina
    };

}());

Wu.extend(Wu.DomEvent, {

	//static
	POINTER_DOWN: Wu.Browser.msPointer ? 'MSPointerDown' : 'pointerdown',
	POINTER_MOVE: Wu.Browser.msPointer ? 'MSPointerMove' : 'pointermove',
	POINTER_UP: Wu.Browser.msPointer ? 'MSPointerUp' : 'pointerup',
	POINTER_CANCEL: Wu.Browser.msPointer ? 'MSPointerCancel' : 'pointercancel',

	_pointers: [],
	_pointerDocumentListener: false,

	// Provides a touch events wrapper for (ms)pointer events.
	// Based on changes by veproza https://github.com/CloudMade/Leaflet/pull/1019
	//ref http://www.w3.org/TR/pointerevents/ https://www.w3.org/Bugs/Public/show_bug.cgi?id=22890

	addPointerListener: function (obj, type, handler, id) {
		console.log('addPointerListener', type);
		switch (type) {
		case 'touchstart':
			return this.addPointerListenerStart(obj, type, handler, id);
		case 'touchend':
			return this.addPointerListenerEnd(obj, type, handler, id);
		case 'touchmove':
			return this.addPointerListenerMove(obj, type, handler, id);
		default:
			throw 'Unknown touch event type';
		}
	},

	addPointerListenerStart: function (obj, type, handler, id) {
		var pre = '_leaflet_',
		    pointers = this._pointers;

		var cb = function (e) {

			Wu.DomEvent.preventDefault(e);

			var alreadyInArray = false;
			for (var i = 0; i < pointers.length; i++) {
				if (pointers[i].pointerId === e.pointerId) {
					alreadyInArray = true;
					break;
				}
			}
			if (!alreadyInArray) {
				pointers.push(e);
			}

			e.touches = pointers.slice();
			e.changedTouches = [e];

			handler(e);
		};

		obj[pre + 'touchstart' + id] = cb;
		obj.addEventListener(this.POINTER_DOWN, cb, false);

		// need to also listen for end events to keep the _pointers list accurate
		// this needs to be on the body and never go away
		if (!this._pointerDocumentListener) {
			var internalCb = function (e) {
				for (var i = 0; i < pointers.length; i++) {
					if (pointers[i].pointerId === e.pointerId) {
						pointers.splice(i, 1);
						break;
					}
				}
			};
			//We listen on the documentElement as any drags that end by moving the touch off the screen get fired there
			document.documentElement.addEventListener(this.POINTER_UP, internalCb, false);
			document.documentElement.addEventListener(this.POINTER_CANCEL, internalCb, false);

			this._pointerDocumentListener = true;
		}

		return this;
	},

	addPointerListenerMove: function (obj, type, handler, id) {
		var pre = '_leaflet_',
		    touches = this._pointers;

		function cb(e) {

			// don't fire touch moves when mouse isn't down
			if ((e.pointerType === e.MSPOINTER_TYPE_MOUSE || e.pointerType === 'mouse') && e.buttons === 0) { return; }

			for (var i = 0; i < touches.length; i++) {
				if (touches[i].pointerId === e.pointerId) {
					touches[i] = e;
					break;
				}
			}

			e.touches = touches.slice();
			e.changedTouches = [e];

			handler(e);
		}

		obj[pre + 'touchmove' + id] = cb;
		obj.addEventListener(this.POINTER_MOVE, cb, false);

		return this;
	},

	addPointerListenerEnd: function (obj, type, handler, id) {
		var pre = '_leaflet_',
		    touches = this._pointers;

		var cb = function (e) {
			for (var i = 0; i < touches.length; i++) {
				if (touches[i].pointerId === e.pointerId) {
					touches.splice(i, 1);
					break;
				}
			}

			e.touches = touches.slice();
			e.changedTouches = [e];

			handler(e);
		};

		obj[pre + 'touchend' + id] = cb;
		obj.addEventListener(this.POINTER_UP, cb, false);
		obj.addEventListener(this.POINTER_CANCEL, cb, false);

		return this;
	},

	removePointerListener: function (obj, type, id) {
		var pre = '_leaflet_',
		    cb = obj[pre + type + id];

		switch (type) {
		case 'touchstart':
			obj.removeEventListener(this.POINTER_DOWN, cb, false);
			break;
		case 'touchmove':
			obj.removeEventListener(this.POINTER_MOVE, cb, false);
			break;
		case 'touchend':
			obj.removeEventListener(this.POINTER_UP, cb, false);
			obj.removeEventListener(this.POINTER_CANCEL, cb, false);
			break;
		}

		return this;
	}
});


Wu.DomEvent.addListener = Wu.DomEvent.on;
Wu.DomEvent.removeListener = Wu.DomEvent.off;

Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};

Array.prototype.move = function(from, to) {
    this.splice(to, 0, this.splice(from, 1)[0]);
};

Array.prototype.moveUp = function(value, by) {
    var index = this.indexOf(value),     
        newPos = index - (by || 1);
     
    if(index === -1) 
        throw new Error('Element not found in array');
     
    if(newPos < 0) 
        newPos = 0;
         
    this.splice(index,1);
    this.splice(newPos,0,value);
};
 
Array.prototype.moveDown = function(value, by) {
    var index = this.indexOf(value),     
        newPos = index + (by || 1);
     
    if(index === -1) 
        throw new Error('Element not found in array');
     
    if(newPos >= this.length) 
        newPos = this.length;
     
    this.splice(index, 1);
    this.splice(newPos,0,value);
};

String.prototype.camelize = function () {
    return this.replace (/(?:^|[_])(\w)/g, function (_, c) {
      return c ? c.toUpperCase () : '';
    });
}


// bind fn for phantomJS
Function.prototype.bind = Function.prototype.bind || function (thisp) {
	var fn = this;
	return function () {
		return fn.apply(thisp, arguments);
	};
};

Wu.Socket = Wu.Class.extend({

	initialize : function () {

		// create socket
		this._socket = io.connect();

		// add listeners
		this._listen();

		// add loops
		this._addLoops();
	},

	_addLoops : function () {
		setInterval(function () {
			this._getServerStats();
		}.bind(this), 2000);
	},

	_getServerStats : function () {
		var socket = this._socket;
		socket.emit('get_server_stats');
	},

	sendUserEvent : function (options) {
		// defaults
		options.user = options.user || app.Account.getFullName();
		options.timestamp = options.timestamp || Date.now();

		// send event
		var socket = this._socket;
		socket.emit('user_event', options);
	},

	_listen : function () {
		var socket = this._socket;

		socket.on('server_stats', function (data) {
			var stats = data.server_stats;
			if (app.Chrome) app.Chrome.Top.updateCPUclock(stats.cpu_usage);
		});
		socket.on('connect', function(){
			console.log('Securely connected to socket.');
			socket.emit('ready', 'koko')
		});
		socket.on('event', function(data){
			console.log('event data: ', data);
		});
		socket.on('disconnect', function(){
			console.log('disconnect!');
		});
		socket.on('hola', function(data){
			console.log('hola!', data);
		});
		socket.on('processingProgress', function(data){
			Wu.Mixin.Events.fire('processingProgress', {
				detail : data
			});
		});
		socket.on('stats', function(data){
		});
		socket.on('uploadDone', function (data) {
		});
		socket.on('downloadReady', function (data) {

			// select project
			var event_id = 'downloadReady-' + data.file_id;
			Wu.Mixin.Events.fire(event_id, {detail : data});
		});
		socket.on('processingDone', function (data) {

			// notify data lib
			var file_id = data.file_id;
			var import_took_ms = data.import_took_ms;

			app.Data._onImportedFile(file_id, import_took_ms);
		});
		
		socket.on('errorMessage', function (data) {
			console.log('errorMessage!', data);

			var content = data.error;

			app.FeedbackPane.setError({
				title : content.title,
				description : content.description
			});
		});
		

	},

	getSocket : function () {
		return this._socket;
	},	

	
});
Wu.Controller = Wu.Class.extend({

	initialize : function () {

		this._listen();
	},

	_listen : function () {

		Wu.Mixin.Events.on('projectSelected', this._projectSelected, this);
		
		// Wu.Mixin.Events.on('projectChanged', _.throttle(this._projectChanged, 1000), this);

		// Wu.Mixin.Events.on('editEnabled',     this._editEnabled, this);
		// Wu.Mixin.Events.on('editDisabled',    this._editDisabled, this);
		// Wu.Mixin.Events.on('layerEnabled',    this._layerEnabled, this);
		// Wu.Mixin.Events.on('layerDisabled',   this._layerDisabled, this);
	},

	// _initialize 		: function () {},
	// _editEnabled 	: function () {},
	// _editDisabled 	: function () {},
	// _layerEnabled 	: function () {},
	// _layerDisabled 	: function () {},
	// _updateView 		: function () {},


	_projectSelected : function (e) {
		var projectUuid = e.detail.projectUuid;

		if (!projectUuid) return Wu.Util.setAddressBar('');

		// set project
		this._project = app.activeProject = app.Projects[projectUuid];

		// refresh map controls
		// this.refreshControls(); // perhaps refactor later, events in each control..

		// set url
		this._setUrl();

		// set state if any
		// this._loadState();

	},

	_projectChanged : function (e) {
		var projectUuid = e.detail.projectUuid;
		var project = app.Projects[projectUuid];
		var saveState = project.getSettings().saveState;

		// // save map state
		// if (saveState) this._saveState({
		// 	project : project
		// });
	},

	_loadState : function () {
		var project = this._project,
		    state = project.getState(),
		    saveState = project.getSettings().saveState;
		
		if (!saveState || !state) return;


		var json = {
			projectUuid : this._project.getUuid(),
			id : state
		}

		// get a saved setup - which layers are active, position, 
		Wu.post('/api/project/hash/get', JSON.stringify(json), function (ctx, reply) {

			var result = Wu.parse(reply);

			var hash = result.hash;

			// set position
			app.MapPane.setPosition(hash.position);

			// set layermenu layers
			var layers = hash.layers;
			_.each(layers, function (layerUuid) {
				app.MapPane.getControls().layermenu._enableLayerByUuid(layerUuid);
			});


		}.bind(this), this);

	},

	// todo!
	_saveState : function (options) {

		var project = options.project || app.activeProject;

		var layers = app.MapPane.getZIndexControls().l._index;


		var layerUuids = [];
		_.each(layers, function (l) {
			layerUuids.push(l.store.uuid);
		});


		// hash object
		var json = {
			projectUuid : project.getUuid(),
			hash : {
				id 	 : Wu.Util.createRandom(6),
				position : app.MapPane.getPosition(),
				layers 	 : layerUuids 			// layermenuItem uuids, todo: order as z-index
			},
			saveState : true
		}

		// save hash to server
		Wu.post('/api/project/hash/set', JSON.stringify(json), function (a, b) {
			console.log('saved state!', json);
		}, this);

	},

	_setUrl : function () {
		// var client = this._project.getClient();
		// if (client === undefined)	return;
		var url = '/';
		// url += client.slug;
		// url += '/';
		url += this._project.getSlug();
		Wu.Util.setAddressBar(url);
	},


	hideControls : function () {

		// layermenu
		var lm = app.MapPane.getControls().layermenu;
		if (lm) lm.hide();

		// inspect
		var ic = app.MapPane.getControls().inspect;
		if (ic) ic.hide();

		// legends
		var lc = app.MapPane.getControls().legends;
		if (lc) lc.hide();

		// description
		var dc = app.MapPane.getControls().description;
		if (dc) dc.hide();
	},

	showControls : function () {

		// layermenu
		var lm = app.MapPane.getControls().layermenu;
		if (lm) lm.show();

		// inspect
		var ic = app.MapPane.getControls().inspect;
		if (ic) ic.show();

		// legends
		var lc = app.MapPane.getControls().legends;
		if (lc) lc.show();

		// description
		var dc = app.MapPane.getControls().description;
		if (dc) dc.show();
	},


	showStartPane : function () {

		// called from project._unload(), ie. when deleting active project

		// flush mappane, headerpane, controls
		// show startpane

		app.MapPane._flush();
		app.HeaderPane._flush();
		app.HeaderPane._hide();

		var controls = app.MapPane.getControls();

		for (c in controls) {
			var control = controls[c];
			control._off();
		}

		app.StatusPane.close()
		app.StartPane.activate();

	},


	createProject : function () {
		console.error('this is a debug function!');

		var position = app.options.defaults.project.position;

		// create project object
		var store = {
			name 		: 'Project title',
			description 	: 'Project description',
			createdByName 	: app.Account.getName(),
			keywords 	: '',
			position 	: app.options.defaults.project.position || {},
			bounds : {
				northEast : {
					lat : 0,
					lng : 0
				},
				southWest : {
					lat : 0,
					lng : 0
				},
				minZoom : 1,
				maxZoom : 22
			},
			header : {
				height : 50
			},
			folders : []

		}

		// create new project with options, and save
		var project = new Wu.Project(store);
		project.editMode = true;
		var options = {
			store : store,
			callback : this._projectCreated,
			context : this
		}

		project.create(options);

	},

	_projectCreated : function (project, json) {
		var result = Wu.parse(json),
		    error  = result.error,
		    store  = result.project;

		// return error
		if (error) return app.feedback.setError({
			title : 'There was an error creating new project!', 
			description : error
		});
			
		// add to global store
		app.Projects[store.uuid] = project;

		// update project store
		project.setNewStore(store);

		// select
		Wu.Mixin.Events.fire('projectSelected', { detail : {
			projectUuid : project.getUuid()
		}});

	},


	openLastUpdatedProject : function () {
		var project = _.first(_.sortBy(_.toArray(app.Projects), function (p) {
			return p.store.lastUpdated;
		}).reverse());
		if (project) project.selectProject();
	},

	openFirstProject : function () {
		var project = _.first(_.sortBy(_.toArray(app.Projects), function (p) {
			return p.getName().toLowerCase();
		}));
		if (project) project.selectProject();
		
	},



});
Wu.Data = Wu.Class.extend({

	initialize : function () {

		// init resumable
		this._initResumable();

	},

	_initResumable : function () {

		// create resumable
		this._resumable = new Wu.Resumable({
			onUploadDone : this._onUploadDone 
		});

	},

	// serve an upload button with triggers
	getUploadButton : function (className, appendTo) { // or, perhaps pass button container, if button needs to be recreated

		// save button container
		this._buttonContainer = appendTo;

		// create button
		var button = this._uploadButton = Wu.DomUtil.create('div', className);

		// append to container
		this._buttonContainer.appendChild(button);

		// set event
		// Wu.DomEvent.on(button, 'click', this._onUploadButtonClick, this);	

		// add button to resumable
		this._resumable.assignBrowse(button);	

		// return button
		return button;
	},

	_onUploadButtonClick : function () {
	},

	// ping from socket
	_onImportedFile : function (file_id, import_time_ms) {

		// print import time
		app.Data._setFeedbackImportTime(import_time_ms);

		// get file objects
		app.Data._getFile(file_id, app.Data._gotFile.bind(app.Data));
	},

	_onUploadDone : function () {
	},

	_setFeedbackImportTime : function (import_time_ms) {
		var import_took_pretty = (parseInt(import_time_ms / 1000)) + ' seconds';
		var description = 'Import took ' + import_took_pretty;
		app.feedback.setMessage({
			title : 'Upload successful!',
			description : description
		});
	},

	// get file/layer objects from server
	_getFile : function (file_id, callback) {

		var xhr = new XMLHttpRequest();
		var fd = new FormData();
		var url = app.options.servers.portal + 'api/upload/get';
		url += '?fileUuid=' + file_id;
		url += '&access_token=' + app.tokens.access_token;

		xhr.open("GET", url, true);
		xhr.onreadystatechange = function() {
			if(xhr.readyState == 4 && xhr.status == 200) {
				var fileObject = Wu.parse(xhr.responseText);

				// return file
				if (fileObject && fileObject.file) return callback(fileObject);
			}
		}
		xhr.send(null);
	},

	_gotFile : function (fileObject) {

		console.log('Imported file:', fileObject);

		var fileStore = fileObject.file;
		var layer = fileObject.layer;
		var user = app.Account;

		// add locally
		var file = user.setFile(fileStore);

		// fire event (for data lib to pick up changes)
		Wu.Mixin.Events.fire('fileImported', { detail : {
			file : file
		}});
	},


	disableUploader : function () {

	},
	enableUploader : function () {

	},


});
Wu.Evented = Wu.Class.extend({

	initialize : function (options) {

		// set options
		Wu.setOptions(this, options);

		// listen up
		this._listen();

		// local initialize
		this._initialize();
	},      

	_listen : function () {
		Wu.Mixin.Events.on('projectSelected', this._projectSelected, this);
		Wu.Mixin.Events.on('projectDeleted',  this._onProjectDeleted, this);
		Wu.Mixin.Events.on('editEnabled',     this._editEnabled, this);
		Wu.Mixin.Events.on('editDisabled',    this._editDisabled, this);
		Wu.Mixin.Events.on('layerEnabled',    this._layerEnabled, this);
		Wu.Mixin.Events.on('layerDisabled',   this._layerDisabled, this);
		Wu.Mixin.Events.on('fileImported',    this._onFileImported, this);
		Wu.Mixin.Events.on('fileDeleted',     this._onFileDeleted, this);
		Wu.Mixin.Events.on('layerAdded',      this._onLayerAdded, this);
		Wu.Mixin.Events.on('layerEdited',     this._onLayerEdited, this);
		Wu.Mixin.Events.on('layerDeleted',    this._onLayerDeleted, this);
	},

	// dummies
	_projectSelected : function () {},
	_initialize 	 : function () {},
	_initContainer   : function () {},
	_editEnabled 	 : function () {},
	_editDisabled 	 : function () {},
	_layerEnabled 	 : function () {},
	_layerDisabled 	 : function () {},
	_updateView 	 : function () {},
	_refresh 	 : function () {},
	_onFileImported  : function () {},
	_onFileDeleted   : function () {},
	_onLayerAdded    : function () {},
	_onLayerEdited   : function () {},
	_onLayerDeleted  : function () {},
	_onProjectDeleted : function () {},

});
Wu.Resumable = Wu.Class.extend({

	options : {
		target : '/api/data/upload/chunked',
		chunkSize : 2*1024*1024,
		simultaneousUploads : 5,
		testChunks : true, 
		maxFiles : 5,
		fileType : ['zip', 'gz', 'geojson', 'tif', 'tiff', 'jp2', 'ecw'],
		fileTypeErrorCallback : this._fileTypeErrorCallback,
	},


	initialize : function (options) {
		
		// set options
		Wu.setOptions(this, options);

		// options fn's
		this.options.generateUniqueIdentifier = this._generateUniqueIdentifier;
		this.options.query = this._generateQuery;
		this.options.maxFilesErrorCallback = this._maxFilesErrorCallback;

		// create resumable
		this._create();

		// generate unique id
		this._set_id();
	},

	_create : function () {

		// create resumable instance
		var r = this.r = new Resumable(this.options);

		// add events
		this._addResumableEvents();

	},

	destroy : function () {
		
	},

	_assign : function () {
		if (this.options.drop)   this.r.assignDrop(this.options.drop);
		if (this.options.browse) this.r.assignBrowse(this.options.browse);
	},

	assignDrop : function (div) {
		this.r.assignDrop(div);
	},

	assignBrowse : function (div) {
		this.r.assignBrowse(div);
	},

	_unassign : function () {
		this.r.unAssignDrop(this.options.drop);
	},

	_disableUploadButton : function () {
	},
	_enableUploadButton : function () {
	},

	// success or aborted or failed
	_uploadDone : function () {
		this.options.onUploadDone();
	},

	_addResumableEvents : function () {
		var r = this.r;

		// file added
		r.on('fileAdded', function(file){

			// fire layer edited
			Wu.Mixin.Events.fire('fileProcessing', {detail : {
				file: file
			}});

			// set starttime
			r._startTime = new Date().getTime();
			
			// upload file
			r.upload();

			// give feedback
			this.feedbackUploadStarted(file);

		}.bind(this));

		// file success
		r.on('fileSuccess', function(file, message){

			// give feedback
			this.feedbackUploadSuccess(file, message);
			
			// hide progess bar
			app.ProgressBar.hideProgress();

			this._uploadDone();

		}.bind(this));

		// set progress bar
		r.on('fileProgress', function(file){
			var progress = file.progress() * 100;
			if (progress > 99) progress = 100;

			// set progress bar
			app.ProgressBar.setProgress(progress);

			// set processing progress
			Wu.Mixin.Events.fire('processingProgress', {
				detail : {
					text : 'Uploading...',
					error : null,
					percent : parseInt(progress),
					uniqueIdentifier : file.uniqueIdentifier,
				}
			});

		}.bind(this));

		r.on('cancel', function(){
			this._uploadDone();
		}.bind(this));
		
		r.on('uploadStart', function(){
		}.bind(this));
		
		r.on('complete', function(data){
			this._uploadDone();
		}.bind(this));
		
		r.on('pause', function(){
		}.bind(this));
		
		r.on('fileError', function(file, message){
		}.bind(this));

	},

	_removeEvents : function () {
	},

	_enableDrop : function () {
	},

	_disableDrop : function () {
	},

	_dragLeave : function () {
		this.options.drop.style.display = 'none';
	},

	_dragEnter : function () {
		this.options.drop.style.display = 'block';
	},
	
	disable : function () {
	},

	enable : function () {
	},




	// feedback upload started
	feedbackUploadStarted : function (file) {

		// calc sizes for feedback message
		var size = Wu.Util.bytesToSize(file.size),
		    fileName = file.fileName,
		    message = 'File: ' + fileName + '<br>Size: ' + size;
		
		// set processing progress
		Wu.Mixin.Events.fire('processingProgress', {
			detail : {
				text : 'Uploading...',
				error : null,
				percent : 0,
				uniqueIdentifier : file.uniqueIdentifier,
			}
		});
	},

	// feedback upload success
	feedbackUploadSuccess : function (file, message) {

		// get file_id
		var m 		= Wu.parse(message),
		    r 		= this.r,
		    file_id 	= m.file_id,
		    endTime 	= new Date().getTime(),
		    startTime 	= r._startTime,
		    totalTime 	= (endTime - startTime) / 1000,
		    size 	= file.size / 1000 / 1000,
		    bytesps  	= size / totalTime,
		    procTime 	= (size * 1).toFixed(0) + ' seconds',
		    ext 	= file.fileName.split('.').reverse()[0];

		// set message
		var message = 'Estimated time: ' + procTime;

		// set processing progress
		Wu.Mixin.Events.fire('processingProgress', {
			detail : {
				text : 'Uploaded!',
				error : null,
				percent : 100,
				uniqueIdentifier : file.uniqueIdentifier,
			}
		});

	},

	// get/set id
	_set_id : function () {
		this._id = Wu.Util.getRandomChars(5);
	},
	_get_id : function () {
		return this._id;
	},


	// options helper fn's
	_generateUniqueIdentifier : function (file) {
		var uid = file.size + '-' + file.lastModified + '-' + app.Account.getUuid() + '-'  + file.name;
		return uid;
	},
	_generateQuery : function () {
		var query = {
			fileUuid : Wu.Util.guid('r'),
			// projectUuid : app.activeProject.getUuid(),
			access_token : app.tokens.access_token,
		};
		return query;
	},
	_maxFilesErrorCallback : function () {
		app.feedback.setError({
			title : 'Please only upload one file at a time.',
		});	
	},
	_fileTypeErrorCallback : function (file, errorCount) {

		// set feedback
		var description = 'The file <strong>' + file.name + '</strong> is not a geodata file. We only allow geodata at this time.';
		var filetype = file.name.split('.').reverse()[0];
		
		// custom shapefile feedback
		if (filetype == 'shp') description = 'Please zip shapefiles before uploading. Mandatory files are .shp, .shx, .dbf, .prj.';

		// show feedback message
		app.feedback.setError({
			title : 'Sorry, you can\'t do that!',
			description : description
		});

	},


})
Wu.Pane = Wu.Class.extend({

	initialize : function (options) {

		// set options
		Wu.setOptions(this, options);

		// local initialize
		this._initialize();
		
		// init container
		this._initContainer();
		
		// listen up
		this._listen();
	},      

	_listen : function () {
		Wu.Mixin.Events.on('projectSelected', this._projectSelected, this);
		Wu.Mixin.Events.on('editEnabled',     this._editEnabled, this);
		Wu.Mixin.Events.on('editDisabled',    this._editDisabled, this);
		Wu.Mixin.Events.on('layerEnabled',    this._layerEnabled, this);
		Wu.Mixin.Events.on('layerDisabled',   this._layerDisabled, this);
		Wu.Mixin.Events.on('closeMenuTabs',   this._onCloseMenuTabs, this);
	},

	_projectSelected : function (e) {

		var projectUuid = e.detail.projectUuid;

		if (!projectUuid) return;

		// set project
		this._project = app.activeProject = app.Projects[projectUuid];

		// refresh pane
		this._refresh();
	},

	// dummies
	_initialize 	: function () {},
	_editEnabled 	: function () {},
	_editDisabled 	: function () {},
	_layerEnabled 	: function () {},
	_layerDisabled 	: function () {},
	_updateView 	: function () {},
	_refresh 	: function () {},
	_initContainer : function () {},
	_onCloseMenuTabs : function () {},

});
Wu.HeaderPane = Wu.Pane.extend({
	
	_ : 'headerpane', 

	_initContainer : function () {

		// // create divs
		// this._container     = app._headerPane = Wu.DomUtil.create('div', '', app._mapContainer);
		// this._container.id  = 'header';

		// // wrapper for header
		// this._logoContainer = Wu.DomUtil.create('div', 'header-logo-container', this._container);
		// this._logo 	    = Wu.DomUtil.create('img', 'header-logo', this._logoContainer);
		// this._titleWrap     = Wu.DomUtil.create('div', 'header-title-wrap', this._container);
		// this._title 	    = Wu.DomUtil.create('div', 'header-title', this._titleWrap);
		// this._subtitle 	    = Wu.DomUtil.create('div', 'header-subtitle', this._titleWrap);
		// this._role 	    = Wu.DomUtil.create('div', 'header-role', this._titleWrap);
	
		// // tooltips
		// this._addTooltips();

		// // add hooks
		// this.addHooks();

		// // hide by default
		// this._hide();
	},

	// refresh view (ie. on projectSelected)
	_refresh : function (project) {

		// // refresh fields
		// this.setLogo();
		// this.setTitle();
		// this.setSubtitle();
		// this.setRole();

		// // make sure is visible
		// this._show();
	},

	addHooks : function () {
		// stops
		// Wu.DomEvent.on(this._logo, 'mouseover', Wu.DomEvent.stopPropagation, this);
		// Wu.DomEvent.on(this._title, 'mouseover', Wu.DomEvent.stopPropagation, this);
	},

	_addTooltips : function () {
		// app.Tooltip.add(this._logo, 'Click to upload a new logo');
	},

	_show : function () {
		// this._container.style.display = 'block';
	},

	_hide : function () {
		// this._container.style.display = 'none';
	},

	setLogo : function (logo) {
		// this._logo.src = this._getPixelLogo(logo);		
		
	},

	_getPixelLogo : function (logo) {
		// var logo = logo || this._project.getHeaderLogo();

		// if (!logo || logo == '/css/images/defaultProjectLogoLight.png') return '/css/images/defaultProjectLogoLight.png' + '?access_token=' + app.tokens.access_token;
		// if (!logo || logo == '/css/images/defaultProjectLogo.png') return '/css/images/defaultProjectLogo.png' + '?access_token=' + app.tokens.access_token;

		// var base = logo.split('/')[2];
		// var url = '/pixels/image/' + base + '?width=105&height=70' + '&access_token=' + app.tokens.access_token;
		
		// return url;
	},

	setTitle : function (title) {
		// this._title.innerHTML = title || this._project.getHeaderTitle();
	},

	setSubtitle : function (subtitle) {
		// this._subtitle.innerHTML = subtitle || this._project.getHeaderSubtitle();
	},

	setRole : function () {
		// var myrole = this._getRole();
		// this._role.innerHTML = myrole;
	},

	_getRole : function () {
		// // superadmins
		// if (app.Access.is.superAdmin()) return 'Superadmin';
		// if (app.Access.is.admin()) return 'Admin';

		// // erryone else
		// var project = this._project || app.activeProject;
		// var roles = project.getRoles();
		// var myrole = '';
		// for (r in roles) {
		// 	var role = roles[r];
		// 	role.store.members.forEach(function (m) {
		// 		if (m == app.Account.getUuid()) {
		// 			myrole = role;
		// 		}
		// 	})
		// }
		
		// // if found
		// if (myrole) return myrole.getName();

		// // not found
		// return 'No role.'
	},

	getContainer : function () {
		// return this._container;
	},

	addedLogo : function (path) {
		
		// // set path
		// var fullpath = '/images/' + path;

		// // set new image and save
		// this._project.setHeaderLogo(fullpath);

		// // update image in header
		// this.setLogo();
	},

	_flush : function () {
		// this.setTitle(' ');
		// this.setSubtitle(' ');
		// this.setLogo('/css/images/defaultProjectLogo.png');
	},

});
Wu.ProgressPane = Wu.Class.extend({

	options : {

		color : 'white',
		
	},

	initialize : function (options) {
		
		// set options
		Wu.setOptions(this, options);

		// init container
		this.initContainer();

	},

	initContainer : function () {

		// create progress bar (share dom with other instances of Wu.ProgressPane)
		this._progressBar = app._progressBar = app._progressBar || Wu.DomUtil.create('div', 'status-progress-bar', app._appPane);

		// add to sidepane if assigned container in options
		if (this.options.addTo) this.addTo(this.options.addTo);

	},

	addTo : function () {
		var pane = this.options.addTo;
		pane.appendChild(this._progressBar);
	},

	setProgress : function (percent) {
		if (percent < this._current + 2) return;
		
		var bar = this._progressBar;
		bar.style.opacity = 1;
		bar.style.width = percent + '%';
		bar.style.backgroundColor = this.options.color;
		this._current = percent;
	},

	hideProgress : function () {
		var bar = this._progressBar;
		bar.style.opacity = 0;
		this._current = 0;
		bar.style.width = 0;
		// bar.style.backgroundColor = 'white';

		if (this._progressTimer) clearTimeout(this._progressTimer)
	},
	
	// do a timed progress
	timedProgress : function (ms) {
		var that = this,
		    duration = ms || 5000, // five seconds default
		    steps = 100,	 	   // five steps default
		    p = 0;		   // start percentage
		
		// calculate delay
		var delay = parseInt(parseInt(duration) / steps);

		// start progress
		that._timedProgress(p, delay, steps);

		// change color
		app._progressBar.style.backgroundColor = 'red';
	},

	_timedProgress : function (percent, delay, steps) {
		var that = this;

		// set progress to percent after delay
		percent = percent + (100/steps);
		that.setProgress(percent);
		
		that._progressTimer = setTimeout(function () {

			// play it again sam
			if (percent < 100) return that._timedProgress(percent, delay, steps);

			// done, hide progress bar
			that.hideProgress();

		}, delay)
	}


});
Wu.MapPane = Wu.Pane.extend({

	_ : 'mappane',

	options : {
		controls : [
			'description',
			// 'inspect',
			'layermenu',
			'zoom',
			// 'legends',
			'measure',
			'geolocation',
			'mouseposition',
			// 'baselayertoggle',
			// 'cartocss',
			'draw',
		]
	},
	
	_initialize : function () {
		// connect zindex control
		this._baselayerZIndex = new Wu.ZIndexControl.Baselayers();
		this._layermenuZIndex = new Wu.ZIndexControl.Layermenu();

		// active layers
		this._activeLayers = [];
	},

	_initContainer : function () {
		
		// init container
		this._container = app._mapPane = Wu.DomUtil.createId('div', 'map', app._mapContainer);
	
		// add help pseudo
		Wu.DomUtil.addClass(this._container, 'click-to-start');

		// init map
		this._initLeaflet();

		// init controls
		this._initControls();

		// events
		this._registerEvents();

		// adjust padding, etc.
		this._adjustLayout();
	},

	_projectSelected : function (e) {

		var projectUuid = e.detail.projectUuid;

		if (!projectUuid) return;

		// set project
		this._project = app.activeProject = app.Projects[projectUuid];

		// refresh pane
		this._refresh();

		// fire project selected on map load
		app._map.fire('projectSelected')
	},

	// refresh view
	_refresh : function () {

		// remove old
		this._flush();

		// set base layers
		this.setBaseLayers();

		// set bounds
		this.setMaxBounds();

		// set position
		this.setPosition();

	},

	_flush : function () {

		// remove layers
		this._flushLayers();

		this._activeLayers = null;
		this._activeLayers = [];
	},

	_flushLayers : function () {
		var map = app._map;
		
		var activeLayers = _.clone(this._activeLayers);
		activeLayers.forEach(function (layer) {
			if (layer.layer) map.removeLayer(layer.layer);
			layer._flush();
		}, this);
	},

	_initLeaflet : function () {

		// create new map
		var map = this._map = app._map = L.map('map', {
			worldCopyJump : true,
			attributionControl : false,
			maxZoom : 19,
			minZoom : 0,
			// zoomAnimation : false
			zoomControl : false,
			inertia : false,
			// loadingControl : true,
			// zoomAnimationThreshold : 2
		});

		// add attribution
		this._addAttribution(map);


		// global map events
		map.on('zoomstart', function (e) {

			map.eachLayer(function (layer) {
				if (!layer.options) return;

				var layerUuid = layer.options.layerUuid;

				if (!layerUuid) return;

				// get wu layer
				var l = app.activeProject.getPostGISLayer(layerUuid);
		
				if (!l) return  
				
				l._invalidateTiles();
			});

			// send invalidate to pile
			this._invalidateTiles();

		}, this)


		// // on map load
		map.on('projectSelected', function (e) {
			// hack due to race conditions
			setTimeout(function () { 
				// enable layers that are marked as on by default
				var lm = app.MapPane.getControls().layermenu;
				lm && lm._enableDefaultLayers();
			}, 10);
		});

	},

	_addAttribution : function (map) {
		this._attributionControl = L.control.attribution({position : 'bottomleft', prefix : false});
		map.addControl(this._attributionControl);

		// this._attributionControl.addAttribution('<a href="http://systemapic.com">Powered by Systemapic.com</a>');
		this._attributionControl.addAttribution('<a class="systemapic-attribution-logo" href="http://systemapic.com" target="_blank"><img src="../images/systemapic-attribution-logo-white.png"></a>');
		this._attributionControl.removeAttribution('Leaflet');

		// slack event on attribution
		Wu.DomEvent.on(this._attributionControl._container, 'click', function () {
			app.Analytics.onAttributionClick();
		}, this);
	},

	_invalidateTiles : function () {
		var options = {
			access_token : app.tokens.access_token, // unique identifier
		}
	},

	_initControls : function () {
		var controls = this.options.controls;
		this._controls = {};
		_.each(controls, function (control) {
			this._controls[control] = new L.Control[control.camelize()];
		}, this);
	},

	getControls : function () {

		return this._controls;
	},

	_adjustLayout : function () {
		// this.setHeaderPadding();
	},

	_registerEvents : function () {
		app._map.on('moveend', this._onMove, this);
		app._map.on('zoomend', this._onZoom, this);
	},

	_onMove : function () {
		var project = this._project || app.activeProject;
		Wu.Mixin.Events.fire('projectChanged', {detail : {
			projectUuid : project.getUuid()
		}});
	},

	_onZoom : function () {

		var project = this._project || app.activeProject;
		Wu.Mixin.Events.fire('projectChanged', {detail : {
			projectUuid : project.getUuid()
		}});
	},

	// fired on window resize
	resizeEvent : function (d) {

		this._updateWidth(d);
	},
    
	_updateWidth : function (d) {
		var map = this._map;
		if (!map || !d) return;
		
		// set width
		map._container.style.width = d.width - parseInt(map._container.offsetLeft) + 'px';
		
		// refresh map size
		setTimeout(function() {
			if (map) map.reframe();
		}, 300); // time with css
	},
	
	getZIndexControls : function () {
		var z = {
			b : this._baselayerZIndex, // base
			l : this._layermenuZIndex  // layermenu
		}
		return z;
	},

	clearBaseLayers : function () {
		if (!this.baseLayers) return;
		
		this.baseLayers.forEach(function (base) {
			app._map.removeLayer(base.layer);
		});

		this.baseLayers = {};
	},

	setBaseLayers : function () { 

		// get baseLayers stored in project
		var baseLayers = this._project.getBaselayers();

		// return if empty
		if (!baseLayers) return;

		// add
		baseLayers.forEach(function (layer) {
			this.addBaseLayer(layer);
		}, this);
	},

	addBaseLayer : function (baseLayer) {
		// Wu.Layer
		var layer = this._project.layers[baseLayer.uuid];
		if (layer) layer.add('baselayer');
	},

	removeBaseLayer : function (layer) {

		map.removeLayer(base.layer);
	},

	_setLeft : function (width) {  
		this._container.style.left = width + 'px';
		this._container.style.width = parseInt(window.innerWidth) - width + 'px';
	},

	setHeaderPadding : function () {
		// set padding
		var map = this._map;
		var control = map._controlContainer;
		control.style.paddingTop = this._project.getHeaderHeight() + 'px';
	},

	setPosition : function (position) {
		var map = this._map;
		
		// get position
		var pos = position || this._project.getLatLngZoom();
		var lat = pos.lat;
		var lng = pos.lng;
		var zoom = pos.zoom;

		// set map options
		if (lat != undefined && lng != undefined && zoom != undefined) {
			map.setView([lat, lng], zoom);
		}
	},

	getPosition : function () {
		// get current lat/lng/zoom
		var center = this._map.getCenter();
		var position = {
			lat : center.lat,
			lng : center.lng,
			zoom : this._map.getZoom()
		}
		return position;
	},

	getActiveLayermenuLayers : function () {
		if (!this.layerMenu) return;

		var zIndexControl = app.zIndex;

		var layers = this.layerMenu.getLayers();
		var active = _.filter(layers, function (l) {
			return l.on;
		});

		var sorted = _.sortBy(active, function (l) {
			return zIndexControl.get(l.layer);
		});

		return sorted;
	},

	getActiveLayers : function () {

		return this._activeLayers;
	},

	addActiveLayer : function (layer) {
		this._activeLayers.push(layer);
	},

	clearActiveLayers : function () {

		this._activeLayers = [];
	},

	removeActiveLayer : function (layer) {
		_.remove(this._activeLayers, function (l) {
			return l.getUuid() == layer.getUuid();
		}, this);
	},

	setMaxBounds : function () {
		var map = app._map;
		var bounds = this._project.getBounds();

		if (!bounds) return;

		var southWest = L.latLng(bounds.southWest.lat, bounds.southWest.lng);
   		var northEast = L.latLng(bounds.northEast.lat, bounds.northEast.lng);
    		var maxBounds = L.latLngBounds(southWest, northEast);

    		// set maxBoudns
		map.setMaxBounds(maxBounds);
		map.options.minZoom = bounds.minZoom;
		map.options.maxZoom = bounds.maxZoom > 19 ? 19 : bounds.maxZoom;
	},
	
	addEditableLayer : function (map) {
		// create layer
		this.editableLayers = new L.FeatureGroup();
		map.addLayer(this.editableLayers);
	},

	updateControlCss : function () {

		// get controls
		var controls = this._project.getControls(),
		    legendsControl = controls.legends,
		    corners = app._map._controlCorners,
		    topleft = corners.topleft,
		    bottomright = corners.bottomright,
		    topright = corners.topright;


		// layermenu control
		if (controls.layermenu) {
			
			// Check for Layer Inspector
			if (controls.inspect) {
				Wu.DomUtil.removeClass(bottomright, 'no-inspector');
			} else {
				Wu.DomUtil.addClass(bottomright, 'no-inspector');
			}
		}

		// legend control
		if (controls.legends) {
			
			// get container
			var legendsContainer = controls.legends._legendsContainer;

			// Check for Layer Menu Control
			if (controls.layermenu) {
				if (legendsContainer) Wu.DomUtil.removeClass(legendsContainer, 'legends-padding-right');
			} else {
				if (legendsContainer) Wu.DomUtil.addClass(legendsContainer, 'legends-padding-right');
			}

			// Check for Description Control
			if (controls.description) {} 

		}

		// // scale control
		// if (controls.measure) {
		// 	if (controls.layermenu) {
		// 		topright.style.right = '295px';
		// 	} else {
		// 		topright.style.right = '6px';
		// 	}
		// }


		// todo?
		if (controls.mouseposition) {}
		if (controls.vectorstyle) {}
		if (controls.zoom) {}
		if (controls.baselayertoggle) {}
		if (controls.description) {} 
		if (controls.draw) {}
		if (controls.geolocation) {}
		if (controls.inspect) {}
	},

	resetControls : function () {

		// remove carto
		if (this.cartoCss) this.cartoCss.destroy();

		this.cartoCss 			= null;
		this._drawControl 		= null;
		this._drawControlLayer 		= null;
		this._scale 			= null;
		this.vectorStyle 		= null;
		this.layerMenu 			= null;
		this.legendsControl 		= null;
		this.descriptionControl 	= null;
		this.inspectControl 		= null;
		this.mousepositionControl 	= null;
		this.baselayerToggle 		= null;
		this.geolocationControl 	= null;

		// remove old controls
		delete this._drawControl;
		delete this._drawControlLayer;
		delete this._scale;
		delete this.vectorStyle;                // TODO, refactor
		delete this.layerMenu;
		delete this.legendsControl;
		delete this.descriptionControl;
		delete this.inspectControl;
		delete this.mousepositionControl;
		delete this.baselayerToggle;
		delete this.geolocationControl;
		delete this.cartoCss;
	},

	refreshControls : function () {
	},

	hideControls : function () {

		Wu.DomUtil.addClass(app._map._controlContainer, 'displayNone');
	},

	showControls : function () {

		Wu.DomUtil.removeClass(app._map._controlContainer, 'displayNone');
	},

	addLayer : function (layerID) {
		var layer = L.mapbox.tileLayer(layerID);
		layer.addTo(this._map);
	},

	_addLayer : function (layer) {

		layer.addto(this._map);
	},

	disableInteraction : function (noDrag) {
		var map = this._map || app._map;
		if (noDrag) map.dragging.disable();
		map.touchZoom.disable();
		map.doubleClickZoom.disable();
		map.scrollWheelZoom.disable();
		map.boxZoom.disable();
		map.keyboard.disable();
	},

	enableInteraction : function (noDrag) {
		var map = this._map || app._map;
		if (noDrag) map.dragging.enable();
		map.touchZoom.enable();
		map.doubleClickZoom.enable();
		map.scrollWheelZoom.enable();
		map.boxZoom.enable();
		map.keyboard.enable();
	},


	getEditableLayerParent : function (id) {
		// return id from _leaflet_id
		var layers = this.editableLayers._layers;
		for (l in layers) {
			for (m in layers[l]._layers) {
				if (m == id) return layers[l];
				var deep = layers[l]._layers[m];
				for (n in deep) {
					var shit = deep[n];
					if (n == id) return deep;
					for (o in shit) {
						if (o == id) return shit;
					}
				}
			}
		}
		return false;
	},


	// Create pop-up from draw
	_addPopupContentDraw : function (data) {
		this._addPopupContent(false, data)		
	},

	// Create pop-up
	_addPopupContent : function (e, multiPopUp) {
		var options = {
			e 		: e,
			multiPopUp 	: multiPopUp,
		};
		this._chart = new Wu.Control.Chart(options);
	},

	_clearPopup : function () {
		if (this._chart) {
			this._chart._refresh();
		}
	},

	
});
Wu.StatusPane = Wu.Class.extend({

	_ : 'statuspane', 

	initialize : function (options) {
		
		// set options
		Wu.setOptions(this, options);

		// init container
		this.initContainer();

		// add hooks
		this.addHooks();

	},

	initContainer : function () {
	},

	addHooks : function () {
	},


	tab : function (e) {
		if (e.keyCode == 9) this.toggle();
	},


	toggle : function () {
		this.isOpen ? this.close() : this.open();
	},

	// open sidepane menu
	open : function (e) {

		this.isOpen = true;
		
		// expand sidepane
		if (app.SidePane) app.SidePane.expand();

		// open left chrome
		app.Chrome.Left.open();

		// events for auto-closing of sidepane. clicking on map/header pane collapses the sidepane
		this._addAutoCloseEvents();
	},

	// close sidepane menu
	close : function (e) {
		
		// trying to stop event from propagating
		if (e) Wu.DomEvent.stop(e);

		this.isOpen = false;

		// collapse sidepane
		if (app.SidePane) app.SidePane.collapse();

		// close left chrome
		app.Chrome.Left.close();


		// removes the blur on map if it's set by one of the fullpanes
		Wu.DomUtil.removeClass(app.MapPane._container, "map-blur");

		// unregister auto-close events
		this._removeAutoCloseEvents();
	},

	_addAutoCloseEvents : function () {

		Wu.DomEvent.on(app.MapPane._container, 'click', this.close, this);

		if (app.StartPane._container) {
			
			Wu.DomEvent.on(app.StartPane._container, 'click', this.close, this);

			// disable "select project" event in startpane
			app.StartPane.disableHooks();
		}
	},

	_removeAutoCloseEvents : function () {

		Wu.DomEvent.off(app.MapPane._container, 'click', this.close, this);

	    	if (app.StartPane._container) {
	    		
	    		//necessary check for the state that follows after having chosen a project
			Wu.DomEvent.off(app.StartPane._container, 'click', this.close, this);

			// enable "select project" event in startpane
			app.StartPane.enableHooks();
		}
	},

	setHeight : function (height) {
		// set height
		this._container.style.height = parseInt(height) + 'px';
	},

	updateContent : function (project) {
		this.project = project;
		this.close();
	},

});

Wu.StartPane = Wu.Pane.extend({

	dimensions : {
		screenW 	: 	0,
		screenH 	: 	0,
		boxW 		: 	350,
		boxH 		: 	233,
		sizeMode 	: 	'',
		projectNo 	: 	0
	},

	projectContainers : [],

	_projectSelected : function (e) {
		this.deactivate();
	},

	activate : function () {

		this.isOpen = true;

		// create container
		this.initContainer();

		// add events
		this.addHooks();

		// refresh latest projects
		this.refreshProjects();

	},	

	deactivate : function() {

		this.isOpen = false;

		// remove hooks
		this.removeHooks();

		// kill spinner
		if (this._spinner) this._spinner.disable();

		// delete divs
		if (this._container) Wu.DomUtil.remove(this._container);

	},


	initContainer : function () {

		// create container 
		this._container = Wu.DomUtil.create('div', 'startpane-canvas-container', app._appPane);

		// create content for black box
		var content = this._initContent();
		this._wrapper = Wu.DomUtil.create('div', 'spinning-wrapper', this._container);

		this._wrapper.appendChild(content);

	},

	initSpinner : function () {

		
		// create spinner instance
		this._spinner = new L.SpinningMap({
			autoStart : true,
			accessToken : 'pk.eyJ1Ijoic3lzdGVtYXBpYyIsImEiOiJkV2JONUNVIn0.TJrzQrsehgz_NAfuF8Sr1Q',
			layer : 'systemapic.kcjonn12', 	// todo: several layers
			logo : 'images/griffon_logo_drop.png', // todo!
			content : content, 
			container : this._container,
			wrapper : this._wrapper,
			speed : 1000,
			tileFormat : 'png', // quality of mapbox tiles
			interactivity : false,
			gl : false,
			position : {
				lat : -33.83214,
				lng : 151.22299,
				zoom : [4, 17]
			},
			circle : false,
		});

	},

	_initContent : function () {

		// create wrapper
		var wrapper 			= Wu.DomUtil.create('div', 'startpane-spinning-content');

		// black box in centre
		this._bannerContainer    	= Wu.DomUtil.create('div', 'startpane-banner-container', wrapper);
		this._banner 			= Wu.DomUtil.create('div', 'startpane-banner', this._bannerContainer);

		this._recentProjectsContainer 	= Wu.DomUtil.create('div', 'startpane-recent-projects-container', this._banner);
		
		if ( this._getLatestProjects().length > 1 ){
			//1 and not 0 since hidden/default project is counted in

			//there are some projects for this user
			//console.log("has: " + this._getLatestProjects().length + " projects");
			this._recentProjectsHeader = Wu.DomUtil.create('h1', 'startpane-header-title', this._recentProjectsContainer, 'Latest projects:');

		} else {

			//there are no projects for this user
			
			if (app.access.to.create_project()) {
				//the user has access to create projects
				this._recentProjectsHeader = Wu.DomUtil.create('h1', 'startpane-header-title', this._recentProjectsContainer, 'Get started:');
				this._hasAccessMessage = Wu.DomUtil.create('p', 'startpane-has-access',this._recentProjectsContainer,'Hello ' +app.Account.getFirstName()+'.<br/>You have no projects yet. Choose one of your clients and click the respective button below to start a project.');
				this._clientsContainer = Wu.DomUtil.create('div', 'startpane-client-container',this._recentProjectsContainer);

				for (c in app.Clients) {
					var client = app.Clients[c];
					
					var logo = this._getPixelLogo(client.getLogo()) || ('/css/images/grayLight-systemapic-logo-circle-240x240.png'+'?access_token=' + app.tokens.access_token); //assign a default logo if none
					var name = client.getName();


					this._singleClientContainer = Wu.DomUtil.create('div', 'startpane-single-client-container',this._clientsContainer);
					
					this._logoContainer = Wu.DomUtil.create('div', 'startpane-client-logo', this._singleClientContainer, '<img src='+logo+'>');
					//adding the client name 
					this._clientDiv = Wu.DomUtil.create('div', 'startpane-client-name', this._singleClientContainer, '<p>' +name + '</p>');
					this._createProjectLink = Wu.DomUtil.create('div', 'startpane-new-project', this._singleClientContainer, '<p>Create new project.</p>');
					Wu.DomEvent.on(this._createProjectLink, 'mousedown', function() { this.createProjectFromClient(client); }, this);

					// add tooltip
					app.Tooltip.add(this._logoContainer, 'Click to create new project.');
				}

			} else {
				//the user has no access to create projects
				this._recentProjectsHeader = Wu.DomUtil.create('h1', 'startpane-header-title', this._recentProjectsContainer, 'No current projects.');
				this._hasNoAccessMessage = Wu.DomUtil.create('p', 'startpane-has-no-access',this._recentProjectsContainer,'Hello ' +app.Account.getFirstName()+',<br/>You are currently not participating in any projects, and you are not allowed to create a project. <br/>Please wait for an invitation.');
				
			}
		}	

		this._projectList = Wu.DomUtil.create('div', 'startpane-project-list', this._recentProjectsContainer);
		// return 
		return wrapper;
		
	},


	refreshProjects : function () {

		// clear old
		this._projectList.innerHTML = '';

		// get latest projects
		this.projects = this._getLatestProjects();

		// set number of projects 
		this.dimensions.projectNo = this.projects.length;

		if (!this.projects) return;

		// Pull out the latest three Projects	
		this.projects.forEach(function (project, i) {
			if (i > 5) return;
			// Create project container
			this.createStartProject(project);
		}, this);


		// Get screen dimensions
		var dims = app._getDimensions();

		// Store width and height
		this.dimensions.screenW = dims.width;
		this.dimensions.screenH = dims.height;	

		// run sizer
		this.positionSpinner(dims);

		this.addHooks();
	},

	_getLatestProjects : function () {

		// Get all projects
		var projectsUnsorted = app.Projects;
		
		// Sort them by last updated
		var projects = _.sortBy(projectsUnsorted, function(p) {
			return p.getLastUpdated();
		});

		// Reverse so we get newest first
		projects.reverse();

		return projects;
	},

	createStartProject : function (project) {

		if (!project) return;

		// var client = project.getClient();

		// if (!client) return;


		var newProject = {};

		// create container
		newProject._projectContainer = Wu.DomUtil.create('div', 'start-panne-recent-projects', this._projectList);
		newProject._projectThumb = Wu.DomUtil.create('img', '', newProject._projectContainer);

		// Load image in memory before we paste it (to see image orientation)
		var img = new Image();

		// Serve project logo or a random predefined thumb image
		var ssrc = (project.getLogo() || app.options.servers.portal + 'css/images/default-thumbs/default-thumb-' + Math.floor(Math.random() * 10) + '.jpg') + '?access_token=' + app.tokens.access_token;
		img.src = ssrc ;



		var boxW    = this.dimensions.boxW;
		var boxH    = this.dimensions.boxH;

		img.onload = function() {


			var wProp = img.width / boxW;
			var hProp = img.height / boxH;

			if ( hProp <= wProp ) {

				// landscape
				newProject._projectThumb.style.height = '100%';
				newProject._projectThumb.style.width = 'auto';

			} else {
				
				// portrait
				newProject._projectThumb.style.height = 'auto';
				newProject._projectThumb.style.width = '100%';
			
			}

			newProject._projectThumb.src = ssrc; 
		}

		newProject._projectTitle = Wu.DomUtil.create('div', 'start-project-name', newProject._projectContainer);
		newProject._projectTitle.innerHTML = project.getName();

		// newProject._clientName = Wu.DomUtil.create('div', 'start-project-client-name', newProject._projectContainer);
		// newProject._clientName.innerHTML = client.getName();

		// if (client.getLogo()) {
		// 	newProject._clientLogo = Wu.DomUtil.create('img', 'start-project-client-logo', newProject._projectContainer);
		// 	newProject._clientLogo.src = client.getLogo() + '?access_token=' + app.tokens.access_token;
		// }

		this.projectContainers.push(newProject);

		// Adjust for short titles
		if (project.getName().length < 22) Wu.DomUtil.addClass(newProject._projectTitle, 'short-name');
		
		// select project hook
		Wu.DomEvent.on(newProject._projectContainer, 'click', function() { this.selectProject(project); }, this);

	},

	addHooks : function () {

	},
	removeHooks : function () {

	},

	enableHooks : function () {
		this._hooksDisabled = false;
	},

	disableHooks : function () {
		this._hooksDisabled = true;
	},

	selectProject : function(project) {

		// a hack to disable hook temporarily
		if (this._hooksDisabled) return;

		// refresh sidepane
		// app.SidePane.refreshMenu();

		Wu.Mixin.Events.fire('projectSelected', { detail : {
			projectUuid : project.getUuid()
		}});  

		// // Hide the Start Pane
		this.deactivate();

		// // Google Analytics event trackign
		// app.Analytics.setGaPageview(project.getUuid());

	},


	update : function() {

	},


	createImage : function () {

		var that = this;	// callback
		app.setHash(function (ctx, hash) {

			// get snapshot from server
			Wu.post('/api/util/snapshot', hash, that.createdImage, that);

		});
	},

	createdImage : function (context, file) {

		// parse results
		var result = JSON.parse(file);
		var image = result.image;

		// set path
		var path = app.options.servers.portal;
		path += 'pixels/';
		path += image;
		var raw = path;
		path += '?width=' + 250;
		path += '&height=' + 150;

		// set url
		var url = 'url("';
		url += path;
		url += '")';
	},


	resizeEvent : function (dimensions) {

		this.positionSpinner(dimensions);

	},

	positionSpinner : function (dimensions) {
		
		var w = dimensions.width;
		var h = dimensions.height;

		if ( h != this.dimensions.screenH ) {
			this.dimensions.screenH = h;
			this.changeHeight(dimensions);
		}


		// 3 blocks wide
		if ( w >= 1091 ) {
			if ( this.dimensions.sizeMode == 'full' ) return;
			this.dimensions.sizeMode = 'full';
			this.setYposition(dimensions);
		}

		// 2 blocks wide
		if ( w <= 1090 && w >= 761) {
			if ( this.dimensions.sizeMode == 'medium' ) return;
			this.dimensions.sizeMode = 'medium';
			this.setYposition(dimensions);
		} 

		// 1 block wide
		if ( w <= 760 ) {
			if ( this.dimensions.sizeMode == 'small' ) return;
			this.dimensions.sizeMode = 'small';
			this.setYposition(dimensions);
		}

	},

	changeHeight : function (dimensions) {
		this.setYposition(dimensions);
	},

	setYposition : function (dimensions) {

		var w = dimensions.width;
		var h = dimensions.height;

		// 3 projects wide
		if ( this.dimensions.sizeMode == 'full' ) {

			// Decide how many projects we want to show based on height
			if ( h >= 691 ) 		this.showBoxes(6);
			if ( h <= 690 ) 		this.showBoxes(3);

			// figure out padding
			if ( this.dimensions.projectNo >= 4 ) 	var fullH = this.dimensions.boxH * 2;
			else 					var fullH = this.dimensions.boxH;

			// calculate padding
			this.calcPadding(h, fullH);

		}

		// 2 projects wide
		if ( this.dimensions.sizeMode == 'medium' ) {
		
			// Decide how many projects we want to show based on height
			if ( h >= 921 ) 		this.showBoxes(6);		
			if ( h <= 920 && h >= 661 ) 	this.showBoxes(4);	
			if ( h <= 660 ) 		this.showBoxes(2);		
		
			// figure out padding
			if ( this.dimensions.projectNo >= 5 )						var fullH = this.dimensions.boxH * 3;	// 3 rows (5 or 6 projects)
			else if ( this.dimensions.projectNo >= 3 && this.dimensions.projectNo <=4 )	var fullH = this.dimensions.boxH * 2; 	// 2 rows (3 or 4 projects)
			else 										var fullH = this.dimensions.boxH;	// 1 row  (1 or 2 projects)	

			// calculate padding
			this.calcPadding(h, fullH);

		}

		// 1 project wide
		if ( this.dimensions.sizeMode == 'small' ) {
		
			// Decide how many projects we want to show based on height
			if ( h >= 921 ) 		this.showBoxes(3);	
			if ( h <= 920 && h >= 661 ) 	this.showBoxes(2);
			if ( h <= 660 ) 		this.showBoxes(1);
		
			// figure out padding
			if ( this.dimensions.projectNo >= 3 )						var fullH = this.dimensions.boxH * 3;
			else if ( this.dimensions.projectNo == 2 )					var fullH = this.dimensions.boxH * 2;
			else if ( this.dimensions.projectNo == 1 )					var fullH = this.dimensions.boxH;

			// calculate padding
			this.calcPadding(h, fullH);

		}


	},

	showBoxes : function (no) {

		// Store how many projects we want to show
		this.dimensions.projectNo = no;

		for (var i = 0; i < this.projects.length; i++) {
			if (i < no) {
				var project = this.projectContainers[i];
				if (project) Wu.DomUtil.removeClass(project._projectContainer, 'displayNone');
			} else {
				var project = this.projectContainers[i];
				if (project) Wu.DomUtil.addClass(project._projectContainer, 'displayNone');
			}	    
		}

	},

	// Calculates top padding of container
	calcPadding : function(screenHeight, boxesHeight) {

			// Calculate padding
			var padding = Math.floor((screenHeight - boxesHeight)/2);

			// Minimum padding is 100 pixels
			if ( padding <= 100 ) padding = 100;

			// Set padding
			this._wrapper.style.paddingTop = padding + 'px';

	},

	//creates a new default project for a client that has none
	createProjectFromClient : function (client) {
		var position = app.options.defaults.project.position;
		var store = {
			name : 'Project title',
			description : 'Project description',
			createdByName : app.Account.getName(),
			keywords : '',
			client : client.getUuid(),
			position : position || {},
			bounds : {
				northEast : {
					lat : 0,
					lng : 0
				},
				southWest : {
					lat : 0,
					lng : 0
				},
				minZoom : 1,
				maxZoom : 22
			},
			header : {
				height : 50
			},
			folders : []
		}
		// create new project with options, and save
		var project = new Wu.Project(store);
		project.editMode = true;

		var sidepaneClient = this._getSidepaneClient(client);

		var options = {
			store : store,
			callback : sidepaneClient._projectCreated,
			context : sidepaneClient
		}

		project._saveNew(options);

		// Google Analytics event tracking
		app.Analytics.setGaEvent(['Start Pane', 'Clients: new project']);	
		this.deactivate();
	},

	_projectCreated : function (project, json) {

		var result = Wu.parse(json),
		    error  = result.error,
		    store  = result.project;

		// return error
		if (error) return app.feedback.setError({
			title : 'There was an error creating new project!', 
			description : error
		});
			
		// add to global store
		app.Projects[store.uuid] = project;

		console.log('store', store);
		// update project store
		project.setNewStore(store);

		// create project in sidepane
		this._createNewProject(project);

	},

	//helper function
	_getSidepaneClient : function (client){
		var array = app.SidePane.Clients.clients;
		var client = _.find(array,function(a){ 
			return a.client.getUuid() == client.getUuid(); 
			});
		return client;
	},

	_getPixelLogo : function (logo) {
		if (!logo) return false;
		var base;
		base = logo.split('/')[2];
		var url = '/pixels/image/' + base + '?width=250&height=250&format=png'+'&access_token=' + app.tokens.access_token;;
		return url;
	}
});


Wu.FeedbackPane = Wu.Class.extend({

	initialize : function () {

		// create container
		this.initContainer();

		// shortcut	
		app.feedback = this;

		// concurrent messages stored here
		this._messages = {};

		// Used to know the order (which message is oldest)
		this._messagesArray = [];
	},

	initContainer : function () {

		var appendHere = app.MapPane._map._controlCorners.topleft;

		this._container = Wu.DomUtil.create('div', 'feedback-pane', appendHere);
		this._innerWrapper = Wu.DomUtil.create('div', 'feedback-pane-inner-wrapper', this._container);

       		Wu.DomEvent.on(this._container, 'click', Wu.DomEvent.stopPropagation)
            
		// .on(link, 'dblclick', L.DomEvent.stopPropagation)
		// .on(link, 'click', L.DomEvent.preventDefault)
		// .on(link, 'click', fn, this);
		// return link;

	},

	set : function (options) {
		this.add(options);
	},
	
	setMessage : function (options) {
		this.add(options, 1); 	// neutral message
	},

	setSuccess : function (options) {
		this.add(options, 1);	// success message
	},
	
	setError : function (options) {
		this.add(options, 3); 	// error message
	},

	setAction : function (options) {
		this.add(options, 4); 	// action message
	},

	add : function (message, severity) {

		// Create random number
		var id = Wu.Util.createRandom(5);

		// gets passed from sidepane.dataLibrary.js
		if (message.id) id = message.id;

		var options = {
			container 	: this._container,
			innerWrapper 	: this._innerWrapper,   // Used to see if inner wrapper overflow container
			id : id,
			severity : severity || 3 // error default
		}		

		var pane = this._messages[id];
		
		if (pane) {
			
			this.update(message, severity);

		} else {

			// create and save in stack
			this._messages[id] = new Wu.FeedbackPane.Message(Wu.extend(options, message));

			// Store message boxes in array
			this._messagesArray.push(this._messages[id]);
		}

		// If messages overflow its container: remove the oldest element message
		this.checkOverflow();
	},

	// Check if message boxes overflow container, and remove the oldest message if it does
	checkOverflow : function() {
		var containerMaxHeight  = 700;
		var innerHeight 	= this._innerWrapper.offsetHeight;
		var diff 		= containerMaxHeight - 100 - innerHeight;
		
		if (diff < 0) {
			var remId = this._messagesArray[0].options.id;
			this.remove(remId);
			this._messagesArray.splice(0, 1);
		}

	},

	// Update message box, if it exists before
	update : function (message, severity) {

		var title 	   = message.title;
		var description    = message.description;
		var id 		   = message.id;
		var newTitle 	   = Wu.DomUtil.create('div', 'feedback-pane-title2', 	    this._messages[id]._content, title);
		var newDescription = Wu.DomUtil.create('div', 'feedback-pane-description2', this._messages[id]._content, description);		

		// Update severity
		this._messages[id].options.severity = severity;
		this._messages[id].setSeverity(severity);

	},

	remove : function (id) {

		// delete container and object
		var pane = this._messages[id];
		if (!pane) return;

		var container = pane._content;
		Wu.DomUtil.remove(container);
		delete this._messages[id];
	},
});



Wu.FeedbackPane.Message = Wu.Class.extend({

	options : {

		clearTimer : true,
		// clearDelay : 200000,
		clearDelay : 4500,
		transitionDelay : 0.5, 
		severityStyle : {
			1 : 'message',
			2 : 'success',
			3 : 'error',
			4 : 'action'
		}
	},

	initialize : function (options) {
		
		// set options
		Wu.setOptions(this, options);

		// init layout
		this.initLayout();

		// set message
		this.set();

	},

	initLayout : function () {

		// create divs
		// this._innerWrapper = Wu.DomUtil.create('div', 'feedback-pane-inner-wrapper', this.options.container);			

		// this._content = Wu.DomUtil.create('div', 'feedback-pane-content', this.options.container);
		this._content 		= Wu.DomUtil.create('div', 'feedback-pane-content', 	this.options.innerWrapper);
		this._title 		= Wu.DomUtil.create('div', 'feedback-pane-title', 	this._content);
		this._icon 		= Wu.DomUtil.create('div', 'feedback-pane-icon', 	this._content);
		this._iconImg 		= Wu.DomUtil.create('img', 'feedback-pane-icon-img', 	this._icon);
		this._description 	= Wu.DomUtil.create('div', 'feedback-pane-description', this._content);
		
		// set transition
		this._content.style.opacity = 0;
		this._content.style.webkitTransition = 'opacity ' + this.options.transitionDelay + 's';
		this._content.style.transition 	     = 'opacity ' + this.options.transitionDelay + 's';

		// x
		this._x = Wu.DomUtil.create('div', 'feedback-pane-x displayNone', this._content, 'X');

		// events
		this.addEvents();

	},

	addEvents : function () {
		// close on click
		Wu.DomEvent.on(this._x, 'click', this.clear, this);

		Wu.DomEvent.on(this._content, 'mouseenter', this._mouseEnter, this);
		Wu.DomEvent.on(this._content, 'mouseleave', this._mouseLeave, this);
	},

	set : function () {
	
		// set view
		this.setTitle();
		this.setDescription();
		this.setSeverity();
		this.setIcon();

		// show
		this.show();

		// clear after timeout
		this.clearTimer();
	},

	_mouseEnter : function () {
		this._cancelTimer();
	},

	_mouseLeave : function () {
		this.clearTimer(this.options.clearDelay/4);
	},

	_cancelTimer : function () {
		if (this._clearTimer && !app.debug) clearTimeout(this._clearTimer);
	},

	clearTimer : function (delay) {
		if (!this.options.clearTimer || app.debug) return;
		this._clearTimer = setTimeout(this.clear.bind(this), delay || this.options.clearDelay);
	},

	clear : function () {
		this.hide();
	},

	setTitle : function () {
		this._title.innerHTML = this.options.title;
	},

	setDescription : function () {
		this._description.innerHTML = this.options.description || '';
	},

	setIcon : function () {
		if (!this.options.icon) return;
		this._iconImg.setAttribute('src', this.options.icon);
	},

	setSeverity : function (s) {
		var s = this.options.severity;
		if (s) this.setStyle(this.options.severityStyle[s]);
		
	},

	setStyle : function (style) {

		var _style    = [];
		    _style[0] = this.options.severityStyle[1];
		    _style[1] = this.options.severityStyle[2];
		    _style[2] = this.options.severityStyle[3];
		    _style[3] = this.options.severityStyle[4];

		// Remove previous styles, and set the new one
		_style.forEach(function(s) {

			if ( s == style ) Wu.DomUtil.addClass(this._content, style);
			else 		  Wu.DomUtil.removeClass(this._content, s);

		}, this);

	},

	setBackground : function (color) {
		this._content.style.background = color;
	},

	hide : function () {

		this._content.style.opacity = 0;
		setTimeout(function () {
			app.feedback.remove(this.options.id);
		}.bind(this), this.options.transitionDelay * 1000); // timed with css transition
		
	},

	show : function () {
		setTimeout(function () {
			this._content.style.opacity = 1;
		}.bind(this), 5); // dom hack
	}

});



Wu.Share = Wu.Pane.extend({
	
	type : 'share',
	title : 'Share',

	options : {
		permissions : [{
			title : 'View project',
			permission : 'read_project',
			checked : true,
			enabled : false
		},{
			title : 'Download data',
			permission : 'download_file',
			checked : false,
			enabled : true
		},{
			title : 'Invite others',
			permission : 'share_project',
			checked : true,
			enabled : true
		}]
	},

	initialize : function (options) {

		// set options
		Wu.setOptions(this, options);

		// init container
		this._initContent();
		
		// listen up (events on parent)
		this._listen();
	},      

	_initContent : function () {

		// create layout
		this._initLayout();

		// put button in top chrome
		this._registerButton();
	},

	_initLayout : function () {

		// create dropdown
		this._shareDropdown = Wu.DomUtil.create('div', 'share-dropdown displayNone', app._appPane);

		// items
		this._shareImageButton = Wu.DomUtil.create('div', 'share-item', this._shareDropdown);
		this._sharePrintButton = Wu.DomUtil.create('div', 'share-item', this._shareDropdown);
		this._shareInviteButton  = Wu.DomUtil.create('div', 'share-item', this._shareDropdown);

		// enter titles
		// this._fillTitles();

		// Print (PDF) – cog
		this._processingPrint = Wu.DomUtil.create('i', 'fa fa-cog', this._sharePrintButton);
		

		// events
		Wu.DomEvent.on(this._shareImageButton,  'click', this._shareImage, this);
		Wu.DomEvent.on(this._sharePrintButton,  'click', this._sharePrint, this);
	},

	_registerButton : function () {

		// register button in top chrome
		var top = app.Chrome.Top;

		// add a button to top chrome
		this._shareButton = top._registerButton({
			name : 'share',
			className : 'chrome-button share',
			trigger : this._togglePane,
			context : this,
			project_dependent : true
		});

		// share icon
		this._shareButton.innerHTML = '<i class="fa fa-paper-plane"></i>';
	},

	_togglePane : function () {
		this._isOpen ? this._close() : this._open();
	},

	_open : function () {

		// close other tabs
		Wu.Mixin.Events.fire('closeMenuTabs');

		Wu.DomUtil.removeClass(this._shareDropdown, 'displayNone');
		this._isOpen = true;

		// add fullscreen click-ghost
		// this._addGhost();

		// mark button active
		Wu.DomUtil.addClass(this._shareButton, 'active');

		// fill titles
		this._fillTitles();
	},

	_close : function () {
		Wu.DomUtil.addClass(this._shareDropdown, 'displayNone');
		this._isOpen = false;

		// remove links if open
		if (this._shareLinkWrapper) Wu.DomUtil.remove(this._shareLinkWrapper);
		if (this._sharePDFInput) Wu.DomUtil.remove(this._sharePDFInput);
		if (this._inviteWrapper) Wu.DomUtil.remove(this._inviteWrapper);
		
		this._shareInviteButton.innerHTML = 'Invite users...';
		Wu.DomUtil.removeClass(this._shareDropdown, 'wide-share');

		// remove ghost
		// this._removeGhost();

		// mark button inactive
		Wu.DomUtil.removeClass(this._shareButton, 'active');
	},

	_onCloseMenuTabs : function () {
		
		// app.Chrome();
		this._close();
	},


	_fillTitles : function () {
		this._shareImageButton.innerHTML = 'Share Image';
		this._sharePrintButton.innerHTML = 'Share PDF';
		this._shareInviteButton.innerHTML = 'Invite to project';
	},

	_clearTitles : function () {
		this._shareImageButton.innerHTML = '';
		this._sharePrintButton.innerHTML = '';
		this._shareInviteButton.innerHTML = '';
	},

	_addGhost : function () {
		this._ghost = Wu.DomUtil.create('div', 'share-ghost', app._appPane);
		Wu.DomEvent.on(this._ghost, 'click', this._close, this);
	},

	_removeGhost : function () {
		if (!this._ghost) return; 
		Wu.DomEvent.off(this._ghost, 'click', this._close, this);
		Wu.DomUtil.remove(this._ghost);
	},

	// on select project
	_refresh : function () {

		// can share
		// var canShare = app.access.to.share_project(this._project);

		var project = this._project;

		if (project.isShareable()) {
			Wu.DomUtil.removeClass(this._shareInviteButton, 'disabled');
			Wu.DomEvent.on(this._shareInviteButton, 'click', this._shareInvite, this);
		} else {
			Wu.DomUtil.addClass(this._shareInviteButton, 'disabled');
			Wu.DomEvent.off(this._shareInviteButton, 'click', this._shareInvite, this);
		}

		
	},

	// _refreshDefaultPermission : function () {

	// 	this.options.permissions = [{
	// 		title : 'View project',
	// 		permission : 'read_project',
	// 		checked : true,
	// 		enabled : false
	// 	},{
	// 		title : 'Download data',
	// 		permission : 'download_file',
	// 		checked : false,
	// 		enabled : app.access.to.download_file(this._project)
	// 	},{
	// 		title : 'Invite others',
	// 		permission : 'share_project',
	// 		checked : true,
	// 		enabled : true
	// 	}]

	// },

	_shareImage : function () {

		app.setHash(function (ctx, hash) {

			// get snapshot from server
			Wu.send('/api/util/snapshot', hash, function (a, b) {
				this._createdImage(a, b);
			}.bind(this), this);

		}.bind(this));

		// set progress bar for a 5sec run
		app.ProgressBar.timedProgress(5000);
	},

	_createdImage : function (context, file, c) {

		// parse results
		var result = Wu.parse(file);
		var image = result.image;
		var path = app.options.servers.portal;
		path += 'pixels/';
		path += image;
		path += '?raw=true'; // add raw to path
		path += '&access_token=' + app.tokens.access_token;

		// open (note: some browsers will block pop-ups. todo: test browsers!)
		window.open(path, 'mywindow')

		// close share dropdown
		this._close();

		var project = app.activeProject;

		app.Analytics.onScreenshot({
			project_name : project.getName(),
			file_id : image
		});

	},

	_shareLink : function () {

		// create hash, callback
		app.setHash(function (context, hash) {

			// open input box
			this._createLinkView(hash);

		}.bind(this));

	},

	_createLinkView : function (result) {

		var link = Wu.parse(result);
		var shareLink = window.location.href + '/' + link.hash.id;

		this._insertShareLink(shareLink);
	},

	_insertShareLink : function (url) {

		if (this._shareLinkInput) Wu.DomUtil.remove(this._shareLinkInput);

		// create wrapper
		this._shareLinkWrapper = Wu.DomUtil.create('div', 'share-link-wrapper');

		// title
		var titleDiv = Wu.DomUtil.create('div', 'share-copy-link-title', this._shareLinkWrapper, 'Copy sharelink:');

		// create input
		this._shareLinkInput = Wu.DomUtil.create('input', 'share-input', this._shareLinkWrapper);
		this._shareLinkInput.value = url;

		// add to dom
		this._shareDropdown.appendChild(this._shareLinkWrapper);

		// select content of input
		this._shareLinkInput.select();

		this._clearTitles();

	},

	_sharePrint : function () {

		var that = this;	// callback
		app.setHash(function (ctx, hash) {

			var h = JSON.parse(hash);
			h.hash.slug = app.activeProject.getName();
			var json = JSON.stringify(h); 

			// get snapshot from server
			Wu.post('/api/util/pdfsnapshot', json, that._createdPrint, that);

		});

		// xoxoxoxoxox
		// Wu.DomUtil.addClass('this._sharePrintButton', )
		


		// set progress bar for a 5sec run
		app.ProgressBar.timedProgress(5000);
	},

	_createdPrint : function (context, file) {
		
		// parse results
		var result = JSON.parse(file);
		var pdf = result.pdf;

		// set path for zip file
		var path = app.options.servers.portal + 'api/file/download?file=' + pdf + '&type=pdf'+ '&access_token=' + app.tokens.access_token;

		// insert open pdf link
		context._insertPDFLink(path);

		// hide progress bar
		app.ProgressBar.hideProgress();
	},

	_insertPDFLink : function (url) {

		// remove old
		if (this._sharePDFInput) Wu.DomUtil.remove(this._sharePDFInput);

		// create input
		this._sharePDFInput = Wu.DomUtil.create('a', 'share-link-pdf');
		this._sharePDFInput.href = url;
		this._sharePDFInput.target = '_blank';
		this._sharePDFInput.innerHTML = 'Open PDF';

		// add to dom
		this._shareDropdown.appendChild(this._sharePDFInput);
	},


	_shareInvite : function () {

		app.Chrome.Left._tabs.projects.openShare()
		this._close();

		// Wu.DomUtil.addClass(this._shareDropdown, 'wide-share');
		// this._createInviteView();
	},

	// _createInviteView : function () {

	// 	// get invite link
	// 	this._getInviteLink(false, function (ctx, link) {

	// 		// clear other shares
	// 		this._clearTitles();

	// 		// clear old
	// 		if (this._inviteOuterWrapper) Wu.DomUtil.remove(this._inviteOuterWrapper);

	// 		// invite wrapper
	// 		this._inviteOuterWrapper = Wu.DomUtil.create('div', 'share-invite-wrapper opacitizer', this._shareDropdown);
	// 		this._inviteWrapper = Wu.DomUtil.create('div', 'share-invite-wrapper-inner', this._inviteOuterWrapper);

	// 		// hide invite button
	// 		this._shareInviteButton.innerHTML = '';

	// 		// insert title
	// 		this._insertInviteTitle(this._inviteWrapper, link);

	// 	}.bind(this));
	// },


	// _insertInviteTitle : function (appendTo, link) {

	// 	// wrap
	// 	var titleWrap = Wu.DomUtil.create('div', 'share-invite-title-wrap', appendTo);

	// 	// create first part of title
	// 	var pre = Wu.DomUtil.create('div', 'share-invite-title', titleWrap);
	// 	pre.innerHTML = 'Invite users to project:<br> <span style="font-weight: 900">' + this._project.getTitle() + '</span>';

	// 	// create last part of title
	// 	var post = Wu.DomUtil.create('div', 'share-invite-title-post', titleWrap);	 
	// 	post.innerHTML = 'Invite users to this project by sending them this link:';		

	// 	// link input
	// 	this._createInviteLink(titleWrap, link)

	// 	// permissions
	// 	this._createPermissionsCheckboxes({
	// 		appendTo : titleWrap,
	// 	});
	// },

	// _createInviteLink : function (titleWrap, link) {
	// 	var input = this._linkinput = Wu.DomUtil.create('input', 'share-invite-input-link', titleWrap);
	// 	input.value = link;
	// 	input.select();
	// },

	// _createPermissionsCheckboxes : function (options) {

	// 	var container = options.appendTo;

	// 	// wrapper
	// 	var wrapper = Wu.DomUtil.create('div', 'invite-permissions-wrapper', container);

	// 	// title
	// 	var title = Wu.DomUtil.create('div', 'share-invite-permission-title', wrapper, 'Permissions granted:');

	// 	// create checkboxes
	// 	this._createCheckboxes(wrapper);
	// },

	// _createCheckboxes : function (wrapper) {
	// 	this._checkboxes = [];
	// 	var items = this.options.permissions;
	// 	items.forEach(function (i) {
	// 		var permission = i.permission;
	// 		var title = i.title;
	// 		this._createCheckbox(permission,  wrapper, title, i.checked, i.enabled);
	// 	}, this);
	// },

	// _createCheckbox : function (id, container, title, checked, enabled) {

	// 	// wrapper
	// 	var w = Wu.DomUtil.create('div', 'invite-permissions-checkbox-wrap', container);


	// 	var _switch = new Wu.button({
	// 		id 	     : id,
	// 		type 	     : 'switch',
	// 		isOn 	     : checked,
	// 		right 	     : false,
	// 		disabled     : !enabled,
	// 		appendTo     : w,
	// 		fn 	     : this._checkboxChange.bind(this),
	// 		className    : 'relative-switch'
	// 	});

	// 	// label
	// 	var label = Wu.DomUtil.create('label', 'invite-permissions-label', w);
	// 	label.htmlFor = id;
	// 	label.appendChild(document.createTextNode(title));

	// 	// add to list
	// 	this._checkboxes.push(_switch);
	// },

	// _checkboxChange : function (e, on) {

	// 	var checkbox = e.target;
	// 	var checked = checkbox.getAttribute('checked');

	// 	var permissions = this._getPermissions();

	// 	// get invite link
	// 	this._getInviteLink(permissions, function (ctx, link) {
	// 		this._linkinput.value = link;
	// 	}.bind(this));
	// },

	_getPermissions : function () {
		var p = [];

		this._checkboxes.forEach(function (c) {
			var div = c._switch;
			var value = c.value;
			var checked = div.getAttribute('state');
			if (checked == 'true') p.push(value);
		});

		return p;
	},


	_getInviteLink : function (permissions, callback) {

		// get default permissions
		var plucked = _.pluck(_.where(this.options.permissions, { 'checked' : true }), 'permission');
		var permissions = permissions || plucked;

		var options = {
			project_id : this._project.getUuid(),
			project_name : this._project.getTitle(),
			access_type : 'view',
			permissions : permissions
		}

		// slack
		app.Analytics.onInvite(options);

		// get invite link
		Wu.post('/api/invite/link', JSON.stringify(options), callback);
	},


	_toggleInviteType : function () {

		var type = this._inviteTypeToggle.innerHTML;

		if (type == 'view') {
			this._inviteTypeToggle.innerHTML = 'edit';
		}

		if (type == 'edit') {
			this._inviteTypeToggle.innerHTML = 'view';
		}
	},

	

});

Wu.MapSettingsPane = Wu.Pane.extend({
	
	type : 'mapsettingspane',
	title : 'Map settings pane',

	options : {
	},

	_initialize : function (options) {

		// init container
		this._initContent();
	},      

	_initContent : function () {

		// create layout
		this._initLayout();

		// put button in top chrome
		this._registerButton();
	},

	// on select project
	_refresh : function () {

		// flush
		this._flush();

		if (!this._checkAccess()) return;

		// create
		this.initSettings('Controls');
		this.initBoundPos('Bounds & Position');		
	},

	_flush : function () {
		if (this._settingsDropdown) this._settingsDropdown.innerHTML = '';
	},

	_checkAccess : function () {
		if (!this._project) return false;

		if (this._project.isEditable()) {
			// this._settingsButton.style.display = '';
			Wu.DomUtil.removeClass(this._settingsButton, 'disabledBtn');
			return true;
		} else {
			// this._settingsButton.style.display = 'none';
			Wu.DomUtil.addClass(this._settingsButton, 'disabledBtn');
			return false;
		}
	},

	_registerButton : function () {

		// register button in top chrome
		var top = app.Chrome.Top;

		// add a button to top chrome
		this._settingsButton = top._registerButton({
			name : 'settings',
			className : 'chrome-button settings',
			trigger : this._togglePane,
			context : this,
			project_dependent : true
		});

		// css experiement
		this._settingsButton.innerHTML = '<i class="top-button fa fa-gear"></i>Options';
	},

	_initLayout : function () {

		// create dropdown
		this._settingsDropdown = Wu.DomUtil.create('div', 'settings-dropdown displayNone', app._appPane);

	},

	_togglePane : function () {
		if (!this._project.isEditable()) return; // safeguard
		
		this._isOpen ? this._close() : this._open();
	},

	_open : function () {

		// close other tabs
		Wu.Mixin.Events.fire('closeMenuTabs');

		Wu.DomUtil.removeClass(this._settingsDropdown, 'displayNone');

		this._isOpen = true;

		// add fullscreen click-ghost
		// this._addGhost();

		// mark button active
		Wu.DomUtil.addClass(this._settingsButton, 'active');

	},

	_close : function () {

		Wu.DomUtil.addClass(this._settingsDropdown, 'displayNone');

		this._isOpen = false;

		// remove ghost
		// this._removeGhost();

		// mark button inactive
		Wu.DomUtil.removeClass(this._settingsButton, 'active');
	},

	_onCloseMenuTabs : function () {
		
		// app.Chrome();
		this._close();
	},

	_addGhost : function () {
		this._ghost = Wu.DomUtil.create('div', 'share-ghost', app._appPane);
		Wu.DomEvent.on(this._ghost, 'click', this._close, this);
	},

	_removeGhost : function () {
		if (!this._ghost) return;
		Wu.DomEvent.off(this._ghost, 'click', this._close, this);
		Wu.DomUtil.remove(this._ghost);
	},

	
	_refreshDefaultPermission : function () {
	},

	// Creates section with meta field lines
	initSettings : function (title) {


		var sectionWrapper = Wu.DomUtil.create('div', 'chrome-content-section-wrapper', this._settingsDropdown)
		var header = Wu.DomUtil.create('div', 'chrome-content title', sectionWrapper, title);

		var options = {

			zoom : {
				enable : true,
				name   : 'Zoom'
			},
			draw : {
				enable : true,
				name   : 'Draw'
			},
			description : {
				enable : true,
				name   : 'Description/legend'
			},
			measure : {
				enable : true,
				name   : 'Measure'		
			},
			mouseposition : {
				enable : true,
				name   : 'Mouse position'
			},
			geolocation : {
				enable : true,
				name   : 'Geo search'				
			},

			// Inactive
			layermenu : {
				enable : false,
				name   : 'Layer menu'
			},
			legends : {
				enable : false,
				name   : 'Legend'
			},
			baselayertoggle : {
				enable : false,
				name   : 'Base layer toggle'
			},
			cartocss : {
				enable : false,
				name   : 'CartoCSS'
			},
		}

		// Get control
		var project = app.activeProject;

		for (var key in options) {			
			
			var enable  = options[key].enable;			

			if (enable) {

				var title = options[key].name;

				var line = new Wu.fieldLine({
					id       : key,
					appendTo : sectionWrapper,
					title    : title,
					input    : false,
				});		

				var _switch = new Wu.button({ 
					id 	 : key,					
					type 	 : 'switch',
					isOn 	 : project.store.controls[key],
					right 	 : false,
					appendTo : line.container,
					fn 	 : this._saveSwitch.bind(this),
				});
			}
		}
	},

	initBoundPos : function (title) {

		var sectionWrapper = Wu.DomUtil.create('div', 'chrome-content-section-wrapper', this._settingsDropdown)
		var header = Wu.DomUtil.create('div', 'chrome-content title', sectionWrapper, title);

		var isBoundsSet = this.isBoundsSet();

		// Line
		var boundsLine = new Wu.fieldLine({
			id        : 'bounds',
			appendTo  : sectionWrapper,
			title     : 'Bounds',
			className : 'no-padding',
			input     : false,
		});

		// Switch
		var setClearBounds = new Wu.button({ 
			id 	 : 'bounds',
			type 	 : 'setclear',
			isOn 	 : isBoundsSet,
			right 	 : false,
			appendTo : boundsLine.container,
			fn 	 : this._saveSetClear.bind(this),
		});

		// Line
		var positionLine = new Wu.fieldLine({
			id        : 'position',
			appendTo  : sectionWrapper,
			title     : 'Position',
			className : 'no-padding',
			input     : false,
		})				

		// Switch
		var setPosition = new Wu.button({ 
			id 	 : 'position',
			type 	 : 'set',
			isOn 	 : false,
			right 	 : false,
			appendTo : positionLine.container,
			fn 	 : this._saveSet.bind(this),
		});

	},

	isBoundsSet : function () {

		var bounds = app.activeProject.getBounds();

		// If no bounds
		if ( !bounds ) return false;

		var maxZoom      = bounds.maxZoom;
		var minZoom      = bounds.minZoom;
		var northEastLat = bounds.northEast.lat;
		var northEastLng = bounds.northEast.lng;
		var southWestLat = bounds.southWest.lat;
		var southWestLng = bounds.southWest.lng;

		// If bounds sat to view everything (clear)
		if ( maxZoom      == 20 &&
		     minZoom      == 1 &&
		     northEastLat == 90 &&
		     northEastLng == 180 &&
		     southWestLat == -90 &&
		     southWestLng == -180
		) return false;

		// Bounds are set
		return true;

	},

	_saveSwitch : function (e) {

		var item = e.target;
		var stateAttrib = e.target.getAttribute('state');
		var on = (stateAttrib == 'true');
		var key = e.target.getAttribute('key');		

		// Get control
		var control = app.MapPane.getControls()[key];

		if (!control) return console.error('no control!', key, on);

		// Save
		var project = app.activeProject;
		    project.store.controls[key] = on;
		    project._update('controls');

		// toggle on map
		on ? control._on() : control._off();

	},


	_saveSetClear : function (key, on) {
		if ( key == 'bounds' ) on ? this.setBounds() : this.clearBounds();
	},

	_saveSet : function (key) {
		if ( key == 'position' ) this.setPosition();
	},

	setPosition : function () {

		// get actual Project object
		var project = app.activeProject;

		// if no active project, do nothing
		if (!project) return; 

		// get center and zoom
		var center = Wu.app._map.getCenter();
		var zoom   = Wu.app._map.getZoom();

		// set position 
		var position = {
			lat  : center.lat,
			lng  : center.lng,
			zoom : zoom
		}

		// save to project
		project.setPosition(position);
	},		


	setBounds : function (e) {
		
		// get actual Project object
		var project = app.activeProject;

		// if no active project, do nothing
		if (!project) return; 

		// get map bounds and zoom
		var bounds = Wu.app._map.getBounds();
		var zoom   = Wu.app._map.getZoom();

		// write directly to Project
		project.setBounds({
			northEast : {
				lat : bounds._northEast.lat,
				lng : bounds._northEast.lng
			},

			southWest : {
				lat : bounds._southWest.lat,
				lng : bounds._southWest.lng
			},
			minZoom : zoom,
			maxZoom : 18
		});
		
		// enforce new bounds
		this.enforceBounds();
	},

	clearBounds : function () {
		
		// get actual Project object
		var project = Wu.app.activeProject;
		var map = Wu.app._map;

		var nullBounds = {
			northEast : {
				lat : '90',
				lng : '180'
			},

			southWest : {
				lat : '-90',
				lng : '-180'
			},
			minZoom : '1',
			maxZoom : '20'
		}

		// set bounds to project
		project.setBounds(nullBounds);

		// enforce
		this.enforceBounds();

		// no bounds
		map.setMaxBounds(false);
	},		

	enforceBounds : function () {
		
		var project = app.activeProject;
		var map     = app._map;

		// get values
		var bounds = project.getBounds();

		if (bounds) {
			var southWest   = L.latLng(bounds.southWest.lat, bounds.southWest.lng);
	   		var northEast 	= L.latLng(bounds.northEast.lat, bounds.northEast.lng);
	    		var maxBounds 	= L.latLngBounds(southWest, northEast);
			var minZoom 	= bounds.minZoom;
			var maxZoom 	= bounds.maxZoom;

	    		if (bounds == this._nullBounds) {
	    			map.setMaxBounds(false);
	    		} else {
	    			map.setMaxBounds(maxBounds);
	    		}
			
			// set zoom
			map.options.minZoom = minZoom;
			map.options.maxZoom = maxZoom;	
		}
		
		map.invalidateSize();
	},	

});
Wu.Fullscreen = Wu.Evented.extend({

	_inputs : [],

	_initialize : function () {

		// create content
		this._initContent();
	
		// events
		this.addEvents();
	},

	_initContent : function () {

		// create fullscreen
		this._container = Wu.DomUtil.create('div', 'smooth-fullscreen', app._appPane);

		var innerClassName = this.options.innerClassName || 'smooth-fullscreen-inner';
		// wrappers
		this._inner = Wu.DomUtil.create('div', innerClassName, this._container);
		this._closer = Wu.DomUtil.create('div', 'close-smooth-fullscreen', this._container, 'x');
		this._header = Wu.DomUtil.create('div', 'smooth-fullscreen-title', this._inner, this.options.title);
		this._content = Wu.DomUtil.create('div', 'smooth-fullscreen-content', this._inner);
	},

	addInput : function (options) {

		// create input
		var label = Wu.DomUtil.create('div', 'smooth-fullscreen-name-label', this._content, options.label);
		var input = Wu.DomUtil.create('input', 'smooth-input', this._content);
		input.setAttribute('placeholder', options.placeholder);
		input.value = options.value;
		var error = Wu.DomUtil.create('div', 'smooth-fullscreen-error-label', this._content);

		// remember
		this._inputs.push({
			label : label,
			input : input,
			error : error
		});
	},

	addEvents : function () {

		// close trigger		
		Wu.DomEvent.on(this._closer, 'click', this.destroy, this);

		// add esc key trigger for close fullscreen
		this._addEscapeKey();
	},

	removeEvents : function () {

		// close trigger		
		Wu.DomEvent.off(this._closer, 'click', this.destroy, this);

		// add esc key trigger for close fullscreen
		this._removeEscapeKey();
	},

	close : function () {
		this.destroy();
	},

	destroy : function () {

		// remove events
		this.removeEvents();

		// remove container
		this._container.innerHTML = '';
		Wu.DomUtil.remove(this._container);

		var closeCallback = this.options.closeCallback;
		closeCallback && closeCallback();

		return false;
	},

	_addEscapeKey : function () {
		keymaster('esc', this.destroy.bind(this));
	},

	_removeEscapeKey : function () {
		if (keymaster.unbind) keymaster.unbind('esc');
	},

})
Wu.Chrome = Wu.Class.extend({

	initialize : function (options) {

		// set options
		Wu.setOptions(this, options);

		// listen up
		this._listen();

		// local initialize
		this._initialize();
	},      

	_listen : function () {
		Wu.Mixin.Events.on('projectSelected', this._projectSelected, this);
		Wu.Mixin.Events.on('projectDeleted',  this._onProjectDeleted, this);
		Wu.Mixin.Events.on('editEnabled',     this._editEnabled, this);
		Wu.Mixin.Events.on('editDisabled',    this._editDisabled, this);
		Wu.Mixin.Events.on('layerEnabled',    this._layerEnabled, this);
		Wu.Mixin.Events.on('layerDisabled',   this._layerDisabled, this);
		Wu.Mixin.Events.on('fileImported',    this._onFileImported, this);
		Wu.Mixin.Events.on('fileDeleted',     this._onFileDeleted, this);
		Wu.Mixin.Events.on('layerAdded',      this._onLayerAdded, this);
		Wu.Mixin.Events.on('layerEdited',     this._onLayerEdited, this);
		Wu.Mixin.Events.on('layerDeleted',    this._onLayerDeleted, this);
		Wu.Mixin.Events.on('closeMenuTabs',   this._onCloseMenuTabs, this);
		Wu.Mixin.Events.on('fileProcessing',  this._onFileProcessing, this);
		Wu.Mixin.Events.on('processingProgress',  this._onProcessingProgress, this);
	},

	_projectSelected : function (e) {
		if (!e.detail.projectUuid) return;

		// set project
		this._project = app.activeProject = app.Projects[e.detail.projectUuid];

		// refresh pane
		this._refresh();
	},

	updateMapSize : function () {

		var rightChrome = app.Chrome.Right;
		var leftChrome = app.Chrome.Left;
		var left = 0;
		var width = app._appPane.offsetWidth;

		if (!rightChrome || !leftChrome) return;

		// // both open
		// if (leftChrome._isOpen && rightChrome._isOpen) {
		// 	left = left + leftChrome.options.defaultWidth;
		// 	width = width - leftChrome.options.defaultWidth - rightChrome.options.defaultWidth;
		// }

		// only left open
		if (leftChrome._isOpen && !rightChrome._isOpen) {
			left = left + leftChrome.options.defaultWidth;
			width = width - leftChrome.options.defaultWidth;
		}

		// only right open
		if (!leftChrome._isOpen && rightChrome._isOpen) {
			width = width - rightChrome.options.defaultWidth;

			// css exp
			left = left + rightChrome.options.defaultWidth;
		}

		// none open
		if (!leftChrome._isOpen && !rightChrome._isOpen) {
			width = app._appPane.offsetWidth;
			left = 0;
		}

		// set size
		var map = app._map.getContainer();
		// map.style.left = left + 'px';
		// map.style.width = width + 'px';

		// css exp
		// styler
		// var isStyler = (rightChrome && rightChrome._currentTab && rightChrome._currentTab._ == 'settingsSelector' && rightChrome._isOpen);

		app._map._controlCorners.topleft.style.left = left + 'px';
		// app._map._controlCorners.bottomleft.style.left = isStyler ? '0px' : left + 'px';
		app._map._controlCorners.bottomleft.style.left = left + 'px';


		// update leaflet map
		// app._map.invalidateSize();
	},

	
	// dummies
	// _projectSelected : function () {},
	_initialize 	 : function () {},
	_initContainer   : function () {},
	_editEnabled 	 : function () {},
	_editDisabled 	 : function () {},
	_layerEnabled 	 : function () {},
	_layerDisabled 	 : function () {},
	_updateView 	 : function () {},
	_refresh 	 : function () {},
	_onFileImported  : function () {},
	_onFileDeleted   : function () {},
	_onLayerAdded    : function () {},
	_onLayerEdited   : function () {},
	_onLayerDeleted  : function () {},
	_onProjectDeleted : function () {},
	_onCloseMenuTabs  : function () {},
	_onFileProcessing : function () {},
	_onProcessingProgress : function () {},


});
Wu.Chrome.Top = Wu.Chrome.extend({

	_ : 'topchrome', 

	_initialize : function (options) {

		// init container
		this.initContainer();

		// add hooks
		this.addHooks();
	},

	initContainer : function () {

		// container to hold errything
		this._container = Wu.DomUtil.create('div', 'chrome chrome-container chrome-top', app._appPane);

		// Menu Button
		this._menuButton = Wu.DomUtil.create('div', 'chrome-menu-button active', this._container);

		// css experiment
		this._menuButton.innerHTML = '<i class="top-button fa fa-bars"></i>';		

		// Project title container
		this._projectTitleContainer = Wu.DomUtil.create('div', 'chrome-project-title-container', this._container);


		// WRAPPER FOR BUTTONS			// todo: make pluggable
		this._buttonWrapper = Wu.DomUtil.create('div', 'chrome-buttons', this._container);

		// Project title
		// this._projectTitle = Wu.DomUtil.create('div', 'chrome-project-title', this._projectTitleContainer);
		this._projectTitle = Wu.DomUtil.create('div', 'chrome-button chrome-project-title', this._buttonWrapper);

		// Client Logo
		var clientLogo = app.options.logos.clientLogo.image;
		if (clientLogo) {
			this._clientLogo = Wu.DomUtil.create('div', 'chrome-button chrome-client-logo', this._buttonWrapper);
			this._clientLogo.style.backgroundImage = 'url(' + app.options.servers.portal + clientLogo + ')';
			this._clientLogo.style.backgroundSize = app.options.logos.clientLogo.size;
			this._clientLogo.style.backgroundPosition = app.options.logos.clientLogo.position;
			this._clientLogo.style.backgroundColor = app.options.logos.clientLogo.backgroundColor;

		}
		
		// set default
		this.initDefault();

	},

	// add button to top chrome
	_registerButton : function (button) {

		// button options
		var className = button.className,
		    trigger = button.trigger,
		    name = button.name,
		    ctx = button.context,
		    project_dependent = button.project_dependent;

		if (project_dependent) className += ' displayNone';

		// buttons holder
		this._buttons = this._buttons || {};

		// create button
		var buttonDiv = Wu.DomUtil.create('div', className);

		// css exp // hacky!
		var referenceNode = app.options.logos.clientLogo.image ? this._buttonWrapper.lastChild.previousSibling : this._buttonWrapper.lastChild;
		this._buttonWrapper.insertBefore(buttonDiv, referenceNode);

		// save
		this._buttons[name] = {
			div : buttonDiv,
			options : button
		}

		// register event
		Wu.DomEvent.on(buttonDiv, 'click', trigger, ctx);

		return buttonDiv;
	},


	_updateButtonVisibility : function () {

		if (app.activeProject) {

			var buttons = _.filter(this._buttons, function (b) {
				return b.options.project_dependent;
			});

			buttons.forEach(function (button) {
				Wu.DomUtil.removeClass(button.div, 'displayNone');
			});

		} else {

			var buttons = _.filter(this._buttons, function (b) {
				return b.options.project_dependent;
			});

			buttons.forEach(function (button) {
				Wu.DomUtil.addClass(button.div, 'displayNone');
			});
		}
	},


	initDefault : function () {

		// this._setUsername();
		this._setPortalLogo();

		// Init CPU clock
		this.initCPUclock(this._container);
	},


	initCPUclock : function (wrapper) {	

		this._CPUwrapper = Wu.DomUtil.create('div', 'cpu-wrapper', wrapper);

		this._CPUbars = [];

		for (var i = 0; i < 10; i++ ) {
			this._CPUbars[i] = Wu.DomUtil.create('div', 'cpu-bar', this._CPUwrapper);
		}

	},


	updateCPUclock : function (percent) {


		// hide if not editor
		var project = app.activeProject;
		if (!project || !project.isEditable()) {
			this._CPUwrapper.style.display = 'none';
		} else {
			this._CPUwrapper.style.display = 'block';
		}


		// Get value as numbers
		var pp = parseInt(percent);

		// Get clean value of number
		var p = Math.round(pp / 10);

		for (var i = 0; i < 10; i++ ) {
			
			// Get the right div
			var no = 9 - i;

			// Set the right classes
			(i >= p) ? Wu.DomUtil.removeClass(this._CPUbars[no], 'cpu-on') : Wu.DomUtil.addClass(this._CPUbars[no], 'cpu-on');
		}
	},

	_setHooks : function (onoff) {

		// Toggle layer menu
		// Wu.DomEvent[onoff](this._layersBtn, 'click', this._toggleLayermenu, this);

		// Toggle left pane
		Wu.DomEvent[onoff](this._menuButton, 'click', this._toggleLeftPane, this);

		// Log out button
		// Wu.DomEvent[onoff](this._userLogout, 'click', this._logOut, this);

	},

	addHooks : function () {
		this._setHooks('on');
	},

	removeHooks : function () {
		this._setHooks('off');
	},

	_projectSelected : function (e) {
		
		// show settings/share buttons
		this._updateButtonVisibility();

		// get project
		var projectUuid = e.detail.projectUuid;
		if (!projectUuid) return;

		// set project
		this._project = app.activeProject = app.Projects[projectUuid];
		
		// refresh pane
		this._refresh();
	},

	_refresh : function () {

		this._setProjectTitle();
		this._showHideLayerButton();

		// The layer menu
		this.__layerMenu = app.MapPane.getControls().layermenu;
		

		// TODO: fikse dette...
		setTimeout(function() {

			// Set active state to Layer menu button if it's open
			if ( this.__layerMenu._open ) this._openLayerMenu();

		}.bind(this), 50);
	},

	
	_showHideLayerButton : function () {

		// // If there are no layers, hide button
		// if (!this._project.store.layermenu || this._project.store.layermenu.length == 0 ) {
		// 	Wu.DomUtil.addClass(this._layersBtn, 'displayNone');
		// } else {
		// 	Wu.DomUtil.removeClass(this._layersBtn, 'displayNone');
		// }

	},

	_setProjectTitle : function () {

		// get client & project names
		this._projectTitleName = this._project.getHeaderTitle();

		// set project title
		this._projectTitle.innerHTML = this._projectTitleName.camelize();
	},

	// _setUsername : function () {
	// 	var username = app.Account.getFullName();
	// 	this._userName.innerHTML = username.toLowerCase();
	// },

	_setPortalLogo : function () {

		// portal logo from config

		// this._clientLogoImg.src = app.options.servers.portal + app.options.logos.portalLogo;
	},

	// default open
	// _leftPaneisOpen : false,

	_toggleLeftPane : function (e) {
		Wu.DomEvent.stop(e);

		this._leftPaneisOpen ? this.closeLeftPane() : this.openLeftPane();
	},

	openLeftPane : function () {

		// close other tabs
		Wu.Mixin.Events.fire('closeMenuTabs');

		this._leftPaneisOpen = true;

		// Set active state of button
		Wu.DomUtil.addClass(this._menuButton, 'active');

		// open left chrome
		app.Chrome.Left.open();

	},

	closeLeftPane : function () {

		// app.Chrome.Left.isOpen = false;
		this._leftPaneisOpen = false;

		// Remove active state of button
		Wu.DomUtil.removeClass(this._menuButton, 'active');

		// close left chrome
		app.Chrome.Left.close();
	},

	// close menu when clicking on map, header, etc.
	_addAutoCloseTriggers : function () {

		// map pane
		Wu.DomEvent.on(app.MapPane._container, 'click', this.closeLeftPane, this);
		
		// chrome top
		Wu.DomEvent.on(this._container, 'click', this.closeLeftPane, this);
	},

	_removeAutoCloseTriggers : function () {

		// map pane
		Wu.DomEvent.off(app.MapPane._container, 'click', this.closeLeftPane, this);
		
		// chrome top
		Wu.DomEvent.on(this._container, 'click', this.closeLeftPane, this);
	},

	setContentHeights : function () {

		var clientsPane = app.SidePane.Clients;
		var optionsPane = app.SidePane.Options;

		if (clientsPane) clientsPane.setContentHeight();
		if (optionsPane) optionsPane.setContentHeight();
	},


	_toggleLayermenu : function () {

		// Disable the ability to toggle off layer menu when in data library
		if ( app.Tools.DataLibrary._isOpen ) return;

		// Toggle
		this._layerMenuOpen ? this._closeLayerMenu() : this._openLayerMenu();
	},

	_openLayerMenu : function () {

		// use a variable to mark editor as open
		this._layerMenuOpen = true;

		// Add "active" class from button
		// Wu.DomUtil.addClass(this._layersBtn, 'active');

		// TODO: Open Layer Menu
		this.__layerMenu.openLayerPane();
	},

	_closeLayerMenu : function () {

		// mark not open
		this._layerMenuOpen = false;

		// Remove "active" class from button
		// Wu.DomUtil.removeClass(this._layersBtn, 'active');

		// TODO: Close Layer Menu
		this.__layerMenu.closeLayerPane();
	},	

	_onCloseMenuTabs : function () {
		
		// app.Chrome();
		this.closeLeftPane();
	},
	
});
Wu.Chrome.Bottom = Wu.Chrome.extend({

	_ : 'bottomchrome', 

	_initialize : function (options) {

		// init container
		this.initContainer();

		// add hooks
		this.addHooks();
	},

	initContainer : function () {
		this._container = Wu.DomUtil.create('div', 'chrome chrome-container chrome-bottom', app._appPane);
	},

	addHooks : function () {

	},
});
Wu.Chrome.Left = Wu.Chrome.extend({

	_ : 'leftchrome', 

	options : {
		defaultWidth : 282,
		tabs : {
			projects : true,
			users : true,
		}
	},

	_initialize : function (options) {

		// init container
		this.initContainer();

		// add hooks
		this._addEvents();
	},

	initContainer : function () {


		// create container
		this._container = Wu.DomUtil.create('div', 'chrome chrome-container chrome-left', app._appPane);



		// Outer container
		// this._outerContainer = Wu.DomUtil.create('div', 'chrome chrome-container chrome-left', app._appPane);

		// Outer scroller
		this._outerScroller = Wu.DomUtil.create('div', 'chrome-left-outer-scroller', this._container);

		// Inner scroller
		this._innerScroller = Wu.DomUtil.create('div', 'chrome-left-inner-scroller', this._outerScroller);






		// holder for all tabs
		this._tabs = {};
	
		// settings tab
		if (this.options.tabs.projects) {

			// create settings selector
			this._tabs.projects = new Wu.Chrome.Projects({
				appendTo : this._innerScroller,
				chrome : this
			});
		}

		// data tab
		if (this.options.tabs.users) {

			// create settings selector
			this._tabs.users = new Wu.Chrome.Users({
				appendTo : this._innerScroller,
				chrome : this // ie. left chrome
			});
		}

		// close by default
		this.close(true);

	},

	_addEvents : function () {

	},

	open : function () {

		if (this._isOpen) return;
		this._isOpen = true;

		// set width of right pane
		this._container.style.width = this.options.defaultWidth + 'px';
		this._container.style.display = 'block';

		// update map size
		this.updateMapSize();
	},

	close : function (force) {

		if (!this._isOpen && !force) return;
		this._isOpen = false;

		// set width of right pane
		this._container.style.width = '0';
		this._container.style.display = 'none';

		// update map size
		this.updateMapSize();
	},


	_onCloseMenuTabs : function () {

		this.close();
	},
	

	getDimensions : function () {
		var dims = {
			width : this.options.defaultWidth,
			height : this._container.offsetHeight
		}
		return dims;
	},

});
Wu.Chrome.Right = Wu.Chrome.extend({

	_ : 'rightchrome', 

	options : {
		// defaultWidth : 402,
		defaultWidth : 443,
		editingLayer : false,
		tabs : {
			settings : true,
			data : true
		}
	},

	_initialize : function () {

		// init container
		this.initContainer();

		// add hooks
		this._addEvents();
	},

	initContainer : function () {

		// create the container (just a div to hold errythign)
		this._container = Wu.DomUtil.create('div', 'chrome chrome-container chrome-right', app._appPane);

		// holder for all tabs
		this._tabs = {};

		// data tab
		if (this.options.tabs.data) {

			// create data selector
			this._tabs.data = new Wu.Chrome.Data({
				appendTo : this._container,
				chrome : this // ie. right chrome
			});
		}

		// settings tab
		if (this.options.tabs.settings) {

			// create settings selector
			this._tabs.settings = new Wu.Chrome.SettingsContent.SettingsSelector({
				appendTo : this._container,
				chrome : this
			});
		}
	},

	_addEvents : function () {
		// todo
		Wu.DomEvent.on(window, 'resize', _.throttle(this._onWindowResize, 1000), this);
	},

	_removeEvents : function () {
		Wu.DomEvent.off(window, 'resize', this._onWindowResize, this);
	},

	_onWindowResize : function () {
		if (app._map) app._map.invalidateSize();
	},

	getDimensions : function () {
		var dims = {
			width : this.options.defaultWidth,
			height : this._container.offsetHeight
		}
		return dims;
	},

	// helper fn
	_forEachTab : function (fn) {
		for (var t in this._tabs) {
			var tab = this._tabs[t];
			fn(tab);
		}
	},

	open : function (tab) {

		// close other tabs
		Wu.Mixin.Events.fire('closeMenuTabs');

		// hide all tabs
		this._forEachTab(function (tab) {
			tab._hide();
			tab.onClosed();
		});

		// css exp
		// app.Chrome.Left.close();

		// show tab
		tab._show();
		tab.onOpened();

		// if chrome already open
		if (this._isOpen) return;

		this._isOpen = true;
		this._currentTab = tab;

		// set width of right pane
		this._container.style.width = this.options.defaultWidth + 'px';
		this._container.style.display = 'block';

		// set height for styler pane
		// if (tab._ == 'settingsSelector') {
			// this._container.style.height = '75%';
		// } else {
			this._container.style.height = '100%'; // todo, css exp
		// }

		// update size
		this.updateMapSize(); // css exp

		// set buttons inverted
		// Wu.DomUtil.addClass(app.Chrome.Top._buttonWrapper, 'inverted');

	},

	close : function (tab) {

		var tab = tab || this._currentTab;
		
		// hide tab
		if (tab && tab._hide) tab._hide();
		if (tab && tab.onClosed) tab.onClosed();

		if (!this._isOpen) return;

		this._isOpen = false;

		// set width of right pane
		this._container.style.width = '0';
		this._container.style.display = 'none';

		// update size
		this.updateMapSize();

		// set buttons inverted
		// Wu.DomUtil.removeClass(app.Chrome.Top._buttonWrapper, 'inverted');
	},

	_onCloseMenuTabs : function () {

		this.close();
	},
});
Wu.Chrome.Data = Wu.Chrome.extend({

	_ : 'data', 

	options : {
		defaultWidth : 400
	},

	// When a new layer is created, we make a background fade on it
	newLayer : false,

	_initialize : function () {

		// init container
		this._initContainer();

		// init content
		this._initContent();

		// register buttons
		this._registerButton();

		// hide by default
		this._hide();

		// shortcut
		app.Tools = app.Tools || {};
		app.Tools.DataLibrary = this;	
	},

	_onLayerAdded : function (options) {

		var uuid = options.detail.layerUuid;

		// remember
		this.newLayer = uuid;

		// Get layer object
		var layer = this._project.getLayer(uuid);

		// Get layer meta
		var layerMeta = JSON.parse(layer.store.metadata);

		// Build tooltip object
		var tooltipMeta = app.Tools.Tooltip._buildTooltipMeta(layerMeta); // TODO: use event?

		// Create tooltip meta...
		layer.setTooltip(tooltipMeta);

		// refresh
		this._refresh();
	},

	_onFileDeleted : function () {
		this._refresh();
	},

	_onLayerDeleted : function () {
		this._refresh();
	},

	_onLayerEdited : function () {
		this._refresh();
	},

	_initContainer : function () {

		// create the container (just a div to hold errythign)
		this._container = Wu.DomUtil.create('div', 'chrome chrome-content data', this.options.appendTo);

		// Middle container
		this._innerContainer = Wu.DomUtil.create('div', 'chrome-data-inner', this._container);

		// todo: create wrapper for layers - needs to be hidden if not editor

		// LAYER LIST OUTER SCROLLER
		this._listOuterScroller = Wu.DomUtil.create('div', 'chrome-data-outer-scroller', this._innerContainer);
		this._listOuterScroller.style.height = '100%';

		// List container
		this._listContainer = Wu.DomUtil.create('div', 'chrome-data-scroller', this._listOuterScroller);


		// LAYER LIST
		this._initLayerListContainer();
		
		// FILE LIST
		this._initFileListContainer();
		
		// Top container (with upload button)
		this.topContainer = Wu.DomUtil.create('div', 'chrome-data-top', this._container);
		// this.topTitle = Wu.DomUtil.create('div', 'chrome-data-top-title', this.topContainer, 'Data Library');

		// close event
		Wu.DomEvent.on(this._innerContainer, 'click', this._closeActionPopUps, this);

	},


	// Layer list container
	_initLayerListContainer : function () {

		// xoxoxoxoxoxoxox
		this._layerListWrapper = Wu.DomUtil.create('div', 'chrome-layer-list-wrapper', this._listContainer)		

		this._layerListTitle = Wu.DomUtil.create('div', 'chrome-content-header layer-list-container-title', this._layerListWrapper, 'Layers');

		// Containers
		this._layersContainer = Wu.DomUtil.create('div', 'layers-container', this._layerListWrapper);
		
		// base layers
		this._baseLayers = Wu.DomUtil.create('div', 'chrome-content-header layer-list-container-title', this._layerListWrapper, 'Background layer');
		this._baseLayerDropdownContainer = Wu.DomUtil.create('div', 'base-layer-dropdown-container', this._layerListWrapper);

		// Lines
		this._fileListSeparator = Wu.DomUtil.create('div', 'file-list-separator', this._layerListWrapper);		

	},

	// File list container
	_initFileListContainer : function () {


		// HEADER
		this._fileListTitle = Wu.DomUtil.create('div', 'chrome-content-header layer-list-container-title', this._listContainer, 'My Data');

		// Upload button container
		this._uploadButtonContainer = Wu.DomUtil.create('div', 'upload-button-container', this._listContainer);

		// Containers
		this._filesContainer = Wu.DomUtil.create('div', 'files-container', this._listContainer);

	
	},

	_initContent : function () {

		// add hooks
		this._addEvents();
	},

	_registerButton : function () {

		// register button in top chrome
		var top = app.Chrome.Top;

		// add a button to top chrome
		this._topButton = top._registerButton({
			name : 'data',
			className : 'chrome-button datalib',
			trigger : this._togglePane,
			context : this,
			project_dependent : true
		});

		// css experiement
		this._topButton.innerHTML = '<i class="top-button fa fa-cloud"></i>Data';

	},

	_togglePane : function () {

		// right chrome
		var chrome = this.options.chrome;

		// open/close
		this._isOpen ? chrome.close(this) : chrome.open(this); // pass this tab

		if (this._isOpen) {
			// fire event
			app.Socket.sendUserEvent({
				user : app.Account.getFullName(),
				event : 'opened',
				description : 'the data library',
				timestamp : Date.now()
			})
		}
	},

	_show : function () {

		// Open layer menu
		app.MapPane._controls.layermenu.open();

		// mark button active
		Wu.DomUtil.addClass(this._topButton, 'active');
		this._container.style.display = 'block';
		this._isOpen = true;

		// enable edit of layer menu...
		var layerMenu = app.MapPane.getControls().layermenu;
		if (this._project.isEditable()) layerMenu.enableEditSwitch();

		// open if closed
		if (!layerMenu._layerMenuOpen) app.Chrome.Top._openLayerMenu();
	},

	_hide : function () {

		// mark button inactive
		Wu.DomUtil.removeClass(this._topButton, 'active');
		this._container.style.display = 'none';
		
		if (this._isOpen) {
			var layerMenu = app.MapPane.getControls().layermenu;	 // move to settings selector
			if (layerMenu) layerMenu.disableEditSwitch();
		}

		this._isOpen = false;
	},

	onOpened : function () {
	},
	onClosed : function () {
	},
	_addEvents : function () {
	},
	_removeEvents : function () {
	},
	_onWindowResize : function () {
	},
	getDimensions : function () {
		var dims = {
			width : this.options.defaultWidth,
			height : this._container.offsetHeight
		}
		return dims;
	},

	_onFileImported : function (e) {
		
		// refresh DOM
		this._refresh();

		// get file
		var file = e.detail.file;

		// automatically create layer
		file._createLayer(this._project);
	},


	_refresh : function () {

		if (!this._project) return;

		// Empty containers
		if ( this._layersContainer ) this._layersContainer.innerHTML = '';
		if ( this._filesContainer )  this._filesContainer.innerHTML = '';

		// only update list if project is editable
		if (this._project.isEditable()) {

			// Layer list
			this._initLayerList();
			this._refreshLayers();

			// this._initBaseLayerList(); // why twice?
			this._refreshBaseLayerList();
		}

		this._refreshBaseLayerList();

		// File list
		this._initFileLists();
		this._refreshFiles();

		// Upload button
		this._initUploadButton();

		// layer title
		var projectName = this._project.getTitle();
		this._layerListTitle.innerHTML = 'Layers for ' + projectName;	

		// hide layers if not editor
		if (!this._project.isEditable()) {
			// todo: put layers in wrapper and hide
			Wu.DomUtil.addClass(this._layerListWrapper, 'displayNone');
		} else {
			Wu.DomUtil.removeClass(this._layerListWrapper, 'displayNone');
		}

	},

	_initUploadButton : function () {

		// Return if upload button already exists
		if (this.uploadButton) return;

		// get upload button
		this.uploadButton = app.Data.getUploadButton('chrome-upload-button', this._uploadButtonContainer);
		
		// set title
		this.uploadButton.innerHTML = '<i class="fa fa-cloud-upload"></i>Upload data';
	},


	// When clicking on container, close popups
	_closeActionPopUps : function (e) {

		var classes = e.target.classList;
		var stop = false;

		// Stop when clicking on these classes
		if (classes.forEach) classes.forEach(function(c) {
			if ( c == 'file-action') stop = true;
			if ( c == 'file-popup-trigger') stop = true;
			if ( c == 'file-popup') stop = true;
			if ( c == 'toggle-button') stop = true;
		})

		// Stop if we're editing name
		if (e.target.name == this.editingFileName) stop = true;
		if (e.target.name == this.editingLayerName) stop = true;

		if (stop) return;

		// Reset
		this.showFileActionFor = false;
		this.selectedFiles = [];

		this.showLayerActionFor = false;
		this.selectedLayers = [];
		
		this._refreshFiles();
		this._refreshLayers();
	},	



	_initFileLists : function () {

		// Holds each section (project files, my files, etc)
		// Currently only "my files"
		this.fileListContainers = {};

		// Holds files that we've selected
		this.selectedFiles = [];

		// Show file actions for this specific file (i.e. download, rename, etc)
		this.showFileActionFor = false;

		// Edit file name for this file
		this.editingFileName = false;

		// File list (global)
		this.fileProviders = {};

		this.fileProviders.postgis = {
			name : 'Data Library',
			data : [],
			getFiles : function () {
				return app.Account.getFiles()
			}
		}
		
		// Create FILE LIST section, with D3 container
		for (var f in this.fileProviders ) {

			this.fileListContainers[f] = {};

			// Create wrapper
			this.fileListContainers[f].wrapper = Wu.DomUtil.create('div', 'file-list-container', this._filesContainer);
			
			// D3 Container
			this.fileListContainers[f].fileList = Wu.DomUtil.create('div', 'file-list-container-file-list', this.fileListContainers[f].wrapper);
			this.fileListContainers[f].D3container = d3.select(this.fileListContainers[f].fileList);
		}

	},	

	
	_refreshFiles : function () {

		// FILES
		for (var p in this.fileProviders) {
			var provider = this.fileProviders[p];
			var files = provider.getFiles();

			// get file list, sorted by last updated
			provider.data = _.sortBy(_.toArray(files), function (f) {
				return f.store.lastUpdated;
			}).reverse();

			// containers
			var D3container = this.fileListContainers[p].D3container;
			var data = this.fileProviders[p].data;
			this.initFileList(D3container, data, p);
		}

	},

	// create temp file holder in file list while processing
	_onFileProcessing : function (e) {
		var file = e.detail.file;

		var unique_id = file.uniqueIdentifier;
		var filename = file.fileName;
		var size = parseInt(file.size / 1000 / 1000) + 'MB';

		// add temp file holder
		var datawrap = Wu.DomUtil.create('div', 'data-list-line processing');
		var title = Wu.DomUtil.create('div', 'file-name-content processing', datawrap, filename);
		var feedback = Wu.DomUtil.create('div', 'file-feedback processing', datawrap);
		var percent = Wu.DomUtil.create('div', 'file-feedback-percent processing', datawrap);

		// remember
		this._tempFiles = this._tempFiles || {}
		this._tempFiles[unique_id] = {
			feedback : feedback,
			percent : percent,
			file : file
		}

		// get file list
		var file_list = this.fileListContainers.postgis.fileList;

		// prepend
		file_list.insertBefore(datawrap, file_list.firstChild);
	},

	_onProcessingProgress : function (e) {

		var data = e.detail;
		var error = data.error;
		var percent = data.percent;
		var text = data.text;
		var uniqueIdentifier = data.uniqueIdentifier;

		// get temp file divs
		var tempfile = this._tempFiles[uniqueIdentifier];

		// set feedback
		tempfile.feedback.innerHTML = text;
		tempfile.percent.innerHTML = percent + '% done';

	},



	// ┌─┐┌─┐┌─┐┬ ┬  ┌─┐┬┬  ┌─┐  ┬ ┬┬─┐┌─┐┌─┐┌─┐┌─┐┬─┐
	// ├┤ ├─┤│  ├─┤  ├┤ ││  ├┤   │││├┬┘├─┤├─┘├─┘├┤ ├┬┘
	// └─┘┴ ┴└─┘┴ ┴  └  ┴┴─┘└─┘  └┴┘┴└─┴ ┴┴  ┴  └─┘┴└─	
	initFileList : function (D3container, data, library) {


		// BIND
		var dataListLine = 
			D3container
			.selectAll('.data-list-line')
			.data(data);

		// ENTER
		dataListLine
			.enter()
			.append('div')
			.classed('data-list-line', true);

		// UPDATE
		dataListLine
			.classed('file-selected', function (d) {
				
				var uuid = d.getUuid();

				// If selected by single click
				if ( uuid == this.showFileActionFor ) return true;

				// Else no selection
				return false;

			}.bind(this));


		dataListLine
			.classed('editingFileName', function (d) {
				var uuid = d.getUuid();
				if ( this.editingFileName == uuid ) return true;
				return false;
			}.bind(this))

		// EXIT
		dataListLine
			.exit()
			.remove();

		
		// CREATE NAME CONTENT (file name)
		this.createFileNameContent(dataListLine, library);

		// CREATE FILE META (date and size)
		this.createFileMetaContent(dataListLine, library);
		
		// FILE AUTHOR
		// this.createFileAuthor(dataListLine, library);	

		// CREATE POP-UP TRIGGER (the "..." button)
		this.createFilePopUpTrigger(dataListLine, library);

		// CREATE FILE ACTION POP-UP (download, delete, etc)
		this.createFileActionPopUp(dataListLine, library)


	},


	// ┌─┐┬┬  ┌─┐  ┌┬┐┌─┐┌┬┐┌─┐
	// ├┤ ││  ├┤   │││├┤  │ ├─┤
	// └  ┴┴─┘└─┘  ┴ ┴└─┘ ┴ ┴ ┴

	createFileMetaContent : function (parent, library) {

		var that = this;

		// Bind
		var nameContent = 
			parent
			.selectAll('.file-meta-content')
			.data(function(d) { return [d] })

		// Enter
		nameContent
			.enter()
			.append('div')
			.classed('file-meta-content', true)


		// Update
		nameContent
			.html(function (d) { 

				var _str = '';

				// User
				var userId = d.getCreatedBy();
				var userName = app.Users[userId].getFullName()

				_str += '<span class="file-meta-author">' + userName + '</span>';

				// Date
				var date = moment(d.getCreated()).format('DD MMMM YYYY');
				_str += '<span class="file-meta-date">' + date + '</span>';

				// Size
				var bytes = d.getStore().dataSize;				
				var size = Wu.Util.bytesToSize(bytes);
				_str += ' – <span class="file-meta-size">' + size + '</span>';
				
				return _str;

			}.bind(this))


		// Exit
		nameContent
			.exit()
			.remove();

	},




	// ┌─┐┬┬  ┌─┐  ┌┐┌┌─┐┌┬┐┌─┐
	// ├┤ ││  ├┤   │││├─┤│││├┤ 
	// └  ┴┴─┘└─┘  ┘└┘┴ ┴┴ ┴└─┘

	createFileNameContent : function (parent, library) {

		var that = this;

		// Bind
		var nameContent = 
			parent
			.selectAll('.file-name-content')
			.data(function(d) { return [d] })

		// Enter
		nameContent
			.enter()
			.append('div')
			.classed('file-name-content', true)


		// Update
		nameContent
			.html(function (d) { 
				return d.getTitle();
			}.bind(this))
			.on('dblclick', function (d) {
				this.activateFileInput(d, library);
			}.bind(this));			


		// Exit
		nameContent
			.exit()
			.remove();


		// Create input field (for editing file name)
		this.createFileInputField(nameContent, library);


	},

	
	// ┌─┐┬┬  ┌─┐  ┬┌┐┌┌─┐┬ ┬┌┬┐
	// ├┤ ││  ├┤   ││││├─┘│ │ │ 
	// └  ┴┴─┘└─┘  ┴┘└┘┴  └─┘ ┴ 

	// For editing file name

	createFileInputField : function (parent, library) {

		var that = this;

		// Bind
		var nameInput = 
			parent
			.selectAll('.file-name-input')
			.data(function (d) {
				var uuid = d.getUuid();
				if ( this.editingFileName == uuid ) return [d];
				return false;
			}.bind(this))

		// Enter
		nameInput
			.enter()
			// .append('textarea')
			.append('input')
			.attr('type', 'text')			
			.classed('file-name-input', true)


		// Update
		nameInput
			.attr('placeholder', function (d) {
				if ( library == 'layers' ) return d.getTitle();
				return d.getName();
			})
			.attr('name', function (d) {
				return d.getUuid()
			})
			.html(function (d) {
				if ( library == 'layers' ) return d.getTitle();
				return d.getName();
			})
			.classed('displayNone', function (d) {
				var uuid = d.getUuid();				
				if ( that.editingFileName == uuid ) return false;	
				return true;
			})
			.on('blur', function (d) {
				var newName = this.value;
				that.saveFileName(newName, d, library);
			})
			.on('keydown', function (d) {
				var keyPressed = window.event.keyCode;
				var newName = this.value;
				if ( keyPressed == 13 ) this.blur(); // Save on enter
			});

		// Exit
		nameInput
			.exit()
			.remove();


		// Hacky, but works...
		// Select text in input field...
		if ( nameInput ) {
			nameInput.forEach(function(ni) {
				if ( ni[0] ) {
					ni[0].select();
					return;
				}
			})
		}

	},



	// // ┌─┐┬┬  ┌─┐  ┌─┐┬ ┬┌┬┐┬ ┬┌─┐┬─┐
	// // ├┤ ││  ├┤   ├─┤│ │ │ ├─┤│ │├┬┘
	// // └  ┴┴─┘└─┘  ┴ ┴└─┘ ┴ ┴ ┴└─┘┴└─

	// createFileAuthor : function (parent, library) {

	// 	var that = this;

	// 	// Bind
	// 	var nameContent = 
	// 		parent
	// 		.selectAll('.file-meta-author')
	// 		.data(function(d) { return [d] })

	// 	// Enter
	// 	nameContent
	// 		.enter()
	// 		.append('div')
	// 		.classed('file-meta-author', true)


	// 	// Update
	// 	nameContent
	// 		.html(function (d) { 

	// 			// User
	// 			var userId = d.getCreatedBy();
	// 			var userName = app.Users[userId].getFullName();
				
	// 			return userName;

	// 		}.bind(this))


	// 	// Exit
	// 	nameContent
	// 		.exit()
	// 		.remove();

	// },	


	// ┌─┐┌─┐┌─┐┬ ┬┌─┐  ┌┬┐┬─┐┬┌─┐┌─┐┌─┐┬─┐
	// ├─┘│ │├─┘│ │├─┘   │ ├┬┘││ ┬│ ┬├┤ ├┬┘
	// ┴  └─┘┴  └─┘┴     ┴ ┴└─┴└─┘└─┘└─┘┴└─	

	// The little "..." next to file name

	createFilePopUpTrigger : function (parent, library) {

		// Bind
		var popupTrigger = 
			parent
			.selectAll('.file-popup-trigger')
			.data(function(d) { return [d] })

		// Enter
		popupTrigger
			.enter()
			.append('div')
			.classed('file-popup-trigger', true)

		// Update
		popupTrigger
			.classed('active', function (d) {
				var uuid = d.getUuid()
				if ( uuid == this.showFileActionFor ) return true;
				return false;
			}.bind(this))
			.on('click', function (d) {
				var uuid = d.getUuid();
				this.enableFilePopUp(uuid)
			}.bind(this))	


		// Exit
		popupTrigger
			.exit()
			.remove();


	},


	// ┌─┐┬┬  ┌─┐  ┌─┐┌─┐┌┬┐┬┌─┐┌┐┌  ┌─┐┌─┐┌─┐┬ ┬┌─┐
	// ├┤ ││  ├┤   ├─┤│   │ ││ ││││  ├─┘│ │├─┘│ │├─┘
	// └  ┴┴─┘└─┘  ┴ ┴└─┘ ┴ ┴└─┘┘└┘  ┴  └─┘┴  └─┘┴  

	// The "download, delete, etc" pop-up

	createFileActionPopUp : function (parent, library) {

		// Bind
		var dataListLineAction = 
			parent
			.selectAll('.file-popup')
			.data(function(d) { return [d] })

		// Enter
		dataListLineAction
			.enter()
			.append('div')
			.classed('file-popup', true)


		// Update
		dataListLineAction
			.classed('displayNone', function (d) {
				var uuid = d.getUuid()
				if ( uuid == this.showFileActionFor ) return false;
				return true;
			}.bind(this))	

		// Exit
		dataListLineAction
			.exit()
			.remove();


		this.initFileActions(dataListLineAction, library);

	},


	// ┌─┐┬┬  ┌─┐  ┌─┐┌─┐┌┬┐┬┌─┐┌┐┌┌─┐
	// ├┤ ││  ├┤   ├─┤│   │ ││ ││││└─┐
	// └  ┴┴─┘└─┘  ┴ ┴└─┘ ┴ ┴└─┘┘└┘└─┘

	// AKA pop-up content

	initFileActions : function (parent, library) {

		// Disable actions for Layers
		var isDisabled = (library == 'layers'),
		    canEdit = this._project.isEditor(),
		    canDownload = this._project.isDownloadable(),
		    that = this;

		var action = {

			createLayer : {
				name : 'Add To Project',
				disabled : !canEdit,
			},
			share : {
				name : 'Share with...', 	// todo: implement sharing of data
				disabled : true,
			},			
			changeName : {
				name : 'Change Name',
				disabled : true
			},			
			download : {
				name : 'Download',
				disabled : false,
			},
			delete : {
				name : 'Delete',
				disabled : false
			},
		}


		for (var f in action) {

			var name = action[f].name;
			var className = 'file-action-' + f;

			// Bind
			var fileAction = 
				parent
				.selectAll('.' + className)
				.data(function(d) { return [d] })

			// Enter
			fileAction
				.enter()
				.append('div')
				.classed(className, true)
				.classed('file-action', true)
				.classed('displayNone', action[f].disabled)
				.attr('trigger', f)
				.html(name)
				.on('click', function (d) {
					var trigger = this.getAttribute('trigger')
					that.fileActionTriggered(trigger, d, that, library)
				});

			// Exit
			fileAction
				.exit()
				.remove();
		}
	},



	// ╔═╗╦╦  ╔═╗  ╔═╗╦  ╦╔═╗╦╔═  ╔═╗╦  ╦╔═╗╔╗╔╔╦╗╔═╗
	// ╠╣ ║║  ║╣   ║  ║  ║║  ╠╩╗  ║╣ ╚╗╔╝║╣ ║║║ ║ ╚═╗
	// ╚  ╩╩═╝╚═╝  ╚═╝╩═╝╩╚═╝╩ ╩  ╚═╝ ╚╝ ╚═╝╝╚╝ ╩ ╚═╝

	fileActionTriggered : function (trigger, file, context, library) {

		return this._fileActionTriggered(trigger, file, context, library);		
	},

	_fileActionTriggered : function (trigger, file, context, library) {

		var fileUuid = file.getUuid();
		var project = context._project;

		// set name
		if (trigger == 'changeName') context.editingFileName = fileUuid;			

		// create layer
		if (trigger == 'createLayer') file._createLayer(project);

		// share
		if (trigger == 'share') file._shareFile();	

		// download
		if (trigger == 'download') file._downloadFile();	

		// delete
		if (trigger == 'delete') file._deleteFile();
		
		// Reset
		this.showFileActionFor = false;
		this.selectedFiles = [];
		this._refreshFiles();
	},

	// Enable input field for changing file name
	activateFileInput : function (d, library) {
		this.editingFileName = d.getUuid();
		this.showFileActionFor = false;
		this.selectedFiles = [];
		this._refreshFiles();
	},

	// Enable popup on file (when clicking on "..." button)
	enableFilePopUp : function (uuid) {

		// Deselect
		if ( this.showFileActionFor == uuid ) {
			this.showFileActionFor = false;
			this.selectedFiles = [];
			this._refreshFiles();
			return;
		}

		// Select
		this.showFileActionFor = uuid;
		this.selectedFiles = uuid;
		this._refreshFiles();
	},

	// Save file name
	saveFileName : function (newName, d, library) {

		if ( !newName || newName == '' ) newName = d.getName();
		d.setName(newName);	
		
		this.editingFileName = false;
		this._refreshFiles();
	},



	// ┬┌┐┌┬┌┬┐  ┬  ┌─┐┬ ┬┌─┐┬─┐┌─┐
	// │││││ │   │  ├─┤└┬┘├┤ ├┬┘└─┐
	// ┴┘└┘┴ ┴   ┴─┘┴ ┴ ┴ └─┘┴└─└─┘

	_initLayerList : function () {
	
		// Holds each section (mapbox, cartoDB, etc);
		this.layerListContainers = {};

		// Holds layers that we've selected
		this.selectedLayers = [];

		// Show layer actions for this specific layer
		this.showLayerActionFor = false;

		// Edit layer name
		this.editingLayerName = false;

		// Layer providers
		this.layerProviders = {};

		// Create PROJECT LAYERS section, with D3 container
	       	var sortedLayers = this.sortedLayers = this.sortLayers(this._project.layers);

	       	sortedLayers.forEach(function (layerBundle) {

	       		var provider = layerBundle.key;

	       		// only do our layers
	       		if (provider != 'postgis' && provider != 'raster') return;

	       		var layers = layerBundle.layers;

	       		if ( layers.length <= 0 ) return this.createNoLayers();

			this.layerProviders[provider] = {
				name : provider,
				layers : layers
			}			
	       			       		
			this.layerListContainers[provider] = {};

			// Create wrapper
			this.layerListContainers[provider].wrapper = Wu.DomUtil.create('div', 'layer-list-container', this._layersContainer);

			// D3 Container
			this.layerListContainers[provider].layerList = Wu.DomUtil.create('div', 'layer-list-container-layer-list', this.layerListContainers[provider].wrapper);
			this.layerListContainers[provider].D3container = d3.select(this.layerListContainers[provider].layerList);

	       	}.bind(this));

	},

	createNoLayers : function () {
		// var noLayersText = 'This project has no layers.<br>Upload files, and add them to project.';
		// var noLayers = Wu.DomUtil.create('div', 'no-layers', this._layersContainer, noLayersText);
	},

	
	// ┬─┐┌─┐┌─┐┬─┐┌─┐┌─┐┬ ┬  ┬  ┌─┐┬ ┬┌─┐┬─┐┌─┐
	// ├┬┘├┤ ├┤ ├┬┘├┤ └─┐├─┤  │  ├─┤└┬┘├┤ ├┬┘└─┐
	// ┴└─└─┘└  ┴└─└─┘└─┘┴ ┴  ┴─┘┴ ┴ ┴ └─┘┴└─└─┘

	_refreshLayers : function () {

		// FILES
		for (var p in this.layerProviders) {
			var provider = this.layerProviders[p];
			var layers = provider.layers;
			provider.data = _.toArray(layers);
			var D3container = this.layerListContainers[p].D3container;
			var data = this.layerProviders[p].data;
			this.initLayerList(D3container, data, p);
		}

	},


	// ┌─┐┌─┐┬─┐┌┬┐  ┬  ┌─┐┬ ┬┌─┐┬─┐┌─┐  ┌┐ ┬ ┬  ┌─┐┬─┐┌─┐┬  ┬┬┌┬┐┌─┐┬─┐
	// └─┐│ │├┬┘ │   │  ├─┤└┬┘├┤ ├┬┘└─┐  ├┴┐└┬┘  ├─┘├┬┘│ │└┐┌┘│ ││├┤ ├┬┘
	// └─┘└─┘┴└─ ┴   ┴─┘┴ ┴ ┴ └─┘┴└─└─┘  └─┘ ┴   ┴  ┴└─└─┘ └┘ ┴─┴┘└─┘┴└─

	sortLayers : function (layers) {

		var keys = ['postgis', 'raster', 'google', 'norkart', 'geojson', 'mapbox'];
		var results = [];
	
		keys.forEach(function (key) {
			var sort = {
				key : key,
				layers : []
			}
			for (var l in layers) {
				var layer = layers[l];
				if (layer) {
					if (layer.store && layer.store.data.hasOwnProperty(key)) {
						sort.layers.push(layer)
					}
				}
			}
			results.push(sort);
		}, this);

		this.numberOfProviders = results.length;
		return results;
	},	


	// ██████╗  █████╗ ███████╗███████╗    ██╗      █████╗ ██╗   ██╗███████╗██████╗ ███████╗
	// ██╔══██╗██╔══██╗██╔════╝██╔════╝    ██║     ██╔══██╗╚██╗ ██╔╝██╔════╝██╔══██╗██╔════╝
	// ██████╔╝███████║███████╗█████╗      ██║     ███████║ ╚████╔╝ █████╗  ██████╔╝███████╗
	// ██╔══██╗██╔══██║╚════██║██╔══╝      ██║     ██╔══██║  ╚██╔╝  ██╔══╝  ██╔══██╗╚════██║
	// ██████╔╝██║  ██║███████║███████╗    ███████╗██║  ██║   ██║   ███████╗██║  ██║███████║
	// ╚═════╝ ╚═╝  ╚═╝╚══════╝╚══════╝    ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚══════╝


	_initBaseLayerList : function () {
		this._initLayout_activeLayers(false, false, this._baseLayerDropdownContainer, false)
	},

	_refreshBaseLayerList : function () {

		// clear
		this._baseLayerDropdownContainer.innerHTML = '';

		// only create if editable
		if (this._project.isEditable()) {
			this._initLayout_activeLayers(false, false, this._baseLayerDropdownContainer, false)
		}
	},

	_initLayout_activeLayers : function (title, subtitle, container, layers) {

		// active layer wrapper
		var wrap = this._activeLayersWrap = Wu.DomUtil.create('div', 'baselayer-dropdown-wrapper', container);
		
		// create dropdown
		var selectWrap = Wu.DomUtil.create('div', 'chrome chrome-content active-layer select-wrap', wrap);
		var select = this._select = Wu.DomUtil.create('select', 'active-layer-select', selectWrap);

		// Create select options
		this.sortedLayers.forEach(function(provider) {

			// Do not allow postgis layers to be in the baselayer dropdown
			if ( provider.key == "postgis" ) return;

			// Get each provider (mapbox, google, etc)
			provider.layers.forEach(function(layer) {
				
				// Create selct option
				var option = Wu.DomUtil.create('option', 'active-layer-option', select);
				
				// Get layer uuid
				var layerUuid = layer.getUuid();
				
				// Set option value
				option.value = layerUuid;

				// Set selected state
				var isSelected = this.isBaseLayerOn(layerUuid);
				if ( isSelected ) option.selected = true;

				// Print option text
				option.innerHTML = layer.getTitle() + ' (' + provider.key + ')';


			}.bind(this))
		}.bind(this));

		// select event
		Wu.DomEvent.on(select, 'change', this._selectedActiveLayer, this); // todo: mem leak?

		return select;

	},

	_selectedActiveLayer : function (e) {

		// Remove active baselayers
		var baselayers = this._project.getBaselayers();

		// Force array
		// Todo: this is always array anyways...
		var _baselayers = _.isArray(baselayers) ? baselayers : [baselayers];

		_baselayers.forEach(function (baselayer) {
			var uuid = baselayer.uuid;
			var layer = this._project.getLayer(uuid);
			layer.disable();
		}.bind(this))


		// Add to map
		var uuid = e.target.value;
		var layer = this._project.getLayer(uuid);
		layer._addTo('baselayer');
		


		// Save to server
		this._project.setBaseLayer([{
			uuid : uuid,
			zIndex : 1,
			opacity : 1
		}]);
	},


	// ┌─┐┌─┐┌─┐┬ ┬  ┬  ┌─┐┬ ┬┌─┐┬─┐  ┬ ┬┬─┐┌─┐┌─┐┌─┐┌─┐┬─┐
	// ├┤ ├─┤│  ├─┤  │  ├─┤└┬┘├┤ ├┬┘  │││├┬┘├─┤├─┘├─┘├┤ ├┬┘
	// └─┘┴ ┴└─┘┴ ┴  ┴─┘┴ ┴ ┴ └─┘┴└─  └┴┘┴└─┴ ┴┴  ┴  └─┘┴└─	

	initLayerList : function (D3container, data, library) {

		// BIND
		var dataListLine = 
			D3container
			.selectAll('.data-list-line')
			.data(data);

		// ENTER
		dataListLine
			.enter()
			.append('div')
			.classed('data-list-line', true);

		// UPDATE
		dataListLine
			.classed('file-selected', function(d) {
				
				var uuid = d.getUuid();

				// If selected with CMD or SHIFT
				var index = this.selectedLayers.indexOf(uuid);
				if (index > -1) return true;

				// If selected by single click
				if ( uuid == this.showLayerActionFor ) return true;

				// Else no selection
				return false;

			}.bind(this))

			// Add flash to new layer
			.classed('new-layer-list-item', function (d) {
				var uuid = d.getUuid();
				if ( this.newLayer == uuid ) {					
					return true;
					this.newLayer = false;
				}
				return false;
			}.bind(this))

			.classed('editingName', function (d) {
				var uuid = d.getUuid();
				if ( this.editingLayerName == uuid ) return true;
				return false;
			}.bind(this))


		// EXIT
		dataListLine
			.exit()
			.remove();

		// Create Toggle Button (layer/baselayer)
		// this.createLayerToggleButton(dataListLine, library);

		this.createLayerToggleSwitch(dataListLine, library);

		// Create Radio Button
		this.createRadioButton(dataListLine, library);						

		// Create Name content
		this.createLayerNameContent(dataListLine, library);	

		// CREATE POP-UP TRIGGER
		this.createLayerPopUpTrigger(dataListLine, library);

		// CREATE FILE ACTION POP-UP
		this.createLayerActionPopUp(dataListLine, library)


	},


	// ┬─┐┌─┐┌┬┐┬┌─┐  ┌┐ ┬ ┬┌┬┐┌┬┐┌─┐┌┐┌
	// ├┬┘├─┤ ││││ │  ├┴┐│ │ │  │ │ ││││
	// ┴└─┴ ┴─┴┘┴└─┘  └─┘└─┘ ┴  ┴ └─┘┘└┘

	// Sets layers to be on by default

	createRadioButton : function(parent, library) {

		// Bind
		var radioButton = 
			parent
			.selectAll('.layer-on-radio-button-container')
			.data(function(d) { return [d] });

		// Enter
		radioButton
			.enter()
			.append('div')
			.classed('layer-on-radio-button-container layer-radio', true)
			.on('click', function(d) {
				this._toggleRadio(d);
			}.bind(this))


		// Update
		radioButton
			// Display radio button
			.classed('displayNone', function(d) {
				var uuid = d.getUuid();
				var on = this.isLayerOn(uuid);
				return !on;
			}.bind(this))

			// Enabled by default
			.classed('radio-on', function(d) {
				var uuid = d.getUuid();
				// Check if layer is on by default				
				var layermenuItem = _.find(this._project.store.layermenu, function (l) {
					return l.layer == uuid;
				});
				var enabledByDefault = layermenuItem && layermenuItem.enabled;
				return enabledByDefault;
			}.bind(this))

		// Exit
		radioButton
			.exit()
			.remove();

	},

	// TOGGLE RADIO BUTTON
	_toggleRadio : function (layer) {
		var uuid = layer.getUuid();
		var item = _.find(this._project.store.layermenu, function (l) {
			return l.layer == uuid;
		});
		var on = item && item.enabled;
		on ? this.radioOff(uuid) : this.radioOn(uuid);
	},

	// RADIO ON
	radioOn : function (uuid) {
		var layerMenu = app.MapPane.getControls().layermenu;
		layerMenu._setEnabledOnInit(uuid, true);
	},

	// RADIO OFF
	radioOff : function (uuid) {
		var layerMenu = app.MapPane.getControls().layermenu;
		layerMenu._setEnabledOnInit(uuid, false);
	},


	
	// ┌┬┐┌─┐┌─┐┌─┐┬  ┌─┐  ┬  ┌─┐┬ ┬┌─┐┬─┐
	//  │ │ ││ ┬│ ┬│  ├┤   │  ├─┤└┬┘├┤ ├┬┘
	//  ┴ └─┘└─┘└─┘┴─┘└─┘  ┴─┘┴ ┴ ┴ └─┘┴└─

	createLayerToggleSwitch : function (parent, library) {

		// Bind container
		var toggleButton = 
			parent
			.selectAll('.chrome-switch-container')
			.data(function(d) { return [d] });

		// Enter container
		toggleButton
			.enter()
			.append('div')
			.classed('chrome-switch-container', true);

		toggleButton
			.classed('switch-on', function (d) {
				var uuid = d.getUuid();
				var on = this.isLayerOn(uuid);
				return on;
			}.bind(this))

		toggleButton
			.on('click', function(d) {
				this.toggleLayer(d);
			}.bind(this));		

		// Exit
		toggleButton
			.exit()
			.remove();

	},


	// TOGGLE LAYER BUTTONS

	// createLayerToggleButton : function (parent, library) {

	// 	// Bind container
	// 	var toggleButton = 
	// 		parent
	// 		.selectAll('.chrome-toggle-button-container')
	// 		.data(function(d) { return [d] });

	// 	// Enter container
	// 	toggleButton
	// 		.enter()
	// 		.append('div')
	// 		.classed('chrome-toggle-button-container', true);

	// 	// Exit
	// 	toggleButton
	// 		.exit()
	// 		.remove();


	// 	// LAYER BUTTON
	// 	// LAYER BUTTON
	// 	// LAYER BUTTON

	// 	// Bind layer button
	// 	var option1 = 
	// 		toggleButton
	// 		.selectAll('.toggle-button-option-one')
	// 		.data(function(d) { return [d] });

	// 	// Enter layer button
	// 	option1
	// 		.enter()
	// 		.append('div')
	// 		.classed('toggle-button', true)
	// 		.classed('toggle-button-option-one', true)
	// 		.html('layer')
	// 		.on('click', function(d) {
	// 			this.toggleLayer(d);
	// 		}.bind(this));


	// 	// Update layer button
	// 	option1
	// 		.classed('toggle-button-active', function (d) {
	// 			var uuid = d.getUuid();
	// 			var on = this.isLayerOn(uuid);
	// 			return on;
	// 		}.bind(this))


	// 	// Exit layer button
	// 	option1
	// 		.exit()
	// 		.remove()



	// 	// BASE LAYER BUTTON
	// 	// BASE LAYER BUTTON
	// 	// BASE LAYER BUTTON

	// 	// Bind base layer button
	// 	var option2 = 
	// 		toggleButton
	// 		.selectAll('.toggle-button-option-two')
	// 		.data(function(d) { return [d] });

	// 	// Enter base layer button
	// 	option2
	// 		.enter()
	// 		.append('div')
	// 		.classed('toggle-button', true)
	// 		.classed('toggle-button-option-two', true)
	// 		.html('base')	
	// 		.on('click', function(d) {
	// 			this.toggleBaseLayer(d);
	// 		}.bind(this));				

	// 	// Update base layer button
	// 	option2
	// 		.classed('toggle-button-active', function (d) {
	// 			var uuid = d.getUuid();
	// 			var on = this.isBaseLayerOn(uuid);
	// 			return on;
	// 		}.bind(this))

	// 	// Exit base layer button
	// 	option2
	// 		.exit()
	// 		.remove()
	// },


	// TOGGLE LAYERS
	// TOGGLE LAYERS
	// TOGGLE LAYERS
	
	toggleLayer : function (layer) {
		var uuid = layer.getUuid();
		var on = this.isLayerOn(uuid);
		on ? this.removeLayer(layer) : this.addLayer(layer);

		// Toggle base layer off
		// var baseOn = this.isBaseLayerOn(uuid);
		// if ( baseOn ) this.removeBaseLayer(layer);

		this._refreshLayers();		
	},	

	// Add layer
	addLayer : function (layer) {
		var layerMenu = app.MapPane.getControls().layermenu;
		layerMenu.add(layer);
	},

	// Remove layer
	removeLayer : function (layer) {
		var uuid = layer.getUuid();
		var layerMenu = app.MapPane.getControls().layermenu;
		layerMenu._remove(uuid);
	},

	// Check if layer is on
	isLayerOn : function (uuid) {
		var on = false
		this._project.store.layermenu.forEach(function (b) {
			if ( uuid == b.layer ) { on = true; }
		}, this);
		return on;
	},


	// Check if base layer is on
	isBaseLayerOn : function (uuid) {
		var on = false
		this._project.store.baseLayers.forEach(function (b) {
			if ( uuid == b.uuid ) { on = true; } 
		}.bind(this));
		return on;
	},




	// ┬  ┌─┐┬ ┬┌─┐┬─┐  ┌┐┌┌─┐┌┬┐┌─┐
	// │  ├─┤└┬┘├┤ ├┬┘  │││├─┤│││├┤ 
	// ┴─┘┴ ┴ ┴ └─┘┴└─  ┘└┘┴ ┴┴ ┴└─┘

	createLayerNameContent : function (parent, library) {

		// Bind
		var nameContent = 
			parent
			.selectAll('.layer-name-content')
			.data(function(d) { return [d] })

		// Enter
		nameContent
			.enter()
			.append('div')
			.classed('layer-name-content', true)


		// Update
		nameContent
			.html(function (d) { 
				return d.getTitle();
			}.bind(this))
			.on('dblclick', function (d) {
				if ( library == 'postgis' ) this.activateLayerInput(d, library);
			}.bind(this));			


		// Exit
		nameContent
			.exit()
			.remove();


		// Create input field
		this.createLayerInputField(nameContent, library);


	},

	
	// ┬  ┌─┐┬ ┬┌─┐┬─┐  ┬┌┐┌┌─┐┬ ┬┌┬┐
	// │  ├─┤└┬┘├┤ ├┬┘  ││││├─┘│ │ │ 
	// ┴─┘┴ ┴ ┴ └─┘┴└─  ┴┘└┘┴  └─┘ ┴ 	

	createLayerInputField : function (parent, library) {

		var that = this;

		// Bind
		var nameInput = 
			parent
			.selectAll('.layer-name-input')
			.data(function (d) {
				var uuid = d.getUuid();
				if ( this.editingLayerName == uuid ) return [d];
				return false;
			}.bind(this))

		// Enter
		nameInput
			.enter()
			// .append('textarea')
			.append('input')
			.attr('type', 'text')
			.classed('layer-name-input', true)


		// Update
		nameInput
			.attr('placeholder', function (d) {
				return d.getTitle();				
			})
			.attr('name', function (d) {
				return d.getUuid()
			})
			.html(function (d) {
				return d.getTitle();				
			})
			.classed('displayNone', function (d) {
				var uuid = d.getUuid();				
				if ( that.editingLayerName == uuid ) return false;	
				return true;
			})
			.on('blur', function (d) {
				var newName = this.value;
				that.saveLayerName(newName, d, library);
			})
			.on('keydown', function (d) {
				var keyPressed = window.event.keyCode;
				var newName = this.value;
				if ( keyPressed == 13 ) this.blur(); // Save on enter
			});


		nameInput
			.exit()
			.remove();


		// Hacky, but works...
		// Select text in input field...
		if ( nameInput ) {
			nameInput.forEach(function(ni) {
				if ( ni[0] ) {
					ni[0].select();
					return;
				}
			})
		}

	},


	// ┌─┐┌─┐┌─┐┬ ┬┌─┐  ┌┬┐┬─┐┬┌─┐┌─┐┌─┐┬─┐
	// ├─┘│ │├─┘│ │├─┘   │ ├┬┘││ ┬│ ┬├┤ ├┬┘
	// ┴  └─┘┴  └─┘┴     ┴ ┴└─┴└─┘└─┘└─┘┴└─	

	// Little "..." button next to layer name

	createLayerPopUpTrigger : function (parent, library) {

		if ( library != 'postgis' ) return;

		// Bind
		var popupTrigger = 
			parent
			.selectAll('.file-popup-trigger')
			.data(function(d) { return [d] })

		// Enter
		popupTrigger
			.enter()
			.append('div')
			.classed('file-popup-trigger', true)

		// Update
		popupTrigger
			.classed('active', function (d) {
				var uuid = d.getUuid()
				if ( uuid == this.showLayerActionFor ) return true;
				return false;
			}.bind(this))
			.on('click', function (d) {
				var uuid = d.getUuid();
				this.enableLayerPopup(uuid)
			}.bind(this))	


		// Exit
		popupTrigger
			.exit()
			.remove();


	},


	// ┬  ┌─┐┬ ┬┌─┐┬─┐  ┌─┐┌─┐┌┬┐┬┌─┐┌┐┌  ┌─┐┌─┐┌─┐┬ ┬┌─┐
	// │  ├─┤└┬┘├┤ ├┬┘  ├─┤│   │ ││ ││││  ├─┘│ │├─┘│ │├─┘
	// ┴─┘┴ ┴ ┴ └─┘┴└─  ┴ ┴└─┘ ┴ ┴└─┘┘└┘  ┴  └─┘┴  └─┘┴  

	// download, delete, etc

	createLayerActionPopUp : function (parent, library) {

		// Bind
		var dataListLineAction = 
			parent
			.selectAll('.file-popup')
			.data(function(d) { return [d] })

		// Enter
		dataListLineAction
			.enter()
			.append('div')
			.classed('file-popup', true)


		// Update
		dataListLineAction
			.classed('displayNone', function (d) {
				var uuid = d.getUuid();
				if ( uuid == this.showLayerActionFor ) return false;
				return true;
			}.bind(this))	

		// Exit
		dataListLineAction
			.exit()
			.remove();


		this.initLayerActions(dataListLineAction, library);

	},


	// ┬  ┌─┐┬ ┬┌─┐┬─┐  ┌─┐┌─┐┌┬┐┬┌─┐┌┐┌┌─┐
	// │  ├─┤└┬┘├┤ ├┬┘  ├─┤│   │ ││ ││││└─┐
	// ┴─┘┴ ┴ ┴ └─┘┴└─  ┴ ┴└─┘ ┴ ┴└─┘┘└┘└─┘

	// AKA pop-up content

	initLayerActions : function (parent, library) {

		// Disable actions for Layers
		var canEdit = this._project.isEditable(),
		    canDownload = this._project.isDownloadable(),
		    that = this;
	
		var action = {

			share : {
				name : 'Share with...',
				disabled : false,
			},
			style : {
				name : 'Style Layer',
				disabled : !canEdit
			},
			changeName : {
				name : 'Change Name',
				disabled : !canEdit
			},			
			download : {
				name : 'Download',
				disabled : !canDownload,
			},
			delete : {
				name : 'Delete',
				disabled : !canEdit
			},
		}


		for (var f in action) {

			var name = action[f].name;
			var className = 'file-action-' + f;

			// Bind
			var fileAction = 
				parent
				.selectAll('.' + className)
				.data(function(d) { return [d] })

			// Enter
			fileAction
				.enter()
				.append('div')
				.classed(className, true)
				.classed('file-action', true)
				.classed('displayNone', action[f].disabled)
				.attr('trigger', f)
				.html(name)
				.on('click', function (d) {
					var trigger = this.getAttribute('trigger')
					that.layerActionTriggered(trigger, d, that, library)
				});

			// Exit
			fileAction
				.exit()
				.remove();
		}
	},



	// ╦  ╔═╗╦ ╦╔═╗╦═╗  ╔═╗╦  ╦╔═╗╦╔═  ╔═╗╦  ╦╔═╗╔╗╔╔╦╗╔═╗
	// ║  ╠═╣╚╦╝║╣ ╠╦╝  ║  ║  ║║  ╠╩╗  ║╣ ╚╗╔╝║╣ ║║║ ║ ╚═╗
	// ╩═╝╩ ╩ ╩ ╚═╝╩╚═  ╚═╝╩═╝╩╚═╝╩ ╩  ╚═╝ ╚╝ ╚═╝╝╚╝ ╩ ╚═╝

	layerActionTriggered : function (trigger, file, context, library) {
		return this._layerActionTriggered(trigger, file, context, library);
	},

	_layerActionTriggered : function (trigger, layer, ctx, library) {

		// rename
		if (trigger == 'changeName') ctx.editingLayerName = layer.getUuid();
			
		// share
		if (trigger == 'share') layer.shareLayer();

		// download
		if (trigger == 'download') layer.downloadLayer();

		// delete
		if (trigger == 'delete') layer.deleteLayer();

		// delete
		if (trigger == 'style') this.styleLayer(layer);
		
		// refresh
		this.showLayerActionFor = false;
		this.selectedLayers = [];
		this._refreshLayers();
	},

	styleLayer : function (layer) {

		var uuid = layer.getUuid();

		// Close this pane (data library)
		this._togglePane();

		// Store layer id
		app.Tools.Styler._storeActiveLayerUuid(uuid);

		// Open styler pane
		app.Tools.SettingsSelector._togglePane();



	},

	// Sets which layer we are editing
	activateLayerInput : function (d, library) {
		this.editingLayerName = d.getUuid();
		this.showLayerActionFor = false;
		this.selectedLayers = [];
		this._refreshLayers();
	},

	// Enable layer popup (delete, download, etc) on click
	enableLayerPopup : function (uuid) {

		// Deselect
		if ( this.showLayerActionFor == uuid ) {
			this.showLayerActionFor = false;
			this.selectedLayers = [];
			this._refreshLayers();
			return;
		}

		// Select
		this.showLayerActionFor = uuid;
		this.selectedLayers = uuid;
		this._refreshLayers();
	},

	// Save layer name
	saveLayerName : function (newName, d, library) {

		if ( !newName || newName == '' ) newName = d.getTitle();
		d.setTitle(newName);

		this.editingLayerName = false;		

		// fire layer edited
		Wu.Mixin.Events.fire('layerEdited', {detail : {
			layer: d
		}});

	},




});
Wu.Chrome.Projects = Wu.Chrome.extend({

	_ : 'projects', 

	options : {
		// defaultWidth : 220,
		defaultWidth : 283,
		publicTooltipWidth : 55,
		defaultAccess : {
			read : [],
			edit : [],
			options : {
				share : true,
				download : true,
				isPublic : true
			}
		},
		labels : {
			private_project : 'Only invited users can access project',
			public_project : 'Anyone with a link can access project',
			download_on : 'Allowed to download data',
			download_off : 'Not allowed to download data',
			share_on : 'Allowed to invite others (as spectators)',
			share_off : 'Not allowed to invite others',
		}
	},

	_initialize : function () {

		// init container
		this._initContainer();

		// init content
		this._initContent();
	},

	_initContainer : function () {
		this._container = Wu.DomUtil.create('div', 'chrome-left-section chrome-projects', this.options.appendTo);
	},
	
	_initContent : function () {

		// Create Container
		var projectsContainer = this._projectsContainer = Wu.DomUtil.create('div', 'chrome-left-container', this._container);

		// Create Title
		var title = 'Projects <span style="font-weight:400; font-size: 16px; color: gainsboro">(' + _.size(app.Projects) + ')</span> '
		var projectsTitle = Wu.DomUtil.create('div', 'chrome-left-title projects-title', projectsContainer, title);

		// Create NEW button
		var newProjectButton = Wu.DomUtil.create('div', 'chrome-left-new-button', projectsContainer, '+');

		// new trigger
		Wu.DomEvent.on(newProjectButton, 'click', this._openNewProjectFullscreen, this);

		// save divs
		this._projects = {};

		// sort by name
		var projects = _.sortBy(_.toArray(app.Projects), function (p) {
			return p.getName().toLowerCase();
		});

		// project wrapper
		var projectWrapper = Wu.DomUtil.create('div', 'chrome-left-project-wrapper', projectsContainer);

		// iterate projects, create item
		_.each(projects, function (project) {

			var project = app.Projects[project.getUuid()];

			// Create line with project
			var wrapper = Wu.DomUtil.create('div', 'chrome-left-itemcontainer chrome-project', projectWrapper);
			var title = Wu.DomUtil.create('div', 'chrome-left-item-name', wrapper);

			// add edit button if project is editable
			if (project.isEditable()) {

				// edit trigger, todo: only if can edit
				var trigger = Wu.DomUtil.create('div', 'chrome-left-popup-trigger', wrapper);
			
				// edit trigger event
				Wu.DomEvent.on(trigger, 'click', this._openEditProjectFullscreen.bind(this, project), this);

				// add extra padding
				Wu.DomUtil.addClass(title, 'extra-padding-right');
			}


			var projectTitle = '';

			// if project is not created by self -> shared with the user
			if (project.store.createdBy != app.Account.getUuid()) {
				
				// get user
				var createdBy = project.store.createdByName;
				var tooltipText = 'Shared with you by ' + createdBy;

				// set tooltip width
				var width = tooltipText.length * 7 + 'px';

				// set title + tooltip
				projectTitle += '<i class="project-icon fa fa-arrow-circle-right"><div class="absolute"><div class="project-tooltip" style="width:' + width + '">' + tooltipText + '</div></div></i>';
			}

			// add project name
			projectTitle += project.getName();

			// if public, add globe icon + tooltip
			if (project.isPublic()) {
				var tooltipText = 'Public';
				var tooltipWidth = this.options.publicTooltipWidth + 'px';
				projectTitle += '<i class="project-public-icon fa fa-globe"><div class="absolute"><div class="project-tooltip" style="width:' + tooltipWidth + '">' + tooltipText + '</div></div></i>'
			}

			// set title
			title.innerHTML = projectTitle;

			// select project trigger
			// Wu.DomEvent.on(wrapper, 'click', project.selectProject, project);
			Wu.DomEvent.on(wrapper, 'click', function () {
				project.selectProject();
			}, project);

			
			// remember
			this._projects[project.getUuid()] = {
				wrapper : wrapper,
				trigger : trigger
			}

		}, this);
	},

	_refreshContent : function () {

		// remove old, todo: check for mem leaks
		this._projectsContainer.innerHTML = '';
		Wu.DomUtil.remove(this._projectsContainer);

		// rebuild
		this._initContent();
	},


	_openNewProjectFullscreen : function (e) {

		// stop propagation
		Wu.DomEvent.stop(e);
		
		// create fullscreen
		this._fullscreen = new Wu.Fullscreen({
			title : '<span style="font-weight:200;">Create New Project</span>'
		});

		// clear invitations
		this._resetAccess();

		// shortcut
		var content = this._fullscreen._content;

		// create private/public label
		var private_toggle_label = Wu.DomUtil.create('div', 'private-public-label smooth-fullscreen-sub-label');

		// add private/public toggle
		var ppswitch = new Wu.button({
			id 	     : 'public-switch',
			type 	     : 'switch',
			isOn 	     : this._access.options.isPublic,
			right 	     : false,
			disabled     : false,
			appendTo     : content,
			fn 	     : this._togglePrivatePublic.bind(this, private_toggle_label),
			className    : 'public-private-project-switch'
		});

		// add label, default value
		content.appendChild(private_toggle_label);
		private_toggle_label.innerHTML = this._access.options.isPublic ? this.options.labels.public_project : this.options.labels.private_project;


		// project name
		var name = Wu.DomUtil.create('div', 'smooth-fullscreen-name-label clearboth', content, 'Project name');
		var name_input = Wu.DomUtil.create('input', 'smooth-input', content);
		name_input.setAttribute('placeholder', 'Enter name here');
		var name_error = Wu.DomUtil.create('div', 'smooth-fullscreen-error-label', content);

		
		var toggles_wrapper = Wu.DomUtil.create('div', 'toggles-wrapper', content);


		// create invite input
		this._createInviteUsersInput({
			type : 'read',
			label : 'Invite spectators to project <span class="optional-medium">(optional)</span>',
			content : toggles_wrapper,
			container : this._fullscreen._inner,
			sublabel : 'Spectators have read-only access to the project'
		});


		var share_toggle_wrapper = Wu.DomUtil.create('div', 'toggle-wrapper', toggles_wrapper);

		// add share, download toggle
		var share_toggle_label = Wu.DomUtil.create('div', 'small-toggle-label smooth-fullscreen-sub-label');

		// add private/public toggle
		var ppswitch = new Wu.button({
			id 	     : 'share-switch',
			type 	     : 'switch',
			isOn 	     : true,
			right 	     : false,
			disabled     : false,
			appendTo     : share_toggle_wrapper,
			fn 	     : this._toggleShare.bind(this, share_toggle_label),
			className    : 'share-project-switch'
		});

		// add label, default value
		share_toggle_wrapper.appendChild(share_toggle_label);
		share_toggle_label.innerHTML = this.options.labels.share_on;



		var download_toggle_wrapper = Wu.DomUtil.create('div', 'toggle-wrapper', toggles_wrapper);

		// add share, download toggle
		var download_toggle_label = Wu.DomUtil.create('div', 'small-toggle-label smooth-fullscreen-sub-label');

		// add private/public toggle
		var ppswitch = new Wu.button({
			id 	     : 'share-switch',
			type 	     : 'switch',
			isOn 	     : true,
			right 	     : false,
			disabled     : false,
			appendTo     : download_toggle_wrapper,
			fn 	     : this._toggleDownload.bind(this, download_toggle_label),
			className    : 'download-project-switch'
		});

		// add label, default value
		download_toggle_wrapper.appendChild(download_toggle_label);
		download_toggle_label.innerHTML = this.options.labels.download_on;

		var toggles_wrapper = Wu.DomUtil.create('div', 'toggles-wrapper', content);
		

		// create invite input
		this._createInviteUsersInput({
			type : 'edit',
			label : 'Invite editors to project <span class="optional-medium">(optional)</span>',
			content : toggles_wrapper,
			container : this._fullscreen._inner,
			sublabel : 'Editors can edit the project'
		});


		// save button
		var saveBtn = Wu.DomUtil.create('div', 'smooth-fullscreen-save', content, 'Create');

		// pass inputs to triggers
		var options = {
			name_input : name_input,
			name_error : name_error,
		};

		// save button trigger
		Wu.DomEvent.on(saveBtn, 'click', this._createProject.bind(this, options), this);

	},

	openShare : function () {

		// if editor, just go to edit
		// if spectator and project can't be shared, return
		// if spec and p can be shared, go to openShare()

		var project = app.activeProject;

		// just go to edit if editor
		if (project.isEditable()) {
			return this._openEditProjectFullscreen();
		}

		// spectator && not shareable, return
		if (!project.isShareable()) return;

		// spec and shareable
		if (project.isShareable()) {
			this._openShare();
		}

	},

	_openShare : function () {

		// set project
		var project = app.activeProject;

		// stop propagation
		// e && Wu.DomEvent.stop(e);
		
		// create fullscreen
		this._fullscreen = new Wu.Fullscreen({
			title : '<span style="font-weight:200;">Invite to</span> ' + project.getName(),
			closeCallback : this._resetAccess.bind(this)
		});

		// clear invitations
		this._resetAccess();

		// shortcut
		var content = this._fullscreen._content;


		var toggles_wrapper = Wu.DomUtil.create('div', 'toggles-wrapper', content);


		// create invite input
		this._createInviteUsersInput({
			type : 'read',
			label : 'Invite spectators to project',
			content : toggles_wrapper,
			container : this._fullscreen._inner,
			sublabel : 'Spectators have read-only access to the project',
			project : project,
			empty : true
		});


		// invite someone new?
		var invite_someone_wrapper = Wu.DomUtil.create('div', 'invite-someone-wrapper', content);
		var invite_someone_text = Wu.DomUtil.create('div', 'smooth-fullscreen-name-label add-message', invite_someone_wrapper, 'Want to invite someone else? Send them <a id="invite_someone_btn">an invite!</a>');
		var inviteSomeoneBtn = Wu.DomUtil.get('invite_someone_btn');

		Wu.DomEvent.on(inviteSomeoneBtn, 'click', function (e) {
			
			// close fullscreen
			this._fullscreen.close();

			// open invite fullscreen
			var u = app.Chrome.Left._tabs.users;
			u._openInvite();
			
			
		}, this);

		// trigger options
		var options = {
			// name_input : name_input,
			// name_error : name_error,
			project : project,
		};

		// buttons wrapper
		var buttonsWrapper = Wu.DomUtil.create('div', 'smooth-fullscreen-buttons-wrapper', content)

		// save button
		var saveBtn = Wu.DomUtil.create('div', 'smooth-fullscreen-save', buttonsWrapper, 'Invite');
		Wu.DomEvent.on(saveBtn, 'click', this._addInvites.bind(this, options), this);

	},

	_addInvites : function (options) {

		var access = {
			read : []
		}

		this._access.read.forEach(function (v) {
			access.read.push(v.user.getUuid());
		});

		var project = app.activeProject;

		// set invitations
		project.addInvites(access);

		// close fullscreen
		this._fullscreen.close();

	},

	_openEditProjectFullscreen : function (project, e) {

		// set project
		var project = project || app.activeProject;

		// stop propagation
		e && Wu.DomEvent.stop(e);
		
		// create fullscreen
		this._fullscreen = new Wu.Fullscreen({
			title : '<span style="font-weight:200;">Edit</span> ' + project.getName(),
			closeCallback : this._resetAccess.bind(this)
		});

		// clear invitations
		this._resetAccess();

		// shortcut
		var content = this._fullscreen._content;

		// create private/public label
		var private_toggle_label = Wu.DomUtil.create('div', 'private-public-label smooth-fullscreen-sub-label');

		// add private/public toggle
		var ppswitch = new Wu.button({
			id 	     : 'public-switch',
			type 	     : 'switch',
			isOn 	     : project.isPublic(),
			right 	     : false,
			disabled     : false,
			appendTo     : content,
			fn 	     : this._togglePrivatePublic.bind(this, private_toggle_label),
			className    : 'public-private-project-switch'
		});

		// add label, default value
		content.appendChild(private_toggle_label);
		private_toggle_label.innerHTML = project.isPublic() ? this.options.labels.public_project : this.options.labels.private_project;


		// create project name input
		var name = Wu.DomUtil.create('div', 'smooth-fullscreen-name-label clearboth', content, 'Project name');
		var name_input = Wu.DomUtil.create('input', 'smooth-input', content);
		name_input.setAttribute('placeholder', 'Enter name here');
		name_input.value = project.getName();
		var name_error = Wu.DomUtil.create('div', 'smooth-fullscreen-error-label', content);

		// pretty wrapper
		var toggles_wrapper = Wu.DomUtil.create('div', 'toggles-wrapper', content);

		// create invite input
		this._createInviteUsersInput({
			type : 'read',
			label : 'Spectators of project',
			content : toggles_wrapper,
			container : this._fullscreen._inner,
			sublabel : 'Spectators have read-only access to the project',
			project : project
		});

		var share_toggle_wrapper = Wu.DomUtil.create('div', 'toggle-wrapper', toggles_wrapper);

		// add share, download toggle
		var share_toggle_label = Wu.DomUtil.create('div', 'small-toggle-label smooth-fullscreen-sub-label');

		// add private/public toggle
		var sswitch = new Wu.button({
			id 	     : 'share-switch',
			type 	     : 'switch',
			isOn 	     : project.isShareable(),
			right 	     : false,
			disabled     : false,
			appendTo     : share_toggle_wrapper,
			fn 	     : this._toggleShare.bind(this, share_toggle_label),
			className    : 'share-project-switch'
		});

		// add label, default value
		share_toggle_wrapper.appendChild(share_toggle_label);
		share_toggle_label.innerHTML = project.isShareable() ? this.options.labels.share_on : this.options.labels.share_off;

		this._access.options.share = project.isShareable();

		// add share, download toggle
		var download_toggle_wrapper = Wu.DomUtil.create('div', 'toggle-wrapper', toggles_wrapper);
		var download_toggle_label = Wu.DomUtil.create('div', 'small-toggle-label smooth-fullscreen-sub-label');
		var downloadEnabled = (project.isDownloadable() || project.isEditor())

		// add private/public toggle
		var dswitch = new Wu.button({
			id 	     : 'download-switch',
			type 	     : 'switch',
			isOn 	     : project.isDownloadable(),
			right 	     : false,
			disabled     : !downloadEnabled,
			appendTo     : download_toggle_wrapper,
			fn 	     : this._toggleDownload.bind(this, download_toggle_label),
			className    : 'download-project-switch'
		});

		// add label, default value
		download_toggle_wrapper.appendChild(download_toggle_label);
		download_toggle_label.innerHTML = project.isDownloadable() ? this.options.labels.download_on : this.options.labels.download_off;

		this._access.options.download = project.isDownloadable();

		var toggles_wrapper = Wu.DomUtil.create('div', 'toggles-wrapper', content);

		// create invite input
		this._createInviteUsersInput({
			type : 'edit',
			label : 'Editors of project',
			content : toggles_wrapper,
			container : this._fullscreen._inner,
			sublabel : 'Editors can edit the project',
			project : project
		});

		// invite someone new?
		var invite_someone_wrapper = Wu.DomUtil.create('div', 'invite-someone-wrapper', content);
		var invite_someone_text = Wu.DomUtil.create('div', 'smooth-fullscreen-name-label add-message', invite_someone_wrapper, 'Want to invite someone else? Send them <a id="invite_someone_btn">an invite!</a>');
		var inviteSomeoneBtn = Wu.DomUtil.get('invite_someone_btn');

		Wu.DomEvent.on(inviteSomeoneBtn, 'click', function (e) {
			
			// close fullscreen
			this._fullscreen.close();

			// open invite fullscreen
			var u = app.Chrome.Left._tabs.users;
			u._openInvite();
			
			
		}, this);

		// trigger options
		var options = {
			name_input : name_input,
			name_error : name_error,
			project : project,
		};

		// buttons wrapper
		var buttonsWrapper = Wu.DomUtil.create('div', 'smooth-fullscreen-buttons-wrapper', content)

		// save button
		var saveBtn = Wu.DomUtil.create('div', 'smooth-fullscreen-save', buttonsWrapper, 'Update');
		Wu.DomEvent.on(saveBtn, 'click', this._updateProject.bind(this, options), this);

		// add delete button only if access
		if (project.store.createdBy == app.Account.getUuid()) {
			var delBtn = Wu.DomUtil.create('div', 'smooth-fullscreen-delete', buttonsWrapper, 'Delete');
			Wu.DomEvent.on(delBtn, 'click', this._deleteProject.bind(this, options), this);
		}
		
	},

	_toggleShare : function (toggle, e, isOn) {

		// set label
		toggle.innerHTML = isOn ? this.options.labels.share_on : this.options.labels.share_off;

		// save setting
		this._access.options.share = isOn;

	},

	_toggleDownload : function (toggle, e, isOn) {

		// set label
		toggle.innerHTML = isOn ? this.options.labels.download_on : this.options.labels.download_off;

		// save setting
		this._access.options.download = isOn;

	},

	_togglePrivatePublic : function (toggle, e, isPublic) {
	
		// set label
		toggle.innerHTML = isPublic ? this.options.labels.public_project : this.options.labels.private_project;

		// save setting
		this._access.options.isPublic = isPublic;
	},

	_divs : {
		read : {},
		edit : {}
	},

	_createInviteUsersInput : function (options) {

		// invite users
		var content = options.content || this._fullscreen._content;
		var container = this._fullscreen._container;
		var project = options.project;

		// label
		var invite_label = options.label;
		var name = Wu.DomUtil.create('div', 'smooth-fullscreen-name-label', content, invite_label);

		// container
		var invite_container = Wu.DomUtil.create('div', 'invite-container', content);
		
		// sub-label
		var sublabel = Wu.DomUtil.create('div', 'smooth-fullscreen-sub-label', content, options.sublabel);

		var invite_inner = Wu.DomUtil.create('div', 'invite-inner', invite_container);
		var invite_input_container = Wu.DomUtil.create('div', 'invite-input-container', invite_inner);

		// input box
		var invite_input = Wu.DomUtil.create('input', 'invite-input-form', invite_input_container);

		// invite list
		var invite_list_container = Wu.DomUtil.create('div', 'invite-list-container', invite_container);
		var invite_list_inner = Wu.DomUtil.create('div', 'invite-list-inner', invite_list_container);

		// remember div
		this._divs[options.type].invite_list_container = invite_list_container;

		// for manual scrollbar (js)
		var monkey_scroll_bar = Wu.DomUtil.create('div', 'monkey-scroll-bar', invite_list_inner);
		
		// for holding list
		var monkey_scroll_hider = Wu.DomUtil.create('div', 'monkey-scroll-hider', invite_list_inner);
		var monkey_scroll_inner = Wu.DomUtil.create('div', 'monkey-scroll-inner', monkey_scroll_hider);
		var monkey_scroll_list = Wu.DomUtil.create('div', 'monkey-scroll-list', monkey_scroll_inner);

		// list of all users
		var allUsers = _.sortBy(_.toArray(app.Users), function (u) {
			return u.store.firstName;
		});
		_.each(allUsers, function (user) {

			// divs
			var list_item_container = Wu.DomUtil.create('div', 'monkey-scroll-list-item-container', monkey_scroll_list);
			var avatar_container = Wu.DomUtil.create('div', 'monkey-scroll-list-item-avatar-container', list_item_container);
			var avatar = Wu.DomUtil.create('div', 'monkey-scroll-list-item-avatar default-avatar', avatar_container);
			var name_container = Wu.DomUtil.create('div', 'monkey-scroll-list-item-name-container', list_item_container);
			var name_bold = Wu.DomUtil.create('div', 'monkey-scroll-list-item-name-bold', name_container);
			var name_subtle = Wu.DomUtil.create('div', 'monkey-scroll-list-item-name-subtle', name_container);

			// set name
			name_bold.innerHTML = user.getFullName();
			name_subtle.innerHTML = user.getEmail();

			// click event
			Wu.DomEvent.on(list_item_container, 'click', function () {

				// dont allow adding self (as editor) to read
				if (options.type == 'read' && user.getUuid() == app.Account.getUuid()) return;

				// add selected user item to input box
				this._addUserAccessItem({
					input : invite_input,
					user : user,
					type : options.type
				});
					
			}, this);
		}, this);


		// events

		// input focus, show dropdown
		Wu.DomEvent.on(invite_input, 'focus', function () {
			this._closeInviteInputs();
			invite_list_container.style.display = 'block';
		}, this);

		// focus input on any click
		Wu.DomEvent.on(invite_input_container, 'click', function () {
			invite_input.focus();
		}, this);

		// input keyup
		Wu.DomEvent.on(invite_input, 'keydown', function (e) {

			// get which key
			var key = event.which ? event.which : event.keyCode;

			// get string length
			var value = invite_input.value;
			var text_length = value.length;
			if (text_length <= 0) text_length = 1;

			// set width of input dynamically
			invite_input.style.width = 30 + (text_length * 20) + 'px';

			// backspace on empty field: delete added user
			if (key == 8 && value.length == 0 && this._access[options.type].length) {

				// get last user_uuid item 
				var last = _.last(this._access[options.type]);

				// dont allow adding self (as editor) to read
				if (options.type == 'edit' && last && last.user && last.user.getUuid() == app.Account.getUuid()) return;

				// remove last item
				var popped = this._access[options.type].pop();
				Wu.DomUtil.remove(popped.user_container);
			}

			// enter: blur input
			if (key == 13 || key == 27) {
				invite_input.blur();
				invite_input.value = '';
				this._closeInviteInputs();
			}

		}, this);


		// close dropdown on any click
		Wu.DomEvent.on(container, 'click', function (e) {

			// only if target == self
			var relevantTarget = 	e.target == container || 
						e.target == this._fullscreen._inner || 
						e.target == name || 
						e.target == this._fullscreen._content;

			if (relevantTarget) this._closeInviteInputs();

		},this);

		if (project) {

			// add current access vars
			var projectAccess = project.getAccess();

			// add selected user item to input box
			if (projectAccess && projectAccess[options.type] && !options.empty) {

				// add selected user item to input box
				projectAccess[options.type].forEach(function(userUuid) {

					var user = app.Users[userUuid];

					user && this._addUserAccessItem({
						input : invite_input,
						user : user,
						type : options.type
					});
					
				}, this);
			}
			
			// hide by default
			invite_list_container.style.display = 'none';
			invite_input.blur();	
		}
		
	},

	_closeInviteInputs : function () {

		var container = this._divs.edit.invite_list_container;
		if (container) container.style.display = 'none';

		var container = this._divs.read.invite_list_container;
		if (container) container.style.display = 'none';
	},

	_addUserAccessItem : function (options) {

		var invite_input = options.input;
		var user = options.user;

		// if user deleted. todo: clean up deleting
		if (!user) return;

		// focus input
		invite_input.focus();

		// don't add twice
		var existing = _.find(this._access[options.type], function (i) {
			return i.user == user;
		});
		if (existing) return;

		// insert user box in input area
		var user_container = Wu.DomUtil.create('div', 'mini-user-container');
		var user_inner = Wu.DomUtil.create('div', 'mini-user-inner', user_container);
		var user_avatar = Wu.DomUtil.create('div', 'mini-user-avatar default-avatar', user_inner);
		var user_name = Wu.DomUtil.create('div', 'mini-user-name', user_inner, user.getFullName());
		var user_kill = Wu.DomUtil.create('div', 'mini-user-kill', user_inner, 'x');

		// insert before input
		var invite_input_container = invite_input.parentNode;
		invite_input_container.insertBefore(user_container, invite_input);


		// dont allow deleting of self
		if (user.getUuid() != app.Account.getUuid()) {

			// click event (kill)
			Wu.DomEvent.on(user_container, 'click', function () {
				
				// remove div
				Wu.DomUtil.remove(user_container);
				
				// remove from array
				_.remove(this._access[options.type], function (i) {
					return i.user == user;
				});

			}, this);
		} else {

			// add special color to self
			Wu.DomUtil.addClass(user_container, 'itsme');

		}

		// add to array
		this._access[options.type].push({
			user : user,
			user_container : user_container
		});

		// remove from other list if active there
		var otherType = (options.type == 'edit') ? 'read' : 'edit';
		var existing = _.find(this._access[otherType], function (i) {
			return i.user == user;
		});
		if (existing) {

			// remove div
			Wu.DomUtil.remove(existing.user_container);
			
			// remove from array
			_.remove(this._access[otherType], function (i) {
				return i == existing;
			});
		}

	},

	_deleteProject : function (options) {

		var project = options.project;

		// confirm
		var answer = confirm('Are you sure you want to delete project ' + project.getName() + '? This action cannot be undone!');
		if (!answer) return;

		// delete
		project._delete(); // fires projectDeleted
		project = null;
		this._activeProject = null;

		// close fullscreen
		this._fullscreen.close();
	},

	_updateProject : function (options) {

		// get name
		var projectName = options.name_input.value;
		var project = options.project;

		// clean invitations array
		var access = {
			edit : [],
			read : [],
			options : {
				share : this._access.options.share,
				download : this._access.options.download,
				isPublic : this._access.options.isPublic
			}
		};


		this._access.edit.forEach(function (i) {
			access.edit.push(i.user.getUuid());
		}, this);
		this._access.read.forEach(function (i) {
			access.read.push(i.user.getUuid());
		}, this);

		
		// missing data
		if (!projectName) {

			// set error message
			options.name_error.innerHTML = 'Please enter a project name';
			
			// done here
			return;
		}

		// slack
		this._logUpdate({
			access : access,
			project : project,
			projectName : projectName,
		});

		// reset
		this._resetAccess();

		// set project name
		project.setName(projectName);

		// set invitations
		project.setAccess(access);

		// add project to list
		this._refreshContent();

		// close fullscreen
		this._fullscreen.close();

		// select project
		project.selectProject();
	},

	_logUpdate : function (options) {

		var access = options.access;
		var project = options.project;
		var projectName = options.projectName;

		var description = '';
		if (projectName != project.getTitle()) {
			description += ': changed name to ' + projectName;
		}

		var readDelta = _.difference(access.read, this._access.read);
		if (readDelta.length) {
			description += ', added ' + readDelta.length + ' readers';
		}

		var editDelta = _.difference(access.edit, this._access.edit);
		if (editDelta.length) {
			description += ', added ' + editDelta.length + ' editors';
		}

		// send event
		app.Socket.sendUserEvent({
		    	user : app.Account.getFullName(),
		    	event : '`updated project` ' + project.getTitle(),
		    	description : description,
		    	timestamp : Date.now()
		});
	},

	_resetAccess : function () {

		// set default access
		this._access = {
			read : [],
			edit : [],
			options : {
				share : true,
				download : true,
				isPublic : true
			}
		}

	},
	
	_createProject : function (options) {

		// get name
		var projectName = options.name_input.value;

		// missing data
		if (!projectName) {

			// set error message
			options.name_error.innerHTML = 'Please enter a project name';
			
			// done here
			return;
		}

		// clean invitations array
		var access = {
			edit : [],
			read : [],
			options : {
				share : this._access.options.share,
				download : this._access.options.download,
				isPublic : this._access.options.isPublic
			}
		};
		this._access.edit.forEach(function (i) {
			access.edit.push(i.user.getUuid());
		}, this);
		this._access.read.forEach(function (i) {
			access.read.push(i.user.getUuid());
		}, this);

		// reset
		this._resetAccess();

		// create project object
		var store = {
			name 		: projectName,
			description 	: 'Project description',
			createdByName 	: app.Account.getName(),
			access 		: access
		}

		// set create options
		var options = {
			store : store,
			callback : this._projectCreated,
			context : this
		}

		// create new project with options, and save
		var project = new Wu.Project(store);

		// create project on server
		project.create(options, function (project, json) {
			var result = Wu.parse(json),
			    error  = result.error,
			    store  = result.project;

			// return error
			if (error) return app.feedback.setError({
				title : 'There was an error creating new project!', 
				description : error
			});
				
			// add to global store
			app.Projects[store.uuid] = project;

			// update project store
			project.setNewStore(store);

			// add project to list
			this._refreshContent();

			// close fullscreen
			this._fullscreen.close();

			// select project
			project.selectProject();

			// set access
			project.setAccess(access);

		});

	},

	// fired on projectSelected
	_refresh : function () {
		if (!this._project) return;

		// remove old highligting
		if (this._activeProject) {
			var wrapper = this._projects[this._activeProject.getUuid()].wrapper;
			Wu.DomUtil.removeClass(wrapper, 'active-project');
		}

		// highlight project
		var wrapper = this._projects[this._project.getUuid()].wrapper;
		Wu.DomUtil.addClass(wrapper, 'active-project');

		// remember last
		this._activeProject = this._project;
	},

	_onProjectDeleted : function (e) {
		if (!e.detail.projectUuid) return;

		// add project to list
		this._refreshContent();

		// select random project 
		app.Controller.openFirstProject();
		
	},
	_onLayerAdded : function (options) {
	},
	
	_onFileDeleted : function () {
	},

	_onLayerDeleted : function () {
	},

	_onLayerEdited : function () {
	},

	_registerButton : function () {
	},

	_togglePane : function () {

		// right chrome
		var chrome = this.options.chrome;

		// open/close
		this._isOpen ? chrome.close(this) : chrome.open(this); // pass this tab

		// fire open event
		if (this._isOpen) app.Socket.sendUserEvent({
			user : app.Account.getFullName(),
			event : 'opened',
			description : 'the left pane',
			timestamp : Date.now()
		});
	},

	_show : function () {
		this._container.style.display = 'block';
		this._isOpen = true;
	},

	_hide : function () {
		this._container.style.display = 'none';
		this._isOpen = false;
	},

	onOpened : function () {
	},

	onClosed : function () {
	},

	_addEvents : function () {
	},

	_removeEvents : function () {
	},

	_onWindowResize : function () {
	},

	getDimensions : function () {
		var dims = {
			width : this.options.defaultWidth,
			height : this._container.offsetHeight
		}
		return dims;
	},

});
Wu.Chrome.Users = Wu.Chrome.extend({

	_ : 'users', 

	options : {
		defaultWidth : 400
	},

	_initialize : function () {

		// init container
		this._initContainer();

		// init content
		this._initContent();

	},

	_initContainer : function () {
		this._container = Wu.DomUtil.create('div', 'chrome-left-section chrome-users', this.options.appendTo);
	},
	
	_initContent : function () {

		var usersContainer = Wu.DomUtil.create('div', 'chrome-left-container contacts', this._container);
		var usersTitle = Wu.DomUtil.create('div', 'chrome-left-title users-title', usersContainer, 'Contacts');
		var users = this.users = app.Users;

		// Define D3 container
		this.D3container = d3.select(usersContainer);
		
		this.openUserCard = false;

		// Init user list etc.
		this._refresh();

		// add invite
		this._inviteButton = Wu.DomUtil.create('div', 'chrome-left-invite-users', this._container, '+ Invite People');
		Wu.DomEvent.on(this._inviteButton, 'click', this._openInvite, this);

	},

	_createEmailInput : function (content) {

		var content = this._emailsWrapper;
		// email and + button

		var options = {
			label : 'Email Address',
			sublabel : 'Just write the damn address',
		}

		// label
		var invite_label = options.label;
		var name = Wu.DomUtil.create('div', 'smooth-fullscreen-name-label invite-emails', content, invite_label);
		
		// container
		var invite_container = Wu.DomUtil.create('div', 'invite-container narrow', content);
		
		var invite_inner = Wu.DomUtil.create('div', 'invite-inner', invite_container);
		var invite_input_container = Wu.DomUtil.create('div', 'invite-input-container', invite_inner);

		// input box
		var invite_input = Wu.DomUtil.create('input', 'invite-email-input-form', invite_input_container);
		invite_input.setAttribute('placeholder', 'name@domain.com')
		var invite_error = Wu.DomUtil.create('div', 'smooth-fullscreen-error-label', content);

		// remember
		this._emails.push({
			invite_input : invite_input,
			invite_error : invite_error
		});

	},

	_emails : [],

	_openInvite : function (e) {

		// stop propagation
		e && Wu.DomEvent.stop(e);
		
		// create fullscreen
		this._fullscreen = new Wu.Fullscreen({
			title : '<span style="font-weight:200;">Invite people to Systemapic</span>',
			innerClassName : 'smooth-fullscreen-inner invite',
		});

		// clear invitations
		this._access = {
			edit : [],
			read : []
		}

		// shortcut
		var content = this._fullscreen._content;

		// personlized message
		var linkText = Wu.DomUtil.create('div', 'smooth-fullscreen-link-label', content, '<a id="share-link"><i class="fa fa-share-alt"></i> Get shareable link</a>');

		// emails wrapper
		this._emailsWrapper = Wu.DomUtil.create('div', 'invite-emails-wrapper', content);

		// create email input
		this._createEmailInput();

		// add another + button
		var addAnotherWrapper = Wu.DomUtil.create('div', 'invite-add-another-wrapper', content);
		var addAnotherBtn = Wu.DomUtil.create('div', 'smooth-fullscreen-name-label add-another-email', addAnotherWrapper, '+ Add another');
		Wu.DomEvent.on(addAnotherBtn, 'click', this._createEmailInput, this);

		// personlized message
		var emailMessageWrap = Wu.DomUtil.create('div', 'invite-email-message-wrap', content);
		var messageText = Wu.DomUtil.create('div', 'smooth-fullscreen-name-label add-message', emailMessageWrap, 'Make your invite more personal by adding a <a id="custom_message_btn">custom message</a>');
		var messageBtn = Wu.DomUtil.get('custom_message_btn');
		var messageBoxWrap = Wu.DomUtil.create('div', 'invite-custom-message-wrapper', emailMessageWrap);
		var messageBoxLabel = Wu.DomUtil.create('div', 'invite-custom-message-wrapper-label', messageBoxWrap, 'Custom Message'); 
		this._customMessage = Wu.DomUtil.create('textarea', 'invite-custom-message-wrapper-textarea', messageBoxWrap); 

		// event
		Wu.DomEvent.on(messageBtn, 'click', function () {
			Wu.DomUtil.addClass(emailMessageWrap, 'hideme');
			Wu.DomUtil.addClass(messageBoxWrap, 'showme');
			this._customMessage.focus();

		}, this);

		var toggles_wrapper = Wu.DomUtil.create('div', 'toggles-wrapper', content);

		// create invite input for projects
		this._createInviteInput({
			type : 'read',
			label : 'Invite people to view these projects <span class="optional-medium invite">(optional)</span>',
			content : toggles_wrapper,
			container : this._fullscreen._inner,
			sublabel : 'Users will get read-only access to these projects'
		});

		// create invite input
		this._createInviteInput({
			type : 'edit',
			label : 'Invite people to edit these projects <span class="optional-medium invite">(optional)</span>',
			content : toggles_wrapper,
			container : this._fullscreen._inner,
			sublabel : 'Users will get full edit access to these projects'
		});


		// save button
		var saveBtn = Wu.DomUtil.create('div', 'smooth-fullscreen-save invite', content, 'Send Invites');
		var save_message = Wu.DomUtil.create('div', 'invite-success-message', content, '');

		// save button trigger
		Wu.DomEvent.on(saveBtn, 'click', this._sendInvites, this);
		Wu.DomEvent.on(linkText, 'click', this._openLinkShare, this);

	},

	_openLinkShare : function (e) {

		// close prev fullscreen
		this._fullscreen.close();

		// stop propagation
		e && Wu.DomEvent.stop(e);
		
		// create fullscreen
		this._fullscreen = new Wu.Fullscreen({
			title : '<span style="font-weight:200;">Invite people to Systemapic</span>',
			innerClassName : 'smooth-fullscreen-inner invite',
		});

		// clear invitations
		this._access = {
			edit : [],
			read : []
		}

		// shortcut
		var content = this._fullscreen._content;

		// emails wrapper
		this._emailsWrapper = Wu.DomUtil.create('div', 'invite-emails-wrapper', content);

		// label
		var name = Wu.DomUtil.create('div', 'smooth-fullscreen-name-label invite-emails', content, 'Share this link');
		
		// input box
		var invite_container = Wu.DomUtil.create('div', 'invite-container narrow', content);
		var invite_inner = Wu.DomUtil.create('div', 'invite-inner', invite_container);
		var invite_input_container = Wu.DomUtil.create('div', 'invite-input-container', invite_inner);
		this._shareLinkInput = Wu.DomUtil.create('input', 'invite-email-input-form', invite_input_container);
		this._shareLinkInput.value = app.options.servers.portal + 'invite';
		this._inviteFeedback = Wu.DomUtil.create('div', 'smooth-fullscreen-feedback-label', content);

		var clipboardWrapper = Wu.DomUtil.create('div', 'clipboard-wrapper', invite_input_container);
		var clipboardBtn = Wu.DomUtil.create('div', 'clipboard-button', clipboardWrapper);
		clipboardBtn.innerHTML = '<i class="fa fa-clipboard"></i>';	

		// clipboard events
		Wu.DomEvent.on(clipboardWrapper, 'mousedown', this._removeClipFeedback, this);
		Wu.DomEvent.on(clipboardWrapper, 'mouseup', this._copypasted, this);

		var toggles_wrapper = Wu.DomUtil.create('div', 'toggles-wrapper', content);

		// create invite input for projects
		this._createInviteInput({
			type : 'read',
			label : 'Invite people to view these projects <span class="optional-medium invite">(optional)</span>',
			content : toggles_wrapper,
			container : this._fullscreen._inner,
			sublabel : 'Users will get read-only access to these projects',
			trigger : this._addedProject.bind(this)
		});

		// create invite input
		this._createInviteInput({
			type : 'edit',
			label : 'Invite people to edit these projects <span class="optional-medium invite">(optional)</span>',
			content : toggles_wrapper,
			container : this._fullscreen._inner,
			sublabel : 'Users will get full edit access to these projects',
			trigger : this._addedProject.bind(this)
		});

		// save button
		var closeBtn = Wu.DomUtil.create('div', 'smooth-fullscreen-save invite', content, 'Close');

		// select text on focus
		Wu.DomEvent.on(this._shareLinkInput, 'focus click', function () {
			this._shareLinkInput.select();
		}, this);

		// save button trigger
		Wu.DomEvent.on(closeBtn, 'click', this._fullscreen.close.bind(this._fullscreen), this);

		// create default link
		this._createShareableInvite();
	},

	_copypasted : function () {
		this._shareLinkInput.focus();
		this._shareLinkInput.select();
		var copied = document.execCommand('copy');
		var text = copied ? 'Link copied to the clipboard!' : 'Your browser doesn\'t support this. Please copy manually.'
		this._setClipFeedback(text);
	},

	_setClipFeedback : function (text) {
		this._inviteFeedback.innerHTML = text;
		this._inviteFeedback.style.opacity = 1;
	},

	_removeClipFeedback : function () {
		this._inviteFeedback.innerHTML = '';
		this._inviteFeedback.style.opacity = 0;
	},

	_addedProject : function (options) {

		this._createShareableInvite();

		this._removeClipFeedback();
	},

	_createShareableInvite : function () {

		var access = {
			edit : [],
			read: []
		}

		this._access.read.forEach(function (r) {
			access.read.push(r.project.getUuid());
		});
		this._access.edit.forEach(function (e) {
			access.edit.push(e.project.getUuid());
		});

		// this._access[options.type]
		var options = JSON.stringify({
			access : access
		});

		// create share link
		Wu.post('/api/invite/link', options, function (a, b) {
			this._shareLinkInput.value = b;
		}.bind(this), this);
	},

	// icon on user
	_inviteToProject : function (user, e) {

		// stop propagation
		e && Wu.DomEvent.stop(e);
		
		// create fullscreen
		this._fullscreen = new Wu.Fullscreen({
			title : '<span style="font-weight:200;">Invite ' + user.getFullName() + ' to projects</span>',
			innerClassName : 'smooth-fullscreen-inner invite',
		});

		// clear invitations
		this._access = {
			edit : [],
			read : []
		}

		// shortcut
		var content = this._fullscreen._content;

		var toggles_wrapper = Wu.DomUtil.create('div', 'toggles-wrapper', content);

		// create invite input for projects
		this._createInviteInput({
			type : 'read',
			label : 'Invite ' + user.getFullName() + ' to view these projects',
			content : toggles_wrapper,
			container : this._fullscreen._inner,
			sublabel : 'The user will get read-only access to these project'
		});

		// create invite input
		this._createInviteInput({
			type : 'edit',
			label : 'Invite ' + user.getFullName() + ' to edit these projects',
			content : toggles_wrapper,
			container : this._fullscreen._inner,
			sublabel : 'The user will get full edit access to these project'
		});


		// save button
		var saveBtn = Wu.DomUtil.create('div', 'smooth-fullscreen-save invite', content, 'Invite');
		var save_message = Wu.DomUtil.create('div', 'invite-success-message', content, '');
		Wu.DomEvent.on(saveBtn, 'click', this._updateInvites, this);

		// remember user
		this._access.user = user;
	},

	_updateInvites : function () {

		var reads = []; 
		var edits = [];
		var user = this._access.user;
		var read = this._access.read;
		var edit = this._access.edit;

		this._access.read.forEach(function (r) {
			reads.push(r.project.getUuid());
		});
		this._access.edit.forEach(function (e) {
			edits.push(e.project.getUuid());
		});

		// invite
		user.inviteToProjects({
			read : reads,
			edit : edits
		});

		// close
		this._fullscreen.close();
	
	},

	_divs : {
		read : {},
		edit : {},
		email : {}
	},

	_sendInvites : function (e) {

		var emails = [];

		this._emails.forEach(function (divObj, i) {
			var invite_input = divObj.invite_input;

			var email_value = invite_input.value;

			if (!email_value.length && i == 0) {
				var invite_error = divObj.invite_error;
				invite_error.innerHTML = 'Please enter an email address';
				return;
			}

			if (email_value.length) emails.push(email_value);
		});

		if (!emails.length) return;

		var customMessage = this._customMessage.value.replace(/\n/g, '<br>');

		var access = {
			edit : [],
			read : []
		}

		this._access.edit.forEach(function (p) {
			access.edit.push(p.project.getUuid());
		});

		this._access.read.forEach(function (p) {
			access.read.push(p.project.getUuid());
		});

		var options = {
			emails : emails,
			customMessage : customMessage,
			access : access
		}

		// send to server
		Wu.send('/api/user/invite', options, this._sentInvites.bind(this, e.target), this);

		// logs
		this._logInvites(options);

	},

	// slack, analytics
	_logInvites : function (options) {

		var read = [];
		var edit = [];
		var description = '';

		options.access.read.forEach(function (p) {
			read.push(app.Projects[p].getTitle());
		});
		options.access.edit.forEach(function (p) {
			edit.push(app.Projects[p].getTitle());
		});

		if (read.length) {
			description += 'to read `' + read.join(', ') + '`';
		}
		if (read.length && edit.length) {
			description += 'and edit `' + edit.join(', ') + '`';
		}
		if (!read.length && edit.length) {
			description += 'to edit `' + edit.join(', ') + '`';
		}

		// send event
		app.Socket.sendUserEvent({
		    	user : app.Account.getFullName(),
		    	event : '`invited` ' + options.emails.join(', '),
		    	description : description,
		    	timestamp : Date.now()
		});
	},

	_sentInvites : function (saveBtn, b, c) {

		// close
		this._fullscreen.close();

		// set feedback 
		app.feedback.setMessage({
			title : 'Invites sent!',
		});
	},

	_createInviteInput : function (options) {

		// invite users
		var content = options.content || this._fullscreen._content;
		var container = this._fullscreen._container;

		// label
		var invite_label = options.label;
		var name = Wu.DomUtil.create('div', 'smooth-fullscreen-name-label invite', content, invite_label);
		
		// container
		var invite_container = Wu.DomUtil.create('div', 'invite-container', content);
		
		// sub-label
		var sublabel = Wu.DomUtil.create('div', 'smooth-fullscreen-sub-label', content, options.sublabel);

		var invite_inner = Wu.DomUtil.create('div', 'invite-inner', invite_container);
		var invite_input_container = Wu.DomUtil.create('div', 'invite-input-container', invite_inner);

		// input box
		var invite_input = Wu.DomUtil.create('input', 'invite-input-form', invite_input_container);

		// invite list
		var invite_list_container = Wu.DomUtil.create('div', 'invite-list-container', invite_container);
		var invite_list_inner = Wu.DomUtil.create('div', 'invite-list-inner', invite_list_container);

		// remember div
		this._divs[options.type].invite_list_container = invite_list_container;

		// for manual scrollbar (js)
		var monkey_scroll_bar = Wu.DomUtil.create('div', 'monkey-scroll-bar', invite_list_inner);
		
		// for holding list
		var monkey_scroll_hider = Wu.DomUtil.create('div', 'monkey-scroll-hider', invite_list_inner);
		var monkey_scroll_inner = Wu.DomUtil.create('div', 'monkey-scroll-inner', monkey_scroll_hider);
		var monkey_scroll_list = Wu.DomUtil.create('div', 'monkey-scroll-list', monkey_scroll_inner);

		// list of all projects, sort alphabetically
		var allProjects = _.sortBy(_.toArray(app.Projects), function (u) {
			return u.getTitle().toLowerCase();
		});
		_.each(allProjects, function (project) {

			// get access
			var access = project.getAccess();
			var isEditor = project.isEditor();
			var isSpectator = project.isSpectator();
			var isShareable = project.isShareable();

			// dont allow spectators with no share access
			if (options.type == 'read' && isSpectator && !isShareable) return;
			
			// dont allow spectators to give edit access
			if (options.type == 'edit' && isSpectator) return;

			// divs
			var list_item_container = Wu.DomUtil.create('div', 'monkey-scroll-list-item-container project', monkey_scroll_list);
			var avatar_container = Wu.DomUtil.create('div', 'monkey-scroll-list-item-avatar-container', list_item_container);
			var avatar = Wu.DomUtil.create('div', 'monkey-scroll-list-item-avatar project', avatar_container, '<i class="project fa fa-map-o"></i>');
			var name_container = Wu.DomUtil.create('div', 'monkey-scroll-list-item-name-container project', list_item_container);
			var name_bold = Wu.DomUtil.create('div', 'monkey-scroll-list-item-name-bold project', name_container);

			// set name
			name_bold.innerHTML = project.getTitle();

			// click event
			Wu.DomEvent.on(list_item_container, 'click', function () {

				// add selected project item to input box
				this._addAccessItem({
					input : invite_input,
					project : project,
					type : options.type,
					trigger : options.trigger
				});

				// optional callback
				if (options.trigger) {
					options.trigger({
						project : project
					});
				}
					
			}, this);
		}, this);


		// input focus, show dropdown
		Wu.DomEvent.on(invite_input, 'focus', function () {
			this._closeInviteInputs();
			invite_list_container.style.display = 'block';
		}, this);

		// focus input on any click
		Wu.DomEvent.on(invite_input_container, 'click', function () {
			invite_input.focus();
		}, this);

		// input keyup
		Wu.DomEvent.on(invite_input, 'keydown', function (e) {

			// get which key
			var key = event.which ? event.which : event.keyCode;

			// get string length
			var value = invite_input.value;
			var text_length = value.length;
			if (text_length <= 0) text_length = 1;

			// set width of input dynamically
			invite_input.style.width = 30 + (text_length * 20) + 'px';

			// backspace on empty field: delete added user
			if (key == 8 && value.length == 0 && this._access[options.type].length) {

				// remove last item
				var popped = this._access[options.type].pop();
				Wu.DomUtil.remove(popped.user_container);

				// optional callback
				if (options.trigger) {
					options.trigger({
						project : false
					});
				}
			}

			// enter: blur input
			if (key == 13) {
				invite_input.blur();
				invite_input.value = '';
				this._closeInviteInputs();
			}

		}, this);


		// close dropdown on any click
		Wu.DomEvent.on(container, 'click', function (e) {

			// only if target == self
			var relevantTarget = 	e.target == container || 
						e.target == this._fullscreen._inner || 
						e.target == name || 
						e.target == this._fullscreen._content;

			// close 
			if (relevantTarget) this._closeInviteInputs();

		},this);
	},

	_closeInviteInputs : function () {

		var container = this._divs.edit.invite_list_container;
		if (container) container.style.display = 'none';

		var container = this._divs.read.invite_list_container;
		if (container) container.style.display = 'none';
	},

	_addAccessItem : function (options) {

		var invite_input = options.input;
		var project = options.project;

		// focus input
		invite_input.focus();

		// don't add twice
		var existing = _.find(this._access[options.type], function (i) {
			return i.project == project;
		});
		if (existing) return;

		// insert project box in input area
		var user_container = Wu.DomUtil.create('div', 'mini-user-container');
		var user_inner = Wu.DomUtil.create('div', 'mini-user-inner', user_container);
		var user_avatar = Wu.DomUtil.create('div', 'mini-project-avatar', user_inner, '<i class="fa fa-map"></i>');
		var user_name = Wu.DomUtil.create('div', 'mini-user-name', user_inner, project.getTitle());
		var user_kill = Wu.DomUtil.create('div', 'mini-user-kill', user_inner, 'x');

		// insert before input
		var invite_input_container = invite_input.parentNode;
		invite_input_container.insertBefore(user_container, invite_input);

		// click event (kill)
		Wu.DomEvent.on(user_container, 'click', function () {
			
			// remove div
			Wu.DomUtil.remove(user_container);
			
			// remove from array
			_.remove(this._access[options.type], function (i) {
				return i.project == project;
			});

			// optional callback
			if (options.trigger) {
				options.trigger({
					project : false
				});
			}

		}, this);

		// add to array
		this._access[options.type].push({
			project : project,
			user_container : user_container
		});

		// remove from other list if active there
		var otherType = (options.type == 'edit') ? 'read' : 'edit';
		var existing = _.find(this._access[otherType], function (i) {
			return i.project == project;
		});
		if (existing) {

			// remove div
			Wu.DomUtil.remove(existing.user_container);
			
			// remove from array
			_.remove(this._access[otherType], function (i) {
				return i == existing;
			});
		}

	},



	refreshUserList : function (data) {

		// if (this.openUserCard) this.addGhost();

		// BIND
		var eachUser = 
			this.D3container
			.selectAll('.chrome-user')
			.data(data);

		// ENTER
		eachUser
			.enter()
			.append('div')
			.classed('chrome-user', true)
			.classed('chrome-left-itemcontainer', true)

		// UPDATE
		eachUser
			.classed('contact', function (d) {
				return d.isContact();
			})
			.classed('project-contact', function (d) {
				return !d.isContact();
			})		

		// EXIT
		eachUser
			.exit()
			.remove();


		// Add user name
		this.addUserName(eachUser);

		// Add action trigger (the [...] button)
		// this.addUserActionTrigger(eachUser);

		// Add user card
		// this.addUserCard(eachUser);

		// add icon to invite to projects
		this.create_inviteToProjectIcon(eachUser);			

		// add icon to add contact
		this.create_addContactIcon(eachUser);	

	
	},

	create_inviteToProjectIcon : function (parent) {

		// Bind
		var nameContent = 
			parent
			.selectAll('.contact-invite-icon')
			.data(function(d) {

				// if user is not a contact
				var a = d.isContact() ? [d] : [];
				return a;
			})

		// Enter
		nameContent
			.enter()
			.append('i')
			.classed('contact-invite-icon', true)
			.classed('fa', true)
			.classed('fa-arrow-circle-right', true)
			

		// Update
		nameContent
			.on('click', function (d) {

				// click on icon
				this._inviteToProject(d);

			}.bind(this));

		// add tooltip
		nameContent
			.html(function (d) {
				var tooltipWidth = 123 + 'px';
				var tooltipText = 'Invite to projects';
				var innerHTML = '<div class="absolute"><div class="project-tooltip contact-invite-tooltip" style="width:' + tooltipWidth + '">' + tooltipText + '</div></div>'
				return innerHTML;
			})
		// Exit
		nameContent
			.exit()
			.remove();

	},

	create_addContactIcon : function (parent) {
		
		// Bind
		var nameContent = 
			parent
			.selectAll('.contact-list-icon')
			.data(function(d) {
				// var a = d.isContact() ? [d] : [];

				// if user is not a contact
				var a = d.isContact() ? [] : [d];
				return a;
			})

		// Enter
		nameContent
			.enter()
			.append('i')
			.classed('contact-list-icon', true)
			.classed('fa', true)
			.classed('fa-user-plus', true)
			

		// Update
		nameContent
			.on('click', function (d) {

				// click on icon
				this._requestContact(d);

			}.bind(this));

		// add tooltip
		nameContent
			.html(function (d) {
				var tooltipWidth = 110 + 'px';
				var tooltipText = 'Add as contact';
				var innerHTML = '<div class="absolute"><div class="project-tooltip contact-add-tooltip" style="width:' + tooltipWidth + '">' + tooltipText + '</div></div>'
				return innerHTML;
			})
		// Exit
		nameContent
			.exit()
			.remove();
	},

	// ADD USER NAME
	// ADD USER NAME
	// ADD USER NAME

	addUserName : function (parent) {


		// Bind
		var nameContent = 
			parent
			.selectAll('.chrome-left-item-name')
			.data(function(d) { return [d] })

		// Enter
		nameContent
			.enter()
			.append('div')
			.classed('chrome-left-item-name', true)

		// Update
		nameContent
			.html(function (d) { 
				return d.getFullName();
			});

		// Exit
		nameContent
			.exit()
			.remove();


	},

	_requestContact : function (user) {

		// send contact request
		app.Account.sendContactRequest(user);
	},

	_onLayerAdded : function (options) {
	},

	_onFileDeleted : function () {
	},

	_onLayerDeleted : function () {
	},

	_onLayerEdited : function () {
	},

	_registerButton : function () {

	},

	_togglePane : function () {

		// right chrome
		var chrome = this.options.chrome;

		// open/close
		this._isOpen ? chrome.close(this) : chrome.open(this); // pass this tab

		if (this._isOpen) {
			// fire event
			app.Socket.sendUserEvent({
				user : app.Account.getFullName(),
				event : 'opened',
				description : 'the left pane',
				timestamp : Date.now()
			});
		}
	},

	_show : function () {
		this._container.style.display = 'block';
		this._isOpen = true;
	},

	_hide : function () {
		this._container.style.display = 'none';
		this._isOpen = false;
	},

	onOpened : function () {
	},

	onClosed : function () {
	},

	_addEvents : function () {
	},

	_removeEvents : function () {
	},

	_onWindowResize : function () {
	},

	getDimensions : function () {
		var dims = {
			width : this.options.defaultWidth,
			height : this._container.offsetHeight
		}
		return dims;
	},

	_refresh : function () {

		// Prepare data as array
		var data = _.toArray(this.users);

		// remove self
		_.remove(data, function (d) {
			return d.getUuid() == app.Account.getUuid();
		})

		// Init user list
		this.refreshUserList(data);			
	},


		// manageAccess : function (user) {

	// 	var accessFullScreen = this.accessFullScreen = Wu.DomUtil.create('div', 'manage-user-access-fullscreen', app._appPane);

	// 	var manageAccessInner = Wu.DomUtil.create('div', 'manage-user-access-inner', accessFullScreen);
	// 	var closeManageAccessButton = Wu.DomUtil.create('div', 'close-manage-user-access', accessFullScreen, 'x');

	// 	var header = Wu.DomUtil.create('div', 'manage-access-title', manageAccessInner);
	// 	header.innerHTML = '<span style="font-weight:200;">Manage access for</span> ' + user.getFullName();

	// 	this.manageProjectsList(manageAccessInner);


	// 	Wu.DomEvent.on(closeManageAccessButton, 'click', this.closeManageAccess, this);

	// },

	// closeManageAccess : function () {

	// 	this.accessFullScreen.innerHTML = '';
	// 	this.accessFullScreen.remove();
	// 	this.removeGhost();

	// },

	// manageProjectsList : function(wrapper) {

	// 	var projects = app.Projects;

	// 	for ( var project in projects ) {

	// 		var projectWrapper = Wu.DomUtil.create('div', 'manage-access-project-wrapper', wrapper);
	// 		var projectTitle = Wu.DomUtil.create('div', 'manage-access-project-title', projectWrapper);
	// 		projectTitle.innerHTML = projects[project].getName();

	// 		var accessButtonsWrapper = Wu.DomUtil.create('div', 'manage-access-buttons-wrapper', projectWrapper);

	// 		var viewButton = Wu.DomUtil.create('div', 'access-button view-project-button active', accessButtonsWrapper, 'View project');
	// 		var downloadButton = Wu.DomUtil.create('div', 'access-button download-project-button', accessButtonsWrapper, 'Download data');
	// 		var inviteButton = Wu.DomUtil.create('div', 'access-button invite-project-button active', accessButtonsWrapper, 'Invite others');
	// 	}

	// },
	

	
	// initGhost : function () {
	// 	this.ghost = Wu.DomUtil.create('div', 'chrome-left-ghost displayNone', this.options.appendTo);
	// 	Wu.DomEvent.on(this.ghost, 'click', this.removeGhost, this);		
	// },

	// removeGhost : function () {
	// 	Wu.DomUtil.addClass(this.ghost, 'displayNone');
	// 	this.openUserCard = false;
	// 	this._refresh();
	// },

	// addGhost : function () {
	// 	Wu.DomUtil.removeClass(this.ghost, 'displayNone');
	// },



	// ADD USER ACTION TRIGGER
	// ADD USER ACTION TRIGGER
	// ADD USER ACTION TRIGGER

	// addUserActionTrigger : function (parent) {


	// 	// Bind
	// 	var userActionTrigger = 
	// 		parent
	// 		.selectAll('.chrome-left-popup-trigger')
	// 		.data(function(d) { return [d] })

	// 	// Enter
	// 	userActionTrigger
	// 		.enter()
	// 		.append('div')
	// 		.classed('chrome-left-popup-trigger', true)

	// 	// Update
	// 	userActionTrigger
	// 		.on('click', function (d) {
	// 			// this.openUserCard = d.getUuid();
	// 			this._refresh();
	// 		}.bind(this));

	// 	// Exit
	// 	userActionTrigger
	// 		.exit()
	// 		.remove();


	// },

	// ADD USER CARD
	// ADD USER CARD
	// ADD USER CARD

	// addUserCard : function (parent) {

	// 	// Bind
	// 	var userCard = 
	// 		parent
	// 		.selectAll('.chrome-user-card')
	// 		.data(function(d) { 
	// 			var uuid = d.getUuid();

	// 			// Only return data if we have a match
	// 			if ( this.openUserCard == uuid ) return [d];

	// 			// Return empty if not active (will not proceed);
	// 			return []; 
	// 		}.bind(this))

	// 	// Enter
	// 	userCard
	// 		.enter()
	// 		.append('div')
	// 		.classed('chrome-user-card', true);			

	// 	// Exit
	// 	userCard
	// 		.exit()
	// 		.remove();



	// 	// TOP CONTAINER
	// 	// TOP CONTAINER
	// 	// TOP CONTAINER

	// 	// Top Container
	// 	var topContainer = userCard
	// 		.append('div')
	// 		.classed('user-card-top-container', true);

	// 	// Close button
	// 	var closeButton = topContainer
	// 		.append('div')
	// 		.classed('user-card-close-button', true)
	// 		.html('x')
	// 		.on('click', function () {
	// 			this.removeGhost();
	// 		}.bind(this));

	// 	// User name
	// 	var userName = topContainer
	// 		.append('div')
	// 		.classed('card-user-name', true)
	// 		.html(function (d) {
	// 			return d.getFullName();
	// 		});

	// 	// Project count
	// 	var projectCount = topContainer
	// 		.append('div')
	// 		.classed('card-user-project-count', true)
	// 		.html(function (d) {
	// 			var projects = d.getProjects();
	// 			if ( projects.length == 1 ) return projects.length + ' project';
	// 			return projects.length + ' projects';
	// 		});


	// 	// BOTTOM CONTAINER
	// 	// BOTTOM CONTAINER
	// 	// BOTTOM CONTAINER

	// 	// Bottom Container
	// 	var bottomContainer = userCard
	// 		.append('div')
	// 		.classed('user-card-bottom-container', true);

	// 	var manageAccess = bottomContainer
	// 		.append('div')
	// 		.classed('manage-user-access', true)
	// 		.html('Manage access')
	// 		.on('click', function (d) {
	// 			this.manageAccess(d);
	// 		}.bind(this))

	// 	var deleteUser = bottomContainer
	// 		.append('div')
	// 		.classed('delete-user', true)
	// 		.html('Delete user')
	// 		.on('click', function (d) {				
	// 			this.deleteUser(d)
	// 		}.bind(this))		

	// },


	// deleteUser : function (user) {
	// 	var name = user.getFirstName() + ' ' + user.getLastName();
	// 	if (confirm('Are you sure you want to delete user ' + name + '?')) {
	// 		if (confirm('Are you REALLY SURE you want to delete user ' + name + '?')) {
	// 			this.confirmDelete(user);
	// 		}			
	// 	}		
	// },

	// confirmDelete : function (user) {
	// 	// delete user         cb
	// 	user.deleteUser(this, 'deletedUser');
	// 	this._refresh();
	// },



});
Wu.Chrome.SettingsContent = Wu.Chrome.extend({

	_initialize : function () {
	},

	initLayout : function () {
	},

	_addEvents : function () {

		var trigger = this.options.trigger;
		if (trigger) {
			Wu.DomEvent.on(trigger, 'click', this.show, this);
		}

		Wu.DomEvent.on(window, 'resize', this._windowResize, this);
	},

	_removeEvents : function () {
		Wu.DomEvent.off(window, 'resize', this._windowResize, this);
	},

	_windowResize : function () {

	},

	_onLayerAdded : function () {
		this._refresh();
	},

	_onLayerEdited : function () {
		this._refresh();
	},

	show : function () {
		if (!this._inited) this._initLayout();

		// hide others
		this.hideAll();

		// show this
		this._container.style.display = 'block';

		// mark button
		Wu.DomUtil.addClass(this.options.trigger, 'active-tab');
	},

	hide : function () {
		this._container.style.display = 'none';
		Wu.DomUtil.removeClass(this.options.trigger, 'active-tab');
	},

	hideAll : function () {
		if (!this.options || !this.options.parent) return console.log('hideAll not possible');

		var tabs = this.options.parent.getTabs();
		for (var t in tabs) {
			var tab = tabs[t];
			tab.hide();
		}

		// Hides the "add folder" in layer menu
		this._hideLayerEditor();

	},
	
	// Hides the "add folder" in layer menu
	_hideLayerEditor : function () {
		var layerMenu = app.MapPane.getControls().layermenu;
		if (layerMenu) layerMenu.disableEdit();
	},

	_projectSelected : function (e) {
		var p = e.detail.projectUuid;
		if (!p) return;

		// set project
		this._project = app.activeProject = app.Projects[p];

		// refresh pane
		this._refresh();
	},

	_refresh : function () {
	},

	_initLayout_activeLayers : function (title, subtitle, container, layers) {

		var title = title || 'Layer';
		var subtitle = subtitle || 'Select a layer to style...';

		// active layer wrapper
		var wrap = this._activeLayersWrap = Wu.DomUtil.create('div', 'chrome chrome-content styler-content active-layer wrapper', container);

		// title
		var title = Wu.DomUtil.create('div', 'chrome chrome-content active-layer title', wrap, title);
		
		// create dropdown
		var selectWrap = Wu.DomUtil.create('div', 'chrome chrome-content active-layer select-wrap', wrap);
		var select = this._select = Wu.DomUtil.create('select', 'active-layer-select', selectWrap);

		// get layers
		if ( !layers ) var layers = this._project.getPostGISLayers();

		// placeholder
		var option = Wu.DomUtil.create('option', '', select);
		option.innerHTML = subtitle;
		option.setAttribute('disabled', '');
		option.setAttribute('selected', '');

		// fill select options
		layers.forEach(function (layer) {
			var option = Wu.DomUtil.create('option', 'active-layer-option', select);
			option.value = layer.getUuid();
			option.innerHTML = layer.getTitle();
		});	


		// select event
		Wu.DomEvent.on(select, 'change', this._selectedActiveLayer, this); // todo: mem leak?

		return select;

	},

	_storeActiveLayerUuid : function (uuid) {
		app.Chrome.Right.options.editingLayer = uuid;
	},

	_getActiveLayerUuid : function () {
		return app.Chrome.Right.options.editingLayer
	},

	opened : function () {
	},

	closed : function () {
	},

	// add layer temporarily for editing
	_tempaddLayer : function () {

		// remember
		this._temps = this._temps || [];

		// remove others
		this._tempRemoveLayers();

		// if not already added to map
		if (!this._layer._added) {

			// add
			this._layer._addThin();

			// remember
			this._temps.push(this._layer);

			// move into view
			this._layer.flyTo();
		}

	},

	// remove temp added layers
	_tempRemoveLayers : function () {
		if (!this._temps) return;

		// remove other layers added tempy for styling
		this._temps.forEach(function (layer) {
			layer._removeThin();
		}, this);

		this._temps = [];
	},



	_gradientStyle : function (colorArray) {

		var gradientStyle = 'background: -webkit-linear-gradient(left, ' + colorArray.join() + ');';
		gradientStyle    += 'background: -o-linear-gradient(right, '     + colorArray.join() + ');';
		gradientStyle    += 'background: -moz-linear-gradient(right, '   + colorArray.join() + ');';
		gradientStyle    += 'background: linear-gradient(to right, '     + colorArray.join() + ');';

		return gradientStyle;

	},		


	// Make sure hex decimals have two digits
	padToTwo : function (numberString) {

		if (numberString.length < 2) numberString = '0' + numberString;
		return numberString;
	},

	// OMG code... haven't written it myself...
	// But it interpolates values between hex values
	hexAverage : function (twoHexes) {
		return twoHexes.reduce(function (previousValue, currentValue) {
			return currentValue
			.replace(/^#/, '')
			.match(/.{2}/g)
			.map(function (value, index) {
				return previousValue[index] + parseInt(value, 16);
			});
		}, [0, 0, 0])
		.reduce(function (previousValue, currentValue) {
			var newValue = this.padToTwo(Math.floor(currentValue / twoHexes.length).toString(16));
			return previousValue + newValue;
		}.bind(this), '#');
	},	

	_validateDateFormat : function (key) {

		// Default fields that for some reason gets read as time formats...
		if ( key == 'the_geom_3857' || key == 'the_geom_4326' || key == '_columns' ) return false;

		// If it's Frano's time series format
		var m = moment(key, ["YYYYMMDD", moment.ISO_8601]).format("YYYY-MM-DD");
		if ( m != 'Invalid date' ) return m;

		// If it's other time format
		var m = moment(key).format("YYYY-MM-DD");
		if ( m != 'Invalid date' ) return m;

		// If it's not a valid date...
		return false;
	},

	// Returns a number between 0 and 1 from a range
	_normalize : function (value, min, max) {
		normalized = (value - min) / (max - min);
		return normalized;
	},

	// Sets min value to zero, and returns value from range, up to 1.
	_normalizeOffset : function (value, min, max) {
		if ( min > 0 ) min = 0;
		normalized = (value - min) / (max - min);
		return normalized;
	},
});

Wu.Chrome.SettingsContent.Filters = Wu.Chrome.SettingsContent.extend({

	options : {
		num_buckets : 50
	},


	_initialize : function () {

		// init container
		this._initContainer();

		// add events
		this._addEvents();
	},

	_initContainer : function () {

		// create container
		this._container = Wu.DomUtil.create('div', 'chrome chrome-content chrome-pane filters', this.options.appendTo);
	},

	_initLayout : function () {

		// Scroller
		this._midSection = Wu.DomUtil.create('div', 'chrome-middle-section', this._container);
		this._midOuterScroller = Wu.DomUtil.create('div', 'chrome-middle-section-outer-scroller', this._midSection);
		this._midInnerScroller = Wu.DomUtil.create('div', 'chrome-middle-section-inner-scroller', this._midOuterScroller);

		// active layer
		this.layerSelector = this._initLayout_activeLayers('Datasets', 'Select a dataset to filter...', this._midInnerScroller);

		// create fixed bottom container
		this._bottomContainer = Wu.DomUtil.create('div', 'sql-bottom-container', this._container);

		// titles
		this._sqltitle = Wu.DomUtil.create('div', 'chrome chrome-content sql title', this._bottomContainer, 'SQL');
		this._sqlSave = Wu.DomUtil.create('div', 'sql-save', this._bottomContainer, 'Save');

		// CodeMirror
		this._codeWrapOuter = Wu.DomUtil.create('div', 'chrome-content sql-wrapper-outer', this._bottomContainer)
		this._codewrap = Wu.DomUtil.create('input', 'chrome chrome-content cartocss code-wrapper', this._codeWrapOuter);

		// sql editor
		this._createSqlEditor();

		// hide by default
		this._hideEditors();

		// set sizes
		this._updateDimensions();

		// mark as inited
		this._inited = true;

		// Init hooks
		this.initHooks();

	},

	initHooks : function () {
		Wu.DomEvent.on(this._sqlSave, 'click', this._updateStyle, this);
		Wu.DomEvent.on(this._sqltitle, 'click', this.toggleSql, this);
	},

	toggleSql : function () {
		if (this.sqlOpen) {
			Wu.DomUtil.removeClass(this._codeWrapOuter, 'active');
			Wu.DomUtil.removeClass(this._sqlSave, 'active');
			Wu.DomUtil.removeClass(this._bottomContainer, 'active');
			Wu.DomUtil.addClass(this._midSection, 'no-sql');
			this.sqlOpen = false;
		} else {
			Wu.DomUtil.addClass(this._codeWrapOuter, 'active');
			Wu.DomUtil.addClass(this._sqlSave, 'active');
			Wu.DomUtil.addClass(this._bottomContainer, 'active');
			Wu.DomUtil.removeClass(this._midSection, 'no-sql');
			this.sqlOpen = true;			
		}
	},

	_refresh : function () {
		this._flush();
		this._initLayout();
	},

	_flush : function () {
		this._SQLEditor = null;
		this._container.innerHTML = '';
	},

	_cleanup : function () {
	},
	_removeEvents : function () {
	},

	_windowResize : function () {
		app._map.invalidateSize();
	},

	_updateDimensions : function () {

		if (!this._SQLEditor) return;

		// get dimensions
		var dims = app.Chrome.Right.getDimensions();

		// set sizes
		var sql = this._SQLEditor.getWrapperElement();
		if (sql) {
			sql.style.width = dims.width + 'px';
			sql.style.height = '1114px';
		}
	},

	_updateStyle : function () {

		// return if no active layer
		if (!this._layer) return console.error('no layer');

		// get sql
		var sql = this.getSQLValue();

		// get css
		var css = this.getCartocssValue();
	
		// request new layer
		var layerOptions = {
			sql : sql,
			css : css,
			layer : this._layer
		}

		// update layer
		this._updateLayer(layerOptions);

	},

	getCartocssValue : function () {
		return this._layer.getCartoCSS();
	},

	getSQLValue : function () {
		return this._SQLEditor.getValue();
	},

	_createSQL : function (file_id, sql) {

		if (sql) {

			// replace 'table' with file_id in sql
			sql.replace('table', file_id);

			// wrap
			sql = '(' + sql + ') as sub';

		} else {
			// default
			sql = '(SELECT * FROM  ' + file_id + ') as sub';
		}
		return sql;
	},

	_updateLayer : function (options, done) {
		var css 	= this.getCartocssValue(),
		    layer 	= options.layer,
		    file_id 	= layer.getFileUuid(),
		    sql 	= options.sql,
		    sql 	= this._createSQL(file_id, sql),
		    project 	= this._project;

		// layer options
		var layerOptions = layer.store.data.postgis;
		layerOptions.sql = sql;
		layerOptions.css = css;
		layerOptions.file_id = file_id;		

		// layer json
		var layerJSON = {
			geom_column: 'the_geom_3857',
			geom_type: 'geometry',
			raster_band: '',
			srid: '',
			affected_tables: '',
			interactivity: '',
			attributes: '',
			access_token: app.tokens.access_token,
			cartocss_version: '2.0.1',
			cartocss : css,
			sql: sql,
			file_id: file_id,
			return_model : true,
			layerUuid : layer.getUuid()
		}

		// create layer on server
		Wu.post('/api/db/createLayer', JSON.stringify(layerJSON), function (err, newLayerJSON) {

			// new layer
			var newLayerStyle = Wu.parse(newLayerJSON);

			// catch errors
			if (newLayerStyle.error) {
				done && done();
				return console.error(newLayerStyle.error);
			}

			// update layer
			layer.updateStyle(newLayerStyle);

			// return
			done && done();
		});

	},

	_refreshLayer : function () {
		console.log('_refreshLayer');
	},

	open : function () {
		console.log('open!', this);
	},

	_selectedActiveLayer : function (e, uuid) {

		// get uuid
		var layerUuid = uuid ? uuid : e.target.value;
		
		// Store uuid of layer we're working with
		this._storeActiveLayerUuid(layerUuid);

		// get layer
		this._layer = this._project.getLayer(layerUuid);

		// Clear chart
		if (this._chart) {
			this._chart.innerHTML = '';
			this._chart = null;
		}

		// filter chart
		this._createFilterDropdown();

		// refresh
		this._refreshEditor();

		// add layer temporarily to map
		this._tempaddLayer();

		// Display bottom container
		this._bottomContainer.style.opacity = 1;

		// Pad up scroller
		Wu.DomUtil.addClass(this._midSection, 'middle-section-padding-bottom');
	},

	opened : function () {
	},

	closed : function () {
		// clean up
		this._tempRemoveLayers();
		this._cleanup();
	},

	_refreshEditor : function () {

		// refresh sql
		this._refreshSQL();

		// show
		this._showEditors();

		// refresh codemirror (cause buggy)
		this._SQLEditor.refresh();
	},

	_refreshCartoCSS : function () {
	},

	_refreshSQL : function () {
		if (!this._layer) return;
		if (!this._layer.isPostgis()) return;

		// get
		var meta = this._layer.getPostGISData();
		var rawsql = meta.sql;
		var table = meta.table_name;
		var sql = rawsql.replace(table, 'table').replace('  ', ' ');

		// remove (etc) as sub
		var sql = this._cleanSQL(sql);

		// set
		this._SQLEditor.setValue(sql);
	
	},

	_cleanSQL : function (sql) {
		var first = sql.substring(0,1);
		var last = sql.slice(-8);

		// if sql is of format (SELECT * FROM table) as sub
		if (first == '(' && last == ') as sub') {
			var clean_sql = sql.substr(1, sql.length -9);
			return clean_sql;
		}
		return sql;
	},

	show : function () {
		if (!this._inited) this._initLayout();

		// hide others
		this.hideAll();

		// show this
		this._container.style.display = 'block';

		// mark button
		Wu.DomUtil.addClass(this.options.trigger, 'active-tab');

		// Enable settings from layer we're working with
		var layerUuid = this._getActiveLayerUuid();
		if (layerUuid) this._selectedActiveLayer(false, layerUuid);		

		// Select layer we're working on
		var options = this.layerSelector.childNodes;
		for (var k in options) {
			if (options[k].value == layerUuid) options[k].selected = true;
		}
	},

	_showEditors : function () {
		this._SQLEditor.getWrapperElement().style.opacity = 1;
	},

	_hideEditors : function () {
		this._SQLEditor.getWrapperElement().style.opacity = 0;
	},

	_createSqlEditor : function () {

		// editor
		this._SQLEditor = CodeMirror.fromTextArea(this._codewrap, {
    			lineNumbers: true,    			
    			mode: {
    				name : 'text/x-sql',
    			},
    			matchBrackets: true,
    			lineWrapping: false,
    			paletteHints : true,
    			gutters: ['CodeMirror-linenumbers', 'errors']
  		});
	},

	_getSortedColumns : function () {
		if (!this._layer) return false

		if (!this._layer.getPostGISData) return false;
	
		var meta = Wu.parse(this._layer.getPostGISData().metadata),
		    columns = meta.columns,
		    keys = Object.keys(columns),
		    keysSorted = keys.sort();

		return keys.reverse();
	},

	_createFilterDropdown : function () {

		// remove already existing dropdown
		if (this._filterDropdown) {
			Wu.DomUtil.remove(this._filterDropdown);
		}

		// set titles
		var title = 'Columns'
		var subtitle = 'Select a column to filter by...';

		// active layer wrapper
		var wrap = this._filterDropdown = Wu.DomUtil.create('div', 'chrome chrome-content styler-content active-layer wrapper');

		// insert on top of container
		this._midInnerScroller.insertBefore(wrap, this._midInnerScroller.children[1]);

		// title
		var titleDiv = Wu.DomUtil.create('div', 'chrome chrome-content active-layer title', wrap, title);
		
		// create dropdown
		var selectWrap = Wu.DomUtil.create('div', 'chrome chrome-content active-layer select-wrap', wrap);
		var select = this._select = Wu.DomUtil.create('select', 'active-layer-select', selectWrap);

		// get layers
		var columns = this._getSortedColumns();

		// placeholder
		var option = Wu.DomUtil.create('option', '', select);
		option.innerHTML = subtitle;
		option.setAttribute('disabled', '');
		option.setAttribute('selected', '');

		// mute columns
		var mute_columns = [
			'_columns'
		]

		// fill dropdown
		columns && columns.forEach(function (column) {
			if (mute_columns.indexOf(column) == -1) {
				var option = Wu.DomUtil.create('option', 'active-layer-option', select);
				option.value = column;
				option.innerHTML = column;
			}
		});

		// select event
		Wu.DomEvent.on(select, 'change', this._selectedFilterColumn, this); // todo: mem leak?

		// clear old filterdi
		this._clearFilterDiv();

		// auto-select option if filter active
		this._autoSelectFilter();
	},

	_clearFilterDiv : function () {
		if (this._filterDiv) this._filterDiv.innerHTML = '';		
	},

	_selectNone : function () {
		this._select.selectedIndex = 0;
	},

	_autoSelectFilter : function () {
		if (!this._layer) return;
		if (!this._layer.isPostgis()) return this._selectNone();
		
		var filter = Wu.parse(this._layer.getFilter());

		if (!filter.length) return; 

		// column
		var column = filter[0].column;

		// create chart
		this._createFilterChart(column);

		// set index in dropdown
		this._select.selectedIndex = this._getDropdownIndex(column);
	},

	_getDropdownIndex : function (column) {
		for (var i = 0; i < this._select.length; i++) {
			if (this._select.options[i].value == column) return i;
		}
		return 0;
	},

	_selectedFilterColumn : function (e) {
		var column = e.target.value;
		this._createFilterChart(column);		
	},

	nullHistogram : function () {
		var histogram = [];
		for (var i = 0; i < this.options.num_buckets-1; i++) {
			histogram.push({
				bucket : i+1,
				freq : 0,
				range : false,
				range_min : 0,
				range_max : 0
			});
		}
		return histogram;
	},

	_createFilterChart : function (column) {

		// Create chart
		if (!this._chart) this._createHistogram(column);

		// Update chart
		this._updateHistogram(column);
	},

	_createHistogram : function (column) {

		// create div
		var filterDiv = this._filterDiv = Wu.DomUtil.createId('div', 'chrome-content-filter-chart');
		this._midInnerScroller.insertBefore(this._filterDiv, this._filterDropdown.nextSibling);

		// create filter label div
		this._filterLabel = Wu.DomUtil.create('div', 'chrome-content-filter-label', this._filterDiv);

		// Create null historgram
		histogram = this.nullHistogram();

		// Create Chart
		this._chart = dc.barChart(this._filterDiv);			

		// Update Chart Data
		this._updateChart(histogram, column);

		// Render chart
		this._chart.render();
	},

	_updateHistogram : function (column) {

		// get histogram from server
		this._getHistogram(column, function (err, histogram) {
			if (err) return console.error('histogram err: ', err);

			// Create null historgram
			if (!histogram) {
				histogram = this.nullHistogram();
				Wu.DomUtil.addClass(this._filterDiv, 'null-histogram');
			} else {
				Wu.DomUtil.removeClass(this._filterDiv, 'null-histogram');
			}

			// Update chart
			this._updateChart(histogram, column);

			// Reset filter
			this._chart.filterAll();

			// render
			this._chart.redraw();

			// check if filter already stored in layer
			this._applyAlreadyStoredFilter(column);			

		}.bind(this))
	},

	_updateChart : function (histogram, column) {

		var ndx = crossfilter(histogram),
		    runDimension = ndx.dimension(function(d) {return +d.bucket;}), 			// x-axis
		    speedSumGroup = runDimension.group().reduceSum(function(d) {return d.freq;}),	// y-axis
		    num_buckets = this.options.num_buckets;

		// chart settings
		this._chart
		    .width(400)
		    .height(180)
		    .gap(2)
		    .x(d3.scale.linear().domain([0, num_buckets]))
		    .brushOn(true) // drag filter
		    .renderLabel(true)
		    .dimension(runDimension)
		    .group(speedSumGroup)
		    .elasticX(true)
		    .elasticY(true)
		    .margins({top: 10, right: 10, bottom: 20, left: 40});

		// filter event (throttled)
		this._chart.on('filtered', function (chart, filter) {

			if (!filter) return this._registerFilter(false);

			// round buckets
			var buckets = [Math.round(filter[0]), Math.round(filter[1])];

			// apply sql filter, create new layer, etc.
			this._registerFilter(column, buckets, histogram);

		}.bind(this));

		// set y axis tick values
		var ytickValues = this._getYAxisTicks(histogram);
		this._chart.yAxis().tickValues(ytickValues);

		// prettier y-axis
		this._chart.yAxis().tickFormat(function(v) {
			if (v > 1000000) return Math.round(v/1000000) + 'M';
			if (v > 1000) return Math.round(v/1000) + 'k';
			return v;
		});

		// set x axis tick spacing
		var xtickValues = this._getXAxisTickSpacing(histogram);
		this._chart.xAxis().tickValues(xtickValues);
	
		// set format of x axis ticks
		this._chart.xAxis().tickFormat(function(v) {
			var bucket = this._getBucket(v, histogram);
			var value = Math.round(bucket.range_min * 100) / 100;
			return value;
		}.bind(this));

		// set events
		this._chart.renderlet(function (chart) {
			this._chart.select('.brush').on('mousedown', this._onBrushMousedown.bind(this));
		}.bind(this));
	},

	_onBrushMousedown : function (e) {
		// add full screen mouseup/mouseout catcher
		this._brushCatcher = Wu.DomUtil.create('div', 'brush-catcher', app._appPane);
		Wu.DomEvent.on(this._brushCatcher, 'mouseup', this._onBrushMouseup, this);
		Wu.DomEvent.on(this._brushCatcher, 'mouseout', this._onBrushMouseup, this);
	},

	_onBrushMouseup : function (e) {
		// remove catcher
		Wu.DomEvent.off(this._brushCatcher, 'mouseup', this._onBrushMouseup, this);
		Wu.DomEvent.off(this._brushCatcher, 'mouseout', this._onBrushMouseup, this);
		Wu.DomUtil.remove(this._brushCatcher);

		// timeout hack, due to d3 race conditions on brush events
		setTimeout(this._applyFilter.bind(this), 500);
	},

	_applyAlreadyStoredFilter : function (column) {
		var filter = this._layer.getFilter();
		if (!filter) return;

		var f = Wu.parse(filter);

		// find column
		var c = _.find(f, function (col) {
			return col.column == column;
		});

		if (!c) return;

		// filter, redraw
		this._chart.filter([c.bucket_min, c.bucket_max]);
		this._chart.redraw();
	},

	_getYAxisTicks : function (histogram) {
		var m = _.max(histogram, function (h) {
			return h.freq;
		});

		var max = m.freq;

		// five ticks
		var num_ticks = 3;
		var ticks = [];
		for (var n = 1; n < num_ticks + 1; n++) {
			var val = max/num_ticks * n;
			var val_rounded = Math.round(val/100) * 100;
			ticks.push(val_rounded);
		}
		return ticks;
	},

	_getXAxisTickSpacing : function (histogram) {

		var maxLength = 0;

		histogram.forEach(function(h) {
			var maxNo = Math.round(h.range_max * 100) / 100;
			var minNo = Math.round(h.range_min * 100) / 100;
			var max = maxNo.toString().length;
			var min = minNo.toString().length;
			if ( maxLength < max ) maxLength = max;
			if ( maxLength < min ) maxLength = min;
		});

		var ticks = this._getSpacedTicks(maxLength);
		return ticks;
	},

	_getSpacedTicks : function (maxLength) {

		// helper fn to find nearest custom number
		function nearest(n, v) {
			n = n / v;
			n = Math.ceil(n) * v;
			return n;
		}

		// get ticks dynamically, based on this.options.num_buckets
		var ticks = [];
		var num_buckets = this.options.num_buckets; // 20, 50, 100

		// total character length possible: 45
		var actual_buckets = parseInt(45/maxLength);
		var s = num_buckets / actual_buckets;
		var step = nearest(s, 5);

		for (var i = 1; i < actual_buckets; i++) {
			var a = step * i;
			if (a <= num_buckets) ticks.push(a);
		} 
		
		return ticks;
	},

	_clearFilter : function () {

		// get sql values
		var currentSQL = this._SQLEditor.getValue();
		var freshSQL = 'SELECT * FROM table';

		// return of no change
		if (currentSQL == freshSQL) return;

		// set sql
		this._SQLEditor.setValue(freshSQL);

		// update style
		this._updateStyle();

		// save filter to layer
		this._layer.setFilter(JSON.stringify([])); // will delete all column filters
	},

	_setFilterLabel : function (value) {
		this._filterLabel.innerHTML = value;
	},

	_registerFilter : function (column, buckets, histogram) {

		// no filter
		if (!column) {
			// set label
			this._setFilterLabel('No filter.');

			// return 
			return this._filters = false;
 		}

 		// filter
 		this._filters = {};
		this._filters.column = column;
		this._filters.buckets = buckets;
		this._filters.histogram = histogram;

		// set label
		var b = this._calculateBuckets(column, buckets, histogram);
		var label = 'Filtering '  + column.toUpperCase() + ' from ' + b.min + ' to ' + b.max + '.';
		this._setFilterLabel(label);
	},

	_getBucket : function (num, histogram, goingDown) {

		// find bucket
		var bucket = _.find(histogram, function (h) {	// doesn't find bucket if bucket is empty.. 
			return h.bucket == num;			//   must look below if goingDown..
		});

		// if bucket empty, find closest (up or down)
		var n = goingDown ? 0 : this.options.num_buckets;
		while (!bucket) {
			n = goingDown ? n + 1 : n - 1;
			bucket = _.find(histogram, function (h) {			// doesn't find bucket if bucket is empty.. 
				if (goingDown) {
					return h.bucket == num - n;			//   must look below if goingDown..
				} else {
					return h.bucket == num + n;			
				}
			});

			// debug stop, prevent infinite loop just in case
			if (n > 100) bucket = true;
		}

		return bucket;
	},

	_calculateBuckets : function (column, buckets, histogram) {

		// get bucket, range
		var bottom_bucket = buckets[0];
		var top_bucket = buckets[1];
		var bucket_min = this._getBucket(bottom_bucket, histogram, true);
		var bucket_max = this._getBucket(top_bucket, histogram);
		var range_min = Math.round(bucket_min.range_min * 100)/100;
		var range_max = Math.round(bucket_max.range_max * 100)/100;

		var b = {
			min : range_min,
			max : range_max,
			bottom : bottom_bucket, 
			top : top_bucket
		}

		return b;
	},

	_applyFilter : function (column, buckets, histogram) {

		if (!this._filters) return this._clearFilter();

		var column = this._filters.column;
		var buckets = this._filters.buckets;
		var histogram = this._filters.histogram;

		// calculate bucket values
		var b = this._calculateBuckets(column, buckets, histogram);
		
		// create SQL
		var sql = 'SELECT * FROM table';
		sql    += ' \nwhere ' + column + ' > ' + b.min + '\nand ' + column + ' < ' + b.max;

		// set sql
		this._SQLEditor.setValue(sql);

		// update style
		this._updateStyle();

		// save filter to layer
		this._layer.setFilter(JSON.stringify([{
			column : column,
			bucket_min : b.bottom,
			bucket_max : b.top
		}]));

	},

	_getHistogram : function (column, done, fresh) {

		// debug switch
		var fresh = true;

		// get fresh histogram from server, if requested
		if (fresh) return this._getFreshHistogram(column, done);

		// get stored histogram
		var postgisData = this._layer.getPostGISData();
		var file_id = postgisData.file_id;
		var file = app.Account.getFile(file_id);
		var histogram = file.getHistogram(column);
		done(null, histogram);
	},

	_getFreshHistogram : function (column, done) {
		if (!this._layer) return;

		var postgisData = this._layer.getPostGISData();

		var options = {
			layer_id : postgisData.layer_id,
			file_id : postgisData.file_id,
			column : column,
			access_token : app.tokens.access_token,
			num_buckets : this.options.num_buckets
		}

		// get histogram 
		Wu.post('/api/db/fetchHistogram', JSON.stringify(options), function (err, histogramJSON) {

			// parse
			var histogramData = Wu.parse(histogramJSON);

			// return
			done && done(null, histogramData);
		});
	}
});

Wu.Chrome.SettingsContent.Cartocss = Wu.Chrome.SettingsContent.extend({

	_initialize : function () {


		// init container
		this._initContainer();

		// add events
		this._addEvents();
	},

	_initContainer : function () {

		// create container
		this._container = Wu.DomUtil.create('div', 'chrome chrome-content chrome-pane cartocss', this.options.appendTo);
	},

	_initLayout : function () {

		// Mid section
		this._midSection = Wu.DomUtil.create('div', 'chrome-middle-section', this._container);

		// active layer
		this.layerSelector = this._initLayout_activeLayers(false, false, this._midSection);

		// wrapper
		this._codewrap = Wu.DomUtil.create('input', 'chrome chrome-content cartocss code-wrapper', this._midSection);

		// sql editor
		// this._createSqlEditor();
		
		// carto editor
		this._createCartoEditor();

		// add shortkeys
		this._setKeymap();

		// create refresh button
		this._createRefresh();

		// insert titles
		this._createTitles();

		// hide by default
		this._hideEditors();

		// set sizes
		this._updateDimensions();

		// mark as inited
		this._inited = true;

	},

	_refresh : function () {

		this._flush();
		this._initLayout();
	},

	_flush : function () {
		this._removeKeymaps();
		this._removeEvents();
		this._cartoEditor = null;
		this._container.innerHTML = '';
	},


	_cleanup : function () {
		// select nothing from dropdown
		// clear carto, sql
		// hide
		// unbind keys
		if (this._select) this._select.selectedIndex = 0;
		this._cartoEditor && this._cartoEditor.setValue('');
		this._hideEditors();
		this._removeKeymaps();
		this._removeEvents();
	},

	_removeEvents : function () {

		// Wu.DomEvent.off(window, 'resize', this._windowResize, this);

	},

	_createTitles : function () {
		
		// create
		this._cartotitle = Wu.DomUtil.create('div', 'chrome chrome-content cartocss title');
		this._cartotitle.innerHTML = 'CartoCSS';
		
		// insert
		var c = this._cartoEditor.getWrapperElement();
		c.parentElement.insertBefore(this._cartotitle, c);

	},

	_createCartoEditor : function () {

		// editor
		this._cartoEditor = CodeMirror.fromTextArea(this._codewrap, {
    			lineNumbers: true,    			
    			mode: {
    				name : 'carto',
    				reference : window.cartoRef
    			},
    			matchBrackets: true,
    			lineWrapping: false,
    			paletteHints : true,
    			gutters: ['CodeMirror-linenumbers', 'errors']
  		});

	},


	_setKeymap : function () {

		this._keymap = {
			"Cmd-S": function(cm){
				this._updateStyle();
			}.bind(this),
			"Ctrl-S": function(cm){
				this._updateStyle();
			}.bind(this),
			"Cmd-R": function(cm){
				this._refreshLayer();
			}.bind(this),
			"Ctrl-R": function(cm){
				this._refreshLayer();
			}.bind(this)
		}

		this._cartoEditor.addKeyMap(this._keymap);
		// this._SQLEditor.addKeyMap(this._keymap);

		
		// keymaster('⌘+r, ctrl+r', function(){
		// 	this._refreshLayer();
		// 	return false;
		// }.bind(this));

		// keymaster('⌘+s, ctrl+s', function(){
		// 	this._updateStyle();
		// 	return false;
		// }.bind(this));

	},

	_removeKeymaps : function () {
		this._cartoEditor && this._cartoEditor.removeKeyMap(this._keymap);
		if (keymaster.unbind) keymaster.unbind('⌘+s, ctrl+s');
		if (keymaster.unbind) keymaster.unbind('⌘+r, ctrl+r');
	},

	

	_updateDimensions : function () {
		if (!this._cartoEditor) return;

		// get dimensions
		var dims = app.Chrome.Right.getDimensions();

		// set sizes
		var carto = this._cartoEditor.getWrapperElement();
		if (carto) {
			carto.style.width = dims.width + 'px';
			// carto.style.height = dims.height - 363 + 'px';
			carto.style.height = dims.height - 325 + 'px';
		}

		
	},

	_windowResize : function () {
		this._updateDimensions();
		app._map.invalidateSize();
	},

	_createRefresh : function () {

		// create fixed bottom container
		this._bottomContainer = Wu.DomUtil.create('div', 'chrome-content-bottom-container displayNone', this._container);		

		var text = (navigator.platform == 'MacIntel') ? 'Save (⌘-S)' : 'Save (Ctrl-S)';
		this._refreshButton = Wu.DomUtil.create('div', 'chrome-right-big-button', this._bottomContainer, text);

		Wu.DomEvent.on(this._refreshButton, 'click', this._updateStyle, this);
	},


	_updateStyle : function () {

		// return if no active layer
		if (!this._layer) return console.error('no layer');

		// get css string
		var css = this.getCartocssValue();

		// return if empty
		if (!css) return console.error('no css');

		// get sql
		var sql = this.getSQLValue();
	
		// request new layer
		var layerOptions = {
			css : css, 
			sql : sql,
			layer : this._layer
		}

		this._updateLayer(layerOptions);

	},

	getCartocssValue : function () {
		return this._cartoEditor.getValue();
	},

	getSQLValue : function () {
		return this._layer.getSQL();
	},


	_createSQL : function (file_id, sql) {

		if (sql) {
			// replace 'table' with file_id in sql
			sql.replace('table', file_id);

			// wrap
			sql = '(' + sql + ') as sub';

		} else {
			// default
			sql = '(SELECT * FROM  ' + file_id + ') as sub';
		}
		return sql;
	},

	_updateLayer : function (options, done) {

		var css = options.css,
		    layer = options.layer,
		    file_id = layer.getFileUuid(),
		    // sql = options.sql,
		    // sql = this._createSQL(file_id, sql),
		    sql = this.getSQLValue(),
		    project = this._project;


		var layerOptions = layer.store.data.postgis;

		// layerOptions.sql = sql;
		layerOptions.css = css;
		layerOptions.file_id = file_id;		

		var layerJSON = {
			geom_column: 'the_geom_3857',
			geom_type: 'geometry',
			raster_band: '',
			srid: '',
			affected_tables: '',
			interactivity: '',
			attributes: '',
			access_token: app.tokens.access_token,
			cartocss_version: '2.0.1',
			cartocss : css,
			sql: sql,
			file_id: file_id,
			return_model : true,
			layerUuid : layer.getUuid()
		}

		// create layer on server
		Wu.post('/api/db/createLayer', JSON.stringify(layerJSON), function (err, newLayerJSON) {

			// new layer
			var newLayerStyle = Wu.parse(newLayerJSON);

			// catch errors
			if (newLayerStyle.error) {
				done && done();
				return console.error(newLayerStyle.error);
			}

			// set & update
			layer.setStyle(newLayerStyle.options);
			layer.update({enable : true});

			// return
			done && done();
		});

	},

	_refreshLayer : function () {
	},

	open : function () {
	},

	_selectedActiveLayer : function (e, uuid) {

		var layerUuid = uuid ? uuid : e.target.value;
		
		// Store uuid of layer we're working with
		this._storeActiveLayerUuid(layerUuid);

		// get layer
		// var layerUuid = e.target.value;
		this._layer = this._project.getLayer(layerUuid);

		// selecting layer in dropdown...
		// .. problems:
		// 1. what if layer is not in layer menu?
		// 2. if not, should it be added?
		// 3. what if user just clicks wrong layer?
		// 4. should actually layers not in layermenu be available in dropdown? (they are now)
		// 5. 
		// ----------
		// SOLUTION: temporarily add layers to map for editing, remove when done editing.


		if (!this._layer || !this._layer.isPostgis()) return;

		// refresh
		this._refreshEditor();

		// add layer temporarily to map
		this._tempaddLayer();


		// Display bottom container
		Wu.DomUtil.removeClass(this._bottomContainer, 'displayNone');		
	},

	

	opened : function () {

	},

	closed : function () {
		// clean up
		this._tempRemoveLayers();
		this._cleanup();
	},

	_refreshEditor : function () {
		
		// fill editors
		this._refreshCartoCSS();

		// show
		this._showEditors();

		// refresh codemirror (cause buggy)
		this._cartoEditor.refresh();
	},

	_refreshCartoCSS : function () {

		// get
		var css = this._layer.getCartoCSS();

		// set
		this._cartoEditor.setValue(css);
	},


	_showEditors : function () {
		if (!this._cartoEditor) return console.error('no cartoEditor');
		this._cartoEditor.getWrapperElement().style.opacity = 1;
		this._cartotitle.style.opacity = 1;
		this._refreshButton.style.opacity = 1;
	},

	_hideEditors : function () {
		if (!this._cartoEditor) return console.error('no cartoEditor');
		this._cartoEditor.getWrapperElement().style.opacity = 0;
		this._cartotitle.style.opacity = 0;
		this._refreshButton.style.opacity = 0;
	},

	show : function () {
		if (!this._inited) this._initLayout();

		// hide others
		this.hideAll();

		// show this
		this._container.style.display = 'block';

		// mark button
		Wu.DomUtil.addClass(this.options.trigger, 'active-tab');

		// Enable settings from layer we're working with
		var layerUuid = this._getActiveLayerUuid();
		if ( layerUuid ) this._selectedActiveLayer(false, layerUuid);		

		// Select layer we're working on
		var options = this.layerSelector.childNodes;
		for ( var k in options ) {
			if ( options[k].value == layerUuid ) options[k].selected = true;
		}

	},
});

Wu.Chrome.SettingsContent.Tooltip = Wu.Chrome.SettingsContent.extend({


	_initialize : function () {


		// init container
		this._initContainer();

		// add events
		this._addEvents();

		// shortcut
		app.Tools = app.Tools || {};
		app.Tools.Tooltip = this;
		
	},

	_initContainer : function () {

		// create container
		this._container = Wu.DomUtil.create('div', 'chrome chrome-content chrome-pane chrome-tooltip', this.options.appendTo);
	},

	_initLayout : function () {


		if (!this._project) return;
  

  		// Scroller
		this._midSection = Wu.DomUtil.create('div', 'chrome-middle-section', this._container);
		this._midOuterScroller = Wu.DomUtil.create('div', 'chrome-middle-section-outer-scroller', this._midSection);
		this._midInnerScroller = Wu.DomUtil.create('div', 'chrome-middle-section-inner-scroller', this._midOuterScroller);

		// active layer
		this.layerSelector = this._initLayout_activeLayers(false, false, this._midInnerScroller);

		// Fields wrapper
		this._fieldsWrapper = Wu.DomUtil.create('div', 'chrome-field-wrapper', this._midInnerScroller);

		// mark as inited
		this._inited = true;
	},

	_refresh : function () {

		if ( this._inited ) this._flush();
		this._initLayout();
	},

	_flush : function () {

		this._midSection.innerHTML = '';
	},

	// Runs on init
	show : function () {

		if (!this._inited) this._initLayout();

		this._fieldsWrapper.innerHTML = '';

		// hide others
		this.hideAll();

		// show this
		this._container.style.display = 'block';

		// mark button
		Wu.DomUtil.addClass(this.options.trigger, 'active-tab');

		// Enable settings from layer we're working with
		var layerUuid = this._getActiveLayerUuid();
		if ( layerUuid ) this._selectedActiveLayer(false, layerUuid);

		// Select layer we're working on
		var options = this.layerSelector.childNodes;
		for ( var k in options ) {
			if ( options[k].value == layerUuid ) options[k].selected = true;
		}		
	},

	// Event run when layer selected 
	_selectedActiveLayer : function (e, uuid) {

		var layerUuid = uuid ? uuid : e.target.value;

		this._layer = this._project.getLayer(layerUuid);

		if (!this._layer) return; // hack
		
		// Store uuid of layer we're working with
		this._storeActiveLayerUuid(layerUuid);

		// Get stored tooltip meta
		this.tooltipMeta = this._layer.getTooltip();
		
		// Get layermeta
		var layerMeta = JSON.parse(this._layer.store.metadata)

		// If no tooltip meta stored, create from layer meta
		if ( !this.tooltipMeta ) this.tooltipMeta = this.createTooltipMeta(layerMeta);

		this._fieldsWrapper.innerHTML = '';

		// Init title
		this.initTitle();

		// Init description
		this.initDescription();

		// Initialize fields
		this.initFields();

	},

	// Title
	initTitle : function () {

		// get title
		var title = this.tooltipMeta.title;

		// Wrapper
		var sectionWrapper = Wu.DomUtil.create('div', 'chrome-content-section-wrapper', this._fieldsWrapper)		
		
		// Header
		var header = Wu.DomUtil.create('div', 'chrome-content-header', sectionWrapper, 'Title');

		var titleInput = Wu.DomUtil.create('input', 'chrome-content-tooltip-title-field', sectionWrapper);
		titleInput.id = 'tooltip-title-input';
		titleInput.name = 'tooltip-title-input';
		titleInput.setAttribute('placeholder', this._layer.store.title);

		if (title) titleInput.value = title;

		// set save event
		Wu.DomEvent.on(titleInput, 'blur', this.saveTitle, this);
	},

	// Description
	initDescription : function () {
	},


	// Init meta fields and time series
	initFields : function () {

		this.fieldListFromObject('Fields');
		if ( this.tooltipMeta.timeSeries ) this.initTimeSeries();
	},

	// Creates section with meta field lines
	fieldListFromObject : function (title, timeSeries) {

		var fields = timeSeries ? this.tooltipMeta.timeSeries : this.tooltipMeta.metaFields;

		var sectionWrapper = Wu.DomUtil.create('div', 'chrome-content-section-wrapper', this._fieldsWrapper)
		var header = Wu.DomUtil.create('div', 'chrome-content-header', sectionWrapper, title);

		// Function that saves on blur/click
		var saveFunction = timeSeries ? this._saveSwitchTimeSeries : this._saveSwitch;

		var hasInput = timeSeries ? false : true;

		for ( var key in fields ) {
			
			var isOn = fields[key].on;
			var title = fields[key].title;

			// Block 
			if ( key == 'enable' || key == 'minmaxRange' || key == 'graphstyle' ) return;

			var line = new Wu.fieldLine({
				id       : key,
				appendTo : sectionWrapper,
				title    : title,
				input    : hasInput,
				fn 	 : this._saveFromBlur.bind(this),
			});		

			var _switch = new Wu.button({
				id 	 : key,
				type 	 : 'switch',
				isOn 	 : isOn,
				right 	 : false,
				appendTo : line.container,
				fn       : saveFunction.bind(this)
			});



		}
	},

	// Cretes section with time series
	initTimeSeries : function () {

		var timeSeries = this.tooltipMeta.timeSeries;

		// Wrapper
		var sectionWrapper = Wu.DomUtil.create('div', 'chrome-content-section-wrapper', this._fieldsWrapper)		
		
		// Header
		var header = Wu.DomUtil.create('div', 'chrome-content-header', sectionWrapper, 'Time series');
		var headerExtra = Wu.DomUtil.create('span', 'chrome-content-header-gray', header, ' (auto detected)');


		// Time series switch
		// Time series switch
		// Time series switch

		var timeSeriesLine = new Wu.fieldLine({
			id       : 'enable',
			appendTo : sectionWrapper,
			title    : 'Enable time series',
			input    : false,
		});		

		var timeSeriesSwitch = new Wu.button({
			id 	 : 'enable',
			type 	 : 'switch',
			isOn 	 : this.tooltipMeta.timeSeries.enable,
			right 	 : false,
			appendTo : timeSeriesLine.container,
			fn 	 : this._saveSwitch.bind(this),
		});



		// RANGE
		// RANGE
		// RANGE

		var rangeLine = new Wu.fieldLine({
			id       : 'minmaxRange',
			appendTo : sectionWrapper,
			title    : 'Range',
			input    : false,
		})

		var rangeMiniInput = new Wu.button({
			id 	    : 'minmaxRange',
			type 	    : 'miniInput',
			right 	    : false,
			isOn        : true,
			appendTo    : rangeLine.container,
			value       : this.tooltipMeta.timeSeries.minmaxRange,
			placeholder : 'auto',
			tabindex    : 1,
			fn 	    : this._saveMiniBlur.bind(this),
		})



		// Create list of time series fields
		this.fieldListFromObject('Time Series Fields', true);
	},	
	

	// Save title
	saveTitle : function (e) {

		this.tooltipMeta.title = e.target.value;
		this._layer.setTooltip(this.tooltipMeta);
	},

	// Saves tiny input to right
	_saveMiniBlur : function (e) {

		var key   = e.target.id.substring(17, e.target.id.length)
		var value = e.target.value;

		this._saveToServer(key, value);
	},

	// Save input fields in meta field lines
	_saveFromBlur : function (e) {
	
		var key   = e.target.id.substring(12, e.target.id.length);
		var title = e.target.value;
		
		var thisSwitch = Wu.DomUtil.get('switch_' + key);
		var thisSwitchState = thisSwitch.getAttribute('state');

		// var on = thisSwitchState ? true : false;
		if ( thisSwitchState == 'true' ) {
			var on = true;
		} else {
			var on = false;
		}

		this._saveToServer(key, on, title);
	},

	// Saves switches, etc
	_saveSwitch : function (e, on) {

		var elem = e.target;
		var key  = elem.getAttribute('key');

		var titleField = Wu.DomUtil.get('field_input_' + key);
		var title      = titleField ? titleField.value : false;


		// If no title, set to false
		var title = titleField ? titleField.value : false;

		// Save to server
		this._saveToServer(key, on, title);
	},

	_saveSwitchTimeSeries : function (e, on) {

		var elem = e.target;
		var key  = elem.getAttribute('key');

		var titleField = Wu.DomUtil.get('field_input_' + key);
		var title      = titleField ? titleField.value : false;

		// If no title, set to false
		var title = titleField ? titleField.value : false;

		// Save to server
		this._saveToServer(key, on, title);
	},




	_saveToServer : function (key, value, title) {

		if ( key == 'enable' || key == 'minmaxRange' || key == 'graphstyle' ) {
			
			// Update object
			this.tooltipMeta.timeSeries[key] = value;

			// Save to server
			this._layer.setTooltip(this.tooltipMeta);

		} else {

			// Check if key is date	
			var keyIsDate = this._validateDateFormat(key);
			
			// If key is date, try to update timeseries
			if ( keyIsDate ) var timeUpdated = this.updateTimeSeriesMeta(key, title, value);
			
			// If key is not date, or could not be found in time series, go through metafields
			if ( !timeUpdated || !keyIsDate ) this.updateMeta(key, title, value);
		
		}

		this._layer.setTooltip(this.tooltipMeta);
	},



	// Save helpers – goes through the JSON object to find a key match in the time series
	updateTimeSeriesMeta : function (key, title, on) {	

		var timeSeries = this.tooltipMeta.timeSeries;
		var hit = false;

		for ( var f in timeSeries ) {

			if ( f == key ) {

				timeSeries[f].title = false;
				timeSeries[f].on = on;

				hit = true
			}
		}

		return hit;
	},

	// Save helper – goes through the JSON object to find a key match in the meta fields
	updateMeta : function (key, title, on) {	

		var metaFields = this.tooltipMeta.metaFields;

		for ( var f in metaFields ) {

			if ( f == key ) {
				metaFields[f].title = title;
				metaFields[f].on = on;
				return;
			}
		}
	},

	
	open : function () {
		console.log('open!', this);
	},



	// DATA BUILDERS
	// DATA BUILDERS
	// DATA BUILDERS
	// DATA BUILDERS

	// Gets called from Chrome Data _onLayerAdded()
	// TODO: Events?

	_buildTooltipMeta : function (layerMeta) {
		return this.createTooltipMeta(layerMeta);
	},


	// Tooltip meta
	createTooltipMeta : function (layerMeta) {

		// Get columns
		var columns = layerMeta.columns;

		// Returns object with timeseries separated from the other fields
		var splitMetaData = this.buildTimeSeries(columns);

		if (splitMetaData[1] > 5) {
			return splitMetaData[0];
		} else {
			return this.cleanColumns(columns);
		}
	},

	// Create clean columns (without time series)
	cleanColumns : function (columns) {

		var metaData = {
			title : '',
			description : false,
			metaFields : {},
			timeSeries : false
		};

		for (var f in columns) {
			metaData.metaFields[f] = {
					title : false,
					on    : true
			}
		}

		return metaData;
	},

	// Splits metadata into "time series" and "meta fields"
	buildTimeSeries : function (columns) {

		var metaData = {
			title : '',
			description : false,			
			timeSeries : {},
			metaFields : {}
		}
		
		var timeSeriesCount = 0;

		for ( var f in columns ) {

			// validate time
			var isTime = this._validateDateFormat(f);

			// Is time series
			if ( isTime ) {
				
				metaData.timeSeries[f] = {
						title : false,
						on    : true
				}

				timeSeriesCount ++;

			// Is not time series
			} else {
				
				metaData.metaFields[f] = {
						title : false,
						on    : true
				};

			}       
		}

		// Set time series to true by default
		metaData.timeSeries.enable = true;

		return [metaData, timeSeriesCount];
	},	

});

// Wu.Chrome.SettingsContent.Mapsettings = Wu.Chrome.SettingsContent.extend({

// 	_initialize : function () {

// 		// init container
// 		this._initContainer();

// 		// add events
// 		this._addEvents();
// 	},

// 	_initContainer : function () {

// 		// create container
// 		this._container = Wu.DomUtil.create('div', 'chrome chrome-content chrome-pane mapsettings', this.options.appendTo);
// 	},

// 	_initLayout : function () {

// 		// return if no project
// 		if (!this._project) return;

// 		// check permissions
// 		if (!app.access.to.edit_project(this._project)) return;


// 		// Scroller
// 		this._midSection = Wu.DomUtil.create('div', 'chrome-middle-section', this._container);
// 		this._midOuterScroller = Wu.DomUtil.create('div', 'chrome-middle-section-outer-scroller', this._midSection);		
// 		this._midInnerScroller = Wu.DomUtil.create('div', 'chrome-middle-section-inner-scroller', this._midOuterScroller);		

// 		this._fieldsWrapper = Wu.DomUtil.create('div', 'chrome-field-wrapper', this._midInnerScroller);
		
// 		this.initSettings('Controls');

// 		this.initBoundPos('Bounds & Position');

// 		// mark as inited
// 		this._inited = true;		
// 	},

// 	_refresh : function () {

// 		this._flush();
// 		this._initLayout();
// 	},

// 	_flush : function () {

// 		this._container.innerHTML = '';
// 	},
	
// 	show : function () {

// 		if (!this._inited) this._initLayout();

// 		// hide others
// 		this.hideAll();

// 		// show this
// 		this._container.style.display = 'block';

// 		// mark button
// 		Wu.DomUtil.addClass(this.options.trigger, 'active-tab');
// 	},

// 	open : function () {
// 		console.log('open!', this);
// 	},	

// 	// Creates section with meta field lines
// 	initSettings : function (title) {

// 		// wrappers
// 		var sectionWrapper = Wu.DomUtil.create('div', 'chrome-content-section-wrapper', this._fieldsWrapper)
// 		var header = Wu.DomUtil.create('div', 'chrome-content title', sectionWrapper, title);

// 		var options = {

// 			zoom : {
// 				enable : true,
// 				name   : 'Zoom'
// 			},
// 			draw : {
// 				enable : true,
// 				name   : 'Draw'
// 			},
// 			description : {
// 				enable : true,
// 				name   : 'Description/legend'
// 			},
// 			measure : {
// 				enable : true,
// 				name   : 'Measure'		
// 			},
// 			mouseposition : {
// 				enable : true,
// 				name   : 'Mouse position'
// 			},
// 			geolocation : {
// 				enable : true,
// 				name   : 'Geo search'				
// 			},

// 			// Inactive
// 			layermenu : {
// 				enable : false,
// 				name   : 'Layer menu'
// 			},
// 			legends : {
// 				enable : false,
// 				name   : 'Legend'
// 			},
// 			baselayertoggle : {
// 				enable : false,
// 				name   : 'Base layer toggle'
// 			},
// 			cartocss : {
// 				enable : false,
// 				name   : 'CartoCSS'
// 			},
// 		}

// 		// Get control
// 		var project = app.activeProject;

// 		for ( var key in options ) {
			
// 			var enable  = options[key].enable;			

// 			if ( enable ) {

// 				var title = options[key].name;

// 				var line = new Wu.fieldLine({
// 					id       : key,
// 					appendTo : sectionWrapper,
// 					title    : title,
// 					input    : false,
// 				});		

// 				var _switch = new Wu.button({ 
// 					id 	 : key,					
// 					type 	 : 'switch',
// 					isOn 	 : project.store.controls[key],
// 					right 	 : false,
// 					appendTo : line.container,
// 					fn 	 : this._saveSwitch.bind(this),
// 				});
// 			}
// 		}
// 	},

// 	initBoundPos : function (title) {

// 		var sectionWrapper = Wu.DomUtil.create('div', 'chrome-content-section-wrapper', this._fieldsWrapper)
// 		var header = Wu.DomUtil.create('div', 'chrome-content title', sectionWrapper, title);

// 		var isBoundsSet = this.isBoundsSet();

// 		// Line
// 		var boundsLine = new Wu.fieldLine({
// 			id        : 'bounds',
// 			appendTo  : sectionWrapper,
// 			title     : 'Bounds',
// 			className : 'no-padding',
// 			input     : false,
// 		});

// 		// Switch
// 		var setClearBounds = new Wu.button({ 
// 			id 	 : 'bounds',
// 			type 	 : 'setclear',
// 			isOn 	 : isBoundsSet,
// 			right 	 : false,
// 			appendTo : boundsLine.container,
// 			fn 	 : this._saveSetClear.bind(this),
// 		});

// 		// Line
// 		var positionLine = new Wu.fieldLine({
// 			id        : 'position',
// 			appendTo  : sectionWrapper,
// 			title     : 'Position',
// 			className : 'no-padding',
// 			input     : false,
// 		})				

// 		// Switch
// 		var setPosition = new Wu.button({ 
// 			id 	 : 'position',
// 			type 	 : 'set',
// 			isOn 	 : false,
// 			right 	 : false,
// 			appendTo : positionLine.container,
// 			fn 	 : this._saveSet.bind(this),
// 		});

// 	},


// 	isBoundsSet : function () {

// 		var bounds = app.activeProject.getBounds();

// 		// If no bounds
// 		if ( !bounds ) return false;

// 		var maxZoom      = bounds.maxZoom;
// 		var minZoom      = bounds.minZoom;
// 		var northEastLat = bounds.northEast.lat;
// 		var northEastLng = bounds.northEast.lng;
// 		var southWestLat = bounds.southWest.lat;
// 		var southWestLng = bounds.southWest.lng;

// 		// If bounds sat to view everything (clear)
// 		if ( maxZoom      == 20 &&
// 		     minZoom      == 1 &&
// 		     northEastLat == 90 &&
// 		     northEastLng == 180 &&
// 		     southWestLat == -90 &&
// 		     southWestLng == -180
// 		) return false;

// 		// Bounds are set
// 		return true;

// 	},

// 	_saveSwitch : function (e) {

// 		var item = e.target;
// 		var stateAttrib = e.target.getAttribute('state');
// 		var on = (stateAttrib == 'true');
// 		var key = e.target.getAttribute('key');		

// 		// Get control
// 		var control = app.MapPane.getControls()[key];

// 		if (!control) return console.error('no control!', key, on);

// 		// Save
// 		var project = app.activeProject;
// 		    project.store.controls[key] = on;
// 		    project._update('controls');

// 		// toggle on map
// 		on ? control._on() : control._off();

// 	},

// 	_saveSetClear : function (key, on) {
// 		if ( key == 'bounds' ) on ? this.setBounds() : this.clearBounds();
// 	},

// 	_saveSet : function (key) {
// 		if ( key == 'position' ) this.setPosition();
// 	},

// 	setPosition : function () {

// 		// get actual Project object
// 		var project = app.activeProject;

// 		// if no active project, do nothing
// 		if (!project) return; 

// 		// get center and zoom
// 		var center = Wu.app._map.getCenter();
// 		var zoom   = Wu.app._map.getZoom();

// 		// set position 
// 		var position = {
// 			lat  : center.lat,
// 			lng  : center.lng,
// 			zoom : zoom
// 		}

// 		// save to project
// 		project.setPosition(position);
// 	},		



// 	// SET/ CLEAR BOUNDS
// 	// SET/ CLEAR BOUNDS
// 	// SET/ CLEAR BOUNDS		

// 	setBounds : function (e) {
		
// 		// get actual Project object
// 		var project = app.activeProject;

// 		// if no active project, do nothing
// 		if (!project) return; 

// 		// get map bounds and zoom
// 		var bounds = Wu.app._map.getBounds();
// 		var zoom   = Wu.app._map.getZoom();

// 		// write directly to Project
// 		project.setBounds({
// 			northEast : {
// 				lat : bounds._northEast.lat,
// 				lng : bounds._northEast.lng
// 			},

// 			southWest : {
// 				lat : bounds._southWest.lat,
// 				lng : bounds._southWest.lng
// 			},
// 			minZoom : zoom,
// 			maxZoom : 18
// 		});
		
// 		// enforce new bounds
// 		this.enforceBounds();
// 	},

// 	clearBounds : function () {
		
// 		// get actual Project object
// 		var project = Wu.app.activeProject;
// 		var map = Wu.app._map;

// 		var nullBounds = {
// 			northEast : {
// 				lat : '90',
// 				lng : '180'
// 			},

// 			southWest : {
// 				lat : '-90',
// 				lng : '-180'
// 			},
// 			minZoom : '1',
// 			maxZoom : '20'
// 		}

// 		// set bounds to project
// 		project.setBounds(nullBounds);

// 		// enforce
// 		this.enforceBounds();

// 		// no bounds
// 		map.setMaxBounds(false);
// 	},		

// 	enforceBounds : function () {
		
// 		var project = app.activeProject;
// 		var map     = app._map;

// 		// get values
// 		var bounds = project.getBounds();

// 		if (bounds) {
// 			var southWest   = L.latLng(bounds.southWest.lat, bounds.southWest.lng);
// 	   		var northEast 	= L.latLng(bounds.northEast.lat, bounds.northEast.lng);
// 	    		var maxBounds 	= L.latLngBounds(southWest, northEast);
// 			var minZoom 	= bounds.minZoom;
// 			var maxZoom 	= bounds.maxZoom;

// 	    		if (bounds == this._nullBounds) {
// 	    			map.setMaxBounds(false);
// 	    		} else {
// 	    			map.setMaxBounds(maxBounds);
// 	    		}
			
// 			// set zoom
// 			map.options.minZoom = minZoom;
// 			map.options.maxZoom = maxZoom;	
// 		}
		

// 		map.invalidateSize();
// 	},
// });

Wu.Chrome.SettingsContent.SettingsSelector = Wu.Chrome.SettingsContent.extend({

	_ : 'settingsSelector',

	options : {

		tabs : {
			styler : {
				enabled : true,
				text : 'Style'
			},
			tooltip : {
				enabled : true,
				text : 'Popup'
			},
			filters : {
				enabled : true,
				text : 'Filters'
			},
			cartocss : {
				enabled : true,
				text : 'CartoCSS'
			},
			extras : {
				enabled : true,
				text : 'Extras'
			},
		}
		
	},

	_initialize : function (options) {

		// set options
		Wu.setOptions(this, options);

		// init container
		this._initContainer();

		// init content
		this._initContent();

		// register a button in top chrome
		this._registerButton();

		// hide by default
		this._hide();


		app.Tools = app.Tools || {};
		app.Tools.SettingsSelector = this;

	},

	_refresh : function () {

		// access_v2
		// this._settingsButton.style.display = )app.activeProject.isEditable( ? '' : 'none';

		if (app.activeProject.isEditable()) {
			Wu.DomUtil.removeClass(this._settingsButton, 'disabledBtn');
		} else {
			Wu.DomUtil.addClass(this._settingsButton, 'disabledBtn');
		}
	},


	_initContainer : function () {

		// create container
		this._container = Wu.DomUtil.create('div', 'chrome chrome-content settingsSelector', this.options.appendTo);

		// header wrapper
		this._header = Wu.DomUtil.create('div', 'settingsSelector-header', this._container)

		// tabs wrapper
		this._tabsWrapper = Wu.DomUtil.create('div', 'chrome chrome-content settings-tabs-wrapper', this._container);
	},

	_initContent : function () {

		// title
		// this._title = Wu.DomUtil.create('div', 'chrome chrome-content settings-title', this._header, 'Settings');

		// tabs
		this._initTabs();
	},

	_registerButton : function () {

		// top
		var top = app.Chrome.Top;

		// add a button to top chrome
		this._settingsButton = top._registerButton({
			name : 'settingsSelector',
			className : 'chrome-button settingsSelector',
			trigger : this._togglePane,
			context : this,
			project_dependent : true
		});

		// css experiement
		this._settingsButton.innerHTML = '<i class="top-button fa fa-paint-brush"></i>Style';
	},

	_initTabs : function () {

		// tabs object
		this._tabs = {};

		// button wrapper
		this._buttonWrapper = Wu.DomUtil.create('div', 'chrome chrome-content settings-button-wrapper', this._header);
		
		// create tabs
		for (var o in this.options.tabs) {
			if (this.options.tabs[o].enabled) {

				var text = this.options.tabs[o].text;
				var tab = o.camelize();

				// create tab contents
				if (Wu.Chrome.SettingsContent[tab]) {

					// create tab button
					var trigger = Wu.DomUtil.create('div', 'chrome chrome-content settings-button', this._buttonWrapper, text);

					// create content
					this._tabs[tab] = new Wu.Chrome.SettingsContent[tab]({
						options : this._options,
						trigger : trigger,
						appendTo : this._tabsWrapper,
						parent : this
					});
				}
			}
		}
	},

	getTabs : function () {
		return this._tabs;
	},

	_togglePane : function () {

		if (!app.activeProject.isEditable()) return; // safeguard

		// right chrome
		var chrome = this.options.chrome;

		// open/close
		this._isOpen ? chrome.close(this) : chrome.open(this); // pass this tab

		if (this._isOpen) {
			
			// fire event
			app.Socket.sendUserEvent({
			    	user : app.Account.getFullName(),
			    	event : 'opened',
			    	description : 'the settings',
			    	timestamp : Date.now()
			})
		}
	},

	_show : function () {

		Wu.DomUtil.addClass(this._settingsButton, 'active');

		this._container.style.display = 'block';
		this._isOpen = true;

		Wu.DomUtil.addClass(this._settingsButton, 'active');
	},

	_hide : function () {

		Wu.DomUtil.removeClass(this._settingsButton, 'active');

		this._container.style.display = 'none';
		this._isOpen = false;

		Wu.DomUtil.removeClass(this._settingsButton, 'active');
	},

	onOpened : function () {

		// default styler
		this._tabs['Styler'].show();
	},

	// clean up on close
	onClosed : function () {

		for (var t in this._tabs) {
			this._tabs[t].closed();
		}

		// Make sure the "add folder"/editing of layer menu is closed
		var layerMenu = app.MapPane.getControls().layermenu;	 // move to settings selector
		if (layerMenu) layerMenu.disableEdit();

	},

	_refreshAll : function () {
		for (var t in this._tabs) {
			this._tabs[t]._refresh();
		}
	},
});

Wu.Chrome.SettingsContent.Styler = Wu.Chrome.SettingsContent.extend({

	_carto : {},

	options : {
		dropdown : {
			staticText : 'Fixed value',
			staticDivider : '-'
		}
	},

	_initialize : function () {

		// init container
		this._initContainer();

		// add events
		this._addEvents();

		// shortcut
		this._shortcut();
	},
	
	_shortcut : function () {
		app.Tools = app.Tools || {};
		app.Tools.Styler = this;
	},

	_initContainer : function () {

		// create container
		this._container = Wu.DomUtil.create('div', 'chrome chrome-content chrome-pane styler', this.options.appendTo);
	},

	_initLayout : function () {

		if (!this._project) return;

		// Scroller
		this._midSection 	= Wu.DomUtil.create('div', 'chrome-middle-section', this._container);
		this._midOuterScroller 	= Wu.DomUtil.create('div', 'chrome-middle-section-outer-scroller', this._midSection);		
		this._midInnerScroller 	= Wu.DomUtil.create('div', 'chrome-middle-section-inner-scroller', this._midOuterScroller);

		// active layer
		this.layerSelector = this._initLayout_activeLayers(false, false, this._midInnerScroller); // appending to this._midSection


		// Create field wrapper
		this._fieldsWrapper = Wu.DomUtil.create('div', 'chrome-field-wrapper', this._midInnerScroller);

		// update style button
		var buttonWrapper = Wu.DomUtil.create('div', 'button-wrapper', this._midInnerScroller);
		this._updateStyleButton = Wu.DomUtil.create('div', 'smooth-fullscreen-save update-style', buttonWrapper, 'Update Style');
		Wu.DomEvent.on(this._updateStyleButton, 'click', this._updateStyle, this);		


		// mark inited
		this._inited = true;
	},

	_initStyle : function () {

		this.getLayerMeta();

		var options = {
			carto 	: this._carto,
			layer 	: this._layer,
			project : this._project,
			styler 	: this,
			meta 	: this._meta,
			columns : this._columns,
			container : this._fieldsWrapper,
		}

		// create point styler
		this._pointStyler = new Wu.Styler.Point(options);

		// create polygon styler
		this._polygonStyler = new Wu.Styler.Polygon(options);

		// create line styler
		this._lineStyler = new Wu.Styler.Line(options);

	},

	markChanged : function () {
		Wu.DomUtil.addClass(this._updateStyleButton, 'marked-changed');
	},

	_updateStyle : function () {

		this._pointStyler.updateStyle();
		this._polygonStyler.updateStyle();
		this._lineStyler.updateStyle();

		Wu.DomUtil.removeClass(this._updateStyleButton, 'marked-changed');

	},
	
	_refresh : function () {
		this._flush();
		this._initLayout();
	},

	_flush : function () {
		this._container.innerHTML = '';
	},

	show : function () {
		if (!this._inited) this._initLayout();

		// hide others
		this.hideAll();

		// show this
		this._container.style.display = 'block';

		// mark button
		Wu.DomUtil.addClass(this.options.trigger, 'active-tab');
		
		// Enable settings from layer we're working with
		var layerUuid = this._getActiveLayerUuid();
		if (layerUuid) this._selectedActiveLayer(false, layerUuid);		

		// Select layer we're working on
		var options = this.layerSelector.childNodes;
		for (var k in options) {
			if (options[k].value == layerUuid) options[k].selected = true;
		}
	},

	closed : function () {

		// clean up
		this._tempRemoveLayers();
	},	


	// event run when layer selected 
	_selectedActiveLayer : function (e, uuid) {

		// clear wrapper content
		this._fieldsWrapper.innerHTML = '';

		// get layer_id
		this.layerUuid = uuid ? uuid : e.target.value

		// get layer
		this._layer = this._project.getLayer(this.layerUuid);

		// return if no layer
		if (!this._layer || !this._layer.isPostGIS()) return;

		// remember layer for other tabs
		this._storeActiveLayerUuid(this.layerUuid);		

		// get current style, returns default if none
		var style = this._layer.getStyling();

		// define tab
		this.tabindex = 1;

		// set local cartoJSON
		this._carto = style || {};

		// init style json
		this._initStyle();

		// Add temp layer
		this._tempaddLayer();
	},

	
	// Get all metafields	
	getLayerMeta : function () {

		// Get layer
		var layer = this._project.getLayer(this.layerUuid);

		// Get stored tooltip meta
		var tooltipMeta = layer.getTooltip();
		
		// Get layermeta
		var layerMeta = layer.getMeta();

		// Get columns
		this._columns = layerMeta.columns;

		// remove _columns key
		this._columns._columns = null;
		delete this._columns._columns;

		// get metafields
		this._meta = [this.options.dropdown.staticText, this.options.dropdown.staticDivider];

		// add non-date items
		for (var k in this._columns) {
			var isDate = this._validateDateFormat(k);
			if (!isDate) this._meta.push(k);
		}
	},

	createCarto : function (json, callback) {

		var options = {
			style : json,
			columns : this._columns
		}

		// get carto from server
		Wu.post('/api/geo/json2carto', JSON.stringify(options), callback.bind(this), this);
	},

});

Wu.Styler = Wu.Class.extend({

	options :  {
		defaults : {
			range : ['#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff'],
			color : '#FF33FF',
			opacity : 0.5
		},
		dropdown : {
			staticText : 'Fixed value',
			staticDivider : '-'
		},
		palettes : [ 
			['#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff'],
			['#0000ff', '#00ffff', '#00ff00', '#ffff00', '#ff0000'],
			
			['#f0f9e8', '#bae4bc', '#7bccc4', '#43a2ca', '#0868ac'],
			["#0868ac", "#43a2ca", "#7bccc4", "#bae4bc", "#f0f9e8"],

			['#ffffb2', '#fecc5c', '#fd8d3c', '#f03b20', '#bd0026'],
			["#bd0026", "#f03b20", "#fd8d3c", "#fecc5c", "#ffffb2"],

			['#feebe2', '#fbb4b9', '#f768a1', '#c51b8a', '#7a0177'],
			["#7a0177", "#c51b8a", "#f768a1", "#fbb4b9", "#feebe2"],

			['#d7191c', '#fdae61', '#ffffbf', '#abdda4', '#2b83ba'],
			["#2b83ba", "#abdda4", "#ffffbf", "#fdae61", "#d7191c"],

			['#d01c8b', '#f1b6da', '#f7f7f7', '#b8e186', '#4dac26'],
			["#4dac26", "#b8e186", "#f7f7f7", "#f1b6da", "#d01c8b"],

			['#e66101', '#fdb863', '#f7f7f7', '#b2abd2', '#5e3c99'],
			["#5e3c99", "#b2abd2", "#f7f7f7", "#fdb863", "#e66101"],

			['#ca0020', '#f4a582', '#f7f7f7', '#92c5de', '#0571b0'],
			["#0571b0", "#92c5de", "#f7f7f7", "#f4a582", "#ca0020"],

			['#ff00ff', '#ffff00', '#00ffff'],
			['#00ffff', '#ffff00', '#ff00ff'],

			['#ff0000', '#ffff00', '#00ff00'], // todo: throws error if 4 colors..	
			['#00ff00', '#ffff00', '#ff0000'],
		],

		blendModes : ["color", "color-burn", "color-dodge", "contrast", "darken", "difference", "dst", "dst-atop", "dst-in", "dst-out", "dst-over", "exclusion", "grain-extract", "grain-merge", "hard-light", "hue", "invert", "invert-rgb", "lighten", "minus", "multiply", "overlay", "plus", "saturation", "screen", "soft-light", "src", "src-atop", "src-in", "src-out", "src-over", "value", "xor"],


	},

	_content : {},

	carto : function () {
		return this.options.carto[this.type];
	},

	initialize : function (options) {

		// set options
		Wu.setOptions(this, options);

		// init container
		this._initContainer();
	},

	_initContainer : function () {

		// create 
		this.options.carto[this.type] = this.carto() || {};

		this._content[this.type] = {};

		// Get on/off state
		var isOn = this.carto().enabled;

		// Create wrapper
		this._wrapper = Wu.DomUtil.create('div', 'chrome-content-section-wrapper toggles-wrapper', this.options.container);

		// wrapper
		var line = new Wu.fieldLine({
			id           : this.type,
			appendTo     : this._wrapper,
			title        : '<b>' + this.type.camelize() + 's</b>',
			input        : false,
		});		

		// switch Update Style
		var button = new Wu.button({
			id 	     : this.type,
			type 	     : 'switch',
			isOn 	     : isOn,
			right 	     : true,
			appendTo     : line.container,
			fn 	     : this._switch.bind(this), // onSwitch
		});

		// toggle
		this._toggle(isOn);
	},

	_switch : function (e, on) {

		// toggle
		this._toggle(on);

		// update
		this.markChanged();
	},

	_toggle : function (on) {
		on ? this._enable() : this._disable();
	},

	_enable : function () {

		// set enabled
		this.carto().enabled = true;
		
		// create options
		this._createOptions();

		// select options
		this._preSelectOptions();

	},

	_disable : function () {
		this.carto().enabled = false;
		this._clearOptions();
	},

	markChanged : function () {
		this._changed = true;
		this.options.styler.markChanged();
	},

	updateStyle : function () {
		if (!this._changed) return;

		// create carto css
		this._createCarto(this.options.carto, this._saveCarto.bind(this));

		// marked not changed
		this._changed = false;
	},


	// create color box
	_createColor : function () {

		// create color field
		this.carto().color = this.carto().color || {};

		// get states
		var isOn         = (this.carto().color.column === false);
		var staticVal    = this.carto().color.staticVal || this.options.defaults.color;
		var val          = this.carto().color.value 	|| this.options.defaults.range;
		var column       = this.carto().color.column;
		var minMax       = this.carto().color.range;

		// container
		var line = new Wu.fieldLine({
			id           : 'color',
			appendTo     : this._wrapper,
			title        : '<b>Color</b>',
			input        : false,
			childWrapper : 'point-color-children' // todo: make class for polyugon?
		});	

		// dropdown
		var dropdown = new Wu.button({
			id 	 : 'color',
			type 	 : 'dropdown',
			isOn 	 : isOn,
			right 	 : true,
			appendTo : line.container,
			fn 	 : this._dropdownSelected.bind(this),
			array 	 : this.options.meta, // columns in dropdown
			selected : column, // preselected item
		});

		// color ball
		var ball = new Wu.button({
			id 	 : 'color',
			type 	 : 'colorball',
			right    : true,
			isOn 	 : isOn,
			appendTo : line.container,
			fn       : this._updateColor.bind(this),
			value    : staticVal,
			colors   : this.options.palettes,
			className: 'target-color-box'
		});

		// remember items
		this._content[this.type].color = {
			line : line,
			dropdown : dropdown,
			ball : ball
		}

		// save carto
		this.carto().color = {
			column 	     : column,
			range 	     : minMax,
			staticVal    : staticVal,
			value 	     : val
		};
	},

	// create opacity box
	_createOpacity : function () {

		// create opacity field
		this.carto().opacity = this.carto().opacity || {};

		// get states
		var isOn   = (this.carto().opacity.column === false);
		var value  = this.carto().opacity.staticVal;
		var column = this.carto().opacity.column;
		var minMax = this.carto().opacity.range;

		// Container
		var line = new Wu.fieldLine({
			id       : 'opacity',
			appendTo : this._wrapper,
			title    : '<b>Opacity</b>',
			input    : false,
			childWrapper : 'point-color-children' // todo: make class for polyugon?
		});	

		// Dropdown
		var dropdown = new Wu.button({
			id 	 : 'opacity',
			type 	 : 'dropdown',
			right 	 : true,
			appendTo : line.container,
			fn 	 : this._dropdownSelected.bind(this),
			array 	 : this.options.meta,
			selected : column,
		});

		// Input
		var input = new Wu.button({
			id 	    : 'opacity',
			type 	    : 'miniInput',
			right 	    : true,
			isOn        : isOn,
			appendTo    : line.container,
			value       : value,
			placeholder : 'auto',
			tabindex    : this.tabindex++,
			fn 	    : this._updateOpacity.bind(this), // blur event, not click
		});

		// remember items
		this._content[this.type].opacity = {
			line : line,
			dropdown : dropdown,
			input : input
		}

		// save carto
		this.carto().opacity = {
			column : column,
			range : minMax,
			staticVal : value
		};
	},

	_createBlendMode : function () {

		// Create JSON obj if it's not already there
		this.carto().blend = this.carto().blend || {};

		var blendmode = this.carto().blend.mode || 'screen';

		// container
		var line = new Wu.fieldLine({
			id           : 'blendmode',
			appendTo     : this._wrapper,
			title        : '<b>Blend mode</b>',
			input        : false,
			childWrapper : 'point-size-children'
		});

		// blend modes dropdown
		var dropdown = new Wu.button({
			id 	 : 'blendmode',
			type 	 : 'dropdown',
			right 	 : true,
			appendTo : line.container,
			fn 	 : this._blendmodeSelected.bind(this),
			array 	 : this.options.blendModes,
			selected : blendmode,
		});

		// remember items
		this._content[this.type].blendmode = {
			line : line,
			dropdown : dropdown,
		}

		// save carto
		this.carto().blend = {
			mode : blendmode
		};


	},

	_blendmodeSelected : function (e) {
		var dropdown = e.target;
		var blendmode = dropdown.options[dropdown.selectedIndex].value;

		// save
		this.carto().blend.mode = blendmode;

		// mark changed
		this.markChanged();
	},

	// point size box
	_createPointsize : function () {

		// Create JSON obj if it's not already there
		this.carto().pointsize = this.carto().pointsize || {};

		// Get stores states
		var isOn   = (this.carto().pointsize.column === false)
		var val    = this.carto().pointsize.staticVal || 1.2;
		var column = this.carto().pointsize.column;
		var minMax = this.carto().pointsize.range;

		// container
		var line = new Wu.fieldLine({
			id           : 'pointsize',
			appendTo     : this._wrapper,
			title        : '<b>Point size</b>',
			input        : false,
			childWrapper : 'point-size-children'
		});	

		// column dropdown
		var dropdown = new Wu.button({
			id 	 : 'pointsize',
			type 	 : 'dropdown',
			right 	 : true,
			appendTo : line.container,
			fn 	 : this._dropdownSelected.bind(this),
			array 	 : this.options.meta,
			selected : column,
		});

		// fixed value input
		var input = new Wu.button({
			id 	    : 'pointsize',
			type 	    : 'miniInput',
			right 	    : true,
			isOn        : isOn,
			appendTo    : line.container,
			value       : val,
			placeholder : 'auto',
			tabindex    : this.tabindex++,
			fn 	    : this._updatePointsize.bind(this),
		});

		// remember items
		this._content[this.type].pointsize = {
			line : line,
			dropdown : dropdown,
			input : input
		}

		// save carto
		this.carto().pointsize = {
			column 	    : column,
			range 	    : minMax,			
			staticVal : val
		};
	},

	// width box
	_createWidth : function () {

		// Create JSON obj if it's not already there
		this.carto().width = this.carto().width || {};

		// Get stores states
		var isOn   = (this.carto().width.column === false)
		var val    = this.carto().width.staticVal || 1.2;
		var column = this.carto().width.column;
		var minMax = this.carto().width.range;

		// container
		var line = new Wu.fieldLine({
			id           : 'width',
			appendTo     : this._wrapper,
			title        : '<b>Line width</b>',
			input        : false,
			childWrapper : 'line-width-children'
		});	

		// column dropdown
		var dropdown = new Wu.button({
			id 	 : 'width',
			type 	 : 'dropdown',
			right 	 : true,
			appendTo : line.container,
			fn 	 : this._dropdownSelected.bind(this),
			array 	 : this.options.meta,
			selected : column,
		});

		// fixed value input
		var input = new Wu.button({
			id 	    : 'width',
			type 	    : 'miniInput',
			right 	    : true,
			isOn        : isOn,
			appendTo    : line.container,
			value       : val,
			placeholder : 'auto',
			tabindex    : this.tabindex++,
			fn 	    : this._updateWidth.bind(this),
		});

		// remember items
		this._content[this.type].width = {
			line : line,
			dropdown : dropdown,
			input : input
		}

		// save carto
		this.carto().width = {
			column 	    : column,
			range 	    : minMax,			
			staticVal : val
		};
	},


	_addColorFields : function (column) {

		// get color value
		var value  = this.carto().color.value || this.options.defaults.range;

		// if not array, it's 'fixed' selection
		if (!_.isArray(value)) return; 

		// Get wrapper
		var childWrapper = this._content[this.type].color.line.childWrapper;

		// remove old
		childWrapper.innerHTML = '';

		// update min/max
		var fieldMaxRange = Math.floor(this.options.columns[column].max * 10) / 10;
		var fieldMinRange = Math.floor(this.options.columns[column].min * 10) / 10;

		// get div
		var range = this._content[this.type].color.range;
		var color_range = range ? range.line.container : false;

		// convert to five colors
		if (value.length < 5) values = this._convertToFiveColors(value);

		// Container
		var line = new Wu.fieldLine({
			id        : 'colorrange',
			appendTo  : childWrapper,
			title     : 'Color range',
			input     : false,
			className : 'sub-line'
		});

		// dropdown
		var dropdown = new Wu.button({
			id 	  : 'colorrange',
			type 	  : 'colorrange',
			right 	  : true,
			appendTo  : line.container,
			presetFn  : this.selectColorPreset.bind(this), // preset selection
			value     : value,
			colors   : this.options.palettes

		});

		// rememeber 
		this._content[this.type].color.range = {
			line : line,
			dropdown : dropdown
		}
	
		// save carto
		this.carto().color.column = column;
		this.carto().color.value = value;

		// get min/max
		var value = this.carto().color.range || [fieldMinRange, fieldMaxRange];

		// Use placeholder value if empty
		if (isNaN(value[0])) value[0] = fieldMinRange;
		if (isNaN(value[1])) value[1] = fieldMaxRange;

		// Container
		var line = new Wu.fieldLine({
			id        : 'minmaxcolorrange',
			appendTo  : childWrapper,
			title     : 'Range',
			input     : false,
			className : 'sub-line'
		});

		// Inputs
		var input = new Wu.button({
			id 	  : 'minmaxcolorrange',
			type 	  : 'dualinput',
			right 	  : true,
			appendTo  : line.container,
			value     : value,
			fn        : this.saveColorRangeDualBlur.bind(this),
			minmax    : [fieldMinRange, fieldMaxRange],
			tabindex  : [this.tabindex++, this.tabindex++]
		});

		// rememeber 
		this._content[this.type].color.minmax = {
			line : line,
			input : input
		}

		// save carto
		this.carto().color.range = value;

		// mark changed
		this.markChanged();
		
	},


	_addOpacityFields : function (column) {

		// get wrapper
		var childWrapper = this._content[this.type].opacity.line.childWrapper;

		// clear old
		childWrapper.innerHTML = '';

		// get default min/max
		var column_max = Math.floor(this.options.columns[column].max * 10) / 10;
		var column_min = Math.floor(this.options.columns[column].min * 10) / 10;

		// get stored min/max
		var value = this.carto().opacity.range || [column_min, column_max];

		// line
		var line = new Wu.fieldLine({
			id        : 'minmaxopacity',
			appendTo  : childWrapper,
			title     : 'Range',
			input     : false,
			className : 'sub-line'
		});

		// Inputs
		var input = new Wu.button({
			id 	  : 'minmaxopacity',
			type 	  : 'dualinput',
			right 	  : true,
			appendTo  : line.container,
			value     : value,
			fn        : this.saveOpacityDualBlur.bind(this),
			minmax    : value,
			tabindex  : [this.tabindex++, this.tabindex++]
		});

		// rememeber 
		this._content[this.type].opacity.minmax = {
			line : line,
			input : input
		}

		// save carto
		this.carto().opacity.column  = column;
		this.carto().opacity.range = value;

		// mark changed
		this.markChanged();
	},

	_addWidthFields : function (column) {

		// get wrapper
		var childWrapper = this._content[this.type].width.line.childWrapper;

		// clear old
		childWrapper.innerHTML = '';

		// get default min/max
		var column_max = Math.floor(this.options.columns[column].max * 10) / 10;
		var column_min = Math.floor(this.options.columns[column].min * 10) / 10;

		// get stored min/max
		var value = this.carto().width.range || [column_min, column_max];

		// line
		var line = new Wu.fieldLine({
			id        : 'minmaxwidth',
			appendTo  : childWrapper,
			title     : 'Range',
			input     : false,
			className : 'sub-line'
		});

		// Inputs
		var input = new Wu.button({
			id 	  : 'minmaxwidth',
			type 	  : 'dualinput',
			right 	  : true,
			appendTo  : line.container,
			value     : value,
			fn        : this.saveWidthDualBlur.bind(this),
			minmax    : value,
			tabindex  : [this.tabindex++, this.tabindex++]
		});

		// rememeber 
		this._content[this.type].width.minmax = {
			line : line,
			input : input
		}

		// save carto
		this.carto().width.column  = column;
		this.carto().width.range = value;

		// mark changed
		this.markChanged();
	},

	_updateColor : function (hex, key, wrapper) {

		// save carto
		this.carto().color.staticVal = hex;

		// Close
		this._closeColorRangeSelector(); 

		// mark changed
		this.markChanged();

		// send user event
		app.Socket.sendUserEvent({
		    	event : '`styled the ' + this.type + '-color` on',
		    	description : this.options.layer.getTitle() + ' (in project ' + this.options.project.getName() + ')',
		});
	},

	_updateWidth : function () {

		// Get field 
		var inputField = this._content[this.type].width.input.input;

		// save carto
		this.carto().width.staticVal = inputField.value;

		// mark changed
		this.markChanged();

		// send user event
		app.Socket.sendUserEvent({
		    	event : '`styled the ' + this.type + '-width` on',
		    	description : this.options.layer.getTitle() + ' (in project ' + this.options.project.getName() + ')',
		});	
	},

	_updateOpacity : function (e) {

		var value = parseFloat(e.target.value);
		
		// Get field 
		var inputField = this._content[this.type].opacity.input.input;

		// If more than one, make it one
		if ( value > 1  && value < 10  ) value = 1;
		if ( value > 10 && value < 100 ) value = value/100;
		if ( value > 100 ) 	         value = 1;
		
		// Set value in input
		inputField.value = value;

		// don't save if unchanged
		if (this.carto().opacity.staticVal == value) return;

		// save carto
		this.carto().opacity.staticVal = value;

		// mark changed
		this.markChanged();

		// send user event
		app.Socket.sendUserEvent({
		    	event : '`styled the ' + this.type + '-opacity` on',
		    	description : this.options.layer.getTitle() + ' (in project ' + this.options.project.getName() + ')',
		});
		
	},

	_updatePointsize : function (e) {

		var value = parseFloat(e.target.value);

		// Get field 
		var inputField = this._content[this.type].pointsize.input.input;

		// If less than 0.5, make it 0.5
		// if ( value < 0 ) value = 0;

		// Set value in input
		inputField.value = value;

		// don't save if no changes
		if (this.carto().pointsize.staticVal == value) return;

		// save carto
		this.carto().pointsize.staticVal = value;

		// mark changed
		this.markChanged();

		// send user event
		app.Socket.sendUserEvent({
		    	event : '`styled the ' + this.type + '-size` on',
		    	description : this.options.layer.getTitle() + ' (in project ' + this.options.project.getName() + ')',
		});

	},

	// on color preset color ball selection
	_updateRange : function (hex, key, wrapper) {

		var colorBall_1 = this._content[this.type].color.range.dropdown._colorball1;
		var colorBall_2 = this._content[this.type].color.range.dropdown._colorball2;
		var colorBall_3 = this._content[this.type].color.range.dropdown._colorball3;

		// Set HEX value on ball we've changed
		wrapper.setAttribute('hex', hex);

		// Get color values
		var color1 = colorBall_1.getAttribute('hex');
		var color2 = colorBall_2.getAttribute('hex');
		var color3 = colorBall_3.getAttribute('hex');

		// Build color array
		var colors = this._convertToFiveColors([color1, color2, color3]);

		// Color range bar
		var colorRangeBar = this._content[this.type].color.range.dropdown._color;

		// Set styling
		var gradientStyle = this._gradientStyle(colors);
		colorRangeBar.setAttribute('style', gradientStyle);

		// Do not save if value is unchanged
		if (this.carto().color.value == colors) return;

		// save carto
		this.carto().color.value = colors;

		// close popup
		this._closeColorRangeSelector(); 

		// mark changed
		this.markChanged();

		// send user event
		app.Socket.sendUserEvent({
		    	event : '`styled the ' + this.type + '-color range` on',
		    	description : this.options.layer.getTitle() + ' (in project ' + this.options.project.getName() + ')',
		});

	},

	saveColorRangeDualBlur : function (max, min, absoluteMax, absoluteMin) {

		// get values
		var minMax = [parseFloat(min || absoluteMin), parseFloat(max || absoluteMax)];

		// don't save if no changes
		if (_.isEqual(this.carto().color.range, minMax)) return;

		// save carto
		this.carto().color.range = minMax;

		// mark changed
		this.markChanged();
	},

	// on click on color range presets
	selectColorPreset : function (e) {

		var elem = e.target;
		var hex = elem.getAttribute('hex');
		var hexArray = hex.split(',');

		// Five colors
		var colorArray = this._convertToFiveColors(hexArray);

		// get divs
		var colorRangeBar = this._content[this.type].color.range.dropdown._color;
		var colorBall_1   = this._content[this.type].color.range.dropdown._colorball1;
		var colorBall_2   = this._content[this.type].color.range.dropdown._colorball2;
		var colorBall_3   = this._content[this.type].color.range.dropdown._colorball3;

		// Set styling		
		var gradientStyle = this._gradientStyle(colorArray);

		// Set style on colorrange bar
		colorRangeBar.setAttribute('style', gradientStyle);

		// update colors on balls
		colorBall_1.style.background = colorArray[0];
		colorBall_2.style.background = colorArray[2];
		colorBall_3.style.background = colorArray[4];
		colorBall_1.setAttribute('hex', colorArray[0]);
		colorBall_2.setAttribute('hex', colorArray[2]);
		colorBall_3.setAttribute('hex', colorArray[4]);

		// close
		this._closeColorRangeSelector();

		// dont' save if unchanged
		if (this.carto().color.value[0] == colorArray[0] &&
		    this.carto().color.value[1] == colorArray[1] && 
		    this.carto().color.value[2] == colorArray[2] &&
		    this.carto().color.value[3] == colorArray[3] &&
		    this.carto().color.value[4] == colorArray[4]) {

			return;
		}

		// save carto
		this.carto().color.value = colorArray;		

		// mark changed
		this.markChanged();

		// user event
		app.Socket.sendUserEvent({
		    	event : '`styled the ' + this.type + '-color range` on',
		    	description : this.options.layer.getTitle() + ' (in project ' + this.options.project.getName() + ')',
		});

	},

	_dropdownSelected : function (e) {


		var key = e.target.getAttribute('key'); // todo: remove DOM interaction
		var field = e.target.value;
		var wrapper = e.target.parentElement;

		// check if selected item is placeholders
		var isStatic = (field == this.options.dropdown.staticText);
		var isDivider = (field == this.options.dropdown.staticDivider);
		var unselect = (isStatic || isDivider);

		// check if field is selected
		unselect ? this._unselectField(key, wrapper) : this._selectField(key, wrapper, field);
	},

	_selectField : function (field, wrapper, column) {

		// add class
		Wu.DomUtil.addClass(wrapper, 'full-width');

		// if not same, clear old values
		if (this.carto()[field].column != column) {
			var staticVal = this.carto()[field].staticVal;
			this.carto()[field] = {};
			this.carto()[field].staticVal = staticVal;
		}

		// remove static inputs
		if (field == 'opacity') {
			var miniInput = this._content[this.type].opacity.input.input;
			Wu.DomUtil.addClass(miniInput, 'left-mini-kill');
		}

		// remove static inputs
		if (field == 'pointsize') {
			var miniInput = this._content[this.type].pointsize.input.input;
			Wu.DomUtil.addClass(miniInput, 'left-mini-kill');
		}

		// remove static inputs
		if (field == 'color') {
			var colorBall = this._content[this.type].color.ball.color;
			Wu.DomUtil.addClass(colorBall, 'disable-color-ball');
		}

		// save carto
		this.carto()[field].column = column; 

		// Add fields
		this._initSubfields(column, field); // sub meny

		// mark changed
		this.markChanged();

		// user event
		app.Socket.sendUserEvent({
		    	event : '`styled the ' + this.type + '-' + field + '` by column `' + column + '` on layer',
		    	description : this.options.layer.getTitle() + ' in project ' + this.options.project.getName(),
		});


	},

	_unselectField : function (key, wrapper) {

		// show static inputs
		if (key == 'opacity') {	
			var miniInput = this._content[this.type].opacity.input.input;
			Wu.DomUtil.removeClass(miniInput, 'left-mini-kill');
		}

		// show static inputs
		if (key == 'pointsize') {	
			var miniInput = this._content[this.type].pointsize.input.input;
			Wu.DomUtil.removeClass(miniInput, 'left-mini-kill');
		}

		// show static inputs
		if (key == 'color') {
			var colorBall = this._content[this.type].color.ball.color;
			Wu.DomUtil.removeClass(colorBall, 'disable-color-ball');
		}

		// show static inputs
		if (key == 'width') {
			var colorBall = this._content[this.type].width.input.input;
			Wu.DomUtil.removeClass(colorBall, 'left-mini-kill');
		}

		// remove extras
		this._removeSubfields(key);

		// adjust width
		Wu.DomUtil.removeClass(wrapper, 'full-width');

		// save style
		this.carto()[key].column = false;

		// mark changed
		this.markChanged();

	},

	_removeSubfields : function (key) {

		// remove div
		var field = this._content[this.type][key].minmax;
		var div = field ? field.line.container : false;
		div && Wu.DomUtil.remove(div);

		// extra
		if (key == 'color') {

			// range
			var range = this._content[this.type].color.range;
			var div = range ? range.line.container : false;
			div && Wu.DomUtil.remove(div);
		}		
	},

	_initSubfields : function(options, field) {

		// get column
		var column = this.options.carto[this.type][field].column;

		// get defaults
		var d = this.options.dropdown;

		// return if no column selected
		if (!column || column == d.staticText || column == d.staticDivider) return;
	
		// add fields
		this._addSubfields(column, field);
	},

	_addSubfields : function (column, field) {

		// add relevant fields
		if (field == 'color') this._addColorFields(column);
		if (field == 'pointsize') this._addPointSizeFields(column);
		if (field == 'opacity') this._addOpacityFields(column);
		if (field == 'width') this._addWidthFields(column);
	},


	_getDefaultRange : function (column, field) {

		// get default min/max
		var column_max = Math.floor(this.options.columns[column].max * 10) / 10;
		var column_min = Math.floor(this.options.columns[column].min * 10) / 10;

		// get stored min/max
		var value = this.carto()[field].range || [column_min, column_max];
		
		// Use placeholder value if empty
		if (isNaN(value[0])) value[0] = column_min;
		if (isNaN(value[1])) value[1] = column_max;

		return value;
	},


	savePointSizeDualBlur : function (max, min, absoluteMax, absoluteMin) {

		// set min/max
		var max = max || absoluteMax;
		var min = min || absoluteMin;	

		// don't save if no changes
		if (this.carto().pointsize.range == [min, max]) return;

		// save carto
		this.carto().pointsize.range = [min, max];

		// mark changed
		this.markChanged();

		// user event
		app.Socket.sendUserEvent({
		    	event : '`styled the ' + this.type + '-size` on',
		    	description : this.options.layer.getTitle() + ' (in project ' + this.options.project.getName() + ')',
		});
	},

	saveOpacityDualBlur : function (max, min, absoluteMax, absoluteMin) {

		// set min/max
		var min = parseFloat(min || absoluteMin);	
		var max = parseFloat(max || absoluteMax);

		// don't save if no changes
		if (this.carto().opacity.range == [min, max]) return;

		// save carto
		this.carto().opacity.range = [min, max];

		// mark changed
		this.markChanged();

		// user event
		app.Socket.sendUserEvent({
		    	event : '`styled the ' + this.type + '-opacity` on',
		    	description : this.options.layer.getTitle() + ' (in project ' + this.options.project.getName() + ')',
		});
	},

	saveWidthDualBlur : function (max, min, absoluteMax, absoluteMin) {

		// set min/max
		var min = parseFloat(min || absoluteMin);	
		var max = parseFloat(max || absoluteMax);

		// don't save if no changes
		if (this.carto().width.range == [min, max]) return;

		// save carto
		this.carto().width.range = [min, max];

		// mark changed
		this.markChanged();

		// user event
		app.Socket.sendUserEvent({
		    	event : '`styled the ' + this.type + '-width` on',
		    	description : this.options.layer.getTitle() + ' (in project ' + this.options.project.getName() + ')',
		});
	},

	_closeColorRangeSelector : function () {
		var range = this._content[this.type].color.range;
		if (!range) return;

		var rangeSelector = range.dropdown._colorSelectorWrapper;
		var clickCatcher = range.dropdown._clicker;
		if (rangeSelector) Wu.DomUtil.addClass(rangeSelector, 'displayNone');
		if (clickCatcher) Wu.DomUtil.addClass(clickCatcher, 'displayNone');		
	},	

	_createCarto : function (json, callback) {

		// fn lives on styler
		this.options.styler.createCarto(json, callback);
	},

	_saveCarto : function (ctx, carto) {

		var layer = this.options.layer;

		// set style on layer
		layer.setStyling(this.options.carto);

		// get sql
		var sql = layer.getSQL();

		// request new layer
		var layerOptions = {
			css : carto, 
			sql : sql,
			layer : layer
		}

		// update
		this._updateLayer(layerOptions);		
	},

	_updateLayer : function (options, done) {
		var css = options.css,
		    layer = options.layer,
		    file_id = layer.getFileUuid(),
		    sql = options.sql,
		    project = this.options.project,
		    layerOptions = layer.store.data.postgis;

		layerOptions.sql = sql;
		layerOptions.css = css;
		layerOptions.file_id = file_id;		

		var layerJSON = {
			geom_column: 'the_geom_3857',
			geom_type: 'geometry',
			raster_band: '',
			srid: '',
			affected_tables: '',
			interactivity: '',
			attributes: '',
			access_token: app.tokens.access_token,
			cartocss_version: '2.0.1',
			cartocss : css,
			sql: sql,
			file_id: file_id,
			return_model : true,
			layerUuid : layer.getUuid()
		}

		// create layer on server
		Wu.post('/api/db/createLayer', JSON.stringify(layerJSON), function (err, newLayerJSON) {

			// new layer
			var newLayerStyle = Wu.parse(newLayerJSON);

			// catch errors
			if (newLayerStyle.error) {
				done && done();
				return console.error(newLayerStyle.error);
			}

			// update layer
			layer.updateStyle(newLayerStyle);

			// return
			done && done();

		}.bind(this));

	},	

	_convertToFiveColors : function (colorArray) {

		// Make five values from two
		if ( colorArray.length == 2 ) {
			var c1 = colorArray[0];
			var c5 = colorArray[1];
			var c3 = this.hexAverage([c1, c5]);
			var c2 = this.hexAverage([c1, c3]);
			var c4 = this.hexAverage([c3, c5]);
			colorArray = [c1, c2, c3, c4, c5];
		}

		// Make five from three
		if ( colorArray.length == 3 ) {
			var c1 = colorArray[0];
			var c3 = colorArray[1];
			var c5 = colorArray[2];
			var c2 = this.hexAverage([c1, c3]);
			var c4 = this.hexAverage([c3, c5]);
			colorArray = [c1, c2, c3, c4, c5];
		}

		// hack: bug if four colors, make three
		if (colorArray.length == 4) colorArray.pop();

		return colorArray;
	},

	hexAverage : function (twoHexes) {
		return twoHexes.reduce(function (previousValue, currentValue) {
			return currentValue
			.replace(/^#/, '')
			.match(/.{2}/g)
			.map(function (value, index) {
				return previousValue[index] + parseInt(value, 16);
			});
		}, [0, 0, 0])
		.reduce(function (previousValue, currentValue) {
			var newValue = this.padToTwo(Math.floor(currentValue / twoHexes.length).toString(16));
			return previousValue + newValue;
		}.bind(this), '#');
	},

	padToTwo : function (n) {
		if (n.length < 2) n = '0' + n;
		return n;
	},

	_validateDateFormat : function (key) {

		// Default fields that for some reason gets read as time formats...
		if ( key == 'the_geom_3857' || key == 'the_geom_4326' || key == '_columns' ) return false;

		// If it's Frano's time series format
		var m = moment(key, ["YYYYMMDD", moment.ISO_8601]).format("YYYY-MM-DD");
		if ( m != 'Invalid date' ) return m;

		// If it's other time format
		var m = moment(key).format("YYYY-MM-DD");
		if ( m != 'Invalid date' ) return m;

		// If it's not a valid date...
		return false;
	},

	_gradientStyle : function (colorArray) {
		var gradientStyle = 'background: -webkit-linear-gradient(left, ' + colorArray.join() + ');';
		gradientStyle    += 'background: -o-linear-gradient(right, '     + colorArray.join() + ');';
		gradientStyle    += 'background: -moz-linear-gradient(right, '   + colorArray.join() + ');';
		gradientStyle    += 'background: linear-gradient(to right, '     + colorArray.join() + ');';
		return gradientStyle;
	},

	_targetColumnSelected : function (e) {

		// get target index
		var target = e.target;
		var targets = this._content[this.type].targets.selectors;
		var i = _.findIndex(targets, function (t) {
			return t.column._select == target;
		});

		// get value
		var column = target.value;

		// set carto
		this.carto().targets[i].column = column;

		// mark changed
		this.markChanged();
	},

	_targetColorSelected : function (color, id, e) {

		// get target index
		var target = e.target;
		var targets = this._content[this.type].targets.selectors;
		var i = _.findIndex(targets, function (t) {
			return t.color.color == e;
		});

		// set carto
		this.carto().targets[i].color = color;

		// mark changed
		this.markChanged();
	},

	_targetValueSelected : function (e) {

		// get target index
		var target = e.target;
		var targets = this._content[this.type].targets.selectors;
		var i = _.findIndex(targets, function (t) {
			return t.value == e.target;
		});

		// get opacity value
		var value = e.target.value;

		// set carto
		this.carto().targets[i].value = value;

		// mark changed
		this.markChanged();
	},

	_targetOpacitySelected : function (e) {

		// get target index
		var target = e.target;
		var targets = this._content[this.type].targets.selectors;
		var i = _.findIndex(targets, function (t) {
			return t.opacity == e.target;
		});

		// get opacity value
		var opacity_value = parseFloat(e.target.value);

		// set carto
		this.carto().targets[i].opacity = opacity_value;

		// mark changed
		this.markChanged();
	},

	_targetWidthSelected : function (e) {

		// get target index
		var target = e.target;
		var targets = this._content[this.type].targets.selectors;
		var i = _.findIndex(targets, function (t) {
			return t.width == e.target;
		});

		// get width value
		var width_value = parseFloat(e.target.value);

		// set carto
		this.carto().targets[i].width = width_value;

		// mark changed
		this.markChanged();
	},


	_removeTarget : function (e) {

		// get target index
		var target = e.target;
		var targets = this._content[this.type].targets.selectors;
		var i = _.findIndex(targets, function (t) {
			return t.wrapper == target.parentNode.parentNode || t.wrapper == target.parentNode;
		});

		// remove div
		var trg = targets[i];
		var wrapper = trg.wrapper;
		Wu.DomUtil.remove(wrapper);

		// remove from carto
		_.pullAt(this.carto().targets, i);

		// remove from div list
		_.pullAt(targets, i);

		// mark changed
		this.markChanged();

	},

	_changeAddButtonText : function () {
		// change title of button (hacky)
		var button = Wu.DomUtil.get('target-text-' + this.type);
		button.innerHTML = 'Add column';
	},

	_addTargetColumn : function (e) {

		var defaultColumn = this.options.meta[2]; // first column

		// set default options
		var options = {
			column : defaultColumn, // default column
			value : '', 		// targeted column value
			color : 'red', 		// default color
			opacity : 1, 		// default opacity
			width : 5,
			operator : '='
		}

		// set values
		this.carto().targets.push({
			column : options.column,
			value : options.value,
			color : options.color,
			opacity : options.opacity,
			width : options.width,
			operator : options.operator
		});

		// create column
		this._createTargetColumn(null, options);

		// mark change
		this.markChanged();

		// change button text
		this._changeAddButtonText();
	},


	// create column targets
	_createTargets : function () {

		// create target field
		this.carto().targets = this.carto().targets || [];

		// create wrapper
		var wrapper = Wu.DomUtil.create('div', 'add-target-wrapper', this._wrapper);

		// create (+) box
		var addTarget = Wu.DomUtil.create('div', 'add-target', wrapper);
		addTarget.innerHTML = '<i class="fa fa-plus-circle add-target-icon"></i>';
		addTarget.innerHTML += '<div id="target-text-' + this.type + '" class="add-target-text">Target specific columns</div>';

		// event
		Wu.DomEvent.on(addTarget, 'click', this._addTargetColumn, this);

		// remember items
		this._content[this.type].targets = {
			wrapper : wrapper,
			addTarget : addTarget,
		}

		// fill already existing targets
		var targets = this.carto().targets;
		if (targets.length) {

			// add existing targets
			targets.forEach(function (t) {
				this._createTargetColumn(null, t);
			}, this);

			// change button text
			this._changeAddButtonText();
		}

	},


	_createTargetColumn : function (e, options) {

		// get columns
		var columnObjects = this.options.columns;
		var columns = [];

		// get column names only
		for (var c in columnObjects) {
			columns.push(c);
		}

		// head wrapper
		var wrapper = this._content[this.type].targets.wrapper;

		// create target wrapper
		var target_wrapper = Wu.DomUtil.create('div', 'target-wrapper', wrapper);


		// (-) button
		var rembtn_wrapper = Wu.DomUtil.create('div', 'target-remove', target_wrapper);
		rembtn_wrapper.innerHTML = '<i class="fa fa-minus-circle"></i>';
		
		// event
		Wu.DomEvent.on(rembtn_wrapper, 'click', this._removeTarget, this);	

		
		// column dropdown
		var column_wrapper = Wu.DomUtil.create('div', 'target-column-wrapper', target_wrapper);
		var column_title = Wu.DomUtil.create('div', 'target-column-title', column_wrapper, 'Column');
		var column_dropdown = new Wu.button({
			id 	 : 'target',
			type 	 : 'dropdown',
			isOn 	 : true,
			right 	 : true,
			appendTo : column_wrapper,
			fn 	 : this._targetColumnSelected.bind(this),
			array 	 : columns, // columns in dropdown
			selected : options.column, // preselected item
			className : 'target-column-dropdown tiny'
		});


		// < = > input
		var operator_wrapper = Wu.DomUtil.create('div', 'target-column-wrapper', target_wrapper);
		var operator_dropdown = new Wu.button({
			id 	 : 'equals_selection',
			type 	 : 'clicker',
			appendTo : operator_wrapper,
			fn 	 : this._operatorSelected.bind(this),
			array 	 : ['<', '=', '>'], // columns in dropdown
			selected : options.operator, // preselected item
			className : 'target-equals-clicker'
		});



		
		// value input
		var input_wrapper = Wu.DomUtil.create('div', 'target-input-wrapper', target_wrapper);
		var input_title = Wu.DomUtil.create('div', 'target-input-title', input_wrapper, 'Value');
		var column_input = Wu.DomUtil.create('input', 'target-input', input_wrapper);
		column_input.value = options.value;

		// blur event
		Wu.DomEvent.on(column_input, 'blur', this._targetValueSelected, this);



		// color ball
		var color_wrapper = Wu.DomUtil.create('div', 'target-color-wrapper', target_wrapper);
		var input_title = Wu.DomUtil.create('div', 'target-input-title', color_wrapper, 'Color');
		var ball = new Wu.button({
			id 	 : 'target-color',
			type 	 : 'colorball',
			right    : true,
			isOn 	 : true,
			appendTo : color_wrapper,
			fn       : this._targetColorSelected.bind(this),
			value    : options.color,
			colors   : this.options.palettes,
			className : 'target-color-box'
		});



		// opacity input
		var opacity_wrapper = Wu.DomUtil.create('div', 'target-opacity-wrapper', target_wrapper);
		var opacity_title = Wu.DomUtil.create('div', 'target-input-title-opacity', opacity_wrapper, 'Opacity');
		var opacity_input = Wu.DomUtil.create('input', 'target-input opacity', opacity_wrapper);
		opacity_input.value = options.opacity;

		// blur event
		Wu.DomEvent.on(opacity_input, 'blur', this._targetOpacitySelected, this);


		// width input
		var width_wrapper = Wu.DomUtil.create('div', 'target-width-wrapper', target_wrapper);
		var width_title = Wu.DomUtil.create('div', 'target-input-title-width', width_wrapper, 'Width');
		var width_input = Wu.DomUtil.create('input', 'target-input width', width_wrapper);
		width_input.value = options.width;

		// blur event
		Wu.DomEvent.on(width_input, 'blur', this._targetWidthSelected, this);


		// remember
		this._content[this.type].targets.selectors = this._content[this.type].targets.selectors || [];
		this._content[this.type].targets.selectors.push({
			column : column_dropdown,
			value : column_input,
			color : ball,
			opacity : opacity_input,
			width : width_input,
			wrapper : target_wrapper,
			operator : operator_dropdown
		});


		// move (+) btn to bottom
		var button = this._content[this.type].targets.addTarget;
		var bwrapper = this._content[this.type].targets.wrapper;
		wrapper.appendChild(button);

	},


	_operatorSelected : function (e, value) {

		// get target index
		var target = e.target;
		var targets = this._content[this.type].targets.selectors;
		var i = _.findIndex(targets, function (t) {
			return t.operator._button == e.target;
		});

		// set carto
		this.carto().targets[i].operator = value;

		// mark changed
		this.markChanged();
	},


});
Wu.Styler.Polygon = Wu.Styler.extend({

	type : 'polygon',

	// creates content of point container
	_createOptions : function () {

		// color
		this._createColor();

		// opacity
		this._createOpacity();

		// blend 
		// this._createBlendMode();

		// targeted columns
		this._createTargets();

	},
	
	_preSelectOptions : function () {

		// open relevant subfields
		this._initSubfields(this.carto().color.column, 'color');
		this._initSubfields(this.carto().opacity.column, 'opacity');
	},

	_clearOptions : function () {

		// get content
		var content = this._content[this.type];

		// return if not content yet
		if (_.isEmpty(content)) return;

		// get divs
		var color_wrapper = content.color.line.container;
		var color_children = content.color.line.childWrapper;
		var opacity_wrapper = content.opacity.line.container;
		var opacity_children = content.opacity.line.childWrapper;
		var targets 		= content.targets.wrapper;

		// remove divs
		color_wrapper && Wu.DomUtil.remove(color_wrapper);
		color_children && Wu.DomUtil.remove(color_children);
		opacity_wrapper && Wu.DomUtil.remove(opacity_wrapper);
		opacity_children && Wu.DomUtil.remove(opacity_children);
		targets && 		Wu.DomUtil.remove(targets);
	},




	_createTargetColumn : function (e, options) {

		// get columns
		var columnObjects = this.options.columns;
		var columns = [];

		// get column names only
		for (var c in columnObjects) {
			columns.push(c);
		}

		// head wrapper
		var wrapper = this._content[this.type].targets.wrapper;

		// create target wrapper
		var target_wrapper = Wu.DomUtil.create('div', 'target-wrapper', wrapper);


		// (-) button
		var rembtn_wrapper = Wu.DomUtil.create('div', 'target-remove', target_wrapper);
		rembtn_wrapper.innerHTML = '<i class="fa fa-minus-circle"></i>';
		
		// event
		Wu.DomEvent.on(rembtn_wrapper, 'click', this._removeTarget, this);	

		
		// column dropdown
		var column_wrapper = Wu.DomUtil.create('div', 'target-column-wrapper', target_wrapper);
		var column_title = Wu.DomUtil.create('div', 'target-column-title', column_wrapper, 'Column');
		var column_dropdown = new Wu.button({
			id 	 : 'target',
			type 	 : 'dropdown',
			isOn 	 : true,
			right 	 : true,
			appendTo : column_wrapper,
			fn 	 : this._targetColumnSelected.bind(this),
			array 	 : columns, // columns in dropdown
			selected : options.column, // preselected item
			className : 'target-column-dropdown tiny polygon'
		});


		// < = > input
		var operator_wrapper = Wu.DomUtil.create('div', 'target-column-wrapper', target_wrapper);
		var operator_dropdown = new Wu.button({
			id 	 : 'equals_selection',
			type 	 : 'clicker',
			appendTo : operator_wrapper,
			fn 	 : this._operatorSelected.bind(this),
			array 	 : ['<', '=', '>'], // columns in dropdown
			selected : options.operator, // preselected item
			className : 'target-equals-clicker'
		});

		
		// value input
		var input_wrapper = Wu.DomUtil.create('div', 'target-input-wrapper', target_wrapper);
		var input_title = Wu.DomUtil.create('div', 'target-input-title', input_wrapper, 'Value');
		var column_input = Wu.DomUtil.create('input', 'target-input polygon', input_wrapper);
		column_input.value = options.value;

		// blur event
		Wu.DomEvent.on(column_input, 'blur', this._targetValueSelected, this);



		// color ball
		var color_wrapper = Wu.DomUtil.create('div', 'target-color-wrapper', target_wrapper);
		var input_title = Wu.DomUtil.create('div', 'target-input-title', color_wrapper, 'Color');
		var ball = new Wu.button({
			id 	 : 'target-color',
			type 	 : 'colorball',
			right    : true,
			isOn 	 : true,
			appendTo : color_wrapper,
			fn       : this._targetColorSelected.bind(this),
			value    : options.color,
			colors   : this.options.palettes,
			className : 'target-color-box'
		});



		// opacity input
		var opacity_wrapper = Wu.DomUtil.create('div', 'target-opacity-wrapper', target_wrapper);
		var opacity_title = Wu.DomUtil.create('div', 'target-input-title-opacity', opacity_wrapper, 'Opacity');
		var opacity_input = Wu.DomUtil.create('input', 'target-input opacity', opacity_wrapper);
		opacity_input.value = options.opacity;

		// blur event
		Wu.DomEvent.on(opacity_input, 'blur', this._targetOpacitySelected, this);



		// remember
		this._content[this.type].targets.selectors = this._content[this.type].targets.selectors || [];
		this._content[this.type].targets.selectors.push({
			column : column_dropdown,
			value : column_input,
			color : ball,
			opacity : opacity_input,
			wrapper : target_wrapper,
			operator : operator_dropdown
		});


		// move (+) btn to bottom
		var button = this._content[this.type].targets.addTarget;
		var bwrapper = this._content[this.type].targets.wrapper;
		wrapper.appendChild(button);

	},





});
Wu.Styler.Point = Wu.Styler.extend({

	type : 'point',

	// creates content of point container
	_createOptions : function () {

		// color
		this._createColor();

		// opacity
		this._createOpacity();

		// pointsize
		this._createPointsize();

		// blend mode
		this._createBlendMode();

		// targets
		this._createTargets();

	},

	_preSelectOptions : function () {

		// open relevant subfields
		this._initSubfields(this.carto().color.column, 'color');
		this._initSubfields(this.carto().opacity.column, 'opacity');
		this._initSubfields(this.carto().pointsize.column, 'pointsize');
	},

	_clearOptions : function () {

		var content = this._content[this.type];

		// return if not content yet
		if (_.isEmpty(content)) return;

		// get divs
		var color_wrapper = content.color.line.container;
		var color_children = content.color.line.childWrapper;
		var opacity_wrapper = content.opacity.line.container;
		var opacity_children = content.opacity.line.childWrapper;
		var pointsize_wrapper = content.pointsize.line.container;
		var pointsize_children = content.pointsize.line.childWrapper;
		var targets 		= content.targets.wrapper;
		

		// remove divs
		color_wrapper && Wu.DomUtil.remove(color_wrapper);
		color_children && Wu.DomUtil.remove(color_children);
		opacity_wrapper && Wu.DomUtil.remove(opacity_wrapper);
		opacity_children && Wu.DomUtil.remove(opacity_children);
		pointsize_wrapper && Wu.DomUtil.remove(pointsize_wrapper);
		pointsize_children && Wu.DomUtil.remove(pointsize_children);
		targets && 		Wu.DomUtil.remove(targets);
	},

	_addPointSizeFields : function (column) {

		// get wrapper
		var childWrapper = this._content[this.type].pointsize.line.childWrapper;

		// clear old
		childWrapper.innerHTML = '';

		// get min/max values
		var minMax  = this.carto().pointsize.range || [1,10];

		// line
		var line = new Wu.fieldLine({
			id        : 'minmaxpointsize',
			appendTo  : childWrapper,
			title     : 'Min/max size',
			input     : false,
			className : 'sub-line'
		});

		// Inputs
		var input = new Wu.button({
			id 	  : 'minmaxpointsize',
			type 	  : 'dualinput',
			right 	  : true,
			appendTo  : line.container,
			value     : minMax,
			fn        : this.savePointSizeDualBlur.bind(this),
			minmax    : minMax,
			tabindex  : [this.tabindex++, this.tabindex++]
		});



		// rememeber 
		this._content[this.type].pointsize.minmax = {
			line : line,
			input : input
		}

		// save carto
		this.carto().pointsize.column  = column;
		this.carto().pointsize.range = minMax;

		this.markChanged();

	},




});
Wu.Styler.Line = Wu.Styler.extend({

	type : 'line',


	// creates content of point container
	_createOptions : function () {

		// color
		this._createColor();

		// opacity
		this._createOpacity();

		// pointsize
		this._createWidth();

		// blend
		// this._createBlendMode();

		// targets
		this._createTargets();
	},

	_preSelectOptions : function () {

		// open relevant subfields
		this._initSubfields(this.carto().color.column, 'color');
		this._initSubfields(this.carto().opacity.column, 'opacity');
		this._initSubfields(this.carto().width.column, 'width');
	},

	_clearOptions : function () {

		var content = this._content[this.type];

		// return if not content yet
		if (_.isEmpty(content)) return;

		// get divs
		var color_wrapper 	= content.color.line.container;
		var color_children 	= content.color.line.childWrapper;
		var opacity_wrapper 	= content.opacity.line.container;
		var opacity_children 	= content.opacity.line.childWrapper;
		var width_wrapper 	= content.width.line.container;
		var width_children 	= content.width.line.childWrapper;
		var targets 		= content.targets.wrapper;

		// remove divs
		color_wrapper && 	Wu.DomUtil.remove(color_wrapper);
		color_children && 	Wu.DomUtil.remove(color_children);
		opacity_wrapper && 	Wu.DomUtil.remove(opacity_wrapper);
		opacity_children && 	Wu.DomUtil.remove(opacity_children);
		width_wrapper && 	Wu.DomUtil.remove(width_wrapper);
		width_children && 	Wu.DomUtil.remove(width_children);
		targets && 		Wu.DomUtil.remove(targets);

		// clear targets
	},



});
Wu.Chrome.SettingsContent.Layers = Wu.Chrome.SettingsContent.extend({


	// INITS
	// INITS
	// INITS		

	_initialize : function () {

		// init container
		this._initContainer();

		// add events
		this._addEvents();
	},

	_initContainer : function () {

		// create container
		this._container = Wu.DomUtil.create('div', 'chrome chrome-content chrome-pane layers', this.options.appendTo);
	},

	_initLayout : function () {

		if (!this._project) return;

		this._topButtonWrapper = Wu.DomUtil.create('div', 'chrome-layers-top-button-wrapper', this._container);

		// Scroller
		this._midSection = Wu.DomUtil.create('div', 'chrome-middle-section', this._container);
		this._midOuterScroller = Wu.DomUtil.create('div', 'chrome-middle-section-outer-scroller', this._midSection);
		this._midInnerScroller = Wu.DomUtil.create('div', 'chrome-middle-section-inner-scroller', this._midOuterScroller);

		// Inner wrapper
		this._fieldsWrapper = Wu.DomUtil.create('div', 'chrome-field-wrapper', this._midInnerScroller);

		// Init layer/baselayer toggle
		this.initLayerBaselayerToggle();

		// Init Layers
		this.initLayers();

		// mark as inited
		this._inited = true;

		// This fires too late...
		this._mode = 'layer';

	},


	// OTHER UNIVERSALS
	// OTHER UNIVERSALS
	// OTHER UNIVERSALS		

	_refresh : function () {

		this._flush();
		this._initLayout();
	},

	_flush : function () {
		this._container.innerHTML = '';
	},
	
	show : function () {

		if (!this._inited) this._initLayout();

		// hide others
		this.hideAll();

		// show this
		this._container.style.display = 'block';

		// mark button
		Wu.DomUtil.addClass(this.options.trigger, 'active-tab');

		// enable edit of layer menu...
		var layerMenu = app.MapPane.getControls().layermenu;
		if (this._project.isEditable()) layerMenu.enableEdit();

	},

	open : function () {
	},



	// TOP BUTTONS (BASE LAYERS / LAYERS)
	// TOP BUTTONS (BASE LAYERS / LAYERS)
	// TOP BUTTONS (BASE LAYERS / LAYERS)		


	initLayerBaselayerToggle : function () {
		var wrapper = Wu.DomUtil.create('div',   'chrome-layer-baselayer-toggle', this._topButtonWrapper);
		this.baselayerButton = Wu.DomUtil.create('div', 'chrome-layer-toggle-button chrome-baselayer', wrapper, 'BASE LAYERS');
		this.layerButton = Wu.DomUtil.create('div',     'chrome-layer-toggle-button chrome-layer layer-toggle-active', wrapper, 'LAYERS');

		Wu.DomEvent.on(this.layerButton,     'click', this.toggleToLayers, this);
		Wu.DomEvent.on(this.baselayerButton, 'click', this.toggleToBaseLayers, this);
	},

	toggleToBaseLayers : function () {
		Wu.DomUtil.addClass(this.baselayerButton, 'layer-toggle-active')
		Wu.DomUtil.removeClass(this.layerButton, 'layer-toggle-active')

		Wu.DomUtil.addClass(this._fieldsWrapper, 'editing-baselayers')

		this._mode = 'baselayer';
		this.update();		
	},

	toggleToLayers : function () {
		Wu.DomUtil.removeClass(this.baselayerButton, 'layer-toggle-active')
		Wu.DomUtil.addClass(this.layerButton, 'layer-toggle-active')

		Wu.DomUtil.removeClass(this._fieldsWrapper, 'editing-baselayers')

		this._mode = 'layer';
		this.update();
	},



	// ROLL OUT LAYERS
	// ROLL OUT LAYERS
	// ROLL OUT LAYERS	

	initLayers : function () {

		this._layers = {};

		// return if no layers
	       	if (_.isEmpty(this._project.layers)) return;

	       	this.sortedLayers = this.sortLayers(this._project.layers);

	       	this.sortedLayers.forEach(function (provider) {

	       		var providerTitle = this.providerTitle(provider.key);

	       		var sectionWrapper = Wu.DomUtil.create('div', 'chrome-content-section-wrapper', this._fieldsWrapper)
			var header = Wu.DomUtil.create('div', 'chrome-content-header', sectionWrapper, providerTitle);

	       		provider.layers.forEach(function (layer) {

	       			this.addLayer(layer, sectionWrapper);

	       		}, this);

	       	}, this);

	       	this.update();
	},

	addLayer : function (layer, wrapper) {

		// Get title 
		var layerTitle = layer.getTitle();
		var uuid       = layer.store.uuid;
		var on 	       = false;
		
		// set active or not
		this._project.store.baseLayers.forEach(function (b) {
			if ( uuid == b.uuid ) { 
				on = true; 
				return; 
			} 
		}.bind(this));

		// get saved state of enabled-by-default
		layermenuItem = _.find(this._project.store.layermenu, function (l) {
			return l.layer == uuid;
		});
		var enabledByDefault = layermenuItem && layermenuItem.enabled;

		var line = new Wu.fieldLine({
			id       : uuid,
			appendTo : wrapper,
			title    : layerTitle,
			input    : false
		});		

		var _switch = new Wu.button({ 
			id 	 : uuid,
			type 	 : 'switch',
			isOn 	 : on,
			right 	 : false,
			appendTo : line.container,
			fn 	 : this._saveSwitch.bind(this),
		});


		var _radio = new Wu.button({ 
			id 	 : uuid,
			type 	 : 'radio',
			isOn 	 : enabledByDefault,
			right 	 : true,
			appendTo : line.container,
			fn 	 : this._saveRadio.bind(this),
		});		

	},


	providerTitle : function (provider) {

		if (provider == 'postgis') var title = 'Data Library';
		if (provider == 'raster')  var title = 'Raster Overlays';
		if (provider == 'mapbox')  var title = 'Mapbox';
		if (provider == 'norkart') var title = 'Norkart';
		if (provider == 'google')  var title = 'Google';
		if (provider == 'osm')     return false;

		// Return title
		return title;
	},

	// sort layers by provider
	sortLayers : function (layers) {

		var keys = ['postgis', 'raster', 'google', 'norkart', 'geojson', 'mapbox'];
		var results = [];
	
		keys.forEach(function (key) {
			var sort = {
				key : key,
				layers : []
			}
			for (var l in layers) {
				var layer = layers[l];
				if (layer) {
					if (layer.store && layer.store.data.hasOwnProperty(key)) {
						sort.layers.push(layer)
					}
				}
			}
			results.push(sort);
		}, this);

		this.numberOfProviders = results.length;
		return results;
	},


	// UPDATE		
	update : function () {

		if ( !this._mode ) this._mode = 'layer';
		if ( this._mode == 'baselayer' ) this.markBaseLayerOccupied();
		if ( this._mode == 'layer' )     this.markLayerOccupied();
		
		this.updateSwitches();
		this.updateRadios();
	},


	// MARK BASE LAYERS AS OCCUPIED
	markBaseLayerOccupied : function () {

		// get layers and active baselayers
		var layermenuLayers = this._project.getLayermenuLayers();
		var layers = this._project.getLayers();

		// activate layers
		layers.forEach(function (a) {
			if (a.store) this.activateLayer(a.store.uuid);
		}, this);

		layermenuLayers.forEach(function (bl) {
			var layer = _.find(layers, function (l) { 
				if (!l.store) return false;
				return l.store.uuid == bl.layer; 
			});
			if (layer) this.deactivateLayer(layer.store.uuid);
		}, this);
	},

	// MARK LAYERS AS OCCUPIED
	markLayerOccupied : function () {

		var project = this._project;

		// get active baselayers
		var baseLayers = project.getBaselayers();
		var all = project.getLayers();

		all.forEach(function (a) {
			this.activateLayer(a.store.uuid);
		}, this);

		baseLayers.forEach(function (bl) {
			this.deactivateLayer(bl.uuid);
		}, this);

	},

	// SET LAYER AS NOT OCCUPIED
	activateLayer : function (layerUuid) {
		var id = 'field_wrapper_' + layerUuid;
		var elem = Wu.DomUtil.get(id);
		Wu.DomUtil.removeClass(elem, 'deactivated-layer');
	},

	// SET LAYER AS OCCUPIED
	deactivateLayer : function (layerUuid) {
		var id = 'field_wrapper_' + layerUuid;
		var elem = Wu.DomUtil.get(id);
		Wu.DomUtil.addClass(elem, 'deactivated-layer');
	},


	_saveRadio : function (e) {

		var elem = e.target;
		var state = elem.getAttribute('state');

		state == 'true' ? this.radioOn(elem) : this.radioOff(elem);		

	},

	radioOn : function (elem) {

		var id = elem.id;
		var layer_id = id.slice(6, id.length);		

		// save state
		var layerMenu = app.MapPane.getControls().layermenu;
		layerMenu._setEnabledOnInit(layer_id, true);

	},

	radioOff : function (elem) {

		var id = elem.id;
		var layer_id = id.slice(6, id.length);

		// save state
		var layerMenu = app.MapPane.getControls().layermenu;
		layerMenu._setEnabledOnInit(layer_id, false);
		
	},



	// UPDATE RADIOS
	// UPDATE RADIOS
	// UPDATE RADIOS	


	updateRadios : function () {

	       	this.sortedLayers.forEach(function (provider) {
	       		provider.layers.forEach(function (layer) {
	       			this.updateRadio(layer);
	       		}, this);
	       	}, this);		
	},


	updateRadio : function (layer) {

		// Get title 
		var layerTitle = layer.getTitle();
		var uuid       = layer.store.uuid;
		var layerActive = false;
		

		// Only show radio if layer is active...
		if (this._mode == 'layer') {
			this._project.store.layermenu.forEach(function (b) {
				if ( uuid == b.layer ) { layerActive = true; return; }
			}, this);
		}

		// Get switch
		var s = Wu.DomUtil.get('radio_' + uuid);

		if (layerActive) {
			Wu.DomUtil.removeClass(s, 'displayNone');
		} else {
			Wu.DomUtil.addClass(s, 'displayNone');		
		}
	},	


	// UPDATE SWITCHES
	// UPDATE SWITCHES
	// UPDATE SWITCHES

	updateSwitches : function () {

	       	this.sortedLayers.forEach(function (provider) {
	       		provider.layers.forEach(function (layer) {
	       			this.updateSwitch(layer);
	       		}, this);
	       	}, this);		
	},

	updateSwitch : function (layer) {

		// Get title 
		var layerTitle = layer.getTitle();
		var uuid       = layer.store.uuid;
		var on 	       = false;
		

		if ( this._mode == 'baselayer' ) {
			// Set active or not
			this._project.store.baseLayers.forEach(function (b) {
				if ( uuid == b.uuid ) { on = true; return; } 
			}.bind(this));
		}

		if ( this._mode == 'layer' ) {
			// set active or not
			this._project.store.layermenu.forEach(function (b) {
				if ( uuid == b.layer ) { on = true; return; }
			}, this);
		}

		// Get switch
		var s = Wu.DomUtil.get('switch_' + uuid);

		// xoxoxoxox
		if ( on ) {
			Wu.DomUtil.addClass(s, 'switch-on');
			s.setAttribute('state', 'true');
		} else {
			Wu.DomUtil.removeClass(s, 'switch-on');
			s.setAttribute('state', 'false');			
		}
	},	

	

	// SAVE
	// SAVE
	// SAVE		

	_saveSwitch : function (e, isOn) {

		var stateAttrib = e.target.getAttribute('state'),
		    on          = (stateAttrib == 'true'),
		    key         = e.target.getAttribute('key');

		if ( this._mode == 'baselayer' ) {
			on ? this.enableBaseLayer(key) : this.disableBaseLayer(key);
		} else {
			on ? this.enableLayer(key) : this.disableLayer(key);
		}

		this.updateRadios();
	},


	// ENABLE BASE LAYER (AND SAVE)

	enableBaseLayer : function (uuid) {

		var layer = this._project.layers[uuid];

		// Update map	
		if (layer) layer._addTo('baselayer');

		// Save to server
		this._project.addBaseLayer({
			uuid : uuid,
			zIndex : 1,
			opacity : layer.getOpacity()
		});

		this.update();
	},

	// DISABLE BASE LAYER (AND SAVE)

	disableBaseLayer : function (uuid) {		

		var layer = this._project.layers[uuid];

		// Update map
		if (layer) layer.disable(); 

		// Save to server
		this._project.removeBaseLayer(layer);

		this.update();	
	},



	// ENABLE LAYER (AND SAVE)
	enableLayer : function (uuid) {

		var layer = this._project.layers[uuid];

		var layerMenu = app.MapPane.getControls().layermenu;
		layerMenu.add(layer);
	},

	// DISABLE LAYER (AND SAVE)
	disableLayer : function (uuid) {

		var layer = this._project.layers[uuid];
		var _uuid = layer.store.uuid;

		var layerMenu = app.MapPane.getControls().layermenu;
		layerMenu._remove(_uuid);

	},	
});

Wu.Chrome.SettingsContent.Extras = Wu.Chrome.SettingsContent.extend({

	_ : 'extras',

	options : {
		dropdown : {
			staticText : 'None',
			staticDivider : '-'
		},

	},

	_initialize : function () {

		// init container
		this._initContainer();

		// add events
		this._addEvents();

	},

	_initContainer : function () {

		// Create Container
		this._container = Wu.DomUtil.create('div', 'chrome chrome-content chrome-pane extras', this.options.appendTo);

	},

	_initLayout : function () {

		this._layers = this._project.getDataLayers();

		this._midSection = Wu.DomUtil.create('div', 'chrome-middle-section', this._container);
		this._midOuterScroller = Wu.DomUtil.create('div', 'chrome-middle-section-outer-scroller', this._midSection);	
		this._midInnerScroller = Wu.DomUtil.create('div', 'chrome-middle-section-inner-scroller', this._midOuterScroller);	

		this._initLayout_activeLayers('Layer', 'Select layer', this._midInnerScroller, this._layers);		

		// Create Field Wrapper
		this._fieldsWrapper = Wu.DomUtil.create('div', 'chrome-field-wrapper', this._midInnerScroller);
		

	},

	_selectedActiveLayer : function (e, uuid) {

		this.layerUuid = uuid ? uuid : e.target.value

		this._layer = this._project.getLayer(this.layerUuid);

		if (!this._layer) return;

		// Store uuid of layer we're working with
		this._storeActiveLayerUuid(this.layerUuid);		

		// get current style, returns default if none
		var style = this._layer.getStyling();

		this.tabindex = 1;

		this.cartoJSON = style || {};

		


		this.getLayerMeta();

		// Add temp layer
		this._tempaddLayer();


		// Clear
		this._fieldsWrapper.innerHTML = '';

	
		// Globesar Extras
		this.initGlobesarExtras();




	},




	// Get all metafields
	// Get all metafields
	// Get all metafields	

	getLayerMeta : function () {

		// Get layer
		var layer = this._layer = this._project.getLayer(this.layerUuid);

		// Get styling json
		this.cartoJSON = layer.getStyling();

		// Get stored tooltip meta
		var tooltipMeta = layer.getTooltip();
		
		// Get layermeta
		var layerMeta = layer.getMeta();

		// Get columns
		this.columns = layerMeta.columns;

		this.metaFields = [this.options.dropdown.staticText, this.options.dropdown.staticDivider];

		for ( var k in this.columns ) {

			var isDate = this._validateDateFormat(k);

			if ( !isDate ) {
				this.metaFields.push(k);
			}
		}
	},



	// GLOBSAR EXTRAS
	// GLOBSAR EXTRAS
	// GLOBSAR EXTRAS

	initGlobesarExtras : function () {

		if ( !this.cartoJSON.extras || !this.cartoJSON.extras.referencepoint ) {

			this.cartoJSON.extras = {
				referencepoint : {
					column : false,
					value  : false
				}
			}

		}		


		var wrapper = Wu.DomUtil.create('div', 'chrome-content-section-wrapper', this._fieldsWrapper);
		var header = Wu.DomUtil.create('div', 'chrome-content-header globesar-extras', wrapper, 'Globesar Extras');

		this.layer = this._project.getLayer(this.layerUuid);

		var satpos = Wu.parse(this.layer.getSatellitePosition());

		var path = satpos.path ? satpos.path : false;
		var angle = satpos.angle ? satpos.angle : false;


		// ANGLE
		// ANGLE
		// ANGLE

		var angleLine = new Wu.fieldLine({
			id       : 'satelliteAngle',
			appendTo : wrapper,
			title    : 'Satellite angle',
			input    : false,		
		})

		var angleMiniInput = new Wu.button({
			id 	    : 'satelliteAngle',
			type 	    : 'miniInput',
			right 	    : true,
			isOn        : true,
			appendTo    : angleLine.container,
			value       : angle,
			placeholder : 'none',
			className   : 'globesar-extras-input',
			tabindex    : 1,
			fn 	    : this._saveMiniBlur.bind(this),
		})


		// PATH
		// PATH
		// PATH

		var pathLine = new Wu.fieldLine({
			id       : 'satellitePath',
			appendTo : wrapper,
			title    : 'Satellite path',
			input    : false,	
		})

		var pathMiniInput = new Wu.button({
			id 	    : 'satellitePath',
			type 	    : 'miniInput',
			right 	    : true,
			isOn        : true,
			appendTo    : pathLine.container,
			value       : path,
			placeholder : 'none',
			className   : 'globesar-extras-input',
			tabindex    : 2,
			fn 	    : this._saveMiniBlur.bind(this),		
		})


		// Reference point
		// Reference point
		// Reference point

		var referenceLine = new Wu.fieldLine({
			id       : 'referencepoint',
			appendTo : wrapper,
			title    : 'Reference point',
			input    : false,	
		})


		var range = this.cartoJSON.extras.referencepoint.column;
		var val   = this.cartoJSON.extras.referencepoint.value;
		var isOn  = range ? false : true;

		// Dropdown
		var referenceDropDown = new Wu.button({
			id 	  : 'referencepoint',
			type 	  : 'dropdown',
			right 	  : true,
			appendTo  : referenceLine.container,
			fn 	  : this._selectedMiniDropDown.bind(this),
			array 	  : this.metaFields,
			selected  : range,
			reversed  : true,
			className : 'globesar-extras-ref-point-dropdown'
		});


		// Input
		var _referencePointInput = new Wu.button({
			id 	    : 'referencepoint',
			type 	    : 'miniInput',
			right 	    : true,
			isOn        : !isOn,
			appendTo    : referenceLine.container,
			value       : val,
			placeholder : 'value',
			tabindex    : 3,
			className   : 'globesar-extras-input',
			allowText   : true,
			fn 	    : this._blurRefPointValue.bind(this),
		});		

	},



	// ON SELECT MINI DROP DOWN
	_selectedMiniDropDown : function (e) {

		var key = e.target.getAttribute('key');
		var fieldName = e.target.value;

		var wrapper = e.target.parentElement;

		var _miniInput = Wu.DomUtil.get('field_mini_input_referencepoint');		

		// UNSELECTING FIELD
		// UNSELECTING FIELD
		// UNSELECTING FIELD

		// Clean up if we UNSELECTED field
		if ( fieldName == this.options.dropdown.staticText || fieldName == this.options.dropdown.staticDivider) {

			this.selectedColumn = false;
			this.cartoJSON.extras = {
				referencepoint : false
			}


			Wu.DomUtil.addClass(_miniInput, 'left-mini-kill');
			Wu.DomUtil.addClass(wrapper, 'full-width');

			return;
		}


		this.selectedColumn = fieldName;
		this._saveRefPointValue();		

		// SELECTING FIELD
		// SELECTING FIELD
		// SELECTING FIELD

		Wu.DomUtil.removeClass(_miniInput, 'left-mini-kill');
		Wu.DomUtil.removeClass(wrapper, 'full-width');

	},



	_blurRefPointValue : function (e) {

		this.selectedValue = e.target.value;
		this._saveRefPointValue();

	},

	_saveRefPointValue : function () {

		var value  = this.selectedValue;
		var column = this.selectedColumn;

		// If no value
		if ( !value || value == '' || column == this.options.staticText || column == this.options.staticDivider ) {
			this.cartoJSON.extras = {
				referencepoint : false,
			}

		// Store value
		} else {
			this.cartoJSON.extras = {
				referencepoint : {
					column : column,
					value  : value
				}
			}
		}

		this._updateStyle();

	},

	// ON BLUR IN MINI FIELDS
	_saveMiniBlur : function (e) {

		var angle = Wu.DomUtil.get('field_mini_input_satelliteAngle').value;
		var path  = Wu.DomUtil.get('field_mini_input_satellitePath').value;
		this.layer = this._project.getLayer(this.layerUuid);

		// Save object
		this.satpos = {}
		if ( path ) this.satpos.path = path;
		if ( angle ) this.satpos.angle = angle;

		var satpos = this.satpos;

		this.layer.setSatellitePosition(JSON.stringify(satpos));

		// Update description...
		app.MapPane._controls.description.setHTMLfromStore(this.layerUuid);



	},	


	_refresh : function () {
		this._flush();
		this._initLayout();
	},

	_flush : function () {
		this._container.innerHTML = '';
	},




	// CARTO CARTO CARTO CARTO
	// CARTO CARTO CARTO CARTO
	// CARTO CARTO CARTO CARTO

	_updateStyle : function () {
		
		this.getCartoCSSFromJSON(this.cartoJSON, function (ctx, finalCarto) {
			this.saveCartoJSON(finalCarto);
		});

	},


	getCartoCSSFromJSON : function (json, callback) {

		var options = {
			styleJSON : json,
			columns : this.columns
		}


		Wu.post('/api/geo/json2carto', JSON.stringify(options), callback.bind(this), this);

	},	


	saveCartoJSON : function (finalCarto) {

		this._layer.setStyling(this.cartoJSON);

		var sql = this._layer.getSQL();

		// request new layer
		var layerOptions = {
			css : finalCarto, 
			sql : sql,
			layer : this._layer
		}

		this._updateLayer(layerOptions);;		

	},


	_updateLayer : function (options, done) {

		var css = options.css,
		    layer = options.layer,
		    file_id = layer.getFileUuid(),
		    sql = options.sql,
		    project = this._project;


		var layerOptions = layer.store.data.postgis;

		layerOptions.sql = sql;
		layerOptions.css = css;
		layerOptions.file_id = file_id;		

		var layerJSON = {
			geom_column: 'the_geom_3857',
			geom_type: 'geometry',
			raster_band: '',
			srid: '',
			affected_tables: '',
			interactivity: '',
			attributes: '',
			access_token: app.tokens.access_token,
			cartocss_version: '2.0.1',
			cartocss : css,
			sql: sql,
			file_id: file_id,
			return_model : true,
			layerUuid : layer.getUuid()
		}

		var that = this;

		console.log('layerJSON', layerJSON);

		// create layer on server
		Wu.post('/api/db/createLayer', JSON.stringify(layerJSON), function (err, newLayerJSON) {

			// new layer
			var newLayerStyle = Wu.parse(newLayerJSON);

			// catch errors
			if (newLayerStyle.error) {
				done && done();
				return console.error(newLayerStyle.error);
			}


			// update layer
			layer.updateStyle(newLayerStyle);

			// return
			done && done();
		}.bind(this));

	},		
});









Wu.Control = L.Control.extend({

	initialize : function (options) {

		// set options
		Wu.setOptions(this, options);

		// listen up
		this._listen();

		// local initialize
		this._initialize(options);

	},      

	_listen : function () {
		Wu.Mixin.Events.on('projectSelected', this._projectSelected, this);

		Wu.Mixin.Events.on('editEnabled',     this._editEnabled, this);
		Wu.Mixin.Events.on('editDisabled',    this._editDisabled, this);
		
		Wu.Mixin.Events.on('layerEnabled',    this._layerEnabled, this);
		Wu.Mixin.Events.on('layerDisabled',   this._layerDisabled, this);
		Wu.Mixin.Events.on('layerAdded',      this._onLayerAdded, this);
		Wu.Mixin.Events.on('layerEdited',     this._onLayerEdited, this);
		Wu.Mixin.Events.on('layerStyleEdited',this._onLayerStyleEdited, this);
		Wu.Mixin.Events.on('layerDeleted',    this._onLayerDeleted, this);
		
		Wu.Mixin.Events.on('fileImported',    this._onFileImported, this);
		Wu.Mixin.Events.on('fileDeleted',     this._onFileDeleted, this);
	},

	_projectSelected : function (e) {
		var projectUuid = e.detail.projectUuid;
		if (!projectUuid) {
			this._project = null;
			return this._off();
		}
		// set project
		this._project = app.activeProject = app.Projects[projectUuid];

		// refresh pane
		this._refresh();
	},

	// dummies
	_initialize 	 : function () {},
	_editEnabled 	 : function () {},
	_editDisabled 	 : function () {},
	_layerEnabled 	 : function () {},
	_layerDisabled 	 : function () {},
	_updateView 	 : function () {},
	_refresh 	 : function () {},
	_onFileImported  : function () {},
	_onFileDeleted   : function () {},
	_onLayerAdded    : function () {},
	_onLayerEdited   : function () {},
	_onLayerStyleEdited   : function () {},
	_onLayerDeleted  : function () {},
	_off 		 : function () {},

});
L.Control.Zoom = Wu.Control.extend({
	
	type : 'zoom',

	options: {
		position: 'topleft',
		zoomInText: '+',
		zoomInTitle: 'Zoom in',
		zoomOutText: '-',
		zoomOutTitle: 'Zoom out'
	},

	_on : function () {
		this._show();
	},
	_off : function () {
		this._hide();
	},
	_show : function () {
		this._container.style.display = 'block';
	},
	_hide : function () {
		this._container.style.display = 'none';
	},

	_addTo : function () {
		this.addTo(app._map);
		this._added = true;

	},

	_refresh : function () {
		// should be active
		if (!this._added) this._addTo();

		// get control active setting from project
		var active = this._project.getControls()[this.type];
		
		// if not active in project, hide
		if (!active) return this._hide();

		// remove old content
		this._flush();
	},

	_flush : function () {

	},


	onAdd: function (map) {
		var zoomName = 'leaflet-control-zoom',
		    container = L.DomUtil.create('div', zoomName + ' leaflet-bar');

		this._map = map;

		this._zoomInButton  = this._createButton(
		        this.options.zoomInText, this.options.zoomInTitle,
		        zoomName + '-in',  container, this._zoomIn,  this);
		this._zoomOutButton = this._createButton(
		        this.options.zoomOutText, this.options.zoomOutTitle,
		        zoomName + '-out', container, this._zoomOut, this);

		this._updateDisabled();
		map.on('zoomend zoomlevelschange', this._updateDisabled, this);

		return container;
	},

	onRemove: function (map) {
		map.off('zoomend zoomlevelschange', this._updateDisabled, this);
	},

	_zoomIn: function (e) {
		this._map.zoomIn(e.shiftKey ? 3 : 1);
	},

	_zoomOut: function (e) {
		this._map.zoomOut(e.shiftKey ? 3 : 1);
	},

	_createButton: function (html, title, className, container, fn, context) {
		var link = L.DomUtil.create('a', className, container);
		link.innerHTML = html;
		link.href = '#';
		link.title = title;

		var stop = L.DomEvent.stopPropagation;

		L.DomEvent
		    .on(link, 'click', stop)
		    .on(link, 'mousedown', stop)
		    .on(link, 'dblclick', stop)
		    .on(link, 'click', L.DomEvent.preventDefault)
		    .on(link, 'click', fn, context)
		    .on(link, 'click', this._refocusOnMap, context);

		return link;
	},

	_updateDisabled: function () {
		var map = this._map,
			className = 'leaflet-disabled';

		L.DomUtil.removeClass(this._zoomInButton, className);
		L.DomUtil.removeClass(this._zoomOutButton, className);

		if (map._zoom === map.getMinZoom()) {
			L.DomUtil.addClass(this._zoomOutButton, className);
		}
		if (map._zoom === map.getMaxZoom()) {
			L.DomUtil.addClass(this._zoomInButton, className);
		}
	}
});

L.Map.mergeOptions({
	zoomControl: true
});

L.Map.addInitHook(function () {
	if (this.options.zoomControl) {
		this.zoomControl = new L.Control.Zoom();
		this.addControl(this.zoomControl);
	}
});

L.control.zoom = function (options) {
	return new L.Control.Zoom(options);
};

/*
 * L.GeoJSON turns any GeoJSON data into a Leaflet layer.
 * 
 * 			ArkGis Custom Build, complete file.
 *
 */


L.GeoJSON = L.FeatureGroup.extend({

	initialize: function (geojson, options) {
		L.setOptions(this, options);
		this._layers = {};

		if (geojson) {
			this.addData(geojson);
		}
	},

	addData: function (geojson) {
			
		var features = L.Util.isArray(geojson) ? geojson : geojson.features,
		    i, len, feature;
		
		if (features) {
			for (i = 0, len = features.length; i < len; i++) {
				// Only add this if geometry or geometries are set and not null
				feature = features[i];
				if (feature.geometries || feature.geometry || feature.features || feature.coordinates) {
					this.addData(features[i]);
				}
			}
			return this;
		}

		var options = this.options;
		if (options.filter && !options.filter(geojson)) { return; }

		var layer = L.GeoJSON.geometryToLayer(geojson, options.pointToLayer, options.coordsToLatLng, options);
		layer.feature = L.GeoJSON.asFeature(geojson);

		layer.defaultOptions = layer.options;
		this.resetStyle(layer);

		if (options.onEachFeature) {
			options.onEachFeature(geojson, layer);
		}

		return this.addLayer(layer);
	},

	resetStyle: function (layer) {
		var style = this.options.style;
		if (style) {
			// reset any custom styles
			L.Util.extend(layer.options, layer.defaultOptions);

			this._setLayerStyle(layer, style);
		}
	},

	setStyle: function (style) {
		this.eachLayer(function (layer) {
			this._setLayerStyle(layer, style);
		}, this);
	},

	_setLayerStyle: function (layer, style) {
		if (typeof style === 'function') {
			style = style(layer.feature);
		}
		if (layer.setStyle) {
			layer.setStyle(style);
		}
	}
});



L.extend(L.GeoJSON, {
	geometryToLayer: function (geojson, pointToLayer, coordsToLatLng, vectorOptions) {

		var geometry = geojson.type === 'Feature' ? geojson.geometry : geojson,
		    coords = geometry.coordinates,
		    layers = [],
		    latlng, latlngs, i, len;

		coordsToLatLng = coordsToLatLng || this.coordsToLatLng;
		
		switch (geometry.type.toLowerCase()) {
		
			case 'point':
				latlng = coordsToLatLng(coords);
				return pointToLayer ? pointToLayer(geojson, latlng) : new L.Marker(latlng);
	
			case 'multipoint':
				for (i = 0, len = coords.length; i < len; i++) {
					latlng = coordsToLatLng(coords[i]);
					layers.push(pointToLayer ? pointToLayer(geojson, latlng) : new L.Marker(latlng));
				}
				return new L.FeatureGroup(layers);
	
			case 'linestring':
				latlngs = this.coordsToLatLngs(coords, 0, coordsToLatLng);
				return new L.Polyline(latlngs, vectorOptions);
	
			case 'polygon':
				if (coords.length === 2 && !coords[1].length) {
					throw new Error('Invalid GeoJSON object.');
				}
				latlngs = this.coordsToLatLngs(coords, 1, coordsToLatLng);
				return new L.Polygon(latlngs, vectorOptions);
	
			case 'multilinestring':
				latlngs = this.coordsToLatLngs(coords, 1, coordsToLatLng);
				return new L.MultiPolyline(latlngs, vectorOptions);
	
			case 'multipolygon':
				latlngs = this.coordsToLatLngs(coords, 2, coordsToLatLng);
				return new L.MultiPolygon(latlngs, vectorOptions);
	
			case 'geometrycollection':
				for (i = 0, len = geometry.geometries.length; i < len; i++) {
					layers.push(this.geometryToLayer({
						geometry: geometry.geometries[i],
						type: 'Feature',
						properties: geojson.properties
					}, pointToLayer, coordsToLatLng, vectorOptions));
				}
				return new L.FeatureGroup(layers);
	
			case 'circle':
				var coord = coords[0];
				latlng = new L.LatLng(coord[1], coord[0]);
				return new L.Circle(latlng, geometry.radius);
	
			default:
				throw new Error('Invalid GeoJSON object.');
			}
	},

	coordsToLatLng: function (coords) { // (Array[, Boolean]) -> LatLng
		return new L.LatLng(coords[1], coords[0], coords[2]);
	},

	coordsToLatLngs: function (coords, levelsDeep, coordsToLatLng) { // (Array[, Number, Function]) -> Array
		var latlng, i, len,
		    latlngs = [];

		for (i = 0, len = coords.length; i < len; i++) {
			latlng = levelsDeep ?
			        this.coordsToLatLngs(coords[i], levelsDeep - 1, coordsToLatLng) :
			        (coordsToLatLng || this.coordsToLatLng)(coords[i]);

			latlngs.push(latlng);
		}

		return latlngs;
	},

	latLngToCoords: function (latlng) {
		var coords = [latlng.lng, latlng.lat];

		if (latlng.alt !== undefined) {
			coords.push(latlng.alt);
		}
		return coords;
	},

	latLngsToCoords: function (latLngs) {
		var coords = [];

		for (var i = 0, len = latLngs.length; i < len; i++) {
			coords.push(L.GeoJSON.latLngToCoords(latLngs[i]));
		}

		return coords;
	},

	getFeature: function (layer, newGeometry) {
		return layer.feature ? L.extend({}, layer.feature, {geometry: newGeometry}) : L.GeoJSON.asFeature(newGeometry);
	},

	asFeature: function (geoJSON) {
		if (geoJSON.type === 'Feature') {
			return geoJSON;
		}

		return {
			type: 'Feature',
			properties: {},
			geometry: geoJSON
		};
	}
});

var PointToGeoJSON = {
	toGeoJSON: function () {
		return L.GeoJSON.getFeature(this, {
			type: 'Point',
			coordinates: L.GeoJSON.latLngToCoords(this.getLatLng())
		});
	}
};

L.Marker.include(PointToGeoJSON);
//L.Circle.include(PointToGeoJSON);
L.CircleMarker.include(PointToGeoJSON);

L.Circle.include({
	toGeoJSON: function () {
		return {
			type: 'Circle',
			coordinates: [[this.getLatLng().lng, this.getLatLng().lat]],
			radius: this.getRadius()
		}
	}
});

L.Polyline.include({
	toGeoJSON: function () {
		return L.GeoJSON.getFeature(this, {
			type: 'LineString',
			coordinates: L.GeoJSON.latLngsToCoords(this.getLatLngs())
		});
	}
});

L.Polygon.include({
	toGeoJSON: function () {
		var coords = [L.GeoJSON.latLngsToCoords(this.getLatLngs())],
		    i, len, hole;

		coords[0].push(coords[0][0]);

		if (this._holes) {
			for (i = 0, len = this._holes.length; i < len; i++) {
				hole = L.GeoJSON.latLngsToCoords(this._holes[i]);
				hole.push(hole[0]);
				coords.push(hole);
			}
		}

		return L.GeoJSON.getFeature(this, {
			type: 'Polygon',
			coordinates: coords
		});
	}
});

(function () {
	function multiToGeoJSON(type) {
		return function () {
			var coords = [];

			this.eachLayer(function (layer) {
				coords.push(layer.toGeoJSON().geometry.coordinates);
			});

			return L.GeoJSON.getFeature(this, {
				type: type,
				coordinates: coords
			});
		};
	}

	// L.MultiPolyline.include({toGeoJSON: multiToGeoJSON('MultiLineString')});
	// L.MultiPolygon.include({toGeoJSON: multiToGeoJSON('MultiPolygon')});

	L.LayerGroup.include({
		toGeoJSON: function () {

			var geometry = this.feature && this.feature.geometry,
				jsons = [],
				json;

			if (geometry && geometry.type === 'MultiPoint') {
				return multiToGeoJSON('MultiPoint').call(this);
			}

			var isGeometryCollection = geometry && geometry.type === 'GeometryCollection';

			this.eachLayer(function (layer) {
				if (layer.toGeoJSON) {
					json = layer.toGeoJSON();
					jsons.push(isGeometryCollection ? json.geometry : L.GeoJSON.asFeature(json));
				}
			});

			if (isGeometryCollection) {
				return L.GeoJSON.getFeature(this, {
					geometries: jsons,
					type: 'GeometryCollection'
				});
			}

			return {
				type: 'FeatureCollection',
				features: jsons
			};
		}
	});
}());

L.geoJson = function (geojson, options) {
	return new L.GeoJSON(geojson, options);
};
L.Control.Draw = Wu.Control.extend({

	options: {
		position: 'topleft',
		draw: {
			polyline : false,
			rectangle : false,
			circle : false,
			marker : false,
			polygon : {
				showArea : true,
				allowIntersection: false, // Restricts shapes to simple polygons
				drawError: {
					color: 'red', // Color the shape will turn when intersects
					message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
				},
				shapeOptions: {
					color: 'blue',
				}, 
				smoothFactor : 0.5
			}
		},
	},

	type : 'draw',

	_flush : function () {
	},

	_addTo : function () {
		// return;
		if (!app._map) return;

		// add to map
		this.addTo(app._map);
		
		// add hooks
		this._addHooks();
		
		// mark inited
		this._added = true;
	},

	_addHooks : function () {

		var map = app._map;

		// draw events
		map.on('draw:created', this._drawCreated.bind(this));
		map.on('draw:edited', this._drawEdited.bind(this));
		map.on('draw:deleted', this._drawDeleted.bind(this));
		map.on('draw:editstart', this._drawEditstart.bind(this));
		map.on('draw:editstop', this._drawEditstop.bind(this));
		map.on('draw:drawstop', this._drawDrawstop.bind(this));
		map.on('draw:drawstart', this._drawDrawstart.bind(this));

		// // enable draw programatically
		keymaster('d', this._toggleDraw.bind(this));
		keymaster('e', this._toggleEdit.bind(this));
		keymaster('c', this._clearAll.bind(this));

		// button events
		var removeButton = this._toolbars.edit._modes.remove.button;
		Wu.DomEvent.on(removeButton, 'click', this._clearAll, this);
		
	},

	_clearAll : function () {

		var r = this._toolbars.edit._modes.remove.handler;
		var e = this._toolbars.edit._modes.edit.handler;
		var layers = r._deletableLayers.getLayers();

		layers.forEach(function (l) {
			r._deletableLayers.removeLayer(l);
			r.save();
			r.disable();
			e.disable();

			app.MapPane._clearPopup();
			
		}, this);

		if (!layers.length) app.MapPane._clearPopup();

	},

	_drawCreated : function (e) {
		var type = e.layerType,
		    layer = e.layer;

		// add layer to map
		this._layerContainer.addLayer(layer);

		// query for data
		this._queryData(layer);

		// add layer events
		this._addLayerEvents(layer);
	},

	_queryData : function (layer) {

		// get data etc.
		var geojson = layer.toGeoJSON();

		// fetch data
		this._fetchData({
			geojson : geojson,
			layer : layer
		}, function (err, results) {
			var resultObject = Wu.parse(results);

			// add center
			resultObject.center = layer.getBounds().getCenter();

			// add to popup
			app.MapPane._addPopupContentDraw(resultObject);

			// mark as not creating anymore
			app.MapPane._creatingPolygon = false;

			// memorize
			this._latestFetch = resultObject;

			var layer_name = this._getPostGISLayerName(resultObject.layer_id);

			// analytics/slack
			app.Analytics.onPolygonQuery({
				result : resultObject,
				layer_name : layer_name
			});

		}.bind(this));
		
	},

	_getPostGISLayerName : function (layer_id) {
		var layer = this._project.getPostGISLayer(layer_id);
		if (!layer) return 'unknown';
		return layer.getTitle();
	},

	_addLayerEvents : function (layer) {
		
		// on delete
		layer.on('deleted', function (e) {
			// shortcut that shizz
			var removeHandler = this._toolbars.edit._modes.remove.handler;
			removeHandler.save();
			removeHandler.disable();

		}.bind(this));
	},


	_drawEdited : function (e) {

		var layer = this._getEditedLayer(e);

		if (!layer) return;
		
		// query for data
		this._queryData(layer);

	},

	_getEditedLayer : function (e) {
		var layers = e.layers._layers;
		for (var l in layers) {
			return layers[l];
		}

	},

	// events
	_drawEditstart : function (e) {
		app.MapPane._drawing = true;
	},
	_drawEditstop : function (e) {
		app.MapPane._drawing = false;
	},
	_drawDrawstart : function (e) {
		app.MapPane._drawing = true;
	},
	_drawDrawstop : function (e) {
		app.MapPane._drawing = false;
	},
	_drawDeleted : function (e) {
	},

	// fetch data from postgis
	_fetchData : function (options, callback) {

		var layer_id = this._getActiveLayerID();

		if (!layer_id) {
			console.error('no active layer_id to fetch data from??');
			app.FeedbackPane.setMessage({
				title : 'No active layer to fetch data from.'
			});

			return;
		} 

		var options = {
			access_token : app.tokens.access_token,
			geojson : options.geojson,
			layer_id : layer_id
		}

		Wu.send('/api/db/fetchArea', options, callback, this);
	},
	
	_getActiveLayerID : function () {
		var layer = app.MapPane._layermenuZIndex._index[0];
		if (!layer || !layer.store || !layer.store.data || !layer.store.data.postgis) return false;
		var layer_id = layer.store.data.postgis.layer_id;
		return layer_id;
	},

	_getActiveLayer : function () {
		var layer_id = this._getActiveLayerID();
		var layers = app.activeProject.getLayers();
		var layer = _.find(layers, function (l) {
			console.log('l: ', l);
			if (!l.store || !l.store.data) return false;
			if (l.store.data.postgis) {
				return l.store.data.postgis == layer_id;
			}
			return false;
		})
		return layer;
	},

	_getActiveLayerName : function () {
		var layer = this._getActiveLayer();
		if (!layer) return 'No layer';
		return layer.getTitle();
	},

	_toggleDraw : function () {
		
		if (this._drawEnabled) {
			this._toolbars.draw._modes.polygon.handler.disable();
			this._drawEnabled = false;
		} else {
			this._toolbars.draw._modes.polygon.handler.enable();
			this._drawEnabled = true;
		}	
	},

	_toggleEdit : function () {
		if (this._editEnabled) {
			this._toolbars.edit._modes.edit.handler.save();
			this._toolbars.edit._modes.edit.handler.disable()
			this._editEnabled = false;
		} else {
			this._toolbars.edit._modes.edit.handler.enable();
			this._editEnabled = true;
		}	
	},

	
	_refresh : function () {

		// should be active
		if (!this._added) this._addTo(app._map);

		// get control active setting from project
		var active = this._project.getControls()[this.type];
		
		// if not active in project, hide
		if (!active) return this._hide();

		// remove old content
		this._flush();

		// show
		this._show();

	},

	_projectSelected : function (e) {
		var projectUuid = e.detail.projectUuid;

		if (!projectUuid) {
			this._project = null;
			return this._off();
		}
		// set project
		this._project = app.activeProject = app.Projects[projectUuid];

		// refresh pane
		this._refresh();
	},

	// turned on and off by sidepane/options/controls toggle
	_on : function () {

		// refresh
		this._refresh();

		// add new content
		this._initContent();

	},
	_off : function () {
		this._hide();
	},

	_isActive : function () {
		if (!this._project) return false;
		return this._project.getControls()[this.type];
	},

	_show : function () {
		this._container.style.display = 'block';
	},

	_hide : function () {
		this._container.style.display = 'none';
	},

	show : function () {
		if (!this._container) return;
		this._isActive() ? this._show() : this._hide();
	},

	hide : function () {
		if (!this._container) return;

		this._hide();
	},

	_initContent : function () {
	},

	refresh : function () {
		this.addTo(app._map);
	},

	onRemove : function (map) {

	},

	_initialize: function (options) {

		// create layer container
		this._layerContainer = new L.FeatureGroup();
		app._map.addLayer(this._layerContainer);

		// add edit options
		this.options.edit = {
			featureGroup : this._layerContainer,
			// remove : false
		}
		
		var toolbar;

		this._toolbars = {};

		// Initialize toolbars
		if (L.DrawToolbar && this.options.draw) {
			toolbar = new L.DrawToolbar(this.options.draw);

			this._toolbars[L.DrawToolbar.TYPE] = toolbar;

			// Listen for when toolbar is enabled
			this._toolbars[L.DrawToolbar.TYPE].on('enable', this._toolbarEnabled, this);

		}

		if (L.EditToolbar && this.options.edit) {
			toolbar = new L.EditToolbar(this.options.edit);

			this._toolbars[L.EditToolbar.TYPE] = toolbar;

			// Listen for when toolbar is enabled
			this._toolbars[L.EditToolbar.TYPE].on('enable', this._toolbarEnabled, this);
		}
	},

	onAdd: function (map) {
		var container = L.DomUtil.create('div', 'leaflet-draw'),
			addedTopClass = false,
			topClassName = 'leaflet-draw-toolbar-top',
			toolbarContainer;

		for (var toolbarId in this._toolbars) {
			if (this._toolbars.hasOwnProperty(toolbarId)) {
				toolbarContainer = this._toolbars[toolbarId].addToolbar(map);

				if (toolbarContainer) {
					// Add class to the first toolbar to remove the margin
					if (!addedTopClass) {
						if (!L.DomUtil.hasClass(toolbarContainer, topClassName)) {
							L.DomUtil.addClass(toolbarContainer.childNodes[0], topClassName);
						}
						addedTopClass = true;
					}

					container.appendChild(toolbarContainer);
				}
			}
		}

	
		return container;
	},

	onRemove: function () {
		for (var toolbarId in this._toolbars) {
			if (this._toolbars.hasOwnProperty(toolbarId)) {
				this._toolbars[toolbarId].removeToolbar();
			}
		}
	},

	setDrawingOptions: function (options) {
		for (var toolbarId in this._toolbars) {
			if (this._toolbars[toolbarId] instanceof L.DrawToolbar) {
				this._toolbars[toolbarId].setOptions(options);
			}
		}
	},

	_toolbarEnabled: function (e) {
		var enabledToolbar = e.target;

		for (var toolbarId in this._toolbars) {
			if (this._toolbars[toolbarId] !== enabledToolbar) {
				this._toolbars[toolbarId].disable();
			}
		}
	}



});

L.drawControl = function (options) {
	return new L.Control.Draw(options);
};

// app.ZIndexControl

Wu.ZIndexControl = Wu.Class.extend({

	initialize : function () {
		
		// store
		this._index = [];

		// add shortcut
		app.zIndex = this;
	},

	add : function (layer) {

		// add to top of zindex
		this._index.push(layer);

		// enforce zindex
		this.enforce();
	},

	remove : function (layer) {
		_.remove(this._index, function (l) {
			return l == layer;
		});

		// enforce zindex
		this.enforce();
	},

	set : function (z, layer) {

	},

	get : function (layer) {
		// get all
		if (!layer) return this._index;

		// if layer, get layer xindex
		return _.findIndex(this._index, function (l) { return layer == l; });
	},

	getIndex : function () {
		var clear = []
		this._index.forEach(function (l) {
			clear.push(l.getTitle());
		});
		return clear;
	},

	up : function (layer) {

		// get current index
		var cur = this.get(layer);

		// move up in index array
		this._move(cur, cur + 1);

		// update zindex on map
		this.enforce();
	},

	_move : function (from, to) {
		 this._index.splice(to, 0, this._index.splice(from, 1)[0]);
	},

	down : function (layer) {

		// get current index
		var cur = this.get(layer);

		// move down in index array
		this._move(cur, cur - 1);

		// update zindex on map
		this.enforce();

	},

	top : function (layer) {

	},

	bottom : function (layer) {

	},

	// enforce zindexes
	enforce : function () {
		var layers = this._index;
		layers.forEach(function (layer, i) {
			var zindex = i + this._z; 
			layer._setZIndex(zindex);
		}, this);
	},

});

Wu.ZIndexControl.Baselayers = Wu.ZIndexControl.extend({

	// baselayers start with zindex 0
	_z : 0,
	_me : 'base',

});

Wu.ZIndexControl.Layermenu = Wu.ZIndexControl.extend({

	// layermenu start w zindex 1000, to stay on top of baselayers
	_z : 1000,
	_me : 'layermenu',

});













L.Control.Measure = Wu.Control.extend({
	
	type : 'measure', // todo: rename to scale

	options: {
		position: 'topright',
		maxWidth: 100,
		metric: true,
		imperial: true,
		updateWhenIdle: false
	},

	onAdd: function (map) {
		this._map = map;

		var className = 'leaflet-control-scale',
		    container = L.DomUtil.create('div', className),
		    options = this.options;

		this._addScales(options, className, container);

		map.on(options.updateWhenIdle ? 'moveend' : 'move', this._update, this);
		map.whenReady(this._update, this);

		return container;
	},

	onRemove: function (map) {
		map.off(this.options.updateWhenIdle ? 'moveend' : 'move', this._update, this);
	},

	_addTo : function () {
		this.addTo(app._map);
		this._added = true;
		this._addStops();

	},

	_addStops : function () {
		L.DomEvent.on(this._container, 'dblclick',  Wu.DomEvent.stop, this);
		L.DomEvent.on(this._container, 'mousedown', Wu.DomEvent.stop, this);
		L.DomEvent.on(this._container, 'mouseup',   Wu.DomEvent.stop, this);
	},

	_refresh : function () {
		if (!this._added) this._addTo();

		// get control active setting from project
		var active = this._project.getControls()[this.type];
		
		// if not active in project, hide
		if (!active) return this._hide();

		this._show();
	},

	_show : function () {
		this._container.style.display = 'inline-block';

		// this.__toggle();
	},

	_hide : function () {
		this._container.style.display = 'none';
	},

	_on : function () {
		this._show();
	},

	_off : function () {
		this._hide();
	},

	_addScales: function (options, className, container) {
		if (options.metric) {
			this._mScale = L.DomUtil.create('div', className + '-line', container);
		}
		if (options.imperial) {
			this._iScale = L.DomUtil.create('div', className + '-line', container);
		}
	},

	_update: function () {
		var bounds = this._map.getBounds(),
		    centerLat = bounds.getCenter().lat,
		    halfWorldMeters = 6378137 * Math.PI * Math.cos(centerLat * Math.PI / 180),
		    dist = halfWorldMeters * (bounds.getNorthEast().lng - bounds.getSouthWest().lng) / 180,
		    size = this._map.getSize(),
		    options = this.options,
		    maxMeters = 0;

		if (size.x > 0) {
			maxMeters = dist * (options.maxWidth / size.x);
		}

		this._updateScales(options, maxMeters);
	},

	_updateScales: function (options, maxMeters) {
		if (options.metric && maxMeters) {
			this._updateMetric(maxMeters);
		}

		if (options.imperial && maxMeters) {
			this._updateImperial(maxMeters);
		}
	},

	_updateMetric: function (maxMeters) {
		var meters = this._getRoundNum(maxMeters);

		this._mScale.style.width = this._getScaleWidth(meters / maxMeters) + 'px';
		this._mScale.innerHTML = meters < 1000 ? meters + ' m' : (meters / 1000) + ' km';
	},

	_updateImperial: function (maxMeters) {
		var maxFeet = maxMeters * 3.2808399,
		    scale = this._iScale,
		    maxMiles, miles, feet;

		if (maxFeet > 5280) {
			maxMiles = maxFeet / 5280;
			miles = this._getRoundNum(maxMiles);

			scale.style.width = this._getScaleWidth(miles / maxMiles) + 'px';
			scale.innerHTML = miles + ' mi';

		} else {
			feet = this._getRoundNum(maxFeet);

			scale.style.width = this._getScaleWidth(feet / maxFeet) + 'px';
			scale.innerHTML = feet + ' ft';
		}
	},

	_getScaleWidth: function (ratio) {
		return Math.round(this.options.maxWidth * ratio) - 10;
	},

	_getRoundNum: function (num) {
		var pow10 = Math.pow(10, (Math.floor(num) + '').length - 1),
		    d = num / pow10;

		d = d >= 10 ? 10 : d >= 5 ? 5 : d >= 3 ? 3 : d >= 2 ? 2 : 1;

		return pow10 * d;
	}
});

L.control.scale = function (options) {
	return new L.Control.Scale(options);
};

(function() {

L.Control.Geolocation = Wu.Control.extend({

	type : 'geolocation',

	includes: L.Mixin.Events,
	//
	//	Name					Data passed			   Description
	//
	//Managed Events:
	//	search_locationfound	{latlng, title, layer} fired after moved and show markerLocation
	//  search_collapsed		{}					   fired after control was collapsed
	//
	//Public methods:
	//  setLayer()				L.LayerGroup()         set layer search at runtime
	//  showAlert()             'Text message'         Show alert message
	//
	options: {
		wrapper: '',				// container id to insert Search Control
		url: '',				// url for search by ajax request, ex: "search.php?q={s}"
		jsonpParam: null,			// jsonp param name for search by jsonp service, ex: "callback"
		layer: null,				// layer where search markers(is a L.LayerGroup)		
		callData: null,				// function that fill _recordsCache, passed searching text by first param and callback in second
		//TODO important! implements uniq option 'sourceData' that recognizes source type: url,array,callback or layer		
		//TODO implement can do research on multiple sources
		propertyName: 'title',			// property in marker.options(or feature.properties for vector layer) trough filter elements in layer,
		propertyLoc: 'loc',			// field for remapping location, using array: ['latname','lonname'] for select double fields(ex. ['lat','lon'] )
							// support dotted format: 'prop.subprop.title'
		callTip: null,				// function that return row tip html node(or html string), receive text tooltip in first param
		filterJSON: null,			// callback for filtering data to _recordsCache
		minLength: 3,				// minimal text length for autocomplete
		initial: true,				// search elements only by initial text
		autoType: true,				// complete input with first suggested result and select this filled-in text.
		delayType: 200,				// delay while typing for show tooltip
		tooltipLimit: -1,			// limit max results to show in tooltip. -1 for no limit.
		tipAutoSubmit: true,  			// auto map panTo when click on tooltip
		autoResize: true,			// autoresize on input change
		collapsed: true,			// collapse search control at startup
		autoCollapse: true,			// collapse search control after submit (on button or on tips if enabled tipAutoSubmit)
							// TODO add option for persist markerLoc after collapse!
		autoCollapseTime: 1200,			// delay for autoclosing alert and collapse after blur
		zoom: 14,				// zoom after pan to location found, default: map.getZoom()
		box : true,
		text: 'Enter address...',		// placeholder value	
		textCancel: 'Cancel',			// title in cancel button
		textErr: 'Unknown address.',		// error message
		position: 'topleft',
		animateLocation: false,			// animate a circle over location found
		circleLocation: true,			// draw a circle in location found
		markerLocation: false,			// draw a marker in location found
		markerIcon: new L.Icon.Default(),	// custom icon for maker location

		url : 'https://nominatim.openstreetmap.org/search?format=json&q={s}',
		jsonpParam : 'json_callback',
		propertyName : 'display_name',
		propertyLoc : ['lat','lon'],	
		boundingBox : 'boundingbox',

		// custom filter
		filterJSON : function (json) {
			var jsonret = [], i;
			for (i in json) {
				var item = json[i];
				if (item.hasOwnProperty('type')) {
					var adr = {
						address : item.display_name,
						boundingbox : item.boundingbox,
						latlng : L.latLng(item.lat, item.lon),
						type : item.type
					}
				}

				// push
				jsonret.push(adr);
			}
			
			var all = _.unique(jsonret, function (j) {
				if (j) return j.address;
			});

			return all;
		}
	},

	// FIXME option condition problem {autoCollapse: true, markerLocation: true} not show location
	// FIXME option condition problem {autoCollapse: false }
	//
	// TODO important optimization!!! always append data in this._recordsCache
	//  now _recordsCache content is emptied and replaced with new data founded
	//  always appending data on _recordsCache give the possibility of caching ajax, jsonp and layersearch!
	//
	// TODO here insert function that search inputText FIRST in _recordsCache keys and if not find results.. 
	//  run one of callbacks search(callData,jsonpUrl or options.layer) and run this.showTooltip
	//
	// TODO change structure of _recordsCache
	//	like this: _recordsCache = {"text-key1": {loc:[lat,lng], ..other attributes.. }, {"text-key2": {loc:[lat,lng]}...}, ...}
	//	in this mode every record can have a free structure of attributes, only 'loc' is required
	
	_initialize: function(options) {
		// L.Util.setOptions(this, options);
		this._inputMinSize = this.options.text ? this.options.text.length : 10;
		this._layer = this.options.layer || new L.LayerGroup();
		this._filterJSON = this.options.filterJSON || this._defaultFilterJSON;
		this._autoTypeTmp = this.options.autoType;	//useful for disable autoType temporarily in delete/backspace keydown
		this._countertips = 0;		//number of tips items
		this._recordsCache = {};	//key,value table! that store locations! format: key,latlng
		return this;
	},

	onAdd: function (map) {
		this._map = map;
		var container = this._container = L.DomUtil.create('div', 'leaflet-control-search');
		this._input = this._createInput(this.options.text, 'search-input');
		this._tooltip = this._createTooltip('search-tooltip');
		this._cancel = this._createCancel(this.options.textCancel, 'search-cancel');
		this._button = this._createButton(this.options.text, 'search-button');
		this._alert = this._createAlert('search-alert');

		if(this.options.collapsed===false)
			this.expand();

		if(this.options.circleLocation || this.options.markerLocation || this.options.markerIcon)
			this._markerLoc = new SearchMarker([0,0], {
					showCircle: this.options.circleLocation,
					showMarker: this.options.markerLocation,
					icon: this.options.markerIcon
				}); // see below
		
		this.setLayer( this._layer );
		map.on({
		// 		'layeradd': this._onLayerAddRemove,
		// 		'layerremove': this._onLayerAddRemove
		     'resize': this._handleAutoresize
		 	}, this);

		app.Tooltip.add(this._container, 'Search for address or location');

		return container;

	},


	_on : function () {
		this._show();
	},
	_off : function () {
		this._hide();
	},
	_show : function () {
		this._container.style.display = 'block';
	},
	_hide : function () {
		this._container.style.display = 'none';
	},

	_addTo : function () {
		this.addTo(app._map);
		this._added = true;

	},

	_refresh : function () {
		// should be active
		if (!this._added) this._addTo();

		// get control active setting from project
		var active = this._project.getControls()[this.type];
		
		// if not active in project, hide
		if (!active) return this._hide();

		// remove old content
		this._flush();
	},

	_flush : function () {

	},



	// addTo: function (map) {

	// 	if (this.options.wrapper) {
	// 		this._container = this.onAdd(map);
	// 		this._wrapper = L.DomUtil.get(this.options.wrapper);
	// 		this._wrapper.style.position = 'relative';
	// 		this._wrapper.appendChild(this._container);
	// 	}
	// 	else
	// 		L.Control.prototype.addTo.call(this, map);

	// 	return this;
	// },

	// onRemove: function(map) {
	// 	L.Control.prototype.onRemove.call(this, map);
	// 	this._recordsCache = {};
	// 	// map.off({
	// 	// 		'layeradd': this._onLayerAddRemove,
	// 	// 		'layerremove': this._onLayerAddRemove
	// 	// 	}, this);
	// },

	// _onLayerAddRemove: function(e) {
	// 	//console.info('_onLayerAddRemove');
	// 	//without this, run setLayer also for each Markers!! to optimize!
	// 	if(e.layer instanceof L.LayerGroup)
	// 		if( L.stamp(e.layer) != L.stamp(this._layer) )
	// 			this.setLayer(e.layer);
	// },

	_getPath: function(obj, prop) {
		var parts = prop.split('.'),
			last = parts.pop(),
			len = parts.length,
			cur = parts[0],
			i = 1;

		if(len > 0)
			while((obj = obj[cur]) && i < len)
				cur = parts[i++];

		if(obj)
			return obj[last];
	},

	setLayer: function(layer) {	//set search layer at runtime
		//this.options.layer = layer; //setting this, run only this._recordsFromLayer()
		this._layer = layer;
		this._layer.addTo(this._map);
		if(this._markerLoc)
			this._layer.addLayer(this._markerLoc);
		return this;
	},
	
	showAlert: function(text) {
		text = text || this.options.textErr;
		this._alert.style.display = 'block';
		this._alert.innerHTML = text;
		clearTimeout(this.timerAlert);
		var that = this;		
		this.timerAlert = setTimeout(function() {
			that.hideAlert();
		},this.options.autoCollapseTime);
		return this;
	},
	
	hideAlert: function() {
		this._alert.style.display = 'none';
		return this;
	},
		
	cancel: function() {
		this._input.value = '';
		this._handleKeypress({keyCode:8});//simulate backspace keypress
		this._input.size = this._inputMinSize;
		this._input.focus();
		this._cancel.style.display = 'none';
		return this;
	},
	
	expand: function() {	
		this._input.style.display = 'block';
		L.DomUtil.addClass(this._container, 'search-exp');	
		this._input.focus();
		this._map.on('dragstart click', this.collapse, this);
		return this;	
	},

	collapse: function() {
		this._hideTooltip();
		this.cancel();
		this._alert.style.display = 'none';
		this._input.blur();
		if(this.options.collapsed)
		{
			this._input.style.display = 'none';
			this._cancel.style.display = 'none';			
			L.DomUtil.removeClass(this._container, 'search-exp');		
			this._markerLoc.hide();//maybe unuseful
			this._map.off('dragstart click', this.collapse, this);
		}
		this.fire('search_collapsed');
		return this;
	},
	
	collapseDelayed: function() {	//collapse after delay, used on_input blur
		if (!this.options.autoCollapse) return this;
		var that = this;
		clearTimeout(this.timerCollapse);
		this.timerCollapse = setTimeout(function() {
			that.collapse();
		}, this.options.autoCollapseTime);
		return this;		
	},

	collapseDelayedStop: function() {
		clearTimeout(this.timerCollapse);
		return this;		
	},

	////start DOM creations
	_createAlert: function(className) {
		var alert = L.DomUtil.create('div', className, this._container);
		alert.style.display = 'none';

		L.DomEvent
			.on(alert, 'click', L.DomEvent.stop, this)
			.on(alert, 'click', this.hideAlert, this);

		return alert;
	},

	_createInput: function (text, className) {
		var input = L.DomUtil.create('input', className, this._container);
		input.type = 'text';
		input.size = this._inputMinSize;
		input.value = '';
		input.autocomplete = 'off';
		input.autocorrect = 'off';
		input.autocapitalize = 'off';
		input.placeholder = text;
		input.style.display = 'none';
		
		L.DomEvent
			.disableClickPropagation(input)
			.on(input, 'keyup', this._handleKeypress, this)
			.on(input, 'keydown', this._handleAutoresize, this)
			.on(input, 'blur', this.collapseDelayed, this)
			.on(input, 'focus', this.collapseDelayedStop, this);
		
		return input;
	},

	_createCancel: function (title, className) {
		var cancel = L.DomUtil.create('a', className, this._container);
		cancel.href = '#';
		cancel.title = title;
		cancel.style.display = 'none';
		cancel.innerHTML = "<span>&otimes;</span>";//imageless(see css)

		L.DomEvent
			.on(cancel, 'click', L.DomEvent.stop, this)
			.on(cancel, 'click', this.cancel, this);

		return cancel;
	},
	
	_createButton: function (title, className) {
		var button = L.DomUtil.create('a', className, this._container);
		button.href = '#';
		button.title = title;

		L.DomEvent
			.on(button, 'click', L.DomEvent.stop, this)
			.on(button, 'click', this._handleSubmit, this)			
			.on(button, 'focus', this.collapseDelayedStop, this)
			.on(button, 'blur', this.collapseDelayed, this);

		return button;
	},

	_createTooltip: function(className) {
		var tool = L.DomUtil.create('div', className, this._container);
		tool.style.display = 'none';

		var that = this;
		L.DomEvent
			.disableClickPropagation(tool)
			.on(tool, 'blur', this.collapseDelayed, this)
			.on(tool, 'mousewheel', function(e) {
				that.collapseDelayedStop();
				L.DomEvent.stopPropagation(e);//disable zoom map
			}, this)
			.on(tool, 'mouseover', function(e) {
				that.collapseDelayedStop();
			}, this);
		return tool;
	},

	_createTip: function(text, val) {//val is object in recordCache, usually is Latlng
		var tip;
		
		if(this.options.callTip)
		{
			tip = this.options.callTip(text,val); //custom tip node or html string
			if(typeof tip === 'string')
			{
				var tmpNode = L.DomUtil.create('div');
				tmpNode.innerHTML = tip;
				tip = tmpNode.firstChild;
			}
		}
		else
		{
			tip = L.DomUtil.create('a', '');
			tip.href = '#';
			tip.innerHTML = text;
		}
		
		L.DomUtil.addClass(tip, 'search-tip');
		tip._text = text; //value replaced in this._input and used by _autoType

		L.DomEvent
			.disableClickPropagation(tip)		
			.on(tip, 'click', L.DomEvent.stop, this)
			.on(tip, 'click', function(e) {
				this._input.value = text;
				this._handleAutoresize();
				this._input.focus();
				this._hideTooltip();	
				if(this.options.tipAutoSubmit)//go to location at once
					this._handleSubmit();
			}, this);

		return tip;
	},

	//////end DOM creations
	_filterRecords: function(text) {	//Filter this._recordsCache case insensitive and much more..
		// console.log('_filterRecords');

		var regFilter = new RegExp("^[.]$|[\[\]|()*]",'g'),	//remove . * | ( ) ] [
			I, regSearch,
			frecords = {};

		text = text.replace(regFilter,'');	  //sanitize text
		I = this.options.initial ? '^' : '';  //search only initial text
		//TODO add option for case sesitive search, also showLocation
		regSearch = new RegExp(I + text,'i');

		//TODO use .filter or .map
		for(var key in this._recordsCache)
			if( regSearch.test(key) )
				frecords[key]= this._recordsCache[key];
		
		return frecords;
	},

	showTooltip: function() {
		var filteredRecords, newTip;

		this._countertips = 0;
		
		//FIXME problem with jsonp/ajax when remote filter has different behavior of this._filterRecords
		
		if (this.options.layer) {
			filteredRecords = this._filterRecords( this._input.value );
		} else {
			filteredRecords = this._recordsCache;
		}
			
		this._tooltip.innerHTML = '';
		this._tooltip.currentSelection = -1;  //inizialized for _handleArrowSelect()

		// ko
		filteredRecords.forEach(function (fr) {
			if (++this._countertips == this.options.tooltipLimit || !fr) return;

			// newTip = this._createTip(key, filteredRecords[key] );

			newTip = this._createTip(fr.address, fr.latlng)

			this._tooltip.appendChild(newTip);

		}, this);

		// for (var key in filteredRecords) {
		// 	if (++this._countertips == this.options.tooltipLimit) break;

		// 	newTip = this._createTip(key, filteredRecords[key] );

		// 	this._tooltip.appendChild(newTip);
		// }
		
		if (this._countertips > 0) {
			this._tooltip.style.display = 'block';
			if (this._autoTypeTmp) {
				this._autoType();
			}
			this._autoTypeTmp = this.options.autoType;//reset default value
		} else { 
			this._hideTooltip();
		}

		this._tooltip.scrollTop = 0;
		return this._countertips;
	},

	_hideTooltip: function() {
		this._tooltip.style.display = 'none';
		this._tooltip.innerHTML = '';
		return 0;
	},

	_defaultFilterJSON: function(json) {	//default callback for filter data
		var jsonret = {}, i,
		    propName = this.options.propertyName,
		    propLoc = this.options.propertyLoc;

		if (L.Util.isArray(propLoc)) {
			for(i in json) {		//   'display_name'
				jsonret[ this._getPath(json[i],propName) ] = L.latLng( json[i][ propLoc[0] ], json[i][ propLoc[1] ] );
			}
		}
		else {
			for(i in json) {
				jsonret[ this._getPath(json[i],propName) ] = L.latLng( this._getPath(json[i],propLoc) );
			}
		}
		//TODO throw new Error("propertyName '"+propName+"' not found in JSON data");
		return jsonret;
	},

	_recordsFromJsonp: function(text, callAfter) {  //extract searched records from remote jsonp service
		//TODO remove script node after call run
		var that = this;
		L.Control.Geolocation.callJsonp = function(data) {	//jsonp callback
			// console.log('fdata: ', data);
			var fdata = that._filterJSON(data); // _filterJSON defined in inizialize...
			callAfter(fdata);
		}
		var script = L.DomUtil.create('script','search-jsonp', document.getElementsByTagName('body')[0] ),			
			url = L.Util.template(this.options.url+'&'+this.options.jsonpParam+'=L.Control.Geolocation.callJsonp', {s: text}); //parsing url
			//rnd = '&_='+Math.floor(Math.random()*10000);
			//TODO add rnd param or randomize callback name! in recordsFromJsonp
		script.type = 'text/javascript';
		script.src = url;
		return this;
		//may be return {abort: function() { script.parentNode.removeChild(script); } };
	},

	_recordsFromAjax: function(text, callAfter) {	//Ajax request
		if (window.XMLHttpRequest === undefined) {
			window.XMLHttpRequest = function() {
				try { return new ActiveXObject("Microsoft.XMLHTTP.6.0"); }
				catch  (e1) {
					try { return new ActiveXObject("Microsoft.XMLHTTP.3.0"); }
					catch (e2) { throw new Error("XMLHttpRequest is not supported"); }
				}
			};
		}
		var request = new XMLHttpRequest(),
			url = L.Util.template(this.options.url, {s: text}), //parsing url
			//rnd = '&_='+Math.floor(Math.random()*10000);
			//TODO add rnd param or randomize callback name! in recordsFromAjax			
			response = {};
		
		request.open("GET", url);
		var that = this;
		request.onreadystatechange = function() {
		    if(request.readyState === 4 && request.status === 200) {
		    	response = JSON.parse(request.responseText);
		    	var fdata = that._filterJSON(response); // _filterJSON defined in inizialize...
		        callAfter(fdata);
		    }
		};
		request.send();
		return this;   
	},	

	_recordsFromLayer: function() {	//return table: key,value from layer
		var that = this,
			retRecords = {},
			propName = this.options.propertyName,
			loc;
		
		this._layer.eachLayer(function(layer) {

			if(layer instanceof SearchMarker) return;

			if(layer instanceof L.Marker)
			{
				if(that._getPath(layer.options,propName))
				{
					loc = layer.getLatLng();
					loc.layer = layer;
					retRecords[ that._getPath(layer.options,propName) ] = loc;			
					
				}else if(that._getPath(layer.feature.properties,propName)){

					loc = layer.getLatLng();
					loc.layer = layer;
					retRecords[ that._getPath(layer.feature.properties,propName) ] = loc;
					
				}else{
					// console.log("propertyName '"+propName+"' not found in marker", layer);
				}
			}
			else if(layer.hasOwnProperty('feature'))//GeoJSON layer
			{
				if(layer.feature.properties.hasOwnProperty(propName))
				{
					loc = layer.getBounds().getCenter();
					loc.layer = layer;			
					retRecords[ layer.feature.properties[propName] ] = loc;
				}
						
			}
			
		},this);
		
		return retRecords;
	},

	_autoType: function() {
		
		//TODO implements autype without selection(useful for mobile device)
		if (!this._tooltip.firstChild) return;
		
		var start = this._input.value.length,
			firstRecord = this._tooltip.firstChild._text,
			end = firstRecord.length;

		if (firstRecord.indexOf(this._input.value) === 0) { // If prefix match
			this._input.value = firstRecord;
			this._handleAutoresize();

			if (this._input.createTextRange) {
				var selRange = this._input.createTextRange();
				selRange.collapse(true);
				selRange.moveStart('character', start);
				selRange.moveEnd('character', end);
				selRange.select();
			}
			else if(this._input.setSelectionRange) {
				this._input.setSelectionRange(start, end);
			}
			else if(this._input.selectionStart) {
				this._input.selectionStart = start;
				this._input.selectionEnd = end;
			}
		}
	},

	_hideAutoType: function() {	// deselect text:

		var sel;
		if ((sel = this._input.selection) && sel.empty) {
			sel.empty();
		}
		else if (this._input.createTextRange) {
			sel = this._input.createTextRange();
			sel.collapse(true);
			var end = this._input.value.length;
			sel.moveStart('character', end);
			sel.moveEnd('character', end);
			sel.select();
		}
		else {
			if (this._input.getSelection) {
				this._input.getSelection().removeAllRanges();
			}
			this._input.selectionStart = this._input.selectionEnd;
		}
	},
	
	_handleKeypress: function (e) {	//run _input keyup event
		
		switch(e.keyCode)
		{
			case 27: //Esc
				this.collapse();
			break;
			case 13: //Enter
				// if (this._countertips == 1)
				// 	this._handleArrowSelect(1);
				if (!this._keypressed) {
					this._handleArrowSelect(1);
				}
				this._handleSubmit();	//do search
			break;
			case 38://Up
				this._handleArrowSelect(-1);
				this._keypressed = true;
			break;
			case 40://Down
				this._handleArrowSelect(1);
				this._keypressed = true;
			break;
			case 37://Left
			case 39://Right
			case 16://Shift
			case 17://Ctrl
			//case 32://Space
			break;
			case 8://backspace
			case 46://delete
				this._autoTypeTmp = false;//disable temporarily autoType
			break;
			default://All keys

				if(this._input.value.length)
					this._cancel.style.display = 'block';
				else
					this._cancel.style.display = 'none';

				if(this._input.value.length >= this.options.minLength)
				{
					var that = this;
					clearTimeout(this.timerKeypress);	//cancel last search request while type in				
					this.timerKeypress = setTimeout(function() {	//delay before request, for limit jsonp/ajax request

						that._fillRecordsCache();
					
					}, this.options.delayType);
				}
				else
					this._hideTooltip();
		}
	},
	
	_fillRecordsCache: function() {
		//TODO important optimization!!! always append data in this._recordsCache
		//  now _recordsCache content is emptied and replaced with new data founded
		//  always appending data on _recordsCache give the possibility of caching ajax, jsonp and layersearch!
		//
		//TODO here insert function that search inputText FIRST in _recordsCache keys and if not find results.. 
		//  run one of callbacks search(callData,jsonpUrl or options.layer) and run this.showTooltip
		//
		//TODO change structure of _recordsCache
		//	like this: _recordsCache = {"text-key1": {loc:[lat,lng], ..other attributes.. }, {"text-key2": {loc:[lat,lng]}...}, ...}
		//	in this mode every record can have a free structure of attributes, only 'loc' is required
	

		var inputText = this._input.value,
			that;
		
		L.DomUtil.addClass(this._container, 'search-load');

		if(this.options.callData)	//CUSTOM SEARCH CALLBACK
		{
			that = this;
			this.options.callData(inputText, function(jsonraw) {

				that._recordsCache = that._filterJSON(jsonraw);

				that.showTooltip();

				L.DomUtil.removeClass(that._container, 'search-load');
			});
		}
		else if(this.options.url)	//JSONP/AJAX REQUEST
		{
			if(this.options.jsonpParam)
			{
				that = this;
				this._recordsFromJsonp(inputText, function(data) {// is async request then it need callback
					that._recordsCache = data;
					that.showTooltip();
					L.DomUtil.removeClass(that._container, 'search-load');
				});
			}
			else
			{
				that = this;
				this._recordsFromAjax(inputText, function(data) {// is async request then it need callback
					that._recordsCache = data;
					that.showTooltip();
					L.DomUtil.removeClass(that._container, 'search-load');
				});
			}
		}
		else if(this.options.layer)	//SEARCH ELEMENTS IN PRELOADED LAYER
		{
			this._recordsCache = this._recordsFromLayer();	//fill table key,value from markers into layer				
			this.showTooltip();
			L.DomUtil.removeClass(this._container, 'search-load');
		}
	},
	
	_handleAutoresize: function() {	//autoresize this._input
	    //TODO refact _handleAutoresize now is not accurate
	    var map = this._map || app._map;
	    if (!map || !map._container) return;
	    
	    if (this._input.style.maxWidth != map._container.offsetWidth) //If maxWidth isn't the same as when first set, reset to current Map width
	        this._input.style.maxWidth = L.DomUtil.getStyle(map._container, 'width');

		if(this.options.autoResize && (this._container.offsetWidth + 45 < map._container.offsetWidth))
			this._input.size = this._input.value.length<this._inputMinSize ? this._inputMinSize : this._input.value.length;
	},

	_handleArrowSelect: function(velocity) {
	
		var searchTips = this._tooltip.hasChildNodes() ? this._tooltip.childNodes : [];
			
		for (i=0; i<searchTips.length; i++)
			L.DomUtil.removeClass(searchTips[i], 'search-tip-select');
		
		if ((velocity == 1 ) && (this._tooltip.currentSelection >= (searchTips.length - 1))) {// If at end of list.
			L.DomUtil.addClass(searchTips[this._tooltip.currentSelection], 'search-tip-select');
		}
		else if ((velocity == -1 ) && (this._tooltip.currentSelection <= 0)) { // Going back up to the search box.
			this._tooltip.currentSelection = -1;
		}
		else if (this._tooltip.style.display != 'none') { // regular up/down
			this._tooltip.currentSelection += velocity;
			
			L.DomUtil.addClass(searchTips[this._tooltip.currentSelection], 'search-tip-select');
			
			this._input.value = searchTips[this._tooltip.currentSelection]._text;

			// scroll:
			var tipOffsetTop = searchTips[this._tooltip.currentSelection].offsetTop;
			
			if (tipOffsetTop + searchTips[this._tooltip.currentSelection].clientHeight >= this._tooltip.scrollTop + this._tooltip.clientHeight) {
				this._tooltip.scrollTop = tipOffsetTop - this._tooltip.clientHeight + searchTips[this._tooltip.currentSelection].clientHeight;
			}
			else if (tipOffsetTop <= this._tooltip.scrollTop) {
				this._tooltip.scrollTop = tipOffsetTop;
			}
		}
	},

	_handleSubmit: function() {	//button and tooltip click and enter submit

		this._keypressed = false;
		this._hideAutoType();
		
		this.hideAlert();
		this._hideTooltip();

		if (this._input.style.display == 'none') {	//on first click show _input only
			this.expand();
		} else {
			if (this._input.value === '') {	//hide _input only
				this.collapse();
			} else {
				
				// var loc = this._getLocation(this._input.value); // returns L.latLng
				// console.log('loc: ', loc);

				var record = this._getRecord(this._input.value);
				

				// if (loc === false) {
				// 	this.showAlert();
				
				// } else {
				this._showLocation(record);

				this.fire('search_locationfound', {
					latlng: record.latlng,
					text: this._input.value,
					layer: null
				});
				// }

				//this.collapse();
				//FIXME if collapse in _handleSubmit hide _markerLoc!
			}
		}
	},

	_getRecord : function (key) {
		var record = _.filter(this._recordsCache, function (r) {
			if (!r) return false;
			return r.address == key;
		});

		return record[0];
	},

	_getLocation: function(key) {	//extract latlng from _recordsCache
		// console.log('sdds----!!!');

		var record = _.filter(this._recordsCache, function (r) {
			return r.address == key;
		});

		return record.latlng;

		if( this._recordsCache.hasOwnProperty(key) )
			return this._recordsCache[key];//then after use .loc attribute
		else
			return false;
	},

	_showLocation : function (record) {

		var latlng = record.latlng;
		var title = record.address;

		// console.log('_showLocation', record);
		
		return this.showLocation(latlng, title);

		// // bounding box
		// var southWest = L.latLng(record.boundingbox[0], record.boundingbox[2]);
		// var northEast = L.latLng(record.boundingbox[1], record.boundingbox[3]);

		// var bounds = L.latLngBounds(southWest, northEast);

		// if (this.options.box) {
		// 	console.log('BOX!!');
		// 	this._map.fitBounds(bounds, {
		// 		animate : true
		// 	});
		// }

		// if (this.options.autoCollapse) {
		// 	console.log('COLLAPSE!');
		// 	this.collapse();
		// }
		
		return this;

	},

	showLocation: function(latlng, title) {	//set location on map from _recordsCache
			

		if(this.options.zoom) {
			this._map.setView(latlng, this.options.zoom);
		} else {
			this._map.panTo(latlng);
		}

		if(this._markerLoc)
		{
			this._markerLoc.setLatLng(latlng);  //show circle/marker in location found
			this._markerLoc.setTitle(title);
			this._markerLoc.show();
			if(this.options.animateLocation)
				this._markerLoc.animate();
			//TODO showLocation: start animation after setView or panTo, maybe with map.on('moveend')...	
		}
		
		//FIXME autoCollapse option hide this._markerLoc before that visualized!!
		if (this.options.autoCollapse) {
			this.collapse();
		}

		return this;
	}
});

var SearchMarker = L.Marker.extend({

	includes: L.Mixin.Events,
	
	options: {
		radius: 10,
		weight: 3,
		color: 'rgb(255, 114, 114)',
		stroke: true,
		fill: false,
		title: '',
		icon: new L.Icon.Default(),
		showCircle: true,
		showMarker: false	//show icon optional, show only circleLoc
	},
	
	initialize: function (latlng, options) {
		L.setOptions(this, options);
		L.Marker.prototype.initialize.call(this, latlng, options);
		if(this.options.showCircle)
			this._circleLoc =  new L.CircleMarker(latlng, this.options);
	},

	onAdd: function (map) {
		L.Marker.prototype.onAdd.call(this, map);
		if(this._circleLoc)
			map.addLayer(this._circleLoc);
		this.hide();
	},

	onRemove: function (map) {
		L.Marker.prototype.onRemove.call(this, map);
		if(this._circleLoc)
			map.removeLayer(this._circleLoc);
	},	
	
	setLatLng: function (latlng) {
		L.Marker.prototype.setLatLng.call(this, latlng);
		if(this._circleLoc)
			this._circleLoc.setLatLng(latlng);
		return this;
	},
	
	setTitle: function(title) {
		title = title || '';
		this.options.title = title;
		if(this._icon)
			this._icon.title = title;
		return this;
	},

	show: function() {
		if(this.options.showMarker)
		{
			if(this._icon)
				this._icon.style.display = 'block';
			if(this._shadow)
				this._shadow.style.display = 'block';
			//this._bringToFront();
		}
		if(this._circleLoc)
		{
			this._circleLoc.setStyle({fill: this.options.fill, stroke: this.options.stroke});
			//this._circleLoc.bringToFront();
		}
		return this;
	},

	hide: function() {
		if(this._icon)
			this._icon.style.display = 'none';
		if(this._shadow)
			this._shadow.style.display = 'none';
		if(this._circleLoc)			
			this._circleLoc.setStyle({fill: false, stroke: false});
		return this;
	},

	animate: function() {
	//TODO refact animate() more smooth! like this: http://goo.gl/DDlRs
		if(this._circleLoc)
		{
			var circle = this._circleLoc,
				tInt = 200,	//time interval
				ss = 10,	//frames
				mr = parseInt(circle._radius/ss),
				oldrad = this.options.radius,
				newrad = circle._radius * 2.5,
				acc = 0;

			circle._timerAnimLoc = setInterval(function() {
				acc += 0.5;
				mr += acc;	//adding acceleration
				newrad -= mr;
				
				circle.setRadius(newrad);

				if(newrad<oldrad)
				{
					clearInterval(circle._timerAnimLoc);
					circle.setRadius(oldrad);//reset radius
					//if(typeof afterAnimCall == 'function')
						//afterAnimCall();
						//TODO use create event 'animateEnd' in SearchMarker 
				}
			}, tInt);
		}
		
		return this;
	}
});


L.control.geolocation = function (options) {
    return new L.Control.Geolocation(options);
};

}).call(this);
 // app.MapPane.layerMenu
L.Control.Layermenu = Wu.Control.extend({

	type : 'layermenu',

	options: {
		position : 'bottomright' 
		// position : 'bottomleft' 
	},

	onAdd : function (map) {

		this._innerContainer = Wu.DomUtil.create('div', 'leaflet-control-layermenu');

		// add html
		this._layermenuOuter 	= Wu.DomUtil.create('div', 'scroller-frame');
		var _innerScroller 	= Wu.DomUtil.create('div', 'inner-scroller', this._layermenuOuter);
		this._content 		= Wu.DomUtil.createId('div', 'layer-menu-inner-content', _innerScroller);

		this._bottomContainer = Wu.DomUtil.create('div', 'layers-bottom-container', this._layermenuOuter);

		this._innerContainer.appendChild(this._layermenuOuter);


		this._isOpen = true;
		this.registerTopButton();

		// add some divsscroller-frame
		this.initLayout();

		// stops
		Wu.DomEvent.on(this._innerContainer, 'mouseup', Wu.DomEvent.stop, this);

		// nb! content is not ready yet, cause not added to map! 
		return this._innerContainer;

	},

	registerTopButton : function () {


	        var top = app.Chrome.Top;

	        // add a button to top chrome
	        this._layerButton = top._registerButton({
	            name : 'layer',
	            className : 'chrome-button layer',
	            trigger : this.toggleLayerMenu,
	            context : this,
	            project_dependent : false
	        });

	        this._layerButton.innerHTML = '<i class="top-button fa fa-bars"></i> Layers';	        
	        

	},

	toggleLayerMenu : function () {
		this._isOpen ? this.close() : this.open();
	},

	open : function  () {
		this._isOpen = true;
		Wu.DomUtil.removeClass(this._innerContainer, 'displayNone');

		Wu.DomUtil.removeClass(this._layerButton, 'rounded-layer-button');
	}, 

	close : function () {
		this._isOpen = false;
		Wu.DomUtil.addClass(this._innerContainer, 'displayNone');

		Wu.DomUtil.addClass(this._layerButton, 'rounded-layer-button');
	},

	_addTo : function () {
		this.addTo(app._map);
		this._addHooks();
		this._added = true;
	},

	_flush : function () {
		this.layers = {};
		this._content.innerHTML = '';
	},

	_onLayerEdited : function (e) {

		var layer = e.detail.layer;
		this._refresh();
	},

	_refresh : function (hide) {

		// should be active
		if (!this._added) this._addTo();

		// if not active in project, hide
		if (!this._isActive()) return this._hide();

		// remove old content
		this._flush();

		// add new content		
		this._initContent();

		// show
		!hide && this._show();

		// close by default
		if (!this.editMode) this.closeAll();

		// Set max height
		// var dimensions = app._getDimensions();
		// this.resizeEvent(dimensions);

		if (this.editMode) this._forceOpen();



		// enable layers that are active by default
		// this._enableDefaultLayers();

	},

	_forceOpen : function () {

		Wu.DomUtil.removeClass(this._parentWrapper, 'displayNone');

	},

	_enableDefaultLayers : function () {
		for (var l in this.layers) {
			var layermenuItem = this.layers[l];
			if (layermenuItem.item.enabled) {
				this._enableDefaultLayer(layermenuItem);
			}
		}
	},

	// refresh for names etc, but keep active layers
	_refreshContent : function (hide) {
		this._refresh(hide);
		this._addAlreadyActive();
	},

	_isActive : function () {
		if (!this._project) return false;
		return this._project.getControls()[this.type];
	},

	_on : function () {
		this._refresh();
		this._addAlreadyActive();
	},

	_off : function () {
		this._hide();

	},

	initLayout : function () {	

		// Create the header    
		this._layerMenuHeader = Wu.DomUtil.createId('div', 'layer-menu-header');
		
		// Create the 'uncollapse' button ... will put in DOM l8r
		this._openLayers = Wu.DomUtil.createId('div', 'open-layers');
		this._openLayers.innerHTML = 'Layers';
		Wu.DomUtil.addClass(this._openLayers, 'leaflet-control ol-collapsed');

		// Append to DOM
		app._map._controlCorners.bottomright.appendChild(this._openLayers);

		// Store when the pane is open/closed ~ so that the legends container width can be calculated
		this._open = true;

		if (app.mobile) {
			// Mobile arrow	
		    	Wu.DomUtil.create('div', 'layers-mobile-arrow', this._innerContainer);
		}

	},

	_addHooks : function () {
		Wu.DomEvent.on(this._container, 'mouseenter', function () {
			app._map.scrollWheelZoom.disable();
		}, this);

		Wu.DomEvent.on(this._container, 'mouseleave', function () {
			app._map.scrollWheelZoom.enable();
		}, this);
	},

	_initContent : function () {
		this._fill();
	},

	_fill : function () {

		// Get parent wrapper
		this._parentWrapper = this._container.parentNode;

		// return if empty layermenu
		if (!this._project.store.layermenu || this._project.store.layermenu.length == 0 ) {

			// Hide parent wrapper if empty
			Wu.DomUtil.addClass(this._parentWrapper, 'displayNone');			

			return;
		}		

		// Show parent wrapper if not empty
		Wu.DomUtil.removeClass(this._parentWrapper, 'displayNone');

		// iterate layermenu array and fill in to layermenu
		this._project.store.layermenu.forEach(function (item) {

			// get wu layer
			var layer = this._project.layers[item.layer];

			var layerItem = {
				item  : item,
				layer : layer
			}

			// add to layermenu
			this._add(layerItem);

		}, this);

	},

	_addAlreadyActive : function () {
		var active = app.MapPane.getActiveLayers();
		var enabled = _.filter(this.layers, function (item) {
			if (!item.layer) return false;
			var uuid = item.layer.getUuid();
			var ison = _.find(active, function (a) {
				return a.getUuid() == uuid;
			})
			return ison;
		});

		enabled.forEach(function (e) {
			this._enableLayer(e.layer.getUuid());
		}, this);	
	},

	_show : function () {
		this._container.style.display = 'block';
	},

	_hide : function () {
		this._container.style.display = 'none';
	},

	show : function () {
		if (!this._container) return;
		this._isActive() ? this._show() : this._hide();
	},

	hide : function () {
		if (!this._container) return;
		this._hide();
	},


	// Runs on window resize. Gets called up in app.js
	// resizeEvent : function (dimensions) {

	// 	// Window max height (minus padding)
	// 	var layersMaxHeight = dimensions.height - 135;

	// 	// Set max height of Layers selector container
	// 	this.setMaxHeight(layersMaxHeight);
	// },


	// setMaxHeight : function (layersMaxHeight) {

	// 	var layersMaxHeight = layersMaxHeight || window.innerHeight - 135;

	// 	// Make space for inspect control, if it's there, yo
	// 	var inspectControl = app.MapPane.getControls().inspect;
		
	// 	if (inspectControl) {

	// 		var inspectorHeight = inspectControl._container.offsetHeight;

	// 		layersMaxHeight -= inspectorHeight - 5;
	// 	}

	// 	// Set max height of scroller container
	// 	this._layermenuOuter.style.maxHeight = layersMaxHeight + 'px';

	// 	// set new height for relative wrapper
	// 	this._setHeight();
	// },	

	// _setHeight : function (extra) {
		
	// },

	_getOpenItems : function () {
		var childNodes = this._content.childNodes;
		var open = _.filter(childNodes, function (c) {
			var closed = _.contains(c.classList, 'layeritem-closed');
			return !closed;
		});
		return open.length;
	},

	cancelEditClose : function () {
		if (!this.editMode) return;

		// cancel close initiated from sidepane layermeny mouseleave
		var timer = app.SidePane.Options.settings.layermenu.closeEditTimer;
		clearTimeout(timer);
		setTimeout(function () {  // bit hacky, but due to 300ms _close delay in sidepane
			var timer = app.SidePane.Options.settings.layermenu.closeEditTimer;
			clearTimeout(timer);
		}, 301);
	},

	timedEditClose : function () {
		if (!this.editMode) return;

		// close after three seconds after mouseleave
		var that = this;
		var timer = app.SidePane.Options.settings.layermenu.closeEditTimer = setTimeout(function () {
			that.disableEdit();
		}, 3000);
	},

	_GAtoggleLayerPane : function () {

		// Google Analytics event tracking
		app.Analytics.setGaEvent(['Controls', 'Layers: toggle open/close']);		

		// Fire toggle function
		this.toggleLayerPane();

	},

	toggleLayerPane : function () {
		this._open ? this.closeLayerPane() : this.openLayerPane();
	},

	_GAcloseLayerPane : function () {

		// Google Analytics event tracking
		app.Analytics.setGaEvent(['Controls', 'Layers: close']);

		// Fire close layer pane function
		this.closeLayerPane();
	},

	closeLayerPane : function () {
		this._open = false;
		Wu.DomUtil.addClass(this._innerContainer, 'closed');
	},

	openLayerPane : function () {
		this._open = true;
		Wu.DomUtil.removeClass(this._innerContainer, 'closed');
	},

	enableEditSwitch : function () {

		// Make container visible
		Wu.DomUtil.removeClass(this._parentWrapper, 'displayNone');		

		// open all items in layermenu
		this.openAll();	

		if ( !this._editSwitchContainer ) {
			
			this._editSwitchContainer = Wu.DomUtil.create('div', 'enable-edit-switch-container-outer', this._innerContainer);
			var editSwitchContainerInner = Wu.DomUtil.create('div', 'enable-edit-switch-container-inner', this._editSwitchContainer);
			var editSwitchTitle = Wu.DomUtil.create('div', 'enable-edit-switch-title', editSwitchContainerInner, 'Edit layer menu');

			this.editSwitch = new Wu.button({
				id 	  : 'editSwitch',
				type 	  : 'switch',
				isOn 	  : false,
				right 	  : true,
				appendTo  : editSwitchContainerInner,
				fn        : this._enableEditing.bind(this),
				className : 'edit-layers-switch'
			});

		} else {

			Wu.DomUtil.removeClass(this._editSwitchContainer, 'displayNone');

		}

		Wu.DomUtil.addClass(this._innerContainer, 'enable-edit-mode');


	},

	disableEditSwitch : function () {
		if (!this._editSwitchContainer) return;

		this._editSwitchContainer.innerHTML = '';
		this._editSwitchContainer.remove();
		this._editSwitchContainer = null;

		Wu.DomUtil.removeClass(this._innerContainer, 'enable-edit-mode');
		
		this.disableEdit();

		if (this._isEmpty()) {
			
			// Hide parent wrapper if empty
			Wu.DomUtil.addClass(this._parentWrapper, 'displayNone');
		}
	},


	_enableEditing : function (e, on) {
		on ? this.enableEdit() : this.disableEdit();
	},

	// enter edit mode of layermenu
	enableEdit : function () {

		// PØLSE

		if (this.editMode) return;

		// Make container visible
		Wu.DomUtil.removeClass(this._parentWrapper, 'displayNone');

		// set editMode
		this.editMode = true;

		// turn off dropzone dragging
		app.Data.disableUploader();

		// Set attribute draggable to true on all divs
		this.enableDraggable();
		
		// enable drag'n drop in layermenu
		this.enableSortable();

		// add edit style
		Wu.DomUtil.addClass(this._innerContainer, 'edit-mode');

		// add the drag'n drop new folder
		this._insertMenuFolder();

		// open all items in layermenu
		this.openAll();

	},

	_isEmpty : function () {
		return (!this._project.store.layermenu || this._project.store.layermenu.length == 0 );
	},

	// exit edit mode 
	disableEdit : function () {

		if (!this.editMode) return;

		if (this._isEmpty()) {
			
			// Hide parent wrapper if empty
			Wu.DomUtil.addClass(this._parentWrapper, 'displayNone');
		}		

		// set editMode
		this.editMode = false;
		
		// turn off dropzone dragging
		app.Data.enableUploader();

		// Set attribute draggable to true on all divs
		this.disableDraggable();		
		
		// disable layermenu sorting
		this.disableSortable();


		// xoxoxoxoxo
		// remove edit style
		Wu.DomUtil.removeClass(this._innerContainer, 'edit-mode');

		// remove new drag'n drop folder
		this._removeMenuFolder();

		// Set max height
		// var dimensions = app._getDimensions();
		// this.resizeEvent(dimensions);	

		// this._setHeight();	
		
	},
	

	_insertMenuFolder : function () {
		
		// add menu folder item
		if (!this._menuFolder) {

			// create if not exists
			this._menuFolder = Wu.DomUtil.create('div', 'smap-button-white middle-item', this._bottomContainer, 'Add folder');
			
			// add action
			Wu.DomEvent.on(this._menuFolder, 'click', this.addMenuFolder, this);

		} else {
			// show
			Wu.DomUtil.removeClass(this._menuFolder, 'displayNone');
			Wu.DomUtil.removeClass(this._editSwitchContainer, 'displayNone')
		}

	},


	_removeMenuFolder : function () {
		if (!this._menuFolder) return;
		Wu.DomUtil.addClass(this._menuFolder, 'displayNone');
	},

	enableSortable : function () {
		this.initSortable();
	},

	disableSortable : function () {
		if (this._sortingEnabled) this.resetSortable();
	},

	refreshSortable : function () {
		if (this._sortingEnabled) this.resetSortable();  
		this.initSortable();
	},

	initSortable : function () {

		// console.log('this.project', this.project);
		// console.log('this._project', this._project);

		if (!this._project.isEditor()) return;
		this._sortingEnabled = true;

		// iterate over all layers
		var items = document.getElementsByClassName('layer-menu-item-wrap');
		for (var i = 0; i < items.length; i++) {
			var el = items[i];

			// set dragstart event
			Wu.DomEvent.on(el, 'dragstart', this.drag.start, this);
		};

		// set hooks
		var bin = this._content;
		if (!bin) return;
		Wu.DomEvent.on(bin, 'dragover',  this.drag.over,  this);
		Wu.DomEvent.on(bin, 'dragleave', this.drag.leave, this);
		Wu.DomEvent.on(bin, 'drop', 	 this.drag.drop,  this);

	},

	resetSortable : function () {
		this._sortingEnabled = false;

		// remove hooks
		var bin = this._content;
		if (!bin) return;
		Wu.DomEvent.off(bin, 'dragover',  this.drag.over,  this);
		Wu.DomEvent.off(bin, 'dragleave', this.drag.leave, this);
		Wu.DomEvent.off(bin, 'drop', 	  this.drag.drop,  this);
	},


	enableDraggable : function () {

		// iterate over all layers
		var items = document.getElementsByClassName('layer-menu-item-wrap');
		for (var i = 0; i < items.length; i++) {
			var el = items[i];
			
			// set attrs
			el.setAttribute('draggable', true);
		};
	},

	disableDraggable : function () {
		
		// iterate over all layers
		var items = document.getElementsByClassName('layer-menu-item-wrap');
		for (var i = 0; i < items.length; i++) {
			var el = items[i];
			
			// set attrs
			el.setAttribute('draggable', false);
		};		
	},

	
	// dragging of layers to layermenu
	drag : {

		start : function (e) {
			var el = e.target;
			
			// add visual feedback on dragged element
			Wu.DomUtil.addClass(el, 'dragged-ghost');

			var uuid = el.id;
			this.drag.currentDragElement = el;
			this.drag.currentDragUuid = uuid;
			this.drag.startDragLevel = this.layers[uuid].item.pos;
			
			e.dataTransfer.setData('uuid', uuid); // set *something* required otherwise doesn't work

			return false;
		},

		drop : function (e) {
			
			var uuid = e.dataTransfer.getData('uuid');
			var el = document.getElementById(uuid);

			// remove visual feedback on dragged element
			Wu.DomUtil.removeClass(el, 'dragged-ghost');

			// get new position in layermenu array
			var nodeList = Array.prototype.slice.call(this._content.childNodes);
			
			var newIndex = nodeList.indexOf(el);
			var oldIndex = _.findIndex(this._project.store.layermenu, {uuid : uuid});
			
			// move in layermenu array
			this._project.store.layermenu.move(oldIndex, newIndex);

			// save
			this.save();

			// reset
			this.drag.currentDragElement = null;
			this.drag.currentDragLevel = null;
			this.movingX = false;

			return false; // irrelevant probably
		},

		over : function (e) {
			if (e.preventDefault) e.preventDefault(); // allows us to drop

			// set first offset
			if (!this.movingX) this.movingX = e.layerX;
			
			// calculate offset
			var offsetX = e.layerX - this.movingX;

			return false;
		},

		leave : function (e) {
			
			// get element over which we're hovering
			var x = e.clientX;
			var y = e.clientY;
			var target = document.elementFromPoint(x, y);
			var element = this.drag.currentDragElement;

			// return if not layerItem
			var type = target.getAttribute('type');
			if (type != 'layerItem') return;

			// move element
			this.drag.moveElementNextTo(element, target);

			return false;
		},

		moveElementNextTo : function (element, elementToMoveNextTo) {
			elementToMoveNextTo = elementToMoveNextTo.parentNode;
			if (this.isBelow(element, elementToMoveNextTo)) {
				// Insert element before to elementToMoveNextTo.
				elementToMoveNextTo.parentNode.insertBefore(element, elementToMoveNextTo);
			}
			else {
				// Insert element after to elementToMoveNextTo.
				elementToMoveNextTo.parentNode.insertBefore(element, elementToMoveNextTo.nextSibling);
			}

		},

		isBelow : function (el1, el2) {
			var parent = el1.parentNode;
			if (el2.parentNode != parent) return false;
			var cur = el1.previousSibling;
			while (cur && cur.nodeType !== 9) {
				if (cur === el2) return true;
				cur = cur.previousSibling;
			}
			return false;
		},

	},

	_isFolder : function (item) {
		var layer = this.layers[item.uuid];
		if (layer.layer) return false;
		return true;
	},

	markInvalid : function (invalids) {
		invalids.forEach(function (invalid) {

			// get div
			var div = this.layers[invalid.uuid].el;
			Wu.DomUtil.addClass(div, 'invalidLayermenuitem');

		}, this)
	},

	clearInvalid : function () {
		for (var l in this.layers) {
			var layer = this.layers[l];
			Wu.DomUtil.removeClass(layer.el, 'invalidLayermenuitem');
		}
	},

	// check logic
	checkLogic : function () {

		// clear prev invalids
		this.clearInvalid();

		// vars
		var array = this._project.store.layermenu;
		var invalid = [];

		// iterate each layermenuitem
		array.forEach(function (item, i, arr) {

			// rule #1: first item must be at pos 0;
			if (i==0) {
				if (item.pos != 0) {
					return invalid.push(item); // must be 
				}
				return invalid;
			} 

			// rule #2: if item is folder, then it must be at same or lower level than previous (not higher)
			if (item.folder) {	
				var thislevel = item.pos;
				var prevlevel = arr[i-1].pos;
				if (thislevel > prevlevel) {
					return invalid.push(item);
				}
			}

			// rule #3: if item is deeper than previous, previous must be a folder
			var thislevel = parseInt(item.pos);
			var prevlevel = parseInt(arr[i-1].pos);
			if (thislevel > prevlevel) {
				if (!arr[i-1].folder) {
					return invalid.push(item);
				}
			}

			// rule #4: if item is deeper than previous, must not be more than one level difference
			if (parseInt(thislevel) > (parseInt(prevlevel + 1))) {
				return invalid.push(item);
			}

		}, this);

		// mark invalid items
		this.markInvalid(invalid);

		// return
		return invalid;

	},

	updateLogic : function () {

		// get vars
		var array = this._project.store.layermenu;
		this._logic = this._logic || {};

		// create logic from array
		array.forEach(function (item1, i) {
			// return if not a folder
			if (!this._isFolder(item1)) return;

			var pos 	= item1.pos; 	// eg 0 for first level
			var toClose 	= []; 		// all below this pos
			var toOpen 	= []; 		// all div's to be opened (all on one level below, not more)
			var ready 	= false;

			// fill toClose with all items until hits next item on same level (eg. 0)
			_.each(array, function(item2, i) {

				// hit self, start on next iteration
				if (item1.uuid == item2.uuid) ready = true; 
				
				if (ready) {

					if (parseInt(item2.pos) > parseInt(pos)) {
						var div = this.layers[item2.uuid].el;
						toClose.push(div);
					}

					// break iteration on condition
					if (parseInt(item2.pos) == parseInt(pos) && item1.uuid != item2.uuid) return false; 
				}

			}, this);

			ready = false;
			
			// fill toOpen with all elements on +1 level
			_.each(array, function (item3, i) {

				if (ready) {

					if (parseInt(item3.pos) == parseInt(pos) + 1) {
						var div = this.layers[item3.uuid].el;
						toOpen.push(div);
					}
				
					if (parseInt(item3.pos) == parseInt(pos)) return false;
				}

				if (item1.uuid == item3.uuid) ready = true; // hit self, start on next iteration

			}, this);


			// keep isOpen value
			if (this._logic[item1.uuid]) {
				var isOpen = this._logic[item1.uuid].isOpen || false;
			} else {
				var isOpen = true;
			}
			
			// save logic
			this._logic[item1.uuid] = {
				toOpen  : toOpen,   // div's to be closed (all below)
				toClose : toClose,  // div's to be opened (all on first level, but not further level folders and contents)
				isOpen  : isOpen
			}

		}, this);


	},

	enforceLogic : function (layerItem) {
		var uuid = layerItem.item.uuid;
		var item = this._logic[uuid];
		
		// close	
		if (item.isOpen) {
			var panes = item.toClose;

			// add classes
			panes.forEach(function (pane) {
				Wu.DomUtil.addClass(pane, 'layeritem-closed')
				Wu.DomUtil.removeClass(pane, 'layeritem-open');

				// mark closed folder as closed
				var id = pane.id;
				if (this._logic[id] && this._logic[id].isOpen) this._logic[id].isOpen = false;

			}, this);

			// mark closed
			this._logic[uuid].isOpen = false;

		// open
		} else {
			var panes = item.toOpen;

			// add classes
			panes.forEach(function (pane) {
				Wu.DomUtil.removeClass(pane, 'layeritem-closed')
				Wu.DomUtil.addClass(pane, 'layeritem-open');
			}, this);

			// mark open
			this._logic[uuid].isOpen = true;
		}

		// this._setHeight();
	},

	closeAll : function () {


		this.updateLogic();
		for (var l in this._logic) {
			var item = this.layers[l];
			if (item) {
				this._logic[l].isOpen = true;
				this.enforceLogic(item);
			}
		}
	},

	openAll : function () {
		this.updateLogic();
		for (var l in this._logic) {
			var item = this.layers[l];
			if (item) {
				this._logic[l].isOpen = false;
				this.enforceLogic(item);
			}
		}
	},

	// open/close subfolders
	toggleFolder : function (layerItem) {
		this.updateLogic();	
		this.enforceLogic(layerItem);
	},

	toggleLayer : function (item) {
		if (this.editMode) return;

		var layer = item.layer;
		var _layerName = layer ? layer.getTitle() : 'Folder';

		// toggle
		if (item.on) {
			this.disableLayer(item);
		} else {
			this.enableLayer(item);

			// fire event
			Wu.Mixin.Events.fire('layerSelected', { detail : {
				layer : layer
			}}); 
		}    
	},

	_enableLayer : function (layerUuid) {

		// get layerItem
		var layerItem = _.find(this.layers, function (l) {
			return l.item.layer == layerUuid;
		});
		
		if (!layerItem) return console.error('no layer');
		
		// mark active
		Wu.DomUtil.addClass(layerItem.el, 'layer-active');
		layerItem.on = true;
	},
	
	_enableDefaultLayer : function (layer) {
		this.enableLayer(layer);
	},

	_enableLayerByUuid : function (layerUuid) {
		var item = this._getLayermenuItem(layerUuid);
		if (item) this.enableLayer(item);
	},

	enableLayer : function (layerItem) {
		var layer = layerItem.layer;

		// folder click
		if (!layer) return this.toggleFolder(layerItem); 
			
		// add layer to map
		layer.add();
		layerItem.on = true;

		// Make room for Layer inspector
		// var dimensions = app._getDimensions();
		// this.resizeEvent(dimensions);

		// add active class
		Wu.DomUtil.addClass(layerItem.el, 'layer-active');

		app.Chrome.Right.options.editingLayer = layer.getUuid();

		// fire event
		Wu.Mixin.Events.fire('layerEnabled', { detail : {
			layer : layer
		}}); 

	},

	// disable by layermenuItem
	disableLayer : function (layermenuItem) {


		var layer = layermenuItem.layer;
		if (!layer) return;	

		this._disableLayer(layer);

		// Make room for Layer inspector
		// var dimensions = app._getDimensions();
		// this.resizeEvent(dimensions);		

		app.Chrome.Right.options.editingLayer = false;

		// fire event
		Wu.Mixin.Events.fire('layerDisabled', { detail : {
			layer : layer
		}}); 
	},

	// disable by layer
	_disableLayer : function (layer) {

		// get layermenuItem
		var layermenuItem = this._getLayermenuItem(layer.store.uuid);
		
		// remove layer
		layer.remove();
		layermenuItem.on = false;

		// remove active class
		Wu.DomUtil.removeClass(layermenuItem.el, 'layer-active');
	},


	_getLayermenuItem : function (layerUuid) {
		var layermenuItem = _.find(this.layers, function (l) { return l.item.layer == layerUuid; });
		return layermenuItem;
	},

	_getActiveLayers : function () {
		var active = _.filter(this.layers, function (layer) {
			return layer.on;
		});
		return active;
	},

	// layer deleted from project, remove layermenuitem
	onDelete : function (layer) {
		if (!layer) return console.error('No layer!');
		var uuid = layer.getUuid();
		var layermenuItem = this._getLayermenuItem(uuid);

		// remove from dom in layermenu
		if (layermenuItem) {
			var elem = layermenuItem.el;
			if (elem) elem.parentNode.removeChild(elem);
		}
	},

	// turn off a layer from options
	remove : function (uuid) {				// todo: clean up layers vs layermenuitems, see _getLayermenuItem above
		
		// get layermenuItem
		var layermenuItem = this.layers[uuid];

		// remove from DOM
		var elem = layermenuItem.el;
		if (elem) elem.parentNode.removeChild(elem);

		// remove layer from map
		var layer = layermenuItem.layer;
		if (layer) layer.remove();

		// remove from store
		delete this.layers[uuid];

		// remove from layermenu
		_.remove(this._project.store.layermenu, function (item) { return item.uuid == uuid; });

		// save
		this.save();

	},

	removeLayermenuItem : function () {

	},

	removeLayer : function (layerUuid) {

	},

	// remove initiated from sidepane
	_remove : function (uuid) {
		// find layermenuItem uuid
		var layermenuItem = this._getLayermenuItem(uuid); // uuid: layer-q2e321-qweeqw-dasdas
		this.remove(layermenuItem.item.uuid);
	},

	// add from sidepane
	add : function (layer) {
		
		// create db item
		var item = {
			uuid 	: 'layerMenuItem-' + Wu.Util.guid(), // layermenu item uuid
			layer   : layer.store.uuid, // layer uuid or _id
			caption : layer.store.title, // caption/title in layermenu
			pos     : 0, // position in menu
			zIndex  : 1,
			opacity : 1,
		}

		var layerItem = {
			item  : item,
			layer : layer
		}

		// add
		this._add(layerItem);

		// save
		this._project.store.layermenu.push(item); // refactor
		this.save();

		// this._setHeight();

	},

	_add : function (layerItem) {	

		var item  = layerItem.item;
		var layer = layerItem.layer;

		var caption = layer && layer.getTitle ? layer.getTitle() : item.caption;

		// create div
		var className  = 'layer-menu-item-wrap';

		// add if folder
		if (!layer) className += ' menufolder';
		
		// more classes
		className += ' level-' + item.pos;

		// add wrap
		var uuid = item.uuid;
		var wrap = Wu.DomUtil.create('div', className, this._content);
		wrap.id = uuid;

		// mark as draggable if we're in editing mode
		if (this.editMode) { 
			wrap.setAttribute('draggable', true) 
		} else { 
			wrap.setAttribute('draggable', false); 
		}		    


		// var layerItemMoversWrap = Wu.DomUtil.create('div', 'layer-item-movers-wrap', wrap);
		var up = Wu.DomUtil.create('div', 'layer-item-up', wrap);
		var down = Wu.DomUtil.create('div', 'layer-item-down', wrap);
		
		if (!layer) {
			// create delete button only on folder
			var del = Wu.DomUtil.create('div', 'layer-item-delete', wrap);
		}

		if (layer) {
			var layerItemFlyTo = Wu.DomUtil.createId('div', 'layer-flyto-' + layer.getUuid(), wrap);
		    	layerItemFlyTo.className = 'layer-menu-flyto';
		    	layerItemFlyTo.innerHTML = '<i class="fa fa-search fly-to"></i>';
		}

		var inner = Wu.DomUtil.create('div', 'layer-menu-item', wrap);
		inner.setAttribute('type', 'layerItem');
		inner.innerHTML = caption;


		// add hooks
		Wu.DomEvent.on(up,   'click', function (e) { this.upFolder(uuid); 	  }, this);
		Wu.DomEvent.on(down, 'click', function (e) { this.downFolder(uuid); 	  }, this);
		
		if (!layer) { // folder
			Wu.DomEvent.on(inner, 'dblclick', function (e) { this._editFolderTitle(uuid); },this);
			Wu.DomEvent.on(del,  'click', function (e) { this.deleteMenuFolder(uuid); }, this);
			Wu.DomEvent.on(del,  'mousedown', Wu.DomEvent.stop, this);
		}

		// prevent layer activation
		Wu.DomEvent.on(up,   'mousedown', Wu.DomEvent.stop, this);
		Wu.DomEvent.on(down, 'mousedown', Wu.DomEvent.stop, this);

		// drag
		// set dragstart event
		Wu.DomEvent.on(wrap, 'dragstart', this.drag.start, this);

		// Stop Propagation
		Wu.DomEvent.on(this._container, 'touchstart mousedown click dblclick',  Wu.DomEvent.stopPropagation, this);

		// add elem to item object
		layerItem.el = wrap;

		// add hooks // pass item object to toggle
		Wu.DomEvent.on(wrap, 'mousedown', function (e) { this.toggleLayer(layerItem); }, this);
		Wu.DomEvent.on(this._innerContainer, 'dblclick', Wu.DomEvent.stop, this);

		// trigger on flyto on layer
		if (layer) {
			var flyto = Wu.DomUtil.get('layer-flyto-' + layer.getUuid());
			Wu.DomEvent.on(flyto, 'mousedown', function (e) {
				Wu.DomEvent.stop(e);
				layer.flyTo();
			}, this);
		}

		// add to local store
		this.layers[item.uuid] = layerItem;
	},

	getLayers : function () {
		return this.layers;
	},
	
	addMenuFolder : function () {
		this.addFolder();		// todo: remove
	},

	_addMenuFolder : function () {
		this._addFolder();		// todo: remove
	},

	addFolder : function () {

		var folder = {
			uuid : 'layerMenuItem-' + Wu.Util.guid(), // unique id for layermenu item
			caption : 'New folder',
			pos : 0,
			folder : true
		}

		var layerItem = {
			item : folder, 
			layer : false
		}

		// this._addFolder(folder);
		this._add(layerItem);

		// save to server
		this._project.store.layermenu.push(folder);
		this.save();

		// this._setHeight();

	},

	_editFolderTitle : function (uuid) {
		if (!this.editMode || this.currentlyEditing) return;

		this.currentlyEditing = true;

		var layerItem = this.layers[uuid];
		var folder = layerItem.el.children[3];

		// inject <input>
		var title = folder.innerHTML;
		folder.innerHTML = '';
		var input = Wu.DomUtil.create('input', 'layer-item-title-input');
		input.value = title;
		folder.appendChild(input);

		// focus
		input.focus();

		// add blur hook
		Wu.DomEvent.on(input, 'blur', function () {
			
			// remove
			var newTitle = input.value;
			Wu.DomUtil.remove(input);
			folder.innerHTML = newTitle;
			
			// save
			var i = _.findIndex(this._project.store.layermenu, {'uuid' : uuid});
			this._project.store.layermenu[i].caption = newTitle;
			this.save();

			var layerUuid = this._project.store.layermenu[i].layer;
			var layer = this._project.getLayer(layerUuid);
			var file = layer ? layer.getFile() : false;

			// update file and layer models
			file && file.setName(newTitle);
			layer && layer.setTitle(newTitle);

			// update controls
			this._updateControls();

			// boolean
			this.currentlyEditing = false;

		}, this);

		// add keyp hooks
		Wu.DomEvent.on(input, 'keydown', function (e) {
			if (event.which == 13 || event.keyCode == 13) input.blur(); // enter
			if (event.which == 27 || event.keyCode == 27) input.blur(); // esc
		}, this);

	},

	_updateControls : function () {
		
		// update layermenu
		var lm = app.MapPane._controls.layermenu;
		lm && lm._refresh(true);

		var insp = app.MapPane._controls.inspect;
		insp && insp._refresh(true);

		var leg = app.MapPane._controls.legends;
		leg && leg._refresh(true);

	},


	upFolder : function (uuid) {

		// get element
		var wrap = this.layers[uuid].el;

		// get current x pos
		var i   = _.findIndex(this._project.store.layermenu, {'uuid' : uuid});
		var pos = parseInt(this._project.store.layermenu[i].pos);

		// set new pos
		var newpos = pos + 1;
		this._project.store.layermenu[i].pos = newpos;

		// add class
		Wu.DomUtil.addClass(wrap, 'level-' + newpos);
		Wu.DomUtil.removeClass(wrap, 'level-' + pos);

		// save
		this.save();
	},

	downFolder : function (uuid) {	// refactor, same as upFolder

		// get element
		var wrap = this.layers[uuid].el;

		// get current x pos
		var i   = _.findIndex(this._project.store.layermenu, {'uuid' : uuid});
		var pos = parseInt(this._project.store.layermenu[i].pos);

		// set new pos
		var newpos = pos - 1;

		// dont allow below 0
		if (newpos < 0) newpos = 0;

		this._project.store.layermenu[i].pos = newpos;

		// add class
		Wu.DomUtil.addClass(wrap, 'level-' + newpos);
		Wu.DomUtil.removeClass(wrap, 'level-' + pos);

		// save
		this.save();

	},

	deleteMenuFolder : function (uuid) {
		// remove
		this.remove(uuid); // layerMenuItem-32132-123123-adsdsa-sda

		// Hides layer button if there are no layers to show
		app.Chrome.Top._showHideLayerButton();

		// this._setHeight();
	},


	save : function () {
		var that = this;

		// check if valid logic
		var invalid = this.checkLogic();
		if (invalid.length) return console.error('not valid layermenu!', invalid);

		// clear timer
		if (this.saveTimer) clearTimeout(this.saveTimer);

		// save on timeout
		this.saveTimer = setTimeout(function () {
			that._project._update('layermenu');
		}, 1000);       // don't save more than every goddamed second

	},

	
	_setEnabledOnInit : function (layer_id, onoff) {

		var l = this._project.store.layermenu;
		var i = -1;

		l.forEach(function (item, n) {
			if (item.layer == layer_id) i = n;
		});

		// err
		if (i < 0) return console.error('couldnt save');

		// save
		this._project.store.layermenu[i].enabled = onoff;
		this.save();
	},


});

L.control.layermenu = function (options) {
	return new L.Control.Layermenu(options);
};

// app.MapPane._controls.description
L.Control.Description = Wu.Control.extend({
	
	type : 'description',

	options: {
		position : 'bottomright' 
	},

	onAdd : function (map) {

		var className = 'leaflet-control-description',
		    container = L.DomUtil.create('div', className),
		    options   = this.options;

		// Wrapper for multiple layers
		this._multipleLegendOuter = Wu.DomUtil.create('div', 'description-multiple-toggle-wrapper', container);
		this._multipleLegendInner = Wu.DomUtil.create('div', '', this._multipleLegendOuter);

		this._content = Wu.DomUtil.create('div', 'description-control-content', container);

		this._outer = Wu.DomUtil.create('div', 'description-control-content-box', this._content);
	

		return container; // turns into this._container on return
	},

	_initContainer : function () {          

		// hide by default
		this._container.style.display = "none";

		// create scroller 
		this._inner = Wu.DomUtil.create('div', 'description-control-inner', this._outer);

		// header
		this._header = Wu.DomUtil.create('div', 'description-control-header-section', this._inner);

		this._toggle = Wu.DomUtil.create('div', 'description-control-header-toggle', this._multipleLegendOuter);		

		// description
		this._description = Wu.DomUtil.create('div', 'description-control-description displayNone', this._inner);

		// meta
		this._metaContainer = Wu.DomUtil.create('div', 'description-control-meta-container', this._inner);		

		// init satellite path container
		this.satelliteAngle = new Wu.satteliteAngle({angle : false, path: false, appendTo : this._inner});

		// legend
		this._legendContainer = Wu.DomUtil.create('div', 'description-control-legend-container', this._inner);

		// copyright
		this._copyright = Wu.DomUtil.create('div', 'description-copyright', this._outer, '');
		
		// add tooltip
		app.Tooltip.add(this._container, 'Shows layer information', { extends : 'systyle', tipJoint : 'left' });
			       

		// add event hooks
		this._addHooks();
	},

	_addHooks : function () {
		
		// collapsers
		Wu.DomEvent.on(this._toggle, 'click', this.toggle, this);	
	
		// prevent map double clicks
		Wu.DomEvent.on(this._container, 'mousedown click dblclick',  Wu.DomEvent.stopPropagation, this);
	},
	
	_isActive : function () {
		if (!this._project) return false;
		return this._project.getControls()[this.type];
	},

	show : function () {
		if (!this._container) return;
		this._isActive() ? this._show() : this._hide();
		this.toggleScale(true);
	},

	hide : function () {
		if (!this._container) return;
		this._hide();
	},

	_show : function () {
		this.refresh();
	},

	refresh : function () {
		this.showHide();
	},

	showHide : function () {

		// Hide if empty
		if ( !this.layers || this.isEmpty(this.layers) ) {
			this._hide();
			return;
		}

		this._container.style.display = 'block';
		this.isOpen = true;
	},

	_hide : function () {	
		this._container.style.display = 'none'; 
		this.isOpen = false;

		this.toggleScale(false);
	},

	_flush : function () {
		this.layers = {};
		this._clear();
	},

	_clear : function () {
		this.isOpen = false;
		this.toggleScale(false);
	},

	_refresh : function () {

		// should be active
		if (!this._added) this._addTo();

		// get control active setting from project
		var active = this._project.getControls()[this.type];

		// if not active in project, hide
		if (!active) return this._hide();

		// remove old content
		this._flush();

		// show
		this._show();

	},

	_onLayerStyleEdited   : function (e) {
		var layer = e.detail.layer;
		this._refreshLayer(layer);
	},

	_addTo : function () {
		this.addTo(app._map);
		this._initContainer();
		this._addHooks();
		this._added = true;
	},	

	_refreshLayer : function (layer) {

		// get layer
		this.layers[layer.getUuid()] = layer;

		this.setHTMLfromStore(layer.getUuid());
		this.updateMultiple(layer.getUuid());
	},

	toggle : function () {
		if ( !this.isCollapsed ) this.isCollapsed = false;
		this.isCollapsed ? this.toggleOpen() : this.toggleClose();
	},

	toggleOpen : function () {

		this.isCollapsed = false;

		Wu.DomUtil.removeClass(this._legendContainer, 'minimized');
		Wu.DomUtil.removeClass(this._header, 'minimized');		

		var description = this._description.innerHTML;
		if (description && description != '') Wu.DomUtil.removeClass(this._description, 'displayNone');
		
		Wu.DomUtil.removeClass(this._metaContainer, 'displayNone');
		Wu.DomUtil.removeClass(this._toggle, 'legend-toggle-open');


		if ( !this.satelliteAngle.closed ) Wu.DomUtil.removeClass(this.satelliteAngle._innerContainer, 'displayNone');
	},

	toggleClose : function () {

		this.isCollapsed = true;

		Wu.DomUtil.addClass(this._legendContainer, 'minimized');
		Wu.DomUtil.addClass(this._header, 'minimized');

		Wu.DomUtil.addClass(this._description, 'displayNone');
		Wu.DomUtil.addClass(this._metaContainer, 'displayNone');		
		Wu.DomUtil.addClass(this._toggle, 'legend-toggle-open');


		Wu.DomUtil.addClass(this.satelliteAngle._innerContainer, 'displayNone');
	},

	_addLayer : function (layer) {

		this.layers = this.layers || {};

		var layerUuid = layer.getUuid();
		this.layers[layerUuid] = layer;

		this.setHTMLfromStore(layerUuid);

		// For multiple layers
		this.updateMultiple(layerUuid);
	},

	_removeLayer : function (layer) {

		// Delete layer from store
		var layerUuid = layer.getUuid();
		delete this.layers[layerUuid];

		// Get first object
		for ( var first in this.layers ) break;

		// If there are other legend, display it...
		if ( first ) this.setHTMLfromStore(first)	

		// For multiple layers
		this.updateMultiple(first);

		this.refresh();
	},

	updateMultiple : function (layerUuid) {

		if ( this.isCollapsed ) Wu.DomUtil.addClass(this.satelliteAngle._innerContainer, 'displayNone');

		var wrapper = this._multipleLegendInner;
		wrapper.innerHTML = '';

		var length = 0;
		for (var k in this.layers) {
		       length++;
		}		

		for ( var uuid in this.layers ) {

			var layer = this.layers[uuid];

			title = layer.getTitle();
			var multipleLayer = Wu.DomUtil.create('div', 'each-multiple-description', wrapper, title);
			    multipleLayer.id = 'mulitidec_' + uuid;

			if ( uuid == layerUuid ) {
				length > 1 ? Wu.DomUtil.addClass(multipleLayer, 'active') : Wu.DomUtil.addClass(multipleLayer, 'one-layer');


			} else {
				Wu.DomUtil.removeClass(multipleLayer, 'active');
				Wu.DomUtil.removeClass(multipleLayer, 'one-layer');
			}

			Wu.DomEvent.on(multipleLayer, 'click', this.toggleLegend, this);
		}
	},

	toggleLegend : function (e) {

		var id = e.target.id;
		var layerUuid = id.slice(10, id.length);

		this.setHTMLfromStore(layerUuid);

		// For multiple layers
		this.updateMultiple(layerUuid);		

	},


	// Store legend data ...		
	storeLegendData : function (layer) {

		// Hard coded key
		// Todo: remove
		var key = 'point';

		// Layer id
		var layerUuid = layer.getUuid();

		// Create empty object
		var legendObj = {};

		// meta
		var meta = legendObj.meta = layer.getMeta();

		// set title
		legendObj.title = layer.getTitle();
		
		// set description
		legendObj.description = layer.getDescription();

		// create description meta
		var area = Math.floor(meta.total_area / 1000000 * 100) / 100;
		var num_points = meta.row_count;
		var num_columns = _.size(meta.columns);
		var size_bytes = meta.size_bytes;
		var startend = this._parseStartEndDate(meta);
		var style = Wu.parse(layer.store.style);

		legendObj.description_meta = {
			'Number of points' : num_points,
			'Covered area (km<sup>2</sup>)' : area,
			'Start date' : startend.start,
			'End date' : startend.end
		}

		// // COLOR RANGE
		// if ( style && style[key].color.column ) {

		// 	var colorStops = style[key].color.value;
		// 	// var customMinMax = style[key].color.customMinMax;
		// 	var minMax = style[key].color.range;

		// 	var min = minMax[0];
		// 	var max = minMax[1];

		// 	// create legend
		// 	var gradientOptions = {
		// 		colorStops : colorStops,
		// 		minVal : minMax[0],
		// 		maxVal : minMax[1],
		// 		bline : 'Velocity (mm pr. year)'
		// 	}

		// 	legendObj.legendHTML = this.gradientLegend(gradientOptions);

		// } else {

		if (layer.isPostgis()) {
			legendObj.legendHTML = this.createLegendHTML();
		} else {
			legendObj.legendHTML = '';
		}

		// }

		return legendObj;
	},


	getLegend : function (layer) {

		// get styling
		// var style = layer.getStyling();

		
		// // point
		// if (style && style.point && style.point.color && style.point.color.column) {

		// 	var colorStops = style.point.color.value;
		// 	var minMax = style.point.color.range
		// 	var min = minMax[0];
		// 	var max = minMax[1];
		// 	var bline = this._getLegendCaption(style.point.color);

		// 	// create legend
		// 	var gradientOptions = {
		// 		colorStops : colorStops,
		// 		minVal : minMax[0],
		// 		maxVal : minMax[1],
		// 		bline : bline
		// 	}

		// 	var legendHTML = this.gradientLegend(gradientOptions);

		// // polygon
		// } else if (style && style.polygon && style.polygon.color && style.polygon.color.column) {

		// 	var colorStops = style.polygon.color.value;
		// 	var minMax = style.polygon.color.range
		// 	var min = minMax[0];
		// 	var max = minMax[1];
		// 	var bline = this._getLegendCaption(style.polygon.color);

		// 	// create legend
		// 	var gradientOptions = {
		// 		colorStops : colorStops,
		// 		minVal : minMax[0],
		// 		maxVal : minMax[1],
		// 		bline : bline
		// 	}

		// 	var legendHTML = this.gradientLegend(gradientOptions);

		// // catch-all
		// } else {

			// var legendHTML = '';
			// var legendHTML = this.createLegend();

		if (layer.isPostgis()) {
			var legendHTML = this.createLegendHTML();
		} else {
			var legendHTML = '';
		}

		// }

		return legendHTML;

	},

	_getLegendCaption : function (color) {

		var column = color.column;

		if (column) {

			// special case
			if (column == 'vel' || column == 'mvel') {
				return 'Velocity (mm/year)'
			}

			// camelize, return
			return column;
		}

		return '';

	},

	getMetaDescription : function (layer) {

		var meta = layer.getMeta();

		// set geom type
		var geom_type = 'items'
		if (meta.geometry_type == 'ST_Point') geom_type = 'points';
		if (meta.geometry_type == 'ST_MultiPolygon') geom_type = 'polygons';

		// create description meta
		var area = Math.floor(meta.total_area / 1000000 * 100) / 100;
		var num_points = meta.row_count;
		var startend = this._parseStartEndDate(meta);

		description_meta = {};
		description_meta['Number of ' + geom_type] = num_points;
		description_meta['Covered area (km<sup>2</sup>)'] = area;
		
		if (startend.start != startend.end) {
			description_meta['Start date'] = startend.start;
			description_meta['End date'] = startend.end;
		}

		return description_meta;
	},


	setHTMLfromStore : function (uuid) {

		// var layer = this.layers[uuid];
		var layer = this._project.getLayer(uuid);

		if ( !layer ) return;

		// Build legend object
		this.buildLegendObject(layer);		
		
		// Title
		var title = layer.getTitle();
		
		// Description
		var description = layer.getDescription();
		
		// Description meta
		var descriptionMeta = this.getMetaDescription(layer);

		// Legend
		var legend = this.getLegend(layer);

		// var _layer = this._project.getLayer(uuid);
		var satPos = Wu.parse(layer.getSatellitePosition());

		var _angle = satPos.angle;
		var _path  = satPos.path;

		this.satelliteAngle.update({angle : _angle, path : _path});

		// Set description
		this.setDescriptionHTML(description);

		// Set description meta
		this.setMetaHTML(descriptionMeta);

		// Set legend
		this.setLegendHTML(legend);


	},

	setMetaHTML : function (meta) {

		// Clear container
		this._metaContainer.innerHTML = '';

		for (var key in meta) {
			var val = meta[key]

			// Make new content	
			var metaLine = Wu.DomUtil.create('div', 'legends-meta-line', this._metaContainer);
			var metaKey = Wu.DomUtil.create('div', 'legends-meta-key', metaLine, key)
			var metaVal = Wu.DomUtil.create('div', 'legend-meta-valye', metaLine, val)
		}
	},

	setLegendHTML : function (HTML) {
		this._legendContainer.innerHTML = HTML;
	},

	setDescriptionHTML : function (text) {
		if ( !text || text != '' ) Wu.DomUtil.removeClass(this._description, 'displayNone');
		if ( this.isCollapsed ) Wu.DomUtil.addClass(this._description, 'displayNone');
		this._description.innerHTML = text;
	},

	// HELPERS HELPERS HELPERS
	_parseStartEndDate : function (meta) {

		// get all columns with dates
		var columns = meta.columns;
		var times = [];

		for (var c in columns) {
			if (c.length == 8) { // because d12mnd is valid moment.js date (??)
				var m = moment(c, "YYYYMMDD");
				var unix = m.format('x');
				if (m.isValid()) {
					var u = parseInt(unix);
					if (u > 0) { // remove errs
						times.push(u);
					}
				}
			}
		};

		function sortNumber(a,b) {
			return a - b;
		}

		times.sort(sortNumber);

		var first = times[0];
		var last = times[times.length-1];
		var m_first = moment(first).format('MMM Do YYYY');
		var m_last = moment(last).format('MMM Do YYYY');

		var startend = {
			start : m_first,
			end : m_last
		}

		return startend;
	},



	isEmpty : function (obj) {
		for(var prop in obj) {
			if (obj.hasOwnProperty(prop)) return false;
		}

		return true;
	},



	// EXTERNAL EXTERNAL EXTERNAL
	// Toggle scale/measure/mouseposition corner
	toggleScale : function (openDescription) {

		if (!app._map._controlCorners.topright) return;

		if (openDescription) {
			Wu.DomUtil.addClass(app._map._controlCorners.topright, 'toggle-scale');
		} else {
			Wu.DomUtil.removeClass(app._map._controlCorners.topright, 'toggle-scale');
		}
	},

	_on : function () {

		this._show();

	},

	_off : function () {

		this._hide();

	},







	// BUILD LEGEND OBJECT
	// BUILD LEGEND OBJECT
	// BUILD LEGEND OBJECT

	buildLegendObject : function  (layer) {

		// Stop if raster layer
		if ( !layer.isPostgis() ) return;

		// Get style
		var styleJSON   = Wu.parse(layer.store.style);

		var point 	= styleJSON.point;
		var line 	= styleJSON.line;
		var polygon 	= styleJSON.polygon;


		// Create blank legend object
		this.legendObj = {

			layerName : layer.getTitle(),
			
			point 	: {
				all 	: {},
				target 	: []
			},

			polygon : {
				all 	: {},
				target 	: []
			},

			line 	: {
				all 	: {},
				target 	: []
			}
		};


		// Build legend object
		this.legendPoint(point);
		this.legendPolygon(polygon);
		this.legendLine(line);

	},

	// BUILD LEGEND OBJECT: POINT
	// BUILD LEGEND OBJECT: POINT
	// BUILD LEGEND OBJECT: POINT

	legendPoint : function (point) {
	
		if ( !point.enabled ) return;		

		var legend = {};

		// COLOR
		// COLOR
		// COLOR

		// polygon color range
		if ( point.color.column ) {

			var column   = point.color.column;
			var value    = point.color.value; 
			var minRange = point.color.range[0];
			var maxRange = point.color.range[1];

			// Save legend data
			legend.color = {};
			legend.color.column   = column; 
			legend.color.value    = value;
			legend.color.minRange = minRange;
			legend.color.maxRange = maxRange;


		// static polygon color
		} else {				

			var value = point.color.staticVal ? point.color.staticVal : 'red';

			// Save legend data
			legend.color = {};
			legend.color.column = false;
			legend.color.value  = value;

		}
		

		// OPACITY
		// OPACITY
		// OPACITY

		// polygon opacity range
		if ( point.opacity.column ) {

			var column   = point.opacity.column;
			var minRange = point.opacity.range[0];
			var maxRange = point.opacity.range[1];

			// Save legend data
			legend.opacity = {};
			legend.opacity.column   = column; 
			legend.opacity.minRange = minRange;
			legend.opacity.maxRange = maxRange;


		// static polygon opacity
		} else {

			if ( !point.opacity.staticVal && point.opacity.staticVal != 0 ) {
				var value = 1;
			} else {
				var value = point.opacity.staticVal;
			}				

			// Save legend data
			legend.opacity = {};
			legend.opacity.column = false;
			legend.opacity.value  = value;

		}


		// POINT SIZE
		// POINT SIZE
		// POINT SIZE

		// polygon pointsize range
		if ( point.pointsize.column ) {

			var column   = point.pointsize.column;
			var minRange = point.pointsize.range[0];
			var maxRange = point.pointsize.range[1];

			// Save legend data
			legend.pointsize = {};
			legend.pointsize.column   = column; 
			legend.pointsize.minRange = minRange;
			legend.pointsize.maxRange = maxRange;


		// static polygon pointsize
		} else {

			if ( !point.pointsize.staticVal && point.pointsize.staticVal != 0 ) {
				var value = 1.2;
			} else {
				var value = point.pointsize.staticVal;
			}				

			// Save legend data
			legend.pointsize = {};
			legend.pointsize.column = false;
			legend.pointsize.value  = value;

		}




		// Push legend object into array
		this.legendObj.point.all = legend;



		// FILTERS
		// FILTERS
		// FILTERS

		// polygon filters
		if ( point.targets && point.targets.length >= 1 ) {

			point.targets.forEach(function (target, i) {

				console.log('point.targets', point.targets);
				
				var column   = target.column;
				var color    = target.color;					
				var opacity  = target.opacity;
				var value    = target.value;
				var width    = target.width;
				var operator = target.operator;

				// Save legend data
				var legend = {
					column   : column,
					color    : color,
					opacity  : opacity,
					value    : value,
					width    : width,
					operator : operator
				}

				this.legendObj.point.target.push(legend);

			}.bind(this))

		
		}	

	},	


	// BUILD LEGEND OBJECT: POLYGON
	// BUILD LEGEND OBJECT: POLYGON
	// BUILD LEGEND OBJECT: POLYGON

	legendPolygon : function (polygon) {


		// polygon enabled
		if ( !polygon.enabled ) return;

	
		// Create blank legend
		var legend = {};

		// COLOR
		// COLOR
		// COLOR

		// polygon color range
		if ( polygon.color.column ) {

			var column   = polygon.color.column;
			var value    = polygon.color.value; 
			var minRange = polygon.color.range[0];
			var maxRange = polygon.color.range[1];

			// Save legend data
			legend.color = {};
			legend.color.column   = column; 
			legend.color.value    = value;
			legend.color.minRange = minRange;
			legend.color.maxRange = maxRange;


		// static polygon color
		} else {

			
			var value = polygon.color.staticVal ? polygon.color.staticVal : "red";
			

			// Save legend data
			legend.color = {};
			legend.color.column = false;
			legend.color.value  = value;

		}
		

		// OPACITY
		// OPACITY
		// OPACITY

		// polygon opacity range
		if ( polygon.opacity.column ) {

			var column   = polygon.opacity.column;
			var value    = polygon.opacity.value; 
			var minRange = polygon.opacity.range[0];
			var maxRange = polygon.opacity.range[1];

			// Save legend data
			legend.opacity = {};
			legend.opacity.column   = column; 
			legend.opacity.value    = value;
			legend.opacity.minRange = minRange;
			legend.opacity.maxRange = maxRange;


		// static polygon opacity
		} else {

			if ( !polygon.opacity.staticVal && polygon.opacity.staticVal != 0 ) {
				var value = 1;
			} else {
				var value = polygon.opacity.staticVal;
			}

			// Save legend data
			legend.opacity = {};
			legend.opacity.column = false;
			legend.opacity.value  = value;

		}


		// Push legend object into array
		this.legendObj.polygon.all = legend;



		// FILTERS	
		// FILTERS
		// FILTERS

		// polygon filters
		if ( polygon.targets && polygon.targets.length >= 1 ) {

			polygon.targets.forEach(function (target, i) {
				
				var column   = target.column;
				var color    = target.color;					
				var opacity  = target.opacity;
				var value    = target.value;
				var operator = target.operator;

				// Save legend data
				var legend = {
					column   : column,
					color    : color,
					opacity  : opacity,
					value    : value,
					operator : operator
				}

				this.legendObj.polygon.target.push(legend);

			}.bind(this))	

		
		}			

	},

	// BUILD LEGEND OBJECTL: LINE
	// BUILD LEGEND OBJECTL: LINE
	// BUILD LEGEND OBJECTL: LINE
	
	legendLine : function (line) {


		// line enabled
		if ( !line.enabled ) return;
		
		// Create blank legend
		var legend = {};			

		// COLOR
		// COLOR
		// COLOR

		// line color range
		if ( line.color.column ) {

			var column 	= line.color.column;
			var value 	= line.color.value;
			var minRange	= line.color.range[0];
			var maxRange	= line.color.range[1];

			// Save legend data
			legend.color = {};
			legend.color.column   = column; 
			legend.color.value    = value;
			legend.color.minRange = minRange;
			legend.color.maxRange = maxRange;


		// static line color
		} else {
			
			var value = line.color.staticVal ? line.color.staticVal : 'red';

			// Save legend data
			legend.color = {};
			legend.color.column = false;
			legend.color.value  = value;


		}


		// OPACITY
		// OPACITY
		// OPACITY

		// line opacity range
		if ( line.opacity.column ) {

			var column = line.opacity.column;
			var minRange = line.opacity.range[0];
			var maxRange = line.opacity.range[1];

			// Save legend data
			legend.opacity = {};
			legend.opacity.column   = column; 
			legend.opacity.minRange = minRange;
			legend.opacity.maxRange = maxRange;

		// line static opacity
		} else {

			if ( !line.opacity.staticVal && line.opacity.staticVal != 0 ) {
				var value = 1;
			} else {
				var value = line.opacity.staticVal;
			}				

			// Save legend data
			legend.opacity = {};
			legend.opacity.column   = false;
			legend.opacity.value    = value;
		
		}


		// WIDTH
		// WIDTH
		// WIDTH

		// line width range
		if ( line.width.column ) {

			var column = line.width.column;
			var minRange = line.width.range[0];
			var maxRange = line.width.range[1];

			// Save legend data
			legend.width = {};
			legend.width.column   = column;
			legend.width.minRange = minRange;
			legend.width.maxRange = maxRange;

		// static line width
		} else {


			if ( !line.width.staticVal && line.width.staticVal != 0 ) {
				var value = 5;
			} else {
				var value = line.width.staticVal;
			}


			// Save legend data
			legend.width = {};
			legend.width.column   = false;
			legend.width.value    = value;

		}


		this.legendObj.line.all = legend;


				

		// FILTERS
		// FILTERS
		// FILTERS

		// line filters
		if ( line.targets && line.targets.length >= 1 ) {

			line.targets.forEach(function (target, i) {

				var column   = target.column;
				var color    = target.color;					
				var opacity  = target.opacity;
				var value    = target.value;
				var width    = target.width;
				var operator = target.operator;

				// Save legend data
				var legend = {
					column   : column,
					color    : color,
					opacity  : opacity,
					value    : value,
					width    : width,
					operator : operator
				}

				this.legendObj.line.target.push(legend);
									

			}.bind(this))

		} 

	},

	// CREATE LEGEND HTML
	// CREATE LEGEND HTML
	// CREATE LEGEND HTML

	createLegendHTML : function () {

		var str = '';

		var layerName = this.legendObj.layerName;

		var polygons = this.legendObj.polygon;
		var lines    = this.legendObj.line;
		var points   = this.legendObj.point;

		// POINTS
		str += this.pointsHTML(points);

		// POLYGONS AND LINES
		str += this.polygonAndLinesHTML(polygons, lines);

		return str;

	},

	// POINTS HTML
	// POINTS HTML
	// POINTS HTML

	pointsHTML : function (points) {
	
		var str = '';


		// TARGETED POINTS
		// TARGETED POINTS
		// TARGETED POINTS

		points.target.forEach(function (point, i) {

			// Color & opacity
			var color   = point.color;
			var opacity = point.opacity;
			var RGB     = this.color2RGB(color);
			var rgba    = 'rgba(' + RGB.r + ',' + RGB.g + ',' + RGB.b + ',' + opacity + ');';
			var style   = 'background:' + rgba + '; ';
		
			// Name
			var name = '';
			var operator = point.operator + ' ';
			if ( operator != '= ' ) name += operator;
			name += point.value;

			// Size
			var size    = point.width;
			if ( size > 20 ) size = 20;
			if ( size < 5  ) size = 5;
			style      += 'width: ' + size + 'px; height: ' + size + 'px; border-radius: ' + size + 'px;';

			// Set dot position
			var topLeft = (20/2) - (size/2);
			style += 'top: ' + topLeft + 'px; ' + 'left: ' + topLeft + 'px; ';

			// Set HTML
			str += '<div class="legend-each-container">';
			str += '<div class="legend-each-name">' + name + '</div>';
			str += '<div class="legend-each-color" style="' + style + '"></div>';
			str += '</div>';

		}.bind(this));


		// *******************************************************************************************************************
		// *******************************************************************************************************************
		// *******************************************************************************************************************

		// ALL POINTS
		// ALL POINTS
		// ALL POINTS

		// Can contain range

		// Static colors
		// Static colors
		// Static colors

		var pointStyle = '';
		var hasAllStyle = false;

		
		if ( points.all.color && !points.all.color.column ) {

			var color   = points.all.color.value;
			var opacity = points.all.opacity.value;			
			var RGB = this.color2RGB(color);
			var rgba = 'rgba(' + RGB.r + ',' + RGB.g + ',' + RGB.b + ',' + opacity + ');';
			pointStyle += 'background:' + rgba + ';';

			// Size
			var size    = points.all.pointsize.value;
			if ( size > 20 ) size = 20;
			if ( size < 5  ) size = 5;

			pointStyle += 'width: ' + size + 'px; height: ' + size + 'px; border-radius: ' + size + 'px;';

			// Set dot position
			var topLeft = (20/2) - (size/2);
			pointStyle += 'top: ' + topLeft + 'px; ' + 'left: ' + topLeft + 'px; ';			

			if ( opacity != 0 ) hasAllStyle = true;
		}


		if ( hasAllStyle ) {

			var layerName = this.legendObj.layerName;

			var name = 'All ' + layerName;
			str += '<div class="legend-each-container">';
			str += '<div class="legend-each-name">' + name + '</div>';
			str += '<div class="legend-each-color" style="' + pointStyle + '"></div>';
			str += '</div>';

		}



		// Color range
		// Color range
		// Color range

		if ( points.all.color && points.all.color.column ) {

			var colorStops = points.all.color.value;
			var minVal     = points.all.color.minRange;
			var maxVal     = points.all.color.maxRange;
			var column     = points.all.color.column;

			// create legend
			var gradientOptions = {
				colorStops : colorStops,
				minVal     : minVal,
				maxVal     : maxVal,
				bline      : column
			}

			var gradient = this.gradientLegend(gradientOptions);

			str += gradient;

		}		

		return str;

	},

	// POLYGONS AND LINES HTML
	// POLYGONS AND LINES HTML
	// POLYGONS AND LINES HTML

	polygonAndLinesHTML : function  (polygons, lines) {
	
		var str = '';

		// MATCHING TARGETS
		// MATCHING TARGETS
		// MATCHING TARGETS

		// (aka. we have a line and a polygon with the same target)

		var linePolygonTargetMatches = {}

		lines.target.forEach(function (l, i) {
			polygons.target.forEach(function (p, a) {

				// If it is a match
				if ( p.value == l.value ) {

					// Line style
					var lineColor   = l.color;
					var lineOpacity = l.opacity;
					var lineWidth   = l.width;
					var lineRGB     = this.color2RGB(lineColor);
					var lineRgba    = 'rgba(' + lineRGB.r + ',' + lineRGB.g + ',' + lineRGB.b + ',' + lineOpacity + ');';
					var lineStyle   = 'border: ' + (lineWidth/2) + 'px solid ' + lineRgba;

					// Polygon style
					var polygonColor   = p.color;
					var polygonOpacity = p.opacity;
					var polygonRGB     = this.color2RGB(polygonColor);
					var polygonRgba    = 'rgba(' + polygonRGB.r + ',' + polygonRGB.g + ',' + polygonRGB.b + ',' + polygonOpacity + ');';
					var polygonStyle   = 'background:' + polygonRgba;

					var style = lineStyle + polygonStyle;

					// Store matches
					linePolygonTargetMatches[l.value] = style;
				}

			}.bind(this))
		}.bind(this))



		// LINES LINES LINES LINES LINES LINES LINES 
		// LINES LINES LINES LINES LINES LINES LINES 
		// LINES LINES LINES LINES LINES LINES LINES 

		// TARGETED LINES
		// TARGETED LINES
		// TARGETED LINES

		lines.target.forEach(function (line, i) {

			// Stop if this target also exists in polygons
			if ( linePolygonTargetMatches[line.value] ) return;
			
			// Style
			var color   = line.color;
			var opacity = line.opacity;
			var width   = line.width;
			var RGB     = this.color2RGB(color);
			var rgba    = 'rgba(' + RGB.r + ',' + RGB.g + ',' + RGB.b + ',' + opacity + ');';
			var style   = 'border: ' + width + 'px solid ' + rgba;

			// Name
			var name = '';
			var operator = line.operator + ' ';
			if ( operator != '= ' ) name += operator;
			name += line.value;


			str += '<div class="legend-each-container">';
			str += '<div class="legend-each-name">' + name + '</div>';
			str += '<div class="legend-each-color" style="' + style + '"></div>';
			str += '</div>';

		}.bind(this));



		// POLYGONS POLYGONS POLYGONS POLYGONS POLYGONS 
		// POLYGONS POLYGONS POLYGONS POLYGONS POLYGONS 
		// POLYGONS POLYGONS POLYGONS POLYGONS POLYGONS 

		// TARGETED POLYGONS
		// TARGETED POLYGONS
		// TARGETED POLYGONS

		polygons.target.forEach(function (polygon, i) {

			// Stop if this target also exists in polygons
			if ( linePolygonTargetMatches[polygon.value] ) {
				var style = linePolygonTargetMatches[polygon.value];
			} else {
				var color   = polygon.color;
				var opacity = polygon.opacity;
				var RGB     = this.color2RGB(color);
				var rgba    = 'rgba(' + RGB.r + ',' + RGB.g + ',' + RGB.b + ',' + opacity + ');';
				var style   = 'background:' + rgba;
			}

			// Name
			var name = '';
			var operator = polygon.operator + ' ';
			if ( operator != '= ' ) name += operator;
			name += polygon.value;

			// Write HTML
			str += '<div class="legend-each-container">';
			str += '<div class="legend-each-name">' + name + '</div>';
			str += '<div class="legend-each-color" style="' + style + '"></div>';
			str += '</div>';

		}.bind(this));


		// *******************************************************************************************************************
		// *******************************************************************************************************************
		// *******************************************************************************************************************

		// ALL POLYGONS & LINES - ALL POLYGONS & LINES - ALL POLYGONS & LINES
		// ALL POLYGONS & LINES - ALL POLYGONS & LINES - ALL POLYGONS & LINES
		// ALL POLYGONS & LINES - ALL POLYGONS & LINES - ALL POLYGONS & LINES


		// Static colors
		// Static colors
		// Static colors

		var allStyle = '';
		var hasAllStyle = false;

		// Polygon
		if ( polygons.all.color && !polygons.all.color.column ) {
			var color   = polygons.all.color.value;
			var opacity = polygons.all.opacity.value;			
			var RGB = this.color2RGB(color);
			var rgba = 'rgba(' + RGB.r + ',' + RGB.g + ',' + RGB.b + ',' + opacity + ');';
			allStyle += 'background:' + rgba;

			if ( opacity != 0 ) hasAllStyle = true;
		}

		// Line
		if ( lines.all.color && !lines.all.color.column ) {
			var color   = lines.all.color.value;
			var opacity = lines.all.opacity.value;
			var width   = lines.all.width.value;
			var RGB = this.color2RGB(color);
			var rgba = 'rgba(' + RGB.r + ',' + RGB.g + ',' + RGB.b + ',' + opacity + ');';
			allStyle += 'border: ' + width + 'px solid ' + rgba;

			if ( opacity != 0 ) hasAllStyle = true;
		}


		if ( hasAllStyle ) {

			var layerName = this.legendObj.layerName;

			var name = 'All ' + layerName;
			str += '<div class="legend-each-container">';
			str += '<div class="legend-each-name">' + name + '</div>';
			str += '<div class="legend-each-color" style="' + allStyle + '"></div>';
			str += '</div>';
		}



		// Color range
		// Color range
		// Color range

		if ( polygons.all.color && polygons.all.color.column ) {

			var colorStops = polygons.all.color.value;
			var minVal     = polygons.all.color.minRange;
			var maxVal     = polygons.all.color.maxRange;
			var column     = polygons.all.color.column;

			// create legend
			var gradientOptions = {
				colorStops : colorStops,
				minVal     : minVal,
				maxVal     : maxVal,
				bline      : column
			}

			var gradient = this.gradientLegend(gradientOptions);

			str += gradient;

		}		

		return str;

	},


	// GRADIENT HTML
	// GRADIENT HTML
	// GRADIENT HTML

	gradientLegend : function (options) {

		// Set color stops
		var colorStops = options.colorStops;

		// Set styling
		var gradientStyle = 'background: -webkit-linear-gradient(left, ' + colorStops.join() + ');';
		gradientStyle    += 'background: -o-linear-gradient(right, '    + colorStops.join() + ');';
		gradientStyle    += 'background: -moz-linear-gradient(right, '  + colorStops.join() + ');';
		gradientStyle    += 'background: linear-gradient(to right, '    + colorStops.join() + ');';
  
		// Container
		var _legendHTML = '<div class="info-legend-container">';

		// Legend Frame
		_legendHTML += '<div class="info-legend-frame">';
		_legendHTML += '<div class="info-legend-val info-legend-min-val">' + options.minVal + '</div>';
		_legendHTML += '<div class="info-legend-val info-legend-max-val">' + options.maxVal + '</div>';

		// Gradient
		_legendHTML += '<div class="info-legend-gradient-container" style="' + gradientStyle + '"></div>';
		_legendHTML += '</div>';

		if (options.bline) {
			_legendHTML += '<div class="info-legend-gradient-bottomline"">' + options.bline + '</div>';
		}

		_legendHTML += '</div>';

		return _legendHTML;

	},		



	// color tools – color tools – color tools – color tools – color tools
	// color tools – color tools – color tools – color tools – color tools
	// color tools – color tools – color tools – color tools – color tools
	// color tools – color tools – color tools – color tools – color tools
	// color tools – color tools – color tools – color tools – color tools
	// color tools – color tools – color tools – color tools – color tools

	// Coverts any color (RGB, RGBA, Names (lavender), #333, #ff33ff) to [r,g,b]
	color2RGB : function (color) {
		
		// The color is a hex decimal
		if ( color[0] == '#' ) return this.hex2RGB(color);

		// The color is RGBA
		if ( color.substring(0,3).toLowerCase() == 'rgba' ) {
			var end = color[color.length-1] == ';' ? color.length-2 : color.length-1;
			var cc = c.substring(5,end);
			var expl = cc.split(",");
			var rgb = {
				r : expl[0],
				g : expl[1],
				b : expl[2]
			}
			return rgb;
		}

		// The color is RGB
		if ( color.substring(0,2).toLowerCase() == 'rgb' ) {		
			var end = color[color.length-1] == ';' ? color.length-2 : color.length-1;
			var cc = c.substring(4,end);
			var expl = cc.split(",");
			var rgb = {
				r : expl[0],
				g : expl[1],
				b : expl[2]
			}
			return rgb;
		}

		// ... or else the color has a name
		var convertedColor = this.colorNameToHex(color);
		return this.hex2RGB(convertedColor);

	},

	// Creates RGB from hex
	hex2RGB : function (hex) {

		hex = this.checkHex(hex);

		var r = parseInt(hex.substring(1,3), 16);
		var g = parseInt(hex.substring(3,5), 16);
		var b = parseInt(hex.substring(5,7), 16);

		var rgb = {
			r : r,
			g : g,
			b : b
		}

		return rgb;

	},	

	// Turns 3 digit hex values to 6 digits
	checkHex : function (hex) {
		
		// If it's a 6 digit hex (plus #), run it.
		if ( hex.length == 7 ) {
			return hex;
		}

		// If it's a 3 digit hex, convert
		if ( hex.length == 4 ) {
			var r = parseInt(hex.substring(1,3), 16);
			var g = parseInt(hex.substring(3,5), 16);
			var b = parseInt(hex.substring(5,7), 16);
			return '#' + r + r + g + g + b + b;
		}

	},
	
	// Turns color names (lavender) to hex
	colorNameToHex : function (color) {

    		var colors = {	"aliceblue" : "#f0f8ff",
    				"antiquewhite":"#faebd7",
    				"aqua":"#00ffff",
    				"aquamarine":"#7fffd4",
    				"azure":"#f0ffff",
    				"beige":"#f5f5dc",
    				"bisque":"#ffe4c4",
    				"black":"#000000",
    				"blanchedalmond":"#ffebcd",
    				"blue":"#0000ff",
    				"blueviolet":"#8a2be2",
    				"brown":"#a52a2a",
    				"burlywood":"#deb887",
    				"cadetblue":"#5f9ea0",
    				"chartreuse":"#7fff00",
    				"chocolate":"#d2691e",
    				"coral":"#ff7f50",
    				"cornflowerblue":"#6495ed",
    				"cornsilk":"#fff8dc",
    				"crimson":"#dc143c",
    				"cyan":"#00ffff",
				"darkblue":"#00008b",
				"darkcyan":"#008b8b",
				"darkgoldenrod":"#b8860b",
				"darkgray":"#a9a9a9",
				"darkgreen":"#006400",
				"darkkhaki":"#bdb76b",
				"darkmagenta":"#8b008b",
				"darkolivegreen":"#556b2f",
				"darkorange":"#ff8c00",
				"darkorchid":"#9932cc",
				"darkred":"#8b0000",
				"darksalmon":"#e9967a",
				"darkseagreen":"#8fbc8f",
				"darkslateblue":"#483d8b",
				"darkslategray":"#2f4f4f",
				"darkturquoise":"#00ced1",
				"darkviolet":"#9400d3",
				"deeppink":"#ff1493",
				"deepskyblue":"#00bfff",
				"dimgray":"#696969",
				"dodgerblue":"#1e90ff",
			    	"firebrick":"#b22222",
			    	"floralwhite":"#fffaf0",
			    	"forestgreen":"#228b22",
			    	"fuchsia":"#ff00ff",
    				"gainsboro":"#dcdcdc",
    				"ghostwhite":"#f8f8ff",
    				"gold":"#ffd700",
    				"goldenrod":"#daa520",
    				"gray":"#808080",
    				"green":"#008000",
    				"greenyellow":"#adff2f",
    				"honeydew":"#f0fff0",
    				"hotpink":"#ff69b4",
				"indianred ":"#cd5c5c",
				"indigo":"#4b0082",
				"ivory":"#fffff0",
				"khaki":"#f0e68c",
				"lavender":"#e6e6fa",
				"lavenderblush":"#fff0f5",
				"lawngreen":"#7cfc00",
				"lemonchiffon":"#fffacd",
				"lightblue":"#add8e6",
				"lightcoral":"#f08080",
				"lightcyan":"#e0ffff",
				"lightgoldenrodyellow":"#fafad2",
				"lightgrey":"#d3d3d3",
				"lightgreen":"#90ee90",
				"lightpink":"#ffb6c1",
				"lightsalmon":"#ffa07a",
				"lightseagreen":"#20b2aa",
				"lightskyblue":"#87cefa",
				"lightslategray":"#778899",
				"lightsteelblue":"#b0c4de",
				"lightyellow":"#ffffe0",
				"lime":"#00ff00",
				"limegreen":"#32cd32",
				"linen":"#faf0e6",
				"magenta":"#ff00ff",
				"maroon":"#800000",
				"mediumaquamarine":"#66cdaa",
				"mediumblue":"#0000cd",
				"mediumorchid":"#ba55d3",
				"mediumpurple":"#9370d8",
				"mediumseagreen":"#3cb371",
				"mediumslateblue":"#7b68ee",
				"mediumspringgreen":"#00fa9a",
				"mediumturquoise":"#48d1cc",
				"mediumvioletred":"#c71585",
				"midnightblue":"#191970",
				"mintcream":"#f5fffa",
				"mistyrose":"#ffe4e1",
				"moccasin":"#ffe4b5",
				"navajowhite":"#ffdead",
				"navy":"#000080",
				"oldlace":"#fdf5e6",
				"olive":"#808000",
				"olivedrab":"#6b8e23",
				"orange":"#ffa500",
				"orangered":"#ff4500",
				"orchid":"#da70d6",
				"palegoldenrod":"#eee8aa",
				"palegreen":"#98fb98",
				"paleturquoise":"#afeeee",
				"palevioletred":"#d87093",
				"papayawhip":"#ffefd5",
				"peachpuff":"#ffdab9",
				"peru":"#cd853f",
				"pink":"#ffc0cb",
				"plum":"#dda0dd",
				"powderblue":"#b0e0e6",
				"purple":"#800080",
				"red":"#ff0000",
				"rosybrown":"#bc8f8f",
				"royalblue":"#4169e1",
				"saddlebrown":"#8b4513",
				"salmon":"#fa8072",
				"sandybrown":"#f4a460",
				"seagreen":"#2e8b57",
				"seashell":"#fff5ee",
				"sienna":"#a0522d",
				"silver":"#c0c0c0",
				"skyblue":"#87ceeb",
				"slateblue":"#6a5acd",
				"slategray":"#708090",
				"snow":"#fffafa",
				"springgreen":"#00ff7f",
				"steelblue":"#4682b4",
				"tan":"#d2b48c",
				"teal":"#008080",
				"thistle":"#d8bfd8",
				"tomato":"#ff6347",
				"turquoise":"#40e0d0",
				"violet":"#ee82ee",
				"wheat":"#f5deb3",
				"white":"#ffffff",
				"whitesmoke":"#f5f5f5",
				"yellow":"#ffff00",
				"yellowgreen":"#9acd32"
				};

		var c = color.toLowerCase();

		// Return hex color
		if ( colors[c] ) return colors[c];
		
		// Return black if there are no matches
		// (could return false, but will have to catch that error later)
		return '#000000';				
	},	






	
});

L.control.description = function (options) {
	return new L.Control.Description(options);
};
/*
Copyright 2012 Ardhi Lukianto

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

// app.MapPane.mousepositionControl

L.Control.Mouseposition = Wu.Control.extend({

        type : 'mouseposition',

        options: {
                position: 'topright',
                separator: ',  ',
                emptyString: 'Lat/Lng',
                lngFirst: false,
                numDigits: 3,
                lngFormatter: this.formatNum,
                latFormatter: this.formatNum,
                prefix: "",
                zoomLevel : true
        },

        _on : function () {
                this._show();
        },
        _off : function () {
                this._hide();
        },
        _show : function () {
                this._container.style.display = 'inline-block';
        },
        _hide : function () {
                this._container.style.display = 'none';
        },

        _addTo : function () {
                this.addTo(app._map);
                this._added = true;

        },

        _refresh : function () {
                // should be active
                if (!this._added) this._addTo();

                // get control active setting from project
                var active = this._project.getControls()[this.type];
                
                // if not active in project, hide
                if (!active) return this._hide();

                // remove old content
                this._flush();
        },

        _flush : function () {

        },


        onAdd: function (map) {
                this._map = map;

                this._container = L.DomUtil.create('div', 'leaflet-control-mouseposition');
                this._container.innerHTML = this.options.emptyString;
                
                L.DomEvent.disableClickPropagation(this._container);
              
                map.on('mousemove', this._onMouseMove, this);
               
                if (this.options.zoomLevel) {
                        map.on('zoomend', this._updateZoom, this);
                        this._updateZoom();
                }                

                // add tooltip
                app.Tooltip.add(this._container, 'Gives the coordinates of the mouse pointer', { extends : 'systyle', tipJoint : 'bottom middle'});

                return this._container;
        },

        _updateZoom : function () {
                this._zoom = this._map.getZoom();
        },

        onRemove: function (map) {
                map.off('mousemove', this._onMouseMove, this);
               
                if (this.options.zoomLevel) map.off('zoomend', this._updateZoom, this);
        },

        _onMouseMove: function (e) {
                // var lng = this.options.lngFormatter ? this.options.lngFormatter(e.latlng.lng) : L.Util.formatNum(e.latlng.lng, this.options.numDigits);
                // var lat = this.options.latFormatter ? this.options.latFormatter(e.latlng.lat) : L.Util.formatNum(e.latlng.lat, this.options.numDigits);
                
                var lng = this.formatNum(e.latlng.lng, this.options.numDigits);
                var lat = this.formatNum(e.latlng.lat, this.options.numDigits);

                var value = this.options.lngFirst ? lng + this.options.separator + lat : lat + this.options.separator + lng;
                var prefixAndValue = this.options.prefix + ' ' + value;
                if (this.options.zoomLevel) prefixAndValue += ',  ' + this._zoom;
                this._container.innerHTML = prefixAndValue;
        },

        formatNum : function (num, digits) {
                // L.Util.formatNum
                var pow = Math.pow(10, digits || 5);
                var value = Math.round(num * pow) / pow;

                // force num of digits (add 0's)
                var splitValue = value.toString().split('.');
                var d = splitValue[1];
                if (!d) return '';
                var diff = digits - d.length;
                for (var x = 0; x < diff; x++) {
                        d += '0';
                } 
                var enforced = splitValue[0] + '.' + d;
                return enforced;

        },

});

L.Map.mergeOptions({
        positionControl: false
});

L.Map.addInitHook(function () {
        if (this.options.positionControl) {
                this.positionControl = new L.Control.MousePosition();
                this.addControl(this.positionControl);
        }
});

L.control.mouseposition = function (options) {
        return new L.Control.MousePosition(options);
};

// app.Style
Wu.Style = Wu.Class.extend({

	currentTheme : 'lightTheme',

	initialize : function () {
		
		// get style tag
		this._styletag = Wu.DomUtil.get("styletag");

		Wu.Mixin.Events.on('projectSelected', this._projectSelected, this);

	},

	_projectSelected : function (e) {
		var projectUuid = e.detail.projectUuid;
		this._project = app.Projects[projectUuid];
		if (!this._project) return;

		// setTimeout(function () {
			// this._project.getSettings()['darkTheme'] ? this.setDarkTheme() : this.setLightTheme();
		// }.bind(this), 1000)
	},

	setDarkTheme : function () {	

		// append darktheme stylesheet
		var darktheme = document.createElement("link");
		darktheme.rel = 'stylesheet';
		darktheme.href = app.options.servers.portal + 'css/darktheme.css';
		this._styletag.appendChild(darktheme);

		// Set codemirror cartoCSS to dark theme
		this.setDarkThemeCartoCSS();
		this.currentTheme = 'darkTheme';
	},

	setLightTheme : function () {

		// remove darktheme stylesheet
		this._styletag.innerHTML = '';

		// Set codemirror cartoCSS to light theme
		this.setLightThemeCartoCSS();
		this.currentTheme = 'lightTheme';
	},

	setLightThemeCartoCSS : function () {
		var cartoCss = app.MapPane.getControls().cartocss;
		if (!cartoCss) return;
		
		// Set code mirror to light theme
		var cartoCSStheme = Wu.DomUtil.get('cartoCSStheme');
		cartoCss._codeMirror.setOption("theme", "default");
		cartoCSStheme.setAttribute('href', app.options.servers.portal + 'js/lib/codemirror/mode/cartocss/codemirror.carto.css');
	},

	setDarkThemeCartoCSS : function () {
		var cartoCss = app.MapPane.getControls().cartocss;
		if (!cartoCss) return;

		// Set code mirror to darktheme
		var cartoCSStheme = Wu.DomUtil.get('cartoCSStheme');
		cartoCss._codeMirror.setOption("theme", "mbo");
		cartoCSStheme.setAttribute('href', app.options.servers.portal + 'js/lib/codemirror/mode/cartocss/codemirror.carto.darktheme.css');
	},

	getCurrentTheme : function () {
		return this.currentTheme;
	},

	// todo: will overwrite darktheme??
	initSVGpatterns : function () {
		var SVG_patterns = '<!-- SVG fill properties: url(#diagonal-dots) // url(#dots) url(#diagonal-circles) url(#diagonal-stripes) url(#grid) --><svg xmlns="http://www.w3.org/2000/svg"><defs><pattern id="diagonal-dots" x="0" y="0" width="11" height="11" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><circle cx="5" cy="5" r="4" style="stroke:none; fill:blue;" /></pattern></defs><defs><pattern id="dots" x="0" y="0" width="11" height="11" patternUnits="userSpaceOnUse"><circle cx="5" cy="5" r="4" style="stroke:none; fill:red;" /></pattern><pattern id="diagonal-circles" x="0" y="0" width="11" height="11" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><circle cx="5" cy="5" r="4" style="stroke-width:2; stroke:green; fill:none;" /></pattern><pattern id="diagonal-stripes" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><rect x="0" y="0" width="4" height="8" style="stroke:none; fill:purple;" /></pattern><pattern id="grid" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse"><rect x="0" y="0" width="10" height="4" style="stroke:none; fill:orange;" /><rect x="3" y="3" width="4" height="10" style="stroke:none; fill:orange;" /></pattern></defs></svg>';
		this._styletag.innerHTML = SVG_patterns; 
	},

	phantomJS : function () {

		// append darktheme stylesheet
		var phantom = document.createElement("link");
		phantom.rel = 'stylesheet';
		phantom.href = app.options.servers.portal + 'css/phantomJS.css';
		this._styletag.appendChild(phantom);
	},

	phantomJSthumb : function () {

		// append darktheme stylesheet
		var phantom = document.createElement("link");
		phantom.rel = 'stylesheet';
		phantom.href = app.options.servers.portal + 'css/phantomJSthumb.css';
		this._styletag.appendChild(phantom);
	},

	setStyle : function (tag, rules) {

		// set rules 
		jss.set(tag, rules);

		// eg: 
		// jss.set('img', {
		// 	'border-top': '1px solid red',
		// 	'border-left': '1px solid red'
		// });
		// https://github.com/Box9/jss
	},

	getStyle : function (tag) {
		return jss.getAll(tag);
	},


});

Wu.setStyle = Wu.Style.setStyle;
Wu.getStyle = Wu.Style.getStyle;

// keep for handy shortcuts
function darktheme () {
	console.log('darktheme() moved to app.Style.setDarkTheme()')	
}

function lighttheme () {
	console.log('lighttheme() moved to app.Style.setLightTheme()')	
}

function initSVGpatterns () {
	var SVG_patterns = '<!-- SVG fill properties: url(#diagonal-dots) // url(#dots) url(#diagonal-circles) url(#diagonal-stripes) url(#grid) --><svg xmlns="http://www.w3.org/2000/svg"><defs><pattern id="diagonal-dots" x="0" y="0" width="11" height="11" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><circle cx="5" cy="5" r="4" style="stroke:none; fill:blue;" /></pattern></defs><defs><pattern id="dots" x="0" y="0" width="11" height="11" patternUnits="userSpaceOnUse"><circle cx="5" cy="5" r="4" style="stroke:none; fill:red;" /></pattern><pattern id="diagonal-circles" x="0" y="0" width="11" height="11" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><circle cx="5" cy="5" r="4" style="stroke-width:2; stroke:green; fill:none;" /></pattern><pattern id="diagonal-stripes" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><rect x="0" y="0" width="4" height="8" style="stroke:none; fill:purple;" /></pattern><pattern id="grid" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse"><rect x="0" y="0" width="10" height="4" style="stroke:none; fill:orange;" /><rect x="3" y="3" width="4" height="10" style="stroke:none; fill:orange;" /></pattern></defs></svg>';
	Wu.DomUtil.get("styletag").innerHTML = SVG_patterns;
}
// colorArray = [ '#334d5c','#45b29d','#8eddb8','#5fffaf','#0ea32b','#47384d','#a84158','#f224ff','#d85fff','#f21b7f','#f40028','#f15e01','#e27a3f','#ffc557','#dbef91','#df4949','#cfc206','#fff417','#4b84e8','#ffffff' ]

// app.Tooltip
Wu.Tooltip = Wu.Class.extend({

	options : {
		fixed : true,
		target : true, 
		tipJoint : 'middle right', 
		background : "#333", 
		borderColor : '#333',
		className : 'systip',
		delay : 1
	},

	defaultStyle : {
		fixed : true,
		target : true, 
		tipJoint : 'middle right', 
		background : "#333", 
		borderColor : '#333',
		className : 'systip',
		delay : 1
	},	

	initialize : function () {
		this.tips = [];

		// set default opentip style
		Opentip.styles.systyle = this.defaultStyle;
	},

	_isActive : function () {
		return false;//
		var project = app.activeProject;
		if (!project) return false;
		return project.getSettings().tooltips;
	},

	add : function (div, content, options) {
		return;
		
		// merge options
		var opts = _.extend(_.clone(this.options), options);

		// push to list
		this.tips.push({
			div : div,
			content : content,
			options : opts
		});

		// add events (if tooltips setting is active)
		this._isActive() ? this.on() : this.off();
	},

	on : function () { 				
		return;
		// console.error('tooltip on!'); // todo optimize: too many event registered?

		// console.log('on tips!', this.tips);

		// create tooltip
		this.tips.forEach(function (t) {

			// only init once
			if (!t.inited)  {

				// create tip
				if (!t.div || !t.content) return; 
				var tip = new Opentip(t.div, t.content, t.options);

				// mark inited (for events)
				t.inited = true;
				t.tip = tip;
				
				// done
				return;
			} 

			// activate
			if (t.tip) t.tip.activate();

		}, this);

	},

	off : function () {

		// remove tooltip
		this.tips.forEach(function (t) {

			// deactivate
			if (t.tip) t.tip.deactivate();

		}, this);

	},

	// turn on in settings
	activate : function () {

		// register events
		this.on();
	},

	// turn off in settings
	deactivate : function () {

		// deregister events
		this.off();
	},

});
// spinning map
L.SpinningMap = L.Class.extend({

	// todo: refactor GL to own class

	// default options
	options : {

		gl : false,
		accessToken : null, // mapbox
		layer : null,
		logo : '',
		content : '',
		container : 'map',
		speed : 1000,
		tileFormat : 'jpg70',
		position : {
			lat : 59.91843,
			lng : 10.74721,
			zoom : [15, 17]
		},
		circle : {
			radius : 120, // px
			color : 'rgba(33,33,33,0.5)',
			border : {
				px : 4,
				solid : 'solid',
				color : 'white'
			}
		},
		autoStart : false,
		interactivity : false,
		spinning : [
			'spinning',
			'spinning90',
			'spinning270',
			'spinning-reversed',
			'spinning-reversed90',
			'spinning-reversed270',
		],
		listeners : [{
			'event' : null,
			'action' : 'changeView'
		}],
		duration : 100000	// ms

	},

	initialize : function (options) {

		// merge options
		L.setOptions(this, options);

		// set access token
		L.mapbox.accessToken = this.options.accessToken;

		// init 
		this.initLayout();

		// add hooks
		this.addHooks();

		// autostart
		if (this.options.autoStart) this.start();

	},

	initLayout : function () {

		// set wrapper
		this._wrapper = this.options.wrapper || L.DomUtil.create('div', 'spinning-wrapper', document.body);

		// set container
		this._container = this.options.container; // this is spinning 
		this._wrapper.appendChild(this._container);

		// create content
		if (this.options.content) this.initContent();

		// set gl
		this._gl = this.options.gl && mapboxgl.util.supported();
		
		// create map
		this._gl ? this.initGLMap() : this.initMap();

		// Get wrapper
		this._loginForm = L.DomUtil.get('login-form');
		L.DomUtil.addClass(this._loginForm, this.options.logoBackgroundClass);

		console.log('this._loginForm', this._loginForm, this.options.logoBackgroundClass);

		// this._loginForm.style.backgroundColor = this.options.logoBackground;


		// set logo
		this._logo = L.DomUtil.get('login-logo');
		var img = 'url("' + this.options.loginLogo + '")';
		this._logo.style.backgroundImage = img;


		
		
	},

	initContent : function () {

		// get content and append to wrapper
		var content = this.options.content;
		this._wrapper.appendChild(content);
	},	


	initMap : function () { 

		// set dimensions of container
		this.setDimensions();
		
		// create map
		this.createMap();

		// create circle
		if (!!this.options.circle) this.createCircle();

		// set window resize event listener
		L.DomEvent.on(window, 'resize', this.setDimensions, this);

	},

	disable : function () {
		Wu.DomUtil.remove(this._wrapper);
		setTimeout(this.kill, 1000);
	},

	kill : function () {
		this._wrapper = null;
		delete this._wrapper;
		delete this._map;
		delete this._container;
		delete this; // bye!
	},

	
	createMap : function () {

		// set vars
		var lat = this.options.position.lat,
		    lng = this.options.position.lng,
		    zoom = this.options.position.zoom;

		// create map
		var map = this._map = L.mapbox.map(this._container, {
			attributionControl : true
		});

		// add layer
		var layer = L.mapbox.tileLayer(this.options.layer, {
			format : this.options.tileFormat,

		}).addTo(map);

		// set map options
		// this.setView(lat, lng, this._getZoomLevel());
		this.changeView();
		
		// set map options
		if (!this.options.interactivity) {
			map.dragging.disable();
			map.touchZoom.disable();
			map.doubleClickZoom.disable();
			map.scrollWheelZoom.disable();
			map.boxZoom.disable();
			map.keyboard.disable();
		}

		// remove zoom and attribution
		map.zoomControl.removeFrom(map);
		// map.attributionControl.removeFrom(map);

	},

	setView : function (lat, lng, zoom) {
		this._map.setView([lat, lng], zoom);
	},

	changeView : function () {
		var lat = this.options.position.lat,
		    lng = this.options.position.lng;

		var place = this._getPlace();

		// set view
		this.setView(place.lat, place.lng, place.zoom);
		
		// restart to change direction
		this.stop();
		this.start();
	},

	_getPlace : function () {
		
		var place = this._places[Math.floor(Math.random() * this._places.length)];
		return place;
		
	},


	_places : [
		{ 
			lat : 40.789, // nyc
			lng : -73.953,
			zoom : 15
		},
		
		{
			lat : 59.91843,
			lng : 10.74721,
			zoom :  14 	// oslo

		},
		{
			lat: 37.789, 
			lng: -122.4,
			zoom : 16 	// sf
		},

		{
			lat : 35.71, 
			lng : 139.821, 
			zoom : 14 	// tokyo
		},
		{
			lat : -2.68, 
			lng : -65.915, 
			zoom : 8 	// amazonas
		},

		{
			lat: 15.089, 
			lng : 39.922, 
			zoom : 10 	// eritrea
		}
	],


	addHooks : function () {
		var map = this._map;
		// map.on('resize', this._onResize.bind(this));
	},

	removeHooks : function () {
		var map = this._map;
		map.off('resize', this._onResize.bind(this));
	},

	contentClick : function () {
		this._resetMoves();
		if (this._gl) this.changeViewGL();
	},

	_onResize : function () {

		// // sizes
		// var newSize = this._container.offsetWidth,
	 //    	    oldSize = this._past || newSize,
	 // 	    diff = oldSize - newSize,
	 // 	    moved = diff/2 * 0.75;
		// this._past = newSize;

		// // set centre to circle
		// this._map.panBy([-moved, 0], {
		// 	duration : 0
		// });

	},

	createCircle : function () {
		return;
		// create divs
		this._circleContainer = L.DomUtil.create('div', 'startpane-circle-container', this._wrapper);
		this._circle = L.DomUtil.create('div', 'startpane-circle', this._circleContainer);

		var radius = this.options.circle.radius,
		    b = this.options.circle.border,
		    border = b.px + 'px ' + b.solid + ' ' + b.color;
		
		// set circle options
		this._circle.style.width = radius + 'px';
		this._circle.style.height = radius + 'px';
		this._circle.style.borderRadius = radius + 'px';
		this._circle.style.top = radius / -2 + 'px';
		this._circle.style.left = radius / -2 + 'px';
		this._circle.style.background = this.options.circle.color;
		this._circle.style.border = border;

		// change view on click
		if (!this._gl) L.DomEvent.on(this._circle, 'mousedown', this.changeView, this);
		if (this._gl) L.DomEvent.on(this._circle, 'mousedown', this.changeViewGL, this);
	},

	setDimensions : function () {
		
		// get dimensions		
		var d = this._getDimensions();

		var offsetLeft = d.width * 0.125 - d.width,
		    offsetTop = d.height * 0.5 - d.width;

		// set dimensions
		// this._container.style.height = d.width * 2 + 'px';
		// this._container.style.width = d.width * 2 + 'px';
		// this._container.style.top = offsetTop + 'px';
		// this._container.style.left = offsetLeft + 'px';

	},

	// get window dimensions
	_getDimensions : function (e) {
		var w = window,
		    d = document,
		    e = d.documentElement,
		    g = d.getElementsByTagName('body')[0],
		    x = w.innerWidth || e.clientWidth || g.clientWidth,
		    y = w.innerHeight|| e.clientHeight|| g.clientHeight,
		    d = {
			height : y,
			width : x
		    }
		return d;
	},

	// start spinning
	start : function () {
		// this._gl ? this._startGL() : this._start();
	},

	// stop spinning
	stop : function () {
		// this._gl ? this._stopGL() : this._stop();
	},

	_start : function () {
		this._direction = this._getDirection();
		L.DomUtil.addClass(this._container, this._direction);
	},

	_stop : function () {
		L.DomUtil.removeClass(this._container, this._direction);
	},

	// get direction of spin
	_getDirection : function () {
		var arr = this.options.spinning;
		var key = Math.floor(Math.random() * arr.length);
		return arr[key];
	},

	// get zoom level
	_getZoomLevel : function (current) {
		var min = this.options.position.zoom[0];
		var max = this.options.position.zoom[1];
		var random = Math.floor(Math.random() * (max - min) + min);

		var items = [3, 5, 13, 14];

		var item = items[Math.floor(Math.random()*items.length)];

		console.log('item', item);

		var map = this._map._container.firstChild;
		window._map = this._map;
		map.style = 'transform: rotate(90deg); left: 100%;'

		// var turns = [
		// 	'turn-right',
		// 	'turn-left'
		// ]

		// var turn = turns[Math.floor(Math.random()*turns.length)];

		// L.DomUtil.removeClass(map, 'turn-right');
		// L.DomUtil.removeClass(map, 'turn-left');

		// L.DomUtil.addClass(map, turn);

		// return 1;
		return item;
	},










	// GL from here on. refactor to own class

	createGLmap : function () {

		// set vars
		var lat = this.options.position.lat,
		    lng = this.options.position.lng,
		    zoom = this._getZoomLevel(),
		    accessToken = this.options.accessToken,
		    container = this._container,
		    tileset = this.options.layer;

		// set access token
		mapboxgl.accessToken = accessToken;

		// create map
		var map = this._map = new mapboxgl.Map({
			container: this._container.id, // container id
			style: {
				"version": 6,
				"sources": {
					"simple-tiles": {
						"tiles": "raster",
						"url": "mapbox://" + tileset,
						"tileSize": 256,
						"type": "raster"
					}
				},
				"layers": [{
					"id": "simple-tiles",
					"type": "raster",
					"source": "simple-tiles",
					"minzoom": 0,
					"maxzoom": 22
				}]
			},
			// interactive : false,
			center: [lat, lng], 	// starting position
			zoom: zoom 		// starting zoom
		});

	},

	

	// _moveEnd : -1,
	// _moveStart : false,

	// _onMoveend : function (e) {
	// 	console.log('on move end', e);
	// 	this._moveEnd += 1;

	// 	if (this._moveStart && this._moveEnd == 3) {
	// 		this._realMoveEnd();
	// 	}
	// },

	// _onMovestart : function () {
	// 	console.log('on move start');
	// 	this._moveStart = true;
	// },

	// _resetMoves : function () {
	// 	console.log('clear!');
	// 	this._moveStart = false;
	// 	this._moveEnd = 0;
	// },

	// _realMoveEnd : function () {
	// 	this._resetMoves();
	// 	console.log('real end!!');
	// 	this.restartGLRotation();
	// },

	// _onZoom : function () {
	// 	console.log('on zoom');
	// },

	// _onMove : function () {
	// 	console.log('move');
	// },



	initGLMap : function () {

		// extend gl
		this._extendMapboxGL();

		// create map
		this.createGLmap();

		// create circle
		this.createCircle();

	},


	_extendMapboxGL : function () {

		// overwrite normalizer
		mapboxgl.Map.prototype._normalizeBearing = function (bearing) {
			console.log('_normalizeBearing');
			return bearing;
		}

	},

	

	panGL : function () {

		var w = this._container.offsetWidth;
		var pan = this._pan = w * 0.375;

		// set centre to circle
		this._map.panBy([pan, 0], {
			duration : 0
		});

	},

	restartGLRotation : function () {
		clearTimeout(this._rotationTimer);
		this.startGLRotation();
	},

	startGLRotation : function () {

		var duration = this.options.duration,
		    latlng = new mapboxgl.LatLng(37.76, -122.44),
		    w = this._container.offsetWidth,
		    left = w * -0.375,
		    offset = this._getOffset();

		// set bearing
		if (!this._deg) this._deg = 90;

		// rotate map
		this._map.rotateTo(this._deg, {
			duration : duration,
			offset : offset,
			easing : function (a) {
				return a;
			},
		});

		// rerun
		this._rotationTimer = setTimeout(this.startGLRotation.bind(this), duration);

		// change degrees
		this._deg = this._deg + 90;

	},

	// _adjustContainer : function () {
	// 	var w = this._container.offsetWidth,
	// 	    width = w * 1.75,
	// 	    left = -w + w * 0.250;
	// 	this._container.style.width = width + 'px';
	// 	this._container.style.left = left + 'px';
	// },

	
	changeViewGL : function () {

		
		// current bearing
		var currentBearing = this._map.getBearing();

		// random bearing
		var bearing = this._bearing = this._bearing ? this._bearing + 90 : 90;
		if (this._bearing >= 360) this._bearing = 0; 

		// difference in bearing. if negative, rotates clockwise
		var diff = bearing - currentBearing;

		// calc offset
		var offset = this._getBearingOffset(bearing);

		// get options
		var lat = this.options.position.lat,
		    lng = this.options.position.lng,
		    zoom = this._getZoomLevel(this._map.getZoom());

		// fly to
		this._map.flyTo([lat, lng], zoom, bearing, {
			offset : offset,
			speed : 0.8
		});

	},


	_getBearingOffset : function (bearing) {

		// calc offset
		var off = this._getOffset(),
		    left = off[0];

		// decide offset 
		if (bearing == 90) {
			// south
			var offset = [0, left];
		}
		if (bearing == 180) {
			// west
			var offset = [-left, 0];
		}
		if (bearing == 270) {
			// north
			var offset = [0, -left];
		}
		if (bearing == 360 || bearing == 0) {
			// east
			var offset = [left, 0];
		}

		return offset;

	},

	_randomIntFromInterval : function (min,max) {
    		return Math.floor(Math.random()*(max-min+1)+min);
	},
	

	_getOffset : function (inverse) {
		var w = this._container.offsetWidth;
		var left = w * -0.375;
		if (inverse) return [0, left];
		return [left, 0];
	},

	

	_startGL : function () {
		this.panGL();
		this.startGLRotation();
	},

	_stopGL : function () {

	},

	
});



Wu.Popup = {};
Wu.Popup.Chart = L.Control.extend({
	includes: L.Mixin.Events,

	options: {
		minWidth: 50,
		maxWidth: 300,
		// maxHeight: null,
		autoPan: true,
		closeButton: true,
		offset: [0, 7],
		autoPanPadding: [0, 0],
		autoPanPaddingTopLeft: L.point(10, 40),
		autoPanPaddingBottomRight: L.point(10, 20),
		keepInView: false,
		className: '',
		zoomAnimation: false,
		defaultPosition : {
			x : 7,			
			y : 6
		}
	},



	initialize: function (options) {

		// set options
		L.setOptions(this, options);
		this._map = app._map;
		this._pane = this.options.appendTo;

		// listen to events
		this._listen();

		// init container
		this._initLayout();
	},

	_addEvents : function () {
		
		this._map.on({
			preclick : this.close
		}, this);
	},

	_removeEvents : function () {
		
		this._map.off({
			preclick : this.close
		}, this);
	},

	_initLayout : function () {

		// create container
		var container = this._container = Wu.DomUtil.create('div', 'leflet-container leaflet-popup leaflet-zoom-hide');

		// close button
		if (this.options.closeButton) {
			var closeButton = this._closeButton = Wu.DomUtil.create('a', 'leaflet-popup-close-button', container);
			closeButton.href = '#close';
			closeButton.innerHTML = '&#215;';
			L.DomEvent.disableClickPropagation(closeButton);
			L.DomEvent.on(closeButton, 'mouseup', this._onCloseButtonClick, this);
		}
		
		// create wrapper
		var wrapper = this._wrapper = L.DomUtil.create('div', 'leaflet-popup-content-wrapper', container);

		// draggable pane
		this._initDraggable();

		// content
		this._contentNode = L.DomUtil.create('div', 'leaflet-popup-content', wrapper);

		// events
		L.DomEvent.disableScrollPropagation(this._contentNode);
		L.DomEvent.on(wrapper, 'contextmenu', L.DomEvent.stopPropagation);

	},

	_onCloseButtonClick : function (e) {
		this.close();
		L.DomEvent.stop(e);
	},

	_add : function () {

		// append
		this._pane.appendChild(this._container);

		// add events
		this._addEvents();

		this._added = true;
	},

	_remove : function () {
		if (!this._added) return;
		
		// remove
		try {
			this._pane.removeChild(this._container);
		} catch (e) {}; // lazy hack
		
		// remove events
		this._removeEvents();
	},

	open : function () {
		// add if not added
		if (!this._added) this._add();
	
		this._map.fire('popupopen')
	},

	close : function () {
		this._map.fire('popupclose')
		this._remove();
	},

	getContent: function () {
		return this._content;
	},

	setContent: function (content) {
		this._content = content;
		this.update();
		return this;
	},

	update: function () {
		if (!this._map) return;

		this._container.style.visibility = 'hidden';

		this._updateContent();
		this._updatePosition();

		this._container.style.visibility = '';
	},

	_updateContent: function () {
		if (!this._content) return;

		if (typeof this._content === 'string') {
			this._contentNode.appendChild(this._content);
		} else {
			while (this._contentNode.hasChildNodes()) {
				this._contentNode.removeChild(this._contentNode.firstChild);
			}
			this._contentNode.appendChild(this._content);
		}
	},

	_updatePosition: function () {

		// set saved position
		var pos = this.getSavedPosition();
		if (pos) return this.setPosition(pos);

		// If left pane is open
		if ( app.Chrome.Left._isOpen ) {
			var dims = app.Chrome.Left.getDimensions();
			var _x = dims.width + 10;
			var _y = this.options.defaultPosition.y;
			var pos = { x : _x, y : _y }	
			return this.setPosition(pos);		
		}

		// If right pane is open
		if ( app.Chrome.Right._isOpen ) {
			var dims = app.Chrome.Right.getDimensions();
			var _x = dims.width + 10;
			var _y = this.options.defaultPosition.y;
			var pos = {  x : _x, y : _y }
			return this.setPosition(pos);
		}		

		// or, set default, set from bottom
		var pos = this.options.defaultPosition;
		this.setPosition(pos);
	},

	getSavedPosition : function () {
		var project = app.activeProject;
		var pos = project.getPopupPosition();
		return pos;
	},

	_initDraggable : function () {

		// create drag pane
		var dragPane = Wu.DomUtil.create('div', 'leaflet-popup-drag', this._wrapper);

		// event
		Wu.DomEvent.on(dragPane, 'mousedown', this._dragStart, this);
	},

	_dragStart : function (e) {

		// get mouse pos offset in relation to popup
		var popupPosition = {
			x : this._container.offsetLeft,
			y : this._container.offsetTop
		}

		var mousePosition = {
			x : e.x,
			y : e.y
		}

		var p = popupPosition;
		var m = mousePosition;

		// calc offset
		this._mouseOffset = {
			x : m.x - p.x,
			y : m.y - p.y
		}

		// set window height
		this._windowDimensions = this._getWindowDimensions();

		// create ghost pane
		this._ghost = Wu.DomUtil.create('div', 'leaflet-popup-ghost', app._appPane);

		// events
		Wu.DomEvent.on(this._ghost, 'mouseup', this._dragStop, this);
		Wu.DomEvent.on(this._ghost, 'mousemove', this._dragging, this);

	},

	_dragStop : function (e) {

		// remove events
		Wu.DomEvent.off(this._ghost, 'mouseup', this._dragStop, this);
		Wu.DomEvent.off(this._ghost, 'mousemove', this._dragging, this);
		
		// remove ghost div
		Wu.DomUtil.remove(this._ghost);

		// save position
		var project = app.activeProject;
		project.setPopupPosition(this._lastPopupPos);
	},

	_dragging : function (e) {

		var window_height = this._windowDimensions.height;

		// calc pos
		var diff = {
			x : e.offsetX - this._mouseOffset.x,
			y : window_height - (e.offsetY - this._mouseOffset.y) - this._container.offsetHeight // todo: calc from bottom instead
		}

		// set pos
		this.setPosition({
			x : diff.x,
			y : diff.y
		});
	},

	_getWindowDimensions : function () {
		
		var dims = {};
		dims.width = window.innerWidth
			|| document.documentElement.clientWidth
			|| document.body.clientWidth;

		dims.height = window.innerHeight
			|| document.documentElement.clientHeight
			|| document.body.clientHeight;
		return dims;
	},

	setPosition : function (position, bottom) {

		// set left
		this._container.style.left = position.x + 'px';

		// set bottom
		this._container.style.bottom = position.y + 'px';

		// remember last pos
		this._lastPopupPos = position;
	},

	_listen : function () {
		Wu.Mixin.Events.on('layerDeleted',    this._onLayerDeleted, this);
		Wu.Mixin.Events.on('layerDisabled',    this._onLayerDeleted, this);
	},

	// clean up
	_onLayerDeleted  : function () {
		this.close();
	},


	
});

Wu.popup = function (options, source) {
	return new Wu.Popup.Chart(options, source);
};

Wu.Control.Chart = Wu.Control.extend({

	initialize : function(options) {

		// OTHER OPTIONS
		var multiPopUp = options.multiPopUp;
		var e = options.e;

		if ( multiPopUp ) {

			// Get pop-up settings
			var _layer = this._getWuLayerFromPostGISLayer(multiPopUp.layer_id);
			this.popupSettings = _layer.getTooltip();

			// Create content
			var content = this.multiPointPopUp(multiPopUp);


		} else {

			if (!e) {
				console.error('no "e" provided?');
				return;
			}

			// Get pop-up settings
			this.popupSettings = e.layer.getTooltip();

			// Create content
			var content = this.singlePopUp(e);

		}

		// clear old popup
		this._popup = null;

		// return if no content
		if (!content) return;

		// Create empty		
		if (!this._popupContent) this._popupContent = '';
			
		// append content
		this._popupContent = content;

		// Open popup
		this.openPopup(e, multiPopUp);

	},


	// Open pop-up
	openPopup : function (e, multiPopUp) {

		if (this._popup) return;

		var popup   = this._createPopup(),
		    content = this._popupContent,
		    map     = app._map,
		    project = this._project || app.activeProject;

		// set latlng
		var latlng = multiPopUp ? multiPopUp.center : e.latlng;
		
		// return if no content
		if (!content) return this._clearPopup();
		
		// set popup close event
		this._addPopupCloseEvent();

		// keep popup while open
		this._popup = popup;

		// set content
		popup.setContent(content);

		// open popup
		popup.open();

		// show marker on popup, but not on multi cause polygon
		if (!multiPopUp) {

			// set latlng
			var latlng = this._getMarkerPosition(latlng, e);
			
			// Add marker circle
			this._addMarkerCircle(latlng);
		}
		
	},

	_getMarkerPosition : function (latlng, e) {

		// try to calculate true position of point, instead of mouse pos. need to look in data. 
		// this is kinda specific to globesar's data, but could be made pluggable.

		// var latlng = L.Projection.Mercator.unproject({x:e.data.north, y:e.data.east}); // wrong conversion, wrong epsg?

		return latlng;
	},

	// Add marker circle (not working)
	_addMarkerCircle : function (latlng) {

		var styling = { 
			radius: 10,
			fillColor: "white",
			color: "white",
			weight: 15,
			opacity : 1,
			fillOpacity: 0.4
		}

		this.popUpMarkerCircle = L.circleMarker(latlng, styling).addTo(app._map);
	},

	_addPopupCloseEvent : function () {
		if (this._popInit) return;
		this._popInit = true;	// only run once

		var map = app._map;
		map.on('popupclose',  this._clearPopup, this);
	},

	_removePopupCloseEvent : function () {
		var map = app._map;
		map.off('popupclose',  this._clearPopup, this);
	},

	_refresh : function () {

		if (this._popup) this._popup._remove();
		
		this._clearPopup(false);
	},

	_clearPopup : function (clearPolygons) {
		
		// clear polygon
		if (clearPolygons) app.MapPane.getControls().draw._clearAll();

		// nullify
		this._popupContent = '';
		this._popup = null;

		// remove marker
		this.popUpMarkerCircle && app._map.removeLayer(this.popUpMarkerCircle);

		// remove event
		this._removePopupCloseEvent();
	},
	
	// Create leaflet pop-up
	_createPopup : function () {

		// Create smaller pop-up if there are no graphs to show
		if ( !this.popupSettings.timeSeries || this.popupSettings.timeSeries.enable == false ) {
			var maxWidth = 200;
			var minWidth = 200;

		// Create large pop-up for graph
		} else {
			var maxWidth = 400;
			var minWidth = 200;			
		}

		// create popup
		var popup = this._popup = Wu.popup({
			offset : [18, 0],			
			closeButton : true,
			zoomAnimation : false,
			maxWidth : maxWidth,
			minWidth : minWidth,
			maxHeight : 350,
			appendTo : app._appPane // where to put popup
		});



		if ( !this.popupSettings.timeSeries || this.popupSettings.timeSeries.enable == false ) {
			Wu.DomUtil.addClass(popup._container, 'tiny-pop-up')
		}


		return popup;
	},



	// Create single point C3 pop-up content
	singlePopUp : function (e) {

		// check if timeseries
		var timeSeries = (this.popupSettings.timeSeries && this.popupSettings.timeSeries.enable == true );

		// create content, as timeseries or normal
		var content = timeSeries ? this.singleC3PopUp(e) : this._createPopupContent(e);

		return content;
	},

	// Create "normal" pop-up content without time series
	_createPopupContent : function (e) {


		var c3Obj = {
			data : e.data,
			layer : e.layer,
			layerName : e.layer.store.title,
			meta : false,
			popupSettings : this.popupSettings,
			d3array : {
		    		meta 	: [],
		    		xName 	: 'field_x', 
		    		yName 	: 'mm',
		    		x 	: [],
		    		y 	: [],
		    		ticks 	: [],
		    		tmpTicks : []
			},
			multiPopUp : false
		}

		this._c3Obj = this.createC3dataObj(c3Obj);

		var headerOptions = {
			headerMeta 	: this._c3Obj.d3array.meta,
			layerName 	: e.layer.store.title,
			areaSQ 		: false,
			pointCount 	: false,
			multiPopUp 	: false,
			layer 		: e.layer
		}

		// Create HTML
		var _header = this.createHeader(headerOptions);
		var _chartContainer = this.createChartContainer();
		var _footer = this.createFooter();

		var content = Wu.DomUtil.create('div', 'popup-inner-content');
		content.appendChild(_header);
		content.appendChild(_chartContainer);
		content.appendChild(_footer)


		return content;		
	},	


	singleC3PopUp : function (e) {

		var c3Obj = {
			data : e.data,
			layer : e.layer,
			meta : false,
			popupSettings : this.popupSettings,
			d3array : {
		    		meta 	: [],
		    		xName 	: 'field_x', 
		    		yName 	: 'mm',
		    		x 	: [],
		    		y 	: [],
		    		ticks 	: [],
		    		tmpTicks : []
			},
		}

		this._c3Obj = this.createC3dataObj(c3Obj);

		var headerOptions = {
			headerMeta 	: this._c3Obj.d3array.meta,
			layerName 	: e.layer.store.title,
			areaSQ 		: false,
			pointCount 	: false,
			multiPopUp 	: false,
			layer 		: e.layer
		}


		var content = Wu.DomUtil.create('div', 'popup-inner-content');

		// Create header HTML
		var _header = this.createHeader(headerOptions);
		var _chartContainer = this.createChartContainer();
		var _footer = this.createFooter();
		content.appendChild(_header);
		content.appendChild(_chartContainer);
		content.appendChild(_footer);

		// Create graph HTML
		if ( this.popupSettings && this.popupSettings.timeSeries.enable != false) {
			
			var _chart = this.C3Chart(this._c3Obj);
			var _chartTicks = this.chartTicks(this._c3Obj);
			_chartContainer.appendChild(_chart);
		
		}

		return content;			
	},


	_calculateRegression : function (c) {

		var c = this._c3object;
		var x = []; // dates
		var start_date;

		var y_ = _.clone(c.d3array.y);
		y_.splice(0,1);
		
		var y = [];
		y_.forEach(function (value) {
			y.push(parseFloat(value));
		});

		var dates = _.clone(c.d3array.x);
		dates.splice(0,1);

		dates.forEach(function (d, i) {
			if (i == 0) {
				// set start date
				start_date = moment(d);
				x.push(0);

			} else {
				// days since start_date
				var b = moment(d);
				var diff_in_days = b.diff(start_date, 'days');
				x.push(diff_in_days);
			}
		});

		var xx = [];
		var xy = [];

		x.forEach(function (x_, i) {
			xy.push(x[i] * y[i]);
			xx.push(x[i] * x[i]);
		});

		var x_sum = 0;
		var y_sum = 0;
		var xx_sum = 0;
		var xy_sum = 0;

		x.forEach(function (value, i) {
			x_sum += value;
		});

		y.forEach(function (value, i) {
			y_sum += value;
		});

		xx.forEach(function (value, i) {
			xx_sum += value;
		});

		xy.forEach(function (value, i) {
			xy_sum += value;
		});

		var n = y.length;
		var result_a = ((y_sum * xx_sum) - (x_sum * xy_sum)) / ((n * xx_sum) - (x_sum * x_sum));
		var result_b = ((n * xy_sum) - (x_sum * y_sum)) / ((n * xx_sum) - (x_sum * x_sum));
		var result_y_start = result_a + (result_b * x[0])
		var result_y_end = result_a + (result_b * x[x.length-1]);


		// var reg = ['regression', result_y_start, result_y_end];

		// need every step 
		var reg = ['regression'];
		y.forEach(function (y_, i) {
			if (i == 0) {
				reg.push(result_y_start);
			} else {
				var val = (result_y_end / n) * (i);
				reg.push(val);
			}
		});

		return reg;

	},

	// Create multi point C3 pop-up content
	multiPointPopUp : function (_data) {

		var _average = _data.average;
		var _center = _data.center;
		var _layer = this._getWuLayerFromPostGISLayer(_data.layer_id);
		var _layerName = _layer.store.title;
		var _totalPoints = _data.total_points;

		// Show square meters if less than 1000
		if ( _data.area < 1000 ) {

			var area = Math.round(_data.area);
			var _areaSQ = area + 'm' + '<sup>2</sup>';

		// Show square KM if more than 1000 (0.01 km2)
		} else {

			var area = _data.area / 1000000;
			var areaRounded = Math.floor(area * 1000) / 1000;
			var _areaSQ = areaRounded + 'km' + '<sup>2</sup>';
		}		

		
		var c3Obj = {

			data 		: _average,
			meta 		: false,
			popupSettings 	: this.popupSettings,
			d3array 	: {
				    		meta 	: [],
				    		xName 	: 'field_x', 
				    		yName 	: 'mm',
				    		x 	: [],
				    		y 	: [],
				    		ticks 	: [],
				    		tmpTicks : []
			},
			multiPopUp : {
					center 		: _center,
			}

		}

		this._c3Obj = this.createC3dataObj(c3Obj);


		var headerOptions = {
			headerMeta 	: this._c3Obj.d3array.meta,
			layerName 	: _layerName,
			areaSQ 		: _areaSQ,
			pointCount 	: _totalPoints,
			multiPopUp 	: true,
			layer 		: _layer
		}


		var content = Wu.DomUtil.create('div', 'popup-inner-content');

		// Create header
		var _header = this.createHeader(headerOptions);
		var _chartContainer = this.createChartContainer();
		var _footer = this.createFooter();
		content.appendChild(_header);
		content.appendChild(_chartContainer);
		content.appendChild(_footer);


		if ( this.popupSettings.timeSeries && this.popupSettings.timeSeries.enable == true ) {

			// Create chart
			var _chart = this.C3Chart(this._c3Obj);
			var _chartTicks = this.chartTicks(this._c3Obj);
			_chartContainer.appendChild(_chart);

		}

		

		return content;
	},		




	// xoxoxoxoxoxoxo
	chartTicks : function (c3Obj) {

		// Data
		var data = c3Obj.d3array;

		// Ticks
		var t = data.ticks;

		// var first_data_point = t[0]; // wrong, first tick is actually second data point
		var first_data_point = data.x[1];
		var last_data_point = data.x[data.x.length -1];

		// start/end date
		var start = moment(first_data_point).format("DD.MM.YYYY");
		var end = moment(last_data_point).format("DD.MM.YYYY");	

		this._footerDates.innerHTML = '<span class="start-date">' + start + '</span><span class="end-date">' + end + '</span>';
	},


	// PRODUCE HTML
	// PRODUCE HTML
	// PRODUCE HTML		

	createFooter : function () {
		var footerContainer = this._footerContainer = Wu.DomUtil.create('div', 'c3-footer');

		var dates = this._footerDates = Wu.DomUtil.create('div', 'c3-footer-dates', footerContainer);
		return footerContainer;
	},


	createChartContainer : function () {
		var chartContainer = this._chartContainer = Wu.DomUtil.create('div', 'c3-chart-container');
		return chartContainer;
	},


	// Header
	createHeader : function (options) {

		// get vars
		var headerMeta = options.headerMeta;
		var layerName  = options.layerName;
		var areaSQ     = options.areaSQ;
		var pointCount = options.pointCount;
		var multiPopUp = options.multiPopUp;


		// If custom title
		if ( this.popupSettings.title && this.popupSettings.title != '' ) {
			layerName = this.popupSettings.title
		}

		// Container
		var container = Wu.DomUtil.createId('div', 'c3-header-metacontainer');

		// If not time series, make small pop-up
		if ( !this.popupSettings.timeSeries || this.popupSettings.timeSeries.enable == false ) {
			container.className = 'small-pop-up';
		}

		// Header
		var headerWrapper = Wu.DomUtil.create('div', 'c3-header-wrapper', container);
		var headerName = Wu.DomUtil.create('div', 'c3-header-layer-name', headerWrapper, layerName)

		// add more text for multiquery
		if (multiPopUp) {
			
			// set geom text based on type
			var geom_type = options.layer.getMeta().geometry_type;
			var geom_text = 'items'
			if (geom_type == 'ST_Point') geom_text = 'points';
			if (geom_type == 'ST_MultiPolygon') geom_text = 'polygons';

			// set text
			var plural = 'Sampling ' + pointCount + ' ' + geom_text + ' over approx. ' + areaSQ;
			var _pointCount = Wu.DomUtil.create('div', 'c3-point-count', headerWrapper, plural);
		}


		var c = 0;
		headerMeta.forEach(function(meta, i) {

			var _key = meta[0];
			var _val = meta[1];

			var setting = this.popupSettings ? this.popupSettings.metaFields[_key] : false;

			if (!setting) return;

			if ( _key == 'geom' || _key == 'the_geom_3857' || _key == 'the_geom_4326' ) return;
			
			// Do not show field if there is no value
			if ( !_val ) return;

			// Do not show field if it's been set to "off" in settings!
			if ( setting.on == false ) return;

			// Use title from settings, if there is one
			if (  setting.title && setting.title != '' ) {
				var title = setting.title
			} else {
				var title = _key;
			}

			c++;

			var roundedVal = 100;

			if ( roundedVal ) {
				var newVal = Math.floor(parseFloat(_val) * roundedVal) / roundedVal;

				if (!isNaN(newVal)) {
					_val = newVal;
				}
				
			}



			if ( _val ) {
				var metaPair = Wu.DomUtil.create('div', 'c3-header-metapair metapair-' + c, container);
				var metaKey = Wu.DomUtil.create('div', 'c3-header-metakey', metaPair, title);
				var metaVal = Wu.DomUtil.create('div', 'c3-header-metaval', metaPair, _val);
			}

		}.bind(this));

		return container;

	},

	// Chart
	C3Chart : function (c3Obj) {
		
		var data = c3Obj.d3array;

		// Ticks
		var t = data.ticks;

		// X's and Why's
		var x = data.x;
		var y = data.y;

		// Get first TICK date and the first X date
		var firstTickDate = t[0];
		var firstXDate = x[0];

		// If the first X date is more recent than the first TICK date,
		// remove the first tick date.
		if ( firstXDate > firstTickDate ) t.splice(0,1);	
		
		// Get min and max Y
		var minY = Math.min.apply(null, y);
		var maxY = Math.max.apply(null, y);

		// Get range
		var range;

		var settingsRange = c3Obj.popupSettings.timeSeries.minmaxRange;
	
		// Use range from settings
		if ( settingsRange ) {
	
			range = parseInt(settingsRange);
	
		// Use dynamic range based on current point
		} else {
		
			if ( minY < 0 ) {
				var convertedMinY = Math.abs(minY);
				if ( convertedMinY > maxY ) 	range = convertedMinY;
				else 				range = maxY;
			} else {
				range = Math.floor(maxY * 100) / 100;
			}

		}

		this._range = range;

		// Column name
		var xName = data.xName;
		var yName = data.yName;

		// Add column name to X and Y (required by C3)
		x.unshift(xName);
		y.unshift(yName);

		_columns = [x, y];


		// Create container
		var _C3Container = Wu.DomUtil.createId('div', 'c3-container');	


		// CHART SETTINGS
		var chart = this._chart = c3.generate({
		        
		        interaction : true,

		        bindto: _C3Container,
		        
			size: {
				height: 200,
				width: 430
			},

			point : {
				show : false,
				r: 3,
			},

			grid: { y: { show: true },
				x: { show: true }
			},

			legend: {
				show: false
			},		

			zoom : {
				enabled : false,
				
			},
		        data: {

		                xs: {
		                        mm: 'field_x',
		                        regression : 'reg_x'
		                },

		                columns: _columns,

		                colors : {
		                	mm: '#0000FF',
		                	regression: '#C83333'
		                },
		                types: {
		                	mm : 'scatter',
		                	regression : 'line'
		                }
		        },



		        axis: {

		                x: {
		                        type: 'timeseries',
		                        localtime: false,
		                        tick: {
		                                format: '%Y',
		                                values: [],
		                                multiline: true
		                        }
		                },

		                y: {
		                	max : range,
		                	min : -range,
					tick: {
						format: function (d) { return Math.floor(d * 100)/100}
					}
		                },

		              

		        },

			tooltip: {
				grouped : true,
				format: {
					title: function (d) { 
						var nnDate = moment(d).format("DD.MM.YYYY");
						return nnDate;
					},
				},
				
			},	        

			color: {
				pattern: ['#000000']
			}		        
		});


		// add zoom events
		this._addChartEvents(_C3Container);

		// add regression button
		this._addRegressionButton();

		return _C3Container;
	},


	_addRegressionButton : function () {


		var w = Wu.DomUtil.create('div', 'regression-button-wrapper', this._footerContainer);

		this.regressionButton = new Wu.button({ 
			type 	  : 'switch',
			isOn 	  : false,
			right 	  : false,
			id 	  : 'regression-button',
			appendTo  : w,
			fn 	  : this._updateRegression.bind(this),
			className : 'relative-switch'
		})

		// label
		var label = Wu.DomUtil.create('label', 'invite-permissions-label', w);
		label.htmlFor = 'regression';
		label.appendChild(document.createTextNode('Regression'));


	},

	_updateRegression : function (e) {

		var elem = e.target;
		var on = elem.getAttribute('on');

		if ( on == 'false' || !on ) {

			Wu.DomUtil.addClass(elem, 'switch-on');
			elem.setAttribute('on', 'true');

			// get regression 
			var reg = this._calculateRegression();
			var x = this._c3Obj.d3array.x;

			var reg_y = [reg[0], reg[1], reg[reg.length-1]];
			var reg_x = ['reg_x', x[1], x[x.length-1]];

			// add to chart
			this._chart.load({
				columns: [reg_x, reg_y]
			});

			// analytics/slack
			app.Analytics.onEnabledRegression();
		
		} else {

			Wu.DomUtil.removeClass(elem, 'switch-on');
			elem.setAttribute('on', 'false');

			this._chart.unload({
				ids : 'regression'
			})

		}
		
	},


	_addChartEvents : function (div) {

		// mousewheel zoom on chart
		Wu.DomEvent.on(div, 'mousewheel', _.throttle(this._onChartMousemove, 50), this); // prob leaking
	},

	_onChartMousemove : function (e) {

		// cross-browser wheel delta
		var e = window.event || e; // old IE support
		var delta = Math.max(-1, Math.min(1, (e.wheelDeltaY || -e.detail)));

		// only Y scroll
		if (e.wheelDeltaY == 0) return; // not IE compatible

		// size of step
		var d = this._range / 8;

		// zoom Y axis
		if (delta > 0) { // moving up

			// set range
			this._range = this._range += d;

			// update axis
			this._chart.axis.max(this._range);
			this._chart.axis.min(-this._range);
		
		} else { // moving down
			
			// set range
			this._range = this._range -= d;

			// dont go under 1
			if (this._range < 1) this._range = 1;

			// update axis
			this._chart.axis.max(this._range);
			this._chart.axis.min(-this._range);
		}

	},



	// DATA BUILDERS
	// DATA BUILDERS
	// DATA BUILDERS		

	// Create data object
	createC3dataObj : function (c3Obj) {

		var data = c3Obj.data;
		var meta = c3Obj.meta;		
		var d3array = c3Obj.d3array;

		// already stored tooltip (edited, etc.)
		if (meta) {		

			// add meta to tooltip
			for (var m in meta.fields) {

				var field = meta.fields[m];

				// only add active tooltips
				if (field.on) {

					// get key/value
					var _val = parseFloat(data[field.key]).toString().substring(0,10);
					var _key = field.title || field.key;

					this.C3dataObjBuilder(_key, _val, d3array);
				}
			}

		// first time use of meta.. (or something)
		} else {

			for (var key in data) {

				var _val = parseFloat(data[key]).toString().substring(0,10);
				if (_val == 'NaN') _val = data[key];
				var _key = key;

				this.C3dataObjBuilder(_key, _val, d3array);
			}
		}


		this._c3object = c3Obj;

		return c3Obj;
	},


	// Split time series from other meta
	// TODO: fix this sheeet
	C3dataObjBuilder : function (_key, _val, d3array) {

		// Stop if disabled date in timeseries
		if ( this.popupSettings.timeSeries && this.popupSettings.timeSeries[_key] ) {
			if ( !this.popupSettings.timeSeries[_key].on ) return;
		}
		     

		var isDate = this._validateDateFormat(_key);

		// CREATE DATE SERIES
		// CREATE DATE SERIES
		if ( isDate ) {

			// Create Legible Date Value
			var nnDate = new Date(isDate);

			// DATE
			d3array.x.push(nnDate);

			// VALUE
			d3array.y.push(_val);


			// Get only year
			// var year = moment(isDate).format("YYYY");
			// var chartTick = new Date(year);

			var cleanDate = moment(isDate);
			var chartTick = new Date(cleanDate);



			var newTick = true;

			// Calculate the ticks
			d3array.ticks.forEach(function(ct) { 

				// Avoid duplicates... (must set toUTCString as _date is CEST time format, while chartTick is CET)
				if ( ct == chartTick ) newTick = false; 

			})

			if ( newTick ) d3array.ticks.push(chartTick);

		// CREATE META FIELDS
		// CREATE META FIELDS
		} else {

			d3array.meta.push([_key, _val])

		}
	},



	// OTHER HELPERS
	// OTHER HELPERS
	// OTHER HELPERS	

	_getWuLayerFromPostGISLayer : function (postgis_layer_id) {

		var layers = app.activeProject.getLayers();
		var layerUuid = _.find(layers, function(layer) {
			if (!layer || !layer.store || !layer.store.data || !layer.store.data.postgis) return false;
			return layer.store.data.postgis.layer_id == postgis_layer_id;
		});
		return layerUuid;		
	},	

	_validateDateFormat : function (_key) {

		// Default fields that for some reason gets read as time formats...
		if ( _key == 'the_geom_3857' || _key == 'the_geom_4326' ) return false;

		if (_key.length < 6) return false; // cant possibly be date

		// if only letters, not a date
		if (this._validate.onlyLetters(_key)) return;

		// if less than six and has letters
		if (this._validate.shortWithLetters(_key)) return;

		// If it's Frano's time series format
		var _m = moment(_key, ["YYYYMMDD", moment.ISO_8601]).format("YYYY-MM-DD");
		if ( _m != 'Invalid date' ) return _m;

		// If it's other time format
		var _m = moment(_key).format("YYYY-MM-DD"); // buggy
		if ( _m != 'Invalid date' ) return _m;

		// If it's not a valid date...
		return false;
	},	

	_validate : {

		onlyLetters : function (string) {
			var nums = [];
			_.each(string, function (s) {
				if (!isNaN(s)) nums.push(s);
			})
			if (nums.length) return false;
			return true;
		},

		shortWithLetters : function (string) {
			var letters = [];
			_.each(string, function (s) {
				if (isNaN(s)) letters.push(s);
			});

			if (letters.length && string.length < 7) return true;
			return false;
		},
	},

	

})
Wu.Model = Wu.Class.extend({

	initialize : function (options) {

		// set options
		Wu.setOptions(this, options);

		// local initialize
		this._initialize(options);

		// listen up
		this._listen();
	},      

	_listen : function () {
		Wu.Mixin.Events.on('projectSelected', this._projectSelected, this);
		Wu.Mixin.Events.on('editEnabled',     this._editEnabled, this);
		Wu.Mixin.Events.on('editDisabled',    this._editDisabled, this);
		Wu.Mixin.Events.on('layerEnabled',    this._layerEnabled, this);
		Wu.Mixin.Events.on('layerDisabled',   this._layerDisabled, this);
		Wu.Mixin.Events.on('fileImported',    this._onFileImported, this);
		Wu.Mixin.Events.on('fileDeleted',     this._onFileDeleted, this);
		Wu.Mixin.Events.on('layerAdded',      this._onLayerAdded, this);
		Wu.Mixin.Events.on('layerEdited',     this._onLayerEdited, this);
		Wu.Mixin.Events.on('layerDeleted',    this._onLayerDeleted, this);

		// file events
		var event_id = 'downloadReady-' + this.getUuid();
		Wu.Mixin.Events.on(event_id, this._onDownloadReady, this);

	},

	_projectSelected : function (e) {

		var projectUuid = e.detail.projectUuid;

		if (!projectUuid) return;

		// set project
		this._project = app.activeProject = app.Projects[projectUuid];

		// refresh pane
		this._refresh();
	},

	
	// dummies
	// _projectSelected : function () {},
	_initialize 	 : function () {},
	_initContainer   : function () {},
	_editEnabled 	 : function () {},
	_editDisabled 	 : function () {},
	_layerEnabled 	 : function () {},
	_layerDisabled 	 : function () {},
	_updateView 	 : function () {},
	_refresh 	 : function () {},
	_onFileImported  : function () {},
	_onFileDeleted   : function () {},
	_onLayerAdded    : function () {},
	_onLayerEdited   : function () {},
	_onLayerDeleted  : function () {},
	
	_onDownloadReady : function () {},


});
Wu.Project = Wu.Class.extend({

	initialize : function (store) {

		// set dB object to store
		this.store = {};
		Wu.extend(this.store, store);

		// ready save object
		this.lastSaved = {};

		// attach client
		// this._client = Wu.app.Clients[this.store.client];

		// init roles, files, layers
		this._initObjects();

	},

	_initObjects : function () {
		this.initRoles();
		this.initFiles();
		this.initLayers();
	},

	initRoles : function () {

		// get roles
		var roles = this.store.roles;
		this._roles = {};
		if (!roles) return;

		// create
		_.each(roles, function (role) {
			this._roles[role.uuid] = new Wu.Role({
				role : role,
				project : this
			});
		}, this);
	},

	initFiles : function () {

		// get files
		var files = this.getFiles();
		this.files = {};
		if (!files) return;

		// create
		files.forEach(function (file) {
			this.files[file.uuid] = new Wu.Model.File(file);
		}, this);
	},

	initLayers : function () {

		// get layers
		var layers = this.store.layers;
		this.layers = {};
		if (!layers) return;

		// create
		layers.forEach(function (layer) {
			var wuLayer =  new Wu.createLayer(layer);
			if (wuLayer) this.layers[layer.uuid] = wuLayer;
		}, this);
	},

	addLayers : function (layers) { // array of layers
		layers.forEach(function (layer) {
			this.addLayer(layer);
		}, this);
	},

	addLayer : function (layer) {
		var l = new Wu.createLayer(layer);
		if (l) this.layers[layer.uuid] = l;
		return l || false;
	},

	addBaseLayer : function (layer) {
		this.store.baseLayers.push(layer);
		this._update('baseLayers');
	},
	
	removeBaseLayer : function (layer) {
		_.remove(this.store.baseLayers, function (b) { return b.uuid == layer.getUuid(); });
		this._update('baseLayers');
	},

	setBaseLayer : function (layer) {
		this.store.baseLayers = layer;
		this._update('baseLayers');
	},

	createOSMLayer : function (callback) {

		var title = this._getOSMLayerTitle();

		var options = JSON.stringify({
			projectUuid : this.getUuid(),
			title : title
		});

		// get new layer from server
 		Wu.Util.postcb('/api/layers/osm/new', options, function (ctx, json) {

 			var layer = ctx.addLayer(JSON.parse(json));

 			// callback to wherever intiated
 			callback(null, layer);

 		}, this);

	},

	_getOSMLayerTitle : function () {
		var already = _.filter(this.getLayers(), function (l) {
			return l.store.data.osm;
		});

		var title = 'Open Street Map';
		var num = already.length;
		if (num) title += ' #' + num;

		return title;
	},

	createLayerFromGeoJSON : function (geojson) {

		// set options
		var options = JSON.stringify({
			project 	: this.getUuid(),
			geojson 	: geojson,
			layerType 	: 'geojson'
		});
		
		// get new layer from server
 		Wu.Util.postcb('/api/layers/new', options, this._createdLayerFromGeoJSON, this);
	},

	_createdLayerFromGeoJSON : function (context, data) {

		// parse layer data
		var parsed = JSON.parse(data);

		console.error('TODO: created layer from GeoJSON, needs to be added to Data.');
	},

	createLayer : function () {
	},

	setActive : function () {
		this.select();
	},

	refresh : function () {

		// refresh project
		this._refresh();
	
		// set active project in sidepane
		if (this._menuItem) this._menuItem._markActive();

		if (app.StatusPane.isOpen) {
			app._map._controlCorners.topleft.style.opacity = 0;
			app._map._controlCorners.topleft.style.display = 'none';
		}
	},

	addNewLayer : function (layer) {
		this.addLayer(layer);
	},

	_reset : function () {
		// this.removeHooks();
	},

	_hardRefresh : function () {
		// flush
		this._reset();

		// init files
		this.initFiles();

  		// create layers 
		this.initLayers();

		// init roles
		this.initRoles();

		// update url
		this._setUrl();

		// set settings
		this.refreshSettings();
		
		// update color theme
		this.setColorTheme();

		// update project in sidepane
		if (this._menuItem) this._menuItem.update();
	},

	_refresh : function () {

		// flush
		this._reset();

		// init roles
		this.initRoles();

		// update url
		this._setUrl();

		// set settings
		this.refreshSettings();
		
		// update color theme
		this.setColorTheme();

		// update project in sidepane
		if (this._menuItem) this._menuItem.update();
	},

	select : function () {

		// hide headerpane
 		if (app._headerPane) Wu.DomUtil.removeClass(app._headerPane, 'displayNone');

		// set as active
		app.activeProject = this;

		// mark selected
		this.selected = true;

		// refresh project
		this.refresh();
	},

	_setUrl : function () {
		var url = '/';
		// url += this._client.slug;
		// url += '/';
		url += this.store.slug;
		Wu.Util.setAddressBar(url);
	},

	setNewStore : function (store) {
		this.store = store;
		this._initObjects();
		// this.select();
	},

	setStore : function (store) {
		this.store = store;
		this._hardRefresh();
	},

	setRolesStore : function (roles) {
		this.store.roles = roles;
		this.initRoles();
	},

	setAccess : function (projectAccess) {

		var options = {
			project : this.getUuid(),
			access : projectAccess
		}


		// send request to API		
 		Wu.Util.postcb('/api/project/setAccess', JSON.stringify(options), function (ctx, response) {
 		
 			// set locally
 			this.store.access = projectAccess;

 		}.bind(this), this);

	},

	addInvites : function (projectAccess) {

		var options = {
			project : this.getUuid(),
			access : projectAccess
		}


		// send request to API		
 		Wu.Util.postcb('/api/project/addInvites', JSON.stringify(options), function (ctx, response) {

 			console.log('response: ', response, ctx);

 			var updatedAccess = Wu.parse(response);

 			// set locally
 			this.store.access = updatedAccess;

 		}.bind(this), this);
	},

	getAccess : function () {
		return this.store.access;
	},

	setMapboxAccount : function (store) {
		// full project store
		this.store = store;

		// refresh project and sidepane
		this._refresh();
		// this.refreshSidepane();
	},

	_update : function (field) {

		// set fields
		var json = {};
		json[field] = this.store[field];
		json.uuid = this.store.uuid;


		// // dont save if no changes
		// var fieldclone = _.clone(this[field]);
		// console.log('fieldclone: ', fieldclone, this[field]);
		// if (this.lastSaved[field]) {
		//         if (_.isEqual(json[field], this.lastSaved[field])) {
		//                 console.log('shits equal, not saving!!', json[field], this.lastSaved[field]);
		//                 return;
		//         }
		// }
		// this.lastSaved[field] = fieldclone;
		// console.log('this.lastSaved= ', this.lastSaved);


		// save to server
		var string = JSON.stringify(json);
		this._save(string);
	},


	save : function (field) {

		// save all fields that has changed since last save (or if no last save...?)
		// todo
	},
	

	_save : function (string) {
		// save to server                                       	// TODO: pgp
		Wu.send('/api/project/update', string, this._saved.bind(this));  
	},

	// callback for save
	_saved : function (ctx, json) {

		var result = Wu.parse(json);
		if (result.error) return app.feedback.setError({
			title : "Could not update project", 
			description : result.error
		});

		// set status
		app.setSaveStatus();

		Wu.Mixin.Events.fire('projectChanged', { detail : {
			projectUuid : this.getUuid()
		}});
	},


	// create project on server
	create : function (opts, callback) {

		console.log('this: store', this.store);

		var options = {
			name 		: this.store.name,
			description 	: this.store.description,
			keywords 	: this.store.keywords, 
			position 	: this.store.position,
			access		: this.store.access
		}

		// send request to API		
 		Wu.post('/api/project/create', JSON.stringify(options), callback.bind(opts.context), this);
	},


	_unload : function () {

		// load random project
		app.MapPane._flush();
		app.HeaderPane._flush();
		this.selected = false;
	},


	_delete : function (callback) {
		// var project = this;
		var json = JSON.stringify({ 
			    'pid' : this.store.uuid,
			    'projectUuid' : this.store.uuid,
			    // 'clientUuid' : this._client.uuid
		});
		
		// post with callback:    path       data    callback   context of cb
		Wu.Util.postcb('/api/project/delete', json, callback || this._deleted, this);
	},

	_deleted : function (project, json) {

		// set address bar
		var url = app.options.servers.portal;
		var deletedProjectName = project.getName();

		// set url
		Wu.Util.setAddressBar(url);

		// delete object
		app.Projects[project.getUuid()] = null;
		delete app.Projects[project.getUuid()];

		// set no active project if was active
		if (app.activeProject && app.activeProject.getUuid() == project.getUuid()) {

			// null activeproject
			app.activeProject = null;

			// unload project
			project._unload();
			
			// fire no project
			Wu.Mixin.Events.fire('projectSelected', { detail : {
				projectUuid : false
			}});

			// fire no project
			Wu.Mixin.Events.fire('projectDeleted', { detail : {
				projectUuid : project.getUuid()
			}});

		}

		project = null;
		delete project;

	},

	saveColorTheme : function () {
		
		// save color theme to project 
		this.colorTheme = savedCSS;
		this._update('colorTheme');
	},

	setColorTheme : function () {
		if (!this.colorTheme) return;

		// set global color
		savedCSS = this.colorTheme;

		// inject
		Wu.Util.setColorTheme();
	},

	removeMapboxAccount : function (account) {
		var removed = _.remove(this.store.connectedAccounts.mapbox, function (m) {	// todo: include access token
			return m == account;
		});
		this._update('connectedAccounts');

		// todo: remove active layers, etc.
		var layers = this.getLayers();

		var lids = [];

		layers.forEach(function (layer) {
			if (!layer.store.data) return;
			if (!layer.store.data.mapbox) return;

			var mid = layer.store.data.mapbox;
			var m = mid.split('.')[0];
			if (m == account.username) {
				this._removeLayer(layer);
				lids.push(layer.getUuid());
			}
		}, this);

		// todo: remove on server, ie. remove layers from project...
		// remove from server
		var json = {
		    projectUuid : this.getUuid(),
		    layerUuids : lids
		}
		var string = JSON.stringify(json);
		Wu.save('/api/layers/delete', string); 

	},

	deleteLayer : function (layer) {

		var options = {
			layerUuid : layer.getUuid(),
			projectUuid : this.getUuid()
		}

		Wu.post('/api/layers/delete', JSON.stringify(options), function (err, response) {
			if (err) return console.error('layer delete err:', err);

			var result = Wu.parse(response);

			if (result.error) return console.error('layer delete result.error:', result.error);

			// remove locally, and from layermenu etc.
			this._removeLayer(layer);

			// fire event
			Wu.Mixin.Events.fire('layerDeleted', { detail : {
				layer : this
			}}); 

		}.bind(this));

	},

	removeLayer : function (layerStore) {
		var layer = this.getLayer(layerStore.uuid);
		this._removeLayer(layer);
	},

	_removeLayer : function (layer) {

		// remove from layermenu & baselayer store
		_.remove(this.store.layermenu, function (item) { return item.layer == layer.getUuid(); });
		_.remove(this.store.baseLayers, function (b) { return b.uuid == layer.getUuid(); });

		// remove from layermenu
		var layerMenu = app.MapPane.getControls().layermenu;
		if (layerMenu) layerMenu.onDelete(layer);

		// remove from map
		layer.remove();
			
		// remove from local store
		var a = _.remove(this.store.layers, function (item) { return item.uuid == layer.getUuid(); });	// dobbelt opp, lagt til to ganger! todo
		delete this.layers[layer.getUuid()];

		// save changes
		this._update('layermenu'); 
		this._update('baseLayers');

	},	

	getName : function () {
		return this.store.name;
	},

	getTitle : function () {
		return this.getName();
	},

	getDescription : function () {
		return this.store.description;
	},

	getLogo : function () {
		return this.store.logo;
	},

	getUuid : function () {
		return this.store.uuid;
	},

	getLastUpdated : function () {
		return this.store.lastUpdated;
	},

	getClient : function () {
		console.log('TODO: remove this!');
		// return app.Clients[this.store.client];
	},

	getClientUuid : function () {
		console.log('TODO: remove this!');
		// return this.store.client;
	},

	getBaselayers : function () {
		return this.store.baseLayers;
	},

	getLayermenuLayers : function () {
		return _.filter(this.store.layermenu, function (l) {
			return !l.folder;
		});
	},

	getLayers : function () {
		return _.toArray(this.layers);
	},

	getPostGISLayers : function () {
		// return _.filter(this.layers, function (l) {
		// 	if (!l) return false;
		// 	if (!l.store.data) return false;
		// 	return l.store.data.postgis;
		// });

		var layers = [];

		for (var l in this.layers) {
			var layer = this.layers[l];
			if (layer.store && layer.store.data && layer.store.data.postgis) layers.push(layer);
		}

		return layers;

	},

	getRasterLayers : function () {
		var layers = [];

		for (var l in this.layers) {
			var layer = this.layers[l];

			if (layer.store && layer.store.data && layer.store.data.raster) layers.push(layer);
		}

		return layers;
	},

	getDataLayers : function () {

		var pg_layers = this.getPostGISLayers();
		var r_layers = this.getRasterLayers();

		var data_layers = pg_layers.concat(r_layers);

		return data_layers;

	},

	// debug
	getDeadLayers : function () {
		return _.filter(this.layers, function (l) {
			if (!l) return true;
			return l.store.data == null;
		});
	},

	getActiveLayers : function () {

		// get all layers in project
		var base = this.getBaselayers();
		var lm = this.getLayermenuLayers();
		var all = base.concat(lm);
		var layers = [];
		all.forEach(function (a) {
			if (!a.folder) {
				var id = a.layer || a.uuid;
				var layer = this.layers[id];
				layers.push(layer);
			}
		}, this);
		return layers;
	},

	getLayer : function (uuid) {
		return this.layers[uuid];
	},

	getPostGISLayer : function (layer_id) {
		return _.find(this.layers, function (layer) {
			if (!layer.store) return;
			if (!layer.store.data) return;
			if (!layer.store.data.postgis) return;
			return layer.store.data.postgis.layer_id == layer_id;
		});
	},

	getStylableLayers : function () {
		// get active baselayers and layermenulayers that are editable (geojson)
		var all = this.getActiveLayers();
		var cartoLayers = _.filter(all, function (l) {

			if (l) {
				if (!l.store) return false;
				if (l.store.data.hasOwnProperty('geojson')) return true;
				if (l.store.data.hasOwnProperty('osm')) return true;
				if (l.store.data.hasOwnProperty('postgis')) return true;

			} else {
				return false;
			}
		});
		return cartoLayers;
	},

	getLayerFromFile : function (fileUuid) {
		return _.find(this.layers, function (l) {
			return l.store.file == fileUuid;
		});
	},

	getFiles : function () {
		return this.store.files;
	},

	getFileObjects : function () {
		return this.files;
	},

	getFileStore : function (fileUuid) {
		var file = _.find(this.store.files, function (f) {
			return f.uuid == fileUuid;
		});
		return file;
	},

	getFile : function (fileUuid) {
		return this.files[fileUuid]; // return object
	},

	getBounds : function () {
		var bounds = this.store.bounds;
		if (_.isEmpty(bounds)) return false;
		return bounds;
	},

	getState : function () {
		return this.store.state;
	},

	getLatLngZoom : function () {
		var position = {
			lat  : this.store.position.lat,
			lng  : this.store.position.lng,
			zoom : this.store.position.zoom
		};
		return position;
	},

	getPosition : function () {
		return this.getLatLngZoom();
	},

	getCollections : function () {
		
	},

	getRoles : function () {
		return this._roles;
	},

	// get available categories stored in project
	getCategories : function () {
		return this.store.categories;
	},

	// add category to project list of cats
	addCategory : function (category) {

		// push to list
		this.store.categories.push(category);

		// save to server
		this._update('categories');
	},

	removeCategory : function (category) {

		// remove from array
		_.remove(this.store.categories, function (c) {
			return c.toLowerCase() == category.toLowerCase();
		});

		// save to server
		this._update('categories');
	},

	getUsers : function () {
		var users = [],
		    roles = this._roles;

		_.each(roles, function (role) {
			if (role.hasCapability('read_project')) {
				_.each(role.getMembers(), function (uuid) {
					var user = app.Users[uuid];
					if (user) users.push(user);
				});
			}
		});
		return users;
	},

	_filteredUsers : function () {
		var allProjectUsers = this.getUsers();

		// filter out superadmins
		return _.filter(allProjectUsers, function (u) {
			return !app.Access.is.superAdmin(u);
		});
	},

	getSlug : function () {
		return this.store.slug;
	},

	getSlugs : function () {
		var slugs = {
			project : this.store.slug,
			// client : this.getClient().getSlug()
		}
		return slugs;
	},

	getUsersHTML : function () {
		var users = this._filteredUsers(),
		    html = '';

		_.each(users, function (user) {
			html += '<p>' + user.getFullName() + '</p>';
		});
		return html;
	},


	getHeaderLogo : function () {
		if(Wu.app.Style.getCurrentTheme() === 'darkTheme'){
			var defaultProjectLogo = '/css/images/defaultProjectLogoLight.png';
		}
		else if(Wu.app.Style.getCurrentTheme() === 'lightTheme'){
			var defaultProjectLogo = '/css/images/defaultProjectLogo.png';
		}
		var logo = this.store.header.logo;
		if (!logo) logo = defaultProjectLogo;
		return logo;
	},

	getHeaderLogoBg : function () {
		var logo = this.store.header.logo;
		if (!logo) logo = this.store.logo;
		var url = "url('" + logo  + "')";
		return url;
	},

	getHeaderTitle : function () {
		// return this.store.header.title;
		return this.getName();
	},

	getHeaderSubtitle : function () {
		return this.store.header.subtitle;
	},

	getHeaderHeight : function () {
		return parseInt(this.store.header.height);
	},

	getMapboxAccounts : function () {
		return this.store.connectedAccounts.mapbox;
	},

	getControls : function () {
		var controls = this.store.controls;
		delete controls.vectorstyle; // tmp hack, todo: remove from errywhere
		return controls;
	},

	getSettings : function () {
		return this.store.settings;
	},

	clearPendingFiles : function () {
		this.store.pending = [];
		this._update('pending');
	},

	setPendingFile : function (file_id) {
		this.store.pending.push(file_id);
		this._update('pending');
	},

	getPendingFiles : function () {
		return this.store.pending;
	},

	removePendingFile : function (file_id) {
		var remd = _.remove(this.store.pending, function (p) {
			return p == file_id;
		});
		this._update('pending');
	},


	setPopupPosition : function (pos) {
		this._popupPosition = pos;
	},

	getPopupPosition : function () {
		return this._popupPosition;
	},

	setSettings : function (settings) {
		this.store.settings = settings;
		this._update('settings');
	},

	setFile : function (file) {
		this.store.files.push(file);
		this.files[file.uuid] = new Wu.Model.File(file);
	},

	setLogo : function (path) {
		this.store.logo = path;
		this._update('logo');
	},

	setHeaderLogo : function (path) {
		this.store.header.logo = path;
		this._update('header');
	},

	setHeaderTitle : function (title) {
		this.store.header.title = title;
		this._update('header');
	},

	setHeaderSubtitle : function (subtitle) {
		this.store.header.subtitle = subtitle;
		this._update('header');
	},

	setName : function (name) {

		// store on server
		this.store.name = name;
		this._update('name');

		// update slug name
		this.setSlug(name);
	},

	setDescription : function (description) {
		this.store.description = description;
		this._update('description');
	},

	setSlug : function (name) {
		var slug = name.replace(/\s+/g, '').toLowerCase();
		slug = slug.replace(/\W/g, '')
		slug = Wu.Util.stripAccents(slug);
		this.store.slug = slug;
		
		// save slug to server
		this._update('slug');

		// set new url
		this._setUrl();
	},

	setBounds : function (bounds) {
		this.store.bounds = bounds;
		this._update('bounds');
	},

	setBoundsSW : function (bounds) {
		this.store.bounds = this.store.bounds || {}
		this.store.bounds.southWest = bounds;
		this._update('bounds');		
	},

	setBoundsNE : function (bounds) {
		this.store.bounds = this.store.bounds || {}
		this.store.bounds.northEast = bounds;
		this._update('bounds');
	},

	setBoundsZoomMin : function (zoomMin) {
		this.store.bounds = this.store.bounds || {}
		this.store.bounds.zoomMin = zoomMin;
		this._update('bounds');
	},

	setPosition : function (position) {
		this.store.position = position;
		this._update('position');
	},

	setSidepane : function (sidepane) {
		this._menuItem = sidepane;
	},

	getSidepane : function () {
		return this._menuItem;
	},

	removeFiles : function (files) {

		return console.error('remove files, needs to be rewritten with new Wu.Data');

	},

	getGrandeFiles : function () {
		var files = this.getFiles();
		var sources = this._formatGrandeFiles(files);
		return sources;
	},

	getGrandeImages : function () {
		var files = this.getFiles();
		var images = this._formatGrandeImages(files);
		return images;
	},

	// format images for Grande plugin
	_formatGrandeImages : function (files) {
		var sources = [];
		files.forEach(function (file) {
			if (file.type == 'image') {
				var thumbnail 	= '/pixels/' + file.uuid + '?width=75&height=50' + '&access_token=' + app.tokens.access_token;
				var url 	= '/pixels/' + file.uuid + '?width=200&height=200' + '&access_token=' + app.tokens.access_token;
				var source = {
				    	title 	: file.name, 	// title
				    	thumbnail : thumbnail,  // optional. url to image
				    	uuid 	: file.uuid,       // optional
					type 	: file.type,
					url 	: url
				}
				sources.push(source)
			}
		}, this);
		return sources;
	},

	// format files for Grande plugin
	_formatGrandeFiles : function (files) {
		var sources = [];
		files.forEach(function (file) {

			var thumbnail = (file.type == 'image') ? '/pixels/' + file.uuid + '?width=50&height=50' + '&access_token=' + app.tokens.access_token : '';
			var prefix    = (file.type == 'image') ? '/images/' 					: '/api/file/download/?file=';
			var url = prefix + file.uuid + '&access_token=' + app.tokens.access_token;// + suffix

			//url += '?access_token=' + app.tokens.access_token;

			var source = {
			    	title 	: file.name, 	// title
			    	thumbnail : thumbnail,  // optional. url to image
			    	uuid 	: file.uuid,    // optional
				type 	: file.type,
				url 	: url
			}

			sources.push(source)
		
		}, this);
		return sources;
	},

	refreshSettings : function () {
		for (setting in this.getSettings()) {
			this.getSettings()[setting] ? this['enable' + setting.camelize()]() : this['disable' + setting.camelize()]();
		}

		// refresh added/removed sidepanes
		// app.SidePane._refresh();
	},

	// settings
	toggleSetting : function (setting) {
		
		// switch setting in store
		this._switchSetting(setting);

		// enable/disable
		this.getSettings()[setting] ?  this['enable' + setting.camelize()]() : this['disable' + setting.camelize()]();
	},

	_switchSetting : function (setting) {
		this.store.settings[setting] = !this.store.settings[setting];
		this._update('settings');
	},

	enableDarkTheme : function () {
		app.Style.setDarkTheme();
	},
	disableDarkTheme : function () {
		app.Style.setLightTheme();
	},

	enableTooltips : function () {
		app.Tooltip.activate();
	},
	disableTooltips : function () {
		app.Tooltip.deactivate();
	},


	enableD3popup : function () {
		console.log('enable d3popup');
	},
	disableD3popup : function () {
		console.log('disable d3popup');
	},


	enableScreenshot : function () {
		// app.SidePane.Share.enableScreenshot();
	},
	disableScreenshot : function () {
		// app.SidePane.Share.disableScreenshot();
	},

	enableDocumentsPane : function () {
		// app.SidePane.refreshMenu();
	},
	disableDocumentsPane : function () {
		// app.SidePane.refreshMenu();
	},

	enableDataLibrary : function () {
		// app.SidePane.refreshMenu();
	},
	disableDataLibrary : function () {
		// app.SidePane.refreshMenu();
	},

	enableMediaLibrary : function () {
		// app.SidePane.refreshMenu();
	},
	disableMediaLibrary : function () {
		// app.SidePane.refreshMenu();
	},

	enableSocialSharing : function () {
		// app.SidePane.refreshMenu();
	},
	disableSocialSharing : function () {
		// app.SidePane.refreshMenu();
	},

	enableAutoHelp : function () {		// auto-add folder in Docs

	},
	disableAutoHelp : function () {

	},

	enableAutoAbout : function () {

	},
	disableAutoAbout : function () {

	},

	enableMapboxGL : function () {

	},
	disableMapboxGL : function () {

	},

	enableSaveState : function () {

	},
	disableSaveState : function () {

	},

	// CXX – Now this is all over the place... see sidepane.project.js > makeNewThumbnail() etc...
	createProjectThumb : function () {

		// Set the grinding wheel until logo is updated
		this.setTempLogo();

		app.setHash(function (ctx, hash) {
			var obj = JSON.parse(hash);

			obj.dimensions = {
				height : 233,
				width : 350
			}

			// get snapshot from server
			Wu.post('/api/util/createThumb', JSON.stringify(obj), this.createdProjectThumb, this);

		}.bind(this), this);
	},


	createdProjectThumb : function(context, json) {

		// parse results
		var result = JSON.parse(json),
		    image = result.cropped ,
		    fileUuid = result.fileUuid,
		    path = '/images/' + image;

		// Store new logo paths
		context.setLogo(path); 		// trigger server-save
		context.setHeaderLogo(path); 	// triggers server-save

		context._menuItem.logo.style.backgroundImage = 'url(' + context._getPixelLogo(path) + ')';
		context.setTempLogo(); 

		// Set logo in header pane
		if (context == app.activeProject) {
			app.HeaderPane.addedLogo(image); // triggers this.setHeaderLogo -- triggers save
		}
	},

	setThumbCreated : function (bool) {
		this.store.thumbCreated = bool;
		this._update('thumbCreated');
	},

	getThumbCreated : function () {
		return this.store.thumbCreated;
	},	

	setTempLogo : function () {
		this._sidePaneLogoContainer.src = app.options.logos.projectDefault;
	},

	_getPixelLogo : function (logo) {
		var base = logo.split('/')[2];
		var url = '/pixels/image/' + base + '?width=90&height=60&format=png' + '&access_token=' + app.tokens.access_token;
		return url;
	},


	selectProject : function () {

		// select project
		Wu.Mixin.Events.fire('projectSelected', {detail : {
			projectUuid : this.getUuid()
		}});
	},





	/////
	//// ACCESS
	///
	//

	isPublic : function () {
		var access = this.getAccess();
		var isPublic = access.options.isPublic;
		return !!isPublic
	},

	isDownloadable : function () {
		var access = this.getAccess();
		var isPublic = access.options.download;
		return !!isPublic;
	},
	isShareable : function () {
		var access = this.getAccess();
		var isPublic = access.options.share;
		return !!isPublic;
	},


	createdBy : function () {
		return this.store.createdBy;
	},

	isEditor : function (user) {
		return this.isEditable(user);
	},

	isSpectator : function (user) {
		var user = user || app.Account;
		var access = this.getAccess();

		// true: if user is listed as editor
		if (_.contains(access.read, user.getUuid())) return true;

		// false: not createdBy and not editor
		return false;
	},

	isEditable : function (user) {
		var user = user || app.Account;

		var access = this.getAccess();

		// true: if user created project
		if (user.getUuid() == this.createdBy()) return true;

		// true: if user is listed as editor
		if (_.contains(access.edit, user.getUuid())) return true;

		// true: if user is super
		if (app.Account.isSuper()) return true; 

		// false: not createdBy and not editor
		return false;
	},

















})
Wu.Client = Wu.Class.extend({

	initialize : function (options) {

		// set options
		Wu.extend(this, options);

		// set defaults
		this.options = {};
		this.options.editMode = false;

	},

	setEditMode : function () {
		// set editMode
		this.editMode = app.access.to.edit_client(this.getUuid())
	},

	setActive : function () {

		// set edit mode
		this.setEditMode();

		// update url
		this._setUrl();

		// do nothing if already active
		if (this._isActive()) return; 	// todo: remove? 

		// set active client
		Wu.app._activeClient = this;

	},

	_isActive : function () {
		if (Wu.Util.isObject(Wu.app._activeClient)) {
			if (Wu.app._activeClient.uuid == this.uuid) return true;   
		}
		return false;
	},

	_setUrl : function () {
		var url = '/'+ this.slug + '/';
		Wu.Util.setAddressBar(url);
	},

	_refreshUrl : function () {
		var project = app.activeProject ? app.activeProject.getSlug() : '';
		var url = '/' + this.slug + '/' + project;
		Wu.Util.setAddressBar(url);
	},

	update : function (field) {
		var json    = {};
		json[field] = this[field];
		json.uuid   = this.uuid;
		var string  = JSON.stringify(json);
		this._save(string);
	},

	_save : function (string) {
		Wu.send('/api/client/update', string, this._saved.bind(this));  // TODO: pgp & callback
	},

	_saved : function (err, json) {
		console.log('client saved', err, json);

		var result = Wu.parse(json);

		if (result.error) return app.feedback.setError({
			title : 'Client not updated', 
			description : result.error
		});

		if (result.name) {
			// name has been updated, add slug also
			var slug = result.name[0].name.replace(/\s+/g, '').toLowerCase();
			this.setSlug(slug);
		}

		if (result.slug) {
			this._refreshUrl();
		}
	},

	saveNew : function () {
		var options = {
			name 		: this.name,
			description 	: this.description,
			keywords 	: this.keywords
		}

		var json   = JSON.stringify(options);
		var editor = Wu.app.SidePane.Clients;

		Wu.Util.postcb('/api/client/new', json, editor._created, this);

	},

	destroy : function () {
		this._delete();
	},

	_delete : function () {
		var client = this;
		var json = { 'cid' : client.uuid };
		json = JSON.stringify(json);

		// post with callback:    path       data    callback   context of cb
		Wu.Util.postcb('/api/client/delete', json, client._deleted, client);
	},

	_deleted : function (client, json) {
		// delete object
		delete Wu.app.Clients[client.uuid];
	},


	getName : function () { 	// todo: move to this.store.name;
		return this.name;
	},

	getTitle : function () {
		return this.getName();
	},

	getDescription : function () {
		return this.description;
	},

	getLogo : function () {
		return this.logo;
	},

	getPixelLogo : function (options) {

	},

	getUuid : function () {
		return this.uuid;
	},

	getSlug : function () {
		return this.slug;
	},

	getProjects : function () {
		return _.filter(app.Projects, function (p) {
			return p.getClientUuid() == this.getUuid();
		}, this);
	},

	setName : function (name) {
		this.name = name;
		this.update('name');
	},

	setDescription : function (description) {
		this.description = description;
		this.update('description');
	},

	setLogo : function (logo) {
		this.logo = logo;
		this.update('logo');
	},

	setSlug : function (slug) {
		this.slug = slug;
		this.update('slug');
	},


});
Wu.User = Wu.Class.extend({ 

	initialize : function (store) {

		// set vars
		this.store = store;

		this.lastSaved = _.cloneDeep(store);

		// init file objects
		this.initFiles();

		this._listen();
	},

	_listen : function () {
		Wu.Mixin.Events.on('closeMenuTabs',   this._onCloseMenuTabs, this);
	},

	initFiles : function () {

		// get files
		var files = this.store.files;
		this._files = {};
		if (!files) return;

		// create
		files.forEach(function (file) {
			this._files[file.uuid] = new Wu.Model.File(file);
		}, this);
	},

	isContact : function () {
		if (!app.Account) return console.error('too early!');
		if (this.getUuid() == app.Account.getUuid()) return;

		var isContact = _.contains(app.Account.getContactListUuids(), this.getUuid());

		return isContact;
	},

	getContactListUuids : function () {
		var uuids = [];
		this.getContactList().forEach(function (c) {
			uuids.push(c.uuid);
		});
		return uuids;
	},

	getContactList : function ()  {
		return this.store.contact_list;
	},

	sendContactRequest : function (user) {

		var options = {
			contact : user.getUuid()
		}

		Wu.send('/api/user/requestContact', options, function (a, b) {

			console.log('request sent!', a, b);


			// set feedback 
			app.feedback.setMessage({
				title : 'Friend request sent',
				// description : description
			});


		}, this);

	},

	inviteToProjects : function (options) {

		var userUuid = this.getUuid();
		var userName = this.getFullName();
		var num = options.edit.length + options.read.length;

		var invites = {
			edit : options.edit,
			read : options.read,
			user : userUuid
		}

		// send to server
		Wu.send('/api/user/inviteToProjects', invites, function (a, response) {

			var result = Wu.parse(response);

			// set feedback 
			app.feedback.setMessage({
				title : 'Project invites sent!',
				description : userName + ' has been invited to ' + num + ' projects'
			});
			
			// update locally
			result.projects.forEach(function (projectAccess) {
				var project = app.Projects[projectAccess.project];
				project.store.access = projectAccess.access;
			});

		}.bind(this), this);

	},

	getFiles : function () {
		return this._files;
	},

	getFileStore : function (fileUuid) {
		var file = _.find(this.store.files, function (f) {
			return f.uuid == fileUuid;
		});
		return file;
	},

	getFile : function (fileUuid) {
		return this._files[fileUuid]; // return object
	},


	setFile : function (file) {
		this.store.files.push(file);
		this._files[file.uuid] = new Wu.Model.File(file);
		return this._files[file.uuid];
	},

	removeFile : function (file) {
		var fileUuid = file.file_id;
		var r = _.remove(this.store.files, function (f) {
			return f.uuid ==fileUuid;
		});

		this._files[fileUuid] = null;
		delete this._files[fileUuid];

	},

	// set functions
	setLastName : function (value) {
		this.store.lastName = value;
		this.save();
	},

	setFirstName : function (value) {
		this.store.firstName = value;
		this.save();
	},

	setCompany : function (value) {
		this.store.company = value;
		this.save();
	},

	setPosition : function (value) {
		this.store.position = value;
		this.save();
	},

	setPhone : function (value) {
		this.store.phone = value;
		this.save();
	},

	setMobile : function (value) {
		this.store.mobile = value;
		this.save();
	},

	setEmail : function (value) {
		this.store.local.email = value;
		this.save();
	},


	setKey : function (key, value) {
		if (key == 'lastName' ) return this.setLastName(value);
		if (key == 'firstName') return this.setFirstName(value);
		if (key == 'company'  ) return this.setCompany(value);
		if (key == 'position' ) return this.setPosition(value);
		if (key == 'mobile'   ) return this.setMobile(value);
		if (key == 'phone'    ) return this.setPhone(value);
		if (key == 'email'    ) return this.setEmail(value);
	},


	// save 
	save : function (key) {
		
		// clear timer
		if (this._saveTimer) clearTimeout(this._saveTimer);

		// save changes on timeout
		var that = this;
		this._saveTimer = setTimeout(function () {
		
			// find changes
			var changes = that._findChanges();
			
			// return if no changes
			if (!changes) return;

			that._save(changes);
		
		}, 1000);       // don't save more than every goddamed second

	},

	_save : function (changes) {
		if (app.activeProject) changes.project = app.activeProject.getUuid(); // for edit_user access, may need project...
		Wu.save('/api/user/update', JSON.stringify(changes)); 
	},


	attachToApp : function () {
		app.Users[this.getUuid()] = this;
	},


	deleteUser : function (context, callback) {

		// delete in local store
		delete app.Users[this.store.uuid];

		// delete on server
		var uuid = this.store.uuid;
		var json = JSON.stringify({ 
			uuid : uuid
		});

		// post              path          data           callback        context of cb
		Wu.Util.postcb('/api/user/delete', json, context[callback], context);

	},

	// get functions
	getKey : function (key) {
		return this.store[key];
	},

	getFirstName : function () {
		return this.store.firstName;
	},

	getLastName : function () {
		return this.store.lastName;
	},

	getFullName : function () {
		return this.store.firstName + ' ' + this.store.lastName;
	},

	getName : function () {
		return this.getFullName();
	},

	getCompany : function () {
		return this.store.company;
	},

	getPosition : function () {
		return this.store.position;
	},

	getPhone : function () {
		return this.store.phone;
	},

	getMobile : function () {
		return this.store.mobile;
	},

	getEmail : function () {
		return this.store.local.email;
	},

	getToken : function () {
		return this.store.token;
	},

	getProjects : function () {
		// get projects which user has a role in
		var allProjects = app.Projects,
		    projects = [];

		// return all if admin
		if (app.access.is.admin(this)) return _.values(allProjects);

		_.each(allProjects, function (p) {
			_.each(p.getRoles(), function (r) {
				if (r.hasMember(this) && !r.noRole()) {
					projects.push(p);
				}
			}, this)
		}, this);
		return projects;
	},

	getReadProjects : function () {
		var allProjects = app.Projects;

		var readProjects = _.filter(app.Projects, function (p) {
			return _.contains(p.getAccess().read, this.getUuid());
		}, this);

		return readProjects;
	},

	getEditProjects : function () {
		var allProjects = app.Projects;

		var editProjects = _.filter(app.Projects, function (p) {
			return _.contains(p.getAccess().edit, this.getUuid());
		}, this);

		return editProjects;
	},

	getUuid : function () {
		return this.store.uuid;
	},


	setRoles : function (roles) {
		// this._roles = [];
		// roles.forEach(function (r) {
		// 	var role = new Wu.Role({role : r});
		// 	this._roles.push(role);
		// }, this);
	},

	getRoles : function () {
		return this._roles;
	},


	// find changes to user.store for saving to server. works for two levels deep // todo: refactor, move to class?
	// hacky for realz! no good!!
	_findChanges : function () {
		var clone   = _.cloneDeep(this.store);
		var last    = _.cloneDeep(this.lastSaved);
		var changes = [];
		for (c in clone) {
			if (_.isObject(clone[c])) {
				var a = clone[c];
				for (b in a) {
					var d = a[b];
					equal = _.isEqual(clone[c][b], last[c][b]);
					if (!equal) {
						var change = {}
						change[c] = {};
						change[c][b] = clone[c][b];
						changes.push(change);
					}
				}
			} else {
				var equal = _.isEqual(clone[c], last[c]);
				if (!equal) {
					var change = {}
					change[c] = clone[c];
					changes.push(change);
				}
			}
		}
		if (changes.length == 0) return false; // return false if no changes
		var json = {};
		changes.forEach(function (change) {
			for (c in change) { json[c] = change[c]; }
		}, this);
		json.uuid = this.getUuid();
		this.lastSaved = _.cloneDeep(this.store);  // update lastSaved
		return json;
	},

	logout : function () {

		// confirm
		if (!confirm('Are you sure you want to log out?')) return;

		this._logout();
	},

	_logout : function () {
		
		// slack monitor
		app.Socket.sendUserEvent({
		    	user : app.Account.getFullName(),
		    	event : 'logged out.',
		    	description : '',
		    	timestamp : Date.now()
		});

		// redirect to logout
		window.location.href = app.options.servers.portal + 'logout';
	},


	addAccountTab : function () {

		// return; // todo later

		// register button in top chrome
		var top = app.Chrome.Top;

		// add a button to top chrome
		this._accountTab = top._registerButton({
			name : 'account',
			className : 'chrome-button share',
			trigger : this._toggleAccountTab,
			context : this,
			project_dependent : false
			
		});

		// user icon
		this._accountTab.innerHTML = '<i class="fa fa-user"></i>';

	},


	_toggleAccountTab : function () {


		this._accountTabOpen ? this._closeAccountTab() : this._openAccountTab();

	},

	_openAccountTab : function () {

		// close other tabs
		Wu.Mixin.Events.fire('closeMenuTabs');
		
		// create dropdown
		this._accountDropdown = Wu.DomUtil.create('div', 'share-dropdown account-dropdown', app._appPane);

		// items
		this._accountName = Wu.DomUtil.create('div', 'share-item no-hover', this._accountDropdown, '<i class="fa fa-user logout-icon"></i>' + app.Account.getFullName());
		this._logoutDiv = Wu.DomUtil.create('div', 'share-item', this._accountDropdown, '<i class="fa fa-sign-out logout-icon"></i>Log out');

		// events
		Wu.DomEvent.on(this._logoutDiv,  'click', this.logout, this);

		this._accountTabOpen = true;
	},

	_closeAccountTab : function () {

		if (!this._accountTabOpen) return;

		Wu.DomEvent.off(this._logoutDiv,  'click', this.logout, this);

		Wu.DomUtil.remove(this._accountDropdown);

		this._accountTabOpen = false;
	},

	logout : function () {
		window.location.href = '/logout';
	},

	_onCloseMenuTabs : function () {
		
		// app.Chrome();
		this._closeAccountTab();
	},

	isSuper : function () {
		return this.store.access.account_type == 'super';
	},

	// _open : function () {

	// 	// close other tabs
	// 	Wu.Mixin.Events.fire('closeMenuTabs');

	// 	Wu.DomUtil.removeClass(this._shareDropdown, 'displayNone');
	// 	this._isOpen = true;

	// 	// add fullscreen click-ghost
	// 	// this._addGhost();

	// 	// mark button active
	// 	Wu.DomUtil.addClass(this._shareButton, 'active');

	// 	// fill titles
	// 	this._fillTitles();
	// },

	// _close : function () {
	// 	Wu.DomUtil.addClass(this._shareDropdown, 'displayNone');
	// 	this._isOpen = false;

	// 	// remove links if open
	// 	if (this._shareLinkWrapper) Wu.DomUtil.remove(this._shareLinkWrapper);
	// 	if (this._sharePDFInput) Wu.DomUtil.remove(this._sharePDFInput);
	// 	if (this._inviteWrapper) Wu.DomUtil.remove(this._inviteWrapper);
		
	// 	this._shareInviteButton.innerHTML = 'Invite users...';
	// 	Wu.DomUtil.removeClass(this._shareDropdown, 'wide-share');

	// 	// remove ghost
	// 	// this._removeGhost();

	// 	// mark button inactive
	// 	Wu.DomUtil.removeClass(this._shareButton, 'active');
	// },












});
Wu.Model.Layer = Wu.Model.extend({

	type : 'layer',

	options : {
		hoverTooltip : true,	// hover instead of click  todo..
	},

	_initialize : function (layer) {

		// set source
		this.store = layer; // db object
		
		// data not loaded
		this.loaded = false;

	},

	addHooks : function () {
		this._setHooks('on');
	},

	removeHooks : function  () {
		this._setHooks('off');
		this._removeGridEvents();
	},

	_setHooks : function (on) {

		// all visible tiles loaded event (for phantomJS)
		Wu.DomEvent[on](this.layer, 'load', this._onLayerLoaded, this);
		Wu.DomEvent[on](this.layer, 'loading', this._onLayerLoading, this);
	},
	
	_unload : function (e) {
		// delete 
		this.removeHooks();
	},

	_onLayerLoaded : function () {
		app._loaded.push(this.getUuid());
		app._loaded = _.uniq(app._loaded);
	},

	_onLayerLoading : function () {
		app._loading.push(this.getUuid());
		app._loading = _.uniq(app._loading);
	},

	initLayer : function () {

		// create Leaflet layer, load data if necessary
		this._inited = true;
		
		// add hooks
		this.addHooks();
	},

	add : function (type) {

		// mark as base or layermenu layer
		this._isBase = (type == 'baselayer');
		
		// add
		this.addTo();
	},

	addTo : function () {
		if (!this._inited) this.initLayer();

		// add to map
		this._addTo();
		
		// add to controls
		this.addToControls();
	},

	_addTo : function (type) {
		if (!this._inited) this.initLayer();

		var map = app._map;

		// leaflet fn
		map.addLayer(this.layer);

		// add gridLayer if available
		if (this.gridLayer) {
			map.addLayer(this.gridLayer);
		}

		// add to active layers
		app.MapPane.addActiveLayer(this);	// includes baselayers

		// update zindex
		this._addToZIndex(type);

		this._added = true;

		// fire event
		Wu.Mixin.Events.fire('layerEnabled', { detail : {
			layer : this
		}}); 

	},

	_addThin: function () {
		if (!this._inited) this.initLayer();

		var map = app._map;

		// only add to map temporarily
		map.addLayer(this.layer);
		this.layer.bringToFront();

		// add gridLayer if available
		if (this.gridLayer) {
			map.addLayer(this.gridLayer);
		}

	},

	_removeThin : function () {
		if (!this._inited) this.initLayer();

		var map = app._map;

		map.removeLayer(this.layer);

		// remove gridLayer if available
		if (this.gridLayer) {
			this.gridLayer._flush();
			if (map.hasLayer(this.gridLayer)) map.removeLayer(this.gridLayer); 
		}
	},

	flyTo : function () {
		var extent = this.getMeta().extent;
		if (!extent) return;

		var southWest = L.latLng(extent[1], extent[0]),
		    northEast = L.latLng(extent[3], extent[2]),
		    bounds = L.latLngBounds(southWest, northEast),
		    map = app._map,
		    row_count = parseInt(this.getMeta().row_count),
		    flyOptions = {};

		// if large file, don't zoom out
		if (row_count > 500000) { 
			var zoom = map.getZoom();
			flyOptions.minZoom = zoom;
		}

		// fly
		map.fitBounds(bounds, flyOptions);
	},


	addToControls : function () {

		if (this._isBase) return;

		this._addToDescription();
		this._addToLayermenu();
	},

	_addToLayermenu : function () {

		// activate in layermenu
		var layerMenu = app.MapPane.getControls().layermenu;
		layerMenu && layerMenu._enableLayer(this.getUuid());
	},

	_addToLegends : function () {

		// add legends if active
		var legendsControl = app.MapPane.getControls().legends;
		legendsControl && legendsControl.addLegend(this);
	},

	_addToInspect : function () {

		// add to inspectControl if available
		var inspectControl = app.MapPane.getControls().inspect;		
		if (inspectControl) inspectControl.addLayer(this);

	},

	_addToDescription : function () {

		// add to descriptionControl if available
		var descriptionControl = app.MapPane.getControls().description;
		if (!descriptionControl) return;

		// xoxoxo
		descriptionControl._addLayer(this);

		// hide if empty and not editor
		var project = app.activeProject;
		var isEditor = project.isEditor();
		if (this.store.description || isEditor) { // todo: what if only editor 
			descriptionControl.show();
		} else { 								// refactor to descriptionControl
			descriptionControl.hide();
		}
		
	},

	leafletEvent : function (event, fn) {
		this.layer.on(event, fn);
	},

	_addToZIndex : function (type) {
		if (type == 'baselayer') this._isBase = true;
		var zx = this._zx || this._getZX();
		this._isBase ? zx.b.add(this) : zx.l.add(this); // either base or layermenu
	},

	_removeFromZIndex : function () {
		var zx = this._zx || this._getZX();
		this._isBase ? zx.b.remove(this) : zx.l.remove(this);
	},

	_getZX : function () {
		return app.MapPane.getZIndexControls();
	},


	// xoxoxox
	remove : function (map) {
		var map = map || app._map;

		// leaflet fn
		if (map.hasLayer(this.layer)) map.removeLayer(this.layer);

		// remove from active layers
		app.MapPane.removeActiveLayer(this);	

		// remove gridLayer if available
		if (this.gridLayer) {
			this.gridLayer._flush();
			if (map.hasLayer(this.gridLayer)) map.removeLayer(this.gridLayer); 
		}

		// remove from zIndex
		this._removeFromZIndex();

		// remove from descriptionControl if avaialbe
		var descriptionControl = app.MapPane.getControls().description;
		if ( descriptionControl ) descriptionControl._removeLayer(this);

		this._added = false;
	},

	getActiveLayers : function () {
		return this._activeLayers;
	},

	enable : function () {
		this.addTo();
	},

	disable : function () {
		this.remove();
	},

	setOpacity : function (opacity) {
		this.opacity = opacity || 1;
		this.layer.setOpacity(this.opacity);
	},

	getOpacity : function () {
		return this.opacity || 1;
	},

	getContainer : function () {
		return this.layer.getContainer();
	},

	getTitle : function () {
		return this.store.title;
	},

	setTitle : function (title) {

		this.store.title = title;
		this.save('title');

		this.setLegendsTitle(title);
	},

	getDescription : function () {
		return this.store.description;
	},

	setDescription : function (description) {
		this.store.description = description;
		this.save('description');
	},

	getSatellitePosition : function () {
		return this.store.satellite_position;
	},

	setSatellitePosition : function (satellite_position) {
		this.store.satellite_position = satellite_position;
		this.save('satellite_position');
	},

	getCopyright : function () {
		return this.store.copyright;
	},

	setCopyright : function (copyright) {
		this.store.copyright = copyright;
		this.save('copyright');
	},

	getUuid : function () {
		return this.store.uuid;
	},

	getFileUuid : function () {
		return this.store.file;
	},

	getAttribution : function () {
		return this.store.attribution;
	},

	getFile : function () {
		var fileUuid = this.getFileUuid();
		var file = _.find(app.Projects, function (p) {
			return p.files[fileUuid];
		});
		if (!file) return false;
		return file.files[fileUuid];
	},

	getProjectUuid : function () {
		return app.activeProject.store.uuid;
	},

	setCartoid : function (cartoid) {
		this.store.data.cartoid = cartoid;
		this.save('data');
	},

	getCartoid : function () {
		if (this.store.data) return this.store.data.cartoid;
	},

	// set postgis styling 
	setLayerStyle : function (options, callback) {

	},

	// set json representation of style in editor (for easy conversion)
	setEditorStyle : function (options, callback) {

	},

	getEditorStyle : function () {
		return this.getDefaultEditorStyle();
	},

	getDefaultEditorStyle : function () {
		var meta = this.getMeta();

		var columns = meta.columns;
		var field;

		for (var c in columns) {
			field = c;
		}

		
		var style = {
			field : field,
			colors : ['red', 'white', 'blue'],
			marker : {
				width : field,
				opacity : 1,
			}
		}

		return style;
	},

	setCartoCSS : function (json, callback) {

		// send to server
		Wu.post('/api/layers/cartocss/set', JSON.stringify(json), callback, this);
	
		// set locally on layer
		this.setCartoid(json.cartoid);
	},

	getCartoCSS : function (cartoid, callback) {

		var json = {
			cartoid : cartoid
		}

		// get cartocss from server
		Wu.post('/api/layers/cartocss/get', JSON.stringify(json), callback, this);
	},

	getMeta : function () {
		var metajson = this.store.metadata;
		if (!metajson) return false;

		var meta = Wu.parse(metajson);
		return meta;
	},

	getMetaFields : function () {
		var meta = this.getMeta();
		if (!meta) return false;
		if (!meta.json) return false;
		if (!meta.json.vector_layers) return false;
		if (!meta.json.vector_layers[0]) return false;
		if (!meta.json.vector_layers[0].fields) return false;
		return meta.json.vector_layers[0].fields;
	},

	reloadMeta : function (callback) {

		var json = JSON.stringify({
			fileUuid : this.getFileUuid(),
			layerUuid : this.getUuid()
		});

		Wu.post('/api/layer/reloadmeta', json, callback || function (ctx, json) {

		}, this);

	},

	getTooltip : function () {
		var json = this.store.tooltip;
		if (!json) return false;
		var meta = Wu.parse(json);
		return meta;
	},

	setTooltip : function (meta) {
		this.store.tooltip = JSON.stringify(meta);
		this.save('tooltip');
	},

	getStyling : function () {
		var json = this.store.style;
		if (!json) return false;
		var styleJSON = Wu.parse(json);
		return styleJSON;
	},

	setStyling : function (styleJSON) {
		this.store.style = JSON.stringify(styleJSON);
		this.save('style');
	},

	getLegends : function () {
		var meta = this.store.legends
		if (meta) return Wu.parse(meta);
		return false;
	},

	getActiveLegends : function () {
		var legends = this.getLegends();
		var active = _.filter(legends, function (l) {
			return l.on;
		});
		return active;
	},

	setLegends : function (legends) {
		if (!legends) return;
		this.store.legends = JSON.stringify(legends);
		this.save('legends');
	},

	setLegendsTitle : function (title) {
		var legends = Wu.parse(this.store.legends);
		if (!legends[0]) return;
		legends[0].value = title;
		this.setLegends(legends);
	},

	setStyle : function () {

	},

	createLegends : function (callback) {

		// get layer feature values for this layer
		var json = JSON.stringify({
			fileUuid : this.getFileUuid(),
			cartoid : this.getCartoid()
		});

		Wu.post('/api/layer/createlegends', json, callback, this)
	},


	getFeaturesValues : function (callback, ctx) {
		if (!callback || !ctx) return console.error('must provide callback() and context');

		// get layer feature values for this layer
		var json = JSON.stringify({
			fileUuid : this.getFileUuid(),
			cartoid : this.getCartoid()
		});

		Wu.post('/api/util/getfeaturesvalues', json, callback.bind(ctx), this)
	},


	hide : function () {
		var container = this.getContainer();
		container.style.visibility = 'hidden';
	},

	show : function () {
		var container = this.getContainer();
		container.style.visibility = 'visible';
	},

	// save updates to layer (like description, style)
	save : function (field) {

		var json = {};
		json[field] = this.store[field];
		json.layer  = this.store.uuid;
		json.uuid   = app.activeProject.getUuid(); // project uuid

		this._save(json);
	},

	_save : function (json) {
		var string  = JSON.stringify(json);
		Wu.save('/api/layer/update', string);
	},

	_setZIndex : function (z) {
		this.layer.setZIndex(z);
	},
	

	_addGridEvents : function () {
		this._setGridEvents('on');
	},

	_setGridEvents : function (on) {
		var grid = this.gridLayer;
		if (!grid || !on) return;
		grid[on]('mousedown', this._gridOnMousedown, this);
		grid[on]('mouseup', this._gridOnMouseup, this);
		grid[on]('click', this._gridOnClick, this);
	},

	_removeGridEvents : function () {
		this._setGridEvents('off');
	},

	_flush : function () {
		this.remove();
		app.MapPane._clearPopup();
		this._removeGridEvents();
		this.layer = null;
		this.gridLayer = null;
		this._inited = false;
	},

	downloadLayer : function () {

	},
	shareLayer : function () {
		console.log('share layer', this);
	},
	deleteLayer : function () {
		console.log('delete layer', this);
	},

	isPostGIS : function () {
		if (this.store.data && this.store.data.postgis) return true;
		return false;
	},
	isPostgis : function () {
		return this.isPostGIS();
	}
	

});



Wu.PostGISLayer = Wu.Model.Layer.extend({

	initLayer : function () {
		this.update();
		this.addHooks();

		this._listenLocally();

		this._inited = true;
	},

	_listenLocally : function () {
		Wu.DomEvent.on(this.layer, 'load', this._onLayerLoaded, this);
		Wu.DomEvent.on(this.layer, 'loading', this._onLayerLoading, this);
	},

	_onLayerLoading : function () {
		this._loadStart = Date.now();
	},

	_onLayerLoaded : function () {
		var loadTime = Date.now() - this._loadStart;


		app.Analytics._eventLayerLoaded({
			layer : this.getTitle(),
			load_time : loadTime,
		});
	},

	update : function (options, callback) {
		var map = app._map;

		// remove
		if (this.layer) this._flush();

		// prepare raster
		this._prepareRaster();

		// prepare utfgrid
		this._prepareGrid();

		// enable
		if (options && options.enable) {
			map.addLayer(this.layer);
			this.layer.bringToFront();

		}

		callback && callback();
	},

	setStyle : function (postgis) {
		if (!postgis) return console.error('no styloe to set!');
		
		this.store.data.postgis = postgis;
		this.save('data');
	},

	// on change in style editor, etc.
	updateStyle : function (style) {
		var layerUuid = style.layerUuid,
		    postgisOptions = style.options;

		// save 
		this.setStyle(postgisOptions);

		// update layer option
		this._refreshLayer(layerUuid);

		// fire event
		Wu.Mixin.Events.fire('layerStyleEdited', { detail : {
			layer : this
		}}); 
	},

	_getLayerUuid : function () {
		return this.store.data.postgis.layer_id;
	},

	getCartoCSS : function (cartoid, callback) {
		return this.store.data.postgis.cartocss;
	},

	getSQL : function () {
		return this.store.data.postgis.sql;
	},

	setFilter : function (filter) {
		this.store.filter = filter;
		this.save('filter');
	},

	getFilter : function () {
		return this.store.filter;
	},

	getPostGISData : function () {
		return this.store.data.postgis;
	},

	_refreshLayer : function (layerUuid) {
		this.layer.setOptions({
			layerUuid : layerUuid
		});

		this.layer.redraw();
	},


	_prepareRaster : function () {

		// set ids
		var fileUuid 	= this._fileUuid,	// file id of geojson
		    subdomains  = app.options.servers.tiles.subdomains,
		    access_token = '?access_token=' + app.tokens.access_token;

		var layerUuid = this._getLayerUuid();
		// var url = 'https://{s}.systemapic.com/tiles/{layerUuid}/{z}/{x}/{y}.png' + access_token;
		var url = app.options.servers.tiles.uri + '{layerUuid}/{z}/{x}/{y}.png' + access_token;

		// add vector tile raster layer
		this.layer = L.tileLayer(url, {
			layerUuid: this._getLayerUuid(),
			subdomains : subdomains,
			maxRequests : 0,
			maxZoom : 19
		});

	},

	_invalidateTiles : function () {
		return;
	},

	_updateGrid : function (l) {

		// refresh of gridlayer is attached to layer. this because vector tiles are not made in vile.js, 
		// and it's much more stable if gridlayer requests tiles after raster layer... perhpas todo: improve this hack!
		// - also, removed listeners in L.UtfGrid (onAdd)
		// 

		if (this.gridLayer) {
			this.gridLayer._update();
		}
	},

	_prepareGrid : function () {

		// set ids
		var subdomains  = app.options.servers.utfgrid.subdomains,
		    access_token = '?access_token=' + app.tokens.access_token;
		
		var layerUuid = this._getLayerUuid();
		var url = app.options.servers.tiles.uri + "{layerUuid}/{z}/{x}/{y}.grid" + access_token;


		// create gridlayer
		this.gridLayer = new L.UtfGrid(url, {
			useJsonP: false,
			subdomains: subdomains,
			maxRequests : 0,
			requestTimeout : 10000,
			layerUuid : layerUuid,
			maxZoom : 19
		});

		// add grid events
		this._addGridEvents();

	},


	_fetchData : function (e, callback) {

		var keys = Object.keys(e.data);
		var column = keys[0];
		var row = e.data[column];
		var layer_id = e.layer.store.data.postgis.layer_id;

		var options = {
			column : column,
			row : row,
			layer_id : layer_id,
			access_token : app.tokens.access_token
		}

		Wu.send('/api/db/fetch', options, callback, this);
	},

	_gridOnMousedown : function(e) {
		
	},

	_gridOnMouseup : function (e) {
		if (!e.data) return;

		// pass layer
		e.layer = this;

		var event = e.e.originalEvent;

		if (this._event === undefined || this._event.x == event.x) {
			
		} else {
			// clear old
			app.MapPane._clearPopup();
		}

	},

	_gridOnClick : function (e) {
		if (!e.data) return;
		if (app.MapPane._drawing) return;

		// pass layer
		e.layer = this;

		// fetch data
		this._fetchData(e, function (ctx, json) {
			
			var data = JSON.parse(json);

			e.data = data;
			var event = e.e.originalEvent;
			this._event = {
				x : event.x,
				y : event.y
			}

			// open popup
			app.MapPane._addPopupContent(e);

			// analytics/slack
			app.Analytics.onPointQuery(e);
		});


	},


	downloadLayer : function () {

		var options = {
			layer_id : this.getUuid(), 
			socket_notification : true
		}

		// set download id for feedback
		this._downloadingID = Wu.Util.createRandom(5);

		Wu.post('/api/layer/downloadDataset', JSON.stringify(options), function (err, resp) {

			// give feedback
			app.feedback.setMessage({
				title : 'Preparing download',
				description : 'Hold tight! Your download will be ready in a minute.',
				id : this._downloadingID
			});	
		});

	},

	_onDownloadReady : function (e) {
		var options = e.detail,
		    file_id = options.file_id,
		    finished = options.finished,
		    filepath = options.filepath;

		// parse results
		var path = app.options.servers.portal;
		path += 'api/file/download/';
		path += '?file=' + filepath;
		// path += '?raw=true'; // add raw to path
		path += '&type=shp';
		path += '&access_token=' + app.tokens.access_token;

		// open (note: some browsers will block pop-ups. todo: test browsers!)
		window.open(path, 'mywindow')

		// remove feedback
		app.feedback.remove(this._downloadingID);
	},

	shareLayer : function () {

	},

	deleteLayer : function () {

		// confirm
		var message = 'Are you sure you want to delete this layer? \n - ' + this.getTitle();
		if (!confirm(message)) return console.log('No layer deleted.');

		// get project
		var layerUuid = this.getUuid();
		var project = _.find(app.Projects, function (p) {
			return p.layers[layerUuid];
		})

		// delete layer
		project.deleteLayer(this);
	},
	

});




// systemapic layers
Wu.RasterLayer = Wu.Model.Layer.extend({

	initialize : function (layer) {

		// set source
		this.store = layer; // db object
		
		// data not loaded
		this.loaded = false;

	},


	initLayer : function () {
		this.update();
	},

	update : function () {
		var map = app._map;

		this._fileUuid = this.store.file;
		this._defaultCartoid = 'raster';

		// prepare raster
		this._prepareRaster();

	},


	_prepareRaster : function () {

		// set ids
		var fileUuid 	= this._fileUuid,	// file id of geojson
		    cartoid 	= this.store.data.cartoid || this._defaultCartoid,
		    tileServer 	= app.options.servers.tiles.uri,
		    subdomains  = app.options.servers.tiles.subdomains,
		    token 	= '?access_token=' + app.tokens.access_token,
		    url 	= tileServer + '{fileUuid}/{cartoid}/{z}/{x}/{y}.png' + token;

		var layerUuid = this._getLayerUuid();
		var url = app.options.servers.subdomain + 'overlay_tiles/{layerUuid}/{z}/{x}/{y}.png' + token;

		// add vector tile raster layer
		this.layer = L.tileLayer(url, {
			fileUuid: fileUuid,
			layerUuid : layerUuid,
			subdomains : subdomains,
			maxRequests : 0,
			tms : true
		});
	},


	_getLayerUuid : function () {
		return this.store.data.raster;
	},

	getMeta : function () {
		var metajson = this.store.metadata;
		var meta = Wu.parse(metajson);
		return meta;
	},

	getFileMeta : function () {
		var file = app.Account.getFile(this.store.file);
		var metajson = file.store.data.raster.metadata;
		var meta = Wu.parse(metajson);
		return meta;
	},

	flyTo : function () {
		var extent = this.getMeta().extent;
		if (!extent) return;

		var southWest = L.latLng(extent[1], extent[0]),
		    northEast = L.latLng(extent[3], extent[2]),
		    bounds = L.latLngBounds(southWest, northEast),
		    map = app._map,
		    row_count = parseInt(this.getMeta().row_count),
		    flyOptions = {};

		// if large file, don't zoom out
		if (row_count > 500000) { 
			var zoom = map.getZoom();
			flyOptions.minZoom = zoom;
		}

		// fly
		map.fitBounds(bounds, flyOptions);
	},

	deleteLayer : function () {

		// confirm
		var message = 'Are you sure you want to delete this layer? \n - ' + this.getTitle();
		if (!confirm(message)) return console.log('No layer deleted.');

		// get project
		var layerUuid = this.getUuid();
		var project = _.find(app.Projects, function (p) {
			return p.layers[layerUuid];
		})

		// delete layer
		project.deleteLayer(this);
	},

	downloadLayer : function () {
		console.log('raster downloadLayer');
	}
});






Wu.MapboxLayer = Wu.Model.Layer.extend({

	type : 'mapboxLayer',
	
	initLayer : function () {

		var url = 'https://{s}.tiles.mapbox.com/v4/{mapboxUri}/{z}/{x}/{y}.png?access_token={accessToken}';

		this.layer = L.tileLayer(url, {
			accessToken : this.store.accessToken,
			mapboxUri : this.store.data.mapbox,
		});

		// add hooks
		this.addHooks();
		this.loaded = true;
		this._inited = true;
	},
});



Wu.GoogleLayer = Wu.Model.Layer.extend({

	type : 'googleLayer',

	options : {
		minZoom : 0,
		maxZoom : 20,
	},

	initialize : function (layer) {

		// set source
		this.store = layer; // db object
		
		// data not loaded
		this.loaded = false;
	},

	initLayer : function () {
		this.update();
	},

	update : function () {
		var map = app._map;

		// prepare raster
		this._prepareRaster();
	},

	getTileType : function () {
		return this.store.tileType || 'aerial';
	},

	_prepareRaster : function () {

		// norkart
		var type = this.getTileType();
		var access_token = '?access_token=' + app.tokens.access_token;
		var url = app.options.servers.proxy.uri + 'google/{type}/{z}/{x}/{y}.png' + access_token;
		var subdomains  = app.options.servers.proxy.subdomains;

		// add vector tile raster layer
		this.layer = L.tileLayer(url, {
			type : type,
			// format : format,
			subdomains : subdomains,
			maxRequests : 0,
			tms : false,
			maxZoom : this.options.maxZoom,
			minZoom : this.options.minZoom,
		});

	},

});


Wu.NorkartLayer = Wu.Model.Layer.extend({

	type : 'norkartLayer',

	// ATTRIBUTION // TODO!
	// -----------
	// add attribution to layer.options (ie. leaflet layer)
	// change attribution on mapmove, use _getCopyrightText

	options : {
		// norkart options
		log_url : 'https://www.webatlas.no/weblog/Log2.aspx?',
		current_mapstyle : 1, // aerial,
	        tileformats : {
	        	vector: "png",
	                aerial: "jpeg",
	                hybrid: "jpeg"
	        },
		customer_id : 'systemapic',
		minZoom : 0,
		maxZoom : 20,
	},

	initialize : function (layer) {

		// set source
		this.store = layer; // db object
		
		// data not loaded
		this.loaded = false;
	},

	initLayer : function () {
		this.update();
	},

	update : function () {
		var map = app._map;

		// prepare raster
		this._prepareRaster();
	},

	getTileType : function () {
		return this.store.tileType || 'aerial';
	},

	_prepareRaster : function () {

		// norkart
		var type = this.getTileType();
		var format = this.options.tileformats[type];
		var access_token = '?access_token=' + app.tokens.access_token;
		// var url = 'https://{s}.systemapic.com/proxy/norkart/{type}/{z}/{x}/{y}.{format}' + access_token;
		var url = app.options.servers.proxy.uri + 'norkart/{type}/{z}/{x}/{y}.{format}' + access_token;
		var subdomains  = app.options.servers.proxy.subdomains;

		// add vector tile raster layer
		this.layer = L.tileLayer(url, {
			type : type,
			format : format,
			subdomains : subdomains,
			maxRequests : 0,
			tms : false,
			maxZoom : this.options.maxZoom,
			minZoom : this.options.minZoom,
		});

		// add clear background cache event (hack for hanging tiles)
		// see: https://github.com/Leaflet/Leaflet/issues/1905
		if (!this._eventsAdded) this._addEvents();

		// add move event (for norkart logging)
		if (!this._logEvent) this._logEvent = true;
	},

	_addEvents : function () {
		app._map.on('zoomend', this._clearBackgroundCache.bind(this));
		app._map.on('moveend', _.throttle(this.logMapRequest.bind(this), 350));
		this._eventsAdded = true;
	},

	_clearBackgroundCache : function () {
		// clear cache if at zoom break-point
		var zoom = app._map.getZoom(); // after
		if (zoom == this.options.minZoom - 1) {
			this.layer && this.layer._clearBgBuffer();
		}
		if (zoom == this.options.maxZoom + 1) {
			this.layer && this.layer._clearBgBuffer();
		}
	},

	logMapRequest: function() {

		// don't log if not within zoom levels
		var zoom = app._map.getZoom();
		if (zoom > this.options.maxZoom || zoom < this.options.minZoom) return;

		var e = app._map.getBounds(),
		    t = e.getNorthWest().lng,
		    n = e.getNorthWest().lat,
		    r = e.getSouthEast().lng,
		    i = e.getSouthEast().lat,
		    s = document.createElement("img");
		
		// log
		var logstring = this.options.log_url + "WMS-REQUEST=BBOX=" + t + "," + i + "," + r + "," + n + "&MAPSTYLE=" + this.options.current_mapstyle + "&CUSTOMER=" + this.options.customer_id;
		s.src = logstring;
		s = null;
	},

	// norkart fn
	_getCopyrightText: function() {
		var e = this._map.getCenter(),
		    t = this._map.getZoom(),
		    n = [
		    	"&copy; 2015 Norkart AS/Plan- og bygningsetaten, Oslo Kommune", 
		    	"&copy; 2015 Norkart AS/Geovekst og kommunene/OpenStreetMap/NASA, Meti", 
		    	"&copy; 2015 Norkart AS/Geovekst og kommunene/OpenStreetMap/NASA, Meti", 
		    	"&copy; 2015 Norkart AS/OpenStreetMap/EEA CLC2006"
		    ];
		
		if (t >= 13) {
			if (t <= 14) {
				try {
					if (this.t_containsPoint(e, L.Control.WAAttribution.t_norgeLat, L.Control.WAAttribution.t_norgeLon)) return n[1];
				} catch (r) {console.log('catch err', r);};
			} else {
				try {
					if (this.t_containsPoint(e, L.Control.WAAttribution.t_osloLat, L.Control.WAAttribution.t_osloLon)) return n[0];
				} catch (r) {console.log('catch err', r);};
			}
			
			try {
				if (this.t_containsPoint(e, L.Control.WAAttribution.t_norgeLat, L.Control.WAAttribution.t_norgeLon)) return n[1];
			} catch (r) {console.log('catch err', r);};
		
			return n[3]
		}
		
		try {
			return this.t_containsPoint(e, L.Control.WAAttribution.t_norgeLat, L.Control.WAAttribution.t_norgeLon) ? n[2] : n[3]
		} catch (r) {console.log('catch err', r);};

        },

        // norkart fn
        t_containsPoint: function(e, t, n) {
		var r, i = 0,
		    s = t.length,
		    o = !1;
		for (r = 0; r < s; r++) i++, i == s && (i = 0), (n[r] < e.lng && n[i] >= e.lng || n[i] < e.lng && n[r] >= e.lng) && t[r] + (e.lng - n[r]) / (n[i] - n[r]) * (t[i] - t[r]) < e.lat && (o = !o);
		return o;
        },
        statics: {
		t_osloLat: [59.81691, 59.81734, 59.81813, 59.82537, 59.82484, 59.82298, 59.82343, 59.82494, 59.82588, 59.8262, 59.82367, 59.82349, 59.82954, 59.83053, 59.83929, 59.85107, 59.87719, 59.87593, 59.88371, 59.88441, 59.89462, 59.90941, 59.91071, 59.91407, 59.9147, 59.91405, 59.91468, 59.91632, 59.91732, 59.91797, 59.91771, 59.91876, 59.92173, 59.92246, 59.9235, 59.92441, 59.92518, 59.92709, 59.92786, 59.92963, 59.93123, 59.93255, 59.93459, 59.93579, 59.93925, 59.9424, 59.9428, 59.94566, 59.94784, 59.95187, 59.9523, 59.95303, 59.95354, 59.95371, 59.95626, 59.95723, 59.95856, 59.96163, 59.96267, 59.96483, 59.96634, 59.97051, 59.97432, 59.97661, 59.97698, 59.97671, 59.9777, 59.97674, 59.97686, 59.97754, 59.9786, 59.98552, 59.99223, 59.99403, 59.99639, 59.99672, 59.99462, 59.99365, 59.99552, 59.99804, 60.00064, 60.00014, 59.99932, 59.99977, 59.99991, 59.99936, 60.0085, 60.01579, 60.01726, 60.02602, 60.03843, 60.05177, 60.06503, 60.07624, 60.07728, 60.08286, 60.09214, 60.09394, 60.10068, 60.10983, 60.11678, 60.1287, 60.13162, 60.13459, 60.13518, 60.13277, 60.13353, 60.1258, 60.12586, 60.12531, 60.12519, 60.12286, 60.12117, 60.1194, 60.11991, 60.11966, 60.12019, 60.12059, 60.12154, 60.12172, 60.12365, 60.12504, 60.12573, 60.12526, 60.12326, 60.12303, 60.12161, 60.12081, 60.11833, 60.11285, 60.11218, 60.1118, 60.10609, 60.10496, 60.10103, 60.09955, 60.09917, 60.0986, 60.09856, 60.09777, 60.09268, 60.08689, 60.08659, 60.08403, 60.07893, 60.07827, 60.07714, 60.07484, 60.0706, 60.06755, 60.06689, 60.0661, 60.06575, 60.06421, 60.06467, 60.06436, 60.06515, 60.06489, 60.06429, 60.05371, 60.04309, 60.04054, 60.03783, 60.03693, 60.03563, 60.03328, 60.03026, 60.02976, 60.02912, 60.02736, 60.0211, 60.01813, 60.01788, 60.01734, 60.01791, 60.02211, 60.02327, 60.02315, 60.02148, 60.01985, 60.0178, 60.00969, 60.00846, 60.0061, 59.99799, 59.99815, 59.99714, 59.99964, 60.00179, 59.99616, 59.99552, 59.99566, 59.99491, 59.99301, 59.98677, 59.98558, 59.98442, 59.98078, 59.98053, 59.98072, 59.98023, 59.98099, 59.98398, 59.98455, 59.98372, 59.97712, 59.97705, 59.96955, 59.96552, 59.96286, 59.95484, 59.9526, 59.95321, 59.94924, 59.94803, 59.94694, 59.94778, 59.94687, 59.94598, 59.94572, 59.94318, 59.9418, 59.94116, 59.93486, 59.92653, 59.92045, 59.91937, 59.91228, 59.91162, 59.91127, 59.90041, 59.89682, 59.88496, 59.87528, 59.86989, 59.86475, 59.8601, 59.85206, 59.84493, 59.83684, 59.83631, 59.83489, 59.8317, 59.83133, 59.82693, 59.82773, 59.82776, 59.82679, 59.8271, 59.82629, 59.82609, 59.8262, 59.82548, 59.82368, 59.82204, 59.82102, 59.81815, 59.81703, 59.81575, 59.81434, 59.81216, 59.81104, 59.81204, 59.81297, 59.81306, 59.81232, 59.80946, 59.81198, 59.81529, 59.81685, 59.81616, 59.81699, 59.81691],
		t_osloLon: [10.83369, 10.83169, 10.81725, 10.81244, 10.8045, 10.79843, 10.7892, 10.78261, 10.78091, 10.77675, 10.77244, 10.77156, 10.76478, 10.76156, 10.744, 10.73995, 10.73097, 10.68893, 10.66064, 10.65808, 10.65387, 10.64777, 10.64253, 10.63988, 10.63553, 10.63506, 10.63304, 10.63298, 10.63427, 10.63309, 10.63123, 10.63006, 10.62936, 10.62578, 10.62532, 10.62596, 10.62746, 10.62543, 10.62708, 10.62647, 10.63107, 10.63299, 10.63402, 10.63531, 10.63161, 10.63341, 10.63289, 10.63581, 10.63561, 10.63387, 10.63304, 10.63403, 10.63353, 10.63205, 10.63083, 10.63175, 10.62995, 10.62758, 10.62357, 10.62444, 10.62051, 10.61817, 10.61395, 10.61045, 10.60385, 10.6037, 10.59622, 10.59395, 10.59165, 10.59027, 10.59025, 10.57878, 10.5657, 10.55948, 10.55692, 10.55585, 10.55218, 10.54912, 10.54526, 10.54399, 10.5338, 10.52968, 10.52841, 10.52754, 10.52266, 10.51795, 10.50366, 10.49021, 10.48916, 10.50276, 10.52201, 10.54276, 10.56337, 10.58077, 10.59731, 10.59278, 10.59184, 10.59212, 10.58836, 10.57999, 10.57278, 10.59522, 10.60081, 10.61047, 10.61906, 10.64515, 10.68032, 10.69737, 10.69842, 10.69986, 10.70447, 10.70493, 10.70385, 10.70726, 10.71477, 10.71615, 10.71703, 10.71688, 10.7198, 10.72497, 10.73165, 10.73248, 10.73712, 10.74026, 10.74418, 10.74689, 10.7483, 10.75123, 10.75232, 10.76785, 10.7684, 10.76621, 10.75711, 10.75593, 10.75475, 10.75534, 10.75762, 10.75796, 10.75916, 10.76205, 10.7671, 10.77063, 10.77233, 10.77481, 10.77796, 10.77902, 10.77864, 10.78232, 10.7847, 10.78802, 10.79385, 10.79691, 10.80157, 10.80937, 10.81045, 10.81208, 10.81561, 10.81927, 10.81976, 10.81656, 10.81803, 10.81696, 10.8181, 10.81464, 10.8128, 10.81205, 10.81316, 10.8124, 10.8134, 10.812, 10.81542, 10.81921, 10.82064, 10.82139, 10.82217, 10.8235, 10.82526, 10.82693, 10.82875, 10.82921, 10.83204, 10.83314, 10.83571, 10.83704, 10.83808, 10.8391, 10.84252, 10.84311, 10.84959, 10.85821, 10.86331, 10.86429, 10.86605, 10.86714, 10.87516, 10.8754, 10.88293, 10.89337, 10.90433, 10.90591, 10.9074, 10.91267, 10.91629, 10.9182, 10.92565, 10.93057, 10.93106, 10.93751, 10.93807, 10.93705, 10.94129, 10.94334, 10.94433, 10.95138, 10.94763, 10.94608, 10.94499, 10.94244, 10.94272, 10.94206, 10.94584, 10.94306, 10.94246, 10.92912, 10.92148, 10.91913, 10.91781, 10.91573, 10.91481, 10.91521, 10.91188, 10.91142, 10.90762, 10.90988, 10.90715, 10.90934, 10.91233, 10.92155, 10.92651, 10.93119, 10.93367, 10.9352, 10.9366, 10.933, 10.92716, 10.92303, 10.91703, 10.91477, 10.91326, 10.91079, 10.91094, 10.90679, 10.90105, 10.89649, 10.89677, 10.8918, 10.89157, 10.88907, 10.8876, 10.88294, 10.88188, 10.87985, 10.87885, 10.87378, 10.86889, 10.86313, 10.85584, 10.8479, 10.84604, 10.84597, 10.8373, 10.83566, 10.83369],
		t_norgeLat: [69.11, 69.09, 69.04, 69.04, 69.09, 69.1, 69.12, 69.18, 69.19, 69.2, 69.22, 69.23, 69.26, 69.27, 69.28, 69.28, 69.31, 69.3, 69.27, 69.24, 69.24, 69.15, 69.13, 69.13, 69.12, 69.11, 69.09, 69.02, 69.01, 68.96, 68.96, 68.93, 68.93, 68.91, 68.85, 68.83, 68.82, 68.8, 68.79, 68.75, 68.74, 68.72, 68.72, 68.72, 68.73, 68.74, 68.74, 68.74, 68.73, 68.71, 68.7, 68.69, 68.69, 68.69, 68.68, 68.68, 68.63, 68.63, 68.63, 68.64, 68.64, 68.64, 68.66, 68.66, 68.67, 68.67, 68.68, 68.69, 68.7, 68.7, 68.7, 68.7, 68.71, 68.71, 68.75, 68.78, 68.82, 68.84, 68.83, 68.83, 68.83, 68.81, 68.8, 68.79, 68.76, 68.76, 68.75, 68.74, 68.73, 68.73, 68.73, 68.71, 68.69, 68.68, 68.66, 68.65, 68.65, 68.66, 68.64, 68.63, 68.63, 68.62, 68.61, 68.59, 68.56, 68.56, 68.56, 68.55, 68.55, 68.56, 68.57, 68.58, 68.59, 68.59, 68.6, 68.61, 68.61, 68.61, 68.61, 68.62, 68.62, 68.62, 68.62, 68.62, 68.62, 68.62, 68.62, 68.62, 68.63, 68.63, 68.64, 68.64, 68.65, 68.66, 68.66, 68.67, 68.68, 68.69, 68.69, 68.7, 68.7, 68.71, 68.71, 68.72, 68.73, 68.74, 68.75, 68.8, 68.8, 68.8, 68.81, 68.82, 68.83, 68.84, 68.84, 68.85, 68.85, 68.86, 68.86, 68.86, 68.87, 68.88, 68.88, 68.88, 68.88, 68.89, 68.89, 68.89, 68.89, 68.9, 68.9, 68.9, 68.9, 68.9, 68.9, 68.89, 68.89, 68.89, 68.89, 68.89, 68.88, 68.88, 68.88, 68.89, 68.89, 68.89, 68.9, 68.9, 68.92, 68.93, 68.94, 68.94, 68.95, 68.99, 69, 69.01, 69.01, 69.02, 69.11, 69.12, 69.14, 69.15, 69.17, 69.18, 69.19, 69.2, 69.22, 69.23, 69.23, 69.25, 69.26, 69.27, 69.27, 69.28, 69.28, 69.29, 69.3, 69.3, 69.31, 69.31, 69.34, 69.34, 69.35, 69.36, 69.36, 69.37, 69.38, 69.39, 69.39, 69.4, 69.41, 69.42, 69.42, 69.43, 69.43, 69.44, 69.45, 69.46, 69.47, 69.48, 69.49, 69.51, 69.52, 69.53, 69.55, 69.56, 69.57, 69.58, 69.59, 69.61, 69.63, 69.65, 69.65, 69.65, 69.66, 69.67, 69.68, 69.68, 69.69, 69.7, 69.71, 69.72, 69.73, 69.73, 69.74, 69.74, 69.75, 69.75, 69.77, 69.8, 69.81, 69.82, 69.83, 69.85, 69.86, 69.88, 69.89, 69.9, 69.91, 69.92, 69.94, 69.96, 69.96, 69.95, 69.95, 69.95, 69.94, 69.95, 69.95, 69.96, 69.96, 69.95, 69.95, 69.94, 69.93, 69.93, 69.93, 69.93, 69.94, 69.94, 69.94, 69.93, 69.93, 69.92, 69.91, 69.91, 69.91, 69.92, 69.93, 69.93, 69.93, 69.95, 69.95, 69.95, 69.95, 69.96, 69.96, 69.97, 69.98, 69.98, 69.99, 69.99, 69.99, 70, 70.01, 70.02, 70.02, 70.02, 70.02, 70.03, 70.03, 70.04, 70.05, 70.06, 70.06, 70.07, 70.08, 70.07, 70.06, 70.06, 70.07, 70.07, 70.08, 70.09, 70.09, 70.09, 70.05, 70.04, 70.04, 70, 69.92, 69.9, 69.89, 69.88, 69.87, 69.87, 69.86, 69.85, 69.83, 69.82, 69.79, 69.78, 69.69, 69.69, 69.68, 69.67, 69.57, 69.55, 69.53, 69.52, 69.51, 69.49, 69.48, 69.47, 69.46, 69.41, 69.4, 69.31, 69.28, 69.23, 69.22, 69.19, 69.18, 69.16, 69.14, 69.13, 69.12, 69.11, 69.1, 69.09, 69.08, 69.06, 69.05, 69.04, 69.04, 69.02, 69.02, 69.01, 69.02, 69.02, 69.03, 69.03, 69.06, 69.07, 69.11, 69.12, 69.15, 69.18, 69.21, 69.23, 69.24, 69.24, 69.25, 69.25, 69.26, 69.27, 69.29, 69.3, 69.31, 69.31, 69.31, 69.31, 69.33, 69.33, 69.31, 69.32, 69.32, 69.33, 69.35, 69.37, 69.37, 69.39, 69.39, 69.4, 69.4, 69.41, 69.42, 69.42, 69.42, 69.42, 69.41, 69.41, 69.4, 69.41, 69.41, 69.41, 69.42, 69.43, 69.43, 69.43, 69.44, 69.45, 69.46, 69.47, 69.47, 69.47, 69.49, 69.51, 69.52, 69.52, 69.53, 69.53, 69.55, 69.56, 69.58, 69.59, 69.6, 69.62, 69.63, 69.64, 69.64, 69.64, 69.64, 69.65, 69.66, 69.67, 69.67, 69.65, 69.63, 69.63, 69.63, 69.62, 69.61, 69.59, 69.54, 69.54, 69.54, 69.54, 69.54, 69.54, 69.54, 69.54, 69.53, 69.53, 69.53, 69.56, 69.56, 69.57, 69.58, 69.59, 69.61, 69.64, 69.65, 69.66, 69.67, 69.68, 69.67, 69.67, 69.68, 69.69, 69.69, 69.7, 69.7, 69.71, 69.72, 69.72, 69.73, 69.78, 69.78, 69.79, 69.78, 69.78, 69.77, 69.77, 69.76, 69.76, 69.76, 69.79, 69.79, 69.79, 69.98, 70.01, 70.12, 70.12, 70.11, 70.14, 70.24, 70.35, 70.36, 70.4, 70.44, 70.47, 70.5, 70.54, 70.65, 70.67, 70.83, 70.87, 70.94, 70.95, 71.02, 71.12, 71.28, 71.3, 71.32, 71.33, 71.35, 71.36, 71.38, 71.38, 71.34, 71.31, 71.31, 71.3, 71.29, 71.27, 71.19, 71.11, 70.99, 70.98, 70.9, 70.85, 70.79, 70.7, 70.63, 70.56, 70.48, 70.39, 70.35, 70.17, 70.07, 69.99, 69.81, 69.75, 69.71, 69.7, 69.65, 69.6, 69.52, 69.51, 69.39, 69.35, 69.32, 69.25, 69.25, 69.18, 69.08, 69.07, 69, 68.9, 68.85, 68.76, 68.73, 68.61, 68.54, 68.46, 68.46, 68.4, 68.39, 68.34, 68.29, 68.24, 68.15, 68.12, 68.1, 68.01, 67.87, 67.82, 67.78, 67.7, 67.7, 67.62, 67.59, 67.54, 67.47, 67.44, 67.39, 67.34, 67.02, 66.82, 66.71, 66.67, 66.4, 66.19, 65.97, 65.7, 65.57, 65.54, 65.5, 65.47, 65.35, 65.27, 65.05, 64.99, 64.87, 64.78, 64.73, 64.55, 64.36, 64.24, 64.14, 64.04, 63.77, 63.7, 63.58, 63.43, 63.34, 63.31, 63.27, 63.26, 63.25, 63.19, 63.18, 63.15, 63.09, 63.02, 63, 62.97, 62.93, 62.81, 62.75, 62.67, 62.62, 62.47, 62.43, 62.38, 62.29, 62.18, 62.15, 62.03, 61.85, 61.78, 61.71, 61.68, 61.55, 61.54, 61.49, 61.35, 61.23, 61.16, 61.07, 61, 60.83, 60.81, 60.72, 60.69, 60.57, 60.51, 60.44, 60.41, 60.39, 60.31, 60.23, 60.17, 60.1, 60.07, 60.05, 59.91, 59.87, 59.79, 59.76, 59.72, 59.68, 59.67, 59.56, 59.56, 59.5, 59.44, 59.36, 59.31, 59.27, 59.22, 59.18, 59.14, 59.12, 59.07, 59.04, 59, 58.96, 58.92, 58.81, 58.78, 58.76, 58.65, 58.62, 58.6, 58.55, 58.53, 58.5, 58.44, 58.4, 58.36, 58.33, 58.28, 58.16, 58.08, 58.07, 58.06, 58.03, 58.02, 57.97, 57.91, 57.88, 57.88, 57.82, 57.79, 57.77, 57.76, 57.76, 57.76, 57.76, 57.77, 57.78, 57.79, 57.8, 57.83, 57.85, 57.9, 57.92, 57.94, 57.98, 58.02, 58.04, 58.08, 58.13, 58.15, 58.17, 58.25, 58.39, 58.42, 58.43, 58.52, 58.6, 58.67, 58.72, 58.72, 58.73, 58.74, 58.76, 58.77, 58.77, 58.76, 58.76, 58.89, 58.94, 58.96, 58.98, 58.99, 59.01, 59.08, 59.08, 59.09, 59.09, 59.09, 59.09, 59.1, 59.1, 59.1, 59.1, 59.1, 59.1, 59.1, 59.08, 59.08, 59.07, 59.06, 59.06, 59.04, 59.04, 59.03, 59.02, 59.01, 58.99, 58.99, 58.98, 58.97, 58.95, 58.94, 58.93, 58.92, 58.89, 58.89, 58.89, 58.89, 58.89, 58.88, 58.88, 58.88, 58.88, 58.88, 58.88, 58.88, 58.89, 58.89, 58.89, 58.88, 58.88, 58.89, 58.89, 58.89, 58.89, 58.9, 58.9, 58.9, 58.9, 58.9, 58.91, 58.92, 58.92, 58.93, 58.93, 58.94, 58.95, 58.96, 58.98, 58.99, 59.01, 59.01, 59.03, 59.03, 59.04, 59.05, 59.06, 59.07, 59.09, 59.09, 59.1, 59.11, 59.12, 59.12, 59.13, 59.14, 59.15, 59.16, 59.17, 59.18, 59.19, 59.2, 59.21, 59.22, 59.22, 59.23, 59.23, 59.24, 59.25, 59.27, 59.29, 59.31, 59.32, 59.32, 59.33, 59.34, 59.34, 59.35, 59.38, 59.4, 59.41, 59.42, 59.42, 59.43, 59.44, 59.46, 59.47, 59.48, 59.5, 59.51, 59.54, 59.55, 59.56, 59.57, 59.58, 59.59, 59.6, 59.61, 59.61, 59.62, 59.62, 59.63, 59.63, 59.64, 59.64, 59.64, 59.64, 59.64, 59.64, 59.65, 59.65, 59.66, 59.67, 59.68, 59.69, 59.69, 59.69, 59.69, 59.69, 59.69, 59.7, 59.71, 59.72, 59.73, 59.75, 59.75, 59.76, 59.77, 59.78, 59.79, 59.8, 59.82, 59.83, 59.83, 59.83, 59.84, 59.84, 59.85, 59.85, 59.86, 59.87, 59.87, 59.87, 59.88, 59.89, 59.89, 59.9, 59.9, 59.89, 59.89, 59.89, 59.89, 59.89, 59.89, 59.89, 59.89, 59.89, 59.89, 59.89, 59.89, 59.9, 59.9, 59.9, 59.91, 59.93, 59.93, 59.94, 59.94, 59.95, 59.96, 59.96, 59.97, 59.98, 59.98, 59.99, 60, 60.01, 60.02, 60.02, 60.03, 60.04, 60.05, 60.06, 60.07, 60.09, 60.13, 60.14, 60.15, 60.16, 60.19, 60.22, 60.23, 60.24, 60.25, 60.26, 60.28, 60.3, 60.31, 60.32, 60.33, 60.33, 60.34, 60.35, 60.36, 60.36, 60.37, 60.38, 60.39, 60.39, 60.4, 60.41, 60.43, 60.44, 60.48, 60.51, 60.52, 60.53, 60.54, 60.55, 60.57, 60.59, 60.6, 60.61, 60.61, 60.62, 60.63, 60.64, 60.65, 60.66, 60.67, 60.68, 60.7, 60.71, 60.73, 60.75, 60.79, 60.83, 60.84, 60.85, 60.86, 60.87, 60.88, 60.89, 60.9, 60.91, 60.92, 60.92, 60.94, 60.97, 60.98, 60.99, 61, 61.01, 61.03, 61.04, 61.04, 61.04, 61.04, 61.05, 61.05, 61.05, 61.05, 61.05, 61.05, 61.05, 61.05, 61.05, 61.05, 61.05, 61.06, 61.06, 61.06, 61.07, 61.08, 61.09, 61.09, 61.1, 61.12, 61.14, 61.19, 61.22, 61.24, 61.26, 61.27, 61.29, 61.31, 61.32, 61.36, 61.37, 61.39, 61.4, 61.42, 61.43, 61.48, 61.53, 61.55, 61.57, 61.57, 61.57, 61.57, 61.57, 61.56, 61.56, 61.56, 61.58, 61.59, 61.6, 61.62, 61.62, 61.63, 61.69, 61.7, 61.72, 61.75, 61.75, 61.77, 61.8, 61.82, 61.83, 61.85, 61.87, 61.88, 61.89, 61.91, 62, 62.12, 62.15, 62.17, 62.18, 62.2, 62.22, 62.25, 62.26, 62.27, 62.27, 62.38, 62.39, 62.4, 62.41, 62.46, 62.52, 62.58, 62.59, 62.61, 62.62, 62.63, 62.66, 62.68, 62.69, 62.71, 62.71, 62.74, 62.76, 62.83, 62.84, 62.88, 62.9, 62.94, 62.96, 62.97, 62.98, 62.99, 63, 63, 63.01, 63.02, 63.04, 63.05, 63.12, 63.17, 63.26, 63.27, 63.28, 63.33, 63.33, 63.34, 63.34, 63.35, 63.35, 63.39, 63.48, 63.55, 63.56, 63.59, 63.63, 63.65, 63.72, 63.72, 63.73, 63.75, 63.76, 63.78, 63.79, 63.82, 63.83, 63.85, 63.85, 63.89, 63.93, 63.93, 63.96, 63.97, 63.99, 64, 64, 64.01, 64.03, 64.03, 64.04, 64.04, 64.05, 64.07, 64.08, 64.09, 64.09, 64.09, 64.09, 64.1, 64.07, 64.05, 64.05, 64.03, 64.03, 64.02, 64.01, 64.01, 64.03, 64.05, 64.06, 64.09, 64.11, 64.13, 64.15, 64.16, 64.19, 64.2, 64.2, 64.23, 64.3, 64.36, 64.37, 64.38, 64.38, 64.4, 64.44, 64.46, 64.48, 64.48, 64.5, 64.5, 64.55, 64.55, 64.57, 64.58, 64.61, 64.63, 64.71, 64.79, 64.81, 64.82, 64.84, 64.85, 64.86, 64.88, 64.91, 64.94, 64.96, 64.97, 64.98, 64.98, 65, 65.05, 65.07, 65.1, 65.12, 65.13, 65.14, 65.17, 65.19, 65.23, 65.25, 65.28, 65.3, 65.34, 65.36, 65.4, 65.43, 65.44, 65.45, 65.48, 65.49, 65.5, 65.51, 65.53, 65.58, 65.59, 65.63, 65.64, 65.66, 65.67, 65.69, 65.72, 65.73, 65.75, 65.79, 65.8, 65.81, 65.86, 65.87, 65.89, 65.9, 65.92, 65.95, 66.02, 66.07, 66.1, 66.13, 66.13, 66.14, 66.14, 66.14, 66.14, 66.14, 66.16, 66.18, 66.24, 66.24, 66.28, 66.32, 66.34, 66.35, 66.38, 66.4, 66.4, 66.43, 66.43, 66.45, 66.46, 66.47, 66.48, 66.5, 66.53, 66.53, 66.57, 66.58, 66.59, 66.61, 66.62, 66.62, 66.65, 66.66, 66.67, 66.68, 66.7, 66.78, 66.78, 66.85, 66.87, 66.88, 66.91, 66.93, 66.96, 66.96, 66.97, 66.98, 66.98, 66.99, 67.01, 67.02, 67.04, 67.04, 67.06, 67.14, 67.15, 67.16, 67.2, 67.2, 67.22, 67.24, 67.25, 67.27, 67.27, 67.28, 67.29, 67.35, 67.37, 67.41, 67.43, 67.45, 67.48, 67.49, 67.51, 67.52, 67.53, 67.53, 67.53, 67.56, 67.57, 67.57, 67.59, 67.6, 67.64, 67.66, 67.67, 67.69, 67.71, 67.73, 67.74, 67.74, 67.76, 67.77, 67.78, 67.79, 67.8, 67.81, 67.83, 67.84, 67.86, 67.87, 67.92, 67.93, 67.94, 67.94, 67.96, 67.96, 67.99, 68, 68.05, 68.05, 68.06, 68.07, 68.08, 68.08, 68.1, 68.11, 68.12, 68.12, 68.12, 68.11, 68.09, 68.08, 68.07, 68.05, 68.05, 68.01, 68.01, 68, 67.97, 67.97, 68.05, 68.06, 68.13, 68.15, 68.18, 68.19, 68.2, 68.22, 68.31, 68.32, 68.34, 68.36, 68.37, 68.41, 68.43, 68.52, 68.54, 68.55, 68.57, 68.58, 68.58, 68.54, 68.53, 68.51, 68.51, 68.52, 68.52, 68.52, 68.51, 68.5, 68.5, 68.5, 68.49, 68.47, 68.44, 68.42, 68.41, 68.38, 68.38, 68.37, 68.36, 68.35, 68.35, 68.39, 68.39, 68.4, 68.41, 68.42, 68.42, 68.44, 68.46, 68.49, 68.5, 68.52, 68.53, 68.55, 68.56, 68.57, 68.59, 68.59, 68.6, 68.61, 68.63, 68.67, 68.68, 68.7, 68.73, 68.74, 68.75, 68.76, 68.77, 68.77, 68.81, 68.85, 68.86, 68.88, 68.89, 68.91, 68.92, 68.92, 68.93, 68.93, 68.97, 69, 69, 69.03, 69.05, 69.06, 69.06, 69.06, 69.06, 69.06, 69.06, 69.05, 69.06, 69.06, 69.06, 69.06, 69.07, 69.11, 69.12, 69.1, 69.1],
		t_norgeLon: [20.78, 20.84, 21.06, 21.07, 21.13, 21.13, 21.07, 21.03, 21.03, 21.03, 21.03, 21.05, 21.11, 21.16, 21.18, 21.22, 21.29, 21.38, 21.65, 21.69, 21.7, 21.83, 21.87, 21.88, 21.89, 21.9, 21.95, 22.08, 22.09, 22.16, 22.17, 22.18, 22.19, 22.2, 22.3, 22.34, 22.34, 22.35, 22.35, 22.36, 22.37, 22.37, 22.38, 22.41, 22.44, 22.49, 22.52, 22.53, 22.57, 22.7, 22.73, 22.8, 23.02, 23.04, 23.06, 23.07, 23.16, 23.17, 23.2, 23.21, 23.22, 23.24, 23.31, 23.32, 23.34, 23.37, 23.39, 23.44, 23.51, 23.55, 23.59, 23.64, 23.64, 23.67, 23.72, 23.75, 23.77, 23.88, 23.93, 23.96, 24, 24.03, 24.05, 24.15, 24.14, 24.15, 24.19, 24.22, 24.24, 24.27, 24.31, 24.47, 24.62, 24.62, 24.67, 24.71, 24.72, 24.73, 24.78, 24.8, 24.79, 24.8, 24.81, 24.83, 24.85, 24.86, 24.87, 24.9, 24.91, 24.91, 24.91, 24.91, 24.91, 24.92, 24.92, 24.92, 24.93, 24.94, 24.95, 24.98, 24.99, 25, 25.01, 25.04, 25.05, 25.06, 25.07, 25.08, 25.08, 25.09, 25.12, 25.13, 25.13, 25.12, 25.13, 25.12, 25.11, 25.11, 25.12, 25.11, 25.12, 25.12, 25.14, 25.14, 25.13, 25.13, 25.13, 25.16, 25.17, 25.18, 25.21, 25.23, 25.24, 25.25, 25.26, 25.27, 25.29, 25.3, 25.31, 25.32, 25.36, 25.38, 25.39, 25.4, 25.41, 25.41, 25.42, 25.43, 25.45, 25.46, 25.47, 25.48, 25.49, 25.51, 25.52, 25.52, 25.53, 25.54, 25.55, 25.57, 25.58, 25.59, 25.61, 25.61, 25.63, 25.64, 25.65, 25.66, 25.68, 25.69, 25.69, 25.7, 25.71, 25.74, 25.76, 25.77, 25.78, 25.79, 25.74, 25.75, 25.76, 25.76, 25.74, 25.73, 25.72, 25.71, 25.72, 25.73, 25.72, 25.72, 25.73, 25.75, 25.74, 25.75, 25.76, 25.75, 25.76, 25.75, 25.76, 25.75, 25.76, 25.78, 25.79, 25.79, 25.81, 25.82, 25.82, 25.84, 25.85, 25.84, 25.83, 25.83, 25.81, 25.82, 25.81, 25.82, 25.83, 25.84, 25.85, 25.87, 25.86, 25.87, 25.89, 25.88, 25.86, 25.88, 25.92, 25.96, 25.97, 25.99, 25.98, 25.97, 25.95, 25.93, 25.92, 25.91, 25.92, 25.94, 25.95, 25.97, 25.99, 26, 26.05, 26.1, 26.13, 26.14, 26.16, 26.17, 26.2, 26.26, 26.26, 26.28, 26.31, 26.37, 26.4, 26.43, 26.43, 26.42, 26.45, 26.47, 26.47, 26.68, 26.69, 26.7, 26.71, 26.72, 26.72, 26.73, 26.74, 26.79, 26.85, 26.86, 26.85, 26.86, 26.86, 26.87, 26.88, 26.91, 26.93, 26.94, 26.96, 26.98, 27, 27.01, 27.02, 27.04, 27.06, 27.1, 27.15, 27.16, 27.17, 27.24, 27.28, 27.29, 27.3, 27.3, 27.29, 27.29, 27.28, 27.29, 27.3, 27.34, 27.36, 27.38, 27.4, 27.45, 27.46, 27.47, 27.53, 27.53, 27.54, 27.54, 27.56, 27.56, 27.57, 27.61, 27.67, 27.71, 27.74, 27.75, 27.76, 27.77, 27.89, 27.91, 27.95, 27.96, 27.98, 27.98, 27.99, 28.01, 28.16, 28.27, 28.3, 28.34, 28.34, 28.35, 28.35, 28.36, 28.42, 28.43, 28.62, 28.63, 29.13, 29.14, 29.14, 29.14, 29.25, 29.27, 29.29, 29.3, 29.32, 29.33, 29.34, 29.32, 29.31, 29.22, 29.2, 29.01, 28.94, 28.83, 28.83, 28.83, 28.83, 28.82, 28.82, 28.81, 28.81, 28.8, 28.82, 28.83, 28.86, 28.93, 28.95, 28.97, 29.01, 29.03, 29.04, 29.04, 29.05, 29.06, 29.08, 29.1, 29.16, 29.19, 29.24, 29.26, 29.28, 29.32, 29.32, 29.33, 29.33, 29.31, 29.31, 29.3, 29.31, 29.31, 29.31, 29.32, 29.35, 29.4, 29.43, 29.45, 29.49, 29.5, 29.55, 29.57, 29.58, 29.62, 29.67, 29.71, 29.72, 29.76, 29.77, 29.79, 29.81, 29.82, 29.84, 29.87, 29.89, 29.92, 29.93, 29.94, 29.95, 29.97, 29.98, 29.99, 30.02, 30.04, 30.05, 30.06, 30.07, 30.09, 30.12, 30.12, 30.13, 30.14, 30.15, 30.14, 30.15, 30.16, 30.18, 30.2, 30.2, 30.19, 30.19, 30.18, 30.16, 30.16, 30.16, 30.16, 30.15, 30.14, 30.11, 30.11, 30.12, 30.13, 30.15, 30.23, 30.3, 30.31, 30.32, 30.37, 30.36, 30.42, 30.51, 30.52, 30.54, 30.62, 30.67, 30.68, 30.72, 30.73, 30.72, 30.75, 30.82, 30.93, 30.94, 30.94, 30.95, 30.95, 30.95, 30.95, 30.94, 30.93, 30.93, 30.94, 30.94, 30.95, 30.95, 30.94, 30.93, 30.91, 30.9, 30.89, 30.88, 30.89, 30.9, 30.84, 30.83, 30.81, 30.8, 30.79, 30.77, 30.76, 30.72, 30.71, 30.69, 30.79, 30.83, 30.82, 31.11, 31.2, 31.51, 31.52, 31.52, 31.59, 31.64, 31.75, 31.76, 31.76, 31.75, 31.71, 31.66, 31.57, 31.22, 31.14, 30.61, 30.45, 30.05, 30.03, 29.57, 29.16, 28.47, 28.34, 27.98, 27.77, 27.06, 26.68, 25.96, 25.6, 24.92, 24.63, 24.34, 23.99, 23.77, 23.67, 23.25, 22.85, 22.3, 22.24, 21.91, 21.7, 21.17, 20.48, 19.88, 19.38, 18.82, 18.29, 18.18, 17.8, 17.61, 17.44, 17.16, 17.05, 16.9, 16.81, 16.57, 16.25, 15.79, 15.75, 15.29, 15.15, 15.02, 14.79, 14.78, 14.62, 14.37, 14.34, 14.19, 13.95, 13.84, 13.74, 13.7, 13.49, 13.39, 13.26, 13.23, 13.01, 13, 12.8, 12.67, 12.59, 12.47, 12.42, 12.39, 12.28, 12.16, 12.13, 11.99, 11.71, 11.7, 11.48, 11.41, 11.36, 11.31, 11.3, 11.31, 11.35, 11.66, 11.86, 11.63, 11.57, 11.3, 11.08, 10.95, 10.8, 10.67, 10.64, 10.61, 10.58, 10.45, 10.36, 10.15, 10.08, 10, 9.8, 9.7, 9.32, 8.94, 8.62, 8.36, 8.11, 7.65, 7.53, 7.36, 7.11, 6.97, 6.92, 6.86, 6.84, 6.8, 6.62, 6.6, 6.5, 6.34, 6.13, 6.06, 5.98, 5.89, 5.64, 5.51, 5.34, 5.25, 4.94, 4.89, 4.81, 4.68, 4.58, 4.55, 4.44, 4.28, 4.22, 4.17, 4.15, 4.13, 4.13, 4.13, 4.11, 4.1, 4.09, 4.09, 4.09, 4.18, 4.19, 4.24, 4.26, 4.33, 4.36, 4.4, 4.42, 4.43, 4.47, 4.51, 4.52, 4.55, 4.55, 4.56, 4.6, 4.62, 4.64, 4.65, 4.66, 4.67, 4.67, 4.61, 4.6, 4.57, 4.53, 4.48, 4.46, 4.45, 4.47, 4.5, 4.55, 4.6, 4.72, 4.8, 4.89, 4.96, 5.01, 5.05, 5.07, 5.08, 5.14, 5.16, 5.18, 5.22, 5.25, 5.28, 5.34, 5.4, 5.47, 5.52, 5.61, 5.87, 6.04, 6.07, 6.08, 6.15, 6.16, 6.27, 6.39, 6.48, 6.49, 6.77, 6.93, 7.1, 7.16, 7.26, 7.47, 7.59, 7.69, 7.77, 7.84, 7.88, 8.01, 8.09, 8.3, 8.37, 8.46, 8.54, 8.63, 8.68, 8.75, 8.85, 8.9, 8.94, 9.07, 9.3, 9.36, 9.37, 9.53, 9.67, 9.79, 9.97, 9.99, 10.01, 10.06, 10.15, 10.29, 10.36, 10.58, 10.59, 10.64, 10.92, 10.98, 11.07, 11.09, 11.12, 11.15, 11.21, 11.24, 11.26, 11.28, 11.3, 11.31, 11.32, 11.33, 11.34, 11.35, 11.36, 11.37, 11.38, 11.39, 11.39, 11.39, 11.4, 11.41, 11.42, 11.42, 11.43, 11.44, 11.46, 11.45, 11.46, 11.46, 11.46, 11.46, 11.46, 11.45, 11.45, 11.46, 11.47, 11.48, 11.49, 11.5, 11.51, 11.52, 11.53, 11.54, 11.55, 11.56, 11.55, 11.56, 11.57, 11.57, 11.58, 11.58, 11.59, 11.61, 11.62, 11.62, 11.63, 11.64, 11.65, 11.66, 11.66, 11.66, 11.67, 11.67, 11.68, 11.69, 11.69, 11.7, 11.7, 11.71, 11.71, 11.72, 11.72, 11.73, 11.74, 11.75, 11.76, 11.76, 11.78, 11.79, 11.79, 11.78, 11.77, 11.78, 11.79, 11.79, 11.79, 11.79, 11.79, 11.79, 11.8, 11.8, 11.8, 11.8, 11.81, 11.82, 11.83, 11.84, 11.84, 11.84, 11.83, 11.83, 11.84, 11.83, 11.83, 11.83, 11.82, 11.82, 11.8, 11.79, 11.79, 11.78, 11.77, 11.77, 11.77, 11.77, 11.77, 11.76, 11.75, 11.74, 11.72, 11.72, 11.71, 11.71, 11.7, 11.7, 11.71, 11.71, 11.72, 11.72, 11.73, 11.74, 11.75, 11.76, 11.77, 11.79, 11.82, 11.83, 11.84, 11.86, 11.87, 11.88, 11.88, 11.89, 11.9, 11.91, 11.92, 11.93, 11.94, 11.95, 11.95, 11.94, 11.94, 11.94, 11.94, 11.95, 11.95, 11.94, 11.95, 11.94, 11.94, 11.9, 11.9, 11.88, 11.87, 11.86, 11.85, 11.86, 11.87, 11.89, 11.89, 11.91, 11.92, 11.92, 11.93, 11.94, 11.98, 11.99, 12.02, 12.03, 12.04, 12.05, 12.07, 12.08, 12.11, 12.13, 12.15, 12.16, 12.17, 12.18, 12.19, 12.2, 12.21, 12.22, 12.24, 12.25, 12.26, 12.28, 12.31, 12.32, 12.34, 12.35, 12.36, 12.37, 12.38, 12.38, 12.39, 12.41, 12.43, 12.44, 12.45, 12.46, 12.47, 12.48, 12.5, 12.52, 12.52, 12.53, 12.53, 12.54, 12.53, 12.52, 12.52, 12.52, 12.52, 12.51, 12.5, 12.5, 12.5, 12.5, 12.52, 12.54, 12.55, 12.56, 12.57, 12.58, 12.58, 12.59, 12.6, 12.6, 12.61, 12.62, 12.62, 12.62, 12.62, 12.61, 12.61, 12.6, 12.59, 12.57, 12.55, 12.53, 12.53, 12.52, 12.52, 12.52, 12.52, 12.52, 12.51, 12.5, 12.48, 12.46, 12.43, 12.41, 12.4, 12.37, 12.35, 12.35, 12.34, 12.34, 12.34, 12.34, 12.33, 12.33, 12.33, 12.32, 12.31, 12.29, 12.28, 12.26, 12.26, 12.25, 12.23, 12.32, 12.37, 12.38, 12.4, 12.41, 12.44, 12.45, 12.47, 12.49, 12.54, 12.6, 12.61, 12.64, 12.65, 12.66, 12.67, 12.67, 12.68, 12.69, 12.69, 12.7, 12.7, 12.71, 12.71, 12.71, 12.71, 12.79, 12.81, 12.83, 12.84, 12.84, 12.85, 12.85, 12.86, 12.88, 12.86, 12.84, 12.82, 12.79, 12.78, 12.71, 12.64, 12.6, 12.58, 12.55, 12.52, 12.49, 12.47, 12.47, 12.46, 12.43, 12.39, 12.39, 12.36, 12.34, 12.33, 12.3, 12.2, 12.18, 12.14, 12.14, 12.15, 12.15, 12.16, 12.17, 12.17, 12.18, 12.18, 12.19, 12.19, 12.19, 12.22, 12.27, 12.28, 12.28, 12.29, 12.29, 12.3, 12.31, 12.32, 12.32, 12.31, 12.23, 12.22, 12.22, 12.21, 12.17, 12.13, 12.08, 12.07, 12.06, 12.06, 12.07, 12.09, 12.1, 12.1, 12.11, 12.12, 12.13, 12.14, 12.11, 12.11, 12.09, 12.08, 12.13, 12.18, 12.18, 12.2, 12.21, 12.22, 12.23, 12.22, 12.22, 12.2, 12.19, 12.13, 12.08, 12, 11.98, 12, 12.05, 12.06, 12.06, 12.07, 12.08, 12.07, 12.12, 12.22, 12.18, 12.18, 12.15, 12.24, 12.27, 12.34, 12.35, 12.35, 12.38, 12.4, 12.42, 12.44, 12.48, 12.5, 12.52, 12.51, 12.57, 12.62, 12.63, 12.66, 12.69, 12.74, 12.75, 12.76, 12.77, 12.84, 12.86, 12.88, 12.89, 12.92, 13.04, 13.09, 13.15, 13.16, 13.17, 13.2, 13.2, 13.5, 13.65, 13.66, 13.81, 13.83, 13.92, 13.92, 13.97, 13.99, 14.01, 14.03, 14.06, 14.07, 14.1, 14.11, 14.13, 14.16, 14.16, 14.14, 14.13, 14.13, 14.12, 14.12, 14.12, 14.13, 14.13, 14.12, 14.12, 14.09, 14.06, 13.95, 13.92, 13.78, 13.76, 13.7, 13.66, 13.69, 13.7, 13.8, 13.9, 13.92, 13.93, 13.96, 13.98, 13.99, 14.01, 14.06, 14.09, 14.11, 14.13, 14.14, 14.15, 14.17, 14.26, 14.28, 14.32, 14.35, 14.35, 14.36, 14.37, 14.37, 14.39, 14.4, 14.46, 14.52, 14.52, 14.51, 14.51, 14.51, 14.51, 14.51, 14.51, 14.51, 14.51, 14.51, 14.52, 14.52, 14.53, 14.53, 14.53, 14.54, 14.54, 14.54, 14.57, 14.58, 14.59, 14.62, 14.62, 14.63, 14.61, 14.6, 14.6, 14.59, 14.59, 14.58, 14.56, 14.54, 14.53, 14.52, 14.65, 14.83, 14.85, 14.95, 15, 15.03, 15.08, 15.14, 15.36, 15.37, 15.5, 15.49, 15.48, 15.47, 15.45, 15.44, 15.43, 15.42, 15.41, 15.4, 15.4, 15.39, 15.38, 15.42, 15.49, 15.5, 15.59, 15.61, 15.63, 15.65, 15.66, 15.67, 15.71, 15.72, 15.73, 15.75, 15.78, 15.88, 15.89, 15.98, 16.01, 16.02, 16.06, 16.11, 16.16, 16.17, 16.2, 16.23, 16.24, 16.26, 16.3, 16.32, 16.41, 16.4, 16.4, 16.41, 16.41, 16.41, 16.42, 16.41, 16.4, 16.36, 16.35, 16.33, 16.32, 16.31, 16.3, 16.22, 16.19, 16.14, 16.11, 16.12, 16.15, 16.15, 16.17, 16.17, 16.38, 16.4, 16.43, 16.46, 16.47, 16.49, 16.5, 16.52, 16.56, 16.58, 16.59, 16.61, 16.61, 16.62, 16.63, 16.64, 16.65, 16.65, 16.66, 16.66, 16.67, 16.68, 16.69, 16.7, 16.71, 16.72, 16.75, 16.77, 16.81, 16.85, 16.92, 16.93, 16.99, 17.03, 17.15, 17.16, 17.17, 17.19, 17.21, 17.22, 17.25, 17.27, 17.28, 17.29, 17.3, 17.33, 17.41, 17.48, 17.52, 17.63, 17.64, 17.76, 17.78, 17.82, 17.9, 17.91, 17.99, 18.01, 18.08, 18.09, 18.13, 18.15, 18.16, 18.16, 18.14, 18.13, 18.13, 18.13, 18.12, 18.11, 18.11, 18.13, 18.13, 18.21, 18.33, 18.38, 18.42, 18.52, 18.56, 18.62, 18.68, 18.95, 18.98, 18.99, 19.04, 19.08, 19.09, 19.1, 19.14, 19.29, 19.44, 19.54, 19.59, 19.76, 19.78, 19.82, 19.92, 19.96, 19.97, 20, 20.02, 20.05, 20.08, 20.09, 20.12, 20.17, 20.22, 20.27, 20.21, 20.1, 20.08, 20.01, 19.98, 20.01, 20.06, 20.07, 20.09, 20.11, 20.14, 20.21, 20.22, 20.23, 20.26, 20.27, 20.28, 20.29, 20.3, 20.31, 20.35, 20.35, 20.35, 20.34, 20.35, 20.35, 20.35, 20.34, 20.34, 20.33, 20.25, 20.2, 20.18, 20.13, 20.09, 20.07, 20.08, 20.11, 20.29, 20.31, 20.4, 20.41, 20.44, 20.47, 20.55, 20.56, 20.59, 20.69, 20.72, 20.77, 20.78]
        },



});


Wu.CartodbLayer = Wu.Model.Layer.extend({});

Wu.ErrorLayer = Wu.Model.Layer.extend({})


// shorthand for creating all kinds of layers
Wu.createLayer = function (layer) {
	if (!layer.data) {
		console.error('no layer - weird:', layer);
		return new Wu.ErrorLayer();
	}
	// postgis
	if (layer.data.postgis && layer.data.postgis.file_id) {
		return new Wu.PostGISLayer(layer);
	}
	// mapbox
	if (layer.data.mapbox) return new Wu.MapboxLayer(layer);

	// systemapic vector tiles todo: store not as geojson, but as vector tiles in project db model?
	if (layer.data.geojson) return new Wu.CartoCSSLayer(layer);
	
	// osm
	if (layer.data.osm) return new Wu.OSMLayer(layer);

	// topojson
	if (layer.data.topojson) return new Wu.TopojsonLayer(layer);

	// raster
	if (layer.data.raster) return new Wu.RasterLayer(layer);

	// raster
	if (layer.data.norkart) return new Wu.NorkartLayer(layer);

	// raster
	if (layer.data.google) return new Wu.GoogleLayer(layer);

	return new Wu.ErrorLayer();
}







// update options and redraw
L.TileLayer.include({
	setOptions : function (options) {
		L.setOptions(this, options);
		this.redraw();
	}
});

L.UtfGrid.include({
	setOptions : function (options) {
		L.setOptions(this, options);
		this.redraw();
	}
});




Wu.Model.File = Wu.Model.extend({

// Wu.Files = Wu.Class.extend({

	_ : 'file',

	_initialize : function (store) {

		// set store
		this.store = store;
	},

	getStore : function () {
		return this.store;
	},

	// getters
	getName : function () {
		return this.store.name;
	},
	getTitle : function () {
		return this.getName();
	},

	getType : function () {
		return this.store.type;
	},

	getUuid : function () {
		return this.store.uuid;
	},

	getLastUpdated : function () {
		return this.store.lastUpdated;
	},

	getKeywords : function () {
		return this.store.keywords;
	},

	getFormat : function () {
		return this.store.format;
	},

	getFileList : function () {
		return this.store.files;
	},

	getDatasize : function () {
		return this.store.dataSize;
	},

	getCreatedByName : function () {
		return this.store.createdByName;
	},

	getCreatedBy : function () {
		return this.store.createdBy;
	},

	getCreated : function () {
		return this.store.created;
	},

	getCategory : function () {
		return this.store.category;
	},

	getStatus : function () {
		return this.store.status;
	},

	getVersion : function () {
		return this.store.version;
	},

	getDescription : function () {
		return this.store.description;
	},

	getLayer : function () {
		var fileUuid = this.getUuid();
		var project = _.find(app.Projects, function (p) {
			return p.files[fileUuid];
		});
		var layer = _.find(project.layers, function (l) {
			return l.getFileUuid() == fileUuid;
		});
		return layer;
	},

	getCopyright : function () {
		return this.store.copyright;
	},

	setCopyright : function (copyright) {
		this.store.copyright = copyright;
		this.save('copyright');
	},

	_addToProject : function (projectUuid) {

		var options = {
			projectUuid : projectUuid, 
			fileUuid : this.getUuid()
		}

		Wu.Util.postcb('/api/file/addtoproject', JSON.stringify(options), function (err, body) {

		});
	},


	// setters
	setName : function (name) {
		this.store.name = name;
		this.save('name');
	},

	setKeywords : function (keywords) {
		this.store.keywords = keywords; // todo: must be array
		this.save('keywords');
	},

	setTag : function () {
		// this.store.keywords.push(newTag); 
		this.save('keywords');
	},

	setFormat : function (format) {
		this.store.format = format;
		this.save('format');
	},

	setCategory : function (category) {
		this.store.category = category; // should be string
		this.save('category');
	},

	setStatus : function (status) {
		this.store.status = status;
		this.save('status');
	},

	setVersion : function (version) {
		this.store.version = version;
		this.save('version');
	},

	setDescription : function (description) {
		this.store.description = description;
		this.save('description');
	},




	// save field to server
	save : function (field) {

		// set fields
		var json = {};
		json[field] = this.store[field];
		json.uuid = this.store.uuid;

		// save to server
		var string = JSON.stringify(json);
		this._save(string);

	},

	// save json to server
	_save : function (string) {
		// TODO: save only if actual changes! saving too much already
		Wu.save('/api/file/update', string); // save to server   

		app.setSaveStatus();// set status
	},


	// todo: move all delete of files here
	_deleteFile : function () {

		// check if dataset has layers
		this._getLayers(function (err, layers) {
			if (err) console.log('err', err);
			
			var num_layers = layers.length;
			var pretty_layers = [];

			if (num_layers) layers.forEach(function (l, n, m) {
				pretty_layers.push('- ' + l.title);
			});

			var has_layers_msg = 'There exists ' + num_layers + ' layers based on this dataset: \n' + pretty_layers.join('\n') + '\n\nDeleting dataset will delete all layers. Are you sure?';
			var just_confirm = 'Do you really want to delete dataset ' + this.getName() + '?';
			var message = num_layers ? has_layers_msg : just_confirm;
			var confirmed = confirm(message);

			if (!confirmed) return console.log('Nothing deleted.');
			
			// delete file
			var postgisOptions = this._getLayerData();
			Wu.post('/api/file/delete', JSON.stringify(postgisOptions), function (err, response) {

				var removedObjects = Wu.parse(response);

				// clean up locally
				this._fileDeleted(removedObjects);


			}.bind(this));

		}.bind(this));

	},


	_fileDeleted : function (result) {

		// catch error
		if (result.error || !result.success) return console.error(result.error || 'No success deleting!');

		// update user locally
		app.Account.removeFile(result.removed.file);

		// update projects locally
		this._removeLayersLocally(result.removed.layers);

		// fire event
		Wu.Mixin.Events.fire('fileDeleted', {detail : {
			fileUuid : 'lol'
		}});
	},


	_removeLayersLocally : function (layers) {

		layers.forEach(function (layer) {

			// find project 
			var project = _.find(app.Projects, function (p) {
				return p.getLayer(layer.uuid);
			});

			// remove layer
			project.removeLayer(layer);
		});

		// fire event
		Wu.Mixin.Events.fire('layerDeleted', {detail : {
			fileUuid : 'lol'
		}});
	},

	
	_getLayers : function (callback) {

		// get layers connected to dataset
		var options = this._getLayerData();
		Wu.post('/api/file/getLayers', JSON.stringify(options), function (err, response) {
			var layers = Wu.parse(response);
			callback(err, layers);
		});
	},

	getPostGISData : function () {
		if (!this.store.data) return false;
		return this.store.data.postgis;
	},

	_getLayerData : function () {
		if (!this.store.data) return false;
		if (this.store.data.postgis) {
			var options = {
				data : this.store.data.postgis, 
				type : 'postgis'
			}
			return options;
		}
		if (this.store.data.raster) {
			var options = {
				data : this.store.data.raster, 
				type : 'raster'
			}
			return options;
		}
		return false;
	},

	_shareFile : function () {
	},

	_createLayer : function (project) {
		this._createDefaultLayer(project);
	},

	_downloadFile : function () {
		this._downloadDataset();
	}, 

	_downloadDataset : function () {

		var options = {
			file_id : this.getUuid(),
			socket_notification : true
		}

		// set download id for feedback
		this._downloadingID = Wu.Util.createRandom(5);

		// post download request to server
		Wu.post('/api/file/downloadDataset', JSON.stringify(options), function (err, response) {

			// give feedback
			app.feedback.setMessage({
				title : 'Preparing download',
				description : 'Hold tight! Your download will be ready in a minute.',
				id : this._downloadingID
			});	

		}.bind(this));

	},

	_onDownloadReady : function (e) {
		var options = e.detail,
		    file_id = options.file_id,
		    finished = options.finished,
		    filepath = options.filepath;

		// parse results
		var path = app.options.servers.portal;
		path += 'api/file/download/';
		path += '?file=' + filepath;
		path += '&type=shp';
		path += '&access_token=' + app.tokens.access_token;

		// open (note: some browsers will block pop-ups. todo: test browsers!)
		window.open(path, 'mywindow')

		// remove feedback
		app.feedback.remove(this._downloadingID);
	},

	_getGeometryType : function () {
		var meta = this.getMeta();
		return meta.geometry_type;
	},

	_getDefaultStyling : function () {

		// get geom type
		var geometry_type = this._getGeometryType();

		// get style
		var style = this._defaultStyling;

		// enable style by geom type
		if (geometry_type == 'ST_Point') { 
			style.point.enabled = true;
		}
		if (geometry_type == 'ST_MultiPolygon') { 
			style.polygon.enabled = true;
		}
		if (geometry_type == 'ST_LineString') { 
			style.line.enabled = true;
		}

		return style;
	},

	_createDefaultCartocss : function (json, callback) {
		var styler = app.Tools.Styler;
		styler.createCarto(json, callback);
	},


	// default cartocss styling
	_defaultStyling : {
		
		// default styling
		point : { 
			enabled : false, 
			color : { 
				column : false, 
				range : [-426.6, 105.9], 
				// customMinMax : [-426.6, 105.9], 
				staticVal : "yellow",
				value : ["#ff0000", "#ffff00", "#00ff00", "#00ffff", "#0000ff"]
			},
			opacity : { 
				column : false,
				range : [-426.6, 105.9],
				value : 0.5
			}, 
			pointsize : { 
				column :false,
				range : [0, 10],
				value : 1
			}
		},

		polygon : { 
			enabled : false, 
			color : { 
				column : false, 
				range : [-426.6, 105.9], 
				staticVal : "red",
				value : ["#ff0000", "#ffff00", "#00ff00", "#00ffff", "#0000ff"]
			},
			opacity : { 
				column : false,
				range : [-426.6, 105.9],
				value : 0.5
			}, 
			line : {
				width : { 
					column :false,
					range : false,
					value : 1
				},
				opacity : {
					column : false,
					range : [-426.6, 105.9],
					value : 0.5
				},
				color : {
					column : false, 
					range : [-426.6, 105.9], 
					staticVal : "green",
					value : ["#ff0000", "#ffff00", "#00ff00", "#00ffff", "#0000ff"]
				}
			}
		},

		line : {
			enabled : false,
			width : { 
				column :false,
				range : false,
				value : 1
			},
			opacity : {
				column : false,
				value : 0.5
			},
			color : {
				column : false, 
				range : [-426.6, 105.9], 
				staticVal : "green",
				value : ["#ff0000", "#ffff00", "#00ff00", "#00ffff", "#0000ff"]
			}
		}
	},

	_getType : function () {
		if (this.store.data && this.store.data.postgis) return 'vector';
		if (this.store.data && this.store.data.raster) return 'raster';
		return false;
	},

	_createDefaultLayer : function (project) {

		var type = this._getType();

		if (type == 'vector') {
			this._createDefaultVectorLayer(project);
		}

		if (type == 'raster') {
			this._createDefaultRasterLayer(project);
		}
	},

	_createDefaultRasterLayer : function (project) {
		
		var options = {
			file : this,
			project : project,
		}

		// create layer on server
		this._requestDefaultRasterLayer(options)

	},

	_requestDefaultRasterLayer : function (options) {

		var file = options.file,
		    file_id = file.getUuid(),
		    project = options.project;


		var layerJSON = {
			"geom_column": "the_geom_3857",
			"geom_type": "geometry",
			"raster_band": "",
			"srid": "",
			"affected_tables": "",
			"interactivity": "",
			"attributes": "",
			"access_token": app.tokens.access_token,
			"cartocss_version": "2.0.1",
			// "cartocss": defaultCartocss, 	// save default cartocss style (will be active on first render)
			// "sql": "(SELECT * FROM " + file_id + ") as sub",
			"file_id": file_id,
			"return_model" : true,
			"projectUuid" : project.getUuid()
		}

		// create postgis layer
		Wu.post('/api/db/createLayer', JSON.stringify(layerJSON), function (err, layerJSON) {
			var layer = Wu.parse(layerJSON);

			var options = {
				projectUuid : project.getUuid(), // pass to automatically attach to project
				data : {
					raster : layer.layerUuid
				},
				metadata : layer.options.metadata, 	// TODO
				title : file.getName(),
				description : 'Description: Layer created from ' + file.getName(),
				file : file.getUuid(),
				// style : JSON.stringify(defaultStyle) // save default json style
			}

			// create new layer model
			this._createLayerModel(options, function (err, layerModel) {

				// refresh Sidepane Options
				project.addLayer(layerModel);

				// todo: set layer icon
				app.feedback.setMessage({
					title : 'Added layer',
					// description : 'Added <strong>' + layerModel.title + '</strong> to project.',
				});	

				// select project
				Wu.Mixin.Events.fire('layerAdded', { detail : {
					projectUuid : project.getUuid(),
					layerUuid : layerModel.uuid
				}});
			});
			
		}.bind(this));
	},

	_createDefaultVectorLayer : function (project) {
		
		var file_id = this.getUuid();
		var file = this;

		// get default style
		var defaultStyle = this._getDefaultStyling();
		
		// create css from json (server side)
		this._createDefaultCartocss(defaultStyle, function (ctx, defaultCartocss) {

			var options = {
				file : file,
				defaultCartocss : defaultCartocss,
				project : project,
				defaultStyle : defaultStyle
			}

			// create layer on server
			this._requestDefaultVectorLayer(options)


		}.bind(this));
	},

	_requestDefaultVectorLayer : function (options) {

		var file = options.file,
		    file_id = file.getUuid(),
		    project = options.project,
		    defaultCartocss = options.defaultCartocss,
		    defaultStyle = options.defaultStyle;


		var layerJSON = {
			"geom_column": "the_geom_3857",
			"geom_type": "geometry",
			"raster_band": "",
			"srid": "",
			"affected_tables": "",
			"interactivity": "",
			"attributes": "",
			"access_token": app.tokens.access_token,
			"cartocss_version": "2.0.1",
			"cartocss": defaultCartocss, 	// save default cartocss style (will be active on first render)
			"sql": "(SELECT * FROM " + file_id + ") as sub",
			"file_id": file_id,
			"return_model" : true,
			"projectUuid" : project.getUuid()
		}

		// create postgis layer
		Wu.post('/api/db/createLayer', JSON.stringify(layerJSON), function (err, layerJSON) {
			var layer = Wu.parse(layerJSON);

			var options = {
				projectUuid : project.getUuid(), // pass to automatically attach to project
				data : {
					postgis : layer.options
				},
				metadata : layer.options.metadata,
				title : file.getName(),
				description : 'Description: Layer created from ' + file.getName(),
				file : file.getUuid(),
				style : JSON.stringify(defaultStyle) // save default json style
			}

			// create new layer model
			this._createLayerModel(options, function (err, layerModel) {

				// refresh Sidepane Options
				project.addLayer(layerModel);

				// todo: set layer icon
				app.feedback.setMessage({
					title : 'Added layer',
					// description : 'Added <strong>' + layerModel.title + '</strong> to project.',
				});	

				// select project
				Wu.Mixin.Events.fire('layerAdded', {detail : {
					projectUuid : project.getUuid(),
					layerUuid : layerModel.uuid
				}});
			});
			
		}.bind(this));

	},

	_createLayerModel : function (options, done) {
		Wu.Util.postcb('/api/layers/new', JSON.stringify(options), function (err, body) {
			var layerModel = Wu.parse(body);
			done(null, layerModel);
		}.bind(this));
	},

	getMeta : function () {
		if (!this.store.data.postgis) return false;
		if (!this.store.data.postgis.metadata) return false;
		var meta = Wu.parse(this.store.data.postgis.metadata);
		return meta;
	},

	getRasterMeta : function () {
		if (!this.store.data.raster) return false;
		if (!this.store.data.raster.metadata) return false;
		var meta = Wu.parse(this.store.data.raster.metadata);
		return meta;
	},

	getHistograms : function () {
		var meta = this.getMeta();
		if (!meta) return false;
		var histogram = meta.histogram;
		return histogram;
	},

	getHistogram : function (column) {
		var h = this.getHistograms();
		if (!h) return false;
		return h[column];
	},






});
Wu.Role = Wu.Class.extend({

	initialize : function (options) {
		// set
		this.store = options.role;
		this._project = options.project;
	},

	addMember : function (user, callback) {
		var options = {
			user : user,
			project : this._project,
			role : this
		}

		app.access.addRoleMember(options, callback);
	},

	noRole : function () {
		return this.store.slug == 'noRole';
	},

	getName : function () {
		return this.store.name;
	},

	getMembers : function () {
		return this.store.members;
	},

	getCapabilities : function () {
		return this.store.capabilities;
	},

	getUuid : function () {
		return this.store.uuid;
	},

	getSlug : function () {
		return this.store.slug;
	},

	hasMember : function (member) {
		var has = _.contains(this.getMembers(), member.getUuid());
		if (has) {
			return true;
		} else {
			return false;
		}
	},

	isMember : function (member) {
		return _.contains(this.getMembers(), member.getUuid());
	},

	hasCapability : function (cap) {
		var caps = this.getCapabilities();
		if (!caps) return false;
		return this.getCapabilities()[cap];
	},

});



Wu.Role.Super = Wu.Role.extend({

	addMember : function (user, callback) {
		
		var options = {
			userUuid : user.getUuid(),
			roleUuid : this.getUuid()
		}

		// send
		Wu.send('/api/access/super/setrolemember', options, function (err, json) {
			callback(err, json);
		});

	},

});


Wu.Role.Portal = Wu.Role.extend({

	addMember : function (user, callback) {

		var options = {
			userUuid : user.getUuid(),
			roleUuid : this.getUuid()
		}
		
		// send
		Wu.send('/api/access/portal/setrolemember', options, function (err, json) {
			callback(err, json);
		});

	},

});
Wu.List = Wu.Class.extend({
	
	canEdit : false,
	folder  : 'Folder',

	initialize : function (options) {


		// searchField has not been implemented yet
		this.searchField = options.searchfield;
	
		// Define the D3 container
		this.D3container = d3.select(options.container);

		// Get list options
		this.listOptions = this.getListOptions();

		if (this.listOptions.button) {
			
			// Select all button
			this.selectAllButton = Wu.DomUtil.create('div', 'item-select-button select-all-button', this.D3container[0][0]);
		}

		// set hooks
		this.setHooks('on');
	},

	setHooks : function (on) {
		
		Wu.DomEvent[on](this.searchField, 'keyup', this.searchList, this);
		
		if (this.listOptions.button)  {
			Wu.DomEvent[on](this.selectAllButton, 'mousedown', this.selectAllClick, this);
		}

	},

	createFolder : function() {

		// console.log('this.listData', this.listData);

		// var newFolder = {

		// 	'fileUuid' : {

		// 		store : {

		// 			access : {
		// 				clients : [],
		// 				projects : [],
		// 				users : []
		// 			},
		// 			category : '',
		// 			created : '',
		// 			createdBy : '',
		// 			createdByName : '',
		// 			data : {
		// 				geojson : '',
		// 				image : {
		// 					crunched : []
		// 				},
		// 				other : [],
		// 				shapefile : [],						
		// 			},
		// 			description : '',
		// 			files : [],
		// 			format : [],
		// 			keywords : [],
		// 			lastUpdated : '',
		// 			name : '',
		// 			type : '',
		// 			uuid : ''

		// 		}

		// 	}

		// }

	},

	openItemInfo : function (DATA) {

	},

	// These are run on the children below
	refresh : function (DATA) {},

	// These are run on the children below
	save : function (saveJSON) {},

	stop : function (e) {
		Wu.DomEvent.stopPropagation(e);
	},	



	// ██╗   ██╗████████╗██╗██╗     ███████╗
	// ██║   ██║╚══██╔══╝██║██║     ██╔════╝
	// ██║   ██║   ██║   ██║██║     ███████╗
	// ██║   ██║   ██║   ██║██║     ╚════██║
	// ╚██████╔╝   ██║   ██║███████╗███████║
	//  ╚═════╝    ╚═╝   ╚═╝╚══════╝╚══════╝



	// ┌─┐┌─┐┬─┐┌┬┐┬┌┐┌┌─┐
	// └─┐│ │├┬┘ │ │││││ ┬
	// └─┘└─┘┴└─ ┴ ┴┘└┘└─┘	

	// TRIGGERS ON CLICK:
	// SORTS LIST ON FIELDS
	// RUNS ASC IF DESC

	sortBy : function (e, that) {

		var sortThis = e.name;

		if ( !this.sortDirection ) this.sortDirection = {};

		if ( this.sortDirection[sortThis] == false ) {
			var direction = 'desc';
			this.sortDirection[sortThis] = true;
		} else {
			var direction = 'asc';
			this.sortDirection[sortThis] = false;
		}


		var objDATA     = this.listData;
		var DATA        = this.sortedData ? this.sortedData : that.data2array(objDATA);

		this.sortedData = that.sortData(DATA, { field : sortThis, direction : direction });

		this.refreshTable();

	},


	updateTable : function (options) {  



		var that = options.context;

		// RESET TABLE!
		if ( options.reset ) {

			// List data
			that.listData = options.listData;

			// Clear sorted data
			that.sortedData = null;

			// Clear selected list items
			if ( that.listOptions.button.arr ) that.listOptions.button.arr = [];

			// Set edit mode
			if ( options.canEdit ) {
				that.canEdit = options.canEdit; 
				that.D3container.classed('canEdit', true) 
			} else {
				that.D3container.classed('canEdit', false) 
			}

			that.refreshTable(that);

		}		


		// DELETING FILES
		if ( options.remove ) that.removeItems(options.remove);

		// UPLOADED FILES
		if ( options.add ) that.addItems(options.add);

		// IF WE'RE CHANGING TABLE SIZE
		if ( options.tableSize ) {
			that.tableSize = options.tableSize;
			that.refreshTable(that);
		}


	},



	// REFRESH LIST WITH DATA FILE LIST FROM DOM		

	refreshTable : function (context) {



		var that = context ? context : this;

		if ( that.sortedData ) {

			var DATA = that.sortedData;

		} else {

			// Put data into an array that D3 likes
			var objDATA = that.listData;
			var DATA    = that.data2array(objDATA);

		}

		that.refresh(DATA);
	
	},	


	// RETURNS ARRAY OF DATA SORTED IN ASC OR DESC BY FIELD 

	sortData : function (data, options) {


		var field 	= options.field;
		var direction   = options.direction;

		// Alphabetical
		if ( direction == 'asc' ) {

			data.sort(function(a, b) {

				// Sorting DATE
				if ( field == 'createdDate' ) {
					return new Date(a.file.store.created).getTime() - new Date(b.file.store.created).getTime();
				}
				
				// Put empty fields on the bottom
				if ( !a.file.store[field] || a.file.store[field] == '' || a.file.store[field] == ' ' ) return 1;
				if ( !b.file.store[field] || b.file.store[field] == '' || b.file.store[field] == ' ' ) return -1;

				// Sorting LETTERS
				if ( a.file.store[field] < b.file.store[field] ) return -1;
				if ( a.file.store[field] > b.file.store[field] ) return 1;
				
				return 0;

			})

		}

		if ( direction == 'desc' ) {

			data.sort(function(a, b) {

				// Sorting DATE
				if ( field == 'createdDate' ) {
					return new Date(b.file.store.created).getTime() - new Date(a.file.store.created).getTime();
				}		

				// Put empty fields on the bottom
				if ( !a.file.store[field] || a.file.store[field] == '' || a.file.store[field] == ' ' ) return 1;
				if ( !b.file.store[field] || b.file.store[field] == '' || b.file.store[field] == ' ' ) return -1;				

				// Sorting LETTERS
				if ( a.file.store[field] > b.file.store[field] ) return -1;
				if ( a.file.store[field] < b.file.store[field] ) return 1;

				return 0;

			})
			
		}		


		return data;

	},



	// ┌─┐┌─┐┌─┐┬─┐┌─┐┬ ┬┬┌┐┌┌─┐
	// └─┐├┤ ├─┤├┬┘│  ├─┤│││││ ┬
	// └─┘└─┘┴ ┴┴└─└─┘┴ ┴┴┘└┘└─┘


	searchList : function (e) {

		if (e.keyCode == 27) { // esc
			// reset search
			return this.resetSearch();
		}

		// get value and search
		var value = this.searchField.value;
		this.listSearch(value);

	},


	resetSearch : function () {

		this.searchField.value = '';

	},


	// SEARCH THROGH FIELDS IN FILE LIST

	listSearch : function (searchword) {

		var that = this;
		var searchResults = [];

		// Get list of all entries
		var objDATA = this.listData;

		// Go through all data
		for (f in objDATA) {

			// Gets all the fields with data to match
			var searchHere = this.getSearchObj(f, objDATA);

			// Search word to lower case
			var sw = searchword.toLowerCase();

			searchHere.forEach(function (sf) {

				// Field value to lower case
				var s = sf.value.toLowerCase();

				// Match search word to field value
				var res = s.match(sw);

				// If we've got a hit
				if ( res ) that.buildSearchString(searchResults, sf.location);
			
			})

		};

		var resultData  = this.buildResultData(searchResults);
		this.sortedData = this.data2array(resultData);

		this.unselectItems();
		this.refreshTable();

	},


	// If a selected item disappears when you're searching, also un-select list
	// item (so you don't end up deleting files that's not in your visual field)

	unselectItems : function () {

		if ( !this.listOptions.button ) return;

		var _listData   = this.data2array(this.listData);
		var _sortedData = this.sortedData;
		var _selected   = this.listOptions.button.arr;

		var that = this;

		_listData.forEach(function (allItem) {

			var match = false;
			
			// Find list items that's NOT been filtered OUT (they are on the screen)
			_sortedData.forEach(function (filteredItem) {

				if ( filteredItem.fileUuid == allItem.fileUuid ) match = true;				
			})

			// If file has been filtered OUT (not on the screen)
			if ( !match ) {

				var isSelected = false;

				// We must find out of it's selected...
				_selected.forEach(function (sel) {
					if ( sel == allItem.fileUuid ) isSelected = true;
				})

				if ( isSelected ) {
				
					that.unSelectListItem(allItem.fileUuid, that)
				
				}
				
			}
		})

	},


	// Gets all the fields with data to match
	
	getSearchObj : function (f, objDATA) {

		// Store hits here
		var DATA = [];

		var searchFields = this.listOptions.searchFields;

		// Put all datafields in array for easier searching
		var searchHere = [];
		var dataStore = objDATA[f].store;

		// Get all the data fields
		
		searchFields.forEach(function (sf) {

			if ( dataStore[sf] ) {

				// Check if field is array
				if ( typeof dataStore[sf] == 'object' ) {
					if ( dataStore[sf].length > 0 ) {

						// ARRAY
						var _array = dataStore[sf];

						_array.forEach(function (val) {
							if (val) {
								var type = {
									value    : val,
									location : f
								}
								searchHere.push(type);
							}
						})
					}
				} else {

					var val = dataStore[sf];

					var type = {

						value    : val,
						location : f
					}

					searchHere.push(type);

				}
			}
		})


		return searchHere;

	},	


	// CREATES AN ARRAY WITH FILES UUIDS THAT MATCHES OUR SEARCH CRITERIA

	buildSearchString : function (searchResults, thisResult) {

		var pushing = true;

		searchResults.forEach(function (res) {
			if ( res == thisResult ) pushing = false
		})

		if ( pushing ) searchResults.push(thisResult);

	},


	// MATCHES FILE LIST WITH WITH OUR SEARCH RESULTS, AND CREATES A NEW
	// OBJECT CONTAINING FILES THAT MATCHES OUR SEARCH RESULTS

	buildResultData : function (searchResults) {

		var _DATA = {};

		var objDATA = this.listData;

		for (f in objDATA) {

			searchResults.forEach(function (res) {

				// If there is a match, copy object
				if ( f == res ) _DATA[f] = objDATA[f];
			})
		};

		return _DATA;

	},	



	// ┬┌┐┌┌─┐┬ ┬┌┬┐  ┌─┐┬┌─┐┬  ┌┬┐┌─┐
	// ││││├─┘│ │ │   ├┤ │├┤ │   ││└─┐
	// ┴┘└┘┴  └─┘ ┴   └  ┴└─┘┴─┘─┴┘└─┘	

	// EDIT INPUT FIELDS
	// Currently only used for File Title
	editField : function (options) {

		var outerContext     	= options.outerContext;
		var input       	= outerContext._D3input(options, outerContext.updateAndRefresh);

	},


	// CREATE INPUT FIELD
	_D3input : function (options, blurFunction) {

		// Create input box
		var input 	    = Wu.DomUtil.create('input');
		    input.type 	    = 'text';
		    input.className = 'autocarto-input';
		    input.value     = options.value ? options.value : '';
		
		options.context.innerHTML = '';		

		options.context.appendChild(input);

		// Set input box to focus
		input.focus();

		// Set cursor in the beginning
		input.setSelectionRange(0,0);

		// Blur on enter
		document.addEventListener("keydown", function(e) {
			if ( e.keyCode == 13 ) input.blur();
		})				

		// Fire this when bluring
		input.onblur = function () {
			blurFunction(input, options);
		}
		
		return input;

	},	


	// INPUT FIELD ON BLUR
	updateAndRefresh : function (input, options) {


		// New Name
		var newName  = input.value;

		// Remove input field
		input.remove();

		// Update data object in DOM
		options.where[options.what] = newName;

		var DATA = options.allDATA;
		var that = options.outerContext;

		// Refresh list
		that._D3list(DATA)

		// create update object
		var saveJSON = {};
		var namespace = options.what;

		saveJSON[namespace] = newName;
		saveJSON.uuid 	    = options.uuid;

		// popopopopopopo
		saveJSON.key   	    = namespace;
		saveJSON.value 	    = newName;
		saveJSON.id    	    = options.uuid;


		// Save changes
		that.save(saveJSON);

		// Set app save status
		app.setSaveStatus();
			
	},




	// ┌─┐┌┬┐┬ ┬┌─┐┬─┐  ┌─┐┬ ┬┌┐┌┌─┐┌┬┐┬┌─┐┌┐┌┌─┐
	// │ │ │ ├─┤├┤ ├┬┘  ├┤ │ │││││   │ ││ ││││└─┐
	// └─┘ ┴ ┴ ┴└─┘┴└─  └  └─┘┘└┘└─┘ ┴ ┴└─┘┘└┘└─┘	


	// Select/un select list item

	selectListItem : function (select, context) {

		if ( !context.listOptions.button ) return;

		var removeFile 	  = false;
		var selectedListItems = context.listOptions.button.arr;

		selectedListItems.forEach(function(selectedFile, i) {
			if ( selectedFile == select ) removeFile = i+1; // Add 1 to i in order to avoid 0 (which is same as false)
		});

		if ( removeFile ) {
			selectedListItems.splice(removeFile-1, 1);
		} else {
			selectedListItems.push(select);
		}

		context.refreshTable();

	},

	// Unselect list item

	unSelectListItem : function (select, context) {

		if ( !context.listOptions.button ) return;

		var selectedListItems = context.listOptions.button.arr;

		selectedListItems.forEach(function(selectedFile, i) {
			if ( selectedFile == select ) selectedListItems.splice(i, 1);
		});

	},

	// Converts data format

	dateHTML : function (DATA) {

		var DATE = new Date(DATA.file.store.created);
		var dd = DATE.getDate(); 
		var mm = DATE.getMonth()+1;//January is 0! 
		var yyyy = DATE.getFullYear(); 

		var month;
		if ( mm == 1 )  month = 'Jan';
		if ( mm == 2 )  month = 'Feb';
		if ( mm == 3 )  month = 'Mar';
		if ( mm == 4 )  month = 'Apr';
		if ( mm == 5 )  month = 'May';
		if ( mm == 6 )  month = 'Jun';
		if ( mm == 7 )  month = 'Jul';
		if ( mm == 8 )  month = 'Aug';
		if ( mm == 9 )  month = 'Sep';
		if ( mm == 10 ) month = 'Oct';
		if ( mm == 11 ) month = 'Nov';
		if ( mm == 12 ) month = 'Dec';

		var isDate = month + ' ' + dd + ' ' + yyyy;
		return isDate;

	},

	// CONVERTS LIST OF DATA (FILE LIST) INTO AN ARRAY THAT D3 LIKES

	data2array : function (data) {

		var DATA = [];

		for (f in data) {
			var file = {
				fileUuid : f,
				file     : data[f]
			}
			DATA.push(file);
		};

		return DATA;
	
	},



	// ████████╗██╗  ██╗███████╗    ██╗     ██╗███████╗████████╗
	// ╚══██╔══╝██║  ██║██╔════╝    ██║     ██║██╔════╝╚══██╔══╝
	//    ██║   ███████║█████╗      ██║     ██║███████╗   ██║   
	//    ██║   ██╔══██║██╔══╝      ██║     ██║╚════██║   ██║   
	//    ██║   ██║  ██║███████╗    ███████╗██║███████║   ██║   
	//    ╚═╝   ╚═╝  ╚═╝╚══════╝    ╚══════╝╚═╝╚══════╝   ╚═╝   



	// INIT

	_D3list : function (DATA) {
	


		// Context
		var that = this;

		// Create header
		this._D3header();

		// Create wrapper
		this.listOptions.wrapper = this.listItemWrapper(DATA);

		// Create select button
		this.selectButton();
		
		// Folder
		this.listFolder(DATA);

		// Title and description
		this.listTitle(DATA);		

		// Attributes
		this.initAttributes(DATA);

		// Open info items
		this.openItemInfo(DATA);
		
	},


	// HEADER

	_D3header : function () {

		var listOptions = this.listOptions;
		var field = this.listOptions.titleSpace.name.field

		var that = this;
		var DATA = listOptions.attributes;


		// CLEAN UP – ONLY SHOW FIELDS THAT WE WANT!!!
		var _DATA = []
		DATA.forEach(function (D) {
			var proceed = true
			listOptions.attributes.forEach(function (lo) {
				if ( D.name == lo.name ) {
					if ( lo.killOnSmall && that.tableSize == 'small' ) {
						proceed = false;
					}
				}
			});
			if ( proceed ) _DATA.push(D);
		})


		var headerWrapper = 
			this.D3container
			.selectAll('.d3-list-header')
			.data([DATA]);
			// .data([_DATA]);

		headerWrapper
			.enter()
			.append('div')
			.classed('d3-list-header', true);

		headerWrapper
			.exit()
			.remove();



		// EACH LINE
		// EACH LINE
		// EACH LINE				

		// bind
		var eachField = 
			headerWrapper
			.selectAll('.d3-list-header-item')
			.data(function(d) {
				return d;
			});

		// enter 
		eachField
			.enter()
			.append('div')
			.attr('class', function(d) {
				return 'd3-list-header-item-' + d.niceName;
			})
			.classed('d3-list-header-item', true);

		// update
		eachField
			.html(function(d) {				
				return d.niceName
			})
			.attr('style', function(d, i) {


				if ( d.killOnSmall && that.tableSize == 'small' ) {
					return 'display: none';
				}

				if ( d.niceName == 'Name' ) {
					
					var width = 100;

					listOptions.attributes.forEach(function(att) {
				
						var exclude = true;

						if ( att.restrict ) {
							if ( that.canEdit ) exclude = false;
						} else {
							exclude = false;
						}

						if ( att.killOnSmall && that.tableSize == 'small' ) {
							exclude = true;
						}

						if ( att.width && !exclude ) {
						
							var _width;
							// Enable different width in collapsed mode
							if ( att.smallWidth && !att.killOnSmall && that.tableSize == 'small' ) {
								_width = att.smallWidth;
							} else {
								_width = att.width;
							}


							width -= _width;
						
						}
				
					})
				

					var style = 'width: ' + width + '%; left: 0%; ';
				
					if ( !that.listOptions.button ) {
						style += 'padding-left: 10px;';
					}

				} else {
			
					var style = that.getAttributeStyle(i);
				}

				return style;
			})
			.on('mousedown', function(e) {
				
				that.sortBy(e, that)

				});

		// exit
		eachField
			.exit()
			.remove();

	},


	// Wrapper for each line

	listItemWrapper : function (DATA) {

		var that = this;
		var isFolder = false;
	
		// BIND DATA TO WRAPPER
		// BIND DATA TO WRAPPER
		// BIND DATA TO WRAPPER

		var wrapper = 
			this.D3container
			.selectAll('.list-line')
			.data(DATA);




		// EACH FILE WRAPPER
		// EACH FILE WRAPPER
		// EACH FILE WRAPPER		


		// ENTER
		wrapper
			.enter()
			.append('div');
		

		// UPDATE
		wrapper
			.attr('class', function(d) {				
				var cName = 'list-line';
				var isSelected = that.checkSelected(d.fileUuid);
				if ( isSelected ) cName += ' selected';

				if ( d.file.isProcessing ) {
					cName += ' processing';
				}

				return cName;
			})
			.attr('style', function(d) {
				var isOpen = that.checkOpenFileInfo(d.fileUuid, that);
				if ( isOpen ) {
					return 'height: 240px; overflow: hidden;';
				}
			});
					
			

		// EXIT
		wrapper
			.exit()
			.remove();	


		return wrapper;

	},



	listFolder : function (DATA) {

		var wrapper = this.listOptions.wrapper;
		var field   = this.listOptions.titleSpace.name.field;

		var that    = this;

		// FILE TITLE & DESCRIPTION WRAPPER
		// FILE TITLE & DESCRIPTION WRAPPER
		// FILE TITLE & DESCRIPTION WRAPPER	

		// BIND
		var folderWrapper = 
			wrapper
			.selectAll('.list-folder-wrapper')
			.data(function(d) { 

				if ( d.file.store.type == that.folder ) {
					return [d];
				} else {
					return [];
				}
			});

		// ENTER
		folderWrapper
			.enter()
			.append('div')
			.classed('list-folder-wrapper', true);

		// UPDATE
		folderWrapper
			.on('click', function(d) {
				that.listfolderToggle(d, that);
			});

		// UPDATE
		folderWrapper
			.attr('class', function(d) {
				var isOpen = that.checkFolderOpenState(d.fileUuid, that);

				if ( isOpen ) {
					return 'list-folder-wrapper open-folder';
				} else {
					return 'list-folder-wrapper';
				}
			});




		// EXIT
		folderWrapper
			.exit()
			.remove();


	},


	// Select button

	selectButton : function () {

		var listOptions = this.listOptions;

		if ( !listOptions.button ) return;

		// Wrapper
		var wrapper = listOptions.wrapper;
		
		// Function to store selected items
		var fn = listOptions.button.fn;
		
		// Array with selected items
		var slArr = listOptions.button.arr;

		// Context
		var that = this;


		// SELECT BUTTON
		// SELECT BUTTON
		// SELECT BUTTON			

		// BIND
		var selectButton = 
			wrapper
			.selectAll('.item-select-button')
			.data(function(d) { return [d] });

		// ENTER
		selectButton
			.enter()
			.append('div')
			.classed('item-select-button', true);

		// UPDATE
		selectButton
			.on('mousedown', function(d) {
			
				// Set active state of button
				if ( this.className == 'item-select-button active' ) {
					Wu.DomUtil.removeClass(this, 'active')
					d.checked = true;
				} else {
					Wu.DomUtil.addClass(this, 'active')
					d.checked = false;
				}			

				var selectedFile = d.fileUuid;

				// Store selected files 
				fn(selectedFile, that);
							
			});

		// UPDATE
		selectButton
			.attr('class', function(d) {

				// MAKE SURE THAT THE SELECTED STATE ON FILES FOLLOWS ON UPDATE
				var selected = false;
				slArr.forEach(function (sel) {
					if ( d.fileUuid == sel ) selected = true;
				})

				if ( selected ) return 'item-select-button active';
				else 		return 'item-select-button';
			})


		// EXIT
		selectButton
			.exit()
			.remove();

	},


	// List title

	listTitle : function (DATA) {


		var wrapper = this.listOptions.wrapper;
		var field   = this.listOptions.titleSpace.name.field;

		var that    = this;

		// FILE TITLE & DESCRIPTION WRAPPER
		// FILE TITLE & DESCRIPTION WRAPPER
		// FILE TITLE & DESCRIPTION WRAPPER	

		// BIND
		var titleWrapper = 
			wrapper
			.selectAll('.list-title-wrapper')
			.data(function(d) { return [d] });

		// ENTER
		titleWrapper
			.enter()
			.append('div')
			.classed('list-title-wrapper', true);

		// UPDATE
		titleWrapper
			.attr('style', function(d) {		
				var style = '';
				var _width = that.getNameWidth(that);
				if ( _width ) style += 'width:' + _width + '%;';
				if ( d.file.store.type == that.folder ) style += 'padding-left: 115px;';
				return style;

			});


		// EXIT
		titleWrapper
			.exit()
			.remove();




		// FILE TITLE
		// FILE TITLE
		// FILE TITLE				

		// BIND
		var title = 
			titleWrapper
			.selectAll('.list-title')
			.data(function(d) { return [d] });

		// ENTER
		title
			.enter()
			.append('div')
			.classed('list-title', true);

		// UPDATE
		title
			.html(function (d) { return d.file.store[field] });


		// If there is a function on this field
		if ( this.listOptions.titleSpace.name.fn && this.listOptions.titleSpace.name.ev ) {
			
			title.on(this.listOptions.titleSpace.name.ev, function(d) {
				that.listOptions.titleSpace.name.fn(DATA, d, this, that);
			});

		}


		// EXIT
		title
			.exit()
			.remove();



		// FILE DESCRIPTION
		// FILE DESCRIPTION
		// FILE DESCRIPTION

		// BIND
		var fileDescription = 
			titleWrapper
			.selectAll('.list-description')
			.data(function(d) {
				return [d];
			});

		// ENTER
		fileDescription
			.enter()
			.append('div')
			.classed('list-description', true);		


		// UPDATE
		// If there is a function on this field
		if ( this.listOptions.titleSpace.description.fn && this.listOptions.titleSpace.description.ev ) {
				
			fileDescription
				.on(this.listOptions.titleSpace.description.ev, function(d) {
					that.listOptions.titleSpace.description.fn(DATA, d, this, that);
				});
		}


		// UPDATE
		// If there is a function on this field

		if ( this.listOptions.titleSpace.description.killOnSmall && this.tableSize == 'small' ) {
				
			fileDescription
				.classed('displayNone', true);
		}


		if ( this.listOptions.titleSpace.description.killOnSmall && this.tableSize != 'small' ) {
				
			fileDescription
				.classed('displayNone', false);
		}



		// UPDATE		
		fileDescription
			.html(function (d) { 
				var _html = that.listOptions.titleSpace.description.html(d);
				return _html;
			});

		// EXIT
		fileDescription
			.exit()
			.remove();			





		// FILE INFO
		// FILE INFO
		// FILE INFO


		if ( this.listOptions.fileInfo ) {

			// BIND
			var info = 
				titleWrapper
				.selectAll('.list-item-info')
				.data(function(d) { return [d] });

			// ENTER
			info
				.enter()
				.append('div')
				.classed('list-item-info', true);

			info
				.on('click', function(d) {
					that.toggleFileInfo(d, that, info);
				})


			// EXIT
			title
				.exit()
				.remove();

		}





	},


	// Init attributes

	initAttributes : function (DATA) {

		var listOptions = this.listOptions;
		var that = this;

		// Init processing, if there is such a thing...
		that.listProcessing(DATA);

		// Init attributes (gets stropped if there is processing happening...)
		listOptions.attributes.forEach(function (att, i) {

			if ( att.niceName != 'Name' ) {
				// Filter out fields that should only appear for editors
				var proceed = true;
				if ( att.restrict    && !that.canEdit ) proceed = false;
				if ( proceed ) that.listAttribute(i, DATA);
					// that.listProcessing(i, DATA);
				

			}

		})
	
	},

	listProcessing : function (i, DATA) {

		var listOptions = this.listOptions;
		var that        = this;
		

		// WRAPPER
		// WRAPPER
		// WRAPPER

		// BIND
		var process = 
			listOptions.wrapper
			.selectAll('.list-process-grind')
			.data(function(d) { 

				if ( d.file.isProcessing ) {
					return [d];
				} else {
					return [];
				}
			});

		// ENTER
		process
			.enter()
			.append('div')
			.classed('list-process-grind', true);


		// EXIT
		process
			.exit()
			.remove();


		// // Process bar

		// // BIND
		// var processBar = 
		// 	process
		// 	.selectAll('.list-process-bar')
		// 	.data(function(d) { return [d] });

		// // ENTER
		// processBar
		// 	.enter()
		// 	.append('div')
		// 	.classed('list-process-bar', true);

		// // EXIT
		// processBar
		// 	.exit()
		// 	.remove();



		// // Process bar inner

		// // BIND
		// var processBarInner = 
		// 	processBar
		// 	.selectAll('.list-process-bar-inner')
		// 	.data(function(d) { return [d] });

		// // ENTER
		// processBarInner
		// 	.enter()
		// 	.append('div')
		// 	.classed('list-process-bar-inner', true);

		// // UPDATE
		// processBarInner
		// 	.attr('style', function(d) {

		// 		var percent = d.file.isProcessing.percent;
		// 		if ( d.file.isProcessing.percent > 100 ) {
		// 			percent = 100;
		// 		}
		// 		return 'width:' + percent + '%'; 
		// 	})

		// // EXIT
		// processBarInner
		// 	.exit()
		// 	.remove();





		// // Process NO

		// // BIND
		// var processNO = 
		// 	process
		// 	.selectAll('.list-process-no')
		// 	.data(function(d) { return [d] });

		// // ENTER
		// processNO
		// 	.enter()
		// 	.append('div')
		// 	.classed('list-process-no', true);

		// // UPDATE
		// processNO
		// 	.html(function(d) {
		// 		return d.file.isProcessing.tiles;
		// 	})

		// // EXIT
		// processNO
		// 	.exit()
		// 	.remove();			


	},


	// listProcessing : function (i, DATA) {

	// 	var listOptions = this.listOptions;
	// 	var that        = this;
		

	// 	// WRAPPER
	// 	// WRAPPER
	// 	// WRAPPER

	// 	// BIND
	// 	var process = 
	// 		listOptions.wrapper
	// 		.selectAll('.list-process')
	// 		.data(function(d) { 

	// 			if ( d.file.isProcessing ) {
	// 				return [d];
	// 			} else {
	// 				return [];
	// 			}
	// 		});

	// 	// ENTER
	// 	process
	// 		.enter()
	// 		.append('div')
	// 		.classed('list-process', true);


	// 	// EXIT
	// 	process
	// 		.exit()
	// 		.remove();


	// 	// Process bar

	// 	// BIND
	// 	var processBar = 
	// 		process
	// 		.selectAll('.list-process-bar')
	// 		.data(function(d) { return [d] });

	// 	// ENTER
	// 	processBar
	// 		.enter()
	// 		.append('div')
	// 		.classed('list-process-bar', true);

	// 	// EXIT
	// 	processBar
	// 		.exit()
	// 		.remove();



	// 	// Process bar inner

	// 	// BIND
	// 	var processBarInner = 
	// 		processBar
	// 		.selectAll('.list-process-bar-inner')
	// 		.data(function(d) { return [d] });

	// 	// ENTER
	// 	processBarInner
	// 		.enter()
	// 		.append('div')
	// 		.classed('list-process-bar-inner', true);

	// 	// UPDATE
	// 	processBarInner
	// 		.attr('style', function(d) {

	// 			var percent = d.file.isProcessing.percent;
	// 			if ( d.file.isProcessing.percent > 100 ) {
	// 				percent = 100;
	// 			}
	// 			return 'width:' + percent + '%'; 
	// 		})

	// 	// EXIT
	// 	processBarInner
	// 		.exit()
	// 		.remove();





	// 	// Process NO

	// 	// BIND
	// 	var processNO = 
	// 		process
	// 		.selectAll('.list-process-no')
	// 		.data(function(d) { return [d] });

	// 	// ENTER
	// 	processNO
	// 		.enter()
	// 		.append('div')
	// 		.classed('list-process-no', true);

	// 	// UPDATE
	// 	processNO
	// 		.html(function(d) {
	// 			return d.file.isProcessing.tiles;
	// 		})

	// 	// EXIT
	// 	processNO
	// 		.exit()
	// 		.remove();			


	// },

	// Each attribute
	listAttribute : function (i, DATA) {

		var listOptions = this.listOptions;
		var that        = this;
		var attribute   = listOptions.attributes[i].name;
		var fn 	        = listOptions.attributes[i].fn;
		var ev 	        = listOptions.attributes[i].ev;
		var style       = this.getAttributeStyle(i);
		var kill 	= listOptions.attributes[i].killOnSmall;


		// WRAPPER
		// WRAPPER
		// WRAPPER

		// BIND
		var listAttributeWrapper = 
			listOptions.wrapper
			.selectAll('.list-attribute-wrapper-' + attribute)
			.data(function(d) { 

				if ( d.file.isProcessing ) {
					return [];

				} else if ( kill && that.tableSize == 'small' ) {
					return [];
				} else {
					return [d];
				}
			});

		// ENTER
		listAttributeWrapper
			.enter()
			.append('div')
			.classed('list-attribute-wrapper-' + attribute, true)
			.classed('list-attribute-wrapper', true);


		// update
		listAttributeWrapper
			.attr('style', style);


		// if ( fn && event ) {
		if (fn) {
			// UPDATE
			listAttributeWrapper 
				.on(ev, function (d) {
					fn(DATA, d, this, that);
				});
		}



		// EXIT
		listAttributeWrapper
			.exit()
			.remove();


		// INNER
		// INNER
		// INNER

		// BIND
		var listAttribute = 
			listAttributeWrapper
			.selectAll('.list-attribute-' + attribute)
			.data(function(d) { return [d] });

		// ENTER
		listAttribute
			.enter()
			.append('div')
			.classed('list-attribute-' + attribute, true)
			.classed('list-attribute', true);



		// UPDATE
		listAttribute
			.html(function (d) { 




				// If we have special rules for HTML ...
				if ( listOptions.attributes[i].html ) {
					var returnData = listOptions.attributes[i].html(d, that);
					
					if ( returnData ) {
						return [returnData.camelize()]
					} else {
						return [];
					}

				// if not, return attribute field.
				} else {
					if ( d.file.store[attribute] ) {
						return d.file.store[attribute].camelize();
					} else {
						return []; 
					}				
				}

			});

		// EXIT
		listAttribute
			.exit()
			.remove();

	},


	updateProcessig : function (context, data) {


		// BIND
		var process = 
			context
			.selectAll('.list-process')
			.data(function(d) { 
				return [d] 
			});

		// ENTER
		process
			.enter()
			.append('div')
			.classed('list-process', true);


		// EXIT
		process
			.exit()
			.remove();



		// Process bar

		// BIND
		var processBar = 
			process
			.selectAll('.list-process-bar')
			.data(function(d) { return [d] });

		// ENTER
		processBar
			.enter()
			.append('div')
			.classed('list-process-bar', true);

		// EXIT
		processBar
			.exit()
			.remove();



		// Process bar inner

		// BIND
		var processBarInner = 
			processBar
			.selectAll('.list-process-bar-inner')
			.data(function(d) { return [d] });

		// ENTER
		processBarInner
			.enter()
			.append('div')
			.classed('list-process-bar-inner', true);

		// UPDATE
		processBarInner
			.attr('style', function(d) {
				return 'width:' + d.file.isProcessing.percent + '%'; 
			})

		// EXIT
		processBarInner
			.exit()
			.remove();



		// Process NO

		// BIND
		var processNO = 
			process
			.selectAll('.list-process-no')
			.data(function(d) { return [d] });

		// ENTER
		processNO
			.enter()
			.append('div')
			.classed('list-process-no', true);

		// UPDATE
		processNO
			.html(function(d) {
				return d.file.isProcessing.tiles;
			})

		// EXIT
		processNO
			.exit()
			.remove();		

	},




	// ┬  ┬┌─┐┌┬┐  ┌─┐┬ ┬┌┐┌┌─┐┌┬┐┬┌─┐┌┐┌┌─┐
	// │  │└─┐ │   ├┤ │ │││││   │ ││ ││││└─┐
	// ┴─┘┴└─┘ ┴   └  └─┘┘└┘└─┘ ┴ ┴└─┘┘└┘└─┘	

	// Get style string for width and right position of attribute fields

	getNameWidth : function (that) {

		var attribs = that.listOptions.attributes;
		var _width = 100;
		var that = this;

		attribs.forEach(function (att) {

			var exclude = true;
			if ( att.restrict ) { if ( that.canEdit ) exclude = false;
			} else { exclude = false; }

			if ( att.killOnSmall && that.tableSize == 'small' ) {
				exclude = true;
			}

			if ( !exclude && att.width ) {

				var width;
				// Enable different width in collapsed mode
				if ( att.smallWidth && !att.killOnSmall && that.tableSize == 'small' ) {
					width = att.smallWidth;
				} else {
					width = att.width;
				}

				_width -= width;
			}
		});

		return _width;

	},



	getAttributeStyle : function (i) {

		var that 	= this;
		var listOptions = this.listOptions;
		var _attrib 	= listOptions.attributes[i];
		var width       = _attrib.width;
		var restrict    = _attrib.restrict;
		var no 		= i;
		var a_allWidth 	= 0;
		var b_allWidth 	= 0;
		var displayNone	= false;

		// Enable different width in collapsed mode
		if ( _attrib.smallWidth && !_attrib.killOnSmall && that.tableSize == 'small' ) {
			width = _attrib.smallWidth;
		}


		listOptions.attributes.forEach(function (attrib, i) {

			var exclude = true;

			if ( attrib.restrict ) {
				if ( this.canEdit ) exclude = false;
			} else {
				exclude = false;
			}

			if ( attrib.killOnSmall && that.tableSize == 'small' ) {
				exclude = true;
			}			

			if ( !exclude ) {

				var _width;

				// Compensate for width in collapsed mode
				if ( attrib.smallWidth && !attrib.killOnSmall && that.tableSize == 'small' ) {
					_width = attrib.smallWidth;

				// if not in collapsed mode
				} else {
					_width = attrib.width;
				}

				if ( _width && i >= no ) a_allWidth += _width;
				if ( _width ) 	         b_allWidth += _width;
			}
			
		}, this)


		var right = (b_allWidth - 10) - (a_allWidth - 10);
		
		var style = 'width: ' + width + '%; right: ' + right + '%;';

		if ( restrict && !this.canEdit ) style += ' display: none;';

		return style;

	},


	// SELECT ALL BUTTON

	selectAllClick : function () {

		if ( !this.listOptions.button ) return;

		var DATA    = this.data2array(this.listData);
		if ( this.sortedData ) DATA = this.sortedData;

		var selected = this.listOptions.button.arr;

		if ( selected.length == DATA.length ) {
			this.listOptions.button.arr = [];
			this.refreshTable();
		} else {

			this.listOptions.button.arr = [];
			DATA.forEach(function (d) {
				this.listOptions.button.arr.push(d.fileUuid);
			}, this)
			this.refreshTable();
		}


	},	

	checkSelected : function (uuid) {

		if ( !this.listOptions.button ) return;

		var slArr = this.listOptions.button.arr;

		var isSelected = false;

		slArr.forEach(function (selected) {
			if ( selected == uuid ) isSelected = true;
		})

		return isSelected;
	
	},


	// FOLDER

	checkFolderOpenState : function(fileUuid, that) {

		if ( !that.openFolders ) return false;

		var isOpen = false;
		that.openFolders.forEach(function(openFolder) {
			if ( openFolder == fileUuid ) isOpen = true;
		})

		return isOpen;

	},

	listfolderToggle : function (d, that) {

		if ( !that.openFolders ) that.openFolders = [];

		var thisFolderIsOpen = false;

		that.openFolders.forEach(function(openFolder, i) {
			if ( openFolder == d.fileUuid ) thisFolderIsOpen = i+1;
		});

		if ( thisFolderIsOpen ) {
			that.openFolders.splice(thisFolderIsOpen-1, 1);			
		} else {
			that.openFolders.push(d.fileUuid);
			
		}

		that.refreshTable();

	},	


	// TOGGLE FILE INFO

	checkOpenFileInfo : function(fileUuid, that) {

		if ( !that.showFileInfo ) return false;

		var isOpen = false;
		that.showFileInfo.forEach(function(openInfo) {
			if ( openInfo == fileUuid ) isOpen = true;
		})

		return isOpen;		

	},


	toggleFileInfo : function (d, that, info) {

		if ( !that.showFileInfo ) that.showFileInfo = [];

		var thisOpen = false;
		that.showFileInfo.forEach(function (fi, i) {
			if (fi == d.fileUuid) thisOpen = i+1;
		})

		if ( thisOpen ) {
			that.showFileInfo.splice(thisOpen-1, 1);
		} else {
			that.showFileInfo.push(d.fileUuid);
		}

		that.refreshTable();

	},

})



// ██████╗  █████╗ ████████╗ █████╗     ██╗     ██╗██████╗ ██████╗  █████╗ ██████╗ ██╗   ██╗
// ██╔══██╗██╔══██╗╚══██╔══╝██╔══██╗    ██║     ██║██╔══██╗██╔══██╗██╔══██╗██╔══██╗╚██╗ ██╔╝
// ██║  ██║███████║   ██║   ███████║    ██║     ██║██████╔╝██████╔╝███████║██████╔╝ ╚████╔╝ 
// ██║  ██║██╔══██║   ██║   ██╔══██║    ██║     ██║██╔══██╗██╔══██╗██╔══██║██╔══██╗  ╚██╔╝  
// ██████╔╝██║  ██║   ██║   ██║  ██║    ███████╗██║██████╔╝██║  ██║██║  ██║██║  ██║   ██║   
// ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝    ╚══════╝╚═╝╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   


// Wu.DataLibraryList = Wu.List.extend({


// 	// ┌─┐┌─┐┌┐┌┌─┐┬─┐┌─┐┬  
// 	// │ ┬├┤ │││├┤ ├┬┘├─┤│  
// 	// └─┘└─┘┘└┘└─┘┴└─┴ ┴┴─┘


// 	// Refresh table
// 	refresh : function (DATA) {

// 		if ( DATA ) this._D3list(DATA);

// 	},


// 	addItems : function (items) {

// 		if ( this.sortedData ) {
// 			var that = this;

// 			items.forEach(function (item) {

// 				var newItem = {
// 					fileUuid : item.uuid,
// 					file : {
// 						store : item
// 					}
// 				}

// 				that.sortedData.push(newItem);

// 			})

// 		}

// 		this.refreshTable();

// 	},

// 	removeItems : function (items) {

// 		// Remove from sorted data
// 		if ( this.sortedData ) {

// 			var that = this;
			
// 			var delThese = []

// 			// Run through all sorted data
// 			this.sortedData.forEach(function (sd, i) {

// 				// Run through all items we're going to delete
// 				items.forEach(function (item) {

// 					// If there is a match, push into delete items array
// 					if ( item.uuid == sd.fileUuid ) delThese.push(sd);

// 				})
// 			})

// 			// Run through delete items array, and splice on idex
// 			delThese.forEach(function (dt) {
// 				var index = that.sortedData.indexOf(dt);
// 				that.sortedData.splice(index, 1);
// 			})

// 		}

// 		this.refreshTable();

// 	},

// 	// Save
// 	save : function (saveJSON) {

// 		var key     = saveJSON.key;
// 		var value   = saveJSON.value;
// 		var id      = saveJSON.id;
// 		var _sJson  = {};
// 		_sJson[key] = value;
// 		_sJson.uuid = id;

// 		var string  = JSON.stringify(_sJson);

// 		Wu.save('/api/file/update', string); 

// 		// hack: update layer also if exists
// 		if (key == 'name') this._updateLayerName(id, value);
// 		if (key == 'description') this._updateLayerDescription(id, value);
// 		if (key == 'copyright') this._updateLayerCopyright(id, value);
// 	},

// 	_updateLayerName : function (fileUuid, title) {

// 		var layer = this._findLayerByFile(fileUuid)
// 		if (!layer) return;
		
// 		// update layermenu
// 		var lm = app.MapPane._controls.layermenu;
// 		lm && lm._refreshContent(true);

// 		var insp = app.MapPane._controls.inspect;
// 		insp && insp._refreshContent(true);

// 		var leg = app.MapPane._controls.legends;
// 		leg && leg._refresh(true);

// 		layer.setTitle(title);
// 	},
// 	_updateLayerDescription : function (fileUuid, description) {
// 		var layer = this._findLayerByFile(fileUuid)
// 		if (!layer) return;
// 		layer.setDescription(description);
// 	},
// 	_updateLayerCopyright : function (fileUuid, copyright) {
// 		var layer = this._findLayerByFile(fileUuid)
// 		if (!layer) return;
// 		layer.setCopyright(copyright);
// 	},
// 	_findLayerByFile : function (fileUuid) {
// 		console.log('_findLayerByFile: ', fileUuid);
// 		for (p in app.Projects) {
// 			var project = app.Projects[p];
// 			for (l in project.layers) {
// 				console.log('l?,', l);
// 				var layer = project.layers[l]; 	// todo: this is a string (layer-2323232), so this can't work!
// 				if (!layer) return false;
// 				if (!layer.store) return false;
// 				if (layer.store.file == fileUuid) {
// 					return layer;
// 				};		
// 			};
// 		};
// 		return false;
// 	},

// 	// OPTIONS FOR THE LIST
// 	getListOptions : function () {


// 		var listOptions = {

// 			fileInfo   : true, 

// 			button     : {

// 					// when selecting item
// 					fn  : this.selectListItem,

// 					// array with stored selections
// 					arr : []

// 			},
			
// 			titleSpace : {

// 				name 		: {

// 					fn    	    : this.titleFunction,
// 					ev    	    : 'dblclick',
// 					field 	    : 'name'
// 				},

// 				description 	: {

// 					fn    	    : this.injectTagsPopUp,
// 					ev    	    : 'dblclick',
// 					html  	    : this.descriptionHTML,
// 					field 	    : false,			// field if false because we use an HTML function to get field value
// 					killOnSmall : true,			// kill when list is in "collapsed" mode					
// 				}

// 			},

// 			attributes : [

// 					// This one is only used for the header

// 					{ 	
// 						name 	 : 'name',	
// 						niceName : 'Name',
// 						fn       : null,
// 						ev       : null
// 					},					

					
// 					// These ones are used for attributes

// 					// { 	
// 					// 	name 	 : 'status',
// 					// 	niceName : 'Status',
// 					// 	fn       : null,
// 					// 	ev       : null,
// 					// 	restrict : true,
// 					// 	width    : 10
// 					// },

// 					{ 	
// 						name 	    : 'created',		// name in field
// 						niceName    : 'Date',			// view name
// 						html        : this.dateHTML,		// html function
// 						fn          : null,			// event function
// 						ev          : null,			// event trigger (i.e. "mousedown")
// 						killOnSmall : true,			// kill when list is in "collapsed" mode
// 						restrict    : false,			// restrict to editors
// 						width       : 15			// width in percent

// 					},	

// 					{ 	
// 						name 	    : 'category',
// 						niceName    : 'Category',
// 						fn          : this.injectCategoryPopUp,
// 						ev          : 'dblclick',
// 						html        : this.categoryHTML,
// 						killOnSmall : true,
// 						restrict    : false,						
// 						width       : 15,
// 						smallWidth  : 18						
// 					},

// 					{ 	
// 						name 	    : 'type',
// 						niceName    : 'Type',
// 						fn          : null,
// 						ev          : null,
// 						killOnSmall : false,
// 						restrict    : false,						
// 						width       : 15,
// 						smallWidth  : 18				
// 					},

// 			],

// 			// Fields we incorporate in searching
// 			searchFields : [

// 				'type',
// 				'name',
// 				'description',
// 				'created',
// 				'category',
// 				'createdByName',
// 				'keywords'

// 				]			

// 		}

// 		return listOptions;
	
// 	},



// 	// ┌─┐┌─┐┌┬┐┬┌─┐┌┐┌  ┌─┐┬ ┬┌┐┌┌─┐┌┬┐┬┌─┐┌┐┌┌─┐
// 	// ├─┤│   │ ││ ││││  ├┤ │ │││││   │ ││ ││││└─┐
// 	// ┴ ┴└─┘ ┴ ┴└─┘┘└┘  └  └─┘┘└┘└─┘ ┴ ┴└─┘┘└┘└─┘	

// 	// Functions that gets triggered on events in table cells

// 	titleFunction : function (DATA, d, context, outerContext) {

// 		if ( !outerContext.canEdit ) return;

// 		var options = {

// 			outerContext : outerContext,
// 			context      : context,
// 			what         : 'name',
// 			allDATA      : DATA,
// 			data 	     : d,
// 			where        : d.file.store,
// 			value        : d.file.store.name,
// 			uuid         : d.fileUuid

// 		}

// 		if ( this.sortedData ) options.allDATA = this.sortedData;

// 		outerContext.editField(options);

// 	},

// 	descriptionHTML : function (DATA) {

// 		var keywords = DATA.file.store.keywords.join(', ');
// 		if ( keywords.length >= 2 ) var res = 'Tags: ' + keywords;
// 		else 			    var res = 'Add tags...';
// 		return res;

// 	},

// 	categoryHTML : function (DATA) {

// 		var category = DATA.file.store.category;
// 		if ( !category || category == '' || category == ' ' ) return '<span class="grayed">no category</span>';
// 		else return category;

// 	},	
	

// 	// ┌─┐─┐ ┬┌┬┐┌─┐┬─┐┌┐┌┌─┐┬  
// 	// ├┤ ┌┴┬┘ │ ├┤ ├┬┘│││├─┤│  
// 	// └─┘┴ └─ ┴ └─┘┴└─┘└┘┴ ┴┴─┘	

// 	// These functions gets called from sidepane.dataLibrary.js

// 	// Returns selected list items

// 	getSelected : function () {

// 		// get selected files
// 		var checks = [];

// 		var dataArray = this.data2array(this.listData);

// 		var selectedListItems = this.listOptions.button.arr;
		
// 		// Go throuhg all files on project
// 		dataArray.forEach(function(file) {

// 			// Go through checked files
// 			selectedListItems.forEach(function (selectedFile) {

// 				// Save if we have a match
// 				if ( selectedFile == file.fileUuid ) checks.push(file.file.store);

// 			});

// 		});

// 		// Return files
// 		return checks;

// 	},	



// 	// ███████╗██╗██╗     ███████╗    ███╗   ███╗███████╗████████╗ █████╗ 
// 	// ██╔════╝██║██║     ██╔════╝    ████╗ ████║██╔════╝╚══██╔══╝██╔══██╗
// 	// █████╗  ██║██║     █████╗      ██╔████╔██║█████╗     ██║   ███████║
// 	// ██╔══╝  ██║██║     ██╔══╝      ██║╚██╔╝██║██╔══╝     ██║   ██╔══██║
// 	// ██║     ██║███████╗███████╗    ██║ ╚═╝ ██║███████╗   ██║   ██║  ██║
// 	// ╚═╝     ╚═╝╚══════╝╚══════╝    ╚═╝     ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝
	                                                                   

// 	// ┌─┐┬┬  ┌─┐  ┬┌┐┌┌─┐┌─┐  ┌─┐┬ ┬┌┐┌┌─┐┌┬┐┬┌─┐┌┐┌
// 	// ├┤ ││  ├┤   ││││├┤ │ │  ├┤ │ │││││   │ ││ ││││
// 	// └  ┴┴─┘└─┘  ┴┘└┘└  └─┘  └  └─┘┘└┘└─┘ ┴ ┴└─┘┘└┘

// 	openItemInfo : function (DATA) {

// 		var wrapper = this.listOptions.wrapper;

// 		// Create the file info wrapper
// 		var info = this.listMetaInfoWrapper(wrapper);

// 		// Thumbnail
// 		this.listMetaThumb(info);

// 		// File list
// 		this.listMetaFileList(info);

// 		// Copyright
// 		this.listMetaOtherCopyright(info);		


		
// 		// Other meta wrapper
// 		var otherMetaWrapper = this.listMetaOther(info);

// 		// Statistics
// 		// this.listMetaOtherStats(otherMetaWrapper);

// 		// // Other meta: Uploaded by
// 		// this.listMetaOtherUploadedBy(otherMetaWrapper);


// 		// Description
// 		// this.listMetaDescription(info);		
// 		this.listMetaDescription(otherMetaWrapper);

// 		// Other meta: Uploaded by
// 		this.listMetaOtherUploadedBy(otherMetaWrapper);



// 	},

// 	// Create the file info wrapper
// 	listMetaInfoWrapper : function (wrapper) {

// 		var that = this;

// 		// FILE INFO WRAPPER
// 		// FILE INFO WRAPPER
// 		// FILE INFO WRAPPER

// 		// BIND
// 		var info = 
// 			wrapper
// 			.selectAll('.open-list-info')
// 			.data(function(d) { 
// 				var isOpen = that.checkOpenFileInfo(d.fileUuid, that);
// 				if ( isOpen ) 	return [d];
// 				else 		return [];
// 			});


// 		// ENTER
// 		info
// 			.enter()
// 			.append('div')
// 			.classed('open-list-info', true);


// 		// EXIT
// 		info
// 			.exit()
// 			.remove();


// 		return info;

// 	},

// 	// Thumbnail
// 	listMetaThumb : function (wrapper) {


// 		// THUMB WRAPPER
// 		// THUMB WRAPPER
// 		// THUMB WRAPPER

// 		// BIND
// 		var thumb =
// 			wrapper
// 			.selectAll('.file-thumb')
// 			.data(function(d) { return [d] })

// 		// ENTER
// 		thumb
// 			.enter()
// 			.append('div')
// 			.classed('file-thumb', true);

// 		// EXIT
// 		thumb
// 			.exit()
// 			.remove();



// 		// THUMB TITLE
// 		// THUMB TITLE
// 		// THUMB TITLE

// 		// BIND
// 		var thumbTitle =
// 			thumb
// 			.selectAll('.file-thumb-title')
// 			.data(function(d) { return [d] })

// 		// ENTER
// 		thumbTitle
// 			.enter()
// 			.append('div')
// 			.classed('file-thumb-title', true)
// 			.classed('list-meta-title', true)
// 			.html('Thumb:');

// 		// EXIT
// 		thumbTitle
// 			.exit()
// 			.remove();	



// 		// THUMB IMG
// 		// THUMB IMG
// 		// THUMB IMG


// 		// BIND
// 		var thumbImg =
// 			thumb
// 			.selectAll('.file-thumb-img')
// 			.data(function(d) { return [d] })

// 		// ENTER
// 		thumbImg
// 			.enter()
// 			.append('img')
// 			.classed('file-thumb-img', true)
// 			.attr('src', function(d) {

// 				var store = d.file.store;
				
// 				if (store.type == 'image') {
// 					var imageFile   = store.data.image.file;
// 					var url = '/pixels/image/' + imageFile + '?width=130&height=95'
// 					return url;
// 				}

// 			});

// 		// EXIT
// 		thumbImg
// 			.exit()
// 			.remove();	

				
// 	},

// 	// File list
// 	listMetaFileList : function (wrapper) {

// 		// FILE LIST WRAPPER
// 		// FILE LIST WRAPPER
// 		// FILE LIST WRAPPER

// 		// BIND
// 		var fileListWrapper =
// 			wrapper
// 			.selectAll('.file-list-wrapper')
// 			.data(function(d) { return [d.file.store.files] })

// 		// ENTER
// 		fileListWrapper
// 			.enter()
// 			.append('div')
// 			.classed('file-list-wrapper', true);

// 		// EXIT
// 		fileListWrapper
// 			.exit()
// 			.remove();


// 		// FILE LIST HEADER
// 		// FILE LIST HEADER

// 		// BIND
// 		var fileListHeader =
// 			fileListWrapper
// 			.selectAll('.file-list-header')
// 			.data(function(d) { return [d] })

// 		// ENTER
// 		fileListHeader
// 			.enter()
// 			.append('div')
// 			.classed('file-list-header', true)
// 			.classed('list-meta-title', true)			
// 			.html('Files:');

// 		// EXIT
// 		fileListHeader
// 			.exit()
// 			.remove();


// 		// FILES IN FILE LIST
// 		// FILES IN FILE LIST

// 		// BIND
// 		var eachFileInList =
// 			fileListWrapper
// 			.selectAll('.each-file-in-list')
// 			.data(function(d) { return d })

// 		// ENTER
// 		eachFileInList
// 			.enter()
// 			.append('div')
// 			.classed('each-file-in-list', true);

// 		// UPDATE
// 		eachFileInList
// 			.html(function(d) { return d })

// 		// EXIT
// 		eachFileInList
// 			.exit()
// 			.remove();

// 	},

// 	// Description
// 	listMetaDescription : function (wrapper) {

// 		var that = this;

// 		// DESCRIPTION OUTER WRAPPER
// 		// DESCRIPTION OUTER WRAPPER
// 		// DESCRIPTION OUTER WRAPPER			

// 		// BIND
// 		var descriptionOuterWrapper =
// 			wrapper
// 			.selectAll('.file-description-outer-wrapper')
// 			.data(function(d) { return [d] })

// 		// ENTER
// 		descriptionOuterWrapper
// 			.enter()
// 			.append('div')
// 			.classed('file-description-outer-wrapper', true);

// 		// EXIT
// 		descriptionOuterWrapper
// 			.exit()
// 			.remove();



// 		// DESCRIPTION TITLE
// 		// DESCRIPTION TITLE
// 		// DESCRIPTION TITLE

// 		// BIND
// 		var descriptionTitle =
// 			descriptionOuterWrapper
// 			.selectAll('.file-description-title')
// 			.data(function(d) { return [d] })

// 		// ENTER
// 		descriptionTitle
// 			.enter()
// 			.append('div')
// 			.classed('file-description-title', true)
// 			.classed('list-meta-title', true)
// 			.html('Description:');

// 		// EXIT
// 		descriptionTitle
// 			.exit()
// 			.remove();



// 		// DESCRIPTION TEXTAREA
// 		// DESCRIPTION TEXTAREA
// 		// DESCRIPTION TEXTAREA


// 		// BIND
// 		var descriptionTextAreaWrapper =
// 			descriptionOuterWrapper
// 			.selectAll('.description-textarea-outer-wrapper')
// 			.data(function(d) { return [d] });

// 		// ENTER
// 		descriptionTextAreaWrapper
// 			.enter()
// 			.append('div')
// 			.classed('description-textarea-outer-wrapper', true);

// 		// EXIT
// 		descriptionTextAreaWrapper
// 			.exit()
// 			.remove();




// 		// BIND
// 		var descriptionTextArea =
// 			descriptionTextAreaWrapper
// 			.selectAll('.file-description-inner-wrapper')
// 			.data(function(d) { return [d] });

// 		// ENTER
// 		descriptionTextArea
// 			.enter()
// 			.append('textarea')
// 			.classed('file-description-inner-wrapper', true);

// 		// UPDATE
// 		descriptionTextArea
// 			.html(function(d) {

// 				var description = d.file.store.description;
				
// 				if ( description ) {
// 					var hasHTML = description.search('</');
// 					if ( hasHTML >= 1 ) {
// 						this.outerHTML = description;
// 						return [];
						
// 					}
// 				}
				
// 				return description;
// 			})
// 			.on('focus', function(d) {
// 				d.context = this;
// 				Wu.DomEvent.on(this, 'keydown', _.throttle(that.throttleSaveDescription.bind(d), 1000)); 
// 			});

// 		// EXIT
// 		descriptionTextArea
// 			.exit()
// 			.remove();

// 	},

	

// 	throttleSaveDescription : function () {

// 		var text = this.context.value;
// 		var file = this.file;

// 		file.setDescription(text)

// 		var layer = file.getLayer();
		
// 		layer && layer.setDescription(text);


// 	},

// 	// Other meta wrapper
// 	listMetaOther : function (wrapper) {

// 		// OTHER META WRAPPER
// 		// OTHER META WRAPPER
// 		// OTHER META WRAPPER

// 		// BIND
// 		var otherMetaWrapper =
// 			wrapper
// 			.selectAll('.file-other-meta-wrapper')
// 			.data(function(d) { return [d] })

// 		// ENTER
// 		otherMetaWrapper
// 			.enter()
// 			.append('div')
// 			.classed('file-other-meta-wrapper', true);

// 		// EXIT
// 		otherMetaWrapper
// 			.exit()
// 			.remove();

// 		return otherMetaWrapper;

// 	},

// 	// Other meta: Uploaded by
// 	listMetaOtherUploadedBy : function (wrapper) {


// 		// UPLOADED BY WRAPPER
// 		// UPLOADED BY WRAPPER
// 		// UPLOADED BY WRAPPER

// 		// BIND
// 		var uploadedByWrapper =
// 			wrapper
// 			.selectAll('.file-uploaded-by-wrapper')
// 			.data(function(d) { return [d] })

// 		// ENTER
// 		uploadedByWrapper
// 			.enter()
// 			.append('div')
// 			.classed('file-uploaded-by-wrapper', true)
// 			.classed('list-meta-title', true);

// 		// EXIT
// 		uploadedByWrapper
// 			.exit()
// 			.remove();



// 		// UPLOADED BY TITLE
// 		// UPLOADED BY TITLE
// 		// UPLOADED BY TITLE				

// 		// BIND
// 		var uploadedByTitle =
// 			uploadedByWrapper
// 			.selectAll('.file-uploaded-by-title')
// 			.data(function(d) { return [d] })

// 		// ENTER
// 		uploadedByTitle
// 			.enter()
// 			.append('div')
// 			.classed('file-uploaded-by-title', true)
// 			.classed('list-meta-title', true)
// 			.html('Uploaded by:&nbsp;');

// 		// EXIT
// 		uploadedByTitle
// 			.exit()
// 			.remove();


// 		// UPLOADED BY
// 		// UPLOADED BY
// 		// UPLOADED BY

// 		// BIND
// 		var uploadedBy =
// 			uploadedByWrapper
// 			.selectAll('.file-uploaded-by')
// 			.data(function(d) { return [d] })

// 		// ENTER
// 		uploadedBy
// 			.enter()
// 			.append('div')
// 			.classed('file-uploaded-by', true)
// 			.html('Uploaded by:');

// 		// UPDATE
// 		uploadedBy
// 			.html(function(d) {

// 				var userID = d.file.store.createdBy;
// 				var fullname = app.Users[userID].getFullName()
				
// 				return fullname; // d.file.store.createdByName;
// 			})

// 		// EXIT
// 		uploadedBy
// 			.exit()
// 			.remove();

// 	},


// 	// Other meta: Uploaded by
// 	listMetaOtherCopyright : function (wrapper) {

// 		var that = this;

// 		// COPYRIGHT WRAPPER
// 		// COPYRIGHT WRAPPER
// 		// COPYRIGHT WRAPPER

// 		// BIND
// 		var copyrightWrapper =
// 			wrapper
// 			.selectAll('.file-copright-wrapper')
// 			.data(function(d) { return [d] })

// 		// ENTER
// 		copyrightWrapper
// 			.enter()
// 			.append('div')
// 			.classed('file-copright-wrapper', true)
// 			.classed('list-meta-title', true);

// 		// EXIT
// 		copyrightWrapper
// 			.exit()
// 			.remove();



// 		// COPYRIGHT TITLE
// 		// COPYRIGHT TITLE
// 		// COPYRIGHT TITLE

// 		// BIND
// 		var copyrightTitle =
// 			copyrightWrapper
// 			.selectAll('.file-copright-title')
// 			.data(function(d) { return [d] })

// 		// ENTER
// 		copyrightTitle
// 			.enter()
// 			.append('div')
// 			.classed('file-copright-title', true)
// 			.classed('list-meta-title', true)
// 			.html('Copyright:');

// 		// EXIT
// 		copyrightTitle
// 			.exit()
// 			.remove();





// 		// COPYRIGHT LINE
// 		// COPYRIGHT LINE
// 		// COPYRIGHT LINE

// 		// BIND
// 		var copyrightLine =
// 			copyrightWrapper
// 			.selectAll('.file-copright-line')
// 			.data(function(d) { return [d] })

// 		// ENTER
// 		copyrightLine
// 			.enter()
// 			.append('input')
// 			.attr('type', 'text')
// 			.attr('placeholder', 'Click to add copyright information')
// 			.classed('file-copright-line', true);

// 		copyrightLine
// 			.attr('value', function(d) {

// 				var file = d.file;
// 				var copyright = file.getCopyright();

// 				if ( copyright ) 	{ return copyright; }
// 				else 			{ return []; }
// 			})
// 			.on('focus', function(d) {
// 				d.context = this;
// 				Wu.DomEvent.on(this, 'keydown', _.throttle(that.throttleSaveCopyright.bind(d), 1000)); 
// 			});	


// 			// .on('f', function(d) {

// 			// 	// Fittepølse
// 			// 	// popopoppopopopoppopoopopo
// 			// 	console.log('fuck you!', this.value)
// 			// 	console.log('d', d.file);
// 			// 	// layer.setDescription/Title/Copyright

// 			// })

// 		// EXIT
// 		copyrightLine
// 			.exit()
// 			.remove();

// 	},

// 	throttleSaveCopyright : function () {

// 		var text = this.context.value;
// 		var file = this.file;

// 		file.setCopyright(text)

// 		// var layer = file.getLayer();
		
// 		// layer && layer.setDescription(text);

// 	},


// 	// .html(function(d) {

// 	// 	var description = d.file.store.description;
		
// 	// 	if ( description ) {
// 	// 		var hasHTML = description.search('</');
// 	// 		if ( hasHTML >= 1 ) {
// 	// 			this.outerHTML = description;
// 	// 			return [];
				
// 	// 		}
// 	// 	}
		
// 	// 	return description;
// 	// })
// 	// .on('focus', function(d) {
// 	// 	d.context = this;
// 	// 	Wu.DomEvent.on(this, 'keydown', _.throttle(that.throttleSave.bind(d), 1000)); 
// 	// });	




// 	// Other meta: Uploaded by
// 	listMetaOtherStats : function (wrapper) {


// 		// STATS WRAPPER
// 		// STATS WRAPPER
// 		// STATS WRAPPER

// 		// BIND
// 		var statsWrapper =
// 			wrapper
// 			.selectAll('.file-stats-wrapper')
// 			.data(function(d) { return [d] })

// 		// ENTER
// 		statsWrapper
// 			.enter()
// 			.append('div')
// 			.classed('file-stats-wrapper', true);

// 		// EXIT
// 		statsWrapper
// 			.exit()
// 			.remove();



// 		// STATS TITLE
// 		// STATS TITLE
// 		// STATS TITLE

// 		// BIND
// 		var statsTitle =
// 			statsWrapper
// 			.selectAll('.file-stats-title')
// 			.data(function(d) { return [d] })

// 		// ENTER
// 		statsTitle
// 			.enter()
// 			.append('div')
// 			.classed('file-stats-title', true)
// 			.classed('list-meta-title', true)
// 			.html('Statistics:');

// 		// EXIT
// 		statsTitle
// 			.exit()
// 			.remove();



// 		// STATS DOWNLOADS
// 		// STATS DOWNLOADS
// 		// STATS DOWNLOADS

// 		// BIND
// 		var statsDownloads =
// 			statsWrapper
// 			.selectAll('.file-stats-downloads')
// 			.data(function(d) { return [d] })

// 		// ENTER
// 		statsDownloads
// 			.enter()
// 			.append('div')
// 			.classed('file-stats-downloads', true)
// 			.classed('list-meta-title', true)
// 			// .html('2 d<span class="killat780">own</span>l<span class="killat780">oa</span>ds / 15 <span class="killat780">map</span> views');
// 			.html('Not available');

// 		// EXIT
// 		statsDownloads
// 			.exit()
// 			.remove();



// 	},


// 	// ██████╗  ██████╗ ██████╗     ██╗   ██╗██████╗ ███████╗
// 	// ██╔══██╗██╔═══██╗██╔══██╗    ██║   ██║██╔══██╗██╔════╝
// 	// ██████╔╝██║   ██║██████╔╝    ██║   ██║██████╔╝███████╗
// 	// ██╔═══╝ ██║   ██║██╔═══╝     ██║   ██║██╔═══╝ ╚════██║
// 	// ██║     ╚██████╔╝██║         ╚██████╔╝██║     ███████║
// 	// ╚═╝      ╚═════╝ ╚═╝          ╚═════╝ ╚═╝     ╚══════╝
	                                                      

// 	// ┌─┐┌─┐┌┬┐┌─┐┌─┐┌─┐┬─┐┬ ┬
// 	// │  ├─┤ │ ├┤ │ ┬│ │├┬┘└┬┘
// 	// └─┘┴ ┴ ┴ └─┘└─┘└─┘┴└─ ┴   


// 	injectCategoryPopUp : function (allData, data, context, outerContext) {

// 		if ( !outerContext.canEdit ) return;

// 		var dataLib = app.SidePane.DataLibrary;

// 		// close others
// 		outerContext.closeCategories();		

// 		// reset search field
// 		outerContext.resetSearch();		

// 		// get file uuid
// 		var fileUuid = data.fileUuid;

// 		// Save UUID
// 		outerContext._injectedUuid = fileUuid;

// 		// get file object
// 		var file = dataLib.project.getFile(fileUuid);

// 		// create wrapper
// 		var wrapper = outerContext._injectedCategory = Wu.DomUtil.create('div', 'list-popup-wrapper');

// 		// get array of categories
// 		var categories = dataLib.project.getCategories();

// 		// for each category
// 		categories.forEach(function (c) {

// 			// create category line
// 			outerContext.createCategoryLine(wrapper, c, file);

// 		});


// 		// add "new category" line
// 		var newlinewrap = Wu.DomUtil.create('div', 'list-popup-new-wrap', wrapper);
// 		var newline = outerContext._injectedNewline = Wu.DomUtil.create('input', 'list-popup-new', newlinewrap);
// 		newline.setAttribute('placeholder', 'Add category...');

// 		// set event on new category
// 		Wu.DomEvent.on(newline, 'keydown', outerContext.categoryKeydown, outerContext);		
// 		Wu.DomEvent.on(newline, 'mousedown', outerContext.stop, outerContext);		

// 		// set position 
// 		wrapper.style.position = 'absolute';
// 		wrapper.style.left = -47 + 'px';
// 		wrapper.style.top = 30 + 'px';

// 		// add to wrapper
// 		context.appendChild(wrapper);

// 		// add outside click event
// 		Wu.DomEvent.on(window, 'mousedown', outerContext._closeCategories, outerContext);

// 		// Google Analytics event tracking
// 		app.Analytics.setGaEvent(['Side Pane', 'Data library: inject category']);

// 	},

// 	createCategoryLine : function (wrapper, c, file) {


// 		// create line item
// 		var wrap = Wu.DomUtil.create('div', 'list-popup-line-wrap', wrapper);
// 		var div  = Wu.DomUtil.create('div', 'list-popup-line', wrap, c.camelize());
// 		var del  = Wu.DomUtil.create('div', 'list-popup-line-del', wrap, 'X');

// 		// select category
// 		Wu.DomEvent.on(div, 'mousedown', function (e) {
			
// 			// stop
// 			Wu.DomEvent.stopPropagation(e);

// 			// set vars
// 			var value = c;
// 			var key = 'category';

// 			// save to model
// 			file.setCategory(value);

// 			// close
// 			this.closeCategories();
		
// 			// refresh
// 			this.refreshTable();

// 		}, this);

// 		// delete category
// 		Wu.DomEvent.on(del, 'mousedown', function (e) {

// 			// stop
// 			Wu.DomEvent.stopPropagation(e);

// 			// remove category
// 			var msg = 'Are you sure you want to delete category ' + c.camelize() + '? This will remove the category from all files.';
// 			if (confirm(msg)) {

// 				// remove category
// 				this.removeCategory(c);
// 			} 

// 		}, this);

// 	},

// 	removeCategory : function (category) {

// 		// remove from project
// 		app.SidePane.DataLibrary.project.removeCategory(category);
	
// 		// remove from all files
// 		var files = app.SidePane.DataLibrary.project.getFileObjects();
// 		for (f in files) {
// 			var file = files[f];
// 			var fc = file.getCategory();
// 			if (fc) {
// 				if (fc.toLowerCase() == category.toLowerCase()) {
// 					file.setCategory('<span class="grayed">no category</span>'); // set blank
// 				}
// 			}
// 		}

// 		// close
// 		this.closeCategories();
	
// 		// refresh
// 		this.refreshTable();

// 	},

// 	closeCategories : function () {

// 		if (this._injectedCategory) Wu.DomUtil.remove(this._injectedCategory);
// 		Wu.DomEvent.off(window, 'mousedown', this._closeCategories, this);

// 	},

// 	_closeCategories : function () {

// 		this.closeCategories();
	
// 	},

// 	categoryKeydown : function (e) {

// 		// on enter
// 		if (e.keyCode == 13) {

// 			// get value
// 			var value = this._injectedNewline.value;

// 			// create new category
// 			app.SidePane.DataLibrary.project.addCategory(value);

// 			// get file
// 			var fileUuid = this._injectedUuid;
// 			var file = app.SidePane.DataLibrary.project.getFile(fileUuid);

// 			// set category
// 			file.setCategory(value);

// 			// close
// 			this.closeCategories();
		
// 			// refresh
// 			// this.reset();
// 			this.refreshTable();
// 		}

// 		// on esc
// 		if (e.keyCode == 27) {
			
// 			// close, do nothing
// 			this.closeCategories();
// 		}

// 	},	


// 	// ┌┬┐┌─┐┌─┐┌─┐
// 	//  │ ├─┤│ ┬└─┐
// 	//  ┴ ┴ ┴└─┘└─┘

// 	injectTagsPopUp : function (allData, data, context, outerContext) {

// 		if ( !outerContext.canEdit ) return;

// 		var dataLib = app.SidePane.DataLibrary;

// 		// Clean up
// 		outerContext._closeTags();

// 		// get file uuid
// 		var fileUuid = data.fileUuid;

// 		// Save UUID
// 		outerContext._injectedUuid = fileUuid;

// 		// get file object
// 		var file = dataLib.project.getFile(fileUuid);

// 		// create wrapper
// 		outerContext._injected = {};

// 		var wrapper      = outerContext._injected.outer = Wu.DomUtil.create('div', 'list-popup-wrapper'); // TODO: change classname
// 		var innerWrapper = outerContext._injected.inner = Wu.DomUtil.create('div', 'list-popup-tag-wrapper-inner', wrapper); // TODO: change classname

// 		// add line per category
// 		var tags = data.file.store.keywords;

// 		// Roll out the tags
// 		outerContext.updateTagList(file);


// 		// add new category line
// 		var newlinewrap = Wu.DomUtil.create('div', 'list-popup-new-wrap', wrapper);
// 		var newline = outerContext._injectedNewline = Wu.DomUtil.create('input', 'list-popup-new', newlinewrap);
// 		newline.setAttribute('placeholder', 'Add tag...');

// 		outerContext._ghostTag = Wu.DomUtil.create('div', 'list-ghost-tag', newlinewrap);

// 		// set event on new category
// 		Wu.DomEvent.on(newline, 'keydown',   outerContext.tagKeydown, outerContext);
// 		Wu.DomEvent.on(newline, 'keyup',     outerContext.tagKeyup, outerContext);
// 		Wu.DomEvent.on(newline, 'mousedown', outerContext.stop, outerContext);		
// 		Wu.DomEvent.on(wrapper, 'mousedown', outerContext.stop, outerContext);

// 		// set position 
// 		wrapper.style.position = 'absolute';
// 		wrapper.style.left = 0 + 'px';
// 		wrapper.style.top = 30 + 'px';

// 		// add to wrapper
// 		context.appendChild(wrapper);

// 		// add outside click event
// 		Wu.DomEvent.on(window, 'mousedown', outerContext._closeTags, outerContext);


// 		outerContext.findAllTags();

// 	},

// 	updateTagList : function (file) {

// 		var that = this;

// 		// Wrapper...
// 		var d3Wrapper = d3.select(this._injected.inner);

// 		// Tags...
// 		var store = file.store.keywords;


// 		// LINE WRAPPER
// 		// LINE WRAPPER		

// 		// bind
// 		var lineWrapper =
// 			d3Wrapper
// 			.selectAll('.list-popup-line-wrap')
// 			.data(store, function(d) { 
// 				return [d] 
// 			});
			
// 		// enter
// 		lineWrapper
// 			.enter()
// 			.append('div')
// 			.classed('list-popup-line-wrap', true);

// 		// exit
// 		lineWrapper
// 			.exit()
// 			.remove();


// 		// LINE
// 		// LINE		

// 		// bind
// 		var line = 
// 			lineWrapper
// 			.selectAll('.list-popup-line')
// 			.data(function(d) { return [d] })

// 		// enter
// 		line
// 			.enter()
// 			.append('div')
// 			.classed('list-popup-line', true)

// 		// update
// 		line
// 			.html(function(d) {
// 				return d
// 			})

// 		// exit
// 		line
// 			.exit()
// 			.remove();


// 		// DEL
// 		// DEL

// 		// bind
// 		var del = 
// 			lineWrapper
// 			.selectAll('.list-popup-line-del')
// 			.data(function(d) { return [d] })

// 		// enter
// 		del
// 			.enter()
// 			.append('div')
// 			.classed('list-popup-line-del', true);

// 		// update
// 		del
// 			.on('mousedown', function (d) {

// 				var index = false;

// 				// We add 1 to index to avoid 0, which is read as the same as "false"
// 				store.forEach(function (st,i) {
// 					if ( d == st ) index = i+1;
// 				})

// 				if ( index ) {
// 					store.splice(index-1, 1);				
// 				} else if ( store.length <= 1 ) {
// 					file.store.keywords = [];
// 				}

// 				that.updateTagList(file);
// 				that.refreshTable();
// 				file.setTag();

// 			})
// 			.html('X');

// 		// exit
// 		del
// 			.exit()
// 			.remove();

// 	},

// 	// Not sure if this is enough
// 	_closeTags : function () {

// 		if ( this._injected ) {
// 			Wu.DomUtil.remove(this._injected.outer);
// 			Wu.DomUtil.remove(this._injected.inner);
// 		}

// 	},

// 	// Finds all tags on all files for auto completion
// 	findAllTags : function () {

// 		this._allTags = [];
// 		var that = this;

// 		for (f in this.listData) {

// 			var keywords = this.listData[f].store.keywords;

// 			keywords.forEach(function (k) {

// 				var noMatch = true;
// 				that._allTags.forEach(function (aT) {
// 					if ( k == aT ) noMatch = false;
// 				})

// 				if ( noMatch ) that._allTags.push(k);

// 			})
// 		};

// 	},

// 	// When typing
// 	tagKeydown : function (e) {

// 		// If we're using arrow right
// 		if (e.which == 39  || e.keyCode == 39 ) {
// 			if ( this._ghostValue ) e.target.value = this._ghostValue;
// 		}
		
// 		// If there is an enter or a comma, save
// 		if (e.which == 13  || e.keyCode == 13 || e.which == 188 || e.keyCode == 188 ) {

// 			var value = e.target.value;

// 			if ( value.length <= 2 ) return;

// 			// update file in project
// 			var file    = app.SidePane.DataLibrary.project.getFile(this._injectedUuid);
// 			var wrapper = this._injected.inner;

// 			// Add keyword to array
// 			file.store.keywords.push(value);

// 			// Refresh list
// 			this.refreshTable();

// 			// Create a new line
// 			this.updateTagList(file);

// 			// save to model
// 			file.setTag();

// 			// Clear input field
// 			e.target.value = '';

// 			this._ghostTag.innerHTML = '';

// 			return;
// 		} 

// 	},

// 	tagKeyup : function (e) {

// 		// Clear input field on comma
// 		if ( e.which == 188 || e.keyCode == 188 ) {
// 			e.target.value = '';
// 			this._ghostTag.innerHTML = '';

// 		} else {

// 			// Auto completion
// 			var value = e.target.value;

// 			// Clear ghost
// 			if ( value.length <= 1 ) {
// 				this.ghostTag('', 0);
// 				return
// 			}

// 			var that = this;

// 			// Set new ghost for auto completion
// 			this._allTags.forEach(function (tag) {			

// 				var length = value.length;
// 				var tagStr = tag.substring(0, length);

// 				if ( tagStr == value) that.ghostTag(tag, length);
				
// 			})

// 		}

// 	},	

// 	// For auto completion
// 	ghostTag : function (tag, length) {

// 		var first  = tag.substring(0, length);
// 		var second = tag.substring(length, tag.length)

// 		var ghost = '<span class="shy-ghost">' + first + '</span>' + second;

// 		this._ghostTag.innerHTML = ghost;
// 		this._ghostValue = tag;

// 	}



// })


// ██╗   ██╗███████╗███████╗██████╗ ███████╗
// ██║   ██║██╔════╝██╔════╝██╔══██╗██╔════╝
// ██║   ██║███████╗█████╗  ██████╔╝███████╗
// ██║   ██║╚════██║██╔══╝  ██╔══██╗╚════██║
// ╚██████╔╝███████║███████╗██║  ██║███████║
//  ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝╚══════╝
                                         


Wu.UserList = Wu.List.extend({



	// ┌─┐┌─┐┌┐┌┌─┐┬─┐┌─┐┬  
	// │ ┬├┤ │││├┤ ├┬┘├─┤│  
	// └─┘└─┘┘└┘└─┘┴└─┴ ┴┴─┘


	// Refresh table
	refresh : function (DATA) {

		// turn off dropzone dragging
		if (app.Dropzone) app.Dropzone.disable();


		if ( this.canEdit ) 	{ this.D3container.classed('canEdit', true) }
		else 			{ this.D3container.classed('canEdit', false) }		
		
		this.listData = app.Users;

		if ( DATA ) this._D3list(DATA);

	},


	addItems : function (items) {

		if ( this.sortedData ) this.sortedData = null;
		this.refreshTable();

	},

	removeItems : function (items) {

		if ( this.sortedData ) this.sortedData = null;
		this.refreshTable();

	},

	// Save
	save : function (saveJSON) {

		var key   = saveJSON.key;
		var value = saveJSON.value ? saveJSON.value : ' ';
		var id    = saveJSON.id;

		var user = app.Users[id];
		user.setKey(key, value);

	},

	// OPTIONS FOR THE LIST
	getListOptions : function () {


		var listOptions = {

			fileInfo   : false,

			button     : {

					// when selecting item
					fn  : this.selectListItem,

					// array with stored selections
					arr : []

			},
			
			titleSpace : {

				name : {

					fn    : this.lastNameFunction,
					ev    : 'dblclick',
					field : 'lastName'
				},

				description : {
					fn    : this.firstNameFunction,
					html  : this.firstNameHtml,					
					ev    : 'dblclick',
					field : 'firstName'
				}

			},

			attributes : [

					// This one is only used for the header

					{ 	
						name 	 : 'lastName',	
						niceName : 'Name',
						fn       : null,
						ev       : null
					},					

					
					// These ones are used for attributes

					{ 	
						name 	    : 'access',
						niceName    : 'Access',
						fn          : this.accessFunction,
						ev          : 'click',
						html        : this.accessHtml,
						killOnSmall : false,
						width       : 15,
						smallWidth  : 20
					},


					{ 	
						name 	    : 'email',
						niceName    : 'Email',
						fn          : null,
						ev          : null,
						html        : this.emailHtml,
						killOnSmall : true,
						width       : 20
					},


					{ 	
						name 	    : 'phone',
						niceName    : 'Phone',
						fn          : this.phoneFunction,
						ev          : 'dblclick',
						html        : this.phoneHtml,
						killOnSmall : true,
						width       : 15
					},


					{ 	
						name 	    : 'position',
						niceName    : 'Position',
						html        : null,
						fn          : this.positionFunction,
						ev          : 'dblclick',
						html        : this.positionHtml,
						killOnSmall : false,
						width       : 12,
						smallWidth  : 20

					},	

					{ 	
						name 	    : 'company',
						niceName    : 'Company',
						fn          : this.companyFunction,
						ev          : 'dblclick',
						html        : this.companyHtml,
						killOnSmall : false,
						width       : 12,
						smallWidth  : 20
					},




			],

			// Fields we incorporate in searching
			searchFields : [

				'lastName',
				'firstName',
				'company',
				'position',
				'phone',
				'email',
				'access'

				]			

		}

		return listOptions;
	
	},


	// ┌─┐┌─┐┌┬┐┬┌─┐┌┐┌  ┌─┐┬ ┬┌┐┌┌─┐┌┬┐┬┌─┐┌┐┌┌─┐
	// ├─┤│   │ ││ ││││  ├┤ │ │││││   │ ││ ││││└─┐
	// ┴ ┴└─┘ ┴ ┴└─┘┘└┘  └  └─┘┘└┘└─┘ ┴ ┴└─┘┘└┘└─┘	

	// Functions that gets triggered on events in table cells

	lastNameFunction : function (DATA, d, context, outerContext) {

		if ( !outerContext.canEdit ) return;

		var options = {

			outerContext : outerContext,
			context      : context,
			what         : 'lastName',
			allDATA      : DATA,
			data 	     : d,
			where        : d.file.store,
			value        : d.file.store.lastName,
			uuid         : d.fileUuid

		}

		if ( this.sortedData ) options.allDATA = this.sortedData;

		outerContext.editField(options);

	},


	firstNameFunction : function (DATA, d, context, outerContext) {

		if ( !outerContext.canEdit ) return;

		var options = {

			outerContext : outerContext,
			context      : context,
			what         : 'firstName',
			allDATA      : DATA,
			data 	     : d,
			where        : d.file.store,
			value        : d.file.store.firstName,
			uuid         : d.fileUuid

		}

		if ( this.sortedData ) options.allDATA = this.sortedData;

		outerContext.editField(options);

	},



	companyFunction : function (DATA, d, context, outerContext) {

		if ( !outerContext.canEdit ) return;

		var options = {

			outerContext : outerContext,
			context      : context,
			what         : 'company',
			allDATA      : DATA,
			data 	     : d,
			where        : d.file.store,
			value        : d.file.store.company,
			uuid         : d.fileUuid

		}

		if ( this.sortedData ) options.allDATA = this.sortedData;

		outerContext.editField(options);

	},


	positionFunction : function (DATA, d, context, outerContext) {

		if ( !outerContext.canEdit ) return;

		var options = {

			outerContext : outerContext,
			context      : context,
			what         : 'position',
			allDATA      : DATA,
			data 	     : d,
			where        : d.file.store,
			value        : d.file.store.position,
			uuid         : d.fileUuid

		}

		if ( this.sortedData ) options.allDATA = this.sortedData;

		outerContext.editField(options);

	},

	phoneFunction : function (DATA, d, context, outerContext) {

		if ( !outerContext.canEdit ) return;

		var options = {

			outerContext : outerContext,
			context      : context,
			what         : 'phone',
			allDATA      : DATA,
			data 	     : d,
			where        : d.file.store,
			value        : d.file.store.phone,
			uuid         : d.fileUuid

		}

		if ( this.sortedData ) options.allDATA = this.sortedData;

		outerContext.editField(options);

	},

	accessFunction : function (DATA, d, context, outerContext) {

		if ( !outerContext.canEdit ) return;

		var userId = d.fileUuid;

		app.SidePane.Users.editAccess(userId);

	},	



	// ┬ ┬┌┬┐┌┬┐┬    ┌─┐┬ ┬┌┐┌┌─┐┌┬┐┬┌─┐┌┐┌┌─┐
	// ├─┤ │ ││││    ├┤ │ │││││   │ ││ ││││└─┐
	// ┴ ┴ ┴ ┴ ┴┴─┘  └  └─┘┘└┘└─┘ ┴ ┴└─┘┘└┘└─┘

	firstNameHtml : function (DATA) {

		return DATA.file.store.firstName;

	},

	companyHtml : function (DATA) {

		var company = DATA.file.store.company;

		if ( !company || company == '' || company == ' ' )  {
			return '<span class="grayed">Add company</span>';
		} else {
			return company;
		}

	},

	positionHtml : function (DATA) {

		var position = DATA.file.store.position;

		if ( !position || position == '' || position == ' ' )  {
			return '<span class="grayed">Add position</span>';
		} else {
			return position;
		}

	},

	phoneHtml : function (DATA) {

		var phone = DATA.file.store.phone;

		if ( !phone || phone == '' || phone == ' ' )  {
			return '<span class="grayed">Add phone number</span>';
		} else {
			return phone;
		}

	},	

	emailHtml : function (DATA) {

		return DATA.file.store.local.email;

	},

	accessHtml : function (DATA, context) {

		var allUsers = context.listData;

		for (f in allUsers) {
			if ( DATA.fileUuid == f ) {
				var user = allUsers[f];
			}
		};

		if ( !user ) return;

		var divProjectsOpen = '<div class="user-projects-button">';
		var divProjectsClose = '</div>';

		// get no of projets etc for user
		var projects = user.getProjects();
		var n = projects ? projects.length : 0;
		var projectsText = n == 1 ? n + ' project' : n + ' projects';
		if (n == 0) projectsText = 'Click to give access!';

		// set html
		var html = divProjectsOpen + projectsText + divProjectsClose;

		return html;


	},

	getUser : function (uuid) {

		var allUsers = this.listData;

		for (f in allUsers) {
			if ( uuid == f ) return allUsers[f];
		};		

	},


	// ┌─┐─┐ ┬┌┬┐┌─┐┬─┐┌┐┌┌─┐┬  
	// ├┤ ┌┴┬┘ │ ├┤ ├┬┘│││├─┤│  
	// └─┘┴ └─ ┴ └─┘┴└─┘└┘┴ ┴┴─┘	

	// These functions gets called from sidepane.users.js

	// Returns selected list items

	getSelected : function () {

		// get selected files
		var checks = [];

		var selectedListItems = this.listOptions.button.arr;

		var allUsers = this.listData;

		for (f in allUsers) {

			selectedListItems.forEach(function (selectedUser) {

				// Save if we have a match
				if ( selectedUser == f ) checks.push(allUsers[f]);

			});

		};

		// Return files
		return checks;

	},	


})
Wu.Access = Wu.Class.extend({

	initialize : function (options) {

		console.error('access');

		// shortcut
		app.access = this;

		// set store
		this.store = options;

		// set templates
		this.roles.templates = options.templates;

		// init admin roles
		this._superRole = new Wu.Role.Super({ 
			role : app.options.json.access.superRole
		});
		this._portalRole = new Wu.Role.Portal({
			role : app.options.json.access.portalRole
		});

	},


	addRoleMember : function (opts, callback) {
		console.error('access');
		var user = opts.user,
		    project = opts.project,
		    role = opts.role,
		    currentRole = app.access.get.role(opts), // get user's current role in project
		    currentRoleUuid = currentRole ? currentRole.getUuid() : false;

		var options = {
			userUuid : user.getUuid(),
			projectUuid : project.getUuid(),
			roleUuid : role.getUuid(),
			currentRoleUuid : currentRoleUuid
		}

		// send
		Wu.send('/api/access/setrolemember', options, function (err, json) {
			if (err) return callback(err);

			var result = Wu.parse(json);
			if (!result) return callback('Malformed response: ' + json);

			// return on no access
			if (result.error) return callback(result.error);

			// set locally
			project.setRolesStore(result.roles);

			// return
			callback(err, result);
		});

	},


	get : {

		// get role of user in project
		role : function (options) {
		console.error('access');
			var project = options.project,
			    user = options.user;

			// supers/portaladmins are not in projects, so must check here too
			if (app.access.is.superAdmin(user))  return app.access._superRole; 	
			if (app.access.is.portalAdmin(user)) return app.access._portalRole;

			// return project role(s)
			var found = _.find(project.getRoles(), function (role) {
				return role.hasMember(user);
			});
			return found;
		},


		availableRoles : function (options) {

		console.error('access');
			// if you're SUPERADMIN 	=> you can delegate all
			// if you're PORTALADMIN 	=> you can delegate READER, EDITOR, MANAGER, COLLABORATOR
			// if you're EDITOR 		=> can delegate READER, MANAGER, COLLABORATOR
			// if you're MANAGER 		=> you can delegate READER, MANAGER
			// if you're COLLABORATOR 	=> can't delegate
			// if you're READER 		=> can't delegate

			// --------------------------------------------

			// delegate_to_user = can delegate own capabilites to others

			// you can therefore delegate_to_user the role in which you have delegate_to_user permission


			// TODO:
			// get roles already created in project first!
			// then fill in with templates........

			var account = app.Account,
			    user = options.user,
			    project = options.project,
			    availRoles = [],
			    noAdmins = options.noAdmins;

			// get role of account for this project
			var role = app.access.get.role({
				user : account,
				project : project
			});

			// if doesn't have delegate_to_user, can't delegate any roles
			if (!role.getCapabilities().delegate_to_user) return [];

			// tricky part: get which roles account can delegate, based on capabilities in role
			var roles = app.access.filter.roles({
				role : role,
				project : project,
				noAdmins : noAdmins
			});

			return roles;

		},

		portalRole : function () {
		console.error('access');
			return app.options.json.access.portalRole;
		},

		superRole : function () {
		console.error('access');
			return app.options.json.access.superRole;
		},

	},


	filter : {

		roles : function (options) {
		console.error('access');
			// get roles which options.role can delegate to
			var role = options.role,
			    noAdmins = options.noAdmins,
			    project = options.project,
			    available = [];

			    // return project.getRoles();

			// iterate each project role
			_.each(project.getRoles(), function (projectRole) {
				var lacking = false;
				var caps = projectRole.getCapabilities();
				if (!caps) lacking = true;
				_.each(projectRole.getCapabilities(), function (cap, key) {
					if (cap) {
						if (!role.getCapabilities()[key]) lacking = true;
					}
				});

				// if not lacking any cap, add to available
				if (!lacking) available.push(projectRole);
			});
			return available;
		},
	},

	can : {
		// convenience method
		delegate : function (account, project) {
		console.error('access');
			return  app.access.has.project_capability(account, project, 'delegate_to_user') ||
	                	app.access.is.portalAdmin(account) ||
	                	app.access.is.superAdmin(account);
		},

	},

	as : {
		// convenience method
		admin : function (user, capability) {
		console.error('access');

			if (app.access.is.superAdmin(user)) {
				var capabilities = app.access.get.superRole().capabilities;
				if (capabilities[capability]) return true;
			}

			// check if user is in portal/super roles
			if (app.access.is.portalAdmin(user)) {
				var capabilities = app.access.get.portalRole().capabilities;
				if (capabilities[capability]) return true;
			}

			return false;
		},
	},

	has : {

		project_capability : function (user, project, capability) {
		console.error('access');
			if (!user || !project) return;

			var user = user || app.Account,
			    roles = project.getRoles(),
			    permission = false;


			_.each(roles, function (role) {
				if (role.hasMember(user)) {
					if (role.hasCapability(capability)) permission = true;
				}
			});
			return permission;
		},

		capability : function (user, capability) {

		console.error('access');
			var roles = user.getRoles();
			var p = false;


			_.each(roles, function (role) {

				if (role.hasMember(user)) {
					if (role.hasCapability(capability)) {
						p = true;
					}
				}

			});

			return p;
		},

	},

	is : {

		contained : function (array, item) { 	// replace with _.contains(array, item)
		console.error('access');
			return array.indexOf(item) > 0;
		},

		admin : function (user) {
		console.error('access');
			var user = user || app.Account;
			var portaladmin = app.access.is.portalAdmin(user);
			var superadmin = app.access.is.superAdmin(user);
			return portaladmin || superadmin;
		},

		portalAdmin : function (user) {
		console.error('access');
			var user = user || app.Account;
			return app.access._portalRole.hasMember(user);
		},

		superAdmin : function (user) {
		console.error('access');
			var user = user || app.Account;
			return app.access._superRole.hasMember(user);
		},
	},

	// must be kept identical with api.access.js
	to : {

		// create_client : function (user) { 
		// 	var user = user || app.Account;
		// 	if (app.access.as.admin(user, 'create_client')) return true;
		// 	if (app.access.has.capability(user, 'create_client')) return true;
			
		// 	return false;
		// },
		
		// edit_client : function (client, user) { 
		// 	var user = user || app.Account;
		// 	if (app.access.as.admin(user, 'edit_client')) return true;
		// 	return false;
		// },
		
		// edit_other_client : function (client, user) { 
		// 	var user = user || app.Account;
		// 	if (app.access.as.admin(user, 'edit_other_client')) return true;
		// 	return false;
		// },
		
		// delete_client		: function (client, user) { 
		// 	var user = user || app.Account;
		// 	if (app.access.as.admin(user, 'delete_client')) return true;
		// 	return false;
		// },
		
		// delete_other_client  	: function (client, user) { 
		// 	var user = user || app.Account;
		// 	if (app.access.as.admin(user, 'delete_other_client')) return true;
		// 	return false;
		// },
		
		// read_client		: function (client, user) { 
		// 	var user = user || app.Account;
		// 	if (app.access.as.admin(user, 'read_client')) return true;
		// 	return false;
		// },
		
		// who else can create projects? students! 
		create_project 		: function (user) { 
			console.error('access');
			var user = user || app.Account;
			if (app.access.as.admin(user, 'create_project')) return true;
			if (app.access.has.capability(user, 'create_project')) return true;
			return false;
		},
		
		edit_project 		: function (project, user) { 
			console.error('access');
			var user = user || app.Account;
			if (app.access.as.admin(user, 'edit_project')) return true;
			if (app.access.has.project_capability(user, project, 'edit_project')) return true;
			return false;
		},
		
		edit_other_project 	: function (project, user) { 
			console.error('access');
			var user = user || app.Account;
			if (app.access.as.admin(user, 'edit_other_project')) return true;
			return false;
		},
		
		delete_project		: function (project, user) { 
			console.error('access');
			var user = user || app.Account;
			if (app.access.as.admin(user, 'delete_project')) return true;
			if (app.access.has.project_capability(user, project, 'delete_project')) return true;
			return false;
		},
		
		delete_other_project	: function (project, user) { 
			console.error('access');
			var user = user || app.Account;
			if (app.access.as.admin(user, 'delete_other_project')) return true;
		},
		
		read_project		: function (project, user) { 
			console.error('access');
			var user = user || app.Account;
			if (app.access.has.project_capability(user, project, 'read_project')) return true;
			return false;
		},
		
		upload_file 		: function (project, user) { 
			console.error('access');
			var user = user || app.Account;
			if (app.access.as.admin(user, 'upload_file')) return true;
			if (app.access.has.project_capability(user, project, 'upload_file')) return true;
			return false;
		},
		
		download_file 		: function (project, user) { 
			console.error('access');
			var user = user || app.Account;
			if (app.access.as.admin(user, 'download_file')) return true;
			if (app.access.has.project_capability(user, project, 'download_file')) return true;
			return false;
		},

		// todo: edit_file, edit_other_file
		
		create_version 		: function (project, user) { 
			console.error('access');
			var user = user || app.Account;
			if (app.access.as.admin(user, 'create_version')) return true;
			if (app.access.has.project_capability(user, project, 'create_version')) return true;
			return false;
		},
		
		delete_version 		: function (project, user) { 
			console.error('access');
			var user = user || app.Account;
			if (app.access.as.admin(user, 'delete_version')) return true;
			if (app.access.has.project_capability(user, project, 'delete_version')) return true;
			return false;
		},

		delete_other_version    : function (project, user) {
			console.error('access');
			var user = user || app.Account;
			if (app.access.as.admin(user, 'delete_other_version')) return true;
			return false;
		},
		
		delete_file 		: function (project, user) { 
			console.error('access');
			var user = user || app.Account;
			if (app.access.as.admin(user, 'delete_file')) return true;
			if (app.access.has.project_capability(user, project, 'delete_file')) return true;
			return false;
		},
		
		delete_other_file 	: function (project, user) { 
			console.error('access');
			var user = user || app.Account;
			if (app.access.as.admin(user, 'delete_other_file')) return true;
			return false;
		},
		
		create_user		: function (project, user) { 
			console.error('access');
			var user = user || app.Account;
			if (app.access.as.admin(user, 'create_user')) return true;
			if (app.access.has.project_capability(user, project, 'create_user')) return true;
			return false;
		},
		
		edit_user 		: function (project, user) { 
			console.error('access');
			var user = user || app.Account;
			if (app.access.as.admin(user, 'edit_user')) return true;
			if (!project) return false;
			if (app.access.has.project_capability(user, project, 'edit_user')) return true;
			return false;
		},
		
		edit_other_user 	: function (user) { 
			console.error('access');
			var user = user || app.Account;
			if (app.access.as.admin(user, 'edit_other_user')) return true;
			return false;
		},
		
		delete_user		: function (user) { 
			console.error('access');
			var user = user || app.Account;
			if (app.access.as.admin(user, 'delete_user')) return true;
			return false;
		},
		
		delete_other_user 	: function (user) { 
			console.error('access');
			var user = user || app.Account;
			if (app.access.as.admin(user, 'delete_user')) return true;
			return false;
		},
		
		share_project		: function (project, user) { 
			console.error('access');
			var user = user || app.Account;
			if (app.access.as.admin(user, 'share_project')) return true;
			if (app.access.has.project_capability(user, project, 'share_project')) return true;
			return false;
		},
		
		read_analytics 		: function (user) { 
			console.error('access');
			var user = user || app.Account;
			if (app.access.as.admin(user, 'edit_user')) return true;
			return false;
		},
		
		manage_analytics 	: function (user) { 
			console.error('access');
			var user = user || app.Account;
			if (app.access.as.admin(user, 'edit_user')) return true;
			return false;
		},
		
		delegate_to_user 	: function (project, user) { 
			console.error('access');
			var user = user || app.Account;
			if (app.access.as.admin(user, 'delegate_to_user')) return true;
			if (app.access.has.project_capability(user, project, 'delegate_to_user')) return true;
			return false;
		},
	},

	roles : {

		templates : {} // get from server		
	}
});
// ******************* //
// * CUSTOM GA STUFF * //
// ******************* //

// General overview
// https://developers.google.com/analytics/devguides/collection/analyticsjs/

// Field references:
// https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference

// About custom dimensions
// https://developers.google.com/analytics/devguides/platform/customdimsmets

// Analytics API explorer:
// http://developers.google.com/apis-explorer/?hl=en_US#p/analytics/v3/analytics.data.ga.get 
// (unique ID for maps.systemapic.com => 98026334)

// Må ingorere IP adressen til phantom på i GA... 
// http://web-design-weekly.com/snippets/exclude-ip-address-from-google-analytics/


// ****************************** //
// * CUSTOM DIMENSIONS OVERVIEW * //
// ****************************** //

// dimension1  = Project ID (Hit)
// dimension2  = Username (Session)
// dimension3  = Software version (Session)
// dimension4  = Client ID (Hit)
// dimension5  = User ID (Session)
// dimension6  = Project Name (Hit)
// dimension7  = Client Name (Hit)
// dimension8  = New Project ID (Hit)
// dimension9  = Deleted Project (Name)
// dimension10 = New User (ID)
// dimension11 = New User (Name)
// dimension12 = Delted User (Name)
// dimension13 = User IP (Session)



Wu.Analytics = Wu.Class.extend({

	initialize : function () {

		// this.initGoogle();
		this._listen();
	},


	_listen : function () {

		Wu.Mixin.Events.on('projectSelected', this._projectSelected, this);
		Wu.Mixin.Events.on('editEnabled',     this._editEnabled, this);
		Wu.Mixin.Events.on('editDisabled',    this._editDisabled, this);
		Wu.Mixin.Events.on('layerEnabled',    this._layerEnabled, this);
		Wu.Mixin.Events.on('layerDisabled',   this._layerDisabled, this);
		Wu.Mixin.Events.on('layerSelected',   this._layerSelected, this);
		Wu.Mixin.Events.on('layerAdded',      this._onLayerAdded, this);
		Wu.Mixin.Events.on('layerEdited',     this._onLayerEdited, this);
		Wu.Mixin.Events.on('layerStyleEdited',this._onLayerStyleEdited, this);
		Wu.Mixin.Events.on('layerDeleted',    this._onLayerDeleted, this);
		Wu.Mixin.Events.on('fileImported',    this._onFileImported, this);
		Wu.Mixin.Events.on('fileDeleted',     this._onFileDeleted, this);

		// map events
		if (app._map) {
			app._map.on('zoomstart', this._onZoomStart);
			app._map.on('zoomend', this._onZoomEnd);
		}

		// on browser close
		window.addEventListener("unload", this._onUnload);
	},

	// dummies
	_editEnabled 	 : function () {},
	_editDisabled 	 : function () {},
	_layerEnabled 	 : function () {},
	_layerDisabled 	 : function () {},
	_updateView 	 : function () {},
	_refresh 	 : function () {},
	_onFileImported  : function () {},
	_onFileDeleted   : function () {},
	_onLayerAdded    : function () {},
	_onLayerEdited   : function () {},
	_onLayerStyleEdited   : function () {},
	_onLayerDeleted  : function () {},
	
	_onUnload : function () {

		app.Socket.sendUserEvent({
		    	user : app.Account.getFullName(),
		    	event : 'exited.',
		    	description : '',
		    	timestamp : Date.now()
		})
	},

	_onZoomStart : function () {
		var map = app._map;
		app._eventZoom = map.getZoom();
	},

	_onZoomEnd : function () {
		var map = app._map;
		var zoom = map.getZoom();

		// slack
		app.Socket.sendUserEvent({
		    	user : app.Account.getFullName(),
		    	event : 'zoomed',
		    	description : 'from `' + app._eventZoom + ' to ' + zoom + '` ',
		    	timestamp : Date.now()
		})
	},

	_getPointKeys : function () {
		return ['gid', 'vel', 'mvel', 'coherence'];
	},


	onInvite : function (options) {

		var project_name = options.project_name,
		    permissions = options.permissions;

		// slack
		app.Socket.sendUserEvent({
		    	user : app.Account.getFullName(),
		    	event : 'invited to project',
		    	description : project_name + ' `(' + permissions.join(', ') + ')`',
		    	timestamp : Date.now()
		})
	},

	onScreenshot : function (options) {

		var project_name = options.project_name,
		    file_id = options.file_id;

		// slack
		app.Socket.sendUserEvent({
		    	user : app.Account.getFullName(),
		    	event : 'took a `screenshot` of project',
		    	description : project_name,
		    	timestamp : Date.now(),
		    	options : {
		    		screenshot : true,
		    		file_id : file_id
		    	}
		})
	},

	onAttributionClick : function () {
		// slack
		app.Socket.sendUserEvent({
		    	user : app.Account.getFullName(),
		    	event : 'clicked',
		    	description : 'Systemapic logo',
		    	timestamp : Date.now(),
		})
	},

	onPolygonQuery : function (options) {

		var data = options.result;

		var total_points = data.total_points;

		var area = data.area;
		if (area > 1000000) {
			area = 'approx. ' + parseInt(area / 1000000) + ' km2';
		} else {
			area = 'approx. ' + parseInt(area) + ' m2';
		}

		var description = 'on ' + options.layer_name; // + '`(total_points: ' + options.total_points + ')`',

		// total points
		description += '\n     `total points: ' + total_points + '` ';
		description += '\n     `area: ' + area + '` ';
		
		// add description for keys
		var keys = this._getPointKeys();
		keys.forEach(function (key) {
			if (data.average[key]) {
				description += '\n     `' + key + ': ' + data.average[key] + '` ';
			}
		});

		// slack
		app.Socket.sendUserEvent({
		    	user : app.Account.getFullName(),
		    	event : 'queried polygon',
		    	description : description,
		    	timestamp : Date.now()
		})
	},


	onEnabledRegression : function () {

		// slack
		app.Socket.sendUserEvent({
		    	user : app.Account.getFullName(),
		    	event : 'viewed regression',
		    	description : '',
		    	timestamp : Date.now()
		})

	},

	_eventLayerLoaded : function (options) {
		// slack
		app.Socket.sendUserEvent({
		    	user : app.Account.getFullName(),
		    	event : 'watched',
		    	description : 'layer load for `' + options.load_time + 'ms`',
		    	timestamp : Date.now()
		})
	},

	onPointQuery : function (data) {

		// get latlngs
		var prevLatlng = app._prevLatlng;
		var latlng = data.latlng.toString()
		
		// remember prev latlng
		app._prevLatlng = data.latlng;

		// get keys
		var keys = this._getPointKeys();

		// description
		var description = '`at ' + latlng + '` ';
		description +='\n     on ' + data.layer.getTitle() + '.' 
		
		// add description for keys
		keys.forEach(function (key) {
			if (data.data[key]) {
				description += '\n     `' + key + ': ' + data.data[key] + '` ';
			}
		});
		
		// add distance from previous query
		if (prevLatlng) description += '\n      Distance from last query: `' + parseInt(data.latlng.distanceTo(prevLatlng)) + 'meters`';

		// slack
		app.Socket.sendUserEvent({
		    	user : app.Account.getFullName(),
		    	event : 'queried point',
		    	description : description,
		    	timestamp : Date.now()
		})
	},

	_layerSelected 	 : function (e) {
		var layer = e.detail.layer;
		if (!layer) return;

		// slack
		app.Socket.sendUserEvent({
		    	user : app.Account.getFullName(),
		    	event : 'selected',
		    	description : '`layer` ' + layer.getTitle(),
		    	timestamp : Date.now()
		})

	},

	_projectSelected : function (e) {

		// set project
		this._project = app.Projects[e.detail.projectUuid];

		// stats
		this.setGaPageview(e.detail.projectUuid);

		var projectName = this._project ? '`project` ' + this._project.getName() : 'no project.'
		
		// slack
		app.Socket.sendUserEvent({
		    	user : app.Account.getFullName(),
		    	event : 'selected',
		    	description : projectName,
		    	timestamp : Date.now()
		})
	},	

	// send to server
	set : function (options) {
		
		// send to server. JSON.stringify not needed for options object.
		Wu.send('/api/analytics/set', options, function (err, result) {
			if (err) console.log('GA error:', err, result);			
		});

	},

	get : function (options) {

		// send to server. JSON.stringify not needed for options object.
		Wu.send('/api/analytics/get', options, function (err, result) {
		});
	},



	// pageview
	setGaPageview : function (uuid) {
		if (app._isPhantom) return;

		// return if no project (ie. after delete)
		if (!app.activeProject) return;

		// Set active project:
		// If we have a UUID, use it
		// if not, use current active project
		var activeProject = uuid ? app.Projects[uuid] : app.activeProject;

		// If uuid has been passed, used it
		// if not, find active project uuid
		var _uuid = uuid ? uuid : app.activeProject.getUuid();

		// Get parameters to pass to Google Analytics
		var projectSlug 	= activeProject.getSlug();
		// var projectClient 	= activeProject.getClient();
		// var clientSlug 		= projectClient.getSlug();
		// var clientID 		= activeProject.getClientUuid();
		var projectName 	= activeProject.getName();
		// var clientName		= projectClient.getName();
	    	var projectName 	= activeProject.getName();
		var hostname 		= app.options.servers.portal;
		var projectSlug 	= activeProject.getSlug();
		// var pageUrl 		= '/' + clientSlug + '/' + projectSlug;
		var pageUrl 		= '/' + projectSlug;

		// USER
		var userID		= app.Account.getUuid();

		// Get user full name	
		var dimension2Value	= app.Account.getFullName();

		// Get Systemapic version
		var version 		= Wu.version;

		// Pageview OPTIONS for Google Analytics
		var gaPageview = {

			hostname    : hostname,
			page 	    : pageUrl,
			title 	    : projectName,
			dimension1  : _uuid, 		// Project ID
			// dimension4  : clientID,		// Client ID
			dimension6  : projectName,	// Project name
			// dimension7  : clientName,	// Client name
			dimension2  : dimension2Value,	// User full name
			version     : version		// Systemapic version

		}

		// Contains tracking id and client id (for user)
		var userHeader = this.gaHeader()		

		var trackThis = {
			
			userHeader  : userHeader,
			gaEvent     : false,
			gaPageview  : gaPageview

		}

		// SEND TO SERVER
		// SEND TO SERVER
		// SEND TO SERVER

		this.set(JSON.stringify(trackThis));


		// Clean up
		trackThis = null;
		gaPageview = null;
		userHeader = null;


	},

	// event
	setGaEvent : function (trackArray) {


		var gaEvent = {}		

		// GET EVENT PARAMETERS
		// GET EVENT PARAMETERS
		// GET EVENT PARAMETERS

		// CATEGORY ( STRING – REQUIRED )
		if ( trackArray[0] ) gaEvent.eventCategory = trackArray[0];

		// ACTION ( STRING – REQUIRED )
		if ( trackArray[1] ) gaEvent.eventAction = trackArray[1];

		// LABEL ( STRING – OPTIONAL )
		if ( trackArray[2] ) gaEvent.eventLabel = trackArray[2];

		// VALUE ( NUMBER – OPTIONAL )
		if ( trackArray[3] ) gaEvent.eventValue = trackArray[3];		

		// CURRENT PROJECT PATH
		if ( app.activeProject ) {
			// if (app.activeProject._client === undefined || app.activeProject === undefined ) return;
			// var clientSlug  = app.activeProject._client.getSlug();
			var projectSlug = app.activeProject.getSlug()
			// var pageUrl 	= '/' + clientSlug + '/' + projectSlug;
			var pageUrl = '/' + projectSlug;
			gaEvent.path = pageUrl;
		} else {
			gaEvent.path = '/';
		}

		// GET UNIVERSAL HEADER FOR USER
		var userHeader = this.gaHeader()		

		var trackThis = {
			
			userHeader  : userHeader,
			gaEvent     : gaEvent,
			gaPageview  : false

		}

		// SEND TO SERVER
		// SEND TO SERVER
		// SEND TO SERVER

		this.set(JSON.stringify(trackThis));
		
		// mem leak?
		gaSendObject = null;
		trackArray = null;
		userHeader = null;
		trackThis = null;
	},


	// UNIVERSAL FOR ALL GA PUT REQUESTS
	gaHeader : function() {

		if (!app.Account) return;

		// USER
		var userID = app.Account.getUuid();
		if (!userID) return;		

		// Header for GA
		var userHeader = {

			trackingID : Wu.app.options.ga.id,
			clientID   : userID,			// This might have to be session specific

		};


		return userHeader;

	}

});




Wu.satteliteAngle = Wu.Class.extend({

	initialize : function (options) {

		this.options = options;
		this.container = this.options.appendTo;

		this.initContent();

	},


	initContent : function () {

		this.color = '#019688';

		this._innerContainer = Wu.DomUtil.create('div', 'd3-satellite-wrapper displayNone', this.container);
		this._header = Wu.DomUtil.create('div', 'satellite-measurement-geometry', this._innerContainer, 'Measurement geometry');

	},

	update : function (options) {

		var angle = options.angle ? options.angle : false;
		var path  = options.path ? options.path : false;

		if ( !angle && !path ) {
			this.closed = true;
			Wu.DomUtil.addClass(this._innerContainer, 'displayNone');
		} else {
			this.closed = false;
			Wu.DomUtil.removeClass(this._innerContainer, 'displayNone');
		}

		this.initAngle(parseInt(angle));
		this.initCompass(parseInt(path));
	},

	initAngle : function (angle) {		

		if ( !angle ) return;
		if ( this.angleContainer ) {
			this.angleContainer.innerHTML = '';			
			this.angleContainer.remove();
		}
		this.angleContainer = Wu.DomUtil.createId('div', 'd3-satellite-angle-container', this._innerContainer);

		var size = 0.55,
		    padding = 10,
		    width = 45,
		    height = 75,
		    flip = angle < 0 ? true : false;


		var D3angle = d3.select(this.angleContainer)
				.append("svg")
                              	.attr("width", (width + padding*2) * size)
                              	.attr("height", (height * size) + padding);

                var yLine = D3angle
				.append("line")
				.attr("x1", function () {
					if ( flip ) return (width + padding) * size;
						    return padding * size;
				})
				.attr("y1", padding * size)
				.attr("x2", function () {
					if ( flip ) return (width + padding) * size;
						    return padding * size;
				})
				.attr("y2", (height - padding) * size)
				// Styling
				.attr("stroke-width", 1)
				.attr("stroke", "#999");

                var xLine = D3angle
				.append("line")
				.attr("x1", padding * size)
				.attr("y1", (height - padding - 1) * size)
				.attr("x2", (width + padding) * size)
				.attr("y2", (height - padding - 1) * size)
				// Styling
				.attr("stroke-width", 1)
				.attr("stroke", "#999");				


                var angleLine = D3angle
				.append("line")
				.classed('angle-line', true)
				.attr("x1", function () {
					if ( flip ) return (width + padding) * size;
						    return padding * size;					
				})
				.attr("y1", padding * size)
				.attr("x2", function () {
					if ( flip ) return ((width + padding) + angle) * size;
						    return (angle + padding) * size;
				})
				.attr("y2", (height - padding - 1) * size)
				// styling
				.attr('stroke-width', 2)
				.attr('stroke', this.color)


		var startCircle = D3angle
				.append("circle")
				.attr('cx', function () {
					if ( flip ) return (width + padding) * size;
						    return padding * size;					
				})
				.attr('cy', padding * size)
				.attr('r', 3)
				// styling
				.attr('fill', '#FFF')
				.attr('stroke-width', 2)
				.attr('stroke', this.color);


		// Angle
		var text = D3angle
				.append('text')
				.attr('x', ((width/2)+padding) * size)
				.attr('y', (height+15) * size)
				.attr('font-family', 'sans-serif')
				.attr('font-size', '10px')
				.attr('font-weight', 900)
				.attr('fill', '#999')
				.attr("text-anchor", "middle")
				.text(function() {
					if ( flip ) return  (-angle) + '°';
						    return  angle + '°'
				});


	},


	initCompass : function (path) {		

		if ( !path ) return;
		if ( this.compassContainer ) {
			this.compassContainer.innerHTML = '';
			this.compassContainer.remove();
		}
		this.compassContainer = Wu.DomUtil.createId('div', 'd3-satellite-angle-container', this._innerContainer);

		var size = 0.75,
		    padding = 10,
		    width = 65,
		    height = 65;		

		var D3container = d3.select(this.compassContainer)
				.append("svg")
                              	.attr("width", width * size)
                              	.attr("height", (height * size) + padding);


                // North
		var N = D3container
				.append('text')
				.attr('x', width/2 * size)
				.attr('y', (padding + 2 ) * size)
				.attr('font-family', 'sans-serif')
				.attr('font-size', (10 * size) + 'px')
				.attr('fill', '#999')
				.attr("text-anchor", "middle")
				.text('N');

		// South
		var S = D3container
				.append('text')
				.attr('x', width/2 * size)
				.attr('y', (height - 5) * size) 
				.attr('font-family', 'sans-serif')
				.attr('font-size', (10 * size) + 'px')
				.attr('fill', '#999')
				.attr("text-anchor", "middle")
				.text('S');

		// West
		var W = D3container
				.append('text')
				.attr('x', (padding - 2) * size)
				.attr('y', (height/2 + 3) * size) 
				.attr('font-family', 'sans-serif')
				.attr('font-size', (10 * size) + 'px')
				.attr('fill', '#999')
				.attr("text-anchor", "middle")
				.text('W');

		// East
		var E = D3container
				.append('text')
				.attr('x', (width - 9) * size)
				.attr('y', (height/2 + 3) * size) 
				.attr('font-family', 'sans-serif')
				.attr('font-size', (10 * size) + 'px')
				.attr('fill', '#999')
				.attr("text-anchor", "middle")
				.text('E');


                // East-West line
		var ewLine = D3container
				.append('line')
				.attr("x1", (padding + 5) * size)
				.attr("y1", (height/2 * size))
				.attr("x2", ((width-15) * size))
				.attr("y2", (height/2 * size))
				// style
				.attr('stroke-width', 1)
				.attr('stroke', '#ccc');


		// North-South line
		var nsLine = D3container
				.append('line')
				.attr("x1", (width/2 * size))
				.attr("y1", (padding + 5) * size)
				.attr("x2", (width/2 * size))
				.attr("y2", ((height-15) * size))
				// style
				.attr('stroke-width', 1)
				.attr('stroke', '#ccc');

		// Compass circle frame
                var circle = D3container
				.append("circle")
				.attr('cx', (width/2 * size))
				.attr('cy', (height/2 * size))
				.attr('r', (width/2 - 15) * size)
				// style
				.attr('fill', 'transparent')
				.attr('stroke-width', 1)
				.attr('stroke', '#999');


		// Line container
		var lineContainer = D3container
				.append('g')
				.attr('transform', function() {
					return 'rotate(' + path + ', ' + (width/2 * size) + ',' + (height/2 * size) + ')';
				})


		// Path line
                var line = lineContainer
				.append("line")
				.classed('angle-line', true)
				.attr('fill', 'white')
				.attr("x1", (width/2 * size))
				.attr("y1", padding * size)
				.attr("x2", (width/2 * size))
				.attr("y2", ((height-10) * size))
				// style
				.attr('stroke-width', 2)
				.attr('stroke', this.color)


		// Arrow head
		var triangle = lineContainer
				.append("path")
				.attr("d", function() {
					var _startX = width/2;
					var _startY = padding - 5;
					var M = "M" + (_startX*size) + ',' + (_startY*size);
					var L1 = "L" + ((_startX + 4)*size) + ',' + ((_startY + 6)*size);
					var L2 = "L" + ((_startX - 4)*size) + ',' + ((_startY + 6)*size);
					return M + L1 + L2 + 'Z';
				})
				// style
				.attr('stroke-width', 0)
				.attr('stroke', 'none')
				.attr('fill', this.color)		


                var innerCircle = D3container
				.append("circle")
				.classed('inner-circle', true)
				.attr('cx', (width/2 * size))
				.attr('cy', (height/2 * size))
				.attr('r', 3)
				// style
				.attr('fill', '#FFF')
				.attr('stroke-width', 2)
				.attr('stroke', this.color)



		// Degree
		var degreePath = D3container
				.append('text')
				.attr('x', width/2 * size)
				.attr('y', (height+10) * size)
				// style
				.attr('font-family', 'sans-serif')
				.attr('font-size', '10px')
				.attr('font-weight', 900)
				.attr('fill', '#999')
				.attr("text-anchor", "middle")
				.text(path + '°');

								

	},	



});
Wu.button = Wu.Class.extend({

	initialize : function (options) {

		this.options = options;

		if ( options.type == 'switch' )     this.initSwitch();
		if ( options.type == 'set' ) 	    this.initSet();
		if ( options.type == 'setclear' )   this.initSetClear();
		if ( options.type == 'radio' )	    this.initRadio();
		if ( options.type == 'miniInput' )  this.initMiniInput();
		if ( options.type == 'dropdown')    this.initMiniDropDown();
		if ( options.type == 'colorball')   this.initColorBall();
		if ( options.type == 'colorrange')  this.initColorRange();
		if ( options.type == 'dualinput')   this.initDualInput();
		if ( options.type == 'toggle')      this.initToggleButton();
		if ( options.type == 'clicker')     this.initClicker();

	},

	
	// ┌┬┐┬ ┬┌─┐┬    ┬┌┐┌┌─┐┬ ┬┌┬┐
	//  │││ │├─┤│    ││││├─┘│ │ │ 
	// ─┴┘└─┘┴ ┴┴─┘  ┴┘└┘┴  └─┘ ┴ 

	initDualInput : function () {

		var appendTo    = this.options.appendTo,
		    key         = this.options.id,
		    right       = this.options.right,
		    value       = this.options.value,
		    minmax 	= this.options.minmax,
		    tabindex    = this.options.tabindex
		    className   = this.options.className,
		    fn          = this.options.fn;


		var prefix = 'chrome-field-mini-input mini-input-dual ';
		if ( className ) prefix += className;



		// create max input
		var miniInputMax = Wu.DomUtil.createId('input', 'field_mini_input_max_' + key, appendTo);
		miniInputMax.className = prefix;
		miniInputMax.setAttribute('placeholder', 'auto');
		miniInputMax.setAttribute('tabindex', tabindex[1]);
		if (minmax) miniInputMax.setAttribute('placeholder', minmax[1]);
		if (value) miniInputMax.value = value[1];

		// set blur save event
		Wu.DomEvent.on(miniInputMax, 'blur', function () { 
			this.saveDualBlur(miniInputMax, miniInputMin, minmax[1], minmax[0], this.options);  // todo: mem leak
		}.bind(this), this);

		// Force numeric
		miniInputMax.onkeypress = this.forceNumeric;
		
		// remember
		this.max = miniInputMax;



		// create min input
		var miniInputMin = Wu.DomUtil.createId('input', 'field_mini_input_min_' + key, appendTo);
		miniInputMin.className = 'chrome-field-mini-input mini-input-dual';
		miniInputMin.setAttribute('placeholder', 'auto');
		miniInputMin.setAttribute('tabindex', tabindex[0]);
		if (minmax) miniInputMin.setAttribute('placeholder', minmax[0]);
		if (value) miniInputMin.value = value[0];

		// set blur save event
		Wu.DomEvent.on(miniInputMin, 'blur', function () { 
			this.saveDualBlur(miniInputMax, miniInputMin, minmax[1], minmax[0], this.options);  	// todo: mem leak
		}.bind(this), this);

		// Force numeric
		miniInputMin.onkeypress = this.forceNumeric;

		// remember
		this.min = miniInputMin;

	},

	saveDualBlur : function (maxElem, minElem, absoluteMax, absoluteMin, options) {
		var fn      = options.fn,
		    key     = options.key;

		fn(maxElem.value, minElem.value, absoluteMax, absoluteMin)
	},


	// ┌─┐┌─┐┬  ┌─┐┬─┐  ┬─┐┌─┐┌┐┌┌─┐┌─┐
	// │  │ ││  │ │├┬┘  ├┬┘├─┤││││ ┬├┤ 
	// └─┘└─┘┴─┘└─┘┴└─  ┴└─┴ ┴┘└┘└─┘└─┘

	initColorRange : function () {

		var appendTo    = this.options.appendTo,
		    key         = this.options.id,
		    right       = this.options.right,
		    value       = this.options.value,
		    presetFn    = this.options.presetFn,
		    className   = this.options.className,
		    customFn    = this.options.customFn;

		// Set styling
		var gradientStyle = this._gradientStyle(value);

		var _class = 'chrome-color-range-wrapper ';
		if ( className ) _class += className;

		var colorRangeWrapper = Wu.DomUtil.create('div', _class, appendTo)
		    colorRangeWrapper.setAttribute('key', key);


		var color = Wu.DomUtil.create('div', 'chrome-color-range', colorRangeWrapper);
		color.id = 'chrome-color-range_' + key;
		color.setAttribute('key', key);
		color.setAttribute('style', gradientStyle);

		// rememeber
		this._color = color;



		var clickCatcher = Wu.DomUtil.create('div', 'click-catcher displayNone', appendTo);
		clickCatcher.id = 'click-catcher-' + key;
		clickCatcher.setAttribute('key', key);

		// remember
		this._clicker = clickCatcher;





		var colorSelectorWrapper = Wu.DomUtil.create('div', 'chrome-color-selector-wrapper displayNone', colorRangeWrapper);
		colorSelectorWrapper.id = 'chrome-color-selector-wrapper-' + key;

		// remember;
		this._colorSelectorWrapper = colorSelectorWrapper;





		var colorBallWrapper = Wu.DomUtil.create('div', 'chrome-color-ball-wrapper', colorSelectorWrapper)

		var colorBall_3 = Wu.DomUtil.create('div', 'chrome-color-ball color-range-ball rangeball-3', colorBallWrapper);
		colorBall_3.id = 'color-range-ball-3-' + key;
		colorBall_3.style.background = value[4];
		colorBall_3.setAttribute('hex', value[4]);

		// remember
		this._colorball3 = colorBall_3;
		    


		var colorBall_2 = Wu.DomUtil.create('div', 'chrome-color-ball color-range-ball rangeball-2', colorBallWrapper);
		colorBall_2.id = 'color-range-ball-2-' + key;
		colorBall_2.style.background = value[2];
		colorBall_2.setAttribute('hex', value[2]);

		// remember
		this._colorball2 = colorBall_2;


		var colorBall_1 = Wu.DomUtil.create('div', 'chrome-color-ball color-range-ball rangeball-1', colorBallWrapper);
		colorBall_1.id = 'color-range-ball-1-' + key;
		colorBall_1.style.background = value[0];
		colorBall_1.setAttribute('hex', value[0]);

		// remember
		this._colorball1 = colorBall_1;


		this.initSpectrum(this, value[0], colorBall_1, key, customFn);
		this.initSpectrum(this, value[2], colorBall_2, key, customFn);
		this.initSpectrum(this, value[4], colorBall_3, key, customFn);


		// Color range presets
		// Color range presets
		// Color range presets

		var colorRangePresetWrapper = Wu.DomUtil.create('div', 'color-range-preset-wrapper', colorSelectorWrapper);

		// colorbrewer2.org
		var colorRangesPresets = this.options.colors;

		// remember presets
		this._presets = [];

		colorRangesPresets.forEach(function(preset, i) {

			var gradientStyle = this._gradientStyle(preset);
			var colorRangePreset = Wu.DomUtil.create('div', 'color-range-preset', colorRangePresetWrapper);
			colorRangePreset.id = 'color-range-preset-' + i;
			colorRangePreset.setAttribute('style', gradientStyle);
			colorRangePreset.setAttribute('hex', preset.join(','));

			this._presets.push(colorRangePreset);

			Wu.DomEvent.on(colorRangePreset, 'click', presetFn);

		}.bind(this))

		// select color on range
		Wu.DomEvent.on(color, 'click', function (e) {
			Wu.DomUtil.removeClass(colorSelectorWrapper, 'displayNone');
			Wu.DomUtil.removeClass(clickCatcher, 'displayNone');

		}, this);

		Wu.DomEvent.on(clickCatcher, 'click', function (e) {
			Wu.DomUtil.addClass(colorSelectorWrapper, 'displayNone');
			Wu.DomUtil.addClass(clickCatcher, 'displayNone');

		}, this);


		// Wu.DomEvent.on(clickCatcher, 'click', this.stopEditingColorRange, this);

	},

	toggleColorRange : function (e) {
	        
		var key = e.target.getAttribute('key');

		var rangeSelector = Wu.DomUtil.get('chrome-color-selector-wrapper-' + key);
		var clickCatcher = Wu.DomUtil.get('click-catcher-' + key);

		Wu.DomUtil.removeClass(rangeSelector, 'displayNone');
		Wu.DomUtil.removeClass(clickCatcher, 'displayNone');

	},

	stopEditingColorRange : function (e) {

		var key = e.target.getAttribute('key');

		var rangeSelector = Wu.DomUtil.get('chrome-color-selector-wrapper-' + key);
		var clickCatcher = Wu.DomUtil.get('click-catcher-' + key);

		Wu.DomUtil.addClass(rangeSelector, 'displayNone');
		Wu.DomUtil.addClass(clickCatcher, 'displayNone');

	},

	_gradientStyle : function (colorArray) {

		var gradientStyle = 'background: -webkit-linear-gradient(left, ' + colorArray.join() + ');';
		gradientStyle    += 'background: -o-linear-gradient(right, '     + colorArray.join() + ');';
		gradientStyle    += 'background: -moz-linear-gradient(right, '   + colorArray.join() + ');';
		gradientStyle    += 'background: linear-gradient(to right, '     + colorArray.join() + ');';

		return gradientStyle;

	},		


	// ┌─┐┌─┐┬  ┌─┐┬─┐  ┌┐ ┌─┐┬  ┬  
	// │  │ ││  │ │├┬┘  ├┴┐├─┤│  │  
	// └─┘└─┘┴─┘└─┘┴└─  └─┘┴ ┴┴─┘┴─┘

	initColorBall : function () {

		var appendTo    = this.options.appendTo,
		    key         = this.options.id,
		    fn          = this.options.fn,
		    right       = this.options.right,
		    on          = this.options.isOn,
		    className   = this.options.className,
		    value       = this.options.value;

		var _class = 'chrome-color-ball ';
		if ( className ) _class += className;

		var color = Wu.DomUtil.create('div', _class, appendTo);
		color.id = 'color_ball_' + key;
		color.style.background = value;

		this.color = color;

		if ( !on ) Wu.DomUtil.addClass(color, 'disable-color-ball');
		if ( !right ) Wu.DomUtil.addClass(color, 'left-ball');

		
		// var that = this;
		this.initSpectrum(value, color, key, fn)

	},


	initSpectrum : function (hex, wrapper, key, fn) {


		$(wrapper).spectrum({
			color: hex,
			preferredFormat: 'hex',
			showInitial: true,
			showAlpha: false,
			chooseText: 'Choose',
			cancelText: 'Cancel',
			containerClassName: 'dark clip',
			change: function(hex) {

				var r = Math.round(hex._r).toString(16);
				var g = Math.round(hex._g).toString(16);
				var b = Math.round(hex._b).toString(16);

				if ( r.length == 1 ) r += '0';
				if ( g.length == 1 ) g += '0';
				if ( b.length == 1 ) b += '0';

				var hex = '#' + r + g + b;

				wrapper.style.background = hex;

				fn(hex, key, wrapper);
			}
		});

	},	


	// ┌┬┐┬┌┐┌┬  ┌┬┐┬─┐┌─┐┌─┐┌┬┐┌─┐┬ ┬┌┐┌
	// ││││││││   ││├┬┘│ │├─┘ │││ │││││││
	// ┴ ┴┴┘└┘┴  ─┴┘┴└─└─┘┴  ─┴┘└─┘└┴┘┘└┘

	initMiniDropDown : function () {

		var appendTo    = this.options.appendTo,
		    key         = this.options.id,
		    fn          = this.options.fn,
		    right       = this.options.right,
		    array 	= this.options.array,
		    selected    = this.options.selected,
		    reversed    = this.options.reversed,
		    className   = this.options.className;

		var _class = 'chrome chrome-mini-dropdown active-field select-field-wrap ';
		if ( className ) _class += className;

		// create dropdown
		var selectWrap = this.container = Wu.DomUtil.create('div', _class, appendTo);
		var select = this._select = Wu.DomUtil.create('select', 'active-field-select', selectWrap);
		select.setAttribute('key', key);

		// if ( selected ) 
		if ( reversed ) {
			if ( !selected ) Wu.DomUtil.addClass(selectWrap, 'full-width');
		} else {
			if ( selected )  Wu.DomUtil.addClass(selectWrap, 'full-width');
		}


		// WITHOUT PLACEHOLDER!!!
		// WITHOUT PLACEHOLDER!!!
		// WITHOUT PLACEHOLDER!!!

		// fill select options
		array.forEach(function (field, i) {
			var option = Wu.DomUtil.create('option', 'active-layer-option', select);
			option.value = field;		
			option.innerHTML = field;

			if ( !selected ) {
				if ( i == 0 ) option.selected = true;
			} else {
				if ( field == selected ) option.selected = true;	
			}
			
		});


		// WITH PLACEHOLDER!!!
		// WITH PLACEHOLDER!!!
		// WITH PLACEHOLDER!!!

		// // placeholder
		// var option = Wu.DomUtil.create('option', '', select);
		// option.innerHTML = 'Select column...';
		// option.setAttribute('disabled', '');
		// option.setAttribute('selected', '');

		// // fill select options
		// array.forEach(function (field, i) {
		// 	var option = Wu.DomUtil.create('option', 'active-layer-option', select);
		// 	option.value = field;		
		// 	option.innerHTML = field;
		// 	if ( field == selected ) option.selected = true;
		// });

		// select event
		Wu.DomEvent.on(select, 'change', fn); // todo: mem leak?

	},


	// ┌┬┐┬┌┐┌┬  ┬┌┐┌┌─┐┬ ┬┌┬┐
	// ││││││││  ││││├─┘│ │ │ 
	// ┴ ┴┴┘└┘┴  ┴┘└┘┴  └─┘ ┴ 

	initMiniInput : function () {

		var appendTo    = this.options.appendTo,
		    key         = this.options.id,
		    fn          = this.options.fn,
		    value       = this.options.value,
		    placeholder = this.options.placeholder,
		    tabindex    = this.options.tabindex,
		    right       = this.options.right,
		    className   = this.options.className,
		    isOn        = this.options.isOn,
		    allowText   = this.options.allowText;


		var _class = 'chrome-field-mini-input ';
		if ( className ) _class += className;

		// create
		var miniInput = Wu.DomUtil.createId('input', 'field_mini_input_' + key, appendTo);
		miniInput.className = _class;
		miniInput.setAttribute('placeholder', placeholder);
		miniInput.setAttribute('tabindex', tabindex);

		this.input = miniInput;
		
		// set value
		if (value) miniInput.value = value;
		if (value == 0) miniInput.value = value;

		// other options
		if ( !right ) Wu.DomUtil.addClass(miniInput, 'left-mini');
		if ( !isOn  ) Wu.DomUtil.addClass(miniInput, 'left-mini-kill');

		// set event
		Wu.DomEvent.on(miniInput, 'blur', fn);

		// Force numeric
		if ( !allowText ) miniInput.onkeypress = this.forceNumeric;		    

	},


	initClicker : function () {

		var appendTo = this.options.appendTo;
		var id = this.options.id;
		var type = this.options.type;
		var fn = this.options.fn;
		var array = this.options.array;
		var selected = this.options.selected || '=';
		var className = this.options.className;



		// set index
		this._cidx = _.findIndex(array, selected);
		if (this._cidx > 0) this._cidx = 1;

		// create button
		var button = this._button = Wu.DomUtil.create('div', 'clicker-button ' + className, appendTo, selected);

		// click event, toggle array content
		Wu.DomEvent.on(button, 'click', function (e) {

			// set index
			this._cidx = this._cidx + 1;
			if (this._cidx == array.length) this._cidx = 0;

			// get content
			var content = array[this._cidx];

			// set content
			button.innerHTML = content;

			// callback
			fn(e, content);

		}, this);



	},


	forceNumeric : function (e) {

		// only allow '0-9' + '.' and '-'
		return e.charCode >= 45 && e.charCode <= 57 && e.charCode != 47;

	},	

	
	// ┬─┐┌─┐┌┬┐┬┌─┐
	// ├┬┘├─┤ ││││ │
	// ┴└─┴ ┴─┴┘┴└─┘			

	initRadio : function () {

		var appendTo  = this.options.appendTo,
		    key       = this.options.id,
		    fn        = this.options.fn,
		    className = this.options.className,
		    on        = this.options.isOn;

		var _class = 'layer-radio ';
		if ( className ) _class += className;

		var radio = Wu.DomUtil.create('div', _class, appendTo);
		radio.id = 'radio_' + key;

		if ( on ) {
			Wu.DomUtil.addClass(radio, 'radio-on');
			radio.setAttribute('state', 'true');
		} else {
			radio.setAttribute('state', 'false');
		}

		Wu.DomEvent.on(radio, 'click', this.toggleRadio, this);

		return radio;

	},

	toggleRadio : function (e) {

		var elem = e.target,
		    key = elem.getAttribute('key'),
		    on = elem.getAttribute('state');

		if ( on == 'false' ) {
			Wu.DomUtil.addClass(elem, 'radio-on');
			elem.setAttribute('state', 'true');
		} else {
			Wu.DomUtil.removeClass(elem, 'radio-on');
			elem.setAttribute('state', 'false');
		}

		this.options.fn(e);

	},


	// ┌─┐┌─┐┌┬┐
	// └─┐├┤  │ 
	// └─┘└─┘ ┴ 	

	initSet : function () {

		var appendTo  = this.options.appendTo,
		    key       = this.options.id,
		    className = this.options.className,
		    fn        = this.options.fn;

		var _class = 'chrome-set ';
		if ( className ) _class += className;

		// create
		var set = Wu.DomUtil.create('div', _class, appendTo);
		set.setAttribute('key', key);
		set.innerHTML = 'SET';

		Wu.DomEvent.on(set, 'click', this.toggleSet, this);

		return set;

	},


	toggleSet : function (e) {

		var elem = e.target,
		    key = elem.getAttribute('key');

		this.options.fn(key);

	},


	// ┌─┐┌─┐┌┬┐  ┌─┐┬  ┌─┐┌─┐┬─┐
	// └─┐├┤  │   │  │  ├┤ ├─┤├┬┘
	// └─┘└─┘ ┴   └─┘┴─┘└─┘┴ ┴┴└─

	initSetClear : function () {

		var appendTo  = this.options.appendTo,
		    key       = this.options.id,
		    fn        = this.options.fn,
		    className = this.options.className, 
		    isOn      = this.options.isOn;	

		var _class = 'setClear ';
		if ( className ) _class += className;

		// create
		var setClear = Wu.DomUtil.create('div', _class, appendTo);
		setClear.setAttribute('key', key);
		setClear.innerHTML = 'SET';

		// if on, mark
		if (isOn) {
			Wu.DomUtil.addClass(setClear, 'setClear-on');
			setClear.setAttribute('state', 'true');
			setClear.innerHTML = 'CLEAR';
		} else {
			setClear.setAttribute('state', 'false');
		}

		Wu.DomEvent.on(setClear, 'click', this.toggleSetClear, this);

		return setClear;

	},


	toggleSetClear : function (e) {

		var elem  = e.target,
		    id    = elem.id,
		    key   = elem.getAttribute('key'),
		    state = elem.getAttribute('state'),
		    on 	  = (state == 'true');

		if (on) {
			Wu.DomUtil.removeClass(elem, 'setClear-on');
			elem.setAttribute('state', 'false');
			elem.innerHTML = 'SET';
			var isOn = false;
		} else {
			Wu.DomUtil.addClass(elem, 'setClear-on');
			elem.setAttribute('state', 'true');
			elem.innerHTML = 'CLEAR';
			var isOn = true;
		}

		this.options.fn(key, isOn);
	},	


	// ┌─┐┬ ┬┬┌┬┐┌─┐┬ ┬
	// └─┐││││ │ │  ├─┤
	// └─┘└┴┘┴ ┴ └─┘┴ ┴

	initSwitch : function () {

		var isOn      = this.options.isOn,
		    right     = this.options.right,
		    id        = this.options.id,
		    appendTo  = this.options.appendTo,
		    fn        = this.options.fn,
		    className = this.options.className,
		    disabled  = this.options.disabled;

		this.value = id;

		// Create classname
		var divclass = 'chrome-switch-container';
		if (isOn) divclass += ' switch-on';
		if (right) divclass += ' right-switch'
		if (disabled) divclass += ' disabled-switch';
		if (className) divclass += ' ' + className;

		// Create button
		var _switch = this._switch= Wu.DomUtil.create('div', divclass, appendTo);
		_switch.setAttribute('key', id);
		_switch.id = 'switch_' + id;

		// Set on/off state
		if (isOn) {
			_switch.setAttribute('state', 'true');
		} else {
			_switch.setAttribute('state', 'false');
		}

		// Add hooks
		if ( !disabled ) Wu.DomEvent.on(_switch, 'click', this.toggleSwitch, this);		    

		return _switch;

	},


	// Toggle switch
	toggleSwitch : function (e) {

		var stateAttrib = e.target.getAttribute('state'),
		    on          = (stateAttrib == 'true'),
		    key         = e.target.getAttribute('key');

		if (on) {
			e.target.setAttribute('state', 'false');
			Wu.DomUtil.removeClass(e.target, 'switch-on');
			var isOn = false;

		} else {
			e.target.setAttribute('state', 'true');
			Wu.DomUtil.addClass(e.target, 'switch-on');
			var isOn = true;
		}	

		// save
		this.options.fn(e, isOn)
	},	


	// ┌┬┐┌─┐┌─┐┌─┐┬  ┌─┐  ┌┐ ┬ ┬┌┬┐┌┬┐┌─┐┌┐┌
	//  │ │ ││ ┬│ ┬│  ├┤   ├┴┐│ │ │  │ │ ││││
	//  ┴ └─┘└─┘└─┘┴─┘└─┘  └─┘└─┘ ┴  ┴ └─┘┘└┘

	initToggleButton : function (e) {

		var option1   = this.options.option1,
		    option2   = this.options.option2,
		    id        = this.options.id,
		    appendTo  = this.options.appendTo,
		    fn        = this.options.fn,
		    className = this.options.className,
		    selected  = this.options.selected;


		// Create classname
		var divclass = 'chrome-toggle-button-container';
		if (className) divclass += ' ' + className;

		// Create button
		var _toggleButton = this._toggleButton = Wu.DomUtil.create('div', divclass, appendTo);
		_toggleButton.setAttribute('key', id);
		_toggleButton.id = 'togglebutton_' + id;

		var _option1 = Wu.DomUtil.create('div', 'toggle-button-option-one', _toggleButton, option1)
		var _option2 = Wu.DomUtil.create('div', 'toggle-button-option-one', _toggleButton, option2)

		

	},

});









Wu.fieldLine = Wu.Class.extend({

	initialize : function (options) {

		this._initContent(options);

		// return this;

	},

	_initContent : function (options) {

		var key          = options.id,
		    appendTo     = options.appendTo,
		    title        = options.title,
		    fn           = options.fn,
		    input        = options.input,
		    className    = options.className ? options.className : '',
		    childWrapper = options.childWrapper;


		var cName = 'chrome-metafield-line ' + className;
		this.container = Wu.DomUtil.create('div', cName, appendTo);
		this.container.id = 'field_wrapper_' + key;

		// Children container
		if ( childWrapper ) {
			this.childWrapper = Wu.DomUtil.create('div', 'chrome-metafield-line-children', appendTo);
			this.childWrapper.id = childWrapper;
		}

		// Create input field
		if ( input ) {
			
			// create
			var fieldName = Wu.DomUtil.createId('input', 'field_input_' + key, this.container);
			fieldName.className = 'chrome-field-input';
			fieldName.setAttribute('name', 'field_input_' + key);
			fieldName.setAttribute('placeholder', key);

			// set title 
			if (title) fieldName.value = title;

			// set event
			Wu.DomEvent.on(fieldName, 'blur', fn);
		
		
		} else {

			// Create "normal" text line
			var fieldName = Wu.DomUtil.create('div', 'chrome-field-line', this.container);
			fieldName.innerHTML = title ? title : key;
		}

		return this.container;
	},

})









var language = {

	language : 'eng',

	tooltips : {

		roles : {

			superAdmin : 'Rules the kingdom.',
			portalAdmin : 'Full access to everything.',
			projectOwner : "Can do everything with project, including deleting others's content.",
			projectEditor : "Can do everything with project, except deleting other's content and project.",
			projectManager : "Can read project and delegate users up to same level, but not edit.",
			projectCollaborator : 'Can read and edit project, but not manage users.',
			projectReader : 'Can read project only.',
			noRole : 'No access to project or users.',

			dropdown : 'Delegate a role to user for this project.',
		},




	}
}





// smoother zooming, especially on apple mousepad
L._lastScroll = new Date().getTime();
L.Map.ScrollWheelZoom.prototype._onWheelScroll = function (e) {
    if (new Date().getTime() - L._lastScroll < 200) { return; }
    var delta = L.DomEvent.getWheelDelta(e);
    var debounce = this._map.options.wheelDebounceTime;

    this._delta += delta;
    this._lastMousePos = this._map.mouseEventToContainerPoint(e);

    if (!this._startTime) {
        this._startTime = +new Date();
    }

    var left = Math.max(debounce - (+new Date() - this._startTime), 0);

    clearTimeout(this._timer);
    L._lastScroll = new Date().getTime();
    this._timer = setTimeout(L.bind(this._performZoom, this), left);

    L.DomEvent.stop(e);
}



L.Map.include({

	// refresh map container size
	reframe: function (options) {
		if (!this._loaded) { return this; }
		this._sizeChanged = true;
		this.fire('moveend');
	},

	fitBounds: function (bounds, options) {

		options = options || {};
		bounds = bounds.getBounds ? bounds.getBounds() : L.latLngBounds(bounds);

		var paddingTL = L.point(options.paddingTopLeft || options.padding || [0, 0]),
		    paddingBR = L.point(options.paddingBottomRight || options.padding || [0, 0]),

		    zoom = this.getBoundsZoom(bounds, false, paddingTL.add(paddingBR)),
		    paddingOffset = paddingBR.subtract(paddingTL).divideBy(2),

		    swPoint = this.project(bounds.getSouthWest(), zoom),
		    nePoint = this.project(bounds.getNorthEast(), zoom),
		    center = this.unproject(swPoint.add(nePoint).divideBy(2).add(paddingOffset), zoom);

		zoom = options && options.maxZoom ? Math.min(options.maxZoom, zoom) : zoom;

		// added minZoom option
		zoom = options && options.minZoom ? Math.max(options.minZoom, zoom) : zoom;

		return this.setView(center, zoom, options);
	},
});


L.Polygon.include({

	getCenter: function () {
		var i, j, p1, p2, f, area, x, y, center,
		    points = this._rings[0],
		    len = points.length;

		if (!len) { return null; }

		// polygon centroid algorithm; only uses the first ring if there are multiple

		area = x = y = 0;

		for (i = 0, j = len - 1; i < len; j = i++) {
			p1 = points[i];
			p2 = points[j];

			f = p1.y * p2.x - p2.y * p1.x;
			x += (p1.x + p2.x) * f;
			y += (p1.y + p2.y) * f;
			area += f * 3;
		}

		if (area === 0) {
			// Polygon is so small that all points are on same pixel.
			center = points[0];
		} else {
			center = [x / area, y / area];
		}
		return this._map.layerPointToLatLng(center);
	},
})

// prevent minifed bug
L.Icon.Default.imagePath = '/css/images';
Wu.TestSuite = {

	projectMemoryLeak : function (runs) {
		var first = true;
		var n = 0;
		var runs = runs || 5;

		var a = setInterval(function () {
			var p = first ? 'project-aff995e7-c6de-4783-afb1-5f8a5bffae2f' : 'project-4ba8d217-6245-4311-8efc-c62eb0dbaa73';
			Wu.Mixin.Events.fire('projectSelected', { detail : {
				projectUuid : p
			}}); 
			Wu.Mixin.Events.fire('projectSelected', { detail : {
				projectUuid : p
			}});

			first = !first; 
			n += 1;

			if (n>runs) {
				console.log('test done!');
				clearInterval(a);
			}
		}, 2000);
	},

	layersMemoryLeak : function (runs) {

		var n = 0;
		var m = 0;
		var lm = app.MapPane.getControls().layermenu;
		var layers = _.toArray(lm.getLayers());
		var runs = runs || _.size(layers) * 2;
		

		var a = setInterval(function () {

			var layer = layers[m];
			lm.toggleLayer(layer);


			n += 1;

			if (n % 2 == 0) m+= 1;

			if (n >= runs) {
				console.log('test done!');
				clearInterval(a);
			}

		}, 1000);

	}

};


Wu.version = '1.3.0';
Wu.App = Wu.Class.extend({
	_ : 'app',

	// debug : true,

	// default options
	options : systemapicConfigOptions, // global var from config.js... perhaps refactor.

	language : language,

	_ready : false,

	initialize : function (options) {

		// print version
		console.log('Systemapic v.' + Wu.version);

		// set global this
		Wu.app = window.app = this; // todo: remove Wu.app, use only window.app

		// set access token
		this.setAccessTokens();

		// init socket
		app.Socket = new Wu.Socket();

		// error handling
		this._initErrorHandling();

		// merge options
		Wu.setOptions(this, options);

		// set page title
		document.title = this.options.portalTitle;

		// get objects from server
		this.initServer();

		// init sniffers
		this._initSniffers();
	},

	_initSniffers : function () {

		// Detect mobile devices
		this.detectMobile();

		// get user agent
		this.sniffer = Sniffer(navigator.userAgent);
	},
	
	setAccessTokens : function () {

		app.tokens = window.tokens;

		var access_token = app.tokens.access_token;

		// print debug
		// console.log('Debug: access_token: ', access_token);

		// test access token
		Wu.send('/api/userinfo', {}, function (err, body) {
			if (err == 401) {
				console.error('you been logged out');
				window.location.href = app.options.servers.portal;
			}
		});
	},

	_initErrorHandling : function () {

		// log all errors
		window.onerror = this._onError;

		// forward console.error's to log also
		// console.error = function (message) {
		// 	try { throw Error(message); } 
		// 	catch (e) {}
		// }
	},

	_onError : function (message, file, line, char, ref) {

		console.log('ionerror');
			
		var stack = ref.stack;
		var project = app.activeProject ? app.activeProject.getTitle() : 'No active project';
		var username = app.Account ? app.Account.getName() : 'No username';
		
		var options = JSON.stringify({
			message : message,
			file : file,
			line : line,
			user : username,
			stack : stack,
			project : project
		});

		Wu.save('/api/error/log', options);
	},

	_checkForInvite : function () {
		var pathname = window.location.pathname;
		if (pathname.indexOf('/invite/') == -1) return;
		var invite_token = pathname.split('/').reverse()[0];
		if (invite_token) this.options.invite_token = invite_token;
	},

	initServer : function () {
		console.log('Securely connected to server: \n', this.options.servers.portal);

		// check for invite link
		this._checkForInvite();

		// data for server
		var data = JSON.stringify(this.options);
		
		// post         path          json      callback    this
		Wu.post('api/portal', data, this.initServerResponse, this, this.options.servers.portal);
	},

	initServerResponse : function (that, responseString) {
		var responseObject = Wu.parse(responseString);

		// revv it up
		that.initApp(responseObject);
	},

	initApp : function (portalStore) {
		// set vars
		this.options.json = portalStore;

		// access
		this._initAccess();

		// load json model
		this._initObjects();

		// create app container
		this._initContainer();

		// init chrome
		this._initChrome();

		// create panes
		this._initPanes();

		// init pane view
		this._initView();

		// ready
		this._ready = true;

		// debug
		this._debug();

		// log entry
		this._logEntry();

		// analytics
		this.Analytics = new Wu.Analytics();

	},

	_logEntry : function () {

		var b = this.sniffer.browser;
		var o = this.sniffer.os;

		var browser = b.fullName + ' ' + b.majorVersion + '.' + b.minorVersion;
		var os = o.fullName + ' ' + o.majorVersion + '.' + o.minorVersion;

		app.Socket.sendUserEvent({
		    	user : app.Account.getFullName(),
		    	event : 'entered',
		    	description : 'the wu: `' + browser + '` on `' + os + '`',
		    	timestamp : Date.now()
		});
	},

	_initObjects : function () {

		// data controller
		this.Data = new Wu.Data();

		// controller
		this.Controller = new Wu.Controller(); // todo: remove this?

		// main user account
		this.Account = new Wu.User(this.options.json.account);
		this.Account.setRoles(this.options.json.roles);

		// create user objects
		// this.Users = {};
		// this.options.json.users.forEach(function(user, i, arr) {
		//        this.Users[user.uuid] = new Wu.User(user);             
		// }, this);

		this.Users = {};
		app.Account.getContactList().forEach(function(user) {
		       this.Users[user.uuid] = new Wu.User(user);    
		}, this);
		this.options.json.users.project_users.forEach(function(user) {
		       if (!this.Users[user.uuid]) this.Users[user.uuid] = new Wu.User(user);             
		}, this);

		// add account to users list
		this.Users[app.Account.getUuid()] = this.Account;

		// create project objects
		this.Projects = {};
		this.options.json.projects.forEach(function(elem, i, arr) {
		       this.Projects[elem.uuid] = new Wu.Project(elem, this);
		}, this);
	},

	_initChrome : function () {

		// chrome
		this.Chrome = {};

		// top chrome
		this.Chrome.Top = new Wu.Chrome.Top();

		// right chrome
		this.Chrome.Right = new Wu.Chrome.Right();

		// right chrome
		this.Chrome.Left = new Wu.Chrome.Left();

		// todo: 
		// center




	},

	_initPanes : function () {

		// render tooltip
		this.Tooltip = new Wu.Tooltip();

		// render style handler
		this.Style = new Wu.Style();

		// render progress bar
		this.ProgressBar = new Wu.ProgressPane({
			color : 'white',
			addTo : this._appPane
		});

		// // render startpane
		// this.StartPane = new Wu.StartPane({
		// 	projects : this.Projects
		// });

		// render header pane
		// this.HeaderPane = new Wu.HeaderPane();

		// render map pane
		this.MapPane = new Wu.MapPane();

		// render eror pane
		this.FeedbackPane = new Wu.FeedbackPane();

		// settings pane
		this.MapSettingsPane = new Wu.MapSettingsPane();

		// share pane
		this.Share = new Wu.Share();

		// add account tab
		this.Account.addAccountTab();

	},


	// init default view on page-load
	_initView : function () {

		// check invite
		if (this._initInvite()) return;

		// check location
		if (this._initLocation()) return;
			
		// runs hotlink
		if (this._initHotlink()) return;

		// set project if only one
		// if (this._lonelyProject()) return;

		// open projects pane
		// app.Chrome.Left.open()

		// open first project (ordered by lastUpdated)
		app.Controller.openLastUpdatedProject();
	},


	_initInvite : function () {
		var project = this.options.json.invite;

		if (!project) return false;

		// select project
		Wu.Mixin.Events.fire('projectSelected', {detail : {
			projectUuid : project.id
		}});

		app.feedback.setMessage({
			title : 'Project access granted',
			description : 'You\'ve been given access to the project ' + project.name 
		});
	},

	_initEvents : function () {
	},

	_getDimensions : function (e) {
		var w = window,
		    d = document,
		    e = d.documentElement,
		    g = d.getElementsByTagName('body')[0],
		    x = w.innerWidth || e.clientWidth || g.clientWidth,
		    y = w.innerHeight|| e.clientHeight|| g.clientHeight,
		    d = {
			height : y,
			width : x,
			e : e
		    }
		return d;
	},

	_initContainer : function () {

		// find or create container
		var id = this.options.id;
		this._appPane = Wu.DomUtil.get(id) || Wu.DomUtil.createId('div', id || 'app', document.body);

		// create map container
		this._mapContainer = Wu.DomUtil.createId('div', 'map-container', this._appPane);
	},

	_initAccess : function () {
		this.Access = new Wu.Access(this.options.json.access);
	},

	// _lonelyProject : function () {
	// 	//default case: hidden/ghost project (belongs to no client). Preferable to stick to the Start Pane
	// 	if (_.size(app.Projects) == 1) {
	// 		for (var p in app.Projects) {
	// 			var project = app.Projects[p]; 
				
	// 			// if project is hidden/ghost it has no client
	// 		   	if (project.getClient() === undefined) {
	// 				return false;
	// 			}

	// 			this._setProject(project);
	// 			return true;
	// 		}
	// 	}
	// 	//single project plus hidden/ghost project
	// 	//check if single (owned) project. Redirect to it instead of sticking on the Start pane
	// 	if (_.size(app.Projects) == 2) {
	// 		for (var p in app.Projects) {
	
	// 			var project = app.Projects[p]; 
	// 			if (project.getClient() === undefined) {
	// 				continue;
	// 			}
	// 			this._setProject(project);
	// 			return true;
	// 		}
	// 	}
	// 	return false;
	// },

	_initLocation : function () {
		var path    = window.location.pathname,
		    client  = path.split('/')[1],
		    project = path.split('/')[2],
		    hash    = path.split('/')[3],
		    search  = window.location.search.split('?'),
		    params  = Wu.Util.parseUrl();

		// done if no location
		if (!client || !project) return false;

		// get project
		var project = this._projectExists(project, client);
		
		// return if no such project
		if (!project) {
			Wu.Util.setAddressBar(this.options.servers.portal);
			return false;
		}

		// set project
		this._setProject(project);

		// init hash
		if (hash) {
			console.log('got hash!', hash, project);
			this._initHash(hash, project);
		}
		return true;
	},

	_setProject : function (project) {
		
		// select project
		Wu.Mixin.Events.fire('projectSelected', {detail : {
			projectUuid : project.getUuid()
		}});

	},

	_initHotlink : function () {
		
		// parse error prone content of hotlink..
		Wu.parse(window.hotlink);

		// return if no hotlink
		if (!this.hotlink) return false;

		// check if project slug exists, and if belongs to client slug
		var project = this._projectExists(this.hotlink.project, this.hotlink.client);

		// return if not found
		if (!project) return false;

		// set project
		this._setProject(project);

		return true;
	},


	// check if project exists (for hotlink)
	_projectExists : function (projectSlug, clientSlug) {

		// find project slug in Wu.app.Projects
		var projectSlug = projectSlug || window.hotlink.project;
		for (p in Wu.app.Projects) {
			var project = Wu.app.Projects[p];
			if (projectSlug == project.store.slug) {
				if (project._client.slug == clientSlug) return project; 
			}
		}
		return false;
	},

	// get name provided for portal from options hash 
	getPortalName : function () {
		return this.options.portalName;
	},

	// shorthands for setting status bar
	setStatus : function (status, timer) {
		// app.StatusPane.setStatus(status, timer);
	},

	setSaveStatus : function (delay) {
		// app.StatusPane.setSaveStatus(delay);
	},

	_initHash : function (hash, project) {

		// get hash values from server,
		this.getHash(hash, project, this._renderHash);
		return true;
	},

	// get saved hash
	getHash : function (id, project, callback) {

		// get a saved setup - which layers are active, position, 
		Wu.post('/api/project/hash/get', JSON.stringify({
			projectUuid : project.getUuid(),
			id : id
		}), callback, this);
	},

	_renderHash : function (context, json) {

		// parse
		var result = JSON.parse(json); 

		// handle errors
		if (result.error) console.log('error?', result.error);

		// set vars
		var hash = result.hash;
		var projectUuid = hash.project || result.project;	// hacky.. clean up setHash, _renderHash, errything..
		var project = app.Projects[projectUuid];

		console.error('renderHash', projectUuid);

		// // set project
		// Wu.Mixin.Events.fire('projectSelected', { detail : {
		// 	projectUuid : projectUuid
		// }});

		project.selectProject();


		// set position
		app.MapPane.setPosition(hash.position);

		console.log('hash: ', hash);

		return;

		// set layers
		hash.layers.forEach(function (layerUuid) { 	// todo: differentiate between baselayers and layermenu
								// todo: layermenu items are not selected in layermenu itself, altho on map
			// add layer
			var layer = project.getLayer(layerUuid);

			// if in layermenu
			var bases = project.getBaselayers();
			var base = _.find(bases, function (b) {
				return b.uuid == layerUuid;
			});

			if (base) {
				// add as baselayer
				layer.add('baselayer'); 
			} else {
				// ass as layermenu
				var lm = app.MapPane.getControls().layermenu;
				if (lm) {
					var lmi = lm._getLayermenuItem(layerUuid);
					lm.enableLayer(lmi);
				}
			}
			
		}, this);
	},

	// save a hash // todo: move to controller
	setHash : function (callback, project) {

		// get active layers
		var active = app.MapPane.getControls().layermenu._getActiveLayers();
		var layers = _.map(active, function (l) {
			return l.item.layer;
		})

		// get project;
		var project = project || app.activeProject;

		// save hash to server
		Wu.post('/api/project/hash/set', JSON.stringify({
			projectUuid : project.getUuid(),
			hash : {
				id 	 : Wu.Util.createRandom(6),
				position : app.MapPane.getPosition(),
				layers 	 : layers 			// layermenuItem uuids, todo: order as z-index
			}
		}), callback, this);

	},


	phantomJS : function (args) {
		var projectUuid = args.projectUuid,
	   	    hash    	= args.hash,
	   	    isThumb     = args.thumb;

	   	// return if no project
	   	if (!projectUuid) return false;

	   	// set hash for phantom
	   	this._phantomHash = hash;

		// get project
		var project = app.Projects[projectUuid];
		
		// return if no such project
		if (!project) return false;

		// check for hash
		if (hash) {

			// select project
			project.selectProject();

			// set position
			app.MapPane.setPosition(hash.position);

			// set layers
			hash.layers.forEach(function (layerUuid) { 	// todo: differentiate between baselayers and layermenu
									// todo: layermenu items are not selected in layermenu itself, altho on map
				// add layer
				var layer = project.getLayer(layerUuid);

				// if in layermenu
				var bases = project.getBaselayers();
				var base = _.find(bases, function (b) {
					return b.uuid == layerUuid;
				});

				if (base) {
					// add as baselayer
					layer.add('baselayer'); 
				} else {
					layer.add();
				}
				
			}, this);

		}

		// add phantomJS stylesheet		
		isThumb ? app.Style.phantomJSthumb() : app.Style.phantomJS();

		app._isPhantom = true;

	},
	
	_setPhantomArgs : function (args) {
		this._phantomArgs = args;
	},
	
	phantomReady : function () {
		if (!app.activeProject) return false;

		var hashLayers = _.size(this._phantomHash.layers),
		    baseLayers = _.size(app.activeProject.getBaselayers()),
		    numLayers = hashLayers + baseLayers;

		// check if ready for screenshot
		if (!this._loaded || !this._loading) return false;

		// if no layers, return
		if (numLayers == 0) return true;

		// if not loaded, return
		if (this._loaded.length == 0 ) return false; 

		// if all layers loaded
		if (this._loaded.length == numLayers) return true;

		// not yet
		return false;
	},

	// phantomjs: loaded layers
	_loaded : [],

	_loading : [],

	detectMobile : function() {
		
		// Detect if it's a mobile
		if (L.Browser.mobile) {

			// Set mobile state to true
			Wu.app.mobile = false;
			Wu.app.pad = false;
			
			// Get screen resolution
			var w = screen.height;
			var h = screen.width;

			// Store resolution
			Wu.app.nativeResolution = [w, h];

			if ( w >= h ) var smallest = h;
			else var smallest = w;

			// Mobile phone
			if ( smallest < 450 ) {

				Wu.app.mobile = true;
				var mobilestyle = 'mobilestyle.css'
			// Tablet
			} else {

				Wu.app.pad = true;
				var mobilestyle = 'padstyle.css'
			}

			// Get the styletag
			var styletag = document.getElementById('mobilestyle');
			// Set stylesheet for 
			var styleURL = '<link rel="stylesheet" href="' + app.options.servers.portal + 'css/' + mobilestyle + '">';
			styletag.innerHTML = styleURL;
			
		}
	},

	// debug mode
	_debug : function (debug) {
		if (!debug && !this.debug) return;
		this.debug = true;

		// set style
		app.Style.setStyle('img.leaflet-tile', {
			'border-top': '1px solid rgba(255, 0, 0, 0.65)',
			'border-left': '1px solid rgba(255, 0, 0, 0.65)'
		});

		// add map click event
		if (app._map) app._map.on('mousedown', function (e) {
			var lat = e.latlng.lat,
			    lng = e.latlng.lng,
			    zoom = app._map.getZoom(),
			    tile = this._getTileURL(lat, lng, zoom);

			console.log('tile:', tile);
			
		}, this);

		// extend 
		if (typeof(Number.prototype.toRad) === "undefined") {
			Number.prototype.toRad = function() {
				return this * Math.PI / 180;
			}
		}
	},

	// for debug
	_getTileURL : function (lat, lon, zoom) {
		var xtile = parseInt(Math.floor( (lon + 180) / 360 * (1<<zoom) ));
		var ytile = parseInt(Math.floor( (1 - Math.log(Math.tan(lat.toRad()) + 1 / Math.cos(lat.toRad())) / Math.PI) / 2 * (1<<zoom) ));
		return "" + zoom + "/" + xtile + "/" + ytile;
	},

});