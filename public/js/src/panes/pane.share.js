Wu.Share = Wu.Pane.extend({
	
	type : 'share',
	title : 'Share',

	options : {
		permissions : [{
			title : 'View project',
			permission : 'read_project',
			checked : true,
			enabled : false
		},{
			title : 'Download data',
			permission : 'download_file',
			checked : false,
			enabled : true
		},{
			title : 'Invite others',
			permission : 'share_project',
			checked : true,
			enabled : true
		}]
	},

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
		this._shareImageButton = Wu.DomUtil.create('div', 'share-item', this._shareDropdown);
		this._sharePrintButton = Wu.DomUtil.create('div', 'share-item', this._shareDropdown);
		this._shareInviteButton  = Wu.DomUtil.create('div', 'share-item', this._shareDropdown);
		this._feedbackButton = Wu.DomUtil.create('div', 'share-item-processing', this._shareDropdown);

		// enter titles
		// this._fillTitles();

		// Print (PDF) – cog
		this._processingPrint = Wu.DomUtil.create('i', 'fa fa-cog', this._sharePrintButton);
		

		// events
		Wu.DomEvent.on(this._shareImageButton,  'click', this._shareImage, this);
		Wu.DomEvent.on(this._sharePrintButton,  'click', this._sharePrint, this);
	},

	_registerButton : function () {

		// register button in top chrome
		var top = app.Chrome.Top;

		// add a button to top chrome
		this._shareButton = top._registerButton({
			name : 'share',
			className : 'chrome-button share',
			trigger : this._togglePane,
			context : this,
			project_dependent : true
		});

		// share icon
		this._shareButton.innerHTML = '<i class="fa fa-paper-plane"></i>';
	},

	_togglePane : function () {
		this._isOpen ? this._close() : this._open();
	},

	_setFeedback : function (msg) {
		this._feedbackButton.innerHTML = msg;
		Wu.DomUtil.addClass(this._feedbackButton, 'invite-feedback-active');

	},

	_closeFeedback : function () {
		this._feedbackButton.innerHTML = '';
		Wu.DomUtil.removeClass(this._feedbackButton, 'invite-feedback-active');
	},

	_open : function () {

		// close other tabs
		Wu.Mixin.Events.fire('closeMenuTabs');

		Wu.DomUtil.removeClass(this._shareDropdown, 'displayNone');
		this._isOpen = true;

		// mark button active
		Wu.DomUtil.addClass(this._shareButton, 'active');

		// fill titles
		this._fillTitles();
	},

	_close : function () {
		Wu.DomUtil.addClass(this._shareDropdown, 'displayNone');
		this._isOpen = false;

		// remove links if open
		if (this._shareLinkWrapper) Wu.DomUtil.remove(this._shareLinkWrapper);
		if (this._sharePDFInput) Wu.DomUtil.remove(this._sharePDFInput);
		if (this._inviteWrapper) Wu.DomUtil.remove(this._inviteWrapper);
		
		this._shareInviteButton.innerHTML = 'Invite users...';
		Wu.DomUtil.removeClass(this._shareDropdown, 'wide-share');

		// mark button inactive
		Wu.DomUtil.removeClass(this._shareButton, 'active');

		// close feedback
		this._closeFeedback();
	},

	_onCloseMenuTabs : function () {
		this._close();
	},


	_fillTitles : function () {
		this._shareImageButton.innerHTML = 'Share Image';
		this._sharePrintButton.innerHTML = 'Share PDF';
		this._shareInviteButton.innerHTML = 'Invite to project';
	},

	_clearTitles : function () {
		this._shareImageButton.innerHTML = '';
		this._sharePrintButton.innerHTML = '';
		this._shareInviteButton.innerHTML = '';
	},

	_addGhost : function () {
		this._ghost = Wu.DomUtil.create('div', 'share-ghost', app._appPane);
		Wu.DomEvent.on(this._ghost, 'click', this._close, this);
	},

	_removeGhost : function () {
		if (!this._ghost) return; 
		Wu.DomEvent.off(this._ghost, 'click', this._close, this);
		Wu.DomUtil.remove(this._ghost);
	},

	// on select project
	_refresh : function () {

		var project = this._project;

		if (project.isShareable()) {
			Wu.DomUtil.removeClass(this._shareInviteButton, 'disabled');
			Wu.DomEvent.on(this._shareInviteButton, 'click', this._shareInvite, this);
		} else {
			Wu.DomUtil.addClass(this._shareInviteButton, 'disabled');
			Wu.DomEvent.off(this._shareInviteButton, 'click', this._shareInvite, this);
		}
		
	},

	_shareImage : function () {

		app.setHash(function (ctx, hash) {

			// get snapshot from server
			Wu.send('/api/util/snapshot', hash, function (a, b) {
				this._createdImage(a, b);
			}.bind(this), this);

		}.bind(this));

		// set progress bar for a 10sec run
		app.ProgressBar.timedProgress(10000);

		// set feedback
		this._setFeedback('Creating snapshot...');
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

		var project = app.activeProject;

		app.Analytics.onScreenshot({
			project_name : project.getName(),
			file_id : image
		});

		// set feedback
		this._setFeedback('Done!');

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

		// create wrapper
		this._shareLinkWrapper = Wu.DomUtil.create('div', 'share-link-wrapper');

		// title
		var titleDiv = Wu.DomUtil.create('div', 'share-copy-link-title', this._shareLinkWrapper, 'Copy sharelink:');

		// create input
		this._shareLinkInput = Wu.DomUtil.create('input', 'share-input', this._shareLinkWrapper);
		this._shareLinkInput.value = url;

		// add to dom
		this._shareDropdown.appendChild(this._shareLinkWrapper);

		// select content of input
		this._shareLinkInput.select();

		this._clearTitles();

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

		// xoxoxoxoxox
		// Wu.DomUtil.addClass('this._sharePrintButton', )
		


		// set progress bar for a 5sec run
		app.ProgressBar.timedProgress(10000);

		// set feedback
		this._setFeedback('Creating PDF...');
	},

	_createdPrint : function (context, file) {

		console.log('created print: ', file);
		
		// parse results
		var result = JSON.parse(file);
		var pdf = result.pdf;

		// set path for zip file
		var path = app.options.servers.portal + 'api/file/download?file=' + pdf + '&type=pdf'+ '&access_token=' + app.tokens.access_token;

		// insert open pdf link
		// context._insertPDFLink(path);

		// hide progress bar
		app.ProgressBar.hideProgress();

		// set feedback
		context._setFeedback('Done! <a href="' + path + '" target="_blank">Click here to download.</a>');
	},

	_insertPDFLink : function (url) {

		// remove old
		if (this._sharePDFInput) Wu.DomUtil.remove(this._sharePDFInput);

		// create input
		this._sharePDFInput = Wu.DomUtil.create('a', 'share-link-pdf');
		this._sharePDFInput.href = url;
		this._sharePDFInput.target = '_blank';
		this._sharePDFInput.innerHTML = 'Open PDF';

		// add to dom
		this._shareDropdown.appendChild(this._sharePDFInput);
	},


	_shareInvite : function () {

		app.Chrome.Left._tabs.projects.openShare()
		this._close();

	},

	_getPermissions : function () {
		var p = [];

		this._checkboxes.forEach(function (c) {
			var div = c._switch;
			var value = c.value;
			var checked = div.getAttribute('state');
			if (checked == 'true') p.push(value);
		});

		return p;
	},


	_getInviteLink : function (permissions, callback) {

		// get default permissions
		var plucked = _.pluck(_.where(this.options.permissions, { 'checked' : true }), 'permission');
		var permissions = permissions || plucked;

		var options = {
			project_id : this._project.getUuid(),
			project_name : this._project.getTitle(),
			access_type : 'view',
			permissions : permissions
		}

		// slack
		app.Analytics.onInvite(options);

		// get invite link
		Wu.post('/api/invite/link', JSON.stringify(options), callback);
	},


	_toggleInviteType : function () {

		var type = this._inviteTypeToggle.innerHTML;

		if (type == 'view') {
			this._inviteTypeToggle.innerHTML = 'edit';
		}

		if (type == 'edit') {
			this._inviteTypeToggle.innerHTML = 'view';
		}
	},

	

});
