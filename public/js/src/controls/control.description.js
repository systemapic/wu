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

		this._toggle = Wu.DomUtil.create('div', 'description-control-header-toggle', this._multipleLegendOuter);		

		// description
		this._description = Wu.DomUtil.create('div', 'description-control-description displayNone', this._inner);

		// meta
		this._metaContainer = Wu.DomUtil.create('div', 'description-control-meta-container', this._inner);		

		// init satellite path container
		this.satelliteAngle = new Wu.satteliteAngle({angle : false, path: false, appendTo : this._inner});

		// legend
		this._legendContainer = Wu.DomUtil.create('div', 'description-control-legend-container', this._inner);

		// copyright
		this._copyright = Wu.DomUtil.create('div', 'description-copyright', this._outer, '');
		
		// add tooltip
		app.Tooltip.add(this._container, 'Shows layer information', { extends : 'systyle', tipJoint : 'left' });
			       

		// add event hooks
		this._addHooks();
	},

	_addHooks : function () {
		
		// collapsers
		Wu.DomEvent.on(this._toggle, 'click', this.toggle, this);	
	
		// prevent map double clicks
		Wu.DomEvent.on(this._container, 'mousedown click dblclick',  Wu.DomEvent.stopPropagation, this);
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

	hide : function () {
		if (!this._container) return;
		this._hide();
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

		this.toggleScale(false);
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

	_onLayerStyleEdited   : function (e) {
		var layer = e.detail.layer;
		this._refreshLayer(layer);
	},

	_addTo : function () {
		this.addTo(app._map);
		this._initContainer();
		this._addHooks();
		this._added = true;
	},	

	_refreshLayer : function (layer) {

		// get layer
		this.layers[layer.getUuid()] = layer;


		this.setHTMLfromStore(layer.getUuid());
		this.updateMultiple(layer.getUuid());
	},

	toggle : function () {
		if ( !this.isCollapsed ) this.isCollapsed = false;
		this.isCollapsed ? this.toggleOpen() : this.toggleClose();
	},

	toggleOpen : function () {

		this.isCollapsed = false;

		Wu.DomUtil.removeClass(this._legendContainer, 'minimized');
		Wu.DomUtil.removeClass(this._header, 'minimized');		

		var description = this._description.innerHTML;
		if (description && description != '') Wu.DomUtil.removeClass(this._description, 'displayNone');
		
		Wu.DomUtil.removeClass(this._metaContainer, 'displayNone');
		Wu.DomUtil.removeClass(this._toggle, 'legend-toggle-open');


		if ( !this.satelliteAngle.closed ) Wu.DomUtil.removeClass(this.satelliteAngle._innerContainer, 'displayNone');
	},

	toggleClose : function () {

		this.isCollapsed = true;

		Wu.DomUtil.addClass(this._legendContainer, 'minimized');
		Wu.DomUtil.addClass(this._header, 'minimized');

		Wu.DomUtil.addClass(this._description, 'displayNone');
		Wu.DomUtil.addClass(this._metaContainer, 'displayNone');		
		Wu.DomUtil.addClass(this._toggle, 'legend-toggle-open');


		Wu.DomUtil.addClass(this.satelliteAngle._innerContainer, 'displayNone');
	},

	_addLayer : function (layer) {

		this.layers = this.layers || {};

		var layerUuid = layer.getUuid();
		this.layers[layerUuid] = layer;

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

		if ( this.isCollapsed ) Wu.DomUtil.addClass(this.satelliteAngle._innerContainer, 'displayNone');

		var wrapper = this._multipleLegendInner;
		wrapper.innerHTML = '';

		var length = 0;
		for (var k in this.layers) {
		       length++;
		}		

		for ( var uuid in this.layers ) {

			var layer = this.layers[uuid];

			// var title = this.layers[uuid].title;
			title = layer.getTitle();
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

	toggleLegend : function (e) {

		var id = e.target.id;
		var layerUuid = id.slice(10, id.length);

		this.setHTMLfromStore(layerUuid);

		// For multiple layers
		this.updateMultiple(layerUuid);		

	},


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
			'Start date' : startend.start,
			'End date' : startend.end
		}

		// COLOR RANGE
		if ( style && style[key].color.column ) {

			var colorStops = style[key].color.value;
			// var customMinMax = style[key].color.customMinMax;
			var minMax = style[key].color.range;

			var min = minMax[0];
			var max = minMax[1];

			// create legend
			var gradientOptions = {
				colorStops : colorStops,
				minVal : minMax[0],
				maxVal : minMax[1],
				bline : 'Velocity (mm pr. year)'
			}

			legendObj.legendHTML = this.gradientLegend(gradientOptions);

		} else {
			// legendObj.legendHTML = '';
			legendObj.legendHTML = this.createLegend();

		}

		return legendObj;
	},


	getLegend : function (layer) {

		// get styling
		var style = layer.getStyling();

		
		// point
		if (style && style.point && style.point.color && style.point.color.column) {

			var colorStops = style.point.color.value;
			var minMax = style.point.color.range
			var min = minMax[0];
			var max = minMax[1];
			var bline = this._getLegendCaption(style.point.color);

			// create legend
			var gradientOptions = {
				colorStops : colorStops,
				minVal : minMax[0],
				maxVal : minMax[1],
				bline : bline
			}

			var legendHTML = this.gradientLegend(gradientOptions);

		// polygon
		} else if (style && style.polygon && style.polygon.color && style.polygon.color.column) {

			var colorStops = style.polygon.color.value;
			var minMax = style.polygon.color.range
			var min = minMax[0];
			var max = minMax[1];
			var bline = this._getLegendCaption(style.polygon.color);

			// create legend
			var gradientOptions = {
				colorStops : colorStops,
				minVal : minMax[0],
				maxVal : minMax[1],
				bline : bline
			}

			var legendHTML = this.gradientLegend(gradientOptions);

		// catch-all
		} else {

			// var legendHTML = '';
			var legendHTML = this.createLegend();

		}

		return legendHTML;

	},

	_getLegendCaption : function (color) {

		var column = color.column;

		if (column) {

			// special case
			if (column == 'vel' || column == 'mvel') {
				return 'Velocity (mm/year)'
			}

			// camelize, return
			return column;
		}

		return '';

	},

	getMetaDescription : function (layer) {

		var meta = layer.getMeta();

		// set geom type
		var geom_type = 'items'
		if (meta.geometry_type == 'ST_Point') geom_type = 'points';
		if (meta.geometry_type == 'ST_MultiPolygon') geom_type = 'polygons';

		// create description meta
		var area = Math.floor(meta.total_area / 1000000 * 100) / 100;
		var num_points = meta.row_count;
		var startend = this._parseStartEndDate(meta);

		description_meta = {};
		description_meta['Number of ' + geom_type] = num_points;
		description_meta['Covered area (km<sup>2</sup>)'] = area;
		
		if (startend.start != startend.end) {
			description_meta['Start date'] = startend.start;
			description_meta['End date'] = startend.end;
		}


		return description_meta;
	},


	setHTMLfromStore : function (uuid) {


		// var layer = this.layers[uuid];
		var layer = this._project.getLayer(uuid);

		if ( !layer ) return;

		// xoxoxoxooxo
		this.legendary(layer);		
		
		// Title
		var title = layer.getTitle();
		
		// Description
		var description = layer.getDescription();
		
		// Description meta
		var descriptionMeta = this.getMetaDescription(layer);

		// Legend
		var legend = this.getLegend(layer);

		// var _layer = this._project.getLayer(uuid);
		var satPos = Wu.parse(layer.getSatellitePosition());

		var _angle = satPos.angle;
		var _path  = satPos.path;

		this.satelliteAngle.update({angle : _angle, path : _path});

		// Set description
		this.setDescriptionHTML(description);

		// Set description meta
		this.setMetaHTML(descriptionMeta);

		// Set legend
		this.setLegendHTML(legend);


	},

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
			if (obj.hasOwnProperty(prop)) return false;
		}

		return true;
	},



	// EXTERNAL EXTERNAL EXTERNAL
	// Toggle scale/measure/mouseposition corner
	toggleScale : function (openDescription) {

		if (!app._map._controlCorners.topright) return;

		if (openDescription) {
			Wu.DomUtil.addClass(app._map._controlCorners.topright, 'toggle-scale');
		} else {
			Wu.DomUtil.removeClass(app._map._controlCorners.topright, 'toggle-scale');
		}
	},

	_on : function () {

		this._show();

	},

	_off : function () {

		this._hide();

	},





	// xoxoxoxoxoxox
	legendary : function  (layer) {

		if ( !layer.isPostgis() ) return;

		var styleJSON   = Wu.parse(layer.store.style);

		var point 	= styleJSON.point;
		var line 	= styleJSON.line;
		var polygon 	= styleJSON.polygon;


		var legendObj = this.legendObj = {

			layerName : layer.getTitle(),
			
			point 	: {
				all 	: {},
				target 	: []
			},

			polygon : {
				all 	: {},
				target 	: []
			},

			line 	: {
				all 	: {},
				target 	: []
			}
		};


		// POINT
		// POINT
		// POINT

		if ( point.enabled ) {

			var legend = {};

			// COLOR
			// COLOR
			// COLOR

			// polygon color range
			if ( point.color.column ) {

				var column   = point.color.column;
				var value    = point.color.value; 
				var minRange = point.color.range[0];
				var maxRange = point.color.range[1];

				// Save legend data
				legend.color = {};
				legend.color.column   = column; 
				legend.color.value    = value;
				legend.color.minRange = minRange;
				legend.color.maxRange = maxRange;


			// static polygon color
			} else {

				var value = polygon.color.staticVal ? polygon.color.staticVal : 1;

				// Save legend data
				legend.color = {};
				legend.color.column = false;
				legend.color.value  = value;

			}
			

			// OPACITY
			// OPACITY
			// OPACITY

			// polygon opacity range
			if ( point.opacity.column ) {

				var column   = point.opacity.column;
				var minRange = point.opacity.range[0];
				var maxRange = point.opacity.range[1];

				// Save legend data
				legend.opacity = {};
				legend.opacity.column   = column; 
				legend.opacity.minRange = minRange;
				legend.opacity.maxRange = maxRange;


			// static polygon opacity
			} else {


				var value = polygon.opacity.staticVal ? polygon.opacity.staticVal : 1;

				// Save legend data
				legend.opacity = {};
				legend.opacity.column = false;
				legend.opacity.value  = value;

			}


			// POINT SIZE
			// POINT SIZE
			// POINT SIZE

			// polygon pointsize range
			if ( point.pointsize.column ) {

				var column   = point.pointsize.column;
				var minRange = point.pointsize.range[0];
				var maxRange = point.pointsize.range[1];

				// Save legend data
				legend.pointsize = {};
				legend.pointsize.column   = column; 
				legend.pointsize.minRange = minRange;
				legend.pointsize.maxRange = maxRange;


			// static polygon pointsize
			} else {


				var value = point.pointsize.staticVal ? point.pointsize.staticVal : 1;

				// Save legend data
				legend.pointsize = {};
				legend.pointsize.column = false;
				legend.pointsize.value  = value;

			}




			// Push legend object into array
			legendObj.point.all = legend;



			// FILTERS
			// FILTERS
			// FILTERS

			// polygon filters
			if ( point.targets.length >= 1 ) {

				point.targets.forEach(function (target, i) {
					
					var column   = target.column;
					var color    = target.color;					
					var opacity  = target.opacity;
					var value    = target.value;
					var width    = target.width;

					// Save legend data
					var legend = {
						column  : column,
						color   : color,
						opacity : opacity,
						value   : value
					}

					legendObj.point.target.push(legend);

				})	

			
			}	


		}






		// POLYGON
		// POLYGON
		// POLYGON

		// polygon enabled
		if ( polygon.enabled ) {

		
			// Create blank legend
			var legend = {};

			// COLOR
			// COLOR
			// COLOR

			// polygon color range
			if ( polygon.color.column ) {

				var column   = polygon.color.column;
				var value    = polygon.color.value; 
				var minRange = polygon.color.range[0];
				var maxRange = polygon.color.range[1];

				// Save legend data
				legend.color = {};
				legend.color.column   = column; 
				legend.color.value    = value;
				legend.color.minRange = minRange;
				legend.color.maxRange = maxRange;


			// static polygon color
			} else {

				var value = polygon.color.staticVal ? polygon.color.staticVal : 1;

				// Save legend data
				legend.color = {};
				legend.color.column = false;
				legend.color.value  = value;

			}
			

			// OPACITY
			// OPACITY
			// OPACITY

			// polygon opacity range
			if ( polygon.opacity.column ) {

				var column   = polygon.opacity.column;
				var value    = polygon.opacity.value; 
				var minRange = polygon.opacity.range[0];
				var maxRange = polygon.opacity.range[1];

				// Save legend data
				legend.opacity = {};
				legend.opacity.column   = column; 
				legend.opacity.value    = value;
				legend.opacity.minRange = minRange;
				legend.opacity.maxRange = maxRange;


			// static polygon opacity
			} else {

				var value = polygon.opacity.staticVal ? polygon.opacity.staticVal : 1;

				// Save legend data
				legend.opacity = {};
				legend.opacity.column = false;
				legend.opacity.value  = value;

			}


			// Push legend object into array
			legendObj.polygon.all = legend;



			// FILTERS	
			// FILTERS
			// FILTERS

			// polygon filters
			if ( polygon.targets.length >= 1 ) {

				polygon.targets.forEach(function (target, i) {
					
					var column   = target.column;
					var color    = target.color;					
					var opacity  = target.opacity;
					var value    = target.value;

					// Save legend data
					var legend = {
						column  : column,
						color   : color,
						opacity : opacity,
						value   : value
					}

					legendObj.polygon.target.push(legend);

				})	

			
			}			

		
		}



		// LINE
		// LINE
		// LINE

		// line enabled
		if ( line.enabled ) {
			
			// Create blank legend
			var legend = {};			

			// COLOR
			// COLOR
			// COLOR

			// line color range
			if ( line.color.column ) {

				var column 	= line.color.column;
				var value 	= line.color.value;
				var minRange	= line.color.range[0];
				var maxRange	= line.color.range[1];

				// Save legend data
				legend.color = {};
				legend.color.column   = column; 
				legend.color.value    = value;
				legend.color.minRange = minRange;
				legend.color.maxRange = maxRange;


			// static line color
			} else {

				var value = line.color.staticVal ? line.color.staticVal : 1;

				// Save legend data
				legend.color = {};
				legend.color.column = false;
				legend.color.value  = value;


			}


			// OPACITY
			// OPACITY
			// OPACITY

			// line opacity range
			if ( line.opacity.column ) {

				var column = line.opacity.column;
				var minRange = line.opacity.range[0];
				var maxRange = line.opacity.range[1];

				// Save legend data
				legend.opacity = {};
				legend.opacity.column   = column; 
				legend.opacity.minRange = minRange;
				legend.opacity.maxRange = maxRange;

			// line static opacity
			} else {

				var value = line.opacity.staticVal ? line.opacity.staticVal : 1;

				// Save legend data
				legend.opacity = {};
				legend.opacity.column   = false;
				legend.opacity.value    = value;
			
			}


			// WIDTH
			// WIDTH
			// WIDTH

			// line width range
			if ( line.width.column ) {

				var column = line.width.column;
				var minRange = line.width.range[0];
				var maxRange = line.width.range[1];

				// Save legend data
				legend.width = {};
				legend.width.column   = column;
				legend.width.minRange = minRange;
				legend.width.maxRange = maxRange;

			// static line width
			} else {

				var value = line.width.staticVal ? line.width.staticVal : 1;

				// Save legend data
				legend.width = {};
				legend.width.column   = false;
				legend.width.value    = value;

			}


			legendObj.line.all = legend;


					

			// FILTERS
			// FILTERS
			// FILTERS

			// line filters
			if ( line.targets.length >= 1 ) {

				line.targets.forEach(function (target, i) {

					var column  = target.column;
					var color   = target.color;					
					var opacity = target.opacity;
					var value   = target.value;
					var width   = target.width;

					// Save legend data
					var legend = {
						column  : column,
						color   : color,
						opacity : opacity,
						value   : value,
						width   : width
					}

					legendObj.line.target.push(legend);
										

				})

			} 

		}





		
	},

	createLegend : function () {

		// console.log('%c************************************', 'background: blue; color: white;');
		// console.log('legendObj', this.legendObj);
		// console.log('%c************************************', 'background: blue; color: white;');

		var str = '';

		var layerName = this.legendObj.layerName;

		var polygons = this.legendObj.polygon;
		var lines    = this.legendObj.line;
		var points   = this.legendObj.point;


		// LINES LINES LINES LINES LINES LINES LINES 
		// LINES LINES LINES LINES LINES LINES LINES 
		// LINES LINES LINES LINES LINES LINES LINES 

		// TARGETED LINES
		// TARGETED LINES
		// TARGETED LINES

		lines.target.forEach(function (line) {
			
			var name    = line.value;
			var color   = line.color;
			var opacity = line.opacity;
			var width   = line.width;

			// Convert color to RGB
			var RGB = this.color2RGB(color);
			var rgba = 'rgba(' + RGB.r + ',' + RGB.g + ',' + RGB.b + ',' + opacity + ');';			

			var style = 'border: ' + width + 'px solid ' + rgba;

			str += '<div class="legend-each-container">';
			str += '<div class="legend-each-name">' + name + '</div>';
			str += '<div class="legend-each-color" style="' + style + '"></div>';
			str += '</div>';

		}.bind(this));


		// ALL LINES
		// ALL LINES
		// ALL LINES





		// POLYGONS POLYGONS POLYGONS POLYGONS POLYGONS 
		// POLYGONS POLYGONS POLYGONS POLYGONS POLYGONS 
		// POLYGONS POLYGONS POLYGONS POLYGONS POLYGONS 

		// TARGETED POLYGONS
		// TARGETED POLYGONS
		// TARGETED POLYGONS

		polygons.target.forEach(function (polygon) {
			
			var name    = polygon.value;
			var color   = polygon.color;
			var opacity = polygon.opacity;

			// Convert color to RGB
			var RGB = this.color2RGB(color);
			var rgba = 'rgba(' + RGB.r + ',' + RGB.g + ',' + RGB.b + ',' + opacity + ');';

			var style = 'background:' + rgba;

			str += '<div class="legend-each-container">';
			str += '<div class="legend-each-name">' + name + '</div>';
			str += '<div class="legend-each-color" style="' + style + '"></div>';
			str += '</div>';

		}.bind(this));




		// ALL POLYGONS & LINES
		// ALL POLYGONS & LINES
		// ALL POLYGONS & LINES

		if ( polygons.all.color && !polygons.all.color.column ) {

			var name = 'All ' + layerName;
			var color   = polygons.all.color.value;
			var opacity = polygons.all.opacity.value;
				
			var RGB = this.color2RGB(color);
			var rgba = 'rgba(' + RGB.r + ',' + RGB.g + ',' + RGB.b + ',' + opacity + ');';

			var style = 'background:' + rgba;


			if ( lines.all.color && !lines.all.color.column ) {
				
				var color   = lines.all.color.value;
				var opacity = lines.all.opacity.value;
				var width   = lines.all.width.value;

				var RGB = this.color2RGB(color);
				var rgba = 'rgba(' + RGB.r + ',' + RGB.g + ',' + RGB.b + ',' + opacity + ');';

				style += 'border: ' + width + 'px solid ' + rgba;
			}

			str += '<div class="legend-each-container">';
			str += '<div class="legend-each-name">' + name + '</div>';
			str += '<div class="legend-each-color" style="' + style + '"></div>';
			str += '</div>';


		}



		return str;
	},



	// color tools
	// color tools
	// color tools
	// color tools
	// color tools
	// color tools

	color2RGB : function (color) {
		
		// The color is a hex decimal
		if ( color[0] == '#' ) return this.checkHex(color);

		// The color is RGB
		if ( color.substring(0,2) == 'rgb' ) {
			return '#000000';
		}

		var convertedColor = this.colorNameToHex(color);
		return this.hex2RGB(convertedColor);


	},

	checkHex : function (hex) {
		
		// If it's a 6 digit hex (plus #), run it.
		if ( hex.length == 7 ) {
			return this.hex2RGB(hex);
		}

		// If it's a 3 digit hex, convert
		if ( hex.length == 4 ) {
			var paddedHex = this.padHex(hex);
			return this.hex2RGB(paddedHex);			
		}

	},

	padHex : function (hex) {
		var r = parseInt(hex.substring(1,3), 16);
		var g = parseInt(hex.substring(3,5), 16);
		var b = parseInt(hex.substring(5,7), 16);

		return '#' + r + r + g + g + b + b;

	},

	hex2RGB : function (hex) {


		var r = parseInt(hex.substring(1,3), 16);
		var g = parseInt(hex.substring(3,5), 16);
		var b = parseInt(hex.substring(5,7), 16);

		var rgb = {
			r : r,
			g : g,
			b : b
		}

		return rgb;

	},


	colorNameToHex : function (color) {

    		var colors = {	"aliceblue" : "#f0f8ff",
    				"antiquewhite":"#faebd7",
    				"aqua":"#00ffff",
    				"aquamarine":"#7fffd4",
    				"azure":"#f0ffff",
    				"beige":"#f5f5dc",
    				"bisque":"#ffe4c4",
    				"black":"#000000",
    				"blanchedalmond":"#ffebcd",
    				"blue":"#0000ff",
    				"blueviolet":"#8a2be2",
    				"brown":"#a52a2a",
    				"burlywood":"#deb887",
    				"cadetblue":"#5f9ea0",
    				"chartreuse":"#7fff00",
    				"chocolate":"#d2691e",
    				"coral":"#ff7f50",
    				"cornflowerblue":"#6495ed",
    				"cornsilk":"#fff8dc",
    				"crimson":"#dc143c",
    				"cyan":"#00ffff",
				"darkblue":"#00008b",
				"darkcyan":"#008b8b",
				"darkgoldenrod":"#b8860b",
				"darkgray":"#a9a9a9",
				"darkgreen":"#006400",
				"darkkhaki":"#bdb76b",
				"darkmagenta":"#8b008b",
				"darkolivegreen":"#556b2f",
				"darkorange":"#ff8c00",
				"darkorchid":"#9932cc",
				"darkred":"#8b0000",
				"darksalmon":"#e9967a",
				"darkseagreen":"#8fbc8f",
				"darkslateblue":"#483d8b",
				"darkslategray":"#2f4f4f",
				"darkturquoise":"#00ced1",
				"darkviolet":"#9400d3",
				"deeppink":"#ff1493",
				"deepskyblue":"#00bfff",
				"dimgray":"#696969",
				"dodgerblue":"#1e90ff",
			    	"firebrick":"#b22222",
			    	"floralwhite":"#fffaf0",
			    	"forestgreen":"#228b22",
			    	"fuchsia":"#ff00ff",
    				"gainsboro":"#dcdcdc",
    				"ghostwhite":"#f8f8ff",
    				"gold":"#ffd700",
    				"goldenrod":"#daa520",
    				"gray":"#808080",
    				"green":"#008000",
    				"greenyellow":"#adff2f",
    				"honeydew":"#f0fff0",
    				"hotpink":"#ff69b4",
				"indianred ":"#cd5c5c",
				"indigo":"#4b0082",
				"ivory":"#fffff0",
				"khaki":"#f0e68c",
				"lavender":"#e6e6fa",
				"lavenderblush":"#fff0f5",
				"lawngreen":"#7cfc00",
				"lemonchiffon":"#fffacd",
				"lightblue":"#add8e6",
				"lightcoral":"#f08080",
				"lightcyan":"#e0ffff",
				"lightgoldenrodyellow":"#fafad2",
				"lightgrey":"#d3d3d3",
				"lightgreen":"#90ee90",
				"lightpink":"#ffb6c1",
				"lightsalmon":"#ffa07a",
				"lightseagreen":"#20b2aa",
				"lightskyblue":"#87cefa",
				"lightslategray":"#778899",
				"lightsteelblue":"#b0c4de",
				"lightyellow":"#ffffe0",
				"lime":"#00ff00",
				"limegreen":"#32cd32",
				"linen":"#faf0e6",
				"magenta":"#ff00ff",
				"maroon":"#800000",
				"mediumaquamarine":"#66cdaa",
				"mediumblue":"#0000cd",
				"mediumorchid":"#ba55d3",
				"mediumpurple":"#9370d8",
				"mediumseagreen":"#3cb371",
				"mediumslateblue":"#7b68ee",
				"mediumspringgreen":"#00fa9a",
				"mediumturquoise":"#48d1cc",
				"mediumvioletred":"#c71585",
				"midnightblue":"#191970",
				"mintcream":"#f5fffa",
				"mistyrose":"#ffe4e1",
				"moccasin":"#ffe4b5",
				"navajowhite":"#ffdead",
				"navy":"#000080",
				"oldlace":"#fdf5e6",
				"olive":"#808000",
				"olivedrab":"#6b8e23",
				"orange":"#ffa500",
				"orangered":"#ff4500",
				"orchid":"#da70d6",
				"palegoldenrod":"#eee8aa",
				"palegreen":"#98fb98",
				"paleturquoise":"#afeeee",
				"palevioletred":"#d87093",
				"papayawhip":"#ffefd5",
				"peachpuff":"#ffdab9",
				"peru":"#cd853f",
				"pink":"#ffc0cb",
				"plum":"#dda0dd",
				"powderblue":"#b0e0e6",
				"purple":"#800080",
				"red":"#ff0000",
				"rosybrown":"#bc8f8f",
				"royalblue":"#4169e1",
				"saddlebrown":"#8b4513",
				"salmon":"#fa8072",
				"sandybrown":"#f4a460",
				"seagreen":"#2e8b57",
				"seashell":"#fff5ee",
				"sienna":"#a0522d",
				"silver":"#c0c0c0",
				"skyblue":"#87ceeb",
				"slateblue":"#6a5acd",
				"slategray":"#708090",
				"snow":"#fffafa",
				"springgreen":"#00ff7f",
				"steelblue":"#4682b4",
				"tan":"#d2b48c",
				"teal":"#008080",
				"thistle":"#d8bfd8",
				"tomato":"#ff6347",
				"turquoise":"#40e0d0",
				"violet":"#ee82ee",
				"wheat":"#f5deb3",
				"white":"#ffffff",
				"whitesmoke":"#f5f5f5",
				"yellow":"#ffff00",
				"yellowgreen":"#9acd32"
				};

		var c = color.toLowerCase();

		// Return hex color
		if ( colors[c] ) return colors[c];
		
		// Return black if there are no matches
		return '#000000';				
	},	






	
});

L.control.description = function (options) {
	return new L.Control.Description(options);
};