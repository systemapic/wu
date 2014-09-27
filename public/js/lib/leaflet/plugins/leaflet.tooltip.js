
// ************
// TOOLTIPS
// ***************


// mouse hover hack for several tooltips at same time
L.Tooltip.multiTooltip = function (gridControl) {														

	window.acTips = {};
	window.popupCount = 0;
    var gc = gridControl;

	try {
	gc._show = function (content, o) {

		// turn off tooltips when in Leaflet.Draw edit mode
		if (map.LeafletDrawEditEnabled) {
				return;
		} // works!

		// add layer tooltip to cache		
		window.acTips[this.options.uid] = content;

		// parse content of all active tooltips
        var new_content = this._parse_current_tooltip_content();
        
        
        if (this.options.follow) {
	            this._popup.setContent(new_content).setLatLng(o.latLng);            
	           
	            if (this._map._popup !== this._popup) {						           	

		            	if (!this._map._popup) {
		            			this._popup.openOn(this._map);
		            	}

						window.popupCount++;
						this._map._popup._content = new_content;
				};

        } 
       

	}	
	} catch (e) { console.log('e40'); }


    // .hide()
	try {
	    gc.hide = function () {	
			// delete layer from cache
			delete window.acTips[this.options.uid];
	
			// close only if acTips is empty
			var size = Object.size(window.acTips);
			if (size > 0) {
							
					// set new content
					var new_content = this._parse_current_tooltip_content();
					this._popup.setContent(new_content);
					window.popupCount--;
	
			} else {
	
					// standard close
					//console.log('standard close');
			        this._pinned = false;
			    	this._map.closePopup();
			        this._container.style.display = 'none';
			        this._contentWrapper.innerHTML = '';	
			        L.DomUtil.removeClass(this._container, 'closable');
			        window.popupCount = 0;
			
			}
			
	    }
    } catch (e) { console.log('e41'); }


	gc._mouseover = function(o) {
        if (o.data) {
            L.DomUtil.addClass(this._map._container, 'map-clickable');
        } else {
            L.DomUtil.removeClass(this._map._container, 'map-clickable');
        }

        if (this._pinned) return;

        var content = this._template('teaser', o.data);
        if (content) {
            this._show(content, o);
        } else {
            this.hide();
        }
    };
    

   gc._mousemove = function (o) {
        if (this._pinned) return;
        if (!this.options.follow) return;

        this._popup.setLatLng(o.latLng);
    };



    gc._click = function (o) {
        var location_formatted = this._template('location', o.data);
        if (this.options.location && location_formatted &&
            location_formatted.search(/^https?:/) === 0) {
            return this._navigateTo(this._template('location', o.data));
        }

        if (!this.options.pinnable) return;

        var content = this._template('full', o.data);

        if (!content && this.options.touchTeaser && L.Browser.touch) {
            content = this._template('teaser', o.data);
        }

        if (content) {
            L.DomUtil.addClass(this._container, 'closable');
            this._pinned = true;
            this._show(content, o);
        } else if (this._pinned) {
            L.DomUtil.removeClass(this._container, 'closable');
            this._pinned = false;
            this.hide();
        }
    };
    

    gc._onPopupClose = function () {
    	if (window.popupCount > 1) {
	        this._currentContent = null;
	        this._pinned = false;
	        window.popupCount--;
	        
        } 
    };


    gc._createClosebutton = function (container, fn) {
        var link = L.DomUtil.create('a', 'close', container);
        link.innerHTML = 'close';
        link.href = '#';
        link.title = 'close';

        L.DomEvent
            .on(link, 'click', L.DomEvent.stopPropagation)
            .on(link, 'mousedown', L.DomEvent.stopPropagation)
            .on(link, 'dblclick', L.DomEvent.stopPropagation)
            .on(link, 'click', L.DomEvent.preventDefault)
            .on(link, 'click', fn, this);

        return link;
    };

    gc.onAdd = function (map) {
        this._map = map;
        var className = 'leaflet-control-grid map-tooltip',
            container = L.DomUtil.create('div', className),
            contentWrapper = L.DomUtil.create('div', 'map-tooltip-content');

        // hide the container element initially
        container.style.display = 'none';
        this._createClosebutton(container, this.hide);
        container.appendChild(contentWrapper);

        this._contentWrapper = contentWrapper;
        this._popup = new L.Popup({ autoPan: false, closeOnClick: false });

        map.on('popupclose', this._onPopupClose, this);

        L.DomEvent
            .disableClickPropagation(container)
            // allow people to scroll tooltips with mousewheel
            .addListener(container, 'mousewheel', L.DomEvent.stopPropagation);

        this._layer
            .on('mouseover', this._mouseover, this)
            .on('mousemove', this._mousemove, this)
            .on('click', this._click, this);

        return container;
    };

    gc.onRemove = function (map) {
        map.off('popupclose', this._onPopupClose, this);

        this._layer
            .off('mouseover', this._mouseover, this)
            .off('mousemove', this._mousemove, this)
            .off('click', this._click, this);
    }
    
    
    gc._parse_current_tooltip_content = function () {
		var content = [];
		for (p in window.acTips) { content.push(window.acTips[p]); }
		var stringcontent = content.join('<hr>');

		return stringcontent;
	}

}

