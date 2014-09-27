var jcss, tempjcss; // The tag in the head where the CSS gets injected

var draggingSlider = false; // If we are dragging, and what bar is being dragged
var haschanged = false; // If individual colors has been changed or not (for overriding feedback purposes)
var changingColors = false; // For editing mode (To know if we're editing 'c1', 'c2', etc... )
var darktheme = true; // Toggle between dark and light theme
var basecolor;
// var matchBlend = []; // For color matching
var RGB, HSV;


var css = []; // The CSS array
var tempCSS = {}; // The CSS array

var cssstring = ''; // The CSS string


var cArray = [],

	lightColor = [],	// Static colors
	darkColor = [],		// Static colors
	brightColor = [],	// Static colors
	
	complimentaryColor = [],
	
	matchingColor = [];



var eVars = {};

var header = document.getElementsByTagName('head')[0];

	jcss = document.createElement('style');
	jcss.setAttribute('type', 'text/css');
	jcss.setAttribute('rel', 'stylesheet');	
	header.appendChild(jcss);

	tempjcss = document.createElement('style');
	tempjcss.setAttribute('type', 'text/css');
	tempjcss.setAttribute('rel', 'stylesheet');	
	header.appendChild(tempjcss);


		
// Colors comes in pairs: color and background-color
// All colors comes with !important statement

