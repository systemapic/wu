var jcss; // The tag in the head where the CSS gets injected
var cArray = []; // The array with all the swatches in it
var draggingSlider = false; // If we are dragging, and what bar is being dragged
var haschanged = false; // If individual colors has been changed or not (for overriding feedback purposes)
var css = []; // The CSS array
var cssstring = ''; // The CSS string
var changingColors = false; // For editing mode (To know if we're editing 'c1', 'c2', etc... )
var darktheme = true; // Toggle between dark and light theme
var basecolor;


var header = document.getElementsByTagName('head')[0];
	jcss = document.createElement('style');
	jcss.setAttribute('type', 'text/css');
	jcss.setAttribute('rel', 'stylesheet');	
	header.appendChild(jcss);


	// Declare Custom User Selected Colors 
	// ..the color palette runs from 0 to 34 in the array,
	// "Chosen" colors comes in the Objectified array below,
	// then the CSS array will represent elements from this Array
	
	cArray['c1'] = [];
	cArray['c2'] = [];
	cArray['c3'] = [];
	cArray['c4'] = [];
	cArray['c5'] = [];
	cArray['c6'] = [];
	cArray['c7'] = [];
	cArray['c8'] = [];
	cArray['c9'] = [];


	
	
		
// SET UP THE CSS ARRAY

// Colors comes in pairs: color and background-color
// All colors comes with !important statement
// Write what classes that shall be included in the different colors here

initClassArray();

function initClassArray() {

var theClassArray = [];

	theClassArray[0] = ['._color1'];

	theClassArray[1] = ['.bg1', 
						
						'._color1bg',						
						'.ecolor1', 
						'#content', 
						'.q-editor-menu', 
						'.list_view', 
						'.editor-projects-item', 
						'.select-elem', 
						'#import-mapbox-layers-ok',
						'#import-datalibrary-layers-ok',
						'#import-mapbox-layers-ok:hover', 
						'#import-datalibrary-layers-ok:hover'];
						
	theClassArray[2] = ['._color2'];
	
	theClassArray[3] = ['._color2bg',
						'.ecolor2',
						'#selectedTab span',
						'#editorPanel > .content',
						'.q-editor-container',
						'#editor',
						'#menuslider',
						'#datalibrary-download-dialogue:after',
						'th',
						'fullpage-documents', 					
						'.data-library'];
						
	theClassArray[4] = ['._color3',
						'.ecolor2',
						'.active a',
						'.red a'];					
	
	theClassArray[5] = ['._color3bg',
						'.ecolor3'];
	
	theClassArray[6] = ['._color4',
						'.ecolor1',
						'.disabled'];
	
	theClassArray[7] = ['._color4bg',
						'.ecolor4'];
	
	theClassArray[8] = ['._color5'];
	
	theClassArray[9] = ['._color5bg',
						'.ecolor5'];
						
	theClassArray[10] = ['._color6'];					
	
	theClassArray[11] = ['._color6bg',
						 '.ecolor6'];
	
	theClassArray[12] = ['._color7'];
	
	theClassArray[13] = ['._color7bg',
						 '.color1','.layer-menu-item'];
	
	theClassArray[14] = ['._color8'];
	
	theClassArray[15] = ['._color8bg',
						 '.color2'];
	
	theClassArray[16] = ['._color9'];
	
	theClassArray[17] = ['._color9bg',
					 	 '.color3'];
	
	theClassArray[18] = ['._color10'];
	
	theClassArray[19] = ['._color10bg',
						 '.selected',
						 '.layer-active .layer-menu-item'];
	
	theClassArray[20] = ['._color11'];
	
	theClassArray[21] = ['._color11bg',
						 '.color8'];
	
	theClassArray[22] = ['._color12',
						 '.nocolor'];
	
	theClassArray[23] = ['._color12bg'];
	
	theClassArray[24] = ['.color1',
						 '.selected',
						 '.editor-map-item-wrap',
						 '#editor-layers-connect-mapbox',
						 '#editor-layers-upload',
						 '#editor-projects-container-new',
						 '.editor-clients-container',
						 '.editor-projects-container',
						 '.new-client',
						 '.editor-project-edit-super-wrap',
						 '#datalibrary-search',
						 '.mapbox-connect-wrap',
						 '.datalibrary-connect-wrap',
						 '#import-mapbox-layers-ok',
						 '#import-datalibrary-layers-ok',
						 '#import-mapbox-layers-ok:hover',
						 '#import-datalibrary-layers-ok:hover',
						 '#editor-layers-upload',
						 '.eightyWidth',
						 '.editor-wrapper',
						 '.btn-default',
						 '#import-datalibrary-layers-ok',
						 '#import-mapbox-layers-ok',
						 '.editor-projects-item:hover',
						 '.btn-default',
						 '.btn-default:hover'];
	
	theClassArray[25] = ['.color2',
						 '.btn-default',
						 '.btn-default:hover',
						 '#new-project-button',
						 '.middle-item'];
						 
	theClassArray[26] = ['.editor-wrapper',
						 '.editor-wrapper h3',
						 '.editor-wrapper h4',
						 						 '#select-basic-themes'];
						 
	theClassArray[27] = ['#description-control-inner-content-box',
						 '#layer-menu-inner-content',
						 '#legends-inner',
						 '.leaflet-control-inspect'];
	
	theClassArray[28] = ['.menucollapser',
						 '#header',
						 '.header-title',
						 '.header-subtitle',
						 '.leaflet-bar a',
						 '.leaflet-bar a:hover'];
	
	theClassArray[29] = ['.menucollapser',
						 '#header',
						 '.header-title',
						 '.header-subtitle',
						 '.leaflet-bar a',
						 '.leaflet-bar a:hover',
						 '.new-client'];
	
	theClassArray[30] = ['.editor-map-item-wrap',
						 '.editor-clients-container',
						 '.editor-projects-container',
						 '#editor-projects-container-new',
						 '.mapbox-connect-wrap',
						 '#editor-layers-connect-mapbox',
						 '#editor-layers-upload',
						 '.datalibrary-connect-wrap',
						 '.editor-project-edit-super-wrap',
						 '#datalibrary-search',
						 '#upload-container',
						 '.datalibrary-button'];
	
	theClassArray[31] = ['.new-client',
						 '#new-project-button',
						 '.btn-default',
						 '.btn-default:hover',
						 '.middle-item'];
	
	
	makeCSSel(0, theClassArray[0].join(','), 'color', '');					
	makeCSSel(1, theClassArray[1].join(','), 'background-color', '');
	makeCSSel(2, theClassArray[2].join(','), 'color', '');
	makeCSSel(3, theClassArray[3].join(','), 'background-color', '');
	makeCSSel(4, theClassArray[4].join(','), 'color', '');
	makeCSSel(5, theClassArray[5].join(','), 'background-color', '');	
	makeCSSel(6, theClassArray[6].join(','), 'color', '');
	makeCSSel(7, theClassArray[7].join(','), 'background-color', '');	
	makeCSSel(8, theClassArray[8].join(','), 'color', '');
	makeCSSel(9, theClassArray[9].join(','), 'background-color', '');	
	makeCSSel(10, theClassArray[10].join(','), 'color', '');
	makeCSSel(11, theClassArray[11].join(','), 'background-color', '');	
	makeCSSel(12, theClassArray[12].join(','), 'color', '');
	makeCSSel(13, theClassArray[13].join(','), 'background-color', '');	
	makeCSSel(14, theClassArray[14].join(','), 'color', '');
	makeCSSel(15, theClassArray[15].join(','), 'background-color', '');	
	makeCSSel(16, theClassArray[16].join(','), 'color', '');
	makeCSSel(17, theClassArray[17].join(','), 'background-color', '');	
	makeCSSel(18, theClassArray[18].join(','), 'color', '');
	makeCSSel(19, theClassArray[19].join(','), 'background-color', '');	
	makeCSSel(20, theClassArray[20].join(','), 'color', '');
	makeCSSel(21, theClassArray[21].join(','), 'background-color', '');	
	makeCSSel(22, theClassArray[22].join(','), 'color', '');
	makeCSSel(23, theClassArray[23].join(','), 'background-color', '');
	makeCSSel(24, theClassArray[24].join(','), 'color', 'white');
	makeCSSel(25, theClassArray[25].join(','), 'color', 'black');
	makeCSSel(26, theClassArray[26].join(','), 'color', 'white');
	makeCSSel(27, theClassArray[27].join(','), 'background-color', '');
	makeCSSel(28, theClassArray[28].join(','), 'background-color', '');
	makeCSSel(29, theClassArray[29].join(','), 'color', '');
	makeCSSel(30, theClassArray[30].join(','), 'background-color', '');
	makeCSSel(31, theClassArray[31].join(','), 'background-color', '');


	// Sets up the CSS elements in the Array
	function makeCSSel(va, classn, pre, val) {
		css[va] = {};
		css[va].classes = [];
		css[va].classes[0] = classn;
		css[va].pre = pre;
		css[va].value = val;		
	}
}


