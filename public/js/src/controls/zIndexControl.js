// app.ZIndexControl

Wu.ZIndexControl = Wu.Class.extend({

	initialize : function () {
		
		// store
		this._index = [];

		// add shortcut
		app.zIndex = this;
	},

	add : function (layer) {

		// add to top of zindex
		this._index.push(layer);

		// enforce zindex
		this.enforce();
	},

	remove : function (layer) {
		_.remove(this._index, function (l) {
			return l == layer;
		});

		// enforce zindex
		this.enforce();
	},

	set : function (z, layer) {

	},

	get : function (layer) {
		// get all
		if (!layer) return this._index;

		// if layer, get layer xindex
		return _.findIndex(this._index, function (l) { return layer == l; });
	},

	getIndex : function () {
		var clear = []
		this._index.forEach(function (l) {
			clear.push(l.getTitle());
		});
		return clear;
	},

	up : function (layer) {

		// get current index
		var cur = this.get(layer);

		// move up in index array
		this._move(cur, cur + 1);

		// update zindex on map
		this.enforce();
	},

	_move : function (from, to) {
		 this._index.splice(to, 0, this._index.splice(from, 1)[0]);
	},

	down : function (layer) {

		// get current index
		var cur = this.get(layer);

		// move down in index array
		this._move(cur, cur - 1);

		// update zindex on map
		this.enforce();

	},

	top : function (layer) {

	},

	bottom : function (layer) {

	},

	// enforce zindexes
	enforce : function () {
		var layers = this._index;
		layers.forEach(function (layer, i) {
			var zindex = i + this._z; 
			layer._setZIndex(zindex);
		}, this);
	},

});

Wu.ZIndexControl.Baselayers = Wu.ZIndexControl.extend({

	// baselayers start with zindex 0
	_z : 0,
	_me : 'base',

});

Wu.ZIndexControl.Layermenu = Wu.ZIndexControl.extend({

	// layermenu start w zindex 1000, to stay on top of baselayers
	_z : 1000,
	_me : 'layermenu',

});












