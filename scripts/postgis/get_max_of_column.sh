#!/bin/bash


if [ "$1" == "" ]; then
	echo "Must provide database as first argument,"
	echo ""
	exit 1 # missing args
fi

if [ "$2" == "" ]; then
	echo "Must provide table as second argument,"
	echo ""
	exit 1 # missing args
fi

if [ "$3" == "" ]; then
	echo "Must provide column as third argument,"
	echo ""
	exit 1 # missing args
fi


# get config
source /systemapic/config/env.sh
# echo $SYSTEMAPIC_PGSQL_USERNAME
# echo $SYSTEMAPIC_PGSQL_PASSWORD
# echo $SYSTEMAPIC_PGSQL_DBNAME

PGPASSWORD=$SYSTEMAPIC_PGSQL_PASSWORD psql -U $SYSTEMAPIC_PGSQL_USERNAME -d $1 -h postgis -c "select row_to_json(t) from (select MAX($3), MIN($3), AVG($3) from $2) t;"

