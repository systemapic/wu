// app.MapPane._controls.description
L.Control.Description = Wu.Control.extend({
	
	type : 'description',

	options: {
		position : 'bottomright' 
	},

	onAdd : function (map) {

		var className = 'leaflet-control-description',
		    container = L.DomUtil.create('div', className),
		    options   = this.options;

		this._content = Wu.DomUtil.create('div', 'description-control-content', container)
		this._outer = Wu.DomUtil.create('div', 'description-control-content-box', this._content)

		return container; // turns into this._container on return
	},

	_initContainer : function () {          

		// hide by default
		this._container.style.display = "none";

		// create scroller 
		this._inner = Wu.DomUtil.create('div', 'description-control-inner', this._outer);

		// header
		this._header = Wu.DomUtil.create('div', 'description-control-header-section', this._inner);
		this._title = Wu.DomUtil.create('div', 'description-control-header-title', this._header);
		this._toggle = Wu.DomUtil.create('div', 'description-control-header-toggle', this._header);

		// description
		this._description = Wu.DomUtil.create('div', 'description-control-description displayNone', this._inner);

		// meta
		this._metaContainer = Wu.DomUtil.create('div', 'description-control-meta-container', this._inner);

		// legend
		this._legendContainer = Wu.DomUtil.create('div', 'description-control-legend-container', this._inner);

		// copyright
		this._copyright = Wu.DomUtil.create('div', 'description-copyright', this._outer, '');
		
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


	setTitle : function (title) {
		this._title.innerHTML = title;
	},


	setDescription : function (layer) {

		// this._setDescription(layer.store.description);
		// this.setCopyright(layer);

		// TODO.. remove
		this.initFakeLegend(layer);

	},


	_setDescription : function (text) {

		console.log('%c_setDescription', 'background:red; color: white;')
		console.log('text', text);
		
		if ( !text && text != '' ) Wu.DomUtil.removeClass(this._description, 'displayNone');
		this._description.innerHTML = text;
	},


	setMeta : function (meta) {

		// Clear container
		this._metaContainer.innerHTML = '';

		for (var key in meta) {

			var val = meta[key]

			// Make new content	
			var metaLine = Wu.DomUtil.create('div', 'legends-meta-line', this._metaContainer);
			var metaKey = Wu.DomUtil.create('div', 'legends-meta-key', metaLine, key)
			var metaVal = Wu.DomUtil.create('div', 'legend-meta-valye', metaLine, val)
		}
	},

	setLegend : function (HTML) {

		this._legendContainer.innerHTML = HTML;
	},

	gradientLegend : function (options) {

		// Set color stops
		var colorStops = options.colorStops;

		// Set styling
		var gradientStyle = 'background: -webkit-linear-gradient(left, ' + colorStops.join() + ');';
		gradientStyle    += 'background: -o-linear-gradient(right, '    + colorStops.join() + ');';
		gradientStyle    += 'background: -moz-linear-gradient(right, '  + colorStops.join() + ');';
		gradientStyle    += 'background: linear-gradient(to right, '    + colorStops.join() + ');';
  

		// Container
		var _legendHTML = '<div class="info-legend-container">';

		// Legend Frame
		_legendHTML += '<div class="info-legend-frame">';

		_legendHTML += '<div class="info-legend-val info-legend-min-val">' + options.minVal + '</div>';
		_legendHTML += '<div class="info-legend-val info-legend-med-val">' + options.medVal + '</div>';
		_legendHTML += '<div class="info-legend-val info-legend-max-val">' + options.maxVal + '</div>';

		// Gradient
		_legendHTML += '<div class="info-legend-gradient-container" style="' + gradientStyle + '"></div>';
		_legendHTML += '</div>';

		if (options.bline) {
			_legendHTML += '<div class="info-legend-gradient-bottomline"">' + options.bline + '</div>';
		}

		_legendHTML += '</div>';

		return _legendHTML;
	},

	setCopyright : function (layer) {
		var file = layer.getFile();

		if (file) {
			var text = file.getCopyright();
			var copy = text ? 'Copyright: ' + text : '';
			this._copyright.innerHTML = copy;
		} else {
			this._copyright.innerHTML = '';
		}
	},

	toggle : function () {
		if ( !this.isCollapsed ) this.isCollapsed = false;
		this.isCollapsed ? this.toggleOpen() : this.toggleClose();
	},

	toggleOpen : function () {

		this.isCollapsed = false;

		Wu.DomUtil.removeClass(this._legendContainer, 'minimized');
		Wu.DomUtil.removeClass(this._header, 'minimized');		

		Wu.DomUtil.removeClass(this._description, 'displayNone');
		Wu.DomUtil.removeClass(this._metaContainer, 'displayNone');
		Wu.DomUtil.removeClass(this._toggle, 'legend-toggle-open');

		Wu.DomUtil.removeClass(this._title, 'minimized');
	},

	toggleClose : function () {

		this.isCollapsed = true;

		Wu.DomUtil.addClass(this._legendContainer, 'minimized');
		Wu.DomUtil.addClass(this._header, 'minimized');

		Wu.DomUtil.addClass(this._description, 'displayNone');
		Wu.DomUtil.addClass(this._metaContainer, 'displayNone');		
		Wu.DomUtil.addClass(this._toggle, 'legend-toggle-open');

		Wu.DomUtil.addClass(this._title, 'minimized');

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
		this.isOpen = true;
		this.toggleScale();
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
		// this._addEditHooks();

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

	_isActive : function () {
		if (!this._project) return false;
		return this._project.getControls()[this.type];
	},

	_show : function () {
		this._container.style.display = 'block';
		this.isOpen = true;
	},

	_hide : function () {	
		this._container.style.display = 'none'; 
		this.isOpen = false;
	},

	show : function () {
		if (!this._container) return;
		this._isActive() ? this._show() : this._hide();
		this.toggleScale();
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
		Wu.DomEvent.on(this._toggle, 'click', this.toggle, this);	
	
		// prevent map double clicks
		Wu.DomEvent.on(this._container, 'mousedown click dblclick',  Wu.DomEvent.stopPropagation, this);
		// Wu.DomEvent.on(this._button,    'mousedown mouseup click dblclick',  Wu.DomEvent.stopPropagation, this);

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
			this.activeLayer.setDescription(text);
			this.activeLayer.save('description');

			// save text to file
			var file = this.activeLayer.getFile();
			file.setDescription(text);

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
		app.Analytics.setGaEvent(['Controls', 'Description toggle']);
		

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
	},

	toggleScale : function () {
		app.MapPane.getControls().measure.__toggle();
	},


	_parseStartEndDate : function (meta) {

		// get all columns with dates
		var columns = meta.columns;

		var times = [];

		for (var c in columns) {
			if (c.length == 8) { // because d12mnd is valid moment.js date (??)
				var m = moment(c, "YYYYMMDD");
				var unix = m.format('x');
				if (m.isValid()) {
					var u = parseInt(unix);
					if (u > 0) { // remove errs
						times.push(u);
					}
				}
			}
		};

		function sortNumber(a,b) {
			return a - b;
		}

		times.sort(sortNumber);

		var first = times[0];
		var last = times[times.length-1];
		var m_first = moment(first).format('MMM Do YYYY');
		var m_last = moment(last).format('MMM Do YYYY');

		var startend = {
			start : m_first,
			end : m_last
		}

		return startend;
	},

	initFakeLegend : function (layer) {

		var meta = layer.getMeta();
		console.log('meta: ', meta, layer);

		// set title
		var title = layer.getTitle();
		this.setTitle(title);

		// set description
		var description = layer.getDescription();
		this._setDescription(description);

		// create description meta
		var area = Math.floor(meta.total_area / 1000000 * 100) / 100;
		var num_points = meta.row_count;
		var num_columns = _.size(meta.columns);
		var size_bytes = meta.size_bytes;
		var startend = this._parseStartEndDate(meta);

		var description_meta = {
			'Number of points' : num_points,
			'Covered area (km<sup>2</sup>)' : area,
			'Columns' : num_columns,
			'Data size' : size_bytes,
			'Start date' : startend.start,
			'End date' : startend.end
		}

		// set description meta
		this.setMeta(description_meta);
			
		// create legend
		var gradientOptions = {
			colorStops : ["#ff0000", "#ff3600", "#ff8100", "#ffd700", "#a5ff00", "#00ffa9", "#00ffdf", "#009eff", "#003dff", "#2f00ff"],
			minVal : -20,
			medVal : 0,
			maxVal : 20,
			bline : 'vel[mm/yr]'
		}

		var gradientHTML = this.gradientLegend(gradientOptions);

		// set legend
		this.setLegend(gradientHTML);

	}

	
});

L.control.description = function (options) {
	return new L.Control.Description(options);
};