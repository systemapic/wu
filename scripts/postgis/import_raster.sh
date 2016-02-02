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


# get config
source /systemapic/config/env.sh

# env vars
PGPASSWORD=$SYSTEMAPIC_PGSQL_PASSWORD
PGUSERNAME=$SYSTEMAPIC_PGSQL_USERNAME
PGHOST=postgis

# import raster
raster2pgsql -I -C $1 $2 | PGPASSWORD=$PGPASSWORD psql --host=$PGHOST --username=$PGUSERNAME $3