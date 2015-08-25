L.Control.Inspect = Wu.Control.extend({
	
	type : 'inspect',

	options: {
		position : 'bottomright',
		draggable : true
	},

	onAdd : function (map) {
		var className = 'leaflet-control-inspect ct14',
		    container = L.DomUtil.create('div', className),
		    options   = this.options;

		// add html
		this._content 	= Wu.DomUtil.create('div', 'inspect-control-inner-content', container);
		this._header 	= Wu.DomUtil.create('div', 'menucollapser inspector-header', this._content, 'Layer inspector');
		this._scroller  = Wu.DomUtil.create('div', 'inspector-list-outer-scroller', this._content);
		this._list 	= Wu.DomUtil.create('div', 'inspector-list', this._scroller);

		// add tooltip
		app.Tooltip.add(container, 'Shows a list of active layers', { extends : 'systyle', tipJoint : 'top left'});

		// get zindexControl
		this._zx = app.MapPane.getZIndexControls().l; // layermenu zindex control 


		this._added = true;

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
		if (pos.indexOf('bottom') !== -1) {
			corner.insertBefore(container, corner.firstChild);
		} else {
			corner.appendChild(container);
		}

		// stop
		Wu.DomEvent.on(container, 'mousedown click dblclick', Wu.DomEvent.stop, this);

		
		return this;
	},

	
	_flush : function () {

		this._list.innerHTML = '';
		// console.errr();

		this._layers = [];     

	},

	_refresh : function (hide) {

		// should be active
		if (!this._added) this.addTo(app._map);

		// get control active setting from project
		var active = this._project.getControls()[this.type];
		
		// if not active in project, hide
		if (!active) return this._hide();

		// remove old content
		this._flush();

		// show
		!hide && this._show();

		// enable scroll
		this.disableScrollzoom();
	},

	// refresh but keep active layers
	_refreshContent : function (hide) {
		this._refresh(hide);
		this._addAlreadyActiveLayers();
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
		// add active layers
	        this._addAlreadyActiveLayers();

	        // disable scroll 
	        this.disableScrollzoom();
	},

	// update : function (project) {
	// 	// on project refresh + added control
	// 	this._flush();

	// 	// get vars
	// 	this._project  = project || app.activeProject;
	// 	// this._content = Wu.DomUtil.get('inspect-control-inner-content'); 
	// 	// this._list    = Wu.DomUtil.get('inspector-list');

	// 	// reset layers
	// 	this._layers = [];           

	// 	// prevent scroll
	// 	this.disableScrollzoom();

	// 	// get zindexControl
	// 	this._zx = app.MapPane.getZIndexControls().l; // layermenu zindex control 

	//         // add active layers
	//         this._addAlreadyActiveLayers();

	// },

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
                Wu.DomEvent.on(this._container, 'mouseenter', function () { 
                	map.scrollWheelZoom.disable(); 
                }, this);
                Wu.DomEvent.on(this._container, 'mouseleave', function () { 
                	map.scrollWheelZoom.enable();  
                }, this); 
	},

	resetScrollzoom : function () {

		// reset map scrollzoom
                var map = app._map;
                Wu.DomEvent.off(this._container, 'mouseenter', function () { map.scrollWheelZoom.disable(); }, this);
                Wu.DomEvent.off(this._container, 'mouseleave', function () { map.scrollWheelZoom.enable();  }, this); 
	},


	// currently called from layers.js:63 .. refactor.. dont chain, do modules, event emitters
	addLayer : function (layer) {
		if (!this._layers) return; // bc fn called even if inspect is disabled
		
		// Make sure that the layer inspector is visible
		this._content.style.display = 'block';

		// create divs
		var wrapper 	= Wu.DomUtil.create('div', 'inspect-layer');
		var arrowsWrap 	= Wu.DomUtil.create('div', 'inspect-arrows-wrap', wrapper);
		var upArrow 	= Wu.DomUtil.create('div', 'inspect-arrow-up', arrowsWrap);
		var downArrow 	= Wu.DomUtil.create('div', 'inspect-arrow-down', arrowsWrap);
		var text 	= Wu.DomUtil.create('div', 'inspect-text', wrapper, layer.getTitle());
		var fly 	= Wu.DomUtil.create('div', 'inspect-fly', wrapper);
		var eye 	= Wu.DomUtil.create('div', 'inspect-eye', wrapper);
		var kill 	= Wu.DomUtil.create('div', 'inspect-kill', wrapper);

		// // add tooltip 
		// todo: this is MEMORY LEAK! must remove tooltip when removing this wrapper
		// app.Tooltip.add(arrowsWrap, 'Arrange layer order', { extends : 'systyle', tipJoint : 'right', group : 'inspect-control'});
		// app.Tooltip.add(fly, 'Zoom to layer extent', { extends : 'systyle', tipJoint : 'bottom left', group : 'inspect-control'});
		// app.Tooltip.add(eye, 'Isolate layer', { extends : 'systyle', tipJoint : 'bottom left', group : 'inspect-control'});
		// app.Tooltip.add(kill, 'Disable layer', { extends : 'systyle', tipJoint : 'bottom left', group : 'inspect-control'});

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
		this._layers.unshift(entry);

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

		// Google Analytics event tracking
		app.Analytics.setGaEvent(['Controls', 'Inspect layers: Z-index change for > ' + layer.getTitle()]);

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

		// Google Analytics event tracking
		app.Analytics.setGaEvent(['Controls', 'Inspect layers: Z-index change for > ' + layer.getTitle()]);

	},


	// remove by layer
	removeLayer : function (layer) {
		if (!this._layers || !layer) return;

		// find entry in array
		var entry = _.find(this._layers, function (l) { return l.uuid == layer.store.uuid; })

		// remove
		this._removeLayer(entry);

		// Hide Layer inspector if it's empty
		if (this._layers.length == 0) this._content.style.display = 'none';


		// Google Analytics event tracking
		// app.Analytics.setGaEvent(['Controls', 'Inspect layers: Remove layer > ' + layer.getTitle()]);
		

	},

	// remove by entry
	_removeLayer : function (entry) {
		if (!this._layers || !entry) return;

		// remove from DOM
		Wu.DomUtil.remove(entry.wrapper);

		// remove from array
		_.remove(this._layers, function (l) { return l.uuid == entry.uuid; });

		// Hise Layer inspector if it's empty
		if ( this._layers.length == 0 ) this._content.style.display = 'none';

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

		// Google Analytics event tracking
		app.Analytics.setGaEvent(['Controls', 'Inspect layers: Z-index change for > ' + layer.getTitle()]);		
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

		// Google Analytics event tracking
		app.Analytics.setGaEvent(['Controls', 'Inspect layers: Z-index change for > ' + layer.getTitle()]);		
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

		// Google Analytics event tracking
		app.Analytics.setGaEvent(['Controls', 'Inspect layers: Fly to bounds for > ' + layer.getTitle()]);

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

		// Google Analytics event tracking
		app.Analytics.setGaEvent(['Controls', 'Inspect layers: Toggle isolate > ' + entry.layer.getTitle()]);	

	},

	_noneAreIsolated : function () {
		var any = _.filter(this._layers, function (entry) { return entry.isolated == true; });
		if (!any.length) return true;
		return false;
	},

	isolateLayers : function () {

		// check if all is isolated.false .. if so, dont hide but show all.
		if (this._noneAreIsolated()) {
			this._layers.forEach(function (n) {
				n.layer.show();
			}, this);
			return;
		}

		// else, isolate relevant layers
		this._layers.forEach(function (n) {
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
		var layermenuControl = app.MapPane.getControls().layermenu;
		if (layermenuControl) layermenuControl._disableLayer(entry.layer);

		// remove from legendsControl if available
		var legendsControl = app.MapPane.getControls().legends;
		if (legendsControl) legendsControl.removeLegend(entry.layer);

		// remove from descriptionControl if avaialbe
		var descriptionControl = app.MapPane.getControls().description;
		if (descriptionControl) descriptionControl.removeLayer(entry.layer);	

		// Hide Layer inspector if it's empty
		if (!this._layers.length) this._content.style.display = 'none';

	},

	
	select : function (entry) {

		// set text in descriptionControl
		var descriptionControl = app.MapPane.getControls().description;
		if (descriptionControl) descriptionControl.setLayer(entry.layer);

		// set currently active entry
		this.activeEntry = entry;

	},

	getListPosition : function () {

	},

	setListPosition : function (position, layer) {


	},



});


L.control.inspect = function (options) {
	return new L.Control.Inspect(options);
};