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

	closeLegends : function () {

		this._legendsInner.style.width = this._legendsInner.offsetWidth + 'px';

		var _1stchild = this._legendsInner.getElementsByTagName('div')[0];		// refactor ?
		this._legendsInner.insertBefore(this._legendsOpener, _1stchild);
		
		Wu.DomEvent.on(this._legendsOpener, 'click', this.openLegends, this);
		
		var sh = this._legendsInner.offsetHeight;

		this._legendsCollapser.setAttribute('sh', sh);	//todo: readable name
		this._legendsInner.style.width = '150px';
		this._legendsInner.style.height = '24px'; 
		this._legendsCollapser.style.display = 'none';
		this._legendsCollapser.style.opacity = '0'; 
		this._legendsScrollLeft.style.display = 'none';
		this._legendsScrollRight.style.display = 'none';

		// Measure, plus Long & Lat (.leaflet-top.leaflet-right)                
		Wu.app.MapPane._container.children[1].children[1].style.bottom = '6px';   // refactor?               
	
	},

	openLegends : function (e) {


		// Hide the little arrow button         
		this._legendsOpener.className = '';
		this._legendsOpener.style.opacity = '0';

		// Find out the width of the container
		var fatherwidth = this._legendsContainer.offsetWidth - 287 - 335; // The numbers are the width of the layer and info menus
		var hasleft = Wu.DomUtil.hasClass(this._legendsContainer, 'legends-push-left');
		var hasright = Wu.DomUtil.hasClass(this._legendsContainer, 'legends-push-right');
		if ( hasleft ) { fatherwidth += 287; }
		if ( hasright ) { fatherwidth += 335 - 10; }

		// Set the width of the Legends
		this._legendsInner.style.width = fatherwidth + 'px';  

		// Hacky packy - Pick up the height of the legends from before we collapsed it, 
		// which is stored in the collapse button as a 'sh' attribute
		this._legendsInner.style.height = this._legendsCollapser.getAttribute('sh') + 'px';         
		

		// Measure, plus Long & Lat (.leaflet-top.leaflet-right)                
		Wu.app.MapPane._container.children[1].children[1].style.bottom = '133px';  // refactor?                 


		var that = this; // this is different context inside setTimeout
		setTimeout(function(){                  
			that._legendsInner.removeAttribute('style');
			that._legendsOpener.removeAttribute('style');
			that._legendsInner.removeChild(that._legendsOpener);

			Wu.DomUtil.addClass(that._legendsCollapser, 'opacitizer');

			that._legendsCollapser.style.opacity = '1';
			that._legendsCollapser.style.display = 'block';

			that._legendsScrollLeft.style.display = 'block';
			that._legendsScrollRight.style.display = 'block';
	 
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
	    

	},

	removeLegend : function (layer) {
		var uuid = layer.store.uuid;
	    var legend = this.legends[uuid];
	    if (!legend) return;

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

	    if ( this.sliderOffset <= this.legendsCounter.length-1 ) {
		var mover = this.legendsCounter[this.sliderOffset].width;        
		var tempLeft = this._legendsInnerSlider.offsetLeft;

		this._legendsInnerSlider.style.left = tempLeft - mover + 'px';
		this.sliderOffset++;

		// Prevent double click
		this.scrolling = true;
		var that = this;
		setTimeout(function () {
			that.scrolling = false;
		}, 500);
	    }

	},


});


L.control.legends = function (options) {
	return new L.Control.Legends(options);
};