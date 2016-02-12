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

# get config
source /systemapic/config/env.sh

export PGUSER=${SYSTEMAPIC_PGSQL_USERNAME}
export PGPASSWORD=${SYSTEMAPIC_PGSQL_PASSWORD}
export PGHOST=postgis
export PSQL="psql --no-password"
export PGDATABASE=$1

# PGPASSWORD=docker $PSQL -U docker -d $1 -h postgis -c "CREATE TABLE owner_info ( name text, uuid text, created_at integer);"
$PSQL -c "DROP TABLE $2;"
