CHEATSHEET for common commands:
===============================

###Adding geojson straight to leaflet map:
	var t = {
		"type": "GeometryCollection",
		"geometries": [{
			"type": "Polygon",
			"coordinates": [
				[ [41.83,71.01],[56.95,33.75],[21.79,36.56],[41.83,71.01] ]
			]
			},{
				"type": "MultiPoint",
				"coordinates": [ [100, 0],[45, -122] ]
			}
		]
	}

	layer = L.geoJson(t);
	layer.addTo(app._map);

-----------------------------------------



###Getting geojson from url and adding to map
	Wu.Util._getJSON('http://85.10.202.87:8080/egypt.json', function (json) { 

		window.g2 = json;
		var layer = L.geoJson(json);
		layer.addTo(app._map);

	});


------------------------------------------



###Getting json from object and adding to map with **d3.js**

	// get geosjon from server
	Wu.Util._getJSON('http://85.10.202.87:8080/egypt.json', function (json) { d3_to_map(json); }); 

	// callback
	function d3_to_map(json) {

		var map = app._map;
		var svg = d3.select(map.getPanes().overlayPane).append("svg"),
				g = svg.append("g").attr("class", "leaflet-zoom-hide");

		var collection  = json;
		var transform   = d3.geo.transform({point: projectPoint}),
				path        = d3.geo.path().projection(transform);

		var feature = g.selectAll("path")
									.data(collection.features)
									.enter().append("path");

		map.on("viewreset", reset);
		reset();

		// Reposition the SVG to cover the features.
		function reset() {
			var bounds = path.bounds(collection),
					topLeft = bounds[0],
					bottomRight = bounds[1];

			svg.attr("width", bottomRight[0] - topLeft[0])
					.attr("height", bottomRight[1] - topLeft[1])
					.style("left", topLeft[0] + "px")
					.style("top", topLeft[1] + "px");

			g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

			feature.attr("d", path);
		}

		// Use Leaflet to implement a D3 geometric transformation.
		function projectPoint(x, y) {
			var point = map.latLngToLayerPoint(new L.LatLng(y, x));
			this.stream.point(point.x, point.y);
		}

	}
--------------------------------------------------------------



###Re-project .shp file

	//		new projection         to              from
	ogr2ogr  -t_srs EPSG:4269 EGY-level_1C.shp EGY-level_1B.shp

If from projection is missing, must assign a projection to source first, with -s_srs

	// 	   old proj          new proj            to            from
	ogr2ogr -s_srs EPSG:4269 -t_srs EPSG:3857 EGY-level_1B.shp EGY-level_1.shp

--------------------------------------------------------------


###Projection info:

I haven't worked too much into Leaflet so I cant say much about their implementation but looks like they are doing it the same way as other API's like google maps etc do. Their also you give Lat/Long coordinates and the reason is because you more often deal with GPS data which is in WGS84. Internally it could be doing the conversion to mercator.

If you look at the Leaflet documentation you can see that they use Mercator by default 3857. One way to deal with this is to convert your mercator coordinates into WGS84 lat long (using  proj4js library) and then use it in Leaflet. Something like this

var sourceCRS = new Proj4js.Proj('EPSG:3857'); 
var destCRS = new Proj4js.Proj('EPSG:4326'); 
var pt = new Proj4js.Point(X,Y);
Proj4js.transform(sourceCRS, destCRS, pt);

Where X, Y are in meters
(from https://www.quora.com/Why-are-coordinates-in-Leaflet-in-degrees-if-it-uses-the-Google-Mercator-coordinate-reference-system)






There are a few things that you are mixing up.

Google Earth is in a Geographic coordinate system with the wgs84 datum. (EPSG: 4326)

Google Maps is in a projected coordinate system that is based on the wgs84 datum. (EPSG 3857)

The data in Open Street Map database is stored in a gcs with units decimal degrees & datum of wgs84. (EPSG: 4326)

The Open Street Map tiles and the WMS webservice, are in the projected coordinate system that is based on the wgs84 datum. (EPSG 3857)

So if you are making a web map, which uses the tiles from Google Maps or tiles from the Open Street Map webservice, they will be in Sperical Mercator (EPSG 3857 or srid: 900913) and hence your map has to have the same projection.

Edit:

I'll like to expand the point raised by mkennedy

All of this further confused by that fact that often even though the map is in Web Mercator(EPSG: 3857), the actual coordinates used are in lat-long (EPSG: 4326). This convention is used in many places, such as:

In Most Mapping API,s You can give the coordinates in Lat-long, and the API automatically transforms it to the appropriate Web Mercator coordinates.
While Making a KML, you will always give the coordinates in geographic Lat-long, even though it might be showed on top of a web Mercator map.
Most mobile mapping Libraries use lat-long for position, while the map is in web Mercator.

(from https://gis.stackexchange.com/questions/48949/epsg-3857-or-4326-for-googlemaps-openstreetmap-and-leaflet)



###Get info on shp file 
	ogrinfo -al EGY-level_1.shp | less
---------------------------------------------------------------


###SSH tunnel with mongodb

	ssh -L 8089:127.0.0.1:27017 -f -C -q -N sx 
------------------------

###Clone javascript object
	//returns a reference to first arg, with 2nd arg copied (without connection)  
	a = Wu.extend({} || b, c);


------------------------------

### Put OSM data in PostGIS database

     osm2pgsql -s -U gisuser -d osmdb new-york-latest.osm
