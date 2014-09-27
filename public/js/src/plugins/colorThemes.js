var colorTheme = {};
var savedCSS;

// The CSS
var _CTheader = document.getElementsByTagName('head')[0],
	jcss;

	jcss = document.createElement('style');
	jcss.setAttribute('type', 'text/css');
	jcss.setAttribute('rel', 'stylesheet');	
	_CTheader.appendChild(jcss);
	
	

function injectCSS() {
	
	colorTheme = JSON.parse(savedCSS);
	
	var _CSSstring = '';
	for (var i = 0; i<colorTheme.css.length;i++) {			
		if ( colorTheme.css[i].value ) {			
			_CSSstring += colorTheme.css[i].classes.join() + ' { ' + colorTheme.css[i].pre + ': ' + colorTheme.css[i].value + ' !important } ';
		}
	}		

	jcss.innerHTML = _CSSstring;	
}



//**********************************************************************//			
//**********************************************************************//
//									//
//	 ________  _________    ___    ___ ___       _______          	//
//	|\   ____\|\___   ___\ |\  \  /  /|\  \     |\  ___ \         	//
//	\ \  \___|\|___ \  \_| \ \  \/  / | \  \    \ \   __/|        	//
//	 \ \_____  \   \ \  \   \ \    / / \ \  \    \ \  \_|/__      	//
//	  \|____|\  \   \ \  \   \/  /  /   \ \  \____\ \  \_|\ \     	//
//	    ____\_\  \   \ \__\__/  / /      \ \_______\ \_______\    	//
//	   |\_________\   \|__|\___/ /        \|_______|\|_______|    	//
//	   \|_________|       \|___|/                                 	//
//	                                                              	//
//	                                                              	//
//	 _______   ________  ___  _________  ________  ________       	//
//	|\  ___ \ |\   ___ \|\  \|\___   ___\\   __  \|\   __  \      	//
//	\ \   __/|\ \  \_|\ \ \  \|___ \  \_\ \  \|\  \ \  \|\  \     	//
//	 \ \  \_|/_\ \  \ \\ \ \  \   \ \  \ \ \  \\\  \ \   _  _\    	//
//	  \ \  \_|\ \ \  \_\\ \ \  \   \ \  \ \ \  \\\  \ \  \\  \|   	//
//	   \ \_______\ \_______\ \__\   \ \__\ \ \_______\ \__\\ _\   	//
//	    \|_______|\|_______|\|__|    \|__|  \|_______|\|__|\|__|  	//
//	                                                              	//
//	                                                              	//
//                                                              	//
//**********************************************************************//
//**********************************************************************//



