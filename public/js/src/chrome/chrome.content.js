Wu.Chrome.Content = Wu.Chrome.extend({

	_initialize : function () {

		console.log('chrome.content');
	},


	initLayout : function () {

	},

	_addEvents : function () {

		var trigger = this.options.trigger;
		if (trigger) {
			Wu.DomEvent.on(trigger, 'click', this.show, this);
		}

		Wu.DomEvent.on(window, 'resize', this._windowResize, this);
	},

	_removeEvents : function () {
		Wu.DomEvent.off(window, 'resize', this._windowResize, this);
	},

	_windowResize : function () {

	},

	show : function () {
		if (!this._inited) this._initLayout();

		// hide others
		this.hideAll();

		// show this
		this._container.style.display = 'block';

		// mark button
		Wu.DomUtil.addClass(this.options.trigger, 'active-tab');
	},

	hide : function () {
		this._container.style.display = 'none';
		Wu.DomUtil.removeClass(this.options.trigger, 'active-tab');
	},

	hideAll : function () {
		if (!this.options || !this.options.parent) return console.log('hideAll not possible');

		var tabs = this.options.parent.getTabs();
		for (var t in tabs) {
			var tab = tabs[t];
			tab.hide();
		}

	},

	_projectSelected : function (e) {
		var p = e.detail.projectUuid;
		if (!p) return;

		// set project
		this._project = app.activeProject = app.Projects[p];

		// refresh pane
		this._refresh();
	},


	_refresh : function () {

	},

	_initLayout_activeLayers : function () {

		// active layer wrapper
		var wrap = Wu.DomUtil.create('div', 'chrome chrome-content styler-content active-layer wrapper', this._container);

		// title
		var title = Wu.DomUtil.create('div', 'chrome chrome-content active-layer title', wrap, 'Layer');
		
		// create dropdown
		var selectWrap = Wu.DomUtil.create('div', 'chrome chrome-content active-layer select-wrap', wrap);
		var select = this._select = Wu.DomUtil.create('select', 'active-layer-select', selectWrap);

		// get layers
		var layers = this._project.getPostGISLayers();

		// placeholder
		var option = Wu.DomUtil.create('option', '', select);
		option.innerHTML = 'Select a layer to style...';
		option.setAttribute('disabled', '');
		option.setAttribute('selected', '');


		// fill select options
		layers.forEach(function (layer) {
			var option = Wu.DomUtil.create('option', 'active-layer-option', select);
			option.value = layer.getUuid();
			option.innerHTML = layer.getTitle();
		});	

		// select event
		Wu.DomEvent.on(select, 'change', this._selectedActiveLayer, this); // todo: mem leak?

	},

	opened : function () {
	},

	closed : function () {
		console.log('i was also closed!', this);
	},


});

Wu.Chrome.Content.SettingsSelector = Wu.Chrome.Content.extend({

	options : {
		tabs : {
			styler : {
				enabled : true,
				text : 'Style Editor'
			},
			layers : {
				enabled : true,
				text : 'Layers'
			},
			tooltip : {
				enabled : true,
				text : 'Tooltip'
			},
			cartocss : {
				enabled : true,
				text : 'CartoCSS & SQL'
			},
		}
	},

	_initialize : function () {

		this._initContainer();

		this.initLayout();
	},

	_initContainer : function () {

		// create container
		this._container = Wu.DomUtil.create('div', 'chrome chrome-content settingsSelector', this.options.appendTo);

		// tabs wrapper
		this._tabsWrapper = Wu.DomUtil.create('div', 'chrome chrome-content settings-tabs-wrapper', this.options.appendTo);

	},

	initLayout : function () {

		// title
		this._title = Wu.DomUtil.create('div', 'chrome chrome-content settings-title', this._container, 'Settings');

		// tabs
		this._initTabs();
	},

	getTabs : function () {
		return this._tabs;
	},

	_initTabs : function () {

		// tabs object
		this._tabs = {};

		// button wrapper
		this._buttonWrapper = Wu.DomUtil.create('div', 'chrome chrome-content settings-button-wrapper', this._container);
		
		// create tabs
		for (var o in this.options.tabs) {
			if (this.options.tabs[o].enabled) {
				console.log('o: ', o);

				var text = this.options.tabs[o].text;

				var tab = o.camelize();

				console.log('tab: ', tab);

				// create tab contents
				if (Wu.Chrome.Content[tab]) {

					// create tab button
					var trigger = Wu.DomUtil.create('div', 'chrome chrome-content settings-button', this._buttonWrapper, text);

					// create content
					this._tabs[tab] = new Wu.Chrome.Content[tab]({
						options : this._options,
						trigger : trigger,
						appendTo : this._tabsWrapper,
						parent : this
					});
				}
			}
		}

		console.log('this._tabs: ', this._tabs);
	},

	show : function () {

	},

	hide : function () {
		console.log('hiding tab!');
	},

	opened : function () {
		console.log('i was opened!', this._tabs);
		this._tabs['Styler'].show();

	},

	closed : function () {
		console.log('i was closed!');

		for (var t in this._tabs) {
			this._tabs[t].closed();
		}
	},

});


