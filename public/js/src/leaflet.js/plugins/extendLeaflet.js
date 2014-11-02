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


// // add to section wrapper instead of control corner
// L.Control.StyleEditor.include({

// 	addTo : function (map) {
// 		this._map = map;

// 		var container = this._container = this.onAdd(map),
// 		    pos = this.getPosition(),
// 		    corner = map._controlCorners[pos];

// 		L.DomUtil.addClass(container, 'leaflet-control');

// 		var sectionWrapper = this.options.container;
// 		sectionWrapper.appendChild(container);

// 		return this;
// 	},

// 	removeFrom: function (map) {
// 		var pos = this.getPosition(),
// 		    corner = map._controlCorners[pos];

// 		var sectionWrapper = this.options.container;
// 		sectionWrapper.removeChild(this._container);
// 		this._map = null;

// 		if (this.onRemove) {
// 			this.onRemove(map);
// 		}

// 		return this;
// 	},

// });

L.Popup.include({

	_initLayout: function () {
		console.log('L.Popup.include._initLayout');

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
		console.log('L.Popup.include._updateLayout');

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