function startColorThemes() {
	
	
	// Bruker denne når en ny klasse legges til...
	// Grunnen til det er at det LAGREDE color theme objektet må oppdateres med riktig array,
	// så hvis det har blitt endring i klasselisten må alle prosjekter reloades i color theme
	// med rezet som true state, yo.
	
	var rezet = true;
	
	
	var tempjcss, 				// The tag in the head where the CSS gets injected
		draggingSlider = false, 	// If we are dragging, and what bar is being dragged
	
		// For Color Theme
		haschanged = false, 		// If individual colors has been changed or not (for overriding feedback purposes)
		changingColors = false, 	// For editing mode (To know what color we're editing )
	
		// These must follow on save
	
		basecolor,					
		RGB, HSV,
		
		css = [], 					// The CSS array
		tempCSS = {}, 				// The CSS array
	
		cssstring = '',		 		// The CSS string
	
		lightColor = [],			// Static colors
		darkColor = [],				// Static colors
		brightColor = [],			// Static colors
		
		complimentaryColor = [], 	// Dynamically changing colors
		matchingColor = [],		 	// Dynamically changing colors
		customColor = [],		 	// For custom made colors
	
		eVars = {},					// Contains div objects from the DOM (picked up by ID)
		theClassArray = [];
	
	
		// These Follows the Color Theme
	
		colorTheme.darktheme = true;
		colorTheme.cTheme = false;
		colorTheme.cThemeDarkMenu = true;
		colorTheme.cThemeDarkHeader = false;
		colorTheme.cThemeDarkBox = false;
		

		if ( !colorTheme.css || rezet ) colorTheme.css = [];
	
		// The Swatch CSS
		tempjcss = document.createElement('style');
		tempjcss.setAttribute('type', 'text/css');
		tempjcss.setAttribute('rel', 'stylesheet');	
		_CTheader.appendChild(tempjcss);
	
	
			
	// *****************************************
				
	// CORE FUNCTIONS
	// CORE FUNCTIONS
	// CORE FUNCTIONS

	// *****************************************
	
	var eCol = {
	
		// GENERAL
		// GENERAL
	
		// Create a HSV object
		HSVobject : function (hue, saturation, value) {
		// Object definition.
		this.h = hue; this.s = saturation; this.v = value;
		this.validate = function () {
			if (this.h <= 0) {this.h = 0;}
			if (this.s <= 0) {this.s = 0;}
			if (this.v <= 0) {this.v = 0;}
			if (this.h > 360) {this.h = 360;}
			if (this.s > 100) {this.s = 100;}
			if (this.v > 100) {this.v = 100;}
		}		
	},
		
		// Create a RGB objec
		RGBobject : function (red, green, blue) {
		// Object definition.
		this.r = red; this.g = green; this.b = blue;
		this.validate = function () {
			if (this.r <= 0) {this.r = 0;}
			if (this.g <= 0) {this.g = 0;}
			if (this.b <= 0) {this.b = 0;}
			if (this.r > 255) {this.r = 255;}
			if (this.g > 255) {this.g = 255;}
			if (this.b > 255) {this.b = 255;}
		}	
	},
		
		
		// CONVERTERS
		// CONVERTERS	
		
		convert : {
			
			// Decimals to hex (only 3 digits)
			hexify : function (number) {
			var digits = '0123456789ABCDEF';
			var lsd = number % 16;
			var msd = (number - lsd) / 16;
			var hexified = digits.charAt(msd) + digits.charAt(lsd);
			return hexified;		
		},
			
			// Hex to decimals (only 2 digits)
			decimalize : function (hexNumber) {
			var digits = '0123456789ABCDEF';
			return ((digits.indexOf(hexNumber.charAt(0).toUpperCase()) * 16) + digits.indexOf(hexNumber.charAt(1).toUpperCase()));		
		},
			
			// HEX to RGB
			HEX2RGB : function (colorString, RGB) {
			
			RGB.r = this.decimalize(colorString.substring(1,3));
			RGB.g = this.decimalize(colorString.substring(3,5));
			RGB.b = this.decimalize(colorString.substring(5,7));		
		},
			
			// RGB to HEX
			RGB2HEX : function (RGB) {
			return "#" + this.hexify(RGB.r) + this.hexify(RGB.g) + this.hexify(RGB.b);		
		},
			
			// RGB to HSV
			RGB2HSV : function (RGB, HSV) {
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
		},
			
			// HSV to RGB
			HSV2RGB : function (HSV, RGB) {
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
		},
			
			// HSV to HEX
			HSV2HEX : function (_hval, _sval, _vval) {
			var RGB = new eCol.RGBobject();
			var HSV = new eCol.HSVobject(_hval, _sval, _vval);	
			HSV.validate();
			this.HSV2RGB (HSV, RGB);
			var _nHEX = this.RGB2HEX(RGB);
			return(_nHEX);				
		}
			
		},
	
	
		// UPDATERS
		// UPDATERS
		
		update : {
	
			// Creates a string from the CSS array	
			CSSstring : function () {
				
				// Turn CSS into string
				cssstring = '';
				for (var i = 0; i < colorTheme.css.length; i++) {			
					if ( colorTheme.css[i].value ) {			
						cssstring += colorTheme.css[i].classes.join() + ' { ' + colorTheme.css[i].pre + ': ' + colorTheme.css[i].value + ' !important } ';
					}
				}					

				// Make a saved CSS object
				savedCSS = JSON.stringify(colorTheme);

				// save to project
				if (Wu.app._activeProject) Wu.app._activeProject.saveColorTheme();	// (k)
			
			},
			
			// Creates 4 Colmplimetary colors in cArray[0] - cArray[4]
			makeComplimentary : function (_hex) {
			
			// Updating the color swatches that contains the BASE color
			eVars._yourswatch.style.backgroundColor = _hex;
			var colorString = _hex;
			
			// Create RGB and HSV values from HEX
			var RGB = new eCol.RGBobject(0,0,0);
			var HSV = new eCol.HSVobject(0,0,0);
			eCol.convert.HEX2RGB(colorString, RGB);
			eCol.convert.RGB2HSV (RGB, HSV);
			
			// Update sliders
			eCol.sliders.updateAllSliders(RGB, HSV);
				
			// Update the BASE COLOR in cArray	
			complimentaryColor[0] = [];		
			complimentaryColor[0][0] = {};
			complimentaryColor[0][0].HEX = _hex;		
			complimentaryColor[0][0].RGB = { r: RGB.r, g: RGB.g, b: RGB.b };
			complimentaryColor[0][0].HSV = { 'h': HSV.h, 's': HSV.s, 'v': HSV.v };


			// MAKE COMPLIMENTARY COLORS
			
			// Hue position
			var hpos = 360-complimentaryColor[0][0].HSV.h;
			// Go down cArray[0] - cArray[4] and make COMPLIMENTARY colors from the original value			
			for ( var i=0; i<4;i++ ) {
					
				var hstep = complimentaryColor[0][0].HSV.h + (90*i);
					
				if ( hstep > 360 ) {
					hstep = hstep - 360;
				}
				
				hstep = Math.floor(hstep);		
		
				HSV.h = hstep;
				HSV.s = complimentaryColor[0][0].HSV.s;
				HSV.v = complimentaryColor[0][0].HSV.v;
			
				// Declare the Array that contains all the colors
				complimentaryColor[i] = [];
				complimentaryColor[i][0] = {};
								
				eCol.convert.HSV2RGB(HSV, RGB);
				var nhex = eCol.convert.RGB2HEX(RGB);
				
				complimentaryColor[i][0].HEX = nhex;
				complimentaryColor[i][0].RGB = {'r':RGB.r, 'g':RGB.g, 'b':RGB.b};
				complimentaryColor[i][0].HSV = {'h':HSV.h, 's':HSV.s, 'v':HSV.v};
				
	
				
				// Make lighter color versions
				this.colorGrade(complimentaryColor, i, HSV);
			}
			
		},
			
			// Create 5 Matching colors
			matchColors : function() {
		
			// Set back RGB and HSV to BASE color value
			RGB = complimentaryColor[0][0].RGB;
			HSV = complimentaryColor[0][0].HSV;			
		
			// Finds matching colors, and puts them in matchBlend[1] - matchBlend[5]
			// ... and updates the matching color swatches
			eCol.cMatch.domatch(HSV);

			
			// Update the MATCHING colors in cArray
			// Not sure if this is so smart... perhaps it would be better to keep the arrays separated
			
			// Match Color 1 GRADER
			this.colorGrade(matchingColor, 0, matchingColor[0][0].HSV);
					
			// Match Color 2 GRADER
			this.colorGrade(matchingColor, 1, matchingColor[1][0].HSV);
		
			// Match Color 3 GRADER
			this.colorGrade(matchingColor, 2, matchingColor[2][0].HSV);
			
			// Match Color 4 GRADER
			this.colorGrade(matchingColor, 3, matchingColor[3][0].HSV);
		
			// Match Color 5 GRADER
			this.colorGrade(matchingColor, 4, matchingColor[4][0].HSV);

		},
			
			// Creates 6 lighter colors from original HSV
			colorGrade : function (thisArray, arrayNumber, HSV) {										
 			
			// Go down the swatches
			for ( var a=0; a<6;a++) {			
			
				var RGB = new eCol.RGBobject(0,0,0);
		
				// Value
				var vval = HSV.v;
				var valdiff = 100-vval;	
				var valstep = valdiff/6;	
				HSV.v = Math.floor(vval + (valstep*a));
				
				// Lightness
				var sval = HSV.s;
				var svalstep = sval/6;
				HSV.s = Math.floor(sval - (svalstep*a));
				
				// Set RGB
				eCol.convert.HSV2RGB(HSV, RGB);
				
				// Set HEX
				var nhex = eCol.convert.RGB2HEX(RGB);
				

				// Update the array with all the colors
				thisArray[arrayNumber][a] = {};
				
				thisArray[arrayNumber][a].HEX = nhex;
				thisArray[arrayNumber][a].RGB = {'r': RGB.r, 'g': RGB.g, 'b': RGB.b };
				thisArray[arrayNumber][a].HSV = {'h': HSV.h, 's': HSV.s, 'v': HSV.v };			
			}				
		},
			
			// When there is a change in RGB (gets used by slider only)
			RGB : function(RGB) {
			
			var HSV = new eCol.HSVobject(0,0,0);
			
			eCol.convert.RGB2HSV(RGB, HSV);
			
			eVars._hexColor.value = eCol.convert.RGB2HEX(RGB);
			eVars._rChannel.value = Math.round(RGB.r);
			eVars._gChannel.value = Math.round(RGB.g);
			eVars._bChannel.value = Math.round(RGB.b);
			eVars._hChannel.value = Math.round(HSV.h);
			eVars._sChannel.value = Math.round(HSV.s);
			eVars._vChannel.value = Math.round(HSV.v);
									
		},
	
			// When there is a change in HSV (gets used by slider only)
			HSV : function(HSV) {
				
			var RGB = new eCol.RGBobject(0,0,0);
			eCol.convert.HSV2RGB(HSV, RGB);
			
			eVars._hexColor.value = eCol.convert.RGB2HEX(RGB);
			eVars._rChannel.value = Math.round(RGB.r);
			eVars._gChannel.value = Math.round(RGB.g);
			eVars._bChannel.value = Math.round(RGB.b);
			eVars._hChannel.value = Math.round(HSV.h);
			eVars._sChannel.value = Math.round(HSV.s);
			eVars._vChannel.value = Math.round(HSV.v);
					
		},
	
			// When there is a change in HEX (clicking new colors)
			HEX : function (colorString) {
				
			var RGB = new eCol.RGBobject(0,0,0);
			var HSV = new eCol.HSVobject(0,0,0);
			eCol.convert.HEX2RGB(colorString, RGB);
			eCol.convert.RGB2HSV (RGB, HSV);
			
			eVars._rChannel.value = Math.round(RGB.r);
			eVars._gChannel.value = Math.round(RGB.g);
			eVars._bChannel.value = Math.round(RGB.b);
			eVars._hChannel.value = Math.round(HSV.h);
			eVars._sChannel.value = Math.round(HSV.s);
			eVars._vChannel.value = Math.round(HSV.v);
			
		},
			
			inputFields : function (fromWhat) {
			
			var RGB = new Object();
			var HSV = new Object();
			
			if ( fromWhat == 'HEX' ) {
												
				var tHEX = eVars._hexColor.value;
				
				eCol.convert.HEX2RGB(tHEX, RGB);
				eCol.convert.RGB2HSV(RGB, HSV);
				
				eVars._rChannel.value = Math.floor(RGB.r);
				eVars._gChannel.value = Math.floor(RGB.g);
				eVars._bChannel.value = Math.floor(RGB.b);

				eVars._hChannel.value = Math.floor(HSV.h);
				eVars._sChannel.value = Math.floor(HSV.s);
				eVars._vChannel.value = Math.floor(HSV.v);
				
				
			}

			if ( fromWhat == 'RGB' ) {
				
				RGB.r = eVars._rChannel.value;
				RGB.g = eVars._gChannel.value;
				RGB.b = eVars._bChannel.value;

				eCol.convert.RGB2HSV(RGB, HSV);				
				var tHEX = eCol.convert.RGB2HEX(RGB);								
												
				eVars._hexColor.value = tHEX;

				eVars._hChannel.value = Math.floor(HSV.h);
				eVars._sChannel.value = Math.floor(HSV.s);
				eVars._vChannel.value = Math.floor(HSV.v);
			}
			
			if ( fromWhat == 'HSV' ) {
				
				HSV.r = eVars._hChannel.value;
				HSV.g = eVars._sChannel.value;
				HSV.b = eVars._vChannel.value;

				eCol.convert.HSV2RGB(HSV, RGB);				
				var tHEX = eCol.convert.RGB2HEX(RGB);								
												
				eVars._hexColor.value = tHEX;

				eVars._rChannel.value = Math.floor(RGB.r);
				eVars._gChannel.value = Math.floor(RGB.g);
				eVars._bChannel.value = Math.floor(RGB.b);
				
			}
			
			eCol.sliders.updateAllSliders(RGB,HSV);
									
		},
			
			// Updates the Swatch we've selected from NEW color!
			customColors : function() {
		
		
			if ( changingColors == 'all' ) {

				var newHEX = eVars._hexColor.value;

				this.makeComplimentary(newHEX);
				this.matchColors();
				
				updateTempSwatches();


				if ( colorTheme.cThemeDarkMenu ) {
					darkMenu(newHEX);					
				} else {
					lightMenu(newHEX);
				}


				// Link Color
				colorTheme.css[4].value = matchingColor[2][0].HEX;				
				
				// Inactive Layers
				colorTheme.css[5].value = complimentaryColor[0][0].HEX;
				colorTheme.css[6].value = complimentaryColor[0][3].HEX;	
				colorTheme.css[7].value = complimentaryColor[0][4].HEX;

				// Active Layers
				colorTheme.css[8].value = complimentaryColor[2][0].HEX;
				colorTheme.css[9].value = complimentaryColor[2][4].HEX;
	
				
				

			}
			
			// Menu color
			if ( changingColors == 1 ) {
				
				var HSV = { 'h': parseInt(eVars._hChannel.value), 's': parseInt(eVars._sChannel.value), 'v': parseInt(eVars._vChannel.value)  }

				customColor[1] = [];
				this.colorGrade(customColor, 1, HSV);


				if ( colorTheme.cThemeDarkMenu ) {
					darkMenu(customColor[1][0].HEX);					
				} else {
					lightMenu(customColor[1][0].HEX);
				}

				// cxxxx

				
			}
		
			// Inactive Layers
			if ( changingColors == 2 ) {
			
				var HSV = { 'h': parseInt(eVars._hChannel.value), 's': parseInt(eVars._sChannel.value), 'v': parseInt(eVars._vChannel.value)  }

				customColor[2] = [];
				this.colorGrade(customColor, 2, HSV);
											
				colorTheme.css[5].value = customColor[2][0].HEX;
				colorTheme.css[6].value = customColor[2][3].HEX;	
				colorTheme.css[7].value = customColor[2][4].HEX;
				
			}

			// Active Layers
			if ( changingColors == 3 ) {

				var HSV = { 'h': parseInt(eVars._hChannel.value), 's': parseInt(eVars._sChannel.value), 'v': parseInt(eVars._vChannel.value)  }

				customColor[3] = [];
				this.colorGrade(customColor, 3, HSV);
				
				colorTheme.css[8].value = customColor[3][0].HEX;
				colorTheme.css[9].value = customColor[3][4].HEX;

			}

			// Link Color
			if ( changingColors == 4 ) {
			
				var HSV = { 'h': parseInt(eVars._hChannel.value), 's': parseInt(eVars._sChannel.value), 'v': parseInt(eVars._vChannel.value)  }

				customColor[4] = [];
				this.colorGrade(customColor, 4, HSV);
				
				colorTheme.css[4].value = customColor[4][0].HEX;
				
			}

			// Update the color in the CSS
			eCol.update.CSSstring();
			jcss.innerHTML = cssstring;


		}
					
		},
		
			
		
		// SLIDERS
		// SLIDERS	
		
		sliders : {
			
			updateAllSliders : function (RGB, HSV) {
	
			
			// HSV
			if ( draggingSlider != 'range-slider-1' ) {
				this.slideupdater('range-slider-1', 'hChannel', 360, HSV, RGB);
			}
		
			if ( draggingSlider != 'range-slider-2' ) {
				this.slideupdater('range-slider-2', 'sChannel', 100, HSV, RGB);	
			}
		
			if ( draggingSlider != 'range-slider-3' ) {
				this.slideupdater('range-slider-3', 'vChannel', 100, HSV, RGB);	
			}
		
		
			// RGB
			if ( draggingSlider != 'range-slider-r' ) {
				this.slideupdater('range-slider-r', 'rChannel', 255, HSV, RGB);		
			}
		
			if ( draggingSlider != 'range-slider-g' ) {
				this.slideupdater('range-slider-g', 'gChannel', 255, HSV, RGB);
			}
		
			if ( draggingSlider != 'range-slider-b' ) {
				this.slideupdater('range-slider-b', 'bChannel', 255, HSV, RGB);
			}				
			
		},
					
			rangeSlider : function (id, rrange, onDrag) {

		    var range = Wu.DomUtil.get(id),
		        dragger = range.children[0],
		        draggerWidth = 10, // width of your dragger
		        rangeWidth, rangeLeft,
		        down = false;
		
		    dragger.style.width = draggerWidth + 'px';
		    dragger.style.left = -draggerWidth + 'px';
		    dragger.style.marginLeft = (draggerWidth / 2) + 'px';
		
		    var thus = this;
		
		    range.addEventListener("mousedown", function(e) {
		
				rangeWidth = 215;
		        rangeLeft = 150;
		        
		        draggingSlider = id;        
		        
		        down = true;
		        thus.updateDragger(e, dragger, rrange, down, rangeLeft, rangeWidth, draggerWidth, onDrag, thus);
		        return false;
		    });
		
		    document.addEventListener("mousemove", function(e) {
		   
		        thus.updateDragger(e, dragger, rrange, down, rangeLeft, rangeWidth, draggerWidth, onDrag, thus);
		    });
		
		    document.addEventListener("mouseup", function() {
		        down = false;
				draggingSlider = false;                
		    });
					
		},
			
			updateDragger : function (e, dragger, rrange, down, rangeLeft, rangeWidth, draggerWidth, onDrag, thus) {				   
				           

				           
		        if (down && e.pageX >= rangeLeft && e.pageX <= (rangeLeft + rangeWidth)) {
		        		   
		            dragger.style.left = e.pageX - rangeLeft - draggerWidth + 'px';

		            if ( typeof onDrag == "function" ) {
		            	 
		            	var dragVal = Math.round(((e.pageX - rangeLeft) / rangeWidth) * rrange);
  	
		            	onDrag(dragVal);
		            	
		            	}
		        }
			
		},
			
			slideupdater : function (id, updater, nrng, HSV, RGB) {
		
			// Updating one of the HSV sliders: update all the RGB sliders
			if ( draggingSlider == 'range-slider-1' || draggingSlider == 'range-slider-2' || draggingSlider == 'range-slider-3' ) {
		
				var rr = Wu.DomUtil.get('range-slider-r').children[0];
				var rrrange = Math.floor(RGB.r*(205/255));
					rr.style.left = rrrange + 'px';
				
				var gg = Wu.DomUtil.get('range-slider-g').children[0];
				var ggrange = Math.floor(RGB.g*(205/255));
					gg.style.left =ggrange + 'px';
					
				var bb = Wu.DomUtil.get('range-slider-b').children[0];
				var bbrange = Math.floor(RGB.b*(205/255));
					bb.style.left = bbrange + 'px';		
			}
			
			
			// Updating one of the RGB sliders: update all the HSV sliders	
			if ( draggingSlider == 'range-slider-r' || draggingSlider == 'range-slider-g' || draggingSlider == 'range-slider-b' ) {
							
				var hh = Wu.DomUtil.get('range-slider-1').children[0];
				var hhrange = Math.floor(HSV.h*(205/360));
					hh.style.left = hhrange + 'px';
				
				var ss = Wu.DomUtil.get('range-slider-2').children[0];
				var ssrange = Math.floor(HSV.s*(205/100));
					ss.style.left = ssrange + 'px';
					
				var vv = Wu.DomUtil.get('range-slider-3').children[0];
				var vvrange = Math.floor(HSV.v*(205/100));
					vv.style.left = vvrange + 'px';	
			
			}
		
		
		
			if ( !draggingSlider ) {
			
			    var range = Wu.DomUtil.get(id),
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
			
		},
		
	
		// COLOR MATCHER 
		// COLOR MATCHER
		
		
		cMatch : {
			
			domatch : function (HSV) {
		
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
			eCol.convert.HSV2RGB(y, RGB);
			z = RGB;
			
			this.outp("0",z);
			if((hs.h>=0)&&(hs.h<30)){
				yx.h=y.h=hs.h+30;yx.s=y.s=hs.s;y.v=hs.v;
				if(hs.v>70){yx.v=hs.v-30}else{yx.v=hs.v+30}
			}
			if((hs.h>=30)&&(hs.h<60)){yx.h=y.h=hs.h+150;
				y.s=this.rc(hs.s-30,100);
				y.v=this.rc(hs.v-20,100);
				yx.s=this.rc(hs.s-50,100);
				yx.v=this.rc(hs.v+20,100);
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
				yx.s=y.s=this.rc(hs.s-40,100);
				y.v=hs.v;
				if(hs.v>70){yx.v=hs.v-30}else{yx.v=hs.v+30}
			}
			if(hs.h>=300){
				if(hs.s>50){y.s=yx.s=hs.s-40}else{y.s=yx.s=hs.s+40}yx.h=y.h=(hs.h+20)%360;
				y.v=hs.v;
				if(hs.v>70){yx.v=hs.v-30}else{yx.v=hs.v+30}
			}
		
		
			var RGB=new Object();
			eCol.convert.HSV2RGB(y, RGB);
			z = RGB;	
			this.outp("1",z);
			
			var RGB=new Object();
			eCol.convert.HSV2RGB(yx, RGB);
			z = RGB;	
			this.outp("2",z);
		
			y.h=0;
			y.s=0;
			y.v=100-hs.v;
			var RGB=new Object();
			eCol.convert.HSV2RGB(y, RGB);
			z = RGB;
			this.outp("3",z);
		
			y.h=0;
			y.s=0;
			y.v=hs.v;
			var RGB=new Object();
			eCol.convert.HSV2RGB(y, RGB);
			z = RGB;
			this.outp("4",z);		
			
		},
			
			outp: function (x, RGB) {
		
			matchingColor[x] = [];
			matchingColor[x][0] = {};
			matchingColor[x][0].HEX="#"+eCol.convert.hexify(RGB.r)+eCol.convert.hexify(RGB.g)+eCol.convert.hexify(RGB.b);
			
			var RGB=new Object();			
			var HSV=new Object();			
			
			eCol.convert.HEX2RGB(matchingColor[x][0].HEX, RGB);
			eCol.convert.RGB2HSV(RGB, HSV);
			
			matchingColor[x][0].RGB = {'r': RGB.r, 'g': RGB.g, 'b': RGB.b };
			matchingColor[x][0].HSV = {'h': HSV.h, 's': HSV.s, 'v': HSV.v };			
				
			
		},
			
			rc : function (x,m) {
		
			if(x>m){return m}
			if(x<0){return 0}else{return x}			
		
		}
			
		},
	
		
		// COLOR PICKER
		// COLOR PICKER ~ TODO: Kill off the micro image
	
		cPicker : {
	
			img2canvas : function () {

			istat=true;
			cnvWidth=120;
			cnvHeight=70;
			
			c = eVars._myCanvas;
			ctx=c.getContext("2d");
		
			cPix = eVars._pixCanvas;
			ctxPix=cPix.getContext("2d");
		
			ctxPix.mozImageSmoothingEnabled = false;
			ctxPix.webkitImageSmoothingEnabled = false;
		
			img = eVars._canvimg;
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
			
			var thus = this;			
			var onclickListener = function (evt) {
	
				if ( haschanged ) {
					if ( changingColors == 'all' ) {
					    if (confirm("This action will regenerate a color palette for you. By proceding all your changes will be lost!") == true) {
						   haschanged = false;

						   eCol.update.HEX(eVars._hexColor.value);
						   eCol.update.inputFields('HEX');
					    }
					} else {
			
						imageData = ctxPix.getImageData(0,0,150,150);
						var barva='#'+thus.d2h(imageData.data[45300+0])+thus.d2h(imageData.data[45300+1])+thus.d2h(imageData.data[45300+2]);

						eVars._hexColor.value=barva;
						eCol.update.HEX(eVars._hexColor.value);
											
						// Update Colors						
					    eCol.update.customColors();

					}
				} else {
					
					imageData = ctxPix.getImageData(0,0,150,150);
					var barva='#'+thus.d2h(imageData.data[45300+0])+thus.d2h(imageData.data[45300+1])+thus.d2h(imageData.data[45300+2]);
					eVars._hexColor.value=barva;


					eCol.update.HEX(eVars._hexColor.value);

					// Update Colors
				    eCol.update.customColors();					
				} 			
			};
			var onmoveListener = function(evt) {
			
				ev=1;
				if (istat){
					mousePos = thus.getMousePos(c, evt);
					thus.drawPix(cPix, ctxPix, img, Math.round(mousePos.x*(imgWidth/cnvWidth)), Math.round(mousePos.y*(imgHeight/cnvHeight)));
				}
			};
			
			c.addEventListener('mousemove', onmoveListener, false);
			c.addEventListener('mousedown', onclickListener, false);
				  
			
		},
	
			drawPix : function (cPix, ctxPix, img, x, y) {

			ctxPix.clearRect(0, 0, cPix.width, cPix.height);
			if (x<5) x=5;
			if (y<5) y=5;
			if (x>imgWidth-4) x=imgWidth-4;
			if (y>imgHeight-4) y=imgHeight-4;
			ctxPix.drawImage(img,x-5,y-5,9,9,0,0,cPix.width,cPix.height);
			
		},
	
			getMousePos : function (canvas, evt) {
		
			var rect = canvas.getBoundingClientRect();
			return { x: evt.clientX - rect.left, y: evt.clientY - rect.top	};			
		
		},
	
			d2h : function (d) {
		
			return ("0"+d.toString(16)).slice(-2).toUpperCase();
		
		}
			
		},
		
	
		// FINDS THE MOST DOMINANT COLOR IN THE PICTURE ~ TODO: Disable white and black as dominant colors	
		cFind : function (colorFactorCallback) {
			
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
			
			
		}, // OBS
		
		// Makes light base colors (dark theme) ~ STATIC COLORS
		makeLightColors : function (arrno,h) {

		lightColor[arrno] = [];
		lightColor[arrno][0] = {};
		lightColor[arrno][0].HSV = {};
		lightColor[arrno][0].HSV.h = h; 
		lightColor[arrno][0].HSV.s = 15; 
		lightColor[arrno][0].HSV.v = 80;
		lightColor[arrno][0].HEX = this.convert.HSV2HEX(h, 15, 80);	 
		lightColor[arrno][0].RGB = {};
		this.convert.HSV2RGB(lightColor[arrno][0].HSV, lightColor[arrno][0].RGB);
	
		lightColor[arrno][1] = {};	
		lightColor[arrno][1].HSV = {};
		lightColor[arrno][1].HSV.h = h; 
		lightColor[arrno][1].HSV.s = 1; 
		lightColor[arrno][1].HSV.v = 99;
		lightColor[arrno][1].HEX = this.convert.HSV2HEX(h, 1, 99);	 
		lightColor[arrno][1].RGB = {};
		this.convert.HSV2RGB(lightColor[arrno][1].HSV, lightColor[arrno][1].RGB);
	
		lightColor[arrno][2] = {};	
		lightColor[arrno][2].HSV = {};
		lightColor[arrno][2].HSV.h = h; 
		lightColor[arrno][2].HSV.s = 30; 
		lightColor[arrno][2].HSV.v = 25;
		lightColor[arrno][2].HEX = this.convert.HSV2HEX(h, 30, 25);	 
		lightColor[arrno][2].RGB = {};
		this.convert.HSV2RGB(lightColor[arrno][2].HSV, lightColor[arrno][2].RGB);
		
	},
		
		// Makes dark base colors (light theme) ~ STATIC COLORS
		makeDarkColors : function (arrno,h) {
		
		darkColor[arrno] = [];
		darkColor[arrno][0] = {};
		darkColor[arrno][0].HSV = {};
		darkColor[arrno][0].HSV.h = h; 
		darkColor[arrno][0].HSV.s = 50; 
		darkColor[arrno][0].HSV.v = 12;
		darkColor[arrno][0].HEX = this.convert.HSV2HEX(h, 50, 12);	 
		darkColor[arrno][0].RGB = {};
		this.convert.HSV2RGB(darkColor[arrno][0].HSV, darkColor[arrno][0].RGB);
	
		darkColor[arrno][1] = {};	
		darkColor[arrno][1].HSV = {};
		darkColor[arrno][1].HSV.h = h; 
		darkColor[arrno][1].HSV.s = 30; 
		darkColor[arrno][1].HSV.v = 25;
		darkColor[arrno][1].HEX = this.convert.HSV2HEX(h, 30, 25);	 
		darkColor[arrno][1].RGB = {};
		this.convert.HSV2RGB(darkColor[arrno][1].HSV, darkColor[arrno][1].RGB);
	
		darkColor[arrno][2] = {};	
		darkColor[arrno][2].HSV = {};
		darkColor[arrno][2].HSV.h = h; 
		darkColor[arrno][2].HSV.s = 15; 
		darkColor[arrno][2].HSV.v = 70;
		darkColor[arrno][2].HEX = this.convert.HSV2HEX(h, 15, 70);	 
		darkColor[arrno][2].RGB = {};
		this.convert.HSV2RGB(darkColor[arrno][2].HSV, darkColor[arrno][2].RGB);
				
	},
		
	}	
	
	// *****************************************
	
	
	
	
	
	// *****************************************
		
	// START COLOR THEME
	// START COLOR THEME
	// START COLOR THEME

	// *****************************************

	initBegin();	
	function initBegin() {
	
		initInputFields();
	
		// BASIC
		// Chose between preset color themes
		
		// Get some triggers
		eVars._dark1 = Wu.DomUtil.get('colortheme-dark1');
		eVars._dark2 = Wu.DomUtil.get('colortheme-dark2');
		eVars._dark3 = Wu.DomUtil.get('colortheme-dark3');
		eVars._light1 = Wu.DomUtil.get('colortheme-light1');		
		
		
		eVars._darktheme = Wu.DomUtil.get('darktheme')
		eVars._lighttheme = Wu.DomUtil.get('lighttheme')
	
		// Get the wrappers
		eVars._color_Inner_wrapper = Wu.DomUtil.get('project-color-theme').parentNode;
		eVars._color_Outer_wrapper = Wu.DomUtil.get('project-color-theme').parentNode.parentNode;
		
		// Get the ADVANCED color theme button
		eVars._advanced = Wu.DomUtil.get('advanced-theme-selector');	
	
	
		// Set wrapper size...
	
		// Bring in the BASIC color theme part
		eVars._color_Inner_wrapper.style.left = '-310px';
		
		// Set the height of the outer wrapper
		eVars._color_Outer_wrapper.style.height = '182px';		
	
	
		// Clickers
	
		// DARK COLOR THEMES
		eVars._dark1.onclick = function() { 
		
			Wu.DomUtil.addClass(eVars._light1, 'colortheme-light1-on')
			prethemes('one'); 
			
		}

		eVars._dark2.onclick = function() {
		
			Wu.DomUtil.addClass(eVars._light1, 'colortheme-light1-on')		
			prethemes('two');
			
			}
			
		eVars._dark3.onclick = function() {
		
			Wu.DomUtil.addClass(eVars._light1, 'colortheme-light1-on')
			prethemes('three');
			
			}
		
		
		
		
		// Dark / light color theme togglers
		eVars._darktheme.onclick = function() {
			Wu.DomUtil.addClass(this, 'selected');
			Wu.DomUtil.removeClass(eVars._lighttheme, 'selected');
			colorTheme.darktheme = true;	
			prethemes(colorTheme.cTheme);
		}
	
		eVars._lighttheme.onclick = function() {
			Wu.DomUtil.addClass(this, 'selected');
			Wu.DomUtil.removeClass(eVars._darktheme, 'selected');
			colorTheme.darktheme = false;
			prethemes(colorTheme.cTheme);
		}	
		
		
		// Go to Advanced
		eVars._advanced.onclick = function() {
			advancedColorThemes.init();
			Wu.DomUtil.removeClass(eVars._light1, 'colortheme-light1-on')			
		}
	

	
	}

	// *****************************************




		
	// *****************************************
		
	// Set up the Array of the css[] Classes 
	// Set up the Array of the css[] Classes 
	// Set up the Array of the css[] Classes 

	// *****************************************
	
	var	initClassArray = {
		
			// Start it all, yo
			go : function () {

			// If there is no Color Theme, make a blank one

				if ( !colorTheme.css || rezet ) {
					this.stackClasses(theClassArray);
					this.makeCSSelements(theClassArray);
					this.makeCSSel();
				}
			
			
		},
				
			// These are the CSS classes that will get affected
			stackClasses : function (theClassArray) {
										
										
				// MENU BACKGROUND COLORS
				// MENU BACKGROUND COLORS
							
				theClassArray[0] = ['.ct0', 									
						'#content',
						'.item-list.controls-item',
						'.item-list.layer-item',
						'.item-list.layers-mapbox-item'
						];

				theClassArray[1] = ['.ct1',
						'#selectedTab span',
						'#editorPanel > .content',
						'#editor',
						'#datalibrary-download-dialogue:after',
						'.fullpage-users'
						];
									
				theClassArray[2] = ['.ct2'];



				// I DON'T KNOW...
				// I DON'T KNOW...

				theClassArray[3] = ['.ct3'];
									

				// LINK COLOR
				// LINK COLOR
								
				// OK
				theClassArray[4] = ['.ct4','.active a','.editor-wrapper a'];
									
									

				// INACTIVE LAYERS
				// INACTIVE LAYERS

				// OK
				theClassArray[5] = ['.ct5', '.level-0'];
					
				// OK				
				theClassArray[6] = ['.ct6', '.level-1'];

				// OK
				theClassArray[7] = ['.ct7', '.level-2'];



				// ACTIVE LAYERS
				// ACTIVE LAYERS

				// OK -
				theClassArray[8] = [ '.ct8', 'layer-active'];
				
				// OK
				theClassArray[9] = ['.ct9'];



				// OTHER COLORS
				// OTHER COLORS



				theClassArray[10] = ['.ct10'];			
				
				// color
				theClassArray[11] = ['.ct11',
						 '.editor-projects-item:hover', 
						 '.smap-button-gray', 
						 '.smap-button-white',
						 '.item-list.controls-item.active',
						 '.item-list.layer-item.active',
						 '.active .layers-mapbox-item',
						 '.item-list.active', 
						 '.layer-item.active'
						 ];
				
				theClassArray[12] = ['.ct12'];
									 
				theClassArray[13] = ['.ct13',
						 '.editor-wrapper h3',
						 '.editor-wrapper h4',
						 '.editor-inner-wrapper h5'];									

				theClassArray[14] = ['.ct14'];
				
				theClassArray[15] = ['.ct15',
						 '#header'];
				
				theClassArray[16] = ['.ct16',
						 '#header',
						 '#header input'
						 ];
				
				theClassArray[17] = ['.ct17',
						 '.editor-project-edit-super-wrap'									 
						 ];
	
				// BG
				theClassArray[18] = ['.ct18', 
						 '.smap-button-gray', 
						 '.smap-button-white', 
						 ];
									 
									
				// BG
				theClassArray[19] = ['.ct19',
						 'tr:nth-child(odd)',
						 ];
						 

				theClassArray[20] = ['.ct20',
						 'tr:nth-child(even)',
						 '.ccontainer'];

				theClassArray[21] = ['.ct21'];
									  
				theClassArray[22] = ['.ct22', '.mat_swatches', '#darness-selector'];
				
				// GRAY TEXT
				theClassArray[23] = [ '.ct23',
						  '.editor-wrapper h3', 
						  '.editor-wrapper h4', 
						  '.documents-folder-item:hover', 
						  '.editor-map-item-wrap input', 
						  '.form-control input', 
						  'th',
						  '.datalibrary-controls',
						  '.input-box', '.search'
						  ];

			
				// WHITE BG
				theClassArray[24] = ['.ct24', 
						  '.editor-map-item-wrap input', 
						  '.form-control input'
						  ];
			
			

				theClassArray[25] = ['.ct25'];
				theClassArray[26] = ['.ct26'];
				theClassArray[27] = ['.ct27'];
			
				// Font weight
				theClassArray[28] = ['.ct28', 
						 'th', 
						 '#select-basic-themes',
						 '#advanced-color-header',
						 '.editor-inner-wrapper h5',
						 '.editor-map-item-wrap h4',
						 '.client-project-title-wrapper h4',
						 '.editor-projects-item h5',
						 '.editor-client-title h5',
						 '#userlist h4',
						 ];
						  
				theClassArray[29] = ['hr'];
			
				theClassArray[30] = ['blockquote'];
			
				theClassArray[31] = ['.ct31'];
				
				// Active List items BG
				theClassArray[32] = [
						 '.item-list.controls-item.active',
						 '.item-list.layer-item.actve',
						 '.active .layers-mapbox-item',									 
						 '.item-list.active', 
						 '.layer-item.active'];	

				// Active List items color
				theClassArray[33] = [
						 '.item-list.controls-item.active',
						 '.item-list.layer-item.active',
						 '.active .layers-mapbox-item',									 
						 '.item-list.active', 
						 '.layer-item.active',									 
	
						];
				
				theClassArray[34] = ['.search'];
 
									 
			},						
						
			makeCSSelements : function (theClassArray) {
			 

				// Base Colors			
				this.makeCSSel(0, 'background-color', '');
				this.makeCSSel(1, 'background-color', '');
				this.makeCSSel(2, 'background-color', '');	
			 
				// I DON'T KNOW...	 
				this.makeCSSel(3, 'color', '');
		
				// Link Color
				this.makeCSSel(4, 'color', '');
					 
				// Inactive Layers			 
				this.makeCSSel(5, 'background-color', '');	
				this.makeCSSel(6, 'background-color', '');	
				this.makeCSSel(7, 'background-color', '');	
		
				// Active Layers
				this.makeCSSel(8, 'background-color', '');	
				this.makeCSSel(9, 'background-color', '');	
		
				// Other Colors
				this.makeCSSel(10, 'color', '');
				this.makeCSSel(11, 'color', 'white');
				this.makeCSSel(12, 'color', 'black');
				this.makeCSSel(13, 'color', 'white');
				this.makeCSSel(14, 'background-color', '');
				this.makeCSSel(15, 'background-color', '');
				this.makeCSSel(16, 'color', '');
				this.makeCSSel(17, 'background-color', '');
				this.makeCSSel(18, 'background-color', '');
		
		
				 // EXTRA CLASSES FOR TOGGELIG BETWEEN LIGHT AND DARK THEMES!!!		
				this.makeCSSel(19, 'background-color', '');
				this.makeCSSel(20, 'background-color', '');
				this.makeCSSel(21, 'border-bottom', '' );
				this.makeCSSel(22, 'background-color', '' );
				this.makeCSSel(23, 'color', '' );
				this.makeCSSel(24, 'background-color', '' );
				this.makeCSSel(25, 'color', '' );
				this.makeCSSel(26, 'background', '' );
				this.makeCSSel(27, 'font-weight', '' );
				this.makeCSSel(28, 'font-weight', '' );
				this.makeCSSel(29, 'border-top', '' );
				this.makeCSSel(30, 'border-left', '' );
				this.makeCSSel(31, 'background-position', '' );

				this.makeCSSel(32, 'background-color', '' );
				this.makeCSSel(33, 'color', '' );				

				this.makeCSSel(34, 'background-color', '' );				
		
		
		
			}, 
	
			// Sets up the CSS elements in the Array			
			makeCSSel : function (va, pre, val) {
				colorTheme.css[va] = {};
				colorTheme.css[va].classes = theClassArray[va];
				colorTheme.css[va].pre = pre;
				colorTheme.css[va].value = val;					
			}
		}		
		
	initClassArray.go();
	
	// *****************************************
	
	

	

	// *****************************************
	
	// LOAD THE PREDEFINED COLOR THEMES (BASIC)
	// LOAD THE PREDEFINED COLOR THEMES (BASIC)
	// LOAD THE PREDEFINED COLOR THEMES (BASIC)
	
	// *****************************************
	
	function prethemes(theme) {
	
		if ( theme == 'one' ) {
		colorTheme.cTheme = 'one';
		if ( colorTheme.darktheme ) {
		
			// Base Colors			
			preval_0 = '#0F1A1E';
			preval_1 = '#3F4652';
			preval_2 = '#97ABB2';
			
			preval_3 = '#424242';
	
			// Link Color
			preval_4 = 'cyan';
						
			// Inactive Layers
			preval_5 = '#63A3A0';
			preval_6 = '#CCE2E1';
			preval_7 = '#EDF4F4';
	
			// Active Layers
			preval_8 = '#B80077';
			preval_9 = '#F7E1EF';
			
			// Other Colors
			preval_10 = 'white';						// Text color on Side Pane and Layer Selector
			
			preval_11 = 'white';						// Text on Active AND Inactive Layers – Level 1
			preval_12 = '#333';							// Text on ONLY Inactive Layer – Level 2
			preval_13 = 'white';						// Text color on Main Menu Shade 2 (Plus the white buttons, but that's not right...)
//			preval_14 = 'rgba(255,255,255,0.7)';		// Background color on Map Boxes
			preval_15 = 'white';						// Background color on HEADER and Map Box Headers on Map
			preval_16 = '#333';							// TEXT color on Header and Map Box Headers on Map
			preval_17 = 'rgba(255, 255, 255, 0.15)';	// Background color Boxes on sidepane (New client box, etc)
			preval_18 = 'white';						// Bacground color Buttons
			
			colorTheme.cThemeDarkBox = true;
			colorTheme.cThemeDarkHeader = false;
			colorTheme.cThemeDarkMenu = true;

		} else {
			
	
			var RGB = {}, HSV = {}, base = '#ADC3CC';
	
			eCol.convert.HEX2RGB (base, RGB);			
			eCol.convert.RGB2HSV (RGB, HSV);			
	
			var newhex = eCol.convert.HSV2HEX(HSV.h, 3, 98);
	
			eCol.convert.HEX2RGB (base, RGB);
			var rgba_50 = 'rgba(' + RGB.r + ',' + RGB.g + ',' + RGB.b + ',0.5)';		
	
	
			// Base Colors
			preval_0 = base;
			preval_1 = newhex;
			preval_2 = 'red';			
			
			preval_3 = 'white';
			
			// Link
			preval_4 = '#309EB2';
			
			// Inactive Layers
			preval_5 = '#63A3A0';
			preval_6 = '#CCE2E1';
			preval_7 = '#EDF4F4';
	
			// Active Layers
			preval_8 = '#B80077';
			preval_9 = '#F7E1EF';
			
			// Other Colors
			preval_10 = 'white';				// Text color on Side Pane and Layer Selector
			
			preval_11 = 'white';				// Text on Active AND Inactive Layers – Level 1
			preval_12 = 'white';				// Text on ONLY Inactive Layer – Level 2
			preval_13 = 'black';				// Text color on Main Menu Shade 2 (Plus the white buttons, but that's not right...)
//			preval_14 = 'rgba(0,0,0,0.7)';		// Background color on Map Boxes
			preval_15 = '#333';					// Background color on HEADER and Map Box Headers on Map
			preval_16 = 'white';				// TEXT color on Header and Map Box Headers on Map
			preval_17 = rgba_50;				// Background color Boxes on sidepane (New client box, etc)
			preval_18 = base;					// Bacground color Buttons
					
						
			colorTheme.cThemeDarkBox = false;
			colorTheme.cThemeDarkHeader = false;
			colorTheme.cThemeDarkMenu = false;			
						
		}
	}	
		if ( theme == 'two' ) {

		colorTheme.cTheme = 'two';

		if ( colorTheme.darktheme ) {

			// Base Colors
			preval_0 = '#0F1A1E';
			preval_1 = '#2C3A3F';
			preval_2 = '#A6B7BF';
	
			preval_3 = '#424242';
	
			// Link
			preval_4 = '#FF5300';
		
	
			// Inactive Layers
			preval_5 = '#63A3A0';
			preval_6 = '#CCE2E1';
			preval_7 = '#EDF4F4';
	
			// Active Layers
			preval_8 = '#F98752';
			preval_9 = '#FCF2ED';
			
			// Other Colors			
			preval_10 = 'white';						// Text color on Side Pane and Layer Selector
			preval_11 = 'white';						// Text on Active AND Inactive Layers – Level 1
			preval_12 = '#333';							// Text on ONLY Inactive Layer – Level 2
			preval_13 = 'white';						// Text color on Main Menu Shade 2 (Plus the white buttons, but that's not right...)
//			preval_14 = 'rgba(255,255,255,0.7)';		// Background color on Map Boxes
			preval_15 = 'white';						// Background color on HEADER and Map Box Headers on Map
			preval_16 = '#333';							// TEXT color on Header and Map Box Headers on Map
			preval_17 = 'rgba(255, 255, 255, 0.15)';	// Background color Boxes on sidepane (New client box, etc)			
			preval_18 = 'white';						// Bacground color Buttons
			
			colorTheme.cThemeDarkBox = true;
			colorTheme.cThemeDarkHeader = false;
			colorTheme.cThemeDarkMenu = true;


		} else {
			
			var RGB = {}, HSV = {}, base = '#CCBFAD';
	
			eCol.convert.HEX2RGB (base, RGB);			
			eCol.convert.RGB2HSV (RGB, HSV);			
	
			var newhex = eCol.convert.HSV2HEX(HSV.h, 3, 98);
	
			eCol.convert.HEX2RGB (base, RGB);
			var rgba_50 = 'rgba(' + RGB.r + ',' + RGB.g + ',' + RGB.b + ',0.5)';		
	
	
	
			// Base Color
			preval_0 = base;
			preval_1 = newhex;			
			preval_2 = 'red';
						
			preval_3 = 'white';
	
			// Link
			preval_4 = '#2B889E';
	
			// Inactive Layers
			preval_5 = '#63A3A0';
			preval_6 = '#CCE2E1';
			preval_7 = '#EDF4F4';
	
			// Active Layers
			preval_8 = '#B80077';
			preval_9 = '#F7E1EF';
			
			// Other Colors
			preval_10 = 'white';				// Text color on Side Pane and Layer Selector
			preval_11 = 'white';				// Text on Active AND Inactive Layers – Level 1
			preval_12 = 'white';				// Text on ONLY Inactive Layer – Level 2
			preval_13 = 'black';				// Text color on Main Menu Shade 2 (Plus the white buttons, but that's not right...)
//			preval_14 = 'rgba(0,0,0,0.7)';		// Background color on Map Boxes
			preval_15 = '#333';					// Background color on HEADER and Map Box Headers on Map
			preval_16 = 'white';				// TEXT color on Header and Map Box Headers on Map
			preval_17 = rgba_50;				// Background color Boxes on sidepane (New client box, etc)
			preval_18 = base;					// Bacground color Buttons
			
					
			colorTheme.cThemeDarkBox = false;
			colorTheme.cThemeDarkHeader = false;
			colorTheme.cThemeDarkMenu = false;			
			
			
			
		}
	}
		if ( theme == 'three' ) {
	
			colorTheme.cTheme = 'three';
		
			if ( colorTheme.darktheme ) {
					
				// Base Colors
				preval_0 = '#0F1A1E';
				preval_1 = '#333333';
				preval_2 = '#A6A6A6';
		
				preval_3 = '#424242';
		
				// Link
				preval_4 = '#FF00AA';
		
				// Inactive Layers
				preval_5 = '#63A3A0';
				preval_6 = '#CCE2E1';
				preval_7 = '#EDF4F4';
		
				// Active Layers
				preval_8 = '#B80077';
				preval_9 = '#F7E1EF';
				
				// Other Colors
				preval_10 = 'white';						// Text color on Side Pane and Layer Selector
				preval_11 = 'white';						// Text on Active AND Inactive Layers – Level 1
				preval_12 = '#333';							// Text on ONLY Inactive Layer – Level 2
				preval_13 = 'white';						// Text color on Main Menu Shade 2 (Plus the white buttons, but that's not right...)
	//			preval_14 = 'rgba(255,255,255,0.7)';		// Background color on Map Boxes
				preval_15 = 'white';						// Background color on HEADER and Map Box Headers on Map
				preval_16 = '#333';							// TEXT color on Header and Map Box Headers on Map
				preval_17 = 'rgba(255, 255, 255, 0.15)';	// Background color Boxes on sidepane (New client box, etc)			
				preval_18 = 'white';						// Bacground color Buttons
				
				colorTheme.cThemeDarkBox = true;
				colorTheme.cThemeDarkHeader = false;
				colorTheme.cThemeDarkMenu = true;
	
	
			} else {
				
				var RGB = {}, HSV = {}, base = '#BCBCBC';
		
				eCol.convert.HEX2RGB (base, RGB);			
				eCol.convert.RGB2HSV (RGB, HSV);			
		
				var newhex = eCol.convert.HSV2HEX(HSV.h, 0, 98);
		
				eCol.convert.HEX2RGB (base, RGB);
				var rgba_50 = 'rgba(' + RGB.r + ',' + RGB.g + ',' + RGB.b + ',0.5)';
		
			
				// Base Colors
				preval_0 = base;
				preval_1 = newhex;
				preval_2 = 'red';
		
				preval_3 = 'white';
		
				// Link
				preval_4 = '#AE2B95';
		
				// Inactive Layers
				preval_5 = '#63A3A0';
				preval_6 = '#CCE2E1';
				preval_7 = '#EDF4F4';
		
				// Active Layers
				preval_8 = '#B80077';
				preval_9 = '#F7E1EF';
		
				// Other Colors
				preval_10 = 'white';				// Text color on Side Pane and Layer Selector
				
				preval_11 = 'white';				// Text on Active AND Inactive Layers – Level 1
				preval_12 = 'white';				// Text on ONLY Inactive Layer – Level 2
				preval_13 = 'black';				// Text color on Main Menu Shade 2 (Plus the white buttons, but that's not right...)
	//			preval_14 = 'rgba(0,0,0,0.7)';		// Background color on Map Boxes
				preval_15 = '#333';					// Background color on HEADER and Map Box Headers on Map
				preval_16 = 'white';				// TEXT color on Header and Map Box Headers on Map
				preval_17 = rgba_50;				// Background color Boxes on sidepane (New client box, etc)
				preval_18 = base;					// Bacground color Buttons
	
				colorTheme.cThemeDarkBox = false;
				colorTheme.cThemeDarkHeader = false;
				colorTheme.cThemeDarkMenu = false;			
			}		
	}
	
	
	
	
		colorTheme.css[3].value = preval_3;	
	
		// Link
		colorTheme.css[4].value = preval_4;
		
		// Inactive Layers
		colorTheme.css[5].value = preval_5;	
		colorTheme.css[6].value = preval_6;	
		colorTheme.css[7].value = preval_7;	
		
		// Active Layers	
		colorTheme.css[8].value = preval_8;	
		colorTheme.css[9].value = preval_9;
	
	
		// MENU : LIGHT OR DARK
		
		if ( colorTheme.cThemeDarkMenu ) {
			darkMenu(preval_1);		
		} else {
			lightMenu(preval_1);
		}
		
	
		// BOXES : LIGHT OR DARK
		
		if ( colorTheme.cThemeDarkBox ) {
			colorTheme.css[14].value = 'rgba(0,0,0,0.7)';
			colorTheme.css[31].value = '-56px 8px';		
		} else {
			colorTheme.css[14].value = 'rgba(255, 255, 255, 0.7)';		
			colorTheme.css[31].value = '';
		}
		
		// HEADERS: LIGHT OR DARK
		
		if ( colorTheme.cThemeDarkHeader ) {
			colorTheme.css[15].value = 'rgba(0,0,0,0.8)';
			colorTheme.css[16].value = 'white';			
		} else {
			colorTheme.css[15].value = 'rgba(255,255,255,0.92)';	
			colorTheme.css[16].value = '#333';	
		}
		
	
		// Other Colors
	
		colorTheme.css[10].value = preval_10;	// Link on white background
			
		eCol.update.CSSstring();
		jcss.innerHTML = cssstring;
	
	}
	
	// *****************************************
		
	
	
	
	// *****************************************
	
	// Advanced Color Theme Mode
	// Advanced Color Theme Mode
	// Advanced Color Theme Mode

	// *****************************************
	
	var advancedColorThemes = {
	
	init : function() {

	
		// For CSS animating height of container
		var pheight1 = '342px';
		var pheight2 = '490px';
	
	
		// Slide in the ADVANCED options
		eVars._color_Inner_wrapper.style.left = '-580px';		
		eVars._color_Outer_wrapper.style.height = pheight1;
		
		// Basic elements
		eVars._b2basic = Wu.DomUtil.get('back-to-basic');
		eVars._yourswatch = Wu.DomUtil.get('yourswatch');	
		eVars._myCanvas = Wu.DomUtil.get("myCanvas");
		eVars._pixCanvas = Wu.DomUtil.get("pixCanvas");
		eVars._canvimg = Wu.DomUtil.get("canvimg");
				
		// Edit Color Buttons
		eVars._coloption1 = Wu.DomUtil.get('coloption1');
		eVars._coloption2 = Wu.DomUtil.get('coloption2');
		eVars._coloption3 = Wu.DomUtil.get('coloption3');	
		eVars._yourcolLink1 = Wu.DomUtil.get('yourcol_link1');
		eVars._regen = Wu.DomUtil.get('regen');				
		
		// Swatch containers
		eVars._normalSwatches = Wu.DomUtil.get('normal-swatches');
		eVars._darkSwatches = Wu.DomUtil.get('dark-swatches');
		eVars._linkSwatches = Wu.DomUtil.get('link-swatches');
		eVars._colorSuggestions = Wu.DomUtil.get('color-suggestions');		
		
		// Toggle buttons
		eVars._hsvToggle = Wu.DomUtil.get('hsv-toggle');
		eVars._rgbToggle = Wu.DomUtil.get('rgb-toggle'); 					
		eVars._paletteToggle = Wu.DomUtil.get('palette-toggle');
		eVars._sliderToggle = Wu.DomUtil.get('slider-toggle'); 	
		eVars._imageToggle = Wu.DomUtil.get('image-toggle'); 			
		
		// Dark/light tickers
		eVars._tickMenuLight = Wu.DomUtil.get('tick-menu-light');
		eVars._tickMenuDark = Wu.DomUtil.get('tick-menu-dark');		

		eVars._tickHeaderLight = Wu.DomUtil.get('tick-header-light');
		eVars._tickHeaderDark = Wu.DomUtil.get('tick-header-dark');		

		eVars._tickMboxLight = Wu.DomUtil.get('tick-mbox-light');
		eVars._tickMboxDark = Wu.DomUtil.get('tick-mbox-dark');	
		
		// Dark Color Swatches
		eVars._dark_swatch_0 = Wu.DomUtil.get('dark_swatch_0');		
		eVars._dark_swatch_1 = Wu.DomUtil.get('dark_swatch_1');		
		eVars._dark_swatch_2 = Wu.DomUtil.get('dark_swatch_2');		
		eVars._dark_swatch_3 = Wu.DomUtil.get('dark_swatch_3');		
		eVars._dark_swatch_4 = Wu.DomUtil.get('dark_swatch_4');		
		eVars._dark_swatch_5 = Wu.DomUtil.get('dark_swatch_5');
		
		eVars._dark_swatch_0.onclick = function() { passcolor('dark',0); }
		eVars._dark_swatch_1.onclick = function() { passcolor('dark',1); }
		eVars._dark_swatch_2.onclick = function() { passcolor('dark',2); }
		eVars._dark_swatch_3.onclick = function() { passcolor('dark',3); }
		eVars._dark_swatch_4.onclick = function() { passcolor('dark',4); }
		eVars._dark_swatch_5.onclick = function() { passcolor('dark',5); }
		

		// Light Color Swatches
		eVars._light_swatch_0 = Wu.DomUtil.get('light_swatch_0');		
		eVars._light_swatch_1 = Wu.DomUtil.get('light_swatch_1');		
		eVars._light_swatch_2 = Wu.DomUtil.get('light_swatch_2');		
		eVars._light_swatch_3 = Wu.DomUtil.get('light_swatch_3');		
		eVars._light_swatch_4 = Wu.DomUtil.get('light_swatch_4');		
		eVars._light_swatch_5 = Wu.DomUtil.get('light_swatch_5');		
		
		eVars._light_swatch_0.onclick = function() { passcolor('light',0); }		
		eVars._light_swatch_1.onclick = function() { passcolor('light',1); }		
		eVars._light_swatch_2.onclick = function() { passcolor('light',2); }		
		eVars._light_swatch_3.onclick = function() { passcolor('light',3); }		
		eVars._light_swatch_4.onclick = function() { passcolor('light',4); }		
		eVars._light_swatch_5.onclick = function() { passcolor('light',5); }		
		
		
		// Complimetary Color Swatches
		eVars._complimentary_swatch_0 = Wu.DomUtil.get('complimentary_swatch_0');		
		eVars._complimentary_swatch_1 = Wu.DomUtil.get('complimentary_swatch_1');		
		eVars._complimentary_swatch_2 = Wu.DomUtil.get('complimentary_swatch_2');		
		eVars._complimentary_swatch_3 = Wu.DomUtil.get('complimentary_swatch_3');		

		eVars._complimentary_swatch_0.onclick = function() { passcolor('complimentary',0); }		
		eVars._complimentary_swatch_1.onclick = function() { passcolor('complimentary',1); }		
		eVars._complimentary_swatch_2.onclick = function() { passcolor('complimentary',2); }		
		eVars._complimentary_swatch_3.onclick = function() { passcolor('complimentary',3); }		


		// Matching Color Swatches
		eVars._matching_swatch_0 = Wu.DomUtil.get('matching_swatch_0');		
		eVars._matching_swatch_1 = Wu.DomUtil.get('matching_swatch_1');		
		eVars._matching_swatch_2 = Wu.DomUtil.get('matching_swatch_2');		
		eVars._matching_swatch_3 = Wu.DomUtil.get('matching_swatch_3');		
		eVars._matching_swatch_4 = Wu.DomUtil.get('matching_swatch_4');	
		
		eVars._matching_swatch_0.onclick = function() { passcolor('matching',0); }		
		eVars._matching_swatch_1.onclick = function() { passcolor('matching',1); }		
		eVars._matching_swatch_2.onclick = function() { passcolor('matching',2); }		
		eVars._matching_swatch_3.onclick = function() { passcolor('matching',3); }		
		eVars._matching_swatch_4.onclick = function() { passcolor('matching',4); }		
			

		// Bright Color Swatches
		eVars._bright_swatch_0 = Wu.DomUtil.get('bright_swatch_0');		
		eVars._bright_swatch_1 = Wu.DomUtil.get('bright_swatch_1');		
		eVars._bright_swatch_2 = Wu.DomUtil.get('bright_swatch_2');		
		eVars._bright_swatch_3 = Wu.DomUtil.get('bright_swatch_3');		
		eVars._bright_swatch_4 = Wu.DomUtil.get('bright_swatch_4');		
		eVars._bright_swatch_5 = Wu.DomUtil.get('bright_swatch_5');		
		eVars._bright_swatch_6 = Wu.DomUtil.get('bright_swatch_6');		
		eVars._bright_swatch_7 = Wu.DomUtil.get('bright_swatch_7');		
		eVars._bright_swatch_8 = Wu.DomUtil.get('bright_swatch_8');		
		eVars._bright_swatch_9 = Wu.DomUtil.get('bright_swatch_9');		
		eVars._bright_swatch_10 = Wu.DomUtil.get('bright_swatch_10');		
		
		eVars._bright_swatch_0.onclick = function() { passcolor('bright',0); }				
		eVars._bright_swatch_1.onclick = function() { passcolor('bright',1); }				
		eVars._bright_swatch_2.onclick = function() { passcolor('bright',2); }				
		eVars._bright_swatch_3.onclick = function() { passcolor('bright',3); }				
		eVars._bright_swatch_4.onclick = function() { passcolor('bright',4); }				
		eVars._bright_swatch_5.onclick = function() { passcolor('bright',5); }				
		eVars._bright_swatch_6.onclick = function() { passcolor('bright',6); }				
		eVars._bright_swatch_7.onclick = function() { passcolor('bright',7); }				
		eVars._bright_swatch_8.onclick = function() { passcolor('bright',8); }				
		eVars._bright_swatch_9.onclick = function() { passcolor('bright',9); }				
		eVars._bright_swatch_10.onclick = function() { passcolor('bright',10); }
		
		
		
		
		
		
		// SET RIGHT TOGGLE STATES...
		
		if ( colorTheme.cThemeDarkMenu ) {
			Wu.DomUtil.addClass(eVars._tickMenuDark, 'active-toggle');
			Wu.DomUtil.removeClass(eVars._tickMenuLight, 'active-toggle');
		} else {
			Wu.DomUtil.removeClass(eVars._tickMenuDark, 'active-toggle');
			Wu.DomUtil.addClass(eVars._tickMenuLight, 'active-toggle');
		}
		
		if ( colorTheme.cThemeDarkBox ) {
			Wu.DomUtil.addClass(eVars._tickMboxDark, 'active-toggle');
			Wu.DomUtil.removeClass(eVars._tickMboxLight, 'active-toggle');
		} else {
			Wu.DomUtil.removeClass(eVars._tickMboxDark, 'active-toggle');
			Wu.DomUtil.addClass(eVars._tickMboxLight, 'active-toggle');
		}

		if ( colorTheme.cThemeDarkHeader ) {
			Wu.DomUtil.addClass(eVars._tickHeaderDark, 'active-toggle');
			Wu.DomUtil.removeClass(eVars._tickHeaderLight, 'active-toggle');
		} else {
			Wu.DomUtil.removeClass(eVars._tickHeaderDark, 'active-toggle');
			Wu.DomUtil.addClass(eVars._tickHeaderLight, 'active-toggle');
		}
		
			
		
		
		
						
		// Set background color of MAIN swatch
		eVars._yourswatch.style.backgroundColor = basecolor;	
		
		// Back to BASIC mode
		eVars._b2basic.onclick = function() {
		
			// Reset
			if ( changingColors == 1 ) eVars._coloption1.click();		
			if ( changingColors == 2 ) eVars._coloption2.click();
			if ( changingColors == 3 ) eVars._coloption3.click();
			if ( changingColors == 4 ) eVars._yourcolLink1.click();
			if ( changingColors == 'all' ) eVars._regen.click();

			eVars._color_Inner_wrapper.style.left = '-310px';
			eVars._color_Outer_wrapper.style.height = '182px';				
		
		}
	
		// INIT SLIDERS				
		this.initSliders();
	
		// Find the right image to use for the color picker...
		// OBS! Image must be stored locally (same url as server) for it to work...
		var uggid = Wu.DomUtil.get('project-color-theme').parentNode.getAttribute('uuid');
		var ulist =	Wu.DomUtil.get('editor-projects-container');
			ulist = ulist.getElementsByTagName('div');

		// Color picker
		eCol.cPicker.img2canvas();
			
		// INIT CHANGING COLORS
		this.initComplimentaryColors();
		this.initMatchingColors();
		
		// INIT STATIC COLORS
		this.initDarkColors();
		this.initLightColors();
		this.initBrightColors();	
	
		updateTempSwatches();
	
	
		// Load default color theme if there ain't nothin there...
		if ( !colorTheme.css || rezet ) prethemes('one');
	
	
		
		// TRIGGERS / CLICKS 


		// 1 ~ Background color
		eVars._coloption1.onclick = function() {
			
			
				haschanged = true;
		
				// If we are already editing this color
				if ( changingColors == 1 ) {
				
					eVars._color_Outer_wrapper.style.height = pheight1;
								
					// Disable editing state									
					changingColors = false;
					
					// Remove red box around this element				
					Wu.DomUtil.removeClass(this, 'changing');
					
					// Set back to default swatches								
					Wu.DomUtil.removeClass(eVars._normalSwatches, 'die');
					Wu.DomUtil.addClass(eVars._darkSwatches, 'die');
					Wu.DomUtil.addClass(eVars._linkSwatches, 'die');					
	
					// Close the swatch selector												
					Wu.DomUtil.addClass(eVars._colorSuggestions, 'collapsed-color-suggestions');
									
									
				} else {
				
					eVars._color_Outer_wrapper.style.height = pheight2;			
				
					// Set edit state			
					changingColors = 1;
					
					// Put red box around this element		
					Wu.DomUtil.addClass(this, 'changing');							
	
					// What swatches to show
					Wu.DomUtil.removeClass(eVars._darkSwatches, 'die');
					Wu.DomUtil.addClass(eVars._linkSwatches, 'die');
					Wu.DomUtil.addClass(eVars._normalSwatches, 'die');
	
					// Remove red frame from other elements
					Wu.DomUtil.removeClass(eVars._coloption2, 'changing');																
					Wu.DomUtil.removeClass(eVars._coloption3, 'changing');																
					Wu.DomUtil.removeClass(eVars._yourcolLink1, 'changing');																
//					Wu.DomUtil.removeClass(eVars._yourcolLink2, 'changing');																
					Wu.DomUtil.removeClass(eVars._regen, 'changing');										
					
					
					// Update the Alfra Omega swatch
					eVars._yourswatch.style.backgroundColor = colorTheme.css[0].value;
					
					// Set the HEX value in the input field
					eVars._hexColor.value = colorTheme.css[0].value;				
					
					// Open the swatch selector
					Wu.DomUtil.removeClass(eVars._colorSuggestions, 'collapsed-color-suggestions');

					// Bring back the Palette Toggle Button
					eVars._paletteToggle.removeAttribute('style');

					// Update Value					
					eCol.update.HEX(eVars._hexColor.value);				
					eCol.update.inputFields('HEX');
	
				}
			}
	
		// 2 ~ The menu color
		eVars._coloption2.onclick = function() {
	
	
				haschanged = true;
	
				// If we are already editing this color
				if ( changingColors == 2 ) {
	
					eVars._color_Outer_wrapper.style.height = pheight1;
								
					// Disable editing state						
					changingColors = false;
					
					// Remove red box around this element
					Wu.DomUtil.removeClass(this, 'changing');								
					
					// Close the swatch selector								
					Wu.DomUtil.addClass(eVars._colorSuggestions, 'collapsed-color-suggestions');
									
				} else {
				
					eVars._color_Outer_wrapper.style.height = pheight2;
				
					// Set edit state			
					changingColors = 2;
					
					// Put red box around this element
					Wu.DomUtil.addClass(this, 'changing');								
						
					// What swatches to show
					Wu.DomUtil.removeClass(eVars._normalSwatches, 'die');	
					Wu.DomUtil.addClass(eVars._linkSwatches, 'die');	
					Wu.DomUtil.addClass(eVars._darkSwatches, 'die');	
					
	
					// Remove red frame from other elements					
					Wu.DomUtil.removeClass(eVars._coloption1, 'changing');															
					Wu.DomUtil.removeClass(eVars._coloption3, 'changing');															
					Wu.DomUtil.removeClass(eVars._yourcolLink1, 'changing');															
//					Wu.DomUtil.removeClass(eVars._yourcolLink2, 'changing');															
					Wu.DomUtil.removeClass(eVars._regen, 'changing');															
					
					// Update the Alfra Omega swatch
					eVars._yourswatch.style.backgroundColor = colorTheme.css[5].value;
	
					// Set the HEX value in the input field
					eVars._hexColor.value = colorTheme.css[5].value;		
									
					// Open the swatch selector
					Wu.DomUtil.removeClass(eVars._colorSuggestions, 'collapsed-color-suggestions');
					
					eCol.update.HEX(eVars._hexColor.value);

					eCol.update.inputFields('HEX');
					
					
					// Bring back the Palette Toggle Button
					eVars._paletteToggle.removeAttribute('style');
					
					
				}
			}

		// 3 ~ Selected / active colors
		eVars._coloption3.onclick = function() {
	
				haschanged = true;
	
				// If we are already editing this color
				if ( changingColors == 3 ) {
				
					eVars._color_Outer_wrapper.style.height = pheight1;			
				
					// Disable editing state			
					changingColors = false;
					
					// Remove red box around this element
					Wu.DomUtil.removeClass(this, 'changing');
					
					// Close the swatch selector				
					Wu.DomUtil.addClass(eVars._colorSuggestions, 'collapsed-color-suggestions');
					
				} else {
				
					eVars._color_Outer_wrapper.style.height = pheight2;
								
					// Set edit state			
					changingColors = 3;
					
					// Put red box around this element
					Wu.DomUtil.addClass(this, 'changing');
	
					// What swatches to show
					Wu.DomUtil.removeClass(eVars._normalSwatches, 'die');
					Wu.DomUtil.addClass(eVars._linkSwatches, 'die');
					Wu.DomUtil.addClass(eVars._darkSwatches, 'die');

					// Remove red frame from other elements
					Wu.DomUtil.removeClass(eVars._coloption1, 'changing');					
					Wu.DomUtil.removeClass(eVars._coloption2, 'changing');					
					Wu.DomUtil.removeClass(eVars._yourcolLink1, 'changing');					
//					Wu.DomUtil.removeClass(eVars._yourcolLink2, 'changing');					
					Wu.DomUtil.removeClass(eVars._regen, 'changing');		
	
					// Update the Alfra Omega swatch				
					eVars._yourswatch.style.backgroundColor = colorTheme.css[8].value;
	
					// Set the HEX value in the input field
					eVars._hexColor.value = colorTheme.css[8].value;
												
					// Open the swatch selector				
					Wu.DomUtil.removeClass(eVars._colorSuggestions, 'collapsed-color-suggestions');
	
					eCol.update.HEX(eVars._hexColor.value);

					eCol.update.inputFields('HEX');
					
					
					// Bring back the Palette Toggle Button
					eVars._paletteToggle.removeAttribute('style');

					
				}
			}
			
		// 4 ~ Link color
		eVars._yourcolLink1.onclick = function() {
			
				haschanged = true;
			
				// If we are already editing this color
				if ( changingColors == 4 ) {
			
					eVars._color_Outer_wrapper.style.height = pheight1;
							
					// Disable editing state
					changingColors = false;
					
					// Remove red box around this element
					Wu.DomUtil.removeClass(this, 'changing');					

					
					// Set back to default swatches
					Wu.DomUtil.addClass(eVars._linkSwatches, 'die');					
					Wu.DomUtil.addClass(eVars._darkSwatches, 'die');					
					Wu.DomUtil.removeClass(eVars._normalSwatches, 'die');					

	
					// Close the swatch selector
					Wu.DomUtil.addClass(eVars._colorSuggestions, 'collapsed-color-suggestions');					
	
	
				} else {
						
					eVars._color_Outer_wrapper.style.height = pheight2;
										
					// Set edit state
					changingColors = 4;
					
					// Put red box around this element
					Wu.DomUtil.addClass(this, 'changing');					

			
					// What swatches to show
					Wu.DomUtil.removeClass(eVars._linkSwatches, 'die');					
					Wu.DomUtil.addClass(eVars._darkSwatches, 'die');					
					Wu.DomUtil.addClass(eVars._normalSwatches, 'die');					
					
					// Remove red frame from other elements
					Wu.DomUtil.removeClass(eVars._coloption1, 'changing');
					Wu.DomUtil.removeClass(eVars._coloption2, 'changing');
					Wu.DomUtil.removeClass(eVars._coloption3, 'changing');
//					Wu.DomUtil.removeClass(eVars._yourcolLink2, 'changing');
					Wu.DomUtil.removeClass(eVars._regen, 'changing');									
					
					// Update the Alfra Omega swatch
					eVars._yourswatch.style.backgroundColor = colorTheme.css[4].value;
	
					// Set the HEX value in the input field
					eVars._hexColor.value = colorTheme.css[4].value;
					
					// Open the swatch selector
					Wu.DomUtil.removeClass(eVars._colorSuggestions, 'collapsed-color-suggestions');					
					
					eCol.update.HEX(eVars._hexColor.value);
					eCol.update.inputFields('HEX');				
					
					
					// Bring back the Palette Toggle Button
					eVars._paletteToggle.removeAttribute('style');
									

				}
			}
	
		// all ~ Change Complimentary & Matching Colors
		eVars._regen.onclick = function() {
			
			
				// If we are already editing this color
				if ( changingColors == 'all' ) {
				
					eVars._color_Outer_wrapper.style.height = pheight1;			
			
					// Disable editing state
					changingColors = false;
					
					// Remove red box around this element
					Wu.DomUtil.removeClass(this, 'changing');

					// Set back to default swatches
					Wu.DomUtil.removeClass(eVars._normalSwatches, 'die');					
					Wu.DomUtil.addClass(eVars._linkSwatches, 'die');
					Wu.DomUtil.addClass(eVars._darkSwatches, 'die');					
																	
					// Bring back the Palette Toggle Button
					eVars._paletteToggle.removeAttribute('style');
					
					// Close the swatch selector
					Wu.DomUtil.addClass(eVars._colorSuggestions, 'collapsed-color-suggestions');

				} else {
	
					eVars._color_Outer_wrapper.style.height = pheight2;			
						
					// Set edit state
					changingColors = 'all';
					
					// Put red box around this element
					Wu.DomUtil.addClass(this, 'changing');
	
					// What swatches to show
					Wu.DomUtil.removeClass(eVars._normalSwatches, 'die');										
					Wu.DomUtil.addClass(eVars._linkSwatches, 'die');					
					Wu.DomUtil.addClass(eVars._darkSwatches, 'die');					
											
					// Remove red frame from other elements
					Wu.DomUtil.removeClass(eVars._coloption1, 'changing');
					Wu.DomUtil.removeClass(eVars._coloption2, 'changing');
					Wu.DomUtil.removeClass(eVars._coloption3, 'changing');
					Wu.DomUtil.removeClass(eVars._yourcolLink1, 'changing');

					// Update the Alfra Omega swatch
					eVars._yourswatch.style.backgroundColor = complimentaryColor[0][0].HEX;

					// Set the HEX value in the input field
					eVars._hexColor.value = complimentaryColor[0][0].HEX;
	
					// Open the swatch selector
					Wu.DomUtil.removeClass(eVars._colorSuggestions, 'collapsed-color-suggestions');

					// Snap out of Palette Mode
					eVars._sliderToggle.click();
					eVars._paletteToggle.setAttribute('style', 'opacity: 0.2; cursor: normal');
	
					eCol.update.HEX(eVars._hexColor.value);
					eCol.update.inputFields('HEX');					
					
				}


			
		}
	
		// Toggle between RGB and HSV slider mode, yo			
		eVars._hsvToggle.onclick = function() {		
				var togclass = this.className;		
				if ( togclass == 'active-toggle' ) {
					this.className = '';
					eVars._rgbToggle.className = 'active-toggle';				
					Wu.DomUtil.get('rgb-slider-container').className = '';
					Wu.DomUtil.get('hsv-slider-container').className = 'die';	
				} else {
					this.className = 'active-toggle';
					eVars._rgbToggle.className = '';
					Wu.DomUtil.get('rgb-slider-container').className = 'die';
					Wu.DomUtil.get('hsv-slider-container').className = '';	
				}
			}
		eVars._rgbToggle.onclick = function() {
				var togclass = this.className;			
				if ( togclass == 'active-toggle' ) {
					this.className = '';
					eVars._hsvToggle.className = 'active-toggle';				
					Wu.DomUtil.get('rgb-slider-container').className = 'die';
					Wu.DomUtil.get('hsv-slider-container').className = '';	
				} else {
					this.className = 'active-toggle';
					eVars._hsvToggle.className = '';			
					Wu.DomUtil.get('rgb-slider-container').className = '';
					Wu.DomUtil.get('hsv-slider-container').className = 'die';	
				}
			}

		// Toggle between Swatch sample, sliders, and image sampler
		eVars._paletteToggle.onclick = function() {		

			if ( changingColors != 'all' ) {

				Wu.DomUtil.addClass(this, 'active-toggle');
				Wu.DomUtil.removeClass(eVars._sliderToggle, 'active-toggle');			
				Wu.DomUtil.removeClass(eVars._imageToggle, 'active-toggle');			
	
				Wu.DomUtil.get('s-watches').style.display = 'block';
	
				Wu.DomUtil.get('sliders').style.display = 'none';
				Wu.DomUtil.get('canvascontainer').style.display = 'none';		
				
			}

		}
		eVars._sliderToggle.onclick = function() {

			Wu.DomUtil.addClass(this, 'active-toggle');
			Wu.DomUtil.removeClass(eVars._paletteToggle, 'active-toggle');			
			Wu.DomUtil.removeClass(eVars._imageToggle, 'active-toggle');						

			Wu.DomUtil.get('sliders').style.display = 'block';
			
			Wu.DomUtil.get('s-watches').style.display = 'none';
			Wu.DomUtil.get('canvascontainer').style.display = 'none';


		}
		eVars._imageToggle.onclick = function() {

			Wu.DomUtil.addClass(this, 'active-toggle');
			Wu.DomUtil.removeClass(eVars._paletteToggle, 'active-toggle');	
			Wu.DomUtil.removeClass(eVars._sliderToggle, 'active-toggle');							


			Wu.DomUtil.get('canvascontainer').style.display = 'block';
			Wu.DomUtil.get('sliders').style.display = 'none';
			Wu.DomUtil.get('s-watches').style.display = 'none';


		}

		// Toggle DARK / LIGHT values
		// cxxxxx

		// MENU TOGGLER
		eVars._tickMenuLight.onclick = function() {

			colorTheme.cThemeDarkMenu = false;
			updateMenuLightDarkToggleButtons();
			
			var tempHEX = colorTheme.css[0].value;
			lightMenu(tempHEX);

			eCol.update.CSSstring();
			jcss.innerHTML = cssstring;
			
		}
		
		eVars._tickMenuDark.onclick = function() {
	
			colorTheme.cThemeDarkMenu = true;	
			updateMenuLightDarkToggleButtons();
	
			var tempHEX = colorTheme.css[0].value;
			
			darkMenu(tempHEX);

			eCol.update.CSSstring();
			jcss.innerHTML = cssstring;			

		}	
		
		
		
		
		
		// HEADER TOGGLER
		eVars._tickHeaderLight.onclick = function() {

			Wu.DomUtil.addClass(this, 'active-toggle');
			Wu.DomUtil.removeClass(eVars._tickHeaderDark, 'active-toggle');			

			colorTheme.css[15].value = 'rgba(255,255,255,0.92)';	
			colorTheme.css[16].value = '#333';	

			eCol.update.CSSstring();
			jcss.innerHTML = cssstring;
			
		}
		eVars._tickHeaderDark.onclick = function() {
	
			Wu.DomUtil.addClass(this, 'active-toggle');
			Wu.DomUtil.removeClass(eVars._tickHeaderLight, 'active-toggle');			
		
			colorTheme.css[15].value = 'rgba(0,0,0,0.8)';
			colorTheme.css[16].value = 'white';			
			
			eCol.update.CSSstring();
			jcss.innerHTML = cssstring;			

		}	
		
		// MAP BOXES TOGGLER
		eVars._tickMboxLight.onclick = function() {

			Wu.DomUtil.addClass(this, 'active-toggle');
			Wu.DomUtil.removeClass(eVars._tickMboxDark, 'active-toggle');			

			colorTheme.css[14].value = 'rgba(255, 255, 255, 0.7)';

			eCol.update.CSSstring();
			jcss.innerHTML = cssstring;
			
		}
		eVars._tickMboxDark.onclick = function() {
	
			Wu.DomUtil.addClass(this, 'active-toggle');
			Wu.DomUtil.removeClass(eVars._tickMboxLight, 'active-toggle');			
	
			colorTheme.css[14].value = 'rgba(0,0,0,0.7)';
			
			eCol.update.CSSstring();
			jcss.innerHTML = cssstring;			

		}					
			
	
	
		// If no color theme has been loaded, run the default one
		if ( cssstring == '' || !cssstring ) prethemes('dark1');
		
	},
	
	initSliders : function() {

		// Update slider 1 - H
		eCol.sliders.rangeSlider('range-slider-1', 360, function(value) {
	
		    eVars._hChannel.value = value;
	
		    var HSV = new eCol.HSVobject(0,0,0);
		    HSV = {'h': eVars._hChannel.value, 's': eVars._sChannel.value, 'v': eVars._vChannel.value };
	
		    // Update the input fields
		    eCol.update.HSV(HSV);
		    
		    // Update the MAIN swatch
		    eVars._yourswatch.style.backgroundColor = eVars._hexColor.value;
		    		    
		    // Update the swatch we have SELECTED
		    eCol.update.customColors();
		    
	
		});
	
		// Update slider 2 - S
		eCol.sliders.rangeSlider('range-slider-2', 100, function(value) {
	
		    eVars._sChannel.value = value;
	
		    var HSV = new eCol.HSVobject(0,0,0);
		    HSV = {'h': eVars._hChannel.value, 's': eVars._sChannel.value, 'v': eVars._vChannel.value };
	
		    // Update the input fields
		    eCol.update.HSV(HSV);
		    
		    // Update the MAIN swatch
		    eVars._yourswatch.style.backgroundColor = eVars._hexColor.value;	    
	
		    // Update the swatch we have SELECTED
		    eCol.update.customColors();
		});
	
		// Update slider 3 - V
		eCol.sliders.rangeSlider('range-slider-3', 100, function(value) {
	
		    eVars._vChannel.value = value;
	
		    var HSV = new eCol.HSVobject(0,0,0);
		    HSV = {'h': eVars._hChannel.value, 's': eVars._sChannel.value, 'v': eVars._vChannel.value };
	
		    // Update the input fields
		    eCol.update.HSV(HSV);
		    
		    // Update the MAIN swatch
		    eVars._yourswatch.style.backgroundColor = eVars._hexColor.value;	    
	
		    // Update the swatch we have SELECTED
		    eCol.update.customColors();
		});
	
		// Update slider R
		eCol.sliders.rangeSlider('range-slider-r', 255, function(value) {
	
		    eVars._rChannel.value = value;
	
	
		    var RGB = new eCol.RGBobject(0,0,0);
		    RGB = {'r': eVars._rChannel.value, 'g': eVars._gChannel.value, 'b': eVars._bChannel.value };
	
	
		    // Update the input fields
		    eCol.update.RGB(RGB);
	
		    // Update the MAIN swatch
		    eVars._yourswatch.style.backgroundColor = eVars._hexColor.value;	    
	
		    // Update the swatch we have SELECTED
		    eCol.update.customColors();
		});
	
		// Update slider G
		eCol.sliders.rangeSlider('range-slider-g', 255, function(value) {
	
		    eVars._gChannel.value = value;
	
		    var RGB = new eCol.RGBobject(0,0,0);
		    RGB = {'r': eVars._rChannel.value, 'g': eVars._gChannel.value, 'b': eVars._bChannel.value };
	
		    // Update the input fields
		    eCol.update.RGB(RGB);
	
		    // Update the MAIN swatch
		    eVars._yourswatch.style.backgroundColor = eVars._hexColor.value;	    
	
		    // Update the swatch we have SELECTED
		    eCol.update.customColors();
		});
	
		// Update slider B
		eCol.sliders.rangeSlider('range-slider-b', 255, function(value) {
	
		    eVars._bChannel.value = value;
	
		    var RGB = new eCol.RGBobject(0,0,0);
		    RGB = {'r': eVars._rChannel.value, 'g': eVars._gChannel.value, 'b': eVars._bChannel.value };
	
		    // Update the input fields
		    eCol.update.RGB(RGB);
	
		    // Update the MAIN swatch
		    eVars._yourswatch.style.backgroundColor = eVars._hexColor.value;	    
	
		    // Update the swatch we have SELECTED
		    eCol.update.customColors();
		});			
	},
	
	initComplimentaryColors : function() {
		
		var _hex = colorTheme.css[5].value;		
			
		eCol.update.HEX(_hex);
	
		// Make 4 complimentary colors
		eCol.update.makeComplimentary(_hex);
		
	},
	initMatchingColors : function() {

//		var _hex = eVars._hexColor.value;
		var _hex = colorTheme.css[5].value;	
			
		HSV = new Object();
		RGB = new Object();
	
		eCol.convert.HEX2RGB(_hex, RGB);
		eCol.convert.RGB2HSV(RGB, HSV);
		
		// Finds matching colors
		eCol.cMatch.domatch(HSV);
		
		
		// Update the MATCHING colors in cArray
		
		// Match Color 1 GRADER
		eCol.update.colorGrade(matchingColor, 0, matchingColor[0][0].HSV);
	
		// Match Color 2 GRADER
		eCol.update.colorGrade(matchingColor, 1, matchingColor[1][0].HSV);
			
		// Match Color 3 GRADER
		eCol.update.colorGrade(matchingColor, 2, matchingColor[2][0].HSV);
				
		// Match Color 4 GRADER	
		eCol.update.colorGrade(matchingColor, 3, matchingColor[3][0].HSV);
			
		// Match Color 5 GRADER
		eCol.update.colorGrade(matchingColor, 4, matchingColor[4][0].HSV);
		
	},
	initDarkColors : function() {
		
		// These are all STATIC COLORS
		eCol.makeDarkColors(0,215);
		eCol.makeDarkColors(1,196);
		eCol.makeDarkColors(2,319);
		eCol.makeDarkColors(3,354);
		eCol.makeDarkColors(4,22);
		
			
		// Make a neutral dark color!
		darkColor[5] = [];
		darkColor[5][0] = {};
		darkColor[5][0].HSV = {};
		darkColor[5][0].HSV.h = 100; 
		darkColor[5][0].HSV.s = 0; 
		darkColor[5][0].HSV.v = 10;
		darkColor[5][0].HEX = eCol.convert.HSV2HEX(100, 0, 10);	 
		darkColor[5][0].RGB = {};
		eCol.convert.HSV2RGB(darkColor[5][0].HSV, darkColor[5][0].RGB);
	
		darkColor[5][1] = {};	
		darkColor[5][1].HSV = {};
		darkColor[5][1].HSV.h = 100; 
		darkColor[5][1].HSV.s = 0; 
		darkColor[5][1].HSV.v = 20;
		darkColor[5][1].HEX = eCol.convert.HSV2HEX(100, 0, 20);	 
		darkColor[5][1].RGB = {};
		eCol.convert.HSV2RGB(darkColor[5][1].HSV, darkColor[5][1].RGB);
	
		darkColor[5][2] = {};	
		darkColor[5][2].HSV = {};
		darkColor[5][2].HSV.h = 100; 
		darkColor[5][2].HSV.s = 0; 
		darkColor[5][2].HSV.v = 70;
		darkColor[5][2].HEX = eCol.convert.HSV2HEX(100, 0, 70);	 
		darkColor[5][2].RGB = {};
		eCol.convert.HSV2RGB(darkColor[5][2].HSV, darkColor[5][2].RGB);
				
	},
	initLightColors : function() {
			
		eCol.makeLightColors(0,215);
		eCol.makeLightColors(1,196);
		eCol.makeLightColors(2,319);
		eCol.makeLightColors(3,76);
		eCol.makeLightColors(4,354);
		
		lightColor[5] = [];
		lightColor[5][0] = {};
		lightColor[5][0].HSV = {};
		lightColor[5][0].HSV.h = 22; 
		lightColor[5][0].HSV.s = 0; 
		lightColor[5][0].HSV.v = 70;
		lightColor[5][0].HEX = eCol.convert.HSV2HEX(22, 0, 70);	 
		lightColor[5][0].RGB = {};
		eCol.convert.HSV2RGB(lightColor[5][0].HSV, lightColor[5][0].RGB);
	
		lightColor[5][1] = {};	
		lightColor[5][1].HSV = {};
		lightColor[5][1].HSV.h = 22; 
		lightColor[5][1].HSV.s = 0; 
		lightColor[5][1].HSV.v = 93;
		lightColor[5][1].HEX = eCol.convert.HSV2HEX(22, 0, 93);	 
		lightColor[5][1].RGB = {};
		eCol.convert.HSV2RGB(lightColor[5][1].HSV, lightColor[5][1].RGB);
	
		lightColor[5][2] = {};	
		lightColor[5][2].HSV = {};
		lightColor[5][2].HSV.h = 22; 
		lightColor[5][2].HSV.s = 0; 
		lightColor[5][2].HSV.v = 25;
		lightColor[5][2].HEX = eCol.convert.HSV2HEX(22, 0, 25);	 
		lightColor[5][2].RGB = {};
		eCol.convert.HSV2RGB(lightColor[5][2].HSV, lightColor[5][2].RGB);
			
		
	},
	initBrightColors : function() {
		
		// Additional BRIGHT presets for links ... again, these are static colors
		brightColor[0] = [];
		brightColor[0][0] = {};		
		brightColor[0][0].HEX = '#FF00FF';
		brightColor[0][0].HSV = {};
		brightColor[0][0].HSV.h = 300;
		brightColor[0][0].HSV.s = 100;
		brightColor[0][0].HSV.v = 100;		
		brightColor[0][0].RGB = {};
		brightColor[0][0].RGB.r = 255;	
		brightColor[0][0].RGB.g = 0;	
		brightColor[0][0].RGB.b = 255;	
	
		
		brightColor[1] = [];
		brightColor[1][0] = {};	
		brightColor[1][0].HEX = '#FF00AA';
		brightColor[1][0].HSV = {};
		brightColor[1][0].HSV.h = 320;
		brightColor[1][0].HSV.s = 100;
		brightColor[1][0].HSV.v = 100;		
		brightColor[1][0].RGB = {};
		brightColor[1][0].RGB.r = 255;	
		brightColor[1][0].RGB.g = 0;	
		brightColor[1][0].RGB.b = 170;				
	
		brightColor[2] = [];
		brightColor[2][0] = {};	
		brightColor[2][0].HEX = '#FF0055';
		brightColor[2][0].HSV = {};
		brightColor[2][0].HSV.h = 340;
		brightColor[2][0].HSV.s = 100;
		brightColor[2][0].HSV.v = 100;		
		brightColor[2][0].RGB = {};
		brightColor[2][0].RGB.r = 255;	
		brightColor[2][0].RGB.g = 0;	
		brightColor[2][0].RGB.b = 85;				
			
		brightColor[3] = [];
		brightColor[3][0] = {};		
		brightColor[3][0].HEX = '#FF0000';
		brightColor[3][0].HSV = {};
		brightColor[3][0].HSV.h = 0;
		brightColor[3][0].HSV.s = 100;
		brightColor[3][0].HSV.v = 100;		
		brightColor[3][0].RGB = {};
		brightColor[3][0].RGB.r = 255;	
		brightColor[3][0].RGB.g = 0;	
		brightColor[3][0].RGB.b = 0;
		
		brightColor[4] = [];
		brightColor[4][0] = {};	
		brightColor[4][0].HEX = '#FF5400';
		brightColor[4][0].HSV = {};
		brightColor[4][0].HSV.h = 20;
		brightColor[4][0].HSV.s = 100;
		brightColor[4][0].HSV.v = 100;		
		brightColor[4][0].RGB = {};
		brightColor[4][0].RGB.r = 255;	
		brightColor[4][0].RGB.g = 84;	
		brightColor[4][0].RGB.b = 0;
		
		brightColor[5] = [];
		brightColor[5][0] = {};	
		brightColor[5][0].HEX = '#FF9400';
		brightColor[5][0].HSV = {};
		brightColor[5][0].HSV.h = 35;
		brightColor[5][0].HSV.s = 100;
		brightColor[5][0].HSV.v = 100;		
		brightColor[5][0].RGB = {};
		brightColor[5][0].RGB.r = 255;	
		brightColor[5][0].RGB.g = 148;	
		brightColor[5][0].RGB.b = 0;	
	
		brightColor[6] = [];
		brightColor[6][0] = {};	
		brightColor[6][0].HEX = '#FFD400';
		brightColor[6][0].HSV = {};
		brightColor[6][0].HSV.h = 50;
		brightColor[6][0].HSV.s = 100;
		brightColor[6][0].HSV.v = 100;		
		brightColor[6][0].RGB = {};
		brightColor[6][0].RGB.r = 255;	
		brightColor[6][0].RGB.g = 212;	
		brightColor[6][0].RGB.b = 0;	
		
		brightColor[7] = [];
		brightColor[7][0] = {};	
		brightColor[7][0].HEX = '#FFFF00';
		brightColor[7][0].HSV = {};
		brightColor[7][0].HSV.h = 60;
		brightColor[7][0].HSV.s = 100;
		brightColor[7][0].HSV.v = 100;		
		brightColor[7][0].RGB = {};
		brightColor[7][0].RGB.r = 255;	
		brightColor[7][0].RGB.g = 255;	
		brightColor[7][0].RGB.b = 0;
	
		brightColor[8] = [];
		brightColor[8][0] = {};	
		brightColor[8][0].HEX = '#00FFD4';
		brightColor[8][0].HSV = {};
		brightColor[8][0].HSV.h = 170;
		brightColor[8][0].HSV.s = 100;
		brightColor[8][0].HSV.v = 100;		
		brightColor[8][0].RGB = {};
		brightColor[8][0].RGB.r = 0;	
		brightColor[8][0].RGB.g = 255;	
		brightColor[8][0].RGB.b = 212;	
	
		brightColor[9] = [];
		brightColor[9][0] = {};	
		brightColor[9][0].HEX = '#00FFFF';
		brightColor[9][0].HSV = {};
		brightColor[9][0].HSV.h = 180;
		brightColor[9][0].HSV.s = 100;
		brightColor[9][0].HSV.v = 100;		
		brightColor[9][0].RGB = {};
		brightColor[9][0].RGB.r = 0;	
		brightColor[9][0].RGB.g = 255;	
		brightColor[9][0].RGB.b = 255;				
	
		brightColor[10] = [];
		brightColor[10][0] = {};	
		brightColor[10][0].HEX = '#54FF00';
		brightColor[10][0].HSV = {};
		brightColor[10][0].HSV.h = 100;
		brightColor[10][0].HSV.s = 100;
		brightColor[10][0].HSV.v = 100;		
		brightColor[10][0].RGB = {};
		brightColor[10][0].RGB.r = 85;	
		brightColor[10][0].RGB.g = 255;	
		brightColor[10][0].RGB.b = 0;
				
	}
}
	
	function initInputFields() {

		// HEX
		eVars._hexColor = Wu.DomUtil.get('hexColor');
	
		// RGB
		eVars._rChannel = Wu.DomUtil.get('rChannel');
		eVars._gChannel = Wu.DomUtil.get('gChannel');
		eVars._bChannel = Wu.DomUtil.get('bChannel');
		
		// HSV
		eVars._hChannel = Wu.DomUtil.get('hChannel');
		eVars._sChannel = Wu.DomUtil.get('sChannel');
		eVars._vChannel = Wu.DomUtil.get('vChannel');


		// CLICK TRIGGERS
				
		eVars._hexColor.onblur = function() {
			eCol.update.HEX(eVars._hexColor.value);
			eCol.update.inputFields('HEX');
		}
	
		eVars._rChannel.onblur = function() {
			eCol.update.RGB(RGB);
			eCol.update.inputFields('RGB');
		}
	
		eVars._gChannel.onblur = function() {
			eCol.update.RGB(RGB);
			eCol.update.inputFields('RGB');
		}
	
		eVars._bChannel.onblur = function() {
			eCol.update.RGB(RGB);
			eCol.update.inputFields('RGB');
		}
	
		eVars._hChannel.onblur = function() {
			eCol.update.HSV(HSV);
			eCol.update.inputFields('HSV');
		}
	
		eVars._sChannel.onblur = function() {
			eCol.update.HSV(HSV);
			eCol.update.inputFields('HSV');
		}
		
		eVars._vChannel.onblur = function() {
			eCol.update.HSV(HSV);
			eCol.update.inputFields('HSV');
		}	
		
	};
	
	// These are the template swatches...
	function updateTempSwatches() {
	
	// CHANGING COLORS
	// CHANGING COLORS
	// CHANGING COLORS
			
	// Complimentary Colors
	tempCSS.complimentary = [];
	tempCSS.complimentary[0] = '#complimentary_swatch_0 { background-color: ' + complimentaryColor[0][0].HEX + ' !important }';
	tempCSS.complimentary[1] = '#complimentary_swatch_1 { background-color: ' + complimentaryColor[1][0].HEX + ' !important }';
	tempCSS.complimentary[2] = '#complimentary_swatch_2 { background-color: ' + complimentaryColor[2][0].HEX + ' !important }';
	tempCSS.complimentary[3] = '#complimentary_swatch_3 { background-color: ' + complimentaryColor[3][0].HEX + ' !important }';

	// Complimentary Colors
	tempCSS.matching = [];
	tempCSS.matching[0] = '#matching_swatch_0 { background-color: ' + matchingColor[0][0].HEX + ' !important }';
	tempCSS.matching[1] = '#matching_swatch_1 { background-color: ' + matchingColor[1][0].HEX + ' !important }';
	tempCSS.matching[2] = '#matching_swatch_2 { background-color: ' + matchingColor[2][0].HEX + ' !important }';
	tempCSS.matching[3] = '#matching_swatch_3 { background-color: ' + matchingColor[3][0].HEX + ' !important }';
	tempCSS.matching[4] = '#matching_swatch_4 { background-color: ' + matchingColor[4][0].HEX + ' !important }';

	
	
	// STATIC COLORS	
	// STATIC COLORS	
	// STATIC COLORS	
	
	// Dark Colors
	tempCSS.dark = [];
	tempCSS.dark[0] = '#dark_swatch_0 { background-color: ' + darkColor[0][0].HEX + ' !important }';
	tempCSS.dark[1] = '#dark_swatch_1 { background-color: ' + darkColor[1][0].HEX + ' !important }';
	tempCSS.dark[2] = '#dark_swatch_2 { background-color: ' + darkColor[2][0].HEX + ' !important }';
	tempCSS.dark[3] = '#dark_swatch_3 { background-color: ' + darkColor[3][0].HEX + ' !important }';
	tempCSS.dark[4] = '#dark_swatch_4 { background-color: ' + darkColor[4][0].HEX + ' !important }';
	tempCSS.dark[5] = '#dark_swatch_5 { background-color: ' + darkColor[5][0].HEX + ' !important }';

	// Light Colors
	tempCSS.light = [];
	tempCSS.light[0] = '#light_swatch_0 { background-color: ' + lightColor[0][0].HEX + ' !important }';
	tempCSS.light[1] = '#light_swatch_1 { background-color: ' + lightColor[1][0].HEX + ' !important }';
	tempCSS.light[2] = '#light_swatch_2 { background-color: ' + lightColor[2][0].HEX + ' !important }';
	tempCSS.light[3] = '#light_swatch_3 { background-color: ' + lightColor[3][0].HEX + ' !important }';
	tempCSS.light[4] = '#light_swatch_4 { background-color: ' + lightColor[4][0].HEX + ' !important }';
	tempCSS.light[5] = '#light_swatch_5 { background-color: ' + lightColor[5][0].HEX + ' !important }';
	
	// Bright Colors
	tempCSS.bright = [];
	tempCSS.bright[0] = '#bright_swatch_0 { background-color: ' + brightColor[0][0].HEX + ' !important }';
	tempCSS.bright[1] = '#bright_swatch_1 { background-color: ' + brightColor[1][0].HEX + ' !important }';
	tempCSS.bright[2] = '#bright_swatch_2 { background-color: ' + brightColor[2][0].HEX + ' !important }';
	tempCSS.bright[3] = '#bright_swatch_3 { background-color: ' + brightColor[3][0].HEX + ' !important }';
	tempCSS.bright[4] = '#bright_swatch_4 { background-color: ' + brightColor[4][0].HEX + ' !important }';
	tempCSS.bright[5] = '#bright_swatch_5 { background-color: ' + brightColor[5][0].HEX + ' !important }';
	tempCSS.bright[6] = '#bright_swatch_6 { background-color: ' + brightColor[6][0].HEX + ' !important }';
	tempCSS.bright[7] = '#bright_swatch_7 { background-color: ' + brightColor[7][0].HEX + ' !important }';
	tempCSS.bright[8] = '#bright_swatch_8 { background-color: ' + brightColor[8][0].HEX + ' !important }';
	tempCSS.bright[9] = '#bright_swatch_9 { background-color: ' + brightColor[9][0].HEX + ' !important }';
	tempCSS.bright[10] = '#bright_swatch_10 { background-color: ' + brightColor[10][0].HEX + ' !important }';	
	
	
	var tempCSSstring = '';
	tempCSSstring += tempCSS.dark.join(' ');
	tempCSSstring += tempCSS.light.join(' ');
	tempCSSstring += tempCSS.complimentary.join(' ');
	tempCSSstring += tempCSS.matching.join(' ');
	tempCSSstring += tempCSS.bright.join(' ');
	
	
	tempjcss.innerHTML = tempCSSstring;
}
	
	// *****************************************



	
	// *****************************************	
	
	// PASS COLORS WHEN CLICKING ON THE SWATCHES
	// PASS COLORS WHEN CLICKING ON THE SWATCHES
	// PASS COLORS WHEN CLICKING ON THE SWATCHES

	// *****************************************
	
	function passcolor(whatArray, arrn1) {

		if ( whatArray == 'light') colorTheme.cThemeDarkMenu = false;
		if ( whatArray == 'dark') colorTheme.cThemeDarkMenu = true;

		updateMenuLightDarkToggleButtons();

				
		// Changing the Menu Base Color
		if ( changingColors == 1 ) {

			// Changing the background color to LIGHT colors
			if ( whatArray == 'light' ) {	
			
				lightMenu(lightColor[arrn1][0].HEX);			

				// Update the HEX value in the HEX VALUE INPUT FIELD				
				eVars._hexColor.value = lightColor[arrn1][0].HEX;
			
			}		
		
			// Changing the background color to DARK colors			
			if ( whatArray == 'dark' ) {

				darkMenu(darkColor[arrn1][0].HEX);

				// Update the HEX value in the HEX VALUE INPUT FIELD
				eVars._hexColor.value = darkColor[arrn1][0].HEX;
			} 
			
		} 
		
		// Changing the Layer INACTIVE color
		if ( changingColors == 2 ) {		
		
			// Changing to a COMPLIMENTARY color
			if ( whatArray == 'complimentary' ) {		
				colorTheme.css[5].value = complimentaryColor[arrn1][0].HEX;
				colorTheme.css[6].value = complimentaryColor[arrn1][3].HEX;	
				colorTheme.css[7].value = complimentaryColor[arrn1][4].HEX;
				
				// Update the HEX value in the HEX VALUE INPUT FIELD				
				eVars._hexColor.value = complimentaryColor[arrn1][0].HEX;
			}

			// Canging to a MATCHING color
			if ( whatArray == 'matching' ) {
				colorTheme.css[5].value = matchingColor[arrn1][0].HEX;
				colorTheme.css[6].value = matchingColor[arrn1][2].HEX;	
				colorTheme.css[7].value = matchingColor[arrn1][4].HEX;

				// Update the HEX value in the HEX VALUE INPUT FIELD
				eVars._hexColor.value = matchingColor[arrn1][0].HEX;								
			}

		}

		// Changing the Layer ACTIVE color
		if ( changingColors == 3 ) {		


			// Changing to a COMPLIMENTARY color
			if ( whatArray == 'complimentary' ) {
				colorTheme.css[8].value = complimentaryColor[arrn1][0].HEX;
				colorTheme.css[9].value = complimentaryColor[arrn1][4].HEX;
				
				// Update the HEX value in the HEX VALUE INPUT FIELD				
				eVars._hexColor.value = complimentaryColor[arrn1][0].HEX;								
								
			}

			// Canging to a MATCHING color
			if ( whatArray == 'matching' ) {
				colorTheme.css[8].value = matchingColor[arrn1][0].HEX;
				colorTheme.css[9].value = matchingColor[arrn1][4].HEX;
				
				// Update the HEX value in the HEX VALUE INPUT FIELD				
				eVars._hexColor.value = matchingColor[arrn1][0].HEX;
							
			}
		}
				
		// Changing the LINK color
		if ( changingColors == 4 ) {		

			// To a BRIGHT color
			if ( whatArray == 'bright' ) {
				colorTheme.css[4].value = brightColor[arrn1][0].HEX;
				
				// Update the HEX value in the HEX VALUE INPUT FIELD
				eVars._hexColor.value = brightColor[arrn1][0].HEX;
			}
		}
		

		// Update the input fields, and the sliders...
		eCol.update.inputFields('HEX');

		// Set background color of MAIN swatch
		eVars._yourswatch.style.backgroundColor = eVars._hexColor.value;

		eCol.update.CSSstring();			
		jcss.innerHTML = cssstring;						

}
	
	// *****************************************

	
	
	
	// *****************************************	
	
	// 		DARK AND LIGHT MENU STYLERS
	// 		DARK AND LIGHT MENU STYLERS
	// 		DARK AND LIGHT MENU STYLERS

	// *****************************************	
		
	// Creates Styling for Dark Menu Options	
	function darkMenu(tempHEX) {

	var RGB = new Object;
	var HSV = new Object;			
	eCol.convert.HEX2RGB(tempHEX, RGB);
	eCol.convert.RGB2HSV(RGB, HSV);
	var h = HSV.h;
	
	var c1HEX = eCol.convert.HSV2HEX(h, 50, 12);	 
	var c2HEX = eCol.convert.HSV2HEX(h, 30, 25);	 		
	var c3HEX = eCol.convert.HSV2HEX(h, 15, 70);	 
		
	colorTheme.css[0].value = c1HEX;
	colorTheme.css[1].value = c2HEX;
	colorTheme.css[2].value = c3HEX;

	colorTheme.css[11].value = '#666';			
	colorTheme.css[12].value = '#FFF';						// Text on ONLY Inactive Layer – Level 2
	colorTheme.css[13].value = '#FFFFFF';					// Text color on Main Menu Shade 2 (Plus the white buttons, but that's not right...)

	colorTheme.css[17].value = '';							// Background color Boxes on sidepane (New client box, etc) .. rgba(255, 255, 255, 0.15)
	colorTheme.css[18].value = 'white';						// Bacground color Buttons

	// Transparent Table Row Colors
	colorTheme.css[19].value = ''; 							// The darkest background color in file list
	colorTheme.css[20].value = ''; 							// The lightest background color in file list

	colorTheme.css[22].value = '';
	colorTheme.css[23].value = ''; 							// The gray text that goes in the Menu (on top of color theme menu, buttons, etc)
	colorTheme.css[24].value = '';							// Search Fields
	colorTheme.css[25].value = '';							// Map Controls Buttons – Color 
	colorTheme.css[26].value = ''; 							// Map Controls Buttons – Background
	colorTheme.css[27].value = '';							// Map Controls Buttons – Font Weight
	colorTheme.css[28].value = '';							// General ~ Turn 100 font-weight to 200 (looks too slim on white)


	colorTheme.css[32].value = 'white';						// Active List Items BG
	colorTheme.css[33].value = 'black';						// Active List Items Color

	colorTheme.css[34].value = 'rgba(0,0,0,0.4)';			// SEARCH FIELD
	
}; 					

	
	// Creates Styling for Light Menu Options
	function lightMenu(tempHEX) {
	
	var RGB = new Object;
	var HSV = new Object;			
	eCol.convert.HEX2RGB(tempHEX, RGB);
	eCol.convert.RGB2HSV(RGB, HSV);
	var h = HSV.h;
	
	// Make light colors
	var c1HEX = eCol.convert.HSV2HEX(h, 15, 80);	 
	var c2HEX = eCol.convert.HSV2HEX(h, 1, 99);	 		
	var c3HEX = eCol.convert.HSV2HEX(h, 30, 25);
	
	// Make see through light colors
	var RGB = {};
	eCol.convert.HEX2RGB(c1HEX, RGB);
	var rgba_50 = 'rgba(' + RGB.r + ',' + RGB.g + ',' + RGB.b + ',0.5)';
	var rgba_25 = 'rgba(' + RGB.r + ',' + RGB.g + ',' + RGB.b + ',0.25)';
	
	

	// MAKE COMPLIMENTARY COLOR
				
	var hstep = h + 150;
		
	if ( hstep > 360 ) {
		hstep = hstep - 360;
	}
	
	var _complimentary = eCol.convert.HSV2HEX(hstep, 20, 60);	
	
	
	
	



	colorTheme.css[0].value = c1HEX;
	colorTheme.css[1].value = c2HEX;
	colorTheme.css[2].value = c3HEX;

	colorTheme.css[11].value = '#FFFFFF';
	colorTheme.css[12].value = '#FFFFFF';					// Text on ONLY Inactive Layer – Level 2

	colorTheme.css[13].value = '#666';						// Text color on Main Menu Shade 2 (Plus the white buttons, but that's not right...)
	
	colorTheme.css[17].value = rgba_50;						// Bacground color Buttons			
	colorTheme.css[18].value = c1HEX;						// Background color Boxes on sidepane (New client box, etc)

	// Transparent Table Row Colors
	colorTheme.css[19].value = rgba_50; 					// The darkest background color in file list
	colorTheme.css[20].value = rgba_25; 					// The lightest background color in file list

	colorTheme.css[22].value = 'transparent';
	colorTheme.css[23].value = '#666'; 						// The gray text that goes in the Menu (on top of color theme menu, buttons, etc)
	colorTheme.css[24].value = 'white';						// Search Fields
	colorTheme.css[25].value = 'rgba(0, 0, 0, 0.5)';		// Map Controls Buttons – Color 
	colorTheme.css[26].value = 'rgba(0, 0, 0, 0.1)'; 		// Map Controls Buttons – Background
	colorTheme.css[27].value = '600';						// Map Controls Buttons – Font Weight
	colorTheme.css[28].value = '200';						// General ~ Turn 100 font-weight to 200 (looks too slim on white)


	//cxxxx 
	colorTheme.css[32].value = _complimentary;				// Active List Items BG
	colorTheme.css[33].value = 'white';						// Active List Items Color
	
	colorTheme.css[34].value = 'rgba(0,0,0,0.6)';			// SEARCH FIELD	

	
};					


// *****************************************




	// Updates the Toggle between dark and light menu options
	function updateMenuLightDarkToggleButtons() {

	if ( !colorTheme.cThemeDarkMenu ) {
		Wu.DomUtil.addClass(eVars._tickMenuLight, 'active-toggle');
		Wu.DomUtil.removeClass(eVars._tickMenuDark, 'active-toggle');							
	} else {
		Wu.DomUtil.addClass(eVars._tickMenuDark, 'active-toggle');	
		Wu.DomUtil.removeClass(eVars._tickMenuLight, 'active-toggle');					
	}

};	


}





// *****************************************
// *****************************************
// *****************************************
// *****************************************
// *****************************************


var menuList = [];

function layer_menu_j() {

	var listcounter = 0;
	
	var list = Wu.DomUtil.get('layer-menu-inner-content');
	var inner_list = list.getElementsByTagName('div');

	// Go thorough the divs
	for ( var i=0; i<inner_list.length;i++) {

		var layer_classes = inner_list[i].classList;
		
		// Go through the classes in the div
		for ( var p = 0; p<layer_classes.length; p++) {
			
			// Find all Div's with LEVEL-XXX
			if ( layer_classes[p].indexOf("level-")==0 ) {
				
				menuList[listcounter] = {};
				menuList[listcounter].level = layer_classes[p];	
				menuList[listcounter].el = inner_list[i];
				menuList[listcounter].el.no = parseInt(listcounter)+1;
				menuList[listcounter].open = false;
				listcounter++;

			}
		} // end of p loop
	} // end of i loop


	// Add to array if it's a menufolder or not
	for ( var i = 0; i<menuList.length;i++ ) {
		if ( Wu.DomUtil.hasClass(menuList[i].el, 'menufolder') ) {
			menuList[i].folder = true;
		} else {
			menuList[i].folder = false;			
		}
	}

	// Register Children AND Clicks...
	var tempMenu = false;
	for ( var i = 0; i<menuList.length;i++ ) {

		// It's a folder
		if ( menuList[i].folder ) {
			
			tempMenu = menuList[i];
			menuList[i].subLayers = [];
			menuList[i].subFolders = [];
			menuList[i].attached = false;


			// Check it's a sub folder... 
			if ( menuList[i].level != 'level-0' ) {

				// Find nearest parent folder...
				for ( var f=0;f<menuList.length;f++ ) { // Go through all the Elements in menuList

					if ( menuList[f].folder ) { // If it's a folder

						var lastChar = parseInt(menuList[i].level.charAt(menuList[i].level.length-1));
						var matchThis = 'level-'+(lastChar-1);

						// Find ONE level up
						if ( menuList[f].level == matchThis) {  // This one adds it to ALL layers up...
															
							// Which menufolder is it attached to...
							// This overwrites previous entry,
							// so that we always land on the LAST
							// folder it's attached to!

							// Adding one too many, so that we don't end up with 0, which is false...
							menuList[i].attached = f+1; 
						}
					}
				}
			}

			// Attach SUBFOLDERS as children to folder...
			if ( menuList[i].attached-1 >= 0 ) {
				menuList[menuList[i].attached-1].subFolders.push(menuList[i]);	
			}

		// If the folder has direct layers as children
		// Stack Children LAYERS in Array
		} else {
			tempMenu.subLayers.push(menuList[i]);
		}
	
		// Register Click Event
		menuList[i].el.onclick = function() {
			menuFolderSelected(menuList[this.no-1]);
		}
	}
}



// Open and collapse on click, yo
function menuFolderSelected(selectWhat) {

	// Close/open LAST level > aka. the folder with LAYERS
	if ( selectWhat.subLayers ) {
		if ( selectWhat.subLayers.length >= 1 ) {
			if ( selectWhat.open ) {
				selectWhat.open = false;
			} else {
				selectWhat.open = true;
			}
			layerCollapser(selectWhat, selectWhat.open);
		}
	}

	// Close/open FOLDERS!
	if ( selectWhat.subFolders ) {
		if ( selectWhat.subFolders.length >= 1 ) {
			
			if ( selectWhat.open ) {
				selectWhat.open = false;
			} else {
				selectWhat.open = true;
			}
			collapse_folders(selectWhat, selectWhat.open);
		}
	}
}
	

function collapse_folders(selectWhat, bol) {

	var collapseFromThisFolder = selectWhat.subFolders;

	for ( var g=0; g<collapseFromThisFolder.length;g++ ) {

		// Collapsing folder

		if ( !bol ) { // Open

			collapseFromThisFolder[g].open = true;
			Wu.DomUtil.removeClass(collapseFromThisFolder[g].el, 'layer-closed');

		} else {  // Close

			collapseFromThisFolder[g].open = false;
			Wu.DomUtil.addClass(collapseFromThisFolder[g].el, 'layer-closed');
			layerCollapser(collapseFromThisFolder[g], true);

			// IF THERE IS SUBFOLDERS, run internal loop
			if ( collapseFromThisFolder[g].subFolders.length >= 1 ) {
				collapseFromThisFolder[g].open = bol;
				collapse_folders(collapseFromThisFolder[g], bol);
			}
		}
	}	
}




function layerCollapser(selectWhat, bol) {
	var collapseFromThisFolder = selectWhat.subLayers;
	for ( var g=0;g<collapseFromThisFolder.length;g++) {	
		var collapseThisElement = collapseFromThisFolder[g].el;
		if ( !bol ) {			
			collapseFromThisFolder[g].open = false;
			Wu.DomUtil.removeClass(collapseThisElement, 'layer-closed');
		} else {
			collapseFromThisFolder[g].open = true;
			Wu.DomUtil.addClass(collapseThisElement, 'layer-closed');
		}
	}
}