Wu.Chrome.Content.Styler = Wu.Chrome.Content.extend({

	_initialize : function () {

		console.log('chrome.content styleeditor');

		// init container
		this._initContainer();

		// add events
		this._addEvents();
	},

	_initContainer : function () {

		// create container
		this._container = Wu.DomUtil.create('div', 'chrome chrome-content styler', this.options.appendTo);
	},

	_initLayout : function () {
		if (!this._project) return;
  
		// active layer
		this._initLayout_activeLayers();

		// mark as inited
		this._inited = true;
	},

	_refresh : function () {

		this._flush();
		this._initLayout();
	},

	_flush : function () {
		this._container.innerHTML = '';
	},


	
	// event run when layer selected 
	_selectedActiveLayer : function (e) {
		var layerUuid = e.target.value;
		console.log('selected layer: ', layerUuid);

		var layer = this._project.getLayer(layerUuid);

		// get current style, returns default if none
		var style = layer.getEditorStyle();

		console.log('currentStyle: ', style);

		// init style json
		this._initStyle(style);
	},

	_initStyle : function (style) {
		console.log('currentstyle: ', style);

	},


	_createField : function (json) {



	},





});


Wu.Chrome.Content.Layers = Wu.Chrome.Content.extend({

	_initialize : function () {

		console.log('chrome.content layers');

		// init container
		this._initContainer();

		// add events
		this._addEvents();
	},

	_initContainer : function () {

		// create container
		this._container = Wu.DomUtil.create('div', 'chrome chrome-content layers', this.options.appendTo);

	},

	_initLayout : function () {

	},

	_refresh : function () {

		this._flush();
		this._initLayout();
	},

	_flush : function () {
		this._container.innerHTML = '';
	},


	open : function () {
		console.log('open!', this);
	}

});





