Wu.SidePane.Share = Wu.SidePane.Item.extend({
	
	type : 'share',
	title : 'Share',


	initContent : function () {



	},


	update : function () {

		this.reset();

		this.project = app.activeProject;

		// create screenshot
		if (this.options.panes.share && this.project.getSettings().screenshot) this.layoutScreenshot();

		// create share buttons
		if (this.options.panes.share && this.project.getSettings().socialSharing) this.layoutShare();

		// add hooks
		this.addHooks();

	},

	addHooks : function () {

	},

	removeHooks : function () {

	},

	layoutScreenshot : function () {
		// create screenshot divs
		var sswrap = Wu.DomUtil.create('div', 'share-screenshot-wrapper', this._content),
		    sstitle = Wu.DomUtil.create('div', 'share-screenshot-title', sswrap, 'Screenshots'),
		    ssbutton = Wu.DomUtil.create('div', 'share-screenshot-button', sswrap, 'Download'),
		    pbutton = Wu.DomUtil.create('div', 'share-print-button', sswrap, 'Print');

		// add hooks
		Wu.DomEvent.on(ssbutton, 'click', this.takeScreenshot, this);
		Wu.DomEvent.on(pbutton, 'click', this.takePrint, this);
		
	},

	takeScreenshot : function () {
		console.log('take screenshot!');
		var hash = app.setHash();

		Wu.post('/api/util/screenshot', JSON.stringify(hash), this.tookScreenshot, this);
	},

	tookScreenshot : function (context, file) {
		console.log('took screenshot', file);
	},

	takePrint : function () {

	},

	layoutShare : function () {
		// todo: implement later
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


