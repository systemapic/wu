#!/bin/bash


if [ "$1" == "" ]; then
	echo "Must provide database as first argument,"
	echo ""
	exit 1 # missing args
fi

if [ "$2" == "" ]; then
	echo "Must provide table as second argument,"
	echo ""
	exit 1 # missing args
fi


# PGPASSWORD=docker psql -U docker -d $1 -h postgis -c "CREATE TABLE owner_info ( name text, uuid text, created_at integer);"
PGPASSWORD=docker psql -U docker -d $1 -h postgis -c "SELECT ST_AsGeoJSON(ST_EXTENT(the_geom_4326)) FROM $2;"