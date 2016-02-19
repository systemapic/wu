#!/bin/bash

. `dirname $0`/run_in_docker.inc

node `dirname $0`/create_user.js $@
