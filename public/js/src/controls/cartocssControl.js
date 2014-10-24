L.Control.CartoCSS = L.Control.extend({
	
	options: {
		position : 'topleft' 
	},

	_laidout : false,

	onAdd : function () {

		// create toolbar container
		var container = Wu.DomUtil.create('div', 'leaflet-control-cartocss leaflet-control');

		// create toolbar button
		this._toolbarButton = Wu.DomUtil.create('div', 'cartocss-toolbar-button', container);

		// init rest of layout
		this.initLayout();

		// init code mirror
		this.initCodeMirror();

		// add hooks
		this.addHooks();


		return container;	// automatically becomes this._container;

	},

	onRemove : function () {

		console.log('cartocCSS  onRemove');

		// remove hooks
		this.removeHooks();

		Wu.DomUtil.remove(this._codeMirror.getWrapperElement());
		

		// remove from leaflet-control-container
		Wu.DomUtil.remove(this._editorContainer);
	},

	initLayout : function () {

		// editor container
		this._editorContainer = Wu.DomUtil.create('div', 'cartocss-control-container');

		// the obligatory wrapper
		var wrapper = Wu.DomUtil.create('div', 'cartocss-control-wrapper', this._editorContainer); 

		// Close button
		this._xButton = Wu.DomUtil.create('div', 'close-cartocss-editor-x', wrapper);

		// create form wrapper
		this._styleHeaderWrapper = Wu.DomUtil.create('div', 'cartocss-style-header-wrapper', wrapper);

		this._styleHeader = Wu.DomUtil.create('div', 'cartocss-style-header', this._styleHeaderWrapper);
		this._styleHeader.innerHTML = 'Editing style for:&nbsp;';	

		this._styleHeaderLayerName = Wu.DomUtil.create('div', 'cartocss-style-header-layer', this._styleHeaderWrapper);
		this._styleHeaderLayerName.innerHTML = 'No selected layer'; // todo: dropdown (ie. nicely styled, not ugly default) instead of list???

		// For CodeMirror: create form wrapper
		this._formWrapper = Wu.DomUtil.create('form', 'cartocss-form-wrapper', wrapper);

		// For CodeMirror: create text area
		this._inputArea = Wu.DomUtil.create('textarea', 'cartocss-input', this._formWrapper);

		// error feedback pane
		this._errorPane = Wu.DomUtil.create('div', 'cartocss-error-pane', wrapper);

		// create attributes header
		this._attributesHeader = Wu.DomUtil.create('div', 'cartocss-haeder', wrapper);
		this._attributesHeader.innerHTML = 'Layer attributes:';

		// create attributes area
		this._attributesArea = Wu.DomUtil.create('div', 'cartocss-attributes', wrapper);

		// create layer selector header
		this._layerSelectorHeader = Wu.DomUtil.create('div', 'cartocss-haeder', wrapper);
		this._layerSelectorHeader.innerHTML = 'Select layer:';

		// create layer selector
		this._layerSelector = Wu.DomUtil.create('div', 'cartocss-layerselector', wrapper);

		// create update button
		this._updateButton = Wu.DomUtil.create('div', 'cartocss-update-button', wrapper);

		this._updateButton.innerHTML = 'Render layer';

		// append to leaflet-control-container
		app._map.getContainer().appendChild(this._editorContainer);

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

  		// var completer = cartoCompletion(this._codeMirror, window.cartoRef);
		// this._codeMirror.on('keydown', completer.onKeyEvent);
		// this._codeMirror.on('change', function() { return window.editor && window.editor.changed(); });
		// this._codeMirror.setOption('onHighlightComplete', _(completer.setTitles).throttle(100));
		// console.log(')thi wrapper element', this._codeMirror);
		// this._codeMirror.getWrapperElement().id = 'code-' + id.replace(/[^\w+]/g,'_');

  		this._codeMirror.setValue('No layer selected. \n\n#layer { \n // base is always #layer \n}');
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

		// add
		this._layers.forEach(function (layer) {

			// append
			var wrapper = Wu.DomUtil.create('div', 'layer-selector-item-wrap');
			var div = Wu.DomUtil.create('div', 'layer-selector-item', wrapper, layer.getTitle());
			this._layerSelector.appendChild(wrapper);

			// hook
			Wu.DomEvent.on(wrapper, 'mousedown', function () {
							
				this.refresh(layer);
				this.setSelected(wrapper);

			}, this);


		}, this);

	},

	setSelected : function (div) {


	},

	_selectLayer : function (layer) {
		this.refresh(layer);
	},

	addHooks : function () {

		// update button click
		Wu.DomEvent.on(this._updateButton, 'click', this.updateCss, this);

		// toolbar button click
		Wu.DomEvent.on(this._toolbarButton, 'click', this.toggle, this);

		// remove control
		Wu.DomEvent.on(this._xButton, 'click', this.toggle, this);

		// stops
		Wu.DomEvent.on(this._editorContainer, 'mousewheel mousedown dblclick', Wu.DomEvent.stop, this);
		Wu.DomEvent.on(this._toolbarButton, 'dblclick', Wu.DomEvent.stopPropagation, this);

		// hack attempt to fix weird unclickables
		Wu.DomEvent.on(this._editorContainer, 'mouseenter', function () {
			console.log('mousenter!');
			this._codeMirror.focus();
		}, this);

		// if first u dont succeed
		var leafletControlContainer = app._map._controlContainer;
		Wu.DomEvent.on(leafletControlContainer, 'mousedown', function () {
			console.log('mosue');
		}, this);

	},

	removeHooks : function () {

		

	},

	
	refresh : function (layer) {

		// new layer is active
		this._layer = layer;
		this._cartoid = false;

		// insert title
		this._styleHeaderLayerName.innerHTML = layer.store.title.camelize();

		// check for existing css
		this._cartoid = this._layer.getCartoid();

		// insert into input area
		if (this._cartoid) {				// callback
			this._layer.getCartoCSS(this._cartoid, this.insertCss.bind(this));
		}

	},

	insertCss : function (ctx, css) {

		// 
		// this._codeMirror.setValue(css);

		this.updateCodeMirror(css);
	},

	// update (new project, etc.)
	update : function () {
		console.log('update!');

		// set active project
		this.project = app.activeProject;

		// get all active, geojson layers
		this._layers = this.project.getStylableLayers();

		console.log('this._layers: ', this._layers);

		// fill active layers box
		this._fillLayers();
	},

	toggle : function () {
		this._open ? this.close() : this.open();
	},

	open : function () {
		this._open = true;
		Wu.DomUtil.addClass(this._editorContainer, 'open');
		console.log('open!');

		// To make sure the code mirror looks fresh
		this._codeMirror.refresh();
	},

	close : function () {
		this._open = false;
		Wu.DomUtil.removeClass(this._editorContainer, 'open');
		console.log('close');
	},

	updateCss : function () {

		console.log('updateCss!!!', this._layer);

		if (!this._layer) return;

		// get css string
		var css = this._codeMirror.getValue();

		console.log('css => ', css);


		// empty
		if (!css) return; // todo: check valid!!
		

		var fileUuid = this._layer.getFileUuid();
		var cartoid = Wu.Util.createRandom(7);

		// send to server
		var json = {							// todo: verify valid css
			css : css,
			fileUuid : fileUuid,
			cartoid : cartoid
		}

		// save to server
		console.log('settgin!', json);
		this._layer.setCartoCSS(json, this.updatedCss.bind(this));

		
	},

	
	updatedCss : function (context, json) {
		console.log('updatedCss', context, json);

		var result = JSON.parse(json);

		// handle error
		if (!result.ok) return this.handleError(result.error);
			
		// update style on layer
		this._layer.updateStyle();
	},

	handleError : function (error) {

		// handle unrecognized rule
		if (typeof(error) == 'string' && error.indexOf('Unrecognized rule') > -1) {
			return this._handleSyntaxError(error);
		}

		// handle unrecognized rule
		if (typeof(error) == 'string' && error.indexOf('Invalid code') > -1) {
			return this._handleSyntaxError(error);
		}

		// todo: other errors
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

		console.log('err:', err);
		console.log('line: ', line);
		console.log('char: ', charr);
		console.log('problem: ', problem);
		console.log('word: ', word);
		console.log('suggestion: ', suggestion);


		// mark error in codemirror:

		// get current document
		var doc = this._codeMirror.getDoc()
		
		// add class to line with error 
		//   		 line, [text, background or wrap], className
		doc.addLineClass(line, 'wrap', 'gutter-syntax-error');

		// add error text
		this._errorPane.innerHTML = problem + ': ' + word + '. ' + suggestion;
		Wu.DomUtil.addClass(this._errorPane, 'active-error');

		// clear error on change in codemirror input area
		var that = this;
		Wu.DomEvent.on(doc, 'change', this._clearError, this);
		doc.on('change', function () {
			that._clearError(line);
			
		});



	},

	_clearError : function (line) {
		console.log('_clearError');

		// clear error pane
		this._errorPane.innerHTML = '';
		Wu.DomUtil.removeClass(this._errorPane, 'active-error');
		
		// remove line class
		var doc = this._codeMirror.getDoc();
		doc.removeLineClass(line, 'wrap'); // removes all classes

		// remove event (doesn't work.. see here instead: http://codemirror.net/doc/manual.html#events)
		var that = this;
		doc.off('change', function () {
			that._clearError(line);
		});

	},

	destroy : function () {
		console.log('destrouy!');
		this.onRemove();
	}



	
});
L.control.cartoCss = function (options) {
	return new L.Control.CartoCSS(options);
};
console.log('cartocssControl.js');