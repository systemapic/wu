/* Leaflet.Draw.Note Plugin  (depends on Leaflet.Draw)
   @kosjoli — 2013 MIT Licence						   */
L.Draw.Note = L.Draw.Rectangle.extend({
	statics: {
		TYPE: 'note'
	},

	options: {
		shapeOptions: {
			stroke: true,
			color: '#fff',
			weight: 10,
			opacity: 0.2,
			fill: true,
			fillColor: null, //same as color by default
			fillOpacity: 0.2,
			clickable: true
		},
		
		noteOptions: {}	
			
	},

	initialize: function (map, options) {

		L.Draw.SimpleShape.prototype.initialize.call(this, map, options);
		
		// Save the type so super can fire, need to do this as cannot do this.TYPE :(
		this.type = L.Draw.Note.TYPE;
		this._name = 'L.Draw.Note';
		
		this._initialLabelText = L.drawLocal.draw.handlers.note.tooltip.start;

			

	},

	_drawShape: function (latlng) {

		if (!this._shape) {
			this._shape = new L.Rectangle(new L.LatLngBounds(this._startLatLng, latlng), this.options.shapeOptions);
			this._map.addLayer(this._shape);
		} else {
			this._shape.setBounds(new L.LatLngBounds(this._startLatLng, latlng));
		}
		

	},
	
	_fireCreatedEvent: function () {
		var rectangle = new L.Rectangle(this._shape.getBounds(), this.options.shapeOptions);		
		var note = new L.Note(this, this._map, this._shape.getBounds(), this.options.noteOptions, rectangle);	

		console.log('map.LeafletDrawEditEnabled = false 1');
		//map.LeafletDrawEditEnabled = false;
				
		this._map.fire('draw:note:created', { rectangleLayer: rectangle, noteLayer: note, layerType: this.type });
	}
		
});