// Load the predefined color themes
function prethemes(theme) {

	if ( theme == 'dark1' ) {
				

		// Base Colors			
		preval_1 = '#0F1A1E'; // BG 
		preval_3 = '#3F4652'; // BG
		preval_7 = '#97ABB2'; // BG
		
		preval_6 = '#424242';

		// Link Color
		preval_4 = 'cyan';
					
		// Inactive Layers
		preval_13 = '#63A3A0'; // BG
		preval_15 = '#CCE2E1'; // BG
		preval_17 = '#EDF4F4'; // BG

		// Active Layers
		preval_19 = '#B80077'; // BG
		preval_21 = '#F7E1EF'; // BG
		
		// Other Colors
		preval_22 = 'white';
		preval_24 = 'white';
		preval_25 = '#333';		// BG
		preval_26 = 'white';
		
		preval_27 = 'rgba(255,255,255,0.7)';  // BG
		preval_28 = 'white';
		preval_29 = '#333';
		preval_30 = 'rgba(255, 255, 255, 0.15)';
		preval_31 = 'white';

		// Unused Color slots			
		preval_0 = 'red';
		preval_2 = 'red';
		preval_5 = 'red';
		preval_8 = 'red';
		preval_9 = 'red';
		preval_10 = 'red';
		preval_11 = 'red';
		preval_12 = 'red';
		preval_14 = 'red';
		preval_16 = 'red';
		preval_18 = 'red';
		preval_20 = 'red';
		preval_23 = 'red';
			
	}


	
	if ( theme == 'dark2' ) {

		// Base Colors
		preval_1 = '#0F1A1E';
		preval_3 = '#2C3A3F';
		preval_7 = 'red';

		preval_6 = '#424242';

		// Link
		preval_4 = '#FF5300';
	

		// Inactive Layers
		preval_13 = '#63A3A0'; // BG
		preval_15 = '#CCE2E1'; // BG
		preval_17 = '#EDF4F4'; // BG

		// Active Layers
		preval_19 = '#F98752'; // BG
		preval_21 = '#FCF2ED'; // BG
		
		// Other Colors
		preval_22 = 'white';
		preval_24 = 'white';
		preval_25 = '#333';
		preval_26 = 'white';
		
		preval_27 = 'rgba(255,255,255,0.7)';
		preval_28 = 'white';
		preval_29 = '#333';	
		preval_30 = 'rgba(255, 255, 255, 0.15)';					
		preval_31 = 'white';
		
		// Unused Color Slots
		preval_0 = 'red';
		preval_2 = 'red';
		preval_5 = 'red';
		preval_8 = 'red';
		preval_9 = 'red';
		preval_10 = 'red';
		preval_11 = 'red';
		preval_12 = 'red';
		preval_14 = 'red';			
		preval_16 = 'red';
		preval_18 = 'red';
		preval_20 = 'red';
		preval_23 = 'red';

		
	}


	if ( theme == 'dark3' ) {

		// Base Colors
		preval_1 = '#0F1A1E';
		preval_3 = '#333333';
		preval_7 = 'red';

		preval_6 = '#424242';

		// Link
		preval_4 = '#FF00AA';

		// Inactive Layers
		preval_13 = '#63A3A0'; // BG
		preval_15 = '#CCE2E1'; // BG
		preval_17 = '#EDF4F4'; // BG

		// Active Layers
		preval_19 = '#B80077'; // BG
		preval_21 = '#F7E1EF'; // BG
		
		// Other Colors
		preval_22 = 'white';
		preval_24 = 'white';
		preval_25 = '#333';
		preval_26 = 'white';
	
		preval_27 = 'rgba(255,255,255,0.7)';
		preval_28 = 'white';
		preval_29 = '#333';	
		preval_30 = 'rgba(255, 255, 255, 0.15)';					
		preval_31 = 'white';
			
		
		// Unused Color Slots
		preval_0 = 'red';
		preval_2 = 'red';
		preval_5 = 'red';
		preval_8 = 'red';
		preval_9 = 'red';
		preval_10 = 'red';
		preval_11 = 'red';
		preval_12 = 'red';
		preval_14 = 'red';			
		preval_16 = 'red';
		preval_18 = 'red';
		preval_20 = 'red';
		preval_23 = 'red';
		
		
		
	}


	if ( theme == 'light1' ) {

		var RGB = {};
		hex2RGB ('#ADC3CC', RGB);			
		var HSV = {};
		RGB2HSV (RGB, HSV);			
		var newhex = HSV2HEX(HSV.h, 3, 98);

		// Base Colors
		preval_1 = '#ADC3CC';
		preval_3 = newhex;
		preval_7 = 'red';			
		
		preval_6 = 'white';
		
		// Link
		preval_4 = '#309EB2';
		
		// Inactive Layers
		preval_13 = '#63A3A0'; // BG
		preval_15 = '#CCE2E1'; // BG
		preval_17 = '#EDF4F4'; // BG

		// Active Layers
		preval_19 = '#B80077'; // BG
		preval_21 = '#F7E1EF'; // BG
		
		// Other Colors
		preval_22 = 'black';
		preval_24 = 'white';
		preval_25 = 'white';
		preval_26 = 'black';
	
		preval_27 = 'rgba(0,0,0,0.7)';
		preval_28 = '#333';
		preval_29 = 'white';
			
		var RGB = {};
		hex2RGB (preval_1, RGB);
		var rgba_50 = 'rgba(' + RGB.r + ',' + RGB.g + ',' + RGB.b + ',0.5)';		
			
		preval_30 = rgba_50;
		preval_31 = preval_1;
		
		
		// Unused Color Slots
		preval_0 = 'red';
		preval_2 = 'red';
		preval_5 = 'red';
		preval_8 = 'red';
		preval_9 = 'red';
		preval_10 = 'red';
		preval_11 = 'red';
		preval_12 = 'red';
		preval_14 = 'red';			
		preval_16 = 'red';
		preval_18 = 'red';
		preval_20 = 'red';
		preval_23 = 'red';		
	}



	if ( theme == 'light2' ) {


		var RGB = {};
		hex2RGB ('#CCBFAD', RGB);			
		var HSV = {};
		RGB2HSV (RGB, HSV);			
		var newhex = HSV2HEX(HSV.h, 3, 98);

		// Base Color
		preval_1 = '#CCBFAD';
		preval_3 = newhex;			
		preval_7 = 'red';
					
		preval_6 = 'white';

		// Link
		preval_4 = '#2B889E';

		// Inactive Layers
		preval_13 = '#63A3A0'; // BG
		preval_15 = '#CCE2E1'; // BG
		preval_17 = '#EDF4F4'; // BG

		// Active Layers
		preval_19 = '#B80077'; // BG
		preval_21 = '#F7E1EF'; // BG
		
		// Other Colors
		preval_22 = 'black';
		preval_24 = 'white';
		preval_25 = 'white';
		preval_26 = 'black';
	
		preval_27 = 'rgba(0,0,0,0.7)';
		preval_28 = '#333';
		preval_29 = 'white';
			
		var RGB = {};
		hex2RGB (preval_1, RGB);
		var rgba_50 = 'rgba(' + RGB.r + ',' + RGB.g + ',' + RGB.b + ',0.5)';			
			
		preval_30 = rgba_50;
		preval_31 = preval_1;
		
		
		// Unused Color Slots
		preval_0 = 'red';
		preval_2 = 'red';
		preval_5 = 'red';
		preval_8 = 'red';
		preval_9 = 'red';
		preval_10 = 'red';
		preval_11 = 'red';
		preval_12 = 'red';
		preval_14 = 'red';			
		preval_16 = 'red';
		preval_18 = 'red';
		preval_20 = 'red';
		preval_23 = 'red';			
		
	}
	

	if ( theme == 'light3' ) {

		var RGB = {};
		hex2RGB ('#BCBCBC', RGB);			
		var HSV = {};
		RGB2HSV (RGB, HSV);			
		var newhex = HSV2HEX(HSV.h, 0, 98);
	
		// Base Colors
		preval_1 = '#BCBCBC';
		preval_3 = newhex;
		preval_7 = 'red';

		preval_6 = 'white';

		// Link
		preval_4 = '#AE2B95';

		// Inactive Layers
		preval_13 = '#63A3A0'; // BG
		preval_15 = '#CCE2E1'; // BG
		preval_17 = '#EDF4F4'; // BG

		// Active Layers
		preval_19 = '#B80077'; // BG
		preval_21 = '#F7E1EF'; // BG

		// Other Colors
		preval_22 = 'black';
		preval_24 = 'white';
		preval_25 = 'white';
		preval_26 = 'black';
	
		preval_27 = 'rgba(0,0,0,0.7)';
		preval_28 = '#333';
		preval_29 = 'white';
			

		var RGB = {};
		hex2RGB (preval_1, RGB);
		var rgba_50 = 'rgba(' + RGB.r + ',' + RGB.g + ',' + RGB.b + ',0.5)';			
			
		preval_30 = rgba_50;
		preval_31 = preval_1;
		
		
		// Unused Color Slots
		preval_0 = 'red';
		preval_2 = 'red';
		preval_5 = 'red';
		preval_8 = 'red';
		preval_9 = 'red';
		preval_10 = 'red';
		preval_11 = 'red';
		preval_12 = 'red';
		preval_14 = 'red';			
		preval_16 = 'red';
		preval_18 = 'red';
		preval_20 = 'red';
		preval_23 = 'red';			
		
	}
		
	

	css[0].value = preval_0; 	 
	css[1].value = preval_1;	// MAIN BG
	css[2].value = preval_2;	 
	css[3].value = preval_3;	
	css[4].value = preval_4;	
	css[5].value = preval_5;	
	css[6].value = preval_6;	
	css[7].value = preval_7;	
	css[8].value = preval_8;	
	css[9].value = preval_9;	
	css[10].value = preval_10;	
	css[11].value = preval_11;	
	css[12].value = preval_12;	
	css[13].value = preval_13;	
	css[14].value = preval_14;	
	css[15].value = preval_15;	
	css[16].value = preval_16;	
	css[17].value = preval_17;	
	css[18].value = preval_18;	
	css[19].value = preval_19;	
	css[20].value = preval_20;	
	css[21].value = preval_21;	
	css[22].value = preval_22;	
	css[23].value = preval_23;	
	css[24].value = preval_24;	// TEXT COLOR ON MAIN BG (preval_1)
	css[25].value = preval_25;
	css[26].value = preval_26;
	css[27].value = preval_27;	
	css[28].value = preval_28;	
	css[29].value = preval_29;
	css[30].value = preval_30;	
	css[31].value = preval_31;		


	basecolor = preval_1;


	document.getElementById('hexColor').value = preval_13;

	// Calculate less....

	var RGB = {};
	hex2RGB (preval_1, RGB);
	var rgba_50 = 'rgba(' + RGB.r + ',' + RGB.g + ',' + RGB.b + ',0.5) !important';
	var rgba_25 = 'rgba(' + RGB.r + ',' + RGB.g + ',' + RGB.b + ',0.25) !important';

	var extras =	
	
	// TABLE DARK
	'tr:nth-child(odd) ' + 
	'{ background: ' + rgba_50 + ' }' + 
	
	// TABLE LIGHT
	'tr:nth-child(even) ' + 
	'{ background: ' + rgba_25 + ' }' + 

	'#base-color, #yourswatch ' +
	'{ border-bottom: 3px solid ' + rgba_50 + ' }' +
		

	// CUSTOM STATICS FOR LIGHT THEMES!!!

	// TRANSPARENT BACKGROUND
	'.mat_swatches, #sliders, .ccontainer ' +
	'{ background-color: transparent !important }' +
	
	// GRAY TEXT
	'.editor-wrapper h3, .editor-wrapper h4, .dln, .dld, article, .documents-folder-item, #documents-new-folder, #documents-new-folder:hover, .documents-folder-item:hover, .editor-map-item-wrap input, .form-control input, .editor-map-item-wrap, #editor-map-initpos-button, #editor-map-bounds, .tdcont, th' + 
	' { color: #666 !important; }' +
	
	// WHITE BG
	'#color-digits, .save-colors, #canvasinf, #editor-map-initpos-button, #editor-map-bounds, .input-box, .eightyWidth, .editor-map-item-wrap input, .form-control input ' +
	'{ background-color: white !important } ' + 
		
	'.controls-item ' +
	'{ color: rgba(0, 0, 0, 0.5); background: rgba(255, 255, 255, 0.5); font-weight: 600;}' +
	
	'.datalibrary-controls ' + 
	'{ border-bottom: 1px solid black; }' +
	
	'.eightyWidth ' + 
	'{ rgba(255, 255, 255, 0.5) !important }' +	
	
	// Thicker fonts
	'th, .tdcont, #documents-container-rightpane, .documents-folder-item, #documents-new-folder, .editor-wrapper h4 ' + 
	'{ font-weight: 200 }' +
	
	// HORISONTAL LINE
	'hr ' + 
	'{ border-top: 1px solid black }' +
	
	// BLOCK QUOTE
	'blockquote ' + 
	'{ border-left: 5px solid #333; }' +	
	
	'#bhattan2, #bhattan1, #legends-collapser ' +
	'{ background-position: -56px 8px; }';
		
		
	updateCSSstring();
	
	if ( theme == 'light1' || theme == 'light2' || theme == 'light3' ) { 
		cssstring += ' ' + extras;
	}
	
	jcss.innerHTML = cssstring;

}

	




// GENERAL
// GENERAL
// GENERAL

// Stupid supplement for 'getElementById'
function getObjectByID(id) {
  // Cross-browser function to return the object with the specific id
  if (document.all) { // IE
    return document.all[id];
  } else { // Mozilla and others
    return document.getElementById(id);
  }
}

// Stupid: Creates a HSV object
function HSVobject (hue, saturation, value) {
	// Object definition.
	this.h = hue; this.s = saturation; this.v = value;
	this.validate = function () {
		if (this.h <= 0) {this.h = 0;}
		if (this.s <= 0) {this.s = 0;}
		if (this.v <= 0) {this.v = 0;}
		if (this.h > 360) {this.h = 360;}
		if (this.s > 100) {this.s = 100;}
		if (this.v > 100) {this.v = 100;}
	};
}

// Stupid: Creates a RGB object
function RGBobject (red, green, blue) {
	// Object definition.
	this.r = red; this.g = green; this.b = blue;
	this.validate = function () {
		if (this.r <= 0) {this.r = 0;}
		if (this.g <= 0) {this.g = 0;}
		if (this.b <= 0) {this.b = 0;}
		if (this.r > 255) {this.r = 255;}
		if (this.g > 255) {this.g = 255;}
		if (this.b > 255) {this.b = 255;}
	};
}


// CONVERTERS
// CONVERTERS
// CONVERTERS

// Decimals to hex (only 3 digits)
function hexify(number) {
	var digits = '0123456789ABCDEF';
	var lsd = number % 16;
	var msd = (number - lsd) / 16;
	var hexified = digits.charAt(msd) + digits.charAt(lsd);
	return hexified;
}

// Hex to decimals (only 2 digits)
function decimalize(hexNumber) {
	var digits = '0123456789ABCDEF';
	return ((digits.indexOf(hexNumber.charAt(0).toUpperCase()) * 16) + digits.indexOf(hexNumber.charAt(1).toUpperCase()));
}

// HEX to RGB
function hex2RGB (colorString, RGB) {
	RGB.r = decimalize(colorString.substring(1,3));
	RGB.g = decimalize(colorString.substring(3,5));
	RGB.b = decimalize(colorString.substring(5,7));
}

// RGB to HEX
function RGB2hex (RGB) {
	return "#" + hexify(RGB.r) + hexify(RGB.g) + hexify(RGB.b);
}