Wu.Chrome.Content.Cartocss = Wu.Chrome.Content.extend({

	_initialize : function () {

		console.log('chrome.content carto');

		// init container
		this._initContainer();

		// add events
		this._addEvents();
	},

	_initContainer : function () {

		// create container
		this._container = Wu.DomUtil.create('div', 'chrome chrome-content cartocss', this.options.appendTo);
	},

	_initLayout : function () {

		// active layer
		this._initLayout_activeLayers();

		// wrapper
		this._codewrap = Wu.DomUtil.create('input', 'chrome chrome-content cartocss code-wrapper', this._container);

		// sql editor
		this._createSqlEditor();
		
		// carto editor
		this._createCartoEditor();

		// add shortkeys
		this._setKeymap();

		// create refresh button
		this._createRefresh();

		// insert titles
		this._createTitles();

		// hide by default
		this._hideEditors();

		// set sizes
		this._updateDimensions();

		// mark as inited
		this._inited = true;

	},

	_refresh : function () {

		this._flush();
		this._initLayout();
	},

	_flush : function () {
		this._removeKeymaps();
		this._removeEvents();
		this._cartoEditor = null;
		this._SQLEditor = null;
		this._container.innerHTML = '';
	},


	_cleanup : function () {
		// select nothing from dropdown
		// clear carto, sql
		// hide
		// unbind keys
		if (this._select) this._select.selectedIndex = 0;
		this._cartoEditor && this._cartoEditor.setValue('');
		this._SQLEditor && this._SQLEditor.setValue('');
		this._hideEditors();
		this._removeKeymaps();
		this._removeEvents();
	},

	_removeEvents : function () {

		// Wu.DomEvent.off(window, 'resize', this._windowResize, this);

	},

	_createTitles : function () {
		
		// create
		this._cartotitle = Wu.DomUtil.create('div', 'chrome chrome-content cartocss title');
		this._cartotitle.innerHTML = 'CartoCSS';
		this._sqltitle = Wu.DomUtil.create('div', 'chrome chrome-content cartocss title');
		this._sqltitle.innerHTML = 'SQL';
		
		// insert
		var c = this._cartoEditor.getWrapperElement();
		c.parentElement.insertBefore(this._cartotitle, c);

		// insert
		var s = this._SQLEditor.getWrapperElement();
		s.parentElement.insertBefore(this._sqltitle, s);
	},

	_createCartoEditor : function () {

		// editor
		this._cartoEditor = CodeMirror.fromTextArea(this._codewrap, {
    			lineNumbers: true,    			
    			mode: {
    				name : 'carto',
    				reference : window.cartoRef
    			},
    			matchBrackets: true,
    			lineWrapping: false,
    			paletteHints : true,
    			gutters: ['CodeMirror-linenumbers', 'errors']
  		});

	},

	_createSqlEditor : function () {


		// editor
		this._SQLEditor = CodeMirror.fromTextArea(this._codewrap, {
    			lineNumbers: true,    			
    			mode: {
    				name : 'text/x-sql',
    			},
    			matchBrackets: true,
    			lineWrapping: false,
    			paletteHints : true,
    			gutters: ['CodeMirror-linenumbers', 'errors']
  		});

	},

	_setKeymap : function () {

		this._keymap = {
			"Cmd-S": function(cm){
				this._updateStyle();
			}.bind(this),
			"Ctrl-S": function(cm){
				this._updateStyle();
			}.bind(this),
			"Cmd-R": function(cm){
				this._refreshLayer();
			}.bind(this),
			"Ctrl-R": function(cm){
				this._refreshLayer();
			}.bind(this)
		}

		this._cartoEditor.addKeyMap(this._keymap);
		this._SQLEditor.addKeyMap(this._keymap);

		
		keymaster('⌘+r, ctrl+r', function(){
			this._refreshLayer();
			return false;
		}.bind(this));

		keymaster('⌘+s, ctrl+s', function(){
			this._updateStyle();
			return false;
		}.bind(this));

	},

	_removeKeymaps : function () {
		this._cartoEditor && this._cartoEditor.removeKeyMap(this._keymap);
		this._SQLEditor && this._SQLEditor.removeKeyMap(this._keymap);
		if (keymaster.unbind) keymaster.unbind('⌘+s, ctrl+s');
		if (keymaster.unbind) keymaster.unbind('⌘+r, ctrl+r');
	},

	

	_updateDimensions : function () {
		if (!this._cartoEditor) return;

		// get dimensions
		var dims = app.Chrome.Right.getDimensions();

		// set sizes
		var carto = this._cartoEditor.getWrapperElement();
		if (carto) {
			carto.style.width = dims.width + 'px';
			carto.style.height = (dims.height/3*2) - 150 + 'px';
		}

		// set sizes
		var sql = this._SQLEditor.getWrapperElement();
		if (sql) {
			sql.style.width = dims.width + 'px';
			sql.style.height = (dims.height/3*1) - 220 + 'px';
		}
	},

	_windowResize : function () {
		this._updateDimensions();
		app._map.invalidateSize();
	},

	_createRefresh : function () {

		var text = (navigator.platform == 'MacIntel') ? 'Save (⌘-S)' : 'Save (Ctrl-S)';
		this._refreshButton = Wu.DomUtil.create('div', 'chrome chrome-content cartocss refresh-button', this._container, text);

		Wu.DomEvent.on(this._refreshButton, 'click', this._updateStyle, this);
	},

	_updateStyle : function () {

		console.log('uypdateSTYLE!');

	},

	_updateStyle : function () {

		// return if no active layer
		if (!this._layer) return console.error('no layer');

		// get css string
		var css = this._cartoEditor.getValue();

		// return if empty
		if (!css) return console.error('no css');

		// get sql
		var sql = this._SQLEditor.getValue();
	
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
				done && done();
				return console.error(newLayerStyle.error);
			}

			layer.setStyle(newLayerStyle.options);

			layer.update({enable : true});

			done && done();
		});

	},

	_refreshLayer : function () {
		console.log('_refreshLayer');
	},

	open : function () {
		console.log('open!', this);
	},

	_selectedActiveLayer : function (e) {

		// get layer
		var layerUuid = e.target.value;
		this._layer = this._project.getLayer(layerUuid);

		// selecting layer in dropdown...
		// .. problems:
		// 1. what if layer is not in layer menu?
		// 2. if not, should it be added?
		// 3. what if user just clicks wrong layer?
		// 4. should actually layers not in layermenu be available in dropdown? (they are now)
		// 5. 
		// ----------
		// SOLUTION: temporarily add layers to map for editing, remove when done editing.


		// refresh
		this._refreshEditor();

		// add layer temporarily to map
		this._tempaddLayer();
	},

	_tempaddLayer : function () {

		console.log('tempaddinglayer!!');

		// remember
		this._temps = this._temps || [];

		// remove other styling layers
		this._tempRemoveLayers();

		// add
		this._layer._addThin();

		// fly to
		this._layer.flyTo();

		// remember
		this._temps.push(this._layer);

	},

	_tempRemoveLayers : function () {
		if (!this._temps) return;

		// remove other layers added tempy for styling
		this._temps.forEach(function (layer) {
			layer._removeThin();
		}, this);
	},

	opened : function () {

	},

	closed : function () {
		// clean up
		this._tempRemoveLayers();
		this._cleanup();
	},

	_refreshEditor : function () {
		
		// fill editors
		this._refreshCartoCSS();
		this._refreshSQL();

		// show
		this._showEditors();

		// refresh codemirror (cause buggy)
		this._SQLEditor.refresh();
		this._cartoEditor.refresh();
	},

	_refreshCartoCSS : function () {

		// get
		var css = this._layer.getCartoCSS();

		// set
		this._cartoEditor.setValue(css);
	},

	_refreshSQL : function () {

		// get
		var meta = this._layer.getPostGISData();
		var rawsql = meta.sql;
		var table = meta.table_name;
		var sql = rawsql.replace(table, 'table').replace('  ', ' ');

		// remove (etc) as sub
		var sql = this._cleanSQL(sql);

		// set
		this._SQLEditor.setValue(sql);
	
	},

	_cleanSQL : function (sql) {
		var first = sql.substring(0,1);
		var last = sql.slice(-8);

		// if sql is of format (SELECT * FROM table) as sub
		if (first == '(' && last == ') as sub') {
			var clean_sql = sql.substr(1, sql.length -9);
			return clean_sql;
		}

		return sql;
	},

	_showEditors : function () {
		this._SQLEditor.getWrapperElement().style.opacity = 1;
		this._cartoEditor.getWrapperElement().style.opacity = 1;
		this._sqltitle.style.opacity = 1;
		this._cartotitle.style.opacity = 1;
		this._refreshButton.style.opacity = 1;
	},

	_hideEditors : function () {
		this._SQLEditor.getWrapperElement().style.opacity = 0;
		this._cartoEditor.getWrapperElement().style.opacity = 0;
		this._sqltitle.style.opacity = 0;
		this._cartotitle.style.opacity = 0;
		this._refreshButton.style.opacity = 0;
	},


});





