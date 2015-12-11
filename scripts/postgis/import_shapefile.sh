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


# env vars
PGPASSWORD=docker
PGUSERNAME=docker
PGHOST=postgis

# encoding // todo!
ENCODING="-W 'LATIN1"
ENCODING=""

echo "Importing shapefile, srid: $SRID"

# import shapefile

# shp2pgsql -D -s $4 $ENCODING -I "$1" $2 | PGPASSWORD=$PGPASSWORD psql --host=$PGHOST --username=$PGUSERNAME $3
shp2pgsql -D $SRID $ENCODING "$1" $2 | PGPASSWORD=$PGPASSWORD psql -q --host=$PGHOST --username=$PGUSERNAME $3 