var eCol = {

	// GENERAL
	// GENERAL

	// Cross-browser function to return the object with the specific id
	getObjectByID : function (id) {
		if (document.all) { // IE
		return document.all[id];
		} else { // Mozilla and others
		return document.getElementById(id);
		}
	}, // OK
	
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
	}, // OK
	
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
	}, // OK
	
	
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
		}, // OK
		
		// Hex to decimals (only 2 digits)
		decimalize : function (hexNumber) {
			var digits = '0123456789ABCDEF';
			return ((digits.indexOf(hexNumber.charAt(0).toUpperCase()) * 16) + digits.indexOf(hexNumber.charAt(1).toUpperCase()));		
		}, // OK
		
		// HEX to RGB
		HEX2RGB : function (colorString, RGB) {
			
			RGB.r = this.decimalize(colorString.substring(1,3));
			RGB.g = this.decimalize(colorString.substring(3,5));
			RGB.b = this.decimalize(colorString.substring(5,7));		
		}, // OK
		
		// RGB to HEX
		RGB2HEX : function (RGB) {
			return "#" + this.hexify(RGB.r) + this.hexify(RGB.g) + this.hexify(RGB.b);		
		}, // OK
		
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
		}, // OK
		
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
		}, // OK
		
		// HSV to HEX
		HSV2HEX : function (_hval, _sval, _vval) {
			var RGB = new eCol.RGBobject();
			var HSV = new eCol.HSVobject(_hval, _sval, _vval);	
			HSV.validate();
			this.HSV2RGB (HSV, RGB);
			var _nHEX = this.RGB2HEX(RGB);
			return(_nHEX);				
		} // OK
		
	}, // OK


	// UPDATERS
	// UPDATERS
	
	update : {

		// Creates a string from the CSS array	
		CSSstring : function () {
			cssstring = '';
			for (var i = 0; i<css.length;i++) {		
				cssstring += css[i].classes.join() + ' { ' + css[i].pre + ': ' + css[i].value + ' !important } ';
			}					
		}, // OK
		
		// Updates the CSS array from cArray
		cArray2CSS : function (updateThis) {
		
			if ( updateThis == 'c0' ) {
		
				css[1].value  = cArray['c0'][0].HEX; 	// BG: 	._color1bg, .ecolor1
				css[6].value  = cArray['c0'][2].HEX;	// ~ :	._color4, .ecolor1, .disabled
				css[3].value  = cArray['c0'][1].HEX; 	// BG:	._color2bg, .ecolor2
				css[22].value = cArray['c0'][2].HEX; 	// ~ :	._color12, .nocolor
				css[7].value  = cArray['c0'][2].HEX;	// BG: 	._color4bg, .ecolor4
				css[6].value  = cArray['c0'][2].HEX;	// ~ :	._color4, .ecolor1, .disabled				

			}
			if ( updateThis == 'c1' ) {
		
				css[13].value = tempArray['c1'][0].HEX;	// BG:	._color7bg, .color1
				css[15].value = tempArray['c1'][3].HEX; 	// BG:	._color8bg, .color2
				css[17].value = tempArray['c1'][4].HEX;	// BG:	._color9bg, .color3						

			}
			if ( updateThis == 'c2' ) {
		
				css[19].value = tempArray['c2'][0].HEX;	// BG:	._color10bg, .selected
				css[21].value = tempArray['c2'][4].HEX;	// BG:	._color11bg

			}
			if ( updateThis == 'c3' ) {
		
				css[4].value = tempArray['c3'][0].HEX;		// ~ :	._color3, .ecolor2, .activ a	

			}
			if ( updateThis == 'c4' ) {
		
				css[22].value = tempArray['c4'][0].HEX;	// ~ :	._color3, .ecolor2, .activ a			

			}

		}, // OOOBBSS!!!!

		// Creates 6 lighter colors from original HSV
		swatchBlend : function (thisArray, arrayNumber, HSV) {										
 			
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
				
				eCol.convert.HSV2RGB(HSV, RGB);
				var nhex = eCol.convert.RGB2HEX(RGB);
				

				// Update the array with all the colors
				thisArray[arrayNumber][a] = {};
				
				thisArray[arrayNumber][a].HEX = nhex;
				thisArray[arrayNumber][a].RGB = {'r': RGB.r, 'g': RGB.g, 'b': RGB.b };
				thisArray[arrayNumber][a].HSV = {'h': HSV.h, 's': HSV.s, 'v': HSV.v };			
			}				
		}, // OK
		
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
				this.swatchBlend(complimentaryColor, i, HSV);
			}
			
		}, // OBS!
		
		// Create 5 Matching colors
		matchColors : function() {
		
			// Set back RGB and HSV to BASE color value
			RGB = complimentaryColor[0][0].RGB;
			HSV = complimentaryColorf[0][0].HSV;			
		
			// Finds matching colors, and puts them in matchBlend[1] - matchBlend[5]
			// ... and updates the matching color swatches
			eCol.cMatch.domatch(HSV);

			
			// Update the MATCHING colors in cArray
			// Not sure if this is so smart... perhaps it would be better to keep the arrays separated
			
			// Match Color 1
			this.matShit(1,4);
					
			// Match Color 2
			this.matShit(2,5);		
		
			// Match Color 3
			this.matShit(3,6);		
			
			// Match Color 4	
			this.matShit(4,7);			
		
			// Match Color 5
			this.matShit(5,8);

		}, // OK
		
		// Function runs in matchColors() ~ Puts Matching colors in cArray...
		matShit : function(noA,noB) {
			
				// Get color MATCH, and convert it 
				eCol.convert.HEX2RGB(matchingColor[noA][0].HEX, RGB);
				eCol.convert.RGB2HSV(RGB, HSV);
				
				// (re)declare the color array no
				matchingColor[noB] = [];
				
				// Make lighter colors form value
				this.swatchBlend(matchingColor, noB, HSV);
				
			}, // OK
		
		// When there is a change in RGB (from slider only)
		RGB : function(RGB) {
			
			var HSV = new eCol.HSVobject(0,0,0);
				RGB.validate();
			
			eCol.RGB2HSV (RGB, HSV);
			
			eVars._hexColor.value = eCol.convert.RGB2HEX(RGB);
			eVars._rChannel.value = Math.round(RGB.r);
			eVars._gChannel.value = Math.round(RGB.g);
			eVars._bChannel.value = Math.round(RGB.b);
			eVars._hChannel.value = Math.round(HSV.h);
			eVars._sChannel.value = Math.round(HSV.s);
			eVars._vChannel.value = Math.round(HSV.v);
									
		}, // OK

		// When there is a change in HSV (from slider only)
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
					
		}, // OK

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
			
		}, // OK
		
		// When colors changes, update array, CSS string, and Inject CSS in <head>
		colChange : function (what) {
			
			var _hex;
			
			// Set some unique stuff for HEX
			if ( what == 'HEX' ) {
				
				RGB = new eCol.RGBobject(0,0,0);
				HSV = new eCol.HSVobject(0,0,0);
				
				_hex = eVars._hexColor.value;
								
				if ( changingColors ) {
					eCol.convert.HEX2RGB(_hex, RGB);
				}
				
			} else {
			
				_hex = eCol.convert.RGB2HEX(RGB);
			}

			// Change all the colors	
			if ( !changingColors ) {
			
				eCol.update.makeComplimentary(_hex);
				eCol.update.matchColors();
				
			} else {
				
				// Change the color we decided to change ;)
				this.changeThisColor(RGB, changingColors);
				
			}
			
			
			// Update sliders
			if ( what == 'HEX' && changingColors ) {
				eCol.sliders.updateAllSliders(RGB, HSV);		
			}
			
			// Update CSS string
			eCol.update.CSSstring();

			// Inject CSS in <head>
			jcss.innerHTML = cssstring;				
			
		}, // OK
		
			// Function runs in colChange()
			changeThisColor : function(RGB, changingColors) {
							
				// Convert
				eCol.convert.RGB2HSV(RGB, HSV);
				
				// Make 6 lighter colors down the array
				eCol.update.swatchBlend(complimentaryColor, changingColors, HSV);
				
				// Set the background color
				eVars._yourswatch.style.backgroundColor = complimentaryColor[changingColors][0].HEX;
		
				// Updates the CSS array
				eCol.update.cArray2CSS(changingColors);		

		} // OK
		
	}, // OK
	
		
	
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
			
		}, // OK
				
		rangeSlider : function (id, rrange, onDrag) {

		    var range = eCol.getObjectByID(id),
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
		        thus.updateDragger(e, dragger, rrange, down, rangeLeft, rangeWidth, draggerWidth);
		        return false;
		    });
		
		    document.addEventListener("mousemove", function(e) {
		        thus.updateDragger(e, dragger, rrange, down, rangeLeft, rangeWidth, draggerWidth);
		    });
		
		    document.addEventListener("mouseup", function() {
		        down = false;
				draggingSlider = false;                
		    });
					
		}, // OK
		
		updateDragger : function (e, dragger, rrange, down, rangeLeft, rangeWidth, draggerWidth) {				   
				           
		        if (down && e.pageX >= rangeLeft && e.pageX <= (rangeLeft + rangeWidth)) {
		   
		            dragger.style.left = e.pageX - rangeLeft - draggerWidth + 'px';
		            if (typeof onDrag == "function") this.onDrag(Math.round(((e.pageX - rangeLeft) / rangeWidth) * rrange));
		        }
			
		}, // OK
		
		slideupdater : function (id, updater, nrng, HSV, RGB) {
		
			// Updating one of the HSV sliders: update all the RGB sliders
			if ( draggingSlider == 'range-slider-1' || draggingSlider == 'range-slider-2' || draggingSlider == 'range-slider-3' ) {
		
				var rr = eCol.getObjectByID('range-slider-r').children[0];
				var rrrange = Math.floor(RGB.r*(205/255));
					rr.style.left = rrrange + 'px';
				
				var gg = eCol.getObjectByID('range-slider-g').children[0];
				var ggrange = Math.floor(RGB.g*(205/255));
					gg.style.left =ggrange + 'px';
					
				var bb = eCol.getObjectByID('range-slider-b').children[0];
				var bbrange = Math.floor(RGB.b*(205/255));
					bb.style.left = bbrange + 'px';		
			}
			
			
			// Updating one of the RGB sliders: update all the HSV sliders	
			if ( draggingSlider == 'range-slider-r' || draggingSlider == 'range-slider-g' || draggingSlider == 'range-slider-b' ) {
							
				var hh = eCol.getObjectByID('range-slider-1').children[0];
				var hhrange = Math.floor(HSV.h*(205/360));
					hh.style.left = hhrange + 'px';
				
				var ss = eCol.getObjectByID('range-slider-2').children[0];
				var ssrange = Math.floor(HSV.s*(205/100));
					ss.style.left = ssrange + 'px';
					
				var vv = eCol.getObjectByID('range-slider-3').children[0];
				var vvrange = Math.floor(HSV.v*(205/100));
					vv.style.left = vvrange + 'px';	
			
			}
		
		
		
		
		
		
			if ( !draggingSlider ) {
			
			    var range = eCol.getObjectByID(id),
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
		
		
			
		} // OBS
		
	},
	

	// COLOR MATCHER 
	// COLOR MATCHER
	
	// To DO – not use cArray for this...
	
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
			
		}, // OK
		
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
				
			
		}, // OK
		
		rc : function (x,m) {
		
			if(x>m){return m}
			if(x<0){return 0}else{return x}			
		
		} // OK
		
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
					if ( !changingColors ) {
					    if (confirm("This action will regenerate a color palette for you. By proceding all your changes will be lost!") == true) {
						   haschanged = false;

						   eCol.update.HEX(eVars._hexColor.value);
						   eCol.update.colChange('HEX');
					    }
					} else {
			
						imageData = ctxPix.getImageData(0,0,150,150);
						var barva='#'+thus.d2h(imageData.data[45300+0])+thus.d2h(imageData.data[45300+1])+thus.d2h(imageData.data[45300+2]);
						eVars._hexColor.value=barva;
						eCol.update.HEX(eVars._hexColor.value);
						eCol.update.colChange('HEX');
					}
				} else {
					
					imageData = ctxPix.getImageData(0,0,150,150);
					var barva='#'+thus.d2h(imageData.data[45300+0])+thus.d2h(imageData.data[45300+1])+thus.d2h(imageData.data[45300+2]);
					eVars._hexColor.value=barva;
					eCol.update.HEX(eVars._hexColor.value);
					eCol.update.colChange('HEX');
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
				  
			
		}, // OK

		drawPix : function (cPix, ctxPix, img, x, y) {

			ctxPix.clearRect(0, 0, cPix.width, cPix.height);
			if (x<5) x=5;
			if (y<5) y=5;
			if (x>imgWidth-4) x=imgWidth-4;
			if (y>imgHeight-4) y=imgHeight-4;
			ctxPix.drawImage(img,x-5,y-5,9,9,0,0,cPix.width,cPix.height);
			
		}, // OK

		getMousePos : function (canvas, evt) {
		
			var rect = canvas.getBoundingClientRect();
			return { x: evt.clientX - rect.left, y: evt.clientY - rect.top	};			
		
		}, // OK

		d2h : function (d) {
		
			return ("0"+d.toString(16)).slice(-2).toUpperCase();
		
		} // OK
		
	}, // OK
	
	
	// FINDS THE MOST DOMINANT COLOR IN THE PICTURE
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
				
	}
	
}	