L.Note = L.Handler.extend({
	includes: L.Mixin.Events,

	options: {
		fontFamily: 'Helvetica Neue',
		fontSize: 1.1,
		color: 'black',
		backgroundColor: 'rgba(255, 255, 255, 0.8)',
		opacity: 1,
		fontWeight: 200,
		margin: 0,
		paddingLeft: '10px',
		paddingRight: '10px',
		paddingTop: '10px',
		border: 0,
		position: 'absolute',
		borderRadius: '3px',
		boxShadow: '0 0 15px 0 rgba(0,0,0,0.3)',
		overflow: 'hidden',
		resize: 'none',
		zIndex: 10
	},
	
	initialize: function (thisParent, map, latLngBounds, options, rectangle) {

		this._rectangle = rectangle;
		this._rectangle._note = this;
		this._parent = thisParent;
		this._map = map;
		this._latLngBounds = latLngBounds;
		this._latlng = new L.LatLng(latLngBounds._northEast.lat, latLngBounds._southWest.lng);
		this._container = this._map._container;
		this._overlayPane = this._map._panes.overlayPane;
		this._popupPane = this._map._panes.popupPane;
		this._name = 'L.Note';
		this._initialZoom = rectangle._initialZoom || this._map.getZoom();

		// Merge default shapeOptions options with custom shapeOptions
		if (this.options && options.noteOptions) {
			options = L.Util.extend({}, this.options, options.noteOptions);
		}

		L.setOptions(this, options);

		L.Handler.prototype.initialize.call(this, this._map, options); // was L.Draw.Simpleshape...
		 
	},
	
	onAdd: function (map) {

		// create a DOM element and put it into one of the map panes
	        this._el = L.DomUtil.create('textarea', 'leaflet-draw-note-container');

	        // add styles from options
	        for (o in this.options) {
        		if (o === 'fontSize') { this._el.style[o] = this.options[o] + 'em'; continue; }	// add px to font-size value
        		if (o === 'value') { this._el.value = this.options[o]};
	       		
	       		try {
	       			this._el.style[o] = this.options[o];
	   		} catch(e) {
		   		console.log('IE8 style error:');
		   		console.log(o);
		   		if (o == 'backgroundColor') {
			   		this._el.style[o] = '#FFF';
			   		this._el.style.filter = 'alpha(opacity=80)';
		   		}
	   		}
	        }
	        
	        // disable by default, enable on edit
	        this._el.disabled = true; // works!
	        
	        // append to overlayPane
	        this._map.getPanes().overlayPane.appendChild(this._el);
	
	        // add a viewreset event listener for updating layer's position, do the latter
	        this._map.on('viewreset', this._reset, this);
	        this._map.on('zoomstart', this._zoomStart, this);
	        this._reset();
			
		// block popups when creating new note
		Wu.DomEvent.on(this._el, 'mousemove', function (e) {
			if (this._map._popup) { this._map._popup._close() };
		}, this);
		
		// add hooks
		this.addHooks();
			
	},

    	onRemove: function (map) {
	        // remove layer's DOM elements and listeners
	        this._map.getPanes().overlayPane.removeChild(this._el);
	        this._map.off('viewreset', this._reset, this);
    	},

	_zoomStart: function () {
		// fade out				
		this._el.style.opacity = 0;
		
	},

    	_reset: function () {
		// get fresh latlngs if edited	    
			this._latlng = this._rectangle._latlngs[1] || this._latlng;
		this._latLngBounds = this._rectangle.getBounds() || this._latLngBounds;
		
		// update layer's size
		var ne = this._map.latLngToLayerPoint(this._latLngBounds._northEast);
        	var sw = this._map.latLngToLayerPoint(this._latLngBounds._southWest);
		this._width = ne.x - sw.x;
		this._height = sw.y - ne.y;
        	this._el.style.height = this._height + 'px';
		this._el.style.width = this._width + 'px';

		// set zoomOffset
		this._zoomOffset = this._initialZoom - this._map.getZoom(); // either 0, -1 or +1 (if ±2, note not shown)

		// update layer's font-size
		if (this._zoomOffset == 0) {
			// then font-size should be default 
			this._fontScale = this.options.fontSize;
		}
		
		if (this._zoomOffset == -1) {
			// then font-size should be x2
			this._fontScale = this.options.fontSize * 2;
		}
		
		if (this._zoomOffset == 1) {
			// then font-size should be /2
			this._fontScale = this.options.fontSize / 2;
		}

		this._el.style.fontSize = this._fontScale + 'em';
		this._el.style.lineHeight = 1;
		
		// update layer's position
	        var pos = this._map.latLngToLayerPoint(this._latlng);
	        L.DomUtil.setPosition(this._el, pos);
			
		var dis = this;
		window.setTimeout( function () {	// javascript DOM bug hack
			dis._updateOpacity();
		}, 10);
			
			
			
			
			
    	},

	_updateOpacity: function () {
		
		// update layer opacity
		if (this._zoomOffset == 0) { 
				
			// fade in
			this._el.style.opacity = 1; 
			try {
				var pat = this;
				
				pat._rectangle._path.style.opacity = 1;
			} catch (e) { 
				window.dummy = this;
				window.dummy._rectangle._path.style.opacity = 1;
		
			};
		} else {
			
			var ofs = Math.abs(this._zoomOffset);
			ofs = ofs * 4;
			var op = (1 / (ofs));
			if (op < 0.2) { op = 0;}
			
			this._el.style.opacity = op;
									
			try {
				this._rectangle._path.style.opacity = op;
			} catch (e) { console.log(e);};				
		}

	},
	
	enable: function () {
		if (this._enabled) return; 

		L.Handler.prototype.enable.call(this);

		this.fire('enabled', { handler: this.type });

		this._map.fire('draw:drawstart', { layerType: this.type });
	},

	disable: function () {
		if (!this._enabled) return; 

		L.Handler.prototype.disable.call(this);

		this.fire('disabled', { handler: this.type });

		this._map.fire('draw:drawstop', { layerType: this.type });
	},

	addHooks: function () {
		var map = this._map;

		if (this._map) {
			L.DomUtil.disableTextSelection();

			this._map.getContainer().focus();

			this._tooltip = new L.Tooltip(this._map);

			L.DomEvent.addListener(this._container, 'keyup', this._cancelDrawing, this);
		}
	},

	removeHooks: function () {
		if (this._map) {
			L.DomUtil.enableTextSelection();

			this._tooltip.dispose();
			this._tooltip = null;

			L.DomEvent.removeListener(this._container, 'keyup', this._cancelDrawing);
		}
	},

	setOptions: function (options) {
		L.setOptions(this, options);
	},

	_fireCreatedEvent: function (layer) {
	},

	// Cancel drawing when the escape key is pressed
	_cancelDrawing: function (e) {
		if (e.keyCode === 27) this.disable();
	}
});






