#!/bin/bash

# # enter details
# USERNAME=email
# PASSWORD=passord
# SERVER=maps.globesar.com
# FILEPATH=/home/tsx_tiny.tar.gz

# enter details
USERNAME=knutole@systemapic.com
PASSWORD=***REMOVED***
SERVER=dev.systemapic.com
FILEPATH=/home/tsx_tiny.tar.gz
PROJECTUUID=project-c72c3d83-ff96-4483-8f39-f942c0187108

# prepare
ACCESS_TOKEN=$(curl -s --data "grant_type=password&username=$USERNAME&password=$PASSWORD" https://$SERVER/api/token | jq -r ".access_token")
USERUUID=$(curl -s --data "access_token=$ACCESS_TOKEN" https://$SERVER/api/user/info | jq -r ".uuid")

# upload
curl -s --form "userUuid=$USERUUID" --form "projectUuid=$PROJECTUUID" --form "data=@$FILEPATH" --form "access_token=$ACCESS_TOKEN" https://$SERVER/api/import

# works! :)