// Set up the Array of Classes 
var	initClassArray = {
	
		// Start it all, yo
		go : function () {

			var theClassArray = [];			

			this.stackClasses(theClassArray);
			this.makeCSSelements(theClassArray);
			this.makeCSSel();
		},
			
		// These are the CSS classes that will get affected
		stackClasses : function (theClassArray) {
										
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
						
			},			
					
					
		makeCSSelements : function (theClassArray) {
			 
				this.makeCSSel(0, theClassArray[0].join(','), 'color', '');					
				this.makeCSSel(1, theClassArray[1].join(','), 'background-color', '');
				this.makeCSSel(2, theClassArray[2].join(','), 'color', '');
				this.makeCSSel(3, theClassArray[3].join(','), 'background-color', '');
				this.makeCSSel(4, theClassArray[4].join(','), 'color', '');
				this.makeCSSel(5, theClassArray[5].join(','), 'background-color', '');	
				this.makeCSSel(6, theClassArray[6].join(','), 'color', '');
				this.makeCSSel(7, theClassArray[7].join(','), 'background-color', '');	
				this.makeCSSel(8, theClassArray[8].join(','), 'color', '');
				this.makeCSSel(9, theClassArray[9].join(','), 'background-color', '');	
				this.makeCSSel(10, theClassArray[10].join(','), 'color', '');
				this.makeCSSel(11, theClassArray[11].join(','), 'background-color', '');	
				this.makeCSSel(12, theClassArray[12].join(','), 'color', '');
				this.makeCSSel(13, theClassArray[13].join(','), 'background-color', '');	
				this.makeCSSel(14, theClassArray[14].join(','), 'color', '');
				this.makeCSSel(15, theClassArray[15].join(','), 'background-color', '');	
				this.makeCSSel(16, theClassArray[16].join(','), 'color', '');
				this.makeCSSel(17, theClassArray[17].join(','), 'background-color', '');	
				this.makeCSSel(18, theClassArray[18].join(','), 'color', '');
				this.makeCSSel(19, theClassArray[19].join(','), 'background-color', '');	
				this.makeCSSel(20, theClassArray[20].join(','), 'color', '');
				this.makeCSSel(21, theClassArray[21].join(','), 'background-color', '');	
				this.makeCSSel(22, theClassArray[22].join(','), 'color', '');
				this.makeCSSel(23, theClassArray[23].join(','), 'background-color', '');
				this.makeCSSel(24, theClassArray[24].join(','), 'color', 'white');
				this.makeCSSel(25, theClassArray[25].join(','), 'color', 'black');
				this.makeCSSel(26, theClassArray[26].join(','), 'color', 'white');
				this.makeCSSel(27, theClassArray[27].join(','), 'background-color', '');
				this.makeCSSel(28, theClassArray[28].join(','), 'background-color', '');
				this.makeCSSel(29, theClassArray[29].join(','), 'color', '');
				this.makeCSSel(30, theClassArray[30].join(','), 'background-color', '');
				this.makeCSSel(31, theClassArray[31].join(','), 'background-color', '');
		
			}, 

		// Sets up the CSS elements in the Array			
		makeCSSel : function (va, classn, pre, val) {
				css[va] = {};
				css[va].classes = [];
				css[va].classes[0] = classn;
				css[va].pre = pre;
				css[va].value = val;					
			},
		
		initStyleArray : function () {



			// Picking up the color from the MAIN swatch
			var hVal = complimentaryColor[0][0].HSV.h;;
			
			// Make a really dark version of it
			var ec1HEX = eCol.convert.HSV2HEX(hVal, 50, 12);	
		
			// Make a quite dark version of it
			var ec2HEX = eCol.convert.HSV2HEX(hVal, 30, 25);	
		
			// Make a hyper bright version of it
			var ec3HEX = eCol.convert.HSV2HEX(complimentaryColor[2][3].HSV.h, 100, 100);	
			
			// Make a pale inactive color
			var ec4HEX = eCol.convert.HSV2HEX(hVal, 15, 70);	
			
			// Make a hyper bright version of it
			var ec5HEX = eCol.convert.HSV2HEX(complimentaryColor[3][0].HSV.h, 100, 100);
		
			// Make a hyper bright version of it
			var ec6HEX = eCol.convert.HSV2HEX(complimentaryColor[1][0].HSV.h, 75, 75);
			
			var color1 = complimentaryColor[0][0].HEX;
			var color2 = complimentaryColor[0][1].HEX; 
			var color3 = complimentaryColor[0][2].HEX;	
			var color4 = complimentaryColor[0][3].HEX;
			var color5 = complimentaryColor[0][4].HEX;
			var color6 = complimentaryColor[0][5].HEX; 
			
			var color7 = complimentaryColor[3][2].HEX;
			var color8 = complimentaryColor[3][4].HEX;	
			
			var darklink = complimentaryColor[2][0].HEX;
		
		
		
			// Making some more colors... 
			// First three colors on second row of "Matching Colors"
			matchingColor[0] = [];
			var HSV = {}
				HSV.h = hVal;
				HSV.s = 30;
				HSV.v = 25;
			eCol.update.swatchBlend(matchingColor, 0, HSV);
		
			matchingColor[1] = [];
			var HSV = {}
				HSV.h = complimentaryColor[1][0].HSV.h;
				HSV.s = 75;
				HSV.v = 75;
			eCol.update.swatchBlend(matchingColor, 1, HSV);
		
			matchingColor[2] = [];
			var HSV = {}
				HSV.h = complimentaryColor[2][3].HSV.h;
				HSV.s = 100;
				HSV.v = 100;
			eCol.update.swatchBlend(matchingColor, 2, HSV);
			
			
		
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
		}
					 
	}
	
