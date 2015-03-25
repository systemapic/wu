Wu.SidePane.Options.Settings = Wu.SidePane.Options.Item.extend({
	_ : 'sidepane.options.settings', 

	type : 'settings',

	options : {

		// include settings
		// screenshot 	: true,
		socialSharing 	: true,
		documentsPane 	: true,
		dataLibrary 	: true,
		mediaLibrary 	: false,
		// autoHelp 	: true,
		// autoAbout 	: true,
		darkTheme 	: true,
		tooltips 	: true,
		mapboxGL	: false,
		saveState 	: true,


	},

	initLayout : function (container) {

		// container, header, outer
		this._container	= Wu.DomUtil.create('div', 'editor-inner-wrapper editor-map-item-wrap ct12 ct17 ct23', container);
		var h4 		= Wu.DomUtil.create('h4', '', this._container, 'Settings');
		this._outer 	= Wu.DomUtil.create('div', 'settings-outer', this._container);

		// add tooltip
		app.Tooltip.add(h4, 'Enable additional map settings.');
	},

	addHooks : function () {
		Wu.SidePane.Options.Item.prototype.addHooks.call(this)
		Wu.DomEvent.on(this._outer, 'mousedown', Wu.DomEvent.stopPropagation, this);
	},

	removeHooks : function () {
		// todo!!!

		Wu.DomEvent.off(this._outer, 'mousedown', Wu.DomEvent.stopPropagation, this);
	},	

	calculateHeight : function () {
		var num = _.filter(this.options, function (o) { return o; }).length;
		this.maxHeight = num * 30;
		this.minHeight = 0;	
	},

	contentLayout : function () {

		// screenshot
		// social media sharing
		// documents pane
		// data library pane
		// add help/about auto-folders to documents
		// dark/light theme

		var wrapper = Wu.DomUtil.create('div', 'settings-wrapper');

		if (this.options.screenshot) {

			var screenshot = this._contentItem('screenshot', 'Screenshots');
			wrapper.appendChild(screenshot);

			// add tooltip
			app.Tooltip.add(screenshot, 'Enable users to make screenshots of map');

		}
		if (this.options.socialSharing) {

			var socialSharing = this._contentItem('socialSharing', 'Sharing');
			wrapper.appendChild(socialSharing);

			// add tooltip
			app.Tooltip.add(socialSharing, 'Enable social sharing for this map');

		}
		if (this.options.documentsPane) {

			var documentsPane = this._contentItem('documentsPane', 'Documents Pane');
			wrapper.appendChild(documentsPane);

			// add tooltip
			app.Tooltip.add(documentsPane, 'Enable documents pane for this map');

		}
		if (this.options.dataLibrary) {

			var dataLibrary = this._contentItem('dataLibrary', 'Data Library');
			wrapper.appendChild(dataLibrary);

			// add tooltip
			app.Tooltip.add(dataLibrary, 'Enable public data library for this map');

		}
		if (this.options.mediaLibrary) {

			var mediaLibrary = this._contentItem('mediaLibrary', 'Media Library');
			wrapper.appendChild(mediaLibrary);

			// add tooltip
			app.Tooltip.add(mediaLibrary, 'Enable media library for this map');			

		}
		if (this.options.autoHelp) {

			var autoHelp = this._contentItem('autoHelp', 'Add Help');
			wrapper.appendChild(autoHelp);

			// add tooltip
			app.Tooltip.add(autoHelp, 'Add help section to documents');			

		}
		if (this.options.autoAbout) {

			var autoAbout = this._contentItem('autoAbout', 'Add About');
			wrapper.appendChild(autoAbout);

			// add tooltip
			app.Tooltip.add(autoAbout, 'Add about section to documents');			

		}
		if (this.options.darkTheme) {

			var darkTheme = this._contentItem('darkTheme', 'Dark Theme');
			wrapper.appendChild(darkTheme);

			// add tooltip
			app.Tooltip.add(darkTheme, 'Toggle between dark- and light theme');

		}
		if (this.options.tooltips) {

			var tooltips = this._contentItem('tooltips', 'Tooltips');
			wrapper.appendChild(tooltips);

			// add tooltip
			app.Tooltip.add(tooltips, 'Enable this tooltip for the portal');

		}
		if (this.options.mapboxGL) {
			
			var mapboxGL = this._contentItem('mapboxGL', 'MapboxGL');
			wrapper.appendChild(mapboxGL);

			// add tooltip
			app.Tooltip.add(mapboxGL, 'Render map with GL');

		}
		if (this.options.saveState) {
			
			var saveState = this._contentItem('saveState', 'Auto-save View');
			wrapper.appendChild(saveState);

			// add tooltip
			app.Tooltip.add(saveState, 'Automatically save the current map state');

		}

		return wrapper;
	},

	_contentItem : function (setting, title) {

		// create item
		var className 	= 'settings-item settings-item-' + setting,
		    div 	= Wu.DomUtil.create('div', className),
		    titlediv 	= Wu.DomUtil.create('div', 'settings-item-title', div),
		    switchWrap  = Wu.DomUtil.create('div', 'switch', div),
		    input 	= Wu.DomUtil.create('input', 'cmn-toggle cmn-toggle-round-flat', switchWrap),
		    label 	= Wu.DomUtil.create('label', '', switchWrap),
		    id 		= Wu.Util.guid();
		
		// set title etc.
		titlediv.innerHTML = title;
		input.setAttribute('type', 'checkbox');
		if (this._settings[setting]) input.setAttribute('checked', 'checked');
		input.id = id;
		label.setAttribute('for', id);

		// set events
		Wu.DomEvent.on(div, 'click', function (e) {	

			console.log('click, settings', setting);
			
			Wu.DomEvent.stop(e);

			// toggle setting
			this.project.toggleSetting(setting);

			// refresh settings
			this._settings = this.project.getSettings();

			// toggle button
			this._settings[setting] ? input.setAttribute('checked', 'checked') : input.removeAttribute('checked');

			// Google Analytics event tracking
			app.Analytics.ga(['Side Pane', 'Options > Settings: ' + setting]);
			
		}, this);
		 
		// return div
		return div;

	},

	save : function () {
		this.project.setSettings(this._settings);
	},

	update : function () {
		Wu.SidePane.Options.Item.prototype.update.call(this)
		
		// get project settings
		this._settings = this.project.getSettings();

		// create content
		var content = this.contentLayout();
		this._outer.innerHTML = '';
		this._outer.appendChild(content);

	},




});