Wu.Chrome.Content.Tooltip = Wu.Chrome.Content.extend({

	_initialize : function () {

		console.log('chrome.content tooltip');

		// init container
		this._initContainer();

		// add events
		this._addEvents();
	},

	_initContainer : function () {

		// create container
		this._container = Wu.DomUtil.create('div', 'chrome chrome-content tooltip', this.options.appendTo);

	},

	_initLayout : function () {

	},

	
	open : function () {
		console.log('open!', this);
	}

});




// Wu.Chrome.Content.StyleEditor = Wu.Chrome.Content.extend({

// 	_initialize : function () {

// 		console.log('chrome.content styleeditor');

// 		// init container
// 		this._initContainer();

// 		// init layout
// 		this._initLayout();

// 		// add events
// 		this.addEvents();
// 	},


// 	_initContainer : function () {

// 		console.log('iniit styhle editor layout');

// 		// create container
// 		this._container = Wu.DomUtil.create('div', 'chrome chrome-content styleeditor', this.options.appendTo);

// 	},

// 	_initLayout : function () {

// 		// header
// 		this._header = Wu.DomUtil.create('div', 'chrome chrome-content styleditor header', this._container);
// 		this._title = Wu.DomUtil.create('div', 'chrome chrome-content styleditor title', this._header, 'Style Editor');
// 		this._subtitle = Wu.DomUtil.create('div', 'chrome chrome-content styleditor subtitle', this._header, 'One-click magic below');

// 		// content, tabs
// 		this._content = Wu.DomUtil.create('div', 'chrome chrome-content styleditor content', this._container);
// 		this._tabsContainer = Wu.DomUtil.create('div', 'chrome chrome-content styleditor tabs-container', this._content);
// 		this._tabsContent = Wu.DomUtil.create('div', 'chrome chrome-content styleditor tabs-content', this._content);

