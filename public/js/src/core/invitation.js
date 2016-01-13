Wu.Invite = Wu.Class.extend({

	options : {

	},

	initialize : function (options) {

		// set options
		Wu.setOptions(this, options);

		// invite store
		this._invite = options.store || {};

		console.log('this._invite: ', this._invite);

		// set page title
		document.title = loginConfig.pageTitle;

		// init container
		this._initContainer();

		// init content
		this._initContent();
	},

	_initContainer : function () {
		this._container = Wu.DomUtil.get(this.options.container);
	},

	_initContent : function () {

		// logo
		this._createLogo();

		// wrapper
		this._centralWrapper = Wu.DomUtil.create('div', 'central', this._container);

		// login
		this._createLogin();

		// register
		this._createRegister();

		// shade login on load
		this._rightshader.style.opacity = 1;
	},

	_createLogo : function () {

		// wrap
		var logo_wrap = Wu.DomUtil.create('div', 'logo-wrap', this._container);

		// logo
		var logo = Wu.DomUtil.create('div', 'logo', logo_wrap);

		// set image
		var logo_img = loginConfig.invitationLogo;
		logo.style.backgroundImage = logo_img;
		
		// set width
		var width = loginConfig.loginLogoWidth || 210;
		logo.style.width = width + 'px';
	},
	

	_createLogin : function () {

		// login wrapper
		var wrapper = Wu.DomUtil.create('div', 'left', this._centralWrapper);

		// shader
		this._rightshader = Wu.DomUtil.create('div', 'shader', wrapper);

		// label
		var label = Wu.DomUtil.create('div', 'top-label', wrapper, 'Log in');
	
		// wrapper
		var input_wrapper = Wu.DomUtil.create('form', 'input-wrapper', wrapper);
		input_wrapper.setAttribute('action', '/login');
		input_wrapper.setAttribute('method', 'post');

		// email label
		var email_input = Wu.DomUtil.create('input', 'input', input_wrapper, 'Email Address');
		email_input.setAttribute('name', 'email');

		// password label
		var password_input = Wu.DomUtil.create('input', 'input', input_wrapper, 'Password');
		password_input.setAttribute('type', 'password');
		password_input.setAttribute('name', 'password');

		// button
		var button = Wu.DomUtil.create('button', 'button', input_wrapper, 'Login');
		button.setAttribute('type', 'submit');
		button.setAttribute('name', 'login');

		// forgot password
		var forgotWrapper = Wu.DomUtil.create('div', 'forgot-wrapper', input_wrapper);
		var forgotLink = Wu.DomUtil.create('a', 'forgot-link', forgotWrapper, 'Forgot your password?');
		forgotLink.setAttribute('href', 'https://' + window.location.host + '/forgot');

		// shader
		Wu.DomEvent.on(wrapper, 'mouseenter', function () {
			this._rightshader.style.opacity = 0;
			this._leftshader.style.opacity = 1;
		}, this);
	},



	_createRegister : function () {

		// register
		var wrapper = this._rightWrapper = Wu.DomUtil.create('div', 'right', this._centralWrapper);

		// shader
		this._leftshader = Wu.DomUtil.create('div', 'shader', wrapper);

		// label
		var label = Wu.DomUtil.create('div', 'top-label', wrapper, 'Create account');

		// form
		var input_wrapper = Wu.DomUtil.create('form', 'input-wrapper-right', wrapper);
		input_wrapper.setAttribute('action', '/register');
		input_wrapper.setAttribute('method', 'post');

		// username
		var username_input = Wu.DomUtil.create('input', 'input firstname', input_wrapper, 'Choose a username');
		username_input.setAttribute('name', 'username');

		// first name
		var firstname_input = Wu.DomUtil.create('input', 'input firstname', input_wrapper, 'First Name');
		firstname_input.setAttribute('name', 'firstname');

		// last name
		var lastname_input = Wu.DomUtil.create('input', 'input lastname', input_wrapper, 'Last Name');
		lastname_input.setAttribute('name', 'lastname');

		// company
		var company_input = Wu.DomUtil.create('input', 'input company', input_wrapper, 'Company');
		company_input.setAttribute('name', 'company');

		// position
		var position_input = Wu.DomUtil.create('input', 'input position', input_wrapper, 'Position');
		position_input.setAttribute('name', 'position');

		// email
		var email_input = Wu.DomUtil.create('input', 'input email', input_wrapper, 'Email Address');
		email_input.setAttribute('name', 'email');
		email_input.value = this._invite.email || '';

		// password label
		var password_input = Wu.DomUtil.create('input', 'input password', input_wrapper, 'Password (minimum 8 characters)');
		password_input.setAttribute('type', 'password');
		password_input.setAttribute('name', 'password');

		// hidden
		var invite_token = Wu.DomUtil.create('input', '', input_wrapper);
		invite_token.value = this._invite.token || false;
		invite_token.style.display = 'none';
		invite_token.setAttribute('name', 'invite_token');

		// privacy policy
		var privacy_checkbox = Wu.DomUtil.create('input', '', input_wrapper, 'Password (minimum 8 characters)');
		privacy_checkbox.setAttribute('type', 'checkbox');
		privacy_checkbox.id = 'privacy-checkbox';
		var privacy_label = document.createElement('label')
		privacy_label.htmlFor = 'privacy-checkbox';
		privacy_label.innerHTML = 'I have read and agree to Systemapic\'s <a href="privacy-policy" target="_blank">Terms and Conditions</a>';
		input_wrapper.appendChild(privacy_label);

		// submit button
		var button = this._submitBtn = Wu.DomUtil.create('button', 'button', input_wrapper, 'Sign up');
		button.setAttribute('type', 'submit');
		button.setAttribute('type', 'submit');
		button.disabled = true;

		// enable submit button when privacy policy is accepted
		Wu.DomEvent.on(privacy_checkbox, 'click', function () {
			button.disabled = !privacy_checkbox.checked;
			this._privacyChecked = privacy_checkbox.checked;
			this.checkSubmitBtn();
		}, this);

		// shader
		Wu.DomEvent.on(wrapper, 'mouseenter', function () {
			this._rightshader.style.opacity = 1;
			this._leftshader.style.opacity = 0;
		}, this);


		// check unique username
		Wu.DomEvent.on(username_input, 'keyup', this._checkUniqueUsername, this);
		Wu.DomEvent.on(username_input, 'blur',  this._checkUniqueUsername, this);
		
		// check unique email
		Wu.DomEvent.on(email_input, 'keyup', this._checkUniqueEmail, this);
		Wu.DomEvent.on(email_input, 'blur',  this._checkUniqueEmail, this);
	
		// check email immediately, since it's autofilled
		setTimeout(function () { // delay hack due to slow DOM
			this._checkUniqueEmail({target : email_input});
		}.bind(this), 500);
	},

	checkSubmitBtn : function () {
		var allgood = (this._uniqueUsername && this._uniqueEmail && this._privacyChecked);
		this._submitBtn.disabled = !allgood;
	},

	_checkUniqueEmail : function (e) {

		var input = e.target;
		var email = input.value;

		// post to endpoint
		this._post('/api/user/uniqueEmail', {
			email : email
		}, function (err, result) {

			// remember
			this._uniqueEmail = result.unique;

			// mark submit button disabled/enabled
			this.checkSubmitBtn();

			// mark input
			input.style.backgroundColor = this._uniqueEmail ? 'transparent' : '#FF4545';

		}.bind(this));
	},


	_checkUniqueUsername : function (e) {

		var input = e.target;
		var username = input.value;

		// post to endpoint
		this._post('/api/user/uniqueUsername', {
			username : username
		}, function (err, result) {

			// remember
			this._uniqueUsername = result.unique;

			// mark submit button disabled/enabled
			this.checkSubmitBtn();

			// mark input
			input.style.backgroundColor = this._uniqueUsername ? 'transparent' : '#FF4545';

		}.bind(this));
	},

	_post : function (endpoint, json, done) {	
		var url = window.location.origin + endpoint;
		var http = new XMLHttpRequest();
		http.open("POST", url, true);
		http.setRequestHeader('Content-type', 'application/json');
		http.onreadystatechange = function() {
			if (http.readyState == 4 && http.status == 200) {
				var answer = Wu.parse(http.responseText);
				done && done(null, answer);
			}
		}
		if (Wu.Util.isObject(json)) json = JSON.stringify(json);
		http.send(json);
	},

});

