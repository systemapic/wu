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
		console.log('create image');

		var that = this;	// callback
		app.setHash(function (context, hash) {
			console.log('hash: ', hash);

			// create image container
			that._createImageView();

		

			// get snapshot from server
			Wu.post('/api/util/snapshot', hash, that.createdImage, this);

		});
		
	},

	createdImage : function (context, file) {
		console.log('took screenshot', file);
		var url = file.url;
		this._imageContainer.style.backgroundImage = 'url("' + url + '")';
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

	},

	_createLinkView : function (hash) {

		var url = app.options.servers.portal + hash.id;

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
		console.log('create print');
	},

	createLink : function () {
		console.log('create link');

		var hash = app.setHash();
		console.log('hash: ', hash);

		// open input box
		this._createLinkView(hash);
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

	},


	enableSocial : function () {
		console.log('enableSocial');
	},

	disableSocial : function () {
		console.log('enableSocial2');
	},

	enableScreenshot : function () {
		console.log('enableSocial3');
	},

	disableScreenshot : function () {
		console.log('enableSocial4');
	},



});


