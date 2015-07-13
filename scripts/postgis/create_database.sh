#!/bin/bash

echo $1

if [ "$1" == "" ]; then
	exit 1 # no args
fi

PGPASSWORD=docker psql -U docker -d systemapic -h postgis -c "CREATE DATABASE tester"