initClassArray.go();


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
		eCol.convert.HEX2RGB ('#ADC3CC', RGB);			
		var HSV = {};
		eCol.convert.RGB2HSV (RGB, HSV);			
		var newhex = eCol.convert.HSV2HEX(HSV.h, 3, 98);

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
		eCol.convert.HEX2RGB (preval_1, RGB);
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
		eCol.convert.HEX2RGB ('#CCBFAD', RGB);			
		var HSV = {};
		eCol.convert.RGB2HSV (RGB, HSV);			
		var newhex = eCol.convert.HSV2HEX(HSV.h, 3, 98);

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
		eCol.convert.HEX2RGB (preval_1, RGB);
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
		eCol.convert.HEX2RGB ('#BCBCBC', RGB);			
		var HSV = {};
		eCol.convert.RGB2HSV (RGB, HSV);			
		var newhex = eCol.convert.HSV2HEX(HSV.h, 0, 98);
	
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
		eCol.convert.HEX2RGB (preval_1, RGB);
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

	eVars._hexColor.value = preval_13;

	// Calculate less....

	var RGB = {};
	eCol.convert.HEX2RGB (preval_1, RGB);
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
		
		
	eCol.update.CSSstring();
	
	if ( theme == 'light1' || theme == 'light2' || theme == 'light3' ) { 
		cssstring += ' ' + extras;
	}
	
	jcss.innerHTML = cssstring;

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
	var ec1HEX = eCol.convert.HSV2HEX(hVal, 50, 12);	

	// Make a quite dark version of it
	var ec2HEX = eCol.convert.HSV2HEX(hVal, 30, 25);	

	// Make a hyper bright version of it
	var ec3HEX = eCol.convert.HSV2HEX(cArray[2][3].HSV.h, 100, 100);	
	
	// Make a pale inactive color
	var ec4HEX = eCol.convert.HSV2HEX(hVal, 15, 70);	
	
	// Make a hyper bright version of it
	var ec5HEX = eCol.convert.HSV2HEX(cArray[4][0].HSV.h, 100, 100);

	// Make a hyper bright version of it
	var ec6HEX = eCol.convert.HSV2HEX(cArray[1][0].HSV.h, 75, 75);
	
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
	eCol.update.swatchBlend(9, HSV);

	cArray[10] = [];
	var HSV = {}
		HSV.h = cArray[1][0].HSV.h;
		HSV.s = 75;
		HSV.v = 75;
	eCol.update.swatchBlend(10, HSV);

	cArray[11] = [];
	var HSV = {}
		HSV.h = cArray[2][3].HSV.h;
		HSV.s = 100;
		HSV.v = 100;
	eCol.update.swatchBlend(11, HSV);
	
	

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




}









