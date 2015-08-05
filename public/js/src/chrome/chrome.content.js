Wu.Chrome.Content = Wu.Chrome.extend({


	_initialize : function () {

		console.log('chrome.content');

	},


	initLayout : function () {

	},

	show : function () {

	},

	hide : function () {

	},





});



Wu.Chrome.Content.StyleEditor = Wu.Chrome.Content.extend({

	_initialize : function () {

		console.log('chrome.content styleeditor');

		// init container
		this._initContainer();

		// init layout
		this._initLayout();

		// add events
		this.addEvents();
	},


	_initContainer : function () {

		console.log('iniit styhle editor layout');

		// create container
		this._container = Wu.DomUtil.create('div', 'chrome chrome-content styleeditor', this.options.appendTo);

	},

	_initLayout : function () {

		// header
		this._header = Wu.DomUtil.create('div', 'chrome chrome-content styleditor header', this._container);
		this._title = Wu.DomUtil.create('div', 'chrome chrome-content styleditor title', this._header, 'Style Editor');
		this._subtitle = Wu.DomUtil.create('div', 'chrome chrome-content styleditor subtitle', this._header, 'One-click magic below');

		// content, tabs
		this._content = Wu.DomUtil.create('div', 'chrome chrome-content styleditor content', this._container);
		this._tabsContainer = Wu.DomUtil.create('div', 'chrome chrome-content styleditor tabs', this._content);
		this._tabsContent = Wu.DomUtil.create('div', 'chrome chrome-content styleditor tabs', this._content);

		// tabs
		this._tabs = {};
		this._tabs.auto = Wu.DomUtil.create('div', 'chrome chrome-content styleditor tab fullauto', this._tabsContainer);
		this._tabs.carto = Wu.DomUtil.create('div', 'chrome chrome-content styleditor tab cartocss', this._tabsContainer);
		this._tabs.sql = Wu.DomUtil.create('div', 'chrome chrome-content styleditor tab sql', this._tabsContainer);
		
		// tab content
		this._tabContent = {};
		this._tabContent.auto = this._createAuto();
		this._tabContent.carto = this._createCarto();
		this._tabContent.sql = this._createSql();

		// default open
		this._openAuto();
	},

	addEvents : function () {

		// click events on tabs
		Wu.DomEvent.on(this._tabs.auto, 'click', this._openAuto, this);
		Wu.DomEvent.on(this._tabs.carto,'click', this._openCarto, this);
		Wu.DomEvent.on(this._tabs.sql,  'click', this._openSql, this);
	},

	_layerEnabled 	 : function (layer) {
		console.log('alyer enabled!', layer);

		if (this._layer) {
			this._layer = layer;
		}
	},

	_createAuto : function () {
		var container = Wu.DomUtil.create('div', 'chrome chrome-content styleeditor tab-content fullauto', this._tabsContent, 'tab auto');
			


		return container;
	},

	_createCarto : function () {
		var container = Wu.DomUtil.create('div', 'chrome chrome-content styleeditor tab-content cartocss', this._tabsContent, 'tab carto');
	
		var inputArea = Wu.DomUtil.create('input', 'chrome chrome-content styleditor cartoss inputarea', container);

		// create codemirror (overkill?)
		this._codeMirror = CodeMirror.fromTextArea(inputArea, {
    			lineNumbers: true,    			
    			matchBrackets: true,
    			lineWrapping: true,
    			paletteHints : true,
    			gutters: ['CodeMirror-linenumbers', 'errors'],
    			mode: {
    				name : 'carto',
    				reference : window.cartoRef
    			},
  		});

		// debug
  		this._codeMirror.setValue('asdlkmasdl');



		return container;
	},

	_createSql : function () {
		var container = Wu.DomUtil.create('div', 'chrome chrome-content styleeditor tab-content sql', this._tabsContent, 'tab sql');
		
		this._sqlInput = Wu.DomUtil.create('textarea', 'chrome chrome-content styleeditor tab-content sql-input', container);
		this._sqlInput.placeholder = 'Insert your SQL statement (using table as magic keyword)';


		return container;
	},

	_openAuto : function () {
		
		// reset
		this._closeAllTabs();

		// open this
		Wu.DomUtil.addClass(this._tabs.auto, 'open');

		// add content
		this._tabContent.auto.style.display = 'block';

		// add subtitle
		this._subtitle.innerHTML = 'One-click magick'
	},

	_openCarto : function () {
		
		// reset
		this._closeAllTabs();

		// open this
		Wu.DomUtil.addClass(this._tabs.carto, 'open');

		// add content
		this._tabContent.carto.style.display = 'block';

		// add subtitle
		this._subtitle.innerHTML = 'Manually edit CartoCSS'
	},

	_openSql : function () {
		
		// reset
		this._closeAllTabs();

		// open this
		Wu.DomUtil.addClass(this._tabs.sql, 'open');

		// show content
		this._tabContent.sql.style.display = 'block';

		// add subtitle
		this._subtitle.innerHTML = 'Query your data with SQL'
	},

	_closeAllTabs : function () {
		// unselect all tabs
		for (var t in this._tabs) {
			Wu.DomUtil.removeClass(this._tabs[t], 'open');
		}

		// hide all content
		for (var t in this._tabContent) {
			this._tabContent[t].style.display = 'none';
		}
	},


	show : function () {

	},

	hide : function () {

	},


});














