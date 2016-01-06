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

# env vars
PGPASSWORD=docker
PGUSERNAME=docker
PGHOST=postgis

# import raster
raster2pgsql -I -C $1 $2 | PGPASSWORD=$PGPASSWORD psql --host=$PGHOST --username=$PGUSERNAME $3