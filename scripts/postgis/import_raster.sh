#!/bin/bash

if [ -z "$3" ]; then
	echo "Usage: $0 <raster> <table> <database> [<source_srid>]" >&2
	exit 1
fi

INPUTRASTERFILE=$1
TABLENAME=$2
export PGDATABASE=$3
S_SRS=
test -n "$4" && S_SRS="-s_srs EPSG:$4"


# get config
. /systemapic/config/env.sh || exit 1

# env vars
export PGUSER=$SYSTEMAPIC_PGSQL_USERNAME
export PGPASSWORD=$SYSTEMAPIC_PGSQL_PASSWORD
export PGHOST=postgis

# Reproject to EPSG:3857
RASTERFILE=/tmp/import_raster_$$.tif
gdalwarp -t_srs EPSG:3857 ${S_SRS} ${INPUTRASTERFILE} ${RASTERFILE} || exit 1

TILESIZE="128x128"

# import raster
set -o pipefail # needed to get an error if raster2pgsql errors out
raster2pgsql \
	-s 3857 -I -C -Y \
	-t ${TILESIZE} \
	${RASTERFILE} $TABLENAME |
	psql -q --set ON_ERROR_STOP=1
