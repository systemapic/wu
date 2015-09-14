#!/bin/bash

if [ "$1" == "" ]; then
	echo "Must provide database as first argument,"
	echo ""
	echo "Usage: ./get_histogram.sh DATABASE TABLE COLUMN num_buckets [bar] (if you want to show bar in console)"
	exit 1 # missing args
fi

if [ "$2" == "" ]; then
	echo "Must provide table as second argument,"
	echo ""
	exit 1 # missing args
fi


PGPASSWORD=docker psql -U docker -d $1 -h postgis -c "select row_to_json(t) from (SELECT ST_GeometryType(geom) FROM $2 LIMIT 1) t"