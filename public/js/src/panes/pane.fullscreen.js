Wu.Fullscreen = Wu.Evented.extend({

	_inputs : [],

	_initialize : function () {

		// create content
		this._initContent();
	
		// events
		this.addEvents();
	},

	_initContent : function () {

		// create fullscreen
		this._container = Wu.DomUtil.create('div', 'smooth-fullscreen', app._appPane);

		var innerClassName = this.options.innerClassName || 'smooth-fullscreen-inner';

		var titleClassName = this.options.titleClassName ? 'smooth-fullscreen-title ' + this.options.titleClassName : 'smooth-fullscreen-title';

		// wrappers
		this._inner = Wu.DomUtil.create('div', innerClassName, this._container);
		this._header = Wu.DomUtil.create('div', titleClassName, this._inner, this.options.title);
		this._content = Wu.DomUtil.create('div', 'smooth-fullscreen-content', this._inner);
		this._closer = Wu.DomUtil.create('div', 'close-smooth-fullscreen', this._container, 'x');
	},

	addInput : function (options) {

		// create input
		var label = Wu.DomUtil.create('div', 'smooth-fullscreen-name-label', this._content, options.label);
		var input = Wu.DomUtil.create('input', 'smooth-input', this._content);
		input.setAttribute('placeholder', options.placeholder);
		input.value = options.value;
		var error = Wu.DomUtil.create('div', 'smooth-fullscreen-error-label', this._content);

		// remember
		this._inputs.push({
			label : label,
			input : input,
			error : error
		});
	},

	addEvents : function () {

		// close trigger		
		Wu.DomEvent.on(this._closer, 'click', this.destroy, this);

		// add esc key trigger for close fullscreen
		this._addEscapeKey();
	},

	removeEvents : function () {

		// close trigger		
		Wu.DomEvent.off(this._closer, 'click', this.destroy, this);

		// add esc key trigger for close fullscreen
		this._removeEscapeKey();
	},

	close : function () {
		this.destroy();
	},

	destroy : function () {

		// remove events
		this.removeEvents();

		// remove container
		this._container.innerHTML = '';
		Wu.DomUtil.remove(this._container);

		var closeCallback = this.options.closeCallback;
		closeCallback && closeCallback();

		return false;
	},

	_addEscapeKey : function () {
		keymaster('esc', this.destroy.bind(this));
	},

	_removeEscapeKey : function () {
		if (keymaster.unbind) keymaster.unbind('esc');
	},

})