#!/bin/bash
export PAGER="/usr/bin/less -S"
export PGPASSWORD=docker 
psql -h postgis --username=docker systemapic
