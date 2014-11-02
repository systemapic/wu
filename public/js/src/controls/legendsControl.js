L.Control.Legends = L.Control.extend({
	
	options: {
		position : 'bottomleft' 
	},

	// automatically run when legends is added to map 
	onAdd : function (map) {

		var className = 'leaflet-control-legends',
		    container = L.DomUtil.create('div', className),
		    options = this.options;

		// add html
		container.innerHTML = ich.legendsControl(); 
	       
		// create legendsOpener
		this._legendsOpener = Wu.DomUtil.createId('div', 'legends-opener');
		this._legendsOpener.innerHTML = 'Open Legends';
		Wu.DomUtil.addClass(this._legendsOpener, 'opacitizer');

				
		return container;

	},

	addHooks : function () {

		Wu.DomEvent.on(this._legendsCollapser, 'click', this.closeLegends, this);

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

	checkWidth : function() {

		// Check window width
		var maxWidth = window.innerWidth;

		// Remove Layer Menu Width from window width, if it exists
		if (app.MapPane.layerMenu) maxWidth -= 300;

		// If the Legends slider is wider than the winodw, add the horizontal scroll buttons
		if ( this.sliderWidth > maxWidth ) {
			this._legendsScrollLeft.style.display = 'block';
			this._legendsScrollRight.style.display = 'block';
		} else {
			this._legendsScrollLeft.style.display = 'none';
			this._legendsScrollRight.style.display = 'none';			
		}

		// Check if the Layer Inspector EXISTS, so that we can add the correct padding to the legends menu
		var inspectControl = app.MapPane.inspectControl;
		if (inspectControl) {
			if (inspectControl._container.offsetWidth >= 100 ) {
				Wu.DomUtil.addClass(this._legendsContainer, 'legends-padding-right');
			}
		} else {
			Wu.DomUtil.removeClass(this._legendsContainer, 'legends-padding-right');
		}

	},	

	closeLegends : function () {

		var _1stchild = this._legendsInner.getElementsByTagName('div')[0];		// refactor ?
		this._legendsInner.insertBefore(this._legendsOpener, _1stchild);
		
		Wu.DomEvent.on(this._legendsOpener, 'click', this.openLegends, this);
		
		this._legendsInner.style.width = this._legendsWidth + 'px';
		this._legendsInner.style.height = this._legendsHeight + 'px';

		var that = this;

		setTimeout(function() {
			that._legendsInner.style.width = '150px';
			that._legendsInner.style.height = '24px'; 
			that._legendsScrollLeft.style.display = 'none';
			that._legendsScrollRight.style.display = 'none';
		}, 10);

		setTimeout(function() {
			that._legendsCollapser.style.display = 'none';
			that._legendsCollapser.style.opacity = '0'; 

			this._openWidth = 0;
			this._openHeight = 0;
			this._legendsWidth = 0;
			this._legendsHeight = 0;

		}, 500);

	},


	openLegends : function (e) {

		// Hide the little arrow button         
		this._legendsOpener.className = '';
		this._legendsOpener.style.opacity = '0';

		// Set the width of the Legends
		this._legendsInner.style.width = this.sliderWidth + 'px';

		// calculate width
		this.checkWidth();


		this._legendsInner.style.height = this._openHeight - 5 + 'px';         
		
		var that = this;
		setTimeout(function(){                  
			that._legendsInner.removeAttribute('style');
			that._legendsOpener.removeAttribute('style');
			that._legendsInner.removeChild(that._legendsOpener);


			Wu.DomUtil.addClass(that._legendsCollapser, 'opacitizer');
			that._legendsCollapser.style.opacity = '1';
			that._legendsCollapser.style.display = 'block';

		}, 500);                

	},

	// is called when changing/selecting project
	update : function (project) {
	       
		// init divs
		this.initContainer();

		// project is ready only here, so init relevant vars
		// update is called from enableLayermenu toggle in MapPane

		// get vars
		this.project = project || Wu.app._activeProject;
		this._content = Wu.DomUtil.get('legends-control-inner-content'); 

		this.calculateHeight();

	},

	initContainer : function () {
	
		// get elements
		this._legendsCollapser = Wu.DomUtil.get('legends-collapser');
		this._legendsInner = Wu.DomUtil.get('legends-inner');
		this._legendsContainer = Wu.DomUtil.get('legends-control-inner-content');
		this._legendsInnerSlider = Wu.DomUtil.get('legends-inner-slider');

		this._legendsScrollLeft = Wu.DomUtil.get('legends-scroll-left'); // (j)
		this._legendsScrollRight = Wu.DomUtil.get('legends-scroll-right'); // (j)

		// add hooks
		this.addHooks();

		this.legends = {};

		// ADDED BY JØLLE
		this.legendsCounter = []; 
		this.sliderWidth = 0;
		this.sliderOffset = 0;

	},


	addLegend : function (layer) {

		var uuid = layer.store.uuid;
		var legends = layer.getLegends();
		
		// return if no legend
		if (!legends) return;

		// Make sure that the container is visible...
		this._legendsContainer.style.display = 'block';

		// create legends box
	    	var div = Wu.DomUtil.create('div', 'legends-item', this._legendsInnerSlider);

	    	// Set the width of the legends container
		var containerWidth = Math.round(legends.length/4) * 150;
		if ( containerWidth < 150 ) containerWidth = 150;
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


		// create legends divs
		var b = Wu.DomUtil.create('div', 'legend-header', div);
		this._legendsList = Wu.DomUtil.create('div', 'legend-list', div);

		// create legends
		legends.forEach(function (legend) {

			// create legend divs
			var d = Wu.DomUtil.create('div', 'legend-each', this._legendsList);
			var e = Wu.DomUtil.create('div', 'legend-feature', d);
			var f = Wu.DomUtil.create('img', 'legend-image1', e);
			var g = Wu.DomUtil.create('img', 'legend-image2', e);
			var h = Wu.DomUtil.create('div', 'legend-feature-name', d, legend.value);

			f.src = legend.base64;
			g.src = legend.base64;

		}, this);

		

		// see if we need the horizontal scrollers or not
		this.checkWidth();
		this.calculateHeight();

	},

	_addLegend : function (legend) {

		


	},

	removeLegend : function (layer) {
	
		var uuid = layer.store.uuid;
		var legend = this.legends[uuid];

		// return if no legend to remove
		if (!legend) return; 

		// Remove from array
		for (var i = 0; i < this.legendsCounter.length; i++) {
			if (this.legendsCounter[i].id == uuid) this.legendsCounter.splice(i, 1);
		}
		
		// adjust legend slider
		this._adjustLegendSlider(legend);

		// Set the width of the inner slider... (j)
		this._legendsInnerSlider.style.width = this.sliderWidth + 'px';
	    
	    	// remove div
		var div = legend.div;
		Wu.DomUtil.remove(div);
		delete this.legends[uuid];

		// See if we need the horizontal scrollers or not!
		this.checkWidth();

		// Store legends height
		this.calculateHeight();

		// Hide legends if it's empty
		if (this.legendsCounter.length == 0) this._legendsContainer.style.display = 'none';
		
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
			var that = this;
			setTimeout(function () {
				that.scrolling = false;
			}, 500);
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