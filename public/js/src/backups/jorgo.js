
// Super Pølsing fra Jølle her

// Kjører denne som trigger når man går inn i et prosjekt. 
// Det ble litt kjedelig å srkive dadio() all the time, namean?


window.onload = function() {


	
	
// For Jorgo to Projects

// The Sliders Container
var _content_container = document.getElementsByTagName('content')[0];

// Find all the swipeable elements....
var _under_dogs = _content_container.getElementsByTagName('div');
for ( var a = 0; a<_under_dogs.length;a++) {
	if ( Wu.DomUtil.hasClass(_under_dogs[a], 'clients') ) 		{ _clients = _under_dogs[a] }
	if ( Wu.DomUtil.hasClass(_under_dogs[a], 'projects') ) 		{ _projects = _under_dogs[a] }
	if ( Wu.DomUtil.hasClass(_under_dogs[a], 'map') ) 			{ _map = _under_dogs[a] }
	if ( Wu.DomUtil.hasClass(_under_dogs[a], 'layers') )	 	{ _layers = _under_dogs[a] }
	if ( Wu.DomUtil.hasClass(_under_dogs[a], 'documents') ) 	{ _documents = _under_dogs[a] }
	if ( Wu.DomUtil.hasClass(_under_dogs[a], 'dataLibrary') ) 	{ _dataLibrary = _under_dogs[a] }		
	if ( Wu.DomUtil.hasClass(_under_dogs[a], 'users') )			{ _users = _under_dogs[a] }		
}


var menuslider = document.createElement('div');
	menuslider.id = 'menuslider';
	
	document.getElementsByTagName('menu')[0].appendChild(menuslider);
}

var _clients, _projects, _map, _layers, _documents, _dataLibrary, _users;	









// Swipe, yo

function swypeTo(_swypeTo) {

	var hheeiigghhtt = 70;

	if ( Wu.DomUtil.hasClass(_swypeTo, 'clients' ) ) {
		menuslider.style.top = '0px';
	}

	if ( Wu.DomUtil.hasClass(_swypeTo, 'projects' ) ) {
		menuslider.style.top = hheeiigghhtt * 1 + 'px';
	}

	if ( Wu.DomUtil.hasClass(_swypeTo, 'map' ) ) {
		menuslider.style.top = hheeiigghhtt * 2 + 'px';
	}

	if ( Wu.DomUtil.hasClass(_swypeTo, 'layers' ) ) {
		menuslider.style.top = hheeiigghhtt * 3 + 'px';
	}

	if ( Wu.DomUtil.hasClass(_swypeTo, 'documents' ) ) {
		menuslider.style.top = hheeiigghhtt * 4 + 'px';
	}

	if ( Wu.DomUtil.hasClass(_swypeTo, 'dataLibrary' ) ) {
		menuslider.style.top = hheeiigghhtt * 5 + 'px';
	}

	if ( Wu.DomUtil.hasClass(_swypeTo, 'users' ) ) {
		menuslider.style.top = hheeiigghhtt * 6 + 'px';
	}
	
	



	// Find out what to Swipe from, yo
	// The Sliders Container
	var _content_container = document.getElementsByTagName('content')[0];
	
	var swipethis, swfrom, swto;
	
	// Find all the swipeable elements....
	var _under_dogs = _content_container.getElementsByTagName('div');
	
	// Find the active one by detecting the 'show' class name
	for ( var a = 0; a<_under_dogs.length;a++) {

		if ( _under_dogs[a] == _swypeTo ) {
			swfrom = a;
		}		
				
		if ( Wu.DomUtil.hasClass(_under_dogs[a], 'show') ) { 
			swto = a;
			swipethis = _under_dogs[a];
		}		
	}

	// Check if we're swiping up or down
	if ( swfrom > swto ) {
		swipeitdown();		
	} else {
		swipeitup();
	}


	// Swipe upwards
	function swipeitup() {
		// Swipe this OUT
		Wu.DomUtil.addClass(swipethis, 'swipe_out_up');
		
		// Remove classes from the swiped out element
		setTimeout(function(){
			Wu.DomUtil.removeClass(swipethis, 'swipe_out_up');
			Wu.DomUtil.removeClass(swipethis, 'show');		
		}, 300);								
			
		
		// Swipe this IN
		Wu.DomUtil.addClass(_swypeTo, 'show swipe_in_up');
		setTimeout(function(){
			Wu.DomUtil.removeClass(_swypeTo, 'swipe_in_up');	
		}, 300);
	}


	// Swipe downwards
	function swipeitdown() {
		// Swipe this OUT
		Wu.DomUtil.addClass(swipethis, 'swipe_out');
		
		// Remove classes from the swiped out element
		setTimeout(function(){
			Wu.DomUtil.removeClass(swipethis, 'swipe_out');
			Wu.DomUtil.removeClass(swipethis, 'show');		
		}, 300);								
			
		
		// Swipe this IN
		Wu.DomUtil.addClass(_swypeTo, 'show swipe_in');	
		setTimeout(function(){
			Wu.DomUtil.removeClass(_swypeTo, 'swipe_in');	
		}, 300);
	}
}







