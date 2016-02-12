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

# get config
source /systemapic/config/env.sh

export PGUSER=${SYSTEMAPIC_PGSQL_USERNAME}
export PGPASSWORD=${SYSTEMAPIC_PGSQL_PASSWORD}
export PGHOST=postgis

psql -d $1 -c "select row_to_json(t) from (SELECT ST_GeometryType(geom) FROM $2 LIMIT 1) t"