// cxxxxx
// PASS COLORS WHEN CLICKING ON THE SWATCHES
// PASS COLORS WHEN CLICKING ON THE SWATCHES
// PASS COLORS WHEN CLICKING ON THE SWATCHES
function passcolor(whatArray, arrn1) {

	if ( whatArray == 'light' ) {
		
		console.log('change light swatch no', arrn1);
		console.log(lightColor[arrn1][0].HEX);		
				
	} 
	
	if ( whatArray == 'dark' ) {
		
		console.log('change dark swatch no', arrn1);
		console.log(darkColor[arrn1][0].HEX);		
		
		
	} 
		


	if ( whatArray == 'bright' ) {
		
		console.log('change BRIGHT swatch no', arrn1);
		console.log(brightColor[arrn1][0].HEX);		
		
	} 		
	
	
	if ( whatArray == 'complimentary' ) {
		
		console.log('change complimentary swatch no', arrn1);
		console.log(complimentaryColor[arrn1][0].HEX);		
		
	}
	
	
	
	if ( whatArray == 'matching' ) {
		
		console.log('change matching swatch no', arrn1);		
		console.log(matchingColor[arrn1][0].HEX);		
		
	}
			
/*
	
		// Define dark/light theme based on selection
		if ( arrn1 <= 28 && arrn1 >= 23 ) {
			darktheme = true;
		}
	
		if ( arrn1 >= 29 && arrn1 <= 34 ) {
			darktheme = false;
		}
	
		// Changing base color + light/dark theme	
		if ( changingColors == 1 ) {
	
			cArray['c0'] = cArray[arrn1];
	
			// Updates the CSS array
			eCol.update.cArray2CSS('c0');
			
			if ( darktheme ) {
				css[26].value = 'white'; // .editor-wrapper, .editor-wrapper h3, .editor-wrapper h4
			} else {
				css[26].value = 'black'; // .editor-wrapper, .editor-wrapper h3, .editor-wrapper h4
			}		
			
			// Update the color blender/selector/values		
			eVars._hexColor.value = cArray['c0'][0].HEX;	
				
		}
		
		// Menu color
		if ( changingColors == 2 ) {
			tempArray['c1'] = cArray[arrn1];
			
			// Updates the CSS array		
			eCol.update.cArray2CSS('c1');
	
			// Update the color blender/selector/values		
			eVars._hexColor.value = tempArray['c1'][0].HEX;		
			eCol.update.HEX(eVars._hexColor.value);
			eCol.update.colChange('HEX');		
		}
		
		
	
		// Active/selected color
		if ( changingColors == 3 ) {
			tempArray['c2'] = cArray[arrn1];
	
			// Updates the CSS array
			eCol.update.cArray2CSS('c2');
			
			// Update the color blender/selector/values
			eVars._hexColor.value = tempArray['c2'][0].HEX;		
			eCol.update.HEX(eVars._hexColor.value);
			eCol.update.colChange('HEX');
		}
	
		// Link color / dark background
		if ( changingColors == 4 ) {
			tempArray['c3'] = cArray[arrn1];
	
			// Updates the CSS array
			eCol.update.cArray2CSS('c3');
	
			// Update the color blender/selector/values
			eVars._hexColor.value = tempArray['c3'][0].HEX;		
			eCol.update.HEX(eVars._hexColor.value);
			eCol.update.colChange('HEX');
		}	
	
		// Link color / light background
		if ( changingColors == 5 ) {
			tempArray['c4'] = cArray[arrn1];		
	
			// Updates the CSS array
			eCol.update.cArray2CSS('c4');		
			
			// Update the color blender/selector/values
			eVars._hexColor.value = tempArray['c4'][0].HEX;		
			eCol.update.HEX(eVars._hexColor.value);
			eCol.update.colChange('HEX');		
		}	
	
		// Merge array and write CSS in <head>
		eCol.update.CSSstring();
		jcss.innerHTML = cssstring;	
				
	}
*/

}




// ONLOAD
// ONLOAD
// ONLOAD

function startColorThemes() {

	initInputFields();

	// BASIC
	// Chose between preset color themes
	
	// DARK COLOR THEMES
	eVars._dark1 = eCol.getObjectByID('colortheme-dark1');
	eVars._dark2 = eCol.getObjectByID('colortheme-dark2');
	eVars._dark3 = eCol.getObjectByID('colortheme-dark3');

	eVars._dark1.onclick = function() {prethemes('dark1');}
	eVars._dark2.onclick = function() {prethemes('dark2');}
	eVars._dark3.onclick = function() {prethemes('dark3');}


	// LIGHT COLOR THEMES
	eVars._light1 = eCol.getObjectByID('colortheme-light1');
	eVars._light2 = eCol.getObjectByID('colortheme-light2');
	eVars._light3 = eCol.getObjectByID('colortheme-light3');					

	eVars._light1.onclick = function() {prethemes('light1');}
	eVars._light2.onclick = function() {prethemes('light2');}
	eVars._light3.onclick = function() {prethemes('light3');}
	
	
	
	// Get the wrappers
	eVars._color_Inner_wrapper = eCol.getObjectByID('project-color-theme').parentNode;
	eVars._color_Outer_wrapper = eCol.getObjectByID('project-color-theme').parentNode.parentNode;
	
	// Get the cancel button
	eVars._cancelColors = eCol.getObjectByID('cancel-colors-editor');
	
	// Bring in the BASIC color theme part
	eVars._color_Inner_wrapper.style.left = '-310px';
	
	// Set the height of the outer wrapper
	eVars._color_Outer_wrapper.style.height = '190px';		


	// Get the ADVANCED color theme button
	eVars._advanced = eCol.getObjectByID('advanced-theme-selector');	


	eVars._advanced.onclick = function() {
		initAdvancedColorThemes();		
	}

	eVars._cancelColors.onclick = function() {
		eVars._color_Inner_wrapper.style.left = '0px';
		eVars._color_Outer_wrapper.style.height = '231px';
	}

}




