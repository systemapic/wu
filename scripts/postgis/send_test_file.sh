#!/bin/bash

# get access token
USERNAME=foudroyant4@gmail.com
PASSWORD=lokapassord99
ACCESSTOKEN=$(curl --header "Authorization: Basic YWJjMTIzOnNzaC1zZWNyZXQ=" --data "grant_type=password&username=$USERNAME&password=$PASSWORD&scope=offline_access" https://dev.systemapic.com/oauth/token -s | jq -r '.access_token')

# endpoint and file
ENDPOINT=/api/data/import
# FILE=/home/DATA/geojson/file-12906f95-12a8-40bf-8e83-5a2c8a47f347.geojson
FILE=/data/files/file-d723ea6c-1b77-4d03-bec6-fce947b72a30/Africa_SHP.zip
# FILE=/var/www/vile/tests/rasters/ecw/geodata/raster/ecw/valencia2002/valencia2002.ecw
# FILE=/data/files/file-766618f0-5cf2-4913-88b4-8e6a0e476d58/road.tar.gz

# curl endpoint
curl -s --form "userUuid=loka" --form "meta=feta" --form "data=@$FILE" --header "Authorization: Bearer $ACCESSTOKEN" https://dev.systemapic.com$ENDPOINT | python -mjson.tool