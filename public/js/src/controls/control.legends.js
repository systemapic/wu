L.Control.Legends = Wu.Control.extend({

	type : 'legends',
	
	options: {
		position : 'bottomleft' 
	},

	_isOpen : false,

	// automatically run when legends is added to map 
	onAdd : function (map) {
		var className = 'leaflet-control-legends',
		    container = L.DomUtil.create('div', className),
		    options = this.options;

		// add html
		container.style.display = 'none';

		// #legends-opener
		this._legendsOpener = Wu.DomUtil.create('div', 'legends-opener', container, 'Open Legends');
		this._legendsOpener.style.display = 'none';

		// #legends-control-inner-content
		this._legendsContainer = Wu.DomUtil.create('div', 'legends-control-inner-content', container);

		// #legends-inner
		this._legendsInner = Wu.DomUtil.create('div', 'leaflet-drag-target legends-inner', this._legendsContainer);

		// #legends-collapser
		this._legendsCollapser = Wu.DomUtil.create('div', 'legends-collapser dropdown-button legends-collapser-trans', this._legendsInner);

		// #legends-scroll-left
		this._legendsScrollLeft = Wu.DomUtil.create('div', 'legends-scroll-left', this._legendsInner);
		 
		// #legends-scroll-right		 
		this._legendsScrollRight = Wu.DomUtil.create('div', 'legends-scroll-right', this._legendsInner);

		// #legends-inner-slider
		this._legendsInnerSlider = Wu.DomUtil.create('div', 'legends-inner-slider', this._legendsInner);

		// add tooltip
		app.Tooltip.add(this._legendsInner, 'Shows legends of active layers', { extends : 'systyle', tipJoint : 'top right'});

		return container;

	},

	addHooks : function () {

		Wu.DomEvent.on(this._legendsCollapser, 'click', this.closeLegends, this);
		Wu.DomEvent.on(this._legendsOpener, 'click', this._GAtoggleOpen, this);

		// prevent map scrollzoom (OOOBS! BLOCKS ALL SCROLLING)
		Wu.DomEvent.on(this._container, 'mousewheel', Wu.DomEvent.stop, this);

		// Scrollers By (j) 
		Wu.DomEvent.on(this._legendsScrollLeft, 'click', this.legendsScrollLeft, this);
		Wu.DomEvent.on(this._legendsScrollRight, 'click', this.legendsScrollRight, this);

		// prevent doubleclick
		Wu.DomEvent.on(this._container, 'dblclick', Wu.DomEvent.stop, this);

		// Stop Propagation
		Wu.DomEvent.on(this._container, 'mousedown click dblclick',  Wu.DomEvent.stopPropagation, this);
		Wu.DomEvent.on(this._legendsCollapser, 'mousedown click dblclick',  Wu.DomEvent.stopPropagation, this);
	
	},

	_addTo : function () {
		this.addTo(app._map);
		this.addHooks();
		this._initContent();
		this._added = true;
	},


	_flush : function () {
		this._legendsInnerSlider.innerHTML = '';
	},

	_refresh : function (hide) {

		// should be active
		if (!this._added) this._addTo();

		// get control active setting from project
		var active = this._project.getControls()[this.type];
		
		// if not active in project, hide
		if (!active) return this._hide();

		// remove old content
		this._flush();

		// add new content
		// this._initContent();

		// add already active layers
		// this.refreshLegends();

		// show
		!hide && this._show();
	},

	_on : function () {
		this._refresh();
		this._addAlreadyActive();
	},
	_off : function () {
		this._hide();
	},

	_addAlreadyActive : function () {
		this.refreshLegends();
	},


	_initContent : function () {
	
		this.legends = {};
		this._layers = [];

		// ADDED BY JØLLE
		this.legendsCounter = []; 
		this.sliderWidth = 0;
		this.sliderOffset = 0;

		// If mobile: start with closed legends pane
		if (app.mobile) {
			this._content.style.left = Wu.app.nativeResolution[1] + 'px';
			this._setClosed();

			// Mobile arrow	
		    	Wu.DomUtil.create('div', 'legends-mobile-arrow', this._content);
		}

	},


	checkWidth : function() {

		// Check window width
		var legendsMaxWidth = window.innerWidth;

		// Set max width of legends
		this.setMaxWidth(legendsMaxWidth)

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

		if (this._isActive()) this._show();
	},

	hide : function () {
		if (!this._container) return;
		
		this._hide();
	},

	// Runs on window resize (from app.js)
	resizeEvent : function (dimensions) {

		// Check window width
		var legendsMaxWidth = dimensions.width;

		// Set max width of legends
		this.setMaxWidth(legendsMaxWidth)

	},

	setMaxWidth : function (legendsMaxWidth) {

		// Check if the layer meny and end layer inspectors are there
		var inspectControl = app.MapPane.getControls().inspect;
		var layermenuControl = app.MapPane.getControls().layermenu;

		legendsMaxWidth -= 20;

		// Is there a layer inspector, and is the pane open?
		if (inspectControl && layermenuControl._open ) legendsMaxWidth -= 280;

		// Set max width of legends container
		this._container.style.maxWidth = legendsMaxWidth + 'px';

		// Figure out if we need the scrollers or not
		if ( this.sliderWidth > legendsMaxWidth ) {
			this.showScrollers() 
		} else {
			this.hideScrollers();	
		} 

	},

	showScrollers : function () {
		this._legendsScrollLeft.style.display = 'block';
		this._legendsScrollRight.style.display = 'block';
	}, 

	hideScrollers : function () {
		this._legendsScrollLeft.style.display = 'none';
		this._legendsScrollRight.style.display = 'none';
	},

	_GAtoggleOpen : function (e) {

		// Google Analytics event tracking
		app.Analytics.setGaEvent(['Controls', 'Legends: toggle open']);

		this.toggleOpen(e);
	},

	// Needed for Mobile phones
	toggleOpen : function(e) {

		// Open / Close Legends for desktop and pad
		if (!app.mobile) {
			this._isOpen ? this.closeLegends() : this.openLegends();
		} else {
			// Open / Close Legends for mobile phones
			this._isOpen ? this.mobileCloseLegends() : this.mobileOpenLegends();
		}


	},

	mobileCloseLegends : function(e) {
		Wu.DomUtil.removeClass(this._legendsOpener, 'legends-open');
		this._content.style.left = Wu.app.nativeResolution[1] + 'px';
		this._setClosed();
	},

	mobileOpenLegends : function(e) {

		// Close layer menu if it's open
		var descriptionControl = app.MapPane.getControls().description;
		var layermenuControl = app.MapPane.getControls().layermenu;
		if (layermenuControl._open) layermenuControl.closeLayerPane();
		if (!descriptionControl._isClosed) descriptionControl.mobileClosePane();

		Wu.DomUtil.addClass(this._legendsOpener, 'legends-open');
		this._content.style.left = '0px';
		this._setOpen();
	},

	closeLegends : function () {

		this._legendsOpener.style.display = 'block';	
		this._legendsInner.style.width = this._legendsWidth + 'px';
		this._legendsInner.style.height = this._legendsHeight + 'px';

		this.calculateHeight()

		setTimeout(function() {
			this._legendsOpener.style.opacity = '1';
			this._legendsInner.style.width = '150px';
			this._legendsInner.style.height = '24px'; 
			this._legendsScrollLeft.style.display = 'none';
			this._legendsScrollRight.style.display = 'none';
		}.bind(this), 10);

		setTimeout(function() {
			this._legendsCollapser.style.opacity = '0'; 
		}.bind(this), 500);

		this._setClosed();

	},

	openLegends : function (e) {

		// Hide the little arrow button         
		if (!app.mobile) this._legendsOpener.style.opacity = '0';

		// opopopopopopopopopop

		// Set the width of the Legends
		this._legendsInner.style.width = this.sliderWidth + 'px';

		// calculate width
		this.checkWidth();

		this._legendsInner.style.height = this._openHeight + 'px';
		
		setTimeout(function(){                  
			this._legendsInner.removeAttribute('style');
			this._legendsCollapser.style.opacity = '1';
			this._legendsOpener.style.display = 'none';
		}.bind(this), 500);      

		this._setOpen();

	},

	// add legend from outside
	addLegend : function (layer) {

		// each layer has its own legends
		this._layers.push(layer);

		// rebuild
		this.refreshLegends();

	},

	removeLegend : function (layer) {

		// remove from local store
		var rem = _.remove(this._layers, function (l) {
			return l.store.uuid == layer.store.uuid;
		});
			
		// remove from array (for width setting)
		_.remove(this._legendsContainer, function (l) {
			return l.id == layer.store.uuid;
		});

		// rebuild
		this.refreshLegends();
	
	},

	// show baselayers also
	refreshAllLegends : function () {

		// get all layers (not just base)
		var layers = app.MapPane.getActiveLayers();
		this.refreshLegends(layers);
	},

	refreshLegends : function (layers) {

		this.legends = null;
		this.legends = {};

		this.legendsCounter = null;
		this.legendsCounter = [];
		this.sliderWidth = 0;

		// remove old legends
		this._legendsInnerSlider.innerHTML = '';

		// get layers that should have legends (active ones)
		var layers = layers || this._getActiveLayers();

		// adds to DOM etc
		layers.forEach(function (layer) {

			// return if no active legends in layer
			if (!this._legendOn(layer)) return; 

			// add legends
			this._addLegend(layer);

		}, this);

		// Hide legends if it's empty
		if (this.legendsCounter.length == 0) {

			// this._legendsContainer.style.display = 'none';
			this._container.style.display = 'none';

			this._setClosed();
		} 
	},

	_legendOn : function (layer) {
		var ons = [];
		var legends = layer.getLegends();
		if (!legends) return false;
		legends.forEach(function (legend) {
			if (legend.on) ons.push(legend);
		});
		return ons.length;
	},

	_getActiveLayers : function () {

		// filter only layermenu layers
		var layers = app.MapPane.getActiveLayers();
		var lm = _.filter(layers, function (l) {
			return !l._isBase;
		});
		return lm;
	},

	_addLegend : function (layer) {
		var uuid = layer.store.uuid;
		var legends = layer.getActiveLegends();
		
		// return if no legend
		if (!legends) return;

		// Make sure that the container is visible...
		// this._legendsContainer.style.display = 'block';
		this._container.style.display = 'block';
		

		// create legends box
	    	var div = Wu.DomUtil.create('div', 'legends-item', this._legendsInnerSlider);

	    	// Set the width of the legends container
		var containerWidth = Math.round(legends.length/4) * 220;
		if (containerWidth < 220) containerWidth = 220;
		div.style.width = containerWidth + 'px';

		// Set the width of the legends slider
		this.sliderWidth += containerWidth;
		this._legendsInnerSlider.style.width = this.sliderWidth + 'px';


	    	var legendWidth = div.offsetWidth;

		// add to local store
		this.legends[uuid] = {
			layer : layer,
			div   : div,
			width : legendWidth
		}

	    	// Added by Jølle		    	
	    	var tempObj = {
			id : uuid,
			width : legendWidth
		}

		// Push in array for sliding control
	    	this.legendsCounter.push(tempObj);

	    	// get header title
	    	var headerTitle = this._getLegendHeader(layer);

		// create legends divs
		var b = Wu.DomUtil.create('div', 'legend-header', div, headerTitle); // header
		var legendsList = Wu.DomUtil.create('div', 'legend-list', div);

		// create legends
		legends.forEach(function (legend) {

			// skip disabled legends
			if (!legend.on) return;

			// create legend divs
			var d = Wu.DomUtil.create('div', 'legend-each', legendsList);
			var e = Wu.DomUtil.create('div', 'legend-feature', d);
			var f = Wu.DomUtil.create('img', 'legend-image1', e);
			var g = Wu.DomUtil.create('img', 'legend-image2', e);
			
			var title = '';
			
			if (legend.key == 'layer') {
				var title = legend.value;
			} else {
				if (legend.key) {
					var title = legend.key.toLowerCase().camelize() + ': ' + legend.value;
				}
			}

			var h = Wu.DomUtil.create('div', 'legend-feature-name', d, title);

			f.src = legend.base64;
			g.src = legend.base64;

		}, this);


		// mark open if not on Mobile
		if (!app.mobile) this._setOpen();

		// see if we need the horizontal scrollers or not
		this.checkWidth();
		this.calculateHeight();
	},

	_setOpen : function () {

		this._isOpen = true;

		// calc
		this._setContentHeight();
	},

	_setClosed : function () {
		this._isOpen = false;

		// calc
		this._setContentHeight();
	},

	_setContentHeight : function () {

		var clientsPane = app.SidePane.Clients;
		var optionsPane = app.SidePane.Map;

		if (clientsPane) clientsPane.setContentHeight();
		if (optionsPane) optionsPane.setContentHeight();
	},

	_getLegendHeader : function (layer) {
		var tip = layer.getTooltip();
		if (!tip) return '';
		return tip.title;
	},

	_adjustLegendSlider : function (legend) {

		// adjust the legends slider (horizontal scroller)
		var legendBounds = legend.div.getBoundingClientRect();

		// if the legend was left of the wrapper box
		if (legendBounds.left < 0) {

			// remove the CSS animation of the slider
			Wu.DomUtil.removeClass(this._legendsInnerSlider, "legends-inner-slider-sliding");
			 
			// add the width of the legend to slider left
			this._legendsInnerSlider.style.left = this._legendsInnerSlider.offsetLeft + legend.width + 'px';

			// remove from the slider offset (counting how many legends that's overflowing to the left of wrapper)
			this.sliderOffset--;
		}
 		
 		// Hacky packy: add CSS animation to slider again
 		var that = this;
		setTimeout(function() {
			Wu.DomUtil.addClass(that._legendsInnerSlider, "legends-inner-slider-sliding");
		}, 500);
		
		// adjust slide width
		this.sliderWidth -= legend.width; 

	},


	legendsScrollLeft : function () {

		// return if no scrolling
		if (this.scrolling) return;
		
		// set offsets
		if (this.sliderOffset >= 1) {

			this.sliderOffset--;
			var mover = this.legendsCounter[this.sliderOffset].width;
			var tempLeft = this._legendsInnerSlider.offsetLeft;
			this._legendsInnerSlider.style.left = tempLeft + mover + 'px';	

			// Prevent double click
			this.scrolling = true;
			setTimeout(function () {
				this.scrolling = false;
			}.bind(this), 500);
		}
	},

	legendsScrollRight : function () {

		// return if no scrolling
		if (this.scrolling) return;

		// set offsets
		if (this.sliderOffset <= this.legendsCounter.length-1) {
			var mover = this.legendsCounter[this.sliderOffset].width;        
			var tempLeft = this._legendsInnerSlider.offsetLeft;
			var rightOffset = this._legendsInner.offsetWidth - (this._legendsInnerSlider.offsetWidth + tempLeft);

			if (rightOffset <= 0) {

				this._legendsInnerSlider.style.left = tempLeft - mover + 'px';
				this.sliderOffset++;

				// Prevent double click
				this.scrolling = true;
				var that = this;
				setTimeout(function () {
					that.scrolling = false;
				}, 500);
			}
		}
	},

	calculateHeight : function() {

		this._legendsHeight 	= this._legendsInner.offsetHeight;
		this._legendsWidth 	= this._legendsInner.offsetWidth;
		this._openHeight 	= this._legendsInner.offsetHeight;
		this._openWidth 	= this._legendsInner.offsetWidth;

		app.StatusPane.setContentHeights();
	}

});


L.control.legends = function (options) {
	return new L.Control.Legends(options);
};