// RGB to HSV
function RGB2HSV (RGB, HSV) {
	r = RGB.r / 255; g = RGB.g / 255; b = RGB.b / 255; // Scale to unity.

	var minVal = Math.min(r, g, b);
	var maxVal = Math.max(r, g, b);
	var delta = maxVal - minVal;

	HSV.v = maxVal;

	if (delta == 0) {
		HSV.h = 0;
		HSV.s = 0;
	} else {
		HSV.s = delta / maxVal;
		var del_R = (((maxVal - r) / 6) + (delta / 2)) / delta;
		var del_G = (((maxVal - g) / 6) + (delta / 2)) / delta;
		var del_B = (((maxVal - b) / 6) + (delta / 2)) / delta;

		if (r == maxVal) {HSV.h = del_B - del_G;}
		else if (g == maxVal) {HSV.h = (1 / 3) + del_R - del_B;}
		else if (b == maxVal) {HSV.h = (2 / 3) + del_G - del_R;}
		
		if (HSV.h < 0) {HSV.h += 1;}
		if (HSV.h > 1) {HSV.h -= 1;}
	}
	HSV.h *= 360;
	HSV.s *= 100;
	HSV.v *= 100;
}

// HSV to RGB
function HSV2RGB(HSV, RGB) {
	var h = HSV.h / 360; var s = HSV.s / 100; var v = HSV.v / 100;
	if (s == 0) {
		RGB.r = v * 255;
		RGB.g = v * 255;
		RGB.b = v * 255;
	} else {
		var_h = h * 6;
		var_i = Math.floor(var_h);
		var_1 = v * (1 - s);
		var_2 = v * (1 - s * (var_h - var_i));
		var_3 = v * (1 - s * (1 - (var_h - var_i)));
		
		if (var_i == 0) {var_r = v; var_g = var_3; var_b = var_1}
		else if (var_i == 1) {var_r = var_2; var_g = v; var_b = var_1}
		else if (var_i == 2) {var_r = var_1; var_g = v; var_b = var_3}
		else if (var_i == 3) {var_r = var_1; var_g = var_2; var_b = v}
		else if (var_i == 4) {var_r = var_3; var_g = var_1; var_b = v}
		else {var_r = v; var_g = var_1; var_b = var_2};
		
		RGB.r = var_r * 255;
		RGB.g = var_g * 255;
		RGB.b = var_b * 255;
	}
}

// HSV to HEX
function HSV2HEX(_hval, _sval, _vval) {
	var RGB = new RGBobject();
	var HSV = new HSVobject(_hval, _sval, _vval);	
	HSV.validate();
	HSV2RGB (HSV, RGB);
	var _nHEX = RGB2hex(RGB);
	return(_nHEX);		
}






// WHEN COLOR CHANGES
// WHEN COLOR CHANGES
// WHEN COLOR CHANGES

// A lot of stuff gets pulled through these. 
// These are "the core updaters", so to speak

// Note: rgbChange and hsvChange are very similar, but I chose to keep the repetition there, 


// When the RGB chanel has changed
function rgbChange() {
	var RGB = new RGBobject(getObjectByID("rChannel").value, getObjectByID("gChannel").value, getObjectByID("bChannel").value);
	var HSV = new HSVobject(getObjectByID("hChannel").value, getObjectByID("sChannel").value, getObjectByID("vChannel").value);
	RGB.validate();
	RGB2HSV (RGB, HSV);
	getObjectByID("hexColor").value = RGB2hex(RGB);
	getObjectByID("rChannel").value = Math.round(RGB.r);
	getObjectByID("gChannel").value = Math.round(RGB.g);
	getObjectByID("bChannel").value = Math.round(RGB.b);
	getObjectByID("hChannel").value = Math.round(HSV.h);
	getObjectByID("sChannel").value = Math.round(HSV.s);
	getObjectByID("vChannel").value = Math.round(HSV.v);
	
	// Change all the colors	
	if ( !changingColors ) {
		var _hex = RGB2hex(RGB);
		updateSwatch(_hex);
	}
	
	// Only change colors on the Menu etc
	if ( changingColors == 'c0' ) {
		RGB2HSV (RGB, HSV);		
		updatematchswatch('c0', HSV);		
		yourswatch.style.backgroundColor = cArray['c0'][0].HEX;

		// Updates the CSS array
		updateC0();

		updateCSSstring();
		jcss.innerHTML = cssstring;	
	}

	// Only change colors on the Menu etc
	if ( changingColors == 'c1' ) {
		RGB2HSV (RGB, HSV);		
		updatematchswatch('c1', HSV);
		yourswatch.style.backgroundColor = cArray['c1'][0].HEX;

		// Updates the CSS array
		updateC1();
		
		updateCSSstring();
		jcss.innerHTML = cssstring;	
	}
	
	// Only change the colors on the ACTIVE Menu etc		
	if ( changingColors == 'c2' ) {
		RGB2HSV (RGB, HSV);		
		updatematchswatch('c2', HSV);		
		yourswatch.style.backgroundColor = cArray['c2'][0].HEX;

		// Updates the CSS array
		updateC2();
		
		updateCSSstring();
		jcss.innerHTML = cssstring;	
	}
	
	// Only change the colors of the links		
	if ( changingColors == 'c3' ) {
		RGB2HSV (RGB, HSV);
		updatematchswatch('c3', HSV);
		yourswatch.style.backgroundColor = cArray['c3'][0].HEX;

		// Updates the CSS array
		updateC3();
		
		updateCSSstring();
		jcss.innerHTML = cssstring;	
	}

	// Only change the colors of the links		
	if ( changingColors == 'c4' ) {
		RGB2HSV (RGB, HSV);
		updatematchswatch('c4', HSV);
		yourswatch.style.backgroundColor = cArray['c4'][0].HEX;

		// Updates the CSS array
		updateC4();

		updateCSSstring();
		jcss.innerHTML = cssstring;	
	}
}

// When the HSV chanel has changed
function hsvChange() {

	var RGB = new RGBobject(getObjectByID("rChannel").value, getObjectByID("gChannel").value, getObjectByID("bChannel").value);
	var HSV = new HSVobject(getObjectByID("hChannel").value, getObjectByID("sChannel").value, getObjectByID("vChannel").value);
	HSV.validate();
	HSV2RGB (HSV, RGB);
	getObjectByID("hexColor").value = RGB2hex(RGB);
	getObjectByID("rChannel").value = Math.round(RGB.r);
	getObjectByID("gChannel").value = Math.round(RGB.g);
	getObjectByID("bChannel").value = Math.round(RGB.b);
	getObjectByID("hChannel").value = Math.round(HSV.h);
	getObjectByID("sChannel").value = Math.round(HSV.s);
	getObjectByID("vChannel").value = Math.round(HSV.v);

	// Change all the colors	
	if ( !changingColors ) {
		var _hex = RGB2hex(RGB);
		updateSwatch(_hex);	
	}

	// Only change colors on the Menu etc
	if ( changingColors == 'c0' ) {
		RGB2HSV (RGB, HSV);
		updatematchswatch('c0', HSV);
		yourswatch.style.backgroundColor = cArray['c0'][0].HEX;
		
		// Updates the CSS array
		updateC0();
		
		updateCSSstring();
		jcss.innerHTML = cssstring;
	}
	
	// Only change colors on the Menu etc
	if ( changingColors == 'c1' ) {
		RGB2HSV (RGB, HSV);
		updatematchswatch('c1', HSV);
		yourswatch.style.backgroundColor = cArray['c1'][0].HEX;

		// Updates the CSS array
		updateC1();

		updateCSSstring();
		jcss.innerHTML = cssstring;	
	}

	// Only change the colors on the ACTIVE Menu etc
	if ( changingColors == 'c2' ) {
		RGB2HSV (RGB, HSV);
		updatematchswatch('c2', HSV);
		yourswatch.style.backgroundColor = cArray['c2'][0].HEX;

		// Updates the CSS array
		updateC2();

		updateCSSstring();
		jcss.innerHTML = cssstring;	

	}
	
	// Only change the colors of the links
	if ( changingColors == 'c3' ) {
		RGB2HSV (RGB, HSV);
		updatematchswatch('c3', HSV);
		yourswatch.style.backgroundColor = cArray['c3'][0].HEX;

		// Updates the CSS array
		updateC3();

		updateCSSstring();
		jcss.innerHTML = cssstring;	
	}

	// Only change the colors of the links
	if ( changingColors == 'c4' ) {
		RGB2HSV (RGB, HSV);
		updatematchswatch('c4', HSV);
		yourswatch.style.backgroundColor = cArray['c4'][0].HEX;

		// Updates the CSS array
		updateC4();

		updateCSSstring();
		jcss.innerHTML = cssstring;	
	}
			
		
}

// When the HEX chanel has changed
function hexChange() {

	var colorString = getObjectByID("hexColor").value;
	var RGB = new RGBobject(0,0,0);
	var HSV = new HSVobject(0,0,0);
	hex2RGB(colorString, RGB);
	RGB2HSV (RGB, HSV);
	getObjectByID("rChannel").value = Math.round(RGB.r);
	getObjectByID("gChannel").value = Math.round(RGB.g);
	getObjectByID("bChannel").value = Math.round(RGB.b);
	getObjectByID("hChannel").value = Math.round(HSV.h);
	getObjectByID("sChannel").value = Math.round(HSV.s);
	getObjectByID("vChannel").value = Math.round(HSV.v);

	// Change all the colors	
	if ( !changingColors ) {
		var _hex = colorString;
		updateSwatch(_hex);	// Pulls stylizer ... which writes the CSS array and injects it in the HEAD 
	}

	// Only change colors on the Menu etc
	if ( changingColors == 'c0' ) {
	
		var _hex = colorString;
		var RGB = new RGBobject(0,0,0);	
		var HSV = new HSVobject(0,0,0);			
		hex2RGB(_hex, RGB);
		RGB2HSV(RGB, HSV);
		updateAllSliders(RGB, HSV);		
		
		var arrno = 'c0';

		// Redefine the color

		// Dark theme / light theme
		if ( darktheme ) {
		
			cArray[arrno] = [];
			cArray[arrno][0] = {};
			cArray[arrno][0].HSV = {};
			cArray[arrno][0].HSV.h = HSV.h; 
			cArray[arrno][0].HSV.s = 50; 
			cArray[arrno][0].HSV.v = 12;
			cArray[arrno][0].HEX = HSV2HEX(HSV.h, 50, 12);	 
			cArray[arrno][0].RGB = {};
			HSV2RGB(cArray[arrno][0].HSV, cArray[arrno][0].RGB);
		
			cArray[arrno][1] = {};	
			cArray[arrno][1].HSV = {};
			cArray[arrno][1].HSV.h = HSV.h; 
			cArray[arrno][1].HSV.s = 30; 
			cArray[arrno][1].HSV.v = 25;
			cArray[arrno][1].HEX = HSV2HEX(HSV.h, 30, 25);	 
			cArray[arrno][1].RGB = {};
			HSV2RGB(cArray[arrno][1].HSV, cArray[arrno][1].RGB);
		
			cArray[arrno][2] = {};	
			cArray[arrno][2].HSV = {};
			cArray[arrno][2].HSV.h = HSV.h; 
			cArray[arrno][2].HSV.s = 15; 
			cArray[arrno][2].HSV.v = 70;
			cArray[arrno][2].HEX = HSV2HEX(HSV.h, 15, 70);	 
			cArray[arrno][2].RGB = {};
			HSV2RGB(cArray[arrno][2].HSV, cArray[arrno][2].RGB);
			

				
		// Light theme				
		} else { 

			cArray[arrno] = [];
			cArray[arrno][0] = {};
			cArray[arrno][0].HSV = {};
			cArray[arrno][0].HSV.h = HSV.h; 
			cArray[arrno][0].HSV.s = 15; 
			cArray[arrno][0].HSV.v = 75;
			cArray[arrno][0].HEX = HSV2HEX(HSV.h, 15, 75);	 
			cArray[arrno][0].RGB = {};
			HSV2RGB(cArray[arrno][0].HSV, cArray[arrno][0].RGB);
		
			cArray[arrno][1] = {};	
			cArray[arrno][1].HSV = {};
			cArray[arrno][1].HSV.h = HSV.h; 
			cArray[arrno][1].HSV.s = 3; 
			cArray[arrno][1].HSV.v = 98;
			cArray[arrno][1].HEX = HSV2HEX(HSV.h, 3, 98);	 
			cArray[arrno][1].RGB = {};
			HSV2RGB(cArray[arrno][1].HSV, cArray[arrno][1].RGB);
		
			cArray[arrno][2] = {};	
			cArray[arrno][2].HSV = {};
			cArray[arrno][2].HSV.h = HSV.h; 
			cArray[arrno][2].HSV.s = 30; 
			cArray[arrno][2].HSV.v = 25;
			cArray[arrno][2].HEX = HSV2HEX(HSV.h, 30, 25);	 
			cArray[arrno][2].RGB = {};
			HSV2RGB(cArray[arrno][2].HSV, cArray[arrno][2].RGB);
								
		}
		
		// Update the styles...

		// Updates the CSS array
		updateC0();
						
		updateCSSstring();
		jcss.innerHTML = cssstring;	

	}
	
	// Only change colors on the Menu etc
	if ( changingColors == 'c1' ) {
			
		hex2RGB (colorString, RGB);
		RGB2HSV (RGB, HSV);		
		updateAllSliders(RGB, HSV);
		updatematchswatch('c1', HSV);		
		yourswatch.style.backgroundColor = cArray['c1'][0].HEX;

		// Updates the CSS array
		updateC1();

		updateCSSstring();
		jcss.innerHTML = cssstring;	
	}
	
	// Only change the colors on the ACTIVE Menu etc		
	if ( changingColors == 'c2' ) {
	
		hex2RGB (colorString, RGB);
		RGB2HSV (RGB, HSV);
		updateAllSliders(RGB, HSV);		
		updatematchswatch('c2', HSV);		
		yourswatch.style.backgroundColor = cArray['c2'][0].HEX;

		// Updates the CSS array
		updateC2();

		updateCSSstring();
		jcss.innerHTML = cssstring;	
	}
	
	// Only change the colors of the links		
	if ( changingColors == 'c3' ) {
		hex2RGB (colorString, RGB);
		RGB2HSV (RGB, HSV);
		updateAllSliders(RGB, HSV);
		updatematchswatch('c3', HSV);
		yourswatch.style.backgroundColor = cArray['c3'][0].HEX;

		// Updates the CSS array
		updateC3();

		updateCSSstring();
		jcss.innerHTML = cssstring;	
	}


	// Only change the colors of the links		
	if ( changingColors == 'c4' ) {
		hex2RGB (colorString, RGB);
		RGB2HSV (RGB, HSV);
		updateAllSliders(RGB, HSV);
		updatematchswatch('c4', HSV);
		yourswatch.style.backgroundColor = cArray['c4'][0].HEX;

		// Updates the CSS array
		updateC4();

		updateCSSstring();
		jcss.innerHTML = cssstring;	
	}	
		
}

