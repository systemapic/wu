#!/bin/bash

# access token
USERNAME=foudroyant4@gmail.com
PASSWORD=lokapassord99
ACCESSTOKEN=$(curl --header "Authorization: Basic YWJjMTIzOnNzaC1zZWNyZXQ=" --data "grant_type=password&username=$USERNAME&password=$PASSWORD&scope=offline_access" https://dev.systemapic.com/oauth/token -s | jq -r '.access_token')

# api endpoint 
ENDPOINT=/api/import
API=https://dev.systemapic.com$ENDPOINT

# file
# FILE=/home/DATA/geojson/file-12906f95-12a8-40bf-8e83-5a2c8a47f347.geojson
# FILE=/data/files/file-d723ea6c-1b77-4d03-bec6-fce947b72a30/Africa_SHP.zip
# FILE=/var/www/vile/tests/rasters/ecw/geodata/raster/ecw/valencia2002/valencia2002.ecw
# FILE=/data/files/file-766618f0-5cf2-4913-88b4-8e6a0e476d58/road.tar.gz
# FILE=/docks/postgis/data/cetin3/cetin3_SBAS_6x5_22d-sbas-direct_UTM38N.zip
FILE=/home/trashtest/cadastral.zip
# FILE=/var/www/vile/tests/rasters/ecw/geodata/raster/ecw/valencia2002/valencia2002.ecw
# FILE=/var/www/wu/tests/MOS_CZ_KR_250.tif
# FILE=/home/trashtest/combined.zip
# FILE=/home/trashtest/halfcombined.zip
# FILE=/var/lib/docker/vfs/dir/ad71dea6d61ad2564dd0c7da4a3a3f8455f03e421d630bad493e875b8f1bf23b/files/file-b0309df9-e550-4f2f-a419-b87da6d7f6b7/TerraColor_SanFrancisco_US_15m.jp2
# FILE=/home/old_postgis_docker/data/cetin3/cetin3_SBAS_6x5_22d-sbas-direct_UTM38N.zip
# FILE=/var/www/wu/scripts/postgis/helpers/tests/world_merc.zip


# curl the endpoint
curl -s --form "userUuid=loka" --form "meta=feta" --form "data=@$FILE" --header "Authorization: Bearer $ACCESSTOKEN" $API #| python -mjson.tool