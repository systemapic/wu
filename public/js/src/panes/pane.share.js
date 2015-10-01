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
			checked : true,
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



		// enter titles
		this._fillTitles();

		// events
		Wu.DomEvent.on(this._shareImageButton,  'click', this._shareImage, this);
		Wu.DomEvent.on(this._sharePrintButton,  'click', this._sharePrint, this);
		// Wu.DomEvent.on(this._shareInviteButton, 'click', this._shareInvite, this);
	},

	_registerButton : function () {

		// register button in top chrome
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

		// remove ghost
		this._removeGhost();

		// mark button inactive
		Wu.DomUtil.removeClass(this._shareButton, 'active');
	},

	_fillTitles : function () {
		this._shareImageButton.innerHTML = 'Share Image';
		this._sharePrintButton.innerHTML = 'Share PDF';
		this._shareInviteButton.innerHTML = 'Invite users...';
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
		Wu.DomEvent.off(this._ghost, 'click', this._close, this);
		Wu.DomUtil.remove(this._ghost);
	},

	// on select project
	_refresh : function () {

		// can share
		var canShare = app.access.to.share_project(this._project);

		if (!canShare) {
			Wu.DomUtil.addClass(this._shareInviteButton, 'disabled');
			Wu.DomEvent.off(this._shareInviteButton, 'click', this._shareInvite, this);
		} else {
			Wu.DomUtil.removeClass(this._shareInviteButton, 'disabled');
			Wu.DomEvent.on(this._shareInviteButton, 'click', this._shareInvite, this);
		}
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

		// hide progress bar
		app.ProgressBar.hideProgress();
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
		Wu.DomUtil.addClass(this._shareDropdown, 'wide-share');
		this._createInviteView();
	},

	_createInviteView : function () {

		// get invite link
		this._getInviteLink(['read_project', 'download_file', 'share_project'], function (ctx, link) {

			console.log('got ivnite link: ', ctx, link);
			console.log('projects?', this._project, app.activeProject);

			// clear other shares
			this._clearTitles();

			// clear old
			if (this._inviteOuterWrapper) Wu.DomUtil.remove(this._inviteOuterWrapper);

			// invite wrapper
			this._inviteOuterWrapper = Wu.DomUtil.create('div', 'share-invite-wrapper opacitizer', this._shareDropdown);
			this._inviteWrapper = Wu.DomUtil.create('div', 'share-invite-wrapper-inner', this._inviteOuterWrapper);

			// hide invite button
			this._shareInviteButton.innerHTML = '';

			// insert title
			this._insertInviteTitle(this._inviteWrapper, link);

		}.bind(this));
	},


	_insertInviteTitle : function (appendTo, link) {

		// wrap
		var titleWrap = Wu.DomUtil.create('div', 'share-invite-title-wrap', appendTo);

		// create first part of title
		var pre = Wu.DomUtil.create('div', 'share-invite-title', titleWrap);
		pre.innerHTML = 'Invite users to project:<br> <span style="font-weight: 900">' + this._project.getTitle() + '</span>';

		// create last part of title
		var post = Wu.DomUtil.create('div', 'share-invite-title-post', titleWrap);	 
		post.innerHTML = 'Invite users to this project by sending them this link:';		

		// link input
		this._createInviteLink(titleWrap, link)

		// permissions
		this._createPermissionsCheckboxes({
			appendTo : titleWrap,
		});
	},

	_createInviteLink : function (titleWrap, link) {
		var input = this._linkinput = Wu.DomUtil.create('input', 'share-invite-input-link', titleWrap);
		input.value = link;
		input.select();
	},

	_createPermissionsCheckboxes : function (options) {

		var container = options.appendTo;

		// wrapper
		var wrapper = Wu.DomUtil.create('div', 'invite-permissions-wrapper', container);

		// title
		var title = Wu.DomUtil.create('div', 'share-invite-permission-title', wrapper, 'Permissions granted:');

		// create checkboxes
		this._createCheckboxes(wrapper);
	},

	_createCheckboxes : function (wrapper) {
		this._checkboxes = [];
		var items = this.options.permissions;
		items.forEach(function (i) {
			var permission = i.permission;
			var title = i.title;
			this._createCheckbox(permission,  wrapper, title, i.checked, i.enabled);
		}, this);
	},

	_createCheckbox : function (id, container, title, checked, enabled) {

		// wrapper
		var w = Wu.DomUtil.create('div', 'invite-permissions-checkbox-wrap', container);


		var _switch = new Wu.button({
			id 	     : id,
			type 	     : 'switch',
			isOn 	     : checked,
			right 	     : false,
			disabled     : !enabled,
			appendTo     : w,
			fn 	     : this._checkboxChange,
			context      : this
		});

		// label
		var label = Wu.DomUtil.create('label', 'invite-permissions-label', w);
		label.htmlFor = id;
		label.appendChild(document.createTextNode(title));

		// add to list
		this._checkboxes.push(_switch);
	},

	_checkboxChange : function (e, on, context) {

		var checkbox = e.target;
		var checked = checkbox.getAttribute('checked');

		var permissions = context._getPermissions();

		// get invite link
		context._getInviteLink(permissions, function (ctx, link) {
			context._linkinput.value = link;
		}.bind(context));
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

		var permissions = permissions || ['read_project', 'download_file', 'share_project'];

		var options = {
			project_id : this._project.getUuid(),
			project_name : this._project.getTitle(),
			access_type : 'view',
			permissions : permissions
		}

		console.log('options', options);

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

	// _submittingInvite : function () {
	// 	console.log('submit invite!');

	// 	var emails = [];

	// 	this._inviteInputs.forEach(function (input) {
	// 		if (input.value) emails.push(input.value);
	// 	});


	// 	var access_type = 'view';
		
	// 	console.log('emails; ', emails, access_type);


	// 	var options = {
	// 		access_type : access_type,
	// 		emails : emails,
	// 		project_id : this._project.getUuid()
	// 	}

	// 	console.log('sending ivnite', options);

	// 	// send request to server
	// 	Wu.post('/api/user/invite', JSON.stringify(options), this._sentInvitations.bind(this), this);

	// },

	// _sentInvitations : function (ctx, results) {
	// 	console.log('_sentInvitations', results);


	// 	this._inviteWrapper.innerHTML = 'Invites sent!';

	// },

	// _createInviteInput : function () {

	// 	// max twenty inputs
	// 	if (this._inviteInputs.length > 20) {
	// 		this._removeInviteInputEvents();
	// 		return alert('You can only invite 20 at a time.');
	// 	}

	// 	// create input
	// 	var input = Wu.DomUtil.create('input', 'share-invite-input', this._inviteInputsWrapper);
	// 	input.setAttribute('placeHolder', 'Enter email...');
	// 	this._inviteInputs.push(input);

	// 	// refresh focus event
	// 	this._refreshInviteInputEvents();
	// },

	// _refreshInviteInputEvents : function () {

	// 	// remove previous events
	// 	this._removeInviteInputEvents();

	// 	// get last input
	// 	var i = this._inviteInputs.length - 1;
	// 	var input = this._inviteInputs[i];

	// 	// add event
	// 	Wu.DomEvent.on(input, 'focus', this._createInviteInput, this);
	// },

	// _removeInviteInputEvents : function () {

	// 	// remove all events
	// 	this._inviteInputs.forEach(function (input) {
	// 		Wu.DomEvent.off(input, 'focus', this._createInviteInput, this);
	// 	}.bind(this));

	// },


});
