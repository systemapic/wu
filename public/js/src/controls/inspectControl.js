L.Control.Inspect = L.Control.extend({
	
	options: {
		position : 'bottomright' 
	},

	onAdd : function (map) {

		var className = 'leaflet-control-inspect ct14',
		    container = L.DomUtil.create('div', className),
		    options   = this.options;

		// add html
		container.innerHTML = ich.inspectControl(); 

		// content is not ready yet, cause not added to map! 
		return container; // this._container

	},

	addTo: function (map) {
		this._map = map;

		var container = this._container = this.onAdd(map),
		    pos = this.getPosition(),
		    corner = map._controlCorners[pos];

		L.DomUtil.addClass(container, 'leaflet-control');

		corner.appendChild(container);

		return this;
	},

	update : function (project) {

		// get vars
		this.project  = project || Wu.app.activeProject;
		this._content = Wu.DomUtil.get('inspect-control-inner-content'); 
		this._list    = Wu.DomUtil.get('inspector-list');

		// reset layers
		this.layers = [];           

		// prevent map scrollzoom
                var map = app._map;
                Wu.DomEvent.on(this._container, 'mouseenter', function () {
                        map.scrollWheelZoom.disable();
                }, this);
                Wu.DomEvent.on(this._container, 'mouseleave', function () {
                        map.scrollWheelZoom.enable();
                }, this);    
	       
	},

	addLayer : function (layer) {

		// Make sure that the layer inspector is visible
		this._content.style.display = 'block';

		var wrapper 	= Wu.DomUtil.create('div', 'inspect-layer');
		var arrowsWrap 	= Wu.DomUtil.create('div', 'inspect-arrows-wrap', wrapper);
		var upArrow 	= Wu.DomUtil.create('div', 'inspect-arrow-up', arrowsWrap);
		var downArrow 	= Wu.DomUtil.create('div', 'inspect-arrow-down', arrowsWrap);
		var text 	= Wu.DomUtil.create('div', 'inspect-text', wrapper, layer.store.title);
		var eye 	= Wu.DomUtil.create('div', 'inspect-eye', wrapper);
		var kill 	= Wu.DomUtil.create('div', 'inspect-kill', wrapper);

		// add wrapper to front of this._list
		if (!this._list.firstChild) {
			this._list.appendChild(wrapper);
		} else {
			var first = this._list.firstChild;
			first.parentNode.insertBefore(wrapper, first);
		}


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


		// add hooks
		Wu.DomEvent.on(upArrow,   'dblclick click', function (e) { Wu.DomEvent.stop(e); this.moveUp(entry);   	 }, this);
		Wu.DomEvent.on(downArrow, 'dblclick click', function (e) { Wu.DomEvent.stop(e); this.moveDown(entry); 	 }, this);
		Wu.DomEvent.on(eye, 	  'dblclick click', function (e) { Wu.DomEvent.stop(e); this.isolateToggle(entry);}, this);
		Wu.DomEvent.on(kill, 	  'dblclick click', function (e) { Wu.DomEvent.stop(e); this.killLayer(entry);	 }, this);
		Wu.DomEvent.on(text, 	  'dblclick click', function (e) { Wu.DomEvent.stop(e); this.select(entry);	 }, this);
		Wu.DomEvent.on(wrapper,   'mousedown dblclick click',  	   Wu.DomEvent.stop, 				    this);
	
		// update zIndex
		this.updateZIndex();


	},
	
	// remove by layer
	removeLayer : function (layer) {

		// find entry in array
		var entry = _.find(this.layers, function (l) { return l.uuid == layer.store.uuid; })

		// remove
		this._removeLayer(entry);

		// Hise Layer inspector if it's empty
		if ( this.layers.length == 0 ) this._content.style.display = 'none';
		


	},

	// remove by entry
	_removeLayer : function (entry) {
		// remove from DOM
		Wu.DomUtil.remove(entry.wrapper);

		// remove from array
		_.remove(this.layers, function (l) { return l.uuid == entry.uuid; });

		// Hise Layer inspector if it's empty
		if ( this.layers.length == 0 ) this._content.style.display = 'none';


	},

	moveUp : function (entry) {

		// get current position
		var index = _.findIndex(this.layers, {'uuid' : entry.uuid});

		// return if already on top
		if (index == 0) return;

		var aboveEntry   = this.layers[index - 1];
		var wrapper 	 = entry.wrapper;
		var aboveWrapper = aboveEntry.wrapper;

		// move in dom
		wrapper.parentNode.insertBefore(wrapper, aboveWrapper);

		// move up in array
		this.layers.moveUp(entry); // Array.prototype.moveUp, in Wu.Class

		// set new z-index...
		this.updateZIndex();

	},

	moveDown : function (entry) {

		// get current position
		var index = _.findIndex(this.layers, {'uuid' : entry.uuid});

		// return if already on bottom
		if (index == this.layers.length - 1) return;

		var belowEntry 	 = this.layers[index + 1];
		var wrapper 	 = entry.wrapper;
		var belowWrapper = belowEntry.wrapper;

		// move in dom
		belowWrapper.parentNode.insertBefore(belowWrapper, wrapper);

		// move down in array
		this.layers.moveDown(entry);

		// set new zIndex
		this.updateZIndex();
	},

	updateZIndex : function () {

		// update zIndex for all layers depending on position in array
		var length = this.layers.length;
		this.layers.forEach(function (entry, i) {

			var layer  = entry.layer;
			var zIndex = length - i;

			// set layer index
			layer.setZIndex(zIndex);

		}, this);
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
		if (any.length == 0) return true;
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
		if ( this.layers.length == 0 ) this._content.style.display = 'none';

	},

	
	select : function (entry) {

		// set text in descriptionControl
		var descriptionControl = app.MapPane.descriptionControl;
		if (descriptionControl) descriptionControl.setLayer(entry.layer);

		// set currently active entry
		this.activeEntry = entry;

	}



});


L.control.inspect = function (options) {
	return new L.Control.Inspect(options);
};