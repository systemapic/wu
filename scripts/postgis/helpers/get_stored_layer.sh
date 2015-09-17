#!/bin/bash


if [ "$1" == "" ]; then
	echo "Must provide layerUuid as first argument,"
	echo "eg. get_store_layer.sh layer-925714fc-b82b-4788-aaa7-c3daa3dc2887"
	echo ""
	exit 1 # missing args
fi

# access token
USERNAME=foudroyant4@gmail.com
PASSWORD=lokapassord99
ACCESSTOKEN=$(curl --header "Authorization: Basic YWJjMTIzOnNzaC1zZWNyZXQ=" --data "grant_type=password&username=$USERNAME&password=$PASSWORD&scope=offline_access" https://dev.systemapic.com/oauth/token -s | jq -r '.access_token')

# api endpoint 
UPLOAD_ID=$1
ENDPOINT=/api/db/getLayer
ENDPOINT=/tiles
API="https://dev.systemapic.com$ENDPOINT?layerUuid=$1&access_token=$ACCESSTOKEN"

curl -s -X GET $API | python -mjson.tool