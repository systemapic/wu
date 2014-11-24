Wu.Tooltip = Wu.Class.extend({

	options : {
		fixed : true,
		target : true, 
		tipJoint : 'middle right', 
		background : "#333", 
		borderColor : '#333',
		className : 'systip'		
	},

	defaultStyle : {
		fixed : true,
		target : true, 
		tipJoint : 'middle right', 
		background : "#333", 
		borderColor : '#333',
		className : 'systip'		
	},	

	initialize : function () {
		this.tips = [];
		this.active = true;	// todo: setting active or not

		// set default opentip style
		Opentip.styles.systyle = this.defaultStyle;
	},

	add : function (div, content, title, options) {

		// merge options
		Wu.setOptions(options || {});

		// push to list
		this.tips.push({
			div : div,
			content : content,
			title : title,
			options : this.options
		});

		// add events (if tooltips setting is active)
		if (this.active) this.on();
	},

	on : function () {

		// create tooltip
		this.tips.forEach(function (t) {

			// only init once
			if (!t.inited)  {

				// create tip
				var tip = new Opentip(t.div, t.content, t.title, t.options);

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
		this.active = true;

		// register events
		this.on();


	},

	// turn off in settings
	deactivate : function () {
		this.active = false;

		// deregister events
		this.off();

	},

});