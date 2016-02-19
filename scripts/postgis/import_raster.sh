#!/bin/bash

if [ -z "$3" ]; then
	echo "Usage: $0 <raster> <table> <database> [<srid>]" >&2
	exit 1
fi

RASTERFILE=$1
TABLENAME=$2
export PGDATABASE=$3
SRID=
test -n "$4" && SRID="-s $4"


# get config
. /systemapic/config/env.sh || exit 1

# env vars
export PGUSER=$SYSTEMAPIC_PGSQL_USERNAME
export PGPASSWORD=$SYSTEMAPIC_PGSQL_PASSWORD
export PGHOST=postgis

# import raster
set -o pipefail # needed to get an error if raster2pgsql errors out
raster2pgsql \
	${SRID} -I -C \
	$RASTERFILE $TABLENAME |
	psql -q --set ON_ERROR_STOP=1
