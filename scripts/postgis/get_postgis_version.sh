#!/bin/bash


# get config
source /systemapic/config/env.sh

# PGPASSWORD=docker psql -U docker -d $1 -h postgis -c "CREATE TABLE owner_info ( name text, uuid text, created_at integer);"
# PGPASSWORD=docker psql -U docker -d systemapic -h postgis -c "SELECT row_to_json(t) FROM ( SELECT PostGIS_full_version()) t;"
PGPASSWORD=$SYSTEMAPIC_PGSQL_PASSWORD psql -U $SYSTEMAPIC_PGSQL_USERNAME -d $SYSTEMAPIC_PGSQL_DBNAME -h postgis -c "SELECT row_to_json(t) FROM ( SELECT PostGIS_full_version()) t;"
