#!/bin/bash

. `dirname $0`/run_in_docker.inc

# get config
source /systemapic/config/env.sh

export PAGER="/usr/bin/less -S"
export PGPASSWORD=$SYSTEMAPIC_PGSQL_PASSWORD 
export PGUSER=$SYSTEMAPIC_PGSQL_USERNAME
export PGDATABASE=template1

psql -h postgis $@
