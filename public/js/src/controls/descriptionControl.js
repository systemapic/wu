L.Control.Description = L.Control.extend({
	
	options: {
		// position : 'topleft' 
		position : 'bottomright' 
	},

	onAdd : function (map) {

		var className = 'leaflet-control-description',
		    container = L.DomUtil.create('div', className),
		    options   = this.options;

		// add html
		container.innerHTML = ich.descriptionControl(); 

		return container; // turns into this._container on return

	},

	initContainer : function () {                
		
		// hide by default
		this._container.style.display = "none";

		// get panes
		this._content 	= Wu.DomUtil.get('description-control-inner-content');
		this._outer     = Wu.DomUtil.get('description-control-inner-content-box'); 
		this._button	= Wu.DomUtil.get('description-toggle-button'); 
		this._legendsContainer = Wu.DomUtil.get('legends-control-inner-content');
		this._legendsCollapser = Wu.DomUtil.get('legends-collapser');
		
		// create scroller 
		this._inner = Wu.DomUtil.create('div', 'description-scroller', this._outer);
		
		// add tooltip
		app.Tooltip.add(this._container, 'Shows layer information', { extends : 'systyle', tipJoint : 'left' });
			       
	},      

	setDescription : function (layer) {

		this._inner.innerHTML = layer.store.description;
	},

	show : function () {
		this._container.style.display = 'block'; 
	},

	hide : function () {
		this._container.style.display = 'none'; 
	},

	// clear content
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

		if ( !layer.store.description && !this.editMode) {
			this.closePane();
			this.clear();
		} 

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
		// Wu.DomEvent.on(this._button, 'click', this.closePane, this);
		Wu.DomEvent.on(this._button, 'click', this.toggleCloser, this);

		// edit mode
		if (this.editMode) Wu.DomEvent.on(this._outer, 'dblclick', this.toggleEdit, this);

		// prevent map double clicks
		Wu.DomEvent.on(this._container, 'mousedown click dblclick',  Wu.DomEvent.stopPropagation, this);
		Wu.DomEvent.on(this._button,    'mousedown mouseup click dblclick',  Wu.DomEvent.stopPropagation, this);


	},
	
	removeHooks : function () {

		// collapsers
		Wu.DomEvent.off(this._button, 'click', this.closePane, this);

		// edit mode
		if (this.editMode) Wu.DomEvent.off(this._inner, 'dblclick', this.toggleEdit, this);

		// prevent map double clicks
		Wu.DomEvent.off(this._container, 'dblclick', Wu.DomEvent.stop, this);
		Wu.DomEvent.off(this._container, 'dblclick', Wu.DomEvent.stop, this);
		Wu.DomEvent.off(this._container, 'mousedown click dblclick',  Wu.DomEvent.stopPropagation, this);
		Wu.DomEvent.off(this._button,    'mousedown mouseup click dblclick',  Wu.DomEvent.stopPropagation, this);

	},

	toggleEdit : function () {

		console.log('toggleEdit', this.editing);

		// return if already editing
		if (this.editing) return;
		
		// turn on editing
		this.editOn();

	},
	
	editOn : function () {

		console.log('editOn', this.activeLayer);

		if (!this.activeLayer) return;

		this.editing = true;

		// bind text editor
		this.addGrande();

		// disable dragging
		app._map.dragging.disable();

		// add class to info box to indicate editMode
		Wu.DomUtil.addClass(this._inner, 'description-editing');

		// bind keys
		Wu.DomEvent.on(this._inner, 'keydown', this.keyDown, this);

		// prevent map scrollzoom
		var map = app._map;
		map.scrollWheelZoom.disable();
		
	},	

	keyDown : function (e) {
		if (e.keyCode == 27 || e.keyCode == 9) {
			this.editOff();
		}
	},

	editOff : function () {
		this.editing = false;

		// hide grande
		this.removeGrande();

		// re-enable dragging
		app._map.dragging.enable();

		// add class to info box to indicate editMode
		Wu.DomUtil.removeClass(this._inner, 'description-editing');

		// blur
		this._inner.setAttribute('contenteditable', "false");

		// prevent map scrollzoom
		var map = app._map;
		map.scrollWheelZoom.enable();

		// save text
		if (this.activeLayer) {
			var text = this._inner.innerHTML;			
			this.activeLayer.store.description = text;
			this.activeLayer.save('description');

			// set status
			app.setSaveStatus();
		}

	},

	textChange : function (editing) {
		if (!editing) this.editOff();
	},

	removeGrande : function () {
		if (!this.grande) return;
		this.grande.destroy();
		delete this.grande;	
	},

	addGrande : function () {

		// get textarea node for grande
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
			        	icon : [app.options.servers.portal + 'images/image-c9471cb2-7e0e-417d-a048-2ac501e7e96f',
			        		app.options.servers.portal + 'images/image-7b7cc7e4-404f-4e29-9d7d-11f0f24faf42'],
			        	className : 'attachment'
			        }),

			        // image attachments
			        images :  new G.Attachments(images, {
			        	icon : [app.options.servers.portal + 'images/image-0359b349-6312-4fe5-b5d7-346a7a0d3c38',
			        		app.options.servers.portal + 'images/image-087ef5f5-b838-48bb-901f-7e896de7c59e'],
			        	embedImage : true,			// embed image in text! 
			        	className : 'image-attachment'
			        }),

			},
			events : {

				// add change event listener
				change : this.textChange.bind(this)
			}
		}

		// create Grande with attachment and image plugin
		this.grande = G.rande(nodes, options);

	},

	// For Mobile Phones
	toggleCloser : function () {

		// Close pane if we're on a desktop / pad
		if ( !Wu.app.mobile ) {
			this.closePane();
		
		// Slide pane if we're on a mobile phone
		} else {
			this._isClosed ? this.mobileOpenPane() : this.mobileClosePane();
		}

	},

	mobileOpenPane : function () {

		Wu.DomUtil.addClass(this._button, 'active-description');

		// Slide In
		this._content.style.left = '0px';
		this._isClosed = false;

		// Close other panes if they are open
		if ( app.MapPane.legendsControl._isOpen ) app.MapPane.legendsControl.MobileCloseLegends();
		if ( app.MapPane.layerMenu._open ) app.MapPane.layerMenu.closeLayerPane();


	},


	mobileClosePane : function () {

		Wu.DomUtil.removeClass(this._button, 'active-description');

		// Slide out (only works in portrait format... in landscape it has to be [0] )
		this._content.style.left = Wu.app.nativeResolution[1] + 'px';
		this._isClosed = true;
	},

	closePane : function () {
		this._container.style.display = "none";
		this._isClosed = true;
	},
	
	openPane : function () {
		this._container.style.display = "block";
		this._isClosed = false;			
	}
	
});


L.control.description = function (options) {
	return new L.Control.Description(options);
};