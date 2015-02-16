var sections = [];
var allowedColors = ['whitesmoke', 'indianred', 'darkblue', 'mediumaquamarine', 'mediumblue', 'yellowgreen', 'aliceblue', 'antiquewhite', 'aqua', 'aquamarine', 'azure', 'banana', 'beet', 'beige', 'bisque', 'black', 'blanchedalmond', 'blue', 'blueviolet', 'brick', 'brightgray', 'brown', 'burlywood', 'burntsienna', 'burntumber', 'cadetblue', 'cadmiumorange', 'cadmiumyellow', 'carrot', 'chartreuse', 'chocolate', 'cobalt', 'cobaltgreen', 'coldgrey', 'coral', 'cornflowerblue', 'cornsilk', 'crimson', 'cyan', 'darkcyan', 'darkgoldenrod', 'darkgray', 'darkgreen', 'darkkhaki', 'darkmagenta', 'darkolivegreen', 'darkorange', 'darkorchid', 'darkred', 'darksalmon', 'darkseagreen', 'darkslateblue', 'darkslategray', 'darkturquoise', 'darkviolet', 'deeppink', 'deepskyblue', 'dimgray', 'dodgerblue', 'eggshell', 'emeraldgreen', 'firebrick', 'flesh', 'floralwhite', 'forestgreen', 'fuchsia', 'gainsboro', 'ghostwhite', 'gold', 'goldenrod', 'gray', 'green', 'greenyellow', 'honeydew', 'hotpink', 'indianred', 'indigo', 'ivory', 'ivoryblack', 'khaki', 'khaki', 'lavender', 'lavenderblush', 'lawngreen', 'lemonchiffon', 'lightblue', 'lightcoral', 'lightcyan', 'lightgoldenrod', 'lightgoldenrodyellow', 'lightgray', 'lightgreen', 'lightgrey', 'lightpink', 'lightsalmon', 'lightseagreen', 'lightskyblue', 'lightslateblue', 'lightslategray', 'lightsteelblue', 'lightyellow', 'lime', 'limegreen', 'linen', 'magenta', 'manganeseblue', 'maroon', 'mediumorchid', 'mediumpurple', 'mediumseagreen', 'mediumslateblue', 'mediumspringgreen', 'mediumturquoise', 'mediumvioletred', 'melon', 'midnightblue', 'mint', 'mintcream', 'mistyrose', 'moccasin', 'navajowhite', 'navy', 'oldlace', 'olive', 'olivedrab', 'orange', 'orangered', 'orchid', 'palegoldenrod', 'palegreen', 'paleturquoise', 'palevioletred', 'papayawhip', 'peachpuff', 'peacock', 'peru', 'pink', 'plum', 'powderblue', 'purple', 'raspberry', 'rawsienna', 'red', 'rosybrown', 'royalblue', 'saddlebrown', 'salmon', 'sandybrown', 'sapgreen', 'seagreen', 'sepia', 'sienna', 'silver', 'skyblue', 'slateblue', 'slateblue', 'slategray', 'smoke', 'snow', 'springgreen', 'steelblue', 'tan', 'teal', 'teal', 'thistle', 'tomato', 'turquoise', 'turquoiseblue', 'violet', 'violetred', 'warmgrey', 'wheat', 'white', 'yellow'];


