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

		// add tooltip
		app.Tooltip.add(container, 'Shows a list of active layers', { extends : 'systyle', tipJoint : 'top left'});

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




	
		// add wrapper to list by zIndex
		var index = this._getIndex(layer);

	


		// add wrapper to front of this._list
		if (!this._list.firstChild) {
			console.log('first child');
			this._list.appendChild(wrapper);
		} else {

			// get nodes
			var nodes = this._list.childNodes;

			// if index is zero, insert FIRST
			if (index == 0) {
				var target = nodes[0];
				target.parentNode.insertBefore(wrapper, target);
			
			// if index is same as node.length, insert LAST
			} else if (index == nodes.length) { 
				this._list.appendChild(wrapper);
			
			} else {

				// get node to be inserted after
				var target = nodes[index-1];
				target.parentNode.insertBefore(wrapper, target.nextSibling);
			}
	
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
		Wu.DomEvent.on(fly, 	  'dblclick click', function (e) { Wu.DomEvent.stop(e); this.flyTo(entry);	 }, this);
		Wu.DomEvent.on(eye, 	  'dblclick click', function (e) { Wu.DomEvent.stop(e); this.isolateToggle(entry);}, this);
		Wu.DomEvent.on(kill, 	  'dblclick click', function (e) { Wu.DomEvent.stop(e); this.killLayer(entry);	 }, this);
		Wu.DomEvent.on(text, 	  'dblclick click', function (e) { Wu.DomEvent.stop(e); this.select(entry);	 }, this);
		Wu.DomEvent.on(wrapper,   'mousedown dblclick click',  	   Wu.DomEvent.stop, 				    this);
	
		// Stop Propagation
		Wu.DomEvent.on(this._content, 'mousedown click dblclick',  Wu.DomEvent.stopPropagation, this);

		// update zIndex
		// this.updateZIndex();


	},

	flyTo : function (entry) {

		var layer = entry.layer;
		var extent = layer.getMeta().extent;

		var southWest = L.latLng(extent[1], extent[0]),
		    northEast = L.latLng(extent[3], extent[2]),
		    bounds = L.latLngBounds(southWest, northEast);

		// fly
		var map = app._map;
		map.fitBounds(bounds);

	},

	_getIndex : function (layer) {

		// rewrite zindex:
		//
		// must be a store for ALL layers (active, non-active), a list of order, and this list must be validated each time
		// 	which means the ORDER of the list is king, and numbers, starting at 1000, must be made for it.
		//	simple nudging wont work!!!
		//
		//
		//
		//
		//
		//

		// console.log('_getIndex layer: ', layer);
		
		// get index
		var layerIndex = layer.getZIndex(); // ie. 1002

		// get other items already added to inspector
		var already = this.layers;

		var above = [];

		// console.log('this.layers LENGHT: ', this.layers.length);

		this.layers.forEach(function (l) {

			// console.log('l', l);
			// console.log('others (l) zindex: ', l.layer.store.zIndex, l.layer.store.title);
			if (l.layer.store.zIndex >= layer.store.zIndex) above.push(l);

		}, this);

		// var index = _.sortedIndex(this.layers, layer, 'zIndex');

		// console.error('_getIndex (num above)', above.length);
		// console.log('layer zindex: ', layerIndex, layer.getTitle());

		return above.length;

	},
	
	// remove by layer
	removeLayer : function (layer) {

		console.log('removeLayuer inspect!!', layer);

		// find entry in array
		var entry = _.find(this.layers, function (l) { return l.uuid == layer.store.uuid; })

		console.log('entyr: ', entry);

		// remove
		this._removeLayer(entry);

		// Hise Layer inspector if it's empty
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

		console.log('updateZIndex, this.layers:', this.layers);

		// update zIndex for all layers depending on position in array
		var length = this.layers.length;
		this.layers.forEach(function (entry, i) {

			var layer  = entry.layer;
			var zIndex = length - i + 1000;

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