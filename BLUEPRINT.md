

BLUEPRINT
=========

#Vector Tiles

Upload GeoJSON, Shapefiles, anything -> Convert to vector tiles -> Serve as tiled GeoJSON, raster image.

> Once converted, the original datasource—shapefile, geojson, postgis database—is no longer necessary. Paired with a renderer like the super fast Mapnik and a CartoCSS stylesheet, vector tiles can be rendered as images, UTFGrids, geojson, and more. And the possibilities are wide open for rendering directly on mobile devices or in the browser.

Places to start:
----------------
* [Mapbox Vector Tiles](https://www.mapbox.com/blog/vector-tiles/)
* [Vector Tile Renderer](https://github.com/mapbox/mapnik-vector-tile)
* [Node-mapnik](https://github.com/mapnik/node-mapnik) Node.js binding to Mapnik (and can be used to create vector tiles)
* [Vector Tile Spec](https://github.com/mapbox/vector-tile-spec/wiki/Implementations)
* [MapboxGL.js](https://github.com/mapbox/mapbox-gl-js) (Not necessary for using vector tiles, but no doubt way of the future.)


#Roadmap

Features:
---------
* Websockets
* MapboxGL.js
* Chat
* Live feeds
* Embedding
* Video raster
* Medialibrary


Structure:
----------
* Hosting
* Paywall
