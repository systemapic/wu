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


