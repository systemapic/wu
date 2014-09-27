var jcss, tempjcss, 			// The tag in the head where the CSS gets injected
	draggingSlider = false, 	// If we are dragging, and what bar is being dragged
	haschanged = false, 		// If individual colors has been changed or not (for overriding feedback purposes)
	changingColors = false, 	// For editing mode (To know what color we're editing )
	darktheme = true, 			// Toggle between dark and light theme
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

var header = document.getElementsByTagName('head')[0];

	// The CSS
	jcss = document.createElement('style');
	jcss.setAttribute('type', 'text/css');
	jcss.setAttribute('rel', 'stylesheet');	
	header.appendChild(jcss);

	// The Swatch CSS
	tempjcss = document.createElement('style');
	tempjcss.setAttribute('type', 'text/css');
	tempjcss.setAttribute('rel', 'stylesheet');	
	header.appendChild(tempjcss);


		

// CORE FUNCTIONS
// CORE FUNCTIONS
// CORE FUNCTIONS

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
			cssstring = '';
			for (var i = 0; i<css.length;i++) {			
				if ( css[i].value ) {			
					cssstring += css[i].classes.join() + ' { ' + css[i].pre + ': ' + css[i].value + ' !important } ';
				}
			}					
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

				// Link Color
				css[4].value = matchingColor[2][0].HEX;				
				
				// Inactive Layers
				css[5].value = complimentaryColor[0][0].HEX;
				css[6].value = complimentaryColor[0][3].HEX;	
				css[7].value = complimentaryColor[0][4].HEX;

				// Active Layers
				css[8].value = complimentaryColor[2][0].HEX;
				css[9].value = complimentaryColor[2][4].HEX;
	
				
				

			}
			
			// Menu color
			if ( changingColors == 1 ) {
				
				var HSV = { 'h': parseInt(eVars._hChannel.value), 's': parseInt(eVars._sChannel.value), 'v': parseInt(eVars._vChannel.value)  }

				customColor[1] = [];
				this.colorGrade(customColor, 1, HSV);

				css[0].value = customColor[1][0].HEX;
				css[1].value = customColor[1][1].HEX;	
				css[2].value = customColor[1][3].HEX;

				
			}
		
			// Inactive Layers
			if ( changingColors == 2 ) {
			
				var HSV = { 'h': parseInt(eVars._hChannel.value), 's': parseInt(eVars._sChannel.value), 'v': parseInt(eVars._vChannel.value)  }

				customColor[2] = [];
				this.colorGrade(customColor, 2, HSV);
											
				css[5].value = customColor[2][0].HEX;
				css[6].value = customColor[2][3].HEX;	
				css[7].value = customColor[2][4].HEX;
				
			}

			// Active Layers
			if ( changingColors == 3 ) {

				var HSV = { 'h': parseInt(eVars._hChannel.value), 's': parseInt(eVars._sChannel.value), 'v': parseInt(eVars._vChannel.value)  }

				customColor[3] = [];
				this.colorGrade(customColor, 3, HSV);
				
				css[8].value = customColor[3][0].HEX;
				css[9].value = customColor[3][4].HEX;

			}

			// Link Color
			if ( changingColors == 4 ) {
			
				var HSV = { 'h': parseInt(eVars._hChannel.value), 's': parseInt(eVars._sChannel.value), 'v': parseInt(eVars._vChannel.value)  }

				customColor[4] = [];
				this.colorGrade(customColor, 4, HSV);
				
				css[4].value = customColor[4][0].HEX;
				
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
				
	}
	
}	






// START COLOR THEME
// START COLOR THEME
// START COLOR THEME

