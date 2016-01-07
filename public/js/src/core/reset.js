Wu.Reset = Wu.Class.extend({

	options : {
		title : 'Reset your password',
		message : 'Please create a strong password',
		sent : 'Please check your email for further instructions.',
		button : 'Reset',
		api : '/reset/password'
	},

	initialize : function (options) {

		// set options
		this.setOptions(options);

		// init container
		this._initContainer();

		// init content
		this._initContent();
	},

	setOptions : function (options) {
		
		// set options
		Wu.setOptions(this, options);

		// get token
		this._token = this.getParams('token');

		// get email
		this._email = this.getParams('email');
	},

	getParams : function (name) {
		return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
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
		this._createForgot();
	},

	_createLogo : function () {

		// wrap
		var logo_wrap = Wu.DomUtil.create('div', 'logo-wrap', this._container);

		// // logo
		// var logo = Wu.DomUtil.create('div', 'logo', logo_wrap);

		// // set image
		// var logo_img = loginConfig.invitationLogo;
		// logo.style.backgroundImage = 'url(../' + logo_img + ')';

		// logo
		var logo = Wu.DomUtil.create('img', '', logo_wrap);

		// set image
		var logo_img = loginConfig.invitationLogo;
		logo.src = logo_img;

		// set width
		// var width = loginConfig.loginLogoWidth || 210;
		// logo.style.width = width + 'px';

	},


	_createForgot : function () {

		// login wrapper
		var wrapper = Wu.DomUtil.create('div', 'center', this._centralWrapper);

		// label
		var label = Wu.DomUtil.create('div', 'top-label', wrapper, this.options.title);
	
		// text
		var textWrapper = Wu.DomUtil.create('div', 'text-wrapper', wrapper);
		this._text = Wu.DomUtil.create('div', 'text-content', textWrapper);
		this._text.innerHTML = this.options.message;

		// wrapper
		this._inputs = Wu.DomUtil.create('form', 'input-wrapper', wrapper);
		this._inputs.setAttribute('action', this.options.api);
		this._inputs.setAttribute('method', 'post');

		// email label
		this._emailDiv = Wu.DomUtil.create('input', 'input reset', this._inputs, 'Email Address');
		this._emailDiv.setAttribute('name', 'email');
		this._emailDiv.value = this._email;
		this._emailDiv.setAttribute('readonly', 'readonly');

		// password label
		this._password = Wu.DomUtil.create('input', 'input forgot', this._inputs, 'Create a strong password');
		this._password.setAttribute('name', 'password');
		this._password.setAttribute('type', 'password');

		// pass token to POST
		this._tokenInput = Wu.DomUtil.create('input', 'input forgot', this._inputs);
		this._tokenInput.setAttribute('name', 'token');
		this._tokenInput.style.display = 'none';
		this._tokenInput.value = this._token;

		// button
		var button = Wu.DomUtil.create('button', 'button', this._inputs, this.options.button);
		button.setAttribute('type', 'submit');
		button.setAttribute('name', 'login');
		
	},

});