L.Control.Cartocss = Wu.Control.extend({
	
	type : 'cartocss',

	options: {
		position : 'topleft' 
	},

	// _laidout : false,

	onAdd : function () {

		// create toolbar container
		var container = Wu.DomUtil.create('div', 'leaflet-control-cartocss leaflet-control');
		Wu.DomEvent.on(container, 'click mousedown ', Wu.DomEvent.stopPropagation, this);

		// create toolbar button
		this._toolbarButton = Wu.DomUtil.create('div', 'cartocss-toolbar-button', container);

		// add tooltip
		app.Tooltip.add(this._toolbarButton, 'CartoCSS editor, tooltip controller, and legends builder');

		// init rest of layout
		this.initLayout();

		// init code mirror
		this.initCodeMirror();

		// automatically becomes this._container;
		return container;	

	},

	onRemove : function () {

		// remove hooks
		this._removeHooks();

		// remove from DOM
		Wu.DomUtil.remove(this._codeMirror.getWrapperElement());

		// remove from leaflet-control-container
		Wu.DomUtil.remove(this._editorContainer);
	},

	_addTo : function () {
		this.addTo(app._map);
		this._addHooks();
		this._added = true;
	},


	_flush : function () {
		this.layers = {};
		this._layers = [];
		this.clearCodeMirror();
		this._styleHeaderLayerName.innerHTML = '';
		console.error();
	},

	_refresh : function () {

		// should be active
		if (!this._added) this._addTo();

		// if not active in project, hide
		if (!this._isActive()) return this._hide();

		// remove old content
		this._flush();
		this._initEmpty();

		// show
		this._show();

		if(this._open) this.open();

		// mark content not loaded
		this._initedContent = false;
	},

	_initContent : function () {
		if (this._initedContent) return;

		// get all active, geojson layers
		this._layers = this._project.getStylableLayers();

		// fill active layers box
		this._fillLayers();

		// select a layer
		this.setLastUpdatedLayer();

		// refresh codemirror
		this._codeMirror.refresh();
		this._initEmpty();

		// mark content loaded
		this._initedContent = true;

	},

	_initEmpty : function (){
		//if there are no active layers
		if(!this._layers|| !this._layers.length ){

			this._styleHeaderLayerName.innerHTML = 'No available layers';
			//explanatory text on cartocss editor
			this._codeMirror.setValue('There are no layers to be edited. Upload or activate some before editing.');
		}
			
		return;
	},

	_isActive : function () {
		if (!this._project) return false;

		// check edit access
		if (!app.access.to.edit_project(this._project)) return false;

		// return if active
		return this._project.getControls()[this.type];
	},

	_on : function () {
		this._refresh();
		this._initEmpty();
	},

	_off : function () {
		this._hide();
	},

	_show : function () {
		this._container.style.display = 'block';
	},
	_hide : function () {
		this._container.style.display = 'none';
		this.close();
	},

	initLayout : function () {

		// create divs
		this._editorContainer 		= Wu.DomUtil.create('div', 'cartocss-control-container'); // editor container
		this._resizeHandle 		= Wu.DomUtil.create('div', 'cartocss-control-resizer', this._editorContainer); // editor container
		this._wrapper 			= Wu.DomUtil.create('div', 'cartocss-control-wrapper', this._editorContainer); // the obligatory wrapper
		this._xButton 			= Wu.DomUtil.create('div', 'close-cartocss-editor-x', this._wrapper); // close button
		this._zoomVal 			= Wu.DomUtil.create('div', 'cartocss-zoomval', this._wrapper, app._map.getZoom()); // Show zoom value
		this._styleHeaderWrapper 	= Wu.DomUtil.create('div', 'cartocss-style-header-wrapper', this._wrapper); // create form wrapper
		this._styleHeaderLayerName 	= Wu.DomUtil.create('div', 'cartocss-style-header-layer', this._styleHeaderWrapper, 'Select layer');
		this._styleHeaderDropDownButton = Wu.DomUtil.create('div', 'cartocss-style-dropdown-arrow', this._styleHeaderWrapper);
		this._layerSelectorOuter 	= Wu.DomUtil.create('div', 'cartocss-layerselector-outer', this._wrapper); // create layer selector
		this._layerSelector 		= Wu.DomUtil.create('div', 'cartocss-layerselector', this._layerSelectorOuter);
		
		// tabs
		this._tabsWrapper 		= Wu.DomUtil.create('div', 'cartocss-tab-wrapper', this._wrapper); // Wrapper for tabs
		this._tabStyling 		= Wu.DomUtil.create('div', 'cartocss-tab cartocss-tab-styling cartocss-active-tab', this._tabsWrapper, 'Styling'); // Styling tab
		this._tabTooltip 		= Wu.DomUtil.create('div', 'cartocss-tab cartocss-tab-tooltip', this._tabsWrapper, 'Tooltip'); // Styling tab		
		this._tabLegends 		= Wu.DomUtil.create('div', 'cartocss-tab cartocss-tab-legends', this._tabsWrapper, 'Legend'); // Styling tab				
		this._legendsWrapper		= Wu.DomUtil.create('div', 'cartocss-legends-wrapper displayNone', this._wrapper);
		this._tooltipOuterWrapper	= Wu.DomUtil.create('div', 'cartocss-tooltip-outer-wrapper displayNone', this._wrapper);
		this._tooltipWrapper		= Wu.DomUtil.create('div', 'cartocss-tooltip-wrapper', this._tooltipOuterWrapper);
		this._formWrapper 		= Wu.DomUtil.create('form', 'cartocss-form-wrapper', this._wrapper); // For CodeMirror: create form wrapper
		this._inputArea 		= Wu.DomUtil.create('textarea', 'cartocss-input', this._formWrapper); // For CodeMirror: create text area
		this._sqlPane 			= Wu.DomUtil.create('textarea', 'cartocss-sql', this._wrapper);
		this._sqlPane.setAttribute('placeholder', 'Insert SQL statement.');
		this._errorPane 		= Wu.DomUtil.create('div', 'cartocss-error-pane', this._wrapper); // error feedback pane
		this._updateButton 		= Wu.DomUtil.create('div', 'cartocss-update-button', this._wrapper, 'Update'); // create update button
		this._refreshButton 		= Wu.DomUtil.create('div', 'cartocss-refresh-button', this._wrapper); // create update button

		// append to leaflet-control-container
		app._map.getContainer().appendChild(this._editorContainer);

		// add tooltips
		this._addTooltips();
		
	},

	_addTooltips : function () {
		// add tooltip
		app.Tooltip.add(this._styleHeaderWrapper, 'Shows a list of active layers for this project.', { extends : 'systyle', tipJoint : 'top left'});
		app.Tooltip.add(this._zoomVal, 'Shows current zoom level.', { extends : 'systyle', tipJoint : 'top left'});
		app.Tooltip.add(this._tabStyling, 'Style selected layer. Takes CartoCSS code.', { extends : 'systyle', tipJoint : 'top left'});
		app.Tooltip.add(this._tabTooltip, 'Customize tooltip to appear when clicking on different shapes in layer.', { extends : 'systyle', tipJoint : 'top left'});
		app.Tooltip.add(this._tabLegends, 'Decide which legends you want to show for selected layer.', { extends : 'systyle', tipJoint : 'top left'});
	},

	_setHooks : function (onoff) {

		// update button click
		Wu.DomEvent[onoff](this._updateButton, 'click', this.renderStyling, this);

		// toolbar button click
		Wu.DomEvent[onoff](this._toolbarButton, 'click', this._GAtoggle, this);

		// remove control
		Wu.DomEvent[onoff](this._xButton, 'click', this._GAtoggle, this);

		// Layer drop down
		Wu.DomEvent[onoff](this._styleHeaderLayerName, 'click', this.toggleLayerDropDown, this);

		// Toggle legends tab
		Wu.DomEvent[onoff](this._tabLegends, 'mousedown', this.toggleLegends, this);

		// Toggle styles tab
		Wu.DomEvent[onoff](this._tabStyling, 'mousedown', this.toggleStyles, this);

		// Toggle tooltip tab
		Wu.DomEvent[onoff](this._tabTooltip, 'mousedown', this.toggleTooltip, this);

		// Resize container
		Wu.DomEvent[onoff](this._resizeHandle, 'mousedown', this.resize, this);

		// refresh button
		Wu.DomEvent[onoff](this._refreshButton, 'mousedown', this._refreshLayer, this);

		// stops
		Wu.DomEvent[onoff](this._editorContainer, 	'mousewheel mousedown dblclick click', 		Wu.DomEvent.stopPropagation, this);
		Wu.DomEvent[onoff](this._toolbarButton, 	'dblclick', 					Wu.DomEvent.stopPropagation, this);
		Wu.DomEvent[onoff](this._styleHeaderLayerName, 	'click mousedown', 				Wu.DomEvent.stopPropagation, this);
		Wu.DomEvent[onoff](this._formWrapper, 		'click mousedown', 				Wu.DomEvent.stopPropagation, this);

		// Update Zoom
		app._map[onoff]('zoomend', function() {
			this._zoomVal.innerHTML = app._map.getZoom();
		}, this)
		
	},
	_addHooks : function () {
		this._setHooks('on');
	},
	_removeHooks : function () {
		this._setHooks('off');
	},

	_refreshLayer : function () {
		console.log('redraw', this);
		this._layer.layer.redraw();
		this._layer.gridLayer.redraw();
	},

	resize : function () {

		// Get position of frame that is going to be scaled
		this.__cartoContainer_offsetLeft = this._editorContainer.offsetLeft;
		this.__cartoContainer_width = this._editorContainer.offsetWidth;

		// create ghost div
		this._ghost = Wu.DomUtil.create('div', 'resize-ghost', app._appPane);

		// add release hook
		Wu.DomEvent.on(this._ghost, 'mouseup', this.removeResizeHooks, this);

		// track mouse position
		Wu.DomEvent.on(this._ghost, 'mousemove', this.resizeEditor, this);
	},

	removeResizeHooks : function () {

		// remove events
		Wu.DomEvent.off(this._ghost, 'mousemove', this.resizeEditor, this);
		Wu.DomEvent.off(this._ghost, 'mouseup', this.removeResizeHooks, this);

		// remove ghost div
		Wu.DomUtil.remove(this._ghost);
	},

	resizeEditor : function (e) {
		// set new width
		var mousex = e.clientX || e.pageX || 0,
		    offleft = this._editorContainer.offsetLeft,
		    offwidth =  this._editorContainer.offsetWidth,
		    w = offwidth + (offleft - mousex);

		if ( w >= 300 ) this._editorContainer.style.width = w + 'px';
	},

	initCodeMirror : function () {
		
		this._codeMirror = CodeMirror.fromTextArea(this._inputArea, {
    			lineNumbers: true,    			
    			mode: {
    				name : 'carto',
    				reference : window.cartoRef
    			},
    			matchBrackets: true,
    			lineWrapping: true,
    			paletteHints : true,
    			gutters: ['CodeMirror-linenumbers', 'errors']
  		});
	},

	_initStylingDefault : function () {

		// get meta fields
		var fields = this._layer.getMetaFields(); // return false if no fields found
		
		// create string
		var string =	'// CartoCSS reference guide:\n// https://bit.ly/1z5OvXT\n\n';
		string += 	'// Cheat Sheet:\n';
		string += 	'// ------------\n';
		string += 	'//  Polygons:\n';
		string += 	'//    polygon-fill: red;\n';
		string += 	'//    polygon-opacity: 0.5;\n';
		string += 	'// \n';
		string += 	'//  Lines:\n';
		string += 	'//    line-color: blue;\n';
		string += 	'//    line-width: 2;\n';
		string += 	'//    line-opacity: 0.9;\n';
		string += 	'// \n';
		string += 	'//  Text:\n';
		string += 	'//    text-name: [field_name];\n';
		string += 	'//    text-size: 12;\n';
		string += 	'// \n';
		string += 	'//  Filters:\n';
		string += 	'//    [zoom>=12] {\n';
		string += 	'//        // CSS for zoom 12 and higher\n';
		string += 	'//    }\n';
		string += 	'//    [field_name=Field Name] {\n';
		string += 	'//        // CSS for this field only\n';
		string += 	'//    }\n';

		string += 	'\n\n// #layer is always the layer identifier \n';
		string += 	'#layer {\n\n';
		string += 	'    // Available fields in layer:\n';
		string += 	'	// --------------------------\n'

		// add each field to string
		for (var key in fields) {
			var type = fields[key];
			string += '    // [' + key + '=' + type + '] {}\n';
		}
		
		string += '\n\n}';

		// update text
		this.updateCodeMirror(string);

	},

	// select last update layer (on update)
	setLastUpdatedLayer : function () {

		// sort by lastUpdated
		var layers = this._layers;
		var sorted = _.sortBy(this._layers, function (l) {
			return l.store.lastUpdated;
		});

		// get top hit
		var last = _.last(sorted);

		// select lastUpdated layer
		this._selectLayer(last);

	},

	updateCodeMirror : function (css) {
		this._codeMirror.setValue(css);
	},

	clearCodeMirror : function () {
		this._codeMirror.setValue('');
	},

	_fillLayers : function () {
		
		// clear
		this._layerSelector.innerHTML = '';

		// store wrappers
		this._layerWrapperList = {};

		// add
		this._layers.forEach(function (layer) {

			// append
			var wrapper = Wu.DomUtil.create('div', 'layer-selector-item-wrap');
			var div = Wu.DomUtil.create('div', 'layer-selector-item', wrapper, layer.getTitle());
			this._layerSelector.appendChild(wrapper);

			// store wrapper by layer uuid
			this._layerWrapperList[layer.getUuid()] = wrapper;

			// hook
			Wu.DomEvent.on(wrapper, 'mousedown', function () {
				this._selectLayer(layer)
			}, this);

			// add stops
			Wu.DomEvent.on(wrapper, 'click mousedown', Wu.DomEvent.stopPropagation, this);


		}, this);

	},

	setSelected : function (layer) {
		if (!layer) return;

		// get wrapper
		var wrapper = this._layerWrapperList[layer.getUuid()];

		// clear selected
		this._clearSelected(wrapper);

		// mark selected
		Wu.DomUtil.addClass(wrapper, 'vt-selected', this);
	},

	_clearSelected : function (wrapper) {
		// Set class to show which layer is selected
		for ( var i = 0; i < wrapper.parentNode.children.length; i++ ) {
			var child = wrapper.parentNode.children[i];
			Wu.DomUtil.removeClass(child, 'vt-selected', this);
		}
	},

	_selectLayer : function (layer) {
		if (!layer) return;

		// Google Analytics event tracking
		if (layer) app.Analytics.setGaEvent(['Controls', 'CartoCSS select layer: ' + layer.getTitle()]);

		// close dropdown
		this.closeLayerDropDown();
		
		// init tabs
		this.initStyling(layer);	
		this.initTooltip(layer);
		this.initLegends(layer);

		// select in list
		this.setSelected(layer);
		
		// Google Analytics event tracking
		if (layer) app.Analytics.setGaEvent(['Controls', 'CartoCSS select layer: ' + layer.getTitle()]);
	},

	
	toggleLegends : function () {

		// Hide Styler
		Wu.DomUtil.addClass(this._formWrapper, 'displayNone');

		// Hide Tooltip
		Wu.DomUtil.addClass(this._tooltipOuterWrapper, 'displayNone');

		// Show Legends Wrapper
		Wu.DomUtil.removeClass(this._legendsWrapper, 'displayNone');

		// Set tab to active
		Wu.DomUtil.removeClass(this._tabTooltip, 'cartocss-active-tab');
		Wu.DomUtil.removeClass(this._tabStyling, 'cartocss-active-tab');
		Wu.DomUtil.addClass(this._tabLegends, 'cartocss-active-tab');

		// Google Analytics event tracking
		app.Analytics.setGaEvent(['Controls', 'CartoCSS toggle legends']);

		this.initLegends();
	},
	

	toggleStyles : function () {

		// Show Styler
		Wu.DomUtil.removeClass(this._formWrapper, 'displayNone');

		// Hide Tooltip
		Wu.DomUtil.addClass(this._tooltipOuterWrapper, 'displayNone');

		// Hide Legends Wrapper
		Wu.DomUtil.addClass(this._legendsWrapper, 'displayNone');

		// Set tab to active
		Wu.DomUtil.removeClass(this._tabTooltip, 'cartocss-active-tab');
		Wu.DomUtil.addClass(this._tabStyling, 'cartocss-active-tab');
		Wu.DomUtil.removeClass(this._tabLegends, 'cartocss-active-tab');

		// Google Analytics event tracking
		app.Analytics.setGaEvent(['Controls', 'CartoCSS toggle styles']);

		this.initStyling(this._layer);

	},

	toggleTooltip : function () {

		// Show Tooltip
		Wu.DomUtil.removeClass(this._tooltipOuterWrapper, 'displayNone');

		// Hide Styler
		Wu.DomUtil.addClass(this._formWrapper, 'displayNone');

		// Hide Legends Wrapper
		Wu.DomUtil.addClass(this._legendsWrapper, 'displayNone');

		// Set tab to active
		Wu.DomUtil.addClass(this._tabTooltip, 'cartocss-active-tab');
		Wu.DomUtil.removeClass(this._tabStyling, 'cartocss-active-tab');
		Wu.DomUtil.removeClass(this._tabLegends, 'cartocss-active-tab');

		// Google Analytics event tracking
		app.Analytics.setGaEvent(['Controls', 'CartoCSS toggle tooltip']);	

		this.initTooltip();	
	},

	initStyling : function (layer) {
		if (!layer) return;

		// new layer is active
		this._layer = layer;
		this._cartoid = false;

		// insert title in dropdown
		this._styleHeaderLayerName.innerHTML = layer.store.title.camelize();

		// check for existing css
		// this._cartoid = this._layer.getCartoid();

		// if no style stored on layer yet, set default message	
		// if (!this._cartoid) return this._initStylingDefault();	

		this.clearCodeMirror();			

		// else get css from server
		var css = this._layer.getCartoCSS();
		
		this.updateCodeMirror(css);
		// this._layer.getCartoCSS(this._cartoid, function (ctx, css) {
			// set css
			// this.updateCodeMirror(css);

		// }.bind(this));
	},
	
	initLegends : function () {
		
		// clear 
		this._legendsWrapper.innerHTML = '';

		// return if no layer selected
		if (!this._layer) return;

		// fill with legends from layer
		this._legends = this._layer.getLegends();
		
		if (this._legends) {
			// fill legends
			return this.fillLegends(this._legends);
		} else {
			// fill with default
			return this._initLegendsDefaultMeta();	
		}
	},

	initTooltip : function () {

		// clear
		this._tooltipWrapper.innerHTML = '';

		// return if no layer selected
		if (!this._layer) return;

		// fill with store tooltip meta
		var tooltipMeta = this._layer.getTooltip();
		if (tooltipMeta) return this._initTooltipStoredMeta(tooltipMeta);

		// fill with default meta
		return this._initTooltipDefaultMeta();
	},

	// fill legends tab with legends
	fillLegends : function (legends) {

		// Get title from tooltip
		var tooltipMeta = this._layer.getTooltip();
		
		// Clear old
		this._legendsWrapper.innerHTML = '';

		// Inner wrapper
		this._legendsWrapperInner = Wu.DomUtil.create('div', 'legends-inner-scroller', this._legendsWrapper);

		// Title wrapper
		this._legentTitleWrapper = Wu.DomUtil.create('div', 'legend-title-wrapper', this._legendsWrapperInner)

		// Title
		this._legendsTitle = Wu.DomUtil.create('input', 'legends-title', this._legentTitleWrapper);
		this._legendsTitle.setAttribute('placeholder', 'Legend title');
		this._legendsTitle.setAttribute('disabled', 'disabled');
		this._legendsTitle.value = tooltipMeta.title || '';

		// Select all switch
		var switchWrapper 	= Wu.DomUtil.create('div', 'cartoCSS-tooltip-switch-all-wrapper', this._legentTitleWrapper)
		var switchTitle 	= Wu.DomUtil.create('div', 'cartoCSS-tooltip-switch-all-title', switchWrapper, 'All')
		var fieldSwitch 	= Wu.DomUtil.create('div', 'switch carto-switch-tooltip', switchWrapper); //  controls-switch
		var switchId 		= 'switch-legends-all';
		
		var fieldSwitchInput 	= Wu.DomUtil.createId('input', switchId, fieldSwitch);
		fieldSwitchInput.setAttribute('type', 'checkbox');				
		Wu.DomUtil.addClass(fieldSwitchInput, 'cmn-toggle cmn-toggle-round-flat');

		var fieldSwitchLabel = Wu.DomUtil.create('label', '', fieldSwitch);
		fieldSwitchLabel.setAttribute('for', switchId);

		// Legends list
		this._legendsListWrapper = Wu.DomUtil.create('div', 'legends-list-wrapper', this._legendsWrapperInner);

		// Set blank array of tooltip switches
		this._legendsSwitches = [];
		var onCounter = 0;

		// Each legend
		legends.forEach(function (legend) {

			// Append legend entry to wrapper
			var legdiv = this._legendEntry(legend);
			this._legendsListWrapper.appendChild(legdiv);

			if ( legend.on ) onCounter++;

		}, this);

		// Set switch to active if more than 50% of the switches are active
		if ( onCounter >= legends.length/2 ) {
			fieldSwitchInput.checked = true;
			fieldSwitchInput.setAttribute('checked', 'checked');
		}

		// Save toggle all tooltip switch 
		this._legendSelectAllSwitch = fieldSwitchInput;

		Wu.DomEvent.on(fieldSwitchInput, 'change', this._toggleAllLegend, this);		
	},

	_toggleAllLegend : function () {

		// Get checked state from the select all switch
		var isChecked = this._legendSelectAllSwitch.getAttribute('checked');
		
		// Set checked state to the select all switch
		isChecked ? this._legendSelectAllSwitch.removeAttribute('checked') : this._legendSelectAllSwitch.setAttribute('checked', 'checked');
		
		// Update all the switches
		this._legendsSwitches.forEach(function(_switch) {

			var on = _switch.checked;
			isChecked ? _switch.checked = false : _switch.checked = true;

			// Save legends
			this._saveLegends();
			
		}, this);		
		
	},

	_legendEntry : function (legend) {

		// create divs
		var wrap 	= Wu.DomUtil.create('div', 'legend-entry-wrap');
		var imgwrap 	= Wu.DomUtil.create('div', 'legend-entry-image', wrap);
		var image1	= Wu.DomUtil.create('img', 'legend-image1', imgwrap);
		var image2	= Wu.DomUtil.create('img', 'legend-image2', imgwrap);
		var keydiv	= Wu.DomUtil.create('div', 'legend-entry-key', wrap);
		var valuediv  	= Wu.DomUtil.create('div', 'legend-entry-value', wrap); 
		var checkbox 	= this._createCheckbox(legend.id);
		wrap.appendChild(checkbox);

		// set values	
		image1.src 	   = legend.base64;
		image2.src 	   = legend.base64;
		keydiv.innerHTML   = this._normalizeKey(legend.key);
		valuediv.innerHTML = legend.value;
		wrap.setAttribute('legendid', legend.id);
		if (legend.on) checkbox.firstChild.setAttribute('checked', 'checked');
		
		// Put legends checkboxes in array
		this._legendsSwitches.push(checkbox.firstChild);

		// add toogle hook
		Wu.DomEvent.on(checkbox, 'change', this._saveLegends, this);

		// return div
		return wrap;
	},

	_saveLegends : function () {

		app.setSaveStatus(1000);

		// get legends array
		var legends = this._layer.getLegends();

		// iterate
		var childs = this._legendsListWrapper.childNodes;

		// var child = childs[1];
		for (var i = 0; i < childs.length; i++) {
			var child = childs[i];

			// get checked value
			var checked = child.childNodes[3].querySelector('input:checked');
			var on = (!checked) ? false : true;
			var id = child.getAttribute('legendid');

			// find legend to update
			var legend = _.find(legends, function (l) {
				return l.id == id;
			});

			// update toggle
			legends[i].on = on;
			
		}

		// save to layer
		this._layer.setLegends(legends);

		// refresh legends
		var legendsControl = app.MapPane.getControls().legends;
		if (legendsControl) legendsControl.refreshLegends();

	},

	// get custom keyname if created (in tooltips)
	_normalizeKey : function (key) {
		var tooltips = this._layer.getTooltip();
		var customKey = _.find(tooltips.fields, function (f) {
			return key == f.key;
		});
		if (customKey && customKey.title) return customKey.title;
		return key;
	},

	_createCheckbox : function (id) {
		// create switch
		var switchId = 'switch-' + id;
		var fieldSwitch = Wu.DomUtil.create('div', 'switch carto-switch-legend'); // controls-switch
		var fieldSwitchInput = Wu.DomUtil.createId('input', switchId, fieldSwitch);
		var fieldSwitchLabel = Wu.DomUtil.create('label', '', fieldSwitch);
		Wu.DomUtil.addClass(fieldSwitchInput, 'cmn-toggle cmn-toggle-round-flat');
		fieldSwitchInput.setAttribute('type', 'checkbox');
		fieldSwitchLabel.setAttribute('for', switchId);
		return fieldSwitch;
	},

	_initLegendsDefaultMeta : function () {

		// clear
		this._legendsWrapper.innerHTML = '';

		// add help text
		Wu.DomUtil.create('div', 'legends-default-box', this._legendsWrapper, 'No legends yet. Style the geo and magic will happen!');
	},

	_updateLegends : function (cartoid) { // refactor: move to layers.js

		var meta = this._layer.getMeta();
		var metaFields = this._layer.getMetaFields();
		
		// generate legends on server from active fields
		this._layer.createLegends(function (ctx, json) {	// callback
			var legends = Wu.parse(json);

			console.log('_updateLegends legend:', legends);

			if (legends && legends.err) {
				return this.handleError(legends.err);
			}

			if (!legends) {
				return this.handleError(legends);
			} 

			// sort some things: #layer on top
			var layer = _.remove(legends, function (l) {
				return l.key == 'layer';
			});
			
			legends.unshift && legends.unshift(layer[0]);

			// include old legends settings
			legends = this._mergePreviousLegendsSettings(legends, this._layer.getLegends());

			// fill legends tab in editor
			this.fillLegends(legends);

			// save to layer
			this._layer.setLegends(legends);

			// save local
			this._legends = legends;

			// refresh legends
			app.MapPane.getControls().legends.refreshLegends()


		}.bind(this));

	},


	_mergePreviousLegendsSettings : function (newLegends, oldLegends) {
		if (!newLegends) return;
		
		// keep .on setting
		newLegends.forEach(function (newlegend, i){
			var oldlegend = _.find(oldLegends, function (o) {
				return o.value == newlegend.value;
			});

			if (!oldlegend) return;
			newLegends[i].on = oldlegend.on;
		});

		return newLegends;
	},


	_initTooltipStoredMeta : function (meta) {

		// create header
		var tooltipHeaderContainer = Wu.DomUtil.create('div', 'cartocss-tooltip-header-container', this._tooltipWrapper);
		var tooltipCustomHeader	= Wu.DomUtil.createId('input', 'cartocss-tooltip-custom-header', tooltipHeaderContainer);

		tooltipCustomHeader.setAttribute('placeholder', 'Tooltip title')

		var metaTitle = meta.title ? meta.title : '';
		tooltipCustomHeader.value = metaTitle;

		// create switch
		var switchWrapper = Wu.DomUtil.create('div', 'cartoCSS-tooltip-switch-all-wrapper', tooltipHeaderContainer)
		var switchTitle = Wu.DomUtil.create('div', 'cartoCSS-tooltip-switch-all-title', switchWrapper, 'All')
		var fieldSwitch = Wu.DomUtil.create('div', 'switch carto-switch-tooltip', switchWrapper); //  controls-switch
		var switchId = 'switch-' + 'tooltip-all';
		var fieldSwitchInput = Wu.DomUtil.createId('input', switchId, fieldSwitch);
		Wu.DomUtil.addClass(fieldSwitchInput, 'cmn-toggle cmn-toggle-round-flat');
		fieldSwitchInput.setAttribute('type', 'checkbox');
		var fieldSwitchLabel = Wu.DomUtil.create('label', '', fieldSwitch);
		fieldSwitchLabel.setAttribute('for', switchId);

		// save
		Wu.DomEvent.on(tooltipCustomHeader, 'keyup', this._saveTip, this);

		// Set blank array of tooltip switches
		this._toolTipSwitches = [];
		var onCounter = 0;

		// for each field
		var fields = meta.fields;
		fields.forEach(function (field) {

			// create tooltip entry
			this._createTooltipEntry(field.key, field.title, field.on);

			if (field.on) onCounter++;

		}, this);


		if ( onCounter >= fields.length/2 ) {
			fieldSwitchInput.checked = true;
			fieldSwitchInput.setAttribute('checked', 'checked')
		}

		// Save toggle all tooltip switch 
		this._tooltipSelectAllSwitch = fieldSwitchInput;

		Wu.DomEvent.on(fieldSwitchInput, 'change', this._toggleAllTooltip, this);

	},


	_initTooltipDefaultMeta : function () {

		// get default meta
		var fields = this._layer.getMetaFields();

		// create header
		var tooltipHeaderContainer = Wu.DomUtil.create('div', 'cartocss-tooltip-header-container', this._tooltipWrapper);
		var tooltipCustomHeader	= Wu.DomUtil.createId('input', 'cartocss-tooltip-custom-header', tooltipHeaderContainer);

		// create switch
		var switchWrapper = Wu.DomUtil.create('div', 'cartoCSS-tooltip-switch-all-wrapper', tooltipHeaderContainer)
		var switchTitle = Wu.DomUtil.create('div', 'cartoCSS-tooltip-switch-all-title', switchWrapper, 'All')
		var fieldSwitch = Wu.DomUtil.create('div', 'switch carto-switch-tooltip', switchWrapper); //  controls-switch
		var switchId = 'switch-' + 'tooltip-all';
		var fieldSwitchInput = Wu.DomUtil.createId('input', switchId, fieldSwitch);
		Wu.DomUtil.addClass(fieldSwitchInput, 'cmn-toggle cmn-toggle-round-flat');
		fieldSwitchInput.setAttribute('type', 'checkbox');
		var fieldSwitchLabel = Wu.DomUtil.create('label', '', fieldSwitch);
		fieldSwitchLabel.setAttribute('for', switchId);
		tooltipCustomHeader.setAttribute('placeholder', 'Tooltip title')

		fieldSwitchInput.checked = true;
		fieldSwitchInput.setAttribute('checked', 'checked')		

		// save event
		Wu.DomEvent.on(tooltipCustomHeader, 'keyup', this._saveTip, this);

		// Set blank array of tooltip switches
		this._toolTipSwitches = [];

		// for each field
		for (var key in fields) {
			var value = fields[key];

			// create tooltip entry
			this._createTooltipEntry(key, null, true);	
		}		

		// Save toggle all tooltip switch 
		this._tooltipSelectAllSwitch = fieldSwitchInput;

		Wu.DomEvent.on(fieldSwitchInput, 'change', this._toggleAllTooltip, this);

	},

	_toggleAllTooltip : function () {		

		// Get checked state from the select all switch
		var isChecked = this._tooltipSelectAllSwitch.getAttribute('checked');
		
		// Set checked state to the select all switch
		isChecked ? this._tooltipSelectAllSwitch.removeAttribute('checked') : this._tooltipSelectAllSwitch.setAttribute('checked', 'checked');
		
		// Update all the switches
		this._toolTipSwitches.forEach(function(_switch) {

			var on = _switch.checked;
			isChecked ? _switch.checked = false : _switch.checked = true;
			this._saveTip();
			
		}, this);

	},

	_createTooltipEntry : function (defaultKey, key, on) {

		// create wrapper
		var fieldWrapper = Wu.DomUtil.create('div', 'tooltip-field-wrapper', this._tooltipWrapper);
		
		// create field title input
		var fieldKey = Wu.DomUtil.create('input', 'tooltip-field-key', fieldWrapper);
		fieldKey.setAttribute('type', 'text');
		fieldKey.setAttribute('placeholder', defaultKey); // set default key

		// set value if set
		if (key) fieldKey.value = key;

		// create switch
		var fieldSwitch = Wu.DomUtil.create('div', 'switch carto-switch-tooltip', fieldWrapper); //  controls-switch
		var switchId = 'switch-' + defaultKey;
		var fieldSwitchInput = Wu.DomUtil.createId('input', switchId, fieldSwitch);
		Wu.DomUtil.addClass(fieldSwitchInput, 'cmn-toggle cmn-toggle-round-flat');
		fieldSwitchInput.setAttribute('type', 'checkbox');
		var fieldSwitchLabel = Wu.DomUtil.create('label', '', fieldSwitch);
		fieldSwitchLabel.setAttribute('for', switchId);

		this._toolTipSwitches.push(fieldSwitchInput);

		// set checked
		if (on) fieldSwitchInput.setAttribute('checked', 'checked');

		// set save events
		Wu.DomEvent.on(fieldSwitchInput, 'change', this._saveTip, this);
		Wu.DomEvent.on(fieldKey, 'keyup', this._saveTip, this);

	},

	_saveTip : function () {

		// clear timer, dont save more than erry second
		if (this._savingTooltip) clearTimeout(this._savingTooltip);

		var that = this;
		this._savingTooltip = setTimeout(function () {

			// do the save
			that._saveTooltipMeta();

			// set status
			app.setSaveStatus()
	
		}, 1000);

	},


	_saveTooltipMeta : function () {

		var headerTitle = Wu.DomUtil.get('cartocss-tooltip-custom-header').value;

		var saved = {
			title : headerTitle,
			fields : []
		};

		// iterate
		var childs = this._tooltipWrapper.childNodes;
		for (var i = 0; i < childs.length; i++) {

			var child = childs[i];

			// skip first
			if (i == 0) continue;


			var key = child.childNodes[0].getAttribute('placeholder');
			var title = child.childNodes[0].value;
			var checked = child.childNodes[1].querySelector('input:checked');
			var on = (!checked) ? false : true;

			// get each
			saved.fields.push({
				key : key,
				title : title,
				on : on
			});
		}

		// save to server
		this._layer.setTooltip(saved);

		// update legends tab title
		this._legendsTitle.value = saved.title;
		
	},

	closeLayerDropDown : function () {
		this._openDropDown = true;
		this.toggleLayerDropDown();
	},

	toggleLayerDropDown : function () {

		if (!this._openDropDown) {

			this._openDropDown = true;
			var dropDownHeight = this._layers.length * 27;
			if (this._layers.length <= 2) dropDownHeight+=2;
			this._layerSelectorOuter.style.height = dropDownHeight + 'px';
			Wu.DomUtil.addClass(this._styleHeaderDropDownButton, 'carrow-flipped', this);
			

		} else {
			this._openDropDown = false;
			this._layerSelectorOuter.style.height = '0px';
			
			Wu.DomUtil.removeClass(this._styleHeaderDropDownButton, 'carrow-flipped', this);
		}

	},
	
	
	_GAtoggle : function () {

		// Google Analytics event tracking
		app.Analytics.setGaEvent(['Controls', 'CartoCSS toggle']);		

		// Fire function
		this.toggle();
	},

	toggle : function () {
		
		this._open ? this.close() : this.open();

	},

	open : function () {

		// set active project
		this._project = app.activeProject;

		// get all active, geojson layers
		this._layers = this._project.getStylableLayers();

		// Set button to open
		Wu.DomUtil.addClass(this._toolbarButton, 'open');

		// update
		this._initContent();


		// add open class
		Wu.DomUtil.addClass(this._editorContainer, 'open');
		
		// mark open
		this._open = true;
	},

	close : function () {

		// Set button to closed
		Wu.DomUtil.removeClass(this._toolbarButton, 'open');

		// add closed class
		Wu.DomUtil.removeClass(this._editorContainer, 'open');

		// mark closed
		this._open = false;
	},

	renderStyling : function () {

		// return if no active layer
		if (!this._layer) return;

		// get css string
		var css = this._codeMirror.getValue();


		// return if empty
		if (!css) return;

		// get sql
		var sql = this._sqlPane.value;
	
		// request new layer
		var layerOptions = {
			css : css, 
			sql : sql,
			layer : this._layer
		}

		this._updateLayer(layerOptions);

	},

	_createSQL : function (file_id, sql) {

		if (sql) {
			// replace 'table' with file_id in sql
			sql.replace('table', file_id);

			// wrap
			sql = '(' + sql + ') as sub';

		} else {
			// default
			sql = '(SELECT * FROM  ' + file_id + ') as sub';
		}
		return sql;
	},

	_updateLayer : function (options, done) {

		var css = options.css,
		    layer = options.layer,
		    file_id = layer.getFileUuid(),
		    sql = options.sql,
		    sql = this._createSQL(file_id, sql),
		    project = this._project;


		var layerOptions = layer.store.data.postgis;

		layerOptions.sql = sql;
		layerOptions.css = css;
		layerOptions.file_id = file_id;		

		var layerJSON = {
			geom_column: 'the_geom_3857',
			geom_type: 'geometry',
			raster_band: '',
			srid: '',
			affected_tables: '',
			interactivity: '',
			attributes: '',
			access_token: app.tokens.access_token,
			cartocss_version: '2.0.1',
			cartocss : css,
			sql: sql,
			file_id: file_id,
			return_model : true,
			layerUuid : layer.getUuid()
		}

		Wu.post('/api/db/createLayer', JSON.stringify(layerJSON), function (err, newLayerJSON) {

			// new layer
			var newLayerStyle = Wu.parse(newLayerJSON);

			console.log('newLayerJSON', newLayerStyle);

			if (newLayerStyle.error) {
				done();
				return console.error(newLayerStyle.error);
			}

			layer.setStyle(newLayerStyle.options);

			layer.update({enable : true});

			done && done();
		});

	},

	
	renderedStyling : function (context, json) {

		// parse
		var result = Wu.parse(json);

		// handle errors
		if (!result.ok) return this.handleError(result.error);
			
		// update style on layer
		this._layer.updateStyle();

		// update legends tab 
		this._updateLegends(result.cartoid);

	},

	handleError : function (error) {

		// handle unrecognized rule
		if (typeof(error) == 'string' && error.indexOf('Unrecognized rule') > -1) {
			return this._handleSyntaxError(error);
		}

		// handle invalid code
		if (typeof(error) == 'string' && error.indexOf('Invalid code') > -1) {
			return this._handleSyntaxError(error);
		}

		// handle wrong pattern path
		if (typeof(error) == 'string' && error.indexOf('Error: file could not be found:') > -1) {
			return this._handlePathError(error);
		}

		// don't handle debug errors
		if (typeof(error) == 'string' && error.indexOf('debug') > -1) {
			return;
		}

		// catch-all for unhandled errors
		this._setError(error);

		console.error('Unhandled syntax error: ', error);
	},

	_handleSyntaxError : function (error) {

		// parse error
		var err 	= error.split(':');
		var line 	= parseInt(err[2].trim()) - 1;
		var charr 	= err[3].split(' ')[0].trim();
		var problem 	= err[3].split(' ')[1] + ' ' + err[3].split(' ')[2];
		problem 	= problem.trim().camelize();
		var word 	= err[4].split(' ')[1].trim();
		var suggestion 	= err[4].split(' ');
		suggestion.splice(0,2);
		suggestion 	= suggestion.join(' ');

		// set error text
		var errorText = problem + ': ' + word + '. ' + suggestion;
	
		// set error
		this._setError(errorText, line);

	},

	_setError : function (error, line) {

		// get codemirror doc
		var doc = this._codeMirror.getDoc()

		// if line supplied, mark line in codemirror
		if (line) doc.addLineClass(line, 'wrap', 'gutter-syntax-error');

		// set error text
		this._errorPane.innerHTML = error;

		// add error class
		Wu.DomUtil.addClass(this._errorPane, 'active-error');

		// clear error on change
		doc.on('change', function () {
			this._clearError(line || 0);
		}.bind(this));
	},


	_handlePathError : function (error) {

		console.log('_handlePathError', error);

		// set error text
		var errorText = 'Wrong path for pattern-file.';
		
		// set error
		this._setError(errorText);

	},

	_clearError : function (line) {

		// clear error pane
		this._errorPane.innerHTML = '';
		Wu.DomUtil.removeClass(this._errorPane, 'active-error');
		
		// remove line class
		var doc = this._codeMirror.getDoc();
		doc.removeLineClass(line, 'wrap'); // removes all classes

		// remove event (doesn't work.. see here instead: http://codemirror.net/doc/manual.html#events)
		doc.off('change', function () {
			this._clearError(line || 0);
		}.bind(this));

	},

	destroy : function () {
		this.onRemove();
	},

	getPatternList : function () {
		var patterns = ['001.png', '002.png', '003.png', '004.png', '005.png', '006.png', '007.png', '008.png', '009.png', '010.png', '011.png', '012.png', '013.png', '014.png', '015.png', '016.png', '017.png', '018.png', '019.png', '020.png', '021.png', 'paperwhite1.png', 'paperwhite2.png', 'paperwhite3.png', 'paperwhite4.png', 'paperwhite5.png', 'paperwhite6.png', 'waves.png', 'waves_white.png'];
		console.log('CartoCSS patterns: ');
		console.log(patterns);
	},



	
});
L.control.cartoCss = function (options) {
	return new L.Control.CartoCSS(options);
};
