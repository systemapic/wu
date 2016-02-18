#!/bin/bash

. `dirname $0`/run_in_docker.inc

# get config
source /systemapic/config/env.sh

export PGUSER=$SYSTEMAPIC_PGSQL_USERNAME
export PGPASSWORD=$SYSTEMAPIC_PGSQL_PASSWORD
export PGHOST=postgis
export PGDATABASE=template1

psql -c "select row_to_json(t) from ( SELECT version() ) t";