// 		// tabs
// 		this._tabs = {};
// 		this._tabs.presets = Wu.DomUtil.create('div', 'chrome chrome-content styleditor tab fullauto', this._tabsContainer, 'Presets');
// 		this._tabs.carto = Wu.DomUtil.create('div', 'chrome chrome-content styleditor tab cartocss', this._tabsContainer, 'CartoCSS');
// 		this._tabs.sql = Wu.DomUtil.create('div', 'chrome chrome-content styleditor tab sql', this._tabsContainer, 'SQL');
		
// 		// tab content
// 		this._tabContent = {};
// 		this._tabContent.presets = this._createPresets();
// 		this._tabContent.carto = this._createCarto();
// 		this._tabContent.sql = this._createSql();

// 		// default open
// 		this._openPresets();
// 	},

// 	addEvents : function () {

// 		// click events on tabs
// 		Wu.DomEvent.on(this._tabs.presets, 'click', this._openPresets, this);
// 		Wu.DomEvent.on(this._tabs.carto,'click', this._openCarto, this);
// 		Wu.DomEvent.on(this._tabs.sql,  'click', this._openSql, this);
// 	},

// 	_layerEnabled 	 : function (layer) {
// 		console.log('alyer enabled!', layer);

// 		// if (this._layer) {
// 		// 	this._layer = layer;
// 		// }

// 		this._layer = layer;
// 	},



// 	_defaultPresets : {

// 		// sar data
// 		sar : {

// 			markers : {

// 				opacity : {
// 					column : 'coherence',
// 					range : [0, 1] 		// last number = opacity: 1
// 				},

// 				size : {
// 					column : 'vel',
// 					range : [0, -100]
// 				},

// 				color : {
// 					column : 'vel',
// 					scale : []
// 				}
// 			},

// 		}
// 	},

// 	_scales : {

// 	},


// 	_createPresets : function () {


// 		var presets = {};

// 		presets._container = Wu.DomUtil.create('div', 'chrome chrome-content styleeditor tab-content presets', this._tabsContent, 'tab auto');

// 		presets._content = Wu.DomUtil.create('div', 'presets-wrapper', presets._container)

// 		// presets:
// 		presets._presets = {};



// 		// 1. default
// 		presets._presets.default = {};
// 		presets._presets.default._container = Wu.DomUtil.create('div', 'presets-container default', presets._content);
// 		var image = Wu.DomUtil.create('div', 'presets-container-image default', presets._presets.default._container);
// 		var title = Wu.DomUtil.create('div', 'presets-container-title default', presets._presets.default._container, 'default');

// 		// event
// 		Wu.DomEvent.on(presets._presets.default._container, 'click', function () {
// 			console.log('def click');
// 		}, this);




// 		// 2. cloropleth
// 		presets._presets.cloropleth = {};
// 		presets._presets.cloropleth._container = Wu.DomUtil.create('div', 'presets-container cloropleth', presets._content);
// 		var image = Wu.DomUtil.create('div', 'presets-container-image cloropleth', presets._presets.cloropleth._container);
// 		var title = Wu.DomUtil.create('div', 'presets-container-title cloropleth', presets._presets.cloropleth._container, 'CLOROPLETH');

// 		// event
// 		Wu.DomEvent.on(presets._presets.cloropleth._container, 'click', function () {
// 			console.log('cloro click');
// 		}, this);





// 		this._selectors = [];

// 		// default values
// 		var selector_1 = {
// 			column : 'vel', // ie. for color
// 			color : 'red-to-green',

// 			marker_width : 'vel',
// 			marker_zoom_scale : true,
// 			opacity : 'coherence'
// 		};

// 		this._selectors.push(selector_1);


// 		var dummyColumns = [
// 			{
// 				text : 'coherence', 
// 			},
// 			{
// 				text : 'vel', 
// 			},
// 			{
// 				text : 'height', 
// 			},
// 			{
// 				text : 'north', 
// 			},
// 		];


// 		// selectors
// 		var selectors_wrapper = Wu.DomUtil.create('div', 'selectors-wrapper', presets._container);

// 		// column selector
// 		var column_selector = Wu.DomUtil.create('div', 'styleeditor selector-wrapper column', selectors_wrapper);
// 		var column_text = Wu.DomUtil.create('div', 'styleeditor selector-text column', column_selector, 'Column');
// 		var dropdown = Wu.DomUtil.create('select', 'styleeditor dropdown', column_selector);
		
// 		dummyColumns.forEach(function (d) {
// 			var op = new Option();
// 			op.value = d.text;
// 			op.text = d.text;
// 			dropdown.options.add(op);  
// 		});

