Wu.FeedbackPane = Wu.Class.extend({

	initialize : function () {

		// create container
		this.initContainer();

		// shortcut	
		app.feedback = this;

		// concurrent messages stored here
		this._messages = {};
	},

	initContainer : function () {
		this._container = Wu.DomUtil.create('div', 'feedback-pane', app._appPane);
	},

	set : function (options) {
		this.add(options);
	},

	
	setMessage : function (options) {
		this.add(options, 1); 	// neutral message
	},

	setSuccess : function (options) {
		this.add(options, 2);	// success message
	},
	
	setError : function (options) {
		this.add(options, 3); 	// error message
	},

	add : function (message, severity) {

		var id = Wu.Util.createRandom(5);

		var options = {
			container : this._container,
			id : id,
			severity : severity || 3 // error default
		}



		// create and save in stack
		this._messages[id] = new Wu.FeedbackPane.Message(Wu.extend(options, message));
	},

	remove : function (id) {
		// delete container and object
		var pane = this._messages[id];
		if (!pane) return;

		var container = pane._content;
		Wu.DomUtil.remove(container);
		delete this._messages[id];
	},
});



Wu.FeedbackPane.Message = Wu.Class.extend({

	options : {

		clearTimer : true,
		clearDelay : 10000,
		transitionDelay : 0.5, 
		severityStyle : {
			1 : 'message',
			2 : 'success',
			3 : 'error'
		}
	},

	initialize : function (options) {
		
		// set options
		Wu.setOptions(this, options);

		console.log('this.options, ', this.options);
		
		// init layout
		this.initLayout();

		// set message
		this.set();

	},

	initLayout : function () {

		// create divs
		this._content = Wu.DomUtil.create('div', 'feedback-pane-content', this.options.container);

		this._title = Wu.DomUtil.create('div', 'feedback-pane-title', this._content);
		this._description = Wu.DomUtil.create('div', 'feedback-pane-description', this._content);
		this._icon = Wu.DomUtil.create('div', 'feedback-pane-icon', this._content);

		// set transition
		this._content.style.opacity = 0;
		this._content.style.webkitTransition = 'opacity ' + this.options.transitionDelay + 's';
		this._content.style.transition = 'opacity ' + this.options.transitionDelay + 's';

		// x
		this._x = Wu.DomUtil.create('div', 'feedback-pane-x', this._content, 'X');

		// events
		this.addEvents();

	},

	addEvents : function () {
		// close on click
		Wu.DomEvent.on(this._x, 'click', this.clear, this);

		Wu.DomEvent.on(this._content, 'mouseenter', this._mouseEnter, this);
		Wu.DomEvent.on(this._content, 'mouseleave', this._mouseLeave, this);
	},

	set : function () {
	
		// set view
		this.setTitle();
		this.setDescription();
		this.setSeverity();

		// show
		this.show();

		// clear after timeout
		this.clearTimer();
	},

	_mouseEnter : function () {
		this._cancelTimer();
	},

	_mouseLeave : function () {
		this.clearTimer(this.options.clearDelay/4);
	},

	_cancelTimer : function () {
		if (this._clearTimer) clearTimeout(this._clearTimer);
	},

	clearTimer : function (delay) {
		if (!this.options.clearTimer) return;
		this._clearTimer = setTimeout(this.clear.bind(this), delay || this.options.clearDelay);
	},

	clear : function () {
		this.hide();
	},

	setTitle : function () {
		this._title.innerHTML = this.options.title;
	},

	setDescription : function () {
		this._description.innerHTML = this.options.description;
	},

	setSeverity : function (s) {
		var s = this.options.severity;
		if (s) this.setStyle(this.options.severityStyle[s]);
	},

	setStyle : function (style) {
		Wu.DomUtil.addClass(this._content, style);
	},

	setBackground : function (color) {
		this._content.style.background = color;
	},

	hide : function () {
		this._content.style.opacity = 0;
		setTimeout(function () {
			app.feedback.remove(this.options.id);
		}.bind(this), this.options.transitionDelay * 1000); // timed with css transition
	},

	show : function () {
		setTimeout(function () {
			this._content.style.opacity = 1;
		}.bind(this), 5); // dom hack
	}

});


