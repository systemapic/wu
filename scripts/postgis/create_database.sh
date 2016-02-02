#!/bin/bash

echo $1

if [ "$1" == "" ]; then
	exit 1 # missing args
fi

if [ "$2" == "" ]; then
	exit 1 # missing args
fi

if [ "$3" == "" ]; then
	exit 1 # missing args
fi

# get config
source /systemapic/config/env.sh

# @strk: should template1 be the base? or we're doing systemapic now?
BASEDB=template1

# create database
PGPASSWORD=$SYSTEMAPIC_PGSQL_PASSWORD psql -U $SYSTEMAPIC_PGSQL_USERNAME -d $BASEDB -h postgis -c "CREATE DATABASE $1"

# enable spatial
PGPASSWORD=$SYSTEMAPIC_PGSQL_PASSWORD psql -U $SYSTEMAPIC_PGSQL_USERNAME -d $1 -h postgis -c "CREATE EXTENSION postgis"
PGPASSWORD=$SYSTEMAPIC_PGSQL_PASSWORD psql -U $SYSTEMAPIC_PGSQL_USERNAME -d $1 -h postgis -c "CREATE EXTENSION postgis_topology"
PGPASSWORD=$SYSTEMAPIC_PGSQL_PASSWORD psql -U $SYSTEMAPIC_PGSQL_USERNAME -d $1 -h postgis -c "CREATE EXTENSION fuzzystrmatch"
PGPASSWORD=$SYSTEMAPIC_PGSQL_PASSWORD psql -U $SYSTEMAPIC_PGSQL_USERNAME -d $1 -h postgis -c "CREATE EXTENSION postgis_tiger_geocoder"

# add owner_info
TIMESTAMP=$(date +%s)
PGPASSWORD=$SYSTEMAPIC_PGSQL_PASSWORD psql -U $SYSTEMAPIC_PGSQL_USERNAME -d $1 -h postgis -c "CREATE TABLE owner_info ( name text, uuid text, created_at integer);"
PGPASSWORD=$SYSTEMAPIC_PGSQL_PASSWORD psql -U $SYSTEMAPIC_PGSQL_USERNAME -d $1 -h postgis -c "INSERT INTO owner_info VALUES ('$2', '$3', $TIMESTAMP);"