function startColorThemes() {

	initInputFields();

	// BASIC
	// Chose between preset color themes
	
	// Get some triggers
	eVars._dark1 = Wu.DomUtil.get('colortheme-dark1');
	eVars._dark2 = Wu.DomUtil.get('colortheme-dark2');
	eVars._dark3 = Wu.DomUtil.get('colortheme-dark3');
	eVars._light1 = Wu.DomUtil.get('colortheme-light1');
	eVars._light2 = Wu.DomUtil.get('colortheme-light2');
	eVars._light3 = Wu.DomUtil.get('colortheme-light3');					

	// Get the wrappers
	eVars._color_Inner_wrapper = Wu.DomUtil.get('project-color-theme').parentNode;
	eVars._color_Outer_wrapper = Wu.DomUtil.get('project-color-theme').parentNode.parentNode;

	// Get the cancel button
	eVars._cancelColors = Wu.DomUtil.get('cancel-colors-editor');

	// Get the ADVANCED color theme button
	eVars._advanced = Wu.DomUtil.get('advanced-theme-selector');	


	// Set wrapper size...
	

	// Bring in the BASIC color theme part
	eVars._color_Inner_wrapper.style.left = '-310px';
	
	// Set the height of the outer wrapper
	eVars._color_Outer_wrapper.style.height = '190px';		



	// Clickers

	// DARK COLOR THEMES
	eVars._dark1.onclick = function() {prethemes('dark1');}
	eVars._dark2.onclick = function() {prethemes('dark2');}
	eVars._dark3.onclick = function() {prethemes('dark3');}

	// LIGHT COLOR THEMES
	eVars._light1.onclick = function() {prethemes('light1');}
	eVars._light2.onclick = function() {prethemes('light2');}
	eVars._light3.onclick = function() {prethemes('light3');}
	
	
	
	
	// Go to Advanced
	eVars._advanced.onclick = function() {
		advancedColorThemes.init();
	}

	// Cancel
	eVars._cancelColors.onclick = function() {
		eVars._color_Inner_wrapper.style.left = '0px';
		eVars._color_Outer_wrapper.style.height = '231px';
	}

}


// Advanced Color Theme Mode
// Advanced Color Theme Mode
// Advanced Color Theme Mode