L.Edit = L.Edit || {};

L.Edit.Rectangle = L.Edit.SimpleShape.extend({
		
	options: {
                moveIcon: new L.DivIcon({
                        iconSize: new L.Point(8, 8),
                        className: 'leaflet-div-icon leaflet-editing-icon leaflet-edit-move leaflet-edit-move-note'
                }),
                resizeIcon: new L.DivIcon({
                        iconSize: new L.Point(8, 8),
                        className: 'leaflet-div-icon leaflet-editing-icon leaflet-edit-resize leaflet-edit-resize-note'
                })
        },
		
        _createMoveMarker: function () {
                var bounds = this._shape.getBounds(),
                        center = bounds.getCenter();

                this._moveMarker = this._createMarker(center, this.options.moveIcon);
        },

        _createResizeMarker: function () {
                var corners = this._getCorners();

                this._resizeMarkers = [];

                for (var i = 0, l = corners.length; i < l; i++) {
                        this._resizeMarkers.push(this._createMarker(corners[i], this.options.resizeIcon));
                        // Monkey in the corner index as we will need to know this for dragging
                        this._resizeMarkers[i]._cornerIndex = i;
                }
        },

        _onMarkerDragStart: function (e) {
        		
                L.Edit.SimpleShape.prototype._onMarkerDragStart.call(this, e);

                // Save a reference to the opposite point
                var corners = this._getCorners(),
                        marker = e.target,
                        currentCornerIndex = marker._cornerIndex;

                this._oppositeCorner = corners[(currentCornerIndex + 2) % 4];

                this._toggleCornerMarkers(0, currentCornerIndex);
        },

        _onMarkerDragEnd: function (e) {
                var marker = e.target,
                        bounds, center;

                // Reset move marker position to the center
                if (marker === this._moveMarker) {
                        bounds = this._shape.getBounds();
                        center = bounds.getCenter();

                        marker.setLatLng(center);
                }

                this._toggleCornerMarkers(1);

                this._repositionCornerMarkers();

                L.Edit.SimpleShape.prototype._onMarkerDragEnd.call(this, e);
        },

        _move: function (newCenter) {
                var latlngs = this._shape.getLatLngs(),
                        bounds = this._shape.getBounds(),
                        center = bounds.getCenter(),
                        offset, newLatLngs = [];

                // Offset the latlngs to the new center
                for (var i = 0, l = latlngs.length; i < l; i++) {
                        offset = [latlngs[i].lat - center.lat, latlngs[i].lng - center.lng];
                        newLatLngs.push([newCenter.lat + offset[0], newCenter.lng + offset[1]]);
                }

                this._shape.setLatLngs(newLatLngs);

                // Reposition the resize markers
                this._repositionCornerMarkers();

                if (this._shape._note) {
		                
        		// Reposition Note textarea
			var corners = this._getCorners();
			var noteTopLeft = map.latLngToLayerPoint(corners[0]);
			L.DomUtil.setPosition(this._shape._note._el, noteTopLeft);
		}

        },

        _resize: function (latlng) {
                var bounds;

                // Update the shape based on the current position of this corner and the opposite point
                this._shape.setBounds(L.latLngBounds(latlng, this._oppositeCorner));

                // Reposition the move marker
                bounds = this._shape.getBounds();
                this._moveMarker.setLatLng(bounds.getCenter());
                
                
                if (this._shape._note) {
                	// Reposition Note textarea
			var corners = this._getCorners();
			var noteTopLeft = this._map.latLngToLayerPoint(corners[0]);
			var noteBottomRight = this._map.latLngToLayerPoint(corners[2]);
			var noteHeight = noteBottomRight.y - noteTopLeft.y;
			var noteWidth = noteBottomRight.x - noteTopLeft.x;

			this._shape._note._el.style.height = noteHeight + 'px';
			this._shape._note._el.style.width = noteWidth + 'px';
			L.DomUtil.setPosition(this._shape._note._el, noteTopLeft);
		}    
                
        },

        _getCorners: function () {
                var bounds = this._shape.getBounds(),
                        nw = bounds.getNorthWest(),
                        ne = bounds.getNorthEast(),
                        se = bounds.getSouthEast(),
                        sw = bounds.getSouthWest();

                return [nw, ne, se, sw];
        },

        _toggleCornerMarkers: function (opacity) {
                for (var i = 0, l = this._resizeMarkers.length; i < l; i++) {
                        this._resizeMarkers[i].setOpacity(opacity);
                }
        },

        _repositionCornerMarkers: function () {
                var corners = this._getCorners();

                for (var i = 0, l = this._resizeMarkers.length; i < l; i++) {
                        this._resizeMarkers[i].setLatLng(corners[i]);
                }
        }
});


