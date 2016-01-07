Wu.Popup = {};
Wu.Popup.Chart = L.Control.extend({
	includes: L.Mixin.Events,

	options: {
		minWidth: 50,
		maxWidth: 300,
		// maxHeight: null,
		autoPan: true,
		closeButton: true,
		offset: [0, 7],
		autoPanPadding: [0, 0],
		autoPanPaddingTopLeft: L.point(10, 40),
		autoPanPaddingBottomRight: L.point(10, 20),
		keepInView: false,
		className: '',
		zoomAnimation: false,
		defaultPosition : {
			x : 7,			
			y : 6
		}
	},



	initialize: function (options) {

		// set options
		L.setOptions(this, options);
		this._map = app._map;
		this._pane = this.options.appendTo;

		// listen to events
		this._listen();

		// init container
		this._initLayout();
	},

	_addEvents : function () {
		
		this._map.on({
			preclick : this.close
		}, this);
	},

	_removeEvents : function () {
		
		this._map.off({
			preclick : this.close
		}, this);
	},

	_initLayout : function () {

		// create container
		var container = this._container = Wu.DomUtil.create('div', 'leflet-container leaflet-popup leaflet-zoom-hide');

		// close button
		if (this.options.closeButton) {
			var closeButton = this._closeButton = Wu.DomUtil.create('a', 'leaflet-popup-close-button', container);
			closeButton.href = '#close';
			closeButton.innerHTML = '&#215;';
			L.DomEvent.disableClickPropagation(closeButton);
			L.DomEvent.on(closeButton, 'mouseup', this._onCloseButtonClick, this);
		}
		
		// create wrapper
		var wrapper = this._wrapper = L.DomUtil.create('div', 'leaflet-popup-content-wrapper', container);

		// draggable pane
		this._initDraggable();

		// content
		this._contentNode = L.DomUtil.create('div', 'leaflet-popup-content', wrapper);

		// events
		L.DomEvent.disableScrollPropagation(this._contentNode);
		L.DomEvent.on(wrapper, 'contextmenu', L.DomEvent.stopPropagation);

	},

	_onCloseButtonClick : function (e) {
		this.close();
		L.DomEvent.stop(e);
	},

	_add : function () {

		// append
		this._pane.appendChild(this._container);

		// add events
		this._addEvents();

		this._added = true;
	},

	_remove : function () {
		if (!this._added) return;
		
		// remove
		try {
			this._pane.removeChild(this._container);
		} catch (e) {}; // lazy hack
		
		// remove events
		this._removeEvents();
	},

	open : function () {
		// add if not added
		if (!this._added) this._add();
	
		this._map.fire('popupopen')
	},

	close : function () {
		this._map.fire('popupclose')
		this._remove();
	},

	getContent: function () {
		return this._content;
	},

	setContent: function (content) {
		this._content = content;
		this.update();
		return this;
	},

	update: function () {
		if (!this._map) return;

		this._container.style.visibility = 'hidden';

		this._updateContent();
		this._updatePosition();

		this._container.style.visibility = '';
	},

	_updateContent: function () {
		if (!this._content) return;

		if (typeof this._content === 'string') {
			this._contentNode.appendChild(this._content);
		} else {
			while (this._contentNode.hasChildNodes()) {
				this._contentNode.removeChild(this._contentNode.firstChild);
			}
			this._contentNode.appendChild(this._content);
		}
	},

	_updatePosition: function () {

		// set saved position
		var pos = this.getSavedPosition();
		if (pos) return this.setPosition(pos);

		// If left pane is open
		if ( app.Chrome.Left._isOpen ) {
			var dims = app.Chrome.Left.getDimensions();
			var _x = dims.width + 10;
			var _y = this.options.defaultPosition.y;
			var pos = { x : _x, y : _y }	
			return this.setPosition(pos);		
		}

		// If right pane is open
		if ( app.Chrome.Right._isOpen ) {
			var dims = app.Chrome.Right.getDimensions();
			var _x = dims.width + 10;
			var _y = this.options.defaultPosition.y;
			var pos = {  x : _x, y : _y }
			return this.setPosition(pos);
		}		

		// or, set default, set from bottom
		var pos = this.options.defaultPosition;
		this.setPosition(pos);
	},

	getSavedPosition : function () {
		var project = app.activeProject;
		var pos = project.getPopupPosition();
		return pos;
	},

	_initDraggable : function () {

		// create drag pane
		var dragPane = Wu.DomUtil.create('div', 'leaflet-popup-drag', this._wrapper);

		// event
		Wu.DomEvent.on(dragPane, 'mousedown', this._dragStart, this);
	},

	_dragStart : function (e) {

		// get mouse pos offset in relation to popup
		var popupPosition = {
			x : this._container.offsetLeft,
			y : this._container.offsetTop
		}

		var mousePosition = {
			x : e.x,
			y : e.y
		}

		var p = popupPosition;
		var m = mousePosition;

		// calc offset
		this._mouseOffset = {
			x : m.x - p.x,
			y : m.y - p.y
		}

		// set window height
		this._windowDimensions = this._getWindowDimensions();

		// create ghost pane
		this._ghost = Wu.DomUtil.create('div', 'leaflet-popup-ghost', app._appPane);

		// events
		Wu.DomEvent.on(this._ghost, 'mouseup', this._dragStop, this);
		Wu.DomEvent.on(this._ghost, 'mousemove', this._dragging, this);

	},

	_dragStop : function (e) {

		// remove events
		Wu.DomEvent.off(this._ghost, 'mouseup', this._dragStop, this);
		Wu.DomEvent.off(this._ghost, 'mousemove', this._dragging, this);
		
		// remove ghost div
		Wu.DomUtil.remove(this._ghost);

		// save position
		var project = app.activeProject;
		project.setPopupPosition(this._lastPopupPos);
	},

	_dragging : function (e) {

		var window_height = this._windowDimensions.height;

		// calc pos
		var diff = {
			x : e.offsetX - this._mouseOffset.x,
			y : window_height - (e.offsetY - this._mouseOffset.y) - this._container.offsetHeight // todo: calc from bottom instead
		}

		// set pos
		this.setPosition({
			x : diff.x,
			y : diff.y
		});
	},

	_getWindowDimensions : function () {
		
		var dims = {};
		dims.width = window.innerWidth
			|| document.documentElement.clientWidth
			|| document.body.clientWidth;

		dims.height = window.innerHeight
			|| document.documentElement.clientHeight
			|| document.body.clientHeight;
		return dims;
	},

	setPosition : function (position, bottom) {

		// set left
		this._container.style.left = position.x + 'px';

		// set bottom
		this._container.style.bottom = position.y + 'px';

		// remember last pos
		this._lastPopupPos = position;
	},

	_listen : function () {
		Wu.Mixin.Events.on('layerDeleted',    this._onLayerDeleted, this);
		Wu.Mixin.Events.on('layerDisabled',    this._onLayerDeleted, this);
	},

	// clean up
	_onLayerDeleted  : function () {
		this.close();
	},


	
});

Wu.popup = function (options, source) {
	return new Wu.Popup.Chart(options, source);
};
