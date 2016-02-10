#!/bin/bash

USERNAME=knutole@systemapic.com
PASSWORD=***REMOVED***
SERVER=dev.systemapic.com

PROJECTNAME=test_from_bash

# get access token
ACCESS_TOKEN=$(curl -s --data "grant_type=password&username=$USERNAME&password=$PASSWORD" https://$SERVER/api/token | jq -r ".access_token")

# get resource
curl -s --data "access_token=$ACCESS_TOKEN&name=$PROJECTNAME" https://$SERVER/api/project/create | python -mjson.tool

# works! :)