L.Rectangle.addInitHook(function () {
        if (L.Edit.Rectangle) {
                this.editing = new L.Edit.Rectangle(this);

                if (this.options.editable) {
                        this.editing.enable();
                        console.log('map.LeafletDrawEditEnabled = true 7');
                        map.LeafletDrawEditEnabled = true;
                }
        }
        
        this.rectangle = true;
});







// add tooltip text to Note
L.drawLocal.draw.toolbar.buttons.note = 'Place a note';


L.drawLocal.draw.handlers.note = { tooltip : { start: 'Click map to place note' } }

// add Note to DrawToolbar
L.DrawToolbar.prototype.options.note = {};
L.DrawToolbar.prototype.addToolbar = function (map) {
		var container = L.DomUtil.create('div', 'leaflet-draw-section'),
				buttonIndex = 0,
				buttonClassPrefix = 'leaflet-draw-draw';

		this._toolbarContainer = L.DomUtil.create('div', 'leaflet-draw-toolbar leaflet-bar');

		if (this.options.polyline) {
				this._initModeHandler(
						new L.Draw.Polyline(map, this.options.polyline),
						this._toolbarContainer,
						buttonIndex++,
						buttonClassPrefix,
						L.drawLocal.draw.toolbar.buttons.polyline
				);
		}

		if (this.options.polygon) {
				this._initModeHandler(
						new L.Draw.Polygon(map, this.options.polygon),
						this._toolbarContainer,
						buttonIndex++,
						buttonClassPrefix,
						L.drawLocal.draw.toolbar.buttons.polygon
				);
		}

		if (this.options.rectangle) {
				this._initModeHandler(
						new L.Draw.Rectangle(map, this.options.rectangle),
						this._toolbarContainer,
						buttonIndex++,
						buttonClassPrefix,
						L.drawLocal.draw.toolbar.buttons.rectangle
				);
		}

		if (this.options.circle) {
				this._initModeHandler(
						new L.Draw.Circle(map, this.options.circle),
						this._toolbarContainer,
						buttonIndex++,
						buttonClassPrefix,
						L.drawLocal.draw.toolbar.buttons.circle
				);
		}

		if (this.options.marker) {
				this._initModeHandler(
						new L.Draw.Marker(map, this.options.marker),
						this._toolbarContainer,
						buttonIndex++,
						buttonClassPrefix,
						L.drawLocal.draw.toolbar.buttons.marker
				);
		}

		// added: note
		if (this.options.note) {
				this._initModeHandler(
						new L.Draw.Note(map, this.options.note),
						this._toolbarContainer,
						buttonIndex++,
						buttonClassPrefix,
						L.drawLocal.draw.toolbar.buttons.note
				);
		}

		// Save button index of the last button, -1 as we would have ++ after the last button
		this._lastButtonIndex = --buttonIndex;

		// Create the actions part of the toolbar
		this._actionsContainer = this._createActions([
				{
						title: L.drawLocal.draw.toolbar.actions.title,
						text: L.drawLocal.draw.toolbar.actions.text,
						callback: this.disable,
						context: this
				}
		]);

		// Add draw and cancel containers to the control container
		container.appendChild(this._toolbarContainer);
		container.appendChild(this._actionsContainer);

		return container;
}








