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

		// NB! content is not ready yet, cause not added to map! 
	       
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

	},

	checkWidth : function() {

		// Check window width
		var maxWidth = window.innerWidth;

		// Remove Layer Menu Width from window width, if it exists
		if ( app.MapPane.layerMenu ) maxWidth -= 300;

		// If the Legends slider is wider than the winodw, add the horizontal scroll buttons
		if ( this.sliderWidth > maxWidth ) {
			this._legendsScrollLeft.style.display = 'block';
			this._legendsScrollRight.style.display = 'block';
		} else {
			this._legendsScrollLeft.style.display = 'none';
			this._legendsScrollRight.style.display = 'none';			
		}

		// Check if the Layer Menu EXISTS, so that we can add the correct padding to the legends menu
		if ( app.MapPane.layerMenu ) {

			// Layer menu exists, but add padding to the legends only if the Layer menu is OPEN... 
			// It's 290px when open, and 10px when closed, so I put 100 just in case...
			if ( app.MapPane.layerMenu._container.offsetWidth >= 100 ) {
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
		
		// this.calcHeight();

		this._legendsInner.style.width = this._legendsWidth + 'px';
		this._legendsInner.style.height = this._legendsHeight + 'px';

		var that = this;

		// 
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
		this._legendsInner.style.width = this.sliderWidth + 20 + 'px';


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

		this.calcHeight();

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

		// Make sure that the container is visible...
		this._legendsContainer.style.display = 'block';

		var uuid = layer.store.uuid;
		var legend = layer.store.legend;
		
		// return if no legend
		if (!legend) return;

		// create legends box
		// var div = Wu.DomUtil.create('div', 'legends-item', this._legendsInner, legend);
	    	var div = Wu.DomUtil.create('div', 'legends-item', this._legendsInnerSlider, legend);

	    	var legendWidth = div.offsetWidth; // (j)

		// add to local store
		this.legends[uuid] = {
			layer : layer,
			div   : div,
			width : legendWidth             // ADDED BY JØRGEN
			}

	    	// Added by Jølle
	    	var tempObj = {
			id : uuid,
			width : legendWidth
			}

	    	this.legendsCounter.push(tempObj); // ADDED BY JØLLE

	    	this.sliderWidth += legendWidth;    // ADDED BY JØRGEN

		// Set the width of the inner slider... (j)
		this._legendsInnerSlider.style.width = this.sliderWidth + 20 + 'px';

		// See if we need the horizontal scrollers or not!
		this.checkWidth();

		this.calcHeight();


	},

	removeLegend : function (layer) {
	
		var uuid = layer.store.uuid;
		var legend = this.legends[uuid];

		if (!legend) return;


		// ADJUST THE LEGENDS SLIDER (HORIZONTAL SCROLLER)
		// ADJUST THE LEGENDS SLIDER (HORIZONTAL SCROLLER)

		var legendBounds = legend.div.getBoundingClientRect();

		// If the legend was left of the wrapper box ...
		if ( legendBounds.left < 0 ) {

			// ... remove the CSS animation of the slider
			Wu.DomUtil.removeClass(this._legendsInnerSlider, "legends-inner-slider-sliding");
			 
			// ... add the width of the legend to slider left
			this._legendsInnerSlider.style.left = this._legendsInnerSlider.offsetLeft + legend.width + 'px';

			// ... remove from the slider offset (counting how many legends that's overflowing to the left of wrapper)
			this.sliderOffset--;
		}
 		
 		// Hacky packy: add CSS animation to slider again
 		var that = this;
		setTimeout(function() {
			Wu.DomUtil.addClass(that._legendsInnerSlider, "legends-inner-slider-sliding");
		}, 500) 
		
		// END OF ADJUST LEGENDS SLIDER
		// END OF ADJUST LEGENDS SLIDER


		this.sliderWidth -= legend.width;     // ADDED BY JØRGEN

		// Remove from array
		for ( var i = 0; i<this.legendsCounter.length; i++ ) {
			if ( this.legendsCounter[i].id == uuid ) this.legendsCounter.splice(i, 1);
		}
		
		// Set the width of the inner slider... (j)
		this._legendsInnerSlider.style.width = this.sliderWidth + 20 + 'px';
	    

		var div = legend.div;
		Wu.DomUtil.remove(div);
		delete this.legends[uuid];

		// See if we need the horizontal scrollers or not!
		this.checkWidth();

		this.calcHeight();

		// Hide legends if it's empty
		if ( this.legendsCounter.length == 0 ) this._legendsContainer.style.display = 'none';
		


	},

	legendsScrollLeft : function () {

		if (this.scrolling) return;
		
		if ( this.sliderOffset >= 1 ) {

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
	
		if (this.scrolling) return;

			console.log('scrolling right...')

		    if ( this.sliderOffset <= this.legendsCounter.length-1 ) {
			var mover = this.legendsCounter[this.sliderOffset].width;        
			var tempLeft = this._legendsInnerSlider.offsetLeft;

			var rightOffset = this._legendsInner.offsetWidth - (this._legendsInnerSlider.offsetWidth + tempLeft);

			if ( rightOffset <= 0 ) {

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

	calcHeight : function() {

		this._legendsHeight = this._legendsInner.offsetHeight;
		this._legendsWidth = this._legendsInner.offsetWidth;

		this._openHeight = this._legendsInner.offsetHeight;
		this._openWidth = this._legendsInner.offsetWidth;

		if ( app.SidePane.Map ) app.SidePane.Map.setContentHeight();

	}


});


L.control.legends = function (options) {
	return new L.Control.Legends(options);
};