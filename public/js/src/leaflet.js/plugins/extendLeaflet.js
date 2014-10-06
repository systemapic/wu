L.Map.include({

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


// add to section wrapper instead of control corner
L.Control.StyleEditor.include({

	addTo : function (map) {
		this._map = map;

		var container = this._container = this.onAdd(map),
		    pos = this.getPosition(),
		    corner = map._controlCorners[pos];

		L.DomUtil.addClass(container, 'leaflet-control');

		var sectionWrapper = this.options.container;
		sectionWrapper.appendChild(container);

		return this;
	},

	removeFrom: function (map) {
		var pos = this.getPosition(),
		    corner = map._controlCorners[pos];

		var sectionWrapper = this.options.container;
		sectionWrapper.removeChild(this._container);
		this._map = null;

		if (this.onRemove) {
			this.onRemove(map);
		}

		return this;
	},

});