// Updates the CSS array from cArray
function updateC0() {
	css[1].value  = cArray['c0'][0].HEX; 	// BG: 	._color1bg, .ecolor1
	css[6].value  = cArray['c0'][2].HEX;	// ~ :	._color4, .ecolor1, .disabled
	css[3].value  = cArray['c0'][1].HEX; 	// BG:	._color2bg, .ecolor2
	css[22].value = cArray['c0'][2].HEX; 	// ~ :	._color12, .nocolor
	css[7].value  = cArray['c0'][2].HEX;	// BG: 	._color4bg, .ecolor4
	css[6].value  = cArray['c0'][2].HEX;	// ~ :	._color4, .ecolor1, .disabled	
}
function updateC1() {
	css[13].value = cArray['c1'][0].HEX;	// BG:	._color7bg, .color1
	css[15].value = cArray['c1'][3].HEX; 	// BG:	._color8bg, .color2
	css[17].value = cArray['c1'][4].HEX;	// BG:	._color9bg, .color3					
}
function updateC2() {
	css[19].value = cArray['c2'][0].HEX;	// BG:	._color10bg, .selected
	css[21].value = cArray['c2'][4].HEX;	// BG:	._color11bg
}
function updateC3() {
	css[4].value = cArray['c3'][0].HEX;		// ~ :	._color3, .ecolor2, .activ a	
}
function updateC4() {
	css[22].value = cArray['c4'][0].HEX;		// ~ :	._color3, .ecolor2, .activ a
}



		

// Updates all the swatches, cArray, and runs stylizer()
function updateSwatch(_hex) {

	// Updating the color swatches that contains the BASE color
	getObjectByID("swatch_1").style.backgroundColor = _hex;
	yourswatch.style.backgroundColor = _hex;

	var colorString = _hex;
	
	var RGB = new RGBobject(0,0,0);
	var HSV = new HSVobject(0,0,0);
	hex2RGB(colorString, RGB);
	RGB2HSV (RGB, HSV);
		
	// Update the Color Array	
	cArray[0] = [];		
	cArray[0][0] = {};
	cArray[0][0].HEX = _hex;		
	cArray[0][0].RGB = {'r': RGB.r, 'g': RGB.g, 'b': RGB.b };
	cArray[0][0].HSV = {'h': HSV.h, 's': HSV.s, 'v': HSV.v };
		
		
	var htemp = HSV.h;
	var stemp = HSV.s;
	var vtemp = HSV.v;
		
	
	// Hue
	var hval = HSV.h;
	var hpos = 360-hval;

	// Go down the bulks and make LIGHTER swatches
	for ( var i=0; i<4;i++ ) {
	
		// Declare the Array that contains all the colors
		cArray[i] = [];	

		var hstep = hval + (90*i);
			
		if ( hstep > 360 ) {
			hstep = hstep - 360;
		}
		
		hstep = Math.floor(hstep);


		HSV.h = hstep;
		HSV.s = stemp;
		HSV.v = vtemp;
		
		HSV2RGB(HSV, RGB);
		var nhex = RGB2hex(RGB);				

		// Update the actual Swatch
		var tempswatch = 'swatch_' + i;
		var swatt = document.getElementById(tempswatch);
			swatt.style.backgroundColor = nhex;
		
			// Go down the swatches
			for ( var o=0; o<6;o++) {			
		
				// Value
				var vval = HSV.v;
				var valdiff = 100-vval;	
				var valstep = valdiff/6;	
				HSV.v = Math.floor(vval + (valstep*o));
				
				// Lightness
				var sval = HSV.s;
				var svalstep = sval/6;
				HSV.s = Math.floor(sval - (svalstep*o));
				
				HSV2RGB (HSV, RGB);
				var nhex = RGB2hex(RGB);
				
				// Update the array with all the colors
				cArray[i][o] = {};
				cArray[i][o].HEX = nhex;						
				cArray[i][o].RGB = {'r': RGB.r, 'g': RGB.g, 'b': RGB.b };
				cArray[i][o].HSV = {'h': HSV.h, 's': HSV.s, 'v': HSV.v };					
				
			}
	}
	
	
	HSV.h = cArray[0][0].HSV.h;
	HSV.s = cArray[0][0].HSV.s;
	HSV.v = cArray[0][0].HSV.v;

	RGB.r = cArray[0][0].RGB.r;
	RGB.g = cArray[0][0].RGB.g;
	RGB.b = cArray[0][0].RGB.b;
		

	// Update sliders
	updateAllSliders(RGB, HSV);


	hex2RGB(_hex, RGB);
	RGB2HSV (RGB, HSV);
	
	// Finds matching colors
	domatch(HSV);
	
	// Update the MATCHING colors in cArray
	
	// Match Color 1
	hex2RGB(arrBlend[1], RGB);
	RGB2HSV (RGB, HSV);
	
	cArray[4] = [];
	updatematchswatch(4, HSV);


	// Match Color 2
	hex2RGB(arrBlend[2], RGB);
	RGB2HSV (RGB, HSV);
	
	cArray[5] = [];
	updatematchswatch(5, HSV);


	// Match Color 3
	hex2RGB(arrBlend[3], RGB);
	RGB2HSV (RGB, HSV);
	
	cArray[6] = [];
	updatematchswatch(6, HSV);

	
	// Match Color 4	
	hex2RGB(arrBlend[4], RGB);
	RGB2HSV (RGB, HSV);	
	
	cArray[7] = [];
	updatematchswatch(7, HSV);
	

	// Match Color 5
	hex2RGB(arrBlend[5], RGB);
	RGB2HSV (RGB, HSV);
	
	cArray[8] = [];
	updatematchswatch(8, HSV);
	
	// Sets stylesheet in header	
	stylizer();
	
	
}

// Updates the color lighness of matching colors
function updatematchswatch(number, HSV) {
	// Go down the swatches
	for ( var a=0; a<6;a++) {			
	
		var RGB = new RGBobject(0,0,0);

		// Value
		var vval = HSV.v;
		var valdiff = 100-vval;	
		var valstep = valdiff/6;	
		HSV.v = Math.floor(vval + (valstep*a));
		
		// Lightness
		var sval = HSV.s;
		var svalstep = sval/6;
		HSV.s = Math.floor(sval - (svalstep*a));
		
		HSV2RGB (HSV, RGB);
		var nhex = RGB2hex(RGB);

		
		// Update the array with all the colors
		cArray[number][a] = {};
		cArray[number][a].HEX = nhex;
		cArray[number][a].RGB = {'r': RGB.r, 'g': RGB.g, 'b': RGB.b };
		cArray[number][a].HSV = {'h': HSV.h, 's': HSV.s, 'v': HSV.v };			
	}	
}	

// Makes dark base colors (dark theme)
function makeLightColors(arrno,h) {
	cArray[arrno] = [];
	cArray[arrno][0] = {};
	cArray[arrno][0].HSV = {};
	cArray[arrno][0].HSV.h = h; 
	cArray[arrno][0].HSV.s = 15; 
	cArray[arrno][0].HSV.v = 80;
	cArray[arrno][0].HEX = HSV2HEX(h, 15, 80);	 
	cArray[arrno][0].RGB = {};
	HSV2RGB(cArray[arrno][0].HSV, cArray[arrno][0].RGB);

	cArray[arrno][1] = {};	
	cArray[arrno][1].HSV = {};
	cArray[arrno][1].HSV.h = h; 
	cArray[arrno][1].HSV.s = 1; 
	cArray[arrno][1].HSV.v = 99;
	cArray[arrno][1].HEX = HSV2HEX(h, 1, 99);	 
	cArray[arrno][1].RGB = {};
	HSV2RGB(cArray[arrno][1].HSV, cArray[arrno][1].RGB);

	cArray[arrno][2] = {};	
	cArray[arrno][2].HSV = {};
	cArray[arrno][2].HSV.h = h; 
	cArray[arrno][2].HSV.s = 30; 
	cArray[arrno][2].HSV.v = 25;
	cArray[arrno][2].HEX = HSV2HEX(h, 30, 25);	 
	cArray[arrno][2].RGB = {};
	HSV2RGB(cArray[arrno][2].HSV, cArray[arrno][2].RGB);
	
	
	var _ts = 'swatch_' + arrno;
	document.getElementById(_ts).style.backgroundColor = cArray[arrno][1].HEX;
}	

// Makes light base colors (light theme)	
function makeDarkColors(arrno,h) {

	cArray[arrno] = [];
	cArray[arrno][0] = {};
	cArray[arrno][0].HSV = {};
	cArray[arrno][0].HSV.h = h; 
	cArray[arrno][0].HSV.s = 50; 
	cArray[arrno][0].HSV.v = 12;
	cArray[arrno][0].HEX = HSV2HEX(h, 50, 12);	 
	cArray[arrno][0].RGB = {};
	HSV2RGB(cArray[arrno][0].HSV, cArray[arrno][0].RGB);

	cArray[arrno][1] = {};	
	cArray[arrno][1].HSV = {};
	cArray[arrno][1].HSV.h = h; 
	cArray[arrno][1].HSV.s = 30; 
	cArray[arrno][1].HSV.v = 25;
	cArray[arrno][1].HEX = HSV2HEX(h, 30, 25);	 
	cArray[arrno][1].RGB = {};
	HSV2RGB(cArray[arrno][1].HSV, cArray[arrno][1].RGB);

	cArray[arrno][2] = {};	
	cArray[arrno][2].HSV = {};
	cArray[arrno][2].HSV.h = h; 
	cArray[arrno][2].HSV.s = 15; 
	cArray[arrno][2].HSV.v = 70;
	cArray[arrno][2].HEX = HSV2HEX(h, 15, 70);	 
	cArray[arrno][2].RGB = {};
	HSV2RGB(cArray[arrno][2].HSV, cArray[arrno][2].RGB);
	
	
	var _ts = 'swatch_' + arrno;
	document.getElementById(_ts).style.backgroundColor = cArray[arrno][1].HEX;
}		




// SLIDERS
// SLIDERS
// SLIDERS

// Updates all the sliders on color changes
function updateAllSliders(RGB, HSV) {

	// HSV
	if ( draggingSlider != 'range-slider-1' ) {
		slideupdater('range-slider-1', 'hChannel', 360, HSV, RGB);
	}

	if ( draggingSlider != 'range-slider-2' ) {
		slideupdater('range-slider-2', 'sChannel', 100, HSV, RGB);	
	}

	if ( draggingSlider != 'range-slider-3' ) {
		slideupdater('range-slider-3', 'vChannel', 100, HSV, RGB);	
	}


	// RGB
	if ( draggingSlider != 'range-slider-r' ) {
		slideupdater('range-slider-r', 'rChannel', 255, HSV, RGB);		
	}

	if ( draggingSlider != 'range-slider-g' ) {
		slideupdater('range-slider-g', 'gChannel', 255, HSV, RGB);
	}

	if ( draggingSlider != 'range-slider-b' ) {
		slideupdater('range-slider-b', 'bChannel', 255, HSV, RGB);
	}	
}

