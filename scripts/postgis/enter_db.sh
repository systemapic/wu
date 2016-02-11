#!/bin/bash

# get config
source /systemapic/config/env.sh

export PAGER="/usr/bin/less -S"
export PGPASSWORD=$SYSTEMAPIC_PGSQL_PASSWORD 
psql -h postgis --username=$SYSTEMAPIC_PGSQL_USERNAME template1
