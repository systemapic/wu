#!/bin/bash


if [ "$1" == "" ]; then
	echo "Must provide file_id as first argument,"
	echo ""
	exit 1 # missing args
fi


# access token
USERNAME=foudroyant4@gmail.com
PASSWORD=lokapassord99
ACCESSTOKEN=$(curl --header "Authorization: Basic YWJjMTIzOnNzaC1zZWNyZXQ=" --data "grant_type=password&username=$USERNAME&password=$PASSWORD&scope=offline_access" https://dev.systemapic.com/oauth/token -s | jq -r '.access_token')

# api endpoint 
ENDPOINT=/api/db/createLayer
API="https://dev.systemapic.com$ENDPOINT"

# vars
FILEID=$1

set -f
# add access_token to layer.json
jq '.access_token="'$ACCESSTOKEN'"' layer.json > tmp.json

# add file_id to layer.json
jq '.file_id="'$FILEID'"' tmp.json > tmp2.json

# add SQL to layer.json
jq '.sql="(SELECT * FROM '$FILEID' WHERE roadtype = street) as sub"' tmp2.json > layer.json

# remove tmp.json
rm tmp.json
rm tmp2.json

curl -s -H "Content-Type: application/json" -X POST -d @layer.json $API | python -mjson.tool