// Slider – when they need to get updated
function slideupdater(id, updater, nrng, HSV, RGB) {


	// Updating one of the HSV sliders: update all the RGB sliders
	if ( draggingSlider == 'range-slider-1' || draggingSlider == 'range-slider-2' || draggingSlider == 'range-slider-3' ) {

		var rr = document.getElementById('range-slider-r').children[0];
		var rrrange = Math.floor(RGB.r*(205/255));
			rr.style.left = rrrange + 'px';
		
		var gg = document.getElementById('range-slider-g').children[0];
		var ggrange = Math.floor(RGB.g*(205/255));
			gg.style.left =ggrange + 'px';
			
		var bb = document.getElementById('range-slider-b').children[0];
		var bbrange = Math.floor(RGB.b*(205/255));
			bb.style.left = bbrange + 'px';		
	}
	
	
	// Updating one of the RGB sliders: update all the HSV sliders	
	if ( draggingSlider == 'range-slider-r' || draggingSlider == 'range-slider-g' || draggingSlider == 'range-slider-b' ) {
					
		var hh = document.getElementById('range-slider-1').children[0];
		var hhrange = Math.floor(HSV.h*(205/360));
			hh.style.left = hhrange + 'px';
		
		var ss = document.getElementById('range-slider-2').children[0];
		var ssrange = Math.floor(HSV.s*(205/100));
			ss.style.left = ssrange + 'px';
			
		var vv = document.getElementById('range-slider-3').children[0];
		var vvrange = Math.floor(HSV.v*(205/100));
			vv.style.left = vvrange + 'px';	
	
	}






	if ( !draggingSlider ) {
	
	    var range = document.getElementById(id),
	        dragger = range.children[0];
	        
	                
	    var newRange;
	
	    if ( updater == 'hChannel' ) {
		    newRange = HSV.h;	
	    }
	
	    if ( updater == 'sChannel' ) {
		    newRange = HSV.s;
	    }
	    
	    if ( updater == 'vChannel' ) {
		    newRange = HSV.v;
	    }        


	    if ( updater == 'rChannel' ) {
		    newRange = RGB.r;	
	    }
	
	    if ( updater == 'gChannel' ) {
		    newRange = RGB.g;
	    }
	    
	    if ( updater == 'bChannel' ) {
		    newRange = RGB.b;
	    }        
	    
	    
	
		if ( newRange >= nrng ) {
	    	newRange = nrng;
		}
	
	
		var prop = 205/nrng;
	    newRange = Math.floor(newRange*prop);        
	
	    dragger.style.left = newRange + 'px';
    
    }

}

// Slider – when moving them
function rangeSlider(id, rrange, onDrag) {

    var range = document.getElementById(id),
        dragger = range.children[0],
        draggerWidth = 10, // width of your dragger
        rangeWidth, rangeLeft,
        down = false;

    dragger.style.width = draggerWidth + 'px';
    dragger.style.left = -draggerWidth + 'px';
    dragger.style.marginLeft = (draggerWidth / 2) + 'px';

    range.addEventListener("mousedown", function(e) {

		rangeWidth = 215;
        rangeLeft = 150;
        
        draggingSlider = id;        
        
        down = true;
        updateDragger(e, rrange);
        return false;
    });

    document.addEventListener("mousemove", function(e) {
        updateDragger(e, rrange);
    });

    document.addEventListener("mouseup", function() {
        down = false;
		draggingSlider = false;                
    });

    function updateDragger(e, rrange) {
           
        if (down && e.pageX >= rangeLeft && e.pageX <= (rangeLeft + rangeWidth)) {
   
            dragger.style.left = e.pageX - rangeLeft - draggerWidth + 'px';
            if (typeof onDrag == "function") onDrag(Math.round(((e.pageX - rangeLeft) / rangeWidth) * rrange));
        }
    }
}



// COLOR MATCHER
// COLOR MATCHER 
// COLOR MATCHER

// Finds matching colors... it's OK, but not the best algorithm out there...

var arrBlend = [];
function domatch(HSV){

	var hs = HSV;

	// Color matching algorithm. All work is done in HSV color space, because all
	// calculations are based on hue, saturation and value of the working color.
	// The hue spectrum is divided into sections, are the matching colors are
	// calculated differently depending on the hue of the color.
	
	var z=new Object();
	var y=new Object();
	var yx=new Object();
	y.s=hs.s;
	y.h=hs.h;
	if(hs.v>70){y.v=hs.v-30}else{y.v=hs.v+30};

	var RGB=new Object();
	HSV2RGB(y, RGB);
	z = RGB;
	
	outp("1",z);
	if((hs.h>=0)&&(hs.h<30)){
		yx.h=y.h=hs.h+30;yx.s=y.s=hs.s;y.v=hs.v;
		if(hs.v>70){yx.v=hs.v-30}else{yx.v=hs.v+30}
	}
	if((hs.h>=30)&&(hs.h<60)){yx.h=y.h=hs.h+150;
		y.s=rc(hs.s-30,100);
		y.v=rc(hs.v-20,100);
		yx.s=rc(hs.s-50,100);
		yx.v=rc(hs.v+20,100);
	}
	if((hs.h>=60)&&(hs.h<180)){
		yx.h=y.h=hs.h-40;
		y.s=yx.s=hs.s;
		y.v=hs.v;if(hs.v>70){yx.v=hs.v-30}else{yx.v=hs.v+30}
	}
	if((hs.h>=180)&&(hs.h<220)){
		yx.h=hs.h-170;
		y.h=hs.h-160;
		yx.s=y.s=hs.s;
		y.v=hs.v;
		if(hs.v>70){yx.v=hs.v-30}else{yx.v=hs.v+30}
	}if((hs.h>=220)&&(hs.h<300)){
		yx.h=y.h=hs.h;
		yx.s=y.s=rc(hs.s-40,100);
		y.v=hs.v;
		if(hs.v>70){yx.v=hs.v-30}else{yx.v=hs.v+30}
	}
	if(hs.h>=300){
		if(hs.s>50){y.s=yx.s=hs.s-40}else{y.s=yx.s=hs.s+40}yx.h=y.h=(hs.h+20)%360;
		y.v=hs.v;
		if(hs.v>70){yx.v=hs.v-30}else{yx.v=hs.v+30}
	}


	var RGB=new Object();
	HSV2RGB(y, RGB);
	z = RGB;	
	outp("2",z);
	
	var RGB=new Object();
	HSV2RGB(yx, RGB);
	z = RGB;	
	outp("3",z);

	y.h=0;
	y.s=0;
	y.v=100-hs.v;
	var RGB=new Object();
	HSV2RGB(y, RGB);
	z = RGB;
	outp("4",z);

	y.h=0;
	y.s=0;
	y.v=hs.v;
	var RGB=new Object();
	HSV2RGB(y, RGB);
	z = RGB;
	outp("5",z);
}
function outp(x,RGB){
	arrBlend[x]="#"+hexify(RGB.r)+hexify(RGB.g)+hexify(RGB.b);
	__updateSwatch(parseInt(x)+1);
}
function __updateSwatch(sNo) {

	document.getElementById("swatch_"+(sNo+2)).style.backgroundColor=arrBlend[sNo-1];
}
function rc(x,m){
	if(x>m){return m}
	if(x<0){return 0}else{return x}
}



// COLOR PICKER
// COLOR PICKER
// COLOR PICKER

// TODO: Kill off the micro image

var onclickListener = function(evt) {

	if ( haschanged ) {
		if ( !changingColors ) {
		    if (confirm("This action will regenerate a color palette for you. By proceding all your changes will be lost!") == true) {
			   haschanged = false;
			   hexChange();
		    }
		} else {

			imageData = ctxPix.getImageData(0,0,150,150);
			var barva='#'+d2h(imageData.data[45300+0])+d2h(imageData.data[45300+1])+d2h(imageData.data[45300+2]);
			_hexColor.value=barva;
			hexChange();
		}
	} else {
		
		imageData = ctxPix.getImageData(0,0,150,150);
		var barva='#'+d2h(imageData.data[45300+0])+d2h(imageData.data[45300+1])+d2h(imageData.data[45300+2]);
		_hexColor.value=barva;
		hexChange();
	} 

	
};
function img2canvas() {
	istat=true;
	cnvWidth=120;
	cnvHeight=70;
	
	c = _myCanvas;
	ctx=c.getContext("2d");

	cPix = _pixCanvas;
	ctxPix=cPix.getContext("2d");

	ctxPix.mozImageSmoothingEnabled = false;
	ctxPix.webkitImageSmoothingEnabled = false;

	img = _canvimg;
	imgHeight = img.height;
	imgWidth = img.width;
	
	
	if (imgHeight<cnvHeight && imgWidth<cnvWidth){
		ctx.mozImageSmoothingEnabled = false;
		ctx.webkitImageSmoothingEnabled = false;
	}

	if ((imgWidth/imgHeight)<1.56667){
		cnvWidth=imgWidth/imgHeight*cnvHeight;
	}else{
		cnvHeight=cnvWidth/(imgWidth/imgHeight);
	}
	ctx.clearRect(0, 0, c.width, c.height);
	ctx.drawImage(img,0,0,cnvWidth,cnvHeight);
	
	var onmoveListener = function(evt) {
		ev=1;
		if (istat){
			mousePos = getMousePos(c, evt);
			drawPix(cPix, ctxPix, img, Math.round(mousePos.x*(imgWidth/cnvWidth)), Math.round(mousePos.y*(imgHeight/cnvHeight)));
		}
	};
	c.addEventListener('mousemove', onmoveListener, false);
	c.addEventListener('mousedown', onclickListener, false);
		  
}
function drawPix(cPix, ctxPix, img, x, y) {
	ctxPix.clearRect(0, 0, cPix.width, cPix.height);
	if (x<5) x=5;
	if (y<5) y=5;
	if (x>imgWidth-4) x=imgWidth-4;
	if (y>imgHeight-4) y=imgHeight-4;
	ctxPix.drawImage(img,x-5,y-5,9,9,0,0,cPix.width,cPix.height);
}
function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return { x: evt.clientX - rect.left, y: evt.clientY - rect.top	};
}
function d2h(d){
	return ("0"+d.toString(16)).slice(-2).toUpperCase();
}


// FINDS THE MOST DOMINANT COLOR IN THE PICTURE
// FINDS THE MOST DOMINANT COLOR IN THE PICTURE
// FINDS THE MOST DOMINANT COLOR IN THE PICTURE

// TODO: Disable white and black as dominant colors
function ColorFinder(colorFactorCallback) {
  this.callback = colorFactorCallback;
  this.getMostProminentColor = function(imgEl) {
    var rgb = null;
    if (!this.callback) this.callback = function() { return 1; };
    var data = this.getImageData(imgEl);
    rgb = this.getMostProminentRGBImpl(data, 6, rgb, this.callback);
    rgb = this.getMostProminentRGBImpl(data, 4, rgb, this.callback);
    rgb = this.getMostProminentRGBImpl(data, 2, rgb, this.callback);
    rgb = this.getMostProminentRGBImpl(data, 0, rgb, this.callback);
    return rgb;
  };

  this.getImageData = function(imgEl, degrade, rgbMatch, colorFactorCallback) {
    
    var rgb,
        canvas = document.createElement('canvas'),
        context = canvas.getContext && canvas.getContext('2d'),
        data, width, height, key,
        i = -4,
        db={},
        length,r,g,b,
        count = 0;
    
    if (!context) {
      return defaultRGB;
    }
    
    height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
    width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;
    
    context.drawImage(imgEl, 0, 0);
    
    try {
      data = context.getImageData(0, 0, width, height);
    } catch(e) {
      return null;
    }

    length = data.data.length;
    
    var factor = Math.max(1,Math.round(length/5000));
    var result = {};
    
    while ( (i += 4*factor) < length ) {
      if (data.data[i+3]>32) {
        key = (data.data[i]>>degrade) + "," + (data.data[i+1]>>degrade) + "," + (data.data[i+2]>>degrade);
        if (!result.hasOwnProperty(key)) {
          rgb = {r:data.data[i], g:data.data[i+1], b:data.data[i+2],count:1};
          rgb.weight = this.callback(rgb.r, rgb.g, rgb.b);
          if (rgb.weight<=0) rgb.weight = 1e-10;
          result[key]=rgb;
        } else {
          rgb=result[key];
          rgb.count++;
        }
      }
    }
    return result;
  };
  
  this.getMostProminentRGBImpl = function(pixels, degrade, rgbMatch, colorFactorCallback) {
    
    var rgb = {r:0,g:0,b:0,count:0,d:degrade},
        db={},
        pixel,pixelKey,pixelGroupKey,
        length,r,g,b,
        count = 0;
    
    
    for (pixelKey in pixels) {
      pixel = pixels[pixelKey];
      totalWeight = pixel.weight * pixel.count;
      ++count;
      if (this.doesRgbMatch(rgbMatch, pixel.r, pixel.g, pixel.b)) {
        pixelGroupKey = (pixel.r>>degrade) + "," + (pixel.g>>degrade) + "," + (pixel.b>>degrade);
        if (db.hasOwnProperty(pixelGroupKey))
          db[pixelGroupKey]+=totalWeight;
        else
          db[pixelGroupKey]=totalWeight;
      }
    }
    
    for (i in db) {
      data = i.split(",");
      r = data[0];
      g = data[1];
      b = data[2];
      count = db[i];
      
      if (count>rgb.count) {
        rgb.count = count;
        data = i.split(",");
        rgb.r = r;
        rgb.g = g;
        rgb.b = b;
      }
    }
    
    return rgb;
    
  };

  this.doesRgbMatch = function(rgb,r,g,b) {
    if (rgb==null) return true;
    r = r >> rgb.d;
    g = g >> rgb.d;
    b = b >> rgb.d;
    return rgb.r == r && rgb.g == g && rgb.b == b;
  }

}




