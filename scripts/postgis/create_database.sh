#!/bin/bash

echo $1

if [ "$1" == "" ]; then
	exit 1 # no args
fi

PGPASSWORD=docker psql -U docker -d systemapic -h postgis -c "CREATE DATABASE $1"
PGPASSWORD=docker psql -U docker -d $1 -h postgis -c "CREATE EXTENSION postgis"
PGPASSWORD=docker psql -U docker -d $1 -h postgis -c "CREATE EXTENSION postgis_topology"
PGPASSWORD=docker psql -U docker -d $1 -h postgis -c "CREATE EXTENSION fuzzystrmatch"
PGPASSWORD=docker psql -U docker -d $1 -h postgis -c "CREATE EXTENSION postgis_tiger_geocoder"