L.EditToolbar.Edit = L.Handler.extend({
        statics: {
                TYPE: 'edit'
        },

        includes: L.Mixin.Events,

        initialize: function (map, options) {

        	L.Draw._editshortcut = this;	// in order to enable on Note add
        		
                L.Handler.prototype.initialize.call(this, map);

                // Set options to the default unless already set
                this._selectedPathOptions = options.selectedPathOptions;

                // Store the selectable layer group for ease of access
                this._featureGroup = options.featureGroup;

                if (!(this._featureGroup instanceof L.FeatureGroup)) {
                        throw new Error('options.featureGroup must be a L.FeatureGroup');
                }

                this._uneditedLayerProps = {};

                // Save the type so super can fire, need to do this as cannot do this.TYPE :(
                this.type = L.EditToolbar.Edit.TYPE;

        },

        enable: function () {
                if (this._enabled || !this._hasAvailableLayers()) {
                        return;
                }
                
		map.LeafletDrawEditEnabled = true;
                L.Handler.prototype.enable.call(this);

                this._featureGroup
                        .on('layeradd', this._enableLayerEdit, this)
                        .on('layerremove', this._disableLayerEdit, this);

                this.fire('enabled', {handler: this.type});
                this._map.fire('draw:editstart', { handler: this.type });
                
        },

        disable: function () {
                if (!this._enabled) return; 
                
                this.fire('disabled', {handler: this.type});
                this._map.fire('draw:editstop', { handler: this.type });

                this._featureGroup
                        .off('layeradd', this._enableLayerEdit, this)
                        .off('layerremove', this._disableLayerEdit, this);
				
                L.Handler.prototype.disable.call(this);
                
        },

        addHooks: function () {
                var map = this._map;

                if (map) {
                        map.getContainer().focus();

                        this._featureGroup.eachLayer(this._enableLayerEdit, this);

                        this._tooltip = new L.Tooltip(this._map);
                        this._tooltip.updateContent({
                                text: L.drawLocal.edit.handlers.edit.tooltip.text,
                                subtext: L.drawLocal.edit.handlers.edit.tooltip.subtext
                        });

                        this._map.on('mousemove', this._onMouseMove, this);
                }
        },

        removeHooks: function () {
                if (this._map) {
                        // Clean up selected layers.
                        this._featureGroup.eachLayer(this._disableLayerEdit, this);

                        // Clear the backups of the original layers
                        this._uneditedLayerProps = {};

                        this._tooltip.dispose();
                        this._tooltip = null;

                        this._map.off('mousemove', this._onMouseMove, this);
                }
        },

        revertLayers: function () {
                this._featureGroup.eachLayer(function (layer) {
                        this._revertLayer(layer);
                }, this);
        },

        save: function () {
                var editedLayers = new L.LayerGroup();
                this._featureGroup.eachLayer(function (layer) {
                        if (layer.edited) {
                                editedLayers.addLayer(layer);
                                layer.edited = false;
                        }
                });
                this._map.fire('draw:edited', {layers: editedLayers});
        },

        _backupLayer: function (layer) {
                var id = L.Util.stamp(layer);

                if (!this._uneditedLayerProps[id]) {
                        // Polyline, Polygon or Rectangle
                        if (layer instanceof L.Polyline || layer instanceof L.Polygon || layer instanceof L.Rectangle) {
                                this._uneditedLayerProps[id] = {
                                        latlngs: L.LatLngUtil.cloneLatLngs(layer.getLatLngs())
                                };
                        } else if (layer instanceof L.Circle) {
                                this._uneditedLayerProps[id] = {
                                        latlng: L.LatLngUtil.cloneLatLng(layer.getLatLng()),
                                        radius: layer.getRadius()
                                };
                        } else if (layer instanceof L.Note) {
								// todo?
                        } else if (layer instanceof L.GeoJSON) {

                        	console.log('is geojson, no backup');	//TODO!

                        } else { // Marker
                        	try {
                                this._uneditedLayerProps[id] = {
                                        latlng: L.LatLngUtil.cloneLatLng(layer.getLatLng())
                                };
                        	} catch (e) { console.log('cloenLatN', e)};
                        }
                }
        },

        _revertLayer: function (layer) {
                var id = L.Util.stamp(layer);
                layer.edited = false;
                if (this._uneditedLayerProps.hasOwnProperty(id)) {
                        // Polyline, Polygon or Rectangle
                        if (layer instanceof L.Polyline || layer instanceof L.Polygon || layer instanceof L.Rectangle) {
                                layer.setLatLngs(this._uneditedLayerProps[id].latlngs);
                        } else if (layer instanceof L.Circle) {
                                layer.setLatLng(this._uneditedLayerProps[id].latlng);
                                layer.setRadius(this._uneditedLayerProps[id].radius);
                        } else if (layer instanceof L.Note) {
                        
                        } else { // Marker
                                layer.setLatLng(this._uneditedLayerProps[id].latlng);
                        }
                }
        },

        _toggleMarkerHighlight: function (marker) {
                if (!marker._icon) return;
                
                // This is quite naughty, but I don't see another way of doing it. (short of setting a new icon)
                var icon = marker._icon;

                icon.style.display = 'none';

                if (L.DomUtil.hasClass(icon, 'leaflet-edit-marker-selected')) {
                        L.DomUtil.removeClass(icon, 'leaflet-edit-marker-selected');
                        // Offset as the border will make the icon move.
                        this._offsetMarker(icon, -4);

                } else {
                        L.DomUtil.addClass(icon, 'leaflet-edit-marker-selected');
                        // Offset as the border will make the icon move.
                        this._offsetMarker(icon, 4);
                }

                icon.style.display = '';
        },

        _offsetMarker: function (icon, offset) {
                var iconMarginTop = parseInt(icon.style.marginTop, 10) - offset,
                        iconMarginLeft = parseInt(icon.style.marginLeft, 10) - offset;

                icon.style.marginTop = iconMarginTop + 'px';
                icon.style.marginLeft = iconMarginLeft + 'px';
        },

        _enableLayerEdit: function (e) {
        
        	map.LeafletDrawEditEnabled = true;
        
                var layer = e.layer || e.target || e,
                        isMarker = layer instanceof L.Marker,
                        pathOptions;

                // Don't do anything if this layer is a marker but doesn't have an icon. Markers
                // should usually have icons. If using Leaflet.draw with Leafler.markercluster there
                // is a chance that a marker doesn't.				// or if L.Note
                if (isMarker && !layer._icon ) return;
                
				
		// enable textarea
		if (layer instanceof L.Note) {
			e._el.disabled = false;
			return;
		}
		
		
                // Back up this layer (if haven't before)
                this._backupLayer(layer);

                // Update layer style so appears editable
                if (this._selectedPathOptions) {
                        pathOptions = L.Util.extend({}, this._selectedPathOptions);

                        // market
                        if (isMarker) {
                                this._toggleMarkerHighlight(layer);

                        // geojson layer (with multiple _layers)
                        } else if (layer instanceof L.GeoJSON) {
                        	
                        	for (l in layer._layers) {
					
                        		// save styles
					var geolayer = layer._layers[l];
					console.log('geolayer): ', geolayer);

					if (geolayer.getStyle) geolayer.options.previousStyle = geolayer.getStyle();
					

					// set edit styyle
					geolayer.setStyle(pathOptions);
				}

                        } else {
                                layer.options.previousOptions = layer.options;

                                // Make sure that Polylines are not filled
                                if (!(layer instanceof L.Circle) && !(layer instanceof L.Polygon) && !(layer instanceof L.Rectangle)) {
                                        pathOptions.fill = false;
                                }

                                layer.setStyle(pathOptions);
                        }
                }

                if (isMarker) {
                        layer.dragging.enable();
                        layer.on('dragend', this._onMarkerDragEnd);
          
                } else if (layer instanceof L.GeoJSON && layer._layers) {
                	for (l in layer._layers) {
                		var lay = layer._layers[l];
                		if (lay.editing) {
                			lay.editing.enable();
                		}
                	}	
        	
        	} else {
                        layer.editing.enable();
                }
        },

        _disableLayerEdit: function (e) {
        	
                var layer = e.layer || e.target || e;
                layer.edited = false;

		// disable textarea
		if (layer instanceof L.Note) {
			e._el.disabled = true;
			return;
		}

                // Reset layer styles to that of before select
                if (this._selectedPathOptions) {
                        if (layer instanceof L.Marker) {
                                this._toggleMarkerHighlight(layer);
                        
                        } else if (layer instanceof L.GeoJSON && layer._layers) {
                        	console.log('reverting geojson styles!', layer);

                        	for (l in layer._layers) {
					var geolayer = layer._layers[l];
					geolayer.setStyle(geolayer.options.previousStyle);
					delete geolayer.options.previousStyle;
				}
                        	
                        } else {
                                // reset the layer style to what is was before being selected
                                layer.setStyle(layer.options.previousOptions);
                                // remove the cached options for the layer object
                                delete layer.options.previousOptions;
                        }
                }

                if (layer instanceof L.Marker) {
                        layer.dragging.disable();
                        layer.off('dragend', this._onMarkerDragEnd, this);
                
                } else if (layer instanceof L.GeoJSON && layer._layers) {
        		for (l in layer._layers) {
        			layer._layers[l].editing.disable();                			
        		}
                	
                } else {
                	
                        layer.editing.disable();
                }
        },

        _onMarkerDragEnd: function (e) {
                var layer = e.target;
                layer.edited = true;
        },

        _onMouseMove: function (e) {
                this._tooltip.updatePosition(e.latlng);
        },

        _hasAvailableLayers: function () {
                return this._featureGroup.getLayers().length !== 0;
        }
});






