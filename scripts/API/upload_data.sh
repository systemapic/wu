#!/bin/bash

# enter details
USERNAME=email
PASSWORD=passord
SERVER=maps.globesar.com
FILEPATH=/home/tsx_tiny.tar.gz

# prepare
ACCESS_TOKEN=$(curl -s --data "grant_type=password&username=$USERNAME&password=$PASSWORD" https://$SERVER/api/token | jq -r ".access_token")
USERUUID=$(curl -s --data "access_token=$ACCESS_TOKEN" https://$SERVER/api/user/info | jq -r ".uuid")

# upload
curl -s --form "userUuid=$USERUUID" --form "data=@$FILEPATH" --form "access_token=$ACCESS_TOKEN" https://$SERVER/api/import

# works! :)