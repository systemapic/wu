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
				text : 'CartoCSS'
			},
			sql : {
				enabled : true,
				text : 'SQL'
			},
		}
	},

	_initialize : function () {

		this._initContainer();

		this.initLayout();
	},

	_initContainer : function () {

		console.log('iniit styhle editor layout');

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

});


Wu.Chrome.Content.Styler = Wu.Chrome.Content.extend({

	_initialize : function () {

		console.log('chrome.content styleeditor');

		// init container
		this._initContainer();

		// init layout
		// this._initLayout();

		// add events
		this._addEvents();
	},


	_initContainer : function () {

		console.log('iniit styhle editor layout');

		// create container
		this._container = Wu.DomUtil.create('div', 'chrome chrome-content styler', this.options.appendTo);

	},

	_projectSelected : function (e) {
		var p = e.detail.projectUuid;
		if (!p) return;

		// set project
		this._project = app.activeProject = app.Projects[p];

		// refresh pane
		// this._refresh();
	},

	_initLayout : function () {
		if (!this._project) return;
  
		// active layer
		this._initLayout_activeLayers();

		// field


		// mark as inited
		this._inited = true;
	},

	_initLayout_activeLayers : function () {

		// active layer wrapper
		var activeLayerWrapper = Wu.DomUtil.create('div', 'chrome chrome-content styler-content active-layer wrapper', this._container);

		// title
		var title = Wu.DomUtil.create('div', 'chrome chrome-content active-layer title', this._container, 'Layer');

		// get layers
		var layers = this._project.getPostGISLayers();

		console.log('loyyasysysy', layers);

		// create select
		var selectWrap = Wu.DomUtil.create('div', 'chrome chrome-content active-layer select-wrap', this._container);
		var select = Wu.DomUtil.create('select', 'active-layer-select', selectWrap);

		// fill select options
		layers.forEach(function (layer) {
			var option = Wu.DomUtil.create('option', 'active-layer-option', select);
			option.value = layer.getUuid();
			option.innerHTML = layer.getTitle();
		});	

		// select event
		Wu.DomEvent.on(select, 'change', this._selectedActiveLayer, this); // todo: mem leak?

	},

	// event run when layer selected 
	_selectedActiveLayer : function (e) {
		var layerUuid = e.target.value;
		console.log('selected layer: ', layerUuid);

		var layer = this._project.getLayer(layerUuid);

		console.log('lyaer: ', layer);

		// get current style, return false if none
		var currentStyle = layer.getEditorStyle();

		console.log('currentStyle: ', currentStyle);
		
	},





});


Wu.Chrome.Content.Layers = Wu.Chrome.Content.extend({

	_initialize : function () {

		console.log('chrome.content layers');

		// init container
		this._initContainer();

		// init layout
		this._initLayout();

		// add events
		this._addEvents();
	},

	_initContainer : function () {

		// create container
		this._container = Wu.DomUtil.create('div', 'chrome chrome-content layers', this.options.appendTo);

	},

	_initLayout : function () {

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

		// init layout
		this._initLayout();

		// add events
		this._addEvents();
	},

	_initContainer : function () {

		// create container
		this._container = Wu.DomUtil.create('div', 'chrome chrome-content cartocss', this.options.appendTo);

	},

	_initLayout : function () {

	},

	open : function () {
		console.log('open!', this);
	}

});


Wu.Chrome.Content.Sql = Wu.Chrome.Content.extend({

	_initialize : function () {

		console.log('chrome.content sql');

		// init container
		this._initContainer();

		// init layout
		this._initLayout();

		// add events
		this._addEvents();
	},

	_initContainer : function () {

		// create container
		this._container = Wu.DomUtil.create('div', 'chrome chrome-content sql', this.options.appendTo);

	},

	_initLayout : function () {

	},


	open : function () {
		console.log('open!', this);
	}

});



Wu.Chrome.Content.Tooltip = Wu.Chrome.Content.extend({

	_initialize : function () {

		console.log('chrome.content tooltip');

		// init container
		this._initContainer();

		// init layout
		this._initLayout();

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