L.EditToolbar.Delete = L.Handler.extend({
        statics: {
                TYPE: 'remove' // not delete as delete is reserved in js
        },

        includes: L.Mixin.Events,

        initialize: function (map, options) {
                L.Handler.prototype.initialize.call(this, map);

                L.Util.setOptions(this, options);

                // Store the selectable layer group for ease of access
                this._deletableLayers = this.options.featureGroup;

                if (!(this._deletableLayers instanceof L.FeatureGroup)) {
                        throw new Error('options.featureGroup must be a L.FeatureGroup');
                }

                // Save the type so super can fire, need to do this as cannot do this.TYPE :(
                this.type = L.EditToolbar.Delete.TYPE;
        },

        enable: function () {
                if (this._enabled) { return; }

                L.Handler.prototype.enable.call(this);

                this._deletableLayers
                        .on('layeradd', this._enableLayerDelete, this)
                        .on('layerremove', this._disableLayerDelete, this);

                this.fire('enabled', { handler: this.type});
        },

        disable: function () {
                if (!this._enabled) { return; }

                L.Handler.prototype.disable.call(this);

                this._deletableLayers
                        .off('layeradd', this._enableLayerDelete, this)
                        .off('layerremove', this._disableLayerDelete, this);

                this.fire('disabled', { handler: this.type});
        },

        addHooks: function () {
                if (this._map) {
                        this._deletableLayers.eachLayer(this._enableLayerDelete, this);
                        this._deletedLayers = new L.layerGroup();

                        this._tooltip = new L.Tooltip(this._map);
                        this._tooltip.updateContent({ text: L.drawLocal.edit.handlers.remove.tooltip.text });

                        this._map.on('mousemove', this._onMouseMove, this);
                }
        },

        removeHooks: function () {
                if (this._map) {
                        this._deletableLayers.eachLayer(this._disableLayerDelete, this);
                        this._deletedLayers = null;

                        this._tooltip.dispose();
                        this._tooltip = null;

                        this._map.off('mousemove', this._onMouseMove, this);
                }
        },

        revertLayers: function () {
                // Iterate of the deleted layers and add them back into the featureGroup
                this._deletedLayers.eachLayer(function (layer) {
                        this._deletableLayers.addLayer(layer);
                }, this);
        },

        save: function () {
                this._map.fire('draw:deleted', { layers: this._deletedLayers });
                try { this._svgparent.style.zIndex = ''; } catch (e) {}
        },

        _enableLayerDelete: function (e) {
                var layer = e.layer || e.target || e;

		if (e._note) this._hideNote(e); 				
				
                layer.on('click', this._removeLayer, this);
        },
        
        _hideNote: function (e) {
		e._note._el.style.opacity = 0;	
		e._note._el.style.zIndex = 0;
		this._svgparent = e._path.parentNode.parentNode;
		this._svgparent.style.zIndex = 1;
        },
        
        _unhideNote: function (e) {	      
		e._note._el.style.opacity = 1;	
		e._note._el.style.zIndex = 1;
		e._path.parentNode.parentNode.style.zIndex = '';
        },

        _disableLayerDelete: function (e) {
                var layer = e.layer || e.target || e;
				
		if (e._note) {
				this._unhideNote(e);
				this._deletedLayers.removeLayer(e._note);
		}				
				
                layer.off('click', this._removeLayer, this);

                // Remove from the deleted layers so we can't accidently revert if the user presses cancel
                this._deletedLayers.removeLayer(layer);
        },

        _removeLayer: function (e) {

		if (e.target._note) {
			this._deletableLayers.removeLayer(e.target._note);
			this._deletedLayers.addLayer(e.target._note);
		}				
       		
                var layer = e.layer || e.target || e;

                this._deletableLayers.removeLayer(layer);

                this._deletedLayers.addLayer(layer);
        },

	_removeAllLayers: function (e) {
		var drawControl = Wu.app.MapPane._drawControlLayers;

		for (layer in map.myDrawnItems._layers) {			
			drawControl._deletableLayers.removeLayer(map.myDrawnItems._layers[layer]);
			drawControl._deletedLayers.addLayer(map.myDrawnItems._layers[layer]);
		}
		
	},
		
        _onMouseMove: function (e) {
                this._tooltip.updatePosition(e.latlng);
        }
});