// Jorgen's pølsekodein

// For height transition purposes ~ takes the height of the inner wrapper and sets it for the outer wrapper

// Depends on the following CSS
// height: 0;
// overflow: hidden;	
// + transitions

function transheight(wrapelm, plussno, add) {
	if ( add ) {
		var hh = wrapelm.getElementsByTagName('div')[0].offsetHeight + plussno;
		wrapelm.style.height = hh + 'px';
	} else {
		wrapelm.style.height = '0px';					
	}
}
			






// PROJECTS: Toggle between list and box view 



// Go to LIST VIEW
var edit_projects_sort_by_right = document.getElementById("editor-projects-sort-by-right");

edit_projects_sort_by_right.onclick = function () {

	var _iitems = document.getElementById("editor-projects-container");
	var _zitems = _iitems.getElementsByTagName("div");	
		
	// Go through all DIV's in .editor-projects-container
	for ( var counter = 0; counter<_zitems.length;counter++) {		

		// Match with classname
		if ( _zitems[counter].className == 'editor-projects-item' || _zitems[counter].className == 'editor-projects-item active' ) {

			// Swipe out all DIV's with .editor-projects-item as class name
			_zitems[counter].className = "editor-projects-item swipe_left";
		}
	}
	
	
	
	setTimeout(function(){
	
		
	
		// Set back class name
		for ( var cntr = 0; cntr<_zitems.length;cntr++) {

			if ( _zitems[cntr].className == 'editor-projects-item swipe_left' ) {	
				_zitems[cntr].className = "editor-projects-item";
			}

			if ( _zitems[cntr].className == 'project-edit-button box' ) {	
				_zitems[cntr].className = "project-edit-button list";
			}


		}	
	
		var _list = document.getElementById("editor-projects-container");
			_list.className = "list_view";		
	
	}, 150);		
	
	
	
}


// Go to BOX VIEW
var edit_projects_sort_by_left = document.getElementById("editor-projects-sort-by-left");

edit_projects_sort_by_left.onclick = function() {

	var _iitems = document.getElementById("editor-projects-container");
	var _zitems = _iitems.getElementsByTagName("div");

	// Go through all DIV's in .editor-projects-container
	for ( var counter = 0; counter<_zitems.length;counter++) {		

		// Match with classname
		if ( _zitems[counter].className == 'editor-projects-item' || _zitems[counter].className == 'editor-projects-item active' ) {

			// Swipe out all DIV's with .editor-projects-item as class name
			_zitems[counter].className = "editor-projects-item swipe_left";
		}
	}


	setTimeout(function(){
	
		// Set back class name
		for ( var cntr = 0; cntr<_zitems.length;cntr++) {

			if ( _zitems[cntr].className == 'editor-projects-item swipe_left' ) {	
				_zitems[cntr].className = "editor-projects-item";
			}
			
			if ( _zitems[cntr].className == 'project-edit-button list' ) {	
				_zitems[cntr].className = "project-edit-button box";
			}
			
		}	
	
		var _list = document.getElementById("editor-projects-container");
			_list.className = "";		
	
	}, 150);	
	
	

}
		
		

