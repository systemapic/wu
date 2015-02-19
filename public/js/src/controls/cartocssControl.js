L.Control.CartoCSS = L.Control.extend({
	
	options: {
		position : 'topleft' 
	},

	_laidout : false,

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

		// add hooks
		this.addHooks();

		// automatically becomes this._container;
		return container;	

	},

	onRemove : function () {

		// remove hooks
		this.removeHooks();

		// remove from DOM
		Wu.DomUtil.remove(this._codeMirror.getWrapperElement());

		// remove from leaflet-control-container
		Wu.DomUtil.remove(this._editorContainer);
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
		this._errorPane 		= Wu.DomUtil.create('div', 'cartocss-error-pane', this._wrapper); // error feedback pane
		this._updateButton 		= Wu.DomUtil.create('div', 'cartocss-update-button', this._wrapper, 'Render changes...'); // create update button

		// append to leaflet-control-container
		app._map.getContainer().appendChild(this._editorContainer);

		// add tooltip
		app.Tooltip.add(this._styleHeaderWrapper, 'Shows a list of active layers for this project.', { extends : 'systyle', tipJoint : 'top left'});
		app.Tooltip.add(this._zoomVal, 'Shows current zoom level.', { extends : 'systyle', tipJoint : 'top left'});
		app.Tooltip.add(this._tabStyling, 'Style selected layer. Takes CartoCSS code.', { extends : 'systyle', tipJoint : 'top left'});
		app.Tooltip.add(this._tabTooltip, 'Customize tooltip to appear when clicking on different shapes in layer.', { extends : 'systyle', tipJoint : 'top left'});
		app.Tooltip.add(this._tabLegends, 'Decide which legends you want to show for selected layer.', { extends : 'systyle', tipJoint : 'top left'});
				

	},

	addHooks : function () {


		// cxxxx

		// update button click
		Wu.DomEvent.on(this._updateButton, 'click', this.renderStyling, this); // GA OK

		// toolbar button click
		Wu.DomEvent.on(this._toolbarButton, 'click', this.toggle, this); // GA OK

		// remove control
		Wu.DomEvent.on(this._xButton, 'click', this.toggle, this); // GA OK

		// Layer drop down
		Wu.DomEvent.on(this._styleHeaderLayerName, 'click', this.toggleLayerDropDown, this);

		// Toggle legends tab
		Wu.DomEvent.on(this._tabLegends, 'mousedown', this.toggleLegends, this); // GA OK

		// Toggle styles tab
		Wu.DomEvent.on(this._tabStyling, 'mousedown', this.toggleStyles, this); // GA OK

		// Toggle tooltip tab
		Wu.DomEvent.on(this._tabTooltip, 'mousedown', this.toggleTooltip, this);  // GA OK

		// Resize container
		Wu.DomEvent.on(this._resizeHandle, 'mousedown', this.resize, this);

		// stops
		Wu.DomEvent.on(this._editorContainer, 		'mousewheel mousedown dblclick click', 		Wu.DomEvent.stopPropagation, this);
		Wu.DomEvent.on(this._toolbarButton, 		'dblclick', 					Wu.DomEvent.stopPropagation, this);
		Wu.DomEvent.on(this._styleHeaderLayerName, 	'click mousedown', 				Wu.DomEvent.stopPropagation, this);
		Wu.DomEvent.on(this._formWrapper, 		'click mousedown', 				Wu.DomEvent.stopPropagation, this);

		// Update Zoom
		var map = app._map;
		map.on('zoomend', function() {
			this._zoomVal.innerHTML = map.getZoom();
		}, this)
		
	},

	removeHooks : function () {

		

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
		// var mouse = {x: 0};		
		var mousex = e.clientX || e.pageX || 0,
		    offleft = this._editorContainer.offsetLeft,
		    offwidth =  this._editorContainer.offsetWidth,
		    w = offwidth + (offleft - mousex);

		if ( w >= 300 ) this._editorContainer.style.width = w + 'px';
	},

	// update: fired from outside, on project.select() etc.
	update : function () {

		// mark as update needed
		this._updated = false;
	},

	_update : function () {
		if (this._updated) return;

		// set active project
		this.project = app.activeProject;

		// get all active, geojson layers
		this._layers = this.project.getStylableLayers();

		// fill active layers box
		this._fillLayers();

		// select a layer
		this.setLastUpdatedLayer();

		// mark updated
		this._updated = true;

		// refresh codemirror
		this._codeMirror.refresh();

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

		// set default value
  		// this._codeMirror.setValue('// No layer selected. \n\n// #layer is always base \n#layer { \n  \n}');

		// todo:
  		// var completer = cartoCompletion(this._codeMirror, window.cartoRef);
		// this._codeMirror.on('keydown', completer.onKeyEvent);
		// this._codeMirror.on('change', function() { return window.editor && window.editor.changed(); });
		// this._codeMirror.setOption('onHighlightComplete', _(completer.setTitles).throttle(100));
		// console.log(')thi wrapper element', this._codeMirror);
		// this._codeMirror.getWrapperElement().id = 'code-' + id.replace(/[^\w+]/g,'_');
	

		// cxxxx
		// var settings = app.activeProject.getSettings();


		// if ( settings.darkTheme ) app.Style.themeToggle('dark');		// TODO: fires too early.. do this differently



	},

	_initStylingDefault : function () {

		// get meta fields
		var fields = this._layer.getMetaFields(); // return false if no fields found
		
		// create string
		var string = '// CartoCSS reference guide:\n// https://bit.ly/1z5OvXT\n\n\n';
		string += '// #layer is always the layer identifier \n';
		string += '#layer {\n\n';
		string += '    // Available fields in layer:\n\n';

		// add each field to string
		for (key in fields) {
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

		// Google Analytics event tracking
		var _layerTitle = layer.store.title;
		app.Analytics.ga(['Controls', 'CartoCSS select layer: ' + _layerTitle]);

		// close dropdown
		this.closeLayerDropDown();
		
		// init tabs
		this.initStyling(layer);	
		this.initTooltip(layer);
		this.initLegends(layer);

		// select in list
		this.setSelected(layer);
		
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
		app.Analytics.ga(['Controls', 'CartoCSS toggle legends']);



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
		app.Analytics.ga(['Controls', 'CartoCSS toggle styles']);


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
		app.Analytics.ga(['Controls', 'CartoCSS toggle tooltip']);		

	},

	initStyling : function (layer) {
		if (!layer) return;

		// new layer is active
		this._layer = layer;
		this._cartoid = false;

		// insert title in dropdown
		this._styleHeaderLayerName.innerHTML = layer.store.title.camelize();

		// check for existing css
		this._cartoid = this._layer.getCartoid();

		// if no style stored on layer yet, set default message	
		if (!this._cartoid) return this._initStylingDefault();				

		// else get css from server
		this._layer.getCartoCSS(this._cartoid, function (ctx, css) {
			
			// set css
			this.updateCodeMirror(css);

		}.bind(this));

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

		// clear old
		this._legendsWrapper.innerHTML = '';

		// inner wrapper
		this._legendsWrapperInner = Wu.DomUtil.create('div', 'legends-inner-scroller', this._legendsWrapper);
		this._legendsTitle = Wu.DomUtil.create('div', 'legends-title', this._legendsWrapperInner);
		this._legendsTitle.innerHTML = tooltipMeta.title || 'No title';
		this._legendsListWrapper = Wu.DomUtil.create('div', 'legends-list-wrapper', this._legendsWrapperInner);

		// each legend
		legends.forEach(function (legend) {

			// append legend entry to wrapper
			var legdiv = this._legendEntry(legend);
			this._legendsListWrapper.appendChild(legdiv);

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
		var legendsControl = app.MapPane.legendsControl;
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
			var legends = JSON.parse(json);

			if (legends && legends.err) {
				console.error('legends err', legends);
				return this.handleError(legends.err);
			}

			// sort some things: #layer on top
			var layer = _.remove(legends, function (l) {
				return l.key == 'layer';
			});
			legends.unshift(layer[0]);

			// include old legends settings
			legends = this._mergePreviousLegendsSettings(legends, this._layer.getLegends());

			// fill legends tab in editor
			this.fillLegends(legends);

			// save to layer
			this._layer.setLegends(legends);

			// save local
			this._legends = legends;


		}.bind(this));

	},


	_mergePreviousLegendsSettings : function (newLegends, oldLegends) {

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
		var tooltipCustomHeader	= Wu.DomUtil.createId('input', 'cartocss-tooltip-custom-header', this._tooltipWrapper);
		tooltipCustomHeader.setAttribute('placeholder', 'Tooltip title')
		tooltipCustomHeader.value = meta.title;

		// save
		Wu.DomEvent.on(tooltipCustomHeader, 'keyup', this._saveTip, this);

		// for each field
		var fields = meta.fields;
		fields.forEach(function (field) {

			// create tooltip entry
			this._createTooltipEntry(field.key, field.title, field.on);

		}, this);


	},


	_initTooltipDefaultMeta : function () {


		// get default meta
		var fields = this._layer.getMetaFields();

		// create header
		var tooltipCustomHeader	= Wu.DomUtil.createId('input', 'cartocss-tooltip-custom-header', this._tooltipWrapper);
		tooltipCustomHeader.setAttribute('placeholder', 'Tooltip title')

		// save event
		Wu.DomEvent.on(tooltipCustomHeader, 'keyup', this._saveTip, this);

		// for each field
		for (key in fields) {
			var value = fields[key];

			// create tooltip entry
			this._createTooltipEntry(key, null, true);	
		}

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

		var saved = {
			title : '',
			fields : []
		};

		// iterate
		var childs = this._tooltipWrapper.childNodes;
		for (var i = 0; i < childs.length; i++) {

			var child = childs[i];

			// get title
			if (i == 0) {
				saved.title = child.value;
				continue;
			}

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
		this._legendsTitle.innerHTML = saved.title;
		
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
	
	

	toggle : function () {
		
		this._open ? this.close() : this.open();

		// Google Analytics event tracking
		app.Analytics.ga(['Controls', 'CartoCSS toggle']);

	},

	open : function () {


		// Set button to open
		Wu.DomUtil.addClass(this._toolbarButton, 'open');

		// update
		this._update();

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

		// Google Analytics event tracking
		var _layerTitle = this._layer.store.title;
		app.Analytics.ga(['Controls', 'CartoCSS render layer: ' + _layerTitle]);

		// return if no active layer
		if (!this._layer) return;

		// get css string
		var css = this._codeMirror.getValue();

		// return if empty
		if (!css) return;
		
		// set vars
		var fileUuid = this._layer.getFileUuid();
		var cartoid = Wu.Util.createRandom(7);

		// send to server
		var json = {							// todo: verify valid css
			css : css,
			fileUuid : fileUuid,
			cartoid : cartoid,
			layerUuid : this._layer.getUuid()
		}

		// save to server
		this._layer.setCartoCSS(json, this.renderedStyling.bind(this));

	},

	
	renderedStyling : function (context, json) {

		// parse
		var result = JSON.parse(json);

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
		var err = error.split(':');
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