// CSS STYLE WRITER
// CSS STYLE WRITER
// CSS STYLE WRITER

// Changes the colors of the site by adding a STYLE tag in the head...
// OBS! This one also MAKES a lot of colors!
function stylizer() {
	
	// Picking up the color from the MAIN swatch
	var hVal = cArray[0][0].HSV.h;
	
	// Make a really dark version of it
	var ec1HEX = HSV2HEX(hVal, 50, 12);	

	// Make a quite dark version of it
	var ec2HEX = HSV2HEX(hVal, 30, 25);	

	// Make a hyper bright version of it
	var ec3HEX = HSV2HEX(cArray[2][3].HSV.h, 100, 100);	
	
	// Make a pale inactive color
	var ec4HEX = HSV2HEX(hVal, 15, 70);	
	
	// Make a hyper bright version of it
	var ec5HEX = HSV2HEX(cArray[4][0].HSV.h, 100, 100);

	// Make a hyper bright version of it
	var ec6HEX = HSV2HEX(cArray[1][0].HSV.h, 75, 75);
	
	var color1 = cArray[0][0].HEX;
	var color2 = cArray[0][1].HEX; 
	var color3 = cArray[0][2].HEX;	
	var color4 = cArray[0][3].HEX;
	var color5 = cArray[0][4].HEX;
	var color6 = cArray[0][5].HEX; 
	
	var color7 = cArray[3][2].HEX;
	var color8 = cArray[3][4].HEX;	
	
	var darklink = cArray[2][0].HEX;


	// Making some more colors... 
	// First three colors on second row of "Matching Colors"
	cArray[9] = [];
	var HSV = {}
		HSV.h = hVal;
		HSV.s = 30;
		HSV.v = 25;
	updatematchswatch(9, HSV);

	cArray[10] = [];
	var HSV = {}
		HSV.h = cArray[1][0].HSV.h;
		HSV.s = 75;
		HSV.v = 75;
	updatematchswatch(10, HSV);

	cArray[11] = [];
	var HSV = {}
		HSV.h = cArray[2][3].HSV.h;
		HSV.s = 100;
		HSV.v = 100;
	updatematchswatch(11, HSV);
	
	

	// The colors
	css[0].value = ec1HEX;		// ~ :	._color1
	css[1].value = ec1HEX;		// BG:	._color1bg, .ecolor1

	css[2].value = ec2HEX;		// ~ :	._color2
	css[3].value = ec2HEX;		// BG:	._color2bg, .ecolor2

	css[4].value = ec3HEX;		// ~ :	._color3, .ecolor2, .activ a
	css[5].value = ec3HEX;		// BG:	._color3bg, .ecolor3

	css[6].value = ec4HEX;		// ~ :	._color4, .ecolor1, .disabled
	css[7].value = ec4HEX;		// BG:	._color4bg, .ecolor4

	css[8].value = ec5HEX;		// ~ :	._color5
	css[9].value = ec5HEX;		// BG:	._color5bg, .ecolor5
	
	css[10].value = ec6HEX;		// ~ :	._color6
	css[11].value = ec6HEX;		// BG:	._color6bg, .ecolor6

	css[12].value = color3;		// ~ :	._color7
	css[13].value = color3;		// BG:	._color7bg, .color1

	css[14].value = color4;		// ~ :	._color8
	css[15].value = color4;		// BG:	._color8bg, .color2

	css[16].value = color5;		// ~ :	._color9
	css[17].value = color5;		// BG:	._color9bg, .color3

	css[18].value = color7;		// ~ :	._color10
	css[19].value = color7;		// BG:	._color10bg, .selected

	css[20].value = color8;		// ~ :	._color11
	css[21].value = color8;		// BG:	._color11bg

	css[22].value = darklink;	// ~ :	._color12, .nocolor
	css[23].value = darklink;	// BG:	._color12bg


	updateCSSstring();
	jcss.innerHTML = cssstring;

}


// Creates a string from the CSS array
function updateCSSstring() {
	cssstring = '';
	for (var i = 0; i<css.length;i++) {		
		cssstring += css[i].classes.join() + ' { ' + css[i].pre + ': ' + css[i].value + ' !important } ';
	}
}


// PASS COLORS WHEN CLICKING ON THE SWATCHES
// PASS COLORS WHEN CLICKING ON THE SWATCHES
// PASS COLORS WHEN CLICKING ON THE SWATCHES
function passcolor(arrn1) {

	// Define dark/light theme based on selection
	if ( arrn1 <= 28 && arrn1 >= 23 ) {
		darktheme = true;
	}

	if ( arrn1 >= 29 && arrn1 <= 34 ) {
		darktheme = false;
	}

	// Changing base color + light/dark theme	
	if ( changingColors == 'c0' ) {

		cArray['c0'] = cArray[arrn1];

		// Updates the CSS array
		updateC0();
		
		if ( darktheme ) {
			css[26].value = 'white'; // .editor-wrapper, .editor-wrapper h3, .editor-wrapper h4
		} else {
			css[26].value = 'black'; // .editor-wrapper, .editor-wrapper h3, .editor-wrapper h4
		}		
		
		// Update the color blender/selector/values		
		_hexColor.value = cArray['c0'][0].HEX;	
		updateAllSliders(cArray['c0'][0].RGB, cArray['c0'][0].HSV);		
			
	}
	
	// Menu color
	if ( changingColors == 'c1' ) {
		cArray['c1'] = cArray[arrn1];
		
		// Updates the CSS array		
		updateC1();

		// Update the color blender/selector/values		
		_hexColor.value = cArray['c1'][0].HEX;		
		hexChange();		
		updateAllSliders(cArray['c1'][0].RGB, cArray['c1'][0].HSV);				
	}

	// Active/selected color
	if ( changingColors == 'c2' ) {
		cArray['c2'] = cArray[arrn1];

		// Updates the CSS array
		updateC2();
		
		// Update the color blender/selector/values
		_hexColor.value = cArray['c2'][0].HEX;		
		hexChange();
		updateAllSliders(cArray['c2'][0].RGB, cArray['c2'][0].HSV);		
	}

	// Link color / dark background
	if ( changingColors == 'c3' ) {
		cArray['c3'] = cArray[arrn1];

		// Updates the CSS array
		updateC3();

		// Update the color blender/selector/values
		_hexColor.value = cArray['c3'][0].HEX;		
		hexChange();
		updateAllSliders(cArray['c3'][0].RGB, cArray['c3'][0].HSV);		
	}	

	// Link color / light background
	if ( changingColors == 'c4' ) {
		cArray['c4'] = cArray[arrn1];		

		// Updates the CSS array
		updateC4();		
		
		// Update the color blender/selector/values
		_hexColor.value = cArray['c4'][0].HEX;		
		hexChange();
		updateAllSliders(cArray['c4'][0].RGB, cArray['c4'][0].HSV);		
		
	}	

	// Merge array and write CSS in <head>
	updateCSSstring();
	jcss.innerHTML = cssstring;	
				
}




// ONLOAD
// ONLOAD
// ONLOAD

// • Picks up elements from the dom, and contains their click-events
// • Declares static colors that comes with all themes

// Declare some vars that will get picked up from the DOM... 
var yourswatch, _hexColor, _rChannel, _gChannel, _bChannel, _hChannel, _sChannel, _vChannel, _myCanvas, _pixCanvas, _canvimg;


function startColorThemes() {


	var dark1 = document.getElementById('colortheme-dark1');
	var dark2 = document.getElementById('colortheme-dark2');
	var dark3 = document.getElementById('colortheme-dark3');

	var light1 = document.getElementById('colortheme-light1');
	var light2 = document.getElementById('colortheme-light2');
	var light3 = document.getElementById('colortheme-light3');					


	dark1.onclick = function() {prethemes('dark1');}
	dark2.onclick = function() {prethemes('dark2');}
	dark3.onclick = function() {prethemes('dark3');}
	
	light1.onclick = function() {prethemes('light1');}
	light2.onclick = function() {prethemes('light2');}
	light3.onclick = function() {prethemes('light3');}
	
	
	var advanced_themes = document.getElementById('advanced-themes');
	var basic_themes = document.getElementById('basic-themes');	
	
	
	var parent_ = document.getElementById('project-color-theme').parentNode.parentNode;
		parent_.style.height = '190px';		
	
	var advanced = document.getElementById('advanced-theme-selector');
	
	advanced.onclick = function() {
		document.getElementById('project-color-theme').parentNode.style.left = '-580px';		
		parent_.style.height = '410px';
		nextLevel(parent_);		
	}
	
	



	

	document.getElementById('project-color-theme').parentNode.style.left = '-310px';

	document.getElementById('cancel-colors-editor').onclick = function() {
		document.getElementById('project-color-theme').parentNode.style.left = '0px';
		parent_.style.height = '231px';
	}

}

