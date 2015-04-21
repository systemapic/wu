#!/bin/bash
../tools/pp2gdal2tiles.py --processes=6 -w none -p mercator --no-kml "$1" "$2"

# "/data/tmp/r-41d38731-d7aa-4b32-85b6-e48a97372d36-TerrametricsStd_GeoTiff.tif" "/data/raster_tiles/file-7aabcd73-10f8-40d0-8a1f-097949019d95/raster/"