function initAdvancedColorThemes() {

	// For CSS animating height of container
	var pheight1 = '410px';
	var pheight2 = '517px';


	// Slide in the ADVANCED options
	eVars._color_Inner_wrapper.style.left = '-580px';		
	eVars._color_Outer_wrapper.style.height = pheight1;
	

	// Collect some DIV's
	eVars._b2basic = eCol.getObjectByID('back-to-basic');
	eVars._yourswatch = eCol.getObjectByID('yourswatch');	
	eVars._myCanvas = eCol.getObjectByID("myCanvas");
	eVars._pixCanvas = eCol.getObjectByID("pixCanvas");
	eVars._canvimg = eCol.getObjectByID("canvimg");
	
	
	// Set background color of MAIN swatch
	eVars._yourswatch.style.backgroundColor = basecolor;	
	
	// Back to BASIC mode
	eVars._b2basic.onclick = function() {
		eVars._color_Inner_wrapper.style.left = '-310px';
		eVars._color_Outer_wrapper.style.height = '190px';				
	}

	
	// INIT SLIDERS				
	initSliders();



	// Find the right image to use for the color picker...
	// OBS! Image must be stored locally (same url as server) for it to work...
	var uggid = eCol.getObjectByID('project-color-theme').parentNode.getAttribute('uuid');
	var ulist =	eCol.getObjectByID('editor-projects-container');
		ulist = ulist.getElementsByTagName('div');
		
	// Find the Image
	for ( var ui=0; ui<ulist.length; ui++ ) {
			if ( ulist[ui].className == 'editor-projects-item active' || ulist[ui].className == 'editor-projects-item' ) {
				var eluid = ulist[ui].getAttribute('uuid');
				if ( eluid == uggid ) {
					eVars._canvimg = ulist[ui].getElementsByTagName('img')[0];
					break;
				}
			}
		} // end


	// Color picker
	eCol.cPicker.img2canvas();
		

	// INIT CHANGING COLORS
	initComplimentaryColors();
	initMatchingColors();
	
	// INIT STATIC COLORS
	initDarkColors();
	initLightColors();
	initBrightColors();	

	updateTempSwatches();

	// GO INTO COLOR EDITING MODE

	eVars._coloption1 = eCol.getObjectByID('coloption1');
	eVars._coloption2 = eCol.getObjectByID('coloption2');
	eVars._coloption3 = eCol.getObjectByID('coloption3');	
	
	eVars._yourcolLink1 = eCol.getObjectByID('yourcol_link1');
	eVars._yourcolLink2 = eCol.getObjectByID('yourcol_link2');	
	
	eVars._normalSwatches = eCol.getObjectByID('normal-swatches');
	eVars._darkSwatches = eCol.getObjectByID('dark-swatches');
	eVars._linkSwatches = eCol.getObjectByID('link-swatches');
	eVars._colorSuggestions = eCol.getObjectByID('color-suggestions');
	
	
	// c0 ~ Background color
	eVars._coloption1.onclick = function() {
		
		
			haschanged = true;
	
			// If we are already editing this color
			if ( changingColors == 1 ) {
			
				eVars._color_Outer_wrapper.style.height = pheight1;
							
				// Disable editing state									
				changingColors = false;
				
				// Remove red box around this element				
				this.className = 'yourcol_wrapper';
				
				// Set back to default swatches								
				eVars._normalSwatches.className = '';												
				eVars._darkSwatches.className = 'die';								

				// Close the swatch selector												
				eVars._colorSuggestions.className = 'collapsed-color-suggestions';
								
								
			} else {
			
				eVars._color_Outer_wrapper.style.height = pheight2;			
			
				// Set edit state			
				changingColors = 1;
				
				// Put red box around this element				
				this.className = 'yourcol_wrapper changing';		

				// What swatches to show
				eVars._darkSwatches.className = '';
				eVars._linkSwatches.className = 'die';
				eVars._normalSwatches.className = 'die';				

				// Remove red frame from other elements
				eVars._coloption2.className = 'yourcol_wrapper';		
				eVars._coloption3.className = 'yourcol_wrapper';				
				eVars._yourcolLink1.className = 'yourcol ecolor2';
				eVars._yourcolLink2.className = 'yourcol nocolor';				
				
				
				// Update the Alfra Omega swatch
				eVars._yourswatch.style.backgroundColor = css[1].value;
				
				// Set the HEX value in the input field
				eVars._hexColor.value = css[1].value;				
				
				// Open the swatch selector				
				eVars._colorSuggestions.className = '';
				
				eCol.update.HEX(eVars._hexColor.value);
			
				
				eCol.update.colChange('HEX');				

			}
		}

	// c1 ~ The menu color
	eVars._coloption2.onclick = function() {


			haschanged = true;

			// If we are already editing this color
			if ( changingColors == 2 ) {

				eVars._color_Outer_wrapper.style.height = pheight1;
							
				// Disable editing state						
				changingColors = false;
				
				// Remove red box around this element								
				this.className = 'yourcol_wrapper';
				
				// Close the swatch selector								
				eVars._colorSuggestions.className = 'collapsed-color-suggestions';
								
			} else {
			
				eVars._color_Outer_wrapper.style.height = pheight2;
			
				// Set edit state			
				changingColors = 2;
				
				// Put red box around this element
				this.className = 'yourcol_wrapper changing';	
					
				// What swatches to show
				eVars._linkSwatches.className = 'die';
				eVars._darkSwatches.className = 'die';				
				eVars._normalSwatches.className = '';				

				// Remove red frame from other elements					
				eVars._coloption1.className = 'yourcol_wrapper';													
				eVars._coloption3.className = 'yourcol_wrapper';								
				eVars._yourcolLink1.className = 'yourcol ecolor2';
				eVars._yourcolLink2.className = 'yourcol nocolor';								
				
				// Update the Alfra Omega swatch
				eVars._yourswatch.style.backgroundColor = css[13].value;

				// Set the HEX value in the input field
				eVars._hexColor.value = css[13].value;		
								
				// Open the swatch selector				
				eVars._colorSuggestions.className = '';
				
				eCol.update.HEX(eVars._hexColor.value);
				eCol.update.colChange('HEX');
				
			}
		}
	
	// c2 ~ Selected / active colors
	eVars._coloption3.onclick = function() {

			haschanged = true;

			// If we are already editing this color
			if ( changingColors == 3 ) {
			
				eVars._color_Outer_wrapper.style.height = pheight1;			
			
				// Disable editing state			
				changingColors = false;
				
				// Remove red box around this element				
				this.className = 'yourcol_wrapper';
				
				// Close the swatch selector				
				eVars._colorSuggestions.className = 'collapsed-color-suggestions';				
				
			} else {
			
				eVars._color_Outer_wrapper.style.height = pheight2;
							
				// Set edit state			
				changingColors = 3;
				
				// Put red box around this element				
				this.className = 'yourcol_wrapper changing';	

				// What swatches to show
				eVars._linkSwatches.className = 'die';
				eVars._darkSwatches.className = 'die';				
				eVars._normalSwatches.className = '';				

				// Remove red frame from other elements
				eVars._coloption1.className = 'yourcol_wrapper';														
				eVars._coloption2.className = 'yourcol_wrapper';		
				eVars._yourcolLink1.className = 'yourcol ecolor2';
				eVars._yourcolLink2.className = 'yourcol nocolor';				

				// Update the Alfra Omega swatch				
				eVars._yourswatch.style.backgroundColor = css[19].value;

				// Set the HEX value in the input field
				eVars._hexColor.value = css[19].value;
											
				// Open the swatch selector				
				eVars._colorSuggestions.className = '';		

				eCol.update.HEX(eVars._hexColor.value);
				eCol.update.colChange('HEX');
			}
		}
		
	// c3 ~ Link color
	eVars._yourcolLink1.onclick = function() {
		
			haschanged = true;
		
			// If we are already editing this color
			if ( changingColors == 4 ) {
		
				eVars.color_Outer_wrapper.style.height = pheight1;
						
				// Disable editing state
				changingColors = false;
				
				// Remove red box around this element
				this.className = 'yourcol ecolor2';
				
				// Set back to default swatches
				eVars._linkSwatches.className = 'die';
				eVars._normalSwatches.className = '';				

				// Close the swatch selector
				eVars._colorSuggestions.className = 'collapsed-color-suggestions';				


			} else {
					
				eVars._color_Outer_wrapper.style.height = pheight2;
									
				// Set edit state
				changingColors = 4;
				
				// Put red box around this element
				this.className = 'yourcol ecolor2 changing';				
		
				// What swatches to show
				eVars._linkSwatches.className = '';
				eVars._normalSwatches.className = 'die';	
				eVars._darkSwatches.className = 'die';							
				
				// Remove red frame from other elements
				eVars._coloption1.className = 'yourcol_wrapper';
				eVars._coloption2.className = 'yourcol_wrapper';		
				eVars._coloption3.className = 'yourcol_wrapper';
				eVars._yourcolLink2.className = 'yourcol nocolor';				
				
				// Update the Alfra Omega swatch
				eVars._yourswatch.style.backgroundColor = css[4].value;

				// Set the HEX value in the input field
				eVars._hexColor.value = css[4].value;
				
				// Open the swatch selector
				eVars._colorSuggestions.className = '';
				
				eCol.update.HEX(eVars._hexColor.value);
				
				console.log('eVars._hexColor.value ~ ', eVars._hexColor.value);
				
//				eCol.update.colChange('HEX');		
			}
		}

	// c4 ~ Link color / light background
	eVars._yourcolLink2.onclick = function() {
		
			haschanged = true;
		
			// If we are already editing this color
			if ( changingColors == 5 ) {
			
				eVars._color_Outer_wrapper.style.height = pheight1;			
		
				// Disable editing state
				changingColors = false;
				
				// Remove red box around this element
				this.className = 'yourcol nocolor';
				

				// Set back to default swatches
				eVars._linkSwatches.className = 'die';
				eVars._normalSwatches.className = '';				

				// Close the swatch selector
				eVars._colorSuggestions.className = 'collapsed-color-suggestions';				



			} else {

				eVars._color_Outer_wrapper.style.height = pheight2;			
					
				// Set edit state
				changingColors = 5;
				
				// Put red box around this element
				this.className = 'yourcol nocolor changing';				
		

				// What swatches to show
				eVars._linkSwatches.className = '';
				eVars._normalSwatches.className = 'die';	
				eVars._darkSwatches.className = 'die';							
				
				// Remove red frame from other elements
				eVars._coloption1.className = 'yourcol_wrapper';
				eVars._coloption2.className = 'yourcol_wrapper';		
				eVars._coloption3.className = 'yourcol_wrapper';
				eVars._yourcolLink1.className = 'yourcol ecolor2';


				// Update the Alfra Omega swatch
				eVars._yourswatch.style.backgroundColor = css[22].value;

				// Set the HEX value in the input field
				eVars._hexColor.value = css[22].value;
				

				// Open the swatch selector
				eVars._colorSuggestions.className = '';
				
				eCol.update.HEX(eVars._hexColor.value);
//				eCol.update.colChange('HEX');				
				
				
			}
		}

		
		
	// Toggle between RGB and HSV slider mode, yo
		
	eVars._hsvToggle = eCol.getObjectByID('hsv-toggle');
	eVars._rgbToggle = eCol.getObjectByID('rgb-toggle'); 	
	
	eVars._hsvToggle.onclick = function() {		
			var togclass = this.className;		
			if ( togclass == 'active-toggle' ) {
				this.className = '';
				eVars._rgbToggle.className = 'active-toggle';				
				eCol.getObjectByID('rgb-slider-container').className = '';
				eCol.getObjectByID('hsv-slider-container').className = 'die';	
			} else {
				this.className = 'active-toggle';
				eVars._rgbToggle.className = '';
				eCol.getObjectByID('rgb-slider-container').className = 'die';
				eCol.getObjectByID('hsv-slider-container').className = '';	
			}
		}
	eVars._rgbToggle.onclick = function() {
			var togclass = this.className;			
			if ( togclass == 'active-toggle' ) {
				this.className = '';
				eVars._hsvToggle.className = 'active-toggle';				
				eCol.getObjectByID('rgb-slider-container').className = 'die';
				eCol.getObjectByID('hsv-slider-container').className = '';	
			} else {
				this.className = 'active-toggle';
				eVars._hsvToggle.className = '';			
				eCol.getObjectByID('rgb-slider-container').className = '';
				eCol.getObjectByID('hsv-slider-container').className = 'die';	
			}
		}

}



