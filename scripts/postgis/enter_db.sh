#!/bin/bash

# get config
source /systemapic/config/env.sh
# echo $SYSTEMAPIC_PGSQL_USERNAME
# echo $SYSTEMAPIC_PGSQL_PASSWORD
# echo $SYSTEMAPIC_PGSQL_DBNAME

export PAGER="/usr/bin/less -S"
export PGPASSWORD=$SYSTEMAPIC_PGSQL_PASSWORD 
psql -h postgis --username=$SYSTEMAPIC_PGSQL_USERNAME $SYSTEMAPIC_PGSQL_DBNAME
