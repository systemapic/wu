Wu.Share = Wu.Pane.extend({
	
	type : 'share',
	title : 'Share',

	initialize : function (options) {

		// set options
		Wu.setOptions(this, options);

		// init container
		this._initContent();
		
		// listen up (events on parent)
		this._listen();
	},      

	_initContent : function () {

		// create layout
		this._initLayout();

		// put button in top chrome
		this._registerButton();
	},

	_initLayout : function () {

		// create dropdown
		this._shareDropdown = Wu.DomUtil.create('div', 'share-dropdown displayNone', app._appPane);

		// items
		this._shareImageButton = Wu.DomUtil.create('div', 'share-item', this._shareDropdown, 'Share Image');
		this._sharePrintButton = Wu.DomUtil.create('div', 'share-item', this._shareDropdown, 'Share PDF');
		this._shareLinkButton  = Wu.DomUtil.create('div', 'share-item', this._shareDropdown, 'Share link');

		Wu.DomEvent.on(this._shareImageButton, 'click', this._shareImage, this);
		Wu.DomEvent.on(this._sharePrintButton, 'click', this._sharePrint, this);
		Wu.DomEvent.on(this._shareLinkButton,  'click', this._shareLink, this);
	},

	_registerButton : function () {

		// register button in top chrome
		console.log('share _registerButton');

		// where
		var top = app.Chrome.Top;

		// add a button to top chrome
		this._shareButton = top._registerButton({
			name : 'share',
			className : 'chrome-button share',
			trigger : this._togglePane,
			context : this
		});
	},

	_togglePane : function () {
		this._isOpen ? this._close() : this._open();
	},

	_open : function () {
		Wu.DomUtil.removeClass(this._shareDropdown, 'displayNone');
		this._isOpen = true;

		// add fullscreen click-ghost
		this._addGhost();

		// mark button active
		Wu.DomUtil.addClass(this._shareButton, 'active');
	},

	_close : function () {
		Wu.DomUtil.addClass(this._shareDropdown, 'displayNone');
		this._isOpen = false;

		// remove links if open
		if (this._shareLinkInput) Wu.DomUtil.remove(this._shareLinkInput);
		if (this._sharePDFInput) Wu.DomUtil.remove(this._sharePDFInput);

		// remove ghost
		this._removeGhost();

		// mark button inactive
		Wu.DomUtil.removeClass(this._shareButton, 'active');
	},

	_addGhost : function () {
		this._ghost = Wu.DomUtil.create('div', 'share-ghost', app._appPane);
		Wu.DomEvent.on(this._ghost, 'click', this._close, this);
	},

	_removeGhost : function () {
		Wu.DomEvent.off(this._ghost, 'click', this._close, this);
		Wu.DomUtil.remove(this._ghost);
	},

	// on select project
	_refresh : function () {
		console.log('share refresh');
	},

	_shareImage : function () {

		app.setHash(function (ctx, hash) {

			// get snapshot from server
			Wu.send('/api/util/snapshot', hash, function (a, b) {
				this._createdImage(a, b);
			}.bind(this), this);

		}.bind(this));

		// set progress bar for a 5sec run
		app.ProgressBar.timedProgress(5000);
	},

	_createdImage : function (context, file, c) {

		// parse results
		var result = Wu.parse(file);
		var image = result.image;
		var path = app.options.servers.portal;
		path += 'pixels/';
		path += image;
		path += '?raw=true'; // add raw to path
		path += '&access_token=' + app.tokens.access_token;

		// open (note: some browsers will block pop-ups. todo: test browsers!)
		window.open(path, 'mywindow')

		// close share dropdown
		this._close();

	},

	_shareLink : function () {

		// create hash, callback
		app.setHash(function (context, hash) {

			// open input box
			this._createLinkView(hash);

		}.bind(this));

	},

	_createLinkView : function (result) {

		var link = Wu.parse(result);
		var shareLink = window.location.href + '/' + link.hash.id;

		this._insertShareLink(shareLink);

	},

	_insertShareLink : function (url) {

		if (this._shareLinkInput) Wu.DomUtil.remove(this._shareLinkInput);

		// create input
		this._shareLinkInput = Wu.DomUtil.create('input', 'share-input');
		this._shareLinkInput.value = url;

		// add to dom
		this._shareDropdown.appendChild(this._shareLinkInput);

		// select content of input
		this._shareLinkInput.select();

	},

	_sharePrint : function () {

		var that = this;	// callback
		app.setHash(function (ctx, hash) {

			var h = JSON.parse(hash);
			h.hash.slug = app.activeProject.getName();
			var json = JSON.stringify(h); 

			// get snapshot from server
			Wu.post('/api/util/pdfsnapshot', json, that._createdPrint, that);

		});

		// set progress bar for a 5sec run
		app.ProgressBar.timedProgress(5000);
	},

	_createdPrint : function (context, file) {
		
		// parse results
		var result = JSON.parse(file);
		var pdf = result.pdf;

		// set path for zip file
		var path = app.options.servers.portal + 'api/file/download?file=' + pdf + '&type=pdf'+ '&access_token=' + app.tokens.access_token;

		// insert open pdf link
		context._insertPDFLink(path);

		app.ProgressBar.hideProgress();
	},

	_insertPDFLink : function (url) {

		if (this._sharePDFInput) Wu.DomUtil.remove(this._sharePDFInput);

		// create input
		this._sharePDFInput = Wu.DomUtil.create('a', 'share-link-pdf');
		this._sharePDFInput.href = url;
		this._sharePDFInput.target = '_blank';
		this._sharePDFInput.innerHTML = 'Open PDF';

		// add to dom
		this._shareDropdown.appendChild(this._sharePDFInput);

	},


});
