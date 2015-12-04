Wu.Styler.Point = Wu.Styler.extend({

	type : 'point',

	// creates content of point container
	_createOptions : function () {

		// color
		this._createColor();

		// opacity
		this._createOpacity();

		// pointsize
		this._createPointsize();

		// targets
		this._createTargets();

	},

	_preSelectOptions : function () {

		// open relevant subfields
		this._initSubfields(this.carto().color.column, 'color');
		this._initSubfields(this.carto().opacity.column, 'opacity');
		this._initSubfields(this.carto().pointsize.column, 'pointsize');
	},

	_clearOptions : function () {

		var content = this._content[this.type];

		// return if not content yet
		if (_.isEmpty(content)) return;

		// get divs
		var color_wrapper = content.color.line.container;
		var color_children = content.color.line.childWrapper;
		var opacity_wrapper = content.opacity.line.container;
		var opacity_children = content.opacity.line.childWrapper;
		var pointsize_wrapper = content.pointsize.line.container;
		var pointsize_children = content.pointsize.line.childWrapper;
		var targets 		= content.targets.wrapper;
		

		// remove divs
		color_wrapper && Wu.DomUtil.remove(color_wrapper);
		color_children && Wu.DomUtil.remove(color_children);
		opacity_wrapper && Wu.DomUtil.remove(opacity_wrapper);
		opacity_children && Wu.DomUtil.remove(opacity_children);
		pointsize_wrapper && Wu.DomUtil.remove(pointsize_wrapper);
		pointsize_children && Wu.DomUtil.remove(pointsize_children);
		targets && 		Wu.DomUtil.remove(targets);
	},

	_addPointSizeFields : function (column) {

		// get wrapper
		var childWrapper = this._content[this.type].pointsize.line.childWrapper;

		// clear old
		childWrapper.innerHTML = '';

		// get min/max values
		var minMax  = this.carto().pointsize.range || [1,10];

		// line
		var line = new Wu.fieldLine({
			id        : 'minmaxpointsize',
			appendTo  : childWrapper,
			title     : 'Min/max size',
			input     : false,
			className : 'sub-line'
		});

		// Inputs
		var input = new Wu.button({
			id 	  : 'minmaxpointsize',
			type 	  : 'dualinput',
			right 	  : true,
			appendTo  : line.container,
			value     : minMax,
			fn        : this.savePointSizeDualBlur.bind(this),
			minmax    : minMax,
			tabindex  : [this.tabindex++, this.tabindex++]
		});

		// rememeber 
		this._content[this.type].pointsize.minmax = {
			line : line,
			input : input
		}

		// save carto
		this.carto().pointsize.column  = column;
		this.carto().pointsize.range = minMax;

		this.markChanged();

	},


	// create column targets
	_createTargets : function () {

		// create target field
		this.carto().targets = this.carto().targets || [];

		// create wrapper
		var wrapper = Wu.DomUtil.create('div', 'add-target-wrapper', this._wrapper);

		// create (+) box
		var addTarget = Wu.DomUtil.create('div', 'add-target', wrapper);
		addTarget.innerHTML = '<i class="fa fa-plus-circle add-target-icon"></i>';
		addTarget.innerHTML += '<div id="target-specific-columns-title" class="add-target-text">Target specific columns</div>';

		// event
		Wu.DomEvent.on(addTarget, 'click', this._addTargetColumn, this);

		// remember items
		this._content[this.type].targets = {
			wrapper : wrapper,
			addTarget : addTarget,
		}

		// fill already existing targets
		var targets = this.carto().targets;
		if (targets.length) {

			// add existing targets
			targets.forEach(function (t) {
				this._createTargetColumn(null, t);
			}, this);

			// change button text
			this._changeAddButtonText();
		}

	},

	_changeAddButtonText : function () {
		// change title of button (hacky)
		var button = Wu.DomUtil.get('target-specific-columns-title');
		button.innerHTML = 'Add column';
	},

	_addTargetColumn : function (e) {

		var defaultColumn = this.options.meta[2]; // first column

		// set default options
		var options = {
			column : defaultColumn, // default column
			value : '', 		// targeted column value
			color : 'red', 		// default color
			opacity : 1, 		// default opacity
			width : 5
		}

		// set values
		this.carto().targets.push({
			column : options.column,
			value : options.value,
			color : options.color,
			opacity : options.opacity
		});

		// create column
		this._createTargetColumn(null, options);

		// mark change
		this.markChanged();

		// change button text
		this._changeAddButtonText();
	},



	_createTargetColumn : function (e, options) {

		// get columns
		var columnObjects = this.options.columns;
		var columns = [];

		// get column names only
		for (var c in columnObjects) {
			columns.push(c);
		}

		// head wrapper
		var wrapper = this._content[this.type].targets.wrapper;

		// create target wrapper
		var target_wrapper = Wu.DomUtil.create('div', 'target-wrapper', wrapper);


		// (-) button
		var rembtn_wrapper = Wu.DomUtil.create('div', 'target-remove', target_wrapper);
		rembtn_wrapper.innerHTML = '<i class="fa fa-minus-circle"></i>';
		
		// event
		Wu.DomEvent.on(rembtn_wrapper, 'click', this._removeTarget, this);	

		
		// column dropdown
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


		
		// value input
		var input_wrapper = Wu.DomUtil.create('div', 'target-input-wrapper', target_wrapper);
		var input_title = Wu.DomUtil.create('div', 'target-input-title', input_wrapper, 'Value');
		var column_input = Wu.DomUtil.create('input', 'target-input', input_wrapper);
		column_input.value = options.value;

		// blur event
		Wu.DomEvent.on(column_input, 'blur', this._targetValueSelected, this);



		// color ball
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



		// opacity input
		var opacity_wrapper = Wu.DomUtil.create('div', 'target-opacity-wrapper', target_wrapper);
		var opacity_title = Wu.DomUtil.create('div', 'target-input-title-opacity', opacity_wrapper, 'Opacity');
		var opacity_input = Wu.DomUtil.create('input', 'target-input opacity', opacity_wrapper);
		opacity_input.value = options.opacity;

		// blur event
		Wu.DomEvent.on(opacity_input, 'blur', this._targetOpacitySelected, this);


		// width input
		var width_wrapper = Wu.DomUtil.create('div', 'target-width-wrapper', target_wrapper);
		var width_title = Wu.DomUtil.create('div', 'target-input-title-width', width_wrapper, 'Width');
		var width_input = Wu.DomUtil.create('input', 'target-input width', width_wrapper);
		width_input.value = options.width;

		// blur event
		Wu.DomEvent.on(width_input, 'blur', this._targetWidthSelected, this);


		// remember
		this._content[this.type].targets.selectors = this._content[this.type].targets.selectors || [];
		this._content[this.type].targets.selectors.push({
			column : column_dropdown,
			value : column_input,
			color : ball,
			opacity : opacity_input,
			width : width_input,
			wrapper : target_wrapper
		});


		// move (+) btn to bottom
		var button = this._content[this.type].targets.addTarget;
		var bwrapper = this._content[this.type].targets.wrapper;
		wrapper.appendChild(button);

	},


	_removeTarget : function (e) {

		// get target index
		var target = e.target;
		var targets = this._content[this.type].targets.selectors;
		var i = _.findIndex(targets, function (t) {
			return t.wrapper == target.parentNode.parentNode || t.wrapper == target.parentNode;
		});

		// remove div
		var trg = targets[i];
		var wrapper = trg.wrapper;
		Wu.DomUtil.remove(wrapper);

		// remove from carto
		_.pullAt(this.carto().targets, i);

		// remove from div list
		_.pullAt(targets, i);

		// mark changed
		this.markChanged();

	},


	_targetColumnSelected : function (e) {

		// get target index
		var target = e.target;
		var targets = this._content[this.type].targets.selectors;
		var i = _.findIndex(targets, function (t) {
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

	_targetWidthSelected : function (e) {

		// get target index
		var target = e.target;
		var targets = this._content[this.type].targets.selectors;
		var i = _.findIndex(targets, function (t) {
			return t.width == e.target;
		});

		// get width value
		var width_value = parseFloat(e.target.value);

		// set carto
		this.carto().targets[i].width = width_value;

		// mark changed
		this.markChanged();
	},




});