function initSliders() {


	// Update slider 1 - H
	eCol.sliders.rangeSlider('range-slider-1', 360, function(value) {
	    eVars._hChannel.value = value;
	    eCol.update.HSV(HSV);
	    eCol.update.colChange('HSV');
	});

	// Update slider 2 - S
	eCol.sliders.rangeSlider('range-slider-2', 100, function(value) {
	    eVars._sChannel.value = value;
	    eCol.update.HSV(HSV);
	    eCol.update.colChange('HSV');
	});

	// Update slider 3 - V
	eCol.sliders.rangeSlider('range-slider-3', 100, function(value) {
	    eVars._vChannel.value = value;
	    eCol.update.HSV(HSV);
	    eCol.update.colChange('HSV');
	});

	// Update slider R
	eCol.sliders.rangeSlider('range-slider-r', 255, function(value) {
	    eVars._rChannel.value = value;
	    eCol.update.RGB(RGB);
	    eCol.update.colChange('RGB');
	});

	// Update slider G
	eCol.sliders.rangeSlider('range-slider-g', 255, function(value) {
	    eVars._gChannel.value = value;
	    eCol.update.RGB(RGB);
	    eCol.update.colChange('RGB');
	});

	// Update slider B
	eCol.sliders.rangeSlider('range-slider-b', 255, function(value) {
	    eVars._bChannel.value = value;
	    eCol.update.RGB(RGB);
	    eCol.update.colChange('RGB');
	});	
}
function initInputFields() {
	
	// HEX
	eVars._hexColor = eCol.getObjectByID('hexColor');
	eVars._hexColor.onblur = function() {
			eCol.update.HEX(eVars._hexColor.value);
			eCol.update.colChange('HEX');
		}

	// RGB
	eVars._rChannel = eCol.getObjectByID('rChannel');
	eVars._rChannel.onblur = function() {
			eCol.update.RGB(RGB);
			eCol.update.colChange('RGB');
		}

	eVars._gChannel = eCol.getObjectByID('gChannel');
	eVars._gChannel.onblur = function() {
			eCol.update.RGB(RGB);
			eCol.update.colChange('RGB');			
		}

	eVars._bChannel = eCol.getObjectByID('bChannel');
	eVars._bChannel.onblur = function() {
			eCol.update.RGB(RGB);
			eCol.update.colChange('RGB');
		}
	
	
	// HSV
	eVars._hChannel = eCol.getObjectByID('hChannel');
	eVars._hChannel.onblur = function() {
			eCol.update.HSV(HSV);
			eCol.update.colChange('HSV');
		}

	eVars._sChannel = eCol.getObjectByID('sChannel');
	eVars._sChannel.onblur = function() {
			eCol.update.HSV(HSV);
			eCol.update.colChange('HSV');
		}
	
	eVars._vChannel = eCol.getObjectByID('vChannel');
	eVars._vChannel.onblur = function() {
			eCol.update.HSV(HSV);
			eCol.update.colChange('HSV');
		}	
}

