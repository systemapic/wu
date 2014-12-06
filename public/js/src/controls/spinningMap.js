// spinning map
L.SpinningMap = L.Class.extend({

	// default options
	options : {

		accessToken : null, // mapbox
		layer : null,
		logo : '',
		content : '',
		container : 'map',
		speed : 1000,
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
		spinning : [
			'spinning',
			'spinning90',
			'spinning270',
			'spinning-reversed',
			'spinning-reversed90',
			'spinning-reversed270',
		],

	},

	initialize : function (options) {

		// merge options
		L.setOptions(this, options);

		// set access token
		L.mapbox.accessToken = this.options.accessToken;

		// init 
		this.initLayout();

		// autostart
		if (this.options.autoStart) this.start();

	},


	initLayout : function () { 

		// set container
		this._container = this.options.container;

		// init wrappers
		this.initWrappers();

		// set dimensions of container
		this.setDimensions();
		
		// create map
		this.createMap();

		// create circle
		this.createCircle();

		// set window resize event listener
		L.DomEvent.on(window, 'resize', this.setDimensions, this);

	},

	initWrappers : function () {
		var mapWrapper = L.DomUtil.create('div', 'map-wrapper', document.body);
		mapWrapper.appendChild(this._container);
	},

	createMap : function () {

		// set vars
		var lat = this.options.position.lat,
		    lng = this.options.position.lng,
		    zoom = this.options.position.zoom;

		// create map
		var map = this.map = L.mapbox.map(this._container);

		// add layer
		var layer = L.mapbox.tileLayer(this.options.layer, {
			format : 'jpg70'
		}).addTo(map);

		// set map options
		map.setView([lat, lng], this._getZoomLevel());
		map.dragging.disable();
		map.touchZoom.disable();
		map.doubleClickZoom.disable();
		map.scrollWheelZoom.disable();
		map.boxZoom.disable();
		map.keyboard.disable();
		map.zoomControl.removeFrom(map);
		map.attributionControl.removeFrom(map);
	},

	setView : function (lat, lng, zoom) {
		this.map.setView([lat, lng], zoom);
	},

	createCircle : function () {

		// create divs
		this._circleContainer = L.DomUtil.create('div', 'start-pane-circle-container', document.body);
		this._circle = L.DomUtil.create('div', 'start-pane-circle', this._circleContainer);

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
		this._direction = this._getDirection();
		L.DomUtil.addClass(this._container, this._direction);
	},

	// stop spinning
	stop : function () {
		L.DomUtil.removeClass(this._container, this._direction);
	},

	// get direction of spin
	_getDirection : function () {
		var arr = this.options.spinning;
		var key = Math.floor(Math.random() * arr.length);
		return arr[key];
	},

	// get zoom level
	_getZoomLevel : function () {
		var min = this.options.position.zoom[0];
		var max = this.options.position.zoom[1];
		var random = Math.floor(Math.random()*(max-min+1)+min);
		if (random == 13 || random == 14 || random == 15) return this._getZoomLevel();
		return random;
	}
});