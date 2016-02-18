#!/bin/bash

# We assume there's no "docker" command inside the docker
which docker && {
  echo "We're probably outside the wu docker"
  test -n "$SYSTEMAPIC_DOMAIN" || {
    echo "Please export SYSTEMAPIC_DOMAIN env variable" >&2
    exit 1
  }
  container=${SYSTEMAPIC_DOMAIN}_wu_1
  echo "Executing myself inside container ${container}"
  exec docker exec -ti ${container} \
    ./scripts/postgis/enter_db.sh
}

# get config
source /systemapic/config/env.sh

export PAGER="/usr/bin/less -S"
export PGPASSWORD=$SYSTEMAPIC_PGSQL_PASSWORD 
psql -h postgis --username=$SYSTEMAPIC_PGSQL_USERNAME template1
