#!/bin/bash

if [ "$1" == "" ]; then
	exit 1 # missing args
fi

if [ "$2" == "" ]; then
	exit 1 # missing args
fi

if [ "$3" == "" ]; then
	exit 1 # missing args
fi

SRID="-s $4"
if [ "$4" == "" ]; then
	# exit 1 # missing args
	SRID=""
fi

# get config
source /systemapic/config/env.sh

# env vars
PGPASSWORD=$SYSTEMAPIC_PGSQL_PASSWORD
PGUSERNAME=$SYSTEMAPIC_PGSQL_USERNAME
PGHOST=postgis

# encoding // todo!
ENCODING="-W 'LATIN1"
# ENCODING=""
ENCODING=$5

echo "Importing shapefile, SRID: $SRID"
echo $1
echo $2


# import shapefile
shp2pgsql -D $SRID $ENCODING "$1" $2 | PGPASSWORD=$PGPASSWORD psql -q --host=$PGHOST --username=$PGUSERNAME $3 || echo "FAILEDFAILED!"