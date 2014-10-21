Wu.SidePane.Share = Wu.SidePane.Item.extend({
	
	type : 'share',
	title : 'Share',


	initContent : function () {

		// create layout
		this.initLayout();
	},


	update : function () {

		// clear
		this.reset();

		// set project
		this.project = app.activeProject;

		// create screenshot divs
		if (this.options.panes.share && this.project.getSettings().share) this.initLayout();

		// create layout
		this.initLayout();

		// add hooks
		this.addHooks();

	},

	addHooks : function () {

		// clear hooks
		this.removeHooks();

		// add hooks
		Wu.DomEvent.on(this.imageButton, 'click', this.createImage, this);
		Wu.DomEvent.on(this.printButton, 'click', this.createPrint, this);
		Wu.DomEvent.on(this.linkButton, 'click', this.createLink, this);
	},

	removeHooks : function () {
		// remove hooks
		Wu.DomEvent.off(this.imageButton, 'click', this.createImage, this);
		Wu.DomEvent.off(this.printButton, 'click', this.createPrint, this);
		Wu.DomEvent.off(this.linkButton, 'click', this.createLink, this);
	},

	initLayout : function () {

		// wrapper
		var wrap 	 = Wu.DomUtil.create('div', 'share-wrapper', this._content),
		    sstitle 	 = Wu.DomUtil.create('div', 'share-header', wrap, 'Publish');

		// image
		this.imageButton = Wu.DomUtil.create('div', 'share-wrap image', wrap);
		var ssbox	 = Wu.DomUtil.create('div', 'share-icon-box image', this.imageButton),
		    ssbutton 	 = Wu.DomUtil.create('div', 'share-title image', this.imageButton, 'Image'),
		    ssdesc 	 = Wu.DomUtil.create('div', 'share-subtitle image', this.imageButton, 'Create snapshot of map');

		// print
		this.printButton = Wu.DomUtil.create('div', 'share-wrap print', wrap);
		var pbox	 = Wu.DomUtil.create('div', 'share-icon-box print', this.printButton),
		    pbutton 	 = Wu.DomUtil.create('div', 'share-title print', this.printButton, 'PDF'),
		    pdesc 	 = Wu.DomUtil.create('div', 'share-subtitle print', this.printButton, 'Create printable map');

		// link
		this.linkButton  = Wu.DomUtil.create('div', 'share-wrap link', wrap);
		var lbox	 = Wu.DomUtil.create('div', 'share-icon-box link', this.linkButton),
		    lbutton 	 = Wu.DomUtil.create('div', 'share-title link', this.linkButton, 'Link'),
		    ldesc 	 = Wu.DomUtil.create('div', 'share-subtitle link', this.linkButton, 'Create share link');

		
	},

	createImage : function () {

		var that = this;	// callback
		app.setHash(function (ctx, hash) {

			// create image container
			that._createImageView();

			// get snapshot from server
			Wu.post('/api/util/snapshot', hash, that.createdImage, that);

		});

		// set progress bar for a 5sec run
		app.ProgressBar.timedProgress(5000);
		
	},

	createdImage : function (context, file) {

		// parse results
		var result = JSON.parse(file);
		var image = result.image;

		// get dimensions of container
		var height = context._imageContainer.offsetHeight;
		var width = context._imageContainer.offsetWidth;

		// set path
		var path = app.options.servers.portal;
		path += 'pixels/';
		path += image;
		var raw = path;
		path += '?width=' + width;
		path += '&height=' + height;

		// set url
		var url = 'url("';
		url += path;
		url += '")';

		// set image
		context._imageContainer.style.backgroundImage = url;

		
		// set download link
		raw += '?raw=true'; // add raw to path
		context._downloadButton.href = raw;
	},

	_createImageView : function () {

		// expand container
		this._resetExpands();
		Wu.DomUtil.addClass(this._content, 'expand-share-image');

		// create image container 
		this._imageWrap = Wu.DomUtil.create('div', 'share-image-wrap', this._content);

		// create title
		var title = Wu.DomUtil.create('div', 'share-image-title', this._imageWrap, 'Created image:');

		// create image container
		this._imageContainer = Wu.DomUtil.create('div', 'share-image-image', this._imageWrap);

		// create meta information
		var meta = Wu.DomUtil.create('div', 'share-image-meta-wrap', this._imageWrap);
		var size = Wu.DomUtil.create('div', 'share-image-meta-size', meta);
		var name = Wu.DomUtil.create('div', 'share-image-meta-name', meta);

		var downloadWrapper = Wu.DomUtil.create('div', 'share-image-download', this._imageWrap);
		this._downloadButton = Wu.DomUtil.create('a', 'share-image-download-button', downloadWrapper, 'Download');
		this._downloadButton.setAttribute('target', '_blank');

	},

	createLink : function () {

		// create hash, callback
		var that = this;
		app.setHash(function (context, hash) {

			// open input box
			that._createLinkView(hash);

		});
		
	},

	_createLinkView : function (result) {

		var parsed 	= JSON.parse(result);
		var hash 	= parsed.hash;
		var project 	= app.Projects[hash.project];
		var slugs 	= project.getSlugs();
		var url 	= app.options.servers.portal + slugs.client + '/' + slugs.project + '/' + hash.id;

		// remove previous expands
		this._resetExpands();

		// create wrapper
		this._inputWrap = Wu.DomUtil.create('div', 'share-link-wrap', this._content);

		// create title
		var title = Wu.DomUtil.create('div', 'share-link-title', this._inputWrap, 'Share this link:')

		// create input box
		var input = Wu.DomUtil.create('input', 'share-link-input', this._inputWrap);
		input.value = url;

		// select all on focus
		Wu.DomEvent.on(input, 'click', function () {
			input.setSelectionRange(0, input.value.length);
		}, this);

		// expand container
		Wu.DomUtil.addClass(this._content, 'expand-share-link');

	},

	createPrint : function () {

		var that = this;	// callback
		app.setHash(function (ctx, hash) {

			// get snapshot from server
			Wu.post('/api/util/pdfsnapshot', hash, that.createdPrint, that);

		});

		// set progress bar for a 5sec run
		app.ProgressBar.timedProgress(5000);
	},

	createdPrint : function (context, file) {

		// parse results
		var result = JSON.parse(file);
		var pdf = result.pdf;

		// set path for zip file
		var path = '/api/file/download?file=' + pdf + '&type=file';
		
		// create print view
		context._createPrintView(path);
	},

	_createPrintView : function (path) {

		// remove previous expands
		this._resetExpands();

		// create wrapper
		this._inputWrap = Wu.DomUtil.create('div', 'share-link-wrap', this._content);

		// create title
		var title = Wu.DomUtil.create('div', 'share-link-title', this._inputWrap, 'Download the PDF:')

		// create download button
		var downloadWrapper = Wu.DomUtil.create('div', 'share-print-download', this._inputWrap);
		this._pdfDownloadButton = Wu.DomUtil.create('a', 'share-print-download-button', downloadWrapper, 'Download');
		this._pdfDownloadButton.setAttribute('href', path);

		// expand container
		Wu.DomUtil.addClass(this._content, 'expand-share-link');

	},


	

	_resetExpands : function () {

		if (this._inputWrap) Wu.DomUtil.remove(this._inputWrap);
		if (this._imageWrap) Wu.DomUtil.remove(this._imageWrap);
		if (this._printWrap) Wu.DomUtil.remove(this._printWrap);

		Wu.DomUtil.removeClass(this._content, 'expand-share-link');
		Wu.DomUtil.removeClass(this._content, 'expand-share-image');
		Wu.DomUtil.removeClass(this._content, 'expand-share-print');
	},

	reset : function () {

		// remove hooks
		this.removeHooks();

		// clear content
		this._content.innerHTML = '';

		// reset expands
		this._resetExpands();

	},

	_activate : function () {
		// console.log('_activate s');
	},

	_deactivate : function () {
		// console.log('_deactivate s');
		// reset expands
		this._resetExpands();
	},


	enableSocial : function () {
		// console.log('enableSocial');
	},

	disableSocial : function () {
		// console.log('enableSocial2');
	},

	enableScreenshot : function () {
		// console.log('enableSocial3');
	},

	disableScreenshot : function () {
		// console.log('enableSocial4');
	},



});


