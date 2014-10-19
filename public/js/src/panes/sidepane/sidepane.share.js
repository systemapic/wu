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


	// getHash : function (id) {

	// 	var json = {
	// 		projectUuid : this.project.getUuid(),
	// 		id : id
	// 	}

	// 	// get a saved setup - which layers are active, position, 
	// 	Wu.post('/api/project/hash/get', JSON.stringify(json), this.gotHash, this);
	// },

	// gotHash : function (context, hash) {
	// 	console.log('gotHash: ', hash, context);
	// },

	// setHash : function () {

	// 	// get active layers
	// 	var active = app.MapPane.getActiveLayers();
	// 	var layers = _.map(active, function (l) {
	// 		return l.item.uuid;
	// 	});


	// 	var json = {
	// 		projectUuid : this.project.getUuid(),
	// 		hash : {
	// 			id 	 : Wu.Util.createRandom(6),
	// 			position : app.MapPane.getPosition(),
	// 			layers 	 : layers 			// layermenuItem uuids, todo: order as z-index
	// 		}
	// 	}

	// 	console.log('hash:', json);


	// 	// save hash to server
	// 	Wu.post('/api/project/hash/set', JSON.stringify(json), this.satHash, this);

	// 	// return
	// 	return json.hash;

	// },

	// satHash : function (context, hash) {
	// 	console.log('satHash: ', JSON.parse(hash), context);
	// }


});


