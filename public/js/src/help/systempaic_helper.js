var helper = {};
var _TooltipObject = {};

helper = {

	init : function() {		

		// Make the tooltip

		// Tooltip wrapper
		_TooltipObject._HelpTooltip = document.createElement('div');
		_TooltipObject._HelpTooltip.className = 'help-tooltip';

		// Tooltip arrow
		_TooltipObject._HelpTooltip_arrow = document.createElement('div');
		_TooltipObject._HelpTooltip_arrow.className = 'help-tooltip-arrow';

		// Tooltip inner HTML object
		_TooltipObject._HTML = document.createElement('div');
		_TooltipObject._HTML.className = 'help-tooltip-html';

		// Append tooltip arrow
		_TooltipObject._HelpTooltip.appendChild(_TooltipObject._HelpTooltip_arrow);

		// Append tooltip inner HTML object
		_TooltipObject._HelpTooltip.appendChild(_TooltipObject._HTML);

		// Append tooltip to body
		document.getElementsByTagName('body')[0].appendChild(_TooltipObject._HelpTooltip);
		
		// Start mouse position listener
		helper._initListen();


	},

	// Start mouse position listener
	_initListen : function() {
		document.addEventListener('mousemove', helper._listen, false);
	},

	// Stop mouse position listener
	_stopListen : function() {
		document.removeEventListener('mousemove', helper._listen);	
	},

	// The mouse position listener
	_listen : function(e) {

		var mouse = {x: 0, y: 0};
				
		mouse.x = e.clientX || e.pageX; 
		mouse.y = e.clientY || e.pageY 

			_TooltipObject.elementMouseIsOver = document.elementFromPoint(mouse.x, mouse.y);

			if ( _TooltipObject.elementMouseIsOver.className == 'clients' ) 		helper._clients();
			if ( _TooltipObject.elementMouseIsOver.className == 'map' ) 			helper._map();
			if ( _TooltipObject.elementMouseIsOver.className == 'documents' ) 		helper._documents();
			if ( _TooltipObject.elementMouseIsOver.className == 'dataLibrary' ) 		helper._datalibrary();
			if ( _TooltipObject.elementMouseIsOver.className == 'users' ) 			helper._users();


	},

	// Set tooltip position
	toolTipSetPos : function() {

		// Stop Listening
		helper._stopListen();

		// Get position on THIS element (that we're hovering on)
		var _divPosition = _TooltipObject.elementMouseIsOver.getBoundingClientRect();
		
		var _left = _divPosition.left;
		var _right = _divPosition.right;
		var _top = _divPosition.top;
		var _bottom = _divPosition.bottom;
		var _height = _divPosition.height;
		var _width = _divPosition.width;

		// Make tooltip visible
		_TooltipObject._HelpTooltip.style.display = 'block';
		
		// Set tooltip position
		_TooltipObject._HelpTooltip.style.top = _top + _height/2 - (_TooltipObject._HelpTooltip.offsetHeight/2) + 'px';
		_TooltipObject._HelpTooltip.style.left = _right + 15 + 'px';

		// Init mouseleave element on THIS element (that we're hovering on)
		_TooltipObject.elementMouseIsOver.addEventListener("mouseleave", helper._mouseLeave);

	},

	// Re-init mouse position listener
	_mouseLeave : function() {
			
		// Start the listener	
		helper._initListen();

		// Remove the mouse leave listener to THIS object
		_TooltipObject.elementMouseIsOver.removeEventListener("mouseleave", helper._mouseLeave);

		// Hide tooltip
		_TooltipObject._HelpTooltip.style.display = 'none';
			
	},


	// DIFFERENT TOOLTIPS, YO!
	// Making it like this, in separate functons, so that we can choose the size of the tooltip, where the arrow goes, etc.

	// SidePane : PROJECTS
	_clients : function() {

		_TooltipObject._HTML.innerHTML = "Select Clients and Projects. If Admin, you can create new clients and projects here."
		helper.toolTipSetPos();
	
	},

	// SidePane : OPTIONS
	_map : function() {

		_TooltipObject._HTML.innerHTML = "Set options for current project. Create Layer menu, decide controls, etc."
		helper.toolTipSetPos();
	},

	// SidePane : DOCS
	_documents : function() {

		_TooltipObject._HTML.innerHTML = "Text editor where different documents can be created."
		helper.toolTipSetPos();
	
	},

	// SidePane : DATA
	_datalibrary : function() {

		_TooltipObject._HTML.innerHTML = "Files that are connected to the current project."
		helper.toolTipSetPos();
	
	},		

	// SidePane : USERS
	_users : function() {

		_TooltipObject._HTML.innerHTML = "Manage user access to different projects."
		helper.toolTipSetPos();

	},


}
