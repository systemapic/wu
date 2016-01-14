#!/bin/bash




# PGPASSWORD=docker psql -U docker -d $1 -h postgis -c "CREATE TABLE owner_info ( name text, uuid text, created_at integer);"
PGPASSWORD=docker psql -U docker -d systemapic -h postgis -c "SELECT row_to_json(t) FROM ( SELECT version()) t;"
