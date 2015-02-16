// The MIT License (MIT)

// Copyright (c) 2014 Vladimir Agafonkin. Original: https://github.com/Leaflet/Leaflet/tree/master/src/core
// Copyright (c) 2014 @kosjoli           

// Permission is hereby granted, free of charge, to any person obtaining a copy of
// this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to
// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
// the Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
// IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


// _____class.js___________________________________________________________________ 
// Taken from Class.js in Leaflet.js by Vladimir Agafonkin, @LeafletJS

var ich = ich || {};
ich.$ = function (elem) { return elem; };
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

	
	// WU functions
	// returns DOM elements instead of HTML string for icanhaz templates
	templateIch : function (template, data, container) {
		var dummy = Wu.DomUtil.create('div', '');
		dummy.innerHTML = ich[template](data);

		if (container) {
			var d = dummy;
			for (var i = 0; i < d.children.length; i++) {
				container.appendChild(d.children[i]);
			}
			return container.children[0];
		}
		
		return dummy.children;
	},

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

		if (response.substring(0,16) == '<!doctype html>')  {
			console.log('DOCTPE');
			console.log(response.substring(0,16));
		}
	},

	// post without callback
	post : function (path, json) {
		var that = this;
		var http = new XMLHttpRequest();
		var url = window.location.origin; 
		url += path;
		http.open("POST", url, true);

		//Send the proper header information along with the request
		http.setRequestHeader("Content-type", "application/json");

		http.onreadystatechange = function() {
		    if(http.readyState == 4 && http.status == 200) {
			// console.log(http.responseText);
		    	Wu.Util.checkDisconnect(http.responseText);
		    }
		}
		http.send(json);
	},

	// post with callback
	postcb : function (path, json, cb, context, baseurl) {
		var that = context;
		var http = new XMLHttpRequest();
		var url = baseurl || window.location.origin; 
		url += path;
		http.open("POST", url, true);

		//Send the proper header information along with the request
		http.setRequestHeader('Content-type', 'application/json');

		http.onreadystatechange = function() {
		    if(http.readyState == 4 && http.status == 200) {
			// console.log(http.responseText);
		    	Wu.Util.checkDisconnect(http.responseText);
			if (cb) cb(context, http.responseText); 
		    }
		}



		http.send(json);
	},


	// post with callback and error handling (do callback.bind(this) for context)
	send : function (path, json, callback) {
		var that = this;
		var http = new XMLHttpRequest();
		var url = window.location.origin;
		url += path;
		http.open("POST", url, true);
		http.setRequestHeader('Content-type', 'application/json');
		http.onreadystatechange = function() {
			if (http.readyState == 4) {
		    		Wu.Util.checkDisconnect(http.responseText);
				// console.log(http.responseText);
				if (http.status == 200) { // ok
					if (callback) callback(null, http.responseText); 
				} else { // error
					if (callback) callback(http.status); 	// ??
				}
			}
		}
		http.send(json);
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

	// get with callback
	_getJSON : function (url, callback) {

		var http = new XMLHttpRequest();
		http.open("GET", url, true);

		//Send the proper header information along with the request
		http.setRequestHeader("Content-type", "application/json");

		http.onreadystatechange = function() {
		    if(http.readyState == 4 && http.status == 200) {
			
			//var json = JSON.parse(http.responseText);
			
			callback(http.responseText); 


		    }
		}
		http.send(null);
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

	can : {

		create : {
			project : function () {
				var user = app.User.store;
				if (user.role.superadmin) return true;
				if (user.role.admin)      return true;
				return false;
			},
			client : function () {
				var user = app.User.store;
				if (user.role.superadmin) return true;
				if (user.role.admin)      return true;
				return false;
			},
			superadmin : function () {
				var user = app.User.store;
				if (user.role.superadmin) return true;
				return false;
			},
			admin : function () {
				var user = app.User.store;
				if (user.role.superadmin) return true;
				if (user.role.admin)      return true; 	// admins can create other admins
				return false;
			},
			manager : function (uuid) { // project uuid
				var user = app.User.store;
				if (user.role.superadmin) return true;
				if (user.role.admin)      return true;
				return false;
			},
			editor : function () {
				var user = app.User.store;
				if (user.role.superadmin) return true;
				if (user.role.admin)      return true;
				return false;
			},
			reader : function () {
				var user = app.User.store;
				if (user.role.superadmin) return true;
				if (user.role.admin)      return true;
				if (user.role.manager.projects.indexOf(uuid) >= 0) return true; // managers can create readers for own projects
				return false;
			}
		},

		read : {
			project : function (uuid) {
				var user = app.User.store;
				if (user.role.superadmin) return true;
				if (user.role.admin)      return true;
				if (user.role.manager.projects.indexOf(uuid) >= 0) return true; // managers can create readers for own projects
				if (user.role.editor.projects.indexOf(uuid)  >= 0) return true; // managers can create readers for own projects
				if (user.role.reader.projects.indexOf(uuid)  >= 0) return true; // managers can create readers for own projects
				return false;
			},
			client : function (uuid) {
				var user = app.User.store;
				if (user.role.superadmin) return true;
				if (user.role.admin)      return true;
				if (user.role.manager.clients.indexOf(uuid) >= 0) return true; // managers can create readers for own projects
				if (user.role.editor.clients.indexOf(uuid)  >= 0) return true; // managers can create readers for own projects
				if (user.role.reader.clients.indexOf(uuid)  >= 0) return true; // managers can create readers for own projects
				return false;
			}
		},

		update : {
			project : function (uuid) {
				var user = app.User.store;
				if (user.role.superadmin) return true;
				if (user.role.admin)      return true;
				if (user.role.editor.projects.indexOf(uuid) >= 0) return true; // managers can create readers for own projects
				return false;

			},
			client : function (uuid) {
				var user = app.User.store;
				if (user.role.superadmin) return true;
				if (user.role.admin)      return true;
				if (user.role.editor.clients.indexOf(uuid) >= 0) return true; // managers can create readers for own projects
				return false;
			},
			user   : function (uuid) {
				var user = app.User.store;
				if (user.role.superadmin) return true;
				if (user.role.admin)      return true;

				// var subject = app.
				if (user.role.manager.indexOf(uuid) >= 0) return true; // managers can create readers for own projects
				return false;				
			}
		},

		remove : {
			project : function (uuid) {
				var user = app.User.store;
				if (user.role.superadmin) return true;
				if (user.role.admin)      return true;
				return false;

			},
			client : function (uuid) {
				var user = app.User.store;
				if (user.role.superadmin) return true;
				if (user.role.admin)      return true;
				return false;				
			}
		}, 


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
ichDiv = Wu.Util.templateIch;
Wu.setStyle = Wu.Util.setStyle;
Wu.getStyle = Wu.Util.getStyle;

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
			} else {
				el.innerHTML = content;
			}
		}

		return el;
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

Wu.DomEvent.addListener = Wu.DomEvent.on;
Wu.DomEvent.removeListener = Wu.DomEvent.off;


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
    return this.replace (/(?:^|[-_])(\w)/g, function (_, c) {
      return c ? c.toUpperCase () : '';
    });
}

JSON.parseAsync = function(data, callback) {
	var worker, json
	if (window.Worker) {
		worker = new Worker( 'json.worker.js' );
		worker.addEventListener( 'message', function (e) {
			json = e.data;
			callback( json );
		}, false);
		worker.postMessage( data );
		return;
	} else {
		json = JSON.parse( data );
		callback( json );
	}
};

// bind fn for phantomJS
Function.prototype.bind = Function.prototype.bind || function (thisp) {
	var fn = this;
	return function () {
		return fn.apply(thisp, arguments);
	};
};
;L.Map.include({

	// refresh map container size
	reframe: function (options) {
		if (!this._loaded) { return this; }
		this._sizeChanged = true;
		this.fire('moveend');
	}
});

// add wrapper for draw controls
L.Control.Draw.include({

	// custom onAdd
	onAdd: function (map) {
		var container = L.DomUtil.create('div', 'leaflet-draw'),
			addedTopClass = false,
			topClassName = 'leaflet-draw-toolbar-top',
			toolbarContainer;

		// create wrappers
		var sectionButton = L.DomUtil.create('div', 'leaflet-draw-section-button', container);
		var sectionWrapper = L.DomUtil.create('div', 'leaflet-draw-section-wrapper', container);
		this._wrapper = sectionWrapper;	// shorthand for adding more stuff to this wrapper

		// add tooltip
		app.Tooltip.add(sectionButton, 'Draw on the map');

		// add hook to button
		L.DomEvent.on(sectionButton, 'mousedown', function (e) {
			L.DomEvent.stop(e);
			if (L.DomUtil.hasClass(sectionWrapper, 'draw-expander')) {
				L.DomUtil.removeClass(sectionWrapper, 'draw-expander') 
				L.DomUtil.removeClass(sectionButton, 'open-drawer');
			} else {
				L.DomUtil.addClass(sectionWrapper, 'draw-expander');
				L.DomUtil.addClass(sectionButton, 'open-drawer');
			}
		}, this);
		L.DomEvent.on(sectionButton, 'dblclick', L.DomEvent.stop, this);

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

					// add to sectionWrapper instead of container
					sectionWrapper.appendChild(toolbarContainer);
				}
			}
		}

		return container;
	},

});



L.Popup.include({

	_initLayout: function () {

		var prefix = 'leaflet-popup',
			containerClass = prefix + ' ' + this.options.className + ' leaflet-zoom-' +
			        (this._animated ? 'animated' : 'hide'),
			container = this._container = L.DomUtil.create('div', containerClass),
			closeButton;

		if (this.options.closeButton) {
			closeButton = this._closeButton =
			        L.DomUtil.create('a', prefix + '-close-button', container);
			closeButton.href = '#close';
			closeButton.innerHTML = '&#215;';
			L.DomEvent.disableClickPropagation(closeButton);

			L.DomEvent.on(closeButton, 'click', this._onCloseButtonClick, this);
		}

		var wrapper = this._wrapper =
		        L.DomUtil.create('div', prefix + '-content-wrapper', container);
		L.DomEvent.disableClickPropagation(wrapper);

		this._contentNode = L.DomUtil.create('div', prefix + '-content', wrapper);

		L.DomEvent.disableScrollPropagation(this._contentNode);
		L.DomEvent.on(wrapper, 'contextmenu', L.DomEvent.stopPropagation);

		this._tipContainer = L.DomUtil.create('div', prefix + '-tip-container', container);
		this._tip = L.DomUtil.create('div', prefix + '-tip', this._tipContainer);
	},


	_updateLayout: function () {

		var container = this._contentNode,
		    style = container.style;

		var parent_container = container.parentNode;  

		style.width = '';
		style.whiteSpace = 'nowrap';

		var width = container.offsetWidth;
		width = Math.min(width, this.options.maxWidth);
		width = Math.max(width, this.options.minWidth);

		style.width = (width + 46) + 'px';
		style.whiteSpace = '';

		style.height = '';

		var height = container.offsetHeight,
		    maxHeight = this.options.maxHeight,
		    scrolledClass = 'leaflet-popup-scrolled';

		if (maxHeight && height > maxHeight) {
			style.height = maxHeight + 'px';
			L.DomUtil.addClass(container, scrolledClass);
		} else {
			L.DomUtil.removeClass(container, scrolledClass);
		}

		this._containerWidth = this._container.offsetWidth;

		parent_container.style.width = (width + 46) + 'px';
	}

});



;Wu.SidePane = Wu.Class.extend({
	_ : 'sidepane', 

	initialize : function (options) {
		
		this.options = options || app.options;

		this.initContainer();
		this.initContent();
		this.render();     
		
		return this;   
	},

	
	initContainer: function () {

		// create container
		var className = 'q-editor-container';
		this._container = Wu.DomUtil.create('div', className, Wu.app._appPane);
		
		// toggle panes button
		this.paneOpen = false; // default
		this.whichPaneOpen = 'projects';

		// Mobile option ~ Back button when entering documents/datalibrary/users fullscreen
		if ( Wu.app.mobile ) {

			this._mobileFullScreenCloser = Wu.DomUtil.create('div', 'q-editor-fullscreen-mobile-close displayNone', this._container);
			Wu.DomEvent.on(this._mobileFullScreenCloser, 'mousedown', this.closeMobileFullscreen, this);
		}		

	},

	closeMobileFullscreen : function () {

		if ( app.SidePane.fullscreen ) {

			Wu.app._editorMenuPane.style.opacity = 1; // .q-editor-content
			Wu.DomUtil.addClass(app.SidePane._mobileFullScreenCloser, 'displayNone'); // Hide back button
			Wu.DomUtil.removeClass(app._mapPane, "map-blur"); // remove map blurring
			Wu.DomUtil.removeClass(Wu.app._active, 'show'); // Hide current active fullpane
			
			app.SidePane.fullscreen = false;

		}

	},

	initContent : function () {
		
		// menu pane
		var className = 'q-editor-menu';
		Wu.app._editorMenuPane = Wu.DomUtil.create('menu', className, this._container); 

		// content pane
		var className = 'q-editor-content hide-menu displayNone';
		app._editorContentPane = Wu.DomUtil.create('content', className, this._container); 

		// menuslider
		app._menuSlider = Wu.DomUtil.createId('div', 'menuslider', Wu.app._editorMenuPane);
		app._menuSliderArrow = Wu.DomUtil.createId('div', 'menuslider-arrow', Wu.app._menuSlider);	// refactor app

		
	},
	
	render : function () {
		var pane = this.options.panes;

		// render sidepanes
		if (pane.clients) 	this.Clients 	  = new Wu.SidePane.Clients();
		if (pane.mapOptions) 	this.Map 	  = new Wu.SidePane.Map();		// Options
		if (pane.documents) 	this.Documents 	  = new Wu.SidePane.Documents();
		if (pane.dataLibrary) 	this.DataLibrary  = new Wu.SidePane.DataLibrary();
		if (pane.mediaLibrary) 	this.MediaLibrary = new Wu.SidePane.MediaLibrary();
		if (pane.users) 	this.Users 	  = new Wu.SidePane.Users();
		if (pane.share) 	this.Share 	  = new Wu.SidePane.Share();
		if (pane.account) 	this.Account 	  = new Wu.SidePane.Account();

	},

	calculateHeight : function () {


		var header = app.HeaderPane;
		var height = header.getHeight();

		// set minimum width
		if (!height) height = 80;

		// set height
		this._minHeight = 0;
	},

	setHeight : function (height) {
		console.error('setHeight: ', height);
		this._container.style.height = height + 'px';
	},

	collapse : function () {
		
		// calculate
		this.calculateHeight();
		
		// set height
		this.setHeight(this._minHeight);

		// close menu panes if open
		this.closePane();

		// deactivte submenus
		this._deactivate();

	},

	// call _deactivate on all items
	_deactivate : function () {

		if (this.Clients) 	this.Clients._deactivate();
		if (this.Map) 		this.Map._deactivate();
		if (this.Documents) 	this.Documents._deactivate();
		if (this.DataLibrary) 	this.DataLibrary._deactivate();
		if (this.MediaLibrary) 	this.MediaLibrary._deactivate();
		if (this.Users) 	this.Users._deactivate();
		if (this.Share) 	this.Share._deactivate();
		if (this.Account) 	this.Account._deactivate();
	},

	expand : function () {

		// set height of menu
		this._setMenuHeight();

		// open
		this.openPane();
	},

	_setMenuHeight : function () {



		// Button height
		if ( !Wu.app.mobile ) {
			var bHeight = 70;
		} else {
			var bHeight = 50;
		}

		var panes = this._getPaneArray();
		var defaultPanes = app.Account.isManager() ? 3 : 2;			// 3 if manager, 2 if not (ie. only Project, Logout)

		// var height = panes ? panes.length * bHeight : defaultPanes * bHeight;	// if no active project, default 3 menu items	
		if ( panes != 0 ) var height = panes.length * bHeight			
		else var height = defaultPanes * bHeight;
	
		app._editorMenuPane.style.height = parseInt(height) + 'px';

	},

	_getPaneArray : function (project) {

		var project = project || app.activeProject;
		if (!project) return [];

		var panes = [],
		    pane = this.options.panes,
		    settings = project.getSettings(),
		    isEditor = app.Account.canUpdateProject(project.getUuid()),
		    isManager = app.Account.canManageProject(project.getUuid());

		if (pane.clients) 					panes.push('Clients');
		if (pane.mapOptions 	&& isEditor) 			panes.push('Map'); 
		if (pane.documents   	&& settings.documentsPane) 	panes.push('Documents');
		if (pane.dataLibrary 	&& settings.dataLibrary) 	panes.push('DataLibrary');
		if (pane.MediaLibrary 	&& settings.mediaLibrary) 	panes.push('MediaLibrary');
		if (pane.users 		&& isManager) 			panes.push('Users');
		if (pane.share 		&& settings.socialSharing) 	panes.push('Share');
		if (pane.account) 					panes.push('Account');

		return panes;
	},

	setProject : function (project) {
		// update content
		if (this.Home) 		this.Home.updateContent(project);
		if (this.Map) 		this.Map.updateContent(project);
		if (this.Documents) 	this.Documents.updateContent(project);
		if (this.DataLibrary) 	this.DataLibrary.updateContent(project);
	},

	refreshProject : function (project) {

		var editMode = project.editMode; // access determined at Wu.Project
		
		// default menus in sidepane
		var panes = this._getPaneArray(project);

		// set menu height
		if (this.paneOpen) this._setMenuHeight();									

		// remove Map pane if not editor
		if (!editMode) _.pull(panes, 'Map');
		if (!app.Account.isManager()) _.pull(panes, 'Users');

		// refresh
		this.refresh(panes);
	},

	refreshClient : function () {
		
		// set panes 
		var panes = ['Clients'];
		if (app.Account.isManager()) panes.push('Users');
		panes.push('Account'); // logout button

		// refresh
		this.refresh(panes);
	},

	// display the relevant panes
	refresh : function (panes) {

		var panes = panes || this.panes;
		this.panes = [];

		// all panes
		var all = ['Clients', 'Map', 'Documents', 'DataLibrary', 'MediaLibrary', 'Users', 'Share', 'Account'],
		    sidepane = app.SidePane;

		// panes to active
		all.forEach(function (elem, i, arr) {
			if (!sidepane[elem]) {
				sidepane[elem] = new Wu.SidePane[elem];
			}
			sidepane[elem].enable();
			this.panes.push(elem);	// stored for calculating the menu slider
		}, this);

		// panes to deactivate
		var off = all.diff(panes);
		off.forEach(function (elem, i, arr) {
			var dis = sidepane[elem];
			if (dis)  sidepane[elem].disable();
			_.pull(this.panes, elem);
		}, this);

		if (this.paneOpen) setTimeout(this._setMenuHeight.bind(this), 100); // another ugly hack! todo: refactor to avoid these type errs
			
	},

	_refresh : function () {
		// var panes = Wu.extend([], this.panes);
		var panes = this._getPaneArray();
		this.refresh(panes);
	},
	

	addPane : function (pane) {
		var panes = this._addPane(pane);
		this.refresh(panes);
	},

	_addPane : function (pane) {
		var panes = Wu.extend([], this.panes);
		panes.push(pane);
		panes = _.unique(panes);
		return panes;
	},

	removePane : function (pane) {
		var panes = this._removePane(pane);
		this.refresh(panes);
	},

	_removePane : function (pane) {
		var panes = Wu.extend([], this.panes);
		_.pull(panes, pane);
		return panes;
	},

	// close sidepane
	closePane : function () {

		// return if already closed
		if (!this.paneOpen) return;
		this.paneOpen = false;

		// Close drop down menu
		Wu.app._editorMenuPane.style.height = '0px';

		// Close menu container
		Wu.DomUtil.addClass(app._editorContentPane, 'hide-menu');

		// Make map clickable behind...
		setTimeout(function(){
			Wu.DomUtil.addClass(app._editorContentPane, 'displayNone');	
		}, 300)

		// refresh leaflet
		this._refreshLeaflet();

		// todo: what if panes not there?
		Wu.DomUtil.removeClass(app.SidePane.Documents._content, 'show'); 	// refactorrr
		Wu.DomUtil.removeClass(app.SidePane.DataLibrary._content, 'show');
		Wu.DomUtil.removeClass(app.SidePane.Users._content, 'show');

	},

	_closePane : function () {				// refactor: move to SidePane.Item ... 
		// noop
	},	

	// open sidepane
	openPane : function () {


		// return if already open
		if (this.paneOpen) return;
		this.paneOpen = true;

		// open
		Wu.DomUtil.addClass(app._active, 'show');
		Wu.DomUtil.removeClass(app._editorContentPane, 'displayNone');

		// Have to set a micro timeout, so that it doesn't mess with the displayNone class above
		setTimeout(function() {
			Wu.DomUtil.removeClass(app._editorContentPane, 'hide-menu');
		}, 10)

		// refresh leaflet
		this._refreshLeaflet();

		if ( Wu.app.mobile ) this.openOnMobile();
		
	},

	// By Jørgen ~ Do not open full screen panes
	openOnMobile : function () {

		if ( app._activeMenuItem == 'documents' || app._activeMenuItem == 'dataLibrary' || app._activeMenuItem == 'users') {
			app.SidePane.Clients.activate();	
		}
	},

	widenContainer : function () {
		this._container.style.width = '100%';
	},

	_refreshLeaflet : function () {
		setTimeout(function() {
			var map = Wu.app._map;
			if (map) map.reframe();
		}, 300); // time with css
	},

	
});;Wu.SidePane.Item = Wu.Class.extend({
        _wu : 'sidepane.item', 
	
	type : 'item',

	initialize : function () {
		Wu.setOptions(this, Wu.app.options);
		this.render();
	},

	render : function () {
		this.initContainer();  // will be lower-most function first, if available (ie. 'this' is context from where fn was run)
		this.initContent();
		this.addHooks();
		this.disable();
	},


	initContainer : function () {
		// menu
		var className = 'q-editor-menu-item ' + this.type;
		this._menu = Wu.DomUtil.create('div', className, Wu.app._editorMenuPane);
		this._title = Wu.DomUtil.create('a', this.type, this._menu);
		this._title.innerHTML = Wu.Util.capitalize(this.title || this.type);

		// content
		var className = 'q-editor-content-item ' + this.type;
		this._content = Wu.DomUtil.create('div', className, Wu.app._editorContentPane);

		// scroll wrapper
		this._scrollWrapper = Wu.DomUtil.create('div', 'editor-scroll-wrapper', this._content);

		// wrapper 
		this._container = Wu.DomUtil.create('div', 'editor-wrapper', this._scrollWrapper);


	},

	initContent : function () {

	},

	addHooks : function () {
		// menu items bindings
		Wu.DomEvent.on(this._menu, 'mousedown', this._clickActivate, this); // click
		Wu.DomEvent.on(this._menu, 'mouseenter', this._mouseenter, this);   // mouseEnter
		Wu.DomEvent.on(this._menu, 'mouseleave', this._mouseleave, this);   // mouseLeave
	},

	_mouseenter : function (e) {
		Wu.DomUtil.addClass(this._menu, 'red');
	},

	_mouseleave : function (e) {
		Wu.DomUtil.removeClass(this._menu, 'red');
	},

	// if clicking on already active tab, toggle it
	_reclick : function () {

		// var __map = Wu.DomUtil.get("map"); // (j)
		var _menusliderArrow = Wu.DomUtil.get("menuslider-arrow"); // (j)

		// if open
		if (Wu.app.SidePane.paneOpen) {

			// hack to hide fullscreen tabs (documents, datalib, users);	
			Wu.DomUtil.removeClass(Wu.app._active, 'show');			
			
			// close pane
			Wu.app.SidePane.closePane();

			// Remove blur on map... (j)
			// Wu.DomUtil.removeClass(__map, "map-blur")
			Wu.DomUtil.removeClass(app._mapPane, "map-blur")
			

		// if closed
		} else {
			
			// hack to hide fullscreen tabs (documents, datalib, users);
			Wu.DomUtil.addClass(Wu.app._active, 'show');	// hack
			
			// open pane
			Wu.app.SidePane.openPane();

			// Blurs the map on full page panes... (j)
			var clist = Wu.app._active.classList;
			if (_.contains(clist, 'fullpage-documents') 	|| 
			    _.contains(clist, 'data-library') 		|| 
			    _.contains(clist, 'fullpage-users') 	){

				// Wu.DomUtil.addClass(__map, "map-blur");
				Wu.DomUtil.addClass(app._mapPane, "map-blur");

			}

		}
	},


	_clickActivate : function (e) {

		// To open fullscreen tabs that's been closed
		if ( Wu.app.mobile ) this.mobileReActivate();

		// if clicking on already active tab, toggle it
		// if (Wu.app._activeMenu == this) return this._reclick();
		if (Wu.app._activeMenu == this) return;

		// open pane if not closed
		if (!Wu.app.SidePane.paneOpen) Wu.app.SidePane.openPane();

		// continue tab activation
		this.activate();

	},

	mobileReActivate : function () {

		this.activate();

		if ( app._activeMenuItem == 'documents' || app._activeMenuItem == 'dataLibrary' || app._activeMenuItem == 'users' ) {

			Wu.DomUtil.addClass(Wu.app._active, 'show')						
			this.mobileFullScreenAdjustment();
		}
	},

	
	activate : function (e) {

		console.log('activate sidepane menu item', this);
	
		// set active menu
		var prev = Wu.app._activeMenu || false;
		Wu.app._activeMenu = this;
		    
		// active content                        
		Wu.app._active = this._content;  
		app._activeMenuItem = this.type;

		// check vertical swipe action    (j)
		this.checkSwipe(prev);

		// add active to menu 		  (j)
		if (prev) { Wu.DomUtil.removeClass(prev._menu, 'active'); }
		Wu.DomUtil.addClass(this._menu, 'active');

		// call deactivate on previous for cleanup  (j)
		if (prev) { prev._deactivate(); };

		// activate local context
		this._activate();

		// update pane
		this.update();   //todo: refactor: now it's _update, _updateContent, refresh all over tha place

	},


	mobileFullScreenAdjustment : function () {
			
		Wu.app._editorMenuPane.style.opacity = 0; // This is .q-editor-content
		Wu.DomUtil.removeClass(app.SidePane._mobileFullScreenCloser, 'displayNone', this);
		// app._activeMenuItem = undefined;
		app.SidePane.fullscreen = true;
	},


	_activate : function () {

	},

	_deactivate : function () {

	},

	// check swipe of sidepane on selecting menu item (j)
	checkSwipe : function (prev) {

		if (prev) return this.swiper(prev);

		// Hide the Deactivated Pane
		if (Wu.app._active) Wu.DomUtil.removeClass(Wu.app._active, 'show')

		// Show the Activated Pane                              
		Wu.app._active = this._content;
		Wu.DomUtil.addClass(Wu.app._active, 'show');                                    
	
	},

	// do swipe of sidepane when selecting menu item, by jorgen
	swiper : function (prev) {

		
		// Button height
		if ( !Wu.app.mobile ) {
			var bHeight = 70;
		} else {
			var bHeight = 50;
		}

		// set vars
		var swypefrom = prev._content;
		var swypeto = Wu.app._active;

		// if same, do nothing
		
		if (swypefrom == swypeto) return;
		

		// update the slider on the left    
		var h = bHeight;
		var menuslider = Wu.DomUtil.get('menuslider');
		   
		// get classy
		var classy = this._menu.classList;

		// set width depending on whether pane is open or not
		var open = Wu.app.SidePane.paneOpen;
		var w = '100px';
		if (open) w = '400px';
	
		var __map = Wu.DomUtil.get("map");

		// Make sure that menuslider arrow is there (j)
		var _menusliderArrow = Wu.DomUtil.get("menuslider-arrow"); // (j)
		_menusliderArrow.style.width = '9px'; // (j)


		// check which 
		// if (_.contains(classy, 'clients')) {
		if ( app._activeMenuItem == 'clients' ) {	
			menuslider.style.top = '0px';
			Wu.app.SidePane._container.style.width = w;
			Wu.DomUtil.removeClass(__map, "map-blur")
		}

		// if (_.contains(classy, 'map')) {
		if ( app._activeMenuItem == 'map' ) {
			var n = app.SidePane.panes.indexOf('Map');		// calculate position
			menuslider.style.top = h * n + 'px';
			Wu.app.SidePane._container.style.width = w;
			Wu.DomUtil.removeClass(__map, "map-blur")
		}
	    
		// if (_.contains(classy, 'documents')) {
		if ( app._activeMenuItem == 'documents' ) {	
			var n = app.SidePane.panes.indexOf('Documents');
			menuslider.style.top = h * n + 'px';
			Wu.app.SidePane._container.style.width = '100%';
			Wu.DomUtil.addClass(__map, "map-blur")

			// Mobile option
			if ( Wu.app.mobile ) this.mobileFullScreenAdjustment();

		}
	    
		// if (_.contains(classy, 'dataLibrary')) {
		if ( app._activeMenuItem == 'dataLibrary' ) {
			var n = app.SidePane.panes.indexOf('DataLibrary');
			menuslider.style.top = h * n + 'px';
			Wu.app.SidePane._container.style.width = '100%';
			Wu.DomUtil.addClass(__map, "map-blur");

			// Mobile option
			if ( Wu.app.mobile ) this.mobileFullScreenAdjustment();

		}
	    

	    	// if (_.contains(classy, 'mediaLibrary')) {
		if ( app._activeMenuItem == 'mediaLibrary' ) {
			var n = app.SidePane.panes.indexOf('MediaLibrary');
			menuslider.style.top = h * n + 'px';
			Wu.app.SidePane._container.style.width = '100%';
			Wu.DomUtil.addClass(__map, "map-blur")

			// Mobile option
			if ( Wu.app.mobile ) this.mobileFullScreenAdjustment();

		}


		// if (_.contains(classy, 'users')) {
		if ( app._activeMenuItem == 'users' ) {			
			var n = app.SidePane.panes.indexOf('Users');
			menuslider.style.top = h * n + 'px';
			Wu.app.SidePane._container.style.width = '100%';
			Wu.DomUtil.addClass(__map, "map-blur")

			// Mobile option
			if ( Wu.app.mobile ) this.mobileFullScreenAdjustment();

		}
				

		// if (_.contains(classy, 'share')) {
		if ( app._activeMenuItem == 'share' ) {
			var n = app.SidePane.panes.indexOf('Share');
			menuslider.style.top = h * n + 'px';
			Wu.app.SidePane._container.style.width = '100%';
			Wu.DomUtil.removeClass(__map, "map-blur")
		}
				
		
		// Find out what to swipe from
		// The Sliders Container
		var _content_container = document.getElementsByTagName('menu')[0];		// refactor
	    
		// Create some vars
		var swipethis, swfrom, swto, swipeOut, swipeIn;
		
		// Find all the swipeable elements....
		var _under_dogs = _content_container.getElementsByTagName('div');		// refactor
				
		// Find what position the swipe from and to is in the array
		for ( var a = 0; a<_under_dogs.length;a++) {
			if ( _under_dogs[a] == prev._menu ) { swfrom = a; }                 
			if ( _under_dogs[a] == this._menu ) { swto = a; }
		}
	
		    
		// Hide the Deactivated Pane
		if (Wu.app._active) Wu.DomUtil.removeClass(swypefrom, 'show');
			
		// Swipe this IN
		Wu.DomUtil.addClass(swypeto, 'show');	


			
	},



	updateContent : function (project) {

	},

	_addHook : function (elem, event, fn, uuid) {
		Wu.DomEvent.on(elem, event, fn, uuid);
	},


	disable : function () {

		// disable click
		Wu.DomEvent.off(this._menu, 'mousedown', this._clickActivate, this); 

		// add disabled class
		Wu.DomUtil.addClass(this._menu, 'disabled');

	},

	enable : function () {

		// enable click
		Wu.DomEvent.on(this._menu, 'mousedown', this._clickActivate, this); 

		// remove disabled class
		Wu.DomUtil.removeClass(this._menu, 'disabled');
	},

	remove : function () {
		delete this._menu;
		delete this._content;
		delete this;
	},

	setContentHeight : function () {
		this.calculateHeight();
		this._content.style.maxHeight = this.maxHeight + 'px';
		this._scrollWrapper.style.maxHeight = parseInt(this.maxHeight - 20) + 'px';
	},

	// active for Projects tab (ie. Clients)
	calculateHeight : function () {

		var screenHeight   = window.innerHeight,
		    legendsControl = app.MapPane.legendsControl,
		    height         = -107 + screenHeight;

		// if ( Wu.app.mobile ) {
		// 	this.maxHeight = Wu.app.nativeResolution[0] - 87;
		// 	return;
		// }

		if (!legendsControl) {
			this.maxHeight = height - 6;
			return;
		}
		
		var legendsHeight = parseInt(legendsControl._legendsHeight);


		if (legendsControl._isOpen) {
			height -= legendsHeight;
		} else {
			height -= 6;
		}

		this.maxHeight = height;
	},

});

;// Projects and Clients
Wu.SidePane.Clients = Wu.SidePane.Item.extend({
	_ : 'sidepane.clients', 
	type : 'clients',
	title : 'Projects',

	initialize : function () {
		Wu.SidePane.Item.prototype.initialize.call(this)

		// active by default
		this.activate();      
	},

	initContent : function () {

		this.clients = [];

		// clients container
		this._clientsContainer = Wu.DomUtil.create('div', 'editor-clients', this._container);

		// insert clients
		this.options.json.clients.forEach(function(c, i, arr) {    
			var client = new Wu.SidePane.Client(c);
			client.addTo(this._clientsContainer);
			this.clients.push(client);
		}, this);

      		// insert create client button
		if (app.Account.canCreateClient()) this._insertNewClientButton();	

		// add tooltip
		app.Tooltip.add(this._menu, 'Here is a list of clients and projects you have access to.');


	},

	_insertNewClientButton : function () {
		
		// create New Client button
		var classname = 'smap-button-white new-client ct11 ct16 ct18';
		var newClientButton = this._newClientButton = Wu.DomUtil.create('div', classname, this._clientsContainer, '+');
		newClientButton.id = 'new-client-button';

		// add trigger
		this._addHook(newClientButton, 'click', this.newClient, this);

		// add tooltip
		app.Tooltip.add(newClientButton, 'Click to create new client');

	},

	addHooks : function () {
		Wu.SidePane.Item.prototype.addHooks.call(this);
	},

	_activate : function () {

	},

	_deactivate : function () {
		this.clients.forEach(function (client) {
			client.close();
		}, this);
	},

	_create : function (c) {
		var client = new Wu.SidePane.Client(c);
		client.addTo(this._clientsContainer);
		this.clients.push(client);
	},
	
	openClient : function (client) {
		this._container.style.height = '';
	},

	closeClient : function (client) {
		// console.log('close client: ', client.name);
	},

	remove : function () {
		var client = this;
		var text = 'Are you sure you want to DELETE the client ' + client.name + '?';
		var text2 = 'Are you REALLY sure you want to DELETE the client ' + client.name + '? This CANNOT be undone!';
		if (confirm(text)) {
			if (confirm(text2)) {
				client._delete();  
			}
		}
	},

	_createNew : function () {
		this.newClient();
	},

	newClient : function () {

		// add new client box
		var clientData = {
			clientName : 'New client'
		}
			
		// prepend client to container
		Wu.DomUtil.appendTemplate(this._clientsContainer, ich.editorClientsNew(clientData));

		// move new button to last
		Wu.DomUtil.remove(this._newClientButton);
		this._clientsContainer.appendChild(this._newClientButton);

		// set hooks: confirm button
		var target = Wu.DomUtil.get('editor-client-confirm-button');
		this._addHook(target, 'click', this._confirm, this);

		// cancel button
		var target = Wu.DomUtil.get('editor-client-cancel-button');
		this._addHook(target, 'click', this._cancel, this);

		// set hooks: writing name
		var name = Wu.DomUtil.get('editor-client-name-new');
		this._addHook(name, 'keyup', this._checkSlug, this);


	},

	_checkSlug : function () {

		// clear
		clearTimeout(this._timer);
		
		// check
		var that = this;
		this._timer = setTimeout(function() {
			var name = Wu.DomUtil.get('editor-client-name-new'),
			    slug = Wu.Util.trimAll(name.value).toLowerCase(),
			    json = JSON.stringify({ 'slug' : slug}),
			    path = '/api/client/unique';

			// post       path   data    callback   context of cb
			Wu.Util.postcb(path, json, that._checkedSlug, that);

		}, 500);               
	},

	_checkedSlug : function (editor, raw) {
		var json = JSON.parse(raw);  

		// return enabled if unique
		if (json.unique) return editor._enableConfirm();

		// if error                             	// TODO error handling
		if (json.error) { console.log(json); return; }

		// not unique, change needed
		editor._disableConfirm();
		
	},

	_disableConfirm : function () {
		var target = Wu.DomUtil.get('editor-client-confirm-button');           // TODO: real block of button
		target.style.backgroundColor = 'red';
		console.log('Client name is not unique.')
	},

	_enableConfirm : function () {
		var target = Wu.DomUtil.get('editor-client-confirm-button');
		target.style.backgroundColor = '';
		// console.log('Client name OK.');
	},

	_cancel : function () {
		// remove edit box
		var old = Wu.DomUtil.get('editor-clients-container-new').parentNode;
		Wu.DomUtil.remove(old);
	},

	_confirm : function () {

		// get client vars
		var clientName = Wu.DomUtil.get('editor-client-name-new').value;
		var clientDescription = Wu.DomUtil.get('editor-client-description-new').value;
		var clientKeywords = Wu.DomUtil.get('editor-client-keywords-new').value;
		
		var options = {
			name : clientName,
			description : clientDescription,
			keywords : clientKeywords
		}

		var client = new Wu.Client(options);
		client.saveNew(); // callback = this._created below
	},

	_created : function(client, json) {       // this is the http callback        
		var editor = Wu.app.SidePane.Clients;
		var options = JSON.parse(json);
	       
		// update Client object
		Wu.extend(client, options);
		Wu.app.Clients[client.uuid] = client;

		// remove edit box
		var old = Wu.DomUtil.get('editor-clients-container-new').parentNode;
		Wu.DomUtil.remove(old);

		// add permissions
		var user = app.Account;
		console.log('adding perm: ', client.getUuid());
		user.addUpdateClient(client);
	       		
		// create client in DOM
		editor._create(client);

		// set active
		client.setActive();

		// move new button to last
		Wu.DomUtil.remove(editor._newClientButton);
		editor._clientsContainer.appendChild(editor._newClientButton);
	},

	toggleEdit : function (e) { // this = client
		// console.log('toggle.edit');

		// stop propagation
		if (e) Wu.DomEvent.stop(e); 

		var client = this;
		var wrapper = Wu.DomUtil.get('editor-client-edit-wrapper-' + client.uuid);
		var container = Wu.DomUtil.get('editor-clients-container-' + client.uuid);
		if (client.options.editMode) {
			// hide dom
			Wu.DomUtil.removeClass(container, 'client-editor-open');
			Wu.DomUtil.removeClass(wrapper, 'client-editor-open');
			client.options.editMode = false;
		} else {
			// show dom
			Wu.DomUtil.addClass(container, 'client-editor-open');
			Wu.DomUtil.addClass(wrapper, 'client-editor-open');
			client.options.editMode = true;
		}
	},

	_addHook : function (elem, event, fn, uuid) {
		Wu.DomEvent.on(elem, event, fn, uuid);
	},

	select : function (client) {
		// skip if already selected
		if (Wu.app._activeClient == client) return; 

		// set active
		client.setActive(); // this = Wu.Client

		// reset active project
		if (Wu.app.activeProject) Wu.app.activeProject.unload();
		
		// refresh SidePane
		Wu.app.SidePane.Clients.refreshSidePane();
		
		// set client name in subheaders
		Wu.app.SidePane.setSubheaders();

	},

	refreshSidePane : function () {

		// refresh
		Wu.app.SidePane.refreshClient();

		// update SidePane.Users
		Wu.app.SidePane.Users.update();

	},

	_select : function () {
		var that = Wu.app.SidePane.Clients;   
		if (that._previousSelect) Wu.DomUtil.removeClass(that._previousSelect, 'active-client');
		Wu.DomUtil.addClass(this, 'active-client');
		that._previousSelect = this;
	},

	selectProject : function () {
		var project = this;
		project.setActive();         
	},

	disable : function () {
		// noop
	},

	update : function () {
		// noop
		// this.setContentHeight();
	},


});
;// Subelements under Clients/Client
Wu.SidePane.Project = Wu.Class.extend({

	initialize : function (project, options) {

		// set options
		Wu.setOptions(this, options);

		// set project
		this.project = project;

		// set edit mode
		this.project.setEditMode();

		// set this as sidepane item
		this.project.setSidepane(this);

		// set parent
		this._parent = this.options.parent; // client div container

		// init layout
		this.initLayout(); 
		
		// update content
		this.update();

		return this;
	},

	initLayout : function () {

		// create container
		this._container = Wu.DomUtil.create('div', 'project-item');

		// create title
		this.name = Wu.DomUtil.create('div', 'project-title', this._container);
		this.name.type = 'name';

		// create description
		this.description = Wu.DomUtil.create('div', 'project-description', this._container);
		this.description.type = 'description';

		// create logo
		this.logoContainer = Wu.DomUtil.create('div', 'project-logo-container', this._container)
		this.logo = Wu.DomUtil.create('img', 'project-logo', this.logoContainer);
		this.logo.type = 'logo';

		// Project info box (with little "i")
		this.users = Wu.DomUtil.create('div', 'project-users-wrap', this._container);


		// ****************************************************************************
		// ****************************************************************************


		// this.usersInnerWrapper = Wu.DomUtil.create('div', 'project-users-inner-wrapper', this.users);
		this.usersInnerWrapper = Wu.DomUtil.create('div', 'project-users-inner-wrapper', this._container);

		// Project stats header
		this.projectStatsHeader = Wu.DomUtil.create('div', 'project-stats', this.usersInnerWrapper);
		this.projectStatsHeader.innerHTML = 'Project status:'

		// create createdBy
		this.createdBy = Wu.DomUtil.create('div', 'project-createdby', this.usersInnerWrapper);

		// create createdDate
		this.createdDate = Wu.DomUtil.create('div', 'project-createddate', this.usersInnerWrapper);

		// create lastModified
		this.lastUpdated = Wu.DomUtil.create('div', 'project-lastupdated', this.usersInnerWrapper);

		this.usersInner = Wu.DomUtil.create('div', 'project-users', this.usersInnerWrapper);

		// add delete button
		var canDelete = app.Account.canDeleteProject(this.project.store.uuid);
		console.log('canDelete? ', canDelete);
		if (canDelete || this.options.editMode) {
		
			this.makeThumb = Wu.DomUtil.create('div', 'new-project-thumb', this.usersInnerWrapper, 'Generate thumbnail');
			this.kill = Wu.DomUtil.create('div', 'project-delete', this.usersInnerWrapper, 'Delete project');			
		}




		// ****************************************************************************
		// ****************************************************************************

		this.hookThumb();


		// add hooks
		this.addHooks();

	},

	hookThumb : function () {

		// This project ID
		this.project._sidePaneLogoContainer = this.logo;

	},

	expandUsers : function () {
		// Wu.DomUtil.addClass(this.usersInner, 'expand');
	},

	collapseUsers : function () {
		// Wu.DomUtil.removeClass(this.usersInner, 'expand');
	},

	update : function (project) {

		this.project 			= project || this.project;
		this.name.innerHTML 		= this.project.store.name;
		this.description.innerHTML 	= this.project.store.description;

		var logoPath = this.project.store.logo ? this.project.store.logo :  '/css/images/defaultProjectLogo.png';
		this.logo.src = logoPath;

		this.createdBy.innerHTML 	= '<div class="project-info-left">Created by:</div><div class="project-info-right">' + this.project.store.createdByName + "</div>";
		this.lastUpdated.innerHTML 	= '<div class="project-info-left">Last updated:</div><div class="project-info-right">' + Wu.Util.prettyDate(this.project.store.lastUpdated) + "</div>";
		this.createdDate.innerHTML 	= '<div class="project-info-left">Created time:</div><div class="project-info-right">' + Wu.Util.prettyDate(this.project.store.created) + "</div>";
		this.usersInner.innerHTML       = '<div class="project-users-header">Project users:</div>' + this.project.getUsersHTML();
	},


	addHooks : function () {

		// select, stop
		Wu.DomEvent.on(this._container, 'click',      this.select, this);
		Wu.DomEvent.on(this._container, 'mousedown',  Wu.DomEvent.stopPropagation, this);	// to prevent closing of project pane
	
		// add edit hooks
		if (this.project.editMode) this.addEditHooks();

		// Toggle project info box
		Wu.DomEvent.on(this.users, 'mousedown', this.toggleProjectInfo, this);
		Wu.DomEvent.on(this.users, 'click mousedown', Wu.DomEvent.stopPropagation, this);
		
	},


	toggleProjectInfo : function () {

		// Get some heights
		var parentHeight = this._parent._container.offsetHeight;
		var projectInfoHeight = this.usersInnerWrapper.offsetHeight;		

		console.log('toggleProjecTInfo', this.users);

		if ( !this.project._menuItem._isOpen ) {

			// Add open state to button
			Wu.DomUtil.addClass(this.users, 'active-project-user-button');

			// Set Project Height
			this._container.style.height = projectInfoHeight + 110 + 'px';

			// Set Client container height
			this._parent._container.style.height = parentHeight + projectInfoHeight + 'px';

			// Set open state
			this.project._menuItem._isOpen = true;

		} else {

			// Remove open state to button
			Wu.DomUtil.removeClass(this.users, 'active-project-user-button');

			// Set Project Height
			this._container.style.height = 111 + 'px';

			// Set Client container height
			this._parent._container.style.height = parentHeight - projectInfoHeight + 'px';

			// Set open state			
			this.project._menuItem._isOpen = false;

		}



	},

	removeHooks : function () {

		// select, stop
		Wu.DomEvent.off(this._container, 'click', this.select, this);
		Wu.DomEvent.off( this._container, 'mousedown', Wu.DomEvent.stopPropagation, this);

		// remove edit hooks
		if (this.project.editMode) this.removeEditHooks();
	},

	addEditHooks : function () {

		if (!this.project.editMode) return;

		// editing hooks
		Wu.DomEvent.on(this.name, 	 'dblclick', this.edit, this);
		Wu.DomEvent.on(this.description, 'dblclick', this.editDescription, this);

		// add dz to logo
		this.addLogoDZ();

		// add kill hook
		if (app.Account.canDeleteProject(this.project.getUuid())) {
			Wu.DomEvent.on(this.kill, 'click', this.deleteProject, this);

			Wu.DomEvent.on( this.makeThumb, 'click', this.makeNewThumbnail, this );
			Wu.DomEvent.on( this.makeThumb, 'mousedown click', Wu.DomEvent.stopPropagation, this );
		}
	},

	removeEditHooks : function () {

		// editing hooks
		Wu.DomEvent.off(this.name, 	  'dblclick', this.edit, this);
		Wu.DomEvent.off(this.description, 'dblclick', this.editDescription, this);

		// remove dz
		this.removeLogoDZ();

		// remove kill hook
		if (app.Account.canDeleteProject(this.project.getUuid())) {
			Wu.DomEvent.off(this.kill, 'click', this.deleteProject, this);

			Wu.DomEvent.off( this.makeThumb, 'click', this.makeNewThumbnail, this );
			Wu.DomEvent.off( this.makeThumb, 'mousedown click', Wu.DomEvent.stopPropagation, this );
		}
	},


	makeNewThumbnail : function () {

		// Set state to manually updated to prevet overriding
		// app.Projects[this.project.store.uuid].store.sidePaneLogo.manuallyUpdated = true;
		this.project.setThumbCreated(true);
		this.project.createProjectThumb();

	},

	// edit hook for client logo
	addLogoDZ : function () {

		// create dz
		this.logodz = new Dropzone(this.logo, {
				url : '/api/project/uploadlogo',
				createImageThumbnails : false,
				autoDiscover : false
		});
		
		// set client uuid param for server
		this.logodz.options.params.project = this.project.getUuid();

		// set callback on successful upload
		var that = this;
		this.logodz.on('success', function (err, path) {
			that.editedLogo(path);
		});

		// set image frame with editable clas
		Wu.DomUtil.addClass(this.logo, 'editable');

	},

	removeLogoDZ : function () {
		// disable edit on logo
		if (this.logodz) this.logodz.disable();
		delete this.logodz;

		// set image frame without editable clas
		Wu.DomUtil.removeClass(this.logo, 'editable');
	},


	editedLogo : function (path) {

		// Set state to manually updated to prevet overriding
		this.project.setThumbCreated(true);

		// set path
		var fullpath = '/images/' + path;
		
		// set new image and save
		this.project.setLogo(fullpath);

		// update image 
		this.logo.src = this.project.getLogo();

		// update header
		app.HeaderPane.addedLogo(path);
	},

	addTo : function (container) {
		container.appendChild(this._container);
		return this;
	},

	addToBefore : function (container) {
		// insert second to last
		var last = container.lastChild;
		container.insertBefore(this._container, last);
	},

	remove : function (container) {
		Wu.DomUtil.remove(this._container);
		return this;
	},

	open : function () {
		// if (this._parent) this._parent._container.style.overflow = 'visible';
	},

	close : function () {
		// if (this._parent) this._parent._container.style.overflow = 'hidden';
	},

	openInfo : function () {
		this.users.style.opacity = 1;
	},

	closeInfo : function () {
		this.users.style.opacity = 0;
	},

	select : function (e) {

		// dont select if already active
		if (this.project == app.activeProject) return;         // todo: activeProject is set at beginning, even tho not active.. fix!

		// select project
		this.project.select();

		// remove startpane if active
		app.StartPane.deactivate();
	},

	// add class to mark project active in sidepane
	_markActive : function () {
		var projects = app.Projects;
		for (p in projects) {
			var project = projects[p];
			if (project._menuItem) project._menuItem._unmarkActive();
		}
		Wu.DomUtil.addClass(this._container, 'active-project');
	},
	
	_unmarkActive : function () {
		Wu.DomUtil.removeClass(this._container, 'active-project');
	},

	// edit title
	edit : function (e) {
		
		// return if already editing
		if (this.editing) return;
		this.editing = true;

		var div = e.target;
		var type = div.type;
		var value = div.innerHTML;

		var input = ich.injectProjectEditInput({value:value});
		div.innerHTML = input;

		// focus
		var target = div.firstChild;
		target.focus();
		target.selectionStart = target.selectionEnd;	// prevents text selection

		// save on blur or enter
		Wu.DomEvent.on( target,  'blur',    this._editNameBlur, this );     // save folder title
		Wu.DomEvent.on( target,  'keyup', this._editKeyName,  this );     // save folder title

	},

	_editNameBlur : function (e) {

		// get value
		var value = e.target.value;

		// if not valid slug, add salt
		if (!this._valid) value += '_2';

		// revert to <div>
		var div = e.target.parentNode;
		div.innerHTML = value;

		// if name, change slug also
		this.project.setSlug(value);

		// save latest
		this.project.setName(value);

		// save header also
		this.project.setHeaderTitle(value);

		// update header view
		app.HeaderPane.setTitle(value);

		this.editing = false;

	},

	editDescription : function (e) {
		
		// return if already editing
		if (this.editing) return;
		this.editing = true;

		var div = e.target;
		var type = div.type;
		var value = div.innerHTML;

		div.innerHTML = '';
		var input = Wu.DomUtil.create('textarea', 'project-edit-textarea', div);
		input.innerHTML = value;

		// focus
		var target = input;
		target.focus();
		target.selectionStart = target.selectionEnd;	// prevents text selection

		// save on blur or enter
		Wu.DomEvent.on( target,  'blur',    this._editDescriptionBlur, this );     // save folder title
		Wu.DomEvent.on( target,  'keydown', this._editKey,  this );     // save folder title

	},

	_editDescriptionBlur : function (e) {
		
		// get value
		var value = e.target.value;

		// revert to <div>
		var div = e.target.parentNode;
		div.innerHTML = value;

		// save project description
		this.project.setDescription(value);

		// save header subtitle also
		this.project.setHeaderSubtitle(value);

		// update header view
		app.HeaderPane.setSubtitle(value);

		// mark done
		this.editing = false;

	},

	_editKey : function (e) {
		// blur on enter
		if (event.which == 13 || event.keyCode == 13) e.target.blur();
	},

	_editKeyName : function (e) {
		// blur on enter
		if (event.which == 13 || event.keyCode == 13) e.target.blur();

		var value = e.target.value,
		    that = this;

		// sanitize value: remove white space
		value = value.replace(/\s+/g, '');

		// check unique slug         // callback	
		this._checkUniqueSlug(value, function (ctx, json) {
			var result = JSON.parse(json);
			!result.unique ? that._notUnique(e.target) : that._unique(e.target);
		});
	},

	_unique : function (div) {
		this._valid = true;
		Wu.DomUtil.removeClass(div, 'invalid');
	},

	_notUnique : function (div) {
		this._valid = false;

		Wu.DomUtil.addClass(div, 'invalid');
	},

	_checkUniqueSlug : function (value, callback) {

		var json = JSON.stringify({
			value : value,
			project : this.project.getUuid(),
			client : this.project.getClient().getUuid()
		});

		// post
		Wu.post('/api/project/unique', json, callback, this);
	},


	deleteProject : function (e) {

		// prevent project select
		Wu.DomEvent.stop(e);

		// todo: add extra access checks? no better security really... 

		var answer = confirm('Are you sure you want to delete project ' + this.project.store.name + '?');
		if (!answer) return;

		var second = confirm('Are you REALLY sure you want to delete project ' + this.project.store.name + '? You cannot UNDO this action!');
		if (!second) return; 

		// twice confirmed, delete
		this.confirmDelete();

	},

	confirmDelete : function () {

		// remove hooks
		this.removeHooks();
	
		// remove from client 
		this._parent.removeProject(this.project);
		
		// remove from DOM
		Wu.DomUtil.remove(this._container);

		// if project is active, unload
		if (this.project == app.activeProject) {

			// unload
			this.project.unload();
		
			// activate startpane
			// running a little timer on this, otherwise it's not deleted properly and thumb will still show on startpane...
			setTimeout(function() {
				app.StartPane.activate();
			}, 200)
			
			// close statuspane
			app.StatusPane.close();
		}

		// delete
		this.project._delete();
		delete this;
	}



});;// subelements in clients sidepane
Wu.SidePane.Client = Wu.Class.extend({


	initialize : function (client) {

		// set client object
		this.client = app.Clients[client.uuid];

		// set edit mode
		this.editable = app.Account.canCreateClient();

		// init layout
		this.initLayout(); 

		// fill in 
		this.update();		

		return this;		// only added to DOM after return
	},

	initLayout : function () {

		// create container
		this._container = Wu.DomUtil.create('div', 'editor-clients-container');

		// create title
		this.title = Wu.DomUtil.create('div', 'client-title', this._container);

		// create description
		this.description = Wu.DomUtil.create('div', 'client-description', this._container);

		// create logo
		this.logoContainer = Wu.DomUtil.create('div', 'client-logo-container', this._container);
		this.logo = Wu.DomUtil.create('img', 'client-logo', this.logoContainer);


		// create projects container
		this._projectsContainer = Wu.DomUtil.create('div', 'projects-container', this._container);

	},


	addTo : function (container) {
		
		// append
		container.appendChild(this._container);
		
		// add hooks
		this.addHooks();

		// add edit hooks
		if (this.editable) this.addEditHooks();
		
		return this;
	},

	remove : function (container) {
		Wu.DomUtil.remove(this._container);
		return this;
	},
	

	update : function () {

		// update client meta
		this.title.innerHTML 	    = this.client.getName();
		this.description.innerHTML  = this.client.getDescription();
		
		
		if ( this.client.getLogo() ) var imageAttr = this.client.getLogo();			
		else var imageAttr = '/css/images/defaultProjectLogo.png';
		this.logo.src = imageAttr;

		Wu.DomUtil.thumbAdjust(this.logo, 70);
		
		// insert client's projects
		this.insertProjects();

	},

	insertProjects : function (projects) {
		var client = this.client;

		// get client's projects
		this.projects = _.filter(Wu.app.Projects, function (p) { return p.store.client == client.getUuid(); });

		// return if no projects, add + button 
		if (!this.projects) return this.editButtons();

		// sort by date created
		this.projects = _.sortBy(this.projects, function (l) { return l.store.lastUpdated; });  // todo: different sorts
		this.projects.reverse();								// sort descending

		// for each
		this.projects.forEach(function (p){

			// new project item view
			var options = {
				parent : this
			}
			var projectDiv = new Wu.SidePane.Project(p, options);

			// app to client
			projectDiv.addTo(this._projectsContainer);

		}, this);

		// add + project button
		this.editButtons();

		// calculate heights
		this.calculateHeight();

	},

	editButtons : function () {

		// remove old
		if (this._newProjectButton) Wu.DomUtil.remove(this._newProjectButton);
		if (this._removeClientButton) Wu.DomUtil.remove(this._removeClientButton);

		// create project button
		if (app.Account.canCreateProject()) {
			var className = 'smap-button-white new-project-button';
			this._newProjectButton = Wu.DomUtil.create('div', className, this._projectsContainer, '+');
			Wu.DomEvent.on(this._newProjectButton, 'mousedown', this.createNewProject, this);
			Wu.DomEvent.on(this._newProjectButton, 'mousedown', Wu.DomEvent.stop, this);
			Wu.DomEvent.on(this._newProjectButton, 'click', Wu.DomEvent.stop, this);


			// add tooltip
			app.Tooltip.add(this._newProjectButton, 'Click to create new project.');

		}
		
		// remove client button
		if (app.Account.canDeleteClient(this.client.uuid)) {
			this._removeClientButton = Wu.DomUtil.create('div', 'client-kill displayNone', this._container, 'Delete client');
			Wu.DomEvent.on(this._removeClientButton, 'mousedown', this.removeClient, this);

		}

	},

	removeClient : function (e) {

		// client not empty
		var p = this.projects.length;
		if (p > 0) return alert('The client ' + this.client.getName() + ' has ' + p + ' projects. You must delete these individually first before deleting client.');
		
		// confirm
		var answer = confirm('Are you sure you want to delete client ' + this.client.getName() + '?');
		if (!answer) return;

		// confirm again
		var second = confirm('Are you REALLY sure you want to delete client ' + this.client.getName() + '? You cannot UNDO this action!');
		if (!second) return; 

		// twice confirmed, delete
		this.confirmDeleteClient();

	},

	confirmDeleteClient : function () {

		// remove from DOM
		Wu.DomUtil.remove(this._container);

		// delete client
		this.client.destroy();

	},

	_lockNewProjectButton : function () {
		Wu.DomEvent.off(this._newProjectButton, 'mousedown', this.createNewProject, this);
		Wu.DomUtil.addClass(this._newProjectButton, 'inactive');

	},

	_unlockNewProjectButton : function () {
		Wu.DomEvent.on(this._newProjectButton, 'mousedown', this.createNewProject, this);
		Wu.DomUtil.removeClass(this._newProjectButton, 'inactive');

	},

	createNewProject : function () {

		// set status and lock + button
		app.setStatus('Loading...');
		this._lockNewProjectButton();

		// create project object
		var store = {
			name 		: 'Project title',
			description 	: 'Project description',
			created 	: new Date().toJSON(),
			lastUpdated 	: new Date().toJSON(),
			createdByName 	: app.Account.getName(),
			keywords 	: '',
			client 		: this.client.uuid,
			position 	: {},
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
		var options = {
			store : store
		}


		// create new project with options, and save
		var project = new Wu.Project(store);
		project.editMode = true;
		var callback = {
			callback : this._projectCreated,
			context : this
		}
		project._saveNew(callback); 

		// cxxxx
		// generate project thumb 
		// if no timeout: 	creates thumb on active project before new was selected
		// 			active project (project object) is not ready when _markActive gets triggered)

		// Of course dodgy ~ 500ms er ikke nok...

	

		// Mark this project as active
		

		
	},

	_markActive : function (newProject) {
		var projects = app.Projects;
		for (p in projects) {
			var project = projects[p];
			if (project._menuItem) project._menuItem._unmarkActive();
		}
		Wu.DomUtil.addClass(newProject._menuItem._container, 'active-project');
	},
	
	_unmarkActive : function () {
		Wu.DomUtil.removeClass(this._container, 'active-project');
	},	

	_projectCreated : function (project, json) {

		var result = JSON.parse(json);
		var error  = result.error;
		var store  = result.project;

		// return error
		if (error) return console.log('there was an error creating new project!', error);			

		// add to global store
		app.Projects[store.uuid] = project;

		// update project store
		project.setNewStore(store);

		// add to access locally
		project.addAccess();

		// create project in sidepane
		this._createNewProject(project);
		
	

	},

	// add project in sidepane
	_createNewProject : function (project) {

		// add project to client array
		this.projects.push(project);

		// new project item view
		var sidepaneProject = new Wu.SidePane.Project(project, {
			parent : this
		});

		// add to client container
		sidepaneProject.addToBefore(this._projectsContainer);

		// refresh height
		this.open();

		// select
		sidepaneProject.project._menuItem.select();

		// set status and unlock + button
		app.setStatus('Done!');
		this._unlockNewProjectButton();

		// remove startpane if active
		app.StartPane.deactivate();

		// add defaults to map
		this._addDefaults();

		// create project thumb
		project.createProjectThumb();

		// mark project div in sidepane as active
		this._markActive(project);
	},


	_addDefaults : function () {
		// add default baselayer
		if (!app.SidePane) return;
		if (!app.SidePane.Map) return;
		if (!app.SidePane.Map.mapSettings) return;
		if (!app.SidePane.Map.mapSettings.baselayer) return;
		app.SidePane.Map.mapSettings.baselayer.setDefaultLayer();
	},

	addHooks : function () {
		Wu.DomEvent.on( this._container, 'mousedown', this.toggle, this);
	},

	removeHooks : function () {
		Wu.DomEvent.off( this._container, 'mousedown', this.toggle, this);
	},

	addEditHooks : function () {
		Wu.DomEvent.on( this.title, 	  'dblclick', this.editName, 	    this );
		Wu.DomEvent.on( this.description, 'dblclick', this.editDescription, this );
		this.addLogoDZ();
	},

	removeEditHooks : function () {
		Wu.DomEvent.off( this.title, 	   'dblclick', this.editName, 	     this );
		Wu.DomEvent.off( this.description, 'dblclick', this.editDescription, this );
		this.removeLogoDZ();
	},


	editName : function () {

		// return if already editing
		if (this.editing) return;
		this.editing = true;
		
		// inject <input>
		var div = this.title;
		var value = div.innerHTML;
		div.innerHTML = ich.injectClientEditInput({ value : value }); 

		// focus
		var target = div.firstChild;
		target.focus();
		target.selectionStart = target.selectionEnd;	// prevents text selection

		// save on blur or enter
		Wu.DomEvent.on( target,  'blur',    this.editedName, this );     	// save title
		Wu.DomEvent.on( target,  'keydown', this.editKeyed,  this );           // save title

	},

	editedName : function (e) {
	
		// revert to <div>
		var target = e.target;
		var value = target.value;
		var div = this.title;
		div.innerHTML = value;

		// save latest
		this.client.setName(value);
		
		// remove listeners
		Wu.DomEvent.off( target,  'blur',    this.editedName, this );     	// save title
		Wu.DomEvent.off( target,  'keydown', this.editKeyed,  this );          // save title

		// mark not editing
		this.editing = false;

	},

	editKeyed : function (e) {
		// blur on enter
		if (event.which == 13 || event.keyCode == 13) e.target.blur();
	},

	editDescription : function () {
		// return if already editing
		if (this.editing) return;
		this.editing = true;
		
		// inject <input>
		var div = this.description;
		var value = div.innerHTML;
		div.innerHTML = ich.injectClientEditInput({ value : value }); 

		// focus
		var target = div.firstChild;
		target.focus();
		target.selectionStart = target.selectionEnd;	// prevents text selection

		// save on blur or enter
		Wu.DomEvent.on( target,  'blur',    this.editedDescription, this );     // save title
		Wu.DomEvent.on( target,  'keydown', this.editKeyed,   	    this );     // save title

	},

	editedDescription : function (e) {

		// revert to <div>
		var target = e.target;
		var value = target.value;
		var div = this.description;
		div.innerHTML = value;

		// save 
		this.client.setDescription(value);
		
		// remove listeners
		Wu.DomEvent.off( target,  'blur',    this.editedDescription, this );    // save title
		Wu.DomEvent.off( target,  'keydown', this.editKeyed,   	     this );    // save title

		// mark not editing
		this.editing = false;

	},

	
	// edit hook for client logo
	addLogoDZ : function () {

		// create dz
		this.logodz = new Dropzone(this.logo, {
				url : '/api/client/uploadlogo',
				createImageThumbnails : false,
				autoDiscover : false
		});
		
		// set client uuid param for server
		this.logodz.options.params.client = this.client.getUuid();
		
		// set callback on successful upload
		var that = this;
		this.logodz.on('success', function (err, path) {
			that.editedLogo(path);
		});

		// set image frame with editable clas
		Wu.DomUtil.addClass(this.logo, 'editable');

	},

	removeLogoDZ : function () {
		// disable edit on logo
		if (this.logodz) this.logodz.disable();
		delete this.logodz;

		// set image frame without editable clas
		Wu.DomUtil.removeClass(this.logo, 'editable');
	},


	editedLogo : function (path) {
		
		// set path
		var fullpath = '/images/' + path;
		
		// set new image and save
		this.client.setLogo(fullpath);

		// update image in header
		this.logo.src = fullpath;

	},

	pendingOpen : function () {
		if (app._timerOpenClient) clearTimeout(app._timerOpenClient);
		if (this._isOpen) return;

		var that = this;
		app._timerOpenClient = setTimeout(function () {
			that.open();
			if (app._pendingCloseClient) app._pendingCloseClient.close();
			app._pendingCloseClient = that;
		}, 200);	
	},

	toggle : function () {				
		this._isOpen ? this.close() : this.open();
	},

	open : function () {

		// Close open project info to prevent overflow
		this.resetOpenProjectInfo();

		this.calculateHeight();
		this._container.style.height = this.maxHeight + 'px';          
		this._isOpen = true;

		
		Wu.DomUtil.removeClass(this._removeClientButton, 'displayNone');


		// close others
		var clients = app.SidePane.Clients;
		if (clients._lastOpened && clients._lastOpened != this) clients._lastOpened.close();
		clients._lastOpened = this;
	},

	close : function () {   				

		this.calculateHeight();
		this._container.style.height = this.minHeight + 'px';    
		this._isOpen = false;

		Wu.DomUtil.addClass(this._removeClientButton, 'displayNone');

		this.resetOpenProjectInfo();
				
	},

	resetOpenProjectInfo : function () {

		// Set open project info state to false
		this.projects.forEach(function(project) {

			// Remove active state from button
			Wu.DomUtil.removeClass(project._menuItem.users, 'active-project-user-button');

			// Remove height from project info container
			project._menuItem._container.removeAttribute('style');

			// Set open state to false
			if ( project._menuItem._isOpen ) project._menuItem._isOpen = false;
		})

	},

	removeProject : function (project) {
		_.remove(this.projects, function (p) { return p.store.uuid == project.store.uuid; });
		this.calculateHeight();
		this.open();
	},

	calculateHeight : function () {
		
		if ( !Wu.app.mobile ) {
	
			var min = 150;
			this.maxHeight = min + _.size(this.projects) * 116;
			this.minHeight = 80;

		} else {

			var min = 78;
			this.maxHeight = min + _.size(this.projects) * 100;
			this.minHeight = 68; 
		}

		
	},


	
});


;Wu.SidePane.Users = Wu.SidePane.Item.extend({
	_ : 'sidepane.users', 


	type : 'users',
	title : 'Users',

	initContent : function () {

		// create new fullscreen page, and set as default content
		this._content = Wu.DomUtil.create('div', 'fullpage-users', Wu.app._appPane);
		
		// Users Control
		this._usersControls = Wu.DomUtil.create('div', 'users-controls', this._content);
		this._usersControlsInner = Wu.DomUtil.create('div', 'users-controls-inner', this._usersControls);

		// Add user button
		this._addUser = Wu.DomUtil.createId('div', 'users-add-user', this._usersControlsInner);
		this._addUser.innerHTML = 'Create user';
		Wu.DomUtil.addClass(this._addUser, 'smap-button-gray users');

		// Delete user button
		this._delUser = Wu.DomUtil.createId('div', 'users-delete-user', this._usersControlsInner);
		this._delUser.innerHTML = 'Delete user';
		Wu.DomUtil.addClass(this._delUser, 'smap-button-gray users');

		// Search users
		this._search = Wu.DomUtil.createId('input', 'users-search', this._usersControlsInner);
		this._search.setAttribute("type", "text");
		this._search.setAttribute("placeholder", "Search users");
		Wu.DomUtil.addClass(this._search, 'search');

		// create container (overwrite default) and insert template
		this._container = Wu.DomUtil.create('div', 'editor-wrapper', this._content, ich.usersPane());

		// get handles
		this._tableContainer = Wu.DomUtil.get('users-table-container');

		// render empty table
		this._tableContainer.innerHTML = ich.usersTableFrame();

		// get more handles
		this._table 	    = Wu.DomUtil.get('users-insertrows');
		this._addUser       = Wu.DomUtil.get('users-add-user');
		this._mainTitle     = Wu.DomUtil.get('user-management-client');
		this._deleteUser    = Wu.DomUtil.get('users-delete-user');
		this._checkall      = Wu.DomUtil.get('users-checkbox-all');
		this._checkallLabel = Wu.DomUtil.get('label-users-checkbox-all');

		// init table
		this.initList();

		// add tooltip
		app.Tooltip.add(this._menu, '(Editors only) List of all users. Here you can create and delete users, as well as administer user access to projects.');

	},

	addHooks : function () {

		// search
		Wu.DomEvent.on(this._search, 'keyup', this.searchList, this);

	},

	addEditHooks : function () {
		
		// add button
		Wu.DomEvent.on(this._addUser, 'mousedown', this.inputUser, this);

		// delete button
		Wu.DomEvent.on(this._deleteUser, 'mousedown', this.deleteUser, this);

		// check all button
		Wu.DomEvent.on(this._checkallLabel, 'mousedown', this.checkAll, this);

		// show edit buttons
		Wu.DomUtil.removeClass(this._addUser, 'displayNone');
		Wu.DomUtil.removeClass(this._deleteUser, 'displayNone');
		Wu.DomUtil.removeClass(this._addUser, 'displayNone');
	       
	},

	removeEditHooks : function () {
		
		// add button
		Wu.DomEvent.off(this._addUser, 'mousedown', this.inputUser, this);

		// delete button
		Wu.DomEvent.off(this._deleteUser, 'mousedown', this.deleteUser, this);

		// check all button
		Wu.DomEvent.off(this._checkallLabel, 'mousedown', this.checkAll, this);

		// hide edit buttons
		Wu.DomUtil.addClass(this._addUser, 'displayNone');
		Wu.DomUtil.addClass(this._deleteUser, 'displayNone');
		Wu.DomUtil.addClass(this._addUser, 'displayNone');
	      
	},

	// fired when different sidepane selected, for clean-up
	_deactivate : function () {

		// show other controls
		this._showControls();

	},

	_activate : function () {

		// hide other controls
		this._hideControls();

	},

	_hideControls : function () {

		// layermenu
		var lm = app.MapPane.layerMenu;
		if (lm) lm.hide();

		// inspect
		var ic = app.MapPane.inspectControl;
		if (ic) ic.hide();

		// legends
		var lc = app.MapPane.legendsControl;
		if (lc) lc.hide();

		// description
		var dc = app.MapPane.descriptionControl;
		if (dc) dc.hide();
	},

	_showControls : function () {
		// layermenu
		var lm = app.MapPane.layerMenu;
		if (lm) lm.show();

		// inspect
		var ic = app.MapPane.inspectControl;
		if (ic) ic.show();

		// legends
		var lc = app.MapPane.legendsControl;
		if (lc) lc.show();

		// description
		var dc = app.MapPane.descriptionControl;
		if (dc) dc.show();
	},

	searchList : function (e) {

		if (e.keyCode == 27) { // esc
			this.list.search(); // show all
			this._search.value = '';
			return;
		}

		// get value and search
		var value = this._search.value;
		this.list.search(value);
	},




	// list.js plugin
	initList : function () { 
		
		// add dummy entry
		var tr = Wu.DomUtil.createId('tr', 'dummy-table-entry');
		tr.innerHTML = ich.usersTablerow({'type' : 'dummy-table-entry'});
		this._table.appendChild(tr);

		// init list.js
		var options = { valueNames : ['name', 'company', 'position', 'phone', 'email', 'access'] };
		this.list = new List('userslist', options);

		// remove dummy
		this.list.clear();
	},


	updateContent : function () {
		this.update();
	},

	update : function () {

		// flush
		this.reset();

		// refresh table entries
		this.refreshTable();

		// add edit hooks
		this.addEditHooks();

		// this.addHooks();	
	},


	
	// input fullscreen for new user details
	inputUser : function () {


		// Hide the Create user etc.
		Wu.DomUtil.addClass(this._content, 'hide-top', this);


		this._inputUser  = {};
		var titleText    = 'Create new user';
		var subtitleText = 'Enter details for the new user:';
		var messageText  = 'Password is auto-generated. The user will receive login details on email.';
		var container    = this._inputUser._container = Wu.DomUtil.create('div',   'backpane-container', this._content);
		var wrapper      = this._inputUser._wrapper   = Wu.DomUtil.create('div',   'backpane-wrapper',   container);
		var title        = this._inputUser._title     = Wu.DomUtil.create('div',   'backpane-title',     wrapper, titleText);
		var subtitle     = this._inputUser._subtitle  = Wu.DomUtil.create('div',   'backpane-subtitle',  wrapper, subtitleText);		
		var firstName    = this._inputUser._firstName = Wu.DomUtil.create('input', 'backpane-input',     wrapper, 'First Name');
		var lastName     = this._inputUser._lastName  = Wu.DomUtil.create('input', 'backpane-input',     wrapper, 'Last Name');
		var companyName	 = this._inputUser._companyName = Wu.DomUtil.create('input', 'backpane-input',     wrapper, 'Company Name');
		var position	 = this._inputUser._position  = Wu.DomUtil.create('input', 'backpane-input',     wrapper, 'Position');
		var phoneNo	 = this._inputUser._phoneNo   = Wu.DomUtil.create('input', 'backpane-input',     wrapper, 'Phone Number');
		var email        = this._inputUser._email     = Wu.DomUtil.create('input', 'backpane-input',     wrapper, 'Email');
		var email2       = this._inputUser._email2    = Wu.DomUtil.create('input', 'backpane-input',     wrapper, 'Confirm Email');
		var message      = this._inputUser._message   = Wu.DomUtil.create('div',   'backpane-message',   wrapper, messageText);
		var cancel       = this._inputUser._cancel    = Wu.DomUtil.create('div',   'backpane-cancel smap-button-gray',    wrapper, 'Cancel');
		var confirm      = this._inputUser._confirm   = Wu.DomUtil.create('div',   'backpane-confirm smap-button-gray',   wrapper, 'Confirm');

		Wu.DomEvent.on(email,   'keyup',     this.checkUniqueEmail, this);
		Wu.DomEvent.on(email2,  'keyup',     this.checkSameEmail,   this);
		Wu.DomEvent.on(cancel,  'mousedown', this.cancelInput,      this);
		Wu.DomEvent.on(confirm, 'mousedown', this.confirmInput,     this);

		// Toggle wrappers
		this._container.style.display = 'none';

	},

	checkUniqueEmail : function (e) {
		// clear
		clearTimeout(this._checkUniqeEmailTimer);
		
		// check
		var context = this;
		this._checkUniqeEmailTimer = setTimeout(function() {
			var email = context._inputUser._email.value;
			var json = JSON.stringify({ 
				email : email
			});
			// post              path          data           callback        context of cb
			Wu.Util.postcb('/api/user/unique', json, context.checkedUniqueEmail, context);
		}, 250);         
	},

	checkedUniqueEmail : function (context, data) {
		var email = JSON.parse(data);
		var div   = context._inputUser._email;
		
		// mark valid
		if (email.unique) {
			Wu.DomUtil.addClass(div, 'valid');
			Wu.DomUtil.removeClass(div, 'invalid');
			context._inputUser.validEmail = true;
		} else {
			Wu.DomUtil.addClass(div, 'invalid');	
			Wu.DomUtil.removeClass(div, 'valid');		
			context._inputUser.validEmail = false;
		}
	},


	checkSameEmail : function (e) {
		var email1 = this._inputUser._email;
		var email2 = this._inputUser._email2;

		// mark valid
		if (email1.value == email2.value) {
			Wu.DomUtil.addClass(email2, 'valid');
			Wu.DomUtil.removeClass(email2, 'invalid');
			this._inputUser.validEmail2 = true;
		} else {
			Wu.DomUtil.addClass(email2, 'invalid');
			Wu.DomUtil.removeClass(email2, 'valid');
			this._inputUser.validEmail2 = false;
		}
	},

	cancelInput : function (e) {
		Wu.DomUtil.remove(this._inputUser._container);
		this._container.style.display = 'block';

		// Show the Create user etc.
		Wu.DomUtil.removeClass(this._content, 'hide-top', this);

	},

	confirmInput : function () {

		var firstName = this._inputUser._firstName.value;
		var lastName  = this._inputUser._lastName.value;
		var email     = this._inputUser._email.value;
		var companyName	= this._inputUser._companyName.value;
		var position	= this._inputUser._position.value;
		var phoneNo	= this._inputUser._phoneNo.value;


		if (!firstName) return;
		if (!lastName) return;
		if (!email) return;
		if (!(this._inputUser.validEmail2 && this._inputUser.validEmail)) return;

		var input = {
			lastName  : lastName,
			firstName : firstName,
			email     : email,
			company   : companyName,
			position  : position,
			phone     : phoneNo
		}



		// create user
		this.createUser(input);
	
		// close backpane
		this.cancelInput();

		// Toggle pane
		this._container.style.display = 'block';

		// Show the Create user etc.
		Wu.DomUtil.removeClass(this._content, 'hide-top', this);

	},


	// send new user request to server
	createUser : function (input) {
		var data = JSON.stringify(input);
		if (!data) return;

		// get new user from server
		Wu.post('/api/user/new', data, this.createdUser, this);

	},

	// reply from server
	createdUser : function (context, json) {
		// console.log('createdUser: ', context, json);

		var store = JSON.parse(json);
		var user = new Wu.User(store);
		user.attachToApp();
		context.addTableItem(user); 	// todo: add user to top
	},



	deleteUser : function () {

		var checked = this.getSelected();

		// prevent seppuku
		var authUser = Wu.app.Account.store.uuid;
		var seppuku = false;
		checked.forEach(function (check) {
			if (check.uuid == authUser) seppuku = true;
		});
		if (seppuku) return console.error('Can\'t delete yourself.')
		

		// delete each selected user
		checked.forEach(function (user){
			// confirm delete
			var name = user.store.firstName + ' ' + user.store.lastName;
			if (confirm('Are you sure you want to delete user ' + name + '?')) {
				if (confirm('Are you REALLY SURE you want to delete user ' + name + '?')) {
					this.confirmDelete(user);
				}			
			}	
		}, this);
		
	},

	confirmDelete : function (user) {
		// delete user      cb
		user.deleteUser(this, 'deletedUser');
	},

	deletedUser : function (context) {
		// refresh
		context.reset();
		context.refreshTable();
	},

	
	checkAll : function () {
		// console.log('checkAll');
	},

	getSelected : function () {

		// get selected files
		var checks = [];
		for (u in this.users) {
			var user = this.users[u];
			var checkbox = Wu.DomUtil.get('users-checkbox-' + user.store.uuid);
			if (checkbox) var checked = checkbox.checked; 
			if (checked) checks.push(user); 
		};
		return checks;
	},

	
	

	refreshTable : function () {
		
		this.users = app.Users;

		for (u in this.users) {
			var user = this.users[u];
			this.addTableItem(user);
		}
		
		// sort list by name by default
		this.list.sort('name', {order : 'asc'});

	},

	

	reset : function () {
		// clear table
		this.list.clear();
	},

	addTableItem : function (user) {

		// prepare template values
		var template = {};   
		template.name = ich.usersTablerowName({
			firstName     : user.getFirstName() || 'First name',
			lastName      : user.getLastName()  || 'Last name',
			lastNameUuid  : 'lastName-'  + user.getUuid(),
			firstNameUuid : 'firstName-' + user.getUuid(),
		});     
		template.email    = user.getEmail();
		template.position = user.getPosition();
		template.company  = user.getCompany();
		template.mobile   = user.getMobile();
		template.phone    = user.getPhone();
		template.access   = this.getAccessTemplate(user);
			       
		// add users to list.js, and add to DOM
		var ret = this.list.add(template);

		// hack: manually add id's for event triggering                 TODO refactor, ich.
		// for whole table
		var nodes = ret[0].elm.children;
		for (var i = 0; i < nodes.length; i++) {
			var node = nodes[i];

			// main checkbox, label
			if (i == 0) {
				node.children[0].children[0].id = 'users-checkbox-' + user.getUuid();
				node.children[0].children[1].setAttribute('for', 'users-checkbox-' + user.getUuid());
			}

			// other divs
			if (!node.id == '') {
				node.id = node.id + user.getUuid();
				node.setAttribute('uuid', user.getUuid());
			}
		};
	
		// add edit hooks
		this.setEditHooks(user.getUuid());

	},

	getAccessTemplate : function (user) {


		var divProjectsOpen = '<div class="user-projects-button">';
		var divProjectsClose = '</div>';

		// get no of projets etc for user
		var projects = user.getProjects();
		if (projects.length > 1) return divProjectsOpen + projects.length + ' projects' + divProjectsClose; //projects
		return divProjectsOpen + projects.length + ' project' + divProjectsClose;
	},

	getProjectsTemplate : function (user) {
		var template = '';

		// all projects	for superusers
		if (user.isSuperuser()) {	
			for (p in app.Projects) {
				var project = app.Projects[p];
				if (!project) return;
				content = {
					name 		: project.store.name,
					description 	: project.store.description,
					uuid 		: project.store.uuid
				}
				template += ich.usersTableProjectItem(content);
			}
			return template;
		}
		
		// otherwise projects that user read/update/manage
		var projects = user.getProjects();
		if (!projects || projects.length == 0) return template;
		projects.forEach(function (uuid) {
			var project = app.Projects[uuid];
			if (!project) return;
			content = {
				name 		: project.store.name,
				description 	: project.store.description,
				uuid 		: project.store.uuid
			}
			template += ich.usersTableProjectItem(content);
		}, this);
		return template;
	},



	checkEscape : function (e) {
		if (e.keyCode == 27) this._popupCancel(); // esc key
	},



	setEditHooks : function (uuid, onoff) {

		var onoff = onoff || 'on';

		// get <input>'s
		var lastName    = Wu.DomUtil.get('lastName-' + uuid);
		var firstName   = Wu.DomUtil.get('firstName-' + uuid);
		var company     = Wu.DomUtil.get('company-' + uuid);
		var position    = Wu.DomUtil.get('position-' + uuid);
		var phone       = Wu.DomUtil.get('phone-' + uuid);
		var email       = Wu.DomUtil.get('email-' + uuid);
		var access      = Wu.DomUtil.get('access-' + uuid);

		// set click hooks on title and description
		Wu.DomEvent
			[onoff]( lastName,       'mousedown mouseup click',     this.stop,      this ) 
			[onoff]( lastName,       'dblclick',                    this.rename,    this )     
			[onoff]( firstName,      'mousedown mouseup click',     this.stop,      this ) 
			[onoff]( firstName,      'dblclick',                    this.rename,    this )     
			[onoff]( company,        'mousedown mouseup click',     this.stop,      this ) 
			[onoff]( company,        'dblclick',                    this._rename,   this )     
			[onoff]( position,       'mousedown mouseup click',     this.stop,      this ) 
			[onoff]( position,       'dblclick',                    this._rename,   this )     
			[onoff]( phone,          'mousedown mouseup click',     this.stop,      this ) 
			[onoff]( phone,          'dblclick',                    this._rename,   this )     
			[onoff]( email,          'mousedown mouseup click',     this.stop,      this ) 
			// [onoff]( email,          'dblclick',                    this._rename,   this )     
			[onoff]( access,         'click',                    function () { this.editAccess(uuid); }, this )     

	},

	editAccess : function (uuid) {
		var user = app.Users[uuid];

		// open backpane
		this.manageAccess(user);

		// Hide the Create user etc.
		Wu.DomUtil.addClass(this._content, 'hide-top', this);
	},


	// fullscreen input for new user details
	manageAccess : function (user) {

		var titleText    = 'Manage access for ' + user.getName();
		var subtitleText = 'Manage read, write and manage access for this user.';
		// var messageText  = '<h4>Guide:</h4>Managers can add READ access to projects they are managers for.';
		// messageText     += '<br>Admins can add READ, WRITE and MANAGE access to projects they have created themselves.'
		var saClass      = user.isSuperadmin() ? 'green' : 'red';
		var aClass       = user.isAdmin() ? 'green' : 'red';

		var projects     = '';

		this._inputAccess = {};
		var container  = this._inputAccess._container     = Wu.DomUtil.create('div', 'backpane-access-container', this._content);
		var wrapper    = this._inputAccess._wrapper       = Wu.DomUtil.create('div', 'backpane-access-wrapper',   container);
		var title      = this._inputAccess._title         = Wu.DomUtil.create('div', 'backpane-title',     	  wrapper, titleText);
		var subtitle   = this._inputAccess._subtitle  	  = Wu.DomUtil.create('div', 'backpane-subtitle',  	  wrapper, subtitleText);		
		
		// admin boxes to display super/admin status
		var superadmin = this._inputAccess._superadmin    = Wu.DomUtil.create('div', 'backpane-superadmin-box ' + saClass, wrapper, 'Superadmin');
		var admin      = this._inputAccess._admin         = Wu.DomUtil.create('div', 'backpane-admin-box ' + aClass, wrapper, 'Admin');

		var subtitle2  = this._inputAccess._projectTitle  = Wu.DomUtil.create('div', 'backpane-projectTitle', 	  wrapper, 'Projects:');	
		var projectsWrap = this._inputAccess._projectsWrap = this.insertProjectWrap(user);	
		var confirm    = this._inputAccess._confirm   = Wu.DomUtil.create('div', 'backpane-confirm smap-button-gray',   wrapper, 'Done');
		// var message    = this._inputAccess._message   = Wu.DomUtil.create('div', 'backpane-message',   wrapper, messageText);

		Wu.DomEvent.on(confirm, 'mousedown', this.closeManageAccess,     this);

		// Toggle wrappers
		this._container.style.display = 'none';
	},

	closeManageAccess : function () {
		
		Wu.DomUtil.remove(this._inputAccess._container);

		// Toggle wrappers
		this._container.style.display = 'block';

		// update errythign
		this.update();

		// Show the Create user etc.
		Wu.DomUtil.removeClass(this._content, 'hide-top', this);		


	},

	insertProjectWrap : function (user) {

		// create wrapper
		var wrapper = Wu.DomUtil.create('div', 'backpane-projects-wrap', this._inputAccess._wrapper);

		// array of projects
		var projects = this._getProjectAccessSchema();
		if (projects.length == 0) return;

		

		// add projects
		projects.forEach(function (project) {
			if (!project) return;

			this._createManageEntry(user, project, wrapper);
			
		}, this)


		return wrapper;
	},

	_createManageEntry : function (user, project, wrapper) {

		// edit/manage delegation only for admins
		var managerPriv = app.Account.isAdmin() || app.Account.isSuperadmin(), 
		    editorPriv 	= app.Account.isSuperadmin(),
		    pname 	= project.getName(),
		    cli 	= project.getClient(),
		    cname 	= cli ? cli.getName() : 'DELETED CLIENT!',
		    readClass   = (user.canReadProject(project.getUuid()))   ? 'gotAccess' : '',
		    editClass   = (user.canUpdateProject(project.getUuid())) ? 'gotAccess' : '',
		    manageClass = (user.canManageProject(project.getUuid())) ? 'gotAccess' : '',
		    titleText   = pname + ' (' + cname + ')';

		var wrap    = Wu.DomUtil.create('div', 'access-projects-wrap', 			wrapper);
		var details = Wu.DomUtil.create('div', 'access-projects-details-wrap', 		wrap);
		var title   = Wu.DomUtil.create('div', 'access-projects-title', 		details, 	titleText);
		var desc    = Wu.DomUtil.create('div', 'access-projects-description', 		details, 	project.getDescription());
		var read    = Wu.DomUtil.create('div', 'access-projects-read ' + readClass, 	wrap, 		'Read');
		var edit, manage;

		if (editorPriv)    edit = Wu.DomUtil.create('div', 'access-projects-write ' + editClass, 	wrap, 		'Edit');
		if (managerPriv) manage = Wu.DomUtil.create('div', 'access-projects-manage ' + manageClass, wrap, 	'Manage');
		
		var item = {
			user    : user,
			project : project,
			read    : read,
			edit    : edit,
			manage  : manage
		}

		Wu.DomEvent.on(read, 'mousedown', function () { this.toggleReadAccess(item)}, this);
		if (editorPriv) Wu.DomEvent.on(edit,    'mousedown', function () { this.toggleUpdateAccess(item)}, this);
		if (managerPriv) Wu.DomEvent.on(manage, 'mousedown', function () { this.toggleManageAccess(item)}, this);

	},

	toggleReadAccess : function (item) {

		// get user
		var user = item.user;

		// get current state
		var state = (user.store.role.reader.projects.indexOf(item.project.getUuid()) >= 0) ? true : false;

		// add/remove
		state ? this._removeRead(item) : this._addRead(item);

	},

	_removeRead : function (item) {

		// remove read access
		item.user.removeReadProject(item.project);
		Wu.DomUtil.removeClass(item.read, 'gotAccess');

		// if removing read, also remove edit
		this._removeUpdate(item);
		this._removeManage(item);

	},

	_addRead : function (item) {
		// add read access
		item.user.addReadProject(item.project);
		Wu.DomUtil.addClass(item.read, 'gotAccess');
	},

	_removeUpdate : function (item) {
		// remove read access
		item.user.removeUpdateProject(item.project);
		Wu.DomUtil.removeClass(item.edit, 'gotAccess');
	},

	_addUpdate : function (item) {
		// add update access
		item.user.addUpdateProject(item.project);
		Wu.DomUtil.addClass(item.edit, 'gotAccess');

		// add read access too
		this._addRead(item);

	},

	_removeManage : function (item) {
		// remove manage access
		item.user.removeManageProject(item.project);
		Wu.DomUtil.removeClass(item.manage, 'gotAccess');
	},

	_addManage : function (item) {
		// add manage access
		item.user.addManageProject(item.project);
		Wu.DomUtil.addClass(item.manage, 'gotAccess');

		// add read 
		this._addRead(item);

	},


	toggleUpdateAccess : function (item) {
		// console.log('toggle: ', item);
		var user = item.user;

		// get current state
		var state = (user.store.role.editor.projects.indexOf(item.project.getUuid())  >= 0) ? true : false;

		// add/remove update access
		state ? this._removeUpdate(item) : this._addUpdate(item);

	},

	toggleManageAccess : function (item) {
		// console.log('toggle: ', item);
		var user = item.user;

		// get current state
		var state = (user.store.role.manager.projects.indexOf(item.project.getUuid())  >= 0) ? true : false;

		// add/remove manage access
		state ? this._removeManage(item) : this._addManage(item);
		

	},

	_getProjectAccessSchema : function () {

		// manager: get projects user is manager for
		var managerProjects = [];
		app.Account.store.role.manager.projects.forEach(function (project) {
			managerProjects.push(app.Projects[project]);
		}, this);
		return _.toArray(managerProjects);
	},


	// to prevent selected text
	stop : function (e) {
		e.preventDefault();
		e.stopPropagation();
	},

	rename : function (e) {

		// enable editing on input box
		e.target.removeAttribute('readonly'); 
		e.target.focus();
		e.target.selectionStart = e.target.selectionEnd;

		// set key
		e.target.fieldKey = e.target.id.split('-')[0];

		// save on blur or enter
		Wu.DomEvent.on( e.target, 'blur',    this.editBlur, this );
		Wu.DomEvent.on( e.target, 'keydown', this.editKey,  this );

	},

	editKey : function (e) {
		// blur on enter
		if (event.which == 13 || event.keyCode == 13) e.target.blur();
	},

	editBlur : function (e) {

		// get key
		var key = e.target.fieldKey;

		// set back to readonly
		e.target.setAttribute('readonly', 'readonly');                                                                                                                                                                                         
		
		// get user uuid
		var userUuid = e.target.id.replace(key + '-', '');

		// get new title
		var value = e.target.value || e.target.innerHTML;

		// save to server
		this.save(key, value, userUuid);

	},

	// rename a div, ie. inject <input>
	_rename : function (e) {
		
		var div   = e.target;
		var value = e.target.innerHTML;
		var key   = e.target.getAttribute('key');
		var uuid  = e.target.getAttribute('uuid');

		var input = ich.injectInput({ 
			value : value, 
			key   : key , 
			uuid  : uuid 
		});
		
		// inject <input>
		div.innerHTML = input;

		var target = div.firstChild;

		// enable editing on input box
		//e.target.removeAttribute('readonly'); 
		target.focus();
		target.selectionStart = target.selectionEnd;

		// save on blur or enter
		Wu.DomEvent.on( target,  'blur', this._editBlur, this );     // save folder title
		Wu.DomEvent.on( target,  'keydown', this._editKey, this );     // save folder title

	},

	_editKey : function (e) {
		// blur on enter
		if (event.which == 13 || event.keyCode == 13) e.target.blur();
	},

	_editBlur : function (e) {

		// get value
		var value = e.target.value;
		var key   = e.target.getAttribute('key');
		var user  = e.target.getAttribute('uuid');

		// revert to <div>
		var div = e.target.parentNode;
		div.innerHTML = value;

		//refresh list
		this.list.update();

		// save to server
		this.save(key, value, user);

	},

	save : function (key, value, userUuid) {
		var user = app.Users[userUuid];
		user.setKey(key, value);
	},


});;Wu.SidePane.Map = Wu.SidePane.Item.extend({
	_ : 'sidepane.map', 

	type : 'map',

	title : 'Options',

	initContent : function () {

		// longhand 
		this.app = Wu.app;

		// content to template
		this._container.innerHTML = ich.editorMapBaseLayer();
		this._settingsContainer = Wu.DomUtil.get('mapsettings-container');

		// set panes
		this._panes = {};

		// init each setting
		this.mapSettings = {};
		this.mapSettings.baselayer = new Wu.SidePane.Map.BaseLayers();
		this.mapSettings.layermenu = new Wu.SidePane.Map.LayerMenu();
		this.mapSettings.position  = new Wu.SidePane.Map.Position();
		this.mapSettings.bounds    = new Wu.SidePane.Map.Bounds();
		this.mapSettings.controls  = new Wu.SidePane.Map.Controls();
		this.mapSettings.connect   = new Wu.SidePane.Map.Connect(this._settingsContainer);  // refactor container, ich.template
		this.mapSettings.settings  = new Wu.SidePane.Map.Settings(this._settingsContainer);  // refactor container, ich.template


		// add tooltip
		app.Tooltip.add(this._menu, '(Editors only) In this section you will find all the options for setting up a map.');


	},

	
	addHooks : function () {
		
	},

	// run when sidepane activated
	_activate : function () {
	},

	// run when sidepane deactivated
	_deactivate : function () {

	},

	updateContent : function () {
		this._update();
	},

	_resetView : function () {

	},

	update : function () {
		this._update();
	},

	// if run on select project
	_update : function () {

		// use active project
		this.project = app.activeProject;

		// update map settings
		for (s in this.mapSettings) {
			var setting = this.mapSettings[s];
			setting.update();
		}

		// set height of content
		this.setContentHeight();
	},

	closeAll : function () {
		// console.log('closeAll');

		// close all options folders
		var options = app.SidePane.Map.mapSettings;
		for (o in options) {
			var option = options[o];
			// console.log('option: ', option);
			if (option._isOpen) option.close();
		}

	},

});;Wu.SidePane.Map.MapSetting = Wu.SidePane.Map.extend({
	_ : 'sidepane.map.mapsetting',


	type : 'mapSetting',


	initialize : function (container) {

		this.panes = {};

		// get panes
		this.mapsettingsContainer = Wu.DomUtil.get('mapsettings-container');
		this.getPanes();

		// init layout
		this.initLayout(container);
		
		// add hooks
		this.addHooks();

	},

	buttonDown : function (e) {
		Wu.DomUtil.addClass(e.target, 'btn-info');
	},

	buttonUp : function (e) {
		Wu.DomUtil.removeClass(e.target, 'btn-info');
	},

	update : function () {
		// set active project
		this.project = Wu.app.activeProject;

	},

	addHooks : function () {
		// Wu.DomEvent.on( this.mapsettingsContainer, 'mouseleave', this.close, this);	
		// Wu.DomEvent.on( this._container, 'mousemove', this.pendingOpen, this);
		// Wu.DomEvent.on( this._container, 'mousedown', this.open, this);
		
		Wu.DomEvent.on( this._container, 'mousedown', this.toggleOpen, this);
		
	},

	removeHooks : function () {
		// todo!!!
	},

	calculateHeight : function () {
		this.maxHeight = this._inner.offsetHeight + 15;
		this.minHeight = 0;
	},

	// fn for open on hover.. not in use atm
	pendingOpen : function () {
		if (app._timerOpen) clearTimeout(app._timerOpen);
		if (this._isOpen) return;

		var that = this;
		app._timerOpen = setTimeout(function () {
			that.open();
			if (app._pendingClose) app._pendingClose.close();
			app._pendingClose = that;
		}, 200);	
	},

	toggleOpen : function () {
		this._isOpen ? this.close() : this.open();
	},

	open : function () {
		this.calculateHeight();
		this._outer.style.height = this.maxHeight + 20 + 'px';       
		this._open(); // local fns   
		this._isOpen = true;

		if (app._pendingClose && app._pendingClose != this) {
			app._pendingClose.close();
		}
		app._pendingClose = this;
	},


	close : function () {   				// perhaps todo: now it's closing every pane, cause addHooks been run 6 times.
		// console.log('close ', this.type);		// set this to app._pendingclose here for just one close... 
		this.calculateHeight();
		this._outer.style.height = this.minHeight + 'px';        
		this._close();
		this._isOpen = false;
		app._pendingClose = false;
		if (app._timerOpen) clearTimeout(app._timerOpen);
	},

	_open : function () {
		// noop
		app.SidePane.Map.mapSettings.layermenu.disableEdit();
	}, 

	_close : function () {
		// noop
		
	},

	initLayout : function () {
		// noop
	},

	getPanes : function () {
		// noop
	},

	// sort layers by provider
	sortLayers : function (layers) {
		// possible keys in layer.store.data. must add more here later if other sources
		var keys = ['geojson', 'mapbox', 'osm'];
		var results = [];
		keys.forEach(function (key) {
			var sort = {
				key : key,
				layers : []
			}
			for (l in layers) {
				var layer = layers[l];
				if (layer.store.data.hasOwnProperty(key)) {
					sort.layers.push(layer)
				}
			}
			results.push(sort);
		}, this);

		this.numberOfProviders = results.length;
		return results;
	},

	addProvider : function (provider) {
		var title = '';
		if (provider == 'geojson') title = 'Data Library';
		if (provider == 'mapbox') title = 'Mapbox';
		if (provider == 'osm') title = 'Open Street Map';
		var header = Wu.DomUtil.create('div', 'item-list-header', this._outer, title)
	},

	fillLayers : function () {

		this._layers = {};

		// return if no layers
	       	if (_.isEmpty(this.project.layers)) return;
	       	

	       	var sortedLayers = this.sortLayers(this.project.layers);

	       	sortedLayers.forEach(function (provider) {

	       		this.addProvider(provider.key);

	       		provider.layers.forEach(function (layer) {
	       			this.addLayer(layer);
	       		}, this);

	       	}, this);

	       	// calculate height for wrapper
	       	this.calculateHeight();

	},

});



                                    
Wu.SidePane.Map.BaseLayers = Wu.SidePane.Map.MapSetting.extend({
	_ : 'sidepane.map.baselayers', 

	type : 'baseLayers',


	getPanes : function () {
		// map baselayer
		this._container = Wu.DomUtil.get('editor-map-baselayer-wrap');
	},


	initLayout : function () {

		// create title and wrapper (and delete old content)
		this._container.innerHTML = '<h4 id="h4-base">Base Layers</h4>';
		var div = Wu.DomUtil.createId('div', 'select-baselayer-wrap', this._container);
		this._outer = Wu.DomUtil.create('div', 'select-elems', div);
		Wu.DomUtil.addClass(div, 'select-wrap');

		// add tooltip
		var h4 = Wu.DomUtil.get('h4-base');
		app.Tooltip.add(h4, 'Sets the base layers of the map. These layers will not appear in the "Layers" menu to the right of the screen. Users may still toggle these layers if the "Base Layer Toggle" option has been set to active in the "Controls" section.' );
	},

	
	update : function () {
		Wu.SidePane.Map.MapSetting.prototype.update.call(this)	// call update on prototype

		// options
		this.editMode = false;

		// refresh layout
		this.initLayout();

		// fill in with layers
		this.fillLayers();

		// mark unavailable layers
		this.markOccupied();

		
	},


	removeHooks : function () {
		// todo!!!
	},


	addLayer : function (layer) {

		// create and append div
		var container = Wu.DomUtil.create('div', 'item-list select-elem ct0 baselayer', this._outer);
		var text = Wu.DomUtil.create('div', 'item-list-inner-text', container);
		
		// set title
		text.innerHTML = layer.store.title;

		// set height if short title - hacky..
		if (layer.store.title) { // err if no title
			if (layer.store.title.length < 32) text.style.maxHeight = '12px';
		}
		
		// append range selectors
		var rangeOpacity = Wu.DomUtil.create('input', 'baselayer-range-slider-opacity', container);
		var rangeZindex  = Wu.DomUtil.create('input', 'baselayer-range-slider-zindex', container);

		// todo: z-index, opacity
		var baseLayer = {
			layer : layer,
			container : container, 
			active : false,
			rangeOpacity : rangeOpacity, 
			rangeZindex : rangeZindex
		}

		// set active or not
		this.project.store.baseLayers.forEach(function (b) {
			if (layer.store.uuid == b.uuid) {
				this.on(baseLayer);
			}
		}, this);

		// add toggle hook
		Wu.DomEvent.on(container, 'mousedown', function (e) { 

			// prevent other click events
			Wu.DomEvent.stop(e);

			// toggle layer
			this.toggle(baseLayer);

		}, this);

		this._layers = this._layers || {};
		this._layers[baseLayer.layer.store.uuid] = baseLayer;

		// // // add edit hook
		// Wu.DomEvent.on (button, 'mousedown', function (e) {
		// 	console.log('butttt');
		// 	// prevent other click events
		// 	Wu.DomEvent.stop(e);
		// 	// Wu.DomEvent.stopPropagation(e);

		// 	// toggle editMode
		// 	this.toggleEdit(baseLayer);	// temporarily taken out, cause BETA.. this is opacity edit etc..

		// }, this);

		// add stops
		// Wu.DomEvent.on(button, 'mousedown', Wu.DomEvent.stop, this);

		

	},

	toggleEdit : function (baseLayer) {
		var uuid = baseLayer.layer.store.uuid;
		if (this.editMode[uuid]) {
			this.editOff(baseLayer);
		} else {
			this.editOn(baseLayer);
		}
	},

	setOpacity : function () {
		if (!this.context.rangeOpacity) return;

		// set opacity on layer
		var opacity = parseFloat(this.context.rangeOpacity.element.value / 100);
		this.layer.setOpacity(opacity);

		// save to baseLayer
		var uuid 	  = this.layer.store.uuid;
		var baseLayer 	  = _.find(this.context.project.store.baseLayers, function (base) { return base.uuid == uuid; });
		var project 	  = this.context.project;
		baseLayer.opacity = opacity;
		this.context.save(); // save

	},

	setZIndex : function () {
		if (!this.context.rangeZindex) return;

		var zIndex = parseFloat(this.context.rangeZindex.element.value);
		this.layer.setZIndex(zIndex);

		// save to baseLayer
		var uuid 	  = this.layer.store.uuid;
		var baseLayer 	  = _.find(this.context.project.store.baseLayers, function (base) { return base.uuid == uuid; });
		var project 	  = this.context.project;
		baseLayer.zIndex  = zIndex;
		this.context.save(); // save
	},

	save : function () {
		var that = this;

		// clear timer
		if (this.saveTimer) clearTimeout(this.saveTimer);

		// save on timeout
		this.saveTimer = setTimeout(function () {
			that.project._update('baseLayers');
		}, 1000);       // don't save more than every goddamed second

	},

	editOn : function (baseLayer) {

		// get opacity
		var uuid 	    = baseLayer.layer.store.uuid;
		var storeBaselayer  = _.find(this.project.store.baseLayers, function (b) { return b.uuid == uuid; });
		if (storeBaselayer) {
			var opacity = parseInt(storeBaselayer.opacity * 100);
		} else {
			var opacity = 1;
		}

		// create range slider
		this.rangeOpacity = new Powerange(baseLayer.rangeOpacity, {
			callback      : this.setOpacity,// callback
			decimal       : false,
			disable       : false,
			disableOpacity: 0.5,
			hideRange     : false,
			klass         : 'powerange-opacity',
			min           : 0,
			max           : 100,
			start         : opacity,	// opacity
			step          : null,
			vertical      : false,
			context       : this,		// need to pass context
			layer         : baseLayer.layer	// passing layer
		});

		this.rangeZindex = new Powerange(baseLayer.rangeZindex, {
			callback      : this.setZIndex, 
			decimal       : false,
			disable       : false,
			disableOpacity: 0.5,
			hideRange     : false,
			klass         : 'powerange-zindex',
			min           : 1,
			max           : 10,
			start         : null,
			step          : 1,
			vertical      : false,
			context       : this,
			layer         : baseLayer.layer
		});

		// show range selectah
		baseLayer.container.style.height = '132px';

		// prevent events
		var handle = this.rangeZindex.handle;
		var slider = this.rangeZindex.slider;
		Wu.DomEvent.on(handle, 'mousedown', Wu.DomEvent.stop, this);
		Wu.DomEvent.on(slider, 'mousedown', Wu.DomEvent.stop, this);

		var handle = this.rangeOpacity.handle;
		var slider = this.rangeOpacity.slider;
		Wu.DomEvent.on(handle, 'mousedown', Wu.DomEvent.stop, this);
		Wu.DomEvent.on(slider, 'mousedown', Wu.DomEvent.stop, this);

		// account for extra height with editor
		this.calculateHeight();
		this.open();


		// set editMode
		this.editMode = this.editMode || {};

		this._editsOff();

		var uuid = baseLayer.layer.store.uuid;
		this.editMode[uuid] = baseLayer;


	},

	_editsOff : function () {
		var baseLayers = this.editMode;
		for (b in baseLayers) {
			var baseLayer = baseLayers[b];
			this.editOff(baseLayer);
		}
	},

	editOff : function (baseLayer) {

		// set editMode
		var uuid = baseLayer.layer.store.uuid;
		// delete this.editMode[uui
		// this.editMode = false;

		// hide editor
		baseLayer.container.style.height = '32px';

		// reset events
		var handle = this.rangeZindex.handle;
		var slider = this.rangeZindex.slider;
		Wu.DomEvent.on(handle, 'mousedown', Wu.DomEvent.stop, this);
		Wu.DomEvent.on(slider, 'mousedown', Wu.DomEvent.stop, this);

		// remove range divs
		Wu.DomUtil.remove(this.rangeZindex.slider);
		Wu.DomUtil.remove(this.rangeOpacity.slider);
		Wu.DomUtil.remove(this.rangeZindex.handle);
		Wu.DomUtil.remove(this.rangeOpacity.handle);
		delete this.rangeZindex;
		delete this.rangeOpacity;

		// account for extra height of wrapper with editor
		this.calculateHeight();
		this.open();

	},

	toggle : function (baseLayer) {
		if (baseLayer.active) {
			this.off(baseLayer);
			this.disableLayer(baseLayer);
		} else {
			this.on(baseLayer);
			this.enableLayer(baseLayer);
		}

		var project = app.activeProject;
		var thumbCreated = project.getThumbCreated(); 			// refactor
		if (!thumbCreated) project.createProjectThumb();		

	},

	on : function (baseLayer) {
		// enable in baseLayer menu
		Wu.DomUtil.addClass(baseLayer.container, 'active');
		baseLayer.active = true;
	},

	off : function (baseLayer) {
		// disable in baseLayer menu
		Wu.DomUtil.removeClass(baseLayer.container, 'active');
		baseLayer.active = false;
	},

	setDefaultLayer : function () {
		var baseLayer = _.sample(this._layers, 1)[0];
		console.log('setDefaultLayer', this._layers);
		console.log('baseLayer', baseLayer);
		if (!baseLayer) return;
		this.on(baseLayer);
		this.enableLayer(baseLayer);
	},

	enableLayer : function (baseLayer) {

		// get layer
		var layer = baseLayer.layer;

		// enable layer on map (without controls)
		layer._addTo('baselayer');

		// add baselayer
		this.project.addBaseLayer({
			uuid : layer.getUuid(),
			zIndex : 1,			// zindex not determined by layer, but by which layers are currently on map
			opacity : layer.getOpacity()
		});
	
		// refresh controls
		this._refreshControls();
	},

	disableLayer : function (baseLayer) {
		if (!baseLayer) return

		// get layer
		var layer = baseLayer.layer;

		// disable layer in map
		if (layer) layer.disable(); 

		// remove from project
		this.project.removeBaseLayer(layer)

		// refresh controls
		this._refreshControls();

	},

	_refreshControls : function () {

		// refresh baselayerToggleControl
		var baselayerToggle = app.MapPane.baselayerToggle;
		if (baselayerToggle) baselayerToggle.update();

		// mark occupied layers in layermenu
		var layermenuSetting = app.SidePane.Map.mapSettings.layermenu;
		layermenuSetting.markOccupied();

		// refresh cartoCssControl
		var cartoCss = app.MapPane.cartoCss;
		if (cartoCss) cartoCss.update()

	},

	calculateHeight : function () {

		// Runs only for base layer menu?
		var min = _.size(this.project.getLayermenuLayers()),
		    padding = this.numberOfProviders * 35;
		this.maxHeight = (_.size(this.project.layers) - min) * 33 + padding;
		this.minHeight = 0;

		// add 100 if in editMode
		if (this.editMode) this.maxHeight += 100;

	},

	markOccupied : function () {

		// get layers and active baselayers
		var layermenuLayers = this.project.getLayermenuLayers();
		var layers = this.project.getLayers();

		// activate layers
		layers.forEach(function (a) {
			this.activate(a.store.uuid);
		}, this);

		layermenuLayers.forEach(function (bl) {
			var layer = _.find(layers, function (l) { return l.store.uuid == bl.layer; });
			if (layer) this.deactivate(layer.store.uuid);
		}, this);

	},

	activate : function (layerUuid) {
		var layer = this._layers[layerUuid];
		Wu.DomUtil.removeClass(layer.container, 'deactivated');
	},

	deactivate : function (layerUuid) {
		var layer = this._layers[layerUuid];
		Wu.DomUtil.addClass(layer.container, 'deactivated');
	}
});



                             
Wu.SidePane.Map.LayerMenu = Wu.SidePane.Map.MapSetting.extend({
	_ : 'sidepane.map.layermenu', 

	type : 'layerMenu',

	getPanes : function () {
		this._container = Wu.DomUtil.get('editor-map-layermenu-wrap');
	},

	initLayout : function () {

		// cxxx 
		// create title and wrapper (and delete old content)
		this._container.innerHTML = '<h4 id="h4-layer">Layer Menu</h4>';


		this._inner  = Wu.DomUtil.create('div', 'map-layermenu-inner', this._container);
		this._outer  = Wu.DomUtil.create('div', 'map-layermenu-outer', this._inner);
		// var status   = 'Enable layer menu in Controls below.';
		// this._status = Wu.DomUtil.create('div', 'layermenu-status', this._outer, status);

		// add tooltip
		var h4 = Wu.DomUtil.get('h4-layer');
		// app.Tooltip.add(this._container, 'Sets layers that will appear in the layer menu. Selected base layers will be excluded from the Layer Menu list, and vice versa, to avoid duplicates.' );
		app.Tooltip.add(h4, 'Sets layers that will appear in the layer menu. Selected base layers will be excluded from the Layer Menu list, and vice versa, to avoid duplicates.' );

	},

	update : function () {
		Wu.SidePane.Map.MapSetting.prototype.update.call(this)	// call update on prototype

		// get layermenu object
		this.layerMenu = Wu.app.MapPane.layerMenu;

		// options
		this.editMode = false;

		// refresh layout
		this.initLayout();

		// fill in with layers
		this.fillLayers();

		// mark deactivated layers
		this.markOccupied();
		
	},

	// add layers to layermenu list in sidepane
	addLayer : function (layer) {

		// create and append div
		var container = Wu.DomUtil.create('div', 'item-list select-elem ct0', this._outer);

		// create and set title
		var text = Wu.DomUtil.create('div', 'item-list-inner-text', container);
		text.innerHTML = layer.store.title;

		// set height if short title - hacky..
		if (layer.store.title) { // err if no title
			if (layer.store.title.length < 32) text.style.maxHeight = '12px';
		}

		// append edit button
		var button = Wu.DomUtil.create('div', 'edit-layermenu-layer', container);

		// append range selectors
		var rangeOpacity = Wu.DomUtil.create('input', 'layermenu-range-slider-opacity', container);
		var rangeZindex  = Wu.DomUtil.create('input', 'layermenu-range-slider-zindex', container);

		// todo: z-index, opacity
		var layermenuLayer = {
			layer 		: layer,
			container 	: container, 
			active 		: false,
			rangeOpacity 	: rangeOpacity, 
			rangeZindex 	: rangeZindex
		}

		// store for reuse
		this._layers[layer.store.uuid] = layermenuLayer;

		// set active or not
		this.project.store.layermenu.forEach(function (b) {			
			if (layer.store.uuid == b.layer) {
				this.on(layermenuLayer);
			}
		}, this);

		// add toggle hook
		Wu.DomEvent.on( container, 'mousedown', function (e) { 

			// prevent other click events
			Wu.DomEvent.stop(e);

			// toggle layer
			this.toggle(layermenuLayer);

		}, this );

		// add edit hook
		Wu.DomEvent.on (button, 'mousedown', function (e) {
			
			// prevent other click events
			Wu.DomEvent.stop(e);

			return;// console.log('edit layer!');

			// toggle editMode
			this.toggleEdit(layermenuLayer);

		}, this);

		

	},

	getLayerByUuid : function (layerUuid) {
		var layer = _.find(this._layers, function (l) {
			// console.log('l: ', l);
			return l.layer.store.uuid == layerUuid;	
		});

		return layer;
	},

	enableLayerByUuid : function (layerUuid) {
		var layer = this.getLayerByUuid(layerUuid);
		if (layer) {
			this.toggle(layer);
			return layer;	
		}

		return false;
		
	},

	calculateHeight : function () {
		var min = _.size(this.project.getBaselayers());
		var padding = this.numberOfProviders * 35;
		this.maxHeight = (_.size(this.project.layers) - min) * 33 + padding;
		this.minHeight = 0;

		// add 100 if in editMode
		if (this.editMode) this.maxHeight += 100;
	},

	enableLayermenu : function () {
		var layerMenu = app.MapPane.enableLayermenu();
		app.SidePane.Map.mapSettings.controls.enableControl('layermenu');
		
		// save changes to project
		this.project.store.controls.layermenu = true;
		this.project._update('controls');
		
		return layerMenu;
	},

	toggle : function (layer) {
		
		// console.log('toggle --> ', layer);

		// ensure layerMenu is active
		this.layerMenu = Wu.app.MapPane.layerMenu;
		// this.layerMenu = this.layerMenu || Wu.app.MapPane.layerMenu;
		if (!this.layerMenu) this.layerMenu = this.enableLayermenu();
		this.layerMenu.enableEdit();
		
		if (layer.active) {
			
			// remove from layermenu
			var uuid = layer.layer.store.uuid;
			this.layerMenu._remove(uuid);

			// set off
			this.off(layer);

		} else {

			// add to layermenu
			this.layerMenu.add(layer.layer);

			// set on
			this.on(layer);
		}

		// mark occupied layers in layermenu
		var baselayerSetting = app.SidePane.Map.mapSettings.baselayer;
		baselayerSetting.markOccupied()

		// refresh cartoCssControl
		var cartoCss = app.MapPane.cartoCss;
		if (cartoCss) cartoCss.update()
	},

	toggleEdit : function (layer) {

	},

	on : function (layermenuLayer) {
		// enable in layermenuLayer menu
		Wu.DomUtil.addClass(layermenuLayer.container, 'active');
		layermenuLayer.active = true;
	},

	off : function (layermenuLayer) {
		// disable in layermenuLayer menu
		Wu.DomUtil.removeClass(layermenuLayer.container, 'active');
		layermenuLayer.active = false;
	},

	// turn off layer initiated on layermenu
	_off : function (layer) {
		var uuid = layer.store.uuid;
		var layermenuItem = this._layers[uuid];
		this.off(layermenuItem);
	},

	// post-open
	_open : function () {
		this.enableEdit();
		clearTimeout(this.closeEditTimer);
	},

	// post-close
	_close : function () {
		this.disableEdit();
		return;
		// clearTimeout(this.closeEditTimer);
		// var that = this;
		// this.closeEditTimer = setTimeout(function() {
		// 	that.disableEdit();
		// }, 3000);
	},

	// enable edit mode on layermenu itself
	enableEdit : function () {
		var layerMenu = Wu.app.MapPane.layerMenu;
		if (layerMenu) layerMenu.enableEdit();
	},

	disableEdit : function () {
		var layerMenu = Wu.app.MapPane.layerMenu;
		if (layerMenu) layerMenu.disableEdit();
	},

	markOccupied : function () {

		// get active baselayers
		var baseLayers = this.project.getBaselayers();
		var all = this.project.getLayers();

		all.forEach(function (a) {
			this.activate(a.store.uuid);
		}, this);

		baseLayers.forEach(function (bl) {
			this.deactivate(bl.uuid);
		}, this);

	},

	activate : function (layerUuid) {
		var layer = this._layers[layerUuid];
		if (layer) Wu.DomUtil.removeClass(layer.container, 'deactivated');
	},

	deactivate : function (layerUuid) {
		var layer = this._layers[layerUuid];
		if (layer) Wu.DomUtil.addClass(layer.container, 'deactivated');
	}

});




Wu.SidePane.Map.Position = Wu.SidePane.Map.MapSetting.extend({
	_ : 'sidepane.map.position', 

	type : 'position',



	getPanes : function () {
		this._container 		= Wu.DomUtil.get('editor-map-position-wrap');
		this._outer       	       	= Wu.DomUtil.get('editor-map-initpos-coordinates');
		this._inner 	  	       	= Wu.DomUtil.get('map-initpos-inner');
		this.panes.initPos             	= Wu.DomUtil.get('editor-map-initpos-button');
		this.panes.initPosLatValue     	= Wu.DomUtil.get('editor-map-initpos-lat-value');
		this.panes.initPosLngValue     	= Wu.DomUtil.get('editor-map-initpos-lng-value');
		this.panes.initPosZoomValue    	= Wu.DomUtil.get('editor-map-initpos-zoom-value');
		this.toggled 	               	= false;

		// add tooltip
		var h4 = this._container.getElementsByTagName('h4')[0];
		app.Tooltip.add(h4, 'Sets the starting position of the map.');
		// app.Tooltip.add(this._container, 'Sets the starting position of the map.');

	},

	addHooks : function () {

		// call addHooks on prototype
		Wu.SidePane.Map.MapSetting.prototype.addHooks.call(this)

		// add events
		Wu.DomEvent.on( this.panes.initPos,  'click', 		this.setPosition, this );
		Wu.DomEvent.on( this.panes.initPos,  'mousedown',      	this.buttonDown,  this );
		Wu.DomEvent.on( this.panes.initPos,  'mouseup',        	this.buttonUp,    this );
		Wu.DomEvent.on( this.panes.initPos,  'mouseleave',     	this.buttonUp,    this );

		Wu.DomEvent.on( this.panes.initPos         , 'mousedown', Wu.DomEvent.stopPropagation, this );
		Wu.DomEvent.on( this.panes.initPosLatValue , 'mousedown', Wu.DomEvent.stopPropagation, this );
		Wu.DomEvent.on( this.panes.initPosLngValue , 'mousedown', Wu.DomEvent.stopPropagation, this );
		Wu.DomEvent.on( this.panes.initPosZoomValue, 'mousedown', Wu.DomEvent.stopPropagation, this );

	},

	removeHooks : function () {
		// todo!!!
	},

	toggleDropdown : function (e) {
		if ( !this.toggled ) {
			this.toggled = true;
			this.open();                           
		} else {
			this.toggled = false;
			this.close();                                        
		}
	},

	setPosition : function (e) {

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

		// generate project thumb (if it hasn't been manually set before)
		var thumbCreated = project.getThumbCreated();
		if ( !thumbCreated ) project.createProjectThumb();

		// call update on view
		this.update();

	},


	update : function () {

		// call update on prototype
		Wu.SidePane.Map.MapSetting.prototype.update.call(this)

		// update values
		var position = this.project.getLatLngZoom();
		

		this.panes.initPosLatValue.value  = position.lat;
		this.panes.initPosLngValue.value  = position.lng;
		this.panes.initPosZoomValue.value = position.zoom;
	},

	save : function () {
		var that = this;

		// clear timer
		if (this.saveTimer) clearTimeout(this.saveTimer);

		// save on timeout
		this.saveTimer = setTimeout(function () {
			that.project._update('position');
		}, 1000);       // don't save more than every goddamed second

	},


});



Wu.SidePane.Map.Bounds = Wu.SidePane.Map.MapSetting.extend({
	_ : 'sidepane.map.bounds', 

	type : 'bounds',


	getPanes : function () {
		this._container 		= Wu.DomUtil.get('editor-map-bounds-wrap');
		this._outer 	        	= Wu.DomUtil.get('editor-map-bounds-coordinates');
		this._inner 	        	= Wu.DomUtil.get('map-bounds-inner');
		this.panes.clear 		= Wu.DomUtil.get('editor-map-bounds-clear');
		this.panes.bounds             	= Wu.DomUtil.get('editor-map-bounds');
		this.panes.boundsNELatValue   	= Wu.DomUtil.get('editor-map-bounds-NE-lat-value');
		this.panes.boundsNELngValue   	= Wu.DomUtil.get('editor-map-bounds-NE-lng-value');
		this.panes.boundsSWLatValue   	= Wu.DomUtil.get('editor-map-bounds-SW-lat-value');
		this.panes.boundsSWLngValue   	= Wu.DomUtil.get('editor-map-bounds-SW-lng-value');
		this.panes.boundsNE		= Wu.DomUtil.get('editor-map-bounds-NE');
		this.panes.boundsSW		= Wu.DomUtil.get('editor-map-bounds-SW');
		this.panes.minZoom 		= Wu.DomUtil.get('editor-map-bounds-min-zoom-value');
		this.panes.maxZoom 		= Wu.DomUtil.get('editor-map-bounds-max-zoom-value'); 
		this.panes.setMinZoom           = Wu.DomUtil.get('editor-map-bounds-set-minZoom'); 
		this.panes.setMaxZoom           = Wu.DomUtil.get('editor-map-bounds-set-maxZoom'); 
		this.toggled            	= false;

		// add tooltip
		var h4 = this._container.getElementsByTagName('h4')[0];
		// app.Tooltip.add(this._container, 'Decides the bounding area and the min/max zoom of the map. If a user moves outside of the bounding area, the map will "bounce" back to fit within the given bounding coordinates.');
		app.Tooltip.add(h4, 'Decides the bounding area and the min/max zoom of the map. If a user moves outside of the bounding area, the map will "bounce" back to fit within the given bounding coordinates.');

	},

	addHooks : function () {

		// call addHooks on prototype
		Wu.SidePane.Map.MapSetting.prototype.addHooks.call(this)

		// add events
		Wu.DomEvent.on( this.panes.bounds,   'click', this.setBounds,   this );
		Wu.DomEvent.on( this.panes.clear,    'click', this.clearBounds, this );
		Wu.DomEvent.on( this.panes.boundsNE, 'click', this.setBoundsNE, this );
		Wu.DomEvent.on( this.panes.boundsSW, 'click', this.setBoundsSW, this );

		Wu.DomEvent.on( this.panes.setMinZoom, 'click', this.setMinZoom, this );
		Wu.DomEvent.on( this.panes.setMaxZoom, 'click', this.setMaxZoom, this );

		Wu.DomEvent.on( this.panes.bounds,   'mousedown',  this.buttonDown,  this );
		Wu.DomEvent.on( this.panes.bounds,   'mouseup',    this.buttonUp,    this );
		Wu.DomEvent.on( this.panes.bounds,   'mouseleave', this.buttonUp,    this );


		Wu.DomEvent.on(this.panes.clear 	      , 'mousedown', Wu.DomEvent.stopPropagation, this );
		Wu.DomEvent.on(this.panes.bounds           , 'mousedown', Wu.DomEvent.stopPropagation, this );
		Wu.DomEvent.on(this.panes.boundsNELatValue , 'mousedown', Wu.DomEvent.stopPropagation, this );
		Wu.DomEvent.on(this.panes.boundsNELngValue , 'mousedown', Wu.DomEvent.stopPropagation, this );
		Wu.DomEvent.on(this.panes.boundsSWLatValue , 'mousedown', Wu.DomEvent.stopPropagation, this );
		Wu.DomEvent.on(this.panes.boundsSWLngValue , 'mousedown', Wu.DomEvent.stopPropagation, this );
		Wu.DomEvent.on(this.panes.boundsNE	      , 'mousedown', Wu.DomEvent.stopPropagation, this );
		Wu.DomEvent.on(this.panes.boundsSW	      , 'mousedown', Wu.DomEvent.stopPropagation, this );
		Wu.DomEvent.on(this.panes.minZoom 	      , 'mousedown', Wu.DomEvent.stopPropagation, this );
		Wu.DomEvent.on(this.panes.maxZoom 	      , 'mousedown', Wu.DomEvent.stopPropagation, this );
		Wu.DomEvent.on(this.panes.setMinZoom       , 'mousedown', Wu.DomEvent.stopPropagation, this );
		Wu.DomEvent.on(this.panes.setMaxZoom       , 'mousedown', Wu.DomEvent.stopPropagation, this );
		
	},

	removeHooks : function () {
		// todo!!!
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
		project.setBounds({				// refactor:  project.setBounds()
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
		
		// call update on view
		this.update();

		// enforce new bounds
		this.enforceBounds();

	},

	setMinZoom : function () {
		var map = app._map;
		var minZoom = map.getZoom();
		var bounds = this.project.getBounds();
		bounds.minZoom = minZoom;

		// set bounds to project
		this.project.setBounds(bounds);
		
		// update view
		this.update();
	},

	setMaxZoom : function () {
		var map = app._map;
		var maxZoom = map.getZoom();
		var bounds = this.project.getBounds();
		bounds.maxZoom = parseInt(maxZoom);

		// set bounds to project
		this.project.setBounds(bounds);
		
		// update view
		this.update();
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


	_nullBounds : {				
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
	},

	clearBounds : function () {
		
		// get actual Project object
		var project = Wu.app.activeProject;
		var map = Wu.app._map;

		// set bounds to project
		project.setBounds(this._nullBounds);

		// call update on view
		this.update();

		// enforce
		this.enforceBounds();

		// no bounds
		map.setMaxBounds(false);

	},

	setBoundsSW : function (e) {

		// get actual Project object
		var project = Wu.app.activeProject;
		var map = Wu.app._map;

		// if no active project, do nothing
		if (!project) return; 

		var bounds = map.getBounds();
		var zoom = map.getZoom();

		// set bounds to project
		project.setBoundsSW({
			lat : bounds._southWest.lat,
			lng : bounds._southWest.lng
		});

		// set zoom to project
		project.setBoundsZoomMin(zoom);

		// call update on view
		this.update();

		// update map
		map.setMaxBounds(bounds);


	},

	setBoundsNE : function (e) {

		// get actual Project object
		var project = app.activeProject;

		// if no active project, do nothing
		if (!project) return; 

		var bounds = app._map.getBounds();

		// set bounds to project
		project.setBoundsNE({ 			
			lat : bounds._northEast.lat,
			lng : bounds._northEast.lng
		});

		// update view
		this.update();

	},

	toggleDropdown : function (e) {
		if ( !this.toggled ) {
			this.toggled = true;
			this.open();                           
		} else {
			this.toggled = false;
			this.close();                                         
		}
	},


	update : function () {

		// call update on prototype
		Wu.SidePane.Map.MapSetting.prototype.update.call(this)

		// bounds
		var bounds = this.project.getBounds();
		if (bounds) {
			this.panes.boundsNELatValue.value = bounds.northEast.lat;
			this.panes.boundsNELngValue.value = bounds.northEast.lng;
			this.panes.boundsSWLatValue.value = bounds.southWest.lat;
			this.panes.boundsSWLngValue.value = bounds.southWest.lng;
			this.panes.maxZoom.value 	  = bounds.maxZoom;
			this.panes.minZoom.value 	  = bounds.minZoom;
		};

		this.enforceBounds();
	},

	save : function () {
		var that = this;

		// clear timer
		if (this.saveTimer) clearTimeout(this.saveTimer);

		// save on timeout
		this.saveTimer = setTimeout(function () {
			that.project._update('bounds');
		}, 1000);       // don't save more than every goddamed second

	},


});





                       
Wu.SidePane.Map.Controls = Wu.SidePane.Map.MapSetting.extend({
	_ : 'sidepane.map.controls', 

	type : 'controls',


	getPanes : function () {
		this._container 			= Wu.DomUtil.get('editor-map-controls-wrap');
		this._outer 				= Wu.DomUtil.get('editor-map-controls-inner-wrap');

		this.panes.controlZoom                 	= Wu.DomUtil.get('map-controls-zoom').parentNode.parentNode;
		this.panes.controlDraw                 	= Wu.DomUtil.get('map-controls-draw').parentNode.parentNode;
		this.panes.controlInspect              	= Wu.DomUtil.get('map-controls-inspect').parentNode.parentNode;
		this.panes.controlDescription          	= Wu.DomUtil.get('map-controls-description').parentNode.parentNode;
		this.panes.controlLayermenu            	= Wu.DomUtil.get('map-controls-layermenu').parentNode.parentNode;
		this.panes.controlLegends              	= Wu.DomUtil.get('map-controls-legends').parentNode.parentNode;
		this.panes.controlMeasure              	= Wu.DomUtil.get('map-controls-measure').parentNode.parentNode;
		this.panes.controlGeolocation          	= Wu.DomUtil.get('map-controls-geolocation').parentNode.parentNode;
		this.panes.controlMouseposition        	= Wu.DomUtil.get('map-controls-mouseposition').parentNode.parentNode;
		this.panes.controlBaselayertoggle      	= Wu.DomUtil.get('map-controls-baselayertoggle').parentNode.parentNode;
		this.panes.controlCartocss 		= Wu.DomUtil.get('map-controls-cartocss').parentNode.parentNode;

		// add tooltip
		var h4 = this._container.getElementsByTagName('h4')[0]; // refactor 
		app.Tooltip.add(h4, 'Enables the control options that goes on top of the map.');

		// Add tooltip for each option
		app.Tooltip.add(this.panes.controlZoom, 'Enables zooming on the map. Puts [+] and [-] buttons on the map.');
		app.Tooltip.add(this.panes.controlDraw, 'Enables drawing on the map.');
		app.Tooltip.add(this.panes.controlInspect, 'The layer inspector enables users to change the order or selected layers, to isolate layers, and to zoom to layer bounds.');
		app.Tooltip.add(this.panes.controlDescription, 'Enables layer description boxes.');
		app.Tooltip.add(this.panes.controlLayermenu, 'Enables the layer menu.');
		app.Tooltip.add(this.panes.controlLegends, 'Enable layer legends.');
		app.Tooltip.add(this.panes.controlMeasure, 'Enables scaling tool on the map.');
		app.Tooltip.add(this.panes.controlGeolocation, 'Enables users to search for address or locations in the world.');
		app.Tooltip.add(this.panes.controlMouseposition, 'Shows the geolocation of mouse pointer.');
		app.Tooltip.add(this.panes.controlBaselayertoggle, 'Enables toggelig base layers on and off.');
		app.Tooltip.add(this.panes.controlCartocss, 'Enables the CartoCSS editor, the tooltip styler, and auto generated layer legends.');



	},

	addHooks : function () {

		// call addHooks on prototype
		Wu.SidePane.Map.MapSetting.prototype.addHooks.call(this)

		// add events
		Wu.DomEvent.on( this.panes.controlZoom,            'mousedown click', this.toggleControl, this);
		Wu.DomEvent.on( this.panes.controlDraw,            'mousedown click', this.toggleControl, this);
		Wu.DomEvent.on( this.panes.controlInspect,         'mousedown click', this.toggleControl, this);
		Wu.DomEvent.on( this.panes.controlDescription,     'mousedown click', this.toggleControl, this);
		Wu.DomEvent.on( this.panes.controlLayermenu,       'mousedown click', this.toggleControl, this);
		Wu.DomEvent.on( this.panes.controlLegends,         'mousedown click', this.toggleControl, this);
		Wu.DomEvent.on( this.panes.controlMeasure,         'mousedown click', this.toggleControl, this);
		Wu.DomEvent.on( this.panes.controlGeolocation,     'mousedown click', this.toggleControl, this);
		Wu.DomEvent.on( this.panes.controlMouseposition,   'mousedown click', this.toggleControl, this);
		Wu.DomEvent.on( this.panes.controlBaselayertoggle, 'mousedown click', this.toggleControl, this);
		Wu.DomEvent.on( this.panes.controlCartocss, 	   'mousedown click', this.toggleControl, this);


	},

	removeHooks : function () {
		// todo!!!
	},

	calculateHeight : function () {

		var x = _.size(this.controls);
		this.maxHeight = x * 30 + 30;
		this.minHeight = 0;
	},


	toggleControl : function (e) {
		
		// prevent default checkbox behaviour
		if (e.type == 'click') return Wu.DomEvent.stop(e);
	
		// stop anyway
		Wu.DomEvent.stop(e);

		// get type (zoom, draw, etc.)
		var item = e.target.getAttribute('which');

		// get checkbox
		var target = Wu.DomUtil.get('map-controls-' + item);

		// do action (eg. toggleControlDraw);
		var on      = !target.checked;
		var enable  = 'enable' + item.camelize();
		var disable = 'disable' + item.camelize();
		var mapPane = app.MapPane;

		// toggle
		if (on) {
			// enable control on map
			mapPane[enable]();

			// enable control in menu
			this.enableControl(item);
		} else {
			// disable control on map
			mapPane[disable]();
			
			// disable control in menu
			this.disableControl(item);
		}

		// save changes to project
		this.project.store.controls[item] = on;	// todo
		this.project._update('controls');

		// update controls css
		mapPane.updateControlCss();

	},


	disableControl : function (type) {
		
		// get vars
		var target = Wu.DomUtil.get('map-controls-' + type); // checkbox
		var parent = Wu.DomUtil.get('map-controls-title-' + type).parentNode; // div that gets .active 
		var map    = Wu.app._map;  // map

		// toggle check and active class
		Wu.DomUtil.removeClass(parent, 'active');
		target.checked = false;
	},

	enableControl : function (type) {
		
		// cxxx 

		// get vars
		var target = Wu.DomUtil.get('map-controls-' + type); // checkbox
		var parent = Wu.DomUtil.get('map-controls-title-' + type).parentNode; // div that gets .active 
		var map    = Wu.app._map;  // map

		// toggle check and active class
		Wu.DomUtil.addClass(parent, 'active');
		target.checked = true;
	},

	update : function () {

		// call update on prototype
		Wu.SidePane.Map.MapSetting.prototype.update.call(this)

		this.controls = this.project.getControls();

		// tmp hack to remove vectorstyle
		delete this.controls.vectorstyle;		// todo: remove

		// toggle each control
		for (c in this.controls) {
			var on = this.controls[c];
			var enable = 'enable' + c.camelize();
			var disable = 'disable' + c.camelize();
			
			// toggle
			if (on) {	
				// enable control on map
				Wu.app.MapPane[enable]();

				// enable control in menu
				this.enableControl(c);
			} else {	
				// disable control on map
				Wu.app.MapPane[disable]();
				
				// disable control in menu
				this.disableControl(c);
			}
		}
	},

});








Wu.SidePane.Map.Connect = Wu.SidePane.Map.MapSetting.extend({
	_ : 'sidepane.map.connect', 

	type : 'connect',			

	initLayout : function (container) {
		
		// container, header, outer
		this._container	 	= Wu.DomUtil.create('div', 'editor-inner-wrapper editor-map-item-wrap ct12 ct17 ct23', container);
		var h4 			= Wu.DomUtil.create('h4', '', this._container, 'Connected Sources');
		this._outer 		= Wu.DomUtil.create('div', 'connect-outer', this._container);

		// import OSM
		var box 		= Wu.DomUtil.create('div', 'connect-osm', this._outer);
		var h4_3		= Wu.DomUtil.create('div', 'connect-title', box, 'Open Street Map');
		this._osmwrap 		= Wu.DomUtil.create('div', 'osm-connect-wrap', this._outer);
		this._osmbox 		= Wu.DomUtil.create('div', 'osm-add-box', this._osmwrap, 'Add OSM layer');

		// mapbox connect
		var wrap 	  	= Wu.DomUtil.create('div', 'connect-mapbox', this._outer);
		var h4_2 		= Wu.DomUtil.create('div', 'connect-title', wrap, 'Mapbox');
		this._mapboxWrap  	= Wu.DomUtil.create('div', 'mapbox-connect-wrap ct11', this._outer);
		this._mapboxInput 	= Wu.DomUtil.create('input', 'input-box search import-mapbox-layers', this._mapboxWrap);
		this._mapboxConnect 	= Wu.DomUtil.create('div', 'smap-button-gray ct0 ct11 import-mapbox-layers-button', this._mapboxWrap, 'Add');
		this._mapboxAccounts 	= Wu.DomUtil.create('div', 'mapbox-accounts', this._mapboxWrap);
		
		// clear vars n fields
		this.resetInput();


		// add tooltip
		app.Tooltip.add(h4, 'Imports layers from MapBox accounts.');


	},

	addHooks : function () {
		Wu.SidePane.Map.MapSetting.prototype.addHooks.call(this)

		// connect mapbox button
		Wu.DomEvent.on( this._mapboxConnect, 'click', this.importMapbox, this );

		// add osm button
		Wu.DomEvent.on( this._osmbox, 'click', this.addOSMLayer, this );


		// stops
		Wu.DomEvent.on( this._mapboxConnect, 'mousedown', Wu.DomEvent.stop, this );
		Wu.DomEvent.on( this._mapboxInput, 'mousedown', Wu.DomEvent.stopPropagation, this );
		Wu.DomEvent.on( this._osmwrap, 'mousedown', Wu.DomEvent.stopPropagation, this );
		Wu.DomEvent.on( this._osmbox, 'mousedown', Wu.DomEvent.stopPropagation, this );


	},

	removeHooks : function () {
		// todo!!!
	},	

	calculateHeight : function () {
		var num = this.project.getMapboxAccounts().length;
		this.maxHeight = 150 + num * 30;
		this.minHeight = 0;
	},

	// get mapbox access token
	tokenMode : function () {
		this._username = this._mapboxInput.value;
		this._mapboxInput.value = '';
		this._askedToken = true;
		this._mapboxConnect.innerHTML = 'OK';
		this._mapboxInput.setAttribute('placeholder', 'Enter access token');
	},

	// reset temp vars
	resetInput : function () {
		this._username = null;
		delete this._username;
		this._askedToken = false;
		this._mapboxConnect.innerHTML = 'Add';
		this._mapboxInput.setAttribute('placeholder', 'Mapbox username');
		this._mapboxInput.value = '';
	},

	addOSMLayer : function () {

		// create layer
		this.project.createOSMLayer(function (err, layer) {

			// add to baselayer, layermenu
			this._updateLayerOptions();

		}.bind(this));

	},

	_updateLayerOptions : function () {

		// update contents in Options/Baselayers + Layermenu
		app.SidePane.Map.mapSettings.baselayer.update();
		app.SidePane.Map.mapSettings.layermenu.update();
	},

	// on click when adding new mapbox account
	importMapbox : function () {

		if (!this._askedToken) return this.tokenMode();

		// get username
		var username = this._username;
		var accessToken = this._mapboxInput.value;

		// clear
		this.resetInput();

		// get mapbox account via server
		this._importMapbox(username, accessToken, this.importedMapbox);

	},

	_importMapbox : function (username, accessToken, callback) {

		// get mapbox account via server
		var data = {
			'username' : username,
			'accessToken' : accessToken,
			'projectId' : this.project.store.uuid
		}
		// post         path                            json          callback      this
		Wu.post('/api/util/getmapboxaccount', JSON.stringify(data), callback, this);
	},

	importedMapbox : function (that, json) {
		
		// project store
		var result = JSON.parse(json);
		var error = result.error;
		var store = result.project;

		if (error) {
			console.log('There was an error importing mapbox: ', error);
			return;
		}

		// update project
		that.project.setStore(store);

	},

	fillMapbox : function () {

		// get accounts
		var accounts = this.project.getMapboxAccounts();

		// return if no accounts
		if (!accounts) return;

		// reset
		this._mapboxAccounts.innerHTML = '';
		
		// fill with accounts
		accounts.forEach(function (account) {
			this._insertMapboxAccount(account);
		}, this);
		
	},

	_insertMapboxAccount : function (account) {

		// wrap
		var wrap  = Wu.DomUtil.create('div', 'mapbox-listed-account', this._mapboxAccounts);
		
		// title
		var title = Wu.DomUtil.create('div', 'mapbox-listed-account-title', wrap, account.username.camelize());

		// return if not edit mode
		if (!this.project.editMode) return;

		// refresh button 
		var refresh = Wu.DomUtil.create('div', 'mapbox-listed-account-refresh', wrap);

		// delete button
		var del = Wu.DomUtil.create('div', 'mapbox-listed-account-delete', wrap);


		// refresh event
		Wu.DomEvent.on(refresh, 'mousedown', function (e) {
			Wu.DomEvent.stop(e);
			var msg = 'Are you sure you want to refresh the account? This will DELETE old layers and re-import them.';
			if (confirm(msg)) this._refreshMapboxAccount(wrap, account);
		}, this);

		// delete event
		Wu.DomEvent.on(del, 'mousedown', function (e) {
			Wu.DomEvent.stop(e);
			console.log('delete account');
			
			// remove account
			var msg = 'Are you sure you want to delete the account? This will DELETE all layers from account in this project.';
			if (confirm(msg)) this._removeMapboxAccount(wrap, account);
			
		}, this);

	},

	_removeMapboxAccount : function (div, account) {
		Wu.DomUtil.remove(div);
		this.project.removeMapboxAccount(account);
	},

	_refreshMapboxAccount : function (div, account) {
		console.log('_refreshMapboxAccount', account);

		// delete and re-import
		this._removeMapboxAccount(div, account);

		// get mapbox account via server
		var that = this;
		setTimeout(function () {
			that._importMapbox(account.username, account.accessToken, that.importedMapbox);
		}, 1000); // hack! todo!

	},


	fillOSM : function () {
	},

	
	update : function () {
		Wu.SidePane.Map.MapSetting.prototype.update.call(this)	// call update on prototype

		// add OSM options
		this.fillOSM();

		// fill in mapbox accounts
		this.fillMapbox();
	},



});


                       
Wu.SidePane.Map.Settings = Wu.SidePane.Map.MapSetting.extend({
	_ : 'sidepane.map.settings', 

	type : 'settings',

	options : {

		// include settings
		// screenshot 	: true,
		socialSharing 	: true,
		documentsPane 	: true,
		dataLibrary 	: true,
		mediaLibrary 	: false,
		// autoHelp 	: true,
		// autoAbout 	: true,
		darkTheme 	: true,
		tooltips 	: true,
		mapboxGL	: false,

	},

	initLayout : function (container) {

		// container, header, outer
		this._container	= Wu.DomUtil.create('div', 'editor-inner-wrapper editor-map-item-wrap ct12 ct17 ct23', container);
		var h4 		= Wu.DomUtil.create('h4', '', this._container, 'Settings');
		this._outer 	= Wu.DomUtil.create('div', 'settings-outer', this._container);

		// add tooltip
		app.Tooltip.add(h4, 'Enable additional map settings.');


	},

	addHooks : function () {
		Wu.SidePane.Map.MapSetting.prototype.addHooks.call(this)
		Wu.DomEvent.on(this._outer, 'mousedown', Wu.DomEvent.stopPropagation, this);
	},

	removeHooks : function () {
		// todo!!!

		Wu.DomEvent.off(this._outer, 'mousedown', Wu.DomEvent.stopPropagation, this);
	},	

	calculateHeight : function () {
		var num = _.filter(this.options, function (o) { return o; }).length;
		this.maxHeight = num * 30;
		this.minHeight = 0;	
	},

	contentLayout : function () {

		// screenshot
		// social media sharing
		// documents pane
		// data library pane
		// add help/about auto-folders to documents
		// dark/light theme

		var wrapper = Wu.DomUtil.create('div', 'settings-wrapper');

		if (this.options.screenshot) {

			var screenshot = this._contentItem('screenshot', 'Screenshots');
			wrapper.appendChild(screenshot);

			// add tooltip
			app.Tooltip.add(screenshot, 'Enable users to make screenshots of map');

		}
		if (this.options.socialSharing) {

			var socialSharing = this._contentItem('socialSharing', 'Sharing');
			wrapper.appendChild(socialSharing);

			// add tooltip
			app.Tooltip.add(socialSharing, 'Enable social sharing for this map');

		}
		if (this.options.documentsPane) {

			var documentsPane = this._contentItem('documentsPane', 'Documents Pane');
			wrapper.appendChild(documentsPane);

			// add tooltip
			app.Tooltip.add(documentsPane, 'Enable documents pane for this map');

		}
		if (this.options.dataLibrary) {

			var dataLibrary = this._contentItem('dataLibrary', 'Data Library');
			wrapper.appendChild(dataLibrary);

			// add tooltip
			app.Tooltip.add(dataLibrary, 'Enable public data library for this map');

		}
		if (this.options.mediaLibrary) {

			var mediaLibrary = this._contentItem('mediaLibrary', 'Media Library');
			wrapper.appendChild(mediaLibrary);

			// add tooltip
			app.Tooltip.add(mediaLibrary, 'Enable media library for this map');			

		}
		if (this.options.autoHelp) {

			var autoHelp = this._contentItem('autoHelp', 'Add Help');
			wrapper.appendChild(autoHelp);

			// add tooltip
			app.Tooltip.add(autoHelp, 'Add help section to documents');			

		}
		if (this.options.autoAbout) {

			var autoAbout = this._contentItem('autoAbout', 'Add About');
			wrapper.appendChild(autoAbout);

			// add tooltip
			app.Tooltip.add(autoAbout, 'Add about section to documents');			

		}
		if (this.options.darkTheme) {

			var darkTheme = this._contentItem('darkTheme', 'Dark Theme');
			wrapper.appendChild(darkTheme);

			// add tooltip
			app.Tooltip.add(darkTheme, 'Toggle between dark- and light theme');

		}
		if (this.options.tooltips) {

			var tooltips = this._contentItem('tooltips', 'Tooltips');
			wrapper.appendChild(tooltips);

			// add tooltip
			app.Tooltip.add(tooltips, 'Enable this tooltip for the portal');

		}
		if (this.options.mapboxGL) {
			
			var mapboxGL = this._contentItem('mapboxGL', 'MapboxGL');
			wrapper.appendChild(mapboxGL);

			// add tooltip
			app.Tooltip.add(mapboxGL, 'Render map with GL');

		}

		return wrapper;
	},

	_contentItem : function (setting, title) {

		// create item
		var className 	= 'settings-item settings-item-' + setting,
		    div 	= Wu.DomUtil.create('div', className),
		    titlediv 	= Wu.DomUtil.create('div', 'settings-item-title', div),
		    switchWrap  = Wu.DomUtil.create('div', 'switch', div),
		    input 	= Wu.DomUtil.create('input', 'cmn-toggle cmn-toggle-round-flat', switchWrap),
		    label 	= Wu.DomUtil.create('label', '', switchWrap),
		    id 		= Wu.Util.guid();
		
		// set title etc.
		titlediv.innerHTML = title;
		input.setAttribute('type', 'checkbox');
		if (this._settings[setting]) input.setAttribute('checked', 'checked');
		input.id = id;
		label.setAttribute('for', id);

		// set events
		Wu.DomEvent.on(div, 'click', function (e) {			
			Wu.DomEvent.stop(e);

			// toggle setting
			this.project.toggleSetting(setting);

			// refresh settings
			this._settings = this.project.getSettings();

			// toggle button
			this._settings[setting] ? input.setAttribute('checked', 'checked') : input.removeAttribute('checked');
			
		}, this);
		 
		// return div
		return div;

	},

	save : function () {
		this.project.setSettings(this._settings);
	},

	update : function () {
		Wu.SidePane.Map.MapSetting.prototype.update.call(this)
		
		// get project settings
		this._settings = this.project.getSettings();

		// create content
		var content = this.contentLayout();
		this._outer.innerHTML = '';
		this._outer.appendChild(content);

	},




});

;// DocumentsPane
Wu.SidePane.Documents = Wu.SidePane.Item.extend({
	
	type : 'documents',
	title : 'Docs',


	initContent : function () {

		// create new fullscreen page, and set as default content
		this._content = Wu.DomUtil.create('div', 'fullpage-documents ct1', Wu.app._appPane);
		
		// create container (overwrite default)
		this._container = Wu.DomUtil.create('div', 'editor-wrapper ct11', this._content);

		// insert template
		this._container.innerHTML = ich.documentsContainer();

		// get element handlers
		this._leftpane 	 = Wu.DomUtil.get('documents-container-leftpane');
		this._folderpane = Wu.DomUtil.get('documents-folder-list');
		this._rightpane  = Wu.DomUtil.get('documents-container-rightpane');
		this._textarea   = Wu.DomUtil.get('documents-container-textarea');
		this._newfolder  = Wu.DomUtil.get('documents-new-folder');

		// add tooltip
		app.Tooltip.add(this._menu, 'This is the projects document section.');
		
	},

	initFolders : function () {

		this.folders = {};
		var folders = this.project.store.folders;

		// init local folder object
		folders.forEach(function (folder, i, arr) {
			this.folders[folder.uuid] = folder;
		}, this);

	},

	addHooks : function () {

	},

	addEditHooks : function () {

		// new folder
		Wu.DomEvent.on(this._newfolder, 'mousedown', this.newFolder, this);

		// add grande.js
		this.addGrande();
		
		// show (+)
		Wu.DomUtil.removeClass(this._newfolder, 'displayNone');

	},

	addGrande : function () {
		// get textarea nodes for grande
		var nodes = this._textarea;

		// get sources
		var files   = this.project.getFiles();
		var sources = this.project.getGrandeFiles(files);
		var images  = this.project.getGrandeImages(files);

		// set grande options
		var options = {
			plugins : {

		        	// file attachments
			        attachments : new G.Attachments(sources, {
			        	icon : [app.options.servers.portal + 'images/image-c9471cb2-7e0e-417d-a048-2ac501e7e96f',
			        		app.options.servers.portal + 'images/image-7b7cc7e4-404f-4e29-9d7d-11f0f24faf42'],
			        	className : 'attachment'
			        }),

			        // image attachments
			        images :  new G.Attachments(images, {
			        	icon : [app.options.servers.portal + 'images/image-0359b349-6312-4fe5-b5d7-346a7a0d3c38',
			        		app.options.servers.portal + 'images/image-087ef5f5-b838-48bb-901f-7e896de7c59e'],
			        	embedImage : true,			// embed image in text! 
			        	className : 'image-attachment'
			        }),

			},
			events : {

				// add change event listener
				change : this.textChange
			}
		}

		// create Grande with attachment and image plugin
		this.grande = G.rande(nodes, options);

	},

	removeGrande : function () {
		if (!this.grande) return;
		this.grande.destroy();
		delete this.grande;
	},
	

	textChange : function () {
		// console.log('textChange');
	},

	removeEditHooks : function () {
		
		// new folder
		Wu.DomEvent.off(this._newfolder, 'mousedown', this.newFolder, this);

		// unbind grande.js text editor
		this.removeGrande();

		// hide (+)
		Wu.DomUtil.addClass(this._newfolder, 'displayNone');

	},

	_activate : function (e) {                

		// set top
		this.adjustTop();

		// turn off header resizing and icon
		Wu.app.HeaderPane.disableResize();

		// select first title (create fake e object)
		var folders = this.project.store.folders;
		if (folders.length > 0) {
			var uuid = folders[0].uuid;
			this.selectFolder(uuid);
		};
	
		// if editMode
		if (this.project.editMode) {

			// add shift key hook
			this.enableShift();

			//  hide/show (+) button
			this.addEditHooks();
		}

		// hide other controls
		this._hideControls();

	},

	_hideControls : function () {

		// layermenu
		var lm = app.MapPane.layerMenu;
		if (lm) lm.hide();

		// inspect
		var ic = app.MapPane.inspectControl;
		if (ic) ic.hide();

		// legends
		var lc = app.MapPane.legendsControl;
		if (lc) lc.hide();

		// description
		var dc = app.MapPane.descriptionControl;
		if (dc) dc.hide();
	},

	_showControls : function () {
		// layermenu
		var lm = app.MapPane.layerMenu;
		if (lm) lm.show();

		// inspect
		var ic = app.MapPane.inspectControl;
		if (ic) ic.show();

		// legends
		var lc = app.MapPane.legendsControl;
		if (lc) lc.show();

		// description
		var dc = app.MapPane.descriptionControl;
		if (dc) dc.show();
	},

	_deactivate : function () {

		// turn off header resizing
		Wu.app.HeaderPane.enableResize();

		// remove shift key edit hook
		this.disableShift();

		// remove edit hooks 
		this.removeEditHooks();

		// show controls
		this._showControls();
	},


	enableShift : function () {
		// add shift key edit hook
		Wu.DomEvent.on(window, 'keydown', this.shiftMode, this);
		Wu.DomEvent.on(window, 'keyup', this.unshiftMode, this);
	},

	disableShift : function () {
		// remove shift key edit hook
		Wu.DomEvent.off(window, 'keydown', this.shiftMode, this);
		Wu.DomEvent.off(window, 'keyup', this.unshiftMode, this);
	},

	shiftMode : function (e) {
		var evt = e || window.event;
		if (evt.which != 16) return;    // shift key
	       
		// show delete buttons
		for (b in this._deleteButtons) {
			var btn = this._deleteButtons[b];
			btn.style.visibility = 'visible';
		}
	},

	unshiftMode : function (e) {
		var evt = e || window.event;
		if (evt.which != 16) return;    // shift key
		
		// hide delete buttons
		for (b in this._deleteButtons) {
			var btn = this._deleteButtons[b];
			btn.style.visibility = 'hidden';
		}
	},

	
	adjustTop : function () {
		// debug, for innfelt header
		return;
		// make room for project header
		var project = Wu.app.activeProject;
		if (project) {
			this._content.style.top = project.store.header.height + 'px';
		}

		// adjust top of left pane
		this._leftpane.style.top = '-' + project.store.header.height + 'px';
	},

       

	update : function () {

		// use active project
		this.project = app.activeProject;

		// flush
		this.reset();

		// set folders
		this.createFolders();

		// editMode: hide/show (+) button
		if (this.project.editMode) {
			Wu.DomUtil.removeClass(this._newfolder, 'displayNone');
		} else {
			Wu.DomUtil.addClass(this._newfolder, 'displayNone');
		}

	},

	updateContent : function () {  

		// reset text pane
		this._textarea.innerHTML = '';

		// update         
		this.update();
	},

	newFolder : function () {

		var folder = {
			'title'   : 'Title',
			'uuid'    : Wu.Util.guid('folder'),
			'content' : 'Text content'
		}

		// update 
		this.project.store.folders.push(folder);

		// refresh
		this.update();

	},

	createFolders : function () {

		// set folders
		var folders = this.project.store.folders;

		// return if no folders
		if (!folders) return;

		// delete buttons object
		this._deleteButtons = {};

		// create each folder headline
		folders.forEach(function (elem, i, arr) {

			this._createFolder(elem);

		}, this);
	       
	},

	_createFolder : function (elem) {
		// if editMode
		if (this.project.editMode) {
			// delete button
			var btn = Wu.DomUtil.create('div', 'documents-folder-delete', this._folderpane, 'x');
			// btn.innerHTML = 'x';
			Wu.DomEvent.on(btn, 'click', function (e) { this.deleteFolder(elem.uuid); }, this);
			this._deleteButtons[elem.uuid] = btn;
		}

		// folder item
		var folder = elem;
		folder.el = Wu.DomUtil.create('div', 'documents-folder-item ct23 ct28', this._folderpane);
		folder.el.innerHTML = folder.title;
	       
		// set hooks
		Wu.DomEvent.on( folder.el,  'mousedown', function (e) {
			this.selectFolder(folder.uuid);
		}, this );     // select folder
		
		// if editMode
		if (this.project.editMode) {
			Wu.DomEvent.on( folder.el,  'dblclick', function (e) {
				this._renameFolder(e, folder.uuid);
			}, this );      // rename folder
		}

		// update object
		this.folders[folder.uuid] = folder;
	},

	deleteFolder : function (uuid) {
		if (confirm('Are you sure you want to delete folder ' + this.folders[uuid].title + '?')) {
			delete this.folders[uuid];
			this.save();
		}
	},

	_renameFolder : function (e, uuid) {

		this._editing = true;

		// remove shift key edit hook
		this.disableShift();

		// set values 
		var div   = e.target;
		var value = e.target.innerHTML;
		var input = ich.injectFolderTitleInput({ value : value });
		
		// inject <input>
		div.innerHTML = input;

		// focus
		var target = div.firstChild;
		target.focus();
		target.selectionStart = target.selectionEnd;	// prevents text selection

		// save on blur or enter
		Wu.DomEvent.on( target,  'blur', function (e) { 
			this._titleBlur(e, uuid); 
		}, this );     // save folder title
		Wu.DomEvent.on( target,  'keydown', function (e) { 
			this._titleKey(e, uuid); 
		}, this );     // save folder title

	},

	_titleKey : function (e, uuid) {
		// blur on enter
		if (event.which == 13 || event.keyCode == 13) this._titleBlur(e, uuid);
	},

	_titleBlur : function (e, uuid) {
		if (!this._editing) return;
		this._editing = false;

		// get value
		var value = e.target.value;

		// revert to <div>
		var div = e.target.parentNode;
		div.innerHTML = value;

		// update value
		this.folders[uuid].title = value;                                                                                                                                                                                    

		// save
		this.save();

		// add shift key edit hook
		this.enableShift();

	},


	selectFolder : function (uuid) {

		// get folder
		var folder = this.folders[uuid];

		// clear rightpane hooks
		Wu.DomEvent.off(this._textarea, 'keydown mousedown', this.autosave, this ); // auto-save

		// clear rightpane content
		this._textarea.innerHTML = '';
		this._textarea.innerHTML = folder.content;
		this._textarea.fuuid 	 = uuid;
		
		// blur textarea
		this._textarea.blur();

		// underline title
		this.underline(uuid);

		// set hooks
		Wu.DomEvent.on(this._textarea, 'keydown mousedown', this.autosave, this ); // auto-save

	},

	underline : function (uuid) {
		for (f in this.folders) {
			var el = this.folders[f].el;
			var id = this.folders[f].uuid;

			// underline selected title
			if (uuid == id) { Wu.DomUtil.addClass(el, 'underline'); } 
			else { Wu.DomUtil.removeClass(el, 'underline'); }	
		}
	},
	
	autosave : function () {
		var that = this;
		clearTimeout(this._saving);

		// save after 500ms of inactivity
		this._saving = setTimeout(function () {
			that.saveText();
		}, 500);

	},

	saveText : function () {
		var f = this.folders[this._textarea.fuuid].content;
		var text = this._textarea.innerHTML;

		// return if no changes
		if (f == text) return; 
		
		// update folder object 
		this.folders[this._textarea.fuuid].content = text;
		
		// save
		this.save();
	},

	// save to server
	save : function () {
		var folders = this.folders;
		
		// convert to array
		this.project.store.folders = [];
		for (f in folders) {
			var fo = Wu.extend({}, folders[f]);     // clone 
			delete fo.el;                           // delete .el on clone only
			this.project.store.folders.push(fo);    // push to storage
		}

		// save project to server
		this.project._update('folders');

		// set status
		app.setSaveStatus();

		// refresh
		this.update();
	},

      

	reset : function () {

		// reset left pane
		this._folderpane.innerHTML = '';

		// reset object
		this.folders = {};
	}

});;Wu.SidePane.DataLibrary = Wu.SidePane.Item.extend({
	_ : 'sidepane.datalibrary', 
	
	type : 'dataLibrary',
	title : 'Data <br> Library',


	initContent : function () {

		// create new fullscreen page, and set as default content
		this._content = Wu.DomUtil.create('div', 'data-library ct1', Wu.app._appPane);
		
		// Button controller
		this._controlContainer = Wu.DomUtil.create('div', 'datalibrary-controls', this._content);	
		this._controlInner = Wu.DomUtil.create('div', 'datalibrary-controls-inner', this._controlContainer);

		// Upload button
		this._uploadContainer = Wu.DomUtil.create('div', 'smap-button-gray', this._controlInner, 'Upload');
		this._uploadContainer.id = 'upload-container';

		// Search field
		this._search = Wu.DomUtil.create('input', 'search', this._controlInner);
		this._search.id = 'datalibrary-search';
		this._search.setAttribute('type', 'text');
		this._search.setAttribute('placeholder', 'Search files');

		// Delete button
		this._delete = Wu.DomUtil.create('div', 'smap-button-gray', this._controlInner, 'Delete');
		this._delete.id = 'datalibrary-delete-file';

		// Download button
		this._download = Wu.DomUtil.create('div', 'smap-button-gray', this._controlInner, 'Download');
		this._download.id = 'datalibrary-download-files';

		// error feedback
		this._errors = Wu.DomUtil.createId('div', 'datalibrary-errors', this._controlInner);

		// create container (overwrite default)
		this._container = Wu.DomUtil.create('div', 'editor-wrapper ct1', this._content);

		// create dialogue 
		this._downloadList = Wu.DomUtil.createId('div', 'datalibrary-download-dialogue', this._content);

		// create progress bar
		this.progress = Wu.DomUtil.create('div', 'progress-bar', this._content);
		
		// insert template
		this._container.innerHTML = ich.datalibraryContainer();

		// get element handlers
		this._tableContainer = Wu.DomUtil.get('datalibrary-table-container');
	      
		// create fullscreen dropzone
		this.fulldrop = Wu.DomUtil.create('div', 'fullscreen-drop', this._content);

		// filecount
		this.filecount = 0;

		// render empty table
		this._tableContainer.innerHTML = ich.datalibraryTableframe();

		// get elements
		this._table 		= Wu.DomUtil.get('datalibrary-insertrows');
		this._errors 		= Wu.DomUtil.get('datalibrary-errors');
		this._uploader 		= Wu.DomUtil.get('upload-container');
		this._deleter 		= Wu.DomUtil.get('datalibrary-delete-file');
		this._downloader 	= Wu.DomUtil.get('datalibrary-download-files');
		this._checkall 		= Wu.DomUtil.get('checkbox-all');
		this._checkallLabel 	= Wu.DomUtil.get('label-checkbox-all');

		// init table
		this.initList();

		// init dropzone
		this.initDZ();

		// init download table
		this.initDownloadTable();

		// add tooltip
		app.Tooltip.add(this._menu, 'The data library contains all files uploaded to the project.');

	},

	// hooks added automatically on page load
	addHooks : function () {
	       
		// download button
		Wu.DomEvent.on(this._download, 'mousedown', this.downloadFiles, this);

		// check all button
		Wu.DomEvent.on(this._checkallLabel, 'mousedown', this.checkAll, this);

		// search button
		Wu.DomEvent.on(this._search, 'keyup', this.searchList, this);
	       
	},


	addEditHooks : function () {

		// delete button
		Wu.DomEvent.on(this._deleter, 'mousedown', this.deleteConfirm, this);
		Wu.DomUtil.removeClass(this._deleter, 'displayNone');
	},

	removeEditHooks : function () {

		// delete button
		Wu.DomEvent.off(this._deleter, 'mousedown', this.deleteConfirm, this);
		Wu.DomUtil.addClass(this._deleter, 'displayNone');
	},


	searchList : function (e) {
		if (e.keyCode == 27) { // esc
			// reset search
			return this.resetSearch();
		}

		// get value and search
		var value = this._search.value;
		this.list.search(value);
	},

	resetSearch : function () {
		this.list.search(); // show all
		this._search.value = '';
	},


	_activate : function () {
		if (this.dz) this.dz.enable();
	
		// hide other controls
		this._hideControls();

	},

	_hideControls : function () {

		// layermenu
		var lm = app.MapPane.layerMenu;
		if (lm) lm.hide();

		// inspect
		var ic = app.MapPane.inspectControl;
		if (ic) ic.hide();

		// legends
		var lc = app.MapPane.legendsControl;
		if (lc) lc.hide();

		// description
		var dc = app.MapPane.descriptionControl;
		if (dc) dc.hide();
	},

	_showControls : function () {
		// layermenu
		var lm = app.MapPane.layerMenu;
		if (lm) lm.show();

		// inspect
		var ic = app.MapPane.inspectControl;
		if (ic) ic.show();

		// legends
		var lc = app.MapPane.legendsControl;
		if (lc) lc.show();

		// description
		var dc = app.MapPane.descriptionControl;
		if (dc) dc.show();
	},

	_deactivate : function () {
		if (this.dz) this.dz.disable();

		// show controls
		this._showControls();
	},

	initDownloadTable : function () {

		var table = ich.datalibraryTableDownload();
		this._downloadList.innerHTML = table;

		// get elems 
		this._downloadOK = Wu.DomUtil.get('download-ok-button');
		this._downloadCancel = Wu.DomUtil.get('download-cancel-button');
	
		// set hooks
		Wu.DomEvent.on(this._downloadOK, 'mousedown', this.downloadFiles, this);
		Wu.DomEvent.on(this._downloadCancel, 'mousedown', this.downloadCancel, this);

	},

	checkAll : function () {

		if (this._checkall.checked) {
			// uncheck all visible
			var visible = this.list.visibleItems;
			visible.forEach(function (item, i, arr) {
				var ch = item.elm.children[0].childNodes[1].children[0];
				// uncheck
				if (ch.checked) ch.checked = false;
			}, this);


		} else {
			// check all visible
			var visible = this.list.visibleItems;
			visible.forEach(function (item, i, arr) {
				var ch = item.elm.children[0].childNodes[1].children[0];
				// check
				if (!ch.checked) ch.checked = true; 
			}, this);
		}
	},

	downloadFiles : function () {

		// get selected
		this._downloadFileList = this.getSelected();

		// return if no files selected
		if (!this._downloadFileList.length) return;

		// create list of uuids only
		var fuuids = [];
		this._downloadFileList.forEach(function (file, i, arr) {
			fuuids.push(file.uuid);
		}, this);

		var json = {
			'files' : this._downloadFileList, // [fuuids],
			'puuid' : this.project.store.uuid,
			'pslug' : this.project.store.slug
		}
		var json = JSON.stringify(json);

		// post         path          json      callback           this
		Wu.post('/api/file/download', json, this.receivedDownload, this);

		// create download dialog
		this.createDownloadDialog();

	},

	receivedDownload : function (that, response) {
		// this = window

		// set path for zip file
		var path = '/api/file/download?file=' + response + '&type=zip';
		
		// create download dialog
		that.updateDownloadDialog(path);

	},

	createDownloadDialog : function () {

		// divs
		var wrapper = this._downloadDialog = Wu.DomUtil.create('div', 'download-dialog', this._content);
		var inner = Wu.DomUtil.create('div', 'download-dialog-inner', wrapper);
		var downloadBtn = this._downloadDialogBtn = Wu.DomUtil.create('div', 'download-dialog-button', inner, 'Processing...');
		var cancelBtn = Wu.DomUtil.create('div', 'download-dialog-cancel', inner, 'Cancel');

		// event
		Wu.DomEvent.on(cancelBtn, 'mousedown', this.removeDownloadDialog, this);
		Wu.DomEvent.on(downloadBtn, 'mousedown', this._removeDownloadDialog, this);

	},

	updateDownloadDialog : function (path) {
		this._downloadDialogBtn.innerHTML = '';
		var link = Wu.DomUtil.create('a', 'download-dialog-link', this._downloadDialogBtn, 'Download');
		link.setAttribute('href', path);
	},

	removeDownloadDialog : function () {
		Wu.DomUtil.remove(this._downloadDialog);
	},	

	_removeDownloadDialog : function () {
		this._downloadDialog.style.opacity = 0;
		setTimeout(this.removeDownloadDialog.bind(this), 3000);
	},	

	downloadCancel : function () {
		
		// clear download just in case
		this._downloadFileList = [];

		// hide
		if (this._downloadList) this._downloadList.style.display = 'none';
		if (this._container) this._container.style.display = 'block';

		// Show toolbar (upload, download, delete, search);
		Wu.DomUtil.removeClass(this._content, 'hide-top', this);		
	},

	downloadDone : function () {

		// close and re-init
		var that = this;
		setTimeout(function () {
			that.downloadCancel();
			that.initDownloadTable();
		}, 1000);
		
	},

	downloadConfirm : function (e) {

		// get selected files
		var checks = this.getSelected();
		this._downloadFileList = checks;
		
		// do nothing on 0 files
		if (checks.length == 0) { return; }

		// populate download window
		var tr = '';
		checks.forEach(function (file, i, arr) {
			var tmp = Wu.extend({}, file);
			tr += ich.datalibraryDownloadRow(tmp);
		}, this);

		// get table and insert
		var table = Wu.DomUtil.get('datalibrary-download-insertrows');
		table.innerHTML = tr;

		// show
		this._downloadList.style.display = 'block';
		this._container.style.display = 'none';

		// Hide toolbar (upload, download, delete, search);
		Wu.DomUtil.addClass(this._content, 'hide-top', this);
	
	},

	getSelected : function () {

		// get selected files
		var checks = [];
		this.project.store.files.forEach(function(file, i, arr) {
			var checkbox = Wu.DomUtil.get('checkbox-' + file.uuid);
			if (checkbox) { var checked = checkbox.checked; }
			if (checked) { checks.push(file); }
		}, this);

		return checks;
	},

	deleteConfirm : function (e) {

		// get selected files
		var checks = this.getSelected();
				
		// do nothing on 0 files
		if (checks.length == 0) return; 

		// confirm dialogue, todo: create stylish confirm
		if (confirm('Are you sure you want to delete these ' + checks.length + ' files?')) {    
			this.deleteFiles(checks);
		} 
	},

	deleteFiles : function (files) {

		// set status
		app.setStatus('Deleting');
		
		// remove files n layers from project
		this.project.removeFiles(files);

		// set status
		app.setStatus('Deleted!');

		// refresh sidepane
		this.project.refreshSidepane();

	},


	// list.js plugin
	initList : function () { 
		
		// add dummy entry
		var tr = Wu.DomUtil.createId('tr', 'dummy-table-entry');
		tr.innerHTML = ich.datalibraryTablerow({'type' : 'dummy-table-entry'});
		this._table.appendChild(tr);

		// init list.js
		var options = { valueNames : ['name', 'file', 'category', 'keywords', 'date', 'status', 'type'] };
		this.list = new List('filelist', options);

		// remove dummy
		this.list.clear();
	},

	// is only fired once ever
	initDZ : function () {
		if (!app.Dropzone) return;

		// create dropzone
		app.Dropzone.initDropzone({
			uploaded : this.uploaded.bind(this),
			clickable : this._uploader

		});


		// // create dz
		// this.dz = new Dropzone(this._uploader, {
		// 		url : '/api/upload',
		// 		createImageThumbnails : false,
		// 		autoDiscover : false,
		// 		uploadMultiple : true,
		// 		acceptedFiles : '.zip,.gz,.png,.jpg,.jpeg,.geojson,.docx,.pdf,.doc,.txt',
		// 		// acceptedFiles : '.zip,.gz,.png,.jpg,.jpeg,.geojson,.json,.topojson,.kml,.docx,.pdf,.doc,.txt',
		// 		maxFiles : 10,
		// 		parallelUploads : 10
		// 		// autoProcessQueue : true
		// });

		// // add fullscreen dropzone
		// this.enableFullscreenDZ();                                                                                                                                                                   
		
	},

	// enableFullscreenDZ : function () {

	// 	// add fullscreen bridge to dropzone
	// 	Wu.DomEvent.on(document, 'dragenter', this.dropping, this);
	// 	Wu.DomEvent.on(document, 'dragleave', this.undropping, this);
	// 	Wu.DomEvent.on(document, 'dragover', this.dragover, this);
	// 	Wu.DomEvent.on(document, 'drop', this.dropped, this);


	// },

	// disableFullscreenDZ : function () {

	// 	// remove fullscreen bridge to dropzone
	// 	Wu.DomEvent.off(document, 'dragenter', this.dropping, this);
	// 	Wu.DomEvent.off(document, 'dragleave', this.undropping, this);
	// 	Wu.DomEvent.off(document, 'dragover', this.dragover, this);
	// 	Wu.DomEvent.off(document, 'drop', this.dropped, this);

	// },

	refreshDZ : function () {

		// refresh dropzone
		var dropzone = app.Dropzone;
		dropzone.refresh();



		// // clean up last dz
		// this.dz.removeAllListeners();

		// // set project uuid for dropzone
		// this.dz.options.params.project = this.project.getUuid();	// goes to req.body.project

		// // set dz events
		// this.dz.on('drop', function (e) { 
		// });

		// this.dz.on('dragenter', function (e) { 
		// });

		// this.dz.on('addedfile', function (file) { 

		// 	console.log('addedfile: dataLibrary');

		// 	// show progressbar
		// 	that.progress.style.opacity = 1;

		// 	// show fullscreen file info
		// 	if (!that._fulldrop) {
		// 		that.fullOn(file);
		// 		that.fullUpOn(file);
		// 	}

		// 	// set status
		// 	app.setStatus('Uploading');
		// });


		// this.dz.on('complete', function (file) {
			
		// 	// clean up
		// 	that.dz.removeFile(file);

		// });

		// this.dz.on('uploadprogress', function (file, progress) {
		// 	// set progress
		// 	that.progress.style.width = progress + '%';
		// });                                                                                                                                                                                                               

		// this.dz.on('successmultiple', function (err, json) {
		// 	// parse and process
		// 	var obj = Wu.parse(json);

		// 	// set status
		// 	app.setStatus('Done!', 2000);

		// 	if (obj) { that.uploaded(obj); }

		// 	// clear fullpane
		// 	that.resetProgressbar();
		// });

		

	},

	// resetProgressbar : function () {
	// 	// reset progressbar
	// 	this.progress.style.opacity = 0;
	// 	this.progress.style.width = '0%';

	// 	// reset .fullscreen-drop
	// 	this.fulldropOff();
	// 	this.fullUpOff();
	// 	this._fulldrop = false;

	// },


	// _createFileMetaContent : function (file) {
	// 	if (!file) return; 			// todo: file undefined on drag'n drop

	// 	console.log('_createFileMetaContent file:', file);

	// 	var wrapper 	= Wu.DomUtil.create('div', 'drop-meta-wrapper');
	// 	var name 	= Wu.DomUtil.create('div', 'drop-meta-name', wrapper);
	// 	var size 	= Wu.DomUtil.create('div', 'drop-meta-size', wrapper);
	// 	var type 	= Wu.DomUtil.create('div', 'drop-meta-type', wrapper);
	// 	var ext 	= Wu.DomUtil.create('div', 'drop-meta-type', wrapper);

	// 	name.innerHTML = 'Name: ' + file.name;
	// 	size.innerHTML = 'Size: ' + Wu.Util.bytesToSize(file.size);
	// 	type.innerHTML = 'Type: ' + file.type.split('/')[0].camelize();
	// 	ext.innerHTML  = 'Filetype: ' + file.type.split('/')[1];

	// 	return wrapper;
	// },
	
	// // cxxxx
	// // fullscreen when started uploading                                            // TODO: refactor fullUpOn etc..
	// fullUpOn : function (file) {                                                    //       add support for multiple files
	// 	// transform .fullscreen-drop                                           //       bugtest more thourougly
	
	// 	// add file info
	// 	var meta = this._createFileMetaContent(file);
	// 	if (meta) this.fulldrop.appendChild(meta);	// append meta

	// 	// show
	// 	Wu.DomUtil.addClass(this.fulldrop, 'fullscreen-dropped');
	// },

	// fullUpOff : function () {

	// 	Wu.DomUtil.removeClass(this.fulldrop, 'fullscreen-dropped');
	// 	this.fulldrop.innerHTML = '';
	// },

	// // fullscreen for dropping on
	// fulldropOn : function (e) {

	// 	// turn on fullscreen-drop
	// 	this.fullOn();
		
	// 	// remember drop elem
	// 	this._fulldrop = e.target.className;

	// },
	// fulldropOff : function () {
	// 	// turn off .fullscreen-drop
	// 	this.fullOff();
	// },

	// // fullscreen for dropping on
	// fullOn : function () {

	// 	// turn on fullscreen-drop
	// 	this.fulldrop.style.opacity = 1;				// wow! full up down on dumb! RE.FACTOR!
	// 	this.fulldrop.style.zIndex = 1000;

	// 	// Hide the background container (j)
	// 	this._container.style.display = 'none';

	// 	// Hide toolbar (upload, download, delete, search); (j)
	// 	Wu.DomUtil.addClass(this._content, 'hide-top', this);

	// },

	// fullOff : function () {

	// 	var that = this;
	// 	this.fulldrop.style.opacity = 0;

	// 	// Hide the background container (j)
	// 	this._container.style.display = 'block';

	// 	// Hide toolbar (upload, download, delete, search); (j)
	// 	Wu.DomUtil.removeClass(this._content, 'hide-top', this);


	// 	setTimeout(function () {        // hack for transitions
	// 		 that.fulldrop.style.zIndex = -10;
	// 	}, 200);
	// },

	// dropping : function (e) {
	// 	e.preventDefault();
	    
	// 	// show .fullscreen-drop
	// 	this.fulldropOn(e);
	// },

	// undropping : function (e) {
	// 	e.preventDefault();
	// 	var t = e.target.className;

	// 	// if leaving elem that started drop
	// 	if (t == this._fulldrop) this.fulldropOff(e);
	// },

	// dropped : function (e) {
	// 	e.preventDefault();
		
	// 	// transform .fullscreen-drop
	// 	this.fullUpOn();

	// 	// fire dropzone
	// 	this.dz.drop(e);
	// },

	// dragover : function (e) {
	// 	// needed for drop fn
	// 	e.preventDefault();
	// },

	handleError : function (error) {

		// set error
		app.ErrorPane.setError('Upload error:', error.error, 3);

	},

	// process file
	uploaded : function (record, options) {
		
		var options = options || {};
		
		// handle errors
		if (record.errors) this.handleError(record.errors);
		
		// return if nothing
		if (!record.files) return;

		// add files to library
		record.files && record.files.forEach(function (file, i, arr) {
			
			// add to project locally (already added on server)
			this.project.setFile(file);

		}, this);


		// add layers
		record.layers && record.layers.forEach(function (layer, i) {
			this.project.addLayer(layer);
		}, this);
		
		// refresh sidepane
		this.project.refreshSidepane();

		// refresh cartoCssControl
		var cartoCss = app.MapPane.cartoCss;
		if (cartoCss) cartoCss.update();

		// refresh
		this.reset();
		this.refreshTable();

	},

	addFile : function (file) {

		// clone file object
		var tmp = Wu.extend({}, file.getStore());   

		// add record (a bit hacky, but with a cpl of divs inside the Name column)
		tmp.name = ich.datalibraryTablerowName({
			name 		: tmp.name || 'Title',
			description 	: tmp.description || 'Description',
			nameUuid 	: 'name-' + tmp.uuid,
			descUuid 	: 'description-' + tmp.uuid,
		});

		// clean some fields
		tmp.type = tmp.type.camelize();
		tmp.files = this._createFilePopup(tmp.files);
		tmp.keywords = tmp.keywords.join(', ');
		tmp.createdDate = new Date(tmp.created).toDateString();

		// add file to list.js
		var ret = this.list.add(tmp);
		
		// ugly hack: manually add uuids
		ret[0].elm.id = tmp.uuid;                              // <tr>
		var c = ret[0].elm.children[0].children[0].children;    
		c[0].id = 'checkbox-' + tmp.uuid;                      // checkbox
		c[1].setAttribute('for', 'checkbox-' + tmp.uuid);      // label

		// add hooks for editing file, if edit access
		if (this.project.editMode) this._addFileEditHooks(tmp.uuid);
	
	},


	_createFilePopup : function (files) {
		var length = files.length;
		var html = '<div class="dataLibrary-file-popup-wrap">';
		html += '<div class="dataLibrary-file-popup-trigger">' + length + '</div>';
		html += '<div class="dataLibrary-file-popup-list">Files:<br>';
		files.forEach(function (f) {
			html += '<div class="dataLibrary-file-popup-item">'
			html += '• ' + f;
			html += '</div>';
		}, this);
		html += '</div></div>';
		return html; // as html, not nodes
	},

	_addFileEditHooks : function (uuid) {

		// get <input>'s
		var title = Wu.DomUtil.get('name-' + uuid);
		var desc = Wu.DomUtil.get('description-' + uuid);

		// get main
		var tr = Wu.DomUtil.get(uuid);
		var cat  = tr.children[4];
		var keyw = tr.children[5];

		// set click hooks on title and description
		Wu.DomEvent.on( title,  'mousedown mouseup click', 	this.stop, 		this ); 
		Wu.DomEvent.on( title,  'dblclick', 			this.rename, 		this );     // select folder
		Wu.DomEvent.on( desc,   'mousedown mouseup click', 	this.stop, 		this ); 	
		Wu.DomEvent.on( desc,   'dblclick', 			this.rename, 		this );     // select folder
		Wu.DomEvent.on( cat,    'mousedown mouseup click', 	this.stop, 		this ); 	
		Wu.DomEvent.on( cat,    'dblclick', 			this.injectCategory, 	this );     // select folder
		Wu.DomEvent.on( keyw,   'mousedown mouseup click', 	this.stop, 		this ); 	
		Wu.DomEvent.on( keyw,   'dblclick', 			this.injectKeywords, 	this );     // select folder

	},


	// to prevent selected text
	stop : function (e) {
		e.preventDefault();
		e.stopPropagation();

		// hacky to close categories on any click
		this.closeCategories();
	},


	injectCategory : function (e) {

		// close others
		this.closeCategories();

		// hacky: reset search so no errors 		// TODO!
		this.resetSearch();

		// get file uuid
		var fileUuid = this._injectedUuid = e.target.parentNode.id;

		// get file object
		var file = this.project.getFile(fileUuid);

		// create wrapper
		var wrapper = this._injected = Wu.DomUtil.create('div', 'datalibrary-category-wrapper');

		// add line per category
		var categories = this.project.getCategories();

		// for each category
		categories.forEach(function (c) {

			// create category line
			this.createCategoryLine(wrapper, c, file);

		}, this);

		// add new category line
		var newlinewrap = Wu.DomUtil.create('div', 'datalibrary-category-new-wrap', wrapper);
		var newline = this._injectedNewline = Wu.DomUtil.create('input', 'datalibrary-category-new', newlinewrap);
		newline.setAttribute('placeholder', 'Add category...');

		// set event on new category
		Wu.DomEvent.on(newline, 'keydown', this.categoryKeydown, this);
		Wu.DomEvent.on(newline, 'mousedown', Wu.DomEvent.stopPropagation, this);

		// set position 
		wrapper.style.position = 'absolute';
		wrapper.style.left = e.x - 50 + 'px';
		wrapper.style.top = e.y + 'px';

		// add to body
		document.body.appendChild(wrapper);

		// add outside click event
		Wu.DomEvent.on(window, 'mousedown', this._closeCategories, this);

	},

	createCategoryLine : function (wrapper, c, file) {

		// create line item
		var wrap = Wu.DomUtil.create('div', 'datalibrary-category-line-wrap', wrapper);
		var div  = Wu.DomUtil.create('div', 'datalibrary-category-line', wrap, c.camelize());
		var del  = Wu.DomUtil.create('div', 'datalibrary-category-line-del', wrap, 'X');

		// select category
		Wu.DomEvent.on(div, 'mousedown', function (e) {
			
			// stop
			Wu.DomEvent.stopPropagation(e);

			// set vars
			var value = c;
			var key = 'category';

			// save to model
			file.setCategory(value);

			// close
			this.closeCategories();
		
			// refresh 		// todo: a reset/refresh of table will annul sort
			this.reset();
			this.refreshTable();

		}, this);

		// delete category
		Wu.DomEvent.on(del, 'mousedown', function (e) {

			// stop
			Wu.DomEvent.stopPropagation(e);

			// remove category
			var msg = 'Are you sure you want to delete category ' + c.camelize() + '? This will remove the category from all files.';
			if (confirm(msg)) {

				// remove category
				this.removeCategory(c);
			} 


		}, this);

	},

	removeCategory : function (category) {

		// remove from project
		this.project.removeCategory(category);
	
		// remove from all files
		var files = this.project.getFileObjects();
		for (f in files) {
			var file = files[f];
			if (file.getCategory().toLowerCase() == category.toLowerCase()) {
				file.setCategory(''); // set blank
			}
		}

		// close
		this.closeCategories();
	
		// refresh 		// todo: a reset/refresh of table will annul sort
		this.reset();
		this.refreshTable();
	},

	closeCategories : function () {
		if (this._injected) Wu.DomUtil.remove(this._injected);

		Wu.DomEvent.off(window, 'mousedown', this._closeCategories, this);
	},

	_closeCategories : function () {
		this.closeCategories();
	},

	injectCategoryBlur : function () {

		// update file in project
		this.project.store.files.forEach(function(file, i, arr) {
			// iterate and find hit
			// if (file.uuid == fuuid) file[key] = value;
		}, this);

	},

	categoryKeydown : function (e) {
		console.log('categoryKeydown!', e.keyCode);

		// on enter
		if (e.keyCode == 13) {

			// get value
			var value = this._injectedNewline.value;

			// create new category
			this.project.addCategory(value);

			// get file
			var fileUuid = this._injectedUuid;
			var file = this.project.getFile(fileUuid);

			// set category
			file.setCategory(value);

			// close
			this.closeCategories();
		
			// refresh 		// todo: a reset/refresh of table will annul sort
			this.reset();
			this.refreshTable();


		}

		// on esc
		if (e.keyCode == 27) {
			console.log('esc!');
			
			// close, do nothing
			this.closeCategories();
		}
	},

	injectKeywords : function (e) {

		var fuuid = e.target.parentNode.id;
		this._injectedUuid = fuuid;

		// inject <input>
		var input = Wu.DomUtil.create('input', 'datalibrary-edit-field');
		input.value = e.target.innerHTML;
		input.setAttribute('placeholder', 'Enter value');
		input.removeAttribute('readonly');
		e.target.innerHTML = '';
		e.target.appendChild(input);
		input.focus();

		// save on blur or enter
		Wu.DomEvent.on(input,  'blur', this.injectKeywordsBlur, this);   // save folder title
		Wu.DomEvent.on(input,  'keydown', this.editKey, this);    	 // fire blur on key press

	},

	injectKeywordsBlur : function (e) {

		// get value
		var value = e.target.value;

		// set text 
		var parent = e.target.parentNode;
		parent.innerHTML = value;

		// split into array and trim
		var split = value.split(',');
		split.forEach(function (s, i, arr) {
			arr[i] = s.trim();
		}, this);

		// update file in project
		var file = this.project.getFile(this._injectedUuid);
		file.setKeywords(split);

	},


	rename : function (e) {

		// enable editing on input box
		e.target.removeAttribute('readonly'); 
		e.target.focus();
		e.target.selectionStart = e.target.selectionEnd;

		// set key
		e.target.fieldKey = e.target.id.split('-')[0];

		// save on blur or enter
		Wu.DomEvent.on( e.target,  'blur', this.editBlur, this );     // save folder title
		Wu.DomEvent.on( e.target,  'keydown', this.editKey, this );     // save folder title

	},


	editKey : function (e) {
		// blur on enter
		if (event.which == 13 || event.keyCode == 13) e.target.blur();
	},

	editBlur : function (e) {

		// get key
		var key = e.target.fieldKey;

		// set back to readonly
		e.target.setAttribute('readonly', 'readonly');                                                                                                                                                                                         
		
		// get file uuid
		var fuuid = e.target.id.replace(key + '-', '');

		// get new title
		var value = e.target.value || e.target.innerHTML;

		// update file in project
		this.project.store.files.forEach(function(file, i, arr) {
			// iterate and find hit
			if (file.uuid == fuuid) file[key] = value;
		}, this);

		// refresh list
		this.list.update();     // todo: funky behavior when changing name, doesn't reflect (ie. sort works on old value)

		// save to server
		this._save(fuuid, key);

		// save new name to Layer also
		if (key == 'name') this.updateLayerName(fuuid, value);

	},

	updateLayerName : function (fileUuid, value) {
		// find and update layer
		var layer = this.project.getLayerFromFile(fileUuid);
		if (layer) layer.setTitle(value);
	},

	_save : function (fuuid, key) {

		// save the file
		this.project.store.files.forEach(function(file, i, arr) {
		     
			// iterate and find hit
			if (file.uuid == fuuid) {

				// create update object
				var json = {};
				json[key] = file[key];
				json.uuid = file.uuid;

				// update, no callback
				var string = JSON.stringify(json);
				Wu.save('/api/file/update', string); 
			}
		});

		app.setSaveStatus();
	},

	updateContent : function () {
		this.update();
	},

	update : function () {

		// use active project
		this.project = Wu.app.activeProject;

		// flush
		this.reset();

		// refresh dropzone
		this.refreshDZ();

		// refresh table entries
		this.refreshTable();

		if (this.project.editMode) {
			this.addEditHooks();
		} else {
			this.removeEditHooks();
		}

		// refresh cartoCssControl
		var cartoCss = app.MapPane.cartoCss;
		if (cartoCss) cartoCss.update();

	},

	refreshTable : function () {

		// return if empty filelist
		if (!this.project.files) { return; }

		// enter files into table
		for (f in this.project.files) {
			var file = this.project.files[f];
			this.addFile(file);
		};

		// sort list by name by default
		this.list.sort('name', {order : 'asc'});
	},

	reset : function () {

		// clear table
		this.list.clear();

		// remove uploading, in case bug
		// this.fullOff();
		// this.fulldropOff();

	}

});
;Wu.SidePane.MediaLibrary = Wu.SidePane.Item.extend({

	type : 'mediaLibrary',
	title : 'Media',

	initContent : function () {

		// create new fullscreen page, and set as default content
		this._content = Wu.DomUtil.create('div', 'fullpage-mediaLibrary', Wu.app._appPane);
		
		// create container (overwrite default) and insert template			// innerHTML
		this._container = Wu.DomUtil.create('div', 'editor-wrapper', this._content, ich.mediaLibrary({ media : 'this is media!' }));

		// get panes
		this._innerContent = Wu.DomUtil.get('mediaLibrary-inner-content');

		this._leftImage = {}
		this._leftImage.innerSlider 	= Wu.DomUtil.get("mediaLibrary-inner-slider-left");
		this._leftImage.grabGrid 	= Wu.DomUtil.get("mediaLibrary-grabgrid-left");
		this._leftImage.Image 		= Wu.DomUtil.get("mediaLibrary-image-container-left");
		this._leftImage.Image.img 	= this._leftImage.Image.getElementsByTagName("img")[0];
		this._leftImage.nativeResolution = Wu.DomUtil.get("mediaLibrary-data-resolution-l");
		this._leftImage.filename 	= Wu.DomUtil.get("mediaLibrary-data-filename-l");
		this._leftImage.fileCaptured 	= Wu.DomUtil.get("mediaLibrary-data-captured-l");
		this._leftImage.fileUploaded 	= Wu.DomUtil.get("mediaLibrary-data-uploaded-l");
		this._leftImage.fileUploadedBy 	= Wu.DomUtil.get("mediaLibrary-data-uploaded-by-l");
		this._leftImage.percent 	= Wu.DomUtil.get("mediaLibrary-percent-left-side");
		this._leftImage.zoomIn 		= Wu.DomUtil.get("mediaLibrary-zoom-in-left");
		this._leftImage.zoomOut 	= Wu.DomUtil.get("mediaLibrary-zoom-out-left");

		this._rightImage = {}
		this._rightImage.innerSlider 	= Wu.DomUtil.get("mediaLibrary-inner-slider-right");
		this._rightImage.grabGrid 	= Wu.DomUtil.get("mediaLibrary-grabgrid-right");
		this._rightImage.Image 		= Wu.DomUtil.get("mediaLibrary-image-container-right");
		this._rightImage.Image.img 	= this._rightImage.Image.getElementsByTagName("img")[0];
		this._rightImage.nativeResolution = Wu.DomUtil.get("mediaLibrary-data-resolution-r");
		this._rightImage.filename 	= Wu.DomUtil.get("mediaLibrary-data-filename-r");
		this._rightImage.fileCaptured 	= Wu.DomUtil.get("mediaLibrary-data-captured-r");
		this._rightImage.fileUploaded 	= Wu.DomUtil.get("mediaLibrary-data-uploaded-r");
		this._rightImage.fileUploadedBy = Wu.DomUtil.get("mediaLibrary-data-uploaded-by-r");
		this._rightImage.percent 	= Wu.DomUtil.get("mediaLibrary-percent-right-side");
		this._rightImage.zoomIn 	= Wu.DomUtil.get("mediaLibrary-zoom-in-right");
		this._rightImage.zoomOut 	= Wu.DomUtil.get("mediaLibrary-zoom-out-right");


	},


	_addHooks : function () {

		console.log('addHooks');
		// Wu.DomEvent.on(this._button, 'mousedown', this.dosomething, this);

		// Zooming in on Left Image
		Wu.DomEvent.on(this._leftImage.zoomIn, 'mousedown', function() { this.zoomImg('left', 'in') }, this);
		Wu.DomEvent.on(this._leftImage.zoomIn, 'mouseup',   function() { this.zoomImg_stop('left') }, this);

		// Zooming out on Left Image
		Wu.DomEvent.on(this._leftImage.zoomOut, 'mousedown', function() { this.zoomImg('left', 'out') }, this);
		Wu.DomEvent.on(this._leftImage.zoomOut, 'mouseup',   function() { this.zoomImg_stop('left') }, this);
		
		// Zooming in on Right Image
		Wu.DomEvent.on(this._rightImage.zoomIn, 'mousedown', function() { this.zoomImg('right', 'in') }, this);
		Wu.DomEvent.on(this._rightImage.zoomIn, 'mouseup',   function() { this.zoomImg_stop('right') }, this);

		// Zooming out on Right Image
		Wu.DomEvent.on(this._rightImage.zoomOut, 'mousedown', function() { this.zoomImg('right', 'out') }, this);
		Wu.DomEvent.on(this._rightImage.zoomOut, 'mouseup',   function() { this.zoomImg_stop('right') }, this);


	},

	zoomImg : function (side, direction) {
		

		var zoomThis;

		// LEFT
		if ( side == "left" ) {
			var zoomThis = this._leftImage;
			var currentActiveNativeWidth = this.images[this._currentActiveLeft].file.data.image.dimensions.width;
		} 
		

		// RIGHT
		if ( side == "right" ) {
			var zoomThis = this._rightImage;
			var currentActiveNativeWidth = this.images[this._currentActiveRight].file.data.image.dimensions.width;			
		} 


			// get image container
			var container = zoomThis.Image.img;

			var imgContainer = zoomThis.Image.img;
			
			var _imgWidth = imgContainer.offsetWidth;
			var _imgHeight = imgContainer.offsetHeight;
			var _imgLeft = imgContainer.offsetLeft;
			var _imgTop = imgContainer.offsetTop;

			var hw_prop = _imgHeight / _imgWidth;			

			var _imgWrapperWidth = zoomThis.Image.offsetWidth;
			var _imgWrapperHeight = zoomThis.Image.offsetHeight;		


			var that = this;

			// ZOOOOOMING 
			this.imgZooming = setInterval(function() {
				
				// How fast we want to Zoom
				// 1% of image width
				if ( direction == "in" ) {
					zoomIndex = _imgWidth/100;
				} else {
					zoomIndex = - _imgWidth/100;					
				}

				// New Image width
				_imgWidth+=zoomIndex;

				// New Image height
				var zoomIndexHeight = zoomIndex * hw_prop;
				_imgHeight+=zoomIndexHeight;
				
				// Figure out percent position of image center relevant to container center
				KOPercentLeft = (-_imgLeft + (_imgWrapperWidth / 2) ) / _imgWidth;
				KOPercentTop = (-_imgTop + (_imgWrapperHeight / 2) ) / _imgHeight;

				// New Left Position
				leftZoomIndex = zoomIndex * KOPercentLeft;
				_imgLeft-=leftZoomIndex;

				// New Top Position
				topZoomIndex = (zoomIndex * hw_prop) * KOPercentTop;
				_imgTop-=topZoomIndex;

				// Update Percentage Number
				var currentPercent = Math.round((_imgWidth / currentActiveNativeWidth) * 100);
				zoomThis.percent.innerHTML = currentPercent;
				
				imgContainer.style.width  = _imgWidth           + 'px';
				imgContainer.style.height = _imgHeight 		+ 'px';
				imgContainer.style.left   = _imgLeft            + 'px';
				imgContainer.style.top    = _imgTop             + 'px';

			}, 10);
		
		
	},

	zoomImg_stop : function (side) {

		clearInterval(this.imgZooming);

		if ( side == "left" ) {
			this.__leftImageUpdate();
		}

		if ( side == "right" ) {
		}
		
	},




	__leftImageUpdate : function () {

			var crunchPath = app.options.servers.portal + 'pixels/';		

			var thisImage = this.images[this._currentActiveLeft];

			var nativeWidth = thisImage.file.data.image.dimensions.width;
			var nativeHeight = thisImage.file.data.image.dimensions.height;

			var imageWidth = this._leftImage.Image.img.offsetWidth;
			var imageHeight = this._leftImage.Image.img.offsetHeight;

			var wrapperWidth = this._leftImage.Image.offsetWidth;
			var wrapperHeight = this._leftImage.Image.offsetHeight;

			var _xCrop = this._leftImage.Image.img.offsetLeft;
			var _yCrop = this._leftImage.Image.img.offsetTop;

			// Make sure to never crop if the offsetTop and offsetLeft is positive
			if ( _xCrop > 0 ) _xCrop = 0;
			if ( _yCrop > 0 ) _yCrop = 0;


			console.log("************************");
			console.log("New image", thisImage.file.uuid)
			console.log("New image width:", imageWidth);
			console.log("New image height:", imageHeight);
			console.log("------------------------");
			console.log("New image X-crop:", Math.abs(_xCrop));
			console.log("New image Y-crop:", Math.abs(_yCrop));
			console.log("------------------------");
			console.log("New image crop width:", wrapperWidth)
			console.log("New image crop height:", wrapperHeight)
			console.log("************************");
			
			var _requestCrunch = crunchPath;
				_requestCrunch += thisImage.file.uuid;
				_requestCrunch += '?width=' + imageWidth;
				_requestCrunch += '&height=' + imageHeight;
				_requestCrunch += '&cropw=' + wrapperWidth;
				_requestCrunch += '&croph=' + wrapperHeight;
				_requestCrunch += '&cropx=' + Math.abs(_xCrop);
				_requestCrunch += '&cropy=' + Math.abs(_yCrop);

			
			// Load image before pasting it (high res version)
			var myTempImage = new Image();
			var that = this;

			myTempImage.onload=function() {
				that._rightImage.Image.img.style.top = '0px';
				that._rightImage.Image.img.style.left = '0px';
				that._rightImage.Image.img.src = myTempImage.src;
			};
			myTempImage.src = _requestCrunch;


	},

	removeHooks : function () {

	},

	addEditHooks : function () {
				       
	},

	removeEditHooks : function () {
		
	},

	// fired when different sidepane selected, for clean-up
	deactivate : function () {
		console.log('clear!');
	},



	updateContent : function () {
		this.update();
	},

	update : function () {
		// set project
		this.project = app.activeProject;
		
		console.log('MEDIALIBRARY: ', this.project);

		// flush
		this.reset();

		// build shit
		this.refresh();

		// add edit hooks
		this.addEditHooks();
	
	},

	thumbClick : function (uuid, side) {

		console.log('thumbClick');
		console.log('side', side);

		var store = this.images[uuid];

		if ( side == 'left' ) {
			var imgFrame = this._leftImage;
			this._currentActiveLeft = uuid;
		}

		if ( side == 'right' ) {
			var imgFrame = this._rightImage;
			this._currentActiveRight = uuid;
		}

		imgFrame.Image.img.removeAttribute("style");

		var crunchPath = app.options.servers.portal + 'pixels/';		


		// Request Image
		var largeImgRequest = crunchPath + uuid + '?width=1200&height=800';
		
		// Get dimensions of raw file
		var _rawWidth = store.file.data.image.dimensions.width;
		var _rawHeight = store.file.data.image.dimensions.height;

		// Set the Image Data fields
		imgFrame.nativeResolution.innerHTML = _rawWidth + ' x ' + _rawHeight + ' pixels';
		imgFrame.filename.innerHTML = store.file.name;

		imgFrame.fileCaptured.innerHTML = new Date(store.file.data.image.created).toDateString();

		// 'unknown'; //files[t].captured;
		var dateString = new Date(store.file.created).toDateString();
		imgFrame.fileUploaded.innerHTML = dateString;
		imgFrame.fileUploadedBy.innerHTML = store.file.createdByName;

		// Figure out the percent
		var containerWidth = imgFrame.Image.offsetWidth;
		var showingPercent = Math.round((containerWidth / _rawWidth) * 100);
		imgFrame.percent.innerHTML = showingPercent;

		// Figure out the orientation
		var rawProp = _rawWidth / _rawHeight;

		if ( rawProp >= 1 ) { 
			Wu.DomUtil.addClass(imgFrame.Image, "landscape", this);
			Wu.DomUtil.removeClass(imgFrame.Image, "portrait", this);
		} else { 
			Wu.DomUtil.removeClass(imgFrame.Image, "landscape", this);
			Wu.DomUtil.addClass(imgFrame.Image, "portrait", this);
		}


		var newWidth = 900;
		var _prop = newWidth / _rawWidth;
		var newHeight = _rawHeight * _prop;

		var _imgWrapperWidth = imgFrame.Image.offsetWidth;		
		var _imgWrapperHeight = imgFrame.Image.offsetHeight;

		var _bProp = _imgWrapperWidth / newWidth;
		var newVisualHeight = newHeight * _bProp;

		var _newOffsetTop = ((_imgWrapperHeight / 2) - (newVisualHeight / 2));

		// Center Image vertically
		imgFrame.Image.img.style.top = Math.round(_newOffsetTop) + 'px';

		// Insert image
		imgFrame.Image.img.src = crunchPath + uuid + '?width=' + newWidth + '&height=' + newHeight;



	},


	refresh : function () {

		console.log('refresh');
		// build divs and content for project (this.project)

		// get array of files
		var files = this.project.getFiles();
		console.log('files: ', files);


		var crunchPath = 'http://85.10.202.87:8080/pixels/';

		var jpegs = _.filter(files, function (f) {
			return f.format.indexOf('jpg') > -1;
		});

		this.images = {};

		jpegs.forEach(function(jpg) {

			// Left Image Slider
			var store = this.images[jpg.uuid] = {};
			// store.data = this.images[jpg.uuid] = {};
			// store.data = jpg;
			store.file = jpg;
			// store.file.data.image.dimensions; // 
			
			store.left = {};
			store.left.div = Wu.DomUtil.create('div', 'mediaLibrary-slider-thumb', this._leftImage.innerSlider);
			store.left.img = Wu.DomUtil.create('img', '', store.left.div);
			store.left.img.src = crunchPath + jpg.uuid + '?width=145&height=500';


			store.right = {};
			store.right.div = Wu.DomUtil.create('div', 'mediaLibrary-slider-thumb', this._rightImage.innerSlider);
			store.right.img = Wu.DomUtil.create('img', '', store.right.div);
			store.right.img.src = crunchPath + jpg.uuid + '?width=145&height=500';

			// Click on thumb on LEFT side
			Wu.DomEvent.on(store.left.div, 'click', function () {
				console.log("clicking on a left thumb");
				this.thumbClick(jpg.uuid, 'left');
			}, this);

			// Click on thumb on Right side
			Wu.DomEvent.on(store.right.div, 'click', function () {
				console.log("clicking on a left thumb");
				this.thumbClick(jpg.uuid, 'right');
			}, this);

		}, this);


		this._imgDraggable();

		// add hooks
		this._addHooks();

	},

	// DRAGGABLE
	// DRAGGABLE
	// DRAGGABLE

	_imgDraggable : function () {

		var _dragGrid = this._leftImage.grabGrid;

		Wu.DomEvent.on(_dragGrid, 'mousedown', function() { this._initDragging() }, this);
		Wu.DomEvent.on(_dragGrid, 'mousemove', function(e) { this._draggingImage(e) }, this);
		// Wu.DomEvent.on(document, 'mouseup', function() { this._stopDragging() }, this);		// ko var her! 
														// ga feil. kanskje finne noe
														// lavere enn document

		this.__x_pos = 0; // Stores x & y coordinates of the mouse pointer
		this.__y_pos = 0;
		this.__x_elem = 0; // Stores top, left values (edge) of the element
		this.__y_elem = 0;

	},

	
	// Will be called when user starts dragging an element
	_initDragging : function () {

		// Store the object of the element which needs to be moved
		this.__x_elem = this.__x_pos - this._leftImage.Image.img.offsetLeft;
		this.__y_elem = this.__y_pos - this._leftImage.Image.img.offsetTop;

		this._draggingLeftImage = true;

		return false;
	
	},

	_draggingImage : function (e) {

		    this.__x_pos = document.all ? window.event.clientX : e.pageX;
		    this.__y_pos = document.all ? window.event.clientY : e.pageY;

		    if ( this._draggingLeftImage ) {

				var __new_X = this.__x_pos - this.__x_elem;
				var __new_Y = this.__y_pos - this.__y_elem;

				// Moving X
				var movingX = 	this._leftImage.Image.img.offsetLeft - __new_X;
				var hrX = 		this._rightImage.Image.img.offsetLeft;
				console.log("movingX", movingX);

				// Moving Y
				var movingY = 	this._leftImage.Image.img.offsetTop - __new_Y;
				var hrY = 		this._rightImage.Image.img.offsetTop;
				console.log("movingY", movingY);


				this._leftImage.Image.img.style.left = __new_X + 'px';
				this._leftImage.Image.img.style.top = __new_Y + 'px';


				this._rightImage.Image.img.style.left = hrX - movingX + 'px';
				this._rightImage.Image.img.style.top = hrY - movingY + 'px';
			}
	},	

	_stopDragging : function () {
		this._draggingLeftImage = false;
		this.__leftImageUpdate();
	},

	reset : function () {
		// remove all inside div
		// this._innerContent.innerHTML = '';

		// this.innerSliderLeft.innerHTML = '';
		// this.innerSliderRight.innerHTML = '';
	
		this.removeHooks();
	},

});


;Wu.SidePane.Share = Wu.SidePane.Item.extend({
	
	type : 'share',
	title : 'Share',


	initContent : function () {

		// create layout
		this.initLayout();
	},


	update : function () {

		// clear
		this.reset();

		// set project
		this.project = app.activeProject;

		// create screenshot divs
		if (this.options.panes.share && this.project.getSettings().share) this.initLayout();

		// create layout
		this.initLayout();

		// add hooks
		this.addHooks();

	},

	addHooks : function () {

		// clear hooks
		this.removeHooks();

		// add hooks
		Wu.DomEvent.on(this.imageButton, 'click', this.createImage, this);
		Wu.DomEvent.on(this.printButton, 'click', this.createPrint, this);
		Wu.DomEvent.on(this.linkButton, 'click', this.createLink, this);
	},

	removeHooks : function () {
		// remove hooks
		Wu.DomEvent.off(this.imageButton, 'click', this.createImage, this);
		Wu.DomEvent.off(this.printButton, 'click', this.createPrint, this);
		Wu.DomEvent.off(this.linkButton, 'click', this.createLink, this);
	},

	initLayout : function () {

		// wrapper
		var wrap 	 = Wu.DomUtil.create('div', 'share-wrapper', this._content),
		    sstitle 	 = Wu.DomUtil.create('div', 'share-header', wrap, 'Publish');

		// image
		this.imageButton = Wu.DomUtil.create('div', 'share-wrap image', wrap);
		var ssbox	 = Wu.DomUtil.create('div', 'share-icon-box image', this.imageButton),
		    ssbutton 	 = Wu.DomUtil.create('div', 'share-title image', this.imageButton, 'Image'),
		    ssdesc 	 = Wu.DomUtil.create('div', 'share-subtitle image', this.imageButton, 'Create snapshot of map');

		// print
		this.printButton = Wu.DomUtil.create('div', 'share-wrap print', wrap);
		var pbox	 = Wu.DomUtil.create('div', 'share-icon-box print', this.printButton),
		    pbutton 	 = Wu.DomUtil.create('div', 'share-title print', this.printButton, 'PDF'),
		    pdesc 	 = Wu.DomUtil.create('div', 'share-subtitle print', this.printButton, 'Create printable map');

		// link
		this.linkButton  = Wu.DomUtil.create('div', 'share-wrap link', wrap);
		var lbox	 = Wu.DomUtil.create('div', 'share-icon-box link', this.linkButton),
		    lbutton 	 = Wu.DomUtil.create('div', 'share-title link', this.linkButton, 'Link'),
		    ldesc 	 = Wu.DomUtil.create('div', 'share-subtitle link', this.linkButton, 'Create share link');

		
		// add tooltip
		app.Tooltip.add(this._menu, 'Create image, PDF or link to project. The link will hold your current view (zoom, coordinates and active layers).');


	},

	createImage : function () {

		var that = this;	// callback

		app.setHash(function (ctx, hash) {

			// create image container
			that._createImageView();

			// get snapshot from server
			Wu.post('/api/util/snapshot', hash, that.createdImage, that);

		});

		// set progress bar for a 5sec run
		app.ProgressBar.timedProgress(2000);
		
	},

	createdImage : function (context, file) {

		// parse results
		var result = JSON.parse(file);
		var image = result.image;

		// get dimensions of container
		var height = context._imageContainer.offsetHeight;
		var width = context._imageContainer.offsetWidth;

		// set path
		var path = app.options.servers.portal;
		path += 'pixels/';
		path += image;
		var raw = path;
		path += '?width=' + width;
		path += '&height=' + height;

		// set url
		var url = 'url("';
		url += path;
		url += '")';

		// set image
		context._imageContainer.style.backgroundImage = url;

		
		// set download link
		raw += '?raw=true'; // add raw to path
		context._downloadButton.href = raw;
	},

	_createImageView : function () {

		console.log('_createImageView');

		// reset 
		this._resetExpands();

		// expand container
		Wu.DomUtil.addClass(this._content, 'expand-share-image');

		// create image container 
		this._imageWrap = Wu.DomUtil.create('div', 'share-image-wrap', this._content);

		// create title
		var title = Wu.DomUtil.create('div', 'share-image-title', this._imageWrap, 'Created image:');

		// create image container
		this._imageContainer = Wu.DomUtil.create('div', 'share-image-image', this._imageWrap);

		// create meta information
		var meta = Wu.DomUtil.create('div', 'share-image-meta-wrap', this._imageWrap);
		var size = Wu.DomUtil.create('div', 'share-image-meta-size', meta);
		var name = Wu.DomUtil.create('div', 'share-image-meta-name', meta);

		// create download button
		var downloadWrapper = Wu.DomUtil.create('div', 'share-image-download', this._imageWrap);
		this._downloadButton = Wu.DomUtil.create('a', 'share-image-download-button', downloadWrapper, 'Download');
		this._downloadButton.setAttribute('target', '_blank');

	},

	createLink : function () {

		// create hash, callback
		app.setHash(function (context, hash) {

			// open input box
			this._createLinkView(hash);

		}.bind(this));
		
	},

	_createLinkView : function (result) {

		var parsed 	= JSON.parse(result);
		var hash 	= parsed.hash;
		var project 	= app.Projects[hash.project];
		var slugs 	= project.getSlugs();
		var url 	= app.options.servers.portal + slugs.client + '/' + slugs.project + '/' + hash.id;

		// remove previous expands
		this._resetExpands();

		// create wrapper
		this._inputWrap = Wu.DomUtil.create('div', 'share-link-wrap', this._content);

		// create title
		var title = Wu.DomUtil.create('div', 'share-link-title', this._inputWrap, 'Share this link:')

		// create input box
		var input = Wu.DomUtil.create('input', 'share-link-input', this._inputWrap);
		input.value = url;

		// select all on focus
		Wu.DomEvent.on(input, 'click', function () {
			input.setSelectionRange(0, input.value.length);
		}, this);

		// expand container
		Wu.DomUtil.addClass(this._content, 'expand-share-link');

	},

	createPrint : function () {

		var that = this;	// callback
		app.setHash(function (ctx, hash) {

			// get snapshot from server
			Wu.post('/api/util/pdfsnapshot', hash, that.createdPrint, that);
			console.log('setn req');

		});

		// set progress bar for a 5sec run
		app.ProgressBar.timedProgress(2000);
	},

	createdPrint : function (context, file) {
		console.log('cb');
		// parse results
		var result = JSON.parse(file);
		var pdf = result.pdf;

		// set path for zip file
		var path = '/api/file/download?file=' + pdf + '&type=file';
		
		// create print view
		context._createPrintView(path);
	},

	_createPrintView : function (path) {

		// remove previous expands
		this._resetExpands();

		// create wrapper
		this._inputWrap = Wu.DomUtil.create('div', 'share-link-wrap', this._content);

		// create title
		var title = Wu.DomUtil.create('div', 'share-link-title', this._inputWrap, 'Download the PDF:')

		// create download button
		var downloadWrapper = Wu.DomUtil.create('div', 'share-print-download', this._inputWrap);
		this._pdfDownloadButton = Wu.DomUtil.create('a', 'share-print-download-button', downloadWrapper, 'Download');
		this._pdfDownloadButton.setAttribute('href', path);

		// expand container
		Wu.DomUtil.addClass(this._content, 'expand-share-link');

	},

	_resetExpands : function () {

		if (this._inputWrap) Wu.DomUtil.remove(this._inputWrap);
		if (this._imageWrap) Wu.DomUtil.remove(this._imageWrap);
		if (this._printWrap) Wu.DomUtil.remove(this._printWrap);

		Wu.DomUtil.removeClass(this._content, 'expand-share-link');
		Wu.DomUtil.removeClass(this._content, 'expand-share-image');
		Wu.DomUtil.removeClass(this._content, 'expand-share-print');
	},

	reset : function () {

		// remove hooks
		this.removeHooks();

		// clear content
		this._content.innerHTML = '';

		// reset expands
		this._resetExpands();

	},

	_activate : function () {
		// widen container from 350px to 100%
		app.SidePane.widenContainer();

	},

	_deactivate : function () {

		// reset expands
		this._resetExpands();
	},

	enableSocial : function () {
		// console.log('enableSocial');
	},

	disableSocial : function () {
		// console.log('enableSocial2');
	},

	enableScreenshot : function () {
		// console.log('enableSocial3');
	},

	disableScreenshot : function () {
		// console.log('enableSocial4');
	},



});


;Wu.SidePane.Account = Wu.SidePane.Item.extend({
	_ : 'sidepane.account', 


	type : 'account',
	title : 'Logout', // just simple logout button for now

	initContent : function () {
		this._account = app.Account;

		// clear default content
		this._content.innerHTML = '';

		// add tooltip
		app.Tooltip.add(this._menu, 'Logs you out of the portal' );


	},

	addHooks : function () {

		// Wu.DomEvent.on(this._logoutButton, 'mousedown', this._logout, this);

	},

	update : function () {
	},

	_logout : function () {

	},

	// overrides the sidepane menu item button
	_clickActivate : function () {
		if (confirm('Are you sure you want to log out?')) {
			window.location.href = app.options.servers.portal + 'logout';
		}
	},

});;Wu.HeaderPane = Wu.Class.extend({
	_ : 'headerpane', 

	initialize : function () {
		
		// set options
		this.options = {};
		this.options.editMode = false;
		
		// init container
		this._initContainer();
		
		// return
		return this; 
	},      

	_initContainer : function () {

		// create divs
		this._container = Wu.app._headerPane = Wu.DomUtil.create('div', 'displayNone', Wu.app._mapContainer);
		this._container.id = 'header';

		// wrapper for header
		// this._contentWrap = Wu.DomUtil.create('div', 'header-content-wrap', this._container);
		this._logoContainer = Wu.DomUtil.create('div', 'header-logo-container', this._container);
		this._logo  = Wu.DomUtil.create('img', 'header-logo', this._logoContainer);

		this._titleWrap = Wu.DomUtil.create('div', 'header-title-wrap', this._container);
		this._title 	= Wu.DomUtil.create('div', 'header-title editable', this._titleWrap);
		this._subtitle 	= Wu.DomUtil.create('div', 'header-subtitle editable', this._titleWrap);

		// hack
		this._title.whichTitle = 'title';
		this._subtitle.whichTitle = 'subtitle';

		// tooltips
		app.Tooltip.add(this._logo, 'Click to upload a new logo');

		// stops
		Wu.DomEvent.on(this._logo, 'mouseover', Wu.DomEvent.stopPropagation, this);
		Wu.DomEvent.on(this._title, 'mouseover', Wu.DomEvent.stopPropagation, this);

	},

	getContainer : function () {
		return this._container;
	},

	addHooks : function () {

		// this.addEditHooks();	// set edit hook hook in .Item, nice way to organize edit mode
	},

	addEditHooks : function () {

		// resizer
		// this.enableResize();

		// remove title hooks
		// Wu.DomEvent.on(this._title,    'dblclick', this._enableEdit, this);	// todo: add as optional
		// Wu.DomEvent.on(this._subtitle, 'dblclick', this._enableEdit, this);

		// enable edit on logo
		if (!this.logodz) {
			// create on first load
			this.addDropzone();
		} else {
			this.logodz.enable();
		}

		// set editable class to logo
		Wu.DomUtil.addClass(this._logo, 'editable');
	},

	removeEditHooks : function () {

		// resizer
		// this.disableResize();

		// remove title hooks
		// Wu.DomEvent.off(this._title,    'dblclick', this._enableEdit, this);
		// Wu.DomEvent.off(this._subtitle, 'dblclick', this._enableEdit, this);	

		// disable edit on logo
		if (this.logodz) this.logodz.disable();

		// remove editable class to logo
		Wu.DomUtil.removeClass(this._logo, 'editable');
	},

	addDropzone : function () {

		// create dz
		this.logodz = new Dropzone(this._logo, {
				url : '/api/upload/image',
				createImageThumbnails : false,
				autoDiscover : false
		});
	},

	refreshDropzone : function () {
		var that = this;
		this.logodz.options.params.project = this.project.store.uuid;
		this.logodz.on('success', function (err, path) {
			that.addedLogo(path);
		});
	},

	addedLogo : function (path) {
		
		// set path
		var fullpath = '/images/' + path;

		var project = this.project;
		
		// set new image and save
		project.setHeaderLogo(fullpath);

		// update image in header
		var headerLogoPath = project.getHeaderLogo() ? project.getHeaderLogo() :  '/css/images/defaultProjectLogo.png';
		this._logo.src = headerLogoPath;

		// Wu.DomUtil.thumbAdjust(this._logo, 90);


	},

	disableResize : function () {
		return;

		// // resizer
		// Wu.DomEvent.off(this._resizer, 'mousedown', this.resize, this);
		// Wu.DomEvent.off(this._resizer, 'mouseup', this._resized, this);

		// // set default cursor
		// Wu.DomUtil.addClass(this._resizer, 'headerResizerDisabled');
	},

	enableResize : function () {
		return;
		
		// if (!this.project.editMode) return;
		
		// // resizer
		// Wu.DomEvent.on(this._resizer, 'mousedown', this.resize, this);
		// Wu.DomEvent.on(this._resizer, 'mouseup', this._resized, this);

		// // set ns cursor
		// Wu.DomUtil.removeClass(this._resizer, 'headerResizerDisabled');
	},

	
	_enableEdit : function (e, whichTitle) {
	
		// rename div 
		var div   	= e.target;
		var value 	= e.target.innerHTML;
		var whichTitle 	= e.target.whichTitle;

		if (!whichTitle) return;
		if (whichTitle == 'title')	var input = ich.injectHeaderTitleInput({ value : value });
		if (whichTitle == 'subtitle')   var input = ich.injectHeaderSubtitleInput({ value : value });

		// inject <input>
		div.innerHTML = input;

		// focus
		var target = div.firstChild;
		target.focus();
		target.selectionStart = target.selectionEnd;	// prevents text selection

		// save on blur or enter
		Wu.DomEvent.on( target,  'blur',    this._editBlur, this );     // save folder title
		Wu.DomEvent.on( target,  'keydown', this._editKey,  this );     // save folder title

	},

	_editBlur : function (e) {

		// get value
		var value = e.target.value;

		// revert to <div>
		var div = e.target.parentNode;
		div.innerHTML = value;

		// save latest
		this.save();
	},

	_editKey : function (e) {
		// blur on enter
		if (event.which == 13 || event.keyCode == 13) e.target.blur();
	},

	setTitle : function (title) {
		this._title.innerHTML = title;
	},

	setSubtitle : function (subtitle) {
		this._subtitle.innerHTML = subtitle;
	},

	
	_setLeft : function (left) {
		this._container.style.left = left + 'px';
	},

	_update : function (project) {
		this.update(project);
	},

	update : function (project) {
		this.project = project;
	       
	        // show header
		this._container.style.display = 'block';

		
		var headerLogoPath = project.getHeaderLogo() ? project.getHeaderLogo() :  '/css/images/defaultProjectLogo.png';
		this._logo.src = headerLogoPath;

		// update values
		this._title.innerHTML 	 = project.getHeaderTitle();
		this._subtitle.innerHTML = project.getHeaderSubtitle();
		
		// add edit hooks
		if (project.editMode) {
			this.addEditHooks();
			this.refreshDropzone();
		} else {
			this.removeEditHooks();
		}
	},

	getHeight : function () {
		return this._headerHeight;
	},

	reset : function () {
		// hide header
		// this._container.style.display = 'none';
		
		// Keep header, but remove it's content from DOM
		Wu.app.HeaderPane._title.innerHTML = '';
		Wu.app.HeaderPane._subtitle.innerHTML = '';
		Wu.app.HeaderPane._logo.src = '';
	},

	_resetView : function () {

	},

	resize : function () {
		var that = this;
		return;
		window.onmouseup = function (e) {
			that._resized();
			window.onmouseup = null;
		}

		window.onmousemove = function (e) {
			// resize header and map pane
			that._resize(e.y);
		}
	},

	_resize : function (newHeight) {
		return;
		// header height
		this._headerHeight = newHeight;
		this._container.style.height = this._headerHeight  + 'px';
		this._container.style.maxHeight = this._headerHeight  + 'px';

		// map height
		var control = app._map._controlContainer;
		control.style.paddingTop = this._headerHeight + 'px';

		// home height
		// var home = app.SidePane.Home;
		// home.setHeight(newHeight);

		// set height sidepane
		var sidepane = app.SidePane;
		sidepane.setHeight(newHeight);

	},

	_resized : function () {

		// reset
		this._resizer.style.backgroundColor = '';
		window.onmousemove = null;

		// save to db
		this.save();   

		// refresh map
		setTimeout(function() {
			var map = Wu.app._map;
			if (map) map.reframe();
		}, 300); // time with css
	},

	save : function () {

		// set current values to project
		this.project.store.header.height 	= this._headerHeight;
		this.project.store.header.title 	= this._title.innerHTML;
		this.project.store.header.subtitle 	= this._subtitle.innerHTML;
		var img = this._logo.src.slice(4).slice(0,-1);
		this.project.store.header.logo 		= img;     	


		console.log('img', img);
		// save to db
		this._save();
	},

	_save : function () {
		// save project to db
		this.project._update('header');
	},

	setProject : function (project) {
		// update header with project
		this._update(project);
	}
});
;Wu.ProgressPane = Wu.Class.extend({

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
		this._current = percent;
	},

	hideProgress : function () {
		var bar = this._progressBar;
		bar.style.opacity = 0;
		this._current = 0;
		bar.style.width = 0;
	},
	
	// do a timed progress
	timedProgress : function (ms) {
		var that = this,
		    duration = ms || 5000, // five seconds default
		    steps = 10,	 	   // five steps default
		    p = 0;		   // start percentage
		
		// calculate delay
		var delay = parseInt(duration) / steps;

		// start progress
		this._timedProgress(p, delay, steps);	

	},

	_timedProgress : function (percent, delay, steps) {
		var that = this;

		// set progress to percent after delay
		percent = percent + (100/steps);
		this.setProgress(percent);
		
		setTimeout(function () {

			// play it again sam
			if (percent < 100) return that._timedProgress(percent, delay, steps);

			// done, hide progress bar
			that.hideProgress();

		}, delay)
	}


});;Wu.MapPane = Wu.Class.extend({

	initialize : function () {
		
		// init container
		this._initContainer();

		// active layers
		this._activeLayers = [];

		// connect zindex control
		this._baselayerZIndex = new Wu.ZIndexControl.Baselayers();
		this._layermenuZIndex = new Wu.ZIndexControl.Layermenu();

		return this; 
	},      

	_initContainer : function () {
		
		// init container
		this._container = app._mapPane = Wu.DomUtil.createId('div', 'map', app._mapContainer);
	
		// add help pseudo
		Wu.DomUtil.addClass(this._container, 'click-to-start');
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
	
	setProject : function (project) {
		this.project = project;
		this.reset();
		this.update(project);
	},

	getZIndexControls : function () {
		var z = {
			b : this._baselayerZIndex, // base
			l : this._layermenuZIndex  // layermenu
		}
		return z;
	},


	clearBaseLayers : function () {
		var map = this._map;

		if (!this.baseLayers) return;
		
		this.baseLayers.forEach(function (base) {
			map.removeLayer(base.layer);
		});

		this.baseLayers = {};
	},

	setBaseLayers : function () { 
		var map = this._map;

		// clear
		this.clearBaseLayers();

		// set baseLayers stored in project
		var baseLayers = this.project.getBaselayers();

		// return if empty
		if (!baseLayers) return;

		// add
		baseLayers.forEach(function (layer) {
			this.addBaseLayer(layer);
		}, this);
	},


	addBaseLayer : function (baseLayer) {
		
		// Wu.Layer
		var layer = this.project.layers[baseLayer.uuid];
		if (!layer) return;
		
		layer.add('baselayer');
		layer.setOpacity(baseLayer.opacity);
			

	},

	removeBaseLayer : function (layer) {
		map.removeLayer(base.layer);
	},

	_setLeft : function (width) {  
		this._container.style.left = width + 'px';
		this._container.style.width = parseInt(window.innerWidth) - width + 'px';
	},

	_update : function (project) {
		this.update(project);
	},

	update : function (project) {
		
		this.project = project;

		// clear active layers
		this.clearActiveLayers();

		// get editor privs
		this._isEditor = app.Account.canUpdateProject(app.activeProject.getUuid());

		// set base layers
		this.setBaseLayers();

		// set bounds
		this.setMaxBounds();

		// set position
		this.setPosition();

		// set header padding
		this.setHeaderPadding();

		// set controls css logic
		setTimeout(this.updateControlCss.bind(this), 100); // timeout hack bug
		
	},

	setHeaderPadding : function () {
		// set padding
		var map = this._map;
		var control = map._controlContainer;
		control.style.paddingTop = this.project.getHeaderHeight() + 'px';
	},


	setPosition : function (position) {
		var map = this._map;
		
		// get position
		var pos = position || this.project.getLatLngZoom();
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
		var bounds = this.project.getBounds();

		if (!bounds) return;

		var southWest = L.latLng(bounds.southWest.lat, bounds.southWest.lng);
   		var northEast = L.latLng(bounds.northEast.lat, bounds.northEast.lng);
    		var maxBounds = L.latLngBounds(southWest, northEast);

    		// set maxBoudns
		map.setMaxBounds(maxBounds);
		map.options.minZoom = bounds.minZoom;
		map.options.maxZoom = bounds.maxZoom;
	},
	

	_reset : function () {
		this.reset();
	},

	createNewMap : function () {

		var options = {
			worldCopyJump : true,
			attributionControl : false
		}

		// get project pos
		var pos = this.project.getLatLngZoom(),
		    lat = pos.lat,
		    lng = pos.lng,
		    zoom = pos.zoom;

		// create new map
		this._map = Wu.app._map = L.map('map', options).setView([lat, lng], zoom); 

		// add editable layer
		this.addEditableLayer(this._map);

		// add attribution
		this._attributionControl = L.control.attribution({
				position : 'bottomright',
				prefix : 'Powered by <a href="https://systemapic.com/" target="_blank">Systemapic.com</a> ©'
		});
		this._map.addControl(this._attributionControl);

	},


	addEditableLayer : function (map) {
		// create layer
		this.editableLayers = new L.FeatureGroup();
		map.addLayer(this.editableLayers);
	},

	reset : function () {

		// flush current map
		var map = this._map;
		if (map) {
			
			// remove each layer
			map.eachLayer(function(layer) {
				map.removeLayer(layer);
			});

			// remove map
			map.remove();

		}

		// create new map
		this.createNewMap();

		// width hack
		this._updateWidth();

		// remove controls
		this.resetControls();

		// remove hanging zoom
		this.disableZoom();             // weird ta

	},

	updateControlCss : function () {


		// get controls
		var controls = this.project.getControls(),
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
			var legendsContainer = this.legendsControl._legendsContainer;

			// Check for Layer Menu Control
			if (controls.layermenu) {
				Wu.DomUtil.removeClass(legendsContainer, 'legends-padding-right');
			} else {
				Wu.DomUtil.addClass(legendsContainer, 'legends-padding-right');
			}

			// Check for Description Control
			if (controls.description) {} 

		}

		// scale control
		if (controls.measure) {
			if (controls.layermenu) {
				topright.style.right = '295px';
			} else {
				topright.style.right = '6px';
			}
		}


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

		// remove carto
		if (this.cartoCss) this.cartoCss.destroy();
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
		var map = this._map;
		if (noDrag) map.dragging.disable();
		map.touchZoom.disable();
		map.doubleClickZoom.disable();
		map.scrollWheelZoom.disable();
		map.boxZoom.disable();
		map.keyboard.disable();
	},

	enableInteraction : function (noDrag) {
		var map = this._map;
		if (noDrag) map.dragging.enable();
		map.touchZoom.enable();
		map.doubleClickZoom.enable();
		map.scrollWheelZoom.enable();
		map.boxZoom.enable();
		map.keyboard.enable();
	},

	disableZoom : function () {
		this._map.touchZoom.disable();
		this._map.doubleClickZoom.disable();
		this._map.scrollWheelZoom.disable();
		this._map.boxZoom.disable();
		this._map.keyboard.disable();
		document.getElementsByClassName('leaflet-control-zoom')[0].style.display = 'none';
	}, 

	enableZoom : function () {
		this._map.touchZoom.enable();
		this._map.doubleClickZoom.enable();
		this._map.scrollWheelZoom.enable();
		this._map.boxZoom.enable();
		this._map.keyboard.enable();
		document.getElementsByClassName('leaflet-control-zoom')[0].style.display = 'block';
	},

	enableLegends : function () {
		if (this.legendsControl) return;

		// create control
		this.legendsControl = L.control.legends({
			position : 'bottomleft'
		});

		// add to map
		this.legendsControl.addTo(this._map);

		// update control with project
		this.legendsControl.update();
	},

	disableLegends : function () {
		if (!this.legendsControl) return;
	       
		// remove and delete control
		this._map.removeControl(this.legendsControl);
		delete this.legendsControl;
	},

	enableMouseposition : function () {
		if (this.mousepositionControl) return;

		// create control
		this.mousepositionControl = L.control.mouseposition({ position : 'topright' });

		// add to map
		this.mousepositionControl.addTo(this._map);
	},

	disableMouseposition : function () {
		if (!this.mousepositionControl) return;
	       	
		// remove and delete control
		this._map.removeControl(this.mousepositionControl);
		delete this.mousepositionControl;
	},

	enableGeolocation : function () {
		if (this.geolocationControl) return;

		// create controls 
		this.geolocationControl = new L.Control.Search({
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
		});

		// add to map
		this.geolocationControl.addTo(this._map);
	},

	disableGeolocation : function () {
		if (!this.geolocationControl) return;
	       	
		// remove and delete control
		this._map.removeControl(this.geolocationControl);
		delete this.geolocationControl;
		
	},

	enableMeasure : function () {
		if (this._scale) return;

		this._scale = L.control.scale({'position' : 'topright'});
		this._scale.addTo(this._map);
	},

	disableMeasure : function () {
		if (!this._scale) return;

		this._map.removeControl(this._scale);
		delete this._scale;
	},

	enableDescription : function () {
		if (this.descriptionControl) return;

		// create control
		this.descriptionControl = L.control.description({
			position : 'topleft'
		});

		// add to map
		this.descriptionControl.addTo(this._map);

		// update control with project
		this.descriptionControl.update();

	},

	disableDescription : function () {
		if (!this.descriptionControl) return;
	       
		// remove and delete control
		this._map.removeControl(this.descriptionControl);
		delete this.descriptionControl;
	},

	enableInspect : function () {
		if (this.inspectControl) return;

		// create control
		this.inspectControl = L.control.inspect({
			position : 'bottomright'
		});

		// add to map
		this.inspectControl.addTo(this._map);

		// update control with project
		this.inspectControl.update();

	},

	enableCartocss : function () {
		if (this.cartoCss) return;

		// dont allow for non-editors
		if (!this._isEditor) return;

		// create control
		this.cartoCss = L.control.cartoCss({
			position : 'topleft'
		});

		// add to map
		this.cartoCss.addTo(this._map);

		// update with latest
		if (app.activeProject) this.cartoCss.update();

		return this.cartoCss;
	},

	disableCartocss : function () {
		if (!this.cartoCss) return;

		this._map.removeControl(this.cartoCss);
		delete this.cartoCss;
	},

	disableInspect : function () {
		if (!this.inspectControl) return;
	       
		// remove and delete control
		this._map.removeControl(this.inspectControl);
		delete this.inspectControl;
	},

	enableLayermenu : function () {      
		if (this.layerMenu) return;

		// add control
		this.layerMenu = L.control.layermenu({
			position : 'bottomright'
		});

		// add to map
		this.layerMenu.addTo(this._map);
		
		// update control (to fill layermenu from project)
		this.layerMenu.update();

		return this.layerMenu;
	},

	disableLayermenu : function () {
		if (!this.layerMenu) return;
	       
		// remove and delete control
		this._map.removeControl(this.layerMenu);
		delete this.layerMenu;
	},

	enableBaselayertoggle : function () {
		if (this.baselayerToggle) return;

		// create control
		this.baselayerToggle = L.control.baselayerToggle();

		// add to map
		this.baselayerToggle.addTo(this._map);

		// update
		this.baselayerToggle.update();

		return this.baselayerToggle;

	},

	disableBaselayertoggle : function () {
		if (!this.baselayerToggle) return

		this._map.removeControl(this.baselayerToggle);
		delete this.baselayerToggle;
	},
	
	enableVectorstyle : function (container) {
		// if (this.vectorStyle) return;
		
		// this.vectorStyle = L.control.styleEditor({ 
		// 	position: "topleft", 
		// 	container : container
		// });
		
		// this._map.addControl(this.vectorStyle);
	},

	disableVectorstyle : function () {
		// if (!this.vectorStyle) return;

		// // remove vectorstyle control
		// this._map.removeControl(this.vectorStyle);             // todo: doesnt clean up after itself!
		// delete this.vectorStyle;   
	},


	enableDraw : function () {
		if (this._drawControl) return;
		
		// add draw control
		this.addDrawControl();
	},

	disableDraw : function () {
		if (!this._drawControl || this._drawControl === 'undefined') return;

		// disable draw control
		this.removeDrawControl();
	},

	removeDrawControl : function () {
		if (!this._drawControl || this._drawControl === 'undefined') return;

		// remove draw control
		this._map.removeControl(this._drawControl);

		// this._map.removeLayer(this.editableLayers);	//todo
		this._drawControl = false;

		// remove vector styling
		this.disableVectorstyle();
	},

	addDrawControl : function () {
		var that = this,
		    map = this._map,
		    editableLayers = this.editableLayers;

		// Leaflet.Draw options
		options = {
			position: 'topleft',
			// edit: {
			// 	// editable layers
			// 	featureGroup: editableLayers
			// },
			draw: {
				circle: {
					shapeOptions: {
						fill: true,
						color: '#FFF',
						fillOpacity: 0.3,
						// fillColor: '#FFF'
					}
				},
				rectangle: { 
					shapeOptions: {
						fill: true,
						color: '#FFF',
						fillOpacity: 0.3,
						fillColor: '#FFF'
					}
				},
				polygon: { 
					shapeOptions: {
						fill: true,
						color: '#FFF',
						fillOpacity: 0.3,
						fillColor: '#FFF'
					}
				},
				polyline: { 
					shapeOptions: {
						fill: false,
						color: '#FFF'

					}
				}       
			}
		};

		// add drawControl
		var drawControl = this._drawControl = new L.Control.Draw(options);

		// add to map
		map.addControl(drawControl);

		// add class
		var container = drawControl._container;
		L.DomUtil.addClass(container, 'elizaveta');	// todo: className

		// close popups on hover, stop clickthrough
		Wu.DomEvent.on(drawControl, 'mousemove', L.DomEvent.stop, this);
		Wu.DomEvent.on(drawControl, 'mouseover', map.closePopup, this);
		Wu.DomEvent.on(container,   'mousedown mouseup click', L.DomEvent.stopPropagation, this);


		// var that = this;

		// add circle support
		map.on('draw:created', function(e) {

			// console.log('draw:created!', e);

			// add circle support
			e.layer.layerType = e.layerType;            

			// add to map
			app._map.addLayer(e.layer);

		});

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
						var cunt = shit[o];
						if (o == id) return shit;
					}
				}
			}
		}
		return false;
	},


	_addPopupContent : function (e) {

		var content = this._createPopupContent(e),
		    buffer = '<hr>';

		// clear old popup
		this._popup = null;

		// return if no content
		if (!content) return;
		
		if (!this._popupContent) {
			// create empty
			this._popupContent = '';
		} else {
			// append buffer
			this._popupContent += buffer;
		}

		// append content
		this._popupContent += content;

	},

	_clearPopup : function () {
		this._popupContent = '';
		this._popup = null;
	},

	
	openPopup : function (e) {
		if (this._popup) return;

		var popup = this._createPopup(),
		    content = this._popupContent,
		    map = app._map,
		    latlng = e.latlng;

		// return if no content
		if (!content) return this._clearPopup();
		
		// set popup close event
		this._addPopupCloseEvent();

		// keep popup while open
		this._popup = popup;

		// set content
		popup.setContent(content);
		popup.setLatLng(latlng);
		
		setTimeout(function () {
			popup.openOn(map);		// todo: still some minor bugs,
		}, 100); // hack			// this hack perhaps due to double opening

		
	},

	_createPopup : function () {

		// create popup
		var popup = L.popup({
			offset : [18, 0],
			closeButton : true,
			zoomAnimation : false,
			maxWidth : 400,
			minWidth : 200,
			maxHeight : 350,
			// closeOnClick : false
		});
		return popup;
	},


	_addPopupCloseEvent : function () {
		if (this._popInit) return;
		this._popInit = true;	// only run once

		var map = app._map;
		map.on('popupclose',  this._clearPopup, this);
	},

	_createPopupContent : function (e) {

		// check for stored tooltip
		var data = e.data,
		    layer = e.layer,
		    meta = layer.getTooltip(),
		    string = '';

		if (meta) {
			if (meta.title) string += '<div class="tooltip-title-small">' + meta.title + '</div>';

			// add meta to tooltip
			for (var m in meta.fields) {
				var field = meta.fields[m];

				// only add active tooltips
				if (field.on) {
					var caption = field.title || field.key;
					var value = data[field.key];

					// add to string
					string += caption + ': ' + value + '<br>';
				}
			}
			return string;

		} else {

			// create content
			var string = '';
			for (var key in data) {
				var value = data[key];
				if (value != 'NULL' && value!= 'null' && value != null && value != '' && value != 'undefined' && key != '__sid') {
					string += key + ': ' + value + '<br>';
				}
			}
			return string;
		}
	},
	
});


;Wu.StatusPane = Wu.Class.extend({
	_ : 'statuspane', 

	initialize : function (options) {
		
		// set options
		Wu.setOptions(this, options);

		// init container
		this.initContainer();

		// add hooks
		this.addHooks();

		// this.__gaEvents();

	},

	initContainer : function () {

		// create div
		var container 	= this._container 	= Wu.DomUtil.create('div', 'home-container');
		var logo 	= this._logo 		= Wu.DomUtil.create('div', 'home-logo', container);
		var statusWrap 	= this._statusWrap 	= Wu.DomUtil.create('div', 'home-status-wrap', container);
		var status 				= Wu.DomUtil.create('div', 'home-status', statusWrap);
		var statusInner 			= Wu.DomUtil.create('div', 'home-status-inner', status);

		// set default status
		this.clearStatus();

		// add to sidepane if assigned container in options
		if (this.options.addTo) this.addTo(this.options.addTo);

		// add tooltip
		app.Tooltip.add(this._container, 'This is the main menu. Here you can change projects, view documents, download files, etc.', { extends : 'systyle', tipJoint : 'bottom right' });

	},

	addHooks : function () {
		// open sidepane menu on mousedown
		Wu.DomEvent.on(this._container, 'mousedown', this.toggle, this);

		// global TAB key toggle
		// Wu.DomEvent.on(document, 'keydown', this.tab, this);	// todo: fix tabbing in inputs
	},


	tab : function (e) {
		if (e.keyCode == 9) this.toggle();
	},

	toggle : function () {
		this.isOpen ? this.close() : this.open();
	
		// div cleanups to do when hitting home
		this.cleaningJobs();
	},

	cleaningJobs: function () {

		// make sure layermenu edit is disabled
		var layerMenu = Wu.app.MapPane.layerMenu;
		if (layerMenu) layerMenu.disableEdit();

		// close all open options
		app.SidePane.Map.closeAll();
	},

	// open sidepane menu
	open : function (e) {


		this.isOpen = true;
		if (app.SidePane) app.SidePane.expand();
		this.refresh();

		this.checkMapBlur();
		this.setContentHeights();

		// remove help pseudo
		// Wu.DomUtil.removeClass(app._mapPane, 'click-to-start');

		// trigger activation on active menu item
		app._activeMenu._activate();

		// Hide button section and Layer info when the Home dropdown menu opens (j)
		if (app._map) app._map._controlCorners.topleft.style.opacity = 0;


		app.MapPane.descriptionControl;

		// close layermenu edit if open  				// refactor all these events.. centralize
		var layermenu = app.MapPane.layerMenu;
		if (layermenu) layermenu.disableEdit();


		// Face out startpane if it's open
		if ( app.StartPane.isOpen ) app.StartPane._banner.style.opacity = '0.1';


		// Mobile option
		if (Wu.app.mobile) {

			// Check if there is a map pane there...
			if ( app.MapPane ) {
			
				// Close the Layer Menu control
				if ( app.MapPane.layerMenu ) {
					app.MapPane.layerMenu.closeLayerPane();
					app.MapPane.layerMenu._openLayers.style.opacity = 0;
				}

				// Close the Legends control
				if ( app.MapPane.legendsControl ) {
					if ( app.MapPane.legendsControl._isOpen ) app.MapPane.legendsControl.MobileCloseLegends();
					app.MapPane.legendsControl._legendsOpener.style.opacity = 0;
				}

				// Close the description control
				if ( app.MapPane.descriptionControl ) {
					if ( !app.MapPane.descriptionControl._isClosed ) app.MapPane.descriptionControl.mobileClosePane();
				}
			}
		}



	},

	// close sidepane menu
	close : function (e) {

		this.isOpen = false;

		// collapse sidepane
		if (app.SidePane) app.SidePane.collapse();
		
		// refresh
		this.refresh();


		var mp = app.MapPane,
		    descriptionControl = mp.descriptionControl;

		// removes the blur on map if it's set by one of the fullpanes
		Wu.DomUtil.removeClass(app.MapPane._container, "map-blur");

		// Show button section and Layer info when the Home dropdown menu opens (j)
		if (app._map) {
			var topleft = app._map._controlCorners.topleft;
		    	topleft.style.opacity = 1;
			topleft.style.display = 'block';
		}

		// Face out startpane if it's open
		if ( app.StartPane.isOpen ) app.StartPane._banner.style.opacity = '1';

		// Mobile option : activate default sidepane on close to avoid opening in fullscreen
		if (app.mobile) {
			if (mp) {
				
				if (mp.layerMenu) 		mp.layerMenu._openLayers.style.opacity = 1;
				if (mp.legendsControl)		mp.legendsControl._legendsOpener.style.opacity = 1;
				if (mp.descriptionControl) 	mp.descriptionControl._button.style.opacity = 1;
				
				// Make sure we reset if we're in fullscreen mode (media library, users, etc)
				if (app.SidePane.fullscreen) app.SidePane.Clients.activate();	
			}

			// Show the controllers (has been hidden when a new project is refreshed in projects.js > refresh() )
			app._map._controlContainer.style.opacity = 1;
		}


		// Only open the description box if there is anything inside of it
		if (descriptionControl && descriptionControl.activeLayer) {
			if (descriptionControl.activeLayer.store.description == '' || !descriptionControl.activeLayer.store.description ) {
				descriptionControl.hide();
			}
		} 
		//else {
		// 	// If no layers has been activated
		// 	descriptionControl.hide();	
		// }

	},

	setContentHeights : function () {

		var clientsPane = app.SidePane.Clients;
		var optionsPane = app.SidePane.Map;

		if (clientsPane) clientsPane.setContentHeight();
		if (optionsPane) optionsPane.setContentHeight();
	},

	checkMapBlur : function () {

		if ( 	app._activeMenuItem == 'documents' || 
			app._activeMenuItem == 'dataLibrary' || 
			app._activeMenuItem == 'users' ) 
		{
			Wu.DomUtil.addClass(app.MapPane._container, "map-blur");
		}

	},

	addTo : function (wrapper, before) {
		// insert first in wrapper
		if (before) {
			wrapper.insertBefore(this._container, wrapper.firstChild);
		} else {
			wrapper.appendChild(this._container);
		}
	},

	setHeight : function (height) {
		// set height
		this._container.style.height = parseInt(height) + 'px';
	},

	refresh : function () {

		if (!this.project) return;
		// set height to project headerHeight
		var headerHeight = this.project.getHeaderHeight();
		this.setHeight(headerHeight);
	},

	updateContent : function (project) {

		this.project = project;

		// refresh height
		this.refresh();

		// collapse errything to just logo
		this.close();
	},

	setStatus : function (message, timer) {
		var that = this;

		// clear last clearTimer
		if (this.clearTimer) clearTimeout(this.clearTimer);

		// create div
		var status 	= Wu.DomUtil.create('div', 'home-status');
		var statusInner = Wu.DomUtil.create('div', 'home-status-inner', status);

		
		// set message
		statusInner.innerHTML = message;
		
		// push onto dom
		this.pushStatus(status);

		// clearTimer
		this.clearTimer = setTimeout(function () {
			that.clearStatus();
		}, timer || 3000);
	
	},

	// set 3000ms save status
	setSaveStatus : function (delay) {
		this.setStatus('Saved!', delay);
	},

	pushStatus : function (div) {

		// get old status div, insertBefore
		var old = this._statusWrap.firstChild;
		this._statusWrap.insertBefore(div, old);
		
		// wait 50ms for div to enter DOM
		setTimeout(function () {

			// add in class
			Wu.DomUtil.addClass(div, 'status-in');

			// after css effects done (250ms);
			setTimeout(function () {
				// remove old
				Wu.DomUtil.remove(old);
			}, 250);
		}, 50);
	},

	clearStatus : function () {
		// set default string
		var portalName = app.getPortalName();
		
		// do nothing if same
		if (portalName == this.getStatus()) return;

		// set status
		this.setStatus(portalName);
	},

	getStatus : function () {
		return this._statusWrap.firstChild.firstChild.innerHTML;
	},


});
;Wu.StartPane = Wu.Class.extend({

	initialize : function (options) {
		
		// set options
		Wu.setOptions(this, options);


		this.dimensions = {
			screenW 	: 	0,
			screenH 	: 	0,
			boxW 		: 	350,
			boxH 		: 	233,
			sizeMode 	: 	'',
			projectNo 	: 	0
		}

		this.projectContainers	= [];
	},

	activate : function () {

		this.isOpen = true;

		// create container
		this.initSpinner();

		// add events
		this.addHooks();

		// refresh latest projects
		this.refreshProjects();

		// Show the header pane.
		Wu.DomUtil.removeClass(Wu.app.HeaderPane._container, 'displayNone');


		// screendimentions
		// app._getDimensions()
	


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


	initSpinner : function () {

		console.log('initSpinner');

		// create container 
		this._container = Wu.DomUtil.create('div', 'startpane-canvas-container', app._appPane);

		// create content for black box
		var content = this._initSpinnerContent();
		this._wrapper = Wu.DomUtil.create('div', 'spinning-wrapper', this._container);

		this._wrapper.appendChild(content);

		this._spinner = false;



		return;

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

	_initSpinnerContent : function () {

		// create wrapper
		var wrapper = Wu.DomUtil.create('div', 'startpane-spinning-content');

		// black box in centre
		this._bannerContainer = Wu.DomUtil.create('div', 'startpane-banner-container', wrapper);
		this._banner = Wu.DomUtil.create('div', 'startpane-banner', this._bannerContainer);

		this._recentProjectsContainer = Wu.DomUtil.create('div', 'startpane-recent-projects-container', this._banner);

		this._recentProjectsHeader = Wu.DomUtil.create('h1', 'startpane-header-title', this._recentProjectsContainer, 'Recent projects:');
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

		// Client info
		var clientID = project.store.client;
		var clientName = app.Clients[clientID].name;
		var clientLogo = app.Clients[clientID].logo;

		var newProject = {};
		// create container
		newProject._projectContainer = Wu.DomUtil.create('div', 'start-panne-recent-projects', this._projectList);
		
		newProject._projectThumb = Wu.DomUtil.create('img', '', newProject._projectContainer);
		newProject._projectThumb.src = project.store.logo;

		newProject._projectTitle = Wu.DomUtil.create('div', 'start-project-name', newProject._projectContainer);
		newProject._projectTitle.innerHTML = project.getName();

		newProject._clientName = Wu.DomUtil.create('div', 'start-project-client-name', newProject._projectContainer);
		newProject._clientName.innerHTML = clientName;

		newProject._clientLogo = Wu.DomUtil.create('img', 'start-project-client-logo', newProject._projectContainer);
		newProject._clientLogo.src = clientLogo;


		this.projectContainers.push(newProject);


		// Adjust for short titles
		if (project.getName().length < 22) Wu.DomUtil.addClass(newProject._projectTitle, 'short-name');
		

		// var client

		// select project hook
		Wu.DomEvent.on(newProject._projectContainer, 'mousedown', function() { this.selectProject(project); }, this);

	},

	addHooks : function () {
	},

	removeHooks : function () {
	},

	selectProject : function(project) {

		// select project
		project.select();

		// refresh sidepane
		app.SidePane.refreshProject(project);

		// Hide the Start Pane
		this.deactivate();

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

		console.log('change the height');
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

		for (var i = 0; i < this.projects.length - 1; i++) {
			if (i < no) {
				Wu.DomUtil.removeClass(this.projectContainers[i]._projectContainer, 'displayNone');
			} else {
				Wu.DomUtil.addClass(this.projectContainers[i]._projectContainer, 'displayNone');
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

	}
});

;Wu.ErrorPane = Wu.Class.extend({

	options : {

		clearTimer : false,
		clearDelay : 1000,
		severityColors : {
			1 : 'yellow',
			2 : 'cyan',
			3 : 'rgb(255, 122, 122)'
		}

	},

	initialize : function () {

		// init layout
		this.initLayout();

	},

	initLayout : function () {

		// create divs
		this._container = Wu.DomUtil.create('div', 'error-pane displayNone', app._mapContainer);
		this._content = Wu.DomUtil.create('div', 'error-pane-content', this._container);

		this._title = Wu.DomUtil.create('div', 'error-pane-title', this._content);
		this._description = Wu.DomUtil.create('div', 'error-pane-description', this._content);
		this._icon = Wu.DomUtil.create('div', 'error-pane-icon', this._content);

		// events
		this.addEvents();

	},

	addEvents : function () {

		// close on click
		Wu.DomEvent.on(this._container, 'mousedown', this.clear, this);

	},

	setError : function (title, description, severity) {

		// set view
		if (title) this.setTitle(title);
		if (description) this.setDescription(description);
		if (severity) this.setSeverity(severity);

		// show
		this.show();

		// clear after timeout
		this.clearTimer();

	},

	clearTimer : function (delay) {
		if (!this.options.clearTimer) return;
		this._clearTimer = setTimeout(this.clear.bind(this), delay || this.options.clearDelay);
	},

	clear : function () {
		this.hide();
	},

	setTitle : function (title) {
		this._title.innerHTML = title;
	},

	setDescription : function (description) {
		this._description.innerHTML = description;
	},

	setSeverity : function (s) {
		if (s) this.setBackground(this.options.severityColors[s]);
	},

	setBackground : function (color) {
		this._content.style.background = color;
	},

	hide : function () {
		Wu.DomUtil.addClass(this._container, 'displayNone');
	},

	show : function () {
		Wu.DomUtil.removeClass(this._container, 'displayNone');
	}




});;Wu.Dropzone = Wu.Class.extend({
	// dropzone for files to data library
	// drop anywhere, anytime

	options : {
		metaDelay : 3000 // ms
	},

	initialize : function () {
		this.initLayout();
	},

	initLayout : function () {

		// create divs
		this._container = Wu.DomUtil.create('div', 'dropzone-pane', app._appPane);
		this._content = Wu.DomUtil.create('div', 'dropzone-content', this._container);
		this._hidden = Wu.DomUtil.create('div', 'dropzone-hidden', this._container);
		this._meta = Wu.DomUtil.create('div', 'dropzone-meta', app._appPane);
		this._metaTitle = Wu.DomUtil.create('div', 'drop-meta-title', this._meta, 'Uploading');
		this._metaWrapper = Wu.DomUtil.create('div', 'dropzone-meta-outer', this._meta);

		// create progress bar
		this.progress = new Wu.ProgressPane();

		// hide by default
		this.hide();
		this.hideMeta();
	},

	show : function () {
		Wu.DomUtil.removeClass(this._container, 'displayNone');
	},

	hide : function () {
		Wu.DomUtil.addClass(this._container, 'displayNone');
	},

	showMeta : function () {
		if (this._showingMeta) return;

		// mark as showing
		this._showingMeta = true;

		// show
		Wu.DomUtil.removeClass(this._meta, 'fadeOut');
		Wu.DomUtil.removeClass(this._meta, 'displayNone');

		// fade out after n seconds
		this._fadeTimer = setTimeout(this.fadeMeta.bind(this), this.options.metaDelay);

	},

	fadeMeta : function () {

		// clear timer if already queued
		if (this._fadeTimer) clearTimeout(this._fadeTimer);

		// fade out
		Wu.DomUtil.addClass(this._meta, 'fadeOut');

		// hide completely 500ms after fade
		setTimeout(this.hideMeta.bind(this), 500);
	},

	hideMeta : function () {

		// hide and clear
		Wu.DomUtil.addClass(this._meta, 'displayNone');
		this._clearMeta();

		// mark as not showing
		this._showingMeta = false;
	},

	_clearMeta : function () {
		this._metaWrapper.innerHTML = '';
	},

	addMeta : function (meta) {
		var div = this._addMeta(meta);
		this._metaWrapper.appendChild(div);
	},

	_addMeta : function (file) {
		if (!file) return; 			// todo: file undefined on drag'n drop

		var wrapper 	= Wu.DomUtil.create('div', 'drop-meta-wrapper');
		var name 	= Wu.DomUtil.create('div', 'drop-meta-name', wrapper);
		var size 	= Wu.DomUtil.create('div', 'drop-meta-size', wrapper);
		var type 	= Wu.DomUtil.create('div', 'drop-meta-type', wrapper);
		var ext 	= Wu.DomUtil.create('div', 'drop-meta-type', wrapper);

		name.innerHTML = 'Name: ' + file.name;
		size.innerHTML = 'Size: ' + Wu.Util.bytesToSize(file.size);
		type.innerHTML = 'Type: ' + file.type.split('/')[0].camelize();
		ext.innerHTML  = 'Filetype: ' + file.type.split('/')[1];

		return wrapper;
	},


	initDropzone : function (options) {
		
		// get callback
		this._uploadedCallback = options.uploaded;

		// get clickable divs
		this._clickable = options.clickable;

		// create dz
		this.dz = new Dropzone(this._container, {
				url : '/api/upload',
				createImageThumbnails : false,
				autoDiscover : false,
				uploadMultiple : true,
				acceptedFiles : '.zip,.gz,.png,.jpg,.jpeg,.geojson,.docx,.pdf,.doc,.txt',
				// acceptedFiles : '.zip,.gz,.png,.jpg,.jpeg,.geojson,.json,.topojson,.kml,.docx,.pdf,.doc,.txt',
				maxFiles : 10,
				parallelUploads : 10,
				clickable : this._clickable || false,
		});

		// add fullscreen dropzone
		this.addDropzoneEvents();     
		
	},

	addDropzoneEvents : function () {

		// add fullscreen bridge to dropzone
		Wu.DomEvent.on(document.body, 'dragenter', this.dropping, this);
		Wu.DomEvent.on(document.body, 'dragleave', this.undropping, this);
		Wu.DomEvent.on(document.body, 'dragover', this.dragover, this);
		Wu.DomEvent.on(document.body, 'drop', this.dropped, this);
	},


	removeDropzoneEvents : function () {

		// remove fullscreen bridge to dropzone
		Wu.DomEvent.off(document.body, 'dragenter', this.dropping, this);
		Wu.DomEvent.off(document.body, 'dragleave', this.undropping, this);
		Wu.DomEvent.off(document.body, 'dragover', this.dragover, this);
		Wu.DomEvent.off(document.body, 'drop', this.dropped, this);

	},

	disable : function () {
		this.removeDropzoneEvents();
	},

	enable : function () {
		this.addDropzoneEvents();	
	},

	refresh : function () {
		var that = this;

		// refresh project
		this.project = app.activeProject;

		// clean up last dz
		this.dz.removeAllListeners();

		// set project uuid for dropzone
		this.dz.options.params.project = this.project.getUuid();	// goes to req.body.project

		// set dz events
		this.dz.on('drop', function (e) { 
			that.hide();
		});

		this.dz.on('dragenter', function (e) { 
		
		});

		this.dz.on('addedfile', function (file) { 

			// show meta screen
			that.showMeta();

			// show progressbar
			that.progress.setProgress(0);

			// show meta
			that.addMeta(file);

			// set status
			app.setStatus('Uploading');
		});


		this.dz.on('complete', function (file) {
		
			// clean up
			that.dz.removeFile(file);

			// hide meta
			that.fadeMeta();
		});

		this.dz.on('uploadprogress', function (file, progress) {
			// set progress
			that.progress.setProgress(progress);
		});                                                                                                                                                                                                               

		this.dz.on('successmultiple', function (err, json) {
		
			// parse and process
			var obj = Wu.parse(json);

			// set status
			app.setStatus('Done!', 2000);

			// callback
			if (obj) that._uploadedCallback(obj);

			// clear fullpane
			that.progress.hideProgress();
		});
	
	},

	dropping : function (e) {
		e.preventDefault();
	    
		// show .fullscreen-drop
		this.show(e);
	},

	undropping : function (e) {
		e.preventDefault();
		var t = e.target;

		// hide
		if (t == this._container) this.hide();
	},

	dropped : function (e) {
		e.preventDefault();

		// fire dropzone
		this.dz.drop(e);
	},

	dragover : function (e) {
		// needed for drop fn
		e.preventDefault();
	},




});Wu.ZIndexControl = Wu.Class.extend({

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












;L.Control.Layermenu = L.Control.extend({

	options: {
		position : 'bottomright' 
	},

	onAdd : function (map) {

		var className = 'leaflet-control-layermenu',
		    container = this._innerContainer = L.DomUtil.create('div', className),
		    options   = this.options;

		// add html
		container.innerHTML = ich.layerMenuFrame();  // nb: this._innerContainer = container;

		// add some divsscroller-frame
		this.initLayout();

		// stops
		Wu.DomEvent.on(container, 'mouseup', Wu.DomEvent.stop, this);


		// nb! content is not ready yet, cause not added to map! 
		return container;

	},


	initLayout : function () {		

		// Create the header    
		this._layerMenuHeader = Wu.DomUtil.createId('div', 'layer-menu-header');
		Wu.DomUtil.addClass(this._layerMenuHeader, 'menucollapser');
		
		this._layerMenuHeaderTitle = Wu.DomUtil.create('div', 'layer-menu-header-title', this._layerMenuHeader, 'Layers');

		// Create the collapse button
		this._bhattan1 = Wu.DomUtil.createId('div', 'bhattan1');
		Wu.DomUtil.addClass(this._bhattan1, 'dropdown-button rotate270');
		this._layerMenuHeader.appendChild(this._bhattan1);

		// Insert Header at the top
		this._innerContainer.insertBefore(this._layerMenuHeader, this._innerContainer.getElementsByTagName('div')[0]);

		// Create the 'uncollapse' button ... will put in DOM l8r
		this._openLayers = Wu.DomUtil.createId('div', 'open-layers');
		this._openLayers.innerHTML = 'Open Layer Menu';
		Wu.DomUtil.addClass(this._openLayers, 'leaflet-control ol-collapsed');

		// Append to DOM
		app._map._controlCorners.bottomright.appendChild(this._openLayers);

		// Pick up Elements dealing with the Legends
		this._legendsContainer = Wu.DomUtil.get('legends-control-inner-content');
		this._legendsCollapser = Wu.DomUtil.get('legends-collapser');

		// Register Click events cxxxx                     
		Wu.DomEvent.on(this._bhattan1,   'click', this.closeLayerPane, this);
		// Wu.DomEvent.on(this._openLayers, 'click', this.openLayerPane, this);
		Wu.DomEvent.on(this._openLayers, 'click', this.toggleLayerPane, this);     

		// Stop Propagation
		Wu.DomEvent.on(this._openLayers, 'mousedown click dblclick',  Wu.DomEvent.stopPropagation, this);
		Wu.DomEvent.on(this._bhattan1, 'mousedown click dblclick',  Wu.DomEvent.stopPropagation, this);

		// auto-close event
		Wu.DomEvent.on(this._innerContainer, 'mouseenter', this.cancelEditClose, this);
		Wu.DomEvent.on(this._innerContainer, 'mouseleave', this.timedEditClose, this);

		// add extra padding		
		if (!app.MapPane.inspectControl) {
			var corner = app._map._controlCorners.bottomright;
			corner.style.paddingBottom = 6 + 'px';
		}

		// add tooltip
		app.Tooltip.add(this._layerMenuHeaderTitle, 'The layer menu lets you choose what layers you want to be on top of the map', { extends : 'systyle', tipJoint : 'right' });
		app.Tooltip.add(this._bhattan1, 'Minimize the layer menu', { extends : 'systyle', tipJoint : 'left' });		

		// Store when the pane is open/closed ~ so that the legends container width can be calculated
		this._open = true;


		if ( Wu.app.mobile ) {
			// this._content.style.left = Wu.app.nativeResolution[1] + 'px';
			// this._isClosed = true;

			// Mobile arrow	
		    	Wu.DomUtil.create('div', 'layers-mobile-arrow', this._innerContainer);

		}


	},

	show : function () {
		Wu.DomUtil.removeClass(this._container, 'displayNone');
	},

	hide : function () {
		Wu.DomUtil.addClass(this._container, 'displayNone');
	},

	// Runs on window resize. Gets called up in app.js
	resizeEvent : function (dimensions) {
		
		// Window max height (minus padding)
		var layersMaxHeight = dimensions.height - 135;

		// Set max height of Layers selector container
		this.setMaxHeight(layersMaxHeight);

	},

	setMaxHeight : function (layersMaxHeight) {

		// Make space for inspect control, if it's there, yo
		var inspectControl = app.MapPane.inspectControl;
		if ( inspectControl ) layersMaxHeight -= 120;

		// Set max height of scroller container
		this._layermenuOuter.style.maxHeight = layersMaxHeight + 'px';

	},	

	cancelEditClose : function () {
		if (!this.editMode) return;

		// cancel close initiated from sidepane layermeny mouseleave
		var timer = app.SidePane.Map.mapSettings.layermenu.closeEditTimer;
		clearTimeout(timer);
		setTimeout(function () {  // bit hacky, but due to 300ms _close delay in sidepane
			var timer = app.SidePane.Map.mapSettings.layermenu.closeEditTimer;
			clearTimeout(timer);
		}, 301);
	},

	timedEditClose : function () {
		if (!this.editMode) return;

		// close after three seconds after mouseleave
		var that = this;
		var timer = app.SidePane.Map.mapSettings.layermenu.closeEditTimer = setTimeout(function () {
			that.disableEdit();
		}, 3000);
	},



	toggleLayerPane : function () {
		this._open ? this.closeLayerPane() : this.openLayerPane();
	},


	// (j)
	closeLayerPane : function () {

		this._open = false;

		// Collapse Wrapper
		app._map._controlCorners.bottomright.style.width = '0px';

		Wu.DomUtil.removeClass(this._openLayers, 'ol-collapsed');
		

		// Slide the LEGENDS
		if ( app.MapPane.inspectControl ) {
			if (this._legendsContainer) Wu.DomUtil.removeClass(this._legendsContainer, 'legends-padding-right'); // rem (j)
		}	
		// Measure, plus Long & Lat (.leaflet-top.leaflet-right)                
		app._map._controlCorners.topright.style.right = '140px';
		

	
	},

	// (j)
	openLayerPane : function () {

		this._open = true;

		// Open Wrapper
		app._map._controlCorners.bottomright.style.width = '290px';

		// Close the closer :P
		Wu.DomUtil.addClass(this._openLayers, 'ol-collapsed');
		
		// Slide the LEGENDS
		if ( app.MapPane.inspectControl ) {
			if ( this._legendsContainer ) Wu.DomUtil.addClass(this._legendsContainer, 'legends-padding-right'); // rem (j)
		}
		
		// Measure, plus Long & Lat (.leaflet-top.leaflet-right)                
		app._map._controlCorners.topright.style.right = '295px';                
		

		// If we're on mobile
		if ( Wu.app.mobile ) {

			// Check if legends is open ~ close it when opening layer menu
			if ( app.MapPane.legendsControl._isOpen ) app.MapPane.legendsControl.MobileCloseLegends();
			if ( !app.MapPane.descriptionControl._isClosed ) app.MapPane.descriptionControl.mobileClosePane();

		}

	},


	// enter edit mode of layermenu
	enableEdit : function () {

		if (this.editMode) return;

		// set editMode
		this.editMode = true;

		// turn off dragging etc. on map
		Wu.app.MapPane.disableInteraction(true);

		// turn off dropzone dragging
		if (app.Dropzone) app.Dropzone.disable();
		
		// enable drag'n drop in layermenu
		this.enableSortable();

		// set title
		this._layerMenuHeaderTitle.innerHTML = 'Edit Layer Menu';  

		// add edit style
		Wu.DomUtil.addClass(this._innerContainer, 'edit-mode');

		// add the drag'n drop new folder
		this._insertMenuFolder();

		// show edit buttons for menu items
		// this._showEditButtons();

		// open all items in layermenu
		this.openAll();

	},


	// exit edit mode 
	disableEdit : function () {

		if (!this.editMode) return;

		// set editMode
		this.editMode = false;
		
		// re-enable dragging etc. on map
		Wu.app.MapPane.enableInteraction(true);

		// turn off dropzone dragging
		if (app.Dropzone) app.Dropzone.enable();
		
		// disable layermenu sorting
		this.disableSortable();

		// set title
		this._layerMenuHeaderTitle.innerHTML = 'Layers';  

		// remove edit style
		Wu.DomUtil.removeClass(this._innerContainer, 'edit-mode');

		// remove new drag'n drop folder
		this._removeMenuFolder();

		
	},

	

	_insertMenuFolder : function () {
		
		// add menu folder item
		if (!this._menuFolder) {

			// create if not exists
			this._menuFolder = Wu.DomUtil.create('div', 'smap-button-white middle-item ct12 ct18', this._innerContainer, 'Add folder');

			// insert
			this._layerMenuHeader.parentNode.insertBefore(this._menuFolder, this._layerMenuHeader.nextSibling);

			// add action
			Wu.DomEvent.on(this._menuFolder, 'click', this.addMenuFolder, this);

		} else {
			// show
			Wu.DomUtil.removeClass(this._menuFolder, 'displayNone');
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
		this.resetSortable();
	},

	refreshSortable : function () {
		this.resetSortable();  
		this.initSortable();
	},

	initSortable : function () {
	
		// iterate over all layers
		var items = document.getElementsByClassName('layer-menu-item-wrap');
		for (var i = 0; i < items.length; i++) {
			var el = items[i];
			
			// set attrs
			el.setAttribute('draggable', 'true');
			
			// set dragstart event
			Wu.DomEvent.on(el, 'dragstart', this.drag.start, this);
		};

		// set hooks
		var bin = Wu.DomUtil.get('layer-menu-inner-content');
		if (bin) {
			Wu.DomEvent.on(bin, 'dragover',  this.drag.over,  this);
			Wu.DomEvent.on(bin, 'dragleave', this.drag.leave, this);
			Wu.DomEvent.on(bin, 'drop', 	 this.drag.drop,  this);
		} 


	},

	resetSortable : function () {

		// remove hooks
		var bin = Wu.DomUtil.get('layer-menu-inner-content');
		if (!bin) return;
		
		Wu.DomEvent.off(bin, 'dragover',  this.drag.over,  this);
		Wu.DomEvent.off(bin, 'dragleave', this.drag.leave, this);
		Wu.DomEvent.off(bin, 'drop', 	  this.drag.drop,  this);
	
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
			var oldIndex = _.findIndex(this.project.store.layermenu, {uuid : uuid});
			
			// move in layermenu array
			this.project.store.layermenu.move(oldIndex, newIndex);

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
		console.log('markInvalid!!', invalids);

		invalids.forEach(function (invalid) {

			// get div
			var div = this.layers[invalid.uuid].el;
			Wu.DomUtil.addClass(div, 'invalidLayermenuitem');


		}, this)
	},

	clearInvalid : function () {
		console.log('clearInvalid!');
		for (l in this.layers) {
			var layer = this.layers[l];
			Wu.DomUtil.removeClass(layer.el, 'invalidLayermenuitem');
		}
	},


	// check logic
	checkLogic : function () {

		// clear prev invalids
		this.clearInvalid();

		// vars
		var array = this.project.store.layermenu;
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
		var array = this.project.store.layermenu;
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
	},


	closeAll : function () {
		this.updateLogic();
		for (l in this._logic) {
			var item = this.layers[l];
			this._logic[l].isOpen = true;
			this.enforceLogic(item);
		}
	},

	openAll : function () {
		this.updateLogic();
		for (l in this._logic) {
			var item = this.layers[l];
			this._logic[l].isOpen = false;
			this.enforceLogic(item);
		}
	},

	// open/close subfolders
	toggleFolder : function (layerItem) {
		this.updateLogic();	
		this.enforceLogic(layerItem);
	},

	toggleLayer : function (item) {
		if (this.editMode) return;

		// toggle
		if (item.on) {
			this.disableLayer(item);
		} else {
			this.enableLayer(item);
		}       
	},

	_enableLayer : function (layerUuid) {

		// get layerItem
		var layerItem = _.find(this.layers, function (l) {
			return l.item.layer == layerUuid;
		});
	
		// mark active
		Wu.DomUtil.addClass(layerItem.el, 'layer-active');
		layerItem.on = true;

	},
		
	enableLayer : function (layerItem) {

		var layer = layerItem.layer;

		// folder click
		if (!layer) return this.toggleFolder(layerItem); 
			
		// add layer to map
		layer.add();
		layerItem.on = true;


		// add active class
		Wu.DomUtil.addClass(layerItem.el, 'layer-active');

	},

	// disable by layermenuItem
	disableLayer : function (layermenuItem) {

		var layer = layermenuItem.layer;
		if (!layer) return;

		this._disableLayer(layer);
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

		// set inactive in sidepane layermenu
		if (layermenuItem.layer) app.SidePane.Map.mapSettings.layermenu._off(layermenuItem.layer);

		// remove layer from map
		var layer = layermenuItem.layer;
		if (layer) layer.remove();

		// remove from store
		delete this.layers[uuid];

		// remove from layermenu
		_.remove(this.project.store.layermenu, function (item) { return item.uuid == uuid; });

		// save
		this.save();

		// update Options pane
		var baseLayer = app.SidePane.Map.mapSettings.baselayer;
		var layerMenu = app.SidePane.Map.mapSettings.layermenu;
		if (baseLayer) baseLayer.markOccupied();
		if (layerMenu) layerMenu.markOccupied();

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
		this.project.store.layermenu.push(item);
		this.save();

	},

	_add : function (layerItem) {		

		var item  = layerItem.item;
		var layer = layerItem.layer;

		// create div
		var className   = 'layer-menu-item-wrap';
		if (!layer) className += ' menufolder';
		var wrap 	= Wu.DomUtil.create('div', className);
		var uuid 	= item.uuid;
		wrap.innerHTML 	= ich.layerMenuItem(item);
		wrap.id 	= uuid;
		Wu.DomUtil.addClass(wrap, 'level-' + item.pos);
		wrap.setAttribute('draggable', true); 	// mark as draggable
		this._content.appendChild(wrap); 	// append to layermenu

		// get elems
		var up    = wrap.children[0];
		var down  = wrap.children[1];
		var del   = wrap.children[2];
		var inner = wrap.children[3];

		// add hooks
		Wu.DomEvent.on(up,   'click', function (e) { this.upFolder(uuid); 	  }, this);
		Wu.DomEvent.on(down, 'click', function (e) { this.downFolder(uuid); 	  }, this);
		Wu.DomEvent.on(del,  'click', function (e) { this.deleteMenuFolder(uuid); }, this);
		Wu.DomEvent.on(inner, 'dblclick', function (e) { this._editFolderTitle(uuid); },this);

		// prevent layer activation
		Wu.DomEvent.on(up,   'mousedown', Wu.DomEvent.stop, this);
		Wu.DomEvent.on(down, 'mousedown', Wu.DomEvent.stop, this);
		Wu.DomEvent.on(del,  'mousedown', Wu.DomEvent.stop, this);

		// Stop Propagation
		Wu.DomEvent.on(this._container, 'touchstart mousedown click dblclick',  Wu.DomEvent.stopPropagation, this);

		// add elem to item object
		layerItem.el = wrap;

		// add hooks // pass item object to toggle
		Wu.DomEvent.on(wrap, 'mousedown', function (e) { this.toggleLayer(layerItem); }, this);
		Wu.DomEvent.on(this._innerContainer, 'dblclick', Wu.DomEvent.stop, this);

		// refresh sorting
		this.refreshSortable();

		// add to local store
		this.layers[item.uuid] = layerItem;

	},


	getLayers : function () {
		return this.layers;
	},
	
	_fill : function () {

		// return if empty layermenu
		if (!this.project.store.layermenu) return;

		// iterate layermenu array and fill in to layermenu
		this.project.store.layermenu.forEach(function (item) {

			// get wu layer
			var layer = _.find(this.project.layers, function (l) { return l.store.uuid == item.layer; });

			var layerItem = {
				item : item,
				layer : layer
			}

			// add to layermenu
			this._add(layerItem);

		}, this);
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
		this.project.store.layermenu.push(folder);
		this.save();

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
			var i = _.findIndex(this.project.store.layermenu, {'uuid' : uuid});
			this.project.store.layermenu[i].caption = newTitle;
			this.save();

			// boolean
			this.currentlyEditing = false;

		}, this);

		// add keyp hooks
		Wu.DomEvent.on(input, 'keydown', function (e) {
			if (event.which == 13 || event.keyCode == 13) input.blur(); // enter
			if (event.which == 27 || event.keyCode == 27) input.blur(); // esc
		}, this);

	},


	upFolder : function (uuid) {

		// get element
		var wrap = this.layers[uuid].el;

		// get current x pos
		var i   = _.findIndex(this.project.store.layermenu, {'uuid' : uuid});
		var pos = parseInt(this.project.store.layermenu[i].pos);

		// set new pos
		var newpos = pos + 1;
		this.project.store.layermenu[i].pos = newpos;

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
		var i   = _.findIndex(this.project.store.layermenu, {'uuid' : uuid});
		var pos = parseInt(this.project.store.layermenu[i].pos);

		// set new pos
		var newpos = pos - 1;
		this.project.store.layermenu[i].pos = newpos;

		// add class
		Wu.DomUtil.addClass(wrap, 'level-' + newpos);
		Wu.DomUtil.removeClass(wrap, 'level-' + pos);

		// save
		this.save();

	},

	deleteMenuFolder : function (uuid) {
		// remove
		this.remove(uuid); // layerMenuItem-32132-123123-adsdsa-sda
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
			that.project._update('layermenu');
		}, 1000);       // don't save more than every goddamed second

	},

	update : function (project) {

		// get vars
		this.project  = project || Wu.app.activeProject;
		this._content = Wu.DomUtil.get('layer-menu-inner-content');
		this.layers   = {};
		
		// create layermenu
		this._fill();

		// close by default
		this.closeAll();

		// prevent map scrollzoom
		var map = app._map;
		Wu.DomEvent.on(this._container, 'mouseenter', function () {
		   map.scrollWheelZoom.disable();
		}, this);

		Wu.DomEvent.on(this._container, 'mouseleave', function () {
		    map.scrollWheelZoom.enable();
		}, this);


		// Get the scrol-container that we will set max height value of
		this._layermenuOuter = Wu.DomUtil.get('layermenu-outer');

		// Check window height
		var layersMaxHeight = window.innerHeight - 135;

		// Set max height of Layers selector container
		this.setMaxHeight(layersMaxHeight);
	
	}
	
});


L.control.layermenu = function (options) {
	return new L.Control.Layermenu(options);
};;L.Control.Inspect = L.Control.extend({
	
	options: {
		position : 'bottomright',
		draggable : true
	},

	onAdd : function (map) {

		var className = 'leaflet-control-inspect ct14',
		    container = L.DomUtil.create('div', className),
		    options   = this.options;

		// add html
		container.innerHTML = ich.inspectControl(); 

		// add tooltip
		app.Tooltip.add(container, 'Shows a list of active layers', { extends : 'systyle', tipJoint : 'top left'});

		// content is not ready yet, cause not added to map! 
		return container; 

	},

	addTo: function (map) {
		this._map = map;
		var container = this._container = this.onAdd(map),
		    pos = this.getPosition(),
		    corner = map._controlCorners[pos];

		// add class and append to control corner
		L.DomUtil.addClass(container, 'leaflet-control');
		corner.appendChild(container);

		// stop
		Wu.DomEvent.on(container, 'mousedown click dblclick', Wu.DomEvent.stop, this);

		return this;
	},

	show : function () {
		Wu.DomUtil.removeClass(this._container, 'displayNone');
	},

	hide : function () {
		Wu.DomUtil.addClass(this._container, 'displayNone');
	},

	update : function (project) {
		// on project refresh + added control

		// get vars
		this.project  = project || app.activeProject;
		this._content = Wu.DomUtil.get('inspect-control-inner-content'); 
		this._list    = Wu.DomUtil.get('inspector-list');

		// reset layers
		this.layers = [];           

		// prevent scroll
		this.disableScrollzoom();

		// get zindexControl
		this._zx = app.MapPane.getZIndexControls().l; // layermenu zindex control 

	        // add active layers
	        this._addAlreadyActiveLayers();

	},

	_addAlreadyActiveLayers : function () {
		var active = app.MapPane.getActiveLayers();
		active.forEach(function (layer) {
			// add layermenu layers
			if (!layer._isBase) this.addLayer(layer);
		}, this);
	},

	disableScrollzoom : function () {

		// reset events
		this.resetScrollzoom();

		// prevent map scrollzoom
                var map = app._map;
                Wu.DomEvent.on(this._container, 'mouseenter', function () { map.scrollWheelZoom.disable(); }, this);
                Wu.DomEvent.on(this._container, 'mouseleave', function () { map.scrollWheelZoom.enable();  }, this); 
 		
	},

	resetScrollzoom : function () {

		// reset map scrollzoom
                var map = app._map;
                Wu.DomEvent.off(this._container, 'mouseenter', function () { map.scrollWheelZoom.disable(); }, this);
                Wu.DomEvent.off(this._container, 'mouseleave', function () { map.scrollWheelZoom.enable();  }, this); 
	},


	// currently called from layers.js:63 .. refactor.. dont chain, do modules, event emitters
	addLayer : function (layer) {

		// Make sure that the layer inspector is visible
		this._content.style.display = 'block';

		// create divs
		var wrapper 	= Wu.DomUtil.create('div', 'inspect-layer');
		var arrowsWrap 	= Wu.DomUtil.create('div', 'inspect-arrows-wrap', wrapper);
		var upArrow 	= Wu.DomUtil.create('div', 'inspect-arrow-up', arrowsWrap);
		var downArrow 	= Wu.DomUtil.create('div', 'inspect-arrow-down', arrowsWrap);
		var text 	= Wu.DomUtil.create('div', 'inspect-text', wrapper, layer.store.title);
		var fly 	= Wu.DomUtil.create('div', 'inspect-fly', wrapper);
		var eye 	= Wu.DomUtil.create('div', 'inspect-eye', wrapper);
		var kill 	= Wu.DomUtil.create('div', 'inspect-kill', wrapper);

		// add tooltip
		app.Tooltip.add(arrowsWrap, 'Arrange layer order', { extends : 'systyle', tipJoint : 'right', group : 'inspect-control'});
		app.Tooltip.add(fly, 'Zoom to layer extent', { extends : 'systyle', tipJoint : 'bottom left', group : 'inspect-control'});
		app.Tooltip.add(eye, 'Isolate layer', { extends : 'systyle', tipJoint : 'bottom left', group : 'inspect-control'});
		app.Tooltip.add(kill, 'Disable layer', { extends : 'systyle', tipJoint : 'bottom left', group : 'inspect-control'});

		// add to list
		this._list.insertBefore(wrapper, this._list.firstChild);

		// create object
		var entry = {
			wrapper   : wrapper,
			upArrow   : upArrow,
			downArrow : downArrow,
			text 	  : text,
			eye 	  : eye,
			kill 	  : kill,
			layer     : layer,
			uuid      : layer.store.uuid,
			isolated  : false
		}

		// add object to front of array
		this.layers.unshift(entry);

		// add stops
		Wu.DomEvent.on(upArrow,   'dblclick click', function (e) { Wu.DomEvent.stop(e); this.moveUp(entry);   	 }, this);
		Wu.DomEvent.on(downArrow, 'dblclick click', function (e) { Wu.DomEvent.stop(e); this.moveDown(entry); 	 }, this);
		Wu.DomEvent.on(fly, 	  'dblclick click', function (e) { Wu.DomEvent.stop(e); this.flyTo(entry);	 }, this);
		Wu.DomEvent.on(eye, 	  'dblclick click', function (e) { Wu.DomEvent.stop(e); this.isolateToggle(entry);}, this);
		Wu.DomEvent.on(kill, 	  'dblclick click', function (e) { Wu.DomEvent.stop(e); this.killLayer(entry);	 }, this);
		Wu.DomEvent.on(text, 	  'dblclick click', function (e) { Wu.DomEvent.stop(e); this.select(entry);	 }, this);
		// Wu.DomEvent.on(wrapper,   'mousedown dblclick click',  	   Wu.DomEvent.stop, 				    this);		

		// make draggable
		if (this.options.draggable) this._makeSortable(entry);

	},



	_makeSortable : function (entry) {

		var el = entry.wrapper;
		
		// drag start
		Wu.DomEvent.on(el, 'mousedown', function (e) {
			entry.e = e;
			this._dragStart(entry);
		}, this);
		
		// init
		this._initSortable();

	},

	_initSortable : function () {
		if (this._initedSortable) return;
		this._initedSortable = true;

		// hooks
		Wu.DomEvent.on(document, 'mousemove', this._dragMove, this);
		Wu.DomEvent.on(document, 'mouseup', this._dragStop, this);
	},


	_dragStart : function (entry) {

		this._dragging = entry;
		this._n = 1;
		this._m = 1;
		this._md = 0;
		var div = entry.wrapper;

	},

	_dragMove : function (e) {
		if (!this._dragging) return;

		var d = this._dragging,
		    md = this._md,
		    movedY = e.y - d.e.y,
		    div = d.wrapper,
		    n = this._n,
		    m = this._m,
		    k = 18; // how many px to move bf trigger

		// accumulate movement
		this._md += e.movementY;

		// move up/down
		if (md < -k) this._moveUp(movedY);
		if (md >  k) this._moveDown(movedY);
		
		// add dragging class
		if (!this._dragClassAdded) L.DomUtil.addClass(div, 'dragging');
	},

	_dragStop : function (e) {
		if (!this._dragging) return;

		// do something
		var div = this._dragging.wrapper;
		L.DomUtil.removeClass(div, 'dragging');

		this._dragClassAdded = false;;
		this._dragging = false;
	},	

	_moveUp : function () {		// todo: doesn't work as well going up then back down
		var d = this._dragging,
		    div = d.wrapper,
		    prev = div.previousSibling,
		    layer = this._dragging.layer;

		if (!prev) return;

		// move div in dom
		prev.parentNode.insertBefore(div, prev);

		// move up in zindex
		this._zx.up(layer);

		// reset dragging y count
		this._md = 0;
	},

	_moveDown : function () {

		var d = this._dragging,
		    div = d.wrapper,
		    next = div.nextSibling,
		    layer = this._dragging.layer;

		if (!next) return;

		// move div in dom
		next.parentNode.insertBefore(div, next.nextSibling);

		// move up in zindex
		this._zx.down(layer);

		// reset dragging y count
		this._md = 0;
	},


	// remove by layer
	removeLayer : function (layer) {

		// find entry in array
		var entry = _.find(this.layers, function (l) { return l.uuid == layer.store.uuid; })

		// remove
		this._removeLayer(entry);

		// Hide Layer inspector if it's empty
		if ( this.layers.length == 0 ) this._content.style.display = 'none';
		

	},

	// remove by entry
	_removeLayer : function (entry) {

		if (!entry) return;

		// remove from DOM
		Wu.DomUtil.remove(entry.wrapper);

		// remove from array
		_.remove(this.layers, function (l) { return l.uuid == entry.uuid; });

		// Hise Layer inspector if it's empty
		if ( this.layers.length == 0 ) this._content.style.display = 'none';


	},

	moveUp : function (entry) {

		var d = entry,
		    div = d.wrapper,
		    prev = div.previousSibling,
		    layer = d.layer;

		if (!prev) return;

		// move div in dom
		prev.parentNode.insertBefore(div, prev);

		// move up in zindex
		this._zx.up(layer);

	},

	moveDown : function (entry) {

		var d = entry,
		    div = d.wrapper,
		    next = div.nextSibling,
		    layer = d.layer;

		if (!next) return;

		// move div in dom
		next.parentNode.insertBefore(div, next.nextSibling);

		// move up in zindex
		this._zx.down(layer);
		
	},

	
	flyTo : function (entry) {

		var layer = entry.layer;
		if (!layer) return;

		var extent = layer.getMeta().extent;
		if (!extent) return;

		var southWest = L.latLng(extent[1], extent[0]),
		    northEast = L.latLng(extent[3], extent[2]),
		    bounds = L.latLngBounds(southWest, northEast);

		// fly
		var map = app._map;
		map.fitBounds(bounds);

	},

	isolateToggle : function (entry) {
		if (entry.isolated) {

			// deisolate layer
			entry.isolated = false;
			this.isolateLayers();

			// remove class from eye
			Wu.DomUtil.removeClass(entry.eye, 'inspecting');
		} else {

			// isolate layer
			entry.isolated = true;
			this.isolateLayers();

			// add class to eye
			Wu.DomUtil.addClass(entry.eye, 'inspecting');
		}
	},

	_noneAreIsolated : function () {
		var any = _.filter(this.layers, function (entry) { return entry.isolated == true; });
		if (!any.length) return true;
		return false;
	},

	isolateLayers : function () {

		// check if all is isolated.false .. if so, dont hide but show all.
		if (this._noneAreIsolated()) {
			this.layers.forEach(function (n) {
				n.layer.show();
			}, this);
			return;
		}

		// else, isolate relevant layers
		this.layers.forEach(function (n) {
			if (!n.isolated) {
				n.layer.hide();
			} else {
				n.layer.show();
			}
		}, this);

		
	},

	killLayer : function (entry) {

		// remove from inspectControl
		this._removeLayer(entry);

		// set inactive in layermenuControl
		var layermenuControl = app.MapPane.layerMenu;
		if (layermenuControl) layermenuControl._disableLayer(entry.layer);

		// remove from legendsControl if available
		var legendsControl = app.MapPane.legendsControl;
		if (legendsControl) legendsControl.removeLegend(entry.layer);

		// remove from descriptionControl if avaialbe
		var descriptionControl = app.MapPane.descriptionControl;
		if (descriptionControl) descriptionControl.removeLayer(entry.layer);	

		// Hise Layer inspector if it's empty
		if (!this.layers.length) this._content.style.display = 'none';

	},

	
	select : function (entry) {

		// set text in descriptionControl
		var descriptionControl = app.MapPane.descriptionControl;
		if (descriptionControl) descriptionControl.setLayer(entry.layer);

		// set currently active entry
		this.activeEntry = entry;

	},

	getListPosition : function () {
		console.log('getPosition');
		console.log('index: ', this._zx.getIndex());
		console.log('list: ', this._list);


	},

	setListPosition : function (position, layer) {


	},



});


L.control.inspect = function (options) {
	return new L.Control.Inspect(options);
};;L.Control.Description = L.Control.extend({
	
	options: {
		// position : 'topleft' 
		position : 'bottomright' 
	},

	onAdd : function (map) {

		var className = 'leaflet-control-description',
		    container = L.DomUtil.create('div', className),
		    options   = this.options;

		// add html
		container.innerHTML = ich.descriptionControl(); 

		return container; // turns into this._container on return

	},

	initContainer : function () {                
		
		// hide by default
		this._container.style.display = "none";

		// get panes
		this._content 	= Wu.DomUtil.get('description-control-inner-content');
		this._outer     = Wu.DomUtil.get('description-control-inner-content-box'); 
		this._button	= Wu.DomUtil.get('description-toggle-button'); 
		this._legendsContainer = Wu.DomUtil.get('legends-control-inner-content');
		this._legendsCollapser = Wu.DomUtil.get('legends-collapser');
		
		// create scroller 
		this._inner = Wu.DomUtil.create('div', 'description-scroller', this._outer);
		
		// add tooltip
		app.Tooltip.add(this._container, 'Shows layer information', { extends : 'systyle', tipJoint : 'left' });
			       
		// If mobile: start closed info/description pane
		if ( Wu.app.mobile ) {
			this._content.style.left = Wu.app.nativeResolution[1] + 'px';
			this._isClosed = true;

			// Mobile arrow	
		    	Wu.DomUtil.create('div', 'description-mobile-arrow', this._content);
			
		}

	},      

	setDescription : function (layer) {

		this._inner.innerHTML = layer.store.description;
	},

	show : function () {
		this._container.style.display = 'block'; 
	},

	hide : function () {
		this._container.style.display = 'none'; 
	},

	// clear content
	clear : function () {
		this.activeLayer = false;
		this._inner.innerHTML = '';
	},

	setActiveLayer : function (layer) {
		this.setLayer(layer);
	},

	setLayer : function (layer) {
		this.activeLayer = layer;
		this.setDescription(layer);

		if ( !layer.store.description && !this.editMode) {
			this.closePane();
			this.clear();
		} 

	},

	removeLayer : function (layer) {
		if (this.activeLayer == layer) this.clear();
	},

	update : function (project) {

		// get vars
		this.project = project || Wu.app.activeProject;

		// set editMode
		this.editMode = this.project.editMode;
		this.editing = false;
		this.activeLayer = false;

		// refresh container        
		this.initContainer();

		// add hooks
		this.addHooks();

		// clear
		this.clear();

	},  

	addHooks : function () {
		
		// collapsers
		// Wu.DomEvent.on(this._button, 'click', this.closePane, this);
		Wu.DomEvent.on(this._button, 'click', this.toggleCloser, this);

		// edit mode
		if (this.editMode) Wu.DomEvent.on(this._outer, 'dblclick', this.toggleEdit, this);

		// prevent map double clicks
		Wu.DomEvent.on(this._container, 'mousedown click dblclick',  Wu.DomEvent.stopPropagation, this);
		Wu.DomEvent.on(this._button,    'mousedown mouseup click dblclick',  Wu.DomEvent.stopPropagation, this);


	},
	
	removeHooks : function () {

		// collapsers
		Wu.DomEvent.off(this._button, 'click', this.closePane, this);

		// edit mode
		if (this.editMode) Wu.DomEvent.off(this._inner, 'dblclick', this.toggleEdit, this);

		// prevent map double clicks
		Wu.DomEvent.off(this._container, 'dblclick', Wu.DomEvent.stop, this);
		Wu.DomEvent.off(this._container, 'dblclick', Wu.DomEvent.stop, this);
		Wu.DomEvent.off(this._container, 'mousedown click dblclick',  Wu.DomEvent.stopPropagation, this);
		Wu.DomEvent.off(this._button,    'mousedown mouseup click dblclick',  Wu.DomEvent.stopPropagation, this);

	},

	toggleEdit : function () {

		console.log('toggleEdit', this.editing);

		// return if already editing
		if (this.editing) return;
		
		// turn on editing
		this.editOn();

	},
	
	editOn : function () {

		console.log('editOn', this.activeLayer);

		if (!this.activeLayer) return;

		this.editing = true;

		// bind text editor
		this.addGrande();

		// disable dragging
		app._map.dragging.disable();

		// add class to info box to indicate editMode
		Wu.DomUtil.addClass(this._inner, 'description-editing');

		// bind keys
		Wu.DomEvent.on(this._inner, 'keydown', this.keyDown, this);

		// prevent map scrollzoom
		var map = app._map;
		map.scrollWheelZoom.disable();
		
	},	

	keyDown : function (e) {
		if (e.keyCode == 27 || e.keyCode == 9) {
			this.editOff();
		}
	},

	editOff : function () {
		this.editing = false;

		// hide grande
		this.removeGrande();

		// re-enable dragging
		app._map.dragging.enable();

		// add class to info box to indicate editMode
		Wu.DomUtil.removeClass(this._inner, 'description-editing');

		// blur
		this._inner.setAttribute('contenteditable', "false");

		// prevent map scrollzoom
		var map = app._map;
		map.scrollWheelZoom.enable();

		// save text
		if (this.activeLayer) {
			var text = this._inner.innerHTML;			
			this.activeLayer.store.description = text;
			this.activeLayer.save('description');

			// set status
			app.setSaveStatus();
		}

	},

	textChange : function (editing) {
		if (!editing) this.editOff();
	},

	removeGrande : function () {
		if (!this.grande) return;
		this.grande.destroy();
		delete this.grande;	
	},

	addGrande : function () {

		// get textarea node for grande
		var nodes = this._inner;

		// get sources
		var files = this.project.getFiles();
		var sources = this.project.getGrandeFiles();
		var images = this.project.getGrandeImages();

		// set grande options
		var options = {
			plugins : {

		        	// file attachments
			        attachments : new G.Attachments(sources, {
			        	icon : [app.options.servers.portal + 'images/image-c9471cb2-7e0e-417d-a048-2ac501e7e96f',
			        		app.options.servers.portal + 'images/image-7b7cc7e4-404f-4e29-9d7d-11f0f24faf42'],
			        	className : 'attachment'
			        }),

			        // image attachments
			        images :  new G.Attachments(images, {
			        	icon : [app.options.servers.portal + 'images/image-0359b349-6312-4fe5-b5d7-346a7a0d3c38',
			        		app.options.servers.portal + 'images/image-087ef5f5-b838-48bb-901f-7e896de7c59e'],
			        	embedImage : true,			// embed image in text! 
			        	className : 'image-attachment'
			        }),

			},
			events : {

				// add change event listener
				change : this.textChange.bind(this)
			}
		}

		// create Grande with attachment and image plugin
		this.grande = G.rande(nodes, options);

	},

	// For Mobile Phones
	toggleCloser : function () {

		// Close pane if we're on a desktop / pad
		if ( !Wu.app.mobile ) {
			this.closePane();
		
		// Slide pane if we're on a mobile phone
		} else {
			this._isClosed ? this.mobileOpenPane() : this.mobileClosePane();
		}

	},

	mobileOpenPane : function () {

		Wu.DomUtil.addClass(this._button, 'active-description');

		// Slide In
		this._content.style.left = '0px';
		this._isClosed = false;

		// Close other panes if they are open
		if ( app.MapPane.legendsControl._isOpen ) app.MapPane.legendsControl.MobileCloseLegends();
		if ( app.MapPane.layerMenu._open ) app.MapPane.layerMenu.closeLayerPane();


	},


	mobileClosePane : function () {

		Wu.DomUtil.removeClass(this._button, 'active-description');

		// Slide out (only works in portrait format... in landscape it has to be [0] )
		this._content.style.left = Wu.app.nativeResolution[1] + 'px';
		this._isClosed = true;
	},

	closePane : function () {
		this._container.style.display = "none";
		this._isClosed = true;
	},
	
	openPane : function () {
		this._container.style.display = "block";
		this._isClosed = false;			
	}
	
});


L.control.description = function (options) {
	return new L.Control.Description(options);
};;L.Control.Legends = L.Control.extend({
	
	options: {
		position : 'bottomleft' 
	},

	_isOpen : false,

	// automatically run when legends is added to map 
	onAdd : function (map) {

		var className = 'leaflet-control-legends',
		    container = L.DomUtil.create('div', className),
		    options = this.options;

		// add html
		container.style.display = 'none';
		container.innerHTML = ich.legendsControl(); 	     


		return container;

	},

	addHooks : function () {

		Wu.DomEvent.on(this._legendsCollapser, 'click', this.closeLegends, this);
		Wu.DomEvent.on(this._legendsOpener, 'click', this.toggleOpen, this);

		// prevent map scrollzoom (OOOBS! BLOCKS ALL SCROLLING)
		Wu.DomEvent.on(this._container, 'mousewheel', Wu.DomEvent.stop, this);

		// Scrollers By (j) 
		Wu.DomEvent.on(this._legendsScrollLeft, 'click', this.legendsScrollLeft, this);
		Wu.DomEvent.on(this._legendsScrollRight, 'click', this.legendsScrollRight, this);

		// prevent doubleclick
		Wu.DomEvent.on(this._container, 'dblclick', Wu.DomEvent.stop, this);

		// Stop Propagation
		Wu.DomEvent.on(this._container, 'mousedown click dblclick',  Wu.DomEvent.stopPropagation, this);
		Wu.DomEvent.on(this._legendsCollapser, 'mousedown click dblclick',  Wu.DomEvent.stopPropagation, this);
	
	},

	checkWidth : function() {

		// Check window width
		var legendsMaxWidth = window.innerWidth;

		// Set max width of legends
		this.setMaxWidth(legendsMaxWidth)

	},	

	show : function () {

		Wu.DomUtil.removeClass(this._container, 'displayNone');
	},

	hide : function () {

		Wu.DomUtil.addClass(this._container, 'displayNone');
	},

	// Runs on window resize (from app.js)
	resizeEvent : function (dimensions) {

		// Check window width
		var legendsMaxWidth = dimensions.width;

		// Set max width of legends
		this.setMaxWidth(legendsMaxWidth)

	},

	setMaxWidth : function (legendsMaxWidth) {

		// Check if the layer meny and end layer inspectors are there
		var inspectControl = app.MapPane.inspectControl;
		var layermenuControl = app.MapPane.layerMenu;

		// Is there a layer inspector, and is the pane open?
		if (inspectControl && layermenuControl._open ) legendsMaxWidth -= 300;

		// Set max width of legends container
		this._container.style.maxWidth = legendsMaxWidth + 'px';

		// Figure out if we need the scrollers or not
		if ( this.sliderWidth > legendsMaxWidth ) {
			this.showScrollers() 
		} else {
			this.hideScrollers();	
		} 

	},

	showScrollers : function () {
		this._legendsScrollLeft.style.display = 'block';
		this._legendsScrollRight.style.display = 'block';
	}, 

	hideScrollers : function () {
		this._legendsScrollLeft.style.display = 'none';
		this._legendsScrollRight.style.display = 'none';
	},



	// Needed for Mobile phones
	toggleOpen : function(e) {

		// Open / Close Legends for desktop and pad
		if ( !Wu.app.mobile ) this._isOpen ? this.closeLegends() : this.openLegends();
		
		// Open / Close Legends for mobile phones
		else this._isOpen ? this.MobileCloseLegends() : this.MobileOpenLegends();

	},

	MobileCloseLegends : function(e) {
		Wu.DomUtil.removeClass(this._legendsOpener, 'legends-open');
		this._content.style.left = Wu.app.nativeResolution[1] + 'px';
		this._setClosed();
	},

	MobileOpenLegends : function(e) {

		// Close layer menu if it's open
		if ( app.MapPane.layerMenu._open ) app.MapPane.layerMenu.closeLayerPane();
		if ( !app.MapPane.descriptionControl._isClosed ) app.MapPane.descriptionControl.mobileClosePane();

		Wu.DomUtil.addClass(this._legendsOpener, 'legends-open');
		this._content.style.left = '0px';
		this._setOpen();
	},



	closeLegends : function () {

		this._legendsOpener.style.display = 'block';	
		this._legendsInner.style.width = this._legendsWidth + 'px';
		this._legendsInner.style.height = this._legendsHeight + 'px';

		var that = this;
		setTimeout(function() {
			that._legendsOpener.style.opacity = '1';
			that._legendsInner.style.width = '150px';
			that._legendsInner.style.height = '24px'; 
			that._legendsScrollLeft.style.display = 'none';
			that._legendsScrollRight.style.display = 'none';
		}, 10);

		setTimeout(function() {
			that._legendsCollapser.style.opacity = '0'; 
			this._openWidth = 0;
			this._openHeight = 0;
			this._legendsWidth = 0;
			this._legendsHeight = 0;
		}, 500);

		this._setClosed();

	},

	// // open if any legends only (for phantomJS)
	// _openLegends : function () {
	// 	console.log('_openLe§!!', this.legendsCounter);
	// 	if (this.legendsCounter.length == 0) return;
	// 	this.openLegends();
	// },


	openLegends : function (e) {

		// Hide the little arrow button         
		// this._legendsOpener.className = '';
		if ( !Wu.app.mobile ) this._legendsOpener.style.opacity = '0';

		// Set the width of the Legends
		this._legendsInner.style.width = this.sliderWidth + 'px';

		// calculate width
		this.checkWidth();

		this._legendsInner.style.height = this._openHeight + 'px';
		
		var that = this;
		setTimeout(function(){                  
			that._legendsInner.removeAttribute('style');
			that._legendsCollapser.style.opacity = '1';
			that._legendsOpener.style.display = 'none';
		}, 500);      

		this._setOpen();

	},

	// is called when changing/selecting project
	update : function (project) {
	       
		// // init divs
		// this.initContainer();

		// project is ready only here, so init relevant vars
		// update is called from enableLayermenu toggle in MapPane

		// get vars
		this.project = project || Wu.app._activeProject;
		this._content = Wu.DomUtil.get('legends-control-inner-content'); 

		// init divs
		this.initContainer();		

		this.calculateHeight();

	},

	initContainer : function () {
	
		// get elements
		this._legendsCollapser = Wu.DomUtil.get('legends-collapser');
		this._legendsOpener = Wu.DomUtil.get('legends-opener')

		this._legendsInner = Wu.DomUtil.get('legends-inner');
		this._legendsContainer = Wu.DomUtil.get('legends-control-inner-content');
		this._legendsInnerSlider = Wu.DomUtil.get('legends-inner-slider');

		this._legendsScrollLeft = Wu.DomUtil.get('legends-scroll-left'); // (j)
		this._legendsScrollRight = Wu.DomUtil.get('legends-scroll-right'); // (j)

		// add hooks
		this.addHooks();

		this.legends = {};
		this._layers = [];

		// ADDED BY JØLLE
		this.legendsCounter = []; 
		this.sliderWidth = 0;
		this.sliderOffset = 0;

		// add tooltip
		app.Tooltip.add(this._legendsInner, 'Shows legends of active layers', { extends : 'systyle', tipJoint : 'top right'});

		// If mobile: start with closed legends pane
		if ( Wu.app.mobile ) {
			this._content.style.left = Wu.app.nativeResolution[1] + 'px';
			this._setClosed();

			// Mobile arrow	
		    	Wu.DomUtil.create('div', 'legends-mobile-arrow', this._content);


		}


	},




	// add legend from outside
	addLegend : function (layer) {

		// each layer has its own legends
		this._layers.push(layer);

		// rebuild
		this.refreshLegends();

	},



	removeLegend : function (layer) {

		// remove from local store
		var rem = _.remove(this._layers, function (l) {
			return l.store.uuid == layer.store.uuid;
		});
			
		// remove from array (for width setting)
		_.remove(this._legendsContainer, function (l) {
			return l.id == layer.store.uuid;
		})

		// rebuild
		this.refreshLegends();
	
	},

	// show baselayers also
	refreshAllLegends : function () {

		// get all layers (not just base)
		var layers = app.MapPane.getActiveLayers();
		this.refreshLegends(layers);
	},

	refreshLegends : function (layers) {


		this.legendsCounter = [];
		this.sliderWidth = 0;

		// remove old legends
		this._legendsInnerSlider.innerHTML = '';

		// get layers that should have legends (active ones)
		var layers = layers || this._getActiveLayers();

		// adds to DOM etc
		layers.forEach(function (layer) {

			// return if no active legends in layer
			if (!this._legendOn(layer)) return; 

			// add legends
			this._addLegend(layer);

		}, this);

		// Hide legends if it's empty
		if (this.legendsCounter.length == 0) {

			// this._legendsContainer.style.display = 'none';
			this._container.style.display = 'none';

			this._setClosed();
		} 
	},

	_legendOn : function (layer) {
		var ons = [];
		var legends = layer.getLegends();
		if (!legends) return false;
		legends.forEach(function (legend) {
			if (legend.on) ons.push(legend);
		});
		return ons.length;
	},

	_getActiveLayers : function () {

		// filter only layermenu layers
		var layers = app.MapPane.getActiveLayers();
		var lm = _.filter(layers, function (l) {
			return !l._isBase;
		});
		return lm;
	},


	_addLegend : function (layer) {
		var uuid = layer.store.uuid;
		var legends = layer.getActiveLegends();
		
		// return if no legend
		if (!legends) return;

		// Make sure that the container is visible...
		// this._legendsContainer.style.display = 'block';
		this._container.style.display = 'block';
		

		// create legends box
	    	var div = Wu.DomUtil.create('div', 'legends-item', this._legendsInnerSlider);

	    	// Set the width of the legends container
		var containerWidth = Math.round(legends.length/4) * 150;
		if (containerWidth < 150) containerWidth = 150;
		div.style.width = containerWidth + 'px';

		// Set the width of the legends slider
		this.sliderWidth += containerWidth;
		this._legendsInnerSlider.style.width = this.sliderWidth + 'px';


	    	var legendWidth = div.offsetWidth;

		// add to local store
		this.legends[uuid] = {
			layer : layer,
			div   : div,
			width : legendWidth
		}

	    	// Added by Jølle		    	
	    	var tempObj = {
			id : uuid,
			width : legendWidth
		}

		// Push in array for sliding control
	    	this.legendsCounter.push(tempObj);

	    	// get header title
	    	var headerTitle = this._getLegendHeader(layer);

		// create legends divs
		var b = Wu.DomUtil.create('div', 'legend-header', div, headerTitle); // header
		this._legendsList = Wu.DomUtil.create('div', 'legend-list', div);

		// create legends
		legends.forEach(function (legend) {

			// skip disabled legends
			if (!legend.on) return;

			// create legend divs
			var d = Wu.DomUtil.create('div', 'legend-each', this._legendsList);
			var e = Wu.DomUtil.create('div', 'legend-feature', d);
			var f = Wu.DomUtil.create('img', 'legend-image1', e);
			var g = Wu.DomUtil.create('img', 'legend-image2', e);
			var h = Wu.DomUtil.create('div', 'legend-feature-name', d, legend.value);

			f.src = legend.base64;
			g.src = legend.base64;

		}, this);


		// mark open if not on Mobile
		if ( !Wu.app.mobile ) this._setOpen();

		// see if we need the horizontal scrollers or not
		this.checkWidth();
		this.calculateHeight();

		


	},

	_setOpen : function () {

		this._isOpen = true;

		// calc
		this._setContentHeight();
	},

	_setClosed : function () {
		this._isOpen = false;

		// calc
		this._setContentHeight();
	},

	_setContentHeight : function () {
		var clientsPane = app.SidePane.Clients;
		var optionsPane = app.SidePane.Map;

		if (clientsPane) clientsPane.setContentHeight();
		if (optionsPane) optionsPane.setContentHeight();
	},

	_getLegendHeader : function (layer) {

		var tip = layer.getTooltip();

		if (!tip) return '';

		return tip.title;


	},


	_adjustLegendSlider : function (legend) {

		// adjust the legends slider (horizontal scroller)
		var legendBounds = legend.div.getBoundingClientRect();

		// if the legend was left of the wrapper box
		if (legendBounds.left < 0) {

			// remove the CSS animation of the slider
			Wu.DomUtil.removeClass(this._legendsInnerSlider, "legends-inner-slider-sliding");
			 
			// add the width of the legend to slider left
			this._legendsInnerSlider.style.left = this._legendsInnerSlider.offsetLeft + legend.width + 'px';

			// remove from the slider offset (counting how many legends that's overflowing to the left of wrapper)
			this.sliderOffset--;
		}
 		
 		// Hacky packy: add CSS animation to slider again
 		var that = this;
		setTimeout(function() {
			Wu.DomUtil.addClass(that._legendsInnerSlider, "legends-inner-slider-sliding");
		}, 500);
		
		// adjust slide width
		this.sliderWidth -= legend.width; 

	},


	legendsScrollLeft : function () {

		// return if no scrolling
		if (this.scrolling) return;
		
		// set offsets
		if (this.sliderOffset >= 1) {

			this.sliderOffset--;
			var mover = this.legendsCounter[this.sliderOffset].width;
			var tempLeft = this._legendsInnerSlider.offsetLeft;
			this._legendsInnerSlider.style.left = tempLeft + mover + 'px';	

			// Prevent double click
			this.scrolling = true;
			var that = this;
			setTimeout(function () {
				that.scrolling = false;
			}, 500);
		}
	},

	legendsScrollRight : function () {

		// return if no scrolling
		if (this.scrolling) return;

		// set offsets
		if (this.sliderOffset <= this.legendsCounter.length-1) {
			var mover = this.legendsCounter[this.sliderOffset].width;        
			var tempLeft = this._legendsInnerSlider.offsetLeft;
			var rightOffset = this._legendsInner.offsetWidth - (this._legendsInnerSlider.offsetWidth + tempLeft);

			if (rightOffset <= 0) {

				this._legendsInnerSlider.style.left = tempLeft - mover + 'px';
				this.sliderOffset++;

				// Prevent double click
				this.scrolling = true;
				var that = this;
				setTimeout(function () {
					that.scrolling = false;
				}, 500);
			}
		}
	},

	calculateHeight : function() {

		this._legendsHeight 	= this._legendsInner.offsetHeight;
		this._legendsWidth 	= this._legendsInner.offsetWidth;
		this._openHeight 	= this._legendsInner.offsetHeight;
		this._openWidth 	= this._legendsInner.offsetWidth;

		app.StatusPane.setContentHeights();
	}

});


L.control.legends = function (options) {
	return new L.Control.Legends(options);
};;/*
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

L.Control.MousePosition = L.Control.extend({
        options: {
                position: 'topright',
                separator: ' : ',
                emptyString: 'Lat/Lng',
                lngFirst: false,
                numDigits: 5,
                lngFormatter: undefined,
                latFormatter: undefined,
                prefix: "",
                zoomLevel : true
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
                var lng = this.options.lngFormatter ? this.options.lngFormatter(e.latlng.lng) : L.Util.formatNum(e.latlng.lng, this.options.numDigits);
                var lat = this.options.latFormatter ? this.options.latFormatter(e.latlng.lat) : L.Util.formatNum(e.latlng.lat, this.options.numDigits);
                var value = this.options.lngFirst ? lng + this.options.separator + lat : lat + this.options.separator + lng;
                var prefixAndValue = this.options.prefix + ' ' + value;
                if (this.options.zoomLevel) prefixAndValue += ' | ' + this._zoom;
                this._container.innerHTML = prefixAndValue;
        }

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
;/*
 * L.Control.Layers is a control to allow users to switch between different layers on the map.
 * https://raw.githubusercontent.com/Leaflet/Leaflet/master/src/control/Control.Layers.js
 */

L.Control.BaselayerToggle = L.Control.extend({
	options: {
		collapsed: true,
		position: 'topleft',
		autoZIndex: true
	},

	onAdd: function () {
		this._initLayout();
		this.update();
		return this._container;
	},

	addTo: function (map) {
		this._map = map;

		var container = this._container = this.onAdd(map),
		    pos = this.getPosition(),
		    corner = map._controlCorners[pos];

		L.DomUtil.addClass(container, 'leaflet-control');

		// add to dom
		corner.appendChild(container);

		return this;
	},


	
	_initLayout: function () {

		// create div
		var className = 'leaflet-control-baselayertoggle';
		var container = this._container = L.DomUtil.create('div', className);

		// add tooltip
		app.Tooltip.add(container, 'Toggle between baselayers', { extends : 'systyle', offset : [23, 0]});

		// add events
		Wu.DomEvent.on(container, 'mousedown', this.toggle, this);
		Wu.DomEvent.on(container, 'dblclick', Wu.DomEvent.stop, this);

		// add stops
		Wu.DomEvent.on(container, 'mousedown dblclick mouseup click', Wu.DomEvent.stopPropagation, this);

	},

	
	update: function () {
		if (!this._container) return; 

		// set project
		this.project = this.project || app.activeProject;

		// empty old
		if (this._list) Wu.DomUtil.remove(this._list);

		this._layers = {};

		// create wrapper
		this._list = L.DomUtil.create('div', 'baselayertoggle-list collapsed', this._container);
		Wu.DomEvent.on(this._list, 'dblclick', Wu.DomEvent.stop, this);

		// build menu
		var baseLayers = this.project.getBaselayers();
		if (!baseLayers) return;

		baseLayers.forEach(function (b) {
			var baseLayer = {
				layer : this.project.getLayer(b.uuid),
				baseLayer : b
			}
			this.addLayer(baseLayer);
		}, this);

		return this;
	},

	addLayer : function (baseLayer) {
		if (!baseLayer.layer) return console.error('BUG: fixme!');
		
		// create div
		var layerName = baseLayer.layer.getTitle();
		var item = Wu.DomUtil.create('div', 'baselayertoggle-item active', this._list, layerName);
		
		// set active by default
		baseLayer.active = true;

		// add to local store
		var id = L.stamp(baseLayer);
		this._layers[id] = baseLayer;

		// add click event
		Wu.DomEvent.on(item, 'mousedown', function (e) {
			Wu.DomEvent.stop(e);
			this.toggleLayer(baseLayer, item);
		}, this);
	},

	toggleLayer : function (baseLayer, item) {

		// get layer from local store
		var layer = this._layers[L.stamp(baseLayer)].layer;

		// toggle
		if (baseLayer.active) {

			// disable
			layer.disable();
			baseLayer.active = false;
			Wu.DomUtil.removeClass(item, 'active');
		} else {
			
			// enable
			layer.add('baselayer');
			baseLayer.active = true;
			Wu.DomUtil.addClass(item, 'active');
		}

	},

	toggle : function () {
		this._isOpen ? this.collapse() : this.expand();
	},

	collapse : function () {
		this._isOpen = false;
		Wu.DomUtil.addClass(this._list, 'collapsed');
	},

	expand : function () {
		this._isOpen = true;
		Wu.DomUtil.removeClass(this._list, 'collapsed');
	},


});

L.control.baselayerToggle = function (options) {
	return new L.Control.BaselayerToggle(options);
};;// controls global styles
// full color themeing to come
Wu.Style = Wu.Class.extend({

	initialize : function () {
		
		// get style tag
		this._styletag = Wu.DomUtil.get("styletag");

	},

	setDarkTheme : function () {	
	
		// append darktheme stylesheet
		var darktheme = document.createElement("link");
		darktheme.rel = 'stylesheet';
		darktheme.href = app.options.servers.portal + 'css/darktheme.css';
		this._styletag.appendChild(darktheme);

		// Set codemirror cartoCSS to dark theme
		this.setDarkThemeCartoCSS();

	},

	setLightTheme : function () {

		// remove darktheme stylesheet
		this._styletag.innerHTML = '';

		// Set codemirror cartoCSS to light theme
		this.setLightThemeCartoCSS();
	},

	setLightThemeCartoCSS : function () {
		if (!app.MapPane.cartoCss) return;
		
		// Set code mirror to light theme
		var cartoCSStheme = Wu.DomUtil.get('cartoCSStheme');
		app.MapPane.cartoCss._codeMirror.setOption("theme", "default");
		cartoCSStheme.setAttribute('href', app.options.servers.portal + 'js/lib/codemirror/mode/cartocss/codemirror.carto.css');

	},

	setDarkThemeCartoCSS : function () {
		if (!app.MapPane.cartoCss) return;

		// Set code mirror to darktheme
		var cartoCSStheme = Wu.DomUtil.get('cartoCSStheme');
		app.MapPane.cartoCss._codeMirror.setOption("theme", "mbo");
		cartoCSStheme.setAttribute('href', app.options.servers.portal + 'js/lib/codemirror/mode/cartocss/codemirror.carto.darktheme.css');
	
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



});


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
;L.Control.CartoCSS = L.Control.extend({
	
	options: {
		position : 'topleft' 
	},

	_laidout : false,

	onAdd : function () {

		// create toolbar container
		var container = Wu.DomUtil.create('div', 'leaflet-control-cartocss leaflet-control');
		Wu.DomEvent.on(container, 'click mousedown ', Wu.DomEvent.stopPropagation, this);

		// create toolbar button
		this._toolbarButton = Wu.DomUtil.create('div', 'cartocss-toolbar-button', container);

		// add tooltip
		app.Tooltip.add(this._toolbarButton, 'CartoCSS editor, tooltip controller, and legends builder');

		// init rest of layout
		this.initLayout();

		// init code mirror
		this.initCodeMirror();

		// add hooks
		this.addHooks();

		// automatically becomes this._container;
		return container;	

	},

	onRemove : function () {

		// remove hooks
		this.removeHooks();

		// remove from DOM
		Wu.DomUtil.remove(this._codeMirror.getWrapperElement());

		// remove from leaflet-control-container
		Wu.DomUtil.remove(this._editorContainer);
	},

	initLayout : function () {


		// create divs
		this._editorContainer 		= Wu.DomUtil.create('div', 'cartocss-control-container'); // editor container
		this._resizeHandle 		= Wu.DomUtil.create('div', 'cartocss-control-resizer', this._editorContainer); // editor container
		this._wrapper 			= Wu.DomUtil.create('div', 'cartocss-control-wrapper', this._editorContainer); // the obligatory wrapper
		this._xButton 			= Wu.DomUtil.create('div', 'close-cartocss-editor-x', this._wrapper); // close button
		this._zoomVal 			= Wu.DomUtil.create('div', 'cartocss-zoomval', this._wrapper, app._map.getZoom()); // Show zoom value
		this._styleHeaderWrapper 	= Wu.DomUtil.create('div', 'cartocss-style-header-wrapper', this._wrapper); // create form wrapper
		this._styleHeaderLayerName 	= Wu.DomUtil.create('div', 'cartocss-style-header-layer', this._styleHeaderWrapper, 'Select layer');
		this._styleHeaderDropDownButton = Wu.DomUtil.create('div', 'cartocss-style-dropdown-arrow', this._styleHeaderWrapper);
		this._layerSelectorOuter 	= Wu.DomUtil.create('div', 'cartocss-layerselector-outer', this._wrapper); // create layer selector
		this._layerSelector 		= Wu.DomUtil.create('div', 'cartocss-layerselector', this._layerSelectorOuter);
		
		// tabs
		this._tabsWrapper 		= Wu.DomUtil.create('div', 'cartocss-tab-wrapper', this._wrapper); // Wrapper for tabs
		this._tabStyling 		= Wu.DomUtil.create('div', 'cartocss-tab cartocss-tab-styling cartocss-active-tab', this._tabsWrapper, 'Styling'); // Styling tab
		this._tabTooltip 		= Wu.DomUtil.create('div', 'cartocss-tab cartocss-tab-tooltip', this._tabsWrapper, 'Tooltip'); // Styling tab		
		this._tabLegends 		= Wu.DomUtil.create('div', 'cartocss-tab cartocss-tab-legends', this._tabsWrapper, 'Legend'); // Styling tab				
		this._legendsWrapper		= Wu.DomUtil.create('div', 'cartocss-legends-wrapper displayNone', this._wrapper);
		this._tooltipOuterWrapper	= Wu.DomUtil.create('div', 'cartocss-tooltip-outer-wrapper displayNone', this._wrapper);
		this._tooltipWrapper		= Wu.DomUtil.create('div', 'cartocss-tooltip-wrapper', this._tooltipOuterWrapper);
		this._formWrapper 		= Wu.DomUtil.create('form', 'cartocss-form-wrapper', this._wrapper); // For CodeMirror: create form wrapper
		this._inputArea 		= Wu.DomUtil.create('textarea', 'cartocss-input', this._formWrapper); // For CodeMirror: create text area
		this._errorPane 		= Wu.DomUtil.create('div', 'cartocss-error-pane', this._wrapper); // error feedback pane
		this._updateButton 		= Wu.DomUtil.create('div', 'cartocss-update-button', this._wrapper, 'Render changes...'); // create update button

		// append to leaflet-control-container
		app._map.getContainer().appendChild(this._editorContainer);

		// add tooltip
		app.Tooltip.add(this._styleHeaderWrapper, 'Shows a list of active layers for this project.', { extends : 'systyle', tipJoint : 'top left'});
		app.Tooltip.add(this._zoomVal, 'Shows current zoom level.', { extends : 'systyle', tipJoint : 'top left'});
		app.Tooltip.add(this._tabStyling, 'Style selected layer. Takes CartoCSS code.', { extends : 'systyle', tipJoint : 'top left'});
		app.Tooltip.add(this._tabTooltip, 'Customize tooltip to appear when clicking on different shapes in layer.', { extends : 'systyle', tipJoint : 'top left'});
		app.Tooltip.add(this._tabLegends, 'Decide which legends you want to show for selected layer.', { extends : 'systyle', tipJoint : 'top left'});
				

	},

	addHooks : function () {

		// update button click
		Wu.DomEvent.on(this._updateButton, 'click', this.renderStyling, this);

		// toolbar button click
		Wu.DomEvent.on(this._toolbarButton, 'click', this.toggle, this);

		// remove control
		Wu.DomEvent.on(this._xButton, 'click', this.toggle, this);

		// Layer drop down
		Wu.DomEvent.on(this._styleHeaderLayerName, 'click', this.toggleLayerDropDown, this);

		// Toggle legends tab
		Wu.DomEvent.on(this._tabLegends, 'mousedown', this.toggleLegends, this);

		// Toggle styles tab
		Wu.DomEvent.on(this._tabStyling, 'mousedown', this.toggleStyles, this);

		// Toggle tooltip tab
		Wu.DomEvent.on(this._tabTooltip, 'mousedown', this.toggleTooltip, this);

		// Resize container
		Wu.DomEvent.on(this._resizeHandle, 'mousedown', this.resize, this);

		// stops
		Wu.DomEvent.on(this._editorContainer, 		'mousewheel mousedown dblclick click', 		Wu.DomEvent.stopPropagation, this);
		Wu.DomEvent.on(this._toolbarButton, 		'dblclick', 					Wu.DomEvent.stopPropagation, this);
		Wu.DomEvent.on(this._styleHeaderLayerName, 	'click mousedown', 				Wu.DomEvent.stopPropagation, this);
		Wu.DomEvent.on(this._formWrapper, 		'click mousedown', 				Wu.DomEvent.stopPropagation, this);

		// Update Zoom
		var map = app._map;
		map.on('zoomend', function() {
			this._zoomVal.innerHTML = map.getZoom();
		}, this)
		
	},

	removeHooks : function () {

		

	},

	resize : function () {

		// Get position of frame that is going to be scaled
		this.__cartoContainer_offsetLeft = this._editorContainer.offsetLeft;
		this.__cartoContainer_width = this._editorContainer.offsetWidth;

		// create ghost div
		this._ghost = Wu.DomUtil.create('div', 'resize-ghost', app._appPane);

		// add release hook
		Wu.DomEvent.on(this._ghost, 'mouseup', this.removeResizeHooks, this);

		// track mouse position
		Wu.DomEvent.on(this._ghost, 'mousemove', this.resizeEditor, this);

	},

	removeResizeHooks : function () {

		// remove events
		Wu.DomEvent.off(this._ghost, 'mousemove', this.resizeEditor, this);
		Wu.DomEvent.off(this._ghost, 'mouseup', this.removeResizeHooks, this);

		// remove ghost div
		Wu.DomUtil.remove(this._ghost);
	},

	resizeEditor : function (e) {

		// set new width
		// var mouse = {x: 0};		
		var mousex = e.clientX || e.pageX || 0,
		    offleft = this._editorContainer.offsetLeft,
		    offwidth =  this._editorContainer.offsetWidth,
		    w = offwidth + (offleft - mousex);

		if ( w >= 300 ) this._editorContainer.style.width = w + 'px';
	},

	// update: fired from outside, on project.select() etc.
	update : function () {

		// mark as update needed
		this._updated = false;
	},

	_update : function () {
		if (this._updated) return;

		// set active project
		this.project = app.activeProject;

		// get all active, geojson layers
		this._layers = this.project.getStylableLayers();

		// fill active layers box
		this._fillLayers();

		// select a layer
		this.setLastUpdatedLayer();

		// mark updated
		this._updated = true;

		// refresh codemirror
		this._codeMirror.refresh();

	},


	
	initCodeMirror : function () {
		
		this._codeMirror = CodeMirror.fromTextArea(this._inputArea, {
    			lineNumbers: true,    			
    			mode: {
    				name : 'carto',
    				reference : window.cartoRef
    			},
    			matchBrackets: true,
    			lineWrapping: true,
    			paletteHints : true,
    			gutters: ['CodeMirror-linenumbers', 'errors']
  		});

		// set default value
  		// this._codeMirror.setValue('// No layer selected. \n\n// #layer is always base \n#layer { \n  \n}');

		// todo:
  		// var completer = cartoCompletion(this._codeMirror, window.cartoRef);
		// this._codeMirror.on('keydown', completer.onKeyEvent);
		// this._codeMirror.on('change', function() { return window.editor && window.editor.changed(); });
		// this._codeMirror.setOption('onHighlightComplete', _(completer.setTitles).throttle(100));
		// console.log(')thi wrapper element', this._codeMirror);
		// this._codeMirror.getWrapperElement().id = 'code-' + id.replace(/[^\w+]/g,'_');
	

		// cxxxx
		// var settings = app.activeProject.getSettings();


		// if ( settings.darkTheme ) app.Style.themeToggle('dark');		// TODO: fires too early.. do this differently



	},

	_initStylingDefault : function () {

		// get meta fields
		var fields = this._layer.getMetaFields(); // return false if no fields found
		
		// create string
		var string = '// CartoCSS reference guide:\n// https://bit.ly/1z5OvXT\n\n\n';
		string += '// #layer is always the layer identifier \n';
		string += '#layer {\n\n';
		string += '    // Available fields in layer:\n\n';

		// add each field to string
		for (key in fields) {
			var type = fields[key];
			string += '    // [' + key + '=' + type + '] {}\n';
		}
		
		string += '\n\n}';

		// update text
		this.updateCodeMirror(string);

	},

	// select last update layer (on update)
	setLastUpdatedLayer : function () {

		// sort by lastUpdated
		var layers = this._layers;
		var sorted = _.sortBy(this._layers, function (l) {
			return l.store.lastUpdated;
		});

		// get top hit
		var last = _.last(sorted);

		// select lastUpdated layer
		this._selectLayer(last);

	},

	updateCodeMirror : function (css) {
		this._codeMirror.setValue(css);
	},

	clearCodeMirror : function () {
		this._codeMirror.setValue('');
	},

	_fillLayers : function () {
		
		// clear
		this._layerSelector.innerHTML = '';

		// store wrappers
		this._layerWrapperList = {};

		// add
		this._layers.forEach(function (layer) {

			// append
			var wrapper = Wu.DomUtil.create('div', 'layer-selector-item-wrap');
			var div = Wu.DomUtil.create('div', 'layer-selector-item', wrapper, layer.getTitle());
			this._layerSelector.appendChild(wrapper);

			// store wrapper by layer uuid
			this._layerWrapperList[layer.getUuid()] = wrapper;

			// hook
			Wu.DomEvent.on(wrapper, 'mousedown', function () {
				this._selectLayer(layer)
			}, this);

			// add stops
			Wu.DomEvent.on(wrapper, 'click mousedown', Wu.DomEvent.stopPropagation, this);


		}, this);

	},

	setSelected : function (layer) {
		if (!layer) return;

		// get wrapper
		var wrapper = this._layerWrapperList[layer.getUuid()];

		// clear selected
		this._clearSelected(wrapper);

		// mark selected
		Wu.DomUtil.addClass(wrapper, 'vt-selected', this);
	},

	_clearSelected : function (wrapper) {
		// Set class to show which layer is selected
		for ( var i = 0; i < wrapper.parentNode.children.length; i++ ) {
			var child = wrapper.parentNode.children[i];
			Wu.DomUtil.removeClass(child, 'vt-selected', this);
		}
	},

	_selectLayer : function (layer) {

		// close dropdown
		this.closeLayerDropDown();
		
		// init tabs
		this.initStyling(layer);	
		this.initTooltip(layer);
		this.initLegends(layer);

		// select in list
		this.setSelected(layer);
		
	},

	
	toggleLegends : function () {

		// Hide Styler
		Wu.DomUtil.addClass(this._formWrapper, 'displayNone');

		// Hide Tooltip
		Wu.DomUtil.addClass(this._tooltipOuterWrapper, 'displayNone');

		// Show Legends Wrapper
		Wu.DomUtil.removeClass(this._legendsWrapper, 'displayNone');

		// Set tab to active
		Wu.DomUtil.removeClass(this._tabTooltip, 'cartocss-active-tab');
		Wu.DomUtil.removeClass(this._tabStyling, 'cartocss-active-tab');
		Wu.DomUtil.addClass(this._tabLegends, 'cartocss-active-tab');


	},

	toggleStyles : function () {

		// Show Styler
		Wu.DomUtil.removeClass(this._formWrapper, 'displayNone');

		// Hide Tooltip
		Wu.DomUtil.addClass(this._tooltipOuterWrapper, 'displayNone');

		// Hide Legends Wrapper
		Wu.DomUtil.addClass(this._legendsWrapper, 'displayNone');

		// Set tab to active
		Wu.DomUtil.removeClass(this._tabTooltip, 'cartocss-active-tab');
		Wu.DomUtil.addClass(this._tabStyling, 'cartocss-active-tab');
		Wu.DomUtil.removeClass(this._tabLegends, 'cartocss-active-tab');

	},

	toggleTooltip : function () {

		// Show Tooltip
		Wu.DomUtil.removeClass(this._tooltipOuterWrapper, 'displayNone');

		// Hide Styler
		Wu.DomUtil.addClass(this._formWrapper, 'displayNone');

		// Hide Legends Wrapper
		Wu.DomUtil.addClass(this._legendsWrapper, 'displayNone');

		// Set tab to active
		Wu.DomUtil.addClass(this._tabTooltip, 'cartocss-active-tab');
		Wu.DomUtil.removeClass(this._tabStyling, 'cartocss-active-tab');
		Wu.DomUtil.removeClass(this._tabLegends, 'cartocss-active-tab');

	},

	initStyling : function (layer) {
		if (!layer) return;

		// new layer is active
		this._layer = layer;
		this._cartoid = false;

		// insert title in dropdown
		this._styleHeaderLayerName.innerHTML = layer.store.title.camelize();

		// check for existing css
		this._cartoid = this._layer.getCartoid();

		// if no style stored on layer yet, set default message	
		if (!this._cartoid) return this._initStylingDefault();				

		// else get css from server
		this._layer.getCartoCSS(this._cartoid, function (ctx, css) {
			
			// set css
			this.updateCodeMirror(css);

		}.bind(this));

	},

	
	initLegends : function () {
		
		// clear 
		this._legendsWrapper.innerHTML = '';

		// return if no layer selected
		if (!this._layer) return;

		// fill with legends from layer
		this._legends = this._layer.getLegends();
		
		if (this._legends) {
			// fill legends
			return this.fillLegends(this._legends);
		} else {
			// fill with default
			return this._initLegendsDefaultMeta();	
		}
	},

	initTooltip : function () {

		// clear
		this._tooltipWrapper.innerHTML = '';

		// return if no layer selected
		if (!this._layer) return;

		// fill with store tooltip meta
		var tooltipMeta = this._layer.getTooltip();
		if (tooltipMeta) return this._initTooltipStoredMeta(tooltipMeta);

		// fill with default meta
		return this._initTooltipDefaultMeta();
		
	},



	// fill legends tab with legends
	fillLegends : function (legends) {

		// Get title from tooltip
		var tooltipMeta = this._layer.getTooltip();

		// clear old
		this._legendsWrapper.innerHTML = '';

		// inner wrapper
		this._legendsWrapperInner = Wu.DomUtil.create('div', 'legends-inner-scroller', this._legendsWrapper);
		this._legendsTitle = Wu.DomUtil.create('div', 'legends-title', this._legendsWrapperInner);
		this._legendsTitle.innerHTML = tooltipMeta.title || 'No title';
		this._legendsListWrapper = Wu.DomUtil.create('div', 'legends-list-wrapper', this._legendsWrapperInner);

		// each legend
		legends.forEach(function (legend) {

			// append legend entry to wrapper
			var legdiv = this._legendEntry(legend);
			this._legendsListWrapper.appendChild(legdiv);

		}, this);

	},


	_legendEntry : function (legend) {

		// create divs
		var wrap 	= Wu.DomUtil.create('div', 'legend-entry-wrap');
		var imgwrap 	= Wu.DomUtil.create('div', 'legend-entry-image', wrap);
		var image1	= Wu.DomUtil.create('img', 'legend-image1', imgwrap);
		var image2	= Wu.DomUtil.create('img', 'legend-image2', imgwrap);
		var keydiv	= Wu.DomUtil.create('div', 'legend-entry-key', wrap);
		var valuediv  	= Wu.DomUtil.create('div', 'legend-entry-value', wrap); 
		var checkbox 	= this._createCheckbox(legend.id);
		wrap.appendChild(checkbox);

		// set values	
		image1.src 	   = legend.base64;
		image2.src 	   = legend.base64;
		keydiv.innerHTML   = this._normalizeKey(legend.key);
		valuediv.innerHTML = legend.value;
		wrap.setAttribute('legendid', legend.id);
		if (legend.on) checkbox.firstChild.setAttribute('checked', 'checked');
		
		// add toogle hook
		Wu.DomEvent.on(checkbox, 'change', this._saveLegends, this);

		// return div
		return wrap;
	},

	_saveLegends : function () {

		app.setSaveStatus(1000);

		// get legends array
		var legends = this._layer.getLegends();

		// iterate
		var childs = this._legendsListWrapper.childNodes;

		// var child = childs[1];
		for (var i = 0; i < childs.length; i++) {
			var child = childs[i];

			// get checked value
			var checked = child.childNodes[3].querySelector('input:checked');
			var on = (!checked) ? false : true;
			var id = child.getAttribute('legendid');

			// find legend to update
			var legend = _.find(legends, function (l) {
				return l.id == id;
			});

			// update toggle
			legends[i].on = on;
			
		}

		// save to layer
		this._layer.setLegends(legends);

		// refresh legends
		var legendsControl = app.MapPane.legendsControl;
		if (legendsControl) legendsControl.refreshLegends();

	},

	// get custom keyname if created (in tooltips)
	_normalizeKey : function (key) {
		var tooltips = this._layer.getTooltip();
		var customKey = _.find(tooltips.fields, function (f) {
			return key == f.key;
		});
		if (customKey && customKey.title) return customKey.title;
		return key;
	},

	_createCheckbox : function (id) {
		// create switch
		var switchId = 'switch-' + id;
		var fieldSwitch = Wu.DomUtil.create('div', 'switch carto-switch-legend'); // controls-switch
		var fieldSwitchInput = Wu.DomUtil.createId('input', switchId, fieldSwitch);
		var fieldSwitchLabel = Wu.DomUtil.create('label', '', fieldSwitch);
		Wu.DomUtil.addClass(fieldSwitchInput, 'cmn-toggle cmn-toggle-round-flat');
		fieldSwitchInput.setAttribute('type', 'checkbox');
		fieldSwitchLabel.setAttribute('for', switchId);
		return fieldSwitch;
	},


	_initLegendsDefaultMeta : function () {

		// clear
		this._legendsWrapper.innerHTML = '';

		// add help text
		Wu.DomUtil.create('div', 'legends-default-box', this._legendsWrapper, 'No legends yet. Style the geo and magic will happen!');
	},


	_updateLegends : function (cartoid) { // refactor: move to layers.js

		var meta = this._layer.getMeta();
		var metaFields = this._layer.getMetaFields();
		
		// generate legends on server from active fields
		this._layer.createLegends(function (ctx, json) {	// callback
			var legends = JSON.parse(json);

			if (legends && legends.err) {
				console.error('legends err', legends);
				return this.handleError(legends.err);
			}

			// sort some things: #layer on top
			var layer = _.remove(legends, function (l) {
				return l.key == 'layer';
			});
			legends.unshift(layer[0]);

			// include old legends settings
			legends = this._mergePreviousLegendsSettings(legends, this._layer.getLegends());

			// fill legends tab in editor
			this.fillLegends(legends);

			// save to layer
			this._layer.setLegends(legends);

			// save local
			this._legends = legends;


		}.bind(this));

	},


	_mergePreviousLegendsSettings : function (newLegends, oldLegends) {

		// keep .on setting
		newLegends.forEach(function (newlegend, i){
			var oldlegend = _.find(oldLegends, function (o) {
				return o.value == newlegend.value;
			});

			if (!oldlegend) return;
			newLegends[i].on = oldlegend.on;
		});

		return newLegends;
	},


	_initTooltipStoredMeta : function (meta) {

		
		// create header
		var tooltipCustomHeader	= Wu.DomUtil.createId('input', 'cartocss-tooltip-custom-header', this._tooltipWrapper);
		tooltipCustomHeader.setAttribute('placeholder', 'Tooltip title')
		tooltipCustomHeader.value = meta.title;

		// save
		Wu.DomEvent.on(tooltipCustomHeader, 'keyup', this._saveTip, this);

		// for each field
		var fields = meta.fields;
		fields.forEach(function (field) {

			// create tooltip entry
			this._createTooltipEntry(field.key, field.title, field.on);

		}, this);


	},


	_initTooltipDefaultMeta : function () {


		// get default meta
		var fields = this._layer.getMetaFields();

		// create header
		var tooltipCustomHeader	= Wu.DomUtil.createId('input', 'cartocss-tooltip-custom-header', this._tooltipWrapper);
		tooltipCustomHeader.setAttribute('placeholder', 'Tooltip title')

		// save event
		Wu.DomEvent.on(tooltipCustomHeader, 'keyup', this._saveTip, this);

		// for each field
		for (key in fields) {
			var value = fields[key];

			// create tooltip entry
			this._createTooltipEntry(key, null, true);	
		}

	},

	_createTooltipEntry : function (defaultKey, key, on) {

		// create wrapper
		var fieldWrapper = Wu.DomUtil.create('div', 'tooltip-field-wrapper', this._tooltipWrapper);
		
		// create field title input
		var fieldKey = Wu.DomUtil.create('input', 'tooltip-field-key', fieldWrapper);
		fieldKey.setAttribute('type', 'text');
		fieldKey.setAttribute('placeholder', defaultKey); // set default key

		// set value if set
		if (key) fieldKey.value = key;

		// create switch
		var fieldSwitch = Wu.DomUtil.create('div', 'switch carto-switch-tooltip', fieldWrapper); //  controls-switch
		var switchId = 'switch-' + defaultKey;
		var fieldSwitchInput = Wu.DomUtil.createId('input', switchId, fieldSwitch);
		Wu.DomUtil.addClass(fieldSwitchInput, 'cmn-toggle cmn-toggle-round-flat');
		fieldSwitchInput.setAttribute('type', 'checkbox');
		var fieldSwitchLabel = Wu.DomUtil.create('label', '', fieldSwitch);
		fieldSwitchLabel.setAttribute('for', switchId);

		// set checked
		if (on) fieldSwitchInput.setAttribute('checked', 'checked');

		// set save events
		Wu.DomEvent.on(fieldSwitchInput, 'change', this._saveTip, this);
		Wu.DomEvent.on(fieldKey, 'keyup', this._saveTip, this);

	},

	_saveTip : function () {

		// clear timer, dont save more than erry second
		if (this._savingTooltip) clearTimeout(this._savingTooltip);

		var that = this;
		this._savingTooltip = setTimeout(function () {

			// do the save
			that._saveTooltipMeta();

			// set status
			app.setSaveStatus()
	
		}, 1000);

		

	},

	_saveTooltipMeta : function () {

		var saved = {
			title : '',
			fields : []
		};

		// iterate
		var childs = this._tooltipWrapper.childNodes;
		for (var i = 0; i < childs.length; i++) {

			var child = childs[i];

			// get title
			if (i == 0) {
				saved.title = child.value;
				continue;
			}

			var key = child.childNodes[0].getAttribute('placeholder');
			var title = child.childNodes[0].value;
			var checked = child.childNodes[1].querySelector('input:checked');
			var on = (!checked) ? false : true;

			// get each
			saved.fields.push({
				key : key,
				title : title,
				on : on
			});
		}

		// save to server
		this._layer.setTooltip(saved);

		// update legends tab title
		this._legendsTitle.innerHTML = saved.title;
		
	},

	closeLayerDropDown : function () {
		this._openDropDown = true;
		this.toggleLayerDropDown();
	},

	toggleLayerDropDown : function () {
		if (!this._openDropDown) {
			this._openDropDown = true;
			var dropDownHeight = this._layers.length * 27;
			if (this._layers.length <= 2) dropDownHeight+=2;
			this._layerSelectorOuter.style.height = dropDownHeight + 'px';

			Wu.DomUtil.addClass(this._styleHeaderDropDownButton, 'carrow-flipped', this);
			
		} else {
			this._openDropDown = false;
			this._layerSelectorOuter.style.height = '0px';
			
			Wu.DomUtil.removeClass(this._styleHeaderDropDownButton, 'carrow-flipped', this);
		}		
	},
	
	

	toggle : function () {
		this._open ? this.close() : this.open();
	},

	open : function () {

		// update
		this._update();

		// add open class
		Wu.DomUtil.addClass(this._editorContainer, 'open');
		
		// mark open
		this._open = true;
	},

	close : function () {

		// add closed class
		Wu.DomUtil.removeClass(this._editorContainer, 'open');

		// mark closed
		this._open = false;
	},

	renderStyling : function () {

		// return if no active layer
		if (!this._layer) return;

		// get css string
		var css = this._codeMirror.getValue();

		// return if empty
		if (!css) return;
		
		// set vars
		var fileUuid = this._layer.getFileUuid();
		var cartoid = Wu.Util.createRandom(7);

		// send to server
		var json = {							// todo: verify valid css
			css : css,
			fileUuid : fileUuid,
			cartoid : cartoid,
			layerUuid : this._layer.getUuid()
		}

		// save to server
		this._layer.setCartoCSS(json, this.renderedStyling.bind(this));

	},

	
	renderedStyling : function (context, json) {

		// parse
		var result = JSON.parse(json);

		// handle errors
		if (!result.ok) return this.handleError(result.error);
			
		// update style on layer
		this._layer.updateStyle();

		// update legends tab 
		this._updateLegends(result.cartoid);

	},

	handleError : function (error) {

		// handle unrecognized rule
		if (typeof(error) == 'string' && error.indexOf('Unrecognized rule') > -1) {
			return this._handleSyntaxError(error);
		}

		// handle invalid code
		if (typeof(error) == 'string' && error.indexOf('Invalid code') > -1) {
			return this._handleSyntaxError(error);
		}

		// handle wrong pattern path
		if (typeof(error) == 'string' && error.indexOf('Error: file could not be found:') > -1) {
			return this._handlePathError(error);
		}

		// don't handle debug errors
		if (typeof(error) == 'string' && error.indexOf('debug') > -1) {
			return;
		}

		// catch-all for unhandled errors
		this._setError(error);

		console.error('Unhandled syntax error: ', error);

	},

	_handleSyntaxError : function (error) {

		// parse error
		var err = error.split(':');
		var line 	= parseInt(err[2].trim()) - 1;
		var charr 	= err[3].split(' ')[0].trim();
		var problem 	= err[3].split(' ')[1] + ' ' + err[3].split(' ')[2];
		problem 	= problem.trim().camelize();
		var word 	= err[4].split(' ')[1].trim();
		var suggestion 	= err[4].split(' ');
		suggestion.splice(0,2);
		suggestion 	= suggestion.join(' ');

		// set error text
		var errorText = problem + ': ' + word + '. ' + suggestion;
	
		// set error
		this._setError(errorText, line);

	},

	_setError : function (error, line) {

		// get codemirror doc
		var doc = this._codeMirror.getDoc()

		// if line supplied, mark line in codemirror
		if (line) doc.addLineClass(line, 'wrap', 'gutter-syntax-error');

		// set error text
		this._errorPane.innerHTML = error;

		// add error class
		Wu.DomUtil.addClass(this._errorPane, 'active-error');

		// clear error on change
		doc.on('change', function () {
			this._clearError(line || 0);
		}.bind(this));
	},


	_handlePathError : function (error) {

		console.log('_handlePathError', error);

		// set error text
		var errorText = 'Wrong path for pattern-file.';
		
		// set error
		this._setError(errorText);

	},

	_clearError : function (line) {

		// clear error pane
		this._errorPane.innerHTML = '';
		Wu.DomUtil.removeClass(this._errorPane, 'active-error');
		
		// remove line class
		var doc = this._codeMirror.getDoc();
		doc.removeLineClass(line, 'wrap'); // removes all classes

		// remove event (doesn't work.. see here instead: http://codemirror.net/doc/manual.html#events)
		doc.off('change', function () {
			this._clearError(line || 0);
		}.bind(this));

	},

	destroy : function () {
		this.onRemove();
	},

	getPatternList : function () {
		var patterns = ['001.png', '002.png', '003.png', '004.png', '005.png', '006.png', '007.png', '008.png', '009.png', '010.png', '011.png', '012.png', '013.png', '014.png', '015.png', '016.png', '017.png', '018.png', '019.png', '020.png', '021.png', 'paperwhite1.png', 'paperwhite2.png', 'paperwhite3.png', 'paperwhite4.png', 'paperwhite5.png', 'paperwhite6.png', 'waves.png', 'waves_white.png'];
		console.log('CartoCSS patterns: ');
		console.log(patterns);
	},



	
});
L.control.cartoCss = function (options) {
	return new L.Control.CartoCSS(options);
};
;Wu.Tooltip = Wu.Class.extend({

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
		var project = app.activeProject;
		if (!project) return false;
		return project.getSettings().tooltips;
	},

	add : function (div, content, options) {

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

		// console.error('tooltip on!'); // todo optimize: too many event registered?

		// create tooltip
		this.tips.forEach(function (t) {

			// only init once
			if (!t.inited)  {

				// create tip
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

});;// spinning map
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
			zoom : [4, 17]
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

		// set logo
		this._logo = L.DomUtil.get('login-logo');
		var img = 'url("' + this.options.logo + '")';
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
		var map = this._map = L.mapbox.map(this._container);

		// add layer
		var layer = L.mapbox.tileLayer(this.options.layer, {
			format : this.options.tileFormat
		}).addTo(map);

		// set map options
		this.setView(lat, lng, this._getZoomLevel());
		
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
		map.attributionControl.removeFrom(map);

	},

	setView : function (lat, lng, zoom) {
		this._map.setView([lat, lng], zoom);
	},

	changeView : function () {
		var lat = this.options.position.lat,
		    lng = this.options.position.lng;

		// set view
		this.setView(lat, lng, this._getZoomLevel());
		
		// restart to change direction
		this.stop();
		this.start();
	},



	addHooks : function () {
		var map = this._map;
		map.on('resize', this._onResize.bind(this));
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

		// sizes
		var newSize = this._container.offsetWidth,
	    	    oldSize = this._past || newSize,
	 	    diff = oldSize - newSize,
	 	    moved = diff/2 * 0.75;
		this._past = newSize;

		// set centre to circle
		this._map.panBy([-moved, 0], {
			duration : 0
		});

	},

	createCircle : function () {

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
		this._container.style.height = d.width * 2 + 'px';
		this._container.style.width = d.width * 2 + 'px';
		this._container.style.top = offsetTop + 'px';
		this._container.style.left = offsetLeft + 'px';

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
		this._gl ? this._startGL() : this._start();
	},

	// stop spinning
	stop : function () {
		this._gl ? this._stopGL() : this._stop();
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
		var random = Math.floor(Math.random()*(max-min+1)+min);
		if (random == 13 || random == 14 || random == 15) return this._getZoomLevel();
		return random;
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


;Wu.Project = Wu.Class.extend({

	initialize : function (store) {

		// set dB object to store
		this.store = {};
		Wu.extend(this.store, store);

		// set editMode
		this.setEditMode();

		// ready save object
		this.lastSaved = {};

		// attach client
		this._client = Wu.app.Clients[this.store.client];

	},

	initFiles : function () {

		var files = this.getFiles();

		// files object
		this.files = {};

		files.forEach(function (file) {
			this.files[file.uuid] = new Wu.Files(file);
		}, this);

	},

	initLayers : function () {

		// return if no layers
		if (!this.store.layers) return;

		this.layers = {};

		// add layers to project
		this.addLayers(this.store.layers);
	},

	addLayers : function (layers) { // array of layers
		layers.forEach(function (layer) {
			this.addLayer(layer);

		}, this);
	},

	addLayer : function (layer) {
		// creates a Wu.Layer object (could be Wu.MapboxLayer, Wu.RasterLayer, etc.)
		this.store.layers.push(layer); /// TODO: WEIRD to add to array here, it's run in line 41?????
		this.layers[layer.uuid] = new Wu.createLayer(layer);

		return this.layers[layer.uuid];
	},

	addBaseLayer : function (layer) {
		this.store.baseLayers.push(layer);
		this._update('baseLayers');
	},

	removeBaseLayer : function (layer) {
		_.remove(this.store.baseLayers, function (b) { return b.uuid == layer.getUuid(); });
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

		console.log('created!', data);

		// parse layer data
		var parsed = JSON.parse(data);
		
		// callback
		app.SidePane.DataLibrary.uploaded(parsed, {
			autoAdd : true
		});

	},

	createLayer : function () {

	},

	setActive : function () {
		this.select();
	},

	setEditMode : function () {
		// set editMode
		this.editMode = false;
		if (app.Account.canUpdateProject(this.store.uuid)) this.editMode = true;
	},

	refresh : function () {

		// refresh project
		this._refresh();
	
		// refresh mappane
		this.refreshMappane();

		// refresh headerpane
		this.refreshHeaderpane();
	
		// refresh sidepane
		this.refreshSidepane();

		// set active project in sidepane
		if (this._menuItem) this._menuItem._markActive();

		if ( app.StatusPane.isOpen ) {
			app._map._controlCorners.topleft.style.opacity = 0;
			app._map._controlCorners.topleft.style.display = 'none';
		}

		// Make sure no controls appear when changing projects on mobile (get's turned on again in sidepane.js > close() )
		// if ( Wu.app.mobile && app.StatusPane.isOpen ) {
		// 	app._map._controlContainer.style.opacity = 0;
		// }
		
	},

	addNewLayer : function (layer) {
		this.addLayer(layer);
	},

	refreshSidepane : function () {
		// update sidepane
		if (Wu.Util.isObject(Wu.app.SidePane)) Wu.app.SidePane.setProject(this);
	},

	refreshHeaderpane : function () {
		// update headerpane
		if (Wu.Util.isObject(Wu.app.HeaderPane)) Wu.app.HeaderPane.setProject(this);
	},

	refreshMappane : function () {
		// update mappane                
		if (Wu.Util.isObject(Wu.app.MapPane)) Wu.app.MapPane.setProject(this);
	},

	_refresh : function () {

		// set editMode
		this.setEditMode();

		// init files
		this.initFiles();

  		// create layers 
		this.initLayers();

		// update url
		this._setUrl();

		// set settings
		this.refreshSettings();
		
		// update color theme
		this.setColorTheme();

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
		url += this._client.slug;
		url += '/';
		url += this.store.slug;
		Wu.Util.setAddressBar(url);
	},

	setNewStore : function (store) {
		this.store = store;
		this.select();
	},

	setStore : function (store) {
		this.store = store;
		this.refresh();
	},

	setMapboxAccount : function (store) {
		// full project store
		this.store = store;

		// refresh project and sidepane
		this._refresh();
		this.refreshSidepane();
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
		Wu.save('/api/project/update', string);                         // TODO: save only if actual changes! saving too much already
	
		// set status
		app.setSaveStatus();
	},

	_saveNew : function (callback) {
	     
		var options = {
			name 		: this.store.name,
			description 	: this.store.description,
			keywords 	: this.store.keywords, 
			client 		: this._client.uuid 			// parent client uuid 
		}
		var json = JSON.stringify(options);
		
 		Wu.Util.postcb('/api/project/new', json, callback.callback.bind(callback.context), this);

	},

	unload : function () {
		console.log('unload)');
		Wu.app.MapPane.reset();
		Wu.app.HeaderPane.reset();
		this.selected = false;
	},


	_delete : function () {
		// var project = this;
		var json = JSON.stringify({ 
			    'pid' : this.store.uuid,
			    'projectUuid' : this.store.uuid,
			    'clientUuid' : this._client.uuid
		});
		
		// post with callback:    path       data    callback   context of cb
		Wu.Util.postcb('/api/project/delete', json, this._deleted, this);
	},

	_deleted : function (project, json) {
		
		// remove access from Account locally
		app.Account.removeProjectAccess(project);

		// set address bar
		var client = project.getClient().getSlug();
		var url = app.options.servers.portal + client + '/';
		Wu.Util.setAddressBar(url)

		// delete object
		// delete Wu.app.Projects[project.uuid];
		delete Wu.app.Projects[project.store.uuid];

		// set no active project if was active
		if (app.activeProject == this) {
			app.SidePane.refresh(['Projects', 'Users', 'Account']);
			app.activeProject = null;
		}

		// Remove from app.Projects array
		var deleteID = project.store.uuid;
		delete app.Projects[deleteID];	

		// set status
		app.setStatus('Deleted!');
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

	_removeLayer : function (layer) {

		// console.log('___________________');
		// console.log('_removeLayer', layer);
		// console.log('lm: ', this.store.layermenu);
		// console.log('bl: ', this.store.baseLayers);
		// console.log('sl: ', this.store.layers);

		// remove from layermenu & baselayer store
		_.remove(this.store.layermenu, function (item) { return item.layer == layer.getUuid(); });
		_.remove(this.store.baseLayers, function (b) { return b.uuid == layer.getUuid(); });

		// remove from layermenu
		var layerMenu = app.MapPane.layerMenu;
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
		return app.Clients[this.store.client];
	},

	getClientUuid : function () {
		return this.store.client;
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
		// console.log('project.getLayer::', uuid);
		// console.log('this.layers', this.layers);
		return this.layers[uuid];
	},

	getStylableLayers : function () {
		// get active baselayers and layermenulayers that are editable (geojson)
		var all = this.getActiveLayers();
		var cartoLayers = _.filter(all, function (l) {

			if (l) {
				if (l.store.data.hasOwnProperty('geojson')) return true;
				if (l.store.data.hasOwnProperty('osm')) return true;

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

	setCollection : function () {

	},

	setFileAttribute : function (fileUuid, key, value) {

		console.log('setFileAttribute : DISABLED! ', fileUuid, key, value);
		return;

		// iterate
		this.project.store.files.forEach(function(file, i, arr) {
		     
			// find hit
			if (file.uuid == fileUuid) {

				// set locally
				file[key] = value;

				// create update object
				var json = {};
				json[key] = file[key];
				json.uuid = file.uuid;

				// update, no callback
				var string = JSON.stringify(json);
				Wu.save('/api/file/update', string); 
			}
		});

		// set save status
		app.setSaveStatus();
	},

	getUsers : function () {
		var uuid = this.store.uuid; // project uuid
		var users = _.filter(app.Users, function(user) {
			return user.store.role.reader.projects.indexOf(uuid) > -1;
		});
		return users;
	},

	getSlug : function () {
		return this.store.slug;
	},

	getSlugs : function () {
		var slugs = {
			project : this.store.slug,
			client : this.getClient().getSlug()
		}
		return slugs;
	},

	getUsersHTML : function () {
		var users = this.getUsers(),
		    html = '',
		    silent = app.options.silentUsers;

		users.forEach(function (user) {
			var partial = user.store.uuid.slice(0, 13);
			if (silent.indexOf(partial) == -1) { // filter silentUsers from user list
				// add user to list
				html += '<p>' + user.store.firstName + ' ' + user.store.lastName + '</p>';
			}
		}, this);
		return html;
	},

	addAccess : function () {
		var users = app.Users;
		for (u in users) {
			var user = users[u];
			if (user.isSuperadmin()) {
				user.addProjectAccess(this);
			}
		}
		app.Account.addProjectAccess(this);
	},

	getHeaderLogo : function () {
		var logo = this.store.header.logo;
		// if (!logo) logo = this.store.logo;
		if (!logo) logo = '/css/images/defaultProjectLogo.png';
		return logo;
	},

	getHeaderLogoBg : function () {
		var logo = this.store.header.logo;
		if (!logo) logo = this.store.logo;
		var url = "url('" + logo + "')";
		return url;
	},

	getHeaderTitle : function () {
		return this.store.header.title;
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
		return this.store.controls;
	},

	getSettings : function () {
		return this.store.settings;
	},

	setSettings : function (settings) {
		this.store.settings = settings;
		this._update('settings');
	},

	setFile : function (file) {
		this.store.files.push(file);
		this.files[file.uuid] = new Wu.Files(file);
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
		this.store.name = name;
		this._update('name');
	},

	setDescription : function (description) {
		this.store.description = description;
		this._update('description');
	},

	setSlug : function (name) {
		var slug = name.replace(/\s+/g, '').toLowerCase();
		slug = Wu.Util.stripAccents(slug);
		this.store.slug = slug;
		
		// save slug to server
		this._update('slug');

		// set new url
		this._setUrl();
	},

	setThumbCreated : function (bool) {
		this.store.thumbCreated = bool;
		this._update('thumbCreated');
	},

	getThumbCreated : function () {
		return this.store.thumbCreated;
	},

	setBounds : function (bounds) {
		this.store.bounds = bounds;
		this._update('bounds');
	},

	setBoundsSW : function (bounds) {
		this.store.bounds.southWest = bounds;
		this._update('bounds');		
	},

	setBoundsNE : function (bounds) {
		this.store.bounds.northEast = bounds;
		this._update('bounds');
	},

	setBoundsZoomMin : function (zoomMin) {
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

		var list = app.SidePane.DataLibrary.list,
		    layerMenu = app.MapPane.layerMenu,
		    _fids = [],
		    uuids = [],
		    that = this;

		// iterate over files and delete
		files.forEach(function(file, i, arr) {

			// remove from list
			list.remove('uuid', file.uuid);
		
			// remove from local project
			_.remove(this.store.files, function (item) { return item.uuid == file.uuid; });

			// remove from this.files
			delete this.files[file.uuid];

			// get layer if any
			var layer = _.find(this.layers, function (l) { return l.store.file == file.uuid; });

			// remove layers
			if (layer) {
				// remove from layermenu & baselayer store
				_.remove(this.store.layermenu, function (item) { return item.layer == layer.store.uuid; });
				_.remove(this.store.baseLayers, function (b) { return b.uuid == layer.store.uuid; });

				// remove from layermenu
				if (layerMenu) layerMenu.onDelete(layer);

				// remove from map
				layer.remove();
					
				// remove from local store
				var a = _.remove(this.store.layers, function (item) { return item.uuid == layer.store.uuid; });	// dobbelt opp, lagt til to ganger! todo
				delete this.layers[layer.store.uuid];	
			}
			
			// prepare remove from server
			_fids.push(file._id);
			uuids.push(file.uuid);

		}, this);

		// save changes
		this._update('layermenu'); 
		this._update('baseLayers');

		setTimeout(function () {	// ugly hack, cause two records can't be saved at same time, server side.. FUBAR!
			// remove from server
			var json = {
			    '_fids' : _fids,
			    'puuid' : that.store.uuid,
			    'uuids' : uuids
			}
			var string = JSON.stringify(json);
			Wu.save('/api/file/delete', string); 
				
		}, 1000);

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
				var thumbnail 	= '/pixels/' + file.uuid + '?width=75&height=50';
				var url 	= '/pixels/' + file.uuid + '?width=200&height=200';
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

			var thumbnail = (file.type == 'image') ? '/pixels/' + file.uuid + '?width=50&height=50' : '';
			var prefix    = (file.type == 'image') ? '/images/' 					: '/api/file/download/?file=';
			var url = prefix + file.uuid;// + suffix

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
		app.SidePane._refresh();
	},

	// settings
	toggleSetting : function (setting) {
		this.getSettings()[setting] ? this['disable' + setting.camelize()](true) : this['enable' + setting.camelize()](true);
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

	enableScreenshot : function () {
		app.SidePane.Share.enableScreenshot();
	},
	disableScreenshot : function () {
		app.SidePane.Share.disableScreenshot();
	},

	enableDocumentsPane : function (withRefresh) {
		if (withRefresh) {
			app.SidePane.addPane('Documents')
		} else {
			app.SidePane._addPane('Documents');
		}
	},
	disableDocumentsPane : function (withRefresh) {
		if (withRefresh) {
			app.SidePane.removePane('Documents')
		} else {
			app.SidePane._removePane('Documents');
		}
	},

	enableDataLibrary : function (withRefresh) {
		if (withRefresh) {
			app.SidePane.addPane('DataLibrary')
		} else {
			app.SidePane._addPane('DataLibrary');
		}
	},
	disableDataLibrary : function (withRefresh) {
		if (withRefresh) {
			app.SidePane.removePane('DataLibrary')
		} else {
			app.SidePane._removePane('DataLibrary');
		}
	},

	enableMediaLibrary : function () {
		// app.SidePane.addPane('MediaLibrary');	// not plugged in yet! 
	},
	disableMediaLibrary : function () {
		// app.SidePane.removePane('MediaLibrary');
	},

	enableSocialSharing : function (withRefresh) {
		if (withRefresh) {
			app.SidePane.addPane('Share')
		} else {
			app.SidePane._addPane('Share');
		}
	},
	disableSocialSharing : function (withRefresh) {
		if (withRefresh) {
			app.SidePane.removePane('Share')
		} else {
			app.SidePane._removePane('Share');
		}
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

	// CXX – Now this is all over the place... see sidepane.project.js > makeNewThumbnail() etc...
	createProjectThumb : function () {

		console.log('createProjectThumb');

		// Set the grinding wheel until logo is updated
		this.setTempLogo();

		app.setHash(function (ctx, hash) {

			var obj = JSON.parse(hash);

			console.log('obj', obj);

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
		var result = JSON.parse(json);
		var image = result.cropped;

		var fileUuid = result.fileUuid;

		var path = '/images/' + image;

		// Store new logo paths
		context.setLogo(path);
		context.setHeaderLogo(path);

		context._menuItem.logo.src = path;

		// Set logo in header pane
		if (context == app.activeProject) app.HeaderPane.addedLogo(image);

	},	

	setTempLogo : function () {
		this._sidePaneLogoContainer.src = '/css/images/grinders/BG-grinder-small-grayDark-on-white.gif';
	}	




});;Wu.Client = Wu.Class.extend({

	initialize : function (options) {

		// set options
		Wu.extend(this, options);

		// set defaults
		this.options = {};
		this.options.editMode = false;

	},

	setEditMode : function () {
		// set editMode
		this.editMode = false;
		if (app.Account.canUpdateClient(this.uuid)) this.editMode = true;
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

	update : function (field) {
		var json    = {};
		json[field] = this[field];
		json.uuid   = this.uuid;
		var string  = JSON.stringify(json);
		this._save(string);
	},

	_save : function (string) {
		Wu.save('/api/client/update', string);  // TODO: pgp & callback
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

	getDescription : function () {
		return this.description;
	},

	getLogo : function () {
		return this.logo;
	},

	getUuid : function () {
		return this.uuid;
	},

	getSlug : function () {
		return this.slug;
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


});;Wu.User = Wu.Class.extend({ 

	initialize : function (store) {
		this.store = store;
		this.lastSaved = _.cloneDeep(store);
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

	setAccess : function (project) {
		// console.log('setAccess to new proejct: ', project);
		// todo!
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
		Wu.save('/api/user/update', JSON.stringify(changes)); 
	},


	// convenience method
	isSuperuser : function () {
		return this.isSuperadmin();
	},
	isSuperadmin : function () {
		if (this.store.role.superadmin) return true;
		return false;
	},
	isAdmin : function () {
		if (this.store.role.admin) return true;
		return false;
	},
	isManager : function () {
		if (_.size(this.store.role.manager.projects) > 0 || this.isAdmin() || this.isSuperadmin()) return true;
		return false;
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


	// set project access
	delegateAccess : function (project, role, add) {

		// save to server, only specific access
		var access = {
			userUuid    : this.getUuid(),
			projectUuid : project.getUuid(),
			// clientUuid  : project.getClientUuid(),
			role        : role, // eg. 'reader'
			add         : add // true or false
		}

		// post              path 	             data               callback     context of cb
		Wu.Util.postcb('/api/user/delegate', JSON.stringify(access), this.delegatedAccess, this);

		// this._saveAccess(access)
		app.setSaveStatus();
	},

	delegatedAccess : function (context, result) {

	},

	// convenience methods
	addReadProject : function (project) {

		// save to server, only specific access
		this.delegateAccess(project, 'reader', true);

		// add access locally
		this.store.role.reader.projects.push(project.getUuid());

	},

	removeReadProject : function (project) {

		// save to server, only specific access
		this.delegateAccess(project, 'reader', false);

		// remove access locally
		_.remove(this.store.role.reader.projects, function (p) {
			return p == project.getUuid();
		});
	},

	addUpdateClient : function (client) {
		
		// save to server, only specific access
		// this.delegateAccess(client, 'editor', true);

		// add access locally
		this.store.role.editor.clients.push(client.getUuid());
	},

	addUpdateProject : function (project) {
		
		// save to server, only specific access
		this.delegateAccess(project, 'editor', true);

		// add access locally
		this.store.role.editor.projects.push(project.getUuid());
	},

	removeUpdateProject : function (project) {

		// save to server, only specific access
		this.delegateAccess(project, 'editor', false);

		// remove access
		_.remove(this.store.role.editor.projects, function (p) {
			return p == project.getUuid();
		});
	},


	addManageProject : function (project) {
		// save to server, only specific access
		this.delegateAccess(project, 'manager', true);

		// add access locally
		this.store.role.manager.projects.push(project.getUuid());
	},

	removeManageProject : function (project) {

		// save to server, only specific access
		this.delegateAccess(project, 'manager', false);

		// remove access
		_.remove(this.store.role.manager.projects, function (p) {
			return p == project.getUuid();
		});
	},


	addProjectAccess : function (project) {
		// add access locally
		var uuid = project.getUuid();
		this.store.role.editor.projects.push(uuid);
		this.store.role.reader.projects.push(uuid);
		this.store.role.manager.projects.push(uuid);
	},

	removeProjectAccess : function (project) {
		// remove access locally
		_.remove(this.store.role.manager.projects, function (p) {
			return p == project.getUuid();
		});
		_.remove(this.store.role.editor.projects, function (p) {
			return p == project.getUuid();
		});
		_.remove(this.store.role.reader.projects, function (p) {
			return p == project.getUuid();
		});
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

	getProjects : function () {
		var projects = [];
		projects.push(this.store.role.reader.projects);
		projects.push(this.store.role.editor.projects);
		projects.push(this.store.role.manager.projects);
		projects = _.flatten(projects);
		projects = _.unique(projects);
		return projects;
	},

	getProjectsByRole : function () {
		var projects    = {};
		projects.read   = this.store.role.reader.projects;
		projects.update = this.store.role.editor.projects;
		projects.manage = this.store.role.manager.projects;
		return projects;
	},

	getClients : function () {
		var clients = {};
		clients.read = this.store.role.reader.clients;
		clients.update = this.store.role.editor.clients;
		return clients;
	},

	getUuid : function () {
		return this.store.uuid;
	},














	// CRUD
	canCreateProject : function () {
		var user = this.store;
		if (user.role.superadmin) return true;
		if (user.role.admin)      return true;
		return false;
	},

	canReadProject : function (projectUuid) {
		var user = this.store;
		if (user.role.superadmin) return true;
		// if (user.role.admin)      return true;
		// if (user.role.manager.projects.indexOf(projectUuid) >= 0) return true; // managers can create readers for own projects
		// if (user.role.editor.projects.indexOf(projectUuid)  >= 0) return true; // managers can create readers for own projects
		
		if (user.role.reader.projects.indexOf(projectUuid)  >= 0) return true;
		return false;
	},

	canUpdateProject : function (projectUuid) {
		var user = this.store;
		if (user.role.superadmin) return true;
		if (user.role.editor.projects.indexOf(projectUuid) >= 0) return true; // managers can create readers for own projects
		return false;
	},

	canDeleteProject : function (projectUuid) {
		var user = this.store;
		var editor = (user.role.editor.projects.indexOf(projectUuid) >= 0) ? true : false;
		if (user.role.superadmin) return true;
		// if (user.role.superadmin && editor) return true;
		if (user.role.admin && editor)      return true;
		return false;
	},

	canManageProject : function (projectUuid) {
		var user = this.store;
		if (user.role.superadmin) return true;
		// if (user.role.admin)      return true;
		if (user.role.manager.projects.indexOf(projectUuid) >= 0) return true;
		return false;
	},

	canCreateClient : function () {
		var user = this.store;
		if (user.role.superadmin) return true;
		if (user.role.admin)      return true;
		return false;
	},
	
	canReadClient : function (uuid) {
		var user = this.store;
		if (user.role.superadmin) return true;
		// if (user.role.admin)      return true;
		// if (user.role.manager.clients.indexOf(uuid) >= 0) return true; // managers can create readers for own projects
		// if (user.role.editor.clients.indexOf(uuid)  >= 0) return true; // managers can create readers for own projects
		if (user.role.reader.clients.indexOf(uuid)  >= 0) return true; // managers can create readers for own projects
		return false;
	},

	canUpdateClient : function (uuid) {
		var user = this.store;

		if (user.role.superadmin) return true;
		// if (user.role.admin)      return true;
		if (this.store.role.editor.clients.indexOf(uuid) >= 0) return true; // managers can create readers for own projects
		return false;
	},

	canDeleteClient : function (clientUuid) {
		var editor = (this.store.role.editor.clients.indexOf(clientUuid) >= 0) ? true : false;
		if (this.store.role.superadmin && editor) return true;
		if (this.store.role.admin && editor)      return true;
		return false;	
	},

	canCreateSuperadmin : function () {
		// var user = this.store;
		if (this.store.role.superadmin) return true;
		return false;
	},

	canCreateAdmin : function () {
		var user = this.store;
		if (user.role.superadmin) return true;
		if (user.role.admin)      return true; 	// admins can create other admins
		return false;
	},

	canCreateUser : function (uuid) {
		var user = this.store;
		if (user.role.superadmin) return true;
		if (user.role.admin)      return true;
		if (user.role.manager.projects.indexOf(uuid) >= 0) return true;
		return false;
	},

	canUpdateUser : function () {
		var user = this.store;
		if (user.role.superadmin) return true;
		if (user.role.admin)      return true;

		// todo
		return false;	
	},

	canDeleteUser : function () {

	},





	// find changes to user.store for saving to server. works for two levels deep // todo: refactor, move to class?
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

});;Wu.Layer = Wu.Class.extend({

	type : 'layer',

	options : {

		hoverTooltip : true,	// hover instead of click

	},

	initialize : function (layer) {

		// set source
		this.store = layer; // db object
		
		// data not loaded
		this.loaded = false;

		// create leaflet layers
		this.initLayer();

		// all visible tiles loaded event
		Wu.DomEvent.on(this.layer, 'load', function () {
			app._loaded.push(this.getUuid());
			app._loaded = _.uniq(app._loaded);
		}, this);

		// get zIndex control
		this._zx = app.MapPane.getZIndexControls();
	},

	initLayer : function () {
		// create Leaflet layer, load data if necessary
	},

	add : function (type) {
		if (type == 'baselayer') this._isBase = true;
		this.addTo();
	},

	addTo : function () {
		
		// add to map
		this._addTo();
		
		// add to controls
		this.addToControls();

	},

	_addTo : function (type) {
		var map = app._map;

		// leaflet fn
		this.layer.addTo(map);

		// add to active layers
		app.MapPane.addActiveLayer(this);	// includes baselayers

		// add gridLayer if available
		if (this.gridLayer) map.addLayer(this.gridLayer);

		// update zindex
		this._addToZIndex(type);

	},

	addToControls : function () {
		if (this._isBase) return;

		this._addToLegends();
		this._addToInspect();
		this._addToDescription();
		this._addToLayermenu();
	},

	_addToLayermenu : function () {

		// activate in layermenu
		var layerMenu = app.MapPane.layerMenu;
		layerMenu && layerMenu._enableLayer(this.getUuid());
	},

	_addToLegends : function () {

		// add legends if active
		var legendsControl = app.MapPane.legendsControl;
		legendsControl && legendsControl.addLegend(this);
	},

	_addToInspect : function () {

		// add to inspectControl if available
		var inspectControl = app.MapPane.inspectControl;		
		if (inspectControl) inspectControl.addLayer(this);

	},

	_addToDescription : function () {

		// add to descriptionControl if available
		var descriptionControl = app.MapPane.descriptionControl;
		if (!descriptionControl) return;

		descriptionControl.setLayer(this);

		// hide if empty and not editor
		var isEditor = app.Account.isSuperadmin() || app.Account.canUpdateProject(app.activeProject.getUuid());
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
		var zx = this._zx;
		this._isBase ? zx.b.add(this) : zx.l.add(this); // either base or layermenu
	},

	_removeFromZIndex : function () {
		var zx = this._zx;
		this._isBase ? zx.b.remove(this) : zx.l.remove(this);
	},

	remove : function (map) {
		var map = map || app._map;

		// leaflet fn
		map.removeLayer(this.layer);

		// remove from active layers
		app.MapPane.removeActiveLayer(this);	

		// remove gridLayer if available
		if (this.gridLayer) map.removeLayer(this.gridLayer); 

		// remove from zIndex
		this._removeFromZIndex();

		// remove from inspectControl if available
		var inspectControl = app.MapPane.inspectControl;			// refactor to events
		if (inspectControl) inspectControl.removeLayer(this);

		// remove from legendsControl if available
		var legendsControl = app.MapPane.legendsControl;
		if (legendsControl) legendsControl.removeLegend(this);

		// remove from descriptionControl if avaialbe
		var descriptionControl = app.MapPane.descriptionControl;
		if (descriptionControl) {
			descriptionControl.removeLayer(this);
			descriptionControl._container.style.display = 'none'; // (j)		// refactor to descriptionControl
		}
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
	},

	getUuid : function () {
		return this.store.uuid;
	},

	getFileUuid : function () {
		return this.store.file;
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
		return false;
	},

	setCartoCSS : function (json, callback) {

		// send to server
		Wu.post('/api/layers/cartocss/set', JSON.stringify(json), callback, this);
	
		// set locally on layer
		this.setCartoid(json.cartoid);
	},

	getCartoCSS : function (cartoid, callback) {

		console.log('getCartoCSS', cartoid);

		var json = {
			cartoid : cartoid
		}

		// get cartocss from server
		Wu.post('/api/layers/cartocss/get', JSON.stringify(json), callback, this);
	},

	getMeta : function () {
		var metajson = this.store.metadata;
		if (metajson) return JSON.parse(metajson);
		return false;
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
		var meta = JSON.parse(json);
		return meta;
	},

	setTooltip : function (meta) {
		this.store.tooltip = JSON.stringify(meta);
		this.save('tooltip');
	},

	getLegends : function () {
		var meta = this.store.legends
		if (meta) return JSON.parse(meta);
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
		var grid = this.gridLayer;
		if (!grid) return;

		
		// add click event
		grid.on('mousedown', function(e) {
			if (!e.data) return;

			// pass layer
			e.layer = this;

			// add to pending
			app.MapPane._addPopupContent(e);

			var event = e.e.originalEvent;
			this._event = {
				x : event.x,
				y : event.y
			}

		}, this);

		grid.on('mouseup', function (e) {
			if (!e.data) return;

			// pass layer
			e.layer = this;

			var event = e.e.originalEvent;

			if (this._event === undefined || this._event.x == event.x) {
				// open popup 
				app.MapPane.openPopup(e);
			} else {
				// clear old
				app.MapPane._clearPopup();
			}

		}, this);

		grid.on('click', function (e) {
			// clear old
			app.MapPane._clearPopup();

		}, this);
	},
});




Wu.RasterLayer = Wu.Layer.extend({

	type : 'rasterLayer',

});


// systemapic layers
Wu.CartoCSSLayer = Wu.Layer.extend({

	initLayer : function () {
		this.update();
	},

	update : function () {
		var map = app._map;

		// remove
		if (this.layer) this.remove();

		this._fileUuid = this.store.file;
		this._defaultCartoid = 'cartoid';

		// prepare raster
		this._prepareRaster();

		// prepare utfgrid
		this._prepareGrid();
		
	},

	_prepareRaster : function () {
		
		// set ids
		var fileUuid 	= this._fileUuid,	// file id of geojson
		    cartoid 	= this.store.data.cartoid || this._defaultCartoid,
		    tileServer 	= app.options.servers.tiles.uri,
		    subdomains  = app.options.servers.tiles.subdomains,
		    token 	= app.accessToken,
		    url 	= tileServer + '{fileUuid}/{cartoid}/{z}/{x}/{y}.png' + token;

		// add vector tile raster layer
		this.layer = L.tileLayer(url, {
			fileUuid: this._fileUuid,
			cartoid : cartoid,
			subdomains : subdomains,
			maxRequests : 0,
		});
	},

	_prepareGrid : function () {

		// set ids
		var fileUuid 	= this._fileUuid,	// file id of geojson
		    cartoid 	= this.store.data.cartoid || 'cartoid',
		    gridServer 	= app.options.servers.utfgrid.uri,
		    subdomains  = app.options.servers.utfgrid.subdomains,
		    token 	= app.accessToken,
		    url 	= gridServer + fileUuid + '/{z}/{x}/{y}.grid.json' + token;
		
		// create gridlayer
		this.gridLayer = new L.UtfGrid(url, {
			useJsonP: false,
			// subdomains: 'ijk',
			subdomains: subdomains,
			// subdomains: 'ghi',
			maxRequests : 10,
			requestTimeout : 20000
		});

		// debug
		// this.gridLayer = false;

		// add grid events
		this._addGridEvents();

	},

	updateStyle : function () {
		var map = app._map;	
		

		// if (this.layer) {
		// 	this.update();
		// 	this.addTo(map);
		// } else {
		// 	this.update();
		// }

		console.log('this._zx: ', this._zx);

		// var zindex = this._zx.get(this);

		// console.log('zindeX: ', zindex);

		// update
		this.update();

		// add to map
		this.addTo(map); // refactor

	},

	_typeLayer : function () {

	},

});




Wu.OSMLayer = Wu.CartoCSSLayer.extend({


	update : function () {
		var map = app._map;

		// remove
		if (this.layer) this.remove();

		// id of data 
		this._fileUuid = 'osm';
		this._defaultCartoid = 'cartoidosm';

		// prepare raster
		this._prepareRaster();

		// prepare utfgrid
		this._prepareGrid();
		
	},

	_prepareRaster : function () {
		
		// set ids
		var fileUuid 	= this._fileUuid,	// file id of geojson
		    cartoid 	= this.store.data.cartoid || this._defaultCartoid,
		    tileServer 	= app.options.servers.osm.uri,
		    subdomains  = app.options.servers.osm.subdomains,
		    token 	= app.accessToken,
		    url 	= tileServer + '{fileUuid}/{cartoid}/{z}/{x}/{y}.png' + token;

		// add vector tile raster layer
		this.layer = L.tileLayer(url, {
			fileUuid: this._fileUuid,
			cartoid : cartoid,
			subdomains : subdomains,
			maxRequests : 0,
		});
	},

	_prepareGrid : function () {

		// set ids
		var fileUuid 	= this._fileUuid,	// file id of geojson
		    cartoid 	= this.store.data.cartoid || 'cartoid',
		    gridServer 	= app.options.servers.osm.uri,
		    subdomains  = app.options.servers.osm.subdomains,
		    token 	= app.accessToken,
		    url 	= gridServer + fileUuid + '/{z}/{x}/{y}.grid.json' + token;
		
		// create gridlayer
		// this.gridLayer = new L.UtfGrid(url, {
		// 	useJsonP: false,
		// 	subdomains: subdomains,
		// 	// subdomains: 'ijk',
		// 	// subdomains: 'ghi',
		// 	maxRequests : 10,
		// 	requestTimeout : 20000
		// });

		// debug
		this.gridLayer = false;

		// add grid events
		this._addGridEvents();

	},

	getFileUuid : function () {
		return 'osm';
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


});


Wu.MapboxLayer = Wu.Layer.extend({

	type : 'mapboxLayer',
	
	initLayer : function () {

		// create Leaflet.mapbox tileLayer
		this.layer = L.mapbox.tileLayer(this.store.data.mapbox, {
			accessToken : this.store.accessToken
		});

		// create gridLayer if available
		if ('grids' in this.store) this.gridLayer = L.mapbox.gridLayer(this.store.data.mapbox);

		// mark as loaded
		this.loaded = true;
	},
});


Wu.CartodbLayer = Wu.Layer.extend({

});


// shorthand for creating all kinds of layers
Wu.createLayer = function (layer) {

	// mapbox
	if (layer.data.mapbox) return new Wu.MapboxLayer(layer);

	// systemapic vector tiles todo: store not as geojson, but as vector tiles in project db model?
	if (layer.data.geojson) return new Wu.CartoCSSLayer(layer);
	
	// osm
	if (layer.data.osm) return new Wu.OSMLayer(layer);

	// topojson
	if (layer.data.topojson) return new Wu.TopojsonLayer(layer);
}



















































// Wu.GeojsonLayer = Wu.Layer.extend({

// 	type : 'geojsonLayer',


// 	initLayer : function () {
// 		var that = this;
	       
// 		// create leaflet geoJson layer
// 		this.layer = L.geoJson(false, {

// 			// create popup
// 			onEachFeature : this.createPopup
// 		});

// 	},

// 	add : function (map) {
// 		this.addTo(map);
// 	},

// 	addTo : function (map) {
// 		var map   = map || Wu.app._map;
// 		var layer = this.layer;
		
// 		// load data if not loaded
// 		if (!this.loaded) this.loadData();
				
// 		// set hover popup
// 		this.bindHoverPopup();

// 		// add to drawControl
// 		var drawControl = app.MapPane.editableLayers;
// 		drawControl.addLayer(layer);

// 	},

// 	remove : function (map) {
// 		var map = map || Wu.app._map;
// 		var layer = this.layer;
		
// 		// remove from editableLayers 
// 		var editableLayers = app.MapPane.editableLayers;
// 		editableLayers.removeLayer(layer);

// 		// remove hooks
// 		this.removeLayerHooks();

// 	},

// 	addLayerHooks : function () {

// 		this.layer.eachLayer(function (layr) {
			
// 			var type = layr.feature.geometry.type;

// 			if (type == 'Polygon') {

// 				Wu.DomEvent.on(layr, 'styleeditor:changed', this.styleChanged, this);

// 			} 

// 			if (type == 'MultiPolygon') {

// 				layr.eachLayer(function (multi) {

// 					Wu.DomEvent.on(multi, 'styleeditor:changed', function (data) {
// 						this.multiStyleChanged(data, multi, layr);
// 					}, this);

// 				}, this);
// 			}

// 		}, this);	
	
// 	},	

// 	removeLayerHooks : function () {
// 		for (l in this.layer._layers) {
// 			var layer = this.layer._layers[l];

// 			// listen to changes
// 			Wu.DomEvent.off(layer, 'styleeditor:changed', this.styleChanged, this);
// 		}
// 	},

// 	getGeojsonUuid : function () {
// 		return this.store.data.geojson;
// 	},

// 	loadData : function () {
// 		var that = this;

// 		// do nothing if already loaded
// 		if (this.loaded) return; 

// 		// set status
// 		app.setStatus('Loading...');


// 		// get geojson from server
// 		var data = { 
// 			uuid : this.getGeojsonUuid(),
// 			projectUuid : app.activeProject.getUuid() 
// 		}
// 		var json = JSON.stringify(data);
	
		
// 		// post with callback:   path       data    callback   context of cb
// 		// Wu.Util.postcb('/api/geojson', json, this._loaded, this);
// 		var path = '/api/geojson';
		
// 		var http = new XMLHttpRequest();
// 		var url = window.location.origin; //"http://85.10.202.87:8080/";// + path;//api/project/update";
// 		url += path;

// 		// track progress
// 		var dataSize = this.getDataSize();
// 		if (dataSize) {
// 			var that = this;
// 			http.addEventListener("progress", function (oe) {
// 				var percent = Math.round( oe.loaded / dataSize * 100);
// 				that.setProgress(percent);

// 			}, false);
// 		}
		
// 		http.open("POST", url, true);

// 		//Send the proper header information along with the request
// 		http.setRequestHeader("Content-type", "application/json");

// 		http.onreadystatechange = function() {
// 			if (http.readyState == 4 && http.status == 200) {			// todo: refactor
// 				that.dataLoaded(that, http.responseText);
// 			}
// 		}
// 		http.send(json);

// 	},

// 	// callback after loading geojson from server
// 	dataLoaded : function (that, json) {

// 		// set progress done
// 		that.setProgress(100);

// 		// parse json into geojson object
// 		try { that.data = JSON.parse(json); }
// 		catch (e) { return console.log('parse error!', json)}
		
// 		// console.log('Got geojson: ', that.data);

// 		// return if errors
// 		if (!that.data) return console.error('no data');
// 		if (that.data.error) return console.error(that.data.error);

// 		// add data to layer
// 		that.layer.addData(that.data);

// 		// mark loaded
// 		that.loaded = true;

// 		// set opacity
// 		that.setOpacity()

// 		// render saved styles of geojson
// 		that.renderStyle();

// 		// set status
// 		app.setStatus('Loaded!');

// 		// hide progress bar
// 		this.hideProgress();

// 		// add layer hooks
// 		this.addLayerHooks();

// 		// phantomjs _loaded
// 		app._loaded.push(this.getUuid());
// 		// console.log('GEOJSON: ', this);

// 	},

// 	getDataSize : function () {

// 		var fileUuid = this.getFileUuid();
// 		if (!fileUuid) return false;

// 		var file = this.getFile(fileUuid);

// 		return parseInt(file.dataSize);

// 	},

// 	getFileUuid : function () {
// 		return this.store.file;
// 	},

// 	getFile : function (fileUuid) {

// 		var files = app.activeProject.getFiles();
// 		var file = _.find(files, function (f) {
// 			return f.uuid == fileUuid;
// 		});

// 		return file;

// 	},

// 	progress : function (p) {
// 		this.setProgress(p);
// 	},

// 	setProgress : function (percent) {
// 		// set progress bar
// 		app.ProgressBar.setProgress(percent);
// 	},

// 	hideProgress : function () {
// 		// hide progress bar
// 		app.ProgressBar.hideProgress();
// 	},

	
// 	getContainer : function () {

// 		// return

// 	},

// 	// set visibility : visible on layer
// 	show : function () {
// 		for (l in this.layer._layers) {
// 			var layer = this.layer._layers[l];
// 			layer._container.style.visibility = 'visible';
// 		}
// 	},

// 	// set visibility : hidden on layer
// 	hide : function () {
// 		for (l in this.layer._layers) {
// 			var layer = this.layer._layers[l];
// 			layer._container.style.visibility = 'hidden';
// 		}
// 	},

// 	multiStyleChanged : function (data, multi, layr) {

// 		var layer = layr;
// 		var style = data.style;
// 		var __sid = layer.feature.properties.__sid;

// 		layer.setStyle(style);	// good! does the whole multipolgyon (of multipolygons)

// 		this.saveStyle(style, __sid);	// works

// 	},

// 	styleChanged : function (data) {

// 		var style = data.style;
// 		var target = data.target;
// 		var id = target._leaflet_id;
// 		var layer = this.getPathParentLayer(id);
// 		var __sid = target.feature.properties.__sid;

// 		// save style
// 		this.saveStyle(style, __sid);

// 	},

// 	getPathParentLayer : function (id) {
// 		return app.MapPane.getEditableLayerParent(id);
// 	},

// 	// save style to layer object
// 	saveStyle : function (style, __sid) {	
			
// 		var json = this.layer.toGeoJSON();

// 		var json = {};
// 		json.layer  = this.getUuid();
// 		json.uuid   = this.getProjectUuid(); // active project uuid

// 		json.style = {
// 			__sid : __sid,
// 			style : style 		// partial
// 		}

// 		// send to server
// 		this._save(json);

// 		// set staus msg
// 		app.setSaveStatus();

// 	},

// 	renderStyle : function () {

// 		var styles = this.store.style;
// 		var layers = this.layer._layers;

// 		for (l in layers) {
// 			var layer = layers[l];
// 			var __sid = layer.feature.properties.__sid;

// 			var style = _.find(styles, function (s) {
// 				return s.__sid == __sid;
// 			});

// 			if (style) {
// 				var parsed = JSON.parse(style.style);
// 				layer.setStyle(parsed);
// 			}
// 		}

// 	},
	
// 	setOpacity : function (opacity) {

// 		// set opacity for now or later
// 		this.opacity = opacity || this.opacity || 0.2;
		
// 		// return if data not loaded yet
// 		if (!this.loaded) return;

// 		// set style 
// 		this.layer.setStyle({
// 			opacity : this.opacity, 
// 			fillOpacity : this.opacity
// 		});

// 	},

// 	getOpacity : function () {
// 		return this.opacity || 0.2;
// 	},


// 	// create tooltip
// 	createPopup : function (feature, layer) {

// 		// return if no features in geojson
// 		if (!feature.properties) return;

// 		// create popup
// 		var popup = L.popup({
// 			offset : [0, -5],
// 			closeButton : false,
// 			zoomAnimation : false,
// 			maxWidth : 1000,
// 			minWidth : 200,
// 			maxHeight : 150
// 		});

// 		// create content
// 		var string = '';
// 		for (key in feature.properties) {
// 			var value = feature.properties[key];
// 			// if not empty value
// 			if (value != 'NULL' && value!= 'null' && value != null && value != '' && value != 'undefined' && key != '__sid') {
// 				// add features to string
// 				string += key + ': ' + value + '<br>';
// 			}
// 		}

// 		// if nothing, return
// 		if (string.length == 0) return;

// 		// set content
// 		popup.setContent(string);
		
// 		// bind popup to layer
// 		layer.bindPopup(popup);
		
// 	},


// 	setPopupPosition : function (e) {
// 		var popup = e.layer._popup;
// 		var latlng = app._map.mouseEventToLatLng(e.originalEvent);
// 		popup.setLatLng(latlng);
// 	},

// 	bindHoverPopup : function () {
// 		var that = this;

// 	}
// });



// topojson layer
Wu.TopojsonLayer = Wu.Layer.extend({

	type : 'topojsonLayer',

	initLayer : function () {
		var that = this;
	       
		// create leaflet geoJson layer
		this.layer = L.topoJson(false, {
			// create popup
			onEachFeature : this.createPopup
		});

	}	
});

// extend leaflet geojson with topojson conversion (test) - works! but doesn't solve any problems
L.TopoJSON = L.GeoJSON.extend({
	addData: function(jsonData) {    
		if (jsonData.type === "Topology") {
			for (key in jsonData.objects) {
				geojson = topojson.feature(jsonData, jsonData.objects[key]);
				L.GeoJSON.prototype.addData.call(this, geojson);
			}
		} 
		else {
			L.GeoJSON.prototype.addData.call(this, jsonData);
		}
	}  
});

L.topoJson = function (json, options) {
	return new L.TopoJSON(json, options);
};


// // topojson layer with d3.js
// L.TopojsonLayer = L.Class.extend({

// 	initialize: function (data, options) {
		
// 		L.setOptions(this, options);
// 	},

// 	onAdd: function (map) {
// 		this._map = map;

// 		// create a DOM element and put it into one of the map panes
// 		this._el = L.DomUtil.create('div', 'topojson-layer leaflet-zoom-hide');
// 		map.getPanes().overlayPane.appendChild(this._el);

// 		// add a viewreset event listener for updating layer's position, do the latter
// 		map.on('viewreset', this._reset, this);
// 		this._reset();
// 	},

// 	onRemove: function (map) {
// 		// remove layer's DOM elements and listeners
// 		map.getPanes().overlayPane.removeChild(this._el);
// 		map.off('viewreset', this._reset, this);
// 	},

// 	_reset: function () {
// 		// update layer's position
// 		var pos = this._map.latLngToLayerPoint(this._latlng);
// 		L.DomUtil.setPosition(this._el, pos);
// 	}
// });

// L.topoJson = function (data, options) {
// 	return new L.TopojsonLayer(data, options);
// };


;Wu.Files = Wu.Class.extend({

	_ : 'file',

	initialize : function (store) {

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




	// setters
	setName : function (name) {
		this.store.name = name;
		this.save('name');
	},

	setKeywords : function (keywords) {
		this.store.keywords = keywords; // todo: must be array
		this.save('keywords');
	},

	setFormat : function (format) {
		this.store.format = format;
		this.save('format');
	},

	setCategory : function (category) {
		console.log('Wu.Files.setCategory: ', category);

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
	_delete : function () {

	},
















});;var systemapicConfigOptions = {
		
	id : 'app',

	portalName : 'systemapic',	// plugged in
	portalLogo : false,		// not plugged in.. using sprites atm..
	portalTitle : 'Systemapic Secure Portal: Rüppells Griffon',
	
	// sidepane
	panes : {
		// plugged in and working! :)
		clients 	: true,
		mapOptions 	: true,
		documents 	: true,               	
		dataLibrary 	: true,               	
		users 		: true,
		share 		: true,
		mediaLibrary    : false,
		account 	: true
	},	
	
	// default settings (overridden by project settings)
	settings : {		// not plugged in yet
		chat : true,
		colorTheme : true,
		screenshot : true,
		socialSharing : true,
		print : true
	},

	providers : {
		// default accounts, added to all new (and old?) projects
		mapbox : [{	
			username : 'systemapic',
			accessToken : 'pk.eyJ1Ijoic3lzdGVtYXBpYyIsImEiOiJkV2JONUNVIn0.TJrzQrsehgz_NAfuF8Sr1Q'
		}]
	},

	servers : {

		// portal SX
		portal   : 'https://projects.ruppellsgriffon.com/',	// api

		// tiles SX
		tiles : {
			uri : 'https://{s}.systemapic.com/r/',
			subdomains : 'abcd' // sx
		},

		// utfgrid SX
		utfgrid : {
			uri : 'https://{s}.systemapic.com/u/',
			subdomains : 'abcd' // sx
		},

		// osm PX
		osm : {
			base : 'https://m.systemapic.com/',
			uri : 'https://{s}.systemapic.com/r/',
			subdomains : 'mnop' // px
		}


	},

	silentUsers : [
		// redacted
		'user-9fed4b5f', // k
		'user-e6e5d7d9'  // j  // todo: add phantomJS user
	]
}
;Wu.version = '0.4-dev';
Wu.App = Wu.Class.extend({
	_ : 'app',

	// debug : true,

	// default options
	options : systemapicConfigOptions, // global var from config.js... perhaps refactor.

	_ready : false,

	initialize : function (options) {

		// set global this
		Wu.app = this;

		// merge options
		Wu.setOptions(this, options);   

		// set options
		L.mapbox.config.FORCE_HTTPS = true;
		L.mapbox.accessToken = this.options.providers.mapbox[0].accessToken; // todo: move to relevant place

		// set page title
		document.title = this.options.portalTitle;

		// get objects from server
		this.initServer();

		// Detect mobile devices
		this.detectMobile();

	},


	detectMobile : function() {
		
		// Detect if it's a mobile
		if ( L.Browser.mobile ) {

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

	initServer : function () {
		console.log('Securely connected to server: \n', this.options.servers.portal);

		var data = JSON.stringify(this.options);
		
		// post         path          json      callback    this
		Wu.post('/api/portal', data, this.initServerResponse, this);

	},

	initServerResponse : function (that, response) {
		var resp = JSON.parse(response);

		// revv it up
		that.initApp(resp);
	},


	initApp : function (o) {
		// set vars
		this.options.json = o;

		// create app container
		this._initContainer();

		// load dependencies
		this._initDependencies();

		// load json model
		this._initObjects();

		// create panes
		this._initPanes();

		// init pane view
		this._initView();

		// init global events
		this._initEvents();

		// ready
		this._ready = true;

		// debug
		this._debug();

	},

	_initEvents : function () {
		Wu.DomEvent.on(window, 'resize', this._resizeEvents, this);
	},

	_resizeEvents : function (e) {

		// get window dimensions
		var dimensions = this._getDimensions(e);

		// startpane resize event
		if ( app.StartPane.isOpen ) app.StartPane.resizeEvent(dimensions);

		// mappane resize event
		if (app.MapPane) app.MapPane.resizeEvent(dimensions);

		// legends control resize
		var legendsControl = app.MapPane.legendsControl;
		if (legendsControl) legendsControl.resizeEvent(dimensions);

		// layermenu control resize
		var layermenuControl = app.MapPane.layerMenu;
		if (layermenuControl) layermenuControl.resizeEvent(dimensions);

	},

	_getDimensions : function (e) {
		var w = window,
		    d = document,
		    e = d.documentElement,
		    g = d.getElementsByTagName('body')[0],
		    x = w.innerWidth || e.clientWidth || g.clientWidth,
		    y = w.innerHeight|| e.clientHeight|| g.clientHeight;

		var d = {
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

	_initDependencies : function () {

		// icanhaz templates
		ich.grabTemplates()

	},

	
	_isDev : function (user) {
		if (user.uuid.slice(0,-13) == 'user-b76a8d27-6db6-46e0-8fc3') return true; // phantomJS user
		if (user.uuid.slice(0,-13) == 'user-9fed4b5f-ad48-479a-88c3') return true; // phantomJS user
		if (user.uuid.slice(0,-13) == 'user-e6e5d7d9-3b4c-403b-ad80') return true; // phantomJS user
		return false;
	},

	_initObjects : function () {

		// main user account
		this.Account = new Wu.User(this.options.json.account);
		
		// set access token
		this.setToken();

		// create user objects
		this.Users = {};
		this.options.json.users.forEach(function(user, i, arr) {
		       if (!this._isDev(user)) this.Users[user.uuid] = new Wu.User(user);             
		}, this);
		
		// create client objects
		this.Clients = {};
		this.options.json.clients.forEach(function(elem, i, arr) {
		       this.Clients[elem.uuid] = new Wu.Client(elem, this);             
		}, this);

		// create project objects
		this.Projects = {}      ;
		this.options.json.projects.forEach(function(elem, i, arr) {
		       this.Projects[elem.uuid] = new Wu.Project(elem, this);
		}, this);

	},

	setToken : function () {
		this.accessToken = '?token=';
		this.accessToken += Wu.app.Account.store.token;
		this.accessToken += '.';
		this.accessToken += Wu.app.Account.store._id;
	},



	_initPanes : function () {

		// render tooltip
		this.Tooltip = new Wu.Tooltip();

		// render style handler
		this.Style = new Wu.Style();

		// render status pane
		this.StatusPane = new Wu.StatusPane({
			addTo: this._appPane
		});

		// render progress bar
		this.ProgressBar = new Wu.ProgressPane({
			color : 'white',
			addTo : this._appPane
		});

		// render startpane
		this.StartPane = new Wu.StartPane({
			projects : this.Projects
		});

		// render dropzone pane
		this.Dropzone = new Wu.Dropzone();

		// render side pane 
		this.SidePane = new Wu.SidePane();	// todo: add settings more locally? Wu.SidePane({options})

		// render header pane
		this.HeaderPane = new Wu.HeaderPane();

		// render map pane
		this.MapPane = new Wu.MapPane();

		// render eror pane
		this.ErrorPane = new Wu.ErrorPane();

	},

	// init default view on page-load
	_initView : function () {

		// check location
		if (this._initLocation()) return;
			
		// runs hotlink
		if (this._initHotlink()) return;

		// set project if only one
		if (this._lonelyProject()) return;

		// if user is admin or manager, set Projects and Users as default panes
		var user = app.Account;
		if (user.isAdmin() || user.isSuperadmin() || user.isManager()) {
			// set panes 
			this.SidePane.refresh(['Clients', 'Users', 'Account']);		
		}

		// activate startpane
		this.StartPane.activate();

	},


	_lonelyProject : function () {
		// check if only one project, 
		// if so, open it
		if (_.size(app.Projects) == 1) {
			for (p in app.Projects) {
				var project = app.Projects[p];
				this._setProject(project);
				return true;
			}
		}
		return false;
	},

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

		// check for hash
		if (hash && hash.length == 6) {
			console.log('we got a hash!: ', hash);	
			return this._initHash(project, hash);
		}

		return true;
		
	},

	_setProject : function (project) {
		
		// select project
		project.select();

		// refresh sidepane
		app.SidePane.refreshProject(project);

		// remove help pseudo
		Wu.DomUtil.removeClass(app._mapPane, 'click-to-start');
	},

	_initHotlink : function () {
		
		// parse error prone content of hotlink..
		try { this.hotlink = JSON.parse(window.hotlink); } 
		catch (e) { this.hotlink = false; };

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
		app.StatusPane.setStatus(status, timer);
	},

	setSaveStatus : function (delay) {
		app.StatusPane.setSaveStatus(delay);
	},

	_initHash : function (project, hash) {

		// get hash values from server,
		this.getHash(hash, project, this._renderHash);

		return true;
	},

	// get saved hash
	getHash : function (id, project, callback) {

		var json = {
			projectUuid : project.getUuid(),
			id : id
		}

		// get a saved setup - which layers are active, position, 
		Wu.post('/api/project/hash/get', JSON.stringify(json), callback, this);
	},


	_renderHash : function (context, json) {

		// parse
		var result = JSON.parse(json); 

		console.log('_renderHash', result);

		// handle errors
		if (result.error) console.log('error?', result.error);

		// set vars
		var hash = result.hash;
		var projectUuid = hash.project || result.project;	// hacky.. clean up setHash, _renderHash, errything..
		var project = app.Projects[projectUuid];

		// set position
		app.MapPane.setPosition(hash.position);

		// set layers
		hash.layers.forEach(function (layerUuid) { 	// todo: differentiate between baselayers and layermenu
								// todo: layermenu items are not selected in layermenu itself, altho on map
			// add layer
			var layer = project.getLayer(layerUuid);

			console.log('hash layer: ', layer.getTitle());

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
				var lm = app.MapPane.layerMenu;
				if (lm) {
					var lmi = lm._getLayermenuItem(layerUuid);
					lm.enableLayer(lmi);
				}
			}
			
		}, this);

	},


	// save a hash
	setHash : function (callback, project) {

		// get active layers
		var active = app.MapPane.getActiveLayermenuLayers();
		var layers = _.map(active, function (l) {
			return l.item.layer;	// layer uuid
		});

		console.log('setHash layers:', layers);


		// get project;
		var project = project || this.activeProject;

		// hash object
		var json = {
			projectUuid : project.getUuid(),
			hash : {
				id 	 : Wu.Util.createRandom(6),
				position : app.MapPane.getPosition(),
				layers 	 : layers 			// layermenuItem uuids, todo: order as z-index
			}
		}

		// save hash to server
		Wu.post('/api/project/hash/set', JSON.stringify(json), callback, this);

		// return
		return json.hash;

	},

	phantomJS : function (args) {

		var projectUuid = args.projectUuid,
	   	    hash    	= args.hash,
	   	    isThumb       = args.thumb;

	   	// return if no project
	   	if (!projectUuid) return false;

		// get project
		var project = app.Projects[projectUuid];
		
		// return if no such project
		if (!project) return false;

		// number of layers to be loaded
	   	this._loading = hash.layers.slice();

	   	// add baselayers
	   	project.getBaselayers().forEach(function (b) {
	   		this._loading.push(b);
	   	}, this);

		// set project
		this._setProject(project);

		// remove startpane
		if (this.StartPane) this.StartPane.deactivate();

		// add phantomJS stylesheet		
		isThumb ? app.Style.phantomJSthumb() : app.Style.phantomJS();

		// check for hash
		if (hash) {

			var json = JSON.stringify({
				hash: hash,
				project : projectUuid
			});

			// render hash
			this._renderHash(this, json);
		}

		// acticate legends for baselayers
		app.MapPane.legendsControl.refreshAllLegends()

		// avoid Loading! etc in status
		app.setStatus('systemapic'); // too early

	},
	
	phantomReady : function () {

		// check if ready for screenshot
		if (!this._loaded || !this._loading) return false;

		// if all layers loaded
		if (this._loaded.length == this._loading.length) return true;
		
		// not yet
		return false;

	},


	// phantomjs: loaded layers
	_loaded : [],

	_loading : [],

	// // phantomjs: load layermenu layers
	// _loadLayers : function (layermenuItems) {

	// },

	// // phantomjs: check if all layers are loaded
	// _allLoaded : function () {

	// },

	


	// debug mode
	_debug : function () {
		if (!this.debug) return;

		// set style
		Wu.setStyle('img', {
			'border-top': '1px solid rgba(255, 0, 0, 0.65)',
			'border-left': '1px solid rgba(255, 0, 0, 0.65)'
		});

		// add map click event
		if (app._map) app._map.on('mousedown', function (e) {

			var lat = e.latlng.lat,
			    lng = e.latlng.lng,
			    zoom = app._map.getZoom();

			var tile = this._getTileURL(lat, lng, zoom);
			console.log('tile:', tile);

		}, this);

		// extend 
		if (typeof(Number.prototype.toRad) === "undefined") {
			Number.prototype.toRad = function() {
				return this * Math.PI / 180;
			}
		}

	},


	_getTileURL : function (lat, lon, zoom) {
		var xtile = parseInt(Math.floor( (lon + 180) / 360 * (1<<zoom) ));
		var ytile = parseInt(Math.floor( (1 - Math.log(Math.tan(lat.toRad()) + 1 / Math.cos(lat.toRad())) / Math.PI) / 2 * (1<<zoom) ));
		return "" + zoom + "/" + xtile + "/" + ytile;
	}


});