// 		// todo: select default value


// 		Wu.DomEvent.on(dropdown, 'change', function (s) { // todo: this leaks!
// 			console.log('select!', s);
// 			var i = s.target.options.selectedIndex;
// 			console.log('s.valu', i); 
// 			var value = s.target.options[s.target.selectedIndex].value;
// 			console.log('value: ', value); // ok

// 			selector_1.column = value;

// 			this._renderPreset();

// 		}, this);


// 		var dummyColors = [
// 			{
// 				text : 'red-to-green',
// 			},
// 			{
// 				text : 'green-to-blue',
// 			}
// 		]


// 		// color ramp selector
// 		// column selector
// 		var color_selector = Wu.DomUtil.create('div', 'styleeditor selector-wrapper color', selectors_wrapper);
// 		var color_text = Wu.DomUtil.create('div', 'styleeditor selector-text color', color_selector, 'Color ramp');
// 		var dropdown2 = Wu.DomUtil.create('select', 'styleeditor dropdown', color_selector);
		
// 		dummyColors.forEach(function (d) {
// 			var op = new Option();
// 			op.value = d.text;
// 			op.text = d.text;
// 			dropdown2.options.add(op);  
// 		});

// 		Wu.DomEvent.on(dropdown2, 'change', function (s) { // todo: this leaks!
// 			console.log('selectcolor!', s);
// 			var i = s.target.options.selectedIndex;
// 			console.log('s.valu c', i); 
// 			var value = s.target.options[s.target.selectedIndex].value;
// 			console.log('value c: ', value); // ok

// 			selector_1.color = value;

// 			this._renderPreset();
// 		}, this);
		  


// 		var dummyMarkerwidth = [
// 			1, 2, 3, 4, 5, 6, 7, 'vel', 'coherence', 'height'
// 		]



// 		// marker width selector
// 		var mwidth_selector = Wu.DomUtil.create('div', 'styleeditor selector-wrapper marker-width', selectors_wrapper);
// 		var color_text = Wu.DomUtil.create('div', 'styleeditor selector-text marker-width', mwidth_selector, 'Marker width');
// 		var dropdown3 = Wu.DomUtil.create('select', 'styleeditor dropdown', mwidth_selector);
		
// 		dummyMarkerwidth.forEach(function (d) {
// 			var op = new Option();
// 			op.value = d;
// 			op.text = d;
// 			dropdown3.options.add(op);  
// 		});

// 		Wu.DomEvent.on(dropdown3, 'change', function (s) { // todo: this leaks!
// 			console.log('selectcolor!', s);
// 			var i = s.target.options.selectedIndex;
// 			console.log('s.valu c', i); 
// 			var value = s.target.options[s.target.selectedIndex].value;
// 			console.log('value c: ', value); // ok

// 			selector_1.marker_width = value;

// 			this._renderPreset();
// 		}, this);








// 		// marker width zoom scale checkbox
// 		var mscale_selector = Wu.DomUtil.create('div', 'styleeditor selector-wrapper marker-width', selectors_wrapper);
// 		var color_text = Wu.DomUtil.create('div', 'styleeditor selector-text marker-width', mscale_selector, 'Scale marker width to zoom?');

// 		// scale marker width to zoom
// 		var checkbox = document.createElement('input');
// 		checkbox.type = "checkbox";
// 		checkbox.name = "checkbox-marker-width-scale";
// 		checkbox.value = "checkbox-marker-width-scale";
// 		checkbox.id = "checkbox-marker-width-scale";

// 		mscale_selector.appendChild(checkbox);

// 		Wu.DomEvent.on(checkbox, 'click', function () {
// 			var value = checkbox.checked;
// 			console.log('checkbox clicked!', value); // true/false

// 			selector_1.marker_zoom_scale = value;

// 			this._renderPreset();

// 		}, this);











// 		// opacity selector
// 		var opacity_selector = Wu.DomUtil.create('div', 'styleeditor selector-wrapper marker-width', selectors_wrapper);
// 		var color_text = Wu.DomUtil.create('div', 'styleeditor selector-text marker-width', opacity_selector, 'Marker opacity');
// 		var dropdown4 = Wu.DomUtil.create('select', 'styleeditor dropdown', opacity_selector);
		
// 		dummyMarkerwidth.forEach(function (d) {
// 			var op = new Option();
// 			op.value = d;
// 			op.text = d;
// 			dropdown4.options.add(op);  
// 		});

