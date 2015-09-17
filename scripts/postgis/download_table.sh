#!/bin/bash


if [ "$1" == "" ]; then
	echo "Must provide database as first argument,"
	echo ""
	exit 1 # missing args
fi

if [ "$2" == "" ]; then
	echo "Must provide folder as second argument,"
	echo ""
	exit 1 # missing args
fi

if [ "$3" == "" ]; then
	echo "Must provide query as third argument,"
	echo ""
	exit 1 # missing args
fi


PGPASSWORD=docker
PGUSERNAME=docker
PGHOST=postgis

pgsql2shp -f $2 -h $PGHOST -u $PGUSERNAME -P $PGPASSWORD $1 "$3"

