CHEATSHEET for common commands
==============================

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

Wu.Util._getJSON('http://85.10.202.87:8080/egypt.json', function (json) { d3_to_map(json); }); 

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

	//	new projection         to              from
	ogr2ogr  -t_srs EPSG:4269 EGY-level_1C.shp EGY-level_1B.shp


if from projection is missing, must assign a projection to source first, with -s_srs:
	// 	   old proj          new proj            to            from
	ogr2ogr -s_srs EPSG:4269 -t_srs EPSG:3857 EGY-level_1B.shp EGY-level_1.shp

--------------------------------------------------------------



###Get info on shp file 


	ogrinfo -al EGY-level_1.shp | less
---------------------------------------------------------------


###SSH tunnel with mongodb

	ssh -L 8089:127.0.0.1:27017 -f -C -q -N sx 
------------------------

###Clone javascript object
	//returns a reference to first arg, with 2nd arg copied (without connection)  
	a = Wu.extend({} || b, c);