function nextLevel(parent_) {

	var b2basic = document.getElementById('back-to-basic');
		b2basic.onclick = function() {
			document.getElementById('project-color-theme').parentNode.style.left = '-310px';
			parent_.style.height = '190px';				
		}



	// For CSS animating height of container
	var pheight1 = '410px';
	var pheight2 = '517px';

		parent_.style.height = pheight1;


	// Find the right image to use for the color picker...
	// OBS! Image must be stored locally (same url as server) for it to work...
	var uggid = document.getElementById('project-color-theme').parentNode.getAttribute('uuid');
	var ulist =	document.getElementById('editor-projects-container');
		ulist = ulist.getElementsByTagName('div');

		for ( var ui=0; ui<ulist.length; ui++ ) {
			if ( ulist[ui].className == 'editor-projects-item active' || ulist[ui].className == 'editor-projects-item' ) {
				var eluid = ulist[ui].getAttribute('uuid');
				
				if ( eluid == uggid ) {
					_canvimg = ulist[ui].getElementsByTagName('img')[0];
				}
			}
		} // end


	yourswatch = document.getElementById('yourswatch');	
	yourswatch.style.backgroundColor = basecolor;

	
	_myCanvas = document.getElementById("myCanvas");
	_pixCanvas = document.getElementById("pixCanvas");
/* 	_canvimg = document.getElementById("canvimg"); */
	


		// HEX
		_hexColor = document.getElementById('hexColor');
		_hexColor.onblur = function() {
			hexChange();
		}

		// RGB
		_rChannel = document.getElementById('rChannel');
		_rChannel.onblur = function() {
			rgbChange();
		}

		_gChannel = document.getElementById('gChannel');
		_gChannel.onblur = function() {
			rgbChange();
		}

		_bChannel = document.getElementById('bChannel');
		_bChannel.onblur = function() {
			rgbChange();
		}
		
		
		// HSV
		_hChannel = document.getElementById('hChannel');
		_hChannel.onblur = function() {
			hsvChange();
		}

		_sChannel = document.getElementById('sChannel');
		_sChannel.onblur = function() {
			hsvChange();
		}
		
		_vChannel = document.getElementById('vChannel');
		_vChannel.onblur = function() {
			hsvChange();
		}

				
				
	// Update slider 1 - H
	rangeSlider('range-slider-1', 360, function(value) {
	    _hChannel.value = value;
	    hsvChange();
	});

	// Update slider 2 - S
	rangeSlider('range-slider-2', 100, function(value) {
	    _sChannel.value = value;
	    hsvChange();
	});

	// Update slider 3 - V
	rangeSlider('range-slider-3', 100, function(value) {
	    _vChannel.value = value;
	    hsvChange();
	});

	// Update slider R
	rangeSlider('range-slider-r', 255, function(value) {
	    _rChannel.value = value;
	    rgbChange();
	});

	// Update slider G
	rangeSlider('range-slider-g', 255, function(value) {
	    _gChannel.value = value;
	    rgbChange();
	});

	// Update slider B
	rangeSlider('range-slider-b', 255, function(value) {
	    _bChannel.value = value;
	    rgbChange();
	});

		
	// Color picker
	img2canvas();
		
	// Finds the most dominant color in the picture, and sets it as the base color
//	var nrgb = new ColorFinder().getMostProminentColor(document.getElementById('canvimg'));
//	var nhex = RGB2hex(nrgb);
//	_hexColor.value = nhex;
//	hexChange();
	hexChange_start();
	
	
	// Set the USER color in Array
	cArray['c0'] = cArray[9];	
	cArray['c1'] = cArray[0];				
	cArray['c2'] = cArray[3];
	cArray['c3'] = cArray[11];				
	cArray['c4'] = cArray[11];
	

		
	// Make dark and light color themes, and update the swatches with values

	// These are all STATIC COLORS
	
	makeDarkColors(23,215);	
	makeDarkColors(24,196);
	makeDarkColors(25,319);
	makeDarkColors(26,354);
	makeDarkColors(27,22);
	
	// Make a neutral dark color!
	cArray[28] = [];
	cArray[28][0] = {};
	cArray[28][0].HSV = {};
	cArray[28][0].HSV.h = 100; 
	cArray[28][0].HSV.s = 0; 
	cArray[28][0].HSV.v = 10;
	cArray[28][0].HEX = HSV2HEX(100, 0, 10);	 
	cArray[28][0].RGB = {};
	HSV2RGB(cArray[28][0].HSV, cArray[28][0].RGB);

	cArray[28][1] = {};	
	cArray[28][1].HSV = {};
	cArray[28][1].HSV.h = 100; 
	cArray[28][1].HSV.s = 0; 
	cArray[28][1].HSV.v = 20;
	cArray[28][1].HEX = HSV2HEX(100, 0, 20);	 
	cArray[28][1].RGB = {};
	HSV2RGB(cArray[28][1].HSV, cArray[28][1].RGB);

	cArray[28][2] = {};	
	cArray[28][2].HSV = {};
	cArray[28][2].HSV.h = 100; 
	cArray[28][2].HSV.s = 0; 
	cArray[28][2].HSV.v = 70;
	cArray[28][2].HEX = HSV2HEX(100, 0, 70);	 
	cArray[28][2].RGB = {};
	HSV2RGB(cArray[28][2].HSV, cArray[28][2].RGB);
	
	var _ts = 'swatch_' + 28;
	document.getElementById(_ts).style.backgroundColor = cArray[28][1].HEX;


			
	makeLightColors(29,215);
	makeLightColors(30,196);
	makeLightColors(31,319);
	makeLightColors(32,76);
	makeLightColors(33,354);
	
	cArray[34] = [];
	cArray[34][0] = {};
	cArray[34][0].HSV = {};
	cArray[34][0].HSV.h = 22; 
	cArray[34][0].HSV.s = 0; 
	cArray[34][0].HSV.v = 70;
	cArray[34][0].HEX = HSV2HEX(22, 0, 70);	 
	cArray[34][0].RGB = {};
	HSV2RGB(cArray[34][0].HSV, cArray[34][0].RGB);

	cArray[34][1] = {};	
	cArray[34][1].HSV = {};
	cArray[34][1].HSV.h = 22; 
	cArray[34][1].HSV.s = 0; 
	cArray[34][1].HSV.v = 93;
	cArray[34][1].HEX = HSV2HEX(22, 0, 93);	 
	cArray[34][1].RGB = {};
	HSV2RGB(cArray[34][1].HSV, cArray[34][1].RGB);

	cArray[34][2] = {};	
	cArray[34][2].HSV = {};
	cArray[34][2].HSV.h = 22; 
	cArray[34][2].HSV.s = 0; 
	cArray[34][2].HSV.v = 25;
	cArray[34][2].HEX = HSV2HEX(22, 0, 25);	 
	cArray[34][2].RGB = {};
	HSV2RGB(cArray[34][2].HSV, cArray[34][2].RGB);
	
	
	var _ts = 'swatch_' + 34;
	document.getElementById(_ts).style.backgroundColor = cArray[34][1].HEX;	
	
	
	
		
	// Additional BRIGHT presets for links ... again, these are static colors
	
	cArray[12] = [];
	cArray[12][0] = {};		
	cArray[12][0].HEX = '#FF00FF';
	cArray[12][0].HSV = {};
	cArray[12][0].HSV.h = 300;
	cArray[12][0].HSV.s = 100;
	cArray[12][0].HSV.v = 100;		
	cArray[12][0].RGB = {};
	cArray[12][0].RGB.r = 255;	
	cArray[12][0].RGB.g = 0;	
	cArray[12][0].RGB.b = 255;	
	document.getElementById('swatch_12').style.backgroundColor = cArray[12][0].HEX;

	cArray[13] = [];
	cArray[13][0] = {};	
	cArray[13][0].HEX = '#FF00AA';
	cArray[13][0].HSV = {};
	cArray[13][0].HSV.h = 320;
	cArray[13][0].HSV.s = 100;
	cArray[13][0].HSV.v = 100;		
	cArray[13][0].RGB = {};
	cArray[13][0].RGB.r = 255;	
	cArray[13][0].RGB.g = 0;	
	cArray[13][0].RGB.b = 170;				
	document.getElementById('swatch_13').style.backgroundColor = cArray[13][0].HEX;		

	cArray[14] = [];
	cArray[14][0] = {};	
	cArray[14][0].HEX = '#FF0055';
	cArray[14][0].HSV = {};
	cArray[14][0].HSV.h = 340;
	cArray[14][0].HSV.s = 100;
	cArray[14][0].HSV.v = 100;		
	cArray[14][0].RGB = {};
	cArray[14][0].RGB.r = 255;	
	cArray[14][0].RGB.g = 0;	
	cArray[14][0].RGB.b = 85;				
	document.getElementById('swatch_14').style.backgroundColor = cArray[14][0].HEX;		
	
	cArray[15] = [];
	cArray[15][0] = {};		
	cArray[15][0].HEX = '#FF0000';
	cArray[15][0].HSV = {};
	cArray[15][0].HSV.h = 0;
	cArray[15][0].HSV.s = 100;
	cArray[15][0].HSV.v = 100;		
	cArray[15][0].RGB = {};
	cArray[15][0].RGB.r = 255;	
	cArray[15][0].RGB.g = 0;	
	cArray[15][0].RGB.b = 0;
	document.getElementById('swatch_15').style.backgroundColor = cArray[15][0].HEX;	
	
	cArray[16] = [];
	cArray[16][0] = {};	
	cArray[16][0].HEX = '#FF5400';
	cArray[16][0].HSV = {};
	cArray[16][0].HSV.h = 20;
	cArray[16][0].HSV.s = 100;
	cArray[16][0].HSV.v = 100;		
	cArray[16][0].RGB = {};
	cArray[16][0].RGB.r = 255;	
	cArray[16][0].RGB.g = 84;	
	cArray[16][0].RGB.b = 0;
	document.getElementById('swatch_16').style.backgroundColor = cArray[16][0].HEX;	
	
	cArray[17] = [];
	cArray[17][0] = {};	
	cArray[17][0].HEX = '#FF9400';
	cArray[17][0].HSV = {};
	cArray[17][0].HSV.h = 35;
	cArray[17][0].HSV.s = 100;
	cArray[17][0].HSV.v = 100;		
	cArray[17][0].RGB = {};
	cArray[17][0].RGB.r = 255;	
	cArray[17][0].RGB.g = 148;	
	cArray[17][0].RGB.b = 0;	
	document.getElementById('swatch_17').style.backgroundColor = cArray[17][0].HEX;		

	cArray[18] = [];
	cArray[18][0] = {};	
	cArray[18][0].HEX = '#FFD400';
	cArray[18][0].HSV = {};
	cArray[18][0].HSV.h = 50;
	cArray[18][0].HSV.s = 100;
	cArray[18][0].HSV.v = 100;		
	cArray[18][0].RGB = {};
	cArray[18][0].RGB.r = 255;	
	cArray[18][0].RGB.g = 212;	
	cArray[18][0].RGB.b = 0;	
	document.getElementById('swatch_18').style.backgroundColor = cArray[18][0].HEX;	
	
	cArray[19] = [];
	cArray[19][0] = {};	
	cArray[19][0].HEX = '#FFFF00';
	cArray[19][0].HSV = {};
	cArray[19][0].HSV.h = 60;
	cArray[19][0].HSV.s = 100;
	cArray[19][0].HSV.v = 100;		
	cArray[19][0].RGB = {};
	cArray[19][0].RGB.r = 255;	
	cArray[19][0].RGB.g = 255;	
	cArray[19][0].RGB.b = 0;
	document.getElementById('swatch_19').style.backgroundColor = cArray[19][0].HEX;	

	cArray[20] = [];
	cArray[20][0] = {};	
	cArray[20][0].HEX = '#00FFD4';
	cArray[20][0].HSV = {};
	cArray[20][0].HSV.h = 170;
	cArray[20][0].HSV.s = 100;
	cArray[20][0].HSV.v = 100;		
	cArray[20][0].RGB = {};
	cArray[20][0].RGB.r = 0;	
	cArray[20][0].RGB.g = 255;	
	cArray[20][0].RGB.b = 212;	
	document.getElementById('swatch_20').style.backgroundColor = cArray[20][0].HEX;	

	cArray[21] = [];
	cArray[21][0] = {};	
	cArray[21][0].HEX = '#00FFFF';
	cArray[21][0].HSV = {};
	cArray[21][0].HSV.h = 180;
	cArray[21][0].HSV.s = 100;
	cArray[21][0].HSV.v = 100;		
	cArray[21][0].RGB = {};
	cArray[21][0].RGB.r = 0;	
	cArray[21][0].RGB.g = 255;	
	cArray[21][0].RGB.b = 255;				
	document.getElementById('swatch_21').style.backgroundColor = cArray[21][0].HEX;				

	cArray[22] = [];
	cArray[22][0] = {};	
	cArray[22][0].HEX = '#54FF00';
	cArray[22][0].HSV = {};
	cArray[22][0].HSV.h = 100;
	cArray[22][0].HSV.s = 100;
	cArray[22][0].HSV.v = 100;		
	cArray[22][0].RGB = {};
	cArray[22][0].RGB.r = 85;	
	cArray[22][0].RGB.g = 255;	
	cArray[22][0].RGB.b = 0;		
	document.getElementById('swatch_22').style.backgroundColor = cArray[22][0].HEX;	






	// GO INTO COLOR EDITING MODE

	var _coloption1 = document.getElementById('coloption1');
	var _coloption2 = document.getElementById('coloption2');
	var _coloption3 = document.getElementById('coloption3');	
	
	var _yourcolLink1 = document.getElementById('yourcol_link1');
	var _yourcolLink2 = document.getElementById('yourcol_link2');	
	
	var _normalSwatches = document.getElementById('normal-swatches');
	var _darkSwatches = document.getElementById('dark-swatches');
	var _linkSwatches = document.getElementById('link-swatches');
	var _colorSuggestions = document.getElementById('color-suggestions');
	
	
	// c0 ~ Background color
	_coloption1.onclick = function() {
		
			haschanged = true;
	
			// If we are already editing this color
			if ( changingColors == 'c0' ) {
			
				parent_.style.height = pheight1;
							
				// Disable editing state									
				changingColors = false;
				
				// Remove red box around this element				
				this.className = 'yourcol_wrapper';
				
				// Set back to default swatches								
				_normalSwatches.className = '';												
				_darkSwatches.className = 'die';								

				// Close the swatch selector												
				_colorSuggestions.className = 'collapsed-color-suggestions';
								
								
			} else {
			
				parent_.style.height = pheight2;			
			
				// Set edit state			
				changingColors = 'c0';
				
				// Put red box around this element				
				this.className = 'yourcol_wrapper changing';		

				// What swatches to show
				_darkSwatches.className = '';
				_linkSwatches.className = 'die';
				_normalSwatches.className = 'die';				

				// Remove red frame from other elements
				_coloption2.className = 'yourcol_wrapper';		
				_coloption3.className = 'yourcol_wrapper';				
				_yourcolLink1.className = 'yourcol ecolor2';
				_yourcolLink2.className = 'yourcol nocolor';				
				
				
				// Update the Alfra Omega swatch
				yourswatch.style.backgroundColor = css[1].value;
				
				// Set the HEX value in the input field
				_hexColor.value = css[1].value;				
				
				// Open the swatch selector				
				_colorSuggestions.className = '';
				
				hexChange();				
				updateAllSliders(cArray['c0'][0].RGB, cArray['c0'][0].HSV);

			}
		}

	// c1 ~ The menu color
	_coloption2.onclick = function() {


			haschanged = true;

			// If we are already editing this color
			if ( changingColors == 'c1' ) {

				parent_.style.height = pheight1;
							
				// Disable editing state						
				changingColors = false;
				
				// Remove red box around this element								
				this.className = 'yourcol_wrapper';
				
				// Close the swatch selector								
				_colorSuggestions.className = 'collapsed-color-suggestions';
								
			} else {
			
				parent_.style.height = pheight2;
			
				// Set edit state			
				changingColors = 'c1';
				
				// Put red box around this element
				this.className = 'yourcol_wrapper changing';	
					
				// What swatches to show
				_linkSwatches.className = 'die';
				_darkSwatches.className = 'die';				
				_normalSwatches.className = '';				

				// Remove red frame from other elements					
				_coloption1.className = 'yourcol_wrapper';													
				_coloption3.className = 'yourcol_wrapper';								
				_yourcolLink1.className = 'yourcol ecolor2';
				_yourcolLink2.className = 'yourcol nocolor';								
				
				// Update the Alfra Omega swatch
				yourswatch.style.backgroundColor = css[13].value;

				// Set the HEX value in the input field
				_hexColor.value = css[13].value;		
								
				// Open the swatch selector				
				_colorSuggestions.className = '';
				
				hexChange();

				updateAllSliders(cArray['c1'][0].RGB, cArray['c1'][0].HSV);
				
			}
		}
	
	// c2 ~ Selected / active colors
	_coloption3.onclick = function() {

			haschanged = true;

			// If we are already editing this color
			if ( changingColors == 'c2' ) {
			
				parent_.style.height = pheight1;			
			
				// Disable editing state			
				changingColors = false;
				
				// Remove red box around this element				
				this.className = 'yourcol_wrapper';
				
				// Close the swatch selector				
				_colorSuggestions.className = 'collapsed-color-suggestions';				
				
			} else {
			
				parent_.style.height = pheight2;
							
				// Set edit state			
				changingColors = 'c2';
				
				// Put red box around this element				
				this.className = 'yourcol_wrapper changing';	

				// What swatches to show
				_linkSwatches.className = 'die';
				_darkSwatches.className = 'die';				
				_normalSwatches.className = '';				

				// Remove red frame from other elements
				_coloption1.className = 'yourcol_wrapper';														
				_coloption2.className = 'yourcol_wrapper';		
				_yourcolLink1.className = 'yourcol ecolor2';
				_yourcolLink2.className = 'yourcol nocolor';				

				// Update the Alfra Omega swatch				
				yourswatch.style.backgroundColor = css[19].value;

				// Set the HEX value in the input field
				_hexColor.value = css[19].value;
											
				// Open the swatch selector				
				_colorSuggestions.className = '';		

				hexChange();
				updateAllSliders(cArray['c2'][0].RGB, cArray['c2'][0].HSV);
			}
		}
		
	// c3 ~ Link color
	_yourcolLink1.onclick = function() {
		
			haschanged = true;
		
			// If we are already editing this color
			if ( changingColors == 'c3' ) {
		
				parent_.style.height = pheight1;
						
				// Disable editing state
				changingColors = false;
				
				// Remove red box around this element
				this.className = 'yourcol ecolor2';
				
				// Set back to default swatches
				_linkSwatches.className = 'die';
				_normalSwatches.className = '';				

				// Close the swatch selector
				_colorSuggestions.className = 'collapsed-color-suggestions';				


			} else {
					
				parent_.style.height = pheight2;
									
				// Set edit state
				changingColors = 'c3';
				
				// Put red box around this element
				this.className = 'yourcol ecolor2 changing';				
		
				// What swatches to show
				_linkSwatches.className = '';
				_normalSwatches.className = 'die';	
				_darkSwatches.className = 'die';							
				
				// Remove red frame from other elements
				_coloption1.className = 'yourcol_wrapper';
				_coloption2.className = 'yourcol_wrapper';		
				_coloption3.className = 'yourcol_wrapper';
				_yourcolLink2.className = 'yourcol nocolor';				
				
				// Update the Alfra Omega swatch
				yourswatch.style.backgroundColor = css[4].value;

				// Set the HEX value in the input field
				_hexColor.value = css[4].value;
				
				// Open the swatch selector
				_colorSuggestions.className = '';
				
				hexChange();				
				updateAllSliders(cArray['c3'][0].RGB, cArray['c3'][0].HSV);
			}
		}

	// c4 ~ Link color / light background
	_yourcolLink2.onclick = function() {
		
			haschanged = true;
		
			// If we are already editing this color
			if ( changingColors == 'c4' ) {
			
				parent_.style.height = pheight1;			
		
				// Disable editing state
				changingColors = false;
				
				// Remove red box around this element
				this.className = 'yourcol nocolor';
				

				// Set back to default swatches
				_linkSwatches.className = 'die';
				_normalSwatches.className = '';				

				// Close the swatch selector
				_colorSuggestions.className = 'collapsed-color-suggestions';				



			} else {

				parent_.style.height = pheight2;			
					
				// Set edit state
				changingColors = 'c4';
				
				// Put red box around this element
				this.className = 'yourcol nocolor changing';				
		

				// What swatches to show
				_linkSwatches.className = '';
				_normalSwatches.className = 'die';	
				_darkSwatches.className = 'die';							
				
				// Remove red frame from other elements
				_coloption1.className = 'yourcol_wrapper';
				_coloption2.className = 'yourcol_wrapper';		
				_coloption3.className = 'yourcol_wrapper';
				_yourcolLink1.className = 'yourcol ecolor2';


				// Update the Alfra Omega swatch
				yourswatch.style.backgroundColor = css[22].value;

				// Set the HEX value in the input field
				_hexColor.value = css[22].value;
				

				// Open the swatch selector
				_colorSuggestions.className = '';
				
				hexChange();				
				updateAllSliders(cArray['c4'][0].RGB, cArray['c4'][0].HSV);
				
				
			}
		}

		
		
	// Toggle between RGB and HSV slider mode, yo	
	var hsvToggle = document.getElementById('hsv-toggle');
	var rgbToggle = document.getElementById('rgb-toggle'); 	
	
	hsvToggle.onclick = function() {		
			var togclass = this.className;		
			if ( togclass == 'active-toggle' ) {
				this.className = '';
				rgbToggle.className = 'active-toggle';				
				document.getElementById('rgb-slider-container').className = '';
				document.getElementById('hsv-slider-container').className = 'die';	
			} else {
				this.className = 'active-toggle';
				rgbToggle.className = '';
				document.getElementById('rgb-slider-container').className = 'die';
				document.getElementById('hsv-slider-container').className = '';	
			}
		}
	rgbToggle.onclick = function() {
			var togclass = this.className;			
			if ( togclass == 'active-toggle' ) {
				this.className = '';
				hsvToggle.className = 'active-toggle';				
				document.getElementById('rgb-slider-container').className = 'die';
				document.getElementById('hsv-slider-container').className = '';	
			} else {
				this.className = 'active-toggle';
				hsvToggle.className = '';			
				document.getElementById('rgb-slider-container').className = '';
				document.getElementById('hsv-slider-container').className = 'die';	
			}
		}

}