var advancedColorThemes = {
	
	init : function() {

	
		// For CSS animating height of container
		var pheight1 = '308px';
		var pheight2 = '458px';
	
	
		// Slide in the ADVANCED options
		eVars._color_Inner_wrapper.style.left = '-580px';		
		eVars._color_Outer_wrapper.style.height = pheight1;
		
		// Collect some DIV's
		eVars._b2basic = Wu.DomUtil.get('back-to-basic');
		eVars._yourswatch = Wu.DomUtil.get('yourswatch');	
		eVars._myCanvas = Wu.DomUtil.get("myCanvas");
		eVars._pixCanvas = Wu.DomUtil.get("pixCanvas");
		eVars._canvimg = Wu.DomUtil.get("canvimg");
				
		// GO INTO COLOR EDITING MODE
		eVars._coloption1 = Wu.DomUtil.get('coloption1');
		eVars._coloption2 = Wu.DomUtil.get('coloption2');
		eVars._coloption3 = Wu.DomUtil.get('coloption3');	
		
		eVars._yourcolLink1 = Wu.DomUtil.get('yourcol_link1');
		eVars._yourcolLink2 = Wu.DomUtil.get('yourcol_link2');	
		
		eVars._normalSwatches = Wu.DomUtil.get('normal-swatches');
		eVars._darkSwatches = Wu.DomUtil.get('dark-swatches');
		eVars._linkSwatches = Wu.DomUtil.get('link-swatches');
		eVars._colorSuggestions = Wu.DomUtil.get('color-suggestions');
		
		eVars._regen = Wu.DomUtil.get('regen');		
		
		eVars._hsvToggle = Wu.DomUtil.get('hsv-toggle');
		eVars._rgbToggle = Wu.DomUtil.get('rgb-toggle'); 	
				
		eVars._paletteToggle = Wu.DomUtil.get('palette-toggle');
		eVars._sliderToggle = Wu.DomUtil.get('slider-toggle'); 	
		eVars._imageToggle = Wu.DomUtil.get('image-toggle'); 			
		
	
		eVars._tickMenuLight = Wu.DomUtil.get('tick-menu-light');
		eVars._tickMenuDark = Wu.DomUtil.get('tick-menu-dark');		

		eVars._tickHeaderLight = Wu.DomUtil.get('tick-header-light');
		eVars._tickHeaderDark = Wu.DomUtil.get('tick-header-dark');		

		eVars._tickMboxLight = Wu.DomUtil.get('tick-mbox-light');
		eVars._tickMboxDark = Wu.DomUtil.get('tick-mbox-dark');	
		
		
		
		
						
		// Set background color of MAIN swatch
		eVars._yourswatch.style.backgroundColor = basecolor;	
		
		// Back to BASIC mode
		eVars._b2basic.onclick = function() {
			eVars._color_Inner_wrapper.style.left = '-310px';
			eVars._color_Outer_wrapper.style.height = '190px';				
		}
	
		// INIT SLIDERS				
		this.initSliders();
	
		// Find the right image to use for the color picker...
		// OBS! Image must be stored locally (same url as server) for it to work...
		var uggid = Wu.DomUtil.get('project-color-theme').parentNode.getAttribute('uuid');
		var ulist =	Wu.DomUtil.get('editor-projects-container');
			ulist = ulist.getElementsByTagName('div');
			
		// Find the Image
/*
		for ( var ui=0; ui<ulist.length; ui++ ) {
				if ( ulist[ui].className == 'editor-projects-item active' || ulist[ui].className == 'editor-projects-item' ) {
					var eluid = ulist[ui].getAttribute('uuid');
					if ( eluid == uggid ) {
						eVars._canvimg = ulist[ui].getElementsByTagName('img')[0];
						break;
					}
				}
			} // end
*/
	
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
					Wu.DomUtil.rempveClass(eVars._normalSwatches, 'die');
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
					Wu.DomUtil.removeClass(eVars._yourcolLink2, 'changing');																
					Wu.DomUtil.removeClass(eVars._regen, 'changing');										
					
					
					// Update the Alfra Omega swatch
					eVars._yourswatch.style.backgroundColor = css[0].value;
					
					// Set the HEX value in the input field
					eVars._hexColor.value = css[0].value;				
					
					// Open the swatch selector
					Wu.DomUtil.rempveClass(eVars._colorSuggestions, 'collapsed-color-suggestions');

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
					Wu.DomUtil.removeClass(eVars._yourcolLink2, 'changing');															
					Wu.DomUtil.removeClass(eVars._regen, 'changing');															
					
					// Update the Alfra Omega swatch
					eVars._yourswatch.style.backgroundColor = css[5].value;
	
					// Set the HEX value in the input field
					eVars._hexColor.value = css[5].value;		
									
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
					Wu.DomUtil.removeClass(eVars._yourcolLink2, 'changing');					
					Wu.DomUtil.removeClass(eVars._regen, 'changing');		
	
					// Update the Alfra Omega swatch				
					eVars._yourswatch.style.backgroundColor = css[8].value;
	
					// Set the HEX value in the input field
					eVars._hexColor.value = css[8].value;
												
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
					Wu.DomUtil.removeClass(eVars._yourcolLink2, 'changing');
					Wu.DomUtil.removeClass(eVars._regen, 'changing');									
					
					// Update the Alfra Omega swatch
					eVars._yourswatch.style.backgroundColor = css[4].value;
	
					// Set the HEX value in the input field
					eVars._hexColor.value = css[4].value;
					
					// Open the swatch selector
					Wu.DomUtil.removeClass(eVars._colorSuggestions, 'collapsed-color-suggestions');					
					
					eCol.update.HEX(eVars._hexColor.value);
					eCol.update.inputFields('HEX');				
					
					
					// Bring back the Palette Toggle Button
					eVars._paletteToggle.removeAttribute('style');
									

				}
			}
	
		// 5 ~ Link color / light background
		eVars._yourcolLink2.onclick = function() {
			
				haschanged = true;
			
				// If we are already editing this color
				if ( changingColors == 5 ) {
				
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
					changingColors = 5;
					
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
					Wu.DomUtil.removeClass(eVars._yourcolLink1, 'changing');							
					Wu.DomUtil.removeClass(eVars._regen, 'changing');							
	
					// Update the Alfra Omega swatch
					eVars._yourswatch.style.backgroundColor = css[3].value;
	
					// Set the HEX value in the input field
					eVars._hexColor.value = css[3].value;
					
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

		// MENU TOGGLER
		eVars._tickMenuLight.onclick = function() {

			Wu.DomUtil.addClass(this, 'active-toggle');
			Wu.DomUtil.removeClass(eVars._tickMenuDark, 'active-toggle');			

			css[14].value = 'rgba(255, 255, 255, 0.7)';

			eCol.update.CSSstring();
			jcss.innerHTML = cssstring;
			
		}
		eVars._tickMenuDark.onclick = function() {
	
			Wu.DomUtil.addClass(this, 'active-toggle');
			Wu.DomUtil.removeClass(eVars._tickMenuLight, 'active-toggle');			
	
			css[14].value = 'rgba(0,0,0,0.7)';
			
			eCol.update.CSSstring();
			jcss.innerHTML = cssstring;			

		}	
		
		// HEADER TOGGLER
		eVars._tickHeaderLight.onclick = function() {

			Wu.DomUtil.addClass(this, 'active-toggle');
			Wu.DomUtil.removeClass(eVars._tickHeaderDark, 'active-toggle');			

			css[15].value = 'white';	
			css[16].value = '#333';	

			eCol.update.CSSstring();
			jcss.innerHTML = cssstring;
			
		}
		eVars._tickHeaderDark.onclick = function() {
	
			Wu.DomUtil.addClass(this, 'active-toggle');
			Wu.DomUtil.removeClass(eVars._tickHeaderLight, 'active-toggle');			
	
			css[15].value = 'black';
			css[16].value = 'white';			
			
			eCol.update.CSSstring();
			jcss.innerHTML = cssstring;			

		}	
		
		// MAP BOXES TOGGLER
		eVars._tickMboxLight.onclick = function() {

			Wu.DomUtil.addClass(this, 'active-toggle');
			Wu.DomUtil.removeClass(eVars._tickMboxDark, 'active-toggle');			

			css[14].value = 'rgba(255, 255, 255, 0.7)';

			eCol.update.CSSstring();
			jcss.innerHTML = cssstring;
			
		}
		eVars._tickMboxDark.onclick = function() {
	
			Wu.DomUtil.addClass(this, 'active-toggle');
			Wu.DomUtil.removeClass(eVars._tickMboxLight, 'active-toggle');			
	
			css[14].value = 'rgba(0,0,0,0.7)';
			
			eCol.update.CSSstring();
			jcss.innerHTML = cssstring;			

		}					
			
	
	
		
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
		
		var _hex = eVars._hexColor.value;
			
		eCol.update.HEX(_hex);
	
		// Make 4 complimentary colors
		eCol.update.makeComplimentary(_hex);
		
	},
	initMatchingColors : function() {

		var _hex = eVars._hexColor.value;
	
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




// PASS COLORS WHEN CLICKING ON THE SWATCHES
// PASS COLORS WHEN CLICKING ON THE SWATCHES
// PASS COLORS WHEN CLICKING ON THE SWATCHES

function passcolor(whatArray, arrn1) {
				
		// Changing the Menu Base Color
		if ( changingColors == 1 ) {

			// Changing the background color to LIGHT colors
			if ( whatArray == 'light' ) {	
				css[0].value = lightColor[arrn1][0].HEX;
				css[1].value = lightColor[arrn1][1].HEX;	
				css[2].value = lightColor[arrn1][2].HEX;
				
				// Update the HEX value in the HEX VALUE INPUT FIELD				
				eVars._hexColor.value = lightColor[arrn1][0].HEX;
			
			}		
		
			// Changing the background color to DARK colors			
			if ( whatArray == 'dark' ) {
				css[0].value = darkColor[arrn1][0].HEX;
				css[1].value = darkColor[arrn1][1].HEX;	
				css[2].value = darkColor[arrn1][2].HEX;	

				// Update the HEX value in the HEX VALUE INPUT FIELD
				eVars._hexColor.value = darkColor[arrn1][0].HEX;
			} 
			
		} 
		
		// Changing the Layer INACTIVE color
		if ( changingColors == 2 ) {		
		
			// Changing to a COMPLIMENTARY color
			if ( whatArray == 'complimentary' ) {		
				css[5].value = complimentaryColor[arrn1][0].HEX;
				css[6].value = complimentaryColor[arrn1][3].HEX;	
				css[7].value = complimentaryColor[arrn1][4].HEX;
				
				// Update the HEX value in the HEX VALUE INPUT FIELD				
				eVars._hexColor.value = complimentaryColor[arrn1][0].HEX;
			}

			// Canging to a MATCHING color
			if ( whatArray == 'matching' ) {
				css[5].value = matchingColor[arrn1][0].HEX;
				css[6].value = matchingColor[arrn1][2].HEX;	
				css[7].value = matchingColor[arrn1][4].HEX;

				// Update the HEX value in the HEX VALUE INPUT FIELD
				eVars._hexColor.value = matchingColor[arrn1][0].HEX;								
			}

		}

		// Changing the Layer ACTIVE color
		if ( changingColors == 3 ) {		


			// Changing to a COMPLIMENTARY color
			if ( whatArray == 'complimentary' ) {
				css[8].value = complimentaryColor[arrn1][0].HEX;
				css[9].value = complimentaryColor[arrn1][4].HEX;
				
				// Update the HEX value in the HEX VALUE INPUT FIELD				
				eVars._hexColor.value = complimentaryColor[arrn1][0].HEX;								
								
			}

			// Canging to a MATCHING color
			if ( whatArray == 'matching' ) {
				css[8].value = matchingColor[arrn1][0].HEX;
				css[9].value = matchingColor[arrn1][4].HEX;
				
				// Update the HEX value in the HEX VALUE INPUT FIELD				
				eVars._hexColor.value = matchingColor[arrn1][0].HEX;
							
			}
		}
				
		// Changing the LINK color
		if ( changingColors == 4 ) {		

			// To a BRIGHT color
			if ( whatArray == 'bright' ) {
				css[4].value = brightColor[arrn1][0].HEX;
				
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






// Set up the Array of the css[] Classes 
// Set up the Array of the css[] Classes 
// Set up the Array of the css[] Classes 

var	initClassArray = {
	
		// Start it all, yo
		go : function () {

			this.stackClasses(theClassArray);
			this.makeCSSelements(theClassArray);
			this.makeCSSel();
		},
			
		// These are the CSS classes that will get affected
		stackClasses : function (theClassArray) {
										
										
				// MENU BACKGROUND COLORS
				// MENU BACKGROUND COLORS
							
				theClassArray[0] = ['.bg1', 									
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

				theClassArray[1] = ['._color2bg',
									'.ecolor2',
									'#selectedTab span',
									'#editorPanel > .content',
									'.q-editor-container',
									'#editor',
									'#menuslider',
									'#datalibrary-download-dialogue:after',
									'th',
									'fullpage-documents', 					
									'.data-library',
									'.editor-wrapper'];
									
				theClassArray[2] = ['._color4bg',
									'.ecolor4'];



				// I DON'T KNOW...
				// I DON'T KNOW...

				theClassArray[3] = ['._color4',
									'.ecolor1',
									'.disabled'];
									

				// LINK COLOR
				// LINK COLOR
								
				theClassArray[4] = ['._color3',
									'.ecolor2',
									'.active a',
									'.red a'];
									
									

				// INACTIVE LAYERS
				// INACTIVE LAYERS

				theClassArray[5] = ['._color7bg',
									 '.color1','.layer-menu-item'];
								
				theClassArray[6] = ['._color8bg',
									 '.color2'];

				theClassArray[7] = ['._color9bg',
								 	 '.color3'];



				// ACTIVE LAYERS
				// ACTIVE LAYERS

				theClassArray[8] = ['._color10bg',
									 '.selected',
									 '.layer-active .layer-menu-item'];
				
				theClassArray[9] = ['._color11bg',
									 '.color8'];



				// OTHER COLORS
				// OTHER COLORS


				theClassArray[10] = ['._color12',
									 '.nocolor'];			
				
				theClassArray[11] = ['.color1',
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
				
				theClassArray[12] = ['.color2',
									 '.btn-default',
									 '.btn-default:hover',
									 '#new-project-button',
									 '.middle-item'];
									 
				theClassArray[13] = ['.editor-wrapper',
									 '.editor-wrapper h3',
									 '.editor-wrapper h4',
									 '#select-basic-themes'];									



				theClassArray[14] = ['#description-control-inner-content-box',
									 '#layer-menu-inner-content',
									 '#legends-inner',
									 '.leaflet-control-inspect'];
				
				theClassArray[15] = ['.menucollapser',
									 '#header',
									 '.header-title',
									 '.header-subtitle',
									 '.leaflet-bar a',
									 '.leaflet-bar a:hover'];
				
				theClassArray[16] = ['.menucollapser',
									 '#header',
									 '.header-title',
									 '.header-subtitle',
									 '.leaflet-bar a',
									 '.leaflet-bar a:hover',
									 '.new-client'];
				
				theClassArray[17] = ['.editor-map-item-wrap',
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
				
				theClassArray[18] = ['.new-client',
									 '#new-project-button',
									 '.btn-default',
									 '.btn-default:hover',
									 '.middle-item'];
									 
							


				 // EXTRA CLASSES FOR TOGGELIG BETWEEN LIGHT AND DARK THEMES!!!
				 // EXTRA CLASSES FOR TOGGELIG BETWEEN LIGHT AND DARK THEMES!!!
				 // EXTRA CLASSES FOR TOGGELIG BETWEEN LIGHT AND DARK THEMES!!!
			
	
				theClassArray[19] = ['tr:nth-child(odd)'];

				theClassArray[20] = ['tr:nth-child(even)'];

				theClassArray[21] = ['#base-color', 
									  '#yourswatch'];
									  
				theClassArray[22] = ['.mat_swatches', 
									  '#sliders', 
									  '.ccontainer'];
				// GRAY TEXT
				theClassArray[23] = ['.editor-wrapper h3', 
									  '.editor-wrapper h4', 
									  '.dln', 
									  '.dld', 
									  'article', 
									  '.documents-folder-item', 
									  '#documents-new-folder', 
									  '#documents-new-folder:hover', 
									  '.documents-folder-item:hover', 
									  '.editor-map-item-wrap input', 
									  '.form-control input', 
									  '.editor-map-item-wrap', 
									  '#editor-map-initpos-button', 
									  '#editor-map-bounds', 
									  '.tdcont', 
									  'th', 
									  '#sliders', 
									  '.ccontainer'];
			
			
				// WHITE BG
				theClassArray[24] = ['.#color-digits', 
									  '.save-colors', 
									  '#canvasinf', 
									  '#editor-map-initpos-button', 
									  '#editor-map-bounds', 
									  '.input-box', 
									  '.eightyWidth', 
									  '.editor-map-item-wrap input', 
									  '.form-control input'];
			
			

				theClassArray[25] = ['.controls-item'];
				theClassArray[26] = ['.controls-item'];
				theClassArray[27] = ['.controls-item'];								
			
			
				theClassArray[28] = ['.th', 
									  '.tdcont', 
									  '#documents-container-rightpane', 
									  '.documents-folder-item', 
									  '#documents-new-folder', 
									  '.editor-wrapper h4'];
									  
				theClassArray[29] = ['hr'];
			
				theClassArray[30] = ['blockquote'];
			
				theClassArray[31] = ['#bhattan1',
									  '#bhattan2',
									  '#legends-collapser'];
				
 
									 
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

		
		
		
			}, 

		// Sets up the CSS elements in the Array			
		makeCSSel : function (va, pre, val) {
				css[va] = {};
				css[va].classes = theClassArray[va];
				css[va].pre = pre;
				css[va].value = val;					
			}
	}
	
initClassArray.go();


// LOAD THE PRE DEFINED COLOR THEMES (BASIC)
// LOAD THE PRE DEFINED COLOR THEMES (BASIC)
// LOAD THE PRE DEFINED COLOR THEMES (BASIC)

function prethemes(theme) {

	if ( theme == 'dark1' ) {
				
		darktheme = true;
		
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
		preval_10 = 'white';						// Link on white background
		preval_11 = 'white';						// Text on Active AND Inactive Layers – Level 1
		preval_12 = '#333';							// Text on ONLY Inactive Layer – Level 2
		preval_13 = 'white';						// Text color on Main Menu Shade 2 (Plus the white buttons, but that's not right...)
		preval_14 = 'rgba(255,255,255,0.7)';		// Background color on Map Boxes
		preval_15 = 'white';						// Background color on HEADER and Map Box Headers on Map
		preval_16 = '#333';							// TEXT color on Header and Map Box Headers on Map
		preval_17 = 'rgba(255, 255, 255, 0.15)';	// Background color Boxes on sidepane (New client box, etc)
		preval_18 = 'white';						// Bacground color Buttons

			
	}	
	if ( theme == 'dark2' ) {

		darktheme = true;

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
		preval_10 = 'white';						// Link on white background
		preval_11 = 'white';						// Text on Active AND Inactive Layers – Level 1
		preval_12 = '#333';							// Text on ONLY Inactive Layer – Level 2
		preval_13 = 'white';						// Text color on Main Menu Shade 2 (Plus the white buttons, but that's not right...)
		preval_14 = 'rgba(255,255,255,0.7)';		// Background color on Map Boxes
		preval_15 = 'white';						// Background color on HEADER and Map Box Headers on Map
		preval_16 = '#333';							// TEXT color on Header and Map Box Headers on Map
		preval_17 = 'rgba(255, 255, 255, 0.15)';	// Background color Boxes on sidepane (New client box, etc)			
		preval_18 = 'white';						// Bacground color Buttons
		

		
	}
	if ( theme == 'dark3' ) {

		darktheme = true;

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
		preval_10 = 'white';						// Link on white background
		preval_11 = 'white';						// Text on Active AND Inactive Layers – Level 1
		preval_12 = '#333';							// Text on ONLY Inactive Layer – Level 2
		preval_13 = 'white';						// Text color on Main Menu Shade 2 (Plus the white buttons, but that's not right...)
		preval_14 = 'rgba(255,255,255,0.7)';		// Background color on Map Boxes
		preval_15 = 'white';						// Background color on HEADER and Map Box Headers on Map
		preval_16 = '#333';							// TEXT color on Header and Map Box Headers on Map
		preval_17 = 'rgba(255, 255, 255, 0.15)';	// Background color Boxes on sidepane (New client box, etc)			
		preval_18 = 'white';						// Bacground color Buttons
		
		
		
	}
	if ( theme == 'light1' ) {

		darktheme = false;

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
		preval_10 = 'black';				// Link on white background
		preval_11 = 'white';				// Text on Active AND Inactive Layers – Level 1
		preval_12 = 'white';				// Text on ONLY Inactive Layer – Level 2
		preval_13 = 'black';				// Text color on Main Menu Shade 2 (Plus the white buttons, but that's not right...)
		preval_14 = 'rgba(0,0,0,0.7)';		// Background color on Map Boxes
		preval_15 = '#333';					// Background color on HEADER and Map Box Headers on Map
		preval_16 = 'white';				// TEXT color on Header and Map Box Headers on Map
		preval_17 = rgba_50;				// Background color Boxes on sidepane (New client box, etc)
		preval_18 = base;					// Bacground color Buttons
		
			
	}
	if ( theme == 'light2' ) {

		darktheme = false;

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
		preval_10 = 'black';				// Link on white background
		preval_11 = 'white';				// Text on Active AND Inactive Layers – Level 1
		preval_12 = 'white';				// Text on ONLY Inactive Layer – Level 2
		preval_13 = 'black';				// Text color on Main Menu Shade 2 (Plus the white buttons, but that's not right...)
		preval_14 = 'rgba(0,0,0,0.7)';		// Background color on Map Boxes
		preval_15 = '#333';					// Background color on HEADER and Map Box Headers on Map
		preval_16 = 'white';				// TEXT color on Header and Map Box Headers on Map
		preval_17 = rgba_50;				// Background color Boxes on sidepane (New client box, etc)
		preval_18 = base;					// Bacground color Buttons
		
				
		
	}
	if ( theme == 'light3' ) {

		darktheme = false;

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
		preval_10 = 'black';				// Link on white background
		preval_11 = 'white';				// Text on Active AND Inactive Layers – Level 1
		preval_12 = 'white';				// Text on ONLY Inactive Layer – Level 2
		preval_13 = 'black';				// Text color on Main Menu Shade 2 (Plus the white buttons, but that's not right...)
		preval_14 = 'rgba(0,0,0,0.7)';		// Background color on Map Boxes
		preval_15 = '#333';					// Background color on HEADER and Map Box Headers on Map
		preval_16 = 'white';				// TEXT color on Header and Map Box Headers on Map
		preval_17 = rgba_50;				// Background color Boxes on sidepane (New client box, etc)
		preval_18 = base;					// Bacground color Buttons
		
				
	}

	// Base
	css[0].value = preval_0;
	css[1].value = preval_1;	
	css[2].value = preval_2;	

	css[3].value = preval_3;	

	// Link
	css[4].value = preval_4;
	
	// Inactive Layers
	css[5].value = preval_5;	
	css[6].value = preval_6;	
	css[7].value = preval_7;	
	
	// Active Layers	
	css[8].value = preval_8;	
	css[9].value = preval_9;


	// Other Colors
	css[10].value = preval_10;	// Link on white background
	css[11].value = preval_11;	// Text on Active AND Inactive Layers – Level 1
	css[12].value = preval_12; 	// Text on ONLY Inactive Layer – Level 2
	css[13].value = preval_13;	// Text color on Main Menu Shade 2 (Plus the white buttons, but that's not right...)
	css[14].value = preval_14;	// Background color on Map Boxes

	css[15].value = preval_15;	// Background color on HEADER and Map Box Headers on Map
	css[16].value = preval_16;	// TEXT color on Header and Map Box Headers on Map

	css[17].value = preval_17;	// Background color Boxes on sidepane (New client box, etc)
	css[18].value = preval_18;  // Bacground color Buttons


	basecolor = preval_1;

	eVars._hexColor.value = preval_5;


	// If it's a light theme, add this styling
	if ( !darktheme ) { 

		var RGB = {};
		eCol.convert.HEX2RGB(css[0].value, RGB);
		var rgba_50 = 'rgba(' + RGB.r + ',' + RGB.g + ',' + RGB.b + ',0.5)';
		var rgba_25 = 'rgba(' + RGB.r + ',' + RGB.g + ',' + RGB.b + ',0.25)';
	
		css[19].value = rgba_50; 					// The darkest background color in file list
		css[20].value = rgba_25; 					// The lightest background color in file list
		css[21].value = rgba_50; 					// Super tiny ~ this is the border at the bottom of the MAIN Swatch (Above the hex value)
		
		css[22].value = 'transparent'; 				// The background color of the color theme menu
		
		css[23].value = '#666'; 					// The gray text that goes in the Menu (on top of color theme menu, buttons, etc)
		css[24].value = 'white';					// Don't quite know...
	
		css[25].value = 'rgba(0, 0, 0, 0.5)';		// Map Controls Buttons – Color 
		css[26].value = 'rgba(255, 255, 255, 0.5)'; // Map Controls Buttons – Background
		css[27].value = '600';						// Map Controls Buttons – Font Weight
	
		css[28].value = '200';						// General ~ Turn 100 font-weight to 200 (looks too slim on white)
	
		css[29].value = '1px solid black';			// HR border top
		css[30].value = '5px solid #333';			// Block quote border legt
		css[31].value = '-56px 8px';				// Block quote in Documents
	

	// If it IS a dark theme, remove the static styling for light themes only...
	} else {

		css[19].value = '';
		css[20].value = '';
		css[21].value = '';
		css[22].value = '';
		css[23].value = '';
		css[24].value = '';
		css[25].value = '';
		css[26].value = '';
		css[27].value = '';
		css[28].value = '';
		css[29].value = '';
		css[30].value = '';
		css[31].value = '';
	
	}

		
	eCol.update.CSSstring();
	jcss.innerHTML = cssstring;

}