var _general = {
	name : 'All elements',
	identifiers : [

		{
		name 		: 	'image-filters',
		value 		: 	'functions',
		defaultValue 	: 	'none (no filters)',
		description 	: 	'A list of image filters that will be applied to the active rendering canvas for a given style. The presence of one more more image-filters will trigger a new canvas to be created before starting to render a style and then this canvas will be composited back into the main canvas after rendering all features and after all image-filters have been applied. See direct-image-filters if you want to apply a filter directly to the main canvas.',
		validValues 	: 	[]
		},

		{
		name 		: 	'direct-image-filters',
		value 		: 	'functions',
		defaultValue 	: 	'none (no filters)',
		description 	: 	'A list of image filters to apply to the main canvas (see the image-filters doc for how they work on a separate canvas)',
		validValues 	: 	[]
		},

		{
		name 		: 	'comp-op',
		value 		: 	'keyword',
		defaultValue 	: 	'src-over',
		description 	: 	'Composite operation. This defines how this layer should behave relative to layers atop or below it.',
		validValues 	: 	['clear', 'src', 'dst', 'src-over', 'dst-over', 'src-in', 'dst-in', 'src-out', 'dst-out', 'src-atop', 'dst-atop', 'xor', 'plus', 'minus', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion', 'contrast', 'invert', 'invert-rgb', 'grain-merge', 'grain-extract', 'hue', 'saturation', 'color', 'value']
		},


		{
		name 		: 	'opacity',
		value 		: 	'float',
		defaultValue 	: 	'1',
		description 	: 	'An alpha value for the style (which means an alpha applied to all features in separate buffer and then composited back to main buffer)',
		validValues 	: 	[]
		}

	]
}

sections.push(_general);


var _map = {
	name : 'Map',
	identifiers : [

		{
		name 		: 	'background-color',
		value 		: 	'color',
		defaultValue 	: 	'none (transparent)',
		description 	: 	'Map Background color',
		validValues 	: 	[]
		},

		{
		name 		: 	'background-image',
		value 		: 	'uri',
		defaultValue 	: 	'none',
		description 	: 	'An image that is repeated below all features on a map as a background.',
		validValues 	: 	[]
		},


		{
		name 		: 	'background-image-comp-op',
		value 		: 	'keyword',
		defaultValue 	: 	'src-over',
		description 	: 	'Set the compositing operation used to blend the image into the background',
		validValues 	: 	['clear', 'src', 'dst', 'src-over', 'dst-over', 'src-in', 'dst-in', 'src-out', 'dst-out', 'src-atop', 'dst-atop', 'xor', 'plus', 'minus', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion', 'contrast', 'invert', 'invert-rgb', 'grain-merge', 'grain-extract', 'hue', 'saturation', 'color', 'value']
		},

		{
		name 		: 	'background-image-opacity',
		value 		: 	'float',
		defaultValue 	: 	'1',
		description 	: 	'Set the opacity of the image',
		validValues 	: 	[]
		},

		{
		name 		: 	'srs',
		value 		: 	'string',
		defaultValue 	: 	'+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs',
		description 	: 	'Map spatial reference (proj4 string)',
		validValues 	: 	[]
		},

		{
		name 		: 	'buffer-size',
		value 		: 	'float',
		defaultValue 	: 	'0',
		description 	: 	'Extra tolerance around the map (in pixels) used to ensure labels crossing tile boundaries are equally rendered in each tile (e.g. cut in each tile). Not intended to be used in combination with "avoid-edges".',
		validValues 	: 	[]
		},

		{
		name 		: 	'base',
		value 		: 	'string',
		defaultValue 	: 	'(This base path defaults to an empty string meaning that any relative paths to files referenced in styles or layers will be interpreted relative to the application process.)',
		description 	: 	'Any relative paths used to reference files will be understood as relative to this directory path if the map is loaded from an in memory object rather than from the filesystem. If the map is loaded from the filesystem and this option is not provided it will be set to the directory of the stylesheet.',
		validValues 	: 	[]
		},

		{
		name 		: 	'font-directory',
		value 		: 	'uri',
		defaultValue 	: 	'none (No map-specific fonts will be registered)',
		description 	: 	'Path to a directory which holds fonts which should be registered when the Map is loaded (in addition to any fonts that may be automatically registered).',
		validValues 	: 	[]
		}
	]
}

sections.push(_map);


var _polygon = {
	name : 'Polygon',
	identifiers : [

		{
		name 		: 	'polygon-fill',
		value 		: 	'color',
		defaultValue 	: 	'rgba(128,128,128,1)',
		description 	: 	'Fill color to assign to a polygon',
		validValues 	: 	[]
		},

		{
		name 		: 	'polygon-opacity',
		value 		: 	'float',
		defaultValue 	: 	'1',
		description 	: 	'The opacity of the polygon',
		validValues 	: 	[]
		},

		{
		name 		: 	'polygon-gamma',
		value 		: 	'float',
		defaultValue 	: 	'1 (fully antialiased) ',
		description 	: 	'Range: 0-1 Level of antialiasing of polygon edges',
		validValues 	: 	[]
		},

		{
		name 		: 	'polygon-gamma-method',
		value 		: 	'keyword',
		defaultValue 	: 	'power',
		description 	: 	'Range: 0-1 Level of antialiasing of polygon edges',
		validValues 	: 	['power', 'linear', 'none', 'threshold', 'multiply']
		},

		{
		name 		: 	'polygon-clip',
		value 		: 	'bolean',
		defaultValue 	: 	'true',
		description 	: 	'geometries are clipped to map bounds by default for best rendering performance. In some cases users may wish to disable this to avoid rendering artifacts.',
		validValues 	: 	['true', 'false']
		},

		{
		name 		: 	'polygon-simplify',
		value 		: 	'float',
		defaultValue 	: 	'0',
		description 	: 	'geometries are simplified by the given tolerance',
		validValues 	: 	[]
		},

		{
		name 		: 	'polygon-simplify-algorithm',
		value 		: 	'keyword',
		defaultValue 	: 	'radial-distance',
		description 	: 	'geometries are simplified by the given algorithm',
		validValues 	: 	['radial-distance', 'zhao-saalfeld', 'visvalingam-whyatt']
		},

		{
		name 		: 	'polygon-smooth',
		value 		: 	'float',
		defaultValue 	: 	'0',
		description 	: 	'Range: 0-1 Smooths out geometry angles. 0 is no smoothing, 1 is fully smoothed. Values greater than 1 will produce wild, looping geometries.',
		validValues 	: 	[]
		},

		{
		name 		: 	'polygon-geometry-transform',
		value 		: 	'functions',
		defaultValue 	: 	'none',
		description 	: 	'Allows transformation functions to be applied to the geometry.',
		validValues 	: 	[]
		},	

		{
		name 		: 	'polygon-comp-op',
		value 		: 	'keyword',
		defaultValue 	: 	'src-over',
		description 	: 	'Composite operation. This defines how this symbolizer should behave relative to symbolizers atop or below it.',
		validValues 	: 	['clear', 'src', 'dst', 'src-over', 'dst-over', 'src-in', 'dst-in', 'src-out', 'dst-out', 'src-atop', 'dst-atop', 'xor', 'plus', 'minus', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion', 'contrast', 'invert', 'invert-rgb', 'grain-merge', 'grain-extract', 'hue', 'saturation', 'color', 'value']
		},

	
		{
		name 		: 	'polygon-pattern-file',
		value 		: 	'uri',
		defaultValue 	: 	'none',
		description 	: 	"Image to use as a repeated pattern fill within a polygon",
		validValues 	: 	[]
		},

		{
		name 		: 	'polygon-pattern-alignment',
		value 		: 	'keyword',
		defaultValue 	: 	'local',
		description 	: 	"Specify whether to align pattern fills to the layer or to the map.",
		validValues 	: 	['local', 'global']
		},

		{
		name 		: 	'polygon-pattern-gamma',
		value 		: 	'float',
		defaultValue 	: 	'1 (fully antialiased)',
		description 	: 	"Range: 0-1 Level of antialiasing of polygon pattern edges",
		validValues 	: 	[]
		},

		{
		name 		: 	'polygon-pattern-opacity',
		value 		: 	'float',
		defaultValue 	: 	'1 (The image is rendered without modifications)',
		description 	: 	"Apply an opacity level to the image used for the pattern",
		validValues 	: 	[]
		},

		{
		name 		: 	'polygon-pattern-clip',
		value 		: 	'boolean',
		defaultValue 	: 	'true (geometry will be clipped to map bounds before rendering)',
		description 	: 	"geometries are clipped to map bounds by default for best rendering performance. In some cases users may wish to disable this to avoid rendering artifacts.",
		validValues 	: 	[]
		},

		{
		name 		: 	'polygon-pattern-simplify',
		value 		: 	'float',
		defaultValue 	: 	'0 (geometry will not be simplified)',
		description 	: 	"geometries are simplified by the given tolerance",
		validValues 	: 	[]
		},

		{
		name 		: 	'polygon-pattern-simplify-algorithm',
		value 		: 	'keyword',
		defaultValue 	: 	'radial-distance (geometry will not be simplified using the radial distance algorithm)',
		description 	: 	"geometries are simplified by the given algorithm",
		validValues 	: 	['radial-distance', 'zhao-saalfeld', 'visvalingam-whyatt']
		},

		{
		name 		: 	'polygon-pattern-smooth',
		value 		: 	'float',
		defaultValue 	: 	'0 (no smoothing)',
		description 	: 	"Range: 0-1 Smooths out geometry angles. 0 is no smoothing, 1 is fully smoothed. Values greater than 1 will produce wild, looping geometries.",
		validValues 	: 	[]
		},

		{
		name 		: 	'polygon-pattern-geometry-transform',
		value 		: 	'functions',
		defaultValue 	: 	'none (geometry will not be transformed)',
		description 	: 	"Allows transformation functions to be applied to the geometry.",
		validValues 	: 	[]
		},

		{
		name 		: 	'polygon-pattern-comp-op',
		value 		: 	'keyword',
		defaultValue 	: 	'src-over',
		description 	: 	"Composite operation. This defines how this symbolizer should behave relative to symbolizers atop or below it.",
		validValues 	: 	['clear', 'src', 'dst', 'src-over', 'dst-over', 'src-in', 'dst-in', 'src-out', 'dst-out', 'src-atop', 'dst-atop', 'xor', 'plus', 'minus', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion', 'contrast', 'invert', 'invert-rgb', 'grain-merge', 'grain-extract', 'hue', 'saturation', 'color', 'value']
		}		
	]
}

sections.push(_polygon);



var _line = {
	name : 'Line',
	identifiers : [

		{
		name 		: 	'line-color',
		value 		: 	'color',
		defaultValue 	: 	'rgba(0,0,0,1) (black and fully opaque (alpha = 1), same as rgb(0,0,0))',
		description 	: 	'The color of a drawn line',
		validValues 	: 	[]
		},

		{
		name 		: 	'line-width',
		value 		: 	'float',
		defaultValue 	: 	'1',
		description 	: 	'The width of a line in pixels',
		validValues 	: 	[]
		},

		{
		name 		: 	'line-opacity',
		value 		: 	'float',
		defaultValue 	: 	'1',
		description 	: 	'The opacity of a line',
		validValues 	: 	[]
		},

		{
		name 		: 	'line-join',
		value 		: 	'keyword',
		defaultValue 	: 	'miter',
		description 	: 	'The behavior of lines when joining',
		validValues 	: 	['miter', 'round', 'bevel']
		},

		{
		name 		: 	'line-cap',
		value 		: 	'keyword',
		defaultValue 	: 	'butt',
		description 	: 	'The display of line endings',
		validValues 	: 	['butt', 'round', 'square']
		},

		{
		name 		: 	'line-gamma',
		value 		: 	'float',
		defaultValue 	: 	'1 (fully antialiased)',
		description 	: 	'Range: 0-1 Level of antialiasing of stroke line',
		validValues 	: 	[]
		},

		{
		name 		: 	'line-gamma-method',
		value 		: 	'keyword',
		defaultValue 	: 	"Default Value: power (pow(x,gamma) is used to calculate pixel gamma, which produces slightly smoother line and polygon antialiasing than the 'linear' method, while other methods are usually only used to disable AA)",
		description 	: 	"An Antigrain Geometry specific rendering hint to control the quality of antialiasing. Under the hood in Mapnik this method is used in combination with the 'gamma' value (which defaults to 1).",
		validValues 	: 	['power', 'linear', 'none', 'threshold', 'multiply']
		},

		{
		name 		: 	'line-dasharray',
		value 		: 	'numbers',
		defaultValue 	: 	'none (solid line)',
		description 	: 	'A pair of length values [a,b], where (a) is the dash length and (b) is the gap length respectively. More than two values are supported for more complex patterns.',
		validValues 	: 	[]
		},	

		{
		name 		: 	'line-dash-offset',
		value 		: 	'numbers',
		defaultValue 	: 	'none (solid line)',
		description 	: 	'valid parameter but not currently used in renderers (only exists for experimental svg support in Mapnik which is not yet enabled)',
		validValues 	: 	[]
		},	

		{
		name 		: 	'line-miterlimit',
		value 		: 	'float',
		defaultValue 	: 	"4 (Will auto-convert miters to bevel line joins when theta is less than 29 degrees as per the SVG spec: 'miterLength / stroke-width = 1 / sin ( theta / 2 )')",
		description 	: 	'The limit on the ratio of the miter length to the stroke-width. Used to automatically convert miter joins to bevel joins for sharp angles to avoid the miter extending beyond the thickness of the stroking path. Normally will not need to be set, but a larger value can sometimes help avoid jaggy artifacts.',
		validValues 	: 	[]
		},	

		{
		name 		: 	'line-clip',
		value 		: 	'bolean',
		defaultValue 	: 	'true (geometry will be clipped to map bounds before rendering)',
		description 	: 	'geometries are clipped to map bounds by default for best rendering performance. In some cases users may wish to disable this to avoid rendering artifacts.',
		validValues 	: 	['true', 'false']
		},

		{
		name 		: 	'line-simplify',
		value 		: 	'float',
		defaultValue 	: 	'0 (geometry will not be simplified)',
		description 	: 	'geometries are simplified by the given tolerance',
		validValues 	: 	[]
		},

		{
		name 		: 	'line-simplify-algorithm',
		value 		: 	'keyword',
		defaultValue 	: 	'radial-distance (geometry will not be simplified using the radial distance algorithm)',
		description 	: 	'geometries are simplified by the given algorithm',
		validValues 	: 	['radial-distance', 'zhao-saalfeld', 'visvalingam-whyatt']
		},

		{
		name 		: 	'line-smooth',
		value 		: 	'float',
		defaultValue 	: 	'0 (no smoothing) Range: 0-1 Smooths out geometry angles. 0 is no smoothing, 1 is fully smoothed. Values greater than 1 will produce wild, looping geometries.',
		description 	: 	'',
		validValues 	: 	[]
		},

		{
		name 		: 	'line-offset',
		value 		: 	'float',
		defaultValue 	: 	'0 (no offset)',
		description 	: 	'Offsets a line a number of pixels parallel to its actual path. Positive values move the line left, negative values move it right (relative to the directionality of the line).',
		validValues 	: 	[]
		},

		{
		name 		: 	'line-rasterizer',
		value 		: 	'keyword',
		defaultValue 	: 	'full',
		description 	: 	'Exposes an alternate AGG rendering method that sacrifices some accuracy for speed.',
		validValues 	: 	['full', 'fast']
		},

		{
		name 		: 	'line-geometry-transform',
		value 		: 	'functions',
		defaultValue 	: 	'none',
		description 	: 	'Composite operation. This defines how this symbolizer should behave relative to symbolizers atop or below it.',
		validValues 	: 	['full', 'fast']
		},	

		{
		name 		: 	'line-comp-op',
		value 		: 	'keyword',
		defaultValue 	: 	'src-over',
		description 	: 	'Composite operation. This defines how this symbolizer should behave relative to symbolizers atop or below it.',
		validValues 	: 	['clear', 'src', 'dst', 'src-over', 'dst-over', 'src-in', 'dst-in', 'src-out', 'dst-out', 'src-atop', 'dst-atop', 'xor', 'plus', 'minus', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion', 'contrast', 'invert', 'invert-rgb', 'grain-merge', 'grain-extract', 'hue', 'saturation', 'color', 'value']
		},

		{
		name 		: 	'line-pattern-file',
		value 		: 	'uri',
		defaultValue 	: 	'none',
		description 	: 	"An image file to be repeated and warped along a line",
		validValues 	: 	[]
		},

		{
		name 		: 	'line-pattern-clip',
		value 		: 	'boolean',
		defaultValue 	: 	'true (geometry will be clipped to map bounds before rendering)',
		description 	: 	"geometries are clipped to map bounds by default for best rendering performance. In some cases users may wish to disable this to avoid rendering artifacts.",
		validValues 	: 	[]
		},

		{
		name 		: 	'line-pattern-simplify',
		value 		: 	'float',
		defaultValue 	: 	'0 (geometry will not be simplified)',
		description 	: 	"geometries are simplified by the given tolerance",
		validValues 	: 	[]
		},

		{
		name 		: 	'line-pattern-simplify-algorithm',
		value 		: 	'keyword',
		defaultValue 	: 	'radial-distance (geometry will not be simplified using the radial distance algorithm)',
		description 	: 	"geometries are simplified by the given algorithm",
		validValues 	: 	['radial-distance', 'zhao-saalfeld', 'visvalingam-whyatt']
		},

		{
		name 		: 	'line-pattern-smooth',
		value 		: 	'float',
		defaultValue 	: 	'0 (no smoothing) ',
		description 	: 	"Range: 0-1 Smooths out geometry angles. 0 is no smoothing, 1 is fully smoothed. Values greater than 1 will produce wild, looping geometries.",
		validValues 	: 	[]
		},

		{
		name 		: 	'line-pattern-offset',
		value 		: 	'float',
		defaultValue 	: 	'0 (no offset)',
		description 	: 	"Offsets a line a number of pixels parallel to its actual path. Positive values move the line left, negative values move it right (relative to the directionality of the line).",
		validValues 	: 	[]
		},

		{
		name 		: 	'line-pattern-geometry-transform',
		value 		: 	'functions',
		defaultValue 	: 	'none (geometry will not be transformed)',
		description 	: 	"Allows transformation functions to be applied to the geometry.",
		validValues 	: 	[]
		},

		{
		name 		: 	'line-pattern-comp-op',
		value 		: 	'keyword',
		defaultValue 	: 	'src-over (add the current symbolizer on top of other symbolizer)',
		description 	: 	"Composite operation. This defines how this symbolizer should behave relative to symbolizers atop or below it.",
		validValues 	: 	['clear', 'src', 'dst', 'src-over', 'dst-over', 'src-in', 'dst-in', 'src-out', 'dst-out', 'src-atop', 'dst-atop', 'xor', 'plus', 'minus', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion', 'contrast', 'invert', 'invert-rgb', 'grain-merge', 'grain-extract', 'hue', 'saturation', 'color', 'value']
		}		

	]
}

sections.push(_line);




var _marker = {
	name : 'Markers',
	identifiers : [

		{
		name 		: 	'marker-file',
		value 		: 	'uri',
		defaultValue 	: 	'(An ellipse or circle, if width equals height)',
		description 	: 	'An SVG file that this marker shows at each placement. If no file is given, the marker will show an ellipse.',
		validValues 	: 	[]
		},

		{
		name 		: 	'marker-opacity',
		value 		: 	'float',
		defaultValue 	: 	'1 (The stroke-opacity and fill-opacity will be used)',
		description 	: 	'The overall opacity of the marker, if set, overrides both the opacity of both the fill and stroke',
		validValues 	: 	[]
		},

		{
		name 		: 	'marker-fill-opacity',
		value 		: 	'float',
		defaultValue 	: 	'1 (opaque)',
		description 	: 	'The fill opacity of the marker',
		validValues 	: 	[]
		},

		{
		name 		: 	'marker-line-color',
		value 		: 	'color',
		defaultValue 	: 	'black',
		description 	: 	'The color of the stroke around a marker shape.',
		validValues 	: 	[]
		},
	
		{
		name 		: 	'marker-line-width',
		value 		: 	'float',
		defaultValue 	: 	'undefined',
		description 	: 	'The width of the stroke around a marker shape, in pixels. This is positioned on the boundary, so high values can cover the area itself.',
		validValues 	: 	[]
		},
	
		{
		name 		: 	'marker-line-opacity',
		value 		: 	'float',
		defaultValue 	: 	'1 (opaque)',
		description 	: 	'The opacity of a line',
		validValues 	: 	[]
		},

		{
		name 		: 	'marker-placement',
		value 		: 	'keyword',
		defaultValue 	: 	'point',
		description 	: 	"Attempt to place markers on a point, in the center of a polygon, or if markers-placement:line, then multiple times along a line. 'interior' placement can be used to ensure that points placed on polygons are forced to be inside the polygon interior",
		validValues 	: 	['point', 'line', 'interior']
		},

		{
		name 		: 	'marker-multi-policy',
		value 		: 	'keyword',
		defaultValue 	: 	'each (If a feature contains multiple geometries and the placement type is either point or interior then a marker will be rendered for each)',
		description 	: 	"A special setting to allow the user to control rendering behavior for 'multi-geometries' (when a feature contains multiple geometries). This setting does not apply to markers placed along lines. The 'each' policy is default and means all geometries will get a marker. The 'whole' policy means that the aggregate centroid between all geometries will be used. The 'largest' policy means that only the largest (by bounding box areas) feature will get a rendered marker (this is how text labeling behaves by default).",
		validValues 	: 	['each', 'whole', 'largest']
		},

		{
		name 		: 	'marker-type',
		value 		: 	'keyword',
		defaultValue 	: 	'ellipse',
		description 	: 	"The default marker-type. If a SVG file is not given as the marker-file parameter, the renderer provides either an arrow or an ellipse (a circle if height is equal to width)",
		validValues 	: 	['arrow', 'ellipse']
		},

		{
		name 		: 	'marker-width',
		value 		: 	'expression',
		defaultValue 	: 	'10',
		description 	: 	"The width of the marker, if using one of the default types.",
		validValues 	: 	[]
		},

		{
		name 		: 	'marker-height',
		value 		: 	'expression',
		defaultValue 	: 	'10',
		description 	: 	"The height of the marker, if using one of the default types.",
		validValues 	: 	[]
		},

		{
		name 		: 	'marker-fill',
		value 		: 	'color',
		defaultValue 	: 	'blue',
		description 	: 	"The color of the area of the marker.",
		validValues 	: 	[]
		},

		{
		name 		: 	'marker-allow-overlap',
		value 		: 	'bolean',
		defaultValue 	: 	'false (Do not allow makers to overlap with each other - overlapping markers will not be shown.)',
		description 	: 	"Control whether overlapping markers are shown or hidden.",
		validValues 	: 	['true', 'false']
		},
	
		{
		name 		: 	'marker-ignore-placement',
		value 		: 	'bolean',
		defaultValue 	: 	'false (do not store the bbox of this geometry in the collision detector cache)',
		description 	: 	"value to control whether the placement of the feature will prevent the placement of other features",
		validValues 	: 	['true', 'false']
		},

		{
		name 		: 	'marker-spacing',
		value 		: 	'float',
		defaultValue 	: 	'100',
		description 	: 	"Space between repeated markers in pixels. If the spacing is less than the marker size or larger than the line segment length then no marker will be placed",
		validValues 	: 	[]
		},

		{
		name 		: 	'marker-max-error',
		value 		: 	'float',
		defaultValue 	: 	'0.2',
		description 	: 	"The maximum difference between actual marker placement and the marker-spacing parameter. Setting a high value can allow the renderer to try to resolve placement conflicts with other symbolizers.",
		validValues 	: 	[]
		},

		{
		name 		: 	'marker-transform',
		value 		: 	'functions',
		defaultValue 	: 	'(No transformation)',
		description 	: 	"SVG transformation definition",
		validValues 	: 	[]
		},

		{
		name 		: 	'marker-clip',
		value 		: 	'boolean',
		defaultValue 	: 	'true (geometry will be clipped to map bounds before rendering)',
		description 	: 	"geometries are clipped to map bounds by default for best rendering performance. In some cases users may wish to disable this to avoid rendering artifacts.",
		validValues 	: 	['true', 'false']
		},

		{
		name 		: 	'marker-smooth',
		value 		: 	'float',
		defaultValue 	: 	'0 (no smoothing) Range: 0-1 Smooths out geometry angles. 0 is no smoothing, 1 is fully smoothed. Values greater than 1 will produce wild, looping geometries.',
		description 	: 	"",
		validValues 	: 	[]
		},

		{
		name 		: 	'marker-geometry-transform',
		value 		: 	'functions',
		defaultValue 	: 	'none (geometry will not be transformed)',
		description 	: 	"Allows transformation functions to be applied to the geometry.",
		validValues 	: 	[]
		},


		{
		name 		: 	'marker-comp-op',
		value 		: 	'keyword',
		defaultValue 	: 	'src-over (add the current symbolizer on top of other symbolizer)',
		description 	: 	"Composite operation. This defines how this symbolizer should behave relative to symbolizers atop or below it.",
		validValues 	: 	['clear', 'src', 'dst', 'src-over', 'dst-over', 'src-in', 'dst-in', 'src-out', 'dst-out', 'src-atop', 'dst-atop', 'xor', 'plus', 'minus', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion', 'contrast', 'invert', 'invert-rgb', 'grain-merge', 'grain-extract', 'hue', 'saturation', 'color', 'value']
		},
	]

};


sections.push(_marker);





var _shield = {
	name : 'Shield',
	identifiers : [

		{
		name 		: 	'shield-name',
		value 		: 	'expression',
		defaultValue 	: 	'undefined',
		description 	: 	"Value to use for a shield's text label. Data columns are specified using brackets like [column_name]",
		validValues 	: 	[]
		},

		{
		name 		: 	'shield-file',
		value 		: 	'uri',
		defaultValue 	: 	'none',
		description 	: 	"Image file to render behind the shield text",
		validValues 	: 	[]
		},

		{
		name 		: 	'shield-face-name',
		value 		: 	'string',
		defaultValue 	: 	'',
		description 	: 	"Font name and style to use for the shield text",
		validValues 	: 	[]
		},

		{
		name 		: 	'shield-unlock-image',
		value 		: 	'boolean',
		defaultValue 	: 	'false (text alignment relative to the shield image uses the center of the image as the anchor for text positioning.)',
		description 	: 	"This parameter should be set to true if you are trying to position text beside rather than on top of the shield image",
		validValues 	: 	[]
		},

		{
		name 		: 	'shield-size',
		value 		: 	'float',
		defaultValue 	: 	'undefined',
		description 	: 	"The size of the shield text in pixels",
		validValues 	: 	[]
		},

		{
		name 		: 	'shield-fill',
		value 		: 	'color',
		defaultValue 	: 	'undefined',
		description 	: 	"The color of the shield text",
		validValues 	: 	[]
		},

		{
		name 		: 	'shield-placement',
		value 		: 	'keyword',
		defaultValue 	: 	'point',
		description 	: 	"How this shield should be placed. Point placement attempts to place it on top of points, line places along lines multiple times per feature, vertex places on the vertexes of polygons, and interior attempts to place inside of polygons.",
		validValues 	: 	['point', 'line', 'vertex', 'interior']
		},

		{
		name 		: 	'shield-avoid-edges',
		value 		: 	'boolean',
		defaultValue 	: 	'false',
		description 	: 	"Avoid placing shields that intersect with tile boundaries.",
		validValues 	: 	[]
		},

		{
		name 		: 	'shield-allow-overlap',
		value 		: 	'boolean',
		defaultValue 	: 	'false (Do not allow shields to overlap with other map elements already placed.)',
		description 	: 	"Control whether overlapping shields are shown or hidden.",
		validValues 	: 	[]
		},

		{
		name 		: 	'shield-min-distance',
		value 		: 	'float',
		defaultValue 	: 	'0',
		description 	: 	"Minimum distance to the next shield symbol, not necessarily the same shield.",
		validValues 	: 	[]
		},

		{
		name 		: 	'shield-spacing',
		value 		: 	'float',
		defaultValue 	: 	'0',
		description 	: 	"The spacing between repeated occurrences of the same shield on a line",
		validValues 	: 	[]
		},

		{
		name 		: 	'shield-min-padding',
		value 		: 	'float',
		defaultValue 	: 	'0',
		description 	: 	"Minimum distance a shield will be placed from the edge of a metatile.",
		validValues 	: 	[]
		},

		{
		name 		: 	'shield-wrap-width',
		value 		: 	'unsigned',
		defaultValue 	: 	'0',
		description 	: 	"Length of a chunk of text in characters before wrapping text",
		validValues 	: 	[]
		},

		{
		name 		: 	'shield-wrap-before boolean',
		value 		: 	'',
		defaultValue 	: 	'false',
		description 	: 	"Wrap text before wrap-width is reached. If false, wrapped lines will be a bit longer than wrap-width.",
		validValues 	: 	[]
		},

		{
		name 		: 	'shield-wrap-character',
		value		: 	'string',
		defaultValue 	: 	'',
		description 	: 	"Use this character instead of a space to wrap long names.",
		validValues 	: 	[]
		},

		{
		name 		: 	'shield-halo-fill',
		value		: 	'color',
		defaultValue 	: 	'#FFFFFF (white)',
		description 	: 	"Specifies the color of the halo around the text.",
		validValues 	: 	[]
		},

		{
		name 		: 	'shield-halo-radius',
		value		: 	'float',
		defaultValue 	: 	'0 (no halo)',
		description 	: 	"Specify the radius of the halo in pixels",
		validValues 	: 	[]
		},

		{
		name 		: 	'shield-character-spacing',
		value		: 	'unsigned',
		defaultValue 	: 	'0',
		description 	: 	"Horizontal spacing between characters (in pixels). Currently works for point placement only, not line placement.",
		validValues 	: 	[]
		},

		{
		name 		: 	'shield-line-spacing',
		value		: 	'unsigned',
		defaultValue 	: 	'undefined',
		description 	: 	"Vertical spacing between lines of multiline labels (in pixels)",
		validValues 	: 	[]
		},

		{
		name 		: 	'shield-text-dx',
		value		: 	'float',
		defaultValue 	: 	'0',
		description 	: 	"Displace text within shield by fixed amount, in pixels, +/- along the X axis. A positive value will shift the text right",
		validValues 	: 	[]
		},

		{
		name 		: 	'shield-text-dy',
		value		: 	'float',
		defaultValue 	: 	'0',
		description 	: 	"Displace text within shield by fixed amount, in pixels, +/- along the Y axis. A positive value will shift the text down",
		validValues 	: 	[]
		},

		{
		name 		: 	'shield-dx',
		value		: 	'float',
		defaultValue 	: 	'0',
		description 	: 	"Displace shield by fixed amount, in pixels, +/- along the X axis. A positive value will shift the text right",
		validValues 	: 	[]
		},

		{
		name 		: 	'shield-dy',
		value		: 	'float',
		defaultValue 	: 	'0',
		description 	: 	"Displace shield by fixed amount, in pixels, +/- along the Y axis. A positive value will shift the text down",
		validValues 	: 	[]
		},

		{
		name 		: 	'shield-opacity',
		value		: 	'float',
		defaultValue 	: 	'1',
		description 	: 	"The opacity of the image used for the shield",
		validValues 	: 	[]
		},

		{
		name 		: 	'shield-text-opacity',
		value		: 	'float',
		defaultValue 	: 	'1',
		description 	: 	"The opacity of the text placed on top of the shield",
		validValues 	: 	[]
		},

		{
		name 		: 	'shield-horizontal-alignment',
		value		: 	'keyword',
		defaultValue 	: 	'auto',
		description 	: 	"The shield's horizontal alignment from its centerpoint",
		validValues 	: 	['left', 'middle', 'right', 'auto']
		},

		{
		name 		: 	'shield-vertical-alignment',
		value		: 	'keyword',
		defaultValue 	: 	'middle',
		description 	: 	"The shield's vertical alignment from its centerpoint",
		validValues 	: 	['top', 'middle', 'bottom', 'auto']
		},

		{
		name 		: 	'shield-placement-type',
		value		: 	'keyword',
		defaultValue 	: 	'dummy',
		description 	: 	'Re-position and/or re-size shield to avoid overlaps. "simple" for basic algorithm (using shield-placements string,) "dummy" to turn\',this feature off.',
		validValues 	: 	['dummy', 'simple']
		},

		{
		name 		: 	'shield-placements',
		value		: 	'string',
		defaultValue 	: 	'',
		description 	: 	'If "placement-type" is set to "simple", use this "POSITIONS,[SIZES]" string. An example is shield-placements: &quot;E,NE,SE,W,NW,SW&quot;;',
		validValues 	: 	[]
		},

		{
		name 		: 	'shield-text-transform',
		value		: 	'keyword',
		defaultValue 	: 	'none',
		description 	: 	"Transform the case of the characters",
		validValues 	: 	['none', 'uppercase', 'lowercase', 'capitalize']
		},

		{
		name 		: 	'shield-justify-alignment',
		value		: 	'keyword',
		defaultValue 	: 	'auto',
		description 	: 	"Define how text in a shield's label is justified",
		validValues 	: 	['left', 'center', 'right', 'auto']
		},

		{
		name 		: 	'shield-transform',
		value		: 	'functions',
		defaultValue 	: 	'(No transformation)',
		description 	: 	"SVG transformation definition",
		validValues 	: 	[]
		},

		{
		name 		: 	'shield-clip',
		value		: 	'boolean',
		defaultValue 	: 	'true (geometry will be clipped to map bounds before rendering)',
		description 	: 	"geometries are clipped to map bounds by default for best rendering performance. In some cases users may wish to disable this to avoid rendering artifacts.",
		validValues 	: 	[]
		},

		{
		name 		: 	'shield-comp-op',
		value		: 	'keyword',
		defaultValue 	: 	'src-over (add the current symbolizer on top of other symbolizer)',
		description 	: 	"Composite operation. This defines how this symbolizer should behave relative to symbolizers atop or below it.",
		validValues 	: 	['clear', 'src', 'dst', 'src-over', 'dst-over', 'src-in', 'dst-in', 'src-out', 'dst-out', 'src-atop', 'dst-atop', 'xor', 'plus', 'minus', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion', 'contrast', 'invert', 'invert-rgb', 'grain-merge', 'grain-extract', 'hue', 'saturation', 'color', 'value']
		}

	]

};

sections.push(_shield);


var _point = {
	name : 'Point',
	identifiers : [

		{
		name 		: 	'point-file',
		value 		: 	'uri',
		defaultValue 	: 	'none',
		description 	: 	"Image file to represent a point",
		validValues 	: 	[]
		},

		{
		name 		: 	'point-allow-overlap',
		value 		: 	'boolean',
		defaultValue 	: 	'false (Do not allow points to overlap with each other - overlapping markers will not be shown.)',
		description 	: 	"Control whether overlapping points are shown or hidden.",
		validValues 	: 	[]
		},

		{
		name 		: 	'point-ignore-placement',
		value 		: 	'boolean',
		defaultValue 	: 	'false (do not store the bbox of this geometry in the collision detector cache)',
		description 	: 	"value to control whether the placement of the feature will prevent the placement of other features",
		validValues 	: 	[]
		},

		{
		name 		: 	'point-opacity',
		value 		: 	'float',
		defaultValue 	: 	'1 (Fully opaque)',
		description 	: 	"A value from 0 to 1 to control the opacity of the point",
		validValues 	: 	[]
		},

		{
		name 		: 	'point-placement',
		value 		: 	'keyword',
		defaultValue 	: 	'centroid',
		description 	: 	"How this point should be placed. Centroid calculates the geometric center of a polygon, which can be outside of it, while interior always places inside of a polygon.",
		validValues 	: 	['centroid', 'interior']
		},

		{
		name 		: 	'point-transform',
		value 		: 	'functions',
		defaultValue 	: 	'(No transformation)',
		description 	: 	"SVG transformation definition",
		validValues 	: 	[]
		},

		{
		name 		: 	'point-comp-op',
		value 		: 	'keyword',
		defaultValue 	: 	'src-over (add the current symbolizer on top of other symbolizer)',
		description 	: 	"Composite operation. This defines how this symbolizer should behave relative to symbolizers atop or below it.",
		validValues 	: 	['clear', 'src', 'dst', 'src-over', 'dst-over', 'src-in', 'dst-in', 'src-out', 'dst-out', 'src-atop', 'dst-atop', 'xor', 'plus', 'minus', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion', 'contrast', 'invert', 'invert-rgb', 'grain-merge', 'grain-extract', 'hue', 'saturation', 'color', 'value']		
		}

	]
}

sections.push(_point);		


var _text = {
	name : 'Text',
	identifiers : [

		{
		name 		: 	'text-name',
		value 		: 	'expression',
		defaultValue 	: 	'',
		description 	: 	"Value to use for a text label. Data columns are specified using brackets like [column_name]",
		validValues 	: 	[],
		},

		{
		name 		: 	'text-face-name',
		value 		: 	'string',
		defaultValue 	: 	'undefined',
		description 	: 	"Font name and style to render a label in",
		validValues 	: 	[],
		},

		{
		name 		: 	'text-size',
		value 		: 	'float',
		defaultValue 	: 	'10',
		description 	: 	"Text size in pixels",
		validValues 	: 	[],
		},

		{
		name 		: 	'text-ratio',
		value 		: 	'unsigned',
		defaultValue 	: 	'0',
		description 	: 	"Define the amount of text (of the total) present on successive lines when wrapping occurs",
		validValues 	: 	[],
		},

		{
		name 		: 	'text-wrap-width',
		value 		: 	'unsigned',
		defaultValue 	: 	'0',
		description 	: 	"Length of a chunk of text in characters before wrapping text",
		validValues 	: 	[],
		},

		{
		name 		: 	'text-wrap-before',
		value 		: 	'boolean',
		defaultValue 	: 	'false',
		description 	: 	"Wrap text before wrap-width is reached. If false, wrapped lines will be a bit longer than wrap-width.",
		validValues 	: 	[],
		},

		{
		name 		: 	'text-wrap-character',
		value 		: 	'string',
		defaultValue 	: 	'',
		description 	: 	"Use this character instead of a space to wrap long text.",
		validValues 	: 	[],
		},

		{
		name 		: 	'text-spacing',
		value 		: 	'unsigned',
		defaultValue 	: 	'undefined',
		description 	: 	"Distance between repeated text labels on a line (aka. label-spacing)",
		validValues 	: 	[],
		},

		{
		name 		: 	'text-character-spacing',
		value 		: 	'float',
		defaultValue 	: 	'0',
		description 	: 	"Horizontal spacing adjustment between characters in pixels",
		validValues 	: 	[],
		},

		{
		name 		: 	'text-line-spacing',
		value 		: 	'unsigned',
		defaultValue 	: 	'0',
		description 	: 	"Vertical spacing adjustment between lines in pixels",
		validValues 	: 	[],
		},

		{
		name 		: 	'text-label-position-tolerance',
		value 		: 	'unsigned',
		defaultValue 	: 	'0',
		description 	: 	"Allows the label to be displaced from its ideal position by a number of pixels (only works with placement:line)",
		validValues 	: 	[],
		},

		{
		name 		: 	'text-max-char-angle-delta',
		value 		: 	'float',
		defaultValue 	: 	'22.5',
		description 	: 	"The maximum angle change, in degrees, allowed between adjacent characters in a label. This value internally is converted to radians to the default is 22.5*math.pi/180.0. The higher the value the fewer labels will be placed around around sharp corners.",
		validValues 	: 	[],
		},

		{
		name 		: 	'text-fill',
		value 		: 	'color',	
		defaultValue 	: 	'#000000 (black)',
		description 	: 	"Specifies the color for the text",
		validValues 	: 	[],
		},

		{
		name 		: 	'text-opacity',
		value 		: 	'float',
		defaultValue 	: 	'1 (Fully opaque)',
		description 	: 	"A number from 0 to 1 specifying the opacity for the text",
		validValues 	: 	[],
		},

		{
		name 		: 	'text-halo-fill',
		value 		: 	'color',
		defaultValue 	: 	'#FFFFFF (white)',
		description 	: 	"Specifies the color of the halo around the text.",
		validValues 	: 	[],
		},

		{
		name 		: 	'text-halo-radius',
		value 		: 	'float',
		defaultValue 	: 	'0 (no halo)',
		description 	: 	"Specify the radius of the halo in pixels",
		validValues 	: 	[],
		},

		{
		name 		: 	'text-halo-rasterizer',
		value 		: 	'keyword',
		defaultValue 	: 	'full',
		description 	: 	"Exposes an alternate text halo rendering method that sacrifices quality for speed.",
		validValues 	: 	['full', 'fast']
		},

		{
		name 		: 	'text-dx',
		value 		: 	'float',
		defaultValue 	: 	'0',
		description 	: 	"Displace text by fixed amount, in pixels, +/- along the X axis. A positive value will shift the text right",
		validValues 	: 	[],
		},

		{
		name 		: 	'text-dy',
		value 		: 	'float',
		defaultValue 	: 	'0',
		description 	: 	"Displace text by fixed amount, in pixels, +/- along the Y axis. A positive value will shift the text down",
		validValues 	: 	[],
		},

		{
		name 		: 	'text-vertical-alignment',
		value 		: 	'keyword',
		defaultValue 	: 	'auto (Default affected by value of dy; "bottom" for dy>0, "top" for dy<\0.)',
		description 	: 	"Position of label relative to point position.",
		validValues 	: 	['top', 'middle', 'bottom', 'auto']
		},

		{
		name 		: 	'text-avoid-edges',
		value 		: 	'boolean',
		defaultValue 	: 	'false',
		description 	: 	"Avoid placing labels that intersect with tile boundaries.",
		validValues 	: 	[],
		},

		{
		name 		: 	'text-min-distance',
		value 		: 	'float',
		defaultValue 	: 	'undefined',
		description 	: 	"Minimum permitted distance to the next text symbolizer.",
		validValues 	: 	[],
		},

		{
		name 		: 	'text-min-padding',
		value 		: 	'float',
		defaultValue 	: 	'undefined',
		description 	: 	"Minimum distance a text label will be placed from the edge of a metatile.",
		validValues 	: 	[],
		},

		{
		name 		: 	'text-min-path-length',
		value 		: 	'float',
		defaultValue 	: 	'0 (place labels on all paths)',
		description 	: 	"Place labels only on paths longer than this value.",
		validValues 	: 	[],
		},

		{
		name 		: 	'text-allow-overlap',
		value 		: 	'boolean',
		defaultValue 	: 	'false (Do not allow text to overlap with other text - overlapping markers will not be shown.)',
		description 	: 	"Control whether overlapping text is shown or hidden.",
		validValues 	: 	[],
		},

		{
		name 		: 	'text-orientation',
		value 		: 	'expression',
		defaultValue 	: 	'undefined',
		description 	: 	"Rotate the text.",
		validValues 	: 	[],
		},

		{
		name 		: 	'text-placement',
		value 		: 	'keyword',
		defaultValue 	: 	'point',
		description 	: 	"Control the style of placement of a point versus the geometry it is attached to.",
		validValues 	: 	['point', 'line', 'vertex', 'interior']
		},

		{
		name 		: 	'text-placement-type',
		value 		: 	'keyword',
		defaultValue 	: 	'dummy',
		description 	: 	'Re-position and/or re-size text to avoid overlaps. "simple" for basic algorithm (using text-placements string,) "dummy" to turn this feature off.',
		validValues 	: 	['dummy', 'simple']
		},

		{
		name 		: 	'text-placements',
		value 		: 	'string',
		defaultValue 	: 	'',
		description 	: 	'If "placement-type" is set to "simple", use this "POSITIONS,[SIZES]" string. An example is text-placements: &quot;E,NE,SE,W,NW,SW&quot;;',
		validValues 	: 	[],
		},

		{
		name 		: 	'text-transform',
		value 		: 	'keyword',
		defaultValue 	: 	'none',
		description 	: 	"Transform the case of the characters",
		validValues 	: 	['none', 'uppercase', 'lowercase', 'capitalize']
		},

		{
		name 		: 	'text-horizontal-alignment',
		value 		: 	'keyword',
		defaultValue 	: 	'auto',
		description 	: 	"The text's horizontal alignment from its centerpoint",
		validValues 	: 	['left', 'middle', 'right', 'auto']
		},

		{
		name 		: 	'text-align',
		value 		: 	'keyword',
		defaultValue 	: 	'auto (Auto alignment means that text will be centered by default except when using the placement-type parameter - in that case either right or left justification will be used automatically depending on where the text could be fit given the text-placements directives)',
		description 	: 	"Define how text is justified",
		validValues 	: 	['left', 'right', 'center', 'auto']
		},

		{
		name 		: 	'text-clip',
		value 		: 	'boolean',
		defaultValue 	: 	'true (geometry will be clipped to map bounds before rendering)',
		description 	: 	"geometries are clipped to map bounds by default for best rendering performance. In some cases users may wish to disable this to avoid rendering artifacts.",
		validValues 	: 	[],		
		},

		{
		name 		: 	'text-comp-op',
		value 		: 	'keyword',
		defaultValue 	: 	'src-over (add the current symbolizer on top of other symbolizer)',
		description 	: 	"Composite operation. This defines how this symbolizer should behave relative to symbolizers atop or below it.",
		validValues 	: 	['clear', 'src', 'dst', 'src-over', 'dst-over', 'src-in', 'dst-in', 'src-out', 'dst-out', 'src-atop', 'dst-atop', 'xor', 'plus', 'minus', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion', 'contrast', 'invert', 'invert-rgb', 'grain-merge', 'grain-extract', 'hue', 'saturation', 'color', 'value']		
		}
	]
}

sections.push(_text);


var _raster = {
	name : 'Raster',
	identifiers : [

		{
		name 		: 	'raster-opacity',
		value 		: 	'float',
		defaultValue 	: 	'1 (opaque)',
		description 	: 	"The opacity of the raster symbolizer on top of other symbolizers.",
		validValues 	: 	[]
		},

		{
		name 		: 	'raster-filter-factor',
		value 		: 	'float',
		defaultValue 	: 	'-1 (Allow the datasource to choose appropriate downscaling.)',
		description 	: 	"This is used by the Raster or Gdal datasources to pre-downscale images using overviews. Higher numbers can sometimes cause much better scaled image output, at the cost of speed.",
		validValues 	: 	[]
		},

		{
		name 		: 	'raster-scaling',
		value 		: 	'keyword',
		defaultValue 	: 	'near',
		description 	: 	"The scaling algorithm used to making different resolution versions of this raster layer. Bilinear is a good compromise between speed and accuracy, while lanczos gives the highest quality.",
		validValues 	: 	['near', 'fast', 'bilinear', 'bilinear8', 'bicubic', 'spline16', 'spline36', 'hanning', 'hamming', 'hermite', 'kaiser', 'quadric', 'catrom', 'gaussian', 'bessel', 'mitchell', 'sinc', 'lanczos', 'blackman']
		},

		{
		name 		: 	'raster-mesh-size',
		value 		: 	'unsigned',
		defaultValue 	: 	'16 (Reprojection mesh will be 1/16 of the resolution of the source image)',
		description 	: 	"A reduced resolution mesh is used for raster reprojection, and the total image size is divided by the mesh-size to determine the quality of that mesh. Values for mesh-size larger than the default will result in faster reprojection but might lead to distortion.",
		validValues 	: 	[]
		},

		{
		name 		: 	'raster-comp-op',
		value 		: 	'keyword',
		defaultValue 	: 	'src-over (add the current symbolizer on top of other symbolizer)',
		description 	: 	"Composite operation. This defines how this symbolizer should behave relative to symbolizers atop or below it.",
		validValues 	: 	['clear', 'src', 'dst', 'src-over', 'dst-over', 'src-in', 'dst-in', 'src-out', 'dst-out', 'src-atop', 'dst-atop', 'xor', 'plus', 'minus', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion', 'contrast', 'invert', 'invert-rgb', 'grain-merge', 'grain-extract', 'hue', 'saturation', 'color', 'value']		
		},

		{
		name 		: 	'raster-colorizer-default-mode',
		value 		: 	'keyword',
		defaultValue 	: 	'undefined',
		description 	: 	"",
		validValues 	: 	['discrete', 'linear', 'exact']
		},

		{
		name 		: 	'raster-colorizer-default-color',
		value 		: 	'color',
		defaultValue 	: 	'undefined',
		description 	: 	"",
		validValues 	: 	[]
		},

		{
		name 		: 	'raster-colorizer-epsilon',
		value 		: 	'float',
		defaultValue 	: 	'undefined',
		description 	: 	"",
		validValues 	: 	[]		
		},

		{
		name 		: 	'raster-colorizer-stops',
		value 		: 	'tags',
		defaultValue 	: 	'undefined',
		description 	: 	"",
		validValues 	: 	[]
		}

	]
}

sections.push(_raster);


var _building = {
	name : 'Buildings',
	identifiers : [

		{
		name 		: 	'building-fill',
		value 		: 	'color',
		defaultValue 	: 	'#FFFFFF (white)',
		description 	: 	"The color of the buildings walls.",
		validValues 	: 	[]
		},

		{
		name 		: 	'building-fill-opacity',
		value 		: 	'float',
		defaultValue 	: 	'1',
		description 	: 	"The opacity of the building as a whole, including all walls.",
		validValues 	: 	[]
		},

		{
		name 		: 	'building-height',
		value 		: 	'expression',
		defaultValue 	: 	'0',
		description 	: 	"The height of the building in pixels.",
		validValues 	: 	[]
		},

	]
}

sections.push(_building);


var _debug = {
	name : 'Debug',
	identifiers : [

		{
		name 		: 	'debug-mode',
		value 		: 	'string',
		defaultValue 	: 	'collision',
		description 	: 	"The mode for debug rendering",
		validValues 	: 	[]
		}

	]
}

sections.push(_debug);






// VALUES
// VALUES
// VALUES


var values = [];


var _color = {
	name : 'Color',
	identifiers : [

		{
		description	: 	'CartoCSS accepts a variety of syntaxes for colors - HTML-style hex values, rgb, rgba, hsl, and hsla. It also supports the predefined HTML colors names, like <span class="c">yellow</span> and <span class="c">blue</span>.',
		code 		: 	'<span class="r">#line</span> {<br>line-color: <span class="r">#ff0</span>;<br>line-color: <span class="r">#ffff00</span>;<br>line-color: rgb(<span class="r">255</span>, <span class="r">255</span>, <span class="r">0</span>);<br>line-color: rgba(<span class="r">255</span>, <span class="r">255</span>, <span class="r">0</span>, <span class="r">1</span>);<br>line-color: hsl(<span class="r">100</span>, <span class="r">50%</span>, <span class="r">50%</span>);<br>line-color: hsla(<span class="r">100</span>, <span class="r">50%</span>, <span class="r">50%</span>, <span class="r">1</span>);<br>line-color: <span class="b">yellow</span>;<br>}'
		},

		{
		description	: 	'Especially of note is the support for hsl, which can be easier to reason about than rgb(). Carto also includes several color functions borrowed from less:',
		code 		: 	'<span class="gray">// lighten and darken colors</span><br>lighten(<span class="r">#ace</span>, 10%);<br>darken(<span class="r">#ace</span>, 10%);<br><br><span class="gray">// saturate and desaturate</span><br>saturate(<span class="r">#550000</span>, 10%);<br>desaturate(<span class="r">#00ff00</span>, 10%);<br><br><span class="gray">// increase or decrease the opacity of a color</span><br>fadein(<span class="r">#fafafa</span>, 10%);<br>fadeout(<span class="r">#fefefe</span>, 14%);<br><br><span class="gray">// spin rotates a color around the color wheel by degrees</span><br>spin(<span class="r">#ff00ff</span>, 10);<br><br><span class="gray">// mix generates a color in between two other colors.</span><br>mix(<span class="r">#fff</span>, <span class="r">#000</span>, 50%);<br>These functions all take arguments which can be color variables, literal colors, or the results of other functions operating on colors.'
		},

		{
		description	: 	'These functions all take arguments which can be color variables, literal colors, or the results of other functions operating on colors.',
		code 		: 	''
		},
	]
}

values.push(_color);


var _float = {
	name : 'Float',
	identifiers : [

		{
		description	: 	'Float is a fancy way of saying \'number\'. In CartoCSS, you specify just a number - unlike CSS, there are no units, but everything is specified in pixels.',
		code 		: 	'<span class="r">#line</span> {<br>line-width: <span class="r">2</span>;<br>}'
		},


		{
		description	: 	'It\'s also possible to do simple math with number values:',
		code 		: 	'<span class="r">#line</span> {<br>line-width: <span class="r">4</span> / <span class="r">2</span>;<span class="gray"> // division</span><br>line-width: <span class="r">4</span> + <span class="r">2</span>;<span class="gray"> // addition</span><br>line-width: <span class="r">4</span> - <span class="r">2</span>;<span class="gray"> // subtraction</span><br>line-width: <span class="r">4</span> * <span class="r">2</span>;<span class="gray"> // multiplication</span><br>line-width: <span class="r">4</span> % <span class="r">2</span>;<span class="gray"> // modulus</span><br>}'
		},
	]
}

values.push(_float);


var _uri = {
	name : 'Uri',
	identifiers : [

		{
		description	: 	"URI is a fancy way of saying URL. When an argument is a URI, you use the same kind of url('place.png') notation that you would with HTML. Quotes around the URL aren't required, but are highly recommended. URIs can be paths to places on your computer, or on the internet.",
		code 		: 	'<span class="r">#markers</span> {<br>marker-file: <span class="br">url(\'marker.png\')</span>;<br>}'
		}
	]
}

values.push(_uri);


var _string = {
	name : 'String',
	identifiers : [

		{
		description	: 	'A string is basically just text. In the case of CartoCSS, you\'re going to put it in quotes. Strings can be anything, though pay attention to the cases of <span class="c">text-name</span> and <span class="c">shield-name</span> - they actually will refer to features, which you refer to by putting them in brackets, as seen in the example below.',
		code 		: 	'<span class="r">#labels</span> {<br>text-name: <span class="br">"[MY_FIELD]"</span>;<br>}'
		}
	]
}

values.push(_string);


var _bolean = {
	name : 'Bolean',
	identifiers : [

		{
		description	: 	'Boolean means yes or no, so it accepts the values <span class="c">true</span> or <span class="c">false</span>.',
		code 		: 	'<span class="r">#markers</span> {<br>marker-allow-overlap:true;<br>}'
		}
	]
}

values.push(_bolean);


var _expressions = {
	name : 'Expressions',
	identifiers : [

		{
		description	: 	'Expressions are statements that can include fields, numbers, and other types in a really flexible way. You have run into expressions before, in the realm of \'fields\', where you\'d specify <span class="c">"[FIELD]"</span>, but expressions allow you to drop the quotes and also do quick addition, division, multiplication, and concatenation from within Carto syntax.',
		code 		: 	'<span class="r">#buildings</span> {<br>building-height: <span class="br">[HEIGHT_FIELD]</span> * <span class="r">10</span>;<br>}'
		}
	]
}

values.push(_expressions);


var _numbers = {
	name : 'Numbers',
	identifiers : [

		{
		description	: 	'Numbers are comma-separated lists of one or more number in a specific order. They\'re used in line dash arrays, in which the numbers specify intervals of line, break, and line again.',
		code 		: 	'<span class="r">#disputedboundary</span> {<br>line-dasharray: <span class="r">1</span>, <span class="r">4</span>, <span class="r">2</span>;<br>}'
		}
	]
}

values.push(_numbers);


var _percentages = {
	name : 'Percentages',
	identifiers : [

		{
		description	: 	'In Carto, the percentage symbol, <span class="c">%</span> universally means <span class="c">value/100</span>. It\'s meant to be used with ratio-related properties, like opacity rules.<br><br><em>You should not use percentages as widths, heights, or other properties - unlike CSS, percentages are not relative to cascaded classes or page size, they\'re, as stated, simply the value divided by one hundred.</em>',
		code 		: 	'<span class="r">#world</span> {<br><span class="gray"><span class="gray">// this syntax</span></span><br>polygon-opacity: <span class="r">50%</span>;<br><br><span class="gray">// is equivalent to</span><br>polygon-opacity: <span class="r">0.5</span>;<br>}'
		}
	]
}

values.push(_percentages);


var _functions = {
	name : 'Functions',
	identifiers : [

		{
		description	: 	'Functions are comma-separated lists of one or more functions. For instance, transforms use the <span class="c">functions</span> type to allow for transforms within Carto, which are optionally chainable.',
		code 		: 	'<span class="r">#point</span> {<br>point-transform: scale(<span class="r">2</span>, <span class="r">2</span>);<br>}'
		}
	]
}

values.push(_functions);