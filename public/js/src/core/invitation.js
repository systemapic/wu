Wu.Invite = Wu.Class.extend({

	initialize : function (options) {


		// set options
		Wu.setOptions(this, options);

		// invite store
		this._invite = options.store;

		console.log('otpions', options);

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
		this._leftshader.style.display = 'block';
	},

	_createLogo : function () {

		// wrap
		var logo_wrap = Wu.DomUtil.create('div', 'logo-wrap', this._container);

		// logo
		var logo = Wu.DomUtil.create('div', 'logo', logo_wrap);

		// set image
		var logo_img = loginConfig.invitationLogo;
		logo.style.backgroundImage = 'url(../' + logo_img + ')';

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
		// var email_label = Wu.DomUtil.create('div', 'input-label leftside', input_wrapper, 'Email Address');
		var email_input = Wu.DomUtil.create('input', 'input', input_wrapper, 'Email Address');
		email_input.setAttribute('name', 'email');

		// password label
		// var password_label = Wu.DomUtil.create('div', 'input-label', input_wrapper, 'Password');
		var password_input = Wu.DomUtil.create('input', 'input', input_wrapper, 'Password');
		password_input.setAttribute('type', 'password');
		password_input.setAttribute('name', 'password');

		// button
		var button = Wu.DomUtil.create('button', 'button', input_wrapper, 'Login');
		button.setAttribute('type', 'submit');
		button.setAttribute('name', 'login');




		// shader
		Wu.DomEvent.on(wrapper, 'mouseenter', function () {
			this._rightshader.style.display = 'none';
			this._leftshader.style.display = 'block';
		}, this);

	},


	_createRegister : function () {

		// register
		var wrapper = this._rightWrapper = Wu.DomUtil.create('div', 'right', this._centralWrapper);

		// shader
		this._leftshader = Wu.DomUtil.create('div', 'shader', wrapper);

		// label
		var label = Wu.DomUtil.create('div', 'top-label', wrapper, 'Create account');

		var input_wrapper = Wu.DomUtil.create('form', 'input-wrapper-right', wrapper);
		input_wrapper.setAttribute('action', '/register');
		input_wrapper.setAttribute('method', 'post');


		// first name
		// var firstname_label = Wu.DomUtil.create('div', 'input-label rightside firstname', input_wrapper, 'First Name');
		var firstname_input = Wu.DomUtil.create('input', 'input firstname', input_wrapper, 'First Name');
		firstname_input.setAttribute('name', 'firstname');

		// var lastname_label = Wu.DomUtil.create('div', 'input-label rightside lastname', input_wrapper, 'Last Name');
		var lastname_input = Wu.DomUtil.create('input', 'input lastname', input_wrapper, 'Last Name');
		lastname_input.setAttribute('name', 'lastname');

		// var company_label = Wu.DomUtil.create('div', 'input-label rightside company', input_wrapper, 'Company');
		var company_input = Wu.DomUtil.create('input', 'input company', input_wrapper, 'Company');
		company_input.setAttribute('name', 'company');

		// var position_label = Wu.DomUtil.create('div', 'input-label rightside position', input_wrapper, 'Position');
		var position_input = Wu.DomUtil.create('input', 'input position', input_wrapper, 'Position');
		position_input.setAttribute('name', 'position');

		// email
		// var email_label = Wu.DomUtil.create('div', 'input-label rightside email', input_wrapper, 'Email Address');
		var email_input = Wu.DomUtil.create('input', 'input email', input_wrapper, 'Email Address');
		email_input.setAttribute('name', 'email');
		email_input.value = this.options.store.email;

		// password label
		// var password_label = Wu.DomUtil.create('div', 'input-label password', input_wrapper, 'Password');
		var password_input = Wu.DomUtil.create('input', 'input password', input_wrapper, 'Password (minimum 8 characters)');
		password_input.setAttribute('type', 'password');
		password_input.setAttribute('name', 'password');

		// hidden
		var invite_token = Wu.DomUtil.create('input', '', input_wrapper);
		invite_token.value = this.options.store.uuid;
		invite_token.style.display = 'none';
		invite_token.setAttribute('name', 'invite_token');


		// button
		var button = Wu.DomUtil.create('button', 'button', input_wrapper, 'Sign up');
		button.setAttribute('type', 'submit');





		// shader
		Wu.DomEvent.on(wrapper, 'mouseenter', function () {
			this._rightshader.style.display = 'block';
			this._leftshader.style.display = 'none';
		}, this);
	},







});


















