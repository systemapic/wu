    
// lots of preiminary setup code, all ripped from Leafletjs.org
// ich hack
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
	templateIch : function (template, data) {
		var dummy = Wu.DomUtil.create('div', '');
		dummy.innerHTML = ich[template](data);
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

	// post without callback
	post : function (path, json) {
		var http = new XMLHttpRequest();
		var url = window.location.origin; //"http://85.10.202.87:8080/";// + path;//api/project/update";
		url += path;
		http.open("POST", url, true);

		//Send the proper header information along with the request
		http.setRequestHeader("Content-type", "application/json");

		http.onreadystatechange = function() {
		    if(http.readyState == 4 && http.status == 200) {
			console.log(http.responseText);
		    }
		}
		http.send(json);
	},

	// post with callback
	postcb : function (path, json, cb, self) {

		var http = new XMLHttpRequest();
		var url = window.location.origin; //"http://85.10.202.87:8080/";// + path;//api/project/update";
		url += path;
		http.open("POST", url, true);

		//Send the proper header information along with the request
		http.setRequestHeader("Content-type", "application/json");

		http.onreadystatechange = function() {
		    if(http.readyState == 4 && http.status == 200) {
			if (cb) { cb(self, http.responseText); }
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
		console.log('# generateZip #')

		if (!typeof data == 'string') {
			console.log('stringify')
			data = JSON.stringify(data);
		}

		console.log('string length: ', data.length);
		var compressed = LZString.compress(data);
		console.log('compressd length: ', compressed.length);
		

		return compressed;

	},

	zipSave : function (path, json) {

		if (!typeof json == 'string') {
			console.log('stringify')
			var string = JSON.stringify(json);
		} else {
			var string = json;
		}

		var my_lzma = new LZMA('//85.10.202.87:8080/js/lib/lzma/lzma_worker.js');
		my_lzma.compress(string, 1, function (result) {
		       
			console.log('my_lzma finished!');
			console.log(result);
			console.log(typeof result);
			var string = JSON.stringify(result);
			console.log('string: ', string);

			var http = new XMLHttpRequest();
			var url = window.location.origin; //"http://85.10.202.87:8080/";// + path;//api/project/update";
			url += path;
			http.open("POST", url, true);

			//Send the proper header information along with the request
			//http.setRequestHeader("Content-type", "application/json");

			http.onreadystatechange = function() {
				if(http.readyState == 4 && http.status == 200) {
					console.log(http.responseText);
				}
			}
			http.send(string);



		}, 

		function (percent) {
			console.log('lzma progress: ', percent);
		});

		

	},

	zippedSave : function () {



	},

	setColorTheme : function () {

		injectCSS();

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
Wu.parse = Wu.Util._parse;
Wu.zip = Wu.Util.generateZip;
Wu.zave = Wu.Util.zipSave;


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

	create: function (tagName, className, container) {

		var el = document.createElement(tagName);
		el.className = className;

		if (container) {
			container.appendChild(el);
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
		if (el.classList !== undefined) {
		    el.classList.remove(name);
		} else {
		    Wu.DomUtil.setClass(el, Wu.Util.trim((' ' + Wu.DomUtil.getClass(el) + ' ').replace(' ' + name + ' ', ' ')));
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
	}
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
	var matches = window.matchMedia('(min-resolution:144dpi)');
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

String.prototype.camelize = function () {
    return this.replace (/(?:^|[-_])(\w)/g, function (_, c) {
      return c ? c.toUpperCase () : '';
    });
};var colorTheme = {};
var savedCSS;

// The CSS
var _CTheader = document.getElementsByTagName('head')[0],
	jcss;

	jcss = document.createElement('style');
	jcss.setAttribute('type', 'text/css');
	jcss.setAttribute('rel', 'stylesheet');	
	_CTheader.appendChild(jcss);
	
	

function injectCSS() {
	
	colorTheme = JSON.parse(savedCSS);
	
	var _CSSstring = '';
	for (var i = 0; i<colorTheme.css.length;i++) {			
		if ( colorTheme.css[i].value ) {			
			_CSSstring += colorTheme.css[i].classes.join() + ' { ' + colorTheme.css[i].pre + ': ' + colorTheme.css[i].value + ' !important } ';
		}
	}		

	jcss.innerHTML = _CSSstring;	
}



//******************************************************************//			
//******************************************************************//
//																	//
//	 ________  _________    ___    ___ ___       _______          	//
//	|\   ____\|\___   ___\ |\  \  /  /|\  \     |\  ___ \         	//
//	\ \  \___|\|___ \  \_| \ \  \/  / | \  \    \ \   __/|        	//
//	 \ \_____  \   \ \  \   \ \    / / \ \  \    \ \  \_|/__      	//
//	  \|____|\  \   \ \  \   \/  /  /   \ \  \____\ \  \_|\ \     	//
//	    ____\_\  \   \ \__\__/  / /      \ \_______\ \_______\    	//
//	   |\_________\   \|__|\___/ /        \|_______|\|_______|    	//
//	   \|_________|       \|___|/                                 	//
//	                                                              	//
//	                                                              	//
//	 _______   ________  ___  _________  ________  ________       	//
//	|\  ___ \ |\   ___ \|\  \|\___   ___\\   __  \|\   __  \      	//
//	\ \   __/|\ \  \_|\ \ \  \|___ \  \_\ \  \|\  \ \  \|\  \     	//
//	 \ \  \_|/_\ \  \ \\ \ \  \   \ \  \ \ \  \\\  \ \   _  _\    	//
//	  \ \  \_|\ \ \  \_\\ \ \  \   \ \  \ \ \  \\\  \ \  \\  \|   	//
//	   \ \_______\ \_______\ \__\   \ \__\ \ \_______\ \__\\ _\   	//
//	    \|_______|\|_______|\|__|    \|__|  \|_______|\|__|\|__|  	//
//	                                                              	//
//	                                                              	//
//                                                              	//
//******************************************************************//
//******************************************************************//



function startColorThemes() {
	
	
	// Bruker denne når en ny klasse legges til...
	// Grunnen til det er at det LAGREDE color theme objektet må oppdateres med riktig array,
	// så hvis det har blitt endring i klasselisten må alle prosjekter reloades i color theme
	// med rezet som true state, yo.
	
	var rezet = false;
	
	
	var tempjcss, 				// The tag in the head where the CSS gets injected
		draggingSlider = false, 	// If we are dragging, and what bar is being dragged
	
		// For Color Theme
		haschanged = false, 		// If individual colors has been changed or not (for overriding feedback purposes)
		changingColors = false, 	// For editing mode (To know what color we're editing )
	
		// These must follow on save
	
		basecolor,					
		RGB, HSV,
		
		css = [], 					// The CSS array
		tempCSS = {}, 				// The CSS array
	
		cssstring = '',		 		// The CSS string
	
		lightColor = [],			// Static colors
		darkColor = [],				// Static colors
		brightColor = [],			// Static colors
		
		complimentaryColor = [], 	// Dynamically changing colors
		matchingColor = [],		 	// Dynamically changing colors
		customColor = [],		 	// For custom made colors
	
		eVars = {},					// Contains div objects from the DOM (picked up by ID)
		theClassArray = [];
	
	
		// These Follows the Color Theme
	
		colorTheme.darktheme = true;
		colorTheme.cTheme = false;
		colorTheme.cThemeDarkMenu = true;
		colorTheme.cThemeDarkHeader = false;
		colorTheme.cThemeDarkBox = false;
		

		if ( !colorTheme.css || rezet ) colorTheme.css = [];
	
		// The Swatch CSS
		tempjcss = document.createElement('style');
		tempjcss.setAttribute('type', 'text/css');
		tempjcss.setAttribute('rel', 'stylesheet');	
		_CTheader.appendChild(tempjcss);
	
	
			
	// *****************************************
				
	// CORE FUNCTIONS
	// CORE FUNCTIONS
	// CORE FUNCTIONS

	// *****************************************
	
	var eCol = {
	
		// GENERAL
		// GENERAL
	
		// Create a HSV object
		HSVobject : function (hue, saturation, value) {
		// Object definition.
		this.h = hue; this.s = saturation; this.v = value;
		this.validate = function () {
			if (this.h <= 0) {this.h = 0;}
			if (this.s <= 0) {this.s = 0;}
			if (this.v <= 0) {this.v = 0;}
			if (this.h > 360) {this.h = 360;}
			if (this.s > 100) {this.s = 100;}
			if (this.v > 100) {this.v = 100;}
		}		
	},
		
		// Create a RGB objec
		RGBobject : function (red, green, blue) {
		// Object definition.
		this.r = red; this.g = green; this.b = blue;
		this.validate = function () {
			if (this.r <= 0) {this.r = 0;}
			if (this.g <= 0) {this.g = 0;}
			if (this.b <= 0) {this.b = 0;}
			if (this.r > 255) {this.r = 255;}
			if (this.g > 255) {this.g = 255;}
			if (this.b > 255) {this.b = 255;}
		}	
	},
		
		
		// CONVERTERS
		// CONVERTERS	
		
		convert : {
			
			// Decimals to hex (only 3 digits)
			hexify : function (number) {
			var digits = '0123456789ABCDEF';
			var lsd = number % 16;
			var msd = (number - lsd) / 16;
			var hexified = digits.charAt(msd) + digits.charAt(lsd);
			return hexified;		
		},
			
			// Hex to decimals (only 2 digits)
			decimalize : function (hexNumber) {
			var digits = '0123456789ABCDEF';
			return ((digits.indexOf(hexNumber.charAt(0).toUpperCase()) * 16) + digits.indexOf(hexNumber.charAt(1).toUpperCase()));		
		},
			
			// HEX to RGB
			HEX2RGB : function (colorString, RGB) {
			
			RGB.r = this.decimalize(colorString.substring(1,3));
			RGB.g = this.decimalize(colorString.substring(3,5));
			RGB.b = this.decimalize(colorString.substring(5,7));		
		},
			
			// RGB to HEX
			RGB2HEX : function (RGB) {
			return "#" + this.hexify(RGB.r) + this.hexify(RGB.g) + this.hexify(RGB.b);		
		},
			
			// RGB to HSV
			RGB2HSV : function (RGB, HSV) {
			r = RGB.r / 255; g = RGB.g / 255; b = RGB.b / 255; // Scale to unity.
		
			var minVal = Math.min(r, g, b);
			var maxVal = Math.max(r, g, b);
			var delta = maxVal - minVal;
		
			HSV.v = maxVal;
		
			if (delta == 0) {
				HSV.h = 0;
				HSV.s = 0;
			} else {
				HSV.s = delta / maxVal;
				var del_R = (((maxVal - r) / 6) + (delta / 2)) / delta;
				var del_G = (((maxVal - g) / 6) + (delta / 2)) / delta;
				var del_B = (((maxVal - b) / 6) + (delta / 2)) / delta;
		
				if (r == maxVal) {HSV.h = del_B - del_G;}
				else if (g == maxVal) {HSV.h = (1 / 3) + del_R - del_B;}
				else if (b == maxVal) {HSV.h = (2 / 3) + del_G - del_R;}
				
				if (HSV.h < 0) {HSV.h += 1;}
				if (HSV.h > 1) {HSV.h -= 1;}
			}
			HSV.h *= 360;
			HSV.s *= 100;
			HSV.v *= 100;		
		},
			
			// HSV to RGB
			HSV2RGB : function (HSV, RGB) {
			var h = HSV.h / 360; var s = HSV.s / 100; var v = HSV.v / 100;
			if (s == 0) {
				RGB.r = v * 255;
				RGB.g = v * 255;
				RGB.b = v * 255;
			} else {
				var_h = h * 6;
				var_i = Math.floor(var_h);
				var_1 = v * (1 - s);
				var_2 = v * (1 - s * (var_h - var_i));
				var_3 = v * (1 - s * (1 - (var_h - var_i)));
				
				if (var_i == 0) {var_r = v; var_g = var_3; var_b = var_1}
				else if (var_i == 1) {var_r = var_2; var_g = v; var_b = var_1}
				else if (var_i == 2) {var_r = var_1; var_g = v; var_b = var_3}
				else if (var_i == 3) {var_r = var_1; var_g = var_2; var_b = v}
				else if (var_i == 4) {var_r = var_3; var_g = var_1; var_b = v}
				else {var_r = v; var_g = var_1; var_b = var_2};
				
				RGB.r = var_r * 255;
				RGB.g = var_g * 255;
				RGB.b = var_b * 255;
			}		
		},
			
			// HSV to HEX
			HSV2HEX : function (_hval, _sval, _vval) {
			var RGB = new eCol.RGBobject();
			var HSV = new eCol.HSVobject(_hval, _sval, _vval);	
			HSV.validate();
			this.HSV2RGB (HSV, RGB);
			var _nHEX = this.RGB2HEX(RGB);
			return(_nHEX);				
		}
			
		},
	
	
		// UPDATERS
		// UPDATERS
		
		update : {
	
			// Creates a string from the CSS array	
			CSSstring : function () {
				
				// Turn CSS into string
				cssstring = '';
				for (var i = 0; i < colorTheme.css.length; i++) {			
					if ( colorTheme.css[i].value ) {			
						cssstring += colorTheme.css[i].classes.join() + ' { ' + colorTheme.css[i].pre + ': ' + colorTheme.css[i].value + ' !important } ';
					}
				}					

				// Make a saved CSS object
				savedCSS = JSON.stringify(colorTheme);

				// save to project
				if (Wu.app._activeProject) Wu.app._activeProject.saveColorTheme();	// (k)
			
			},
			
			// Creates 4 Colmplimetary colors in cArray[0] - cArray[4]
			makeComplimentary : function (_hex) {
			
			// Updating the color swatches that contains the BASE color
			eVars._yourswatch.style.backgroundColor = _hex;
			var colorString = _hex;
			
			// Create RGB and HSV values from HEX
			var RGB = new eCol.RGBobject(0,0,0);
			var HSV = new eCol.HSVobject(0,0,0);
			eCol.convert.HEX2RGB(colorString, RGB);
			eCol.convert.RGB2HSV (RGB, HSV);
			
			// Update sliders
			eCol.sliders.updateAllSliders(RGB, HSV);
				
			// Update the BASE COLOR in cArray	
			complimentaryColor[0] = [];		
			complimentaryColor[0][0] = {};
			complimentaryColor[0][0].HEX = _hex;		
			complimentaryColor[0][0].RGB = { r: RGB.r, g: RGB.g, b: RGB.b };
			complimentaryColor[0][0].HSV = { 'h': HSV.h, 's': HSV.s, 'v': HSV.v };


			// MAKE COMPLIMENTARY COLORS
			
			// Hue position
			var hpos = 360-complimentaryColor[0][0].HSV.h;
			// Go down cArray[0] - cArray[4] and make COMPLIMENTARY colors from the original value			
			for ( var i=0; i<4;i++ ) {
					
				var hstep = complimentaryColor[0][0].HSV.h + (90*i);
					
				if ( hstep > 360 ) {
					hstep = hstep - 360;
				}
				
				hstep = Math.floor(hstep);		
		
				HSV.h = hstep;
				HSV.s = complimentaryColor[0][0].HSV.s;
				HSV.v = complimentaryColor[0][0].HSV.v;
			
				// Declare the Array that contains all the colors
				complimentaryColor[i] = [];
				complimentaryColor[i][0] = {};
								
				eCol.convert.HSV2RGB(HSV, RGB);
				var nhex = eCol.convert.RGB2HEX(RGB);
				
				complimentaryColor[i][0].HEX = nhex;
				complimentaryColor[i][0].RGB = {'r':RGB.r, 'g':RGB.g, 'b':RGB.b};
				complimentaryColor[i][0].HSV = {'h':HSV.h, 's':HSV.s, 'v':HSV.v};
				
	
				
				// Make lighter color versions
				this.colorGrade(complimentaryColor, i, HSV);
			}
			
		},
			
			// Create 5 Matching colors
			matchColors : function() {
		
			// Set back RGB and HSV to BASE color value
			RGB = complimentaryColor[0][0].RGB;
			HSV = complimentaryColor[0][0].HSV;			
		
			// Finds matching colors, and puts them in matchBlend[1] - matchBlend[5]
			// ... and updates the matching color swatches
			eCol.cMatch.domatch(HSV);

			
			// Update the MATCHING colors in cArray
			// Not sure if this is so smart... perhaps it would be better to keep the arrays separated
			
			// Match Color 1 GRADER
			this.colorGrade(matchingColor, 0, matchingColor[0][0].HSV);
					
			// Match Color 2 GRADER
			this.colorGrade(matchingColor, 1, matchingColor[1][0].HSV);
		
			// Match Color 3 GRADER
			this.colorGrade(matchingColor, 2, matchingColor[2][0].HSV);
			
			// Match Color 4 GRADER
			this.colorGrade(matchingColor, 3, matchingColor[3][0].HSV);
		
			// Match Color 5 GRADER
			this.colorGrade(matchingColor, 4, matchingColor[4][0].HSV);

		},
			
			// Creates 6 lighter colors from original HSV
			colorGrade : function (thisArray, arrayNumber, HSV) {										
 			
			// Go down the swatches
			for ( var a=0; a<6;a++) {			
			
				var RGB = new eCol.RGBobject(0,0,0);
		
				// Value
				var vval = HSV.v;
				var valdiff = 100-vval;	
				var valstep = valdiff/6;	
				HSV.v = Math.floor(vval + (valstep*a));
				
				// Lightness
				var sval = HSV.s;
				var svalstep = sval/6;
				HSV.s = Math.floor(sval - (svalstep*a));
				
				// Set RGB
				eCol.convert.HSV2RGB(HSV, RGB);
				
				// Set HEX
				var nhex = eCol.convert.RGB2HEX(RGB);
				

				// Update the array with all the colors
				thisArray[arrayNumber][a] = {};
				
				thisArray[arrayNumber][a].HEX = nhex;
				thisArray[arrayNumber][a].RGB = {'r': RGB.r, 'g': RGB.g, 'b': RGB.b };
				thisArray[arrayNumber][a].HSV = {'h': HSV.h, 's': HSV.s, 'v': HSV.v };			
			}				
		},
			
			// When there is a change in RGB (gets used by slider only)
			RGB : function(RGB) {
			
			var HSV = new eCol.HSVobject(0,0,0);
			
			eCol.convert.RGB2HSV(RGB, HSV);
			
			eVars._hexColor.value = eCol.convert.RGB2HEX(RGB);
			eVars._rChannel.value = Math.round(RGB.r);
			eVars._gChannel.value = Math.round(RGB.g);
			eVars._bChannel.value = Math.round(RGB.b);
			eVars._hChannel.value = Math.round(HSV.h);
			eVars._sChannel.value = Math.round(HSV.s);
			eVars._vChannel.value = Math.round(HSV.v);
									
		},
	
			// When there is a change in HSV (gets used by slider only)
			HSV : function(HSV) {
				
			var RGB = new eCol.RGBobject(0,0,0);
			eCol.convert.HSV2RGB(HSV, RGB);
			
			eVars._hexColor.value = eCol.convert.RGB2HEX(RGB);
			eVars._rChannel.value = Math.round(RGB.r);
			eVars._gChannel.value = Math.round(RGB.g);
			eVars._bChannel.value = Math.round(RGB.b);
			eVars._hChannel.value = Math.round(HSV.h);
			eVars._sChannel.value = Math.round(HSV.s);
			eVars._vChannel.value = Math.round(HSV.v);
					
		},
	
			// When there is a change in HEX (clicking new colors)
			HEX : function (colorString) {
				
			var RGB = new eCol.RGBobject(0,0,0);
			var HSV = new eCol.HSVobject(0,0,0);
			eCol.convert.HEX2RGB(colorString, RGB);
			eCol.convert.RGB2HSV (RGB, HSV);
			
			eVars._rChannel.value = Math.round(RGB.r);
			eVars._gChannel.value = Math.round(RGB.g);
			eVars._bChannel.value = Math.round(RGB.b);
			eVars._hChannel.value = Math.round(HSV.h);
			eVars._sChannel.value = Math.round(HSV.s);
			eVars._vChannel.value = Math.round(HSV.v);
			
		},
			
			inputFields : function (fromWhat) {
			
			var RGB = new Object();
			var HSV = new Object();
			
			if ( fromWhat == 'HEX' ) {
												
				var tHEX = eVars._hexColor.value;
				
				eCol.convert.HEX2RGB(tHEX, RGB);
				eCol.convert.RGB2HSV(RGB, HSV);
				
				eVars._rChannel.value = Math.floor(RGB.r);
				eVars._gChannel.value = Math.floor(RGB.g);
				eVars._bChannel.value = Math.floor(RGB.b);

				eVars._hChannel.value = Math.floor(HSV.h);
				eVars._sChannel.value = Math.floor(HSV.s);
				eVars._vChannel.value = Math.floor(HSV.v);
				
				
			}

			if ( fromWhat == 'RGB' ) {
				
				RGB.r = eVars._rChannel.value;
				RGB.g = eVars._gChannel.value;
				RGB.b = eVars._bChannel.value;

				eCol.convert.RGB2HSV(RGB, HSV);				
				var tHEX = eCol.convert.RGB2HEX(RGB);								
												
				eVars._hexColor.value = tHEX;

				eVars._hChannel.value = Math.floor(HSV.h);
				eVars._sChannel.value = Math.floor(HSV.s);
				eVars._vChannel.value = Math.floor(HSV.v);
			}
			
			if ( fromWhat == 'HSV' ) {
				
				HSV.r = eVars._hChannel.value;
				HSV.g = eVars._sChannel.value;
				HSV.b = eVars._vChannel.value;

				eCol.convert.HSV2RGB(HSV, RGB);				
				var tHEX = eCol.convert.RGB2HEX(RGB);								
												
				eVars._hexColor.value = tHEX;

				eVars._rChannel.value = Math.floor(RGB.r);
				eVars._gChannel.value = Math.floor(RGB.g);
				eVars._bChannel.value = Math.floor(RGB.b);
				
			}
			
			eCol.sliders.updateAllSliders(RGB,HSV);
									
		},
			
			// Updates the Swatch we've selected from NEW color!
			customColors : function() {
		
		
			if ( changingColors == 'all' ) {

				var newHEX = eVars._hexColor.value;

				this.makeComplimentary(newHEX);
				this.matchColors();
				
				updateTempSwatches();


				if ( colorTheme.cThemeDarkMenu ) {
					darkMenu(newHEX);					
				} else {
					lightMenu(newHEX);
				}


				// Link Color
				colorTheme.css[4].value = matchingColor[2][0].HEX;				
				
				// Inactive Layers
				colorTheme.css[5].value = complimentaryColor[0][0].HEX;
				colorTheme.css[6].value = complimentaryColor[0][3].HEX;	
				colorTheme.css[7].value = complimentaryColor[0][4].HEX;

				// Active Layers
				colorTheme.css[8].value = complimentaryColor[2][0].HEX;
				colorTheme.css[9].value = complimentaryColor[2][4].HEX;
	
				
				

			}
			
			// Menu color
			if ( changingColors == 1 ) {
				
				var HSV = { 'h': parseInt(eVars._hChannel.value), 's': parseInt(eVars._sChannel.value), 'v': parseInt(eVars._vChannel.value)  }

				customColor[1] = [];
				this.colorGrade(customColor, 1, HSV);


				if ( colorTheme.cThemeDarkMenu ) {
					darkMenu(customColor[1][0].HEX);					
				} else {
					lightMenu(customColor[1][0].HEX);
				}

				// cxxxx

				
			}
		
			// Inactive Layers
			if ( changingColors == 2 ) {
			
				var HSV = { 'h': parseInt(eVars._hChannel.value), 's': parseInt(eVars._sChannel.value), 'v': parseInt(eVars._vChannel.value)  }

				customColor[2] = [];
				this.colorGrade(customColor, 2, HSV);
											
				colorTheme.css[5].value = customColor[2][0].HEX;
				colorTheme.css[6].value = customColor[2][3].HEX;	
				colorTheme.css[7].value = customColor[2][4].HEX;
				
			}

			// Active Layers
			if ( changingColors == 3 ) {

				var HSV = { 'h': parseInt(eVars._hChannel.value), 's': parseInt(eVars._sChannel.value), 'v': parseInt(eVars._vChannel.value)  }

				customColor[3] = [];
				this.colorGrade(customColor, 3, HSV);
				
				colorTheme.css[8].value = customColor[3][0].HEX;
				colorTheme.css[9].value = customColor[3][4].HEX;

			}

			// Link Color
			if ( changingColors == 4 ) {
			
				var HSV = { 'h': parseInt(eVars._hChannel.value), 's': parseInt(eVars._sChannel.value), 'v': parseInt(eVars._vChannel.value)  }

				customColor[4] = [];
				this.colorGrade(customColor, 4, HSV);
				
				colorTheme.css[4].value = customColor[4][0].HEX;
				
			}

			// Update the color in the CSS
			eCol.update.CSSstring();
			jcss.innerHTML = cssstring;


		}
					
		},
		
			
		
		// SLIDERS
		// SLIDERS	
		
		sliders : {
			
			updateAllSliders : function (RGB, HSV) {
	
			
			// HSV
			if ( draggingSlider != 'range-slider-1' ) {
				this.slideupdater('range-slider-1', 'hChannel', 360, HSV, RGB);
			}
		
			if ( draggingSlider != 'range-slider-2' ) {
				this.slideupdater('range-slider-2', 'sChannel', 100, HSV, RGB);	
			}
		
			if ( draggingSlider != 'range-slider-3' ) {
				this.slideupdater('range-slider-3', 'vChannel', 100, HSV, RGB);	
			}
		
		
			// RGB
			if ( draggingSlider != 'range-slider-r' ) {
				this.slideupdater('range-slider-r', 'rChannel', 255, HSV, RGB);		
			}
		
			if ( draggingSlider != 'range-slider-g' ) {
				this.slideupdater('range-slider-g', 'gChannel', 255, HSV, RGB);
			}
		
			if ( draggingSlider != 'range-slider-b' ) {
				this.slideupdater('range-slider-b', 'bChannel', 255, HSV, RGB);
			}				
			
		},
					
			rangeSlider : function (id, rrange, onDrag) {

		    var range = Wu.DomUtil.get(id),
		        dragger = range.children[0],
		        draggerWidth = 10, // width of your dragger
		        rangeWidth, rangeLeft,
		        down = false;
		
		    dragger.style.width = draggerWidth + 'px';
		    dragger.style.left = -draggerWidth + 'px';
		    dragger.style.marginLeft = (draggerWidth / 2) + 'px';
		
		    var thus = this;
		
		    range.addEventListener("mousedown", function(e) {
		
				rangeWidth = 215;
		        rangeLeft = 150;
		        
		        draggingSlider = id;        
		        
		        down = true;
		        thus.updateDragger(e, dragger, rrange, down, rangeLeft, rangeWidth, draggerWidth, onDrag, thus);
		        return false;
		    });
		
		    document.addEventListener("mousemove", function(e) {
		   
		        thus.updateDragger(e, dragger, rrange, down, rangeLeft, rangeWidth, draggerWidth, onDrag, thus);
		    });
		
		    document.addEventListener("mouseup", function() {
		        down = false;
				draggingSlider = false;                
		    });
					
		},
			
			updateDragger : function (e, dragger, rrange, down, rangeLeft, rangeWidth, draggerWidth, onDrag, thus) {				   
				           

				           
		        if (down && e.pageX >= rangeLeft && e.pageX <= (rangeLeft + rangeWidth)) {
		        		   
		            dragger.style.left = e.pageX - rangeLeft - draggerWidth + 'px';

		            if ( typeof onDrag == "function" ) {
		            	 
		            	var dragVal = Math.round(((e.pageX - rangeLeft) / rangeWidth) * rrange);
  	
		            	onDrag(dragVal);
		            	
		            	}
		        }
			
		},
			
			slideupdater : function (id, updater, nrng, HSV, RGB) {
		
			// Updating one of the HSV sliders: update all the RGB sliders
			if ( draggingSlider == 'range-slider-1' || draggingSlider == 'range-slider-2' || draggingSlider == 'range-slider-3' ) {
		
				var rr = Wu.DomUtil.get('range-slider-r').children[0];
				var rrrange = Math.floor(RGB.r*(205/255));
					rr.style.left = rrrange + 'px';
				
				var gg = Wu.DomUtil.get('range-slider-g').children[0];
				var ggrange = Math.floor(RGB.g*(205/255));
					gg.style.left =ggrange + 'px';
					
				var bb = Wu.DomUtil.get('range-slider-b').children[0];
				var bbrange = Math.floor(RGB.b*(205/255));
					bb.style.left = bbrange + 'px';		
			}
			
			
			// Updating one of the RGB sliders: update all the HSV sliders	
			if ( draggingSlider == 'range-slider-r' || draggingSlider == 'range-slider-g' || draggingSlider == 'range-slider-b' ) {
							
				var hh = Wu.DomUtil.get('range-slider-1').children[0];
				var hhrange = Math.floor(HSV.h*(205/360));
					hh.style.left = hhrange + 'px';
				
				var ss = Wu.DomUtil.get('range-slider-2').children[0];
				var ssrange = Math.floor(HSV.s*(205/100));
					ss.style.left = ssrange + 'px';
					
				var vv = Wu.DomUtil.get('range-slider-3').children[0];
				var vvrange = Math.floor(HSV.v*(205/100));
					vv.style.left = vvrange + 'px';	
			
			}
		
		
		
			if ( !draggingSlider ) {
			
			    var range = Wu.DomUtil.get(id),
			        dragger = range.children[0];
			        			                
			    var newRange;
			
			    if ( updater == 'hChannel' ) {
				    newRange = HSV.h;	
			    }
			
			    if ( updater == 'sChannel' ) {
				    newRange = HSV.s;
			    }
			    
			    if ( updater == 'vChannel' ) {
				    newRange = HSV.v;
			    }        
		
		
			    if ( updater == 'rChannel' ) {
				    newRange = RGB.r;	
			    }
			
			    if ( updater == 'gChannel' ) {
				    newRange = RGB.g;
			    }
			    
			    if ( updater == 'bChannel' ) {
				    newRange = RGB.b;
			    }        
			    
			    
			
				if ( newRange >= nrng ) {
			    	newRange = nrng;
				}
			
			
				var prop = 205/nrng;
			    newRange = Math.floor(newRange*prop);        
			
			    dragger.style.left = newRange + 'px';
		    
		    }
		
		
			
		}
			
		},
		
	
		// COLOR MATCHER 
		// COLOR MATCHER
		
		
		cMatch : {
			
			domatch : function (HSV) {
		
			var hs = HSV;
		
			// Color matching algorithm. All work is done in HSV color space, because all
			// calculations are based on hue, saturation and value of the working color.
			// The hue spectrum is divided into sections, are the matching colors are
			// calculated differently depending on the hue of the color.
			
			var z=new Object();
			var y=new Object();
			var yx=new Object();
			y.s=hs.s;
			y.h=hs.h;
			if(hs.v>70){y.v=hs.v-30}else{y.v=hs.v+30};
		
			var RGB=new Object();
			eCol.convert.HSV2RGB(y, RGB);
			z = RGB;
			
			this.outp("0",z);
			if((hs.h>=0)&&(hs.h<30)){
				yx.h=y.h=hs.h+30;yx.s=y.s=hs.s;y.v=hs.v;
				if(hs.v>70){yx.v=hs.v-30}else{yx.v=hs.v+30}
			}
			if((hs.h>=30)&&(hs.h<60)){yx.h=y.h=hs.h+150;
				y.s=this.rc(hs.s-30,100);
				y.v=this.rc(hs.v-20,100);
				yx.s=this.rc(hs.s-50,100);
				yx.v=this.rc(hs.v+20,100);
			}
			if((hs.h>=60)&&(hs.h<180)){
				yx.h=y.h=hs.h-40;
				y.s=yx.s=hs.s;
				y.v=hs.v;if(hs.v>70){yx.v=hs.v-30}else{yx.v=hs.v+30}
			}
			if((hs.h>=180)&&(hs.h<220)){
				yx.h=hs.h-170;
				y.h=hs.h-160;
				yx.s=y.s=hs.s;
				y.v=hs.v;
				if(hs.v>70){yx.v=hs.v-30}else{yx.v=hs.v+30}
			}if((hs.h>=220)&&(hs.h<300)){
				yx.h=y.h=hs.h;
				yx.s=y.s=this.rc(hs.s-40,100);
				y.v=hs.v;
				if(hs.v>70){yx.v=hs.v-30}else{yx.v=hs.v+30}
			}
			if(hs.h>=300){
				if(hs.s>50){y.s=yx.s=hs.s-40}else{y.s=yx.s=hs.s+40}yx.h=y.h=(hs.h+20)%360;
				y.v=hs.v;
				if(hs.v>70){yx.v=hs.v-30}else{yx.v=hs.v+30}
			}
		
		
			var RGB=new Object();
			eCol.convert.HSV2RGB(y, RGB);
			z = RGB;	
			this.outp("1",z);
			
			var RGB=new Object();
			eCol.convert.HSV2RGB(yx, RGB);
			z = RGB;	
			this.outp("2",z);
		
			y.h=0;
			y.s=0;
			y.v=100-hs.v;
			var RGB=new Object();
			eCol.convert.HSV2RGB(y, RGB);
			z = RGB;
			this.outp("3",z);
		
			y.h=0;
			y.s=0;
			y.v=hs.v;
			var RGB=new Object();
			eCol.convert.HSV2RGB(y, RGB);
			z = RGB;
			this.outp("4",z);		
			
		},
			
			outp: function (x, RGB) {
		
			matchingColor[x] = [];
			matchingColor[x][0] = {};
			matchingColor[x][0].HEX="#"+eCol.convert.hexify(RGB.r)+eCol.convert.hexify(RGB.g)+eCol.convert.hexify(RGB.b);
			
			var RGB=new Object();			
			var HSV=new Object();			
			
			eCol.convert.HEX2RGB(matchingColor[x][0].HEX, RGB);
			eCol.convert.RGB2HSV(RGB, HSV);
			
			matchingColor[x][0].RGB = {'r': RGB.r, 'g': RGB.g, 'b': RGB.b };
			matchingColor[x][0].HSV = {'h': HSV.h, 's': HSV.s, 'v': HSV.v };			
				
			
		},
			
			rc : function (x,m) {
		
			if(x>m){return m}
			if(x<0){return 0}else{return x}			
		
		}
			
		},
	
		
		// COLOR PICKER
		// COLOR PICKER ~ TODO: Kill off the micro image
	
		cPicker : {
	
			img2canvas : function () {

			istat=true;
			cnvWidth=120;
			cnvHeight=70;
			
			c = eVars._myCanvas;
			ctx=c.getContext("2d");
		
			cPix = eVars._pixCanvas;
			ctxPix=cPix.getContext("2d");
		
			ctxPix.mozImageSmoothingEnabled = false;
			ctxPix.webkitImageSmoothingEnabled = false;
		
			img = eVars._canvimg;
			imgHeight = img.height;
			imgWidth = img.width;
					
			if (imgHeight<cnvHeight && imgWidth<cnvWidth){
				ctx.mozImageSmoothingEnabled = false;
				ctx.webkitImageSmoothingEnabled = false;
			}
		
			if ((imgWidth/imgHeight)<1.56667){
				cnvWidth=imgWidth/imgHeight*cnvHeight;
			}else{
				cnvHeight=cnvWidth/(imgWidth/imgHeight);
			}
			ctx.clearRect(0, 0, c.width, c.height);
			ctx.drawImage(img,0,0,cnvWidth,cnvHeight);
			
			var thus = this;			
			var onclickListener = function (evt) {
	
				if ( haschanged ) {
					if ( changingColors == 'all' ) {
					    if (confirm("This action will regenerate a color palette for you. By proceding all your changes will be lost!") == true) {
						   haschanged = false;

						   eCol.update.HEX(eVars._hexColor.value);
						   eCol.update.inputFields('HEX');
					    }
					} else {
			
						imageData = ctxPix.getImageData(0,0,150,150);
						var barva='#'+thus.d2h(imageData.data[45300+0])+thus.d2h(imageData.data[45300+1])+thus.d2h(imageData.data[45300+2]);

						eVars._hexColor.value=barva;
						eCol.update.HEX(eVars._hexColor.value);
											
						// Update Colors						
					    eCol.update.customColors();

					}
				} else {
					
					imageData = ctxPix.getImageData(0,0,150,150);
					var barva='#'+thus.d2h(imageData.data[45300+0])+thus.d2h(imageData.data[45300+1])+thus.d2h(imageData.data[45300+2]);
					eVars._hexColor.value=barva;


					eCol.update.HEX(eVars._hexColor.value);

					// Update Colors
				    eCol.update.customColors();					
				} 			
			};
			var onmoveListener = function(evt) {
			
				ev=1;
				if (istat){
					mousePos = thus.getMousePos(c, evt);
					thus.drawPix(cPix, ctxPix, img, Math.round(mousePos.x*(imgWidth/cnvWidth)), Math.round(mousePos.y*(imgHeight/cnvHeight)));
				}
			};
			
			c.addEventListener('mousemove', onmoveListener, false);
			c.addEventListener('mousedown', onclickListener, false);
				  
			
		},
	
			drawPix : function (cPix, ctxPix, img, x, y) {

			ctxPix.clearRect(0, 0, cPix.width, cPix.height);
			if (x<5) x=5;
			if (y<5) y=5;
			if (x>imgWidth-4) x=imgWidth-4;
			if (y>imgHeight-4) y=imgHeight-4;
			ctxPix.drawImage(img,x-5,y-5,9,9,0,0,cPix.width,cPix.height);
			
		},
	
			getMousePos : function (canvas, evt) {
		
			var rect = canvas.getBoundingClientRect();
			return { x: evt.clientX - rect.left, y: evt.clientY - rect.top	};			
		
		},
	
			d2h : function (d) {
		
			return ("0"+d.toString(16)).slice(-2).toUpperCase();
		
		}
			
		},
		
	
		// FINDS THE MOST DOMINANT COLOR IN THE PICTURE ~ TODO: Disable white and black as dominant colors	
		cFind : function (colorFactorCallback) {
			
		  this.callback = colorFactorCallback;
		  this.getMostProminentColor = function(imgEl) {
	    var rgb = null;
	    if (!this.callback) this.callback = function() { return 1; };
	    var data = this.getImageData(imgEl);
	    rgb = this.getMostProminentRGBImpl(data, 6, rgb, this.callback);
	    rgb = this.getMostProminentRGBImpl(data, 4, rgb, this.callback);
	    rgb = this.getMostProminentRGBImpl(data, 2, rgb, this.callback);
	    rgb = this.getMostProminentRGBImpl(data, 0, rgb, this.callback);
	    return rgb;
	  };
		  this.getImageData = function(imgEl, degrade, rgbMatch, colorFactorCallback) {
	    
	    var rgb,
	        canvas = document.createElement('canvas'),
	        context = canvas.getContext && canvas.getContext('2d'),
	        data, width, height, key,
	        i = -4,
	        db={},
	        length,r,g,b,
	        count = 0;
	    
	    if (!context) {
	      return defaultRGB;
	    }
	    
	    height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
	    width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;
	    
	    context.drawImage(imgEl, 0, 0);
	    
	    try {
	      data = context.getImageData(0, 0, width, height);
	    } catch(e) {
	      return null;
	    }
	
	    length = data.data.length;
	    
	    var factor = Math.max(1,Math.round(length/5000));
	    var result = {};
	    
	    while ( (i += 4*factor) < length ) {
	      if (data.data[i+3]>32) {
	        key = (data.data[i]>>degrade) + "," + (data.data[i+1]>>degrade) + "," + (data.data[i+2]>>degrade);
	        if (!result.hasOwnProperty(key)) {
	          rgb = {r:data.data[i], g:data.data[i+1], b:data.data[i+2],count:1};
	          rgb.weight = this.callback(rgb.r, rgb.g, rgb.b);
	          if (rgb.weight<=0) rgb.weight = 1e-10;
	          result[key]=rgb;
	        } else {
	          rgb=result[key];
	          rgb.count++;
	        }
	      }
	    }
	    return result;
	  };
		  this.getMostProminentRGBImpl = function(pixels, degrade, rgbMatch, colorFactorCallback) {
	    
	    var rgb = {r:0,g:0,b:0,count:0,d:degrade},
	        db={},
	        pixel,pixelKey,pixelGroupKey,
	        length,r,g,b,
	        count = 0;
	    
	    
	    for (pixelKey in pixels) {
	      pixel = pixels[pixelKey];
	      totalWeight = pixel.weight * pixel.count;
	      ++count;
	      if (this.doesRgbMatch(rgbMatch, pixel.r, pixel.g, pixel.b)) {
	        pixelGroupKey = (pixel.r>>degrade) + "," + (pixel.g>>degrade) + "," + (pixel.b>>degrade);
	        if (db.hasOwnProperty(pixelGroupKey))
	          db[pixelGroupKey]+=totalWeight;
	        else
	          db[pixelGroupKey]=totalWeight;
	      }
	    }
	    
	    for (i in db) {
	      data = i.split(",");
	      r = data[0];
	      g = data[1];
	      b = data[2];
	      count = db[i];
	      
	      if (count>rgb.count) {
	        rgb.count = count;
	        data = i.split(",");
	        rgb.r = r;
	        rgb.g = g;
	        rgb.b = b;
	      }
	    }
	    
	    return rgb;
	    
	  };
		  this.doesRgbMatch = function(rgb,r,g,b) {
	    if (rgb==null) return true;
	    r = r >> rgb.d;
	    g = g >> rgb.d;
	    b = b >> rgb.d;
	    return rgb.r == r && rgb.g == g && rgb.b == b;
	  }
			
			
		}, // OBS
		
		// Makes light base colors (dark theme) ~ STATIC COLORS
		makeLightColors : function (arrno,h) {

		lightColor[arrno] = [];
		lightColor[arrno][0] = {};
		lightColor[arrno][0].HSV = {};
		lightColor[arrno][0].HSV.h = h; 
		lightColor[arrno][0].HSV.s = 15; 
		lightColor[arrno][0].HSV.v = 80;
		lightColor[arrno][0].HEX = this.convert.HSV2HEX(h, 15, 80);	 
		lightColor[arrno][0].RGB = {};
		this.convert.HSV2RGB(lightColor[arrno][0].HSV, lightColor[arrno][0].RGB);
	
		lightColor[arrno][1] = {};	
		lightColor[arrno][1].HSV = {};
		lightColor[arrno][1].HSV.h = h; 
		lightColor[arrno][1].HSV.s = 1; 
		lightColor[arrno][1].HSV.v = 99;
		lightColor[arrno][1].HEX = this.convert.HSV2HEX(h, 1, 99);	 
		lightColor[arrno][1].RGB = {};
		this.convert.HSV2RGB(lightColor[arrno][1].HSV, lightColor[arrno][1].RGB);
	
		lightColor[arrno][2] = {};	
		lightColor[arrno][2].HSV = {};
		lightColor[arrno][2].HSV.h = h; 
		lightColor[arrno][2].HSV.s = 30; 
		lightColor[arrno][2].HSV.v = 25;
		lightColor[arrno][2].HEX = this.convert.HSV2HEX(h, 30, 25);	 
		lightColor[arrno][2].RGB = {};
		this.convert.HSV2RGB(lightColor[arrno][2].HSV, lightColor[arrno][2].RGB);
		
	},
		
		// Makes dark base colors (light theme) ~ STATIC COLORS
		makeDarkColors : function (arrno,h) {
		
		darkColor[arrno] = [];
		darkColor[arrno][0] = {};
		darkColor[arrno][0].HSV = {};
		darkColor[arrno][0].HSV.h = h; 
		darkColor[arrno][0].HSV.s = 50; 
		darkColor[arrno][0].HSV.v = 12;
		darkColor[arrno][0].HEX = this.convert.HSV2HEX(h, 50, 12);	 
		darkColor[arrno][0].RGB = {};
		this.convert.HSV2RGB(darkColor[arrno][0].HSV, darkColor[arrno][0].RGB);
	
		darkColor[arrno][1] = {};	
		darkColor[arrno][1].HSV = {};
		darkColor[arrno][1].HSV.h = h; 
		darkColor[arrno][1].HSV.s = 30; 
		darkColor[arrno][1].HSV.v = 25;
		darkColor[arrno][1].HEX = this.convert.HSV2HEX(h, 30, 25);	 
		darkColor[arrno][1].RGB = {};
		this.convert.HSV2RGB(darkColor[arrno][1].HSV, darkColor[arrno][1].RGB);
	
		darkColor[arrno][2] = {};	
		darkColor[arrno][2].HSV = {};
		darkColor[arrno][2].HSV.h = h; 
		darkColor[arrno][2].HSV.s = 15; 
		darkColor[arrno][2].HSV.v = 70;
		darkColor[arrno][2].HEX = this.convert.HSV2HEX(h, 15, 70);	 
		darkColor[arrno][2].RGB = {};
		this.convert.HSV2RGB(darkColor[arrno][2].HSV, darkColor[arrno][2].RGB);
				
	},
		
	}	
	
	// *****************************************
	
	
	
	
	
	// *****************************************
		
	// START COLOR THEME
	// START COLOR THEME
	// START COLOR THEME

	// *****************************************

	initBegin();	
	function initBegin() {
	
		initInputFields();
	
		// BASIC
		// Chose between preset color themes
		
		// Get some triggers
		eVars._dark1 = Wu.DomUtil.get('colortheme-dark1');
		eVars._dark2 = Wu.DomUtil.get('colortheme-dark2');
		eVars._dark3 = Wu.DomUtil.get('colortheme-dark3');
		eVars._light1 = Wu.DomUtil.get('colortheme-light1');		
		
		
		eVars._darktheme = Wu.DomUtil.get('darktheme')
		eVars._lighttheme = Wu.DomUtil.get('lighttheme')
	
		// Get the wrappers
		eVars._color_Inner_wrapper = Wu.DomUtil.get('project-color-theme').parentNode;
		eVars._color_Outer_wrapper = Wu.DomUtil.get('project-color-theme').parentNode.parentNode;
		
		// Get the ADVANCED color theme button
		eVars._advanced = Wu.DomUtil.get('advanced-theme-selector');	
	
	
		// Set wrapper size...
	
		// Bring in the BASIC color theme part
		eVars._color_Inner_wrapper.style.left = '-310px';
		
		// Set the height of the outer wrapper
		eVars._color_Outer_wrapper.style.height = '182px';		
	
	
		// Clickers
	
		// DARK COLOR THEMES
		eVars._dark1.onclick = function() { 
		
			Wu.DomUtil.addClass(eVars._light1, 'colortheme-light1-on')
			prethemes('one'); 
			
		}

		eVars._dark2.onclick = function() {
		
			Wu.DomUtil.addClass(eVars._light1, 'colortheme-light1-on')		
			prethemes('two');
			
			}
			
		eVars._dark3.onclick = function() {
		
			Wu.DomUtil.addClass(eVars._light1, 'colortheme-light1-on')
			prethemes('three');
			
			}
		
		
		
		
		// Dark / light color theme togglers
		eVars._darktheme.onclick = function() {
			Wu.DomUtil.addClass(this, 'selected');
			Wu.DomUtil.removeClass(eVars._lighttheme, 'selected');
			colorTheme.darktheme = true;	
			prethemes(colorTheme.cTheme);
		}
	
		eVars._lighttheme.onclick = function() {
			Wu.DomUtil.addClass(this, 'selected');
			Wu.DomUtil.removeClass(eVars._darktheme, 'selected');
			colorTheme.darktheme = false;
			prethemes(colorTheme.cTheme);
		}	
		
		
		// Go to Advanced
		eVars._advanced.onclick = function() {
			advancedColorThemes.init();
			Wu.DomUtil.removeClass(eVars._light1, 'colortheme-light1-on')			
		}
	

	
	}

	// *****************************************




		
	// *****************************************
		
	// Set up the Array of the css[] Classes 
	// Set up the Array of the css[] Classes 
	// Set up the Array of the css[] Classes 

	// *****************************************
	
	var	initClassArray = {
		
			// Start it all, yo
			go : function () {

			// If there is no Color Theme, make a blank one

				if ( !colorTheme.css || rezet ) {
					this.stackClasses(theClassArray);
					this.makeCSSelements(theClassArray);
					this.makeCSSel();
				}
			
			
		},
				
			// These are the CSS classes that will get affected
			stackClasses : function (theClassArray) {
										
										
				// MENU BACKGROUND COLORS
				// MENU BACKGROUND COLORS
							
				theClassArray[0] = ['.ct0', 									
									'#content',
									'.item-list.controls-item',
									'.item-list.layer-item',
									'.item-list.layers-mapbox-item'
									];

				theClassArray[1] = ['.ct1',
									'#selectedTab span', 			// ??
									'#editorPanel > .content',		// ??
									'#editor',						// ??
									'#datalibrary-download-dialogue:after',
//									'th',
									'.fullpage-users'
									];
									
				theClassArray[2] = ['.ct2'];



				// I DON'T KNOW...
				// I DON'T KNOW...

				theClassArray[3] = ['.ct3'];
									

				// LINK COLOR
				// LINK COLOR
								
				// OK
				theClassArray[4] = ['.ct4',
									'.active a',
									'.editor-wrapper a'];
									
									

				// INACTIVE LAYERS
				// INACTIVE LAYERS

				// OK
				theClassArray[5] = ['.ct5'];
					
				// OK				
				theClassArray[6] = ['.ct6'];

				// OK
				theClassArray[7] = ['.ct7'];



				// ACTIVE LAYERS
				// ACTIVE LAYERS

				// OK -
				theClassArray[8] = [ '.ct8', 'layer-active'];
				
				// OK
				theClassArray[9] = ['.ct9'];



				// OTHER COLORS
				// OTHER COLORS



				theClassArray[10] = ['.ct10'];			
				
				// color
				theClassArray[11] = ['.ct11',
									 '.editor-projects-item:hover', 
									 '.smap-button-gray', 
									 '.smap-button-white',
									 '.item-list.controls-item.active',
									 '.item-list.layer-item.active',
									 '.active .layers-mapbox-item',
									 '.item-list.active', 
									 '.layer-item.active'
									 ];
				
				theClassArray[12] = ['.ct12'];
									 
				theClassArray[13] = ['.ct13',
									 '.editor-wrapper h3',
									 '.editor-wrapper h4',
									 '.editor-inner-wrapper h5'];									

				theClassArray[14] = ['.ct14'];
				
				theClassArray[15] = ['.ct15',
									 '#header'];
				
				theClassArray[16] = ['.ct16',
									 '#header',
									 '#header input'
									 ];
				
				theClassArray[17] = ['.ct17',
									 '.editor-project-edit-super-wrap'									 
									 ];
				
				// BG
				theClassArray[18] = ['.ct18', 
									 '.smap-button-gray', 
									 '.smap-button-white', 
									 ];
									 
									
				// BG
				theClassArray[19] = ['.ct19',
									 'tr:nth-child(odd)',
									 ];
									 

				theClassArray[20] = ['.ct20',
									 'tr:nth-child(even)',
									 '.ccontainer'];

				theClassArray[21] = ['.ct21'];
									  
				theClassArray[22] = ['.ct22', '.mat_swatches', '#darness-selector'];
				
				// GRAY TEXT
				theClassArray[23] = [ '.ct23',
									  '.editor-wrapper h3', 
									  '.editor-wrapper h4', 
									  '.documents-folder-item:hover', 
									  '.editor-map-item-wrap input', 
									  '.form-control input', 
									  'th',
									  '.datalibrary-controls',
									  '.input-box', '.search'
									  ];
			
			
				// WHITE BG
				theClassArray[24] = ['.ct24', 
									  '.editor-map-item-wrap input', 
									  '.form-control input'
									  ];
			
			

				theClassArray[25] = ['.ct25'];
				theClassArray[26] = ['.ct26'];
				theClassArray[27] = ['.ct27',
									 ];
			
				// Font weight
				theClassArray[28] = ['.ct28', 
									 'th', 
									 '#select-basic-themes',
									 '#advanced-color-header',
									 '.editor-inner-wrapper h5',
									 '.editor-map-item-wrap h4',
									 '.client-project-title-wrapper h4',
									 '.editor-projects-item h5',
									 '.editor-client-title h5',
									 '#userlist h4',
									 ];
									  
				theClassArray[29] = ['hr'];
			
				theClassArray[30] = ['blockquote'];
			
				theClassArray[31] = ['.ct31'];
				
				// Active List items BG
				theClassArray[32] = [
									
									 '.item-list.controls-item.active',
									 '.item-list.layer-item.actve',
									 '.active .layers-mapbox-item',									 
									 '.item-list.active', 
									 '.layer-item.active',									 
				
									];

				// Active List items color
				theClassArray[33] = [
									
									 '.item-list.controls-item.active',
									 '.item-list.layer-item.active',
									 '.active .layers-mapbox-item',									 
									 '.item-list.active', 
									 '.layer-item.active',									 
				
									];
				
				theClassArray[34] = ['.search'];
 
									 
			},						
						
			makeCSSelements : function (theClassArray) {
			 

				// Base Colors			
				this.makeCSSel(0, 'background-color', '');
				this.makeCSSel(1, 'background-color', '');
				this.makeCSSel(2, 'background-color', '');	
			 
				// I DON'T KNOW...	 
				this.makeCSSel(3, 'color', '');
		
				// Link Color
				this.makeCSSel(4, 'color', '');
					 
				// Inactive Layers			 
				this.makeCSSel(5, 'background-color', '');	
				this.makeCSSel(6, 'background-color', '');	
				this.makeCSSel(7, 'background-color', '');	
		
				// Active Layers
				this.makeCSSel(8, 'background-color', '');	
				this.makeCSSel(9, 'background-color', '');	
		
				// Other Colors
				this.makeCSSel(10, 'color', '');
				this.makeCSSel(11, 'color', 'white');
				this.makeCSSel(12, 'color', 'black');
				this.makeCSSel(13, 'color', 'white');
				this.makeCSSel(14, 'background-color', '');
				this.makeCSSel(15, 'background-color', '');
				this.makeCSSel(16, 'color', '');
				this.makeCSSel(17, 'background-color', '');
				this.makeCSSel(18, 'background-color', '');
		
		
				 // EXTRA CLASSES FOR TOGGELIG BETWEEN LIGHT AND DARK THEMES!!!		
				this.makeCSSel(19, 'background-color', '');
				this.makeCSSel(20, 'background-color', '');
				this.makeCSSel(21, 'border-bottom', '' );
				this.makeCSSel(22, 'background-color', '' );
				this.makeCSSel(23, 'color', '' );
				this.makeCSSel(24, 'background-color', '' );
				this.makeCSSel(25, 'color', '' );
				this.makeCSSel(26, 'background', '' );
				this.makeCSSel(27, 'font-weight', '' );
				this.makeCSSel(28, 'font-weight', '' );
				this.makeCSSel(29, 'border-top', '' );
				this.makeCSSel(30, 'border-left', '' );
				this.makeCSSel(31, 'background-position', '' );

				this.makeCSSel(32, 'background-color', '' );
				this.makeCSSel(33, 'color', '' );				

				this.makeCSSel(34, 'background-color', '' );				
		
		
		
			}, 
	
			// Sets up the CSS elements in the Array			
			makeCSSel : function (va, pre, val) {
				colorTheme.css[va] = {};
				colorTheme.css[va].classes = theClassArray[va];
				colorTheme.css[va].pre = pre;
				colorTheme.css[va].value = val;					
			}
		}		
		
	initClassArray.go();
	
	// *****************************************
	
	

	

	// *****************************************
	
	// LOAD THE PREDEFINED COLOR THEMES (BASIC)
	// LOAD THE PREDEFINED COLOR THEMES (BASIC)
	// LOAD THE PREDEFINED COLOR THEMES (BASIC)
	
	// *****************************************
	
	function prethemes(theme) {
	
		if ( theme == 'one' ) {
		colorTheme.cTheme = 'one';
		if ( colorTheme.darktheme ) {
		
			// Base Colors			
			preval_0 = '#0F1A1E';
			preval_1 = '#3F4652';
			preval_2 = '#97ABB2';
			
			preval_3 = '#424242';
	
			// Link Color
			preval_4 = 'cyan';
						
			// Inactive Layers
			preval_5 = '#63A3A0';
			preval_6 = '#CCE2E1';
			preval_7 = '#EDF4F4';
	
			// Active Layers
			preval_8 = '#B80077';
			preval_9 = '#F7E1EF';
			
			// Other Colors
			preval_10 = 'white';						// Text color on Side Pane and Layer Selector
			
			preval_11 = 'white';						// Text on Active AND Inactive Layers – Level 1
			preval_12 = '#333';							// Text on ONLY Inactive Layer – Level 2
			preval_13 = 'white';						// Text color on Main Menu Shade 2 (Plus the white buttons, but that's not right...)
//			preval_14 = 'rgba(255,255,255,0.7)';		// Background color on Map Boxes
			preval_15 = 'white';						// Background color on HEADER and Map Box Headers on Map
			preval_16 = '#333';							// TEXT color on Header and Map Box Headers on Map
			preval_17 = 'rgba(255, 255, 255, 0.15)';	// Background color Boxes on sidepane (New client box, etc)
			preval_18 = 'white';						// Bacground color Buttons
			
			colorTheme.cThemeDarkBox = true;
			colorTheme.cThemeDarkHeader = false;
			colorTheme.cThemeDarkMenu = true;

		} else {
			
	
			var RGB = {}, HSV = {}, base = '#ADC3CC';
	
			eCol.convert.HEX2RGB (base, RGB);			
			eCol.convert.RGB2HSV (RGB, HSV);			
	
			var newhex = eCol.convert.HSV2HEX(HSV.h, 3, 98);
	
			eCol.convert.HEX2RGB (base, RGB);
			var rgba_50 = 'rgba(' + RGB.r + ',' + RGB.g + ',' + RGB.b + ',0.5)';		
	
	
			// Base Colors
			preval_0 = base;
			preval_1 = newhex;
			preval_2 = 'red';			
			
			preval_3 = 'white';
			
			// Link
			preval_4 = '#309EB2';
			
			// Inactive Layers
			preval_5 = '#63A3A0';
			preval_6 = '#CCE2E1';
			preval_7 = '#EDF4F4';
	
			// Active Layers
			preval_8 = '#B80077';
			preval_9 = '#F7E1EF';
			
			// Other Colors
			preval_10 = 'white';				// Text color on Side Pane and Layer Selector
			
			preval_11 = 'white';				// Text on Active AND Inactive Layers – Level 1
			preval_12 = 'white';				// Text on ONLY Inactive Layer – Level 2
			preval_13 = 'black';				// Text color on Main Menu Shade 2 (Plus the white buttons, but that's not right...)
//			preval_14 = 'rgba(0,0,0,0.7)';		// Background color on Map Boxes
			preval_15 = '#333';					// Background color on HEADER and Map Box Headers on Map
			preval_16 = 'white';				// TEXT color on Header and Map Box Headers on Map
			preval_17 = rgba_50;				// Background color Boxes on sidepane (New client box, etc)
			preval_18 = base;					// Bacground color Buttons
					
						
			colorTheme.cThemeDarkBox = false;
			colorTheme.cThemeDarkHeader = false;
			colorTheme.cThemeDarkMenu = false;			
						
		}
	}	
		if ( theme == 'two' ) {

		colorTheme.cTheme = 'two';

		if ( colorTheme.darktheme ) {

			// Base Colors
			preval_0 = '#0F1A1E';
			preval_1 = '#2C3A3F';
			preval_2 = '#A6B7BF';
	
			preval_3 = '#424242';
	
			// Link
			preval_4 = '#FF5300';
		
	
			// Inactive Layers
			preval_5 = '#63A3A0';
			preval_6 = '#CCE2E1';
			preval_7 = '#EDF4F4';
	
			// Active Layers
			preval_8 = '#F98752';
			preval_9 = '#FCF2ED';
			
			// Other Colors			
			preval_10 = 'white';						// Text color on Side Pane and Layer Selector
			preval_11 = 'white';						// Text on Active AND Inactive Layers – Level 1
			preval_12 = '#333';							// Text on ONLY Inactive Layer – Level 2
			preval_13 = 'white';						// Text color on Main Menu Shade 2 (Plus the white buttons, but that's not right...)
//			preval_14 = 'rgba(255,255,255,0.7)';		// Background color on Map Boxes
			preval_15 = 'white';						// Background color on HEADER and Map Box Headers on Map
			preval_16 = '#333';							// TEXT color on Header and Map Box Headers on Map
			preval_17 = 'rgba(255, 255, 255, 0.15)';	// Background color Boxes on sidepane (New client box, etc)			
			preval_18 = 'white';						// Bacground color Buttons
			
			colorTheme.cThemeDarkBox = true;
			colorTheme.cThemeDarkHeader = false;
			colorTheme.cThemeDarkMenu = true;


		} else {
			
			var RGB = {}, HSV = {}, base = '#CCBFAD';
	
			eCol.convert.HEX2RGB (base, RGB);			
			eCol.convert.RGB2HSV (RGB, HSV);			
	
			var newhex = eCol.convert.HSV2HEX(HSV.h, 3, 98);
	
			eCol.convert.HEX2RGB (base, RGB);
			var rgba_50 = 'rgba(' + RGB.r + ',' + RGB.g + ',' + RGB.b + ',0.5)';		
	
	
	
			// Base Color
			preval_0 = base;
			preval_1 = newhex;			
			preval_2 = 'red';
						
			preval_3 = 'white';
	
			// Link
			preval_4 = '#2B889E';
	
			// Inactive Layers
			preval_5 = '#63A3A0';
			preval_6 = '#CCE2E1';
			preval_7 = '#EDF4F4';
	
			// Active Layers
			preval_8 = '#B80077';
			preval_9 = '#F7E1EF';
			
			// Other Colors
			preval_10 = 'white';				// Text color on Side Pane and Layer Selector
			preval_11 = 'white';				// Text on Active AND Inactive Layers – Level 1
			preval_12 = 'white';				// Text on ONLY Inactive Layer – Level 2
			preval_13 = 'black';				// Text color on Main Menu Shade 2 (Plus the white buttons, but that's not right...)
//			preval_14 = 'rgba(0,0,0,0.7)';		// Background color on Map Boxes
			preval_15 = '#333';					// Background color on HEADER and Map Box Headers on Map
			preval_16 = 'white';				// TEXT color on Header and Map Box Headers on Map
			preval_17 = rgba_50;				// Background color Boxes on sidepane (New client box, etc)
			preval_18 = base;					// Bacground color Buttons
			
					
			colorTheme.cThemeDarkBox = false;
			colorTheme.cThemeDarkHeader = false;
			colorTheme.cThemeDarkMenu = false;			
			
			
			
		}
	}
		if ( theme == 'three' ) {
	
			colorTheme.cTheme = 'three';
		
			if ( colorTheme.darktheme ) {
					
				// Base Colors
				preval_0 = '#0F1A1E';
				preval_1 = '#333333';
				preval_2 = '#A6A6A6';
		
				preval_3 = '#424242';
		
				// Link
				preval_4 = '#FF00AA';
		
				// Inactive Layers
				preval_5 = '#63A3A0';
				preval_6 = '#CCE2E1';
				preval_7 = '#EDF4F4';
		
				// Active Layers
				preval_8 = '#B80077';
				preval_9 = '#F7E1EF';
				
				// Other Colors
				preval_10 = 'white';						// Text color on Side Pane and Layer Selector
				preval_11 = 'white';						// Text on Active AND Inactive Layers – Level 1
				preval_12 = '#333';							// Text on ONLY Inactive Layer – Level 2
				preval_13 = 'white';						// Text color on Main Menu Shade 2 (Plus the white buttons, but that's not right...)
	//			preval_14 = 'rgba(255,255,255,0.7)';		// Background color on Map Boxes
				preval_15 = 'white';						// Background color on HEADER and Map Box Headers on Map
				preval_16 = '#333';							// TEXT color on Header and Map Box Headers on Map
				preval_17 = 'rgba(255, 255, 255, 0.15)';	// Background color Boxes on sidepane (New client box, etc)			
				preval_18 = 'white';						// Bacground color Buttons
				
				colorTheme.cThemeDarkBox = true;
				colorTheme.cThemeDarkHeader = false;
				colorTheme.cThemeDarkMenu = true;
	
	
			} else {
				
				var RGB = {}, HSV = {}, base = '#BCBCBC';
		
				eCol.convert.HEX2RGB (base, RGB);			
				eCol.convert.RGB2HSV (RGB, HSV);			
		
				var newhex = eCol.convert.HSV2HEX(HSV.h, 0, 98);
		
				eCol.convert.HEX2RGB (base, RGB);
				var rgba_50 = 'rgba(' + RGB.r + ',' + RGB.g + ',' + RGB.b + ',0.5)';
		
			
				// Base Colors
				preval_0 = base;
				preval_1 = newhex;
				preval_2 = 'red';
		
				preval_3 = 'white';
		
				// Link
				preval_4 = '#AE2B95';
		
				// Inactive Layers
				preval_5 = '#63A3A0';
				preval_6 = '#CCE2E1';
				preval_7 = '#EDF4F4';
		
				// Active Layers
				preval_8 = '#B80077';
				preval_9 = '#F7E1EF';
		
				// Other Colors
				preval_10 = 'white';				// Text color on Side Pane and Layer Selector
				
				preval_11 = 'white';				// Text on Active AND Inactive Layers – Level 1
				preval_12 = 'white';				// Text on ONLY Inactive Layer – Level 2
				preval_13 = 'black';				// Text color on Main Menu Shade 2 (Plus the white buttons, but that's not right...)
	//			preval_14 = 'rgba(0,0,0,0.7)';		// Background color on Map Boxes
				preval_15 = '#333';					// Background color on HEADER and Map Box Headers on Map
				preval_16 = 'white';				// TEXT color on Header and Map Box Headers on Map
				preval_17 = rgba_50;				// Background color Boxes on sidepane (New client box, etc)
				preval_18 = base;					// Bacground color Buttons
	
				colorTheme.cThemeDarkBox = false;
				colorTheme.cThemeDarkHeader = false;
				colorTheme.cThemeDarkMenu = false;			
			}		
	}
	
	
	
	
		colorTheme.css[3].value = preval_3;	
	
		// Link
		colorTheme.css[4].value = preval_4;
		
		// Inactive Layers
		colorTheme.css[5].value = preval_5;	
		colorTheme.css[6].value = preval_6;	
		colorTheme.css[7].value = preval_7;	
		
		// Active Layers	
		colorTheme.css[8].value = preval_8;	
		colorTheme.css[9].value = preval_9;
	
	
		// MENU : LIGHT OR DARK
		
		if ( colorTheme.cThemeDarkMenu ) {
			darkMenu(preval_1);		
		} else {
			lightMenu(preval_1);
		}
		
	
		// BOXES : LIGHT OR DARK
		
		if ( colorTheme.cThemeDarkBox ) {
			colorTheme.css[14].value = 'rgba(0,0,0,0.7)';
			colorTheme.css[31].value = '-56px 8px';		
		} else {
			colorTheme.css[14].value = 'rgba(255, 255, 255, 0.7)';		
			colorTheme.css[31].value = '';
		}
		
		// HEADERS: LIGHT OR DARK
		
		if ( colorTheme.cThemeDarkHeader ) {
			colorTheme.css[15].value = 'rgba(0,0,0,0.8)';
			colorTheme.css[16].value = 'white';			
		} else {
			colorTheme.css[15].value = 'rgba(255,255,255,0.92)';	
			colorTheme.css[16].value = '#333';	
		}
		
	
		// Other Colors
	
		colorTheme.css[10].value = preval_10;	// Link on white background
			
		eCol.update.CSSstring();
		jcss.innerHTML = cssstring;
	
	}
	
	// *****************************************
		
	
	
	
	// *****************************************
	
	// Advanced Color Theme Mode
	// Advanced Color Theme Mode
	// Advanced Color Theme Mode

	// *****************************************
	
	var advancedColorThemes = {
	
	init : function() {

	
		// For CSS animating height of container
		var pheight1 = '342px';
		var pheight2 = '490px';
	
	
		// Slide in the ADVANCED options
		eVars._color_Inner_wrapper.style.left = '-580px';		
		eVars._color_Outer_wrapper.style.height = pheight1;
		
		// Basic elements
		eVars._b2basic = Wu.DomUtil.get('back-to-basic');
		eVars._yourswatch = Wu.DomUtil.get('yourswatch');	
		eVars._myCanvas = Wu.DomUtil.get("myCanvas");
		eVars._pixCanvas = Wu.DomUtil.get("pixCanvas");
		eVars._canvimg = Wu.DomUtil.get("canvimg");
				
		// Edit Color Buttons
		eVars._coloption1 = Wu.DomUtil.get('coloption1');
		eVars._coloption2 = Wu.DomUtil.get('coloption2');
		eVars._coloption3 = Wu.DomUtil.get('coloption3');	
		eVars._yourcolLink1 = Wu.DomUtil.get('yourcol_link1');
		eVars._regen = Wu.DomUtil.get('regen');				
		
		// Swatch containers
		eVars._normalSwatches = Wu.DomUtil.get('normal-swatches');
		eVars._darkSwatches = Wu.DomUtil.get('dark-swatches');
		eVars._linkSwatches = Wu.DomUtil.get('link-swatches');
		eVars._colorSuggestions = Wu.DomUtil.get('color-suggestions');		
		
		// Toggle buttons
		eVars._hsvToggle = Wu.DomUtil.get('hsv-toggle');
		eVars._rgbToggle = Wu.DomUtil.get('rgb-toggle'); 					
		eVars._paletteToggle = Wu.DomUtil.get('palette-toggle');
		eVars._sliderToggle = Wu.DomUtil.get('slider-toggle'); 	
		eVars._imageToggle = Wu.DomUtil.get('image-toggle'); 			
		
		// Dark/light tickers
		eVars._tickMenuLight = Wu.DomUtil.get('tick-menu-light');
		eVars._tickMenuDark = Wu.DomUtil.get('tick-menu-dark');		

		eVars._tickHeaderLight = Wu.DomUtil.get('tick-header-light');
		eVars._tickHeaderDark = Wu.DomUtil.get('tick-header-dark');		

		eVars._tickMboxLight = Wu.DomUtil.get('tick-mbox-light');
		eVars._tickMboxDark = Wu.DomUtil.get('tick-mbox-dark');	
		
		// Dark Color Swatches
		eVars._dark_swatch_0 = Wu.DomUtil.get('dark_swatch_0');		
		eVars._dark_swatch_1 = Wu.DomUtil.get('dark_swatch_1');		
		eVars._dark_swatch_2 = Wu.DomUtil.get('dark_swatch_2');		
		eVars._dark_swatch_3 = Wu.DomUtil.get('dark_swatch_3');		
		eVars._dark_swatch_4 = Wu.DomUtil.get('dark_swatch_4');		
		eVars._dark_swatch_5 = Wu.DomUtil.get('dark_swatch_5');
		
		eVars._dark_swatch_0.onclick = function() { passcolor('dark',0); }
		eVars._dark_swatch_1.onclick = function() { passcolor('dark',1); }
		eVars._dark_swatch_2.onclick = function() { passcolor('dark',2); }
		eVars._dark_swatch_3.onclick = function() { passcolor('dark',3); }
		eVars._dark_swatch_4.onclick = function() { passcolor('dark',4); }
		eVars._dark_swatch_5.onclick = function() { passcolor('dark',5); }
		

		// Light Color Swatches
		eVars._light_swatch_0 = Wu.DomUtil.get('light_swatch_0');		
		eVars._light_swatch_1 = Wu.DomUtil.get('light_swatch_1');		
		eVars._light_swatch_2 = Wu.DomUtil.get('light_swatch_2');		
		eVars._light_swatch_3 = Wu.DomUtil.get('light_swatch_3');		
		eVars._light_swatch_4 = Wu.DomUtil.get('light_swatch_4');		
		eVars._light_swatch_5 = Wu.DomUtil.get('light_swatch_5');		
		
		eVars._light_swatch_0.onclick = function() { passcolor('light',0); }		
		eVars._light_swatch_1.onclick = function() { passcolor('light',1); }		
		eVars._light_swatch_2.onclick = function() { passcolor('light',2); }		
		eVars._light_swatch_3.onclick = function() { passcolor('light',3); }		
		eVars._light_swatch_4.onclick = function() { passcolor('light',4); }		
		eVars._light_swatch_5.onclick = function() { passcolor('light',5); }		
		
		
		// Complimetary Color Swatches
		eVars._complimentary_swatch_0 = Wu.DomUtil.get('complimentary_swatch_0');		
		eVars._complimentary_swatch_1 = Wu.DomUtil.get('complimentary_swatch_1');		
		eVars._complimentary_swatch_2 = Wu.DomUtil.get('complimentary_swatch_2');		
		eVars._complimentary_swatch_3 = Wu.DomUtil.get('complimentary_swatch_3');		

		eVars._complimentary_swatch_0.onclick = function() { passcolor('complimentary',0); }		
		eVars._complimentary_swatch_1.onclick = function() { passcolor('complimentary',1); }		
		eVars._complimentary_swatch_2.onclick = function() { passcolor('complimentary',2); }		
		eVars._complimentary_swatch_3.onclick = function() { passcolor('complimentary',3); }		


		// Matching Color Swatches
		eVars._matching_swatch_0 = Wu.DomUtil.get('matching_swatch_0');		
		eVars._matching_swatch_1 = Wu.DomUtil.get('matching_swatch_1');		
		eVars._matching_swatch_2 = Wu.DomUtil.get('matching_swatch_2');		
		eVars._matching_swatch_3 = Wu.DomUtil.get('matching_swatch_3');		
		eVars._matching_swatch_4 = Wu.DomUtil.get('matching_swatch_4');	
		
		eVars._matching_swatch_0.onclick = function() { passcolor('matching',0); }		
		eVars._matching_swatch_1.onclick = function() { passcolor('matching',1); }		
		eVars._matching_swatch_2.onclick = function() { passcolor('matching',2); }		
		eVars._matching_swatch_3.onclick = function() { passcolor('matching',3); }		
		eVars._matching_swatch_4.onclick = function() { passcolor('matching',4); }		
			

		// Bright Color Swatches
		eVars._bright_swatch_0 = Wu.DomUtil.get('bright_swatch_0');		
		eVars._bright_swatch_1 = Wu.DomUtil.get('bright_swatch_1');		
		eVars._bright_swatch_2 = Wu.DomUtil.get('bright_swatch_2');		
		eVars._bright_swatch_3 = Wu.DomUtil.get('bright_swatch_3');		
		eVars._bright_swatch_4 = Wu.DomUtil.get('bright_swatch_4');		
		eVars._bright_swatch_5 = Wu.DomUtil.get('bright_swatch_5');		
		eVars._bright_swatch_6 = Wu.DomUtil.get('bright_swatch_6');		
		eVars._bright_swatch_7 = Wu.DomUtil.get('bright_swatch_7');		
		eVars._bright_swatch_8 = Wu.DomUtil.get('bright_swatch_8');		
		eVars._bright_swatch_9 = Wu.DomUtil.get('bright_swatch_9');		
		eVars._bright_swatch_10 = Wu.DomUtil.get('bright_swatch_10');		
		
		eVars._bright_swatch_0.onclick = function() { passcolor('bright',0); }				
		eVars._bright_swatch_1.onclick = function() { passcolor('bright',1); }				
		eVars._bright_swatch_2.onclick = function() { passcolor('bright',2); }				
		eVars._bright_swatch_3.onclick = function() { passcolor('bright',3); }				
		eVars._bright_swatch_4.onclick = function() { passcolor('bright',4); }				
		eVars._bright_swatch_5.onclick = function() { passcolor('bright',5); }				
		eVars._bright_swatch_6.onclick = function() { passcolor('bright',6); }				
		eVars._bright_swatch_7.onclick = function() { passcolor('bright',7); }				
		eVars._bright_swatch_8.onclick = function() { passcolor('bright',8); }				
		eVars._bright_swatch_9.onclick = function() { passcolor('bright',9); }				
		eVars._bright_swatch_10.onclick = function() { passcolor('bright',10); }
		
		
		
		
		
		
		// SET RIGHT TOGGLE STATES...
		
		if ( colorTheme.cThemeDarkMenu ) {
			Wu.DomUtil.addClass(eVars._tickMenuDark, 'active-toggle');
			Wu.DomUtil.removeClass(eVars._tickMenuLight, 'active-toggle');
		} else {
			Wu.DomUtil.removeClass(eVars._tickMenuDark, 'active-toggle');
			Wu.DomUtil.addClass(eVars._tickMenuLight, 'active-toggle');
		}
		
		if ( colorTheme.cThemeDarkBox ) {
			Wu.DomUtil.addClass(eVars._tickMboxDark, 'active-toggle');
			Wu.DomUtil.removeClass(eVars._tickMboxLight, 'active-toggle');
		} else {
			Wu.DomUtil.removeClass(eVars._tickMboxDark, 'active-toggle');
			Wu.DomUtil.addClass(eVars._tickMboxLight, 'active-toggle');
		}

		if ( colorTheme.cThemeDarkHeader ) {
			Wu.DomUtil.addClass(eVars._tickHeaderDark, 'active-toggle');
			Wu.DomUtil.removeClass(eVars._tickHeaderLight, 'active-toggle');
		} else {
			Wu.DomUtil.removeClass(eVars._tickHeaderDark, 'active-toggle');
			Wu.DomUtil.addClass(eVars._tickHeaderLight, 'active-toggle');
		}
		
			
		
		
		
						
		// Set background color of MAIN swatch
		eVars._yourswatch.style.backgroundColor = basecolor;	
		
		// Back to BASIC mode
		eVars._b2basic.onclick = function() {
		
			// Reset
			if ( changingColors == 1 ) eVars._coloption1.click();		
			if ( changingColors == 2 ) eVars._coloption2.click();
			if ( changingColors == 3 ) eVars._coloption3.click();
			if ( changingColors == 4 ) eVars._yourcolLink1.click();
			if ( changingColors == 'all' ) eVars._regen.click();

			eVars._color_Inner_wrapper.style.left = '-310px';
			eVars._color_Outer_wrapper.style.height = '182px';				
		
		}
	
		// INIT SLIDERS				
		this.initSliders();
	
		// Find the right image to use for the color picker...
		// OBS! Image must be stored locally (same url as server) for it to work...
		var uggid = Wu.DomUtil.get('project-color-theme').parentNode.getAttribute('uuid');
		var ulist =	Wu.DomUtil.get('editor-projects-container');
			ulist = ulist.getElementsByTagName('div');

		// Color picker
		eCol.cPicker.img2canvas();
			
		// INIT CHANGING COLORS
		this.initComplimentaryColors();
		this.initMatchingColors();
		
		// INIT STATIC COLORS
		this.initDarkColors();
		this.initLightColors();
		this.initBrightColors();	
	
		updateTempSwatches();
	
	
		// Load default color theme if there ain't nothin there...
		if ( !colorTheme.css || rezet ) prethemes('one');
	
	
		
		// TRIGGERS / CLICKS 


		// 1 ~ Background color
		eVars._coloption1.onclick = function() {
			
			
				haschanged = true;
		
				// If we are already editing this color
				if ( changingColors == 1 ) {
				
					eVars._color_Outer_wrapper.style.height = pheight1;
								
					// Disable editing state									
					changingColors = false;
					
					// Remove red box around this element				
					Wu.DomUtil.removeClass(this, 'changing');
					
					// Set back to default swatches								
					Wu.DomUtil.removeClass(eVars._normalSwatches, 'die');
					Wu.DomUtil.addClass(eVars._darkSwatches, 'die');
					Wu.DomUtil.addClass(eVars._linkSwatches, 'die');					
	
					// Close the swatch selector												
					Wu.DomUtil.addClass(eVars._colorSuggestions, 'collapsed-color-suggestions');
									
									
				} else {
				
					eVars._color_Outer_wrapper.style.height = pheight2;			
				
					// Set edit state			
					changingColors = 1;
					
					// Put red box around this element		
					Wu.DomUtil.addClass(this, 'changing');							
	
					// What swatches to show
					Wu.DomUtil.removeClass(eVars._darkSwatches, 'die');
					Wu.DomUtil.addClass(eVars._linkSwatches, 'die');
					Wu.DomUtil.addClass(eVars._normalSwatches, 'die');
	
					// Remove red frame from other elements
					Wu.DomUtil.removeClass(eVars._coloption2, 'changing');																
					Wu.DomUtil.removeClass(eVars._coloption3, 'changing');																
					Wu.DomUtil.removeClass(eVars._yourcolLink1, 'changing');																
//					Wu.DomUtil.removeClass(eVars._yourcolLink2, 'changing');																
					Wu.DomUtil.removeClass(eVars._regen, 'changing');										
					
					
					// Update the Alfra Omega swatch
					eVars._yourswatch.style.backgroundColor = colorTheme.css[0].value;
					
					// Set the HEX value in the input field
					eVars._hexColor.value = colorTheme.css[0].value;				
					
					// Open the swatch selector
					Wu.DomUtil.removeClass(eVars._colorSuggestions, 'collapsed-color-suggestions');

					// Bring back the Palette Toggle Button
					eVars._paletteToggle.removeAttribute('style');

					// Update Value					
					eCol.update.HEX(eVars._hexColor.value);				
					eCol.update.inputFields('HEX');
	
				}
			}
	
		// 2 ~ The menu color
		eVars._coloption2.onclick = function() {
	
	
				haschanged = true;
	
				// If we are already editing this color
				if ( changingColors == 2 ) {
	
					eVars._color_Outer_wrapper.style.height = pheight1;
								
					// Disable editing state						
					changingColors = false;
					
					// Remove red box around this element
					Wu.DomUtil.removeClass(this, 'changing');								
					
					// Close the swatch selector								
					Wu.DomUtil.addClass(eVars._colorSuggestions, 'collapsed-color-suggestions');
									
				} else {
				
					eVars._color_Outer_wrapper.style.height = pheight2;
				
					// Set edit state			
					changingColors = 2;
					
					// Put red box around this element
					Wu.DomUtil.addClass(this, 'changing');								
						
					// What swatches to show
					Wu.DomUtil.removeClass(eVars._normalSwatches, 'die');	
					Wu.DomUtil.addClass(eVars._linkSwatches, 'die');	
					Wu.DomUtil.addClass(eVars._darkSwatches, 'die');	
					
	
					// Remove red frame from other elements					
					Wu.DomUtil.removeClass(eVars._coloption1, 'changing');															
					Wu.DomUtil.removeClass(eVars._coloption3, 'changing');															
					Wu.DomUtil.removeClass(eVars._yourcolLink1, 'changing');															
//					Wu.DomUtil.removeClass(eVars._yourcolLink2, 'changing');															
					Wu.DomUtil.removeClass(eVars._regen, 'changing');															
					
					// Update the Alfra Omega swatch
					eVars._yourswatch.style.backgroundColor = colorTheme.css[5].value;
	
					// Set the HEX value in the input field
					eVars._hexColor.value = colorTheme.css[5].value;		
									
					// Open the swatch selector
					Wu.DomUtil.removeClass(eVars._colorSuggestions, 'collapsed-color-suggestions');
					
					eCol.update.HEX(eVars._hexColor.value);

					eCol.update.inputFields('HEX');
					
					
					// Bring back the Palette Toggle Button
					eVars._paletteToggle.removeAttribute('style');
					
					
				}
			}

		// 3 ~ Selected / active colors
		eVars._coloption3.onclick = function() {
	
				haschanged = true;
	
				// If we are already editing this color
				if ( changingColors == 3 ) {
				
					eVars._color_Outer_wrapper.style.height = pheight1;			
				
					// Disable editing state			
					changingColors = false;
					
					// Remove red box around this element
					Wu.DomUtil.removeClass(this, 'changing');
					
					// Close the swatch selector				
					Wu.DomUtil.addClass(eVars._colorSuggestions, 'collapsed-color-suggestions');
					
				} else {
				
					eVars._color_Outer_wrapper.style.height = pheight2;
								
					// Set edit state			
					changingColors = 3;
					
					// Put red box around this element
					Wu.DomUtil.addClass(this, 'changing');
	
					// What swatches to show
					Wu.DomUtil.removeClass(eVars._normalSwatches, 'die');
					Wu.DomUtil.addClass(eVars._linkSwatches, 'die');
					Wu.DomUtil.addClass(eVars._darkSwatches, 'die');

					// Remove red frame from other elements
					Wu.DomUtil.removeClass(eVars._coloption1, 'changing');					
					Wu.DomUtil.removeClass(eVars._coloption2, 'changing');					
					Wu.DomUtil.removeClass(eVars._yourcolLink1, 'changing');					
//					Wu.DomUtil.removeClass(eVars._yourcolLink2, 'changing');					
					Wu.DomUtil.removeClass(eVars._regen, 'changing');		
	
					// Update the Alfra Omega swatch				
					eVars._yourswatch.style.backgroundColor = colorTheme.css[8].value;
	
					// Set the HEX value in the input field
					eVars._hexColor.value = colorTheme.css[8].value;
												
					// Open the swatch selector				
					Wu.DomUtil.removeClass(eVars._colorSuggestions, 'collapsed-color-suggestions');
	
					eCol.update.HEX(eVars._hexColor.value);

					eCol.update.inputFields('HEX');
					
					
					// Bring back the Palette Toggle Button
					eVars._paletteToggle.removeAttribute('style');

					
				}
			}
			
		// 4 ~ Link color
		eVars._yourcolLink1.onclick = function() {
			
				haschanged = true;
			
				// If we are already editing this color
				if ( changingColors == 4 ) {
			
					eVars._color_Outer_wrapper.style.height = pheight1;
							
					// Disable editing state
					changingColors = false;
					
					// Remove red box around this element
					Wu.DomUtil.removeClass(this, 'changing');					

					
					// Set back to default swatches
					Wu.DomUtil.addClass(eVars._linkSwatches, 'die');					
					Wu.DomUtil.addClass(eVars._darkSwatches, 'die');					
					Wu.DomUtil.removeClass(eVars._normalSwatches, 'die');					

	
					// Close the swatch selector
					Wu.DomUtil.addClass(eVars._colorSuggestions, 'collapsed-color-suggestions');					
	
	
				} else {
						
					eVars._color_Outer_wrapper.style.height = pheight2;
										
					// Set edit state
					changingColors = 4;
					
					// Put red box around this element
					Wu.DomUtil.addClass(this, 'changing');					

			
					// What swatches to show
					Wu.DomUtil.removeClass(eVars._linkSwatches, 'die');					
					Wu.DomUtil.addClass(eVars._darkSwatches, 'die');					
					Wu.DomUtil.addClass(eVars._normalSwatches, 'die');					
					
					// Remove red frame from other elements
					Wu.DomUtil.removeClass(eVars._coloption1, 'changing');
					Wu.DomUtil.removeClass(eVars._coloption2, 'changing');
					Wu.DomUtil.removeClass(eVars._coloption3, 'changing');
//					Wu.DomUtil.removeClass(eVars._yourcolLink2, 'changing');
					Wu.DomUtil.removeClass(eVars._regen, 'changing');									
					
					// Update the Alfra Omega swatch
					eVars._yourswatch.style.backgroundColor = colorTheme.css[4].value;
	
					// Set the HEX value in the input field
					eVars._hexColor.value = colorTheme.css[4].value;
					
					// Open the swatch selector
					Wu.DomUtil.removeClass(eVars._colorSuggestions, 'collapsed-color-suggestions');					
					
					eCol.update.HEX(eVars._hexColor.value);
					eCol.update.inputFields('HEX');				
					
					
					// Bring back the Palette Toggle Button
					eVars._paletteToggle.removeAttribute('style');
									

				}
			}
	
		// all ~ Change Complimentary & Matching Colors
		eVars._regen.onclick = function() {
			
			
				// If we are already editing this color
				if ( changingColors == 'all' ) {
				
					eVars._color_Outer_wrapper.style.height = pheight1;			
			
					// Disable editing state
					changingColors = false;
					
					// Remove red box around this element
					Wu.DomUtil.removeClass(this, 'changing');

					// Set back to default swatches
					Wu.DomUtil.removeClass(eVars._normalSwatches, 'die');					
					Wu.DomUtil.addClass(eVars._linkSwatches, 'die');
					Wu.DomUtil.addClass(eVars._darkSwatches, 'die');					
																	
					// Bring back the Palette Toggle Button
					eVars._paletteToggle.removeAttribute('style');
					
					// Close the swatch selector
					Wu.DomUtil.addClass(eVars._colorSuggestions, 'collapsed-color-suggestions');

				} else {
	
					eVars._color_Outer_wrapper.style.height = pheight2;			
						
					// Set edit state
					changingColors = 'all';
					
					// Put red box around this element
					Wu.DomUtil.addClass(this, 'changing');
	
					// What swatches to show
					Wu.DomUtil.removeClass(eVars._normalSwatches, 'die');										
					Wu.DomUtil.addClass(eVars._linkSwatches, 'die');					
					Wu.DomUtil.addClass(eVars._darkSwatches, 'die');					
											
					// Remove red frame from other elements
					Wu.DomUtil.removeClass(eVars._coloption1, 'changing');
					Wu.DomUtil.removeClass(eVars._coloption2, 'changing');
					Wu.DomUtil.removeClass(eVars._coloption3, 'changing');
					Wu.DomUtil.removeClass(eVars._yourcolLink1, 'changing');

					// Update the Alfra Omega swatch
					eVars._yourswatch.style.backgroundColor = complimentaryColor[0][0].HEX;

					// Set the HEX value in the input field
					eVars._hexColor.value = complimentaryColor[0][0].HEX;
	
					// Open the swatch selector
					Wu.DomUtil.removeClass(eVars._colorSuggestions, 'collapsed-color-suggestions');

					// Snap out of Palette Mode
					eVars._sliderToggle.click();
					eVars._paletteToggle.setAttribute('style', 'opacity: 0.2; cursor: normal');
	
					eCol.update.HEX(eVars._hexColor.value);
					eCol.update.inputFields('HEX');					
					
				}


			
		}
	
		// Toggle between RGB and HSV slider mode, yo			
		eVars._hsvToggle.onclick = function() {		
				var togclass = this.className;		
				if ( togclass == 'active-toggle' ) {
					this.className = '';
					eVars._rgbToggle.className = 'active-toggle';				
					Wu.DomUtil.get('rgb-slider-container').className = '';
					Wu.DomUtil.get('hsv-slider-container').className = 'die';	
				} else {
					this.className = 'active-toggle';
					eVars._rgbToggle.className = '';
					Wu.DomUtil.get('rgb-slider-container').className = 'die';
					Wu.DomUtil.get('hsv-slider-container').className = '';	
				}
			}
		eVars._rgbToggle.onclick = function() {
				var togclass = this.className;			
				if ( togclass == 'active-toggle' ) {
					this.className = '';
					eVars._hsvToggle.className = 'active-toggle';				
					Wu.DomUtil.get('rgb-slider-container').className = 'die';
					Wu.DomUtil.get('hsv-slider-container').className = '';	
				} else {
					this.className = 'active-toggle';
					eVars._hsvToggle.className = '';			
					Wu.DomUtil.get('rgb-slider-container').className = '';
					Wu.DomUtil.get('hsv-slider-container').className = 'die';	
				}
			}

		// Toggle between Swatch sample, sliders, and image sampler
		eVars._paletteToggle.onclick = function() {		

			if ( changingColors != 'all' ) {

				Wu.DomUtil.addClass(this, 'active-toggle');
				Wu.DomUtil.removeClass(eVars._sliderToggle, 'active-toggle');			
				Wu.DomUtil.removeClass(eVars._imageToggle, 'active-toggle');			
	
				Wu.DomUtil.get('s-watches').style.display = 'block';
	
				Wu.DomUtil.get('sliders').style.display = 'none';
				Wu.DomUtil.get('canvascontainer').style.display = 'none';		
				
			}

		}
		eVars._sliderToggle.onclick = function() {

			Wu.DomUtil.addClass(this, 'active-toggle');
			Wu.DomUtil.removeClass(eVars._paletteToggle, 'active-toggle');			
			Wu.DomUtil.removeClass(eVars._imageToggle, 'active-toggle');						

			Wu.DomUtil.get('sliders').style.display = 'block';
			
			Wu.DomUtil.get('s-watches').style.display = 'none';
			Wu.DomUtil.get('canvascontainer').style.display = 'none';


		}
		eVars._imageToggle.onclick = function() {

			Wu.DomUtil.addClass(this, 'active-toggle');
			Wu.DomUtil.removeClass(eVars._paletteToggle, 'active-toggle');	
			Wu.DomUtil.removeClass(eVars._sliderToggle, 'active-toggle');							


			Wu.DomUtil.get('canvascontainer').style.display = 'block';
			Wu.DomUtil.get('sliders').style.display = 'none';
			Wu.DomUtil.get('s-watches').style.display = 'none';


		}

		// Toggle DARK / LIGHT values
		// cxxxxx

		// MENU TOGGLER
		eVars._tickMenuLight.onclick = function() {

			colorTheme.cThemeDarkMenu = false;
			updateMenuLightDarkToggleButtons();
			
			var tempHEX = colorTheme.css[0].value;
			lightMenu(tempHEX);

			eCol.update.CSSstring();
			jcss.innerHTML = cssstring;
			
		}
		
		eVars._tickMenuDark.onclick = function() {
	
			colorTheme.cThemeDarkMenu = true;	
			updateMenuLightDarkToggleButtons();
	
			var tempHEX = colorTheme.css[0].value;
			
			darkMenu(tempHEX);

			eCol.update.CSSstring();
			jcss.innerHTML = cssstring;			

		}	
		
		
		
		
		
		// HEADER TOGGLER
		eVars._tickHeaderLight.onclick = function() {

			Wu.DomUtil.addClass(this, 'active-toggle');
			Wu.DomUtil.removeClass(eVars._tickHeaderDark, 'active-toggle');			

			colorTheme.css[15].value = 'rgba(255,255,255,0.92)';	
			colorTheme.css[16].value = '#333';	

			eCol.update.CSSstring();
			jcss.innerHTML = cssstring;
			
		}
		eVars._tickHeaderDark.onclick = function() {
	
			Wu.DomUtil.addClass(this, 'active-toggle');
			Wu.DomUtil.removeClass(eVars._tickHeaderLight, 'active-toggle');			
		
			colorTheme.css[15].value = 'rgba(0,0,0,0.8)';
			colorTheme.css[16].value = 'white';			
			
			eCol.update.CSSstring();
			jcss.innerHTML = cssstring;			

		}	
		
		// MAP BOXES TOGGLER
		eVars._tickMboxLight.onclick = function() {

			Wu.DomUtil.addClass(this, 'active-toggle');
			Wu.DomUtil.removeClass(eVars._tickMboxDark, 'active-toggle');			

			colorTheme.css[14].value = 'rgba(255, 255, 255, 0.7)';

			eCol.update.CSSstring();
			jcss.innerHTML = cssstring;
			
		}
		eVars._tickMboxDark.onclick = function() {
	
			Wu.DomUtil.addClass(this, 'active-toggle');
			Wu.DomUtil.removeClass(eVars._tickMboxLight, 'active-toggle');			
	
			colorTheme.css[14].value = 'rgba(0,0,0,0.7)';
			
			eCol.update.CSSstring();
			jcss.innerHTML = cssstring;			

		}					
			
	
	
		// If no color theme has been loaded, run the default one
		if ( cssstring == '' || !cssstring ) prethemes('dark1');
		
	},
	
	initSliders : function() {

		// Update slider 1 - H
		eCol.sliders.rangeSlider('range-slider-1', 360, function(value) {
	
		    eVars._hChannel.value = value;
	
		    var HSV = new eCol.HSVobject(0,0,0);
		    HSV = {'h': eVars._hChannel.value, 's': eVars._sChannel.value, 'v': eVars._vChannel.value };
	
		    // Update the input fields
		    eCol.update.HSV(HSV);
		    
		    // Update the MAIN swatch
		    eVars._yourswatch.style.backgroundColor = eVars._hexColor.value;
		    		    
		    // Update the swatch we have SELECTED
		    eCol.update.customColors();
		    
	
		});
	
		// Update slider 2 - S
		eCol.sliders.rangeSlider('range-slider-2', 100, function(value) {
	
		    eVars._sChannel.value = value;
	
		    var HSV = new eCol.HSVobject(0,0,0);
		    HSV = {'h': eVars._hChannel.value, 's': eVars._sChannel.value, 'v': eVars._vChannel.value };
	
		    // Update the input fields
		    eCol.update.HSV(HSV);
		    
		    // Update the MAIN swatch
		    eVars._yourswatch.style.backgroundColor = eVars._hexColor.value;	    
	
		    // Update the swatch we have SELECTED
		    eCol.update.customColors();
		});
	
		// Update slider 3 - V
		eCol.sliders.rangeSlider('range-slider-3', 100, function(value) {
	
		    eVars._vChannel.value = value;
	
		    var HSV = new eCol.HSVobject(0,0,0);
		    HSV = {'h': eVars._hChannel.value, 's': eVars._sChannel.value, 'v': eVars._vChannel.value };
	
		    // Update the input fields
		    eCol.update.HSV(HSV);
		    
		    // Update the MAIN swatch
		    eVars._yourswatch.style.backgroundColor = eVars._hexColor.value;	    
	
		    // Update the swatch we have SELECTED
		    eCol.update.customColors();
		});
	
		// Update slider R
		eCol.sliders.rangeSlider('range-slider-r', 255, function(value) {
	
		    eVars._rChannel.value = value;
	
	
		    var RGB = new eCol.RGBobject(0,0,0);
		    RGB = {'r': eVars._rChannel.value, 'g': eVars._gChannel.value, 'b': eVars._bChannel.value };
	
	
		    // Update the input fields
		    eCol.update.RGB(RGB);
	
		    // Update the MAIN swatch
		    eVars._yourswatch.style.backgroundColor = eVars._hexColor.value;	    
	
		    // Update the swatch we have SELECTED
		    eCol.update.customColors();
		});
	
		// Update slider G
		eCol.sliders.rangeSlider('range-slider-g', 255, function(value) {
	
		    eVars._gChannel.value = value;
	
		    var RGB = new eCol.RGBobject(0,0,0);
		    RGB = {'r': eVars._rChannel.value, 'g': eVars._gChannel.value, 'b': eVars._bChannel.value };
	
		    // Update the input fields
		    eCol.update.RGB(RGB);
	
		    // Update the MAIN swatch
		    eVars._yourswatch.style.backgroundColor = eVars._hexColor.value;	    
	
		    // Update the swatch we have SELECTED
		    eCol.update.customColors();
		});
	
		// Update slider B
		eCol.sliders.rangeSlider('range-slider-b', 255, function(value) {
	
		    eVars._bChannel.value = value;
	
		    var RGB = new eCol.RGBobject(0,0,0);
		    RGB = {'r': eVars._rChannel.value, 'g': eVars._gChannel.value, 'b': eVars._bChannel.value };
	
		    // Update the input fields
		    eCol.update.RGB(RGB);
	
		    // Update the MAIN swatch
		    eVars._yourswatch.style.backgroundColor = eVars._hexColor.value;	    
	
		    // Update the swatch we have SELECTED
		    eCol.update.customColors();
		});			
	},
	
	initComplimentaryColors : function() {
		
		var _hex = colorTheme.css[5].value;		
			
		eCol.update.HEX(_hex);
	
		// Make 4 complimentary colors
		eCol.update.makeComplimentary(_hex);
		
	},
	initMatchingColors : function() {

//		var _hex = eVars._hexColor.value;
		var _hex = colorTheme.css[5].value;	
			
		HSV = new Object();
		RGB = new Object();
	
		eCol.convert.HEX2RGB(_hex, RGB);
		eCol.convert.RGB2HSV(RGB, HSV);
		
		// Finds matching colors
		eCol.cMatch.domatch(HSV);
		
		
		// Update the MATCHING colors in cArray
		
		// Match Color 1 GRADER
		eCol.update.colorGrade(matchingColor, 0, matchingColor[0][0].HSV);
	
		// Match Color 2 GRADER
		eCol.update.colorGrade(matchingColor, 1, matchingColor[1][0].HSV);
			
		// Match Color 3 GRADER
		eCol.update.colorGrade(matchingColor, 2, matchingColor[2][0].HSV);
				
		// Match Color 4 GRADER	
		eCol.update.colorGrade(matchingColor, 3, matchingColor[3][0].HSV);
			
		// Match Color 5 GRADER
		eCol.update.colorGrade(matchingColor, 4, matchingColor[4][0].HSV);
		
	},
	initDarkColors : function() {
		
		// These are all STATIC COLORS
		eCol.makeDarkColors(0,215);
		eCol.makeDarkColors(1,196);
		eCol.makeDarkColors(2,319);
		eCol.makeDarkColors(3,354);
		eCol.makeDarkColors(4,22);
		
			
		// Make a neutral dark color!
		darkColor[5] = [];
		darkColor[5][0] = {};
		darkColor[5][0].HSV = {};
		darkColor[5][0].HSV.h = 100; 
		darkColor[5][0].HSV.s = 0; 
		darkColor[5][0].HSV.v = 10;
		darkColor[5][0].HEX = eCol.convert.HSV2HEX(100, 0, 10);	 
		darkColor[5][0].RGB = {};
		eCol.convert.HSV2RGB(darkColor[5][0].HSV, darkColor[5][0].RGB);
	
		darkColor[5][1] = {};	
		darkColor[5][1].HSV = {};
		darkColor[5][1].HSV.h = 100; 
		darkColor[5][1].HSV.s = 0; 
		darkColor[5][1].HSV.v = 20;
		darkColor[5][1].HEX = eCol.convert.HSV2HEX(100, 0, 20);	 
		darkColor[5][1].RGB = {};
		eCol.convert.HSV2RGB(darkColor[5][1].HSV, darkColor[5][1].RGB);
	
		darkColor[5][2] = {};	
		darkColor[5][2].HSV = {};
		darkColor[5][2].HSV.h = 100; 
		darkColor[5][2].HSV.s = 0; 
		darkColor[5][2].HSV.v = 70;
		darkColor[5][2].HEX = eCol.convert.HSV2HEX(100, 0, 70);	 
		darkColor[5][2].RGB = {};
		eCol.convert.HSV2RGB(darkColor[5][2].HSV, darkColor[5][2].RGB);
				
	},
	initLightColors : function() {
			
		eCol.makeLightColors(0,215);
		eCol.makeLightColors(1,196);
		eCol.makeLightColors(2,319);
		eCol.makeLightColors(3,76);
		eCol.makeLightColors(4,354);
		
		lightColor[5] = [];
		lightColor[5][0] = {};
		lightColor[5][0].HSV = {};
		lightColor[5][0].HSV.h = 22; 
		lightColor[5][0].HSV.s = 0; 
		lightColor[5][0].HSV.v = 70;
		lightColor[5][0].HEX = eCol.convert.HSV2HEX(22, 0, 70);	 
		lightColor[5][0].RGB = {};
		eCol.convert.HSV2RGB(lightColor[5][0].HSV, lightColor[5][0].RGB);
	
		lightColor[5][1] = {};	
		lightColor[5][1].HSV = {};
		lightColor[5][1].HSV.h = 22; 
		lightColor[5][1].HSV.s = 0; 
		lightColor[5][1].HSV.v = 93;
		lightColor[5][1].HEX = eCol.convert.HSV2HEX(22, 0, 93);	 
		lightColor[5][1].RGB = {};
		eCol.convert.HSV2RGB(lightColor[5][1].HSV, lightColor[5][1].RGB);
	
		lightColor[5][2] = {};	
		lightColor[5][2].HSV = {};
		lightColor[5][2].HSV.h = 22; 
		lightColor[5][2].HSV.s = 0; 
		lightColor[5][2].HSV.v = 25;
		lightColor[5][2].HEX = eCol.convert.HSV2HEX(22, 0, 25);	 
		lightColor[5][2].RGB = {};
		eCol.convert.HSV2RGB(lightColor[5][2].HSV, lightColor[5][2].RGB);
			
		
	},
	initBrightColors : function() {
		
		// Additional BRIGHT presets for links ... again, these are static colors
		brightColor[0] = [];
		brightColor[0][0] = {};		
		brightColor[0][0].HEX = '#FF00FF';
		brightColor[0][0].HSV = {};
		brightColor[0][0].HSV.h = 300;
		brightColor[0][0].HSV.s = 100;
		brightColor[0][0].HSV.v = 100;		
		brightColor[0][0].RGB = {};
		brightColor[0][0].RGB.r = 255;	
		brightColor[0][0].RGB.g = 0;	
		brightColor[0][0].RGB.b = 255;	
	
		
		brightColor[1] = [];
		brightColor[1][0] = {};	
		brightColor[1][0].HEX = '#FF00AA';
		brightColor[1][0].HSV = {};
		brightColor[1][0].HSV.h = 320;
		brightColor[1][0].HSV.s = 100;
		brightColor[1][0].HSV.v = 100;		
		brightColor[1][0].RGB = {};
		brightColor[1][0].RGB.r = 255;	
		brightColor[1][0].RGB.g = 0;	
		brightColor[1][0].RGB.b = 170;				
	
		brightColor[2] = [];
		brightColor[2][0] = {};	
		brightColor[2][0].HEX = '#FF0055';
		brightColor[2][0].HSV = {};
		brightColor[2][0].HSV.h = 340;
		brightColor[2][0].HSV.s = 100;
		brightColor[2][0].HSV.v = 100;		
		brightColor[2][0].RGB = {};
		brightColor[2][0].RGB.r = 255;	
		brightColor[2][0].RGB.g = 0;	
		brightColor[2][0].RGB.b = 85;				
			
		brightColor[3] = [];
		brightColor[3][0] = {};		
		brightColor[3][0].HEX = '#FF0000';
		brightColor[3][0].HSV = {};
		brightColor[3][0].HSV.h = 0;
		brightColor[3][0].HSV.s = 100;
		brightColor[3][0].HSV.v = 100;		
		brightColor[3][0].RGB = {};
		brightColor[3][0].RGB.r = 255;	
		brightColor[3][0].RGB.g = 0;	
		brightColor[3][0].RGB.b = 0;
		
		brightColor[4] = [];
		brightColor[4][0] = {};	
		brightColor[4][0].HEX = '#FF5400';
		brightColor[4][0].HSV = {};
		brightColor[4][0].HSV.h = 20;
		brightColor[4][0].HSV.s = 100;
		brightColor[4][0].HSV.v = 100;		
		brightColor[4][0].RGB = {};
		brightColor[4][0].RGB.r = 255;	
		brightColor[4][0].RGB.g = 84;	
		brightColor[4][0].RGB.b = 0;
		
		brightColor[5] = [];
		brightColor[5][0] = {};	
		brightColor[5][0].HEX = '#FF9400';
		brightColor[5][0].HSV = {};
		brightColor[5][0].HSV.h = 35;
		brightColor[5][0].HSV.s = 100;
		brightColor[5][0].HSV.v = 100;		
		brightColor[5][0].RGB = {};
		brightColor[5][0].RGB.r = 255;	
		brightColor[5][0].RGB.g = 148;	
		brightColor[5][0].RGB.b = 0;	
	
		brightColor[6] = [];
		brightColor[6][0] = {};	
		brightColor[6][0].HEX = '#FFD400';
		brightColor[6][0].HSV = {};
		brightColor[6][0].HSV.h = 50;
		brightColor[6][0].HSV.s = 100;
		brightColor[6][0].HSV.v = 100;		
		brightColor[6][0].RGB = {};
		brightColor[6][0].RGB.r = 255;	
		brightColor[6][0].RGB.g = 212;	
		brightColor[6][0].RGB.b = 0;	
		
		brightColor[7] = [];
		brightColor[7][0] = {};	
		brightColor[7][0].HEX = '#FFFF00';
		brightColor[7][0].HSV = {};
		brightColor[7][0].HSV.h = 60;
		brightColor[7][0].HSV.s = 100;
		brightColor[7][0].HSV.v = 100;		
		brightColor[7][0].RGB = {};
		brightColor[7][0].RGB.r = 255;	
		brightColor[7][0].RGB.g = 255;	
		brightColor[7][0].RGB.b = 0;
	
		brightColor[8] = [];
		brightColor[8][0] = {};	
		brightColor[8][0].HEX = '#00FFD4';
		brightColor[8][0].HSV = {};
		brightColor[8][0].HSV.h = 170;
		brightColor[8][0].HSV.s = 100;
		brightColor[8][0].HSV.v = 100;		
		brightColor[8][0].RGB = {};
		brightColor[8][0].RGB.r = 0;	
		brightColor[8][0].RGB.g = 255;	
		brightColor[8][0].RGB.b = 212;	
	
		brightColor[9] = [];
		brightColor[9][0] = {};	
		brightColor[9][0].HEX = '#00FFFF';
		brightColor[9][0].HSV = {};
		brightColor[9][0].HSV.h = 180;
		brightColor[9][0].HSV.s = 100;
		brightColor[9][0].HSV.v = 100;		
		brightColor[9][0].RGB = {};
		brightColor[9][0].RGB.r = 0;	
		brightColor[9][0].RGB.g = 255;	
		brightColor[9][0].RGB.b = 255;				
	
		brightColor[10] = [];
		brightColor[10][0] = {};	
		brightColor[10][0].HEX = '#54FF00';
		brightColor[10][0].HSV = {};
		brightColor[10][0].HSV.h = 100;
		brightColor[10][0].HSV.s = 100;
		brightColor[10][0].HSV.v = 100;		
		brightColor[10][0].RGB = {};
		brightColor[10][0].RGB.r = 85;	
		brightColor[10][0].RGB.g = 255;	
		brightColor[10][0].RGB.b = 0;
				
	}
}
	
	function initInputFields() {

		// HEX
		eVars._hexColor = Wu.DomUtil.get('hexColor');
	
		// RGB
		eVars._rChannel = Wu.DomUtil.get('rChannel');
		eVars._gChannel = Wu.DomUtil.get('gChannel');
		eVars._bChannel = Wu.DomUtil.get('bChannel');
		
		// HSV
		eVars._hChannel = Wu.DomUtil.get('hChannel');
		eVars._sChannel = Wu.DomUtil.get('sChannel');
		eVars._vChannel = Wu.DomUtil.get('vChannel');


		// CLICK TRIGGERS
				
		eVars._hexColor.onblur = function() {
			eCol.update.HEX(eVars._hexColor.value);
			eCol.update.inputFields('HEX');
		}
	
		eVars._rChannel.onblur = function() {
			eCol.update.RGB(RGB);
			eCol.update.inputFields('RGB');
		}
	
		eVars._gChannel.onblur = function() {
			eCol.update.RGB(RGB);
			eCol.update.inputFields('RGB');
		}
	
		eVars._bChannel.onblur = function() {
			eCol.update.RGB(RGB);
			eCol.update.inputFields('RGB');
		}
	
		eVars._hChannel.onblur = function() {
			eCol.update.HSV(HSV);
			eCol.update.inputFields('HSV');
		}
	
		eVars._sChannel.onblur = function() {
			eCol.update.HSV(HSV);
			eCol.update.inputFields('HSV');
		}
		
		eVars._vChannel.onblur = function() {
			eCol.update.HSV(HSV);
			eCol.update.inputFields('HSV');
		}	
		
	};
	
	// These are the template swatches...
	function updateTempSwatches() {
	
	// CHANGING COLORS
	// CHANGING COLORS
	// CHANGING COLORS
			
	// Complimentary Colors
	tempCSS.complimentary = [];
	tempCSS.complimentary[0] = '#complimentary_swatch_0 { background-color: ' + complimentaryColor[0][0].HEX + ' !important }';
	tempCSS.complimentary[1] = '#complimentary_swatch_1 { background-color: ' + complimentaryColor[1][0].HEX + ' !important }';
	tempCSS.complimentary[2] = '#complimentary_swatch_2 { background-color: ' + complimentaryColor[2][0].HEX + ' !important }';
	tempCSS.complimentary[3] = '#complimentary_swatch_3 { background-color: ' + complimentaryColor[3][0].HEX + ' !important }';

	// Complimentary Colors
	tempCSS.matching = [];
	tempCSS.matching[0] = '#matching_swatch_0 { background-color: ' + matchingColor[0][0].HEX + ' !important }';
	tempCSS.matching[1] = '#matching_swatch_1 { background-color: ' + matchingColor[1][0].HEX + ' !important }';
	tempCSS.matching[2] = '#matching_swatch_2 { background-color: ' + matchingColor[2][0].HEX + ' !important }';
	tempCSS.matching[3] = '#matching_swatch_3 { background-color: ' + matchingColor[3][0].HEX + ' !important }';
	tempCSS.matching[4] = '#matching_swatch_4 { background-color: ' + matchingColor[4][0].HEX + ' !important }';

	
	
	// STATIC COLORS	
	// STATIC COLORS	
	// STATIC COLORS	
	
	// Dark Colors
	tempCSS.dark = [];
	tempCSS.dark[0] = '#dark_swatch_0 { background-color: ' + darkColor[0][0].HEX + ' !important }';
	tempCSS.dark[1] = '#dark_swatch_1 { background-color: ' + darkColor[1][0].HEX + ' !important }';
	tempCSS.dark[2] = '#dark_swatch_2 { background-color: ' + darkColor[2][0].HEX + ' !important }';
	tempCSS.dark[3] = '#dark_swatch_3 { background-color: ' + darkColor[3][0].HEX + ' !important }';
	tempCSS.dark[4] = '#dark_swatch_4 { background-color: ' + darkColor[4][0].HEX + ' !important }';
	tempCSS.dark[5] = '#dark_swatch_5 { background-color: ' + darkColor[5][0].HEX + ' !important }';

	// Light Colors
	tempCSS.light = [];
	tempCSS.light[0] = '#light_swatch_0 { background-color: ' + lightColor[0][0].HEX + ' !important }';
	tempCSS.light[1] = '#light_swatch_1 { background-color: ' + lightColor[1][0].HEX + ' !important }';
	tempCSS.light[2] = '#light_swatch_2 { background-color: ' + lightColor[2][0].HEX + ' !important }';
	tempCSS.light[3] = '#light_swatch_3 { background-color: ' + lightColor[3][0].HEX + ' !important }';
	tempCSS.light[4] = '#light_swatch_4 { background-color: ' + lightColor[4][0].HEX + ' !important }';
	tempCSS.light[5] = '#light_swatch_5 { background-color: ' + lightColor[5][0].HEX + ' !important }';
	
	// Bright Colors
	tempCSS.bright = [];
	tempCSS.bright[0] = '#bright_swatch_0 { background-color: ' + brightColor[0][0].HEX + ' !important }';
	tempCSS.bright[1] = '#bright_swatch_1 { background-color: ' + brightColor[1][0].HEX + ' !important }';
	tempCSS.bright[2] = '#bright_swatch_2 { background-color: ' + brightColor[2][0].HEX + ' !important }';
	tempCSS.bright[3] = '#bright_swatch_3 { background-color: ' + brightColor[3][0].HEX + ' !important }';
	tempCSS.bright[4] = '#bright_swatch_4 { background-color: ' + brightColor[4][0].HEX + ' !important }';
	tempCSS.bright[5] = '#bright_swatch_5 { background-color: ' + brightColor[5][0].HEX + ' !important }';
	tempCSS.bright[6] = '#bright_swatch_6 { background-color: ' + brightColor[6][0].HEX + ' !important }';
	tempCSS.bright[7] = '#bright_swatch_7 { background-color: ' + brightColor[7][0].HEX + ' !important }';
	tempCSS.bright[8] = '#bright_swatch_8 { background-color: ' + brightColor[8][0].HEX + ' !important }';
	tempCSS.bright[9] = '#bright_swatch_9 { background-color: ' + brightColor[9][0].HEX + ' !important }';
	tempCSS.bright[10] = '#bright_swatch_10 { background-color: ' + brightColor[10][0].HEX + ' !important }';	
	
	
	var tempCSSstring = '';
	tempCSSstring += tempCSS.dark.join(' ');
	tempCSSstring += tempCSS.light.join(' ');
	tempCSSstring += tempCSS.complimentary.join(' ');
	tempCSSstring += tempCSS.matching.join(' ');
	tempCSSstring += tempCSS.bright.join(' ');
	
	
	tempjcss.innerHTML = tempCSSstring;
}
	
	// *****************************************



	
	// *****************************************	
	
	// PASS COLORS WHEN CLICKING ON THE SWATCHES
	// PASS COLORS WHEN CLICKING ON THE SWATCHES
	// PASS COLORS WHEN CLICKING ON THE SWATCHES

	// *****************************************
	
	function passcolor(whatArray, arrn1) {

		if ( whatArray == 'light') colorTheme.cThemeDarkMenu = false;
		if ( whatArray == 'dark') colorTheme.cThemeDarkMenu = true;

		updateMenuLightDarkToggleButtons();

				
		// Changing the Menu Base Color
		if ( changingColors == 1 ) {

			// Changing the background color to LIGHT colors
			if ( whatArray == 'light' ) {	
			
				lightMenu(lightColor[arrn1][0].HEX);			

				// Update the HEX value in the HEX VALUE INPUT FIELD				
				eVars._hexColor.value = lightColor[arrn1][0].HEX;
			
			}		
		
			// Changing the background color to DARK colors			
			if ( whatArray == 'dark' ) {

				darkMenu(darkColor[arrn1][0].HEX);

				// Update the HEX value in the HEX VALUE INPUT FIELD
				eVars._hexColor.value = darkColor[arrn1][0].HEX;
			} 
			
		} 
		
		// Changing the Layer INACTIVE color
		if ( changingColors == 2 ) {		
		
			// Changing to a COMPLIMENTARY color
			if ( whatArray == 'complimentary' ) {		
				colorTheme.css[5].value = complimentaryColor[arrn1][0].HEX;
				colorTheme.css[6].value = complimentaryColor[arrn1][3].HEX;	
				colorTheme.css[7].value = complimentaryColor[arrn1][4].HEX;
				
				// Update the HEX value in the HEX VALUE INPUT FIELD				
				eVars._hexColor.value = complimentaryColor[arrn1][0].HEX;
			}

			// Canging to a MATCHING color
			if ( whatArray == 'matching' ) {
				colorTheme.css[5].value = matchingColor[arrn1][0].HEX;
				colorTheme.css[6].value = matchingColor[arrn1][2].HEX;	
				colorTheme.css[7].value = matchingColor[arrn1][4].HEX;

				// Update the HEX value in the HEX VALUE INPUT FIELD
				eVars._hexColor.value = matchingColor[arrn1][0].HEX;								
			}

		}

		// Changing the Layer ACTIVE color
		if ( changingColors == 3 ) {		


			// Changing to a COMPLIMENTARY color
			if ( whatArray == 'complimentary' ) {
				colorTheme.css[8].value = complimentaryColor[arrn1][0].HEX;
				colorTheme.css[9].value = complimentaryColor[arrn1][4].HEX;
				
				// Update the HEX value in the HEX VALUE INPUT FIELD				
				eVars._hexColor.value = complimentaryColor[arrn1][0].HEX;								
								
			}

			// Canging to a MATCHING color
			if ( whatArray == 'matching' ) {
				colorTheme.css[8].value = matchingColor[arrn1][0].HEX;
				colorTheme.css[9].value = matchingColor[arrn1][4].HEX;
				
				// Update the HEX value in the HEX VALUE INPUT FIELD				
				eVars._hexColor.value = matchingColor[arrn1][0].HEX;
							
			}
		}
				
		// Changing the LINK color
		if ( changingColors == 4 ) {		

			// To a BRIGHT color
			if ( whatArray == 'bright' ) {
				colorTheme.css[4].value = brightColor[arrn1][0].HEX;
				
				// Update the HEX value in the HEX VALUE INPUT FIELD
				eVars._hexColor.value = brightColor[arrn1][0].HEX;
			}
		}
		

		// Update the input fields, and the sliders...
		eCol.update.inputFields('HEX');

		// Set background color of MAIN swatch
		eVars._yourswatch.style.backgroundColor = eVars._hexColor.value;

		eCol.update.CSSstring();			
		jcss.innerHTML = cssstring;						

}
	
	// *****************************************

	
	
	
	// *****************************************	
	
	// 		DARK AND LIGHT MENU STYLERS
	// 		DARK AND LIGHT MENU STYLERS
	// 		DARK AND LIGHT MENU STYLERS

	// *****************************************	
		
	// Creates Styling for Dark Menu Options	
	function darkMenu(tempHEX) {

	var RGB = new Object;
	var HSV = new Object;			
	eCol.convert.HEX2RGB(tempHEX, RGB);
	eCol.convert.RGB2HSV(RGB, HSV);
	var h = HSV.h;
	
	var c1HEX = eCol.convert.HSV2HEX(h, 50, 12);	 
	var c2HEX = eCol.convert.HSV2HEX(h, 30, 25);	 		
	var c3HEX = eCol.convert.HSV2HEX(h, 15, 70);	 
		
	colorTheme.css[0].value = c1HEX;
	colorTheme.css[1].value = c2HEX;
	colorTheme.css[2].value = c3HEX;

	colorTheme.css[11].value = '#666';			
	colorTheme.css[12].value = '#FFF';						// Text on ONLY Inactive Layer – Level 2
	colorTheme.css[13].value = '#FFFFFF';					// Text color on Main Menu Shade 2 (Plus the white buttons, but that's not right...)

	colorTheme.css[17].value = '';							// Background color Boxes on sidepane (New client box, etc) .. rgba(255, 255, 255, 0.15)
	colorTheme.css[18].value = 'white';						// Bacground color Buttons

	// Transparent Table Row Colors
	colorTheme.css[19].value = ''; 							// The darkest background color in file list
	colorTheme.css[20].value = ''; 							// The lightest background color in file list

	colorTheme.css[22].value = '';
	colorTheme.css[23].value = ''; 							// The gray text that goes in the Menu (on top of color theme menu, buttons, etc)
	colorTheme.css[24].value = '';							// Search Fields
	colorTheme.css[25].value = '';							// Map Controls Buttons – Color 
	colorTheme.css[26].value = ''; 							// Map Controls Buttons – Background
	colorTheme.css[27].value = '';							// Map Controls Buttons – Font Weight
	colorTheme.css[28].value = '';							// General ~ Turn 100 font-weight to 200 (looks too slim on white)


	colorTheme.css[32].value = 'white';						// Active List Items BG
	colorTheme.css[33].value = 'black';						// Active List Items Color

	colorTheme.css[34].value = 'rgba(0,0,0,0.4)';			// SEARCH FIELD
	
}; 					

	
	// Creates Styling for Light Menu Options
	function lightMenu(tempHEX) {
	
	var RGB = new Object;
	var HSV = new Object;			
	eCol.convert.HEX2RGB(tempHEX, RGB);
	eCol.convert.RGB2HSV(RGB, HSV);
	var h = HSV.h;
	
	// Make light colors
	var c1HEX = eCol.convert.HSV2HEX(h, 15, 80);	 
	var c2HEX = eCol.convert.HSV2HEX(h, 1, 99);	 		
	var c3HEX = eCol.convert.HSV2HEX(h, 30, 25);
	
	// Make see through light colors
	var RGB = {};
	eCol.convert.HEX2RGB(c1HEX, RGB);
	var rgba_50 = 'rgba(' + RGB.r + ',' + RGB.g + ',' + RGB.b + ',0.5)';
	var rgba_25 = 'rgba(' + RGB.r + ',' + RGB.g + ',' + RGB.b + ',0.25)';
	
	

	// MAKE COMPLIMENTARY COLOR
				
	var hstep = h + 150;
		
	if ( hstep > 360 ) {
		hstep = hstep - 360;
	}
	
	var _complimentary = eCol.convert.HSV2HEX(hstep, 20, 60);	
	
	
	
	



	colorTheme.css[0].value = c1HEX;
	colorTheme.css[1].value = c2HEX;
	colorTheme.css[2].value = c3HEX;

	colorTheme.css[11].value = '#FFFFFF';
	colorTheme.css[12].value = '#FFFFFF';					// Text on ONLY Inactive Layer – Level 2

	colorTheme.css[13].value = '#666';						// Text color on Main Menu Shade 2 (Plus the white buttons, but that's not right...)
	
	colorTheme.css[17].value = rgba_50;						// Bacground color Buttons			
	colorTheme.css[18].value = c1HEX;						// Background color Boxes on sidepane (New client box, etc)

	// Transparent Table Row Colors
	colorTheme.css[19].value = rgba_50; 					// The darkest background color in file list
	colorTheme.css[20].value = rgba_25; 					// The lightest background color in file list

	colorTheme.css[22].value = 'transparent';
	colorTheme.css[23].value = '#666'; 						// The gray text that goes in the Menu (on top of color theme menu, buttons, etc)
	colorTheme.css[24].value = 'white';						// Search Fields
	colorTheme.css[25].value = 'rgba(0, 0, 0, 0.5)';		// Map Controls Buttons – Color 
	colorTheme.css[26].value = 'rgba(0, 0, 0, 0.1)'; 		// Map Controls Buttons – Background
	colorTheme.css[27].value = '600';						// Map Controls Buttons – Font Weight
	colorTheme.css[28].value = '200';						// General ~ Turn 100 font-weight to 200 (looks too slim on white)


	//cxxxx 
	colorTheme.css[32].value = _complimentary;				// Active List Items BG
	colorTheme.css[33].value = 'white';						// Active List Items Color
	
	colorTheme.css[34].value = 'rgba(0,0,0,0.6)';			// SEARCH FIELD	

	
};					


	// *****************************************




	// Updates the Toggle between dark and light menu options
	function updateMenuLightDarkToggleButtons() {

	if ( !colorTheme.cThemeDarkMenu ) {
		Wu.DomUtil.addClass(eVars._tickMenuLight, 'active-toggle');
		Wu.DomUtil.removeClass(eVars._tickMenuDark, 'active-toggle');							
	} else {
		Wu.DomUtil.addClass(eVars._tickMenuDark, 'active-toggle');	
		Wu.DomUtil.removeClass(eVars._tickMenuLight, 'active-toggle');					
	}

};	


};L.Control.Description = L.Control.extend({
        
        options: {
                position : 'topleft' 
        },

        onAdd : function (map) {

                var className = 'leaflet-control-description',
                    container = L.DomUtil.create('div', className),
                    options = this.options;

                // add html
                container.innerHTML = ich.descriptionControl(); 

                // content is not ready yet, cause not added to map! 
                // this._content = Wu.DomUtil.get('layer-menu-inner-content');
                // console.log('%%%%%%%% onAdd %%%%%%%% _content:', this._content);
                // this.project = Wu.app._activeProject;
                // this.layers = {};
                // this.update();
                
				// Open Menu Button
                this._uncollapse = Wu.DomUtil.createId('div', 'uncollapse');
                Wu.DomUtil.addClass(this._uncollapse, 'leaflet-control open-uncollapse');
                this._uncollapse.innerHTML = 'Open Info Menu';

                return container;

        },
        
        addHooks : function () {
                Wu.DomEvent.on(this._bhattan2, 'click', this.closeInfo, this);
        },
        
        closeInfo : function () {
	      
	      this._content.parentNode.parentNode.style.width = '34px';
		  this._firstchildofmine = this._content.parentNode.parentNode.getElementsByTagName('div')[0];
		  this._content.parentNode.parentNode.insertBefore(this._uncollapse, this._firstchildofmine);
	      
 		  Wu.DomEvent.on(this._uncollapse, 'click', this.openInfo, this);

		  // Slide the LEGENDS
		  Wu.DomUtil.addClass(this._legendsContainer, 'legends-push-left');
		  this._legendsCollapser.style.left = this._legendsCollapser.offsetLeft - (Math.floor(287/2)) + 'px';

			var thus = this;	      
	      
			// Set class name
			setTimeout(function(){					
				thus._uncollapse.className = 'leaflet-control uncollapser-uncollapsed';
			}, 500);
	        
        },
        
        openInfo : function () {

			// Show Info box
	        this._content.parentNode.parentNode.style.width = '320px';					

			// Animate opener button
			this._uncollapse.className = 'leaflet-control uncollapse-killer';
			
			// Slide the LEGENDS
			Wu.DomUtil.removeClass(this._legendsContainer, 'legends-push-left');
			this._legendsCollapser.style.left = this._legendsCollapser.offsetLeft + (Math.floor(287/2)) + 'px';
					
			var thus = this;			
			// Set class name and remove from DOM
			setTimeout(function(){
			
				thus._content.parentNode.parentNode.removeChild(thus._uncollapse);
				thus._uncollapse.className = 'leaflet-control open-uncollapse';
			}, 500);						
	        
        },
        
        update : function (project) {
        
                this.initContainer();

                // project is ready only here, so init relevant vars
                // update is called from enableLayermenu toggle in MapPane

                // get vars
                this.project = project || Wu.app._activeProject;
                this._content = Wu.DomUtil.get('description-control-inner-content');
               
        },
        
        initContainer : function () {

				this._bhattan2 = Wu.DomUtil.get('bhattan2');
				
				// OBS!!! 
				// These Elements doesn NOT get picked up on load as the Legends come in AFTER the INFO pane
				
				this._legendsContainer = Wu.DomUtil.get('legends-control-inner-content');
				this._legendsCollapser = Wu.DomUtil.get('legends-collapser');

                // add hooks
                this.addHooks();

        },        

});


L.control.description = function (options) {
        return new L.Control.Description(options);
};;/*
██╗  ██╗███████╗ █████╗ ██████╗ ███████╗██████╗ 
██║  ██║██╔════╝██╔══██╗██╔══██╗██╔════╝██╔══██╗
███████║█████╗  ███████║██║  ██║█████╗  ██████╔╝
██╔══██║██╔══╝  ██╔══██║██║  ██║██╔══╝  ██╔══██╗
██║  ██║███████╗██║  ██║██████╔╝███████╗██║  ██║
╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═════╝ ╚══════╝╚═╝  ╚═╝
*/                                                
/* The header of the map - a "view" */
Wu.HeaderPane = Wu.Class.extend({

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
		this._container = Wu.app._headerPane = Wu.DomUtil.createId('div', 'header', Wu.app._mapContainer);
		this._logoWrap  = Wu.DomUtil.create('div', 'header-logo', this._container);
		this._logo 	= Wu.DomUtil.create('img', 'header-logo-img', this._logoWrap);
		this._title 	= Wu.DomUtil.create('div', 'header-title editable', this._container);
		this._subtitle 	= Wu.DomUtil.create('div', 'header-subtitle editable', this._container);
		this._resizer 	= Wu.DomUtil.createId('div', 'headerResizer', this._container);

		// settings
		this._title.setAttribute('readonly', 'readonly');
		this._subtitle.setAttribute('readonly', 'readonly');

		// set hooks
		this.addHooks();
		
	},

	addHooks : function () {

		this.addEditHooks();	// set edit hook hook in .Item, nice way to organize edit mode
	},

	addEditHooks : function () {

		// resizer
		this.enableResize();

		// enable edit on header sub/title
		Wu.DomEvent.on(this._title, 'dblclick', function (e) { 
			this._enableEdit(e, 'title'); 
		}, this); 
		Wu.DomEvent.on(this._subtitle, 'dblclick', function (e) { 
			this._enableEdit(e, 'subtitle'); 
		}, this); 
	},

	disableResize : function () {
		// resizer
		Wu.DomEvent.off(this._resizer, 'mousedown', this.resize, this);
		Wu.DomEvent.off(this._resizer, 'mouseup', this._resized, this);

		// set default cursor
		Wu.DomUtil.addClass(this._resizer, 'headerResizerDisabled');
	},

	enableResize : function () {
		// resizer
		Wu.DomEvent.on(this._resizer, 'mousedown', this.resize, this);
		Wu.DomEvent.on(this._resizer, 'mouseup', this._resized, this);

		// set ns cursor
		Wu.DomUtil.removeClass(this._resizer, 'headerResizerDisabled');
	},

	
	_enableEdit : function (e, which) {

		// rename div 
		var div   = e.target;
		var value = e.target.innerHTML;

		if (!which) return;
		if (which == 'title') 	 var input = ich.injectHeaderTitleInput({ value : value });
		if (which == 'subtitle') var input = ich.injectHeaderSubtitleInput({ value : value });
		
		// inject <input>
		div.innerHTML = input;

		// focus
		var target = div.firstChild;
		target.focus();
		target.selectionStart = target.selectionEnd;	// prevents text selection

		// save on blur or enter
		Wu.DomEvent.on( target,  'blur', this._editBlur, this );     // save folder title
		Wu.DomEvent.on( target,  'keydown', this._editKey, this );     // save folder title

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

	
	_setLeft : function (left) {
		this._container.style.left = left + 'px';
	},


	_update : function (project) {

		this._project = project;
		var header = project.header;
	       
		this._container.style.display = 'block';

		// update values
		this._logo.src = header.logo;
		this._title.innerHTML = header.title;
		this._subtitle.innerHTML = header.subtitle;

		// set height
		this._headerHeight = parseInt(header.height);
		this._container.style.height = this._headerHeight  + 'px';
		this._container.style.maxHeight = this._headerHeight  + 'px';        

	},

	reset : function () {
		this._container.style.display = 'none';
	},

	_resetView : function () {
	       // this._container.innerHTML = '';
	},

	resize : function () {
		// this._resizer.style.backgroundColor = 'rgba(103, 120, 163, 0.57)';
		var that = this;
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

		this._headerHeight = newHeight;
		
		// header height
		this._container.style.height = this._headerHeight  + 'px';
		this._container.style.maxHeight = this._headerHeight  + 'px';

		// map height
		var control = Wu.app._map._controlContainer;
		control.style.paddingTop = this._headerHeight + 'px';

	},

	_resized : function () {

		// reset
		this._resizer.style.backgroundColor = '';
		window.onmousemove = null;

		// save to db
		this.save();   

		// refresh map
		Wu.app._map.invalidateSize();
	},

	save : function () {

		// set current values to project
		this._project.header.height 	= this._headerHeight;
		this._project.header.title 	= this._title.innerHTML;
		this._project.header.subtitle 	= this._subtitle.innerHTML;
		this._project.header.logo 	= this._logo.src;     // todo?
								// + todo: css 
		// save to db
		this._save();
	},

	_save : function () {
		// save project to db
		this._project._update('header');
	},

	setProject : function (project) {
		// update header with project
		this._update(project);
	}
});;L.Control.Inspect = L.Control.extend({
        
        options: {
                position : 'bottomright' 
        },

        onAdd : function (map) {

                var className = 'leaflet-control-inspect ct14',
                    container = L.DomUtil.create('div', className),
                    options = this.options;

                // add html
                container.innerHTML = ich.inspectControl(); 

                // content is not ready yet, cause not added to map! 
                // this._content = Wu.DomUtil.get('layer-menu-inner-content');
                // console.log('%%%%%%%% onAdd %%%%%%%% _content:', this._content);
                // this.project = Wu.app._activeProject;
                // this.layers = {};
                // this.update();

                return container;

        },

        update : function (project) {
                console.log('inspect update!');
                return; // debug

                
                // project is ready only here, so init relevant vars
                // update is called from enableLayermenu toggle in MapPane

                // get vars
                this.project = project || Wu.app._activeProject;
                this._content = Wu.DomUtil.get('inspect-control-inner-content');                

                console.log('updating inspect Control, project, ', this.project);   // selected project

               
        }

});


L.control.inspect = function (options) {
        return new L.Control.Inspect(options);
};;
// Super Pølsing fra Jølle her

// Kjører denne som trigger når man går inn i et prosjekt. 
// Det ble litt kjedelig å srkive dadio() all the time, namean?


window.onload = function() {


	
	
// For Jorgo to Projects

// The Sliders Container
var _content_container = document.getElementsByTagName('content')[0];

// Find all the swipeable elements....
var _under_dogs = _content_container.getElementsByTagName('div');
for ( var a = 0; a<_under_dogs.length;a++) {
	if ( Wu.DomUtil.hasClass(_under_dogs[a], 'clients') ) 		{ _clients = _under_dogs[a] }
	if ( Wu.DomUtil.hasClass(_under_dogs[a], 'projects') ) 		{ _projects = _under_dogs[a] }
	if ( Wu.DomUtil.hasClass(_under_dogs[a], 'map') ) 			{ _map = _under_dogs[a] }
	if ( Wu.DomUtil.hasClass(_under_dogs[a], 'layers') )	 	{ _layers = _under_dogs[a] }
	if ( Wu.DomUtil.hasClass(_under_dogs[a], 'documents') ) 	{ _documents = _under_dogs[a] }
	if ( Wu.DomUtil.hasClass(_under_dogs[a], 'dataLibrary') ) 	{ _dataLibrary = _under_dogs[a] }		
	if ( Wu.DomUtil.hasClass(_under_dogs[a], 'users') )			{ _users = _under_dogs[a] }		
}


var menuslider = document.createElement('div');
	menuslider.id = 'menuslider';
	
	document.getElementsByTagName('menu')[0].appendChild(menuslider);
}

var _clients, _projects, _map, _layers, _documents, _dataLibrary, _users;	









// Swipe, yo

function swypeTo(_swypeTo) {

	var hheeiigghhtt = 70;

	if ( Wu.DomUtil.hasClass(_swypeTo, 'clients' ) ) {
		menuslider.style.top = '0px';
	}

	if ( Wu.DomUtil.hasClass(_swypeTo, 'projects' ) ) {
		menuslider.style.top = hheeiigghhtt * 1 + 'px';
	}

	if ( Wu.DomUtil.hasClass(_swypeTo, 'map' ) ) {
		menuslider.style.top = hheeiigghhtt * 2 + 'px';
	}

	if ( Wu.DomUtil.hasClass(_swypeTo, 'layers' ) ) {
		menuslider.style.top = hheeiigghhtt * 3 + 'px';
	}

	if ( Wu.DomUtil.hasClass(_swypeTo, 'documents' ) ) {
		menuslider.style.top = hheeiigghhtt * 4 + 'px';
	}

	if ( Wu.DomUtil.hasClass(_swypeTo, 'dataLibrary' ) ) {
		menuslider.style.top = hheeiigghhtt * 5 + 'px';
	}

	if ( Wu.DomUtil.hasClass(_swypeTo, 'users' ) ) {
		menuslider.style.top = hheeiigghhtt * 6 + 'px';
	}
	
	



	// Find out what to Swipe from, yo
	// The Sliders Container
	var _content_container = document.getElementsByTagName('content')[0];
	
	var swipethis, swfrom, swto;
	
	// Find all the swipeable elements....
	var _under_dogs = _content_container.getElementsByTagName('div');
	
	// Find the active one by detecting the 'show' class name
	for ( var a = 0; a<_under_dogs.length;a++) {

		if ( _under_dogs[a] == _swypeTo ) {
			swfrom = a;
		}		
				
		if ( Wu.DomUtil.hasClass(_under_dogs[a], 'show') ) { 
			swto = a;
			swipethis = _under_dogs[a];
		}		
	}

	// Check if we're swiping up or down
	if ( swfrom > swto ) {
		swipeitdown();		
	} else {
		swipeitup();
	}


	// Swipe upwards
	function swipeitup() {
		// Swipe this OUT
		Wu.DomUtil.addClass(swipethis, 'swipe_out_up');
		
		// Remove classes from the swiped out element
		setTimeout(function(){
			Wu.DomUtil.removeClass(swipethis, 'swipe_out_up');
			Wu.DomUtil.removeClass(swipethis, 'show');		
		}, 300);								
			
		
		// Swipe this IN
		Wu.DomUtil.addClass(_swypeTo, 'show swipe_in_up');
		setTimeout(function(){
			Wu.DomUtil.removeClass(_swypeTo, 'swipe_in_up');	
		}, 300);
	}


	// Swipe downwards
	function swipeitdown() {
		// Swipe this OUT
		Wu.DomUtil.addClass(swipethis, 'swipe_out');
		
		// Remove classes from the swiped out element
		setTimeout(function(){
			Wu.DomUtil.removeClass(swipethis, 'swipe_out');
			Wu.DomUtil.removeClass(swipethis, 'show');		
		}, 300);								
			
		
		// Swipe this IN
		Wu.DomUtil.addClass(_swypeTo, 'show swipe_in');	
		setTimeout(function(){
			Wu.DomUtil.removeClass(_swypeTo, 'swipe_in');	
		}, 300);
	}
}







// Jorgen's pølsekodein

// For height transition purposes ~ takes the height of the inner wrapper and sets it for the outer wrapper

// Depends on the following CSS
// height: 0;
// overflow: hidden;	
// + transitions

function transheight(wrapelm, plussno, add) {
	if ( add ) {
		var hh = wrapelm.getElementsByTagName('div')[0].offsetHeight + plussno;
		wrapelm.style.height = hh + 'px';
	} else {
		wrapelm.style.height = '0px';					
	}
}
			






// PROJECTS: Toggle between list and box view 



// Go to LIST VIEW
var edit_projects_sort_by_right = document.getElementById("editor-projects-sort-by-right");

edit_projects_sort_by_right.onclick = function () {

	var _iitems = document.getElementById("editor-projects-container");
	var _zitems = _iitems.getElementsByTagName("div");	
		
	// Go through all DIV's in .editor-projects-container
	for ( var counter = 0; counter<_zitems.length;counter++) {		

		// Match with classname
		if ( _zitems[counter].className == 'editor-projects-item' || _zitems[counter].className == 'editor-projects-item active' ) {

			// Swipe out all DIV's with .editor-projects-item as class name
			_zitems[counter].className = "editor-projects-item swipe_left";
		}
	}
	
	
	
	setTimeout(function(){
	
		
	
		// Set back class name
		for ( var cntr = 0; cntr<_zitems.length;cntr++) {

			if ( _zitems[cntr].className == 'editor-projects-item swipe_left' ) {	
				_zitems[cntr].className = "editor-projects-item";
			}

			if ( _zitems[cntr].className == 'project-edit-button box' ) {	
				_zitems[cntr].className = "project-edit-button list";
			}


		}	
	
		var _list = document.getElementById("editor-projects-container");
			_list.className = "list_view";		
	
	}, 150);		
	
	
	
}


// Go to BOX VIEW
var edit_projects_sort_by_left = document.getElementById("editor-projects-sort-by-left");

edit_projects_sort_by_left.onclick = function() {

	var _iitems = document.getElementById("editor-projects-container");
	var _zitems = _iitems.getElementsByTagName("div");

	// Go through all DIV's in .editor-projects-container
	for ( var counter = 0; counter<_zitems.length;counter++) {		

		// Match with classname
		if ( _zitems[counter].className == 'editor-projects-item' || _zitems[counter].className == 'editor-projects-item active' ) {

			// Swipe out all DIV's with .editor-projects-item as class name
			_zitems[counter].className = "editor-projects-item swipe_left";
		}
	}


	setTimeout(function(){
	
		// Set back class name
		for ( var cntr = 0; cntr<_zitems.length;cntr++) {

			if ( _zitems[cntr].className == 'editor-projects-item swipe_left' ) {	
				_zitems[cntr].className = "editor-projects-item";
			}
			
			if ( _zitems[cntr].className == 'project-edit-button list' ) {	
				_zitems[cntr].className = "project-edit-button box";
			}
			
		}	
	
		var _list = document.getElementById("editor-projects-container");
			_list.className = "";		
	
	}, 150);	
	
	

}
		
		

// MAP: Smooth drop down yo

var coordinate_state = false;

var editor_map_initpos_coordinates = document.getElementById("editor-map-initpos-coordinates");

var editor_map_initpos_more = document.getElementById("editor-map-initpos-more");
	editor_map_initpos_more.onclick = function() {

	if ( !coordinate_state ) {
		coordinate_state = true;
		
		transheight(editor_map_initpos_coordinates, 15, true);
							
		this.className = "rotate180";

	} else {
		coordinate_state = false;
		
		transheight(editor_map_initpos_coordinates, 0, false);

		this.className = "";
	}
}

var bounds_state = false;

var editor_map_bounds_coordinates = document.getElementById("editor-map-bounds-coordinates");

var editor_map_bounds_more = document.getElementById("editor-map-bounds-more");
	editor_map_bounds_more.onclick = function() {

	if ( !bounds_state ) {
		bounds_state = true;
		
		transheight(editor_map_bounds_coordinates, 15, true);					
		
		this.className = "rotate180";

	} else {
		bounds_state = false;
		
		transheight(editor_map_bounds_coordinates, 0, false);
							
		this.className = "";
	}
}
	









function jorgo_edit_client(edit_id) {

	// Get the ID of the button we've just clicked
	var button_id = 'editor-client-edit-toggle-' + edit_id;
	var this_button = document.getElementById(button_id);


	// Get the ID of the CANCEL button we've just clicked
	var cancel_button_id = 'editor-client-cancel-' + edit_id;
	var this_cancel_button = document.getElementById(cancel_button_id);
	
	// Pølse it up ~ click the usynlig button, yo							
	this_cancel_button.onclick = function() {
		this_button.click();
	}

	// Get the ID of of the container we're going to scale
	var get_this_id = 'editor-client-edit-wrapper-' + edit_id;
	var scale_this_container = document.getElementById(get_this_id);
	
	// Get all the classes as an array
	var has_class = scale_this_container.className;
	var classarray = has_class.split(" ");
	
	// Fjerne siste ledd i array om det er to
	if ( classarray.length == 2 ) {
		classarray.splice(1, 1);
		
		this_button.style.opacity = '1';

	// Ellers legge til klasse at den er åpen
	} else {
		classarray[1] = 'client-editor-open';

		this_button.style.opacity = '0';
	}
					
	// Slå sammen klasse arrayen
	var newarray = classarray.join(" ");

	// Sette de nye klassenavnene
	scale_this_container.className = newarray;
		
}


function polse() {

		var alldivvs = document.getElementById('app').getElementsByTagName('div');
		
		for (var aa=0; aa<alldivvs.length;aa++) {
			
			if ( alldivvs[aa].className == 'q-editor-container' ) {
				alldivvs[aa].style.width = '100px';
				break;
			}		
		}
		document.getElementById('map').style.left = '100px';
		document.getElementById('map').style.width = document.body.offsetWidth - 100 + 'px';	
		document.getElementById('header').style.left = '100px';
	

		}

function unpolse() {
		var alldivvs = document.getElementById('app').getElementsByTagName('div');
		
		for (var aa=0; aa<alldivvs.length;aa++) {
			
			if ( alldivvs[aa].className == 'q-editor-container' ) {
				alldivvs[aa].style.width = '400px';
				break;
			}		
		}
		document.getElementById('map').style.left = '400px';
		document.getElementById('map').style.width = document.body.offsetWidth - 400 + 'px';	
		document.getElementById('header').style.left = '400px';

};/* 
██╗      █████╗ ██╗   ██╗███████╗██████╗ ███╗   ███╗███████╗███╗   ██╗██╗   ██╗
██║     ██╔══██╗╚██╗ ██╔╝██╔════╝██╔══██╗████╗ ████║██╔════╝████╗  ██║██║   ██║
██║     ███████║ ╚████╔╝ █████╗  ██████╔╝██╔████╔██║█████╗  ██╔██╗ ██║██║   ██║
██║     ██╔══██║  ╚██╔╝  ██╔══╝  ██╔══██╗██║╚██╔╝██║██╔══╝  ██║╚██╗██║██║   ██║
███████╗██║  ██║   ██║   ███████╗██║  ██║██║ ╚═╝ ██║███████╗██║ ╚████║╚██████╔╝
╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝╚═╝  ╚═══╝ ╚═════╝ 
Layermenu control for Leaflet 
*/
L.Control.Layermenu = L.Control.extend({

	options: {
		position : 'bottomright' 
	},

	onAdd : function (map) {

		var className = 'leaflet-control-layermenu',
		    container = L.DomUtil.create('div', className),
		    options = this.options;

		// add html
		container.innerHTML = ich.layerMenuFrame(); 

		this._cunt = container;

		// add some divs
		this.initContainer();

		// nb! content is not ready yet, cause not added to map! 
		return container;

	},

	// added by jorgo
	initContainer : function () {		// TODO: move legends, other controls to respective files

		// Create the header    
		this._layerMenuHeader = Wu.DomUtil.createId('div', 'layer-menu-header');
		Wu.DomUtil.addClass(this._layerMenuHeader, 'menucollapser ct15 ct16');
		this._layerMenuHeader.innerHTML = 'layers';                                     

		// Create the collapse button
		this._bhattan1 = Wu.DomUtil.createId('div', 'bhattan1');
		
		Wu.DomUtil.addClass(this._bhattan1, 'dropdown-button rotate270 ct31');
		this._layerMenuHeader.appendChild(this._bhattan1);

		// Insert Header at the top
		this._cunt.insertBefore(this._layerMenuHeader, this._cunt.getElementsByTagName('div')[0]);

		// Create the 'uncollapse' button ... will put in DOM l8r
		this._openLayers = Wu.DomUtil.createId('div', 'open-layers');
		this._openLayers.innerHTML = 'Open Layer Menu';
		Wu.DomUtil.addClass(this._openLayers, 'leaflet-control open-open-layers');

		// Pick up Elements dealing with the Legends
		this._legendsContainer = Wu.DomUtil.get('legends-control-inner-content');
		this._legendsCollapser = Wu.DomUtil.get('legends-collapser');

		// Register Click events                                
		Wu.DomEvent.on(this._bhattan1, 'click', this.closeLayers, this);
		Wu.DomEvent.on(this._openLayers, 'click', this.openLayers, this);     

	},


	// By Evil        
	closeLayers : function () {		// TODO: move legends, other controls to respective files

		// Collapse Wrapper
		this._container.parentNode.style.width = '0px';

		// Insert opener
		this._container.parentNode.appendChild(this._openLayers);
		
		// Slide the LEGENDS			
		Wu.DomUtil.addClass(this._legendsContainer, 'legends-push-right');
		this._legendsCollapser.style.left = this._legendsCollapser.offsetLeft + (Math.floor(237/2)) + 'px';
		

		// Measure, plus Long & Lat (.leaflet-top.leaflet-right)                
		Wu.app.MapPane._container.children[1].children[1].style.right = '6px';
		
		
		var that = this;
		
		// Change class name of open layers button
		setTimeout(function(){					
			that._openLayers.className = 'leaflet-control layer-opener-opened';					
		}, 500);			
			
	},

	// By Evil
	openLayers : function () {		// TODO: move legends, other controls to respective files

		// Open Wrapper
		this._container.parentNode.style.width = '220px';

		// Close the closer :P
		this._openLayers.className = 'leaflet-control layer-opener-opened close-layer-opener';
		
		// Slide the LEGENDS
		Wu.DomUtil.removeClass(this._legendsContainer, 'legends-push-right');
		this._legendsCollapser.style.left = this._legendsCollapser.offsetLeft - (Math.floor(237/2)) + 'px';
		
		// Measure, plus Long & Lat (.leaflet-top.leaflet-right)                
		Wu.app.MapPane._container.children[1].children[1].style.right = '232px';                  
		
		var that = this;
		
		// Set correct classname and remove open layer menu button from DOM	
		setTimeout(function(){					
			that._container.parentNode.removeChild(that._openLayers);
			that._openLayers.className = 'leaflet-control open-open-layers';												
		}, 500);
	},
		
	enableLayer : function (layer) {

		// add layer to map
		layer.layer.add();
		layer.on = true;

		// add active class
		Wu.DomUtil.addClass(layer.el, 'layer-active ct8');
	},


	disableLayer : function (layer) {

		// remove layer from map
		layer.layer.remove();
		layer.on = false;

		// remove active class
		Wu.DomUtil.removeClass(layer.el, 'layer-active');
		Wu.DomUtil.removeClass(layer.el, 'ct8');
	},

	toggleLayer : function (e) {
		
		console.log('toggleLayuer!', e);

		var fuuid = e.target.getAttribute('fuuid');
		var layer = this.layers[fuuid];

		// toggle
		if (layer.on) {
			this.disableLayer(layer);
		} else {
			this.enableLayer(layer);
		}       
	
	},

	remove : function (fuuid) {

		// get div
		var l = this.layers[fuuid];
		var node = l.el;
		
		// remove from dom
		node.parentNode.removeChild(node);

		// delete object
		delete this.layers[fuuid];

	},


	add : function (file) {

		var l = this.layers[file.uuid] = {};
		l.file = file ; // file

		// if layer already exists, just enable it (show it)
		if (l.layer) return this.enableLayer(l.layer);

		// create layer
		l.layer = new Wu.GeojsonLayer(file);

		// append to menu
		var wrap = Wu.DomUtil.create('div', 'layer-menu-item-wrap ct5');
		wrap.innerHTML = ich.layerMenuItem(file);
		l.el = wrap;
		this._content.appendChild(wrap);

		// add hooks
		Wu.DomEvent.on(wrap, 'mousedown', this.toggleLayer, this);

	},


	addFromFile : function (file) {

		// get file 
		//this.add(file);

		var l = this.layers[file.uuid] = {};
		l.file = file ; // file

		// if layer already exists, just enable it (show it)
		if (l.layer) {
			this.enableLayer(l.layer);
			return;
		}

		// create layer
		l.layer = new Wu.GeojsonLayer(file);

		// append to menu
		var wrap = Wu.DomUtil.create('div', 'layer-menu-item-wrap ct5');
		wrap.innerHTML = ich.layerMenuItem(file);
		l.el = wrap;
		this._content.appendChild(wrap);

		// add hooks
		Wu.DomEvent.on(wrap, 'mousedown', this.toggleLayer, this);

		// save
		// add to project layermenu object for saving
		// if (!this.layermenu) {
		//         this.layermenu = {};
		// }

		// this.layermenu[file.uuid] = {
		//         fuuid : file.uuid,
		//         title : file.name,
		//         pos : 1,
		//         layerType : 'datalibrary'
		// };

		// var lm = {
		//         fuuid : file.uuid,
		//         title : file.name,
		//         pos : 1,
		//         layerType : 'datalibrary'
		// }

		// this.project.layermenu.push(lm);

		// console.log('=====> pushing to layermenu', lm);

		// // save to server
		// this.save();

	},

	addMenuFolder : function (lm) { 

		var l = this.layers[lm.fuuid] = {};
		l.file = false;
		l.layer = false;

		// add wrapper to layermenu
		var wrap = Wu.DomUtil.create('div', 'layer-menu-item-wrap menufolder ct5', this._content);
		Wu.DomUtil.addClass(wrap, 'level-' + lm.pos);
		
		// up button
		var up = Wu.DomUtil.create('div', 'layer-menufolder-up', wrap);
		up.setAttribute('fuuid', lm.fuuid);
		up.innerHTML = '>';
		Wu.DomEvent.on(up, 'click', this.upFolder, this);

		// down button
		var down = Wu.DomUtil.create('div', 'layer-menufolder-down', wrap);
		down.setAttribute('fuuid', lm.fuuid);
		down.innerHTML = '<';
		Wu.DomEvent.on(down, 'click', this.downFolder, this);

		// delete button
		var del = Wu.DomUtil.create('div', 'layer-menufolder-delete', wrap);
		del.setAttribute('fuuid', lm.fuuid);
		del.innerHTML = 'X';
		Wu.DomEvent.on(del, 'click', this.deleteMenuFolder, this);

		// folder
		var inner = Wu.DomUtil.create('div', 'layer-menu-item', wrap);
		inner.setAttribute('fuuid', lm.fuuid);
		inner.id = lm.fuuid;
		inner.innerHTML = lm.title;

		// set el
		l.el = wrap;
	       

	},

	upFolder : function (e) {
		console.log('UP menu folder');
		var fuuid = e.target.getAttribute('fuuid');
		console.log('fuuid: ', fuuid);

		var wrap = this.layers[fuuid].el;

		// get current x pos
		var i = _.findIndex(this.project.layermenu, {'fuuid' : fuuid});
		var pos = parseInt(this.project.layermenu[i].pos);

		// set new pos
		var newpos = pos + 1;
		this.project.layermenu[i].pos = newpos;

		// add class
		Wu.DomUtil.addClass(wrap, 'level-' + newpos);
		Wu.DomUtil.removeClass(wrap, 'level-' + pos);

		this.project._update('layermenu');
	},

	downFolder : function (e) {
		console.log('DOWN menu folder');
		var fuuid = e.target.getAttribute('fuuid');
		console.log('fuuid: ', fuuid);

		var wrap = this.layers[fuuid].el;

		// get current x pos
		var i = _.findIndex(this.project.layermenu, {'fuuid' : fuuid});
		var pos = parseInt(this.project.layermenu[i].pos);

		// set new pos
		var newpos = pos - 1;
		this.project.layermenu[i].pos = newpos;

		// add class
		Wu.DomUtil.addClass(wrap, 'level-' + newpos);
		Wu.DomUtil.removeClass(wrap, 'level-' + pos);

		this.project._update('layermenu');

	},

	deleteMenuFolder : function (e) {
		console.log('delete menu folder');
		var fuuid = e.target.getAttribute('fuuid');
		console.log('fuuid: ', fuuid);

		this.remove(fuuid);

		var i = _.findIndex(this.project.layermenu, {'fuuid' : fuuid});

		// remove from layermenu object
		this.project.layermenu.splice(i, 1);
	       
		// save
		this.project._update('layermenu');
	},

	addFromMapbox : function (mfile) {

		var l = this.layers[mfile.id] = {};
		l.file = mfile; // file

		// create layer
		l.layer = new Wu.MapboxLayer(mfile);// L.mapbox.tileLayer(mfile.id);

		// append to menu
		var wrap = Wu.DomUtil.create('div', 'layer-menu-item-wrap ct5');

		var file = { 
		    'uuid' : mfile.id, 
		    'name' : mfile.name
		};

		// add div to layermenu
		wrap.innerHTML = ich.layerMenuItem(file);
		l.el = wrap;
		this._content.appendChild(wrap);

		// add hooks
		Wu.DomEvent.on(wrap, 'mousedown', this.toggleLayer, this);

		// save
		// add to project layermenu object for saving
		// if (!this.layermenu) {
		//         this.layermenu = {};
		// }


		// this.layermenu[mfile.id] = {
		//         fuuid : mfile.id,
		//         title : mfile.name,
		//         pos : 1,
		//         layerType : 'mapbox'
		// };

		// var lm = {
		//         fuuid : mfile.id,
		//         title : mfile.name,
		//         pos : 1,
		//         layerType : 'mapbox'
		// }

		// this.project.layermenu.push(lm);

		// console.log('====mb=> pushing to layermenu', lm);

		// // save to server
		// this.save();
		

	},

	save : function () {
		var that = this;
		//if (this.saveTimer) clearTimeout(this.saveTimer);

		this.saveTimer = setTimeout(function () {

			// that.project.layermenu = [];            
		
			// for (m in that.layermenu) {
			//         that.project.layermenu.push(that.layermenu[m]);
			// }

			that.project._update('layermenu');


		}, 1000);       // don't save more than every goddamed second

		

	},

	update : function (project) {
		
		// project is ready only here, so init relevant vars
		// update is called from enableLayermenu toggle in MapPane

		// get vars
		this.project = project || Wu.app._activeProject;
		this._content = Wu.DomUtil.get('layer-menu-inner-content');
		this.layers = {};
		


		// debug return
		if (!this.project.layermenu) {
			// no menu yet
			console.log('no menu here!');
			return;
		}

		this.fill();
	       

		// // create layers
		// for (item in project.map.layermenu) {

		//         var l = project.map.layermenu[item];

		//                 // for each layer in project.
		//                 // if new source, simply add one layer into here and project.layers object
		//                 // sources can be in user list without being connected to a project
		//                 // sources has a .layer object tho, if it is a layer....
		       
		//         if (l.type == 'geojson') {
		//                 // geojson 

		//                                                 // when upload geojson, has file-uuid
		//                                                 // which 
		//                 var url = l.url;                // server geojson = http://systemapic.com/api/geojson/file-uuid
		//                                                 // getting the geojson must happen thru /api/geojson

		//         }
		// }
	
	},


	fill : function () {

		//this.layermenu = {};
		this.project.layermenu.forEach(function (lm, i, arr) {

			// layers from data library 
			if (lm.layerType == 'datalibrary' || lm.layerType === undefined) {
				var file = _.find(this.project.files, {'uuid' : lm.fuuid});     // wow! 
				this.addFromFile(file);
			}

			// layers from mapbox
			if (lm.layerType == 'mapbox') {
				var mb = _.find(this.project.mapboxLayers, {'id' : lm.fuuid});
				if (mb < 0) {
					console.error('no mb??', lm, this.project.mapboxLayers)
				}
				this.addFromMapbox(mb);
			}

			if (lm.layerType == 'menufolder') {
				console.log('adding menufolder');
				this.addMenuFolder(lm);

			}

			//this.layermenu[lm.fuuid] = lm;

		}, this);
	},
});

L.control.layermenu = function (options) {
	return new L.Control.Layermenu(options);
};

;/*
██╗      █████╗ ██╗   ██╗███████╗██████╗ ███████╗
██║     ██╔══██╗╚██╗ ██╔╝██╔════╝██╔══██╗██╔════╝
██║     ███████║ ╚████╔╝ █████╗  ██████╔╝███████╗
██║     ██╔══██║  ╚██╔╝  ██╔══╝  ██╔══██╗╚════██║
███████╗██║  ██║   ██║   ███████╗██║  ██║███████║
╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚══════╝
*/

// Layers
// Files as sources
// Urls as sources for mapbox,
Wu.Layer = Wu.Class.extend({

        type : 'Wu.Layer',

        initialize : function (source) {

                // set values
                this._source = source;

                // create db object
                //this._create();

                // create leaflet layer
                this.create();

                window.layers = window.layers || []
                window.layers.push(this);
               
        },

        // create layer object for db save
        _create : function () {

                this.uuid = 'layer-' + Wu.Util.guid();
                this.title = 'Layer new title!';
                this.description = 'Layer desc!';
                this.source = {};

                if (this._source.type == 'geojson') {
                        //this.source.geojson = this._soruce.
                }
                
                // source : {

                //         geojson : String,               // source uuid (file-asdklm-asdlk-123-asd-12132)
                //         rastertile : String,            // server raster path: hubble2/hubble
                //         vectortile : String,            // 
                //         mapbox : String,                // mapbox id (rawger.geography-class)
                //         cartodb : String,               // cartodb id
                //         osm : String,                   // osm id ?
                        
                //         placeholder : { type : Boolean, default: false} // if just a placeholder in menu
                // },

                // xpos : String,
                // ypos : String,

        },

        create : function () {

                // create empty layer (geojson)
                if (this.source.type == 'geojson') {   

                        this._layer = L.geoJson();
                }

                // defer loading
                this.hasLoaded = false;


        },


        load : function () {

        },

        loaded : function (json) {

                console.log('loaded:');
                console.log(json);

                // add geojson to layer
                this._layer.addData([json]);
                this._layer.onEachFeature(this._attachPopup(feature, layer));
        },

        _attachPopup : function (feature, layer) {

                // run fn on each feature
                if (feature.properties) {
                        var popstr = '';
                        for (key in feature.properties) {
                                popstr += key + ': ' + feature.properties[key] + '<br>';
                        }

                        // set popup
                        this._layer.bindPopup(popstr);
                }
        

        },


        // todo: move to layermenu object
        _leafletAddGeoJSON : function (obj) {
                console.log('adding leaflet geolayer');
                console.log(obj);
                layer = L.geoJson(obj, {
                        // run fn on each feature
                        onEachFeature : function (feature, layer) {
                                if (feature.properties) {
                                        var popstr = '';
                                        for (key in feature.properties) {
                                                popstr += key + ': ' + feature.properties[key] + '<br>';
                                        }

                                        // set popup
                                        layer.bindPopup(popstr);
                                }
                        }
                });

                layer.addTo(app._map);
        }


});





Wu.GeojsonLayer = Wu.Layer.extend({

        type : 'Wu.GeojsonLayer',

        // initialize : function (source) {

        //         // set values
        //         this._source = source;
        //         //this.uuid = source.uuid;
        //         this.uuid = 'layer-' + Wu.Util.guid();  // random

        //         this.create();
               
        // },

        create : function () {
                var that = this;
               
                // create empty layer (geojson)
                if (this._source.type == 'layer') {         // todo: specify which type, geojson, kml etc.
                        this._layer = L.geoJson([], {

                                // add test tooltip
                                onEachFeature : function (feature, layer) { that.basicTooltip(feature, layer); }                                       
                                
                        });
                }

                // defer loading
                this.hasLoaded = false;
        },

        basicTooltip : function (feature, layer) {
                
                if (feature.properties) {
                        var popstr = '';
                        for (key in feature.properties) {
                                popstr += key + ': ' + feature.properties[key] + '<br>';
                        }

                        // set popup
                        layer.bindPopup(popstr);
                }

        },

        add : function (map) {
                var map = map || Wu.app._map;
                var layer = this._layer;
                var drawControl = Wu.app.MapPane._drawControlLayer;

                if (!this.hasLoaded) {
                        // first load of data
                        this.load();
                }

                // add to map or drawControl
                if (drawControl) {
                        drawControl.addLayer(layer);
                } else {
                        layer.addTo(map);  // leaflet fn
                }
        },

        remove : function (map) {
                var map = map || Wu.app._map;
                var layer = this._layer;
                var drawControl = Wu.app.MapPane._drawControlLayer;
                
                // remove from map or drawControl
                if (drawControl) {
                        drawControl.removeLayer(layer);
                } else {
                        map.removeLayer(layer);  // leaflet fn
                }

        },

        load : function () {
                var that = this;

                // do nothing if already loaded
                if (this.hasLoaded) { return; }

                // get geojson from server
                var data = { 'uuid' : this._source.uuid }
                var json = JSON.stringify(data);
                
                // post with callback:   path       data    callback   context of cb
                // Wu.Util.postcb('/api/geojson', json, this._loaded, this);
                var path = '/api/geojson';
                
                var http = new XMLHttpRequest();
                var url = window.location.origin; //"http://85.10.202.87:8080/";// + path;//api/project/update";
                url += path;

                http.addEventListener("progress", function (oe) {
                        console.log('progress: ', oe);
                        //that.progress(oe);
                }, false);
                
                http.open("POST", url, true);

                //Send the proper header information along with the request
                http.setRequestHeader("Content-type", "application/json");

                http.onreadystatechange = function() {
                    if(http.readyState == 4 && http.status == 200) {
                        //if (cb) { cb(self, http.responseText); }
                        that._loaded(that, http.responseText);
                    }
                }
                http.send(json);

        },

        progress : function (p) {
                var bar = Wu.app.SidePane.DataLibrary.progress;
                var perc = p.loaded / p.total * 100;
                bar.style.opacity = 1;
                bar.style.width = perc + '%';
        },

        _loaded : function (that, json) {
                console.log('_got json: length: ', json.length);
                //console.log('this: ', this);

                // parse json into geojson object
                that.geojson = JSON.parse(json);
                
                // add data to layer
                that._layer.addData(that.geojson);

                this.hasLoaded = true;

        }


});

Wu.RasterLayer = Wu.Layer.extend({

})

Wu.MapboxLayer = Wu.Layer.extend({
        
        create : function () {
                this._layer = L.mapbox.tileLayer(this._source.id);
        },

        add : function (map) {
                var map = map || Wu.app._map;
                this._layer.addTo(map);  // leaflet fn
        },

        remove : function (map) {
                var map = map || Wu.app._map;
                map.removeLayer(this._layer);    // leaflet fn
        },


});


Wu.CartodbLayer = Wu.Layer.extend({

});;L.Control.Legends = L.Control.extend({
        
        options: {
                position : 'bottomleft' 
        },

        // automatically run when legends is added to map 
        onAdd : function (map) {

                var className = 'leaflet-control-legends',
                    container = L.DomUtil.create('div', className),
                    options = this.options;

                // add html
                container.innerHTML = ich.legendsControl(); 

                // NB! content is not ready yet, cause not added to map! 
               
                // create legendsOpener
                this._legendsOpener = Wu.DomUtil.createId('div', 'legends-opener');
                this._legendsOpener.innerHTML = 'Open Legends';
                Wu.DomUtil.addClass(this._legendsOpener, 'opacitizer');
                
                return container;

        },

        addHooks : function () {
                Wu.DomEvent.on(this._legendsCollapser, 'click', this.closeLegends, this);
        },

        closeLegends : function () {

                this._legendsInner.style.width = this._legendsInner.offsetWidth + 'px';
                var _1stchild = this._legendsInner.getElementsByTagName('div')[0];
                this._legendsInner.insertBefore(this._legendsOpener, _1stchild);
                Wu.DomEvent.on(this._legendsOpener, 'click', this.openLegends, this);
                var sh = this._legendsInner.offsetHeight;

                this._legendsCollapser.setAttribute('sh', sh);
                this._legendsInner.style.width = '150px';
                this._legendsInner.style.height = '24px'; 
                this._legendsCollapser.style.display = 'none';
                this._legendsCollapser.style.opacity = '0'; 

				// Measure, plus Long & Lat (.leaflet-top.leaflet-right)                
                Wu.app.MapPane._container.children[1].children[1].style.bottom = '6px';                  
        
        },

        openLegends : function (e) {

                console.log('open legendary');

                // Hide the little arrow button         
                this._legendsOpener.className = '';
                this._legendsOpener.style.opacity = '0';

                // Find out the width of the container
                var fatherwidth = this._legendsContainer.offsetWidth - 287 - 235; // The numbers are the width of the layer and info menus
                var hasleft = Wu.DomUtil.hasClass(this._legendsContainer, 'legends-push-left');
                var hasright = Wu.DomUtil.hasClass(this._legendsContainer, 'legends-push-right');
                if ( hasleft ) { fatherwidth += 287; }
                if ( hasright ) { fatherwidth += 235; }         

                // Set the width of the Legends
                this._legendsInner.style.width = fatherwidth + 'px';  

                // Hacky packy - Pick up the height of the legends from before we collapsed it, 
                // which is stored in the collapse button as a 'sh' attribute
                this._legendsInner.style.height = this._legendsCollapser.getAttribute('sh') + 'px';         
                this._legendsCollapser.style.display = 'block';


				// Measure, plus Long & Lat (.leaflet-top.leaflet-right)                
                Wu.app.MapPane._container.children[1].children[1].style.bottom = '133px';                  


                var that = this; // this is different context inside setTimeout
                setTimeout(function(){                  
                        that._legendsInner.removeAttribute('style');
                        that._legendsOpener.removeAttribute('style');
                        that._legendsInner.removeChild(that._legendsOpener);

                        Wu.DomUtil.addClass(that._legendsCollapser, 'opacitizer');

                        that.adjustLegArrow();               
                        that._legendsCollapser.style.opacity = '1';               
                }, 500);                

        },

        // is called when changing/selecting project
        update : function (project) {
                console.log('legends update!');
               
                // init divs
                this.initContainer();

                // project is ready only here, so init relevant vars
                // update is called from enableLayermenu toggle in MapPane

                // get vars
                this.project = project || Wu.app._activeProject;
                this._content = Wu.DomUtil.get('legends-control-inner-content');                

        },

        initContainer : function () {
        
        		console.log('init container');

                // get elements
                this._legendsCollapser = Wu.DomUtil.get('legends-collapser');
                this._legendsInner = Wu.DomUtil.get('legends-inner');
                this._legendsContainer = Wu.DomUtil.get('legends-control-inner-content');

                // add hooks
                this.addHooks();

                // adjust
                this.adjustLegArrow();

        },


        adjustLegArrow : function () {
                var orgwidth = document.getElementById('legends-inner').offsetWidth;                                
                var hasleft = Wu.DomUtil.hasClass(this._legendsContainer, 'legends-push-left');
                var hasright = Wu.DomUtil.hasClass(this._legendsContainer, 'legends-push-right');
                if ( !hasleft ) { orgwidth += 287; } else { orgwidth -= 287; }
                if ( !hasright ) { orgwidth += 237; } else { orgwidth += 237; } 
                this._legendsCollapser.style.left = orgwidth/2 + 'px';
        }    

});


L.control.legends = function (options) {
        return new L.Control.Legends(options);
};





// var legendsContainer = document.getElementById('legends-control-inner-content');
        
//     var legendsInner = document.createElement('div');
//         legendsInner.id = 'legends-inner';
        
//         legendsContainer.appendChild(legendsInner);

//     var legendsCollapser = document.createElement('div');
//         legendsCollapser.className = 'dropdown-button legends-collapser-trans';
//         legendsCollapser.id = 'legends-collapser';

//         adjustLegArrow();
        
//     function adjustLegArrow() {
//         var orgwidth = document.getElementById('legends-inner').offsetWidth;                                
//         var hasleft = Wu.DomUtil.hasClass(legendsContainer, 'legends-push-left');
//         var hasright = Wu.DomUtil.hasClass(legendsContainer, 'legends-push-right');
//         if ( !hasleft ) { orgwidth += 287; } else { orgwidth -= 287; }
//         if ( !hasright ) { orgwidth += 237; } else { orgwidth += 237; } 
//         legendsCollapser.style.left = orgwidth/2 + 'px';
//     }       
        
        
        
        
//         legendsInner.appendChild(legendsCollapser);


    // var legendsOpener = document.createElement('div');
    //     legendsOpener.id = 'legends-opener';
    //     legendsOpener.className = 'opacitizer';
    //     legendsOpener.innerHTML = 'Open Legends';


        // Close Legends
        // legendsCollapser.onclick = function() {
        //     legendsInner.style.width = legendsInner.offsetWidth + 'px';
            
        //     var _1stchild = legendsInner.getElementsByTagName('div')[0];
        //     legendsInner.insertBefore(legendsOpener, _1stchild);
            
        //     var sh = legendsInner.offsetHeight;
        //     legendsCollapser.setAttribute('sh', sh);
            
        //     legendsInner.style.width = '150px';
        //     legendsInner.style.height = '24px'; 
        //     legendsCollapser.style.display = 'none';
        //     legendsCollapser.style.opacity = '0';                   
        // }

        // // Open Legends
        // legendsOpener.onclick = function() {

        //     console.log('open legendary');

        //     // Hide the little arrow button         
        //     this.className = '';
        //     this.style.opacity = '0';

        //     // Find out the width of the container
        //     var fatherwidth = legendsContainer.offsetWidth - 287 - 237; // The numbers are the width of the layer and info menus


        //     var hasleft = Wu.DomUtil.hasClass(legendsContainer, 'legends-push-left');
        //     var hasright = Wu.DomUtil.hasClass(legendsContainer, 'legends-push-right');

        //     if ( hasleft ) { fatherwidth += 287; }
        //     if ( hasright ) { fatherwidth += 237; }         

            
                
        //     // Set the width of the Legends
        //     legendsInner.style.width = fatherwidth + 'px';  
            
        //     // Hacky packy - Pick up the height of the legends from before we collapsed it, 
        //     // which is stored in the collapse button as a 'sh' attribute
        //     legendsInner.style.height = legendsCollapser.getAttribute('sh') + 'px';         
            
        //     legendsCollapser.style.display = 'block';
            
        //     setTimeout(function(){                  
        //         legendsInner.removeAttribute('style');
        //         legendsOpener.removeAttribute('style');
        //         legendsInner.removeChild(legendsOpener);
        //         this.className = 'opacitizer';
        //         adjustLegArrow();               
        //         legendsCollapser.style.opacity = '1';               
        //     }, 500);                
            
        // };

/*
███╗   ███╗ █████╗ ██████╗ ██████╗  █████╗ ███╗   ██╗███████╗
████╗ ████║██╔══██╗██╔══██╗██╔══██╗██╔══██╗████╗  ██║██╔════╝
██╔████╔██║███████║██████╔╝██████╔╝███████║██╔██╗ ██║█████╗  
██║╚██╔╝██║██╔══██║██╔═══╝ ██╔═══╝ ██╔══██║██║╚██╗██║██╔══╝  
██║ ╚═╝ ██║██║  ██║██║     ██║     ██║  ██║██║ ╚████║███████╗
╚═╝     ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═══╝╚══════╝
*/
Wu.MapPane = Wu.Class.extend({

	initialize : function () {
		this._initContainer();
		this._initPanes();
		return this; 
	},      

	_initContainer : function () {
		
		// init container
		this._container = Wu.app._mapPane = Wu.DomUtil.createId('div', 'map', Wu.app._mapContainer);
		
		// events
		Wu.DomEvent.on(window, 'resize', this._updateWidth, this); 
	},

	_initPanes : function () {

	},

    
	_updateWidth : function () {
		// set width
		if (!this._map) return;
		this._map._container.style.width = parseInt(window.innerWidth) - parseInt(this._map._container.offsetLeft) + 'px';
		this._map.invalidateSize() //??
	},
	
	setProject : function (project) {
		this.project = project;
		this._reset();
		this._update(project);
	},

	setBaseLayer : function (project) {

		// remove old baselayer, if any
		if (Wu.Util.isObject(this._baselayer)) {
			console.log('removing baselayer!');
			this._map.removeLayer(this._baseLayer);
		}
		
		// remove previous baselayer
		if (this._baseLayer) this._map.removeLayer(this._baseLayer);

		// get map layer and add to map
		this._baseLayer = this._getBaseLayer(project);
		this._baseLayer.addTo(this._map);
	},


	_setLeft : function (width) {  
		this._map._container.style.left = width + 'px';
		this._map._container.style.width = parseInt(window.innerWidth) - width + 'px';
		//this._map.invalidateSize();
	},

	_update : function (project) {

		this.setBaseLayer(project);
		
		// set options
		var lat = project.map.initPos.lat;
		var lng = project.map.initPos.lng;
		var zoom = project.map.initPos.zoom;
		this._map.setView([lat, lng], zoom);

		// set height
		var control = Wu.app._map._controlContainer;
		control.style.paddingTop = project.header.height + 'px';

		// refresh leaflet map
		this._map.invalidateSize();

		// // update mapbox account
		// this.project.mapboxFullFiles = {};
		// this.project.mapboxLayers.forEach(function (layer, i, arr) {
		//         var array = JSON.parse(layer.JSON);
		//         array.forEach(function (a, b, c) {
		//                 this.project.mapboxFullFiles[a.id] = a; 
		//         }, this);
		// }, this);

	},

	_getBaseLayer : function (project) {

		// mapbox
		var url = project.map.baseLayer.url;
		if (project.map.baseLayer.provider == 'mapbox') {
			var layer = L.mapbox.tileLayer(url);
		}

		// systemapic
		if (project.map.baseLayer.provider == 'systemapic' || project.map.baseLayer.provider == 'datalibrary') {
			var type = project.map.baseLayer.type;
			var url = project.map.baseLayer.url;
			var tile = Wu.app.options.tileserver + type + '/' + url + '/{z}/{x}/{y}.png' 
			var tms = project.map.baseLayer.tms || false;
			var layer = L.tileLayer(tile, {tms: tms});
		}
		
		return layer;
	},

	reset : function () {
		this._reset();
	},

	_reset : function () {

		// remove current map
		if (this._map) this._map.remove();
		

		// create new map
		this._map = Wu.app._map = L.map('map').setView([0, 0], 5);

		// width hack
		this._updateWidth();

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

		// remove hanging zoom
		this.disableZoom();             // weird ta

	},

	addLayer : function (layerID) {
		var layer = L.mapbox.tileLayer(layerID);
		layer.addTo(this._map);
	},

	_addLayer : function (layer) {
		layer.addto(this._map);
	},


	disableZoom : function () {
		this._map.touchZoom.disable();
		this._map.doubleClickZoom.disable();
		this._map.scrollWheelZoom.disable();
		this._map.boxZoom.disable();
		this._map.keyboard.disable();
		document.getElementsByClassName('leaflet-control-zoom')[0].style.visibility = 'hidden';
	}, 

	enableZoom : function () {
		console.log('enabling zoom!');
		this._map.touchZoom.enable();
		this._map.doubleClickZoom.enable();
		this._map.scrollWheelZoom.enable();
		this._map.boxZoom.enable();
		this._map.keyboard.enable();
		document.getElementsByClassName('leaflet-control-zoom')[0].style.visibility = 'visible';
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


	},

	disableGeolocation : function () {

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
	},

	disableLayermenu : function () {
		if (!this.layerMenu) return;
	       
		// remove and delete control
		this._map.removeControl(this.layerMenu);
		delete this.layerMenu;
	},

	enableVectorstyle : function () {
		if (this.vectorStyle) return;

		this.vectorStyle = L.control.styleEditor({ position: "topleft" });
		
		this._map.addControl(this.vectorStyle);
	},

	disableVectorstyle : function () {
		if (!this.vectorStyle) return;

		// remove vectorstyle control
		this._map.removeControl(this.vectorStyle);             // todo: doesnt clean up after itself!
		delete this.vectorStyle;   
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
		this._map.removeLayer(this._drawControlLayer);
		this._drawControl = false;
	},

	addDrawControl : function () {
		var that = this;

		// debug
		geojsony = {
		   "type": "Feature",
		      "properties": {
			"OK": "asdasd",
			"asdsad": "asd"
		      },
		      "geometry": {
			"type": "Polygon",
			"coordinates": [
			  [
			    [
			      43.9453125,
			      36.73888412439431
			    ],
			    [
			      43.9453125,
			      53.4357192066942
			    ],
			    [
			      77.6953125,
			      53.4357192066942
			    ],
			    [
			      77.6953125,
			      36.73888412439431
			    ],
			    [
			      33.9453125,
			      36.73888412439431
			    ]
			  ]
			]
		      }
		}

		// initialize the FeatureGroup to store editable layers
		//this._drawControlLayer = window.dc = new L.FeatureGroup();
		//this._map.addLayer(this._drawControlLayer);
		console.log('ALSDALDLASD<AS');
		//var layer = L.geoJson(geojsony).addTo(this._map);
		this._drawControlLayer = window.drawControl = L.geoJson().addTo(this._map);


		// initialize the draw control and pass it the FeatureGroup of editable layers
		options = {
			position: 'topleft',
			edit: {
				featureGroup: this._drawControlLayer
			},
			draw: {
				circle: {
					shapeOptions: {
						fill: false,
						color: '#FFF',
						fillOpacity: 0.3,
						fillColor: '#FFF'
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
		this._drawControl = new L.Control.Draw(options);
		this._map.addControl(this._drawControl);
		L.DomUtil.addClass(this._drawControl._container, 'elizaveta');

		// close popups on hover
		Wu.DomEvent.on(this._drawControl, 'mousemove', L.DomEvent.stop, this);
		Wu.DomEvent.on(this._drawControl, 'mouseover', this._map.closePopup, this);

		// add circle support
		this._map.on('draw:created', function(e) {

			// add circle support
			e.layer.layerType = e.layerType;            

			// add drawn layer to map
			that._drawControlLayer.addLayer(e.layer);
		});

		// created note
		this._map.on('draw:note:created', function(e) {

			// add layers
			that._drawControlLayer.addLayer(e.noteLayer);
			that._drawControlLayer.addLayer(e.rectangleLayer);

			// enable edit toolbar and focus Note
			L.Draw._editshortcut.enable();
			e.noteLayer._el.focus();
			that._map.LeafletDrawEditEnabled = true;
		});
	}

});


;/*
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
                prefix: ""
        },

        onAdd: function (map) {
                this._container = L.DomUtil.create('div', 'leaflet-control-mouseposition');
                this._container.innerHTML = this.options.emptyString;
                
                L.DomEvent.disableClickPropagation(this._container);
                map.on('mousemove', this._onMouseMove, this);
                
                return this._container;
        },

        onRemove: function (map) {
                map.off('mousemove', this._onMouseMove)
        },

        _onMouseMove: function (e) {
                var lng = this.options.lngFormatter ? this.options.lngFormatter(e.latlng.lng) : L.Util.formatNum(e.latlng.lng, this.options.numDigits);
                var lat = this.options.latFormatter ? this.options.latFormatter(e.latlng.lat) : L.Util.formatNum(e.latlng.lat, this.options.numDigits);
                var value = this.options.lngFirst ? lng + this.options.separator + lat : lat + this.options.separator + lng;
                var prefixAndValue = this.options.prefix + ' ' + value;
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
 * jQuery Notebook 0.5
 *
 * Copyright (c) 2014
 * Raphael Cruzeiro - http://raphaelcruzeiro.eu/
 * Otávio Soares
 *
 * Released under the MIT License
 * http://opensource.org/licenses/MIT
 *
 * Github https://github.com/raphaelcruzeiro/jquery-notebook
 * Version 0.5
 *
 * Some functions of this plugin were based on Jacob Kelley's Medium.js
 * https://github.com/jakiestfu/Medium.js/
 */

Wu.Util.notebook = function(div, options) {
        

    console.log('notebook');
    console.log($);

    var d = document;
    var w = window;

// }
// var jQuery = $;
// (function($, d, w) {

    /*
     * This module deals with the CSS transforms. As it is not possible to easily
     * combine the transform functions with JavaScript this module abstract those
     * functions and generates a raw transform matrix, combining the new transform
     * with the others that were previously applied to the element.
     */

    var transform = (function() {
        var matrixToArray = function(str) {
            if (!str || str == 'none') {
                return [1, 0, 0, 1, 0, 0];
            }
            return str.match(/(-?[0-9\.]+)/g);
        };

        var getPreviousTransforms = function(elem) {
            return elem.css('-webkit-transform') || elem.css('transform') || elem.css('-moz-transform') ||
                elem.css('-o-transform') || elem.css('-ms-transform');
        };

        var getMatrix = function(elem) {
            var previousTransform = getPreviousTransforms(elem);
            return matrixToArray(previousTransform);
        };

        var applyTransform = function(elem, transform) {
            elem.css('-webkit-transform', transform);
            elem.css('-moz-transform', transform);
            elem.css('-o-transform', transform);
            elem.css('-ms-transform', transform);
            elem.css('transform', transform);
        };

        var buildTransformString = function(matrix) {
            return 'matrix(' + matrix[0] +
                ', ' + matrix[1] +
                ', ' + matrix[2] +
                ', ' + matrix[3] +
                ', ' + matrix[4] +
                ', ' + matrix[5] + ')';
        };

        var getTranslate = function(elem) {
            var matrix = getMatrix(elem);
            return {
                x: parseInt(matrix[4]),
                y: parseInt(matrix[5])
            };
        };

        var scale = function(elem, _scale) {
            var matrix = getMatrix(elem);
            matrix[0] = matrix[3] = _scale;
            var transform = buildTransformString(matrix);
            applyTransform(elem, transform);
        };

        var translate = function(elem, x, y) {
            var matrix = getMatrix(elem);
            matrix[4] = x;
            matrix[5] = y;
            var transform = buildTransformString(matrix);
            applyTransform(elem, transform);
        };

        var rotate = function(elem, deg) {
            var matrix = getMatrix(elem);
            var rad1 = deg * (Math.PI / 180);
            var rad2 = rad1 * -1;
            matrix[1] = rad1;
            matrix[2] = rad2;
            var transform = buildTransformString(matrix);
            applyTransform(elem, transform);
        };

        return {
            scale: scale,
            translate: translate,
            rotate: rotate,
            getTranslate: getTranslate
        };
    })();

    var isMac = w.navigator.platform == 'MacIntel',
        mouseX = 0,
        mouseY = 0,
        cache = {
            command: false,
            shift: false,
            isSelecting: false
        },
        modifiers = {
            66: 'bold',
            73: 'italic',
            85: 'underline',
            112: 'h1',
            113: 'h2',
            122: 'undo'
        },
        options,
        utils = {
            keyboard: {
                isCommand: function(e, callbackTrue, callbackFalse) {
                    if (isMac && e.metaKey || !isMac && e.ctrlKey) {
                        callbackTrue();
                    } else {
                        callbackFalse();
                    }
                },
                isShift: function(e, callbackTrue, callbackFalse) {
                    if (e.shiftKey) {
                        callbackTrue();
                    } else {
                        callbackFalse();
                    }
                },
                isModifier: function(e, callback) {
                    var key = e.which,
                        cmd = modifiers[key];
                    if (cmd) {
                        callback.call(this, cmd);
                    }
                },
                isEnter: function(e, callback) {
                    if (e.which === 13) {
                        callback();
                    }
                },
                isArrow: function(e, callback) {
                    if (e.which >= 37 || e.which <= 40) {
                        callback();
                    }
                }
            },
            html: {
                addTag: function(elem, tag, focus, editable) {
                    var newElement = $(d.createElement(tag));
                    newElement.attr('contenteditable', Boolean(editable));
                    newElement.append(' ');
                    elem.append(newElement);
                    if (focus) {
                        cache.focusedElement = elem.children().last();
                        utils.cursor.set(elem, 0, cache.focusedElement);
                    }
                    return newElement;
                }
            },
            cursor: {
                set: function(editor, pos, elem) {
                    var range;
                    if (d.createRange) {
                        range = d.createRange();
                        var selection = w.getSelection(),
                            lastChild = editor.children().last(),
                            length = lastChild.html().length - 1,
                            toModify = elem ? elem[0] : lastChild[0],
                            theLength = typeof pos !== 'undefined' ? pos : length;
                        range.setStart(toModify, theLength);
                        range.collapse(true);
                        selection.removeAllRanges();
                        selection.addRange(range);
                    } else {
                        range = d.body.createTextRange();
                        range.moveToElementText(elem);
                        range.collapse(false);
                        range.select();
                    }
                }
            },
            selection: {
                save: function() {
                    if (w.getSelection) {
                        var sel = w.getSelection();
                        if (sel.rangeCount > 0) {
                            return sel.getRangeAt(0);
                        }
                    } else if (d.selection && d.selection.createRange) { // IE
                        return d.selection.createRange();
                    }
                    return null;
                },
                restore: function(range) {
                    if (range) {
                        if (w.getSelection) {
                            var sel = w.getSelection();
                            sel.removeAllRanges();
                            sel.addRange(range);
                        } else if (d.selection && range.select) { // IE
                            range.select();
                        }
                    }
                },
                getText: function() {
                    var txt = '';
                    if (w.getSelection) {
                        txt = w.getSelection().toString();
                    } else if (d.getSelection) {
                        txt = d.getSelection().toString();
                    } else if (d.selection) {
                        txt = d.selection.createRange().text;
                    }
                    return txt;
                },
                clear: function() {
                    if (window.getSelection) {
                        if (window.getSelection().empty) { // Chrome
                            window.getSelection().empty();
                        } else if (window.getSelection().removeAllRanges) { // Firefox
                            window.getSelection().removeAllRanges();
                        }
                    } else if (document.selection) { // IE?
                        document.selection.empty();
                    }
                },
                getContainer: function(sel) {
                    if (w.getSelection && sel && sel.commonAncestorContainer) {
                        return sel.commonAncestorContainer;
                    } else if (d.selection && sel && sel.parentElement) {
                        return sel.parentElement();
                    }
                    return null;
                },
                getSelection: function() {
                    if (w.getSelection) {
                        return w.getSelection();
                    } else if (d.selection && d.selection.createRange) { // IE
                        return d.selection;
                    }
                    return null;
                }
            },
            validation: {
                isUrl: function(url) {
                    return (/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/).test(url);
                }
            }
        },
        bubble = {
            /*
             * This is called to position the bubble above the selection.
             */
            updatePos: function(editor, elem) {
                var sel = w.getSelection(),
                    range = sel.getRangeAt(0),
                    boundary = range.getBoundingClientRect(),
                    bubbleWidth = elem.width(),
                    bubbleHeight = elem.height(),
                    offset = editor.offset().left,
                    pos = {
                        x: (boundary.left + boundary.width / 2) - (bubbleWidth / 2),
                        y: boundary.top - bubbleHeight - 8 + $(document).scrollTop()
                    };
                transform.translate(elem, pos.x, pos.y);
            },
            /*
             * Updates the bubble to set the active formats for the current selection.
             */
            updateState: function(editor, elem) {
                elem.find('button').removeClass('active');
                var sel = w.getSelection(),
                    formats = [];
                bubble.checkForFormatting(sel.focusNode, formats);
                var formatDict = {
                    'b': 'bold',
                    'i': 'italic',
                    'u': 'underline',
                    'h1': 'h1',
                    'h2': 'h2',
                    'a': 'anchor',
                    'ul': 'ul',
                    'ol': 'ol'
                };
                for (var i = 0; i < formats.length; i++) {
                    var format = formats[i];
                    elem.find('button.' + formatDict[format]).addClass('active');
                }
            },
            /*
             * Recursively navigates upwards in the DOM to find all the format
             * tags enclosing the selection.
             */
            checkForFormatting: function(currentNode, formats) {
                var validFormats = ['b', 'i', 'u', 'h1', 'h2', 'ol', 'ul', 'li', 'a'];
                if (currentNode.nodeName === '#text' ||
                    validFormats.indexOf(currentNode.nodeName.toLowerCase()) != -1) {
                    if (currentNode.nodeName != '#text') {
                        formats.push(currentNode.nodeName.toLowerCase());
                    }
                    bubble.checkForFormatting(currentNode.parentNode, formats);
                }
            },
            buildMenu: function(editor, elem) {
                var ul = utils.html.addTag(elem, 'ul', false, false);
                for (var cmd in options.modifiers) {
                    var li = utils.html.addTag(ul, 'li', false, false);
                    var btn = utils.html.addTag(li, 'button', false, false);
                    btn.attr('editor-command', options.modifiers[cmd]);
                    btn.addClass(options.modifiers[cmd]);
                }
                elem.find('button').click(function(e) {
                    e.preventDefault();
                    var cmd = $(this).attr('editor-command');
                    events.commands[cmd].call(editor, e);
                });
                var linkArea = utils.html.addTag(elem, 'div', false, false);
                linkArea.addClass('link-area');
                var linkInput = utils.html.addTag(linkArea, 'input', false, false);
                linkInput.attr({
                    type: 'text'
                });
                var closeBtn = utils.html.addTag(linkArea, 'button', false, false);
                closeBtn.click(function(e) {
                    e.preventDefault();
                    var editor = $(this).closest('.editor');
                    $(this).closest('.link-area').hide();
                    $(this).closest('.bubble').find('ul').show();
                });
            },
            show: function() {
                var tag = $(this).parent().find('.bubble');
                if (!tag.length) {
                    tag = utils.html.addTag($(this).parent(), 'div', false, false);
                    tag.addClass('jquery-notebook bubble');
                }
                tag.empty();
                bubble.buildMenu(this, tag);
                tag.show();
                bubble.updateState(this, tag);
                if (!tag.hasClass('active')) {
                    tag.addClass('jump');
                } else {
                    tag.removeClass('jump');
                }
                bubble.updatePos($(this), tag);
                tag.addClass('active');
            },
            update: function() {
                var tag = $(this).parent().find('.bubble');
                bubble.updateState(this, tag);
            },
            clear: function() {
                var elem = $(this).parent().find('.bubble');
                if (!elem.hasClass('active')) return;
                elem.removeClass('active');
                bubble.hideLinkInput.call(this);
                bubble.showButtons.call(this);
                setTimeout(function() {
                    if (elem.hasClass('active')) return;
                    elem.hide();
                }, 500);
            },
            hideButtons: function() {
                $(this).parent().find('.bubble').find('ul').hide();
            },
            showButtons: function() {
                $(this).parent().find('.bubble').find('ul').show();
            },
            showLinkInput: function(selection) {
                bubble.hideButtons.call(this);
                var editor = this;
                var elem = $(this).parent().find('.bubble').find('input[type=text]');
                var hasLink = elem.closest('.jquery-notebook').find('button.anchor').hasClass('active');
                elem.unbind('keydown');
                elem.keydown(function(e) {
                    var elem = $(this);
                    utils.keyboard.isEnter(e, function() {
                        e.preventDefault();
                        var url = elem.val();
                        if (utils.validation.isUrl(url)) {
                            e.url = url;
                            events.commands.createLink(e, selection);
                            bubble.clear.call(editor);
                        } else if (url === '' && hasLink) {
                            events.commands.removeLink(e, selection);
                            bubble.clear.call(editor);
                        }
                    });
                });
                elem.bind('paste', function(e) {
                    var elem = $(this);
                    setTimeout(function() {
                        var text = elem.val();
                        if (/http:\/\/https?:\/\//.test(text)) {
                            text = text.substring(7);
                            elem.val(text);
                        }
                    }, 1);
                });
                var linkText = 'http://';
                if (hasLink) {
                    var anchor = $(utils.selection.getContainer(selection)).closest('a');
                    linkText = anchor.prop('href') || linkText;
                }
                $(this).parent().find('.link-area').show();
                elem.val(linkText).focus();
            },
            hideLinkInput: function() {
                $(this).parent().find('.bubble').find('.link-area').hide();
            }
        },
        actions = {
            bindEvents: function(elem) {
                elem.keydown(rawEvents.keydown);
                elem.keyup(rawEvents.keyup);
                elem.focus(rawEvents.focus);
                elem.bind('paste', events.paste);
                elem.mousedown(rawEvents.mouseClick);
                elem.mouseup(rawEvents.mouseUp);
                elem.mousemove(rawEvents.mouseMove);
                elem.blur(rawEvents.blur);
                $('body').mouseup(function(e) {
                    if (e.target == e.currentTarget && cache.isSelecting) {
                        rawEvents.mouseUp.call(elem, e);
                    }
                });
            },
            setPlaceholder: function(e) {
                if (/^\s*$/.test($(this).text())) {
                    $(this).empty();
                    var placeholder = utils.html.addTag($(this), 'p').addClass('placeholder');
                    placeholder.append($(this).attr('editor-placeholder'));
                    utils.html.addTag($(this), 'p', typeof e.focus != 'undefined' ? e.focus : false, true);
                } else {
                    $(this).find('.placeholder').remove();
                }
            },
            removePlaceholder: function(e) {
                $(this).find('.placeholder').remove();
            },
            preserveElementFocus: function() {
                var anchorNode = w.getSelection() ? w.getSelection().anchorNode : d.activeElement;
                if (anchorNode) {
                    var current = anchorNode.parentNode,
                        diff = current !== cache.focusedElement,
                        children = this.children,
                        elementIndex = 0;
                    if (current === this) {
                        current = anchorNode;
                    }
                    for (var i = 0; i < children.length; i++) {
                        if (current === children[i]) {
                            elementIndex = i;
                            break;
                        }
                    }
                    if (diff) {
                        cache.focusedElement = current;
                        cache.focusedElementIndex = elementIndex;
                    }
                }
            },
            setContentArea: function(elem) {
                var id = $('body').find('.jquery-editor').length + 1;
                elem.attr('data-jquery-notebook-id', id);
                var body = $('body');
                contentArea = $('<textarea></textarea>');
                contentArea.css({
                    position: 'absolute',
                    left: -1000
                });
                contentArea.attr('id', 'jquery-notebook-content-' + id);
                body.append(contentArea);
            },
            prepare: function(elem, customOptions) {
                options = customOptions;
                actions.setContentArea(elem);
                elem.attr('editor-mode', options.mode);
                elem.attr('editor-placeholder', options.placeholder);
                elem.attr('contenteditable', true);
                elem.css('position', 'relative');
                elem.addClass('jquery-notebook editor');
                actions.setPlaceholder.call(elem, {});
                actions.preserveElementFocus.call(elem);
                if (options.autoFocus === true) {
                    var firstP = elem.find('p:not(.placeholder)');
                    utils.cursor.set(elem, 0, firstP);
                }
            }
        },
        rawEvents = {
            keydown: function(e) {
                var elem = this;
                if (cache.command && e.which === 65) {
                    setTimeout(function() {
                        bubble.show.call(elem);
                    }, 50);
                }
                utils.keyboard.isCommand(e, function() {
                    cache.command = true;
                }, function() {
                    cache.command = false;
                });
                utils.keyboard.isShift(e, function() {
                    cache.shift = true;
                }, function() {
                    cache.shift = false;
                });
                utils.keyboard.isModifier.call(this, e, function(modifier) {
                    if (cache.command) {
                        events.commands[modifier].call(this, e);
                    }
                });

                if (cache.shift) {
                    utils.keyboard.isArrow.call(this, e, function() {
                        setTimeout(function() {
                            var txt = utils.selection.getText();
                            if (txt !== '') {
                                bubble.show.call(elem);
                            } else {
                                bubble.clear.call(elem);
                            }
                        }, 100);
                    });
                } else {
                    utils.keyboard.isArrow.call(this, e, function() {
                        bubble.clear.call(elem);
                    });
                }

                if (e.which === 13) {
                    events.enterKey.call(this, e);
                }
                if (e.which === 27) {
                    bubble.clear.call(this);
                }
                if (e.which === 86 && cache.command) {
                    events.paste.call(this, e);
                }
                if (e.which === 90 && cache.command) {
                    events.commands.undo.call(this, e);
                }
            },
            keyup: function(e) {
                utils.keyboard.isCommand(e, function() {
                    cache.command = false;
                }, function() {
                    cache.command = true;
                });
                actions.preserveElementFocus.call(this);
                actions.removePlaceholder.call(this);

                /*
                 * This breaks the undo when the whole text is deleted but so far
                 * it is the only way that I fould to solve the more serious bug
                 * that the editor was losing the p elements after deleting the whole text
                 */
                if (/^\s*$/.test($(this).text())) {
                    $(this).empty();
                    utils.html.addTag($(this), 'p', true, true);
                }
                events.change.call(this);
            },
            focus: function(e) {
                cache.command = false;
                cache.shift = false;
            },
            mouseClick: function(e) {
                var elem = this;
                cache.isSelecting = true;
                if ($(this).parent().find('.bubble:visible').length) {
                    var bubbleTag = $(this).parent().find('.bubble:visible'),
                        bubbleX = bubbleTag.offset().left,
                        bubbleY = bubbleTag.offset().top,
                        bubbleWidth = bubbleTag.width(),
                        bubbleHeight = bubbleTag.height();
                    if (mouseX > bubbleX && mouseX < bubbleX + bubbleWidth &&
                        mouseY > bubbleY && mouseY < bubbleY + bubbleHeight) {
                        return;
                    }
                }
            },
            mouseUp: function(e) {
                var elem = this;
                cache.isSelecting = false;
                setTimeout(function() {
                    var s = utils.selection.save();
                    if (s) {
                        if (s.collapsed) {
                            bubble.clear.call(elem);
                        } else {
                            bubble.show.call(elem);
                            e.preventDefault();
                        }
                    }
                }, 50);
            },
            mouseMove: function(e) {
                mouseX = e.pageX;
                mouseY = e.pageY;
            },
            blur: function(e) {
                actions.setPlaceholder.call(this, {
                    focus: false
                });
            }
        },
        events = {
            commands: {
                bold: function(e) {
                    e.preventDefault();
                    d.execCommand('bold', false);
                    bubble.update.call(this);
                    events.change.call(this);
                },
                italic: function(e) {
                    e.preventDefault();
                    d.execCommand('italic', false);
                    bubble.update.call(this);
                    events.change.call(this);
                },
                underline: function(e) {
                    e.preventDefault();
                    d.execCommand('underline', false);
                    bubble.update.call(this);
                    events.change.call(this);
                },
                anchor: function(e) {
                    e.preventDefault();
                    var s = utils.selection.save();
                    bubble.showLinkInput.call(this, s);
                    events.change.call(this);
                },
                createLink: function(e, s) {
                    utils.selection.restore(s);
                    d.execCommand('createLink', false, e.url);
                    bubble.update.call(this);
                    events.change.call(this);
                },
                removeLink: function(e, s) {
                    var el = $(utils.selection.getContainer(s)).closest('a');
                    el.contents().first().unwrap();
                    events.change.call(this);
                },
                h1: function(e) {
                    e.preventDefault();
                    if ($(window.getSelection().anchorNode.parentNode).is('h1')) {
                        d.execCommand('formatBlock', false, '<p>');
                    } else {
                        d.execCommand('formatBlock', false, '<h1>');
                    }
                    bubble.update.call(this);
                    events.change.call(this);
                },
                h2: function(e) {
                    e.preventDefault();
                    if ($(window.getSelection().anchorNode.parentNode).is('h2')) {
                        d.execCommand('formatBlock', false, '<p>');
                    } else {
                        d.execCommand('formatBlock', false, '<h2>');
                    }
                    bubble.update.call(this);
                    events.change.call(this);
                },
                ul: function(e) {
                    e.preventDefault();
                    d.execCommand('insertUnorderedList', false);
                    bubble.update.call(this);
                    events.change.call(this);
                },
                ol: function(e) {
                    e.preventDefault();
                    d.execCommand('insertOrderedList', false);
                    bubble.update.call(this);
                    events.change.call(this);
                },
                undo: function(e) {
                    e.preventDefault();
                    d.execCommand('undo', false);
                    var sel = w.getSelection(),
                        range = sel.getRangeAt(0),
                        boundary = range.getBoundingClientRect();
                    $(document).scrollTop($(document).scrollTop() + boundary.top);
                    events.change.call(this);
                }
            },
            enterKey: function(e) {
                if ($(this).attr('editor-mode') === 'inline') {
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                }

                var sel = utils.selection.getSelection();
                var elem = $(sel.focusNode.parentElement);
                var nextElem = elem.next();
                if(!nextElem.length && elem.prop('tagName') != 'LI') {
                    var tagName = elem.prop('tagName');
                    if(tagName === 'OL' || tagName === 'UL') {
                        var lastLi = elem.children().last();
                        if(lastLi.length && lastLi.text() === '') {
                            lastLi.remove();
                        }
                    }
                    utils.html.addTag($(this), 'p', true, true);
                    e.preventDefault();
                    e.stopPropagation();
                }
                events.change.call(this);
            },
            paste: function(e) {
                var elem = $(this),
                    id = 'jqeditor-temparea',
                    range = utils.selection.save(),
                    tempArea = $('#' + id);
                if (tempArea.length < 1) {
                    var body = $('body');
                    tempArea = $('<textarea></textarea>');
                    tempArea.css({
                        position: 'absolute',
                        left: -1000
                    });
                    tempArea.attr('id', id);
                    body.append(tempArea);
                }
                tempArea.focus();

                setTimeout(function() {
                    var clipboardContent = '',
                        paragraphs = tempArea.val().split('\n');
                    for(var i = 0; i < paragraphs.length; i++) {
                        clipboardContent += ['<p>', paragraphs[i], '</p>'].join('');
                    }
                    tempArea.val('');
                    utils.selection.restore(range);
                    d.execCommand('delete');
                    d.execCommand('insertHTML', false, clipboardContent);
                    events.change.call(this);
                }, 500);
            },
            change: function(e) {
                var contentArea = $('#jquery-notebook-content-' + $(this).attr('data-jquery-notebook-id'));
                contentArea.val($(this).html());
                var content = contentArea.val();
                var changeEvent = new CustomEvent('contentChange', { 'detail': { 'content' : content }});
                this.dispatchEvent(changeEvent);
            }
        };





        //options = $.extend({}, $.fn.notebook.defaults, options);
        var defaults = {
            autoFocus: false,
            placeholder: 'Your text here...',
            mode: 'multiline',
            modifiers: ['bold', 'italic', 'underline', 'h1', 'h2', 'ol', 'ul', 'anchor']
        };

        actions.prepare(div, defaults);
        actions.bindEvents(div);
        return div;
}();

  ;/*
 ██████╗██╗     ██╗███████╗███╗   ██╗████████╗
██╔════╝██║     ██║██╔════╝████╗  ██║╚══██╔══╝
██║     ██║     ██║█████╗  ██╔██╗ ██║   ██║   
██║     ██║     ██║██╔══╝  ██║╚██╗██║   ██║   
╚██████╗███████╗██║███████╗██║ ╚████║   ██║   
 ╚═════╝╚══════╝╚═╝╚══════╝╚═╝  ╚═══╝   ╚═╝   
*/
Wu.Client = Wu.Class.extend({

	initialize : function (options) {

		Wu.extend(this, options);
		//Wu.setOptions(this, options);

		// set defaults
		this.options = {};
		this.options.editMode = false;

		// set default active client
		if (!Wu.Util.isObject(Wu.app._activeClient)) {
			//Wu.app._activeClient = this;
			//this.setActive();
		}
	},

	setActive : function () {

		// update url
		this._setUrl();

		// do nothing if already active
		if (Wu.Util.isObject(Wu.app._activeClient)) {
			if (Wu.app._activeClient.uuid == this.uuid) { return; }   
		}

		// set active client
		Wu.app._activeClient = this;

		// refresh projects in editor
		console.log('setting active client');
		Wu.app.SidePane.Projects.enable();  // TODO: probably double, also fired in Sidepane.Clients
		Wu.app.SidePane.Projects.refresh();


	},

	_setUrl : function () {
		var url = '/'+ this.slug + '/';
		Wu.Util.setAddressBar(url);
	},

	update : function (field) {
		var json = {};
		json[field] = this[field];
		json.uuid = this.uuid;
		var string = JSON.stringify(json);

		this._save(string);
	},

	_save : function (string) {
		Wu.save('/api/client/update', string);  // TODO: pgp & callback
	},

	saveNew : function () {
		var options = {
			name : this.name,
			description : this.description,
			keywords : this.keywords
		}
		var json = JSON.stringify(options);
		var editor = Wu.app.SidePane.Clients;


		Wu.Util.postcb('/api/client/new', json, editor._created, this);

	},

	_delete : function () {
		var client = this;

		var json = { 'cid' : client.uuid };               // TODO: delete projects that belong to client too
		json = JSON.stringify(json);

		// post with callback:    path       data    callback   context of cb
		Wu.Util.postcb('/api/client/delete', json, client._deleted, client);
	},

	_deleted : function (client, json) {

		// delete object
		delete Wu.app.Clients[client.uuid];

		// delete in DOM
		var del = Wu.DomUtil.get('editor-clients-container-' + client.uuid);
		Wu.DomUtil.remove(del);

		// set url                      TODO: choose diff client?
		Wu.Util.setAddressBar('/');
	}




});






/*
██████╗ ██████╗  ██████╗      ██╗███████╗ ██████╗████████╗
██╔══██╗██╔══██╗██╔═══██╗     ██║██╔════╝██╔════╝╚══██╔══╝
██████╔╝██████╔╝██║   ██║     ██║█████╗  ██║        ██║   
██╔═══╝ ██╔══██╗██║   ██║██   ██║██╔══╝  ██║        ██║   
██║     ██║  ██║╚██████╔╝╚█████╔╝███████╗╚██████╗   ██║   
╚═╝     ╚═╝  ╚═╝ ╚═════╝  ╚════╝ ╚══════╝ ╚═════╝   ╚═╝   
*/
// abstract class for each project - holds that project
Wu.Project = Wu.Class.extend({

	initialize : function (project, context) {
		      
		// set defaults
		Wu.extend(this, project);
		this.options = { editMode : false };

		// attach to client
		this._attach();

		// create layers 
		this.layerify();

		this.lastSaved = {};
	},

	layerify : function () {
		// console.log('this:', this);

		if (!this.layers) { return; };
		this.layers.forEach(function (elem, i, arr) {

			this.layers[i]._layer = new Wu.GeojsonLayer(elem);

		}, this);
		
		if (this.type == 'geojson') {
			var layer = new Wu.GeojsonLayer(this);
			this.layers.push(layer);
		}
	

	},

	setActive : function () {
  
		// do nothing if already active
		// if (Wu.Util.isObject(Wu.app._activeProject)) {
		//       if (Wu.app._activeProject.uuid == this.uuid) { return; }   
		// }

		// set as active
		Wu.app._activeProject = this;
		
		// set map, editor, header, layermenu                   
		if (Wu.Util.isObject(Wu.app.MapPane)) {
			Wu.app.MapPane.setProject(this);
		} 
		if (Wu.Util.isObject(Wu.app.HeaderPane)) {
			Wu.app.HeaderPane.setProject(this);
		}
		if (Wu.Util.isObject(Wu.app.LayermenuPane)) {   // this is layermeu on the map
			Wu.app.LayermenuPane.setProject(this);  // TODO <= move this to MODELS
		}
		if (Wu.Util.isObject(Wu.app.SidePane)) {
			Wu.app.SidePane.setProject(this);     // layermenu in editor will go here
		}

		// update url
		this._setUrl();

		// update color theme
		this.setColorTheme();

	},

	_setUrl : function () {
		var url = '/';
		url += this._parentClient.slug;
		url += '/';
		url += this.slug;
		Wu.Util.setAddressBar(url);
	},

	// attach to parent client
	_attach : function () {
		var cid = Wu.Util._getParentClientID(this.uuid);
		this._parentClient = Wu.app.Clients[cid]; // client object
	},

	_update : function (field) {
		
		var json = {};
		json[field] = this[field];
		json.uuid = this.uuid;



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

		var string = JSON.stringify(json);
		this._save(string);
		
	},

	

	_save : function (string) {
		console.log('saving...');                                       // TODO: pgp
		Wu.save('/api/project/update', string);                         // TODO: save only if actual changes! saving too much already
	},

	_saveNew : function () {
	       
		var options = {
			name : this.name,
			description : this.description,
			keywords : this.keywords
		}
		var json = JSON.stringify(options);
		
		var editor = Wu.app.SidePane.Projects;
		Wu.Util.postcb('/api/project/new', json, editor._created, this);



	},

	unload : function () {

		Wu.app.MapPane.reset();
		Wu.app.HeaderPane.reset();

	},

	// called by Wu.SidePane.Sources._addLayer
	addLayer : function (source) {

		// add to project
		if (source.type == 'geojson') {
		     
			// add layer to project
			var layer = new Wu.GeojsonLayer(source);       // add to this speciic project
			this.layers.push(layer);        
		}

		if (source.type == 'raster') {

			// add raster layer to project
			var layer = new Wu.RasterLayer(source);       // add to this speciic project
			this.layers.push(layer);   
		}

		// add to layer menu
		
		Wu.app.SidePane.Layers.update(this);

	},

	_delete : function () {
		var project = this;

		var json = { 
			    'pid' : project.uuid,
			    'projectUuid' : project.uuid,
			    'clientUuid' : project._parentClient.uuid
		};
		
		json = JSON.stringify(json);

		console.log('deleting project!')
		console.log(json);

		// post with callback:    path       data    callback   context of cb
		Wu.Util.postcb('/api/project/delete', json, project._deleted, project);
	},

	_deleted : function (project, json) {

		// delete object
		delete Wu.app.Projects[project.uuid];

	       

		// set url                      TODO: choose diff client?
		//Wu.Util.setAddressBar('/');
	},

	saveColorTheme : function () {
		

		// save color theme to project 
		this.colorTheme = savedCSS;
		this._update('colorTheme');

		console.log('saved color theme,', this.colorTheme.length);

	},

	setColorTheme : function () {

		if (!this.colorTheme) return;

		// set global color
		savedCSS = this.colorTheme;

		// inject
		Wu.Util.setColorTheme();

	}

});









											    
// // Source files
// Wu.Source = Wu.Class.extend({

// 	initialize : function (record, context) {
	      
// 		// set defaults
// 		Wu.extend(this, record);
// 		this.options = { editMode : false };
		
// 		// create layers
// 		//this.layerify();

// 	}

       
// 	// layerify : function () {

// 	//         this.layers = [];
		
// 	//         if (this.type == 'geojson') {
// 	//                 var layer = new Wu.GeojsonLayer(this);
// 	//                 this.layers.push(layer);
// 	//         }
// 	// }
	
// });




// /*
// */
// // layermenu object, created from layermenu stored in projects
// Wu.Layermenu = Wu.Class.extend({

// 	initialize : function () {
// 		console.log('initialize Wu.Layermenu object');

// 	},

// 	set : function (project) {


// 	},

// 	reset : function () {


// 	},

// 	create : function () {


// 	},


// 	save : function () {

// 	}



// });


// Wu.User = Wu.Class.extend({

// 	initialize : function () {
// 		// console.log('new user');

// 		Wu.setOptions(this, Wu.app.options.json.user);
// 		// console.log(this);


// 	}
// });
;;// ███████╗██╗██████╗ ███████╗██████╗  █████╗ ███╗   ██╗███████╗
// ██╔════╝██║██╔══██╗██╔════╝██╔══██╗██╔══██╗████╗  ██║██╔════╝
// ███████╗██║██║  ██║█████╗  ██████╔╝███████║██╔██╗ ██║█████╗  
// ╚════██║██║██║  ██║██╔══╝  ██╔═══╝ ██╔══██║██║╚██╗██║██╔══╝  
// ███████║██║██████╔╝███████╗██║     ██║  ██║██║ ╚████║███████╗
// ╚══════╝╚═╝╚═════╝ ╚══════╝╚═╝     ╚═╝  ╚═╝╚═╝  ╚═══╝╚══════╝
                                                             
// The SidePane menubar
Wu.SidePane = Wu.Class.extend({


	initialize : function (options) {
		
		this.options = options || Wu.app.options;

		this.initContainer();
		this.initContent();
		this.render();     
		
		return this;   
	},

	
	initContainer: function () {
		var className = 'q-editor-container ct1';
		this._container = Wu.DomUtil.create('div', className, Wu.app._appPane);
		this.open = true;

		// toggle panes
		Wu.app._paneToggle = Wu.DomUtil.createId('div', 'menucloser', this._container);		// (J)
		Wu.DomUtil.addClass(Wu.app._paneToggle, 'pane-open');					// (J)
		Wu.DomEvent.on(Wu.app._paneToggle, 'click', this.togglePane, this);          		// (J)
	},


	initContent : function () {
		
		// menu pane
		var className = 'q-editor-menu ct0';
		Wu.app._editorMenuPane = Wu.DomUtil.create('menu', className, this._container); 

		// content pane
		var className = 'q-editor-content ct1';
		Wu.app._editorContentPane = Wu.DomUtil.create('content', className, this._container); 

		// menuslider
		Wu.app._menuSlider = Wu.DomUtil.createId('div', 'menuslider', this._container);
		Wu.DomUtil.addClass(Wu.app._menuSlider, 'ct1');
		
	},
	
	render : function () {

		// fill in options.editor if blank
		if (!Wu.Util.isObject(this.options.editor)) {
			this.options.editor = { render : this.options.editor || true};
		}

		// render all editor elements
		if (this.options.editor.clients != false) {             // will go out
			this.Clients = new Wu.SidePane.Clients();
		}

		// render projects everytime
		this.Projects = new Wu.SidePane.Projects(this);


		if (this.options.editor.map != false) {
			this.Map = new Wu.SidePane.Map();
		}

		if (this.options.editor.sources != false) {
			this.Layers = new Wu.SidePane.Layers();
		}

		if (this.options.editor.documentsPane != false) {
			this.Documents = new Wu.SidePane.Documents();
		}

		if (this.options.editor.downloadsPane != false) {
			this.DataLibrary = new Wu.SidePane.DataLibrary();
		}

		// if user has management access
		if (this.options.editor.users != false) {
			this.Users = new Wu.SidePane.Users();
		}

	},


	setProject : function (project) {

		// update content
		this.Map.updateContent(project);
		this.Layers.updateContent(project);
		this.Documents.updateContent(project);
		this.DataLibrary.updateContent(project);

		//this.Header._updateContent(project);
		//this.Users.updateContent(project);

	},

	// display the relevant panes
	refresh : function (menus) {

		// all panes
		var all = ['Clients', 'Projects', 'Map', 'Layers', 'Documents', 'Users', 'DataLibrary'];
		
		// panes to active
		menus.forEach(function (elem, i, arr) {
			if (!Wu.app.SidePane[elem]) Wu.app.SidePane[elem] = new Wu.SidePane[elem];
			Wu.app.SidePane[elem].enable();
		}, this);

		// panes to deactivate
		var off = all.diff(menus);
		off.forEach(function (elem, i, arr) {
			Wu.app.SidePane[elem].disable(); // alt remove?
		}, this)

	},

	// open/close 
	togglePane : function () {
		if (!Wu.app._activeProject) return;
		if (this.open) return this.closePane();
		this.openPane();

		// refresh map size
		Wu.app._map.invalidateSize();	// on timer?
	},


	// close sidepane
	closePane : function () {
		if (!this.open) return;
		this.open = false;

		this._container.style.width = '100px';
		Wu.app.MapPane._setLeft(100);
		Wu.app.HeaderPane._setLeft(100);
		Wu.DomUtil.removeClass(Wu.app._paneToggle, 'pane-open');
	},

	// open sidepane
	openPane : function () {
		if (this.open) return;
		this.open = true;

		this._container.style.width = '400px';
		Wu.app.MapPane._setLeft(400);
		Wu.app.HeaderPane._setLeft(400);
		Wu.DomUtil.addClass(Wu.app._paneToggle, 'pane-open');
	},

	// set subheaders with client/project
	setSubheaders : function () {
		var client = Wu.app._activeClient;
		var project = Wu.app._activeProject;

		// if active client 
		if (!client) return;
		Wu.DomUtil.get('h4-projects-client-name').innerHTML = client.name; 		// set projects' subheader
		Wu.DomUtil.get('h4-map-configuration-client-name').innerHTML = client.name; 	// set map configuration subheader
		Wu.DomUtil.get('h4-layers-client-name').innerHTML = client.name; 		// set layers subheader
		
		// if active project
		if (!project) return;
		Wu.DomUtil.get('h4-map-configuration-project-name').innerHTML = project.name; 	// set map configuration subheader
		Wu.DomUtil.get('h4-layers-project-name').innerHTML = project.name; 		// set layers subheader
	}
});










/*
██╗████████╗███████╗███╗   ███╗
██║╚══██╔══╝██╔════╝████╗ ████║
██║   ██║   █████╗  ██╔████╔██║
██║   ██║   ██╔══╝  ██║╚██╔╝██║
██║   ██║   ███████╗██║ ╚═╝ ██║
╚═╝   ╚═╝   ╚══════╝╚═╝     ╚═╝
*/                                                                                                         
// general item template
Wu.SidePane.Item = Wu.Class.extend({
       
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

	addHooks : function () {

		// menu items bindings
		Wu.DomEvent.on(this._menu, 'click', this._activate, this);          // click
		Wu.DomEvent.on(this._menu, 'mouseenter', this._mouseenter, this);   // mouseEnter
		Wu.DomEvent.on(this._menu, 'mouseleave', this._mouseleave, this);   // mouseLeave
	},

	_mouseenter : function (e) {
		Wu.DomUtil.addClass(this._menu, 'red');
	},

	_mouseleave : function (e) {
		Wu.DomUtil.removeClass(this._menu, 'red');
	},

	_activate : function (e) {
	       
		// set active menu
		var prev = Wu.app._activeMenu || false;
		Wu.app._activeMenu = this;
		    
		// active content                       
		Wu.app._active = this._content;                 

		// check swipe action    (j)
		this.checkSwipe(prev);

		// add active to menu
		if (prev) { Wu.DomUtil.removeClass(prev._menu, 'active'); }
		Wu.DomUtil.addClass(this._menu, 'active');

		// call deactivate on previous for cleanup
		if (prev) { prev.deactivate(); };

		// update pane
		//this._update();   //todo: refactor: now it's _update, _updateContent, refresh all over tha place
	},

	// check swipe of sidepane on selecting menu item, by jorgen
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
	
		// set vars
		var swypefrom = prev._content;
		var swypeto = Wu.app._active;               

		// if same, do nothing
		if (swypefrom == swypeto) return;

		// Update the slider on the left    
		var h = 70;
		var menuslider = Wu.DomUtil.get('menuslider');
		   
		// get classlist
		var classy = this._menu.classList;
	
		// check which 
		if (_.contains(classy, 'clients')) {
			menuslider.style.top = '0px';
			Wu.app.SidePane._container.style.width = '400px';
		}

		if (_.contains(classy, 'projects')) {
			menuslider.style.top = h * 1 + 'px';
			Wu.app.SidePane._container.style.width = '400px';
		}
	    
		if (_.contains(classy, 'map')) {
			menuslider.style.top = h * 2 + 'px';
			Wu.app.SidePane._container.style.width = '400px';
		}
	    
		if (_.contains(classy, 'layers')) {
			menuslider.style.top = h * 3 + 'px';
			Wu.app.SidePane._container.style.width = '400px';
		}
	    
		if (_.contains(classy, 'documents')) {
			menuslider.style.top = h * 4 + 'px';
			Wu.app.SidePane._container.style.width = '100%';
		}
	    
		if (_.contains(classy, 'dataLibrary')) {
			menuslider.style.top = h * 5 + 'px';
			Wu.app.SidePane._container.style.width = '100%';
		}
	    
		if (_.contains(classy, 'users')) {
			menuslider.style.top = h * 6 + 'px';
			Wu.app.SidePane._container.style.width = '100%';
		}
				
		
		// Find out what to swipe from
		// The Sliders Container
		var _content_container = document.getElementsByTagName('menu')[0];
	    
		// Create some vars
		var swipethis, swfrom, swto, swipeOut, swipeIn;
		
		// Find all the swipeable elements....
		var _under_dogs = _content_container.getElementsByTagName('div');
				
		// Find what position the swipe from and to is in the array
		for ( var a = 0; a<_under_dogs.length;a++) {
			if ( _under_dogs[a] == prev._menu ) { swfrom = a; }                 
			if ( _under_dogs[a] == this._menu ) { swto = a; }
		}
		
		// Check if we're swiping up or down
		if ( swfrom > swto ) {
			swipeOut = 'swipe_out';
			swipeIn = 'swipe_in';
		} else {
			swipeOut = 'swipe_out_up';
			swipeIn = 'swipe_in_up';
		}               
		    
		// Hide the Deactivated Pane
		if (Wu.app._active) {
			    
			Wu.DomUtil.addClass(swypefrom, swipeOut);                   
					    
			// Remove classes from the swiped out element
			setTimeout(function(){
				Wu.DomUtil.removeClass(swypefrom, 'show');
				Wu.DomUtil.removeClass(swypefrom, swipeOut);
			}, 300);                                
		};
					
		// Swipe this IN
		Wu.DomUtil.addClass(swypeto, 'show');
		Wu.DomUtil.addClass(swypeto, swipeIn);              
		
		setTimeout(function(){
			Wu.DomUtil.removeClass(swypeto, swipeIn);   
		}, 300);
			
	},


	deactivate : function () {
		console.log('blank deactiavte');
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

		// wrapper 
		this._container = Wu.DomUtil.create('div', 'editor-wrapper ct13', this._content);
	},

	initContent : function () {

	},

	updateContent : function (project) {

		// console.log('updateing ' + this.type + ' content in Editor');
		// console.log(project);

	},

	_addHook : function (elem, event, fn, uuid) {
		Wu.DomEvent.on(elem, event, fn, uuid);
	},


	disable : function () {

		// disable click
		Wu.DomEvent.off(this._menu, 'click', this._activate, this); 

		// add disabled class
		Wu.DomUtil.addClass(this._title, 'disabled');
	},

	enable : function () {

		// enable click
		Wu.DomEvent.on(this._menu, 'click', this._activate, this); 

		// remove disabled class
		Wu.DomUtil.removeClass(this._title, 'disabled');
	},

	remove : function () {
		delete this._menu;
		delete this._content;
		delete this;
	}

});











/*
 ██████╗██╗     ██╗███████╗███╗   ██╗████████╗
██╔════╝██║     ██║██╔════╝████╗  ██║╚══██╔══╝
██║     ██║     ██║█████╗  ██╔██╗ ██║   ██║   
██║     ██║     ██║██╔══╝  ██║╚██╗██║   ██║   
╚██████╗███████╗██║███████╗██║ ╚████║   ██║   
 ╚═════╝╚══════╝╚═╝╚══════╝╚═╝  ╚═══╝   ╚═╝                                         							 
*/
// Clients
Wu.SidePane.Clients = Wu.SidePane.Item.extend({

	type : 'clients',

	initialize : function () {
		Wu.SidePane.Item.prototype.initialize.call(this)

		// active by default
		Wu.app._active = this._content;
		this._activate();      
	},

	initContent : function () {

		// container
		this._container.innerHTML = ich.editorClients();
		var clientsContainer = this._clientsContainer = Wu.DomUtil.get('editor-clients');
	      
		// new clients button
		var newClientButton = Wu.DomUtil.create('div', 'smap-button-white new-client ct11 ct16 ct18', this._clientsContainer);
		newClientButton.innerHTML = 'Create New Client';
		this._addHook(newClientButton, 'click', this._createNew, this);

		// clients
		this.options.json.clients.forEach(function(client, i, arr) {     
			this._create(client);
		}, this);


	},

	_create : function (client) {
		var clientData = {
			clientName : client.name,
			clientLogo : client.header.logo,
			clientID   : client.uuid
		}
		
		// append client to container
		Wu.DomUtil.prependTemplate(this._clientsContainer, ich.editorClientsItem(clientData));

		// set hook for selecting client
		var target = Wu.DomUtil.get('editor-clients-container-' + client.uuid);
		this._addHook(target, 'click', this.select, Wu.app.Clients[client.uuid]);
		this._addHook(target, 'click', this._select, target);
		
		// set hook for edit toggle
		var toggle = Wu.DomUtil.get('editor-client-edit-toggle-' + client.uuid);
		this._addHook(toggle, 'click', this.toggleEdit, Wu.app.Clients[client.uuid]);

		// set hook for delete button           TODO if privs
		var del = Wu.DomUtil.get('editor-client-delete-' + client.uuid);
		this._addHook(del, 'click', this.remove, Wu.app.Clients[client.uuid]);

	},

	remove : function () {
		var client = this;
		if (window.confirm('Are you sure you want to DELETE the client ' + client.name + '?')) {
			client._delete();  
		}
	},


	_createNew : function () {

		// add new client box
		var clientData = {
			clientName : 'New client'
		}
			
		// prepend client to container
		Wu.DomUtil.prependTemplate(this._clientsContainer, ich.editorClientsNew(clientData));

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
		console.log('Client name OK.');
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
		client.saveNew(); 
	},

	_created : function(client, json) {       // this is the http callback        
		var editor = Wu.app.SidePane.Clients;
		var options = JSON.parse(json);
	       
		// update Client object
		Wu.extend(client, options);
		Wu.app.Clients[client.uuid] = client;

		// remove edit box
		var old = Wu.DomUtil.get('editor-clients-container-new');
		Wu.DomUtil.remove(old);
		
		// create client in DOM
		editor._create(client);
	       
		// set active
		client.setActive();
	},

	toggleEdit : function (e) { // this = client

		// stop propagation
		if (e) { Wu.DomEvent.stop(e); }

		var client = this;
		var container = Wu.DomUtil.get('editor-client-edit-wrapper-' + client.uuid);

		if (client.options.editMode) {
		       
			// hide dom
			container.style.display = 'none';
			client.options.editMode = false;
		} else {
		       
			// show dom
			container.style.display = 'block';
			client.options.editMode = true;
		}
	},

	_addHook : function (elem, event, fn, uuid) {
		Wu.DomEvent.on(elem, event, fn, uuid);
	},

	select : function (e) {
		var client = this;

		// skip if already selected
		//if (Wu.app._activeClient == client) { return; }

		// set active
		client.setActive(); // this = Wu.Client

		// reset active project
		if (Wu.app._activeProject) Wu.app._activeProject.unload();
		
		// refresh SidePane
		Wu.app.SidePane.Clients.refreshSidePane();
		
		// activate projects pane
		Wu.app.SidePane.Projects._activate();

		// set client name in subheaders
		Wu.app.SidePane.setSubheaders();

	},


	refreshSidePane : function () {

		// refresh SidePane
		var menu = ['Clients', 'Projects'];
		
		// if user got manager privs, show USERS settings
		//var priv = Wu.app.options.json.user.privileges.create;
		//if (priv.users) menu.push('Users'); 

		menu.push('Users');

		// refresh
		Wu.app.SidePane.refresh(menu);

		// update SidePane.Users
		Wu.app.SidePane.Users.update();
	},

	_select : function () {
		var that = Wu.app.SidePane.Clients;   
		if (that._previousSelect) Wu.DomUtil.removeClass(that._previousSelect, 'active-client');
		
		Wu.DomUtil.addClass(this, 'active-client');
		that._previousSelect = this;
	},

	selectProject : function (e) {
		var project = this;
		project.setActive();               // Wu.Project.setActive();
	},

	disable : function () {
		// noop
	}


});




/*
██████╗ ██████╗  ██████╗      ██╗███████╗ ██████╗████████╗███████╗
██╔══██╗██╔══██╗██╔═══██╗     ██║██╔════╝██╔════╝╚══██╔══╝██╔════╝
██████╔╝██████╔╝██║   ██║     ██║█████╗  ██║        ██║   ███████╗
██╔═══╝ ██╔══██╗██║   ██║██   ██║██╔══╝  ██║        ██║   ╚════██║
██║     ██║  ██║╚██████╔╝╚█████╔╝███████╗╚██████╗   ██║   ███████║
╚═╝     ╚═╝  ╚═╝ ╚═════╝  ╚════╝ ╚══════╝ ╚═════╝   ╚═╝   ╚══════╝
*/
Wu.SidePane.Projects = Wu.SidePane.Item.extend({

	type : 'projects',

	initContent : function () {
		
		// template        
		this._container.innerHTML = ich.editorProjectsContainer();

		// sort by buttons
		this._sortleft = Wu.DomUtil.get('editor-projects-sort-by-left');
		this._sortright = Wu.DomUtil.get('editor-projects-sort-by-right');
		this._sortIsList = false;

		// new project button
		var newProjectButton = Wu.DomUtil.get('new-project-button');
		Wu.DomEvent.on(newProjectButton, 'click', this._createNew, this);

		// set panes
		this._projectsContainer = Wu.DomUtil.get('editor-projects-container');


		this._projects = {};
		this._editMode = false;
		
		// additional hooks
		this._addHooks();

		// default 
		this._doSortRight();	// TODO, buggy

	       
	},

	// debugClosePane : function () {
	// 	console.log('debugClosePane');
	// 	Wu.app.SidePane.closePane();
	// },

	_addHooks : function () {
		// list or box view for projects
		Wu.DomEvent.on(this._sortleft, 'click', this._doSortLeft, this);
		Wu.DomEvent.on(this._sortright, 'click', this._doSortRight, this);
	},

	_doSortRight : function () {
		// return if already sorted as list               
		if (this._sortIsList) return;

		// swipe elements left
		for (p in this._projects) {
			var div = this._projects[p];
			Wu.DomUtil.addClass(div, 'swipe_left');
		}

		// fasten elements after swipe
		var that = this;
		setTimeout(function(){
			for (p in that._projects) {
				var div = that._projects[p];
				Wu.DomUtil.removeClass(div, 'swipe_left');
				Wu.DomUtil.addClass(div, 'list');
				Wu.DomUtil.removeClass (div, 'box');
			}
			Wu.DomUtil.addClass(that._projectsContainer, 'list_view');
		}, 150);        

		// set direction
		this._sortIsList = true;
	},

	_doSortLeft : function () {
		// return if already sorted as box
		if (!this._sortIsList) return;

		// swipe elements left
		for (p in this._projects) {
			var div = this._projects[p];
			Wu.DomUtil.addClass(div, 'swipe_left');
		}

		// fastene elements after swipe
		var that = this;
		setTimeout(function(){
			for (p in that._projects) {
				var div = that._projects[p];
				Wu.DomUtil.removeClass(div, 'swipe_left');
				Wu.DomUtil.removeClass(div, 'list');
				Wu.DomUtil.addClass (div, 'box');
			}
			Wu.DomUtil.removeClass(that._projectsContainer, 'list_view');
		}, 150);   

		// set current direction
		this._sortIsList = false;
	},

	
	refresh : function () {

		var client = Wu.app._activeClient;
		
		// reset container
		this._projectsContainer.innerHTML = '';

		// fill in with projects that belong to active client
		this._projects = {};
		for (item in Wu.app.Projects) { 
			if (client.projects.indexOf(item) > -1) {
				this._create(Wu.app.Projects[item]);
			} 
		};

	},

	select : function () {
		var project = this;

		// set project active
		project.setActive();        // Wu.Project.setActive();

		// set active in pane
		var pro = Wu.app.SidePane.Projects._projects;
		for (p in pro) Wu.DomUtil.removeClass(pro[p], 'active');
		Wu.DomUtil.addClass(pro[project.uuid], 'active');

		// refresh SidePane
		var menu = ['Clients', 'Projects', 'Documents', 'Layers', 'DataLibrary'];

		// if user got write access, show MAP settings
		var userAccess = Wu.app.User.options.access.write.projects;                     // new access 
		if (userAccess.indexOf(project.uuid) > -1) menu.push('Map');
		


		// if user got manager privs, show USERS settings
		var priv = Wu.app.options.json.user.access.create;
		if (priv.users) menu.push('Users');

		Wu.app.SidePane.refresh(menu);

		// set client name in sidepane subheaders
		Wu.app.SidePane.setSubheaders();

	},

       

	sortProjects : function (e, bool) {

		console.log('sort!');
		console.log(this);
		console.log(e);
		console.log(bool);
	},


	_createNew : function () {

		// add new project box
		var projectData = {
			projectName : 'New project'
		}
			
		// prepend client to container
		Wu.DomUtil.prependTemplate(this._projectsContainer, ich.editorProjectsNew(projectData), true);

		// set hooks: confirm button
		var target = Wu.DomUtil.get('editor-project-confirm-button');
		this._addHook(target, 'click', this._confirm, this);

		// cancel button
		var target = Wu.DomUtil.get('editor-project-cancel-button');
		this._addHook(target, 'click', this._cancel, this);

		// set hooks: writing name                                      // TODO: unique names on projects?
		//var name = Wu.DomUtil.get('editor-project-name-new');
		//this._addHook(name, 'keyup', this._checkSlug, this);

	},

	_cancel : function () {
		// remove edit box
		var old = Wu.DomUtil.get('editor-projects-container-new');
		Wu.DomUtil.remove(old);
	},

	_confirm : function () {

		// get client vars
		var name = Wu.DomUtil.get('editor-project-name-new').value;
		var description = Wu.DomUtil.get('editor-project-description-new').value;
		var keywords = Wu.DomUtil.get('editor-project-keywords-new').value;
		
		var options = {
			name : name,
			description : description,
			keywords : keywords
		}

		// create new project with options, and save
		var project = new Wu.Project(options);
		project._saveNew(); 
	},

	_create : function (item) {

		// create view
		var data = {
			projectName : item.name || '',
			projectLogo : item.header.logo || '',
			uuid        : item.uuid 
		}
		var target = Wu.DomUtil.create('div', 'editor-projects-item ct0');
		target.setAttribute('uuid', item.uuid);
		target.innerHTML = ich.editorProjectsItem(data);

		this._projects[item.uuid] = target;
		this._projectsContainer.appendChild(target);

		// add hook for edit button
		var editButton = Wu.DomUtil.get('project-edit-button-' + item.uuid);
		Wu.DomEvent.on(editButton, 'mousedown', this.toggleEdit, this);
		Wu.DomEvent.on(editButton, 'click', Wu.DomEvent.stop, this);
		
		// when clicking on project box               pass the Project as this
		Wu.DomEvent.on(target, 'click', this.select, Wu.app.Projects[item.uuid]);

	},

	toggleEdit : function (e) {

		// stop propagation
		if (e) Wu.DomEvent.stop(e); 

		var uuid = e.target.getAttribute('uuid');
		var container = Wu.DomUtil.get('editor-project-edit-wrapper-' + uuid);
		var project = Wu.app.Projects[uuid];
		
		// close all other editors
		if (this._editorPane) Wu.DomUtil.remove(this._editorPane);

		// toggle edit mode
		this._editMode = !this._editMode;

		// close if second click
		if (!this._editMode) return;
		   
		// create editor div
		project._editorPane = this._editorPane = Wu.DomUtil.create('div', 'editor-project-edit-super-wrap ct11 ct17');
		var html = ich.editorProjectEditWrapper({
			'uuid' : uuid, 
			'name' : project.name, 
			'description' : project.description,
			'keywords' : project.keywords
		});
		project._editorPane.innerHTML = html;

		// find out if project elem is odd or even in list
		var i = this._projects[uuid].parentNode.childNodes;
		for (var n = 0; n < i.length; n++) {
			if (i[n].getAttribute('uuid') == uuid) {
				var num = n;
				var odd = num % 2;
			}
		}

		// insert editor into list
		if (!odd) {
			// get referencenode
			var refnum = parseInt(num) + 1;
			if (refnum > i.length-1) refnum = i.length-1;
			var referenceNode = i[refnum];

			// insert editor div
			referenceNode.parentNode.insertBefore(project._editorPane, referenceNode.nextSibling);
			Wu.DomUtil.addClass(project._editorPane, 'left');
		
		} else {
			// get referencenode
			var refnum = num;
			var referenceNode = i[refnum];

			// insert editor div
			referenceNode.parentNode.insertBefore(project._editorPane, referenceNode.nextSibling);
			Wu.DomUtil.addClass(project._editorPane, 'right');
		}


		// get elements
		this._editName = Wu.DomUtil.get('editor-project-name-' + uuid);
		this._editDescription = Wu.DomUtil.get('editor-project-description-' + uuid);
		this._editKeywords = Wu.DomUtil.get('editor-project-keywords-' + uuid);
		this._deleteButton = Wu.DomUtil.get('editor-project-delete-' + uuid);


		// add hooks
		Wu.DomEvent.on(this._editName, 'keydown blur', function (e) {
			this.autosave(project, 'name');
		}, this);

		Wu.DomEvent.on(this._editDescription, 'keydown blur', function (e) {    // todo: will drop save sometimes if blur < 500ms
			this.autosave(project, 'description');
		}, this);

		Wu.DomEvent.on(this._editKeywords, 'keydown blur', function (e) {
			this.autosave(project, 'keywords');
		}, this);

		Wu.DomEvent.on(this._deleteButton, 'mousedown', function (e) {
			this._delete(project);
		}, this);

	},

	_delete : function (project) {
		
		// confirm dialogue, todo: create stylish confirm
		if (confirm('Are you sure you want to delete project "' + project.name + '"?')) {    
		
			// delete project object
			project._delete();
		
			// delete in DOM
			var del = this._projects[project.uuid];
			Wu.DomUtil.remove(del);
			if (this._editorPane) Wu.DomUtil.remove(this._editorPane);
		}
	},

	autosave : function (project, key) {
		var that = this;
		clearTimeout(this._saving);

		// save after 500ms of inactivity
		this._saving = setTimeout(function () {
			that.saveText(project, key);
		}, 500);

	},

	saveText : function (project, key) {
		project[key] = Wu.DomUtil.get('editor-project-' + key + '-' + project.uuid).value;
		project._update(key);
	},


	_created : function (project, json) {

		var editor = Wu.app.SidePane.Projects;
		var options = JSON.parse(json);
	       
		// update Project object
		Wu.extend(project, options);
		Wu.app.Projects[project.uuid] = project;

		// remove edit box
		var old = Wu.DomUtil.get('editor-projects-container-new');
		Wu.DomUtil.remove(old);
		
		// create client in DOM
		editor._create(project);
	       
		// set active
		project.setActive();

		// add access to User (locally)
		Wu.app.User.options.access.write.projects.push(project.uuid);
		Wu.app.User.options.access.read.projects.push(project.uuid);
		Wu.app.User.options.access.manage.projects.push(project.uuid);

		// set parent client
		Wu.app._activeClient.projects.push(project.uuid);
		Wu.app._activeClient.update('projects');
	}
});














	 










/*
███╗   ███╗ █████╗ ██████╗ 
████╗ ████║██╔══██╗██╔══██╗
██╔████╔██║███████║██████╔╝
██║╚██╔╝██║██╔══██║██╔═══╝ 
██║ ╚═╝ ██║██║  ██║██║     
╚═╝     ╚═╝╚═╝  ╚═╝╚═╝     
*/
Wu.SidePane.Map = Wu.SidePane.Item.extend({

	type : 'map',

	initContent : function () {

		// shorthand 
		this.app = Wu.app;

		// content to template
		this._container.innerHTML = ich.editorMapBaseLayer();
	  
		// set panes
		this._panes = {};

		// map baselayer
		this._panes.baselayerWrap = Wu.DomUtil.get('editor-map-baselayer-wrap');

		// map bounds
		this._panes.boundsMore         	= Wu.DomUtil.get('editor-map-bounds-more');
		this._panes.boundsOuter        	= Wu.DomUtil.get('editor-map-bounds-coordinates');
		this._panes.boundsInner        	= Wu.DomUtil.get('map-bounds-inner');
		this._boundsToggled            	= false;
		this._panes.bounds             	= Wu.DomUtil.get('editor-map-bounds');
		this._panes.boundsNELatValue   	= Wu.DomUtil.get('editor-map-bounds-NE-lat-value');
		this._panes.boundsNELngValue   	= Wu.DomUtil.get('editor-map-bounds-NE-lng-value');
		this._panes.boundsSWLatValue   	= Wu.DomUtil.get('editor-map-bounds-SW-lat-value');
		this._panes.boundsSWLngValue   	= Wu.DomUtil.get('editor-map-bounds-SW-lng-value');

		// map position
		this._panes.initPosMore         = Wu.DomUtil.get('editor-map-initpos-more');
		this._panes.initPosOuter        = Wu.DomUtil.get('editor-map-initpos-coordinates');
		this._panes.initPosInner        = Wu.DomUtil.get('map-initpos-inner');
		this._initPosToggled            = false;
		this._panes.initPos             = Wu.DomUtil.get('editor-map-initpos-button');
		this._panes.initPosLatValue     = Wu.DomUtil.get('editor-map-initpos-lat-value');
		this._panes.initPosLngValue     = Wu.DomUtil.get('editor-map-initpos-lng-value');
		this._panes.initPosZoomValue    = Wu.DomUtil.get('editor-map-initpos-zoom-value');

		// map controls
		this._panes.controlsWrap                =  Wu.DomUtil.get('editor-map-controls-wrap').parentNode.parentNode;
		this._panes.controlZoom                 =  Wu.DomUtil.get('map-controls-zoom').parentNode.parentNode;
		this._panes.controlDraw                 =  Wu.DomUtil.get('map-controls-draw').parentNode.parentNode;
		this._panes.controlInspect              =  Wu.DomUtil.get('map-controls-inspect').parentNode.parentNode;
		this._panes.controlDescription          =  Wu.DomUtil.get('map-controls-description').parentNode.parentNode;
		this._panes.controlLayermenu            =  Wu.DomUtil.get('map-controls-layermenu').parentNode.parentNode;
		this._panes.controlLegends              =  Wu.DomUtil.get('map-controls-legends').parentNode.parentNode;
		this._panes.controlMeasure              =  Wu.DomUtil.get('map-controls-measure').parentNode.parentNode;
		this._panes.controlGeolocation          =  Wu.DomUtil.get('map-controls-geolocation').parentNode.parentNode;
		this._panes.controlVectorstyle          =  Wu.DomUtil.get('map-controls-vectorstyle').parentNode.parentNode;
		this._panes.controlMouseposition        =  Wu.DomUtil.get('map-controls-mouseposition').parentNode.parentNode;
	},

	_activate : function () {
		Wu.SidePane.Item.prototype._activate.call(this);
		this._update();

	},

	addHooks : function () {
		Wu.SidePane.Item.prototype.addHooks.call(this)

		// click event on buttons
		Wu.DomEvent.on( this._panes.bounds,   'click', this._setBounds,    this );
		Wu.DomEvent.on( this._panes.initPos,  'click', this._setInitPos,   this );
	       
		// edit dropdowns
		Wu.DomEvent.on( this._panes.initPosMore, 'mousedown', this._toggleInitPosDropdown, this);
		Wu.DomEvent.on( this._panes.boundsMore, 'mousedown', this._toggleBoundsDropdown, this);

		// css effects on buttons
		Wu.DomEvent.on( this._panes.initPos,  'mousedown',      this._buttonMouseDown,  this );
		Wu.DomEvent.on( this._panes.initPos,  'mouseup',        this._buttonMouseUp,    this );
		Wu.DomEvent.on( this._panes.initPos,  'mouseleave',     this._buttonMouseUp,    this );
		Wu.DomEvent.on( this._panes.bounds,   'mousedown',      this._buttonMouseDown,  this );
		Wu.DomEvent.on( this._panes.bounds,   'mouseup',        this._buttonMouseUp,    this );
		Wu.DomEvent.on( this._panes.bounds,   'mouseleave',     this._buttonMouseUp,    this );

		/// map controls
		Wu.DomEvent.on( this._panes.controlZoom,        'mousedown click', this.toggleControl, this);
		Wu.DomEvent.on( this._panes.controlDraw,        'mousedown click', this.toggleControl, this);
		Wu.DomEvent.on( this._panes.controlInspect,     'mousedown click', this.toggleControl, this);
		Wu.DomEvent.on( this._panes.controlDescription, 'mousedown click', this.toggleControl, this);
		Wu.DomEvent.on( this._panes.controlLayermenu,   'mousedown click', this.toggleControl, this);
		Wu.DomEvent.on( this._panes.controlLegends,     'mousedown click', this.toggleControl, this);
		Wu.DomEvent.on( this._panes.controlMeasure,     'mousedown click', this.toggleControl, this);
		Wu.DomEvent.on( this._panes.controlGeolocation, 'mousedown click', this.toggleControl, this);
		Wu.DomEvent.on( this._panes.controlVectorstyle, 'mousedown click', this.toggleControl, this);
		Wu.DomEvent.on( this._panes.controlMouseposition, 'mousedown click', this.toggleControl, this);

	},

	_toggleInitPosDropdown : function (e) {
		if ( !this._initPosToggled ) {
			this._initPosToggled = true;
			var h = this._panes.initPosInner.offsetHeight + 15;
			this._panes.initPosOuter.style.height = h + 'px';                                  
			Wu.DomUtil.addClass(this._panes.initPosMore, 'rotate180');
		} else {
			this._initPosToggled = false;
			this._panes.initPosOuter.style.height = '0px';                                         
			Wu.DomUtil.removeClass(this._panes.initPosMore, 'rotate180');
		}
	},

	_toggleBoundsDropdown : function (e) {
		if ( !this._boundsToggled ) {
			this._boundsToggled = true;
			var h = this._panes.boundsInner.offsetHeight + 15;
			this._panes.boundsOuter.style.height = h + 'px';                                  
			Wu.DomUtil.addClass(this._panes.boundsMore, 'rotate180');
		} else {
			this._boundsToggled = false;
			this._panes.boundsOuter.style.height = '0px';                                         
			Wu.DomUtil.removeClass(this._panes.boundsMore, 'rotate180');
		}
	},

	toggleControl : function (e) {
		
		// prevent default checkbox behaviour
		if (e.type == 'click') return Wu.DomEvent.stop(e);
		
		// get type (zoom, draw, etc.)
		var item = e.target.getAttribute('which');

		// get checkbox
		var target = Wu.DomUtil.get('map-controls-' + item);

		// do action (eg. toggleControlDraw);
		var on = !target.checked;
		var enable = 'enable' + item.camelize();
		var disable = 'disable' + item.camelize();

		// toggle
		if (on) {
			// enable control on map
			Wu.app.MapPane[enable]();

			// enable control in menu
			this.enableControl(item);
		} else {
			// disable control on map
			Wu.app.MapPane[disable]();
			
			// disable control in menu
			this.disableControl(item);
		}

		// save changes to project
		this.project.controls[item] = on;
		this.project._update('controls');

	},


	disableControl : function (type) {
		
		// get vars
		var target = Wu.DomUtil.get('map-controls-' + type); // checkbox
		var parent = Wu.DomUtil.get('map-controls-title-' + type).parentNode; // div that gets .active 
		var map = Wu.app._map;  // map

		// toggle check and active class
		Wu.DomUtil.removeClass(parent, 'active');
		target.checked = false;
	},

	enableControl : function (type) {
		
		// get vars
		var target = Wu.DomUtil.get('map-controls-' + type); // checkbox
		var parent = Wu.DomUtil.get('map-controls-title-' + type).parentNode; // div that gets .active 
		var map = this.app._map;  // map

		// toggle check and active class
		Wu.DomUtil.addClass(parent, 'active');
		target.checked = true;
	},

	_buttonMouseDown : function (e) {
		Wu.DomUtil.addClass(e.target, 'btn-info');
	},

	_buttonMouseUp : function (e) {
		Wu.DomUtil.removeClass(e.target, 'btn-info');
	},

	_setUrl : function (e) {

		// get actual Project object
		var project = Wu.app._activeProject;

		// if no active project, do nothing
		if (!project) { console.log('_activeProejct == undefined'); return; }

		var url = e.target.value;

		// save local
		project.map.baseLayer.url = url;

		// save to db
		project._update('map');

	},

	_setProvider : function (e) {
		console.log('set provider');
		console.log(e);

		// get actual Project object
		var project = Wu.app._activeProject;

		// if no active project, do nothing
		if (!project) { console.log('_activeProejct == undefined'); return; }

		var prov = e.target.value;

		// save local
		project.map.baseLayer.provider = prov;

		// save to db
		project._update('map');

	},

	_setTileType : function (e) {
		console.log('set tiletype');
		console.log(e);

		// get actual Project object
		var project = Wu.app._activeProject;

		// if no active project, do nothing
		if (!project) { console.log('_activeProejct == undefined'); return; }
		       
		// get/set value for checkbox
		if (e.target.checked) {
			var type = 'vector';
		} else {
			
			var type = 'raster';
			
			// set TMS for homemade raster
			project.map.baseLayer.tms = true;
		}

		// save local
		project.map.baseLayer.type = type;

		// save to db
		project._update('map');

	},

       
	_setBounds : function (e) {
		
		// get actual Project object
		var project = Wu.app._activeProject;

		// if no active project, do nothing
		if (!project) { console.log('_activeProejct == undefined'); return; }

		var bounds = Wu.app._map.getBounds();
		var zoom = Wu.app._map.getZoom();

		// write directly to Project
		project.map.bounds = {
			northEast : {
				lat : bounds._northEast.lat,
				lng: bounds._northEast.lng
			},

			southWest : {
				lat : bounds._southWest.lat,
				lng : bounds._southWest.lng
			}
		}

		// call save on Project
		project._update('map');

		// call update on view
		this.updateContent();

	},

	_setInitPos : function (e) {

		// get actual Project object
		var project = Wu.app._activeProject;

		// if no active project, do nothing
		if (!project) { console.log('_activeProejct == undefined'); return; }

		// get center and zoom
		var center = Wu.app._map.getCenter();
		var zoom = Wu.app._map.getZoom();

		// write directly to Project
		project.map.initPos = {
			lat : center.lat,
			lng : center.lng,
			zoom : zoom
		}
	
		// call update on Project
		project._update('map');

		// call update on view
		this.updateContent();

	},

	updateContent : function () {
		// update view
		this._update();
	},

	_resetView : function () {

		// reset buttons ?
		//Wu.DomUtil.removeClass(this._panes.bounds,'btn-info');
		//Wu.DomUtil.removeClass(this._panes.initPos,'btn-info');
	},


	_updateBaselayer : function () {

		// create custom select box
		var ret = this.insertSelect(this._panes.baselayerWrap);
		var tit = ret.tit;
		var w = ret.w;

		// set active baselayer
		var cur = this.project.map.baseLayer.url;
	       
		// for each mapbox file
		this.project.mapboxLayers.forEach(function (f) {

			//var f =  this.project.mapboxFiles[file];
			var elem = Wu.DomUtil.create('div', 'item-list select-elem ct0', w);
			elem.innerHTML = f.name;
			elem.setAttribute('uuid', f.id);
			elem.setAttribute('type', 'mapbox');

			Wu.DomEvent.on(elem, 'mousedown', function (e) {
				tit.innerHTML = e.target.innerHTML;
				tit.setAttribute('active', false);
				Wu.DomUtil.removeClass(w, 'select-baselayer-open');

				this.setBaseLayer('mapbox', e.target.getAttribute('uuid'));
			}, this);

			// set name of current baselayer in title
			//console.log('cur: ' + cur + ' | fid: ' + f.id);
			if (cur == f.id) tit.innerHTML = f.name;


		}, this);
		
		//         };
		// }       

		 // // for each datalib file
		// this.project.files.forEach(function (file, i, arr) {
		//         var elem = Wu.DomUtil.create('div', 'select-elem', w);
		//         elem.innerHTML = file.name;
		//         elem.setAttribute('uuid', file.uuid);
		//         elem.setAttribute('type', 'datalibrary');

		//         Wu.DomEvent.on(elem, 'mousedown', function (e) {
		//                 tit.innerHTML = elem.innerHTML;
		//                 tit.setAttribute('active', false);
		//                 w.style.display = 'none';

		//                 this.setBaseLayer('datalibrary', file.uuid);
		//         }, this);

		//         // set name of current baselayer in title
		//         console.log('cur: ' + cur + ' | fid: ' + file.uuid);
		//         if (cur == file.uuid) { tit.innerHTML = file.name;  }

		// }, this)
		


	},


	_update : function () {

		// use active project
		this.project = Wu.app._activeProject;

		// update view of this project
		var b = this.project.map.bounds;

		// debug, assure this.project.controls exists
		if (!Wu.Util.isObject(this.project.controls)) {    
			this.project.controls = {};
		} 
		
		// update baselayer box
		this._updateBaselayer();
		
		// bounds
		this._panes.boundsNELatValue.value = b.northEast.lat;
		this._panes.boundsNELngValue.value = b.northEast.lng;
		this._panes.boundsSWLatValue.value = b.southWest.lat;
		this._panes.boundsSWLngValue.value = b.southWest.lng;

		// init position
		this._panes.initPosLatValue.value = this.project.map.initPos.lat;
		this._panes.initPosLngValue.value = this.project.map.initPos.lng;
		this._panes.initPosZoomValue.value = this.project.map.initPos.zoom;

		// controls
		this._updateControls();

	},

	_updateControls : function () {

		for (c in this.project.controls) {
			var on = this.project.controls[c];
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


	setBaseLayer : function (type, uuid) {

		// set values
		this.project.map.baseLayer.url = uuid;
		this.project.map.baseLayer.provider = type;
		this.project._update();

		// set it on the map
		Wu.app.MapPane.setBaseLayer(this.project);

		// save
		this.project._update('map');
	},



	insertSelect : function (wrapper) {
		wrapper.innerHTML = '<h4>Base Layer </h4>';
		var div = Wu.DomUtil.createId('div', 'select-baselayer-wrap', wrapper);
		Wu.DomUtil.addClass(div, 'select-wrap');
		var tit = Wu.DomUtil.create('div', 'smap-button-white select-title', div);
		tit.innerHTML = 'Select layer';
		var w = Wu.DomUtil.create('div', 'select-elems', div);

		// dropdown button
		var btn = Wu.DomUtil.create('div', 'select-baselayer dropdown-button', div);

		// on off click on title
		Wu.DomEvent.on(btn, 'mousedown', function (e) {
			var ac = tit.getAttribute('active');
			if (ac == 'true') {
				tit.setAttribute('active', false);
				w.style.height = 0 + 'px';
				Wu.DomUtil.removeClass(btn, 'rotate180');
				
			} else {
				tit.setAttribute('active', true);

				// calculate height of dropdown
				var height = this.project.mapboxLayers.length * 33;
				w.style.height = height + 'px';
				Wu.DomUtil.addClass(btn, 'rotate180');
			}
		}, this);


		var ret = {};
		ret.tit = tit;
		ret.w = w;
		return ret;
		
	}
});





/*
██████╗  ██████╗  ██████╗██╗   ██╗███╗   ███╗███████╗███╗   ██╗████████╗███████╗
██╔══██╗██╔═══██╗██╔════╝██║   ██║████╗ ████║██╔════╝████╗  ██║╚══██╔══╝██╔════╝
██║  ██║██║   ██║██║     ██║   ██║██╔████╔██║█████╗  ██╔██╗ ██║   ██║   ███████╗
██║  ██║██║   ██║██║     ██║   ██║██║╚██╔╝██║██╔══╝  ██║╚██╗██║   ██║   ╚════██║
██████╔╝╚██████╔╝╚██████╗╚██████╔╝██║ ╚═╝ ██║███████╗██║ ╚████║   ██║   ███████║
╚═════╝  ╚═════╝  ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝
*/
// DocumentsPane
Wu.SidePane.Documents = Wu.SidePane.Item.extend({
	
	type : 'documents',
	title : 'Documents',

       

	initContent : function () {

		// create new fullscreen page, and set as default content
		this._content = Wu.DomUtil.create('div', 'fullpage-documents ct1', Wu.app._appPane);
		
		// create container (overwrite default)
		this._container = Wu.DomUtil.create('div', 'editor-wrapper ct11', this._content);

		// insert template
		this._container.innerHTML = ich.documentsContainer();

		// get element handlers
		this._leftpane = Wu.DomUtil.get('documents-container-leftpane');
		this._folderpane = Wu.DomUtil.get('documents-folder-list');
		this._rightpane = Wu.DomUtil.get('documents-container-rightpane');
		this._textarea = Wu.DomUtil.get('documents-container-textarea');
		this._newfolder = Wu.DomUtil.get('documents-new-folder');

	},

	initFolders : function () {

		this.folders = {};
		var folders = this.project.folders;

		// init local folder object
		folders.forEach(function (folder, i, arr) {
			this.folders[folder.uuid] = folder;
		}, this);

	},

	addHooks : function () {

		// new folder
		Wu.DomEvent.on(this._newfolder, 'mousedown', this.newFolder, this);

		// bind grande.js text editor
		grande.bind([this._textarea]);
		this.expandGrande();

	},

	// add more functionality to grande
	expandGrande : function () {

		// add file attachment to grande
		var g = document.getElementsByClassName('g-body')[0];
		var list = g.children[0].children[0].children[0].children[0];
		var gwrap = g.children[0];

		var btn = Wu.DomUtil.create('button', 'file url');
		var selwrap = Wu.DomUtil.create('div', 'grande-project-files-wrap');
		var selbtn = Wu.DomUtil.create('div', 'grande-project-files-btn');
		var files = Wu.DomUtil.create('select', 'grande-project-files');
		selwrap.appendChild(files);
		selwrap.appendChild(selbtn);
		
		btn.innerHTML = 'F';
		list.appendChild(btn);
		list.appendChild(selwrap);


		// get elems
		this._grandeFiles = list;
		this._grandeFilesBtn = btn;
		this._grandeFilesSelect = files;
		this._grandeInsertBtn = selbtn;
		this._grandeFilesWrap = selwrap;
		this._grandeWrap = gwrap;

		// hook
		Wu.DomEvent.on(btn, 'mousedown', this.attachFile, this);

	},

	attachFile : function () {

		// get the text node and actual text
		this.textSelection = window.getSelection();
		range = this.textSelection.getRangeAt(0);
		this.textSelectionText = range.cloneContents().firstChild.data;

		// show file select n button
		this._grandeFilesWrap.style.display = 'block';

		// fill select with files
		var sel = this._grandeFilesSelect;
		sel.innerHTML = ''; // reset
		this.project.files.forEach(function (file, i, arr) {
			sel.options[sel.options.length] = new Option(file.name, file.uuid);
		}, this)

		//Wu.DomEvent.on(sel, 'blur', this.selectedFile, this);
		Wu.DomEvent.on(this._grandeInsertBtn, 'mousedown', this.selectedFile, this);

	},

	replaceSelection : function (link, text) {

		var range;
		if (this.textSelection.getRangeAt) {
			range = this.textSelection.getRangeAt(0);
			range.deleteContents();
			var a = document.createElement('a');
			a.innerHTML = text;
			a.href = link;
			range.insertNode(a);
		} // https://stackoverflow.com/questions/6251937/how-to-get-selecteduser-highlighted-text-in-contenteditable-element-and-replac     
	},

	selectedFile : function (e) {

		// get selected option
		var sel = this._grandeFilesSelect;
		var fuuid = sel.options[sel.selectedIndex].value;
		var name = sel.options[sel.selectedIndex].text;

		// hide file select n button
		this._grandeFilesWrap.style.display = 'none';
		Wu.DomUtil.removeClass(this._grandeWrap, 'active');
		Wu.DomUtil.addClass(this._grandeWrap, 'hide');

		// create link to file (direct download)
		var link = '/api/file/download?file=' + fuuid;

		// insert link
		this.replaceSelection(link, this.textSelectionText);

		// save
		this.saveText();

	},
	 
	_activate : function (e) {                
		Wu.SidePane.Item.prototype._activate.call(this);

		// set top
		this.adjustTop();

		// turn off header resizing and icon
		Wu.app.HeaderPane.disableResize();

		// select first title (create fake e object)
		if (this.project.folders.length > 0) {
			var e = { 'target' : { 'uuid' : this.project.folders[0].uuid }, preventDefault : Wu.Util.falseFn};
			this.selectFolder(e);
		};

		// add shift key hook
		this.enableShift();

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

	deactivate : function () {

		// turn off header resizing
		Wu.app.HeaderPane.enableResize();

		// remove shift key edit hook
		this.disableShift();
	},

	adjustTop : function () {
		// debug, for innfelt header
		return;
		// make room for project header
		var project = Wu.app._activeProject;
		if (project) {
			this._content.style.top = project.header.height + 'px';
		}

		// adjust top of left pane
		this._leftpane.style.top = '-' + project.header.height + 'px';
	},

       

	update : function () {

		// use active project
		this.project = Wu.app._activeProject;

		// flush
		this.reset();

		// set folders
		this.createFolders();

		// set top
		this.adjustTop();

	},

	updateContent : function () {  

		// reset text pane
		this._textarea.innerHTML = '';

		// update         
		this.update();
	},

	newFolder : function () {

		var folder = {
			'title' : 'Title',
			'uuid' : Wu.Util.guid('folder'),
			'content' : 'Text content'
		}

		// update 
		this.project.folders.push(folder);

		// refresh
		this.update();

	},

	createFolders : function () {

		// set folders
		var folders = this.project.folders;

		// delete buttons object
		this._deleteButtons = {};

		// create each folder headline
		folders.forEach(function (elem, i, arr) {

			// delete button
			var btn = Wu.DomUtil.create('div', 'documents-folder-delete', this._folderpane);
			btn.innerHTML = 'x';
			Wu.DomEvent.on(btn, 'click', function (e) { this.deleteFolder(elem.uuid); }, this);
			this._deleteButtons[elem.uuid] = btn;

			// folder item
			var folder = elem;
			folder.el = Wu.DomUtil.create('input', 'documents-folder-item ct23 ct28', this._folderpane);
			folder.el.value = folder.title;
			folder.el.setAttribute('readonly', 'readonly');
			folder.el.uuid = folder.uuid;
		       
			// set hooks
			Wu.DomEvent.on( folder.el,  'mousedown', this.selectFolder, this );     // select folder
			Wu.DomEvent.on( folder.el,  'dblclick', this.renameFolder, this );      // rename folder

			// update object
			this.folders[folder.uuid] = folder;

		}, this);
	       
	},

	deleteFolder : function (uuid) {
		if (confirm('Are you sure you want to delete folder ' + this.folders[uuid].title + '?')) {
			console.log('delete folder: ', uuid);
			delete this.folders[uuid];
			this._save();
		}
	},

	renameFolder : function (e) {

		// remove shift key edit hook
		this.disableShift();

		// get folder
		var uuid = e.target.uuid;
		var folder = this.folders[uuid];

		// enable editing on input box
		e.target.removeAttribute('readonly'); 
		e.target.focus();
		e.target.selectionStart = e.target.selectionEnd;

		// save on blur or enter
		Wu.DomEvent.on( e.target,  'blur', this.titleBlur, this );     // save folder title
		Wu.DomEvent.on( e.target,  'keydown', this.titleKey, this );     // save folder title

	},

	titleKey : function (e) {
		// blur on enter
		if (event.which == 13 || event.keyCode == 13) this.titleBlur();
	},


	titleBlur : function () {

		for (f in this.folders) {
			var folder = this.folders[f];
			folder.el.setAttribute('readonly', 'readonly');
			this.folders[folder.uuid].title = folder.el.value;
		}                                                                                                                                                                                              

		// save
		this._save();

		// add shift key edit hook
		this.enableShift();

	},

	selectFolder : function (e) {

		e.preventDefault();

		// get folder
		var uuid = e.target.uuid;
		var folder = this.folders[uuid];

		// clear rightpane
		this._textarea.innerHTML = '';
		this._textarea.innerHTML = folder.content;
		this._textarea.fuuid = uuid;
		
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
		this._save();
	},

	// save to server
	_save : function () {
		var folders = this.folders;
		
		// convert to array
		this.project.folders = [];
		for (f in folders) {
			var fo = Wu.extend({}, folders[f]);     // clone 
			delete fo.el;                           // delete .el on clone only
			this.project.folders.push(fo);          // update project.folders
		}

		// save project to server
		this.project._update('folders');

		// refresh
		this.update();
	},

      

	reset : function () {

		// reset left pane
		this._folderpane.innerHTML = '';

		// reset object
		this.folders = {};
	}

});






/*
██╗   ██╗███████╗███████╗██████╗ ███████╗
██║   ██║██╔════╝██╔════╝██╔══██╗██╔════╝
██║   ██║███████╗█████╗  ██████╔╝███████╗
██║   ██║╚════██║██╔══╝  ██╔══██╗╚════██║
╚██████╔╝███████║███████╗██║  ██║███████║
 ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝╚══════╝
*/
Wu.SidePane.Users = Wu.SidePane.Item.extend({

	type : 'users',
	title : 'Users',

	initContent : function () {

		// create new fullscreen page, and set as default content
		this._content = Wu.DomUtil.create('div', 'fullpage-users', Wu.app._appPane);
		
		// create container (overwrite default)
		this._container = Wu.DomUtil.create('div', 'editor-wrapper', this._content);

		// insert template
		this._container.innerHTML = ich.usersPane();

		// get handles
		this._tableContainer = Wu.DomUtil.get('users-table-container');

		// render empty table
		this._tableContainer.innerHTML = ich.usersTableFrame();

		// get more handles
		this._table = Wu.DomUtil.get('users-insertrows');
		this._addUser = Wu.DomUtil.get('users-add-user');
		this._mainTitle = Wu.DomUtil.get('user-management-client');
		this._deleteUser = Wu.DomUtil.get('users-delete-user');
		this._checkall = Wu.DomUtil.get('users-checkbox-all');
		this._checkallLabel = Wu.DomUtil.get('label-users-checkbox-all');

		// init table
		this.initList();


	},

	// hooks added automatically on page load
	addHooks : function () {
	       
		// add button
		Wu.DomEvent.on(this._addUser, 'mousedown', this.addUser, this);

		// delete button
		Wu.DomEvent.on(this._deleteUser, 'mousedown', this.deleteUser, this);

		// check all button
		Wu.DomEvent.on(this._checkallLabel, 'mousedown', this.checkAll, this);
	       
	},

	// fired when different sidepane selected, for clean-up
	deactivate : function () {
		console.log('deactive sidepane users');
		
	},

	addUser : function () {
		console.log('addUser');

		// create new dummy user
		var newUser = {
			firstName : 'First name',
			lastName : 'Last name',
			company : 'Company',
			position : 'Position',
			phone : 'Phone',
			local :  {
				email : 'Email'
			},
			projects : [],
			uuid : 'new-user-pseudo-' + Wu.Util.guid(),
			access : {
				read : [],
				write : []
			}
		}

		// add to table
		this.addTableItem(newUser); 

		// add save action btn
		var actionPane = Wu.DomUtil.get('actions-' + newUser.uuid);
		var saveBtn = Wu.DomUtil.create('div', 'users-actions-save users-button', actionPane);
		saveBtn.setAttribute('uuid', newUser.uuid);
		saveBtn.innerHTML = 'Create';

		// add save btn event
		Wu.DomEvent.on(saveBtn, 'click', this.createNewUser, this);

	},

	deleteUser : function () {
		console.log('deleteUser');

		var checked = this.getSelected();

		console.log('checked: ', checked);

		// prevent seppuku
		var authUser = Wu.app.User.options.uuid;
		var seppuku = false;
		checked.forEach(function (check) {
			if (check.uuid == authUser) seppuku = true;
		});

		if (seppuku) {
			console.error('Can\'t delete yourself.')
			return;
		}

		// conirm delete
		if (confirm('Are you sure you want to delete?')) {
			console.log('todo: delete user');
		}

	},

	createNewUser : function (e) {
		var uuid = e.target.getAttribute('uuid');

		var newUser = {
			firstName :     Wu.DomUtil.get('firstName-' + uuid).value,
			lastName :      Wu.DomUtil.get('lastName-' + uuid).value,
			company :       Wu.DomUtil.get('company-' + uuid).innerHTML,
			position :      Wu.DomUtil.get('position-' + uuid).innerHTML,
			phone :         Wu.DomUtil.get('phone-' + uuid).innerHTML,
			local :  {
				email : Wu.DomUtil.get('email-' + uuid).innerHTML,
			},
			projects : [],

			client : this.client.uuid,              // attach to this client
			createdBy : Wu.app.User.options.uuid    // log who created user
		}

		console.log('user to create: ', newUser);

		var data = JSON.stringify(newUser);

		// post         path          json      callback    this
		Wu.post('/api/user/new', data, this.createdNewUser, this);

	},

	createdNewUser : function (that, response) {
		console.log('createdNewUser: ', response);

	},


	checkAll : function () {
		console.log('checkAll');
	},

	getSelected : function () {

		// get selected files
		var checks = [];
		this.client.users.forEach(function(user, i, arr) {
			var checkbox = Wu.DomUtil.get('users-checkbox-' + user.uuid);
			if (checkbox) { var checked = checkbox.checked; }
			if (checked) { checks.push(user); }
		}, this);

		return checks;
	},

	// list.js plugin
	initList : function () { 
		
		// add dummy entry
		var tr = Wu.DomUtil.createId('tr', 'dummy-table-entry');
		tr.innerHTML = ich.usersTablerow({'type' : 'dummy-table-entry'});
		this._table.appendChild(tr);

		// init list.js
		var options = { valueNames : ['name', 'company', 'position', 'phone', 'email', 'projects'] };
		this.list = new List('userslist', options);

		// remove dummy
		this.list.clear();
	},

	updateContent : function () {
		this.update();
	},

	update : function () {

		// use active client
		this.client = Wu.app._activeClient;

		// set title
		this._mainTitle.innerHTML = this.client.name.camelize();

		// flush
		this.reset();

		// refresh table entries
		this.refreshTable();
	},

	refreshTable : function () {
		console.log('refreshTable');
		
		// get the users for this client from server
		this.getUsersData();
	},

	// get data about users for this client from server
	// TODO: refactor into json / but safest like this for now
	getUsersData : function () {

		var data = JSON.stringify({
			clientUuid : this.client.uuid
		});

		// post         path          json      callback    this
		Wu.post('/api/client/users', data, this.gotUsers, this);

	},

	gotUsers : function (that, users) {

		if (!users) return;

		// update this.client.users
		that.client.users = JSON.parse(users);

		console.log('gotUsers: ', that.client.users);

		// update user projects
		that._updateUserProjects();

		// update table
		that._refreshTable();
	},

       
	_updateUserProjects : function () {

		this.client.users.forEach(function (user) {
			user.projectObjects = {};

			user.projectObjects.read = {};
			user.access.read.projects.forEach(function (p) {
				if (this.client.projects.indexOf(p) > -1) {
					user.projectObjects.read[p] = Wu.app.Projects[p];
				}
			}, this);

			user.projectObjects.write = {};
			user.access.write.projects.forEach(function (p) {
				if (this.client.projects.indexOf(p) > -1) {     
					user.projectObjects.write[p] = Wu.app.Projects[p];
				}
			}, this);

		}, this);
	},

	_refreshTable : function () {

		// return if empty filelist
		if (!this.client.users) return; 

		// enter users into table
		this.client.users.forEach(function (user, i, arr) {
			this.addTableItem(user);
		}, this);

		// sort list by name by default
		this.list.sort('name', {order : 'asc'});

	},

	reset : function () {
		// clear table
		this.list.clear();
	},

	addTableItem : function (tmp) {

		// clone file object
		var user = Wu.extend({}, tmp);   
		
		// add record (a bit hacky, but with a cpl of divs inside the Name column)
		user.name = ich.usersTablerowName({
			firstName : user.firstName || 'First name',
			lastName : user.lastName || 'Last name',
			lastNameUuid : 'lastName-' + user.uuid,
			firstNameUuid : 'firstName-' + user.uuid,
		});

		// fix some arrays      
		user.email = user.local.email;
		
		// fill projects
		user = this._fillProjects(user);
	       
		// add users to list.js, and add to DOM
		var ret = this.list.add(user);

		// hack: manually add id's for event triggering                 TODO refactor, ich.
		// for whole table
		var nodes = ret[0].elm.children;
		for (var i = 0; i < nodes.length; i++) {
			var node = nodes[i];

			// main checkbox, label
			if (i == 0) {
				node.children[0].children[0].id = 'users-checkbox-' + user.uuid;
				node.children[0].children[1].setAttribute('for', 'users-checkbox-' + user.uuid);
			}

			// other divs
			if (!node.id == '') {
				node.id = node.id + user.uuid;
				node.setAttribute('uuid', user.uuid);
			}
		};
	
		// add hooks for editing
		this.setEditHooks(user.uuid);
       
	},

	// fill in projects in user table (not edit mode)
	_fillProjects : function (user) {

		var clientProjects = this.client.projects;              // uuids
		var userProjects = user.projectObjects;               // objects of all projects

		// create html
		var content = {};
		var pjs = '';

		// return if no userProjects
		if (!userProjects) return user;

		if ('read' in userProjects) {
			for (p in userProjects.read) {                    // this must be ALL projecst, ie. client projecst, not userprojecsts
				var project = userProjects.read[p];
				content = {
					name : project.name,
					description : project.description,
					uuid : project.uuid
				}
				
				pjs += ich.usersTableProjectItem(content);
			}
		}
		user.projects = pjs;    // will overwrite the 'content' verison of projects in user
		return user;
	},

	_editProjects : function (e) {
		// insert project select dropdown
		this.insertProjectsSelect(e);
	},

	insertProjectsSelect : function (e) {

		// get which user
		var target = e.target.parentElement;
		var userUuid = target.getAttribute('uuid');
		
		// if clicked on wrapper
		if (!userUuid) {
			var target = e.target;  // child is target
			var userUuid = target.getAttribute('uuid');
		}

		// get target position on screen
		var pos = {     
			x: target.offsetLeft,
			y: target.offsetTop
		};

		// get all available projects for client
		var allProjects = {};
		var allProjectsArr = this.client.projects;
		allProjectsArr.forEach(function (pp){
			allProjects[pp] = Wu.app.Projects[pp];
		}, this);

		// get user's projects
		var userProjects;
		this.client.users.forEach(function (uu) {
			if (uu.uuid == userUuid) {
				userProjects = uu.projectObjects;
			}
		});

		// create dropdown wrapper
		this._projectsDropWrap = Wu.DomUtil.create('div', 'users-projects-dropwrap');
		this._projectsDropWrap.userUuid = userUuid;

		// fill wrapper
		for (p in allProjects) {
			var project = allProjects[p];
			var projectWrap = Wu.DomUtil.create('div', 'users-projects-itemwrap');
			var checkedRead = '';
			var checkedWrite = '';

			// tick checkbox if user already has access to project
			if (project.uuid in userProjects.read) {
				checkedRead = 'checked';
			}

			// tick checkbox if user already has access to project
			if (project.uuid in userProjects.write) {
				checkedWrite = 'checked';
			}
			
			// fill in checkbox html
			projectWrap.innerHTML = ich.usersProjectsCheckbox({ 
				uuid : project.uuid, 
				checkedRead : checkedRead,
				checkedWrite : checkedWrite 
			});

			// fill in project name
			var nameDiv = Wu.DomUtil.create('div', 'users-projects-namediv', projectWrap);
			nameDiv.innerHTML = project.name;
			this._projectsDropWrap.appendChild(projectWrap);
		}

		// add R/W titles
		var titles = Wu.DomUtil.create('div', 'users-projects-top-title');
		titles.innerHTML = 'R &nbsp;W';
		this._projectsDropWrap.insertBefore( titles, this._projectsDropWrap.firstChild );

		// add cancel and confirm buttons
		var cancel = Wu.DomUtil.create('div', 'projects-select-cancel', this._projectsDropWrap);
		var confirm = Wu.DomUtil.create('div', 'projects-select-confirm', this._projectsDropWrap);
		cancel.innerHTML = 'Cancel';
		confirm.innerHTML = 'Confirm';

		// append
		Wu.app._appPane.appendChild(this._projectsDropWrap);
		
		// set position of popup
		this._projectsDropWrap.style.left = pos.x  + 'px';
		this._projectsDropWrap.style.top = pos.y + 200 + 'px';

		// set triggers
		// Wu.DomEvent.on(this._projectsDropWrap, 'blur', this._projectsDropWrapBlur, this);
		Wu.DomEvent.on(confirm, 'click', this._popupConfirm, this);
		Wu.DomEvent.on(cancel, 'click', this._popupCancel, this);
		Wu.DomEvent.on(document, 'keydown', this.checkEscape, this);

	},

	checkEscape : function (e) {
		if (e.keyCode == 27) this._popupCancel(); // esc key
	},

	_popupConfirm : function (e) {

		// get selected
		var checkedRead = [];
		var checkedWrite = [];
		var userUuid = this._projectsDropWrap.userUuid;

		// get checked statuses
		this.client.projects.forEach(function (pid) {
			
			// read
			var box = Wu.DomUtil.get('users-projects-checkbox-read-' + pid).checked;
			if (box) checkedRead.push(pid);

			// write
			var box = Wu.DomUtil.get('users-projects-checkbox-write-' + pid).checked;
			if (box) checkedWrite.push(pid);

		})

		// update server
		var data = {
			uuid : this._projectsDropWrap.userUuid,
			projects : {
				read : checkedRead,
				write : checkedWrite,
				client : this.client.uuid
			}
		}
		var string = JSON.stringify(data);
		Wu.save('/api/user/update', string); 

		// update local
		this.client.users.forEach(function (user, i){
			if (user.uuid == userUuid) {
				this.client.users[i].access.read.projects = checkedRead;
				this.client.users[i].access.write.projects = checkedWrite;
			}
		}, this);

		// refresh table to reflect changes
		var that = this;
		setTimeout(function () {                // hack to prevent spooky missing this.client.users update
			that._updateUserProjects(); 
			that.list.clear();
			that.refreshTable();
		}, 200);
		
		// close popup
		this.removeProjectsPopup();
			
	},

	removeProjectsPopup : function () {
		//remove popup
		this._projectsDropWrap.parentNode.removeChild(this._projectsDropWrap);

		//remove triggers
		Wu.DomEvent.off(document, 'keydown', this.checkEscape, this);
	},

	_popupCancel : function (e) {
		// close popup
		this.removeProjectsPopup();
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
		var projects    = Wu.DomUtil.get('projects-' + uuid);

		// set click hooks on title and description
		Wu.DomEvent
			[onoff]( lastName,       'mousedown mouseup click',      this.stop,      this ) // TODO
			[onoff]( lastName,       'dblclick',                     this.rename,    this )     // select folder
			[onoff]( firstName,      'mousedown mouseup click',      this.stop,      this ) 
			[onoff]( firstName,      'dblclick',                     this.rename,    this )     // select folder
			[onoff]( company,        'mousedown mouseup click',      this.stop,      this ) 
			[onoff]( company,        'dblclick',                     this._rename,    this )     // select folder
			[onoff]( position,       'mousedown mouseup click',      this.stop,      this ) 
			[onoff]( position,       'dblclick',                     this._rename,    this )     // select folder
			[onoff]( phone,          'mousedown mouseup click',      this.stop,      this ) 
			[onoff]( phone,          'dblclick',                     this._rename,    this )     // select folder
			[onoff]( email,          'mousedown mouseup click',      this.stop,      this ) 
			[onoff]( email,          'dblclick',                     this._rename,    this )     // select folder
			// [onoff]( projects,       'mousedown mouseup click',      this.stop,      this ) 
			[onoff]( projects,       'dblclick',                     this._editProjects,    this )     // select folder

	},


	// to prevent selected text
	stop : function (e) {
		console.log('stop!');   // not working!
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
		
		// get user uuid
		var userUuid = e.target.id.replace(key + '-', '');

		// get new title
		var value = e.target.value || e.target.innerHTML;

		// save to server
		this._save(key, value, userUuid);

	},



	// rename a div, ie. inject <input>
	_rename : function (e) {
		
		var div   = e.target;
		var value = e.target.innerHTML;
		var key = e.target.getAttribute('key');
		var uuid = e.target.getAttribute('uuid');

		var input = ich.injectInput({ value : value, key : key , uuid : uuid });
		
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
		var key = e.target.getAttribute('key');
		var user = e.target.getAttribute('uuid');

		// revert to <div>
		var div = e.target.parentNode;
		div.innerHTML = value;

		//refresh list
		this.list.update();

		// save somewhere
		this._save(key, value, user);

	},

	_save : function (key, value, userUuid) {

		// save to users
		this.client.users.forEach(function (user) {
			if (user.uuid == userUuid) {
				// update locally
				user[key] = value;
				
				// update on server, no callback
				var json = {};
				json[key] = value;
				json.uuid = user.uuid;
				var string = JSON.stringify(json);
				Wu.save('/api/user/update', string); 
			}

		}, this);
	},

});


/*
██████╗  █████╗ ████████╗ █████╗     ██╗     ██╗██████╗ ██████╗  █████╗ ██████╗ ██╗   ██╗
██╔══██╗██╔══██╗╚══██╔══╝██╔══██╗    ██║     ██║██╔══██╗██╔══██╗██╔══██╗██╔══██╗╚██╗ ██╔╝
██║  ██║███████║   ██║   ███████║    ██║     ██║██████╔╝██████╔╝███████║██████╔╝ ╚████╔╝ 
██║  ██║██╔══██║   ██║   ██╔══██║    ██║     ██║██╔══██╗██╔══██╗██╔══██║██╔══██╗  ╚██╔╝  
██████╔╝██║  ██║   ██║   ██║  ██║    ███████╗██║██████╔╝██║  ██║██║  ██║██║  ██║   ██║   
╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝    ╚══════╝╚═╝╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   
*/
Wu.SidePane.DataLibrary = Wu.SidePane.Item.extend({

	type : 'dataLibrary',
	title : 'Data Library',

	initContent : function () {

		// create new fullscreen page, and set as default content
		this._content = Wu.DomUtil.create('div', 'data-library ct1', Wu.app._appPane);
		
		// create container (overwrite default)
		this._container = Wu.DomUtil.create('div', 'editor-wrapper ct1', this._content);

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
		this._table = Wu.DomUtil.get('datalibrary-insertrows');
		this._errors = Wu.DomUtil.get('datalibrary-errors');
		this._uploader = Wu.DomUtil.get('upload-container');
		this._deleter = Wu.DomUtil.get('datalibrary-delete-file');
		this._downloader = Wu.DomUtil.get('datalibrary-download-files');
		this._downloadList = Wu.DomUtil.get('datalibrary-download-dialogue');
		this._checkall = Wu.DomUtil.get('checkbox-all');
		this._checkallLabel = Wu.DomUtil.get('label-checkbox-all');

		// init table
		this.initList();

		// init dropzone
		this.initDZ();

		// init download table
		this.initDownloadTable();

	},

	// hooks added automatically on page load
	addHooks : function () {
	       
		// delete button
		Wu.DomEvent.on(this._deleter, 'mousedown', this.deleteConfirm, this);

		// download button
		Wu.DomEvent.on(this._downloader, 'mousedown', this.downloadConfirm, this);

		// check all button
		Wu.DomEvent.on(this._checkallLabel, 'mousedown', this.checkAll, this);
	       
	},

	deactivate : function () {
		console.log('deactive sidepane datalib');
		this.dz.disable();
		this.disableFullscreenDZ();
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

		// create list of uuids only
		var fuuids = [];
		this._downloadFileList.forEach(function (file, i, arr) {
			fuuids.push(file.uuid);
		}, this);

		var json = {
			'files' : this._downloadFileList, //fuuids,
			'puuid' : this.project.uuid,
			'pslug' : this.project.slug
		}
		var json = JSON.stringify(json);

		// post         path          json      callback           this
		Wu.post('/api/file/download', json, this.receivedDownload, this);

	},

	receivedDownload : function (that, response) {
		// this = window

		// set path for zip file
		var path = '/api/file/download?file=' + response + '&type=zip';
		
		// add <a> for zip file
		that._downloadList.innerHTML = ich.datalibraryDownloadReady({'url' : path});
		var btn = Wu.DomUtil.get('download-ready-button');
		Wu.DomEvent.on(btn, 'click', that.downloadDone, that);

	},

	downloadCancel : function () {

		console.log('downloadCancel!');
		
		// clear download just in case
		this._downloadFileList = [];

		// hide
		this._downloadList.style.display = 'none';
	},

	downloadDone : function () {

		// close and re-init
		this.downloadCancel();
		this.initDownloadTable();
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
			tmp.format = tmp.format.join(', ');     // fix format format
			tr += ich.datalibraryDownloadRow(tmp);
		}, this);

		// get table and insert
		var table = Wu.DomUtil.get('datalibrary-download-insertrows');
		table.innerHTML = tr;

		// show
		this._downloadList.style.display = 'block';
	},

	getSelected : function () {

		// get selected files
		var checks = [];
		this.project.files.forEach(function(file, i, arr) {
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
		console.log('deleting ', files);
		
		// iterate over files and delete
		var _fids = [];
		files.forEach(function(file, i, arr) {

			// remove from list
			this.list.remove('uuid', file.uuid);
		
			// remove from local project
			var i;
			for (i = this.project.files.length - 1; i >= 0; i -= 1) {
			//this.project.files.forEach(function(f, i, a) {
				if (this.project.files[i].uuid == file.uuid) {
					this.project.files.splice(i, 1);
				}
			};

			// remove from layermenu                // todo: remove from actual menu div too
			// DO use a reverse for-loop:
			var i;
			for (i = this.project.layermenu.length - 1; i >= 0; i -= 1) {
				if (this.project.layermenu[i].fuuid == file.uuid) {
					this.project.layermenu.splice(i, 1);
				}
			}
			
			// prepare remove from server
			_fids.push(file._id);

		}, this);

		// save changes to layermenu
		this.project._update('layermenu');                                                                                                                                                                                                   
	       
		// remove from server
		var json = {
		    '_fids' : _fids,
		    'puuid' : this.project.uuid
		}
		var string = JSON.stringify(json);
		Wu.save('/api/file/delete', string); 

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
		var that = this;

		// create dz
		this.dz = new Dropzone(this._uploader, {
				url : '/api/upload',
				createImageThumbnails : false,
				autoDiscover : false
				// uploadMultiple : true
		});

		// add fullscreen dropzone
		this.enableFullscreenDZ();                                                                                                                                                                   
		
	},

	enableFullscreenDZ : function () {

		// add fullscreen bridge to dropzone
		Wu.DomEvent.on(document, 'dragenter', this.dropping, this);
		Wu.DomEvent.on(document, 'dragleave', this.undropping, this);
		Wu.DomEvent.on(document, 'dragover', this.dragover, this);
		Wu.DomEvent.on(document, 'drop', this.dropped, this);
	},

	disableFullscreenDZ : function () {

		// remove fullscreen bridge to dropzone
		Wu.DomEvent.off(document, 'dragenter', this.dropping, this);
		Wu.DomEvent.off(document, 'dragleave', this.undropping, this);
		Wu.DomEvent.off(document, 'dragover', this.dragover, this);
		Wu.DomEvent.off(document, 'drop', this.dropped, this);

	},

	refreshDZ : function () {
		var that = this;

		// clean up last dz
		this.dz.removeAllListeners();

		// set project uuid for dropzone
		this.dz.options.params.project = this.project.uuid;

		// set dz events
		this.dz.on('drop', function () { 
			console.log('drop'); 
		});

		this.dz.on('dragenter', function () { 
			console.log('dragenter'); 
		});

		this.dz.on('addedfile', function (file) { 

			// count multiple files
			that.filecount += 1;

			// show progressbar
			that.progress.style.opacity = 1;

			// show fullscreen file info
			if (!that._fulldrop) {
				that.fullOn();
				that.fullUpOn();
			}
		});


		this.dz.on('complete', function (file) {
			console.log('complete');

			// count multiple files
			that.filecount -= 1;

			// clean up
			that.dz.removeFile(file);
		      
		});

		// this.dz.on('totaluploadprogress', function (progress, totalBytes, totalSent) { 
		//         // set progress
		//         console.log('progress: ', progress);
		//         that.progress.style.width = progress + '%';
		// });

		this.dz.on('uploadprogress', function (file, progress) {
			// set progress
			that.progress.style.width = progress + '%';
		})                                                                                                                                                                                                               

		this.dz.on('success', function (err, json) {
			// parse and process
			var obj = Wu.parse(json);
			if (obj) { that.uploaded(obj); }
		});

		this.dz.on('complete', function (file) {
			console.log('complete!', file);
			console.log('filecount: ', that.filecount);

			if (!that.filecount) {
				// reset progressbar
				that.progress.style.opacity = 0;
				that.progress.style.width = '0%';

				// reset .fullscreen-drop
				that.fullUpOff();
				that.fulldropOff();
				that._fulldrop = false;
			}
		});

		// this.dz.on('successmultiple', function (err, json) {
		//         console.log('successmultiple!')
		//         console.log('err: ', err);
		//         console.log('json: ', json);
		// })

			   

	},

	
	// fullscreen when started uploading                                            // TODO: refactor fullUpOn etc..
	fullUpOn : function () {                                                        //       add support for multiple files
		// transform .fullscreen-drop                                           //       bugtest more thourougly
		Wu.DomUtil.addClass(this.fulldrop, 'fullscreen-dropped');
	},
	fullUpOff : function () {
		Wu.DomUtil.removeClass(this.fulldrop, 'fullscreen-dropped');
	},

	// fullscreen for dropping on
	fulldropOn : function (e) {

		// turn on fullscreen-drop
		this.fullOn();
		
		// remember drop elem
		this._fulldrop = e.target.className;
	},
	fulldropOff : function () {
		// turn off .fullscreen-drop
		this.fullOff();
	},

	// fullscreen for dropping on
	fullOn : function () {
		// turn on fullscreen-drop
		this.fulldrop.style.opacity = 0.9;
		this.fulldrop.style.zIndex = 1000;
	},

	fullOff : function () {
		var that = this;
		this.fulldrop.style.opacity = 0;
		setTimeout(function () {        // hack for transitions
			 that.fulldrop.style.zIndex = -10;      
		}, 200);
	},

	dropping : function (e) {
		e.preventDefault();
	    
		// show .fullscreen-drop
		this.fulldropOn(e);
	},

	undropping : function (e) {
		e.preventDefault();
		var t = e.target.className;

		// if leaving elem that started drop
		if (t == this._fulldrop) this.fulldropOff(e);
	},

	dropped : function (e) {
		e.preventDefault();
		
		// transform .fullscreen-drop
		this.fullUpOn();

		// fire dropzone
		this.dz.drop(e);
	},

	dragover : function (e) {
		// needed for drop fn
		e.preventDefault();
	},

	handleError : function (error) {
		console.log('handling error');
		var html = '';
		error.forEach(function (err, i, arr) {
			html += err.error;
			html += '<br>';
		})
		this._errors.innerHTML = html;
		this._errors.style.display = 'block';
	},

	// process file
	uploaded : function (record) {
		console.log('uploaded:');
		console.log('file: ', record);

		// handle errors
		if (record.errors.length > 0) this.handleError(record.errors);

		// return if nothing
		if (!record.files) return;

		// add
		record.files.forEach(function (file, i, arr) {
			// add to table
			this.addFile(file);
 
			// add to project locally (already added on server)
			this.project.files.push(file);
		}, this);

	},

	addFile : function (file) {

		// clone file object
		var tmp = Wu.extend({}, file);   
		
		// add record (a bit hacky, but with a cpl of divs inside the Name column)
		tmp.name = ich.datalibraryTablerowName({
			name : tmp.name || 'Title',
			description : tmp.description || 'Description',
			nameUuid : 'name-' + tmp.uuid,
			descUuid : 'description-' + tmp.uuid,
		});

		// clean arrays
		tmp.files = tmp.files.join(', ');
		tmp.keywords = tmp.keywords.join(', ');
		tmp.createdDate = new Date(tmp.createdDate).toDateString();

		// add file to list.js
		var ret = this.list.add(tmp);
		
		// ugly hack: manually add uuids
		ret[0].elm.id = tmp.uuid;                              // <tr>
		var c = ret[0].elm.children[0].children[0].children;    
		c[0].id = 'checkbox-' + tmp.uuid;                      // checkbox
		c[1].setAttribute('for', 'checkbox-' + tmp.uuid);      // label

		// add hooks for editing
		this.addEditHooks(tmp.uuid);
	},

	addEditHooks : function (uuid) {

		// get <input>'s
		var title = Wu.DomUtil.get('name-' + uuid);
		var desc = Wu.DomUtil.get('description-' + uuid);

		// set click hooks on title and description
		Wu.DomEvent.on( title,  'mousedown mouseup click', 	this.stop, 	this ); 
		Wu.DomEvent.on( title,  'dblclick', 			this.rename, 	this );     // select folder
		Wu.DomEvent.on( desc,   'mousedown mouseup click', 	this.stop, 	this ); 
		Wu.DomEvent.on( desc,   'dblclick', 			this.rename, 	this );     // select folder

	},

	// to prevent selected text
	stop : function (e) {
		console.log('stop!');   // not working!
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
		this.project.files.forEach(function(file, i, arr) {
			// iterate and find hit
			if (file.uuid == fuuid) file[key] = value;
		}, this);

		// hack: update list item manually (for instant sorting)                // TODO!
		// this.list.items.forEach(function (item, i, arr) {                    // prob. values in element not updated in html

		//         if (item.elm.id == fuuid) {
		//                 var html = item.elm.
		//                 item.
		//         }

		// }, this);

		// refresh list
		this.list.update();     // todo: funky behavior when changing name, doesn't reflect (ie. sort works on old value)

		// save to server
		this._save(fuuid, key);

	},

	_save : function (fuuid, key) {

		// save the file
		this.project.files.forEach(function(file, i, arr) {
		     
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
	},

	

	updateContent : function () {
		this.update();
	},

	update : function () {

		// use active project
		this.project = Wu.app._activeProject;

		// flush
		this.reset();

		// refresh dropzone
		this.refreshDZ();

		// refresh table entries
		this.refreshTable();
	},

	refreshTable : function () {

		// return if empty filelist
		if (!this.project.files) { return; }

		// enter files into table
		this.project.files.forEach(function (file, i, arr) {
		       this.addFile(file);
		}, this);

		// sort list by name by default
		this.list.sort('name', {order : 'asc'});
	},

	reset : function () {

		// clear table
		this.list.clear();

		// remove uploading, in case bug
		this.fullOff();
		this.fulldropOff();

	}

});






/*
██████╗  ██████╗  ██████╗██╗   ██╗███╗   ███╗███████╗███╗   ██╗████████╗███████╗
██╔══██╗██╔═══██╗██╔════╝██║   ██║████╗ ████║██╔════╝████╗  ██║╚══██╔══╝██╔════╝
██║  ██║██║   ██║██║     ██║   ██║██╔████╔██║█████╗  ██╔██╗ ██║   ██║   ███████╗
██║  ██║██║   ██║██║     ██║   ██║██║╚██╔╝██║██╔══╝  ██║╚██╗██║   ██║   ╚════██║
██████╔╝╚██████╔╝╚██████╗╚██████╔╝██║ ╚═╝ ██║███████╗██║ ╚████║   ██║   ███████║
╚═════╝  ╚═════╝  ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝
*/
// Layermenu in the Editor 
Wu.SidePane.Layers = Wu.SidePane.Item.extend({

	type : 'layers',                                // list of sources available to this user/project/client
	//title : 'Layermenu',

	initContent : function () {

		// create from template
		this._container.innerHTML = ich.layersWrapper();

		// get panes
		this._layersWrapper = Wu.DomUtil.get('layers-wrapper');
		this._libaryWrapper = Wu.DomUtil.get('layers-library-browser');
		this._layerList = Wu.DomUtil.get('layers-library-list');
		this._browserLibrary = Wu.DomUtil.get('layers-library-browser-datalayers');
		this._browserMapbox = Wu.DomUtil.get('layers-library-browser-mapbox');
		this._libraryPane = Wu.DomUtil.get('layers-library'); // list of local file
		this._mapboxPane = Wu.DomUtil.get('layers-mapbox');     // list of mapbox
		this._mapboxImportOk = Wu.DomUtil.get('import-mapbox-layers-ok'); // import mapbox account btn 
		this._mapboxImportInput = Wu.DomUtil.get('import-mapbox-layers');
		this._mapboxList = Wu.DomUtil.get('layers-mapbox-list-wrap');
		this._mapboxConnectDropp = Wu.DomUtil.get('editor-layers-connect-mapbox');
		this._datalibUploadDropp = Wu.DomUtil.get('editor-layers-upload');

		// add menu folder item -- hack
		this._middleItem = Wu.DomUtil.create('div', 'smap-button-white middle-item ct12 ct18');
		this._middleItem.innerHTML = 'Menu Folder';
		this._layersWrapper.appendChild(this._middleItem);

	},

	addHooks : function () {

		Wu.DomEvent.on(this._browserMapbox,     'mousedown',    this.selectBrowserMapbox, this);
		Wu.DomEvent.on(this._browserLibrary,    'mousedown',    this.selectBrowserLibrary, this);
		Wu.DomEvent.on(this._mapboxImportOk,    'mousedown',    this.importMapboxAccount, this);
		Wu.DomEvent.on(this._mapboxImportInput, 'keydown',      this.mapboxInputKeydown, this);

		// menu folder item
		Wu.DomEvent.on(this._middleItem, 'mousedown', this.addMenuFolder, this);

	},

	addMenuFolder : function () {
		console.log('adding menu folder!');
		var lm = {
			fuuid : 'layermenuFolder-' + Wu.Util.guid(),
			title : 'New folder',
			layerType : 'menufolder',
			pos : 2
		}

		Wu.app.MapPane.layerMenu.addMenuFolder(lm);

		// save
		// var lm = {
		//         fuuid : file.uuid,
		//         title : file.name,
		//         pos : 1,
		//         layerType : 'datalibrary'
		// }

		this.project.layermenu.push(lm);
		
		// save to server
		this.project._update('layermenu');

	},

	toggleDropdown : function (e) {
		var wrap = e.target.nextElementSibling;
		    
		// toggle open/close
		if (Wu.DomUtil.hasClass(wrap, 'hide')) {
			Wu.DomUtil.removeClass(wrap, 'hide');
			Wu.DomUtil.addClass(e.target, 'rotate180');
		} else {
			Wu.DomUtil.addClass(wrap, 'hide');
			Wu.DomUtil.removeClass(e.target, 'rotate180');
		}

	},

	mapboxInputKeydown: function (e) {
		// blur and go on enter
		if (event.which == 13 || event.keyCode == 13) {
			e.target.blur();
			this.getMapboxAccount()
		}
	},

	selectBrowserMapbox : function () {
		this._mapboxPane.style.display = 'block';
		this._libraryPane.style.display = 'none';
	},

	selectBrowserLibrary : function () {
		this._mapboxPane.style.display = 'none';
		this._libraryPane.style.display = 'block';
	},

	update : function (project) {   // todo: careful with passing projects, perhaps better to get from global SidePane source
		var project = this.project || project;
		
		// update layers after new additon
		this.updateContent(project);
	},

	updateContent : function (project) {

		// reset view
		this._reset();

		// set project
		this.project = project;

		// update view
		this._update();
	},

	_update : function () {

		// layermenu
		this.initLayers();

		// mapbox layers
		this.initMapboxLayers();

		// show active layers
		this.markActiveLayers();
	},

	_reset : function () {

		this._layerList.innerHTML = '';
		this._mapboxList.innerHTML = '';
		this.mapboxFiles = {};
		this.mapboxUsers = {};
		this.mapboxLayers = {};
		this.selectBrowserLibrary(); // set data library as default pane
	},


	markActiveLayers : function () {

		// mark active mapbox layers
		this.project.layermenu.forEach(function (layer) {

			if (layer.layerType == 'datalibrary') {
				
				// tag item active
				var check = 'layerItem-' + layer.fuuid;
				var div = Wu.DomUtil.get(check).parentNode;
				Wu.DomUtil.addClass(div, 'active');

			} else if (layer.layerType == 'mapbox') {
				
				// tag item active
				var check = 'layerMapboxItem-' + layer.fuuid;
				var div = Wu.DomUtil.get(check).parentNode;
				Wu.DomUtil.addClass(div, 'active');
			}

		}, this);
	},

	initMapboxLayers : function () {

		// ordem e progresso
		this.parseMapboxLayers();

		// update DOM
		this.updateMapboxDOM();

	},

	initLayers : function () {

		// get local layers
		var layers = [];
		this.project.files.forEach(function (file, i, arr) {
			if (file.type == 'layer') {
				layers.push(file);
				this.addLayer(file);
			}
		}, this);

		// refresh draggable
		this.initDraggable();

	},

	resetDraggable : function () {

		// remove hooks
		var bin = Wu.DomUtil.get('layer-menu-inner-content');
		if (!bin) return;
		
		Wu.DomEvent.off(bin, 'dragover', this.drag.over, this);
		Wu.DomEvent.off(bin, 'dragleave', this.drag.leave, this);
		Wu.DomEvent.off(bin, 'drop', this.drag.drop, this);
	
	},


	// dragging of layers to layermenu
	drag : {

		start : function (e) {
			var el = e.target;
			console.log('drag start: ', e);
			e.dataTransfer.setData('uuid', el.id); // set *something* required otherwise doesn't work
		},

		drop : function (e) {
			if (e.stopPropagation) e.stopPropagation(); // stops the browser from redirecting...why???

			var el = document.getElementById(e.dataTransfer.getData('uuid'));

			// get file uuid and add to layer menu 
			var fuuid = el.getAttribute('fuuid');
			var type = el.getAttribute('type');

			// add
			this.addLayerToMenu(fuuid, type);

			// clear visual feedback
			Wu.DomUtil.removeClass(Wu.DomUtil.get('layer-menu-inner-content'), 'over');

			return false; // irrelevant probably
		},

		over : function (e) {
			if (e.preventDefault) e.preventDefault(); // allows us to drop

			// set visual
			Wu.DomUtil.addClass(Wu.DomUtil.get('layer-menu-inner-content'), 'over');
			
			return false;
		},

		leave : function (e) {
			// clear visual
			Wu.DomUtil.removeClass(Wu.DomUtil.get('layer-menu-inner-content'), 'over');
		}
	},
       
	initDraggable : function () {

		this.resetDraggable();  // needed? seems not.

		// iterate over all layers
		var items = document.getElementsByClassName('layer-item');
		for (var i = 0; i < items.length; i++) {
			var el = items[i];
			
			// set attrs
			el.setAttribute('draggable', 'true');
			el.id = Wu.Util.guid();
			
			// set dragstart event
			Wu.DomEvent.on(el, 'dragstart', this.drag.start, this);
		};

		// set hooks
		var bin = Wu.DomUtil.get('layer-menu-inner-content');
		if (bin) {
			Wu.DomEvent.on(bin, 'dragover', this.drag.over, this);
			Wu.DomEvent.on(bin, 'dragleave', this.drag.leave, this);
			Wu.DomEvent.on(bin, 'drop', this.drag.drop, this);
		} 


	},


	removeLayerFromMenu : function (fuuid, type) {

		console.log('__________removeLayerFromMenu_____________', fuuid, type);                
		console.log('this.project.layermenu', this.project.layermenu);

		var i = _.findIndex(this.project.layermenu, {'fuuid' : fuuid});
	       
		if (!i < 0) {
			var i = _.findIndex(this.project.layermenu, {'id' : fuuid});    // mapbox
		}

		// remove from layermenu object
		this.project.layermenu.splice(i, 1);
	       
		// remove from layermenu DOM
		Wu.app.MapPane.layerMenu.remove(fuuid);

		// save
		this.project._update('layermenu');

		console.log('____end______removeLayerFromMenu______end_______');

	},

	// drag-n drop
	addLayerToMenu : function (fuuid, type) {

		// add from datalibrary
		if (type == 'datalibrary') {
			// get file,  add to layermenu
			var file = this.getFileFromUuid(fuuid);
			console.log('dl file: ', file);
			
			// add to layermenu
			Wu.app.MapPane.layerMenu.addFromFile(file);

			// tag item active
			var check = 'layerItem-' + fuuid;
			var div = Wu.DomUtil.get(check).parentNode;
			Wu.DomUtil.addClass(div, 'active');

			// save
			var lm = {
				fuuid : file.uuid,
				title : file.name,
				pos : 1,
				layerType : 'datalibrary'
			}

			this.project.layermenu.push(lm);

			console.log('====mb=> pushing to layermenu', lm);
			console.log('this.project.layermenu', this.project.layermenu);
			
			// save to server
			this.project._update('layermenu');

			return;
		}

		// add from mapbox
		if (type == 'mapbox') {

			// find layer in mapbox jungle
			console.log('this.mapboxLayers: ', this.mapboxLayers);  // TODO: rewrite with _.find
			var found = [];
			for (l in this.mapboxLayers) {
				var account = this.mapboxLayers[l];
				account.forEach(function (layer) {
					if (layer.id == fuuid) { found = layer; }
				})
			}
			if (!found) { 
				console.log('that layer is not here????'); 
				return;
			}
			       
			// add to layermenu
			Wu.app.MapPane.layerMenu.addFromMapbox(found);
			
			// tag item active
			var check = 'layerMapboxItem-' + fuuid;
			var div = Wu.DomUtil.get(check).parentNode;
			Wu.DomUtil.addClass(div, 'active');

			// save layermenu
			var lm = {
				fuuid : found.id,
				title : found.name,
				pos : 1,
				layerType : 'mapbox'
			}

			this.project.layermenu.push(lm);

			console.log('====mb=> pushing to layermenu', lm);

			// save to server
			this.project._update('layermenu');

			return;
		}

	},

	getFileFromUuid : function (fuuid) {
		var file = {};
		this.project.files.forEach(function (f, i, arr) {
			if (fuuid == f.uuid) {  file = f; }
		}, this);
		return file;
	},

	addLayer : function (file) {

		var div = Wu.DomUtil.create('div', 'item-list layer-item');
		div.setAttribute('draggable', true);
		div.setAttribute('fuuid', file.uuid);
		div.setAttribute('type', 'datalibrary');
		div.innerHTML = ich.layersItem(file);
		this._layerList.appendChild(div);

		// add to layermenu on click
		Wu.DomEvent.on(div, 'click', this.toggleLayer, this);

	},


	_activate : function () {
		Wu.SidePane.Item.prototype._activate.call(this)

		this.update();
	},


	// on click when adding new mapbox account
	importMapboxAccount : function (e) {

		// get username
		var username = this._mapboxImportInput.value;

		// get mapbox account via server
		this.getMapboxAccount(username);

		// clear input box
		this._mapboxImportInput.value = '';

	},

	getMapboxAccount : function (username) {
		
		// get mapbox account from server
		// ie, send username to server, get mapbox parsed back
		var data = {
			'username' : username,
			'projectId' : this.project.uuid
		}
		// post         path                            json                                   callback      this
		Wu.post('/api/util/getmapboxaccount', JSON.stringify(data), this.gotMapboxAccount, this);

	},

	parseMapboxLayers : function (layers, fresh) {

		var layers = layers || this.project.mapboxLayers;

		// push into an orderly object
		this.mapboxLayers = this.mapboxLayers || {};
		layers.forEach(function (layer, i, arr) {
			this.mapboxLayers[layer.username] = this.mapboxLayers[layer.username] || [];
			this.mapboxLayers[layer.username].push(layer);
			
			// add to project 
			if (fresh) this.project.mapboxLayers.push(layer);  //TODO could contain duplicates
		
		}, this);

		// remove possible duplicates
		this.removeMapboxDuplicates();

	},

	removeMapboxDuplicates : function () {
		
		// remove possible duplicates
		this.project.mapboxLayers = _.uniq(this.project.mapboxLayers);

		// remove dups in local 
		for (a in this.mapboxLayers) {
			this.mapboxLayers[a] = _.uniq(this.mapboxLayers[a]);
		}

	},

	// returned from server getting a mapbox account
	gotMapboxAccount : function (that, response) {

		var layers = JSON.parse(response);

		// check if empty
		if (!layers) { console.log('seems empty'); return; }
	       
		// ordem e progresso
		that.parseMapboxLayers(layers, true); // and add to project

		// update DOM
		that.updateMapboxDOM();

		// save to project
		that.project._update('mapboxLayers');

	},

	// just update DOM with existing mapbox accounts
	updateMapboxDOM : function () {

		console.log('updateMapboxDOM; this.mapboxLayers: ', this.mapboxLayers);

		// update DOM in project with all mapbox accounts and layers
		this._mapboxList.innerHTML = ''; // reset
		for (account in this.mapboxLayers) {

			// create account header
			var div = Wu.DomUtil.create('div', 'mapbox-list-item');
			div.innerHTML = ich.mapboxListWrapper({'name' : account});    
			this._mapboxList.appendChild(div);
			var wrap = Wu.DomUtil.get('layers-mapbox-list-' + account);

			// fill in with layers
			var layers = this.mapboxLayers[account];
			layers.forEach(function (layer) {

				// create and append layer to DOM list
				var div = Wu.DomUtil.create('div', 'layer-item');
				div.setAttribute('draggable', true);
				div.setAttribute('fuuid', layer.id);
				div.setAttribute('type', 'mapbox');
				div.innerHTML = ich.layersMapboxItem(layer);
				wrap.appendChild(div);

				// add to layermenu on click
				Wu.DomEvent.on(div, 'click', this.toggleLayer, this);

			}, this);

		}

		// refresh draggable
		this.initDraggable();

	},

	toggleLayer : function (e) {
	       
		var div = e.target;
		var fuuid = div.getAttribute('fuuid');
		var type = div.getAttribute('type');

		if (!fuuid && !type) {
			var div = e.target.parentNode;
			var fuuid = div.getAttribute('fuuid');
			var type = div.getAttribute('type');
		}

		// see if layer is in layermenu
		var active = _.find(this.project.layermenu, {'fuuid' : fuuid});

		if (active != undefined) {

			// toggle off
			this.removeLayerFromMenu(fuuid);
			
			// tag item active
			Wu.DomUtil.removeClass(div, 'active');

		} else {

			// toggle on
			this.addLayerToMenu(fuuid, type);
		}


	},

	save : function (key) {



	},

	
});


;                                                                                                                                                                                                                   

// The SidePane menubar
Wu.SidePane = Wu.Class.extend({


        initialize : function (options) {
                
                this.options = options || Wu.app.options;

                this.initContainer();
                this.initContent();
                this.render();     
                
                return this;   
        },

        
        initContainer: function () {
                var className = 'q-editor-container';
                this._container = Wu.DomUtil.create('div', className, Wu.app._appPane);
        },


        initContent : function () {
                
                // menu pane
                var className = 'q-editor-menu';
                Wu.app._editorMenuPane = Wu.DomUtil.create('menu', className, this._container); 

                // content pane
                var className = 'q-editor-content';
                Wu.app._editorContentPane = Wu.DomUtil.create('content', className, this._container); 
        },
        
        render : function () {

                // fill in options.editor if blank
                if (!Wu.Util.isObject(this.options.editor)) {
                        this.options.editor = { render : this.options.editor || true};
                }

                // render all editor elements
                if (this.options.editor.clients != false) {             // will go out
                        this.Clients = new Wu.SidePane.Clients();
                }

                // render projects everytime
                this.Projects = new Wu.SidePane.Projects(this);


                if (this.options.editor.map != false) {
                        this.Map = new Wu.SidePane.Map();
                }

                if (this.options.editor.sources != false) {
                        this.Layers = new Wu.SidePane.Layers();
                }

                if (this.options.editor.documentsPane != false) {
                        this.Documents = new Wu.SidePane.Documents();
                }

                if (this.options.editor.downloadsPane != false) {
                        this.DataLibrary = new Wu.SidePane.DataLibrary();
                }

                // if user has management access
                if (this.options.editor.users != false) {
                        this.Users = new Wu.SidePane.Users();
                }

        },


        setProject : function (project) {

                console.log('set project _______ SidePane');
                this.Map.updateContent(project);
                this.Layers.updateContent(project);
                this.Documents.updateContent(project);
                this.Users.updateContent(project);
                this.DataLibrary.updateContent(project);
                //this.Header._updateContent(project);

        },

        // display the relevant panes
        refresh : function (menus) {

                // all panes
                var all = ['Clients', 'Projects', 'Map', 'Layers', 'Documents', 'Users', 'DataLibrary'];
                
                // panes to active
                menus.forEach(function (elem, i, arr) {
                        if (!Wu.app.SidePane[elem]) {
                                Wu.app.SidePane[elem] = new Wu.SidePane[elem];
                        }
                        Wu.app.SidePane[elem].enable();
                }, this);

                // panes to deactivate
                var off = all.diff(menus);
                off.forEach(function (elem, i, arr) {
                        Wu.app.SidePane[elem].disable(); // alt remove?
                }, this)

                // Wu.app.SidePane.Clients.enable();
                // Wu.app.SidePane.Projects.enable();
                // Wu.app.SidePane.Map.enable();
                // // Wu.app.SidePane.Sources.enable();
                // Wu.app.SidePane.Users.enable();
                // Wu.app.SidePane.Layers.enable();





        }



});










/*
 /$$$$$$ /$$                            
|_  $$_/| $$                            
  | $$ /$$$$$$    /$$$$$$  /$$$$$$/$$$$ 
  | $$|_  $$_/   /$$__  $$| $$_  $$_  $$
  | $$  | $$    | $$$$$$$$| $$ \ $$ \ $$
  | $$  | $$ /$$| $$_____/| $$ | $$ | $$
 /$$$$$$|  $$$$/|  $$$$$$$| $$ | $$ | $$
|______/ \___/   \_______/|__/ |__/ |__/

*/                                                                                                         
// general item template
Wu.SidePane.Item = Wu.Class.extend({
       
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

        addHooks : function () {

                // menu items bindings
                Wu.DomEvent.on(this._menu, 'click', this._activate, this);          // click
                Wu.DomEvent.on(this._menu, 'mouseenter', this._mouseenter, this);   // mouseEnter
                Wu.DomEvent.on(this._menu, 'mouseleave', this._mouseleave, this);   // mouseLeave
        },

        _mouseenter : function (e) {
                Wu.DomUtil.addClass(this._menu, 'red');
        },

        _mouseleave : function (e) {
                Wu.DomUtil.removeClass(this._menu, 'red');
        },

        _activate : function (e) {
                              
                // set active menu
                var prev = Wu.app._activeMenu || false;

				// From this pane
                Wu.app._activeMenu = this;
					
                // The Activated Pane 	                	
                Wu.app._active = this._content;					
					
				this.swiper();
				

                // add active to menu
                if (prev) { Wu.DomUtil.removeClass(prev._menu, 'active'); }
                Wu.DomUtil.addClass(this._menu, 'active');

                // call deactivate on previous for cleanup
                if (prev) { prev.deactivate(); };

                // update pane
                //this._update();   //todo: refactor: now it's _update, _updateContent, refresh all over tha place
        },

		// EVIL
		swiper : function () {
		
				// FROM EVIL
					
				// Find out what to Swipe from, yo.
				// The Sliders Container
				var _content_container = document.getElementsByTagName('menu')[0];
			
				// Create some vars
				var swipethis, swfrom, swto, swipeOut, swipeIn;
				
				// Find all the swipeable elements....
				var _under_dogs = _content_container.getElementsByTagName('div');
								
				// Find what position the swipe from and to is in the array
				for ( var a = 0; a<_under_dogs.length;a++) {
					if ( _under_dogs[a] == Wu.app._activeMenu._menu ) { swipethis = a; }
					if ( _under_dogs[a] == Wu.app._active._menu ) { swfrom = a;	}
				}
				
				
				// Check if we're swiping up or down
				if ( swfrom > swto ) {
					swipeOut = 'swipe_out';
					swipeIn = 'swipe_in';
				} else {
					swipeOut = 'swipe_out_up';
					swipeIn = 'swipe_in_up';
				}				
					
                // Hide the Deactivated Pane
                if (Wu.app._active) {
                	
                	// Evil
					Wu.DomUtil.addClass(Wu.app._active, swipeOut);                	
                	
					// Remove classes from the swiped out element
					setTimeout(function(){
						Wu.DomUtil.removeClass(Wu.app._active, swipeOut);
					}, 300);								
            	};
                	                	
				// Swipe this IN
				Wu.DomUtil.addClass(Wu.app._active, 'show');
				Wu.DomUtil.addClass(Wu.app._active, swipeIn);				
				
				setTimeout(function(){
					Wu.DomUtil.removeClass(Wu.app._active, swipeIn);	
				}, 300);
							
		},

        deactivate : function () {
                console.log('blank deactiavte');

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

                // wrapper 
                this._container = Wu.DomUtil.create('div', 'editor-wrapper', this._content);
        },

        initContent : function () {

        },

        updateContent : function (project) {

                // console.log('updateing ' + this.type + ' content in Editor');
                // console.log(project);

        },

        _addHook : function (elem, event, fn, uuid) {
                Wu.DomEvent.on(elem, event, fn, uuid);

        },


        disable : function () {

                // disable click
                Wu.DomEvent.off(this._menu, 'click', this._activate, this); 

                // add disabled class
                Wu.DomUtil.addClass(this._title, 'disabled');

        },

        enable : function () {

                // enable click
                Wu.DomEvent.on(this._menu, 'click', this._activate, this); 

                // remove disabled class
                Wu.DomUtil.removeClass(this._title, 'disabled');

        },

        remove : function () {

                delete this._menu;
                delete this._content;
                delete this;

        }



});






/*
  /$$$$$$  /$$ /$$                       /$$             
 /$$__  $$| $$|__/                      | $$             
| $$  \__/| $$ /$$  /$$$$$$  /$$$$$$$  /$$$$$$   /$$$$$$$
| $$      | $$| $$ /$$__  $$| $$__  $$|_  $$_/  /$$_____/
| $$      | $$| $$| $$$$$$$$| $$  \ $$  | $$   |  $$$$$$ 
| $$    $$| $$| $$| $$_____/| $$  | $$  | $$ /$$\____  $$
|  $$$$$$/| $$| $$|  $$$$$$$| $$  | $$  |  $$$$//$$$$$$$/
 \______/ |__/|__/ \_______/|__/  |__/   \___/ |_______/ 
                                                         
*/
// Clients
Wu.SidePane.Clients = Wu.SidePane.Item.extend({

        type : 'clients',

        initialize : function () {
                Wu.SidePane.Item.prototype.initialize.call(this)

                // active by default
                Wu.app._active = this._content;
                this._activate();      
        },

        initContent : function () {

                // container
                this._container.innerHTML = ich.editorClients();
                var clientsContainer = this._clientsContainer = Wu.DomUtil.get('editor-clients');
              
                // new clients button
                var newClientButton = Wu.DomUtil.create('div', 'new-client', this._clientsContainer);
                newClientButton.innerHTML = 'Create New Client';
                this._addHook(newClientButton, 'click', this._createNew, this);

                // clients
                this.options.json.clients.forEach(function(client, i, arr) {     
                        this._create(client);
                }, this);


        },

        _create : function (client) {
                var clientData = {
                        clientName : client.name,
                        clientLogo : client.header.logo,
                        clientID   : client.uuid
                }
                
                // append client to container
                Wu.DomUtil.prependTemplate(this._clientsContainer, ich.editorClientsItem(clientData));

                // set hook for selecting client
                var target = Wu.DomUtil.get('editor-clients-container-' + client.uuid);
                this._addHook(target, 'click', this.select, Wu.app.Clients[client.uuid]);
                this._addHook(target, 'click', this._select, target);
                
                // set hook for edit toggle
                var toggle = Wu.DomUtil.get('editor-client-edit-toggle-' + client.uuid);
                this._addHook(toggle, 'click', this.toggleEdit, Wu.app.Clients[client.uuid]);

                // set hook for delete button           TODO if privs
                var del = Wu.DomUtil.get('editor-client-delete-' + client.uuid);
                this._addHook(del, 'click', this.remove, Wu.app.Clients[client.uuid]);

        },

        remove : function () {
                var client = this;
                if (window.confirm('Are you sure you want to DELETE the client ' + client.name + '?')) {
                        client._delete();  
                }
        },


        _createNew : function () {

                // add new client box
                var clientData = {
                        clientName : 'New client'
                }
                        
                // prepend client to container
                Wu.DomUtil.prependTemplate(this._clientsContainer, ich.editorClientsNew(clientData));

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
                if (json.unique) {
                        editor._enableConfirm();
                        return;
                } 

                // if error                             // TODO error handling
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
                console.log('Client name OK.');

        },

        _cancel : function () {

                // remove edit box
                var old = Wu.DomUtil.get('editor-clients-container-new');
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
                client.saveNew(); 
        },

        _created : function(client, json) {       // this is the http callback        
                var editor = Wu.app.SidePane.Clients;
                var options = JSON.parse(json);
               
                // update Client object
                Wu.extend(client, options);
                Wu.app.Clients[client.uuid] = client;

                // remove edit box
                var old = Wu.DomUtil.get('editor-clients-container-new');
                Wu.DomUtil.remove(old);
                
                // create client in DOM
                editor._create(client);
               
                // set active
                client.setActive();
        },

        toggleEdit : function (e) { // this = client

                // stop propagation
                if (e) { Wu.DomEvent.stop(e); }

                var client = this;
                var container = Wu.DomUtil.get('editor-client-edit-wrapper-' + client.uuid);

                if (client.options.editMode) {
                       
                        // hide dom
                        container.style.display = 'none';
                        client.options.editMode = false;
                } else {
                       
                        // show dom
                        container.style.display = 'block';
                        client.options.editMode = true;
                }
        },

        _addHook : function (elem, event, fn, uuid) {
                Wu.DomEvent.on(elem, event, fn, uuid);
        },

        select : function (e) {
                var client = this;

                // skip if already selected
                //if (Wu.app._activeClient == client) { return; }

                // set active
                client.setActive(); // this = Wu.Client

                // reset active project
                if (Wu.app._activeProject) {
                        Wu.app._activeProject.unload();
                }

                // // enable project menu 
                // Wu.app.SidePane.Projects.enable();
                // Wu.app.SidePane.Map.disable();
                // Wu.app.SidePane.Layers.disable();
                // Wu.app.SidePane.Users.disable();
                // //Wu.app.SidePane.Layers.disable();


                 // refresh SidePane
                var menu = ['Clients', 'Projects'];
                
                // if user got manager privs, show USERS settings
                var priv = Wu.app.options.json.user.privileges.create;
                if (priv.users) {
                        menu.push('Users');
                }
                Wu.app.SidePane.refresh(menu);

                // activate projects
                Wu.app.SidePane.Projects._activate();


        },

        _select : function () {
                var that = Wu.app.SidePane.Clients;   
                if (that._previousSelect) {
                        Wu.DomUtil.removeClass(that._previousSelect, 'active-client');
                }
                Wu.DomUtil.addClass(this, 'active-client');
                that._previousSelect = this;
        },

        selectProject : function (e) {
                var project = this;
                project.setActive();               // Wu.Project.setActive();
        },

        disable : function () {
                // noop
        }


});




/*
 /$$$$$$$                                               /$$             
| $$__  $$                                             | $$             
| $$  \ $$ /$$$$$$   /$$$$$$  /$$  /$$$$$$   /$$$$$$$ /$$$$$$   /$$$$$$$
| $$$$$$$//$$__  $$ /$$__  $$|__/ /$$__  $$ /$$_____/|_  $$_/  /$$_____/
| $$____/| $$  \__/| $$  \ $$ /$$| $$$$$$$$| $$        | $$   |  $$$$$$ 
| $$     | $$      | $$  | $$| $$| $$_____/| $$        | $$ /$$\____  $$
| $$     | $$      |  $$$$$$/| $$|  $$$$$$$|  $$$$$$$  |  $$$$//$$$$$$$/
|__/     |__/       \______/ | $$ \_______/ \_______/   \___/ |_______/ 
                        /$$  | $$                                       
                       |  $$$$$$/                                       
                        \______/                                        
*/// Projects
Wu.SidePane.Projects = Wu.SidePane.Item.extend({

        type : 'projects',

        initContent : function () {
                
                // template        
                this._container.innerHTML = ich.editorProjectsContainer();

                // sort by buttons
                var sortleft = Wu.DomUtil.get('editor-projects-sort-by-left');
                var sortright = Wu.DomUtil.get('editor-projects-sort-by-right');
                Wu.DomEvent.on(sortleft, 'click', this.sortProjects, this);
                Wu.DomEvent.on(sortright, 'click', this.sortProjects, this);

                // new project button
                var newProjectButton = Wu.DomUtil.get('new-project-button');
                Wu.DomEvent.on(newProjectButton, 'click', this._createNew, this);

                // set panes
                this._projectsContainer = Wu.DomUtil.get('editor-projects-container');


                this._projects = {};
                this._editMode = false;
                

        },

        // _initClients : function () {

        //         console.log('_INITCLIENTS ___ IN PROJECTS??!?');

        //         // container
        //         this._container.innerHTML = ich.editorClients();
        //         var clientsContainer = this._clientsContainer = Wu.DomUtil.get('editor-clients');
              
        //         // new clients button
        //         var newClientButton = Wu.DomUtil.create('div', 'new-client', this._clientsContainer);
        //         newClientButton.innerHTML = 'Create New Client';
        //         this._addHook(newClientButton, 'click', this._createNew, this);

        //         // clients
        //         this.options.json.clients.forEach(function(client, i, arr) {     
        //                 this._create(client);
        //         }, this);


        // },

        // _create : function (client) {
        //         var clientData = {
        //                 clientName : client.name,
        //                 clientLogo : client.header.logo,
        //                 clientID   : client.uuid
        //         }
                
        //         // append client to container
        //         Wu.DomUtil.prependTemplate(this._clientsContainer, ich.editorClientsItem(clientData));

        //         // set hook for selecting client
        //         var target = Wu.DomUtil.get('editor-clients-container-' + client.uuid);
        //         this._addHook(target, 'click', this.select, Wu.app.Clients[client.uuid]);
        //         this._addHook(target, 'click', this._select, target);
                
        //         // set hook for edit toggle
        //         var toggle = Wu.DomUtil.get('editor-client-edit-toggle-' + client.uuid);
        //         this._addHook(toggle, 'click', this.toggleEdit, Wu.app.Clients[client.uuid]);

        //         // set hook for delete button           TODO if privs
        //         var del = Wu.DomUtil.get('editor-client-delete-' + client.uuid);
        //         this._addHook(del, 'click', this.removeClient, Wu.app.Clients[client.uuid]);

        // },

        // removeClient : function () {
        //         var client = this;

        //         client.remove();
        //         // if (window.confirm('Are you sure you want to DELETE the client ' + client.name + '?')) {

        //         //         client._delete();  
        //         // }
        // },

        

        refresh : function () {

                var client = Wu.app._activeClient;
                
                // reset container
                this._projectsContainer.innerHTML = '';

                // fill in with projects that belong to active client
                this._projects = {};
                for (item in Wu.app.Projects) { 
                        if (client.projects.indexOf(item) > -1) {
                                this._create(Wu.app.Projects[item]);
                        } 
                };

        },

        select : function () {
                var project = this;
                project.setActive();        // Wu.Project.setActive();

                var pro = Wu.app.SidePane.Projects._projects;
                for (p in pro) {
                        var el = pro[p];
                        Wu.DomUtil.removeClass(el, 'active');
                }
                var el = pro[project.uuid];
                 
                Wu.DomUtil.addClass(el, 'active');

                // enable project menu 
                // Wu.app.SidePane.Clients.enable();
                // Wu.app.SidePane.Projects.enable();
                // Wu.app.SidePane.Map.enable();
                // // Wu.app.SidePane.Sources.enable();
                // Wu.app.SidePane.Users.enable();
                // Wu.app.SidePane.Layers.enable();
        

                // refresh SidePane
                var menu = ['Clients', 'Projects', 'Documents', 'Layers', 'DataLibrary'];

                // if user got write access, show MAP settings
                if (project.access.write.indexOf(Wu.app.options.json.user.uuid) > -1) {
                        menu.push('Map');
                }
                // if user got manager privs, show USERS settings
                var priv = Wu.app.options.json.user.privileges.create;
                if (priv.users) {
                        menu.push('Users');
                }
                Wu.app.SidePane.refresh(menu);

        },

        sortProjects : function (e, bool) {

                console.log('sort!');
                console.log(this);
                console.log(e);
                console.log(bool);
        },


        _createNew : function () {

                console.log('creating neeeee!');
                // add new project box
                var projectData = {
                        projectName : 'New project'
                }
                        
                // prepend client to container
                Wu.DomUtil.prependTemplate(this._projectsContainer, ich.editorProjectsNew(projectData), true);

                // set hooks: confirm button
                var target = Wu.DomUtil.get('editor-project-confirm-button');
                this._addHook(target, 'click', this._confirm, this);

                // cancel button
                var target = Wu.DomUtil.get('editor-project-cancel-button');
                this._addHook(target, 'click', this._cancel, this);

                // set hooks: writing name                                      // TODO: unique names on projects?
                //var name = Wu.DomUtil.get('editor-project-name-new');
                //this._addHook(name, 'keyup', this._checkSlug, this);

        },

        _cancel : function () {

                // remove edit box
                var old = Wu.DomUtil.get('editor-projects-container-new');
                Wu.DomUtil.remove(old);

        },

        _confirm : function () {

                // get client vars
                var name = Wu.DomUtil.get('editor-project-name-new').value;
                var description = Wu.DomUtil.get('editor-project-description-new').value;
                var keywords = Wu.DomUtil.get('editor-project-keywords-new').value;
                
                var options = {
                        name : name,
                        description : description,
                        keywords : keywords
                }

                // create new project with options, and save
                var project = new Wu.Project(options);
                project._saveNew(); 
        },

        _create : function (item) {

                // create view
                var data = {
                        projectName : item.name || '',
                        projectLogo : item.header.logo || '',
                        uuid        : item.uuid 
                }
                var target = Wu.DomUtil.create('div', 'editor-projects-item');
                target.setAttribute('uuid', item.uuid);
                target.innerHTML = ich.editorProjectsItem(data);

                this._projects[item.uuid] = target;
                this._projectsContainer.appendChild(target);

                // add hook for edit button
                var editButton = Wu.DomUtil.get('project-edit-button-' + item.uuid);
                Wu.DomEvent.on(editButton, 'mousedown', this.toggleEdit, this);
                Wu.DomEvent.on(editButton, 'click', Wu.DomEvent.stop, this);
                
                // when clicking on project box               pass the Project as this
                Wu.DomEvent.on(target, 'click', this.select, Wu.app.Projects[item.uuid]);

        },

        toggleEdit : function (e) {

                // stop propagation
                if (e) { Wu.DomEvent.stop(e); }

                var uuid = e.target.getAttribute('uuid');
                var container = Wu.DomUtil.get('editor-project-edit-wrapper-' + uuid);
                var project = Wu.app.Projects[uuid];
                
                // close all other editors
                if (this._editorPane) Wu.DomUtil.remove(this._editorPane);

                // toggle edit mode
                this._editMode = !this._editMode;

                // close if second click
                if (!this._editMode) return;
                   
                // create editor div
                project._editorPane = this._editorPane = Wu.DomUtil.create('div', 'editor-project-edit-super-wrap');
                var html = ich.editorProjectEditWrapper({
                        'uuid' : uuid, 
                        'name' : project.name, 
                        'description' : project.description,
                        'keywords' : project.keywords
                });
                project._editorPane.innerHTML = html;

                // find out if project elem is odd or even in list
                var i = this._projects[uuid].parentNode.childNodes;
                for (var n = 0; n < i.length; n++) {
                        if (i[n].getAttribute('uuid') == uuid) {
                                var num = n;
                                var odd = num % 2;
                        }
                }

                // insert editor into list
                if (!odd) {
                        // get referencenode
                        var refnum = parseInt(num) + 1;
                        if (refnum > i.length-1) refnum = i.length-1;
                        var referenceNode = i[refnum];

                        // insert editor div
                        referenceNode.parentNode.insertBefore(project._editorPane, referenceNode.nextSibling);
                        Wu.DomUtil.addClass(project._editorPane, 'left');
                
                } else {
                        // get referencenode
                        var refnum = num;
                        var referenceNode = i[refnum];

                        // insert editor div
                        referenceNode.parentNode.insertBefore(project._editorPane, referenceNode.nextSibling);
                        Wu.DomUtil.addClass(project._editorPane, 'right');
                }


                // get elements
                this._editName = Wu.DomUtil.get('editor-project-name-' + uuid);
                this._editDescription = Wu.DomUtil.get('editor-project-description-' + uuid);
                this._editKeywords = Wu.DomUtil.get('editor-project-keywords-' + uuid);
                this._deleteButton = Wu.DomUtil.get('editor-project-delete-' + uuid);


                // add hooks
                Wu.DomEvent.on(this._editName, 'keydown blur', function (e) {
                        this.autosave(project, 'name');
                }, this);

                Wu.DomEvent.on(this._editDescription, 'keydown blur', function (e) {    // todo: will drop save sometimes if blur < 500ms
                        this.autosave(project, 'description');
                }, this);

                Wu.DomEvent.on(this._editKeywords, 'keydown blur', function (e) {
                        this.autosave(project, 'keywords');
                }, this);

                Wu.DomEvent.on(this._deleteButton, 'mousedown', function (e) {
                        this._delete(project);
                }, this);

        },

        _delete : function (project) {
                
                // confirm dialogue, todo: create stylish confirm
                if (confirm('Are you sure you want to delete project "' + project.name + '"?')) {    
                
                        // delete project object
                        project._delete();
                
                        // delete in DOM
                        var del = this._projects[project.uuid];
                        Wu.DomUtil.remove(del);
                        if (this._editorPane) Wu.DomUtil.remove(this._editorPane);
                }

        },

        autosave : function (project, key) {
                var that = this;
                clearTimeout(this._saving);

                // save after 500ms of inactivity
                this._saving = setTimeout(function () {
                        that.saveText(project, key);
                }, 500);

        },

        saveText : function (project, key) {
                project[key] = Wu.DomUtil.get('editor-project-' + key + '-' + project.uuid).value;
                project._update(key);
        },


        _created : function (project, json) {

                var editor = Wu.app.SidePane.Projects;
                var options = JSON.parse(json);
               
                // update Project object
                Wu.extend(project, options);
                Wu.app.Projects[project.uuid] = project;

                // remove edit box
                var old = Wu.DomUtil.get('editor-projects-container-new');
                Wu.DomUtil.remove(old);
                
                // create client in DOM
                editor._create(project);
               
                // set active
                project.setActive();

                // set parent client
                Wu.app._activeClient.projects.push(project.uuid);
                Wu.app._activeClient.update('projects');
                console.log('updated parent client::::', Wu.app._activeClient)
        }


});














         










/*
 /$$      /$$                    
| $$$    /$$$                    
| $$$$  /$$$$  /$$$$$$   /$$$$$$ 
| $$ $$/$$ $$ |____  $$ /$$__  $$
| $$  $$$| $$  /$$$$$$$| $$  \ $$
| $$\  $ | $$ /$$__  $$| $$  | $$
| $$ \/  | $$|  $$$$$$$| $$$$$$$/
|__/     |__/ \_______/| $$____/ 
                       | $$      
                       | $$      
                       |__/      
*/// Map
Wu.SidePane.Map = Wu.SidePane.Item.extend({

        type : 'map',

        initContent : function () {

                // shorthand 
                this.app = Wu.app;

                // content to template
                this._container.innerHTML = ich.editorMapBaseLayer();
          
                // set panes
                this._panes = {};

                // map baselayer
                this._panes.baselayerWrap = Wu.DomUtil.get('editor-map-baselayer-wrap');

                // map bounds
                this._panes.bounds           = Wu.DomUtil.get('editor-map-bounds');
                this._panes.boundsNELatValue = Wu.DomUtil.get('editor-map-bounds-NE-lat-value');
                this._panes.boundsNELngValue = Wu.DomUtil.get('editor-map-bounds-NE-lng-value');
                this._panes.boundsSWLatValue = Wu.DomUtil.get('editor-map-bounds-SW-lat-value');
                this._panes.boundsSWLngValue = Wu.DomUtil.get('editor-map-bounds-SW-lng-value');

                // map position
                this._panes.initPos             = Wu.DomUtil.get('editor-map-initpos-button');
                this._panes.initPosLatValue     = Wu.DomUtil.get('editor-map-initpos-lat-value');
                this._panes.initPosLngValue     = Wu.DomUtil.get('editor-map-initpos-lng-value');
                this._panes.initPosZoomValue    = Wu.DomUtil.get('editor-map-initpos-zoom-value');

                // map controls
                this._panes.controlsWrap                =  Wu.DomUtil.get('editor-map-controls-wrap').parentNode.parentNode;
                this._panes.controlZoom                 =  Wu.DomUtil.get('map-controls-zoom').parentNode.parentNode;
                this._panes.controlDraw                 =  Wu.DomUtil.get('map-controls-draw').parentNode.parentNode;
                this._panes.controlInspect              =  Wu.DomUtil.get('map-controls-inspect').parentNode.parentNode;
                this._panes.controlDescription          =  Wu.DomUtil.get('map-controls-description').parentNode.parentNode;
                this._panes.controlLayermenu            =  Wu.DomUtil.get('map-controls-layermenu').parentNode.parentNode;
                this._panes.controlLegends              =  Wu.DomUtil.get('map-controls-legends').parentNode.parentNode;
                this._panes.controlMeasure              =  Wu.DomUtil.get('map-controls-measure').parentNode.parentNode;
                this._panes.controlGeolocation          =  Wu.DomUtil.get('map-controls-geolocation').parentNode.parentNode;
                this._panes.controlVectorstyle          =  Wu.DomUtil.get('map-controls-vectorstyle').parentNode.parentNode;
                this._panes.controlMouseposition        =  Wu.DomUtil.get('map-controls-mouseposition').parentNode.parentNode;
        },

        _activate : function () {
                Wu.SidePane.Item.prototype._activate.call(this);
                this._update();

        },

        addHooks : function () {
                Wu.SidePane.Item.prototype.addHooks.call(this)

                // click event on buttons
                Wu.DomEvent.on( this._panes.bounds,   'click', this._setBounds,    this );
                Wu.DomEvent.on( this._panes.initPos,  'click', this._setInitPos,   this );
               
                // css effects on buttons
                Wu.DomEvent.on( this._panes.initPos,  'mousedown',      this._buttonMouseDown,  this );
                Wu.DomEvent.on( this._panes.initPos,  'mouseup',        this._buttonMouseUp,    this );
                Wu.DomEvent.on( this._panes.initPos,  'mouseleave',     this._buttonMouseUp,    this );
                Wu.DomEvent.on( this._panes.bounds,   'mousedown',      this._buttonMouseDown,  this );
                Wu.DomEvent.on( this._panes.bounds,   'mouseup',        this._buttonMouseUp,    this );
                Wu.DomEvent.on( this._panes.bounds,   'mouseleave',     this._buttonMouseUp,    this );

                /// map controls
                Wu.DomEvent.on( this._panes.controlZoom,        'mousedown click', this.toggleControl, this);
                Wu.DomEvent.on( this._panes.controlDraw,        'mousedown click', this.toggleControl, this);
                Wu.DomEvent.on( this._panes.controlInspect,     'mousedown click', this.toggleControl, this);
                Wu.DomEvent.on( this._panes.controlDescription, 'mousedown click', this.toggleControl, this);
                Wu.DomEvent.on( this._panes.controlLayermenu,   'mousedown click', this.toggleControl, this);
                Wu.DomEvent.on( this._panes.controlLegends,     'mousedown click', this.toggleControl, this);
                Wu.DomEvent.on( this._panes.controlMeasure,     'mousedown click', this.toggleControl, this);
                Wu.DomEvent.on( this._panes.controlGeolocation, 'mousedown click', this.toggleControl, this);
                Wu.DomEvent.on( this._panes.controlVectorstyle, 'mousedown click', this.toggleControl, this);
                Wu.DomEvent.on( this._panes.controlMouseposition, 'mousedown click', this.toggleControl, this);

        },

        toggleControl : function (e) {
                
                // prevent default checkbox behaviour
                if (e.type == 'click') {
                        Wu.DomEvent.stop(e);
                        return;
                }
                
                // get type (zoom, draw, etc.)
                var item = e.target.getAttribute('which');

                // get checkbox
                var target = Wu.DomUtil.get('map-controls-' + item);

                // do action (eg. toggleControlDraw);
                var on = !target.checked;
                var enable = 'enable' + item.camelize();
                var disable = 'disable' + item.camelize();

                // toggle
                if (on) {
                        console.log('enable: ', enable);
                        // enable control on map
                        Wu.app.MapPane[enable]();

                        // enable control in menu
                        this.enableControl(item);
                } else {
                        
                        // disable control on map
                        Wu.app.MapPane[disable]();
                        
                        // disable control in menu
                        this.disableControl(item);
                }

                // save changes to project
                this.project.controls[item] = on;
                this.project._update('controls');

        },


        disableControl : function (type) {
                
                // get vars
                var target = Wu.DomUtil.get('map-controls-' + type); // checkbox
                var parent = Wu.DomUtil.get('map-controls-title-' + type).parentNode; // div that gets .active 
                var map = Wu.app._map;  // map

                // toggle check and active class
                Wu.DomUtil.removeClass(parent, 'active');
                target.checked = false;
        },

        enableControl : function (type) {
                
                // get vars
                var target = Wu.DomUtil.get('map-controls-' + type); // checkbox
                var parent = Wu.DomUtil.get('map-controls-title-' + type).parentNode; // div that gets .active 
                var map = this.app._map;  // map

                // toggle check and active class
                Wu.DomUtil.addClass(parent, 'active');
                target.checked = true;
        },

    


        _buttonMouseDown : function (e) {
                Wu.DomUtil.addClass(e.target, 'btn-info');
        },

        _buttonMouseUp : function (e) {
                Wu.DomUtil.removeClass(e.target, 'btn-info');
        },

        _setUrl : function (e) {

                // get actual Project object
                var project = Wu.app._activeProject;

                // if no active project, do nothing
                if (!project) { console.log('_activeProejct == undefined'); return; }

                var url = e.target.value;
                console.log('url: ', url);
                project.map.baseLayer.url = url;

                project._update('map');

        },

        _setProvider : function (e) {
                console.log('set provider');
                console.log(e);

                // get actual Project object
                var project = Wu.app._activeProject;

                // if no active project, do nothing
                if (!project) { console.log('_activeProejct == undefined'); return; }

                var prov = e.target.value;

                project.map.baseLayer.provider = prov;
                project._update('map');

        },

        _setTileType : function (e) {
                console.log('set tiletype');
                console.log(e);

                // get actual Project object
                var project = Wu.app._activeProject;

                // if no active project, do nothing
                if (!project) { console.log('_activeProejct == undefined'); return; }
                
                

                // get/set value for checkbox
                if (e.target.checked) {
                        var type = 'vector';
                } else {
                        
                        var type = 'raster';
                        
                        // set TMS for homemade raster
                        project.map.baseLayer.tms = true;
                }

                console.log('YTPE NOW::', type);

                project.map.baseLayer.type = type;
                project._update('map');

        },

       
        _setBounds : function (e) {
                
                // get actual Project object
                var project = Wu.app._activeProject;

                // if no active project, do nothing
                if (!project) { console.log('_activeProejct == undefined'); return; }

                var bounds = Wu.app._map.getBounds();
                var zoom = Wu.app._map.getZoom();

                // write directly to Project
                project.map.bounds = {
                        northEast : {
                                lat : bounds._northEast.lat,
                                lng: bounds._northEast.lng
                        },

                        southWest : {
                                lat : bounds._southWest.lat,
                                lng : bounds._southWest.lng
                        }
                }

                // call save on Project
                project._update('map');

                // call update on view
                this.updateContent();

        },

        _setInitPos : function (e) {

                // get actual Project object
                var project = Wu.app._activeProject;

                // if no active project, do nothing
                if (!project) { console.log('_activeProejct == undefined'); return; }

                // get center and zoom
                var center = Wu.app._map.getCenter();
                var zoom = Wu.app._map.getZoom();

                // write directly to Project
                project.map.initPos = {
                        lat : center.lat,
                        lng : center.lng,
                        zoom : zoom
                }
        
                // call update on Project
                project._update('map');

                // call update on view
                this.updateContent();

        },

        updateContent : function () {
                // update view
                this._update();
        },

        _resetView : function () {

                // reset buttons ?
                //Wu.DomUtil.removeClass(this._panes.bounds,'btn-info');
                //Wu.DomUtil.removeClass(this._panes.initPos,'btn-info');
        },


        _updateBaselayer : function () {

                // create custom select box
                var ret = this.insertSelect(this._panes.baselayerWrap);
                var tit = ret.tit;
                var w = ret.w;

                // set active baselayer
                var cur = this.project.map.baseLayer.url;
               
                // for each mapbox file
                // if (this.project.mapboxFiles) { // todo, remove this if
                //         for (file in this.project.mapboxFiles) {

                this.project.mapboxLayers.forEach(function (f) {

                        //var f =  this.project.mapboxFiles[file];
                        var elem = Wu.DomUtil.create('div', 'select-elem', w);
                        elem.innerHTML = f.name;
                        elem.setAttribute('uuid', f.id);
                        elem.setAttribute('type', 'mapbox');

                        Wu.DomEvent.on(elem, 'mousedown', function (e) {
                                tit.innerHTML = e.target.innerHTML;
                                tit.setAttribute('active', false);
                                w.style.display = 'none';

                                this.setBaseLayer('mapbox', e.target.getAttribute('uuid'));
                        }, this);

                        // set name of current baselayer in title
                        console.log('cur: ' + cur + ' | fid: ' + f.id);
                        if (cur == f.id) { tit.innerHTML = f.name;  }


                }, this);
                
                //         };
                // }       

                 // // for each datalib file
                // this.project.files.forEach(function (file, i, arr) {
                //         var elem = Wu.DomUtil.create('div', 'select-elem', w);
                //         elem.innerHTML = file.name;
                //         elem.setAttribute('uuid', file.uuid);
                //         elem.setAttribute('type', 'datalibrary');

                //         Wu.DomEvent.on(elem, 'mousedown', function (e) {
                //                 tit.innerHTML = elem.innerHTML;
                //                 tit.setAttribute('active', false);
                //                 w.style.display = 'none';

                //                 this.setBaseLayer('datalibrary', file.uuid);
                //         }, this);

                //         // set name of current baselayer in title
                //         console.log('cur: ' + cur + ' | fid: ' + file.uuid);
                //         if (cur == file.uuid) { tit.innerHTML = file.name;  }

                // }, this)
                


        },


        _update : function () {

                // use active project
                this.project = Wu.app._activeProject;

                // update view of this project
                var b = this.project.map.bounds;

                // debug, assure this.project.controls exists
                if (!Wu.Util.isObject(this.project.controls)) {    
                        this.project.controls = {};
                } 
                
                // update baselayer box
                this._updateBaselayer();
                
                // bounds
                this._panes.boundsNELatValue.value = b.northEast.lat;
                this._panes.boundsNELngValue.value = b.northEast.lng;
                this._panes.boundsSWLatValue.value = b.southWest.lat;
                this._panes.boundsSWLngValue.value = b.southWest.lng;

                // init position
                this._panes.initPosLatValue.value = this.project.map.initPos.lat;
                this._panes.initPosLngValue.value = this.project.map.initPos.lng;
                this._panes.initPosZoomValue.value = this.project.map.initPos.zoom;

                // controls
                this._updateControls();

        },

        _updateControls : function () {

                for (c in this.project.controls) {
                        var on = this.project.controls[c];
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


        setBaseLayer : function (type, uuid) {
                console.log('setting baselayer: ', type, uuid);

                // set values
                this.project.map.baseLayer.url = uuid;
                this.project.map.baseLayer.provider = type;
                this.project._update();

                // set it on the map
                Wu.app.MapPane.setBaseLayer(this.project);

                // save
                this.project._update('map');
        },



        insertSelect : function (wrapper) {
                wrapper.innerHTML = '<h4>Base Layer </h4>';
                var div = Wu.DomUtil.createId('div', 'select-baselayer-wrap', wrapper);
                Wu.DomUtil.addClass(div, 'select-wrap');
                var tit = Wu.DomUtil.create('div', 'select-title', div);
                tit.innerHTML = 'Select layer';
                var w = Wu.DomUtil.create('div', 'select-elems', div);

                // dropdown button
                var btn = Wu.DomUtil.create('div', 'select-baselayer dropdown-button', div);

                // on off click on title
                Wu.DomEvent.on(btn, 'mousedown', function (e) {
                        var ac = tit.getAttribute('active');
                        if (ac == 'true') {
                                tit.setAttribute('active', false);
                                w.style.display = 'none';
                        } else {
                                tit.setAttribute('active', true);
                                w.style.display = 'block';
                        }
                }, this);

                var ret = {};
                ret.tit = tit;
                ret.w = w;
                return ret;
                
        }
});





/*
 /$$$$$$$                                                                    /$$             
| $$__  $$                                                                  | $$             
| $$  \ $$  /$$$$$$   /$$$$$$$ /$$   /$$ /$$$$$$/$$$$   /$$$$$$  /$$$$$$$  /$$$$$$   /$$$$$$$
| $$  | $$ /$$__  $$ /$$_____/| $$  | $$| $$_  $$_  $$ /$$__  $$| $$__  $$|_  $$_/  /$$_____/
| $$  | $$| $$  \ $$| $$      | $$  | $$| $$ \ $$ \ $$| $$$$$$$$| $$  \ $$  | $$   |  $$$$$$ 
| $$  | $$| $$  | $$| $$      | $$  | $$| $$ | $$ | $$| $$_____/| $$  | $$  | $$ /$$\____  $$
| $$$$$$$/|  $$$$$$/|  $$$$$$$|  $$$$$$/| $$ | $$ | $$|  $$$$$$$| $$  | $$  |  $$$$//$$$$$$$/
|_______/  \______/  \_______/ \______/ |__/ |__/ |__/ \_______/|__/  |__/   \___/ |_______/ 
                                                                                                                                                                                       
*/

// DocumentsPane
Wu.SidePane.Documents = Wu.SidePane.Item.extend({
        
        type : 'documents',
        title : 'Documents',

       

        initContent : function () {

                // create new fullscreen page, and set as default content
                this._content = Wu.DomUtil.create('div', 'fullpage-documents', Wu.app._appPane);
                
                // create container (overwrite default)
                this._container = Wu.DomUtil.create('div', 'editor-wrapper', this._content);

                // insert template
                this._container.innerHTML = ich.documentsContainer();

                // get element handlers
                this._leftpane = Wu.DomUtil.get('documents-container-leftpane');
                this._folderpane = Wu.DomUtil.get('documents-folder-list');
                this._rightpane = Wu.DomUtil.get('documents-container-rightpane');
                this._textarea = Wu.DomUtil.get('documents-container-textarea');
                this._newfolder = Wu.DomUtil.get('documents-new-folder');

        },

        initFolders : function () {

                this.folders = {};
                var folders = this.project.folders;

                // init local folder object
                folders.forEach(function (folder, i, arr) {
                        this.folders[folder.uuid] = folder;
                }, this);

        },

        addHooks : function () {

                // new folder
                Wu.DomEvent.on( this._newfolder, 'mousedown', this.newFolder, this );

                // bind grande.js text editor
                grande.bind([this._textarea]);
                this.expandGrande();

        },

        expandGrande : function () {

                // add file attachment to grande
                var g = document.getElementsByClassName('g-body')[0];
                var list = g.children[0].children[0].children[0].children[0];
                var gwrap = g.children[0];

                var btn = Wu.DomUtil.create('button', 'file url');
                var selwrap = Wu.DomUtil.create('div', 'grande-project-files-wrap');
                var selbtn = Wu.DomUtil.create('div', 'grande-project-files-btn');
                var files = Wu.DomUtil.create('select', 'grande-project-files');
                selwrap.appendChild(files);
                selwrap.appendChild(selbtn);
                
                btn.innerHTML = 'F';
                list.appendChild(btn);
                list.appendChild(selwrap);


                // get elems
                this._grandeFiles = list;
                this._grandeFilesBtn = btn;
                this._grandeFilesSelect = files;
                this._grandeInsertBtn = selbtn;
                this._grandeFilesWrap = selwrap;
                this._grandeWrap = gwrap;

                // hook
                Wu.DomEvent.on(btn, 'mousedown', this.attachFile, this);

        },

        attachFile : function () {

                console.log('text selll:::::');
                console.log(window.getSelection());

                // get the text node and actual text
                this.textSelection = window.getSelection();
                range = this.textSelection.getRangeAt(0);
                this.textSelectionText = range.cloneContents().firstChild.data;
                console.log('actual text:: ', this.textSelectionText);

                // show file select n button
                this._grandeFilesWrap.style.display = 'block';

                // fill select with files
                var sel = this._grandeFilesSelect;
                sel.innerHTML = ''; // reset
                this.project.files.forEach(function (file, i, arr) {
                        sel.options[sel.options.length] = new Option(file.name, file.uuid);
                }, this)

                //Wu.DomEvent.on(sel, 'blur', this.selectedFile, this);
                Wu.DomEvent.on(this._grandeInsertBtn, 'mousedown', this.selectedFile, this);

        },

        replaceSelection : function (link, text) {

                var range;
                if (this.textSelection.getRangeAt) {
                        range = this.textSelection.getRangeAt(0);
                        range.deleteContents();
                        var a = document.createElement('a');
                        a.innerHTML = text;
                        a.href = link;
                        range.insertNode(a);
                } // https://stackoverflow.com/questions/6251937/how-to-get-selecteduser-highlighted-text-in-contenteditable-element-and-replac     
        },

        selectedFile : function (e) {

                // get selected option
                var sel = this._grandeFilesSelect;
                var fuuid = sel.options[sel.selectedIndex].value;
                var name = sel.options[sel.selectedIndex].text;

                console.log('remember?');
                console.log('fuuid: ', fuuid);
                console.log('name: ', name);
                console.log(window.getSelection());

                // hide file select n button
                this._grandeFilesWrap.style.display = 'none';
                Wu.DomUtil.removeClass(this._grandeWrap, 'active');
                Wu.DomUtil.addClass(this._grandeWrap, 'hide');


                // create link to file (direct download)
                var link = '/api/file/download?file=' + fuuid;

                // insert link
                this.replaceSelection(link, this.textSelectionText);

                // save
                this.saveText();

        },
         
        _activate : function (e) {                
                Wu.SidePane.Item.prototype._activate.call(this);

                // set top
                this.adjustTop();

                // set width
                this.adjustWidth();
               
                // turn off header resizing and icon
                Wu.app.HeaderPane.disableResize();

                // select first title (create fake e object)
                if (this.project.folders.length > 0) {
                        var e = { 'target' : { 'uuid' : this.project.folders[0].uuid }, preventDefault : Wu.Util.falseFn};
                        this.selectFolder(e);
                }
        },

        deactivate : function () {

                // turn off header resizing
                Wu.app.HeaderPane.enableResize();
        },

        adjustTop : function () {
                // debug, for innfelt header
                return;
                // make room for project header
                var project = Wu.app._activeProject;
                if (project) {
                        this._content.style.top = project.header.height + 'px';
                }

                // adjust top of left pane
                this._leftpane.style.top = '-' + project.header.height + 'px';
        },

        adjustWidth : function () {

//	Removed by Jørgen ~ Doing this with CSS, yo
//                this._rightpane.style.width = parseInt(window.innerWidth) - 400 + 'px';
//                this._textarea.style.width = parseInt(window.innerWidth) - 400 + 'px';
        },

        update : function () {

                // use active project
                this.project = Wu.app._activeProject;

                // flush
                this.reset();

                // set folders
                this.createFolders();

                // set top
                this.adjustTop();

                // set width
                this.adjustWidth();

        },

        updateContent : function () {  

                // reset text pane
                this._textarea.innerHTML = '';

                // update         
                this.update();
        },

        newFolder : function () {

                var folder = {
                        'title' : 'Title',
                        'uuid' : Wu.Util.guid('folder'),
                        'content' : 'Text content'
                }

                // update 
                this.project.folders.push(folder);

                // refresh
                this.update();

        },

        createFolders : function () {

                // set folders
                var folders = this.project.folders;

                // create each folder headline
                folders.forEach(function (elem, i, arr) {

                        var folder = elem;
                        folder.el = Wu.DomUtil.create('input', 'documents-folder-item', this._folderpane);
                        folder.el.value = folder.title;
                        folder.el.setAttribute('readonly', 'readonly');
                        folder.el.uuid = folder.uuid;
                       
                        // set hooks
                        Wu.DomEvent.on( folder.el,  'mousedown', this.selectFolder, this );     // select folder
                        Wu.DomEvent.on( folder.el,  'dblclick', this.renameFolder, this );     // select folder

                        // update object
                        this.folders[folder.uuid] = folder;

                }, this);
               



        },

        renameFolder : function (e) {

                // get folder
                var uuid = e.target.uuid;
                var folder = this.folders[uuid];

                // enable editing on input box
                e.target.removeAttribute('readonly'); 
                e.target.focus();

                // save on blur or enter
                Wu.DomEvent.on( e.target,  'blur', this.titleBlur, this );     // save folder title
                Wu.DomEvent.on( e.target,  'keydown', this.titleKey, this );     // save folder title

        },

        titleKey : function (e) {

                // blur on enter
                if (event.which == 13 || event.keyCode == 13) {
                        this.titleBlur();
                }
        },


        titleBlur : function () {

                for (f in this.folders) {
                        var folder = this.folders[f];
                        folder.el.setAttribute('readonly', 'readonly');
                        this.folders[folder.uuid].title = folder.el.value;
                }                                                                                                                                                                                              

                // save
                this._save();

        },

        selectFolder : function (e) {

                e.preventDefault();

                // get folder
                var uuid = e.target.uuid;
                var folder = this.folders[uuid];

                // clear rightpane
                this._textarea.innerHTML = '';
                this._textarea.innerHTML = folder.content;
                this._textarea.fuuid = uuid;
                
                // adjust width
                this.adjustWidth();

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
                if (f == text) { return; }
                
                // update folder object 
                this.folders[this._textarea.fuuid].content = text;
                
                // save
                this._save();
        },

        // save to server
        _save : function () {
                var folders = this.folders;
                
                // convert to array
                this.project.folders = [];
                for (f in folders) {
                        var fo = Wu.extend({}, folders[f]);     // clone 
                        delete fo.el;                           // delete .el on clone only
                        this.project.folders.push(fo);          // update project.folders
                }

                // save project to server
                this.project._update('folders');

                // refresh
                this.update();
        },

      

        reset : function () {

                // reset left pane
                this._folderpane.innerHTML = '';

                // reset object
                this.folders = {};
        }

});



/*
 /$$$$$$$              /$$               /$$       /$$ /$$                                             
| $$__  $$            | $$              | $$      |__/| $$                                             
| $$  \ $$  /$$$$$$  /$$$$$$    /$$$$$$ | $$       /$$| $$$$$$$   /$$$$$$  /$$$$$$   /$$$$$$  /$$   /$$
| $$  | $$ |____  $$|_  $$_/   |____  $$| $$      | $$| $$__  $$ /$$__  $$|____  $$ /$$__  $$| $$  | $$
| $$  | $$  /$$$$$$$  | $$      /$$$$$$$| $$      | $$| $$  \ $$| $$  \__/ /$$$$$$$| $$  \__/| $$  | $$
| $$  | $$ /$$__  $$  | $$ /$$ /$$__  $$| $$      | $$| $$  | $$| $$      /$$__  $$| $$      | $$  | $$
| $$$$$$$/|  $$$$$$$  |  $$$$/|  $$$$$$$| $$$$$$$$| $$| $$$$$$$/| $$     |  $$$$$$$| $$      |  $$$$$$$
|_______/  \_______/   \___/   \_______/|________/|__/|_______/ |__/      \_______/|__/       \____  $$
                                                                                              /$$  | $$
                                                                                             |  $$$$$$/
                                                                                              \______/ 
*/

// DownloadsPane
Wu.SidePane.DataLibrary = Wu.SidePane.Item.extend({

        type : 'dataLibrary',
        title : 'Data Library',

        initContent : function () {

                // create new fullscreen page, and set as default content
                this._content = Wu.DomUtil.create('div', 'data-library', Wu.app._appPane);
                
                // create container (overwrite default)
                this._container = Wu.DomUtil.create('div', 'editor-wrapper', this._content);

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
                this._table = Wu.DomUtil.get('datalibrary-insertrows');
                this._errors = Wu.DomUtil.get('datalibrary-errors');
                this._uploader = Wu.DomUtil.get('upload-container');
                this._deleter = Wu.DomUtil.get('datalibrary-delete-file');
                this._downloader = Wu.DomUtil.get('datalibrary-download-files');
                this._downloadList = Wu.DomUtil.get('datalibrary-download-dialogue');
                this._checkall = Wu.DomUtil.get('checkbox-all');
                this._checkallLabel = Wu.DomUtil.get('label-checkbox-all');

                // init table
                this.initList();

                // init dropzone
                this.initDZ();

                // init download table
                this.initDownloadTable();

        },

        // hooks added automatically on page load
        addHooks : function () {
               
                // delete button
                Wu.DomEvent.on(this._deleter, 'mousedown', this.deleteConfirm, this);

                // download button
                Wu.DomEvent.on(this._downloader, 'mousedown', this.downloadConfirm, this);

                // check all button
                Wu.DomEvent.on(this._checkallLabel, 'mousedown', this.checkAll, this);
               
        },

        deactivate : function () {

                console.log('deactive datalib');
                console.log(this.dz);
               
                this.dz.disable();
                this.disableFullscreenDZ();
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
                                if (ch.checked) { ch.checked = false; }
                        }, this);


                } else {
                        // check all visible
                        var visible = this.list.visibleItems;
                        visible.forEach(function (item, i, arr) {
                                var ch = item.elm.children[0].childNodes[1].children[0];

                                // check
                                if (!ch.checked) { ch.checked = true; }
                        }, this);
                }
        },

        downloadFiles : function () {

                // create list of uuids only
                var fuuids = [];
                this._downloadFileList.forEach(function (file, i, arr) {
                        fuuids.push(file.uuid);
                }, this);

                var json = {
                        'files' : this._downloadFileList, //fuuids,
                        'puuid' : this.project.uuid,
                        'pslug' : this.project.slug
                }
                var json = JSON.stringify(json);

                // post         path          json      callback           this
                Wu.post('/api/file/download', json, this.receivedDownload, this);

        },

        receivedDownload : function (that, response) {
                // this = window

                // set path for zip file
                var path = '/api/file/download?file=' + response + '&type=zip';
                
                // add <a> for zip file
                that._downloadList.innerHTML = ich.datalibraryDownloadReady({'url' : path});
                var btn = Wu.DomUtil.get('download-ready-button');
                Wu.DomEvent.on(btn, 'click', that.downloadDone, that);

        },

        downloadCancel : function () {

                console.log('downloadCancel!');
                
                // clear download just in case
                this._downloadFileList = [];

                // hide
                this._downloadList.style.display = 'none';
        },

        downloadDone : function () {

                // close and re-init
                this.downloadCancel();
                this.initDownloadTable();
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
                        tmp.format = tmp.format.join(', ');     // fix format format
                        tr += ich.datalibraryDownloadRow(tmp);
                }, this);

                // get table and insert
                var table = Wu.DomUtil.get('datalibrary-download-insertrows');
                table.innerHTML = tr;

                // show
                this._downloadList.style.display = 'block';
        },

        getSelected : function () {

                // get selected files
                var checks = [];
                this.project.files.forEach(function(file, i, arr) {
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
                if (checks.length == 0) { return; }

                // confirm dialogue, todo: create stylish confirm
                if (confirm('Are you sure you want to delete these ' + checks.length + ' files?')) {    
                        this.deleteFiles(checks);
                } 
        },

        deleteFiles : function (files) {
                console.log('deleting ', files);
                
                // iterate over files and delete
                var _fids = [];
                files.forEach(function(file, i, arr) {

                        // remove from list
                        this.list.remove('uuid', file.uuid);
                
                        // remove from local project
                        var i;
                        for (i = this.project.files.length - 1; i >= 0; i -= 1) {
                        //this.project.files.forEach(function(f, i, a) {
                                if (this.project.files[i].uuid == file.uuid) {
                                        this.project.files.splice(i, 1);
                                }
                        };

                        // remove from layermenu                // todo: remove from actual menu div too
                        // DO use a reverse for-loop:
                        var i;
                        for (i = this.project.layermenu.length - 1; i >= 0; i -= 1) {
                                if (this.project.layermenu[i].fuuid == file.uuid) {
                                        this.project.layermenu.splice(i, 1);
                                }
                        }
                        

                        // prepare remove from server
                        _fids.push(file._id);

                }, this);

                // save changes to layermenu
                this.project._update('layermenu');                                                                                                                                                                                                   
               
                // remove from server
                var json = {
                    '_fids' : _fids,
                    'puuid' : this.project.uuid
                }
                var string = JSON.stringify(json);
                Wu.save('/api/file/delete', string); 

                


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
                var that = this;

                // create dz
                this.dz = new Dropzone(this._uploader, {
                                url : '/api/upload',
                                createImageThumbnails : false,
                                autoDiscover : false
                                // uploadMultiple : true
                });

                // add fullscreen dropzone
                this.enableFullscreenDZ();                                                                                                                                                                   
                
        },

        enableFullscreenDZ : function () {

                // add fullscreen bridge to dropzone
                Wu.DomEvent.on(document, 'dragenter', this.dropping, this);
                Wu.DomEvent.on(document, 'dragleave', this.undropping, this);
                Wu.DomEvent.on(document, 'dragover', this.dragover, this);
                Wu.DomEvent.on(document, 'drop', this.dropped, this);
        },

        disableFullscreenDZ : function () {

                // remove fullscreen bridge to dropzone
                Wu.DomEvent.off(document, 'dragenter', this.dropping, this);
                Wu.DomEvent.off(document, 'dragleave', this.undropping, this);
                Wu.DomEvent.off(document, 'dragover', this.dragover, this);
                Wu.DomEvent.off(document, 'drop', this.dropped, this);

        },

        refreshDZ : function () {
                var that = this;

                // clean up last dz
                this.dz.removeAllListeners();

                // set project uuid for dropzone
                this.dz.options.params.project = this.project.uuid;

                // set dz events
                this.dz.on('drop', function () { 
                        console.log('drop'); 
                });

                this.dz.on('dragenter', function () { 
                        console.log('dragenter'); 
                });

                this.dz.on('addedfile', function (file) { 

                        // count multiple files
                        that.filecount += 1;

                        // show progressbar
                        that.progress.style.opacity = 1;

                        // show fullscreen file info
                        if (!that._fulldrop) {
                                that.fullOn();
                                that.fullUpOn();
                        }
                });


                this.dz.on('complete', function (file) {
                        console.log('complete');

                        // count multiple files
                        that.filecount -= 1;

                        // clean up
                        that.dz.removeFile(file);
                      
                });

                // this.dz.on('totaluploadprogress', function (progress, totalBytes, totalSent) { 
                //         // set progress
                //         console.log('progress: ', progress);
                //         that.progress.style.width = progress + '%';
                // });

                this.dz.on('uploadprogress', function (file, progress) {
                        // set progress
                        that.progress.style.width = progress + '%';
                })                                                                                                                                                                                                               

                this.dz.on('success', function (err, json) {
                        // parse and process
                        var obj = Wu.parse(json);
                        if (obj) { that.uploaded(obj); }
                });

                this.dz.on('complete', function (file) {
                        console.log('complete!', file);
                        console.log('filecount: ', that.filecount);

                        if (!that.filecount) {
                                // reset progressbar
                                that.progress.style.opacity = 0;
                                that.progress.style.width = '0%';

                                // reset .fullscreen-drop
                                that.fullUpOff();
                                that.fulldropOff();
                                that._fulldrop = false;
                        }
                });

                // this.dz.on('successmultiple', function (err, json) {
                //         console.log('successmultiple!')
                //         console.log('err: ', err);
                //         console.log('json: ', json);
                // })

                           

        },

        
        // fullscreen when started uploading                                            // TODO: refactor fullUpOn etc..
        fullUpOn : function () {                                                        //       add support for multiple files
                // transform .fullscreen-drop                                           //       bugtest more thourougly
                Wu.DomUtil.addClass(this.fulldrop, 'fullscreen-dropped');
        },
        fullUpOff : function () {
                Wu.DomUtil.removeClass(this.fulldrop, 'fullscreen-dropped');
        },

        // fullscreen for dropping on
        fulldropOn : function (e) {

                // turn on fullscreen-drop
                this.fullOn();
                
                // remember drop elem
                this._fulldrop = e.target.className;
        },
        fulldropOff : function () {
                // turn off .fullscreen-drop
                this.fullOff();
        },

        // fullscreen for dropping on
        fullOn : function () {
                // turn on fullscreen-drop
                this.fulldrop.style.opacity = 0.9;
                this.fulldrop.style.zIndex = 1000;
        },

        fullOff : function () {
                var that = this;
                this.fulldrop.style.opacity = 0;
                setTimeout(function () {        // hack for transitions
                         that.fulldrop.style.zIndex = -10;      
                }, 200);
        },

        dropping : function (e) {
                e.preventDefault();
            
                // show .fullscreen-drop
                this.fulldropOn(e);
        },

        undropping : function (e) {
                e.preventDefault();
                var t = e.target.className;

                // if leaving elem that started drop
                if (t == this._fulldrop) {
                        this.fulldropOff(e);
                }
                
        },

        dropped : function (e) {
                e.preventDefault();
                
                // transform .fullscreen-drop
                this.fullUpOn();

                // fire dropzone
                this.dz.drop(e);
        },

        dragover : function (e) {
                // needed for drop fn
                e.preventDefault();
        },

        handleError : function (error) {
                console.log('handling error');
                var html = '';
                error.forEach(function (err, i, arr) {
                        html += err.error;
                        html += '<br>';
                })
                this._errors.innerHTML = html;
                this._errors.style.display = 'block';
        },

        // process file
        uploaded : function (record) {
                console.log('uploaded:');
                console.log('file: ', record);

                // handle errors
                if (record.errors.length > 0) {
                        this.handleError(record.errors);
                }

                // return if nothing
                if (!record.files) { return; }

                // add
                record.files.forEach(function (file, i, arr) {
                        // add to table
                        this.addFile(file);
 
                        // add to project locally (already added on server)
                        this.project.files.push(file);
                }, this);

        },

        addFile : function (file) {

                // clone file object
                var tmp = Wu.extend({}, file);   
                
                // add record (a bit hacky, but with a cpl of divs inside the Name column)
                tmp.name = ich.datalibraryTablerowName({
                        name : tmp.name || 'Title',
                        description : tmp.description || 'Description',
                        nameUuid : 'name-' + tmp.uuid,
                        descUuid : 'description-' + tmp.uuid,
                });

                // clean arrays
                tmp.files = tmp.files.join(', ');
                tmp.keywords = tmp.keywords.join(', ');
                tmp.createdDate = new Date(tmp.createdDate).toDateString();

                // add file to list.js
                var ret = this.list.add(tmp);
                
                // hack: manually add uuids
                ret[0].elm.id = tmp.uuid;                              // <tr>
                var c = ret[0].elm.children[0].children[0].children;    
                c[0].id = 'checkbox-' + tmp.uuid;                      // checkbox
                c[1].setAttribute('for', 'checkbox-' + tmp.uuid);      // label

                // add hooks for editing
                this.addEditHooks(tmp.uuid);
        },

        addEditHooks : function (uuid) {

                // get <input>'s
                var title = Wu.DomUtil.get('name-' + uuid);
                var desc = Wu.DomUtil.get('description-' + uuid);

                // set click hooks on title and description
                Wu.DomEvent.on( title,  'mousedown mouseup click', this.stop, this ); 
                Wu.DomEvent.on( title,  'dblclick', this.rename, this );     // select folder
                Wu.DomEvent.on( desc,  'mousedown mouseup click', this.stop, this ); 
                Wu.DomEvent.on( desc,  'dblclick', this.rename, this );     // select folder

        },

        // to prevent selected text
        stop : function (e) {
                console.log('stop!');   // not working!
                e.preventDefault();
                e.stopPropagation();
        },

        rename : function (e) {

                // enable editing on input box
                e.target.removeAttribute('readonly'); 
                e.target.focus();

                // set key
                e.target.fieldKey = e.target.id.split('-')[0];

                // save on blur or enter
                Wu.DomEvent.on( e.target,  'blur', this.editBlur, this );     // save folder title
                Wu.DomEvent.on( e.target,  'keydown', this.editKey, this );     // save folder title

        },


        editKey : function (e) {

                // blur on enter
                if (event.which == 13 || event.keyCode == 13) {
                        e.target.blur();
                }
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
                this.project.files.forEach(function(file, i, arr) {

                        // iterate and find hit
                        if (file.uuid == fuuid) {
                                file[key] = value;
                        }

                }, this);

                // hack: update list item manually (for instant sorting)                // TODO!
                // this.list.items.forEach(function (item, i, arr) {                    // prob. values in element not updated in html

                //         if (item.elm.id == fuuid) {
                //                 var html = item.elm.
                //                 item.
                //         }

                // }, this);

                // refresh list
                this.list.update();     // todo: funky behavior when changing name, doesn't reflect (ie. sort works on old value)

                // save to server
                this._save(fuuid, key);

        },

        _save : function (fuuid, key) {

                // save the file
                this.project.files.forEach(function(file, i, arr) {
                     
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
        },

        

        updateContent : function () {
                this.update();
        },

        update : function () {

                // use active project
                this.project = Wu.app._activeProject;

                // flush
                this.reset();

                // refresh dropzone
                this.refreshDZ();

                // refresh table entries
                this.refreshTable();
        },

        refreshTable : function () {

                // return if empty filelist
                if (!this.project.files) { return; }

                // enter files into table
                this.project.files.forEach(function (file, i, arr) {
                       this.addFile(file);
                }, this);

                // sort list by name by default
                this.list.sort('name', {order : 'asc'});
        },

        reset : function () {

                // clear table
                this.list.clear();

                // remove uploading, in case bug
                this.fullOff();
                this.fulldropOff();

        }

});






/*
 /$$   /$$                           /$$                    
| $$  | $$                          | $$                    
| $$  | $$  /$$$$$$   /$$$$$$   /$$$$$$$  /$$$$$$   /$$$$$$ 
| $$$$$$$$ /$$__  $$ |____  $$ /$$__  $$ /$$__  $$ /$$__  $$
| $$__  $$| $$$$$$$$  /$$$$$$$| $$  | $$| $$$$$$$$| $$  \__/
| $$  | $$| $$_____/ /$$__  $$| $$  | $$| $$_____/| $$      
| $$  | $$|  $$$$$$$|  $$$$$$$|  $$$$$$$|  $$$$$$$| $$      
|__/  |__/ \_______/ \_______/ \_______/ \_______/|__/      
*/
// Header
// Wu.SidePane.Header = Wu.SidePane.Item.extend({

//         type : 'header',

//         updateContent : function (project) {

//                 // reset view
//                 this._resetView();

//                 // update values
//                 this._updateModel(project);

//                 // update view
//                 this._updateView();

//         },

//         _updateModel : function (project) {

//                 this._header = project.header; 
//                 this._data = {
//                         headerTitle : this._header.title,
//                         headerSubtitle : this._header.subtitle,
//                         headerLogo : this._header.logo,
//                         headerCss : this._header.css      
//                 }

//         },

//         _updateView : function () {                 
//                 this._container.innerHTML = ich.editorHeader(this._data);
//         },

//         _resetView : function () {

//                 this._container.innerHTML = '';
//         }

// });







/*
$$\   $$\                                         
$$ |  $$ |                                        
$$ |  $$ | $$$$$$$\  $$$$$$\   $$$$$$\   $$$$$$$\ 
$$ |  $$ |$$  _____|$$  __$$\ $$  __$$\ $$  _____|
$$ |  $$ |\$$$$$$\  $$$$$$$$ |$$ |  \__|\$$$$$$\  
$$ |  $$ | \____$$\ $$   ____|$$ |       \____$$\ 
\$$$$$$  |$$$$$$$  |\$$$$$$$\ $$ |      $$$$$$$  |
 \______/ \_______/  \_______|\__|      \_______/ 
                                                  
*/
Wu.SidePane.Users = Wu.SidePane.Item.extend({

        type : 'users',
        title : 'Users',


});






// Wu.SidePane.Layers = Wu.SidePane.Item.extend({


//         type : 'layers',
//         title : 'Layers',


//         _initContent : function () {
//                 console.log('init sources');
                
//                 //this._update();

//         },

       

//         updateContent : function (project) {

//                 this._reset();

//                 this._update()

//                 console.log('SidePane.Sources updated');

//         },




// })

// /*
//   /$$$$$$                                                             
//  /$$__  $$                                                            
// | $$  \__/  /$$$$$$  /$$   /$$  /$$$$$$   /$$$$$$$  /$$$$$$   /$$$$$$$
// |  $$$$$$  /$$__  $$| $$  | $$ /$$__  $$ /$$_____/ /$$__  $$ /$$_____/
//  \____  $$| $$  \ $$| $$  | $$| $$  \__/| $$      | $$$$$$$$|  $$$$$$ 
//  /$$  \ $$| $$  | $$| $$  | $$| $$      | $$      | $$_____/ \____  $$
// |  $$$$$$/|  $$$$$$/|  $$$$$$/| $$      |  $$$$$$$|  $$$$$$$ /$$$$$$$/
//  \______/  \______/  \______/ |__/       \_______/ \_______/|_______/ 
// */
// // Sources
// Wu.SidePane.Sources = Wu.SidePane.Item.extend({

//         type : 'sources',
//         title : 'Layers',


//         _initContent : function () {
//                 console.log('init sources');
                
//                 //this._update();

//         },

       

//         updateContent : function (project) {

//                 this._reset();

//                 this._update()

//                 console.log('SidePane.Sources updated');

//         },

      
//         _update : function () {
//                 console.log('Sources update()');
               
//                 // reset first
//                 this._reset();

//                 // make containers
//                 this._make();

//                 // fill in with sources
//                 this._fill();

               
//         },

//          _reset : function () {
//                 if (this._dzPane) { Wu.DomUtil.remove(this._dzPane);}
//                 if (this._containerPane) { Wu.DomUtil.remove(this._containerPane); }
                

//                 this._dzPane = '';
//                 this._dz = '';
//                 this._sources = Wu.app.Sources;
//         },

//         add : function (source) {
//                 console.log('adding source');

//                 // add to user list 
//                 var div = this._create(source);
//                 Wu.DomUtil.addClass(div, 'new');        // debug
//                 this._userPane.appendChild(div);

//                 // // add to project list
//                 // var pdiv = this._create(source);
//                 // Wu.DomUtil.addClass(pdiv, 'new');       // debug
//                 // this._projectPane.appendChild(pdiv);
              
               
//         },


//         _make : function () {

//                 // create panes
//                 // dropzone
//                 this._dzPane = Wu.DomUtil.create('div', 'dropzone-pane', this._container);
//                 this._dzPane.innerHTML = 'Upload';
//                 this._dz = this._newDropzone(this._dzPane);

//                 // error container
//                 this._errorPane = Wu.DomUtil.create('div', 'sources-error-pane', this._container);
                
//                 // sources container
//                 this._containerPane = Wu.DomUtil.create('div', 'sources-pane', this._container);
                
//                 // user sources container
//                 this._userPane = Wu.DomUtil.create('div', 'sources-pane-user', this._containerPane);
                
//                 // project sources container
//                 //this._projectPane = Wu.DomUtil.create('div', 'sources-pane-project', this._containerPane);

               

//         },

//         _fill : function () {

//                 // fill user sources
//                 this._fillUserSources();

//                 // fill project sources
//                // this._fillProjectSources();

//                 // fill client sources
//                 // this._fillClientSources();

//         },

//         _fillUserSources : function () {

//                 // create file list
//                 for (s in this._sources) {
//                        var source = this._sources[s];    // Wu.Source's loaded earlier

//                        // create div for source in list
//                        var div = this._create(source);
                       
//                        // push div
//                        this._userPane.appendChild(div);
//                 }
//         },

//         // _fillProjectSources : function () {

//         //         var project = Wu.app._activeProject;
//         //         if (!project) { console.log('no project to fill in soruces from'); return;}
                
//         //         // create file list
//         //         for (s in this._sources) {
//         //                 var source = this._sources[s];    // Wu.Source's loaded earlier

//         //                 for (p in source.access.projects) {
//         //                         var uuid = source.access.projects[p];
//         //                         if (project.uuid == uuid) {
                
//         //                                 // create div for source in list
//         //                                 var div = this._create(source);
                               
//         //                                 // push div
//         //                                 this._projectPane.appendChild(div);
                                        

//         //                         }
//         //                 }
                       

                       
//         //         }
//         // },

//         _create : function (source) {
                
//                 console.log('_create source :::::::::::');
//                 console.log(source);

//                 // create div for source item
//                 var div = Wu.DomUtil.create('div', 'sources-item');      
//                 div.innerHTML = ich.editorSourcesItem(source);
//                 var id = 'source-' + source.uuid;
                
//                 // add as layer button
//                 if (source.type == 'geojson') {
//                         // add as layer button
//                         var button = Wu.DomUtil.create('div', 'sources-add-to-layer');
//                         button.innerHTML = 'Add as layer...';
//                         div.appendChild(button);

//                         // add hook
//                         Wu.DomEvent.on( button, 'mousedown', this._addLayer, source );
//                 }       



//                 // add file list
//                 var ul = Wu.DomUtil.createId('ul', id);
//                 div.appendChild(ul);
//                 var lis = [];
//                 for (file in source.files) {
//                         var f = {'file' : source.files[file]};
//                         lis.push(ich.editorSourcesFile(f));
//                 }

//                 ul.innerHTML = lis.join(' ');

//                 return div;
//         },


//         _newDropzone : function (pane) {
//                 var that = this;

//                 if ('_activeProject' in Wu.app) {
//                         console.log('param1');
//                         var params = {
//                                 'project' : Wu.app._activeProject.uuid
//                         } 
//                 } else {
//                         console.log('param2');
//                         var params = { 'project' : 'dickwad'};
//                 }
                

//                 var dz = new Dropzone(pane, {
//                                 url : '/api/upload',
//                                 createImageThumbnails : false,
//                                 params : params
//                 });


//                 dz.on('drop', function () { console.log('drop'); })
//                 dz.on('complete', function (file) {
//                         console.log('complete');
//                         dz.removeFile(file);
//                 });

//                 dz.on('uploadprogress', function (err, progress) { console.log(progress); })

//                 dz.on('success', function (err, json) {
//                         console.log('dropzone upload success');
//                         var obj = Wu.parse(json);
//                         if (obj) { that._uploaded(obj); }
//                 });

//                 // return 
//                 return dz;

//         },

//         _addLayer : function (e) {

//                 console.log('_addLayer!', e);
//                 console.log(this);  // <- source


//                 // add source as layer to project
//                 var source = this;
//                 var project = Wu.app._activeProject;
//                 project.addLayer(source);

//         },

//         edit : function (source) {
//                 console.log('edit mode');

//         },

//         _uploaded : function (record) {
//                 console.log('_uploaded');
//                 console.log('file: ', record);

//                 // handle errors
//                 if (record.errors.length > 0) {
//                         console.log('Error uploading source.')
//                         console.log(record.errors);
                        
//                         // add error message to pane : TODO!
//                         record.errors.forEach(function (elem, i, arr) {
//                                 var msg = '<div class="sources-error-msg">Error: ' + elem.error + '</div>';
//                                 msg += '<div class="sources-error-file">' + elem.file + '</div>';
//                                 this._errorPane.innerHTML = msg;
//                         }, this);
                        
//                 }

//                 // no files, return
//                 if (record.files.length == 0) {
//                         console.log('nothing, sorry.');
//                         return;
//                 }


//                 // update with new source(s)
//                 for (f in record.files) {
//                         var rec = record.files[f];

//                         this._sources = Wu.app.Sources;

//                         // add new source
//                         this._sources[rec.uuid] = new Wu.Source(rec, this);
                        
//                         // add to dom
//                         this.add(rec);

//                         // set to edit mode
//                         this.edit(rec); 
                      
                        
//                         // load layer automatically 
//                         // (TODO: a settings option)
                        
//                         // get active project
//                         var p = Wu.app._activeProject.uuid;
                        
//                                 try {
                        
//                         var layer = Wu.app.Projects[p].layers[rec.uuid]._layer;
                        
//                                 } catch (e) {console.log('if layer error: ', e)};
                        
                        
//                         if (layer) {
//                                 console.log('this layer load()!');

//                                 layer.load();   // load data
//                                 layer.add();    // add to map
//                         }



                       

                        
//                 }

//         }

// });



/*
 /$$                                                        
| $$                                                        
| $$        /$$$$$$  /$$   /$$  /$$$$$$   /$$$$$$   /$$$$$$$
| $$       |____  $$| $$  | $$ /$$__  $$ /$$__  $$ /$$_____/
| $$        /$$$$$$$| $$  | $$| $$$$$$$$| $$  \__/|  $$$$$$ 
| $$       /$$__  $$| $$  | $$| $$_____/| $$       \____  $$
| $$$$$$$$|  $$$$$$$|  $$$$$$$|  $$$$$$$| $$       /$$$$$$$/
|________/ \_______/ \____  $$ \_______/|__/      |_______/ 
                     /$$  | $$                              
                    |  $$$$$$/                              
                     \______/                               */

// Layermenu in the Editor 
Wu.SidePane.Layers = Wu.SidePane.Item.extend({

        type : 'layers',                                // list of sources available to this user/project/client
        //title : 'Layermenu',

        initContent : function () {

                // create from template
                this._container.innerHTML = ich.layersWrapper();

                // get panes
                this._layersWrapper = Wu.DomUtil.get('layers-wrapper');
                this._libaryWrapper = Wu.DomUtil.get('layers-library-browser');
                this._layerList = Wu.DomUtil.get('layers-library-list');
                this._browserLibrary = Wu.DomUtil.get('layers-library-browser-datalayers');
                this._browserMapbox = Wu.DomUtil.get('layers-library-browser-mapbox');
                this._libraryPane = Wu.DomUtil.get('layers-library'); // list of local file
                this._mapboxPane = Wu.DomUtil.get('layers-mapbox');     // list of mapbox
                this._mapboxImportOk = Wu.DomUtil.get('import-mapbox-layers-ok'); // import mapbox account btn 
                this._mapboxImportInput = Wu.DomUtil.get('import-mapbox-layers');
                this._mapboxList = Wu.DomUtil.get('layers-mapbox-list-wrap');

                this._mapboxConnectDrop = Wu.DomUtil.get('editor-layers-connect-mapbox-more');
                this._mapboxConnectDropp = Wu.DomUtil.get('editor-layers-connect-mapbox');
                this._datalibUploadDrop = Wu.DomUtil.get('editor-layers-upload-more');
                this._datalibUploadDropp = Wu.DomUtil.get('editor-layers-upload');

                // add middle level menuitem -- hack
                this._middleItem = Wu.DomUtil.create('div', 'middle-item');
                this._middleItem.innerHTML = 'Menu Folder';
                this._layersWrapper.insertBefore(this._middleItem, this._libraryPane);

        },

        addHooks : function () {

                Wu.DomEvent.on(this._browserMapbox,     'mousedown',    this.selectBrowserMapbox, this);
                Wu.DomEvent.on(this._browserLibrary,    'mousedown',    this.selectBrowserLibrary, this);
                Wu.DomEvent.on(this._mapboxImportOk,    'mousedown',    this.importMapboxAccount, this);
                Wu.DomEvent.on(this._mapboxImportInput, 'keydown',      this.mapboxInputKeydown, this);

                Wu.DomEvent.on(this._mapboxConnectDrop, 'mousedown',    this.toggleDropdown, this);
                Wu.DomEvent.on(this._datalibUploadDrop, 'mousedown',    this.toggleDropdown, this);
                //Wu.DomEvent.on(this._mapboxConnectDrop, 'mousedown',    this.toggleDropdown, this);
                //Wu.DomEvent.on(this._datalibUploadDrop, 'mousedown',    this.toggleDropdown, this);

                // menu folder item
                Wu.DomEvent.on(this._middleItem, 'mousedown', this.addMenuFolder, this);

        },

        addMenuFolder : function () {
                console.log('adding menu folder!');
                var lm = {
                        fuuid : 'layermenuFolder-' + Wu.Util.guid(),
                        title : 'New folder',
                        layerType : 'menufolder',
                        pos : 2
                }

                Wu.app.MapPane.layerMenu.addMenuFolder(lm);

                // save
                // var lm = {
                //         fuuid : file.uuid,
                //         title : file.name,
                //         pos : 1,
                //         layerType : 'datalibrary'
                // }

                this.project.layermenu.push(lm);

                console.log('====mb=> pushing to layermenu', lm);
                console.log('this.project.layermenu', this.project.layermenu);
                
                // save to server
                this.project._update('layermenu');

        },

        toggleDropdown : function (e) {
                var wrap = e.target.nextElementSibling;
                    
                // toggle open/close
                if (Wu.DomUtil.hasClass(wrap, 'hide')) {
                        Wu.DomUtil.removeClass(wrap, 'hide');
                        Wu.DomUtil.addClass(e.target, 'rotate180');
                } else {
                        Wu.DomUtil.addClass(wrap, 'hide');
                        Wu.DomUtil.removeClass(e.target, 'rotate180');
                }

        },

        mapboxInputKeydown: function (e) {
                 // blur and go on enter
                if (event.which == 13 || event.keyCode == 13) {
                        e.target.blur();
                        this.getMapboxAccount()
                }
        },

        selectBrowserMapbox : function () {
                this._mapboxPane.style.display = 'block';
                this._libraryPane.style.display = 'none';
        },

        selectBrowserLibrary : function () {
                this._mapboxPane.style.display = 'none';
                this._libraryPane.style.display = 'block';
        },

        update : function (project) {   // todo: careful with passing projects, perhaps better to get from global SidePane source

                var project = this.project || project;
                // update layers after new additon
                this.updateContent(project);

        },

        updateContent : function (project) {

                // reset view
                this._reset();

                // set project
                this.project = project;

                // update view
                this._update();

        },

        _update : function () {

                // layermenu
                this.initLayers();

                // mapbox layers
                this.initMapboxLayers();

                // show active layers
                this.markActiveLayers();

        },

        _reset : function () {

                this._layerList.innerHTML = '';
                this._mapboxList.innerHTML = '';
                this.mapboxFiles = {};
                this.mapboxUsers = {};
                this.selectBrowserLibrary(); // set data library as default pane
        },


        markActiveLayers : function () {

                // mark active mapbox layers
                this.project.layermenu.forEach(function (layer) {

                        if (layer.layerType == 'datalibrary') {
                                
                                // tag item active
                                var check = 'layerItem-' + layer.fuuid;
                                var div = Wu.DomUtil.get(check).parentNode;
                                Wu.DomUtil.addClass(div, 'active-layer');

                        } else if (layer.layerType == 'mapbox') {
                                
                                // tag item active
                                var check = 'layerMapboxItem-' + layer.fuuid;
                                var div = Wu.DomUtil.get(check).parentNode;
                                Wu.DomUtil.addClass(div, 'active-layer');
                        }

                        

                }, this);
        },

        initMapboxLayers : function () {

                // ordem e progresso
                this.parseMapboxLayers();

                // update DOM
                this.updateMapboxDOM();

        },

        initLayers : function () {

                // get local layers
                var layers = [];
                this.project.files.forEach(function (file, i, arr) {
                        if (file.type == 'layer') {
                                layers.push(file);
                                this.addLayer(file);
                        }
                }, this);

                // refresh draggable
                this.initDraggable();

        },

        resetDraggable : function () {

                // remove hooks
                var bin = Wu.DomUtil.get('layer-menu-inner-content');
                if (bin) {
                        Wu.DomEvent.off(bin, 'dragover', this.drag.over, this);
                        Wu.DomEvent.off(bin, 'dragleave', this.drag.leave, this);
                        Wu.DomEvent.off(bin, 'drop', this.drag.drop, this);
                }
        },


        // dragging of layers to layermenu
        drag : {

                start : function (e) {
                        var el = e.target;
                        console.log('drag start: ', e);
                        e.dataTransfer.setData('uuid', el.id); // set *something* required otherwise doesn't work
                },

                drop : function (e) {
                        if (e.stopPropagation) e.stopPropagation(); // stops the browser from redirecting...why???

                        var el = document.getElementById(e.dataTransfer.getData('uuid'));

                        // get file uuid and add to layer menu 
                        var fuuid = el.getAttribute('fuuid');
                        var type = el.getAttribute('type');

                        // add
                        this.addLayerToMenu(fuuid, type);

                        // clear visual feedback
                        Wu.DomUtil.removeClass(Wu.DomUtil.get('layer-menu-inner-content'), 'over');

                        return false; // irrelevant probably
                },

                over : function (e) {
                        if (e.preventDefault) e.preventDefault(); // allows us to drop

                        // set visual
                        Wu.DomUtil.addClass(Wu.DomUtil.get('layer-menu-inner-content'), 'over');
                        
                        return false;
                },

                leave : function (e) {
                        // clear visual
                        Wu.DomUtil.removeClass(Wu.DomUtil.get('layer-menu-inner-content'), 'over');
                }
        },
       
        initDraggable : function () {

                this.resetDraggable();  // needed? seems not.

                // iterate over all layers
                var items = document.getElementsByClassName('layer-item');
                for (var i = 0; i < items.length; i++) {
                        var el = items[i];
                        
                        // set attrs
                        el.setAttribute('draggable', 'true');
                        el.id = Wu.Util.guid();
                        
                        // set dragstart event
                        Wu.DomEvent.on(el, 'dragstart', this.drag.start, this);
                };

                // set hooks
                var bin = Wu.DomUtil.get('layer-menu-inner-content');
                if (bin) {
                        Wu.DomEvent.on(bin, 'dragover', this.drag.over, this);
                        Wu.DomEvent.on(bin, 'dragleave', this.drag.leave, this);
                        Wu.DomEvent.on(bin, 'drop', this.drag.drop, this);
                } 


        },


        removeLayerFromMenu : function (fuuid, type) {

                console.log('__________removeLayerFromMenu_____________', fuuid, type);                
                console.log('this.project.layermenu', this.project.layermenu);

                var i = _.findIndex(this.project.layermenu, {'fuuid' : fuuid});
               
                if (!i < 0) {
                        var i = _.findIndex(this.project.layermenu, {'id' : fuuid});    // mapbox
                }

                // remove from layermenu object
                this.project.layermenu.splice(i, 1);
               
                // remove from layermenu DOM
                Wu.app.MapPane.layerMenu.remove(fuuid);

                // save
                this.project._update('layermenu');

                console.log('____end______removeLayerFromMenu______end_______');

        },

        // drag-n drop
        addLayerToMenu : function (fuuid, type) {

                // add from datalibrary
                if (type == 'datalibrary') {
                        // get file,  add to layermenu
                        var file = this.getFileFromUuid(fuuid);
                        console.log('dl file: ', file);
                        
                        // add to layermenu
                        Wu.app.MapPane.layerMenu.addFromFile(file);

                        // tag item active
                        var check = 'layerItem-' + fuuid;
                        var div = Wu.DomUtil.get(check).parentNode;
                        Wu.DomUtil.addClass(div, 'active-layer');

                        // save
                        var lm = {
                                fuuid : file.uuid,
                                title : file.name,
                                pos : 1,
                                layerType : 'datalibrary'
                        }

                        this.project.layermenu.push(lm);

                        console.log('====mb=> pushing to layermenu', lm);
                        console.log('this.project.layermenu', this.project.layermenu);
                        
                        // save to server
                        this.project._update('layermenu');

                        return;
                }

                // add from mapbox
                if (type == 'mapbox') {

                        // find layer in mapbox jungle
                        console.log('this.mapboxLayers: ', this.mapboxLayers);  // TODO: rewrite with _.find
                        var found = [];
                        for (l in this.mapboxLayers) {
                                var account = this.mapboxLayers[l];
                                account.forEach(function (layer) {
                                        if (layer.id == fuuid) { found = layer; }
                                })
                        }
                        if (!found) { 
                                console.log('that layer is not here????'); 
                                return;
                        }
                               
                        // add to layermenu
                        Wu.app.MapPane.layerMenu.addFromMapbox(found);
                        
                        // tag item active
                        var check = 'layerMapboxItem-' + fuuid;
                        var div = Wu.DomUtil.get(check).parentNode;
                        Wu.DomUtil.addClass(div, 'active-layer');

                        // save layermenu
                        var lm = {
                                fuuid : found.id,
                                title : found.name,
                                pos : 1,
                                layerType : 'mapbox'
                        }

                        this.project.layermenu.push(lm);

                        console.log('====mb=> pushing to layermenu', lm);

                        // save to server
                        this.project._update('layermenu');

                        return;
                }

        },

        getFileFromUuid : function (fuuid) {
                var file = {};
                this.project.files.forEach(function (f, i, arr) {
                        if (fuuid == f.uuid) {  file = f; }
                }, this);
                return file;
        },

        addLayer : function (file) {

                var div = Wu.DomUtil.create('div', 'layer-item');
                div.setAttribute('draggable', true);
                div.setAttribute('fuuid', file.uuid);
                div.setAttribute('type', 'datalibrary');
                div.innerHTML = ich.layersItem(file);
                this._layerList.appendChild(div);

                // add to layermenu on click
                Wu.DomEvent.on(div, 'click', this.toggleLayer, this);

        },


        _activate : function () {
                Wu.SidePane.Item.prototype._activate.call(this)

                this.update();
        },


        // on click when adding new mapbox account
        importMapboxAccount : function (e) {

                // get username
                var username = this._mapboxImportInput.value;

                // get mapbox account via server
                this.getMapboxAccount(username);

                // clear input box
                this._mapboxImportInput.value = '';

        },

        getMapboxAccount : function (username) {
                
                // get mapbox account from server
                // ie, send username to server, get mapbox parsed back
                var data = {
                        'username' : username,
                        'projectId' : this.project.uuid
                }
                // post         path                            json                                   callback      this
                Wu.post('/api/util/getmapboxaccount', JSON.stringify(data), this.gotMapboxAccount, this);

        },

        parseMapboxLayers : function (layers, fresh) {

                var layers = layers || this.project.mapboxLayers;

                // push into an orderly object
                this.mapboxLayers = this.mapboxLayers || {};
                layers.forEach(function (layer, i, arr) {
                        this.mapboxLayers[layer.username] = this.mapboxLayers[layer.username] || [];
                        this.mapboxLayers[layer.username].push(layer);
                        
                        // add to project 
                        if (fresh) this.project.mapboxLayers.push(layer);  //TODO could contain duplicates
                
                }, this);

                // remove possible duplicates
                this.removeMapboxDuplicates();

        },

        removeMapboxDuplicates : function () {
                
                // remove possible duplicates
                this.project.mapboxLayers = _.uniq(this.project.mapboxLayers);

                // remove dups in local 
                for (a in this.mapboxLayers) {
                        this.mapboxLayers[a] = _.uniq(this.mapboxLayers[a]);
                }

        },

        // returned from server getting a mapbox account
        gotMapboxAccount : function (that, response) {

                var layers = JSON.parse(response);

                // check if empty
                if (!layers) { console.log('seems empty'); return; }
               
                // ordem e progresso
                that.parseMapboxLayers(layers, true); // and add to project

                // update DOM
                that.updateMapboxDOM();

                // save to project
                that.project._update('mapboxLayers');

        },

        // just update DOM with existing mapbox accounts
        updateMapboxDOM : function () {

                console.log('updateMapboxDOM; this.mapboxLayers: ', this.mapboxLayers);

                // update DOM in project with all mapbox accounts and layers
                this._mapboxList.innerHTML = ''; // reset
                for (account in this.mapboxLayers) {

                        // create account header
                        var div = Wu.DomUtil.create('div', 'mapbox-list-item');
                        div.innerHTML = ich.mapboxListWrapper({'name' : account});    
                        this._mapboxList.appendChild(div);
                        var wrap = Wu.DomUtil.get('layers-mapbox-list-' + account);

                        // fill in with layers
                        var layers = this.mapboxLayers[account];
                        layers.forEach(function (layer) {

                                // create and append layer to DOM list
                                var div = Wu.DomUtil.create('div', 'layer-item');
                                div.setAttribute('draggable', true);
                                div.setAttribute('fuuid', layer.id);
                                div.setAttribute('type', 'mapbox');
                                div.innerHTML = ich.layersMapboxItem(layer);
                                wrap.appendChild(div);

                                // add to layermenu on click
                                Wu.DomEvent.on(div, 'click', this.toggleLayer, this);

                        }, this);

                }

                // refresh draggable
                this.initDraggable();

        },

        toggleLayer : function (e) {
               

                var div = e.target;
                var fuuid = div.getAttribute('fuuid');
                var type = div.getAttribute('type');

                if (!fuuid && !type) {
                        var div = e.target.parentNode;
                        var fuuid = div.getAttribute('fuuid');
                        var type = div.getAttribute('type');
                }

                
                var active = _.find(this.project.layermenu, {'fuuid' : fuuid});

                if (active) {
                        // toggle off
                        this.removeLayerFromMenu(fuuid);
                        
                        // tag item active
                        Wu.DomUtil.removeClass(div, 'active-layer');

                } else {

                        // toggle on
                        this.addLayerToMenu(fuuid, type);
                }


        },

        save : function (key) {



        },

        
});