// In the beginning

function hexChange_start() {

	var colorString = getObjectByID("hexColor").value;
		
	var RGB = new RGBobject(0,0,0);
	var HSV = new HSVobject(0,0,0);
	hex2RGB(colorString, RGB);
	RGB2HSV (RGB, HSV);
	getObjectByID("rChannel").value = Math.round(RGB.r);
	getObjectByID("gChannel").value = Math.round(RGB.g);
	getObjectByID("bChannel").value = Math.round(RGB.b);
	getObjectByID("hChannel").value = Math.round(HSV.h);
	getObjectByID("sChannel").value = Math.round(HSV.s);
	getObjectByID("vChannel").value = Math.round(HSV.v);

	// Change all the colors	
	var _hex = colorString;
	updateSwatch_start(_hex);	// Pulls stylizer ... which writes the CSS array and injects it in the HEAD 
		
}

function updateSwatch_start(_hex) {

	// Updating the color swatches that contains the BASE color
	getObjectByID("swatch_1").style.backgroundColor = _hex;
	yourswatch.style.backgroundColor = _hex;

	var colorString = _hex;
	
	var RGB = new RGBobject(0,0,0);
	var HSV = new HSVobject(0,0,0);
	hex2RGB(colorString, RGB);
	RGB2HSV (RGB, HSV);
		
	// Update the Color Array	
	cArray[0] = [];		
	cArray[0][0] = {};
	cArray[0][0].HEX = _hex;		
	cArray[0][0].RGB = {'r': RGB.r, 'g': RGB.g, 'b': RGB.b };
	cArray[0][0].HSV = {'h': HSV.h, 's': HSV.s, 'v': HSV.v };
		
		
	var htemp = HSV.h;
	var stemp = HSV.s;
	var vtemp = HSV.v;
		
	
	// Hue
	var hval = HSV.h;
	var hpos = 360-hval;

	// Go down the bulks and make LIGHTER swatches
	for ( var i=0; i<4;i++ ) {
	
		// Declare the Array that contains all the colors
		cArray[i] = [];	

		var hstep = hval + (90*i);
			
		if ( hstep > 360 ) {
			hstep = hstep - 360;
		}
		
		hstep = Math.floor(hstep);


		HSV.h = hstep;
		HSV.s = stemp;
		HSV.v = vtemp;
		
		HSV2RGB(HSV, RGB);
		var nhex = RGB2hex(RGB);				

		// Update the actual Swatch
		var tempswatch = 'swatch_' + i;
		var swatt = document.getElementById(tempswatch);
			swatt.style.backgroundColor = nhex;
		
			// Go down the swatches
			for ( var o=0; o<6;o++) {			
		
				// Value
				var vval = HSV.v;
				var valdiff = 100-vval;	
				var valstep = valdiff/6;	
				HSV.v = Math.floor(vval + (valstep*o));
				
				// Lightness
				var sval = HSV.s;
				var svalstep = sval/6;
				HSV.s = Math.floor(sval - (svalstep*o));
				
				HSV2RGB (HSV, RGB);
				var nhex = RGB2hex(RGB);
				
				// Update the array with all the colors
				cArray[i][o] = {};
				cArray[i][o].HEX = nhex;						
				cArray[i][o].RGB = {'r': RGB.r, 'g': RGB.g, 'b': RGB.b };
				cArray[i][o].HSV = {'h': HSV.h, 's': HSV.s, 'v': HSV.v };					
				
			}
	}
	
	
	HSV = cArray[0][0].HSV;
	RGB = cArray[0][0].RGB;
		

	// Update sliders
	updateAllSliders(RGB, HSV);


	hex2RGB(_hex, RGB);
	RGB2HSV (RGB, HSV);
	
	// Finds matching colors
	domatch(HSV);
	
	// Update the MATCHING colors in cArray
	
	// Match Color 1
	hex2RGB(arrBlend[1], RGB);
	RGB2HSV (RGB, HSV);
	cArray[4] = [];
	updatematchswatch(4, HSV);

	// Match Color 2
	hex2RGB(arrBlend[2], RGB);
	RGB2HSV (RGB, HSV);
	cArray[5] = [];
	updatematchswatch(5, HSV);

	// Match Color 3
	hex2RGB(arrBlend[3], RGB);
	RGB2HSV (RGB, HSV);
	cArray[6] = [];
	updatematchswatch(6, HSV);
	
	// Match Color 4	
	hex2RGB(arrBlend[4], RGB);
	RGB2HSV (RGB, HSV);	
	cArray[7] = [];
	updatematchswatch(7, HSV);

	// Match Color 5
	hex2RGB(arrBlend[5], RGB);
	RGB2HSV (RGB, HSV);
	cArray[8] = [];
	updatematchswatch(8, HSV);
	
}