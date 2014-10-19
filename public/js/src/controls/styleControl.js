// controls global styles
// full color themeing to come
Wu.Style = Wu.Class.extend({

	initialize : function () {
		
		// get style tag
		this._styletag = Wu.DomUtil.get("styletag");

	},

	setDarkTheme : function () {

		// append darktheme stylesheet
		var darktheme = document.createElement("link");
		darktheme.rel = 'stylesheet';
		darktheme.href = '//85.10.202.87:8080/css/darktheme.css';
		this._styletag.appendChild(darktheme);

	},

	setLightTheme : function () {

		// remove darktheme stylesheet
		this._styletag.innerHTML = '';

	},

	// todo: will overwrite darktheme??
	initSVGpatterns : function () {
		var SVG_patterns = '<!-- SVG fill properties: url(#diagonal-dots) // url(#dots) url(#diagonal-circles) url(#diagonal-stripes) url(#grid) --><svg xmlns="http://www.w3.org/2000/svg"><defs><pattern id="diagonal-dots" x="0" y="0" width="11" height="11" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><circle cx="5" cy="5" r="4" style="stroke:none; fill:blue;" /></pattern></defs><defs><pattern id="dots" x="0" y="0" width="11" height="11" patternUnits="userSpaceOnUse"><circle cx="5" cy="5" r="4" style="stroke:none; fill:red;" /></pattern><pattern id="diagonal-circles" x="0" y="0" width="11" height="11" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><circle cx="5" cy="5" r="4" style="stroke-width:2; stroke:green; fill:none;" /></pattern><pattern id="diagonal-stripes" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><rect x="0" y="0" width="4" height="8" style="stroke:none; fill:purple;" /></pattern><pattern id="grid" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse"><rect x="0" y="0" width="10" height="4" style="stroke:none; fill:orange;" /><rect x="3" y="3" width="4" height="10" style="stroke:none; fill:orange;" /></pattern></defs></svg>';
		this._styletag.innerHTML = SVG_patterns; 
	},

});

















// keep for handy shortcuts
function darktheme () {
	console.log('darktheme() moved to app.Style.setDarkTheme()')	
}

function lighttheme () {
	console.log('lighttheme() moved to app.Style.setLightTheme()')	
}

function initSVGpatterns () {
	var SVG_patterns = '<!-- SVG fill properties: url(#diagonal-dots) // url(#dots) url(#diagonal-circles) url(#diagonal-stripes) url(#grid) --><svg xmlns="http://www.w3.org/2000/svg"><defs><pattern id="diagonal-dots" x="0" y="0" width="11" height="11" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><circle cx="5" cy="5" r="4" style="stroke:none; fill:blue;" /></pattern></defs><defs><pattern id="dots" x="0" y="0" width="11" height="11" patternUnits="userSpaceOnUse"><circle cx="5" cy="5" r="4" style="stroke:none; fill:red;" /></pattern><pattern id="diagonal-circles" x="0" y="0" width="11" height="11" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><circle cx="5" cy="5" r="4" style="stroke-width:2; stroke:green; fill:none;" /></pattern><pattern id="diagonal-stripes" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><rect x="0" y="0" width="4" height="8" style="stroke:none; fill:purple;" /></pattern><pattern id="grid" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse"><rect x="0" y="0" width="10" height="4" style="stroke:none; fill:orange;" /><rect x="3" y="3" width="4" height="10" style="stroke:none; fill:orange;" /></pattern></defs></svg>';
	Wu.DomUtil.get("styletag").innerHTML = SVG_patterns;
}
// colorArray = [ '#334d5c','#45b29d','#8eddb8','#5fffaf','#0ea32b','#47384d','#a84158','#f224ff','#d85fff','#f21b7f','#f40028','#f15e01','#e27a3f','#ffc557','#dbef91','#df4949','#cfc206','#fff417','#4b84e8','#ffffff' ]