L.Draw.Feature.prototype.enable = function () {

		map.LeafletDrawEditEnabled = true;
		
		if (this._enabled) { return; }

		L.Handler.prototype.enable.call(this);

		this.fire('enabled', { handler: this.type });

		this._map.fire('draw:drawstart', { layerType: this.type });
};

L.Draw.Feature.prototype.disable = function () {

		if (!this._enabled) { return; }

		L.Handler.prototype.disable.call(this);
		
		this.fire('disabled', { handler: this.type });
		
		this._map.fire('draw:drawstop', { layerType: this.type });	
};    


// add StyleEditor action to toolbar
L.Toolbar.prototype.getModeHandlers = function (map) {
	var featureGroup = this.options.featureGroup;
	return [
		{
			enabled: this.options.edit,
			handler: new L.EditToolbar.Edit(map, {
				featureGroup: featureGroup,
				selectedPathOptions: this.options.edit.selectedPathOptions
			}),
			title: L.drawLocal.edit.toolbar.buttons.edit
		},
		{
			enabled: this.options.remove,
			handler: new L.EditToolbar.Delete(map, {
				featureGroup: featureGroup
			}),
			title: L.drawLocal.edit.toolbar.buttons.remove
		},

		{
			enabled: true,
			handler: new L.EditToolbar.Style(map, {
				featureGroup: featureGroup,
				selectedPathOptions: this.options.edit.selectedPathOptions
			}),
			title: 'Style'

		}
	];
}

