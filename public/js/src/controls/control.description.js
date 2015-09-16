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

		// Wrapper for multiple layers
		this._multipleLegendOuter = Wu.DomUtil.create('div', 'description-multiple-toggle-wrapper', container);
		this._multipleLegendInner = Wu.DomUtil.create('div', '', this._multipleLegendOuter);

		this._content = Wu.DomUtil.create('div', 'description-control-content', container);

		this._outer = Wu.DomUtil.create('div', 'description-control-content-box', this._content);

		return container; // turns into this._container on return
	},

	_initContainer : function () {          

		// hide by default
		this._container.style.display = "none";

		// create scroller 
		this._inner = Wu.DomUtil.create('div', 'description-control-inner', this._outer);

		// header
		this._header = Wu.DomUtil.create('div', 'description-control-header-section', this._inner);
		// this._title = Wu.DomUtil.create('div', 'description-control-header-title', this._header);
		this._toggle = Wu.DomUtil.create('div', 'description-control-header-toggle', this._multipleLegendOuter);

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
			       
	
		this._addHooks();

	},


	_addHooks : function () {
		
		// collapsers
		Wu.DomEvent.on(this._toggle, 'click', this.toggle, this);	
	
		// prevent map double clicks
		Wu.DomEvent.on(this._container, 'mousedown click dblclick',  Wu.DomEvent.stopPropagation, this);
		// Wu.DomEvent.on(this._button,    'mousedown mouseup click dblclick',  Wu.DomEvent.stopPropagation, this);

	},

	
	_isActive : function () {
		if (!this._project) return false;
		return this._project.getControls()[this.type];
	},

	show : function () {
		if (!this._container) return;
		this._isActive() ? this._show() : this._hide();
		this.toggleScale(true);
	},


	_show : function () {
		this.refresh();
	},

	refresh : function () {
		this.showHide();
	},

	showHide : function () {

		// Hide if empty
		if ( !this.layers || this.isEmpty(this.layers) ) {
			this._hide();
			return;
		}

		this._container.style.display = 'block';
		this.isOpen = true;

	},

	_hide : function () {	
		this._container.style.display = 'none'; 
		this.isOpen = false;
	},

	_flush : function () {
		this.layers = {};
		this._clear();
	},

	_clear : function () {
		
		this.isOpen = false;
		this.toggleScale(false);
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

		// show
		this._show();

	},

	_addTo : function () {

		this.addTo(app._map);
		this._initContainer();
		this._addHooks();
		this._added = true;
	},	



	// TOGGLE FULL SIZE/SMALL SIZE
	// TOGGLE FULL SIZE/SMALL SIZE
	// TOGGLE FULL SIZE/SMALL SIZE


	toggle : function () {
		if ( !this.isCollapsed ) this.isCollapsed = false;
		this.isCollapsed ? this.toggleOpen() : this.toggleClose();
	},

	toggleOpen : function () {

		this.isCollapsed = false;

		Wu.DomUtil.removeClass(this._legendContainer, 'minimized');
		Wu.DomUtil.removeClass(this._header, 'minimized');		

		var description = this._description.innerHTML;
		if ( description && description != '' ) Wu.DomUtil.removeClass(this._description, 'displayNone');
		
		Wu.DomUtil.removeClass(this._metaContainer, 'displayNone');
		Wu.DomUtil.removeClass(this._toggle, 'legend-toggle-open');

	},

	toggleClose : function () {

		this.isCollapsed = true;

		Wu.DomUtil.addClass(this._legendContainer, 'minimized');
		Wu.DomUtil.addClass(this._header, 'minimized');

		Wu.DomUtil.addClass(this._description, 'displayNone');
		Wu.DomUtil.addClass(this._metaContainer, 'displayNone');		
		Wu.DomUtil.addClass(this._toggle, 'legend-toggle-open');

	},







	// xoxoxox

	_addLayer : function (layer) {

		if ( !this.layers ) this.layers = {};

		var layerUuid = layer.getUuid();
		this.layers[layerUuid] = this.storeLegendData(layer);

		this.setHTMLfromStore(layerUuid);

		// For multiple layers
		this.updateMultiple(layerUuid);

	},

	_removeLayer : function (layer) {

		// Delete layer from store
		var layerUuid = layer.getUuid();
		delete this.layers[layerUuid];

		// Get first object
		for ( var first in this.layers ) break;

		// If there are other legend, display it...
		if ( first ) this.setHTMLfromStore(first)	

		// For multiple layers
		this.updateMultiple(first);

		this.refresh();

	},


	updateMultiple : function (layerUuid) {

		var wrapper = this._multipleLegendInner;
		wrapper.innerHTML = '';

		var length = 0;
		for (var k in this.layers) {
		       length++;
		}		

		for ( var uuid in this.layers ) {

			var title = this.layers[uuid].title;
			var multipleLayer = Wu.DomUtil.create('div', 'each-multiple-description', wrapper, title);
			    multipleLayer.id = 'mulitidec_' + uuid;

			if ( uuid == layerUuid ) {
				length > 1 ? Wu.DomUtil.addClass(multipleLayer, 'active') : Wu.DomUtil.addClass(multipleLayer, 'one-layer');


			} else {
				Wu.DomUtil.removeClass(multipleLayer, 'active');
				Wu.DomUtil.removeClass(multipleLayer, 'one-layer');
			}

			Wu.DomEvent.on(multipleLayer, 'click', this.toggleLegend, this);
	
		}
	},

	// xoxoxox
	toggleLegend : function (e) {

		var id = e.target.id;
		var layerUuid = id.slice(10, id.length);

		this.setHTMLfromStore(layerUuid);

		// For multiple layers
		this.updateMultiple(layerUuid);		

	},


	// Store legend data ...
	// Store legend data ...
	// Store legend data ...		

	storeLegendData : function (layer) {

		// Hard coded key
		// Todo: remove
		var key = 'point';

		// Layer id
		var layerUuid = layer.getUuid();

		// Create empty object
		var legendObj = {};

		// meta
		var meta = legendObj.meta = layer.getMeta();

		// set title
		legendObj.title = layer.getTitle();
		
		// set description
		legendObj.description = layer.getDescription();

		// create description meta
		var area = Math.floor(meta.total_area / 1000000 * 100) / 100;
		var num_points = meta.row_count;
		var num_columns = _.size(meta.columns);
		var size_bytes = meta.size_bytes;
		var startend = this._parseStartEndDate(meta);
		var style = Wu.parse(layer.store.style);

		legendObj.description_meta = {
			'Number of points' : num_points,
			'Covered area (km<sup>2</sup>)' : area,
			'Data size' : size_bytes,
			'Start date' : startend.start,
			'End date' : startend.end
		}

		
		// COLOR RANGE
		if ( style && style[key].color.range ) {

			var colorStops = style[key].color.value;
			var customMinMax = style[key].color.customMinMax;
			var minMax = style[key].color.minMax

			if ( customMinMax[0] != null || customMinMax[0] != NaN || customMinMax[0] != '' ) {
				var min = customMinMax[0];
			} else {
				var min = minMax[0];
			}

			if ( customMinMax[1] != null || customMinMax[1] != NaN || customMinMax[1] != '' ) {
				var max = customMinMax[1];
			} else {
				var max = minMax[1];
			}


			// create legend
			var gradientOptions = {
				colorStops : colorStops,
				minVal : customMinMax[0],
				// medVal : (customMinMax[0]+customMinMax[1]),
				maxVal : customMinMax[1],
				bline : 'Velocity (mm pr. year)'
			}

			legendObj.legendHTML = this.gradientLegend(gradientOptions);

		} else {

			legendObj.legendHTML = 'TODO: Create legend for static colors!';

		}

		return legendObj;

	},


	setHTMLfromStore : function (uuid) {

		var layer = this.layers[uuid];

		// Title
		var title = layer.title;
		
		// Description
		var description = layer.description;
		
		// Description meta
		var descriptionMeta = layer.description_meta;

		// Legend
		var legend = layer.legendHTML;

		// Set title
		// this.setTitleHTML(title);

		// Set description
		this.setDescriptionHTML(description);

		// Set description meta
		this.setMetaHTML(descriptionMeta);

		// Set legend
		this.setLegendHTML(legend);		

	},























	// SET HTML SET HTML SET HTML
	// SET HTML SET HTML SET HTML
	// SET HTML SET HTML SET HTML

	// setTitleHTML : function (title) {
	// 	this._title.innerHTML = title;
	// },

	setMetaHTML : function (meta) {

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

	setLegendHTML : function (HTML) {
		this._legendContainer.innerHTML = HTML;
	},


	setDescriptionHTML : function (text) {
		if ( !text || text != '' ) Wu.DomUtil.removeClass(this._description, 'displayNone');
		if ( this.isCollapsed ) Wu.DomUtil.addClass(this._description, 'displayNone');
		this._description.innerHTML = text;
	},
















	// HELPERS HELPERS HELPERS
	// HELPERS HELPERS HELPERS
	// HELPERS HELPERS HELPERS

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


	isEmpty : function (obj) {
	    for(var prop in obj) {
	        if(obj.hasOwnProperty(prop))
	            return false;
	    }

	    return true;
	},



	// EXTERNAL EXTERNAL EXTERNAL
	// EXTERNAL EXTERNAL EXTERNAL
	// EXTERNAL EXTERNAL EXTERNAL

	// Toggle scale/measure/mouseposition corner
	// Toggle scale/measure/mouseposition corner

	toggleScale : function (openDescription) {

		if ( !app._map._controlCorners.topright ) return;

		if ( openDescription ) {
			Wu.DomUtil.addClass(app._map._controlCorners.topright, 'toggle-scale');
		} else {
			Wu.DomUtil.removeClass(app._map._controlCorners.topright, 'toggle-scale');
		}

	},





	
});

L.control.description = function (options) {
	return new L.Control.Description(options);
};