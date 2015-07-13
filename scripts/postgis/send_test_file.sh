#!/bin/bash

# get access token
USERNAME=foudroyant4@gmail.com
PASSWORD=lokapassord99
ENDPOINT=/api/data/import
FILE=/home/DATA/geojson/file-12906f95-12a8-40bf-8e83-5a2c8a47f347.geojson
ACCESSTOKEN=$(curl --header "Authorization: Basic YWJjMTIzOnNzaC1zZWNyZXQ=" --data "grant_type=password&username=$USERNAME&password=$PASSWORD&scope=offline_access" https://dev.systemapic.com/oauth/token -s | jq -r '.access_token')
# echo $ACCESSTOKEN

curl --form "userUuid=loka" --form "meta=feta" --form "data=@$FILE" --header "Authorization: Bearer $ACCESSTOKEN" https://dev.systemapic.com$ENDPOINT | python -mjson.tool