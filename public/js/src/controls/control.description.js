L.Control.Description = Wu.Control.extend({
	
	type : 'description',

	options: {
		position : 'topleft' 
	},

	onAdd : function (map) {
		var className = 'leaflet-control-description',
		    container = L.DomUtil.create('div', className),
		    options   = this.options;

		this._button = Wu.DomUtil.create('div', 'dropdown-button description-toggle-button', container)
		this._content = Wu.DomUtil.create('div', 'description-control-inner-content', container)
		this._collapser = Wu.DomUtil.create('div', 'menucollapser collapse-description', this._content, 'Info');
		this._outer = Wu.DomUtil.create('div', 'description-control-inner-content-box', this._content)

		return container; // turns into this._container on return
	},

	_initContainer : function () {          

		// hide by default
		this._container.style.display = "none";

		// create scroller 
		this._inner = Wu.DomUtil.create('div', 'description-scroller', this._outer);
		
		// add tooltip
		app.Tooltip.add(this._container, 'Shows layer information', { extends : 'systyle', tipJoint : 'left' });
			       
		// If mobile: start closed info/description pane
		if (app.mobile) {
			this._content.style.left = Wu.app.nativeResolution[1] + 'px';
			this._isClosed = true;

			// Mobile arrow	
		    	Wu.DomUtil.create('div', 'description-mobile-arrow', this._content);
		}

	},      

	_addTo : function () {

		this.addTo(app._map);
		this._initContainer();
		this._addHooks();
		this._added = true;
	},

	_flush : function () {
		this.layers = {};
		this._clear();
	},

	_clear : function () {
		this._setDescription('');
	},

	_refresh : function () {

		// should be active
		if (!this._added) this._addTo();

		// get control active setting from project
		var active = this._project.getControls()[this.type];

		// if not active in project, hide
		if (!active) return this._hide();

		// remove old content
		this._flush();

		// add edit hooks
		this._addEditHooks();

		// show
		this._show();

		// hide if empty
		this._hideIfEmpty();
	},

	_addEditHooks : function () {

		// turn off
		Wu.DomEvent.off(this._outer, 'dblclick', this.toggleEdit, this);

		// turn on if editor
		var isEditor = app.access.to.edit_project(this._project);
		if (isEditor) {
			Wu.DomEvent.on(this._outer, 'dblclick', this.toggleEdit, this);
		}
	},

	_on : function () {
		this._show();
	},

	_off : function () {
		this._hide();
	},

	setDescription : function (layer) {
		this._setDescription(layer.store.description);
	},

	_setDescription : function (text) {
		this._inner.innerHTML = text;
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
		this._isActive() ? this._show() : this._hide();
	},

	hide : function () {
		if (!this._container) return;
		this._hide();
	},

	_hideIfEmpty : function () {
		if (!this.activeLayer) this._hide();
	},

	setActiveLayer : function (layer) {
		this.setLayer(layer);
	},

	setLayer : function (layer) {
		this.activeLayer = layer;
		this.setDescription(layer);

		this._show();

		var isEditor = app.access.to.edit_project(this._project);
		if (!layer.getDescription() && !isEditor) {
			this.closePane();
			// this.clear();
		} 
	},

	removeLayer : function (layer) {
		if (this.activeLayer == layer) {
			this._flush();
		}
	},

	_addHooks : function () {
		
		// collapsers
		Wu.DomEvent.on(this._button, 'click', this._GAtoggleCloser, this);
		
		// prevent map double clicks
		Wu.DomEvent.on(this._container, 'mousedown click dblclick',  Wu.DomEvent.stopPropagation, this);
		Wu.DomEvent.on(this._button,    'mousedown mouseup click dblclick',  Wu.DomEvent.stopPropagation, this);
	},

	toggleEdit : function () {

		// return if already editing
		if (this.editing) return;
		
		// turn on editing
		this.editOn();

		// Google Analytics event tracking
		app.Analytics.setGaEvent(['Controls', 'Description: edit content']);
	},
	
	editOn : function () {
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
		app._map.scrollWheelZoom.disable();
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
		app._map.scrollWheelZoom.enable();

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
		var files = this._project.getFiles();
		var sources = this._project.getGrandeFiles();
		var images = this._project.getGrandeImages();

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

	_GAtoggleCloser : function () {

		// Google Analytics event tracking
		app.Analytics.ga(['Controls', 'Description toggle']);

		// Fire function
		this.toggleCloser();

	},

	// For Mobile Phones
	toggleCloser : function () {

		// Close pane if we're on a desktop / pad
		if (!app.mobile) {
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
		var legends = app.MapPane.getControls().legends;
		var layermenu = app.MapPane.getControls().layermenu;
		if (legends._isOpen) legends.MobileCloseLegends();
		if (layermenu._open) layermenu.closeLayerPane();
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