L.Toolbar.prototype.editStyle = function () {
	console.log('edit style!!!');

}

L.EditToolbar.Style = L.Handler.extend({

	initialize : function (map, options) {

		console.log('initialize Style');
		L.Handler.prototype.initialize.call(this, map);
	},

	enable : function () {

		console.log('enable style1');
	},

	disable : function () {

		console.log('disable style');

	}

});

// SVG includes:
// L.Path.getStyle
L.Path.include({
	getStyle : function () {
		if (this._renderer) return this._renderer._getStyle(this);		
		return this._getStyle(this);		
	},

	_getStyle : function (layer) {
		var path = layer._path,
		   style = {};

		style.color = path.getAttribute('stroke');
		style.opacity = parseFloat(path.getAttribute('stroke-opacity'));
		style.strokeWidth = parseFloat(path.getAttribute('stroke-width'));
		style.lineCap = path.getAttribute('stroke-linecap');
		style.lineJoin = path.getAttribute('stroke-linejoin');
		style.dashArray = path.getAttribute('stroke-dasharray');
		style.dashOffset = path.getAttribute('stroke-dashoffset');
		style.fill = true;
		style.fillColor = path.getAttribute('fill');
		style.fillOpacity = parseFloat(path.getAttribute('fill-opacity'));
		style.fillRule = path.getAttribute('fill-rule');
		style.pointerEvents = path.getAttribute('pointer-events');
		
		return style;
	}
});

L.Draw.Feature.include({
	getStyle : function () {
		if (this._renderer) return this._renderer._getStyle(this);		
		return this._getStyle(this);		
	},

	_getStyle : function (layer) {
		var path = layer._path,
		   style = {};

		style.color = path.getAttribute('stroke');
		style.opacity = parseFloat(path.getAttribute('stroke-opacity'));
		style.strokeWidth = parseFloat(path.getAttribute('stroke-width'));
		style.lineCap = path.getAttribute('stroke-linecap');
		style.lineJoin = path.getAttribute('stroke-linejoin');
		style.dashArray = path.getAttribute('stroke-dasharray');
		style.dashOffset = path.getAttribute('stroke-dashoffset');
		style.fill = true;
		style.fillColor = path.getAttribute('fill');
		style.fillOpacity = parseFloat(path.getAttribute('fill-opacity'));
		style.fillRule = path.getAttribute('fill-rule');
		style.pointerEvents = path.getAttribute('pointer-events');
		
		return style;
	}
});

	
	