function initComplimentaryColors() {

	var _hex = eVars._hexColor.value;
		
	eCol.update.HEX(_hex);

	// Make 4 complimentary colors
	eCol.update.makeComplimentary(_hex);

};
function initMatchingColors() {

	var _hex = eVars._hexColor.value;

	HSV = new Object();
	RGB = new Object();

	eCol.convert.HEX2RGB(_hex, RGB);
	eCol.convert.RGB2HSV(RGB, HSV);
	
	// Finds matching colors
	eCol.cMatch.domatch(HSV);
	
	
	// Update the MATCHING colors in cArray
	
	// Match Color 1
	eCol.update.matShit(1,4);

	// Match Color 2
	eCol.update.matShit(2,5);
	
	// Match Color 3
	eCol.update.matShit(3,6);
		
	// Match Color 4	
	eCol.update.matShit(4,7);
	
	// Match Color 5	
	eCol.update.matShit(5,8);

};
function initDarkColors() {


	// These are all STATIC COLORS
	eCol.makeDarkColors(0,215);	// cArray 23 : darkColor 0
	eCol.makeDarkColors(1,196);	// cArray 24 : darkColor 1
	eCol.makeDarkColors(2,319);	// cArray 25 : darkColor 2
	eCol.makeDarkColors(3,354);	// cArray 26 : darkColor 3
	eCol.makeDarkColors(4,22);	// cArray 27 : darkColor 4
	
	
	// cArray 28 : darkColor 5
	
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
	
}
function initLightColors() {


	eCol.makeLightColors(0,215);	// cArray 29 : lightColor 0
	eCol.makeLightColors(1,196);	// cArray 30 : lightColor 1
	eCol.makeLightColors(2,319);	// cArray 31 : lightColor 2
	eCol.makeLightColors(3,76);		// cArray 32 : lightColor 3
	eCol.makeLightColors(4,354);	// cArray 33 : lightColor 4
	
	
	// cArray 34 : lightColor 5
		
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
		
}
function initBrightColors() {

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
	tempCSS.matching[5] = '#matching_swatch_5 { background-color: ' + matchingColor[5][0].HEX + ' !important }';

	
	
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










