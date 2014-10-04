L.Control.Description = L.Control.extend({
	
	options: {
		// position : 'topleft' 
		position : 'bottomright' 
	},

	onAdd : function (map) {

		var className = 'leaflet-control-description',
		    container = L.DomUtil.create('div', className),
		    options   = this.options;

		    // console.log('container', container);

		// add html
		container.innerHTML = ich.descriptionControl(); 

		return container; // turns into this._container on return

	},

	initContainer : function () {                

		// Open Menu Button

		// this._uncollapse = Wu.DomUtil.createId('div', 'uncollapse');
		// Wu.DomUtil.addClass(this._uncollapse, 'leaflet-control open-uncollapse');
		// this._uncollapse.innerHTML = 'Show Layer Info';

		this._container.style.display = "none";

		// get panes
		this._content 	= Wu.DomUtil.get('description-control-inner-content');
		// this._inner 	= Wu.DomUtil.get('description-control-inner-content-box'); 
		this._outer     = Wu.DomUtil.get('description-control-inner-content-box'); 
		this._button	= Wu.DomUtil.get('description-toggle-button'); 
		
		// (J)
		// create scroller 
		this._inner = document.createElement("div");
		Wu.DomUtil.addClass(this._inner, "description-scroller");

		this._outer.appendChild(this._inner);

		// get legends container
		this._legendsContainer = Wu.DomUtil.get('legends-control-inner-content');
		this._legendsCollapser = Wu.DomUtil.get('legends-collapser');

	       

	},      

	setDescription : function (layer) {
		this._inner.innerHTML = layer.store.description;
	},

	// clear box
	clear : function () {
		this.activeLayer = false;
		this._inner.innerHTML = '';
	},


	setActiveLayer : function (layer) {
		this.setLayer(layer);
	},

	setLayer : function (layer) {
		this.activeLayer = layer;
		this.setDescription(layer);
	},

	removeLayer : function (layer) {
		if (this.activeLayer == layer) this.clear();
	},

	update : function (project) {

		// get vars
		this.project = project || Wu.app.activeProject;

		// set editMode
		this.editMode = this.project.editMode;
		this.editing = false;
		this.activeLayer = false;

		// refresh container        
		this.initContainer();

		// add hooks
		this.addHooks();

		// clear
		this.clear();

	},  

	addHooks : function () {
		
		// collapsers
		Wu.DomEvent.on(this._button,     'mousedown', this.closePane, this);
		// Wu.DomEvent.on(this._uncollapse, 'mousedown', this.openPane,  this);

		// edit mode
		if (this.editMode) {
			Wu.DomEvent.on(this._inner, 'dblclick', this.toggleEdit, this);
		}

		// prevent map double clicks
		Wu.DomEvent.on(this._container, 'dblclick', Wu.DomEvent.stop, this);

		// prevent map scrollzoom
		var map = app._map;
		Wu.DomEvent.on(this._content, 'mouseenter', function () {
			map.scrollWheelZoom.disable();
		}, this);
		
		Wu.DomEvent.on(this._content, 'mouseleave', function () {
			map.scrollWheelZoom.enable();
		}, this);

	},

	toggleEdit : function () {

		// return if already editing
		if (this.editing) return;
		
		// turn on editing
		this.editOn();

	},
	
	editOff : function () {
		console.log('editOff');
		this.editing = false;

		// unbind text editor
		// grande.unbind([this._inner]);

		// // hide grande menu
		// var g = document.getElementsByClassName('text-menu')[0];
		// Wu.DomUtil.removeClass(g, 'active');
		// Wu.DomUtil.addClass(g, 'hide');
		
		// hide grande
		this.removeGrande();

		// re-enable dragging
		app._map.dragging.enable();

		// add class to info box to indicate editMode
		Wu.DomUtil.removeClass(this._inner, 'description-editing');

		// bind click anywhere but on INFO to turn off editing
		Wu.DomEvent.off(this._inner, 'click', Wu.DomEvent.stop, this);
		Wu.DomEvent.off(document, 'click', this.editOff, this);

		// save text
		if (this.activeLayer) {
			var text = this._inner.innerHTML;
			console.log('saving text: ', text);
			
			this.activeLayer.store.description = text;
			this.activeLayer.save('description');
		}

	},

	editOn : function () {

		if (!this.activeLayer) {
			console.log('no active layer, so fuck it.')
			return;
		}

		console.log('editOn');
		this.editing = true;

		// bind text editor
		// grande.bind([this._inner]);
		this.addGrande();

		// disable dragging
		app._map.dragging.disable();

		// add class to info box to indicate editMode
		Wu.DomUtil.addClass(this._inner, 'description-editing');

		// bind click anywhere but on INFO to turn off editing
		Wu.DomEvent.on(this._inner, 'click', Wu.DomEvent.stop, this);
		Wu.DomEvent.on(document, 'click', this.editOff, this);

	},

	textChange : function () {
		console.log('text Change');
	},

	removeGrande : function () {

		
	},

	addGrande : function () {
		// get textarea nodes for grande
		var nodes = this._inner;

		// get sources
		var files = this.project.getFiles();
		var sources = this.project.getGrandeFiles();
		var images = this.project.getGrandeImages();

		// set grande options
		var options = {
			plugins : {

		        	// file attachments
			        attachments : new G.Attachments(sources, {
			        	icon : 'fileAttachment.png',
			        }),

			        // image attachments
			        images :  new G.Attachments(sources, {
			        	icon : 'imageAttachment.png',
			        	embedImage : true 			// embed image in text! 
			        }),

			},
			events : {

				// add change event listener
				change : this.textChange
			}
		}

		// create Grande with attachment and image plugin
		this.grande = G.rande(nodes, options);

	},

	// (j)
	closePane : function () {
	      
		// console.log('this._content', this._content)
		this._container.style.display = "none";

		// this._content.parentNode.parentNode.style.width = '34px';
		// this._firstchildofmine = this._content.parentNode.parentNode.getElementsByTagName('div')[0];
		// this._content.parentNode.parentNode.insertBefore(this._uncollapse, this._firstchildofmine);
	      

		// Slide the LEGENDS
		// if (this._legendsContainer) {
		//     Wu.DomUtil.addClass(this._legendsContainer, 'legends-push-left');
		// }
			      
		// this._uncollapse.className = 'leaflet-control open-uncollapse leaflet-drag-target';		
		
	},
	
	// (j)
	openPane : function () {

		this._container.style.display = "block";

		// Show Info box
		// this._content.parentNode.parentNode.style.width = '320px';					

		// Animate opener button
		// this._uncollapse.className = 'leaflet-control uncollapse-killer';
			
		// Slide the LEGENDS
	 //   	 if (this._legendsContainer) {
		// 	Wu.DomUtil.removeClass(this._legendsContainer, 'legends-push-left');
		// }
		// Set class name and remove from DOM
		// var that = this;                        
		// setTimeout(function(){
		// 	that._content.parentNode.parentNode.removeChild(that._uncollapse);
		// 	that._uncollapse.className = 'leaflet-control open-uncollapse';
		// }, 500);						
		
	},
	
      
     

});


L.control.description = function (options) {
	return new L.Control.Description(options);
};