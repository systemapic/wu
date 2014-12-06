Wu.ZIndexControl = Wu.Class.extend({

	initialize : function () {
			
		// list of layers by zindex - 0 is bottom, n is top (most visible)
		this.index = [];

		// add shortcut
		app.zIndex = this;
	},


	add : function (layer) {

	},

	remove : function (layer) {

	},

	set : function (z, layer) {

	},

	get : function (layer) {

	},

	up : function (layer) {

	},

	down : function (layer) {

	},

	top : function (layer) {

	},

	bottom : function (layer) {

	},


});

Wu.ZIndexControl.Baselayers = Wu.ZIndexControl.extend({

	add : function () {

	},

});

Wu.ZIndexControl.Layermenu = Wu.ZIndexControl.extend({

	add : function () {

	},

});