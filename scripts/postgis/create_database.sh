#!/bin/bash

echo $1

if [ -z "$3" ]; then
	echo "Usage: $0 <database> <owner_name> <owner_uuid>" >&2
  exit 1
fi
DBNAME=$1
OWNER_NAME=$2
OWNER_UUID=$3

# get config or die
source /systemapic/config/env.sh || exit 1

export PGUSER=${SYSTEMAPIC_PGSQL_USERNAME}
export PGPASSWORD=${SYSTEMAPIC_PGSQL_PASSWORD}
export PGHOST=postgis


PSQL="psql --no-password"

# create database
${PSQL} -d template1 -c \
  "CREATE DATABASE ${DBNAME} TEMPLATE ${SYSTEMAPIC_PGSQL_DBNAME}"

export PGDATABASE=${DBNAME}

# add owner_info
TIMESTAMP=$(date +%s)
${PSQL} -c "CREATE TABLE owner_info ( name text, uuid text, created_at integer);"
${PSQL} -c "INSERT INTO owner_info VALUES ('$2', '$3', $TIMESTAMP);"
