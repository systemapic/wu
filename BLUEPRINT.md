

BLUEPRINT
=========

#Vector Tiles
-------------

Upload GeoJSON, Shapefiles, anything --> Convert to vector tiles --> serve as tiled GeoJSON, raster image.

Once converted, the original datasource—shapefile, geojson, postgis database—is no longer necessary. Paired with a renderer like the super fast Mapnik and a CartoCSS stylesheet, vector tiles can be rendered as images, UTFGrids, geojson, and more. And the possibilities are wide open for rendering directly on mobile devices or in the browser.

Place to start:
----------------
* [https://www.mapbox.com/blog/vector-tiles/](Mapbox Vector Tiles)
* [https://github.com/mapbox/mapnik-vector-tile](Vector Tile Renderer)