// MAP: Smooth drop down yo

var coordinate_state = false;

var editor_map_initpos_coordinates = document.getElementById("editor-map-initpos-coordinates");

var editor_map_initpos_more = document.getElementById("editor-map-initpos-more");
	editor_map_initpos_more.onclick = function() {

	if ( !coordinate_state ) {
		coordinate_state = true;
		
		transheight(editor_map_initpos_coordinates, 15, true);
							
		this.className = "rotate180";

	} else {
		coordinate_state = false;
		
		transheight(editor_map_initpos_coordinates, 0, false);

		this.className = "";
	}
}

var bounds_state = false;

var editor_map_bounds_coordinates = document.getElementById("editor-map-bounds-coordinates");

var editor_map_bounds_more = document.getElementById("editor-map-bounds-more");
	editor_map_bounds_more.onclick = function() {

	if ( !bounds_state ) {
		bounds_state = true;
		
		transheight(editor_map_bounds_coordinates, 15, true);					
		
		this.className = "rotate180";

	} else {
		bounds_state = false;
		
		transheight(editor_map_bounds_coordinates, 0, false);
							
		this.className = "";
	}
}
	









function jorgo_edit_client(edit_id) {

	// Get the ID of the button we've just clicked
	var button_id = 'editor-client-edit-toggle-' + edit_id;
	var this_button = document.getElementById(button_id);


	// Get the ID of the CANCEL button we've just clicked
	var cancel_button_id = 'editor-client-cancel-' + edit_id;
	var this_cancel_button = document.getElementById(cancel_button_id);
	
	// Pølse it up ~ click the usynlig button, yo							
	this_cancel_button.onclick = function() {
		this_button.click();
	}

	// Get the ID of of the container we're going to scale
	var get_this_id = 'editor-client-edit-wrapper-' + edit_id;
	var scale_this_container = document.getElementById(get_this_id);
	
	// Get all the classes as an array
	var has_class = scale_this_container.className;
	var classarray = has_class.split(" ");
	
	// Fjerne siste ledd i array om det er to
	if ( classarray.length == 2 ) {
		classarray.splice(1, 1);
		
		this_button.style.opacity = '1';

	// Ellers legge til klasse at den er åpen
	} else {
		classarray[1] = 'client-editor-open';

		this_button.style.opacity = '0';
	}
					
	// Slå sammen klasse arrayen
	var newarray = classarray.join(" ");

	// Sette de nye klassenavnene
	scale_this_container.className = newarray;
		
}


function polse() {

		var alldivvs = document.getElementById('app').getElementsByTagName('div');
		
		for (var aa=0; aa<alldivvs.length;aa++) {
			
			if ( alldivvs[aa].className == 'q-editor-container' ) {
				alldivvs[aa].style.width = '100px';
				break;
			}		
		}
		document.getElementById('map').style.left = '100px';
		document.getElementById('map').style.width = document.body.offsetWidth - 100 + 'px';	
		document.getElementById('header').style.left = '100px';
	

		}

function unpolse() {
		var alldivvs = document.getElementById('app').getElementsByTagName('div');
		
		for (var aa=0; aa<alldivvs.length;aa++) {
			
			if ( alldivvs[aa].className == 'q-editor-container' ) {
				alldivvs[aa].style.width = '400px';
				break;
			}		
		}
		document.getElementById('map').style.left = '400px';
		document.getElementById('map').style.width = document.body.offsetWidth - 400 + 'px';	
		document.getElementById('header').style.left = '400px';

}