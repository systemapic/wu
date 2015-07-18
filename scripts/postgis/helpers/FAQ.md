
PROJECTIONS, GCS
----

- Leaflet default EPSG is 3857 (Spherical Mercator)
- GeoJSON must be in EPSG 4326 when put into Leaflet. (https://github.com/Leaflet/Leaflet/issues/2226)
- A Geographic Coordinate System does not have a projection. Only Projected Coordinate Systems have projections.





Things to take care of when importing
--
1. that the "geom" field is correct. Can be different in Shapefiles, must be standardized, or at least noticed.
2. SRID. must convert to 3857 (which is used by leaflet) on IMPORT (ie. using shp2psql), or with postgis query afterwards. (could create "the_geom_webmercator" on each table). 
3. 






globesar data:
--------------
name: cetin3 file (turkey)
path: /home/old_postgis_docker/data/cetin3/cetin3_SBAS_6x5_22d-sbas-direct_UTM38N.zip
db: zzjihbcpqm
table: shape_qbbdijgmex
epsg: 32638









FAQ
---
Q. What is the difference between WGS 84 and EPSG 4326? It seems like for a given dataset it might be both WGS 84 and EPSG 4326.
A. EPSG 4326 defines a full coordinate reference system, providing spatial meaning to otherwise meaningless pairs of numbers. It means "latitude and longitude coordinates on the WGS84 reference ellipsoid."

Q. What are Projected Coordinate Systems?
A. A projected coordinate system is defined on a flat, two-dimensional surface. Unlike a geographic coordinate system, a projected coordinate system has constant lengths, angles, and areas across the two dimensions. A projected coordinate system is always based on a geographic coordinate system that is based on a sphere or spheroid.

Q. What are Geographic Coordinate Systems?
A. You can think of a Geographic Coordinate Systems as data that is defined by a 3-D surface and measured in latitude and longitude.  An example of a Geographic Coordinate System would be "WGS 1983" or "North American Datum 1983".  You may also wonder what a "Datum" is.  Just remember that the term "Datum" and "Geograhpic Coordinate System" can be used interchangeably.  Essentially a Datum provides a "frame of reference for measureing locations on the surface of the earth i.e. lines of latitude and longitude."  http://help.arcgis.com/en/arcgisdesktop/10.0/help/index.html#/What_are_geographic_coordinate_systems/003r00000006000000/

Q. What's the difference between a projection and a datum?
A. https://gis.stackexchange.com/questions/664/whats-the-difference-between-a-projection-and-a-datum




References
---
- Reprojecting grids: http://www.directionsmag.com/entry/reprojecting-grids/124167
- http://prj2epsg.org/search