// 		Wu.DomEvent.on(dropdown4, 'change', function (s) { // todo: this leaks!
// 			console.log('selectcolor!', s);
// 			var i = s.target.options.selectedIndex;
// 			console.log('s.valu c', i); 
// 			var value = s.target.options[s.target.selectedIndex].value;
// 			console.log('value c: ', value); // ok

// 			selector_1.opacity = value;

// 			this._renderPreset();
// 		}, this);



// 		// // create dropdown
// 		// var dropdown = this._createDropdown({
// 		// 	clickFn : function (entry) {
// 		// 		console.log('you cliked -> entry', entry);
// 		// 	},

// 		// 	title : 'Column',

// 		// 	entries : [
// 		// 		{
// 		// 			text : 'Entry1',
// 		// 		},
// 		// 		{
// 		// 			text : 'Entry2',
// 		// 		},
// 		// 		{
// 		// 			text : 'Entry3',
// 		// 		},
// 		// 		{
// 		// 			text : 'Entry4',
// 		// 		}
// 		// 	],

// 		// 	appendTo : selectors_wrapper
// 		// });







// 		// abilities:
// 		//
// 		// 	set opacity by [vel] (ie. [column])	
// 		// 	set color scale by [column]
// 		// 	set marker size by [column]

// 		// 	vars needed (markers):
// 		//	@width_value -> base value, will be multiplied by zoom level factor 


// 		// @width_value : 1;

// 		// [zoom<13] {
// 		//     marker-width: @width_value * 0.5;
// 		// }
// 		// [zoom=13] {
// 		//   marker-width: @width_value * 1;
// 		// }
// 		// [zoom=14] {
// 		//   marker-width: @width_value * 2;
// 		// }
// 		// [zoom=15] {
// 		//     marker-width: @width_value * 4;
// 		// }
// 		// [zoom=16] {
// 		//     marker-width: @width_value * 8;
// 		// }
// 		// [zoom=17] {
// 		//     marker-width: @width_value * 12;
// 		// }
// 		// [zoom=18] {
// 		//     marker-width: @width_value * 20;
// 		// }
// 		// [zoom>18] {
// 		//     marker-width: @width_value * 24;
// 		// }
// 		// 


// 		// scale - for å lage steps
// 		// // #################################################
// 		// // scale calcs per [var]
// 		// // todo: insert max, min from meta
// 		// // --
// 		// // scale by velocity
// 		// @scale_column_vel : [vel];
// 		// @scale_max_vel : -50; // height_max
// 		// @scale_min_vel : -200;  // height_min

// 		// // calc steps velocity, n steps
// 		// @delta_vel   : (@scale_max_vel - @scale_min_vel)/10;
// 		// @step_1_vel  : @scale_min_vel;
// 		// @step_2_vel  : @scale_min_vel + @delta_vel;
// 		// @step_3_vel  : @scale_min_vel + (@delta_vel * 2);
// 		// @step_4_vel  : @scale_min_vel + (@delta_vel * 3);
// 		// @step_5_vel  : @scale_min_vel + (@delta_vel * 4);
// 		// @step_6_vel  : @scale_min_vel + (@delta_vel * 5);
// 		// @step_7_vel  : @scale_min_vel + (@delta_vel * 6);
// 		// @step_8_vel  : @scale_min_vel + (@delta_vel * 7);
// 		// @step_9_vel  : @scale_min_vel + (@delta_vel * 8);
// 		// @step_10_vel : @scale_min_vel + (@delta_vel * 9);
// 		// // ####################################################




// 		// // color scale
// 		// @color_1_vel :  #2f00ff;
// 		// @color_2_vel :  #003dff;
// 		// @color_3_vel :  #009eff;
// 		// @color_4_vel :  #00ffdf;
// 		// @color_5_vel :  #00ffa9;
// 		// @color_6_vel :  #a5ff00;
// 		// @color_7_vel :  #ffd700;
// 		// @color_8_vel :  #ff8100;
// 		// @color_9_vel :  #ff3600;
// 		// @color_10_vel :  #ff0000;






// 		// // ####################################   må ligge i Layer {}
// 		//   // SCALE TEMPLATE, per [var]
// 		//   // ..
// 		//   // color
// 		//   [@scale_column_vel < @step_2_vel] {
// 		//       marker-fill: @color_1_vel;
// 		//   }

// 		//   [@scale_column_vel > @step_2_vel][@scale_column_vel < @step_3_vel] {
// 		//       marker-fill: @color_2_vel;
// 		//   }

// 		//    [@scale_column_vel > @step_3_vel][@scale_column_vel < @step_4_vel] {
// 		//       marker-fill: @color_3_vel;
// 		//   }

