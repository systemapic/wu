#!/bin/bash

. `dirname $0`/run_in_docker.inc

if [ -z "$2" ]; then
  # TODO: also take schema and column !
	echo "Usage: $0 <database> <table> [<column>]"
	exit 1 
fi

DATABASE=$1
TABLE=$2
COL=rast
test -n "$3" && COL="$3"

# get config
source /systemapic/config/env.sh || exit 1

export PGPASSWORD=$SYSTEMAPIC_PGSQL_PASSWORD
export PGUSER=$SYSTEMAPIC_PGSQL_USERNAME
export PGHOST=postgis
export PGDATABASE=$DATABASE

cat<<EOF | psql
SELECT
ST_AsGeoJSON(ST_Extent(ST_Transform(
  ST_Envelope("$COL"::geometry),
4326))) FROM "$TABLE";
EOF
