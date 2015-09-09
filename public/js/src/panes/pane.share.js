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

		this._registerButton();

		// add hooks
		// this.addHooks();
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

		console.log('inited layout share', this._shareDropdown);

		// // wrapper
		// var wrap 	 = Wu.DomUtil.create('div', 'share-wrapper', this._content),
		//     sstitle 	 = Wu.DomUtil.create('div', 'share-header', wrap, 'Publish');

		// // image
		// this.imageButton = Wu.DomUtil.create('div', 'share-wrap image', wrap);
		// var ssbox	 = Wu.DomUtil.create('div', 'share-icon-box image', this.imageButton),
		//     ssbutton 	 = Wu.DomUtil.create('div', 'share-title image', this.imageButton, 'Image'),
		//     ssdesc 	 = Wu.DomUtil.create('div', 'share-subtitle image', this.imageButton, 'Create snapshot of map');

		// // print
		// this.printButton = Wu.DomUtil.create('div', 'share-wrap print', wrap);
		// var pbox	 = Wu.DomUtil.create('div', 'share-icon-box print', this.printButton),
		//     pbutton 	 = Wu.DomUtil.create('div', 'share-title print', this.printButton, 'PDF'),
		//     pdesc 	 = Wu.DomUtil.create('div', 'share-subtitle print', this.printButton, 'Create printable map');

		// // link
		// this.linkButton  = Wu.DomUtil.create('div', 'share-wrap link', wrap);
		// var lbox	 = Wu.DomUtil.create('div', 'share-icon-box link', this.linkButton),
		//     lbutton 	 = Wu.DomUtil.create('div', 'share-title link', this.linkButton, 'Link'),
		//     ldesc 	 = Wu.DomUtil.create('div', 'share-subtitle link', this.linkButton, 'Create share link');

		
	},

	_registerButton : function () {

		// register button in top chrome
		console.log('share _registerButton');

		// where
		var top = app.Chrome.Top;

		// add a button to top chrome
		top._registerButton({
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
	},

	_close : function () {
		Wu.DomUtil.addClass(this._shareDropdown, 'displayNone');
		this._isOpen = false;

		// remove ghost
		this._removeGhost();
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

		console.log('_shareIMage');

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

		console.log('result: ', result);


		// get dimensions of container
		// var height = this._imageContainer.offsetHeight;
		// var width = this._imageContainer.offsetWidth;

		// set path
		var path = app.options.servers.portal;
		path += 'pixels/';
		path += image;
		var raw = path;
		// path += '?width=' + width;
		// path += '&height=' + height;

		// set access token
		path += '&access_token=' + app.tokens.access_token;


		console.log('path: ', path);
		
		// set download link
		raw += '?raw=true'; // add raw to path

		// set access token
		raw += '&access_token=' + app.tokens.access_token;

		console.log('raw: ', raw);

		// open (note: some browsers will block pop-ups. todo: test browsers!)
		window.open(raw, 'mywindow')

		// close share dropdown
		this._close();

	},

	_shareLink : function () {

		console.log('_shraeLink');


		// create hash, callback
		app.setHash(function (context, hash) {

			// open input box
			this._createLinkView(hash);

		}.bind(this));

	},

	_createLinkView : function (result) {
		console.log('_createLinkView', result);

		var link = Wu.parse(result);

		console.log('link: ', link);

		var shareLink = window.location.href + '/' + link.hash.id;

		console.log('shareLink: ', shareLink);

		function copyToClipboard(text) {
		  window.prompt("Copy to clipboard: Ctrl+C, Enter", text);
		}

		copyToClipboard(shareLink);

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

		console.log('result', result);
		
		// set path for zip file
		var path = '/api/file/download?file=' + pdf + '&type=file'+ '&access_token=' + app.tokens.access_token;

		console.log('path: ', path);
		
		// open (note: some browsers will block pop-ups. todo: test browsers!)
		window.open(path, 'mywindow')

		// close share dropdown
		this._close();
	},

});