// 		//    [@scale_column_vel > @step_4_vel][@scale_column_vel < @step_5_vel] {
// 		//       marker-fill: @color_4_vel;
// 		//   }

// 		//    [@scale_column_vel > @step_5_vel][@scale_column_vel < @step_6_vel] {
// 		//       marker-fill: @color_5_vel;
// 		//   }

// 		//    [@scale_column_vel > @step_6_vel][@scale_column_vel < @step_7_vel] {
// 		//       marker-fill: @color_6_vel
// 		//   }

// 		//    [@scale_column_vel > @step_7_vel][@scale_column_vel < @step_8_vel] {
// 		//       marker-fill: @color_7_vel;
// 		//   }

// 		//    [@scale_column_vel > @step_8_vel][@scale_column_vel < @step_9_vel] {
// 		//       marker-fill: @color_8_vel;
// 		//   }

// 		//    [@scale_column_vel > @step_9_vel][@scale_column_vel < @step_10_vel] {
// 		//       marker-fill: @color_9_vel;
// 		//   }

// 		//    [@scale_column_vel > @step_10_vel] {
// 		//       marker-fill: @color_10_vel;
// 		//   }
// 		//   // ############################################################


// 		return presets;
// 	},


// 	_renderPreset : function () {

// 		console.log('_rendeRPRes', this._selectors);

// 	},



// 	_createCarto : function () {

// 		var carto = {}

// 		carto._container = Wu.DomUtil.create('div', 'chrome chrome-content styleeditor tab-content cartocss', this._tabsContent, 'tab carto');
	
// 		carto._input = Wu.DomUtil.create('input', 'chrome chrome-content styleditor cartoss inputarea', carto._container);

// 		// create codemirror (overkill?)
// 		carto._codeMirror = CodeMirror.fromTextArea(carto._input, {
//     			lineNumbers: true,    			
//     			matchBrackets: true,
//     			lineWrapping: true,
//     			paletteHints : true,
//     			gutters: ['CodeMirror-linenumbers', 'errors'],
//     			mode: {
//     				name : 'carto',
//     				reference : window.cartoRef
//     			},
//   		});

// 		// debug
//   		carto._codeMirror.setValue('asdlkmasdl');


//   		// debug button
//   		var button = Wu.DomUtil.create('div', 'debug-button', carto._container, 'Render style');
//   		button.onclick = function () {
//   			console.log('render sytle!');
//   		}

// 		return carto;
// 	},

// 	_createSql : function () {

// 		var sql = {}
// 		sql._container = Wu.DomUtil.create('div', 'chrome chrome-content styleeditor tab-content sql', this._tabsContent, 'tab sql');
		
// 		sql._input = Wu.DomUtil.create('textarea', 'chrome chrome-content styleeditor tab-content sql-input', sql._container);
// 		sql._input.placeholder = 'Insert your SQL statement (using table as magic keyword)';


// 		return sql;
// 	},

// 	_openPresets : function () {
		
// 		// reset
// 		this._closeAllTabs();

// 		// open this
// 		Wu.DomUtil.addClass(this._tabs.presets, 'open');

// 		// add content
// 		this._tabContent.presets._container.style.display = 'block';

// 		// add subtitle
// 		this._subtitle.innerHTML = 'One-click magick'
// 	},

// 	_openCarto : function () {
		
// 		// reset
// 		this._closeAllTabs();

// 		// open this
// 		Wu.DomUtil.addClass(this._tabs.carto, 'open');

// 		// add content
// 		this._tabContent.carto._container.style.display = 'block';

// 		// add subtitle
// 		this._subtitle.innerHTML = 'Manually edit CartoCSS'
// 	},

// 	_openSql : function () {
		
// 		// reset
// 		this._closeAllTabs();

// 		// open this
// 		Wu.DomUtil.addClass(this._tabs.sql, 'open');

// 		// show content
// 		this._tabContent.sql._container.style.display = 'block';

// 		// add subtitle
// 		this._subtitle.innerHTML = 'Query your data with SQL'
// 	},

// 	_closeAllTabs : function () {
// 		// unselect all tabs
// 		for (var t in this._tabs) {
// 			Wu.DomUtil.removeClass(this._tabs[t], 'open');
// 		}

// 		// hide all content
// 		for (var t in this._tabContent) {
// 			this._tabContent[t]._container.style.display = 'none';
// 		}
// 	},


// 	show : function () {

// 	},

// 	hide : function () {

// 	},


// });














