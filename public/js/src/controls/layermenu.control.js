// app.MapPane.layerMenu

L.Control.Layermenu = L.Control.extend({

	options: {
		position : 'bottomright' 
	},

	onAdd : function (map) {
		var className = 'leaflet-control-layermenu',
		    container = this._innerContainer = L.DomUtil.create('div', className),
		    options   = this.options;

		// add html
		this._layermenuOuter 	= Wu.DomUtil.create('div', 'scroller-frame');
		var _scrollUp 		= Wu.DomUtil.create('div', 'scroll-up', this._layermenuOuter);
		var _innerScroller 	= Wu.DomUtil.create('div', 'inner-scroller', this._layermenuOuter);
		this._content 		= Wu.DomUtil.createId('div', 'layer-menu-inner-content', _innerScroller);

		container.appendChild(this._layermenuOuter);

		// add some divsscroller-frame
		this.initLayout();

		// stops
		Wu.DomEvent.on(container, 'mouseup', Wu.DomEvent.stop, this);

		// nb! content is not ready yet, cause not added to map! 
		return container;

	},


	initLayout : function () {		

		// Create the header    
		this._layerMenuHeader = Wu.DomUtil.createId('div', 'layer-menu-header');
		Wu.DomUtil.addClass(this._layerMenuHeader, 'menucollapser');
		
		// title
		this._layerMenuHeaderTitle = Wu.DomUtil.create('div', 'layer-menu-header-title', this._layerMenuHeader, 'Layers');

		// Create the collapse button
		this._bhattan1 = Wu.DomUtil.createId('div', 'bhattan1');
		Wu.DomUtil.addClass(this._bhattan1, 'dropdown-button rotate270');
		this._layerMenuHeader.appendChild(this._bhattan1);

		// Insert Header at the top
		this._innerContainer.insertBefore(this._layerMenuHeader, this._innerContainer.getElementsByTagName('div')[0]);

		// Create the 'uncollapse' button ... will put in DOM l8r
		this._openLayers = Wu.DomUtil.createId('div', 'open-layers');
		this._openLayers.innerHTML = 'Layers';
		Wu.DomUtil.addClass(this._openLayers, 'leaflet-control ol-collapsed');

		// Append to DOM
		app._map._controlCorners.bottomright.appendChild(this._openLayers);

		// Pick up Elements dealing with the Legends
		if (app.MapPane.legendsControl) {
			this._legendsContainer = app.MapPane.legendsControl._legendsContainer;
			this._legendsCollapser = app.MapPane.legendsControl._legendsCollapser;
		}

		Wu.DomEvent.on(this._bhattan1,   'click', this.closeLayerPane, this);
		Wu.DomEvent.on(this._openLayers, 'click', this.toggleLayerPane, this);     

		// Stop Propagation
		Wu.DomEvent.on(this._openLayers, 'mousedown click dblclick',  Wu.DomEvent.stopPropagation, this);
		Wu.DomEvent.on(this._bhattan1, 'mousedown click dblclick',  Wu.DomEvent.stopPropagation, this);

		// auto-close event
		Wu.DomEvent.on(this._innerContainer, 'mouseenter', this.cancelEditClose, this);
		Wu.DomEvent.on(this._innerContainer, 'mouseleave', this.timedEditClose, this);

		// add extra padding		
		if (!app.MapPane.inspectControl) {
			var corner = app._map._controlCorners.bottomright;
			corner.style.paddingBottom = 6 + 'px';
		}

		// add tooltip
		app.Tooltip.add(this._layerMenuHeaderTitle, 'The layer menu lets you choose what layers you want to be on top of the map', { extends : 'systyle', tipJoint : 'right' });
		app.Tooltip.add(this._bhattan1, 'Minimize the layer menu', { extends : 'systyle', tipJoint : 'left' });		

		// Store when the pane is open/closed ~ so that the legends container width can be calculated
		this._open = true;

		if (app.mobile) {
			// Mobile arrow	
		    	Wu.DomUtil.create('div', 'layers-mobile-arrow', this._innerContainer);
		}

	},

	show : function () {
		Wu.DomUtil.removeClass(this._container, 'displayNone');
	},

	hide : function () {
		Wu.DomUtil.addClass(this._container, 'displayNone');
	},

	// Runs on window resize. Gets called up in app.js
	resizeEvent : function (dimensions) {
		
		// Window max height (minus padding)
		var layersMaxHeight = dimensions.height - 135;

		// Set max height of Layers selector container
		this.setMaxHeight(layersMaxHeight);

	},

	setMaxHeight : function (layersMaxHeight) {

		// Make space for inspect control, if it's there, yo
		var inspectControl = app.MapPane.inspectControl;
		if ( inspectControl ) layersMaxHeight -= 120;

		// Set max height of scroller container
		this._layermenuOuter.style.maxHeight = layersMaxHeight + 'px';

	},	

	cancelEditClose : function () {
		if (!this.editMode) return;

		// cancel close initiated from sidepane layermeny mouseleave
		var timer = app.SidePane.Options.settings.layermenu.closeEditTimer;
		clearTimeout(timer);
		setTimeout(function () {  // bit hacky, but due to 300ms _close delay in sidepane
			var timer = app.SidePane.Options.settings.layermenu.closeEditTimer;
			clearTimeout(timer);
		}, 301);
	},

	timedEditClose : function () {
		if (!this.editMode) return;

		// close after three seconds after mouseleave
		var that = this;
		var timer = app.SidePane.Options.settings.layermenu.closeEditTimer = setTimeout(function () {
			that.disableEdit();
		}, 3000);
	},

	toggleLayerPane : function () {
		this._open ? this.closeLayerPane() : this.openLayerPane();
	},

	// (j)
	closeLayerPane : function () {

		this._open = false;

		// Collapse Wrapper
		app._map._controlCorners.bottomright.style.width = '0px';
		Wu.DomUtil.removeClass(this._openLayers, 'ol-collapsed');
		
		// Slide the LEGENDS
		if (app.MapPane.inspectControl && this._legendsContainer) {
			Wu.DomUtil.removeClass(this._legendsContainer, 'legends-padding-right'); // rem (j)
		}	
		
		// Measure, plus Long & Lat (.leaflet-top.leaflet-right)                
		app._map._controlCorners.topright.style.right = '140px';


		// Google Analytics event tracking
		app.Analytics.ga(['Controls', 'Layers: close']);
	
	},

	// (j)
	openLayerPane : function () {

		this._open = true;

		// Open Wrapper
		app._map._controlCorners.bottomright.style.width = '290px';

		// Close the closer :P
		Wu.DomUtil.addClass(this._openLayers, 'ol-collapsed');
		
		// Slide the LEGENDS
		if ( app.MapPane.inspectControl ) {
			if ( this._legendsContainer ) Wu.DomUtil.addClass(this._legendsContainer, 'legends-padding-right'); // rem (j)
		}
		
		// Measure, plus Long & Lat (.leaflet-top.leaflet-right)                
		app._map._controlCorners.topright.style.right = '295px';                
		
		// If we're on mobile
		if (app.mobile) {

			// Check if legends is open ~ close it when opening layer menu
			if (app.MapPane.legendsControl._isOpen) app.MapPane.legendsControl.MobileCloseLegends();
			if (!app.MapPane.descriptionControl._isClosed) app.MapPane.descriptionControl.mobileClosePane();

		}

		// Google Analytics event tracking
		app.Analytics.ga(['Controls', 'Layers: open']);

	},


	// enter edit mode of layermenu
	enableEdit : function () {
		if (this.editMode) return;

		// Make container visible
		Wu.DomUtil.removeClass(this._parentWrapper, 'displayNone');

		// set editMode
		this.editMode = true;

		// turn off dragging etc. on map
		Wu.app.MapPane.disableInteraction(true);

		// turn off dropzone dragging
		if (app.Dropzone) app.Dropzone.disable();

		// Set attribute draggable to true on all divs
		this.enableDraggable();
		
		// enable drag'n drop in layermenu
		this.enableSortable();

		// set title
		this._layerMenuHeaderTitle.innerHTML = 'Edit Layer Menu';  

		// add edit style
		Wu.DomUtil.addClass(this._innerContainer, 'edit-mode');

		// add the drag'n drop new folder
		this._insertMenuFolder();

		// open all items in layermenu
		this.openAll();

	},


	// exit edit mode 
	disableEdit : function () {
		if (!this.editMode) return;

		if (!this.project.store.layermenu || this.project.store.layermenu.length == 0 ) {
			// Hide parent wrapper if empty
			Wu.DomUtil.addClass(this._parentWrapper, 'displayNone');
		}		

		// set editMode
		this.editMode = false;
		
		// re-enable dragging etc. on map
		Wu.app.MapPane.enableInteraction(true);

		// turn off dropzone dragging
		if (app.Dropzone) app.Dropzone.enable();

		// Set attribute draggable to true on all divs
		this.disableDraggable();		
		
		// disable layermenu sorting
		this.disableSortable();

		// set title
		this._layerMenuHeaderTitle.innerHTML = 'Layers';  

		// remove edit style
		Wu.DomUtil.removeClass(this._innerContainer, 'edit-mode');

		// remove new drag'n drop folder
		this._removeMenuFolder();
		
	},
	

	_insertMenuFolder : function () {
		
		// add menu folder item
		if (!this._menuFolder) {

			// create if not exists
			this._menuFolder = Wu.DomUtil.create('div', 'smap-button-white middle-item ct12 ct18', this._innerContainer, 'Add folder');

			// insert
			this._layerMenuHeader.parentNode.insertBefore(this._menuFolder, this._layerMenuHeader.nextSibling);

			// add action
			Wu.DomEvent.on(this._menuFolder, 'click', this.addMenuFolder, this);

		} else {
			// show
			Wu.DomUtil.removeClass(this._menuFolder, 'displayNone');
		}

	},

	_removeMenuFolder : function () {
		if (!this._menuFolder) return;
		Wu.DomUtil.addClass(this._menuFolder, 'displayNone');
	},

	enableSortable : function () {
		this.initSortable();
	},

	disableSortable : function () {
		this.resetSortable();
	},

	refreshSortable : function () {
		this.resetSortable();  
		this.initSortable();
	},

	initSortable : function () {
	
		// iterate over all layers
		var items = document.getElementsByClassName('layer-menu-item-wrap');
		for (var i = 0; i < items.length; i++) {
			var el = items[i];
			
			// set attrs
			// el.setAttribute('draggable', 'true');
			
			// set dragstart event
			Wu.DomEvent.on(el, 'dragstart', this.drag.start, this);
		};

		// set hooks
		// var bin = Wu.DomUtil.get('layer-menu-inner-content');
		var bin = this._content;
		if (bin) {
			Wu.DomEvent.on(bin, 'dragover',  this.drag.over,  this);
			Wu.DomEvent.on(bin, 'dragleave', this.drag.leave, this);
			Wu.DomEvent.on(bin, 'drop', 	 this.drag.drop,  this);
		} 


	},

	enableDraggable : function () {

		// iterate over all layers
		var items = document.getElementsByClassName('layer-menu-item-wrap');
		for (var i = 0; i < items.length; i++) {
			var el = items[i];
			
			// set attrs
			el.setAttribute('draggable', true);
		};
	},

	disableDraggable : function () {
		
		// iterate over all layers
		var items = document.getElementsByClassName('layer-menu-item-wrap');
		for (var i = 0; i < items.length; i++) {
			var el = items[i];
			
			// set attrs
			el.setAttribute('draggable', false);
		};		
	},

	resetSortable : function () {

		// remove hooks
		// var bin = Wu.DomUtil.get('layer-menu-inner-content');
		var bin = this._content;
		if (!bin) return;
		
		Wu.DomEvent.off(bin, 'dragover',  this.drag.over,  this);
		Wu.DomEvent.off(bin, 'dragleave', this.drag.leave, this);
		Wu.DomEvent.off(bin, 'drop', 	  this.drag.drop,  this);
	
	},

	// dragging of layers to layermenu
	drag : {

		start : function (e) {
			var el = e.target;
			
			// add visual feedback on dragged element
			Wu.DomUtil.addClass(el, 'dragged-ghost');

			var uuid = el.id;
			this.drag.currentDragElement = el;
			this.drag.currentDragUuid = uuid;
			this.drag.startDragLevel = this.layers[uuid].item.pos;
			
			e.dataTransfer.setData('uuid', uuid); // set *something* required otherwise doesn't work

			return false;
		},

		drop : function (e) {
			
			var uuid = e.dataTransfer.getData('uuid');
			var el = document.getElementById(uuid);

			// remove visual feedback on dragged element
			Wu.DomUtil.removeClass(el, 'dragged-ghost');

			// get new position in layermenu array
			var nodeList = Array.prototype.slice.call(this._content.childNodes);
			
			var newIndex = nodeList.indexOf(el);
			var oldIndex = _.findIndex(this.project.store.layermenu, {uuid : uuid});
			
			// move in layermenu array
			this.project.store.layermenu.move(oldIndex, newIndex);

			// save
			this.save();

			// reset
			this.drag.currentDragElement = null;
			this.drag.currentDragLevel = null;
			this.movingX = false;

			return false; // irrelevant probably
		},

		over : function (e) {
			if (e.preventDefault) e.preventDefault(); // allows us to drop

			// set first offset
			if (!this.movingX) this.movingX = e.layerX;
			
			// calculate offset
			var offsetX = e.layerX - this.movingX;

			return false;
		},

		leave : function (e) {
			
			// get element over which we're hovering
			var x = e.clientX;
			var y = e.clientY;
			var target = document.elementFromPoint(x, y);
			var element = this.drag.currentDragElement;

			// return if not layerItem
			var type = target.getAttribute('type');
			if (type != 'layerItem') return;

			// move element
			this.drag.moveElementNextTo(element, target);

			return false;
		},

		moveElementNextTo : function (element, elementToMoveNextTo) {
			elementToMoveNextTo = elementToMoveNextTo.parentNode;
			if (this.isBelow(element, elementToMoveNextTo)) {
				// Insert element before to elementToMoveNextTo.
				elementToMoveNextTo.parentNode.insertBefore(element, elementToMoveNextTo);
			}
			else {
				// Insert element after to elementToMoveNextTo.
				elementToMoveNextTo.parentNode.insertBefore(element, elementToMoveNextTo.nextSibling);
			}

		},

		isBelow : function (el1, el2) {
			var parent = el1.parentNode;
			if (el2.parentNode != parent) return false;
			var cur = el1.previousSibling;
			while (cur && cur.nodeType !== 9) {
				if (cur === el2) return true;
				cur = cur.previousSibling;
			}
			return false;
		},

		

	},

	_isFolder : function (item) {
		var layer = this.layers[item.uuid];
		if (layer.layer) return false;
		return true;
	},

	markInvalid : function (invalids) {
		invalids.forEach(function (invalid) {

			// get div
			var div = this.layers[invalid.uuid].el;
			Wu.DomUtil.addClass(div, 'invalidLayermenuitem');

		}, this)
	},

	clearInvalid : function () {
		for (l in this.layers) {
			var layer = this.layers[l];
			Wu.DomUtil.removeClass(layer.el, 'invalidLayermenuitem');
		}
	},


	// check logic
	checkLogic : function () {

		// clear prev invalids
		this.clearInvalid();

		// vars
		var array = this.project.store.layermenu;
		var invalid = [];

		// iterate each layermenuitem
		array.forEach(function (item, i, arr) {

			// rule #1: first item must be at pos 0;
			if (i==0) {
				if (item.pos != 0) {
					return invalid.push(item); // must be 
				}
				return invalid;
			} 

			// rule #2: if item is folder, then it must be at same or lower level than previous (not higher)
			if (item.folder) {	
				var thislevel = item.pos;
				var prevlevel = arr[i-1].pos;
				if (thislevel > prevlevel) {
					return invalid.push(item);
				}
			}

			// rule #3: if item is deeper than previous, previous must be a folder
			var thislevel = parseInt(item.pos);
			var prevlevel = parseInt(arr[i-1].pos);
			if (thislevel > prevlevel) {
				if (!arr[i-1].folder) {
					return invalid.push(item);
				}
			}

			// rule #4: if item is deeper than previous, must not be more than one level difference
			if (parseInt(thislevel) > (parseInt(prevlevel + 1))) {
				return invalid.push(item);
			}

		}, this);

		// mark invalid items
		this.markInvalid(invalid);

		// return
		return invalid;

	},

	updateLogic : function () {

		// get vars
		var array = this.project.store.layermenu;
		this._logic = this._logic || {};

		// create logic from array
		array.forEach(function (item1, i) {
			// return if not a folder
			if (!this._isFolder(item1)) return;

			var pos 	= item1.pos; 	// eg 0 for first level
			var toClose 	= []; 		// all below this pos
			var toOpen 	= []; 		// all div's to be opened (all on one level below, not more)
			var ready 	= false;

			// fill toClose with all items until hits next item on same level (eg. 0)
			_.each(array, function(item2, i) {

				// hit self, start on next iteration
				if (item1.uuid == item2.uuid) ready = true; 
				
				if (ready) {

					if (parseInt(item2.pos) > parseInt(pos)) {
						var div = this.layers[item2.uuid].el;
						toClose.push(div);
					}

					// break iteration on condition
					if (parseInt(item2.pos) == parseInt(pos) && item1.uuid != item2.uuid) return false; 
				}

			}, this);

			ready = false;
			
			// fill toOpen with all elements on +1 level
			_.each(array, function (item3, i) {

				if (ready) {

					if (parseInt(item3.pos) == parseInt(pos) + 1) {
						var div = this.layers[item3.uuid].el;
						toOpen.push(div);
					}
				
					if (parseInt(item3.pos) == parseInt(pos)) return false;
				}

				if (item1.uuid == item3.uuid) ready = true; // hit self, start on next iteration

			}, this);


			// keep isOpen value
			if (this._logic[item1.uuid]) {
				var isOpen = this._logic[item1.uuid].isOpen || false;
			} else {
				var isOpen = true;
			}
			
			// save logic
			this._logic[item1.uuid] = {
				toOpen  : toOpen,   // div's to be closed (all below)
				toClose : toClose,  // div's to be opened (all on first level, but not further level folders and contents)
				isOpen  : isOpen
			}

		}, this);


	},

	enforceLogic : function (layerItem) {
		var uuid = layerItem.item.uuid;
		var item = this._logic[uuid];
		
		// close	
		if (item.isOpen) {
			var panes = item.toClose;

			// add classes
			panes.forEach(function (pane) {
				Wu.DomUtil.addClass(pane, 'layeritem-closed')
				Wu.DomUtil.removeClass(pane, 'layeritem-open');

				// mark closed folder as closed
				var id = pane.id;
				if (this._logic[id] && this._logic[id].isOpen) this._logic[id].isOpen = false;

			}, this);

			// mark closed
			this._logic[uuid].isOpen = false;

		// open
		} else {
			var panes = item.toOpen;

			// add classes
			panes.forEach(function (pane) {
				Wu.DomUtil.removeClass(pane, 'layeritem-closed')
				Wu.DomUtil.addClass(pane, 'layeritem-open');
			}, this);

			// mark open
			this._logic[uuid].isOpen = true;
		}
	},


	closeAll : function () {
		this.updateLogic();
		for (l in this._logic) {
			var item = this.layers[l];
			this._logic[l].isOpen = true;
			this.enforceLogic(item);
		}
	},

	openAll : function () {
		this.updateLogic();
		for (l in this._logic) {
			var item = this.layers[l];
			this._logic[l].isOpen = false;
			this.enforceLogic(item);
		}
	},

	// open/close subfolders
	toggleFolder : function (layerItem) {
		this.updateLogic();	
		this.enforceLogic(layerItem);
	},

	toggleLayer : function (item) {
		if (this.editMode) return;

		var layer = item.layer;
		var _layerName = layer ? layer.getTitle() : 'Folder';

		// toggle
		if (item.on) {
			this.disableLayer(item);
			// Google Analytics event tracking
			app.Analytics.ga(['Controls', 'Layer hide: ' + _layerName ]);
		} else {
			this.enableLayer(item);
			// Google Analytics event tracking
			app.Analytics.ga(['Controls', 'Layer show: ' + _layerName ]);
		}    

	},

	_enableLayer : function (layerUuid) {

		// get layerItem
		var layerItem = _.find(this.layers, function (l) {
			return l.item.layer == layerUuid;
		});
	
		// mark active
		Wu.DomUtil.addClass(layerItem.el, 'layer-active');
		layerItem.on = true;

	},
		
	enableLayer : function (layerItem) {

		var layer = layerItem.layer;

		// folder click
		if (!layer) return this.toggleFolder(layerItem); 
			
		// add layer to map
		layer.add();
		layerItem.on = true;


		// add active class
		Wu.DomUtil.addClass(layerItem.el, 'layer-active');

	},

	// disable by layermenuItem
	disableLayer : function (layermenuItem) {

		var layer = layermenuItem.layer;
		if (!layer) return;

		this._disableLayer(layer);
	},

	// disable by layer
	_disableLayer : function (layer) {

		// get layermenuItem
		var layermenuItem = this._getLayermenuItem(layer.store.uuid);
		
		// remove layer
		layer.remove();
		layermenuItem.on = false;

		// remove active class
		Wu.DomUtil.removeClass(layermenuItem.el, 'layer-active');
	},

	_getLayermenuItem : function (layerUuid) {
		var layermenuItem = _.find(this.layers, function (l) { return l.item.layer == layerUuid; });
		return layermenuItem;
	},

	// layer deleted from project, remove layermenuitem
	onDelete : function (layer) {
		if (!layer) return console.error('No layer!');
		var uuid = layer.getUuid();
		var layermenuItem = this._getLayermenuItem(uuid);

		// remove from dom in layermenu
		if (layermenuItem) {
			var elem = layermenuItem.el;
			if (elem) elem.parentNode.removeChild(elem);
		}
	},

	// turn off a layer from options
	remove : function (uuid) {				// todo: clean up layers vs layermenuitems, see _getLayermenuItem above
		
		// get layermenuItem
		var layermenuItem = this.layers[uuid];

		// remove from DOM
		var elem = layermenuItem.el;
		if (elem) elem.parentNode.removeChild(elem);

		// set inactive in sidepane layermenu
		if (layermenuItem.layer) app.SidePane.Options.settings.layermenu._off(layermenuItem.layer);

		// remove layer from map
		var layer = layermenuItem.layer;
		if (layer) layer.remove();

		// remove from store
		delete this.layers[uuid];

		// remove from layermenu
		_.remove(this.project.store.layermenu, function (item) { return item.uuid == uuid; });

		// save
		this.save();

		// update Options pane
		var baseLayer = app.SidePane.Options.settings.baselayer;
		var layerMenu = app.SidePane.Options.settings.layermenu;
		if (baseLayer) baseLayer.markOccupied();
		if (layerMenu) layerMenu.markOccupied();

	},

	removeLayermenuItem : function () {

	},

	removeLayer : function (layerUuid) {

	},


	// remove initiated from sidepane
	_remove : function (uuid) {
		// find layermenuItem uuid
		var layermenuItem = this._getLayermenuItem(uuid); // uuid: layer-q2e321-qweeqw-dasdas
		this.remove(layermenuItem.item.uuid);
	},

	// add from sidepane
	add : function (layer) {
		
		// create db item
		var item = {
			uuid 	: 'layerMenuItem-' + Wu.Util.guid(), // layermenu item uuid
			layer   : layer.store.uuid, // layer uuid or _id
			caption : layer.store.title, // caption/title in layermenu
			pos     : 0, // position in menu
			zIndex  : 1,
			opacity : 1,
		}

		var layerItem = {
			item  : item,
			layer : layer
		}

		// add
		this._add(layerItem);

		// save
		this.project.store.layermenu.push(item);
		this.save();

	},

	_add : function (layerItem) {		

		var item  = layerItem.item;
		var layer = layerItem.layer;

		// create div
		var className   = 'layer-menu-item-wrap';
		if (!layer) className += ' menufolder';
		var wrap 	= Wu.DomUtil.create('div', className);
		var uuid 	= item.uuid;
		

		// For some reason, HTML must come as string. 
		var _iH = 	'<div class="layer-item-up">></div>' +
			  	'<div class="layer-item-down"><</div>' +
				'<div class="layer-item-delete">x</div>' +
				'<div type="layerItem" class="layer-menu-item">' +
				item.caption +
				'</div>';

		wrap.innerHTML 	= _iH;

		wrap.id 	= uuid;
		Wu.DomUtil.addClass(wrap, 'level-' + item.pos);

		// mark as draggable if we're in editing mode
		if ( this.editMode ) { wrap.setAttribute('draggable', true) }
		else { wrap.setAttribute('draggable', false); }

	
		this._content.appendChild(wrap); 	// append to layermenu

		// get elems
		var up    = wrap.children[0];
		var down  = wrap.children[1];
		var del   = wrap.children[2];
		var inner = wrap.children[3];

		// add hooks
		Wu.DomEvent.on(up,   'click', function (e) { this.upFolder(uuid); 	  }, this);
		Wu.DomEvent.on(down, 'click', function (e) { this.downFolder(uuid); 	  }, this);
		Wu.DomEvent.on(del,  'click', function (e) { this.deleteMenuFolder(uuid); }, this);
		Wu.DomEvent.on(inner, 'dblclick', function (e) { this._editFolderTitle(uuid); },this);

		// prevent layer activation
		Wu.DomEvent.on(up,   'mousedown', Wu.DomEvent.stop, this);
		Wu.DomEvent.on(down, 'mousedown', Wu.DomEvent.stop, this);
		Wu.DomEvent.on(del,  'mousedown', Wu.DomEvent.stop, this);

		// Stop Propagation
		Wu.DomEvent.on(this._container, 'touchstart mousedown click dblclick',  Wu.DomEvent.stopPropagation, this);

		// add elem to item object
		layerItem.el = wrap;

		// add hooks // pass item object to toggle
		Wu.DomEvent.on(wrap, 'mousedown', function (e) { this.toggleLayer(layerItem); }, this);
		Wu.DomEvent.on(this._innerContainer, 'dblclick', Wu.DomEvent.stop, this);

		// refresh sorting
		this.refreshSortable();

		// add to local store
		this.layers[item.uuid] = layerItem;

	},


	getLayers : function () {
		return this.layers;
	},
	
	_fill : function () {

		// Get parent wrapper
		this._parentWrapper = this._container.parentNode;

		// return if empty layermenu
		if (!this.project.store.layermenu || this.project.store.layermenu.length == 0 ) {

			// Hide parent wrapper if empty
			Wu.DomUtil.addClass(this._parentWrapper, 'displayNone');

			return;

		}

		// Show parent wrapper if not empty
		Wu.DomUtil.removeClass(this._parentWrapper, 'displayNone');

		// iterate layermenu array and fill in to layermenu
		this.project.store.layermenu.forEach(function (item) {

			// get wu layer
			var layer = _.find(this.project.layers, function (l) { return l.store.uuid == item.layer; });

			var layerItem = {
				item : item,
				layer : layer
			}

			// add to layermenu
			this._add(layerItem);

		}, this);
	},


	addMenuFolder : function () {
		this.addFolder();		// todo: remove
	},

	_addMenuFolder : function () {
		this._addFolder();		// todo: remove
	},

	addFolder : function () {

		var folder = {
			uuid : 'layerMenuItem-' + Wu.Util.guid(), // unique id for layermenu item
			caption : 'New folder',
			pos : 0,
			folder : true
		}

		var layerItem = {
			item : folder, 
			layer : false
		}

		// this._addFolder(folder);
		this._add(layerItem);

		// save to server
		this.project.store.layermenu.push(folder);
		this.save();

	},



	_editFolderTitle : function (uuid) {
		if (!this.editMode || this.currentlyEditing) return;

		this.currentlyEditing = true;

		var layerItem = this.layers[uuid];
		var folder = layerItem.el.children[3];

		// inject <input>
		var title = folder.innerHTML;
		folder.innerHTML = '';
		var input = Wu.DomUtil.create('input', 'layer-item-title-input');
		input.value = title;
		folder.appendChild(input);

		// focus
		input.focus();

		// add blur hook
		Wu.DomEvent.on(input, 'blur', function () {
			
			// remove
			var newTitle = input.value;
			Wu.DomUtil.remove(input);
			folder.innerHTML = newTitle;
			
			// save
			var i = _.findIndex(this.project.store.layermenu, {'uuid' : uuid});
			this.project.store.layermenu[i].caption = newTitle;
			this.save();

			// boolean
			this.currentlyEditing = false;

		}, this);

		// add keyp hooks
		Wu.DomEvent.on(input, 'keydown', function (e) {
			if (event.which == 13 || event.keyCode == 13) input.blur(); // enter
			if (event.which == 27 || event.keyCode == 27) input.blur(); // esc
		}, this);

	},


	upFolder : function (uuid) {

		// get element
		var wrap = this.layers[uuid].el;

		// get current x pos
		var i   = _.findIndex(this.project.store.layermenu, {'uuid' : uuid});
		var pos = parseInt(this.project.store.layermenu[i].pos);

		// set new pos
		var newpos = pos + 1;
		this.project.store.layermenu[i].pos = newpos;

		// add class
		Wu.DomUtil.addClass(wrap, 'level-' + newpos);
		Wu.DomUtil.removeClass(wrap, 'level-' + pos);

		// save
		this.save();
	},

	downFolder : function (uuid) {	// refactor, same as upFolder

		// get element
		var wrap = this.layers[uuid].el;

		// get current x pos
		var i   = _.findIndex(this.project.store.layermenu, {'uuid' : uuid});
		var pos = parseInt(this.project.store.layermenu[i].pos);

		// set new pos
		var newpos = pos - 1;
		this.project.store.layermenu[i].pos = newpos;

		// add class
		Wu.DomUtil.addClass(wrap, 'level-' + newpos);
		Wu.DomUtil.removeClass(wrap, 'level-' + pos);

		// save
		this.save();

	},

	deleteMenuFolder : function (uuid) {
		// remove
		this.remove(uuid); // layerMenuItem-32132-123123-adsdsa-sda
	},


	save : function () {
		var that = this;

		// check if valid logic
		var invalid = this.checkLogic();
		if (invalid.length) return console.error('not valid layermenu!', invalid);

		// clear timer
		if (this.saveTimer) clearTimeout(this.saveTimer);

		// save on timeout
		this.saveTimer = setTimeout(function () {
			that.project._update('layermenu');
		}, 1000);       // don't save more than every goddamed second

	},

	update : function (project) {

		// get vars
		this.project  = project || Wu.app.activeProject;
		this.layers   = {};
		
		// create layermenu
		this._fill();

		// close by default
		this.closeAll();

		// prevent map scrollzoom
		var map = app._map;
		Wu.DomEvent.on(this._container, 'mouseenter', function () {
		   map.scrollWheelZoom.disable();
		}, this);

		Wu.DomEvent.on(this._container, 'mouseleave', function () {
		    map.scrollWheelZoom.enable();
		}, this);


		// Check window height
		var layersMaxHeight = window.innerHeight - 135;

		// Set max height of Layers selector container
		this.setMaxHeight(layersMaxHeight);
	
	}
});

L.control.layermenu = function (options) {
	return new L.Control.Layermenu(options);
};