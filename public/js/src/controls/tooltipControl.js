Wu.Tooltip = Wu.Class.extend({

	options : {
		fixed : true,
		target : true, 
		tipJoint : 'middle right', 
		background : "#333", 
		borderColor : '#333',
		className : 'systip',
		delay : 1
	},

	defaultStyle : {
		fixed : true,
		target : true, 
		tipJoint : 'middle right', 
		background : "#333", 
		borderColor : '#333',
		className : 'systip',
		delay : 1
	},	

	initialize : function () {
		this.tips = [];

		// set default opentip style
		Opentip.styles.systyle = this.defaultStyle;
	},

	_isActive : function () {
		var project = app.activeProject;
		if (!project) return false;
		return project.getSettings().tooltips;
	},

	add : function (div, content, options) {

		// merge options
		var opts = _.extend(_.clone(this.options), options);

		// push to list
		this.tips.push({
			div : div,
			content : content,
			options : opts
		});

		// add events (if tooltips setting is active)
		if (this._isActive) this.on();
	},

	on : function () { 				

		// console.error('tooltip on!'); // todo optimize: too many event registered?

		// create tooltip
		this.tips.forEach(function (t) {

			// only init once
			if (!t.inited)  {

				// create tip
				var tip = new Opentip(t.div, t.content, t.options);

				// mark inited (for events)
				t.inited = true;
				t.tip = tip;
				
				// done
				return;
			} 

			// activate
			if (t.tip) t.tip.activate();

		}, this);

	},

	off : function () {

		// remove tooltip
		this.tips.forEach(function (t) {

			// deactivate
			if (t.tip) t.tip.deactivate();

		}, this);

	},

	// turn on in settings
	activate : function () {

		// register events
		this.on();


	},

	// turn off in settings
	deactivate : function () {

		// deregister events
		this.off();

	},

});