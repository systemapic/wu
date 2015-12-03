Wu.Styler.Polygon = Wu.Styler.extend({

	type : 'polygon',

	// creates content of point container
	_createOptions : function () {

		// color
		this._createColor();

		// opacity
		this._createOpacity();

		// targeted columns
		this._createTargets();

		// create (+) button
		console.log('(+) button');
	},
	
	_preSelectOptions : function () {

		// open relevant subfields
		this._initSubfields(this.carto().color.column, 'color');
		this._initSubfields(this.carto().opacity.column, 'opacity');
	},

	_clearOptions : function () {

		// get content
		var content = this._content[this.type];

		// return if not content yet
		if (_.isEmpty(content)) return;

		// get divs
		var color_wrapper = content.color.line.container;
		var color_children = content.color.line.childWrapper;
		var opacity_wrapper = content.opacity.line.container;
		var opacity_children = content.opacity.line.childWrapper;

		// remove divs
		color_wrapper && Wu.DomUtil.remove(color_wrapper);
		color_children && Wu.DomUtil.remove(color_children);
		opacity_wrapper && Wu.DomUtil.remove(opacity_wrapper);
		opacity_children && Wu.DomUtil.remove(opacity_children);
	},


	// create column targets
	_createTargets : function () {

		console.log('carto()', this.carto());

		// create target field
		this.carto().targets = this.carto().targets || [];

		// // get states
		// var isOn         = (this.carto().color.column === false);
		// var staticVal    = this.carto().color.staticVal || this.options.defaults.color;
		// var val          = this.carto().color.value 	|| this.options.defaults.range;
		// var column       = this.carto().color.column;
		// var minMax       = this.carto().color.range;

		// create wrapper
		var wrapper = Wu.DomUtil.create('div', 'add-target-wrapper', this._wrapper);

		// create (+) box
		var addTarget = Wu.DomUtil.create('div', 'add-target', wrapper);
		addTarget.innerHTML = '<i class="fa fa-plus-circle add-target-icon"></i>';
		addTarget.innerHTML += '<div class="add-target-text">Add column</div>';

		// event
		Wu.DomEvent.on(addTarget, 'click', this._createTargetColumn, this);

		// remember items
		this._content[this.type].targets = {
			wrapper : wrapper,
			addTarget : addTarget,
		}




		// fill already existing values
		if (this.carto().targets.length) {

			var targets = this.carto().targets;

			targets.forEach(function (t) {
				this._createTargetColumn(false, t);
			}, this);
		}







		// // container
		// var line = new Wu.fieldLine({
		// 	id           : 'color',
		// 	appendTo     : this._wrapper,
		// 	title        : '<b>Color</b>',
		// 	input        : false,
		// 	childWrapper : 'point-color-children' // todo: make class for polyugon?
		// });	

		// // dropdown
		// var dropdown = new Wu.button({
		// 	id 	 : 'color',
		// 	type 	 : 'dropdown',
		// 	isOn 	 : isOn,
		// 	right 	 : true,
		// 	appendTo : line.container,
		// 	fn 	 : this._dropdownSelected.bind(this),
		// 	array 	 : this.options.meta, // columns in dropdown
		// 	selected : column, // preselected item
		// });

		// // color ball
		// var ball = new Wu.button({
		// 	id 	 : 'color',
		// 	type 	 : 'colorball',
		// 	right    : true,
		// 	isOn 	 : isOn,
		// 	appendTo : line.container,
		// 	fn       : this._updateColor.bind(this),
		// 	value    : staticVal,
		// 	colors   : this.options.palettes
		// });

		// // remember items
		// this._content[this.type].targets = {
		// 	line : line,
		// 	dropdown : dropdown,
		// 	ball : ball
		// }
// 
		// // save carto
		// this.carto().targets[column] = {
		// 	value 	: val,
		// 	color 	: color,
		// 	opacity	: opacity
		// };
	},



	_createTargetColumn : function (e, options) {

		console.log('this: ', this);

		console.log('_createTargetColumn e optins', e, options);

		var options = options || {
			column : false, // default column
			value : 'loka', // targeted column value
			color : 'red', 	// default color
			opacity : 1, 	// default opacity
		}


		// get columns
		var columnObjects = this.options.columns;
		var columns = [];

		// get column names only
		for (var c in columnObjects) {
			columns.push(c);
		}



		console.log('_createTargetColumn', this._content[this.type].targets);




		// get wrapper
		var wrapper = this._content[this.type].targets.wrapper;

		// create target wrapper
		var target_wrapper = Wu.DomUtil.create('div', 'target-wrapper', wrapper);


		// column wrapper
		var column_wrapper = Wu.DomUtil.create('div', 'target-column-wrapper', target_wrapper);
		var column_title = Wu.DomUtil.create('div', 'target-column-title', column_wrapper, 'Column');
		var column_dropdown = new Wu.button({
			id 	 : 'target',
			type 	 : 'dropdown',
			isOn 	 : true,
			right 	 : true,
			appendTo : column_wrapper,
			fn 	 : this._targetColumnSelected.bind(this),
			array 	 : columns, // columns in dropdown
			selected : options.column, // preselected item
			className : 'target-column-dropdown'
		});

		console.log('coldrop', column_dropdown);

		
		// input value wrapper
		var input_wrapper = Wu.DomUtil.create('div', 'target-input-wrapper', target_wrapper);
		var input_title = Wu.DomUtil.create('div', 'target-input-title', input_wrapper, 'Value');
		var column_input = Wu.DomUtil.create('input', 'target-input', input_wrapper);
		column_input.value = options.value;

		// blur event
		Wu.DomEvent.on(column_input, 'blur', this._targetValueSelected, this);



		// color wrapper
		var color_wrapper = Wu.DomUtil.create('div', 'target-color-wrapper', target_wrapper);
		var input_title = Wu.DomUtil.create('div', 'target-input-title', color_wrapper, 'Color');
		var ball = new Wu.button({
			id 	 : 'target-color',
			type 	 : 'colorball',
			right    : true,
			isOn 	 : true,
			appendTo : color_wrapper,
			fn       : this._targetColorSelected.bind(this),
			value    : options.color,
			colors   : this.options.palettes,
			className : 'target-color-box'
		});


		// opacity wrapper
		var opacity_wrapper = Wu.DomUtil.create('div', 'target-opacity-wrapper', target_wrapper);
		var opacity_title = Wu.DomUtil.create('div', 'target-input-title', opacity_wrapper, 'Opacity');
		var opacity_input = Wu.DomUtil.create('input', 'target-input opacity', opacity_wrapper);
		opacity_input.value = options.opacity;

		// blur event
		Wu.DomEvent.on(opacity_input, 'blur', this._targetOpacitySelected, this);



		// remember
		this._content[this.type].targets.selectors = this._content[this.type].targets.selectors || [];
		this._content[this.type].targets.selectors.push({
			column : column_dropdown,
			value : column_input,
			color : ball,
			opacity : opacity_input
		});

		// set initial values
		this.carto().targets.push({
			column : options.column,
			value : options.value,
			color : options.color,
			opacity : options.opacity
		})

		// move (+) to bottom
		var button = this._content[this.type].targets.addTarget;
		var bwrapper = this._content[this.type].targets.wrapper;
		wrapper.appendChild(button);

		console.log('this: ', this);
	},



	_targetColumnSelected : function (e) {

		// get target index
		var target = e.target;
		var targets = this._content[this.type].targets.selectors;
		var i = _.findIndex(targets, function (t) {
			console.log('t: ', t);
			return t.column._select == target;
		});

		// get value
		var column = target.value;

		// set carto
		this.carto().targets[i].column = column;

		// mark changed
		this.markChanged();
	},

	_targetColorSelected : function (color, id, e) {

		// get target index
		var target = e.target;
		var targets = this._content[this.type].targets.selectors;
		var i = _.findIndex(targets, function (t) {
			return t.color.color == e;
		});

		// set carto
		this.carto().targets[i].color = color;

		// mark changed
		this.markChanged();
	},

	_targetValueSelected : function (e) {

		// get target index
		var target = e.target;
		var targets = this._content[this.type].targets.selectors;
		var i = _.findIndex(targets, function (t) {
			return t.value == e.target;
		});

		// get opacity value
		var value = e.target.value;

		// set carto
		this.carto().targets[i].value = value;

		// mark changed
		this.markChanged();
	},

	_targetOpacitySelected : function (e) {

		// get target index
		var target = e.target;
		var targets = this._content[this.type].targets.selectors;
		var i = _.findIndex(targets, function (t) {
			return t.opacity == e.target;
		});

		// get opacity value
		var opacity_value = parseFloat(e.target.value);

		// set carto
		this.carto().targets[i].opacity = opacity_value;

		// mark changed
		this.markChanged();
	},




});