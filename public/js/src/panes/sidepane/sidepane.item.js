Wu.SidePane.Item = Wu.Class.extend({
        _wu : 'sidepane.item', 
	
	type : 'item',

	initialize : function () {
		Wu.setOptions(this, Wu.app.options);
		this.render();
	},

	render : function () {
		this.initContainer();  // will be lower-most function first, if available (ie. 'this' is context from where fn was run)
		this.initContent();
		this.addHooks();
		this.disable();
	},

	addHooks : function () {
		// menu items bindings
		Wu.DomEvent.on(this._menu, 'mousedown', this._clickActivate, this); // click
		Wu.DomEvent.on(this._menu, 'mouseenter', this._mouseenter, this);   // mouseEnter
		Wu.DomEvent.on(this._menu, 'mouseleave', this._mouseleave, this);   // mouseLeave
	},

	_mouseenter : function (e) {
		Wu.DomUtil.addClass(this._menu, 'red');
	},

	_mouseleave : function (e) {
		Wu.DomUtil.removeClass(this._menu, 'red');
	},

	// if clicking on already active tab, toggle it
	_reclick : function () {

		var __map = Wu.DomUtil.get("map"); // (j)
		var _menusliderArrow = Wu.DomUtil.get("menuslider-arrow"); // (j)

		// if open
		if (Wu.app.SidePane.paneOpen) {

			// hack to hide fullscreen tabs (documents, datalib, users);	
			Wu.DomUtil.removeClass(Wu.app._active, 'show');			
			
			// close pane
			Wu.app.SidePane.closePane();

			// Remove blur on map... (j)
			Wu.DomUtil.removeClass(__map, "map-blur")

			// Remove menuslider arrow (j)
			// _menusliderArrow.style.width = '0px';
		
		// if closed
		} else {
			
			// hack to hide fullscreen tabs (documents, datalib, users);
			Wu.DomUtil.addClass(Wu.app._active, 'show');	// hack
			
			// open pane
			Wu.app.SidePane.openPane();

			// Add menuslider arrow (j)
			// _menusliderArrow.style.width = '9px';


			// Blurs the map on full page panes... (j)
			var clist = Wu.app._active.classList;
			if ( _.contains(clist, 'fullpage-documents') || _.contains(clist, 'data-library') || _.contains(clist, 'fullpage-users') ) {
				Wu.DomUtil.addClass(__map, "map-blur");
			}


		}
	},



	_clickActivate : function (e) {

		// if clicking on already active tab, toggle it
		// if (Wu.app._activeMenu == this) return this._reclick();
		if (Wu.app._activeMenu == this) return;

		// open pane if not closed
		if (!Wu.app.SidePane.paneOpen) Wu.app.SidePane.openPane();

		// continue tab activation
		this.activate();

	},

	activate : function (e) {
		
		// set active menu
		var prev = Wu.app._activeMenu || false;
		Wu.app._activeMenu = this;
		    
		// active content                       
		Wu.app._active = this._content;  
		app._activeMenuItem = this.type;

		// check vertical swipe action    (j)
		this.checkSwipe(prev);

		// add active to menu 		  (j)
		if (prev) { Wu.DomUtil.removeClass(prev._menu, 'active'); }
		Wu.DomUtil.addClass(this._menu, 'active');

		// call deactivate on previous for cleanup  (j)
		if (prev) { prev._deactivate(); };

		// activate local context
		this._activate();

		// update pane
		this.update();   //todo: refactor: now it's _update, _updateContent, refresh all over tha place
	},

	_activate : function () {

	},

	_deactivate : function () {

	},

	// check swipe of sidepane on selecting menu item (j)
	checkSwipe : function (prev) {
		// console.log('checkSwipe -> prev: ', prev);
		if (prev) return this.swiper(prev);

		// Hide the Deactivated Pane
		if (Wu.app._active) Wu.DomUtil.removeClass(Wu.app._active, 'show')                                             

		// Show the Activated Pane                              
		Wu.app._active = this._content;
		Wu.DomUtil.addClass(Wu.app._active, 'show');                                    
	
	},

	// do swipe of sidepane when selecting menu item, by jorgen
	swiper : function (prev) {
		
		// set vars
		var swypefrom = prev._content;
		var swypeto = Wu.app._active;               

		// console.log('prev', prev);
		// console.log('swypefrom', swypefrom);

		// if same, do nothing
		if (swypefrom == swypeto) return;

		// update the slider on the left    
		var h = 70;
		var menuslider = Wu.DomUtil.get('menuslider');
		   
		// get classy
		var classy = this._menu.classList;

		// set width depending on whether pane is open or not
		var open = Wu.app.SidePane.paneOpen;
		var w = '100px';
		if (open) w = '400px';
	
		var __map = Wu.DomUtil.get("map");

		// Make sure that menuslider arrow is there (j)
		var _menusliderArrow = Wu.DomUtil.get("menuslider-arrow"); // (j)
		_menusliderArrow.style.width = '9px'; // (j)


		// check which 
		if (_.contains(classy, 'clients')) {
			menuslider.style.top = '0px';
			Wu.app.SidePane._container.style.width = w;

			Wu.DomUtil.removeClass(__map, "map-blur")
		}

		if (_.contains(classy, 'map')) {
			var n = app.SidePane.panes.indexOf('Map');		// calculate position
			menuslider.style.top = h * n + 'px';
			Wu.app.SidePane._container.style.width = w;

			Wu.DomUtil.removeClass(__map, "map-blur")


		}
	    
		if (_.contains(classy, 'documents')) {
			var n = app.SidePane.panes.indexOf('Documents');
			menuslider.style.top = h * n + 'px';
			Wu.app.SidePane._container.style.width = '100%';

			Wu.DomUtil.addClass(__map, "map-blur")

		}
	    
		if (_.contains(classy, 'dataLibrary')) {
			var n = app.SidePane.panes.indexOf('DataLibrary');
			menuslider.style.top = h * n + 'px';
			Wu.app.SidePane._container.style.width = '100%';

			Wu.DomUtil.addClass(__map, "map-blur")

		}
	    

	    	if (_.contains(classy, 'mediaLibrary')) {
			var n = app.SidePane.panes.indexOf('MediaLibrary');
			menuslider.style.top = h * n + 'px';
			Wu.app.SidePane._container.style.width = '100%';

			Wu.DomUtil.addClass(__map, "map-blur")

		}


		if (_.contains(classy, 'users')) {
			var n = app.SidePane.panes.indexOf('Users');
			menuslider.style.top = h * n + 'px';
			Wu.app.SidePane._container.style.width = '100%';

			Wu.DomUtil.addClass(__map, "map-blur")

		}
				
		
		// Find out what to swipe from
		// The Sliders Container
		var _content_container = document.getElementsByTagName('menu')[0];		// refactor
	    
		// Create some vars
		var swipethis, swfrom, swto, swipeOut, swipeIn;
		
		// Find all the swipeable elements....
		var _under_dogs = _content_container.getElementsByTagName('div');		// refactor
				
		// Find what position the swipe from and to is in the array
		for ( var a = 0; a<_under_dogs.length;a++) {
			if ( _under_dogs[a] == prev._menu ) { swfrom = a; }                 
			if ( _under_dogs[a] == this._menu ) { swto = a; }
		}
		
		// Check if we're swiping up or down
		// if ( swfrom > swto ) {
		// 	swipeOut = 'swipe_out';
		// 	swipeIn = 'swipe_in';						
		// } else {
		// 	swipeOut = 'swipe_out_up';
		// 	swipeIn = 'swipe_in_up';
		// }
		    
		// Hide the Deactivated Pane
		if (Wu.app._active) {

				// console.log('swypefrom', swypefrom);

			    Wu.DomUtil.removeClass(swypefrom, 'show');


			// Wu.DomUtil.addClass(swypefrom, swipeOut);                   
					    
			// // Remove classes from the swiped out element
			// setTimeout(function(){
			// 	Wu.DomUtil.removeClass(swypefrom, 'show');
			// 	Wu.DomUtil.removeClass(swypefrom, swipeOut);
			// }, 300);                                
		};
					
		// Swipe this IN
		Wu.DomUtil.addClass(swypeto, 'show');
		// Wu.DomUtil.addClass(swypeto, swipeIn);              
		
		// setTimeout(function(){
		// 	Wu.DomUtil.removeClass(swypeto, swipeIn);   
		// }, 300);
			
	},


	initContainer : function () {
		// menu
		var className = 'q-editor-menu-item ' + this.type;
		this._menu = Wu.DomUtil.create('div', className, Wu.app._editorMenuPane);
		this._title = Wu.DomUtil.create('a', this.type, this._menu);
		this._title.innerHTML = Wu.Util.capitalize(this.title || this.type);

		// content
		var className = 'q-editor-content-item ' + this.type;
		this._content = Wu.DomUtil.create('div', className, Wu.app._editorContentPane);

		// scroll wrapper (j)
		this._scrollWrapper = Wu.DomUtil.create('div', 'editor-scroll-wrapper', this._content);

		// wrapper 
		this._container = Wu.DomUtil.create('div', 'editor-wrapper ct13', this._scrollWrapper);

	},

	initContent : function () {

	},

	updateContent : function (project) {

	},

	_addHook : function (elem, event, fn, uuid) {
		Wu.DomEvent.on(elem, event, fn, uuid);
	},


	disable : function () {

		// disable click
		Wu.DomEvent.off(this._menu, 'mousedown', this._clickActivate, this); 

		// add disabled class
		Wu.DomUtil.addClass(this._menu, 'disabled');

	},

	enable : function () {

		// enable click
		Wu.DomEvent.on(this._menu, 'mousedown', this._clickActivate, this); 

		// remove disabled class
		Wu.DomUtil.removeClass(this._menu, 'disabled');
	},

	remove : function () {
		delete this._menu;
		delete this._content;
		delete this;
	},

	setContentHeight : function () {
		this.calculateHeight();
		this._content.style.maxHeight = this.maxHeight + 'px';
		this._scrollWrapper.style.maxHeight = parseInt(this.maxHeight - 20) + 'px';
	},

	calculateHeight : function () {
		var screenHeight = window.innerHeight,
		    legendsControl = app.MapPane.legendsControl,
		    height = -107;

		if (legendsControl) {
			height += parseInt(screenHeight) - parseInt(legendsControl._legendsHeight);
		} else {
			height += parseInt(screenHeight) - 6;
		}

		this.maxHeight = height;
	},

});

