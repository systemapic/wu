Wu.Chrome.Users = Wu.Chrome.extend({

	_ : 'users', 

	options : {
		defaultWidth : 400
	},

	_initialize : function () {

		// init container
		this._initContainer();

		// init content
		this._initContent();

	},

	_initContainer : function () {
		this._container = Wu.DomUtil.create('div', 'chrome-left-section chrome-users', this.options.appendTo);
	},
	
	_initContent : function () {

		var usersContainer = Wu.DomUtil.create('div', 'chrome-left-container contacts', this._container);
		var usersTitle = Wu.DomUtil.create('div', 'chrome-left-title users-title', usersContainer, 'Contacts');
		var users = this.users = app.Users;

		// Define D3 container
		this.D3container = d3.select(usersContainer);
		
		this.openUserCard = false;

		// Init user list etc.
		this._refresh();

		// add invite
		this._inviteButton = Wu.DomUtil.create('div', 'chrome-left-invite-users', this._container, '+ Invite People');
		Wu.DomEvent.on(this._inviteButton, 'click', this._openInvite, this);

	},

	_createEmailInput : function (content) {

		var content = this._emailsWrapper;
		// email and + button

		var options = {
			label : 'Email Address',
			sublabel : 'Just write the damn address',
		}

		// label
		var invite_label = options.label;
		var name = Wu.DomUtil.create('div', 'smooth-fullscreen-name-label invite-emails', content, invite_label);
		
		// container
		var invite_container = Wu.DomUtil.create('div', 'invite-container narrow', content);
		
		var invite_inner = Wu.DomUtil.create('div', 'invite-inner', invite_container);
		var invite_input_container = Wu.DomUtil.create('div', 'invite-input-container', invite_inner);

		// input box
		var invite_input = Wu.DomUtil.create('input', 'invite-email-input-form', invite_input_container);
		invite_input.setAttribute('placeholder', 'name@domain.com')
		var invite_error = Wu.DomUtil.create('div', 'smooth-fullscreen-error-label', content);

		// remember
		this._emails.push({
			invite_input : invite_input,
			invite_error : invite_error
		});

	},

	_emails : [],

	_openInvite : function (e) {

		// stop propagation
		e && Wu.DomEvent.stop(e);
		
		// create fullscreen
		this._fullscreen = new Wu.Fullscreen({
			title : '<span style="font-weight:200;">Invite people to Systemapic</span>',
			innerClassName : 'smooth-fullscreen-inner invite',
		});

		// clear invitations
		this._access = {
			edit : [],
			read : []
		}
		this._emails = [];

		// shortcut
		var content = this._fullscreen._content;

		// personlized message
		var linkText = Wu.DomUtil.create('div', 'smooth-fullscreen-link-label', content, '<a id="share-link"><i class="fa fa-share-alt"></i> Get shareable link</a>');

		// emails wrapper
		this._emailsWrapper = Wu.DomUtil.create('div', 'invite-emails-wrapper', content);

		// create email input
		this._createEmailInput();

		// add another + button
		var addAnotherWrapper = Wu.DomUtil.create('div', 'invite-add-another-wrapper', content);
		var addAnotherBtn = Wu.DomUtil.create('div', 'smooth-fullscreen-name-label add-another-email', addAnotherWrapper, '+ Add another');
		Wu.DomEvent.on(addAnotherBtn, 'click', this._createEmailInput, this);

		// personlized message
		var emailMessageWrap = Wu.DomUtil.create('div', 'invite-email-message-wrap', content);
		var messageText = Wu.DomUtil.create('div', 'smooth-fullscreen-name-label add-message', emailMessageWrap, 'Make your invite more personal by adding a <a id="custom_message_btn">custom message</a>');
		var messageBtn = Wu.DomUtil.get('custom_message_btn');
		var messageBoxWrap = Wu.DomUtil.create('div', 'invite-custom-message-wrapper', emailMessageWrap);
		var messageBoxLabel = Wu.DomUtil.create('div', 'invite-custom-message-wrapper-label', messageBoxWrap, 'Custom Message'); 
		this._customMessage = Wu.DomUtil.create('textarea', 'invite-custom-message-wrapper-textarea', messageBoxWrap); 

		// event
		Wu.DomEvent.on(messageBtn, 'click', function () {
			Wu.DomUtil.addClass(emailMessageWrap, 'hideme');
			Wu.DomUtil.addClass(messageBoxWrap, 'showme');
			this._customMessage.focus();

		}, this);

		var toggles_wrapper = Wu.DomUtil.create('div', 'toggles-wrapper', content);

		// create invite input for projects
		this._createInviteInput({
			type : 'read',
			label : 'Invite people to view these projects <span class="optional-medium invite">(optional)</span>',
			content : toggles_wrapper,
			container : this._fullscreen._inner,
			sublabel : 'Users will get read-only access to these projects'
		});

		// create invite input
		this._createInviteInput({
			type : 'edit',
			label : 'Invite people to edit these projects <span class="optional-medium invite">(optional)</span>',
			content : toggles_wrapper,
			container : this._fullscreen._inner,
			sublabel : 'Users will get full edit access to these projects'
		});


		// save button
		var saveBtn = Wu.DomUtil.create('div', 'smooth-fullscreen-save invite', content, 'Send Invites');
		var save_message = Wu.DomUtil.create('div', 'invite-success-message', content, '');

		// save button trigger
		Wu.DomEvent.on(saveBtn, 'click', this._sendInvites, this);
		Wu.DomEvent.on(linkText, 'click', this._openLinkShare, this);

	},

	_openLinkShare : function (e) {

		// close prev fullscreen
		this._fullscreen.close();

		// stop propagation
		e && Wu.DomEvent.stop(e);
		
		// create fullscreen
		this._fullscreen = new Wu.Fullscreen({
			title : '<span style="font-weight:200;">Invite people to Systemapic</span>',
			innerClassName : 'smooth-fullscreen-inner invite',
		});

		// clear invitations
		this._access = {
			edit : [],
			read : []
		}

		// shortcut
		var content = this._fullscreen._content;

		// emails wrapper
		this._emailsWrapper = Wu.DomUtil.create('div', 'invite-emails-wrapper', content);

		// label
		var name = Wu.DomUtil.create('div', 'smooth-fullscreen-name-label invite-emails', content, 'Share this link');
		
		// input box
		var invite_container = Wu.DomUtil.create('div', 'invite-container narrow', content);
		var invite_inner = Wu.DomUtil.create('div', 'invite-inner', invite_container);
		var invite_input_container = Wu.DomUtil.create('div', 'invite-input-container', invite_inner);
		this._shareLinkInput = Wu.DomUtil.create('input', 'invite-email-input-form', invite_input_container);
		this._shareLinkInput.value = app.options.servers.portal + 'invite';
		this._inviteFeedback = Wu.DomUtil.create('div', 'smooth-fullscreen-feedback-label', content);

		var clipboardWrapper = Wu.DomUtil.create('div', 'clipboard-wrapper', invite_input_container);
		var clipboardBtn = Wu.DomUtil.create('div', 'clipboard-button', clipboardWrapper);
		clipboardBtn.innerHTML = '<i class="fa fa-clipboard"></i>';	

		// clipboard events
		Wu.DomEvent.on(clipboardWrapper, 'mousedown', this._removeClipFeedback, this);
		Wu.DomEvent.on(clipboardWrapper, 'mouseup', this._copypasted, this);

		var toggles_wrapper = Wu.DomUtil.create('div', 'toggles-wrapper', content);

		// create invite input for projects
		this._createInviteInput({
			type : 'read',
			label : 'Invite people to view these projects <span class="optional-medium invite">(optional)</span>',
			content : toggles_wrapper,
			container : this._fullscreen._inner,
			sublabel : 'Users will get read-only access to these projects',
			trigger : this._addedProject.bind(this)
		});

		// create invite input
		this._createInviteInput({
			type : 'edit',
			label : 'Invite people to edit these projects <span class="optional-medium invite">(optional)</span>',
			content : toggles_wrapper,
			container : this._fullscreen._inner,
			sublabel : 'Users will get full edit access to these projects',
			trigger : this._addedProject.bind(this)
		});

		// save button
		var closeBtn = Wu.DomUtil.create('div', 'smooth-fullscreen-save invite', content, 'Close');

		// select text on focus
		Wu.DomEvent.on(this._shareLinkInput, 'focus click', function () {
			this._shareLinkInput.select();
		}, this);

		// save button trigger
		Wu.DomEvent.on(closeBtn, 'click', this._fullscreen.close.bind(this._fullscreen), this);

		// create default link
		this._createShareableInvite();
	},

	_copypasted : function () {
		this._shareLinkInput.focus();
		this._shareLinkInput.select();
		var copied = document.execCommand('copy');
		var text = copied ? 'Link copied to the clipboard!' : 'Your browser doesn\'t support this. Please copy manually.'
		this._setClipFeedback(text);
	},

	_setClipFeedback : function (text) {
		this._inviteFeedback.innerHTML = text;
		this._inviteFeedback.style.opacity = 1;
	},

	_removeClipFeedback : function () {
		this._inviteFeedback.innerHTML = '';
		this._inviteFeedback.style.opacity = 0;
	},

	_addedProject : function (options) {

		this._createShareableInvite();

		this._removeClipFeedback();
	},

	_createShareableInvite : function () {

		var access = {
			edit : [],
			read: []
		}

		this._access.read.forEach(function (r) {
			access.read.push(r.project.getUuid());
		});
		this._access.edit.forEach(function (e) {
			access.edit.push(e.project.getUuid());
		});

		// this._access[options.type]
		var options = JSON.stringify({
			access : access
		});

		// create share link
		Wu.post('/api/invite/link', options, function (a, b) {
			this._shareLinkInput.value = b;
		}.bind(this), this);
	},

	// icon on user
	_inviteToProject : function (user, e) {

		// stop propagation
		e && Wu.DomEvent.stop(e);
		
		// create fullscreen
		this._fullscreen = new Wu.Fullscreen({
			title : '<span style="font-weight:200;">Invite ' + user.getFullName() + ' to projects</span>',
			innerClassName : 'smooth-fullscreen-inner invite',
		});

		// clear invitations
		this._access = {
			edit : [],
			read : []
		}

		// shortcut
		var content = this._fullscreen._content;

		var toggles_wrapper = Wu.DomUtil.create('div', 'toggles-wrapper', content);

		// create invite input for projects
		this._createInviteInput({
			type : 'read',
			label : 'Invite ' + user.getFullName() + ' to view these projects',
			content : toggles_wrapper,
			container : this._fullscreen._inner,
			sublabel : 'The user will get read-only access to these project'
		});

		// create invite input
		this._createInviteInput({
			type : 'edit',
			label : 'Invite ' + user.getFullName() + ' to edit these projects',
			content : toggles_wrapper,
			container : this._fullscreen._inner,
			sublabel : 'The user will get full edit access to these project'
		});


		// save button
		var saveBtn = Wu.DomUtil.create('div', 'smooth-fullscreen-save invite', content, 'Invite');
		var save_message = Wu.DomUtil.create('div', 'invite-success-message', content, '');
		Wu.DomEvent.on(saveBtn, 'click', this._updateInvites, this);

		// remember user
		this._access.user = user;
	},

	_updateInvites : function () {

		var reads = []; 
		var edits = [];
		var user = this._access.user;
		var read = this._access.read;
		var edit = this._access.edit;

		this._access.read.forEach(function (r) {
			reads.push(r.project.getUuid());
		});
		this._access.edit.forEach(function (e) {
			edits.push(e.project.getUuid());
		});

		// invite
		user.inviteToProjects({
			read : reads,
			edit : edits
		});

		// close
		this._fullscreen.close();
	
	},

	_divs : {
		read : {},
		edit : {},
		email : {}
	},

	_sendInvites : function (e) {

		var emails = [];

		this._emails.forEach(function (divObj, i) {
			var invite_input = divObj.invite_input;

			var email_value = invite_input.value;

			if (!email_value.length && i == 0) {
				var invite_error = divObj.invite_error;
				invite_error.innerHTML = 'Please enter an email address';
				return;
			}

			if (email_value.length) emails.push(email_value);
		});

		if (!emails.length) return;

		var customMessage = this._customMessage.value.replace(/\n/g, '<br>');

		var access = {
			edit : [],
			read : []
		}

		this._access.edit.forEach(function (p) {
			access.edit.push(p.project.getUuid());
		});

		this._access.read.forEach(function (p) {
			access.read.push(p.project.getUuid());
		});

		var options = {
			emails : emails,
			customMessage : customMessage,
			access : access
		}

		// send to server
		Wu.send('/api/user/invite', options, this._sentInvites.bind(this, e.target), this);

		// logs
		this._logInvites(options);

		// clear old
		this._emails = [];

	},

	// slack, analytics
	_logInvites : function (options) {

		var read = [];
		var edit = [];
		var description = '';

		options.access.read.forEach(function (p) {
			read.push(app.Projects[p].getTitle());
		});
		options.access.edit.forEach(function (p) {
			edit.push(app.Projects[p].getTitle());
		});

		if (read.length) {
			description += 'to read `' + read.join(', ') + '`';
		}
		if (read.length && edit.length) {
			description += 'and edit `' + edit.join(', ') + '`';
		}
		if (!read.length && edit.length) {
			description += 'to edit `' + edit.join(', ') + '`';
		}

		// send event
		app.Socket.sendUserEvent({
		    	user : app.Account.getFullName(),
		    	event : '`invited` ' + options.emails.join(', '),
		    	description : description,
		    	timestamp : Date.now()
		});
	},

	_sentInvites : function (saveBtn, b, c) {

		// close
		this._fullscreen.close();

		// set feedback 
		app.feedback.setMessage({
			title : 'Invites sent!',
		});
	},

	_createInviteInput : function (options) {

		// invite users
		var content = options.content || this._fullscreen._content;
		var container = this._fullscreen._container;

		// label
		var invite_label = options.label;
		var name = Wu.DomUtil.create('div', 'smooth-fullscreen-name-label invite', content, invite_label);
		
		// container
		var invite_container = Wu.DomUtil.create('div', 'invite-container', content);
		
		// sub-label
		var sublabel = Wu.DomUtil.create('div', 'smooth-fullscreen-sub-label', content, options.sublabel);

		var invite_inner = Wu.DomUtil.create('div', 'invite-inner', invite_container);
		var invite_input_container = Wu.DomUtil.create('div', 'invite-input-container', invite_inner);

		// input box
		var invite_input = Wu.DomUtil.create('input', 'invite-input-form', invite_input_container);

		// invite list
		var invite_list_container = Wu.DomUtil.create('div', 'invite-list-container', invite_container);
		var invite_list_inner = Wu.DomUtil.create('div', 'invite-list-inner', invite_list_container);

		// remember div
		this._divs[options.type].invite_list_container = invite_list_container;

		// for manual scrollbar (js)
		var monkey_scroll_bar = Wu.DomUtil.create('div', 'monkey-scroll-bar', invite_list_inner);
		
		// for holding list
		var monkey_scroll_hider = Wu.DomUtil.create('div', 'monkey-scroll-hider', invite_list_inner);
		var monkey_scroll_inner = Wu.DomUtil.create('div', 'monkey-scroll-inner', monkey_scroll_hider);
		var monkey_scroll_list = Wu.DomUtil.create('div', 'monkey-scroll-list', monkey_scroll_inner);

		// list of all projects, sort alphabetically
		var allProjects = _.sortBy(_.toArray(app.Projects), function (u) {
			return u.getTitle().toLowerCase();
		});
		_.each(allProjects, function (project) {

			// get access
			var access = project.getAccess();
			var isEditor = project.isEditor();
			var isSpectator = project.isSpectator();
			var isShareable = project.isShareable();

			// dont allow spectators with no share access
			if (options.type == 'read' && isSpectator && !isShareable) return;
			
			// dont allow spectators to give edit access
			if (options.type == 'edit' && isSpectator) return;

			// divs
			var list_item_container = Wu.DomUtil.create('div', 'monkey-scroll-list-item-container project', monkey_scroll_list);
			var avatar_container = Wu.DomUtil.create('div', 'monkey-scroll-list-item-avatar-container', list_item_container);
			var avatar = Wu.DomUtil.create('div', 'monkey-scroll-list-item-avatar project', avatar_container, '<i class="project fa fa-map-o"></i>');
			var name_container = Wu.DomUtil.create('div', 'monkey-scroll-list-item-name-container project', list_item_container);
			var name_bold = Wu.DomUtil.create('div', 'monkey-scroll-list-item-name-bold project', name_container);

			// set name
			name_bold.innerHTML = project.getTitle();

			// click event
			Wu.DomEvent.on(list_item_container, 'click', function () {

				// add selected project item to input box
				this._addAccessItem({
					input : invite_input,
					project : project,
					type : options.type,
					trigger : options.trigger
				});

				// optional callback
				if (options.trigger) {
					options.trigger({
						project : project
					});
				}
					
			}, this);
		}, this);


		// input focus, show dropdown
		Wu.DomEvent.on(invite_input, 'focus', function () {
			this._closeInviteInputs();
			invite_list_container.style.display = 'block';
		}, this);

		// focus input on any click
		Wu.DomEvent.on(invite_input_container, 'click', function () {
			invite_input.focus();
		}, this);

		// input keyup
		Wu.DomEvent.on(invite_input, 'keydown', function (e) {

			// get which key
			var key = event.which ? event.which : event.keyCode;

			// get string length
			var value = invite_input.value;
			var text_length = value.length;
			if (text_length <= 0) text_length = 1;

			// set width of input dynamically
			invite_input.style.width = 30 + (text_length * 20) + 'px';

			// backspace on empty field: delete added user
			if (key == 8 && value.length == 0 && this._access[options.type].length) {

				// remove last item
				var popped = this._access[options.type].pop();
				Wu.DomUtil.remove(popped.user_container);

				// optional callback
				if (options.trigger) {
					options.trigger({
						project : false
					});
				}
			}

			// enter: blur input
			if (key == 13) {
				invite_input.blur();
				invite_input.value = '';
				this._closeInviteInputs();
			}

		}, this);


		// close dropdown on any click
		Wu.DomEvent.on(container, 'click', function (e) {

			// only if target == self
			var relevantTarget = 	e.target == container || 
						e.target == this._fullscreen._inner || 
						e.target == name || 
						e.target == this._fullscreen._content;

			// close 
			if (relevantTarget) this._closeInviteInputs();

		},this);
	},

	_closeInviteInputs : function () {

		var container = this._divs.edit.invite_list_container;
		if (container) container.style.display = 'none';

		var container = this._divs.read.invite_list_container;
		if (container) container.style.display = 'none';
	},

	_addAccessItem : function (options) {

		var invite_input = options.input;
		var project = options.project;

		// focus input
		invite_input.focus();

		// don't add twice
		var existing = _.find(this._access[options.type], function (i) {
			return i.project == project;
		});
		if (existing) return;

		// insert project box in input area
		var user_container = Wu.DomUtil.create('div', 'mini-user-container');
		var user_inner = Wu.DomUtil.create('div', 'mini-user-inner', user_container);
		var user_avatar = Wu.DomUtil.create('div', 'mini-project-avatar', user_inner, '<i class="fa fa-map"></i>');
		var user_name = Wu.DomUtil.create('div', 'mini-user-name', user_inner, project.getTitle());
		var user_kill = Wu.DomUtil.create('div', 'mini-user-kill', user_inner, 'x');

		// insert before input
		var invite_input_container = invite_input.parentNode;
		invite_input_container.insertBefore(user_container, invite_input);

		// click event (kill)
		Wu.DomEvent.on(user_container, 'click', function () {
			
			// remove div
			Wu.DomUtil.remove(user_container);
			
			// remove from array
			_.remove(this._access[options.type], function (i) {
				return i.project == project;
			});

			// optional callback
			if (options.trigger) {
				options.trigger({
					project : false
				});
			}

		}, this);

		// add to array
		this._access[options.type].push({
			project : project,
			user_container : user_container
		});

		// remove from other list if active there
		var otherType = (options.type == 'edit') ? 'read' : 'edit';
		var existing = _.find(this._access[otherType], function (i) {
			return i.project == project;
		});
		if (existing) {

			// remove div
			Wu.DomUtil.remove(existing.user_container);
			
			// remove from array
			_.remove(this._access[otherType], function (i) {
				return i == existing;
			});
		}

	},



	refreshUserList : function (data) {

		// if (this.openUserCard) this.addGhost();

		// BIND
		var eachUser = 
			this.D3container
			.selectAll('.chrome-user')
			.data(data);

		// ENTER
		eachUser
			.enter()
			.append('div')
			.classed('chrome-user', true)
			.classed('chrome-left-itemcontainer', true)

		// UPDATE
		eachUser
			.classed('contact', function (d) {
				return d.isContact();
			})
			.classed('project-contact', function (d) {
				return !d.isContact();
			})		

		// EXIT
		eachUser
			.exit()
			.remove();


		// Add user name
		this.addUserName(eachUser);

		// Add action trigger (the [...] button)
		// this.addUserActionTrigger(eachUser);

		// Add user card
		// this.addUserCard(eachUser);

		// add icon to invite to projects
		this.create_inviteToProjectIcon(eachUser);			

		// add icon to add contact
		this.create_addContactIcon(eachUser);	

	
	},

	create_inviteToProjectIcon : function (parent) {

		// Bind
		var nameContent = 
			parent
			.selectAll('.contact-invite-icon')
			.data(function(d) {

				// if user is not a contact
				var a = d.isContact() ? [d] : [];
				return a;
			})

		// Enter
		nameContent
			.enter()
			.append('i')
			.classed('contact-invite-icon', true)
			.classed('fa', true)
			.classed('fa-arrow-circle-right', true)
			

		// Update
		nameContent
			.on('click', function (d) {

				// click on icon
				this._inviteToProject(d);

			}.bind(this));

		// add tooltip
		nameContent
			.html(function (d) {
				var tooltipWidth = 123 + 'px';
				var tooltipText = 'Invite to projects';
				var innerHTML = '<div class="absolute"><div class="project-tooltip contact-invite-tooltip" style="width:' + tooltipWidth + '">' + tooltipText + '</div></div>'
				return innerHTML;
			})
		// Exit
		nameContent
			.exit()
			.remove();

	},

	create_addContactIcon : function (parent) {
		
		// Bind
		var nameContent = 
			parent
			.selectAll('.contact-list-icon')
			.data(function(d) {
				// var a = d.isContact() ? [d] : [];

				// if user is not a contact
				var a = d.isContact() ? [] : [d];
				return a;
			})

		// Enter
		nameContent
			.enter()
			.append('i')
			.classed('contact-list-icon', true)
			.classed('fa', true)
			.classed('fa-user-plus', true)
			

		// Update
		nameContent
			.on('click', function (d) {

				// click on icon
				this._requestContact(d);

			}.bind(this));

		// add tooltip
		nameContent
			.html(function (d) {
				var tooltipWidth = 110 + 'px';
				var tooltipText = 'Add as contact';
				var innerHTML = '<div class="absolute"><div class="project-tooltip contact-add-tooltip" style="width:' + tooltipWidth + '">' + tooltipText + '</div></div>'
				return innerHTML;
			})
		// Exit
		nameContent
			.exit()
			.remove();
	},

	// ADD USER NAME
	// ADD USER NAME
	// ADD USER NAME

	addUserName : function (parent) {


		// Bind
		var nameContent = 
			parent
			.selectAll('.chrome-left-item-name')
			.data(function(d) { return [d] })

		// Enter
		nameContent
			.enter()
			.append('div')
			.classed('chrome-left-item-name', true)

		// Update
		nameContent
			.html(function (d) { 
				return d.getFullName();
			});

		// Exit
		nameContent
			.exit()
			.remove();


	},

	_requestContact : function (user) {

		// send contact request
		app.Account.sendContactRequest(user);
	},

	_onLayerAdded : function (options) {
	},

	_onFileDeleted : function () {
	},

	_onLayerDeleted : function () {
	},

	_onLayerEdited : function () {
	},

	_registerButton : function () {

	},

	_togglePane : function () {

		// right chrome
		var chrome = this.options.chrome;

		// open/close
		this._isOpen ? chrome.close(this) : chrome.open(this); // pass this tab

		if (this._isOpen) {
			// fire event
			app.Socket.sendUserEvent({
				user : app.Account.getFullName(),
				event : 'opened',
				description : 'the left pane',
				timestamp : Date.now()
			});
		}
	},

	_show : function () {
		this._container.style.display = 'block';
		this._isOpen = true;
	},

	_hide : function () {
		this._container.style.display = 'none';
		this._isOpen = false;
	},

	onOpened : function () {
	},

	onClosed : function () {
	},

	_addEvents : function () {
	},

	_removeEvents : function () {
	},

	_onWindowResize : function () {
	},

	getDimensions : function () {
		var dims = {
			width : this.options.defaultWidth,
			height : this._container.offsetHeight
		}
		return dims;
	},

	_refresh : function () {

		// Prepare data as array
		var data = _.toArray(this.users);

		// remove self
		_.remove(data, function (d) {
			return d.getUuid() == app.Account.getUuid();
		})

		// Init user list
		this.refreshUserList(data);			
	},


		// manageAccess : function (user) {

	// 	var accessFullScreen = this.accessFullScreen = Wu.DomUtil.create('div', 'manage-user-access-fullscreen', app._appPane);

	// 	var manageAccessInner = Wu.DomUtil.create('div', 'manage-user-access-inner', accessFullScreen);
	// 	var closeManageAccessButton = Wu.DomUtil.create('div', 'close-manage-user-access', accessFullScreen, 'x');

	// 	var header = Wu.DomUtil.create('div', 'manage-access-title', manageAccessInner);
	// 	header.innerHTML = '<span style="font-weight:200;">Manage access for</span> ' + user.getFullName();

	// 	this.manageProjectsList(manageAccessInner);


	// 	Wu.DomEvent.on(closeManageAccessButton, 'click', this.closeManageAccess, this);

	// },

	// closeManageAccess : function () {

	// 	this.accessFullScreen.innerHTML = '';
	// 	this.accessFullScreen.remove();
	// 	this.removeGhost();

	// },

	// manageProjectsList : function(wrapper) {

	// 	var projects = app.Projects;

	// 	for ( var project in projects ) {

	// 		var projectWrapper = Wu.DomUtil.create('div', 'manage-access-project-wrapper', wrapper);
	// 		var projectTitle = Wu.DomUtil.create('div', 'manage-access-project-title', projectWrapper);
	// 		projectTitle.innerHTML = projects[project].getName();

	// 		var accessButtonsWrapper = Wu.DomUtil.create('div', 'manage-access-buttons-wrapper', projectWrapper);

	// 		var viewButton = Wu.DomUtil.create('div', 'access-button view-project-button active', accessButtonsWrapper, 'View project');
	// 		var downloadButton = Wu.DomUtil.create('div', 'access-button download-project-button', accessButtonsWrapper, 'Download data');
	// 		var inviteButton = Wu.DomUtil.create('div', 'access-button invite-project-button active', accessButtonsWrapper, 'Invite others');
	// 	}

	// },
	

	
	// initGhost : function () {
	// 	this.ghost = Wu.DomUtil.create('div', 'chrome-left-ghost displayNone', this.options.appendTo);
	// 	Wu.DomEvent.on(this.ghost, 'click', this.removeGhost, this);		
	// },

	// removeGhost : function () {
	// 	Wu.DomUtil.addClass(this.ghost, 'displayNone');
	// 	this.openUserCard = false;
	// 	this._refresh();
	// },

	// addGhost : function () {
	// 	Wu.DomUtil.removeClass(this.ghost, 'displayNone');
	// },



	// ADD USER ACTION TRIGGER
	// ADD USER ACTION TRIGGER
	// ADD USER ACTION TRIGGER

	// addUserActionTrigger : function (parent) {


	// 	// Bind
	// 	var userActionTrigger = 
	// 		parent
	// 		.selectAll('.chrome-left-popup-trigger')
	// 		.data(function(d) { return [d] })

	// 	// Enter
	// 	userActionTrigger
	// 		.enter()
	// 		.append('div')
	// 		.classed('chrome-left-popup-trigger', true)

	// 	// Update
	// 	userActionTrigger
	// 		.on('click', function (d) {
	// 			// this.openUserCard = d.getUuid();
	// 			this._refresh();
	// 		}.bind(this));

	// 	// Exit
	// 	userActionTrigger
	// 		.exit()
	// 		.remove();


	// },

	// ADD USER CARD
	// ADD USER CARD
	// ADD USER CARD

	// addUserCard : function (parent) {

	// 	// Bind
	// 	var userCard = 
	// 		parent
	// 		.selectAll('.chrome-user-card')
	// 		.data(function(d) { 
	// 			var uuid = d.getUuid();

	// 			// Only return data if we have a match
	// 			if ( this.openUserCard == uuid ) return [d];

	// 			// Return empty if not active (will not proceed);
	// 			return []; 
	// 		}.bind(this))

	// 	// Enter
	// 	userCard
	// 		.enter()
	// 		.append('div')
	// 		.classed('chrome-user-card', true);			

	// 	// Exit
	// 	userCard
	// 		.exit()
	// 		.remove();



	// 	// TOP CONTAINER
	// 	// TOP CONTAINER
	// 	// TOP CONTAINER

	// 	// Top Container
	// 	var topContainer = userCard
	// 		.append('div')
	// 		.classed('user-card-top-container', true);

	// 	// Close button
	// 	var closeButton = topContainer
	// 		.append('div')
	// 		.classed('user-card-close-button', true)
	// 		.html('x')
	// 		.on('click', function () {
	// 			this.removeGhost();
	// 		}.bind(this));

	// 	// User name
	// 	var userName = topContainer
	// 		.append('div')
	// 		.classed('card-user-name', true)
	// 		.html(function (d) {
	// 			return d.getFullName();
	// 		});

	// 	// Project count
	// 	var projectCount = topContainer
	// 		.append('div')
	// 		.classed('card-user-project-count', true)
	// 		.html(function (d) {
	// 			var projects = d.getProjects();
	// 			if ( projects.length == 1 ) return projects.length + ' project';
	// 			return projects.length + ' projects';
	// 		});


	// 	// BOTTOM CONTAINER
	// 	// BOTTOM CONTAINER
	// 	// BOTTOM CONTAINER

	// 	// Bottom Container
	// 	var bottomContainer = userCard
	// 		.append('div')
	// 		.classed('user-card-bottom-container', true);

	// 	var manageAccess = bottomContainer
	// 		.append('div')
	// 		.classed('manage-user-access', true)
	// 		.html('Manage access')
	// 		.on('click', function (d) {
	// 			this.manageAccess(d);
	// 		}.bind(this))

	// 	var deleteUser = bottomContainer
	// 		.append('div')
	// 		.classed('delete-user', true)
	// 		.html('Delete user')
	// 		.on('click', function (d) {				
	// 			this.deleteUser(d)
	// 		}.bind(this))		

	// },


	// deleteUser : function (user) {
	// 	var name = user.getFirstName() + ' ' + user.getLastName();
	// 	if (confirm('Are you sure you want to delete user ' + name + '?')) {
	// 		if (confirm('Are you REALLY SURE you want to delete user ' + name + '?')) {
	// 			this.confirmDelete(user);
	// 		}			
	// 	}		
	// },

	// confirmDelete : function (user) {
	// 	// delete user         cb
	// 	user.deleteUser(this, 'deletedUser');
	// 	this._refresh();
	// },



});