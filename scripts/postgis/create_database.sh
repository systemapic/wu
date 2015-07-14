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

# create database
PGPASSWORD=docker psql -U docker -d systemapic -h postgis -c "CREATE DATABASE $1"

# enable spatial
PGPASSWORD=docker psql -U docker -d $1 -h postgis -c "CREATE EXTENSION postgis"
PGPASSWORD=docker psql -U docker -d $1 -h postgis -c "CREATE EXTENSION postgis_topology"
PGPASSWORD=docker psql -U docker -d $1 -h postgis -c "CREATE EXTENSION fuzzystrmatch"
PGPASSWORD=docker psql -U docker -d $1 -h postgis -c "CREATE EXTENSION postgis_tiger_geocoder"

# add owner_info
TIMESTAMP=$(date +%s)
PGPASSWORD=docker psql -U docker -d $1 -h postgis -c "CREATE TABLE owner_info ( name text, uuid text, created_at integer);"
PGPASSWORD=docker psql -U docker -d $1 -h postgis -c "INSERT INTO owner_info VALUES ('$2', '$3', $TIMESTAMP);"
